let lastResultKey = "";
let syncQueued = false;

function syncResultPresentation() {
  syncQueued = false;

  const result = document.querySelector("[data-online-result]");
  if (!result || result.hidden) {
    lastResultKey = "";
    return;
  }

  const kicker = result.querySelector("[data-online-result-kicker]")?.textContent?.trim();
  const outcome = kicker === "MISSION COMPLETE" ? "won" : kicker === "GAME OVER" ? "lost" : "";
  if (!outcome) return;

  result.dataset.outcome = outcome;
  result.setAttribute("role", "dialog");
  result.setAttribute("aria-modal", "true");
  result.setAttribute("aria-label", outcome === "won" ? "게임 승리 결과" : "게임 패배 결과");

  const title = result.querySelector("[data-online-result-title]");
  const explicitTitle = outcome === "won" ? "승리!" : "패배";
  if (title && title.textContent !== explicitTitle) title.textContent = explicitTitle;

  const turnTitle = document.querySelector("[data-online-turn]");
  if (turnTitle && turnTitle.textContent !== explicitTitle) turnTitle.textContent = explicitTitle;

  const resultKey = `${outcome}:${result.querySelector("[data-online-result-played]")?.textContent ?? ""}:${result.querySelector("[data-online-result-remaining]")?.textContent ?? ""}`;
  if (lastResultKey !== resultKey) {
    lastResultKey = resultKey;
    requestAnimationFrame(() => {
      result.scrollIntoView({ block: "center" });
      result.querySelector("button:not(:disabled)")?.focus({ preventScroll: true });
    });
  }
}

function queueSync() {
  if (syncQueued) return;
  syncQueued = true;
  queueMicrotask(syncResultPresentation);
}

const observer = new MutationObserver(queueSync);
observer.observe(document.body, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ["hidden"],
});

queueSync();
