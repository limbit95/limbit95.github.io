import { KAKAO_JAVASCRIPT_KEY } from "./config.js";

const KAKAO_MAPS_SDK_URL = "https://dapi.kakao.com/v2/maps/sdk.js";
const KOREA_BOUNDS = {
  minLatitude: 32,
  maxLatitude: 39.5,
  minLongitude: 124,
  maxLongitude: 132,
};

let kakaoMapsServicesPromise = null;
const coordinateCache = new Map();

function normalizedText(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function compactPlaceName(value) {
  return normalizedText(value)
    .toLocaleLowerCase("ko-KR")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function validKoreaCoordinates(latitude, longitude) {
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= KOREA_BOUNDS.minLatitude
    && latitude <= KOREA_BOUNDS.maxLatitude
    && longitude >= KOREA_BOUNDS.minLongitude
    && longitude <= KOREA_BOUNDS.maxLongitude;
}

function resolvedKakaoMaps() {
  const kakao = typeof window !== "undefined" ? window.kakao : null;
  return kakao?.maps?.services?.Places ? kakao : null;
}

function finishKakaoMapsLoad(resolve) {
  const kakao = typeof window !== "undefined" ? window.kakao : null;
  if (!kakao?.maps?.load) {
    resolve(null);
    return;
  }

  kakao.maps.load(() => resolve(resolvedKakaoMaps()));
}

function loadKakaoMapsServices() {
  if (!KAKAO_JAVASCRIPT_KEY || typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve(null);
  }

  const loaded = resolvedKakaoMaps();
  if (loaded) return Promise.resolve(loaded);
  if (kakaoMapsServicesPromise) return kakaoMapsServicesPromise;

  kakaoMapsServicesPromise = new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const existing = document.querySelector('script[data-kakao-maps-services="true"]');
    if (existing) {
      if (window.kakao?.maps?.load) {
        finishKakaoMapsLoad(finish);
      } else {
        existing.addEventListener("load", () => finishKakaoMapsLoad(finish), { once: true });
        existing.addEventListener("error", () => finish(null), { once: true });
      }
      window.setTimeout(() => finish(resolvedKakaoMaps()), 8000);
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.dataset.kakaoMapsServices = "true";
    script.src = `${KAKAO_MAPS_SDK_URL}?appkey=${encodeURIComponent(KAKAO_JAVASCRIPT_KEY)}&libraries=services&autoload=false`;
    script.addEventListener("load", () => finishKakaoMapsLoad(finish), { once: true });
    script.addEventListener("error", () => finish(null), { once: true });
    document.head.append(script);

    window.setTimeout(() => finish(resolvedKakaoMaps()), 8000);
  }).catch(() => null);

  return kakaoMapsServicesPromise;
}

function bestPlaceResult(results, query) {
  const queryName = compactPlaceName(query);
  const validResults = (results ?? []).filter((place) => {
    const latitude = Number(place?.y);
    const longitude = Number(place?.x);
    return validKoreaCoordinates(latitude, longitude);
  });
  if (!validResults.length) return null;

  if (queryName) {
    const exact = validResults.find((place) => compactPlaceName(place.place_name) === queryName);
    if (exact) return exact;

    const related = validResults.find((place) => {
      const placeName = compactPlaceName(place.place_name);
      return placeName.includes(queryName) || queryName.includes(placeName);
    });
    if (related) return related;
  }

  return validResults[0];
}

export async function resolveKakaoPlaceCoordinates(locationName) {
  const query = normalizedText(locationName);
  if (!query) return null;

  const cacheKey = query.toLocaleLowerCase("ko-KR");
  if (coordinateCache.has(cacheKey)) return coordinateCache.get(cacheKey);

  coordinateCache.set(cacheKey, (async () => {
    const kakao = await loadKakaoMapsServices();
    if (!kakao?.maps?.services?.Places) return null;

    return new Promise((resolve) => {
      const places = new kakao.maps.services.Places();
      places.keywordSearch(query, (results, status) => {
        if (status !== kakao.maps.services.Status.OK) {
          resolve(null);
          return;
        }

        const place = bestPlaceResult(results, query);
        const latitude = Number(place?.y);
        const longitude = Number(place?.x);
        resolve(validKoreaCoordinates(latitude, longitude)
          ? { latitude, longitude }
          : null);
      });
    });
  })());

  return coordinateCache.get(cacheKey);
}
