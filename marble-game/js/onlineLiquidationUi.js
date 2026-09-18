import { getActiveOnlineClassicSession } from "./onlineSession.js?v=20260918-r11";
import { CLASSIC_RULES } from "./themes/classic/rules.js";
import { formatThemeMoney } from "./themes/money.js";

function money(value) {
  return formatThemeMoney(Number(value) || 0, CLASSIC_RULES.currency);
}

function findPlayer(state, playerId) {
  return state?.players?.find((player) => player.id === playerId) ?? null;
}

function findNode(state, nodeId) {
  return state?.board?.nodes?.find((node) => node.id === nodeId) ?? null;
}

function playerName(player) {
  return player?.name || player?.id || "플레이어";
}

function normalizeChoice(choice) {
  if (!choice || choice.type !== "DEBT_RECOVERY") return null;
  const selected = new Set(Array.isArray(choice.selectedAssetIds) ? choice.selectedAssetIds : []);
  return {
    playerId: choice.playerId,
    creditorId: choice.creditorId ?? null,
    reason: choice.reason ?? null,
    amountDue: Number(choice.amountDue) || 0,
    cash: Number(choice.cash) || 0,
    shortfall: Number(choice.shortfall) || 0,
    refundTotal: Number(choice.refundTotal) || 0,
    remainingShortfall: Number(choice.remainingShortfall) || 0,
    ready: choice.ready === true || choice.status === "READY",
    status: choice.status ?? "OPEN",
    selected,
    catalog: Array.isArray(choice.catalog) ? choice.catalog : [],
  };
}

export function createOnlineLiquidationUiModel(state, viewerPlayerId) {
  const choice = normalizeChoice(state?.pendingChoice);
  if (!choice || !viewerPlayerId) return null;

  const debtor = findPlayer(state, choice.playerId);
  if (!debtor) return null;
  const creditor = choice.creditorId ? findPlayer(state, choice.creditorId) : null;

  const assets = choice.catalog.map((asset) => {
    const node = findNode(state, asset.assetId);
    return Object.freeze({
      id: asset.assetId,
      label: node?.label ?? asset.assetId,
      refund: Number(asset.refund) || 0,
      buildingLevel: Number(asset.buildingLevel) || 0,
      selected: choice.selected.has(asset.assetId),
    });
  });

  return Object.freeze({
    debtorPlayerId: choice.playerId,
    debtorName: playerName(debtor),
    creditorPlayerId: choice.creditorId,
    creditorName: creditor ? playerName(creditor) : null,
    reason: choice.reason,
    amountDue: choice.amountDue,
    cash: choice.cash,
    shortfall: choice.shortfall,
    refundTotal: choice.refundTotal,
    remainingShortfall: choice.remainingShortfall,
    ready: choice.ready,
    status: choice.status,
    isDebtor: viewerPlayerId === choice.playerId,
    assets: Object.freeze(assets),
  });
}

function ensureStyles(documentObject) {
  if (documentObject.querySelector("link[data-online-liquidation-style]")) return;
  const link = documentObject.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL("../css/liquidation-ui.css?v=20260918-r1", import.meta.url).href;
  link.dataset.onlineLiquidationStyle = "true";
  documentObject.head.append(link);
}

function createPanel(documentObject, dock) {
  const panel = documentObject.createElement("section");
  panel.className = "liquidation-action-panel";
  panel.dataset.liquidationPanel = "";
  panel.hidden = true;
  panel.setAttribute("aria-live", "polite");

  const heading = documentObject.createElement("div");
  heading.className = "liquidation-action-panel__heading";
  const badge = documentObject.createElement("span");
  badge.className = "liquidation-action-panel__badge";
  badge.textContent = "파산 회피";
  const title = documentObject.createElement("strong");
  title.dataset.liquidationTitle = "";
  heading.append(badge, title);

  const summary = documentObject.createElement("p");
  summary.className = "liquidation-action-panel__summary";
  summary.dataset.liquidationSummary = "";

  const progress = documentObject.createElement("div");
  progress.className = "liquidation-action-panel__progress";
  progress.dataset.liquidationProgress = "";

  const assets = documentObject.createElement("div");
  assets.className = "liquidation-action-panel__assets";
  assets.dataset.liquidationAssets = "";

  const actions = documentObject.createElement("div");
  actions.className = "liquidation-action-panel__actions";
  actions.dataset.liquidationActions = "";

  const applyButton = documentObject.createElement("button");
  applyButton.type = "button";
  applyButton.className = "secondary-button";
  applyButton.dataset.liquidationApply = "";
  applyButton.textContent = "매각 선택 반영";

  const confirmButton = documentObject.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "primary-button";
  confirmButton.dataset.liquidationConfirm = "";
  confirmButton.textContent = "매각하고 지불";

  actions.append(applyButton, confirmButton);
  panel.append(heading, summary, progress, assets, actions);
  dock.prepend(panel);

  return { panel, title, summary, progress, assets, actions, applyButton, confirmButton };
}

function selectedAssetIds(container) {
  return [...container.querySelectorAll("input[type=checkbox]:checked")]
    .map((input) => input.value);
}

function renderAssets(documentObject, container, model, busy) {
  container.replaceChildren();

  model.assets.forEach((asset) => {
    const label = documentObject.createElement("label");
    label.className = "liquidation-action-panel__asset";

    const checkbox = documentObject.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = asset.id;
    checkbox.checked = asset.selected;
    checkbox.disabled = busy || !model.isDebtor;
    checkbox.dataset.liquidationAsset = "";

    const text = documentObject.createElement("span");
    text.className = "liquidation-action-panel__asset-copy";

    const name = documentObject.createElement("strong");
    name.textContent = asset.label;

    const meta = documentObject.createElement("small");
    meta.textContent = "환급 " + money(asset.refund)
      + (asset.buildingLevel > 0 ? " · 건물 " + asset.buildingLevel + "단계 포함" : "");

    text.append(name, meta);
    label.append(checkbox, text);
    container.append(label);
  });
}

export function setupOnlineLiquidationUi({
  roomId,
  session = getActiveOnlineClassicSession(roomId),
  documentObject = document,
} = {}) {
  if (!roomId) throw new Error("ROOM_ID_REQUIRED");
  if (!session) throw new Error("ONLINE_LIQUIDATION_SESSION_NOT_READY");

  const dock = documentObject.querySelector("[data-board-action-dock]");
  if (!dock) throw new Error("ONLINE_LIQUIDATION_DOCK_MISSING");

  ensureStyles(documentObject);
  const elements = createPanel(documentObject, dock);
  let disposed = false;
  let busy = false;
  let errorText = "";

  function render(state = session.getState()) {
    if (disposed) return;
    const model = createOnlineLiquidationUiModel(state, session.getViewerPlayerId());

    if (!model) {
      elements.panel.hidden = true;
      return;
    }

    elements.panel.hidden = false;
    elements.title.textContent = model.isDebtor
      ? "자산을 매각해 지불하세요"
      : model.debtorName + "의 자산 정리 중";

    if (errorText) {
      elements.summary.textContent = errorText;
    } else if (model.isDebtor) {
      elements.summary.textContent = "현재 현금 " + money(model.cash)
        + " · 지불액 " + money(model.amountDue)
        + " · 부족액 " + money(model.shortfall);
    } else {
      const target = model.creditorName ? model.creditorName + "에게" : "은행에";
      elements.summary.textContent = model.debtorName + "님이 "
        + target + " " + money(model.amountDue) + " 지불을 준비하고 있습니다.";
    }

    elements.progress.textContent = "선택 환급 " + money(model.refundTotal)
      + (model.ready
        ? " · 지불 가능"
        : " · 남은 부족액 " + money(model.remainingShortfall));

    renderAssets(documentObject, elements.assets, model, busy);

    elements.actions.hidden = !model.isDebtor;
    elements.applyButton.disabled = busy || !model.isDebtor;
    elements.confirmButton.disabled = busy || !model.isDebtor || !model.ready;
  }

  async function notifyController() {
    await session.notifyCurrentState();
  }

  async function recover() {
    await session.refresh({ notify: false });
    await notifyController();
  }

  async function runAction(action) {
    if (busy || disposed) return;
    busy = true;
    errorText = "";
    render();

    try {
      await action();
      await notifyController();
    } catch (error) {
      const message = String(error?.message ?? error ?? "");
      if (
        message.includes("VERSION_CONFLICT")
        || message.includes("DEBT_RECOVERY_")
        || message.includes("LIQUIDATION_")
      ) {
        try {
          await recover();
        } catch {
          // Existing session recovery continues from the authoritative snapshot.
        }
        errorText = "최신 자산 매각 상태를 반영했습니다. 다시 확인해 주세요.";
      } else {
        console.error("Marble online liquidation UI action failed", error);
        errorText = "자산 매각 처리 중 오류가 발생했습니다.";
      }
    } finally {
      busy = false;
      render();
    }
  }

  elements.applyButton.addEventListener("click", () => {
    const assetIds = selectedAssetIds(elements.assets);
    void runAction(() => session.selectLiquidation(assetIds));
  });

  elements.confirmButton.addEventListener("click", () => {
    void runAction(() => session.confirmLiquidation());
  });

  const unsubscribeState = session.subscribeState((state) => {
    errorText = "";
    render(state);
  });

  render();

  return () => {
    disposed = true;
    unsubscribeState?.();
    elements.panel.remove();
  };
}
