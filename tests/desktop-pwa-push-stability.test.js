import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

function section(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.ok(start >= 0, `Missing source marker: ${startMarker}`);
  const end = endMarker ? source.indexOf(endMarker, start) : source.length;
  assert.ok(!endMarker || end > start, `Missing source marker: ${endMarker}`);
  return source.slice(start, end);
}

test("installed app resume refreshes only an already-registered service worker", async () => {
  const source = await readFile("js/app-install.js", "utf8");
  const refresh = section(
    source,
    "async function refreshRegisteredServiceWorker()",
    "\nif (typeof window !== \"undefined\")",
  );

  assert.match(source, /SERVICE_WORKER_REFRESH_MIN_INTERVAL_MS = 60_000/);
  assert.match(refresh, /navigator\.serviceWorker\.getRegistration\("\.\/"\)/);
  assert.match(refresh, /await registration\.update\(\)/);
  assert.doesNotMatch(refresh, /serviceWorker\.register/);
  assert.doesNotMatch(refresh, /requestPermission/);
  assert.doesNotMatch(refresh, /pushManager\.subscribe/);
  assert.match(source, /addEventListener\("focus", scheduleServiceWorkerRefresh\)/);
  assert.match(source, /addEventListener\("online", scheduleServiceWorkerRefresh\)/);
  assert.match(source, /addEventListener\("visibilitychange"/);
  assert.match(source, /document\.visibilityState === "visible"/);
});

test("push service worker activates updates immediately and retries basic rendering", async () => {
  const source = await readFile("push-service-worker.js", "utf8");
  const showNotification = section(
    source,
    "async function showPushNotification",
    "\nself.addEventListener(\"push\"",
  );

  assert.match(source, /addEventListener\("install"/);
  assert.match(source, /self\.skipWaiting\(\)/);
  assert.match(source, /addEventListener\("activate"/);
  assert.match(source, /self\.clients\.claim\(\)/);
  assert.match(showNotification, /icon-192\.png/);
  assert.match(showNotification, /new URL\("\.\/assets\/images\/icon-192\.png", self\.registration\.scope\)\.href/);
  assert.match(showNotification, /catch \(error\)/);
  assert.equal((showNotification.match(/self\.registration\.showNotification/g) ?? []).length, 2);
  assert.match(source, /event\.waitUntil\(showPushNotification/);
  assert.doesNotMatch(source, /addEventListener\(["']fetch["']/);
});
