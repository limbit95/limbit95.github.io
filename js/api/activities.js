import { getPublicProfiles } from "./profiles.js";
import { compact, supabase, unwrap } from "./shared.js";

export async function listCategories({ activeOnly = false } = {}) {
  let query = supabase
    .from("activity_categories")
    .select("*")
    .order("name", { ascending: true });
  if (activeOnly) query = query.eq("is_active", true);
  return unwrap(await query) ?? [];
}

export async function createCategory(payload) {
  return unwrap(await supabase
    .from("activity_categories")
    .insert(compact(payload))
    .select()
    .single());
}

export async function updateCategory(categoryId, payload) {
  return unwrap(await supabase
    .from("activity_categories")
    .update(compact(payload))
    .eq("id", categoryId)
    .select()
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
    .select(`
      *,
      category:activity_categories(*)
    `)
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
    .select(`
      *,
      category:activity_categories(*),
      series:event_series(*)
    `)
    .eq("id", Number(eventId))
    .single());
  const [withSummary] = await attachEventParticipationSummaries([event]);
  return withSummary;
}

export async function createEvent(payload) {
  return unwrap(await supabase
    .from("events")
    .insert(compact(payload))
    .select()
    .single());
}

export async function createRecurringEvent(seriesPayload, occurrencePayloads) {
  const series = unwrap(await supabase
    .from("event_series")
    .insert(compact(seriesPayload))
    .select()
    .single());
  try {
    const rows = occurrencePayloads.map((payload) => ({
      ...compact(payload),
      series_id: series.id,
    }));
    const events = unwrap(await supabase
      .from("events")
      .insert(rows)
      .select());
    return { series, events: events ?? [] };
  } catch (error) {
    await supabase
      .from("event_series")
      .update({ status: "cancelled" })
      .eq("id", series.id);
    throw error;
  }
}

export async function updateEvent(eventId, payload) {
  return unwrap(await supabase
    .from("events")
    .update(compact(payload))
    .eq("id", Number(eventId))
    .select()
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
    .select("*")
    .eq("event_id", Number(eventId))
    .in("status", ["joined", "waitlisted"])
    .order("joined_at", { ascending: true, nullsFirst: false })
    .order("waitlisted_at", { ascending: true, nullsFirst: false })) ?? [];
  const profiles = await getPublicProfiles();
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
  return participants.map((participant) => ({
    ...participant,
    profile: profileMap.get(participant.user_id) ?? null,
  }));
}

export async function listMyParticipations(userId) {
  const participations = unwrap(await supabase
    .from("event_participants")
    .select(`
      *,
      event:events(
        *,
        category:activity_categories(*)
      )
    `)
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
