import { supabase, unwrap } from "./shared.js";

const NOTIFICATION_COLUMNS = [
  "id",
  "user_id",
  "notification_type",
  "title",
  "body",
  "event_id",
  "poll_id",
  "is_read",
  "read_at",
  "created_at",
  "updated_at",
  "kind",
  "message_id",
  "target_path",
  "expires_at",
  "dedupe_key",
].join(",");

const PUSH_NOTIFICATION_PREFERENCE_COLUMNS = [
  "user_id",
  "push_opt_in",
  "new_activity_scope",
  "created_activity_participation_enabled",
  "joined_activity_updates_enabled",
  "service_notices_enabled",
  "created_at",
  "updated_at",
].join(",");

export const DEFAULT_PUSH_NOTIFICATION_PREFERENCES = Object.freeze({
  push_opt_in: false,
  new_activity_scope: "interest_only",
  created_activity_participation_enabled: true,
  joined_activity_updates_enabled: true,
  service_notices_enabled: true,
});

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
    .select(NOTIFICATION_COLUMNS)
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
    .select(NOTIFICATION_COLUMNS)) ?? [];
}

export async function getPushNotificationPreferences(userId) {
  const { data, error } = await supabase
    .from("push_notification_preferences")
    .select(PUSH_NOTIFICATION_PREFERENCE_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return {
    user_id: userId,
    ...DEFAULT_PUSH_NOTIFICATION_PREFERENCES,
    ...(data ?? {}),
  };
}

export async function updatePushOptInPreference(userId, enabled) {
  return unwrap(await supabase
    .from("push_notification_preferences")
    .upsert({
      user_id: userId,
      push_opt_in: Boolean(enabled),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" })
    .select(PUSH_NOTIFICATION_PREFERENCE_COLUMNS)
    .single());
}

export async function updatePushNotificationPreferences(userId, preferences) {
  const payload = {
    user_id: userId,
    new_activity_scope: preferences.new_activity_scope,
    created_activity_participation_enabled: Boolean(preferences.created_activity_participation_enabled),
    joined_activity_updates_enabled: Boolean(preferences.joined_activity_updates_enabled),
    service_notices_enabled: Boolean(preferences.service_notices_enabled),
    updated_at: new Date().toISOString(),
  };
  return unwrap(await supabase
    .from("push_notification_preferences")
    .upsert(payload, { onConflict: "user_id" })
    .select(PUSH_NOTIFICATION_PREFERENCE_COLUMNS)
    .single());
}
