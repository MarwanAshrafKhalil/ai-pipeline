import { usePipelineStore } from '../store/pipelineStore';

export function useExecution() {
  const isRunning = usePipelineStore((s) => s.isRunning);
  const logs = usePipelineStore((s) => s.logs);
  const nodeStates = usePipelineStore((s) => s.nodeStates);
  const executionOrder = usePipelineStore((s) => s.executionOrder);
  const setNodeState = usePipelineStore((s) => s.setNodeState);
  const appendLog = usePipelineStore((s) => s.appendLog);
  const setRunning = usePipelineStore((s) => s.setRunning);
  const setExecutionOrder = usePipelineStore((s) => s.setExecutionOrder);
  const resetExecution = usePipelineStore((s) => s.resetExecution);
  const clearLogs = usePipelineStore((s) => s.clearLogs);
  return {
    isRunning,
    logs,
    nodeStates,
    executionOrder,
    setNodeState,
    appendLog,
    setRunning,
    setExecutionOrder,
    resetExecution,
    clearLogs,
  };
}
