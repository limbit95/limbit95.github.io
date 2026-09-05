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

function setPointerFromEvent(event) {
  const camera = getRuntime()?.camera;
  if (!sceneHost || !camera) return null;

  const rect = sceneHost.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  return camera;
}

function pickPhysicalBlock(event) {
  const blocks = getTowerBlocks();
  if (!setPointerFromEvent(event) || blocks.length === 0) return null;

  let nearestHit = null;
  blocks.forEach((block) => {
    const hit = raycaster.intersectObject(block, false)[0];
    if (!hit) return;
    if (!nearestHit || hit.distance < nearestHit.distance) nearestHit = hit;
  });

  return nearestHit?.object ?? null;
}

function pointerHitsBlock(event, block) {
  if (!block || !setPointerFromEvent(event)) return false;
  return Boolean(raycaster.intersectObject(block, false)[0]);
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

function stopPointerDown(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function handlePointerDown(event) {
  if (event.button !== 0) return;

  const rules = getRules();
  if (!rules || rules.gameOver || rules.phase === "loading" || rules.phase === "settling") return;

  const currentLock = syncLockFromRules();
  if (currentLock) {
    // Once the selected block has been extracted, recovery takes priority.
    // This lets the player grab the same block again after dropping it on the
    // floor even when the camera ray also passes through another tower block.
    if (currentLock.userData.extracted && pointerHitsBlock(event, currentLock)) return;

    const pressedBlock = pickPhysicalBlock(event);
    if (!pressedBlock || pressedBlock === currentLock) return;

    stopPointerDown(event);
    if (selectionStatus) {
      selectionStatus.textContent = `${blockLabel(currentLock)} 턴 진행 중 · 최상단 배치와 안정화가 끝날 때까지 다른 블록은 조작할 수 없습니다.`;
    }
    return;
  }

  const pressedBlock = pickPhysicalBlock(event);
  if (!pressedBlock) return;

  if (!canBecomeTurnBlock(pressedBlock, rules)) {
    // The visually front-most block owns this click. Never let an illegal
    // top/front block become transparent to the input ray and expose a
    // removable block behind it.
    stopPointerDown(event);
    if (selectionStatus) {
      selectionStatus.textContent = `${blockLabel(pressedBlock)}은(는) 현재 선택할 수 없습니다 · 뒤쪽 블록으로 선택이 관통되지 않습니다.`;
    }
    return;
  }

  // Lock before app.js receives this pointerdown. Even if the Stage 5
  // rule layer is one event behind, a second block can never create a drag.
  lockedBlock = pressedBlock;
  lockedTurn = rules.turn;
}

sceneHost?.addEventListener("pointerdown", handlePointerDown, { capture: true });

window.__blockTowerTurnControlLock = {
  get block() {
    return syncLockFromRules();
  },
  reset: clearLock,
};
