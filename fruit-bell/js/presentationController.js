import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const CAMERA_PROFILE = Object.freeze({
  horizontalLook: 2.7,
  verticalLook: 6.4,
  eyeHeight: 4.15,
  neutralTargetY: 4.15,
  sceneTargetBaseY: 1.02,
  verticalResponse: 0.38,
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
    this.pendingSnapshot = null;
    this.snapshotFrame = 0;
    this.#installCameraTuning();
    this.#installCardPresentation();
    this.#installBellPresentation();
  }

  #installCameraTuning() {
    this.scene.baseCameraPosition.y = CAMERA_PROFILE.eyeHeight;
    this.scene.camera.position.y = CAMERA_PROFILE.eyeHeight;

    const originalLookAt = this.scene.camera.lookAt.bind(this.scene.camera);
    this.scene.camera.lookAt = (x, y, z) => {
      if (x?.isVector3) return originalLookAt(x);
      const adjustedY = CAMERA_PROFILE.neutralTargetY + (y - CAMERA_PROFILE.sceneTargetBaseY);
      return originalLookAt(x, adjustedY, z);
    };
    originalLookAt(0, CAMERA_PROFILE.neutralTargetY, 0.08);

    this.scene.setLookOffset = (x, y) => {
      const targetX = THREE.MathUtils.clamp(
        x * CAMERA_PROFILE.horizontalLook,
        -CAMERA_PROFILE.horizontalLook,
        CAMERA_PROFILE.horizontalLook,
      );
      const targetY = THREE.MathUtils.clamp(
        y * CAMERA_PROFILE.verticalLook,
        -CAMERA_PROFILE.verticalLook,
        CAMERA_PROFILE.verticalLook,
      );
      this.scene.targetLookOffset.set(targetX, targetY);
      this.scene.lookOffset.y = THREE.MathUtils.lerp(
        this.scene.lookOffset.y,
        targetY,
        CAMERA_PROFILE.verticalResponse,
      );
    };
  }

  #installCardPresentation() {
    const originalSyncSnapshot = this.scene.syncSnapshot.bind(this.scene);

    this.scene.syncSnapshot = (snapshot) => {
      if (!this.scene.cardFlights.length && !this.scene.collectionFlights.length) {
        originalSyncSnapshot(snapshot);
        return;
      }

      this.pendingSnapshot = snapshot;
      if (this.snapshotFrame) return;

      const waitForCardsToSettle = () => {
        if (this.scene.cardFlights.length || this.scene.collectionFlights.length) {
          this.snapshotFrame = requestAnimationFrame(waitForCardsToSettle);
          return;
        }

        const pending = this.pendingSnapshot;
        this.pendingSnapshot = null;
        this.snapshotFrame = 0;
        if (pending) originalSyncSnapshot(pending);
      };

      this.snapshotFrame = requestAnimationFrame(waitForCardsToSettle);
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
    const shoulder = new THREE.Vector3(-1.92, 2.62, 4.95);
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
        this.scene.leftElbow.position.z = 4.62 - reach * 0.58;
        this.scene.leftElbow.rotation.x = 0.28 - reach * 0.35;
      }

      if (t < 1 && this.scene.leftHandAction) {
        this.localBridgeFrame = requestAnimationFrame(tick);
      } else {
        bridge.visible = false;
        if (this.scene.leftElbow) {
          this.scene.leftElbow.position.z = 4.62;
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
        startPosition.z + reach * 1.45,
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
