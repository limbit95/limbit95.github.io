import { getActiveOnlineClassicSession } from "./onlineSession.js?v=20260918-r3";
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

function deadlineMs(value) {
  if (value === null || value === undefined) return null;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

export function createOnlineAuctionUiModel(state, viewerPlayerId) {
  const pending = state?.pendingChoice;
  if (!pending || !["AUCTION_REQUEST", "AUCTION_RECRUITMENT", "PROPERTY_AUCTION"].includes(pending.type)) {
    return null;
  }

  const viewer = findPlayer(state, viewerPlayerId);
  const node = findNode(state, pending.nodeId);
  const viewerGold = Number(viewer?.money) || 0;
  const stage = pending.type === "AUCTION_REQUEST"
    ? "request"
    : pending.type === "AUCTION_RECRUITMENT"
      ? "recruitment"
      : "auction";

  if (stage === "request") {
    const eligiblePlayerIds = pending.eligiblePlayerIds ?? [];
    const eligible = eligiblePlayerIds.includes(viewerPlayerId);
    return Object.freeze({
      stage,
      nodeId: pending.nodeId,
      nodeLabel: node?.label ?? pending.nodeId,
      viewerGold,
      openingBid: Number(pending.openingBid) || 0,
      basePrice: Number(pending.basePrice) || 0,
      declinedByPlayerId: pending.declinedByPlayerId ?? null,
      eligible,
      canRequest: eligible && viewerGold >= Number(pending.openingBid),
      deadlineAt: deadlineMs(pending.deadlineAt),
    });
  }

  if (stage === "recruitment") {
    const eligiblePlayerIds = pending.eligiblePlayerIds ?? [];
    const participantPlayerIds = pending.participantPlayerIds ?? [];
    const participant = participantPlayerIds.includes(viewerPlayerId);
    const requester = pending.requesterPlayerId === viewerPlayerId;
    const eligible = eligiblePlayerIds.includes(viewerPlayerId);
    return Object.freeze({
      stage,
      nodeId: pending.nodeId,
      nodeLabel: node?.label ?? pending.nodeId,
      viewerGold,
      openingBid: Number(pending.openingBid) || 0,
      basePrice: Number(pending.basePrice) || 0,
      requesterPlayerId: pending.requesterPlayerId ?? null,
      requesterName: playerName(findPlayer(state, pending.requesterPlayerId)),
      participantPlayerIds: Object.freeze([...participantPlayerIds]),
      participantCount: participantPlayerIds.length,
      participant,
      requester,
      eligible,
      canJoin: eligible && !participant && viewerGold >= Number(pending.openingBid),
      canWithdraw: participant && !requester,
      deadlineAt: deadlineMs(pending.deadlineAt),
    });
  }

  const auction = pending.auction ?? {};
  const participantPlayerIds = auction.participantPlayerIds ?? pending.participantPlayerIds ?? [];
  const passedPlayerIds = auction.passedPlayerIds ?? [];
  const openingBid = Number(auction.openingBid ?? pending.openingBid) || 0;
  const highestBid = Number(auction.highestBid) || 0;
  const minimumBid = highestBid > 0 ? highestBid + 1 : openingBid;
  const highestBidderId = auction.highestBidderId ?? null;
  const turnPlayerId = auction.turnPlayerId ?? null;
  const participant = participantPlayerIds.includes(viewerPlayerId);
  const passed = passedPlayerIds.includes(viewerPlayerId);
  const isTurn = turnPlayerId === viewerPlayerId;
  const canAfford = viewerGold >= minimumBid;

  return Object.freeze({
    stage,
    nodeId: pending.nodeId,
    nodeLabel: node?.label ?? pending.nodeId,
    viewerGold,
    openingBid,
    highestBid,
    highestBidderId,
    highestBidderName: highestBidderId ? playerName(findPlayer(state, highestBidderId)) : null,
    minimumBid,
    requesterPlayerId: auction.requesterPlayerId ?? pending.requesterPlayerId ?? null,
    participantPlayerIds: Object.freeze([...participantPlayerIds]),
    participant,
    passed,
    turnPlayerId,
    turnPlayerName: turnPlayerId ? playerName(findPlayer(state, turnPlayerId)) : null,
    isTurn,
    canBid: participant && !passed && isTurn && canAfford,
    canPass: participant && !passed && isTurn,
    passLabel: passed ? "포기 완료" : isTurn ? "포기" : "차례 대기",
    deadlineAt: deadlineMs(auction.turnDeadlineAt),
  });
}

function ensureAuctionStyles(documentObject) {
  if (documentObject.querySelector("link[data-online-auction-style]")) return;
  const link = documentObject.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL("../css/auction-ui.css?v=20260918-r3", import.meta.url).href;
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
  const timer = documentObject.createElement("span");
  timer.className = "auction-action-panel__timer";
  timer.dataset.auctionTimer = "";
  heading.append(badge, title, timer);

  const status = documentObject.createElement("p");
  status.className = "auction-action-panel__status";
  status.dataset.auctionStatus = "";
  const detail = documentObject.createElement("p");
  detail.className = "auction-action-panel__detail";
  detail.dataset.auctionDetail = "";

  const requestRow = documentObject.createElement("div");
  requestRow.className = "auction-action-panel__request";
  requestRow.dataset.auctionRequestRow = "";
  const primaryButton = documentObject.createElement("button");
  primaryButton.type = "button";
  primaryButton.className = "primary-button";
  primaryButton.dataset.auctionPrimary = "";
  const secondaryButton = documentObject.createElement("button");
  secondaryButton.type = "button";
  secondaryButton.className = "secondary-button";
  secondaryButton.dataset.auctionSecondary = "";
  requestRow.append(primaryButton, secondaryButton);

  const bidRow = documentObject.createElement("div");
  bidRow.className = "auction-action-panel__bid";
  bidRow.dataset.auctionBidRow = "";
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
  passButton.textContent = "포기";
  bidRow.append(bidInput, bidButton, passButton);

  panel.append(heading, status, detail, requestRow, bidRow);
  dock.prepend(panel);
  return {
    panel, badge, title, timer, status, detail,
    requestRow, primaryButton, secondaryButton,
    bidRow, bidInput, bidButton, passButton,
  };
}

function isPurchaseDeclineTarget(target) {
  const tileDecline = target?.closest?.("[data-tile-info-decline]");
  if (tileDecline) return true;
  const secondary = target?.closest?.("[data-secondary-action]");
  return secondary?.dataset?.action === "decline";
}

function showAutoPurchaseResult(documentObject, state, shownKeys) {
  const event = state?.lastEvents?.find?.((candidate) => candidate.type === "AUCTION_AUTO_PURCHASED");
  if (!event) return;
  const key = `${state.version ?? "v"}:${event.nodeId}:${event.playerId}:${event.amount}`;
  if (shownKeys.has(key)) return;
  shownKeys.add(key);
  const dialog = documentObject.createElement("dialog");
  dialog.className = "auction-result-modal";
  const title = documentObject.createElement("strong");
  title.textContent = "매입에 성공하셨습니다";
  const detail = documentObject.createElement("p");
  detail.textContent = `${playerName(findPlayer(state, event.playerId))} · ${findNode(state, event.nodeId)?.label ?? event.nodeId} · ${money(event.amount)}`;
  const button = documentObject.createElement("button");
  button.type = "button";
  button.className = "primary-button";
  button.textContent = "확인";
  button.addEventListener("click", () => {
    dialog.close?.();
    dialog.remove();
  });
  dialog.append(title, detail, button);
  documentObject.body?.append?.(dialog);
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

export function setupOnlineAuctionUi({
  roomId,
  session = getActiveOnlineClassicSession(roomId),
  documentObject = document,
  clock = Date.now,
  setTimeoutFn = globalThis.setTimeout,
  clearTimeoutFn = globalThis.clearTimeout,
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
  let deadlineTimer = null;
  let tickerTimer = null;
  const shownResultKeys = new Set();

  function clearTimers() {
    if (deadlineTimer !== null) clearTimeoutFn?.(deadlineTimer);
    if (tickerTimer !== null) clearTimeoutFn?.(tickerTimer);
    deadlineTimer = null;
    tickerTimer = null;
  }

  function updateTimer(model) {
    const deadline = Number(model?.deadlineAt);
    if (!Number.isFinite(deadline)) {
      elements.timer.textContent = "";
      return;
    }
    const seconds = Math.max(0, Math.ceil((deadline - Number(clock())) / 1000));
    elements.timer.textContent = `${seconds}초`;
  }

  function scheduleDeadline(model) {
    clearTimers();
    if (!Number.isFinite(Number(model?.deadlineAt))) return;
    const delay = Math.max(0, Number(model.deadlineAt) - Number(clock()));
    deadlineTimer = setTimeoutFn?.(() => {
      deadlineTimer = null;
      if (disposed || busy) return;
      void runAction(() => session.advanceAuctionDeadline());
    }, delay);
    const tick = () => {
      tickerTimer = null;
      if (disposed) return;
      const current = createOnlineAuctionUiModel(session.getState(), session.getViewerPlayerId());
      updateTimer(current);
      if (current && Number(current.deadlineAt) > Number(clock())) {
        tickerTimer = setTimeoutFn?.(tick, 250) ?? null;
      }
    };
    tickerTimer = setTimeoutFn?.(tick, 250) ?? null;
  }

  function render(state = session.getState()) {
    if (disposed) return;
    showAutoPurchaseResult(documentObject, state, shownResultKeys);
    const model = createOnlineAuctionUiModel(state, session.getViewerPlayerId());
    if (!model) {
      clearTimers();
      elements.panel.hidden = true;
      elements.panel.dataset.auctionStage = "";
      return;
    }

    elements.panel.hidden = false;
    elements.panel.dataset.auctionStage = model.stage;
    elements.title.textContent = model.nodeLabel;
    updateTimer(model);
    elements.requestRow.hidden = model.stage === "auction";
    elements.bidRow.hidden = model.stage !== "auction";
    elements.primaryButton.hidden = false;
    elements.secondaryButton.hidden = false;

    if (model.stage === "request") {
      elements.badge.textContent = "경매 요청";
      elements.status.textContent = errorText || "10초 안에 경매 개최 의사를 선택하세요";
      elements.detail.textContent = `정가 ${money(model.basePrice)} · 시작가 ${money(model.openingBid)} · 요청 시 구매 책임`;
      elements.primaryButton.textContent = "경매 요청";
      elements.primaryButton.hidden = !model.eligible;
      elements.primaryButton.disabled = busy || !model.canRequest;
      elements.secondaryButton.hidden = true;
    } else if (model.stage === "recruitment") {
      elements.badge.textContent = "참가 모집";
      elements.status.textContent = errorText || `${model.requesterName} 요청 · 참가 ${model.participantCount}명`;
      elements.detail.textContent = `시작가 ${money(model.openingBid)} · 10초 안에 참가 또는 철회`;
      elements.primaryButton.textContent = model.participant ? "참가 완료" : "참가";
      elements.primaryButton.hidden = !model.eligible;
      elements.primaryButton.disabled = busy || !model.canJoin;
      elements.secondaryButton.textContent = "참가 철회";
      elements.secondaryButton.hidden = !model.canWithdraw;
      elements.secondaryButton.disabled = busy || !model.canWithdraw;
    } else {
      elements.badge.textContent = "경매 진행";
      elements.status.textContent = errorText || `현재 최고가 ${money(model.highestBid)} · ${model.highestBidderName ?? "입찰자"}`;
      elements.detail.textContent = `현재 차례 ${model.turnPlayerName ?? "-"} · 다음 최소 ${money(model.minimumBid)} · 내 보유 ${money(model.viewerGold)}`;
      elements.bidRow.hidden = !model.participant;
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
    scheduleDeadline(model);
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
    clearTimers();
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
      if (
        message.includes("VERSION_CONFLICT")
        || message.includes("AUCTION_")
        || message.includes("NOT_YOUR_TURN")
      ) {
        try {
          await recoverControllerUi();
        } catch {
          // Existing recovery polling will converge to the authoritative snapshot.
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

  elements.primaryButton.addEventListener("click", () => {
    const model = createOnlineAuctionUiModel(session.getState(), session.getViewerPlayerId());
    if (model?.stage === "request") void runAction(() => session.requestAuction());
    else if (model?.stage === "recruitment") void runAction(() => session.joinAuction());
  });
  elements.secondaryButton.addEventListener("click", () => {
    const model = createOnlineAuctionUiModel(session.getState(), session.getViewerPlayerId());
    if (model?.stage === "recruitment") void runAction(() => session.withdrawAuction());
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
    clearTimers();
    unsubscribeState?.();
    documentObject.removeEventListener("click", handlePurchaseDecline, true);
    elements.panel.remove();
  };
}
