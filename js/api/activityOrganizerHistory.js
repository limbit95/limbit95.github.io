import { supabase, unwrap } from "./shared.js";

export async function listEventOrganizerHistory(eventId) {
  return unwrap(await supabase.rpc("list_event_organizer_history", {
    p_event_id: Number(eventId),
  })) ?? [];
}
