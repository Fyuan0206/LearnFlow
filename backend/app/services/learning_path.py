from pydantic import BaseModel

from app.schemas.research import KnowledgeCard, LearningStep, ResearchRequest
from app.services.llm_client import llm_client
from app.data import mock_research


_SYSTEM_PROMPT = """你是一位面向开发者的 AI 学习规划助手。
请根据用户输入的学习主题、当前水平和可投入时间，生成一条分阶段学习路径。
每个阶段需要包含：阶段序号、阶段名称、学习目标、预计耗时（小时）、推荐资源、阶段任务。
请严格按照 JSON Schema 返回，不要输出 Markdown。"""


class _LearningPath(BaseModel):
    learningPath: list[LearningStep]


async def generate_path(
    request: ResearchRequest, cards: list[KnowledgeCard]
) -> list[LearningStep]:
    card_text = "\n".join(
        f"- {c.title}（{c.difficulty}）: {c.summary}"
        for c in cards
    )
    user_prompt = (
        f"用户输入：{request.query}\n"
        f"用户水平：{request.userLevel}\n"
        f"可投入时间：{request.timeBudgetHours} 小时\n\n"
        f"已提炼的知识卡片：\n{card_text}\n\n"
        f"请生成不超过 {request.timeBudgetHours // 2 + 1} 个阶段的学习路径，总耗时尽量接近 {request.timeBudgetHours} 小时。"
    )

    result = await llm_client.generate_structured(
        _SYSTEM_PROMPT,
        user_prompt,
        _LearningPath,
    )

    if result is None or not result.learningPath:
        return mock_research.get_learning_path(request.query)

    # Normalize level ordering.
    for idx, step in enumerate(result.learningPath, start=1):
        step.level = idx
    return result.learningPath
