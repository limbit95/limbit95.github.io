import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const ui = readFileSync(new URL("../js/ui.js", import.meta.url), "utf8");
const components = readFileSync(new URL("../css/components.css", import.meta.url), "utf8");

test("global busy lifecycle releases detached request targets", () => {
  assert.match(ui, /let busyObserver = null/);
  assert.match(ui, /function pruneDisconnectedBusyRequests\(\)[\s\S]*target\?\.isConnected !== false[\s\S]*busyRequests\.delete\(target\)/);
  assert.match(ui, /function ensureBusyObserver\(\)[\s\S]*new MutationObserver\([\s\S]*pruneDisconnectedBusyRequests\(\)[\s\S]*syncBusyOverlay\(\)/);
  assert.match(ui, /busyObserver\.observe\(document\.body, \{ childList: true, subtree: true \}\)/);
  assert.match(ui, /if \(busyObserver\) \{[\s\S]*busyObserver\.disconnect\(\)[\s\S]*busyObserver = null/);
  assert.match(ui, /busyRequests\.set\(formOrButton, busyText\);[\s\S]*ensureBusyObserver\(\)/);
});


test("toast progress messages remain above the global loading blur", () => {
  const toastZ = Number(components.match(/\.toast-region \{[^}]*z-index:\s*(\d+)/s)?.[1]);
  const loadingZ = Number(components.match(/\.global-loading \{[^}]*z-index:\s*(\d+)/s)?.[1]);
  assert.ok(Number.isFinite(toastZ));
  assert.ok(Number.isFinite(loadingZ));
  assert.ok(toastZ > loadingZ);
});
