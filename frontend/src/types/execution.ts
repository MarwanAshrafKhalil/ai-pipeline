/**
 * Execution state and logs.
 */

export type NodeExecutionStatus = "idle" | "running" | "completed" | "error";

export interface ExecutionState {
  status: NodeExecutionStatus;
  error?: string;
}

export type LogLevel = "info" | "success" | "error";

export type Phase = "start" | "end";

export interface LogEntry {
  timestamp: number;
  nodeId: string;
  nodeLabel?: string;
  message: string;
  level: LogLevel;
  phase?: Phase;
}
