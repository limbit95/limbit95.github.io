import { getAuthState, signIn } from "../auth.js";
import { getErrorMessage, setBusy, el } from "../ui.js";
import { clearFieldErrors, setFieldError, validateEmail, validatePassword } from "../validators.js";
import { showToast } from "../components/toast.js";

export function renderLogin() {
  const form = el("form", { className: "form-grid", novalidate: true });
  const email = el("input", {
    id: "login-email",
    name: "email",
    type: "email",
    autocomplete: "email",
    required: true,
    placeholder: "name@example.com",
  });
  const password = el("input", {
    id: "login-password",
    name: "password",
    type: "password",
    autocomplete: "current-password",
    required: true,
    minlength: "8",
  });
  form.append(
    el("div", { className: "field" }, [
      el("label", { className: "required", for: "login-email", text: "이메일" }),
      email,
      el("p", { className: "field-error", dataset: { errorFor: "email" }, "aria-live": "polite" }),
    ]),
    el("div", { className: "field" }, [
      el("label", { className: "required", for: "login-password", text: "비밀번호" }),
      password,
      el("p", { className: "field-error", dataset: { errorFor: "password" }, "aria-live": "polite" }),
    ]),
    el("button", { className: "button button--block", type: "submit", text: "이메일로 로그인" }),
  );
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldErrors(form);
    let valid = true;
    if (!validateEmail(email.value)) {
      setFieldError(form, "email", "올바른 이메일 주소를 입력해 주세요.");
      valid = false;
    }
    if (!validatePassword(password.value)) {
      setFieldError(form, "password", "비밀번호는 8자 이상 입력해 주세요.");
      valid = false;
    }
    if (!valid) return;
    setBusy(form, true, "로그인 중…");
    try {
      await signIn(email.value.trim().toLowerCase(), password.value);
      const auth = getAuthState();
      showToast("로그인했습니다.", "success");
      window.location.hash = auth.profile?.status === "approved"
        ? "#/"
        : auth.profile?.status === "suspended"
          ? "#/suspended"
          : "#/pending";
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setBusy(form, false);
    }
  });

  const card = el("section", { className: "auth-card" }, [
    el("a", { className: "auth-brand", href: "#/", "aria-label": "청파 같이 홈" }, [
      el("img", { src: "./assets/images/logo.svg", alt: "", width: "68", height: "68" }),
    ]),
    el("div", { className: "page-stack" }, [
      el("div", {}, [
        el("p", { className: "eyebrow", text: "WELCOME BACK" }),
        el("h1", { className: "page-title", text: "다시 만나 반가워요" }),
        el("p", { className: "page-description", text: "이메일과 비밀번호로 로그인해 주세요." }),
      ]),
      new URLSearchParams(window.location.search).has("auth")
        ? el("div", { className: "notice-box", text: "이메일 인증이 완료되었습니다. 로그인해 주세요." })
        : null,
      form,
      el("p", { className: "small subtle" }, [
        "아직 계정이 없나요? ",
        el("a", { href: "#/signup", text: "회원가입", style: { color: "var(--forest-700)", fontWeight: "800" } }),
      ]),
    ]),
  ]);
  return el("main", { id: "main-content", className: "auth-layout" }, card);
}
