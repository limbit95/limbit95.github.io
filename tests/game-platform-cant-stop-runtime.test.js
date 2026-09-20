import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { GAME_ACCESS_REASON } from "../games/shared/accessGate.js";
import {
  CANT_STOP_ACCESS_VIEW,
  createCantStopBoardColumns,
  createCantStopGameplayViewModel,
  createCantStopLobbyViewModel,
  createCantStopShellPlayer,
  getCantStopLobbyErrorMessage,
  resolveCantStopAccessView,
} from "../games/cant-stop/runtimeModel.js";

test("Can't Stop runtime maps Access Gate states to explicit screens", () => {
  assert.equal(
    resolveCantStopAccessView({ allowed: false, reason: GAME_ACCESS_REASON.AUTHENTICATION_REQUIRED }),
    CANT_STOP_ACCESS_VIEW.AUTHENTICATION_REQUIRED,
  );
  assert.equal(
    resolveCantStopAccessView({ allowed: false, reason: GAME_ACCESS_REASON.APPROVAL_REQUIRED }),
    CANT_STOP_ACCESS_VIEW.APPROVAL_REQUIRED,
  );
  assert.equal(
    resolveCantStopAccessView({ allowed: true, reason: null, userId: "user-1" }),
    CANT_STOP_ACCESS_VIEW.READY,
  );
});

test("Can't Stop runtime board model exposes all 11 columns and expected peak height", () => {
  const columns = createCantStopBoardColumns();
  assert.deepEqual(columns.map((column) => column.number), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(columns.find((column) => column.number === 7)?.height, 13);
  assert.equal(columns[0].height, 3);
  assert.equal(columns.at(-1).height, 3);
  assert.ok(Object.isFrozen(columns));
  assert.ok(columns.every(Object.isFrozen));
});

test("Can't Stop runtime shell player uses the approved profile display name", () => {
  assert.deepEqual(createCantStopShellPlayer({
    user: { id: "user-1" },
    profile: { display_name: "청파" },
  }), {
    id: "user-1",
    displayName: "청파",
    connected: true,
    ready: false,
  });
});

test("Can't Stop runtime shell player falls back without exposing account email", () => {
  const player = createCantStopShellPlayer({
    user: { id: "user-1", email: "private@example.com" },
    profile: {},
  });
  assert.equal(player.displayName, "플레이어");
  assert.equal(JSON.stringify(player).includes("private@example.com"), false);
});


const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("Can't Stop runtime entry module has valid JavaScript syntax", () => {
  assert.doesNotThrow(() => {
    execFileSync(process.execPath, [
      "--check",
      path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    ], { stdio: "pipe" });
  });
});

test("Can't Stop gameplay keeps pairing selection out of the board and inside the dice route panel", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  const boardStart = app.indexOf("function createBoard(view, state)");
  const sidebarStart = app.indexOf("function createGameplaySidebar(view, state)");
  const boardSource = app.slice(boardStart, sidebarStart);

  assert.equal(boardSource.includes("createPairingPanel"), false);
  assert.match(app, /createDiceRoutePanel\(view, state\)/u);
  assert.match(app, /cant-stop-dice-stage__action-slot/u);
  assert.match(app, /createCantStopPairingPresentation/u);
});

test("Can't Stop runtime HTML opts into the Common Game Shell stylesheet and app module", () => {
  const html = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "index.html"),
    "utf8",
  );
  assert.match(html, /\.\.\/shared\/game-shell\.css/u);
  assert.match(html, /type="module" src="\.\/app\.js"/u);
});


test("Can't Stop lobby view model derives host, ready, and roster from authoritative snapshot", () => {
  const view = createCantStopLobbyViewModel({
    version: 7,
    room: {
      id: "room-1",
      roomCode: "ABC234",
      hostUserId: "alice",
      status: "waiting",
      maxPlayers: 4,
      playerCount: 2,
      canStart: true,
    },
    players: [
      {
        userId: "alice",
        displayName: "Alice",
        seat: 0,
        isReady: true,
        connected: true,
      },
      {
        userId: "bob",
        displayName: "Bob",
        seat: 1,
        isReady: true,
        connected: true,
      },
    ],
    viewerUserId: "bob",
  }, "bob");

  assert.equal(view.roomCode, "ABC234");
  assert.equal(view.version, 7);
  assert.equal(view.isHost, false);
  assert.equal(view.isReady, true);
  assert.equal(view.canStart, true);
  assert.deepEqual(view.players, [
    {
      id: "alice",
      displayName: "Alice",
      ready: true,
      connected: true,
      seat: 0,
    },
    {
      id: "bob",
      displayName: "Bob",
      ready: true,
      connected: true,
      seat: 1,
    },
  ]);
});

test("Can't Stop lobby errors provide game-specific recovery messages", () => {
  assert.match(
    getCantStopLobbyErrorMessage({ message: "VERSION_CONFLICT" }),
    /최신 상태/u,
  );
  assert.match(
    getCantStopLobbyErrorMessage({ message: "ROOM_FULL" }),
    /인원이 모두 찼/u,
  );
});


test("Can't Stop gameplay view maps authoritative progress, runners, claims, dice, and actions", () => {
  const view = createCantStopGameplayViewModel({
    version: 12,
    room: {
      id: "room-1",
      status: "playing",
    },
    players: [
      { userId: "alice", displayName: "Alice" },
      { userId: "bob", displayName: "Bob" },
    ],
    viewerUserId: "alice",
    game: {
      phase: "PAIRING_SELECTION",
      activePlayerId: "alice",
      turnIndex: 0,
      turnOrder: ["alice", "bob"],
      playerProgress: {
        alice: { 2: 2, 7: 4 },
        bob: { 7: 4 },
      },
      runners: { 2: 3, 6: 1 },
      claimedColumns: { 3: "bob" },
      latestDice: [1, 2, 3, 4],
      legalPairings: [
        {
          sums: [3, 7],
          plans: [[3, 7]],
        },
        {
          sums: [4, 6],
          plans: [[4], [6]],
        },
      ],
      winnerId: null,
    },
  }, "alice");

  assert.equal(view.version, 12);
  assert.equal(view.activePlayerName, "Alice");
  assert.equal(view.isMyTurn, true);
  assert.equal(view.canChoosePairing, true);
  assert.equal(view.canRoll, false);
  assert.deepEqual(view.latestDice, [1, 2, 3, 4]);
  assert.deepEqual(view.legalPairings[1].plans, [[4], [6]]);

  const column2 = view.columns.find((column) => column.number === 2);
  assert.equal(column2.permanentMarkers[0].displayName, "Alice");
  assert.equal(column2.permanentMarkers[0].position, 2);
  assert.equal(column2.runner.displayName, "Alice");
  assert.equal(column2.runner.position, 3);

  const column3 = view.columns.find((column) => column.number === 3);
  assert.equal(column3.claimedById, "bob");
  assert.equal(column3.claimedByName, "Bob");

  const column7 = view.columns.find((column) => column.number === 7);
  assert.deepEqual(
    column7.permanentMarkers.map((marker) => [marker.displayName, marker.position]),
    [["Alice", 4], ["Bob", 4]],
  );
});

test("Can't Stop gameplay view exposes push/stop and game-over states from server phase", () => {
  const base = {
    version: 20,
    room: { id: "room-1", status: "playing", hostUserId: "alice" },
    players: [
      { userId: "alice", displayName: "Alice" },
      { userId: "bob", displayName: "Bob" },
    ],
    viewerUserId: "alice",
  };

  const pushing = createCantStopGameplayViewModel({
    ...base,
    game: {
      phase: "PUSH_OR_STOP",
      activePlayerId: "alice",
      playerProgress: { alice: {}, bob: {} },
      runners: { 7: 2 },
      claimedColumns: {},
      latestDice: [3, 4, 3, 4],
      legalPairings: [],
      winnerId: null,
    },
  }, "alice");

  assert.equal(pushing.canContinue, true);
  assert.equal(pushing.canStop, true);

  const finished = createCantStopGameplayViewModel({
    ...base,
    game: {
      phase: "GAME_OVER",
      activePlayerId: "alice",
      playerProgress: { alice: {}, bob: {} },
      runners: {},
      claimedColumns: { 2: "alice", 3: "alice", 4: "alice" },
      latestDice: null,
      legalPairings: [],
      winnerId: "alice",
    },
  }, "alice");

  assert.equal(finished.isGameOver, true);
  assert.equal(finished.winnerName, "Alice");
  assert.equal(finished.isHost, true);
  assert.equal(finished.canContinue, false);
  assert.equal(finished.canStop, false);
});


test("Can't Stop gameplay view distinguishes host manual termination from a claimed-column win", () => {
  const view = createCantStopGameplayViewModel({
    version: 31,
    room: {
      id: "room-1",
      status: "playing",
      hostUserId: "alice",
    },
    players: [
      { userId: "alice", displayName: "Alice" },
      { userId: "bob", displayName: "Bob" },
    ],
    viewerUserId: "alice",
    game: {
      phase: "GAME_OVER",
      activePlayerId: "alice",
      playerProgress: { alice: {}, bob: {} },
      runners: {},
      claimedColumns: {},
      latestDice: null,
      legalPairings: [],
      winnerId: null,
      endReason: "MANUAL",
      endedById: "alice",
    },
  }, "alice");

  assert.equal(view.isGameOver, true);
  assert.equal(view.isManuallyEnded, true);
  assert.equal(view.endReason, "MANUAL");
  assert.equal(view.winnerId, null);
  assert.equal(view.winnerName, null);
  assert.equal(view.isHost, true);
});

test("Can't Stop lobby errors explain host-only manual game termination", () => {
  assert.match(
    getCantStopLobbyErrorMessage({ message: "GAME_END_HOST_REQUIRED" }),
    /방장만/u,
  );
});


test("Can't Stop gameplay sidebar moves turn metadata into player cards and keeps only dice routes", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  const sidebarStart = app.indexOf("function createGameplaySidebar(view, state)");
  const actionsStart = app.indexOf("function rulesActionButton()", sidebarStart);
  const sidebarSource = app.slice(sidebarStart, actionsStart);

  assert.match(sidebarSource, /createDiceStage\(view, state\)/u);
  assert.equal(sidebarSource.includes("cant-stop-runtime-notes"), false);
  assert.match(app, /statusLabel:/u);
  assert.match(app, /turnLabel:/u);
  assert.match(app, /"현재 턴"/u);
});


test("Can't Stop choose phase removes the server implementation copy and uses the board phase card", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.equal(
    app.includes("서버가 계산한 legal pairing과 이동 plan만 선택할 수 있어요."),
    false,
  );
  assert.match(app, /cant-stop-board__intro--pairing/u);
  assert.match(app, /cant-stop-board__phase-status/u);
});

test("Can't Stop gameplay roster exposes completed-column progress and high-contrast player colors", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(app, /progressLabel:/u);
  assert.match(app, /완주 \\?\$\{completedByPlayer/u);
  assert.match(app, /#1e90ff/u);
  assert.match(app, /#ff4d6d/u);
  assert.match(app, /#2ed573/u);
  assert.match(app, /#9b59ff/u);
});

test("Can't Stop dice uses explicit pip faces instead of font-dependent dice glyphs", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(app, /function createDieFace/u);
  assert.match(app, /cant-stop-die-face__pip--active/u);
  assert.equal(app.includes("DICE_GLYPHS"), false);
});


test("Can't Stop push-or-stop removes implementation copy and hides the normal playing status card", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.equal(
    app.includes("더 굴리면 현재 runner는 유지되고, 멈추면 지금 위치가 permanent progress로 확정됩니다."),
    false,
  );
  assert.match(
    app,
    /state\.view === CANT_STOP_LOBBY_VIEW\.PLAYING[\s\S]*state\.connection === "connected"[\s\S]*game-platform-status/u,
  );
});


test("Can't Stop board phase card contains no secondary helper copy", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.equal(app.includes("현재 runner를 유지한 채 네 개의 주사위를 서버에서 굴립니다."), false);
  assert.equal(app.includes("상대 플레이어의 선택을 기다리고 있어요."), false);
  assert.equal(app.includes("상대 플레이어의 결정을 기다리고 있어요."), false);

  const boardStart = app.indexOf("function createBoard(view, state)");
  const sidebarStart = app.indexOf("function createGameplaySidebar(view, state)", boardStart);
  const boardSource = app.slice(boardStart, sidebarStart);
  assert.equal(boardSource.includes("heading.description"), false);
});
