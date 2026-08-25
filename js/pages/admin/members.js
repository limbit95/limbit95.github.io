import { listMembers, setMemberRole, setMemberStatus } from "../../api.js";
import { getAuthState } from "../../auth.js";
import { confirmDialog } from "../../components/modal.js";
import { showToast } from "../../components/toast.js";
import { JOIN_REQUEST_STATUS_LABEL, PROFILE_STATUS_LABEL } from "../../constants.js";
import { el, formatDate, getErrorMessage } from "../../ui.js";

export async function renderMembers() {
  const auth = getAuthState();
  const rows = await listMembers();
  const wrapper = el("div", { className: "page-stack" });
  const search = el("input", { type: "search", placeholder: "이름 또는 이메일 검색", "aria-label": "회원 검색" });
  const tableBody = el("tbody");
  const renderRows = () => {
    const keyword = search.value.trim().toLowerCase();
    const filtered = rows.filter((member) => [
      member.display_name,
      member.join_request?.real_name,
      member.join_request?.email,
    ].some((value) => value?.toLowerCase().includes(keyword)));
    tableBody.replaceChildren();
    if (!filtered.length) {
      tableBody.append(el("tr", {}, el("td", { colspan: "5", text: "검색 결과가 없습니다." })));
      return;
    }
    filtered.forEach((member) => tableBody.append(memberRow(member, auth)));
  };
  search.addEventListener("input", renderRows);
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
  renderRows();
  wrapper.append(el("div", { className: "card search-bar" }, [
    search,
    el("span", { className: "chip", text: `전체 ${rows.length}명` }),
  ]), table);
  return wrapper;
}

function memberRow(member, auth) {
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
      roleSelect.disabled = false;
    }
  });
  const action = member.status === "approved"
    ? actionButton("이용 정지", "button button--ghost", () => changeMemberStatus(member, "suspended"))
    : member.status === "suspended"
      ? actionButton("정지 해제", "button button--secondary", () => changeMemberStatus(member, "approved"))
      : el("span", { className: "small subtle", text: "가입 신청에서 처리" });
  if (member.id === auth.user.id) action.disabled = true;
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

async function changeMemberStatus(member, status) {
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
    showToast(suspend ? "회원 이용을 정지했습니다." : "이용 정지를 해제했습니다.", "success");
    window.location.reload();
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
