import { escapeHTML, GAME_MODE, MIN_CITIZENS, MIN_READY_PLAYERS } from "../constants.js";

const difficultyLabel={all:"전체",easy:"쉬움",normal:"보통",hard:"어려움"};
export function roundWaitingView(s,isHost){
 const g=s.game;const readyCount=s.players.filter(player=>player.ready).length;
 const liarCount=Number(g.liar_count);const citizenCount=readyCount-liarCount;
 const hasEnoughPlayers=readyCount>=MIN_READY_PLAYERS;const hasEnoughCitizens=citizenCount>=MIN_CITIZENS;
 const canStart=hasEnoughPlayers&&hasEnoughCitizens;
 const drawingMode=(g.game_mode||GAME_MODE.CLASSIC)===GAME_MODE.DRAWING_SPY;
 const startStatus=!hasEnoughPlayers?`게임 시작까지 ${MIN_READY_PLAYERS-readyCount}명이 더 필요합니다.`
  :!hasEnoughCitizens?`현재 라이어/스파이 ${liarCount}명 · 게임 시작에는 최소 ${MIN_CITIZENS}명의 시민이 필요합니다.`
  :"다음 라운드를 시작할 수 있습니다.";
 return `<section class="card round-waiting-card">
  <header class="setup-header"><h2>다음 라운드 준비</h2><p class="setup-subtitle">Game ${Number(g.game_no)}의 설정을 그대로 사용합니다.</p></header>
  <section class="round-waiting-settings" aria-label="현재 게임 설정"><h3>🔒 현재 게임 설정</h3><dl>
   <div><dt>게임 모드</dt><dd>${drawingMode?"🎨 그림 스파이":"💬 기본 라이어게임"}</dd></div>
   <div><dt>카테고리</dt><dd>${g.selected_categories.map(escapeHTML).join(" / ")}</dd></div><div><dt>난이도</dt><dd>${difficultyLabel[g.difficulty]||escapeHTML(g.difficulty)}</dd></div>
   <div><dt>${drawingMode?"스파이":"라이어"}</dt><dd>${liarCount}명</dd></div><div><dt>추측 기회</dt><dd>${Number(g.guess_limit)}회</dd></div><div><dt>카테고리 공개</dt><dd>${g.show_category_to_liar?"공개":"비공개"}</dd></div>
   ${drawingMode?`<div><dt>그림 시간</dt><dd>${Number(g.drawing_time_limit||15)}초</dd></div><div><dt>최대 획</dt><dd>${Number(g.drawing_stroke_limit||3)}획</dd></div>`:""}
  </dl></section><div class="round-waiting-ready"><span>준비 완료</span><strong>${readyCount}명</strong></div>
  <p class="start-readiness ${canStart?"is-ready":""}" role="status" aria-live="polite">${startStatus}</p>
  <p class="muted">상단 참가자 영역의 준비완료 버튼으로 이번 라운드 참여 여부를 선택하세요.</p>
  ${isHost?`<button type="button" data-action="start-round" ${canStart?"":"disabled"}>다음 라운드 시작</button>`:'<p class="muted">방장이 다음 라운드를 시작할 때까지 기다려 주세요.</p>'}
 </section>`;
}
