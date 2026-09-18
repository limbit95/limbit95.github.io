import { CLASSIC_RULES } from "./themes/classic/rules.js";
import { formatThemeMoney } from "./themes/money.js";

function money(value) {
  return formatThemeMoney(value, CLASSIC_RULES.currency);
}

function playerName(player) {
  return player?.name || player?.id || "플레이어";
}

function findPlayer(state, playerId) {
  return state?.players?.find((player) => player.id === playerId) ?? null;
}

function findNode(state, nodeId) {
  return state?.board?.nodes?.find((node) => node.id === nodeId) ?? null;
}

function choosePlayerId(eligiblePlayerIds, selectedPlayerId) {
  if (eligiblePlayerIds.includes(selectedPlayerId)) return selectedPlayerId;
  return eligiblePlayerIds[0] ?? null;
}

export function createLocalAuctionUiModel(state, selectedPlayerId = null) {
  const pending = state?.pendingChoice;
  if (!pending || !["AUCTION_REQUEST", "PROPERTY_AUCTION"].includes(pending.type)) return null;

  const auction = pending.type === "PROPERTY_AUCTION" ? (pending.auction ?? {}) : null;
  const eligiblePlayerIds = pending.type === "AUCTION_REQUEST"
    ? (pending.eligiblePlayerIds ?? [])
    : (auction?.eligiblePlayerIds ?? []);
  const activePlayerId = choosePlayerId(eligiblePlayerIds, selectedPlayerId);
  const activePlayer = findPlayer(state, activePlayerId);
  const node = findNode(state, pending.nodeId);
  const requestedByPlayerIds = pending.type === "AUCTION_REQUEST"
    ? (pending.requestedByPlayerIds ?? [])
    : (auction?.requestedByPlayerIds ?? pending.requestedByPlayerIds ?? []);

  const base = {
    stage: pending.type === "AUCTION_REQUEST" ? "request" : "auction",
    nodeId: pending.nodeId,
    nodeLabel: node?.label ?? pending.nodeId,
    selectedPlayerId: activePlayerId,
    selectedPlayerName: playerName(activePlayer),
    selectedPlayerGold: Number(activePlayer?.money) || 0,
    playerOptions: eligiblePlayerIds.map((playerId) => {
      const player = findPlayer(state, playerId);
      return Object.freeze({
        id: playerId,
        name: playerName(player),
        gold: Number(player?.money) || 0,
      });
    }),
  };

  if (pending.type === "AUCTION_REQUEST") {
    const requested = requestedByPlayerIds.includes(activePlayerId);
    return Object.freeze({
      ...base,
      openingBid: Number(pending.openingBid) || 0,
      requestCount: requestedByPlayerIds.length,
      requested,
      canRequest: Boolean(activePlayerId) && !requested,
      canClose: true,
    });
  }

  const bidPlayerIds = auction?.bidPlayerIds ?? [];
  const passedPlayerIds = auction?.passedPlayerIds ?? [];
  const openingBid = Number(auction?.openingBid ?? pending.openingBid) || 0;
  const highestBid = Number(auction?.highestBid) || 0;
  const minimumBid = highestBid > 0 ? highestBid + 1 : openingBid;
  const highestBidderId = auction?.highestBidderId ?? null;
  const passed = passedPlayerIds.includes(activePlayerId);
  const requesterNeedsFirstBid = (
    requestedByPlayerIds.includes(activePlayerId)
    && !bidPlayerIds.includes(activePlayerId)
    && base.selectedPlayerGold >= minimumBid
  );
  const isHighestBidder = highestBidderId === activePlayerId;
  const canBid = Boolean(activePlayerId) && !passed && base.selectedPlayerGold >= minimumBid;
  const canPass = Boolean(activePlayerId) && !passed && !isHighestBidder && !requesterNeedsFirstBid;

  let passLabel = "패스";
  if (passed) passLabel = "패스 완료";
  else if (isHighestBidder) passLabel = "최고 입찰 중";
  else if (requesterNeedsFirstBid) passLabel = "첫 입찰 필요";

  return Object.freeze({
    ...base,
    openingBid,
    highestBid,
    highestBidderId,
    highestBidderName: highestBidderId ? playerName(findPlayer(state, highestBidderId)) : null,
    minimumBid,
    passed,
    requesterNeedsFirstBid,
    isHighestBidder,
    canBid,
    canPass,
    passLabel,
  });
}

function ensureAuctionStyles(documentObject) {
  if (documentObject.querySelector("link[data-auction-style]")) return;
  const link = documentObject.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL("../css/auction-ui.css?v=20260918-r2", import.meta.url).href;
  link.dataset.auctionStyle = "true";
  documentObject.head.append(link);
}

function createPanel(documentObject, dock) {
  const panel = documentObject.createElement("section");
  panel.className = "auction-action-panel";
  panel.dataset.localAuctionPanel = "";
  panel.hidden = true;
  panel.setAttribute("aria-live", "polite");

  const heading = documentObject.createElement("div");
  heading.className = "auction-action-panel__heading";

  const badge = documentObject.createElement("span");
  badge.className = "auction-action-panel__badge";

  const title = documentObject.createElement("strong");
  heading.append(badge, title);

  const status = documentObject.createElement("p");
  status.className = "auction-action-panel__status";

  const detail = documentObject.createElement("p");
  detail.className = "auction-action-panel__detail";

  const participantRow = documentObject.createElement("label");
  participantRow.className = "auction-action-panel__participant";
  participantRow.textContent = "플레이어";
  const playerSelect = documentObject.createElement("select");
  playerSelect.dataset.localAuctionPlayer = "";
  playerSelect.setAttribute("aria-label", "경매 참여 플레이어");
  participantRow.append(playerSelect);

  const requestRow = documentObject.createElement("div");
  requestRow.className = "auction-action-panel__request";
  const requestButton = documentObject.createElement("button");
  requestButton.type = "button";
  requestButton.className = "primary-button";
  requestButton.textContent = "경매 요청";
  const closeButton = documentObject.createElement("button");
  closeButton.type = "button";
  closeButton.className = "secondary-button";
  closeButton.textContent = "요청 마감";
  requestRow.append(requestButton, closeButton);

  const bidRow = documentObject.createElement("div");
  bidRow.className = "auction-action-panel__bid";
  const bidInput = documentObject.createElement("input");
  bidInput.type = "number";
  bidInput.step = "1";
  bidInput.inputMode = "numeric";
  bidInput.dataset.localAuctionBidInput = "";
  bidInput.setAttribute("aria-label", "로컬 경매 입찰 금액");
  const bidButton = documentObject.createElement("button");
  bidButton.type = "button";
  bidButton.className = "primary-button";
  bidButton.textContent = "입찰";
  const passButton = documentObject.createElement("button");
  passButton.type = "button";
  passButton.className = "secondary-button";
  passButton.textContent = "패스";
  bidRow.append(bidInput, bidButton, passButton);

  panel.append(heading, status, detail, participantRow, requestRow, bidRow);
  dock.prepend(panel);

  return {
    panel,
    badge,
    title,
    status,
    detail,
    participantRow,
    playerSelect,
    requestRow,
    requestButton,
    closeButton,
    bidRow,
    bidInput,
    bidButton,
    passButton,
  };
}

export function setupLocalAuctionUi({
  session,
  documentObject = document,
  onStateChange = () => {},
} = {}) {
  if (!session) throw new Error("LOCAL_AUCTION_SESSION_REQUIRED");
  const dock = documentObject.querySelector("[data-board-action-dock]");
  if (!dock) throw new Error("LOCAL_AUCTION_DOCK_MISSING");

  ensureAuctionStyles(documentObject);
  const elements = createPanel(documentObject, dock);
  let disposed = false;
  let busy = false;
  let errorText = "";
  let selectedPlayerId = null;

  function syncPlayerOptions(model) {
    const optionIds = model.playerOptions.map((option) => option.id).join("|");
    if (elements.playerSelect.dataset.optionIds !== optionIds) {
      elements.playerSelect.replaceChildren(...model.playerOptions.map((option) => {
        const element = documentObject.createElement("option");
        element.value = option.id;
        element.textContent = `${option.name} · ${money(option.gold)}`;
        return element;
      }));
      elements.playerSelect.dataset.optionIds = optionIds;
    }
    elements.playerSelect.value = model.selectedPlayerId ?? "";
    elements.playerSelect.disabled = busy || model.playerOptions.length === 0;
  }

  function render(state = session.getState()) {
    if (disposed) return;
    const model = createLocalAuctionUiModel(state, selectedPlayerId);
    if (!model) {
      elements.panel.hidden = true;
      elements.panel.dataset.auctionStage = "";
      return;
    }

    selectedPlayerId = model.selectedPlayerId;
    elements.panel.hidden = false;
    elements.panel.dataset.auctionStage = model.stage;
    elements.title.textContent = model.nodeLabel;
    syncPlayerOptions(model);

    if (model.stage === "request") {
      elements.badge.textContent = "경매 요청";
      elements.status.textContent = errorText || `구매 포기 후 경매 요청을 선택하세요 · 요청 ${model.requestCount}명`;
      elements.detail.textContent = `시작가 ${money(model.openingBid)} · 현재 선택 ${model.selectedPlayerName}`;
      elements.requestRow.hidden = false;
      elements.bidRow.hidden = true;
      elements.requestButton.disabled = busy || !model.canRequest;
      elements.requestButton.textContent = model.requested ? "경매 요청 완료" : `${model.selectedPlayerName} 경매 요청`;
      elements.closeButton.disabled = busy;
      elements.closeButton.textContent = model.requestCount > 0 ? "요청 마감 · 경매 시작" : "요청 마감 · 턴 종료";
      return;
    }

    elements.badge.textContent = "경매 진행";
    elements.status.textContent = errorText || (model.highestBid > 0
      ? `현재 최고가 ${money(model.highestBid)} · ${model.highestBidderName ?? "입찰자"}`
      : `아직 입찰 없음 · 시작가 ${money(model.openingBid)}`);
    elements.detail.textContent = `${model.selectedPlayerName} · 다음 최소 입찰 ${money(model.minimumBid)} · 보유 ${money(model.selectedPlayerGold)}`;
    elements.requestRow.hidden = true;
    elements.bidRow.hidden = false;

    elements.bidInput.min = String(model.minimumBid);
    elements.bidInput.max = String(model.selectedPlayerGold);
    const currentValue = Number(elements.bidInput.value);
    if (!Number.isSafeInteger(currentValue) || currentValue < model.minimumBid || currentValue > model.selectedPlayerGold) {
      elements.bidInput.value = String(model.minimumBid);
    }
    elements.bidInput.disabled = busy || !model.canBid;
    elements.bidButton.disabled = busy || !model.canBid;
    elements.passButton.disabled = busy || !model.canPass;
    elements.passButton.textContent = model.passLabel;
  }

  function runAction(action) {
    if (disposed || busy) return;
    busy = true;
    errorText = "";
    render();
    try {
      const state = action();
      render(state);
      onStateChange(state);
    } catch (error) {
      errorText = error instanceof Error ? error.message : "경매 처리 중 오류가 발생했습니다.";
      render();
    } finally {
      busy = false;
      render();
    }
  }

  elements.playerSelect.addEventListener("change", () => {
    selectedPlayerId = elements.playerSelect.value || null;
    errorText = "";
    render();
  });

  elements.requestButton.addEventListener("click", () => {
    if (!selectedPlayerId) return;
    runAction(() => session.requestAuction(selectedPlayerId));
  });

  elements.closeButton.addEventListener("click", () => {
    runAction(() => session.closeAuctionRequest());
  });

  elements.bidButton.addEventListener("click", () => {
    if (!selectedPlayerId) return;
    const amount = Number(elements.bidInput.value);
    const model = createLocalAuctionUiModel(session.getState(), selectedPlayerId);
    if (!model || model.stage !== "auction" || !Number.isSafeInteger(amount)) return;
    if (amount < model.minimumBid || amount > model.selectedPlayerGold) {
      errorText = `${money(model.minimumBid)} 이상, 보유 골드 이하로 입력해 주세요.`;
      render();
      return;
    }
    runAction(() => session.auctionBid(selectedPlayerId, amount));
  });

  elements.passButton.addEventListener("click", () => {
    if (!selectedPlayerId) return;
    runAction(() => session.auctionPass(selectedPlayerId));
  });

  render();

  return Object.freeze({
    render,
    dispose() {
      disposed = true;
      elements.panel.remove();
    },
  });
}
