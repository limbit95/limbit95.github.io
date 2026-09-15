import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const productionFixMigration = read("../supabase/site/migrations/20260914213436_activity_organizer_transfer_production_fix.sql");
const creatorGuardMigration = read("../supabase/site/migrations/20260914213818_allow_organizer_transfer_through_creator_guard.sql");
const historyMigration = read("../supabase/site/migrations/20260914215312_separate_event_creator_and_organizer_history.sql");
const adminHistoryMigration = read("../supabase/site/migrations/20260915000018_admin_event_organizer_history.sql");
const approvalMigration = read("../supabase/site/migrations/20260915043318_activity_organizer_history_and_push.sql");
const detail = read("../js/pages/activityDetail.js");
const api = read("../js/api/activities.js");
const adminApi = read("../js/api/admin.js");
const adminPage = read("../js/pages/admin/organizerHistory.js");
const adminShell = read("../js/pages/admin.js");
const adminDashboard = read("../js/pages/admin/dashboard.js");
const styles = read("../css/activity-detail.css");
const pushFunction = read("../supabase/functions/send-web-push/index.ts");

test("production organizer RPC migration preserves notification behavior and schema visibility", () => {
  assert.match(productionFixMigration, /create or replace function public\.transfer_event_organizer/);
  assert.match(productionFixMigration, /event_participation_cancelled/);
  assert.match(
    productionFixMigration,
    /grant execute on function public\.transfer_event_organizer\(bigint, uuid, boolean\)[\s\S]*to authenticated, service_role/,
  );
  assert.match(productionFixMigration, /notify pgrst, 'reload schema'/);
  assert.match(creatorGuardMigration, /app\.allow_event_organizer_transfer/);
});

test("events preserve immutable creator separately from current organizer", () => {
  assert.match(historyMigration, /add column if not exists organizer_id uuid/);
  assert.match(historyMigration, /set organizer_id = created_by/);
  assert.match(historyMigration, /alter column organizer_id set not null/);
  assert.match(historyMigration, /foreign key \(organizer_id\) references public\.profiles\(id\)/);
  assert.match(historyMigration, /new\.organizer_id := new\.created_by/);
  assert.match(historyMigration, /최초 등록자는 변경할 수 없습니다/);
  assert.match(historyMigration, /new\.created_by is distinct from old\.created_by/);
});

test("organizer changes are recorded as durable history", () => {
  assert.match(historyMigration, /create table if not exists public\.event_organizer_history/);
  assert.match(historyMigration, /previous_organizer_id uuid/);
  assert.match(historyMigration, /organizer_id uuid not null/);
  assert.match(historyMigration, /changed_by uuid/);
  assert.match(historyMigration, /change_type text not null check \(change_type in \('initial', 'transfer'\)\)/);
  assert.match(historyMigration, /previous_organizer_left boolean not null default false/);
  assert.match(historyMigration, /events_record_initial_organizer/);
  assert.match(historyMigration, /events_record_organizer_transfer/);
  assert.match(historyMigration, /old\.organizer_id/);
  assert.match(historyMigration, /new\.organizer_id/);
  assert.match(historyMigration, /v_changed_by/);
  assert.match(historyMigration, /revoke all on table public\.event_organizer_history from public, anon, authenticated/);
});

test("organizer history survives activity deletion with a title snapshot", () => {
  assert.match(adminHistoryMigration, /add column if not exists event_title text/);
  assert.match(adminHistoryMigration, /alter column event_id drop not null/);
  assert.match(adminHistoryMigration, /foreign key \(event_id\) references public\.events\(id\) on delete set null/);
  assert.match(adminHistoryMigration, /event_organizer_history_set_event_title/);
  assert.match(adminHistoryMigration, /before insert on public\.event_organizer_history/);
  assert.match(adminHistoryMigration, /alter column event_title set not null/);
});

test("operations admins can query paginated organizer history through a guarded RPC", () => {
  assert.match(adminHistoryMigration, /create or replace function public\.admin_list_event_organizer_history/);
  assert.match(adminHistoryMigration, /private\.has_admin_permission\('operations'\)/);
  assert.match(adminHistoryMigration, /p_search text default null/);
  assert.match(adminHistoryMigration, /p_change_type text default null/);
  assert.match(adminHistoryMigration, /count\(\*\) over\(\) as total_count/);
  assert.match(adminHistoryMigration, /grant execute on function public\.admin_list_event_organizer_history/);
});

test("approved members can query transfer history for an activity without direct table access", () => {
  assert.match(approvalMigration, /create or replace function public\.list_event_organizer_history\(p_event_id bigint\)/);
  assert.match(approvalMigration, /auth\.uid\(\) is null or not private\.is_approved_member\(\)/);
  assert.match(approvalMigration, /history\.event_id = p_event_id[\s\S]*history\.change_type = 'transfer'/);
  assert.match(approvalMigration, /previous_organizer\.display_name as previous_organizer_name/);
  assert.match(approvalMigration, /organizer\.display_name as organizer_name/);
  assert.match(
    approvalMigration,
    /grant execute on function public\.list_event_organizer_history\(bigint\)[\s\S]*to authenticated, service_role/,
  );
});

test("organizer transfer requests are durable and only one can remain pending per activity", () => {
  assert.match(approvalMigration, /create table if not exists public\.event_organizer_transfer_requests/);
  assert.match(approvalMigration, /status text not null default 'pending'/);
  assert.match(approvalMigration, /'accepted', 'rejected', 'cancelled'/);
  assert.match(approvalMigration, /leave_current_after_accept boolean not null default false/);
  assert.match(approvalMigration, /event_organizer_transfer_requests_one_pending/);
  assert.match(approvalMigration, /where status = 'pending'/);
  assert.match(approvalMigration, /revoke all on table public\.event_organizer_transfer_requests from public, anon, authenticated/);
});

test("organizer transfer request does not change authority before recipient acceptance", () => {
  const requestStart = approvalMigration.indexOf("create or replace function public.request_event_organizer_transfer");
  const compatStart = approvalMigration.indexOf("create or replace function public.transfer_event_organizer", requestStart);
  assert.notEqual(requestStart, -1);
  assert.notEqual(compatStart, -1);
  const requestFunction = approvalMigration.slice(requestStart, compatStart);
  assert.match(requestFunction, /v_event\.organizer_id <> v_user_id/);
  assert.match(requestFunction, /v_new_organizer_status <> 'joined'/);
  assert.match(requestFunction, /insert into public\.event_organizer_transfer_requests/);
  assert.match(requestFunction, /'event_organizer_transfer_requested'/);
  assert.doesNotMatch(requestFunction, /update public\.events[\s\S]*set organizer_id/);
});

test("recipient acceptance performs the actual organizer change and rejection leaves it untouched", () => {
  const responseStart = approvalMigration.indexOf("create or replace function public.respond_event_organizer_transfer");
  const cancelStart = approvalMigration.indexOf("create or replace function public.cancel_event_organizer_transfer_request", responseStart);
  assert.notEqual(responseStart, -1);
  assert.notEqual(cancelStart, -1);
  const responseFunction = approvalMigration.slice(responseStart, cancelStart);
  assert.match(responseFunction, /v_request\.to_organizer_id <> v_user_id/);
  assert.match(responseFunction, /if not p_accept then[\s\S]*status = 'rejected'/);
  assert.match(responseFunction, /set_config\('app\.allow_event_organizer_transfer', 'true', true\)/);
  assert.match(responseFunction, /update public\.events[\s\S]*set organizer_id = v_user_id/);
  assert.match(responseFunction, /status = 'accepted'/);
  assert.match(responseFunction, /'event_organizer_transferred'/);
});

test("leave-after-accept waits for acceptance then cancels previous organizer and promotes waitlist", () => {
  assert.match(approvalMigration, /if v_request\.leave_current_after_accept then/);
  assert.match(
    approvalMigration,
    /update public\.event_participants[\s\S]*user_id = v_request\.from_organizer_id[\s\S]*status = 'joined'/,
  );
  assert.match(approvalMigration, /ep\.status = 'waitlisted'[\s\S]*for update skip locked/);
  assert.match(approvalMigration, /'waitlist_promoted'/);
  assert.match(approvalMigration, /app\.event_organizer_previous_leaves/);
});

test("current organizer can cancel a pending request and compatibility rpc cannot bypass approval", () => {
  assert.match(approvalMigration, /create or replace function public\.cancel_event_organizer_transfer_request/);
  assert.match(approvalMigration, /v_request\.from_organizer_id <> v_user_id/);
  assert.match(approvalMigration, /set status = 'cancelled', cancelled_at = now\(\)/);
  assert.match(
    approvalMigration,
    /create or replace function public\.transfer_event_organizer[\s\S]*select public\.request_event_organizer_transfer/,
  );
});

test("organizer permissions and participant notifications follow organizer_id", () => {
  assert.match(historyMigration, /series_id is null and organizer_id = \(select auth\.uid\(\)\)/);
  assert.match(historyMigration, /v_is_organizer := old\.series_id is null and old\.organizer_id = v_user_id/);
  assert.match(historyMigration, /v_event\.organizer_id <> v_user_id[\s\S]*event_participant_joined/);
  assert.match(historyMigration, /v_event\.organizer_id <> v_user_id[\s\S]*event_participation_cancelled/);
  assert.match(historyMigration, /participant\.user_id <> v_event\.organizer_id/);
});

test("organizer request and completion pushes bypass my-page category preferences when push is enabled", () => {
  assert.match(approvalMigration, /'event_organizer_transfer_requested'::text/);
  assert.match(approvalMigration, /'event_organizer_transferred'::text/);
  assert.match(pushFunction, /const REQUIRED_PUSH_TYPES = new Set/);
  assert.match(pushFunction, /"event_organizer_transfer_requested"/);
  assert.match(pushFunction, /"event_organizer_transferred"/);
  assert.match(pushFunction, /if \(REQUIRED_PUSH_TYPES\.has\(type\)\) return true/);
});

test("activity API exposes request, response, cancellation, and history calls", () => {
  assert.match(api, /"created_by",\s*"organizer_id"/);
  assert.match(api, /original_created_by: event\.created_by/);
  assert.match(api, /created_by: event\.organizer_id \?\? event\.created_by/);
  assert.match(api, /getPublicProfiles\(\[withSummary\.organizer_id\]\)/);
  assert.match(api, /export async function requestEventOrganizerTransfer/);
  assert.match(api, /supabase\.rpc\("request_event_organizer_transfer"/);
  assert.match(api, /export async function getEventOrganizerTransferRequest/);
  assert.match(api, /supabase\.rpc\("get_event_organizer_transfer_request"/);
  assert.match(api, /export async function respondEventOrganizerTransfer/);
  assert.match(api, /supabase\.rpc\("respond_event_organizer_transfer"/);
  assert.match(api, /export async function cancelEventOrganizerTransferRequest/);
  assert.match(api, /supabase\.rpc\("cancel_event_organizer_transfer_request"/);
  assert.match(api, /export async function listEventOrganizerHistory/);
});

test("admin organizer history is exposed from the operations admin surface", () => {
  assert.match(adminApi, /export async function listEventOrganizerHistory/);
  assert.match(adminApi, /supabase\.rpc\("admin_list_event_organizer_history"/);
  assert.match(adminShell, /route\.query\.get\("view"\) === "organizer-history"/);
  assert.match(adminShell, /renderOrganizerHistory/);
  assert.match(adminDashboard, /#\/admin\/managers\?view=organizer-history/);
  assert.match(adminPage, /활동 주최자 이력/);
  assert.match(adminPage, /삭제된 활동/);
  assert.match(adminPage, /이전 주최자 참여/);
  assert.match(adminPage, /change_type === "initial"/);
});

test("activity detail shows organizer history only when transfers exist", () => {
  assert.match(detail, /listEventOrganizerHistory/);
  assert.match(detail, /organizerHistory\.length \? el\("button"/);
  assert.match(detail, /text: "주최자 이력"/);
  assert.match(detail, /title: "주최자 변경 이력 보기"/);
  assert.match(detail, /openOrganizerHistoryDialog\(organizerHistory\)/);
  assert.match(detail, /title: "주최자 변경 이력"/);
  assert.match(detail, /previous_organizer_left[\s\S]*이전 주최자 · 참여 취소[\s\S]*이전 주최자 · 계속 참여/);
});

test("activity detail exposes pending request acceptance, rejection, and cancellation", () => {
  assert.match(detail, /getEventOrganizerTransferRequest/);
  assert.match(detail, /organizerTransferRequestPanel/);
  assert.match(detail, /text: "거절"/);
  assert.match(detail, /text: "수락"/);
  assert.match(detail, /text: "요청 취소"/);
  assert.match(detail, /respondEventOrganizerTransfer\(request\.id, accept\)/);
  assert.match(detail, /cancelEventOrganizerTransferRequest\(request\.id\)/);
  assert.match(detail, /상대방이 수락하기 전까지는 현재 주최자 권한이 그대로 유지됩니다/);
});

test("activity detail keeps organizer crown and leave-after-accept handoff flow", () => {
  assert.match(detail, /activity-detail__meta-label", text: "주최자"/);
  assert.match(detail, /participant-person__organizer-crown/);
  assert.match(detail, /text: "👑"/);
  assert.match(detail, /leaveAfterTransfer: true/);
  assert.match(detail, /요청하고 참여 취소/);
  assert.match(detail, /수락되면 참여가 자동으로 취소됩니다/);
});

test("organizer presentation includes crown, transfer, and request layouts", () => {
  assert.match(styles, /\.activity-detail__organizer-value/);
  assert.match(styles, /\.participant-person__organizer-crown/);
  assert.match(styles, /\.activity-organizer-transfer__person/);
  assert.match(styles, /\.activity-detail__organizer-request/);
  assert.match(styles, /\.activity-detail__organizer-request-actions/);
});
