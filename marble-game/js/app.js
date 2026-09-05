import { listThemes, requireTheme } from "./themes/themeRegistry.js";

const themeGrid = document.querySelector("[data-theme-grid]");
const themeTitle = document.querySelector("[data-theme-title]");
const themeName = document.querySelector("[data-theme-name]");
const themeDescription = document.querySelector("[data-theme-description]");
const themeFeatures = document.querySelector("[data-theme-features]");
const themeStatus = document.querySelector("[data-theme-status]");
const foundationNote = document.querySelector("[data-foundation-note]");

let selectedThemeId = "classic";

function statusLabel(theme) {
  if (theme.status === "core") return "CORE READY";
  if (theme.status === "foundation") return "FOUNDATION";
  return "PLANNED";
}

function renderThemeCards() {
  themeGrid.replaceChildren();
  listThemes().forEach((theme) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-card";
    button.dataset.themeId = theme.id;
    button.setAttribute("aria-pressed", String(theme.id === selectedThemeId));
    button.innerHTML = `
      <span class="theme-card__icon" aria-hidden="true">${theme.icon}</span>
      <span class="theme-card__copy">
        <span class="theme-card__eyebrow">${theme.name.toUpperCase()}</span>
        <strong>${theme.title}</strong>
        <span>${theme.description}</span>
      </span>
      <span class="theme-card__status">${statusLabel(theme)}</span>
    `;
    themeGrid.append(button);
  });
}

function renderSelectedTheme() {
  const theme = requireTheme(selectedThemeId);
  document.body.dataset.theme = theme.id;
  themeName.textContent = theme.name.toUpperCase();
  themeTitle.textContent = theme.title;
  themeDescription.textContent = theme.description;
  themeStatus.textContent = statusLabel(theme);
  themeFeatures.replaceChildren(...theme.highlights.map((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    return item;
  }));

  foundationNote.textContent = theme.playable
    ? "Classic 핵심 규칙 엔진이 준비되었습니다. 다음 단계에서 이 상태 데이터를 3D 보드 프로토타입에 연결합니다."
    : "테마 구조는 등록되어 있으며 공통 엔진 검증 이후 차례대로 구현합니다.";

  themeGrid.querySelectorAll("[data-theme-id]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeId === selectedThemeId));
  });
}

themeGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-theme-id]");
  if (!button) return;
  selectedThemeId = button.dataset.themeId;
  renderSelectedTheme();
});

renderThemeCards();
renderSelectedTheme();
