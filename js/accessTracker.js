let trackerStarted = false;
let lastTrackedLocation = null;
let pendingAccess = null;
let trackingPromise = null;
let supabaseLibraryPromise = null;

function locationKey() {
  if (typeof window === "undefined") return "";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function accessPath() {
  if (typeof window === "undefined") return null;
  const pathname = window.location.pathname || "/";
  const hash = window.location.hash || "";
  if (!hash.startsWith("#/")) return pathname.slice(0, 500);

  const hashPath = hash.slice(1).split("?")[0] || "/";
  const path = pathname === "/" ? hashPath : `${pathname}${hashPath}`;
  return path.slice(0, 500);
}

function ensureSupabaseLibrary() {
  if (window.supabase?.createClient) return Promise.resolve();
  if (supabaseLibraryPromise) return supabaseLibraryPromise;

  supabaseLibraryPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="@supabase/supabase-js@2"]');
    const script = existing ?? document.createElement("script");
    const onLoad = () => resolve();
    const onError = () => reject(new Error("Supabase library load failed."));
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    if (!existing) {
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      document.head.append(script);
    }
  });
  return supabaseLibraryPromise;
}

async function loadClient() {
  try {
    await ensureSupabaseLibrary();
    const module = await import("./supabaseClient.js");
    if (!module.isSupabaseClientReady() || !module.supabase) return null;
    return module.supabase;
  } catch (error) {
    console.warn("Member access client initialization failed.", error);
    return null;
  }
}

async function flushPendingAccess() {
  const supabase = await loadClient();
  if (!supabase) return;

  while (pendingAccess) {
    const targetAccess = pendingAccess;
    pendingAccess = null;

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn("Member access session lookup failed.", error);
      continue;
    }
    if (!data.session?.user) {
      lastTrackedLocation = null;
      continue;
    }

    const { error: touchError } = await supabase.rpc("touch_my_member_access", {
      p_path: targetAccess.path,
    });
    if (touchError) {
      console.warn("Member access tracking failed.", touchError);
      continue;
    }
    lastTrackedLocation = targetAccess.key;
  }
}

export function trackMemberAccess({ force = false } = {}) {
  if (typeof window === "undefined") return Promise.resolve();
  const currentLocation = locationKey();
  if (!force && currentLocation === lastTrackedLocation) return trackingPromise ?? Promise.resolve();

  pendingAccess = {
    key: currentLocation,
    path: accessPath(),
  };
  if (trackingPromise) return trackingPromise;

  trackingPromise = flushPendingAccess().finally(() => {
    trackingPromise = null;
    if (pendingAccess && pendingAccess.key !== lastTrackedLocation) void trackMemberAccess();
  });
  return trackingPromise;
}

export async function startMemberAccessTracker() {
  if (trackerStarted || typeof window === "undefined") return;
  trackerStarted = true;
  const supabase = await loadClient();
  if (!supabase) return;

  window.addEventListener("hashchange", () => void trackMemberAccess());
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    lastTrackedLocation = null;
    void trackMemberAccess();
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session) {
      lastTrackedLocation = null;
      return;
    }
    if (event === "SIGNED_IN") {
      lastTrackedLocation = null;
      void trackMemberAccess();
    }
  });

  void trackMemberAccess();
}

if (typeof window !== "undefined") void startMemberAccessTracker();
