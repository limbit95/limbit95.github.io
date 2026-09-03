const FORM_SELECTOR = ".activity-form";
const NOTICE_SELECTOR = ".activity-form-notice";

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

function createMapShortcut(provider, form) {
  const label = provider === "naver" ? "네이버 지도에서 장소 검색" : "카카오맵에서 장소 검색";
  const button = document.createElement("button");
  button.type = "button";
  button.className = `activity-form__map-shortcut activity-form__map-shortcut--${provider}`;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.addEventListener("click", () => {
    const query = form.elements.location_name?.value?.trim() ?? "";
    window.open(mapSearchUrl(provider, query), "_blank", "noopener,noreferrer");
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
  });
  form.dataset.enterSubmitGuard = "true";
}

function enhanceActivityForm(form) {
  const page = form.parentElement;
  page?.querySelector(NOTICE_SELECTOR)?.remove();
  preventImplicitEnterSubmit(form);

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
