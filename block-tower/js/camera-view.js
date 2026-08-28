import * as THREE from "three";

const sceneHost = document.querySelector("#scene");
const runtime = window.__blockTowerGameRuntime;

const ORBIT_MAX_DISTANCE = 28;
const EXTENDED_MAX_DISTANCE = 40;
const FOG_FAR_DISTANCE = 60;
const WHEEL_ZOOM_SENSITIVITY = 0.0016;

function installCameraCaptureHook() {
  const prototype = THREE.PerspectiveCamera.prototype;
  if (prototype.__blockTowerCameraViewPatched) return;

  const originalUpdateProjectionMatrix = prototype.updateProjectionMatrix;
  Object.defineProperty(prototype, "__blockTowerCameraViewPatched", { value: true });
  prototype.updateProjectionMatrix = function updateProjectionMatrixWithRuntimeCapture(...args) {
    if (runtime) runtime.camera = this;
    return originalUpdateProjectionMatrix.apply(this, args);
  };
}

function extendSceneFog() {
  const fog = runtime?.scene?.fog;
  if (!fog || fog.far >= FOG_FAR_DISTANCE) return;
  fog.far = FOG_FAR_DISTANCE;
}

function applyExtendedWheelZoom(event) {
  const camera = runtime?.camera;
  const target = runtime?.orbitTarget;
  if (!camera || !target) return;

  const offset = camera.position.clone().sub(target);
  const distance = offset.length();
  const zoomingOut = event.deltaY > 0;
  const zoomingIn = event.deltaY < 0;
  const isExtendedRange = distance > ORBIT_MAX_DISTANCE + 0.01;
  const shouldTakeOver = isExtendedRange || (zoomingOut && distance >= ORBIT_MAX_DISTANCE - 0.25);
  if (!shouldTakeOver || (!zoomingOut && !zoomingIn)) return;

  event.preventDefault();
  event.stopPropagation();

  const scale = Math.exp(event.deltaY * WHEEL_ZOOM_SENSITIVITY);
  const nextDistance = THREE.MathUtils.clamp(
    distance * scale,
    ORBIT_MAX_DISTANCE,
    EXTENDED_MAX_DISTANCE,
  );

  if (zoomingIn && nextDistance <= ORBIT_MAX_DISTANCE + 0.01) {
    offset.setLength(ORBIT_MAX_DISTANCE);
  } else {
    offset.setLength(nextDistance);
  }

  camera.position.copy(target).add(offset);
  camera.lookAt(target);
  camera.updateMatrixWorld(true);
}

installCameraCaptureHook();
sceneHost?.addEventListener("wheel", applyExtendedWheelZoom, { capture: true, passive: false });

function maintainCameraView() {
  extendSceneFog();
  requestAnimationFrame(maintainCameraView);
}

requestAnimationFrame(maintainCameraView);
