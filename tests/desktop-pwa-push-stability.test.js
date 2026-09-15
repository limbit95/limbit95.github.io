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

test("desktop PWA resume reuses the existing push coordinator without prompting", async () => {
  const source = await readFile("js/app-install.js", "utf8");
  const reconcile = section(
    source,
    "async function reconcilePushAfterResume()",
    "\nif (typeof window !== \"undefined\")",
  );

  assert.match(source, /PUSH_RESUME_RECONCILE_MIN_INTERVAL_MS = 60_000/);
  assert.match(reconcile, /import\("\.\/auth\.js"\)/);
  assert.match(reconcile, /import\("\.\/web-push\.js"\)/);
  assert.match(reconcile, /auth\.profile\?\.status !== "approved"/);
  assert.match(reconcile, /getPushPreference\(userId\) !== "on"/);
  assert.match(reconcile, /setPushDesiredAuthContext\(auth\)/);
  assert.doesNotMatch(reconcile, /requestPermission/);
  assert.match(source, /addEventListener\("focus", schedulePushResumeReconcile\)/);
  assert.match(source, /addEventListener\("online", schedulePushResumeReconcile\)/);
  assert.match(source, /addEventListener\("visibilitychange"/);
  assert.match(source, /document\.visibilityState === "visible"/);
});

test("push service worker retries a basic notification when rich rendering fails", async () => {
  const source = await readFile("push-service-worker.js", "utf8");
  const showNotification = section(
    source,
    "async function showPushNotification",
    "\nself.addEventListener(\"push\"",
  );

  assert.match(showNotification, /icon-192\.png/);
  assert.match(showNotification, /new URL\("\.\/assets\/images\/icon-192\.png", self\.registration\.scope\)\.href/);
  assert.match(showNotification, /catch \(error\)/);
  assert.equal((showNotification.match(/self\.registration\.showNotification/g) ?? []).length, 2);
  assert.match(source, /event\.waitUntil\(showPushNotification/);
  assert.doesNotMatch(source, /addEventListener\(["']fetch["']/);
});
