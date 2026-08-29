import * as THREE from "three";

const sceneHost = document.querySelector("#scene");
const selectionStatus = document.querySelector("#selection-status");
const ruleStatus = document.querySelector("#rule-status");
const gameOverOverlay = document.querySelector("#game-over-overlay");
const gameOverTitle = document.querySelector("#game-over-title");
const gameOverMessage = document.querySelector("#game-over-message");
const gameOverScore = document.querySelector("#game-over-score");
const gameRestartButton = document.querySelector("#game-restart-button");

const INITIAL_COLLAPSE_GRACE_MS = 2500;
const COLLAPSE_CONFIRM_MS = 1800;
const LEVEL_Y_TOLERANCE = 0.32;
const TOWER_FOOTPRINT_RADIUS = 2.35;
const FLOOR_CONTACT_Y = 0.68;
const FLOOR_DROP_ARM_Y = 1.05;
const COLLAPSE_LOW_HEIGHT_LEVELS = 3.25;
const COLLAPSE_MAJOR_DROP_LEVELS = 2.4;
const COLLAPSE_FLOOR_SCATTER_COUNT = 12;
const COLLAPSE_MAJOR_DROP_COUNT = 10;
const COLLAPSE_LOW_MASS_COUNT = 28;
const COLLAPSE_MAX_MOVING_COUNT = 8;
const COLLAPSE_MOVING_SPEED = 0.7;
const COLLAPSE_SCATTER_SHIFT = 0.65;
const COLLAPSE_SCATTER_TILT = THREE.MathUtils.degToRad(42);
const MOVEMENT_KEYS = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "KeyE", "KeyQ"]);
const WORLD_UP = new THREE.Vector3(0, 1, 0);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const originalIntersectObjects = THREE.Raycaster.prototype.intersectObjects;

const towerGeometry = {
  baseY: null,
  levelStep: null,
  initialTopLevel: 18,
};

const state = {
  phase: "loading",
  turn: 1,
  completedTurns: 0,
  activeBlock: null,
  activeSourceLevel: null,
  activeSourceDataLevel: null,
  activeLifted: false,
  highestCompletedLevel: null,
  removableMaxLevel: null,
  collapseCandidateSince: null,
  gameOver: false,
  startedAt: performance.now(),
};

window.__blockTowerStage5Rules = state;

function installCameraCapture() {
  const prototype = THREE.Object3D.prototype;
  if (prototype.__blockTowerStage5CameraPatched) return;

  const originalLookAt = prototype.lookAt;
  Object.defineProperty(prototype, "__blockTowerStage5CameraPatched", { value: true });
  prototype.lookAt = function stage5LookAt(...args) {
    if (this.isCamera && window.__blockTowerGameRuntime) {
      window.__blockTowerGameRuntime.camera = this;
    }
    return originalLookAt.apply(this, args);
  };
}

function isTowerBlock(object) {
  return Boolean(
    object?.isMesh
    && Number.isInteger(object.userData?.index)
    && object.userData?.body,
  );
}

function getRuntime() {
  return window.__blockTowerGameRuntime ?? null;
}

function getBlocks() {
  const scene = getRuntime()?.scene;
  if (!scene) return [];

  const blocks = [];
  scene.traverse((object) => {
    if (isTowerBlock(object)) blocks.push(object);
  });
  return blocks.sort((a, b) => a.userData.index - b.userData.index);
}

function bodyPosition(block) {
  const translation = block?.userData?.body?.translation?.();
  if (!translation) return null;
  return new THREE.Vector3(translation.x, translation.y, translation.z);
}

function bodyTiltAngle(block) {
  const rotation = block?.userData?.body?.rotation?.();
  if (!rotation) return 0;
  const quaternion = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
  const up = WORLD_UP.clone().applyQuaternion(quaternion).normalize();
  return up.angleTo(WORLD_UP);
}

function bodyLinearSpeed(block) {
  const velocity = block?.userData?.body?.linvel?.();
  if (!velocity) return 0;
  return Math.hypot(velocity.x, velocity.y, velocity.z);
}

function captureTowerGeometry(blocks) {
  const levelCenters = new Map();
  blocks.forEach((block) => {
    const level = Number(block.userData.level);
    const position = bodyPosition(block);
    if (!Number.isFinite(level) || !position) return;
    const values = levelCenters.get(level) ?? [];
    values.push(position.y);
    levelCenters.set(level, values);
  });

  const centers = [...levelCenters.entries()]
    .map(([level, values]) => ({
      level,
      y: values.reduce((sum, value) => sum + value, 0) / values.length,
    }))
    .sort((a, b) => a.level - b.level);

  if (centers.length === 0) return;
  towerGeometry.baseY = centers[0].y;
  towerGeometry.initialTopLevel = centers[centers.length - 1].level;

  const steps = [];
  for (let index = 1; index < centers.length; index += 1) {
    const levelDelta = centers[index].level - centers[index - 1].level;
    if (levelDelta <= 0) continue;
    steps.push((centers[index].y - centers[index - 1].y) / levelDelta);
  }
  steps.sort((a, b) => a - b);
  towerGeometry.levelStep = steps.length > 0
    ? steps[Math.floor(steps.length / 2)]
    : 0.7354;
}

function levelCenterY(level) {
  if (!Number.isFinite(towerGeometry.baseY) || !Number.isFinite(towerGeometry.levelStep)) return null;
  return towerGeometry.baseY + (level - 1) * towerGeometry.levelStep;
}

function recognizedTowerLevel(block, { requireFootprint = true } = {}) {
  const position = bodyPosition(block);
  if (!position || !Number.isFinite(towerGeometry.baseY) || !Number.isFinite(towerGeometry.levelStep)) {
    return null;
  }

  if (requireFootprint && Math.hypot(position.x, position.z) > TOWER_FOOTPRINT_RADIUS) return null;

  const level = Math.round((position.y - towerGeometry.baseY) / towerGeometry.levelStep) + 1;
  if (level < 1) return null;
  const centerY = levelCenterY(level);
  if (centerY === null || Math.abs(position.y - centerY) > LEVEL_Y_TOLERANCE) return null;
  return level;
}

function highestCompletedLevel(blocks = getBlocks()) {
  if (blocks.length === 0) return null;

  const levelCounts = new Map();
  blocks.forEach((block) => {
    if (block.userData.extracted) return;
    const level = recognizedTowerLevel(block);
    if (level === null) return;
    levelCounts.set(level, (levelCounts.get(level) ?? 0) + 1);
  });

  const levels = [...levelCounts.keys()].sort((a, b) => b - a);
  for (const level of levels) {
    if ((levelCounts.get(level) ?? 0) >= 3) return level;
  }
  return null;
}

function refreshLevelRules(blocks = getBlocks()) {
  const completedLevel = highestCompletedLevel(blocks);
  state.highestCompletedLevel = completedLevel;
  state.removableMaxLevel = completedLevel === null ? null : completedLevel - 1;
}

function isLegalSourceBlock(block) {
  if (!block || block.userData.extracted || state.activeBlock) return false;
  const level = recognizedTowerLevel(block);
  if (level === null || state.removableMaxLevel === null) return false;
  return level <= state.removableMaxLevel;
}

function displayedBlockLevel(block) {
  if (!block) return null;
  if (block === state.activeBlock && state.activeSourceLevel !== null && block.userData.extracted) {
    return state.activeSourceLevel;
  }
  return recognizedTowerLevel(block) ?? Number(block.userData.level) ?? null;
}

function blockName(block) {
  if (!block) return "블록";
  const level = displayedBlockLevel(block);
  const slot = Number(block.userData.slot);
  const levelText = Number.isFinite(level) ? `${level}층` : "층 미확인";
  const slotText = Number.isFinite(slot) ? ` · ${slot}번 블록` : "";
  return `${levelText}${slotText}`;
}

function updateRuleStatus(text, phase = state.phase) {
  if (!ruleStatus) return;
  ruleStatus.textContent = text;
  ruleStatus.dataset.state = phase;
}

function showRuleMessage(message) {
  if (selectionStatus) selectionStatus.textContent = message;
}

function updateReadyStatus() {
  state.phase = "ready";
  const maxLevel = state.removableMaxLevel;
  updateRuleStatus(
    maxLevel === null
      ? `턴 ${state.turn} · 블록 선택`
      : `턴 ${state.turn} · ${maxLevel}층 이하 선택`,
    "ready",
  );
}

function pickBlock(event) {
  const camera = getRuntime()?.camera;
  const blocks = getBlocks();
  if (!camera || blocks.length === 0 || !sceneHost) return null;

  const rect = sceneHost.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  return originalIntersectObjects.call(raycaster, blocks, false)[0]?.object ?? null;
}

function activateBlock(block) {
  if (!block || state.activeBlock || state.gameOver) return;
  const sourceLevel = recognizedTowerLevel(block);
  if (sourceLevel === null) return;

  state.activeBlock = block;
  state.activeSourceLevel = sourceLevel;
  state.activeSourceDataLevel = Number(block.userData.level);
  state.activeLifted = false;
  state.phase = "selected";
  updateRuleStatus(`턴 ${state.turn} · ${blockName(block)} 확정`, "selected");
  showRuleMessage(`${blockName(block)} · 이번 턴 블록으로 확정됨`);
}

function updateActivePhase() {
  const block = state.activeBlock;
  if (!block || state.gameOver) return;

  if (
    state.activeSourceDataLevel !== null
    && Number(block.userData.level) !== state.activeSourceDataLevel
    && !block.userData.extracted
  ) {
    state.completedTurns += 1;
    state.turn += 1;
    state.activeBlock = null;
    state.activeSourceLevel = null;
    state.activeSourceDataLevel = null;
    state.activeLifted = false;
    refreshLevelRules();
    updateReadyStatus();
    showRuleMessage(`${state.completedTurns}턴 배치 완료 · 다음 블록을 선택하세요`);
    return;
  }

  if (block.userData.extracted) {
    const position = bodyPosition(block);
    if (position && position.y > FLOOR_DROP_ARM_Y) state.activeLifted = true;
    if (state.activeSourceLevel !== null && state.activeSourceLevel >= 2) state.activeLifted = true;
  }

  const nextPhase = block.userData.extracted ? "extracted" : "selected";
  if (state.phase !== nextPhase) {
    state.phase = nextPhase;
    updateRuleStatus(
      nextPhase === "extracted"
        ? `턴 ${state.turn} · 추출 완료`
        : `턴 ${state.turn} · ${blockName(block)} 확정`,
      nextPhase,
    );
  }
}

function floorDropIsAllowed() {
  return Boolean(window.__blockTowerGameSettings?.allowFloorDrop);
}

function detectForbiddenFloorDrop() {
  if (state.gameOver || floorDropIsAllowed()) return false;
  const block = state.activeBlock;
  if (!block?.userData?.extracted || !state.activeLifted) return false;
  const position = bodyPosition(block);
  if (!position || position.y > FLOOR_CONTACT_Y) return false;

  endGame(
    "추출한 블록을 바닥에 떨어뜨렸습니다. 정통 모드에서는 블록을 바닥에 놓지 않고 최상단까지 운반해야 합니다.",
    "블록을 떨어뜨렸습니다",
  );
  return true;
}

function collapseSnapshot(blocks) {
  const ignoredBlock = state.activeBlock;
  const levelStep = towerGeometry.levelStep ?? 0.7354;
  const baseY = towerGeometry.baseY ?? 0.36;
  const lowHeight = baseY + levelStep * COLLAPSE_LOW_HEIGHT_LEVELS;
  const majorDropDistance = levelStep * COLLAPSE_MAJOR_DROP_LEVELS;

  let monitoredCount = 0;
  let floorScatterCount = 0;
  let majorDropCount = 0;
  let lowMassCount = 0;
  let movingCount = 0;

  for (const block of blocks) {
    if (block === ignoredBlock) continue;
    const position = bodyPosition(block);
    const expected = block.userData.originalPosition;
    if (!position || !expected) continue;
    monitoredCount += 1;

    const horizontalShift = Math.hypot(position.x - expected.x, position.z - expected.z);
    const verticalDrop = expected.y - position.y;
    const tiltAngle = bodyTiltAngle(block);
    const speed = bodyLinearSpeed(block);

    if (verticalDrop > majorDropDistance) majorDropCount += 1;
    if (position.y <= lowHeight) lowMassCount += 1;
    if (speed > COLLAPSE_MOVING_SPEED) movingCount += 1;

    const isFloorHeight = position.y <= FLOOR_CONTACT_Y + 0.12;
    const isScattered = horizontalShift > COLLAPSE_SCATTER_SHIFT || tiltAngle > COLLAPSE_SCATTER_TILT;
    const cameFromAboveFloor = expected.y > baseY + levelStep * 0.75;
    if (isFloorHeight && isScattered && cameFromAboveFloor) floorScatterCount += 1;
  }

  const requiredLowMass = Math.min(
    COLLAPSE_LOW_MASS_COUNT,
    Math.max(18, Math.ceil(monitoredCount * 0.52)),
  );

  const fullyCollapsed = (
    floorScatterCount >= COLLAPSE_FLOOR_SCATTER_COUNT
    && majorDropCount >= COLLAPSE_MAJOR_DROP_COUNT
    && lowMassCount >= requiredLowMass
    && movingCount <= COLLAPSE_MAX_MOVING_COUNT
  );

  return {
    fullyCollapsed,
    floorScatterCount,
    majorDropCount,
    lowMassCount,
    movingCount,
  };
}

function endGame(reason, title = "타워가 무너졌습니다") {
  if (state.gameOver) return;
  state.gameOver = true;
  state.phase = "game-over";
  state.collapseCandidateSince = null;

  updateRuleStatus(`게임 종료 · ${state.completedTurns}턴`, "game-over");
  showRuleMessage(reason);

  if (gameOverTitle) gameOverTitle.textContent = title;
  if (gameOverMessage) gameOverMessage.textContent = reason;
  if (gameOverScore) gameOverScore.textContent = `${state.completedTurns}턴 완료`;
  if (gameOverOverlay) gameOverOverlay.hidden = false;
  sceneHost?.setAttribute("aria-disabled", "true");
}

function detectCollapse() {
  if (state.gameOver || performance.now() - state.startedAt < INITIAL_COLLAPSE_GRACE_MS) return;
  const blocks = getBlocks();
  if (blocks.length < 54) return;

  const snapshot = collapseSnapshot(blocks);
  if (!snapshot.fullyCollapsed) {
    state.collapseCandidateSince = null;
    return;
  }

  if (state.collapseCandidateSince === null) {
    state.collapseCandidateSince = performance.now();
    updateRuleStatus("타워 붕괴 확인 중…", "collapsing");
    return;
  }

  if (performance.now() - state.collapseCandidateSince < COLLAPSE_CONFIRM_MS) return;
  endGame("타워가 완전히 무너져 블록들이 바닥에 흩어졌습니다.");
}

function installInputRaycastGuard() {
  const prototype = THREE.Raycaster.prototype;
  if (prototype.__blockTowerStage5InputGuardPatched) return;

  const original = originalIntersectObjects;
  Object.defineProperty(prototype, "__blockTowerStage5InputGuardPatched", { value: true });
  prototype.intersectObjects = function intersectObjectsWithStage5Guard(objects, recursive, optionalTarget) {
    const intersections = original.call(this, objects, recursive, optionalTarget);
    const firstTowerHit = intersections.find((hit) => isTowerBlock(hit.object));
    if (!firstTowerHit) return intersections;

    if (state.gameOver || state.phase === "loading") return [];
    if (state.activeBlock) {
      return firstTowerHit.object === state.activeBlock
        ? intersections.filter((hit) => !isTowerBlock(hit.object) || hit.object === state.activeBlock)
        : [];
    }

    return isLegalSourceBlock(firstTowerHit.object) ? intersections : [];
  };
}

function blockPointerDown(event) {
  if (event.button !== 0) return;

  if (state.gameOver) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  const block = pickBlock(event);
  if (!block) return;

  if (state.activeBlock) {
    if (block === state.activeBlock) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showRuleMessage(`${blockName(state.activeBlock)}을(를) 이번 턴에 끝까지 사용해야 합니다.`);
    updateRuleStatus(`턴 ${state.turn} · 다른 블록 조작 불가`, state.phase);
    return;
  }

  refreshLevelRules();
  if (!isLegalSourceBlock(block)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const clickedLevel = recognizedTowerLevel(block);
    const maxLevel = state.removableMaxLevel;
    showRuleMessage(
      maxLevel === null
        ? "현재 제거할 수 있는 블록이 없습니다."
        : `${clickedLevel ?? "현재"}층 블록은 제거할 수 없습니다 · ${maxLevel}층 이하에서 선택하세요`,
    );
    updateRuleStatus(`턴 ${state.turn} · 제거 가능 ${maxLevel ?? "-"}층 이하`, "ready");
    return;
  }

  activateBlock(block);
}

function blockPointerMove(event) {
  if (event.button === 2) return;
  if (!state.gameOver) return;
  if ((event.buttons & 1) === 0) return;
  event.preventDefault();
  event.stopImmediatePropagation();
}

function blockKeyDown(event) {
  if (!state.gameOver || !MOVEMENT_KEYS.has(event.code)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
}

installCameraCapture();
installInputRaycastGuard();

sceneHost?.addEventListener("pointerdown", blockPointerDown, { capture: true });
sceneHost?.addEventListener("pointermove", blockPointerMove, { capture: true });
window.addEventListener("keydown", blockKeyDown, { capture: true });

gameRestartButton?.addEventListener("click", () => {
  gameRestartButton.disabled = true;
  gameRestartButton.textContent = "다시 시작하는 중…";
  window.location.reload();
});

function initializeWhenReady() {
  const blocks = getBlocks();
  if (blocks.length < 54) {
    requestAnimationFrame(initializeWhenReady);
    return;
  }

  captureTowerGeometry(blocks);
  refreshLevelRules(blocks);
  state.startedAt = performance.now();
  updateReadyStatus();

  function monitorRules() {
    refreshLevelRules();
    updateActivePhase();
    if (!detectForbiddenFloorDrop()) detectCollapse();
    requestAnimationFrame(monitorRules);
  }

  requestAnimationFrame(monitorRules);
}

requestAnimationFrame(initializeWhenReady);
