/**
 * Execution state and logs.
 */

export type NodeExecutionStatus = 'idle' | 'running' | 'completed' | 'error';

export interface ExecutionState {
  status: NodeExecutionStatus;
  error?: string;
}

export type LogLevel = 'info' | 'success' | 'error';

export interface LogEntry {
  timestamp: number;
  nodeId: string;
  message: string;
  level: LogLevel;
  phase?: 'start' | 'end';
}
