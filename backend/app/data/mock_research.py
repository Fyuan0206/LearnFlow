import re
from datetime import datetime, timezone
from app.schemas.research import (
    Brief,
    Graph,
    GraphEdge,
    GraphNode,
    KnowledgeCard,
    LearningStep,
    ResearchResponse,
    Source,
    TaskItem,
)


def _extract_topic(query: str) -> str:
    # Very simple keyword extraction for mock purposes.
    lowered = query.lower()
    if "mcp" in lowered:
        return "MCP"
    if "react" in lowered:
        return "React"
    if "agent" in lowered or "智能体" in query:
        return "AI Agent"
    # Remove common Chinese filler words.
    topic = re.sub(r"(我要学|我想学|学习|入门|掌握|了解|如何|怎么|一个|最小|demo)", "", query, flags=re.I)
    return topic.strip() or "技术主题"


def _mcp_response() -> ResearchResponse:
    return ResearchResponse(
        topic="MCP",
        brief=Brief(
            oneLineSummary="MCP 是让 AI 应用连接外部工具和数据源的开放协议。",
            whyLearn="它是 Agent 工具生态的重要基础，适合想做 AI 应用和自动化工具的开发者学习。",
            keyTakeaways=[
                "MCP 的核心角色包括 Host、Client、Server 和 Tool",
                "MCP Server 负责把外部能力暴露给 AI 应用",
                "学习 MCP 最好的方式是搭建一个最小工具调用 Demo",
            ],
            estimatedTime="6 小时",
            nextAction="先理解协议角色，再用 FastAPI 实现一个简单 MCP Server",
        ),
        sources=[
            Source(
                id="source_001",
                title="MCP 官方文档",
                source="Official Docs",
                url="https://modelcontextprotocol.io",
                type="docs",
                qualityScore=95,
                reason="官方定义最准确，适合作为起点",
                readingTime=20,
            ),
            Source(
                id="source_002",
                title="MCP Python SDK",
                source="GitHub",
                url="https://github.com/modelcontextprotocol/python-sdk",
                type="repo",
                qualityScore=92,
                reason="官方 SDK，含示例代码",
                readingTime=15,
            ),
            Source(
                id="source_003",
                title="MCP 快速入门指南",
                source="Anthropic Blog",
                url="https://www.anthropic.com/news/model-context-protocol",
                type="article",
                qualityScore=90,
                reason="介绍协议背景与设计动机",
                readingTime=12,
            ),
            Source(
                id="source_004",
                title="MCP Server 开发实战",
                source="YouTube",
                url="https://www.youtube.com/results?search_query=mcp+server+tutorial",
                type="video",
                qualityScore=78,
                reason="视频演示更直观",
                readingTime=25,
            ),
            Source(
                id="source_005",
                title="Awesome MCP Servers",
                source="GitHub",
                url="https://github.com/modelcontextprotocol/servers",
                type="repo",
                qualityScore=85,
                reason="参考现有 Server 实现",
                readingTime=10,
            ),
        ],
        cards=[
            KnowledgeCard(
                id="card_001",
                title="MCP 协议是什么",
                summary="MCP 是一种让 AI 应用以标准方式连接工具、数据源和外部服务的协议。",
                bullets=[
                    "解决 AI 应用与工具集成方式碎片化的问题",
                    "通过 Server 暴露工具能力",
                    "通过 Client 与 Host 完成调用链路",
                ],
                tags=["MCP", "AI Agent", "Tool Calling"],
                difficulty="入门",
                relatedConcepts=["Host", "Client", "Server", "Tool"],
                sourceIds=["source_001"],
            ),
            KnowledgeCard(
                id="card_002",
                title="Host 的角色",
                summary="Host 是运行 AI 应用的环境，负责协调 Client 与 Server 之间的通信。",
                bullets=[
                    "管理多个 MCP Client 的生命周期",
                    "提供用户交互界面",
                    "决定哪些工具可以被调用",
                ],
                tags=["MCP", "Host"],
                difficulty="入门",
                relatedConcepts=["Client", "Server", "权限控制"],
                sourceIds=["source_001", "source_003"],
            ),
            KnowledgeCard(
                id="card_003",
                title="Client 与 Server 的交互",
                summary="Client 代表 Host 与 Server 建立连接，Server 则暴露工具和资源。",
                bullets=[
                    "Client 发送工具调用请求",
                    "Server 执行实际逻辑并返回结果",
                    "双方通过 stdio 或 SSE 通信",
                ],
                tags=["MCP", "Client", "Server"],
                difficulty="进阶",
                relatedConcepts=["stdio", "SSE", "JSON-RPC"],
                sourceIds=["source_001", "source_002"],
            ),
            KnowledgeCard(
                id="card_004",
                title="Tool 的定义与调用",
                summary="Tool 是 Server 暴露给 AI 的可调用能力，通常以函数形式描述。",
                bullets=[
                    "Tool 需要名称、描述和参数模式",
                    "AI 根据用户输入决定是否调用 Tool",
                    "调用结果会被送回对话上下文",
                ],
                tags=["MCP", "Tool Calling"],
                difficulty="进阶",
                relatedConcepts=["Function Calling", "Schema"],
                sourceIds=["source_002"],
            ),
            KnowledgeCard(
                id="card_005",
                title="搭建最小 MCP Server",
                summary="用 Python FastAPI 或官方 SDK 可以快速实现一个返回当前时间的 Server。",
                bullets=[
                    "安装 mcp Python SDK",
                    "定义一个 tool 函数",
                    "运行 Server 并用 Client 测试",
                ],
                tags=["MCP", "实践"],
                difficulty="入门",
                relatedConcepts=["FastAPI", "SDK", "Demo"],
                sourceIds=["source_002", "source_005"],
            ),
        ],
        graph=Graph(
            nodes=[
                GraphNode(id="mcp", label="MCP", type="topic"),
                GraphNode(id="host", label="Host", type="concept"),
                GraphNode(id="client", label="Client", type="concept"),
                GraphNode(id="server", label="Server", type="concept"),
                GraphNode(id="tool", label="Tool", type="concept"),
                GraphNode(id="ai_app", label="AI 应用", type="practice"),
            ],
            edges=[
                GraphEdge(source="mcp", target="host", label="包含"),
                GraphEdge(source="mcp", target="client", label="包含"),
                GraphEdge(source="mcp", target="server", label="包含"),
                GraphEdge(source="server", target="tool", label="暴露"),
                GraphEdge(source="host", target="ai_app", label="运行"),
                GraphEdge(source="client", target="server", label="连接"),
            ],
        ),
        learningPath=[
            LearningStep(
                level=1,
                title="理解 Tool Calling",
                goal="理解大模型如何调用外部工具",
                estimatedHours=1,
                resources=["OpenAI Tool Calling 文档"],
                tasks=["写出一个工具调用流程图"],
            ),
            LearningStep(
                level=2,
                title="理解 MCP 核心角色",
                goal="掌握 Host、Client、Server、Tool 的关系",
                estimatedHours=1,
                resources=["MCP 官方介绍"],
                tasks=["画出 MCP 调用链路"],
            ),
            LearningStep(
                level=3,
                title="阅读官方文档与示例",
                goal="熟悉协议消息格式与生命周期",
                estimatedHours=2,
                resources=["MCP 官方文档", "Python SDK 示例"],
                tasks=["运行官方 hello-world 示例"],
            ),
            LearningStep(
                level=4,
                title="实现第一个 MCP Server",
                goal="能独立开发一个简单 Server",
                estimatedHours=2,
                resources=["Python SDK", "Awesome MCP Servers"],
                tasks=["实现返回当前时间的 Tool", "用 Client 完成调用"],
            ),
            LearningStep(
                level=5,
                title="接入 AI 应用完成闭环",
                goal="让大模型通过 MCP 调用你的工具",
                estimatedHours=2,
                resources=["Claude / OpenAI API"],
                tasks=["在对话中触发工具调用", "处理调用结果"],
            ),
        ],
        tasks=[
            TaskItem(
                id="task_001",
                title="搭建 MCP 最小 Demo",
                description="实现一个可以返回当前时间的 MCP Tool",
                estimatedMinutes=90,
                priority="high",
                source="card_005",
            ),
            TaskItem(
                id="task_002",
                title="画出 MCP 角色关系图",
                description="在纸上或 Excalidraw 中画出 Host、Client、Server、Tool 的关系",
                estimatedMinutes=30,
                priority="medium",
                source="card_002",
            ),
            TaskItem(
                id="task_003",
                title="阅读官方 Quickstart",
                description="完成官方文档的快速入门章节",
                estimatedMinutes=45,
                priority="medium",
                source="card_001",
            ),
            TaskItem(
                id="task_004",
                title="测试一个现有 MCP Server",
                description="从 Awesome MCP Servers 中挑选一个运行并测试",
                estimatedMinutes=60,
                priority="low",
                source="card_004",
            ),
        ],
    )


def _react_response() -> ResearchResponse:
    return ResearchResponse(
        topic="React",
        brief=Brief(
            oneLineSummary="React 是用于构建用户界面的 JavaScript 库。",
            whyLearn="React 生态成熟，是前端开发的主流选择之一。",
            keyTakeaways=[
                "组件化是 React 的核心思想",
                "Hooks 让函数组件拥有状态和副作用能力",
                "性能优化需要理解渲染机制",
            ],
            estimatedTime="8 小时",
            nextAction="先完成官方 Tic-Tac-Toe 教程，再用 Vite 创建一个计数器应用",
        ),
        sources=[
            Source(id="rs_001", title="React 官方文档", source="React", url="https://react.dev", type="docs", qualityScore=95, reason="权威、示例丰富", readingTime=30),
            Source(id="rs_002", title="React Hooks 深度解析", source="Blog", url="https://react.dev/reference/react", type="article", qualityScore=88, reason="系统讲解 Hooks", readingTime=20),
            Source(id="rs_003", title="React 性能优化指南", source="GitHub", url="https://github.com/reactjs/react.dev", type="repo", qualityScore=82, reason="含最佳实践", readingTime=15),
            Source(id="rs_004", title="Vite + React 快速上手", source="Vite", url="https://vitejs.dev/guide/", type="docs", qualityScore=90, reason="现代项目启动方式", readingTime=10),
            Source(id="rs_005", title="React 设计模式", source="YouTube", url="https://www.youtube.com/results?search_query=react+patterns", type="video", qualityScore=75, reason="视频讲解常见模式", readingTime=25),
        ],
        cards=[
            KnowledgeCard(id="rc_001", title="组件与 JSX", summary="React 应用由组件组成，JSX 是描述 UI 的语法糖。", bullets=["组件可以嵌套和复用", "JSX 需要编译为 JavaScript", "Props 用于父组件向子组件传数据"], tags=["React", "JSX"], difficulty="入门", relatedConcepts=["Component", "Props", "JSX"], sourceIds=["rs_001"]),
            KnowledgeCard(id="rc_002", title="State 与 Hooks", summary="useState 和 useEffect 是最常用的两个 Hooks。", bullets=["useState 管理组件内部状态", "useEffect 处理副作用", "Hooks 有调用规则"], tags=["React", "Hooks"], difficulty="入门", relatedConcepts=["useState", "useEffect", "State"], sourceIds=["rs_001", "rs_002"]),
            KnowledgeCard(id="rc_003", title="条件渲染与列表", summary="根据状态渲染不同 UI，并高效渲染列表。", bullets=["使用三元或 && 进行条件渲染", "列表需要稳定的 key", "避免在 render 中创建新对象"], tags=["React"], difficulty="入门", relatedConcepts=["key", "条件渲染", "列表"], sourceIds=["rs_001"]),
            KnowledgeCard(id="rc_004", title="React 渲染机制", summary="理解何时、为何会触发重新渲染是性能优化的基础。", bullets=["State 或 Props 变化触发渲染", "比较虚拟 DOM 差异", "memo 可减少不必要渲染"], tags=["React", "性能"], difficulty="进阶", relatedConcepts=["Reconciliation", "memo", "Virtual DOM"], sourceIds=["rs_003"]),
            KnowledgeCard(id="rc_005", title="生态与路由", summary="React 本身只关注视图层，路由和状态管理需要额外库。", bullets=["React Router 处理页面路由", "Zustand/Redux 管理全局状态", "TanStack Query 处理服务端状态"], tags=["React", "生态"], difficulty="进阶", relatedConcepts=["React Router", "Redux", "Zustand"], sourceIds=["rs_004", "rs_005"]),
        ],
        graph=Graph(
            nodes=[
                GraphNode(id="react", label="React", type="topic"),
                GraphNode(id="component", label="Component", type="concept"),
                GraphNode(id="jsx", label="JSX", type="concept"),
                GraphNode(id="hooks", label="Hooks", type="concept"),
                GraphNode(id="state", label="State", type="concept"),
                GraphNode(id="router", label="React Router", type="tool"),
            ],
            edges=[
                GraphEdge(source="react", target="component", label="由...组成"),
                GraphEdge(source="component", target="jsx", label="使用"),
                GraphEdge(source="react", target="hooks", label="包含"),
                GraphEdge(source="hooks", target="state", label="管理"),
                GraphEdge(source="react", target="router", label="配合"),
            ],
        ),
        learningPath=[
            LearningStep(level=1, title="JSX 与组件", goal="能写出简单的函数组件", estimatedHours=1, resources=["React 官方文档"], tasks=["完成 Tic-Tac-Toe"]),
            LearningStep(level=2, title="State 与事件", goal="掌握 useState 和事件处理", estimatedHours=2, resources=["React 官方文档"], tasks=["实现计数器、表单"]),
            LearningStep(level=3, title="副作用与数据获取", goal="掌握 useEffect 和数据流", estimatedHours=2, resources=["Hooks 参考"], tasks=["调用一个公开 API"]),
            LearningStep(level=4, title="路由与状态管理", goal="能搭建多页面应用", estimatedHours=2, resources=["React Router", "Zustand"], tasks=["添加导航和全局状态"]),
            LearningStep(level=5, title="性能优化", goal="减少不必要的渲染", estimatedHours=1, resources=["性能优化指南"], tasks=["使用 memo/useMemo 优化"]),
        ],
        tasks=[
            TaskItem(id="rt_001", title="用 Vite 创建 React 项目", description="跑通开发服务器并修改默认页面", estimatedMinutes=30, priority="high", source="rc_001"),
            TaskItem(id="rt_002", title="实现计数器组件", description="用 useState 实现加减计数", estimatedMinutes=45, priority="high", source="rc_002"),
            TaskItem(id="rt_003", title="完成官方 Tutorial", description="跟着 React 官方教程实现井字棋", estimatedMinutes=60, priority="medium", source="rc_001"),
            TaskItem(id="rt_004", title="添加 React Router", description="实现两个页面并可以跳转", estimatedMinutes=60, priority="low", source="rc_005"),
        ],
    )


def _agent_response() -> ResearchResponse:
    return ResearchResponse(
        topic="AI Agent",
        brief=Brief(
            oneLineSummary="AI Agent 是能感知环境、自主决策并执行行动的 AI 系统。",
            whyLearn="Agent 是大模型落地应用的重要形态，能完成复杂多步任务。",
            keyTakeaways=[
                "Agent 由模型、工具、规划、记忆四个核心模块组成",
                "ReAct 和 Plan-and-Execute 是常见规划策略",
                "工具调用是 Agent 与外部世界交互的主要方式",
            ],
            estimatedTime="10 小时",
            nextAction="先学习 ReAct 论文思想，再用 Python 实现一个能调用搜索工具的 Agent",
        ),
        sources=[
            Source(id="as_001", title="ReAct: Synergizing Reasoning and Acting", source="arXiv", url="https://arxiv.org/abs/2210.03629", type="article", qualityScore=92, reason="Agent 规划经典论文", readingTime=30),
            Source(id="as_002", title="LangChain Agents 文档", source="LangChain", url="https://python.langchain.com/docs/modules/agents/", type="docs", qualityScore=85, reason="实践参考", readingTime=25),
            Source(id="as_003", title="Building Effective Agents", source="Anthropic", url="https://www.anthropic.com/research/building-effective-agents", type="article", qualityScore=90, reason="工程化建议", readingTime=20),
            Source(id="as_004", title="AutoGPT", source="GitHub", url="https://github.com/Significant-Gravitas/AutoGPT", type="repo", qualityScore=78, reason="早期 Agent 项目参考", readingTime=15),
            Source(id="as_005", title="Agent 工具调用示例", source="YouTube", url="https://www.youtube.com/results?search_query=ai+agent+tutorial", type="video", qualityScore=76, reason="视频演示", readingTime=30),
        ],
        cards=[
            KnowledgeCard(id="ac_001", title="什么是 AI Agent", summary="Agent 是能自主完成目标的系统，通常由大模型驱动。", bullets=["能感知环境并接收输入", "能进行推理和规划", "能调用工具执行行动"], tags=["AI Agent", "LLM"], difficulty="入门", relatedConcepts=["LLM", "Tool", "Planning"], sourceIds=["as_001", "as_003"]),
            KnowledgeCard(id="ac_002", title="ReAct 范式", summary="ReAct 让模型交替进行推理（Reasoning）和行动（Acting）。", bullets=["Thought 分析当前状态", "Action 选择并调用工具", "Observation 根据结果继续思考"], tags=["AI Agent", "ReAct"], difficulty="进阶", relatedConcepts=["Reasoning", "Acting", "CoT"], sourceIds=["as_001"]),
            KnowledgeCard(id="ac_003", title="工具调用", summary="Agent 通过工具扩展能力，例如搜索、计算、代码执行。", bullets=["工具需要清晰的描述", "模型决定何时调用", "结果返回给模型继续决策"], tags=["AI Agent", "Tool Calling"], difficulty="入门", relatedConcepts=["Function Calling", "API"], sourceIds=["as_002"]),
            KnowledgeCard(id="ac_004", title="记忆机制", summary="记忆让 Agent 能跨轮次保持上下文和学习。", bullets=["短期记忆保存对话历史", "长期记忆存储用户偏好", "向量数据库常用于长期记忆"], tags=["AI Agent", "Memory"], difficulty="进阶", relatedConcepts=["RAG", "Vector DB", "Memory"], sourceIds=["as_003"]),
            KnowledgeCard(id="ac_005", title="规划策略", summary="复杂任务需要规划，常见策略包括 Plan-and-Execute 和 ReAct。", bullets=["先制定计划再执行", "根据反馈动态调整", "分解任务降低难度"], tags=["AI Agent", "Planning"], difficulty="进阶", relatedConcepts=["Planning", "Reflection"], sourceIds=["as_003"]),
        ],
        graph=Graph(
            nodes=[
                GraphNode(id="agent", label="AI Agent", type="topic"),
                GraphNode(id="llm", label="LLM", type="concept"),
                GraphNode(id="tool", label="Tool", type="concept"),
                GraphNode(id="planning", label="Planning", type="concept"),
                GraphNode(id="memory", label="Memory", type="concept"),
                GraphNode(id="react", label="ReAct", type="practice"),
            ],
            edges=[
                GraphEdge(source="agent", target="llm", label="由...驱动"),
                GraphEdge(source="agent", target="tool", label="调用"),
                GraphEdge(source="agent", target="planning", label="使用"),
                GraphEdge(source="agent", target="memory", label="依赖"),
                GraphEdge(source="planning", target="react", label="实例"),
            ],
        ),
        learningPath=[
            LearningStep(level=1, title="大模型与工具调用", goal="理解 Function Calling 和工具描述", estimatedHours=2, resources=["OpenAI Function Calling 文档"], tasks=["实现一个能调用计算器的 LLM 程序"]),
            LearningStep(level=2, title="ReAct 思想", goal="理解推理与行动交替的范式", estimatedHours=2, resources=["ReAct 论文"], tasks=["画出 ReAct 循环"]),
            LearningStep(level=3, title="最小 Agent 实现", goal="手写一个循环：思考 -> 行动 -> 观察", estimatedHours=3, resources=["LangChain Agents 文档"], tasks=["实现一个搜索 Agent"]),
            LearningStep(level=4, title="规划与记忆", goal="让 Agent 能分解任务并记住上下文", estimatedHours=2, resources=["Building Effective Agents"], tasks=["添加任务队列和简单记忆"]),
            LearningStep(level=5, title="项目实战", goal="完成一个能解决实际问题的 Agent", estimatedHours=3, resources=["LangChain / AutoGPT"], tasks=["集成多个工具完成研究任务"]),
        ],
        tasks=[
            TaskItem(id="at_001", title="实现 ReAct 循环", description="用 Python 手写 Thought/Action/Observation 循环", estimatedMinutes=90, priority="high", source="ac_002"),
            TaskItem(id="at_002", title="接入搜索工具", description="让 Agent 能调用一个搜索 API", estimatedMinutes=60, priority="high", source="ac_003"),
            TaskItem(id="at_003", title="阅读 Building Effective Agents", description="理解 Agent 工程化最佳实践", estimatedMinutes=45, priority="medium", source="ac_005"),
            TaskItem(id="at_004", title="添加简单记忆", description="让 Agent 记住用户偏好", estimatedMinutes=60, priority="low", source="ac_004"),
        ],
    )


def _generic_response(topic: str) -> ResearchResponse:
    return ResearchResponse(
        topic=topic,
        brief=Brief(
            oneLineSummary=f"{topic} 是值得学习的技术方向。",
            whyLearn="掌握它能提升开发效率和解决问题的能力。",
            keyTakeaways=[
                f"理解 {topic} 的核心概念",
                "动手完成一个最小示例",
                "阅读官方文档和社区最佳实践",
            ],
            estimatedTime="6 小时",
            nextAction=f"搜索 {topic} 官方文档并完成 Quickstart",
        ),
        sources=[
            Source(id="gs_001", title=f"{topic} 官方文档", source="Official", url="https://example.com/docs", type="docs", qualityScore=90, reason="权威资料", readingTime=20),
            Source(id="gs_002", title=f"{topic} 入门教程", source="Blog", url="https://example.com/tutorial", type="article", qualityScore=80, reason="适合初学者", readingTime=15),
            Source(id="gs_003", title=f"{topic} 示例项目", source="GitHub", url="https://github.com/example/demo", type="repo", qualityScore=85, reason="含可运行代码", readingTime=10),
            Source(id="gs_004", title=f"{topic} 常见问题", source="Stack Overflow", url="https://stackoverflow.com/questions/tagged/example", type="article", qualityScore=70, reason="解决实际问题", readingTime=15),
            Source(id="gs_005", title=f"{topic} 实战视频", source="YouTube", url="https://www.youtube.com/results?search_query=example", type="video", qualityScore=75, reason="视频演示", readingTime=25),
        ],
        cards=[
            KnowledgeCard(id="gc_001", title=f"{topic} 基础概念", summary=f"介绍 {topic} 最重要的核心概念。", bullets=[f"理解 {topic} 的设计目标", "掌握关键术语", "了解常见使用场景"], tags=[topic], difficulty="入门", relatedConcepts=["核心概念", "术语"], sourceIds=["gs_001"]),
            KnowledgeCard(id="gc_002", title=f"{topic} 环境搭建", summary="配置本地开发环境，跑通第一个程序。", bullets=["安装必要依赖", "配置环境变量", "运行官方示例"], tags=[topic, "环境"], difficulty="入门", relatedConcepts=["安装", "配置"], sourceIds=["gs_002"]),
            KnowledgeCard(id="gc_003", title=f"{topic} 核心 API", summary="熟悉最常用的 API 或命令。", bullets=["列出 5 个核心 API", "理解参数含义", "查看返回结果"], tags=[topic], difficulty="进阶", relatedConcepts=["API", "接口"], sourceIds=["gs_001", "gs_003"]),
            KnowledgeCard(id="gc_004", title=f"{topic} 最佳实践", summary="避免常见陷阱，写出可维护的代码。", bullets=["遵循社区约定", "注意性能影响", "编写可测试代码"], tags=[topic, "最佳实践"], difficulty="进阶", relatedConcepts=["性能", "可维护性"], sourceIds=["gs_004"]),
            KnowledgeCard(id="gc_005", title=f"{topic} 最小项目", summary="通过一个完整小项目串联所学知识。", bullets=["确定项目范围", "分步骤实现", "总结遇到的问题"], tags=[topic, "实践"], difficulty="入门", relatedConcepts=["项目", "实战"], sourceIds=["gs_003"]),
        ],
        graph=Graph(
            nodes=[
                GraphNode(id="topic", label=topic, type="topic"),
                GraphNode(id="concept", label="核心概念", type="concept"),
                GraphNode(id="setup", label="环境搭建", type="practice"),
                GraphNode(id="api", label="核心 API", type="concept"),
                GraphNode(id="best_practice", label="最佳实践", type="concept"),
            ],
            edges=[
                GraphEdge(source="topic", target="concept", label="包含"),
                GraphEdge(source="topic", target="setup", label="需要"),
                GraphEdge(source="topic", target="api", label="提供"),
                GraphEdge(source="topic", target="best_practice", label="遵循"),
            ],
        ),
        learningPath=[
            LearningStep(level=1, title="了解背景", goal="理解学习该技术的原因和应用场景", estimatedHours=1, resources=["官方介绍"], tasks=["写一篇 100 字介绍"]),
            LearningStep(level=2, title="环境搭建", goal="跑通第一个 Hello World", estimatedHours=1, resources=["官方 Quickstart"], tasks=["完成安装并运行示例"]),
            LearningStep(level=3, title="核心概念", goal="掌握关键术语和基本原理", estimatedHours=2, resources=["官方文档"], tasks=["整理概念清单"]),
            LearningStep(level=4, title="API 实践", goal="能调用主要 API 完成常见任务", estimatedHours=2, resources=["API 参考"], tasks=["完成 3 个 API 调用练习"]),
            LearningStep(level=5, title="综合项目", goal="完成一个最小可用项目", estimatedHours=2, resources=["示例项目"], tasks=["实现并展示项目"]),
        ],
        tasks=[
            TaskItem(id="gt_001", title="完成 Quickstart", description="跑通官方快速入门示例", estimatedMinutes=60, priority="high", source="gc_002"),
            TaskItem(id="gt_002", title="整理核心概念", description="列出 10 个关键术语和定义", estimatedMinutes=45, priority="medium", source="gc_001"),
            TaskItem(id="gt_003", title="实现最小 Demo", description="做一个能展示该技术核心能力的小程序", estimatedMinutes=90, priority="high", source="gc_005"),
            TaskItem(id="gt_004", title="阅读最佳实践", description="总结 3 条应遵循的规范", estimatedMinutes=30, priority="low", source="gc_004"),
        ],
    )


def get_full_research(query: str) -> ResearchResponse:
    lowered = query.lower()
    if "mcp" in lowered:
        return _mcp_response()
    if "react" in lowered:
        return _react_response()
    if "agent" in lowered or "智能体" in query:
        return _agent_response()
    return _generic_response(_extract_topic(query))


def get_sources(query: str) -> list[Source]:
    return get_full_research(query).sources


def get_brief_and_cards(query: str) -> tuple[Brief, list[KnowledgeCard]]:
    resp = get_full_research(query)
    return resp.brief, resp.cards


def get_graph(query: str) -> Graph:
    return get_full_research(query).graph


def get_learning_path(query: str) -> list[LearningStep]:
    return get_full_research(query).learningPath


def get_tasks(query: str) -> list[TaskItem]:
    return get_full_research(query).tasks


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()
