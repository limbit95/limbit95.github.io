import {
  getAuthState,
  requestPasswordReset,
  signOut,
  updatePassword,
  verifyRecoveryToken,
} from "../auth.js";
import { showToast } from "../components/toast.js";
import {
  clearFieldErrors,
  setFieldError,
  validateEmail,
  validatePassword,
} from "../validators.js";
import {
  el,
  getErrorMessage,
  loadingState,
  setBusy,
} from "../ui.js";

function brand() {
  return el("a", { className: "auth-brand", href: "#/", "aria-label": "청파 같이 홈" }, [
    el("img", { src: "./assets/images/logo.svg", alt: "", width: "68", height: "68" }),
  ]);
}

function cleanRecoveryUrl() {
  const cleanUrl = `${window.location.pathname}${window.location.hash}`;
  window.history.replaceState(null, "", cleanUrl);
}

function recoveryErrorMessage(error) {
  const source = [error?.code, error?.message, error?.details]
    .filter(Boolean)
    .join(" ");
  if (/otp_expired|expired|invalid.*token|token.*invalid/i.test(source)) {
    return "복구 링크가 만료되었거나 이미 사용되었습니다. 비밀번호 찾기에서 새 링크를 요청해 주세요.";
  }
  return getErrorMessage(error, "복구 링크를 확인하지 못했습니다. 새 링크를 요청해 주세요.");
}

function recoveryState({ success, title, message, actionHref, actionText }) {
  return el("section", { className: "auth-card status-page", role: success ? "status" : "alert" }, [
    el("div", {
      className: "status-page__icon",
      text: success ? "✅" : "⚠️",
      "aria-hidden": "true",
    }),
    el("span", {
      className: `status-badge ${success ? "" : "status-badge--danger"}`,
      text: success ? "✓ 처리 완료" : "✕ 확인 필요",
    }),
    el("h1", { className: "page-title", text: title }),
    el("p", { className: "subtle", text: message }),
    el("a", { className: "button", href: actionHref, text: actionText }),
  ]);
}

export function renderForgotPassword() {
  const email = el("input", {
    id: "reset-email",
    name: "email",
    type: "email",
    autocomplete: "email",
    required: true,
    placeholder: "name@example.com",
  });
  const form = el("form", { className: "form-grid", novalidate: true }, [
    el("div", { className: "field" }, [
      el("label", { className: "required", for: "reset-email", text: "가입 이메일" }),
      email,
      el("p", {
        className: "field-error",
        dataset: { errorFor: "email" },
        "aria-live": "polite",
      }),
    ]),
    el("button", {
      className: "button button--block",
      type: "submit",
      text: "비밀번호 복구 메일 보내기",
    }),
  ]);
  const main = el("main", { id: "main-content", className: "auth-layout", tabindex: "-1" });
  const card = el("section", { className: "auth-card" }, [
    brand(),
    el("div", { className: "page-stack" }, [
      el("div", {}, [
        el("p", { className: "eyebrow", text: "PASSWORD HELP" }),
        el("h1", { className: "page-title", text: "비밀번호를 다시 설정해요" }),
        el("p", {
          className: "page-description",
          text: "가입한 이메일로 안전한 비밀번호 복구 링크를 보내드립니다.",
        }),
      ]),
      form,
      el("p", { className: "small subtle" }, [
        "비밀번호가 기억났나요? ",
        el("a", {
          href: "#/login",
          text: "로그인",
          style: { color: "var(--forest-700)", fontWeight: "800" },
        }),
      ]),
    ]),
  ]);
  main.append(card);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldErrors(form);
    if (!validateEmail(email.value)) {
      setFieldError(form, "email", "올바른 이메일 주소를 입력해 주세요.");
      return;
    }
    setBusy(form, true, "메일 발송 중…");
    try {
      await requestPasswordReset(email.value.trim().toLowerCase());
      main.replaceChildren(recoveryState({
        success: true,
        title: "복구 메일을 확인해 주세요",
        message: "가입된 계정이라면 비밀번호 재설정 링크가 발송됩니다. 받은편지함과 스팸함을 확인해 주세요.",
        actionHref: "#/login",
        actionText: "로그인으로 돌아가기",
      }));
    } catch (error) {
      showToast(getErrorMessage(error, "복구 메일을 보내지 못했습니다."), "error");
      setBusy(form, false);
    }
  });

  return main;
}

function passwordForm(main) {
  const password = el("input", {
    id: "new-password",
    name: "password",
    type: "password",
    autocomplete: "new-password",
    minlength: "8",
    maxlength: "128",
    required: true,
  });
  const confirmation = el("input", {
    id: "new-password-confirmation",
    name: "password_confirmation",
    type: "password",
    autocomplete: "new-password",
    minlength: "8",
    maxlength: "128",
    required: true,
  });
  const form = el("form", { className: "form-grid", novalidate: true }, [
    el("div", { className: "field" }, [
      el("label", { className: "required", for: "new-password", text: "새 비밀번호" }),
      password,
      el("p", { className: "field-help", text: "8자 이상 입력해 주세요." }),
      el("p", {
        className: "field-error",
        dataset: { errorFor: "password" },
        "aria-live": "polite",
      }),
    ]),
    el("div", { className: "field" }, [
      el("label", {
        className: "required",
        for: "new-password-confirmation",
        text: "새 비밀번호 확인",
      }),
      confirmation,
      el("p", {
        className: "field-error",
        dataset: { errorFor: "password_confirmation" },
        "aria-live": "polite",
      }),
    ]),
    el("button", {
      className: "button button--block",
      type: "submit",
      text: "새 비밀번호 저장",
    }),
  ]);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldErrors(form);
    let valid = true;
    if (!validatePassword(password.value) || password.value.length > 128) {
      setFieldError(form, "password", "비밀번호는 8자 이상 128자 이하로 입력해 주세요.");
      valid = false;
    }
    if (confirmation.value !== password.value) {
      setFieldError(form, "password_confirmation", "새 비밀번호가 서로 일치하지 않습니다.");
      valid = false;
    }
    if (!valid) return;

    setBusy(form, true, "비밀번호 변경 중…");
    try {
      await updatePassword(password.value);
      await signOut();
      main.replaceChildren(recoveryState({
        success: true,
        title: "비밀번호를 변경했어요",
        message: "새 비밀번호가 저장되었습니다. 변경한 비밀번호로 다시 로그인해 주세요.",
        actionHref: "#/login",
        actionText: "로그인하기",
      }));
    } catch (error) {
      showToast(getErrorMessage(error, "비밀번호를 변경하지 못했습니다."), "error");
      setBusy(form, false);
    }
  });
  return form;
}

export async function renderPasswordUpdate() {
  const main = el(
    "main",
    { id: "main-content", className: "auth-layout", tabindex: "-1" },
    loadingState("복구 링크 확인 중…"),
  );
  const params = new URLSearchParams(window.location.search);
  const tokenHash = params.get("token_hash");

  try {
    if (tokenHash) {
      await verifyRecoveryToken(tokenHash);
      cleanRecoveryUrl();
    } else if (!getAuthState().user) {
      main.replaceChildren(recoveryState({
        success: false,
        title: "유효한 복구 정보가 없어요",
        message: "이메일에서 받은 최신 비밀번호 복구 링크를 다시 열어 주세요.",
        actionHref: "#/password/forgot",
        actionText: "새 복구 링크 요청",
      }));
      return main;
    }

    main.replaceChildren(el("section", { className: "auth-card" }, [
      brand(),
      el("div", { className: "page-stack" }, [
        el("div", {}, [
          el("p", { className: "eyebrow", text: "NEW PASSWORD" }),
          el("h1", { className: "page-title", text: "새 비밀번호를 입력해 주세요" }),
          el("p", {
            className: "page-description",
            text: "앞으로 로그인할 때 사용할 새로운 비밀번호를 설정합니다.",
          }),
        ]),
        passwordForm(main),
      ]),
    ]));
  } catch (error) {
    cleanRecoveryUrl();
    main.replaceChildren(recoveryState({
      success: false,
      title: "복구 링크를 사용할 수 없어요",
      message: recoveryErrorMessage(error),
      actionHref: "#/password/forgot",
      actionText: "새 복구 링크 요청",
    }));
  }
  return main;
}
