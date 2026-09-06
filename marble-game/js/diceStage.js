import { DICE_OVERLAY_VIEW, createDiceOverlayBounds } from "./diceOverlayView.js";

export const DICE_STAGE_PROFILE = Object.freeze({
  durationMs: 920,
  dieSize: 1.18,
  settleHeight: 0.62,
  defaultStrength: 0.55,
});

export function normalizeDiceFace(value) {
  const face = Number(value);
  if (!Number.isInteger(face) || face < 1 || face > 6) {
    throw new RangeError(`Dice face must be an integer from 1 to 6: ${value}`);
  }
  return face;
}

export function normalizeRollStrength(value) {
  const strength = Number(value);
  if (!Number.isFinite(strength)) return DICE_STAGE_PROFILE.defaultStrength;
  return Math.min(1, Math.max(0, strength));
}

export function rollAnimationProfile(value) {
  const strength = normalizeRollStrength(value);
  return Object.freeze({
    strength,
    durationMs: Math.round(720 + (strength * 520)),
    throwHeight: 1.25 + (strength * 2.0),
    horizontalSpread: 0.12 + (strength * 0.52),
    bounceHeight: 0.12 + (strength * 0.38),
    spinMultiplier: 0.68 + (strength * 1.05),
  });
}

export function dieFaceNormal(value) {
  const face = normalizeDiceFace(value);
  const normals = {
    1: [0, 1, 0],
    2: [0, 0, 1],
    3: [1, 0, 0],
    4: [-1, 0, 0],
    5: [0, 0, -1],
    6: [0, -1, 0],
  };
  return Object.freeze(normals[face]);
}

function pipCoordinates(value) {
  const left = 0.3;
  const right = 0.7;
  const top = 0.3;
  const bottom = 0.7;
  const center = 0.5;
  const patterns = {
    1: [[center, center]],
    2: [[left, top], [right, bottom]],
    3: [[left, top], [center, center], [right, bottom]],
    4: [[left, top], [right, top], [left, bottom], [right, bottom]],
    5: [[left, top], [right, top], [center, center], [left, bottom], [right, bottom]],
    6: [[left, top], [right, top], [left, center], [right, center], [left, bottom], [right, bottom]],
  };
  return patterns[value];
}

function createFaceMaterial(THREE, value) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  context.fillStyle = "#fffaf0";
  context.fillRect(0, 0, 256, 256);
  context.strokeStyle = "rgba(31, 48, 67, 0.16)";
  context.lineWidth = 8;
  context.strokeRect(8, 8, 240, 240);
  context.fillStyle = value === 1 ? "#e05262" : "#24384c";
  for (const [x, y] of pipCoordinates(value)) {
    context.beginPath();
    context.arc(x * 256, y * 256, 20, 0, Math.PI * 2);
    context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.54,
    metalness: 0.02,
  });
}

function createDie(THREE) {
  const faceOrder = [3, 4, 1, 6, 2, 5];
  const materials = faceOrder.map((face) => createFaceMaterial(THREE, face));
  const die = new THREE.Mesh(
    new THREE.BoxGeometry(DICE_STAGE_PROFILE.dieSize, DICE_STAGE_PROFILE.dieSize, DICE_STAGE_PROFILE.dieSize, 2, 2, 2),
    materials,
  );
  die.castShadow = true;
  die.receiveShadow = true;
  return die;
}

function finalQuaternion(THREE, value, yaw = 0) {
  const normal = new THREE.Vector3(...dieFaceNormal(value));
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(normal, up);
  const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(up, yaw);
  quaternion.premultiply(yawQuaternion);
  return quaternion;
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

export function createThreeDiceStage({
  reducedMotion = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
} = {}) {
  let THREE = null;
  let target = null;
  let scene = null;
  let camera = null;
  let renderer = null;
  let diceRoot = null;
  let dice = [];
  let resizeObserver = null;
  let readyObserver = null;
  let disposed = false;
  let preserveNextHide = false;

  function render() {
    if (!renderer || !scene || !camera) return;
    renderer.render(scene, camera);
  }

  function resize() {
    if (!target || !renderer || !camera) return;
    const width = Math.max(1, target.clientWidth);
    const height = Math.max(1, target.clientHeight);
    const bounds = createDiceOverlayBounds(width, height);
    camera.left = bounds.left;
    camera.right = bounds.right;
    camera.top = bounds.top;
    camera.bottom = bounds.bottom;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  }

  function setSettled(values) {
    values.forEach((value, index) => {
      const die = dice[index];
      die.position.set(index === 0 ? -0.82 : 0.82, DICE_STAGE_PROFILE.settleHeight, index === 0 ? 0.04 : -0.08);
      die.quaternion.copy(finalQuaternion(THREE, value, index === 0 ? -0.22 : 0.28));
      die.scale.setScalar(1);
    });
  }

  function showReadyDice() {
    if (!diceRoot || !renderer) return;
    if (!diceRoot.visible) setSettled([1, 6]);
    diceRoot.visible = true;
    render();
  }

  return Object.freeze({
    async mount(targetElement) {
      if (!targetElement || typeof targetElement.replaceChildren !== "function") {
        throw new TypeError("Dice stage mount target is required.");
      }
      target = targetElement;
      disposed = false;
      preserveNextHide = false;
      THREE = await import("three");
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
      camera.position.set(...DICE_OVERLAY_VIEW.position);
      camera.lookAt(...DICE_OVERLAY_VIEW.target);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.className = "dice-three-canvas";
      renderer.domElement.setAttribute("aria-hidden", "true");
      target.replaceChildren(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x7895ad, 2.5));
      const key = new THREE.DirectionalLight(0xffffff, 4.2);
      key.position.set(4, 8, 5);
      key.castShadow = true;
      scene.add(key);

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(6.5, 4.2),
        new THREE.ShadowMaterial({ opacity: 0.22 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0;
      ground.receiveShadow = true;
      scene.add(ground);

      diceRoot = new THREE.Group();
      dice = [createDie(THREE), createDie(THREE)];
      diceRoot.add(...dice);
      diceRoot.visible = false;
      scene.add(diceRoot);

      resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
      resizeObserver?.observe(target);
      window.addEventListener("resize", resize);
      readyObserver = typeof MutationObserver !== "undefined" ? new MutationObserver(() => {
        if (target?.dataset?.ready === "true") showReadyDice();
      }) : null;
      readyObserver?.observe(target, { attributes: true, attributeFilter: ["data-ready"] });
      resize();
      if (target.dataset.ready === "true") showReadyDice();
    },

    showReady() {
      showReadyDice();
    },

    async playRoll(values, options = {}) {
      if (!diceRoot || !renderer) return;
      const faces = [normalizeDiceFace(values?.[0]), normalizeDiceFace(values?.[1])];
      const strength = normalizeRollStrength(options.strength ?? target?.dataset?.rollStrength ?? DICE_STAGE_PROFILE.defaultStrength);
      const motion = rollAnimationProfile(strength);
      preserveNextHide = false;
      if (!diceRoot.visible) showReadyDice();
      diceRoot.visible = true;

      if (reducedMotion) {
        setSettled(faces);
        preserveNextHide = true;
        render();
        return;
      }

      const starts = dice.map((die) => ({
        x: die.position.x,
        y: die.position.y,
        z: die.position.z,
        rotation: [die.rotation.x, die.rotation.y, die.rotation.z],
      }));
      const ends = [
        { x: -0.82, z: 0.04 },
        { x: 0.82, z: -0.08 },
      ];
      const startedAt = performance.now();

      await new Promise((resolve) => {
        function frame(now) {
          if (disposed) {
            resolve();
            return;
          }
          const progress = Math.min(1, (now - startedAt) / motion.durationMs);
          const eased = 1 - ((1 - progress) ** 3);
          const jump = Math.sin(progress * Math.PI) * motion.throwHeight;
          const landingProgress = Math.max(0, (progress - 0.72) / 0.28);
          const landingBounce = landingProgress > 0
            ? Math.abs(Math.sin(landingProgress * Math.PI * 2.4)) * motion.bounceHeight * (1 - landingProgress)
            : 0;

          dice.forEach((die, index) => {
            const start = starts[index];
            const end = ends[index];
            const direction = index === 0 ? -1 : 1;
            const outwardArc = Math.sin(progress * Math.PI) * motion.horizontalSpread * direction;
            const depthArc = Math.sin(progress * Math.PI * 2) * motion.horizontalSpread * 0.22 * direction;
            die.position.x = start.x + ((end.x - start.x) * eased) + outwardArc;
            die.position.z = start.z + ((end.z - start.z) * eased) + depthArc;
            die.position.y = DICE_STAGE_PROFILE.settleHeight + jump + landingBounce;
            die.rotation.set(
              start.rotation[0] + progress * Math.PI * (5.2 + faces[index]) * motion.spinMultiplier,
              start.rotation[1] + progress * Math.PI * (7.2 + index * 1.6) * motion.spinMultiplier,
              start.rotation[2] + progress * Math.PI * (4.6 + faces[1 - index]) * motion.spinMultiplier,
            );
            const squash = 1 - Math.sin(progress * Math.PI) * (0.025 + (strength * 0.022));
            die.scale.set(1 / squash, squash, 1 / squash);
          });
          render();

          if (progress >= 1) {
            setSettled(faces);
            preserveNextHide = true;
            render();
            resolve();
          } else {
            requestAnimationFrame(frame);
          }
        }
        requestAnimationFrame(frame);
      });
    },

    hide() {
      if (!diceRoot) return;
      if (preserveNextHide) {
        preserveNextHide = false;
        return;
      }
      diceRoot.visible = false;
      render();
    },

    dispose() {
      disposed = true;
      preserveNextHide = false;
      resizeObserver?.disconnect();
      readyObserver?.disconnect();
      window.removeEventListener("resize", resize);
      if (scene) disposeObject(scene);
      renderer?.dispose?.();
      target?.replaceChildren();
      target = null;
      scene = null;
      camera = null;
      renderer = null;
      diceRoot = null;
      dice = [];
    },
  });
}
