from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    accuracy = Column(Float)
    last_checked = Column(DateTime, default=datetime.utcnow)
    predictions = relationship("Prediction", back_populates="site")

class ReportedSite(Base):
    __tablename__ = "reported_sites"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    attention_required = Column(Boolean, default=False)
    last_report = Column(DateTime, default=datetime.utcnow)

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    site_id = Column(Integer, ForeignKey("reported_sites.id"))
    vote_type = Column(String)  # 'upvote' or 'downvote'
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="votes")
    site = relationship("ReportedSite", back_populates="votes")

User.votes = relationship("Vote", back_populates="user")
ReportedSite.votes = relationship("Vote", back_populates="site")

class ModelType(enum.Enum):
    PIPELINE = "pipeline"
    SIMPLE = "simple"
    IMAGE = "image"

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"))
    model_type = Column(Enum(ModelType))
    prediction = Column(String)
    probability = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

    site = relationship("Site", back_populates="predictions")