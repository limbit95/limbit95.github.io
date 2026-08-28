import * as THREE from "three";

const FLOOR_SIZE = 80;
const RESCUE_Y = -0.8;
const RESCUE_HALF_EXTENT = 6;
const RESCUE_HEIGHT = 0.42;

const runtime = window.__blockTowerGameRuntime;
let visualFloorReady = false;

function isTowerBlock(object) {
  return Boolean(
    object?.isMesh
    && object.userData?.index !== undefined
    && object.userData?.body,
  );
}

function isOriginalFloor(object) {
  return Boolean(
    object?.isMesh
    && object.geometry?.type === "CylinderGeometry"
    && object.material?.isMeshStandardMaterial,
  );
}

function flattenVisualFloor(scene) {
  if (visualFloorReady || !scene) return;
  let floor = null;
  scene.traverse((object) => {
    if (!floor && isOriginalFloor(object)) floor = object;
  });
  if (!floor) return;

  floor.geometry.dispose();
  floor.geometry = new THREE.PlaneGeometry(FLOOR_SIZE, FLOOR_SIZE);
  floor.rotation.set(-Math.PI / 2, 0, 0);
  floor.position.set(0, -0.025, 0);
  floor.receiveShadow = true;
  visualFloorReady = true;
}

function rescueFallenExtractedBlocks(scene) {
  if (!scene) return;
  scene.traverse((object) => {
    if (!isTowerBlock(object) || !object.userData.extracted) return;

    const body = object.userData.body;
    const position = body.translation();
    if (position.y >= RESCUE_Y) return;

    const x = THREE.MathUtils.clamp(position.x, -RESCUE_HALF_EXTENT, RESCUE_HALF_EXTENT);
    const z = THREE.MathUtils.clamp(position.z, -RESCUE_HALF_EXTENT, RESCUE_HALF_EXTENT);
    body.resetForces(true);
    body.resetTorques(true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    body.setTranslation({ x, y: RESCUE_HEIGHT, z }, true);
  });
}

function maintainPlayArea() {
  const scene = runtime?.scene;
  flattenVisualFloor(scene);
  rescueFallenExtractedBlocks(scene);
  requestAnimationFrame(maintainPlayArea);
}

requestAnimationFrame(maintainPlayArea);
