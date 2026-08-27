import { getAuthState, initializeAuth } from "../../js/auth.js";
import { supabase } from "../../js/supabaseClient.js";

const CARD_BUCKET = "splendor-card-assets";
const SIGNED_URL_EXPIRES_IN = 15 * 60;

const CARD_VISUAL_META = {
  "t3-1": { tier: 3, bonus: "blue", title: "왕실 교역소" },
  "t3-2": { tier: 3, bonus: "red", title: "대상인의 회관" },
  "t3-3": { tier: 3, bonus: "white", title: "보석 세공 궁전" },
  "t3-4": { tier: 3, bonus: "black", title: "귀족의 저택" },
  "t2-1": { tier: 2, bonus: "green", title: "에메랄드 공방" },
  "t2-2": { tier: 2, bonus: "black", title: "흑요석 상단" },
  "t2-3": { tier: 2, bonus: "white", title: "진주 세공소" },
  "t2-4": { tier: 2, bonus: "blue", title: "사파이어 교역소" },
  "t1-1": { tier: 1, bonus: "red", title: "루비 채굴장" },
  "t1-2": { tier: 1, bonus: "blue", title: "청옥 시장" },
  "t1-3": { tier: 1, bonus: "white", title: "백석 광산" },
  "t1-4": { tier: 1, bonus: "green", title: "녹옥 공방" },
};

const signedUrls = new Map();
let observer = null;
let enhanceQueued = false;

function cardPath(cardId) {
  return `cards/${cardId}.webp`;
}

function cardIds() {
  return Object.keys(CARD_VISUAL_META);
}

function renderAccessState({ title, message, actionHref = "../", actionText = "사이트로 돌아가기" }) {
  const app = document.querySelector("#app");
  if (!app) return;

  app.innerHTML = `
    <section class="surface splendor-access-state">
      <div class="splendor-access-state__icon" aria-hidden="true">🔐</div>
      <p class="eyebrow">PRIVATE GAME AREA</p>
      <h1>${title}</h1>
      <p>${message}</p>
      <a class="button button--primary" href="${actionHref}">${actionText}</a>
    </section>
  `;
  app.classList.remove("is-auth-pending");
}

async function loadSignedCardUrls() {
  if (!supabase) return;

  const ids = cardIds();
  const paths = ids.map(cardPath);
  const { data, error } = await supabase.storage
    .from(CARD_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_EXPIRES_IN);

  if (error || !Array.isArray(data)) {
    console.info("[splendor] private card images are not available yet", error?.message ?? "unknown error");
    return;
  }

  data.forEach((item, index) => {
    if (item?.signedUrl) signedUrls.set(ids[index], item.signedUrl);
  });
}

function fallbackScene(meta) {
  const accent = {
    white: "#eee8d8",
    blue: "#6f9fc8",
    green: "#70a486",
    red: "#c1766e",
    black: "#7c8188",
  }[meta.bonus] ?? "#88a6b1";

  return `
    <svg class="dev-card__fallback-scene" viewBox="0 0 180 118" role="img" aria-label="${meta.title} 임시 카드 일러스트">
      <defs>
        <linearGradient id="sky-${meta.bonus}-${meta.tier}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${accent}" stop-opacity=".88" />
          <stop offset="1" stop-color="#18272d" stop-opacity=".94" />
        </linearGradient>
      </defs>
      <rect width="180" height="118" fill="url(#sky-${meta.bonus}-${meta.tier})" />
      <circle cx="142" cy="28" r="17" fill="#fff6cf" fill-opacity=".66" />
      <path d="M0 89 34 62 59 80 86 46 116 76 147 57 180 82V118H0Z" fill="#17272e" fill-opacity=".54" />
      <path d="M18 95V73h17V59h19v36Zm42 0V68h22V51h19v44Zm49 0V72h17V61h20v34Z" fill="#f7e7bb" fill-opacity=".74" />
      <path d="m91 23 10 12-10 12-10-12Z" fill="#fff" fill-opacity=".88" />
      <path d="m91 28 6 7-6 7-6-7Z" fill="${accent}" />
    </svg>
  `;
}

function fallbackMarkup(meta) {
  return `
    <div class="dev-card__fallback dev-card__fallback--${meta.bonus}">
      ${fallbackScene(meta)}
      <span class="dev-card__fallback-title">${meta.title}</span>
      <span class="dev-card__fallback-subtitle">PRIVATE CARD ART</span>
    </div>
  `;
}

function decorateCard(card) {
  const cardId = card.dataset.cardId;
  const meta = CARD_VISUAL_META[cardId];
  if (!meta || card.dataset.visualEnhanced === "true") return;

  const top = card.querySelector(".dev-card__top");
  const tierLabel = card.querySelector(".card-tier");
  const costs = card.querySelector(".costs");
  if (!top || !tierLabel || !costs) return;

  const visual = document.createElement("div");
  visual.className = `dev-card__visual dev-card__visual--${meta.bonus}`;
  visual.innerHTML = fallbackMarkup(meta);

  const signedUrl = signedUrls.get(cardId);
  if (signedUrl) {
    const image = document.createElement("img");
    image.className = "dev-card__image";
    image.src = signedUrl;
    image.alt = `${meta.title} 카드 이미지`;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("load", () => visual.classList.add("has-private-image"), { once: true });
    image.addEventListener("error", () => image.remove(), { once: true });
    visual.prepend(image);
  }

  const romanTier = ["", "Ⅰ", "Ⅱ", "Ⅲ"][meta.tier] ?? String(meta.tier);
  tierLabel.textContent = `${romanTier} 단계`;
  tierLabel.classList.add("dev-card__tier-badge");

  card.insertBefore(visual, tierLabel);
  card.classList.add(`dev-card--${meta.bonus}`);
  card.dataset.visualEnhanced = "true";
}

function enhanceCards() {
  document.querySelectorAll(".dev-card[data-card-id]").forEach(decorateCard);
}

function queueEnhanceCards() {
  if (enhanceQueued) return;
  enhanceQueued = true;
  window.requestAnimationFrame(() => {
    enhanceQueued = false;
    enhanceCards();
  });
}

function startBoardObserver() {
  const app = document.querySelector("#app");
  if (!app || observer) return;

  observer = new MutationObserver(queueEnhanceCards);
  observer.observe(app, { childList: true, subtree: true });
}

async function bootstrapPrivateCardAssets() {
  try {
    await initializeAuth();
    const auth = getAuthState();

    if (!auth.isAuthenticated) {
      renderAccessState({
        title: "로그인이 필요합니다",
        message: "스플렌더 게임과 카드 이미지는 로그인한 승인 사용자만 볼 수 있습니다.",
        actionHref: "../#/login",
        actionText: "로그인하러 가기",
      });
      return;
    }

    if (!auth.isApproved) {
      renderAccessState({
        title: "승인된 사용자만 이용할 수 있습니다",
        message: "현재 계정은 스플렌더 비공개 게임 영역에 접근할 수 없습니다.",
      });
      return;
    }

    await loadSignedCardUrls();
    startBoardObserver();
    enhanceCards();
    document.querySelector("#app")?.classList.remove("is-auth-pending");
  } catch (error) {
    console.error("[splendor] failed to initialize private card assets", error);
    renderAccessState({
      title: "접근 권한을 확인하지 못했습니다",
      message: "로그인 상태나 네트워크를 확인한 뒤 다시 시도해주세요.",
      actionHref: "./",
      actionText: "다시 시도하기",
    });
  }
}

bootstrapPrivateCardAssets();
