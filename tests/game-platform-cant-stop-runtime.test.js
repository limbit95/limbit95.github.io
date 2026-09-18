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
