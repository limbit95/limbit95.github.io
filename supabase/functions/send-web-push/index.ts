import webpush from "npm:web-push@3.6.7";
import { sendUserEmail } from "../_shared/email.ts";

// 종 알림에 기록되는 기존 알림 종류를 모두 Push 전달 후보로 유지한다.
const PUSH_TYPES = new Set([
  "event_updated",
  "event_cancelled",
  "waitlist_promoted",
  "poll_closed",
  "new_activity",
  "direct_message",
  "activity_reminder",
  "event_participant_joined",
  "event_participant_waitlisted",
  "event_participation_cancelled",
  "service_notice",
  "join_request_received",
]);
const EMAIL_TYPES = new Set(["join_request_received"]);
const CREATED_ACTIVITY_TYPES = new Set([
  "event_participant_joined",
  "event_participant_waitlisted",
  "event_participation_cancelled",
]);
const JOINED_ACTIVITY_TYPES = new Set([
  "event_updated",
  "event_cancelled",
  "waitlist_promoted",
  "poll_closed",
  "activity_reminder",
]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function env(name: string) {
  return String(Deno.env.get(name) ?? "").trim();
}

function serviceHeaders() {
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };
}

async function rest(path: string, init: RequestInit = {}) {
  const response = await fetch(`${env("SUPABASE_URL")}/rest/v1/${path}`, {
    ...init,
    headers: { ...serviceHeaders(), ...init.headers },
  });
  if (!response.ok) throw new Error(`SUPABASE_REST_${response.status}`);
  if (response.status === 204) return null;
  return response.json();
}

async function shouldSendPush(notification: Record<string, unknown>) {
  const type = String(notification.notification_type ?? "");
  if (type === "join_request_received" || type === "direct_message") return true;

  const userId = String(notification.user_id ?? "");
  const rows = await rest(
    `push_notification_preferences?select=new_activity_scope,created_activity_participation_enabled,joined_activity_updates_enabled,service_notices_enabled&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
  );
  const preference = Array.isArray(rows) ? rows[0] : null;
  const newActivityScope = String(preference?.new_activity_scope ?? "interest_only");
  const createdActivityEnabled = preference?.created_activity_participation_enabled !== false;
  const joinedActivityEnabled = preference?.joined_activity_updates_enabled !== false;
  const serviceNoticesEnabled = preference?.service_notices_enabled !== false;

  if (CREATED_ACTIVITY_TYPES.has(type)) return createdActivityEnabled;
  if (JOINED_ACTIVITY_TYPES.has(type)) return joinedActivityEnabled;
  if (type === "service_notice") return serviceNoticesEnabled;
  if (type !== "new_activity") return true;

  if (newActivityScope === "none") return false;
  if (newActivityScope === "all") return true;

  const eventId = Number(notification.event_id);
  if (!Number.isSafeInteger(eventId)) return false;
  const events = await rest(`events?select=category_id&id=eq.${eventId}&limit=1`);
  const categoryId = Number(Array.isArray(events) ? events[0]?.category_id : null);
  if (!Number.isSafeInteger(categoryId)) return false;

  const interests = await rest(
    `profile_interests?select=category_id&user_id=eq.${encodeURIComponent(userId)}&category_id=eq.${categoryId}&limit=1`,
  );
  return Array.isArray(interests) && interests.length > 0;
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);
  if (!env("WEB_PUSH_WEBHOOK_SECRET")
      || request.headers.get("x-webhook-secret") !== env("WEB_PUSH_WEBHOOK_SECRET")) {
    return json({ error: "UNAUTHORIZED" }, 401);
  }

  const required = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "VAPID_SUBJECT",
    "VAPID_PUBLIC_KEY",
    "VAPID_PRIVATE_KEY",
  ];
  if (required.some((name) => !env(name))) return json({ error: "SERVER_NOT_CONFIGURED" }, 503);

  try {
    const webhook = await request.json();
    const notificationId = Number(webhook?.record?.id);
    if (webhook?.type !== "INSERT" || webhook?.schema !== "public"
        || webhook?.table !== "notifications" || !Number.isSafeInteger(notificationId)) {
      return json({ error: "INVALID_WEBHOOK" }, 400);
    }

    // Webhook 본문의 user_id/type을 신뢰하지 않고 DB 원본을 다시 읽는다.
    const notifications = await rest(
      `notifications?select=id,user_id,notification_type,title,body,target_path,event_id&id=eq.${notificationId}&limit=1`,
    );
    const notification = Array.isArray(notifications) ? notifications[0] : null;
    if (!notification) return json({ error: "NOTIFICATION_NOT_FOUND" }, 404);
    if (!PUSH_TYPES.has(notification.notification_type)) {
      if (!EMAIL_TYPES.has(notification.notification_type)) {
        return json({ skipped: true, reason: "NOT_DELIVERY_TYPE" });
      }
    }

    const pushEnabled = PUSH_TYPES.has(notification.notification_type)
      ? await shouldSendPush(notification)
      : false;
    const subscriptions = pushEnabled
      ? await rest(
        `push_subscriptions?select=id,endpoint,p256dh,auth&user_id=eq.${encodeURIComponent(notification.user_id)}`,
      )
      : [];
    webpush.setVapidDetails(env("VAPID_SUBJECT"), env("VAPID_PUBLIC_KEY"), env("VAPID_PRIVATE_KEY"));
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      target_path: notification.target_path || `#/activities/${notification.event_id}`,
      tag: `notification-${notification.id}`,
    });

    const results = await Promise.allSettled((subscriptions ?? []).map(async (subscription: Record<string, string | number>) => {
      try {
        await webpush.sendNotification({
          endpoint: String(subscription.endpoint),
          keys: { p256dh: String(subscription.p256dh), auth: String(subscription.auth) },
        }, payload, { TTL: 300 });
        return "sent";
      } catch (error) {
        const statusCode = Number((error as { statusCode?: number })?.statusCode);
        if (statusCode === 404 || statusCode === 410) {
          await rest(`push_subscriptions?id=eq.${subscription.id}`, { method: "DELETE" });
          return "removed";
        }
        // endpoint/key를 로그에 남기지 않고 다른 기기 전송은 계속한다.
        console.error("Web Push delivery failed", { notificationId, statusCode: statusCode || null });
        throw error;
      }
    }));

    const email = EMAIL_TYPES.has(notification.notification_type)
      ? await sendUserEmail({
        userId: String(notification.user_id),
        template: "join_request_received",
        data: {
          title: String(notification.title),
          body: String(notification.body),
          targetPath: String(notification.target_path ?? ""),
        },
        idempotencyKey: `notification-${notification.id}-join-request-received`,
      })
      : { attempted: 0, sent: 0, failed: 0 };

    const responseBody = {
      attempted: results.length,
      sent: results.filter((result) => result.status === "fulfilled" && result.value === "sent").length,
      removed: results.filter((result) => result.status === "fulfilled" && result.value === "removed").length,
      failed: results.filter((result) => result.status === "rejected").length,
      email,
    };

    // Push 성공 여부와 별개로 필수 서비스 메일 실패를 운영에서 정상 200으로 숨기지 않는다.
    return json(responseBody, email.failed > 0 ? 502 : 200);
  } catch (error) {
    console.error("send-web-push failed", error instanceof Error ? error.message : "UNKNOWN_ERROR");
    return json({ error: "INTERNAL_ERROR" }, 500);
  }
});
