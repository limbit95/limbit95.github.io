import { getEvent } from "./api/activities.js";
import { closeModal, contentDialog } from "./components/modal.js";
import { showToast } from "./components/toast.js";
import { el, getErrorMessage, setBusy } from "./ui.js";
import {
  copyActivityLink,
  prepareKakaoShare,
  shareActivityToKakao,
} from "./activity-share.js";

const DETAIL_ACTIONS_SELECTOR = ".activity-detail__utility-actions";
const DETAIL_ENHANCED_ATTR = "activityShareEnhanced";

let previousPath = hashPath(window.location.hash);
let pendingRegistrationShareId = null;
const eventPromises = new Map();

function hashPath(hash = window.location.hash) {
  return String(hash || "#/").split("?")[0];
}

function activityIdFromHash(hash = window.location.hash) {
  const match = hashPath(hash).match(/^#\/activities\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

function getEventCached(eventId) {
  if (!eventPromises.has(eventId)) {
    const promise = getEvent(eventId).catch((error) => {
      eventPromises.delete(eventId);
      throw error;
    });
    eventPromises.set(eventId, promise);
  }
  return eventPromises.get(eventId);
}

async function handleCopy(eventId, button = null) {
  if (button) setBusy(button, true, "복사 중…");
  try {
    await copyActivityLink(eventId);
    showToast("활동 링크를 복사했습니다.", "success");
  } catch (error) {
    showToast(getErrorMessage(error, "활동 링크를 복사하지 못했습니다."), "error");
  } finally {
    if (button?.isConnected) setBusy(button, false);
  }
}

function createShareButton(eventPromise, { beforeShare = null } = {}) {
  const button = el("button", {
    className: "button button--yellow",
    type: "button",
    text: "💬 공유 준비 중…",
    disabled: true,
  });

  Promise.all([eventPromise, prepareKakaoShare()])
    .then(([event]) => {
      if (!button.isConnected) return;
      button.disabled = false;
      button.textContent = "💬 카카오톡 공유";
      button.addEventListener("click", () => {
        beforeShare?.();
        try {
          shareActivityToKakao(event);
        } catch (error) {
          showToast(getErrorMessage(error, "카카오톡 공유를 시작하지 못했습니다."), "error");
        }
      });
    })
    .catch((error) => {
      if (!button.isConnected) return;
      button.disabled = false;
      button.textContent = "💬 카카오톡 공유";
      button.addEventListener("click", () => {
        showToast(getErrorMessage(error, "카카오톡 공유를 준비하지 못했습니다."), "error");
      });
    });

  return button;
}

function createCopyButton(eventId, { beforeCopy = null } = {}) {
  const button = el("button", {
    className: "button button--secondary",
    type: "button",
    text: "🔗 링크 복사",
  });
  button.addEventListener("click", () => {
    beforeCopy?.();
    void handleCopy(eventId, button);
  });
  return button;
}

function injectShareActions(actions, eventId) {
  if (actions.dataset[DETAIL_ENHANCED_ATTR] === "true") return;
  actions.dataset[DETAIL_ENHANCED_ATTR] = "true";
  eventPromises.delete(eventId);
  const eventPromise = getEventCached(eventId);
  const editLink = [...actions.querySelectorAll("a")].find((link) => link.getAttribute("href")?.endsWith("/edit"));
  const kakaoButton = createShareButton(eventPromise);
  const copyButton = createCopyButton(eventId);
  if (editLink) {
    actions.insertBefore(kakaoButton, editLink);
    actions.insertBefore(copyButton, editLink);
  } else {
    actions.append(kakaoButton, copyButton);
  }
}

function openRegistrationSharePrompt(eventId) {
  const eventPromise = getEventCached(eventId);
  const kakaoButton = createShareButton(eventPromise, { beforeShare: () => closeModal(true) });
  const copyButton = createCopyButton(eventId, { beforeCopy: () => closeModal(true) });
  const content = el("div", { className: "page-stack" }, [
    el("p", { text: "오픈채팅방이나 친구에게 새 활동을 바로 공유할 수 있어요." }),
    el("div", { className: "button-row" }, [kakaoButton, copyButton]),
  ]);
  void contentDialog({
    title: "활동이 등록됐어요!",
    content,
    closeText: "나중에",
  });
}

function enhanceActivityShare(root = document) {
  const eventId = activityIdFromHash();
  if (!eventId) return;

  const actions = root instanceof Element && root.matches(DETAIL_ACTIONS_SELECTOR)
    ? root
    : root.querySelector?.(DETAIL_ACTIONS_SELECTOR);
  if (!actions) return;

  injectShareActions(actions, eventId);
  if (pendingRegistrationShareId === eventId) {
    pendingRegistrationShareId = null;
    requestAnimationFrame(() => openRegistrationSharePrompt(eventId));
  }
}

window.addEventListener("hashchange", () => {
  const nextPath = hashPath();
  const eventId = activityIdFromHash();
  if (previousPath === "#/activities/new" && eventId) {
    pendingRegistrationShareId = eventId;
  }
  previousPath = nextPath;
});

const app = document.getElementById("app");
if (app) {
  enhanceActivityShare(app);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) enhanceActivityShare(node);
      });
    }
  });
  observer.observe(app, { childList: true, subtree: true });
}
