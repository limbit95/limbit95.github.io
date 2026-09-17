import {
  createClassicThreePrototypeRenderer as createBaseClassicThreePrototypeRenderer,
} from "./threeClassicPerformanceEntry.js?v=20260917-r8-base";
import { createClassicTileInfo } from "../tileInfo.js?v=20260912-r21";
import { CLASSIC_RULES } from "../themes/classic/rules.js";
import { formatThemeMoney } from "../themes/money.js";

export * from "./threeClassicPerformanceEntry.js?v=20260917-r8-base";

const COST_LOSS_LEAD_IN_MS = 220;
const COST_LOSS_COUNT_DOWN_MS = 1450;
const COST_LOSS_SETTLE_MS = 240;

function money(value, options = {}) {
  return formatThemeMoney(value, CLASSIC_RULES.currency, options);
}

function findPlayer(state, playerId) {
  return state?.players?.find?.((player) => player.id === playerId) ?? null;
}

function findNode(state, nodeId) {
  return state?.board?.nodes?.find?.((node) => node.id === nodeId) ?? null;
}

function isViewerPlayer(documentObject, state, playerId) {
  const player = findPlayer(state, playerId);
  if (!player) return false;
  const viewerCard = documentObject?.querySelector?.('.player-hud-card[data-viewer="true"]');
  return Boolean(viewerCard && Number(viewerCard.dataset.seat) === Number(player.seat));
}

function createLossCard(documentObject, label, value, role) {
  const card = documentObject.createElement("div");
  card.className = "payment-loss-flow__card";
  card.dataset.role = role;

  const caption = documentObject.createElement("span");
  caption.textContent = label;
  const amount = documentObject.createElement("strong");
  amount.textContent = value;
  card.append(caption, amount);
  return { card, amount };
}

function createCostLossFlow(documentObject, stats, balanceBefore, amount) {
  if (!stats?.replaceChildren || !documentObject?.createElement) return null;
  const balanceAfter = Math.max(0, balanceBefore - amount);

  const flow = documentObject.createElement("div");
  flow.className = "payment-loss-flow";
  flow.setAttribute("data-payment-loss-flow", "true");
  flow.dataset.state = "ready";

  const before = createLossCard(documentObject, "차감 전", money(balanceBefore), "before");
  const deduction = createLossCard(documentObject, "이용 비용", money(-amount, { signed: true }), "deduction");
  const remaining = createLossCard(documentObject, "남은 골드", money(balanceBefore), "remaining");

  const minus = documentObject.createElement("span");
  minus.className = "payment-loss-flow__operator";
  minus.setAttribute("aria-hidden", "true");
  minus.textContent = "−";

  const equals = documentObject.createElement("span");
  equals.className = "payment-loss-flow__operator";
  equals.setAttribute("aria-hidden", "true");
  equals.textContent = "=";

  const meter = documentObject.createElement("span");
  meter.className = "payment-loss-flow__meter";
  meter.setAttribute("aria-hidden", "true");
  const meterFill = documentObject.createElement("i");
  meter.append(meterFill);
  remaining.card.append(meter);

  flow.append(before.card, minus, deduction.card, equals, remaining.card);
  stats.replaceChildren(flow);

  return {
    flow,
    deductionHost: deduction.card,
    remainingHost: remaining.card,
    remainingElement: remaining.amount,
    meterFill,
    balanceAfter,
  };
}

function openCostTileModal(documentObject, stateBefore, event) {
  if (event?.type !== "TILE_LANDED" || event?.tileType !== "TAX") return null;
  if (!isViewerPlayer(documentObject, stateBefore, event.playerId)) return null;

  const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
  const stats = documentObject?.querySelector?.("[data-tile-info-stats]");
  const player = findPlayer(stateBefore, event.playerId);
  const node = findNode(stateBefore, event.nodeId);
  if (!modal || !stats || !player || node?.type !== "TAX") return null;

  if (!modal.open && !modal.hasAttribute?.("open")) {
    const info = createClassicTileInfo(stateBefore, event.nodeId);
    if (!info) return null;

    const type = documentObject.querySelector?.("[data-tile-info-type]");
    const title = documentObject.querySelector?.("[data-tile-info-title]");
    const summary = documentObject.querySelector?.("[data-tile-info-summary]");
    const effect = documentObject.querySelector?.("[data-tile-info-effect]");
    const confirm = documentObject.querySelector?.("[data-tile-info-confirm]");
    const decline = documentObject.querySelector?.("[data-tile-info-decline]");
    const action = documentObject.querySelector?.("[data-tile-info-action]");
    if (!type || !title || !summary || !effect) return null;

    type.textContent = info.typeLabel;
    title.textContent = info.title;
    summary.textContent = info.summary;
    effect.textContent = info.effect;
    modal.dataset.mode = "inspect";
    if (confirm) confirm.hidden = false;
    if (decline) decline.hidden = true;
    if (action) {
      action.hidden = true;
      action.disabled = false;
      action.dataset.action = "";
    }

    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
  }

  return createCostLossFlow(
    documentObject,
    stats,
    Math.max(0, Number(player.money) || 0),
    Math.max(0, Number(node.amount) || 0),
  );
}

async function animateCostLoss(windowObject, display) {
  if (!display) return;
  const reducedMotion = windowObject?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const wait = (ms) => new Promise((resolve) => (windowObject?.setTimeout ?? globalThis.setTimeout)(resolve, ms));
  const requestFrame = typeof windowObject?.requestAnimationFrame === "function"
    ? windowObject.requestAnimationFrame.bind(windowObject)
    : null;
  const fromValue = Number(String(display.remainingElement.textContent).replace(/[^0-9.-]/g, "")) || 0;
  const toValue = display.balanceAfter;

  display.flow.dataset.state = "active";
  await wait(reducedMotion ? 60 : COST_LOSS_LEAD_IN_MS);
  display.deductionHost.dataset.state = "active";
  display.remainingHost.dataset.moneyLossCounting = "true";

  if (reducedMotion || !requestFrame || fromValue === toValue) {
    display.remainingElement.textContent = money(toValue);
    display.meterFill.style.setProperty("--payment-loss-ratio", String(fromValue > 0 ? toValue / fromValue : 0));
  } else {
    await new Promise((resolve) => {
      let startedAt = null;
      function frame(timestamp) {
        if (startedAt === null) startedAt = timestamp;
        const progress = Math.min(1, Math.max(0, (timestamp - startedAt) / COST_LOSS_COUNT_DOWN_MS));
        const value = Math.round(fromValue + ((toValue - fromValue) * progress));
        display.remainingElement.textContent = money(value);
        display.meterFill.style.setProperty(
          "--payment-loss-ratio",
          String(fromValue > 0 ? Math.max(0, Math.min(1, value / fromValue)) : 0),
        );
        if (progress >= 1) resolve();
        else requestFrame(frame);
      }
      requestFrame(frame);
    });
  }

  delete display.remainingHost.dataset.moneyLossCounting;
  display.flow.dataset.state = "settled";
  await wait(reducedMotion ? 60 : COST_LOSS_SETTLE_MS);
}

export function createClassicThreePrototypeRenderer(options = {}, runtime = {}) {
  const documentObject = runtime.documentObject ?? globalThis.document;
  const windowObject = runtime.windowObject ?? globalThis.window;
  const renderer = createBaseClassicThreePrototypeRenderer(options, runtime);
  let latestState = null;
  let costModalTimer = null;

  function scheduleCostTileModal(event) {
    const stateBefore = latestState;
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    const run = () => {
      costModalTimer = null;
      const display = openCostTileModal(documentObject, stateBefore, event);
      void animateCostLoss(windowObject, display);
    };
    if (typeof setTimeoutFn !== "function") {
      run();
      return;
    }
    const clearTimeoutFn = windowObject?.clearTimeout ?? globalThis.clearTimeout;
    if (costModalTimer !== null) clearTimeoutFn?.(costModalTimer);
    costModalTimer = setTimeoutFn(run, 0);
  }

  return Object.freeze({
    async mount(targetElement) {
      return renderer.mount(targetElement);
    },

    renderState(state) {
      latestState = state;
      return renderer.renderState(state);
    },

    async playEvent(event) {
      if (event?.type === "MONEY_PAID" && event?.reason === "TAX" && !event?.creditorId) {
        return undefined;
      }

      const value = await renderer.playEvent(event);
      if (event?.type === "TILE_LANDED" && event?.tileType === "TAX") {
        scheduleCostTileModal(event);
      }
      return value;
    },

    dispose() {
      const clearTimeoutFn = windowObject?.clearTimeout ?? globalThis.clearTimeout;
      if (costModalTimer !== null) clearTimeoutFn?.(costModalTimer);
      costModalTimer = null;
      latestState = null;
      renderer.dispose();
    },
  });
}
