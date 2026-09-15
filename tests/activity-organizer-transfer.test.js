import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const productionFixMigration = read("../supabase/site/migrations/20260914213436_activity_organizer_transfer_production_fix.sql");
const creatorGuardMigration = read("../supabase/site/migrations/20260914213818_allow_organizer_transfer_through_creator_guard.sql");
const historyMigration = read("../supabase/site/migrations/20260914215312_separate_event_creator_and_organizer_history.sql");
const adminHistoryMigration = read("../supabase/site/migrations/20260915000018_admin_event_organizer_history.sql");
const detail = read("../js/pages/activityDetail.js");
const api = read("../js/api/activities.js");
const adminApi = read("../js/api/admin.js");
const adminPage = read("../js/pages/admin/organizerHistory.js");
const adminShell = read("../js/pages/admin.js");
const adminDashboard = read("../js/pages/admin/dashboard.js");
const styles = read("../css/activity-detail.css");

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

test("organizer transfer is restricted to current organizer and joined participants", () => {
  assert.match(historyMigration, /v_event\.organizer_id <> v_user_id/);
  assert.match(historyMigration, /v_new_organizer_status <> 'joined'/);
  assert.match(historyMigration, /set_config\('app\.allow_event_organizer_transfer', 'true', true\)/);
  assert.match(historyMigration, /update public\.events[\s\S]*set organizer_id = p_new_organizer_id/);
  assert.match(historyMigration, /'creator_id', v_event\.created_by/);
  assert.doesNotMatch(historyMigration, /set created_by = p_new_organizer_id/);
});

test("organizer cannot leave while another confirmed participant remains", () => {
  assert.match(
    historyMigration,
    /v_event\.organizer_id = v_user_id[\s\S]*other_participant\.status = 'joined'[\s\S]*먼저 주최자를 변경해야 합니다/,
  );
  assert.match(historyMigration, /if p_leave_current then[\s\S]*perform public\.cancel_event_participation\(p_event_id\)/);
  assert.match(historyMigration, /app\.event_organizer_previous_leaves/);
});

test("organizer permissions and participant notifications follow organizer_id", () => {
  assert.match(historyMigration, /series_id is null and organizer_id = \(select auth\.uid\(\)\)/);
  assert.match(historyMigration, /v_is_organizer := old\.series_id is null and old\.organizer_id = v_user_id/);
  assert.match(historyMigration, /v_event\.organizer_id <> v_user_id[\s\S]*event_participant_joined/);
  assert.match(historyMigration, /v_event\.organizer_id <> v_user_id[\s\S]*event_participation_cancelled/);
  assert.match(historyMigration, /participant\.user_id <> v_event\.organizer_id/);
});

test("activity API resolves current organizer while retaining original creator identity", () => {
  assert.match(api, /"created_by",\s*"organizer_id"/);
  assert.match(api, /original_created_by: event\.created_by/);
  assert.match(api, /created_by: event\.organizer_id \?\? event\.created_by/);
  assert.match(api, /getPublicProfiles\(\[withSummary\.organizer_id\]\)/);
  assert.match(api, /export async function transferEventOrganizer/);
  assert.match(api, /supabase\.rpc\("transfer_event_organizer"/);
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

test("activity detail keeps organizer card, crown, and leave handoff flow", () => {
  assert.match(detail, /organizerMeta\(event, organizerAvatarUrl, canTransferOrganizer, participants, root, organizerHistory\)/);
  assert.match(detail, /activity-detail__meta-label", text: "주최자"/);
  assert.match(detail, /participant-person__organizer-crown/);
  assert.match(detail, /text: "👑"/);
  assert.match(detail, /leaveAfterTransfer: true/);
  assert.match(detail, /주최자를 먼저 변경해주세요/);
  assert.match(detail, /넘기고 참여 취소/);
});

test("organizer presentation includes crown and transfer layouts", () => {
  assert.match(styles, /\.activity-detail__organizer-value/);
  assert.match(styles, /\.participant-person__organizer-crown/);
  assert.match(styles, /\.activity-organizer-transfer__person/);
});
