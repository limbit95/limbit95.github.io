import webpush from "npm:web-push@3.6.7";

const PUSH_TYPES = new Set([
  "event_participant_joined",
  "event_participant_waitlisted",
  "event_participation_cancelled",
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
      return json({ skipped: true, reason: "NOT_PUSH_TYPE" });
    }

    const subscriptions = await rest(
      `push_subscriptions?select=id,endpoint,p256dh,auth&user_id=eq.${encodeURIComponent(notification.user_id)}`,
    );
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

    return json({
      attempted: results.length,
      sent: results.filter((result) => result.status === "fulfilled" && result.value === "sent").length,
      removed: results.filter((result) => result.status === "fulfilled" && result.value === "removed").length,
      failed: results.filter((result) => result.status === "rejected").length,
    });
  } catch (error) {
    console.error("send-web-push failed", error instanceof Error ? error.message : "UNKNOWN_ERROR");
    return json({ error: "INTERNAL_ERROR" }, 500);
  }
});
