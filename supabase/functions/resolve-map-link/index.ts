import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 8000;
const NAVER_SHORT_HOST = "naver.me";

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

function validKoreaCoordinates(latitude: number, longitude: number) {
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= 32
    && latitude <= 39.5
    && longitude >= 124
    && longitude <= 132;
}

function trustedNaverMapUrl(url: URL) {
  if (url.protocol !== "https:") return false;

  const hostname = url.hostname.toLocaleLowerCase("en-US");
  return hostname === NAVER_SHORT_HOST
    || hostname === "map.naver.com"
    || hostname === "m.map.naver.com"
    || hostname === "place.naver.com"
    || hostname.endsWith(".place.naver.com");
}

function validShortUrl(url: URL) {
  return url.protocol === "https:"
    && url.hostname.toLocaleLowerCase("en-US") === NAVER_SHORT_HOST
    && !url.username
    && !url.password
    && !url.port
    && /^\/[A-Za-z0-9_-]+\/?$/.test(url.pathname);
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

function coordinatesFromHtml(html: string) {
  const normalized = html
    .replaceAll("&quot;", '"')
    .replaceAll("\\\"", '"');

  const patterns = [
    {
      regex: /"latitude"\s*:\s*"?(-?\d+(?:\.\d+)?)"?[\s\S]{0,180}?"longitude"\s*:\s*"?(-?\d+(?:\.\d+)?)"?/i,
      latitudeIndex: 1,
      longitudeIndex: 2,
    },
    {
      regex: /"longitude"\s*:\s*"?(-?\d+(?:\.\d+)?)"?[\s\S]{0,180}?"latitude"\s*:\s*"?(-?\d+(?:\.\d+)?)"?/i,
      latitudeIndex: 2,
      longitudeIndex: 1,
    },
    {
      regex: /"lat"\s*:\s*"?(-?\d+(?:\.\d+)?)"?[\s\S]{0,180}?"lng"\s*:\s*"?(-?\d+(?:\.\d+)?)"?/i,
      latitudeIndex: 1,
      longitudeIndex: 2,
    },
    {
      regex: /"lng"\s*:\s*"?(-?\d+(?:\.\d+)?)"?[\s\S]{0,180}?"lat"\s*:\s*"?(-?\d+(?:\.\d+)?)"?/i,
      latitudeIndex: 2,
      longitudeIndex: 1,
    },
    {
      regex: /"y"\s*:\s*"?(-?\d+(?:\.\d+)?)"?[\s\S]{0,120}?"x"\s*:\s*"?(-?\d+(?:\.\d+)?)"?/i,
      latitudeIndex: 1,
      longitudeIndex: 2,
    },
    {
      regex: /"x"\s*:\s*"?(-?\d+(?:\.\d+)?)"?[\s\S]{0,120}?"y"\s*:\s*"?(-?\d+(?:\.\d+)?)"?/i,
      latitudeIndex: 2,
      longitudeIndex: 1,
    },
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern.regex);
    if (!match) continue;

    const coordinates = coordinatePair(
      match[pattern.latitudeIndex],
      match[pattern.longitudeIndex],
    );
    if (coordinates) return coordinates;
  }

  return null;
}

async function fetchResolvedNaverUrl(initialUrl: URL) {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 (compatible; CheongpaLocationResolver/1.0)",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("NAVER_REDIRECT_WITHOUT_LOCATION");

      const nextUrl = new URL(location, currentUrl);
      if (!trustedNaverMapUrl(nextUrl)) {
        throw new Error("UNTRUSTED_NAVER_REDIRECT");
      }
      currentUrl = nextUrl;
      continue;
    }

    return { response, resolvedUrl: currentUrl };
  }

  throw new Error("TOO_MANY_REDIRECTS");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "METHOD_NOT_ALLOWED" }, 405);
  }

  try {
    const payload = await req.json();
    const rawUrl = String(payload?.url ?? "").trim();
    if (!rawUrl) return jsonResponse({ error: "URL_REQUIRED" }, 400);

    let shortUrl: URL;
    try {
      shortUrl = new URL(rawUrl);
    } catch {
      return jsonResponse({ error: "INVALID_URL" }, 400);
    }

    if (!validShortUrl(shortUrl)) {
      return jsonResponse({ error: "UNSUPPORTED_URL" }, 400);
    }

    const { response, resolvedUrl } = await fetchResolvedNaverUrl(shortUrl);
    if (!response.ok) {
      return jsonResponse({ error: "NAVER_REQUEST_FAILED", status: response.status }, 502);
    }

    let coordinates = coordinatesFromUrl(resolvedUrl);
    if (!coordinates) {
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("text/html")) {
        const html = await response.text();
        coordinates = coordinatesFromHtml(html);
      }
    }

    return jsonResponse({
      resolved_url: resolvedUrl.toString(),
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    const status = message === "UNTRUSTED_NAVER_REDIRECT" ? 422 : 502;
    return jsonResponse({ error: message }, status);
  }
});
