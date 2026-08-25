import { getPublicProfiles } from "./api.js";
import { supabase } from "./supabaseClient.js";

const listeners = new Set();
let realtimeChannel = null;
let realtimeUserId = null;
let reminderTimer = null;
let reminderSyncPromise = null;

function unwrap(result) {
  if (result.error) throw result.error;
  return result.data;
}

export async function sendDirectMessage(recipientUserId, content) {
  const message = String(content ?? "").trim();
  if (!recipientUserId) throw new Error("쪽지를 받을 회원을 확인할 수 없습니다.");
  if (!message) throw new Error("쪽지 내용을 입력해 주세요.");
  return unwrap(await supabase.rpc("send_direct_message", {
    p_recipient_id: recipientUserId,
    p_content: message,
  }));
}

export async function getDirectMessage(messageId) {
  const message = unwrap(await supabase
    .from("direct_messages")
    .select("*")
    .eq("id", Number(messageId))
    .single());
  const senderProfiles = await getPublicProfiles(message.sender_id);
  return {
    ...message,
    sender: senderProfiles?.[0] ?? null,
  };
}

export async function markDirectMessageRead(messageId) {
  return unwrap(await supabase.rpc("mark_direct_message_read", {
    p_message_id: Number(messageId),
  }));
}

export async function syncUpcomingActivityReminders() {
  if (reminderSyncPromise) return reminderSyncPromise;
  reminderSyncPromise = (async () => {
    try {
      return Number(unwrap(await supabase.rpc("sync_my_activity_reminders")) ?? 0);
    } finally {
      reminderSyncPromise = null;
    }
  })();
  return reminderSyncPromise;
}

function notifyListeners(notification = null) {
  listeners.forEach((entry) => {
    if (entry.owner && !entry.owner.isConnected) {
      listeners.delete(entry);
      return;
    }
    try {
      entry.listener(notification);
    } catch {
      // 한 화면의 UI 갱신 실패가 Realtime 구독 전체를 중단하지 않도록 한다.
    }
  });
}

async function syncRemindersAndNotify() {
  try {
    const createdCount = await syncUpcomingActivityReminders();
    if (createdCount > 0) notifyListeners({ kind: "activity_reminder_sync" });
  } catch {
    // DB 패치 적용 전이나 일시적인 네트워크 오류여도 기존 알림 UI는 계속 동작한다.
  }
}

function ensureRealtime(userId) {
  if (!supabase || !userId) return;
  if (realtimeUserId === userId && realtimeChannel) return;

  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
  if (reminderTimer) {
    window.clearInterval(reminderTimer);
    reminderTimer = null;
  }

  realtimeUserId = userId;
  realtimeChannel = supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => notifyListeners(payload.new ?? null),
    )
    .subscribe();

  syncRemindersAndNotify();
  reminderTimer = window.setInterval(syncRemindersAndNotify, 60 * 1000);
}

export function subscribeNotificationUpdates(userId, listener, owner = null) {
  ensureRealtime(userId);
  const entry = { listener, owner };
  listeners.add(entry);
  return () => listeners.delete(entry);
}
