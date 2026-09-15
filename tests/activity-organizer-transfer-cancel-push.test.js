import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const approvalMigration = read("../supabase/site/migrations/20260915043318_activity_organizer_history_and_push.sql");
const notificationPolicyMigration = read("../supabase/site/migrations/20260915050200_refine_organizer_transfer_notifications.sql");
const cancellationMigration = read("../supabase/site/migrations/20260915065000_organizer_transfer_cancel_push.sql");
const pushFunction = read("../supabase/functions/send-web-push/index.ts");
const desktopStyles = read("../css/activity-organizer-transfer.css");
const indexTemplate = read("../index.template.html");
const index = read("../index.html");

test("organizer transfer request remains a mandatory push and acceptance stays silent", () => {
  const requestStart = approvalMigration.indexOf("create or replace function public.request_event_organizer_transfer");
  const compatibilityStart = approvalMigration.indexOf("create or replace function public.transfer_event_organizer", requestStart);
  assert.notEqual(requestStart, -1);
  assert.notEqual(compatibilityStart, -1);
  const requestFunction = approvalMigration.slice(requestStart, compatibilityStart);

  assert.match(requestFunction, /'event_organizer_transfer_requested'/);
  assert.match(requestFunction, /p_new_organizer_id,[\s\S]*'event_organizer_transfer_requested'/);
  assert.match(pushFunction, /const REQUIRED_PUSH_TYPES = new Set\([\s\S]*"event_organizer_transfer_requested"/);
  assert.doesNotMatch(notificationPolicyMigration, /event_organizer_transferred/);
  assert.doesNotMatch(pushFunction, /"event_organizer_transferred"/);
});

test("cancelling an organizer transfer request notifies the former target", () => {
  assert.match(cancellationMigration, /'event_organizer_transfer_cancelled'::text/);
  assert.match(cancellationMigration, /create or replace function public\.cancel_event_organizer_transfer_request\(p_request_id bigint\)/);
  assert.match(cancellationMigration, /v_request\.from_organizer_id <> v_user_id/);
  assert.match(cancellationMigration, /set status = 'cancelled', cancelled_at = now\(\)/);
  assert.match(
    cancellationMigration,
    /insert into public\.notifications[\s\S]*v_request\.to_organizer_id,[\s\S]*'event_organizer_transfer_cancelled'/,
  );
  assert.match(cancellationMigration, /'주최자 변경 요청이 취소되었어요'/);
  assert.match(cancellationMigration, /grant execute on function public\.cancel_event_organizer_transfer_request\(bigint\)[\s\S]*to authenticated, service_role/);
});

test("organizer transfer cancellation bypasses category preferences when web push is enabled", () => {
  assert.match(pushFunction, /const PUSH_TYPES = new Set\([\s\S]*"event_organizer_transfer_cancelled"/);
  assert.match(pushFunction, /const REQUIRED_PUSH_TYPES = new Set\([\s\S]*"event_organizer_transfer_cancelled"/);
  assert.match(pushFunction, /if \(REQUIRED_PUSH_TYPES\.has\(type\)\) return true/);
});

test("desktop organizer transfer request panel uses balanced full-width centered layout", () => {
  assert.match(indexTemplate, /\.\/css\/activity-organizer-transfer\.css/);
  assert.match(index, /\.\/css\/activity-organizer-transfer\.css/);
  assert.match(desktopStyles, /@media \(min-width: 900px\)/);
  assert.match(desktopStyles, /\.activity-detail__organizer-request[\s\S]*grid-column: 1 \/ -1/);
  assert.match(desktopStyles, /\.activity-detail__organizer-request-copy[\s\S]*justify-items: center/);
  assert.match(desktopStyles, /\.activity-detail__organizer-request-actions[\s\S]*justify-content: center/);
});
