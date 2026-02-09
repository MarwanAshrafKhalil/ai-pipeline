/**
 * Draft persistence: save/load pipeline to localStorage with lifetime.
 */
import type { PipelineNode, PipelineEdge } from "@/types/pipeline";

export const DRAFT_KEY = "pipeline-draft";
export const DRAFT_LIFETIME_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface DraftPayload {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  savedAt: number;
}

function getItem(): DraftPayload | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DraftPayload;
  } catch {
    return null;
  }
}

export function saveDraft(payload: {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}): void {
  try {
    const data: DraftPayload = {
      nodes: payload.nodes,
      edges: payload.edges,
      savedAt: Date.now(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function loadDraft(): {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
} | null {
  const data = getItem();
  if (!data) return null;
  if (Date.now() - data.savedAt > DRAFT_LIFETIME_MS) {
    localStorage.removeItem(DRAFT_KEY);
    return null;
  }
  return { nodes: data.nodes ?? [], edges: data.edges ?? [] };
}

export function hasValidDraft(): boolean {
  const data = getItem();
  if (!data) return false;
  if (Date.now() - data.savedAt > DRAFT_LIFETIME_MS) {
    localStorage.removeItem(DRAFT_KEY);
    return false;
  }
  return true;
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
