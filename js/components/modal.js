import { el } from "../ui.js";

let activeModal = null;

export function closeModal(result = false) {
  if (!activeModal) return;
  activeModal.resolve(result);
  activeModal.backdrop.remove();
  document.body.classList.remove("modal-open");
  activeModal.previousFocus?.focus?.();
  activeModal = null;
}

export function confirmDialog({
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  danger = false,
}) {
  if (activeModal) closeModal(false);
  return new Promise((resolve) => {
    const previousFocus = document.activeElement;
    const backdrop = el("div", { className: "modal-backdrop" });
    const dialog = el("section", {
      className: "modal",
      role: "alertdialog",
      "aria-modal": "true",
      "aria-labelledby": "dialog-title",
      "aria-describedby": "dialog-message",
    });
    const cancelButton = el("button", {
      className: "button button--ghost",
      type: "button",
      text: cancelText,
      onClick: () => closeModal(false),
    });
    const confirmButton = el("button", {
      className: `button ${danger ? "button--danger" : ""}`,
      type: "button",
      text: confirmText,
      onClick: () => closeModal(true),
    });
    dialog.append(
      el("div", { className: "modal__header" }, [
        el("h2", { id: "dialog-title", className: "modal__title", text: title }),
        el("button", {
          className: "icon-button",
          type: "button",
          "aria-label": "대화상자 닫기",
          text: "×",
          onClick: () => closeModal(false),
        }),
      ]),
      el("p", { id: "dialog-message", text: message }),
      el("div", { className: "modal__actions" }, [cancelButton, confirmButton]),
    );
    backdrop.append(dialog);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeModal(false);
    });
    backdrop.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal(false);
      if (event.key === "Tab") {
        const focusable = [...dialog.querySelectorAll("button, a, input, select, textarea")].filter((node) => !node.disabled);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    document.getElementById("modal-root")?.append(backdrop);
    document.body.classList.add("modal-open");
    activeModal = { resolve, backdrop, previousFocus };
    confirmButton.focus();
  });
}

export function contentDialog({
  title,
  content,
  closeText = "닫기",
  showCloseAction = true,
}) {
  if (activeModal) closeModal(false);
  return new Promise((resolve) => {
    const previousFocus = document.activeElement;
    const backdrop = el("div", { className: "modal-backdrop" });
    const dialog = el("section", {
      className: "modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "content-dialog-title",
    });
    const closeButton = el("button", {
      className: "button",
      type: "button",
      text: closeText,
      onClick: () => closeModal(true),
    });
    dialog.append(
      el("div", { className: "modal__header" }, [
        el("h2", { id: "content-dialog-title", className: "modal__title", text: title }),
        el("button", { className: "icon-button", type: "button", text: "×", "aria-label": "대화상자 닫기", onClick: () => closeModal(true) }),
      ]),
      content,
    );
    if (showCloseAction) {
      dialog.append(el("div", { className: "modal__actions" }, closeButton));
    }
    backdrop.append(dialog);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeModal(true);
    });
    document.getElementById("modal-root")?.append(backdrop);
    document.body.classList.add("modal-open");
    activeModal = { resolve, backdrop, previousFocus };
    if (showCloseAction) closeButton.focus();
    else dialog.querySelector("button, a, input, select, textarea")?.focus?.();
  });
}
