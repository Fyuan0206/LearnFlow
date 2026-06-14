import type { ReactNode } from 'react';
import { BookOpen, BrainCircuit, CalendarPlus, FileText, GitBranch, Layers3, Play, Target } from 'lucide-react';
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
  onTabChange: (tab: InsightTab) => void;
  onCardSelect: (card: KnowledgeCard) => void;
};

export function InsightPanel({
  activeTab,
  workspace,
  selectedCard,
  selectedSources,
  onTabChange,
  onCardSelect
}: InsightPanelProps) {
  return (
    <aside className="insight-panel panel">
      <div className="tabs" role="tablist" aria-label="AI 生成结果">
        {tabs.map((tab) => (
          <button className={activeTab === tab ? 'active' : ''} key={tab} onClick={() => onTabChange(tab)} type="button">
            {tab}
          </button>
        ))}
      </div>

      {activeTab === '融合' && (
        <section className="tab-content">
          <PanelTitle icon={<BrainCircuit size={18} />} title="知识融合分析" subtitle="展示共识、争议和独特信号，而不是简单摘要" />
          <FusionBlock title="共识观点" items={workspace.fusion.consensus} />
          <FusionBlock title="争议观点" items={workspace.fusion.debates} />
          <FusionBlock title="独特洞察" items={workspace.fusion.uniqueInsights} />
        </section>
      )}

      {activeTab === '卡片' && (
        <section className="tab-content">
          <PanelTitle icon={<FileText size={18} />} title="可追溯知识卡片" subtitle="每张卡片都能回到原始来源" />
          <div className="knowledge-cards">
            {workspace.cards.map((card) => (
              <button
                className={`knowledge-card ${selectedCard?.id === card.id ? 'selected' : ''}`}
                key={card.id}
                onClick={() => onCardSelect(card)}
                type="button"
              >
                <h3>{card.title}</h3>
                <p>{card.oneLiner}</p>
                <div className="chip-row">
                  {card.concepts.slice(0, 3).map((concept) => (
                    <span className="chip light" key={concept}>
                      {concept}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <SourceAttribution sources={selectedSources} />
        </section>
      )}

      {activeTab === '路径' && (
        <section className="tab-content">
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
        <section className="tab-content">
          <PanelTitle icon={<GitBranch size={18} />} title="项目实践推荐" subtitle="用三档项目把知识转成实践证明" />
          <div className="project-list">
            {workspace.projects.map((project) => (
              <article className="project-card" key={project.level}>
                <span>{project.level}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="chip-row">
                  {project.stack.map((tool) => (
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
        <section className="tab-content">
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
      <h3>{title}</h3>
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
