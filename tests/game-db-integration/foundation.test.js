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
let pendingUser;
let rejectedUser;
let suspendedUser;
let revokedUser;

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

function expectDenied(result, label, expectedPattern) {
  assert.equal(
    result.response.ok,
    false,
    `${label} unexpectedly succeeded: ${result.text}`,
  );
  assert.ok(result.response.status >= 400, `${label} returned an unexpected status.`);
  if (expectedPattern) assert.match(result.text, expectedPattern, `${label} returned the wrong error.`);
}

async function createTestUser(label, status = "approved") {
  const suffix = randomUUID().slice(0, 8);
  const email = `game-db-${label}-${suffix}@example.com`;
  const displayName = `게임DB ${label}`;
  const approvedAt = new Date().toISOString();
  const approvedLike = status === "approved" || status === "suspended";
  const joinStatus = status === "pending" ? "pending" : status === "rejected" ? "rejected" : "approved";

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
      status,
      approved_at: approvedLike ? approvedAt : null,
      role: "member",
    },
  }), `set ${label} profile status`);

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
      status: joinStatus,
      privacy_consent_at: approvedAt,
      privacy_policy_version: "2026-08",
      rules_consent_at: approvedAt,
      community_rules_version: "2026-09",
    },
  }), `set ${label} join request status`);

  const session = await expectOk(await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email, password },
  }), `sign in ${label}`);

  assert.ok(session?.access_token, `${label} sign-in did not return an access token.`);
  return { id: created.id, email, accessToken: session.access_token };
}

async function setProfileStatus(userId, status) {
  const approvedAt = status === "approved" ? new Date().toISOString() : undefined;
  const body = { status };
  if (approvedAt) body.approved_at = approvedAt;
  await expectOk(await request(`/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    key: serviceRoleKey,
    token: serviceRoleKey,
    headers: { Prefer: "return=minimal" },
    body,
  }), `set profile ${userId} to ${status}`);
}

async function rpc(name, body, token = anonKey) {
  return request(`/rest/v1/rpc/${name}`, {
    method: "POST",
    token,
    body,
  });
}

before(async () => {
  alice = await createTestUser("alice");
  bob = await createTestUser("bob");
  pendingUser = await createTestUser("pending", "pending");
  rejectedUser = await createTestUser("rejected", "rejected");
  suspendedUser = await createTestUser("suspended", "suspended");
  revokedUser = await createTestUser("revoked");
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

test("Liar entry and resume RPCs require an approved community member", async () => {
  const ownerKey = randomUUID();
  const created = await expectOk(await rpc("liar_create_room", {
    p_player_key: ownerKey,
    p_nickname: "Alice",
    p_selected_categories: ["음식"],
    p_difficulty: "all",
    p_liar_count: 1,
    p_guess_limit: 1,
  }, alice.accessToken), "approved liar_create_room");

  const roomRow = Array.isArray(created) ? created[0] : created;
  assert.ok(roomRow?.room_id, "Liar room creation did not return room_id.");
  assert.ok(roomRow?.room_code, "Liar room creation did not return room_code.");

  for (const [label, user] of [
    ["pending", pendingUser],
    ["rejected", rejectedUser],
    ["suspended", suspendedUser],
  ]) {
    const createResult = await rpc("liar_create_room", {
      p_player_key: randomUUID(),
      p_nickname: label,
      p_selected_categories: ["음식"],
      p_difficulty: "all",
      p_liar_count: 1,
      p_guess_limit: 1,
    }, user.accessToken);
    expectDenied(createResult, `${label} liar_create_room`, /AUTH_REQUIRED/u);

    const joinResult = await rpc("liar_join_room", {
      p_room_code: roomRow.room_code,
      p_player_key: randomUUID(),
      p_nickname: label,
    }, user.accessToken);
    expectDenied(joinResult, `${label} liar_join_room`, /AUTH_REQUIRED/u);
  }

  const revokedKey = randomUUID();
  await expectOk(await rpc("liar_join_room", {
    p_room_code: roomRow.room_code,
    p_player_key: revokedKey,
    p_nickname: "Revoked",
  }, revokedUser.accessToken), "approved member joins before suspension");

  await setProfileStatus(revokedUser.id, "suspended");

  const activeRooms = await expectOk(await rpc("liar_get_my_active_rooms", {}, revokedUser.accessToken), "suspended liar_get_my_active_rooms");
  assert.deepEqual(activeRooms, [], "suspended member must not discover an active Liar room");

  const resumeResult = await rpc("liar_resume_room", {
    p_room_id: roomRow.room_id,
    p_player_key: revokedKey,
  }, revokedUser.accessToken);
  expectDenied(resumeResult, "suspended liar_resume_room", /AUTH_REQUIRED/u);

  const snapshot = await rpc("liar_get_room_snapshot", {
    p_player_key: ownerKey,
  }, alice.accessToken);
  await expectOk(snapshot, "approved liar_get_room_snapshot with owned player key");

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
