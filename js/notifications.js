import { getPublicProfiles } from "./api/profiles.js";
import { supabase } from "./supabaseClient.js";

const DIRECT_MESSAGE_COLUMNS = "id,sender_id,recipient_id,content,created_at,read_at";

const listeners = new Set();
let realtimeChannel = null;
let realtimeUserId = null;

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
    .select(DIRECT_MESSAGE_COLUMNS)
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

function ensureRealtime(userId) {
  if (!supabase || !userId) return;
  if (realtimeUserId === userId && realtimeChannel) return;

  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
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
}

export function subscribeNotificationUpdates(userId, listener, owner = null) {
  ensureRealtime(userId);
  const entry = { listener, owner };
  listeners.add(entry);
  return () => listeners.delete(entry);
}