import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateBirthDate } from "../js/validators.js";

const signup = readFileSync(new URL("../js/pages/signup.js", import.meta.url), "utf8");
const auth = readFileSync(new URL("../js/auth.js", import.meta.url), "utf8");
const profiles = readFileSync(new URL("../js/api/profiles.js", import.meta.url), "utf8");
const mypage = readFileSync(new URL("../js/pages/mypage.js", import.meta.url), "utf8");
const profilePopover = readFileSync(new URL("../js/components/profilePopover.js", import.meta.url), "utf8");
const constants = readFileSync(new URL("../js/constants.js", import.meta.url), "utf8");
const migration = readFileSync(new URL("../supabase/site/migrations/20260910123000_signup_member_info_birth_date.sql", import.meta.url), "utf8");

const nextStepBody = signup.slice(
  signup.indexOf("function nextStep"),
  signup.indexOf("function goTo"),
);
const submitBody = signup.slice(
  signup.indexOf('form.addEventListener("submit"'),
  signup.indexOf("renderStep();\n  return el"),
);

test("signup combines basic and member information into one member-info step", () => {
  assert.match(signup, /const STEP_LABELS = \["약관 동의", "회원 정보", "최종 확인"\]/);
  assert.doesNotMatch(signup, /"기본 정보"/);
  assert.match(signup, /fields\.display_name\.root,[\s\S]*fields\.birth_date\.root,[\s\S]*fields\.church_group\.root/);
});

test("password confirmation is required and password updates are deferred until final submit", () => {
  assert.match(signup, /password_confirm: field\("password_confirm", "비밀번호 확인", "password"/);
  assert.match(signup, /fields\.password\.input\.value !== fields\.password_confirm\.input\.value/);
  assert.match(signup, /비밀번호가 일치하지 않습니다/);
  assert.doesNotMatch(nextStepBody, /updatePassword/);
  assert.match(submitBody, /let appliedPassword|password !== appliedPassword|await updatePassword\(password\)|appliedPassword = password/);
});

test("birth date uses separate year month day selects and validates real calendar dates", () => {
  assert.match(signup, /name: "birth_year"/);
  assert.match(signup, /name: "birth_month"/);
  assert.match(signup, /name: "birth_day"/);
  assert.match(signup, /birth_date: getBirthDateValue\(fields\.birth_date\)/);
  assert.equal(validateBirthDate("2000-02-29"), true);
  assert.equal(validateBirthDate("2001-02-29"), false);
  assert.equal(validateBirthDate("1995-13-01"), false);
  assert.equal(validateBirthDate("1995-00-10"), false);
});

test("age visibility is removed from user-facing runtime and public profile rendering", () => {
  assert.doesNotMatch(signup, /age_visibility|AGE_LABELS|나이 공개 범위/);
  assert.doesNotMatch(mypage, /age_visibility|AGE_VISIBILITY_LABEL|나이 공개 범위/);
  assert.doesNotMatch(profilePopover, /getPublicAgeText|age_visibility|age_group|birth_year|나이 정보/);
  assert.doesNotMatch(constants, /AGE_VISIBILITY_LABEL/);
  assert.doesNotMatch(auth.match(/const PROFILE_COLUMNS = [^\n]+/)?.[0] ?? "", /age_visibility/);
  assert.doesNotMatch(profiles.match(/const PROFILE_COLUMNS = [^\n]+/)?.[0] ?? "", /age_visibility/);
});

test("birth date remains private in the database contract while legacy age settings are neutralized", () => {
  assert.match(migration, /add column if not exists birth_date date/);
  assert.match(migration, /set age_visibility = 'private'/);
  assert.match(migration, /p_birth_date date/);
  assert.match(migration, /extract\(year from p_birth_date\)::integer,'private'/);

  const publicProfilesBody = migration.slice(
    migration.indexOf("create function public.get_public_member_profiles("),
    migration.indexOf("drop function if exists public.get_public_member_profiles_by_ids"),
  );
  const publicProfilesByIdsBody = migration.slice(
    migration.indexOf("create function public.get_public_member_profiles_by_ids("),
  );
  assert.doesNotMatch(publicProfilesBody, /birth_date|birth_year|age_group|age_visibility/);
  assert.doesNotMatch(publicProfilesByIdsBody, /birth_date|birth_year|age_group|age_visibility/);
});

test("profile editing accepts exact birth dates but preserves year-only legacy records until completed", () => {
  assert.match(mypage, /profileBirthDateField\(auth\.profile\)/);
  assert.match(mypage, /기존 출생연도 \$\{profile\.birth_year\}년은 보관 중입니다/);
  assert.match(mypage, /profilePayload\.birth_date = birthDateValue/);
  assert.match(mypage, /profilePayload\.birth_year = Number\(birthDate\.year\.value\)/);
  assert.doesNotMatch(mypage, /birth_date:\s*`${?[^\n]*01-01/);
});
