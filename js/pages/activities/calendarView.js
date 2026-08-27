import { listEvents } from "../../api/activities.js";
import { el } from "../../ui.js";

export async function renderActivityCalendar(route, categoryId, search) {
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

function localDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
