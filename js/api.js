import { supabase } from "./supabaseClient.js";
import { AVATAR_BUCKET } from "./constants.js";

function unwrap(result) {
  if (result.error) throw result.error;
  return result.data;
}

function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  );
}

const avatarUrlCache = new Map();

export async function getSignedAvatarUrl(path, expiresIn = 3600) {
  if (!path) return "./assets/images/default-avatar.svg";
  const cached = avatarUrlCache.get(path);
  if (cached && cached.expiresAt > Date.now()) return cached.url;
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) return "./assets/images/default-avatar.svg";
  avatarUrlCache.set(path, {
    url: data.signedUrl,
    expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1000,
  });
  return data.signedUrl;
}

export async function getPublicProfiles(userId = null) {
  const data = unwrap(await supabase.rpc("get_public_member_profiles", {
    p_user_id: userId,
  }));
  return data ?? [];
}

export async function attachPublicProfiles(rows, idKey = "author_id", resultKey = "author") {
  if (!rows?.length) return rows ?? [];
  const profiles = await getPublicProfiles();
  const byId = new Map(profiles.map((profile) => [profile.id, profile]));
  return rows.map((row) => ({ ...row, [resultKey]: byId.get(row[idKey]) ?? null }));
}

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

export async function listCategoryManagers() {
  const managers = unwrap(await supabase
    .from("category_managers")
    .select("category_id,user_id,created_at,created_by")
    .order("created_at", { ascending: false })) ?? [];
  const [profiles, categories] = await Promise.all([
    getPublicProfiles(),
    listCategories(),
  ]);
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
  const categoryMap = new Map(categories.map((category) => [Number(category.id), category]));
  return managers.map((manager) => ({
    ...manager,
    profile: profileMap.get(manager.user_id) ?? null,
    category: categoryMap.get(Number(manager.category_id)) ?? null,
  }));
}

export async function setCategoryManager(userId, categoryId, enabled) {
  return unwrap(await supabase.rpc("admin_set_category_manager", {
    p_user_id: userId,
    p_category_id: Number(categoryId),
    p_enabled: Boolean(enabled),
  }));
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

export async function listPosts({
  boardType,
  search = "",
  page = 1,
  pageSize = 12,
} = {}) {
  const offset = (page - 1) * pageSize;
  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("board_type", boardType)
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);
  if (search.trim()) {
    query = query.textSearch("title", search.trim(), {
      type: "plain",
      config: "simple",
    });
  }
  const { data, error, count } = await query;
  if (error) throw error;
  return {
    rows: await attachPublicProfiles(data ?? []),
    count: count ?? 0,
  };
}

export async function getPost(postId) {
  const post = unwrap(await supabase
    .from("posts")
    .select("*")
    .eq("id", Number(postId))
    .single());
  const [withAuthor] = await attachPublicProfiles([post]);
  return withAuthor;
}

export async function incrementPostView(postId) {
  return unwrap(await supabase.rpc("increment_post_view", {
    p_post_id: Number(postId),
  }));
}

export async function createPost(payload) {
  return unwrap(await supabase
    .from("posts")
    .insert(compact(payload))
    .select()
    .single());
}

export async function updatePost(postId, payload) {
  return unwrap(await supabase
    .from("posts")
    .update(compact(payload))
    .eq("id", Number(postId))
    .select()
    .single());
}

export async function deletePost(postId) {
  unwrap(await supabase.from("posts").delete().eq("id", Number(postId)));
}

export async function listComments(targetType, targetId) {
  const rows = unwrap(await supabase
    .from("comments")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_id", Number(targetId))
    .eq("status", "published")
    .order("created_at", { ascending: true })) ?? [];
  return attachPublicProfiles(rows);
}

export async function createComment(payload) {
  return unwrap(await supabase
    .from("comments")
    .insert(compact(payload))
    .select()
    .single());
}

export async function updateComment(commentId, content) {
  return unwrap(await supabase
    .from("comments")
    .update({ content })
    .eq("id", Number(commentId))
    .select()
    .single());
}

export async function deleteComment(commentId) {
  unwrap(await supabase.from("comments").delete().eq("id", Number(commentId)));
}

export async function getProfileInterests(userId) {
  return unwrap(await supabase
    .from("profile_interests")
    .select("user_id,category_id,category:activity_categories(*)")
    .eq("user_id", userId)) ?? [];
}

export async function updateProfile(userId, payload) {
  return unwrap(await supabase
    .from("profiles")
    .update(compact(payload))
    .eq("id", userId)
    .select()
    .single());
}

export async function replaceProfileInterests(userId, categoryIds) {
  const { error: deleteError } = await supabase
    .from("profile_interests")
    .delete()
    .eq("user_id", userId);
  if (deleteError) throw deleteError;
  if (!categoryIds.length) return [];
  return unwrap(await supabase
    .from("profile_interests")
    .insert(categoryIds.map((categoryId) => ({
      user_id: userId,
      category_id: Number(categoryId),
    })))
    .select()) ?? [];
}

export async function uploadAvatar(userId, file, previousPath = null) {
  const extensionMap = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensionMap[file.type] ?? "bin";
  const path = `${userId}/profile-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, {
      upsert: false,
      cacheControl: "3600",
      contentType: file.type,
    });
  if (uploadError) throw uploadError;

  try {
    await updateProfile(userId, { avatar_path: path });
    if (previousPath && previousPath !== path) {
      await supabase.storage.from(AVATAR_BUCKET).remove([previousPath]);
      avatarUrlCache.delete(previousPath);
    }
    return path;
  } catch (error) {
    await supabase.storage.from(AVATAR_BUCKET).remove([path]);
    throw error;
  }
}

export async function getMyJoinRequest(userId) {
  return unwrap(await supabase
    .from("join_requests")
    .select("*")
    .eq("user_id", userId)
    .single());
}

export async function listJoinRequests(status = "pending") {
  let query = supabase
    .from("join_requests")
    .select("*")
    .order("requested_at", { ascending: true });
  if (status !== "all") query = query.eq("status", status);
  const requests = unwrap(await query) ?? [];
  if (!requests.length) return [];
  const profiles = unwrap(await supabase
    .from("profiles")
    .select("*")
    .in("id", requests.map((request) => request.user_id))) ?? [];
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
  return requests.map((request) => ({
    ...request,
    profile: profileMap.get(request.user_id) ?? null,
  }));
}

export async function approveJoinRequest(userId, adminNote = null) {
  return unwrap(await supabase.rpc("admin_approve_join_request", {
    p_user_id: userId,
    p_admin_note: adminNote || null,
  }));
}

export async function reviewJoinRequest(userId, decision, adminNote = null) {
  return unwrap(await supabase.rpc("admin_review_join_request", {
    p_user_id: userId,
    p_decision: decision,
    p_admin_note: adminNote || null,
  }));
}

export async function listMembers() {
  const [profiles, requests] = await Promise.all([
    unwrap(await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })) ?? [],
    unwrap(await supabase
      .from("join_requests")
      .select("user_id,email,real_name,church_group,status")) ?? [],
  ]);
  const requestMap = new Map(requests.map((request) => [request.user_id, request]));
  return profiles.map((profile) => ({
    ...profile,
    join_request: requestMap.get(profile.id) ?? null,
  }));
}

export async function setMemberRole(userId, role) {
  return unwrap(await supabase.rpc("admin_set_member_role", {
    p_user_id: userId,
    p_role: role,
  }));
}

export async function setMemberStatus(userId, status) {
  return unwrap(await supabase.rpc("admin_set_member_status", {
    p_user_id: userId,
    p_status: status,
  }));
}

export async function listDatePolls({ categoryId = null, status = null } = {}) {
  let query = supabase
    .from("date_polls")
    .select(`
      *,
      category:activity_categories(*),
      options:date_poll_options(
        *,
        votes:date_poll_votes(poll_id,option_id,user_id,created_at)
      )
    `)
    .order("created_at", { ascending: false });
  if (categoryId) query = query.eq("category_id", Number(categoryId));
  if (status) query = query.eq("status", status);
  return unwrap(await query) ?? [];
}

export async function createDatePoll(pollPayload, options) {
  const poll = unwrap(await supabase
    .from("date_polls")
    .insert(compact(pollPayload))
    .select()
    .single());
  try {
    const createdOptions = unwrap(await supabase
      .from("date_poll_options")
      .insert(options.map((option) => ({
        poll_id: poll.id,
        option_start: option.option_start,
        option_end: option.option_end || null,
        label: option.label || null,
      })))
      .select()) ?? [];
    return { ...poll, options: createdOptions };
  } catch (error) {
    await supabase.from("date_polls").delete().eq("id", poll.id);
    throw error;
  }
}

export async function replaceDatePollVotes(poll, userId, optionIds) {
  const previousVotes = (poll.options ?? [])
    .flatMap((option) => option.votes ?? [])
    .filter((vote) => vote.user_id === userId);
  const previousOptionIds = previousVotes.map((vote) => Number(vote.option_id));
  const { error: deleteError } = await supabase
    .from("date_poll_votes")
    .delete()
    .eq("poll_id", Number(poll.id))
    .eq("user_id", userId);
  if (deleteError) throw deleteError;

  if (!optionIds.length) return [];
  try {
    return unwrap(await supabase
      .from("date_poll_votes")
      .insert(optionIds.map((optionId) => ({
        poll_id: Number(poll.id),
        option_id: Number(optionId),
        user_id: userId,
      })))
      .select()) ?? [];
  } catch (error) {
    if (previousOptionIds.length) {
      await supabase.from("date_poll_votes").insert(previousOptionIds.map((optionId) => ({
        poll_id: Number(poll.id),
        option_id: optionId,
        user_id: userId,
      })));
    }
    throw error;
  }
}

export async function closeDatePoll(pollId, selectedOptionId) {
  return unwrap(await supabase
    .from("date_polls")
    .update({
      status: "closed",
      selected_option_id: Number(selectedOptionId),
    })
    .eq("id", Number(pollId))
    .select()
    .single());
}

export async function cancelDatePoll(pollId) {
  return unwrap(await supabase
    .from("date_polls")
    .update({ status: "cancelled" })
    .eq("id", Number(pollId))
    .select()
    .single());
}

export async function listNotifications(limit = 20) {
  return unwrap(await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)) ?? [];
}

export async function markNotificationRead(notificationId) {
  return unwrap(await supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("id", Number(notificationId))
    .select()
    .single());
}

export async function markAllNotificationsRead() {
  return unwrap(await supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("is_read", false)
    .select()) ?? [];
}
