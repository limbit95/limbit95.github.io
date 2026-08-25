import { compact, supabase, unwrap } from "./shared.js";

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
