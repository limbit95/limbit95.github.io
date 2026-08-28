export const ANIMAL_AVATARS = Object.freeze([
  { id: "fox", name: "여우", emoji: "🦊", tone: "ember" },
  { id: "rabbit", name: "토끼", emoji: "🐰", tone: "cloud" },
  { id: "bear", name: "곰", emoji: "🐻", tone: "cocoa" },
  { id: "cat", name: "고양이", emoji: "🐱", tone: "honey" },
  { id: "dog", name: "강아지", emoji: "🐶", tone: "sand" },
  { id: "penguin", name: "펭귄", emoji: "🐧", tone: "night" },
]);

export const AVATAR_ACTIONS = Object.freeze({
  IDLE: "idle",
  LOOK: "look",
  FLIP_CARD: "flip-card",
  RING_BELL: "ring-bell",
  CELEBRATE: "celebrate",
  MISS: "miss",
  ELIMINATED: "eliminated",
});

export const AVATAR_EMOTIONS = Object.freeze({
  NEUTRAL: "neutral",
  FOCUSED: "focused",
  HAPPY: "happy",
  EMBARRASSED: "embarrassed",
  SAD: "sad",
});

export function createAvatarState({ playerId, animalId = "fox" } = {}) {
  return {
    playerId,
    animalId,
    action: AVATAR_ACTIONS.IDLE,
    emotion: AVATAR_EMOTIONS.NEUTRAL,
    gazeX: 0,
    gazeY: 0,
    actionNonce: 0,
  };
}

export function normalizeGaze(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(-1, Math.min(1, numeric));
}

export function updateGaze(state, gazeX, gazeY) {
  return {
    ...state,
    gazeX: normalizeGaze(gazeX),
    gazeY: normalizeGaze(gazeY),
    action: state.action === AVATAR_ACTIONS.IDLE ? AVATAR_ACTIONS.LOOK : state.action,
  };
}

export function setAvatarAction(state, action, emotion = state.emotion) {
  return {
    ...state,
    action,
    emotion,
    actionNonce: state.actionNonce + 1,
  };
}

export function resetAvatarPose(state) {
  return {
    ...state,
    action: AVATAR_ACTIONS.IDLE,
    emotion: AVATAR_EMOTIONS.NEUTRAL,
  };
}

export function getAnimalAvatar(animalId) {
  return ANIMAL_AVATARS.find((avatar) => avatar.id === animalId) || ANIMAL_AVATARS[0];
}
