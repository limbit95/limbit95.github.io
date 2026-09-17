import { getActiveOnlineClassicSession } from "./onlineSession.js?v=20260910-r8";
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

export function createOnlineAuctionUiModel(state, viewerPlayerId) {
  const pending = state?.pendingChoice;
  if (!pending || !["AUCTION_REQUEST", "PROPERTY_AUCTION"].includes(pending.type)) return null;

  const viewer = findPlayer(state, viewerPlayerId);
  const node = findNode(state, pending.nodeId);
  const base = {
    stage: pending.type === "AUCTION_REQUEST" ? "request" : "auction",
    nodeId: pending.nodeId,
    nodeLabel: node?.label ?? pending.nodeId,
    viewerGold: Number(viewer?.money) || 0,
  };

  if (pending.type === "AUCTION_REQUEST") {
    const eligiblePlayerIds = pending.eligiblePlayerIds ?? [];
    const requestedByPlayerIds = pending.requestedByPlayerIds ?? [];
    const eligible = eligiblePlayerIds.includes(viewerPlayerId);
    const requested = requestedByPlayerIds.includes(viewerPlayerId);
    return Object.freeze({
      ...base,
      openingBid: Number(pending.openingBid) || 0,
      declinedByPlayerId: pending.declinedByPlayerId ?? null,
      requestCount: requestedByPlayerIds.length,
      eligible,
      requested,
      canRequest: eligible && !requested,
      canClose: pending.declinedByPlayerId === viewerPlayerId,
    });
  }

  const auction = pending.auction ?? {};
  const eligiblePlayerIds = auction.eligiblePlayerIds ?? [];
  const requestedByPlayerIds = auction.requestedByPlayerIds ?? pending.requestedByPlayerIds ?? [];
  const bidPlayerIds = auction.bidPlayerIds ?? [];
  const passedPlayerIds = auction.passedPlayerIds ?? [];
  const openingBid = Number(auction.openingBid ?? pending.openingBid) || 0;
  const highestBid = Number(auction.highestBid) || 0;
  const minimumBid = highestBid > 0 ? highestBid + 1 : openingBid;
  const highestBidderId = auction.highestBidderId ?? null;
  const eligible = eligiblePlayerIds.includes(viewerPlayerId);
  const passed = passedPlayerIds.includes(viewerPlayerId);
  const requesterNeedsFirstBid = (
    requestedByPlayerIds.includes(viewerPlayerId)
    && !bidPlayerIds.includes(viewerPlayerId)
    && base.viewerGold >= minimumBid
  );
  const isHighestBidder = highestBidderId === viewerPlayerId;
  const canBid = eligible && !passed && base.viewerGold >= minimumBid;
  const canPass = eligible && !passed && !isHighestBidder && !requesterNeedsFirstBid;

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
    eligible,
    passed,
    requesterNeedsFirstBid,
    isHighestBidder,
    canBid,
    canPass,
    passLabel,
  });
}

function ensureAuctionStyles(documentObject) {
  if (documentObject.querySelector("link[data-online-auction-style]")) return;
  const link = documentObject.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL("../css/auction-ui.css?v=20260917-r1", import.meta.url).href;
  link.dataset.onlineAuctionStyle = "true";
  documentObject.head.append(link);
}

function createPanel(documentObject, dock) {
  const panel = documentObject.createElement("section");
  panel.className = "auction-action-panel";
  panel.dataset.auctionPanel = "";
  panel.hidden = true;
  panel.setAttribute("aria-live", "polite");

  const heading = documentObject.createElement("div");
  heading.className = "auction-action-panel__heading";
  const badge = documentObject.createElement("span");
  badge.className = "auction-action-panel__badge";
  badge.dataset.auctionStageLabel = "";
  const title = documentObject.createElement("strong");
  title.dataset.auctionTitle = "";
  heading.append(badge, title);

  const status = documentObject.createElement("p");
  status.className = "auction-action-panel__status";
  status.dataset.auctionStatus = "";

  const detail = documentObject.createElement("p");
  detail.className = "auction-action-panel__detail";
  detail.dataset.auctionDetail = "";

  const bidRow = documentObject.createElement("div");
  bidRow.className = "auction-action-panel__bid";
  bidRow.dataset.auctionBidRow = "";
  bidRow.hidden = true;
  const bidInput = documentObject.createElement("input");
  bidInput.type = "number";
  bidInput.inputMode = "numeric";
  bidInput.step = "1";
  bidInput.dataset.auctionBidInput = "";
  bidInput.setAttribute("aria-label", "경매 입찰가");
  const bidButton = documentObject.createElement("button");
  bidButton.type = "button";
  bidButton.className = "primary-button";
  bidButton.dataset.auctionBid = "";
  bidButton.textContent = "입찰";
  const passButton = documentObject.createElement("button");
  passButton.type = "button";
  passButton.className = "secondary-button";
  passButton.dataset.auctionPass = "";
  passButton.textContent = "패스";
  bidRow.append(bidInput, bidButton, passButton);

  const requestRow = documentObject.createElement("div");
  requestRow.className = "auction-action-panel__request";
  requestRow.dataset.auctionRequestRow = "";
  requestRow.hidden = true;
  const requestButton = documentObject.createElement("button");
  requestButton.type = "button";
  requestButton.className = "primary-button";
  requestButton.dataset.auctionRequest = "";
  requestButton.textContent = "경매 요청";
  const closeButton = documentObject.createElement("button");
  closeButton.type = "button";
  closeButton.className = "secondary-button";
  closeButton.dataset.auctionRequestClose = "";
  closeButton.textContent = "요청 마감";
  requestRow.append(requestButton, closeButton);

  panel.append(heading, status, detail, requestRow, bidRow);
  dock.prepend(panel);

  return {
    panel,
    badge,
    title,
    status,
    detail,
    requestRow,
    requestButton,
    closeButton,
    bidRow,
    bidInput,
    bidButton,
    passButton,
  };
}

function isPurchaseDeclineTarget(target) {
  const tileDecline = target?.closest?.("[data-tile-info-decline]");
  if (tileDecline) return true;
  const secondary = target?.closest?.("[data-secondary-action]");
  return secondary?.dataset?.action === "decline";
}

export function setupOnlineAuctionUi({
  roomId,
  session = getActiveOnlineClassicSession(roomId),
  documentObject = document,
} = {}) {
  if (!roomId) throw new Error("ROOM_ID_REQUIRED");
  if (!session) throw new Error("ONLINE_AUCTION_SESSION_NOT_READY");
  const dock = documentObject.querySelector("[data-board-action-dock]");
  if (!dock) throw new Error("ONLINE_AUCTION_DOCK_MISSING");

  ensureAuctionStyles(documentObject);
  const elements = createPanel(documentObject, dock);
  let disposed = false;
  let busy = false;
  let errorText = "";

  function render(state = session.getState()) {
    if (disposed) return;
    const model = createOnlineAuctionUiModel(state, session.getViewerPlayerId());
    if (!model) {
      elements.panel.hidden = true;
      elements.panel.dataset.auctionStage = "";
      return;
    }

    elements.panel.hidden = false;
    elements.panel.dataset.auctionStage = model.stage;
    elements.title.textContent = model.nodeLabel;

    if (model.stage === "request") {
      elements.badge.textContent = "경매 요청";
      elements.status.textContent = errorText || `구매 포기 후 경매 요청을 받는 중 · 요청 ${model.requestCount}명`;
      elements.detail.textContent = `시작가 ${money(model.openingBid)} · 내 보유 골드 ${money(model.viewerGold)}`;
      elements.requestRow.hidden = false;
      elements.bidRow.hidden = true;

      elements.requestButton.hidden = !model.eligible;
      elements.requestButton.disabled = busy || !model.canRequest;
      elements.requestButton.textContent = model.requested ? "경매 요청 완료" : "경매 요청";

      elements.closeButton.hidden = !model.canClose;
      elements.closeButton.disabled = busy;
      elements.closeButton.textContent = model.requestCount > 0 ? "요청 마감 · 경매 시작" : "요청 마감 · 턴 종료";
      return;
    }

    elements.badge.textContent = "경매 진행";
    elements.status.textContent = errorText || (model.highestBid > 0
      ? `현재 최고가 ${money(model.highestBid)} · ${model.highestBidderName ?? "입찰자"}`
      : `아직 입찰 없음 · 시작가 ${money(model.openingBid)}`);
    elements.detail.textContent = `다음 최소 입찰 ${money(model.minimumBid)} · 내 보유 골드 ${money(model.viewerGold)}`;
    elements.requestRow.hidden = true;
    elements.bidRow.hidden = !model.eligible;

    elements.bidInput.min = String(model.minimumBid);
    elements.bidInput.max = String(model.viewerGold);
    const currentValue = Number(elements.bidInput.value);
    if (!Number.isSafeInteger(currentValue) || currentValue < model.minimumBid || currentValue > model.viewerGold) {
      elements.bidInput.value = String(model.minimumBid);
    }
    elements.bidInput.disabled = busy || !model.canBid;
    elements.bidButton.disabled = busy || !model.canBid;
    elements.passButton.disabled = busy || !model.canPass;
    elements.passButton.textContent = model.passLabel;
  }

  async function syncControllerUi() {
    await session.notifyCurrentState();
  }

  async function recoverControllerUi() {
    await session.refresh({ notify: false });
    await syncControllerUi();
  }

  async function runAction(action, { closePurchaseModal = false } = {}) {
    if (busy || disposed) return;
    busy = true;
    errorText = "";
    render();
    try {
      await action();
      if (closePurchaseModal) {
        const modal = documentObject.querySelector("[data-tile-info-modal]");
        if (modal?.open && typeof modal.close === "function") modal.close();
        else modal?.removeAttribute?.("open");
      }
      await syncControllerUi();
    } catch (error) {
      const message = String(error?.message ?? error ?? "");
      if (message.includes("VERSION_CONFLICT") || message.includes("AUCTION_") || message.includes("NOT_YOUR_TURN")) {
        try {
          await recoverControllerUi();
        } catch {
          // The session's existing recovery loop will keep retrying authoritative state.
        }
        errorText = "최신 경매 상태를 반영했습니다. 다시 확인해 주세요.";
      } else {
        console.error("Marble online auction UI action failed", error);
        errorText = "경매 처리 중 오류가 발생했습니다.";
      }
    } finally {
      busy = false;
      render();
    }
  }

  function handlePurchaseDecline(event) {
    if (disposed || busy || !isPurchaseDeclineTarget(event.target)) return;
    const state = session.getState();
    if (state.pendingChoice?.type !== "BUY_PROPERTY") return;
    if (currentPlayer(state)?.id !== session.getViewerPlayerId()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    void runAction(() => session.declinePropertyForAuction(), { closePurchaseModal: true });
  }

  elements.requestButton.addEventListener("click", () => {
    void runAction(() => session.requestAuction());
  });
  elements.closeButton.addEventListener("click", () => {
    void runAction(() => session.closeAuctionRequest());
  });
  elements.bidButton.addEventListener("click", () => {
    const amount = Number(elements.bidInput.value);
    const model = createOnlineAuctionUiModel(session.getState(), session.getViewerPlayerId());
    if (!model || model.stage !== "auction" || !Number.isSafeInteger(amount)) return;
    if (amount < model.minimumBid || amount > model.viewerGold) {
      errorText = `${money(model.minimumBid)} 이상, 보유 골드 이하로 입력해 주세요.`;
      render();
      return;
    }
    void runAction(() => session.auctionBid(amount));
  });
  elements.passButton.addEventListener("click", () => {
    void runAction(() => session.auctionPass());
  });

  const unsubscribeState = session.subscribeState((state) => {
    errorText = "";
    render(state);
  });
  documentObject.addEventListener("click", handlePurchaseDecline, true);
  render();

  return () => {
    disposed = true;
    unsubscribeState?.();
    documentObject.removeEventListener("click", handlePurchaseDecline, true);
    elements.panel.remove();
  };
}
