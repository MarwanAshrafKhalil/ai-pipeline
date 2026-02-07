/**
 * Topological sort (Kahn's algorithm).
 * Pure: nodeIds + edges → ordered node ids. If graph has cycle, returned array length < nodeIds.length.
 */
export function topologicalSort(
  nodeIds: string[],
  edges: { source: string; target: string }[]
): string[] {
  const inDegree = new Map<string, number>();
  const outEdges = new Map<string, string[]>();

  for (const id of nodeIds) {
    inDegree.set(id, 0);
    outEdges.set(id, []);
  }
  for (const e of edges) {
    if (!nodeIds.includes(e.source) || !nodeIds.includes(e.target)) continue;
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
    outEdges.get(e.source)!.push(e.target);
  }

  const queue: string[] = [];
  for (const id of nodeIds) {
    if (inDegree.get(id) === 0) queue.push(id);
  }
  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (const v of outEdges.get(u) ?? []) {
      const d = (inDegree.get(v) ?? 0) - 1;
      inDegree.set(v, d);
      if (d === 0) queue.push(v);
    }
  }
  return order;
}
