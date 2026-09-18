import assert from "node:assert/strict";
import { test } from "node:test";

import {
  PLATFORM_GAME_DB_SCENARIOS,
  definePlatformGameDbContract,
  registerPlatformGameDbContract,
} from "./game-db-integration/platformContract.js";

function completeScenarios(overrides = {}) {
  return Object.fromEntries(
    PLATFORM_GAME_DB_SCENARIOS.map(({ id }) => [
      id,
      overrides[id] ?? (async () => {}),
    ]),
  );
}

test("platform DB contract freezes the minimum multiplayer safety scenarios", () => {
  assert.deepEqual(
    PLATFORM_GAME_DB_SCENARIOS.map(({ id }) => id),
    [
      "anonymous_create_denied",
      "unapproved_create_denied",
      "approved_create_allowed",
      "non_member_snapshot_denied",
      "non_host_start_denied",
      "stale_version_rejected",
      "duplicate_action_safe",
      "concurrent_action_single_commit",
      "reconnect_snapshot_authoritative",
      "private_state_not_exposed",
    ],
  );
  assert.ok(Object.isFrozen(PLATFORM_GAME_DB_SCENARIOS));
});

test("platform DB contract requires every mandatory scenario", () => {
  const scenarios = completeScenarios();
  delete scenarios.duplicate_action_safe;

  assert.throws(
    () => definePlatformGameDbContract({
      gameId: "cant-stop",
      createContext: async () => ({}),
      scenarios,
    }),
    /scenarios\.duplicate_action_safe/u,
  );

  assert.throws(
    () => definePlatformGameDbContract({
      gameId: "Can Stop",
      createContext: async () => ({}),
      scenarios: completeScenarios(),
    }),
    /lowercase kebab-case/u,
  );
});

test("platform DB contract runner shares one disposable context across contract scenarios", async () => {
  const registrations = [];
  const lifecycle = [];
  const scenarioCalls = [];

  const hooks = {
    before(callback) {
      registrations.push(["before", callback]);
    },
    after(callback) {
      registrations.push(["after", callback]);
    },
    test(name, callback) {
      registrations.push(["test", name, callback]);
    },
  };

  registerPlatformGameDbContract({
    gameId: "cant-stop",
    async createContext() {
      lifecycle.push("create");
      return { roomId: "room-1" };
    },
    async destroyContext(context) {
      lifecycle.push(["destroy", context.roomId]);
    },
    scenarios: completeScenarios(Object.fromEntries(
      PLATFORM_GAME_DB_SCENARIOS.map(({ id }) => [
        id,
        async (context) => scenarioCalls.push([id, context.roomId]),
      ]),
    )),
  }, hooks);

  const beforeRegistration = registrations.find(([type]) => type === "before");
  const afterRegistration = registrations.find(([type]) => type === "after");
  const testRegistrations = registrations.filter(([type]) => type === "test");

  assert.equal(testRegistrations.length, PLATFORM_GAME_DB_SCENARIOS.length);

  await beforeRegistration[1]();
  for (const [, , callback] of testRegistrations) {
    await callback();
  }
  await afterRegistration[1]();

  assert.deepEqual(lifecycle, ["create", ["destroy", "room-1"]]);
  assert.deepEqual(
    scenarioCalls.map(([id]) => id),
    PLATFORM_GAME_DB_SCENARIOS.map(({ id }) => id),
  );
  assert.ok(scenarioCalls.every(([, roomId]) => roomId === "room-1"));
});

test("platform DB contract runner gives every scenario a stable game-scoped test name", () => {
  const names = [];

  registerPlatformGameDbContract({
    gameId: "cant-stop",
    createContext: async () => ({}),
    scenarios: completeScenarios(),
  }, {
    before() {},
    after() {},
    test(name) {
      names.push(name);
    },
  });

  assert.equal(names.length, PLATFORM_GAME_DB_SCENARIOS.length);
  assert.ok(names.every((name) => name.startsWith("cant-stop: ")));
});
