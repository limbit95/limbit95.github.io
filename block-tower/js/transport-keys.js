import * as THREE from "three";

const sceneHost = document.querySelector("#scene");
const selectionStatus = document.querySelector("#selection-status");

const HEIGHT_SPEED_PX_PER_SECOND = 240;
const FINE_HEIGHT_SPEED_PX_PER_SECOND = 60;
const FLOOR_SPEED_UNITS_PER_SECOND = 2.4;
const FINE_FLOOR_SPEED_UNITS_PER_SECOND = 0.65;
const CAMERA_ROTATE_SPEED = 0.005;
const MIN_POLAR_ANGLE = Math.PI * 0.17;
const MAX_POLAR_ANGLE = Math.PI * 0.49;
const HEIGHT_KEYS = new Set(["KeyE", "KeyQ"]);
const FLOOR_KEYS = new Set(["KeyW", "KeyA", "KeyS", "KeyD"]);
const WORLD_UP = new THREE.Vector3(0, 1, 0);

let canvas = null;
let activePointer = null;
let heightOffset = 0;
let pointerOffsetX = 0;
let pointerOffsetY = 0;
const floorOffset = new THREE.Vector3();
let raisePressed = false;
let lowerPressed = false;
let finePressed = false;
const floorKeysPressed = new Set();
let cameraDrag = null;
let previousFrame = performance.now();

function hasSelectedBlock() {
  const text = selectionStatus?.textContent ?? "";
  return Boolean(text && !text.startsWith("선택된 블록 없음"));
}

function isExtractedDrag() {
  return Boolean(activePointer && selectionStatus?.textContent.includes("추출됨"));
}

function hasVirtualPointerOffset() {
  return Math.abs(heightOffset) > 0.01
    || Math.abs(pointerOffsetX) > 0.01
    || Math.abs(pointerOffsetY) > 0.01;
}

function resetTransportState() {
  activePointer = null;
  heightOffset = 0;
  pointerOffsetX = 0;
  pointerOffsetY = 0;
  floorOffset.set(0, 0, 0);
  raisePressed = false;
  lowerPressed = false;
  finePressed = false;
  floorKeysPressed.clear();
  cameraDrag = null;
}

function virtualClientPosition() {
  return {
    x: (activePointer?.clientX ?? 0) + pointerOffsetX,
    y: (activePointer?.clientY ?? 0) + pointerOffsetY + heightOffset,
  };
}

function dispatchVirtualPointer(type, { button = -1, buttons = 1 } = {}) {
  if (!canvas || !activePointer) return;
  const client = virtualClientPosition();
  canvas.dispatchEvent(new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: activePointer.pointerId,
    pointerType: activePointer.pointerType,
    isPrimary: true,
    button,
    buttons,
    clientX: client.x,
    clientY: client.y,
  }));
}

function installFloorOffsetHook() {
  const rayPrototype = THREE.Ray.prototype;
  if (rayPrototype.__blockTowerFloorTransportPatched) return;

  const originalIntersectPlane = rayPrototype.intersectPlane;
  Object.defineProperty(rayPrototype, "__blockTowerFloorTransportPatched", { value: true });
  rayPrototype.intersectPlane = function intersectPlaneWithFloorTransport(plane, target) {
    const result = originalIntersectPlane.call(this, plane, target);
    if (result && isExtractedDrag() && floorOffset.lengthSq() > 0.000001) {
      result.add(floorOffset);
    }
    return result;
  };
}

installFloorOffsetHook();

function rotateCamera(deltaX, deltaY) {
  const runtime = window.__blockTowerGameRuntime;
  const camera = runtime?.camera;
  const target = runtime?.orbitTarget;
  if (!camera || !target) return false;

  const offset = camera.position.clone().sub(target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.theta -= deltaX * CAMERA_ROTATE_SPEED;
  // Match OrbitControls: dragging downward raises the camera so the tower top becomes visible.
  spherical.phi = THREE.MathUtils.clamp(
    spherical.phi - deltaY * CAMERA_ROTATE_SPEED,
    MIN_POLAR_ANGLE,
    MAX_POLAR_ANGLE,
  );

  camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(spherical));
  camera.lookAt(target);
  camera.updateMatrixWorld(true);
  return true;
}

function rebasePointerToDragMarker() {
  if (!activePointer || !canvas) return;
  const runtime = window.__blockTowerGameRuntime;
  const camera = runtime?.camera;
  const marker = runtime?.dragMarker;
  if (!camera || !marker?.visible) return;

  camera.updateMatrixWorld(true);
  // The ray hook adds the accumulated WASD floor offset after projection.
  // Remove it here so releasing right-click does not apply that offset twice.
  const projected = marker.position.clone().sub(floorOffset).project(camera);
  const rect = canvas.getBoundingClientRect();
  const screenX = rect.left + ((projected.x + 1) * 0.5) * rect.width;
  const screenY = rect.top + ((1 - projected.y) * 0.5) * rect.height;

  pointerOffsetX = screenX - activePointer.clientX;
  pointerOffsetY = screenY - activePointer.clientY - heightOffset;
  dispatchVirtualPointer("pointermove");
}

function cameraFloorBasis() {
  const camera = window.__blockTowerGameRuntime?.camera;
  if (!camera) return null;

  const forward = camera.getWorldDirection(new THREE.Vector3());
  forward.y = 0;
  if (forward.lengthSq() < 0.0001) forward.set(0, 0, -1);
  forward.normalize();

  const right = new THREE.Vector3().crossVectors(forward, WORLD_UP).normalize();
  return { forward, right };
}

function floorInputDirection() {
  const basis = cameraFloorBasis();
  if (!basis) return null;

  const direction = new THREE.Vector3();
  if (floorKeysPressed.has("KeyW")) direction.add(basis.forward);
  if (floorKeysPressed.has("KeyS")) direction.sub(basis.forward);
  if (floorKeysPressed.has("KeyD")) direction.add(basis.right);
  if (floorKeysPressed.has("KeyA")) direction.sub(basis.right);

  if (direction.lengthSq() < 0.0001) return null;
  return direction.normalize();
}

function bindCanvas(nextCanvas) {
  if (!nextCanvas || canvas === nextCanvas) return;
  canvas = nextCanvas;
}

function findCanvas() {
  const nextCanvas = sceneHost?.querySelector("canvas");
  if (nextCanvas) bindCanvas(nextCanvas);
}

findCanvas();
if (sceneHost && !canvas) {
  const observer = new MutationObserver(() => {
    findCanvas();
    if (canvas) observer.disconnect();
  });
  observer.observe(sceneHost, { childList: true, subtree: true });
}

sceneHost?.addEventListener("pointerdown", (event) => {
  if (!event.isTrusted || event.pointerType === "touch" || event.button !== 0) return;
  activePointer = {
    pointerId: event.pointerId,
    pointerType: event.pointerType || "mouse",
    clientX: event.clientX,
    clientY: event.clientY,
  };
  heightOffset = 0;
  pointerOffsetX = 0;
  pointerOffsetY = 0;
  floorOffset.set(0, 0, 0);
  floorKeysPressed.clear();
}, { capture: true });

// Pointer Events only fire pointerdown for the first pressed mouse button.
// Use mouse events for the left+right button chord so the second (right) press is always detected.
sceneHost?.addEventListener("mousedown", (event) => {
  if (
    event.button !== 2
    || !activePointer
    || (event.buttons & 1) === 0
    || !hasSelectedBlock()
  ) return;

  event.preventDefault();
  event.stopPropagation();
  cameraDrag = {
    clientX: event.clientX,
    clientY: event.clientY,
  };
}, { capture: true });

sceneHost?.addEventListener("pointermove", (event) => {
  if (!event.isTrusted || !activePointer || event.pointerId !== activePointer.pointerId) return;

  if (cameraDrag && (event.buttons & 2) !== 0) {
    event.preventDefault();
    event.stopPropagation();
    const deltaX = event.clientX - cameraDrag.clientX;
    const deltaY = event.clientY - cameraDrag.clientY;
    cameraDrag.clientX = event.clientX;
    cameraDrag.clientY = event.clientY;
    activePointer.clientX = event.clientX;
    activePointer.clientY = event.clientY;
    rotateCamera(deltaX, deltaY);
    return;
  }

  activePointer.clientX = event.clientX;
  activePointer.clientY = event.clientY;

  if (isExtractedDrag() && hasVirtualPointerOffset()) {
    event.preventDefault();
    event.stopPropagation();
    dispatchVirtualPointer("pointermove");
  }
}, { capture: true });

window.addEventListener("mouseup", (event) => {
  if (event.button !== 2 || !cameraDrag || !activePointer) return;
  event.preventDefault();
  cameraDrag = null;
  rebasePointerToDragMarker();
}, { capture: true });

sceneHost?.addEventListener("pointerup", (event) => {
  if (!event.isTrusted || !activePointer || event.pointerId !== activePointer.pointerId) return;
  if (event.button !== 0) return;

  if (isExtractedDrag() && hasVirtualPointerOffset()) {
    event.preventDefault();
    event.stopPropagation();
    dispatchVirtualPointer("pointerup", { button: 0, buttons: 0 });
    resetTransportState();
    return;
  }

  queueMicrotask(resetTransportState);
}, { capture: true });

sceneHost?.addEventListener("pointercancel", (event) => {
  if (!event.isTrusted || !activePointer || event.pointerId !== activePointer.pointerId) return;
  resetTransportState();
}, { capture: true });

window.addEventListener("keydown", (event) => {
  if (!activePointer) return;

  if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    finePressed = true;
    return;
  }

  if (HEIGHT_KEYS.has(event.code)) {
    if (!isExtractedDrag()) return;
    event.preventDefault();
    if (event.code === "KeyE") raisePressed = true;
    if (event.code === "KeyQ") lowerPressed = true;
    return;
  }

  if (FLOOR_KEYS.has(event.code)) {
    if (!isExtractedDrag()) return;
    event.preventDefault();
    floorKeysPressed.add(event.code);
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    finePressed = false;
    return;
  }

  if (event.code === "KeyE") raisePressed = false;
  if (event.code === "KeyQ") lowerPressed = false;
  if (FLOOR_KEYS.has(event.code)) floorKeysPressed.delete(event.code);
});

window.addEventListener("blur", () => {
  raisePressed = false;
  lowerPressed = false;
  finePressed = false;
  floorKeysPressed.clear();
  cameraDrag = null;
});

function animateTransportInput(now) {
  const deltaSeconds = Math.min((now - previousFrame) / 1000, 0.05);
  previousFrame = now;

  if (isExtractedDrag() && !cameraDrag) {
    let targetChanged = false;

    if (raisePressed !== lowerPressed) {
      const speed = finePressed
        ? FINE_HEIGHT_SPEED_PX_PER_SECOND
        : HEIGHT_SPEED_PX_PER_SECOND;
      const direction = raisePressed ? -1 : 1;
      heightOffset += direction * speed * deltaSeconds;
      targetChanged = true;
    }

    const floorDirection = floorInputDirection();
    if (floorDirection) {
      const speed = finePressed
        ? FINE_FLOOR_SPEED_UNITS_PER_SECOND
        : FLOOR_SPEED_UNITS_PER_SECOND;
      floorOffset.addScaledVector(floorDirection, speed * deltaSeconds);
      targetChanged = true;
    }

    if (targetChanged) dispatchVirtualPointer("pointermove");
  }

  requestAnimationFrame(animateTransportInput);
}

requestAnimationFrame(animateTransportInput);
