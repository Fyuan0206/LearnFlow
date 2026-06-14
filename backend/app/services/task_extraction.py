from pydantic import BaseModel

from app.schemas.research import KnowledgeCard, LearningStep, ResearchRequest, TaskItem
from app.services.llm_client import llm_client
from app.data import mock_research


_SYSTEM_PROMPT = """你是一位面向开发者的 AI 行动规划助手。
请根据用户输入的学习主题、知识卡片和学习路径，提取出可执行的任务。
每个任务需要包含：ID、标题、说明、预计耗时（分钟）、优先级（high/medium/low）、来源卡片 ID、状态（默认 todo）。
请严格按照 JSON Schema 返回，不要输出 Markdown。"""


class _Tasks(BaseModel):
    tasks: list[TaskItem]


async def generate_tasks(
    request: ResearchRequest,
    cards: list[KnowledgeCard],
    learning_path: list[LearningStep],
) -> list[TaskItem]:
    card_text = "\n".join(
        f"- {c.id}: {c.title}（{c.difficulty}）"
        for c in cards
    )
    path_text = "\n".join(
        f"- 阶段 {s.level}: {s.title} - {s.goal}"
        for s in learning_path
    )
    user_prompt = (
        f"用户输入：{request.query}\n"
        f"可投入时间：{request.timeBudgetHours} 小时\n\n"
        f"知识卡片：\n{card_text}\n\n"
        f"学习路径：\n{path_text}\n\n"
        "请提取 3-6 个可执行的具体任务，优先选择能在今天内开始的任务。"
    )

    result = await llm_client.generate_structured(
        _SYSTEM_PROMPT,
        user_prompt,
        _Tasks,
    )

    if result is None or not result.tasks:
        return mock_research.get_tasks(request.query)

    # Ensure task IDs are unique and statuses default correctly.
    seen = set()
    unique_tasks = []
    for task in result.tasks:
        if task.id not in seen:
            seen.add(task.id)
            unique_tasks.append(task)
    return unique_tasks
