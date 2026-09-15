import { readFile, writeFile } from "node:fs/promises";

async function replaceOnce(path, from, to) {
  const source = await readFile(path, "utf8");
  if (!source.includes(from)) {
    throw new Error(`Expected source not found in ${path}: ${from.slice(0, 100)}`);
  }
  const updated = source.replace(from, to);
  if (updated === source) throw new Error(`No change applied to ${path}`);
  await writeFile(path, updated, "utf8");
}

await replaceOnce(
  "js/pages/activityDetail.js",
  'import { getSignedAvatarUrl } from "../api/profiles.js";\n',
  'import { listEventOrganizerHistory } from "../api/activityOrganizerHistory.js";\nimport { getSignedAvatarUrl } from "../api/profiles.js";\n',
);

await replaceOnce(
  "js/pages/activityDetail.js",
  '  formatDate,\n  formatTime,\n',
  '  formatDate,\n  formatDateTime,\n  formatTime,\n',
);

await replaceOnce(
  "js/pages/activityDetail.js",
  '  const event = await getEvent(route.params.id);\n  const participants = await listEventParticipants(event.id);\n',
  '  const event = await getEvent(route.params.id);\n  const [participants, organizerHistory] = await Promise.all([\n    listEventParticipants(event.id),\n    listEventOrganizerHistory(event.id),\n  ]);\n',
);

await replaceOnce(
  "js/pages/activityDetail.js",
  '      organizerMeta(event, organizerAvatarUrl, canTransferOrganizer, participants, root),\n',
  '      organizerMeta(event, organizerAvatarUrl, canTransferOrganizer, participants, root, organizerHistory),\n',
);

await replaceOnce(
  "js/pages/activityDetail.js",
  'function organizerMeta(event, avatarUrl, canTransfer, participants, root) {\n',
  'function organizerMeta(event, avatarUrl, canTransfer, participants, root, organizerHistory) {\n',
);

await replaceOnce(
  "js/pages/activityDetail.js",
  `        canTransfer ? el("button", {\n          className: "activity-detail__organizer-change",\n          type: "button",\n          text: "변경",\n          onClick: (clickEvent) => openOrganizerTransferDialog({\n            event,\n            participants,\n            root,\n            trigger: clickEvent.currentTarget,\n          }),\n        }) : null,\n`,
  `        organizerHistory.length || canTransfer ? el("span", { className: "activity-detail__organizer-actions" }, [\n          organizerHistory.length ? el("button", {\n            className: "activity-detail__organizer-change",\n            type: "button",\n            text: "변경 내역",\n            onClick: () => openOrganizerHistoryDialog(organizerHistory),\n          }) : null,\n          canTransfer ? el("button", {\n            className: "activity-detail__organizer-change",\n            type: "button",\n            text: "변경",\n            onClick: (clickEvent) => openOrganizerTransferDialog({\n              event,\n              participants,\n              root,\n              trigger: clickEvent.currentTarget,\n            }),\n          }) : null,\n        ]) : null,\n`,
);

await replaceOnce(
  "js/pages/activityDetail.js",
  'async function openOrganizerTransferDialog({\n',
  `function openOrganizerHistoryDialog(history) {\n  const content = el("div", { className: "activity-organizer-history page-stack" }, history.map((item) => (\n    el("div", { className: "activity-organizer-history__item" }, [\n      el("div", { className: "activity-organizer-history__change" }, [\n        el("strong", { text: item.previous_organizer_name ?? "이전 주최자" }),\n        el("span", { text: "→", "aria-hidden": "true" }),\n        el("strong", { text: item.organizer_name ?? "새 주최자" }),\n      ]),\n      el("span", { className: "small subtle", text: formatDateTime(item.changed_at) }),\n      item.previous_organizer_left\n        ? el("span", {\n            className: "small subtle",\n            text: "이전 주최자는 주최자 변경과 함께 참여도 취소했습니다.",\n          })\n        : null,\n    ])\n  )));\n\n  void contentDialog({\n    title: "주최자 변경 내역",\n    content,\n  });\n}\n\nasync function openOrganizerTransferDialog({\n`,
);

const styleAppend = `\n.activity-detail__organizer-actions {\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  gap: .3rem;\n}\n\n.activity-organizer-history {\n  min-width: 0;\n  gap: .55rem;\n}\n\n.activity-organizer-history__item {\n  display: grid;\n  gap: .28rem;\n  padding: .72rem .78rem;\n  border: 1px solid #dde9ec;\n  border-radius: 12px;\n  background: #f9fcfd;\n}\n\n.activity-organizer-history__change {\n  display: flex;\n  align-items: center;\n  gap: .45rem;\n  color: #45636e;\n  font-size: .88rem;\n}\n`;
const styles = await readFile("css/activity-detail.css", "utf8");
if (!styles.includes(".activity-detail__organizer-actions")) {
  await writeFile("css/activity-detail.css", `${styles.trimEnd()}${styleAppend}\n`, "utf8");
}

await writeFile("js/api/activityOrganizerHistory.js", `import { supabase, unwrap } from "./shared.js";\n\nexport async function listEventOrganizerHistory(eventId) {\n  return unwrap(await supabase.rpc("list_event_organizer_history", {\n    p_event_id: Number(eventId),\n  })) ?? [];\n}\n`, "utf8");

await writeFile("supabase/site/migrations/20260915010600_activity_organizer_history_detail_push.sql", `begin;\n\nalter table public.notifications drop constraint if exists notifications_notification_type_check;\nalter table public.notifications add constraint notifications_notification_type_check\n  check (notification_type = any (array[\n    'event_updated'::text,\n    'event_cancelled'::text,\n    'waitlist_promoted'::text,\n    'poll_closed'::text,\n    'new_activity'::text,\n    'direct_message'::text,\n    'activity_reminder'::text,\n    'event_participant_joined'::text,\n    'event_participant_waitlisted'::text,\n    'event_participation_cancelled'::text,\n    'join_request_received'::text,\n    'service_notice'::text,\n    'event_organizer_changed'::text\n  ]));\n\ncreate or replace function public.list_event_organizer_history(p_event_id bigint)\nreturns table (\n  history_id bigint,\n  previous_organizer_id uuid,\n  previous_organizer_name text,\n  organizer_id uuid,\n  organizer_name text,\n  previous_organizer_left boolean,\n  changed_at timestamptz\n)\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\nbegin\n  if auth.uid() is null or not private.is_approved_member() then\n    raise exception '승인된 회원만 주최자 변경 내역을 확인할 수 있습니다.' using errcode = '42501';\n  end if;\n\n  if not exists (select 1 from public.events e where e.id = p_event_id) then\n    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';\n  end if;\n\n  return query\n  select\n    history.id as history_id,\n    history.previous_organizer_id,\n    coalesce(nullif(btrim(previous_profile.display_name), ''), '회원') as previous_organizer_name,\n    history.organizer_id,\n    coalesce(nullif(btrim(organizer_profile.display_name), ''), '회원') as organizer_name,\n    history.previous_organizer_left,\n    history.changed_at\n  from public.event_organizer_history history\n  left join public.profiles previous_profile on previous_profile.id = history.previous_organizer_id\n  left join public.profiles organizer_profile on organizer_profile.id = history.organizer_id\n  where history.event_id = p_event_id\n    and history.change_type = 'transfer'\n  order by history.changed_at desc, history.id desc;\nend;\n$$;\n\nrevoke all on function public.list_event_organizer_history(bigint) from public, anon, authenticated;\ngrant execute on function public.list_event_organizer_history(bigint) to authenticated, service_role;\n\ncreate or replace function private.notify_event_organizer_transfer()\nreturns trigger\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\nbegin\n  if new.change_type <> 'transfer' then\n    return new;\n  end if;\n\n  insert into public.notifications (\n    user_id, notification_type, kind, title, body,\n    event_id, target_path, dedupe_key\n  ) values (\n    new.organizer_id,\n    'event_organizer_changed',\n    'event_organizer_changed',\n    '활동 주최자가 변경됐어요',\n    format('''%s'' 활동의 주최자로 지정되었습니다.', new.event_title),\n    new.event_id,\n    format('#/activities/%s', new.event_id),\n    'event_organizer_changed:' || new.id::text\n  )\n  on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;\n\n  return new;\nend;\n$$;\n\nrevoke all on function private.notify_event_organizer_transfer() from public, anon, authenticated;\n\ndrop trigger if exists event_organizer_history_notify_new_organizer on public.event_organizer_history;\ncreate trigger event_organizer_history_notify_new_organizer\nafter insert on public.event_organizer_history\nfor each row execute function private.notify_event_organizer_transfer();\n\nnotify pgrst, 'reload schema';\n\ncommit;\n`, "utf8");

await replaceOnce(
  "supabase/functions/send-web-push/index.ts",
  '  "event_cancelled",\n  "new_activity",\n',
  '  "event_cancelled",\n  "event_organizer_changed",\n  "new_activity",\n',
);

await replaceOnce(
  "supabase/functions/send-web-push/index.ts",
  'const EMAIL_TYPES = new Set(["join_request_received"]);\n',
  'const ALWAYS_PUSH_TYPES = new Set(["join_request_received", "event_organizer_changed"]);\nconst EMAIL_TYPES = new Set(["join_request_received"]);\n',
);

await replaceOnce(
  "supabase/functions/send-web-push/index.ts",
  '  if (type === "join_request_received") return true;\n',
  '  if (ALWAYS_PUSH_TYPES.has(type)) return true;\n',
);

await writeFile("tests/activity-organizer-history-detail-push.test.js", `import assert from "node:assert/strict";\nimport { readFileSync } from "node:fs";\nimport test from "node:test";\n\nconst read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");\nconst migration = read("../supabase/site/migrations/20260915010600_activity_organizer_history_detail_push.sql");\nconst api = read("../js/api/activityOrganizerHistory.js");\nconst detail = read("../js/pages/activityDetail.js");\nconst pushFunction = read("../supabase/functions/send-web-push/index.ts");\nconst styles = read("../css/activity-detail.css");\n\ntest("approved members can read transfer-only organizer history for an activity", () => {\n  assert.match(migration, /create or replace function public\\.list_event_organizer_history/);\n  assert.match(migration, /not private\\.is_approved_member\\(\\)/);\n  assert.match(migration, /history\\.change_type = 'transfer'/);\n  assert.match(migration, /order by history\\.changed_at desc, history\\.id desc/);\n  assert.match(migration, /grant execute on function public\\.list_event_organizer_history\\(bigint\\) to authenticated, service_role/);\n});\n\ntest("activity detail shows organizer change history only when transfers exist", () => {\n  assert.match(api, /supabase\\.rpc\\("list_event_organizer_history"/);\n  assert.match(detail, /listEventOrganizerHistory\\(event\\.id\\)/);\n  assert.match(detail, /organizerHistory\\.length \\? el\\("button"/);\n  assert.match(detail, /text: "변경 내역"/);\n  assert.match(detail, /title: "주최자 변경 내역"/);\n  assert.match(detail, /previous_organizer_name/);\n  assert.match(detail, /organizer_name/);\n  assert.match(styles, /\\.activity-organizer-history__item/);\n});\n\ntest("organizer transfer creates a dedicated notification for the new organizer", () => {\n  assert.match(migration, /'event_organizer_changed'::text/);\n  assert.match(migration, /event_organizer_history_notify_new_organizer/);\n  assert.match(migration, /new\\.organizer_id,[\\s\\S]*'event_organizer_changed'/);\n  assert.match(migration, /활동의 주최자로 지정되었습니다/);\n  assert.match(migration, /'event_organizer_changed:' \\|\\| new\\.id::text/);\n});\n\ntest("organizer transfer push bypasses My Page category preferences but still uses active subscriptions", () => {\n  assert.match(pushFunction, /"event_organizer_changed"/);\n  assert.match(pushFunction, /const ALWAYS_PUSH_TYPES = new Set\\(\\["join_request_received", "event_organizer_changed"\\]\\)/);\n  assert.match(pushFunction, /if \\(ALWAYS_PUSH_TYPES\\.has\\(type\\)\\) return true/);\n  assert.match(pushFunction, /push_subscriptions\\?select=id,endpoint,p256dh,auth&user_id=eq\\./);\n});\n`, "utf8");

await replaceOnce(
  "package.json",
  '    "test:activity-permissions": "node --test tests/activity-permissions.test.js tests/activity-creator-auto-participation.test.js tests/activity-organizer-transfer.test.js",\n',
  '    "test:activity-permissions": "node --test tests/activity-permissions.test.js tests/activity-creator-auto-participation.test.js tests/activity-organizer-transfer.test.js tests/activity-organizer-history-detail-push.test.js",\n',
);

console.log("Organizer history detail + mandatory organizer transfer push source changes applied.");
