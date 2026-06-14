# 个人知识与效率协作中枢 PRD

## 1. 项目概述

### 1.1 产品名称

个人知识与效率协作中枢

### 1.2 一句话介绍

面向开发者、技术学习者和内容创作者的 AI 知识行动中枢：输入一个学习主题或内容链接，系统自动聚合资料、提炼知识卡片、生成知识图谱、规划学习路径，并把可执行事项转化为待办计划。

### 1.3 产品定位

本产品不是普通的信息收藏夹，也不是单篇文章摘要工具，而是一个从“发现内容”到“形成知识”再到“驱动行动”的闭环系统。

核心闭环：

```text
输入主题/链接/RSS
  -> 内容发现与抓取
  -> AI 摘要与知识融合
  -> 知识卡片与知识图谱
  -> 学习路径与项目建议
  -> 行动任务与日程计划
```

### 1.4 黑客松 MVP 目标

在 4 小时内完成一个可演示的 Web Demo，让评委能够看到：

1. 用户输入一个技术主题，例如“我要学 MCP”。
2. 系统生成推荐内容列表。
3. 系统输出 AI 知识全景图、知识卡片、学习路径。
4. 系统提取可执行任务，并展示今日计划。
5. 前端有完整产品体验，后端有可调用 API，前后端可独立开发后合并。

## 2. 背景与问题

### 2.1 目标用户

| 用户类型 | 典型场景 | 核心痛点 |
| --- | --- | --- |
| 开发者 | 学习新技术、调研框架、做项目实践 | 信息源分散，教程质量不一，学完不知道如何实践 |
| 技术爱好者 | 追踪 AI、Agent、MCP、开源项目等热点 | 收藏很多内容，但缺少结构化沉淀 |
| 内容创作者 | 写技术文章、做知识整理、输出教程 | 需要快速收集资料、梳理结构和提炼观点 |
| 学生/求职者 | 学习技术栈、准备项目、整理学习路径 | 不知道先学什么、怎么安排计划、如何转成项目 |

### 2.2 用户痛点

1. 信息过载：文章、视频、GitHub 项目、文档分散在不同平台。
2. 质量筛选难：用户需要花大量时间判断哪些内容值得读。
3. 学用脱节：看完资料后没有沉淀成自己的知识体系。
4. 行动转化低：收藏很多，真正完成实践任务很少。
5. 计划难落地：缺少从知识到任务、从任务到日程的自动转化。

### 2.3 产品机会

通过 AI Agent 编排，把“找资料、读资料、整理知识、生成任务、安排计划”做成一条自动化链路，让用户从输入一个主题开始，快速得到可学习、可理解、可执行的结果。

## 3. 产品目标与非目标

### 3.1 产品目标

1. 降低技术学习的信息收集成本。
2. 把长内容压缩成结构化知识卡片。
3. 把多个来源融合成一张知识全景图。
4. 生成可执行学习路径和项目建议。
5. 从内容中提取任务，帮助用户开始行动。

### 3.2 黑客松阶段非目标

以下能力不作为 4 小时 MVP 必须完成项：

1. 真实全网大规模爬虫。
2. 多用户账号体系和复杂权限。
3. 真实日历/Notion/飞书深度同步。
4. 完整 RAG 向量知识库。
5. 高精度个性化推荐模型。
6. 浏览器插件和移动端 App。

## 4. MVP 功能范围

### 4.1 MVP 功能优先级

| 优先级 | 模块 | 功能 | 说明 |
| --- | --- | --- | --- |
| P0 | 主题输入 | 输入学习主题、关键词或 URL | Demo 必须有 |
| P0 | 内容发现 | 返回模拟或真实搜索结果 | 可先用 mock 数据 |
| P0 | AI 知识融合 | 生成主题全景图 | 可调用大模型或使用后端模板 |
| P0 | 知识卡片 | 输出摘要、要点、标签、难度、阅读时长 | Demo 核心 |
| P0 | 学习路径 | 生成分阶段学习路线 | Demo 核心 |
| P0 | 行动任务 | 提取待办任务和今日计划 | Demo 核心 |
| P1 | 知识图谱 | 用节点图展示概念关系 | 前端可用静态图谱数据 |
| P1 | 收藏/标记 | 收藏卡片、标记已读、忽略 | 可本地状态实现 |
| P1 | 历史记录 | 展示最近查询主题 | 可 localStorage |
| P2 | RSS/URL 抓取 | 输入 RSS 或文章 URL 抓取正文 | 时间允许再做 |
| P2 | 日历同步 | 导出 iCal 或模拟同步按钮 | 时间允许再做 |

### 4.2 MVP 主流程

```text
用户打开首页
  -> 输入“我要学 MCP”
  -> 点击“生成知识计划”
  -> 前端调用 POST /api/research
  -> 后端返回内容列表、知识全景图、知识卡片、知识图谱、学习路径、行动任务
  -> 前端分 Tab 展示：内容、卡片、星图、路径、行动
  -> 用户收藏卡片或把任务加入今日计划
```

## 5. 用户故事

### 5.1 主题学习

作为一名开发者，我希望输入“我要学 MCP”，系统能告诉我 MCP 是什么、需要哪些前置知识、应该按什么顺序学、可以做什么实践项目，这样我不用在大量文章中反复搜索。

验收标准：

1. 输入主题后 5 秒内返回结果。
2. 页面展示知识全景图、知识卡片、学习路径和实践任务。
3. 每张知识卡片包含标题、摘要、3 个要点、标签和难度。

### 5.2 内容收藏与知识沉淀

作为技术学习者，我希望看到推荐文章后可以收藏，并把文章自动压缩成知识卡片，这样以后复习时不用重新阅读长文。

验收标准：

1. 每篇推荐内容有收藏按钮。
2. 收藏后进入“我的知识库”区域。
3. 卡片可以按标签展示。

### 5.3 行动转化

作为求职者，我希望系统从学习资料里自动提取实践任务，例如“搭建 MCP Demo”，并安排成今日计划，这样我能真正开始动手。

验收标准：

1. 任务有标题、说明、预计耗时、优先级。
2. 用户可以勾选完成。
3. 今日计划显示总预计耗时。

## 6. 信息架构与前端页面

### 6.1 页面结构

MVP 推荐做成单页应用，避免多页面开发成本。

```text
首页 / 工作台
├─ 顶部栏
├─ 主题输入区
├─ 生成状态区
├─ 结果区 Tabs
│  ├─ 今日简报
│  ├─ 内容来源
│  ├─ 知识卡片
│  ├─ 知识星图
│  ├─ 学习路径
│  └─ 行动计划
└─ 右侧/底部个人知识库
```

### 6.2 首页工作台

#### 组件

1. 顶部导航：产品名、当前模式、Demo 标签。
2. 输入框：支持输入主题、关键词、URL。
3. 快捷示例按钮：`我要学 MCP`、`AI Agent 入门`、`React 性能优化`。
4. 生成按钮：点击后进入 loading 状态。
5. 结果概览：展示内容数量、卡片数量、任务数量、预计学习时长。

#### 交互

1. 用户输入为空时，生成按钮置灰。
2. 点击示例按钮后自动填入输入框。
3. 点击生成后，显示“正在发现内容 / 正在融合知识 / 正在生成计划”的步骤进度。
4. 请求成功后自动切到“今日简报”。

### 6.3 今日简报 Tab

展示 AI 对当前主题的整体总结。

字段：

| 字段 | 说明 |
| --- | --- |
| topic | 主题 |
| oneLineSummary | 一句话总结 |
| whyLearn | 为什么值得学 |
| keyTakeaways | 关键结论 |
| estimatedTime | 建议投入时间 |
| nextAction | 下一步行动 |

页面样式：

1. 左侧展示主题摘要和学习价值。
2. 右侧展示“今日最该做的 3 件事”。
3. 底部展示推荐阅读顺序。

### 6.4 内容来源 Tab

展示系统找到的内容。

内容卡片字段：

| 字段 | 说明 |
| --- | --- |
| title | 内容标题 |
| source | 来源平台 |
| url | 原文链接 |
| type | article / repo / video / docs |
| qualityScore | 质量分 |
| reason | 推荐原因 |
| readingTime | 阅读耗时 |

交互：

1. 点击卡片可打开原文。
2. 点击“生成卡片”可查看对应知识卡片。
3. 点击“收藏”加入知识库。

### 6.5 知识卡片 Tab

展示 AI 提炼后的结构化知识。

卡片字段：

| 字段 | 说明 |
| --- | --- |
| id | 卡片 ID |
| title | 知识点标题 |
| summary | 摘要 |
| bullets | 3-5 个要点 |
| tags | 标签 |
| difficulty | 入门 / 进阶 / 高阶 |
| relatedConcepts | 相关概念 |
| sourceIds | 来源内容 ID |

交互：

1. 标签可点击筛选。
2. 卡片可收藏。
3. 卡片可展开查看来源。

### 6.6 知识星图 Tab

用图谱展示概念关系。

MVP 前端实现建议：

1. 使用 React Flow 或 ECharts Graph。
2. 后端返回 nodes 和 edges。
3. 节点类型区分：主题、概念、工具、实践、前置知识。

节点示例：

```json
{
  "nodes": [
    { "id": "mcp", "label": "MCP", "type": "topic" },
    { "id": "host", "label": "Host", "type": "concept" },
    { "id": "server", "label": "Server", "type": "concept" }
  ],
  "edges": [
    { "source": "mcp", "target": "host", "label": "包含" },
    { "source": "mcp", "target": "server", "label": "包含" }
  ]
}
```

### 6.7 学习路径 Tab

展示从前置知识到实践项目的学习路线。

字段：

| 字段 | 说明 |
| --- | --- |
| level | 阶段 |
| title | 阶段名称 |
| goal | 学习目标 |
| resources | 推荐资源 |
| tasks | 阶段任务 |
| estimatedHours | 预计耗时 |

页面形式：

1. 时间线。
2. 每个阶段一个可展开模块。
3. 标记当前建议起点。

### 6.8 行动计划 Tab

展示从知识内容中提取的可执行任务。

任务字段：

| 字段 | 说明 |
| --- | --- |
| id | 任务 ID |
| title | 任务标题 |
| description | 任务说明 |
| estimatedMinutes | 预计耗时 |
| priority | high / medium / low |
| source | 来源卡片 |
| status | todo / doing / done |

交互：

1. 勾选任务完成。
2. 点击“加入今日计划”。
3. 显示今日计划总耗时。
4. “同步日历”按钮 MVP 可做成模拟 toast。

## 7. 后端功能设计

### 7.1 后端职责

后端负责：

1. 接收用户主题或 URL。
2. 获取内容来源。
3. 调用 AI 生成知识结构。
4. 返回统一 JSON 给前端。
5. 保存查询记录、知识卡片、任务。

### 7.2 Agent 模块拆分

| Agent | MVP 实现 | 后续扩展 |
| --- | --- | --- |
| Orchestrator | 一个 service 函数串联流程 | LangGraph / Dify Workflow |
| 内容发现 Agent | mock 数据 + 可选 Tavily/SerpAPI/GitHub API | RSSHub / Firecrawl / 多源搜索 |
| 内容解析 Agent | 对 mock 内容或 URL 文本做清洗 | Readability / Firecrawl |
| 知识卡片 Agent | LLM 结构化输出 JSON | RAG + 多文档融合 |
| 知识关联 Agent | 根据标签和关键词生成 nodes/edges | 向量相似度 + 图数据库 |
| 学习路径 Agent | LLM 生成阶段路线 | 用户画像驱动个性化 |
| 任务提取 Agent | LLM 从卡片生成任务 | 日历/待办系统同步 |

### 7.3 API 设计

#### 7.3.1 健康检查

```http
GET /api/health
```

响应：

```json
{
  "ok": true,
  "service": "knowledge-productivity-hub"
}
```

#### 7.3.2 一键研究主题

```http
POST /api/research
Content-Type: application/json
```

请求：

```json
{
  "query": "我要学 MCP",
  "mode": "topic",
  "userLevel": "beginner",
  "timeBudgetHours": 6
}
```

响应：

```json
{
  "topic": "MCP",
  "brief": {
    "oneLineSummary": "MCP 是连接 AI 应用与外部工具/数据源的协议。",
    "whyLearn": "它是构建 Agent 工具生态的重要基础。",
    "keyTakeaways": ["理解 Host、Client、Server、Tool", "掌握 MCP Server 构建方式"],
    "estimatedTime": "6 小时",
    "nextAction": "先阅读 MCP 官方介绍，再搭建一个最小 Demo"
  },
  "sources": [],
  "cards": [],
  "graph": {
    "nodes": [],
    "edges": []
  },
  "learningPath": [],
  "tasks": []
}
```

#### 7.3.3 获取历史研究记录

```http
GET /api/research/history
```

响应：

```json
{
  "items": [
    {
      "id": "research_001",
      "topic": "MCP",
      "createdAt": "2026-06-14T14:00:00+08:00"
    }
  ]
}
```

#### 7.3.4 收藏知识卡片

```http
POST /api/cards/:id/favorite
```

响应：

```json
{
  "ok": true,
  "cardId": "card_001",
  "favorite": true
}
```

#### 7.3.5 更新任务状态

```http
PATCH /api/tasks/:id
Content-Type: application/json
```

请求：

```json
{
  "status": "done"
}
```

响应：

```json
{
  "ok": true,
  "taskId": "task_001",
  "status": "done"
}
```

## 8. 数据模型

### 8.1 MVP 可用内存/JSON 文件存储

4 小时黑客松建议先用内存数据或 SQLite，减少数据库部署成本。

如果需要数据库，推荐 SQLite + Prisma，前后端联调简单。

### 8.2 表结构设计

#### research_sessions

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 主键 |
| query | string | 用户输入 |
| topic | string | 识别后的主题 |
| mode | string | topic / url / rss |
| user_level | string | beginner / intermediate / advanced |
| created_at | datetime | 创建时间 |

#### sources

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 主键 |
| session_id | string | 所属研究 |
| title | string | 标题 |
| url | string | 链接 |
| source | string | 来源 |
| type | string | article / repo / video / docs |
| summary | text | 简短摘要 |
| quality_score | number | 质量分 |
| reading_time | number | 阅读分钟数 |

#### knowledge_cards

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 主键 |
| session_id | string | 所属研究 |
| title | string | 标题 |
| summary | text | 摘要 |
| bullets | json | 要点 |
| tags | json | 标签 |
| difficulty | string | 难度 |
| related_concepts | json | 相关概念 |
| source_ids | json | 来源内容 |
| favorite | boolean | 是否收藏 |

#### learning_steps

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 主键 |
| session_id | string | 所属研究 |
| level | number | 阶段序号 |
| title | string | 阶段标题 |
| goal | text | 学习目标 |
| estimated_hours | number | 预计小时 |
| resources | json | 推荐资源 |

#### tasks

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 主键 |
| session_id | string | 所属研究 |
| title | string | 任务标题 |
| description | text | 任务说明 |
| estimated_minutes | number | 预计分钟 |
| priority | string | high / medium / low |
| status | string | todo / doing / done |
| source_card_id | string | 来源知识卡片 |

## 9. 技术栈建议

### 9.1 推荐方案

为了 4 小时内快速交付，推荐：

| 层 | 技术 |
| --- | --- |
| 前端 | React + Vite + TypeScript |
| UI | Tailwind CSS + shadcn/ui + lucide-react |
| 图谱 | React Flow 或 ECharts |
| 状态管理 | React Query + useState/Zustand |
| 后端 | Python FastAPI |
| AI 调用 | OpenAI / 智谱 / 通义 / DeepSeek 任一可用模型 |
| 数据存储 | SQLite 或内存 mock |
| 接口文档 | FastAPI Swagger |
| 部署 | 本地演示，前端 Vite，后端 Uvicorn |

### 9.2 为什么这样选

1. React + Vite 启动快，适合黑客松。
2. Tailwind + shadcn/ui 能快速做出专业感工作台。
3. FastAPI 自带 Swagger，方便前后端并行联调。
4. Python 更适合快速接 AI、爬虫、文本处理。
5. SQLite/内存数据能降低部署和联调风险。

### 9.3 备选方案

如果团队更熟 Node：

| 层 | 技术 |
| --- | --- |
| 前端 | Next.js 或 React + Vite |
| 后端 | NestJS / Express |
| AI SDK | openai npm SDK |
| 数据库 | SQLite + Prisma |

## 10. 前后端分工

### 10.1 前端同学任务

前端优先完成页面和 mock 数据展示，不等待后端。

任务列表：

1. 搭建 Vite + React + TypeScript 项目。
2. 完成工作台整体布局。
3. 完成主题输入区和生成状态。
4. 完成 Tabs：今日简报、内容来源、知识卡片、知识星图、学习路径、行动计划。
5. 使用 mock JSON 渲染所有模块。
6. 封装 API client，后端完成后替换 mock。
7. 做好 loading、empty、error 状态。

前端文件建议：

```text
src/
  api/
    research.ts
  components/
    TopicInput.tsx
    BriefPanel.tsx
    SourceList.tsx
    KnowledgeCardList.tsx
    KnowledgeGraph.tsx
    LearningPath.tsx
    ActionPlan.tsx
  mocks/
    researchResult.ts
  types/
    research.ts
  App.tsx
```

### 10.2 后端同学任务

后端优先保证 `/api/research` 能返回稳定结构。

任务列表：

1. 搭建 FastAPI 项目。
2. 定义 Pydantic 请求/响应模型。
3. 实现 `/api/health`。
4. 实现 `/api/research`。
5. 第一版返回固定 mock 数据。
6. 第二版接入大模型，生成 brief/cards/path/tasks。
7. 第三版可选接入 GitHub API 或 RSS 数据。
8. 开启 CORS，允许前端本地访问。

后端文件建议：

```text
backend/
  app/
    main.py
    models.py
    services/
      orchestrator.py
      mock_data.py
      llm.py
      graph_builder.py
  requirements.txt
```

### 10.3 联调协议

前后端先约定 `/api/research` 的响应结构，不互相阻塞。

联调步骤：

1. 后端先返回 mock JSON。
2. 前端用同一份 JSON 开发页面。
3. 联调时前端把 mock 切换为真实接口。
4. 如果 LLM 调用失败，后端回退到 mock 结果，保证演示不断。

## 11. AI 提示词设计

### 11.1 结构化输出要求

后端调用 LLM 时要求严格返回 JSON，字段与 API response 对齐。

系统提示词建议：

```text
你是一个面向开发者的 AI 知识研究助手。
用户会输入一个学习主题、技术关键词或文章链接。
你需要生成结构化学习结果，包括：
1. 主题简报
2. 推荐内容来源
3. 知识卡片
4. 知识图谱节点和边
5. 学习路径
6. 可执行任务

请只返回合法 JSON，不要输出 Markdown。
```

用户提示词模板：

```text
用户输入：{query}
用户水平：{userLevel}
可投入时间：{timeBudgetHours} 小时

请围绕该主题生成一个适合技术学习者的知识与行动计划。
```

### 11.2 LLM 失败兜底

必须做兜底：

1. LLM 超时：返回 mock 数据。
2. JSON 解析失败：返回 mock 数据并记录错误。
3. API key 缺失：返回 mock 数据。

这样 Demo 现场不会因为模型服务失败而中断。

## 12. UI 与视觉要求

### 12.1 产品气质

整体应该像一个高效、清爽、可信赖的知识工作台，而不是营销页。

关键词：

1. 专业。
2. 信息密度高。
3. 层级清晰。
4. 适合长时间使用。
5. 有 AI 生成过程的即时反馈。

### 12.2 推荐布局

桌面端：

```text
顶部导航
主题输入与生成进度
左侧主结果区 Tabs
右侧洞察/今日计划摘要
```

移动端：

```text
顶部导航
主题输入
结果 Tabs
今日计划折叠到底部
```

### 12.3 组件状态

每个关键模块都要有：

1. loading 状态。
2. empty 状态。
3. error 状态。
4. 成功状态。

## 13. 演示脚本

### 13.1 Demo 输入

建议演示输入：

```text
我要学 MCP，并在 1 天内做出一个最小 Demo
```

### 13.2 演示流程

1. 打开产品首页，说明用户面对的问题是“资料太多，但不知道怎么学、怎么做”。
2. 输入“我要学 MCP，并在 1 天内做出一个最小 Demo”。
3. 点击生成，展示 AI 处理进度。
4. 展示今日简报：系统先把主题讲清楚。
5. 展示内容来源：系统推荐高价值资料。
6. 展示知识卡片：长内容被压缩成可复习卡片。
7. 展示知识星图：概念之间被连接起来。
8. 展示学习路径：从前置知识到实践项目。
9. 展示行动计划：直接生成今天可以做的任务。
10. 总结产品价值：从信息获取到知识沉淀，再到行动执行的完整闭环。

### 13.3 推荐讲解金句

```text
我们的产品解决的不是“收藏更多内容”，而是“把内容转化成可执行的成长路径”。
```

```text
传统工具停在信息管理，我们希望再往前走一步，把知识变成计划，把计划变成行动。
```

## 14. 4 小时开发排期

| 时间 | 前端 | 后端 | 产出 |
| --- | --- | --- | --- |
| 0:00-0:30 | 搭项目、定页面结构 | 搭 FastAPI、定响应模型 | 项目骨架 |
| 0:30-1:00 | 用 mock 数据做首页和输入区 | 实现 /api/health、/api/research mock | 可跑通接口 |
| 1:00-2:00 | 完成内容、卡片、路径、任务 Tabs | 接入 LLM 生成 brief/cards/tasks | 核心功能 |
| 2:00-2:45 | 完成知识图谱和交互状态 | 生成 graph/path，增加兜底 | 体验完整 |
| 2:45-3:15 | 前后端联调 | 修接口字段和 CORS | 联调完成 |
| 3:15-3:40 | 美化 UI、补 loading/error | 稳定 mock fallback | 可演示 |
| 3:40-4:00 | 准备演示脚本 | 准备演示数据 | 最终 Demo |

## 15. 验收标准

### 15.1 功能验收

1. 用户可以输入主题并点击生成。
2. 页面能展示 AI 生成结果。
3. 至少包含 5 个推荐来源。
4. 至少包含 5 张知识卡片。
5. 至少包含 1 张概念图谱。
6. 至少包含 5 个学习路径步骤。
7. 至少包含 3 个行动任务。
8. 任务可以勾选完成。
9. LLM 不可用时仍能用 mock 数据演示。

### 15.2 技术验收

1. 前端能通过环境变量配置后端地址。
2. 后端接口有 Swagger 文档。
3. API response 字段稳定。
4. 本地启动步骤清晰。
5. 无明显控制台报错。

## 16. 风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| LLM 接口不稳定 | Demo 中断 | 后端必须内置 mock fallback |
| 爬虫耗时过长 | 结果慢 | MVP 使用预置内容或搜索 API |
| 前后端字段不一致 | 联调阻塞 | 先共享 mock JSON 和 TypeScript 类型 |
| 功能过多做不完 | 体验碎片化 | 只保 P0，P1/P2 用静态或按钮占位 |
| 图谱开发耗时 | 页面缺亮点 | 使用 React Flow/ECharts 简单渲染 |

## 17. 后续迭代方向

1. 接入 RSSHub、Firecrawl、GitHub Trending、HackerNews。
2. 增加浏览器插件，一键保存网页、PDF、视频。
3. 引入向量数据库，支持个人知识库语义搜索。
4. 做真正的知识图谱，支持概念关系追踪。
5. 接入飞书日历、Google Calendar、Notion。
6. 根据用户行为做个性化推荐。
7. 增加成长教练，每日推荐和每周复盘。
8. 支持生成 GitHub 项目模板和实践路线。

## 18. 最小可用响应示例

前后端可以先基于下面结构联调：

```json
{
  "topic": "MCP",
  "brief": {
    "oneLineSummary": "MCP 是让 AI 应用连接外部工具和数据源的开放协议。",
    "whyLearn": "它是 Agent 工具生态的重要基础，适合想做 AI 应用和自动化工具的开发者学习。",
    "keyTakeaways": [
      "MCP 的核心角色包括 Host、Client、Server 和 Tool",
      "MCP Server 负责把外部能力暴露给 AI 应用",
      "学习 MCP 最好的方式是搭建一个最小工具调用 Demo"
    ],
    "estimatedTime": "6 小时",
    "nextAction": "先理解协议角色，再用 FastAPI 实现一个简单 MCP Server"
  },
  "sources": [
    {
      "id": "source_001",
      "title": "MCP 官方文档",
      "source": "Official Docs",
      "url": "https://modelcontextprotocol.io",
      "type": "docs",
      "qualityScore": 95,
      "reason": "官方定义最准确，适合作为起点",
      "readingTime": 20
    }
  ],
  "cards": [
    {
      "id": "card_001",
      "title": "MCP 协议是什么",
      "summary": "MCP 是一种让 AI 应用以标准方式连接工具、数据源和外部服务的协议。",
      "bullets": [
        "解决 AI 应用与工具集成方式碎片化的问题",
        "通过 Server 暴露工具能力",
        "通过 Client 与 Host 完成调用链路"
      ],
      "tags": ["MCP", "AI Agent", "Tool Calling"],
      "difficulty": "入门",
      "relatedConcepts": ["Host", "Client", "Server", "Tool"],
      "sourceIds": ["source_001"]
    }
  ],
  "graph": {
    "nodes": [
      { "id": "mcp", "label": "MCP", "type": "topic" },
      { "id": "host", "label": "Host", "type": "concept" },
      { "id": "server", "label": "Server", "type": "concept" },
      { "id": "tool", "label": "Tool", "type": "concept" }
    ],
    "edges": [
      { "source": "mcp", "target": "host", "label": "包含" },
      { "source": "mcp", "target": "server", "label": "包含" },
      { "source": "server", "target": "tool", "label": "暴露" }
    ]
  },
  "learningPath": [
    {
      "level": 1,
      "title": "理解 Tool Calling",
      "goal": "理解大模型如何调用外部工具",
      "estimatedHours": 1,
      "resources": ["OpenAI Tool Calling 文档"],
      "tasks": ["写出一个工具调用流程图"]
    },
    {
      "level": 2,
      "title": "理解 MCP 核心角色",
      "goal": "掌握 Host、Client、Server、Tool 的关系",
      "estimatedHours": 1,
      "resources": ["MCP 官方介绍"],
      "tasks": ["画出 MCP 调用链路"]
    }
  ],
  "tasks": [
    {
      "id": "task_001",
      "title": "搭建 MCP 最小 Demo",
      "description": "实现一个可以返回当前时间的 MCP Tool",
      "estimatedMinutes": 90,
      "priority": "high",
      "source": "card_001",
      "status": "todo"
    }
  ]
}
```
