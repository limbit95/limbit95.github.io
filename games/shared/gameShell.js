import { el } from "../../js/ui.js";
import {
  normalizeGamePlayers,
  resolveGameConnectionState,
} from "./gameShellState.js";

function toNodes(value) {
  if (value == null || value === false) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function playerInitial(name) {
  return [...String(name).trim()][0] || "?";
}

export function createGameConnectionBanner(connection, {
  onRetry = null,
} = {}) {
  const state = resolveGameConnectionState(connection);
  const canRetry = typeof onRetry === "function"
    && ["offline", "error"].includes(state.state);

  return el("section", {
    className: `game-platform-status game-platform-status--${state.tone}`,
    role: state.state === "error" ? "alert" : "status",
    "aria-live": "polite",
    "aria-busy": state.busy ? "true" : "false",
    dataset: { gameConnectionState: state.state },
  }, [
    el("div", { className: "game-platform-status__body" }, [
      el("strong", { className: "game-platform-status__label", text: state.label }),
      el("span", { className: "game-platform-status__message", text: state.message }),
    ]),
    canRetry
      ? el("button", {
        className: "game-platform-shell__button game-platform-shell__button--secondary",
        type: "button",
        text: "다시 연결",
        onClick: onRetry,
      })
      : null,
  ]);
}

export function createGamePlayerRoster(players, {
  currentUserId = null,
  hostUserId = null,
} = {}) {
  const normalized = normalizeGamePlayers(players, { currentUserId, hostUserId });

  return el("section", {
    className: "game-platform-players",
    "aria-label": "플레이어",
  }, [
    el("div", { className: "game-platform-players__header" }, [
      el("h2", { className: "game-platform-players__title", text: "플레이어" }),
      el("span", {
        className: "game-platform-players__count",
        text: `${normalized.length}명`,
      }),
    ]),
    el("ol", { className: "game-platform-players__list" },
      normalized.map((player) => el("li", {
        className: "game-platform-player",
        dataset: {
          playerId: player.id,
          connected: player.connected ? "true" : "false",
          ready: player.ready ? "true" : "false",
        },
      }, [
        player.avatarUrl
          ? el("img", {
            className: "game-platform-player__avatar",
            src: player.avatarUrl,
            alt: "",
            width: "40",
            height: "40",
          })
          : el("span", {
            className: "game-platform-player__avatar game-platform-player__avatar--fallback",
            text: playerInitial(player.displayName),
            "aria-hidden": "true",
          }),
        el("div", { className: "game-platform-player__identity" }, [
          el("strong", {
            className: "game-platform-player__name",
            text: player.displayName,
          }),
          el("span", {
            className: "game-platform-player__meta",
            text: [
              player.isMe ? "나" : null,
              player.isHost ? "방장" : null,
              player.connected ? (player.ready ? "준비 완료" : "대기 중") : "연결 끊김",
            ].filter(Boolean).join(" · "),
          }),
        ]),
        el("span", {
          className: "game-platform-player__presence",
          title: player.connected ? "연결됨" : "연결 끊김",
          "aria-label": player.connected ? "연결됨" : "연결 끊김",
        }),
      ]))),
  ]);
}

export function createGameShell({
  title,
  eyebrow = "CHEONGPA GAME",
  description = "",
  backHref,
  roomLabel = null,
  connection = { state: "connecting" },
  players = [],
  currentUserId = null,
  hostUserId = null,
  onRetryConnection = null,
  main = null,
  sidebar = null,
  actions = null,
}) {
  if (typeof title !== "string" || !title.trim()) {
    throw new TypeError("Game shell requires a non-empty title.");
  }
  if (typeof backHref !== "string" || !backHref.trim()) {
    throw new TypeError("Game shell requires a backHref.");
  }

  const root = el("main", {
    className: "game-platform-shell",
    dataset: { gamePlatformShell: "true" },
  });

  const header = el("header", { className: "game-platform-shell__header" }, [
    el("div", { className: "game-platform-shell__heading" }, [
      el("a", {
        className: "game-platform-shell__back",
        href: backHref,
        text: "← 게임 목록",
      }),
      el("p", { className: "game-platform-shell__eyebrow", text: eyebrow }),
      el("h1", { className: "game-platform-shell__title", text: title.trim() }),
      description
        ? el("p", {
          className: "game-platform-shell__description",
          text: description,
        })
        : null,
    ]),
    roomLabel
      ? el("div", {
        className: "game-platform-shell__room",
        text: roomLabel,
        "aria-label": `현재 방 ${roomLabel}`,
      })
      : null,
  ]);

  const status = createGameConnectionBanner(connection, {
    onRetry: onRetryConnection,
  });

  const content = el("div", { className: "game-platform-shell__content" }, [
    el("section", {
      className: "game-platform-shell__stage",
      "aria-label": "게임 영역",
    }, toNodes(main)),
    el("aside", {
      className: "game-platform-shell__sidebar",
      "aria-label": "게임 정보",
    }, [
      createGamePlayerRoster(players, { currentUserId, hostUserId }),
      ...toNodes(sidebar),
    ]),
  ]);

  root.append(header, status, content);

  const actionNodes = toNodes(actions);
  if (actionNodes.length) {
    root.append(el("footer", {
      className: "game-platform-shell__actions",
      "aria-label": "게임 동작",
    }, actionNodes));
  }

  return root;
}
