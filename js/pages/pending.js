import { getAuthState, signOut } from "../auth.js";
import { getMyJoinRequest } from "../api/admin.js";
import { JOIN_REQUEST_STATUS_LABEL } from "../constants.js";
import { el, formatDateTime, getErrorMessage, loadingState } from "../ui.js";
import { showToast } from "../components/toast.js";

export async function renderPending() {
  const auth = getAuthState();
  const main = el("main", { id: "main-content", className: "auth-layout" }, loadingState("가입 상태 확인 중…"));
  try {
    const request = await getMyJoinRequest(auth.user.id);
    const isRejected = auth.profile?.status === "rejected" || request.status === "rejected";
    const isHeld = request.status === "held";
    const icon = isRejected ? "✉️" : isHeld ? "⏸️" : "⏳";
    const title = isRejected ? "가입 신청이 승인되지 않았어요" : isHeld ? "가입 신청을 확인하고 있어요" : "가입 승인을 기다리고 있어요";
    const message = isRejected
      ? "관리자 안내를 확인하거나 공동체 담당자에게 문의해 주세요."
      : isHeld
        ? "추가 확인이 필요한 상태입니다. 처리 결과를 다시 안내해 드릴게요."
        : "관리자가 신청 내용을 확인하면 모든 활동과 게시판을 이용할 수 있어요.";
    const card = el("section", { className: "auth-card status-page" }, [
      el("div", { className: "status-page__icon", text: icon, "aria-hidden": "true" }),
      el("span", { className: `status-badge ${isRejected ? "status-badge--danger" : "status-badge--warning"}`, text: JOIN_REQUEST_STATUS_LABEL[request.status] ?? request.status }),
      el("h1", { className: "page-title", text: title }),
      el("p", { className: "subtle", text: message }),
      request.admin_note ? el("div", { className: "notice-box", text: `관리자 안내: ${request.admin_note}` }) : null,
      el("p", { className: "small subtle", text: `신청일 ${formatDateTime(request.requested_at)}` }),
      el("div", { className: "button-row" }, [
        el("button", {
          className: "button button--secondary",
          type: "button",
          text: "상태 새로고침",
          onClick: () => window.location.reload(),
        }),
        el("button", {
          className: "button button--ghost",
          type: "button",
          text: "로그아웃",
          onClick: async () => {
            try {
              await signOut();
              window.location.hash = "#/login";
            } catch (error) {
              showToast(getErrorMessage(error), "error");
            }
          },
        }),
      ]),
    ]);
    main.replaceChildren(card);
  } catch (error) {
    main.replaceChildren(el("section", { className: "auth-card status-page" }, [
      el("div", { className: "status-page__icon", text: "⚠️" }),
      el("h1", { className: "page-title", text: "상태를 확인하지 못했어요" }),
      el("p", { className: "subtle", text: getErrorMessage(error) }),
      el("button", { className: "button", type: "button", text: "다시 시도", onClick: () => window.location.reload() }),
    ]));
  }
  return main;
}

export function renderSuspended() {
  const auth = getAuthState();
  return el("main", { id: "main-content", className: "auth-layout" }, [
    el("section", { className: "auth-card status-page" }, [
      el("div", { className: "status-page__icon", text: "⛔", "aria-hidden": "true" }),
      el("span", { className: "status-badge status-badge--danger", text: "이용 정지" }),
      el("h1", { className: "page-title", text: "현재 서비스 이용이 정지되었어요" }),
      el("p", { className: "subtle", text: `${auth.profile?.display_name ?? "회원"}님의 계정은 관리자 확인이 필요합니다. 공동체 담당자에게 문의해 주세요.` }),
      el("button", {
        className: "button button--ghost",
        type: "button",
        text: "로그아웃",
        onClick: async () => {
          try {
            await signOut();
            window.location.hash = "#/login";
          } catch (error) {
            showToast(getErrorMessage(error), "error");
          }
        },
      }),
    ]),
  ]);
}
