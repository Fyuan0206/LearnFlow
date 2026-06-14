import { useEffect, useMemo, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { InsightPanel, type InsightTab } from './components/InsightPanel';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { ParticleField } from './components/ParticleField';
import { SourcePanel } from './components/SourcePanel';
import { findCardForNode } from './lib/graphUtils';
import { buildDemoWorkspace, getWorkflowSteps, type KnowledgeCard } from './lib/knowledgeModel';

export function App() {
  const [topic, setTopic] = useState('MCP');
  const [activeTab, setActiveTab] = useState<InsightTab>('融合');
  const [selectedCard, setSelectedCard] = useState<KnowledgeCard | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>('mcp');
  const [tick, setTick] = useState(0);

  const workspace = useMemo(() => buildDemoWorkspace(topic), [topic]);
  const workflowSteps = useMemo(() => getWorkflowSteps(), []);

  const selectedSources = selectedCard
    ? workspace.sources.filter((source) => selectedCard.sourceIds.includes(source.id))
    : workspace.sources.slice(0, 3);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 650);
    return () => window.clearInterval(timer);
  }, []);

  function handleNodeSelect(nodeId: string) {
    const card = findCardForNode(workspace.cards, nodeId);
    setActiveNodeId(nodeId);
    setSelectedCard(card ?? workspace.cards[0]);
    setActiveTab('卡片');
  }

  return (
    <main className="app-shell">
      <ParticleField />
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <AppHeader topic={topic} onTopicChange={setTopic} />
      <section className="workspace">
        <SourcePanel sources={workspace.sources} />
        <KnowledgeGraph
          activeNodeId={activeNodeId}
          graph={workspace.graph}
          onNodeSelect={handleNodeSelect}
          readiness={workspace.maturity.readiness}
          tick={tick}
          topic={workspace.topic}
          workflowSteps={workflowSteps}
        />
        <InsightPanel
          activeTab={activeTab}
          onCardSelect={setSelectedCard}
          onTabChange={setActiveTab}
          selectedCard={selectedCard}
          selectedSources={selectedSources}
          workspace={workspace}
        />
      </section>
    </main>
  );
}
