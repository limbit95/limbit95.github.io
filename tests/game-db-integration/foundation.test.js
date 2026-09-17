import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

const supabaseUrl = process.env.E2E_LOCAL_SUPABASE_URL;
const anonKey = process.env.E2E_LOCAL_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.E2E_LOCAL_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
  throw new Error("Game DB integration tests require local Supabase URL, anon key, and service-role key.");
}

const password = "Cheongpa-Game-DB-E2E-2026!";
const createdUserIds = [];
let alice;
let bob;

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

function expectDenied(result, label) {
  assert.equal(
    result.response.ok,
    false,
    `${label} unexpectedly succeeded: ${result.text}`,
  );
  assert.ok(result.response.status >= 400, `${label} returned an unexpected status.`);
}

async function createApprovedUser(label) {
  const suffix = randomUUID().slice(0, 8);
  const email = `game-db-${label}-${suffix}@example.com`;
  const displayName = `게임DB ${label}`;
  const approvedAt = new Date().toISOString();

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
        request_message: "게임 DB 통합 테스트",
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
      status: "approved",
      approved_at: approvedAt,
      role: "member",
    },
  }), `approve ${label} profile`);

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
      request_message: "게임 DB 통합 테스트",
      status: "approved",
      privacy_consent_at: approvedAt,
      privacy_policy_version: "2026-08",
      rules_consent_at: approvedAt,
      community_rules_version: "2026-09",
    },
  }), `approve ${label} join request`);

  const session = await expectOk(await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email, password },
  }), `sign in ${label}`);

  assert.ok(session?.access_token, `${label} sign-in did not return an access token.`);
  return { id: created.id, email, accessToken: session.access_token };
}

async function rpc(name, body, token = anonKey) {
  return request(`/rest/v1/rpc/${name}`, {
    method: "POST",
    token,
    body,
  });
}

before(async () => {
  alice = await createApprovedUser("alice");
  bob = await createApprovedUser("bob");
});

after(async () => {
  for (const userId of createdUserIds) {
    await request(`/auth/v1/admin/users/${userId}`, {
      method: "DELETE",
      key: serviceRoleKey,
      token: serviceRoleKey,
    }).catch(() => null);
  }
});

test("anonymous callers cannot create Liar or Marble rooms", async () => {
  const liarResult = await rpc("liar_create_room", {
    p_player_key: randomUUID(),
    p_nickname: "익명",
    p_selected_categories: ["음식"],
    p_difficulty: "all",
    p_liar_count: 1,
    p_guess_limit: 1,
  });
  expectDenied(liarResult, "anonymous liar_create_room");

  const marbleResult = await rpc("marble_create_room", {
    p_nickname: "익명",
    p_max_players: 4,
  });
  expectDenied(marbleResult, "anonymous marble_create_room");
});

test("approved Liar member can create a room and player-key possession protects its snapshot", async () => {
  const playerKey = randomUUID();
  const created = await expectOk(await rpc("liar_create_room", {
    p_player_key: playerKey,
    p_nickname: "Alice",
    p_selected_categories: ["음식"],
    p_difficulty: "all",
    p_liar_count: 1,
    p_guess_limit: 1,
  }, alice.accessToken), "approved liar_create_room");

  const roomRow = Array.isArray(created) ? created[0] : created;
  assert.ok(roomRow?.room_id, "Liar room creation did not return room_id.");

  const snapshot = await rpc("liar_get_room_snapshot", {
    p_player_key: playerKey,
  }, alice.accessToken);
  await expectOk(snapshot, "liar_get_room_snapshot with owned player key");

  const wrongKeySnapshot = await rpc("liar_get_room_snapshot", {
    p_player_key: randomUUID(),
  }, alice.accessToken);
  expectDenied(wrongKeySnapshot, "liar_get_room_snapshot with unowned player key");
});

test("Marble lobby enforces membership and optimistic room versions", async () => {
  const created = await expectOk(await rpc("marble_create_room", {
    p_nickname: "Alice",
    p_max_players: 4,
  }, alice.accessToken), "approved marble_create_room");

  assert.ok(created?.room?.id, "Marble room creation did not return room.id.");
  assert.ok(Number.isInteger(Number(created?.room?.version)), "Marble room snapshot is missing a version.");

  const outsiderSnapshot = await rpc("marble_get_lobby_snapshot", {
    p_room_id: created.room.id,
  }, bob.accessToken);
  expectDenied(outsiderSnapshot, "non-member marble_get_lobby_snapshot");

  const staleReady = await rpc("marble_set_ready", {
    p_room_id: created.room.id,
    p_ready: true,
    p_expected_version: Number(created.room.version) + 100,
  }, alice.accessToken);
  expectDenied(staleReady, "stale marble_set_ready");
  assert.match(staleReady.text, /VERSION_CONFLICT/u);
});

test.todo("pending/rejected/suspended users are rejected by Liar and Marble entry RPCs (Phase 2-C)");
