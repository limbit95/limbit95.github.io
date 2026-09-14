import { listEventOrganizerHistory } from "../../api/admin.js";
import { el, formatDateTime, getErrorMessage } from "../../ui.js";

const PAGE_SIZE = 30;

export async function renderOrganizerHistory() {
  const wrapper = el("div", { className: "page-stack" });
  const searchInput = el("input", {
    type: "search",
    placeholder: "활동명·주최자·변경자 검색",
    "aria-label": "주최자 변경 이력 검색",
  });
  const typeSelect = el("select", { "aria-label": "주최자 이력 유형" }, [
    el("option", { value: "", text: "전체 이력" }),
    el("option", { value: "transfer", text: "주최자 변경" }),
    el("option", { value: "initial", text: "최초 지정" }),
  ]);
  const searchButton = el("button", { className: "button", type: "submit", text: "조회" });
  const refreshButton = el("button", { className: "button button--ghost", type: "button", text: "새로고침" });
  const countChip = el("span", { className: "chip", text: "0건" });
  const tableBody = el("tbody");
  const previousButton = el("button", { className: "button button--ghost", type: "button", text: "이전" });
  const nextButton = el("button", { className: "button button--ghost", type: "button", text: "다음" });
  const pageLabel = el("span", { className: "small subtle", text: "1 / 1" });
  const pagination = el("div", { className: "form-actions" }, [previousButton, pageLabel, nextButton]);
  const filterForm = el("form", { className: "form-actions" }, [
    searchInput,
    typeSelect,
    searchButton,
    refreshButton,
  ]);

  const table = el("div", { className: "table-wrap" }, el("table", {}, [
    el("thead", {}, el("tr", {}, [
      el("th", { text: "변경 시각" }),
      el("th", { text: "활동" }),
      el("th", { text: "구분" }),
      el("th", { text: "이전 주최자" }),
      el("th", { text: "새 주최자" }),
      el("th", { text: "변경 실행자" }),
      el("th", { text: "이전 주최자 참여" }),
    ])),
    tableBody,
  ]));

  const state = {
    search: "",
    changeType: "",
    page: 1,
    totalPages: 1,
  };
  let requestSequence = 0;

  const load = async () => {
    const sequence = ++requestSequence;
    tableBody.replaceChildren(el("tr", {}, el("td", {
      colspan: "7",
      text: "주최자 이력을 불러오는 중입니다…",
    })));
    previousButton.disabled = true;
    nextButton.disabled = true;
    searchButton.disabled = true;
    refreshButton.disabled = true;

    try {
      const result = await listEventOrganizerHistory({
        search: state.search,
        changeType: state.changeType,
        page: state.page,
        pageSize: PAGE_SIZE,
      });
      if (sequence !== requestSequence) return;

      state.totalPages = result.totalPages;
      if (result.total > 0 && state.page > state.totalPages) {
        state.page = state.totalPages;
        await load();
        return;
      }

      tableBody.replaceChildren();
      if (!result.items.length) {
        tableBody.append(el("tr", {}, el("td", {
          colspan: "7",
          text: "조건에 맞는 주최자 변경 이력이 없습니다.",
        })));
      } else {
        result.items.forEach((row) => tableBody.append(historyRow(row)));
      }

      countChip.textContent = `${result.total}건`;
      pageLabel.textContent = `${state.page} / ${state.totalPages}`;
      previousButton.disabled = state.page <= 1;
      nextButton.disabled = state.page >= state.totalPages;
    } catch (error) {
      if (sequence !== requestSequence) return;
      tableBody.replaceChildren(el("tr", {}, el("td", {
        colspan: "7",
        text: getErrorMessage(error, "주최자 변경 이력을 불러오지 못했습니다."),
      })));
      countChip.textContent = "조회 실패";
      pageLabel.textContent = "-";
    } finally {
      if (sequence === requestSequence) {
        searchButton.disabled = false;
        refreshButton.disabled = false;
      }
    }
  };

  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.search = searchInput.value.trim();
    state.changeType = typeSelect.value;
    state.page = 1;
    void load();
  });
  refreshButton.addEventListener("click", () => void load());
  previousButton.addEventListener("click", () => {
    if (state.page <= 1) return;
    state.page -= 1;
    void load();
  });
  nextButton.addEventListener("click", () => {
    if (state.page >= state.totalPages) return;
    state.page += 1;
    void load();
  });

  wrapper.append(
    el("section", { className: "card page-stack" }, [
      el("div", { className: "row between" }, [
        el("div", {}, [
          el("h2", { className: "section-title", text: "활동 주최자 이력" }),
          el("p", {
            className: "small subtle",
            text: "최초 주최자 지정부터 이후 주최자 변경까지 시간순으로 보존된 기록을 조회합니다. 삭제된 활동의 이력도 활동명과 함께 유지됩니다.",
          }),
        ]),
        countChip,
      ]),
      filterForm,
    ]),
    table,
    pagination,
  );

  await load();
  return wrapper;
}

function historyRow(row) {
  const activity = row.event_id
    ? el("a", { href: `#/activities/${row.event_id}`, text: row.event_title })
    : el("span", {}, [
        el("span", { text: row.event_title }),
        el("span", { className: "small subtle", text: " · 삭제된 활동" }),
      ]);
  const isInitial = row.change_type === "initial";
  return el("tr", {}, [
    el("td", { text: formatDateTime(row.changed_at) }),
    el("td", {}, activity),
    el("td", {}, el("span", {
      className: "status-badge",
      text: isInitial ? "최초 지정" : "주최자 변경",
    })),
    el("td", { text: isInitial ? "-" : row.previous_organizer_name || "알 수 없음" }),
    el("td", { text: row.organizer_name || "알 수 없음" }),
    el("td", { text: row.changed_by_name || "시스템" }),
    el("td", {
      text: isInitial ? "-" : row.previous_organizer_left ? "참여 취소" : "계속 참여",
    }),
  ]);
}
