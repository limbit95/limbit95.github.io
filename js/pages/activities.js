import { getAuthState } from "../auth.js";
import { listCategories } from "../api.js";
import { debounce, el, pageContainer } from "../ui.js";
import { renderActivityCalendar } from "./activities/calendarView.js";
import { renderActivityList } from "./activities/listView.js";
import { renderPollView } from "./activities/pollView.js";

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
    root.append(await renderActivityCalendar(route, categoryId, search));
  } else {
    root.append(await renderActivityList(categoryId, search, auth));
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
