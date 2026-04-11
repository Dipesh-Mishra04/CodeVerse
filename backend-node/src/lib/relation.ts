/** Supabase/PostgREST may return one-to-one embeds as object or single-element array. */
export function one<T>(rel: unknown): T | null {
  if (rel == null) return null;
  if (Array.isArray(rel)) return (rel[0] as T | undefined) ?? null;
  return rel as T;
}
