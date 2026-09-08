import { supabase } from "./supabaseClient.js";
import { PROFILE_STATUS } from "./constants.js";
import {
  cleanupPushSubscriptionForSignOut,
  restorePushNotificationsForAuth,
} from "./web-push.js";
import { ROLE, hasAdminPermission } from "./permissions.js";

const PROFILE_COLUMNS = "id,display_name,birth_year,age_visibility,bio,avatar_path,role,status,created_at,updated_at,approved_at,approved_by";

const state = {
  session: null,
  user: null,
  profile: null,
  managerCategoryIds: new Set(),
  adminPermissions: new Set(),
  initialized: false,
};

const listeners = new Set();
let authSubscription = null;
let initializePromise = null;
let refreshQueue = Promise.resolve();
let lifecycleEpoch = 0;

function emit() {
  listeners.forEach((listener) => listener(getAuthState()));
}

export function getAuthState() {
  return {
    ...state,
    managerCategoryIds: new Set(state.managerCategoryIds),
    adminPermissions: new Set(state.adminPermissions),
    isAuthenticated: Boolean(state.user),
    isApproved: state.profile?.status === PROFILE_STATUS.APPROVED,
    isAdmin: [ROLE.ADMIN, ROLE.SYSTEM_ADMIN].includes(state.profile?.role) && state.profile?.status === PROFILE_STATUS.APPROVED,
    isSystemAdmin: state.profile?.role === ROLE.SYSTEM_ADMIN && state.profile?.status === PROFILE_STATUS.APPROVED,
  };
}

export function subscribeAuth(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function clearAuthContext({ notify = true } = {}) {
  lifecycleEpoch += 1;
  state.session = null;
  state.user = null;
  state.profile = null;
  state.managerCategoryIds = new Set();
  state.adminPermissions = new Set();
  if (notify) emit();
}

async function loadAuthContext(session, { force, epoch }) {
  if (epoch !== lifecycleEpoch) return getAuthState();
  const user = session?.user ?? null;
  if (!user) {
    clearAuthContext();
    return getAuthState();
  }

  const sameSession = state.user?.id === user.id
    && state.session?.access_token === session.access_token
    && state.profile;
  if (!force && sameSession) {
    state.session = session;
    state.user = user;
    emit();
    return getAuthState();
  }

  const [profileResult, managersResult, accessResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", user.id)
      .single(),
    supabase
      .from("category_managers")
      .select("category_id")
      .eq("user_id", user.id),
    supabase.rpc("get_my_admin_access"),
  ]);

  if (profileResult.error && profileResult.error.code !== "PGRST116") throw profileResult.error;
  if (managersResult.error) throw managersResult.error;
  if (accessResult.error && accessResult.error.code !== "PGRST202") throw accessResult.error;

  const profile = profileResult.data ?? null;
  let managerCategoryIds = new Set();
  if (profile?.status === PROFILE_STATUS.APPROVED) {
    const assignedIds = [...new Set(
      (managersResult.data ?? []).map((item) => Number(item.category_id)).filter(Number.isFinite),
    )];
    if (assignedIds.length) {
      const { data: activeCategories, error: categoryError } = await supabase
        .from("activity_categories")
        .select("id")
        .in("id", assignedIds)
        .eq("is_active", true);
      if (categoryError) throw categoryError;
      managerCategoryIds = new Set(
        (activeCategories ?? []).map((category) => Number(category.id)),
      );
    }
  }

  if (epoch !== lifecycleEpoch) return getAuthState();
  state.session = session;
  state.user = user;
  state.profile = profile;
  state.managerCategoryIds = managerCategoryIds;
  state.adminPermissions = new Set(accessResult.data?.[0]?.permissions ?? []);
  emit();
  const restoreEpoch = lifecycleEpoch;
  void restorePushNotificationsForAuth(getAuthState(), {
    isCurrent: () => restoreEpoch === lifecycleEpoch && state.user?.id === user.id,
    getCurrentUserId: () => state.user?.id ?? null,
  }).catch((error) => {
    console.warn("Push subscription restore failed after authentication.", error);
  });
  return getAuthState();
}

export function refreshAuthContext(session = state.session, { force = true } = {}) {
  const epoch = lifecycleEpoch;
  const run = () => loadAuthContext(session, { force, epoch });
  const result = refreshQueue.then(run, run);
  refreshQueue = result.catch(() => {});
  return result;
}

export async function initializeAuth() {
  if (state.initialized) return Promise.resolve(getAuthState());
  if (initializePromise) return initializePromise;
  initializePromise = (async () => {
    if (!supabase) return getAuthState();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    await refreshAuthContext(data.session, { force: true });

    if (!authSubscription) {
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "TOKEN_REFRESHED") {
          state.session = session;
          state.user = session?.user ?? null;
          emit();
          return;
        }
        if (event === "INITIAL_SESSION") {
          state.session = session;
          state.user = session?.user ?? null;
          return;
        }
        if (event === "SIGNED_OUT") {
          clearAuthContext();
          window.dispatchEvent(new CustomEvent("app:auth-changed", { detail: { event } }));
          return;
        }
        const sameUser = Boolean(state.user?.id && state.user.id === session?.user?.id);
        window.setTimeout(async () => {
          try {
            await refreshAuthContext(session, {
              force: event === "USER_UPDATED",
            });
            if (event === "SIGNED_IN" && sameUser) return;
            window.dispatchEvent(new CustomEvent("app:auth-changed", {
              detail: { event, sameUser },
            }));
          } catch (authError) {
            window.dispatchEvent(new CustomEvent("app:error", { detail: authError }));
          }
        }, 0);
      });
      authSubscription = listener.subscription;
    }
    state.initialized = true;
    return getAuthState();
  })();
  try {
    return await initializePromise;
  } finally {
    initializePromise = null;
  }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  await refreshAuthContext(data.session, { force: true });
  return data;
}

export async function signUp({ email, password, metadata }) {
  const redirect = `${window.location.origin}${window.location.pathname}`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirect,
      data: metadata,
    },
  });
  if (error) throw error;
  if (data.session) await refreshAuthContext(data.session, { force: true });
  return data;
}

export async function verifyEmailToken(tokenHash, type = "email") {
  const otpType = ["email", "signup"].includes(type) ? type : "email";
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: otpType,
  });
  if (error) throw error;
  if (data.session) await refreshAuthContext(data.session, { force: true });
  return data;
}

export async function requestPasswordReset(email) {
  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) throw error;
  return data;
}

export async function verifyRecoveryToken(tokenHash) {
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "recovery",
  });
  if (error) throw error;
  if (data.session) await refreshAuthContext(data.session, { force: true });
  return data;
}

export async function updatePassword(password) {
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const userId = state.user?.id;
  lifecycleEpoch += 1;
  try {
    await cleanupPushSubscriptionForSignOut(userId);
  } catch (error) {
    console.warn("Push subscription cleanup failed during sign-out.", error);
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  if (state.user || state.session) clearAuthContext();
}

export function canManageCategory(categoryId) {
  const auth = getAuthState();
  return hasAdminPermission(auth, "community") || auth.managerCategoryIds.has(Number(categoryId));
}

export function destroyAuth() {
  authSubscription?.unsubscribe();
  authSubscription = null;
  state.initialized = false;
}
