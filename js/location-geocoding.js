const NAVER_MAP_HOSTS = new Set([
  "naver.me",
  "map.naver.com",
  "m.map.naver.com",
  "place.naver.com",
]);
const LOCATION_QUERY_PARAMS = ["query", "q", "keyword", "searchQuery", "title", "name"];
const URL_COORDINATE_PARAM_PAIRS = [
  ["lat", "lng"],
  ["latitude", "longitude"],
  ["y", "x"],
];

function normalizedText(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function appendUnique(values, value) {
  const normalized = normalizedText(value);
  if (!normalized || values.includes(normalized)) return;
  values.push(normalized);
}

function validCoordinatePair(latitude, longitude) {
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= -90
    && latitude <= 90
    && longitude >= -180
    && longitude <= 180;
}

export function isNaverMapUrl(value) {
  const rawUrl = normalizedText(value);
  if (!rawUrl) return false;

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return false;

    const hostname = url.hostname.toLocaleLowerCase("en-US");
    return NAVER_MAP_HOSTS.has(hostname) || hostname.endsWith(".place.naver.com");
  } catch {
    return false;
  }
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
  if (!isNaverMapUrl(rawUrl)) return null;

  try {
    const url = new URL(rawUrl);
    const queryCoordinates = parseCoordinatesFromSearchParams(url.searchParams);
    if (queryCoordinates) return queryCoordinates;

    const hashParams = hashSearchParams(url);
    const hashCoordinates = hashParams ? parseCoordinatesFromSearchParams(hashParams) : null;
    if (hashCoordinates) return hashCoordinates;

    const decodedUrl = decodeURIComponent(url.href);
    const pathMatch = decodedUrl.match(/@(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)(?:[,/?#]|$)/);
    if (!pathMatch) return null;

    const latitude = Number(pathMatch[1]);
    const longitude = Number(pathMatch[2]);
    return validCoordinatePair(latitude, longitude) ? { latitude, longitude } : null;
  } catch {
    return null;
  }
}

function locationNamesFromUrl(locationUrl) {
  const rawUrl = normalizedText(locationUrl);
  if (!isNaverMapUrl(rawUrl)) return [];

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
      if (segments[index].toLocaleLowerCase("en-US") !== "search") continue;
      appendUnique(names, segments[index + 1]);
    }
    return names;
  } catch {
    return [];
  }
}

export function locationSearchCandidates(locationName, locationUrl = "") {
  const candidates = [];
  appendUnique(candidates, locationName);
  locationNamesFromUrl(locationUrl).forEach((candidate) => appendUnique(candidates, candidate));
  return candidates.slice(0, 5);
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

export function resolveLocationCoordinates(_locationName, locationUrl = "") {
  return Promise.resolve(locationCoordinatesFromUrl(locationUrl));
}
