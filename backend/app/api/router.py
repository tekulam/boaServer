"""
Main API router for BoaServer.
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/info")
async def get_info() -> dict:
    """Get basic API information."""
    return {
        "name": "BoaServer API",
        "version": "0.1.0",
        "description": "AI-Powered Oncall Support Assistant"
    }

# Import and include additional routers here as they are created
# from app.api.routes.chat import router as chat_router
# router.include_router(chat_router, prefix="/chat", tags=["chat"])
