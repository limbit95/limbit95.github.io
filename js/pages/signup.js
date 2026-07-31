import { signUp } from "../auth.js";
import { PRIVACY_POLICY_VERSION } from "../config.js";
import { getErrorMessage, setBusy, el } from "../ui.js";
import {
  clearFieldErrors,
  setFieldError,
  validateBirthYear,
  validateEmail,
  validatePassword,
  validateRequiredFields,
  valueInRange,
} from "../validators.js";
import { showToast } from "../components/toast.js";

export function renderSignup() {
  const currentYear = new Date().getFullYear();
  const form = el("form", { className: "form-grid form-grid--2", novalidate: true });
  form.append(
    field("email", "이메일", "email", { autocomplete: "email", placeholder: "name@example.com" }),
    field("password", "비밀번호", "password", { autocomplete: "new-password", minlength: "8" }, "8자 이상 입력해 주세요."),
    field("display_name", "커뮤니티 표시 이름", "text", { autocomplete: "nickname", maxlength: "50" }),
    field("real_name", "실명", "text", { autocomplete: "name", maxlength: "50" }),
    field("birth_year", "출생연도", "number", { min: "1900", max: String(currentYear), inputmode: "numeric" }, "가입 시 네 자리 출생연도가 필요합니다."),
    selectField("age_visibility", "나이 공개 범위", [
      ["private", "비공개"],
      ["age_group", "연령대만 공개"],
      ["birth_year", "출생연도 공개"],
    ]),
    field("church_group", "소속 공동체·부서", "text", { maxlength: "200", placeholder: "예: 청년부 새가족" }),
    el("div", { className: "field field--full" }, [
      el("label", { className: "required", for: "signup-request_message", text: "가입 신청 내용" }),
      el("textarea", { id: "signup-request_message", name: "request_message", maxlength: "1000", required: true, placeholder: "간단한 소개와 가입 목적을 적어 주세요." }),
      el("p", { className: "field-error", dataset: { errorFor: "request_message" }, "aria-live": "polite" }),
    ]),
    el("div", { className: "field field--full" }, [
      el("label", { className: "checkbox" }, [
        el("input", { type: "checkbox", name: "privacy_consent", value: "true", required: true }),
        el("span", {}, [
          el("strong", { text: "개인정보 수집 및 이용에 동의합니다." }),
          el("span", { className: "small subtle", text: ` 가입 승인과 커뮤니티 운영 목적으로 신청 정보를 처리합니다. 정책 버전 ${PRIVACY_POLICY_VERSION}` }),
        ]),
      ]),
      el("p", { className: "field-error", dataset: { errorFor: "privacy_consent" }, "aria-live": "polite" }),
    ]),
    el("div", { className: "form-actions field--full" }, [
      el("a", { className: "button button--ghost", href: "#/login", text: "로그인으로" }),
      el("button", { className: "button button--coral", type: "submit", text: "가입 신청" }),
    ]),
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldErrors(form);
    let valid = validateRequiredFields(form, ["email", "password", "display_name", "real_name", "church_group", "request_message"]);
    if (!validateEmail(form.email.value)) {
      setFieldError(form, "email", "올바른 이메일 주소를 입력해 주세요.");
      valid = false;
    }
    if (!validatePassword(form.password.value)) {
      setFieldError(form, "password", "비밀번호는 8자 이상 입력해 주세요.");
      valid = false;
    }
    if (!valueInRange(form.display_name.value, 1, 50)) {
      setFieldError(form, "display_name", "표시 이름은 1~50자로 입력해 주세요.");
      valid = false;
    }
    if (!valueInRange(form.request_message.value, 1, 1000)) {
      setFieldError(form, "request_message", "가입 신청 내용은 1~1,000자로 입력해 주세요.");
      valid = false;
    }
    if (!form.birth_year.value || !validateBirthYear(form.birth_year.value) || Number(form.birth_year.value) > currentYear) {
      setFieldError(form, "birth_year", "올바른 출생연도를 입력해 주세요.");
      valid = false;
    }
    if (!form.privacy_consent.checked) {
      setFieldError(form, "privacy_consent", "개인정보 수집 및 이용 동의가 필요합니다.");
      valid = false;
    }
    if (!valid) return;

    setBusy(form, true, "가입 신청 중…");
    try {
      const birthYear = Number(form.birth_year.value);
      const result = await signUp({
        email: form.email.value.trim().toLowerCase(),
        password: form.password.value,
        metadata: {
          display_name: form.display_name.value.trim(),
          real_name: form.real_name.value.trim(),
          birth_year: birthYear,
          age_visibility: form.age_visibility.value,
          church_group: form.church_group.value.trim(),
          request_message: form.request_message.value.trim(),
          privacy_consent: true,
          privacy_policy_version: PRIVACY_POLICY_VERSION,
        },
      });
      showToast(
        result.session
          ? "가입 신청이 접수되었습니다."
          : "가입 신청이 접수되었습니다. 이메일 인증 링크도 확인해 주세요.",
        "success",
        6000,
      );
      window.location.hash = result.session ? "#/pending" : "#/login";
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setBusy(form, false);
    }
  });

  return el("main", { id: "main-content", className: "auth-layout" }, [
    el("section", { className: "auth-card" }, [
      el("a", { className: "auth-brand", href: "#/login" }, [
        el("img", { src: "./assets/images/logo.svg", alt: "", width: "68", height: "68" }),
      ]),
      el("div", { className: "page-stack" }, [
        el("div", {}, [
          el("p", { className: "eyebrow", text: "JOIN THE COMMUNITY" }),
          el("h1", { className: "page-title", text: "함께할 준비가 되었나요?" }),
          el("p", { className: "page-description", text: "가입 신청 후 관리자의 승인을 거쳐 활동에 참여할 수 있어요." }),
        ]),
        form,
      ]),
    ]),
  ]);
}

function field(name, label, type, attributes = {}, help = "") {
  return el("div", { className: "field" }, [
    el("label", { className: "required", for: `signup-${name}`, text: label }),
    el("input", { id: `signup-${name}`, name, type, required: true, ...attributes }),
    help ? el("p", { className: "field-help", text: help }) : null,
    el("p", { className: "field-error", dataset: { errorFor: name }, "aria-live": "polite" }),
  ]);
}

function selectField(name, label, options) {
  return el("div", { className: "field" }, [
    el("label", { className: "required", for: `signup-${name}`, text: label }),
    el("select", { id: `signup-${name}`, name, required: true }, options.map(([value, text]) => el("option", { value, text }))),
    el("p", { className: "field-error", dataset: { errorFor: name }, "aria-live": "polite" }),
  ]);
}
