# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

- `PRD-个人知识与效率协作中枢.md` — product requirements
- `CLAUDE.md` — this file
- `backend/` — implemented FastAPI backend with SQLite persistence, LLM client, and agent modules
- `frontend/` — empty skeleton; not yet implemented

## Product overview

Product name: 个人知识与效率协作中枢 (Personal Knowledge & Productivity Collaboration Hub)

A hackathon MVP for an AI-powered learning companion. A user enters a technical topic (for example, "我要学 MCP") and the system returns recommended sources, structured knowledge cards, a concept graph, a staged learning path, and actionable tasks with a daily plan.

Core flow:

```text
输入主题/链接/RSS
  -> 内容发现与抓取
  -> AI 摘要与知识融合
  -> 知识卡片与知识图谱
  -> 学习路径与项目建议
  -> 行动任务与日程计划
```

The PRD is at `PRD-个人知识与效率协作中枢.md`.

## Recommended tech stack

The PRD recommends:

| Layer | Technology |
| --- | --- |
| Frontend | React + Vite + TypeScript |
| UI | Tailwind CSS + shadcn/ui + lucide-react |
| Graph | React Flow or ECharts |
| State | React Query + useState / Zustand |
| Backend | Python FastAPI |
| AI | OpenAI / 智谱 / 通义 / DeepSeek |
| Storage | SQLite or in-memory mock |
| API docs | FastAPI Swagger |
| Local run | Vite dev server + Uvicorn |

Alternative if the team prefers Node: Next.js or React + Vite frontend, NestJS/Express backend, Prisma + SQLite.

## API contract (from the PRD)

The main endpoint is `POST /api/research`.

Request:

```json
{
  "query": "我要学 MCP",
  "mode": "topic",
  "userLevel": "beginner",
  "timeBudgetHours": 6
}
```

Response shape:

```json
{
  "topic": "MCP",
  "brief": {
    "oneLineSummary": "...",
    "whyLearn": "...",
    "keyTakeaways": ["..."],
    "estimatedTime": "6 小时",
    "nextAction": "..."
  },
  "sources": [...],
  "cards": [...],
  "graph": { "nodes": [...], "edges": [...] },
  "learningPath": [...],
  "tasks": [...]
}
```

Other endpoints specified:

- `GET /api/health` — health check
- `GET /api/research/history` — recent research sessions
- `POST /api/cards/:id/favorite` — favorite a knowledge card
- `PATCH /api/tasks/:id` — update task status (`todo` / `doing` / `done`)

A full mock response example is included in section 18 of the PRD and should be used as the shared contract during frontend/backend parallel development.

## Data model (from the PRD)

MVP storage should be SQLite or in-memory. The PRD defines these tables/entities:

- `research_sessions` — query, recognized topic, mode, user level, created time
- `sources` — title, url, source platform, type, summary, quality score, reading time
- `knowledge_cards` — title, summary, bullets, tags, difficulty, related concepts, source ids, favorite flag
- `learning_steps` — level, title, goal, estimated hours, resources
- `tasks` — title, description, estimated minutes, priority, status, source card id

## Backend layout (implemented)

```text
backend/
├── requirements.txt
├── .env.example
├── README.md
└── app/
    ├── main.py
    ├── config.py
    ├── routers/
    │   ├── health.py
    │   ├── research.py
    │   ├── cards.py
    │   └── tasks.py
    ├── schemas/
    │   └── research.py
    ├── models/
    │   └── database.py
    ├── services/
    │   ├── orchestrator.py
    │   ├── llm_client.py
    │   ├── content_discovery.py
    │   ├── content_parser.py
    │   ├── knowledge_card.py
    │   ├── knowledge_graph.py
    │   ├── learning_path.py
    │   └── task_extraction.py
    └── data/
        └── mock_research.py
```

## Backend commands

Run from `backend/`:

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Test endpoints:

```bash
curl http://localhost:8000/api/health

curl -X POST http://localhost:8000/api/research \
  -H "Content-Type: application/json" \
  -d '{"query":"我要学 MCP","mode":"topic","userLevel":"beginner","timeBudgetHours":6}'
```

Swagger UI: http://localhost:8000/docs

## LLM configuration

The backend uses any OpenAI-compatible API endpoint. Copy `backend/.env.example` to `backend/.env` and set `LLM_API_KEY`. The default example points to StepFun (`https://api.stepfun.com/v1`) with model `step-1-8k`. If `LLM_API_KEY` is empty, the system returns keyword-based mock data so the demo still works.

## Frontend layout (when implemented)

```text
frontend/src/
  api/research.ts
  components/TopicInput.tsx
  components/BriefPanel.tsx
  components/SourceList.tsx
  components/KnowledgeCardList.tsx
  components/KnowledgeGraph.tsx
  components/LearningPath.tsx
  components/ActionPlan.tsx
  mocks/researchResult.ts
  types/research.ts
  App.tsx
```

## Frontend commands (when implemented)

Run from `frontend/`:

```bash
npm install
npm run dev
```

## Key implementation constraints

- The MVP target is a demonstrable web demo built in about 4 hours. Prioritize P0 features over P1/P2.
- LLM calls must have a mock fallback so the demo works even if the model API fails or is missing.
- The frontend and backend should first agree on the `/api/research` response shape and use the same mock JSON.
- CORS must be enabled on the backend for local frontend development.
- Every major UI module needs loading, empty, error, and success states.

## Notes

- If Cursor rules or Copilot instructions are added later, merge their relevant parts into this file.
- The backend database file is `backend/hub.db` (SQLite). Delete it to reset all data.
