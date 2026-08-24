import { getAuthState } from "../auth.js";
import {
  cancelEventParticipation,
  joinEvent,
  listEvents,
  listMyParticipations,
  listPosts,
} from "../api.js";
import { createActivityCard } from "../components/activityCard.js";
import { confirmDialog } from "../components/modal.js";
import { showToast } from "../components/toast.js";
import {
  el,
  emptyState,
  formatDate,
  getErrorMessage,
  pageContainer,
  seoulDateString,
  setBusy,
} from "../ui.js";

export async function renderHome() {
  const auth = getAuthState();
  const today = seoulDateString();
  const [events, notices, participations] = await Promise.all([
    listEvents({ fromDate: today, limit: 8 }),
    listPosts({ boardType: "notice", pageSize: 4 }),
    listMyParticipations(auth.user.id),
  ]);

  const root = pageContainer();
  const hero = el("section", { className: "hero" }, [
    el("div", {}, [
      el("p", { className: "eyebrow", text: "TOGETHER, EVERY DAY" }),
      el("h1", { text: `${auth.profile.display_name}님,\n오늘도 같이해요!` }),
      el("p", { text: "가볍게 만나고, 즐겁게 움직이며, 따뜻하게 연결되는 청년 공동체입니다." }),
    ]),
    el("div", { className: "hero-actions" }, [
      el("a", { className: "button button--yellow", href: "#/activities", text: "🗓️ 이번 활동 보기" }),
      el("a", { className: "button button--coral", href: "#/games", text: "🎮 게임" }),
      auth.isAdmin || auth.managerCategoryIds.size
        ? el("a", { className: "button button--coral", href: "#/activities/new", text: "＋ 활동 등록" })
        : el("a", { className: "button button--secondary", href: "#/mypage", text: "🙂 내 참여 보기" }),
    ]),
  ]);

  const joinedUpcoming = participations
    .filter((item) => item.event && item.event.event_date >= today && item.event.status === "scheduled")
    .sort((a, b) => a.event.event_date.localeCompare(b.event.event_date));
  const quick = el("section", { className: "quick-grid", "aria-label": "빠른 메뉴" }, [
    quickCard("🙌", "내 참여", `${joinedUpcoming.length}개 예정`, "#/mypage"),
    quickCard("🌿", "활동 찾기", `${events.length}개 모집`, "#/activities"),
    quickCard("📣", "새 공지", `${notices.count}개 게시`, "#/notice"),
    quickCard("💬", "이야기 나눔", "자유게시판", "#/community"),
  ]);

  const upcomingSection = el("section", { className: "page-stack", "aria-labelledby": "upcoming-title" }, [
    el("div", { className: "page-header" }, [
      el("div", {}, [
        el("p", { className: "eyebrow", text: "UPCOMING" }),
        el("h2", { id: "upcoming-title", className: "section-title", text: "다가오는 활동" }),
      ]),
      el("a", { className: "button button--ghost", href: "#/activities", text: "전체 보기" }),
    ]),
  ]);
  if (!events.length) {
    upcomingSection.append(emptyState("예정된 활동이 없어요", "새 활동이 등록되면 이곳에서 가장 먼저 알려드릴게요."));
  } else {
    const grid = el("div", { className: "activity-grid activity-grid--home" });
    events.slice(0, 4).forEach((event) => {
      grid.append(createActivityCard(event, {
        userId: auth.user.id,
        onJoin: (target, button) => handleParticipation(root, target, "join", button),
        onCancel: (target, _mine, button) => handleParticipation(root, target, "cancel", button),
      }));
    });
    upcomingSection.append(grid);
  }

  const lowerGrid = el("section", { className: "content-grid content-grid--2" });
  const noticeCard = el("div", { className: "card page-stack" }, [
    el("div", { className: "page-header" }, [
      el("h2", { className: "section-title", text: "📣 최근 공지" }),
      el("a", { href: "#/notice", className: "small", text: "더 보기 →" }),
    ]),
  ]);
  if (!notices.rows.length) {
    noticeCard.append(el("p", { className: "subtle", text: "등록된 공지가 없습니다." }));
  } else {
    notices.rows.forEach((post) => {
      noticeCard.append(el("a", { className: "post-row", href: `#/notice/${post.id}` }, [
        el("strong", { text: `${post.is_important ? "중요 · " : ""}${post.title}` }),
        el("span", { className: "small subtle", text: formatDate(post.created_at, { weekday: false }) }),
      ]));
    });
  }
  const myCard = el("div", { className: "card page-stack" }, [
    el("div", { className: "page-header" }, [
      el("h2", { className: "section-title", text: "🙌 내 다음 활동" }),
      el("a", { href: "#/mypage", className: "small", text: "내 정보 →" }),
    ]),
  ]);
  if (!joinedUpcoming.length) {
    myCard.append(
      el("p", { className: "subtle", text: "아직 예정된 참여 활동이 없어요." }),
      el("a", { className: "button button--secondary", href: "#/activities", text: "함께할 활동 찾기" }),
    );
  } else {
    joinedUpcoming.slice(0, 3).forEach((item) => {
      myCard.append(el("a", { className: "post-row", href: `#/activities/${item.event.id}` }, [
        el("strong", { text: item.event.title }),
        el("span", { className: "small subtle", text: `${formatDate(item.event.event_date)} · ${item.status === "joined" ? "참여 확정" : "대기 중"}` }),
      ]));
    });
  }
  lowerGrid.append(noticeCard, myCard);
  root.append(hero, quick, upcomingSection, lowerGrid);
  return root;
}

function quickCard(icon, title, detail, href) {
  return el("a", { className: "quick-card", href }, [
    el("span", { text: icon, "aria-hidden": "true" }),
    el("span", {}, [
      el("strong", { text: title }),
      el("span", { className: "small subtle", text: detail, style: { display: "block" } }),
    ]),
  ]);
}

async function handleParticipation(root, event, action, button) {
  const joining = action === "join";
  const confirmed = await confirmDialog({
    title: joining ? "이 활동에 참여할까요?" : "참여를 취소할까요?",
    message: joining
      ? `"${event.title}" 참여를 신청합니다. 정원이 찬 경우 대기자로 등록됩니다.`
      : `"${event.title}" 참여를 취소하면 대기자가 자동으로 참여 확정될 수 있습니다.`,
    confirmText: joining ? "참여 신청" : "참여 취소",
    danger: !joining,
  });
  if (!confirmed) return;
  setBusy(button, true, joining ? "신청 중…" : "취소 중…");
  try {
    const result = joining ? await joinEvent(event.id) : await cancelEventParticipation(event.id);
    showToast(
      joining
        ? result === "waitlisted" ? "대기 명단에 등록되었습니다." : "참여 신청이 완료되었습니다."
        : "참여를 취소했습니다.",
      "success",
    );
    const refreshed = await renderHome();
    root.replaceWith(refreshed);
  } catch (error) {
    showToast(getErrorMessage(error), "error");
    setBusy(button, false);
  }
}
