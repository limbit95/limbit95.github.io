import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config.js";

export function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_URL &&
      SUPABASE_PUBLISHABLE_KEY &&
      !SUPABASE_URL.includes("YOUR_PROJECT_REF") &&
      !SUPABASE_PUBLISHABLE_KEY.includes("YOUR_SUPABASE"),
  );
}

function createSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  if (!window.supabase?.createClient) return null;

  return window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
}

export const supabase = createSupabaseClient();

export function isSupabaseClientReady() {
  return Boolean(supabase);
}
