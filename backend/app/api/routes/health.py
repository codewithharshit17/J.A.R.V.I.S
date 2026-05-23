from fastapi import APIRouter
from app.core.settings import settings

router = APIRouter()

@router.get("/")
async def health_check():
    return {
        "success": True,
        "message": f"{settings.APP_NAME} backend running",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION
    }