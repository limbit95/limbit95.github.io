import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveSignupPushCapability,
  resolveSignupPushGuidance,
} from "../js/signup-push-guidance.js";

function supportedEnvironment({
  userAgent = "Chrome",
  platform = "Win32",
  maxTouchPoints = 0,
  standalone = false,
  permission = "default",
} = {}) {
  return {
    windowObject: {
      PushManager: function PushManager() {},
      matchMedia: () => ({ matches: standalone }),
    },
    navigatorObject: {
      serviceWorker: {},
      userAgent,
      platform,
      maxTouchPoints,
      standalone,
    },
    notificationObject: { permission },
  };
}

test("signup push capability requires browser push APIs", () => {
  assert.deepEqual(resolveSignupPushCapability({
    windowObject: {},
    navigatorObject: {},
    notificationObject: undefined,
  }), {
    supported: false,
    permission: "unsupported",
    requiresIosInstall: false,
  });
});

test("signup push capability requires Home Screen install on iPhone and iPadOS", () => {
  const iphone = resolveSignupPushCapability(supportedEnvironment({ userAgent: "iPhone" }));
  const ipadDesktopUa = resolveSignupPushCapability(supportedEnvironment({
    userAgent: "Mozilla/5.0 Macintosh",
    platform: "MacIntel",
    maxTouchPoints: 5,
  }));
  const installedIphone = resolveSignupPushCapability(supportedEnvironment({
    userAgent: "iPhone",
    standalone: true,
  }));

  assert.equal(iphone.requiresIosInstall, true);
  assert.equal(ipadDesktopUa.requiresIosInstall, true);
  assert.equal(installedIphone.requiresIosInstall, false);
});

test("signup push guidance reflects install and permission states", () => {
  const cases = [
    [{ supported: false, permission: "unsupported", requiresIosInstall: false }, "unsupported"],
    [{ supported: true, permission: "default", requiresIosInstall: true }, "needs-install"],
    [{ supported: true, permission: "denied", requiresIosInstall: false }, "permission-denied"],
    [{ supported: true, permission: "default", requiresIosInstall: false }, "needs-permission"],
    [{ supported: true, permission: "granted", requiresIosInstall: false }, "ready"],
  ];

  for (const [capability, expectedStatus] of cases) {
    const guidance = resolveSignupPushGuidance(capability);
    assert.equal(guidance.status, expectedStatus);
    assert.ok(guidance.message.length > 0);
  }
});

test("signup guidance explains that notification intent is saved and activation happens after approval", () => {
  assert.match(
    resolveSignupPushGuidance({ supported: true, permission: "granted", requiresIosInstall: false }).message,
    /수신 의사가 저장/,
  );
  assert.match(
    resolveSignupPushGuidance({ supported: true, permission: "default", requiresIosInstall: true }).message,
    /홈 화면에 추가/,
  );
  assert.match(
    resolveSignupPushGuidance({ supported: true, permission: "default", requiresIosInstall: false }).message,
    /가입 승인 후/,
  );
});
