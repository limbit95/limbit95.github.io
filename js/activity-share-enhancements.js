import { closeModal, contentDialog } from "./components/modal.js";
import { showToast } from "./components/toast.js";
import { el, getErrorMessage, setBusy } from "./ui.js";
import {
  copyActivityLink,
  prepareKakaoShare,
  shareActivityToKakao,
} from "./activity-share.js";

const SHARE_AFTER_CREATE_KEY = "activity-share-after-create";
const DETAIL_ACTIONS_SELECTOR = ".activity-detail__utility-actions";
const DETAIL_ENHANCED_ATTR = "activityShareEnhanced";

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

function createShareButton(event, { beforeShare = null } = {}) {
  const button = el("button", {
    className: "button button--yellow",
    type: "button",
    text: "💬 공유 준비 중…",
    disabled: true,
  });

  prepareKakaoShare()
    .then(() => {
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

function injectShareActions(root, event) {
  const actions = root.querySelector(DETAIL_ACTIONS_SELECTOR);
  if (!actions || actions.dataset[DETAIL_ENHANCED_ATTR] === "true") return;
  actions.dataset[DETAIL_ENHANCED_ATTR] = "true";

  const editLink = [...actions.querySelectorAll("a")].find((link) => link.getAttribute("href")?.endsWith("/edit"));
  const kakaoButton = createShareButton(event);
  const copyButton = createCopyButton(event.id);
  if (editLink) {
    actions.insertBefore(kakaoButton, editLink);
    actions.insertBefore(copyButton, editLink);
  } else {
    actions.append(kakaoButton, copyButton);
  }
}

function consumeRegistrationSharePrompt(eventId) {
  try {
    const storedEventId = Number(window.sessionStorage.getItem(SHARE_AFTER_CREATE_KEY));
    if (storedEventId !== Number(eventId)) return false;
    window.sessionStorage.removeItem(SHARE_AFTER_CREATE_KEY);
    return true;
  } catch {
    return false;
  }
}

function openRegistrationSharePrompt(event) {
  const kakaoButton = createShareButton(event, { beforeShare: () => closeModal(true) });
  const copyButton = createCopyButton(event.id, { beforeCopy: () => closeModal(true) });
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

export function enhanceActivityShare(root, event) {
  if (!root || !event?.id) return;
  injectShareActions(root, event);
  if (consumeRegistrationSharePrompt(event.id)) {
    requestAnimationFrame(() => openRegistrationSharePrompt(event));
  }
}
