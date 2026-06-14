from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, Boolean, Text, JSON

Base = declarative_base()
engine = create_async_engine("sqlite+aiosqlite:///./hub.db", echo=False)
async_session = async_sessionmaker(engine, expire_on_commit=False)


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class ResearchSession(Base):
    __tablename__ = "research_sessions"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    query: Mapped[str] = mapped_column(Text)
    topic: Mapped[str] = mapped_column(String)
    mode: Mapped[str] = mapped_column(String)
    user_level: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=now_utc)


class SourceRecord(Base):
    __tablename__ = "sources"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    session_id: Mapped[str] = mapped_column(String)
    title: Mapped[str] = mapped_column(String)
    url: Mapped[str] = mapped_column(String)
    source: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String)
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    quality_score: Mapped[int] = mapped_column(Integer)
    reading_time: Mapped[int] = mapped_column(Integer)


class KnowledgeCardRecord(Base):
    __tablename__ = "knowledge_cards"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    session_id: Mapped[str] = mapped_column(String)
    title: Mapped[str] = mapped_column(String)
    summary: Mapped[str] = mapped_column(Text)
    bullets: Mapped[list] = mapped_column(JSON)
    tags: Mapped[list] = mapped_column(JSON)
    difficulty: Mapped[str] = mapped_column(String)
    related_concepts: Mapped[list] = mapped_column(JSON)
    source_ids: Mapped[list] = mapped_column(JSON)
    favorite: Mapped[bool] = mapped_column(Boolean, default=False)


class LearningStepRecord(Base):
    __tablename__ = "learning_steps"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    session_id: Mapped[str] = mapped_column(String)
    level: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String)
    goal: Mapped[str] = mapped_column(Text)
    estimated_hours: Mapped[int] = mapped_column(Integer)
    resources: Mapped[list] = mapped_column(JSON)
    tasks: Mapped[list] = mapped_column(JSON)


class TaskRecord(Base):
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    session_id: Mapped[str] = mapped_column(String)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text)
    estimated_minutes: Mapped[int] = mapped_column(Integer)
    priority: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="todo")
    source_card_id: Mapped[str] = mapped_column(String, nullable=True)


async def save_research_result(
    session_id: str,
    query: str,
    topic: str,
    mode: str,
    user_level: str,
    sources: list,
    cards: list,
    learning_path: list,
    tasks: list,
) -> None:
    async with async_session() as db:
        db.add(
            ResearchSession(
                id=session_id,
                query=query,
                topic=topic,
                mode=mode,
                user_level=user_level,
            )
        )
        for s in sources:
            db.add(
                SourceRecord(
                    id=s.id,
                    session_id=session_id,
                    title=s.title,
                    url=s.url,
                    source=s.source,
                    type=s.type,
                    summary=getattr(s, "summary", None),
                    quality_score=s.qualityScore,
                    reading_time=s.readingTime,
                )
            )
        for c in cards:
            db.add(
                KnowledgeCardRecord(
                    id=c.id,
                    session_id=session_id,
                    title=c.title,
                    summary=c.summary,
                    bullets=c.bullets,
                    tags=c.tags,
                    difficulty=c.difficulty,
                    related_concepts=c.relatedConcepts,
                    source_ids=c.sourceIds,
                    favorite=c.favorite,
                )
            )
        for idx, step in enumerate(learning_path, start=1):
            db.add(
                LearningStepRecord(
                    id=f"{session_id}_step_{idx}",
                    session_id=session_id,
                    level=step.level,
                    title=step.title,
                    goal=step.goal,
                    estimated_hours=step.estimatedHours,
                    resources=step.resources,
                    tasks=step.tasks,
                )
            )
        for t in tasks:
            db.add(
                TaskRecord(
                    id=t.id,
                    session_id=session_id,
                    title=t.title,
                    description=t.description,
                    estimated_minutes=t.estimatedMinutes,
                    priority=t.priority,
                    status=t.status,
                    source_card_id=t.source,
                )
            )
        await db.commit()


async def get_recent_sessions(limit: int = 10) -> list[ResearchSession]:
    async with async_session() as db:
        result = await db.execute(
            select(ResearchSession).order_by(ResearchSession.created_at.desc()).limit(limit)
        )
        return result.scalars().all()


async def toggle_card_favorite(card_id: str) -> bool:
    async with async_session() as db:
        result = await db.execute(
            select(KnowledgeCardRecord).where(KnowledgeCardRecord.id == card_id)
        )
        card = result.scalar_one_or_none()
        if card is None:
            return False
        card.favorite = not card.favorite
        await db.commit()
        return card.favorite


async def update_task_status(task_id: str, status: str) -> bool:
    async with async_session() as db:
        result = await db.execute(select(TaskRecord).where(TaskRecord.id == task_id))
        task = result.scalar_one_or_none()
        if task is None:
            return False
        task.status = status
        await db.commit()
        return True
