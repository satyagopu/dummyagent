from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from app.api import auth, workflows
from app.db.database import create_tables

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AgentWeave API",
    description="AI Workflow Automation Platform",
    version="0.3.0"  # Updated for Phase 3
)

# Get allowed origins from environment
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    """Create database tables on application startup"""
    create_tables()


# Include routers
app.include_router(auth.router)
app.include_router(workflows.router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Welcome to AgentWeave API! 🤖",
        "version": "0.3.0",
        "status": "Phase 3 - Modern UI & Canvas Foundation",
        "api_version": "v1",
        "endpoints": {
            "health": "/health",
            "auth": "/auth",
            "workflows": "/workflows",
            "docs": "/docs",
            "openapi": "/openapi.json"
        }
    }


@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "database": "connected"
    }

