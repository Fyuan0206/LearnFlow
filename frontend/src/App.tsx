import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  Layers3,
  Route,
  Sparkles,
  Target
} from 'lucide-react';
import { fetchHealth, fetchResearch } from './api/research';
import { AppHeader } from './components/AppHeader';
import { InsightPanel, type InsightTab } from './components/InsightPanel';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { ParticleField } from './components/ParticleField';
import { SourcePanel } from './components/SourcePanel';
import { findCardForNode } from './lib/graphUtils';
import { buildDemoWorkspace, getWorkflowSteps, type KnowledgeCard, type Workspace } from './lib/knowledgeModel';
import { mapResearchToWorkspace, pickInitialNodeId } from './lib/mapResearchResponse';

type LoadState = 'idle' | 'loading' | 'error';
type AppRoute = 'landing' | 'workspace';

function getRouteFromHash(): AppRoute {
  return window.location.hash === '#workspace' ? 'workspace' : 'landing';
}

export function App() {
  const [topic, setTopic] = useState('AI Agent');
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromHash());
  const [workspace, setWorkspace] = useState<Workspace>(() => buildDemoWorkspace('AI Agent'));
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<InsightTab>('融合');
  const [selectedCard, setSelectedCard] = useState<KnowledgeCard | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>('ai-agent');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [tick, setTick] = useState(0);

  const workflowSteps = useMemo(() => getWorkflowSteps(), []);

  const selectedSources = selectedCard
    ? workspace.sources.filter((source) => selectedCard.sourceIds.includes(source.id))
    : workspace.sources.slice(0, 3);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 650);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    function syncRoute() {
      setRoute(getRouteFromHash());
    }

    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchHealth()
      .then(() => {
        if (!cancelled) {
          setBackendOnline(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBackendOnline(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const applyWorkspace = useCallback((nextWorkspace: Workspace) => {
    setWorkspace(nextWorkspace);
    const initialNodeId = pickInitialNodeId(nextWorkspace);
    const initialCard = initialNodeId ? findCardForNode(nextWorkspace.cards, initialNodeId) : nextWorkspace.cards[0];
    setActiveNodeId(initialNodeId);
    setSelectedCard(initialCard ?? null);
    setActiveTab('融合');
  }, []);

  const handleGenerate = useCallback(async () => {
    const query = topic.trim();
    if (!query || loadState === 'loading') {
      return;
    }

    setLoadState('loading');
    setErrorMessage(null);

    try {
      const response = await fetchResearch(query);
      applyWorkspace(mapResearchToWorkspace(response));
      setLoadState('idle');
    } catch (error) {
      setLoadState('error');
      setErrorMessage(error instanceof Error ? error.message : '生成失败，请稍后重试');
    }
  }, [applyWorkspace, loadState, topic]);

  function handleNodeSelect(nodeId: string) {
    const card = findCardForNode(workspace.cards, nodeId);
    setActiveNodeId(nodeId);
    setSelectedCard(card ?? workspace.cards[0] ?? null);
    setActiveTab('卡片');
    if (rightCollapsed) {
      setRightCollapsed(false);
    }
  }

  function goToLanding() {
    window.location.hash = '';
    setRoute('landing');
  }

  function goToWorkspace() {
    window.location.hash = 'workspace';
    setRoute('workspace');
  }

  const workspaceClassName = [
    'workspace',
    leftCollapsed && 'is-left-collapsed',
    rightCollapsed && 'is-right-collapsed',
    loadState === 'loading' && 'is-loading'
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <main className="app-shell">
      <ParticleField />
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="app-container">
        {route === 'landing' ? (
          <LandingPage onStart={goToWorkspace} />
        ) : (
          <>
            <AppHeader
              backendOnline={backendOnline}
              isGenerating={loadState === 'loading'}
              onGenerate={() => void handleGenerate()}
              onHome={goToLanding}
              onTopicChange={setTopic}
              topic={topic}
            />
            {errorMessage && (
              <div className="status-banner status-banner-error" role="alert">
                {errorMessage}
                {!backendOnline && ' · 请确认后端已在 8000 端口启动'}
              </div>
            )}
            <section aria-busy={loadState === 'loading'} className={workspaceClassName}>
              {loadState === 'loading' && (
                <div className="workspace-loading">
                  <span className="loading-spinner" aria-hidden="true" />
                  <p>正在调用 LLM 生成知识地图…</p>
                  <span>发现资料 → 融合卡片 → 规划路径，约需 30–60 秒</span>
                </div>
              )}
              <SourcePanel
                collapsed={leftCollapsed}
                onToggle={() => setLeftCollapsed((value) => !value)}
                sources={workspace.sources}
              />
              <KnowledgeGraph
                activeNodeId={activeNodeId}
                graph={workspace.graph}
                onNodeSelect={handleNodeSelect}
                tick={tick}
                topic={workspace.topic}
                workflowSteps={workflowSteps}
              />
              <InsightPanel
                activeTab={activeTab}
                collapsed={rightCollapsed}
                onCardSelect={setSelectedCard}
                onTabChange={setActiveTab}
                onToggle={() => setRightCollapsed((value) => !value)}
                selectedCard={selectedCard}
                selectedSources={selectedSources}
                workspace={workspace}
              />
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function LandingPage({ onStart }: { onStart: () => void }) {
  const featureCards = [
    {
      icon: <BrainCircuit size={20} />,
      title: '多源知识融合',
      body: '把文档、论文、视频和项目资料压缩成可追溯的共识、争议和洞察。'
    },
    {
      icon: <Layers3 size={20} />,
      title: '动态知识图谱',
      body: '用概念层、工具层和项目层展示学习路径，节点可点击展开卡片。'
    },
    {
      icon: <Target size={20} />,
      title: '行动计划拆解',
      body: '把学习目标拆成今天能开始的阅读、观看和实践任务。'
    }
  ];

  const flowSteps = ['输入主题', '发现资料', '提炼卡片', '生成图谱', '拆解行动'];

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="brand landing-brand">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>
          <div>
            <p>LearnFlow AI</p>
            <span>知识到行动系统</span>
          </div>
        </div>
        <button className="landing-nav-cta" onClick={onStart} type="button">
          进入工作台
          <ArrowRight size={16} />
        </button>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <span className="eyebrow">Personal Knowledge OS</span>
          <h1>把一个学习主题，变成可执行的知识地图。</h1>
          <p>
            LearnFlow AI 面向开发者和技术学习者：输入 MCP、AI Agent 或 RAG 这样的主题，系统会自动汇总资料、生成知识卡片、构建图谱，并拆解今日行动。
          </p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={onStart} type="button">
              开始生成知识图谱
              <ArrowRight size={18} />
            </button>
            <a className="secondary-cta" href="#features">
              查看项目能力
            </a>
          </div>
          <div className="hero-metrics" aria-label="项目指标">
            <div>
              <strong>6</strong>
              <span>步知识流</span>
            </div>
            <div>
              <strong>3</strong>
              <span>层图谱结构</span>
            </div>
            <div>
              <strong>1</strong>
              <span>日行动计划</span>
            </div>
          </div>
        </div>

        <div className="hero-product" aria-label="LearnFlow 产品预览">
          <div className="hero-product-header">
            <span>AI Agent 动态知识星图</span>
            <strong>58%</strong>
          </div>
          <div className="hero-map-preview">
            <span className="preview-node preview-center">AI Agent</span>
            <span className="preview-node preview-a">LLM</span>
            <span className="preview-node preview-b">Tool Calling</span>
            <span className="preview-node preview-c">Memory</span>
            <span className="preview-node preview-d">RAG</span>
            <span className="preview-line line-a" />
            <span className="preview-line line-b" />
            <span className="preview-line line-c" />
          </div>
          <div className="hero-product-footer">
            {flowSteps.slice(1, 4).map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" id="features">
        <div className="section-heading">
          <span className="eyebrow">核心能力</span>
          <h2>不只是搜索资料，而是把知识推到下一步行动。</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((feature) => (
            <article className="landing-card" key={feature.title}>
              <div>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-flow">
        <div className="section-heading">
          <span className="eyebrow">工作流</span>
          <h2>从输入主题到行动计划，一屏完成闭环。</h2>
        </div>
        <div className="flow-rail">
          {flowSteps.map((step, index) => (
            <div className="flow-step" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-final">
        <div>
          <BookOpenCheck size={22} />
          <h2>准备把下一个技术主题拆开看看？</h2>
          <p>进入工作台后，你可以切换主题、点选知识节点、查看卡片来源和今日任务。</p>
        </div>
        <button className="primary-cta" onClick={onStart} type="button">
          打开 LearnFlow 工作台
          <Route size={18} />
        </button>
      </section>
    </div>
  );
}
