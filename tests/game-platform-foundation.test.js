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


test("game registry protects the Legacy baseline without constraining platform-native additions", () => {
  const legacyGames = GAME_REGISTRY.filter((game) => game.platform === "legacy");
  assert.deepEqual(legacyGames.map((game) => game.id), ["liar", "the-game", "marble"]);
  assert.ok(legacyGames.every((game) => game.capabilities.online));

  assert.equal(getRegisteredGame("liar")?.href, "./liar-game/");
  assert.equal(getRegisteredGame("the-game")?.href, "./the-game/");
  assert.equal(getRegisteredGame("the-game")?.capabilities.invite, true);
  assert.equal(getRegisteredGame("marble")?.href, "./marble-game/");
  assert.equal(getRegisteredGame("marble")?.capabilities.presence, true);
});

test("game registry keeps generic lookup and list contracts stable as entries grow", () => {
  const ids = GAME_REGISTRY.map((game) => game.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getRegisteredGame("missing"), null);

  const registryLength = GAME_REGISTRY.length;
  const copy = listRegisteredGames();
  copy.pop();

  assert.equal(GAME_REGISTRY.length, registryLength);
  assert.ok(Object.isFrozen(GAME_REGISTRY));
  assert.ok(Object.isFrozen(GAME_REGISTRY[0]));
  assert.ok(Object.isFrozen(GAME_REGISTRY[0].capabilities));
});

test("game registry validates new shared game definitions", () => {
  const game = defineGame({
    id: "sample-game",
    title: "Sample Game",
    href: "./games/sample-game/",
    icon: "🎲",
    description: "Registry 계약 검증용 샘플 게임",
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

