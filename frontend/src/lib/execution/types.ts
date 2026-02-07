import type { LogEntry } from '@/types/execution';

export type NodeStateUpdate = {
  nodeId: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  error?: string;
};

export type ExecutionCallbacks = {
  onNodeState?: (update: NodeStateUpdate) => void;
  onLog?: (entry: LogEntry) => void;
  onStarted?: () => void;
  onCompleted?: () => void;
  onError?: (message: string) => void;
  setRunning?: (running: boolean) => void;
};
