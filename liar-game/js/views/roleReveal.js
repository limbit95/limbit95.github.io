import { escapeHTML } from "../constants.js";

export function roleRevealView(s, role, isHost) {
  const isSpectator = s.me?.is_spectator === true;
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
      ? '<p class="muted">이번 게임에서는 라이어에게 카테고리가 공개되지 않습니다.</p>'
      : "";
  const roleContent = isSpectator
    ? `<p class="notice">현재 라운드를 관전 중입니다.</p>
       <p class="muted">위 관전 정보에서 실제 라이어와 제시어를 확인할 수 있습니다.</p>`
    : `<div class="role-flip-scene"><div class="role-flip-card${role ? " is-revealed" : ""}" data-role-flip-card>
        <div class="role-flip-face role-flip-front"><span class="role-flip-icon" aria-hidden="true">🎭</span><h3>나의 역할 확인</h3><p class="muted">버튼을 누르면 본인의 역할 전용 RPC를 호출합니다.</p><button data-action="show-role">${confirmed ? "내 역할 다시 보기" : "내 역할 보기"}</button></div>
        ${role ? `<div class="role-flip-face role-flip-back"><h3>${role.role === "liar" ? "🎭 당신은 라이어입니다" : "시민"}</h3>${category}${role.role === "liar" ? "" : `<p class="muted role-word-label">제시어</p><p class="role-word">${escapeHTML(role.word)}</p>`}${confirmation}</div>` : ""}
       </div></div>`;

  return `<section class="card stack"><h2>역할 확인</h2>${roleContent}<p class="muted">확인 완료 ${s.round_players.filter((player) => player.role_checked).length}/${s.round_players.length}</p>${isHost ? '<button data-action="start-speaking">발언 시작 (방장)</button>' : ""}</section>`;
}