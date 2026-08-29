import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const runtime = window.__blockTowerGameRuntime;
const CONFIGURED_MAX_DISTANCE = 28;
const EXTENDED_MAX_DISTANCE = 40;
const FOG_FAR_DISTANCE = 60;
const maxDistanceByControls = new WeakMap();

function installExtendedOrbitDistance() {
  const prototype = OrbitControls.prototype;
  if (prototype.__blockTowerExtendedDistancePatched) return;

  const existingDescriptor = Object.getOwnPropertyDescriptor(prototype, "maxDistance");
  if (existingDescriptor) return;

  Object.defineProperty(prototype, "__blockTowerExtendedDistancePatched", { value: true });
  Object.defineProperty(prototype, "maxDistance", {
    configurable: true,
    get() {
      return maxDistanceByControls.get(this) ?? Infinity;
    },
    set(value) {
      const numericValue = Number(value);
      const nextValue = Number.isFinite(numericValue) && numericValue === CONFIGURED_MAX_DISTANCE
        ? EXTENDED_MAX_DISTANCE
        : value;
      maxDistanceByControls.set(this, nextValue);
    },
  });
}

function extendSceneFog() {
  const fog = runtime?.scene?.fog;
  if (!fog || fog.far >= FOG_FAR_DISTANCE) return;
  fog.far = FOG_FAR_DISTANCE;
}

installExtendedOrbitDistance();

function maintainCameraView() {
  extendSceneFog();
  requestAnimationFrame(maintainCameraView);
}

requestAnimationFrame(maintainCameraView);
