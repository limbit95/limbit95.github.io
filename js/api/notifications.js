import { supabase, unwrap } from "./shared.js";

const NOTIFICATION_COLUMNS = [
  "id",
  "notification_type",
  "title",
  "body",
  "event_id",
  "poll_id",
  "is_read",
  "read_at",
  "created_at",
  "kind",
  "message_id",
  "target_path",
  "expires_at",
].join(",");

// Backward-compatible API kept intentionally so cached pre-pagination headers
// and newer pagination headers can coexist during GitHub Pages cache rollover.
export async function listNotifications(limit = 20) {
  return unwrap(await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)) ?? [];
}

export async function listNotificationsPage({ cursor = null, pageSize = 20 } = {}) {
  const safePageSize = Math.min(Math.max(Number(pageSize) || 20, 1), 50);
  let query = supabase
    .from("notifications")
    .select(NOTIFICATION_COLUMNS)
    .order("id", { ascending: false })
    .limit(safePageSize + 1);

  const numericCursor = Number(cursor);
  if (cursor !== null && Number.isFinite(numericCursor)) {
    query = query.lt("id", numericCursor);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = data ?? [];
  const items = rows.slice(0, safePageSize);
  const lastItem = items.length ? items[items.length - 1] : null;
  return {
    items,
    nextCursor: rows.length > safePageSize
      ? Number(lastItem?.id ?? 0) || null
      : null,
  };
}

export async function countUnreadNotifications() {
  const now = new Date().toISOString();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false)
    .or(`expires_at.is.null,expires_at.gt.${now}`);
  if (error) throw error;
  return count ?? 0;
}

export async function markNotificationRead(notificationId) {
  return unwrap(await supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("id", Number(notificationId))
    .select()
    .single());
}

export async function markAllNotificationsRead() {
  return unwrap(await supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("is_read", false)
    .select()) ?? [];
}
