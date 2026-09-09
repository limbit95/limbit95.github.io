import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
  WEB_PUSH_VAPID_PUBLIC_KEY,
} from "./config.js";
import { supabase } from "./supabaseClient.js";

const SERVICE_WORKER_PATH = "./push-service-worker.js";
const SERVICE_WORKER_SCOPE = "./";
const PUSH_PREFERENCE_PREFIX = "cheongpa:web-push-preference:";
const PUSH_AUTH_CHANGED_MESSAGE = "로그인 상태가 변경되었습니다. 다시 시도해 주세요.";
const restorePromises = new Map();
const restoredUserIds = new Set();
const inFlightOwnershipClaims = new Map();
const authContextVersions = new Map();
let pushMutationQueue = Promise.resolve();
const PUSH_MUTATION_TIMEOUT_MS = globalThis.__WEB_PUSH_MUTATION_TIMEOUT_MS ?? 15000;
const PUSH_RECONCILE_MAX_RETRIES = 2;
const PUSH_RECONCILE_RETRY_BASE_MS = globalThis.__WEB_PUSH_RECONCILE_RETRY_BASE_MS ?? 25;
let reconcileScheduled = null;
let lastKnownPushSubscription = null;
// Authority order: current auth lifecycle, latest explicit intent, persisted
// preference, then observed browser/DB state. Observed state never becomes the
// desired state except for the guarded one-time legacy migration.
let currentPushAuthContext = {
  userId: null, contextVersion: null, approved: false, eligible: false, preference: "off",
};
let explicitPushIntent = null;
const pendingOwnershipCleanups = new Map();
const reconcileRetries = new Map();
const reconcileRetryRuns = new Map();
let ownershipClaimSequence = 0;
let reconcileRunning = null;
let reconcileFollowUp = null;
let desiredPushState = { revision: 0, userId: null, contextVersion: null, preference: "off" };

// Device state is shared by every account. All subscription/ownership writes
// therefore pass through this queue; a rejected operation must not poison it.
function enqueuePushMutation(operation, { reconcileLate = true, reconcileRevision = null } = {}) {
  const authorityRevision = reconcileRevision ?? desiredPushState.revision;
  const run = async () => {
    let timeoutId;
    let timedOut = false;
    const work = Promise.resolve().then(operation);
    // A lease bounds the queue, not the underlying browser/network operation.
    // When that operation eventually settles it may have changed device state,
    // so convergence is scheduled again from the latest authoritative intent.
    work.finally(() => {
      if (!timedOut || !reconcileLate) return;
      if (authorityRevision === desiredPushState.revision) {
        schedulePushReconcile(authorityRevision, true, { preserveAfterRunning: true });
      } else {
        // Do not retry stale authority. Its late side effects must instead get
        // one unbudgeted pass under the latest authority revision.
        schedulePushReconcile(desiredPushState.revision, false, { preserveAfterRunning: true });
      }
    }).catch(() => {});
    return Promise.race([
      work,
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          timedOut = true;
          reject(new Error("Push mutation timed out."));
        }, PUSH_MUTATION_TIMEOUT_MS);
      }),
    ]).finally(() => clearTimeout(timeoutId));
  };
  const result = pushMutationQueue.then(run, run);
  pushMutationQueue = result.catch(() => {});
  return result;
}

function updateDesiredPushState(userId, preference) {
  const normalizedUserId = userId ?? null;
  const contextVersion = normalizedUserId ? authContextVersions.get(normalizedUserId) : null;
  if (desiredPushState.userId === normalizedUserId
    && desiredPushState.contextVersion === contextVersion
    && desiredPushState.preference === preference) return desiredPushState;
  desiredPushState = {
    revision: desiredPushState.revision + 1,
    userId: normalizedUserId,
    contextVersion,
    preference,
  };
  reconcileRetries.clear();
  reconcileRetryRuns.clear();
  return desiredPushState;
}

function resolveDesiredPushState() {
  const auth = currentPushAuthContext;
  let preference = "off";
  if (auth.userId && auth.eligible) {
    preference = explicitPushIntent?.userId === auth.userId
      ? explicitPushIntent.preference
      : auth.preference;
  }
  return updateDesiredPushState(auth.userId, preference);
}

function addCleanupObligation(userId, accessToken) {
  if (!userId || !accessToken) return;
  const existing = pendingOwnershipCleanups.get(userId);
  pendingOwnershipCleanups.set(userId, {
    userId,
    accessToken,
    contextVersion: authContextVersions.get(userId) ?? null,
    // Claims issued through this sequence predate the cleanup authority and
    // may recreate ownership after the first removal has completed.
    claimWatermark: Math.max(existing?.claimWatermark ?? 0, ownershipClaimSequence),
  });
}

async function reconcilePendingOwnershipCleanups(subscription) {
  if (!subscription) return [];
  const errors = [];
  const completed = [];
  for (const [userId, cleanup] of [...pendingOwnershipCleanups]) {
    const staleClaimsAtStart = [...(inFlightOwnershipClaims.get(userId) ?? [])]
      .some((claim) => claim.sequence <= cleanup.claimWatermark);
    try {
      await removeSubscriptionWithAccessToken(subscription, cleanup.accessToken);
    } catch (error) {
      errors.push(error);
      continue;
    }
    const staleClaimsStillPending = [...(inFlightOwnershipClaims.get(userId) ?? [])]
      .some((claim) => claim.sequence <= cleanup.claimWatermark);
    // If a stale claim existed when removal started, it may have recreated
    // ownership while the cleanup request was in flight. Keep the credential
    // until a later pass succeeds after every stale claim has settled.
    if (!staleClaimsAtStart && !staleClaimsStillPending) completed.push(cleanup);
  }
  if (errors.length) throw errors[0];
  return completed;
}

function finishOwnershipCleanups(cleanups) {
  for (const cleanup of cleanups) {
    const current = pendingOwnershipCleanups.get(cleanup.userId);
    const staleClaims = [...(inFlightOwnershipClaims.get(cleanup.userId) ?? [])]
      .some((claim) => claim.sequence <= cleanup.claimWatermark);
    if (current === cleanup && !staleClaims) pendingOwnershipCleanups.delete(cleanup.userId);
  }
}

function scheduleLatestPushReconcile() {
  schedulePushReconcile(desiredPushState.revision, false, { preserveAfterRunning: true });
}

async function reconcileDesiredPushState() {
  const desired = desiredPushState;
  const subscription = await getCurrentPushSubscription();
  if (!isDesired(desired)) return false;

  let cleanupError = null;
  let completedCleanups = [];
  try {
    completedCleanups = await reconcilePendingOwnershipCleanups(subscription ?? lastKnownPushSubscription);
  } catch (error) {
    cleanupError = error;
  }
  if (!isDesired(desired)) return false;

  // A missing legacy preference is unresolved, not an OFF decision. Account
  // cleanup is safe above, but browser subscription destruction must wait for
  // the ownership lookup performed by automatic restore.
  if (desired.preference === "unknown") {
    if (cleanupError) throw cleanupError;
    finishOwnershipCleanups(completedCleanups);
    return true;
  }

  if (desired.preference === "on" && desired.userId) {
    const currentRegistration = await registration();
    if (!isDesired(desired)) return false;
    let current = subscription;
    if (!current) {
      current = await currentRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey(WEB_PUSH_VAPID_PUBLIC_KEY),
      });
      if (!isDesired(desired)) {
        scheduleLatestPushReconcile();
        return false;
      }
    }
    if (!isDesired(desired)) return false;
    await claimSubscription(desired.userId, desired.contextVersion, current);
    if (!isDesired(desired)) return false;
    setPushPreference(desired.userId, "on");
    restoredUserIds.add(desired.userId);
    if (cleanupError) throw cleanupError;
    finishOwnershipCleanups(completedCleanups);
    return true;
  }

  const cleanupSubscription = subscription ?? lastKnownPushSubscription;
  if (!cleanupSubscription) {
    if (cleanupError) throw cleanupError;
    finishOwnershipCleanups(completedCleanups);
    return true;
  }
  let removalError = null;
  try {
    const { error } = await supabase.rpc("remove_own_push_subscription", {
      p_endpoint: cleanupSubscription.endpoint,
    });
    if (error) throw error;
  } catch (error) {
    removalError = error;
  }
  let unsubscribeError = null;
  if (subscription && isDesired(desired)) {
    try {
      await subscription.unsubscribe();
    } catch (error) {
      unsubscribeError = error;
    }
  }
  if (cleanupError) throw cleanupError;
  if (removalError) throw removalError;
  if (unsubscribeError) throw unsubscribeError;
  finishOwnershipCleanups(completedCleanups);
  return isDesired(desired);
}

function schedulePushReconcile(
  revision = desiredPushState.revision,
  isRetry = false,
  { preserveAfterRunning = false } = {},
) {
  if (revision !== desiredPushState.revision) return;
  // A scheduled pass already represents this revision. Coalesce before
  // charging retry budget. If a potentially mutating late completion arrives
  // while a pass is already running, preserve one follow-up pass instead of
  // dropping the convergence signal.
  if (reconcileScheduled?.revision === revision) return;
  if (reconcileRunning?.revision === revision) {
    if (preserveAfterRunning) {
      if (reconcileFollowUp?.revision !== revision) {
        reconcileFollowUp = { revision, isRetry };
      } else if (!isRetry) {
        // An unbudgeted latest-authority repair is stronger than a retry.
        reconcileFollowUp.isRetry = false;
      }
    }
    return;
  }
  const retryCount = reconcileRetries.get(revision) ?? 0;
  if (isRetry && retryCount >= PUSH_RECONCILE_MAX_RETRIES) return;
  if (isRetry) reconcileRetries.set(revision, retryCount + 1);
  if (reconcileScheduled) clearTimeout(reconcileScheduled.timeoutId);
  const delayMs = isRetry ? PUSH_RECONCILE_RETRY_BASE_MS * (2 ** retryCount) : 0;
  const scheduled = { revision, timeoutId: null };
  scheduled.timeoutId = setTimeout(() => {
    if (reconcileScheduled === scheduled) reconcileScheduled = null;
    if (revision !== desiredPushState.revision) return;
    const running = { revision, isRetry };
    reconcileRunning = running;
    if (isRetry) reconcileRetryRuns.set(revision, (reconcileRetryRuns.get(revision) ?? 0) + 1);
    enqueuePushMutation(reconcileDesiredPushState, {
      reconcileLate: true,
      reconcileRevision: revision,
    }).finally(() => {
      if (reconcileRunning === running) reconcileRunning = null;
      const followUp = reconcileFollowUp;
      if (followUp?.revision === desiredPushState.revision) {
        reconcileFollowUp = null;
        schedulePushReconcile(followUp.revision, followUp.isRetry);
      } else if (followUp && followUp.revision !== desiredPushState.revision) {
        reconcileFollowUp = null;
      }
    }).catch((error) => {
      if (error?.message !== "Push mutation timed out.") {
        console.warn("Push state reconciliation failed.", error);
      }
      schedulePushReconcile(revision, true);
    });
  }, delayMs);
  reconcileScheduled = scheduled;
}

export function setPushDesiredAuthContext(auth, { previousAccessToken = null } = {}) {
  const userId = auth?.user?.id ?? null;
  const previousUserId = currentPushAuthContext.userId;
  if (previousUserId && previousUserId !== userId) {
    addCleanupObligation(previousUserId, previousAccessToken);
    if (explicitPushIntent?.userId === previousUserId) explicitPushIntent = null;
  }
  const capability = getPushCapability();
  const eligible = Boolean(userId
    && auth?.profile?.status === "approved"
    && capability.supported
    && !capability.requiresIosInstall
    && capability.permission === "granted"
    && WEB_PUSH_VAPID_PUBLIC_KEY
    && !WEB_PUSH_VAPID_PUBLIC_KEY.startsWith("YOUR_"));
  currentPushAuthContext = {
    userId,
    contextVersion: userId ? authContextVersions.get(userId) ?? null : null,
    approved: auth?.profile?.status === "approved",
    eligible,
    preference: userId ? (getPushPreference(userId) ?? "unknown") : "off",
  };
  const desired = resolveDesiredPushState();
  schedulePushReconcile();
  return desired;
}

function isDesired(snapshot) {
  return desiredPushState.revision === snapshot.revision
    && desiredPushState.userId === snapshot.userId
    && desiredPushState.contextVersion === snapshot.contextVersion
    && desiredPushState.preference === snapshot.preference;
}

function captureExplicitAuthContext(userId) {
  if (!userId || currentPushAuthContext.userId !== userId) {
    throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
  }
  return {
    userId,
    contextVersion: currentPushAuthContext.contextVersion,
  };
}

function isExplicitAuthContextCurrent(snapshot) {
  return Boolean(snapshot
    && currentPushAuthContext.userId === snapshot.userId
    && currentPushAuthContext.contextVersion === snapshot.contextVersion
    && (authContextVersions.get(snapshot.userId) ?? null) === snapshot.contextVersion);
}

function assertExplicitAuthContextCurrent(snapshot) {
  if (!isExplicitAuthContextCurrent(snapshot)) throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
}

function beginExplicitPushIntent(userId, preference) {
  explicitPushIntent = {
    userId,
    preference,
    contextVersion: authContextVersions.get(userId) ?? null,
  };
  return resolveDesiredPushState();
}

function finishExplicitPushIntent(intent, succeeded) {
  if (explicitPushIntent?.userId !== intent.userId
    || explicitPushIntent?.contextVersion !== intent.contextVersion
    || explicitPushIntent?.preference !== intent.preference) return;
  if (succeeded && currentPushAuthContext.userId === intent.userId) {
    currentPushAuthContext.preference = intent.preference;
  }
  explicitPushIntent = null;
  resolveDesiredPushState();
}

function preferenceKey(userId) {
  return `${PUSH_PREFERENCE_PREFIX}${userId}`;
}

export function getPushPreference(userId) {
  if (!userId) return null;
  try {
    const value = window.localStorage.getItem(preferenceKey(userId));
    return value === "on" || value === "off" ? value : null;
  } catch (error) {
    console.warn("Push preference could not be read.", error);
    return null;
  }
}

function setPushPreference(userId, value) {
  if (!userId) return false;
  try {
    window.localStorage.setItem(preferenceKey(userId), value);
    return true;
  } catch (error) {
    console.warn("Push preference could not be saved.", error);
    return false;
  }
}

export function setPushAuthContextVersion(userId, version) {
  if (!userId) return;
  if (version === null || version === undefined) {
    authContextVersions.delete(userId);
    return;
  }
  authContextVersions.set(userId, version);
}

export function getPushCoordinatorSnapshot() {
  return {
    authContext: { ...currentPushAuthContext },
    explicitIntent: explicitPushIntent ? { ...explicitPushIntent } : null,
    desiredState: { ...desiredPushState },
    pendingCleanupUserIds: [...pendingOwnershipCleanups.keys()],
    inFlightOwnershipClaims: [...inFlightOwnershipClaims.entries()].flatMap(([userId, claims]) => (
      [...claims].map((claim) => ({
        userId, contextVersion: claim.contextVersion, endpoint: claim.endpoint, sequence: claim.sequence,
      }))
    )),
    cleanupObligations: [...pendingOwnershipCleanups.values()].map(({ userId, contextVersion, claimWatermark }) => ({
      userId, contextVersion, claimWatermark,
    })),
    ownershipClaimSequence,
    reconcileRetryCount: reconcileRetries.get(desiredPushState.revision) ?? 0,
    reconcileRetryRunCount: reconcileRetryRuns.get(desiredPushState.revision) ?? 0,
    reconcileFollowUp: reconcileFollowUp ? { ...reconcileFollowUp } : null,
  };
}

function applicationServerKey(value) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replaceAll("-", "+").replaceAll("_", "/");
  const bytes = atob(base64);
  return Uint8Array.from(bytes, (character) => character.charCodeAt(0));
}

export function getPushCapability() {
  const supported = typeof window !== "undefined"
    && "serviceWorker" in navigator
    && "PushManager" in window
    && "Notification" in window;
  const ios = supported && /iPad|iPhone|iPod/.test(navigator.userAgent)
    && !window.MSStream;
  const standalone = !ios
    || window.matchMedia("(display-mode: standalone)").matches
    || navigator.standalone === true;
  return {
    supported,
    permission: supported ? Notification.permission : "unsupported",
    requiresIosInstall: ios && !standalone,
  };
}

async function registration() {
  return navigator.serviceWorker.register(SERVICE_WORKER_PATH, { scope: SERVICE_WORKER_SCOPE });
}

export async function getCurrentPushSubscription() {
  const capability = getPushCapability();
  if (!capability.supported || capability.requiresIosInstall) return null;
  const currentRegistration = await registration();
  const subscription = await currentRegistration.pushManager.getSubscription();
  if (subscription) lastKnownPushSubscription = subscription;
  return subscription;
}

async function saveSubscription(subscription) {
  lastKnownPushSubscription = subscription;
  const json = subscription.toJSON();
  const { error } = await supabase.rpc("claim_push_subscription", {
    p_endpoint: subscription.endpoint,
    p_p256dh: json.keys?.p256dh,
    p_auth: json.keys?.auth,
    p_user_agent: navigator.userAgent || null,
  });
  if (error) throw error;
}

function claimSubscription(userId, contextVersion, subscription) {
  const promise = saveSubscription(subscription);
  const claim = {
    userId, contextVersion, endpoint: subscription.endpoint, promise, sequence: ++ownershipClaimSequence,
  };
  const claims = inFlightOwnershipClaims.get(userId) ?? new Set();
  claims.add(claim);
  inFlightOwnershipClaims.set(userId, claims);
  const untrack = () => {
    claims.delete(claim);
    if (!claims.size) inFlightOwnershipClaims.delete(userId);
    const cleanup = pendingOwnershipCleanups.get(userId);
    if (cleanup && claim.sequence <= cleanup.claimWatermark) {
      schedulePushReconcile(desiredPushState.revision, false, { preserveAfterRunning: true });
    }
  };
  promise.then(untrack, untrack);
  return promise;
}

async function removeSubscriptionWithAccessToken(subscription, accessToken) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/remove_own_push_subscription`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_endpoint: subscription.endpoint }),
  });
  if (!response.ok) throw new Error(`Push subscription cleanup failed (${response.status}).`);
}

export async function waitForPushRestoreClaims(userId, timeoutMs = 3000) {
  const claims = inFlightOwnershipClaims.get(userId);
  if (!claims?.size) return true;
  let timeoutId;
  const completed = await Promise.race([
    Promise.allSettled([...claims].map((claim) => claim.promise)).then(() => true),
    new Promise((resolve) => {
      timeoutId = setTimeout(() => resolve(false), timeoutMs);
    }),
  ]);
  if (timeoutId) clearTimeout(timeoutId);
  return completed;
}

export async function getPushNotificationState() {
  const subscription = await getCurrentPushSubscription();
  if (!subscription) return { subscription: null, owned: false };
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint")
    .eq("endpoint", subscription.endpoint)
    .maybeSingle();
  if (error) throw error;
  return { subscription, owned: data?.endpoint === subscription.endpoint };
}

export async function enablePushNotifications(userId) {
  const authSnapshot = captureExplicitAuthContext(userId);
  const capability = getPushCapability();
  if (!capability.supported) throw new Error("이 브라우저는 푸시 알림을 지원하지 않습니다.");
  if (capability.requiresIosInstall) throw new Error("iPhone에서는 청파 같이를 홈 화면에 추가한 뒤 푸시 알림을 사용할 수 있습니다.");
  if (capability.permission === "denied") throw new Error("브라우저 설정에서 청파 같이의 알림 권한을 허용해 주세요.");
  if (!WEB_PUSH_VAPID_PUBLIC_KEY || WEB_PUSH_VAPID_PUBLIC_KEY.startsWith("YOUR_")) {
    throw new Error("푸시 알림 서버 설정이 아직 완료되지 않았습니다.");
  }

  const permission = capability.permission === "granted"
    ? "granted"
    : await Notification.requestPermission();
  if (permission !== "granted") throw new Error("알림 권한이 허용되지 않았습니다.");
  assertExplicitAuthContextCurrent(authSnapshot);

  // Permission may have transitioned from default since the auth snapshot was
  // resolved. Refresh capability before creating the ON intent so it receives
  // a distinct, authoritative ON revision.
  const refreshedCapability = getPushCapability();
  currentPushAuthContext.eligible = Boolean(currentPushAuthContext.approved
    && refreshedCapability.supported
    && !refreshedCapability.requiresIosInstall
    && refreshedCapability.permission === "granted"
    && WEB_PUSH_VAPID_PUBLIC_KEY
    && !WEB_PUSH_VAPID_PUBLIC_KEY.startsWith("YOUR_"));

  const desired = beginExplicitPushIntent(userId, "on");
  const intent = explicitPushIntent;
  try {
    const result = await enqueuePushMutation(async () => {
      if (!isExplicitAuthContextCurrent(authSnapshot)) throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
      if (!isDesired(desired)) return null;

      const currentRegistration = await registration();
      if (!isExplicitAuthContextCurrent(authSnapshot)) throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
      if (!isDesired(desired)) return null;

      const existing = await currentRegistration.pushManager.getSubscription();
      if (!isExplicitAuthContextCurrent(authSnapshot)) throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
      if (!isDesired(desired)) return null;

      let subscription = existing;
      if (!subscription) {
        subscription = await currentRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey(WEB_PUSH_VAPID_PUBLIC_KEY),
        });
        if (!isExplicitAuthContextCurrent(authSnapshot)) {
          scheduleLatestPushReconcile();
          throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
        }
        if (!isDesired(desired)) {
          scheduleLatestPushReconcile();
          return null;
        }
      }

      if (!isExplicitAuthContextCurrent(authSnapshot)) throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
      if (!isDesired(desired)) return null;
      await claimSubscription(userId, desired.contextVersion, subscription);
      if (!isExplicitAuthContextCurrent(authSnapshot)) {
        scheduleLatestPushReconcile();
        throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
      }
      if (!isDesired(desired)) {
        scheduleLatestPushReconcile();
        return null;
      }

      setPushPreference(userId, "on");
      restoredUserIds.add(userId);
      return subscription;
    });
    finishExplicitPushIntent(intent, true);
    return result;
  } catch (error) {
    finishExplicitPushIntent(intent, false);
    schedulePushReconcile();
    throw error;
  }
}

export async function disablePushNotifications(userId) {
  const authSnapshot = captureExplicitAuthContext(userId);
  const desired = beginExplicitPushIntent(userId, "off");
  const intent = explicitPushIntent;
  try {
    const result = await enqueuePushMutation(async () => {
      if (!isExplicitAuthContextCurrent(authSnapshot)) throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
      if (!isDesired(desired)) return false;

      const subscription = await getCurrentPushSubscription();
      if (!isExplicitAuthContextCurrent(authSnapshot)) throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
      if (!isDesired(desired)) return false;

      if (subscription) {
        if (!isExplicitAuthContextCurrent(authSnapshot)) throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
        const { error } = await supabase.rpc("remove_own_push_subscription", {
          p_endpoint: subscription.endpoint,
        });
        if (error) throw error;
        if (!isExplicitAuthContextCurrent(authSnapshot)) {
          scheduleLatestPushReconcile();
          throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
        }
        if (!isDesired(desired)) {
          scheduleLatestPushReconcile();
          return false;
        }

        await subscription.unsubscribe();
        if (!isExplicitAuthContextCurrent(authSnapshot)) {
          scheduleLatestPushReconcile();
          throw new Error(PUSH_AUTH_CHANGED_MESSAGE);
        }
        if (!isDesired(desired)) {
          scheduleLatestPushReconcile();
          return false;
        }
      }

      setPushPreference(userId, "off");
      restoredUserIds.delete(userId);
      return Boolean(subscription);
    });
    finishExplicitPushIntent(intent, true);
    return result;
  } catch (error) {
    finishExplicitPushIntent(intent, false);
    schedulePushReconcile();
    throw error;
  }
}

export async function cleanupPushSubscriptionForSignOut(userId, {
  accessToken = null,
  isActive = () => true,
} = {}) {
  // Capture the previous account's cleanup authority before publishing the
  // logged-out desired state. The auth flow may stop waiting for this work,
  // but later reconciliation must retain the credential and obligation.
  addCleanupObligation(userId, accessToken);
  currentPushAuthContext = {
    userId: null, contextVersion: null, approved: false, eligible: false, preference: "off",
  };
  explicitPushIntent = null;
  const desired = resolveDesiredPushState();
  restoredUserIds.delete(userId);
  return enqueuePushMutation(async () => {
    const subscription = await getCurrentPushSubscription();
    if (!subscription || !isActive()) return false;

    if (getPushPreference(userId) === null) {
      try {
        const state = await getPushNotificationState();
        if (isActive() && state.owned) setPushPreference(userId, "on");
      } catch (error) {
        console.warn("Legacy push preference could not be migrated during sign-out.", error);
      }
    }
    if (!isActive()) return false;

    let removalError = null;
    try {
      if (accessToken) {
        await removeSubscriptionWithAccessToken(subscription, accessToken);
      } else {
        const { error } = await supabase.rpc("remove_own_push_subscription", {
          p_endpoint: subscription.endpoint,
        });
        if (error) throw error;
      }
    } catch (error) {
      removalError = error;
    }

    if (!isActive() || !isDesired(desired)) {
      if (removalError) throw removalError;
      return true;
    }

    let unsubscribeError = null;
    try {
      await subscription.unsubscribe();
    } catch (error) {
      unsubscribeError = error;
    }
    if (removalError) throw removalError;
    if (unsubscribeError) throw unsubscribeError;
    const cleanup = pendingOwnershipCleanups.get(userId);
    if (cleanup) finishOwnershipCleanups([cleanup]);
    return true;
  });
}

async function restorePushNotifications(auth, { isCurrent, getCurrentUserId }) {
  const userId = auth?.user?.id;
  if (!userId || !isCurrent()) return null;
  if (auth.profile?.status !== "approved") return null;

  const capability = getPushCapability();
  if (!capability.supported || capability.requiresIosInstall) return null;
  if (capability.permission !== "granted"
    || !WEB_PUSH_VAPID_PUBLIC_KEY
    || WEB_PUSH_VAPID_PUBLIC_KEY.startsWith("YOUR_")) return null;

  if (currentPushAuthContext.userId !== userId) setPushDesiredAuthContext(auth);
  const requestRevision = desiredPushState.revision;
  let preference = getPushPreference(userId);
  if (!isCurrent()) return null;
  if (preference === null) {
    const legacyState = await getPushNotificationState();
    if (!isCurrent() || desiredPushState.revision !== requestRevision || explicitPushIntent?.userId === userId) return null;
    if (!legacyState.owned) {
      if (currentPushAuthContext.userId === userId) currentPushAuthContext.preference = "off";
      resolveDesiredPushState();
      schedulePushReconcile();
      return null;
    }
    preference = "on";
    setPushPreference(userId, "on");
    if (currentPushAuthContext.userId === userId && !explicitPushIntent) {
      currentPushAuthContext.preference = "on";
    }
  }
  if (preference !== "on") return null;
  // The legacy lookup resolves the auth-derived unknown state. Explicit intent,
  // when present, remains authoritative and prevents this result from winning.
  if (explicitPushIntent?.userId === userId) return null;
  const desired = resolveDesiredPushState();
  return enqueuePushMutation(async () => {
    if (!isCurrent() || !isDesired(desired)) return null;
    const currentRegistration = await registration();
    if (!isCurrent() || !isDesired(desired)) return null;
    const existing = await currentRegistration.pushManager.getSubscription();
    if (!isCurrent() || !isDesired(desired)) return null;
    let subscription = existing;
    if (!subscription) {
      subscription = await currentRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey(WEB_PUSH_VAPID_PUBLIC_KEY),
      });
      if (!isCurrent() || !isDesired(desired)) {
        scheduleLatestPushReconcile();
        return null;
      }
    }
    if (!isCurrent() || !isDesired(desired)) return null;
    await claimSubscription(userId, desired.contextVersion, subscription);
    // Stale work never compensates destructively. A queued newer intent is the
    // only operation allowed to decide the endpoint's eventual state.
    if (!isCurrent() || !isDesired(desired)) return null;
    setPushPreference(userId, "on");
    restoredUserIds.add(userId);
    return subscription;
  });
}

export function restorePushNotificationsForAuth(auth, {
  isCurrent = () => true,
  getCurrentUserId = () => auth?.user?.id,
} = {}) {
  const userId = auth?.user?.id;
  if (!userId || !isCurrent() || restoredUserIds.has(userId)) return Promise.resolve(null);
  const pendingRestore = restorePromises.get(userId);
  if (pendingRestore?.isCurrent()) return pendingRestore.promise;

  const restorePromise = restorePushNotifications(auth, { isCurrent, getCurrentUserId })
    .finally(() => {
      if (restorePromises.get(userId)?.promise === restorePromise) restorePromises.delete(userId);
    });
  restorePromises.set(userId, { promise: restorePromise, isCurrent });
  return restorePromise;
}
