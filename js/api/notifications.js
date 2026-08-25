import { supabase, unwrap } from "./shared.js";

export async function listNotifications(limit = 20) {
  return unwrap(await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)) ?? [];
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
