import {
  GAME_ACCESS_REASON,
  GAME_CONNECTION_STATE,
  createGameAccessGate,
  createGameShell,
} from "../shared/index.js";
import {
  getAuthState,
  initializeAuth,
  subscribeAuth,
} from "../../js/auth.js";
import { supabase } from "../../js/supabaseClient.js";
import { getPublicProfiles, getSignedAvatarUrl } from "../../js/api/profiles.js";
import { el } from "../../js/ui.js";
import {
  NO_THANKS_LOBBY_VIEW,
  createNoThanksLobbyViewModel,
  getNoThanksLobbyErrorMessage,
} from "./runtimeModel.js";
import { createNoThanksLobbyController } from "./lobbyController.js";
import { createNoThanksRoomLobbyAdapter } from "./roomLobby.js";
import { createNoThanksGameplayAdapter } from "./gameplay.js";
import { createNoThanksPresenceAdapter } from "./presence.js";
import {
  getBoardSeatCoordinates,
  getNoThanksCardTone,
  getNoThanksDeckVisualCount,
  getNoThanksHandOverlap,
  getNoThanksResultHandMargins,
  getNoThanksResultHandOverlap,
  getNoThanksVisibleChipCount,
  orderBoardPlayers,
} from "./boardLayout.js";

const app = document.getElementById("app");
const DEFAULT_BOARD_AVATAR_URL = "../../assets/images/default-avatar.svg";

const accessGate = createGameAccessGate({
  initialize: initializeAuth,
  getState: getAuthState,
  subscribe: subscribeAuth,
});

let unsubscribeAccess = null;
let lobbyController = null;
let lobbyUserId = null;
let bootEpoch = 0;
let boardRoomId = null;
let seatedPlayerIds = new Set();
let boardAvatarUrls = new Map();
let boardAvatarLoadingIds = new Set();
let boardPresentationState = null;
let boardPresentationEffect = null;
let pendingTakePresentation = null;
let lastSettledDealKey = null;
let acknowledgedWinnerCelebrationKey = null;
let resultHandLayoutFrame = null;
const WINNER_CELEBRATION_STORAGE_KEY = "no-thanks:winner-celebration";

function replaceApp(node) {
  app.replaceChildren(node);
}

function disposeLobbyController() {
  lobbyController?.dispose();
  lobbyController = null;
  lobbyUserId = null;
  boardRoomId = null;
  seatedPlayerIds = new Set();
  boardAvatarUrls = new Map();
  boardAvatarLoadingIds = new Set();
  boardPresentationState = null;
  boardPresentationEffect = null;
  clearPendingTakePresentation();
  if (resultHandLayoutFrame != null) {
    window.cancelAnimationFrame(resultHandLayoutFrame);
    resultHandLayoutFrame = null;
  }
}

function createAccessNotice({
  title,
  message,
  href,
  linkText,
  retry = null,
}) {
  return el("main", { className: "no-thanks-access" }, [
    el("section", { className: "no-thanks-access__card" }, [
      el("p", { className: "no-thanks-access__eyebrow", text: "NO THANKS!" }),
      el("h1", { className: "no-thanks-access__title", text: title }),
      el("p", { className: "no-thanks-access__message", text: message }),
      el("div", { className: "no-thanks-access__actions" }, [
        href
          ? el("a", {
            className: "button",
            href,
            text: linkText,
          })
          : null,
        typeof retry === "function"
          ? el("button", {
            className: "button button--secondary",
            type: "button",
            text: "다시 확인",
            onClick: retry,
          })
          : null,
        el("a", {
          className: "button button--ghost",
          href: "/#/games",
          text: "게임 목록으로",
        }),
      ]),
    ]),
  ]);
}

function createRulesDialog() {
  const dialog = el("dialog", {
    className: "no-thanks-rules",
    "aria-labelledby": "no-thanks-rules-title",
  });

  const closeButton = el("button", {
    className: "no-thanks-rules__close",
    type: "button",
    text: "닫기",
    "aria-label": "게임 규칙 닫기",
    onClick: () => dialog.close(),
  });

  const ruleCard = (number, title, body, className = "") => el("section", {
    className: `no-thanks-rules__rule-card${className ? ` ${className}` : ""}`,
  }, [
    el("span", { className: "no-thanks-rules__step", text: String(number).padStart(2, "0") }),
    el("div", { className: "no-thanks-rules__rule-copy" }, [
      el("h3", { text: title }),
      body,
    ]),
  ]);

  const scoreCard = (value, tone = "blue") => el("span", {
    className: "no-thanks-rules__score-card",
    dataset: { tone },
    text: String(value),
  });

  dialog.append(el("div", { className: "no-thanks-rules__content" }, [
    el("header", { className: "no-thanks-rules__header" }, [
      el("div", { className: "no-thanks-rules__heading" }, [
        el("p", { className: "no-thanks-rules__eyebrow", text: "HOW TO PLAY" }),
        el("h2", {
          id: "no-thanks-rules-title",
          className: "no-thanks-rules__title",
          text: "No Thanks! 기본 규칙",
        }),
        el("p", {
          className: "no-thanks-rules__subtitle",
          text: "카드를 피할지, 칩과 함께 가져갈지. 가장 낮은 점수를 만드는 사람이 승리합니다.",
        }),
      ]),
      el("div", { className: "no-thanks-rules__hero", "aria-hidden": "true" }, [
        el("span", { className: "no-thanks-rules__hero-card", text: "24" }),
        el("span", { className: "no-thanks-rules__hero-chip no-thanks-rules__hero-chip--one" }),
        el("span", { className: "no-thanks-rules__hero-chip no-thanks-rules__hero-chip--two" }),
        el("span", { className: "no-thanks-rules__hero-chip no-thanks-rules__hero-chip--three" }),
      ]),
      closeButton,
    ]),
    el("div", { className: "no-thanks-rules__body" }, [
      el("section", { className: "no-thanks-rules__goal" }, [
        el("span", { className: "no-thanks-rules__goal-label", text: "GOAL" }),
        el("strong", { text: "가장 낮은 최종 점수를 만들어라" }),
        el("p", {
          text: "숫자 카드 점수에서 마지막에 남은 칩 수를 뺀 값이 최종 점수입니다.",
        }),
      ]),
      ruleCard(1, "게임 준비", el("div", { className: "no-thanks-rules__setup" }, [
        el("div", { className: "no-thanks-rules__setup-item" }, [
          el("strong", { text: "3–35" }),
          el("span", { text: "숫자 카드 33장" }),
        ]),
        el("div", { className: "no-thanks-rules__setup-arrow", text: "→", "aria-hidden": "true" }),
        el("div", { className: "no-thanks-rules__setup-item" }, [
          el("strong", { text: "9장" }),
          el("span", { text: "보지 않고 제외" }),
        ]),
        el("div", { className: "no-thanks-rules__setup-arrow", text: "→", "aria-hidden": "true" }),
        el("div", { className: "no-thanks-rules__setup-item is-accent" }, [
          el("strong", { text: "24장" }),
          el("span", { text: "실제 게임 덱" }),
        ]),
        el("p", {
          className: "no-thanks-rules__setup-note",
          text: "3~5명은 칩 11개, 6명은 9개, 7명은 7개로 시작합니다. 개인 칩 수는 다른 플레이어에게 공개하지 않습니다.",
        }),
      ])),
      ruleCard(2, "내 차례에는 둘 중 하나", el("div", { className: "no-thanks-rules__choice-grid" }, [
        el("article", { className: "no-thanks-rules__choice no-thanks-rules__choice--refuse" }, [
          el("div", { className: "no-thanks-rules__choice-icon" }, [
            el("span", { className: "no-thanks-rules__choice-chip" }),
          ]),
          el("div", {}, [
            el("strong", { text: "NO THANKS!" }),
            el("p", { text: "칩 1개를 현재 카드 위에 놓고 다음 플레이어에게 넘깁니다." }),
          ]),
        ]),
        el("article", { className: "no-thanks-rules__choice no-thanks-rules__choice--take" }, [
          el("div", { className: "no-thanks-rules__choice-icon" }, [
            el("span", { className: "no-thanks-rules__choice-card", text: "17" }),
          ]),
          el("div", {}, [
            el("strong", { text: "TAKE" }),
            el("p", { text: "현재 카드와 카드 위에 쌓인 모든 칩을 가져옵니다." }),
          ]),
        ]),
        el("p", {
          className: "no-thanks-rules__choice-note",
          text: "칩이 0개라면 거절할 수 없습니다. 카드를 가져온 플레이어가 다음 공개 카드에서도 계속 선택합니다.",
        }),
      ])),
      ruleCard(3, "연속 숫자는 한 묶음", el("div", { className: "no-thanks-rules__score-demo" }, [
        el("div", { className: "no-thanks-rules__score-hand", "aria-label": "예시 카드 3, 10, 11, 12, 20" }, [
          scoreCard(3, "teal"),
          el("span", { className: "no-thanks-rules__score-gap", "aria-hidden": "true" }),
          scoreCard(10, "blue"),
          scoreCard(11, "blue"),
          scoreCard(12, "blue"),
          el("span", { className: "no-thanks-rules__score-gap", "aria-hidden": "true" }),
          scoreCard(20, "yellow"),
        ]),
        el("div", { className: "no-thanks-rules__equation" }, [
          el("span", { text: "카드 점수" }),
          el("strong", { text: "3 + 10 + 20 = 33" }),
          el("span", { className: "no-thanks-rules__equation-minus", text: "− 칩 5개" }),
          el("strong", { className: "no-thanks-rules__equation-final", text: "최종 28점" }),
        ]),
        el("p", {
          text: "10·11·12처럼 연속된 숫자 묶음에서는 가장 낮은 숫자 10만 점수에 포함됩니다.",
        }),
      ])),
      ruleCard(4, "마지막 카드까지 가져가면 종료", el("div", { className: "no-thanks-rules__finish" }, [
        el("span", { className: "no-thanks-rules__finish-badge", text: "LOWEST SCORE WINS" }),
        el("p", {
          text: "모든 카드가 분배되면 게임이 끝납니다. 최종 점수가 가장 낮은 플레이어가 승리하며, 같은 최저 점수라면 공동 승리입니다.",
        }),
      ]), "no-thanks-rules__rule-card--finish"),
    ]),
  ]));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  return dialog;
}

function profileDisplayName(authState) {
  const displayName = authState.profile?.display_name;
  return typeof displayName === "string" && displayName.trim()
    ? displayName.trim()
    : null;
}

function createField(label, control) {
  return el("label", { className: "no-thanks-field" }, [
    el("span", { className: "no-thanks-field__label", text: label }),
    control,
  ]);
}

function createInlineError(error) {
  if (!error) return null;
  return el("div", {
    className: "no-thanks-inline-error",
    role: "alert",
    text: getNoThanksLobbyErrorMessage(error),
  });
}

function createEntryPanel(state, displayName) {
  const createForm = el("form", {
    className: "no-thanks-entry-card",
    onSubmit: async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      try {
        await lobbyController.createRoom({
          maxPlayers: Number(data.get("maxPlayers")),
        });
      } catch {
        // Controller state renders the authoritative error.
      }
    },
  }, [
    el("p", { className: "no-thanks-entry-card__eyebrow", text: "CREATE ROOM" }),
    el("h2", { className: "no-thanks-entry-card__title", text: "새 방 만들기" }),
    el("p", {
      className: "no-thanks-entry-card__description",
      text: `${displayName}님의 사이트 프로필 이름으로 새 방을 만들어요.`,
    }),
    createField("최대 인원", el("select", {
      className: "no-thanks-input",
      name: "maxPlayers",
    }, [3, 4, 5, 6, 7].map((count) => el("option", {
      value: String(count),
      text: `${count}명`,
      selected: count === 7,
    })))),
    el("button", {
      className: "button no-thanks-entry-card__submit",
      type: "submit",
      text: state.busy ? "방 만드는 중…" : "방 만들기",
      disabled: state.busy,
    }),
  ]);

  const joinForm = el("form", {
    className: "no-thanks-entry-card",
    onSubmit: async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      try {
        await lobbyController.joinRoom({
          roomCode: String(data.get("roomCode") ?? ""),
        });
      } catch {
        // Controller state renders the authoritative error.
      }
    },
  }, [
    el("p", { className: "no-thanks-entry-card__eyebrow", text: "JOIN ROOM" }),
    el("h2", { className: "no-thanks-entry-card__title", text: "코드로 참가" }),
    el("p", {
      className: "no-thanks-entry-card__description",
      text: "친구에게 받은 6자리 방 코드로 참가해요. 표시 이름은 사이트 프로필을 그대로 사용합니다.",
    }),
    createField("방 코드", el("input", {
      className: "no-thanks-input no-thanks-input--code",
      name: "roomCode",
      type: "text",
      minlength: "6",
      maxlength: "6",
      required: true,
      autocapitalize: "characters",
      autocomplete: "off",
      placeholder: "ABC234",
      onInput: (event) => {
        event.currentTarget.value = event.currentTarget.value
          .toUpperCase()
          .replace(/[^A-HJ-NP-Z2-9]/gu, "")
          .slice(0, 6);
      },
    })),
    el("button", {
      className: "button button--secondary no-thanks-entry-card__submit",
      type: "submit",
      text: state.busy ? "참가 중…" : "방 참가",
      disabled: state.busy,
    }),
  ]);

  return el("section", { className: "no-thanks-online-entry" }, [
    el("div", { className: "no-thanks-online-entry__intro" }, [
      el("p", { className: "no-thanks-entry__eyebrow", text: "ONLINE LOBBY" }),
      el("h2", { text: "함께 플레이할 방을 준비해 주세요." }),
      el("p", {
        text: "방을 만들거나 친구의 코드를 입력해 참가할 수 있어요. 게임 안에서는 별도 이름을 만들지 않습니다.",
      }),
    ]),
    createInlineError(state.error),
    el("div", { className: "no-thanks-online-entry__grid" }, [
      createForm,
      joinForm,
    ]),
  ]);
}

function createChipCluster(count, {
  compact = false,
  label = null,
  emptyText = "칩 없음",
} = {}) {
  const visibleCount = getNoThanksVisibleChipCount(count, { compact });
  return el("div", {
    className: "no-thanks-chip-cluster"
      + (compact ? " no-thanks-chip-cluster--compact" : "")
      + (visibleCount === 0 ? " is-empty" : ""),
    "aria-label": label ?? "칩 " + String(Number(count) || 0) + "개",
  }, visibleCount > 0
    ? Array.from({ length: visibleCount }, (_, index) => el("span", {
      className: "no-thanks-chip",
      style: { zIndex: String(index + 1) },
      "aria-hidden": "true",
    }))
    : [el("span", {
      className: "no-thanks-chip-cluster__empty-label",
      text: emptyText,
    })]);
}


function rectSnapshot(rect) {
  if (!rect) return null;
  const snapshot = {
    left: Number(rect.left),
    top: Number(rect.top),
    width: Number(rect.width),
    height: Number(rect.height),
  };
  return Object.values(snapshot).every(Number.isFinite) ? snapshot : null;
}

function clearPendingTakePresentation(expected = pendingTakePresentation) {
  if (!expected || pendingTakePresentation !== expected) return;
  expected.cardFlight?.remove();
  expected.chipFlights?.forEach((flight) => flight.remove());
  pendingTakePresentation = null;
}

function createTakeCardFlight(sourceCard) {
  const sourceRect = rectSnapshot(sourceCard?.getBoundingClientRect?.());
  const inner = sourceCard?.querySelector?.(".no-thanks-table-card__inner")?.cloneNode?.(true);
  if (!sourceRect || !inner) return null;

  const flight = document.createElement("div");
  flight.className = "no-thanks-card-flight no-thanks-take-card-flight";
  flight.dataset.tone = sourceCard.dataset.tone ?? "blue";
  flight.setAttribute("aria-hidden", "true");
  flight.append(inner);
  Object.assign(flight.style, {
    left: sourceRect.left.toFixed(2) + "px",
    top: sourceRect.top.toFixed(2) + "px",
    width: sourceRect.width.toFixed(2) + "px",
    height: sourceRect.height.toFixed(2) + "px",
  });
  document.body.append(flight);
  return flight;
}

function createTakeChipFlights(expectedCount) {
  const count = Math.max(0, Math.floor(Number(expectedCount) || 0));
  const chips = [...app.querySelectorAll(
    ".no-thanks-center-chips__visual .no-thanks-chip",
  )].slice(0, count);

  return chips.map((chip, index) => {
    const sourceRect = rectSnapshot(chip.getBoundingClientRect());
    if (!sourceRect) return null;

    const flight = chip.cloneNode(true);
    flight.className = "no-thanks-chip no-thanks-take-chip-flight";
    flight.setAttribute("aria-hidden", "true");
    Object.assign(flight.style, {
      left: sourceRect.left.toFixed(2) + "px",
      top: sourceRect.top.toFixed(2) + "px",
      width: sourceRect.width.toFixed(2) + "px",
      height: sourceRect.height.toFixed(2) + "px",
      zIndex: String(100 + index),
    });
    flight.dataset.transferIndex = String(index);
    document.body.append(flight);
    return flight;
  }).filter(Boolean);
}

function beginTakePresentation(view, sourceCard) {
  clearPendingTakePresentation();
  if (prefersReducedMotion()) return null;

  const viewer = view.players.find((player) => player.id === view.currentUserId);
  const cardFlight = createTakeCardFlight(sourceCard);
  if (!cardFlight) return null;

  const presentation = {
    roomId: view.roomId,
    sourceVersion: Number(view.version),
    cardValue: Number(view.currentCard),
    previousViewerCounters: Number(view.viewerCounters) || 0,
    previousViewerCards: [...(viewer?.cards ?? [])].sort((left, right) => left - right),
    chipCount: Math.max(0, Math.floor(Number(view.centerCounters) || 0)),
    cardFlight,
    chipFlights: createTakeChipFlights(view.centerCounters),
  };
  pendingTakePresentation = presentation;
  return presentation;
}

async function ensureBoardAvatarUrls(view, access) {
  const missingIds = view.players
    .map((player) => player.id)
    .filter((playerId) => (
      !boardAvatarUrls.has(playerId)
      && !boardAvatarLoadingIds.has(playerId)
    ));
  if (missingIds.length === 0) return;

  missingIds.forEach((playerId) => boardAvatarLoadingIds.add(playerId));

  try {
    const profiles = await getPublicProfiles(missingIds);
    const profileById = new Map(profiles.map((profile) => [String(profile.id), profile]));

    await Promise.all(missingIds.map(async (playerId) => {
      const profile = profileById.get(playerId);
      let avatarUrl = DEFAULT_BOARD_AVATAR_URL;

      if (profile?.avatar_path) {
        const signedUrl = await getSignedAvatarUrl(profile.avatar_path);
        if (typeof signedUrl === "string" && /^https?:\/\//u.test(signedUrl)) {
          avatarUrl = signedUrl;
        }
      }

      boardAvatarUrls.set(playerId, avatarUrl);
    }));
  } catch {
    missingIds.forEach((playerId) => {
      boardAvatarUrls.set(playerId, DEFAULT_BOARD_AVATAR_URL);
    });
  } finally {
    missingIds.forEach((playerId) => boardAvatarLoadingIds.delete(playerId));
  }

  const currentState = lobbyController?.current();
  const currentRoomId = currentState?.snapshot?.room?.id;
  if (currentState && currentRoomId === view.roomId) {
    renderLobby(access, currentState);
  }
}

function prepareBoardSeats(view) {
  const rotated = orderBoardPlayers(view.players, view.currentUserId);

  const seatedNow = new Set(
    view.players
      .filter((player) => (
        view.gamePhase === "PLAYING"
        || player.id === view.hostUserId
        || player.ready
      ))
      .map((player) => player.id),
  );

  let arrivingIds = new Set();
  if (boardRoomId !== view.roomId) {
    boardRoomId = view.roomId;
    seatedPlayerIds = seatedNow;
  } else {
    arrivingIds = new Set(
      [...seatedNow].filter((playerId) => !seatedPlayerIds.has(playerId)),
    );
    seatedPlayerIds = seatedNow;
  }

  return rotated.map((player) => ({
    player,
    seated: seatedNow.has(player.id),
    arriving: arrivingIds.has(player.id),
  }));
}

function createBoardSeat(view, seatInfo, index, total) {
  const { player, seated, arriving } = seatInfo;
  const position = getBoardSeatCoordinates(index, total);
  const active = view.gamePhase === "PLAYING" && player.id === view.activePlayerId;
  const classes = [
    "no-thanks-seat",
    player.id === view.currentUserId ? "is-me" : "",
    active ? "is-active" : "",
    !seated ? "is-pending" : "",
    arriving ? "is-arriving" : "",
  ].filter(Boolean).join(" ");

  return el("article", {
    className: classes,
    style: {
      left: position.left.toFixed(3) + "%",
      top: position.top.toFixed(3) + "%",
    },
    dataset: {
      playerId: player.id,
      seat: String(player.seat),
      visualIndex: String(index),
      visualTotal: String(total),
    },
    title: player.displayName,
    "aria-label": player.displayName + (active ? " 현재 차례" : ""),
  }, [
    el("span", { className: "no-thanks-seat__avatar-frame" }, [
      el("img", {
        className: "no-thanks-seat__avatar",
        src: boardAvatarUrls.get(player.id) ?? DEFAULT_BOARD_AVATAR_URL,
        alt: "",
        width: "76",
        height: "76",
        onError: (event) => {
          if (event.currentTarget.src.endsWith("/assets/images/default-avatar.svg")) return;
          event.currentTarget.src = DEFAULT_BOARD_AVATAR_URL;
        },
      }),
    ]),
    el("span", {
      className: "no-thanks-seat__name",
      text: player.displayName,
    }),
    active
      ? el("span", {
        className: "no-thanks-seat__turn",
        text: "TURN",
      })
      : null,
  ]);
}

function createBoardHud(view) {
  const players = [...view.players].sort((left, right) => left.seat - right.seat);
  return el("aside", {
    className: "no-thanks-board-hud",
    "aria-label": "방 현황",
  }, [
    el("div", { className: "no-thanks-board-hud__header" }, [
      el("div", {}, [
        el("span", { className: "no-thanks-board-hud__label", text: "ROOM" }),
        el("strong", { className: "no-thanks-board-hud__code", text: view.roomCode }),
      ]),
      el("strong", {
        className: "no-thanks-board-hud__count",
        text: String(view.playerCount) + " / " + String(view.maxPlayers),
      }),
    ]),
    el("ol", { className: "no-thanks-board-hud__players" }, players.map((player) => (
      el("li", {
        className: "no-thanks-board-hud__player",
        dataset: { connected: player.connected ? "true" : "false" },
      }, [
        el("span", {
          className: "no-thanks-board-hud__name",
          text: player.displayName,
        }),
        el("span", { className: "no-thanks-board-hud__badges" }, [
          player.id === view.hostUserId
            ? el("span", {
              className: "no-thanks-board-hud__badge no-thanks-board-hud__badge--host",
              text: "방장",
            })
            : el("span", {
              className: "no-thanks-board-hud__badge",
              text: player.ready ? "준비" : "대기",
            }),
          el("span", {
            className: "no-thanks-board-hud__badge no-thanks-board-hud__badge--connection",
            text: player.connected ? "온라인" : "자리이탈",
          }),
        ]),
      ])
    ))),
  ]);
}

function createTableCard(view, state, {
  dealIn = false,
} = {}) {
  const value = view.currentCard;
  const displayValue = value == null ? "?" : String(value);
  const canTake = !state.busy && view.canTake;
  return el("div", { className: "no-thanks-table-card-action" }, [
    el("button", {
      className: "no-thanks-table-card"
        + (dealIn ? " is-awaiting-deal" : ""),
      type: "button",
      disabled: !canTake,
      dataset: { tone: getNoThanksCardTone(value) },
      title: canTake ? "이 카드를 가져옵니다." : "현재 차례에만 카드를 가져올 수 있어요.",
      "aria-label": value == null
        ? "현재 카드 없음"
        : "현재 카드 " + displayValue + (canTake ? ", 눌러서 가져오기" : ""),
      onClick: async (event) => {
        if (!canTake) return;
        const takePresentation = beginTakePresentation(view, event.currentTarget);
        event.currentTarget.disabled = true;
        event.currentTarget.classList.add("is-submitting");
        try {
          await lobbyController.takeCard();
        } catch {
          clearPendingTakePresentation(takePresentation);
          // Controller state renders the authoritative error.
        }
      },
    }, [
      el("span", { className: "no-thanks-table-card__inner" }, [
        el("span", {
          className: "no-thanks-table-card__face no-thanks-table-card__front",
        }, [
          el("span", {
            className: "no-thanks-number-card__corner no-thanks-number-card__corner--top",
            text: displayValue,
          }),
          el("span", {
            className: "no-thanks-table-card__label",
            text: "CURRENT",
          }),
          el("strong", {
            className: "no-thanks-table-card__value",
            text: displayValue,
          }),
          el("span", {
            className: "no-thanks-number-card__corner no-thanks-number-card__corner--bottom",
            text: displayValue,
          }),
        ]),
        el("span", {
          className: "no-thanks-table-card__face no-thanks-table-card__back",
          "aria-hidden": "true",
        }),
      ]),
    ]),
    el("span", {
      className: "no-thanks-table-card-action__hint",
      text: canTake ? "카드를 눌러 가져오기" : "현재 차례만 선택 가능",
    }),
  ]);
}

function createDrawDeck(view) {
  const visualCount = getNoThanksDeckVisualCount(view.deckRemaining);
  return el("div", {
    className: "no-thanks-draw-deck",
    "aria-label": "남은 카드 " + String(view.deckRemaining ?? 0) + "장",
  }, [
    el("div", {
      className: "no-thanks-draw-deck__stack" + (visualCount === 0 ? " is-empty" : ""),
      "aria-hidden": "true",
    }, Array.from({ length: visualCount }, (_, index) => {
      const depth = visualCount - index - 1;
      return el("span", {
        style: {
          transform: "translate(" + String(depth * -4) + "px, " + String(depth * 3) + "px) rotate(" + String(depth * -0.9) + "deg)",
          zIndex: String(index + 1),
        },
      });
    })),
    el("strong", {
      className: "no-thanks-draw-deck__count",
      text: String(view.deckRemaining ?? "—") + "장",
    }),
  ]);
}

function createCenterChipAction(view, state, {
  displayCount = null,
} = {}) {
  const canRefuse = !state.busy && view.canRefuse;
  const count = Number(view.centerCounters) || 0;
  const visibleCount = Number.isInteger(displayCount)
    ? Math.max(0, displayCount)
    : count;
  const visual = visibleCount > 0
    ? createChipCluster(visibleCount, {
      label: "현재 카드 위 칩 " + String(visibleCount) + "개",
    })
    : el("strong", {
      className: "no-thanks-center-chips__empty-mark",
      text: "NO CHIP",
    });

  return el("div", {
    className: "no-thanks-center-chips"
      + (visibleCount === 0 ? " no-thanks-center-chips--empty" : ""),
    dataset: {
      finalCount: String(count),
      visibleCount: String(visibleCount),
    },
  }, [
    el("div", { className: "no-thanks-center-chips__visual" }, [visual]),
    visibleCount > 0
      ? el("strong", {
        className: "no-thanks-center-chips__count",
        text: String(visibleCount) + "개",
      })
      : null,
    el("button", {
      className: "button button--secondary no-thanks-center-chips__action",
      type: "button",
      disabled: !canRefuse,
      text: view.viewerCounters === 0 ? "칩 없음" : "칩 1개 내기",
      onClick: async (event) => {
        if (!canRefuse) return;
        event.currentTarget.disabled = true;
        event.currentTarget.classList.add("is-submitting");
        try {
          await lobbyController.refuseCard();
        } catch {
          // Controller state renders the authoritative error.
        }
      },
    }),
  ]);
}

function commitCenterChipLanding(board) {
  const container = board.querySelector(".no-thanks-center-chips");
  if (!container) return;

  const count = Number(container.dataset.finalCount) || 0;
  const visibleCount = Number(container.dataset.visibleCount) || 0;
  if (visibleCount === count) return;

  const visual = container.querySelector(".no-thanks-center-chips__visual");
  const action = container.querySelector(".no-thanks-center-chips__action");
  if (!visual || !action) return;

  visual.replaceChildren(
    count > 0
      ? createChipCluster(count, {
        label: "현재 카드 위 칩 " + String(count) + "개",
      })
      : el("strong", {
        className: "no-thanks-center-chips__empty-mark",
        text: "NO CHIP",
      }),
  );

  const currentCount = container.querySelector(".no-thanks-center-chips__count");
  if (count > 0) {
    const countElement = currentCount ?? el("strong", {
      className: "no-thanks-center-chips__count",
    });
    countElement.textContent = String(count) + "개";
    if (!currentCount) container.insertBefore(countElement, action);
  } else {
    currentCount?.remove();
  }

  container.dataset.visibleCount = String(count);
  container.classList.toggle("no-thanks-center-chips--empty", count === 0);
}


function dealPresentationKey(state) {
  if (
    !state?.roomId
    || !Number.isInteger(Number(state.version))
    || !Number.isInteger(Number(state.currentCard))
  ) {
    return null;
  }
  return [
    state.roomId,
    Number(state.version),
    Number(state.currentCard),
    Number(state.deckRemaining) || 0,
  ].join(":");
}

function markDealSettled(state) {
  const key = dealPresentationKey(state);
  if (key) lastSettledDealKey = key;
}

function isDealAlreadySettled(state) {
  const key = dealPresentationKey(state);
  return Boolean(key && key === lastSettledDealKey);
}

function readBoardTransitionEffects(view) {
  const viewer = view.players.find((player) => player.id === view.currentUserId);
  const current = {
    roomId: view.roomId,
    version: view.version,
    gamePhase: view.gamePhase,
    currentCard: view.currentCard,
    deckRemaining: view.deckRemaining,
    centerCounters: view.centerCounters,
    activePlayerId: view.activePlayerId,
    currentUserId: view.currentUserId,
    viewerCounters: Number(view.viewerCounters) || 0,
    viewerCards: [...(viewer?.cards ?? [])].sort((left, right) => left - right),
  };
  const previous = boardPresentationState;
  const sameVersion = previous
    && previous.roomId === current.roomId
    && previous.version === current.version;

  if (sameVersion) {
    if (
      boardPresentationEffect
      && boardPresentationEffect.roomId === current.roomId
      && boardPresentationEffect.version === current.version
      && (
        boardPresentationEffect.started !== true
        || (
          boardPresentationEffect.dealCard
          && boardPresentationEffect.completed !== true
        )
      )
    ) {
      return boardPresentationEffect;
    }
    return Object.freeze({
      dealCard: false,
      chipFromPlayerId: null,
      chipPreviousCount: null,
      takeByViewer: false,
    });
  }

  boardPresentationState = current;

  if (
    !previous
    || previous.roomId !== current.roomId
    || previous.gamePhase !== "PLAYING"
    || current.gamePhase !== "PLAYING"
  ) {
    boardPresentationEffect = null;
    if (current.gamePhase === "PLAYING") markDealSettled(current);
    return Object.freeze({
      dealCard: false,
      chipFromPlayerId: null,
      takeByViewer: false,
    });
  }

  const dealCard = !isDealAlreadySettled(current)
    && Number.isInteger(previous.currentCard)
    && Number.isInteger(current.currentCard)
    && previous.currentCard !== current.currentCard
    && Number(current.deckRemaining) < Number(previous.deckRemaining);
  const chipFromPlayerId = Number(current.centerCounters) > Number(previous.centerCounters)
    ? previous.activePlayerId
    : null;
  const chipPreviousCount = chipFromPlayerId
    ? Number(previous.centerCounters) || 0
    : null;
  const takePresentation = pendingTakePresentation;
  const takeByViewer = Boolean(
    takePresentation
    && takePresentation.roomId === current.roomId
    && takePresentation.sourceVersion === Number(previous.version)
    && takePresentation.cardValue === Number(previous.currentCard)
    && previous.activePlayerId === current.currentUserId
    && current.viewerCards.includes(takePresentation.cardValue),
  );

  boardPresentationEffect = dealCard || chipFromPlayerId || takeByViewer
    ? {
      roomId: current.roomId,
      version: current.version,
      dealKey: dealCard ? dealPresentationKey(current) : null,
      dealCard,
      chipFromPlayerId,
      chipPreviousCount,
      takeByViewer,
      takeCardValue: takeByViewer ? takePresentation.cardValue : null,
      takePreviousViewerCounters: takeByViewer
        ? takePresentation.previousViewerCounters
        : null,
      takePreviousViewerCards: takeByViewer
        ? takePresentation.previousViewerCards
        : null,
      started: false,
      running: false,
      completed: false,
      takeCardLanded: false,
      takeChipsLanded: false,
    }
    : null;

  return boardPresentationEffect ?? Object.freeze({
    dealCard: false,
    chipFromPlayerId: null,
    takeByViewer: false,
  });
}

function createChipFlight(view, playerId) {
  if (!playerId) return null;
  const ordered = orderBoardPlayers(view.players, view.currentUserId);
  const index = ordered.findIndex((player) => player.id === playerId);
  if (index < 0) return null;
  const position = getBoardSeatCoordinates(index, ordered.length);
  return el("span", {
    className: "no-thanks-chip no-thanks-chip-flight",
    style: {
      left: position.left.toFixed(3) + "%",
      top: position.top.toFixed(3) + "%",
    },
    "aria-hidden": "true",
  });
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

function createDealFlight(target, sourceRect) {
  const targetRect = target.getBoundingClientRect();
  if (
    !sourceRect
    || targetRect.width <= 0
    || targetRect.height <= 0
    || prefersReducedMotion()
  ) {
    target.classList.remove("is-awaiting-deal");
    return null;
  }

  const startLeft = sourceRect.left + ((sourceRect.width - targetRect.width) / 2);
  const startTop = sourceRect.top + ((sourceRect.height - targetRect.height) / 2);
  const flight = document.createElement("div");
  flight.className = "no-thanks-card-flight";
  flight.dataset.tone = target.dataset.tone ?? "blue";
  flight.setAttribute("aria-hidden", "true");

  const inner = target.querySelector(".no-thanks-table-card__inner")?.cloneNode(true);
  if (!inner) {
    target.classList.remove("is-awaiting-deal");
    return null;
  }

  inner.style.transform = "rotateY(180deg)";
  flight.append(inner);
  Object.assign(flight.style, {
    left: startLeft.toFixed(2) + "px",
    top: startTop.toFixed(2) + "px",
    width: targetRect.width.toFixed(2) + "px",
    height: targetRect.height.toFixed(2) + "px",
  });
  document.body.append(flight);

  return {
    flight,
    inner,
    targetRect,
    startLeft,
    startTop,
    startScale: Math.max(
      .5,
      Math.min(1, Math.min(
        sourceRect.width / targetRect.width,
        sourceRect.height / targetRect.height,
      )),
    ),
  };
}

async function animateDealFlight(target, source) {
  if (!target?.isConnected || !source?.isConnected) return false;

  const sourceRect = source.getBoundingClientRect();
  const created = createDealFlight(target, sourceRect);
  if (!created) return false;

  const {
    flight,
    inner,
    targetRect,
    startLeft,
    startTop,
    startScale,
  } = created;
  const dx = targetRect.left - startLeft;
  const dy = targetRect.top - startTop;
  const scaleAt = (progress) => startScale + ((1 - startScale) * progress);

  target.classList.add("is-receiving-card");

  try {
    const pathAnimation = flight.animate([
      {
        transform: `translate3d(0, 0, 0) scale(${startScale}) rotateZ(0deg)`,
        opacity: 1,
        offset: 0,
      },
      {
        transform: `translate3d(${dx * .2}px, ${dy * .12 - 24}px, 0) scale(${scaleAt(.12)}) rotateZ(-2deg)`,
        opacity: 1,
        offset: .22,
      },
      {
        transform: `translate3d(${dx * .52}px, ${dy * .42 - 34}px, 0) scale(${scaleAt(.36)}) rotateZ(3.2deg)`,
        opacity: 1,
        offset: .5,
      },
      {
        transform: `translate3d(${dx * .82}px, ${dy * .76 - 18}px, 0) scale(${scaleAt(.7)}) rotateZ(-1.5deg)`,
        opacity: 1,
        offset: .78,
      },
      {
        transform: `translate3d(${dx}px, ${dy - 6}px, 0) scale(.994) rotateZ(.7deg)`,
        opacity: 1,
        offset: .94,
      },
      {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(1) rotateZ(0deg)`,
        opacity: 1,
        offset: 1,
      },
    ], {
      duration: 760,
      easing: "cubic-bezier(.18, .72, .2, 1)",
      fill: "forwards",
    });

    const flipAnimation = inner.animate([
      { transform: "rotateY(180deg) rotateX(0deg)", offset: 0 },
      { transform: "rotateY(180deg) rotateX(1deg)", offset: .2 },
      { transform: "rotateY(220deg) rotateX(-3deg)", offset: .43 },
      { transform: "rotateY(274deg) rotateX(2deg)", offset: .63 },
      { transform: "rotateY(332deg) rotateX(-1deg)", offset: .84 },
      { transform: "rotateY(360deg) rotateX(0deg)", offset: 1 },
    ], {
      duration: 760,
      easing: "cubic-bezier(.3, .08, .18, 1)",
      fill: "forwards",
    });

    await Promise.all([
      pathAnimation.finished.catch(() => {}),
      flipAnimation.finished.catch(() => {}),
    ]);

    const landingTarget = document.querySelector(".no-thanks-table-card.is-awaiting-deal")
      ?? target;
    landingTarget?.classList.remove("is-awaiting-deal");
    landingTarget?.classList.add("is-deal-landed");

    const settle = flight.animate([
      {
        opacity: 1,
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(1)`,
      },
      {
        opacity: 1,
        transform: `translate3d(${dx}px, ${dy + 2}px, 0) scale(.992)`,
        offset: .5,
      },
      {
        opacity: 0,
        transform: `translate3d(${dx}px, ${dy + 1}px, 0) scale(1)`,
      },
    ], {
      duration: 130,
      easing: "cubic-bezier(.2, .72, .2, 1)",
      fill: "forwards",
    });
    await settle.finished.catch(() => {});
    landingTarget?.classList.remove("is-deal-landed");
  } finally {
    flight.remove();
    target.classList.remove("is-receiving-card");
  }

  return true;
}


function syncBoardSeatGeometry(board) {
  const table = board.querySelector(".no-thanks-round-table");
  if (!table) return;

  const boardRect = board.getBoundingClientRect();
  const tableRect = table.getBoundingClientRect();
  if (
    boardRect.width <= 0
    || boardRect.height <= 0
    || tableRect.width <= 0
    || tableRect.height <= 0
  ) {
    return;
  }

  const centerX = tableRect.left - boardRect.left + (tableRect.width / 2);
  const centerY = tableRect.top - boardRect.top + (tableRect.height / 2);
  const tableStyle = window.getComputedStyle?.(table);
  const borderX = (
    (Number.parseFloat(tableStyle?.borderLeftWidth) || 0)
    + (Number.parseFloat(tableStyle?.borderRightWidth) || 0)
  ) / 2;
  const borderY = (
    (Number.parseFloat(tableStyle?.borderTopWidth) || 0)
    + (Number.parseFloat(tableStyle?.borderBottomWidth) || 0)
  ) / 2;
  const radiusX = Math.max(0, (tableRect.width / 2) - (borderX / 2));
  const radiusY = Math.max(0, (tableRect.height / 2) - (borderY / 2));

  board.querySelectorAll(".no-thanks-seat").forEach((seat) => {
    const index = Number(seat.dataset.visualIndex);
    const total = Number(seat.dataset.visualTotal);
    if (!Number.isInteger(index) || !Number.isInteger(total) || total <= 0) return;

    const angle = (Math.PI / 2) + ((Math.PI * 2 * index) / total);
    seat.style.left = (centerX + (Math.cos(angle) * radiusX)).toFixed(2) + "px";
    seat.style.top = (centerY + (Math.sin(angle) * radiusY)).toFixed(2) + "px";
  });
}

function commitViewerChipLanding(effect = null) {
  if (effect) effect.takeChipsLanded = true;
  const container = app.querySelector(".no-thanks-my-panel__chips[data-final-count]");
  if (!container) return;

  const finalCount = Math.max(0, Number(container.dataset.finalCount) || 0);
  const value = container.querySelector(".no-thanks-my-panel__value");
  const cluster = container.querySelector(".no-thanks-chip-cluster");
  if (value) value.textContent = String(finalCount);
  if (cluster) {
    cluster.replaceWith(createChipCluster(finalCount, {
      label: "내 보유 칩 " + String(finalCount) + "개",
      emptyText: "칩 없음",
    }));
  }
  container.dataset.visibleCount = String(finalCount);
}

function findTakeCardLandingTarget(cardValue, stateClass = "is-awaiting-take-landing") {
  if (!Number.isInteger(Number(cardValue))) return null;
  return app.querySelector(
    '.no-thanks-hand-card[data-card-value="' + String(cardValue) + '"].' + stateClass,
  );
}

function commitTakeCardLanding(effect, presentation) {
  if (effect) effect.takeCardLanded = true;
  const target = findTakeCardLandingTarget(presentation?.cardValue);
  if (!target) return;
  target.classList.remove("is-awaiting-take-landing");
  target.classList.add("is-take-landed");
  const count = app.querySelector(".no-thanks-my-panel__card-count[data-final-count]");
  if (count) count.textContent = count.dataset.finalCount + "장";
  window.setTimeout(() => {
    findTakeCardLandingTarget(presentation?.cardValue, "is-take-landed")
      ?.classList.remove("is-take-landed");
  }, 180);
}

async function animateTakeCardToHand(presentation, effect) {
  const flight = presentation?.cardFlight;
  const target = findTakeCardLandingTarget(presentation?.cardValue);
  if (!flight?.isConnected || !target?.isConnected || typeof flight.animate !== "function") {
    commitTakeCardLanding(effect, presentation);
    flight?.remove();
    return;
  }

  const flightRect = flight.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const endLeft = targetRect.left + ((targetRect.width - flightRect.width) / 2);
  const endTop = targetRect.top + ((targetRect.height - flightRect.height) / 2);
  const dx = endLeft - flightRect.left;
  const dy = endTop - flightRect.top;
  const landingScale = Math.max(
    .58,
    Math.min(1, Math.min(
      targetRect.width / flightRect.width,
      targetRect.height / flightRect.height,
    )),
  );
  const scaleAt = (progress) => 1 + ((landingScale - 1) * progress);

  const path = flight.animate([
    {
      transform: "translate3d(0, 0, 0) scale(1) rotateZ(0deg)",
      opacity: 1,
      offset: 0,
    },
    {
      transform: `translate3d(${dx * .2}px, ${dy * .12 - 24}px, 0) scale(${scaleAt(.12)}) rotateZ(-2deg)`,
      opacity: 1,
      offset: .22,
    },
    {
      transform: `translate3d(${dx * .52}px, ${dy * .42 - 34}px, 0) scale(${scaleAt(.36)}) rotateZ(3.2deg)`,
      opacity: 1,
      offset: .5,
    },
    {
      transform: `translate3d(${dx * .82}px, ${dy * .76 - 18}px, 0) scale(${scaleAt(.7)}) rotateZ(-1.5deg)`,
      opacity: 1,
      offset: .78,
    },
    {
      transform: `translate3d(${dx}px, ${dy - 5}px, 0) scale(${scaleAt(.94)}) rotateZ(.7deg)`,
      opacity: 1,
      offset: .94,
    },
    {
      transform: `translate3d(${dx}px, ${dy}px, 0) scale(${landingScale}) rotateZ(0deg)`,
      opacity: 1,
      offset: 1,
    },
  ], {
    duration: 700,
    easing: "cubic-bezier(.18, .72, .2, 1)",
    fill: "forwards",
  });

  await path.finished.catch(() => {});
  commitTakeCardLanding(effect, presentation);

  const settle = flight.animate([
    {
      opacity: 1,
      transform: `translate3d(${dx}px, ${dy}px, 0) scale(${landingScale})`,
    },
    {
      opacity: 1,
      transform: `translate3d(${dx}px, ${dy + 2}px, 0) scale(${landingScale * .992})`,
      offset: .46,
    },
    {
      opacity: 0,
      transform: `translate3d(${dx}px, ${dy + 1}px, 0) scale(${landingScale})`,
    },
  ], {
    duration: 120,
    easing: "cubic-bezier(.2, .72, .2, 1)",
    fill: "forwards",
  });
  await settle.finished.catch(() => {});
  flight.remove();
}

async function animateTakeChipsToPanel(presentation, effect) {
  const expectedCount = Math.max(0, Math.floor(Number(presentation?.chipCount) || 0));
  const flights = (presentation?.chipFlights ?? []).slice(0, expectedCount);
  if (expectedCount === 0 || flights.length === 0) {
    flights.forEach((flight) => flight.remove());
    commitViewerChipLanding(effect);
    return;
  }

  const target = app.querySelector(".no-thanks-my-panel__chips .no-thanks-chip-cluster");
  const targetRect = target?.getBoundingClientRect?.();
  if (!targetRect || targetRect.width <= 0 || targetRect.height <= 0) {
    flights.forEach((flight) => flight.remove());
    commitViewerChipLanding(effect);
    return;
  }

  const destinationX = targetRect.left + (targetRect.width / 2);
  const destinationY = targetRect.top + (targetRect.height / 2);
  const durationMs = 620;
  const staggerMs = 26;
  const animations = flights.map((flight, index) => {
    if (typeof flight.animate !== "function") return Promise.resolve();

    const rect = flight.getBoundingClientRect();
    const startX = rect.left + (rect.width / 2);
    const startY = rect.top + (rect.height / 2);
    const spread = (index - ((flights.length - 1) / 2)) * 5;
    const endX = destinationX + spread - startX;
    const endY = destinationY + ((index % 2 === 0) ? -4 : 4) - startY;
    const midX = endX * .5;
    const midY = (endY * .5) - 58 - (index * 3);

    const animation = flight.animate([
      {
        transform: "translate3d(0, 0, 0) scale(.94) rotate(0deg)",
        opacity: 1,
      },
      {
        offset: .12,
        transform: "translate3d(0, -4px, 0) scale(1) rotate(70deg)",
        opacity: 1,
      },
      {
        offset: .52,
        transform: `translate3d(${midX}px, ${midY}px, 0) scale(1.1) rotate(250deg)`,
        opacity: 1,
      },
      {
        transform: `translate3d(${endX}px, ${endY}px, 0) scale(.78) rotate(560deg)`,
        opacity: 1,
      },
    ], {
      duration: durationMs,
      delay: index * staggerMs,
      easing: "cubic-bezier(.18, .78, .22, 1)",
      fill: "forwards",
    });
    return animation.finished.catch(() => {});
  });

  await Promise.all(animations);
  // Remove the transfer batch and expose the authoritative destination state
  // in the same task so no extra/duplicate chip is painted at the end.
  flights.forEach((flight) => flight.remove());
  commitViewerChipLanding(effect);
}

function completeBoardPresentationEffect(effect) {
  if (!effect) return;
  if (effect.dealCard && effect.dealKey) {
    lastSettledDealKey = effect.dealKey;
  }
  effect.running = false;
  effect.completed = true;
}

async function runDealPresentation(effect) {
  const board = app.querySelector(".no-thanks-game-board");
  const dealingCard = board?.querySelector(".no-thanks-table-card");
  const deck = board?.querySelector(".no-thanks-draw-deck__stack");
  const deckTopCard = deck?.querySelector("span:last-child") ?? deck;

  if (!dealingCard || !deckTopCard) {
    completeBoardPresentationEffect(effect);
    return;
  }

  dealingCard.classList.add("is-awaiting-deal");
  if (prefersReducedMotion() || typeof dealingCard.animate !== "function") {
    dealingCard.classList.remove("is-awaiting-deal");
    completeBoardPresentationEffect(effect);
    return;
  }

  dealingCard.classList.add("is-flight-started");
  await animateDealFlight(dealingCard, deckTopCard);
  completeBoardPresentationEffect(effect);
}

async function animatePendingTakePresentation(effect) {
  const presentation = pendingTakePresentation;
  if (!presentation) {
    completeBoardPresentationEffect(effect);
    return;
  }

  await Promise.all([
    animateTakeCardToHand(presentation, effect),
    animateTakeChipsToPanel(presentation, effect),
  ]);
  clearPendingTakePresentation(presentation);

  if (effect?.dealCard) {
    await runDealPresentation(effect);
    return;
  }
  completeBoardPresentationEffect(effect);
}

function syncResultHandLayouts() {
  if (resultHandLayoutFrame != null) {
    window.cancelAnimationFrame(resultHandLayoutFrame);
  }

  resultHandLayoutFrame = window.requestAnimationFrame(() => {
    resultHandLayoutFrame = null;

    app.querySelectorAll(".no-thanks-result-hand:not(.no-thanks-hand--empty)")
      .forEach((hand) => {
        const cards = [...hand.querySelectorAll(".no-thanks-hand-card")];
        if (cards.length <= 1) return;

        const handStyle = window.getComputedStyle(hand);
        const paddingLeft = Number.parseFloat(handStyle.paddingLeft) || 0;
        const paddingRight = Number.parseFloat(handStyle.paddingRight) || 0;
        const availableWidth = Math.max(
          0,
          hand.clientWidth - paddingLeft - paddingRight,
        );
        const cardWidth = cards[0]?.getBoundingClientRect().width ?? 0;
        const runStartCount = cards
          .slice(1)
          .filter((card) => card.dataset.runStart === "true")
          .length;
        const margins = getNoThanksResultHandMargins(cards.length, {
          availableWidth,
          cardWidth,
          runStartCount,
        });

        cards.forEach((card, index) => {
          if (index === 0) {
            card.style.marginLeft = "0";
            return;
          }
          const margin = card.dataset.runStart === "true"
            ? margins.runMargin
            : margins.overlap;
          card.style.marginLeft = String(margin) + "px";
        });
      });
  });
}
function syncBoardAnimationGeometry() {
  const board = app.querySelector(".no-thanks-game-board");
  if (!board) return;

  window.requestAnimationFrame(() => {
    if (!board.isConnected) return;
    syncBoardSeatGeometry(board);

    const effect = boardPresentationEffect;
    if (effect?.dealCard && effect.completed !== true) {
      board.querySelector(".no-thanks-table-card")?.classList.add("is-awaiting-deal");
    }

    if (effect?.running === true) return;

    if (effect?.takeByViewer && pendingTakePresentation) {
      effect.started = true;
      effect.running = true;
      void animatePendingTakePresentation(effect);
      return;
    }

    if (effect?.dealCard) {
      effect.started = true;
      effect.running = true;
      void runDealPresentation(effect);
      return;
    }

    const chipFlight = board.querySelector(".no-thanks-chip-flight");
    const chipTarget = board.querySelector(".no-thanks-center-chips__visual");
    if (chipFlight && chipTarget) {
      const flightRect = chipFlight.getBoundingClientRect();
      const targetRect = chipTarget.getBoundingClientRect();
      const dx = (targetRect.left + (targetRect.width / 2))
        - (flightRect.left + (flightRect.width / 2));
      const dy = (targetRect.top + (targetRect.height / 2))
        - (flightRect.top + (flightRect.height / 2));
      chipFlight.style.setProperty("--no-thanks-chip-mid-x", (dx * .48).toFixed(2) + "px");
      chipFlight.style.setProperty("--no-thanks-chip-mid-y", (dy * .42 - 28).toFixed(2) + "px");
      chipFlight.style.setProperty("--no-thanks-chip-end-x", dx.toFixed(2) + "px");
      chipFlight.style.setProperty("--no-thanks-chip-end-y", dy.toFixed(2) + "px");
      chipFlight.addEventListener("animationend", () => {
        window.setTimeout(() => {
          if (board.isConnected) commitCenterChipLanding(board);
          chipFlight.remove();
        }, 100);
      }, { once: true });
      chipFlight.classList.add("is-motion-ready");
      if (effect) effect.started = true;
    } else if (effect?.chipFromPlayerId && prefersReducedMotion()) {
      commitCenterChipLanding(board);
      effect.started = true;
    }
  });
}

function createRoundTable(view, state, effects) {
  if (view.status === "waiting") {
    return el("div", { className: "no-thanks-round-table" }, [
      el("div", { className: "no-thanks-round-table__waiting" }, [
        el("span", { text: "NO THANKS!" }),
        el("strong", { text: "게임 테이블 준비 중" }),
        el("p", {
          text: "준비를 마친 플레이어가 자리를 채우면 이 테이블에서 바로 게임이 시작됩니다.",
        }),
      ]),
    ]);
  }

  return el("div", { className: "no-thanks-round-table" }, [
    el("div", { className: "no-thanks-round-table__objects" }, [
      createDrawDeck(view),
      createTableCard(view, state, { dealIn: effects.dealCard }),
      createCenterChipAction(view, state, {
        displayCount: effects.chipFromPlayerId ? effects.chipPreviousCount : null,
      }),
    ]),
  ]);
}

function createHandCard(card, index, overlap, {
  incoming = false,
  runStart = false,
} = {}) {
  const value = String(card);
  return el("button", {
    className: "no-thanks-hand-card" + (incoming ? " is-awaiting-take-landing" : ""),
    type: "button",
    dataset: {
      tone: getNoThanksCardTone(card),
      cardValue: value,
      incoming: incoming ? "true" : "false",
      runStart: runStart ? "true" : "false",
    },
    style: {
      marginLeft: index === 0 ? "0" : String(overlap) + "px",
      zIndex: String(index + 1),
    },
    "aria-label": "획득 카드 " + value,
  }, [
    el("span", {
      className: "no-thanks-number-card__corner no-thanks-number-card__corner--top",
      text: value,
    }),
    el("span", {
      className: "no-thanks-number-card__corner no-thanks-number-card__corner--bottom",
      text: value,
    }),
  ]);
}

function createWaitingPrimaryAction(view, state) {
  if (view.isHost) {
    return el("button", {
      className: "button no-thanks-my-panel__primary-action",
      type: "button",
      text: state.busy ? "처리 중…" : "게임 시작",
      disabled: state.busy || !view.canStart,
      onClick: async () => {
        try {
          await lobbyController.startGame();
        } catch {
          // Controller state renders the authoritative error.
        }
      },
    });
  }

  return el("button", {
    className: "button no-thanks-my-panel__primary-action",
    type: "button",
    text: state.busy
      ? "처리 중…"
      : (view.isReady ? "준비 취소" : "준비 완료"),
    disabled: state.busy,
    onClick: async () => {
      try {
        await lobbyController.setReady(!view.isReady);
      } catch {
        // Controller state renders the authoritative error.
      }
    },
  });
}

function createMyPanel(view, state, panelActions = [], effects = null) {
  const viewer = view.players.find((player) => player.id === view.currentUserId);
  const finalCards = [...(viewer?.cards ?? [])].sort((left, right) => left - right);
  const holdingIncomingCard = Boolean(
    effects?.takeByViewer
    && effects.takeCardLanded !== true
    && Number.isInteger(effects.takeCardValue),
  );
  const holdingIncomingChips = Boolean(
    effects?.takeByViewer
    && effects.takeChipsLanded !== true,
  );
  const previousCards = holdingIncomingCard
    ? [...(effects.takePreviousViewerCards ?? [])].sort((left, right) => left - right)
    : finalCards;
  const cards = holdingIncomingCard
    ? [...previousCards, effects.takeCardValue]
    : finalCards;
  const overlap = getNoThanksHandOverlap(cards.length);
  const waiting = view.status === "waiting";
  const finalCounters = Number(view.viewerCounters) || 0;
  const displayCounters = holdingIncomingChips
    ? Math.max(0, Number(effects.takePreviousViewerCounters) || 0)
    : finalCounters;
  const visibleCardCount = holdingIncomingCard ? previousCards.length : cards.length;
  const statusText = waiting
    ? (view.isHost
      ? "방장은 항상 준비된 자리로 표시됩니다."
      : (view.isReady
        ? "준비 완료 · 게임 시작을 기다리고 있어요."
        : "준비 완료를 누르면 테이블에 착석합니다."))
    : "";

  return el("section", {
    className: "no-thanks-my-panel " + (waiting ? "no-thanks-my-panel--waiting" : "no-thanks-my-panel--playing"),
    "aria-label": "내 플레이 패널",
  }, [
    el("div", {
      className: "no-thanks-my-panel__chips",
      dataset: waiting
        ? {}
        : {
          finalCount: String(finalCounters),
          visibleCount: String(displayCounters),
        },
    }, waiting
      ? [
        el("span", { className: "no-thanks-my-panel__label", text: "내 상태" }),
        el("strong", {
          className: "no-thanks-my-panel__value",
          text: view.isHost ? "방장" : (view.isReady ? "준비 완료" : "준비 필요"),
        }),
        el("small", { text: "내 자리는 항상 6시 방향입니다." }),
      ]
      : [
        el("span", { className: "no-thanks-my-panel__label", text: "내 보유 칩" }),
        el("strong", {
          className: "no-thanks-my-panel__value",
          text: String(displayCounters),
        }),
        createChipCluster(displayCounters, {
          label: "내 보유 칩 " + String(displayCounters) + "개",
          emptyText: "칩 없음",
        }),
      ]),
    el("div", { className: "no-thanks-my-panel__cards" }, [
      el("div", { className: "no-thanks-my-panel__cards-head" }, [
        el("span", { className: "no-thanks-my-panel__label", text: "내 보유 카드" }),
        el("strong", {
          className: "no-thanks-my-panel__card-count",
          dataset: { finalCount: String(finalCards.length) },
          text: String(visibleCardCount) + "장",
        }),
      ]),
      cards.length > 0
        ? el("div", { className: "no-thanks-hand" },
          cards.map((card, index) => createHandCard(card, index, overlap, {
            incoming: holdingIncomingCard && index === cards.length - 1,
          })))
        : el("div", {
          className: "no-thanks-hand no-thanks-hand--empty",
          text: waiting ? "게임 시작 후 획득한 카드가 이곳에 표시됩니다." : "아직 획득한 카드가 없어요.",
        }),
    ]),
    el("div", {
      className: "no-thanks-my-panel__actions"
        + (waiting ? " no-thanks-my-panel__actions--waiting" : " no-thanks-my-panel__actions--playing"),
    }, [
      waiting
        ? el("p", { className: "no-thanks-my-panel__message", text: statusText })
        : null,
      waiting
        ? el("div", {
          className: "no-thanks-my-panel__action-row is-single",
        }, [createWaitingPrimaryAction(view, state)])
        : null,
      panelActions.length > 0
        ? el("div", { className: "no-thanks-panel-tools" }, panelActions)
        : null,
    ]),
  ]);
}

function boardStatusMessage(view) {
  if (view.status === "waiting") {
    if (view.isHost) {
      return view.canStart
        ? "모두 준비됐어요. 게임을 시작할 수 있습니다."
        : "3명 이상 모이고 일반 플레이어가 모두 준비하면 시작할 수 있어요.";
    }
    return view.isReady
      ? "준비 완료 · 게임 시작을 기다리고 있어요."
      : "준비 완료를 누르면 테이블에 자리를 잡습니다.";
  }

  if (!view.activePlayerConnected) {
    return (view.activePlayerDisplayName ?? "현재 플레이어") + "님의 재접속을 기다리고 있어요.";
  }
  if (view.isMyTurn) return "내 차례예요.";
  return (view.activePlayerDisplayName ?? "다른 플레이어") + "님의 차례예요.";
}

function createBoardScene(view, state, panelActions = []) {
  const effects = readBoardTransitionEffects(view);
  const seats = prepareBoardSeats(view);
  return el("section", { className: "no-thanks-board-view" }, [
    createInlineError(state.error),
    el("section", {
      className: "no-thanks-game-board",
      "aria-label": view.status === "waiting" ? "No Thanks 대기 테이블" : "No Thanks 게임 보드",
    }, [
      el("div", { className: "no-thanks-board__status" }, [
        el("span", {
          text: view.status === "waiting" ? "WAITING ROOM" : "PLAYING",
        }),
        el("strong", { text: boardStatusMessage(view) }),
      ]),
      createRoundTable(view, state, effects),
      ...seats.map((seatInfo, index) => createBoardSeat(view, seatInfo, index, seats.length)),
      createChipFlight(view, effects.chipFromPlayerId),
      createBoardHud(view),
    ]),
    createMyPanel(view, state, panelActions, effects),
  ]);
}

function createWaitingPanel(view, state, panelActions = []) {
  return createBoardScene(view, state, panelActions);
}


function createResultPlayerPanels(view, {
  scored = true,
} = {}) {
  const entries = scored && view.scoreboard.length > 0
    ? view.scoreboard
    : view.players.map((player) => ({
      id: player.id,
      displayName: player.displayName,
      rank: null,
      score: null,
      counters: null,
      winner: false,
      cards: player.cards,
      seat: player.seat,
    }));

  return el("section", {
    className: "no-thanks-result-players",
    style: { "--result-player-count": String(Math.max(entries.length, 1)) },
    "aria-label": scored ? "최종 순위와 플레이어 결과" : "게임 종료 시 플레이어 카드",
  }, entries.map((entry) => {
    const cards = [...(entry.cards ?? [])].sort((left, right) => left - right);
    const overlap = getNoThanksResultHandOverlap(cards.length);
    const hasCounters = Number.isInteger(entry.counters);

    return el("article", {
      className: "no-thanks-result-player" + (entry.winner ? " is-winner" : ""),
      dataset: {
        playerId: entry.id,
        rank: entry.rank == null ? "end" : String(entry.rank),
      },
    }, [
      entry.winner
        ? el("div", { className: "no-thanks-result-player__winner-ribbon", text: "WINNER" })
        : null,
      el("header", { className: "no-thanks-result-player__masthead" }, [
        el("div", {
          className: "no-thanks-result-player__rank-medal"
            + (entry.rank == null ? " no-thanks-result-player__rank-medal--ended" : ""),
          "aria-label": entry.rank == null ? "게임 종료" : String(entry.rank) + "등",
        }, [
          el("small", { text: entry.rank == null ? "RESULT" : "RANK" }),
          el("strong", {
            text: entry.rank == null ? "END" : (entry.rank === 1 ? "1ST" : String(entry.rank)),
          }),
        ]),
        el("div", { className: "no-thanks-result-player__identity" }, [
          el("small", { text: "PLAYER" }),
          el("strong", { text: entry.displayName }),
        ]),
        entry.score != null
          ? el("div", { className: "no-thanks-result-player__score-card" }, [
            el("span", { text: "FINAL SCORE" }),
            el("strong", { className: "no-thanks-result-player__score", text: `${entry.score}점` }),
          ])
          : null,
      ]),
      el("div", { className: "no-thanks-result-player__playmat" }, [
        hasCounters
          ? el("section", { className: "no-thanks-result-player__chip-tray" }, [
            el("div", { className: "no-thanks-result-player__section-head" }, [
              el("span", { text: "CHIPS" }),
              el("strong", { text: String(entry.counters) }),
            ]),
            createChipCluster(entry.counters, {
              label: `${entry.displayName} 최종 보유 칩 ${entry.counters}개`,
              emptyText: "칩 없음",
            }),
          ])
          : el("section", {
            className: "no-thanks-result-player__chip-tray no-thanks-result-player__chip-tray--empty",
            text: "최종 칩 정보 없음",
          }),
        el("section", { className: "no-thanks-result-player__card-rack" }, [
          el("div", { className: "no-thanks-result-player__section-head" }, [
            el("span", { text: "ACQUIRED CARDS" }),
            el("strong", { text: `${cards.length}장` }),
          ]),
          cards.length > 0
            ? el("div", { className: "no-thanks-result-hand" },
              cards.map((card, index) => {
                const startsNewRun = index > 0 && card !== cards[index - 1] + 1;
                return createHandCard(card, index, startsNewRun ? 12 : overlap, {
                  runStart: startsNewRun,
                });
              }))
            : el("div", {
              className: "no-thanks-result-hand no-thanks-hand--empty",
              text: "획득 카드 없음",
            }),
        ]),
      ]),
    ]);
  }));
}

function getWinnerCelebrationKey(view) {
  if (!view || view.gamePhase !== "GAME_OVER" || view.endReason !== "LAST_CARD_TAKEN") {
    return null;
  }

  const scores = view.scoreboard
    .map((entry) => `${entry.id}:${entry.score}`)
    .join("|");
  return `${view.roomId}:${view.version}:${view.endReason}:${scores}`;
}

function readAcknowledgedWinnerCelebrationKey() {
  try {
    return window.sessionStorage?.getItem(WINNER_CELEBRATION_STORAGE_KEY)
      || acknowledgedWinnerCelebrationKey;
  } catch {
    return acknowledgedWinnerCelebrationKey;
  }
}

function acknowledgeWinnerCelebration(celebrationKey) {
  acknowledgedWinnerCelebrationKey = celebrationKey;
  try {
    window.sessionStorage?.setItem(WINNER_CELEBRATION_STORAGE_KEY, celebrationKey);
  } catch {
    // In-memory acknowledgement still prevents repeat rendering for this page lifecycle.
  }
}

function createWinnerCelebration(view, celebrationKey) {
  const winners = view.scoreboard.filter((entry) => entry.winner);
  if (view.endReason !== "LAST_CARD_TAKEN" || winners.length === 0) return null;

  const dialog = el("dialog", {
    className: "no-thanks-winner-celebration",
    "aria-labelledby": "no-thanks-winner-celebration-title",
  });
  dialog.addEventListener("cancel", () => {
    acknowledgeWinnerCelebration(celebrationKey);
  });
  dialog.addEventListener("close", () => {
    acknowledgeWinnerCelebration(celebrationKey);
  });

  const palette = ["red", "blue", "yellow", "teal"];
  const confetti = Array.from({ length: 84 }, (_, index) => el("i", {
    className: "no-thanks-winner-confetti",
    dataset: { tone: palette[index % palette.length] },
    style: {
      "--confetti-x": `${(index * 37) % 101}%`,
      "--confetti-drift": `${-110 + ((index * 53) % 221)}px`,
      "--confetti-delay": `${(index * 71) % 780}ms`,
      "--confetti-duration": `${2200 + ((index * 47) % 1700)}ms`,
      "--confetti-spin": `${540 + ((index * 83) % 1260)}deg`,
    },
    "aria-hidden": "true",
  }));

  const winnerNames = winners.map((entry) => entry.displayName);
  const score = winners[0]?.score;
  const joint = winners.length > 1;

  const close = () => {
    acknowledgeWinnerCelebration(celebrationKey);
    dialog.close();
  };

  dialog.append(
    el("div", { className: "no-thanks-winner-celebration__fx", "aria-hidden": "true" }, [
      ...confetti,
      ...["7", "18", "28", "33"].map((value, index) => el("span", {
        className: "no-thanks-winner-fx-card",
        dataset: { card: String(index + 1), tone: getNoThanksCardTone(Number(value)) },
        text: value,
      })),
      ...Array.from({ length: 8 }, (_, index) => el("span", {
        className: "no-thanks-winner-fx-chip",
        dataset: { chip: String(index + 1) },
      })),
    ]),
    el("section", { className: "no-thanks-winner-celebration__card" }, [
      el("p", { className: "no-thanks-winner-celebration__eyebrow", text: "NO THANKS! WINNER" }),
      el("div", { className: "no-thanks-winner-celebration__rank", text: "1" }),
      el("h2", {
        id: "no-thanks-winner-celebration-title",
        text: joint
          ? `${winnerNames.join(", ")} 공동 1등!`
          : `${winnerNames[0]}님, 1등!`,
      }),
      el("p", {
        className: "no-thanks-winner-celebration__message",
        text: score == null
          ? "가장 좋은 선택으로 이번 게임의 승자가 됐어요."
          : `최종 ${score}점으로 가장 낮은 점수를 기록했어요. 축하합니다!`,
      }),
      el("div", { className: "no-thanks-winner-celebration__motif", "aria-hidden": "true" }, [
        el("span", { className: "no-thanks-winner-celebration__mini-card", text: "NO" }),
        el("span", { className: "no-thanks-winner-celebration__mini-chip" }),
        el("span", { className: "no-thanks-winner-celebration__mini-card", text: "THANKS!" }),
      ]),
      el("button", {
        className: "button no-thanks-winner-celebration__close",
        type: "button",
        text: "게임 결과 확인하기",
        autofocus: true,
        onClick: close,
      }),
    ]),
  );

  return dialog;
}

function createPlayingPanel(view, state, panelActions = []) {
  return createBoardScene(view, state, panelActions);
}

function createGameOverPanel(view, state, openRematchConfirm = null) {
  const winnerNames = view.scoreboard
    .filter((entry) => entry.winner)
    .map((entry) => entry.displayName)
    .join(", ");
  const hostTerminated = view.endReason === "HOST_TERMINATED";

  const hasWinnerResult = !hostTerminated && Boolean(winnerNames);

  return el("section", { className: "no-thanks-game-over" }, [
    el("div", {
      className: "no-thanks-game-over__hero" + (hasWinnerResult ? " is-winner-result" : ""),
    }, [
      el("p", { className: "no-thanks-entry__eyebrow", text: "GAME OVER" }),
      hasWinnerResult
        ? el("div", { className: "no-thanks-game-over__winner-card" }, [
          el("span", { className: "no-thanks-game-over__winner-label", text: "FINAL WINNER" }),
          el("h2", { text: `${winnerNames} 승리!` }),
          el("div", { className: "no-thanks-game-over__winner-motif", "aria-hidden": "true" }, [
            el("span", { className: "no-thanks-game-over__winner-chip" }),
            el("span", { className: "no-thanks-game-over__winner-chip" }),
            el("span", { className: "no-thanks-game-over__winner-chip" }),
          ]),
        ])
        : el("h2", {
          text: hostTerminated
            ? "방장이 게임을 종료했어요."
            : "게임이 종료됐어요.",
        }),
      el("p", {
        text: hostTerminated
          ? "이번 게임은 점수 계산 없이 종료됐습니다. 결과를 확인한 뒤 결과방에서 나갈 수 있어요."
          : "모든 카드를 가져갔습니다. 플레이어별 최종 카드와 보유 칩, 점수를 한눈에 확인해 보세요.",
      }),
    ]),
    createInlineError(state.error),
    createResultPlayerPanels(view, { scored: !hostTerminated }),
    view.isHost && typeof openRematchConfirm === "function"
      ? el("div", { className: "no-thanks-game-over__actions" }, [
        el("button", {
          className: "button no-thanks-game-over__rematch",
          type: "button",
          text: state.busy ? "준비 중…" : "재대결",
          disabled: state.busy,
          onClick: openRematchConfirm,
        }),
      ])
      : null,
  ]);
}

function connectionFor(state) {
  if (state.connection === "offline") {
    return {
      state: GAME_CONNECTION_STATE.OFFLINE,
      label: "네트워크 연결 끊김",
      message: "게임 상태는 서버에 유지됩니다. 연결이 복구되면 자동으로 최신 상태를 다시 불러옵니다.",
    };
  }
  if (state.connection === "reconnecting") {
    return {
      state: GAME_CONNECTION_STATE.RECONNECTING,
      label: "방 상태 동기화 중",
      message: "서버의 최신 snapshot을 다시 불러오고 있어요.",
    };
  }
  if (state.connection === "error") {
    return {
      state: GAME_CONNECTION_STATE.ERROR,
      label: "방 연결 오류",
      message: "최신 방 상태를 불러오지 못했어요.",
    };
  }
  return {
    state: GAME_CONNECTION_STATE.CONNECTED,
    label: state.snapshot ? "방 상태 최신" : "온라인 로비 준비 완료",
    message: state.snapshot
      ? "서버 snapshot을 기준으로 화면을 표시하고 있어요."
      : "새 방을 만들거나 방 코드로 참가할 수 있어요.",
  };
}

function shellPlayers(access, displayName, view) {
  if (!view) {
    return [{
      id: access.userId,
      displayName,
      connected: true,
      ready: false,
      statusLabel: "접속 계정",
    }];
  }

  return view.players.map((player) => ({
    id: player.id,
    displayName: player.displayName,
    connected: player.connected,
    ready: player.id === view.hostUserId ? true : player.ready,
    seat: player.seat,
    turnLabel: view.gamePhase === "PLAYING" && player.id === view.activePlayerId
      ? "현재 차례"
      : null,
    statusLabel: !player.connected
      ? "재접속 대기"
      : player.id === view.hostUserId
        ? "방장"
        : (player.ready ? "준비 완료" : "대기 중"),
  }));
}

function createSidebar(view) {
  if (!view) {
    return el("section", { className: "no-thanks-note" }, [
      el("h2", { text: "온라인 플레이" }),
      el("p", {
        text: "승인회원의 사이트 프로필 이름을 서버가 직접 사용합니다. 게임 안에서 별도 닉네임을 입력하거나 변경하지 않습니다.",
      }),
    ]);
  }

  if (view.gamePhase === "GAME_OVER") {
    return el("section", { className: "no-thanks-note" }, [
      el("h2", { text: "재대결 정책" }),
      el("p", {
        text: "방장이 재대결 준비를 시작하면 같은 방과 참가자를 유지한 채 대기실로 돌아갑니다. 일반 플레이어가 다시 준비를 마치면 방장이 새 게임을 시작할 수 있어요.",
      }),
    ]);
  }

  if (view.status === "playing") {
    const connectionMessage = !view.hostConnected
      ? "방장 연결이 끊겨도 방장 권한은 자동 위임되지 않고 게임도 자동 종료되지 않습니다. 방장이 재접속하면 기존 상태로 복원됩니다."
      : !view.activePlayerConnected
        ? "현재 차례 플레이어의 연결이 끊겼습니다. turn은 유지되며 해당 플레이어가 재접속하면 이어서 진행합니다."
        : "미공개 카드 순서와 다른 플레이어의 칩 수는 이 화면으로 전달되지 않습니다. Realtime은 변경 알림만 받고 RPC snapshot을 다시 읽습니다.";

    return el("section", { className: "no-thanks-note" }, [
      el("h2", { text: "멀티플레이 상태" }),
      el("p", { text: connectionMessage }),
    ]);
  }

  return el("section", { className: "no-thanks-note" }, [
    el("h2", { text: "대기실 안내" }),
    el("p", {
      text: "최소 3명이 모여야 시작할 수 있습니다. 방장은 별도 준비 버튼 없이 일반 플레이어 전원이 준비되면 게임을 시작할 수 있어요.",
    }),
  ]);
}

function createRulesAction(openRules) {
  return el("button", {
    className: "game-platform-shell__button game-platform-shell__button--secondary",
    type: "button",
    text: "게임 규칙",
    onClick: openRules,
  });
}

function createGameEndDialog(onConfirm) {
  const dialog = el("dialog", {
    className: "no-thanks-confirm",
    "aria-labelledby": "no-thanks-game-end-title",
  });

  dialog.append(el("div", { className: "no-thanks-confirm__content" }, [
    el("p", { className: "no-thanks-entry__eyebrow", text: "게임 종료" }),
    el("h2", {
      id: "no-thanks-game-end-title",
      className: "no-thanks-confirm__title",
      text: "진행 중인 게임을 종료할까요?",
    }),
    el("p", {
      className: "no-thanks-confirm__message",
      text: "게임이 즉시 종료되고 점수와 승자는 계산하지 않습니다. 모든 참가자에게 같은 종료 상태가 표시됩니다.",
    }),
    el("div", { className: "no-thanks-confirm__actions" }, [
      el("button", {
        className: "button button--secondary",
        type: "button",
        text: "계속 플레이",
        onClick: () => dialog.close(),
      }),
      el("button", {
        className: "button",
        type: "button",
        text: "게임 종료",
        onClick: async () => {
          dialog.close();
          await onConfirm();
        },
      }),
    ]),
  ]));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  return dialog;
}

function createRematchDialog(onConfirm) {
  const dialog = el("dialog", {
    className: "no-thanks-confirm",
    "aria-labelledby": "no-thanks-rematch-title",
  });

  dialog.append(el("div", { className: "no-thanks-confirm__content" }, [
    el("p", { className: "no-thanks-entry__eyebrow", text: "재대결" }),
    el("h2", {
      id: "no-thanks-rematch-title",
      className: "no-thanks-confirm__title",
      text: "같은 멤버로 재대결을 준비할까요?",
    }),
    el("p", {
      className: "no-thanks-confirm__message",
      text: "현재 방과 참가자는 유지하고 이전 게임 상태만 초기화합니다. 대기실로 돌아가 일반 플레이어가 다시 준비하면 방장이 새 게임을 시작할 수 있어요.",
    }),
    el("div", { className: "no-thanks-confirm__actions" }, [
      el("button", {
        className: "button button--secondary",
        type: "button",
        text: "취소",
        onClick: () => dialog.close(),
      }),
      el("button", {
        className: "button",
        type: "button",
        text: "재대결 준비",
        onClick: async () => {
          dialog.close();
          await onConfirm();
        },
      }),
    ]),
  ]));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  return dialog;
}

function createHostLeaveDialog({
  onConfirm,
}) {
  const dialog = el("dialog", {
    className: "no-thanks-confirm",
    "aria-labelledby": "no-thanks-host-leave-title",
  });

  dialog.append(el("div", { className: "no-thanks-confirm__content" }, [
    el("p", { className: "no-thanks-entry__eyebrow", text: "방 닫기" }),
    el("h2", {
      id: "no-thanks-host-leave-title",
      className: "no-thanks-confirm__title",
      text: "대기실을 닫을까요?",
    }),
    el("p", {
      className: "no-thanks-confirm__message",
      text: "방장이 나가면 이 대기실이 닫히고 현재 참가자 모두가 방에서 나가게 됩니다.",
    }),
    el("div", { className: "no-thanks-confirm__actions" }, [
      el("button", {
        className: "button button--secondary",
        type: "button",
        text: "취소",
        onClick: () => dialog.close(),
      }),
      el("button", {
        className: "button",
        type: "button",
        text: "방 닫기",
        onClick: async () => {
          dialog.close();
          await onConfirm();
        },
      }),
    ]),
  ]));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  return dialog;
}

function createLobbyActions(
  view,
  state,
  openRules,
  openHostLeaveConfirm,
  openGameEndConfirm,
  openRematchConfirm,
) {
  const actions = [createRulesAction(openRules)];

  if (!view) return actions;

  if (view.gamePhase === "GAME_OVER") {
    actions.push(el("button", {
      className: "game-platform-shell__button game-platform-shell__button--danger",
      type: "button",
      text: state.busy ? "처리 중…" : "결과방 나가기",
      disabled: state.busy,
      onClick: async () => {
        try {
          await lobbyController.leaveRoom();
        } catch {
          // Controller state renders the authoritative error.
        }
      },
    }));
    return actions;
  }

  actions.push(el("button", {
    className: "game-platform-shell__button game-platform-shell__button--secondary",
    type: "button",
    text: "새로고침",
    disabled: state.busy,
    onClick: () => {
      void lobbyController.refresh(
        view.gamePhase === "PLAYING" ? "manual-playing" : "manual",
      ).catch(() => {});
    },
  }));

  if (view.status === "waiting") {
    actions.push(el("button", {
      className: "game-platform-shell__button game-platform-shell__button--danger",
      type: "button",
      text: state.busy ? "처리 중…" : (view.isHost ? "방 닫기" : "방 나가기"),
      disabled: state.busy,
      onClick: async () => {
        if (view.isHost) {
          openHostLeaveConfirm();
          return;
        }
        try {
          await lobbyController.leaveRoom();
        } catch {
          // Controller state renders the authoritative error.
        }
      },
    }));
    return actions;
  }

  if (view.gamePhase === "PLAYING" && view.isHost) {
    actions.push(el("button", {
      className: "game-platform-shell__button game-platform-shell__button--danger",
      type: "button",
      text: "게임 종료",
      disabled: state.busy,
      onClick: openGameEndConfirm,
    }));
  }

  return actions;
}

function renderLobby(access, state) {
  const authState = getAuthState();
  const displayName = profileDisplayName(authState);
  if (!displayName) return;

  let view = null;
  if (state.snapshot) {
    try {
      view = createNoThanksLobbyViewModel(state.snapshot, access.userId, {
        presenceReady: state.presence?.ready === true,
        onlinePlayerIds: state.presence?.onlinePlayerIds ?? [],
      });
    } catch (error) {
      replaceApp(createAccessNotice({
        title: "방 상태를 표시할 수 없어요",
        message: getNoThanksLobbyErrorMessage(error),
        retry: () => lobbyController?.refresh("invalid-snapshot"),
      }));
      return;
    }
  }

  if (view?.gamePhase === "GAME_OVER" && pendingTakePresentation) {
    clearPendingTakePresentation();
  }

  const rulesDialog = createRulesDialog();
  const openRules = () => rulesDialog.showModal();
  const hostLeaveDialog = view?.isHost && view.status === "waiting"
    ? createHostLeaveDialog({
      onConfirm: async () => {
        try {
          await lobbyController.leaveRoom();
        } catch {
          // Controller state renders the authoritative error.
        }
      },
    })
    : null;
  const openHostLeaveConfirm = () => hostLeaveDialog?.showModal();
  const gameEndDialog = view?.isHost && view.gamePhase === "PLAYING"
    ? createGameEndDialog(async () => {
      try {
        await lobbyController.endGame();
      } catch {
        // Controller state renders the authoritative error.
      }
    })
    : null;
  const openGameEndConfirm = () => gameEndDialog?.showModal();
  const winnerCelebrationKey = getWinnerCelebrationKey(view);
  const winnerCelebrationDialog = winnerCelebrationKey
    && readAcknowledgedWinnerCelebrationKey() !== winnerCelebrationKey
    ? createWinnerCelebration(view, winnerCelebrationKey)
    : null;
  const rematchDialog = view?.isHost && view.gamePhase === "GAME_OVER"
    ? createRematchDialog(async () => {
      try {
        await lobbyController.prepareRematch();
      } catch {
        // Controller state renders the authoritative error.
      }
    })
    : null;
  const openRematchConfirm = () => rematchDialog?.showModal();
  const lobbyActions = createLobbyActions(
    view,
    state,
    openRules,
    openHostLeaveConfirm,
    openGameEndConfirm,
    openRematchConfirm,
  );
  const boardMode = Boolean(
    view && (view.status === "waiting" || view.gamePhase === "PLAYING"),
  );
  const main = state.view === NO_THANKS_LOBBY_VIEW.ENTRY
    ? createEntryPanel(state, displayName)
    : state.view === NO_THANKS_LOBBY_VIEW.GAME_OVER
      ? createGameOverPanel(view, state, openRematchConfirm)
      : state.view === NO_THANKS_LOBBY_VIEW.PLAYING
        ? createPlayingPanel(view, state, boardMode ? lobbyActions : [])
        : createWaitingPanel(view, state, boardMode ? lobbyActions : []);

  const shell = createGameShell({
    title: "No Thanks!",
    description: "칩으로 버틸지, 카드와 칩을 가져갈지—한 번의 선택이 흐름을 바꾸는 심리전 카드 게임",
    backHref: "/#/games",
    roomLabel: view?.roomCode ? "LIVE ROOM" : null,
    connection: connectionFor(state),
    players: shellPlayers(access, displayName, view),
    currentUserId: access.userId,
    hostUserId: view?.hostUserId ?? null,
    onRetryConnection: () => {
      void lobbyController?.refresh("retry").catch(() => {});
    },
    main: [main, rulesDialog, hostLeaveDialog, gameEndDialog, winnerCelebrationDialog, rematchDialog],
    sidebar: createSidebar(view),
    actions: boardMode ? [] : lobbyActions,
  });

  shell.classList.add("no-thanks-shell");

  if (view) {
    shell.classList.add("no-thanks-shell--in-room");
  }

  if (view && (view.status === "waiting" || view.gamePhase === "PLAYING")) {
    shell.classList.add("no-thanks-shell--board");
  }
  if (view?.gamePhase === "GAME_OVER") {
    shell.classList.add("no-thanks-shell--game-over");
  }

  replaceApp(shell);

  if (winnerCelebrationDialog) {
    window.requestAnimationFrame(() => {
      if (winnerCelebrationDialog.isConnected && !winnerCelebrationDialog.open) {
        winnerCelebrationDialog.showModal();
      }
    });
  }

  if (view?.gamePhase === "GAME_OVER") {
    syncResultHandLayouts();
  }

  if (view && (view.status === "waiting" || view.gamePhase === "PLAYING")) {
    syncBoardAnimationGeometry();
    void ensureBoardAvatarUrls(view, access);
  }
}

async function renderApproved(access, epoch) {
  const authState = getAuthState();
  const displayName = profileDisplayName(authState);

  if (!displayName) {
    disposeLobbyController();
    replaceApp(createAccessNotice({
      title: "프로필 닉네임을 확인할 수 없어요",
      message: "게임에서는 별도 닉네임을 만들지 않고 청파 같이 프로필의 확정 닉네임을 사용합니다. 프로필 정보를 확인해 주세요.",
      href: "/#/mypage",
      linkText: "마이페이지로",
    }));
    return;
  }

  if (!supabase) {
    disposeLobbyController();
    replaceApp(createAccessNotice({
      title: "게임 서버에 연결할 수 없어요",
      message: "온라인 게임 연결 설정을 불러오지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
      retry: boot,
    }));
    return;
  }

  if (lobbyController && lobbyUserId === access.userId) {
    renderLobby(access, lobbyController.current());
    return;
  }

  disposeLobbyController();
  lobbyUserId = access.userId;

  const controller = createNoThanksLobbyController({
    adapter: createNoThanksRoomLobbyAdapter({ client: supabase }),
    gameplayAdapter: createNoThanksGameplayAdapter({ client: supabase }),
    presenceAdapter: createNoThanksPresenceAdapter({ client: supabase }),
    onState: (state) => {
      if (lobbyController === controller && epoch === bootEpoch) {
        renderLobby(access, state);
      }
    },
  });
  lobbyController = controller;

  renderLobby(access, controller.current());

  try {
    await controller.initialize();
  } catch {
    if (lobbyController === controller && epoch === bootEpoch) {
      renderLobby(access, controller.current());
    }
  }
}

async function renderAccess(access, epoch = bootEpoch) {
  if (access.allowed) {
    await renderApproved(access, epoch);
    return;
  }

  disposeLobbyController();

  if (access.reason === GAME_ACCESS_REASON.APPROVAL_REQUIRED) {
    replaceApp(createAccessNotice({
      title: "승인 후 이용할 수 있어요",
      message: "No Thanks!는 청파 같이 승인회원 전용 게임입니다. 가입 승인이 완료되면 다시 입장해 주세요.",
      href: "/#/pending",
      linkText: "승인 상태 확인",
    }));
    return;
  }

  if (access.reason === GAME_ACCESS_REASON.AUTHENTICATION_REQUIRED) {
    replaceApp(createAccessNotice({
      title: "로그인이 필요해요",
      message: "No Thanks!에 입장하려면 청파 같이 계정으로 로그인해 주세요.",
      href: "/#/login",
      linkText: "로그인하기",
    }));
    return;
  }

  replaceApp(createAccessNotice({
    title: "입장 상태를 확인할 수 없어요",
    message: "현재 계정의 게임 접근 상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    retry: boot,
  }));
}

async function boot() {
  const epoch = ++bootEpoch;

  replaceApp(el("main", {
    className: "no-thanks-loading",
    role: "status",
    "aria-live": "polite",
  }, [
    el("div", { className: "spinner", "aria-hidden": "true" }),
    el("p", { text: "게임 입장 권한과 참여 중인 방을 확인하고 있어요." }),
  ]));

  try {
    const access = await accessGate.initialize();
    if (epoch !== bootEpoch) return;
    await renderAccess(access, epoch);

    unsubscribeAccess?.();
    unsubscribeAccess = accessGate.subscribe((nextAccess) => {
      void renderAccess(nextAccess, epoch);
    });
  } catch {
    if (epoch !== bootEpoch) return;
    disposeLobbyController();
    replaceApp(createAccessNotice({
      title: "입장 정보를 불러오지 못했어요",
      message: "네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
      retry: boot,
    }));
  }
}

window.addEventListener("resize", syncResultHandLayouts, { passive: true });

window.addEventListener("pagehide", () => {
  unsubscribeAccess?.();
  unsubscribeAccess = null;
  disposeLobbyController();
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted && !unsubscribeAccess) void boot();
});

void boot();
