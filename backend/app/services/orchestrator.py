import uuid
import copy

from app.schemas.research import ResearchRequest, ResearchResponse, Source, KnowledgeCard, TaskItem
from app.services import (
    content_discovery,
    content_parser,
    knowledge_card,
    knowledge_graph,
    learning_path,
    task_extraction,
)
from app.models.database import save_research_result
from app.data import mock_research


def _extract_topic(query: str) -> str:
    query = query.strip()
    for prefix in ("我要学", "我想学", "学习", "掌握", "了解", "如何", "怎么"):
        if query.startswith(prefix):
            query = query[len(prefix):]
    return query.strip().split("，")[0].split(",")[0].strip() or "技术主题"


def _scope_ids(session_id: str, sources: list[Source], cards: list[KnowledgeCard], tasks: list[TaskItem]) -> None:
    """Rewrite IDs to be unique per session and update cross-references."""
    source_id_map = {}
    for s in sources:
        old_id = s.id
        new_id = f"{session_id}_src_{old_id}"
        source_id_map[old_id] = new_id
        s.id = new_id

    card_id_map = {}
    for c in cards:
        old_id = c.id
        new_id = f"{session_id}_card_{old_id}"
        card_id_map[old_id] = new_id
        c.id = new_id
        c.sourceIds = [source_id_map.get(sid, sid) for sid in c.sourceIds]

    for t in tasks:
        t.id = f"{session_id}_task_{t.id}"
        t.source = card_id_map.get(t.source, t.source)


async def run_research(request: ResearchRequest) -> ResearchResponse:
    session_id = f"research_{uuid.uuid4().hex[:8]}"
    topic = _extract_topic(request.query)

    from app.config import settings
    if not settings.llm_api_key:
        response = mock_research.get_full_research(request.query)
        response = copy.deepcopy(response)
        response.topic = topic
        _scope_ids(session_id, response.sources, response.cards, response.tasks)
        await save_research_result(
            session_id=session_id,
            query=request.query,
            topic=response.topic,
            mode=request.mode,
            user_level=request.userLevel,
            sources=response.sources,
            cards=response.cards,
            learning_path=response.learningPath,
            tasks=response.tasks,
        )
        return response

    sources = await content_discovery.discover(request.query, request.mode)
    sources = await content_parser.parse(sources)
    brief, cards = await knowledge_card.generate_brief_and_cards(request, sources)
    graph = await knowledge_graph.generate_graph(request.query, cards)
    path = await learning_path.generate_path(request, cards)
    tasks = await task_extraction.generate_tasks(request, cards, path)

    _scope_ids(session_id, sources, cards, tasks)

    await save_research_result(
        session_id=session_id,
        query=request.query,
        topic=topic,
        mode=request.mode,
        user_level=request.userLevel,
        sources=sources,
        cards=cards,
        learning_path=path,
        tasks=tasks,
    )

    return ResearchResponse(
        topic=topic,
        brief=brief,
        sources=sources,
        cards=cards,
        graph=graph,
        learningPath=path,
        tasks=tasks,
    )
