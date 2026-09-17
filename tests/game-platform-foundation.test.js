import assert from "node:assert/strict";
import { test } from "node:test";

import {
  GAME_ACCESS_REASON,
  GAME_REGISTRY,
  createGameAccessGate,
  defineGame,
  getRegisteredGame,
  listRegisteredGames,
  resolveApprovedMemberAccess,
} from "../games/shared/index.js";

test("game registry keeps stable legacy entries without migrating their runtime", () => {
  assert.deepEqual(
    GAME_REGISTRY.map((game) => game.id),
    ["liar", "the-game", "marble"],
  );
  assert.ok(GAME_REGISTRY.every((game) => game.platform === "legacy"));
  assert.ok(GAME_REGISTRY.every((game) => game.capabilities.online));
  assert.equal(getRegisteredGame("the-game")?.href, "./the-game/");
  assert.equal(getRegisteredGame("missing"), null);

  const copy = listRegisteredGames();
  copy.pop();
  assert.equal(GAME_REGISTRY.length, 3);
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
