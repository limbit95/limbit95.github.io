import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import {
  applyPairingChoice,
  continueTurn,
  createInitialGameState,
  enumeratePairings,
  resolveRoll,
  stopTurn,
} from "../../games/cant-stop/rules.js";
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

async function advanceToPushOrStop(label) {
  const game = await startTwoPlayerGame(label);
  const activeUser = game.started.game.activePlayerId === game.host.id
    ? game.host
    : game.guest;

  const rolled = await expectOk(await rpc("cant_stop_roll_dice", {
    p_room_id: game.started.room.id,
    p_expected_version: Number(game.started.version),
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken), `${label} cant_stop_roll_dice`);

  const pairing = rolled.game.legalPairings[0];
  const plan = pairing.plans[0];
  const chosen = await expectOk(await rpc("cant_stop_choose_pairing", {
    p_room_id: rolled.room.id,
    p_sums: pairing.sums,
    p_columns: plan,
    p_expected_version: Number(rolled.version),
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken), `${label} cant_stop_choose_pairing`);

  return { ...game, activeUser, rolled, pairing, plan, chosen };
}

function serverGameToLocal(game) {
  return {
    phase: game.phase,
    players: game.turnOrder.map((id) => ({
      id,
      progress: { ...(game.playerProgress?.[id] ?? {}) },
    })),
    turnOrder: [...game.turnOrder],
    turnIndex: Number(game.turnIndex),
    activePlayerId: game.activePlayerId,
    claimedColumns: { ...(game.claimedColumns ?? {}) },
    runners: { ...(game.runners ?? {}) },
    latestDice: game.latestDice ? [...game.latestDice] : null,
    legalPairings: (game.legalPairings ?? []).map((pairing) => ({
      sums: [...pairing.sums],
      plans: pairing.plans.map((plan) => [...plan]),
    })),
    winnerId: game.winnerId ?? null,
  };
}

function localProgressByPlayer(state) {
  return Object.fromEntries(
    state.players.map((player) => [player.id, { ...player.progress }]),
  );
}

async function setAuthoritativeGameState(roomId, gameState, version) {
  const result = await request(`/rest/v1/cant_stop_rooms?id=eq.${roomId}`, {
    method: "PATCH",
    key: serviceRoleKey,
    token: serviceRoleKey,
    headers: { Prefer: "return=representation" },
    body: {
      status: "playing",
      game_state: gameState,
      version,
    },
  });
  const rows = await expectOk(result, "set Can’t Stop authoritative fixture");
  assert.equal(Array.isArray(rows), true);
  assert.equal(rows.length, 1);
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
  const sortPairings = (pairings) => [...pairings]
    .map((pairing) => [...pairing])
    .sort((left, right) => (left[0] - right[0]) || (left[1] - right[1]));
  assert.deepEqual(
    sortPairings(rolled.game.legalPairings.map((pairing) => pairing.sums)),
    sortPairings(enumeratePairings(rolled.game.latestDice)),
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


test("cant-stop: active player can choose only a server-issued legal pairing plan", async () => {
  const { host, guest, started } = await startTwoPlayerGame("choose-authority");
  const activeUser = started.game.activePlayerId === host.id ? host : guest;

  const rolled = await expectOk(await rpc("cant_stop_roll_dice", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken), "choose-authority cant_stop_roll_dice");

  const pairing = rolled.game.legalPairings[0];
  const plan = pairing.plans[0];
  const actionId = randomUUID();

  const chosen = await expectOk(await rpc("cant_stop_choose_pairing", {
    p_room_id: rolled.room.id,
    p_sums: pairing.sums,
    p_columns: plan,
    p_expected_version: Number(rolled.version),
    p_client_action_id: actionId,
  }, activeUser.accessToken), "active player cant_stop_choose_pairing");

  const localInitial = createInitialGameState({
    playerIds: [host.id, guest.id],
    turnOrder: started.game.turnOrder,
  });
  const localRolled = resolveRoll(localInitial, rolled.game.latestDice);
  const localChosen = applyPairingChoice(localRolled, {
    sums: pairing.sums,
    columns: plan,
  });

  assert.equal(Number(chosen.version), Number(rolled.version) + 1);
  assert.equal(chosen.game.phase, "PUSH_OR_STOP");
  assert.deepEqual(chosen.game.runners, localChosen.runners);
  assert.deepEqual(chosen.game.legalPairings, []);
  assert.deepEqual(chosen.game.latestDice, rolled.game.latestDice);

  const replay = await expectOk(await rpc("cant_stop_choose_pairing", {
    p_room_id: rolled.room.id,
    p_sums: pairing.sums,
    p_columns: plan,
    p_expected_version: Number(rolled.version),
    p_client_action_id: actionId,
  }, activeUser.accessToken), "replayed cant_stop_choose_pairing");

  assert.equal(Number(replay.version), Number(chosen.version));
  assert.deepEqual(replay.game.runners, chosen.game.runners);
});

test("cant-stop: illegal pairing choice is rejected without advancing version", async () => {
  const { host, guest, started } = await startTwoPlayerGame("choose-illegal");
  const activeUser = started.game.activePlayerId === host.id ? host : guest;

  const rolled = await expectOk(await rpc("cant_stop_roll_dice", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken), "choose-illegal cant_stop_roll_dice");

  const legalKeys = new Set(
    rolled.game.legalPairings.map((pairing) => pairing.sums.join(":")),
  );
  let illegalSums = null;
  for (let first = 2; first <= 12 && !illegalSums; first += 1) {
    for (let second = first; second <= 12; second += 1) {
      if (!legalKeys.has(`${first}:${second}`)) {
        illegalSums = [first, second];
        break;
      }
    }
  }
  assert.ok(illegalSums, "an unavailable pairing must exist");

  const result = await rpc("cant_stop_choose_pairing", {
    p_room_id: rolled.room.id,
    p_sums: illegalSums,
    p_columns: [illegalSums[0]],
    p_expected_version: Number(rolled.version),
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken);

  expectDenied(result, "illegal cant_stop_choose_pairing", /ILLEGAL_PAIRING_CHOICE/u);

  const snapshot = await expectOk(await rpc("cant_stop_get_lobby_snapshot", {
    p_room_id: rolled.room.id,
  }, activeUser.accessToken), "snapshot after illegal pairing");
  assert.equal(Number(snapshot.version), Number(rolled.version));
  assert.equal(snapshot.game.phase, "PAIRING_SELECTION");
});

test("cant-stop: pairing action id cannot be replayed with a different payload", async () => {
  const { host, guest, started } = await startTwoPlayerGame("choose-conflict");
  const activeUser = started.game.activePlayerId === host.id ? host : guest;

  const rolled = await expectOk(await rpc("cant_stop_roll_dice", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken), "choose-conflict cant_stop_roll_dice");

  const pairing = rolled.game.legalPairings[0];
  const plan = pairing.plans[0];
  const actionId = randomUUID();

  await expectOk(await rpc("cant_stop_choose_pairing", {
    p_room_id: rolled.room.id,
    p_sums: pairing.sums,
    p_columns: plan,
    p_expected_version: Number(rolled.version),
    p_client_action_id: actionId,
  }, activeUser.accessToken), "initial cant_stop_choose_pairing");

  const changedColumns = [plan[0] === 2 ? 3 : 2];

  const conflict = await rpc("cant_stop_choose_pairing", {
    p_room_id: rolled.room.id,
    p_sums: pairing.sums,
    p_columns: changedColumns,
    p_expected_version: Number(rolled.version),
    p_client_action_id: actionId,
  }, activeUser.accessToken);

  expectDenied(conflict, "conflicting pairing replay", /ACTION_ID_CONFLICT/u);
});

test("cant-stop: non-active player cannot choose a pairing", async () => {
  const { host, guest, started } = await startTwoPlayerGame("choose-turn");
  const activeUser = started.game.activePlayerId === host.id ? host : guest;
  const inactiveUser = started.game.activePlayerId === host.id ? guest : host;

  const rolled = await expectOk(await rpc("cant_stop_roll_dice", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken), "choose-turn cant_stop_roll_dice");

  const pairing = rolled.game.legalPairings[0];

  const result = await rpc("cant_stop_choose_pairing", {
    p_room_id: rolled.room.id,
    p_sums: pairing.sums,
    p_columns: pairing.plans[0],
    p_expected_version: Number(rolled.version),
    p_client_action_id: randomUUID(),
  }, inactiveUser.accessToken);

  expectDenied(result, "inactive player cant_stop_choose_pairing", /TURN_REQUIRED/u);
});

test("cant-stop: stale pairing version is rejected before runner commit", async () => {
  const { host, guest, started } = await startTwoPlayerGame("choose-stale");
  const activeUser = started.game.activePlayerId === host.id ? host : guest;

  const rolled = await expectOk(await rpc("cant_stop_roll_dice", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken), "choose-stale cant_stop_roll_dice");

  const pairing = rolled.game.legalPairings[0];

  const result = await rpc("cant_stop_choose_pairing", {
    p_room_id: rolled.room.id,
    p_sums: pairing.sums,
    p_columns: pairing.plans[0],
    p_expected_version: Number(rolled.version) + 1,
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken);

  expectDenied(result, "stale cant_stop_choose_pairing", /VERSION_CONFLICT/u);
});


test("cant-stop: continue turn preserves runners and returns the same player to TURN_ROLL", async () => {
  const { activeUser, chosen } = await advanceToPushOrStop("continue-authority");
  const localContinued = continueTurn(serverGameToLocal(chosen.game));
  const actionId = randomUUID();

  const continued = await expectOk(await rpc("cant_stop_continue_turn", {
    p_room_id: chosen.room.id,
    p_expected_version: Number(chosen.version),
    p_client_action_id: actionId,
  }, activeUser.accessToken), "active player cant_stop_continue_turn");

  assert.equal(Number(continued.version), Number(chosen.version) + 1);
  assert.equal(continued.game.phase, localContinued.phase);
  assert.equal(continued.game.activePlayerId, localContinued.activePlayerId);
  assert.equal(Number(continued.game.turnIndex), localContinued.turnIndex);
  assert.deepEqual(continued.game.runners, localContinued.runners);
  assert.equal(continued.game.latestDice, null);
  assert.deepEqual(continued.game.legalPairings, []);

  const replay = await expectOk(await rpc("cant_stop_continue_turn", {
    p_room_id: chosen.room.id,
    p_expected_version: Number(chosen.version),
    p_client_action_id: actionId,
  }, activeUser.accessToken), "replayed cant_stop_continue_turn");

  assert.equal(Number(replay.version), Number(continued.version));
  assert.deepEqual(replay.game.runners, continued.game.runners);
});

test("cant-stop: stop turn commits runner progress and advances to the next player", async () => {
  const { activeUser, chosen } = await advanceToPushOrStop("stop-authority");
  const localStopped = stopTurn(serverGameToLocal(chosen.game));
  const actionId = randomUUID();

  const stopped = await expectOk(await rpc("cant_stop_stop_turn", {
    p_room_id: chosen.room.id,
    p_expected_version: Number(chosen.version),
    p_client_action_id: actionId,
  }, activeUser.accessToken), "active player cant_stop_stop_turn");

  assert.equal(Number(stopped.version), Number(chosen.version) + 1);
  assert.equal(stopped.game.phase, localStopped.phase);
  assert.equal(stopped.game.activePlayerId, localStopped.activePlayerId);
  assert.equal(Number(stopped.game.turnIndex), localStopped.turnIndex);
  assert.deepEqual(stopped.game.runners, {});
  assert.deepEqual(stopped.game.claimedColumns, localStopped.claimedColumns);
  assert.deepEqual(stopped.game.playerProgress, localProgressByPlayer(localStopped));
  assert.equal(stopped.game.latestDice, null);
  assert.deepEqual(stopped.game.legalPairings, []);

  const replay = await expectOk(await rpc("cant_stop_stop_turn", {
    p_room_id: chosen.room.id,
    p_expected_version: Number(chosen.version),
    p_client_action_id: actionId,
  }, activeUser.accessToken), "replayed cant_stop_stop_turn");

  assert.equal(Number(replay.version), Number(stopped.version));
  assert.deepEqual(replay.game.playerProgress, stopped.game.playerProgress);
});

test("cant-stop: stopping on a column top claims it and removes other players' progress", async () => {
  const { host, guest, started } = await startTwoPlayerGame("stop-claim");
  const activeUser = started.game.activePlayerId === host.id ? host : guest;
  const otherUser = activeUser.id === host.id ? guest : host;
  const version = 100;

  const fixture = {
    ...started.game,
    phase: "PUSH_OR_STOP",
    playerProgress: {
      [activeUser.id]: { 2: 2, 5: 1 },
      [otherUser.id]: { 2: 1, 6: 2 },
    },
    claimedColumns: {},
    runners: { 2: 3 },
    latestDice: [1, 1, 3, 4],
    legalPairings: [],
    winnerId: null,
  };
  await setAuthoritativeGameState(started.room.id, fixture, version);

  const stopped = await expectOk(await rpc("cant_stop_stop_turn", {
    p_room_id: started.room.id,
    p_expected_version: version,
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken), "claiming cant_stop_stop_turn");

  assert.equal(stopped.game.claimedColumns["2"], activeUser.id);
  assert.equal(stopped.game.playerProgress[activeUser.id]["2"], 3);
  assert.equal(Object.hasOwn(stopped.game.playerProgress[otherUser.id], "2"), false);
  assert.equal(stopped.game.phase, "TURN_ROLL");
  assert.notEqual(stopped.game.activePlayerId, activeUser.id);
});

test("cant-stop: third claimed column ends the game with the active player as winner", async () => {
  const { host, guest, started } = await startTwoPlayerGame("stop-win");
  const activeUser = started.game.activePlayerId === host.id ? host : guest;
  const otherUser = activeUser.id === host.id ? guest : host;
  const version = 200;

  const fixture = {
    ...started.game,
    phase: "PUSH_OR_STOP",
    playerProgress: {
      [activeUser.id]: { 2: 2, 3: 5, 4: 7 },
      [otherUser.id]: { 2: 1 },
    },
    claimedColumns: {
      3: activeUser.id,
      4: activeUser.id,
    },
    runners: { 2: 3 },
    latestDice: [1, 1, 1, 1],
    legalPairings: [],
    winnerId: null,
  };
  await setAuthoritativeGameState(started.room.id, fixture, version);

  const stopped = await expectOk(await rpc("cant_stop_stop_turn", {
    p_room_id: started.room.id,
    p_expected_version: version,
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken), "winning cant_stop_stop_turn");

  assert.equal(stopped.game.phase, "GAME_OVER");
  assert.equal(stopped.game.winnerId, activeUser.id);
  assert.equal(stopped.game.claimedColumns["2"], activeUser.id);
  assert.equal(stopped.game.claimedColumns["3"], activeUser.id);
  assert.equal(stopped.game.claimedColumns["4"], activeUser.id);
  assert.equal(stopped.game.activePlayerId, activeUser.id);
  assert.deepEqual(stopped.game.runners, {});
});

test("cant-stop: non-active and stale push/stop actions are rejected", async () => {
  const { host, guest, activeUser, chosen } = await advanceToPushOrStop("push-stop-guards");
  const inactiveUser = activeUser.id === host.id ? guest : host;

  const inactiveContinue = await rpc("cant_stop_continue_turn", {
    p_room_id: chosen.room.id,
    p_expected_version: Number(chosen.version),
    p_client_action_id: randomUUID(),
  }, inactiveUser.accessToken);
  expectDenied(inactiveContinue, "inactive cant_stop_continue_turn", /TURN_REQUIRED/u);

  const staleStop = await rpc("cant_stop_stop_turn", {
    p_room_id: chosen.room.id,
    p_expected_version: Number(chosen.version) + 1,
    p_client_action_id: randomUUID(),
  }, activeUser.accessToken);
  expectDenied(staleStop, "stale cant_stop_stop_turn", /VERSION_CONFLICT/u);

  const snapshot = await expectOk(await rpc("cant_stop_get_lobby_snapshot", {
    p_room_id: chosen.room.id,
  }, activeUser.accessToken), "snapshot after rejected push/stop actions");
  assert.equal(Number(snapshot.version), Number(chosen.version));
  assert.equal(snapshot.game.phase, "PUSH_OR_STOP");
});


test("cant-stop: concurrent continue and stop intents allow only one authoritative commit", async () => {
  const { activeUser, chosen } = await advanceToPushOrStop("push-stop-concurrent");
  const expectedVersion = Number(chosen.version);

  const results = await Promise.all([
    rpc("cant_stop_continue_turn", {
      p_room_id: chosen.room.id,
      p_expected_version: expectedVersion,
      p_client_action_id: randomUUID(),
    }, activeUser.accessToken),
    rpc("cant_stop_stop_turn", {
      p_room_id: chosen.room.id,
      p_expected_version: expectedVersion,
      p_client_action_id: randomUUID(),
    }, activeUser.accessToken),
  ]);

  const successes = results.filter((result) => result.response.ok);
  const failures = results.filter((result) => !result.response.ok);

  assert.equal(successes.length, 1);
  assert.equal(failures.length, 1);
  assert.match(failures[0].text, /VERSION_CONFLICT/u);

  const snapshot = await expectOk(await rpc("cant_stop_get_lobby_snapshot", {
    p_room_id: chosen.room.id,
  }, activeUser.accessToken), "snapshot after concurrent push/stop");
  assert.equal(Number(snapshot.version), expectedVersion + 1);
  assert.ok(["TURN_ROLL"].includes(snapshot.game.phase));
});


test("cant-stop: GAME_OVER player can leave and immediately create a new room", async () => {
  const { host, guest, started } = await startTwoPlayerGame("postgame-leave");
  const version = 300;
  const fixture = {
    ...started.game,
    phase: "GAME_OVER",
    winnerId: host.id,
    runners: {},
    latestDice: null,
    legalPairings: [],
  };
  await setAuthoritativeGameState(started.room.id, fixture, version);

  await expectOk(await rpc("cant_stop_leave_room", {
    p_room_id: started.room.id,
    p_expected_version: version,
  }, guest.accessToken), "GAME_OVER cant_stop_leave_room");

  const active = await expectOk(await rpc(
    "cant_stop_get_my_active_room",
    {},
    guest.accessToken,
  ), "active room after GAME_OVER leave");
  assert.equal(active, null);

  const newRoom = await createRoom(guest);
  assert.notEqual(newRoom.room.id, started.room.id);
  assert.equal(newRoom.room.status, "waiting");
});

test("cant-stop: host can prepare the same room for a rematch and reuse ready/start flow", async () => {
  const { host, guest, started } = await startTwoPlayerGame("postgame-rematch");
  const version = 310;
  const fixture = {
    ...started.game,
    phase: "GAME_OVER",
    winnerId: host.id,
    runners: {},
    latestDice: null,
    legalPairings: [],
  };
  await setAuthoritativeGameState(started.room.id, fixture, version);
  const actionId = randomUUID();

  const waiting = await expectOk(await rpc("cant_stop_prepare_rematch", {
    p_room_id: started.room.id,
    p_expected_version: version,
    p_client_action_id: actionId,
  }, host.accessToken), "cant_stop_prepare_rematch");

  assert.equal(waiting.room.id, started.room.id);
  assert.equal(waiting.room.roomCode, started.room.roomCode);
  assert.equal(waiting.room.status, "waiting");
  assert.equal(waiting.game, null);
  assert.equal(Number(waiting.version), version + 1);

  const hostPlayer = waiting.players.find((player) => player.userId === host.id);
  const guestPlayer = waiting.players.find((player) => player.userId === guest.id);
  assert.equal(hostPlayer.isReady, true);
  assert.equal(guestPlayer.isReady, false);

  const replay = await expectOk(await rpc("cant_stop_prepare_rematch", {
    p_room_id: started.room.id,
    p_expected_version: version,
    p_client_action_id: actionId,
  }, host.accessToken), "replayed cant_stop_prepare_rematch");
  assert.equal(Number(replay.version), Number(waiting.version));

  const ready = await setReady(guest, waiting, true);
  const restarted = await expectOk(await rpc("cant_stop_start_game", {
    p_room_id: ready.room.id,
    p_expected_version: Number(ready.version),
    p_client_action_id: randomUUID(),
  }, host.accessToken), "rematch cant_stop_start_game");

  assert.equal(restarted.room.status, "playing");
  assert.equal(restarted.game.phase, "TURN_ROLL");
  assert.deepEqual(new Set(restarted.game.turnOrder), new Set([host.id, guest.id]));
});

test("cant-stop: active games cannot be left or rematched before GAME_OVER", async () => {
  const { host, guest, started } = await startTwoPlayerGame("postgame-guards");

  const leaveResult = await rpc("cant_stop_leave_room", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
  }, guest.accessToken);
  expectDenied(leaveResult, "leave active game", /ROOM_NOT_LEAVABLE/u);

  const rematchResult = await rpc("cant_stop_prepare_rematch", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: randomUUID(),
  }, host.accessToken);
  expectDenied(rematchResult, "rematch active game", /GAME_NOT_OVER/u);
});

test("cant-stop: only the host can prepare a rematch", async () => {
  const { guest, started } = await startTwoPlayerGame("postgame-host");
  const version = 320;
  const fixture = {
    ...started.game,
    phase: "GAME_OVER",
    winnerId: started.game.activePlayerId,
    runners: {},
    latestDice: null,
    legalPairings: [],
  };
  await setAuthoritativeGameState(started.room.id, fixture, version);

  const result = await rpc("cant_stop_prepare_rematch", {
    p_room_id: started.room.id,
    p_expected_version: version,
    p_client_action_id: randomUUID(),
  }, guest.accessToken);
  expectDenied(result, "non-host cant_stop_prepare_rematch", /HOST_REQUIRED/u);
});

test("cant-stop: host leaving GAME_OVER transfers rematch control to the next player", async () => {
  const { host, guest, started } = await startTwoPlayerGame("postgame-host-leave");
  const version = 330;
  const fixture = {
    ...started.game,
    phase: "GAME_OVER",
    winnerId: host.id,
    runners: {},
    latestDice: null,
    legalPairings: [],
  };
  await setAuthoritativeGameState(started.room.id, fixture, version);

  await expectOk(await rpc("cant_stop_leave_room", {
    p_room_id: started.room.id,
    p_expected_version: version,
  }, host.accessToken), "host GAME_OVER leave");

  const guestSnapshot = await expectOk(await rpc("cant_stop_get_my_active_room", {
  }, guest.accessToken), "guest active room after host leave");

  assert.equal(guestSnapshot.room.hostUserId, guest.id);
  assert.equal(guestSnapshot.game.phase, "GAME_OVER");

  const waiting = await expectOk(await rpc("cant_stop_prepare_rematch", {
    p_room_id: guestSnapshot.room.id,
    p_expected_version: Number(guestSnapshot.version),
    p_client_action_id: randomUUID(),
  }, guest.accessToken), "successor cant_stop_prepare_rematch");

  assert.equal(waiting.room.status, "waiting");
  assert.equal(waiting.room.hostUserId, guest.id);
  assert.equal(waiting.game, null);
});


test("cant-stop: disconnected guest reconnects into the authoritative rematch lobby and restarted game", async () => {
  const { host, guest, started } = await startTwoPlayerGame("lifecycle-reconnect");
  const finalVersion = 400;
  const finalState = {
    ...started.game,
    phase: "GAME_OVER",
    winnerId: host.id,
    runners: {},
    latestDice: null,
    legalPairings: [],
  };
  await setAuthoritativeGameState(started.room.id, finalState, finalVersion);

  const waiting = await expectOk(await rpc("cant_stop_prepare_rematch", {
    p_room_id: started.room.id,
    p_expected_version: finalVersion,
    p_client_action_id: randomUUID(),
  }, host.accessToken), "host prepares rematch while guest is disconnected");

  const guestReconnected = await expectOk(await rpc(
    "cant_stop_get_my_active_room",
    {},
    guest.accessToken,
  ), "guest reconnects to rematch lobby");

  assert.equal(guestReconnected.room.id, waiting.room.id);
  assert.equal(guestReconnected.room.roomCode, waiting.room.roomCode);
  assert.equal(guestReconnected.room.status, "waiting");
  assert.equal(Number(guestReconnected.version), Number(waiting.version));
  assert.equal(guestReconnected.game, null);
  assert.equal(
    guestReconnected.players.find((player) => player.userId === host.id)?.isReady,
    true,
  );
  assert.equal(
    guestReconnected.players.find((player) => player.userId === guest.id)?.isReady,
    false,
  );

  const ready = await setReady(guest, guestReconnected, true);
  const restarted = await expectOk(await rpc("cant_stop_start_game", {
    p_room_id: ready.room.id,
    p_expected_version: Number(ready.version),
    p_client_action_id: randomUUID(),
  }, host.accessToken), "host restarts game after guest reconnect");

  const guestAfterRestart = await expectOk(await rpc(
    "cant_stop_get_my_active_room",
    {},
    guest.accessToken,
  ), "guest reconnects after rematch start");

  assert.equal(guestAfterRestart.room.id, restarted.room.id);
  assert.equal(guestAfterRestart.room.status, "playing");
  assert.equal(Number(guestAfterRestart.version), Number(restarted.version));
  assert.equal(guestAfterRestart.game.phase, "TURN_ROLL");
  assert.equal(guestAfterRestart.game.winnerId, null);
  assert.deepEqual(
    new Set(guestAfterRestart.game.turnOrder),
    new Set([host.id, guest.id]),
  );
});

test("cant-stop: reconnect after peer leaves GAME_OVER restores host succession and active roster", async () => {
  const { host, guest, started } = await startTwoPlayerGame("lifecycle-host-succession");
  const finalVersion = 410;
  const finalState = {
    ...started.game,
    phase: "GAME_OVER",
    winnerId: guest.id,
    runners: {},
    latestDice: null,
    legalPairings: [],
  };
  await setAuthoritativeGameState(started.room.id, finalState, finalVersion);

  await expectOk(await rpc("cant_stop_leave_room", {
    p_room_id: started.room.id,
    p_expected_version: finalVersion,
  }, host.accessToken), "host leaves final room while guest is disconnected");

  const guestReconnected = await expectOk(await rpc(
    "cant_stop_get_my_active_room",
    {},
    guest.accessToken,
  ), "guest reconnects after host succession");

  assert.equal(guestReconnected.room.hostUserId, guest.id);
  assert.equal(guestReconnected.room.status, "playing");
  assert.equal(guestReconnected.game.phase, "GAME_OVER");
  assert.equal(guestReconnected.players.length, 1);
  assert.equal(guestReconnected.players[0].userId, guest.id);
  assert.equal(
    guestReconnected.players.some((player) => player.userId === host.id),
    false,
  );

  const waiting = await expectOk(await rpc("cant_stop_prepare_rematch", {
    p_room_id: guestReconnected.room.id,
    p_expected_version: Number(guestReconnected.version),
    p_client_action_id: randomUUID(),
  }, guest.accessToken), "successor prepares rematch after reconnect");

  assert.equal(waiting.room.status, "waiting");
  assert.equal(waiting.room.hostUserId, guest.id);
  assert.equal(waiting.players.length, 1);
  assert.equal(waiting.players[0].isReady, true);
  assert.equal(waiting.game, null);
});



test("cant-stop: host can manually end an active game and reuse the post-game lifecycle", async () => {
  const { host, guest, started } = await startTwoPlayerGame("manual-end");
  const actionId = randomUUID();

  const ended = await expectOk(await rpc("cant_stop_end_game", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: actionId,
  }, host.accessToken), "host cant_stop_end_game");

  assert.equal(ended.room.status, "playing");
  assert.equal(ended.game.phase, "GAME_OVER");
  assert.equal(ended.game.winnerId, null);
  assert.equal(ended.game.endReason, "MANUAL");
  assert.equal(ended.game.endedById, host.id);
  assert.deepEqual(ended.game.runners, {});
  assert.equal(ended.game.latestDice, null);
  assert.deepEqual(ended.game.legalPairings, []);
  assert.equal(Number(ended.version), Number(started.version) + 1);

  const replay = await expectOk(await rpc("cant_stop_end_game", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: actionId,
  }, host.accessToken), "replayed cant_stop_end_game");
  assert.equal(Number(replay.version), Number(ended.version));
  assert.equal(replay.game.endReason, "MANUAL");

  await expectOk(await rpc("cant_stop_leave_room", {
    p_room_id: ended.room.id,
    p_expected_version: Number(ended.version),
  }, guest.accessToken), "guest leaves manually ended game");

  const hostAfterGuestLeave = await expectOk(await rpc(
    "cant_stop_get_my_active_room",
    {},
    host.accessToken,
  ), "host snapshot after guest leaves manually ended game");

  const waiting = await expectOk(await rpc("cant_stop_prepare_rematch", {
    p_room_id: hostAfterGuestLeave.room.id,
    p_expected_version: Number(hostAfterGuestLeave.version),
    p_client_action_id: randomUUID(),
  }, host.accessToken), "host rematch after manual end");
  assert.equal(waiting.room.status, "waiting");
  assert.equal(waiting.game, null);
});

test("cant-stop: non-host cannot manually terminate the active game", async () => {
  const { host, guest, started } = await startTwoPlayerGame("manual-end-host-only");

  const denied = await rpc("cant_stop_end_game", {
    p_room_id: started.room.id,
    p_expected_version: Number(started.version),
    p_client_action_id: randomUUID(),
  }, guest.accessToken);
  expectDenied(denied, "guest cant_stop_end_game", /GAME_END_HOST_REQUIRED/u);

  const snapshot = await expectOk(await rpc("cant_stop_get_lobby_snapshot", {
    p_room_id: started.room.id,
  }, host.accessToken), "snapshot after denied manual end");
  assert.equal(Number(snapshot.version), Number(started.version));
  assert.notEqual(snapshot.game.phase, "GAME_OVER");
});


test("cant-stop: approved member can join a waiting room through a valid platform invite", async () => {
  const host = await createTestUser("invite-host");
  const guest = await createTestUser("invite-guest");
  const created = await createRoom(host);

  const invite = await expectOk(await rpc("site_invite_create", {
    p_target_type: "game_room",
    p_target_id: created.room.id,
    p_expires_in_minutes: 360,
    p_metadata: {
      game_id: "cant-stop",
      platform_version: 1,
      source: "cant-stop",
    },
  }, host.accessToken), "site_invite_create for Can’t Stop");

  const joined = await expectOk(await rpc("cant_stop_join_room_by_invite", {
    p_invite_token: invite.token,
    p_nickname: "Guest",
  }, guest.accessToken), "cant_stop_join_room_by_invite");

  assert.equal(joined.room.id, created.room.id);
  assert.equal(joined.room.roomCode, created.room.roomCode);
  assert.equal(joined.room.status, "waiting");
  assert.equal(
    joined.players.some((player) => player.userId === guest.id),
    true,
  );
});

test("cant-stop: invite join rejects tokens for another game", async () => {
  const host = await createTestUser("invite-mismatch-host");
  const guest = await createTestUser("invite-mismatch-guest");
  const created = await createRoom(host);

  const invite = await expectOk(await rpc("site_invite_create", {
    p_target_type: "game_room",
    p_target_id: created.room.id,
    p_expires_in_minutes: 360,
    p_metadata: {
      game_id: "other-game",
      platform_version: 1,
    },
  }, host.accessToken), "site_invite_create mismatch");

  const result = await rpc("cant_stop_join_room_by_invite", {
    p_invite_token: invite.token,
    p_nickname: "Guest",
  }, guest.accessToken);

  expectDenied(result, "mismatched cant_stop_join_room_by_invite", /GAME_INVITE_MISMATCH/u);
});

test("cant-stop: invite join rejects revoked tokens and does not add membership", async () => {
  const host = await createTestUser("invite-revoke-host");
  const guest = await createTestUser("invite-revoke-guest");
  const created = await createRoom(host);

  const invite = await expectOk(await rpc("site_invite_create", {
    p_target_type: "game_room",
    p_target_id: created.room.id,
    p_expires_in_minutes: 360,
    p_metadata: {
      game_id: "cant-stop",
      platform_version: 1,
    },
  }, host.accessToken), "site_invite_create revoke");

  await expectOk(await rpc("site_invite_revoke", {
    p_token: invite.token,
  }, host.accessToken), "site_invite_revoke");

  const result = await rpc("cant_stop_join_room_by_invite", {
    p_invite_token: invite.token,
    p_nickname: "Guest",
  }, guest.accessToken);

  expectDenied(result, "revoked cant_stop_join_room_by_invite", /INVITE_NOT_FOUND_OR_EXPIRED/u);

  const active = await expectOk(await rpc(
    "cant_stop_get_my_active_room",
    {},
    guest.accessToken,
  ), "active room after revoked invite");
  assert.equal(active, null);
});


test("cant-stop: room nicknames are enforced from the site profile instead of client input", async () => {
  const host = await createTestUser("profile-name-host");
  const guest = await createTestUser("profile-name-guest");

  const created = await createRoom(host, "Spoofed Host");
  assert.equal(
    created.players.find((player) => player.userId === host.id)?.displayName,
    host.displayName,
  );
  assert.equal(
    created.players.find((player) => player.userId === host.id)?.displayName === "Spoofed Host",
    false,
  );

  const joined = await joinRoom(guest, created, "Spoofed Guest");
  assert.equal(
    joined.players.find((player) => player.userId === guest.id)?.displayName,
    guest.displayName,
  );
  assert.equal(
    joined.players.find((player) => player.userId === guest.id)?.displayName === "Spoofed Guest",
    false,
  );
});
