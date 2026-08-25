import { supabase } from "../../js/supabaseClient.js";

const ERROR_MESSAGES = {
  AUTH_REQUIRED: "로그인과 가입 승인이 필요합니다.",
  PLAYER_NOT_MEMBER: "현재 방의 참가자가 아닙니다.",
  ROOM_NOT_FOUND: "방을 찾을 수 없습니다.",
  ROOM_ALREADY_STARTED: "이미 게임이 시작된 방입니다.",
  HOST_ONLY: "방장만 게임을 시작할 수 있습니다.",
  INVALID_PLAYER_COUNT: "게임은 2~4명일 때 시작할 수 있습니다.",
  PLAYERS_NOT_READY: "모든 참가자가 준비 완료해야 합니다.",
  RULESET_NOT_FOUND: "사용할 게임 룰셋을 찾지 못했습니다.",
  RULESET_INCOMPLETE: "테스트 카드 또는 귀족 데이터가 부족합니다.",
  GAME_ALREADY_EXISTS: "이미 생성된 게임이 있습니다.",
  GAME_NOT_STARTED: "아직 게임이 시작되지 않았습니다.",
  STATE_CHANGED: "다른 참가자의 변경사항이 먼저 반영됐습니다. 최신 상태를 다시 불러옵니다.",
};

let pendingMutation = false;

function normalizeError(error) {
  const raw = error?.message ?? String(error ?? "알 수 없는 오류");
  const key = Object.keys(ERROR_MESSAGES).find((code) => raw.includes(code));
  const wrapped = new Error(key ? ERROR_MESSAGES[key] : raw);
  wrapped.code = key ?? error?.code ?? "UNKNOWN";
  wrapped.cause = error;
  return wrapped;
}

async function rpc(name, params = {}) {
  if (!supabase) throw new Error("Supabase 연결이 준비되지 않았습니다.");
  const { data, error } = await supabase.rpc(name, params);
  if (error) throw normalizeError(error);
  return data;
}

async function mutate(name, params = {}) {
  if (pendingMutation) {
    const error = new Error("다른 요청을 처리 중입니다.");
    error.code = "REQUEST_PENDING";
    throw error;
  }
  pendingMutation = true;
  try {
    return await rpc(name, params);
  } finally {
    pendingMutation = false;
  }
}

export function getGameSnapshot(roomId) {
  return rpc("splendor_get_game_snapshot", { p_room_id: roomId });
}

export const gameCommands = {
  start(roomId, version) {
    return mutate("splendor_start_game", {
      p_room_id: roomId,
      p_expected_version: version,
    });
  },
};
