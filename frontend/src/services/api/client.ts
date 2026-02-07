const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

//explain this code --all
export function getApiBase(): string {
  return API_BASE;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}
