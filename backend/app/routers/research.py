from fastapi import APIRouter
from datetime import datetime, timezone

from app.schemas.research import (
    HistoryResponse,
    HistoryItem,
    ResearchRequest,
    ResearchResponse,
)
from app.services.orchestrator import run_research
from app.models.database import get_recent_sessions

router = APIRouter()


@router.post("/api/research", response_model=ResearchResponse)
async def research(req: ResearchRequest) -> ResearchResponse:
    return await run_research(req)


@router.get("/api/research/history", response_model=HistoryResponse)
async def research_history(limit: int = 10) -> HistoryResponse:
    sessions = await get_recent_sessions(limit)
    items = [
        HistoryItem(
            id=s.id,
            topic=s.topic,
            createdAt=s.created_at.replace(tzinfo=timezone.utc).isoformat()
            if s.created_at
            else datetime.now(timezone.utc).isoformat(),
        )
        for s in sessions
    ]
    return HistoryResponse(items=items)
