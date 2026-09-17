import {
  createClassicThreePrototypeRenderer as createBaseClassicThreePrototypeRenderer,
} from "./threeClassicPerformanceEntry.js?v=20260917-r5-base";
import { createClassicTileInfo } from "../tileInfo.js?v=20260912-r21";

export * from "./threeClassicPerformanceEntry.js?v=20260917-r5-base";

function findPlayer(state, playerId) {
  return state?.players?.find?.((player) => player.id === playerId) ?? null;
}

function isViewerPlayer(documentObject, state, playerId) {
  const player = findPlayer(state, playerId);
  if (!player) return false;
  const viewerCard = documentObject?.querySelector?.('.player-hud-card[data-viewer="true"]');
  return Boolean(viewerCard && Number(viewerCard.dataset.seat) === Number(player.seat));
}

function openCostTileModal(documentObject, state, event) {
  if (event?.type !== "TILE_LANDED" || event?.tileType !== "TAX") return;
  if (!isViewerPlayer(documentObject, state, event.playerId)) return;

  const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
  if (!modal || modal.open || modal.hasAttribute?.("open")) return;

  const info = createClassicTileInfo(state, event.nodeId);
  if (!info) return;

  const type = documentObject.querySelector?.("[data-tile-info-type]");
  const title = documentObject.querySelector?.("[data-tile-info-title]");
  const summary = documentObject.querySelector?.("[data-tile-info-summary]");
  const stats = documentObject.querySelector?.("[data-tile-info-stats]");
  const effect = documentObject.querySelector?.("[data-tile-info-effect]");
  const confirm = documentObject.querySelector?.("[data-tile-info-confirm]");
  const decline = documentObject.querySelector?.("[data-tile-info-decline]");
  const action = documentObject.querySelector?.("[data-tile-info-action]");
  if (!type || !title || !summary || !stats || !effect) return;

  type.textContent = info.typeLabel;
  title.textContent = info.title;
  summary.textContent = info.summary;
  effect.textContent = info.effect;
  stats.replaceChildren(...info.stats.map(({ label, value }) => {
    const row = documentObject.createElement("div");
    const term = documentObject.createElement("dt");
    const description = documentObject.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    return row;
  }));

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

export function createClassicThreePrototypeRenderer(options = {}, runtime = {}) {
  const documentObject = runtime.documentObject ?? globalThis.document;
  const windowObject = runtime.windowObject ?? globalThis.window;
  const renderer = createBaseClassicThreePrototypeRenderer(options, runtime);
  let latestState = null;
  let costModalTimer = null;

  function scheduleCostTileModal(event) {
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    if (typeof setTimeoutFn !== "function") {
      openCostTileModal(documentObject, latestState, event);
      return;
    }
    const clearTimeoutFn = windowObject?.clearTimeout ?? globalThis.clearTimeout;
    if (costModalTimer !== null) clearTimeoutFn?.(costModalTimer);
    costModalTimer = setTimeoutFn(() => {
      costModalTimer = null;
      openCostTileModal(documentObject, latestState, event);
    }, 0);
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
