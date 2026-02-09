/**
 * Pipeline execution engine: topological sort + sequential simulation.
 * Callbacks update store; no React dependency.
 */
import { topologicalSort } from '@/lib/graph/topologicalSort';
import { createLogEntry } from '@/utils/logger';
import type { LogEntry } from '@/types/execution';
import type { ExecutionCallbacks } from './types';

const SIMULATE_DELAY_MS = 600;
const SIMULATE_FAIL_CHANCE = 0; // set > 0 to demo error handling

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function simulateNodeExecution(
  nodeId: string,
  nodeLabel: string | undefined,
  onLog: (e: LogEntry) => void
): Promise<void> {
  onLog(createLogEntry(nodeId, 'Processing...', 'info', 'start', nodeLabel));
  await delay(SIMULATE_DELAY_MS);
  if (SIMULATE_FAIL_CHANCE > 0 && Math.random() < SIMULATE_FAIL_CHANCE) {
    throw new Error(`Simulated failure for node ${nodeId}`);
  }
  onLog(createLogEntry(nodeId, 'Done', 'success', 'end', nodeLabel));
}

export async function runPipeline(
  nodes: { id: string; label?: string }[],
  edges: { source: string; target: string }[],
  callbacks: ExecutionCallbacks
): Promise<void> {
  const nodeIds = nodes.map((n) => n.id);
  const order = topologicalSort(nodeIds, edges);

  if (order.length < nodeIds.length) {
    callbacks.onError?.('Graph has a cycle; cannot execute.');
    callbacks.setRunning?.(false);
    return;
  }

  callbacks.onStarted?.();
  callbacks.onLog?.(createLogEntry('', 'Pipeline started', 'info'));

  try {
    for (const nodeId of order) {
      const nodeLabel = nodes.find((n) => n.id === nodeId)?.label;
      callbacks.onNodeState?.({ nodeId, status: 'running' });
      try {
        await simulateNodeExecution(nodeId, nodeLabel, (e) => callbacks.onLog?.(e));
        callbacks.onNodeState?.({ nodeId, status: 'completed' });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        callbacks.onLog?.(
          createLogEntry(nodeId, message, 'error', undefined, nodeLabel)
        );
        callbacks.onLog?.(createLogEntry('', 'Pipeline failed', 'error'));
        callbacks.onNodeState?.({ nodeId, status: 'error', error: message });
        callbacks.onError?.(message);
        return;
      }
    }
    callbacks.onLog?.(createLogEntry('', 'Pipeline completed', 'success'));
    callbacks.onCompleted?.();
  } finally {
    callbacks.setRunning?.(false);
  }
}

