import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config.js";

if (!window.supabase?.createClient) {
  throw new Error("Supabase 클라이언트를 불러오지 못했습니다.");
}

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
