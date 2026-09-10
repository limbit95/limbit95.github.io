export function normalizeText(value) {
  return String(value ?? "").trim();
}

export function validateEmail(value) {
  const email = normalizeText(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(value) {
  return typeof value === "string" && value.length >= 8;
}

export function validateBirthYear(value) {
  if (value === "" || value == null) return true;
  const year = Number(value);
  return Number.isInteger(year) && year >= 1900 && year <= 2100;
}

export function validateBirthDate(value) {
  const text = normalizeText(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const [year, month, day] = text.split("-").map(Number);
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day;
}

export function validateUrl(value) {
  const text = normalizeText(value);
  if (!text) return true;
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function valueInRange(value, min, max) {
  const length = normalizeText(value).length;
  return length >= min && length <= max;
}

export function setFieldError(form, name, message = "") {
  const field = form.elements.namedItem(name);
  const error = form.querySelector(`[data-error-for="${CSS.escape(name)}"]`);
  if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
  if (error) error.textContent = message;
  return !message;
}

export function clearFieldErrors(form) {
  form.querySelectorAll("[data-error-for]").forEach((node) => {
    node.textContent = "";
  });
  Array.from(form.elements).forEach((field) => {
    if (field instanceof HTMLElement) field.removeAttribute("aria-invalid");
  });
}

export function validateRequiredFields(form, names) {
  let valid = true;
  names.forEach((name) => {
    const field = form.elements.namedItem(name);
    const value = field instanceof RadioNodeList ? field.value : field?.value;
    if (!normalizeText(value)) {
      setFieldError(form, name, "필수 입력 항목입니다.");
      valid = false;
    }
  });
  return valid;
}
