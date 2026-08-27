import { getAuthState, initializeAuth } from "../../js/auth.js";
import { supabase } from "../../js/supabaseClient.js";

const CARD_BUCKET = "splendor-card-assets";
const SIGNED_URL_EXPIRES_IN = 15 * 60;
const signedUrls = new Map();
let observer = null;
let enhanceQueued = false;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAccessState({ title, message, actionHref = "../", actionText = "사이트로 돌아가기" }) {
  const app = document.querySelector("#app");
  if (!app) return;
  app.innerHTML = `
    <section class="surface splendor-access-state">
      <div class="splendor-access-state__icon" aria-hidden="true">🔐</div>
      <p class="eyebrow">PRIVATE GAME AREA</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      <a class="button button--primary" href="${actionHref}">${escapeHtml(actionText)}</a>
    </section>
  `;
  app.classList.remove("is-auth-pending");
}

function visualMeta(card) {
  return {
    key: card.dataset.cardKey || card.dataset.cardId || "card",
    tier: Number(card.dataset.cardTier || 1),
    bonus: card.dataset.cardBonus || "blue",
    title: card.dataset.cardTitle || "개발 카드",
    imagePath: card.dataset.imagePath || "",
  };
}

function safeId(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "-");
}

function fallbackScene(meta) {
  const accent = {
    white: "#eee8d8",
    blue: "#6f9fc8",
    green: "#70a486",
    red: "#c1766e",
    black: "#7c8188",
  }[meta.bonus] ?? "#88a6b1";
  const id = safeId(meta.key);
  return `
    <svg class="dev-card__fallback-scene" viewBox="0 0 180 118" role="img" aria-label="${escapeHtml(meta.title)} 임시 카드 일러스트">
      <defs>
        <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${accent}" stop-opacity=".88" />
          <stop offset="1" stop-color="#18272d" stop-opacity=".94" />
        </linearGradient>
      </defs>
      <rect width="180" height="118" fill="url(#sky-${id})" />
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
      <span class="dev-card__fallback-title">${escapeHtml(meta.title)}</span>
      <span class="dev-card__fallback-subtitle">TEST RULESET CARD</span>
    </div>
  `;
}

async function signedUrlFor(path) {
  if (!path || !supabase) return null;
  if (signedUrls.has(path)) return signedUrls.get(path);
  const promise = supabase.storage
    .from(CARD_BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRES_IN)
    .then(({ data, error }) => {
      if (error || !data?.signedUrl) return null;
      return data.signedUrl;
    })
    .catch(() => null);
  signedUrls.set(path, promise);
  return promise;
}

async function attachPrivateImage(visual, meta) {
  if (!meta.imagePath) return;
  const url = await signedUrlFor(meta.imagePath);
  if (!url || !visual.isConnected) return;
  const image = document.createElement("img");
  image.className = "dev-card__image";
  image.src = url;
  image.alt = `${meta.title} 카드 이미지`;
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener("load", () => visual.classList.add("has-private-image"), { once: true });
  image.addEventListener("error", () => image.remove(), { once: true });
  visual.prepend(image);
}

function decorateCard(card) {
  if (card.dataset.visualEnhanced === "true") return;
  const meta = visualMeta(card);
  const top = card.querySelector(".dev-card__top");
  const tierLabel = card.querySelector(".card-tier");
  const costs = card.querySelector(".costs");
  if (!top || !tierLabel || !costs) return;

  const visual = document.createElement("div");
  visual.className = `dev-card__visual dev-card__visual--${meta.bonus}`;
  visual.innerHTML = fallbackMarkup(meta);

  const romanTier = ["", "Ⅰ", "Ⅱ", "Ⅲ"][meta.tier] ?? String(meta.tier);
  tierLabel.textContent = `${romanTier} 단계`;
  tierLabel.classList.add("dev-card__tier-badge");

  card.insertBefore(visual, tierLabel);
  card.classList.add(`dev-card--${meta.bonus}`);
  card.dataset.visualEnhanced = "true";
  void attachPrivateImage(visual, meta);
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
        message: "스플렌더 게임은 로그인한 승인 사용자만 이용할 수 있습니다.",
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

void bootstrapPrivateCardAssets();
