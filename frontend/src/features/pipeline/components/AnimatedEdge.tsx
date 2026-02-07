import { getBezierPath, type EdgeProps } from 'reactflow';

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<{ running?: boolean }>) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const running = data?.running ?? false;

  return (
    <g>
      <path
        id={id}
        d={path}
        fill="none"
        stroke={running ? 'rgb(251 191 36)' : '#94a3b8'}
        strokeWidth={running ? 2.5 : 1.5}
        style={
          running
            ? {
                strokeDasharray: 6,
                strokeDashoffset: 12,
                animation: 'edge-dash 0.4s linear infinite',
              }
            : undefined
        }
      />
    </g>
  );
}
