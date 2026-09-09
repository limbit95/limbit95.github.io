import {
  getAuthState,
  requestSignupEmailCode,
  resendSignupEmailCode,
  submitSignupApplication,
  verifySignupEmailCode,
} from "../auth.js";
import { COMMUNITY_RULES_VERSION, PRIVACY_POLICY_VERSION } from "../config.js";
import { getErrorMessage, setBusy, el } from "../ui.js";
import {
  clearFieldErrors,
  setFieldError,
  validateBirthYear,
  validateEmail,
  validatePassword,
  valueInRange,
} from "../validators.js";
import { showToast } from "../components/toast.js";

const STEP_LABELS = ["약관 동의", "기본 정보", "회원 정보", "최종 확인"];
const AGE_LABELS = {
  private: "비공개 (다른 회원에게 나이를 표시하지 않아요.)",
  age_group: "연령대만 공개 (예: 20대)",
  birth_year: "출생연도 공개 (예: 1995년생)",
};
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_MS = 60 * 1000;

export function renderSignup() {
  const currentYear = new Date().getFullYear();
  const existingAuth = getAuthState();
  const existingVerifiedEmail = existingAuth.user && !existingAuth.profile
    ? String(existingAuth.user.email ?? "").trim().toLowerCase()
    : "";
  let step = 1;
  let verifiedEmail = existingVerifiedEmail;
  let codeRequested = false;
  let expiresAt = 0;
  let resendAt = 0;
  let timerId = null;

  const form = el("form", { className: "signup-flow", novalidate: true });
  const progress = el("ol", { className: "signup-progress", "aria-label": "회원가입 진행 단계" });
  const heading = el("h2", { className: "section-title", tabindex: "-1" });
  const panel = el("div", { className: "signup-step" });
  form.append(progress, heading, panel);

  const fields = {
    privacy_consent: checkbox("privacy_consent", "개인정보 수집 및 이용 동의", true),
    rules_consent: checkbox("rules_consent", "청파 같이 커뮤니티 이용수칙 동의", true),
    push_opt_in: checkbox("push_opt_in", "푸시 알림 받기", false, "선택 여부는 최종 확인에만 표시되며 아직 저장하거나 알림 권한을 요청하지 않아요."),
    email: field("email", "이메일", "email", { autocomplete: "email", placeholder: "name@example.com" }, "로그인에 사용하는 이메일입니다."),
    password: field("password", "비밀번호", "password", { autocomplete: "new-password", minlength: "8" }, "인증번호를 처음 받을 때 설정되며 8자 이상 입력해 주세요."),
    display_name: field("display_name", "닉네임", "text", { autocomplete: "nickname", maxlength: "50" }, "게시글과 활동 등에서 주로 표시되며 가입 후 변경할 수 있어요."),
    real_name: field("real_name", "실명", "text", { autocomplete: "name", maxlength: "50" }, "실제 회원을 확인하기 위한 이름이며 청파 같이 구성원이 확인할 수 있습니다."),
    birth_year: field("birth_year", "출생연도", "number", { min: "1900", max: String(currentYear), inputmode: "numeric" }),
    age_visibility: selectField("age_visibility", "나이 공개 범위", Object.entries(AGE_LABELS)),
    church_group: field("church_group", "소속 공동체·부서", "text", { maxlength: "200", placeholder: "예: 청년부 새가족" }, "관리자가 소속을 확인하기 위한 직접 입력 정보이며 권한 기준으로 사용하지 않아요."),
    request_message: textareaField("request_message", "가입 신청 내용", "관리자가 가입자를 확인할 수 있도록 간단한 소개나 가입 관련 내용을 작성해 주세요."),
  };

  if (existingVerifiedEmail) fields.email.input.value = existingVerifiedEmail;

  function updateProgress() {
    progress.replaceChildren(...STEP_LABELS.map((label, index) => el("li", {
      className: index + 1 === step ? "is-current" : index + 1 < step ? "is-complete" : "",
      "aria-current": index + 1 === step ? "step" : null,
    }, [el("span", { text: String(index + 1) }), el("strong", { text: label })])));
  }

  function actionButtons({ next = true, submit = false } = {}) {
    return el("div", { className: "form-actions signup-actions" }, [
      step > 1 ? el("button", { className: "button button--ghost", type: "button", text: "이전", onclick: () => goTo(step - 1) }) : el("a", { className: "button button--ghost", href: "#/login", text: "로그인으로" }),
      el("button", { className: "button button--coral", type: submit ? "submit" : "button", text: submit ? "가입 신청" : "다음", onclick: next && !submit ? () => nextStep() : null }),
    ]);
  }

  function renderStep() {
    clearInterval(timerId);
    updateProgress();
    heading.textContent = `STEP ${step}. ${STEP_LABELS[step - 1]}`;
    if (step === 1) renderAgreements();
    if (step === 2) renderAccount();
    if (step === 3) renderMemberInfo();
    if (step === 4) renderReview();
  }

  function renderAgreements() {
    panel.replaceChildren(
      el("div", { className: "agreement-list" }, [
        agreement(fields.privacy_consent, "내용 보기", [
          "수집 항목: 이메일, 닉네임, 실명, 출생연도, 소속, 가입 신청 내용",
          "이용 목적: 가입자 확인, 승인 및 커뮤니티 운영",
          `개인정보 처리 안내 버전 ${PRIVACY_POLICY_VERSION}`,
        ]),
        agreement(fields.rules_consent, "내용 보기", [
          "서로를 존중하고, 다른 구성원의 개인정보와 공동체 내부 내용을 허락 없이 외부에 공유하지 않습니다.",
          "운영을 방해하거나 타인에게 피해를 주는 활동은 관리자 검토 대상이 될 수 있습니다.",
          `커뮤니티 이용수칙 버전 ${COMMUNITY_RULES_VERSION}`,
        ]),
      ]),
      el("div", { className: "signup-optional" }, [el("p", { className: "eyebrow", text: "선택" }), fields.push_opt_in.root]),
      actionButtons(),
    );
  }

  function renderAccount() {
    const normalized = fields.email.input.value.trim().toLowerCase();
    const isVerified = Boolean(verifiedEmail && verifiedEmail === normalized);
    fields.email.input.disabled = isVerified;
    fields.password.input.disabled = isVerified;
    const emailRow = el("div", { className: "signup-email-row" }, [
      fields.email.root,
      el("button", {
        className: "button button--ghost",
        type: "button",
        text: isVerified ? "인증 완료" : codeRequested ? "재전송" : "인증번호 받기",
        disabled: isVerified,
        onclick: sendCode,
      }),
    ]);
    const codeInput = el("input", { id: "signup-code", name: "verification_code", type: "text", inputmode: "numeric", autocomplete: "one-time-code", maxlength: "6", pattern: "[0-9]{6}", placeholder: "6자리 인증번호" });
    const timer = el("p", { className: "field-help", "aria-live": "polite" });
    const codeArea = codeRequested && !isVerified ? el("div", { className: "field" }, [
      el("label", { className: "required", for: "signup-code", text: "인증번호" }),
      el("div", { className: "signup-code-row" }, [codeInput, el("button", { className: "button button--coral", type: "button", text: "인증확인", onclick: () => verifyCode(codeInput) })]),
      timer,
      errorLine("verification_code"),
    ]) : null;
    panel.replaceChildren(
      emailRow,
      codeArea,
      isVerified ? el("p", { className: "signup-verified", text: "✓ 이메일 인증이 완료되었습니다." }) : null,
      isVerified
        ? el("div", { className: "field" }, [el("strong", { text: "비밀번호 설정됨" }), el("p", { className: "field-help", text: "비밀번호는 이메일 인증을 시작할 때 설정되었습니다." })])
        : fields.password.root,
      fields.display_name.root,
      fields.real_name.root,
      actionButtons(),
    );
    if (codeArea) {
      const tick = () => {
        const left = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
        timer.textContent = left
          ? `남은 시간 ${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}${Date.now() < resendAt ? " · 잠시 후 재전송할 수 있어요." : ""}`
          : "인증번호가 만료되었을 수 있습니다. 재전송해 주세요.";
      };
      tick();
      timerId = setInterval(tick, 1000);
    }
  }

  async function sendCode() {
    clearFieldErrors(form);
    const email = fields.email.input.value.trim().toLowerCase();
    if (!validateEmail(email)) return setFieldError(form, "email", "올바른 이메일 주소를 입력해 주세요.");
    if (Date.now() < resendAt) return setFieldError(form, "email", "잠시 후 다시 요청해 주세요.");
    if (!codeRequested && !validatePassword(fields.password.input.value)) {
      return setFieldError(form, "password", "비밀번호는 8자 이상 입력해 주세요.");
    }
    setBusy(form, true, "발송 중…");
    try {
      if (codeRequested) await resendSignupEmailCode(email);
      else await requestSignupEmailCode(email, fields.password.input.value);
      codeRequested = true;
      expiresAt = Date.now() + OTP_TTL_MS;
      resendAt = Date.now() + OTP_RESEND_MS;
      showToast("인증번호를 이메일로 보냈습니다.", "success");
      renderStep();
    } catch (error) { showToast(getErrorMessage(error), "error"); }
    finally { setBusy(form, false); }
  }

  async function verifyCode(input) {
    clearFieldErrors(form);
    if (!/^\d{6}$/.test(input.value)) return setFieldError(form, "verification_code", "6자리 숫자를 입력해 주세요.");
    setBusy(form, true, "확인 중…");
    try {
      const email = fields.email.input.value.trim().toLowerCase();
      await verifySignupEmailCode(email, input.value);
      verifiedEmail = email;
      codeRequested = false;
      expiresAt = 0;
      renderStep();
    } catch (error) { setFieldError(form, "verification_code", getErrorMessage(error)); }
    finally { setBusy(form, false); }
  }

  function renderMemberInfo() {
    panel.replaceChildren(fields.birth_year.root, fields.age_visibility.root, fields.church_group.root, fields.request_message.root, actionButtons());
  }

  function renderReview() {
    panel.replaceChildren(
      el("p", { className: "page-description", text: "가입 정보를 확인해 주세요. 비밀번호 원문은 표시하지 않습니다." }),
      reviewSection("계정 정보", () => goTo(2), [
        ["이메일", fields.email.input.value], ["이메일 인증", verifiedEmail ? "인증 완료" : "미완료"],
        ["비밀번호", "설정됨"], ["닉네임", fields.display_name.input.value], ["실명", fields.real_name.input.value],
      ]),
      reviewSection("회원 정보", () => goTo(3), [
        ["출생연도", `${fields.birth_year.input.value}년`], ["나이 공개 범위", AGE_LABELS[fields.age_visibility.input.value]],
        ["소속 공동체·부서", fields.church_group.input.value],
      ]),
      reviewSection("가입 신청", () => goTo(3), [["가입 신청 내용", fields.request_message.input.value]]),
      reviewSection("동의", () => goTo(1), [
        ["개인정보 수집 및 이용", "동의"], ["커뮤니티 이용수칙", "동의"],
        ["푸시 알림 받기", fields.push_opt_in.input.checked ? "선택" : "선택 안 함"],
      ]),
      actionButtons({ next: false, submit: true }),
    );
  }

  function validateStep(targetStep) {
    clearFieldErrors(form);
    let valid = true;
    const required = (item, message) => {
      if (!item.input.value.trim()) { setFieldError(form, item.input.name, message); valid = false; }
    };
    if (targetStep === 1) {
      if (!fields.privacy_consent.input.checked) { setFieldError(form, "privacy_consent", "개인정보 수집 및 이용 동의가 필요합니다."); valid = false; }
      if (!fields.rules_consent.input.checked) { setFieldError(form, "rules_consent", "커뮤니티 이용수칙 동의가 필요합니다."); valid = false; }
    }
    if (targetStep === 2) {
      required(fields.email, "이메일을 입력해 주세요.");
      required(fields.display_name, "닉네임을 입력해 주세요.");
      required(fields.real_name, "실명을 입력해 주세요.");
      if (!validateEmail(fields.email.input.value)) { setFieldError(form, "email", "올바른 이메일 주소를 입력해 주세요."); valid = false; }
      if (!verifiedEmail || verifiedEmail !== fields.email.input.value.trim().toLowerCase()) { setFieldError(form, "email", "이메일 인증을 완료해 주세요."); valid = false; }
      if (!verifiedEmail && !validatePassword(fields.password.input.value)) { setFieldError(form, "password", "비밀번호는 8자 이상 입력해 주세요."); valid = false; }
      if (!valueInRange(fields.display_name.input.value, 1, 50)) { setFieldError(form, "display_name", "닉네임은 1~50자로 입력해 주세요."); valid = false; }
      if (!valueInRange(fields.real_name.input.value, 1, 50)) { setFieldError(form, "real_name", "실명은 1~50자로 입력해 주세요."); valid = false; }
    }
    if (targetStep === 3) {
      required(fields.church_group, "소속 공동체·부서를 입력해 주세요."); required(fields.request_message, "가입 신청 내용을 입력해 주세요.");
      if (!validateBirthYear(fields.birth_year.input.value) || Number(fields.birth_year.input.value) > currentYear) { setFieldError(form, "birth_year", "올바른 출생연도를 입력해 주세요."); valid = false; }
      if (!valueInRange(fields.request_message.input.value, 1, 1000)) { setFieldError(form, "request_message", "가입 신청 내용은 1~1,000자로 입력해 주세요."); valid = false; }
    }
    return valid;
  }

  function nextStep() { if (validateStep(step)) goTo(step + 1); }
  function goTo(next) { step = next; renderStep(); heading.focus(); }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    for (const targetStep of [1, 2, 3]) {
      if (!validateStep(targetStep)) {
        goTo(targetStep);
        showToast("필수 정보를 다시 확인해 주세요.", "error");
        return;
      }
    }
    setBusy(form, true, "가입 신청 중…");
    try {
      await submitSignupApplication({
        display_name: fields.display_name.input.value.trim(),
        real_name: fields.real_name.input.value.trim(),
        birth_year: Number(fields.birth_year.input.value),
        age_visibility: fields.age_visibility.input.value,
        church_group: fields.church_group.input.value.trim(),
        request_message: fields.request_message.input.value.trim(),
        privacy_consent: true,
        privacy_policy_version: PRIVACY_POLICY_VERSION,
        rules_consent: true,
        community_rules_version: COMMUNITY_RULES_VERSION,
      });
      showToast("가입 신청이 완료되었습니다. 관리자의 승인을 기다려 주세요.", "success", 6000);
      window.location.hash = "#/pending";
    } catch (error) { showToast(getErrorMessage(error), "error"); }
    finally { setBusy(form, false); }
  });

  renderStep();
  return el("main", { id: "main-content", className: "auth-layout" }, [el("section", { className: "auth-card auth-card--signup" }, [
    el("a", { className: "auth-brand", href: "#/login" }, [el("img", { src: "./assets/images/logo.svg", alt: "", width: "68", height: "68" })]),
    el("div", { className: "page-stack" }, [el("div", {}, [el("p", { className: "eyebrow", text: "JOIN THE COMMUNITY" }), el("h1", { className: "page-title", text: "함께할 준비가 되었나요?" }), el("p", { className: "page-description", text: "이메일 인증과 가입 정보 확인 후 관리자 승인을 요청합니다." })]), form]),
  ])]);
}

function errorLine(name) { return el("p", { className: "field-error", dataset: { errorFor: name }, "aria-live": "polite" }); }
function field(name, label, type, attributes = {}, help = "") {
  const input = el("input", { id: `signup-${name}`, name, type, required: true, ...attributes });
  return { input, root: el("div", { className: "field" }, [el("label", { className: "required", for: input.id, text: label }), input, help ? el("p", { className: "field-help", text: help }) : null, errorLine(name)]) };
}
function textareaField(name, label, help) {
  const input = el("textarea", { id: `signup-${name}`, name, maxlength: "1000", required: true, placeholder: "간단한 소개와 가입 목적을 적어 주세요." });
  return { input, root: el("div", { className: "field" }, [el("label", { className: "required", for: input.id, text: label }), input, el("p", { className: "field-help", text: help }), errorLine(name)]) };
}
function selectField(name, label, options) {
  const input = el("select", { id: `signup-${name}`, name, required: true }, options.map(([value, text]) => el("option", { value, text })));
  return { input, root: el("div", { className: "field" }, [el("label", { className: "required", for: input.id, text: label }), input, errorLine(name)]) };
}
function checkbox(name, label, required, help = "") {
  const input = el("input", { type: "checkbox", name, value: "true", required });
  return { input, root: el("div", { className: "field" }, [el("label", { className: "checkbox" }, [input, el("span", {}, [el("strong", { text: `${label}${required ? " (필수)" : ""}` }), help ? el("span", { className: "small subtle", text: ` ${help}` }) : null])]), errorLine(name)]) };
}
function agreement(item, summary, lines) { return el("div", { className: "agreement-item" }, [item.root, el("details", {}, [el("summary", { text: summary }), el("ul", {}, lines.map((text) => el("li", { text })))])]); }
function reviewSection(title, onEdit, rows) { return el("section", { className: "signup-review" }, [el("div", { className: "signup-review__head" }, [el("h3", { text: title }), el("button", { type: "button", className: "button button--text", text: "수정", onclick: onEdit })]), el("dl", {}, rows.flatMap(([term, value]) => [el("dt", { text: term }), el("dd", { text: value || "-" })]))]); }
