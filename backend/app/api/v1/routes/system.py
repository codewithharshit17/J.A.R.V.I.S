from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1/system",
    tags=["System"]
)

@router.get("/status")
async def system_status():
    return {
        "status": "online",
        "system": "J.A.R.V.I.S",
        "version": "1.0.0"
    }