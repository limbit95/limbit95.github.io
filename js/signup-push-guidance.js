const PUSH_OPT_IN_SELECTOR = 'input[name="push_opt_in"]';
const GUIDANCE_ENHANCED_KEY = "pushGuidanceEnhanced";
const GUIDANCE_BOUND_KEY = "pushGuidanceBound";
const SIGNUP_PUSH_OPT_IN_DRAFT_KEY = "cheongpa:signup-push-opt-in-draft";
const SIGNUP_PUSH_METADATA_KEY = "signup_push_opt_in";
const PUSH_OPT_IN_FORM_VALUE_KEY = "pushOptInValue";

export function resolveSignupPushCapability({
  windowObject = globalThis.window,
  navigatorObject = globalThis.navigator,
  notificationObject = globalThis.Notification,
} = {}) {
  const supported = Boolean(
    windowObject
      && navigatorObject
      && "serviceWorker" in navigatorObject
      && "PushManager" in windowObject
      && notificationObject,
  );
  if (!supported) {
    return { supported: false, permission: "unsupported", requiresIosInstall: false };
  }

  const userAgent = navigatorObject.userAgent ?? "";
  const platform = navigatorObject.platform ?? "";
  const maxTouchPoints = Number(navigatorObject.maxTouchPoints ?? 0);
  const ios = /iPad|iPhone|iPod/i.test(userAgent)
    || (platform === "MacIntel" && maxTouchPoints > 1);
  const standalone = !ios
    || windowObject.matchMedia?.("(display-mode: standalone)").matches === true
    || navigatorObject.standalone === true;

  return {
    supported: true,
    permission: notificationObject.permission ?? "default",
    requiresIosInstall: ios && !standalone,
  };
}

export function resolveSignupPushGuidance(capability) {
  if (!capability?.supported) {
    return {
      status: "unsupported",
      message: "체크하면 알림 수신 의사는 저장돼요. 현재 브라우저에서는 푸시 알림을 사용할 수 없어 가입 승인 후 지원되는 브라우저에서 설정할 수 있어요.",
    };
  }
  if (capability.requiresIosInstall) {
    return {
      status: "needs-install",
      message: "체크하면 알림 수신 의사가 저장돼요. iPhone/iPad에서는 가입 승인 후 청파 같이를 홈 화면에 추가한 뒤 알림을 켤 수 있어요.",
    };
  }
  if (capability.permission === "denied") {
    return {
      status: "permission-denied",
      message: "체크하면 알림 수신 의사는 저장되지만 현재 브라우저 알림이 차단되어 있어요. 가입 승인 후 기기 또는 브라우저 설정에서 알림 권한을 허용해주세요.",
    };
  }
  if (capability.permission === "granted") {
    return {
      status: "ready",
      message: "체크하면 알림 수신 의사가 저장돼요. 가입 승인 후 이 기기에서 실제 푸시 알림을 연결할 수 있어요.",
    };
  }
  return {
    status: "needs-permission",
    message: "체크하면 알림 수신 의사가 저장돼요. 가입 승인 후 알림을 켤 때 브라우저 알림 권한을 요청합니다.",
  };
}

function currentGuidance() {
  return resolveSignupPushGuidance(resolveSignupPushCapability());
}

function readDraftValue() {
  try {
    const raw = window.sessionStorage.getItem(SIGNUP_PUSH_OPT_IN_DRAFT_KEY);
    if (raw === "true" || raw === "false") return raw === "true";
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.value === "boolean" ? parsed.value : null;
  } catch {
    return null;
  }
}

function writeDraftValue(value) {
  try {
    const raw = window.sessionStorage.getItem(SIGNUP_PUSH_OPT_IN_DRAFT_KEY);
    let userId = null;
    if (raw && raw !== "true" && raw !== "false") {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.userId === "string") userId = parsed.userId;
    }
    window.sessionStorage.setItem(SIGNUP_PUSH_OPT_IN_DRAFT_KEY, JSON.stringify({
      value: Boolean(value),
      userId,
    }));
  } catch {
    // This is only a signup-flow UX aid; server persistence does not depend on it.
  }
}

function rememberFormPushOptInValue(input) {
  const value = Boolean(input.checked);
  if (input.form?.matches("form.signup-flow")) {
    input.form.dataset[PUSH_OPT_IN_FORM_VALUE_KEY] = String(value);
  }
  writeDraftValue(value);
}

function readFormPushOptInValue(form) {
  const raw = form.dataset[PUSH_OPT_IN_FORM_VALUE_KEY];
  if (raw === "true" || raw === "false") return raw === "true";
  return readDraftValue();
}

async function syncSignupPushOptInMetadata(value) {
  const { supabase } = await import("./supabaseClient.js");
  if (!supabase) return;
  const { error } = await supabase.auth.updateUser({
    data: { [SIGNUP_PUSH_METADATA_KEY]: Boolean(value) },
  });
  if (error) throw error;
}

function handleSignupSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches("form.signup-flow")) return;
  if (form.dataset.pushOptInMetadataSynced === "true") {
    delete form.dataset.pushOptInMetadataSynced;
    return;
  }
  if (form.dataset.pushOptInMetadataSyncing === "true") {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  const pushOptInValue = readFormPushOptInValue(form);
  if (typeof pushOptInValue !== "boolean") return;

  event.preventDefault();
  event.stopImmediatePropagation();
  form.dataset.pushOptInMetadataSyncing = "true";

  void syncSignupPushOptInMetadata(pushOptInValue)
    .catch((error) => {
      console.warn("Signup push preference metadata sync failed; local fallback remains available.", error);
    })
    .finally(() => {
      delete form.dataset.pushOptInMetadataSyncing;
      form.dataset.pushOptInMetadataSynced = "true";
      form.requestSubmit();
    });
}

function enhancePushOptIn(input) {
  const checkbox = input.closest("label.checkbox");
  const help = checkbox?.querySelector(".small.subtle");
  if (!help) return;

  if (input.dataset[GUIDANCE_BOUND_KEY] !== "true") {
    const draftValue = readDraftValue();
    if (typeof draftValue === "boolean") input.checked = draftValue;
    rememberFormPushOptInValue(input);
    input.addEventListener("change", () => rememberFormPushOptInValue(input));
    input.dataset[GUIDANCE_BOUND_KEY] = "true";
  }

  const guidance = currentGuidance();
  help.textContent = ` ${guidance.message}`;
  help.dataset.pushGuidanceStatus = guidance.status;
  input.dataset[GUIDANCE_ENHANCED_KEY] = "true";
}

function enhancePushGuidance(root = document) {
  if (root instanceof Element && root.matches(PUSH_OPT_IN_SELECTOR)) enhancePushOptIn(root);
  root.querySelectorAll?.(PUSH_OPT_IN_SELECTOR).forEach(enhancePushOptIn);
}

if (typeof document !== "undefined") {
  document.addEventListener("submit", handleSignupSubmit, true);

  const app = document.getElementById("app");
  if (app) {
    enhancePushGuidance(app);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) enhancePushGuidance(node);
        });
      }
    });
    observer.observe(app, { childList: true, subtree: true });

    if (typeof window !== "undefined") {
      window.addEventListener("focus", () => enhancePushGuidance(app));
      window.addEventListener("pageshow", () => enhancePushGuidance(app));
    }
  }
}
