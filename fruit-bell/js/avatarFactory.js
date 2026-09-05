import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

export const ANIMALS = [
  { id: "fox", label: "여우", body: 0xd8753f, belly: 0xf4d9bd, ear: "point", accent: 0x4d2f26 },
  { id: "rabbit", label: "토끼", body: 0xd8d8df, belly: 0xf7f2ee, ear: "long", accent: 0xc98f9e },
  { id: "bear", label: "곰", body: 0x8a6045, belly: 0xd9b99d, ear: "round", accent: 0x4b342a },
  { id: "cat", label: "고양이", body: 0xa9a6b6, belly: 0xe7e4ed, ear: "point", accent: 0x555266 },
  { id: "dog", label: "강아지", body: 0xc99a62, belly: 0xead2b0, ear: "flop", accent: 0x694831 },
  { id: "panda", label: "판다", body: 0xf0f0ee, belly: 0xffffff, ear: "round", accent: 0x27272a },
];

export function getAnimalProfile(id) {
  return ANIMALS.find((animal) => animal.id === id) || ANIMALS[0];
}

function material(color, roughness = 0.78) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });
}

function mesh(geometry, color) {
  const item = new THREE.Mesh(geometry, material(color));
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
}

function addEyes(head, profile) {
  const eyeWhite = material(0xffffff, 0.55);
  const pupilMat = material(profile.id === "panda" ? 0x151515 : 0x1b1b1b, 0.5);
  const eyes = [];
  [-0.28, 0.28].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), eyeWhite);
    eye.scale.set(1, 1.15, 0.55);
    eye.position.set(x, 0.13, 0.57);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.062, 12, 10), pupilMat);
    pupil.scale.z = 0.5;
    pupil.position.set(x, 0.12, 0.66);
    head.add(eye, pupil);
    eyes.push(pupil);
  });
  return eyes;
}

function addEars(head, profile) {
  const earMat = material(profile.body);
  const innerMat = material(profile.accent);
  if (profile.ear === "long") {
    [-0.35, 0.35].forEach((x) => {
      const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.55, 5, 10), earMat);
      ear.position.set(x, 0.82, 0);
      ear.rotation.z = x * 0.18;
      const inner = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.38, 4, 8), innerMat);
      inner.position.set(x, 0.83, 0.16);
      inner.rotation.z = ear.rotation.z;
      head.add(ear, inner);
    });
    return;
  }

  if (profile.ear === "round") {
    [-0.48, 0.48].forEach((x) => {
      const ear = mesh(new THREE.SphereGeometry(0.27, 14, 10), profile.id === "panda" ? profile.accent : profile.body);
      ear.position.set(x, 0.52, 0);
      head.add(ear);
    });
    return;
  }

  if (profile.ear === "flop") {
    [-0.5, 0.5].forEach((x) => {
      const ear = mesh(new THREE.SphereGeometry(0.28, 14, 10), profile.accent);
      ear.scale.set(0.7, 1.5, 0.55);
      ear.position.set(x, 0.33, 0.03);
      ear.rotation.z = x > 0 ? -0.48 : 0.48;
      head.add(ear);
    });
    return;
  }

  [-0.43, 0.43].forEach((x) => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.29, 0.65, 4), earMat);
    ear.position.set(x, 0.62, 0);
    ear.rotation.z = x > 0 ? -0.22 : 0.22;
    head.add(ear);
  });
}

function makeArm(profile, side) {
  const pivot = new THREE.Group();
  const upper = mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.9, 12), profile.body);
  upper.position.y = -0.42;
  const paw = mesh(new THREE.SphereGeometry(0.22, 14, 10), profile.body);
  paw.scale.set(1.05, 0.8, 1.2);
  paw.position.y = -0.88;
  pivot.add(upper, paw);
  pivot.position.set(side * 0.62, 0.35, 0.02);
  pivot.rotation.z = side * 0.35;
  pivot.rotation.x = -0.42;
  return pivot;
}

export function createAnimalAvatar(animalId) {
  const profile = getAnimalProfile(animalId);
  const group = new THREE.Group();
  group.userData.animalId = profile.id;

  const chair = mesh(new THREE.BoxGeometry(1.55, 1.3, 0.22), 0x45372f);
  chair.position.set(0, 0.6, -0.34);
  chair.rotation.x = -0.08;
  const body = mesh(new THREE.SphereGeometry(0.78, 22, 16), profile.body);
  body.scale.set(0.92, 1.12, 0.78);
  body.position.y = 1.08;
  const belly = mesh(new THREE.SphereGeometry(0.48, 18, 14), profile.belly);
  belly.scale.set(0.9, 1.05, 0.25);
  belly.position.set(0, 0.98, 0.61);

  const headPivot = new THREE.Group();
  headPivot.position.y = 2.17;
  const head = mesh(new THREE.SphereGeometry(0.68, 22, 16), profile.body);
  head.scale.set(1, 0.94, 0.92);
  headPivot.add(head);
  addEars(head, profile);
  const pupils = addEyes(head, profile);

  const muzzle = mesh(new THREE.SphereGeometry(0.28, 14, 10), profile.belly);
  muzzle.scale.set(1.15, 0.72, 0.75);
  muzzle.position.set(0, -0.15, 0.6);
  const nose = mesh(new THREE.SphereGeometry(0.09, 10, 8), profile.accent);
  nose.scale.set(1.15, 0.8, 0.65);
  nose.position.set(0, -0.08, 0.79);
  head.add(muzzle, nose);

  if (profile.id === "panda") {
    [-0.29, 0.29].forEach((x) => {
      const patch = mesh(new THREE.SphereGeometry(0.2, 12, 8), profile.accent);
      patch.scale.set(1.25, 1.35, 0.18);
      patch.position.set(x, 0.12, 0.53);
      head.add(patch);
    });
    pupils.forEach((pupil) => { pupil.position.z = 0.71; });
  }

  const leftArm = makeArm(profile, -1);
  const rightArm = makeArm(profile, 1);
  leftArm.rotation.z = -2.35;
  leftArm.rotation.x = -0.1;
  body.add(leftArm, rightArm);
  group.add(chair, body, belly, headPivot);
  group.scale.setScalar(0.92);

  return {
    group,
    body,
    headPivot,
    leftArm,
    rightArm,
    pupils,
    profile,
    baseY: 0,
    action: null,
  };
}

export function updateAvatarIdle(avatar, elapsed, intensity = 1) {
  const phase = elapsed * 1.55 + (avatar.group.id % 7);
  avatar.body.scale.y = 1.12 + Math.sin(phase) * 0.018 * intensity;
  if (!avatar.action) {
    avatar.headPivot.rotation.y += (Math.sin(phase * 0.47) * 0.08 - avatar.headPivot.rotation.y) * 0.035;
    avatar.headPivot.rotation.x += (Math.sin(phase * 0.32) * 0.025 - avatar.headPivot.rotation.x) * 0.035;
    avatar.leftArm.rotation.z += (-2.35 - avatar.leftArm.rotation.z) * 0.08;
    avatar.leftArm.rotation.x += (-0.1 - avatar.leftArm.rotation.x) * 0.08;
    avatar.rightArm.rotation.z += (0.35 - avatar.rightArm.rotation.z) * 0.08;
    avatar.rightArm.rotation.x += (-0.42 - avatar.rightArm.rotation.x) * 0.08;
  }
}
