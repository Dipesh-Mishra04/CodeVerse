import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !serviceKey) {
  console.warn(
    "[codeverse] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for full API behavior."
  );
}

/** Bypasses RLS — use only on the server. */
export const supabaseAdmin: SupabaseClient = createClient(
  url ?? "https://placeholder.supabase.co",
  serviceKey ?? "placeholder",
  { auth: { persistSession: false, autoRefreshToken: false } }
);

/** Validate Bearer JWTs from the browser. */
export const supabaseAnon: SupabaseClient = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? serviceKey ?? "placeholder",
  { auth: { persistSession: false, autoRefreshToken: false } }
);
