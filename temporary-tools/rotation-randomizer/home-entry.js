const ENTRY_ID = "temporary-rotation-randomizer-entry";
const HOME_HASHES = new Set(["", "#", "#/"]);

function isHomeRoute() {
  return HOME_HASHES.has(window.location.hash);
}

function syncRotationEntry() {
  const existing = document.getElementById(ENTRY_ID);

  if (!isHomeRoute()) {
    existing?.remove();
    return;
  }

  const container = document.querySelector("#app .page-container");
  if (!container || existing?.parentElement === container) return;

  existing?.remove();

  const wrapper = document.createElement("div");
  wrapper.id = ENTRY_ID;
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "flex-end";

  const link = document.createElement("a");
  link.className = "button button--ghost";
  link.href = "./temporary-tools/rotation-randomizer/";
  link.textContent = "로테이션 랜덤 생성";

  wrapper.append(link);
  container.append(wrapper);
}

window.addEventListener("hashchange", syncRotationEntry);

const app = document.getElementById("app");
if (app) {
  new MutationObserver(syncRotationEntry).observe(app, {
    childList: true,
    subtree: true,
  });
}

syncRotationEntry();
