import { canManageCategory, getAuthState } from "../auth.js";
import {
  cancelDatePoll,
  cancelEventParticipation,
  closeDatePoll,
  createDatePoll,
  joinEvent,
  listCategories,
  listDatePolls,
  listEvents,
  replaceDatePollVotes,
} from "../api.js";
import { createActivityCard } from "../components/activityCard.js";
import { confirmDialog } from "../components/modal.js";
import { showToast } from "../components/toast.js";
import { POLL_STATUS_LABEL } from "../constants.js";
import {
  debounce,
  el,
  emptyState,
  formatDate,
  formatDateTime,
  getErrorMessage,
  pageContainer,
  seoulDateString,
  setBusy,
} from "../ui.js";

export async function renderActivities(route) {
  const auth = getAuthState();
  const view = ["list", "calendar", "polls"].includes(route.query.get("view"))
    ? route.query.get("view")
    : "list";
  const categoryId = route.query.get("category") || "";
  const search = route.query.get("search") || "";
  const categories = await listCategories({ activeOnly: true });
  const root = pageContainer();
  const header = el("div", { className: "page-header" }, [
    el("div", {}, [
      el("p", { className: "eyebrow", text: "ACTIVITIES" }),
      el("h1", { className: "page-title", text: "같이 즐길 활동" }),
      el("p", { className: "page-description", text: "문화생활부터 야외 활동까지, 가볍게 참여해 보세요." }),
    ]),
    auth.isAdmin || auth.managerCategoryIds.size
      ? el("a", { className: "button button--coral", href: "#/activities/new", text: "＋ 활동 등록" })
      : null,
  ]);
  const tabs = el("div", { className: "tabs", role: "tablist", "aria-label": "활동 보기 방식" }, [
    tab("list", "☰ 목록", view, route.query),
    tab("calendar", "🗓️ 달력", view, route.query),
    tab("polls", "🗳️ 날짜 투표", view, route.query),
  ]);
  root.append(header, tabs);

  if (view === "polls") {
    root.append(await renderPollView(categories, categoryId, auth));
    return root;
  }

  const filter = createFilters(categories, categoryId, search, view);
  root.append(filter);
  if (view === "calendar") {
    root.append(await renderCalendar(route, categoryId, search));
  } else {
    root.append(await renderList(categoryId, search, auth));
  }
  return root;
}

function tab(value, label, current, query) {
  const params = new URLSearchParams(query);
  params.set("view", value);
  if (value !== "calendar") params.delete("month");
  return el("a", {
    className: "tab",
    role: "tab",
    href: `#/activities?${params.toString()}`,
    "aria-selected": String(value === current),
    text: label,
  });
}

function createFilters(categories, selectedCategory, search, view) {
  const form = el("form", { className: "card form-grid form-grid--2", role: "search" });
  const category = el("select", { id: "activity-category-filter", name: "category" }, [
    el("option", { value: "", text: "전체 카테고리" }),
    ...categories.map((item) => el("option", {
      value: item.id,
      text: `${item.icon} ${item.name}`,
      selected: String(item.id) === String(selectedCategory),
    })),
  ]);
  const keyword = el("input", {
    id: "activity-search",
    name: "search",
    type: "search",
    value: search,
    placeholder: "활동 이름 검색",
    "aria-label": "활동 이름 검색",
  });
  const apply = () => {
    const params = new URLSearchParams();
    params.set("view", view);
    if (category.value) params.set("category", category.value);
    if (keyword.value.trim()) params.set("search", keyword.value.trim());
    window.location.hash = `#/activities?${params.toString()}`;
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    apply();
  });
  category.addEventListener("change", apply);
  keyword.addEventListener("input", debounce(apply, 500));
  form.append(
    el("div", { className: "field" }, [
      el("label", { for: "activity-category-filter", text: "카테고리" }),
      category,
    ]),
    el("div", { className: "field" }, [
      el("label", { for: "activity-search", text: "검색" }),
      el("div", { className: "search-bar" }, [
        keyword,
        el("button", { className: "button", type: "submit", text: "검색" }),
      ]),
    ]),
  );
  return form;
}

async function renderList(categoryId, search, auth) {
  const today = seoulDateString();
  const events = await listEvents({ categoryId, search, fromDate: today });
  if (!events.length) {
    return emptyState(
      search ? "검색 결과가 없어요" : "예정된 활동이 없어요",
      search ? "다른 검색어나 카테고리를 선택해 보세요." : "새 활동이 등록되면 이곳에 표시됩니다.",
      search ? el("a", { className: "button button--secondary", href: "#/activities?view=list", text: "검색 초기화" }) : null,
    );
  }
  const grid = el("section", { className: "activity-grid", "aria-label": "활동 목록" });
  const refresh = async () => {
    const updated = await renderList(categoryId, search, auth);
    grid.replaceWith(updated);
  };
  events.forEach((event) => {
    grid.append(createActivityCard(event, {
      userId: auth.user.id,
      onJoin: (target, button) => participationAction(target, "join", refresh, button),
      onCancel: (target, _mine, button) => participationAction(target, "cancel", refresh, button),
    }));
  });
  return grid;
}

async function participationAction(event, action, refresh, button) {
  const joining = action === "join";
  const confirmed = await confirmDialog({
    title: joining ? "참여를 신청할까요?" : "참여를 취소할까요?",
    message: joining
      ? `"${event.title}" 활동에 참여합니다. 정원이 찬 경우 자동으로 대기 신청됩니다.`
      : `"${event.title}" 참여를 취소합니다.`,
    confirmText: joining ? "참여 신청" : "참여 취소",
    danger: !joining,
  });
  if (!confirmed) return;
  setBusy(button, true, joining ? "신청 중…" : "취소 중…");
  try {
    const result = joining ? await joinEvent(event.id) : await cancelEventParticipation(event.id);
    showToast(
      joining
        ? result === "waitlisted" ? "정원이 차서 대기자로 등록되었습니다." : "참여 신청이 완료되었습니다."
        : "참여를 취소했습니다.",
      "success",
    );
    await refresh();
  } catch (error) {
    showToast(getErrorMessage(error), "error");
    setBusy(button, false);
  }
}

async function renderCalendar(route, categoryId, search) {
  const requestedMonth = route.query.get("month");
  const base = requestedMonth && /^\d{4}-\d{2}$/.test(requestedMonth)
    ? new Date(`${requestedMonth}-01T00:00:00`)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const year = base.getFullYear();
  const month = base.getMonth();
  const gridStart = new Date(year, month, 1 - new Date(year, month, 1).getDay());
  const gridEnd = new Date(gridStart);
  gridEnd.setDate(gridStart.getDate() + 41);
  const events = await listEvents({
    categoryId,
    search,
    fromDate: localDateString(gridStart),
    toDate: localDateString(gridEnd),
    statuses: ["scheduled", "closed", "completed", "cancelled"],
  });
  const byDate = new Map();
  events.forEach((event) => {
    const items = byDate.get(event.event_date) ?? [];
    items.push(event);
    byDate.set(event.event_date, items);
  });
  const section = el("section", { className: "card page-stack", "aria-label": `${year}년 ${month + 1}월 활동 달력` });
  const prev = new Date(year, month - 1, 1);
  const next = new Date(year, month + 1, 1);
  const baseParams = new URLSearchParams(route.query);
  const monthHref = (date) => {
    const params = new URLSearchParams(baseParams);
    params.set("month", `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
    return `#/activities?${params.toString()}`;
  };
  section.append(el("div", { className: "calendar-toolbar" }, [
    el("a", { className: "button button--ghost", href: monthHref(prev), text: "← 이전 달", "aria-label": "이전 달" }),
    el("h2", { className: "section-title", text: `${year}년 ${month + 1}월` }),
    el("a", { className: "button button--ghost", href: monthHref(next), text: "다음 달 →", "aria-label": "다음 달" }),
  ]));
  const calendar = el("div", { className: "calendar-grid" });
  ["일", "월", "화", "수", "목", "금", "토"].forEach((day) => {
    calendar.append(el("div", { className: "calendar-weekday", text: day }));
  });
  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const dateKey = localDateString(date);
    const day = el("div", {
      className: `calendar-day ${date.getMonth() === month ? "" : "calendar-day--outside"}`,
    }, el("span", { className: "calendar-day__number", text: date.getDate() }));
    (byDate.get(dateKey) ?? []).slice(0, 3).forEach((event) => {
      day.append(el("a", {
        className: "calendar-event",
        href: `#/activities/${event.id}`,
        text: `${event.start_time.slice(0, 5)} ${event.title}`,
        title: event.title,
      }));
    });
    const overflow = (byDate.get(dateKey) ?? []).length - 3;
    if (overflow > 0) day.append(el("span", { className: "small subtle", text: `+${overflow}개` }));
    calendar.append(day);
  }
  section.append(calendar);
  if (!events.length) section.append(el("p", { className: "subtle", text: "이 달에는 등록된 활동이 없습니다." }));
  return section;
}

async function renderPollView(categories, selectedCategory, auth) {
  const wrapper = el("div", { className: "page-stack" });
  const availableForCreate = auth.isAdmin
    ? categories
    : categories.filter((category) => auth.managerCategoryIds.has(Number(category.id)));
  if (availableForCreate.length) wrapper.append(createPollForm(availableForCreate, auth));
  const polls = await listDatePolls({ categoryId: selectedCategory || null });
  if (!polls.length) {
    wrapper.append(emptyState("진행 중인 날짜 투표가 없어요", "담당자가 새 모임 날짜를 제안하면 여기에서 투표할 수 있어요."));
    return wrapper;
  }
  const list = el("section", { className: "poll-list", "aria-label": "날짜 투표 목록" });
  const refresh = async () => {
    const next = await renderPollView(categories, selectedCategory, auth);
    wrapper.replaceWith(next);
  };
  polls.forEach((poll) => list.append(createPollCard(poll, auth, refresh)));
  wrapper.append(list);
  return wrapper;
}

function createPollForm(categories, auth) {
  const details = el("details", { className: "card" });
  const summary = el("summary", { className: "section-title", text: "＋ 새 날짜 투표 만들기" });
  const form = el("form", { className: "form-grid", style: { marginTop: "1rem" } });
  const category = el("select", { name: "category_id", required: true }, categories.map((item) => el("option", { value: item.id, text: `${item.icon} ${item.name}` })));
  const optionsBox = el("div", { className: "form-grid", dataset: { pollOptions: "true" } });
  const addOption = () => {
    const index = optionsBox.children.length + 1;
    optionsBox.append(el("div", { className: "card card--flat form-grid form-grid--2" }, [
      el("div", { className: "field" }, [
        el("label", { text: `후보 ${index} 시작` }),
        el("input", { type: "datetime-local", name: "option_start", required: true }),
      ]),
      el("div", { className: "field" }, [
        el("label", { text: "후보 이름" }),
        el("input", { type: "text", name: "option_label", maxlength: "100", placeholder: "예: 토요일 오전" }),
      ]),
    ]));
  };
  addOption();
  addOption();
  form.append(
    el("div", { className: "form-grid form-grid--2" }, [
      labeled("카테고리", category),
      labeled("투표 마감", el("input", { type: "datetime-local", name: "closes_at", required: true })),
      labeled("제목", el("input", { type: "text", name: "title", maxlength: "150", required: true }), "field field--full"),
      labeled("설명", el("textarea", { name: "description", maxlength: "3000" }), "field field--full"),
    ]),
    el("label", { className: "checkbox" }, [
      el("input", { type: "checkbox", name: "allow_multiple", checked: true }),
      el("span", { text: "여러 후보 선택 허용" }),
    ]),
    el("h3", { className: "section-title", text: "날짜 후보" }),
    optionsBox,
    el("div", { className: "button-row" }, [
      el("button", {
        className: "button button--secondary",
        type: "button",
        text: "＋ 후보 추가",
        onClick: () => {
          if (optionsBox.children.length < 8) addOption();
          else showToast("날짜 후보는 최대 8개까지 등록할 수 있습니다.", "error");
        },
      }),
      el("button", { className: "button", type: "submit", text: "투표 등록" }),
    ]),
  );
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const starts = [...form.querySelectorAll('[name="option_start"]')].map((input) => input.value);
    const labels = [...form.querySelectorAll('[name="option_label"]')].map((input) => input.value.trim());
    if (starts.some((value) => !value) || new Set(starts).size !== starts.length) {
      showToast("서로 다른 날짜 후보를 2개 이상 입력해 주세요.", "error");
      return;
    }
    if (!canManageCategory(category.value)) {
      showToast("이 카테고리의 투표를 등록할 권한이 없습니다.", "error");
      return;
    }
    setBusy(form, true, "등록 중…");
    try {
      await createDatePoll({
        category_id: Number(category.value),
        title: form.title.value.trim(),
        description: form.description.value.trim(),
        allow_multiple: form.allow_multiple.checked,
        closes_at: seoulInputToIso(form.closes_at.value),
        status: "open",
        created_by: auth.user.id,
      }, starts.map((start, index) => ({
        option_start: seoulInputToIso(start),
        option_end: null,
        label: labels[index] || null,
      })));
      showToast("날짜 투표를 등록했습니다.", "success");
      window.location.reload();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setBusy(form, false);
    }
  });
  details.append(summary, form);
  return details;
}

function createPollCard(poll, auth, refresh) {
  const card = el("article", { className: "card page-stack" });
  const manageable = canManageCategory(poll.category_id);
  const selectedByMe = new Set((poll.options ?? [])
    .filter((option) => (option.votes ?? []).some((vote) => vote.user_id === auth.user.id))
    .map((option) => Number(option.id)));
  const totalVoters = new Set((poll.options ?? []).flatMap((option) => (option.votes ?? []).map((vote) => vote.user_id))).size;
  const optionList = el("div", { className: "form-grid" });
  const inputName = `poll-${poll.id}`;
  (poll.options ?? []).forEach((option) => {
    const votes = option.votes?.length ?? 0;
    const percent = totalVoters ? Math.round((votes / totalVoters) * 100) : 0;
    optionList.append(el("label", { className: "poll-option" }, [
      el("span", { className: poll.allow_multiple ? "checkbox" : "radio" }, [
        el("input", {
          type: poll.allow_multiple ? "checkbox" : "radio",
          name: inputName,
          value: option.id,
          checked: selectedByMe.has(Number(option.id)),
          disabled: poll.status !== "open" || new Date(poll.closes_at) < new Date(),
        }),
        el("span", {}, [
          el("strong", { text: option.label || formatDateTime(option.option_start) }),
          option.label ? el("span", { className: "small subtle", text: formatDateTime(option.option_start), style: { display: "block" } }) : null,
        ]),
      ]),
      el("div", { className: "poll-bar", "aria-hidden": "true" }, el("span", { style: { "--vote-value": `${percent}%` } })),
      el("span", { className: "small subtle", text: `${votes}표 · 참여자 기준 ${percent}%` }),
    ]));
  });
  const actions = el("div", { className: "button-row" });
  if (poll.status === "open" && new Date(poll.closes_at) >= new Date()) {
    actions.append(el("button", {
      className: "button button--yellow",
      type: "button",
      text: "투표 저장",
      onClick: async (event) => {
        const chosen = [...card.querySelectorAll(`input[name="${inputName}"]:checked`)].map((input) => Number(input.value));
        if (!chosen.length) {
          showToast("한 개 이상의 날짜 후보를 선택해 주세요.", "error");
          return;
        }
        setBusy(event.currentTarget, true, "저장 중…");
        try {
          await replaceDatePollVotes(poll, auth.user.id, chosen);
          showToast("투표를 저장했습니다.", "success");
          await refresh();
        } catch (error) {
          showToast(getErrorMessage(error), "error");
          setBusy(event.currentTarget, false);
        }
      },
    }));
  }
  if (manageable && poll.status === "open") {
    actions.append(
      el("button", {
        className: "button button--secondary",
        type: "button",
        text: "투표 마감",
        onClick: async () => {
          const selected = [...poll.options].sort((a, b) => (b.votes?.length ?? 0) - (a.votes?.length ?? 0))[0];
          if (!selected) return;
          const confirmed = await confirmDialog({
            title: "투표를 마감할까요?",
            message: `현재 최다 득표 후보인 "${selected.label || formatDateTime(selected.option_start)}"을 선택 결과로 저장합니다.`,
            confirmText: "마감",
          });
          if (!confirmed) return;
          try {
            await closeDatePoll(poll.id, selected.id);
            showToast("투표를 마감했습니다.", "success");
            await refresh();
          } catch (error) {
            showToast(getErrorMessage(error), "error");
          }
        },
      }),
      el("button", {
        className: "button button--ghost",
        type: "button",
        text: "투표 취소",
        onClick: async () => {
          const confirmed = await confirmDialog({
            title: "날짜 투표를 취소할까요?",
            message: "취소된 투표에는 더 이상 참여할 수 없습니다.",
            confirmText: "투표 취소",
            danger: true,
          });
          if (!confirmed) return;
          try {
            await cancelDatePoll(poll.id);
            showToast("투표를 취소했습니다.", "success");
            await refresh();
          } catch (error) {
            showToast(getErrorMessage(error), "error");
          }
        },
      }),
    );
  }
  card.append(
    el("div", { className: "page-header" }, [
      el("div", {}, [
        el("p", { className: "eyebrow", text: `${poll.category?.icon ?? "🗳️"} ${poll.category?.name ?? "날짜 투표"}` }),
        el("h2", { className: "section-title", text: poll.title }),
      ]),
      el("span", {
        className: `status-badge ${poll.status === "open" ? "" : "status-badge--muted"}`,
        text: `${poll.status === "open" ? "●" : "■"} ${POLL_STATUS_LABEL[poll.status] ?? poll.status}`,
      }),
    ]),
    poll.description ? el("p", { className: "prose", text: poll.description }) : null,
    el("p", { className: "small subtle", text: `마감 ${formatDateTime(poll.closes_at)} · 참여 ${totalVoters}명` }),
    optionList,
    actions,
  );
  return card;
}

function labeled(label, input, className = "field") {
  const id = `field-${crypto.randomUUID()}`;
  input.id = id;
  return el("div", { className }, [
    el("label", { for: id, text: label }),
    input,
  ]);
}

function localDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function seoulInputToIso(value) {
  if (!value) return null;
  return new Date(`${value}:00+09:00`).toISOString();
}
