import { getPublicProfiles } from "./profiles.js";
import { compact, supabase, unwrap } from "./shared.js";

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
const EVENT_SERIES_COLUMNS = [
  "id",
  "category_id",
  "title",
  "description",
  "start_date",
  "end_date",
  "start_time",
  "end_time",
  "timezone",
  "recurrence_rule",
  "location_name",
  "location_url",
  "capacity",
  "fee_text",
  "difficulty",
  "preparation",
  "beginner_friendly",
  "participant_notice",
  "status",
  "created_by",
  "created_at",
  "updated_at",
].join(",");
const EVENT_PARTICIPANT_COLUMNS = "event_id,user_id,status,joined_at,waitlisted_at,cancelled_at,created_at,updated_at";
const EVENT_WITH_CATEGORY_COLUMNS = `
  ${EVENT_COLUMNS},
  category:activity_categories(${CATEGORY_COLUMNS})
`;
const EVENT_DETAIL_COLUMNS = `
  ${EVENT_COLUMNS},
  category:activity_categories(${CATEGORY_COLUMNS}),
  series:event_series(${EVENT_SERIES_COLUMNS})
`;
const PARTICIPATION_WITH_EVENT_COLUMNS = `
  ${EVENT_PARTICIPANT_COLUMNS},
  event:events(
    ${EVENT_COLUMNS},
    category:activity_categories(${CATEGORY_COLUMNS})
  )
`;

export async function listCategories({ activeOnly = false } = {}) {
  let query = supabase
    .from("activity_categories")
    .select(CATEGORY_COLUMNS)
    .order("name", { ascending: true });
  if (activeOnly) query = query.eq("is_active", true);
  return unwrap(await query) ?? [];
}

export async function createCategory(payload) {
  return unwrap(await supabase
    .from("activity_categories")
    .insert(compact(payload))
    .select(CATEGORY_COLUMNS)
    .single());
}

export async function updateCategory(categoryId, payload) {
  return unwrap(await supabase
    .from("activity_categories")
    .update(compact(payload))
    .eq("id", categoryId)
    .select(CATEGORY_COLUMNS)
    .single());
}

export async function attachEventParticipationSummaries(events) {
  if (!events?.length) return events ?? [];
  const eventIds = [...new Set(events.map((event) => Number(event.id)).filter(Number.isFinite))];
  if (!eventIds.length) return events;
  const summaries = unwrap(await supabase.rpc("get_event_participation_summaries", {
    p_event_ids: eventIds,
  })) ?? [];
  const summaryMap = new Map(summaries.map((summary) => [Number(summary.event_id), summary]));
  return events.map((event) => {
    const summary = summaryMap.get(Number(event.id));
    return {
      ...event,
      joined_count: Number(summary?.joined_count ?? 0),
      waitlisted_count: Number(summary?.waitlisted_count ?? 0),
      my_participation_status: summary?.my_status ?? null,
    };
  });
}

export async function listEvents({
  categoryId = null,
  search = "",
  fromDate = null,
  toDate = null,
  statuses = ["scheduled", "closed"],
  limit = 100,
} = {}) {
  let query = supabase
    .from("events")
    .select(EVENT_WITH_CATEGORY_COLUMNS)
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(limit);
  if (categoryId) query = query.eq("category_id", Number(categoryId));
  if (search.trim()) {
    query = query.textSearch("title", search.trim(), {
      type: "plain",
      config: "simple",
    });
  }
  if (fromDate) query = query.gte("event_date", fromDate);
  if (toDate) query = query.lte("event_date", toDate);
  if (statuses?.length) query = query.in("status", statuses);
  const events = unwrap(await query) ?? [];
  return attachEventParticipationSummaries(events);
}

export async function getEvent(eventId) {
  const event = unwrap(await supabase
    .from("events")
    .select(EVENT_DETAIL_COLUMNS)
    .eq("id", Number(eventId))
    .single());
  const [withSummary] = await attachEventParticipationSummaries([event]);
  return withSummary;
}

export async function createEvent(payload) {
  return unwrap(await supabase
    .from("events")
    .insert(compact(payload))
    .select(EVENT_COLUMNS)
    .single());
}

export async function createRecurringEvent(seriesPayload, occurrencePayloads) {
  return unwrap(await supabase.rpc("create_recurring_event", {
    p_series: compact(seriesPayload),
    p_occurrences: (occurrencePayloads ?? []).map(compact),
  }));
}

export async function updateEvent(eventId, payload) {
  return unwrap(await supabase
    .from("events")
    .update(compact(payload))
    .eq("id", Number(eventId))
    .select(EVENT_COLUMNS)
    .single());
}

export async function joinEvent(eventId) {
  return unwrap(await supabase.rpc("join_event", {
    p_event_id: Number(eventId),
  }));
}

export async function cancelEventParticipation(eventId) {
  return unwrap(await supabase.rpc("cancel_event_participation", {
    p_event_id: Number(eventId),
  }));
}

export async function listEventParticipants(eventId) {
  const participants = unwrap(await supabase
    .from("event_participants")
    .select(EVENT_PARTICIPANT_COLUMNS)
    .eq("event_id", Number(eventId))
    .in("status", ["joined", "waitlisted"])
    .order("joined_at", { ascending: true, nullsFirst: false })
    .order("waitlisted_at", { ascending: true, nullsFirst: false })) ?? [];
  const profiles = await getPublicProfiles(participants.map((participant) => participant.user_id));
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
  return participants.map((participant) => ({
    ...participant,
    profile: profileMap.get(participant.user_id) ?? null,
  }));
}

export async function getMyParticipationOverview({
  upcomingLimit = 20,
  historyLimit = 10,
  historyOffset = 0,
} = {}) {
  const data = unwrap(await supabase.rpc("get_my_participation_overview", {
    p_upcoming_limit: Number(upcomingLimit),
    p_history_limit: Number(historyLimit),
    p_history_offset: Number(historyOffset),
  })) ?? {};
  return {
    summary: {
      upcomingJoinedCount: Number(data.summary?.upcoming_joined_count ?? 0),
      upcomingWaitlistedCount: Number(data.summary?.upcoming_waitlisted_count ?? 0),
      historyCount: Number(data.summary?.history_count ?? 0),
    },
    upcoming: data.upcoming ?? [],
    history: data.history ?? [],
    historyLimit: Number(data.history_limit ?? historyLimit),
    historyOffset: Number(data.history_offset ?? historyOffset),
  };
}

// Backward compatibility for cached pre-P2 mypage modules.
// Current code should use getMyParticipationOverview(); this export remains
// temporarily so older browser module graphs can still link and recover.
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
