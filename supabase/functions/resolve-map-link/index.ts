import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 8000;
const LOCAL_SEARCH_TIMEOUT_MS = 6000;
const NAVER_SHORT_HOST = "naver.me";
const NAVER_API_HUB_LOCAL_SEARCH_URL = "https://naverapihub.apigw.ntruss.com/search/v1/local";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function normalizedText(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function validKoreaCoordinates(latitude: number, longitude: number) {
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= 32
    && latitude <= 39.5
    && longitude >= 124
    && longitude <= 132;
}

function trustedNaverMapUrl(url: URL) {
  if (url.protocol !== "https:" || url.username || url.password || url.port) return false;

  const hostname = url.hostname.toLocaleLowerCase("en-US");
  return hostname === NAVER_SHORT_HOST
    || hostname === "map.naver.com"
    || hostname === "m.map.naver.com"
    || hostname === "place.naver.com"
    || hostname.endsWith(".place.naver.com");
}

function validResolverUrl(url: URL) {
  if (!trustedNaverMapUrl(url)) return false;

  const hostname = url.hostname.toLocaleLowerCase("en-US");
  if (hostname !== NAVER_SHORT_HOST) return true;
  return /^\/[A-Za-z0-9_-]+\/?$/.test(url.pathname);
}

function coordinatePair(latitudeValue: string | null, longitudeValue: string | null) {
  if (!latitudeValue || !longitudeValue) return null;

  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);
  return validKoreaCoordinates(latitude, longitude)
    ? { latitude, longitude }
    : null;
}

function coordinatesFromUrl(url: URL) {
  const paramPairs = [
    ["lat", "lng"],
    ["latitude", "longitude"],
    ["y", "x"],
  ];

  for (const [latitudeKey, longitudeKey] of paramPairs) {
    const coordinates = coordinatePair(
      url.searchParams.get(latitudeKey),
      url.searchParams.get(longitudeKey),
    );
    if (coordinates) return coordinates;
  }

  const decodedUrl = decodeURIComponent(url.href);
  const pathMatch = decodedUrl.match(/@(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)(?:[,/?#]|$)/);
  if (!pathMatch) return null;

  return coordinatePair(pathMatch[1], pathMatch[2]);
}

function appendCandidate(
  candidates: Array<{ query: string; allowFirst: boolean }>,
  value: unknown,
  allowFirst = false,
) {
  const query = normalizedText(value);
  if (!query || candidates.some((candidate) => candidate.query === query)) return;
  candidates.push({ query, allowFirst });
}

function locationCandidatesFromUrl(url: URL) {
  const candidates: Array<{ query: string; allowFirst: boolean }> = [];
  const queryParams = ["query", "q", "keyword", "searchQuery", "title", "name"];
  for (const param of queryParams) {
    appendCandidate(candidates, url.searchParams.get(param));
  }

  const segments = decodeURIComponent(url.pathname).split("/").filter(Boolean);
  for (let index = 0; index < segments.length - 1; index += 1) {
    if (segments[index].toLocaleLowerCase("en-US") !== "search") continue;
    appendCandidate(candidates, segments[index + 1]);
  }
  return candidates;
}

function normalizedHtml(html: string) {
  return html
    .replaceAll("&quot;", '"')
    .replaceAll("\\\"", '"');
}

function decodeHtmlText(value: unknown) {
  return normalizedText(value)
    .replace(/<[^>]+>/g, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&quot;", '"');
}

function decodeJsonString(value: string) {
  try {
    return normalizedText(JSON.parse(`"${value}"`));
  } catch {
    return normalizedText(value.replaceAll("\\/", "/"));
  }
}

function cleanPlaceName(value: unknown) {
  return decodeHtmlText(value)
    .replace(/\s*(?::|\||-|–)\s*네이버(?:\s*(?:지도|플레이스))?\s*$/i, "")
    .trim();
}

function placeMetadataFromHtml(html: string) {
  const normalized = normalizedHtml(html);
  const names: string[] = [];

  const jsonNamePatterns = [
    /"placeName"\s*:\s*"((?:\\.|[^"\\]){2,180})"/i,
    /"name"\s*:\s*"((?:\\.|[^"\\]){2,180})"/i,
  ];
  for (const pattern of jsonNamePatterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) names.push(cleanPlaceName(decodeJsonString(match[1])));
  }

  const ogTitle = normalized.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i)?.[1]
    ?? normalized.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["'][^>]*>/i)?.[1];
  if (ogTitle) names.push(cleanPlaceName(ogTitle));

  const title = normalized.match(/<title[^>]*>([\s\S]{2,200}?)<\/title>/i)?.[1];
  if (title) names.push(cleanPlaceName(title));

  const name = names.find((candidate) => candidate && !/^네이버(?:\s*(?:지도|플레이스))?$/i.test(candidate)) ?? null;
  const roadAddress = normalized.match(/"roadAddress"\s*:\s*"((?:\\.|[^"\\]){4,180})"/i)?.[1];
  const address = normalized.match(/"address"\s*:\s*"((?:\\.|[^"\\]){4,180})"/i)?.[1];

  return {
    name,
    address: roadAddress
      ? decodeJsonString(roadAddress)
      : address
        ? decodeJsonString(address)
        : null,
  };
}

function placeIdFromUrl(url: URL) {
  const pathname = decodeURIComponent(url.pathname);
  const match = pathname.match(/\/(?:entry\/)?place\/(\d+)(?:\/|$)/i)
    ?? pathname.match(/\/(?:restaurant|cafe|hairshop|hospital|accommodation|attraction)\/(\d+)(?:\/|$)/i);
  return match?.[1] ?? null;
}

async function fetchResolvedNaverUrl(initialUrl: URL) {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 (compatible; CheongpaLocationResolver/2.0)",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("NAVER_REDIRECT_WITHOUT_LOCATION");

      const nextUrl = new URL(location, currentUrl);
      if (!trustedNaverMapUrl(nextUrl)) throw new Error("UNTRUSTED_NAVER_REDIRECT");
      currentUrl = nextUrl;
      continue;
    }

    return { response, resolvedUrl: currentUrl };
  }

  throw new Error("TOO_MANY_REDIRECTS");
}

async function metadataFromResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("application/json")) {
    return { name: null, address: null };
  }
  return placeMetadataFromHtml(await response.text());
}

async function metadataFromPlaceId(placeId: string) {
  const placeUrl = new URL(`https://m.place.naver.com/place/${placeId}/home`);
  const { response } = await fetchResolvedNaverUrl(placeUrl);
  if (!response.ok) return { name: null, address: null };
  return metadataFromResponse(response);
}

function naverApiHubCredentials() {
  const clientId = normalizedText(Deno.env.get("NAVER_API_HUB_CLIENT_ID"));
  const clientSecret = normalizedText(Deno.env.get("NAVER_API_HUB_CLIENT_SECRET"));
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

function compactPlaceName(value: unknown) {
  return decodeHtmlText(value)
    .toLocaleLowerCase("ko-KR")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function placeNameTokens(value: unknown) {
  return decodeHtmlText(value)
    .toLocaleLowerCase("ko-KR")
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter((token) => token.length >= 2);
}

function relatedPlaceName(resultTitle: string, query: string) {
  const resultName = compactPlaceName(resultTitle);
  const queryName = compactPlaceName(query);
  if (!resultName || !queryName) return false;
  if (resultName === queryName || resultName.includes(queryName) || queryName.includes(resultName)) return true;

  const queryTokens = placeNameTokens(query);
  return queryTokens.length >= 2 && queryTokens.every((token) => resultName.includes(token));
}

function localSearchCoordinates(item: Record<string, unknown>) {
  let longitude = Number(item.mapx);
  let latitude = Number(item.mapy);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return null;

  if (Math.abs(longitude) > 180) longitude /= 10_000_000;
  if (Math.abs(latitude) > 90) latitude /= 10_000_000;
  return validKoreaCoordinates(latitude, longitude) ? { latitude, longitude } : null;
}

async function searchNaverLocal(
  query: string,
  credentials: { clientId: string; clientSecret: string },
  allowFirst = false,
) {
  const url = new URL(NAVER_API_HUB_LOCAL_SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("display", "5");
  url.searchParams.set("start", "1");
  url.searchParams.set("sort", "random");
  url.searchParams.set("format", "json");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-NCP-APIGW-API-KEY-ID": credentials.clientId,
      "X-NCP-APIGW-API-KEY": credentials.clientSecret,
    },
    signal: AbortSignal.timeout(LOCAL_SEARCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`NAVER_LOCAL_SEARCH_FAILED_${response.status}`);

  const payload = await response.json();
  const items = Array.isArray(payload?.items) ? payload.items : [];
  const validItems = items.filter((item: Record<string, unknown>) => localSearchCoordinates(item));
  if (!validItems.length) return null;

  const matched = validItems.find((item: Record<string, unknown>) => relatedPlaceName(String(item.title ?? ""), query));
  const item = matched ?? (allowFirst ? validItems[0] : null);
  if (!item) return null;

  const coordinates = localSearchCoordinates(item);
  if (!coordinates) return null;
  return {
    ...coordinates,
    placeName: decodeHtmlText(item.title),
    address: normalizedText(item.roadAddress) || normalizedText(item.address) || null,
  };
}

async function resolveByLocalSearch(
  candidates: Array<{ query: string; allowFirst: boolean }>,
  credentials: { clientId: string; clientSecret: string } | null,
) {
  if (!credentials) return null;

  for (const candidate of candidates) {
    const result = await searchNaverLocal(candidate.query, credentials, candidate.allowFirst);
    if (result) return result;
  }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "METHOD_NOT_ALLOWED" }, 405);

  try {
    const payload = await req.json();
    const locationName = normalizedText(payload?.location_name);
    const rawUrl = normalizedText(payload?.url);
    if (!locationName && !rawUrl) return jsonResponse({ error: "LOCATION_REQUIRED" }, 400);

    let mapUrl: URL | null = null;
    if (rawUrl) {
      try {
        mapUrl = new URL(rawUrl);
      } catch {
        return jsonResponse({ error: "INVALID_URL" }, 400);
      }
      if (!validResolverUrl(mapUrl)) return jsonResponse({ error: "UNSUPPORTED_URL" }, 400);
    }

    const credentials = naverApiHubCredentials();
    const candidates: Array<{ query: string; allowFirst: boolean }> = [];
    appendCandidate(candidates, locationName);

    const nameResult = await resolveByLocalSearch(candidates, credentials);
    if (nameResult) {
      return jsonResponse({
        resolved_url: mapUrl?.toString() ?? null,
        place_name: nameResult.placeName,
        address: nameResult.address,
        latitude: nameResult.latitude,
        longitude: nameResult.longitude,
        source: "naver_local_search",
        local_search_configured: true,
      });
    }

    if (!mapUrl) {
      return jsonResponse({
        resolved_url: null,
        place_name: null,
        address: null,
        latitude: null,
        longitude: null,
        source: null,
        local_search_configured: Boolean(credentials),
        error: credentials ? "NAVER_LOCATION_NOT_FOUND" : "NAVER_LOCAL_SEARCH_NOT_CONFIGURED",
      });
    }

    const directCoordinates = coordinatesFromUrl(mapUrl);
    if (directCoordinates) {
      return jsonResponse({
        resolved_url: mapUrl.toString(),
        place_name: null,
        address: null,
        ...directCoordinates,
        source: "naver_url_coordinates",
        local_search_configured: Boolean(credentials),
      });
    }

    const { response, resolvedUrl } = await fetchResolvedNaverUrl(mapUrl);
    if (!response.ok) {
      return jsonResponse({ error: "NAVER_REQUEST_FAILED", status: response.status }, 502);
    }

    const resolvedCoordinates = coordinatesFromUrl(resolvedUrl);
    if (resolvedCoordinates) {
      return jsonResponse({
        resolved_url: resolvedUrl.toString(),
        place_name: null,
        address: null,
        ...resolvedCoordinates,
        source: "naver_resolved_url_coordinates",
        local_search_configured: Boolean(credentials),
      });
    }

    locationCandidatesFromUrl(mapUrl).forEach((candidate) => appendCandidate(candidates, candidate.query));
    locationCandidatesFromUrl(resolvedUrl).forEach((candidate) => appendCandidate(candidates, candidate.query));

    let metadata = await metadataFromResponse(response);
    const placeId = placeIdFromUrl(resolvedUrl);
    if (placeId) {
      const placeMetadata = await metadataFromPlaceId(placeId);
      metadata = {
        name: placeMetadata.name ?? metadata.name,
        address: placeMetadata.address ?? metadata.address,
      };
    }

    appendCandidate(candidates, metadata.name);
    appendCandidate(candidates, metadata.address, true);

    const linkResult = await resolveByLocalSearch(candidates, credentials);
    if (linkResult) {
      return jsonResponse({
        resolved_url: resolvedUrl.toString(),
        place_name: linkResult.placeName,
        address: linkResult.address ?? metadata.address,
        latitude: linkResult.latitude,
        longitude: linkResult.longitude,
        source: "naver_local_search_from_link",
        local_search_configured: true,
      });
    }

    return jsonResponse({
      resolved_url: resolvedUrl.toString(),
      place_name: metadata.name,
      address: metadata.address,
      latitude: null,
      longitude: null,
      source: metadata.name || metadata.address ? "naver_place_metadata" : null,
      local_search_configured: Boolean(credentials),
      error: credentials ? "NAVER_LOCATION_NOT_FOUND" : "NAVER_LOCAL_SEARCH_NOT_CONFIGURED",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    const status = message === "UNTRUSTED_NAVER_REDIRECT" ? 422 : 502;
    return jsonResponse({ error: message }, status);
  }
});
