import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL("../supabase/site/migrations/20260915043650_allow_organizer_transfer_acceptance_boundary.sql", import.meta.url),
  "utf8",
);

test("accepted organizer transfer bypasses normal ownership check only behind transfer flag", () => {
  assert.match(migration, /new\.created_by is distinct from old\.created_by/);
  assert.match(migration, /new\.organizer_id is distinct from old\.organizer_id[\s\S]*and not v_organizer_transfer_allowed/);
  assert.match(
    migration,
    /if new\.organizer_id is distinct from old\.organizer_id[\s\S]*and v_organizer_transfer_allowed then[\s\S]*return new;/,
  );

  const transferBypass = migration.indexOf("and v_organizer_transfer_allowed then");
  const organizerRoleCheck = migration.indexOf("v_is_organizer :=");
  assert.notEqual(transferBypass, -1);
  assert.notEqual(organizerRoleCheck, -1);
  assert.ok(transferBypass < organizerRoleCheck);
});
