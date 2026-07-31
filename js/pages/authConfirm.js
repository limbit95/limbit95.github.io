import { getAuthState, verifyEmailToken } from "../auth.js";
import { el, loadingState } from "../ui.js";

function cleanConfirmationUrl() {
  const cleanUrl = `${window.location.pathname}${window.location.hash}`;
  window.history.replaceState(null, "", cleanUrl);
}

function confirmationErrorMessage(error) {
  const source = [error?.code, error?.message, error?.details]
    .filter(Boolean)
    .join(" ");
  if (/otp_expired|expired|invalid.*token|token.*invalid/i.test(source)) {
    return "인증 링크가 만료되었거나 이미 사용되었습니다. 이미 인증을 완료했다면 로그인해 주세요.";
  }
  return "이메일 인증을 완료하지 못했습니다. 잠시 후 이메일의 최신 인증 링크를 다시 열어 주세요.";
}

function resultCard({ success, message }) {
  const auth = getAuthState();
  const destination = auth.profile?.status === "approved"
    ? "#/"
    : auth.user
      ? "#/pending"
      : "#/login";
  const actionText = auth.profile?.status === "approved"
    ? "홈으로 이동"
    : auth.user
      ? "가입 승인 상태 확인"
      : "로그인으로 이동";

  return el("section", { className: "auth-card status-page", role: success ? "status" : "alert" }, [
    el("div", {
      className: "status-page__icon",
      text: success ? "✅" : "⚠️",
      "aria-hidden": "true",
    }),
    el("span", {
      className: `status-badge ${success ? "" : "status-badge--danger"}`,
      text: success ? "✓ 이메일 인증 완료" : "✕ 이메일 인증 실패",
    }),
    el("h1", {
      className: "page-title",
      text: success ? "이메일 인증이 완료되었어요" : "인증 링크를 확인하지 못했어요",
    }),
    el("p", { className: "subtle", text: message }),
    !success
      ? el("p", {
          className: "small subtle",
          text: "링크는 한 번만 사용할 수 있습니다. 이전에 인증했다면 바로 로그인해 보세요.",
        })
      : null,
    el("div", { className: "button-row" }, [
      el("a", { className: "button", href: destination, text: actionText }),
      !success
        ? el("a", {
            className: "button button--ghost",
            href: "#/signup",
            text: "회원가입 화면",
          })
        : null,
    ]),
  ]);
}

export async function renderAuthConfirm() {
  const main = el(
    "main",
    { id: "main-content", className: "auth-layout", tabindex: "-1" },
    loadingState("이메일 인증 확인 중…"),
  );
  const params = new URLSearchParams(window.location.search);
  const tokenHash = params.get("token_hash");
  const type = params.get("type") || "email";

  if (!tokenHash) {
    main.replaceChildren(resultCard({
      success: false,
      message: "인증 정보가 없습니다. 이메일에서 받은 인증 링크를 다시 열어 주세요.",
    }));
    return main;
  }

  try {
    await verifyEmailToken(tokenHash, type);
    cleanConfirmationUrl();
    main.replaceChildren(resultCard({
      success: true,
      message: "이메일 주소를 확인했습니다. 이제 관리자가 가입 신청을 승인할 때까지 기다려 주세요.",
    }));
  } catch (error) {
    cleanConfirmationUrl();
    main.replaceChildren(resultCard({
      success: false,
      message: confirmationErrorMessage(error),
    }));
  }
  return main;
}
