import { escapeHTML, GAME_MODE } from "../constants.js";

export function roleRevealView(s, role, isHost) {
  const isSpectator = s.me?.is_spectator === true;
  const drawingMode=(s.game?.game_mode||GAME_MODE.CLASSIC)===GAME_MODE.DRAWING_SPY;
  const hiddenRoleName=drawingMode?"스파이":"라이어";
  const meRoundPlayer = s.round_players.find(
    (player) => player.player_id === s.me?.player_id,
  );
  const confirmed = meRoundPlayer?.role_checked === true;
  const confirmation = confirmed
    ? '<button class="role-confirmed" disabled>✓ 확인 완료</button>'
    : '<button data-action="confirm-role">확인했습니다</button>';
  const category = role?.category
    ? `<p class="muted">카테고리: ${escapeHTML(role.category)}</p>`
    : role?.role === "liar"
      ? `<p class="muted">이번 게임에서는 ${hiddenRoleName}에게 카테고리가 공개되지 않습니다.</p>`
      : "";
  const roleGuide=role?.role==="liar"&&drawingMode
    ?'<p class="role-mode-guide">다른 사람들의 그림을 보며 제시어를 눈치채고, 들키지 않도록 자연스럽게 그림을 추가하세요.</p>'
    :role?.role==="citizen"&&drawingMode
      ?'<p class="role-mode-guide">스파이가 제시어를 쉽게 알아채지 못하도록 핵심을 너무 빨리 완성하지 않는 것이 중요합니다.</p>'
      :"";
  const roleContent = isSpectator
    ? `<p class="notice">현재 라운드를 관전 중입니다.</p>
       <p class="muted">위 관전 정보에서 실제 ${hiddenRoleName}와 제시어를 확인할 수 있습니다.</p>`
    : `<div class="role-flip-scene"><div class="role-flip-card${role ? " is-revealed" : ""}" data-role-flip-card>
        <div class="role-flip-face role-flip-front"><span class="role-flip-icon" aria-hidden="true">🎭</span><h3>나의 역할 확인</h3><p class="muted">버튼을 눌러 본인의 역할을 확인하세요.</p><button data-action="show-role">${confirmed ? "내 역할 다시 보기" : "내 역할 보기"}</button></div>
        ${role ? `<div class="role-flip-face role-flip-back"><h3>${role.role === "liar" ? `🎭 당신은 ${hiddenRoleName}입니다` : "시민"}</h3>${category}${role.role === "liar" ? "" : `<p class="muted role-word-label">제시어</p><p class="role-word">${escapeHTML(role.word)}</p>`}${roleGuide}${confirmation}</div>` : ""}
       </div></div>`;

  const hostAction=drawingMode?"그림 시작 (방장)":"발언 시작 (방장)";
  return `<section class="card stack"><h2>역할 확인</h2>${drawingMode?'<p class="notice">🎨 그림 스파이 모드 · 역할 확인 후 공동 그림판으로 이동합니다.</p>':""}${roleContent}<p class="muted">확인 완료 ${s.round_players.filter((player) => player.role_checked).length}/${s.round_players.length}</p>${isHost ? `<button data-action="start-speaking">${hostAction}</button>` : ""}</section>`;
}