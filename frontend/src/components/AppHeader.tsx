import { ArrowRight, CircleDot, Search, Sparkles } from 'lucide-react';

type AppHeaderProps = {
  topic: string;
  onTopicChange: (topic: string) => void;
};

export function AppHeader({ topic, onTopicChange }: AppHeaderProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">
          <Sparkles size={18} />
        </div>
        <div>
          <p>LearnFlow AI</p>
          <span>知识到行动系统</span>
        </div>
      </div>
      <div className="searchbar">
        <Search size={18} />
        <input
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          aria-label="学习主题"
          placeholder="输入你想学习的主题，例如 MCP / AI Agent / RAG"
        />
        <button type="button">
          生成知识地图
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="status-pill">
        <CircleDot size={14} />
        演示就绪
      </div>
    </header>
  );
}
