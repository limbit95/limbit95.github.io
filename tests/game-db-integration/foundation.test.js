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
let tradeAlice;
let tradeBob;
let liquidationAlice;
let liquidationBob;

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
  tradeAlice = await createTestUser("trade-alice");
  tradeBob = await createTestUser("trade-bob");
  liquidationAlice = await createTestUser("liquidation-alice");
  liquidationBob = await createTestUser("liquidation-bob");
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


test("Marble Phase 7B trade RPCs enforce authority, action lock, settlement, and replay", async () => {
  const anonymousOffer = await rpc("marble_trade_offer", {
    p_room_id: randomUUID(),
    p_expected_version: 1,
    p_client_action_id: randomUUID(),
    p_offer_id: randomUUID(),
    p_recipient_player_id: randomUUID(),
    p_terms: { offered: { gold: 1 }, requested: {} },
  });
  expectDenied(anonymousOffer, "anonymous marble_trade_offer");

  const created = await expectOk(await rpc("marble_create_room", {
    p_nickname: "Trade Alice",
    p_max_players: 2,
  }, tradeAlice.accessToken), "trade marble_create_room");

  const joined = await expectOk(await rpc("marble_join_room", {
    p_room_code: created.room.roomCode,
    p_nickname: "Trade Bob",
  }, tradeBob.accessToken), "trade marble_join_room");

  const ready = await expectOk(await rpc("marble_set_ready", {
    p_room_id: created.room.id,
    p_ready: true,
    p_expected_version: Number(joined.room.version),
  }, tradeBob.accessToken), "trade marble_set_ready");

  const started = await expectOk(await rpc("marble_start_game", {
    p_room_id: created.room.id,
    p_expected_version: Number(ready.room.version),
  }, tradeAlice.accessToken), "trade marble_start_game");

  const alicePlayer = started.players.find((player) => player.userId === tradeAlice.id);
  const bobPlayer = started.players.find((player) => player.userId === tradeBob.id);
  assert.ok(alicePlayer?.id, "trade Alice player id missing");
  assert.ok(bobPlayer?.id, "trade Bob player id missing");
  assert.equal(started.game.phase, "WAITING_ROLL");

  await expectOk(await request(
    `/rest/v1/marble_game_properties?game_id=eq.${started.game.id}&node_id=eq.singapore`,
    {
      method: "PATCH",
      key: serviceRoleKey,
      token: serviceRoleKey,
      headers: { Prefer: "return=minimal" },
      body: { owner_seat: alicePlayer.seat, building_level: 0 },
    },
  ), "fixture Singapore ownership");

  await expectOk(await request(
    `/rest/v1/marble_game_properties?game_id=eq.${started.game.id}&node_id=eq.tokyo`,
    {
      method: "PATCH",
      key: serviceRoleKey,
      token: serviceRoleKey,
      headers: { Prefer: "return=minimal" },
      body: { owner_seat: bobPlayer.seat, building_level: 0 },
    },
  ), "fixture Tokyo ownership");

  const offerActionId = randomUUID();
  const offerId = randomUUID();
  const offered = await expectOk(await rpc("marble_trade_offer", {
    p_room_id: created.room.id,
    p_expected_version: Number(started.game.version),
    p_client_action_id: offerActionId,
    p_offer_id: offerId,
    p_recipient_player_id: bobPlayer.id,
    p_terms: {
      offered: { propertyIds: ["singapore"], gold: 100 },
      requested: { propertyIds: ["tokyo"], gold: 50 },
    },
  }, tradeAlice.accessToken), "trade marble_trade_offer");

  assert.equal(offered.game.pendingTrade?.offerId, offerId);
  assert.equal(offered.game.pendingTrade?.proposerPlayerId, alicePlayer.id);
  assert.equal(offered.game.pendingTrade?.recipientPlayerId, bobPlayer.id);
  assert.equal(offered.game.phase, "WAITING_ROLL");

  const blockedRoll = await rpc("marble_roll_dice", {
    p_room_id: created.room.id,
    p_expected_version: Number(offered.game.version),
    p_client_action_id: randomUUID(),
  }, tradeAlice.accessToken);
  expectDenied(blockedRoll, "roll while trade is open", /TRADE_PENDING/u);

  const acceptActionId = randomUUID();
  const accepted = await expectOk(await rpc("marble_trade_accept", {
    p_room_id: created.room.id,
    p_expected_version: Number(offered.game.version),
    p_client_action_id: acceptActionId,
    p_offer_id: offerId,
  }, tradeBob.accessToken), "trade marble_trade_accept");

  assert.equal(accepted.game.pendingTrade, null);
  assert.equal(accepted.game.phase, "WAITING_ROLL");
  assert.equal(accepted.properties.singapore.ownerId, bobPlayer.id);
  assert.equal(accepted.properties.tokyo.ownerId, alicePlayer.id);
  assert.equal(
    accepted.players.find((player) => player.id === alicePlayer.id)?.money,
    1450,
  );
  assert.equal(
    accepted.players.find((player) => player.id === bobPlayer.id)?.money,
    1550,
  );
  assert.deepEqual(accepted.game.lastEvents.map((event) => event.type), [
    "TRADE_ACCEPTED",
    "TRADE_SETTLED",
  ]);

  const replayedAccept = await expectOk(await rpc("marble_trade_accept", {
    p_room_id: created.room.id,
    p_expected_version: Number(offered.game.version),
    p_client_action_id: acceptActionId,
    p_offer_id: offerId,
  }, tradeBob.accessToken), "trade accept replay");

  assert.equal(replayedAccept.game.version, accepted.game.version);
  assert.equal(replayedAccept.properties.singapore.ownerId, bobPlayer.id);
  assert.equal(
    replayedAccept.players.find((player) => player.id === alicePlayer.id)?.money,
    1450,
  );

  const rejectOfferId = randomUUID();
  const secondOffer = await expectOk(await rpc("marble_trade_offer", {
    p_room_id: created.room.id,
    p_expected_version: Number(accepted.game.version),
    p_client_action_id: randomUUID(),
    p_offer_id: rejectOfferId,
    p_recipient_player_id: bobPlayer.id,
    p_terms: {
      offered: { propertyIds: ["tokyo"] },
      requested: { gold: 75 },
    },
  }, tradeAlice.accessToken), "second trade offer");

  const rejected = await expectOk(await rpc("marble_trade_reject", {
    p_room_id: created.room.id,
    p_expected_version: Number(secondOffer.game.version),
    p_client_action_id: randomUUID(),
    p_offer_id: rejectOfferId,
  }, tradeBob.accessToken), "trade marble_trade_reject");

  assert.equal(rejected.game.pendingTrade, null);
  assert.equal(rejected.game.phase, "WAITING_ROLL");
  assert.deepEqual(rejected.game.lastEvents.map((event) => event.type), ["TRADE_REJECTED"]);
  assert.equal(rejected.properties.tokyo.ownerId, alicePlayer.id);

  const cancelOfferId = randomUUID();
  const cancellable = await expectOk(await rpc("marble_trade_offer", {
    p_room_id: created.room.id,
    p_expected_version: Number(rejected.game.version),
    p_client_action_id: randomUUID(),
    p_offer_id: cancelOfferId,
    p_recipient_player_id: bobPlayer.id,
    p_terms: {
      offered: { gold: 25 },
      requested: {},
    },
  }, tradeAlice.accessToken), "cancellable trade offer");

  const recipientCancel = await rpc("marble_trade_cancel", {
    p_room_id: created.room.id,
    p_expected_version: Number(cancellable.game.version),
    p_client_action_id: randomUUID(),
    p_offer_id: cancelOfferId,
  }, tradeBob.accessToken);
  expectDenied(recipientCancel, "recipient trade cancel", /TRADE_PROPOSER_REQUIRED/u);

  const cancelled = await expectOk(await rpc("marble_trade_cancel", {
    p_room_id: created.room.id,
    p_expected_version: Number(cancellable.game.version),
    p_client_action_id: randomUUID(),
    p_offer_id: cancelOfferId,
  }, tradeAlice.accessToken), "trade marble_trade_cancel");

  assert.equal(cancelled.game.pendingTrade, null);
  assert.equal(cancelled.game.phase, "WAITING_ROLL");
  assert.deepEqual(cancelled.game.lastEvents.map((event) => event.type), ["TRADE_CANCELLED"]);
  assert.equal(
    cancelled.players.find((player) => player.id === alicePlayer.id)?.money,
    1450,
  );
  assert.equal(
    cancelled.players.find((player) => player.id === bobPlayer.id)?.money,
    1550,
  );
});


test("Marble Phase 7C liquidation RPCs enforce debtor authority, action lock, settlement, and replay", async () => {
  const anonymousSelect = await rpc("marble_liquidation_select", {
    p_room_id: randomUUID(),
    p_expected_version: 1,
    p_client_action_id: randomUUID(),
    p_asset_ids: ["singapore"],
  });
  expectDenied(anonymousSelect, "anonymous marble_liquidation_select");

  const created = await expectOk(await rpc("marble_create_room", {
    p_nickname: "Liquidation Alice",
    p_max_players: 2,
  }, liquidationAlice.accessToken), "liquidation marble_create_room");

  const joined = await expectOk(await rpc("marble_join_room", {
    p_room_code: created.room.roomCode,
    p_nickname: "Liquidation Bob",
  }, liquidationBob.accessToken), "liquidation marble_join_room");

  const ready = await expectOk(await rpc("marble_set_ready", {
    p_room_id: created.room.id,
    p_ready: true,
    p_expected_version: Number(joined.room.version),
  }, liquidationBob.accessToken), "liquidation marble_set_ready");

  const started = await expectOk(await rpc("marble_start_game", {
    p_room_id: created.room.id,
    p_expected_version: Number(ready.room.version),
  }, liquidationAlice.accessToken), "liquidation marble_start_game");

  const alicePlayer = started.players.find((player) => player.userId === liquidationAlice.id);
  const bobPlayer = started.players.find((player) => player.userId === liquidationBob.id);
  assert.ok(alicePlayer?.id, "liquidation Alice player id missing");
  assert.ok(bobPlayer?.id, "liquidation Bob player id missing");

  await expectOk(await request(
    `/rest/v1/marble_game_properties?game_id=eq.${started.game.id}&node_id=eq.singapore`,
    {
      method: "PATCH",
      key: serviceRoleKey,
      token: serviceRoleKey,
      headers: { Prefer: "return=minimal" },
      body: { owner_seat: alicePlayer.seat, building_level: 0 },
    },
  ), "fixture liquidation Singapore ownership");

  await expectOk(await request(
    `/rest/v1/marble_game_players?game_id=eq.${started.game.id}&room_player_id=eq.${alicePlayer.id}`,
    {
      method: "PATCH",
      key: serviceRoleKey,
      token: serviceRoleKey,
      headers: { Prefer: "return=minimal" },
      body: { money: 50 },
    },
  ), "fixture liquidation debtor cash");

  const debtChoice = {
    type: "DEBT_RECOVERY",
    status: "OPEN",
    playerId: alicePlayer.id,
    creditorId: bobPlayer.id,
    amountDue: 150,
    reason: "TOLL",
    cash: 50,
    shortfall: 100,
    catalog: [
      { assetId: "singapore", refund: 130, buildingLevel: 0 },
    ],
    selectedAssetIds: [],
    refundTotal: 0,
    remainingShortfall: 100,
    ready: false,
  };

  await expectOk(await request(
    `/rest/v1/marble_games?id=eq.${started.game.id}`,
    {
      method: "PATCH",
      key: serviceRoleKey,
      token: serviceRoleKey,
      headers: { Prefer: "return=minimal" },
      body: {
        phase: "WAITING_CHOICE",
        current_seat: alicePlayer.seat,
        pending_choice: debtChoice,
      },
    },
  ), "fixture liquidation debt choice");

  const debtSnapshot = await expectOk(await rpc("marble_get_game_snapshot", {
    p_room_id: created.room.id,
  }, liquidationAlice.accessToken), "liquidation debt snapshot");

  assert.equal(debtSnapshot.game.pendingChoice?.type, "DEBT_RECOVERY");
  assert.equal(debtSnapshot.game.pendingChoice?.ready, false);

  const recipientSelect = await rpc("marble_liquidation_select", {
    p_room_id: created.room.id,
    p_expected_version: Number(debtSnapshot.game.version),
    p_client_action_id: randomUUID(),
    p_asset_ids: ["singapore"],
  }, liquidationBob.accessToken);
  expectDenied(recipientSelect, "non-debtor liquidation select", /DEBT_RECOVERY_DEBTOR_REQUIRED/u);

  const selected = await expectOk(await rpc("marble_liquidation_select", {
    p_room_id: created.room.id,
    p_expected_version: Number(debtSnapshot.game.version),
    p_client_action_id: randomUUID(),
    p_asset_ids: ["singapore"],
  }, liquidationAlice.accessToken), "marble_liquidation_select");

  assert.equal(selected.game.pendingChoice?.status, "READY");
  assert.equal(selected.game.pendingChoice?.ready, true);
  assert.equal(selected.game.pendingChoice?.refundTotal, 130);
  assert.equal(selected.game.pendingChoice?.remainingShortfall, 0);

  const blockedEndTurn = await rpc("marble_end_turn", {
    p_room_id: created.room.id,
    p_expected_version: Number(selected.game.version),
    p_client_action_id: randomUUID(),
  }, liquidationAlice.accessToken);
  expectDenied(blockedEndTurn, "end turn during debt recovery", /DEBT_RECOVERY_PENDING/u);

  const confirmActionId = randomUUID();
  const confirmed = await expectOk(await rpc("marble_liquidation_confirm", {
    p_room_id: created.room.id,
    p_expected_version: Number(selected.game.version),
    p_client_action_id: confirmActionId,
  }, liquidationAlice.accessToken), "marble_liquidation_confirm");

  assert.equal(confirmed.game.pendingChoice, null);
  assert.equal(confirmed.game.phase, "TURN_END");
  assert.equal(confirmed.properties.singapore.ownerId, null);
  assert.equal(confirmed.properties.singapore.buildingLevel, 0);
  assert.equal(
    confirmed.players.find((player) => player.id === alicePlayer.id)?.money,
    30,
  );
  assert.equal(
    confirmed.players.find((player) => player.id === bobPlayer.id)?.money,
    1650,
  );
  assert.deepEqual(confirmed.game.lastEvents.map((event) => event.type), [
    "PROPERTY_LIQUIDATED",
    "MONEY_PAID",
    "DEBT_RECOVERED",
  ]);

  const replayed = await expectOk(await rpc("marble_liquidation_confirm", {
    p_room_id: created.room.id,
    p_expected_version: Number(selected.game.version),
    p_client_action_id: confirmActionId,
  }, liquidationAlice.accessToken), "liquidation confirm replay");

  assert.equal(replayed.game.version, confirmed.game.version);
  assert.equal(
    replayed.players.find((player) => player.id === alicePlayer.id)?.money,
    30,
  );
});
