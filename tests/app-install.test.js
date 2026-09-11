import test from "node:test";
import assert from "node:assert/strict";

import { resolveAppInstallMode } from "../js/app-install.js";

test("standalone mode hides install promotion", () => {
  assert.equal(resolveAppInstallMode({ standalone: true, canPrompt: true }), "installed");
});

test("native install prompt is preferred when available", () => {
  assert.equal(resolveAppInstallMode({ canPrompt: true }), "prompt");
});

test("iPhone uses the manual home screen guide", () => {
  assert.equal(resolveAppInstallMode({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)" }), "ios-guide");
});

test("iPadOS desktop user agent still uses the iOS guide", () => {
  assert.equal(resolveAppInstallMode({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)",
    platform: "MacIntel",
    maxTouchPoints: 5,
  }), "ios-guide");
});

test("Android without a native prompt falls back to browser instructions", () => {
  assert.equal(resolveAppInstallMode({ userAgent: "Mozilla/5.0 (Linux; Android 16)" }), "android-guide");
});

test("unsupported desktop browsers do not show the promotion", () => {
  assert.equal(resolveAppInstallMode({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" }), "unsupported");
});
