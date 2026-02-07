import { useQuery } from '@tanstack/react-query';
import { fetchNodeTypes } from '@/services/api/nodes';

export const NODE_TYPES_QUERY_KEY = ['nodeTypes'] as const;

export function useNodeTypes() {
  return useQuery({
    queryKey: NODE_TYPES_QUERY_KEY,
    queryFn: fetchNodeTypes,
  });
}
