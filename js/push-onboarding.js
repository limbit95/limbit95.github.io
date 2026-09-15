import { getAuthState } from "./auth.js";
import { resolvePushOnboardingAction } from "./push-onboarding-state.js";
import {
  getPushNotificationPreferences,
  updatePushOptInPreference,
} from "./api/notifications.js";
import { closeModal, contentDialog } from "./components/modal.js";
import { showToast } from "./components/toast.js";
import { el, getErrorMessage, setBusy } from "./ui.js";
import {
  enablePushNotifications,
  getPushCapability,
  getPushNotificationState,
  getPushPreference,
} from "./web-push.js";

const SIGNUP_PUSH_OPT_IN_DRAFT_KEY = "cheongpa:signup-push-opt-in-draft";
const PROMPT_MARKER_PREFIX = "cheongpa:push-onboarding:";
const LOCAL_PUSH_INTENT_PREFIX = "cheongpa:push-onboarding-intent:";
const FIRST_ACTIVITY_SUCCESS_MESSAGES = new Set([
  "참여 신청이 완료되었습니다.",
  "대기 명단에 등록되었습니다.",
]);
const MY_PAGE_PUSH_ENABLED_MESSAGE = "이 기기의 푸시 알림을 켰습니다.";
let initialized = false;
let surfaceCheckScheduled = false;
let onboardingOpen = false;
let appObserver = null;
let installApi = {
  getAppInstallMode: () => "unsupported",
  promptAppInstall: async () => "unavailable",
};
const approvedEntryInFlightUserIds = new Set();
const volatilePromptMarkers = new Set();

export { resolvePushOnboardingAction } from "./push-onboarding-state.js";

function promptMarkerKey(userId, kind) {
  return `${PROMPT_MARKER_PREFIX}${userId}:${kind}:v1`;
}

function localPushIntentKey(userId) {
  return `${LOCAL_PUSH_INTENT_PREFIX}${userId}:v1`;
}

function readLocalStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function hasPromptMarker(userId, kind) {
  const key = promptMarkerKey(userId, kind);
  return readLocalStorage(key) === "shown" || volatilePromptMarkers.has(key);
}

function markPromptMarker(userId, kind) {
  const key = promptMarkerKey(userId, kind);
  volatilePromptMarkers.add(key);
  writeLocalStorage(key, "shown");
}

function rememberLocalPushIntent(userId) {
  if (!userId) return;
  writeLocalStorage(localPushIntentKey(userId), "true");
}

function hasLocalPushIntent(userId) {
  return Boolean(userId && readLocalStorage(localPushIntentKey(userId)) === "true");
}

function readSignupPushDraft() {
  try {
    const raw = window.sessionStorage.getItem(SIGNUP_PUSH_OPT_IN_DRAFT_KEY);
    if (raw === null) return null;
    if (raw === "true" || raw === "false") {
      return { value: raw === "true", userId: null };
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed?.value !== "boolean") return null;
    return {
      value: parsed.value,
      userId: typeof parsed.userId === "string" ? parsed.userId : null,
    };
  } catch {
    return null;
  }
}

function writeSignupPushDraft(value, userId = null) {
  try {
    window.sessionStorage.setItem(SIGNUP_PUSH_OPT_IN_DRAFT_KEY, JSON.stringify({
      value: Boolean(value),
      userId: userId || null,
    }));
  } catch {
    // The signup flow itself must continue even if session storage is unavailable.
  }
}

function clearSignupPushDraft() {
  try {
    window.sessionStorage.removeItem(SIGNUP_PUSH_OPT_IN_DRAFT_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
}

async function persistSignupPushOptInIfReady() {
  const draft = readSignupPushDraft();
  if (!draft?.userId) return false;

  const auth = getAuthState();
  if (!auth.user?.id || auth.user.id !== draft.userId || !auth.profile) return false;

  try {
    await updatePushOptInPreference(auth.user.id, draft.value);
    if (draft.value) rememberLocalPushIntent(auth.user.id);
    clearSignupPushDraft();
    return true;
  } catch (error) {
    console.warn("Signup push preference could not be persisted yet.", error);
    return false;
  }
}

async function getPushDeviceState(userId) {
  const capability = getPushCapability();
  const preference = getPushPreference(userId);
  let owned = false;

  if (
    capability.supported
    && !capability.requiresIosInstall
    && capability.permission === "granted"
  ) {
    try {
      owned = Boolean((await getPushNotificationState()).owned);
    } catch {
      owned = false;
    }
  }

  return {
    capability,
    preference,
    owned,
    enabled: owned && capability.permission === "granted",
  };
}

function onboardingPromptKind(source, action) {
  if (source === "first-activity") return "first-activity";
  return action === "install" ? "approved-install" : "push-enable";
}

function canOpenOnboardingDialog() {
  return !onboardingOpen && !document.querySelector("#modal-root .modal-backdrop");
}

async function maybeShowOnboarding(source) {
  const auth = getAuthState();
  if (!auth.user?.id || auth.profile?.status !== "approved") return "none";

  const userId = auth.user.id;
  let pushOptIn = hasLocalPushIntent(userId);
  try {
    const preferences = await getPushNotificationPreferences(userId);
    pushOptIn = Boolean(preferences.push_opt_in) || pushOptIn;
  } catch (error) {
    if (source === "approved-entry") {
      console.warn("Push onboarding preference could not be loaded.", error);
      return "none";
    }
  }

  if (getAuthState().user?.id !== userId || getAuthState().profile?.status !== "approved") return "none";

  const appInstallMode = installApi.getAppInstallMode();
  const pushState = await getPushDeviceState(userId);

  const preliminaryAction = resolvePushOnboardingAction({
    source,
    pushOptIn,
    appInstallMode,
    pushCapability: pushState.capability,
    pushEnabled: pushState.enabled,
  });
  if (preliminaryAction === "none") return "none";

  const promptKind = onboardingPromptKind(source, preliminaryAction);
  const action = resolvePushOnboardingAction({
    source,
    pushOptIn,
    appInstallMode,
    pushCapability: pushState.capability,
    pushEnabled: pushState.enabled,
    promptSeen: hasPromptMarker(userId, promptKind),
  });
  if (action === "none" || !canOpenOnboardingDialog()) return "none";

  markPromptMarker(userId, promptKind);
  if (action === "install") {
    await openInstallPromotion({ source, userId, appInstallMode });
  } else if (action === "push") {
    await openPushPromotion({ source, userId });
  }
  return action;
}

async function maybeShowApprovedEntryOnboarding() {
  const auth = getAuthState();
  const userId = auth.user?.id;
  if (!userId || auth.profile?.status !== "approved") return;
  if (approvedEntryInFlightUserIds.has(userId)) return;

  approvedEntryInFlightUserIds.add(userId);
  try {
    await maybeShowOnboarding("approved-entry");
  } catch (error) {
    console.warn("Approved-entry push onboarding failed.", error);
  } finally {
    approvedEntryInFlightUserIds.delete(userId);
  }
}

function installPromotionCopy(source) {
  if (source === "first-activity") {
    return {
      title: "활동 참여 신청이 완료되었습니다!",
      message: "일정 변경이나 참여 관련 소식을 놓치지 않도록 청파 같이 앱을 설치하고 알림을 받아보세요.",
    };
  }
  return {
    title: "청파 같이를 앱처럼 사용해보세요",
    message: "홈 화면에 추가하면 활동 일정과 참여 변경 소식을 더 편하게 확인할 수 있어요. 가입할 때 선택한 알림은 앱 설치 후 이어서 설정할 수 있습니다.",
  };
}

function installPrimaryLabel(source, mode) {
  if (mode === "ios-guide") return "홈 화면 추가 방법 보기";
  if (mode === "android-guide") return "앱 설치 방법 보기";
  return source === "first-activity" ? "앱 설치하고 알림 받기" : "청파 같이 앱 설치하기";
}

async function openInstallPromotion({ source, userId, appInstallMode }) {
  onboardingOpen = true;
  const copy = installPromotionCopy(source);
  const primaryButton = el("button", {
    className: "button",
    type: "button",
    text: installPrimaryLabel(source, appInstallMode),
  });
  const laterButton = el("button", {
    className: "button button--ghost",
    type: "button",
    text: "나중에",
    onClick: () => closeModal(false),
  });
  const content = el("div", { className: "page-stack" }, [
    el("p", { className: "prose", text: copy.message }),
    el("div", { className: "notice-box" }, [
      el("strong", { text: "설치 후에는" }),
      el("p", { className: "small subtle", text: "홈 화면의 청파 같이 앱에서 알림을 켜면 활동 일정 변경, 참여 상태, 주최자 변경, 중요한 공지를 푸시로 받을 수 있어요." }),
    ]),
    el("div", { className: "modal__actions" }, [laterButton, primaryButton]),
  ]);

  primaryButton.addEventListener("click", async () => {
    rememberLocalPushIntent(userId);
    if (source === "first-activity") {
      void updatePushOptInPreference(userId, true).catch((error) => {
        console.warn("First-activity push intent could not be synced yet.", error);
      });
    }

    if (appInstallMode === "prompt") {
      primaryButton.disabled = true;
      primaryButton.textContent = "설치 안내 여는 중…";
      closeModal(true);
      try {
        const outcome = await installApi.promptAppInstall();
        if (outcome === "accepted") showToast("청파 같이 앱 설치를 시작했습니다.", "success");
      } catch (error) {
        showToast(getErrorMessage(error, "앱 설치 안내를 열지 못했습니다."), "error");
      } finally {
        scheduleSurfaceCheck();
      }
      return;
    }

    closeModal(true);
    await openInstallGuide(appInstallMode);
  });

  try {
    await contentDialog({
      title: copy.title,
      content,
      showCloseAction: false,
    });
  } finally {
    onboardingOpen = false;
  }
}

async function openInstallGuide(mode) {
  const isIos = mode === "ios-guide";
  const steps = isIos
    ? [
        "Safari의 공유 버튼을 눌러주세요.",
        "메뉴에서 ‘홈 화면에 추가’를 선택해주세요.",
        "홈 화면에 추가된 청파 같이 앱을 실행해주세요.",
      ]
    : [
        "브라우저 메뉴(⋮)를 열어주세요.",
        "‘앱 설치’ 또는 ‘홈 화면에 추가’를 선택해주세요.",
        "설치된 청파 같이 앱을 실행해주세요.",
      ];
  const content = el("div", { className: "page-stack" }, [
    el("p", {
      className: "prose",
      text: isIos
        ? "iPhone/iPad에서는 홈 화면에 추가한 청파 같이 앱에서 푸시 알림을 사용할 수 있어요."
        : "브라우저 메뉴에서 청파 같이를 앱으로 설치하거나 홈 화면에 추가할 수 있어요.",
    }),
    el("ol", {}, steps.map((text) => el("li", { text }))),
  ]);
  return contentDialog({
    title: isIos ? "iPhone/iPad 홈 화면에 추가하기" : "청파 같이 앱 설치하기",
    content,
    closeText: "확인",
  });
}

async function openPushPromotion({ source, userId }) {
  onboardingOpen = true;
  const primaryButton = el("button", {
    className: "button",
    type: "button",
    text: "알림 켜기",
  });
  const laterButton = el("button", {
    className: "button button--ghost",
    type: "button",
    text: "나중에",
    onClick: () => closeModal(false),
  });
  const content = el("div", { className: "page-stack" }, [
    el("p", {
      className: "prose",
      text: source === "first-activity"
        ? "방금 신청한 활동의 일정 변경이나 참여 관련 소식을 놓치지 않도록 알림을 켜주세요."
        : "활동 일정 변경, 참여 상태, 주최자 변경, 중요한 공지를 놓치지 않도록 알림을 켜주세요.",
    }),
    el("p", { className: "small subtle", text: "알림 권한은 ‘알림 켜기’를 누른 뒤 브라우저에서 한 번 더 허용해야 합니다." }),
    el("div", { className: "modal__actions" }, [laterButton, primaryButton]),
  ]);

  primaryButton.addEventListener("click", async () => {
    rememberLocalPushIntent(userId);
    const enablePromise = enablePushNotifications(userId);
    const intentPromise = updatePushOptInPreference(userId, true).catch((error) => {
      console.warn("Push onboarding intent could not be synced.", error);
      return null;
    });
    setBusy(primaryButton, true, "알림 설정 중…");
    try {
      await enablePromise;
      await intentPromise;
      closeModal(true);
      showToast("이 기기의 푸시 알림을 켰습니다.", "success");
    } catch (error) {
      showToast(getErrorMessage(error, "푸시 알림을 켜지 못했습니다."), "error");
    } finally {
      setBusy(primaryButton, false);
      scheduleSurfaceCheck();
    }
  });

  try {
    await contentDialog({
      title: "청파 같이 알림을 켜주세요",
      content,
      showCloseAction: false,
    });
  } finally {
    onboardingOpen = false;
  }
}

function findNotificationSettingsNotice() {
  const sections = document.querySelectorAll("#main-content section.card.page-stack");
  for (const section of sections) {
    if (section.querySelector("h2.section-title")?.textContent?.trim() !== "알림 설정") continue;
    for (const notice of section.querySelectorAll(".notice-box")) {
      const strong = [...notice.querySelectorAll(":scope > strong")]
        .find((node) => node.textContent?.trim() === "이 기기 푸시 알림");
      if (strong) return notice;
    }
  }
  return null;
}

function createMyPageDeviceStatusBlock() {
  const installStatus = el("p", { className: "subtle" });
  const pushStatus = el("p", { className: "subtle" });
  const installButton = el("button", {
    className: "button button--secondary",
    type: "button",
  });
  const block = el("div", {
    className: "page-stack",
    dataset: { pushOnboardingDeviceStatus: "true" },
  }, [
    el("strong", { text: "앱·기기 상태" }),
    installStatus,
    installButton,
    pushStatus,
  ]);

  installButton.addEventListener("click", async () => {
    const mode = installApi.getAppInstallMode();
    if (mode === "prompt") {
      installButton.disabled = true;
      installButton.textContent = "설치 안내 여는 중…";
      try {
        const outcome = await installApi.promptAppInstall();
        if (outcome === "accepted") showToast("청파 같이 앱 설치를 시작했습니다.", "success");
      } catch (error) {
        showToast(getErrorMessage(error, "앱 설치 안내를 열지 못했습니다."), "error");
      } finally {
        installButton.disabled = false;
        scheduleSurfaceCheck();
      }
      return;
    }
    if (["ios-guide", "android-guide"].includes(mode)) await openInstallGuide(mode);
  });

  return { block, installStatus, pushStatus, installButton };
}

async function enhanceMyPageDeviceStatus() {
  const notice = findNotificationSettingsNotice();
  if (!notice) return;

  let block = notice.querySelector("[data-push-onboarding-device-status]");
  let parts;
  if (!block) {
    parts = createMyPageDeviceStatusBlock();
    notice.prepend(parts.block);
    block = parts.block;
  } else {
    parts = {
      block,
      installStatus: block.querySelector("p:nth-of-type(1)"),
      installButton: block.querySelector("button"),
      pushStatus: block.querySelector("p:nth-of-type(2)"),
    };
  }

  const auth = getAuthState();
  if (!auth.user?.id || auth.profile?.status !== "approved") return;

  const mode = installApi.getAppInstallMode();
  const pushState = await getPushDeviceState(auth.user.id);

  if (mode === "installed") {
    parts.installStatus.textContent = "앱 설치 · ✓ 완료";
    parts.installButton.hidden = true;
  } else if (mode === "prompt") {
    parts.installStatus.textContent = "앱 설치 · 필요";
    parts.installButton.hidden = false;
    parts.installButton.textContent = "청파 같이 앱 설치하기";
  } else if (mode === "ios-guide") {
    parts.installStatus.textContent = "앱 설치 · 필요";
    parts.installButton.hidden = false;
    parts.installButton.textContent = "홈 화면 추가 방법 보기";
  } else if (mode === "android-guide") {
    parts.installStatus.textContent = "앱 설치 · 필요";
    parts.installButton.hidden = false;
    parts.installButton.textContent = "앱 설치 방법 보기";
  } else {
    parts.installStatus.textContent = "앱 설치 · 브라우저 메뉴에서 확인";
    parts.installButton.hidden = true;
  }

  if (!pushState.capability.supported) {
    parts.pushStatus.textContent = "푸시 알림 · 지원되지 않음";
  } else if (mode === "ios-guide" || pushState.capability.requiresIosInstall) {
    parts.pushStatus.textContent = "푸시 알림 · 앱 설치 후 사용 가능";
  } else if (pushState.capability.permission === "denied") {
    parts.pushStatus.textContent = "푸시 알림 · 차단됨";
  } else if (pushState.enabled && pushState.owned) {
    parts.pushStatus.textContent = "푸시 알림 · ✓ 켜짐";
  } else if (pushState.enabled) {
    parts.pushStatus.textContent = "푸시 알림 · 연결 중";
  } else {
    parts.pushStatus.textContent = "푸시 알림 · 설정 필요";
  }

  if (mode === "ios-guide") {
    const coreDescription = [...notice.querySelectorAll(":scope > p.subtle")]
      .find((node) => !block.contains(node));
    const coreButton = [...notice.querySelectorAll(":scope > button")]
      .find((node) => !block.contains(node));
    if (coreDescription) {
      coreDescription.textContent = "iPhone/iPad에서는 청파 같이를 홈 화면에 추가한 뒤 푸시 알림을 사용할 수 있습니다.";
    }
    if (coreButton) coreButton.hidden = true;
  }
}

function scheduleSurfaceCheck() {
  if (surfaceCheckScheduled || typeof window === "undefined") return;
  surfaceCheckScheduled = true;
  window.setTimeout(async () => {
    surfaceCheckScheduled = false;
    await persistSignupPushOptInIfReady();
    await enhanceMyPageDeviceStatus();
  }, 0);
}

function scheduleApprovedEntryCheck() {
  scheduleSurfaceCheck();
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    void maybeShowApprovedEntryOnboarding();
  }, 0);
}

function handleSignupFormSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches("form.signup-flow")) return;
  const input = form.querySelector('input[name="push_opt_in"]');
  if (!(input instanceof HTMLInputElement)) return;
  writeSignupPushDraft(input.checked, getAuthState().user?.id ?? null);
}

function handleAppToast(event) {
  const message = String(event.detail?.message ?? "");
  const type = event.detail?.type;
  if (type === "success" && FIRST_ACTIVITY_SUCCESS_MESSAGES.has(message)) {
    window.setTimeout(() => {
      void maybeShowOnboarding("first-activity");
    }, 0);
  }
  if (type === "success" && message === MY_PAGE_PUSH_ENABLED_MESSAGE) {
    const auth = getAuthState();
    if (!auth.user?.id || auth.profile?.status !== "approved") return;
    rememberLocalPushIntent(auth.user.id);
    void updatePushOptInPreference(auth.user.id, true).catch((error) => {
      console.warn("Manual push enable intent could not be synced.", error);
    });
    scheduleSurfaceCheck();
  }
}

export function initializePushOnboarding({
  getAppInstallMode,
  promptAppInstall,
} = {}) {
  if (typeof getAppInstallMode === "function") installApi.getAppInstallMode = getAppInstallMode;
  if (typeof promptAppInstall === "function") installApi.promptAppInstall = promptAppInstall;
  if (initialized || typeof window === "undefined" || typeof document === "undefined") return scheduleSurfaceCheck;
  initialized = true;

  document.addEventListener("submit", handleSignupFormSubmit, true);
  window.addEventListener("hashchange", scheduleApprovedEntryCheck);
  window.addEventListener("pageshow", scheduleApprovedEntryCheck);
  window.addEventListener("focus", scheduleApprovedEntryCheck);
  window.addEventListener("app:toast", handleAppToast);
  window.addEventListener("app:auth-changed", (event) => {
    if (event.detail?.event === "SIGNED_OUT") {
      clearSignupPushDraft();
      approvedEntryInFlightUserIds.clear();
    }
    scheduleApprovedEntryCheck();
  });

  const app = document.getElementById("app");
  if (app) {
    appObserver = new MutationObserver(scheduleSurfaceCheck);
    appObserver.observe(app, { childList: true, subtree: true });
  }
  scheduleApprovedEntryCheck();
  return scheduleApprovedEntryCheck;
}
