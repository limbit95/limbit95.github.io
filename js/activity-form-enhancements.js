const FORM_SELECTOR = ".activity-form";
const NOTICE_SELECTOR = ".activity-form-notice";
const DESCRIPTION_SELECTOR = ".activity-form-page-header .page-description";

function mapSearchUrl(provider, query) {
  if (provider === "naver") {
    return query
      ? `https://map.naver.com/p/search/${encodeURIComponent(query)}`
      : "https://map.naver.com/";
  }
  return query
    ? `https://map.kakao.com/link/search/${encodeURIComponent(query)}`
    : "https://map.kakao.com/";
}

function openMapSearch(provider, query) {
  window.open(mapSearchUrl(provider, query), "_blank", "noopener,noreferrer");
}

function createMapShortcut(provider, form) {
  const label = provider === "naver" ? "네이버 지도에서 장소 검색" : "카카오맵에서 장소 검색";
  const button = document.createElement("button");
  button.type = "button";
  button.className = `activity-form__map-shortcut activity-form__map-shortcut--${provider}`;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.addEventListener("click", () => {
    const query = form.elements.location_name?.value?.trim() ?? "";
    openMapSearch(provider, query);
  });
  return button;
}

function preventImplicitEnterSubmit(form) {
  if (form.dataset.enterSubmitGuard === "true") return;
  form.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.isComposing) return;
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (["checkbox", "radio", "hidden", "button", "submit", "reset"].includes(target.type)) return;
    event.preventDefault();
    if (target.name !== "location_name" || event.repeat) return;
    const query = target.value.trim();
    if (query) openMapSearch("naver", query);
  });
  form.dataset.enterSubmitGuard = "true";
}

function customizeDeadlineValidation(form) {
  if (form.dataset.deadlineValidationEnhanced === "true") return;
  form.addEventListener("submit", () => {
    const deadline = form.elements.registration_deadline;
    const valueText = form.querySelector("#event-registration_deadline-trigger .activity-picker-trigger__value");
    const dateSelectedWithoutTime = !deadline?.value && valueText?.textContent?.includes("· 시간 선택");
    if (!dateSelectedWithoutTime) return;
    queueMicrotask(() => {
      const error = form.querySelector('[data-error-for="registration_deadline"]');
      deadline.setAttribute("aria-invalid", "true");
      if (error) error.textContent = "마감 시간을 선택해 주세요.";
    });
  }, true);
  form.dataset.deadlineValidationEnhanced = "true";
}

function enhanceActivityForm(form) {
  const page = form.parentElement;
  page?.querySelector(NOTICE_SELECTOR)?.remove();
  page?.querySelector(DESCRIPTION_SELECTOR)?.remove();
  preventImplicitEnterSubmit(form);
  customizeDeadlineValidation(form);

  const mapInput = form.elements.location_url;
  if (!mapInput || mapInput.dataset.mapShortcutsEnhanced === "true") return;

  const field = mapInput.closest(".activity-form__field");
  if (!field) return;

  const row = document.createElement("div");
  row.className = "activity-form__map-link-row";
  mapInput.replaceWith(row);
  row.append(
    mapInput,
    createMapShortcut("naver", form),
    createMapShortcut("kakao", form),
  );
  field.classList.add("activity-form__map-link-field");
  mapInput.dataset.mapShortcutsEnhanced = "true";
}

function enhanceForms(root = document) {
  if (root instanceof Element && root.matches(FORM_SELECTOR)) enhanceActivityForm(root);
  root.querySelectorAll?.(FORM_SELECTOR).forEach(enhanceActivityForm);
}

const app = document.getElementById("app");
if (app) {
  enhanceForms(app);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) enhanceForms(node);
      });
    }
  });
  observer.observe(app, { childList: true, subtree: true });
}
