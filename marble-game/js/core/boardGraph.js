function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`${label} must be a non-empty string.`);
  }
}

function normalizeNode(node) {
  if (!node || typeof node !== "object") {
    throw new TypeError("Each board node must be an object.");
  }

  assertNonEmptyString(node.id, "Board node id");
  return Object.freeze({ ...node, id: node.id.trim() });
}

function normalizeEdge(edge, nodeIds, index) {
  if (!edge || typeof edge !== "object") {
    throw new TypeError(`Board edge at index ${index} must be an object.`);
  }

  assertNonEmptyString(edge.from, `Board edge ${index} from`);
  assertNonEmptyString(edge.to, `Board edge ${index} to`);

  if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
    throw new Error(`Board edge ${edge.from} -> ${edge.to} references an unknown node.`);
  }

  return Object.freeze({
    id: edge.id ?? `${edge.from}:${edge.to}:${index}`,
    from: edge.from,
    to: edge.to,
    bidirectional: edge.bidirectional === true,
    enabled: edge.enabled !== false,
    ...edge,
  });
}

export function createBoardGraph({ nodes, edges, startNodeId }) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    throw new TypeError("Board graph requires at least one node.");
  }
  if (!Array.isArray(edges)) {
    throw new TypeError("Board graph edges must be an array.");
  }

  const normalizedNodes = nodes.map(normalizeNode);
  const nodeMap = new Map();
  normalizedNodes.forEach((node) => {
    if (nodeMap.has(node.id)) {
      throw new Error(`Duplicate board node id: ${node.id}`);
    }
    nodeMap.set(node.id, node);
  });

  assertNonEmptyString(startNodeId, "Board start node id");
  if (!nodeMap.has(startNodeId)) {
    throw new Error(`Board start node does not exist: ${startNodeId}`);
  }

  const nodeIds = new Set(nodeMap.keys());
  const normalizedEdges = edges.map((edge, index) => normalizeEdge(edge, nodeIds, index));
  const adjacency = new Map(normalizedNodes.map((node) => [node.id, []]));

  normalizedEdges.forEach((edge) => {
    if (!edge.enabled) return;
    adjacency.get(edge.from).push(Object.freeze({ edgeId: edge.id, nodeId: edge.to }));
    if (edge.bidirectional) {
      adjacency.get(edge.to).push(Object.freeze({ edgeId: edge.id, nodeId: edge.from }));
    }
  });

  return Object.freeze({
    startNodeId,
    nodes: Object.freeze(normalizedNodes),
    edges: Object.freeze(normalizedEdges),
    hasNode(nodeId) {
      return nodeMap.has(nodeId);
    },
    getNode(nodeId) {
      return nodeMap.get(nodeId) ?? null;
    },
    getNeighbors(nodeId) {
      if (!adjacency.has(nodeId)) {
        throw new Error(`Unknown board node: ${nodeId}`);
      }
      return Object.freeze([...adjacency.get(nodeId)]);
    },
    toJSON() {
      return {
        startNodeId,
        nodes: normalizedNodes.map((node) => ({ ...node })),
        edges: normalizedEdges.map((edge) => ({ ...edge })),
      };
    },
  });
}
