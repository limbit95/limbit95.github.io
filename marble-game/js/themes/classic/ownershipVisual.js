import * as THREE from "three";
import {
  CLASSIC_CAMERA_PROFILE,
  createOrthographicBounds,
  createSquareRingLayout,
} from "../../renderer/threeClassicPrototype.js";

export const CLASSIC_OWNERSHIP_VISUAL_PROFILE = Object.freeze({
  style: "outer-corner-flag-and-edge-trim",
  ownerColors: Object.freeze([0x61b8ff, 0xff8c9f, 0xffd55a, 0x8bd48a]),
  flagHeight: 0.94,
  railDepth: 0.09,
});

function ownerSeatFromTile(tile) {
  const rawSeat = tile?.dataset?.ownerSeat;
  if (rawSeat === undefined || rawSeat === null || rawSeat === "") return null;
  const seat = Number(rawSeat);
  return Number.isInteger(seat)
    && seat >= 0
    && seat < CLASSIC_OWNERSHIP_VISUAL_PROFILE.ownerColors.length
    ? seat
    : null;
}

function ownerColor(seat) {
  return CLASSIC_OWNERSHIP_VISUAL_PROFILE.ownerColors[seat];
}

function createFlagTexture(THREE_NS, seat) {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 192;
  const context = canvas.getContext("2d");
  const color = new THREE_NS.Color(ownerColor(seat));

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, `#${color.clone().lerp(new THREE_NS.Color(0xffffff), 0.2).getHexString()}`);
  gradient.addColorStop(1, `#${color.clone().lerp(new THREE_NS.Color(0x20384d), 0.12).getHexString()}`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(255, 244, 196, 0.95)";
  context.lineWidth = 14;
  context.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);

  context.beginPath();
  context.arc(76, 96, 40, 0, Math.PI * 2);
  context.fillStyle = "rgba(255, 239, 177, 0.96)";
  context.fill();
  context.strokeStyle = "rgba(115, 81, 28, 0.42)";
  context.lineWidth = 6;
  context.stroke();

  context.fillStyle = "#24384c";
  context.font = "900 46px system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(String(seat + 1), 76, 97);

  context.fillStyle = "rgba(255,255,255,0.96)";
  context.font = "900 52px system-ui, sans-serif";
  context.textAlign = "left";
  context.fillText(`P${seat + 1}`, 138, 99);

  const texture = new THREE_NS.CanvasTexture(canvas);
  texture.colorSpace = THREE_NS.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function material(THREE_NS, color, options = {}) {
  return new THREE_NS.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.58,
    metalness: options.metalness ?? 0.06,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    side: options.side,
    map: options.map,
  });
}

function createClassicOwnershipMarker(entry, seat) {
  const group = new THREE.Group();
  const color = ownerColor(seat);
  const gold = 0xf6d36b;
  const dark = 0x31495f;
  const railWidth = Math.max(0.78, entry.tileLength * 0.7);
  const sideSign = seat % 2 === 0 ? 1 : -1;
  const flagX = sideSign * Math.min(entry.tileLength * 0.43, 0.9);
  const outerEdgeZ = entry.tileDepth * 0.47;
  const flagZ = entry.tileDepth * 0.43;

  const rail = new THREE.Mesh(
    new THREE.BoxGeometry(railWidth, 0.055, CLASSIC_OWNERSHIP_VISUAL_PROFILE.railDepth),
    material(THREE, color, { roughness: 0.46 }),
  );
  rail.position.set(0, 0.41, outerEdgeZ);
  rail.castShadow = false;
  rail.receiveShadow = true;
  group.add(rail);

  const railCap = new THREE.Mesh(
    new THREE.BoxGeometry(railWidth * 0.86, 0.028, 0.035),
    material(THREE, gold, { roughness: 0.4, metalness: 0.2 }),
  );
  railCap.position.set(0, 0.445, outerEdgeZ);
  group.add(railCap);

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.038, 0.048, CLASSIC_OWNERSHIP_VISUAL_PROFILE.flagHeight, 10),
    material(THREE, dark, { roughness: 0.42, metalness: 0.12 }),
  );
  pole.position.set(flagX, 0.9, flagZ);
  pole.castShadow = true;
  group.add(pole);

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.145, 0.1, 12),
    material(THREE, gold, { roughness: 0.38, metalness: 0.22 }),
  );
  pedestal.position.set(flagX, 0.46, flagZ);
  pedestal.castShadow = true;
  group.add(pedestal);

  const finial = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 12, 8),
    material(THREE, gold, { roughness: 0.32, metalness: 0.25 }),
  );
  finial.position.set(flagX, 1.4, flagZ);
  finial.castShadow = true;
  group.add(finial);

  const flagTexture = createFlagTexture(THREE, seat);
  const flagPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.32, 0.045),
    material(THREE, 0xffffff, {
      roughness: 0.52,
      map: flagTexture,
    }),
  );
  flagPanel.position.set(flagX - (sideSign * 0.25), 1.2, flagZ);
  flagPanel.castShadow = true;
  flagPanel.userData.phase = seat * 0.8;
  group.add(flagPanel);

  group.position.set(entry.x, entry.y, entry.z);
  group.rotation.y = entry.rotationY;
  group.userData.flagPanel = flagPanel;
  return group;
}

function disposeObject(object) {
  object?.traverse?.((child) => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) {
      child.material.forEach((entry) => {
        entry.map?.dispose?.();
        entry.dispose?.();
      });
    } else {
      child.material?.map?.dispose?.();
      child.material?.dispose?.();
    }
  });
}

export function createClassicOwnershipVisual({ stageElement, stateBoardElement } = {}) {
  if (!stageElement || !stateBoardElement) return null;

  let renderer = null;
  let scene = null;
  let camera = null;
  let markerRoot = null;
  let renderFrame = null;
  let animationFrame = null;
  let disposed = false;
  let resizeObserver = null;
  let markerPanels = [];

  function ensureCanvas() {
    if (disposed || !renderer?.domElement || renderer.domElement.parentElement === stageElement) return;
    stageElement.append(renderer.domElement);
  }

  function resize() {
    if (!renderer || !camera) return;
    const width = Math.max(1, stageElement.clientWidth);
    const height = Math.max(1, stageElement.clientHeight);
    const bounds = createOrthographicBounds(width, height);
    camera.left = bounds.left;
    camera.right = bounds.right;
    camera.top = bounds.top;
    camera.bottom = bounds.bottom;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderScene();
  }

  function clearMarkers() {
    if (!markerRoot) return;
    while (markerRoot.children.length) {
      const child = markerRoot.children[markerRoot.children.length - 1];
      markerRoot.remove(child);
      disposeObject(child);
    }
    markerPanels = [];
  }

  function rebuildMarkers() {
    renderFrame = null;
    if (disposed || !markerRoot) return;
    ensureCanvas();
    clearMarkers();

    const tiles = [...stateBoardElement.querySelectorAll(".board-tile")];
    if (!tiles.length) {
      renderScene();
      return;
    }

    const layout = createSquareRingLayout(tiles.map((_, index) => ({ id: `classic-owner-${index}` })));
    tiles.forEach((tile, index) => {
      const seat = ownerSeatFromTile(tile);
      const entry = layout[index];
      if (seat === null || !entry) return;
      const marker = createClassicOwnershipMarker(entry, seat);
      markerRoot.add(marker);
      if (marker.userData.flagPanel) markerPanels.push(marker.userData.flagPanel);
    });

    renderScene();
  }

  function scheduleRebuild() {
    if (disposed || renderFrame !== null) return;
    renderFrame = requestAnimationFrame(rebuildMarkers);
  }

  function renderScene() {
    if (!renderer || !scene || !camera) return;
    renderer.render(scene, camera);
  }

  function animate(now = 0) {
    if (disposed) return;
    const time = now / 1000;
    markerPanels.forEach((panel) => {
      panel.rotation.z = Math.sin((time * 1.8) + panel.userData.phase) * 0.014;
    });
    renderScene();
    animationFrame = requestAnimationFrame(animate);
  }

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(...CLASSIC_CAMERA_PROFILE.position);
  camera.lookAt(...CLASSIC_CAMERA_PROFILE.target);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "classic-ownership-three-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");

  scene.add(new THREE.HemisphereLight(0xffffff, 0x7895ad, 2.35));
  const keyLight = new THREE.DirectionalLight(0xfff6df, 3.5);
  keyLight.position.set(10, 20, 14);
  keyLight.castShadow = true;
  scene.add(keyLight);

  markerRoot = new THREE.Group();
  scene.add(markerRoot);

  const boardObserver = new MutationObserver(scheduleRebuild);
  boardObserver.observe(stateBoardElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-owner-seat"],
  });

  const stageObserver = new MutationObserver(() => {
    ensureCanvas();
    resize();
    scheduleRebuild();
  });
  stageObserver.observe(stageElement, { childList: true });

  resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(stageElement);
  window.addEventListener("resize", resize);

  ensureCanvas();
  resize();
  scheduleRebuild();
  animationFrame = requestAnimationFrame(animate);

  return Object.freeze({
    render: scheduleRebuild,
    dispose() {
      disposed = true;
      if (renderFrame !== null) cancelAnimationFrame(renderFrame);
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      boardObserver.disconnect();
      stageObserver.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      clearMarkers();
      renderer?.dispose?.();
      renderer?.domElement?.remove();
      markerRoot = null;
      scene = null;
      camera = null;
      renderer = null;
    },
  });
}

const stageElement = document.querySelector("[data-three-stage]");
const stateBoardElement = document.querySelector("[data-classic-board]");
if (stageElement && stateBoardElement) {
  createClassicOwnershipVisual({ stageElement, stateBoardElement });
}
