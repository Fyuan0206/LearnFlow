import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarCheck,
  Cards,
  CheckCircle,
  Circle,
  Clock,
  Database,
  DotsThreeVertical,
  DownloadSimple,
  FileText,
  GearSix,
  Graph,
  HouseLine,
  Lightning,
  MagnifyingGlass,
  NotePencil,
  RocketLaunch,
  ShareNetwork,
  Sparkle,
  Star,
  Target,
  TrendUp,
} from "@phosphor-icons/react";
import "./styles.css";

const examples = ["我要学 MCP", "AI Agent 入门", "React 性能优化"];

const libraryItems = [
  { title: "MCP 学习笔记", meta: "38 条 · 昨天", color: "blue" },
  { title: "AI Agent 实践", meta: "24 条 · 3 天前", color: "cyan" },
  { title: "LLM 应用开发", meta: "56 条 · 1 周前", color: "orange" },
  { title: "优秀开源项目", meta: "19 条 · 2 周前", color: "slate" },
  { title: "技术文章精选", meta: "27 条 · 1 天前", color: "teal" },
];

const stats = [
  { label: "资料总数", value: "128", delta: "+12%", icon: Database, tone: "blue" },
  { label: "知识卡片", value: "36", delta: "+8%", icon: FileText, tone: "green" },
  { label: "关联关系", value: "268", delta: "+15%", icon: Graph, tone: "violet" },
  { label: "预计学习时长", value: "4.2小时", delta: "-10%", icon: Clock, tone: "teal" },
  { label: "覆盖领域", value: "8", delta: "稳定", icon: GearSix, tone: "slate" },
  { label: "信心度", value: "85%", delta: "+6%", icon: Target, tone: "cyan" },
];

const cardsSeed = [
  {
    id: "card-1",
    title: "MCP 是什么？",
    summary:
      "Model Context Protocol 是 Anthropic 提出的开放协议，用于标准化应用与大模型之间的上下文交互和工具调用。",
    tags: ["MCP", "基础概念", "官方文档"],
    difficulty: "入门",
    time: "3 小时前",
  },
  {
    id: "card-2",
    title: "MCP 架构概览",
    summary:
      "MCP 采用客户端-服务器架构，Client 连接一个或多个 MCP Server，Server 暴露工具、资源和提示词。",
    tags: ["架构", "客户端-服务器", "核心概念"],
    difficulty: "入门",
    time: "2 小时前",
  },
  {
    id: "card-3",
    title: "MCP 与 Function Calling 对比",
    summary:
      "MCP 更强调工具的发现、权限控制与可组合性，而 Function Calling 偏向模型原生的函数调用能力。",
    tags: ["对比", "Function Calling", "差异"],
    difficulty: "进阶",
    time: "1 小时前",
  },
  {
    id: "card-4",
    title: "如何快速开始 MCP",
    summary:
      "通过 mcp-server-cli 快速创建本地 MCP Server，并在 Claude Desktop 中配置后完成调试。",
    tags: ["实践", "快速开始", "Claude Desktop"],
    difficulty: "实践",
    time: "45 分钟前",
  },
  {
    id: "card-5",
    title: "MCP 安全最佳实践",
    summary:
      "包括最小权限、输入校验、审计日志、工具白名单等，保障 MCP 应用的安全性。",
    tags: ["安全", "最佳实践", "生产环境"],
    difficulty: "高阶",
    time: "30 分钟前",
  },
];

const sources = [
  { title: "MCP 官方文档：核心概念", type: "docs", score: 96, source: "Anthropic", time: "30 分钟" },
  { title: "awesome-mcp-servers", type: "repo", score: 91, source: "GitHub", time: "45 分钟" },
  { title: "MCP 与 Function Calling 有何区别", type: "article", score: 88, source: "技术博客", time: "18 分钟" },
  { title: "从零搭建一个本地 MCP Server", type: "video", score: 84, source: "Bilibili", time: "60 分钟" },
];

const pathStages = [
  { n: 1, title: "认识 MCP", time: "30 分钟", points: ["什么是 MCP", "MCP 的设计目标", "适用场景"] },
  { n: 2, title: "MCP 核心概念", time: "60 分钟", points: ["架构与组件", "工具、资源、提示词", "客户端与 Server"] },
  { n: 3, title: "动手实践", time: "90 分钟", points: ["搭建本地 Server", "在 Claude Desktop 中使用", "调试与日志"] },
  { n: 4, title: "进阶与集成", time: "60 分钟", points: ["与现有系统集成", "权限与安全", "性能优化"] },
  { n: 5, title: "最佳实践与案例", time: "60 分钟", points: ["安全最佳实践", "优秀案例分析", "常见问题"] },
];

const graphNodes = [
  { id: "mcp", label: "MCP", type: "core", x: 51, y: 48 },
  { id: "arch", label: "架构", type: "green", x: 45, y: 24 },
  { id: "app", label: "应用场景", type: "orange", x: 27, y: 42 },
  { id: "cap", label: "核心能力", type: "purple", x: 70, y: 38 },
  { id: "safe", label: "安全", type: "red", x: 33, y: 62 },
  { id: "eco", label: "实现与生态", type: "teal", x: 55, y: 73 },
  { id: "compare", label: "对比与集成", type: "blue", x: 75, y: 66 },
  { id: "tools", label: "工具 Tools", type: "purple", x: 84, y: 27 },
  { id: "server", label: "服务端", type: "green", x: 49, y: 15 },
  { id: "auto", label: "自动化任务", type: "orange", x: 16, y: 37 },
  { id: "audit", label: "审计日志", type: "red", x: 19, y: 70 },
  { id: "sdk", label: "SDK", type: "teal", x: 46, y: 84 },
  { id: "api", label: "API 集成", type: "blue", x: 86, y: 59 },
];

const graphEdges = [
  ["mcp", "arch"],
  ["mcp", "app"],
  ["mcp", "cap"],
  ["mcp", "safe"],
  ["mcp", "eco"],
  ["mcp", "compare"],
  ["cap", "tools"],
  ["arch", "server"],
  ["app", "auto"],
  ["safe", "audit"],
  ["eco", "sdk"],
  ["compare", "api"],
];

const initialTasks = [
  { id: "task-1", title: "阅读：MCP 官方文档「核心概念」", minutes: 30, done: true },
  { id: "task-2", title: "了解：MCP 架构与组件", minutes: 20, done: true },
  { id: "task-3", title: "动手：搭建一个本地 MCP Server", minutes: 60, done: true },
  { id: "task-4", title: "配置：在 Claude Desktop 中使用", minutes: 30, done: true },
  { id: "task-5", title: "学习：MCP 安全最佳实践", minutes: 45, done: false },
  { id: "task-6", title: "对比：MCP 与 Function Calling", minutes: 30, done: false },
  { id: "task-7", title: "总结：整理学习笔记", minutes: 30, done: false },
  { id: "task-8", title: "扩展：寻找一个开源 MCP 项目", minutes: 45, done: false },
];

function App() {
  const [topic, setTopic] = useState("我要学 MCP");
  const [activeTab, setActiveTab] = useState("知识卡片");
  const [saved, setSaved] = useState(new Set(["card-1"]));
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(false);
  const doneCount = tasks.filter((task) => task.done).length;
  const totalMinutes = tasks.reduce((sum, task) => sum + task.minutes, 0);
  const savedCards = cardsSeed.filter((card) => saved.has(card.id));

  const tabContent = useMemo(() => {
    if (activeTab === "今日简报") {
      return <BriefPanel topic={topic} tasks={tasks} />;
    }

    if (activeTab === "内容来源") {
      return <SourcesPanel />;
    }

    if (activeTab === "学习路径") {
      return <PathPanel compact={false} />;
    }

    if (activeTab === "行动计划") {
      return <TasksPanel tasks={tasks} setTasks={setTasks} expanded />;
    }

    return (
      <ResearchBoard
        saved={saved}
        setSaved={setSaved}
        tasks={tasks}
        setTasks={setTasks}
        doneCount={doneCount}
      />
    );
  }, [activeTab, doneCount, saved, tasks, topic]);

  function runResearch() {
    setLoading(true);
    setTimeout(() => {
      setActiveTab("知识卡片");
      setLoading(false);
    }, 900);
  }

  return (
    <div className="app-shell">
      <Sidebar savedCards={savedCards} />
      <main className="workspace">
        <Header />
        <section className="hero-row">
          <div className="query-box">
            <div className="query-input">
              <Sparkle weight="fill" />
              <input
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                aria-label="输入学习主题"
                placeholder="输入一个学习主题、关键词或 URL"
              />
              {topic && (
                <button className="ghost-icon" onClick={() => setTopic("")} aria-label="清空输入">
                  ×
                </button>
              )}
              <button className="run-button" onClick={runResearch} disabled={!topic.trim() || loading}>
                {loading ? "生成中" : <ArrowRight weight="bold" />}
              </button>
            </div>
            <div className="example-row">
              <span>示例：</span>
              {examples.map((item) => (
                <button key={item} onClick={() => setTopic(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="status-box">
            <div className="status-title">
              <span>生成状态</span>
              <span className="live-dot" />
              <strong>{loading ? "生成中" : "已完成"}</strong>
            </div>
            <p>已找到 128 篇相关资料</p>
            <p>{loading ? "正在融合知识要点..." : "知识星图与今日计划已准备好"}</p>
            <small>{loading ? "预计剩余 18 秒" : "响应耗时 0.8 秒"}</small>
          </div>
        </section>

        <StatsBar />

        <section className="tabs-row">
          {["今日简报", "内容来源", "知识卡片", "知识星图", "学习路径", "行动计划"].map((tab) => (
            <button
              className={tab === activeTab ? "active" : ""}
              key={tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <div className="view-controls">
            <span>视图设置</span>
            <GearSix />
          </div>
        </section>

        {tabContent}

        <section className="bottom-summary">
          <div>
            <strong>今日学习负载</strong>
            <span>{Math.round(totalMinutes / 60)} 小时 · {doneCount}/{tasks.length} 已完成</span>
          </div>
          <div>
            <strong>我的知识库</strong>
            <span>{savedCards.length} 张卡片已收藏，可继续沉淀为复习集</span>
          </div>
          <button>查看完整报告</button>
        </section>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="topbar">
      <div className="brand-inline">
        <div className="brand-mark">K</div>
        <strong>个人知识与效率协作中枢</strong>
        <span>Demo</span>
      </div>
      <div className="topbar-actions">
        <span className="api-status">API 状态 <b>正常</b></span>
        <span className="health">健康度 <b>98%</b></span>
        <label className="search">
          <MagnifyingGlass />
          <input placeholder="搜索" />
          <kbd>⌘ K</kbd>
        </label>
        <Bell />
        <Circle />
        <div className="avatar">林</div>
        <span>开发者小林</span>
      </div>
    </header>
  );
}

function Sidebar({ savedCards }) {
  const nav = [
    [HouseLine, "AI 研究板", true],
    [Database, "我的知识库"],
    [CalendarCheck, "任务与计划"],
    [Star, "收藏与关注"],
    [Graph, "协作空间"],
    [GearSix, "设置"],
  ];

  return (
    <aside className="sidebar">
      <div className="side-brand">
        <div className="brand-mark">K</div>
        <strong>知识中枢</strong>
      </div>
      <nav>
        {nav.map(([Icon, label, active]) => (
          <button className={active ? "active" : ""} key={label}>
            <Icon />
            {label}
          </button>
        ))}
      </nav>
      <div className="library-block">
        <div className="library-head">
          <span>我的知识库</span>
          <button>+ 新建</button>
        </div>
        {libraryItems.map((item) => (
          <div className="library-item" key={item.title}>
            <i className={item.color} />
            <div>
              <strong>{item.title}</strong>
              <span>{item.meta}</span>
            </div>
          </div>
        ))}
        <a>查看全部知识库 →</a>
      </div>
      <div className="usage-card">
        <span>本月已使用</span>
        <strong>23,456 / 100,000 Tokens</strong>
        <div className="meter"><i /></div>
        <button><RocketLaunch /> 升级方案</button>
      </div>
    </aside>
  );
}

function StatsBar() {
  return (
    <section className="stats-grid">
      {stats.map(({ label, value, delta, icon: Icon, tone }) => (
        <div className="stat" key={label}>
          <div className={`stat-icon ${tone}`}>
            <Icon />
          </div>
          <div>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
          <small className={delta.startsWith("-") ? "negative" : ""}>
            <TrendUp />
            {delta}
          </small>
        </div>
      ))}
    </section>
  );
}

function ResearchBoard({ saved, setSaved, tasks, setTasks, doneCount }) {
  return (
    <section className="research-grid">
      <CardsPanel saved={saved} setSaved={setSaved} />
      <PathPanel compact />
      <GraphPanel />
      <TasksPanel tasks={tasks} setTasks={setTasks} doneCount={doneCount} />
    </section>
  );
}

function CardsPanel({ saved, setSaved }) {
  function toggleSave(id) {
    const next = new Set(saved);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSaved(next);
  }

  return (
    <section className="panel cards-panel">
      <PanelTitle title="知识卡片" meta="36" action="筛选" />
      <div className="card-list">
        {cardsSeed.map((card) => (
          <article className="knowledge-card" key={card.id}>
            <div className="knowledge-head">
              <FileText weight="fill" />
              <strong>{card.title}</strong>
              <button aria-label="更多"><DotsThreeVertical /></button>
            </div>
            <p>{card.summary}</p>
            <div className="tag-row">
              {card.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <div className="card-meta">
              <small>{card.difficulty} · {card.time}</small>
              <button className={saved.has(card.id) ? "saved" : ""} onClick={() => toggleSave(card.id)}>
                <Star weight={saved.has(card.id) ? "fill" : "regular"} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <button className="link-button">查看全部知识卡片 →</button>
    </section>
  );
}

function PathPanel({ compact }) {
  return (
    <section className={`panel path-panel ${compact ? "" : "wide-panel"}`}>
      <PanelTitle title="学习路径" meta="建议时长 4.2 小时" />
      <div className="timeline">
        {pathStages.map((stage) => (
          <div className="stage" key={stage.n}>
            <span>{stage.n}</span>
            <div>
              <strong>{stage.title}</strong>
              <small>{stage.time}</small>
              <ul>
                {stage.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <button className="link-button">查看完整学习路径 →</button>
    </section>
  );
}

function GraphPanel() {
  const nodeById = Object.fromEntries(graphNodes.map((node) => [node.id, node]));

  return (
    <section className="panel graph-panel">
      <div className="graph-toolbar">
        <PanelTitle title="知识星图" />
        <div>
          <span>关联强度</span>
          <input type="range" min="0" max="100" defaultValue="70" />
          <label><input type="checkbox" defaultChecked /> 显示标签</label>
          <DownloadSimple />
        </div>
      </div>
      <div className="graph-canvas" aria-label="MCP 知识星图">
        {graphEdges.map(([from, to]) => {
          const a = nodeById[from];
          const b = nodeById[to];
          return (
            <span
              className="edge"
              key={`${from}-${to}`}
              style={edgeStyle(a, b)}
            />
          );
        })}
        {graphNodes.map((node) => (
          <button
            className={`graph-node ${node.type}`}
            key={node.id}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {node.label}
          </button>
        ))}
      </div>
      <div className="legend">
        {["核心概念", "能力", "架构", "应用", "安全", "生态", "对比"].map((item, index) => (
          <span key={item}><i className={`legend-${index}`} />{item}</span>
        ))}
      </div>
      <div className="insight-box">
        <strong>星图洞察</strong>
        <p>MCP 的核心能力围绕工具、资源、提示词展开，是连接模型与外部世界的桥梁。</p>
        <p>安全与权限是 MCP 在生产环境落地的关键约束。</p>
      </div>
    </section>
  );
}

function TasksPanel({ tasks, setTasks, doneCount, expanded }) {
  const visibleTasks = expanded ? tasks : tasks.slice(0, 8);
  const completed = doneCount ?? tasks.filter((task) => task.done).length;

  function toggleTask(id) {
    setTasks((current) => current.map((task) => (
      task.id === id ? { ...task, done: !task.done } : task
    )));
  }

  return (
    <section className={`panel tasks-panel ${expanded ? "wide-panel" : ""}`}>
      <PanelTitle title="今日行动计划" meta={`${completed}/${tasks.length} 已完成`} />
      <div className="progress-line">
        <i style={{ width: `${(completed / tasks.length) * 100}%` }} />
      </div>
      <div className="task-list">
        {visibleTasks.map((task) => (
          <button className="task-row" key={task.id} onClick={() => toggleTask(task.id)}>
            {task.done ? <CheckCircle weight="fill" /> : <Circle />}
            <span>{task.title}</span>
            <small>{task.minutes} 分钟</small>
          </button>
        ))}
      </div>
      <button className="add-task">+ 添加任务</button>
      {!expanded && (
        <div className="questions">
          <div><strong>待处理问题</strong><a>查看全部 →</a></div>
          {["MCP 的权限模型如何设计更合理？", "如何监控 MCP Server 的运行状态？", "企业场景下如何管理 MCP 工具？"].map((q) => (
            <p key={q}>? {q}</p>
          ))}
        </div>
      )}
    </section>
  );
}

function BriefPanel({ topic, tasks }) {
  return (
    <section className="brief-layout">
      <div className="panel wide-panel">
        <PanelTitle title="今日简报" meta={topic} />
        <div className="brief-hero">
          <h1>{topic.replace("我要学 ", "")} 是连接 AI 与外部工具生态的开放协议</h1>
          <p>
            它把工具发现、权限控制、资源读取和提示词模板整理成统一接口，让 AI 应用更容易接入真实工作流。
          </p>
        </div>
        <div className="takeaways">
          {["先理解客户端-服务器架构", "再掌握 Tools / Resources / Prompts", "最后用一个本地 Server 验证闭环"].map((item) => (
            <span key={item}><CheckCircle weight="fill" />{item}</span>
          ))}
        </div>
      </div>
      <TasksPanel tasks={tasks} setTasks={() => {}} doneCount={tasks.filter((task) => task.done).length} />
    </section>
  );
}

function SourcesPanel() {
  return (
    <section className="panel wide-panel">
      <PanelTitle title="内容来源" meta="推荐阅读顺序" />
      <div className="source-table">
        {sources.map((source, index) => (
          <div className="source-row" key={source.title}>
            <span>{index + 1}</span>
            <strong>{source.title}</strong>
            <em>{source.type}</em>
            <small>{source.source}</small>
            <b>{source.score}</b>
            <button>生成卡片</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function PanelTitle({ title, meta, action }) {
  return (
    <div className="panel-title">
      <div>
        <strong>{title}</strong>
        {meta && <span>{meta}</span>}
      </div>
      {action && <button>{action}</button>}
    </div>
  );
}

function edgeStyle(a, b) {
  const x1 = a.x;
  const y1 = a.y;
  const x2 = b.x;
  const y2 = b.y;
  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  return {
    left: `${x1}%`,
    top: `${y1}%`,
    width: `${length}%`,
    transform: `rotate(${angle}deg)`,
  };
}

createRoot(document.getElementById("root")).render(<App />);
