import { createRendererContract } from "./rendererContract.js";

export const THREE_IMPORT_VERSION = "0.185.1";

const DEFAULT_HALF_EXTENT = 10.5;

function normalizeNodes(nodes) {
  if (!Array.isArray(nodes) || nodes.length < 4) {
    throw new TypeError("3D board layout requires at least four nodes.");
  }

  return nodes.map((node, index) => ({
    id: typeof node === "string" ? node : node?.id ?? `node-${index}`,
    index,
  }));
}

export function createSquareRingLayout(nodes, { halfExtent = DEFAULT_HALF_EXTENT, elevation = 0.72 } = {}) {
  const normalized = normalizeNodes(nodes);
  const count = normalized.length;
  const sideSpacing = (halfExtent * 8) / count;
  const tileLength = Math.max(1.5, Math.min(2.25, sideSpacing * 0.82));

  return normalized.map((node) => {
    const perimeterPosition = (node.index / count) * 4;
    let x;
    let z;
    let rotationY = 0;
    let side;

    if (perimeterPosition < 1) {
      const t = perimeterPosition;
      x = -halfExtent + (halfExtent * 2 * t);
      z = halfExtent;
      side = "south";
    } else if (perimeterPosition < 2) {
      const t = perimeterPosition - 1;
      x = halfExtent;
      z = halfExtent - (halfExtent * 2 * t);
      rotationY = Math.PI / 2;
      side = "east";
    } else if (perimeterPosition < 3) {
      const t = perimeterPosition - 2;
      x = halfExtent - (halfExtent * 2 * t);
      z = -halfExtent;
      side = "north";
    } else {
      const t = perimeterPosition - 3;
      x = -halfExtent;
      z = -halfExtent + (halfExtent * 2 * t);
      rotationY = Math.PI / 2;
      side = "west";
    }

    return Object.freeze({
      nodeId: node.id,
      index: node.index,
      x,
      y: elevation,
      z,
      rotationY,
      side,
      tileLength,
    });
  });
}

function tileColor(node) {
  if (node.type === "START") return 0x66d7aa;
  if (node.type === "EVENT") return 0x8d7dff;
  if (node.type === "TAX") return 0xf39a71;
  if (node.type === "BONUS") return 0xe8c75b;
  if (node.type === "REST") return 0x6eb6d8;
  return 0x31445e;
}

function createLabelTexture(THREE, node) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(7, 12, 20, 0.88)";
  context.beginPath();
  context.roundRect(12, 12, 488, 136, 28);
  context.fill();
  context.strokeStyle = "rgba(255, 255, 255, 0.22)";
  context.lineWidth = 4;
  context.stroke();
  context.fillStyle = "#f7f8fb";
  context.font = '700 42px system-ui, "Noto Sans KR", sans-serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  const label = String(node.label ?? node.id);
  const display = label.length > 12 ? `${label.slice(0, 11)}…` : label;
  context.fillText(display, 256, 80, 450);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function disposeObject(object) {
  object.traverse?.((child) => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => {
        material.map?.dispose?.();
        material.dispose?.();
      });
    } else {
      child.material?.map?.dispose?.();
      child.material?.dispose?.();
    }
  });
}

function tokenOffset(seat) {
  const offsets = [
    [-0.38, -0.24],
    [0.38, 0.24],
    [-0.38, 0.32],
    [0.38, -0.32],
  ];
  return offsets[seat % offsets.length];
}

export function createClassicThreePrototypeRenderer({
  onTileSelect = () => {},
  reducedMotion = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
} = {}) {
  let THREE = null;
  let OrbitControls = null;
  let target = null;
  let scene = null;
  let camera = null;
  let webglRenderer = null;
  let controls = null;
  let boardRoot = null;
  let layoutByNode = new Map();
  let tileMeshes = new Map();
  let tokenMeshes = new Map();
  let buildingRoots = new Map();
  let selectedTile = null;
  let resizeObserver = null;
  let animationFrameId = null;
  let boardSignature = "";
  let disposed = false;
  let pointerStart = null;

  function resize() {
    if (!target || !camera || !webglRenderer) return;
    const width = Math.max(1, target.clientWidth);
    const height = Math.max(1, target.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    webglRenderer.setSize(width, height, false);
  }

  function animate() {
    if (disposed || !webglRenderer || !scene || !camera) return;
    controls?.update();
    webglRenderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  }

  function clearBoard() {
    if (!boardRoot) return;
    scene.remove(boardRoot);
    disposeObject(boardRoot);
    boardRoot = null;
    layoutByNode = new Map();
    tileMeshes = new Map();
    tokenMeshes = new Map();
    buildingRoots = new Map();
    boardSignature = "";
  }

  function createToken(player) {
    const group = new THREE.Group();
    const primaryColor = player.seat === 0 ? 0x61b8ff : player.seat === 1 ? 0xff8c8c : 0xd9c36b;
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.4, 0.68, 18),
      new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.34, metalness: 0.3 }),
    );
    body.position.y = 0.34;
    body.castShadow = true;
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.27, 18, 12),
      new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.28, metalness: 0.2 }),
    );
    head.position.y = 0.92;
    head.castShadow = true;
    group.add(body, head);
    group.userData.playerId = player.id;
    group.userData.seat = player.seat;
    return group;
  }

  function setTokenPosition(mesh, nodeId, seat) {
    const layout = layoutByNode.get(nodeId);
    if (!layout || !mesh) return;
    const [offsetX, offsetZ] = tokenOffset(seat);
    mesh.position.set(layout.x + offsetX, layout.y + 0.58, layout.z + offsetZ);
  }

  function rebuildBuildings(state) {
    for (const root of buildingRoots.values()) {
      while (root.children.length) {
        const child = root.children.pop();
        child.geometry?.dispose?.();
        child.material?.dispose?.();
      }
    }

    for (const [nodeId, propertyState] of Object.entries(state.boardState?.properties ?? {})) {
      const level = Number(propertyState.buildingLevel) || 0;
      if (level <= 0) continue;
      const root = buildingRoots.get(nodeId);
      if (!root) continue;
      const owner = state.players.find((player) => player.id === propertyState.ownerId);
      const color = owner?.seat === 0 ? 0x61b8ff : owner?.seat === 1 ? 0xff8c8c : 0xcbd5e1;
      for (let index = 0; index < level; index += 1) {
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 0.34 + index * 0.08, 0.32),
          new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.08 }),
        );
        building.position.set((index - (level - 1) / 2) * 0.38, 0.35, 0);
        building.castShadow = true;
        root.add(building);
      }
    }
  }

  function updateOwnership(state) {
    for (const node of state.board.nodes) {
      const mesh = tileMeshes.get(node.id);
      if (!mesh) continue;
      const propertyState = state.boardState?.properties?.[node.id];
      const owner = propertyState?.ownerId
        ? state.players.find((player) => player.id === propertyState.ownerId)
        : null;
      mesh.material.emissive.setHex(owner?.seat === 0 ? 0x164d73 : owner?.seat === 1 ? 0x6e2828 : 0x000000);
      mesh.material.emissiveIntensity = owner ? 0.48 : 0;
    }
    rebuildBuildings(state);
  }

  function buildBoard(state) {
    clearBoard();
    boardSignature = state.board.nodes.map((node) => node.id).join("|");
    boardRoot = new THREE.Group();
    scene.add(boardRoot);

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(24.8, 0.6, 24.8),
      new THREE.MeshStandardMaterial({ color: 0x111a28, roughness: 0.78, metalness: 0.08 }),
    );
    base.position.y = 0;
    base.receiveShadow = true;
    boardRoot.add(base);

    const inset = new THREE.Mesh(
      new THREE.BoxGeometry(18.3, 0.18, 18.3),
      new THREE.MeshStandardMaterial({ color: 0x16273a, roughness: 0.86, metalness: 0.04 }),
    );
    inset.position.y = 0.39;
    inset.receiveShadow = true;
    boardRoot.add(inset);

    const grid = new THREE.GridHelper(17, 10, 0x4f7396, 0x27384c);
    grid.position.y = 0.5;
    boardRoot.add(grid);

    const layout = createSquareRingLayout(state.board.nodes);
    layoutByNode = new Map(layout.map((entry) => [entry.nodeId, entry]));

    for (const node of state.board.nodes) {
      const entry = layoutByNode.get(node.id);
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(entry.tileLength, 0.42, 1.42),
        new THREE.MeshStandardMaterial({
          color: tileColor(node),
          roughness: 0.5,
          metalness: 0.12,
          emissive: 0x000000,
        }),
      );
      tile.position.set(entry.x, entry.y, entry.z);
      tile.rotation.y = entry.rotationY;
      tile.castShadow = true;
      tile.receiveShadow = true;
      tile.userData.nodeId = node.id;
      tile.userData.baseScaleY = tile.scale.y;
      boardRoot.add(tile);
      tileMeshes.set(node.id, tile);

      const labelTexture = createLabelTexture(THREE, node);
      const label = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: labelTexture, transparent: true, depthTest: false }),
      );
      label.scale.set(Math.min(2.7, entry.tileLength * 1.25), 0.84, 1);
      label.position.set(entry.x, entry.y + 1.2, entry.z);
      label.renderOrder = 5;
      boardRoot.add(label);

      const buildingRoot = new THREE.Group();
      buildingRoot.position.set(entry.x, entry.y + 0.38, entry.z);
      buildingRoot.rotation.y = entry.rotationY;
      boardRoot.add(buildingRoot);
      buildingRoots.set(node.id, buildingRoot);
    }

    const centerRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.5, 0.08, 12, 80),
      new THREE.MeshStandardMaterial({ color: 0x79d1b0, emissive: 0x163a30, emissiveIntensity: 0.6 }),
    );
    centerRing.rotation.x = Math.PI / 2;
    centerRing.position.y = 0.55;
    boardRoot.add(centerRing);

    updateOwnership(state);
  }

  function ensureTokens(state) {
    for (const player of state.players) {
      let token = tokenMeshes.get(player.id);
      if (!token) {
        token = createToken(player);
        tokenMeshes.set(player.id, token);
        boardRoot.add(token);
      }
      token.visible = !player.bankrupt;
      if (!player.bankrupt) setTokenPosition(token, player.positionNodeId, player.seat);
    }
  }

  function selectTile(mesh) {
    if (selectedTile && selectedTile !== mesh) {
      selectedTile.scale.y = selectedTile.userData.baseScaleY ?? 1;
    }
    selectedTile = mesh;
    if (selectedTile) {
      selectedTile.scale.y = 1.42;
      onTileSelect(selectedTile.userData.nodeId);
    }
  }

  function handlePointerDown(event) {
    pointerStart = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event) {
    if (!pointerStart || !webglRenderer || !camera) return;
    const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    pointerStart = null;
    if (distance > 8) return;

    const rect = webglRenderer.domElement.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects([...tileMeshes.values()], false);
    if (hits[0]?.object) selectTile(hits[0].object);
  }

  async function tweenToken(token, destination, duration) {
    if (reducedMotion || duration <= 0) {
      token.position.copy(destination);
      return;
    }
    const origin = token.position.clone();
    const startedAt = performance.now();
    await new Promise((resolve) => {
      function step(now) {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - ((1 - progress) ** 3);
        token.position.lerpVectors(origin, destination, eased);
        token.position.y += Math.sin(progress * Math.PI) * 0.22;
        if (progress >= 1) resolve();
        else requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  const renderer = {
    async mount(targetElement) {
      if (!targetElement || typeof targetElement.append !== "function") {
        throw new TypeError("3D renderer mount target is required.");
      }

      target = targetElement;
      disposed = false;
      THREE = await import("three");
      ({ OrbitControls } = await import("three/addons/controls/OrbitControls.js"));

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x07101a);
      scene.fog = new THREE.Fog(0x07101a, 30, 55);

      camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(18, 20, 22);
      camera.lookAt(0, 0, 0);

      webglRenderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      webglRenderer.shadowMap.enabled = true;
      webglRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
      webglRenderer.outputColorSpace = THREE.SRGBColorSpace;
      webglRenderer.domElement.className = "classic-three-canvas";
      target.replaceChildren(webglRenderer.domElement);

      const hemisphere = new THREE.HemisphereLight(0xb7d9ff, 0x182131, 2.2);
      scene.add(hemisphere);
      const key = new THREE.DirectionalLight(0xffffff, 3.4);
      key.position.set(9, 18, 12);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      scene.add(key);

      controls = new OrbitControls(camera, webglRenderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 18;
      controls.maxDistance = 46;
      controls.maxPolarAngle = Math.PI * 0.48;
      controls.target.set(0, 0.3, 0);
      controls.update();

      webglRenderer.domElement.addEventListener("pointerdown", handlePointerDown);
      webglRenderer.domElement.addEventListener("pointerup", handlePointerUp);
      resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
      resizeObserver?.observe(target);
      window.addEventListener("resize", resize);
      resize();
      animate();
    },

    renderState(state) {
      if (!scene || !state?.board?.nodes) return;
      const nextSignature = state.board.nodes.map((node) => node.id).join("|");
      if (!boardRoot || nextSignature !== boardSignature) buildBoard(state);
      updateOwnership(state);
      ensureTokens(state);
    },

    async playEvent(event) {
      if (!scene || event?.type !== "PLAYER_MOVED") return;
      const token = tokenMeshes.get(event.playerId);
      if (!token || !Array.isArray(event.path)) return;
      const playerSeat = Number(token.userData.seat) || 0;
      for (const nodeId of event.path) {
        const layout = layoutByNode.get(nodeId);
        if (!layout) continue;
        const [offsetX, offsetZ] = tokenOffset(playerSeat);
        const destination = new THREE.Vector3(
          layout.x + offsetX,
          layout.y + 0.58,
          layout.z + offsetZ,
        );
        await tweenToken(token, destination, reducedMotion ? 0 : 155);
      }
    },

    dispose() {
      disposed = true;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      if (webglRenderer?.domElement) {
        webglRenderer.domElement.removeEventListener("pointerdown", handlePointerDown);
        webglRenderer.domElement.removeEventListener("pointerup", handlePointerUp);
      }
      controls?.dispose?.();
      clearBoard();
      webglRenderer?.dispose?.();
      target?.replaceChildren();
      target = null;
      scene = null;
      camera = null;
      webglRenderer = null;
      controls = null;
    },
  };

  return createRendererContract(renderer);
}
