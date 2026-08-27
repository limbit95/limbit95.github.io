import {
  listMembers,
  setMemberRole,
  setMemberStatus,
} from "../../api/admin.js";
import { getAuthState } from "../../auth.js";
import { confirmDialog } from "../../components/modal.js";
import { showToast } from "../../components/toast.js";
import { JOIN_REQUEST_STATUS_LABEL, PROFILE_STATUS_LABEL } from "../../constants.js";
import { el, formatDate, getErrorMessage } from "../../ui.js";

const PAGE_SIZE = 20;

export async function renderMembers() {
  const auth = getAuthState();
  const wrapper = el("div", { className: "page-stack" });
  const search = el("input", { type: "search", placeholder: "이름 또는 이메일 검색", "aria-label": "회원 검색" });
  const countChip = el("span", { className: "chip", text: "전체 0명" });
  const tableBody = el("tbody");
  const previousButton = el("button", { className: "button button--ghost", type: "button", text: "이전" });
  const nextButton = el("button", { className: "button button--ghost", type: "button", text: "다음" });
  const pageLabel = el("span", { className: "small subtle", text: "1 / 1" });
  const pagination = el("div", { className: "form-actions" }, [previousButton, pageLabel, nextButton]);
  const table = el("div", { className: "table-wrap" }, el("table", {}, [
    el("thead", {}, el("tr", {}, [
      el("th", { text: "회원" }),
      el("th", { text: "상태" }),
      el("th", { text: "권한" }),
      el("th", { text: "가입일" }),
      el("th", { text: "관리" }),
    ])),
    tableBody,
  ]));

  const state = {
    search: "",
    page: 1,
    totalPages: 1,
  };
  let requestSequence = 0;
  let searchTimer = null;

  const loadMembers = async () => {
    const sequence = ++requestSequence;
    tableBody.replaceChildren(el("tr", {}, el("td", {
      colspan: "5",
      text: "회원 목록을 불러오는 중입니다…",
    })));
    previousButton.disabled = true;
    nextButton.disabled = true;

    try {
      const result = await listMembers({
        search: state.search,
        page: state.page,
        pageSize: PAGE_SIZE,
      });
      if (sequence !== requestSequence) return;

      state.totalPages = result.totalPages;
      if (result.total > 0 && state.page > result.totalPages) {
        state.page = result.totalPages;
        await loadMembers();
        return;
      }

      tableBody.replaceChildren();
      if (!result.items.length) {
        tableBody.append(el("tr", {}, el("td", {
          colspan: "5",
          text: state.search ? "검색 결과가 없습니다." : "등록된 회원이 없습니다.",
        })));
      } else {
        result.items.forEach((member) => tableBody.append(memberRow(member, auth, loadMembers)));
      }

      countChip.textContent = state.search ? `검색 ${result.total}명` : `전체 ${result.total}명`;
      pageLabel.textContent = `${state.page} / ${result.totalPages}`;
      previousButton.disabled = state.page <= 1;
      nextButton.disabled = state.page >= result.totalPages;
    } catch (error) {
      if (sequence !== requestSequence) return;
      tableBody.replaceChildren(el("tr", {}, el("td", {
        colspan: "5",
        text: getErrorMessage(error, "회원 목록을 불러오지 못했습니다."),
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
      loadMembers();
    }, 250);
  });
  previousButton.addEventListener("click", () => {
    if (state.page <= 1) return;
    state.page -= 1;
    loadMembers();
  });
  nextButton.addEventListener("click", () => {
    if (state.page >= state.totalPages) return;
    state.page += 1;
    loadMembers();
  });

  wrapper.append(
    el("div", { className: "card search-bar" }, [search, countChip]),
    table,
    pagination,
  );
  await loadMembers();
  return wrapper;
}

function memberRow(member, auth, refresh) {
  const roleSelect = el("select", { "aria-label": `${member.display_name} 권한` }, [
    el("option", { value: "member", text: "일반 회원", selected: member.role === "member" }),
    el("option", { value: "admin", text: "관리자", selected: member.role === "admin" }),
  ]);
  if (member.status !== "approved") roleSelect.disabled = true;
  roleSelect.addEventListener("change", async () => {
    const nextRole = roleSelect.value;
    const confirmed = await confirmDialog({
      title: "회원 권한을 변경할까요?",
      message: `${member.display_name}님의 권한을 ${nextRole === "admin" ? "관리자" : "일반 회원"}로 변경합니다.`,
      confirmText: "권한 변경",
      danger: member.role === "admin" && nextRole === "member",
    });
    if (!confirmed) {
      roleSelect.value = member.role;
      return;
    }
    roleSelect.disabled = true;
    try {
      await setMemberRole(member.id, nextRole);
      member.role = nextRole;
      showToast("회원 권한을 변경했습니다.", "success");
    } catch (error) {
      roleSelect.value = member.role;
      showToast(getErrorMessage(error), "error");
    } finally {
      roleSelect.disabled = member.status !== "approved";
    }
  });
  const action = member.status === "approved"
    ? actionButton("이용 정지", "button button--ghost", () => changeMemberStatus(member, "suspended", refresh))
    : member.status === "suspended"
      ? actionButton("정지 해제", "button button--secondary", () => changeMemberStatus(member, "approved", refresh))
      : el("span", { className: "small subtle", text: "가입 신청에서 처리" });
  if (member.id === auth.user.id && "disabled" in action) action.disabled = true;
  return el("tr", {}, [
    el("td", {}, [
      el("strong", { text: member.display_name }),
      el("span", { className: "small subtle", text: member.join_request?.email ?? "", style: { display: "block" } }),
    ]),
    el("td", {}, requestBadge(member.status)),
    el("td", {}, roleSelect),
    el("td", { text: formatDate(member.created_at, { weekday: false }) }),
    el("td", {}, action),
  ]);
}

async function changeMemberStatus(member, status, refresh) {
  const suspend = status === "suspended";
  const confirmed = await confirmDialog({
    title: suspend ? "회원 이용을 정지할까요?" : "이용 정지를 해제할까요?",
    message: suspend
      ? `${member.display_name} 회원은 즉시 일반 서비스 데이터에 접근할 수 없게 됩니다.`
      : `${member.display_name} 회원이 서비스를 다시 이용할 수 있게 됩니다.`,
    confirmText: suspend ? "이용 정지" : "정지 해제",
    danger: suspend,
  });
  if (!confirmed) return;
  try {
    await setMemberStatus(member.id, status);
    member.status = status;
    showToast(suspend ? "회원 이용을 정지했습니다." : "이용 정지를 해제했습니다.", "success");
    await refresh();
  } catch (error) {
    showToast(getErrorMessage(error, "회원 상태 변경에 실패했습니다."), "error");
  }
}

function requestBadge(status) {
  const label = JOIN_REQUEST_STATUS_LABEL[status] ?? PROFILE_STATUS_LABEL[status] ?? status;
  const variant = ["rejected", "suspended"].includes(status)
    ? "status-badge--danger"
    : ["pending", "held"].includes(status)
      ? "status-badge--warning"
      : "";
  const icon = ["approved"].includes(status) ? "✓" : ["rejected", "suspended"].includes(status) ? "✕" : "●";
  return el("span", { className: `status-badge ${variant}`, text: `${icon} ${label}` });
}

function actionButton(text, className, handler) {
  return el("button", { className, type: "button", text, onClick: handler });
}
