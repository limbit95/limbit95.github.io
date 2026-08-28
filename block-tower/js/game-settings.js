import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

const STORAGE_KEY = "block-tower-game-settings-v1";
const sceneHost = document.querySelector("#scene");
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
const themeSelect = document.querySelector("#game-theme");

const GAME_PRESETS = Object.freeze({
  casual: {
    autoPlacementAssist: true,
    placementGuide: true,
  },
  standard: {
    autoPlacementAssist: false,
    placementGuide: false,
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
  theme: "classic",
});

function normalizeSettings(value = {}) {
  const next = { ...DEFAULT_SETTINGS, ...value };
  if (!Object.hasOwn(GAME_DIFFICULTY_LABELS, next.difficulty)) next.difficulty = "custom";
  if (!Object.hasOwn(THEMES, next.theme)) next.theme = "classic";
  next.autoPlacementAssist = Boolean(next.autoPlacementAssist);
  next.placementGuide = Boolean(next.placementGuide);
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
window.__blockTowerGameSettings = settings;
window.__blockTowerGameRuntime = {
  scene: null,
  camera: null,
  dragMarker: null,
  orbitTarget: new THREE.Vector3(0, 5.3, 0),
};

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

function syncControls() {
  window.__blockTowerGameSettings = settings;
  if (gameDifficultyStatus) {
    gameDifficultyStatus.textContent = `게임 · ${GAME_DIFFICULTY_LABELS[settings.difficulty] ?? "커스텀"}`;
  }
  if (autoPlacementAssistInput) autoPlacementAssistInput.checked = settings.autoPlacementAssist;
  if (placementGuideInput) placementGuideInput.checked = settings.placementGuide;
  if (themeSelect) themeSelect.value = settings.theme;

  document.querySelectorAll("[data-game-difficulty]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.gameDifficulty === settings.difficulty);
  });
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

function isPlacementGhost(object) {
  return Boolean(
    object?.isMesh
    && object.userData?.slotIndex !== undefined
    && object.material?.isMeshBasicMaterial,
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

function applyThemeToBlock(object) {
  if (!object?.isMesh || object.userData?.index === undefined || !object.material?.isMeshStandardMaterial) return;
  if (object.material.userData.blockTowerTheme === settings.theme) return;
  const palette = THEMES[settings.theme] ?? THEMES.classic;
  object.material.color.setHex(palette[object.userData.index % palette.length]);
  object.material.userData.blockTowerTheme = settings.theme;
}

const originalRender = THREE.WebGLRenderer.prototype.render;
if (!THREE.WebGLRenderer.prototype.__blockTowerGameSettingsPatched) {
  Object.defineProperty(THREE.WebGLRenderer.prototype, "__blockTowerGameSettingsPatched", {
    value: true,
  });

  THREE.WebGLRenderer.prototype.render = function renderWithGameSettings(scene, camera) {
    const temporarilyHidden = [];
    const runtime = window.__blockTowerGameRuntime;
    runtime.scene = scene;
    runtime.camera = camera;
    runtime.dragMarker = null;

    scene.traverse((object) => {
      applyThemeToBlock(object);
      if (isDragMarker(object)) runtime.dragMarker = object;
      if (!settings.placementGuide && isPlacementGhost(object) && object.visible) {
        temporarilyHidden.push(object);
        object.visible = false;
      }
    });

    try {
      return originalRender.call(this, scene, camera);
    } finally {
      temporarilyHidden.forEach((object) => {
        object.visible = true;
      });
    }
  };
}

const rigidBodyPrototype = RAPIER.RigidBody?.prototype;
if (rigidBodyPrototype && !rigidBodyPrototype.__blockTowerPlacementAssistPatched) {
  const originalAddForce = rigidBodyPrototype.addForce;
  const originalAddTorque = rigidBodyPrototype.addTorque;

  Object.defineProperty(rigidBodyPrototype, "__blockTowerPlacementAssistPatched", {
    value: true,
  });

  rigidBodyPrototype.addForce = function addForceWithGameSetting(force, wakeUp) {
    const placementIsActive = selectionStatus?.textContent.includes("최상단 정렬 중");
    if (placementIsActive && !settings.autoPlacementAssist) return undefined;
    return originalAddForce.call(this, force, wakeUp);
  };

  rigidBodyPrototype.addTorque = function addTorqueWithGameSetting(torque, wakeUp) {
    const placementIsActive = selectionStatus?.textContent.includes("최상단 정렬 중");
    if (placementIsActive && !settings.autoPlacementAssist) return undefined;
    return originalAddTorque.call(this, torque, wakeUp);
  };
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

themeSelect?.addEventListener("change", () => {
  updateSettings({ theme: themeSelect.value });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && gameSettingsPanel && !gameSettingsPanel.hidden) {
    closeGameSettings();
  }
});

syncControls();
