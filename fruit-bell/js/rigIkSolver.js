import * as THREE from "three";

const jointWorldPosition = new THREE.Vector3();
const effectorWorldPosition = new THREE.Vector3();
const chainPointA = new THREE.Vector3();
const chainPointB = new THREE.Vector3();
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
  let match = null;

  root.traverse((object) => {
    if (match) return;
    const name = normalizeNodeName(object.name);
    if (!name) return;
    if (wanted.includes(name) || wanted.some((candidate) => name.includes(candidate))) match = object;
  });

  return match;
}

export function createArmChain(root, side = "L") {
  const suffix = String(side || "L").toUpperCase() === "R" ? "R" : "L";
  const shoulder = findNode(root, [`Shoulder.${suffix}`, `Shoulder_${suffix}`, `${suffix}_Shoulder`]);
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
    joints: [shoulder, upperArm, lowerArm].filter(Boolean),
    effector: handAnchor,
    reachRoot: shoulder || upperArm,
  };
}

function clampQuaternionAngle(quaternion, maxAngle) {
  const angle = 2 * Math.acos(THREE.MathUtils.clamp(Math.abs(quaternion.w), -1, 1));
  if (!Number.isFinite(angle) || angle <= maxAngle || angle < 1e-5) return quaternion;
  const ratio = THREE.MathUtils.clamp(maxAngle / angle, 0, 1);
  limitedDeltaQuaternion.identity().slerp(quaternion, ratio);
  return limitedDeltaQuaternion;
}

export function measureChainReach(chain) {
  if (!chain?.effector || !chain?.joints?.length) return 0;
  const points = [...chain.joints, chain.effector];
  let reach = 0;

  for (let index = 0; index < points.length - 1; index += 1) {
    points[index].getWorldPosition(chainPointA);
    points[index + 1].getWorldPosition(chainPointB);
    reach += chainPointA.distanceTo(chainPointB);
  }

  return reach;
}

export function getReachDeficit(chain, targetWorld, { reachScale = 0.94 } = {}) {
  if (!chain?.reachRoot || !targetWorld) return 0;
  chain.reachRoot.getWorldPosition(chainPointA);
  const availableReach = measureChainReach(chain) * THREE.MathUtils.clamp(reachScale, 0.75, 1);
  return Math.max(0, chainPointA.distanceTo(targetWorld) - availableReach);
}

export function getEffectorDistance(chain, targetWorld) {
  if (!chain?.effector || !targetWorld) return Infinity;
  chain.effector.getWorldPosition(effectorWorldPosition);
  return effectorWorldPosition.distanceTo(targetWorld);
}

export function solveCcdChain({
  chain,
  targetWorld,
  weight = 1,
  iterations = 7,
  maxJointStep = Math.PI / 4,
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

    if (getEffectorDistance(chain, targetWorld) <= 0.025) break;
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
