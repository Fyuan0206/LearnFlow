import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('./api/research', () => ({
  fetchHealth: vi.fn(() => new Promise(() => {})),
  fetchResearch: vi.fn()
}));

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  it('renders the landing page with a project introduction', () => {
    render(<App />);

    expect(screen.getByText('把一个学习主题，变成可执行的知识地图。')).toBeInTheDocument();
    expect(screen.getByText('多源知识融合')).toBeInTheDocument();
    expect(screen.getByText('从输入主题到行动计划，一屏完成闭环。')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '开始生成知识图谱' })).toBeInTheDocument();
  });

  it('navigates from the landing page into the knowledge-to-action workspace', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '开始生成知识图谱' }));

    expect(screen.getByText('知识到行动系统')).toBeInTheDocument();
    expect(screen.getByText('多模态资料流')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '生成知识地图' })).toBeInTheDocument();
    expect(screen.getByLabelText('动态分层知识图谱')).toBeInTheDocument();
    expect(screen.getByText('知识融合分析')).toBeInTheDocument();
  });
});
