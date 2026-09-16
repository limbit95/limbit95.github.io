import * as THREE from "three";
import { installClassicShadowUpdatePolicy } from "./threeClassicPrototypeDiagnostics.js?v=20260915-r1";
import * as presentationTiming from "./threeClassicPresentationTiming.js?v=20260916-r1";

installClassicShadowUpdatePolicy(THREE);

export * from "./threeClassicPresentationTiming.js?v=20260916-r1";

function isLocalPresentationMode(documentObject) {
  const mode = documentObject?.body?.dataset?.marbleBootstrapMode;
  return mode === "local-play" || mode === "full";
}

function markLocalPresentationViewer(documentObject, state, playerId) {
  if (!isLocalPresentationMode(documentObject) || !playerId) return;
  const player = state?.players?.find?.((candidate) => candidate.id === playerId);
  if (!player) return;

  documentObject?.querySelectorAll?.('.player-hud-card[data-viewer="true"]')
    .forEach((card) => delete card.dataset.viewer);
  const card = documentObject?.querySelector?.(`.player-hud-card[data-seat="${Number(player.seat) || 0}"]`);
  if (card?.dataset) card.dataset.viewer = "true";
}

function preserveChoiceTransferLayer(documentObject) {
  const layer = documentObject?.querySelector?.("[data-tile-info-modal] .money-transfer-layer");
  if (!layer || !documentObject?.body?.append) return;
  documentObject.body.append(layer);
}

export function createClassicThreePrototypeRenderer(options = {}, runtime = {}) {
  const documentObject = runtime.documentObject ?? globalThis.document;
  const renderer = presentationTiming.createClassicThreePrototypeRenderer(options, runtime);
  let latestState = null;
  let choiceActionButton = null;

  return Object.freeze({
    async mount(targetElement) {
      const value = await renderer.mount(targetElement);
      choiceActionButton = documentObject?.querySelector?.("[data-tile-info-action]") ?? null;
      choiceActionButton?.addEventListener?.("click", () => preserveChoiceTransferLayer(documentObject), true);
      return value;
    },

    renderState(state) {
      latestState = state;
      const value = renderer.renderState(state);
      const currentPlayer = state?.currentPlayerIndex === null || state?.currentPlayerIndex === undefined
        ? null
        : state?.players?.[Number(state.currentPlayerIndex)] ?? null;
      markLocalPresentationViewer(documentObject, state, currentPlayer?.id);
      return value;
    },

    playEvent(event) {
      markLocalPresentationViewer(documentObject, latestState, event?.playerId);
      return renderer.playEvent(event);
    },

    dispose() {
      choiceActionButton = null;
      latestState = null;
      renderer.dispose();
    },
  });
}
