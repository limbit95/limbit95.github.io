import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import RAPIER from "@dimforge/rapier3d-compat";
import { getAuthState, initializeAuth, subscribeAuth } from "../../js/auth.js";
import { supabase } from "../../js/supabaseClient.js";

const sceneHost = document.querySelector("#scene");
const loading = document.querySelector("#loading");
const selectionStatus = document.querySelector("#selection-status");
const difficultyStatus = document.querySelector("#difficulty-status");
const turnStatus = document.querySelector("#turn-status");
const physicsSettingsToggle = document.querySelector("#physics-settings-toggle");
const physicsSettingsPanel = document.querySelector("#physics-settings-panel");
const physicsSettingsClose = document.querySelector("#physics-settings-close");
const physicsSettingsFields = document.querySelector("#physics-settings-fields");
const physicsSettingsSave = document.querySelector("#physics-settings-save");
const physicsSettingsReload = document.querySelector("#physics-settings-reload");
const physicsSettingsMessage = document.querySelector("#physics-settings-message");
const physicsMetricBlock = document.querySelector("#physics-metric-block");
const physicsMetricSpeed = document.querySelector("#physics-metric-speed");
const physicsMetricForce = document.querySelector("#physics-metric-force");
const physicsMetricAssist = document.querySelector("#physics-metric-assist");

if (!sceneHost) throw new Error("3D scene container was not found.");

const BLOCK_LENGTH = 4.5;
const BLOCK_WIDTH = 1.42;
const BLOCK_HEIGHT = 0.72;
const GAP = 0.055;
const LEVELS = 18;
const PHYSICS_STEP = 1 / 60;
const LEVEL_STEP = BLOCK_HEIGHT + GAP * 0.28;
const EXTRACTION_AXIS_DISTANCE = 3.35;
const EXTRACTION_HORIZONTAL_DISTANCE = 3.1;
const EXTRACTED_GRAB_DISTANCE = 18;
const PLACEMENT_RELEASE_DISTANCE = 1.65;
const PLACEMENT_ASSIST_MAX_DISTANCE = 2.5;
const PLACEMENT_ASSIST_TIMEOUT_MS = 3200;
const PLACEMENT_POSITION_SPRING = 86;
const PLACEMENT_POSITION_DAMPING = 13;
const PLACEMENT_MAX_FORCE = 185;
const PLACEMENT_ROTATION_SPRING = 42;
const PLACEMENT_ROTATION_DAMPING = 8;
const PLACEMENT_MAX_TORQUE = 62;
const PLACEMENT_STABLE_STEPS = 10;

const DEFAULT_PHYSICS_SETTINGS = Object.freeze({
  difficulty: "normal",
  blockDensity: 0.5,
  blockFriction: 0.56,
  linearDamping: 0.24,
  angularDamping: 0.38,
  grabSpring: 115,
  grabDamping: 13,
  pointerVelocityGain: 24,
  maxGrabForce: 260,
  maxFastGrabForce: 460,
  pointerSpeedForMaxBoost: 6.5,
  maxPointerTargetSpeed: 9,
  pointerVelocitySmoothing: 0.45,
  pointerVelocityDecay: 0.82,
  maxGrabDistance: 4.2,
  lowerBreakawayMaxLevel: 10,
  breakawaySpeedStart: 2.5,
  breakawaySpeedFull: 7,
  lowerBreakawayForceBonus: 360,
  lowerBreakawayVelocityGain: 20,
  centerBlockBreakawayMultiplier: 1.45,
});

const PHYSICS_PRESETS = Object.freeze({
  easy: {
    ...DEFAULT_PHYSICS_SETTINGS,
    difficulty: "easy",
    blockDensity: 0.47,
    blockFriction: 0.5,
    grabSpring: 122,
    pointerVelocityGain: 28,
    maxGrabForce: 300,
    maxFastGrabForce: 620,
    pointerSpeedForMaxBoost: 5.8,
    lowerBreakawayMaxLevel: 11,
    breakawaySpeedStart: 2.1,
    breakawaySpeedFull: 6.2,
    lowerBreakawayForceBonus: 480,
    lowerBreakawayVelocityGain: 28,
    centerBlockBreakawayMultiplier: 1.55,
  },
  normal: { ...DEFAULT_PHYSICS_SETTINGS },
  hard: {
    ...DEFAULT_PHYSICS_SETTINGS,
    difficulty: "hard",
    blockDensity: 0.53,
    blockFriction: 0.62,
    grabSpring: 108,
    pointerVelocityGain: 21,
    maxGrabForce: 240,
    maxFastGrabForce: 430,
    pointerSpeedForMaxBoost: 7.2,
    lowerBreakawayMaxLevel: 8,
    breakawaySpeedStart: 3.1,
    breakawaySpeedFull: 8,
    lowerBreakawayForceBonus: 260,
    lowerBreakawayVelocityGain: 15,
    centerBlockBreakawayMultiplier: 1.25,
  },
});

const DIFFICULTY_LABELS = Object.freeze({
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
  custom: "커스텀",
});

const SETTINGS_COLUMNS = [
  "id",
  "difficulty",
  "block_density",
  "block_friction",
  "linear_damping",
  "angular_damping",
  "grab_spring",
  "grab_damping",
  "pointer_velocity_gain",
  "max_grab_force",
  "max_fast_grab_force",
  "pointer_speed_for_max_boost",
  "max_pointer_target_speed",
  "pointer_velocity_smoothing",
  "pointer_velocity_decay",
  "max_grab_distance",
  "lower_breakaway_max_level",
  "breakaway_speed_start",
  "breakaway_speed_full",
  "lower_breakaway_force_bonus",
  "lower_breakaway_velocity_gain",
  "center_block_breakaway_multiplier",
  "updated_at",
].join(",");

const DATABASE_SETTING_KEYS = Object.freeze({
  blockDensity: "block_density",
  blockFriction: "block_friction",
  linearDamping: "linear_damping",
  angularDamping: "angular_damping",
  grabSpring: "grab_spring",
  grabDamping: "grab_damping",
  pointerVelocityGain: "pointer_velocity_gain",
  maxGrabForce: "max_grab_force",
  maxFastGrabForce: "max_fast_grab_force",
  pointerSpeedForMaxBoost: "pointer_speed_for_max_boost",
  maxPointerTargetSpeed: "max_pointer_target_speed",
  pointerVelocitySmoothing: "pointer_velocity_smoothing",
  pointerVelocityDecay: "pointer_velocity_decay",
  maxGrabDistance: "max_grab_distance",
  lowerBreakawayMaxLevel: "lower_breakaway_max_level",
  breakawaySpeedStart: "breakaway_speed_start",
  breakawaySpeedFull: "breakaway_speed_full",
  lowerBreakawayForceBonus: "lower_breakaway_force_bonus",
  lowerBreakawayVelocityGain: "lower_breakaway_velocity_gain",
  centerBlockBreakawayMultiplier: "center_block_breakaway_multiplier",
});

const SETTING_GROUPS = Object.freeze([
  {
    title: "블록 반응",
    settings: [
      { key: "blockDensity", label: "블록 무게", min: 0.3, max: 0.8, step: 0.01 },
      { key: "blockFriction", label: "블록 마찰", min: 0.2, max: 0.9, step: 0.01 },
      { key: "linearDamping", label: "이동 감쇠", min: 0.05, max: 0.8, step: 0.01 },
      { key: "angularDamping", label: "회전 감쇠", min: 0.05, max: 1.2, step: 0.01 },
    ],
  },
  {
    title: "손 힘",
    settings: [
      { key: "grabSpring", label: "기본 그랩 반응", min: 50, max: 220, step: 1 },
      { key: "grabDamping", label: "그랩 안정화", min: 4, max: 30, step: 1 },
      { key: "pointerVelocityGain", label: "빠른 손동작 힘", min: 0, max: 80, step: 1 },
      { key: "maxGrabForce", label: "기본 최대 힘", min: 100, max: 700, step: 10 },
      { key: "maxFastGrabForce", label: "빠른 동작 최대 힘", min: 200, max: 1200, step: 10 },
      { key: "pointerSpeedForMaxBoost", label: "속도 부스트 기준", min: 2, max: 12, step: 0.1 },
    ],
  },
  {
    title: "하단·가운데 돌파",
    settings: [
      { key: "lowerBreakawayMaxLevel", label: "보조 적용 최고 층", min: 0, max: LEVELS - 1, step: 1 },
      { key: "breakawaySpeedStart", label: "보조 시작 속도", min: 0.5, max: 8, step: 0.1 },
      { key: "breakawaySpeedFull", label: "보조 최대 속도", min: 1, max: 12, step: 0.1 },
      { key: "lowerBreakawayForceBonus", label: "돌파 추가 최대 힘", min: 0, max: 1000, step: 10 },
      { key: "lowerBreakawayVelocityGain", label: "돌파 속도 힘", min: 0, max: 80, step: 1 },
      { key: "centerBlockBreakawayMultiplier", label: "가운데 블록 보정", min: 1, max: 2.5, step: 0.05 },
    ],
  },
]);

let physicsSettings = { ...DEFAULT_PHYSICS_SETTINGS };
let lastAppliedForce = 0;
let lastPointerSpeed = 0;
let lastBreakawayStrength = 0;
let lastMetricsUpdate = 0;

function clampSetting(value, min, max) {
  return THREE.MathUtils.clamp(Number(value), min, max);
}

function normalizePhysicsSettings(settings) {
  const normalized = { ...DEFAULT_PHYSICS_SETTINGS, ...settings };
  SETTING_GROUPS.forEach((group) => {
    group.settings.forEach(({ key, min, max, step }) => {
      const fallback = DEFAULT_PHYSICS_SETTINGS[key];
      const numericValue = Number.isFinite(Number(normalized[key])) ? Number(normalized[key]) : fallback;
      const clamped = clampSetting(numericValue, min, max);
      normalized[key] = step === 1 ? Math.round(clamped) : clamped;
    });
  });
  normalized.pointerVelocitySmoothing = clampSetting(normalized.pointerVelocitySmoothing, 0, 1);
  normalized.pointerVelocityDecay = clampSetting(normalized.pointerVelocityDecay, 0, 1);
  normalized.maxPointerTargetSpeed = clampSetting(normalized.maxPointerTargetSpeed, 1, 30);
  normalized.maxGrabDistance = clampSetting(normalized.maxGrabDistance, 0.5, 10);
  normalized.maxFastGrabForce = Math.max(normalized.maxFastGrabForce, normalized.maxGrabForce);
  normalized.breakawaySpeedFull = Math.max(
    normalized.breakawaySpeedFull,
    normalized.breakawaySpeedStart + 0.2,
  );
  normalized.lowerBreakawayMaxLevel = Math.min(
    Math.round(normalized.lowerBreakawayMaxLevel),
    LEVELS - 1,
  );
  normalized.difficulty = Object.hasOwn(DIFFICULTY_LABELS, normalized.difficulty)
    ? normalized.difficulty
    : "custom";
  return normalized;
}

function rowToPhysicsSettings(row) {
  if (!row) return null;
  const settings = {
    difficulty: row.difficulty,
  };
  Object.entries(DATABASE_SETTING_KEYS).forEach(([key, column]) => {
    settings[key] = row[column];
  });
  return normalizePhysicsSettings(settings);
}

function physicsSettingsToRow(settings) {
  const row = { difficulty: settings.difficulty };
  Object.entries(DATABASE_SETTING_KEYS).forEach(([key, column]) => {
    row[column] = settings[key];
  });
  return row;
}

async function fetchSavedPhysicsSettings() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("block_tower_physics_settings")
    .select(SETTINGS_COLUMNS)
    .eq("id", "default")
    .maybeSingle();
  if (error) {
    console.warn("Block Tower physics settings could not be loaded.", error);
    return null;
  }
  return rowToPhysicsSettings(data);
}

function updateDifficultyStatus() {
  if (!difficultyStatus) return;
  difficultyStatus.textContent = `난이도 · ${DIFFICULTY_LABELS[physicsSettings.difficulty] ?? "커스텀"}`;
}

const rapierReady = RAPIER.init();
const savedSettingsPromise = fetchSavedPhysicsSettings();
const [, savedSettings] = await Promise.all([rapierReady, savedSettingsPromise]);
if (savedSettings) physicsSettings = savedSettings;
updateDifficultyStatus();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x201b17);
scene.fog = new THREE.Fog(0x201b17, 20, 42);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(11, 10, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
sceneHost.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.enablePan = false;
controls.minDistance = 8;
controls.maxDistance = 28;
controls.minPolarAngle = Math.PI * 0.17;
controls.maxPolarAngle = Math.PI * 0.49;
controls.target.set(0, 5.3, 0);
controls.mouseButtons.LEFT = null;
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
controls.touches.ONE = THREE.TOUCH.ROTATE;
controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
controls.update();

renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());

scene.add(new THREE.HemisphereLight(0xffead3, 0x392d24, 1.7));

const keyLight = new THREE.DirectionalLight(0xffe2bd, 3.5);
keyLight.position.set(6, 14, 8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -10;
keyLight.shadow.camera.right = 10;
keyLight.shadow.camera.top = 16;
keyLight.shadow.camera.bottom = -4;
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x9fb6ff, 1.1);
rimLight.position.set(-8, 9, -7);
scene.add(rimLight);

const floor = new THREE.Mesh(
  new THREE.CylinderGeometry(7, 7.5, 0.55, 64),
  new THREE.MeshStandardMaterial({ color: 0x2e2721, roughness: 0.92, metalness: 0.02 }),
);
floor.position.y = -0.32;
floor.receiveShadow = true;
scene.add(floor);

const floorRing = new THREE.Mesh(
  new THREE.TorusGeometry(6.15, 0.025, 8, 96),
  new THREE.MeshBasicMaterial({ color: 0x8a684a, transparent: true, opacity: 0.38 }),
);
floorRing.rotation.x = Math.PI / 2;
floorRing.position.y = 0.01;
scene.add(floorRing);

const blocks = [];
const blockGeometry = new THREE.BoxGeometry(BLOCK_LENGTH, BLOCK_HEIGHT, BLOCK_WIDTH, 3, 1, 1);

const woodPalette = [0xb9793f, 0xc6894c, 0xd09355, 0xbf7f45, 0xca8a50, 0xb8753e];

function makeBlockMaterial(index) {
  return new THREE.MeshStandardMaterial({
    color: woodPalette[index % woodPalette.length],
    roughness: 0.72 + (index % 3) * 0.04,
    metalness: 0,
  });
}

function levelCenterY(levelIndex) {
  return BLOCK_HEIGHT / 2 + levelIndex * LEVEL_STEP;
}

function levelIsRotated(levelIndex) {
  return levelIndex % 2 === 1;
}

function levelLongAxis(levelIndex) {
  return levelIsRotated(levelIndex)
    ? new THREE.Vector3(0, 0, 1)
    : new THREE.Vector3(1, 0, 0);
}

function placementTarget(levelIndex, slotIndex) {
  const offset = (slotIndex - 1) * (BLOCK_WIDTH + GAP);
  const rotated = levelIsRotated(levelIndex);
  return {
    levelIndex,
    slotIndex,
    position: rotated
      ? new THREE.Vector3(offset, levelCenterY(levelIndex), 0)
      : new THREE.Vector3(0, levelCenterY(levelIndex), offset),
    quaternion: new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, rotated ? Math.PI / 2 : 0, 0),
    ),
  };
}

const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
world.timestep = PHYSICS_STEP;

const groundBody = world.createRigidBody(
  RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.27, 0),
);
world.createCollider(
  RAPIER.ColliderDesc.cuboid(7.2, 0.25, 7.2)
    .setFriction(0.82)
    .setRestitution(0.01),
  groundBody,
);

for (let level = 0; level < LEVELS; level += 1) {
  const rotate = levelIsRotated(level);
  const y = levelCenterY(level);

  for (let slot = 0; slot < 3; slot += 1) {
    const index = level * 3 + slot;
    const offset = (slot - 1) * (BLOCK_WIDTH + GAP);
    const block = new THREE.Mesh(blockGeometry, makeBlockMaterial(index));

    if (rotate) {
      block.rotation.y = Math.PI / 2;
      block.position.set(offset, y, 0);
    } else {
      block.position.set(0, y, offset);
    }

    const originalPosition = block.position.clone();
    const originalLongAxis = levelLongAxis(level);
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(block.position.x, block.position.y, block.position.z)
      .setRotation({
        x: block.quaternion.x,
        y: block.quaternion.y,
        z: block.quaternion.z,
        w: block.quaternion.w,
      })
      .setLinearDamping(physicsSettings.linearDamping)
      .setAngularDamping(physicsSettings.angularDamping);
    const body = world.createRigidBody(rigidBodyDesc);
    const collider = world.createCollider(
      RAPIER.ColliderDesc.cuboid(BLOCK_LENGTH / 2, BLOCK_HEIGHT / 2, BLOCK_WIDTH / 2)
        .setDensity(physicsSettings.blockDensity)
        .setFriction(physicsSettings.blockFriction)
        .setRestitution(0.015),
      body,
    );

    block.castShadow = true;
    block.receiveShadow = true;
    block.userData = {
      index,
      level: level + 1,
      slot: slot + 1,
      selected: false,
      extracted: false,
      body,
      collider,
      originalPosition,
      originalLongAxis,
    };
    scene.add(block);
    blocks.push(block);
  }
}

function applyPhysicsSettingsToBlocks() {
  blocks.forEach((block) => {
    block.userData.body.setLinearDamping(physicsSettings.linearDamping);
    block.userData.body.setAngularDamping(physicsSettings.angularDamping);
    block.userData.collider.setDensity(physicsSettings.blockDensity);
    block.userData.collider.setFriction(physicsSettings.blockFriction);
  });
  updateDifficultyStatus();
}

const placementGhosts = Array.from({ length: 3 }, (_, slotIndex) => {
  const ghost = new THREE.Mesh(
    blockGeometry,
    new THREE.MeshBasicMaterial({
      color: 0xf0a85f,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      wireframe: false,
    }),
  );
  ghost.visible = false;
  ghost.userData.slotIndex = slotIndex;
  scene.add(ghost);
  return ghost;
});

let currentTopLevelIndex = LEVELS;
let occupiedTopSlots = new Set();
let completedTurns = 0;
let placementAssist = null;

function updateTurnStatus() {
  if (!turnStatus) return;
  turnStatus.textContent = `쌓기 · ${currentTopLevelIndex + 1}층 ${occupiedTopSlots.size}/3`;
}

function availablePlacementTargets() {
  return [0, 1, 2]
    .filter((slotIndex) => !occupiedTopSlots.has(slotIndex))
    .map((slotIndex) => placementTarget(currentTopLevelIndex, slotIndex));
}

function blockBodyPosition(block) {
  const translation = block.userData.body.translation();
  return new THREE.Vector3(translation.x, translation.y, translation.z);
}

function nearestPlacementTarget(block) {
  const position = blockBodyPosition(block);
  let nearest = null;
  let nearestDistance = Infinity;
  availablePlacementTargets().forEach((target) => {
    const distance = position.distanceTo(target.position);
    if (distance < nearestDistance) {
      nearest = target;
      nearestDistance = distance;
    }
  });
  return nearest ? { ...nearest, distance: nearestDistance } : null;
}

function hidePlacementGhosts() {
  placementGhosts.forEach((ghost) => {
    ghost.visible = false;
  });
}

function updatePlacementGhosts(block = null) {
  if (placementAssist) {
    placementGhosts.forEach((ghost) => {
      const isTarget = ghost.userData.slotIndex === placementAssist.target.slotIndex;
      ghost.visible = isTarget;
      if (isTarget) {
        ghost.position.copy(placementAssist.target.position);
        ghost.quaternion.copy(placementAssist.target.quaternion);
        ghost.material.opacity = 0.34;
      }
    });
    return;
  }

  if (!block?.userData.extracted) {
    hidePlacementGhosts();
    return;
  }

  const nearest = nearestPlacementTarget(block);
  placementGhosts.forEach((ghost) => {
    const slotIndex = ghost.userData.slotIndex;
    if (occupiedTopSlots.has(slotIndex)) {
      ghost.visible = false;
      return;
    }
    const target = placementTarget(currentTopLevelIndex, slotIndex);
    ghost.position.copy(target.position);
    ghost.quaternion.copy(target.quaternion);
    ghost.material.opacity = nearest?.slotIndex === slotIndex ? 0.48 : 0.16;
    ghost.visible = true;
  });
}

updateTurnStatus();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragTargetMarker = new THREE.Mesh(
  new THREE.SphereGeometry(0.09, 16, 12),
  new THREE.MeshBasicMaterial({ color: 0xffc27e, transparent: true, opacity: 0.78 }),
);
dragTargetMarker.visible = false;
scene.add(dragTargetMarker);

let selectedBlock = null;
let pointerDown = null;
let dragState = null;

function selectionLabel(block, suffix = "") {
  if (!block) return "선택된 블록 없음";
  const extracted = block.userData.extracted ? " · 추출됨" : "";
  return `${block.userData.level}층 · ${block.userData.slot}번 블록${extracted}${suffix}`;
}

function setSelectedBlock(block) {
  if (selectedBlock) {
    selectedBlock.material.emissive.setHex(0x000000);
    selectedBlock.material.emissiveIntensity = 0;
    selectedBlock.userData.selected = false;
  }

  selectedBlock = block;

  if (!selectedBlock) {
    selectionStatus.textContent = selectionLabel(null);
    return;
  }

  selectedBlock.material.emissive.setHex(0xffa34d);
  selectedBlock.material.emissiveIntensity = 0.32;
  selectedBlock.userData.selected = true;
  selectionStatus.textContent = selectionLabel(selectedBlock);
}

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function pickBlockHit(event) {
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const [hit] = raycaster.intersectObjects(blocks, false);
  return hit ?? null;
}

function localPointFromWorld(block, worldPoint) {
  block.updateMatrixWorld(true);
  return block.worldToLocal(worldPoint.clone());
}

function bodyPointToWorld(body, localPoint) {
  const translation = body.translation();
  const rotation = body.rotation();
  const quaternion = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
  return localPoint.clone().applyQuaternion(quaternion).add(
    new THREE.Vector3(translation.x, translation.y, translation.z),
  );
}

function pointVelocity(body, worldPoint) {
  const translation = body.translation();
  const linearVelocity = body.linvel();
  const angularVelocity = body.angvel();
  const radius = worldPoint.clone().sub(
    new THREE.Vector3(translation.x, translation.y, translation.z),
  );
  const angular = new THREE.Vector3(
    angularVelocity.x,
    angularVelocity.y,
    angularVelocity.z,
  );
  return new THREE.Vector3(
    linearVelocity.x,
    linearVelocity.y,
    linearVelocity.z,
  ).add(angular.cross(radius));
}

function smoothstep(min, max, value) {
  const progress = THREE.MathUtils.clamp((value - min) / Math.max(max - min, 0.001), 0, 1);
  return progress * progress * (3 - 2 * progress);
}

function lowerBreakawayFactor(block) {
  if (block.userData.extracted) return 0;
  const { level, slot } = block.userData;
  const maxLevel = Math.min(physicsSettings.lowerBreakawayMaxLevel, LEVELS - 1);
  if (maxLevel <= 0 || level > maxLevel) return 0;

  const depthProgress = (maxLevel - level + 1) / maxLevel;
  const depthFactor = THREE.MathUtils.lerp(0.82, 1, depthProgress);
  const centerFactor = slot === 2 ? physicsSettings.centerBlockBreakawayMultiplier : 1;
  return depthFactor * centerFactor;
}

function updateDragTarget(event) {
  if (!dragState) return;

  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const projectedTarget = new THREE.Vector3();
  if (!raycaster.ray.intersectPlane(dragState.plane, projectedTarget)) return;

  const offset = projectedTarget.sub(dragState.startTarget);
  const maxGrabDistance = dragState.block.userData.extracted
    ? EXTRACTED_GRAB_DISTANCE
    : physicsSettings.maxGrabDistance;
  if (offset.length() > maxGrabDistance) {
    offset.setLength(maxGrabDistance);
  }

  const nextTarget = dragState.startTarget.clone().add(offset);
  const elapsed = THREE.MathUtils.clamp(
    (event.timeStamp - dragState.lastPointerTime) / 1000,
    1 / 240,
    0.05,
  );
  const instantTargetVelocity = nextTarget.clone()
    .sub(dragState.targetPoint)
    .divideScalar(elapsed);
  if (instantTargetVelocity.length() > physicsSettings.maxPointerTargetSpeed) {
    instantTargetVelocity.setLength(physicsSettings.maxPointerTargetSpeed);
  }

  dragState.targetVelocity.lerp(
    instantTargetVelocity,
    physicsSettings.pointerVelocitySmoothing,
  );
  dragState.targetPoint.copy(nextTarget);
  dragState.lastPointerTime = event.timeStamp;
  dragTargetMarker.position.copy(dragState.targetPoint);
}

function updateExtractionState() {
  if (!dragState || dragState.block.userData.extracted) return;
  const block = dragState.block;
  const currentPosition = blockBodyPosition(block);
  const displacement = currentPosition.clone().sub(block.userData.originalPosition);
  const axisDistance = Math.abs(displacement.dot(block.userData.originalLongAxis));
  const horizontalDistance = Math.hypot(displacement.x, displacement.z);

  if (axisDistance < EXTRACTION_AXIS_DISTANCE || horizontalDistance < EXTRACTION_HORIZONTAL_DISTANCE) return;

  block.userData.extracted = true;
  lastBreakawayStrength = 0;
  updatePlacementGhosts(block);
  selectionStatus.textContent = selectionLabel(block, " · 최상단으로 이동하세요");
}

function placementReleaseTarget(block) {
  if (!block?.userData.extracted) return null;
  const nearest = nearestPlacementTarget(block);
  if (!nearest || nearest.distance > PLACEMENT_RELEASE_DISTANCE) return null;
  return nearest;
}

function cancelPlacementAssist() {
  if (!placementAssist) return;
  placementAssist.block.userData.body.resetForces(true);
  placementAssist.block.userData.body.resetTorques(true);
  placementAssist = null;
  hidePlacementGhosts();
}

function beginPlacementAssist(block, target) {
  cancelPlacementAssist();
  placementAssist = {
    block,
    target,
    startedAt: performance.now(),
    stableSteps: 0,
  };
  updatePlacementGhosts(block);
  selectionStatus.textContent = selectionLabel(block, " · 최상단 정렬 중");
}

function finishDrag(pointerId, { cancelled = false } = {}) {
  if (!dragState || dragState.pointerId !== pointerId) return;
  const releasedState = dragState;
  const placementTargetOnRelease = cancelled ? null : placementReleaseTarget(releasedState.block);
  releasedState.body.resetForces(true);
  releasedState.body.resetTorques(true);
  dragState = null;
  dragTargetMarker.visible = false;
  sceneHost.classList.remove("is-dragging");
  lastAppliedForce = 0;
  lastPointerSpeed = 0;
  lastBreakawayStrength = 0;
  if (renderer.domElement.hasPointerCapture(pointerId)) {
    renderer.domElement.releasePointerCapture(pointerId);
  }

  if (placementTargetOnRelease) {
    beginPlacementAssist(releasedState.block, placementTargetOnRelease);
  } else {
    updatePlacementGhosts(releasedState.block.userData.extracted ? releasedState.block : null);
    selectionStatus.textContent = selectionLabel(selectedBlock);
  }
}

function handleBlockPointerDown(event) {
  if (event.button !== 0) return;

  const hit = pickBlockHit(event);
  const block = hit?.object ?? null;
  pointerDown = { x: event.clientX, y: event.clientY, block };

  if (!hit || !block) return;

  if (placementAssist?.block === block) cancelPlacementAssist();

  // OrbitControls also treats one-finger touch as camera rotation. Stop that
  // interaction only when the touch actually starts on a block.
  if (event.pointerType === "touch") {
    event.stopImmediatePropagation();
  }

  setSelectedBlock(block);
  const cameraDirection = camera.getWorldDirection(new THREE.Vector3()).normalize();
  const grabPoint = hit.point.clone();
  dragState = {
    pointerId: event.pointerId,
    block,
    body: block.userData.body,
    localGrabPoint: localPointFromWorld(block, grabPoint),
    plane: new THREE.Plane().setFromNormalAndCoplanarPoint(cameraDirection, grabPoint),
    startTarget: grabPoint.clone(),
    targetPoint: grabPoint.clone(),
    targetVelocity: new THREE.Vector3(),
    lastPointerTime: event.timeStamp,
    startClientX: event.clientX,
    startClientY: event.clientY,
    moved: false,
  };
  dragTargetMarker.position.copy(grabPoint);
  dragTargetMarker.visible = true;
  updatePlacementGhosts(block.userData.extracted ? block : null);
  renderer.domElement.setPointerCapture(event.pointerId);
}

renderer.domElement.addEventListener("pointerdown", handleBlockPointerDown, { capture: true });

renderer.domElement.addEventListener("pointermove", (event) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  if (event.pointerType === "touch") event.stopImmediatePropagation();

  updateDragTarget(event);
  const movedPixels = Math.hypot(
    event.clientX - dragState.startClientX,
    event.clientY - dragState.startClientY,
  );
  dragState.moved = dragState.moved || movedPixels > 4;

  if (dragState.moved) {
    const isBreakawayPull = !dragState.block.userData.extracted
      && dragState.block.userData.level <= physicsSettings.lowerBreakawayMaxLevel
      && dragState.targetVelocity.length() >= physicsSettings.breakawaySpeedStart;
    sceneHost.classList.add("is-dragging");
    selectionStatus.textContent = selectionLabel(
      dragState.block,
      dragState.block.userData.extracted
        ? " · 최상단으로 이동 중"
        : isBreakawayPull ? " · 강한 힘 적용 중" : " · 자유 조작 중",
    );
  }
}, { capture: true });

renderer.domElement.addEventListener("pointerup", (event) => {
  if (event.button !== 0 || !pointerDown) return;
  if (dragState?.pointerId === event.pointerId && event.pointerType === "touch") {
    event.stopImmediatePropagation();
  }

  const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  const pressedBlock = pointerDown.block;
  pointerDown = null;

  if (dragState?.pointerId === event.pointerId) {
    const dragged = dragState.moved;
    finishDrag(event.pointerId);
    if (dragged) return;
  }

  if (moved <= 6) {
    setSelectedBlock(pressedBlock ?? pickBlockHit(event)?.object ?? null);
  }
}, { capture: true });

renderer.domElement.addEventListener("pointercancel", (event) => {
  if (dragState?.pointerId === event.pointerId && event.pointerType === "touch") {
    event.stopImmediatePropagation();
  }
  pointerDown = null;
  finishDrag(event.pointerId, { cancelled: true });
}, { capture: true });

function applyGrabForce() {
  if (!dragState) return;

  const currentGrabPoint = bodyPointToWorld(dragState.body, dragState.localGrabPoint);
  const velocityAtGrabPoint = pointVelocity(dragState.body, currentGrabPoint);
  const pointerSpeed = dragState.targetVelocity.length();
  const speedBoost = THREE.MathUtils.clamp(
    pointerSpeed / physicsSettings.pointerSpeedForMaxBoost,
    0,
    1,
  );
  const breakawaySpeed = smoothstep(
    physicsSettings.breakawaySpeedStart,
    physicsSettings.breakawaySpeedFull,
    pointerSpeed,
  );
  const lowerAssist = lowerBreakawayFactor(dragState.block);
  const breakawayStrength = breakawaySpeed * lowerAssist;
  const maxForce = THREE.MathUtils.lerp(
    physicsSettings.maxGrabForce,
    physicsSettings.maxFastGrabForce,
    speedBoost,
  ) + physicsSettings.lowerBreakawayForceBonus * breakawayStrength;
  const pointerVelocityGain = physicsSettings.pointerVelocityGain
    + physicsSettings.lowerBreakawayVelocityGain * breakawayStrength;
  const force = dragState.targetPoint.clone()
    .sub(currentGrabPoint)
    .multiplyScalar(physicsSettings.grabSpring)
    .addScaledVector(dragState.targetVelocity, pointerVelocityGain)
    .addScaledVector(velocityAtGrabPoint, -physicsSettings.grabDamping);

  if (force.length() > maxForce) {
    force.setLength(maxForce);
  }

  lastPointerSpeed = pointerSpeed;
  lastAppliedForce = force.length();
  lastBreakawayStrength = breakawayStrength;

  dragState.body.resetForces(true);
  dragState.body.resetTorques(true);
  dragState.body.addForceAtPoint(
    { x: force.x, y: force.y, z: force.z },
    { x: currentGrabPoint.x, y: currentGrabPoint.y, z: currentGrabPoint.z },
    true,
  );
  dragState.targetVelocity.multiplyScalar(physicsSettings.pointerVelocityDecay);
}

function quaternionErrorVector(current, target) {
  const currentInverse = current.clone().invert();
  const error = target.clone().multiply(currentInverse).normalize();
  if (error.w < 0) error.set(-error.x, -error.y, -error.z, -error.w);
  const angle = 2 * Math.acos(THREE.MathUtils.clamp(error.w, -1, 1));
  const sinHalf = Math.sqrt(Math.max(1 - error.w * error.w, 0));
  if (sinHalf < 0.0001 || angle < 0.0001) return new THREE.Vector3();
  return new THREE.Vector3(error.x / sinHalf, error.y / sinHalf, error.z / sinHalf)
    .multiplyScalar(angle);
}

function completePlacement() {
  if (!placementAssist) return;
  const { block, target } = placementAssist;
  const body = block.userData.body;
  body.resetForces(true);
  body.resetTorques(true);

  block.userData.level = target.levelIndex + 1;
  block.userData.slot = target.slotIndex + 1;
  block.userData.extracted = false;
  block.userData.originalPosition.copy(target.position);
  block.userData.originalLongAxis.copy(levelLongAxis(target.levelIndex));

  occupiedTopSlots.add(target.slotIndex);
  completedTurns += 1;
  placementAssist = null;

  if (occupiedTopSlots.size === 3) {
    currentTopLevelIndex += 1;
    occupiedTopSlots = new Set();
  }

  hidePlacementGhosts();
  updateTurnStatus();
  selectionStatus.textContent = `${selectionLabel(block)} · ${completedTurns}턴 배치 완료`;
}

function applyPlacementAssist() {
  if (!placementAssist) return;
  const { block, target, startedAt } = placementAssist;
  const body = block.userData.body;
  const translation = body.translation();
  const rotation = body.rotation();
  const linvel = body.linvel();
  const angvel = body.angvel();
  const currentPosition = new THREE.Vector3(translation.x, translation.y, translation.z);
  const currentRotation = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
  const linearVelocity = new THREE.Vector3(linvel.x, linvel.y, linvel.z);
  const angularVelocity = new THREE.Vector3(angvel.x, angvel.y, angvel.z);
  const positionError = target.position.clone().sub(currentPosition);
  const rotationError = quaternionErrorVector(currentRotation, target.quaternion);

  if (
    performance.now() - startedAt > PLACEMENT_ASSIST_TIMEOUT_MS
    || positionError.length() > PLACEMENT_ASSIST_MAX_DISTANCE
  ) {
    body.resetForces(true);
    body.resetTorques(true);
    placementAssist = null;
    hidePlacementGhosts();
    selectionStatus.textContent = selectionLabel(block, " · 배치 위치에서 벗어남");
    return;
  }

  const force = positionError
    .multiplyScalar(PLACEMENT_POSITION_SPRING)
    .addScaledVector(linearVelocity, -PLACEMENT_POSITION_DAMPING);
  if (force.length() > PLACEMENT_MAX_FORCE) force.setLength(PLACEMENT_MAX_FORCE);

  const torque = rotationError
    .multiplyScalar(PLACEMENT_ROTATION_SPRING)
    .addScaledVector(angularVelocity, -PLACEMENT_ROTATION_DAMPING);
  if (torque.length() > PLACEMENT_MAX_TORQUE) torque.setLength(PLACEMENT_MAX_TORQUE);

  body.resetForces(true);
  body.resetTorques(true);
  body.addForce({ x: force.x, y: force.y, z: force.z }, true);
  body.addTorque({ x: torque.x, y: torque.y, z: torque.z }, true);

  const stable = target.position.distanceTo(currentPosition) < 0.16
    && quaternionErrorVector(currentRotation, target.quaternion).length() < 0.12
    && linearVelocity.length() < 0.45
    && angularVelocity.length() < 0.5;
  placementAssist.stableSteps = stable ? placementAssist.stableSteps + 1 : 0;

  if (placementAssist.stableSteps >= PLACEMENT_STABLE_STEPS) completePlacement();
}

function syncBlocksFromPhysics() {
  blocks.forEach((block) => {
    const position = block.userData.body.translation();
    const rotation = block.userData.body.rotation();
    block.position.set(position.x, position.y, position.z);
    block.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  });
}

function setSettingsMessage(message, tone = "") {
  if (!physicsSettingsMessage) return;
  physicsSettingsMessage.textContent = message;
  physicsSettingsMessage.dataset.tone = tone;
}

function settingDisplayValue(key, value) {
  if (key === "lowerBreakawayMaxLevel") return `${Math.round(value)}층`;
  if (["grabSpring", "grabDamping", "pointerVelocityGain", "maxGrabForce",
    "maxFastGrabForce", "lowerBreakawayForceBonus", "lowerBreakawayVelocityGain"].includes(key)) {
    return String(Math.round(value));
  }
  return Number(value).toFixed(2).replace(/\.?0+$/, "");
}

function syncAdminSettingsControls() {
  if (!physicsSettingsFields) return;
  physicsSettingsFields.querySelectorAll("[data-physics-setting]").forEach((input) => {
    const key = input.dataset.physicsSetting;
    input.value = String(physicsSettings[key]);
    const output = physicsSettingsFields.querySelector(`[data-setting-value="${key}"]`);
    if (output) output.textContent = settingDisplayValue(key, physicsSettings[key]);
  });
  document.querySelectorAll("[data-physics-preset]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.physicsPreset === physicsSettings.difficulty);
  });
  updateDifficultyStatus();
}

function handlePhysicsSettingInput(event) {
  const input = event.currentTarget;
  const key = input.dataset.physicsSetting;
  physicsSettings = normalizePhysicsSettings({
    ...physicsSettings,
    [key]: Number(input.value),
    difficulty: "custom",
  });
  applyPhysicsSettingsToBlocks();
  syncAdminSettingsControls();
  setSettingsMessage("현재 게임에 즉시 적용됨 · 저장 전", "pending");
}

function renderPhysicsSettingsFields() {
  if (!physicsSettingsFields) return;
  physicsSettingsFields.replaceChildren();

  SETTING_GROUPS.forEach((group) => {
    const section = document.createElement("section");
    section.className = "physics-setting-group";

    const title = document.createElement("h3");
    title.textContent = group.title;
    section.append(title);

    group.settings.forEach(({ key, label, min, max, step }) => {
      const row = document.createElement("label");
      row.className = "physics-setting-row";

      const header = document.createElement("span");
      header.className = "physics-setting-row__header";
      const name = document.createElement("span");
      name.textContent = label;
      const value = document.createElement("output");
      value.dataset.settingValue = key;
      value.textContent = settingDisplayValue(key, physicsSettings[key]);
      header.append(name, value);

      const input = document.createElement("input");
      input.type = "range";
      input.min = String(min);
      input.max = String(max);
      input.step = String(step);
      input.value = String(physicsSettings[key]);
      input.dataset.physicsSetting = key;
      input.addEventListener("input", handlePhysicsSettingInput);

      row.append(header, input);
      section.append(row);
    });

    physicsSettingsFields.append(section);
  });
}

function applyPreset(presetName) {
  const preset = PHYSICS_PRESETS[presetName];
  if (!preset) return;
  physicsSettings = normalizePhysicsSettings({ ...preset });
  applyPhysicsSettingsToBlocks();
  syncAdminSettingsControls();
  setSettingsMessage(`${DIFFICULTY_LABELS[presetName]} 프리셋 적용됨 · 저장 전`, "pending");
}

async function reloadSavedPhysicsSettings() {
  setSettingsMessage("저장된 설정을 불러오는 중…");
  const saved = await fetchSavedPhysicsSettings();
  if (!saved) {
    setSettingsMessage("저장된 설정을 불러오지 못했습니다.", "error");
    return;
  }
  physicsSettings = saved;
  applyPhysicsSettingsToBlocks();
  syncAdminSettingsControls();
  setSettingsMessage("저장된 설정을 다시 적용했습니다.", "success");
}

async function savePhysicsSettings() {
  if (!supabase || !getAuthState().isAdmin) {
    setSettingsMessage("관리자만 설정을 저장할 수 있습니다.", "error");
    return;
  }

  physicsSettings = normalizePhysicsSettings(physicsSettings);
  physicsSettingsSave.disabled = true;
  setSettingsMessage("설정을 저장하는 중…");

  const { data, error } = await supabase
    .from("block_tower_physics_settings")
    .update(physicsSettingsToRow(physicsSettings))
    .eq("id", "default")
    .select(SETTINGS_COLUMNS)
    .single();

  physicsSettingsSave.disabled = false;
  if (error) {
    console.error("Block Tower physics settings could not be saved.", error);
    setSettingsMessage("설정 저장에 실패했습니다.", "error");
    return;
  }

  const saved = rowToPhysicsSettings(data);
  if (saved) physicsSettings = saved;
  applyPhysicsSettingsToBlocks();
  syncAdminSettingsControls();
  setSettingsMessage("저장 완료 · 다음 접속부터 이 값이 적용됩니다.", "success");
}

function updateAdminVisibility(auth) {
  const isAdmin = Boolean(auth?.isAdmin);
  if (physicsSettingsToggle) physicsSettingsToggle.hidden = !isAdmin;
  if (!isAdmin && physicsSettingsPanel) physicsSettingsPanel.hidden = true;
}

async function initializePhysicsAdmin() {
  if (!supabase) return;
  try {
    const auth = await initializeAuth();
    updateAdminVisibility(auth);
    subscribeAuth(updateAdminVisibility);
  } catch (error) {
    console.warn("Block Tower admin state could not be initialized.", error);
    updateAdminVisibility(null);
  }
}

function updatePhysicsMetrics(now) {
  if (!physicsSettingsPanel || physicsSettingsPanel.hidden || now - lastMetricsUpdate < 100) return;
  lastMetricsUpdate = now;
  if (physicsMetricBlock) {
    physicsMetricBlock.textContent = selectedBlock
      ? `${selectedBlock.userData.level}층 · ${selectedBlock.userData.slot}번`
      : "없음";
  }
  if (physicsMetricSpeed) physicsMetricSpeed.textContent = lastPointerSpeed.toFixed(2);
  if (physicsMetricForce) physicsMetricForce.textContent = Math.round(lastAppliedForce).toString();
  if (physicsMetricAssist) physicsMetricAssist.textContent = `×${(1 + lastBreakawayStrength).toFixed(2)}`;
}

renderPhysicsSettingsFields();
syncAdminSettingsControls();

physicsSettingsToggle?.addEventListener("click", () => {
  physicsSettingsPanel.hidden = !physicsSettingsPanel.hidden;
  physicsSettingsToggle.setAttribute("aria-expanded", String(!physicsSettingsPanel.hidden));
});

physicsSettingsClose?.addEventListener("click", () => {
  physicsSettingsPanel.hidden = true;
  physicsSettingsToggle?.setAttribute("aria-expanded", "false");
});

document.querySelectorAll("[data-physics-preset]").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.physicsPreset));
});

physicsSettingsSave?.addEventListener("click", savePhysicsSettings);
physicsSettingsReload?.addEventListener("click", reloadSavedPhysicsSettings);

void initializePhysicsAdmin();

function resize() {
  const width = Math.max(sceneHost.clientWidth, 1);
  const height = Math.max(sceneHost.clientHeight, 1);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(sceneHost);
resize();

loading?.classList.add("is-hidden");

let previousTime = performance.now();
let accumulator = 0;

function animate(now) {
  const elapsed = Math.min((now - previousTime) / 1000, 0.05);
  previousTime = now;
  accumulator += elapsed;

  while (accumulator >= PHYSICS_STEP) {
    applyGrabForce();
    applyPlacementAssist();
    world.step();
    accumulator -= PHYSICS_STEP;
  }

  syncBlocksFromPhysics();
  updateExtractionState();
  if (dragState?.block.userData.extracted) updatePlacementGhosts(dragState.block);
  updatePhysicsMetrics(now);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
