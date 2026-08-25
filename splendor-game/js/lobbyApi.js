import { supabase } from "../../js/supabaseClient.js";

const ERROR_MESSAGES = {
  AUTH_REQUIRED: "로그인과 가입 승인이 필요합니다.",
  INVALID_NICKNAME: "닉네임은 1~20자로 입력해 주세요.",
  ROOM_NOT_FOUND: "방을 찾을 수 없습니다. 방 코드를 확인해 주세요.",
  ROOM_FULL: "이미 4명이 참가한 방입니다.",
  ROOM_ALREADY_STARTED: "이미 게임이 시작된 방입니다.",
  ACTIVE_ROOM_EXISTS: "이미 참가 중인 스플렌더 방이 있습니다.",
  PLAYER_NOT_MEMBER: "현재 방의 참가자가 아닙니다.",
  STATE_CHANGED: "다른 참가자의 변경사항이 먼저 반영됐습니다. 최신 상태로 다시 불러옵니다.",
  ROOM_CODE_GENERATION_FAILED: "방 코드를 만들지 못했습니다. 다시 시도해 주세요.",
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

export function getMyActiveRoom() {
  return rpc("splendor_get_my_active_room");
}

export function getLobbySnapshot(roomId) {
  return rpc("splendor_get_lobby_snapshot", { p_room_id: roomId });
}

export const lobbyCommands = {
  createRoom(nickname) {
    return mutate("splendor_create_room", { p_nickname: nickname });
  },
  joinRoom(roomCode, nickname) {
    return mutate("splendor_join_room", {
      p_room_code: roomCode,
      p_nickname: nickname,
    });
  },
  setReady(roomId, ready, version) {
    return mutate("splendor_set_ready", {
      p_room_id: roomId,
      p_ready: ready,
      p_expected_version: version,
    });
  },
  updateNickname(roomId, nickname, version) {
    return mutate("splendor_update_nickname", {
      p_room_id: roomId,
      p_nickname: nickname,
      p_expected_version: version,
    });
  },
  leaveRoom(roomId, version) {
    return mutate("splendor_leave_room", {
      p_room_id: roomId,
      p_expected_version: version,
    });
  },
};
