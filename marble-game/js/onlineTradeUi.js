import { getActiveOnlineClassicSession } from "./onlineSession.js?v=20260918-r1";
import { CLASSIC_RULES } from "./themes/classic/rules.js";
import { formatThemeMoney } from "./themes/money.js";

function money(value) {
  return formatThemeMoney(value, CLASSIC_RULES.currency);
}

function playerName(player) {
  return player?.name || player?.id || "플레이어";
}

function currentPlayer(state) {
  if (!state || state.currentPlayerIndex === null) return null;
  return state.players[state.currentPlayerIndex] ?? null;
}

function findPlayer(state, playerId) {
  return state?.players?.find((player) => player.id === playerId) ?? null;
}

function findNode(state, nodeId) {
  return state?.board?.nodes?.find((node) => node.id === nodeId) ?? null;
}

function tradableProperties(state, ownerId) {
  if (!state?.boardState?.properties || !ownerId) return [];
  return Object.entries(state.boardState.properties)
    .filter(([, property]) => property.ownerId === ownerId && Number(property.buildingLevel ?? 0) === 0)
    .map(([nodeId]) => ({
      id: nodeId,
      label: findNode(state, nodeId)?.label ?? nodeId,
    }));
}

function normalizeSide(side = {}) {
  return {
    propertyIds: Array.isArray(side.propertyIds) ? side.propertyIds : [],
    gold: Number(side.gold) || 0,
  };
}

function describeSide(state, side) {
  const normalized = normalizeSide(side);
  const parts = normalized.propertyIds.map((nodeId) => findNode(state, nodeId)?.label ?? nodeId);
  if (normalized.gold > 0) parts.push(money(normalized.gold));
  return parts.length > 0 ? parts.join(" + ") : "없음";
}

export function createOnlineTradeUiModel(state, viewerPlayerId) {
  if (!state || !viewerPlayerId) return null;
  const viewer = findPlayer(state, viewerPlayerId);
  if (!viewer || viewer.bankrupt) return null;

  const pendingTrade = state.pendingTrade ?? null;
  if (pendingTrade) {
    const proposer = findPlayer(state, pendingTrade.proposerPlayerId);
    const recipient = findPlayer(state, pendingTrade.recipientPlayerId);
    return Object.freeze({
      mode: "pending",
      offerId: pendingTrade.offerId,
      proposerPlayerId: pendingTrade.proposerPlayerId,
      proposerName: playerName(proposer),
      recipientPlayerId: pendingTrade.recipientPlayerId,
      recipientName: playerName(recipient),
      offeredLabel: describeSide(state, pendingTrade.terms?.offered),
      requestedLabel: describeSide(state, pendingTrade.terms?.requested),
      canAccept: pendingTrade.recipientPlayerId === viewerPlayerId,
      canReject: pendingTrade.recipientPlayerId === viewerPlayerId,
      isProposer: pendingTrade.proposerPlayerId === viewerPlayerId,
    });
  }

  const current = currentPlayer(state);
  if (
    state.status !== "PLAYING"
    || state.phase !== "WAITING_ROLL"
    || current?.id !== viewerPlayerId
  ) {
    return null;
  }

  const recipients = state.players
    .filter((player) => player.id !== viewerPlayerId && !player.bankrupt)
    .map((player) => Object.freeze({
      id: player.id,
      name: playerName(player),
      gold: Number(player.money) || 0,
    }));

  return Object.freeze({
    mode: "compose",
    viewerPlayerId,
    viewerGold: Number(viewer.money) || 0,
    recipients: Object.freeze(recipients),
    offeredProperties: Object.freeze(tradableProperties(state, viewerPlayerId).map(Object.freeze)),
  });
}

function ensureTradeStyles(documentObject) {
  if (documentObject.querySelector("link[data-online-trade-style]")) return;
  const link = documentObject.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL("../css/trade-ui.css?v=20260918-r1", import.meta.url).href;
  link.dataset.onlineTradeStyle = "true";
  documentObject.head.append(link);
}

function createPropertyChecks(documentObject, container, properties, groupName) {
  container.replaceChildren();
  if (properties.length === 0) {
    const empty = documentObject.createElement("span");
    empty.className = "trade-action-panel__empty";
    empty.textContent = "거래 가능한 도시 없음";
    container.append(empty);
    return;
  }
  properties.forEach((property) => {
    const label = documentObject.createElement("label");
    label.className = "trade-action-panel__property";
    const input = documentObject.createElement("input");
    input.type = "checkbox";
    input.value = property.id;
    input.dataset.tradePropertyGroup = groupName;
    const text = documentObject.createElement("span");
    text.textContent = property.label;
    label.append(input, text);
    container.append(label);
  });
}

function selectedPropertyIds(container) {
  return [...container.querySelectorAll("input[type=checkbox]:checked")]
    .map((input) => input.value);
}

function createPanel(documentObject, dock) {
  const panel = documentObject.createElement("section");
  panel.className = "trade-action-panel";
  panel.dataset.tradePanel = "";
  panel.hidden = true;
  panel.setAttribute("aria-live", "polite");

  const heading = documentObject.createElement("div");
  heading.className = "trade-action-panel__heading";
  const badge = documentObject.createElement("span");
  badge.className = "trade-action-panel__badge";
  badge.textContent = "거래";
  const title = documentObject.createElement("strong");
  title.dataset.tradeTitle = "";
  heading.append(badge, title);

  const status = documentObject.createElement("p");
  status.className = "trade-action-panel__status";
  status.dataset.tradeStatus = "";

  const compose = documentObject.createElement("div");
  compose.className = "trade-action-panel__compose";
  compose.dataset.tradeCompose = "";

  const recipientLabel = documentObject.createElement("label");
  recipientLabel.className = "trade-action-panel__field";
  recipientLabel.textContent = "거래 상대";
  const recipientSelect = documentObject.createElement("select");
  recipientSelect.dataset.tradeRecipient = "";
  recipientLabel.append(recipientSelect);

  const offeredFieldset = documentObject.createElement("fieldset");
  const offeredLegend = documentObject.createElement("legend");
  offeredLegend.textContent = "내가 주는 것";
  const offeredProperties = documentObject.createElement("div");
  offeredProperties.className = "trade-action-panel__properties";
  offeredProperties.dataset.tradeOfferedProperties = "";
  const offeredGold = documentObject.createElement("input");
  offeredGold.type = "number";
  offeredGold.min = "0";
  offeredGold.step = "1";
  offeredGold.value = "0";
  offeredGold.inputMode = "numeric";
  offeredGold.dataset.tradeOfferedGold = "";
  offeredGold.setAttribute("aria-label", "내가 주는 골드");
  offeredFieldset.append(offeredLegend, offeredProperties, offeredGold);

  const requestedFieldset = documentObject.createElement("fieldset");
  const requestedLegend = documentObject.createElement("legend");
  requestedLegend.textContent = "상대에게 받는 것";
  const requestedProperties = documentObject.createElement("div");
  requestedProperties.className = "trade-action-panel__properties";
  requestedProperties.dataset.tradeRequestedProperties = "";
  const requestedGold = documentObject.createElement("input");
  requestedGold.type = "number";
  requestedGold.min = "0";
  requestedGold.step = "1";
  requestedGold.value = "0";
  requestedGold.inputMode = "numeric";
  requestedGold.dataset.tradeRequestedGold = "";
  requestedGold.setAttribute("aria-label", "상대에게 받는 골드");
  requestedFieldset.append(requestedLegend, requestedProperties, requestedGold);

  const offerButton = documentObject.createElement("button");
  offerButton.type = "button";
  offerButton.className = "primary-button";
  offerButton.dataset.tradeOffer = "";
  offerButton.textContent = "거래 제안";

  compose.append(recipientLabel, offeredFieldset, requestedFieldset, offerButton);

  const pending = documentObject.createElement("div");
  pending.className = "trade-action-panel__pending";
  pending.dataset.tradePending = "";
  const terms = documentObject.createElement("p");
  terms.className = "trade-action-panel__terms";
  terms.dataset.tradeTerms = "";
  const responseRow = documentObject.createElement("div");
  responseRow.className = "trade-action-panel__responses";
  const acceptButton = documentObject.createElement("button");
  acceptButton.type = "button";
  acceptButton.className = "primary-button";
  acceptButton.dataset.tradeAccept = "";
  acceptButton.textContent = "수락";
  const rejectButton = documentObject.createElement("button");
  rejectButton.type = "button";
  rejectButton.className = "secondary-button";
  rejectButton.dataset.tradeReject = "";
  rejectButton.textContent = "거절";
  responseRow.append(acceptButton, rejectButton);
  pending.append(terms, responseRow);

  panel.append(heading, status, compose, pending);
  dock.prepend(panel);

  return {
    panel,
    title,
    status,
    compose,
    recipientSelect,
    offeredProperties,
    offeredGold,
    requestedProperties,
    requestedGold,
    offerButton,
    pending,
    terms,
    responseRow,
    acceptButton,
    rejectButton,
  };
}

export function setupOnlineTradeUi({
  roomId,
  session = getActiveOnlineClassicSession(roomId),
  documentObject = document,
} = {}) {
  if (!roomId) throw new Error("ROOM_ID_REQUIRED");
  if (!session) throw new Error("ONLINE_TRADE_SESSION_NOT_READY");
  const dock = documentObject.querySelector("[data-board-action-dock]");
  if (!dock) throw new Error("ONLINE_TRADE_DOCK_MISSING");

  ensureTradeStyles(documentObject);
  const elements = createPanel(documentObject, dock);
  let disposed = false;
  let busy = false;
  let errorText = "";
  let lastRecipientId = null;

  function recipientProperties(state, recipientId) {
    return tradableProperties(state, recipientId);
  }

  function syncRecipientProperties(state) {
    const recipientId = elements.recipientSelect.value;
    if (recipientId === lastRecipientId) return;
    lastRecipientId = recipientId;
    createPropertyChecks(
      documentObject,
      elements.requestedProperties,
      recipientProperties(state, recipientId),
      "requested",
    );
    const recipient = findPlayer(state, recipientId);
    elements.requestedGold.max = String(Number(recipient?.money) || 0);
    elements.requestedGold.value = "0";
  }

  function render(state = session.getState()) {
    if (disposed) return;
    const model = createOnlineTradeUiModel(state, session.getViewerPlayerId());
    if (!model) {
      elements.panel.hidden = true;
      return;
    }

    elements.panel.hidden = false;
    elements.panel.dataset.tradeMode = model.mode;
    elements.compose.hidden = model.mode !== "compose";
    elements.pending.hidden = model.mode !== "pending";

    if (model.mode === "pending") {
      elements.title.textContent = model.proposerName + " ↔ " + model.recipientName;
      elements.status.textContent = errorText || (model.isProposer
        ? model.recipientName + "의 응답을 기다리는 중입니다."
        : model.canAccept
          ? model.proposerName + "의 거래 제안을 확인해 주세요."
          : model.proposerName + "과 " + model.recipientName + "이 거래 협상 중입니다.");
      elements.terms.textContent = model.proposerName + " 제공: " + model.offeredLabel
        + " · " + model.recipientName + " 제공: " + model.requestedLabel;
      elements.responseRow.hidden = !model.canAccept;
      elements.acceptButton.disabled = busy || !model.canAccept;
      elements.rejectButton.disabled = busy || !model.canReject;
      return;
    }

    elements.title.textContent = "주사위 전 거래";
    elements.status.textContent = errorText || "상대와 도시 또는 골드를 교환할 수 있습니다.";
    elements.recipientSelect.replaceChildren(...model.recipients.map((recipient) => {
      const option = documentObject.createElement("option");
      option.value = recipient.id;
      option.textContent = recipient.name;
      return option;
    }));
    if (lastRecipientId && model.recipients.some((recipient) => recipient.id === lastRecipientId)) {
      elements.recipientSelect.value = lastRecipientId;
    }
    elements.offeredGold.max = String(model.viewerGold);
    createPropertyChecks(documentObject, elements.offeredProperties, model.offeredProperties, "offered");
    lastRecipientId = null;
    syncRecipientProperties(state);
    elements.offerButton.disabled = busy || model.recipients.length === 0;
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
        || message.includes("TRADE_")
        || message.includes("NOT_YOUR_TURN")
      ) {
        try {
          await recover();
        } catch {
          // Existing session recovery continues from the authoritative snapshot.
        }
        errorText = "최신 거래 상태를 반영했습니다. 다시 확인해 주세요.";
      } else {
        console.error("Marble online trade UI action failed", error);
        errorText = "거래 처리 중 오류가 발생했습니다.";
      }
    } finally {
      busy = false;
      render();
    }
  }

  elements.recipientSelect.addEventListener("change", () => {
    lastRecipientId = null;
    syncRecipientProperties(session.getState());
  });

  elements.offerButton.addEventListener("click", () => {
    const recipientPlayerId = elements.recipientSelect.value;
    const offeredGold = Number(elements.offeredGold.value) || 0;
    const requestedGold = Number(elements.requestedGold.value) || 0;
    const terms = {
      offered: {
        propertyIds: selectedPropertyIds(elements.offeredProperties),
        gold: offeredGold,
      },
      requested: {
        propertyIds: selectedPropertyIds(elements.requestedProperties),
        gold: requestedGold,
      },
    };
    const assetCount = terms.offered.propertyIds.length + terms.requested.propertyIds.length;
    if (assetCount === 0 && offeredGold === 0 && requestedGold === 0) {
      errorText = "도시 또는 골드를 하나 이상 선택해 주세요.";
      render();
      return;
    }
    void runAction(() => session.offerTrade(recipientPlayerId, terms));
  });

  elements.acceptButton.addEventListener("click", () => {
    void runAction(() => session.acceptTrade());
  });
  elements.rejectButton.addEventListener("click", () => {
    void runAction(() => session.rejectTrade());
  });

  const unsubscribeState = session.subscribeState((state) => {
    errorText = "";
    lastRecipientId = null;
    render(state);
  });
  render();

  return () => {
    disposed = true;
    unsubscribeState?.();
    elements.panel.remove();
  };
}
