import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const approvalMigration = read("../supabase/site/migrations/20260915043318_activity_organizer_history_and_push.sql");
const notificationPolicyMigration = read("../supabase/site/migrations/20260915050200_refine_organizer_transfer_notifications.sql");
const cancellationMigration = read("../supabase/site/migrations/20260915065000_organizer_transfer_cancel_push.sql");
const routingMigration = read("../supabase/site/migrations/20260915104625_organizer_notification_routing_stability.sql");
const pushFunction = read("../supabase/functions/send-web-push/index.ts");
const desktopStyles = read("../css/activity-organizer-transfer.css");
const indexTemplate = read("../index.template.html");
const index = read("../index.html");

test("organizer transfer request and requester response notifications are mandatory pushes", () => {
  const requestStart = approvalMigration.indexOf("create or replace function public.request_event_organizer_transfer");
  const compatibilityStart = approvalMigration.indexOf("create or replace function public.transfer_event_organizer", requestStart);
  assert.notEqual(requestStart, -1);
  assert.notEqual(compatibilityStart, -1);
  const requestFunction = approvalMigration.slice(requestStart, compatibilityStart);

  assert.match(requestFunction, /'event_organizer_transfer_requested'/);
  assert.match(requestFunction, /p_new_organizer_id,[\s\S]*'event_organizer_transfer_requested'/);
  assert.match(routingMigration, /'event_organizer_transfer_accepted'::text/);
  assert.match(routingMigration, /'event_organizer_transfer_rejected'::text/);
  assert.match(routingMigration, /create or replace function private\.notify_event_organizer_transfer_response/);
  assert.match(
    routingMigration,
    /p_requester_id,[\s\S]*v_notification_type,[\s\S]*v_notification_type,[\s\S]*v_title/,
  );
  assert.match(
    routingMigration,
    /perform private\.notify_event_organizer_transfer_response\([\s\S]*v_request\.from_organizer_id,[\s\S]*v_user_id,[\s\S]*false[\s\S]*\)/,
  );
  assert.match(
    routingMigration,
    /perform private\.notify_event_organizer_transfer_response\([\s\S]*v_request\.from_organizer_id,[\s\S]*v_user_id,[\s\S]*true[\s\S]*\)/,
  );
  assert.match(pushFunction, /const REQUIRED_PUSH_TYPES = new Set\([\s\S]*"event_organizer_transfer_requested"/);
  assert.match(pushFunction, /const REQUIRED_PUSH_TYPES = new Set\([\s\S]*"event_organizer_transfer_accepted"/);
  assert.match(pushFunction, /const REQUIRED_PUSH_TYPES = new Set\([\s\S]*"event_organizer_transfer_rejected"/);

  // Acceptance notifies the requester, but the new organizer still does not receive
  // the redundant historical event_organizer_transferred self notification.
  assert.doesNotMatch(notificationPolicyMigration, /event_organizer_transferred/);
  assert.doesNotMatch(pushFunction, /"event_organizer_transferred"/);
});

test("participation notifications resolve the current organizer at notification time", () => {
  assert.match(
    routingMigration,
    /create or replace function private\.notify_event_participation_to_organizer\([\s\S]*select event\.organizer_id, event\.title[\s\S]*into v_organizer_id, v_event_title/,
  );
  assert.match(
    routingMigration,
    /insert into public\.notifications[\s\S]*\) values \([\s\S]*v_organizer_id,[\s\S]*v_notification_type/,
  );
  assert.match(
    routingMigration,
    /create or replace function public\.join_event\(p_event_id bigint\)[\s\S]*perform private\.notify_event_participation_to_organizer\([\s\S]*p_event_id,[\s\S]*v_user_id,[\s\S]*v_new_status/,
  );
  assert.match(
    routingMigration,
    /create or replace function public\.cancel_event_participation\(p_event_id bigint\)[\s\S]*perform private\.notify_event_participation_to_organizer\([\s\S]*p_event_id,[\s\S]*v_user_id,[\s\S]*'cancelled'/,
  );

  const helperStart = routingMigration.indexOf("create or replace function private.notify_event_participation_to_organizer");
  const responseHelperStart = routingMigration.indexOf("create or replace function private.notify_event_organizer_transfer_response", helperStart);
  assert.notEqual(helperStart, -1);
  assert.notEqual(responseHelperStart, -1);
  const participationHelper = routingMigration.slice(helperStart, responseHelperStart);
  assert.doesNotMatch(participationHelper, /created_by/);
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

test("organizer transfer lifecycle notifications bypass category preferences when web push is enabled", () => {
  for (const type of [
    "event_organizer_transfer_requested",
    "event_organizer_transfer_cancelled",
    "event_organizer_transfer_accepted",
    "event_organizer_transfer_rejected",
  ]) {
    assert.match(pushFunction, new RegExp(`const PUSH_TYPES = new Set\\([\\s\\S]*"${type}"`));
    assert.match(pushFunction, new RegExp(`const REQUIRED_PUSH_TYPES = new Set\\([\\s\\S]*"${type}"`));
  }
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
