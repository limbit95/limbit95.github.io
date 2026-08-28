import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";
import { FRUITS } from "./gameEngine.js";
import { createAnimalAvatar, getAnimalProfile, updateAvatarIdle } from "./avatarFactory.js";

const FRUIT_MAP = new Map(FRUITS.map((fruit) => [fruit.id, fruit]));
const CARD_POSITIONS = [
  { deck: new THREE.Vector3(1.05, 1.13, 3.15), face: new THREE.Vector3(-0.7, 1.16, 2.22), rotation: 0 },
  { deck: new THREE.Vector3(0.95, 1.13, -2.78), face: new THREE.Vector3(-0.65, 1.16, -1.78), rotation: Math.PI },
  { deck: new THREE.Vector3(-3.25, 1.13, 0.55), face: new THREE.Vector3(-2.18, 1.16, -0.38), rotation: -Math.PI / 2 },
  { deck: new THREE.Vector3(3.25, 1.13, 0.55), face: new THREE.Vector3(2.18, 1.16, -0.38), rotation: Math.PI / 2 },
];

const AVATAR_SEATS = [
  { position: [0, 0.83, -4.15], rotation: 0 },
  { position: [-4.15, 0.83, -0.35], rotation: Math.PI / 2 },
  { position: [4.15, 0.83, -0.35], rotation: -Math.PI / 2 },
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

function createFruitCard(card) {
  const group = createCardBase(false);
  const fruit = FRUIT_MAP.get(card.fruit) || FRUITS[0];
  fruitLayout(card.count).forEach(([x, z]) => {
    const token = makeMesh(new THREE.SphereGeometry(0.13, 14, 9), fruit.color);
    token.scale.set(1, 0.22, 1);
    token.position.set(x, 0.08, z);
    group.add(token);
    if (card.fruit === "banana") {
      token.scale.set(1.35, 0.18, 0.65);
      token.rotation.y = 0.55;
    }
  });
  return group;
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
    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 50);
    this.camera.position.set(0, 3.25, 7.45);
    this.baseCameraPosition = this.camera.position.clone();
    this.camera.lookAt(0, 1.15, 0.2);
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.lookOffset = new THREE.Vector2();
    this.targetLookOffset = new THREE.Vector2();
    this.avatarMap = new Map();
    this.visibleCards = new Map();
    this.cardFlights = [];
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

    const table = makeMesh(new THREE.BoxGeometry(9.25, 0.55, 6.25), 0x5f4030);
    table.position.y = 0.78;
    table.geometry.translate(0, 0, 0);
    this.scene.add(table);
    const felt = makeMesh(new THREE.BoxGeometry(8.75, 0.09, 5.75), 0x274f49);
    felt.position.y = 1.1;
    this.scene.add(felt);
    const rimTop = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.035, 8, 64), makeMaterial(0xd0a967, { roughness: 0.45, metalness: 0.5 }));
    rimTop.rotation.x = Math.PI / 2;
    rimTop.scale.x = 1.35;
    rimTop.position.y = 1.17;
    this.scene.add(rimTop);

    const bellBase = makeMesh(new THREE.CylinderGeometry(0.58, 0.72, 0.18, 32), 0x30343a, { roughness: 0.45, metalness: 0.65 });
    bellBase.position.set(0, 1.24, 0);
    this.bellTop = makeMesh(new THREE.SphereGeometry(0.48, 28, 18), 0xe8b84e, { roughness: 0.28, metalness: 0.82 });
    this.bellTop.scale.set(1.08, 0.62, 1.08);
    this.bellTop.position.set(0, 1.57, 0);
    const button = makeMesh(new THREE.CylinderGeometry(0.1, 0.14, 0.18, 18), 0xefe1b0, { roughness: 0.3, metalness: 0.7 });
    button.position.set(0, 1.96, 0);
    this.scene.add(bellBase, this.bellTop, button);

    CARD_POSITIONS.forEach((seat, index) => {
      const deck = createCardBase(true);
      deck.position.copy(seat.deck);
      deck.rotation.y = seat.rotation;
      this.scene.add(deck);
      if (index === 0) {
        this.localDeck = deck;
        this.localDeckHitTarget = deck.children[0];
      }
    });
  }

  configurePlayers(players) {
    this.players = players;
    this.avatarMap.forEach((avatar) => this.scene.remove(avatar.group));
    this.avatarMap.clear();
    this.visibleCards.forEach((card) => this.scene.remove(card));
    this.visibleCards.clear();

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
    this.rightHand.position.set(1.55, 1.78, 5.28);
    this.rightHand.rotation.y = -0.15;
    this.scene.add(this.rightHand);

    this.leftElbow = new THREE.Group();
    const elbowArm = makeMesh(new THREE.CylinderGeometry(0.19, 0.24, 1.45, 14), localProfile.body);
    elbowArm.rotation.z = -0.92;
    elbowArm.rotation.x = 0.28;
    this.leftElbow.add(elbowArm);
    this.leftElbow.position.set(-2.38, 2.35, 5.68);
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
    if (!this.localDeckHitTarget) return false;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster.intersectObject(this.localDeckHitTarget, false).length > 0;
  }

  previewLocalFlip(progress) {
    if (!this.rightHand || this.rightHandAction) return;
    const amount = THREE.MathUtils.clamp(progress, 0, 1);
    this.rightHand.position.lerpVectors(new THREE.Vector3(1.55, 1.78, 5.28), new THREE.Vector3(1.03, 1.48, 3.55), amount * 0.7);
    this.rightHand.rotation.x = -amount * 0.25;
  }

  resetLocalFlipPreview() {
    if (!this.rightHand || this.rightHandAction) return;
    this.rightHand.position.set(1.55, 1.78, 5.28);
    this.rightHand.rotation.x = 0;
  }

  playLocalFlip(card, onReveal) {
    this.rightHandAction = { start: performance.now(), duration: 620 };
    this.#launchCardFlight(0, card, 610, onReveal);
  }

  playOpponentFlip(playerId, card, onReveal) {
    const index = this.players.findIndex((player) => player.id === playerId);
    const avatar = this.avatarMap.get(playerId);
    if (index < 1 || !avatar) return;
    this.avatarActions.push({ avatar, type: "flip", start: performance.now(), duration: 640 });
    this.#launchCardFlight(index, card, 610, onReveal);
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
      this.scene.add(card);
      this.visibleCards.set(player.id, card);
    });
  }

  pulseBell() {
    this.shake = Math.max(this.shake, 0.12);
  }

  destroy() {
    this.renderer.setAnimationLoop(null);
    this.resizeObserver?.disconnect();
    this.renderer.dispose();
  }

  #launchCardFlight(playerIndex, card, duration, onReveal) {
    const seat = CARD_POSITIONS[playerIndex];
    const flying = createFruitCard(card);
    flying.position.copy(seat.deck);
    flying.rotation.y = seat.rotation;
    flying.rotation.x = Math.PI;
    this.scene.add(flying);
    this.cardFlights.push({
      mesh: flying,
      from: seat.deck.clone(),
      to: seat.face.clone(),
      rotation: seat.rotation,
      start: performance.now(),
      duration,
      revealed: false,
      onReveal,
    });
  }

  #renderFrame() {
    const elapsed = this.clock.getElapsedTime();
    const now = performance.now();
    this.lookOffset.lerp(this.targetLookOffset, 0.055);
    const shakeX = (Math.random() - 0.5) * this.shake;
    const shakeY = (Math.random() - 0.5) * this.shake * 0.5;
    this.camera.position.set(
      this.baseCameraPosition.x + this.lookOffset.x * 0.22 + shakeX,
      this.baseCameraPosition.y - this.lookOffset.y * 0.12 + shakeY,
      this.baseCameraPosition.z,
    );
    this.camera.lookAt(this.lookOffset.x * 0.7, 1.25 - this.lookOffset.y * 0.22, 0.15);
    this.shake *= 0.86;

    this.avatarMap.forEach((avatar) => updateAvatarIdle(avatar, elapsed));
    this.#updateCardFlights(now);
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
      if (!flight.revealed && t >= 0.52) {
        flight.revealed = true;
        flight.onReveal?.();
      }
      if (t >= 1) {
        this.scene.remove(flight.mesh);
        return false;
      }
      return true;
    });
  }

  #updateRightHand(now) {
    if (!this.rightHand || !this.rightHandAction) return;
    const t = THREE.MathUtils.clamp((now - this.rightHandAction.start) / this.rightHandAction.duration, 0, 1);
    const rest = new THREE.Vector3(1.55, 1.78, 5.28);
    const deck = new THREE.Vector3(1.03, 1.42, 3.42);
    const lift = new THREE.Vector3(0.75, 2.08, 2.85);
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
    const start = new THREE.Vector3(-2.45, 2.72, 5.2);
    const hit = new THREE.Vector3(-0.08, 1.95, 0.3);
    if (t < 0.34) {
      this.leftStrike.visible = true;
      this.leftStrike.position.copy(lerpVector(start, hit, easeOutCubic(t / 0.34)));
      this.leftStrike.rotation.x = -1.1 * (t / 0.34);
    } else if (t < 0.52) {
      this.leftStrike.position.copy(hit);
      this.leftStrike.position.y -= Math.sin(((t - 0.34) / 0.18) * Math.PI) * 0.18;
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
