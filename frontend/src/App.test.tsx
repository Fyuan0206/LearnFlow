import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the Chinese knowledge-to-action workspace', () => {
    render(<App />);

    expect(screen.getByText('知识到行动系统')).toBeInTheDocument();
    expect(screen.getByText('多模态资料流')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '生成知识地图' })).toBeInTheDocument();
    expect(screen.getByLabelText('动态分层知识图谱')).toBeInTheDocument();
    expect(screen.getByText('知识融合分析')).toBeInTheDocument();
  });
});
