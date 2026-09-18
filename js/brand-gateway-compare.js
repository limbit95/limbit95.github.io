export const BRAND_GATEWAY_VARIANTS = Object.freeze([
  {
    id: "gateway-c",
    label: "C",
    branch: "feature/brand-gateway-c-20260916",
    commit: "c554fd8858a260ab91d130a07e0263a5c256d60e",
  },
  {
    id: "gateway-ab",
    label: "AB",
    branch: "feature/brand-gateway-ab-20260917",
    commit: "3a9b68e701581c5e367c0c2529ec0449add75a22",
  },
  {
    id: "gateway-h",
    label: "H",
    branch: "feature/brand-gateway-h-20260917",
    commit: "87d7e03f7de34965b16cda7dd938714bf63a92de",
  },
  {
    id: "gateway-o",
    label: "O",
    branch: "feature/brand-gateway-o-20260917",
    commit: "20f9486903d75af3b8f05e512cd39e9557b26133",
  },
  {
    id: "gateway-p",
    label: "P",
    branch: "feature/brand-gateway-p-20260917",
    commit: "0ee1c7b83f8c31df36955a1f13d2441562e15a03",
  },
  {
    id: "gateway-r",
    label: "R",
    branch: "feature/brand-gateway-r-20260917",
    commit: "723b85bf6c1ae199f9f6cf22ecf68db8ec2783a7",
  },
  {
    id: "gateway-ac",
    label: "AC",
    branch: "feature/brand-gateway-ac-20260917",
    commit: "abfe041cdc5ab00a79d76b5617df6431a2f5cd9b",
  },
  {
    id: "gateway-ad",
    label: "AD",
    branch: "feature/brand-gateway-ad-20260917",
    commit: "b876f9dbf0b1d175d8f3ab715d280a7c3cd4651e",
  },
  {
    id: "gateway-ae",
    label: "AE",
    branch: "feature/brand-gateway-ae-20260918",
    commit: "48fcb21e00a3d636baf39c6327be74a4e9c74834",
  },
]);

const RAW_ROOT = "https://raw.githubusercontent.com/limbit95/limbit95.github.io";
const VIEWPORT_HEIGHTS = new Map([
  [1440, 1100],
  [1024, 900],
  [390, 900],
]);
const assetCache = new Map();
const previewObjectUrls = new Set();

function variantById(id) {
  return BRAND_GATEWAY_VARIANTS.find((variant) => variant.id === id) ?? BRAND_GATEWAY_VARIANTS[0];
}

function escapeInlineScript(source) {
  return source.replace(/<\/script/gi, "<\\/script");
}

function escapeInlineStyle(source) {
  return source.replace(/<\/style/gi, "<\\/style");
}

function rewriteAssetReferences(source, variant) {
  const assetRoot = `${RAW_ROOT}/${variant.commit}/assets/`;
  return source
    .replace(/(["'])(?:\.{1,2}\/|\/)?assets\//g, `$1${assetRoot}`)
    .replace(/url\(\s*(?!["'])(?:\.{1,2}\/|\/)?assets\//g, `url(${assetRoot}`);
}

function buildPreviewGuardScript() {
  return `(() => {
    const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/value", "/together"]);
    let lastPublicHash = PUBLIC_ROUTES.has(routePath(window.location.hash)) ? window.location.hash : "#/gateway";

    function routePath(hash) {
      const raw = String(hash || "#/gateway").replace(/^#/, "") || "/gateway";
      return ("/" + raw.split("?")[0]).replace(/\\/+/g, "/").replace(/\\/$/, "") || "/";
    }

    function showBlockedNotice() {
      let notice = document.getElementById("brand-compare-route-notice");
      if (!notice) {
        notice = document.createElement("div");
        notice.id = "brand-compare-route-notice";
        notice.setAttribute("role", "status");
        Object.assign(notice.style, {
          position: "fixed",
          left: "50%",
          bottom: "20px",
          zIndex: "2147483647",
          transform: "translateX(-50%)",
          maxWidth: "min(560px, calc(100% - 32px))",
          padding: "12px 16px",
          border: "1px solid rgba(20, 28, 24, .22)",
          borderRadius: "999px",
          background: "rgba(255, 253, 248, .96)",
          color: "#1c2420",
          boxShadow: "0 12px 36px rgba(20, 28, 24, .14)",
          font: "700 12px/1.4 Pretendard, system-ui, sans-serif",
          textAlign: "center",
          pointerEvents: "none",
        });
        document.body.append(notice);
      }
      notice.textContent = "실제 청파 같이 서비스로 들어가는 버튼은 비교 화면에서는 이동을 막았습니다.";
      window.clearTimeout(window.__brandCompareNoticeTimer);
      window.__brandCompareNoticeTimer = window.setTimeout(() => notice.remove(), 2200);
    }

    document.addEventListener("click", (event) => {
      const anchor = event.target.closest?.("a[href^='#/']");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (PUBLIC_ROUTES.has(routePath(href))) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      showBlockedNotice();
    }, true);

    window.addEventListener("hashchange", (event) => {
      const path = routePath(window.location.hash);
      if (PUBLIC_ROUTES.has(path)) {
        lastPublicHash = window.location.hash || "#/gateway";
        return;
      }
      window.history.replaceState(null, "", lastPublicHash || "#/gateway");
      event.stopImmediatePropagation();
      showBlockedNotice();
    });
  })();`;
}

export function buildPreviewDocument({ css, js }, variant) {
  const resetHref = new URL("./css/reset.css", window.location.href).href;
  const variablesHref = new URL("./css/variables.css", window.location.href).href;
  const rewrittenCss = rewriteAssetReferences(css, variant);
  const rewrittenJs = rewriteAssetReferences(js, variant);
  const guardScript = buildPreviewGuardScript();

  return `<!doctype html>
<html lang="ko" data-brand-public="true">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f3f1ea">
    <link rel="stylesheet" href="${resetHref}">
    <link rel="stylesheet" href="${variablesHref}">
    <style>${escapeInlineStyle(rewrittenCss)}</style>
  </head>
  <body>
    <button class="skip-link" id="skip-link" type="button">본문으로 바로가기</button>
    <div id="brand-gateway-root"></div>
    <div id="app"></div>
    <div id="toast-region"></div>
    <div id="modal-root"></div>
    <script>${escapeInlineScript(guardScript)}<\/script>
    <script>${escapeInlineScript(rewrittenJs)}<\/script>
  </body>
</html>`;
}

async function fetchVariantAssets(variant, { force = false } = {}) {
  if (!force && assetCache.has(variant.commit)) return assetCache.get(variant.commit);

  const base = `${RAW_ROOT}/${variant.commit}`;
  const request = Promise.all([
    fetch(`${base}/css/brand-gateway.css`, { credentials: "omit", cache: force ? "reload" : "force-cache" }),
    fetch(`${base}/js/brand-gateway.js`, { credentials: "omit", cache: force ? "reload" : "force-cache" }),
  ]).then(async ([cssResponse, jsResponse]) => {
    if (!cssResponse.ok || !jsResponse.ok) {
      throw new Error(`원본 시안 자산을 불러오지 못했습니다. CSS ${cssResponse.status} / JS ${jsResponse.status}`);
    }
    const [css, js] = await Promise.all([cssResponse.text(), jsResponse.text()]);
    return { css, js };
  });

  assetCache.set(variant.commit, request);
  try {
    return await request;
  } catch (error) {
    assetCache.delete(variant.commit);
    throw error;
  }
}

function updateQuery(state) {
  const params = new URLSearchParams(window.location.search);
  params.set("a", state.primary);
  if (state.mode === "compare") {
    params.set("mode", "compare");
    params.set("b", state.secondary);
  } else {
    params.delete("mode");
    params.delete("b");
  }
  params.set("width", String(state.width));
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
}

function readInitialState() {
  const params = new URLSearchParams(window.location.search);
  const ids = new Set(BRAND_GATEWAY_VARIANTS.map((variant) => variant.id));
  const requestedWidth = Number(params.get("width"));
  const width = VIEWPORT_HEIGHTS.has(requestedWidth) ? requestedWidth : 1440;
  return {
    mode: params.get("mode") === "compare" ? "compare" : "single",
    primary: ids.has(params.get("a")) ? params.get("a") : BRAND_GATEWAY_VARIANTS[0].id,
    secondary: ids.has(params.get("b")) ? params.get("b") : BRAND_GATEWAY_VARIANTS[1].id,
    width,
  };
}

function setPressed(buttons, predicate) {
  buttons.forEach((button) => button.setAttribute("aria-pressed", String(predicate(button))));
}

function sizePreviewCard(card, width) {
  const previewWindow = card.querySelector(".preview-window");
  const canvas = card.querySelector(".preview-canvas");
  const iframe = card.querySelector("iframe");
  if (!previewWindow || !canvas || !iframe) return;

  const targetHeight = VIEWPORT_HEIGHTS.get(width) ?? 1100;
  const availableWidth = Math.max(1, previewWindow.clientWidth);
  const scale = Math.min(1, availableWidth / width);

  canvas.style.width = `${Math.min(width, availableWidth)}px`;
  canvas.style.height = `${Math.round(targetHeight * scale)}px`;
  iframe.style.width = `${width}px`;
  iframe.style.height = `${targetHeight}px`;
  iframe.style.transform = `translateX(-50%) scale(${scale})`;
}

function clearPreviewDocument(iframe) {
  const previousUrl = iframe.dataset.previewObjectUrl;
  if (previousUrl) {
    URL.revokeObjectURL(previousUrl);
    previewObjectUrls.delete(previousUrl);
    delete iframe.dataset.previewObjectUrl;
  }
  iframe.removeAttribute("srcdoc");
}

function setPreviewDocument(iframe, html) {
  clearPreviewDocument(iframe);
  const objectUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  previewObjectUrls.add(objectUrl);
  iframe.dataset.previewObjectUrl = objectUrl;
  iframe.src = `${objectUrl}#/gateway`;
}

async function renderIntoSlot(slot, variant, width, options = {}) {
  const card = document.querySelector(`.preview-card[data-slot="${slot}"]`);
  const iframe = document.getElementById(`${slot}-preview`);
  const title = document.getElementById(`${slot}-title`);
  const branch = document.getElementById(`${slot}-branch`);
  const status = document.getElementById(`${slot}-status`);
  if (!card || !iframe || !title || !branch || !status) return;

  title.textContent = `${variant.label} 시안`;
  branch.textContent = variant.branch;
  status.dataset.state = "loading";
  status.textContent = `불러오는 중 · ${variant.commit.slice(0, 8)}`;

  try {
    const assets = await fetchVariantAssets(variant, options);
    setPreviewDocument(iframe, buildPreviewDocument(assets, variant));
    status.dataset.state = "ready";
    status.textContent = `고정 커밋 ${variant.commit.slice(0, 8)} · ${width}px 기준 · 내부 페이지 이동 가능`;
    window.requestAnimationFrame(() => sizePreviewCard(card, width));
  } catch (error) {
    clearPreviewDocument(iframe);
    iframe.src = "about:blank";
    status.dataset.state = "error";
    status.textContent = error instanceof Error ? error.message : String(error);
  }
}

function init() {
  const state = readInitialState();
  const variantButtons = document.getElementById("variant-buttons");
  const secondaryControl = document.getElementById("secondary-control");
  const secondarySelect = document.getElementById("secondary-variant");
  const previewGrid = document.getElementById("preview-grid");
  const secondaryCard = document.querySelector('.preview-card[data-slot="secondary"]');
  const modeButtons = [...document.querySelectorAll("[data-mode]")];
  const widthButtons = [...document.querySelectorAll("[data-width]")];
  const reloadButton = document.getElementById("reload-previews");

  if (!variantButtons || !secondaryControl || !secondarySelect || !previewGrid || !secondaryCard || !reloadButton) return;

  BRAND_GATEWAY_VARIANTS.forEach((variant) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = variant.label;
    button.dataset.variant = variant.id;
    button.title = variant.branch;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      state.primary = variant.id;
      syncControls();
      renderPrimary();
    });
    variantButtons.append(button);

    const option = document.createElement("option");
    option.value = variant.id;
    option.textContent = `${variant.label} · ${variant.branch}`;
    secondarySelect.append(option);
  });

  function syncControls() {
    setPressed([...variantButtons.querySelectorAll("button")], (button) => button.dataset.variant === state.primary);
    setPressed(modeButtons, (button) => button.dataset.mode === state.mode);
    setPressed(widthButtons, (button) => Number(button.dataset.width) === state.width);
    secondarySelect.value = state.secondary;
    const comparing = state.mode === "compare";
    secondaryControl.hidden = !comparing;
    secondaryCard.hidden = !comparing;
    previewGrid.dataset.mode = state.mode;
    updateQuery(state);
    window.requestAnimationFrame(() => {
      document.querySelectorAll(".preview-card:not([hidden])").forEach((card) => sizePreviewCard(card, state.width));
    });
  }

  function renderPrimary(options) {
    return renderIntoSlot("primary", variantById(state.primary), state.width, options);
  }

  function renderSecondary(options) {
    if (state.mode !== "compare") return Promise.resolve();
    return renderIntoSlot("secondary", variantById(state.secondary), state.width, options);
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode === "compare" ? "compare" : "single";
      syncControls();
      if (state.mode === "compare") renderSecondary();
    });
  });

  widthButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const width = Number(button.dataset.width);
      if (!VIEWPORT_HEIGHTS.has(width)) return;
      state.width = width;
      syncControls();
      renderPrimary();
      renderSecondary();
    });
  });

  secondarySelect.addEventListener("change", () => {
    state.secondary = variantById(secondarySelect.value).id;
    syncControls();
    renderSecondary();
  });

  reloadButton.addEventListener("click", async () => {
    reloadButton.disabled = true;
    reloadButton.textContent = "다시 불러오는 중…";
    try {
      await Promise.all([renderPrimary({ force: true }), renderSecondary({ force: true })]);
    } finally {
      reloadButton.disabled = false;
      reloadButton.textContent = "미리보기 다시 불러오기";
    }
  });

  const resizeObserver = new ResizeObserver(() => {
    document.querySelectorAll(".preview-card:not([hidden])").forEach((card) => sizePreviewCard(card, state.width));
  });
  document.querySelectorAll(".preview-window").forEach((node) => resizeObserver.observe(node));

  window.addEventListener("beforeunload", () => {
    previewObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    previewObjectUrls.clear();
  });

  syncControls();
  renderPrimary();
  renderSecondary();
}

if (typeof document !== "undefined") {
  init();
}