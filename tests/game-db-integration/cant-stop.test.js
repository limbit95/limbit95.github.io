import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import { enumeratePairings } from "../../games/cant-stop/rules.js";
import { registerPlatformGameDbContract } from "./platformContract.js";

const supabaseUrl = process.env.E2E_LOCAL_SUPABASE_URL;
const anonKey = process.env.E2E_LOCAL_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.E2E_LOCAL_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
  throw new Error("Can’t Stop DB integration requires local Supabase credentials.");
}

const password = "Cheongpa-Cant-Stop-E2E-2026!";
const createdUserIds = [];

function jsonHeaders({ key = anonKey, token = key } = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function request(path, {
  method = "GET",
  body,
  key = anonKey,
  token = key,
  headers = {},
} = {}) {
  const response = await fetch(`${supabaseUrl}${path}`, {
    method,
    headers: {
      ...jsonHeaders({ key, token }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  return { response, data, text };
}

async function expectOk(result, label) {
  assert.equal(
    result.response.ok,
    true,
    `${label} failed (${result.response.status}): ${result.text}`,
  );
  return result.data;
}

function expectDenied(result, label, expectedPattern = null) {
  assert.equal(
    result.response.ok,
    false,
    `${label} unexpectedly succeeded: ${result.text}`,
  );
  assert.ok(result.response.status >= 400, `${label} returned an unexpected status.`);
  if (expectedPattern) {
    assert.match(result.text, expectedPattern, `${label} returned the wrong error.`);
  }
}

async function rpc(name, body = {}, token = anonKey) {
  return request(`/rest/v1/rpc/${name}`, {
    method: "POST",
    token,
    body,
  });
}

async function createTestUser(label, status = "approved") {
  const suffix = randomUUID().slice(0, 8);
  const email = `cant-stop-${label}-${suffix}@example.com`;
  const displayName = `Can’t Stop ${label}`;
  const approvedAt = new Date().toISOString();
  const approvedLike = status === "approved";
  const joinStatus = status === "pending" ? "pending" : "approved";

  const created = await expectOk(await request("/auth/v1/admin/users", {
    method: "POST",
    key: serviceRoleKey,
    token: serviceRoleKey,
    body: {
      email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: displayName,
        real_name: displayName,
        birth_year: "1990",
        age_visibility: "private",
        church_group: "E2E",
        request_message: "Can’t Stop DB integration",
        privacy_policy_version: "2026-08",
        privacy_consent: true,
        community_rules_version: "2026-09",
        rules_consent: true,
      },
    },
  }), `create ${label} auth user`);

  assert.ok(created?.id, `create ${label} auth user did not return an id.`);
  createdUserIds.push(created.id);

  await expectOk(await request("/rest/v1/profiles?on_conflict=id", {
    method: "POST",
    key: serviceRoleKey,
    token: serviceRoleKey,
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: {
      id: created.id,
      display_name: displayName,
      real_name: displayName,
      birth_year: 1990,
      age_visibility: "private",
      status,
      approved_at: approvedLike ? approvedAt : null,
      role: "member",
    },
  }), `set ${label} profile`);

  await expectOk(await request("/rest/v1/join_requests?on_conflict=user_id", {
    method: "POST",
    key: serviceRoleKey,
    token: serviceRoleKey,
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: {
      user_id: created.id,
      email,
      real_name: displayName,
      church_group: "E2E",
      request_message: "Can’t Stop DB integration",
      status: joinStatus,
      privacy_consent_at: approvedAt,
      privacy_policy_version: "2026-08",
      rules_consent_at: approvedAt,
      community_rules_version: "2026-09",
    },
  }), `set ${label} join request`);

  const session = await expectOk(await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email, password },
  }), `sign in ${label}`);

  assert.ok(session?.access_token, `${label} sign-in did not return an access token.`);
  return {
    id: created.id,
    displayName,
    accessToken: session.access_token,
  };
}

async function createRoom(user, nickname = "Host") {
  return expectOk(await rpc("cant_stop_create_room", {
    p_nickname: nickname,
    p_max_players: 4,
  }, user.accessToken), "cant_stop_create_room");
}

async function joinRoom(user, created, nickname = "Guest") {
  return expectOk(await rpc("cant_stop_join_room", {
    p_room_code: created.room.roomCode,
    p_nickname: nickname,
  }, user.accessToken), "cant_stop_join_room");
}

async function setReady(user, snapshot, ready, actionId = randomUUID()) {
  return expectOk(await rpc("cant_stop_set_ready", {
    p_room_id: snapshot.room.id,
    p_ready: ready,
    p_expected_version: Number(snapshot.version),
    p_client_action_id: actionId,
  }, user.accessToken), "cant_stop_set_ready");
}

async function startTwoPlayerGame(label) {
  const host = await createTestUser(`${label}-host`);
  const guest = await createTestUser(`${label}-guest`);
  const created = await createRoom(host);
  const joined = await joinRoom(guest, created);
  const ready = await setReady(guest, joined, true);
  const started = await expectOk(await rpc("cant_stop_start_game", {
    p_room_id: ready.room.id,
    p_expected_version: Number(ready.version),
    p_client_action_id: randomUUID(),
  }, host.accessToken), `${label} cant_stop_start_game`);
  return { host, guest, started };
}

registerPlatformGameDbContract({
  gameId: "cant-stop",

  createContext: async () => ({
    createTestUser,
    rpc,
    expectOk,
    expectDenied,
  }),

  destroyContext: async () => {
    for (const userId of createdUserIds) {
      await request(`/auth/v1/admin/users/${userId}`, {
        method: "DELETE",
        key: serviceRoleKey,
        token: serviceRoleKey,
      }).catch(() => null);
    }
  },

  scenarios: {
    anonymous_entry_denied: async () => {
      const host = await createTestUser("anon-host");
      const created = await createRoom(host);

      expectDenied(await rpc("cant_stop_create_room", {
        p_nickname: "Anonymous",
        p_max_players: 4,
      }), "anonymous cant_stop_create_room");

      expectDenied(await rpc("cant_stop_join_room", {
        p_room_code: created.room.roomCode,
        p_nickname: "Anonymous",
      }), "anonymous cant_stop_join_room");
    },

    unapproved_entry_denied: async () => {
      const host = await createTestUser("pending-host");
      const pending = await createTestUser("pending-user", "pending");
      const created = await createRoom(host);

      expectDenied(await rpc("cant_stop_create_room", {
        p_nickname: "Pending",
        p_max_players: 4,
      }, pending.accessToken), "pending cant_stop_create_room", /AUTH_REQUIRED/u);

      expectDenied(await rpc("cant_stop_join_room", {
        p_room_code: created.room.roomCode,
        p_nickname: "Pending",
      }, pending.accessToken), "pending cant_stop_join_room", /AUTH_REQUIRED/u);
    },

    approved_entry_allowed: async () => {
      const host = await createTestUser("approved-host");
      const guest = await createTestUser("approved-guest");
      const created = await createRoom(host, "Alice");
      const joined = await joinRoom(guest, created, "Bob");

      assert.equal(created.room.status, "waiting");
      assert.equal(created.players.length, 1);
      assert.equal(joined.players.length, 2);
      assert.equal(joined.players.some((player) => player.userId === guest.id), true);
      assert.equal(Number(joined.version), Number(created.version) + 1);
    },

    non_member_snapshot_denied: async () => {
      const host = await createTestUser("snapshot-host");
      const outsider = await createTestUser("snapshot-outsider");
      const created = await createRoom(host);

      const result = await rpc("cant_stop_get_lobby_snapshot", {
        p_room_id: created.room.id,
      }, outsider.accessToken);
      expectDenied(result, "outsider cant_stop_get_lobby_snapshot", /ROOM_NOT_FOUND/u);
    },

    non_host_start_denied: async () => {
      const host = await createTestUser("start-host");
      const guest = await createTestUser("start-guest");
      const created = await createRoom(host);
      const joined = await joinRoom(guest, created);
      const ready = await setReady(guest, joined, true);

      const result = await rpc("cant_stop_start_game", {
        p_room_id: ready.room.id,
        p_expected_version: Number(ready.version),
        p_client_action_id: randomUUID(),
      }, guest.accessToken);
      expectDenied(result, "non-host cant_stop_start_game", /HOST_REQUIRED/u);
    },

    stale_version_rejected: async () => {
      const host = await createTestUser("stale-host");
      const guest = await createTestUser("stale-guest");
      const created = await createRoom(host);
      const joined = await joinRoom(guest, created);

      const result = await rpc("cant_stop_set_ready", {
        p_room_id: joined.room.id,
        p_ready: true,
        p_expected_version: Number(joined.version) + 100,
        p_client_action_id: randomUUID(),
      }, guest.accessToken);
      expectDenied(result, "stale cant_stop_set_ready", /VERSION_CONFLICT/u);
    },

    duplicate_action_safe: async () => {
      const host = await createTestUser("duplicate-host");
      const guest = await createTestUser("duplicate-guest");
      const created = await createRoom(host);
      const joined = await joinRoom(guest, created);
      const clientActionId = randomUUID();

      const first = await setReady(guest, joined, true, clientActionId);
      const replay = await expectOk(await rpc("cant_stop_set_ready", {
        p_room_id: joined.room.id,
        p_ready: true,
        p_expected_version: Number(joined.version),
        p_client_action_id: clientActionId,
      }, guest.accessToken), "duplicate cant_stop_set_ready");

      assert.equal(Number(first.version), Number(joined.version) + 1);
      assert.equal(Number(replay.version), Number(first.version));

      const snapshot = await expectOk(await rpc("cant_stop_get_lobby_snapshot", {
        p_room_id: joined.room.id,
      }, guest.accessToken), "snapshot after duplicate action");
      assert.equal(Number(snapshot.version), Number(first.version));
    },

    concurrent_action_single_commit: async () => {
      const host = await createTestUser("concurrent-host");
      const guest = await createTestUser("concurrent-guest");
      const created = await createRoom(host);
      const joined = await joinRoom(guest, created);
      const expectedVersion = Number(joined.version);

      const results = await Promise.all([
        rpc("cant_stop_set_ready", {
          p_room_id: joined.room.id,
          p_ready: true,
          p_expected_version: expectedVersion,
          p_client_action_id: randomUUID(),
        }, guest.accessToken),
        rpc("cant_stop_set_ready", {
          p_room_id: joined.room.id,
          p_ready: false,
          p_expected_version: expectedVersion,
          p_client_action_id: randomUUID(),
        }, guest.accessToken),
      ]);

      const successes = results.filter((result) => result.response.ok);
      const failures = results.filter((result) => !result.response.ok);
      assert.equal(successes.length, 1, "exactly one concurrent command should commit");
      assert.equal(failures.length, 1, "the conflicting concurrent command should fail");
      assert.match(failures[0].text, /VERSION_CONFLICT/u);

      const snapshot = await expectOk(await rpc("cant_stop_get_lobby_snapshot", {
        p_room_id: joined.room.id,
      }, guest.accessToken), "snapshot after concurrent actions");
      assert.equal(Number(snapshot.version), expectedVersion + 1);
    },

    reconnect_snapshot_authoritative: async () => {
      const host = await createTestUser("reconnect-host");
      const guest = await createTestUser("reconnect-guest");
      const created = await createRoom(host);
      const joined = await joinRoom(guest, created);
      const ready = await setReady(guest, joined, true);

      const reloaded = await expectOk(await rpc("cant_stop_get_my_active_room", {}, guest.accessToken), "cant_stop_get_my_active_room");
      assert.equal(reloaded.room.id, ready.room.id);
      assert.equal(Number(reloaded.version), Number(ready.version));
      assert.equal(
        reloaded.players.find((player) => player.userId === guest.id)?.isReady,
        true,
      );
    },

    private_state_not_exposed: async () => {
      const host = await createTestUser("privacy-host");
      const guest = await createTestUser("privacy-guest");
      const created = await createRoom(host);
      const joined = await joinRoom(guest, created);
      const ready = await setReady(guest, joined, true);

      const started = await expectOk(await rpc("cant_stop_start_game", {
        p_room_id: ready.room.id,
        p_expected_version: Number(ready.version),
        p_client_action_id: randomUUID(),
      }, host.accessToken), "host cant_stop_start_game");

      assert.equal(started.room.status, "playing");
      assert.ok(started.game, "started snapshot must include public game state");
      assert.deepEqual(
        [...started.game.turnOrder].sort(),
        [host.id, guest.id].sort(),
      );
      assert.equal(started.game.activePlayerId, started.game.turnOrder[0]);
      assert.deepEqual(
        Object.keys(started.game).sort(),
        [
          "activePlayerId",
          "claimedColumns",
          "latestDice",
          "legalPairings",
          "phase",
          "playerProgress",
          "runners",
          "turnIndex",
          "turnOrder",
          "winnerId",
        ].sort(),
      );
      assert.equal(Object.hasOwn(started, "privateState"), false);
      assert.equal(Object.hasOwn(started.game, "privateState"), false);
      assert.equal(Object.hasOwn(started.game, "secret"), false);
    },
  },
}, { before, after, test });


test("cant-stop: active player roll is server-generated and idempotent", async () => {
  const { host, guest, started } = await startTwoPlayerGame("roll-authority");
  const activeUser = started.game.activePlayerId === host.id ? host : guest;
  const actionId = randomUUID();

  const rolled = await expectOk(await rpc("cant_stop_roll_dice", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: actionId,
  }, activeUser.accessToken), "active player cant_stop_roll_dice");

  assert.equal(Number(rolled.version), Number(started.version) + 1);
  assert.equal(rolled.game.phase, "PAIRING_SELECTION");
  assert.equal(Array.isArray(rolled.game.latestDice), true);
  assert.equal(rolled.game.latestDice.length, 4);
  assert.equal(
    rolled.game.latestDice.every((die) => Number.isInteger(die) && die >= 1 && die <= 6),
    true,
  );
  assert.equal(Array.isArray(rolled.game.legalPairings), true);
  assert.ok(rolled.game.legalPairings.length >= 1);
  assert.deepEqual(
    rolled.game.legalPairings.map((pairing) => pairing.sums),
    enumeratePairings(rolled.game.latestDice),
  );
  for (const pairing of rolled.game.legalPairings) {
    assert.equal(Array.isArray(pairing.sums), true);
    assert.equal(pairing.sums.length, 2);
    assert.equal(Array.isArray(pairing.plans), true);
    assert.ok(pairing.plans.length >= 1);
  }

  const replay = await expectOk(await rpc("cant_stop_roll_dice", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: actionId,
  }, activeUser.accessToken), "replayed cant_stop_roll_dice");

  assert.equal(Number(replay.version), Number(rolled.version));
  assert.deepEqual(replay.game.latestDice, rolled.game.latestDice);
  assert.deepEqual(replay.game.legalPairings, rolled.game.legalPairings);
});

test("cant-stop: non-active player cannot roll dice", async () => {
  const { host, guest, started } = await startTwoPlayerGame("roll-turn");
  const inactiveUser = started.game.activePlayerId === host.id ? guest : host;

  const result = await rpc("cant_stop_roll_dice", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: randomUUID(),
  }, inactiveUser.accessToken);

  expectDenied(result, "inactive player cant_stop_roll_dice", /TURN_REQUIRED/u);
});

test("cant-stop: stale roll version is rejected before dice commit", async () => {
  const { host, guest, started } = await startTwoPlayerGame("roll-stale");
  const activeUser = started.game.activePlayerId === host.id ? host : guest;

  const result = await rpc("cant_stop_roll_dice", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version) + 1,
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken);

  expectDenied(result, "stale cant_stop_roll_dice", /VERSION_CONFLICT/u);
});
