import { getAuthState } from "../auth.js";
import { listPosts } from "../api.js";
import { PAGE_SIZE } from "../constants.js";
import { el, emptyState, formatDate, pageContainer } from "../ui.js";

export async function renderBoard(route, boardType) {
  const auth = getAuthState();
  const isNotice = boardType === "notice";
  const page = Math.max(1, Number(route.query.get("page") || 1));
  const search = route.query.get("search") || "";
  const { rows, count } = await listPosts({ boardType, search, page, pageSize: PAGE_SIZE });
  const root = pageContainer();
  const header = el("div", { className: "page-header" }, [
    el("div", {}, [
      el("p", { className: "eyebrow", text: isNotice ? "NOTICE" : "COMMUNITY" }),
      el("h1", { className: "page-title", text: isNotice ? "공지사항" : "자유게시판" }),
      el("p", { className: "page-description", text: isNotice ? "공동체의 중요한 소식을 확인하세요." : "소소한 이야기와 유용한 정보를 나눠요." }),
    ]),
    (isNotice ? auth.isAdmin : true)
      ? el("a", { className: "button button--coral", href: `#/${isNotice ? "notice" : "community"}/new`, text: isNotice ? "＋ 공지 작성" : "＋ 글쓰기" })
      : null,
  ]);
  const searchForm = el("form", { className: "card search-bar", role: "search" }, [
    el("input", {
      type: "search",
      name: "search",
      value: search,
      placeholder: "제목으로 검색",
      "aria-label": `${isNotice ? "공지사항" : "자유게시판"} 제목 검색`,
    }),
    el("button", { className: "button", type: "submit", text: "검색" }),
  ]);
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchForm.search.value.trim()) params.set("search", searchForm.search.value.trim());
    window.location.hash = `#/${isNotice ? "notice" : "community"}?${params.toString()}`;
  });
  root.append(header, searchForm);

  if (!rows.length) {
    root.append(emptyState(
      search ? "검색 결과가 없어요" : isNotice ? "등록된 공지가 없어요" : "아직 게시글이 없어요",
      search ? "다른 검색어를 입력해 보세요." : isNotice ? "새 공지가 등록되면 이곳에 표시됩니다." : "첫 번째 이야기를 남겨 보세요.",
      search
        ? el("a", { className: "button button--secondary", href: `#/${isNotice ? "notice" : "community"}`, text: "검색 초기화" })
        : !isNotice
          ? el("a", { className: "button", href: "#/community/new", text: "첫 글 작성" })
          : null,
    ));
    return root;
  }
  const list = el("section", { className: "post-list", "aria-label": `${isNotice ? "공지사항" : "자유게시판"} 목록` });
  rows.forEach((post) => {
    const badges = el("div", { className: "chip-list" }, [
      post.is_pinned ? el("span", { className: "status-badge", text: "📌 상단 고정" }) : null,
      post.is_important ? el("span", { className: "status-badge status-badge--danger", text: "❗ 중요" }) : null,
    ]);
    list.append(el("a", {
      className: "post-row",
      href: `#/${isNotice ? "notice" : "community"}/${post.id}`,
    }, [
      badges.children.length ? badges : null,
      el("h2", { className: "section-title", text: post.title }),
      el("div", { className: "post-row__meta" }, [
        el("span", { text: post.author?.display_name ?? (isNotice ? "관리자" : "회원") }),
        el("span", { text: formatDate(post.created_at, { weekday: false }) }),
        el("span", { text: `조회 ${post.view_count}` }),
      ]),
    ]));
  });
  root.append(list);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  if (totalPages > 1) root.append(pagination(page, totalPages, search, isNotice ? "notice" : "community"));
  return root;
}

function pagination(current, total, search, base) {
  const nav = el("nav", { className: "pagination", "aria-label": "페이지 이동" });
  const href = (page) => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    return `#/${base}?${params.toString()}`;
  };
  nav.append(el("a", {
    className: "button button--ghost",
    href: href(Math.max(1, current - 1)),
    text: "←",
    "aria-label": "이전 페이지",
    ...(current === 1 ? { "aria-disabled": "true", tabindex: "-1" } : {}),
  }));
  const start = Math.max(1, current - 2);
  const end = Math.min(total, start + 4);
  for (let page = start; page <= end; page += 1) {
    nav.append(el("a", {
      className: `button ${page === current ? "" : "button--ghost"}`,
      href: href(page),
      text: page,
      "aria-label": `${page}페이지`,
      ...(page === current ? { "aria-current": "page" } : {}),
    }));
  }
  nav.append(el("a", {
    className: "button button--ghost",
    href: href(Math.min(total, current + 1)),
    text: "→",
    "aria-label": "다음 페이지",
    ...(current === total ? { "aria-disabled": "true", tabindex: "-1" } : {}),
  }));
  return nav;
}
