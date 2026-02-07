import { apiGet } from './client';
import type { NodeType } from '@/types/node';

export async function fetchNodeTypes(): Promise<NodeType[]> {
  return apiGet<NodeType[]>('/nodes');
}
