self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

async function showPushNotification(title, options) {
  try {
    await self.registration.showNotification(title, {
      ...options,
      icon: new URL("./assets/images/icon-192.png", self.registration.scope).href,
      badge: new URL("./assets/images/icon-192.png", self.registration.scope).href,
    });
  } catch (error) {
    console.warn("Rich push notification failed; retrying with basic options.", error);
    await self.registration.showNotification(title, {
      body: options.body,
      tag: options.tag,
      data: options.data,
    });
  }
}

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data?.json() ?? {};
  } catch {
    payload = { body: event.data?.text() ?? "" };
  }

  const targetPath = typeof payload.target_path === "string"
    ? payload.target_path
    : "#/activities";
  event.waitUntil(showPushNotification(payload.title || "청파 같이", {
    body: payload.body || "새로운 활동 소식이 있습니다.",
    tag: payload.tag || undefined,
    data: { target_path: targetPath },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetPath = event.notification.data?.target_path || "#/activities";
  const targetUrl = new URL(targetPath, self.registration.scope).href;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const existing = windows.find((client) => new URL(client.url).origin === self.location.origin);
    if (existing) {
      await existing.navigate(targetUrl);
      return existing.focus();
    }
    return self.clients.openWindow(targetUrl);
  })());
});
