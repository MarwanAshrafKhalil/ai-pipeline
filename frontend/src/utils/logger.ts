/**
 * Log emission helper for execution. Used by execution engine.
 */
export function createLogEntry(
  nodeId: string,
  message: string,
  level: 'info' | 'success' | 'error' = 'info',
  phase?: 'start' | 'end'
) {
  return {
    timestamp: Date.now(),
    nodeId,
    message,
    level,
    ...(phase && { phase }),
  };
}
