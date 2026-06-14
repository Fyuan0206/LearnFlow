import { describe, expect, it } from 'vitest';
import { buildDemoWorkspace } from './knowledgeModel';
import { findCardForNode, getAnimatedGraphNodes, getConnectedNodeIds } from './graphUtils';

describe('graphUtils', () => {
  it('returns bounded dynamic node positions over time', () => {
    const workspace = buildDemoWorkspace('MCP');
    const firstFrame = getAnimatedGraphNodes(workspace.graph.nodes, 0);
    const nextFrame = getAnimatedGraphNodes(workspace.graph.nodes, 12);

    expect(nextFrame.every((node) => node.x >= 5 && node.x <= 95 && node.y >= 5 && node.y <= 95)).toBe(true);
    expect(nextFrame.some((node, index) => node.x !== firstFrame[index].x || node.y !== firstFrame[index].y)).toBe(true);
  });

  it('finds connected nodes for active-node highlighting', () => {
    const workspace = buildDemoWorkspace('MCP');

    expect(getConnectedNodeIds(workspace.graph.edges, 'mcp')).toEqual(
      expect.arrayContaining(['agent', 'tool-calling', 'mcp-server', 'mcp-client'])
    );
  });

  it('resolves a clicked graph node to the most relevant knowledge card', () => {
    const workspace = buildDemoWorkspace('MCP');

    expect(findCardForNode(workspace.cards, 'mcp-server')?.id).toBe('card-server');
  });
});
