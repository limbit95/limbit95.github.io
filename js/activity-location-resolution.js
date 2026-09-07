import { resolveLocationCoordinates } from "./location-geocoding.js";
import { supabase } from "./supabaseClient.js";

const NAVER_SHORT_HOST = "naver.me";
const shortLinkCache = new Map();

function normalizedText(value) {
  return String(value ?? "").trim();
}

function isNaverShortMapUrl(value) {
  const rawUrl = normalizedText(value);
  if (!rawUrl) return false;

  try {
    const url = new URL(rawUrl);
    return url.protocol === "https:"
      && url.hostname.toLocaleLowerCase("en-US") === NAVER_SHORT_HOST;
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

async function resolveNaverShortMapLink(locationUrl) {
  const rawUrl = normalizedText(locationUrl);
  if (!isNaverShortMapUrl(rawUrl) || !supabase?.functions?.invoke) return null;

  if (!shortLinkCache.has(rawUrl)) {
    shortLinkCache.set(rawUrl, (async () => {
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

  return shortLinkCache.get(rawUrl);
}

export async function resolveActivityLocationCoordinates(locationName, locationUrl = "") {
  const directCoordinates = await resolveLocationCoordinates(locationName, locationUrl);
  if (directCoordinates) return directCoordinates;

  const resolvedLink = await resolveNaverShortMapLink(locationUrl);
  if (!resolvedLink) return null;

  const resolvedUrlCoordinates = resolvedLink.url
    ? await resolveLocationCoordinates("", resolvedLink.url)
    : null;
  if (resolvedUrlCoordinates) return resolvedUrlCoordinates;

  const addressCoordinates = resolvedLink.address
    ? await resolveLocationCoordinates(resolvedLink.address, resolvedLink.url)
    : null;

  return addressCoordinates ?? resolvedLink.coordinates;
}
