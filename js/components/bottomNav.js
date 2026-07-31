import { el } from "../ui.js";

function item(href, icon, label, currentPath) {
  const route = href.slice(1);
  const active = route === "/" ? currentPath === "/" : currentPath.startsWith(route);
  return el("a", {
    href,
    ...(active ? { "aria-current": "page" } : {}),
  }, [
    el("span", { className: "nav-icon", text: icon, "aria-hidden": "true" }),
    el("span", { text: label }),
  ]);
}

export function createBottomNav({ auth, currentPath }) {
  const nav = el("nav", { className: "bottom-nav", "aria-label": "모바일 주요 메뉴" });
  nav.append(
    item("#/", "🏠", "홈", currentPath),
    item("#/activities", "🗓️", "활동", currentPath),
    item("#/notice", "📣", "공지", currentPath),
    item("#/community", "💬", "게시판", currentPath),
    auth.isAdmin
      ? item("#/admin", "🛠️", "관리", currentPath)
      : item("#/mypage", "🙂", "내 정보", currentPath),
  );
  return nav;
}
