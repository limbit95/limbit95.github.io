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
import { el } from "../../js/ui.js";

const app = document.getElementById("app");

const accessGate = createGameAccessGate({
  initialize: initializeAuth,
  getState: getAuthState,
  subscribe: subscribeAuth,
});

let unsubscribeAccess = null;

function replaceApp(node) {
  app.replaceChildren(node);
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

function createEntryStage(displayName, openRules) {
  return el("div", { className: "no-thanks-entry" }, [
    el("div", { className: "no-thanks-entry__card", "aria-hidden": "true" }, [
      el("span", { text: "?" }),
    ]),
    el("div", { className: "no-thanks-entry__copy" }, [
      el("p", { className: "no-thanks-entry__eyebrow", text: "게임 준비" }),
      el("h2", { text: `${displayName}님, 입장 준비가 완료됐어요.` }),
      el("p", {
        text: "현재 단계에서는 승인회원 접근과 공통 게임 화면만 연결되어 있습니다. 방 생성·참가와 실제 멀티플레이는 다음 서버 단계에서 활성화됩니다.",
      }),
      el("button", {
        className: "game-platform-shell__button game-platform-shell__button--secondary",
        type: "button",
        text: "게임 규칙 보기",
        onClick: openRules,
      }),
    ]),
  ]);
}

function createStageNote() {
  return el("section", { className: "no-thanks-note" }, [
    el("h2", { text: "현재 구현 상태" }),
    el("p", {
      text: "규칙 엔진은 준비되어 있지만 아직 방/로비 DB와 서버 RPC가 연결되지 않았습니다. 실제 제공 전까지 온라인 기능은 비활성 상태로 유지합니다.",
    }),
  ]);
}

function renderApproved(access) {
  const authState = getAuthState();
  const displayName = profileDisplayName(authState);

  if (!displayName) {
    replaceApp(createAccessNotice({
      title: "프로필 닉네임을 확인할 수 없어요",
      message: "게임에서는 별도 닉네임을 만들지 않고 청파 같이 프로필의 확정 닉네임을 사용합니다. 프로필 정보를 확인해 주세요.",
      href: "/#/mypage",
      linkText: "마이페이지로",
    }));
    return;
  }

  const rulesDialog = createRulesDialog();
  const openRules = () => rulesDialog.showModal();

  const shell = createGameShell({
    title: "No Thanks!",
    description: "칩을 내고 거절할지, 카드와 쌓인 칩을 가져올지 선택하는 카드 게임",
    backHref: "/#/games",
    connection: {
      state: GAME_CONNECTION_STATE.CONNECTED,
      label: "접근 확인 완료",
      message: "승인회원 확인이 완료됐어요. 방/로비 연결은 다음 단계에서 추가됩니다.",
    },
    players: [{
      id: access.userId,
      displayName,
      connected: true,
      ready: false,
      statusLabel: "접속 계정",
    }],
    currentUserId: access.userId,
    main: [
      createEntryStage(displayName, openRules),
      rulesDialog,
    ],
    sidebar: createStageNote(),
    actions: el("button", {
      className: "game-platform-shell__button",
      type: "button",
      text: "게임 규칙 보기",
      onClick: openRules,
    }),
  });

  replaceApp(shell);
}

function renderAccess(access) {
  if (access.allowed) {
    renderApproved(access);
    return;
  }

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
  replaceApp(el("main", {
    className: "no-thanks-loading",
    role: "status",
    "aria-live": "polite",
  }, [
    el("div", { className: "spinner", "aria-hidden": "true" }),
    el("p", { text: "게임 입장 권한을 확인하고 있어요." }),
  ]));

  try {
    const access = await accessGate.initialize();
    renderAccess(access);

    unsubscribeAccess?.();
    unsubscribeAccess = accessGate.subscribe((nextAccess) => {
      renderAccess(nextAccess);
    });
  } catch {
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
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted && !unsubscribeAccess) void boot();
});

void boot();
