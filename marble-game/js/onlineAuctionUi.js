import {
  playAuctionBidSound,
  playAuctionStartSound,
  prepareAuctionBidSound,
} from "./auctionBidSound.js?v=20260922-r4";
import { createAuctionStartSequenceView } from "./auctionStartSequenceUi.js?v=20260922-r1";
import { getActiveOnlineClassicSession } from "./onlineSession.js?v=20260919-r13";
import { CLASSIC_RULES } from "./themes/classic/rules.js";
import { formatThemeMoney } from "./themes/money.js";

const BID_EVENT_HOLD_MS = 2200;
const HIGHEST_BID_COUNT_MS = 700;

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

function participantCards(state, playerIds = [], openingBidderPlayerId = null) {
  return Object.freeze(playerIds.map((playerId, index) => Object.freeze({
    id: playerId,
    name: playerName(findPlayer(state, playerId)),
    order: index + 1,
    openingBidder: playerId === openingBidderPlayerId,
  })));
}

export function createOnlineAuctionUiModel(state, viewerPlayerId) {
  const pending = state?.pendingChoice;
  if (!pending || !["AUCTION_VOTE", "AUCTION_START_SEQUENCE", "PROPERTY_AUCTION"].includes(pending.type)) {
    return null;
  }

  const viewer = findPlayer(state, viewerPlayerId);
  const node = findNode(state, pending.nodeId);
  const viewerGold = Number(viewer?.money) || 0;
  const stage = pending.type === "AUCTION_VOTE"
    ? "vote"
    : pending.type === "AUCTION_START_SEQUENCE"
      ? (pending.stage === "ROULETTE" ? "roulette" : "start_notice")
      : "auction";

  if (stage === "start_notice" || stage === "roulette") {
    const participantPlayerIds = pending.participantPlayerIds ?? [];
    return Object.freeze({
      stage,
      nodeId: pending.nodeId,
      nodeLabel: node?.label ?? pending.nodeId,
      viewerGold,
      openingBid: Number(pending.openingBid) || 0,
      participantPlayerIds: Object.freeze([...participantPlayerIds]),
      participantCards: participantCards(
        state,
        participantPlayerIds,
        pending.openingBidderPlayerId ?? null,
      ),
      openingBidderPlayerId: pending.openingBidderPlayerId ?? null,
      deadlineAt: deadlineMs(pending.deadlineAt),
    });
  }

  if (stage === "vote") {
    const eligiblePlayerIds = pending.eligiblePlayerIds ?? [];
    const participantPlayerIds = pending.participantPlayerIds ?? [];
    const passedPlayerIds = pending.passedPlayerIds ?? [];
    const eligible = eligiblePlayerIds.includes(viewerPlayerId);
    const participant = participantPlayerIds.includes(viewerPlayerId);
    const passed = passedPlayerIds.includes(viewerPlayerId);
    const decided = participant || passed;
    const openingBid = Number(pending.openingBid) || 0;
    const insufficientGold = Boolean(
      viewer
      && viewer.id !== pending.declinedByPlayerId
      && viewer.bankrupt !== true
      && !eligible
      && viewerGold < openingBid
    );
    const waitingCount = Math.max(
      0,
      eligiblePlayerIds.length - participantPlayerIds.length - passedPlayerIds.length,
    );

    return Object.freeze({
      stage,
      nodeId: pending.nodeId,
      nodeLabel: node?.label ?? pending.nodeId,
      viewerGold,
      basePrice: Number(pending.basePrice) || 0,
      openingBid,
      declinedByPlayerId: pending.declinedByPlayerId ?? null,
      eligible,
      participant,
      passed,
      decided,
      decision: participant ? "JOIN" : passed ? "PASS" : null,
      insufficientGold,
      canJoin: eligible && !decided && viewerGold >= openingBid,
      canVotePass: eligible && !decided,
      participantPlayerIds: Object.freeze([...participantPlayerIds]),
      participantCards: participantCards(state, participantPlayerIds),
      participantCount: participantPlayerIds.length,
      passedCount: passedPlayerIds.length,
      waitingCount,
      eligibleCount: eligiblePlayerIds.length,
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
    openingBidderPlayerId: auction.openingBidderPlayerId
      ?? pending.openingBidderPlayerId
      ?? auction.requesterPlayerId
      ?? pending.requesterPlayerId
      ?? participantPlayerIds[0]
      ?? null,
    participantPlayerIds: Object.freeze([...participantPlayerIds]),
    participantCards: participantCards(
      state,
      participantPlayerIds,
      auction.openingBidderPlayerId ?? pending.openingBidderPlayerId ?? null,
    ),
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
  link.href = new URL("../css/auction-ui.css?v=20260922-r2", import.meta.url).href;
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
  const title = documentObject.createElement("strong");
  const timer = documentObject.createElement("span");
  timer.className = "auction-action-panel__timer";
  timer.dataset.auctionTimer = "";
  heading.append(badge, title, timer);

  const status = documentObject.createElement("p");
  status.className = "auction-action-panel__status";

  const bidEvent = documentObject.createElement("div");
  bidEvent.className = "auction-action-panel__bid-event";
  bidEvent.hidden = true;
  bidEvent.setAttribute("aria-hidden", "true");
  const bidEventPaddle = documentObject.createElement("span");
  bidEventPaddle.className = "auction-action-panel__bid-paddle";
  bidEventPaddle.textContent = "BID";
  const bidEventCopy = documentObject.createElement("div");
  const bidEventPlayer = documentObject.createElement("span");
  bidEventPlayer.className = "auction-action-panel__bid-player";
  const bidEventAmount = documentObject.createElement("strong");
  bidEventAmount.className = "auction-action-panel__bid-amount";
  bidEventCopy.append(bidEventPlayer, bidEventAmount);
  bidEvent.append(bidEventPaddle, bidEventCopy);

  const summary = documentObject.createElement("div");
  summary.className = "auction-action-panel__summary";
  const primaryMetric = documentObject.createElement("div");
  primaryMetric.className = "auction-action-panel__metric";
  const primaryMetricLabel = documentObject.createElement("span");
  const primaryMetricValue = documentObject.createElement("strong");
  primaryMetric.append(primaryMetricLabel, primaryMetricValue);
  const secondaryMetric = documentObject.createElement("div");
  secondaryMetric.className = "auction-action-panel__metric";
  const secondaryMetricLabel = documentObject.createElement("span");
  const secondaryMetricValue = documentObject.createElement("strong");
  secondaryMetric.append(secondaryMetricLabel, secondaryMetricValue);
  summary.append(primaryMetric, secondaryMetric);

  const participantCard = documentObject.createElement("section");
  participantCard.className = "auction-action-panel__participants";
  const participantHeading = documentObject.createElement("div");
  participantHeading.className = "auction-action-panel__participants-heading";
  const participantTitle = documentObject.createElement("strong");
  participantTitle.textContent = "경매 참가자";
  const participantMeta = documentObject.createElement("span");
  participantHeading.append(participantTitle, participantMeta);
  const participantList = documentObject.createElement("div");
  participantList.className = "auction-action-panel__participants-list";
  participantCard.append(participantHeading, participantList);

  const detail = documentObject.createElement("p");
  detail.className = "auction-action-panel__detail";

  const voteRow = documentObject.createElement("div");
  voteRow.className = "auction-action-panel__vote";
  const primaryButton = documentObject.createElement("button");
  primaryButton.type = "button";
  primaryButton.className = "primary-button";
  primaryButton.textContent = "경매 참가";
  const secondaryButton = documentObject.createElement("button");
  secondaryButton.type = "button";
  secondaryButton.className = "secondary-button";
  secondaryButton.textContent = "경매 포기";
  voteRow.append(primaryButton, secondaryButton);

  const bidRow = documentObject.createElement("div");
  bidRow.className = "auction-action-panel__bid";
  const bidInput = documentObject.createElement("input");
  bidInput.type = "number";
  bidInput.inputMode = "numeric";
  bidInput.step = "1";
  bidInput.setAttribute("aria-label", "경매 입찰가");
  const bidButton = documentObject.createElement("button");
  bidButton.type = "button";
  bidButton.className = "primary-button";
  bidButton.textContent = "입찰";
  const passButton = documentObject.createElement("button");
  passButton.type = "button";
  passButton.className = "secondary-button";
  passButton.textContent = "포기";
  bidRow.append(bidInput, bidButton, passButton);

  panel.append(heading, status, bidEvent, summary, participantCard, detail, voteRow, bidRow);
  const modalHost = documentObject.body ?? dock;
  modalHost.prepend(panel);
  return {
    panel,
    badge,
    title,
    timer,
    status,
    bidEvent,
    bidEventPlayer,
    bidEventAmount,
    primaryMetricLabel,
    primaryMetricValue,
    secondaryMetricLabel,
    secondaryMetricValue,
    participantMeta,
    participantList,
    detail,
    voteRow,
    primaryButton,
    secondaryButton,
    bidRow,
    bidInput,
    bidButton,
    passButton,
  };
}

function renderParticipantList(documentObject, elements, model) {
  const cards = model.participantCards ?? [];
  elements.participantMeta.textContent = model.stage === "vote"
    ? `참가 ${model.participantCount} · 포기 ${model.passedCount} · 대기 ${model.waitingCount} · 순서는 룰렛 결정`
    : `${cards.length}명 · 룰렛 결정 입찰 순서`;

  if (cards.length === 0) {
    const empty = documentObject.createElement("p");
    empty.className = "auction-action-panel__participants-empty";
    empty.textContent = "아직 경매 참가자가 없습니다";
    elements.participantList.replaceChildren(empty);
    return;
  }

  elements.participantList.replaceChildren(...cards.map((card) => {
    const row = documentObject.createElement("div");
    row.className = "auction-action-panel__participant-row";
    if (model.stage === "auction" && card.id === model.turnPlayerId) {
      row.dataset.currentTurn = "true";
    }

    const order = documentObject.createElement("span");
    order.className = "auction-action-panel__participant-order";
    order.textContent = model.stage === "vote" ? "•" : String(card.order);

    const name = documentObject.createElement("strong");
    name.textContent = card.name;

    const badges = documentObject.createElement("span");
    badges.className = "auction-action-panel__participant-badges";
    if (model.stage === "auction" && card.openingBidder) {
      const firstBid = documentObject.createElement("span");
      firstBid.className = "auction-action-panel__first-bid";
      firstBid.textContent = "첫 입찰";
      badges.append(firstBid);
    }
    if (model.stage === "auction" && card.id === model.turnPlayerId) {
      const currentTurn = documentObject.createElement("span");
      currentTurn.className = "auction-action-panel__turn-badge";
      currentTurn.textContent = "입찰 차례";
      badges.append(currentTurn);
    }

    row.append(order, name, badges);
    return row;
  }));
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
  clock = null,
  setTimeoutFn = globalThis.setTimeout,
  clearTimeoutFn = globalThis.clearTimeout,
} = {}) {
  if (!roomId) throw new Error("ROOM_ID_REQUIRED");
  if (!session) throw new Error("ONLINE_AUCTION_SESSION_NOT_READY");
  const dock = documentObject.querySelector("[data-board-action-dock]");
  if (!dock) throw new Error("ONLINE_AUCTION_DOCK_MISSING");

  ensureAuctionStyles(documentObject);
  const elements = createPanel(documentObject, dock);
  const startSequenceView = createAuctionStartSequenceView({
    documentObject,
    playStartSound: playAuctionStartSound,
    setTimeoutFn,
    clearTimeoutFn,
  });
  elements.panel.addEventListener("pointerdown", prepareAuctionBidSound, { once: true });
  let disposed = false;
  let busy = false;
  let errorText = "";
  let deadlineTimer = null;
  let tickerTimer = null;
  let bidEventTimer = null;
  let highestBidAnimationFrame = null;
  let displayedHighestBid = null;
  const shownBidEventKeys = new Set();

  function nowMs() {
    if (typeof clock === "function") return Number(clock());
    const serverNow = Number(session.getServerNowMs?.());
    return Number.isFinite(serverNow) ? serverNow : Date.now();
  }

  function clearTimers() {
    if (deadlineTimer !== null) clearTimeoutFn?.(deadlineTimer);
    if (tickerTimer !== null) clearTimeoutFn?.(tickerTimer);
    deadlineTimer = null;
    tickerTimer = null;
  }

  function showBidEvent(state) {
    const event = state?.lastEvents?.find?.((candidate) => candidate.type === "AUCTION_BID_PLACED");
    if (!event) return;
    const key = `${state.version ?? "v"}:${event.playerId}:${event.amount}`;
    if (shownBidEventKeys.has(key)) return;
    shownBidEventKeys.add(key);

    const player = findPlayer(state, event.playerId);
    elements.bidEventPlayer.textContent = playerName(player);
    elements.bidEventAmount.textContent = money(event.amount);
    elements.bidEvent.dataset.surge = event.surge === true ? "true" : "false";
    elements.bidEvent.hidden = false;
    elements.bidEvent.dataset.active = "false";
    void elements.bidEvent.offsetWidth;
    elements.bidEvent.dataset.active = "true";
    playAuctionBidSound();

    if (bidEventTimer !== null) clearTimeoutFn?.(bidEventTimer);
    bidEventTimer = setTimeoutFn?.(() => {
      bidEventTimer = null;
      elements.bidEvent.dataset.active = "false";
      elements.bidEvent.hidden = true;
    }, BID_EVENT_HOLD_MS) ?? null;
  }

  function cancelHighestBidAnimation({ reset = false } = {}) {
    if (highestBidAnimationFrame !== null && typeof globalThis.cancelAnimationFrame === "function") {
      globalThis.cancelAnimationFrame(highestBidAnimationFrame);
    }
    highestBidAnimationFrame = null;
    elements.primaryMetricValue.dataset.counting = "false";
    if (reset) displayedHighestBid = null;
  }

  function renderHighestBid(value) {
    const target = Number(value) || 0;
    if (displayedHighestBid === null) {
      displayedHighestBid = target;
      elements.primaryMetricValue.textContent = money(target);
      elements.primaryMetricValue.dataset.counting = "false";
      return;
    }
    if (displayedHighestBid === target) return;

    const startValue = displayedHighestBid;
    displayedHighestBid = target;
    cancelHighestBidAnimation();

    const reduceMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
    if (target <= startValue || reduceMotion || typeof globalThis.requestAnimationFrame !== "function") {
      elements.primaryMetricValue.textContent = money(target);
      return;
    }

    elements.primaryMetricValue.dataset.counting = "true";
    let startedAt = null;
    const frame = (timestamp) => {
      if (startedAt === null) startedAt = Number(timestamp);
      const progress = Math.min(1, Math.max(0, (Number(timestamp) - startedAt) / HIGHEST_BID_COUNT_MS));
      const eased = 1 - ((1 - progress) ** 3);
      const currentValue = Math.round(startValue + ((target - startValue) * eased));
      elements.primaryMetricValue.textContent = money(currentValue);
      if (progress < 1) {
        highestBidAnimationFrame = globalThis.requestAnimationFrame(frame);
        return;
      }
      highestBidAnimationFrame = null;
      elements.primaryMetricValue.textContent = money(target);
      elements.primaryMetricValue.dataset.counting = "false";
    };
    highestBidAnimationFrame = globalThis.requestAnimationFrame(frame);
  }

  function updateTimer(model) {
    const deadline = Number(model?.deadlineAt);
    if (!Number.isFinite(deadline)) {
      elements.timer.textContent = "";
      return;
    }
    const seconds = Math.max(0, Math.ceil((deadline - nowMs()) / 1000));
    elements.timer.textContent = `${seconds}초`;
  }

  function scheduleDeadline(model) {
    clearTimers();
    if (!Number.isFinite(Number(model?.deadlineAt))) return;
    const delay = Math.max(0, Number(model.deadlineAt) - nowMs());
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
      if (current && Number(current.deadlineAt) > nowMs()) {
        tickerTimer = setTimeoutFn?.(tick, 250) ?? null;
      }
    };
    tickerTimer = setTimeoutFn?.(tick, 250) ?? null;
  }

  function render(state = session.getState()) {
    if (disposed) return;
    showBidEvent(state);
    const model = createOnlineAuctionUiModel(state, session.getViewerPlayerId());
    startSequenceView.render(model);
    if (!model) {
      clearTimers();
      cancelHighestBidAnimation({ reset: true });
      elements.panel.hidden = true;
      elements.panel.dataset.auctionStage = "";
      return;
    }

    if (model.stage === "start_notice" || model.stage === "roulette") {
      cancelHighestBidAnimation({ reset: true });
      elements.panel.hidden = true;
      elements.panel.dataset.auctionStage = model.stage;
      scheduleDeadline(model);
      return;
    }

    elements.panel.hidden = false;
    elements.panel.dataset.auctionStage = model.stage;
    elements.title.textContent = model.nodeLabel;
    updateTimer(model);
    renderParticipantList(documentObject, elements, model);

    elements.voteRow.hidden = model.stage !== "vote";
    elements.bidRow.hidden = model.stage !== "auction";
    elements.status.hidden = model.stage === "auction";
    elements.detail.hidden = model.stage === "auction";

    if (model.stage === "vote") {
      elements.badge.textContent = "경매 참가 투표";
      elements.status.textContent = errorText || "참가 또는 포기를 한 번만 선택할 수 있습니다";
      cancelHighestBidAnimation({ reset: true });
      elements.primaryMetricLabel.textContent = "경매 시작가";
      elements.primaryMetricValue.textContent = money(model.openingBid);
      elements.secondaryMetricLabel.textContent = "내 보유 골드";
      elements.secondaryMetricValue.textContent = money(model.viewerGold);
      elements.detail.textContent = "15초 안에 모두 결정하면 모집이 마감됩니다. 참가 순서와 관계없이 경매 시작 전 룰렛으로 첫 입찰자를 정합니다.";

      elements.voteRow.hidden = !model.eligible && !model.insufficientGold;
      elements.voteRow.dataset.singleAction = model.insufficientGold ? "true" : "false";
      elements.primaryButton.hidden = false;
      elements.secondaryButton.hidden = false;
      if (model.insufficientGold) {
        elements.status.textContent = "경매 시작가보다 보유 골드가 부족해 참가할 수 없습니다";
        elements.primaryButton.textContent = "보유 골드 부족";
        elements.primaryButton.disabled = true;
        elements.secondaryButton.hidden = true;
      } else {
        elements.primaryButton.textContent = model.participant ? "참가 확정" : "경매 참가";
        elements.secondaryButton.textContent = model.passed ? "포기 확정" : "경매 포기";
        elements.primaryButton.disabled = busy || !model.canJoin;
        elements.secondaryButton.disabled = busy || !model.canVotePass;
      }
    } else {
      elements.badge.textContent = "경매 진행";
      elements.primaryMetricLabel.textContent = "현재 최고가";
      renderHighestBid(model.highestBid);
      elements.secondaryMetricLabel.textContent = "다음 최소 입찰가";
      elements.secondaryMetricValue.textContent = money(model.minimumBid);
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
    if (model?.stage === "vote" && model.canJoin) void runAction(() => session.joinAuction());
  });

  elements.secondaryButton.addEventListener("click", () => {
    const model = createOnlineAuctionUiModel(session.getState(), session.getViewerPlayerId());
    if (model?.stage === "vote" && model.canVotePass) void runAction(() => session.passAuctionVote());
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
    cancelHighestBidAnimation({ reset: true });
    if (bidEventTimer !== null) clearTimeoutFn?.(bidEventTimer);
    unsubscribeState?.();
    documentObject.removeEventListener("click", handlePurchaseDecline, true);
    startSequenceView.dispose();
    elements.panel.remove();
  };
}
