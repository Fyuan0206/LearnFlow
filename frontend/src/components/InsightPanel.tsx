import type { ReactNode } from 'react';
import { BookOpen, BrainCircuit, CalendarPlus, ChevronLeft, ChevronRight, FileText, GitBranch, Layers3, Play, Sparkles, Target } from 'lucide-react';
import type { KnowledgeCard, Source, SourceType, Workspace } from '../lib/knowledgeModel';

export const tabs = ['融合', '卡片', '路径', '项目', '今日'] as const;
export type InsightTab = (typeof tabs)[number];

const sourceLabel: Record<SourceType, string> = {
  Blog: '技术博客',
  Doc: '官方文档',
  GitHub: 'GitHub 项目',
  Paper: '论文',
  Podcast: '播客',
  Video: '视频'
};

type InsightPanelProps = {
  activeTab: InsightTab;
  workspace: Workspace;
  selectedCard: KnowledgeCard | null;
  selectedSources: Source[];
  collapsed: boolean;
  onTabChange: (tab: InsightTab) => void;
  onCardSelect: (card: KnowledgeCard) => void;
  onToggle: () => void;
};

export function InsightPanel({
  activeTab,
  workspace,
  selectedCard,
  selectedSources,
  collapsed,
  onTabChange,
  onCardSelect,
  onToggle
}: InsightPanelProps) {
  if (collapsed) {
    return (
      <aside className="insight-panel panel">
        <div className="panel-rail">
          <button
            aria-label="展开洞察面板"
            className="panel-toggle"
            onClick={onToggle}
            type="button"
          >
            <ChevronLeft size={18} />
          </button>
          <Sparkles size={18} aria-hidden="true" />
          <span className="panel-rail-label">AI 洞察</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="insight-panel panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">AI 生成</span>
          <h2>洞察与行动</h2>
        </div>
        <button
          aria-label="收起洞察面板"
          className="panel-toggle"
          onClick={onToggle}
          type="button"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="tabs" role="tablist" aria-label="AI 生成结果">
        {tabs.map((tab, index) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? 'active' : ''}
            key={tab}
            onClick={() => onTabChange(tab)}
            role="tab"
            type="button"
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === '融合' && (
        <section className="tab-content" role="tabpanel">
          <PanelTitle icon={<BrainCircuit size={18} />} title="知识融合分析" subtitle="共识、争议与独特信号" />
          <FusionBlock title="共识观点" items={workspace.fusion.consensus} />
          <FusionBlock title="争议观点" items={workspace.fusion.debates} />
          <FusionBlock title="独特洞察" items={workspace.fusion.uniqueInsights.slice(0, 2)} />
        </section>
      )}

      {activeTab === '卡片' && (
        <section className="tab-content" role="tabpanel">
          <PanelTitle icon={<FileText size={18} />} title="可追溯知识卡片" subtitle="每张卡片都能回到原始来源" />
          <div className="knowledge-cards">
            {workspace.cards.map((card) => (
              <button
                className={`knowledge-card ${selectedCard?.id === card.id ? 'selected' : ''}`}
                key={card.id}
                onClick={() => onCardSelect(card)}
                type="button"
              >
                <span className="card-kicker">Knowledge Card</span>
                <h3>{card.title}</h3>
                <p>{card.oneLiner}</p>
                <div className="chip-row">
                  {card.concepts.slice(0, 2).map((concept) => (
                    <span className="chip light" key={concept}>
                      {concept}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          {selectedCard && <SourceAttribution sources={selectedSources} />}
        </section>
      )}

      {activeTab === '路径' && (
        <section className="tab-content" role="tabpanel">
          <PanelTitle icon={<Layers3 size={18} />} title="知识成熟度路径" subtitle={workspace.maturity.summary} />
          <div className="maturity-grid">
            <div>
              <span>已掌握</span>
              {workspace.maturity.mastered.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div>
              <span>待补齐</span>
              {workspace.maturity.nextGaps.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
          <div className="path-list">
            {workspace.learningPath.map((step) => (
              <article className="path-step" key={step.level}>
                <span>阶段 {step.level}</span>
                <h3>{step.title}</h3>
                <p>
                  {step.minutes} 分钟 · {step.difficulty}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === '项目' && (
        <section className="tab-content" role="tabpanel">
          <PanelTitle icon={<GitBranch size={18} />} title="项目实践推荐" subtitle="用三档项目把知识转成实践证明" />
          <div className="project-list">
            {workspace.projects.map((project) => (
              <article className="project-card" key={project.level}>
                <span>{project.level}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="chip-row">
                  {project.stack.slice(0, 3).map((tool) => (
                    <span className="chip light" key={tool}>
                      {tool}
                    </span>
                  ))}
                </div>
                <strong>{project.outcome}</strong>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === '今日' && (
        <section className="tab-content" role="tabpanel">
          <PanelTitle icon={<Target size={18} />} title="今日行动建议" subtitle="把学习和实践压缩成今天能完成的动作" />
          <div className="today-list">
            {workspace.todayPlan.map((task, index) => (
              <article className="today-card" key={task.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{task.title}</h3>
                  <p>
                    {task.mode} · {task.minutes} 分钟
                  </p>
                </div>
                <time>{task.minutes}m</time>
              </article>
            ))}
          </div>
          <div className="action-row">
            <button type="button">
              <Play size={16} />
              开始
            </button>
            <button type="button">
              <BookOpen size={16} />
              加入待办
            </button>
            <button type="button">
              <CalendarPlus size={16} />
              同步日历
            </button>
          </div>
        </section>
      )}
    </aside>
  );
}

function PanelTitle({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="panel-title">
      <div>{icon}</div>
      <section>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </section>
    </div>
  );
}

function FusionBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="fusion-block">
      <div className="fusion-title-row">
        <h3>{title}</h3>
        <span>{items.length} signals</span>
      </div>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

function SourceAttribution({ sources }: { sources: Source[] }) {
  return (
    <div className="attribution">
      <h3>来源可追溯</h3>
      {sources.map((source) => (
        <div className="attribution-row" key={source.id}>
          <span>{sourceLabel[source.type]}</span>
          <p>{source.title}</p>
        </div>
      ))}
    </div>
  );
}
