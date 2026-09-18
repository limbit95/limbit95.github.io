import { listMemberAccess } from "../../api/admin.js";
import { PROFILE_STATUS_LABEL } from "../../constants.js";
import { el, getErrorMessage, relativeTime } from "../../ui.js";

const PAGE_SIZE = 30;

const RECENCY_OPTIONS = [
  ["all", "전체"],
  ["24h", "최근 24시간"],
  ["7d", "최근 7일"],
  ["30d", "최근 30일"],
  ["inactive_30d", "30일 이상 미접속"],
  ["never", "접속 기록 없음"],
];

export async function renderMemberAccess() {
  const wrapper = el("div", { className: "page-stack" });
  const search = el("input", {
    type: "search",
    placeholder: "이름 또는 이메일 검색",
    "aria-label": "회원 접속 검색",
  });
  const recency = el("select", { "aria-label": "최근 접속 기간" }, RECENCY_OPTIONS.map(([value, label]) => (
    el("option", { value, text: label })
  )));
  const countChip = el("span", { className: "chip", text: "전체 0명" });
  const tableBody = el("tbody");
  const previousButton = el("button", { className: "button button--ghost", type: "button", text: "이전" });
  const nextButton = el("button", { className: "button button--ghost", type: "button", text: "다음" });
  const pageLabel = el("span", { className: "small subtle", text: "1 / 1" });

  const state = {
    search: "",
    recency: "all",
    page: 1,
    totalPages: 1,
  };
  let requestSequence = 0;
  let searchTimer = null;

  const loadRows = async () => {
    const sequence = ++requestSequence;
    tableBody.replaceChildren(el("tr", {}, el("td", {
      colspan: "5",
      text: "접속 현황을 불러오는 중입니다…",
    })));
    previousButton.disabled = true;
    nextButton.disabled = true;

    try {
      const result = await listMemberAccess({
        search: state.search,
        recency: state.recency,
        page: state.page,
        pageSize: PAGE_SIZE,
      });
      if (sequence !== requestSequence) return;

      state.totalPages = result.totalPages;
      if (result.total > 0 && state.page > result.totalPages) {
        state.page = result.totalPages;
        await loadRows();
        return;
      }

      tableBody.replaceChildren();
      if (!result.items.length) {
        tableBody.append(el("tr", {}, el("td", {
          colspan: "5",
          text: state.search || state.recency !== "all" ? "조건에 맞는 회원이 없습니다." : "등록된 회원이 없습니다.",
        })));
      } else {
        result.items.forEach((member) => tableBody.append(accessRow(member)));
      }

      countChip.textContent = `조회 ${result.total}명`;
      pageLabel.textContent = `${state.page} / ${result.totalPages}`;
      previousButton.disabled = state.page <= 1;
      nextButton.disabled = state.page >= result.totalPages;
    } catch (error) {
      if (sequence !== requestSequence) return;
      tableBody.replaceChildren(el("tr", {}, el("td", {
        colspan: "5",
        text: getErrorMessage(error, "접속 현황을 불러오지 못했습니다."),
      })));
      countChip.textContent = "조회 실패";
      pageLabel.textContent = "-";
    }
  };

  search.addEventListener("input", () => {
    if (searchTimer) window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.search = search.value.trim();
      state.page = 1;
      void loadRows();
    }, 250);
  });
  recency.addEventListener("change", () => {
    state.recency = recency.value;
    state.page = 1;
    void loadRows();
  });
  previousButton.addEventListener("click", () => {
    if (state.page <= 1) return;
    state.page -= 1;
    void loadRows();
  });
  nextButton.addEventListener("click", () => {
    if (state.page >= state.totalPages) return;
    state.page += 1;
    void loadRows();
  });

  wrapper.append(
    el("div", { className: "notice-box" }, [
      el("strong", { text: "회원별 마지막 접속 시각과 위치만 저장합니다." }),
      el("p", { className: "small subtle", text: "사이트 접근 시 최신 값으로 덮어쓰며 과거 접속 이력은 보관하지 않습니다. 검색어 등 URL 쿼리 값은 접속 위치에 저장하지 않습니다." }),
    ]),
    el("div", { className: "card search-bar" }, [search, recency, countChip]),
    el("div", { className: "table-wrap" }, el("table", {}, [
      el("thead", {}, el("tr", {}, [
        el("th", { text: "회원" }),
        el("th", { text: "상태" }),
        el("th", { text: "권한" }),
        el("th", { text: "마지막 접속" }),
        el("th", { text: "마지막 접속 위치" }),
      ])),
      tableBody,
    ])),
    el("div", { className: "form-actions" }, [previousButton, pageLabel, nextButton]),
  );

  await loadRows();
  return wrapper;
}

function accessRow(member) {
  return el("tr", {}, [
    el("td", {}, [
      el("strong", { text: member.display_name }),
      member.real_name && member.real_name !== member.display_name
        ? el("span", { className: "small subtle", text: member.real_name, style: { display: "block" } })
        : null,
      el("span", { className: "small subtle", text: member.email ?? "", style: { display: "block" } }),
    ]),
    el("td", { text: PROFILE_STATUS_LABEL[member.status] ?? member.status }),
    el("td", { text: roleLabel(member.role) }),
    el("td", {}, member.last_accessed_at ? [
      el("strong", { text: formatSeoulDateTime(member.last_accessed_at) }),
      el("span", { className: "small subtle", text: relativeTime(member.last_accessed_at), style: { display: "block" } }),
    ] : el("span", { className: "small subtle", text: "접속 기록 없음" })),
    el("td", {
      className: "small",
      text: member.last_accessed_path || (member.last_accessed_at ? "위치 기록 없음" : "-"),
      style: { wordBreak: "break-all" },
    }),
  ]);
}

function roleLabel(role) {
  return {
    member: "일반 회원",
    admin: "관리자",
    system_admin: "최고 관리자",
  }[role] ?? role;
}

function formatSeoulDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`;
}
