import {
  createGameAccessGate,
  createGameShell,
} from "../shared/index.js";
import {
  getAuthState,
  initializeAuth,
  subscribeAuth,
} from "../../js/auth.js";
import { el } from "../../js/ui.js";
import {
  CANT_STOP_ACCESS_VIEW,
  createCantStopBoardColumns,
  createCantStopShellPlayer,
  resolveCantStopAccessView,
} from "./runtimeModel.js";

const root = document.getElementById("cant-stop-app");

const accessGate = createGameAccessGate({
  initialize: initializeAuth,
  getState: getAuthState,
  subscribe: subscribeAuth,
});

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

function createBoard() {
  const columns = createCantStopBoardColumns();

  return el("section", {
    className: "cant-stop-board",
    "aria-label": "Can’t Stop 보드",
  }, [
    el("div", { className: "cant-stop-board__intro" }, [
      el("p", { className: "cant-stop-board__eyebrow", text: "BOARD FOUNDATION" }),
      el("h2", { className: "cant-stop-board__title", text: "2부터 12까지의 등반 열" }),
      el("p", {
        className: "cant-stop-board__description",
        text: "현재 단계에서는 실제 방과 주사위 동작을 연결하지 않고 보드 구조와 공통 Shell 경계만 확인합니다.",
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

function createRuntimeNotes() {
  return el("section", { className: "cant-stop-runtime-notes" }, [
    el("h2", { className: "cant-stop-runtime-notes__title", text: "현재 연결 상태" }),
    el("ul", { className: "cant-stop-runtime-notes__list" }, [
      el("li", { text: "Approved Member Access Gate 연결 완료" }),
      el("li", { text: "Common Game Shell 연결 완료" }),
      el("li", { text: "게임 규칙 엔진과 보드 골격 연결 완료" }),
      el("li", { text: "Room / Lobby와 온라인 게임 상태는 다음 단계" }),
    ]),
  ]);
}

function createApprovedRuntime() {
  const auth = getAuthState();
  const player = createCantStopShellPlayer(auth);

  return createGameShell({
    title: "Can’t Stop",
    eyebrow: "CHEONGPA GAME · PHASE 4",
    description: "주사위 조합으로 열을 오르고, 멈출 타이밍을 선택하는 push-your-luck 게임",
    backHref: "../../#/games",
    connection: {
      state: "connected",
      label: "접근 확인 완료",
      message: "승인회원 확인이 완료됐어요. Room / Lobby 연결은 다음 단계에서 시작합니다.",
    },
    players: [player],
    currentUserId: player.id,
    main: createBoard(),
    sidebar: createRuntimeNotes(),
  });
}

function render(access) {
  if (!root) return;

  const view = resolveCantStopAccessView(access);
  if (view === CANT_STOP_ACCESS_VIEW.AUTHENTICATION_REQUIRED) {
    root.replaceChildren(createAccessPage({
      title: "로그인이 필요해요",
      message: "Can’t Stop은 청파 같이 승인회원이 함께 이용하는 게임입니다.",
      actionHref: "../../#/login",
      actionText: "로그인",
    }));
    return;
  }

  if (view === CANT_STOP_ACCESS_VIEW.APPROVAL_REQUIRED) {
    root.replaceChildren(createAccessPage({
      title: "승인 후 이용할 수 있어요",
      message: "가입 승인이 완료되면 Can’t Stop에 입장할 수 있습니다.",
      actionHref: "../../#/pending",
      actionText: "승인 상태 확인",
    }));
    return;
  }

  root.replaceChildren(createApprovedRuntime());
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
    render(access);
    const unsubscribe = accessGate.subscribe(render);
    window.addEventListener("pagehide", unsubscribe, { once: true });
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
