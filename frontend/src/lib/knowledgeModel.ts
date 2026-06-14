export type SourceType = 'Doc' | 'GitHub' | 'Blog' | 'Video' | 'Podcast' | 'Paper';

export type Source = {
  id: string;
  type: SourceType;
  title: string;
  score: number;
  summary: string;
  reason: string;
  extracted: string[];
};

export type KnowledgeCard = {
  id: string;
  title: string;
  oneLiner: string;
  concepts: string[];
  useCases: string[];
  relatedNodeIds: string[];
  sourceIds: string[];
};

export type ProjectLevel = '入门' | '进阶' | '高级';
export type Difficulty = '简单' | '中等' | '困难';
export type TaskMode = '阅读' | '观看' | '实践';

export type GraphNode = {
  id: string;
  label: string;
  type: 'concept' | 'tool' | 'source' | 'project' | 'task';
  layer: 'concept' | 'tool' | 'project';
  x: number;
  y: number;
  importance: number;
};

export type GraphEdge = {
  source: string;
  target: string;
  relation: string;
  weight: number;
};

export type Workspace = {
  topic: string;
  sources: Source[];
  fusion: {
    consensus: string[];
    debates: string[];
    uniqueInsights: string[];
  };
  cards: KnowledgeCard[];
  maturity: {
    mastered: string[];
    nextGaps: string[];
    readiness: number;
    summary: string;
  };
  projects: Array<{
    level: ProjectLevel;
    title: string;
    description: string;
    stack: string[];
    outcome: string;
  }>;
  graph: {
    layers: Array<{ name: string; description: string }>;
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  learningPath: Array<{
    level: number;
    title: string;
    minutes: number;
    difficulty: Difficulty;
    relatedCardIds: string[];
  }>;
  todayPlan: Array<{
    title: string;
    minutes: number;
    mode: TaskMode;
  }>;
};

export function buildDemoWorkspace(topic: string): Workspace {
  const normalizedTopic = topic.trim() || 'MCP';

  return {
    topic: normalizedTopic,
    sources: buildSources(),
    fusion: {
      consensus: [
        'MCP 的核心共识是：它不是单个工具，而是 AI 应用连接外部能力的标准化协议层。',
        '多来源内容都强调 Host、Client、Server、Tool 的职责拆分，这能降低 AI 应用和工具实现之间的耦合。',
        'MCP 的价值不只在协议本身，而在接入 IDE、知识库、API、企业系统后的真实工作流。'
      ],
      debates: [
        '一部分资料把 MCP 看作轻量集成标准，另一部分资料认为它会演化成 Agent 基础设施。',
        '社区示例偏向本地快速 Demo，但生产环境还需要权限控制、可观测性、审计和安全边界。'
      ],
      uniqueInsights: [
        '学习 MCP 不应该只背协议概念，更应该把它放进 Context Engineering 和工具边界设计里理解。',
        '最短的能力验证路径不是读完所有文档，而是先做一个天气查询或笔记检索 MCP Server。',
        '项目层是知识真正沉淀的位置，因为用户必须亲自调通 Host、Client、Server 的交互链路。'
      ]
    },
    cards: buildCards(),
    maturity: {
      mastered: ['AI Agent 基础概念', 'Tool Calling 心智模型', 'HTTP API 基础'],
      nextGaps: ['MCP Server 实现', 'Host 配置与调试', 'Tool Schema 测试'],
      readiness: 68,
      summary: '你已经具备理解 MCP 的基础，但还需要完成一个可运行的 Server 项目，才能进入多 Agent 工作流。'
    },
    projects: [
      {
        level: '入门',
        title: '天气查询 MCP Server',
        description: '暴露一个天气查询 Tool，并在本地 Host 中完成一次真实调用。',
        stack: ['TypeScript', 'MCP SDK', 'OpenWeather API'],
        outcome: '得到一个能返回结构化天气数据的最小可用 MCP 工具。'
      },
      {
        level: '进阶',
        title: '个人知识库 MCP Server',
        description: '连接 Markdown 笔记或项目文档，暴露搜索和读取两个工具。',
        stack: ['Python', 'FastAPI', 'SQLite', 'Embeddings'],
        outcome: '让 AI 助手基于个人资料给出可追溯回答。'
      },
      {
        level: '高级',
        title: '多工具 Agent 工作台',
        description: '把搜索、记忆、任务三个工具组合成一个小型 Agent 工作流。',
        stack: ['React', 'FastAPI', 'MCP', 'PostgreSQL'],
        outcome: '形成一个能展示 Agent 执行闭环的项目级原型。'
      }
    ],
    graph: {
      layers: [
        { name: '概念层', description: '先理解 MCP、Agent、Tool Calling 的基本关系。' },
        { name: '工具层', description: '再掌握 Server、Client、Host、框架和调试工具。' },
        { name: '项目层', description: '最后通过项目验证是否真的具备实践能力。' }
      ],
      nodes: [
        { id: 'mcp', label: 'MCP', type: 'concept', layer: 'concept', x: 50, y: 46, importance: 96 },
        { id: 'agent', label: 'AI Agent', type: 'concept', layer: 'concept', x: 29, y: 25, importance: 90 },
        { id: 'tool-calling', label: 'Tool Calling', type: 'concept', layer: 'concept', x: 72, y: 25, importance: 92 },
        { id: 'mcp-server', label: 'MCP Server', type: 'tool', layer: 'tool', x: 29, y: 63, importance: 88 },
        { id: 'mcp-client', label: 'MCP Client', type: 'tool', layer: 'tool', x: 51, y: 72, importance: 78 },
        { id: 'fastapi', label: 'FastAPI', type: 'tool', layer: 'tool', x: 74, y: 63, importance: 70 },
        { id: 'cursor', label: 'Cursor', type: 'tool', layer: 'tool', x: 18, y: 44, importance: 72 },
        { id: 'claude', label: 'Claude', type: 'tool', layer: 'tool', x: 82, y: 44, importance: 72 },
        { id: 'demo-project', label: '天气工具 Demo', type: 'project', layer: 'project', x: 43, y: 88, importance: 82 },
        { id: 'knowledge-project', label: '知识库 Server', type: 'project', layer: 'project', x: 66, y: 88, importance: 84 }
      ],
      edges: [
        { source: 'agent', target: 'mcp', relation: 'uses', weight: 0.88 },
        { source: 'tool-calling', target: 'mcp', relation: 'explains', weight: 0.9 },
        { source: 'mcp', target: 'mcp-server', relation: 'is_part_of', weight: 0.92 },
        { source: 'mcp', target: 'mcp-client', relation: 'is_part_of', weight: 0.82 },
        { source: 'mcp-server', target: 'fastapi', relation: 'implemented_with', weight: 0.74 },
        { source: 'cursor', target: 'mcp-client', relation: 'hosts', weight: 0.7 },
        { source: 'claude', target: 'mcp-client', relation: 'hosts', weight: 0.72 },
        { source: 'mcp-server', target: 'demo-project', relation: 'enables', weight: 0.9 },
        { source: 'fastapi', target: 'knowledge-project', relation: 'enables', weight: 0.82 }
      ]
    },
    learningPath: [
      {
        level: 1,
        title: '复习 AI Agent 与 Tool Calling 基础',
        minutes: 35,
        difficulty: '简单',
        relatedCardIds: ['card-tool']
      },
      {
        level: 2,
        title: '理解 MCP Host、Client、Server 的职责',
        minutes: 45,
        difficulty: '中等',
        relatedCardIds: ['card-mcp']
      },
      {
        level: 3,
        title: '搭建一个最小 MCP Server',
        minutes: 70,
        difficulty: '中等',
        relatedCardIds: ['card-server']
      },
      {
        level: 4,
        title: '接入 Cursor 或 Claude 进行联调',
        minutes: 50,
        difficulty: '中等',
        relatedCardIds: ['card-cursor']
      },
      {
        level: 5,
        title: '把 Demo 升级成个人知识助手',
        minutes: 120,
        difficulty: '困难',
        relatedCardIds: ['card-server', 'card-tool']
      }
    ],
    todayPlan: [
      { title: '阅读 MCP 官方架构章节', minutes: 15, mode: '阅读' },
      { title: '观看 Tool Calling 心智模型讲解', minutes: 20, mode: '观看' },
      { title: '实现天气查询 Tool Schema', minutes: 40, mode: '实践' }
    ]
  };
}

export function getWorkflowSteps(): Array<{ label: string }> {
  return [
    { label: '发现多源内容' },
    { label: '筛选高价值信号' },
    { label: '融合知识观点' },
    { label: '生成动态星图' },
    { label: '规划成长路径' },
    { label: '拆解今日行动' }
  ];
}

function buildSources(): Source[] {
  return [
    {
      id: 'mcp-spec',
      type: 'Doc',
      title: 'Model Context Protocol 官方规范',
      score: 96,
      summary: '定义 Host、Client、Server、Tool、Resource 等核心协议概念。',
      reason: '最权威的协议词汇和边界说明，适合作为学习起点。',
      extracted: ['Host / Client / Server 拆分', 'Tool 声明', '传输模型']
    },
    {
      id: 'mcp-github',
      type: 'GitHub',
      title: 'modelcontextprotocol/servers',
      score: 92,
      summary: '包含参考 Server 和社区示例，展示 MCP 如何连接外部系统。',
      reason: '能看到真实 Server 形态，比只读规范更容易理解工程落地。',
      extracted: ['Server 模板', 'Tool Schema', '文件系统与 API 示例']
    },
    {
      id: 'mcp-blog',
      type: 'Blog',
      title: '从零构建第一个 MCP Server',
      score: 89,
      summary: '用实战步骤讲解 MCP Server 的实现、启动和调试流程。',
      reason: '把抽象协议转成可执行步骤，适合比赛 Demo 展示。',
      extracted: ['本地开发流程', 'Tool 实现', '调试方法']
    },
    {
      id: 'tool-video',
      type: 'Video',
      title: 'Tool Calling 与 Agent 上下文讲解',
      score: 84,
      summary: '解释模型为什么需要结构化工具，以及 MCP 如何承接工具边界。',
      reason: '帮助用户把 LLM 基础和 MCP 架构连接起来。',
      extracted: ['Tool Calling 心智模型', '上下文限制', 'Agent 工作流']
    },
    {
      id: 'agent-podcast',
      type: 'Podcast',
      title: 'AI Agent 如何连接软件工具',
      score: 78,
      summary: '讨论 Agent 生态、互操作性，以及工具市场可能的演化方向。',
      reason: '补充产品和生态视角，让项目不只是技术 Demo。',
      extracted: ['Agent 互操作', '工具市场', '生态锁定']
    },
    {
      id: 'rag-paper',
      type: 'Paper',
      title: 'LLM 应用中的 Context Engineering 模式',
      score: 81,
      summary: '把 MCP 放进检索、记忆、工具调用等上下文工程体系中理解。',
      reason: '能解释 MCP 和 RAG、Memory、外部工具之间的关系。',
      extracted: ['上下文工程', '检索边界', '外部记忆']
    }
  ];
}

function buildCards(): KnowledgeCard[] {
  return [
    {
      id: 'card-mcp',
      title: 'MCP 协议',
      oneLiner: 'MCP 标准化了 AI 应用连接工具、数据和外部系统的方式。',
      concepts: ['Host', 'Client', 'Server', 'Tool', 'Resource'],
      useCases: ['Agent 工具调用', 'IDE 助手', '知识检索'],
      relatedNodeIds: ['mcp', 'tool-calling', 'mcp-server', 'mcp-client'],
      sourceIds: ['mcp-spec', 'mcp-github']
    },
    {
      id: 'card-server',
      title: 'MCP Server',
      oneLiner: 'MCP Server 负责向 AI 应用暴露可调用的工具和资源。',
      concepts: ['Tool Schema', '请求处理', '能力边界'],
      useCases: ['天气查询', '数据库查询', '文件系统访问'],
      relatedNodeIds: ['mcp-server', 'fastapi', 'demo-project'],
      sourceIds: ['mcp-spec', 'mcp-github', 'mcp-blog']
    },
    {
      id: 'card-tool',
      title: 'Tool Calling',
      oneLiner: 'Tool Calling 让模型发起结构化动作，而不是凭空猜答案。',
      concepts: ['JSON Schema', '参数', '执行结果'],
      useCases: ['API 调用', '搜索流程', '代码助手'],
      relatedNodeIds: ['tool-calling', 'agent', 'mcp-server'],
      sourceIds: ['tool-video', 'rag-paper']
    },
    {
      id: 'card-cursor',
      title: 'Cursor / Claude 集成',
      oneLiner: '当 Host 应用能发现并调用本地 Server 时，MCP 才真正进入工作流。',
      concepts: ['Host 配置', 'Client Session', '本地 Server'],
      useCases: ['IDE 自动化', '个人知识工具', '开发者工作流'],
      relatedNodeIds: ['cursor', 'claude', 'demo-project'],
      sourceIds: ['mcp-spec', 'agent-podcast']
    }
  ];
}
