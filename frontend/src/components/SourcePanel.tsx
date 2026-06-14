import { Zap } from 'lucide-react';
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
};

export function SourcePanel({ sources }: SourcePanelProps) {
  return (
    <aside className="source-panel panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">内容发现</span>
          <h2>多模态资料流</h2>
        </div>
        <span className="count">{sources.length}</span>
      </div>
      <div className="source-list">
        {sources.map((source) => (
          <article className="source-card" key={source.id}>
            <div className="source-topline">
              <span className={`source-badge type-${source.type.toLowerCase()}`}>{sourceIcon[source.type]}</span>
              <span>{sourceLabel[source.type]}</span>
              <strong>{source.score}</strong>
            </div>
            <h3>{source.title}</h3>
            <p>{source.summary}</p>
            <div className="source-reason">
              <Zap size={14} />
              {source.reason}
            </div>
            <div className="chip-row">
              {source.extracted.slice(0, 2).map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
