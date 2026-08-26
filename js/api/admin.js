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
    .select("user_id,email,real_name,church_group,request_message,status,admin_note,privacy_consent_at,privacy_policy_version,requested_at,reviewed_at,reviewed_by,updated_at")
    .eq("user_id", userId)
    .single());
}

export async function listJoinRequests(status = "pending") {
  let query = supabase
    .from("join_requests")
    .select("user_id,email,real_name,church_group,request_message,status,admin_note,privacy_consent_at,privacy_policy_version,requested_at,reviewed_at,reviewed_by,updated_at")
    .order("requested_at", { ascending: true });
  if (status !== "all") query = query.eq("status", status);
  const requests = unwrap(await query) ?? [];
  if (!requests.length) return [];
  const profiles = unwrap(await supabase
    .from("profiles")
    .select("id,display_name,birth_year,age_visibility,bio,avatar_path,role,status,created_at,updated_at,approved_at,approved_by")
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

export async function listMembers({ search = "", page = 1, pageSize = 20 } = {}) {
  const safePageSize = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * safePageSize;
  const rows = unwrap(await supabase.rpc("admin_list_members_page", {
    p_search: search.trim() || null,
    p_limit: safePageSize,
    p_offset: offset,
  })) ?? [];
  const total = Number(rows[0]?.total_count ?? 0);
  const items = rows.map((row) => ({
    id: row.id,
    display_name: row.display_name,
    role: row.role,
    status: row.status,
    created_at: row.created_at,
    join_request: row.email || row.real_name || row.church_group || row.join_request_status
      ? {
          email: row.email,
          real_name: row.real_name,
          church_group: row.church_group,
          status: row.join_request_status,
        }
      : null,
  }));
  return {
    items,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.max(1, Math.ceil(total / safePageSize)),
  };
}

export async function listAllMembers({ search = "" } = {}) {
  const items = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await listMembers({ search, page, pageSize: 100 });
    items.push(...result.items);
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages);

  return items;
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
