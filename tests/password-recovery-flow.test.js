import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [template, passwordResetPage, appSource] = await Promise.all([
  readFile(new URL("../supabase/auth-email-templates/recovery.html", import.meta.url), "utf8"),
  readFile(new URL("../js/pages/passwordReset.js", import.meta.url), "utf8"),
  readFile(new URL("../js/app.js", import.meta.url), "utf8"),
]);

test("password recovery email targets the SPA reset route with a token hash", () => {
  assert.match(
    template,
    /href="{{ \.RedirectTo }}\?token_hash={{ \.TokenHash }}&amp;type=recovery#\/password\/update"/,
  );
  assert.doesNotMatch(template, /href="{{ \.ConfirmationURL }}"/);
});

test("password update page verifies the recovery token before allowing a password change", () => {
  assert.match(passwordResetPage, /new URLSearchParams\(window\.location\.search\)/);
  assert.match(passwordResetPage, /params\.get\("token_hash"\)/);
  assert.match(passwordResetPage, /await verifyRecoveryToken\(tokenHash\)/);
  assert.match(passwordResetPage, /await updatePassword\(password\.value\)/);
});

test("password update hash route remains registered for GitHub Pages", () => {
  assert.match(
    appSource,
    /route\("\/password\/update", "새 비밀번호 설정", null, renderPasswordUpdate/,
  );
});
