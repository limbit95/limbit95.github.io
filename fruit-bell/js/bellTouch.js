import { FruitBellScene } from "./scene.js";

let activeScene = null;

const originalConfigurePlayers = FruitBellScene.prototype.configurePlayers;
FruitBellScene.prototype.configurePlayers = function configurePlayersWithTouchBell(players) {
  activeScene = this;
  return originalConfigurePlayers.call(this, players);
};

function isTouchLikePointer(event) {
  return event.pointerType === "touch" || event.pointerType === "pen";
}

function isPointerOverBell(scene, clientX, clientY) {
  if (!scene?.bellTop || !scene?.camera || !scene?.raycaster) return false;

  const rect = scene.canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;

  scene.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  scene.pointer.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
  scene.raycaster.setFromCamera(scene.pointer, scene.camera);

  if (scene.raycaster.intersectObject(scene.bellTop, false).length > 0) return true;

  const bellWorld = scene.bellTop.getWorldPosition(scene.bellTop.position.clone());
  const projected = bellWorld.clone().project(scene.camera);
  if (projected.z < -1 || projected.z > 1) return false;

  const bellX = rect.left + ((projected.x + 1) / 2) * rect.width;
  const bellY = rect.top + ((1 - projected.y) / 2) * rect.height;
  const touchRadius = Math.max(48, Math.min(76, Math.min(rect.width, rect.height) * 0.09));

  return Math.hypot(clientX - bellX, clientY - bellY) <= touchRadius;
}

function dispatchBellInput() {
  document.dispatchEvent(new KeyboardEvent("keydown", {
    key: " ",
    code: "Space",
    bubbles: true,
    cancelable: true,
  }));
}

const canvas = document.querySelector("#game-canvas");
const gameView = document.querySelector("#game-view");

canvas?.addEventListener("pointerdown", (event) => {
  if (!isTouchLikePointer(event) || !activeScene || !gameView || gameView.hidden) return;
  if (!isPointerOverBell(activeScene, event.clientX, event.clientY)) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  dispatchBellInput();
}, { capture: true, passive: false });

const touchUi = window.matchMedia?.("(hover: none) and (pointer: coarse)")?.matches;
const statusText = document.querySelector("#status-text");

if (touchUi && statusText) {
  const replaceDesktopBellHint = () => {
    if (statusText.textContent.includes("왼손으로 스페이스바를 먼저 누르세요!")) {
      statusText.textContent = "과일 합계 5! 중앙의 종을 터치하세요!";
    }
  };

  new MutationObserver(replaceDesktopBellHint).observe(statusText, {
    childList: true,
    characterData: true,
    subtree: true,
  });
  replaceDesktopBellHint();
}
