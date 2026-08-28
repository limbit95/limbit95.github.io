import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import RAPIER from "@dimforge/rapier3d-compat";

const sceneHost = document.querySelector("#scene");
const loading = document.querySelector("#loading");
const selectionStatus = document.querySelector("#selection-status");

if (!sceneHost) throw new Error("3D scene container was not found.");

await RAPIER.init();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x201b17);
scene.fog = new THREE.Fog(0x201b17, 20, 42);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(11, 10, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
sceneHost.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.enablePan = false;
controls.minDistance = 8;
controls.maxDistance = 28;
controls.minPolarAngle = Math.PI * 0.17;
controls.maxPolarAngle = Math.PI * 0.49;
controls.target.set(0, 5.3, 0);
controls.mouseButtons.LEFT = null;
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
controls.touches.ONE = THREE.TOUCH.ROTATE;
controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
controls.update();

renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());

scene.add(new THREE.HemisphereLight(0xffead3, 0x392d24, 1.7));

const keyLight = new THREE.DirectionalLight(0xffe2bd, 3.5);
keyLight.position.set(6, 14, 8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -10;
keyLight.shadow.camera.right = 10;
keyLight.shadow.camera.top = 16;
keyLight.shadow.camera.bottom = -4;
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x9fb6ff, 1.1);
rimLight.position.set(-8, 9, -7);
scene.add(rimLight);

const floor = new THREE.Mesh(
  new THREE.CylinderGeometry(7, 7.5, 0.55, 64),
  new THREE.MeshStandardMaterial({ color: 0x2e2721, roughness: 0.92, metalness: 0.02 }),
);
floor.position.y = -0.32;
floor.receiveShadow = true;
scene.add(floor);

const floorRing = new THREE.Mesh(
  new THREE.TorusGeometry(6.15, 0.025, 8, 96),
  new THREE.MeshBasicMaterial({ color: 0x8a684a, transparent: true, opacity: 0.38 }),
);
floorRing.rotation.x = Math.PI / 2;
floorRing.position.y = 0.01;
scene.add(floorRing);

const BLOCK_LENGTH = 4.5;
const BLOCK_WIDTH = 1.42;
const BLOCK_HEIGHT = 0.72;
const GAP = 0.055;
const LEVELS = 18;
const PHYSICS_STEP = 1 / 60;
const DRAG_DISTANCE_PER_PIXEL = 0.012;
const DRAG_SPRING = 95;
const DRAG_DAMPING = 13;
const MAX_DRAG_FORCE = 130;
const blocks = [];
const blockGeometry = new THREE.BoxGeometry(BLOCK_LENGTH, BLOCK_HEIGHT, BLOCK_WIDTH, 3, 1, 1);

const woodPalette = [0xb9793f, 0xc6894c, 0xd09355, 0xbf7f45, 0xca8a50, 0xb8753e];

function makeBlockMaterial(index) {
  return new THREE.MeshStandardMaterial({
    color: woodPalette[index % woodPalette.length],
    roughness: 0.72 + (index % 3) * 0.04,
    metalness: 0,
  });
}

const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
world.timestep = PHYSICS_STEP;

const groundBody = world.createRigidBody(
  RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.27, 0),
);
world.createCollider(
  RAPIER.ColliderDesc.cuboid(7.2, 0.25, 7.2)
    .setFriction(0.92)
    .setRestitution(0.01),
  groundBody,
);

for (let level = 0; level < LEVELS; level += 1) {
  const rotate = level % 2 === 1;
  const y = BLOCK_HEIGHT / 2 + level * (BLOCK_HEIGHT + GAP * 0.28);

  for (let slot = 0; slot < 3; slot += 1) {
    const index = level * 3 + slot;
    const offset = (slot - 1) * (BLOCK_WIDTH + GAP);
    const block = new THREE.Mesh(blockGeometry, makeBlockMaterial(index));

    if (rotate) {
      block.rotation.y = Math.PI / 2;
      block.position.set(offset, y, 0);
    } else {
      block.position.set(0, y, offset);
    }

    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(block.position.x, block.position.y, block.position.z)
      .setRotation({
        x: block.quaternion.x,
        y: block.quaternion.y,
        z: block.quaternion.z,
        w: block.quaternion.w,
      })
      .setLinearDamping(0.28)
      .setAngularDamping(0.42);
    const body = world.createRigidBody(rigidBodyDesc);
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(BLOCK_LENGTH / 2, BLOCK_HEIGHT / 2, BLOCK_WIDTH / 2)
        .setDensity(0.58)
        .setFriction(0.72)
        .setRestitution(0.015),
      body,
    );

    block.castShadow = true;
    block.receiveShadow = true;
    block.userData = {
      index,
      level: level + 1,
      slot: slot + 1,
      selected: false,
      body,
      dragAxis: rotate ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0),
    };
    scene.add(block);
    blocks.push(block);
  }
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let selectedBlock = null;
let pointerDown = null;
let dragState = null;

function selectionLabel(block, suffix = "") {
  if (!block) return "선택된 블록 없음";
  return `${block.userData.level}층 · ${block.userData.slot}번 블록${suffix}`;
}

function setSelectedBlock(block) {
  if (selectedBlock) {
    selectedBlock.material.emissive.setHex(0x000000);
    selectedBlock.material.emissiveIntensity = 0;
    selectedBlock.userData.selected = false;
  }

  selectedBlock = block;

  if (!selectedBlock) {
    selectionStatus.textContent = selectionLabel(null);
    return;
  }

  selectedBlock.material.emissive.setHex(0xffa34d);
  selectedBlock.material.emissiveIntensity = 0.32;
  selectedBlock.userData.selected = true;
  selectionStatus.textContent = selectionLabel(selectedBlock);
}

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function pickBlock(event) {
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const [hit] = raycaster.intersectObjects(blocks, false);
  return hit?.object ?? null;
}

function screenDragDirection(block, axis) {
  const rect = renderer.domElement.getBoundingClientRect();
  const origin = block.position.clone().project(camera);
  const axisPoint = block.position.clone().add(axis).project(camera);
  const dx = (axisPoint.x - origin.x) * rect.width * 0.5;
  const dy = -(axisPoint.y - origin.y) * rect.height * 0.5;
  const length = Math.hypot(dx, dy);
  if (length < 0.001) return { x: 1, y: 0 };
  return { x: dx / length, y: dy / length };
}

function finishDrag(pointerId) {
  if (!dragState || dragState.pointerId !== pointerId) return;
  dragState.body.resetForces(true);
  dragState = null;
  sceneHost.classList.remove("is-dragging");
  selectionStatus.textContent = selectionLabel(selectedBlock);
  if (renderer.domElement.hasPointerCapture(pointerId)) {
    renderer.domElement.releasePointerCapture(pointerId);
  }
}

renderer.domElement.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;

  const block = pickBlock(event);
  pointerDown = { x: event.clientX, y: event.clientY, block };

  if (!block) return;

  setSelectedBlock(block);
  const translation = block.userData.body.translation();
  dragState = {
    pointerId: event.pointerId,
    block,
    body: block.userData.body,
    axis: block.userData.dragAxis.clone(),
    screenAxis: screenDragDirection(block, block.userData.dragAxis),
    startClientX: event.clientX,
    startClientY: event.clientY,
    startPosition: new THREE.Vector3(translation.x, translation.y, translation.z),
    targetOffset: 0,
    moved: false,
  };
  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;

  const deltaX = event.clientX - dragState.startClientX;
  const deltaY = event.clientY - dragState.startClientY;
  const projectedPixels = deltaX * dragState.screenAxis.x + deltaY * dragState.screenAxis.y;
  dragState.targetOffset = THREE.MathUtils.clamp(
    projectedPixels * DRAG_DISTANCE_PER_PIXEL,
    -3.4,
    3.4,
  );
  dragState.moved = dragState.moved || Math.abs(projectedPixels) > 4;

  if (dragState.moved) {
    sceneHost.classList.add("is-dragging");
    selectionStatus.textContent = selectionLabel(dragState.block, " · 밀기/당기기 중");
  }
});

renderer.domElement.addEventListener("pointerup", (event) => {
  if (event.button !== 0 || !pointerDown) return;

  const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  const pressedBlock = pointerDown.block;
  pointerDown = null;

  if (dragState?.pointerId === event.pointerId) {
    const dragged = dragState.moved;
    finishDrag(event.pointerId);
    if (dragged) return;
  }

  if (moved <= 6) {
    setSelectedBlock(pressedBlock ?? pickBlock(event));
  }
});

renderer.domElement.addEventListener("pointercancel", (event) => {
  pointerDown = null;
  finishDrag(event.pointerId);
});

function applyDragForce() {
  if (!dragState) return;

  const position = dragState.body.translation();
  const velocity = dragState.body.linvel();
  const current = new THREE.Vector3(position.x, position.y, position.z);
  const target = dragState.startPosition.clone().addScaledVector(dragState.axis, dragState.targetOffset);
  const error = target.sub(current).dot(dragState.axis);
  const velocityAlongAxis = velocity.x * dragState.axis.x
    + velocity.y * dragState.axis.y
    + velocity.z * dragState.axis.z;
  const magnitude = THREE.MathUtils.clamp(
    error * DRAG_SPRING - velocityAlongAxis * DRAG_DAMPING,
    -MAX_DRAG_FORCE,
    MAX_DRAG_FORCE,
  );

  dragState.body.resetForces(true);
  dragState.body.addForce({
    x: dragState.axis.x * magnitude,
    y: 0,
    z: dragState.axis.z * magnitude,
  }, true);
}

function syncBlocksFromPhysics() {
  blocks.forEach((block) => {
    const position = block.userData.body.translation();
    const rotation = block.userData.body.rotation();
    block.position.set(position.x, position.y, position.z);
    block.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  });
}

function resize() {
  const width = Math.max(sceneHost.clientWidth, 1);
  const height = Math.max(sceneHost.clientHeight, 1);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(sceneHost);
resize();

loading?.classList.add("is-hidden");

let previousTime = performance.now();
let accumulator = 0;

function animate(now) {
  const elapsed = Math.min((now - previousTime) / 1000, 0.05);
  previousTime = now;
  accumulator += elapsed;

  while (accumulator >= PHYSICS_STEP) {
    applyDragForce();
    world.step();
    accumulator -= PHYSICS_STEP;
  }

  syncBlocksFromPhysics();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
