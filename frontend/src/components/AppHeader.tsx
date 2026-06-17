import { ArrowRight, CircleDot, Home, LoaderCircle, RadioTower, Search, Sparkles } from 'lucide-react';

type AppHeaderProps = {
  topic: string;
  backendOnline: boolean;
  isGenerating: boolean;
  onHome?: () => void;
  onGenerate?: () => void;
  onTopicChange: (topic: string) => void;
};

export function AppHeader({
  topic,
  backendOnline,
  isGenerating,
  onHome,
  onGenerate,
  onTopicChange
}: AppHeaderProps) {
  return (
    <header className="topbar">
      <button className="brand brand-button" onClick={onHome} type="button">
        <div className="brand-mark">
          <Sparkles size={18} />
        </div>
        <div>
          <p>LearnFlow AI</p>
          <span>知识到行动系统</span>
        </div>
      </button>
      <div className="searchbar">
        <span className="command-label">COMMAND</span>
        <Search size={18} />
        <input
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          aria-label="学习主题"
          placeholder="输入你想学习的主题，例如 MCP / AI Agent / RAG"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onGenerate?.();
            }
          }}
        />
        <button disabled={isGenerating || !topic.trim()} onClick={onGenerate} type="button">
          {isGenerating ? (
            <>
              <LoaderCircle className="spin-icon" size={16} />
              生成中…
            </>
          ) : (
            <>
              生成知识地图
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
      <div className="topbar-actions">
        <button className="status-pill status-button" onClick={onHome} type="button">
          <Home size={14} />
          项目介绍
        </button>
        <div className={`status-pill ${backendOnline ? 'is-online' : 'is-offline'}`}>
          {backendOnline ? <RadioTower size={14} /> : <CircleDot size={14} />}
          {backendOnline ? 'LLM 后端已连接' : '后端未连接'}
          <i aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
