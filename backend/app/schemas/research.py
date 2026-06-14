from pydantic import BaseModel, Field
from typing import Literal


class ResearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    mode: Literal["topic", "url", "rss"] = "topic"
    userLevel: Literal["beginner", "intermediate", "advanced"] = "beginner"
    timeBudgetHours: int = Field(default=6, ge=1, le=100)


class Brief(BaseModel):
    oneLineSummary: str
    whyLearn: str
    keyTakeaways: list[str]
    estimatedTime: str
    nextAction: str


class Source(BaseModel):
    id: str
    title: str
    source: str
    url: str
    type: Literal["article", "repo", "video", "docs"]
    qualityScore: int = Field(ge=0, le=100)
    reason: str
    readingTime: int


class KnowledgeCard(BaseModel):
    id: str
    title: str
    summary: str
    bullets: list[str]
    tags: list[str]
    difficulty: Literal["入门", "进阶", "高阶"]
    relatedConcepts: list[str]
    sourceIds: list[str]
    favorite: bool = False


class GraphNode(BaseModel):
    id: str
    label: str
    type: Literal["topic", "concept", "tool", "practice", "prerequisite"]


class GraphEdge(BaseModel):
    source: str
    target: str
    label: str


class Graph(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]


class LearningStep(BaseModel):
    level: int
    title: str
    goal: str
    estimatedHours: int
    resources: list[str]
    tasks: list[str]


class TaskItem(BaseModel):
    id: str
    title: str
    description: str
    estimatedMinutes: int
    priority: Literal["high", "medium", "low"]
    source: str
    status: Literal["todo", "doing", "done"] = "todo"


class ResearchResponse(BaseModel):
    topic: str
    brief: Brief
    sources: list[Source]
    cards: list[KnowledgeCard]
    graph: Graph
    learningPath: list[LearningStep]
    tasks: list[TaskItem]


class HealthResponse(BaseModel):
    ok: bool
    service: str


class HistoryItem(BaseModel):
    id: str
    topic: str
    createdAt: str


class HistoryResponse(BaseModel):
    items: list[HistoryItem]


class FavoriteResponse(BaseModel):
    ok: bool
    cardId: str
    favorite: bool


class TaskUpdateRequest(BaseModel):
    status: Literal["todo", "doing", "done"]


class TaskUpdateResponse(BaseModel):
    ok: bool
    taskId: str
    status: str
