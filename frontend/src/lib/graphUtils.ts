import type { GraphEdge, GraphNode, KnowledgeCard } from './knowledgeModel';

export function getAnimatedGraphNodes(nodes: GraphNode[], tick: number): GraphNode[] {
  return nodes.map((node, index) => {
    const amplitude = node.id === 'mcp' ? 0.25 : 1.15;
    const phase = tick / 9 + index * 0.72;
    return {
      ...node,
      x: clamp(node.x + Math.sin(phase) * amplitude, 5, 95),
      y: clamp(node.y + Math.cos(phase * 0.9) * amplitude, 5, 95)
    };
  });
}

export function getConnectedNodeIds(edges: GraphEdge[], activeNodeId: string | null): string[] {
  if (!activeNodeId) {
    return [];
  }

  const connected = new Set<string>();
  edges.forEach((edge) => {
    if (edge.source === activeNodeId) {
      connected.add(edge.target);
    }
    if (edge.target === activeNodeId) {
      connected.add(edge.source);
    }
  });

  return [...connected];
}

export function findCardForNode(cards: KnowledgeCard[], nodeId: string): KnowledgeCard | undefined {
  return cards.find((card) => toNodeId(card.title) === nodeId) ?? cards.find((card) => card.relatedNodeIds.includes(nodeId));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Number(value.toFixed(2))));
}

function toNodeId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*/g, '-')
    .replace(/\s+/g, '-');
}
