function requireEventTarget(value, name) {
  if (
    !value
    || typeof value.addEventListener !== "function"
    || typeof value.removeEventListener !== "function"
  ) {
    throw new TypeError(`Reconnect refresh requires a valid ${name} event target.`);
  }
  return value;
}

export function createReconnectRefreshTriggers({
  refresh,
  windowTarget = globalThis.window,
  documentTarget = globalThis.document,
  onError = () => {},
}) {
  if (typeof refresh !== "function") {
    throw new TypeError("Reconnect refresh requires refresh().");
  }
  if (typeof onError !== "function") {
    throw new TypeError("Reconnect refresh onError must be a function.");
  }

  const browserWindow = requireEventTarget(windowTarget, "window");
  const browserDocument = requireEventTarget(documentTarget, "document");
  let started = false;

  function requestRefresh(reason) {
    Promise.resolve(refresh(reason)).catch((error) => onError(error, { reason }));
  }

  const onOnline = () => requestRefresh("online");
  const onPageShow = () => requestRefresh("pageshow");
  const onVisibilityChange = () => {
    if (browserDocument.visibilityState === "visible") {
      requestRefresh("visibility");
    }
  };

  function start() {
    if (started) return;
    started = true;
    browserWindow.addEventListener("online", onOnline);
    browserWindow.addEventListener("pageshow", onPageShow);
    browserDocument.addEventListener("visibilitychange", onVisibilityChange);
  }

  function stop() {
    if (!started) return;
    started = false;
    browserWindow.removeEventListener("online", onOnline);
    browserWindow.removeEventListener("pageshow", onPageShow);
    browserDocument.removeEventListener("visibilitychange", onVisibilityChange);
  }

  return Object.freeze({ start, stop });
}
