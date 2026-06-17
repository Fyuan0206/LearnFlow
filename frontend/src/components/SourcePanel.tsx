import { ChevronLeft, ChevronRight, Layers, Zap } from 'lucide-react';
import type { Source, SourceType } from '../lib/knowledgeModel';

const sourceIcon: Record<SourceType, string> = {
  Blog: '博',
  Doc: '文',
  GitHub: '码',
  Paper: '论',
  Podcast: '播',
  Video: '视'
};

const sourceLabel: Record<SourceType, string> = {
  Blog: '技术博客',
  Doc: '官方文档',
  GitHub: 'GitHub 项目',
  Paper: '论文',
  Podcast: '播客',
  Video: '视频'
};

type SourcePanelProps = {
  sources: Source[];
  collapsed: boolean;
  onToggle: () => void;
};

export function SourcePanel({ sources, collapsed, onToggle }: SourcePanelProps) {
  if (collapsed) {
    return (
      <aside className="source-panel panel">
        <div className="panel-rail">
          <button
            aria-label="展开资料流面板"
            className="panel-toggle"
            onClick={onToggle}
            type="button"
          >
            <ChevronRight size={18} />
          </button>
          <Layers size={18} aria-hidden="true" />
          <span className="panel-rail-label">资料流</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="source-panel panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">内容发现</span>
          <h2>多模态资料流</h2>
        </div>
        <div className="panel-heading-actions">
          <span className="count">{sources.length}</span>
          <button
            aria-label="收起资料流面板"
            className="panel-toggle"
            onClick={onToggle}
            type="button"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
      <div className="source-list">
        {sources.map((source, index) => (
          <article className="source-card" key={source.id}>
            <div className="source-topline">
              <span className="source-index">{String(index + 1).padStart(2, '0')}</span>
              <span className={`source-badge type-${source.type.toLowerCase()}`}>{sourceIcon[source.type]}</span>
              <span>{sourceLabel[source.type]}</span>
              <strong>{source.score}</strong>
            </div>
            <h3>{source.title}</h3>
            <p className="source-summary">{source.summary}</p>
            <div className="source-reason">
              <Zap size={14} aria-hidden="true" />
              {source.reason}
            </div>
            {source.extracted[0] && (
              <div className="chip-row">
                <span className="chip">{source.extracted[0]}</span>
              </div>
            )}
          </article>
        ))}
      </div>
    </aside>
  );
}
