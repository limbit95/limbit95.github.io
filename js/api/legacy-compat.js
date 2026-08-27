import { attachEventParticipationSummaries } from "./activities.js";
import { attachPublicProfiles } from "./profiles.js";
import { supabase, unwrap } from "./shared.js";

const CATEGORY_COLUMNS = "id,name,icon,color,description,is_active,created_at,updated_at";
const EVENT_COLUMNS = [
  "id",
  "series_id",
  "category_id",
  "title",
  "description",
  "event_date",
  "start_time",
  "end_time",
  "location_name",
  "location_url",
  "capacity",
  "fee_text",
  "difficulty",
  "preparation",
  "beginner_friendly",
  "participant_notice",
  "registration_deadline",
  "status",
  "created_by",
  "created_at",
  "updated_at",
].join(",");
const EVENT_PARTICIPANT_COLUMNS = "event_id,user_id,status,joined_at,waitlisted_at,cancelled_at,created_at,updated_at";
const PARTICIPATION_WITH_EVENT_COLUMNS = `
  ${EVENT_PARTICIPANT_COLUMNS},
  event:events(
    ${EVENT_COLUMNS},
    category:activity_categories(${CATEGORY_COLUMNS})
  )
`;
const COMMENT_COLUMNS = "id,target_type,target_id,author_id,content,status,created_at,updated_at";
const NOTIFICATION_COLUMNS = [
  "id",
  "user_id",
  "notification_type",
  "title",
  "body",
  "event_id",
  "poll_id",
  "is_read",
  "read_at",
  "created_at",
  "updated_at",
  "kind",
  "message_id",
  "target_path",
  "expires_at",
  "dedupe_key",
].join(",");

// Transitional compatibility only. Modern community code must never import this file.
// Keep through the first content-hash production rollout so pre-hash cached modules can recover.
export async function listMyParticipations(userId) {
  const participations = unwrap(await supabase
    .from("event_participants")
    .select(PARTICIPATION_WITH_EVENT_COLUMNS)
    .eq("user_id", userId)
    .in("status", ["joined", "waitlisted"])
    .order("created_at", { ascending: false })) ?? [];
  const events = participations.map((item) => item.event).filter(Boolean);
  const eventsWithSummaries = await attachEventParticipationSummaries(events);
  const eventMap = new Map(eventsWithSummaries.map((event) => [Number(event.id), event]));
  return participations.map((item) => ({
    ...item,
    event: item.event ? eventMap.get(Number(item.event.id)) ?? item.event : null,
  }));
}

export async function listComments(targetType, targetId) {
  const rows = unwrap(await supabase
    .from("comments")
    .select(COMMENT_COLUMNS)
    .eq("target_type", targetType)
    .eq("target_id", Number(targetId))
    .eq("status", "published")
    .order("created_at", { ascending: true })) ?? [];
  return attachPublicProfiles(rows);
}

export async function listNotifications(limit = 20) {
  return unwrap(await supabase
    .from("notifications")
    .select(NOTIFICATION_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit)) ?? [];
}
