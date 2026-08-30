import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";
import { FRUITS } from "./gameEngine.js";
import { createAnimalAvatar, getAnimalProfile, updateAvatarIdle } from "./avatarFactory.js";
import { CARD_FLIP_DURATION_MS, CARD_REVEAL_PROGRESS } from "./revealTiming.js";

export const FRUIT_BELL_LAYOUT = Object.freeze({
  tableWidth: 4.9,
  tableDepth: 4.15,
  feltInset: 0.24,
  avatarClearance: 0.48,
  surfaceY: 1.145,
});

const FRUIT_MAP = new Map(FRUITS.map((fruit) => [fruit.id, fruit]));
const TABLE_SURFACE_Y = FRUIT_BELL_LAYOUT.surfaceY;
const CARD_THICKNESS = 0.026;
const CARD_POSITIONS = [
  { deck: new THREE.Vector3(0.72, TABLE_SURFACE_Y, 1.35), face: new THREE.Vector3(-0.55, 1.16, 0.95), rotation: 0 },
  { deck: new THREE.Vector3(0.72, TABLE_SURFACE_Y, -1.35), face: new THREE.Vector3(-0.55, 1.16, -0.95), rotation: Math.PI },
  { deck: new THREE.Vector3(-1.75, TABLE_SURFACE_Y, 0.4), face: new THREE.Vector3(-1.2, 1.16, -0.32), rotation: -Math.PI / 2 },
  { deck: new THREE.Vector3(1.75, TABLE_SURFACE_Y, 0.4), face: new THREE.Vector3(1.2, 1.16, -0.32), rotation: Math.PI / 2 },
];

const AVATAR_SEATS = [
  { position: [0, 0.83, -2.72], rotation: 0 },
  { position: [-3.05, 0.83, -0.2], rotation: Math.PI / 2 },
  { position: [3.05, 0.83, -0.2], rotation: -Math.PI / 2 },
];

function easeOutCubic(value) {
  return 1 - ((1 - value) ** 3);
}

function easeInOut(value) {
  return value < 0.5 ? 2 * value * value : 1 - ((-2 * value + 2) ** 2) / 2;
}

function lerpVector(from, to, amount) {
  return new THREE.Vector3().lerpVectors(from, to, amount);
}

function makeMaterial(color, { roughness = 0.72, metalness = 0.02 } = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function makeMesh(geometry, color, options) {
  const item = new THREE.Mesh(geometry, makeMaterial(color, options));
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
}

function createCardBase(back = false) {
  const group = new THREE.Group();
  const card = makeMesh(new THREE.BoxGeometry(0.92, 0.075, 1.28), back ? 0x294552 : 0xf9f5e9);
  group.add(card);
  if (back) {
    const inset = makeMesh(new THREE.BoxGeometry(0.7, 0.018, 1.04), 0xd9664a);
    inset.position.y = 0.047;
    group.add(inset);
  }
  return group;
}

function createDeckStack() {
  const group = new THREE.Group();
  const core = makeMesh(new THREE.BoxGeometry(0.92, 1, 1.28), 0x294552);
  const inset = makeMesh(new THREE.BoxGeometry(0.7, 0.018, 1.04), 0xd9664a);
  group.add(core, inset);
  group.userData.core = core;
  group.userData.inset = inset;
  group.userData.count = 0;
  return group;
}

function setDeckStackCount(group, count) {
  if (!group) return;
  const safeCount = Math.max(0, Number(count) || 0);
  const core = group.userData.core;
  const inset = group.userData.inset;
  const height = Math.max(CARD_THICKNESS, safeCount * CARD_THICKNESS);
  group.userData.count = safeCount;
  group.visible = safeCount > 0;
  core.scale.y = height;
  core.position.y = height / 2;
  inset.position.y = height + 0.01;
}

function fruitLayout(count) {
  const layouts = {
    1: [[0, 0]],
    2: [[-0.22, -0.24], [0.22, 0.24]],
    3: [[-0.24, -0.32], [0.24, -0.32], [0, 0.28]],
    4: [[-0.23, -0.31], [0.23, -0.31], [-0.23, 0.31], [0.23, 0.31]],
    5: [[-0.25, -0.34], [0.25, -0.34], [0, 0], [-0.25, 0.34], [0.25, 0.34]],
  };
  return layouts[count] || layouts[1];
}

function createFruitCard(card, { faceVisible = true } = {}) {
  const group = createCardBase(false);
  const fruit = FRUIT_MAP.get(card.fruit) || FRUITS[0];
  const tokens = [];
  fruitLayout(card.count).forEach(([x, z]) => {
    const token = makeMesh(new THREE.SphereGeometry(0.13, 14, 9), fruit.color);
    token.scale.set(1, 0.22, 1);
    token.position.set(x, 0.08, z);
    token.visible = faceVisible;
    tokens.push(token);
    group.add(token);
    if (card.fruit === "banana") {
      token.scale.set(1.35, 0.18, 0.65);
      token.rotation.y = 0.55;
    }
  });
  group.userData.faceTokens = tokens;
  return group;
}

function setFruitCardFaceVisible(card, visible) {
  card?.userData?.faceTokens?.forEach((token) => {
    token.visible = visible;
  });
}

function createViewArm(profile, side) {
  const group = new THREE.Group();
  const forearm = makeMesh(new THREE.CylinderGeometry(0.16, 0.21, 1.55, 14), profile.body);
  forearm.rotation.x = Math.PI / 2;
  forearm.position.z = 0.78;
  const paw = makeMesh(new THREE.SphereGeometry(0.25, 16, 11), profile.body);
  paw.scale.set(1.05, 0.78, 1.2);
  paw.position.z = -0.02;
  group.add(forearm, paw);
  group.userData.paw = paw;
  group.rotation.z = side * 0.08;
  return group;
}

export class FruitBellScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x152128);
    this.scene.fog = new THREE.Fog(0x152128, 11, 24);
    this.camera = new THREE.PerspectiveCamera(49, 1, 0.1, 50);
    this.camera.position.set(0, 4.7, 5.95);
    this.baseCameraPosition = this.camera.position.clone();
    this.camera.lookAt(0, 1.05, 0.2);
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.lookOffset = new THREE.Vector2();
    this.targetLookOffset = new THREE.Vector2();
    this.avatarMap = new Map();
    this.deckMap = new Map();
    this.visibleCards = new Map();
    this.cardFlights = [];
    this.collectionFlights = [];
    this.collectionCompletion = null;
    this.avatarActions = [];
    this.rightHandAction = null;
    this.leftHandAction = null;
    this.shake = 0;
    this.localDeck = null;
    this.localDeckHitTarget = null;
    this.rightHand = null;
    this.leftElbow = null;
    this.leftStrike = null;
    this.bellTop = null;
    this.players = [];
    this.clock = new THREE.Clock();
    this.#buildWorld();
    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.renderer.setAnimationLoop(() => this.#renderFrame());
  }

  #buildWorld() {
    const hemi = new THREE.HemisphereLight(0xfff1d4, 0x17242b, 2.3);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffe6bd, 4.1);
    key.position.set(-4, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -9;
    key.shadow.camera.right = 9;
    key.shadow.camera.top = 8;
    key.shadow.camera.bottom = -8;
    this.scene.add(key);
    const rim = new THREE.PointLight(0x7ac8d8, 25, 14, 2);
    rim.position.set(4, 5, -5);
    this.scene.add(rim);

    const floor = makeMesh(new THREE.CircleGeometry(15, 64), 0x202e34);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.scene.add(floor);

    const table = makeMesh(new THREE.BoxGeometry(FRUIT_BELL_LAYOUT.tableWidth, 0.55, FRUIT_BELL_LAYOUT.tableDepth), 0x5f4030);
    table.position.y = 0.78;
    this.scene.add(table);
    const felt = makeMesh(new THREE.BoxGeometry(
      FRUIT_BELL_LAYOUT.tableWidth - FRUIT_BELL_LAYOUT.feltInset * 2,
      0.09,
      FRUIT_BELL_LAYOUT.tableDepth - FRUIT_BELL_LAYOUT.feltInset * 2,
    ), 0x274f49);
    felt.position.y = 1.1;
    this.scene.add(felt);
    const rimTop = new THREE.Mesh(new THREE.TorusGeometry(1.68, 0.035, 8, 64), makeMaterial(0xd0a967, { roughness: 0.45, metalness: 0.5 }));
    rimTop.rotation.x = Math.PI / 2;
    rimTop.scale.x = 1.28;
    rimTop.position.y = 1.17;
    this.scene.add(rimTop);

    const bellBase = makeMesh(new THREE.CylinderGeometry(0.46, 0.57, 0.15, 32), 0x30343a, { roughness: 0.45, metalness: 0.65 });
    bellBase.position.set(0, 1.22, 0);
    this.bellTop = makeMesh(new THREE.SphereGeometry(0.37, 28, 18), 0xe8b84e, { roughness: 0.28, metalness: 0.82 });
    this.bellTop.scale.set(1.08, 0.62, 1.08);
    this.bellTop.position.set(0, 1.47, 0);
    const button = makeMesh(new THREE.CylinderGeometry(0.075, 0.105, 0.14, 18), 0xefe1b0, { roughness: 0.3, metalness: 0.7 });
    button.position.set(0, 1.77, 0);
    this.scene.add(bellBase, this.bellTop, button);
  }

  configurePlayers(players) {
    this.players = players;
    this.avatarMap.forEach((avatar) => this.scene.remove(avatar.group));
    this.avatarMap.clear();
    this.deckMap.forEach((deck) => this.scene.remove(deck));
    this.deckMap.clear();
    this.visibleCards.forEach((card) => this.scene.remove(card));
    this.visibleCards.clear();

    players.forEach((player, index) => {
      const seat = CARD_POSITIONS[index];
      const deck = createDeckStack();
      deck.position.copy(seat.deck);
      deck.rotation.y = seat.rotation;
      this.scene.add(deck);
      this.deckMap.set(player.id, deck);
      if (index === 0) {
        this.localDeck = deck;
        this.localDeckHitTarget = deck.userData.core;
      }
    });

    players.slice(1, 4).forEach((player, index) => {
      const avatar = createAnimalAvatar(player.animalId);
      const seat = AVATAR_SEATS[index];
      avatar.group.position.set(...seat.position);
      avatar.group.rotation.y = seat.rotation;
      this.scene.add(avatar.group);
      this.avatarMap.set(player.id, avatar);
    });

    const localProfile = getAnimalProfile(players[0]?.animalId || "fox");
    if (this.rightHand) this.scene.remove(this.rightHand);
    if (this.leftElbow) this.scene.remove(this.leftElbow);
    if (this.leftStrike) this.scene.remove(this.leftStrike);

    this.rightHand = createViewArm(localProfile, 1);
    this.rightHand.position.set(1.35, 1.78, 4.35);
    this.rightHand.rotation.y = -0.15;
    this.scene.add(this.rightHand);

    this.leftElbow = new THREE.Group();
    const elbowArm = makeMesh(new THREE.CylinderGeometry(0.19, 0.24, 1.45, 14), localProfile.body);
    elbowArm.rotation.z = -0.92;
    elbowArm.rotation.x = 0.28;
    this.leftElbow.add(elbowArm);
    this.leftElbow.position.set(-2.0, 2.35, 4.62);
    this.scene.add(this.leftElbow);

    this.leftStrike = createViewArm(localProfile, -1);
    this.leftStrike.visible = false;
    this.scene.add(this.leftStrike);
  }

  resize() {
    const host = this.canvas.parentElement;
    const width = Math.max(320, host.clientWidth || 960);
    const height = Math.max(420, host.clientHeight || 640);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  setLookOffset(x, y) {
    this.targetLookOffset.set(THREE.MathUtils.clamp(x, -1, 1), THREE.MathUtils.clamp(y, -1, 1));
  }

  isPointerOverLocalDeck(clientX, clientY) {
    if (!this.localDeckHitTarget || !this.localDeck?.visible) return false;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster.intersectObject(this.localDeckHitTarget, false).length > 0;
  }

  previewLocalFlip(progress) {
    if (!this.rightHand || this.rightHandAction) return;
    const amount = THREE.MathUtils.clamp(progress, 0, 1);
    this.rightHand.position.lerpVectors(new THREE.Vector3(1.35, 1.78, 4.35), new THREE.Vector3(0.74, 1.48, 1.62), amount * 0.7);
    this.rightHand.rotation.x = -amount * 0.25;
  }

  resetLocalFlipPreview() {
    if (!this.rightHand || this.rightHandAction) return;
    this.rightHand.position.set(1.35, 1.78, 4.35);
    this.rightHand.rotation.x = 0;
  }

  syncDeckCounts(snapshot) {
    snapshot.players.forEach((player) => {
      setDeckStackCount(this.deckMap.get(player.id), player.drawCount);
    });
  }

  playLocalFlip(card, callbacks = {}) {
    this.rightHandAction = { start: performance.now(), duration: CARD_FLIP_DURATION_MS };
    this.#launchCardFlight(0, card, callbacks);
  }

  playOpponentFlip(playerId, card, callbacks = {}) {
    const index = this.players.findIndex((player) => player.id === playerId);
    const avatar = this.avatarMap.get(playerId);
    if (index < 1 || !avatar) return;
    this.avatarActions.push({ avatar, type: "flip", start: performance.now(), duration: 640 });
    this.#launchCardFlight(index, card, callbacks);
  }

  playLocalBell(correct) {
    this.leftHandAction = { start: performance.now(), duration: 520, correct };
    this.shake = 0.18;
  }

  playOpponentBell(playerId, correct) {
    const avatar = this.avatarMap.get(playerId);
    if (!avatar) return;
    this.avatarActions.push({ avatar, type: "bell", start: performance.now(), duration: 640, correct });
    this.shake = Math.max(this.shake, 0.08);
  }

  syncSnapshot(snapshot) {
    this.syncDeckCounts(snapshot);
    snapshot.players.forEach((player, index) => {
      const previous = this.visibleCards.get(player.id);
      if (previous) {
        this.scene.remove(previous);
        this.visibleCards.delete(player.id);
      }
      if (!player.visibleCard) return;
      const card = createFruitCard(player.visibleCard);
      const seat = CARD_POSITIONS[index];
      card.position.copy(seat.face);
      card.rotation.y = seat.rotation;
      card.position.y += Math.min(player.faceUpCount, 16) * 0.004;
      this.scene.add(card);
      this.visibleCards.set(player.id, card);
    });
  }

  playCollectionToWinner(beforeSnapshot, afterSnapshot, winnerId, onComplete) {
    const begin = () => {
      if (this.cardFlights.length) {
        requestAnimationFrame(begin);
        return;
      }
      this.#startCollectionFlights(beforeSnapshot, afterSnapshot, winnerId, onComplete);
    };
    begin();
  }

  pulseBell() {
    this.shake = Math.max(this.shake, 0.12);
  }

  destroy() {
    this.renderer.setAnimationLoop(null);
    this.resizeObserver?.disconnect();
    this.renderer.dispose();
  }

  #launchCardFlight(playerIndex, card, { revealAt = null, onReveal = null, onSettled = null } = {}) {
    const seat = CARD_POSITIONS[playerIndex];
    const start = performance.now();
    const flying = createFruitCard(card, { faceVisible: false });
    flying.position.copy(seat.deck);
    const deck = this.players[playerIndex] ? this.deckMap.get(this.players[playerIndex].id) : null;
    if (deck?.visible) flying.position.y += Math.max(CARD_THICKNESS, deck.userData.count * CARD_THICKNESS);
    flying.rotation.y = seat.rotation;
    flying.rotation.x = Math.PI;
    this.scene.add(flying);
    this.cardFlights.push({
      mesh: flying,
      from: flying.position.clone(),
      to: seat.face.clone(),
      rotation: seat.rotation,
      start,
      duration: CARD_FLIP_DURATION_MS,
      revealAt: Number.isFinite(revealAt) ? revealAt : start + CARD_FLIP_DURATION_MS * CARD_REVEAL_PROGRESS,
      revealed: false,
      onReveal,
      onSettled,
    });
  }

  #startCollectionFlights(beforeSnapshot, afterSnapshot, winnerId, onComplete) {
    if (this.collectionFlights.length) return;
    const winnerIndex = afterSnapshot.players.findIndex((player) => player.id === winnerId);
    if (winnerIndex < 0) {
      onComplete?.();
      return;
    }

    this.visibleCards.forEach((card) => this.scene.remove(card));
    this.visibleCards.clear();
    this.syncDeckCounts(beforeSnapshot);

    const winnerDeck = this.deckMap.get(winnerId);
    const winnerBefore = beforeSnapshot.players.find((player) => player.id === winnerId)?.drawCount || 0;
    let landed = 0;
    const total = beforeSnapshot.players.reduce((sum, player) => sum + player.faceUpCount, 0);
    if (!total) {
      this.syncSnapshot(afterSnapshot);
      onComplete?.();
      return;
    }

    const now = performance.now();
    let sequence = 0;
    beforeSnapshot.players.forEach((player, playerIndex) => {
      const source = CARD_POSITIONS[playerIndex].face;
      for (let cardIndex = 0; cardIndex < player.faceUpCount; cardIndex += 1) {
        const mesh = createCardBase(true);
        const spread = (cardIndex - (player.faceUpCount - 1) / 2) * 0.008;
        mesh.position.copy(source).add(new THREE.Vector3(spread, 0.03 + cardIndex * 0.006, spread));
        mesh.rotation.y = CARD_POSITIONS[playerIndex].rotation;
        this.scene.add(mesh);

        const startDelay = sequence * Math.max(10, Math.min(24, 420 / Math.max(1, total)));
        this.collectionFlights.push({
          mesh,
          from: mesh.position.clone(),
          winnerId,
          winnerIndex,
          start: now + startDelay,
          duration: 520 + (sequence % 4) * 35,
          lane: ((sequence % 5) - 2) * 0.08,
          onLand: () => {
            landed += 1;
            setDeckStackCount(winnerDeck, winnerBefore + landed);
          },
        });
        sequence += 1;
      }
    });

    this.collectionCompletion = {
      afterSnapshot,
      onComplete,
      total,
      finished: 0,
    };
  }

  #deckTopPosition(playerIndex, extraCount = 0) {
    const player = this.players[playerIndex];
    const deck = player ? this.deckMap.get(player.id) : null;
    const count = (deck?.userData?.count || 0) + extraCount;
    const base = CARD_POSITIONS[playerIndex].deck.clone();
    base.y += Math.max(CARD_THICKNESS, count * CARD_THICKNESS) + 0.05;
    return base;
  }

  #renderFrame() {
    const elapsed = this.clock.getElapsedTime();
    const now = performance.now();
    this.lookOffset.lerp(this.targetLookOffset, 0.055);
    const shakeX = (Math.random() - 0.5) * this.shake;
    const shakeY = (Math.random() - 0.5) * this.shake * 0.5;
    this.camera.position.set(
      this.baseCameraPosition.x + this.lookOffset.x * 0.25 + shakeX,
      this.baseCameraPosition.y - this.lookOffset.y * 0.14 + shakeY,
      this.baseCameraPosition.z,
    );
    this.camera.lookAt(this.lookOffset.x * 0.88, 1.02 - this.lookOffset.y * 0.3, 0.08);
    this.shake *= 0.86;

    this.avatarMap.forEach((avatar) => updateAvatarIdle(avatar, elapsed));
    this.#updateCardFlights(now);
    this.#updateCollectionFlights(now);
    this.#updateRightHand(now);
    this.#updateLeftHand(now);
    this.#updateAvatarActions(now);

    if (this.bellTop) {
      const bellPulse = Math.max(0, this.shake * 2.1);
      this.bellTop.rotation.z = Math.sin(now * 0.05) * bellPulse;
    }
    this.renderer.render(this.scene, this.camera);
  }

  #updateCardFlights(now) {
    this.cardFlights = this.cardFlights.filter((flight) => {
      const raw = (now - flight.start) / flight.duration;
      const t = THREE.MathUtils.clamp(raw, 0, 1);
      const eased = easeInOut(t);
      flight.mesh.position.copy(lerpVector(flight.from, flight.to, eased));
      flight.mesh.position.y += Math.sin(Math.PI * t) * 0.72;
      flight.mesh.rotation.y = flight.rotation;
      flight.mesh.rotation.x = Math.PI * (1 - eased);
      if (!flight.revealed && now >= flight.revealAt) {
        flight.revealed = true;
        setFruitCardFaceVisible(flight.mesh, true);
        flight.onReveal?.();
      }
      if (t >= 1) {
        this.scene.remove(flight.mesh);
        flight.onSettled?.();
        return false;
      }
      return true;
    });
  }

  #updateCollectionFlights(now) {
    if (!this.collectionFlights.length) return;
    this.collectionFlights = this.collectionFlights.filter((flight) => {
      if (now < flight.start) return true;
      const t = THREE.MathUtils.clamp((now - flight.start) / flight.duration, 0, 1);
      const eased = easeInOut(t);
      const target = this.#deckTopPosition(flight.winnerIndex);
      flight.mesh.position.copy(lerpVector(flight.from, target, eased));
      flight.mesh.position.y += Math.sin(Math.PI * t) * (0.68 + Math.abs(flight.lane));
      flight.mesh.position.x += Math.sin(Math.PI * t) * flight.lane;
      flight.mesh.rotation.x = Math.sin(Math.PI * t) * 0.26;
      flight.mesh.rotation.y += 0.035;
      flight.mesh.rotation.z = Math.sin(Math.PI * t) * flight.lane * 2.6;
      if (t >= 1) {
        this.scene.remove(flight.mesh);
        flight.onLand?.();
        if (this.collectionCompletion) this.collectionCompletion.finished += 1;
        return false;
      }
      return true;
    });

    if (!this.collectionFlights.length && this.collectionCompletion) {
      const completion = this.collectionCompletion;
      this.collectionCompletion = null;
      this.syncSnapshot(completion.afterSnapshot);
      completion.onComplete?.();
    }
  }

  #updateRightHand(now) {
    if (!this.rightHand || !this.rightHandAction) return;
    const t = THREE.MathUtils.clamp((now - this.rightHandAction.start) / this.rightHandAction.duration, 0, 1);
    const rest = new THREE.Vector3(1.35, 1.78, 4.35);
    const deck = new THREE.Vector3(0.72, 1.42, 1.58);
    const lift = new THREE.Vector3(0.5, 2.08, 0.92);
    if (t < 0.38) {
      this.rightHand.position.copy(lerpVector(rest, deck, easeOutCubic(t / 0.38)));
    } else if (t < 0.68) {
      this.rightHand.position.copy(lerpVector(deck, lift, easeInOut((t - 0.38) / 0.3)));
      this.rightHand.rotation.x = -0.65 * ((t - 0.38) / 0.3);
    } else {
      this.rightHand.position.copy(lerpVector(lift, rest, easeInOut((t - 0.68) / 0.32)));
      this.rightHand.rotation.x = -0.65 * (1 - ((t - 0.68) / 0.32));
    }
    if (t >= 1) {
      this.rightHand.position.copy(rest);
      this.rightHand.rotation.x = 0;
      this.rightHandAction = null;
    }
  }

  #updateLeftHand(now) {
    if (!this.leftStrike || !this.leftHandAction) return;
    const t = THREE.MathUtils.clamp((now - this.leftHandAction.start) / this.leftHandAction.duration, 0, 1);
    const start = new THREE.Vector3(-2.0, 2.72, 4.25);
    const hit = new THREE.Vector3(-0.08, 1.78, 0.25);
    if (t < 0.34) {
      this.leftStrike.visible = true;
      this.leftStrike.position.copy(lerpVector(start, hit, easeOutCubic(t / 0.34)));
      this.leftStrike.rotation.x = -1.1 * (t / 0.34);
    } else if (t < 0.52) {
      this.leftStrike.position.copy(hit);
      this.leftStrike.position.y -= Math.sin(((t - 0.34) / 0.18) * Math.PI) * 0.15;
    } else {
      this.leftStrike.position.copy(lerpVector(hit, start, easeInOut((t - 0.52) / 0.48)));
    }
    if (t >= 1) {
      this.leftStrike.visible = false;
      this.leftHandAction = null;
    }
  }

  #updateAvatarActions(now) {
    this.avatarActions = this.avatarActions.filter((action) => {
      const t = THREE.MathUtils.clamp((now - action.start) / action.duration, 0, 1);
      const arm = action.type === "bell" ? action.avatar.leftArm : action.avatar.rightArm;
      action.avatar.action = action.type;
      if (t < 0.42) {
        arm.rotation.x = THREE.MathUtils.lerp(-0.42, -1.5, easeOutCubic(t / 0.42));
        action.avatar.headPivot.rotation.x = THREE.MathUtils.lerp(0, -0.16, t / 0.42);
      } else {
        arm.rotation.x = THREE.MathUtils.lerp(-1.5, -0.42, easeInOut((t - 0.42) / 0.58));
        action.avatar.headPivot.rotation.x = THREE.MathUtils.lerp(-0.16, action.correct === false ? 0.15 : 0, (t - 0.42) / 0.58);
      }
      if (action.type === "bell" && t > 0.3 && t < 0.42) this.shake = Math.max(this.shake, 0.045);
      if (t >= 1) {
        action.avatar.action = null;
        arm.rotation.x = -0.42;
        return false;
      }
      return true;
    });
  }
}
