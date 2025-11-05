from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import news, sites, auth
from admin import router as admin_router
from database import engine, Base

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Create a simple welcome route at /
@app.get("/")
async def welcome():
    return {"message": "Welcome to TrustLens dear"}

# Include routers
app.include_router(news.router)
app.include_router(sites.router)
app.include_router(auth.router)
app.include_router(admin_router)