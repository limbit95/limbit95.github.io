import {
  getAuthState,
  requestSignupEmailCode,
  resendSignupEmailCode,
  submitSignupApplication,
  updatePassword,
  verifySignupEmailCode,
} from "../auth.js";
import { COMMUNITY_RULES_VERSION, PRIVACY_POLICY_VERSION } from "../config.js";
import { getErrorMessage, setBusy, el } from "../ui.js";
import {
  clearFieldErrors,
  setFieldError,
  validateBirthDate,
  validateEmail,
  validatePassword,
  valueInRange,
} from "../validators.js";
import { showToast } from "../components/toast.js";

const STEP_LABELS = ["약관 동의", "회원 정보", "최종 확인"];
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_MS = 60 * 1000;
const OTP_RESEND_STORAGE_KEY = "cheongpa:signup-otp-resend-cooldowns";

function getOtpResendStorageKey(email) {
  let hash = 2166136261;
  for (let index = 0; index < email.length; index += 1) {
    hash ^= email.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function readOtpResendCooldowns(now = Date.now()) {
  if (typeof window === "undefined") return {};
  try {
    const storage = window.localStorage;
    const parsed = JSON.parse(storage.getItem(OTP_RESEND_STORAGE_KEY) || "{}");
    const active = {};
    for (const [key, value] of Object.entries(parsed ?? {})) {
      const resendAt = Number(value);
      if (Number.isFinite(resendAt) && resendAt > now && resendAt <= now + OTP_RESEND_MS) {
        active[key] = resendAt;
      }
    }
    if (Object.keys(active).length) storage.setItem(OTP_RESEND_STORAGE_KEY, JSON.stringify(active));
    else storage.removeItem(OTP_RESEND_STORAGE_KEY);
    return active;
  } catch {
    return {};
  }
}

function getStoredOtpResendAt(email, now = Date.now()) {
  const normalized = String(email ?? "").trim().toLowerCase();
  if (!validateEmail(normalized)) return 0;
  return Number(readOtpResendCooldowns(now)[getOtpResendStorageKey(normalized)] ?? 0);
}

function persistOtpResendAt(email, resendAt) {
  if (typeof window === "undefined") return;
  try {
    const normalized = String(email ?? "").trim().toLowerCase();
    if (!validateEmail(normalized)) return;
    const storage = window.localStorage;
    const active = readOtpResendCooldowns();
    active[getOtpResendStorageKey(normalized)] = resendAt;
    storage.setItem(OTP_RESEND_STORAGE_KEY, JSON.stringify(active));
  } catch {
    // Cooldown persistence is a UX aid; Auth rate limits remain authoritative.
  }
}

function clearStoredOtpResendAt(email) {
  if (typeof window === "undefined") return;
  try {
    const normalized = String(email ?? "").trim().toLowerCase();
    const storage = window.localStorage;
    const active = readOtpResendCooldowns();
    delete active[getOtpResendStorageKey(normalized)];
    if (Object.keys(active).length) storage.setItem(OTP_RESEND_STORAGE_KEY, JSON.stringify(active));
    else storage.removeItem(OTP_RESEND_STORAGE_KEY);
  } catch {
    // Ignore unavailable localStorage and fall back to the server-side limit.
  }
}

export function renderSignup() {
  const currentYear = new Date().getFullYear();
  const existingAuth = getAuthState();
  const existingVerifiedEmail = existingAuth.user && !existingAuth.profile
    ? String(existingAuth.user.email ?? "").trim().toLowerCase()
    : "";
  let step = existingVerifiedEmail ? 2 : 1;
  let verifiedEmail = existingVerifiedEmail;
  let existingAccountEmail = "";
  let codeRequested = false;
  let expiresAt = 0;
  let resendAt = 0;
  let timerId = null;
  let refreshResendCooldown = null;
  let appliedPassword = "";

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
    password: field("password", "비밀번호", "password", { autocomplete: "new-password", minlength: "8" }, "이메일 인증 완료 후 사용할 비밀번호를 8자 이상 입력해 주세요."),
    password_confirm: field("password_confirm", "비밀번호 확인", "password", { autocomplete: "new-password", minlength: "8" }, "위에서 입력한 비밀번호를 한 번 더 입력해 주세요."),
    display_name: field("display_name", "닉네임", "text", { autocomplete: "nickname", maxlength: "50" }, "게시글과 활동 등에서 주로 표시되며 가입 후 변경할 수 있어요."),
    real_name: field("real_name", "실명", "text", { autocomplete: "name", maxlength: "50" }, "실제 회원을 확인하기 위한 이름이며 청파 같이 구성원이 확인할 수 있습니다."),
    birth_date: birthDateField(currentYear),
    church_group: field("church_group", "소속 공동체·부서", "text", { maxlength: "200", placeholder: "예: 청년부 새가족" }, "관리자가 소속을 확인하기 위한 직접 입력 정보이며 권한 기준으로 사용하지 않아요."),
    request_message: textareaField("request_message", "가입 신청 내용", "관리자가 가입자를 확인할 수 있도록 간단한 소개나 가입 관련 내용을 작성해 주세요."),
  };

  if (existingVerifiedEmail) {
    fields.email.input.value = existingVerifiedEmail;
    // The supported OTP signup path can only reach verification after step 1 consent validation.
    // Restore those required checks so a persisted Auth session can resume at step 2 after reload.
    fields.privacy_consent.input.checked = true;
    fields.rules_consent.input.checked = true;
  }
  fields.email.input.addEventListener("input", () => {
    const normalized = fields.email.input.value.trim().toLowerCase();
    if (existingAccountEmail && normalized !== existingAccountEmail) {
      existingAccountEmail = "";
      form.querySelector("[data-signup-existing-account]")?.remove();
    }
    if (!codeRequested && !verifiedEmail) {
      resendAt = getStoredOtpResendAt(normalized);
      refreshResendCooldown?.();
    }
  });

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
    timerId = null;
    refreshResendCooldown = null;
    updateProgress();
    heading.textContent = `STEP ${step}. ${STEP_LABELS[step - 1]}`;
    if (step === 1) renderAgreements();
    if (step === 2) renderMemberInfo();
    if (step === 3) renderReview();
  }

  function renderAgreements() {
    panel.replaceChildren(
      el("div", { className: "agreement-list" }, [
        agreement(fields.privacy_consent, "내용 보기", [
          "수집 항목: 이메일, 닉네임, 실명, 출생연월일, 소속, 가입 신청 내용",
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

  function renderMemberInfo() {
    const normalized = fields.email.input.value.trim().toLowerCase();
    const isVerified = Boolean(verifiedEmail && verifiedEmail === normalized);
    const isAwaitingCode = codeRequested && !isVerified;
    if (!codeRequested && !isVerified) resendAt = getStoredOtpResendAt(normalized);
    const resendSeconds = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
    fields.email.input.disabled = isVerified || isAwaitingCode;
    fields.password.input.disabled = !isVerified;
    fields.password_confirm.input.disabled = !isVerified;

    const emailButton = el("button", {
      className: "button button--ghost",
      type: "button",
      text: isVerified ? "인증 완료" : codeRequested
        ? resendSeconds > 0 ? `재전송 (${resendSeconds}초)` : "재전송"
        : resendSeconds > 0 ? `인증번호 받기 (${resendSeconds}초)` : "인증번호 받기",
      disabled: isVerified || resendSeconds > 0,
      onclick: sendCode,
    });
    const resendNotice = el("p", { className: "field-help", "aria-live": "polite" });
    const emailField = el("div", { className: "field" }, [
      el("label", { className: "required", for: fields.email.input.id, text: "이메일" }),
      el("div", { className: "signup-email-row" }, [fields.email.input, emailButton]),
      el("p", { className: "field-help", text: "이메일만 입력하면 인증번호를 받을 수 있습니다." }),
      resendNotice,
      errorLine("email"),
    ]);
    const existingAccountNotice = existingAccountEmail && existingAccountEmail === normalized
      ? el("div", { className: "state-box", role: "status", dataset: { signupExistingAccount: "true" } }, [
        el("strong", { text: "이미 가입되어 있는 이메일입니다." }),
        el("p", { className: "small subtle", text: "기존 계정으로 로그인해 주세요. 비밀번호를 잊으셨다면 비밀번호 찾기를 통해 다시 설정할 수 있어요." }),
        el("div", { className: "form-actions signup-actions" }, [
          el("a", { className: "button button--ghost", href: "#/login", text: "로그인하기" }),
          el("a", { className: "button button--text", href: "#/forgot-password", text: "비밀번호 찾기" }),
        ]),
      ])
      : null;

    const codeInput = el("input", { id: "signup-code", name: "verification_code", type: "text", inputmode: "numeric", autocomplete: "one-time-code", maxlength: "6", pattern: "[0-9]{6}", placeholder: "6자리 인증번호" });
    const timer = el("p", { className: "field-help", "aria-live": "polite" });
    const codeArea = codeRequested && !isVerified ? el("div", { className: "field" }, [
      el("label", { className: "required", for: "signup-code", text: "인증번호" }),
      el("div", { className: "signup-code-row" }, [codeInput, el("button", { className: "button button--coral", type: "button", text: "인증확인", onclick: () => verifyCode(codeInput) })]),
      timer,
      el("p", { className: "field-help", text: "인증을 완료하기 전에는 이메일을 변경할 수 없습니다." }),
      errorLine("verification_code"),
    ]) : null;

    const memberChildren = [emailField, existingAccountNotice, codeArea];
    if (isVerified) {
      memberChildren.push(
        el("p", { className: "signup-verified", text: "✓ 이메일 인증이 완료되었습니다. 이제 비밀번호와 회원 정보를 입력해 주세요." }),
        fields.password.root,
        fields.password_confirm.root,
      );
    }
    memberChildren.push(
      fields.display_name.root,
      fields.real_name.root,
      fields.birth_date.root,
      fields.church_group.root,
      fields.request_message.root,
      actionButtons(),
    );
    panel.replaceChildren(...memberChildren.filter(Boolean));

    const tick = () => {
      const currentEmail = fields.email.input.value.trim().toLowerCase();
      const currentVerified = Boolean(verifiedEmail && verifiedEmail === currentEmail);
      if (!codeRequested && !currentVerified) resendAt = getStoredOtpResendAt(currentEmail);
      const resendLeft = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
      emailButton.disabled = currentVerified || resendLeft > 0;
      emailButton.textContent = currentVerified ? "인증 완료" : codeRequested
        ? resendLeft > 0 ? `재전송 (${resendLeft}초)` : "재전송"
        : resendLeft > 0 ? `인증번호 받기 (${resendLeft}초)` : "인증번호 받기";
      resendNotice.textContent = !codeRequested && !currentVerified && resendLeft > 0
        ? `이전에 인증번호를 요청했습니다. 재전송까지 ${resendLeft}초 남음`
        : "";
      if (codeArea) {
        const left = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
        timer.textContent = left
          ? `남은 시간 ${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}${resendLeft > 0 ? ` · 재전송까지 ${resendLeft}초 남음` : " · 재전송할 수 있어요."}`
          : "인증번호가 만료되었을 수 있습니다. 재전송해 주세요.";
      }
    };
    refreshResendCooldown = tick;
    tick();
    timerId = setInterval(() => {
      if (!form.isConnected) {
        clearInterval(timerId);
        timerId = null;
        refreshResendCooldown = null;
        return;
      }
      tick();
    }, 1000);
  }

  async function sendCode() {
    clearFieldErrors(form);
    const email = fields.email.input.value.trim().toLowerCase();
    if (!validateEmail(email)) return setFieldError(form, "email", "올바른 이메일 주소를 입력해 주세요.");
    if (!codeRequested) resendAt = getStoredOtpResendAt(email);
    const resendLeft = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
    if (resendLeft > 0) return setFieldError(form, "email", `재전송까지 ${resendLeft}초 남았습니다.`);
    setBusy(form, true, "인증번호를 보내고 있어요…");
    try {
      if (codeRequested) await resendSignupEmailCode(email);
      else await requestSignupEmailCode(email);
      existingAccountEmail = "";
      codeRequested = true;
      const requestedAt = Date.now();
      expiresAt = requestedAt + OTP_TTL_MS;
      resendAt = requestedAt + OTP_RESEND_MS;
      persistOtpResendAt(email, resendAt);
      showToast("인증번호를 이메일로 보냈습니다.", "success");
      renderStep();
    } catch (error) {
      if (error?.code === "signup_email_registered") {
        existingAccountEmail = email;
        codeRequested = false;
        expiresAt = 0;
        resendAt = 0;
        clearStoredOtpResendAt(email);
        renderStep();
        return;
      }
      showToast(getErrorMessage(error), "error");
    } finally { setBusy(form, false); }
  }

  async function verifyCode(input) {
    clearFieldErrors(form);
    if (!/^\d{6}$/.test(input.value)) return setFieldError(form, "verification_code", "6자리 숫자를 입력해 주세요.");
    setBusy(form, true, "인증번호를 확인하고 있어요…");
    try {
      const email = fields.email.input.value.trim().toLowerCase();
      await verifySignupEmailCode(email, input.value);
      verifiedEmail = email;
      codeRequested = false;
      expiresAt = 0;
      resendAt = 0;
      // Keep the last-send cooldown persisted until its natural 60-second expiry.
      // If the browser closes immediately after verification, Supabase may still reject a new OTP request.
      renderStep();
    } catch (error) { setFieldError(form, "verification_code", getErrorMessage(error)); }
    finally { setBusy(form, false); }
  }

  function renderReview() {
    const birthDate = getBirthDateValue(fields.birth_date);
    panel.replaceChildren(
      el("p", { className: "page-description", text: "가입 정보를 확인해 주세요. 비밀번호 원문은 표시하지 않습니다." }),
      reviewSection("회원 정보", () => goTo(2), [
        ["이메일", fields.email.input.value],
        ["이메일 인증", verifiedEmail ? "인증 완료" : "미완료"],
        ["비밀번호", "설정됨"],
        ["닉네임", fields.display_name.input.value],
        ["실명", fields.real_name.input.value],
        ["출생연월일", formatBirthDate(birthDate)],
        ["소속 공동체·부서", fields.church_group.input.value],
      ]),
      reviewSection("가입 신청", () => goTo(2), [["가입 신청 내용", fields.request_message.input.value]]),
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
      required(fields.church_group, "소속 공동체·부서를 입력해 주세요.");
      required(fields.request_message, "가입 신청 내용을 입력해 주세요.");
      if (!validateEmail(fields.email.input.value)) { setFieldError(form, "email", "올바른 이메일 주소를 입력해 주세요."); valid = false; }
      if (!verifiedEmail || verifiedEmail !== fields.email.input.value.trim().toLowerCase()) { setFieldError(form, "email", "이메일 인증을 완료해 주세요."); valid = false; }
      if (!validatePassword(fields.password.input.value)) { setFieldError(form, "password", "비밀번호는 8자 이상 입력해 주세요."); valid = false; }
      if (fields.password.input.value !== fields.password_confirm.input.value) { setFieldError(form, "password_confirm", "비밀번호가 일치하지 않습니다."); valid = false; }
      if (!valueInRange(fields.display_name.input.value, 1, 50)) { setFieldError(form, "display_name", "닉네임은 1~50자로 입력해 주세요."); valid = false; }
      if (!valueInRange(fields.real_name.input.value, 1, 50)) { setFieldError(form, "real_name", "실명은 1~50자로 입력해 주세요."); valid = false; }
      const birthDate = getBirthDateValue(fields.birth_date);
      const today = localDateText();
      if (!birthDate || !validateBirthDate(birthDate) || birthDate > today) {
        setBirthDateError(fields.birth_date, "올바른 출생연월일을 선택해 주세요.");
        valid = false;
      }
      if (!valueInRange(fields.request_message.input.value, 1, 1000)) { setFieldError(form, "request_message", "가입 신청 내용은 1~1,000자로 입력해 주세요."); valid = false; }
    }
    return valid;
  }

  function nextStep() {
    if (!validateStep(step)) return;
    goTo(step + 1);
  }

  function goTo(next) { step = next; renderStep(); heading.focus(); }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    for (const targetStep of [1, 2]) {
      if (!validateStep(targetStep)) {
        goTo(targetStep);
        showToast("필수 정보를 다시 확인해 주세요.", "error");
        return;
      }
    }

    const password = fields.password.input.value;
    if (password !== appliedPassword) {
      setBusy(form, true, "비밀번호를 설정하고 있어요…");
      try {
        await updatePassword(password);
        appliedPassword = password;
      } catch (error) {
        setBusy(form, false);
        goTo(2);
        setFieldError(form, "password", getErrorMessage(error));
        return;
      }
      setBusy(form, false);
    }

    setBusy(form, true, "가입 신청을 처리하고 있어요…");
    try {
      await submitSignupApplication({
        display_name: fields.display_name.input.value.trim(),
        real_name: fields.real_name.input.value.trim(),
        birth_date: getBirthDateValue(fields.birth_date),
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
    el("div", { className: "page-stack" }, [el("div", {}, [el("p", { className: "eyebrow", text: "JOIN THE COMMUNITY" }), el("h1", { className: "page-title", text: "함께할 준비가 되었나요?" }), el("p", { className: "page-description", text: "이메일 인증과 회원 정보 확인 후 관리자 승인을 요청합니다." })]), form]),
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
function birthDateField(currentYear) {
  const year = el("select", { id: "signup-birth-year", name: "birth_year", required: true, "aria-label": "출생연도" }, [
    el("option", { value: "", text: "연도" }),
    ...Array.from({ length: currentYear - 1899 }, (_, index) => {
      const value = String(currentYear - index);
      return el("option", { value, text: `${value}년` });
    }),
  ]);
  const month = el("select", { id: "signup-birth-month", name: "birth_month", required: true, "aria-label": "출생월" }, [
    el("option", { value: "", text: "월" }),
    ...Array.from({ length: 12 }, (_, index) => el("option", { value: String(index + 1), text: `${index + 1}월` })),
  ]);
  const day = el("select", { id: "signup-birth-day", name: "birth_day", required: true, "aria-label": "출생일" }, [
    el("option", { value: "", text: "일" }),
    ...Array.from({ length: 31 }, (_, index) => el("option", { value: String(index + 1), text: `${index + 1}일` })),
  ]);
  const error = errorLine("birth_date");
  return {
    year,
    month,
    day,
    error,
    root: el("div", { className: "field" }, [
      el("label", { className: "required", for: year.id, text: "출생연월일" }),
      el("div", { className: "signup-birth-date-row", style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: ".5rem" } }, [year, month, day]),
      error,
    ]),
  };
}
function getBirthDateValue(item) {
  const year = item.year.value;
  const month = item.month.value.padStart(2, "0");
  const day = item.day.value.padStart(2, "0");
  return year && item.month.value && item.day.value ? `${year}-${month}-${day}` : "";
}
function setBirthDateError(item, message = "") {
  [item.year, item.month, item.day].forEach((input) => input.setAttribute("aria-invalid", message ? "true" : "false"));
  item.error.textContent = message;
  return !message;
}
function localDateText() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function formatBirthDate(value) {
  if (!value) return "-";
  const [year, month, day] = value.split("-").map(Number);
  return `${year}년 ${month}월 ${day}일`;
}
function checkbox(name, label, required, help = "") {
  const input = el("input", { type: "checkbox", name, value: "true", required });
  return { input, root: el("div", { className: "field" }, [el("label", { className: "checkbox" }, [input, el("span", {}, [el("strong", { text: `${label}${required ? " (필수)" : ""}` }), help ? el("span", { className: "small subtle", text: ` ${help}` }) : null])]), errorLine(name)]) };
}
function agreement(item, summary, lines) { return el("div", { className: "agreement-item" }, [item.root, el("details", {}, [el("summary", { text: summary }), el("ul", {}, lines.map((text) => el("li", { text })))])]); }
function reviewSection(title, onEdit, rows) { return el("section", { className: "signup-review" }, [el("div", { className: "signup-review__head" }, [el("h3", { text: title }), el("button", { type: "button", className: "button button--text", text: "수정", onclick: onEdit })]), el("dl", {}, rows.flatMap(([term, value]) => [el("dt", { text: term }), el("dd", { text: value || "-" })]))]); }
