import {
  countUnreadNotifications,
  listNotificationsPage,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notifications.js";
import {
  getDirectMessage,
  markDirectMessageRead,
  subscribeNotificationUpdates,
} from "../notifications.js";
import { el, formatDateTime, getErrorMessage, setBusy } from "../ui.js";
import { contentDialog } from "./modal.js";
import { showToast } from "./toast.js";

const NOTIFICATION_PAGE_SIZE = 20;

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
  if (notification.target_path) return notification.target_path;
  if (notification.event_id) return `#/activities/${notification.event_id}`;
  return "#/activities?view=polls";
}

function notificationIsPast(notification) {
  if (!notification.expires_at) return false;
  const expiresAt = new Date(notification.expires_at).getTime();
  return Number.isFinite(expiresAt) && expiresAt <= Date.now();
}

function notificationIcon(notification) {
  if (notification.kind === "direct_message") return "✉️";
  if (notification.kind === "activity_reminder") return "⏰";
  if (notification.kind === "new_activity") return "🌿";
  return "🔔";
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
    navLink("#/prayer", "기도 제목", currentPath),
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
  const notificationState = {
    items: [],
    nextCursor: null,
    unread: 0,
    loadingMore: false,
  };

  function setUnreadBadge(unread) {
    const safeUnread = Math.max(Number(unread) || 0, 0);
    notificationWrap.querySelector(".notification-badge")?.remove();
    if (safeUnread) {
      notificationWrap.append(el("span", {
        className: "notification-badge",
        text: safeUnread > 99 ? "99+" : safeUnread,
        "aria-label": `읽지 않은 알림 ${safeUnread}개`,
      }));
    }
    notificationState.unread = safeUnread;
    return safeUnread;
  }

  async function refreshNotificationBadge() {
    try {
      setUnreadBadge(await countUnreadNotifications());
    } catch {
      // 종 아이콘 자체는 유지하고 패널을 열 때 다시 조회한다.
    }
  }

  async function openDirectMessageNotification(notification) {
    try {
      const message = await getDirectMessage(notification.message_id);
      await markDirectMessageRead(notification.message_id).catch(() => null);
      const senderName = message.sender?.display_name ?? "회원";
      const content = el("div", { className: "message-read" }, [
        el("div", { className: "message-read__meta" }, [
          el("strong", { text: senderName }),
          el("span", { className: "small subtle", text: formatDateTime(message.created_at) }),
        ]),
        el("p", { className: "prose message-read__content", text: message.content }),
      ]);
      await contentDialog({
        title: `${senderName}님의 쪽지`,
        content,
        closeText: "닫기",
      });
    } catch (error) {
      showToast(getErrorMessage(error, "쪽지를 불러오지 못했습니다."), "error");
    }
  }

  async function handleNotificationClick(notification) {
    try {
      if (!notification.is_read) {
        await markNotificationRead(notification.id);
        notification.is_read = true;
        notification.read_at = new Date().toISOString();
        setUnreadBadge(Math.max(0, notificationState.unread - 1));
      }
    } catch {
      // 대상 화면/쪽지는 계속 열고 다음 조회 때 읽음 처리를 재시도한다.
    }

    panel.hidden = true;
    notificationButton.setAttribute("aria-expanded", "false");

    if (notification.kind === "direct_message" && notification.message_id) {
      await refreshNotificationBadge();
      await openDirectMessageNotification(notification);
      return;
    }

    window.location.hash = notificationTarget(notification);
  }

  function appendNotificationGroup(title, notifications, { past = false } = {}) {
    if (!notifications.length) return;
    const group = el("section", {
      className: `notification-group ${past ? "notification-group--past" : ""}`,
    }, [
      el("div", { className: "notification-group__title", text: title }),
    ]);
    notifications.forEach((notification) => {
      group.append(el("button", {
        className: `notification-item ${notification.is_read ? "" : "notification-item--unread"} ${past ? "notification-item--past" : ""}`,
        type: "button",
        onClick: () => handleNotificationClick(notification),
      }, [
        el("span", { className: "notification-item__icon", text: notificationIcon(notification), "aria-hidden": "true" }),
        el("span", { className: "notification-item__body" }, [
          el("strong", { text: notification.title }),
          el("span", { text: notification.body }),
          el("span", { className: "small subtle", text: formatDateTime(notification.created_at) }),
        ]),
      ]));
    });
    panel.append(group);
  }

  function mergeNotificationItems(existing, incoming) {
    const byId = new Map(existing.map((item) => [Number(item.id), item]));
    incoming.forEach((item) => byId.set(Number(item.id), item));
    return [...byId.values()].sort((left, right) => Number(right.id) - Number(left.id));
  }

  function renderNotificationPanel() {
    panel.replaceChildren();
    const panelHead = el("div", { className: "page-header notification-panel__head" }, [
      el("strong", { text: "알림" }),
      notificationState.unread ? el("button", {
        className: "button button--ghost notification-panel__read-all",
        type: "button",
        text: "모두 읽음",
        onClick: async (event) => {
          setBusy(event.currentTarget, true, "처리 중…");
          try {
            await markAllNotificationsRead();
            setUnreadBadge(0);
            notificationState.items.forEach((item) => {
              item.is_read = true;
              item.read_at ??= new Date().toISOString();
            });
            renderNotificationPanel();
          } catch (error) {
            showToast(getErrorMessage(error), "error");
            setBusy(event.currentTarget, false);
          }
        },
      }) : null,
    ]);
    panel.append(panelHead);

    if (!notificationState.items.length) {
      panel.append(el("p", { className: "subtle notification-panel__empty", text: "새로운 알림이 없습니다." }));
      return;
    }

    const currentNotifications = notificationState.items.filter((item) => !notificationIsPast(item));
    const pastNotifications = notificationState.items.filter(notificationIsPast);
    appendNotificationGroup("최근 알림", currentNotifications);
    appendNotificationGroup("지난 알림", pastNotifications, { past: true });

    if (notificationState.nextCursor !== null) {
      const loadMoreButton = el("button", {
        className: "button button--ghost notification-panel__load-more",
        type: "button",
        text: "이전 알림 더 보기",
        disabled: notificationState.loadingMore,
        onClick: async () => {
          if (notificationState.loadingMore || notificationState.nextCursor === null) return;
          notificationState.loadingMore = true;
          loadMoreButton.disabled = true;
          loadMoreButton.textContent = "불러오는 중…";
          try {
            const page = await listNotificationsPage({
              cursor: notificationState.nextCursor,
              pageSize: NOTIFICATION_PAGE_SIZE,
            });
            notificationState.items = mergeNotificationItems(notificationState.items, page.items);
            notificationState.nextCursor = page.nextCursor;
            notificationState.loadingMore = false;
            renderNotificationPanel();
          } catch (error) {
            notificationState.loadingMore = false;
            loadMoreButton.disabled = false;
            loadMoreButton.textContent = "이전 알림 더 보기";
            showToast(getErrorMessage(error, "이전 알림을 불러오지 못했습니다."), "error");
          }
        },
      });
      panel.append(el("div", { className: "button-row notification-panel__pager" }, loadMoreButton));
    }
  }

  async function refreshNotifications({ loading = true } = {}) {
    if (loading) {
      panel.replaceChildren(el("div", { className: "state-box", role: "status" }, [
        el("div", { className: "spinner", "aria-hidden": "true" }),
        el("p", { text: "알림 불러오는 중…" }),
      ]));
    }
    try {
      const [page, unread] = await Promise.all([
        listNotificationsPage({ pageSize: NOTIFICATION_PAGE_SIZE }),
        countUnreadNotifications(),
      ]);
      notificationState.items = page.items;
      notificationState.nextCursor = page.nextCursor;
      notificationState.loadingMore = false;
      setUnreadBadge(unread);
      renderNotificationPanel();
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

  subscribeNotificationUpdates(auth.user?.id, async () => {
    if (panel.hidden) await refreshNotificationBadge();
    else await refreshNotifications({ loading: false });
  }, header);
  window.setTimeout(refreshNotificationBadge, 0);

  const adminLink = auth.isAdmin
    ? el("a", {
        className: "icon-button header-admin-link",
        href: "#/admin",
        text: "🛠️",
        "aria-label": "관리자 화면",
      })
    : null;
  const logoutButton = el("button", {
    className: "button button--ghost",
    type: "button",
    text: "로그아웃",
    onClick: onLogout,
  });
  actions.append(adminLink, notificationWrap, logoutButton);
  inner.append(brand, nav, actions);
  header.append(inner);
  return header;
}