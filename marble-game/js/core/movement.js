function buildAdjacency(board) {
  const adjacency = new Map(board.nodes.map((node) => [node.id, []]));
  board.edges.forEach((edge) => {
    if (edge.enabled === false) return;
    adjacency.get(edge.from)?.push(edge.to);
    if (edge.bidirectional === true) adjacency.get(edge.to)?.push(edge.from);
  });
  return adjacency;
}

export function moveAlongBoard(board, fromNodeId, steps) {
  if (!board || !Array.isArray(board.nodes) || !Array.isArray(board.edges)) throw new TypeError("Serialized board state is required.");
  if (!Number.isInteger(steps) || steps < 0) throw new RangeError("Movement steps must be a non-negative integer.");
  const nodeIds = new Set(board.nodes.map((node) => node.id));
  if (!nodeIds.has(fromNodeId)) throw new Error(`Unknown movement start node: ${fromNodeId}`);
  const adjacency = buildAdjacency(board);
  let current = fromNodeId;
  let passedStartCount = 0;
  const path = [];
  for (let step = 0; step < steps; step += 1) {
    const nextNodes = adjacency.get(current) ?? [];
    if (nextNodes.length === 0) throw new Error(`No enabled route from board node: ${current}`);
    if (nextNodes.length > 1) throw new Error(`Path choice required from board node: ${current}`);
    current = nextNodes[0];
    path.push(current);
    if (current === board.startNodeId) passedStartCount += 1;
  }
  return Object.freeze({ fromNodeId, toNodeId: current, path: Object.freeze(path), passedStartCount });
}
