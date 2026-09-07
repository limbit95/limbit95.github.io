import { resolveActivityLocationCoordinates } from "./activity-location-resolution.js";
import { NAVER_MAPS_CLIENT_ID } from "./config.js";
import { isNaverMapUrl, locationCoordinates } from "./location-geocoding.js";

const DETAIL_BODY_SELECTOR = ".activity-detail__body";
const LOCATION_LABEL = "장소";
let naverMapsSdkPromise = null;

function ensureDetailMapStyles() {
  if (document.querySelector('link[data-activity-detail-map-styles="true"]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL("./css/activity-detail-map.css", document.baseURI).href;
  link.dataset.activityDetailMapStyles = "true";
  document.head.append(link);
}

function findLocationMeta(page) {
  return Array.from(page.querySelectorAll(".activity-detail__meta")).find((meta) => (
    meta.querySelector(".activity-detail__meta-label")?.textContent?.trim() === LOCATION_LABEL
  ));
}

function locationNameFromMeta(meta) {
  return meta?.querySelector(".activity-detail__meta-value")?.textContent
    ?.replace(/\s*↗\s*$/, "")
    .trim() ?? "";
}

function naverSearchUrl(locationName) {
  return `https://map.naver.com/p/search/${encodeURIComponent(locationName)}`;
}

function registeredNaverMapUrl(locationName, event, locationLink) {
  const eventUrl = String(event?.location_url ?? "").trim();
  if (isNaverMapUrl(eventUrl)) return eventUrl;

  const linkUrl = locationLink instanceof HTMLAnchorElement ? locationLink.href : "";
  if (isNaverMapUrl(linkUrl)) return linkUrl;

  return naverSearchUrl(locationName);
}

function loadNaverMapsSdk() {
  if (!NAVER_MAPS_CLIENT_ID) return Promise.resolve(null);
  if (window.naver?.maps) return Promise.resolve(window.naver);
  if (naverMapsSdkPromise) return naverMapsSdkPromise;

  naverMapsSdkPromise = new Promise((resolve) => {
    const callbackName = `__cheongpaNaverMapsReady${Date.now()}`;
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      delete window[callbackName];
      resolve(value);
    };

    window[callbackName] = () => finish(window.naver?.maps ? window.naver : null);

    const script = document.createElement("script");
    script.async = true;
    script.dataset.naverMapsSdk = "true";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(NAVER_MAPS_CLIENT_ID)}&submodules=geocoder&callback=${callbackName}`;
    script.addEventListener("error", () => finish(null), { once: true });
    document.head.append(script);

    window.setTimeout(() => finish(window.naver?.maps ? window.naver : null), 8000);
  });

  return naverMapsSdkPromise;
}

function setFallbackMessage(fallback, message) {
  const copy = fallback.querySelector(".activity-detail__map-fallback-copy");
  if (copy) copy.textContent = message;
}

function geocodeWithNaver(naver, locationName) {
  if (!naver?.maps?.Service) return Promise.resolve(null);

  return new Promise((resolve) => {
    naver.maps.Service.geocode({ query: locationName }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK) {
        resolve(null);
        return;
      }

      const address = response?.v2?.addresses?.[0];
      const latitude = Number(address?.y);
      const longitude = Number(address?.x);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        resolve(null);
        return;
      }
      resolve({ latitude, longitude });
    });
  });
}

async function resolveMapCoordinates(naver, locationName, event = null) {
  const locationUrl = event?.location_url ?? "";
  return locationCoordinates(event ?? {})
    ?? await resolveActivityLocationCoordinates(locationName, locationUrl)
    ?? await geocodeWithNaver(naver, locationName);
}

async function hydrateNaverMap(canvas, fallback, locationName, event = null) {
  const naver = await loadNaverMapsSdk();
  if (!naver?.maps || !canvas.isConnected) {
    if (NAVER_MAPS_CLIENT_ID) {
      setFallbackMessage(fallback, "네이버 지도 미리보기를 불러오지 못했어요. 눌러서 네이버 지도를 확인해 주세요.");
    }
    return;
  }

  const coordinates = await resolveMapCoordinates(naver, locationName, event);
  if (!coordinates || !canvas.isConnected) {
    setFallbackMessage(fallback, "위치를 네이버 지도에서 찾지 못했어요. 눌러서 네이버 지도를 확인해 주세요.");
    return;
  }

  const position = new naver.maps.LatLng(coordinates.latitude, coordinates.longitude);
  canvas.hidden = false;
  fallback.hidden = true;

  const map = new naver.maps.Map(canvas, {
    center: position,
    zoom: 16,
    zoomControl: true,
    zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
    mapDataControl: false,
  });
  new naver.maps.Marker({ map, position });
}

function createMapCard(locationName, registeredMapUrl, event = null) {
  const card = document.createElement("section");
  card.className = "card page-stack activity-detail__content-card activity-detail__map-card";

  const heading = document.createElement("div");
  heading.className = "activity-detail__map-heading";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "🗺️ 지도";

  const external = document.createElement("a");
  external.className = "activity-detail__map-external";
  external.href = registeredMapUrl;
  external.target = "_blank";
  external.rel = "noopener noreferrer";
  external.textContent = "네이버 지도 열기 ↗";

  heading.append(title, external);

  const frame = document.createElement("div");
  frame.className = "activity-detail__map-frame";

  const canvas = document.createElement("div");
  canvas.className = "activity-detail__map-canvas";
  canvas.hidden = true;
  canvas.setAttribute("aria-label", `${locationName} 네이버 지도`);

  const fallback = document.createElement("a");
  fallback.className = "activity-detail__map-fallback";
  fallback.href = registeredMapUrl;
  fallback.target = "_blank";
  fallback.rel = "noopener noreferrer";
  fallback.setAttribute("aria-label", `${locationName} 네이버 지도에서 보기`);

  const pin = document.createElement("span");
  pin.className = "activity-detail__map-fallback-icon";
  pin.textContent = "📍";
  pin.setAttribute("aria-hidden", "true");

  const name = document.createElement("strong");
  name.textContent = locationName;

  const copy = document.createElement("span");
  copy.className = "activity-detail__map-fallback-copy";
  copy.textContent = NAVER_MAPS_CLIENT_ID
    ? "네이버 지도 미리보기를 불러오는 중이에요."
    : "네이버 지도에서 위치를 확인해 주세요.";

  fallback.append(pin, name, copy);
  frame.append(canvas, fallback);

  const attribution = document.createElement("span");
  attribution.className = "small subtle activity-detail__map-attribution";
  attribution.textContent = "지도 및 장소 검색 · NAVER Maps";

  card.append(heading, frame, attribution);

  requestAnimationFrame(() => {
    void hydrateNaverMap(canvas, fallback, locationName, event);
  });
  return card;
}

function groupDetailContentColumns(body, mapCard) {
  const introCard = body.querySelector(":scope > .activity-detail__content-card:not(.activity-detail__map-card)");
  const notice = body.querySelector(":scope > .notice-box--warning");
  if (!introCard || !notice) return;

  const management = body.querySelector(":scope > .activity-detail__management");
  const otherContentCards = Array.from(body.querySelectorAll(":scope > .activity-detail__content-card"))
    .filter((card) => card !== introCard && card !== mapCard);

  const leftColumn = document.createElement("div");
  leftColumn.className = "activity-detail__content-column activity-detail__content-column--left";
  leftColumn.append(introCard, notice);

  const rightColumn = document.createElement("div");
  rightColumn.className = "activity-detail__content-column activity-detail__content-column--right";
  rightColumn.append(...otherContentCards, mapCard);

  if (management) {
    body.insertBefore(leftColumn, management);
    body.insertBefore(rightColumn, management);
  } else {
    body.append(leftColumn, rightColumn);
  }

  body.dataset.locationMapColumns = "true";
}

function enhanceActivityDetailBody(body, event = null) {
  if (body.dataset.locationMapEnhanced === "true") return;

  const noticeTitle = body.querySelector(":scope > .notice-box--warning > strong");
  if (noticeTitle) noticeTitle.textContent = "참여자 주의사항";

  const page = body.parentElement;
  const locationMeta = page ? findLocationMeta(page) : null;
  const locationLink = locationMeta?.querySelector("a.activity-detail__meta-value");
  const locationName = String(event?.location_name ?? "").trim() || locationNameFromMeta(locationMeta);
  if (!locationName) {
    body.dataset.locationMapEnhanced = "true";
    return;
  }

  ensureDetailMapStyles();
  if (locationLink instanceof HTMLAnchorElement) {
    locationLink.classList.add("activity-detail__location-link");
    locationLink.title = `${locationName} 네이버 지도 열기`;
    locationLink.setAttribute("aria-label", `${locationName} 네이버 지도 열기`);
  }

  const mapUrl = registeredNaverMapUrl(locationName, event, locationLink);
  const mapCard = createMapCard(locationName, mapUrl, event);
  const insertionPoint = body.querySelector(":scope > .notice-box--warning, :scope > .activity-detail__management");
  if (insertionPoint) body.insertBefore(mapCard, insertionPoint);
  else body.append(mapCard);

  groupDetailContentColumns(body, mapCard);
  body.dataset.locationMapEnhanced = "true";
}

export function enhanceActivityDetails(root = document, event = null) {
  if (root instanceof Element && root.matches(DETAIL_BODY_SELECTOR)) {
    enhanceActivityDetailBody(root, event);
  }
  root.querySelectorAll?.(DETAIL_BODY_SELECTOR).forEach((body) => enhanceActivityDetailBody(body, event));
}
