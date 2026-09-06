import { createRendererContract } from "./rendererContract.js";

export const THREE_IMPORT_VERSION = "0.185.1";
export const CLASSIC_CAMERA_PROFILE = Object.freeze({
  projection: "orthographic",
  interaction: "fixed",
  view: "quarter",
  baseViewSize: 36,
  position: Object.freeze([18, 24, 22]),
  target: Object.freeze([0, 1.25, 0]),
});

export const CLASSIC_VISUAL_PROFILE = Object.freeze({
  style: "bright-toy-city",
  boardMinimumTiles: 30,
  tileDepth: 3.2,
  labelScale: Object.freeze([3.15, 1.22]),
  centerInsetSize: 15.4,
  palette: Object.freeze({
    sky: 0xbfe9ff,
    fog: 0xd8f3ff,
    boardBase: 0xf8fbff,
    boardEdge: 0x8fc9ed,
    innerWater: 0x78d6f7,
    plaza: 0xfff3c9,
    road: 0xffffff,
    grass: 0x8cdb83,
    neutralBuilding: 0xb9c8d8,
    gold: 0xffcf4d,
    ink: 0x18304a,
  }),
  regions: Object.freeze([
    Object.freeze({ id: "east", color: 0xff8d8d, accent: 0xffd55a }),
    Object.freeze({ id: "europe", color: 0x8fd3ff, accent: 0xa98cff }),
    Object.freeze({ id: "america", color: 0x7edca2, accent: 0xff92ca }),
    Object.freeze({ id: "world", color: 0xffb969, accent: 0x65c8e8 }),
  ]),
});

const DEFAULT_HALF_EXTENT = 9.6;
const OWNER_COLORS = Object.freeze([0x53b6ff, 0xff7f9b, 0xffd55a, 0x8bd48a]);

const LANDMARK_ARCHETYPES = Object.freeze({
  tokyo: "pagoda",
  singapore: "tower",
  sydney: "sails",
  cairo: "pyramid",
  athens: "columns",
  rome: "dome",
  paris: "needle",
  london: "clock",
  "new-york": "skyline",
  "mexico-city": "pyramid",
  rio: "arch",
  vancouver: "pine",
  honolulu: "palm",
  "san-francisco": "bridge",
  "los-angeles": "palm",
  "las-vegas": "hotel",
  chicago: "skyline",
  toronto: "needle",
  reykjavik: "lighthouse",
  berlin: "gate",
  dubai: "spire",
  bangkok: "temple",
  busan: "tower",
  jeju: "island",
});

function normalizeNodes(nodes) {
  if (!Array.isArray(nodes) || nodes.length < 4) {
    throw new TypeError("3D board layout requires at least four nodes.");
  }

  return nodes.map((node, index) => ({
    id: typeof node === "string" ? node : node?.id ?? `node-${index}`,
    index,
  }));
}

export function createOrthographicBounds(width, height, baseViewSize = CLASSIC_CAMERA_PROFILE.baseViewSize) {
  const safeWidth = Math.max(1, Number(width) || 1);
  const safeHeight = Math.max(1, Number(height) || 1);
  const aspect = safeWidth / safeHeight;
  const verticalSize = aspect >= 1 ? baseViewSize : baseViewSize / aspect;
  const horizontalSize = verticalSize * aspect;

  return Object.freeze({
    left: -horizontalSize / 2,
    right: horizontalSize / 2,
    top: verticalSize / 2,
    bottom: -verticalSize / 2,
  });
}

export function createSquareRingLayout(nodes, { halfExtent = DEFAULT_HALF_EXTENT, elevation = 0.78 } = {}) {
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

function specialVisual(node) {
  const special = {
    START: { color: 0x67d8a5, accent: 0xffffff, landmark: "start" },
    EVENT: { color: 0x9b8cff, accent: 0xffd9ff, landmark: "balloon" },
    TAX: { color: 0xff8f70, accent: 0xffd56a, landmark: "airport" },
    BONUS: { color: 0xffcf55, accent: 0xff7ca8, landmark: "gift" },
    REST: { color: 0x6fcce9, accent: 0xfff2a1, landmark: "umbrella" },
  };
  return special[node.type] ?? null;
}

export function getClassicTileVisual(node, index = 0) {
  const special = specialVisual(node);
  if (special) {
    return Object.freeze({
      region: "special",
      color: special.color,
      accent: special.accent,
      landmark: special.landmark,
    });
  }

  const regionIndex = Math.min(
    CLASSIC_VISUAL_PROFILE.regions.length - 1,
    Math.floor((Math.max(0, Number(index) || 0) % 32) / 8),
  );
  const region = CLASSIC_VISUAL_PROFILE.regions[regionIndex];

  return Object.freeze({
    region: region.id,
    color: region.color,
    accent: region.accent,
    landmark: LANDMARK_ARCHETYPES[node.id] ?? "city",
  });
}

function createLabelTexture(THREE, node, visual) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 272;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.shadowColor = "rgba(20, 52, 82, 0.18)";
  context.shadowBlur = 18;
  context.shadowOffsetY = 8;
  context.fillStyle = "rgba(255, 255, 255, 0.97)";
  context.beginPath();
  context.roundRect(14, 14, 740, 244, 38);
  context.fill();

  context.shadowColor = "transparent";
  context.fillStyle = `#${visual.color.toString(16).padStart(6, "0")}`;
  context.beginPath();
  context.roundRect(34, 32, 700, 32, 16);
  context.fill();

  context.fillStyle = "#17324d";
  context.font = '900 68px system-ui, "Noto Sans KR", sans-serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  const label = String(node.label ?? node.id);
  const display = label.length > 12 ? `${label.slice(0, 11)}…` : label;
  context.fillText(display, 384, 142, 680);

  if (node.type === "PROPERTY" && Number.isFinite(node.price)) {
    context.fillStyle = "#536a80";
    context.font = '800 38px system-ui, "Noto Sans KR", sans-serif';
    context.fillText(`M ${node.price}`, 384, 210, 620);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function disposeObject(object) {
  object?.traverse?.((child) => {
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

function clearGroup(group) {
  if (!group) return;
  while (group.children.length) {
    const child = group.children[group.children.length - 1];
    group.remove(child);
    disposeObject(child);
  }
}

function tokenOffset(seat) {
  const offsets = [
    [-0.4, -0.25],
    [0.4, 0.25],
    [-0.4, 0.34],
    [0.4, -0.34],
  ];
  return offsets[seat % offsets.length];
}

function ownerColor(seat) {
  return OWNER_COLORS[Math.abs(Number(seat) || 0) % OWNER_COLORS.length];
}

export function createClassicThreePrototypeRenderer({
  onTileSelect = () => {},
  reducedMotion = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
} = {}) {
  let THREE = null;
  let target = null;
  let scene = null;
  let camera = null;
  let webglRenderer = null;
  let boardRoot = null;
  let layoutByNode = new Map();
  let tileMeshes = new Map();
  let tokenMeshes = new Map();
  let buildingRoots = new Map();
  let selectedTileRoot = null;
  let resizeObserver = null;
  let animationFrameId = null;
  let boardSignature = "";
  let disposed = false;
  let activePlayerId = null;
  let centerGlobe = null;
  const ambientDecorations = [];

  function toon(color) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.72,
      metalness: 0.03,
    });
  }

  function mesh(geometry, color, {
    x = 0,
    y = 0,
    z = 0,
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0,
    castShadow = true,
    receiveShadow = true,
  } = {}) {
    const part = new THREE.Mesh(geometry, toon(color));
    part.position.set(x, y, z);
    part.rotation.set(rotationX, rotationY, rotationZ);
    part.castShadow = castShadow;
    part.receiveShadow = receiveShadow;
    return part;
  }

  function visualMix(colorA, colorB, amount) {
    const a = new THREE.Color(colorA);
    a.lerp(new THREE.Color(colorB), amount);
    return a.getHex();
  }

  function resize() {
    if (!target || !camera || !webglRenderer) return;
    const width = Math.max(1, target.clientWidth);
    const height = Math.max(1, target.clientHeight);
    const bounds = createOrthographicBounds(width, height);
    camera.left = bounds.left;
    camera.right = bounds.right;
    camera.top = bounds.top;
    camera.bottom = bounds.bottom;
    camera.updateProjectionMatrix();
    webglRenderer.setSize(width, height, false);
  }

  function animate(now = 0) {
    if (disposed || !webglRenderer || !scene || !camera) return;
    const time = now / 1000;

    if (centerGlobe) centerGlobe.rotation.y = time * 0.22;
    ambientDecorations.forEach((decoration, index) => {
      decoration.position.y = decoration.userData.baseY + Math.sin(time * 0.55 + index) * 0.12;
    });

    for (const [playerId, token] of tokenMeshes.entries()) {
      const halo = token.userData.halo;
      if (!halo) continue;
      const active = playerId === activePlayerId;
      halo.visible = active;
      if (active) {
        const pulse = 1 + Math.sin(time * 3.2) * 0.12;
        halo.scale.setScalar(pulse);
      }
    }

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
    selectedTileRoot = null;
    boardSignature = "";
    centerGlobe = null;
    ambientDecorations.length = 0;
  }

  function createToken(player) {
    const group = new THREE.Group();
    const primary = ownerColor(player.seat);
    const skin = 0xffdfc7;
    const ink = CLASSIC_VISUAL_PROFILE.palette.ink;

    const halo = mesh(
      new THREE.TorusGeometry(0.48, 0.075, 8, 28),
      CLASSIC_VISUAL_PROFILE.palette.gold,
      { y: 0.07, rotationX: Math.PI / 2, castShadow: false, receiveShadow: false },
    );
    halo.visible = false;
    group.add(halo);

    const leftFoot = mesh(new THREE.SphereGeometry(0.18, 14, 10), ink, { x: -0.18, y: 0.18, z: 0.03 });
    leftFoot.scale.set(1.15, 0.65, 1.35);
    const rightFoot = mesh(new THREE.SphereGeometry(0.18, 14, 10), ink, { x: 0.18, y: 0.18, z: 0.03 });
    rightFoot.scale.set(1.15, 0.65, 1.35);

    const body = mesh(new THREE.SphereGeometry(0.43, 20, 14), primary, { y: 0.64 });
    body.scale.set(0.9, 1.08, 0.78);

    const backpack = mesh(new THREE.BoxGeometry(0.5, 0.52, 0.2), visualMix(primary, 0xffffff, 0.18), {
      y: 0.68,
      z: 0.36,
    });

    const head = mesh(new THREE.SphereGeometry(0.39, 22, 16), skin, { y: 1.28 });
    const hair = mesh(new THREE.SphereGeometry(0.405, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), ink, { y: 1.42 });
    hair.scale.y = 0.72;

    const visor = mesh(new THREE.BoxGeometry(0.58, 0.11, 0.09), primary, {
      y: 1.28,
      z: -0.36,
      castShadow: false,
      receiveShadow: false,
    });

    const eyeLeft = mesh(new THREE.SphereGeometry(0.035, 8, 6), ink, {
      x: -0.12,
      y: 1.3,
      z: -0.38,
      castShadow: false,
      receiveShadow: false,
    });
    const eyeRight = mesh(new THREE.SphereGeometry(0.035, 8, 6), ink, {
      x: 0.12,
      y: 1.3,
      z: -0.38,
      castShadow: false,
      receiveShadow: false,
    });

    group.add(leftFoot, rightFoot, backpack, body, head, hair, visor, eyeLeft, eyeRight);
    group.userData.playerId = player.id;
    group.userData.seat = player.seat;
    group.userData.halo = halo;
    return group;
  }

  function addRoof(group, width, y, color) {
    const roof = mesh(new THREE.ConeGeometry(width, 0.28, 4), color, { y, rotationY: Math.PI / 4 });
    roof.scale.z = 0.78;
    group.add(roof);
  }

  function addTree(group, x, z, scale = 1) {
    const trunk = mesh(new THREE.CylinderGeometry(0.07 * scale, 0.09 * scale, 0.48 * scale, 8), 0xa86f45, {
      x,
      y: 0.24 * scale,
      z,
    });
    const crown = mesh(new THREE.SphereGeometry(0.26 * scale, 12, 9), 0x69c96b, {
      x,
      y: 0.62 * scale,
      z,
    });
    crown.scale.set(1, 1.15, 1);
    group.add(trunk, crown);
  }

  function createLandmark(archetype, visual) {
    const group = new THREE.Group();
    const primary = visual.color;
    const accent = visual.accent;
    const neutral = CLASSIC_VISUAL_PROFILE.palette.neutralBuilding;
    const ink = CLASSIC_VISUAL_PROFILE.palette.ink;

    switch (archetype) {
      case "pagoda":
        group.add(mesh(new THREE.BoxGeometry(0.62, 0.34, 0.5), 0xfff1dc, { y: 0.17 }));
        addRoof(group, 0.46, 0.47, 0xe35d65);
        group.add(mesh(new THREE.BoxGeometry(0.45, 0.32, 0.38), 0xfff1dc, { y: 0.65 }));
        addRoof(group, 0.38, 0.88, 0xe35d65);
        break;
      case "tower":
        group.add(mesh(new THREE.CylinderGeometry(0.15, 0.24, 1.1, 12), primary, { y: 0.55 }));
        group.add(mesh(new THREE.SphereGeometry(0.25, 14, 10), accent, { y: 1.05 }));
        group.add(mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.48, 8), ink, { y: 1.38 }));
        break;
      case "sails":
        group.add(mesh(new THREE.ConeGeometry(0.43, 0.95, 3), 0xffffff, { x: -0.22, y: 0.48, rotationZ: -0.15 }));
        group.add(mesh(new THREE.ConeGeometry(0.35, 0.78, 3), 0xe9f8ff, { x: 0.26, y: 0.39, rotationZ: 0.18 }));
        break;
      case "pyramid":
        group.add(mesh(new THREE.ConeGeometry(0.62, 0.95, 4), 0xf5c76d, { y: 0.47, rotationY: Math.PI / 4 }));
        break;
      case "columns":
        [-0.28, 0, 0.28].forEach((x) => group.add(
          mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.72, 10), 0xf8f0df, { x, y: 0.36 }),
        ));
        group.add(mesh(new THREE.BoxGeometry(0.82, 0.15, 0.34), 0xf8f0df, { y: 0.78 }));
        break;
      case "dome": {
        group.add(mesh(new THREE.CylinderGeometry(0.45, 0.48, 0.56, 16), 0xf7e5cc, { y: 0.28 }));
        const dome = mesh(new THREE.SphereGeometry(0.45, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), primary, { y: 0.56 });
        dome.scale.y = 0.7;
        group.add(dome);
        break;
      }
      case "needle":
      case "spire": {
        const tall = archetype === "spire";
        group.add(mesh(new THREE.CylinderGeometry(0.16, 0.28, tall ? 1.25 : 0.92, 12), neutral, { y: tall ? 0.63 : 0.46 }));
        group.add(mesh(new THREE.ConeGeometry(0.18, tall ? 0.9 : 0.68, 12), primary, { y: tall ? 1.7 : 1.18 }));
        break;
      }
      case "clock":
        group.add(mesh(new THREE.BoxGeometry(0.5, 1.2, 0.42), 0xd7b16f, { y: 0.6 }));
        group.add(mesh(new THREE.SphereGeometry(0.2, 14, 10), 0xf9f3d5, { y: 0.85, z: -0.23 }));
        addRoof(group, 0.36, 1.33, 0x7f5a48);
        break;
      case "bridge":
        [-0.4, 0.4].forEach((x) => group.add(
          mesh(new THREE.BoxGeometry(0.18, 0.92, 0.18), 0xe9695d, { x, y: 0.46 }),
        ));
        group.add(mesh(new THREE.BoxGeometry(1.05, 0.11, 0.18), 0xe9695d, { y: 0.62 }));
        group.add(mesh(new THREE.BoxGeometry(1.18, 0.08, 0.28), 0x63788b, { y: 0.22 }));
        break;
      case "palm":
        group.add(mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.82, 8), 0x9c6b43, { y: 0.41, rotationZ: -0.08 }));
        for (let index = 0; index < 5; index += 1) {
          const angle = index * (Math.PI * 2 / 5);
          const leaf = mesh(new THREE.SphereGeometry(0.25, 10, 7), 0x56c66c, { y: 0.9, rotationY: angle });
          leaf.scale.set(1.45, 0.32, 0.48);
          leaf.position.x = Math.cos(angle) * 0.2;
          leaf.position.z = Math.sin(angle) * 0.2;
          group.add(leaf);
        }
        break;
      case "lighthouse":
        group.add(mesh(new THREE.CylinderGeometry(0.16, 0.28, 0.95, 14), 0xf7f3ea, { y: 0.48 }));
        group.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.22, 14), 0xf06161, { y: 1.0 }));
        addRoof(group, 0.22, 1.23, 0x3a6482);
        break;
      case "gate":
        [-0.34, 0.34].forEach((x) => group.add(
          mesh(new THREE.BoxGeometry(0.2, 0.8, 0.24), 0xd9c3a0, { x, y: 0.4 }),
        ));
        group.add(mesh(new THREE.BoxGeometry(0.9, 0.22, 0.3), primary, { y: 0.83 }));
        break;
      case "temple":
        group.add(mesh(new THREE.BoxGeometry(0.76, 0.42, 0.52), 0xffe1a8, { y: 0.21 }));
        addRoof(group, 0.55, 0.55, 0x8d63c8);
        group.add(mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.42, 8), accent, { y: 0.92 }));
        break;
      case "hotel":
        group.add(mesh(new THREE.BoxGeometry(0.72, 0.98, 0.5), primary, { y: 0.49 }));
        group.add(mesh(new THREE.BoxGeometry(0.5, 0.18, 0.56), accent, { y: 1.03 }));
        break;
      case "island":
        group.add(mesh(new THREE.CylinderGeometry(0.62, 0.68, 0.18, 18), 0xf4d17b, { y: 0.09 }));
        addTree(group, 0.08, 0, 0.9);
        break;
      case "pine":
        group.add(mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.48, 8), 0x8d6444, { y: 0.24 }));
        group.add(mesh(new THREE.ConeGeometry(0.42, 0.9, 10), 0x4ead6b, { y: 0.75 }));
        break;
      case "arch":
        group.add(mesh(new THREE.BoxGeometry(0.18, 0.85, 0.22), 0xf2eee5, { x: -0.34, y: 0.43 }));
        group.add(mesh(new THREE.BoxGeometry(0.18, 0.85, 0.22), 0xf2eee5, { x: 0.34, y: 0.43 }));
        group.add(mesh(new THREE.BoxGeometry(0.82, 0.2, 0.25), primary, { y: 0.88 }));
        break;
      case "skyline":
      case "city":
      default:
        [
          [-0.34, 0.28, 0.32, 0.56],
          [0, 0.44, 0.3, 0.88],
          [0.34, 0.33, 0.28, 0.66],
        ].forEach(([x, y, width, height], index) => {
          group.add(mesh(
            new THREE.BoxGeometry(width, height, width),
            index === 1 ? primary : neutral,
            { x, y, z: index === 1 ? -0.04 : 0.05 },
          ));
        });
        break;
    }

    group.scale.setScalar(0.88);
    return group;
  }

  function createSpecialProp(archetype, visual) {
    const group = new THREE.Group();
    const primary = visual.color;
    const accent = visual.accent;

    switch (archetype) {
      case "start":
        [-0.34, 0.34].forEach((x) => group.add(
          mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.76, 10), 0xffffff, { x, y: 0.38 }),
        ));
        group.add(mesh(new THREE.BoxGeometry(0.85, 0.18, 0.18), primary, { y: 0.78 }));
        group.add(mesh(new THREE.BoxGeometry(0.18, 0.34, 0.04), accent, { x: 0.2, y: 1.05, z: 0.02 }));
        break;
      case "balloon":
        group.add(mesh(new THREE.SphereGeometry(0.42, 16, 12), primary, { y: 0.88 }));
        group.add(mesh(new THREE.BoxGeometry(0.22, 0.2, 0.22), 0xb57c4b, { y: 0.28 }));
        break;
      case "airport":
        group.add(mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.92, 12), 0xf7f7f7, { y: 0.46 }));
        group.add(mesh(new THREE.BoxGeometry(0.82, 0.13, 0.18), primary, { y: 0.78 }));
        group.add(mesh(new THREE.BoxGeometry(0.16, 0.13, 0.7), accent, { y: 0.78 }));
        break;
      case "gift":
        group.add(mesh(new THREE.BoxGeometry(0.72, 0.62, 0.62), primary, { y: 0.31 }));
        group.add(mesh(new THREE.BoxGeometry(0.16, 0.66, 0.66), accent, { y: 0.33 }));
        group.add(mesh(new THREE.BoxGeometry(0.76, 0.15, 0.16), accent, { y: 0.67 }));
        break;
      case "umbrella":
      default:
        group.add(mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.88, 8), 0xf5f0e7, { y: 0.44 }));
        group.add(mesh(new THREE.ConeGeometry(0.58, 0.28, 12), primary, { y: 0.91 }));
        group.add(mesh(new THREE.BoxGeometry(0.66, 0.08, 0.28), accent, { y: 0.12, rotationY: -0.2 }));
        break;
    }

    group.scale.setScalar(0.88);
    return group;
  }

  function setTokenPosition(token, nodeId, seat) {
    const layout = layoutByNode.get(nodeId);
    if (!layout || !token) return;
    const [offsetX, offsetZ] = tokenOffset(seat);
    token.position.set(layout.x + offsetX, layout.y + 0.62, layout.z + offsetZ);
  }

  function createOwnedBuilding(level, color) {
    const group = new THREE.Group();
    const light = visualMix(color, 0xffffff, 0.35);
    const dark = visualMix(color, 0x25445d, 0.26);
    const gold = CLASSIC_VISUAL_PROFILE.palette.gold;

    if (level === 1) {
      [-0.22, 0.22].forEach((x) => {
        group.add(mesh(new THREE.BoxGeometry(0.3, 0.5, 0.3), color, { x, y: 0.25 }));
        group.add(mesh(new THREE.ConeGeometry(0.25, 0.25, 4), light, { x, y: 0.62, rotationY: Math.PI / 4 }));
      });
    } else if (level === 2) {
      group.add(mesh(new THREE.BoxGeometry(0.42, 0.9, 0.38), color, { x: -0.22, y: 0.45 }));
      group.add(mesh(new THREE.BoxGeometry(0.38, 1.18, 0.34), light, { x: 0.23, y: 0.59, z: -0.02 }));
      group.add(mesh(new THREE.BoxGeometry(0.84, 0.1, 0.48), dark, { y: 0.08 }));
    } else {
      group.add(mesh(new THREE.BoxGeometry(0.62, 1.48, 0.48), color, { y: 0.74 }));
      group.add(mesh(new THREE.BoxGeometry(0.46, 0.28, 0.38), light, { y: 1.62 }));
      group.add(mesh(new THREE.ConeGeometry(0.22, 0.52, 6), gold, { y: 2.02 }));
      group.add(mesh(new THREE.TorusGeometry(0.36, 0.055, 8, 20), gold, {
        y: 1.43,
        rotationX: Math.PI / 2,
        castShadow: false,
        receiveShadow: false,
      }));
    }

    group.scale.setScalar(0.78);
    return group;
  }

  function rebuildBuildings(state) {
    for (const root of buildingRoots.values()) clearGroup(root);

    for (const [nodeId, propertyState] of Object.entries(state.boardState?.properties ?? {})) {
      const level = Number(propertyState.buildingLevel) || 0;
      if (level <= 0) continue;
      const root = buildingRoots.get(nodeId);
      if (!root) continue;
      const owner = state.players.find((player) => player.id === propertyState.ownerId);
      const color = ownerColor(owner?.seat ?? 0);
      const building = createOwnedBuilding(Math.min(3, level), color);
      building.position.z = 0.22;
      root.add(building);
    }
  }

  function updateOwnership(state) {
    for (const node of state.board.nodes) {
      const tile = tileMeshes.get(node.id);
      if (!tile) continue;
      const propertyState = state.boardState?.properties?.[node.id];
      const owner = propertyState?.ownerId
        ? state.players.find((player) => player.id === propertyState.ownerId)
        : null;
      tile.material.emissive.setHex(owner ? ownerColor(owner.seat) : 0x000000);
      tile.material.emissiveIntensity = owner ? 0.26 : 0;
    }
    rebuildBuildings(state);
  }

  function addCenterDiorama() {
    const center = new THREE.Group();

    center.add(mesh(
      new THREE.CylinderGeometry(4.55, 4.55, 0.18, 56),
      CLASSIC_VISUAL_PROFILE.palette.innerWater,
      { y: 0.55 },
    ));
    center.add(mesh(
      new THREE.CylinderGeometry(3.72, 3.88, 0.3, 56),
      CLASSIC_VISUAL_PROFILE.palette.plaza,
      { y: 0.75 },
    ));
    center.add(mesh(
      new THREE.TorusGeometry(2.78, 0.16, 8, 64),
      CLASSIC_VISUAL_PROFILE.palette.road,
      { y: 0.94, rotationX: Math.PI / 2 },
    ));
    center.add(mesh(
      new THREE.CylinderGeometry(1.9, 1.9, 0.16, 40),
      CLASSIC_VISUAL_PROFILE.palette.grass,
      { y: 0.98 },
    ));

    center.add(mesh(new THREE.CylinderGeometry(0.4, 0.54, 0.62, 16), 0xffffff, { y: 1.3 }));
    centerGlobe = mesh(new THREE.SphereGeometry(0.86, 24, 16), 0x55bdf0, { y: 2.08 });
    center.add(centerGlobe);

    [
      [-1.25, -0.86, 0.48, 0.92, 0xff8d8d],
      [-0.72, 1.0, 0.44, 1.35, 0x8fd3ff],
      [1.0, -0.96, 0.52, 1.1, 0x7edca2],
      [1.22, 0.74, 0.44, 1.45, 0xffb969],
    ].forEach(([x, z, width, height, color]) => {
      center.add(mesh(new THREE.BoxGeometry(width, height, width), color, { x, y: 1.0 + height / 2, z }));
    });

    [
      [-2.55, -0.65],
      [-2.1, 1.55],
      [2.2, -1.4],
      [2.45, 1.15],
    ].forEach(([x, z]) => addTree(center, x, z, 0.82));

    boardRoot.add(center);

    [
      [-7.3, 4.2, 0.9],
      [6.0, -5.2, 0.74],
      [6.9, 4.8, 0.66],
    ].forEach(([x, z, scale], index) => {
      const cloud = new THREE.Group();
      [-0.35, 0, 0.38].forEach((offset, partIndex) => {
        cloud.add(mesh(
          new THREE.SphereGeometry((0.34 + partIndex * 0.08) * scale, 12, 8),
          0xffffff,
          {
            x: offset * scale,
            y: 5.4 + partIndex * 0.08,
            z,
            castShadow: false,
            receiveShadow: false,
          },
        ));
      });
      cloud.position.x = x;
      cloud.userData.baseY = index * 0.08;
      boardRoot.add(cloud);
      ambientDecorations.push(cloud);
    });
  }

  function buildBoard(state) {
    clearBoard();
    boardSignature = state.board.nodes.map((node) => node.id).join("|");
    boardRoot = new THREE.Group();
    scene.add(boardRoot);

    const shadow = mesh(
      new THREE.CylinderGeometry(15.2, 15.2, 0.12, 48),
      0x7bb5d9,
      { y: -0.58, castShadow: false, receiveShadow: true },
    );
    shadow.scale.y = 0.35;
    boardRoot.add(shadow);

    boardRoot.add(mesh(
      new THREE.BoxGeometry(25.6, 0.92, 25.6),
      CLASSIC_VISUAL_PROFILE.palette.boardEdge,
      { y: -0.04 },
    ));
    boardRoot.add(mesh(
      new THREE.BoxGeometry(24.75, 0.54, 24.75),
      CLASSIC_VISUAL_PROFILE.palette.boardBase,
      { y: 0.48 },
    ));
    boardRoot.add(mesh(
      new THREE.BoxGeometry(CLASSIC_VISUAL_PROFILE.centerInsetSize, 0.18, CLASSIC_VISUAL_PROFILE.centerInsetSize),
      0xc8efff,
      { y: 0.8 },
    ));
    addCenterDiorama();

    const layout = createSquareRingLayout(state.board.nodes);
    layoutByNode = new Map(layout.map((entry) => [entry.nodeId, entry]));

    for (const [index, node] of state.board.nodes.entries()) {
      const entry = layoutByNode.get(node.id);
      const visual = getClassicTileVisual(node, index);
      const tileRoot = new THREE.Group();
      tileRoot.position.set(entry.x, entry.y, entry.z);
      tileRoot.rotation.y = entry.rotationY;
      tileRoot.userData.nodeId = node.id;
      tileRoot.userData.baseScaleY = 1;
      boardRoot.add(tileRoot);

      const depth = CLASSIC_VISUAL_PROFILE.tileDepth;
      const tile = mesh(new THREE.BoxGeometry(entry.tileLength, 0.5, depth), visual.color);
      tile.material.emissive = new THREE.Color(0x000000);
      tile.userData.nodeId = node.id;
      tile.userData.tileRoot = tileRoot;
      tileRoot.add(tile);
      tileMeshes.set(node.id, tile);

      tileRoot.add(mesh(
        new THREE.BoxGeometry(entry.tileLength * 0.91, 0.11, depth * 0.9),
        0xffffff,
        { y: 0.3 },
      ));
      tileRoot.add(mesh(
        new THREE.BoxGeometry(entry.tileLength * 0.82, 0.08, 0.3),
        visual.accent,
        { y: 0.38, z: -(depth * 0.34) },
      ));

      const propRoot = new THREE.Group();
      propRoot.position.set(0, 0.38, -(depth * 0.1));
      if (node.type === "PROPERTY") propRoot.add(createLandmark(visual.landmark, visual));
      else propRoot.add(createSpecialProp(visual.landmark, visual));
      tileRoot.add(propRoot);

      const buildingRoot = new THREE.Group();
      buildingRoot.position.set(0, 0.38, depth * 0.12);
      tileRoot.add(buildingRoot);
      buildingRoots.set(node.id, buildingRoot);

      const labelTexture = createLabelTexture(THREE, node, visual);
      const label = new THREE.Sprite(new THREE.SpriteMaterial({
        map: labelTexture,
        transparent: true,
        depthTest: false,
      }));
      const [labelWidth, labelHeight] = CLASSIC_VISUAL_PROFILE.labelScale;
      label.scale.set(Math.min(labelWidth, entry.tileLength * 1.55), labelHeight, 1);
      label.position.set(0, 2.32, depth * 0.16);
      label.renderOrder = 6;
      tileRoot.add(label);
    }

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

  function selectTile(tile) {
    const tileRoot = tile?.userData?.tileRoot ?? null;
    if (selectedTileRoot && selectedTileRoot !== tileRoot) {
      selectedTileRoot.scale.y = selectedTileRoot.userData.baseScaleY ?? 1;
    }
    selectedTileRoot = tileRoot;
    if (!selectedTileRoot) return;
    selectedTileRoot.scale.y = 1.18;
    onTileSelect(tile.userData.nodeId);
  }

  function handlePointerUp(event) {
    if (!webglRenderer || !camera) return;
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
        token.position.y += Math.sin(progress * Math.PI) * 0.34;
        token.rotation.y = Math.sin(progress * Math.PI) * 0.12;
        if (progress >= 1) {
          token.rotation.y = 0;
          resolve();
        } else {
          requestAnimationFrame(step);
        }
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
      scene = new THREE.Scene();
      scene.background = new THREE.Color(CLASSIC_VISUAL_PROFILE.palette.sky);
      scene.fog = new THREE.Fog(CLASSIC_VISUAL_PROFILE.palette.fog, 42, 68);

      const initialBounds = createOrthographicBounds(1, 1);
      camera = new THREE.OrthographicCamera(
        initialBounds.left,
        initialBounds.right,
        initialBounds.top,
        initialBounds.bottom,
        0.1,
        100,
      );
      camera.position.set(...CLASSIC_CAMERA_PROFILE.position);
      camera.lookAt(...CLASSIC_CAMERA_PROFILE.target);

      webglRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      webglRenderer.shadowMap.enabled = true;
      webglRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
      webglRenderer.outputColorSpace = THREE.SRGBColorSpace;
      webglRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      webglRenderer.toneMappingExposure = 1.08;
      webglRenderer.domElement.className = "classic-three-canvas";
      webglRenderer.domElement.style.cursor = "pointer";
      webglRenderer.domElement.style.touchAction = "pan-y";
      webglRenderer.domElement.setAttribute(
        "aria-label",
        "고정 쿼터뷰 Classic 2.5D 장난감 도시 보드. 타일을 선택할 수 있습니다.",
      );
      target.replaceChildren(webglRenderer.domElement);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x86acd0, 2.8));
      const key = new THREE.DirectionalLight(0xfff8e9, 3.8);
      key.position.set(10, 22, 14);
      key.castShadow = true;
      key.shadow.mapSize.set(1536, 1536);
      key.shadow.camera.left = -18;
      key.shadow.camera.right = 18;
      key.shadow.camera.top = 18;
      key.shadow.camera.bottom = -18;
      scene.add(key);

      const fill = new THREE.DirectionalLight(0x8ccfff, 1.2);
      fill.position.set(-12, 10, -8);
      scene.add(fill);

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
      activePlayerId = state.currentPlayerIndex === null
        ? null
        : state.players[state.currentPlayerIndex]?.id ?? null;
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
          layout.y + 0.62,
          layout.z + offsetZ,
        );
        await tweenToken(token, destination, reducedMotion ? 0 : 165);
      }
    },

    dispose() {
      disposed = true;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      if (webglRenderer?.domElement) {
        webglRenderer.domElement.removeEventListener("pointerup", handlePointerUp);
      }
      clearBoard();
      webglRenderer?.dispose?.();
      target?.replaceChildren();
      target = null;
      scene = null;
      camera = null;
      webglRenderer = null;
    },
  };

  return createRendererContract(renderer);
}
