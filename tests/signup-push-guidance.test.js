import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  resolveSignupPushCapability,
  resolveSignupPushGuidance,
} from "../js/signup-push-guidance.js";

const signupGuidanceSource = readFileSync(new URL("../js/signup-push-guidance.js", import.meta.url), "utf8");
const persistenceMigration = readFileSync(
  new URL("../supabase/site/migrations/20260915232726_persist_signup_push_opt_in_from_auth_metadata.sql", import.meta.url),
  "utf8",
);

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

test("signup submit prefers the form-scoped push choice after the review step detaches the checkbox", () => {
  assert.match(signupGuidanceSource, /const PUSH_OPT_IN_FORM_VALUE_KEY = "pushOptInValue"/);
  assert.match(signupGuidanceSource, /input\.form\?\.matches\("form\.signup-flow"\)/);
  assert.match(signupGuidanceSource, /input\.form\.dataset\[PUSH_OPT_IN_FORM_VALUE_KEY\] = String\(value\)/);
  assert.match(signupGuidanceSource, /rememberFormPushOptInValue\(input\)/);
  assert.match(signupGuidanceSource, /const pushOptInValue = readFormPushOptInValue\(form\)/);
  assert.match(signupGuidanceSource, /typeof pushOptInValue !== "boolean"/);
  assert.match(signupGuidanceSource, /syncSignupPushOptInMetadata\(pushOptInValue\)/);
  assert.doesNotMatch(signupGuidanceSource, /form\.querySelector\(PUSH_OPT_IN_SELECTOR\)/);
  assert.match(signupGuidanceSource, /supabase\.auth\.updateUser\(\{/);
  assert.match(signupGuidanceSource, /signup_push_opt_in/);
  assert.match(signupGuidanceSource, /event\.stopImmediatePropagation\(\)/);
  assert.match(signupGuidanceSource, /form\.requestSubmit\(\)/);
});

test("signup push guidance follows the explicit page-rendered lifecycle without a subtree observer", () => {
  assert.match(signupGuidanceSource, /addEventListener\("app:page-rendered"/);
  assert.match(signupGuidanceSource, /event\.detail\?\.root \?\? app/);
  assert.doesNotMatch(signupGuidanceSource, /new MutationObserver/);
  assert.doesNotMatch(signupGuidanceSource, /observer\.observe\(app/);
});

test("signup RPC persists synchronized push intent in the same transaction as profile and join request creation", () => {
  assert.match(persistenceMigration, /raw_user_meta_data ->> 'signup_push_opt_in'/);
  assert.match(persistenceMigration, /insert into public\.push_notification_preferences\(user_id, push_opt_in, updated_at\)/);
  assert.match(persistenceMigration, /on conflict \(user_id\) do update/);
  assert.match(persistenceMigration, /return jsonb_build_object\('submitted', true, 'already_submitted', false\)/);
  assert.match(persistenceMigration, /drop function if exists public\.submit_join_request_with_push_opt_in/);
});
