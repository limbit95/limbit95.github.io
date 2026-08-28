import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const sceneHost = document.querySelector("#scene");
const loading = document.querySelector("#loading");
const selectionStatus = document.querySelector("#selection-status");

if (!sceneHost) throw new Error("3D scene container was not found.");

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

    block.castShadow = true;
    block.receiveShadow = true;
    block.userData = { index, level: level + 1, slot: slot + 1, selected: false };
    scene.add(block);
    blocks.push(block);
  }
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let selectedBlock = null;
let pointerDown = null;

function setSelectedBlock(block) {
  if (selectedBlock) {
    selectedBlock.material.emissive.setHex(0x000000);
    selectedBlock.material.emissiveIntensity = 0;
    selectedBlock.scale.setScalar(1);
    selectedBlock.userData.selected = false;
  }

  selectedBlock = block;

  if (!selectedBlock) {
    selectionStatus.textContent = "선택된 블록 없음";
    return;
  }

  selectedBlock.material.emissive.setHex(0xffa34d);
  selectedBlock.material.emissiveIntensity = 0.24;
  selectedBlock.scale.setScalar(1.025);
  selectedBlock.userData.selected = true;
  selectionStatus.textContent = `${selectedBlock.userData.level}층 · ${selectedBlock.userData.slot}번 블록`;
}

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

renderer.domElement.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  pointerDown = { x: event.clientX, y: event.clientY };
});

renderer.domElement.addEventListener("pointerup", (event) => {
  if (event.button !== 0 || !pointerDown) return;
  const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  pointerDown = null;
  if (moved > 6) return;

  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const [hit] = raycaster.intersectObjects(blocks, false);
  setSelectedBlock(hit?.object ?? null);
});

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

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
