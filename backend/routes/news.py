from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import joblib
import numpy as np
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
from PIL import Image
import io
import os
import google.generativeai as genai
from database import SessionLocal
from models import Site, Prediction, ModelType
from typing import Optional

router = APIRouter()

# Load models and vectorizer
pipeline = joblib.load('models/fake_news_pipeline.joblib')
simple_model = joblib.load('models/fake_news_model.joblib')
tfidf_vectorizer = joblib.load('models/tfidf_vectorizer.joblib')

# Gemini API setup
api_key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=api_key)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class NewsItem(BaseModel):
    title: str
    text: str
    subject: str
    date: str

class AutoNewsItem(BaseModel):
    text: str
    url: str


class SimpleNewsItem(BaseModel):
    text: str

@router.post("/predict/simple/free")
async def predict_fake_news_simple_free(news_item: SimpleNewsItem):
    try:
        text_tfidf = tfidf_vectorizer.transform([news_item.text])
        
        prediction = simple_model.predict(text_tfidf)[0]
        probability = np.max(simple_model.predict_proba(text_tfidf))
        
        return {
            "prediction": "fake" if prediction == 0 else "real",
            "probability": float(probability)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# @router.post("/predict/image")
# async def predict_image(image: UploadFile = File(...), url: str, db: Session = Depends(get_db)):
#     try:
#         contents = await image.read()
#         img = Image.open(io.BytesIO(contents))
        
#         media_path = "tmp/uploaded_image.jpg"
#         img.save(media_path)

#         with open(media_path, 'rb') as image_file:
#             myfile = genai.upload_file(image_file, mime_type="image/jpeg")
#             file_name = myfile.name

#         model = genai.GenerativeModel("gemini-1.5-flash")
#         response = model.generate_content(
#             [myfile, "\n\n", "Can you tell me about the events happening in this image?"]
#         )

#         generated_text = response.text

#         text_tfidf = tfidf_vectorizer.transform([generated_text])
#         prediction = simple_model.predict(text_tfidf)[0]
#         probability = np.max(simple_model.predict_proba(text_tfidf))

#         site = db.query(Site).filter(Site.url == url).first()
#         if not site:
#             site = Site(url=url)
#             db.add(site)
#             db.commit()
#             db.refresh(site)

#         new_prediction = Prediction(
#             site_id=site.id,
#             model_type=ModelType.IMAGE,
#             prediction="fake" if prediction == 0 else "real",
#             probability=float(probability)
#         )
#         db.add(new_prediction)
#         db.commit()

#         return {
#             "generated_text": generated_text,
#             "prediction": "fake" if prediction == 0 else "real",
#             "probability": float(probability)
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/pipeline")
async def predict_fake_news_pipeline(news_item: NewsItem):
    try:
        reference_date = datetime(2000, 1, 1)
        news_date = datetime.strptime(news_item.date, "%Y-%m-%d")
        days_since_ref = (news_date - reference_date).days

        input_data = pd.DataFrame({
            'title': [news_item.title],
            'text': [news_item.text],
            'subject': [news_item.subject],
            'days_since_ref': [days_since_ref]
        })
        
        prediction = pipeline.predict(input_data)[0]
        probability = np.max(pipeline.predict_proba(input_data))

        return {
            "prediction": "fake" if prediction == 0 else "real",
            "probability": float(probability)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/simple")
async def predict_fake_news_simple(news_item: AutoNewsItem, db: Session = Depends(get_db)):
    try:
        text_tfidf = tfidf_vectorizer.transform([news_item.text])
        
        prediction = simple_model.predict(text_tfidf)[0]
        probability = np.max(simple_model.predict_proba(text_tfidf))
        
        site = db.query(Site).filter(Site.url == news_item.url).first()
        if not site:
            site = Site(url=news_item.url)
            db.add(site)
            db.commit()
            db.refresh(site)

        new_prediction = Prediction(
            site_id=site.id,
            model_type=ModelType.SIMPLE,
            prediction="fake" if prediction == 0 else "real",
            probability=float(probability)
        )
        db.add(new_prediction)
        db.commit()

        return {
            "prediction": "fake" if prediction == 0 else "real",
            "probability": float(probability)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))