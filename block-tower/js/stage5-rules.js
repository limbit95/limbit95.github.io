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
const TURN_SETTLE_MIN_MS = 700;
const TURN_STABLE_CONFIRM_MS = 1400;
const TOWER_STABLE_LINEAR_SPEED = 0.055;
const TOWER_STABLE_ANGULAR_SPEED = 0.07;
const FLOOR_TOP_Y = -0.02;
const FLOOR_CONTACT_MARGIN = 0.09;
const ACTIVE_LIFT_CLEARANCE = 0.28;
const BLOCK_HALF_LENGTH = 4.5 / 2;
const BLOCK_HALF_HEIGHT = 0.72 / 2;
const BLOCK_HALF_WIDTH = 1.42 / 2;
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
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);

const originalIntersectObjects = THREE.Raycaster.prototype.intersectObjects;
const turnStartLevels = new Map();

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
  placementStartedAt: null,
  stableSince: null,
  highestCompletedLevel: null,
  removableMaxLevel: null,
  collapseCandidateSince: null,
  gameOver: false,
  startedAt: performance.now(),
  resetSession: null,
};

window.__blockTowerStage5Rules = state;

let selectionAttemptOpen = false;

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

function logicalLevel(block) {
  const level = Number(block?.userData?.level);
  return Number.isInteger(level) && level > 0 ? level : null;
}

function bodyPosition(block) {
  const translation = block?.userData?.body?.translation?.();
  if (!translation) return null;
  return new THREE.Vector3(translation.x, translation.y, translation.z);
}

function bodyQuaternion(block) {
  const rotation = block?.userData?.body?.rotation?.();
  if (!rotation) return null;
  return new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
}

function bodyTiltAngle(block) {
  const quaternion = bodyQuaternion(block);
  if (!quaternion) return 0;
  const up = WORLD_UP.clone().applyQuaternion(quaternion).normalize();
  return up.angleTo(WORLD_UP);
}

function bodyLinearSpeed(block) {
  const velocity = block?.userData?.body?.linvel?.();
  if (!velocity) return 0;
  return Math.hypot(velocity.x, velocity.y, velocity.z);
}

function bodyAngularSpeed(block) {
  const velocity = block?.userData?.body?.angvel?.();
  if (!velocity) return 0;
  return Math.hypot(velocity.x, velocity.y, velocity.z);
}

function blockBottomY(block) {
  const position = bodyPosition(block);
  const quaternion = bodyQuaternion(block);
  if (!position || !quaternion) return Infinity;

  const xAxis = X_AXIS.clone().applyQuaternion(quaternion);
  const yAxis = Y_AXIS.clone().applyQuaternion(quaternion);
  const zAxis = Z_AXIS.clone().applyQuaternion(quaternion);
  const projectedHalfHeight = (
    Math.abs(xAxis.y) * BLOCK_HALF_LENGTH
    + Math.abs(yAxis.y) * BLOCK_HALF_HEIGHT
    + Math.abs(zAxis.y) * BLOCK_HALF_WIDTH
  );
  return position.y - projectedHalfHeight;
}

function blockTouchesFloor(block) {
  return blockBottomY(block) <= FLOOR_TOP_Y + FLOOR_CONTACT_MARGIN;
}

function captureTowerGeometry(blocks) {
  const levelCenters = new Map();
  blocks.forEach((block) => {
    const level = logicalLevel(block);
    const position = bodyPosition(block);
    if (level === null || !position) return;
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

function highestCompletedLevel(blocks = getBlocks()) {
  const levelCounts = new Map();
  blocks.forEach((block) => {
    if (block.userData.extracted) return;
    const level = logicalLevel(block);
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
  if (!block || block.userData.extracted || state.activeBlock || state.phase !== "ready") return false;
  const level = logicalLevel(block);
  if (level === null || state.removableMaxLevel === null) return false;
  return level <= state.removableMaxLevel;
}

function displayedBlockLevel(block) {
  if (!block) return null;
  if (
    block === state.activeBlock
    && state.activeSourceLevel !== null
    && state.phase !== "settling"
  ) {
    return state.activeSourceLevel;
  }
  return logicalLevel(block);
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

function captureTurnStartLevels() {
  turnStartLevels.clear();
  getBlocks().forEach((block) => {
    const level = logicalLevel(block);
    if (level !== null) turnStartLevels.set(block.userData.index, level);
  });
}

function activateBlock(block) {
  if (!block || state.activeBlock || state.gameOver) return false;
  const sourceLevel = logicalLevel(block);
  if (sourceLevel === null) return false;

  state.activeBlock = block;
  state.activeSourceLevel = sourceLevel;
  state.activeSourceDataLevel = sourceLevel;
  state.activeLifted = false;
  state.placementStartedAt = null;
  state.stableSince = null;
  state.phase = "selected";
  captureTurnStartLevels();
  updateRuleStatus(`턴 ${state.turn} · ${blockName(block)} 확정`, "selected");
  showRuleMessage(`${blockName(block)} · 최상단 배치와 타워 안정화가 끝날 때까지 이 블록만 조작할 수 있습니다.`);
  return true;
}

function beginSettling(block) {
  if (!block || state.phase === "settling" || state.gameOver) return;
  state.phase = "settling";
  state.placementStartedAt = performance.now();
  state.stableSince = null;
  updateRuleStatus(`턴 ${state.turn} · 타워 안정화 확인 중`, "settling");
  showRuleMessage(`${blockName(block)} 최상단 배치 완료 · 타워의 흔들림과 다른 블록의 낙하 여부를 확인하고 있습니다.`);
}

function updateActivePhase() {
  const block = state.activeBlock;
  if (!block || state.gameOver) return;

  const currentDataLevel = logicalLevel(block);
  const placementCompleted = (
    state.activeSourceDataLevel !== null
    && currentDataLevel !== null
    && currentDataLevel !== state.activeSourceDataLevel
    && !block.userData.extracted
  );

  if (placementCompleted) {
    beginSettling(block);
    return;
  }

  if (state.phase === "settling") return;

  if (block.userData.extracted) {
    if (state.activeSourceLevel !== null && state.activeSourceLevel >= 2) {
      state.activeLifted = true;
    } else if (blockBottomY(block) > FLOOR_TOP_Y + ACTIVE_LIFT_CLEARANCE) {
      state.activeLifted = true;
    }

    if (state.phase !== "extracted") {
      state.phase = "extracted";
      updateRuleStatus(`턴 ${state.turn} · 추출 완료`, "extracted");
    }
    return;
  }

  if (state.phase !== "selected") {
    state.phase = "selected";
    updateRuleStatus(`턴 ${state.turn} · ${blockName(block)} 확정`, "selected");
  }
}

function floorDropIsAllowed() {
  return Boolean(window.__blockTowerGameSettings?.allowFloorDrop);
}

function detectForbiddenActiveFloorDrop() {
  if (state.gameOver || floorDropIsAllowed()) return false;
  const block = state.activeBlock;
  if (!block?.userData?.extracted || !state.activeLifted || !blockTouchesFloor(block)) return false;

  endGame(
    "선택한 블록을 바닥에 떨어뜨렸습니다. 현재 설정에서는 선택한 블록을 바닥에 놓지 않고 최상단까지 운반해야 합니다.",
    "선택한 블록을 떨어뜨렸습니다",
  );
  return true;
}

function detectOtherBlockFloorDrop() {
  if (state.gameOver || !state.activeBlock) return false;

  for (const block of getBlocks()) {
    if (block === state.activeBlock) continue;
    const startLevel = turnStartLevels.get(block.userData.index);
    if (!Number.isInteger(startLevel) || startLevel <= 1) continue;
    if (!blockTouchesFloor(block)) continue;

    endGame(
      `${startLevel}층의 다른 블록이 바닥에 떨어졌습니다. 선택한 블록 외 다른 블록이 바닥에 떨어지면 해당 턴은 즉시 실패합니다.`,
      "다른 블록이 떨어졌습니다",
    );
    return true;
  }

  return false;
}

function towerMotionSnapshot(blocks = getBlocks()) {
  let movingCount = 0;
  let maxLinearSpeed = 0;
  let maxAngularSpeed = 0;

  blocks.forEach((block) => {
    const body = block.userData.body;
    const sleeping = typeof body.isSleeping === "function" && body.isSleeping();
    const linearSpeed = bodyLinearSpeed(block);
    const angularSpeed = bodyAngularSpeed(block);
    maxLinearSpeed = Math.max(maxLinearSpeed, linearSpeed);
    maxAngularSpeed = Math.max(maxAngularSpeed, angularSpeed);
    if (
      !sleeping
      && (linearSpeed > TOWER_STABLE_LINEAR_SPEED || angularSpeed > TOWER_STABLE_ANGULAR_SPEED)
    ) {
      movingCount += 1;
    }
  });

  return {
    movingCount,
    maxLinearSpeed,
    maxAngularSpeed,
    stable: movingCount === 0,
  };
}

function finishStableTurn() {
  const placedBlock = state.activeBlock;
  state.completedTurns += 1;
  state.turn += 1;
  state.activeBlock = null;
  state.activeSourceLevel = null;
  state.activeSourceDataLevel = null;
  state.activeLifted = false;
  state.placementStartedAt = null;
  state.stableSince = null;
  turnStartLevels.clear();
  refreshLevelRules();
  updateReadyStatus();
  showRuleMessage(`${blockName(placedBlock)} 배치 후 타워 안정 확인 완료 · 다음 사람의 턴입니다.`);
}

function updateSettlingState() {
  if (state.gameOver || state.phase !== "settling" || !state.activeBlock) return;
  const now = performance.now();
  if (state.placementStartedAt === null || now - state.placementStartedAt < TURN_SETTLE_MIN_MS) return;

  const motion = towerMotionSnapshot();
  if (!motion.stable) {
    state.stableSince = null;
    updateRuleStatus(
      `턴 ${state.turn} · 흔들림 멈춤 대기 (${motion.movingCount}개 움직임)`,
      "settling",
    );
    return;
  }

  if (state.stableSince === null) {
    state.stableSince = now;
    updateRuleStatus(`턴 ${state.turn} · 안정 상태 확인 중`, "settling");
    return;
  }

  if (now - state.stableSince < TURN_STABLE_CONFIRM_MS) return;
  finishStableTurn();
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

    const isFloorHeight = blockTouchesFloor(block);
    const isScattered = horizontalShift > COLLAPSE_SCATTER_SHIFT || tiltAngle > COLLAPSE_SCATTER_TILT;
    const cameFromAboveFloor = expected.y > baseY + levelStep * 0.75;
    if (isFloorHeight && isScattered && cameFromAboveFloor) floorScatterCount += 1;
  }

  const requiredLowMass = Math.min(
    COLLAPSE_LOW_MASS_COUNT,
    Math.max(18, Math.ceil(monitoredCount * 0.52)),
  );

  return {
    fullyCollapsed: (
      floorScatterCount >= COLLAPSE_FLOOR_SCATTER_COUNT
      && majorDropCount >= COLLAPSE_MAJOR_DROP_COUNT
      && lowMassCount >= requiredLowMass
      && movingCount <= COLLAPSE_MAX_MOVING_COUNT
    ),
  };
}

function endGame(reason, title = "타워가 무너졌습니다") {
  if (state.gameOver) return;
  state.gameOver = true;
  state.phase = "game-over";
  state.collapseCandidateSince = null;
  state.stableSince = null;
  selectionAttemptOpen = false;

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

function showIllegalBlockMessage(block) {
  const level = logicalLevel(block);
  const maxLevel = state.removableMaxLevel;
  showRuleMessage(
    maxLevel === null
      ? "현재 제거할 수 있는 블록이 없습니다."
      : `${level ?? "현재"}층 블록은 제거할 수 없습니다 · ${maxLevel}층 이하에서 선택하세요.`,
  );
  updateRuleStatus(`턴 ${state.turn} · 제거 가능 ${maxLevel ?? "-"}층 이하`, "ready");
}

function installInputRaycastGuard() {
  const prototype = THREE.Raycaster.prototype;
  if (prototype.__blockTowerStage5InputGuardPatched) return;

  Object.defineProperty(prototype, "__blockTowerStage5InputGuardPatched", { value: true });
  prototype.intersectObjects = function intersectObjectsWithStage5Guard(objects, recursive, optionalTarget) {
    const intersections = originalIntersectObjects.call(this, objects, recursive, optionalTarget);
    const towerHits = intersections.filter((hit) => isTowerBlock(hit.object));
    if (towerHits.length === 0) return intersections;

    if (state.gameOver || state.phase === "loading" || state.phase === "settling") return [];

    if (state.activeBlock) {
      return intersections.filter(
        (hit) => !isTowerBlock(hit.object) || hit.object === state.activeBlock,
      );
    }

    refreshLevelRules();
    const firstBlock = towerHits[0].object;

    if (selectionAttemptOpen) {
      if (!isLegalSourceBlock(firstBlock)) {
        showIllegalBlockMessage(firstBlock);
        return [];
      }
      activateBlock(firstBlock);
      return intersections.filter(
        (hit) => !isTowerBlock(hit.object) || hit.object === state.activeBlock,
      );
    }

    return intersections.filter(
      (hit) => !isTowerBlock(hit.object) || isLegalSourceBlock(hit.object),
    );
  };
}

function blockPointerDown(event) {
  if (event.button !== 0) return;

  if (state.gameOver || state.phase === "settling") {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (state.activeBlock) return;

  selectionAttemptOpen = true;
  queueMicrotask(() => {
    selectionAttemptOpen = false;
  });
}

function blockPointerMove(event) {
  if (event.button === 2) return;
  if (!state.gameOver && state.phase !== "settling") return;
  if ((event.buttons & 1) === 0) return;
  event.preventDefault();
  event.stopImmediatePropagation();
}

function blockKeyDown(event) {
  if (!MOVEMENT_KEYS.has(event.code)) return;
  if (!state.gameOver && state.phase !== "settling") return;
  event.preventDefault();
  event.stopImmediatePropagation();
}

function resetSession() {
  state.phase = "loading";
  state.turn = 1;
  state.completedTurns = 0;
  state.activeBlock = null;
  state.activeSourceLevel = null;
  state.activeSourceDataLevel = null;
  state.activeLifted = false;
  state.placementStartedAt = null;
  state.stableSince = null;
  state.collapseCandidateSince = null;
  state.gameOver = false;
  state.startedAt = performance.now();
  selectionAttemptOpen = false;
  turnStartLevels.clear();
  if (gameOverOverlay) gameOverOverlay.hidden = true;
  sceneHost?.removeAttribute("aria-disabled");
  const blocks = getBlocks();
  if (blocks.length >= 54) {
    captureTowerGeometry(blocks);
    refreshLevelRules(blocks);
    updateReadyStatus();
  }
}

state.resetSession = resetSession;

installInputRaycastGuard();
sceneHost?.addEventListener("pointerdown", blockPointerDown, { capture: true });
sceneHost?.addEventListener("pointermove", blockPointerMove, { capture: true });
window.addEventListener("keydown", blockKeyDown, { capture: true });

gameRestartButton?.addEventListener("click", () => {
  resetSession();
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

    if (!detectOtherBlockFloorDrop() && !detectForbiddenActiveFloorDrop()) {
      detectCollapse();
      updateSettlingState();
    }

    requestAnimationFrame(monitorRules);
  }

  requestAnimationFrame(monitorRules);
}

requestAnimationFrame(initializeWhenReady);
