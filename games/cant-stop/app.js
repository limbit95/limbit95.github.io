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
  createCantStopBoardColumns,
  createCantStopLobbyViewModel,
  createCantStopShellPlayer,
  getCantStopLobbyErrorMessage,
  resolveCantStopAccessView,
} from "./runtimeModel.js";
import {
  CANT_STOP_LOBBY_VIEW,
  createCantStopLobbyController,
} from "./lobbyController.js";
import { createCantStopRoomLobbyAdapter } from "./roomLobby.js";

const root = document.getElementById("cant-stop-app");

const accessGate = createGameAccessGate({
  initialize: initializeAuth,
  getState: getAuthState,
  subscribe: subscribeAuth,
});

let lobbyController = null;
let accessUnsubscribe = null;
let bootEpoch = 0;

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

function createBoard({ started = false } = {}) {
  const columns = createCantStopBoardColumns();

  return el("section", {
    className: "cant-stop-board",
    "aria-label": "Can’t Stop 보드",
  }, [
    el("div", { className: "cant-stop-board__intro" }, [
      el("p", {
        className: "cant-stop-board__eyebrow",
        text: started ? "GAME STARTED" : "BOARD FOUNDATION",
      }),
      el("h2", {
        className: "cant-stop-board__title",
        text: started ? "게임이 시작됐어요" : "2부터 12까지의 등반 열",
      }),
      el("p", {
        className: "cant-stop-board__description",
        text: started
          ? "턴 순서는 서버에서 확정됐습니다. 주사위와 runner 동작은 다음 gameplay 단계에서 연결합니다."
          : "2부터 12까지 11개 열을 오르며 세 개의 열을 먼저 완주하면 승리합니다.",
      }),
    ]),
    el("div", { className: "cant-stop-board__tracks" },
      columns.map((column) => el("section", {
        className: "cant-stop-column",
        dataset: { column: String(column.number) },
        "aria-label": String(column.number) + " 열 " + String(column.height) + "칸",
      }, [
        el("div", { className: "cant-stop-column__cells" },
          Array.from({ length: column.height }, (_, index) => el("span", {
            className: "cant-stop-column__cell",
            dataset: { position: String(column.height - index) },
            "aria-hidden": "true",
          }))),
        el("strong", {
          className: "cant-stop-column__number",
          text: String(column.number),
        }),
      ]))),
  ]);
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

function createLobbyActions(view, state) {
  const actions = [];

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
    players = view.players;
    hostUserId = view.hostUserId;
    roomLabel = "#" + view.roomCode;

    if (state.view === CANT_STOP_LOBBY_VIEW.PLAYING) {
      main = createBoard({ started: true });
      sidebar = el("section", { className: "cant-stop-runtime-notes" }, [
        el("h2", { className: "cant-stop-runtime-notes__title", text: "게임 시작 완료" }),
        el("ul", { className: "cant-stop-runtime-notes__list" }, [
          el("li", { text: "서버에서 플레이어 순서를 무작위로 확정했어요." }),
          el("li", { text: "이제 authoritative 주사위/action 연결 단계로 이어집니다." }),
        ]),
      ]);
    } else {
      main = createLobbyPanel(view, state);
      sidebar = createLobbySidebar(view);
      actions = createLobbyActions(view, state);
    }
  }

  root.replaceChildren(createGameShell({
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
  lobbyController?.dispose();
  lobbyController = null;
}

async function enterApprovedRuntime(epoch) {
  if (lobbyController || epoch !== bootEpoch) return;

  try {
    const adapter = createCantStopRoomLobbyAdapter({ client: supabase });
    lobbyController = createCantStopLobbyController({
      adapter,
      onState: renderApprovedRuntime,
      onError: (error) => {
        console.warn("Can’t Stop lobby request failed.", error);
      },
    });

    renderApprovedRuntime(lobbyController.current());
    await lobbyController.initialize();
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
