import { LogLevel, Phase } from "@/types/execution";

/**
 * Log emission helper for execution. Used by execution engine.
 * Use nodeId '' for pipeline-level messages (started/ended).
 */
export function createLogEntry(
  nodeId: string,
  message: string,
  level: LogLevel = "info",
  phase?: Phase,
  nodeLabel?: string,
) {
  return {
    timestamp: Date.now(),
    nodeId,
    ...(nodeLabel != null && { nodeLabel }),
    message,
    level,
    ...(phase && { phase }),
  };
}
