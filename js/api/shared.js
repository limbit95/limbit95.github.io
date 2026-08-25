import { supabase } from "../supabaseClient.js";

export { supabase };

export function unwrap(result) {
  if (result.error) throw result.error;
  return result.data;
}

export function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  );
}
