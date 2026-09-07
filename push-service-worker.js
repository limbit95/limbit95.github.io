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
  event.waitUntil(self.registration.showNotification(payload.title || "청파 같이", {
    body: payload.body || "새로운 활동 소식이 있습니다.",
    icon: "./assets/images/logo.svg",
    badge: "./assets/images/logo.svg",
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
