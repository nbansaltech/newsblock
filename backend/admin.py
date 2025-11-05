from fastapi import APIRouter, Depends, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Site, ReportedSite, Prediction  # Import Prediction model
from typing import List

router = APIRouter()
templates = Jinja2Templates(directory="templates")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/admin")
async def admin_dashboard(request: Request, db: Session = Depends(get_db)):
    sites = db.query(Site).all()
    reported_sites = db.query(ReportedSite).all()
    predictions = db.query(Prediction).all()  # Query prediction data
    return templates.TemplateResponse("admin_dashboard.html", {
        "request": request,
        "sites": sites,
        "reported_sites": reported_sites,
        "predictions": predictions  # Pass predictions to the template
    })


@router.post("/admin/mark_attention")
async def mark_attention(site_id: int = Form(...), attention_required: bool = Form(...), db: Session = Depends(get_db)):
    site = db.query(ReportedSite).filter(ReportedSite.id == site_id).first()
    if site:
        site.attention_required = attention_required
        db.commit()
        return JSONResponse(content={"success": True})
    return JSONResponse(content={"success": False})