/**
 * Cycle detection via DFS (path stack).
 * Pure: nodeIds + edges → boolean.
 */
function buildAdjacencyList(
  nodeIds: string[],
  edges: { source: string; target: string }[]
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const id of nodeIds) map.set(id, []);
  for (const e of edges) {
    const list = map.get(e.source);
    if (list) list.push(e.target);
  }
  return map;
}

function dfsHasCycle(
  nodeId: string,
  adj: Map<string, string[]>,
  visited: Set<string>,
  path: Set<string>
): boolean {
  if (path.has(nodeId)) return true;
  if (visited.has(nodeId)) return false;
  visited.add(nodeId);
  path.add(nodeId);
  for (const next of adj.get(nodeId) ?? []) {
    if (dfsHasCycle(next, adj, visited, path)) return true;
  }
  path.delete(nodeId);
  return false;
}

export function hasCycle(
  nodeIds: string[],
  edges: { source: string; target: string }[]
): boolean {
  const adj = buildAdjacencyList(nodeIds, edges);
  const visited = new Set<string>();
  const path = new Set<string>();
  for (const id of nodeIds) {
    if (!visited.has(id) && dfsHasCycle(id, adj, visited, path)) return true;
  }
  return false;
}
