import * as THREE from "three";

const sceneHost = document.querySelector("#scene");
const selectionStatus = document.querySelector("#selection-status");
const ruleStatus = document.querySelector("#rule-status");
const gameOverOverlay = document.querySelector("#game-over-overlay");
const gameOverTitle = document.querySelector("#game-over-title");
const gameOverMessage = document.querySelector("#game-over-message");
const gameOverScore = document.querySelector("#game-over-score");
const gameRestartButton = document.querySelector("#game-restart-button");

const COMMIT_DISTANCE = 0.08;
const INITIAL_COLLAPSE_GRACE_MS = 2500;
const SINGLE_BLOCK_DROP_DISTANCE = 1.05;
const SINGLE_BLOCK_FAR_DISTANCE = 3.25;
const SINGLE_BLOCK_TILT_ANGLE = THREE.MathUtils.degToRad(70);
const SINGLE_BLOCK_TILT_SHIFT = 0.5;
const MASS_SHIFT_DISTANCE = 1.2;
const MASS_DROP_DISTANCE = 0.55;
const MASS_TILT_ANGLE = THREE.MathUtils.degToRad(38);
const MASS_COLLAPSE_COUNT = 4;
const MOVEMENT_KEYS = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "KeyE", "KeyQ"]);
const WORLD_UP = new THREE.Vector3(0, 1, 0);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const turnCandidateBaselines = new Map();

const state = {
  phase: "loading",
  turn: 1,
  completedTurns: 0,
  candidateBlock: null,
  activeBlock: null,
  activeSourceLevel: null,
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

installCameraCapture();

function getRuntime() {
  return window.__blockTowerGameRuntime ?? null;
}

function getBlocks() {
  const scene = getRuntime()?.scene;
  if (!scene) return [];

  const blocks = [];
  scene.traverse((object) => {
    if (
      object.isMesh
      && Number.isInteger(object.userData?.index)
      && object.userData?.body
    ) {
      blocks.push(object);
    }
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

function highestCompletedLevel(blocks = getBlocks()) {
  if (blocks.length === 0) return null;

  const levelCounts = new Map();
  blocks.forEach((block) => {
    const level = Number(block.userData.level);
    if (!Number.isFinite(level)) return;
    levelCounts.set(level, (levelCounts.get(level) ?? 0) + 1);
  });

  const levels = [...levelCounts.keys()].sort((a, b) => b - a);
  for (const level of levels) {
    if ((levelCounts.get(level) ?? 0) >= 3) return level;
  }
  return null;
}

function removableMaxLevel() {
  const completedLevel = highestCompletedLevel();
  return completedLevel === null ? null : completedLevel - 1;
}

function isLegalSourceBlock(block) {
  if (!block || block.userData.extracted) return false;
  const maxLevel = removableMaxLevel();
  if (maxLevel === null) return false;
  return Number(block.userData.level) <= maxLevel;
}

function blockName(block) {
  if (!block) return "블록";
  return `${block.userData.level}층 · ${block.userData.slot}번 블록`;
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
  updateRuleStatus(`턴 ${state.turn} · 블록 선택`, "ready");
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
  return raycaster.intersectObjects(blocks, false)[0]?.object ?? null;
}

function rememberCandidate(block) {
  if (!block || state.activeBlock || state.gameOver) return;
  const position = bodyPosition(block);
  if (!position) return;

  if (!turnCandidateBaselines.has(block.userData.index)) {
    turnCandidateBaselines.set(block.userData.index, position.clone());
  }
  state.candidateBlock = block;
}

function commitCandidateIfMoved() {
  if (state.gameOver || state.activeBlock || !state.candidateBlock) return;
  const block = state.candidateBlock;
  const baseline = turnCandidateBaselines.get(block.userData.index);
  const position = bodyPosition(block);
  if (!baseline || !position || position.distanceTo(baseline) < COMMIT_DISTANCE) return;

  state.activeBlock = block;
  state.activeSourceLevel = Number(block.userData.level);
  state.phase = block.userData.extracted ? "extracted" : "committed";
  updateRuleStatus(`턴 ${state.turn} · ${blockName(block)} 확정`, state.phase);
  showRuleMessage(`${blockName(block)} · 이번 턴 블록으로 확정됨`);
}

function updateActivePhase() {
  const block = state.activeBlock;
  if (!block || state.gameOver) return;

  if (
    state.activeSourceLevel !== null
    && Number(block.userData.level) !== state.activeSourceLevel
    && !block.userData.extracted
  ) {
    state.completedTurns += 1;
    state.turn += 1;
    state.activeBlock = null;
    state.activeSourceLevel = null;
    state.candidateBlock = null;
    turnCandidateBaselines.clear();
    updateReadyStatus();
    showRuleMessage(`${state.completedTurns}턴 배치 완료 · 다음 블록을 선택하세요`);
    return;
  }

  const nextPhase = block.userData.extracted ? "extracted" : "committed";
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

function collapseSnapshot(blocks) {
  const ignoredBlock = state.activeBlock;
  let massInstabilityCount = 0;

  for (const block of blocks) {
    if (block === ignoredBlock) continue;
    const position = bodyPosition(block);
    const expected = block.userData.originalPosition;
    if (!position || !expected) continue;

    const horizontalShift = Math.hypot(position.x - expected.x, position.z - expected.z);
    const verticalDrop = expected.y - position.y;
    const tiltAngle = bodyTiltAngle(block);

    if (expected.y > 1.15 && verticalDrop > SINGLE_BLOCK_DROP_DISTANCE) {
      return {
        collapsed: true,
        reason: `${blockName(block)}이 아래로 떨어졌습니다.`,
      };
    }

    if (horizontalShift > SINGLE_BLOCK_FAR_DISTANCE) {
      return {
        collapsed: true,
        reason: `${blockName(block)}이 타워에서 크게 벗어났습니다.`,
      };
    }

    if (tiltAngle > SINGLE_BLOCK_TILT_ANGLE && horizontalShift > SINGLE_BLOCK_TILT_SHIFT) {
      return {
        collapsed: true,
        reason: `${blockName(block)}이 넘어졌습니다.`,
      };
    }

    if (
      horizontalShift > MASS_SHIFT_DISTANCE
      || verticalDrop > MASS_DROP_DISTANCE
      || tiltAngle > MASS_TILT_ANGLE
    ) {
      massInstabilityCount += 1;
    }
  }

  if (massInstabilityCount >= MASS_COLLAPSE_COUNT) {
    return {
      collapsed: true,
      reason: "여러 블록이 동시에 크게 움직이며 타워가 무너졌습니다.",
    };
  }

  return { collapsed: false, reason: "" };
}

function endGame(reason) {
  if (state.gameOver) return;
  state.gameOver = true;
  state.phase = "game-over";
  state.candidateBlock = null;
  turnCandidateBaselines.clear();

  updateRuleStatus(`게임 종료 · ${state.completedTurns}턴`, "game-over");
  showRuleMessage(`타워 붕괴 · ${reason}`);

  if (gameOverTitle) gameOverTitle.textContent = "타워가 무너졌습니다";
  if (gameOverMessage) gameOverMessage.textContent = reason;
  if (gameOverScore) gameOverScore.textContent = `${state.completedTurns}턴 완료`;
  if (gameOverOverlay) gameOverOverlay.hidden = false;
  sceneHost?.setAttribute("aria-disabled", "true");
}

function detectCollapse() {
  if (state.gameOver || performance.now() - state.startedAt < INITIAL_COLLAPSE_GRACE_MS) return;
  const blocks = getBlocks();
  if (blocks.length < 54) return;
  const result = collapseSnapshot(blocks);
  if (result.collapsed) endGame(result.reason);
}

function blockPointerDown(event) {
  if (!event.isTrusted || event.button !== 0) return;

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
    updateRuleStatus(`턴 ${state.turn} · 다른 블록 선택 불가`, state.phase);
    return;
  }

  if (!isLegalSourceBlock(block)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const maxLevel = removableMaxLevel();
    showRuleMessage(
      maxLevel === null
        ? "현재 제거할 수 있는 블록이 없습니다."
        : `${block.userData.level}층은 현재 제거할 수 없습니다 · ${maxLevel}층 이하에서 선택하세요`,
    );
    updateRuleStatus(`턴 ${state.turn} · 제거 가능 ${maxLevel ?? "-"}층 이하`, "ready");
    return;
  }

  rememberCandidate(block);
}

function blockPointerMove(event) {
  if (!event.isTrusted || event.button === 2) return;
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

  state.startedAt = performance.now();
  updateReadyStatus();

  function monitorRules() {
    commitCandidateIfMoved();
    updateActivePhase();
    detectCollapse();
    requestAnimationFrame(monitorRules);
  }

  requestAnimationFrame(monitorRules);
}

requestAnimationFrame(initializeWhenReady);
