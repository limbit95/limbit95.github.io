const ERROR_MESSAGES = [
  [/Failed to fetch|NetworkError|fetch failed/i, "네트워크 연결을 확인한 뒤 다시 시도해 주세요."],
  [/Invalid login credentials/i, "이메일 또는 비밀번호가 올바르지 않습니다."],
  [/Email not confirmed/i, "이메일 인증을 완료한 뒤 로그인해 주세요."],
  [/User already registered/i, "이미 가입된 이메일입니다."],
  [/Password should be at least/i, "비밀번호는 8자 이상 입력해 주세요."],
  [/JWT expired/i, "로그인 시간이 만료되었습니다. 다시 로그인해 주세요."],
  [/row-level security|42501|permission denied/i, "이 작업을 수행할 권한이 없습니다."],
  [/duplicate key|23505/i, "이미 등록된 정보입니다."],
  [/capacity|정원/i, "모집 정원이 마감되었습니다."],
];

export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(options).forEach(([key, value]) => {
    if (value == null || value === false) return;
    if (key === "className") node.className = value;
    else if (key === "text") node.textContent = String(value);
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key === "style") Object.assign(node.style, value);
    else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value === true) node.setAttribute(key, "");
    else node.setAttribute(key, String(value));
  });
  const list = Array.isArray(children) ? children : [children];
  list.forEach((child) => {
    if (child == null || child === false) return;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });
  return node;
}

export function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function safeUrl(value, fallback = "#") {
  if (!value) return fallback;
  try {
    const url = new URL(value, window.location.href);
    if (["http:", "https:"].includes(url.protocol)) return url.href;
  } catch {
    return fallback;
  }
  return fallback;
}

export function formatDate(value, options = {}) {
  if (!value) return "-";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(value))
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const { weekday = "short", ...dateOptions } = options;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: weekday === false ? undefined : weekday,
    ...dateOptions,
  }).format(date);
}

export function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatTime(value) {
  return value ? String(value).slice(0, 5) : "-";
}

export function seoulDateString(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function relativeTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });
  const ranges = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [size, unit] of ranges) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
  }
  return "방금 전";
}

export function getErrorMessage(error, fallback = "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.") {
  const source = [error?.message, error?.details, error?.hint, error?.code].filter(Boolean).join(" ");
  for (const [pattern, message] of ERROR_MESSAGES) {
    if (pattern.test(source)) return message;
  }
  const korean = source.match(/[가-힣][가-힣\s.,!?'"()·~-]{3,}/)?.[0]?.trim();
  return korean || fallback;
}

export function setBusy(formOrButton, busy, busyText = "처리 중…") {
  const buttons = formOrButton instanceof HTMLFormElement
    ? formOrButton.querySelectorAll('button[type="submit"]')
    : [formOrButton];
  buttons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;
    if (busy) {
      button.dataset.originalText = button.textContent;
      button.textContent = busyText;
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
      button.removeAttribute("aria-busy");
      delete button.dataset.originalText;
    }
  });
}

export function loadingState(message = "불러오는 중…") {
  return el("div", { className: "state-box", role: "status", "aria-live": "polite" }, [
    el("div", { className: "spinner", "aria-hidden": "true" }),
    el("p", { text: message }),
  ]);
}

export function emptyState(title, message, action = null) {
  return el("div", { className: "state-box" }, [
    el("img", { src: "./assets/images/empty-activity.svg", alt: "", width: "180", height: "124" }),
    el("h2", { className: "section-title", text: title }),
    el("p", { className: "subtle", text: message }),
    action,
  ]);
}

export function errorState(message, retry) {
  return el("div", { className: "state-box", role: "alert" }, [
    el("div", { className: "status-page__icon", text: "⚠️", "aria-hidden": "true" }),
    el("h2", { className: "section-title", text: "연결에 문제가 생겼어요" }),
    el("p", { className: "subtle", text: message }),
    retry ? el("button", { className: "button button--secondary", type: "button", text: "다시 시도", onClick: retry }) : null,
  ]);
}

export function accessDeniedState(message = "이 화면을 이용할 권한이 없습니다.") {
  return el("div", { className: "state-box", role: "alert" }, [
    el("div", { className: "status-page__icon", text: "🔒", "aria-hidden": "true" }),
    el("h1", { className: "section-title", text: "접근 권한 없음" }),
    el("p", { className: "subtle", text: message }),
    el("a", { className: "button", href: "#/", text: "홈으로" }),
  ]);
}

export function debounce(callback, wait = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), wait);
  };
}

export function downloadFile(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = el("a", { href: url, download: filename });
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function pageContainer(...children) {
  return el("div", { className: "page-container" }, children);
}