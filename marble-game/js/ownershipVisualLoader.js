import {
  isOnlineMarbleSession,
  logMarbleRenderStep,
  markOnlineVisualRuntime,
  shouldStartOwnershipRenderer,
} from "./onlineVisualPolicy.js?v=20260910-r9";

const online = isOnlineMarbleSession();
const mode = online ? markOnlineVisualRuntime() : "full";

function setOwnershipStatus(status) {
  if (document.body?.dataset) document.body.dataset.onlineOwnershipRenderer = status;
}

function waitForMainRenderer() {
  if (!online) return Promise.resolve(true);
  if (document.body.dataset.onlineRenderer === "ready") return Promise.resolve(true);
  if (document.body.dataset.onlineRenderer === "failed") return Promise.resolve(false);
  if (typeof MutationObserver === "undefined") return Promise.resolve(false);

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const status = document.body.dataset.onlineRenderer;
      if (status !== "ready" && status !== "failed") return;
      observer.disconnect();
      resolve(status === "ready");
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-online-renderer"],
    });
  });
}

async function startOwnershipVisual() {
  if (!shouldStartOwnershipRenderer()) {
    setOwnershipStatus("disabled");
    logMarbleRenderStep("ownership-disabled", { details: { mode } });
    return;
  }

  if (online) {
    setOwnershipStatus("waiting-main");
    const mainReady = await waitForMainRenderer();
    if (!mainReady) {
      setOwnershipStatus("skipped");
      return;
    }
  }

  setOwnershipStatus("loading");
  try {
    await import("./themes/classic/ownershipVisual.js?v=20260910-r9");
    setOwnershipStatus("ready");
    logMarbleRenderStep("ownership-ready", { details: { mode } });
  } catch (error) {
    setOwnershipStatus("failed");
    console.warn("Marble ownership visual failed to initialize", error);
  }
}

void startOwnershipVisual();
