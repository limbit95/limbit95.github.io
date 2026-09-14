const PUSH_OPT_IN_SELECTOR = 'input[name="push_opt_in"]';
const GUIDANCE_ENHANCED_KEY = "pushGuidanceEnhanced";

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
      message: "현재 브라우저에서는 푸시 알림을 사용할 수 없어요. 가입 승인 후 지원되는 브라우저에서 알림을 켤 수 있어요.",
    };
  }
  if (capability.requiresIosInstall) {
    return {
      status: "needs-install",
      message: "iPhone/iPad에서는 청파 같이를 홈 화면에 추가해야 푸시 알림을 사용할 수 있어요. 현재 선택만으로 알림이 바로 켜지지는 않으며, 가입 승인 후 실제 알림을 활성화할 수 있어요.",
    };
  }
  if (capability.permission === "denied") {
    return {
      status: "permission-denied",
      message: "현재 브라우저에서 알림이 차단되어 있어요. 가입 승인 후 기기 또는 브라우저 설정에서 알림 권한을 허용한 뒤 다시 켜주세요.",
    };
  }
  if (capability.permission === "granted") {
    return {
      status: "ready",
      message: "이 기기에서는 푸시 알림을 사용할 수 있어요. 현재 선택만으로 알림이 바로 켜지지는 않으며, 가입 승인 후 마이페이지에서 실제 알림을 활성화할 수 있어요.",
    };
  }
  return {
    status: "needs-permission",
    message: "푸시 알림을 사용하려면 브라우저 알림 권한 허용이 필요해요. 권한 요청은 가입 승인 후 알림을 켤 때 진행됩니다.",
  };
}

function currentGuidance() {
  return resolveSignupPushGuidance(resolveSignupPushCapability());
}

function enhancePushOptIn(input) {
  const checkbox = input.closest("label.checkbox");
  const help = checkbox?.querySelector(".small.subtle");
  if (!help) return;

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
