import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL("../supabase/site/migrations/20260920104800_display_name_uniqueness.sql", import.meta.url),
  "utf8",
);
const profilesApi = readFileSync(new URL("../js/api/profiles.js", import.meta.url), "utf8");
const signup = readFileSync(new URL("../js/pages/signup.js", import.meta.url), "utf8");
const mypage = readFileSync(new URL("../js/pages/mypage.js", import.meta.url), "utf8");

test("active member display names are unique after trim and case normalization", () => {
  assert.match(
    migration,
    /create unique index profiles_active_display_name_uidx[\s\S]*lower\(btrim\(display_name\)\)[\s\S]*status in \('pending', 'approved', 'suspended'\)/,
  );
  assert.doesNotMatch(
    migration,
    /status in \('pending', 'approved', 'rejected', 'suspended'\)/,
  );
});

test("display name availability RPC exposes only a boolean lookup to authenticated users", () => {
  assert.match(migration, /create or replace function public\.check_display_name_availability\(p_display_name text\)/);
  assert.match(migration, /v_user_id uuid := auth\.uid\(\)/);
  assert.match(migration, /if v_user_id is null then[\s\S]*using errcode = '42501'/);
  assert.match(migration, /p\.id <> v_user_id/);
  assert.match(migration, /revoke all on function public\.check_display_name_availability\(text\)[\s\S]*from public, anon, authenticated/);
  assert.match(migration, /grant execute on function public\.check_display_name_availability\(text\)[\s\S]*to authenticated/);
  assert.doesNotMatch(migration, /grant execute on function public\.check_display_name_availability\(text\)[\s\S]*to anon/);
});

test("profile API centralizes availability lookup and unique-conflict recognition", () => {
  assert.match(profilesApi, /export async function checkDisplayNameAvailability\(displayName\)/);
  assert.match(profilesApi, /supabase\.rpc\("check_display_name_availability"/);
  assert.match(profilesApi, /export function isDisplayNameConflict\(error\)/);
  assert.match(profilesApi, /error\?\.code !== "23505"/);
  assert.match(profilesApi, /profiles_active_display_name_uidx/);
});

test("signup checks nicknames after email verification and rechecks before final submission", () => {
  assert.match(signup, /const DISPLAY_NAME_CHECK_DELAY_MS = 450/);
  assert.match(signup, /이메일 인증 후 닉네임 사용 가능 여부를 확인합니다/);
  assert.match(signup, /checkDisplayNameAvailability\(value\)/);
  assert.match(signup, /step === 2 && !\(await ensureDisplayNameAvailable\(\)\)/);
  assert.match(signup, /if \(!\(await ensureDisplayNameAvailable\(\)\)\)[\s\S]*goTo\(2\)/);
  assert.match(signup, /isDisplayNameConflict\(error\)/);
  assert.match(signup, /이미 사용 중인 닉네임입니다\. 다른 닉네임을 선택해 주세요/);
});

test("profile editing keeps the current nickname but validates changed nicknames", () => {
  assert.match(mypage, /const originalDisplayNameKey = normalizeDisplayNameKey\(auth\.profile\.display_name\)/);
  assert.match(mypage, /현재 사용 중인 닉네임입니다/);
  assert.match(mypage, /checkDisplayNameAvailability\(value\)/);
  assert.match(mypage, /if \(!\(await ensureDisplayNameAvailable\(\)\)\) return/);
  assert.match(mypage, /isDisplayNameConflict\(error\)/);
});
