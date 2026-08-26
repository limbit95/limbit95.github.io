import { getAuthState } from "../auth.js";
import {
  cancelEventParticipation,
  getMyParticipationOverview,
  joinEvent,
  listEvents,
} from "../api/activities.js";
import { listPosts } from "../api/boards.js";
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

const DAILY_VERSES = Object.freeze([
  ["gn", "창세기", 12, 2],
  ["dt", "신명기", 31, 8],
  ["js", "여호수아", 1, 9],
  ["1sm", "사무엘상", 16, 7],
  ["ps", "시편", 23, 1],
  ["ps", "시편", 27, 1],
  ["ps", "시편", 37, 5],
  ["ps", "시편", 46, 1],
  ["ps", "시편", 55, 22],
  ["ps", "시편", 56, 3],
  ["ps", "시편", 62, 1],
  ["ps", "시편", 84, 11],
  ["ps", "시편", 119, 105],
  ["ps", "시편", 121, 2],
  ["prv", "잠언", 3, 5],
  ["prv", "잠언", 4, 23],
  ["prv", "잠언", 16, 3],
  ["prv", "잠언", 17, 22],
  ["is", "이사야", 40, 31],
  ["is", "이사야", 41, 10],
  ["is", "이사야", 43, 2],
  ["is", "이사야", 43, 19],
  ["jr", "예레미야", 29, 11],
  ["lm", "예레미야애가", 3, 23],
  ["mi", "미가", 6, 8],
  ["mt", "마태복음", 5, 14],
  ["mt", "마태복음", 6, 33],
  ["mt", "마태복음", 11, 28],
  ["mt", "마태복음", 28, 20],
  ["jo", "요한복음", 8, 12],
  ["jo", "요한복음", 13, 34],
  ["jo", "요한복음", 14, 6],
  ["jo", "요한복음", 14, 27],
  ["jo", "요한복음", 15, 5],
  ["jo", "요한복음", 16, 33],
  ["rm", "로마서", 5, 8],
  ["rm", "로마서", 8, 28],
  ["rm", "로마서", 12, 12],
  ["rm", "로마서", 15, 13],
  ["1co", "고린도전서", 10, 31],
  ["1co", "고린도전서", 13, 13],
  ["1co", "고린도전서", 16, 14],
  ["2co", "고린도후서", 5, 17],
  ["2co", "고린도후서", 12, 9],
  ["gl", "갈라디아서", 2, 20],
  ["eph", "에베소서", 2, 10],
  ["eph", "에베소서", 3, 20],
  ["eph", "에베소서", 4, 2],
  ["ph", "빌립보서", 4, 4],
  ["ph", "빌립보서", 4, 13],
  ["ph", "빌립보서", 4, 19],
  ["cl", "골로새서", 3, 12],
  ["cl", "골로새서", 3, 23],
  ["1ts", "데살로니가전서", 5, 16],
  ["2tm", "디모데후서", 1, 7],
  ["hb", "히브리서", 11, 1],
  ["jm", "야고보서", 1, 5],
  ["jm", "야고보서", 1, 22],
  ["1pe", "베드로전서", 5, 7],
  ["1jo", "요한일서", 4, 19],
  ["re", "요한계시록", 21, 4],
]);

export async function renderHome() {
  const auth = getAuthState();
  const today = seoulDateString();
  const dailyVersePromise = fetchDailyVerse(today).catch(() => null);
  const [events, notices, participationOverview] = await Promise.all([
    listEvents({ fromDate: today, limit: 8 }),
    listPosts({ boardType: "notice", pageSize: 4 }),
    getMyParticipationOverview({
      upcomingLimit: 20,
      historyLimit: 1,
      historyOffset: 0,
    }),
  ]);

  const root = pageContainer();
  const dailyVerseCard = createDailyVerseLoadingCard();
  const heroActions = el("div", { className: "hero-actions" }, [
    el("a", { className: "button button--yellow", href: "#/activities", text: "🗓️ 이번 활동 보기" }),
    el("a", { className: "button button--coral", href: "#/games", text: "🎮 게임" }),
    auth.isAdmin || auth.managerCategoryIds.size
      ? el("a", { className: "button button--coral", href: "#/activities/new", text: "＋ 활동 등록" })
      : el("a", { className: "button button--secondary", href: "#/mypage", text: "🙂 내 참여 보기" }),
  ]);
  const hero = el("section", { className: "hero" }, [
    el("div", { className: "hero__main" }, [
      el("p", { className: "eyebrow", text: "TOGETHER, EVERY DAY" }),
      el("h1", { text: `${auth.profile.display_name}님,\n오늘도 같이해요!` }),
      el("p", { className: "hero__description", text: "가볍게 만나고, 즐겁게 움직이며, 따뜻하게 연결되는 청년 공동체입니다." }),
      heroActions,
    ]),
    dailyVerseCard,
  ]);

  const joinedUpcoming = participationOverview.upcoming ?? [];
  const quick = el("section", { className: "quick-grid", "aria-label": "빠른 메뉴" }, [
    quickCard("🙌", "내 참여", `${joinedUpcoming.length}개 예정`, "#/mypage"),
    quickCard("🌿", "활동 찾기", `${events.length}개 모집`, "#/activities"),
    quickCard("📣", "새 공지", `${notices.count}개 게시`, "#/notice"),
    quickCard("🙏", "기도 제목", "서로를 위해 함께 기도해요", "#/prayer"),
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

  dailyVersePromise.then((verse) => {
    if (dailyVerseCard.parentNode) dailyVerseCard.replaceWith(createDailyVerseCard(verse));
  });

  return root;
}

function createDailyVerseLoadingCard() {
  return el("aside", { className: "daily-verse", "aria-label": "오늘의 말씀", "aria-busy": "true" }, [
    el("p", { className: "daily-verse__label", text: "오늘의 말씀" }),
    el("p", { className: "daily-verse__fallback", text: "말씀을 불러오는 중…" }),
  ]);
}

function createDailyVerseCard(verse) {
  if (!verse) {
    return el("aside", { className: "daily-verse", "aria-label": "오늘의 말씀" }, [
      el("p", { className: "daily-verse__label", text: "오늘의 말씀" }),
      el("p", { className: "daily-verse__fallback", text: "말씀을 불러오지 못했어요. 인터넷 연결 후 다시 확인해 주세요." }),
    ]);
  }
  return el("aside", { className: "daily-verse", "aria-label": "오늘의 말씀" }, [
    el("div", { className: "daily-verse__top" }, [
      el("p", { className: "daily-verse__label", text: "오늘의 말씀" }),
      el("span", { className: "daily-verse__mark", text: "✦", "aria-hidden": "true" }),
    ]),
    el("p", { className: "daily-verse__text", text: `“${verse.text}”` }),
    el("div", { className: "daily-verse__footer" }, [
      el("strong", { className: "daily-verse__reference", text: verse.reference }),
      el("span", { className: "daily-verse__source", text: "온라인 성경 · Korean Version" }),
    ]),
  ]);
}

async function fetchDailyVerse(dateKey) {
  const [bookId, bookName, chapter, verse] = DAILY_VERSES[dailyVerseIndex(dateKey)];
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 5000);
  try {
    const url = `https://raw.githubusercontent.com/MaatheusGois/bible/main/versions/ko/ko/${bookId}/${chapter}/${verse}.json`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Bible verse request failed: ${response.status}`);
    const payload = await response.json();
    const text = typeof payload === "string" ? payload.trim() : String(payload?.text ?? "").trim();
    if (!text) throw new Error("Bible verse response was empty");
    return {
      text,
      reference: `${bookName} ${chapter}:${verse}`,
    };
  } finally {
    window.clearTimeout(timer);
  }
}

function dailyVerseIndex(dateKey) {
  let hash = 2166136261;
  for (let index = 0; index < dateKey.length; index += 1) {
    hash ^= dateKey.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % DAILY_VERSES.length;
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