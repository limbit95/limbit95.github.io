import test from "node:test";
import assert from "node:assert/strict";

import {
  AVATAR_ACTIONS,
  AVATAR_EMOTIONS,
  createAvatarState,
  normalizeGaze,
  setAvatarAction,
  updateGaze,
} from "../js/avatarSystem.js";

test("시선 입력은 -1~1 범위로 제한된다", () => {
  assert.equal(normalizeGaze(2), 1);
  assert.equal(normalizeGaze(-4), -1);
  assert.equal(normalizeGaze("bad"), 0);
});

test("아바타 행동과 감정 상태를 게임 로직과 분리해 갱신할 수 있다", () => {
  const initial = createAvatarState({ playerId: "p1", animalId: "rabbit" });
  const looking = updateGaze(initial, 0.5, -0.25);
  assert.equal(looking.action, AVATAR_ACTIONS.LOOK);
  assert.equal(looking.gazeX, 0.5);

  const ringing = setAvatarAction(looking, AVATAR_ACTIONS.RING_BELL, AVATAR_EMOTIONS.FOCUSED);
  assert.equal(ringing.action, AVATAR_ACTIONS.RING_BELL);
  assert.equal(ringing.emotion, AVATAR_EMOTIONS.FOCUSED);
  assert.equal(ringing.actionNonce, 1);
});
