from pydantic import BaseModel

from app.schemas.research import Brief, KnowledgeCard, ResearchRequest, Source
from app.services.llm_client import llm_client
from app.data import mock_research


_SYSTEM_PROMPT = """你是一位面向开发者的 AI 知识研究助手。
请根据用户输入的学习主题，生成一份主题简报和若干知识卡片。
每个知识卡片需要包含：标题、摘要、3-5 个要点、标签、难度（入门/进阶/高阶）、相关概念、来源内容 ID。
请严格按照 JSON Schema 返回，不要输出 Markdown。"""


class _BriefAndCards(BaseModel):
    brief: Brief
    cards: list[KnowledgeCard]


async def generate_brief_and_cards(
    request: ResearchRequest, sources: list[Source]
) -> tuple[Brief, list[KnowledgeCard]]:
    source_text = "\n".join(
        f"- {s.id}: {s.title} ({s.source})\n  {s.reason}"
        for s in sources
    )
    user_prompt = (
        f"用户输入：{request.query}\n"
        f"用户水平：{request.userLevel}\n"
        f"可投入时间：{request.timeBudgetHours} 小时\n\n"
        f"推荐来源：\n{source_text}\n\n"
        "请生成主题简报和 5 张知识卡片。"
    )

    result = await llm_client.generate_structured(
        _SYSTEM_PROMPT,
        user_prompt,
        _BriefAndCards,
    )

    if result is None:
        return mock_research.get_brief_and_cards(request.query)

    # Ensure sourceIds reference existing sources where possible.
    source_ids = {s.id for s in sources}
    for card in result.cards:
        if not card.sourceIds or not any(sid in source_ids for sid in card.sourceIds):
            card.sourceIds = [sources[0].id] if sources else ["source_001"]
    return result.brief, result.cards
