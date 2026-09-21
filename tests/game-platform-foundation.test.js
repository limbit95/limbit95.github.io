import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  GAME_ACCESS_REASON,
  GAME_REGISTRY,
  createGameAccessGate,
  defineGame,
  getRegisteredGame,
  listRegisteredGames,
  resolveApprovedMemberAccess,
} from "../games/shared/index.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("game registry keeps legacy entries intact, activates Can't Stop, and keeps No Thanks! inactive", () => {
  assert.deepEqual(
    GAME_REGISTRY.map((game) => game.id),
    ["liar", "the-game", "marble", "cant-stop", "no-thanks"],
  );

  const legacyGames = GAME_REGISTRY.filter((game) => game.platform === "legacy");
  assert.deepEqual(legacyGames.map((game) => game.id), ["liar", "the-game", "marble"]);
  assert.ok(legacyGames.every((game) => game.capabilities.online));

  assert.equal(getRegisteredGame("the-game")?.href, "./the-game/");
  assert.equal(getRegisteredGame("the-game")?.capabilities.invite, true);
  assert.equal(getRegisteredGame("marble")?.capabilities.presence, true);

  const cantStop = getRegisteredGame("cant-stop");
  assert.equal(cantStop?.platform, "shared");
  assert.equal(cantStop?.href, "./games/cant-stop/");
  assert.deepEqual(cantStop?.capabilities, {
    online: true,
    local: false,
    invite: true,
    presence: false,
  });
  assert.equal(cantStop?.buttonText, "Can’t Stop 시작");

  const noThanks = getRegisteredGame("no-thanks");
  assert.equal(noThanks?.platform, "shared");
  assert.equal(noThanks?.href, "./games/no-thanks/");
  assert.deepEqual(noThanks?.capabilities, {
    online: false,
    local: false,
    invite: false,
    presence: false,
  });

  assert.equal(getRegisteredGame("missing"), null);

  const copy = listRegisteredGames();
  copy.pop();
  assert.equal(GAME_REGISTRY.length, 5);
  assert.ok(Object.isFrozen(GAME_REGISTRY));
  assert.ok(Object.isFrozen(GAME_REGISTRY[0]));
  assert.ok(Object.isFrozen(GAME_REGISTRY[0].capabilities));
});

test("game registry validates new shared game definitions", () => {
  const game = defineGame({
    id: "cant-stop",
    title: "Can’t Stop",
    href: "./games/cant-stop/",
    icon: "🎲",
    description: "주사위 조합으로 열을 올라가는 게임",
    buttonText: "게임 시작",
    capabilities: { online: true, presence: true },
    platform: "shared",
  });

  assert.equal(game.platform, "shared");
  assert.deepEqual(game.capabilities, {
    online: true,
    local: false,
    invite: false,
    presence: true,
  });

  assert.throws(
    () => defineGame({ ...game, id: "Cant Stop" }),
    /lowercase kebab-case/u,
  );
  assert.throws(
    () => defineGame({ ...game, href: "https://example.com/game" }),
    /site-relative/u,
  );
});

test("approved-member access resolution separates signed-out and unapproved states", () => {
  assert.deepEqual(resolveApprovedMemberAccess(null), {
    allowed: false,
    reason: GAME_ACCESS_REASON.AUTHENTICATION_REQUIRED,
    userId: null,
  });

  assert.deepEqual(resolveApprovedMemberAccess({
    isAuthenticated: true,
    isApproved: false,
    user: { id: "pending-user" },
  }), {
    allowed: false,
    reason: GAME_ACCESS_REASON.APPROVAL_REQUIRED,
    userId: "pending-user",
  });

  assert.deepEqual(resolveApprovedMemberAccess({
    isAuthenticated: true,
    isApproved: true,
    user: { id: "approved-user" },
  }), {
    allowed: true,
    reason: null,
    userId: "approved-user",
  });
});

test("game access gate adapts an auth source and unsubscribes through the source", async () => {
  let state = {
    isAuthenticated: false,
    isApproved: false,
    user: null,
  };
  let subscriber = null;
  let unsubscribed = false;

  const gate = createGameAccessGate({
    async initialize() {
      return state;
    },
    getState() {
      return state;
    },
    subscribe(listener) {
      subscriber = listener;
      return () => {
        unsubscribed = true;
        subscriber = null;
      };
    },
  });

  assert.equal((await gate.initialize()).reason, GAME_ACCESS_REASON.AUTHENTICATION_REQUIRED);

  const seen = [];
  const unsubscribe = gate.subscribe((access) => seen.push(access));
  assert.equal(seen.length, 1);

  state = {
    isAuthenticated: true,
    isApproved: true,
    user: { id: "approved-user" },
  };
  subscriber(state);

  assert.deepEqual(seen.at(-1), {
    allowed: true,
    reason: null,
    userId: "approved-user",
  });

  unsubscribe();
  assert.equal(unsubscribed, true);
});


test("main games page exposes Can't Stop as a playable card", () => {
  const gamesPage = readFileSync(
    path.join(repositoryRoot, "js", "pages", "games.js"),
    "utf8",
  );

  assert.match(gamesPage, /title: "Can’t Stop"/u);
  assert.match(gamesPage, /href: "\.\/games\/cant-stop\/"?/u);
  assert.match(gamesPage, /buttonText: "Can’t Stop 시작"/u);
});
