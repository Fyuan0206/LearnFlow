from fastapi import APIRouter, Path, HTTPException
from app.schemas.research import FavoriteResponse
from app.models.database import toggle_card_favorite

router = APIRouter()


@router.post("/api/cards/{card_id}/favorite", response_model=FavoriteResponse)
async def favorite_card(card_id: str = Path(...)) -> FavoriteResponse:
    favorite = await toggle_card_favorite(card_id)
    return FavoriteResponse(ok=True, cardId=card_id, favorite=favorite)
