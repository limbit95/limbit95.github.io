import { supabase } from "../supabaseClient.js";

export { supabase };

export function unwrap(result) {
  if (result.error) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:api-error", { detail: result.error }));
    }
    throw result.error;
  }
  return result.data;
}

export function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  );
}
