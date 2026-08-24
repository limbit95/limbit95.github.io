import { escapeHTML, GAME_MODE, ROUND_STATUS } from "../constants.js";

const RECALL_STATUSES = new Set([ROUND_STATUS.SPEAKING,ROUND_STATUS.DRAWING,ROUND_STATUS.DISCUSSION,ROUND_STATUS.VOTING,ROUND_STATUS.RUNOFF_VOTING,ROUND_STATUS.VOTE_RESULT,ROUND_STATUS.LIAR_REVEAL,ROUND_STATUS.LIAR_GUESS]);

export function canRecallRole(snapshot) {
  if (!snapshot?.round || !RECALL_STATUSES.has(snapshot.round.status) || snapshot.me?.is_spectator === true) return false;
  return snapshot.round_players.some((player) => player.player_id === snapshot.me?.player_id);
}

export function roleRecallButtonView(loading = false) {
  return `<footer class="role-recall-footer"><button class="secondary role-recall-button" data-action="open-role-modal"${loading ? " disabled" : ""}>${loading ? "역할 불러오는 중..." : "🎭 내 역할 다시 확인"}</button></footer>`;
}

export function roleRecallModalView(role,gameMode=GAME_MODE.CLASSIC) {
  const isLiar = role.role === "liar";
  const hiddenRoleName=gameMode===GAME_MODE.DRAWING_SPY?"스파이":"라이어";
  const category = role.category ? `<div class="role-modal-category"><span>카테고리</span><strong>${escapeHTML(role.category)}</strong></div>` : isLiar ? '<p class="role-modal-note">이번 게임에서는<br>카테고리가 공개되지 않습니다.</p>' : "";
  const word = isLiar ? "" : `<div class="role-modal-word"><span>제시어</span><strong>${escapeHTML(role.word)}</strong></div>`;
  return `<div class="role-modal-backdrop" data-role-modal-backdrop role="presentation"><section class="role-modal" data-role-modal-panel role="dialog" aria-modal="true" aria-labelledby="role-modal-title"><header class="role-modal-header"><h2 id="role-modal-title">나의 역할</h2><button class="role-modal-close" data-action="close-role-modal" data-role-modal-close aria-label="역할 확인 창 닫기">×</button></header><p class="role-modal-role">${isLiar ? `🎭 ${hiddenRoleName}` : "시민"}</p>${category}${word}<div class="role-modal-actions"><button data-action="close-role-modal">닫기</button></div></section></div>`;
}
