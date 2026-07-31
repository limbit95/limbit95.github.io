const routes = [];
let notFoundHandler = null;
let beforeHandler = null;
let started = false;

function normalizeHash(hash = window.location.hash) {
  const raw = hash.replace(/^#/, "") || "/";
  const [pathPart, queryString = ""] = raw.split("?");
  const path = `/${pathPart}`.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  return { path, query: new URLSearchParams(queryString) };
}

function compilePattern(pattern) {
  const keys = [];
  const source = pattern
    .replace(/\/$/, "")
    .replace(/:[^/]+/g, (match) => {
      keys.push(match.slice(1));
      return "([^/]+)";
    });
  return { regex: new RegExp(`^${source || "/"}$`), keys };
}

export function registerRoute(pattern, handler, meta = {}) {
  const compiled = compilePattern(pattern);
  routes.push({ pattern, handler, meta, ...compiled });
}

export function setNotFound(handler) {
  notFoundHandler = handler;
}

export function setBeforeRoute(handler) {
  beforeHandler = handler;
}

export function navigate(path, { replace = false } = {}) {
  const normalized = path.startsWith("#") ? path : `#${path.startsWith("/") ? path : `/${path}`}`;
  if (replace) window.location.replace(normalized);
  else window.location.hash = normalized;
}

export function getCurrentRoute() {
  const { path, query } = normalizeHash();
  for (const route of routes) {
    const match = path.match(route.regex);
    if (!match) continue;
    const params = Object.fromEntries(route.keys.map((key, index) => [key, decodeURIComponent(match[index + 1])]));
    return { ...route, path, query, params };
  }
  return { path, query, params: {}, handler: notFoundHandler, meta: { title: "페이지 없음" } };
}

export async function resolveRoute() {
  const route = getCurrentRoute();
  if (beforeHandler) {
    const proceed = await beforeHandler(route);
    if (proceed === false) return;
  }
  if (route.handler) await route.handler(route);
}

export function startRouter() {
  if (started) return resolveRoute();
  started = true;
  window.addEventListener("hashchange", resolveRoute);
  return resolveRoute();
}
