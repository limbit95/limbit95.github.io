import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const CARD_THICKNESS = 0.026;
const CARD_VISUAL_SCALE = 0.5;
const FLIGHT_DURATION_MS = 500;
const STAGGER_MS = 155;

function easeInOut(value) {
  return value < 0.5 ? 2 * value * value : 1 - ((-2 * value + 2) ** 2) / 2;
}

function makePenaltyCard() {
  const group = new THREE.Group();
  group.scale.set(CARD_VISUAL_SCALE, 1, CARD_VISUAL_SCALE);
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.075, 1.28),
    new THREE.MeshStandardMaterial({ color: 0x294552, roughness: 0.72, metalness: 0.02 }),
  );
  const inset = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.018, 1.04),
    new THREE.MeshStandardMaterial({ color: 0xd9664a, roughness: 0.7, metalness: 0.02 }),
  );
  inset.position.y = 0.047;
  body.castShadow = true;
  inset.castShadow = true;
  group.add(body, inset);
  return group;
}

function deckTopWorld(deck, count) {
  const height = Math.max(CARD_THICKNESS, Math.max(0, count) * CARD_THICKNESS);
  return deck.localToWorld(new THREE.Vector3(0, height + 0.07, 0));
}

function snapshotWithCounts(baseSnapshot, counts) {
  return {
    ...baseSnapshot,
    players: baseSnapshot.players.map((player) => ({
      ...player,
      drawCount: counts.get(player.id) ?? player.drawCount,
    })),
  };
}

export function playWrongPenaltyTransfers(scene, beforeSnapshot, afterSnapshot, transfers, onComplete) {
  const validTransfers = (transfers || []).filter((transfer) => (
    scene.deckMap.get(transfer.fromPlayerId) && scene.deckMap.get(transfer.toPlayerId)
  ));
  if (!validTransfers.length) {
    scene.syncSnapshot(afterSnapshot);
    onComplete?.();
    return;
  }

  const counts = new Map(beforeSnapshot.players.map((player) => [player.id, player.drawCount]));
  scene.syncDeckCounts(beforeSnapshot);
  let finished = 0;

  validTransfers.forEach((transfer, sequence) => {
    const sourceDeck = scene.deckMap.get(transfer.fromPlayerId);
    const targetDeck = scene.deckMap.get(transfer.toPlayerId);
    const sourceCountAtLaunch = counts.get(transfer.fromPlayerId) || 0;
    const from = deckTopWorld(sourceDeck, sourceCountAtLaunch);
    const card = makePenaltyCard();
    card.position.copy(from);
    sourceDeck.getWorldQuaternion(card.quaternion);
    scene.scene.add(card);

    window.setTimeout(() => {
      counts.set(transfer.fromPlayerId, Math.max(0, (counts.get(transfer.fromPlayerId) || 0) - 1));
      scene.syncDeckCounts(snapshotWithCounts(beforeSnapshot, counts));
      const start = performance.now();
      const lane = (sequence - (validTransfers.length - 1) / 2) * 0.14;

      const tick = (now) => {
        const t = THREE.MathUtils.clamp((now - start) / FLIGHT_DURATION_MS, 0, 1);
        const eased = easeInOut(t);
        const targetCount = counts.get(transfer.toPlayerId) || 0;
        const to = deckTopWorld(targetDeck, targetCount + 1);
        card.position.lerpVectors(from, to, eased);
        card.position.y += Math.sin(Math.PI * t) * (0.9 + Math.abs(lane));
        card.position.x += Math.sin(Math.PI * t) * lane;
        card.rotation.x = Math.sin(Math.PI * t) * 0.28;
        card.rotation.z = Math.sin(Math.PI * t) * lane * 2.1;

        if (t < 1) {
          requestAnimationFrame(tick);
          return;
        }

        scene.scene.remove(card);
        counts.set(transfer.toPlayerId, (counts.get(transfer.toPlayerId) || 0) + 1);
        scene.syncDeckCounts(snapshotWithCounts(beforeSnapshot, counts));
        finished += 1;
        if (finished === validTransfers.length) {
          scene.syncSnapshot(afterSnapshot);
          onComplete?.();
        }
      };

      requestAnimationFrame(tick);
    }, sequence * STAGGER_MS);
  });
}
