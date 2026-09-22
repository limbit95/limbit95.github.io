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

const app = document.getElementById("app");

const accessGate = createGameAccessGate({
  initialize: initializeAuth,
  getState: getAuthState,
  subscribe: subscribeAuth,
});

let unsubscribeAccess = null;
let lobbyController = null;
let lobbyUserId = null;
let bootEpoch = 0;

function replaceApp(node) {
  app.replaceChildren(node);
}

function disposeLobbyController() {
  lobbyController?.dispose();
  lobbyController = null;
  lobbyUserId = null;
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
    className: "button button--secondary",
    type: "button",
    text: "닫기",
    onClick: () => dialog.close(),
  });

  dialog.append(el("div", { className: "no-thanks-rules__content" }, [
    el("div", { className: "no-thanks-rules__header" }, [
      el("div", {}, [
        el("p", { className: "no-thanks-rules__eyebrow", text: "게임 규칙" }),
        el("h2", {
          id: "no-thanks-rules-title",
          className: "no-thanks-rules__title",
          text: "No Thanks! 기본 규칙",
        }),
      ]),
      closeButton,
    ]),
    el("div", { className: "no-thanks-rules__body" }, [
      el("section", {}, [
        el("h3", { text: "목표" }),
        el("p", {
          text: "숫자 카드 점수에서 남은 칩 수를 뺀 최종 점수를 가장 낮게 만드는 게임입니다.",
        }),
      ]),
      el("section", {}, [
        el("h3", { text: "게임 준비" }),
        el("p", {
          text: "3~7명이 플레이합니다. 3부터 35까지의 숫자 카드 33장 중 9장을 보지 않고 제외해 24장을 사용합니다.",
        }),
        el("p", {
          text: "3~5명은 칩 11개, 6명은 9개, 7명은 7개로 시작하며 각자의 칩 수는 다른 플레이어에게 공개하지 않습니다.",
        }),
      ]),
      el("section", {}, [
        el("h3", { text: "내 차례의 선택" }),
        el("ul", {}, [
          el("li", { text: "거절하기: 칩 1개를 현재 카드 위에 놓고 다음 플레이어에게 차례를 넘깁니다." }),
          el("li", { text: "가져오기: 현재 카드와 카드 위에 쌓인 칩을 모두 가져옵니다." }),
          el("li", { text: "칩이 0개라면 거절할 수 없고 반드시 카드를 가져와야 합니다." }),
          el("li", { text: "카드를 가져온 플레이어가 다음 카드에서도 계속 선택합니다." }),
        ]),
      ]),
      el("section", {}, [
        el("h3", { text: "점수 계산" }),
        el("p", {
          text: "연속된 숫자 카드는 묶음에서 가장 낮은 숫자만 점수에 더합니다. 마지막에 남은 칩 수만큼 점수를 뺍니다.",
        }),
        el("p", {
          text: "예: 3, 10, 11, 12, 20을 가지고 칩이 5개라면 카드 점수는 3 + 10 + 20 = 33, 최종 점수는 28입니다.",
        }),
      ]),
      el("section", {}, [
        el("h3", { text: "게임 종료" }),
        el("p", {
          text: "마지막 카드가 가져가지는 순간 게임이 끝납니다. 최종 점수가 가장 낮은 플레이어가 승리하고, 같은 최저 점수라면 공동 승리입니다.",
        }),
      ]),
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

function createWaitingPanel(view, state) {
  return el("section", { className: "no-thanks-waiting" }, [
    el("div", { className: "no-thanks-waiting__hero" }, [
      el("p", { className: "no-thanks-entry__eyebrow", text: "WAITING ROOM" }),
      el("h2", {
        text: view.isHost ? "모두 준비되면 게임을 시작하세요." : "준비가 끝났다면 준비 완료를 눌러 주세요.",
      }),
      el("p", {
        text: `현재 ${view.playerCount}명 · 최대 ${view.maxPlayers}명 · 상태 버전 ${view.version}`,
      }),
    ]),
    el("div", { className: "no-thanks-room-code" }, [
      el("span", { className: "no-thanks-room-code__label", text: "방 코드" }),
      el("strong", { className: "no-thanks-room-code__value", text: view.roomCode }),
      el("span", {
        className: "no-thanks-room-code__hint",
        text: "친구에게 이 코드를 전달해 주세요.",
      }),
    ]),
    createInlineError(state.error),
    el("div", { className: "no-thanks-waiting__status" }, [
      el("div", { className: "no-thanks-status-card" }, [
        el("span", { text: "내 상태" }),
        el("strong", {
          text: view.isHost ? "방장" : (view.isReady ? "준비 완료" : "대기 중"),
        }),
      ]),
      el("div", { className: "no-thanks-status-card" }, [
        el("span", { text: "시작 조건" }),
        el("strong", {
          text: view.canStart ? "시작 가능" : "3명 이상 · 일반 플레이어 전원 준비",
        }),
      ]),
    ]),
    view.presenceReady && !view.allPlayersConnected
      ? el("div", {
        className: "no-thanks-connection-note",
        role: "status",
        text: `${view.disconnectedPlayerNames.join(", ")}님의 연결이 끊겨 있어요. 방 상태는 유지되며 재접속하면 그대로 이어집니다.`,
      })
      : null,
  ]);
}

function createPlayerCards(view) {
  return el("section", { className: "no-thanks-owned" }, [
    el("h3", { className: "no-thanks-owned__title", text: "획득 카드" }),
    el("div", { className: "no-thanks-owned__list" }, view.players.map((player) => (
      el("article", {
        className: `no-thanks-owned__player${player.id === view.activePlayerId ? " is-active" : ""}`,
      }, [
        el("div", { className: "no-thanks-owned__player-head" }, [
          el("strong", { text: player.displayName }),
          player.id === view.activePlayerId && view.gamePhase === "PLAYING"
            ? el("span", { className: "no-thanks-owned__turn", text: "현재 차례" })
            : null,
        ]),
        el("div", { className: "no-thanks-owned__cards" },
          player.cards.length > 0
            ? player.cards.map((card) => el("span", {
              className: "no-thanks-owned__card",
              text: String(card),
            }))
            : [el("span", {
              className: "no-thanks-owned__empty",
              text: "아직 획득한 카드가 없어요",
            })],
        ),
      ])
    ))),
  ]);
}

function createPlayingPanel(view, state) {
  const turnMessage = !view.activePlayerConnected
    ? `${view.activePlayerDisplayName ?? "현재 플레이어"}님의 연결이 끊겼어요. 재접속하면 이어서 진행합니다.`
    : view.isMyTurn
      ? "내 차례예요. 현재 카드를 거절하거나 가져오세요."
      : `${view.activePlayerDisplayName ?? "다른 플레이어"}님의 차례를 기다리고 있어요.`;

  return el("section", { className: "no-thanks-playing-preview" }, [
    el("div", { className: "no-thanks-playing-preview__copy" }, [
      el("p", { className: "no-thanks-entry__eyebrow", text: "PLAYING" }),
      el("h2", { text: turnMessage }),
      el("p", {
        text: view.viewerCounters === 0 && view.isMyTurn
          ? "보유 칩이 없어 이번 카드는 반드시 가져와야 해요."
          : "거절하면 칩 1개를 중앙에 놓고 다음 플레이어에게 차례가 넘어갑니다. 가져오면 카드와 중앙 칩을 받고 같은 플레이어가 다음 카드도 계속 선택합니다.",
      }),
    ]),
    createInlineError(state.error),
    el("div", { className: "no-thanks-playing-preview__state" }, [
      el("article", { className: "no-thanks-current-card" }, [
        el("span", { text: "현재 카드" }),
        el("strong", {
          text: view.currentCard == null ? "?" : String(view.currentCard),
        }),
        el("small", {
          text: view.centerCounters > 0
            ? `중앙 칩 ${view.centerCounters}개`
            : "중앙 칩 없음",
        }),
      ]),
      el("div", { className: "no-thanks-playing-preview__metrics" }, [
        el("div", { className: "no-thanks-metric" }, [
          el("span", { text: "내 칩" }),
          el("strong", {
            text: view.viewerCounters == null ? "—" : String(view.viewerCounters),
          }),
        ]),
        el("div", { className: "no-thanks-metric" }, [
          el("span", { text: "중앙 칩" }),
          el("strong", { text: String(view.centerCounters) }),
        ]),
        el("div", { className: "no-thanks-metric" }, [
          el("span", { text: "남은 카드" }),
          el("strong", {
            text: view.deckRemaining == null ? "—" : String(view.deckRemaining),
          }),
        ]),
      ]),
    ]),
    createPlayerCards(view),
  ]);
}

function createGameOverPanel(view, state) {
  const winnerNames = view.scoreboard
    .filter((entry) => entry.winner)
    .map((entry) => entry.displayName)
    .join(", ");
  const hostTerminated = view.endReason === "HOST_TERMINATED";

  return el("section", { className: "no-thanks-game-over" }, [
    el("div", { className: "no-thanks-game-over__hero" }, [
      el("p", { className: "no-thanks-entry__eyebrow", text: "GAME OVER" }),
      el("h2", {
        text: hostTerminated
          ? "방장이 게임을 종료했어요."
          : winnerNames
            ? `${winnerNames} 승리!`
            : "게임이 종료됐어요.",
      }),
      el("p", {
        text: hostTerminated
          ? "이번 게임은 점수 계산 없이 종료됐습니다. 결과를 확인한 뒤 결과방에서 나갈 수 있어요."
          : "연속된 숫자 묶음은 가장 낮은 카드만 더하고, 남은 칩 수를 뺀 최종 점수예요. 가장 낮은 점수가 승리합니다.",
      }),
    ]),
    createInlineError(state.error),
    el("div", { className: "no-thanks-scoreboard" }, view.scoreboard.map((entry, index) => (
      el("article", {
        className: `no-thanks-scoreboard__row${entry.winner ? " is-winner" : ""}`,
      }, [
        el("span", { className: "no-thanks-scoreboard__rank", text: String(index + 1) }),
        el("strong", { className: "no-thanks-scoreboard__name", text: entry.displayName }),
        entry.winner
          ? el("span", { className: "no-thanks-scoreboard__badge", text: "승리" })
          : null,
        el("strong", { className: "no-thanks-scoreboard__score", text: `${entry.score}점` }),
      ])
    ))),
    createPlayerCards(view),
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
        text: "이번 버전의 재대결은 기존 결과방을 초기화하지 않고 새 방을 만드는 방식입니다. 방장이 새 방을 만들면 기존 결과방은 닫히고 참가자는 새 방 코드로 다시 참가합니다.",
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
    el("p", { className: "no-thanks-entry__eyebrow", text: "새 게임" }),
    el("h2", {
      id: "no-thanks-rematch-title",
      className: "no-thanks-confirm__title",
      text: "새 게임 방을 만들까요?",
    }),
    el("p", {
      className: "no-thanks-confirm__message",
      text: "기존 결과방을 닫고 같은 최대 인원의 새 방을 만듭니다. 다른 참가자들은 새 방 코드로 다시 참가해야 합니다.",
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
        text: "새 방 만들기",
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
  gameOver = false,
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
      text: gameOver ? "결과방을 닫을까요?" : "대기실을 닫을까요?",
    }),
    el("p", {
      className: "no-thanks-confirm__message",
      text: gameOver
        ? "방장이 결과방을 닫으면 현재 참가자 모두가 이 게임 세션에서 나가게 됩니다."
        : "방장이 나가면 이 대기실이 닫히고 현재 참가자 모두가 방에서 나가게 됩니다.",
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
    if (view.isHost) {
      actions.unshift(el("button", {
        className: "game-platform-shell__button",
        type: "button",
        text: state.busy ? "처리 중…" : "새 게임 방 만들기",
        disabled: state.busy,
        onClick: openRematchConfirm,
      }));
    }

    actions.push(el("button", {
      className: "game-platform-shell__button game-platform-shell__button--danger",
      type: "button",
      text: state.busy
        ? "처리 중…"
        : (view.isHost ? "결과방 닫기" : "결과방 나가기"),
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

  if (view.status === "waiting") {
    if (view.isHost) {
      actions.unshift(el("button", {
        className: "game-platform-shell__button",
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
      }));
    } else {
      actions.unshift(el("button", {
        className: "game-platform-shell__button",
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
      }));
    }

    actions.push(el("button", {
      className: "game-platform-shell__button game-platform-shell__button--secondary",
      type: "button",
      text: "새로고침",
      disabled: state.busy,
      onClick: () => {
        void lobbyController.refresh("manual").catch(() => {});
      },
    }));

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

  if (view.gamePhase === "PLAYING") {
    actions.unshift(
      el("button", {
        className: "game-platform-shell__button game-platform-shell__button--secondary",
        type: "button",
        text: view.viewerCounters === 0
          ? "칩 없음 · 거절 불가"
          : "거절하기 · 칩 1개",
        disabled: state.busy || !view.canRefuse,
        onClick: async () => {
          try {
            await lobbyController.refuseCard();
          } catch {
            // Controller state renders the authoritative error.
          }
        },
      }),
      el("button", {
        className: "game-platform-shell__button",
        type: "button",
        text: view.centerCounters > 0
          ? `카드 가져오기 · +${view.centerCounters}칩`
          : "카드 가져오기",
        disabled: state.busy || !view.canTake,
        onClick: async () => {
          try {
            await lobbyController.takeCard();
          } catch {
            // Controller state renders the authoritative error.
          }
        },
      }),
    );
  }

  actions.push(el("button", {
    className: "game-platform-shell__button game-platform-shell__button--secondary",
    type: "button",
    text: "새로고침",
    disabled: state.busy,
    onClick: () => {
      void lobbyController.refresh("manual-playing").catch(() => {});
    },
  }));

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

  const rulesDialog = createRulesDialog();
  const openRules = () => rulesDialog.showModal();
  const hostLeaveDialog = view?.isHost
    && (view.status === "waiting" || view.gamePhase === "GAME_OVER")
    ? createHostLeaveDialog({
      gameOver: view.gamePhase === "GAME_OVER",
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
  const rematchDialog = view?.isHost && view.gamePhase === "GAME_OVER"
    ? createRematchDialog(async () => {
      try {
        await lobbyController.createRematchRoom();
      } catch {
        // Controller state renders the authoritative error.
      }
    })
    : null;
  const openRematchConfirm = () => rematchDialog?.showModal();
  const main = state.view === NO_THANKS_LOBBY_VIEW.ENTRY
    ? createEntryPanel(state, displayName)
    : state.view === NO_THANKS_LOBBY_VIEW.GAME_OVER
      ? createGameOverPanel(view, state)
      : state.view === NO_THANKS_LOBBY_VIEW.PLAYING
        ? createPlayingPanel(view, state)
        : createWaitingPanel(view, state);

  const shell = createGameShell({
    title: "No Thanks!",
    description: "칩을 내고 거절할지, 카드와 쌓인 칩을 가져올지 선택하는 카드 게임",
    backHref: "/#/games",
    roomLabel: view?.roomCode ? `방 ${view.roomCode}` : null,
    connection: connectionFor(state),
    players: shellPlayers(access, displayName, view),
    currentUserId: access.userId,
    hostUserId: view?.hostUserId ?? null,
    onRetryConnection: () => {
      void lobbyController?.refresh("retry").catch(() => {});
    },
    main: [main, rulesDialog, hostLeaveDialog, gameEndDialog, rematchDialog],
    sidebar: createSidebar(view),
    actions: createLobbyActions(
      view,
      state,
      openRules,
      openHostLeaveConfirm,
      openGameEndConfirm,
      openRematchConfirm,
    ),
  });

  replaceApp(shell);
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

window.addEventListener("pagehide", () => {
  unsubscribeAccess?.();
  unsubscribeAccess = null;
  disposeLobbyController();
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted && !unsubscribeAccess) void boot();
});

void boot();
