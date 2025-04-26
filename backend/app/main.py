"""
Main FastAPI application file for BoaServer.
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()

# Initialize FastAPI app
app = FastAPI(
    title="BoaServer",
    description="AI-Powered Oncall Support Assistant",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
# This will be uncommented when the api module is created
# from app.api.router import router as api_router
# app.include_router(api_router, prefix="/api")

@app.get("/health")
async def health_check() -> dict:
    """Simple health check endpoint."""
    return {"status": "healthy", "version": "0.1.0"}

# Startup event
@app.on_event("startup")
async def startup_event() -> None:
    """Execute actions on application startup."""
    logger.info("BoaServer starting up...")
    
# Shutdown event
@app.on_event("shutdown")
async def shutdown_event() -> None:
    """Execute actions on application shutdown."""
    logger.info("BoaServer shutting down...")
