/**
 * Node type from API (palette definition).
 */
export type NodeTypeKind = 'data_source' | 'transformer' | 'model' | 'sink';

export interface NodeType {
  id: string;
  label: string;
  type: NodeTypeKind;
}
