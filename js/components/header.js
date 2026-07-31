import { listNotifications, markAllNotificationsRead, markNotificationRead } from "../api.js";
import { el, formatDateTime, getErrorMessage } from "../ui.js";
import { showToast } from "./toast.js";

function navLink(href, label, currentPath) {
  const active = href === "#/"
    ? currentPath === "/"
    : currentPath.startsWith(href.slice(1));
  return el("a", {
    href,
    text: label,
    ...(active ? { "aria-current": "page" } : {}),
  });
}

function notificationTarget(notification) {
  if (notification.event_id) return `#/activities/${notification.event_id}`;
  return "#/activities?view=polls";
}

export function createHeader({ auth, currentPath, onLogout }) {
  const header = el("header", { className: "site-header" });
  const inner = el("div", { className: "header-inner" });
  const brand = el("a", { className: "brand", href: "#/", "aria-label": "청파 같이 홈" }, [
    el("img", { src: "./assets/images/logo.svg", alt: "", width: "42", height: "42" }),
    el("span", { text: "청파 같이" }),
  ]);
  const nav = el("nav", { className: "desktop-nav", "aria-label": "주요 메뉴" }, [
    navLink("#/", "홈", currentPath),
    navLink("#/activities", "활동", currentPath),
    navLink("#/notice", "공지사항", currentPath),
    navLink("#/community", "자유게시판", currentPath),
    navLink("#/mypage", "마이페이지", currentPath),
    auth.isAdmin ? navLink("#/admin", "관리자", currentPath) : null,
  ]);
  const actions = el("div", { className: "header-actions" });

  const notificationWrap = el("div", { className: "notification-wrap" });
  const notificationButton = el("button", {
    className: "icon-button",
    type: "button",
    text: "🔔",
    "aria-label": "알림 열기",
    "aria-expanded": "false",
    "aria-controls": "notification-panel",
  });
  const panel = el("div", {
    id: "notification-panel",
    className: "notification-panel",
    hidden: true,
  });

  async function refreshNotifications() {
    panel.replaceChildren(el("div", { className: "state-box", role: "status" }, [
      el("div", { className: "spinner", "aria-hidden": "true" }),
      el("p", { text: "알림 불러오는 중…" }),
    ]));
    try {
      const notifications = await listNotifications();
      const unread = notifications.filter((item) => !item.is_read).length;
      notificationWrap.querySelector(".notification-badge")?.remove();
      if (unread) {
        notificationWrap.append(el("span", {
          className: "notification-badge",
          text: unread > 99 ? "99+" : unread,
          "aria-label": `읽지 않은 알림 ${unread}개`,
        }));
      }
      panel.replaceChildren();
      const panelHead = el("div", { className: "page-header" }, [
        el("strong", { text: "알림" }),
        unread ? el("button", {
          className: "button button--ghost",
          type: "button",
          text: "모두 읽음",
          onClick: async () => {
            try {
              await markAllNotificationsRead();
              await refreshNotifications();
            } catch (error) {
              showToast(getErrorMessage(error), "error");
            }
          },
        }) : null,
      ]);
      panel.append(panelHead);
      if (!notifications.length) {
        panel.append(el("p", { className: "subtle", text: "새로운 알림이 없습니다." }));
        return;
      }
      notifications.forEach((notification) => {
        panel.append(el("button", {
          className: `notification-item ${notification.is_read ? "" : "notification-item--unread"}`,
          type: "button",
          onClick: async () => {
            try {
              if (!notification.is_read) await markNotificationRead(notification.id);
            } catch {
              // 이동은 계속 허용하고 다음 조회 때 읽음 처리를 재시도한다.
            }
            window.location.hash = notificationTarget(notification);
            panel.hidden = true;
            notificationButton.setAttribute("aria-expanded", "false");
          },
        }, [
          el("strong", { text: notification.title }),
          el("span", { text: notification.body }),
          el("span", { className: "small subtle", text: formatDateTime(notification.created_at) }),
        ]));
      });
    } catch (error) {
      panel.replaceChildren(el("div", { className: "notice-box notice-box--danger", role: "alert", text: getErrorMessage(error) }));
    }
  }

  notificationButton.addEventListener("click", async () => {
    panel.hidden = !panel.hidden;
    notificationButton.setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) await refreshNotifications();
  });
  notificationWrap.append(notificationButton, panel);

  const logoutButton = el("button", {
    className: "button button--ghost",
    type: "button",
    text: "로그아웃",
    onClick: onLogout,
  });
  actions.append(notificationWrap, logoutButton);
  inner.append(brand, nav, actions);
  header.append(inner);
  return header;
}
