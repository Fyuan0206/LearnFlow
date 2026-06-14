from app.schemas.research import Graph, GraphEdge, GraphNode, KnowledgeCard
from app.data import mock_research


async def generate_graph(query: str, cards: list[KnowledgeCard]) -> Graph:
    # MVP: build a deterministic graph from the topic and card tags/relatedConcepts.
    # This avoids an extra LLM call and is fully reliable for the demo.
    topic = query.strip().split()[0] if query.strip() else "主题"
    topic_id = topic.lower().replace(" ", "_")[:20] or "topic"

    nodes: dict[str, GraphNode] = {
        topic_id: GraphNode(id=topic_id, label=topic, type="topic"),
    }
    edges: list[GraphEdge] = []

    # Add a node for each unique tag and connect it to the topic.
    for card in cards:
        for tag in card.tags:
            tag_id = tag.lower().replace(" ", "_")[:20]
            if tag_id not in nodes:
                nodes[tag_id] = GraphNode(id=tag_id, label=tag, type="concept")
            edges.append(GraphEdge(source=topic_id, target=tag_id, label="包含"))

        # Add related concepts and connect to the card's first tag or topic.
        anchor = card.tags[0].lower().replace(" ", "_")[:20] if card.tags else topic_id
        for concept in card.relatedConcepts:
            concept_id = concept.lower().replace(" ", "_")[:20]
            if concept_id not in nodes:
                nodes[concept_id] = GraphNode(id=concept_id, label=concept, type="concept")
            if concept_id != anchor:
                edges.append(GraphEdge(source=anchor, target=concept_id, label="相关"))

    # Fallback to mock graph if we ended up with too few nodes.
    if len(nodes) < 3:
        return mock_research.get_graph(query)

    return Graph(nodes=list(nodes.values()), edges=edges)
