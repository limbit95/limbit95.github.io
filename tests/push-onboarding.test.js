import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { resolvePushOnboardingAction } from "../js/push-onboarding-state.js";

const pushReady = { supported: true, requiresIosInstall: false, permission: "default" };

test("approved entry only promotes members who opted into push", () => {
  assert.equal(resolvePushOnboardingAction({
    source: "approved-entry",
    pushOptIn: false,
    appInstallMode: "prompt",
    pushCapability: pushReady,
  }), "none");

  assert.equal(resolvePushOnboardingAction({
    source: "approved-entry",
    pushOptIn: true,
    appInstallMode: "prompt",
    pushCapability: pushReady,
  }), "install");
});

test("approved entry keeps install before permission and only enables push after app installation", () => {
  for (const appInstallMode of ["prompt", "ios-guide", "android-guide"]) {
    assert.equal(resolvePushOnboardingAction({
      source: "approved-entry",
      pushOptIn: true,
      appInstallMode,
      pushCapability: pushReady,
    }), "install");
  }

  assert.equal(resolvePushOnboardingAction({
    source: "approved-entry",
    pushOptIn: true,
    appInstallMode: "installed",
    pushCapability: pushReady,
  }), "push");

  assert.equal(resolvePushOnboardingAction({
    source: "approved-entry",
    pushOptIn: true,
    appInstallMode: "unsupported",
    pushCapability: pushReady,
  }), "none");
});

test("first activity participation promotes install, then falls back to push where install is unavailable", () => {
  assert.equal(resolvePushOnboardingAction({
    source: "first-activity",
    appInstallMode: "prompt",
    pushCapability: pushReady,
  }), "install");

  assert.equal(resolvePushOnboardingAction({
    source: "first-activity",
    appInstallMode: "installed",
    pushCapability: pushReady,
  }), "push");

  assert.equal(resolvePushOnboardingAction({
    source: "first-activity",
    appInstallMode: "unsupported",
    pushCapability: pushReady,
  }), "push");
});

test("denied, already-enabled, or already-shown onboarding does not prompt again", () => {
  assert.equal(resolvePushOnboardingAction({
    source: "approved-entry",
    pushOptIn: true,
    appInstallMode: "installed",
    pushCapability: { supported: true, requiresIosInstall: false, permission: "denied" },
  }), "none");

  assert.equal(resolvePushOnboardingAction({
    source: "first-activity",
    appInstallMode: "installed",
    pushCapability: pushReady,
    pushEnabled: true,
  }), "none");

  assert.equal(resolvePushOnboardingAction({
    source: "first-activity",
    appInstallMode: "prompt",
    pushCapability: pushReady,
    promptSeen: true,
  }), "none");
});

test("onboarding integration persists signup intent and reacts to first activity success", async () => {
  const [migration, notificationsApi, onboarding, appInstall, toast] = await Promise.all([
    readFile("supabase/site/migrations/20260915160942_add_push_onboarding_opt_in.sql", "utf8"),
    readFile("js/api/notifications.js", "utf8"),
    readFile("js/push-onboarding.js", "utf8"),
    readFile("js/app-install.js", "utf8"),
    readFile("js/components/toast.js", "utf8"),
  ]);

  assert.match(migration, /push_opt_in boolean not null default false/);
  assert.match(notificationsApi, /"push_opt_in"/);
  assert.match(notificationsApi, /export async function updatePushOptInPreference/);
  assert.match(onboarding, /cheongpa:signup-push-opt-in-draft/);
  assert.match(onboarding, /updatePushOptInPreference\(auth\.user\.id, draft\.value\)/);
  assert.match(onboarding, /참여 신청이 완료되었습니다\./);
  assert.match(onboarding, /대기 명단에 등록되었습니다\./);
  assert.match(onboarding, /enablePushNotifications\(userId\)/);
  assert.match(onboarding, /pushOnboardingDeviceStatus/);
  assert.match(appInstall, /initializePushOnboarding/);
  assert.match(toast, /new CustomEvent\("app:toast"/);
});
