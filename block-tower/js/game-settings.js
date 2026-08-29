import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

const STORAGE_KEY = "block-tower-game-settings-v1";
const selectionStatus = document.querySelector("#selection-status");
const physicsDifficultyStatus = document.querySelector("#difficulty-status");
const gameDifficultyStatus = document.querySelector("#game-difficulty-status");
const gameSettingsToggle = document.querySelector("#game-settings-toggle");
const gameSettingsPanel = document.querySelector("#game-settings-panel");
const gameSettingsClose = document.querySelector("#game-settings-close");
const physicsSettingsToggle = document.querySelector("#physics-settings-toggle");
const physicsSettingsPanel = document.querySelector("#physics-settings-panel");
const autoPlacementAssistInput = document.querySelector("#game-auto-placement-assist");
const placementGuideInput = document.querySelector("#game-placement-guide");
const allowFloorDropInput = document.querySelector("#game-allow-floor-drop");
const themeSelect = document.querySelector("#game-theme");

const GAME_PRESETS = Object.freeze({
  casual: {
    autoPlacementAssist: true,
    placementGuide: true,
    allowFloorDrop: true,
  },
  standard: {
    autoPlacementAssist: false,
    placementGuide: false,
    allowFloorDrop: false,
  },
});

const GAME_DIFFICULTY_LABELS = Object.freeze({
  casual: "캐주얼",
  standard: "정통",
  custom: "커스텀",
});

const THEMES = Object.freeze({
  classic: [0xb9793f, 0xc6894c, 0xd09355, 0xbf7f45, 0xca8a50, 0xb8753e],
  walnut: [0x5d3b27, 0x69452f, 0x765039, 0x543421, 0x62402b, 0x704a32],
  colorMix: [0xd36f5f, 0x6f95c9, 0xd5a754, 0x6ca983, 0xa881bf, 0xd98c55],
});

const DEFAULT_SETTINGS = Object.freeze({
  difficulty: "standard",
  autoPlacementAssist: false,
  placementGuide: false,
  allowFloorDrop: false,
  theme: "classic",
});

function normalizeSettings(value = {}) {
  const next = { ...DEFAULT_SETTINGS, ...value };
  if (!Object.hasOwn(GAME_DIFFICULTY_LABELS, next.difficulty)) next.difficulty = "custom";
  if (!Object.hasOwn(THEMES, next.theme)) next.theme = "classic";
  next.autoPlacementAssist = Boolean(next.autoPlacementAssist);
  next.placementGuide = Boolean(next.placementGuide);
  next.allowFloorDrop = Boolean(next.allowFloorDrop);
  return next;
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return normalizeSettings(saved ?? DEFAULT_SETTINGS);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

let settings = loadSettings();
const runtime = window.__blockTowerGameRuntime ?? {
  scene: null,
  camera: null,
  dragMarker: null,
  orbitTarget: new THREE.Vector3(0, 5.3, 0),
};
window.__blockTowerGameRuntime = runtime;
window.__blockTowerGameSettings = settings;

function persistSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Local storage can be unavailable in privacy modes. The current session still keeps the setting.
  }
}

function syncPhysicsDifficultyLabel() {
  if (!physicsDifficultyStatus) return;
  if (physicsDifficultyStatus.textContent.startsWith("난이도 ·")) {
    physicsDifficultyStatus.textContent = physicsDifficultyStatus.textContent.replace("난이도 ·", "물리 ·");
  }
}

syncPhysicsDifficultyLabel();
if (physicsDifficultyStatus) {
  new MutationObserver(syncPhysicsDifficultyLabel).observe(physicsDifficultyStatus, {
    childList: true,
    characterData: true,
    subtree: true,
  });
}

function isPlacementGhost(object) {
  return Boolean(
    object?.isMesh
    && object.userData?.slotIndex !== undefined
    && object.material?.isMeshBasicMaterial
    && object.geometry?.type === "BoxGeometry",
  );
}

function isDragMarker(object) {
  return Boolean(
    object?.isMesh
    && object.geometry?.type === "SphereGeometry"
    && object.material?.isMeshBasicMaterial
    && object.material.color?.getHex() === 0xffc27e,
  );
}

function isTowerBlock(object) {
  return Boolean(
    object?.isMesh
    && object.userData?.index !== undefined
    && object.material?.isMeshStandardMaterial,
  );
}

function applyThemeToBlock(object) {
  if (!isTowerBlock(object)) return;
  const palette = THEMES[settings.theme] ?? THEMES.classic;
  const color = palette[object.userData.index % palette.length];
  if (object.material.color.getHex() !== color) object.material.color.setHex(color);
  object.material.userData.blockTowerTheme = settings.theme;
}

function patchPlacementGhostVisibility(ghost) {
  if (!isPlacementGhost(ghost) || ghost.userData.gameSettingsVisibilityPatched) return;
  let requestedVisibility = Boolean(ghost.visible);
  Object.defineProperty(ghost, "visible", {
    configurable: true,
    enumerable: true,
    get() {
      return settings.placementGuide && requestedVisibility;
    },
    set(value) {
      requestedVisibility = Boolean(value);
    },
  });
  ghost.userData.gameSettingsVisibilityPatched = true;
}

function syncRuntimeScene() {
  if (!runtime.scene) return;
  runtime.scene.traverse((object) => {
    if (isDragMarker(object)) runtime.dragMarker = object;
    if (isTowerBlock(object)) applyThemeToBlock(object);
    if (isPlacementGhost(object)) patchPlacementGhostVisibility(object);
  });
}

function installThreeRuntimeHooks() {
  const object3dPrototype = THREE.Object3D.prototype;
  if (!object3dPrototype.__blockTowerRuntimeAddPatched) {
    const originalAdd = object3dPrototype.add;
    Object.defineProperty(object3dPrototype, "__blockTowerRuntimeAddPatched", { value: true });
    object3dPrototype.add = function addWithBlockTowerRuntime(...objects) {
      const result = originalAdd.apply(this, objects);
      if (this.isScene) {
        runtime.scene = this;
        queueMicrotask(syncRuntimeScene);
      }
      return result;
    };
  }

  const raycasterPrototype = THREE.Raycaster.prototype;
  if (!raycasterPrototype.__blockTowerRuntimeCameraPatched) {
    const originalSetFromCamera = raycasterPrototype.setFromCamera;
    Object.defineProperty(raycasterPrototype, "__blockTowerRuntimeCameraPatched", { value: true });
    raycasterPrototype.setFromCamera = function setFromCameraWithBlockTowerRuntime(coords, camera) {
      runtime.camera = camera;
      return originalSetFromCamera.call(this, coords, camera);
    };
  }
}

function installRapierRuntimeHooks() {
  const rigidBodyPrototype = RAPIER.RigidBody?.prototype;
  if (!rigidBodyPrototype || rigidBodyPrototype.__blockTowerPlacementAssistPatched) return;

  const originalAddForce = rigidBodyPrototype.addForce;
  const originalAddTorque = rigidBodyPrototype.addTorque;
  Object.defineProperty(rigidBodyPrototype, "__blockTowerPlacementAssistPatched", { value: true });

  rigidBodyPrototype.addForce = function addForceWithGameSettings(force, wakeUp) {
    const placementIsActive = selectionStatus?.textContent.includes("최상단 정렬 중");
    if (placementIsActive && !settings.autoPlacementAssist) return undefined;
    return originalAddForce.call(this, force, wakeUp);
  };

  rigidBodyPrototype.addTorque = function addTorqueWithGameSettings(torque, wakeUp) {
    const placementIsActive = selectionStatus?.textContent.includes("최상단 정렬 중");
    if (placementIsActive && !settings.autoPlacementAssist) return undefined;
    return originalAddTorque.call(this, torque, wakeUp);
  };
}

installThreeRuntimeHooks();
void RAPIER.init()
  .then(installRapierRuntimeHooks)
  .catch((error) => console.warn("Block Tower game-setting physics hook could not initialize.", error));

function syncControls() {
  window.__blockTowerGameSettings = settings;
  if (gameDifficultyStatus) {
    gameDifficultyStatus.textContent = `게임 · ${GAME_DIFFICULTY_LABELS[settings.difficulty] ?? "커스텀"}`;
  }
  if (autoPlacementAssistInput) autoPlacementAssistInput.checked = settings.autoPlacementAssist;
  if (placementGuideInput) placementGuideInput.checked = settings.placementGuide;
  if (allowFloorDropInput) allowFloorDropInput.checked = settings.allowFloorDrop;
  if (themeSelect) themeSelect.value = settings.theme;

  document.querySelectorAll("[data-game-difficulty]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.gameDifficulty === settings.difficulty);
  });

  syncRuntimeScene();
}

function updateSettings(patch, { markCustom = false } = {}) {
  settings = normalizeSettings({
    ...settings,
    ...patch,
    ...(markCustom ? { difficulty: "custom" } : {}),
  });
  persistSettings();
  syncControls();
}

function applyGamePreset(name) {
  const preset = GAME_PRESETS[name];
  if (!preset) return;
  updateSettings({
    ...preset,
    difficulty: name,
  });
}

function closeGameSettings() {
  if (!gameSettingsPanel) return;
  gameSettingsPanel.hidden = true;
  gameSettingsToggle?.setAttribute("aria-expanded", "false");
}

gameSettingsToggle?.addEventListener("click", () => {
  const willOpen = gameSettingsPanel?.hidden ?? false;
  if (!gameSettingsPanel) return;
  gameSettingsPanel.hidden = !willOpen;
  gameSettingsToggle.setAttribute("aria-expanded", String(willOpen));
  if (willOpen && physicsSettingsPanel) {
    physicsSettingsPanel.hidden = true;
    physicsSettingsToggle?.setAttribute("aria-expanded", "false");
  }
});

gameSettingsClose?.addEventListener("click", closeGameSettings);
physicsSettingsToggle?.addEventListener("click", closeGameSettings, { capture: true });

document.querySelectorAll("[data-game-difficulty]").forEach((button) => {
  button.addEventListener("click", () => applyGamePreset(button.dataset.gameDifficulty));
});

autoPlacementAssistInput?.addEventListener("change", () => {
  updateSettings({ autoPlacementAssist: autoPlacementAssistInput.checked }, { markCustom: true });
});

placementGuideInput?.addEventListener("change", () => {
  updateSettings({ placementGuide: placementGuideInput.checked }, { markCustom: true });
});

allowFloorDropInput?.addEventListener("change", () => {
  updateSettings({ allowFloorDrop: allowFloorDropInput.checked }, { markCustom: true });
});

themeSelect?.addEventListener("change", () => {
  updateSettings({ theme: themeSelect.value });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && gameSettingsPanel && !gameSettingsPanel.hidden) {
    closeGameSettings();
  }
});

syncControls();
