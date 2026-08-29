import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const CAMERA_PROFILE = Object.freeze({
  horizontalLook: 1.55,
  verticalLook: 1.3,
});

function easeOutCubic(value) {
  return 1 - ((1 - value) ** 3);
}

function easeInOut(value) {
  return value < 0.5 ? 2 * value * value : 1 - ((-2 * value + 2) ** 2) / 2;
}

export class FruitBellPresentationController {
  constructor(scene) {
    this.scene = scene;
    this.localBridge = null;
    this.localBridgeFrame = 0;
    this.opponentFrames = new Map();
    this.#installCameraTuning();
    this.#installBellPresentation();
  }

  #installCameraTuning() {
    this.scene.setLookOffset = (x, y) => {
      this.scene.targetLookOffset.set(
        THREE.MathUtils.clamp(x * CAMERA_PROFILE.horizontalLook, -CAMERA_PROFILE.horizontalLook, CAMERA_PROFILE.horizontalLook),
        THREE.MathUtils.clamp(y * CAMERA_PROFILE.verticalLook, -CAMERA_PROFILE.verticalLook, CAMERA_PROFILE.verticalLook),
      );
    };
  }

  #installBellPresentation() {
    const originalLocalBell = this.scene.playLocalBell.bind(this.scene);
    const originalOpponentBell = this.scene.playOpponentBell.bind(this.scene);

    this.scene.playLocalBell = (correct) => {
      originalLocalBell(correct);
      this.#animateLocalReach();
    };

    this.scene.playOpponentBell = (playerId, correct) => {
      originalOpponentBell(playerId, correct);
      this.#animateOpponentReach(playerId);
    };
  }

  #ensureLocalBridge() {
    if (this.localBridge) return this.localBridge;
    const paw = this.scene.leftStrike?.userData?.paw;
    const color = paw?.material?.color?.getHex?.() ?? 0xd8753f;
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.76, metalness: 0.02 });
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 1, 14), material);
    bridge.castShadow = true;
    bridge.receiveShadow = true;
    bridge.visible = false;
    this.scene.scene.add(bridge);
    this.localBridge = bridge;
    return bridge;
  }

  #animateLocalReach() {
    if (this.localBridgeFrame) cancelAnimationFrame(this.localBridgeFrame);
    const bridge = this.#ensureLocalBridge();
    const start = performance.now();
    const duration = 520;
    const shoulder = new THREE.Vector3(-2.28, 2.62, 6.05);
    const midpoint = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    const tick = (now) => {
      const t = THREE.MathUtils.clamp((now - start) / duration, 0, 1);
      const strike = this.scene.leftStrike;
      if (!strike) return;

      const target = strike.position.clone().add(new THREE.Vector3(0, 0.1, 0.55));
      direction.subVectors(target, shoulder);
      const distance = direction.length();
      midpoint.addVectors(shoulder, target).multiplyScalar(0.5);

      bridge.visible = strike.visible;
      bridge.position.copy(midpoint);
      bridge.scale.set(1, Math.max(0.001, distance), 1);
      bridge.quaternion.setFromUnitVectors(up, direction.normalize());

      if (this.scene.leftElbow) {
        const reach = t < 0.42 ? easeOutCubic(t / 0.42) : 1 - easeInOut((t - 0.42) / 0.58);
        this.scene.leftElbow.position.z = 5.68 - reach * 0.72;
        this.scene.leftElbow.rotation.x = 0.28 - reach * 0.35;
      }

      if (t < 1 && this.scene.leftHandAction) {
        this.localBridgeFrame = requestAnimationFrame(tick);
      } else {
        bridge.visible = false;
        if (this.scene.leftElbow) {
          this.scene.leftElbow.position.z = 5.68;
          this.scene.leftElbow.rotation.x = 0.28;
        }
        this.localBridgeFrame = 0;
      }
    };

    this.localBridgeFrame = requestAnimationFrame(tick);
  }

  #animateOpponentReach(playerId) {
    const avatar = this.scene.avatarMap.get(playerId);
    if (!avatar) return;
    const existing = this.opponentFrames.get(playerId);
    if (existing) cancelAnimationFrame(existing);

    const arm = avatar.leftArm;
    const startPosition = arm.position.clone();
    const startRotationZ = arm.rotation.z;
    const startBodyRotationX = avatar.body.rotation.x;
    const start = performance.now();
    const duration = 640;

    const tick = (now) => {
      const t = THREE.MathUtils.clamp((now - start) / duration, 0, 1);
      const reach = t < 0.42 ? easeOutCubic(t / 0.42) : 1 - easeInOut((t - 0.42) / 0.58);

      arm.position.set(
        startPosition.x,
        startPosition.y - reach * 0.28,
        startPosition.z + reach * 2.25,
      );
      arm.rotation.z = THREE.MathUtils.lerp(startRotationZ, -0.18, reach);
      avatar.body.rotation.x = startBodyRotationX - reach * 0.18;
      avatar.headPivot.rotation.x = -reach * 0.2;

      if (t < 1) {
        const frame = requestAnimationFrame(tick);
        this.opponentFrames.set(playerId, frame);
      } else {
        arm.position.copy(startPosition);
        arm.rotation.z = startRotationZ;
        avatar.body.rotation.x = startBodyRotationX;
        avatar.headPivot.rotation.x = 0;
        this.opponentFrames.delete(playerId);
      }
    };

    const frame = requestAnimationFrame(tick);
    this.opponentFrames.set(playerId, frame);
  }
}
