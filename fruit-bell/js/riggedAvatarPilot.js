import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FruitBellScene } from "./scene.js";

const PILOT_MODEL_URL = "https://raw.githubusercontent.com/danvanderboom/Aetherium/main/samples/unity/Aphelion/Assets/ThirdParty/Quaternius/Animated/reclaimer-rae.gltf";
const PILOT_TARGET_HEIGHT = 2.72;
const stateByScene = new WeakMap();
const loader = new GLTFLoader();
let pilotAssetPromise = null;

function normalizeName(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function chooseClip(animations, preferredNames) {
  if (!animations?.length) return null;
  const preferred = preferredNames.map(normalizeName);

  for (const wanted of preferred) {
    const exact = animations.find((clip) => normalizeName(clip.name) === wanted);
    if (exact) return exact;
  }

  for (const wanted of preferred) {
    const partial = animations.find((clip) => normalizeName(clip.name).includes(wanted));
    if (partial) return partial;
  }

  return animations[0];
}

function loadPilotAsset() {
  pilotAssetPromise ||= loader.loadAsync(PILOT_MODEL_URL);
  return pilotAssetPromise;
}

function prepareModel(model) {
  if (model.userData.fruitBellPilotPrepared) return;

  model.position.set(0, 0, 0);
  model.scale.set(1, 1, 1);
  model.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  if (size.y > 0.0001) {
    model.scale.setScalar(PILOT_TARGET_HEIGHT / size.y);
  }

  model.updateMatrixWorld(true);
  const scaledBox = new THREE.Box3().setFromObject(model);
  const center = scaledBox.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= scaledBox.min.y;

  model.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
    if (object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if ("roughness" in material) material.roughness = Math.max(0.62, material.roughness ?? 0.62);
        if ("metalness" in material) material.metalness = Math.min(0.18, material.metalness ?? 0.18);
      });
    }
  });

  model.userData.fruitBellPilotPrepared = true;
}

function getState(sceneController) {
  let state = stateByScene.get(sceneController);
  if (state) return state;

  state = {
    generation: 0,
    rigs: new Map(),
    frame: 0,
    lastTime: performance.now(),
  };
  stateByScene.set(sceneController, state);
  return state;
}

function restoreIdle(rig) {
  if (!rig?.idleClip) return;
  const next = rig.mixer.clipAction(rig.idleClip);
  rig.currentAction?.fadeOut(0.08);
  next.reset();
  next.enabled = true;
  next.setLoop(THREE.LoopRepeat, Infinity);
  next.clampWhenFinished = false;
  next.fadeIn(0.12).play();
  rig.currentAction = next;
}

function playOneShot(rig, clip) {
  if (!rig || !clip) return;
  const next = rig.mixer.clipAction(clip);
  rig.currentAction?.fadeOut(0.06);
  next.reset();
  next.enabled = true;
  next.setLoop(THREE.LoopOnce, 1);
  next.clampWhenFinished = false;
  next.fadeIn(0.06).play();
  rig.currentAction = next;
}

function clearRiggedAvatars(sceneController) {
  const state = getState(sceneController);
  state.generation += 1;
  state.rigs.forEach((rig) => {
    rig.mixer.stopAllAction();
    rig.root.removeFromParent();
    if (rig.fallback) rig.fallback.visible = true;
  });
  state.rigs.clear();
  sceneController.canvas.dataset.riggedAvatar = "fallback";
}

function updateMotion(rig, now) {
  if (!rig.motion) return;
  const elapsed = now - rig.motion.start;
  const t = THREE.MathUtils.clamp(elapsed / rig.motion.duration, 0, 1);
  const pulse = Math.sin(Math.PI * t);

  rig.root.position.copy(rig.basePosition).addScaledVector(rig.toBell, rig.motion.distance * pulse);
  rig.motionRoot.rotation.x = rig.motion.tilt * pulse;
  rig.motionRoot.rotation.z = rig.motion.twist * pulse;

  if (t >= 1) {
    rig.root.position.copy(rig.basePosition);
    rig.motionRoot.rotation.set(0, 0, 0);
    rig.motion = null;
  }
}

function ensureMixerLoop(sceneController) {
  const state = getState(sceneController);
  if (state.frame) return;
  state.lastTime = performance.now();

  const tick = (now) => {
    const delta = Math.min(0.05, Math.max(0, (now - state.lastTime) / 1000));
    state.lastTime = now;
    state.rigs.forEach((rig) => {
      rig.mixer.update(delta);
      updateMotion(rig, now);
    });
    state.frame = requestAnimationFrame(tick);
  };

  state.frame = requestAnimationFrame(tick);
}

function triggerRiggedReaction(sceneController, playerId, type, correct = true) {
  const rig = getState(sceneController).rigs.get(playerId);
  if (!rig) return;

  let clip = null;
  if (type === "flip") clip = rig.flipClip;
  else if (correct) clip = rig.bellClip;
  else clip = rig.missClip;

  playOneShot(rig, clip);
  rig.motion = {
    start: performance.now(),
    duration: type === "bell" ? 620 : 500,
    distance: type === "bell" ? (correct ? 0.48 : -0.12) : 0.1,
    tilt: type === "bell" ? -0.12 : -0.06,
    twist: type === "bell" ? 0 : 0.035,
  };
}

async function mountPilotRig(sceneController, players) {
  const pilotPlayer = players?.[1];
  if (!pilotPlayer) return;

  const state = getState(sceneController);
  const generation = state.generation;
  const fallbackAvatar = sceneController.avatarMap.get(pilotPlayer.id);
  if (!fallbackAvatar) return;

  sceneController.canvas.dataset.riggedAvatar = "loading";

  try {
    const asset = await loadPilotAsset();
    if (state.generation !== generation) return;

    const currentFallback = sceneController.avatarMap.get(pilotPlayer.id);
    if (!currentFallback) return;

    const model = asset.scene;
    model.removeFromParent();
    prepareModel(model);

    const root = new THREE.Group();
    const motionRoot = new THREE.Group();
    root.position.copy(currentFallback.group.position);
    root.position.y -= 0.42;
    root.rotation.copy(currentFallback.group.rotation);
    motionRoot.add(model);
    root.add(motionRoot);
    sceneController.scene.add(root);

    const mixer = new THREE.AnimationMixer(model);
    const rig = {
      playerId: pilotPlayer.id,
      root,
      motionRoot,
      mixer,
      fallback: currentFallback.group,
      currentAction: null,
      idleClip: chooseClip(asset.animations, ["Idle"]),
      flipClip: chooseClip(asset.animations, ["Wave", "Punch"]),
      bellClip: chooseClip(asset.animations, ["Punch", "Yes"]),
      missClip: chooseClip(asset.animations, ["HitReact", "No"]),
      basePosition: root.position.clone(),
      toBell: new THREE.Vector3(-root.position.x, 0, -root.position.z).normalize(),
      motion: null,
    };

    mixer.addEventListener("finished", () => {
      if (getState(sceneController).rigs.get(pilotPlayer.id) === rig) restoreIdle(rig);
    });

    currentFallback.group.visible = false;
    state.rigs.set(pilotPlayer.id, rig);
    restoreIdle(rig);
    ensureMixerLoop(sceneController);
    sceneController.canvas.dataset.riggedAvatar = "ready";
    sceneController.canvas.dispatchEvent(new CustomEvent("fruit-bell-rigged-avatar-ready", {
      detail: { playerId: pilotPlayer.id, model: "rae-red-panda-pilot" },
    }));
  } catch (error) {
    if (state.generation !== generation) return;
    sceneController.canvas.dataset.riggedAvatar = "fallback";
    console.warn("Fruit Bell rigged avatar pilot could not load; using procedural fallback.", error);
  }
}

const originalConfigurePlayers = FruitBellScene.prototype.configurePlayers;
const originalPlayOpponentFlip = FruitBellScene.prototype.playOpponentFlip;
const originalPlayOpponentBell = FruitBellScene.prototype.playOpponentBell;

if (!FruitBellScene.prototype.__fruitBellRiggedPilotInstalled) {
  Object.defineProperty(FruitBellScene.prototype, "__fruitBellRiggedPilotInstalled", {
    value: true,
    configurable: false,
    enumerable: false,
  });

  FruitBellScene.prototype.configurePlayers = function configurePlayersWithRiggedPilot(players) {
    clearRiggedAvatars(this);
    const result = originalConfigurePlayers.call(this, players);
    mountPilotRig(this, players);
    return result;
  };

  FruitBellScene.prototype.playOpponentFlip = function playOpponentFlipWithRiggedPilot(playerId, card, callbacks) {
    const result = originalPlayOpponentFlip.call(this, playerId, card, callbacks);
    triggerRiggedReaction(this, playerId, "flip", true);
    return result;
  };

  FruitBellScene.prototype.playOpponentBell = function playOpponentBellWithRiggedPilot(playerId, correct) {
    const result = originalPlayOpponentBell.call(this, playerId, correct);
    triggerRiggedReaction(this, playerId, "bell", correct);
    return result;
  };
}
