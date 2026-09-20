import {
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
  CANT_STOP_ACCESS_VIEW,
  createCantStopGameplayViewModel,
  createCantStopLobbyViewModel,
  createCantStopShellPlayer,
  getCantStopLobbyErrorMessage,
  resolveCantStopAccessView,
} from "./runtimeModel.js";
import {
  CANT_STOP_LOBBY_VIEW,
  createCantStopLobbyController,
} from "./lobbyController.js";
import { createInviteShareDialog } from "../../js/invites/inviteShare.js";
import { createCantStopGameplayAdapter } from "./gameplay.js";
import { createCantStopInviteAdapter } from "./invite.js";
import { createCantStopRoomLobbyAdapter } from "./roomLobby.js";
import { CANT_STOP_RULES_GUIDE } from "./rulesHelp.js";
import { createCantStopPairingPresentation } from "./pairingPresentation.js";
import { createCantStopPresentationCoordinator } from "./presentation.js";

const root = document.getElementById("cant-stop-app");

const accessGate = createGameAccessGate({
  initialize: initializeAuth,
  getState: getAuthState,
  subscribe: subscribeAuth,
});

let lobbyController = null;
let inviteAdapter = null;
let inviteShareSession = null;
let accessUnsubscribe = null;
let rulesDialog = null;
let endGameDialog = null;
let presentationCoordinator = null;
let bootEpoch = 0;

const DICE_GLYPHS = Object.freeze(["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"]);
const CANT_STOP_PLAYER_COLORS = Object.freeze([
  "#1e90ff",
  "#ff4d6d",
  "#2ed573",
  "#9b59ff",
]);

function decorateCantStopPlayers(players, gameplay = null) {
  return players.map((player, index) => {
    const seat = Number.isInteger(player.seat) ? player.seat : index;
    const connected = player.connected !== false;
    const playing = gameplay != null;
    return {
      ...player,
      accent: CANT_STOP_PLAYER_COLORS[seat % CANT_STOP_PLAYER_COLORS.length],
      statusLabel: connected
        ? (playing ? (gameplay.isGameOver ? "게임 종료" : "게임 중") : null)
        : "연결 끊김",
      turnLabel: playing
        && !gameplay.isGameOver
        && player.id === gameplay.activePlayerId
        ? "현재 턴"
        : null,
    };
  });
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (dialog.open && typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function showDialog(dialog) {
  if (!dialog) return;
  if (!dialog.open && typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function ensureRulesDialog() {
  if (rulesDialog?.isConnected) return rulesDialog;

  rulesDialog = el("dialog", {
    className: "cant-stop-rules-dialog",
    "aria-labelledby": "cant-stop-rules-title",
  }, [
    el("div", { className: "cant-stop-dialog__header" }, [
      el("div", {}, [
        el("p", { className: "cant-stop-dialog__eyebrow", text: "HOW TO PLAY" }),
        el("h2", {
          className: "cant-stop-dialog__title",
          id: "cant-stop-rules-title",
          text: CANT_STOP_RULES_GUIDE.title,
        }),
      ]),
      el("button", {
        className: "cant-stop-dialog__close",
        type: "button",
        text: "닫기",
        onClick: () => closeDialog(rulesDialog),
      }),
    ]),
    el("p", {
      className: "cant-stop-rules-dialog__intro",
      text: CANT_STOP_RULES_GUIDE.intro,
    }),
    el("div", { className: "cant-stop-rules-dialog__body" },
      CANT_STOP_RULES_GUIDE.sections.map((section) => el("section", {
        className: "cant-stop-rules-section",
      }, [
        el("h3", { text: section.title }),
        ...section.paragraphs.map((paragraph) => el("p", { text: paragraph })),
      ]))),
    el("footer", { className: "cant-stop-rules-dialog__sources" }, [
      el("strong", { text: "규칙 참고" }),
      el("div", { className: "cant-stop-rules-dialog__source-links" },
        CANT_STOP_RULES_GUIDE.sources.map((source) => el("a", {
          href: source.href,
          target: "_blank",
          rel: "noreferrer",
          text: source.label,
        }))),
    ]),
  ]);
  rulesDialog.addEventListener("click", (event) => {
    if (event.target === rulesDialog) closeDialog(rulesDialog);
  });
  document.body.append(rulesDialog);
  return rulesDialog;
}

function openRulesDialog() {
  showDialog(ensureRulesDialog());
}

function ensureEndGameDialog() {
  if (endGameDialog?.isConnected) return endGameDialog;

  const confirmButton = el("button", {
    className: "game-platform-shell__button game-platform-shell__button--danger cant-stop-end-dialog__confirm",
    type: "button",
    text: "게임 종료",
    onClick: async (event) => {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = "종료 중…";
      try {
        await lobbyController?.endGame();
        closeDialog(endGameDialog);
      } catch {
        // Controller state renders the authoritative error.
      } finally {
        button.disabled = false;
        button.textContent = "게임 종료";
      }
    },
  });

  endGameDialog = el("dialog", {
    className: "cant-stop-end-dialog",
    "aria-labelledby": "cant-stop-end-title",
  }, [
    el("p", { className: "cant-stop-dialog__eyebrow", text: "END GAME" }),
    el("h2", {
      className: "cant-stop-dialog__title",
      id: "cant-stop-end-title",
      text: "현재 게임을 종료할까요?",
    }),
    el("p", {
      className: "cant-stop-end-dialog__message",
      text: "방장이 게임을 종료하면 모든 플레이어의 현재 등반이 끝나고 승자 없이 GAME OVER 상태가 됩니다. 이후 같은 방에서 재대결하거나 방을 나갈 수 있어요.",
    }),
    el("div", { className: "cant-stop-end-dialog__actions" }, [
      el("button", {
        className: "game-platform-shell__button game-platform-shell__button--secondary",
        type: "button",
        text: "계속 플레이",
        onClick: () => closeDialog(endGameDialog),
      }),
      confirmButton,
    ]),
  ]);
  endGameDialog.addEventListener("cancel", (event) => {
    if (confirmButton.disabled) event.preventDefault();
  });
  document.body.append(endGameDialog);
  return endGameDialog;
}

function openEndGameDialog() {
  showDialog(ensureEndGameDialog());
}

function inviteTokenFromLocation() {
  return new URLSearchParams(window.location.search).get("invite")?.trim() ?? "";
}

function clearInviteQuery() {
  const token = inviteTokenFromLocation();
  if (!token) return;
  const url = new URL(window.location.href);
  url.searchParams.delete("invite");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function createAccessPage({
  title,
  message,
  actionHref,
  actionText,
}) {
  return el("main", { className: "cant-stop-access" }, [
    el("section", { className: "cant-stop-access__card" }, [
      el("p", { className: "cant-stop-access__eyebrow", text: "CHEONGPA GAME" }),
      el("div", { className: "cant-stop-access__icon", text: "🎲", "aria-hidden": "true" }),
      el("h1", { className: "cant-stop-access__title", text: title }),
      el("p", { className: "cant-stop-access__message", text: message }),
      el("div", { className: "cant-stop-access__actions" }, [
        el("a", {
          className: "button",
          href: actionHref,
          text: actionText,
        }),
        el("a", {
          className: "button button--secondary",
          href: "../../#/games",
          text: "게임 목록",
        }),
      ]),
    ]),
  ]);
}

function gameplayHeading(view) {
  if (view.isGameOver) {
    if (view.isManuallyEnded) {
      return {
        eyebrow: "GAME ENDED",
        title: "게임이 종료되었어요",
        description: "방장이 현재 게임을 종료했습니다. 재대결하거나 방을 나갈 수 있어요.",
      };
    }
    return {
      eyebrow: "GAME OVER",
      title: view.winnerName ? `${view.winnerName} 승리!` : "게임 종료",
      description: "세 개의 열을 먼저 완주해 승리했습니다. 최종 결과는 서버 snapshot에 확정되어 있어요.",
    };
  }
  if (view.phase === "TURN_ROLL") {
    return {
      eyebrow: "ROLL",
      title: view.isMyTurn ? "주사위를 굴려 주세요" : `${view.activePlayerName}님의 턴`,
      description: view.isMyTurn
        ? "현재 runner를 유지한 채 네 개의 주사위를 서버에서 굴립니다."
        : "상대 플레이어의 선택을 기다리고 있어요.",
    };
  }
  if (view.phase === "PAIRING_SELECTION") {
    return {
      eyebrow: "CHOOSE",
      title: view.isMyTurn ? "이동 조합을 선택하세요" : `${view.activePlayerName}님이 조합을 고르는 중`,
      description: "서버가 계산한 legal pairing과 이동 plan만 선택할 수 있어요.",
    };
  }
  return {
    eyebrow: "PUSH OR STOP",
    title: view.isMyTurn ? "한 번 더 갈까요, 여기서 멈출까요?" : `${view.activePlayerName}님이 선택하는 중`,
    description: view.isMyTurn
      ? "더 굴리면 현재 runner는 유지되고, 멈추면 지금 위치가 permanent progress로 확정됩니다."
      : "상대 플레이어의 결정을 기다리고 있어요.",
  };
}

function pairingPlanLabel(columns) {
  if (columns.length === 2 && columns[0] === columns[1]) {
    return `${columns[0]}열 2칸 이동`;
  }
  return columns.length === 2
    ? `${columns[0]}열 + ${columns[1]}열 이동`
    : `${columns[0]}열 이동`;
}

function createPairingDiceGroup(group) {
  if (!group) return null;
  return el("div", {
    className: "cant-stop-route__dice-group",
    "aria-label": `${group.dice[0]} 더하기 ${group.dice[1]}는 ${group.sum}`,
  }, [
    el("div", { className: "cant-stop-route__mini-dice", "aria-hidden": "true" }, [
      el("span", { text: DICE_GLYPHS[group.dice[0]] }),
      el("span", { text: DICE_GLYPHS[group.dice[1]] }),
    ]),
    el("span", { className: "cant-stop-route__equals", text: "=" }),
    el("strong", {
      className: "cant-stop-route__summit",
      text: String(group.sum),
      title: `${group.sum}번 열`,
    }),
  ]);
}

function createPairingRouteCard(pairing, view, state) {
  const groups = pairing.groups ?? pairing.sums.map((sum) => ({
    dice: null,
    sum,
  }));

  return el("article", {
    className: "cant-stop-route",
    dataset: { route: pairing.id },
  }, [
    el("div", { className: "cant-stop-route__formula" },
      groups.map((group, index) => [
        index > 0
          ? el("span", {
            className: "cant-stop-route__divider",
            text: "+",
            "aria-hidden": "true",
          })
          : null,
        group.dice
          ? createPairingDiceGroup(group)
          : el("strong", {
            className: "cant-stop-route__summit",
            text: String(group.sum),
          }),
      ]).flat()),
    el("div", { className: "cant-stop-route__plans" },
      pairing.plans.map((columns) => el("button", {
        className: "cant-stop-route__plan",
        type: "button",
        disabled: state.busy || !view.canChoosePairing,
        onClick: async () => {
          try {
            await lobbyController.choosePairing({
              sums: [...pairing.sums],
              columns: [...columns],
            });
          } catch {
            // Controller state renders the authoritative error.
          }
        },
      }, [
        el("span", {
          className: "cant-stop-route__plan-label",
          text: pairingPlanLabel(columns),
        }),
        el("span", {
          className: "cant-stop-route__plan-arrow",
          text: view.canChoosePairing ? "이 경로 선택 →" : "선택 대기",
        }),
      ]))),
  ]);
}

function createDiceRoutePanel(view, state) {
  const pairingView = createCantStopPairingPresentation(
    view.latestDice,
    view.legalPairings,
  );

  if (state.busyAction === "rollDice") {
    return el("section", {
      className: "cant-stop-route-panel cant-stop-route-panel--calculating",
      "aria-live": "polite",
    }, [
      el("div", { className: "cant-stop-route-panel__header" }, [
        el("strong", { text: "등반 경로 계산 중" }),
        el("span", { text: "네 주사위를 두 쌍으로 나누고 있어요" }),
      ]),
      el("div", { className: "cant-stop-route-panel__placeholder" }, [
        el("span", { className: "cant-stop-route-panel__ridge", "aria-hidden": "true" }),
        el("span", { text: "주사위가 멈추면 가능한 경로가 이곳에 표시됩니다" }),
      ]),
    ]);
  }

  if (view.phase === "PAIRING_SELECTION" && pairingView.length) {
    return el("section", {
      className: "cant-stop-route-panel cant-stop-route-panel--choices",
      "aria-label": "이동 조합 선택",
    }, [
      el("div", { className: "cant-stop-route-panel__header" }, [
        el("strong", { text: "어느 길로 오를까요?" }),
        el("span", {
          text: view.isMyTurn
            ? "주사위 두 개씩 묶은 경로 중 하나를 선택하세요"
            : `${view.activePlayerName}님이 경로를 고르고 있어요`,
        }),
      ]),
      el("div", { className: "cant-stop-route-panel__routes" },
        pairingView.map((pairing) => createPairingRouteCard(pairing, view, state))),
    ]);
  }

  const message = view.phase === "PUSH_OR_STOP"
    ? "이동이 적용됐어요. 더 오를지 지금 진척을 저장할지 선택하세요."
    : view.isGameOver
      ? "이번 등반이 끝났어요."
      : view.isMyTurn
        ? "주사위를 굴리면 가능한 등반 경로를 여기서 바로 비교할 수 있어요."
        : `${view.activePlayerName}님의 주사위 결과와 경로가 여기에 표시됩니다.`;

  return el("section", {
    className: "cant-stop-route-panel cant-stop-route-panel--idle",
  }, [
    el("div", { className: "cant-stop-route-panel__header" }, [
      el("strong", { text: view.phase === "PUSH_OR_STOP" ? "경로 이동 완료" : "등반 경로" }),
      el("span", { text: message }),
    ]),
    el("div", { className: "cant-stop-route-panel__placeholder" }, [
      el("span", { className: "cant-stop-route-panel__ridge", "aria-hidden": "true" }),
      el("span", {
        text: view.phase === "PUSH_OR_STOP"
          ? "보드에서 runner 위치를 확인해 주세요"
          : "주사위 결과를 기다리는 중",
      }),
    ]),
  ]);
}

function createDiceStage(view, state) {
  const rolling = state.busyAction === "rollDice";
  const dice = view.latestDice ?? [null, null, null, null];
  const hasResult = Array.isArray(view.latestDice);

  return el("section", {
    className: [
      "cant-stop-dice-stage",
      rolling ? "cant-stop-dice-stage--rolling" : "",
      view.phase === "PAIRING_SELECTION" ? "cant-stop-dice-stage--choosing" : "",
    ].filter(Boolean).join(" "),
    "aria-label": "주사위와 등반 경로",
    "aria-busy": rolling ? "true" : "false",
  }, [
    el("div", { className: "cant-stop-dice-stage__heading" }, [
      el("div", {}, [
        el("p", { className: "cant-stop-dice-stage__eyebrow", text: "DICE & ROUTES" }),
        el("strong", {
          className: "cant-stop-dice-stage__title",
          text: rolling ? "주사위가 굴러가는 중…" : "주사위와 등반 경로",
        }),
      ]),
      el("span", {
        className: "cant-stop-dice-stage__status",
        text: rolling
          ? "ROLLING"
          : view.phase === "PAIRING_SELECTION"
            ? "CHOOSE ROUTE"
            : hasResult
              ? "SERVER RESULT"
              : "READY",
      }),
    ]),
    el("div", { className: "cant-stop-dice-stage__snow", "aria-hidden": "true" }),
    el("div", { className: "cant-stop-dice-stage__dice" },
      dice.map((die, index) => el("span", {
        className: "cant-stop-die-visual",
        dataset: { dieIndex: String(index + 1) },
        text: die == null ? "?" : DICE_GLYPHS[Number(die)],
        "aria-label": die == null
          ? `${index + 1}번째 주사위 결과 대기`
          : `${index + 1}번째 주사위 ${die}`,
      }))),
    el("div", { className: "cant-stop-dice-stage__action-slot" }, [
      view.canRoll
        ? el("button", {
          className: "game-platform-shell__button cant-stop-dice-stage__roll-button",
          type: "button",
          text: rolling ? "주사위 굴리는 중…" : "주사위 굴리기",
          disabled: state.busy,
          onClick: async () => {
            try {
              await lobbyController.rollDice();
            } catch {
              // Controller state renders the authoritative error.
            }
          },
        })
        : el("span", {
          className: "cant-stop-dice-stage__action-hint",
          text: view.phase === "PAIRING_SELECTION"
            ? (view.isMyTurn ? "아래에서 등반 경로를 선택하세요" : "상대가 등반 경로를 고르는 중")
            : view.phase === "PUSH_OR_STOP"
              ? (view.isMyTurn ? "보드 아래에서 더 굴릴지 멈출지 선택하세요" : "상대가 다음 행동을 정하는 중")
              : view.isGameOver
                ? "게임이 종료되었습니다"
                : "현재 플레이어의 주사위를 기다리는 중",
        }),
    ]),
    el("p", {
      className: "cant-stop-dice-stage__caption",
      text: rolling
        ? "결과는 서버가 확정합니다"
        : (hasResult ? view.latestDice.join(" · ") : "네 개의 주사위를 굴려 등반 경로를 만듭니다"),
    }),
    createDiceRoutePanel(view, state),
  ]);
}

function createBoard(view, state) {
  const heading = gameplayHeading(view);
  const busting = state.effect?.type === "bust";

  const tracks = el("div", { className: "cant-stop-board__tracks" },
    view.columns.map((column) => el("section", {
      className: [
        "cant-stop-column",
        column.claimedById ? "cant-stop-column--claimed" : "",
      ].filter(Boolean).join(" "),
      dataset: { column: String(column.number) },
      "aria-label": column.claimedByName
        ? `${column.number} 열 ${column.claimedByName} 완주`
        : `${column.number} 열 ${column.height}칸`,
    }, [
      el("strong", {
        className: "cant-stop-column__number",
        text: String(column.number),
      }),
      column.claimedByName
        ? el("span", {
          className: "cant-stop-column__claim",
          text: `${column.claimedByName} 완주`,
        })
        : null,
      el("div", { className: "cant-stop-column__cells" },
        Array.from({ length: column.height }, (_, index) => {
          const position = column.height - index;
          const permanent = column.permanentMarkers
            .filter((marker) => marker.position === position);
          const runner = column.runner?.position === position
            ? column.runner
            : null;
          return el("span", {
            className: "cant-stop-column__cell",
            dataset: { position: String(position) },
            "aria-label": `${column.number} 열 ${position}칸`,
          }, [
            ...permanent.map((marker) => el("span", {
              className: `cant-stop-marker cant-stop-marker--permanent cant-stop-marker--player-${marker.playerIndex % 4}`,
              title: `${marker.displayName} 영구 진척`,
              "aria-label": `${marker.displayName} 영구 진척`,
            })),
            runner
              ? el("span", {
                className: `cant-stop-marker cant-stop-marker--runner cant-stop-marker--player-${runner.playerIndex % 4}`,
                title: `${runner.displayName} 현재 runner`,
                "aria-label": `${runner.displayName} 현재 runner`,
              })
              : null,
          ]);
        })),
    ])));

  return el("section", {
    className: "cant-stop-board",
    "aria-label": "Can’t Stop 보드",
  }, [
    el("div", { className: "cant-stop-board__intro" }, [
      el("p", {
        className: "cant-stop-board__eyebrow",
        text: heading.eyebrow,
      }),
      el("h2", {
        className: "cant-stop-board__title",
        text: heading.title,
      }),
      el("p", {
        className: "cant-stop-board__description",
        text: heading.description,
      }),
    ]),
    state.error
      ? el("div", {
        className: "cant-stop-inline-error",
        role: "alert",
        text: getCantStopLobbyErrorMessage(state.error),
      })
      : null,
    el("div", {
      className: [
        "cant-stop-board__mountain",
        busting ? "cant-stop-board__mountain--bust" : "",
      ].filter(Boolean).join(" "),
    }, [
      busting
        ? el("div", {
          className: "cant-stop-bust-notice",
          role: "status",
          "aria-live": "polite",
        }, [
          el("strong", { text: "등반 실패" }),
          el("span", { text: "이번 턴의 임시 진척이 사라지고 다음 플레이어에게 턴이 넘어갑니다." }),
        ])
        : null,
      tracks,
    ]),
  ]);
}

function createGameplaySidebar(view, state) {
  return [createDiceStage(view, state)];
}

function rulesActionButton() {
  return el("button", {
    className: "game-platform-shell__button game-platform-shell__button--secondary",
    type: "button",
    text: "게임 규칙",
    onClick: openRulesDialog,
  });
}

function createGameplayActions(view, state) {
  const actions = [rulesActionButton()];

  if (view.isGameOver) {
    if (view.isHost) {
      actions.push(el("button", {
        className: "game-platform-shell__button",
        type: "button",
        text: state.busy ? "재대결 준비 중…" : "같은 방에서 재대결",
        disabled: state.busy,
        onClick: async () => {
          try {
            await lobbyController.prepareRematch();
          } catch {
            // Controller state renders the authoritative error.
          }
        },
      }));
    }

    actions.push(el("button", {
      className: "game-platform-shell__button game-platform-shell__button--danger",
      type: "button",
      text: state.busy ? "처리 중…" : "방 나가기",
      disabled: state.busy,
      onClick: async () => {
        try {
          await lobbyController.leaveRoom();
        } catch {
          // Controller state renders the authoritative error.
        }
      },
    }));
  }

  if (!view.isGameOver && view.isHost) {
    actions.push(el("button", {
      className: "game-platform-shell__button game-platform-shell__button--danger",
      type: "button",
      text: "게임 종료",
      disabled: state.busy,
      onClick: openEndGameDialog,
    }));
  }

  if (view.canContinue) {
    actions.push(el("button", {
      className: "game-platform-shell__button",
      type: "button",
      text: state.busy ? "처리 중…" : "한 번 더 굴리기",
      disabled: state.busy,
      onClick: async () => {
        try {
          await lobbyController.continueTurn();
        } catch {
          // Controller state renders the authoritative error.
        }
      },
    }));
  }

  if (view.canStop) {
    actions.push(el("button", {
      className: "game-platform-shell__button game-platform-shell__button--secondary",
      type: "button",
      text: state.busy ? "처리 중…" : "여기서 멈추기",
      disabled: state.busy,
      onClick: async () => {
        try {
          await lobbyController.stopTurn();
        } catch {
          // Controller state renders the authoritative error.
        }
      },
    }));
  }

  actions.push(el("button", {
    className: "game-platform-shell__button game-platform-shell__button--secondary",
    type: "button",
    text: "상태 새로고침",
    disabled: state.busy,
    onClick: () => {
      void lobbyController.refresh("manual-gameplay").catch(() => {});
    },
  }));

  return actions;
}

function createField(label, control) {
  return el("label", { className: "cant-stop-field" }, [
    el("span", { className: "cant-stop-field__label", text: label }),
    control,
  ]);
}

function profileNickname() {
  return getAuthState().profile?.display_name?.trim() || "플레이어";
}

function createEntryPanel(state) {
  const nickname = profileNickname();

  const createForm = el("form", {
    className: "cant-stop-entry-card",
    onSubmit: async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      try {
        await lobbyController.createRoom({
          nickname: String(data.get("nickname") ?? ""),
          maxPlayers: Number(data.get("maxPlayers")),
        });
      } catch {
        // Controller state renders the authoritative error.
      }
    },
  }, [
    el("p", { className: "cant-stop-entry-card__eyebrow", text: "CREATE ROOM" }),
    el("h2", { className: "cant-stop-entry-card__title", text: "새 방 만들기" }),
    el("p", {
      className: "cant-stop-entry-card__description",
      text: "2~4명이 함께 플레이할 새 방을 만들어요.",
    }),
    createField("닉네임", el("input", {
      className: "cant-stop-input",
      name: "nickname",
      type: "text",
      value: nickname,
      minlength: "1",
      maxlength: "20",
      required: true,
      autocomplete: "nickname",
    })),
    createField("최대 인원", el("select", {
      className: "cant-stop-input",
      name: "maxPlayers",
    }, [
      el("option", { value: "2", text: "2명" }),
      el("option", { value: "3", text: "3명" }),
      el("option", { value: "4", text: "4명", selected: true }),
    ])),
    el("button", {
      className: "button cant-stop-entry-card__submit",
      type: "submit",
      text: state.busy ? "방 만드는 중…" : "방 만들기",
      disabled: state.busy,
    }),
  ]);

  const joinForm = el("form", {
    className: "cant-stop-entry-card",
    onSubmit: async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      try {
        await lobbyController.joinRoom({
          roomCode: String(data.get("roomCode") ?? ""),
          nickname: String(data.get("nickname") ?? ""),
        });
      } catch {
        // Controller state renders the authoritative error.
      }
    },
  }, [
    el("p", { className: "cant-stop-entry-card__eyebrow", text: "JOIN ROOM" }),
    el("h2", { className: "cant-stop-entry-card__title", text: "코드로 참가" }),
    el("p", {
      className: "cant-stop-entry-card__description",
      text: "친구에게 받은 6자리 방 코드를 입력해 참가해요.",
    }),
    createField("방 코드", el("input", {
      className: "cant-stop-input cant-stop-input--code",
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
          .replace(/[^A-Z0-9]/gu, "")
          .slice(0, 6);
      },
    })),
    createField("닉네임", el("input", {
      className: "cant-stop-input",
      name: "nickname",
      type: "text",
      value: nickname,
      minlength: "1",
      maxlength: "20",
      required: true,
      autocomplete: "nickname",
    })),
    el("button", {
      className: "button button--secondary cant-stop-entry-card__submit",
      type: "submit",
      text: state.busy ? "참가 중…" : "방 참가",
      disabled: state.busy,
    }),
  ]);

  return el("section", { className: "cant-stop-entry" }, [
    el("div", { className: "cant-stop-entry__intro" }, [
      el("p", { className: "cant-stop-board__eyebrow", text: "ONLINE LOBBY" }),
      el("h2", { className: "cant-stop-board__title", text: "Can’t Stop 온라인 방" }),
      el("p", {
        className: "cant-stop-board__description",
        text: "새 방을 만들거나 친구가 만든 방 코드로 참가해 주세요.",
      }),
      el("button", {
        className: "cant-stop-rules-trigger",
        type: "button",
        text: "처음이라면 게임 규칙부터 보기 →",
        onClick: openRulesDialog,
      }),
    ]),
    state.error
      ? el("div", {
        className: "cant-stop-inline-error",
        role: "alert",
        text: getCantStopLobbyErrorMessage(state.error),
      })
      : null,
    el("div", { className: "cant-stop-entry__grid" }, [createForm, joinForm]),
  ]);
}

function createLobbyPanel(view, state) {
  return el("section", { className: "cant-stop-lobby" }, [
    el("div", { className: "cant-stop-lobby__hero" }, [
      el("p", { className: "cant-stop-board__eyebrow", text: "WAITING ROOM" }),
      el("h2", { className: "cant-stop-lobby__title", text: "게임 준비 중" }),
      el("p", {
        className: "cant-stop-lobby__description",
        text: view.isHost
          ? "모든 플레이어가 준비하면 게임을 시작할 수 있어요."
          : "준비가 끝났다면 아래 준비 버튼을 눌러 주세요.",
      }),
    ]),
    el("div", { className: "cant-stop-room-code" }, [
      el("span", { className: "cant-stop-room-code__label", text: "방 코드" }),
      el("strong", { className: "cant-stop-room-code__value", text: view.roomCode }),
      el("span", {
        className: "cant-stop-room-code__meta",
        text: view.playerCount + " / " + view.maxPlayers + "명 · 상태 버전 " + view.version,
      }),
    ]),
    state.error
      ? el("div", {
        className: "cant-stop-inline-error",
        role: "alert",
        text: getCantStopLobbyErrorMessage(state.error),
      })
      : null,
    el("div", { className: "cant-stop-lobby__status-grid" }, [
      el("div", { className: "cant-stop-lobby__status-card" }, [
        el("span", { className: "cant-stop-lobby__status-label", text: "내 상태" }),
        el("strong", {
          className: "cant-stop-lobby__status-value",
          text: view.isHost ? "방장 · 준비 완료" : (view.isReady ? "준비 완료" : "대기 중"),
        }),
      ]),
      el("div", { className: "cant-stop-lobby__status-card" }, [
        el("span", { className: "cant-stop-lobby__status-label", text: "시작 조건" }),
        el("strong", {
          className: "cant-stop-lobby__status-value",
          text: view.canStart ? "시작 가능" : "2명 이상 · 전원 준비",
        }),
      ]),
    ]),
  ]);
}

function createLobbyActions(view, state, { inviteEnabled = false } = {}) {
  const actions = [rulesActionButton()];

  if (!view.isHost) {
    actions.push(el("button", {
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

  if (view.isHost) {
    actions.push(el("button", {
      className: "game-platform-shell__button",
      type: "button",
      text: state.busy ? "시작 준비 중…" : "게임 시작",
      disabled: state.busy || !view.canStart,
      onClick: async () => {
        try {
          await lobbyController.startGame();
        } catch {
          // Controller state renders the authoritative error.
        }
      },
    }));
  }

  if (inviteEnabled) {
    actions.push(el("button", {
      className: "game-platform-shell__button game-platform-shell__button--secondary",
      type: "button",
      text: "초대 링크 · QR",
      disabled: state.busy,
      onClick: () => {
        void openRoomInvite(view.roomId).catch((error) => {
          console.warn("Can’t Stop invite share failed.", error);
        });
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
    text: state.busy ? "처리 중…" : "방 나가기",
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

function createLobbySidebar(view) {
  return el("section", { className: "cant-stop-runtime-notes" }, [
    el("h2", { className: "cant-stop-runtime-notes__title", text: "방 안내" }),
    el("ul", { className: "cant-stop-runtime-notes__list" }, [
      el("li", { text: "방장은 항상 준비 완료 상태예요." }),
      el("li", { text: "2명 이상이 모이고 전원이 준비하면 시작할 수 있어요." }),
      el("li", { text: "방장이 나가면 남아 있는 첫 플레이어에게 방장이 넘어가요." }),
      el("li", { text: "다른 플레이어의 변경은 최신 서버 snapshot으로 다시 불러와요." }),
    ]),
  ]);
}

async function openRoomInvite(roomId) {
  if (!inviteAdapter?.enabled) {
    throw new Error("GAME_INVITE_UNSUPPORTED_GAME");
  }

  if (!inviteShareSession || inviteShareSession.roomId !== roomId) {
    const created = await inviteAdapter.createRoomInvite({ roomId });
    inviteShareSession?.dialog?.destroy?.();
    inviteShareSession = {
      roomId,
      dialog: createInviteShareDialog({
        token: created.token,
        title: "Can’t Stop 방 초대",
        description: "로그인 후 이 Can’t Stop 방으로 바로 연결됩니다.",
      }),
    };
  }

  await inviteShareSession.dialog.open();
}

async function acceptInviteIfReady() {
  const token = inviteTokenFromLocation();
  if (!token || !inviteAdapter?.enabled || !lobbyController) return false;

  try {
    await lobbyController.joinInvite({
      token,
      nickname: profileNickname(),
    });
    clearInviteQuery();
    return true;
  } catch (error) {
    console.warn("Can’t Stop invite join failed.", error);
    return false;
  }
}

function connectionFor(state) {
  if (state.connection === "reconnecting") {
    return {
      state: "reconnecting",
      label: "로비 동기화 중",
      message: "최신 방 상태를 다시 불러오고 있어요.",
    };
  }
  if (state.connection === "error") {
    return {
      state: "error",
      label: "로비 연결 오류",
      message: state.error
        ? getCantStopLobbyErrorMessage(state.error)
        : "방 상태를 불러오지 못했어요.",
    };
  }
  if (state.view === CANT_STOP_LOBBY_VIEW.ENTRY) {
    return {
      state: "connected",
      label: "온라인 준비 완료",
      message: "방을 만들거나 코드로 참가할 수 있어요.",
    };
  }
  if (state.view === CANT_STOP_LOBBY_VIEW.PLAYING) {
    return {
      state: "connected",
      label: "게임 시작됨",
      message: "서버에서 시작 순서와 게임 상태를 확정했어요.",
    };
  }
  return {
    state: "connected",
    label: "로비 연결됨",
    message: "방 상태가 최신 서버 snapshot과 동기화되어 있어요.",
  };
}

function patchGameShell(nextShell) {
  const currentShell = root?.querySelector(":scope > .game-platform-shell");
  if (!currentShell) {
    root?.replaceChildren(nextShell);
    return;
  }

  const replaceSlot = (selector) => {
    const current = currentShell.querySelector(selector);
    const next = nextShell.querySelector(selector);
    if (current && next) {
      current.replaceWith(next);
      return;
    }
    if (current && !next) {
      current.remove();
      return;
    }
    if (!current && next) {
      currentShell.append(next);
    }
  };

  replaceSlot(":scope > .game-platform-shell__header");
  replaceSlot(":scope > .game-platform-status");
  replaceSlot(".game-platform-shell__stage");
  replaceSlot(".game-platform-shell__sidebar");
  replaceSlot(":scope > .game-platform-shell__actions");
}

function renderApprovedRuntime(state) {
  if (!root) return;

  const auth = getAuthState();
  const fallbackPlayer = createCantStopShellPlayer(auth);
  let main = createEntryPanel(state);
  let players = [fallbackPlayer];
  let hostUserId = null;
  let roomLabel = null;
  let sidebar = el("section", { className: "cant-stop-runtime-notes" }, [
    el("h2", { className: "cant-stop-runtime-notes__title", text: "온라인 플레이" }),
    el("ul", { className: "cant-stop-runtime-notes__list" }, [
      el("li", { text: "2~4명이 한 방에서 함께 플레이해요." }),
      el("li", { text: "방 코드는 6자리로 생성돼요." }),
      el("li", { text: "게임 시작 순서는 서버에서 무작위로 정해요." }),
      el("li", { text: "현재 운영 게임 목록에는 아직 노출하지 않아요." }),
    ]),
  ]);
  let actions = null;

  if (state.snapshot?.room) {
    const view = createCantStopLobbyViewModel(state.snapshot, auth.user?.id);
    players = decorateCantStopPlayers(view.players);
    hostUserId = view.hostUserId;
    roomLabel = "#" + view.roomCode;

    if (state.view === CANT_STOP_LOBBY_VIEW.PLAYING) {
      const gameplay = createCantStopGameplayViewModel(state.snapshot, auth.user?.id);
      players = decorateCantStopPlayers(view.players, gameplay);
      main = createBoard(gameplay, state);
      sidebar = createGameplaySidebar(gameplay, state);
      actions = createGameplayActions(gameplay, state);
    } else {
      main = createLobbyPanel(view, state);
      sidebar = createLobbySidebar(view);
      actions = createLobbyActions(view, state, {
        inviteEnabled: inviteAdapter?.enabled === true,
      });
    }
  }

  patchGameShell(createGameShell({
    title: "Can’t Stop",
    eyebrow: "CHEONGPA GAME · PHASE 4",
    description: "주사위 조합으로 열을 오르고, 멈출 타이밍을 선택하는 push-your-luck 게임",
    backHref: "../../#/games",
    roomLabel,
    connection: connectionFor(state),
    players,
    currentUserId: auth.user?.id ?? fallbackPlayer.id,
    hostUserId,
    onRetryConnection: () => {
      void lobbyController.refresh("retry").catch(() => {});
    },
    main,
    sidebar,
    actions,
  }));
}

function disposeLobby() {
  presentationCoordinator?.dispose();
  presentationCoordinator = null;
  lobbyController?.dispose();
  lobbyController = null;
  inviteShareSession?.dialog?.destroy?.();
  inviteShareSession = null;
  inviteAdapter = null;
}

async function enterApprovedRuntime(epoch) {
  if (lobbyController || epoch !== bootEpoch) return;

  try {
    const adapter = createCantStopRoomLobbyAdapter({ client: supabase });
    const gameplayAdapter = createCantStopGameplayAdapter({ client: supabase });
    inviteAdapter = createCantStopInviteAdapter({ client: supabase });
    presentationCoordinator = createCantStopPresentationCoordinator({
      onPresent: renderApprovedRuntime,
    });
    lobbyController = createCantStopLobbyController({
      adapter,
      gameplayAdapter,
      inviteAdapter,
      onState: (state) => presentationCoordinator?.receive(state),
      onError: (error) => {
        console.warn("Can’t Stop lobby request failed.", error);
      },
    });

    presentationCoordinator.receive(lobbyController.current());
    await lobbyController.initialize();
    await acceptInviteIfReady();
  } catch (error) {
    console.error("Can't Stop lobby boot failed.", error);
    disposeLobby();
    if (epoch !== bootEpoch || !root) return;
    root.replaceChildren(createAccessPage({
      title: "온라인 방을 불러오지 못했어요",
      message: getCantStopLobbyErrorMessage(error),
      actionHref: window.location.href,
      actionText: "다시 시도",
    }));
  }
}

function renderAccess(access) {
  if (!root) return;

  const view = resolveCantStopAccessView(access);
  if (view === CANT_STOP_ACCESS_VIEW.AUTHENTICATION_REQUIRED) {
    bootEpoch += 1;
    disposeLobby();
    root.replaceChildren(createAccessPage({
      title: "로그인이 필요해요",
      message: "Can’t Stop은 청파 같이 승인회원이 함께 이용하는 게임입니다.",
      actionHref: "../../#/login",
      actionText: "로그인",
    }));
    return;
  }

  if (view === CANT_STOP_ACCESS_VIEW.APPROVAL_REQUIRED) {
    bootEpoch += 1;
    disposeLobby();
    root.replaceChildren(createAccessPage({
      title: "승인 후 이용할 수 있어요",
      message: "가입 승인이 완료되면 Can’t Stop에 입장할 수 있습니다.",
      actionHref: "../../#/pending",
      actionText: "승인 상태 확인",
    }));
    return;
  }

  const epoch = ++bootEpoch;
  void enterApprovedRuntime(epoch);
}

function cleanup() {
  accessUnsubscribe?.();
  accessUnsubscribe = null;
  disposeLobby();
  rulesDialog?.remove();
  rulesDialog = null;
  endGameDialog?.remove();
  endGameDialog = null;
}

async function boot() {
  if (!root) return;

  root.replaceChildren(el("main", { className: "cant-stop-access" }, [
    el("section", {
      className: "cant-stop-access__card",
      role: "status",
      "aria-live": "polite",
      text: "Can’t Stop 접근 권한을 확인하고 있어요…",
    }),
  ]));

  try {
    const access = await accessGate.initialize();
    renderAccess(access);
    accessUnsubscribe = accessGate.subscribe(renderAccess);
    window.addEventListener("pagehide", cleanup, { once: true });
  } catch (error) {
    console.error("Can't Stop runtime boot failed.", error);
    root.replaceChildren(createAccessPage({
      title: "게임을 불러오지 못했어요",
      message: "접근 상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      actionHref: window.location.href,
      actionText: "다시 시도",
    }));
  }
}

boot();
