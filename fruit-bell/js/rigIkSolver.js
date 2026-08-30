import * as THREE from "three";

const IDENTITY_QUATERNION = new THREE.Quaternion();
const jointWorldPosition = new THREE.Vector3();
const effectorWorldPosition = new THREE.Vector3();
const toEffector = new THREE.Vector3();
const toTarget = new THREE.Vector3();
const jointWorldQuaternion = new THREE.Quaternion();
const parentWorldQuaternion = new THREE.Quaternion();
const deltaWorldQuaternion = new THREE.Quaternion();
const desiredWorldQuaternion = new THREE.Quaternion();
const desiredLocalQuaternion = new THREE.Quaternion();
const limitedDeltaQuaternion = new THREE.Quaternion();

function normalizeNodeName(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findNode(root, candidates) {
  if (!root) return null;
  const wanted = candidates.map(normalizeNodeName);
  let partialMatch = null;

  root.traverse((object) => {
    if (partialMatch) return;
    const name = normalizeNodeName(object.name);
    if (!name) return;
    if (wanted.includes(name)) {
      partialMatch = object;
      return;
    }
    if (wanted.some((candidate) => name.includes(candidate))) partialMatch ||= object;
  });

  return partialMatch;
}

export function createArmChain(root, side = "L") {
  const suffix = String(side || "L").toUpperCase() === "R" ? "R" : "L";
  const upperArm = findNode(root, [`UpperArm.${suffix}`, `UpperArm_${suffix}`, `${suffix}_UpperArm`]);
  const lowerArm = findNode(root, [`LowerArm.${suffix}`, `LowerArm_${suffix}`, `${suffix}_LowerArm`]);
  const handAnchor = findNode(root, [
    `Hand.${suffix}`,
    `Wrist.${suffix}`,
    `Middle1.${suffix}`,
    `Index1.${suffix}`,
  ]);

  if (!upperArm || !lowerArm || !handAnchor) return null;
  return {
    joints: [upperArm, lowerArm],
    effector: handAnchor,
  };
}

function clampQuaternionAngle(quaternion, maxAngle) {
  const angle = 2 * Math.acos(THREE.MathUtils.clamp(Math.abs(quaternion.w), -1, 1));
  if (!Number.isFinite(angle) || angle <= maxAngle || angle < 1e-5) return quaternion;
  const ratio = THREE.MathUtils.clamp(maxAngle / angle, 0, 1);
  limitedDeltaQuaternion.identity().slerp(quaternion, ratio);
  return limitedDeltaQuaternion;
}

export function solveCcdChain({
  chain,
  targetWorld,
  weight = 1,
  iterations = 4,
  maxJointStep = Math.PI / 5,
} = {}) {
  if (!chain?.effector || !chain?.joints?.length || !targetWorld) return false;
  const safeWeight = THREE.MathUtils.clamp(weight, 0, 1);
  if (safeWeight <= 0.0001) return false;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    for (let index = chain.joints.length - 1; index >= 0; index -= 1) {
      const joint = chain.joints[index];
      if (!joint?.parent) continue;

      joint.updateWorldMatrix(true, true);
      chain.effector.getWorldPosition(effectorWorldPosition);
      joint.getWorldPosition(jointWorldPosition);

      toEffector.subVectors(effectorWorldPosition, jointWorldPosition);
      toTarget.subVectors(targetWorld, jointWorldPosition);
      if (toEffector.lengthSq() < 1e-8 || toTarget.lengthSq() < 1e-8) continue;

      toEffector.normalize();
      toTarget.normalize();
      deltaWorldQuaternion.setFromUnitVectors(toEffector, toTarget).normalize();
      const limitedDelta = clampQuaternionAngle(deltaWorldQuaternion, maxJointStep);

      joint.getWorldQuaternion(jointWorldQuaternion);
      joint.parent.getWorldQuaternion(parentWorldQuaternion);
      desiredWorldQuaternion.copy(limitedDelta).multiply(jointWorldQuaternion);
      desiredLocalQuaternion
        .copy(parentWorldQuaternion)
        .invert()
        .multiply(desiredWorldQuaternion)
        .normalize();

      joint.quaternion.slerp(desiredLocalQuaternion, safeWeight);
      joint.updateMatrixWorld(true);
    }
  }

  return true;
}

export function reachEnvelope(progress, { contactAt = 0.54, releaseAt = 0.78 } = {}) {
  const value = THREE.MathUtils.clamp(progress, 0, 1);
  const smoothstep = (edge0, edge1, current) => {
    if (edge0 === edge1) return current >= edge1 ? 1 : 0;
    const t = THREE.MathUtils.clamp((current - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  if (value <= contactAt) return smoothstep(0, contactAt, value);
  if (value <= releaseAt) return 1;
  return 1 - smoothstep(releaseAt, 1, value);
}

export function getEffectorWorldPosition(chain, target = new THREE.Vector3()) {
  if (!chain?.effector) return null;
  return chain.effector.getWorldPosition(target);
}
