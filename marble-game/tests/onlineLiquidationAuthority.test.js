import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync(
  new URL("../../supabase/marble/20260918173000_marble_phase7c_liquidation_authority.sql", import.meta.url),
  "utf8",
);
const apiSource = readFileSync(new URL("../js/onlineGameApi.js", import.meta.url), "utf8");

test("Phase 7C migration extends debt recovery without redefining marble_roll_dice", () => {
  assert.match(migration, /create or replace function private\.marble_charge_player/);
  assert.match(migration, /marble_build_debt_recovery_choice/);
  assert.match(migration, /DEBT_PAYMENT_REQUIRED/);
  assert.match(migration, /DEBT_RECOVERY_PENDING/);
  assert.doesNotMatch(migration, /create or replace function public\.marble_roll_dice/);
});

test("Phase 7C authority keeps Classic v1 liquidation value at 50 percent", () => {
  assert.match(migration, /n\.price \* 5000/);
  assert.match(migration, /n\.build_cost \* p\.building_level \* 5000/);
  assert.match(migration, /DEBT_RECOVERY_REFUND_CHANGED/);
});

test("liquidation RPCs enforce debtor authority, optimistic versioning, and replay identity", () => {
  assert.match(migration, /marble_liquidation_select/);
  assert.match(migration, /marble_liquidation_confirm/);
  assert.match(migration, /VERSION_CONFLICT/);
  assert.match(migration, /DEBT_RECOVERY_DEBTOR_REQUIRED/);
  assert.match(migration, /marble_action_replay/);
  assert.match(migration, /marble_record_action/);
});

test("liquidation settlement releases property and pays full debt deterministically", () => {
  assert.match(migration, /set owner_seat = null,[\s\S]*building_level = 0/);
  assert.match(migration, /set money = v_starting_cash \+ v_refund_total - v_amount_due/);
  assert.match(migration, /set money = money \+ v_amount_due/);
  assert.match(migration, /PROPERTY_LIQUIDATED/);
  assert.match(migration, /MONEY_PAID/);
  assert.match(migration, /DEBT_RECOVERED/);
});

test("liquidation RPC permissions are authenticated-only", () => {
  assert.match(migration, /revoke all on function public\.marble_liquidation_select[\s\S]*from public, anon/);
  assert.match(migration, /revoke all on function public\.marble_liquidation_confirm[\s\S]*from public, anon/);
  assert.match(migration, /grant execute on function public\.marble_liquidation_select[\s\S]*to authenticated/);
  assert.match(migration, /grant execute on function public\.marble_liquidation_confirm[\s\S]*to authenticated/);
});

test("online API exposes only authoritative liquidation select and confirm calls", () => {
  assert.match(apiSource, /marble_liquidation_select/);
  assert.match(apiSource, /marble_liquidation_confirm/);
  assert.match(apiSource, /p_asset_ids/);
  assert.doesNotMatch(apiSource, /owner_seat\s*=/);
});
