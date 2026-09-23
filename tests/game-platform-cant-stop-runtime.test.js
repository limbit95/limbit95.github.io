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

test("Can't Stop rules guide applies the game-local alpine presentation contract", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );
  const css = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "cant-stop.css"),
    "utf8",
  );
  const guide = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "rulesHelp.js"),
    "utf8",
  );

  assert.match(app, /MOUNTAIN GUIDE · HOW TO PLAY/u);
  assert.match(app, /cant-stop-rules-dialog__quick-loop/u);
  assert.match(app, /createRulesSectionVisual/u);
  assert.match(app, /cant-stop-rules-mini-mountain/u);
  assert.match(app, /cant-stop-rules-visual--pairing/u);
  assert.match(app, /cant-stop-rules-visual--bust/u);
  assert.match(app, /cant-stop-rules-visual--win/u);
  assert.match(app, /section\.paragraphs\.map/u);
  assert.match(guide, /visual: "board"/u);
  assert.match(guide, /visual: "pairing"/u);
  assert.match(guide, /visual: "bust"/u);
  assert.match(guide, /visual: "win"/u);
  assert.match(css, /Experimental platform-rule validation/u);
  assert.match(css, /\.cant-stop-rules-dialog__hero/u);
  assert.match(css, /\.cant-stop-rules-dialog__quick-loop/u);
  assert.match(css, /\.cant-stop-rules-section\.has-visual/u);
  assert.match(css, /\.cant-stop-rules-visual--decision/u);
  assert.match(css, /@media \(max-width: 760px\)/u);
});

test("Can't Stop full visual experiment carries the alpine expedition identity through every game state", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );
  const css = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "cant-stop.css"),
    "utf8",
  );

  assert.match(app, /ALPINE EXPEDITION · PUSH YOUR LUCK/u);
  assert.match(app, /등반 베이스캠프/u);
  assert.match(app, /EXPEDITION BRIEFING/u);
  assert.match(app, /cant-stop-board--game-over/u);
  assert.match(app, /cant-stop-board--push-stop/u);
  assert.match(app, /cant-stop-shell--game-over/u);
  assert.match(app, /cant-stop-shell--pairing/u);
  assert.match(app, /cant-stop-shell--push-stop/u);
  assert.match(app, /cant-stop-shell--rolling/u);

  assert.match(css, /Full visual redesign experiment/u);
  assert.match(css, /#cant-stop-app::before/u);
  assert.match(css, /\.cant-stop-shell--entry \.game-platform-shell__header/u);
  assert.match(css, /\.cant-stop-entry-briefing__route/u);
  assert.match(css, /\.cant-stop-room-guide__primary/u);
  assert.match(css, /\.cant-stop-board__mountain/u);
  assert.match(css, /\.cant-stop-column::before/u);
  assert.match(css, /\.cant-stop-marker--runner[\s\S]*background: #f4fbfb !important/u);
  assert.match(css, /\.cant-stop-die-visual[\s\S]*#df4d50/u);
  assert.match(css, /\.cant-stop-shell--game-over \.game-platform-shell__header/u);
  assert.match(css, /@media \(max-width: 560px\)/u);
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
  const actionsStart = app.indexOf("function rulesActionButton(", sidebarStart);
  const sidebarSource = app.slice(sidebarStart, actionsStart);

  assert.match(sidebarSource, /createGameplayTools\(view, state\)/u);
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
    /const suppressConnectionCard = state\.view !== CANT_STOP_LOBBY_VIEW\.ENTRY[\s\S]*game-platform-status/u,
  );
});


test("Can't Stop gameplay phase cards stay concise while waiting board shows readiness help", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.equal(app.includes("현재 runner를 유지한 채 네 개의 주사위를 서버에서 굴립니다."), false);
  assert.equal(app.includes("상대 플레이어의 선택을 기다리고 있어요."), false);
  assert.equal(app.includes("상대 플레이어의 결정을 기다리고 있어요."), false);
  assert.match(app, /waiting \? "cant-stop-board__intro--waiting"/u);
  assert.match(app, /description: "모든 플레이어가 준비하면 게임을 시작할 수 있어요\."/u);
});


test("Can't Stop bust notice uses centered three-line result copy", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(app, /눈길에 미끄러졌어요\./u);
  assert.match(app, /이번 턴의 임시 진척이 사라지고/u);
  assert.match(app, /다음 플레이어에게 턴이 넘어갑니다\./u);
  assert.match(app, /cant-stop-bust-notice__message/u);
});


test("Can't Stop dice card owns initial roll and split roll-stop controls", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(app, /cant-stop-dice-stage__action-slot--split/u);
  assert.match(app, /lobbyController\.continueAndRoll\(\)/u);
  assert.match(app, /"멈추기"/u);
  assert.match(app, /playCantStopDiceRollSound/u);
  assert.match(app, /playCantStopBlizzardSound/u);

  const diceStageStart = app.indexOf("function createDiceStage(view, state)");
  const boardStart = app.indexOf("function createBoard(view, state", diceStageStart);
  const diceStage = app.slice(diceStageStart, boardStart);
  assert.equal(diceStage.includes("한 번 더 굴리기"), false);
  assert.equal(diceStage.includes("여기서 멈추기"), false);
});


test("Can't Stop rolling state collapses split push controls into one disabled button", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(
    app,
    /!rolling && view\.phase === "PUSH_OR_STOP"[\s\S]*cant-stop-dice-stage__action-slot--split/u,
  );
  assert.match(
    app,
    /rolling[\s\S]*text: "주사위 굴리는 중…"[\s\S]*disabled: true/u,
  );
});

test("Can't Stop blizzard uses round snow particles instead of line streaks", () => {
  const css = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "cant-stop.css"),
    "utf8",
  );

  assert.match(css, /cant-stop-blizzard-snowballs/u);
  assert.match(css, /radial-gradient\(circle/u);
  assert.equal(css.includes("cant-stop-blizzard-streaks"), false);
});


test("Can't Stop renders each dice value in its own badge directly below the die", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(app, /cant-stop-die-result/u);
  assert.match(app, /cant-stop-die-result__value/u);
  assert.equal(app.includes('view.latestDice.join(" · ")'), false);
});


test("Can't Stop dice and route sections keep compact half spacing", () => {
  const css = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "cant-stop.css"),
    "utf8",
  );

  assert.match(css, /\.cant-stop-dice-stage \{[\s\S]*gap: \.36rem;/u);
  assert.match(css, /\.cant-stop-dice-stage__caption--empty \{[\s\S]*min-height: 9px;/u);
  assert.match(css, /\.cant-stop-route-panel \{[\s\S]*gap: \.34rem;/u);
});


test("Can't Stop entry lobby removes nickname editing and redundant entry copy", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.equal(app.includes('name: "nickname"'), false);
  assert.equal(app.includes('data.get("nickname")'), false);
  assert.equal(app.includes("Can’t Stop 온라인 방"), false);
  assert.equal(app.includes("처음이라면 게임 규칙부터 보기"), false);
  assert.match(app, /cant-stop-runtime-notes__actions/u);
  assert.match(app, /rulesActionButton\("cant-stop-runtime-notes__rules"\)/u);
});

test("Can't Stop entry hides the normal connected status card but keeps reconnect states available", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(
    app,
    /const suppressConnectionCard = state\.view !== CANT_STOP_LOBBY_VIEW\.ENTRY[\s\S]*game-platform-status/u,
  );
  assert.match(app, /state\.connection === "reconnecting"/u);
  assert.match(app, /state\.connection === "error"/u);
});


test("Can't Stop profile nickname migration keeps room display names server-authoritative", () => {
  const migration = readFileSync(
    path.join(repositoryRoot, "supabase", "cant-stop", "20260920205000_cant_stop_profile_nickname.sql"),
    "utf8",
  );

  assert.match(migration, /cant_stop_enforce_profile_nickname/u);
  assert.match(migration, /from public\.profiles/u);
  assert.match(migration, /new\.nickname := v_nickname/u);
});


test("Can't Stop waiting room previews the real board and keeps ready controls in room guide", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(app, /createCantStopBoardColumns\(\)\.map/u);
  assert.match(app, /waiting: true/u);
  assert.match(app, /title: "게임 준비 중"/u);
  assert.match(app, /모든 플레이어가 준비하면 게임을 시작할 수 있어요\./u);
  assert.match(app, /cant-stop-room-guide__primary/u);
  assert.equal(
    app.includes("다른 플레이어의 변경은 최신 서버 snapshot으로 다시 불러와요."),
    false,
  );
});

test("Can't Stop waiting and playing screens remove the normal connected banner", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(
    app,
    /const suppressConnectionCard = state\.view !== CANT_STOP_LOBBY_VIEW\.ENTRY[\s\S]*game-platform-status/u,
  );
});

test("Can't Stop roster hydrates site profile photos and uses the shared default avatar", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(app, /getPublicProfiles/u);
  assert.match(app, /getSignedAvatarUrl/u);
  assert.match(app, /\.\.\/\.\.\/assets\/images\/default-avatar\.svg/u);
  assert.match(app, /avatarUrl: cantStopAvatarCache/u);
});

test("Can't Stop ready players receive a visual card state in the waiting room", () => {
  const css = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "cant-stop.css"),
    "utf8",
  );

  assert.match(css, /cant-stop-shell--waiting \.game-platform-player\[data-ready="true"\]/u);
  assert.match(css, /--game-player-accent/u);
});

test("Can't Stop gameplay uses a compact sidebar utility bar instead of the shell footer", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(app, /cant-stop-gameplay-tools--count-\$\{Math\.min\(tools\.length, 4\)\}/u);
  assert.match(app, /createGameplayTools\(view, state\)/u);
  assert.match(app, /actions = null/u);
  assert.equal(app.includes("function createGameplayActions"), false);
});

test("Can't Stop desktop board is 900px tall and the sidebar stretches to the same content row", () => {
  const css = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "cant-stop.css"),
    "utf8",
  );

  assert.match(css, /cant-stop-shell--playing \.cant-stop-board__mountain[\s\S]*height: 900px;[\s\S]*min-height: 900px;/u);
  assert.match(css, /cant-stop-shell--playing \.game-platform-shell__content[\s\S]*align-items: stretch;/u);
  assert.match(css, /cant-stop-shell--playing \.game-platform-shell__sidebar[\s\S]*grid-template-rows: auto auto minmax\(0, 1fr\);/u);
  assert.match(css, /cant-stop-shell--playing \.cant-stop-dice-stage[\s\S]*height: 100%;/u);
});


test("Can't Stop suppresses in-room connection cards during manual refresh", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(
    app,
    /const suppressConnectionCard = state\.view !== CANT_STOP_LOBBY_VIEW\.ENTRY[\s\S]*game-platform-status/u,
  );
});

test("Can't Stop ready player cards use a clearly visible tinted waiting-state surface", () => {
  const css = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "cant-stop.css"),
    "utf8",
  );

  assert.match(
    css,
    /cant-stop-shell--waiting \.game-platform-player\[data-ready="true"\][\s\S]*rgba\(114, 201, 209, \.2\)/u,
  );
  assert.match(css, /inset 5px 0 0 var\(--game-player-accent/u);
});

test("Can't Stop end-game dialog reuses alpine board visuals and outlines continue play", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );
  const css = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "cant-stop.css"),
    "utf8",
  );

  assert.match(app, /cant-stop-end-dialog__hero/u);
  assert.match(app, /cant-stop-end-dialog__ridge/u);
  assert.match(app, /cant-stop-end-dialog__continue/u);
  assert.match(css, /cant-stop-end-dialog__hero::before/u);
  assert.match(css, /cant-stop-end-dialog__continue[\s\S]*border: 1px solid/u);
});

test("Can't Stop hides refresh after game over so the compact tool row stays stable", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  const toolsStart = app.indexOf("function createGameplayTools(view, state)");
  const toolsEnd = app.indexOf("\nfunction createField", toolsStart);
  const toolsSource = app.slice(toolsStart, toolsEnd);

  assert.match(toolsSource, /if \(!view\.isGameOver\)[\s\S]*text: "새로고침"/u);
  assert.match(toolsSource, /else \{[\s\S]*text: state\.busy \? "준비 중…" : "재대결"/u);
});

test("Can't Stop base mountain rule is 900px before responsive mobile overrides", () => {
  const css = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "cant-stop.css"),
    "utf8",
  );

  assert.match(
    css,
    /\.cant-stop-board__mountain \{[\s\S]*height: 900px;[\s\S]*min-height: 900px;/u,
  );
});


test("Can't Stop replaces inline action error cards with a three-second modal notice", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.equal(app.includes("cant-stop-inline-error"), false);
  assert.match(app, /function ensureActionNoticeDialog/u);
  assert.match(app, /showActionNotice\(message\)/u);
  assert.equal(app.includes("}, 3000);"), true);
  assert.match(app, /presentActionError\(state\.error, state\.snapshot\?\.version\)/u);
});

test("Can't Stop keeps shell state classes synchronized across patched lobby views", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(app, /currentShell\.className = nextShell\.className/u);
  assert.match(app, /cant-stop-shell--waiting/u);
  assert.match(app, /cant-stop-shell--playing/u);
});

test("Can't Stop ongoing non-host players get leave instead of end-game and only on their turn", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  const toolsStart = app.indexOf("function createGameplayTools(view, state)");
  const toolsEnd = app.indexOf("\nfunction createField", toolsStart);
  const toolsSource = app.slice(toolsStart, toolsEnd);

  assert.match(toolsSource, /if \(view\.isHost\)[\s\S]*text: "게임 종료"/u);
  assert.match(toolsSource, /else \{[\s\S]*text: state\.busy \? "처리 중…" : "방 나가기"/u);
  assert.match(toolsSource, /disabled: state\.busy \|\| !view\.isMyTurn/u);
  assert.match(toolsSource, /자신의 턴에만 방을 나갈 수 있어요\./u);
});

test("Can't Stop utility buttons expand evenly for the current button count", () => {
  const css = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "cant-stop.css"),
    "utf8",
  );

  assert.match(css, /cant-stop-gameplay-tools--count-2[\s\S]*repeat\(2, minmax\(0, 1fr\)\)/u);
  assert.match(css, /cant-stop-gameplay-tools--count-3[\s\S]*repeat\(3, minmax\(0, 1fr\)\)/u);
  assert.match(css, /cant-stop-gameplay-tools__button[\s\S]*width: 100%/u);
});

test("Can't Stop ready state uses the waiting shell class plus a stronger tinted player background", () => {
  const css = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "cant-stop.css"),
    "utf8",
  );

  assert.match(
    css,
    /cant-stop-shell--waiting \.game-platform-player\[data-ready="true"\][\s\S]*30%[\s\S]*18%/u,
  );
});


test("Can't Stop gameplay view distinguishes a two-player leave game over", () => {
  const view = createCantStopGameplayViewModel({
    version: 44,
    room: {
      id: "room-1",
      status: "playing",
      hostUserId: "alice",
    },
    players: [
      { userId: "alice", displayName: "Alice" },
    ],
    viewerUserId: "alice",
    game: {
      phase: "GAME_OVER",
      activePlayerId: "alice",
      turnOrder: ["alice"],
      turnIndex: 0,
      playerProgress: { alice: { 7: 3 } },
      runners: {},
      claimedColumns: {},
      latestDice: null,
      legalPairings: [],
      winnerId: null,
      endReason: "PLAYER_LEFT",
      endedById: "bob",
    },
  }, "alice");

  assert.equal(view.isGameOver, true);
  assert.equal(view.isPlayerLeftEnded, true);
  assert.equal(view.isManuallyEnded, false);
  assert.equal(view.winnerId, null);
  assert.equal(view.winnerName, null);
});

test("Can't Stop player-left game over has explicit board heading copy", () => {
  const app = readFileSync(
    path.join(repositoryRoot, "games", "cant-stop", "app.js"),
    "utf8",
  );

  assert.match(app, /view\.isPlayerLeftEnded/u);
  assert.match(app, /PLAYER LEFT/u);
  assert.match(app, /상대 플레이어가 방을 나가 게임이 종료됐어요/u);
});

test("Can't Stop two-player leave migration ends the game instead of blocking exit", () => {
  const migration = readFileSync(
    path.join(repositoryRoot, "supabase", "cant-stop", "20260920231500_cant_stop_two_player_leave_game_over.sql"),
    "utf8",
  );

  assert.match(migration, /v_active_count = 2/u);
  assert.match(migration, /'phase', 'GAME_OVER'/u);
  assert.match(migration, /'endReason', 'PLAYER_LEFT'/u);
  assert.match(migration, /'endedById', v_user_id::text/u);
  assert.equal(migration.includes("raise exception 'LEAVE_MIN_PLAYERS'"), false);
});
