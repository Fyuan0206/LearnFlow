from app.schemas.research import Source


async def parse(sources: list[Source]) -> list[Source]:
    # MVP stub: real URL fetching and text extraction would go here.
    # For the hackathon demo, we trust the summaries already present.
    return sources
