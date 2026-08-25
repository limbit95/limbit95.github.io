import { approveJoinRequest, listJoinRequests, reviewJoinRequest } from "../../api.js";
import { confirmDialog } from "../../components/modal.js";
import { showToast } from "../../components/toast.js";
import { JOIN_REQUEST_STATUS_LABEL, PROFILE_STATUS_LABEL } from "../../constants.js";
import { el, formatDateTime, getErrorMessage } from "../../ui.js";

export async function renderApprovals(route) {
  const status = ["pending", "held", "rejected", "approved", "all"].includes(route.query.get("status"))
    ? route.query.get("status")
    : "pending";
  const rows = await listJoinRequests(status);
  const wrapper = el("div", { className: "page-stack" });
  wrapper.append(el("div", { className: "tabs", role: "tablist", "aria-label": "가입 신청 상태 필터" }, [
    approvalTab("pending", "승인 대기", status),
    approvalTab("held", "보류", status),
    approvalTab("rejected", "거절", status),
    approvalTab("approved", "승인 완료", status),
    approvalTab("all", "전체", status),
  ]));
  if (!rows.length) {
    wrapper.append(el("div", { className: "state-box" }, [
      el("h2", { className: "section-title", text: "해당 상태의 가입 신청이 없습니다." }),
      el("p", { className: "subtle", text: "새 신청이 접수되면 이곳에 표시됩니다." }),
    ]));
    return wrapper;
  }
  rows.forEach((request) => {
    const note = el("textarea", {
      "aria-label": `${request.real_name} 관리자 안내`,
      maxlength: "1000",
      placeholder: "신청자에게 전달할 안내나 내부 확인 내용을 입력하세요.",
      text: request.admin_note ?? "",
      style: { minHeight: "90px" },
    });
    const card = el("article", { className: "card page-stack" }, [
      el("div", { className: "page-header" }, [
        el("div", {}, [
          el("h2", { className: "section-title", text: request.real_name }),
          el("p", { className: "small subtle", text: `${request.email} · ${request.church_group}` }),
        ]),
        requestBadge(request.status),
      ]),
      el("div", { className: "notice-box", text: request.request_message }),
      el("dl", { className: "meta-list small" }, [
        keyValue("표시 이름", request.profile?.display_name ?? "-"),
        keyValue("신청일", formatDateTime(request.requested_at)),
        keyValue("개인정보 동의", `${formatDateTime(request.privacy_consent_at)} · ${request.privacy_policy_version}`),
      ]),
      ["pending", "held"].includes(request.status)
        ? el("div", { className: "field" }, [
            el("label", { text: "관리자 안내" }),
            note,
          ])
        : request.admin_note
          ? el("div", { className: "notice-box notice-box--warning", text: `처리 메모: ${request.admin_note}` })
          : null,
    ]);
    if (["pending", "held"].includes(request.status)) {
      const actions = el("div", { className: "button-row" }, [
        actionButton("승인", "button", () => processRequest(card, request, "approve", note.value)),
        actionButton("보류", "button button--secondary", () => processRequest(card, request, "held", note.value)),
        actionButton("거절", "button button--ghost", () => processRequest(card, request, "rejected", note.value)),
      ]);
      card.append(actions);
    }
    wrapper.append(card);
  });
  return wrapper;
}

async function processRequest(card, request, decision, note) {
  const labels = { approve: "승인", held: "보류", rejected: "거절" };
  const confirmed = await confirmDialog({
    title: `가입 신청을 ${labels[decision]}할까요?`,
    message: decision === "approve"
      ? `${request.real_name} 회원이 즉시 일반 서비스 데이터를 이용할 수 있게 됩니다.`
      : `${request.real_name} 회원의 신청을 ${labels[decision]} 상태로 변경합니다.`,
    confirmText: labels[decision],
    danger: decision === "rejected",
  });
  if (!confirmed) return;
  card.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  try {
    if (decision === "approve") await approveJoinRequest(request.user_id, note.trim() || null);
    else await reviewJoinRequest(request.user_id, decision, note.trim() || null);
    showToast(`가입 신청을 ${labels[decision]} 처리했습니다.`, "success");
    card.replaceWith(el("div", { className: "notice-box", text: `${request.real_name}님의 신청을 ${labels[decision]} 처리했습니다.` }));
  } catch (error) {
    showToast(getErrorMessage(error, "가입 신청 처리에 실패했습니다."), "error");
    card.querySelectorAll("button").forEach((button) => { button.disabled = false; });
  }
}

function approvalTab(value, label, current) {
  return el("a", {
    className: "tab",
    role: "tab",
    href: `#/admin/approvals?status=${value}`,
    "aria-selected": String(value === current),
    text: label,
  });
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

function keyValue(key, value) {
  return el("div", { className: "meta-item" }, [
    el("dt", { text: key, style: { fontWeight: "800", minWidth: "7rem" } }),
    el("dd", { text: value }),
  ]);
}

function actionButton(text, className, handler) {
  return el("button", { className, type: "button", text, onClick: handler });
}
