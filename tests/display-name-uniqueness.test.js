import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL("../supabase/site/migrations/20260920062255_display_name_uniqueness.sql", import.meta.url),
  "utf8",
);
const profilesApi = readFileSync(new URL("../js/api/profiles.js", import.meta.url), "utf8");
const signup = readFileSync(new URL("../js/pages/signup.js", import.meta.url), "utf8");
const pagesCss = readFileSync(new URL("../css/pages.css", import.meta.url), "utf8");
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

test("signup uses button-driven nickname verification with no automatic availability checks", () => {
  assert.doesNotMatch(signup, /DISPLAY_NAME_CHECK_DELAY_MS|scheduleDisplayNameCheck|runDisplayNameCheck|ensureDisplayNameAvailable|displayNameCheckTimer/);
  assert.match(signup, /className: "display-name-check-row"/);
  assert.match(signup, /text: "중복 확인"/);
  assert.match(signup, /onclick: \(\) => \{[\s\S]*verifyDisplayName\(\)/);
  assert.match(signup, /async function verifyDisplayName\(\)/);
  assert.match(signup, /if \(!valueInRange\(value, 1, 50\)\)/);
  assert.match(signup, /const available = await checkDisplayNameAvailability\(value\)/);
  assert.match(signup, /verifiedDisplayName = value/);
  assert.match(signup, /✓ 닉네임 중복 확인이 완료되었습니다/);
  assert.match(signup, /function requireDisplayNameVerification\(\)/);
  assert.match(signup, /step === 2 && !requireDisplayNameVerification\(\)/);
  assert.match(signup, /if \(!requireDisplayNameVerification\(\)\)[\s\S]*goTo\(2\)/);
  assert.match(signup, /isDisplayNameConflict\(error\)/);
  assert.match(signup, /이미 사용 중인 닉네임입니다\. 다른 닉네임을 선택해 주세요/);
});

test("signup nickname verification is invalidated as soon as the input changes", () => {
  assert.match(
    signup,
    /fields\.display_name\.input\.addEventListener\("input", \(\) => \{[\s\S]*verifiedDisplayName = "";[\s\S]*updateDisplayNameCheckButton\(\);/,
  );
  assert.equal((signup.match(/checkDisplayNameAvailability\(value\)/g) ?? []).length, 1);
});

test("nickname verification button shares the responsive input-row layout", () => {
  assert.match(pagesCss, /\.signup-email-row,\n\.display-name-check-row \{[^}]*grid-template-columns: minmax\(0, 1fr\) auto/);
  assert.match(pagesCss, /\.signup-email-row,\n  \.display-name-check-row \{ grid-template-columns: 1fr; \}/);
});

test("nickname checks preserve the existing signup OTP countdown lifecycle", () => {
  assert.match(
    signup,
    /refreshResendCooldown = tick;\n    tick\(\);\n    timerId = setInterval\(\(\) => \{/,
  );
});

test("profile editing also uses explicit nickname verification with no debounce", () => {
  assert.doesNotMatch(mypage, /displayNameCheckTimer|scheduleDisplayNameCheck|runDisplayNameCheck|ensureDisplayNameAvailable|setTimeout\([\s\S]*450/);
  assert.match(mypage, /className: "display-name-check-row"/);
  assert.match(mypage, /async function verifyDisplayName\(\)/);
  assert.match(mypage, /const available = await checkDisplayNameAvailability\(value\)/);
  assert.match(mypage, /verifiedDisplayName = value/);
  assert.match(mypage, /function requireDisplayNameVerification\(\)/);
  assert.match(mypage, /if \(!requireDisplayNameVerification\(\)\) return/);
  assert.match(mypage, /displayNameInput\.addEventListener\("input", \(\) => \{[\s\S]*verifiedDisplayName = ""/);
  assert.match(mypage, /isDisplayNameConflict\(error\)/);
  assert.equal((mypage.match(/checkDisplayNameAvailability\(value\)/g) ?? []).length, 1);
});
