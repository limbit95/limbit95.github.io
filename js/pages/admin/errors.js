import { listClientErrorLogs } from "../../api/observability.js";
import { el, formatDateTime, getErrorMessage } from "../../ui.js";

const PAGE_SIZE = 50;
const KIND_LABELS = {
  runtime: "런타임",
  unhandled: "Promise",
  page: "화면",
  api: "API",
};

export async function renderErrors() {
  const wrapper = el("div", { className: "page-stack" });
  const period = el("select", { "aria-label": "오류 조회 기간" }, [
    el("option", { value: "24", text: "최근 24시간" }),
    el("option", { value: "168", text: "최근 7일", selected: true }),
    el("option", { value: "720", text: "최근 30일" }),
  ]);
  const countChip = el("span", { className: "chip", text: "0건" });
  const refreshButton = el("button", { className: "button button--ghost", type: "button", text: "새로고침" });
  const tableBody = el("tbody");
  const previousButton = el("button", { className: "button button--ghost", type: "button", text: "이전" });
  const nextButton = el("button", { className: "button button--ghost", type: "button", text: "다음" });
  const pageLabel = el("span", { className: "small subtle", text: "1 / 1" });
  const pagination = el("div", { className: "form-actions" }, [previousButton, pageLabel, nextButton]);

  const table = el("div", { className: "table-wrap" }, el("table", {}, [
    el("thead", {}, el("tr", {}, [
      el("th", { text: "시각" }),
      el("th", { text: "종류" }),
      el("th", { text: "회원" }),
      el("th", { text: "경로" }),
      el("th", { text: "오류" }),
      el("th", { text: "맥락" }),
    ])),
    tableBody,
  ]));

  const state = { hours: 168, page: 1, totalPages: 1 };
  let requestSequence = 0;

  const load = async () => {
    const sequence = ++requestSequence;
    tableBody.replaceChildren(el("tr", {}, el("td", {
      colspan: "6",
      text: "오류 로그를 불러오는 중입니다…",
    })));
    previousButton.disabled = true;
    nextButton.disabled = true;
    refreshButton.disabled = true;

    try {
      const offset = (state.page - 1) * PAGE_SIZE;
      const since = new Date(Date.now() - state.hours * 60 * 60 * 1000).toISOString();
      const result = await listClientErrorLogs({ limit: PAGE_SIZE, offset, since });
      if (sequence !== requestSequence) return;

      state.totalPages = Math.max(1, Math.ceil(result.count / PAGE_SIZE));
      if (result.count > 0 && state.page > state.totalPages) {
        state.page = state.totalPages;
        await load();
        return;
      }

      tableBody.replaceChildren();
      if (!result.rows.length) {
        tableBody.append(el("tr", {}, el("td", {
          colspan: "6",
          text: "선택한 기간에 기록된 클라이언트 오류가 없습니다.",
        })));
      } else {
        result.rows.forEach((row) => tableBody.append(errorRow(row)));
      }

      countChip.textContent = `${result.count}건`;
      pageLabel.textContent = `${state.page} / ${state.totalPages}`;
      previousButton.disabled = state.page <= 1;
      nextButton.disabled = state.page >= state.totalPages;
    } catch (error) {
      if (sequence !== requestSequence) return;
      tableBody.replaceChildren(el("tr", {}, el("td", {
        colspan: "6",
        text: getErrorMessage(error, "오류 로그를 불러오지 못했습니다."),
      })));
      countChip.textContent = "조회 실패";
      pageLabel.textContent = "-";
    } finally {
      if (sequence === requestSequence) refreshButton.disabled = false;
    }
  };

  period.addEventListener("change", () => {
    state.hours = Number(period.value) || 168;
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
          el("h2", { className: "section-title", text: "클라이언트 오류 로그" }),
          el("p", { className: "small subtle", text: "승인 회원의 화면·API·런타임 오류만 최소 정보로 기록되며 30일 뒤 자동 삭제됩니다." }),
        ]),
        countChip,
      ]),
      el("div", { className: "form-actions" }, [period, refreshButton]),
    ]),
    table,
    pagination,
  );

  await load();
  return wrapper;
}

function errorRow(row) {
  const contextEntries = Object.entries(row.context ?? {});
  const context = contextEntries.length
    ? el("details", {}, [
        el("summary", { text: "보기" }),
        el("code", {
          text: JSON.stringify(row.context, null, 2),
          style: { display: "block", whiteSpace: "pre-wrap", maxWidth: "24rem" },
        }),
      ])
    : el("span", { className: "small subtle", text: "-" });

  return el("tr", {}, [
    el("td", { text: formatDateTime(row.created_at) }),
    el("td", {}, el("span", { className: "status-badge", text: KIND_LABELS[row.error_kind] ?? row.error_kind })),
    el("td", { text: row.profile?.display_name ?? "회원" }),
    el("td", {}, el("code", { text: row.route || "/" })),
    el("td", { text: row.message }),
    el("td", {}, context),
  ]);
}
