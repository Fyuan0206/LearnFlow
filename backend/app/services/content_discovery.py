import os

import httpx

from app.schemas.research import Source
from app.data import mock_research


async def discover(query: str, mode: str = "topic") -> list[Source]:
    # MVP: keyword-based mock sources by default.
    # Optional: if TAVILY_API_KEY is present, call Tavily search and merge top results.
    tavily_key = os.getenv("TAVILY_API_KEY", "")
    if tavily_key:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(
                    "https://api.tavily.com/search",
                    headers={"Content-Type": "application/json"},
                    json={
                        "api_key": tavily_key,
                        "query": query,
                        "search_depth": "basic",
                        "max_results": 5,
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                results = data.get("results", [])
                sources = []
                for idx, item in enumerate(results, start=1):
                    sources.append(
                        Source(
                            id=f"source_{idx:03d}",
                            title=item.get("title", "Untitled"),
                            source=item.get("source", "Tavily"),
                            url=item.get("url", ""),
                            type="article",
                            qualityScore=75,
                            reason=item.get("content", "")[:80] + "...",
                            readingTime=10,
                        )
                    )
                if sources:
                    return sources
        except Exception:
            pass

    return mock_research.get_sources(query)
