import * as THREE from "three";

const sceneHost = document.querySelector("#scene");
const selectionStatus = document.querySelector("#selection-status");
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let lockedBlock = null;
let lockedTurn = null;

function isTowerBlock(object) {
  return Boolean(
    object?.isMesh
    && Number.isInteger(object.userData?.index)
    && object.userData?.body,
  );
}

function getRules() {
  return window.__blockTowerStage5Rules ?? null;
}

function getRuntime() {
  return window.__blockTowerGameRuntime ?? null;
}

function getTowerBlocks() {
  const scene = getRuntime()?.scene;
  if (!scene) return [];

  const blocks = [];
  scene.traverse((object) => {
    if (isTowerBlock(object)) blocks.push(object);
  });
  return blocks;
}

function pickPhysicalBlock(event) {
  const camera = getRuntime()?.camera;
  const blocks = getTowerBlocks();
  if (!sceneHost || !camera || blocks.length === 0) return null;

  const rect = sceneHost.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  let nearestHit = null;
  blocks.forEach((block) => {
    const hit = raycaster.intersectObject(block, false)[0];
    if (!hit) return;
    if (!nearestHit || hit.distance < nearestHit.distance) nearestHit = hit;
  });

  return nearestHit?.object ?? null;
}

function clearLock() {
  lockedBlock = null;
  lockedTurn = null;
}

function syncLockFromRules() {
  const rules = getRules();
  if (!rules) {
    clearLock();
    return null;
  }

  if (rules.activeBlock) {
    lockedBlock = rules.activeBlock;
    lockedTurn = rules.turn;
    return lockedBlock;
  }

  if (lockedBlock && lockedTurn !== rules.turn) {
    clearLock();
  }

  return lockedBlock;
}

function canBecomeTurnBlock(block, rules) {
  if (!block || !rules || rules.gameOver || rules.phase !== "ready") return false;
  if (block.userData.extracted) return false;

  const level = Number(block.userData.level);
  const removableMaxLevel = Number(rules.removableMaxLevel);
  return Number.isInteger(level)
    && Number.isInteger(removableMaxLevel)
    && level <= removableMaxLevel;
}

function blockLabel(block) {
  const level = Number(block?.userData?.level);
  const slot = Number(block?.userData?.slot);
  const levelText = Number.isInteger(level) ? `${level}층` : "선택 블록";
  const slotText = Number.isInteger(slot) ? ` · ${slot}번 블록` : "";
  return `${levelText}${slotText}`;
}

function handlePointerDown(event) {
  if (event.button !== 0) return;

  const rules = getRules();
  if (!rules || rules.gameOver || rules.phase === "loading" || rules.phase === "settling") return;

  const pressedBlock = pickPhysicalBlock(event);
  if (!pressedBlock) return;

  const currentLock = syncLockFromRules();
  if (!currentLock) {
    if (!canBecomeTurnBlock(pressedBlock, rules)) return;

    // Lock before app.js receives this pointerdown. Even if the Stage 5
    // rule layer is one event behind, a second block can never create a drag.
    lockedBlock = pressedBlock;
    lockedTurn = rules.turn;
    return;
  }

  if (pressedBlock === currentLock) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  if (selectionStatus) {
    selectionStatus.textContent = `${blockLabel(currentLock)} 턴 진행 중 · 최상단 배치와 안정화가 끝날 때까지 다른 블록은 조작할 수 없습니다.`;
  }
}

sceneHost?.addEventListener("pointerdown", handlePointerDown, { capture: true });

window.__blockTowerTurnControlLock = {
  get block() {
    return syncLockFromRules();
  },
  reset: clearLock,
};
