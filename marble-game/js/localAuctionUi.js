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

function choosePlayerId(playerIds, selectedPlayerId) {
  if (playerIds.includes(selectedPlayerId)) return selectedPlayerId;
  return playerIds[0] ?? null;
}

function deadlineMs(value) {
  if (value === null || value === undefined) return null;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

export function createLocalAuctionUiModel(state, selectedPlayerId = null) {
  const pending = state?.pendingChoice;
  if (!pending || !["AUCTION_REQUEST", "AUCTION_RECRUITMENT", "PROPERTY_AUCTION"].includes(pending.type)) {
    return null;
  }

  const node = findNode(state, pending.nodeId);
  const stage = pending.type === "AUCTION_REQUEST"
    ? "request"
    : pending.type === "AUCTION_RECRUITMENT"
      ? "recruitment"
      : "auction";
  const auction = stage === "auction" ? (pending.auction ?? {}) : null;
  const eligiblePlayerIds = stage === "auction"
    ? (auction?.participantPlayerIds ?? [])
    : (pending.eligiblePlayerIds ?? []);
  const activePlayerId = choosePlayerId(eligiblePlayerIds, selectedPlayerId);
  const activePlayer = findPlayer(state, activePlayerId);
  const openingBid = Number(pending.openingBid ?? auction?.openingBid) || 0;

  const base = {
    stage,
    nodeId: pending.nodeId,
    nodeLabel: node?.label ?? pending.nodeId,
    openingBid,
    selectedPlayerId: activePlayerId,
    selectedPlayerName: playerName(activePlayer),
    selectedPlayerGold: Number(activePlayer?.money) || 0,
    deadlineAt: deadlineMs(stage === "auction" ? auction?.turnDeadlineAt : pending.deadlineAt),
    playerOptions: eligiblePlayerIds.map((playerId) => {
      const player = findPlayer(state, playerId);
      return Object.freeze({
        id: playerId,
        name: playerName(player),
        gold: Number(player?.money) || 0,
      });
    }),
  };

  if (stage === "request") {
    return Object.freeze({
      ...base,
      declinedByPlayerId: pending.declinedByPlayerId ?? null,
      eligible: pending.eligiblePlayerIds?.includes(activePlayerId) === true,
      canRequest: Boolean(activePlayerId)
        && pending.eligiblePlayerIds?.includes(activePlayerId) === true
        && base.selectedPlayerGold >= openingBid,
    });
  }

  if (stage === "recruitment") {
    const participantPlayerIds = pending.participantPlayerIds ?? [];
    const participant = participantPlayerIds.includes(activePlayerId);
    const requester = pending.requesterPlayerId === activePlayerId;
    return Object.freeze({
      ...base,
      requesterPlayerId: pending.requesterPlayerId ?? null,
      requesterName: playerName(findPlayer(state, pending.requesterPlayerId)),
      participantPlayerIds: Object.freeze([...participantPlayerIds]),
      participantCount: participantPlayerIds.length,
      participant,
      requester,
      canJoin: Boolean(activePlayerId)
        && !participant
        && pending.eligiblePlayerIds?.includes(activePlayerId) === true
        && base.selectedPlayerGold >= openingBid,
      canWithdraw: Boolean(activePlayerId) && participant && !requester,
    });
  }

  const participantPlayerIds = auction?.participantPlayerIds ?? [];
  const passedPlayerIds = auction?.passedPlayerIds ?? [];
  const highestBid = Number(auction?.highestBid) || 0;
  const minimumBid = highestBid > 0 ? highestBid + 1 : openingBid;
  const highestBidderId = auction?.highestBidderId ?? null;
  const turnPlayerId = auction?.turnPlayerId ?? null;
  const participant = participantPlayerIds.includes(activePlayerId);
  const passed = passedPlayerIds.includes(activePlayerId);
  const isTurn = turnPlayerId === activePlayerId;
  const canAfford = base.selectedPlayerGold >= minimumBid;

  return Object.freeze({
    ...base,
    participantPlayerIds: Object.freeze([...participantPlayerIds]),
    highestBid,
    highestBidderId,
    highestBidderName: highestBidderId ? playerName(findPlayer(state, highestBidderId)) : null,
    minimumBid,
    turnPlayerId,
    turnPlayerName: turnPlayerId ? playerName(findPlayer(state, turnPlayerId)) : null,
    participant,
    passed,
    isTurn,
    canBid: participant && !passed && isTurn && canAfford,
    canPass: participant && !passed && isTurn,
    passLabel: passed ? "포기 완료" : isTurn ? "포기" : "차례 대기",
  });
}

function ensureAuctionStyles(documentObject) {
  if (documentObject.querySelector("link[data-auction-style]")) return;
  const link = documentObject.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL("../css/auction-ui.css?v=20260919-r1", import.meta.url).href;
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
  const timer = documentObject.createElement("span");
  timer.className = "auction-action-panel__timer";
  timer.dataset.auctionTimer = "";
  heading.append(badge, title, timer);

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
  const primaryButton = documentObject.createElement("button");
  primaryButton.type = "button";
  primaryButton.className = "primary-button";
  const secondaryButton = documentObject.createElement("button");
  secondaryButton.type = "button";
  secondaryButton.className = "secondary-button";
  requestRow.append(primaryButton, secondaryButton);

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
  passButton.textContent = "포기";
  bidRow.append(bidInput, bidButton, passButton);

  panel.append(heading, status, detail, participantRow, requestRow, bidRow);
  const modalHost = documentObject.body ?? dock;
  modalHost.prepend(panel);
  return {
    panel, badge, title, timer, status, detail, participantRow, playerSelect,
    requestRow, primaryButton, secondaryButton, bidRow, bidInput, bidButton, passButton,
  };
}

function showAutoPurchaseResult(documentObject, state, shownKeys) {
  const event = state?.lastEvents?.find?.((candidate) => candidate.type === "AUCTION_AUTO_PURCHASED");
  if (!event) return;
  const key = `${state.version ?? "v"}:${event.nodeId}:${event.playerId}:${event.amount}`;
  if (shownKeys.has(key)) return;
  shownKeys.add(key);
  const player = findPlayer(state, event.playerId);
  const node = findNode(state, event.nodeId);
  const dialog = documentObject.createElement("dialog");
  dialog.className = "auction-result-modal";
  const title = documentObject.createElement("strong");
  title.textContent = "매입에 성공하셨습니다";
  const detail = documentObject.createElement("p");
  detail.textContent = `${playerName(player)} · ${node?.label ?? event.nodeId} · ${money(event.amount)}`;
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

export function setupLocalAuctionUi({
  session,
  documentObject = document,
  onStateChange = () => {},
  clock = Date.now,
  setTimeoutFn = globalThis.setTimeout,
  clearTimeoutFn = globalThis.clearTimeout,
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
  let deadlineTimer = null;
  let tickerTimer = null;
  const shownResultKeys = new Set();

  function clearTimers() {
    if (deadlineTimer !== null) clearTimeoutFn?.(deadlineTimer);
    if (tickerTimer !== null) clearTimeoutFn?.(tickerTimer);
    deadlineTimer = null;
    tickerTimer = null;
  }

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
      runAction(() => session.advanceAuctionDeadline());
    }, delay);
    const tick = () => {
      tickerTimer = null;
      if (disposed) return;
      updateTimer(createLocalAuctionUiModel(session.getState(), selectedPlayerId));
      const current = createLocalAuctionUiModel(session.getState(), selectedPlayerId);
      if (current && Number(current.deadlineAt) > Number(clock())) {
        tickerTimer = setTimeoutFn?.(tick, 250) ?? null;
      }
    };
    tickerTimer = setTimeoutFn?.(tick, 250) ?? null;
  }

  function render(state = session.getState()) {
    if (disposed) return;
    showAutoPurchaseResult(documentObject, state, shownResultKeys);
    const model = createLocalAuctionUiModel(state, selectedPlayerId);
    if (!model) {
      clearTimers();
      elements.panel.hidden = true;
      elements.panel.dataset.auctionStage = "";
      return;
    }

    selectedPlayerId = model.selectedPlayerId;
    elements.panel.hidden = false;
    elements.panel.dataset.auctionStage = model.stage;
    elements.title.textContent = model.nodeLabel;
    syncPlayerOptions(model);
    updateTimer(model);

    elements.requestRow.hidden = model.stage === "auction";
    elements.bidRow.hidden = model.stage !== "auction";
    elements.primaryButton.hidden = false;
    elements.secondaryButton.hidden = false;

    if (model.stage === "request") {
      elements.badge.textContent = "경매 요청";
      elements.status.textContent = errorText || "10초 안에 경매 개최 의사를 선택하세요";
      elements.detail.textContent = `시작가 ${money(model.openingBid)} · 요청 시 해당 가격 구매 책임`;
      elements.primaryButton.textContent = `${model.selectedPlayerName} 경매 요청`;
      elements.primaryButton.disabled = busy || !model.canRequest;
      elements.secondaryButton.hidden = true;
    } else if (model.stage === "recruitment") {
      elements.badge.textContent = "참가 모집";
      elements.status.textContent = errorText || `${model.requesterName} 요청 · 참가 ${model.participantCount}명`;
      elements.detail.textContent = `시작가 ${money(model.openingBid)} · 10초 안에 참가/철회 가능`;
      elements.primaryButton.textContent = model.participant ? "참가 완료" : "참가";
      elements.primaryButton.disabled = busy || !model.canJoin;
      elements.secondaryButton.textContent = "참가 철회";
      elements.secondaryButton.hidden = !model.canWithdraw;
      elements.secondaryButton.disabled = busy || !model.canWithdraw;
    } else {
      elements.badge.textContent = "경매 진행";
      elements.status.textContent = errorText || `현재 최고가 ${money(model.highestBid)} · ${model.highestBidderName ?? "입찰자"}`;
      elements.detail.textContent = `현재 차례 ${model.turnPlayerName ?? "-"} · 다음 최소 ${money(model.minimumBid)} · ${model.selectedPlayerName} 보유 ${money(model.selectedPlayerGold)}`;
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
    scheduleDeadline(model);
  }

  function runAction(action) {
    if (disposed || busy) return;
    busy = true;
    errorText = "";
    clearTimers();
    try {
      const state = action();
      onStateChange(state);
      render(state);
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

  elements.primaryButton.addEventListener("click", () => {
    if (!selectedPlayerId) return;
    const model = createLocalAuctionUiModel(session.getState(), selectedPlayerId);
    if (model?.stage === "request") runAction(() => session.requestAuction(selectedPlayerId));
    else if (model?.stage === "recruitment") runAction(() => session.joinAuction(selectedPlayerId));
  });

  elements.secondaryButton.addEventListener("click", () => {
    if (!selectedPlayerId) return;
    const model = createLocalAuctionUiModel(session.getState(), selectedPlayerId);
    if (model?.stage === "recruitment") runAction(() => session.withdrawAuction(selectedPlayerId));
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
      clearTimers();
      elements.panel.remove();
    },
  });
}
