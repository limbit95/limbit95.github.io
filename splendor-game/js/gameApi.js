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
  STATE_CHANGED: "다른 참가자의 행동이 먼저 반영됐습니다. 최신 상태를 다시 불러옵니다.",
  NOT_YOUR_TURN: "현재 내 턴이 아닙니다.",
  RETURN_TOKENS_REQUIRED: "보유 토큰이 10개를 초과했습니다. 먼저 초과 토큰을 반환해 주세요.",
  NO_RETURN_REQUIRED: "현재 반환해야 할 초과 토큰이 없습니다.",
  INVALID_ACTION_ID: "게임 행동 식별자를 만들지 못했습니다. 다시 시도해 주세요.",
  ACTION_ID_REUSED: "이미 다른 행동에 사용된 요청입니다. 게임 상태를 새로 불러와 주세요.",
  INVALID_TOKEN_SELECTION: "가져올 보석 선택을 다시 확인해 주세요.",
  TOKENS_MUST_BE_DISTINCT: "이 행동에서는 서로 다른 색의 보석만 선택할 수 있습니다.",
  INVALID_TOKEN_COLOR: "선택할 수 없는 보석 색상입니다.",
  NO_GEMS_AVAILABLE: "공급처에 가져올 수 있는 일반 보석이 없습니다.",
  MUST_TAKE_THREE_DIFFERENT: "가져올 수 있는 색이 3종류 이상이면 서로 다른 보석 3개를 선택해야 합니다.",
  GEM_UNAVAILABLE: "선택한 보석이 공급처에 남아 있지 않습니다.",
  DOUBLE_REQUIRES_FOUR: "같은 색 2개를 가져오려면 행동 시작 시 그 색 보석이 최소 4개 남아 있어야 합니다.",
  INVALID_RETURN_SELECTION: "반환할 토큰 선택을 다시 확인해 주세요.",
  RETURN_COUNT_MISMATCH: "화면에 표시된 초과 개수만큼 정확히 반환해 주세요.",
  RETURN_MORE_THAN_OWNED: "가지고 있는 수보다 많은 토큰을 반환할 수 없습니다.",
  INVALID_CARD_ID: "카드를 다시 선택해 주세요.",
  CARD_NOT_AVAILABLE: "선택한 카드는 더 이상 공개 카드 자리에 없습니다. 최신 상태를 확인해 주세요.",
  RESERVED_CARD_NOT_AVAILABLE: "선택한 예약 카드는 내 예약 목록에 없습니다. 최신 상태를 확인해 주세요.",
  RESERVE_LIMIT_REACHED: "예약 카드는 최대 3장까지 보유할 수 있습니다.",
  INVALID_TIER: "예약할 카드 덱 단계를 다시 선택해 주세요.",
  DECK_EMPTY: "선택한 단계의 카드 덱이 비어 있습니다.",
  INVALID_PAYMENT: "결제할 보석 선택값이 올바르지 않습니다.",
  PAYMENT_MISMATCH: "카드의 실제 비용과 선택한 결제 보석이 맞지 않습니다.",
  INSUFFICIENT_TOKENS: "선택한 결제를 완료할 만큼 보유한 보석이 충분하지 않습니다.",
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

export function newClientActionId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  throw Object.assign(new Error(ERROR_MESSAGES.INVALID_ACTION_ID), { code: "INVALID_ACTION_ID" });
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
  takeDistinct(roomId, colors, version, clientActionId) {
    return mutate("splendor_take_distinct", {
      p_room_id: roomId,
      p_colors: colors,
      p_expected_version: version,
      p_client_action_id: clientActionId,
    });
  },
  takeDouble(roomId, color, version, clientActionId) {
    return mutate("splendor_take_double", {
      p_room_id: roomId,
      p_color: color,
      p_expected_version: version,
      p_client_action_id: clientActionId,
    });
  },
  returnExcess(roomId, returns, version, clientActionId) {
    return mutate("splendor_return_excess", {
      p_room_id: roomId,
      p_returns: returns,
      p_expected_version: version,
      p_client_action_id: clientActionId,
    });
  },
  reserveFaceup(roomId, cardInstanceId, version, clientActionId) {
    return mutate("splendor_reserve_faceup", {
      p_room_id: roomId,
      p_card_instance_id: cardInstanceId,
      p_expected_version: version,
      p_client_action_id: clientActionId,
    });
  },
  reserveHidden(roomId, tier, version, clientActionId) {
    return mutate("splendor_reserve_hidden", {
      p_room_id: roomId,
      p_tier: tier,
      p_expected_version: version,
      p_client_action_id: clientActionId,
    });
  },
  purchaseFaceup(roomId, cardInstanceId, payment, version, clientActionId) {
    return mutate("splendor_purchase_faceup", {
      p_room_id: roomId,
      p_card_instance_id: cardInstanceId,
      p_payment: payment,
      p_expected_version: version,
      p_client_action_id: clientActionId,
    });
  },
  purchaseReserved(roomId, cardInstanceId, payment, version, clientActionId) {
    return mutate("splendor_purchase_reserved", {
      p_room_id: roomId,
      p_card_instance_id: cardInstanceId,
      p_payment: payment,
      p_expected_version: version,
      p_client_action_id: clientActionId,
    });
  },
};
