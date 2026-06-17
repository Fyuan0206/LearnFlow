import { useMemo } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { getAnimatedGraphNodes, getConnectedNodeIds } from '../lib/graphUtils';
import type { GraphEdge, GraphNode } from '../lib/knowledgeModel';

type KnowledgeGraphProps = {
  topic: string;
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  activeNodeId: string | null;
  tick: number;
  workflowSteps: Array<{ label: string }>;
  onNodeSelect: (nodeId: string) => void;
};

function prefersStaticGraph(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(pointer: coarse)').matches;
}

export function KnowledgeGraph({
  topic,
  graph,
  activeNodeId,
  tick,
  workflowSteps,
  onNodeSelect
}: KnowledgeGraphProps) {
  const staticGraph = useMemo(() => prefersStaticGraph(), []);
  const animatedNodes = useMemo(
    () => (staticGraph ? graph.nodes : getAnimatedGraphNodes(graph.nodes, tick)),
    [graph.nodes, staticGraph, tick]
  );
  const connectedNodeIds = getConnectedNodeIds(graph.edges, activeNodeId);

  function getNodeClassName(node: GraphNode): string {
    const isActive = node.id === activeNodeId;
    const isRelated = connectedNodeIds.includes(node.id);
    const isDimmed = Boolean(activeNodeId && !isActive && !isRelated);

    return ['graph-node', `node-${node.type}`, isActive && 'is-active', isRelated && 'is-related', isDimmed && 'is-dimmed']
      .filter(Boolean)
      .join(' ');
  }

  function getEdgeClassName(edge: GraphEdge): string {
    if (!activeNodeId) {
      return '';
    }
    return edge.source === activeNodeId || edge.target === activeNodeId ? 'is-active' : 'is-muted';
  }

  return (
    <section className="map-panel panel">
      <div className="map-header">
        <div>
          <span className="eyebrow">Knowledge Cosmos</span>
          <h1>{topic} 动态知识星图</h1>
        </div>
        <div className="map-metric-grid" aria-label="知识图谱指标">
          <div>
            <span>{graph.nodes.length}</span>
            <p>Nodes</p>
          </div>
          <div>
            <span>{graph.edges.length}</span>
            <p>Links</p>
          </div>
          <div>
            <span>{workflowSteps.length}</span>
            <p>Agents</p>
          </div>
        </div>
      </div>

      <div className={`graph-stage ${activeNodeId ? 'is-active' : ''}`} aria-label="动态分层知识图谱">
        <div className="stage-reticle" aria-hidden="true" />
        <div className="stage-status" aria-hidden="true">
          <span>Graph Sync</span>
          <b>{activeNodeId ? 'Focused' : 'Scanning'}</b>
        </div>
        <div className="layer-ring layer-concept">概念层</div>
        <div className="layer-ring layer-tool">工具层</div>
        <div className="layer-ring layer-project">项目层</div>
        <svg className="graph-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {graph.edges.map((edge) => {
            const source = animatedNodes.find((node) => node.id === edge.source);
            const target = animatedNodes.find((node) => node.id === edge.target);
            if (!source || !target) return null;
            return (
              <line
                className={getEdgeClassName(edge)}
                key={`${edge.source}-${edge.target}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                strokeWidth={Math.max(0.35, edge.weight)}
              />
            );
          })}
        </svg>
        {animatedNodes.map((node) => (
          <button
            aria-label={`选择节点 ${node.label}`}
            aria-pressed={node.id === activeNodeId}
            className={getNodeClassName(node)}
            key={node.id}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            type="button"
            onClick={() => onNodeSelect(node.id)}
          >
            <span>{node.label}</span>
          </button>
        ))}
      </div>

      <div className="progress-strip">
        {workflowSteps.map((step, index) => (
          <div className="progress-step" key={step.label}>
            <CheckCircle2 size={16} />
            <span>{step.label}</span>
            {index < workflowSteps.length - 1 && <ChevronRight size={14} />}
          </div>
        ))}
      </div>
    </section>
  );
}
