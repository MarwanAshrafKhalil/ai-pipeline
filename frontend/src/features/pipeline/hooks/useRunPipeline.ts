import { useCallback } from 'react';
import { runPipeline } from '@/lib/execution/executionEngine';
import { usePipelineStore } from '../store/pipelineStore';

export function useRunPipeline() {
  const nodes = usePipelineStore((s) => s.nodes);
  const edges = usePipelineStore((s) => s.edges);
  const setNodeState = usePipelineStore((s) => s.setNodeState);
  const appendLog = usePipelineStore((s) => s.appendLog);
  const setRunning = usePipelineStore((s) => s.setRunning);
  const resetExecution = usePipelineStore((s) => s.resetExecution);
  const clearLogs = usePipelineStore((s) => s.clearLogs);

  const run = useCallback(async () => {
    resetExecution();
    clearLogs();
    setRunning(true);
    await runPipeline(
      nodes.map((n) => ({ id: n.id, label: n.data?.label })),
      edges.map((e) => ({ source: e.source, target: e.target })),
      {
        onNodeState: (u) => setNodeState(u.nodeId, { status: u.status, error: u.error }),
        onLog: appendLog,
        onStarted: () => {},
        onCompleted: () => {},
        onError: () => {},
        setRunning,
      }
    );
  }, [
    nodes,
    edges,
    setNodeState,
    appendLog,
    setRunning,
    resetExecution,
    clearLogs,
  ]);

  return { run };
}
