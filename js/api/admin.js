import { listCategories } from "./activities.js";
import { getPublicProfiles } from "./profiles.js";
import { supabase, unwrap } from "./shared.js";

export async function listCategoryManagers() {
  const managers = unwrap(await supabase
    .from("category_managers")
    .select("category_id,user_id,created_at,created_by")
    .order("created_at", { ascending: false })) ?? [];
  const [profiles, categories] = await Promise.all([
    getPublicProfiles(managers.map((manager) => manager.user_id)),
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
