import { supabase } from "./shared.js";

const ERROR_COLUMNS = "id,user_id,error_kind,message,route,context,created_at,profile:profiles(display_name)";

export async function insertClientErrorLog({ userId, errorKind, message, route, context = {} }) {
  if (!supabase) return { data: null, error: new Error("Supabase client unavailable") };
  return supabase.from("client_error_logs").insert({
    user_id: userId,
    error_kind: errorKind,
    message,
    route,
    context,
  });
}

export async function listClientErrorLogs({ limit = 100, offset = 0, since } = {}) {
  let query = supabase
    .from("client_error_logs")
    .select(ERROR_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (since) query = query.gte("created_at", since);
  const result = await query;
  if (result.error) throw result.error;
  return { rows: result.data ?? [], count: result.count ?? 0 };
}

export async function countRecentClientErrors(hours = 24) {
  const since = new Date(Date.now() - Math.max(1, Number(hours) || 24) * 60 * 60 * 1000).toISOString();
  const result = await supabase
    .from("client_error_logs")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since);
  if (result.error) throw result.error;
  return result.count ?? 0;
}
