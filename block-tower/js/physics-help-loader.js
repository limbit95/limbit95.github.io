const physicsSettingsFields = document.querySelector("#physics-settings-fields");

function hasPhysicsSettingRows() {
  return Boolean(physicsSettingsFields?.querySelector(".physics-setting-row"));
}

let helpLoaded = false;

async function loadPhysicsHelp() {
  if (helpLoaded) return;
  helpLoaded = true;
  try {
    await import("./physics-help.js");
  } catch (error) {
    helpLoaded = false;
    console.error("Block Tower physics help could not be loaded.", error);
  }
}

if (hasPhysicsSettingRows()) {
  void loadPhysicsHelp();
} else if (physicsSettingsFields) {
  const observer = new MutationObserver(() => {
    if (!hasPhysicsSettingRows()) return;
    observer.disconnect();
    void loadPhysicsHelp();
  });
  observer.observe(physicsSettingsFields, { childList: true, subtree: true });
}
