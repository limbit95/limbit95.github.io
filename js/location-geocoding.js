const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const MIN_REQUEST_INTERVAL_MS = 1100;
const CACHE_PREFIX = "cheongpa:location-coordinates:";
const memoryCache = new Map();

const LOCATION_QUERY_PARAMS = ["query", "q", "keyword", "searchQuery", "title", "name"];
const URL_COORDINATE_PARAM_PAIRS = [
  ["lat", "lng"],
  ["latitude", "longitude"],
  ["y", "x"],
];
const MERGEABLE_LOCATION_SUFFIXES = [
  "공원",
  "역",
  "교회",
  "성당",
  "학교",
  "센터",
  "시장",
  "도서관",
  "체육관",
  "카페",
  "광장",
  "주차장",
];

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

function normalizedText(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function appendUnique(values, value) {
  const normalized = normalizedText(value);
  if (!normalized || values.includes(normalized)) return;
  values.push(normalized);
}

function parseCoordinatesFromSearchParams(searchParams) {
  for (const [latitudeParam, longitudeParam] of URL_COORDINATE_PARAM_PAIRS) {
    const rawLatitude = searchParams.get(latitudeParam);
    const rawLongitude = searchParams.get(longitudeParam);
    if (rawLatitude === null || rawLongitude === null || rawLatitude === "" || rawLongitude === "") continue;

    const latitude = Number(rawLatitude);
    const longitude = Number(rawLongitude);
    if (validCoordinatePair(latitude, longitude)) return { latitude, longitude };
  }
  return null;
}

function hashSearchParams(url) {
  const rawHash = decodeURIComponent(url.hash.replace(/^#/, ""));
  const queryIndex = rawHash.indexOf("?");
  if (queryIndex < 0) return null;
  return new URLSearchParams(rawHash.slice(queryIndex + 1));
}

export function locationCoordinatesFromUrl(locationUrl) {
  const rawUrl = normalizedText(locationUrl);
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const queryCoordinates = parseCoordinatesFromSearchParams(url.searchParams);
    if (queryCoordinates) return queryCoordinates;

    const hashParams = hashSearchParams(url);
    const hashCoordinates = hashParams ? parseCoordinatesFromSearchParams(hashParams) : null;
    if (hashCoordinates) return hashCoordinates;

    const decodedUrl = decodeURIComponent(url.href);
    const pathMatch = decodedUrl.match(/@(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)(?:[,/?#]|$)/);
    if (pathMatch) {
      const latitude = Number(pathMatch[1]);
      const longitude = Number(pathMatch[2]);
      if (validCoordinatePair(latitude, longitude)) return { latitude, longitude };
    }
  } catch {
    return null;
  }

  return null;
}

function locationNamesFromUrl(locationUrl) {
  const rawUrl = normalizedText(locationUrl);
  if (!rawUrl) return [];

  try {
    const url = new URL(rawUrl);
    const names = [];
    for (const param of LOCATION_QUERY_PARAMS) {
      appendUnique(names, url.searchParams.get(param));
    }

    const segments = url.pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => decodeURIComponent(segment));
    for (let index = 0; index < segments.length - 1; index += 1) {
      const segment = segments[index].toLocaleLowerCase("en-US");
      if (segment !== "search") continue;
      appendUnique(names, segments[index + 1]);
    }
    return names;
  } catch {
    return [];
  }
}

export function locationSearchCandidates(locationName, locationUrl = "") {
  const candidates = [];
  const exactName = normalizedText(locationName);
  appendUnique(candidates, exactName);
  locationNamesFromUrl(locationUrl).forEach((candidate) => appendUnique(candidates, candidate));

  if (exactName) {
    const suffixPattern = new RegExp(`\\s+(${MERGEABLE_LOCATION_SUFFIXES.join("|")})$`);
    appendUnique(candidates, exactName.replace(suffixPattern, "$1"));
    appendUnique(candidates, exactName.replace(/\s+/g, ""));
  }

  return candidates.slice(0, 4);
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

async function fetchFirstCandidateCoordinates(candidates) {
  for (const candidate of candidates) {
    const coordinates = await fetchLocationCoordinates(candidate);
    if (coordinates) return coordinates;
  }
  return null;
}

export function resolveLocationCoordinates(locationName, locationUrl = "") {
  const urlCoordinates = locationCoordinatesFromUrl(locationUrl);
  if (urlCoordinates) return Promise.resolve(urlCoordinates);

  const candidates = locationSearchCandidates(locationName, locationUrl);
  if (!candidates.length) return Promise.resolve(null);

  const key = `${candidates.join("|").toLocaleLowerCase("ko-KR")}|${normalizedText(locationUrl)}`;
  if (!memoryCache.has(key)) {
    memoryCache.set(key, fetchFirstCandidateCoordinates(candidates));
  }
  return memoryCache.get(key);
}
