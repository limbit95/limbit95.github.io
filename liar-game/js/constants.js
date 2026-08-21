export const STORAGE_KEYS = Object.freeze({ playerKey: "liar_player_key", nickname: "liar_nickname", room: "liar_current_room" });
export const CATEGORIES = Object.freeze(["음식", "장소", "직업", "동물", "물건", "인물", "기타"]);
export const ROUND_STATUS = Object.freeze({ ROLE_REVEAL: "ROLE_REVEAL", SPEAKING: "SPEAKING", DISCUSSION: "DISCUSSION" });
// TODO(PRODUCTION): 정식 배포 전에 최소 준비 인원을 4명으로 복구할 것.
// 2~6명 규칙도 다시 4~6명으로 복구할 것.
export const ERROR_MESSAGES = Object.freeze({
  AUTH_REQUIRED:"로그인 세션이 만료되었습니다. 다시 로그인해 주세요.", ROOM_NOT_FOUND:"방을 찾을 수 없습니다.", ROOM_EXPIRED:"만료된 방입니다.", ROOM_FULL:"방 정원이 가득 찼습니다.", ALREADY_IN_ACTIVE_ROOM:"이미 참가 중인 방이 있습니다.", NOT_ROOM_MEMBER:"이 방의 참가자가 아닙니다.", NOT_HOST:"방장만 할 수 있습니다.", INVALID_ROOM_STATE:"현재 방 상태에서는 실행할 수 없습니다.", INVALID_GAME_STATE:"현재 게임 상태에서는 실행할 수 없습니다.", INVALID_ROUND_STATE:"현재 라운드 상태에서는 실행할 수 없습니다.", NOT_ENOUGH_READY_PLAYERS:"준비한 참가자가 2명 이상이어야 합니다.", INVALID_LIAR_COUNT:"준비 인원에 비해 라이어 수가 많습니다.", ROLE_NOT_CONFIRMED:"모든 참가자가 역할을 확인해야 합니다.", STALE_VERSION:"상태가 변경되었습니다. 새로고침한 뒤 다시 시도해 주세요.", WORD_POOL_EMPTY:"조건에 맞는 제시어가 없습니다.", INVALID_NICKNAME:"닉네임은 1~20자로 입력해 주세요.", HOST_TRANSFER_REQUIRED:"다른 참가자가 있는 방은 방장 위임 후 나갈 수 있습니다.", SPEAKER_INDEX_OUT_OF_RANGE:"더 이동할 발언자가 없습니다.", SPEAKING_NOT_FINISHED:"마지막 발언자까지 진행해 주세요.", INVALID_GAME_SETTINGS:"게임 설정을 확인해 주세요.", TOO_MANY_READY_PLAYERS:"준비 인원은 최대 12명입니다.", NOT_ROUND_PARTICIPANT:"이번 라운드 참가자가 아닙니다.",
});
export const escapeHTML = (value="") => String(value).replace(/[&<>'"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);
