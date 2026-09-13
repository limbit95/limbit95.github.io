import { supabase } from "./supabaseClient.js";
import { PROFILE_STATUS } from "./constants.js";
import {
  cleanupPushSubscriptionForSignOut,
  restorePushNotificationsForAuth,
  setPushDesiredAuthContext,
  setPushAuthContextVersion,
  waitForPushRestoreClaims,
} from "./web-push.js";
import { ROLE, canManageActivityFor, hasAdminPermission } from "./permissions.js";

export { canManageActivityFor } from "./permissions.js";

const PROFILE_COLUMNS = "id,display_name,real_name,birth_date,birth_year,bio,avatar_path,role,status,created_at,updated_at,approved_at,approved_by";
const PUSH_SIGN_OUT_CLEANUP_TIMEOUT_MS = 3000;
const SIGNUP_VERIFICATION_SESSION_KEY = "cheongpa:signup-verification-session";
const SIGNUP_VERIFICATION_CHANNEL_NAME = "cheongpa:signup-verification-channel";
const SIGNUP_VERIFICATION_SYNC_TIMEOUT_MS = 200;

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
let signupVerificationChannel = null;

function readSignupVerificationSessionUserId() {
  try {
    return window.sessionStorage?.getItem(SIGNUP_VERIFICATION_SESSION_KEY) ?? null;
  } catch {
    return null;
  }
}

function hasSignupVerificationSession(userId) {
  return Boolean(userId && readSignupVerificationSessionUserId() === userId);
}

function rememberSignupVerificationSession(userId) {
  if (!userId) return;
  try {
    window.sessionStorage?.setItem(SIGNUP_VERIFICATION_SESSION_KEY, userId);
  } catch {
    // A restricted browser storage mode should not prevent email verification itself.
  }
}

function clearSignupVerificationSession() {
  try {
    window.sessionStorage?.removeItem(SIGNUP_VERIFICATION_SESSION_KEY);
  } catch {
    // Ignore storage cleanup failures; the Auth session remains the source of truth.
  }
}

function isPendingNativeSignupSession(session) {
  return Boolean(
    session?.user
    && !state.profile
    && session.user.user_metadata?.signup_flow === "auth_otp",
  );
}

function getSignupVerificationChannel() {
  if (signupVerificationChannel) return signupVerificationChannel;
  if (typeof window.BroadcastChannel !== "function") return null;
  try {
    signupVerificationChannel = new window.BroadcastChannel(SIGNUP_VERIFICATION_CHANNEL_NAME);
    signupVerificationChannel.addEventListener("message", (event) => {
      const message = event.data;
      if (message?.type !== "request" || !message.requestId || !message.userId) return;
      if (state.user?.id !== message.userId) return;
      if (!isPendingNativeSignupSession(state.session)) return;
      if (!hasSignupVerificationSession(message.userId)) return;
      signupVerificationChannel?.postMessage({
        type: "response",
        requestId: message.requestId,
        userId: message.userId,
      });
    });
    return signupVerificationChannel;
  } catch {
    signupVerificationChannel = null;
    return null;
  }
}

async function restoreSignupVerificationSessionFromActiveTab(userId) {
  if (!userId) return false;
  if (hasSignupVerificationSession(userId)) return true;
  const channel = getSignupVerificationChannel();
  if (!channel) return false;
  const requestId = typeof window.crypto?.randomUUID === "function"
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
  return new Promise((resolve) => {
    let settled = false;
    let timeoutId = null;
    const finish = (restored) => {
      if (settled) return;
      settled = true;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      channel.removeEventListener("message", onMessage);
      if (restored) rememberSignupVerificationSession(userId);
      resolve(restored);
    };
    const onMessage = (event) => {
      const message = event.data;
      if (
        message?.type === "response"
        && message.requestId === requestId
        && message.userId === userId
      ) finish(true);
    };
    channel.addEventListener("message", onMessage);
    timeoutId = window.setTimeout(() => finish(false), SIGNUP_VERIFICATION_SYNC_TIMEOUT_MS);
    try {
      channel.postMessage({ type: "request", requestId, userId });
    } catch {
      finish(false);
    }
  });
}

function emit() {
  listeners.forEach((listener) => listener(getAuthState()));
}

export function getAuthState() {
  const hidePendingSignupSession = isPendingNativeSignupSession(state.session)
    && !hasSignupVerificationSession(state.user?.id);
  const visibleSession = hidePendingSignupSession ? null : state.session;
  const visibleUser = hidePendingSignupSession ? null : state.user;
  return {
    ...state,
    session: visibleSession,
    user: visibleUser,
    managerCategoryIds: new Set(state.managerCategoryIds),
    adminPermissions: new Set(state.adminPermissions),
    isAuthenticated: Boolean(visibleUser),
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
  const previousUserId = state.user?.id;
  const previousAccessToken = state.session?.access_token ?? null;
  lifecycleEpoch += 1;
  state.session = null;
  state.user = null;
  state.profile = null;
  state.managerCategoryIds = new Set();
  state.adminPermissions = new Set();
  if (previousUserId) setPushAuthContextVersion(previousUserId, null);
  setPushDesiredAuthContext(null, { previousAccessToken });
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
    managerCategoryIds = new Set(
      (managersResult.data ?? []).map((item) => Number(item.category_id)).filter(Number.isFinite),
    );
  }

  if (epoch !== lifecycleEpoch) return getAuthState();
  const previousUserId = state.user?.id;
  const previousAccessToken = state.session?.access_token ?? null;
  if (previousUserId && previousUserId !== user.id) {
    setPushAuthContextVersion(previousUserId, null);
  }
  state.session = session;
  state.user = user;
  state.profile = profile;
  state.managerCategoryIds = managerCategoryIds;
  state.adminPermissions = new Set(accessResult.data?.[0]?.permissions ?? []);
  setPushAuthContextVersion(user.id, epoch);
  setPushDesiredAuthContext(getAuthState(), {
    previousAccessToken: previousUserId !== user.id ? previousAccessToken : null,
  });
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
    getSignupVerificationChannel();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    await refreshAuthContext(data.session, { force: true });

    if (
      isPendingNativeSignupSession(data.session)
      && !hasSignupVerificationSession(data.session.user.id)
    ) {
      clearSignupVerificationSession();
      if (await restoreSignupVerificationSessionFromActiveTab(data.session.user.id)) emit();
    }

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
          clearSignupVerificationSession();
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

function signupRedirect() {
  return `${window.location.origin}${window.location.pathname}`;
}

async function assertSignupEmailAvailable(email) {
  const { data, error } = await supabase.rpc("get_signup_email_status", { p_email: email });
  if (error) throw error;
  if (data === "registered") {
    const registeredError = new Error("이미 가입되어 있는 이메일입니다.");
    registeredError.code = "signup_email_registered";
    throw registeredError;
  }
}

async function sendSignupEmailCode(email) {
  // Verify ownership of the email first; the user chooses a password only after OTP verification.
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: signupRedirect(),
      shouldCreateUser: true,
      data: { signup_flow: "auth_otp" },
    },
  });
  if (error) throw error;
  if (data.session) await refreshAuthContext(data.session, { force: true });
  return data;
}

export async function requestSignupEmailCode(email) {
  await assertSignupEmailAvailable(email);
  return sendSignupEmailCode(email);
}

export async function resendSignupEmailCode(email) {
  await assertSignupEmailAvailable(email);
  return sendSignupEmailCode(email);
}

export async function verifySignupEmailCode(email, code) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });
  if (error) throw error;
  if (data.session?.user?.id) rememberSignupVerificationSession(data.session.user.id);
  if (data.session) await refreshAuthContext(data.session, { force: true });
  return data;
}

export async function submitSignupApplication(metadata) {
  const { data, error } = await supabase.rpc("submit_join_request", {
    p_display_name: metadata.display_name,
    p_real_name: metadata.real_name,
    p_birth_date: metadata.birth_date,
    p_church_group: metadata.church_group,
    p_request_message: metadata.request_message,
    p_privacy_consent: metadata.privacy_consent,
    p_privacy_policy_version: metadata.privacy_policy_version,
    p_rules_consent: metadata.rules_consent,
    p_community_rules_version: metadata.community_rules_version,
  });
  if (error) throw error;
  clearSignupVerificationSession();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (sessionData.session) await refreshAuthContext(sessionData.session, { force: true });
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

async function cleanupPushBeforeSignOut(userId, accessToken, timeoutMs = PUSH_SIGN_OUT_CLEANUP_TIMEOUT_MS) {
  let timeoutId = null;
  let cleanupActive = true;
  const cleanupEpoch = lifecycleEpoch;
  const isActive = () => cleanupActive
    && cleanupEpoch === lifecycleEpoch
    && (!state.user?.id || state.user.id === userId);
  const cleanupPromise = cleanupPushSubscriptionForSignOut(userId, { accessToken, isActive })
    .then(() => true)
    .catch((error) => {
      console.warn("Push subscription cleanup failed during sign-out.", error);
      return true;
    });
  const completed = await Promise.race([
    cleanupPromise,
    new Promise((resolve) => {
      timeoutId = window.setTimeout(() => resolve(false), timeoutMs);
    }),
  ]);
  if (timeoutId !== null) window.clearTimeout(timeoutId);
  if (!completed) cleanupActive = false;
  return completed;
}

export async function signOut() {
  const userId = state.user?.id;
  const accessToken = state.session?.access_token ?? null;
  lifecycleEpoch += 1;
  const claimsCompleted = await waitForPushRestoreClaims(userId);
  if (!claimsCompleted) {
    console.warn("Timed out waiting for Push subscription restore during sign-out.");
  }
  const cleanupCompleted = await cleanupPushBeforeSignOut(userId, accessToken);
  if (!cleanupCompleted) {
    console.warn("Timed out cleaning up Push subscription during sign-out.");
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  clearSignupVerificationSession();
  if (state.user || state.session) clearAuthContext();
}

export function canManageCategory(categoryId) {
  const auth = getAuthState();
  return hasAdminPermission(auth, "community") || auth.managerCategoryIds.has(Number(categoryId));
}

export function canManageActivity(event) {
  return canManageActivityFor(getAuthState(), event);
}

export function destroyAuth() {
  authSubscription?.unsubscribe();
  authSubscription = null;
  signupVerificationChannel?.close();
  signupVerificationChannel = null;
  state.initialized = false;
}
