import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const existingEmailGuard = readFileSync(
  new URL("../supabase/site/migrations/20260909221237_signup_existing_email_guard.sql", import.meta.url),
  "utf8",
);
const retainedSessionGrant = readFileSync(
  new URL("../supabase/site/migrations/20260910035158_allow_authenticated_signup_email_status.sql", import.meta.url),
  "utf8",
);

test("signup email status lookup remains available before and after an incomplete Auth OTP session is restored", () => {
  assert.match(
    existingEmailGuard,
    /grant execute on function public\.get_signup_email_status\(text\) to anon/,
  );
  assert.match(
    retainedSessionGrant,
    /grant execute on function public\.get_signup_email_status\(text\) to authenticated/,
  );
});
