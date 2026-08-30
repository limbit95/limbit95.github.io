import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/addons/utils/SkeletonUtils.js";
import { FruitBellScene } from "./scene.js";
import {
  createArmChain,
  getEffectorDistance,
  getReachDeficit,
  reachEnvelope,
  solveCcdChain,
} from "./rigIkSolver.js";

const PILOT_MODEL_URL = "https://raw.githubusercontent.com/danvanderboom/Aetherium/3e3c35a18adfb283b81f087c977bd5e41cac5259/samples/unity/Aphelion/Assets/ThirdParty/Quaternius/Animated/reclaimer-rae.gltf";
const PILOT_TARGET_HEIGHT = 3.45;
const PILOT_BASE_TABLE_ADVANCE = 0.08;
const PILOT_SEATED_ROOT_Y = -0.32;
const HIDDEN_ACCESSORY_PATTERN = /(pistol|gun|rifle|weapon|blaster|laser|cannon|launcher)/i;
const BELL_CONTACT_PROGRESS = 0.56;
const CARD_CONTACT_PROGRESS = 0.58;
const BELL_CONTACT_TOLERANCE = 0.11;
const MAX_TORSO_BELL_SHIFT = 0.86;
const MAX_TORSO_CARD_SHIFT = 0.2;
const CARD_ROOT_TRAVEL = 0.08;
const stateByScene = new WeakMap();
const loader = new GLTFLoader();
let pilotAssetPromise = null;

function normalizeName(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findNode(root, candidates) {
  if (!root) return null;
  const wanted = candidates.map(normalizeName);
  let match = null;

  root.traverse((object) => {
    if (match) return;
    const name = normalizeName(object.name);
    if (!name) return;
    if (wanted.includes(name) || wanted.some((candidate) => name.includes(candidate))) match = object;
  });

  return match;
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

function shouldHideAccessory(object) {
  const materialNames = object.material
    ? (Array.isArray(object.material) ? object.material : [object.material])
      .map((material) => material?.name || "")
      .join(" ")
    : "";
  return HIDDEN_ACCESSORY_PATTERN.test(`${object.name || ""} ${object.parent?.name || ""} ${materialNames}`);
}

function prepareModel(model) {
  if (model.userData.fruitBellPilotPrepared) return;

  model.position.set(0, 0, 0);
  model.scale.set(1, 1, 1);
  model.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  if (size.y > 0.0001) model.scale.setScalar(PILOT_TARGET_HEIGHT / size.y);

  model.updateMatrixWorld(true);
  const scaledBox = new THREE.Box3().setFromObject(model);
  const center = scaledBox.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= scaledBox.min.y;

  model.traverse((object) => {
    if (shouldHideAccessory(object)) {
      object.visible = false;
      return;
    }

    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
    if (!object.material) return;

    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if ("roughness" in material) material.roughness = Math.max(0.62, material.roughness ?? 0.62);
      if ("metalness" in material) material.metalness = Math.min(0.18, material.metalness ?? 0.18);
    });
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

function updateRigReadiness(sceneController) {
  const state = getState(sceneController);
  const readyRigs = [...state.rigs.values()].filter((rig) => rig.leftArmChain && rig.rightArmChain).length;
  sceneController.canvas.dataset.riggedAvatarCount = String(state.rigs.size);
  sceneController.canvas.dataset.riggedAvatar = readyRigs === state.rigs.size && readyRigs > 0
    ? "multi-seat-ik-ready"
    : state.rigs.size > 0 ? "multi-seat-ready" : "fallback";
}

function restoreIdle(rig) {
  if (!rig?.idleClip) return;
  const next = rig.mixer.clipAction(rig.idleClip);
  rig.currentAction?.fadeOut(0.08);
  next.reset();
  next.enabled = true;
  next.timeScale = 1;
  next.setLoop(THREE.LoopRepeat, Infinity);
  next.clampWhenFinished = false;
  next.fadeIn(0.12).play();
  rig.currentAction = next;
}

function playOneShot(rig, clip, { timeScale = 1 } = {}) {
  if (!rig || !clip) return;
  const next = rig.mixer.clipAction(clip);
  rig.currentAction?.fadeOut(0.06);
  next.reset();
  next.enabled = true;
  next.timeScale = timeScale;
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
  sceneController.canvas.dataset.riggedAvatarCount = "0";
  delete sceneController.canvas.dataset.rigBellContactError;
}

function getDeckReachTarget(sceneController, rig, target) {
  const deck = sceneController.deckMap.get(rig.playerId);
  if (!deck) return null;
  deck.getWorldPosition(target);
  target.y += Math.max(0.18, (deck.userData?.count || 1) * 0.026 + 0.08);
  target.addScaledVector(rig.toBell, 0.12);
  return target;
}

function getBellReachTarget(sceneController, target) {
  if (!sceneController.bellTop) return null;
  sceneController.bellTop.getWorldPosition(target);
  target.y += 0.36;
  return target;
}

function getInteractionTarget(sceneController, rig, type, target) {
  return type === "bell"
    ? getBellReachTarget(sceneController, target)
    : getDeckReachTarget(sceneController, rig, target);
}

function restoreTorsoOffset(rig) {
  if (!rig.torso || !rig.lastTorsoShift) return;
  rig.torso.position.z -= rig.lastTorsoShift;
  rig.lastTorsoShift = 0;
}

function computeTorsoShift(sceneController, rig, type) {
  const chain = type === "bell" ? rig.leftArmChain : rig.rightArmChain;
  const target = getInteractionTarget(sceneController, rig, type, rig.travelTarget);
  if (!chain || !target) return 0;

  rig.root.position.copy(rig.basePosition);
  rig.root.updateMatrixWorld(true);

  const deficit = getReachDeficit(chain, target, {
    reachScale: type === "bell" ? 0.97 : 0.98,
  });
  const safety = type === "bell" ? 0.08 : 0.025;
  return THREE.MathUtils.clamp(
    deficit + safety,
    0,
    type === "bell" ? MAX_TORSO_BELL_SHIFT : MAX_TORSO_CARD_SHIFT,
  );
}

function updateMotion(rig, now) {
  if (!rig.motion) return;
  const elapsed = now - rig.motion.start;
  const progress = THREE.MathUtils.clamp(elapsed / rig.motion.duration, 0, 1);
  const weight = reachEnvelope(progress, {
    contactAt: rig.motion.contactAt,
    releaseAt: rig.motion.releaseAt,
  });

  rig.root.position.copy(rig.basePosition);
  if (rig.motion.rootTravel > 0) {
    rig.root.position.addScaledVector(rig.toBell, rig.motion.rootTravel * weight);
  }

  if (rig.torso && rig.motion.torsoShift > 0) {
    const shift = rig.motion.torsoShift * weight;
    rig.torso.position.z += shift;
    rig.lastTorsoShift = shift;
  }

  rig.root.updateMatrixWorld(true);

  if (progress >= 1) {
    rig.root.position.copy(rig.basePosition);
    rig.motion = null;
  }
}

function updateReach(sceneController, rig, now) {
  if (!rig.reach) return;

  const elapsed = now - rig.reach.start;
  const progress = THREE.MathUtils.clamp(elapsed / rig.reach.duration, 0, 1);
  const isBell = rig.reach.type === "bell";
  const contactAt = isBell ? BELL_CONTACT_PROGRESS : CARD_CONTACT_PROGRESS;
  const releaseAt = isBell ? 0.8 : 0.76;
  const chain = isBell ? rig.leftArmChain : rig.rightArmChain;
  const target = getInteractionTarget(sceneController, rig, rig.reach.type, rig.reach.target);

  let contactError = Infinity;
  if (chain && target) {
    const weight = reachEnvelope(progress, { contactAt, releaseAt });
    solveCcdChain({
      chain,
      targetWorld: target,
      weight,
      iterations: isBell ? 13 : 8,
      maxJointStep: isBell ? Math.PI / 3.6 : Math.PI / 4.8,
    });
    contactError = getEffectorDistance(chain, target);
    if (isBell && Number.isFinite(contactError)) {
      rig.lastBellContactError = contactError;
      sceneController.canvas.dataset.rigBellContactError = contactError.toFixed(3);
    }
  }

  if (
    isBell
    && !rig.reach.contactFired
    && progress >= contactAt
    && contactError <= BELL_CONTACT_TOLERANCE
  ) {
    rig.reach.contactFired = true;
    sceneController.pulseBell();
    sceneController.canvas.dispatchEvent(new CustomEvent("fruit-bell-rig-contact", {
      detail: {
        playerId: rig.playerId,
        seatIndex: rig.seatIndex,
        interaction: "bell",
        error: contactError,
      },
    }));
  }

  if (progress >= 1) rig.reach = null;
}

function updateDelayedReaction(rig, now) {
  if (!rig.delayedMissAt || now < rig.delayedMissAt) return;
  rig.delayedMissAt = 0;
  playOneShot(rig, rig.missClip, { timeScale: 1.08 });
}

function ensureMixerLoop(sceneController) {
  const state = getState(sceneController);
  if (state.frame) return;
  state.lastTime = performance.now();

  const tick = (now) => {
    const delta = Math.min(0.05, Math.max(0, (now - state.lastTime) / 1000));
    state.lastTime = now;
    state.rigs.forEach((rig) => {
      restoreTorsoOffset(rig);
      rig.mixer.update(delta);
      updateMotion(rig, now);
      updateReach(sceneController, rig, now);
      updateDelayedReaction(rig, now);
    });
    state.frame = requestAnimationFrame(tick);
  };

  state.frame = requestAnimationFrame(tick);
}

function triggerRiggedReaction(sceneController, playerId, type, correct = true) {
  const rig = getState(sceneController).rigs.get(playerId);
  if (!rig) return false;

  if (type === "flip") {
    playOneShot(rig, rig.flipClip, { timeScale: 1.55 });
  } else {
    playOneShot(rig, rig.bellClip, { timeScale: 1.08 });
    rig.delayedMissAt = correct ? 0 : performance.now() + 760;
  }

  const isBell = type === "bell";
  const duration = isBell ? 760 : 440;
  const contactAt = isBell ? BELL_CONTACT_PROGRESS : CARD_CONTACT_PROGRESS;
  const releaseAt = isBell ? 0.8 : 0.76;

  rig.motion = {
    start: performance.now(),
    duration,
    contactAt,
    releaseAt,
    rootTravel: isBell ? 0 : CARD_ROOT_TRAVEL,
    torsoShift: computeTorsoShift(sceneController, rig, type),
  };
  rig.reach = {
    type,
    start: performance.now(),
    duration,
    target: new THREE.Vector3(),
    contactFired: false,
  };
  return true;
}

function createRig(sceneController, player, seatIndex, fallbackAvatar, asset) {
  const model = cloneSkeleton(asset.scene);
  model.removeFromParent();

  const root = new THREE.Group();
  const motionRoot = new THREE.Group();
  root.position.copy(fallbackAvatar.group.position);
  root.position.y = PILOT_SEATED_ROOT_Y;
  root.rotation.copy(fallbackAvatar.group.rotation);

  const seatToBell = new THREE.Vector3(-root.position.x, 0, -root.position.z).normalize();
  root.position.addScaledVector(seatToBell, PILOT_BASE_TABLE_ADVANCE);

  motionRoot.add(model);
  root.add(motionRoot);
  sceneController.scene.add(root);

  const mixer = new THREE.AnimationMixer(model);
  const rig = {
    playerId: player.id,
    animalId: player.animalId,
    seatIndex,
    root,
    motionRoot,
    mixer,
    fallback: fallbackAvatar.group,
    currentAction: null,
    idleClip: chooseClip(asset.animations, ["Idle"]),
    flipClip: chooseClip(asset.animations, ["Punch"]),
    bellClip: chooseClip(asset.animations, ["Punch", "Yes"]),
    missClip: chooseClip(asset.animations, ["HitReact", "No"]),
    torso: findNode(model, ["Torso", "Chest", "Spine"]),
    leftArmChain: createArmChain(model, "L"),
    rightArmChain: createArmChain(model, "R"),
    basePosition: root.position.clone(),
    toBell: new THREE.Vector3(-root.position.x, 0, -root.position.z).normalize(),
    travelTarget: new THREE.Vector3(),
    lastTorsoShift: 0,
    lastBellContactError: Infinity,
    motion: null,
    reach: null,
    delayedMissAt: 0,
  };

  mixer.addEventListener("finished", () => {
    if (getState(sceneController).rigs.get(player.id) === rig && !rig.delayedMissAt) restoreIdle(rig);
  });

  fallbackAvatar.group.visible = false;
  return rig;
}

async function mountPilotRigs(sceneController, players) {
  const opponents = players?.slice(1, 4) || [];
  if (!opponents.length) return;

  const state = getState(sceneController);
  const generation = state.generation;
  sceneController.canvas.dataset.riggedAvatar = "loading";
  sceneController.canvas.dataset.riggedAvatarCount = "0";

  try {
    const asset = await loadPilotAsset();
    if (state.generation !== generation) return;

    prepareModel(asset.scene);

    opponents.forEach((player, opponentIndex) => {
      if (state.generation !== generation) return;
      const currentFallback = sceneController.avatarMap.get(player.id);
      if (!currentFallback) return;

      const rig = createRig(sceneController, player, opponentIndex + 1, currentFallback, asset);
      state.rigs.set(player.id, rig);
      restoreIdle(rig);
      updateRigReadiness(sceneController);
      sceneController.canvas.dispatchEvent(new CustomEvent("fruit-bell-rigged-avatar-ready", {
        detail: {
          playerId: player.id,
          animalId: player.animalId,
          seatIndex: opponentIndex + 1,
          model: "rae-shared-motion-pilot",
          ik: Boolean(rig.leftArmChain && rig.rightArmChain),
        },
      }));
    });

    ensureMixerLoop(sceneController);
    updateRigReadiness(sceneController);
  } catch (error) {
    if (state.generation !== generation) return;
    state.rigs.forEach((rig) => {
      rig.root.removeFromParent();
      if (rig.fallback) rig.fallback.visible = true;
    });
    state.rigs.clear();
    updateRigReadiness(sceneController);
    console.warn("Fruit Bell rigged avatar pilots could not load; using procedural fallbacks.", error);
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

  FruitBellScene.prototype.configurePlayers = function configurePlayersWithRiggedPilots(players) {
    clearRiggedAvatars(this);
    const result = originalConfigurePlayers.call(this, players);
    mountPilotRigs(this, players);
    return result;
  };

  FruitBellScene.prototype.playOpponentFlip = function playOpponentFlipWithRiggedPilot(playerId, card, callbacks) {
    const result = originalPlayOpponentFlip.call(this, playerId, card, callbacks);
    triggerRiggedReaction(this, playerId, "flip", true);
    return result;
  };

  FruitBellScene.prototype.playOpponentBell = function playOpponentBellWithRiggedPilot(playerId, correct) {
    const previousShake = this.shake;
    const result = originalPlayOpponentBell.call(this, playerId, correct);
    const rigged = triggerRiggedReaction(this, playerId, "bell", correct);
    if (rigged) this.shake = previousShake;
    return result;
  };
}