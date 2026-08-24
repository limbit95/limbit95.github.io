import { escapeHTML } from "../constants.js";

const difficultyLabel={all:"전체",easy:"쉬움",normal:"보통",hard:"어려움"};
export function roundWaitingView(s,isHost){
 const g=s.game;const readyCount=s.players.filter(player=>player.ready).length;
 return `<section class="card round-waiting-card">
  <header class="setup-header"><h2>다음 라운드 준비</h2><p class="setup-subtitle">Game ${Number(g.game_no)}의 설정을 그대로 사용합니다.</p></header>
  <section class="round-waiting-settings" aria-label="현재 게임 설정"><h3>🔒 현재 게임 설정</h3><dl>
   <div><dt>카테고리</dt><dd>${g.selected_categories.map(escapeHTML).join(" / ")}</dd></div><div><dt>난이도</dt><dd>${difficultyLabel[g.difficulty]||escapeHTML(g.difficulty)}</dd></div>
   <div><dt>라이어</dt><dd>${Number(g.liar_count)}명</dd></div><div><dt>추측 기회</dt><dd>${Number(g.guess_limit)}회</dd></div><div><dt>라이어 카테고리</dt><dd>${g.show_category_to_liar?"공개":"비공개"}</dd></div>
  </dl></section><div class="round-waiting-ready"><span>준비 완료</span><strong>${readyCount}명</strong></div>
  <p class="muted">상단 참가자 영역의 준비완료 버튼으로 이번 라운드 참여 여부를 선택하세요.</p>
  ${isHost?'<button data-action="start-round">다음 라운드 시작</button>':'<p class="muted">방장이 다음 라운드를 시작할 때까지 기다려 주세요.</p>'}
 </section>`;
}
