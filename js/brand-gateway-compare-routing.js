const PUBLIC_BRAND_ROUTES = new Set(["/gateway", "/like", "/value"]);

function routePath(hash) {
  const raw = String(hash || "#/gateway").replace(/^#/, "") || "/gateway";
  return (`/${raw.split("?")[0]}`).replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}

function appRouteUrl(href) {
  const appRoot = new URL("./", window.location.href);
  appRoot.search = "";
  appRoot.hash = href;
  return appRoot.href;
}

function bindPreviewRouting(iframe) {
  const bind = () => {
    let frameWindow;
    try {
      frameWindow = iframe.contentWindow;
      if (!frameWindow || !String(frameWindow.location.href).startsWith("blob:")) return;
    } catch {
      return;
    }

    if (frameWindow.__brandCompareAppRoutingBound) return;
    frameWindow.__brandCompareAppRoutingBound = true;

    frameWindow.addEventListener("click", (event) => {
      const anchor = event.target?.closest?.("a[href^='#/']");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (PUBLIC_BRAND_ROUTES.has(routePath(href))) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      frameWindow.location.assign(appRouteUrl(href));
    }, true);
  };

  iframe.addEventListener("load", bind);
  bind();
}

document.querySelectorAll(".preview-card iframe").forEach(bindPreviewRouting);
