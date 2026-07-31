import { el } from "../ui.js";

export function showToast(message, type = "info", duration = 3800) {
  const region = document.getElementById("toast-region");
  if (!region) return;
  const toast = el("div", {
    className: `toast toast--${type}`,
    role: type === "error" ? "alert" : "status",
  });
  const icon = type === "success" ? "✓" : type === "error" ? "!" : "ℹ";
  const close = el("button", {
    className: "toast__close",
    type: "button",
    text: "×",
    "aria-label": "알림 닫기",
    onClick: () => toast.remove(),
  });
  toast.append(el("strong", { text: icon, "aria-hidden": "true" }), el("div", { className: "toast__body", text: message }), close);
  region.append(toast);
  window.setTimeout(() => toast.remove(), duration);
}
