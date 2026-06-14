from fastapi import APIRouter
from app.schemas.research import HealthResponse

router = APIRouter()


@router.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(ok=True, service="knowledge-productivity-hub")
