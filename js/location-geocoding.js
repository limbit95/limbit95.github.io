const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const MIN_REQUEST_INTERVAL_MS = 1100;
const CACHE_PREFIX = "cheongpa:location-coordinates:";
const memoryCache = new Map();

let lastRequestAt = 0;
let requestQueue = Promise.resolve();

function validCoordinatePair(latitude, longitude) {
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= -90
    && latitude <= 90
    && longitude >= -180
    && longitude <= 180;
}

export function locationCoordinates(value = {}) {
  const rawLatitude = value.location_latitude;
  const rawLongitude = value.location_longitude;
  if (rawLatitude === null || rawLatitude === undefined || rawLatitude === ""
    || rawLongitude === null || rawLongitude === undefined || rawLongitude === "") {
    return null;
  }

  const latitude = Number(rawLatitude);
  const longitude = Number(rawLongitude);
  return validCoordinatePair(latitude, longitude)
    ? { latitude, longitude }
    : null;
}

function cacheKey(locationName) {
  return `${CACHE_PREFIX}${locationName.toLocaleLowerCase("ko-KR")}`;
}

function readStoredCoordinates(locationName) {
  try {
    const stored = window.localStorage.getItem(cacheKey(locationName));
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    const latitude = Number(parsed?.latitude);
    const longitude = Number(parsed?.longitude);
    return validCoordinatePair(latitude, longitude)
      ? { latitude, longitude }
      : null;
  } catch {
    return null;
  }
}

function storeCoordinates(locationName, coordinates) {
  if (!coordinates) return;
  try {
    window.localStorage.setItem(cacheKey(locationName), JSON.stringify(coordinates));
  } catch {
    // Storage can be unavailable in privacy mode; the in-memory cache still works.
  }
}

function scheduleRequest(task) {
  const run = async () => {
    const waitMs = Math.max(0, MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt));
    if (waitMs) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
    lastRequestAt = Date.now();
    return task();
  };
  requestQueue = requestQueue.then(run, run);
  return requestQueue;
}

async function fetchLocationCoordinates(locationName) {
  const stored = readStoredCoordinates(locationName);
  if (stored) return stored;

  const url = new URL(NOMINATIM_SEARCH_URL);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "kr");
  url.searchParams.set("accept-language", "ko");
  url.searchParams.set("q", `${locationName}, 대한민국`);

  try {
    const response = await scheduleRequest(() => fetch(url, {
      headers: { Accept: "application/json" },
      referrerPolicy: "strict-origin-when-cross-origin",
    }));
    if (!response.ok) return null;

    const [result] = await response.json();
    const latitude = Number(result?.lat);
    const longitude = Number(result?.lon);
    if (!validCoordinatePair(latitude, longitude)) return null;

    const coordinates = { latitude, longitude };
    storeCoordinates(locationName, coordinates);
    return coordinates;
  } catch {
    return null;
  }
}

export function resolveLocationCoordinates(locationName) {
  const normalizedName = String(locationName ?? "").trim();
  if (!normalizedName) return Promise.resolve(null);

  const key = normalizedName.toLocaleLowerCase("ko-KR");
  if (!memoryCache.has(key)) {
    memoryCache.set(key, fetchLocationCoordinates(normalizedName));
  }
  return memoryCache.get(key);
}
