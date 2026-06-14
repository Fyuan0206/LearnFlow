import { describe, expect, it } from 'vitest';
import { buildDemoWorkspace, getWorkflowSteps } from './knowledgeModel';

describe('buildDemoWorkspace', () => {
  it('builds the five differentiators for the MCP demo topic', () => {
    const workspace = buildDemoWorkspace('MCP');

    expect(workspace.topic).toBe('MCP');
    expect(workspace.fusion.consensus).toHaveLength(3);
    expect(workspace.fusion.debates).toHaveLength(2);
    expect(workspace.fusion.uniqueInsights).toHaveLength(3);
    expect(workspace.cards.every((card) => card.sourceIds.length > 0)).toBe(true);
    expect(workspace.maturity.nextGaps).toContain('MCP Server 实现');
    expect(workspace.projects.map((project) => project.level)).toEqual(['入门', '进阶', '高级']);
    expect(workspace.todayPlan).toHaveLength(3);
  });

  it('creates a localized layered growth graph from concepts to tools to projects', () => {
    const workspace = buildDemoWorkspace('MCP');

    expect(workspace.graph.layers.map((layer) => layer.name)).toEqual([
      '概念层',
      '工具层',
      '项目层'
    ]);
    expect(workspace.graph.nodes.some((node) => node.type === 'project')).toBe(true);
    expect(workspace.graph.edges.some((edge) => edge.relation === 'enables')).toBe(true);
  });

  it('returns Chinese copy for maturity, projects, and today plan', () => {
    const workspace = buildDemoWorkspace('MCP');

    expect(workspace.fusion.consensus[0]).toContain('MCP');
    expect(workspace.maturity.summary).toContain('已经');
    expect(workspace.projects.map((project) => project.level)).toEqual(['入门', '进阶', '高级']);
    expect(workspace.todayPlan.map((task) => task.mode)).toEqual(['阅读', '观看', '实践']);
  });
});

describe('getWorkflowSteps', () => {
  it('returns visible demo progress states in the expected order', () => {
    expect(getWorkflowSteps().map((step) => step.label)).toEqual([
      '发现多源内容',
      '筛选高价值信号',
      '融合知识观点',
      '生成动态星图',
      '规划成长路径',
      '拆解今日行动'
    ]);
  });
});
