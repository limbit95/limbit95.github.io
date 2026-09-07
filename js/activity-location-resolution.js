import { resolveKakaoPlaceCoordinates } from "./kakao-place-geocoding.js";
import { resolveLocationCoordinates } from "./location-geocoding.js";
import { supabase } from "./supabaseClient.js";

const NAVER_SHORT_HOST = "naver.me";
const NAVER_MAP_HOSTS = new Set([
  "map.naver.com",
  "m.map.naver.com",
  "place.naver.com",
]);
const naverLinkCache = new Map();

function normalizedText(value) {
  return String(value ?? "").trim();
}

function isNaverMapUrl(value) {
  const rawUrl = normalizedText(value);
  if (!rawUrl) return false;

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return false;

    const hostname = url.hostname.toLocaleLowerCase("en-US");
    return hostname === NAVER_SHORT_HOST
      || NAVER_MAP_HOSTS.has(hostname)
      || hostname.endsWith(".place.naver.com");
  } catch {
    return false;
  }
}

function coordinateValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function validCoordinatePair(latitude, longitude) {
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= -90
    && latitude <= 90
    && longitude >= -180
    && longitude <= 180;
}

async function resolveNaverMapLink(locationUrl) {
  const rawUrl = normalizedText(locationUrl);
  if (!isNaverMapUrl(rawUrl) || !supabase?.functions?.invoke) return null;

  if (!naverLinkCache.has(rawUrl)) {
    naverLinkCache.set(rawUrl, (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("resolve-map-link", {
          body: { url: rawUrl },
        });
        if (error || !data) return null;

        const resolvedUrl = normalizedText(data.resolved_url);
        const latitude = coordinateValue(data.latitude);
        const longitude = coordinateValue(data.longitude);
        return {
          url: resolvedUrl || rawUrl,
          address: normalizedText(data.address),
          coordinates: validCoordinatePair(latitude, longitude)
            ? { latitude, longitude }
            : null,
        };
      } catch {
        return null;
      }
    })());
  }

  return naverLinkCache.get(rawUrl);
}

export async function resolveActivityLocationCoordinates(locationName, locationUrl = "") {
  const nameCoordinates = await resolveLocationCoordinates(locationName, "");
  if (nameCoordinates) return nameCoordinates;

  const linkCoordinates = await resolveLocationCoordinates("", locationUrl);
  if (linkCoordinates) return linkCoordinates;

  const resolvedLink = await resolveNaverMapLink(locationUrl);
  if (resolvedLink) {
    const resolvedUrlCoordinates = resolvedLink.url
      ? await resolveLocationCoordinates("", resolvedLink.url)
      : null;
    if (resolvedUrlCoordinates) return resolvedUrlCoordinates;

    if (resolvedLink.coordinates) return resolvedLink.coordinates;

    if (resolvedLink.address) {
      const addressCoordinates = await resolveLocationCoordinates(resolvedLink.address, "")
        ?? await resolveKakaoPlaceCoordinates(resolvedLink.address);
      if (addressCoordinates) return addressCoordinates;
    }
  }

  return resolveKakaoPlaceCoordinates(locationName);
}
