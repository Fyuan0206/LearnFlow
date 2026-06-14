import { CheckCircle2, ChevronRight } from 'lucide-react';
import { getAnimatedGraphNodes, getConnectedNodeIds } from '../lib/graphUtils';
import type { GraphEdge, GraphNode } from '../lib/knowledgeModel';

type KnowledgeGraphProps = {
  topic: string;
  readiness: number;
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  activeNodeId: string | null;
  tick: number;
  workflowSteps: Array<{ label: string }>;
  onNodeSelect: (nodeId: string) => void;
};

export function KnowledgeGraph({
  topic,
  readiness,
  graph,
  activeNodeId,
  tick,
  workflowSteps,
  onNodeSelect
}: KnowledgeGraphProps) {
  const animatedNodes = getAnimatedGraphNodes(graph.nodes, tick);
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
          <span className="eyebrow">成长图谱</span>
          <h1>{topic} 动态知识星图</h1>
        </div>
        <div className="map-metric">
          <span>{readiness}%</span>
          <p>可开始实践</p>
        </div>
      </div>

      <div className={`graph-stage ${activeNodeId ? 'is-active' : ''}`} aria-label="动态分层知识图谱">
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
            className={getNodeClassName(node)}
            key={node.id}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            type="button"
            title={`${node.label}：${node.layer}`}
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
