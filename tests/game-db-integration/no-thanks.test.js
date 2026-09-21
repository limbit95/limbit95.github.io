import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import { registerPlatformGameDbContract } from "./platformContract.js";

const supabaseUrl = process.env.E2E_LOCAL_SUPABASE_URL;
const anonKey = process.env.E2E_LOCAL_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.E2E_LOCAL_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
  throw new Error("No Thanks! DB integration requires local Supabase credentials.");
}

const password = "Cheongpa-No-Thanks-E2E-2026!";
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
  const email = `no-thanks-${label}-${suffix}@example.com`;
  const displayName = `NT ${suffix} ${label}`.slice(0, 50);
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
        request_message: "No Thanks! DB integration",
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
      request_message: "No Thanks! DB integration",
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

async function createRoom(user, maxPlayers = 7) {
  return expectOk(await rpc("no_thanks_create_room", {
    p_max_players: maxPlayers,
  }, user.accessToken), "no_thanks_create_room");
}

async function joinRoom(user, created) {
  return expectOk(await rpc("no_thanks_join_room", {
    p_room_code: created.room.roomCode,
  }, user.accessToken), "no_thanks_join_room");
}

async function setReady(user, snapshot, ready, actionId = randomUUID()) {
  return expectOk(await rpc("no_thanks_set_ready", {
    p_room_id: snapshot.room.id,
    p_ready: ready,
    p_expected_version: Number(snapshot.version),
    p_client_action_id: actionId,
  }, user.accessToken), "no_thanks_set_ready");
}

async function startThreePlayerGame(label) {
  const host = await createTestUser(`${label}-host`);
  const guestA = await createTestUser(`${label}-guest-a`);
  const guestB = await createTestUser(`${label}-guest-b`);
  const created = await createRoom(host);
  const joinedA = await joinRoom(guestA, created);
  const joinedB = await joinRoom(guestB, joinedA);
  const readyA = await setReady(guestA, joinedB, true);
  const readyB = await setReady(guestB, readyA, true);
  const started = await expectOk(await rpc("no_thanks_start_game", {
    p_room_id: readyB.room.id,
    p_expected_version: Number(readyB.version),
    p_client_action_id: randomUUID(),
  }, host.accessToken), `${label} no_thanks_start_game`);
  return { host, guestA, guestB, started };
}

registerPlatformGameDbContract({
  gameId: "no-thanks",

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

      expectDenied(await rpc("no_thanks_create_room", {
        p_max_players: 7,
      }), "anonymous no_thanks_create_room");

      expectDenied(await rpc("no_thanks_join_room", {
        p_room_code: created.room.roomCode,
      }), "anonymous no_thanks_join_room");
    },

    unapproved_entry_denied: async () => {
      const host = await createTestUser("pending-host");
      const pending = await createTestUser("pending-user", "pending");
      const created = await createRoom(host);

      expectDenied(await rpc("no_thanks_create_room", {
        p_max_players: 7,
      }, pending.accessToken), "pending no_thanks_create_room", /AUTH_REQUIRED/u);

      expectDenied(await rpc("no_thanks_join_room", {
        p_room_code: created.room.roomCode,
      }, pending.accessToken), "pending no_thanks_join_room", /AUTH_REQUIRED/u);
    },

    approved_entry_allowed: async () => {
      const host = await createTestUser("approved-host");
      const guest = await createTestUser("approved-guest");
      const created = await createRoom(host, 5);
      const joined = await joinRoom(guest, created);

      assert.equal(created.room.status, "waiting");
      assert.equal(created.room.maxPlayers, 5);
      assert.equal(created.players.length, 1);
      assert.equal(created.players[0].displayName, host.displayName);
      assert.equal(joined.players.length, 2);
      assert.equal(
        joined.players.find((player) => player.userId === guest.id)?.displayName,
        guest.displayName,
      );
      assert.equal(Number(joined.version), Number(created.version) + 1);
    },

    non_member_snapshot_denied: async () => {
      const host = await createTestUser("snapshot-host");
      const outsider = await createTestUser("snapshot-outsider");
      const created = await createRoom(host);

      const result = await rpc("no_thanks_get_lobby_snapshot", {
        p_room_id: created.room.id,
      }, outsider.accessToken);
      expectDenied(result, "outsider no_thanks_get_lobby_snapshot", /ROOM_NOT_FOUND/u);
    },

    start_authorization_enforced: async () => {
      const host = await createTestUser("start-host");
      const guestA = await createTestUser("start-guest-a");
      const guestB = await createTestUser("start-guest-b");
      const created = await createRoom(host);
      const joinedA = await joinRoom(guestA, created);
      const joinedB = await joinRoom(guestB, joinedA);
      const readyA = await setReady(guestA, joinedB, true);
      const readyB = await setReady(guestB, readyA, true);

      const result = await rpc("no_thanks_start_game", {
        p_room_id: readyB.room.id,
        p_expected_version: Number(readyB.version),
        p_client_action_id: randomUUID(),
      }, guestA.accessToken);
      expectDenied(result, "non-host no_thanks_start_game", /HOST_REQUIRED/u);
    },

    stale_version_rejected: async () => {
      const host = await createTestUser("stale-host");
      const guest = await createTestUser("stale-guest");
      const created = await createRoom(host);
      const joined = await joinRoom(guest, created);

      const result = await rpc("no_thanks_set_ready", {
        p_room_id: joined.room.id,
        p_ready: true,
        p_expected_version: Number(joined.version) + 100,
        p_client_action_id: randomUUID(),
      }, guest.accessToken);
      expectDenied(result, "stale no_thanks_set_ready", /VERSION_CONFLICT/u);
    },

    duplicate_action_safe: async () => {
      const host = await createTestUser("duplicate-host");
      const guest = await createTestUser("duplicate-guest");
      const created = await createRoom(host);
      const joined = await joinRoom(guest, created);
      const clientActionId = randomUUID();

      const first = await setReady(guest, joined, true, clientActionId);
      const replay = await expectOk(await rpc("no_thanks_set_ready", {
        p_room_id: joined.room.id,
        p_ready: true,
        p_expected_version: Number(joined.version),
        p_client_action_id: clientActionId,
      }, guest.accessToken), "duplicate no_thanks_set_ready");

      assert.equal(Number(first.version), Number(joined.version) + 1);
      assert.equal(Number(replay.version), Number(first.version));

      const snapshot = await expectOk(await rpc("no_thanks_get_lobby_snapshot", {
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
        rpc("no_thanks_set_ready", {
          p_room_id: joined.room.id,
          p_ready: true,
          p_expected_version: expectedVersion,
          p_client_action_id: randomUUID(),
        }, guest.accessToken),
        rpc("no_thanks_set_ready", {
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

      const snapshot = await expectOk(await rpc("no_thanks_get_lobby_snapshot", {
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

      const reloaded = await expectOk(await rpc(
        "no_thanks_get_my_active_room",
        {},
        guest.accessToken,
      ), "no_thanks_get_my_active_room");

      assert.equal(reloaded.room.id, ready.room.id);
      assert.equal(Number(reloaded.version), Number(ready.version));
      assert.equal(
        reloaded.players.find((player) => player.userId === guest.id)?.isReady,
        true,
      );
    },

    private_state_not_exposed: async () => {
      const { host, guestA, guestB, started } = await startThreePlayerGame("privacy");

      assert.equal(started.room.status, "playing");
      assert.equal(started.game.phase, "PLAYING");
      assert.equal(started.game.centerCounters, 0);
      assert.equal(started.game.deckRemaining, 23);
      assert.equal(started.game.excludedCount, 9);
      assert.equal(Number.isInteger(started.game.currentCard), true);
      assert.ok(started.game.currentCard >= 3 && started.game.currentCard <= 35);
      assert.equal(started.game.turnOrder.length, 3);
      assert.deepEqual(
        new Set(started.game.turnOrder),
        new Set([host.id, guestA.id, guestB.id]),
      );
      assert.equal(started.game.activePlayerId, started.game.turnOrder[0]);
      assert.equal(started.viewer.playerId, host.id);
      assert.equal(started.viewer.counters, 11);
      assert.equal(Object.hasOwn(started.game, "drawDeck"), false);
      assert.equal(Object.hasOwn(started.game, "excludedCards"), false);
      assert.equal(Object.hasOwn(started.game, "playerCounters"), false);
      assert.equal(Object.hasOwn(started, "privateState"), false);
      assert.equal(
        started.game.players.every(
          (player) => Array.isArray(player.cards) && player.cards.length === 0,
        ),
        true,
      );

      const guestSnapshot = await expectOk(await rpc("no_thanks_get_lobby_snapshot", {
        p_room_id: started.room.id,
      }, guestA.accessToken), "guest No Thanks! snapshot");
      assert.equal(guestSnapshot.viewer.playerId, guestA.id);
      assert.equal(guestSnapshot.viewer.counters, 11);
      assert.equal(Object.hasOwn(guestSnapshot.game, "playerCounters"), false);

      expectDenied(await request(
        `/rest/v1/no_thanks_room_private_players?room_id=eq.${started.room.id}`,
        { token: guestA.accessToken },
      ), "direct private counter table read");
      expectDenied(await request(
        `/rest/v1/no_thanks_room_secrets?room_id=eq.${started.room.id}`,
        { token: guestA.accessToken },
      ), "direct secret deck table read");

      const privateRows = await expectOk(await request(
        `/rest/v1/no_thanks_room_private_players?room_id=eq.${started.room.id}&select=user_id,counters`,
        { key: serviceRoleKey, token: serviceRoleKey },
      ), "service role private counter inspection");
      assert.equal(privateRows.length, 3);
      assert.equal(privateRows.every((row) => Number(row.counters) === 11), true);

      const secretRows = await expectOk(await request(
        `/rest/v1/no_thanks_room_secrets?room_id=eq.${started.room.id}&select=draw_deck,excluded_cards`,
        { key: serviceRoleKey, token: serviceRoleKey },
      ), "service role secret deck inspection");
      assert.equal(secretRows.length, 1);
      assert.equal(secretRows[0].draw_deck.length, 23);
      assert.equal(secretRows[0].excluded_cards.length, 9);

      const allCards = [
        started.game.currentCard,
        ...secretRows[0].draw_deck,
        ...secretRows[0].excluded_cards,
      ];
      assert.equal(allCards.length, 33);
      assert.equal(new Set(allCards).size, 33);
      assert.equal(allCards.every((card) => card >= 3 && card <= 35), true);
    },
  },
}, { before, after, test });
