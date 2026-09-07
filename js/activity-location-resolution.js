import {
  isNaverMapUrl,
  locationCoordinatesFromUrl,
} from "./location-geocoding.js";
import { supabase } from "./supabaseClient.js";

const locationResolutionCache = new Map();

function normalizedText(value) {
  return String(value ?? "").trim();
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

async function resolveWithNaver(locationName, locationUrl) {
  if (!supabase?.functions?.invoke) return null;

  const name = normalizedText(locationName);
  const rawUrl = normalizedText(locationUrl);
  const trustedUrl = isNaverMapUrl(rawUrl) ? rawUrl : "";
  if (!name && !trustedUrl) return null;

  const cacheKey = `${name.toLocaleLowerCase("ko-KR")}|${trustedUrl}`;
  if (!locationResolutionCache.has(cacheKey)) {
    locationResolutionCache.set(cacheKey, (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("resolve-map-link", {
          body: {
            location_name: name,
            url: trustedUrl,
          },
        });
        if (error || !data) return null;

        const latitude = coordinateValue(data.latitude);
        const longitude = coordinateValue(data.longitude);
        return validCoordinatePair(latitude, longitude)
          ? { latitude, longitude }
          : null;
      } catch {
        return null;
      }
    })());
  }

  return locationResolutionCache.get(cacheKey);
}

export async function resolveActivityLocationCoordinates(locationName, locationUrl = "") {
  const naverCoordinates = await resolveWithNaver(locationName, locationUrl);
  if (naverCoordinates) return naverCoordinates;

  return locationCoordinatesFromUrl(locationUrl);
}
