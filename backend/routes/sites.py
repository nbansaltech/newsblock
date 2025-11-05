from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Site, ReportedSite, Vote, Prediction
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List
import enum

# Enum for model type in Predictions
class ModelType(enum.Enum):
    PIPELINE = "pipeline"
    SIMPLE = "simple"
    IMAGE = "image"

router = APIRouter()

# Pydantic model for vote requests
class VoteRequest(BaseModel):
    url: str
    user_id: int

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/report_site/")
async def report_site(url: str, db: Session = Depends(get_db)):
    site = db.query(ReportedSite).filter(ReportedSite.url == url).first()
    if site:
        raise HTTPException(status_code=400, detail="Site already reported")
    new_site = ReportedSite(url=url)
    db.add(new_site)
    db.commit()
    return {"message": "Site reported successfully"}

@router.post("/upvote/")
async def upvote_site(vote: VoteRequest, db: Session = Depends(get_db)):
    site = db.query(ReportedSite).filter(ReportedSite.url == vote.url).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    
    # Check if user has already voted
    existing_vote = db.query(Vote).filter(Vote.user_id == vote.user_id, Vote.site_id == site.id).first()
    if existing_vote:
        raise HTTPException(status_code=400, detail="User has already voted")
    
    # Add new upvote
    new_vote = Vote(user_id=vote.user_id, site_id=site.id, vote_type="upvote")
    db.add(new_vote)
    site.upvotes += 1
    site.last_report = datetime.utcnow()
    
    # Check for attention required (based on recent votes)
    recent_votes = db.query(Vote).filter(
        Vote.site_id == site.id, 
        Vote.timestamp > datetime.utcnow() - timedelta(hours=24)
    ).count()
    
    if recent_votes > 10:
        site.attention_required = True
    
    db.commit()
    return {"upvotes": site.upvotes, "downvotes": site.downvotes}


@router.post("/downvote/")
async def downvote_site(vote: VoteRequest, db: Session = Depends(get_db)):
    site = db.query(ReportedSite).filter(ReportedSite.url == vote.url).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    
    # Check if user has already voted
    existing_vote = db.query(Vote).filter(Vote.user_id == vote.user_id, Vote.site_id == site.id).first()
    if existing_vote:
        raise HTTPException(status_code=400, detail="User has already voted")
    
    # Add new downvote
    new_vote = Vote(user_id=vote.user_id, site_id=site.id, vote_type="downvote")
    db.add(new_vote)
    site.downvotes += 1
    site.last_report = datetime.utcnow()
    
    # Check for attention required (based on recent votes)
    recent_votes = db.query(Vote).filter(
        Vote.site_id == site.id, 
        Vote.timestamp > datetime.utcnow() - timedelta(hours=24)
    ).count()
    
    if recent_votes > 10:
        site.attention_required = True
    
    db.commit()
    return {"upvotes": site.upvotes, "downvotes": site.downvotes}

@router.get("/check_site/")
async def check_site(url: str, db: Session = Depends(get_db)):
    # Ensure the site is added to the database if it doesn't exist
    add_site_to_db(url, db)

    # Fetch the site from the ReportedSite table
    site = db.query(ReportedSite).filter(ReportedSite.url == url).first()

    if not site:
        return {"upvotes": 0, "downvotes": 0, "message": "No reports yet"}

    return {"upvotes": site.upvotes, "downvotes": site.downvotes}

# Helper function to add site to the Site and ReportedSite tables if not present
def add_site_to_db(url: str, db: Session):
    # Check if the site is already in the 'Site' table
    existing_site = db.query(Site).filter(Site.url == url).first()
    if not existing_site:
        # Add a new entry with default accuracy
        new_site = Site(url=url, accuracy=None, last_checked=datetime.utcnow())
        db.add(new_site)

    # Check if the site is already in the 'ReportedSite' table
    reported_site = db.query(ReportedSite).filter(ReportedSite.url == url).first()
    if not reported_site:
        # Add a new entry with default upvotes and downvotes
        new_reported_site = ReportedSite(url=url, upvotes=0, downvotes=0, attention_required=False, last_report=datetime.utcnow())
        db.add(new_reported_site)

    # Commit to the database
    db.commit()

@router.get("/site_accuracy/")
async def site_accuracy(url: str, db: Session = Depends(get_db)):
    site = db.query(Site).filter(Site.url == url).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return {"url": site.url, "accuracy": site.accuracy, "last_checked": site.last_checked.isoformat()}

# Models for response
class PredictionResponse(BaseModel):
    model_type: str
    prediction: str
    probability: float

class ReportedSiteResponse(BaseModel):
    id: int
    url: str
    upvotes: int
    downvotes: int
    attention_required: bool
    last_report: str
    predictions: List[PredictionResponse]

# Get all reported sites
@router.get("/reported-sites", response_model=List[ReportedSiteResponse])
def get_reported_sites(db: Session = Depends(get_db)):
    sites = db.query(ReportedSite).all()
    response_sites = []
    
    for site in sites:
        associated_site = db.query(Site).filter(Site.url == site.url).first()
        predictions = db.query(Prediction).filter(Prediction.site_id == associated_site.id).all() if associated_site else []
        
        response_sites.append({
            "id": site.id,
            "url": site.url,
            "upvotes": site.upvotes,
            "downvotes": site.downvotes,
            "attention_required": site.attention_required,
            "last_report": site.last_report.isoformat(),
            "predictions": [
                {
                    "model_type": pred.model_type.value,
                    "prediction": pred.prediction,
                    "probability": pred.probability
                } for pred in predictions
            ]
        })
    
    return response_sites

# Get details for a specific reported site by ID
@router.get("/reported-sites/{site_id}", response_model=ReportedSiteResponse)
def get_reported_site_details(site_id: int, db: Session = Depends(get_db)):
    site = db.query(ReportedSite).filter(ReportedSite.id == site_id).first()
    if site is None:
        raise HTTPException(status_code=404, detail="Site not found")
    
    # Fetch associated Site and Predictions
    associated_site = db.query(Site).filter(Site.url == site.url).first()
    predictions = db.query(Prediction).filter(Prediction.site_id == associated_site.id).all() if associated_site else []
    
    return {
        "id": site.id,
        "url": site.url,
        "upvotes": site.upvotes,
        "downvotes": site.downvotes,
        "attention_required": site.attention_required,
        "last_report": site.last_report.isoformat(),
        "predictions": [
            {
                "model_type": pred.model_type.value,
                "prediction": pred.prediction,
                "probability": pred.probability
            } for pred in predictions
        ]
    }
