import { escapeHTML, GAME_MODE, MIN_CITIZENS, MIN_READY_PLAYERS } from "../constants.js";

const difficultyLabel={all:"전체",easy:"쉬움",normal:"보통",hard:"어려움"};
const timeLabel=value=>Number(value||0)>0?`${Number(value)}초`:"무제한";
const wordSourceLabel=(g)=>g.word_source_mode==="custom"?`🧩 ${escapeHTML(g.custom_word_pack_name||"커스텀 팩")}만 (${Number(g.custom_word_count||0)}개)`:g.word_source_mode==="mixed"?`🔀 기본 + ${escapeHTML(g.custom_word_pack_name||"커스텀 팩")} (${Number(g.custom_word_count||0)}개)`:"📚 기본 제시어";
const gameStatsSlot='<section class="game-stats-slot is-compact" data-game-stats data-game-stats-context="waiting" aria-live="polite"><p class="muted game-stats-loading">현재 Game 기록을 불러오는 중…</p></section>';
export function roundWaitingView(s,isHost){
 const g=s.game;const readyCount=s.players.filter(player=>player.ready).length;
 const liarCount=Math.max(1,Number(g.liar_count||1));
 const requiredReady=Math.max(MIN_READY_PLAYERS,liarCount+MIN_CITIZENS);
 const missingReady=Math.max(0,requiredReady-readyCount);
 const canStart=missingReady===0;
 const drawingMode=(g.game_mode||GAME_MODE.CLASSIC)===GAME_MODE.DRAWING_SPY;
 const unlimitedStrokes=g.drawing_stroke_unlimited===true;
 const startControl=isHost?`<div class="setup-start-control round-waiting-start-control"><button type="button" class="setup-start-button" data-action="start-round" data-can-start="${canStart?"true":"false"}" ${canStart?"":"disabled"}>${canStart?"다음 라운드 시작":`다음 라운드 시작까지 ${missingReady}명이 더 필요합니다`}</button></div>`:"";
 const drawingSettings=drawingMode
  ?isHost
   ?`<section class="next-round-drawing-settings"><div class="setup-section-heading"><h3>🎨 다음 라운드 그림 난이도</h3><p class="setup-section-description">게임의 다른 규칙은 유지하고 그림 시간과 획 수만 라운드마다 바꿀 수 있습니다.</p></div><form class="next-round-drawing-form" data-action="round-drawing-settings"><div class="setup-rule-grid drawing-rule-grid"><label class="setup-control"><span>그림 시간</span><input name="drawingTimeLimit" type="number" min="5" max="60" value="${Number(g.drawing_time_limit||15)}"><small>1인당 5~60초</small></label><label class="setup-control drawing-stroke-limit-control ${unlimitedStrokes?"is-unlimited":""}"><span>최대 획 수</span><input name="drawingStrokeLimit" type="number" min="1" max="10" value="${Number(g.drawing_stroke_limit||3)}" ${unlimitedStrokes?"readonly":""}><small>${unlimitedStrokes?"무제한 모드에서는 사용하지 않습니다.":"1인당 1~10획"}</small></label></div><label class="setup-setting-row drawing-unlimited-row"><span class="setup-setting-copy"><strong>획 수 무제한</strong><small>이번 다음 라운드부터 적용됩니다. 이후 라운드에서도 다시 조정할 수 있습니다.</small></span><input name="drawingStrokeUnlimited" type="checkbox" ${unlimitedStrokes?"checked":""}></label><button type="submit" class="secondary">그림 규칙 저장</button></form></section>`
   :`<section class="next-round-drawing-settings"><h3>🎨 다음 라운드 그림 난이도</h3><dl><div><dt>그림 시간</dt><dd>${Number(g.drawing_time_limit||15)}초</dd></div><div><dt>최대 획</dt><dd>${unlimitedStrokes?"∞ 무제한":`${Number(g.drawing_stroke_limit||3)}획`}</dd></div></dl><p class="muted">방장이 다음 라운드 그림 난이도를 조정할 수 있습니다.</p></section>`
  :"";
 return `${startControl}<section class="card round-waiting-card">
  <header class="setup-header"><h2>다음 라운드 준비</h2><p class="setup-subtitle">Game ${Number(g.game_no)}의 핵심 설정은 유지됩니다.${drawingMode?" 그림 난이도만 이번 라운드에 맞게 조절할 수 있습니다.":""}</p></header>
  ${gameStatsSlot}
  <section class="round-waiting-settings" aria-label="현재 게임 설정"><h3>🔒 현재 게임 설정</h3><dl>
   <div><dt>게임 모드</dt><dd>${drawingMode?"🎨 그림 스파이":"💬 기본 라이어게임"}</dd></div>
   <div><dt>제시어 소스</dt><dd>${wordSourceLabel(g)}</dd></div>
   <div><dt>기본 카테고리</dt><dd>${g.selected_categories.map(escapeHTML).join(" / ")}</dd></div><div><dt>기본 난이도</dt><dd>${difficultyLabel[g.difficulty]||escapeHTML(g.difficulty)}</dd></div>
   <div><dt>${drawingMode?"스파이":"라이어"}</dt><dd>${liarCount}명</dd></div><div><dt>추측 기회</dt><dd>${Number(g.guess_limit)}회</dd></div><div><dt>카테고리 공개</dt><dd>${g.show_category_to_liar?"공개":"비공개"}</dd></div>
   ${drawingMode?"":`<div><dt>발언 시간</dt><dd>${timeLabel(g.speaking_time_limit)}</dd></div>`}<div><dt>자유토론</dt><dd>${timeLabel(g.discussion_time_limit)}</dd></div>
   <div><dt>다중 ${drawingMode?"스파이":"라이어"} 정체</dt><dd>${g.liars_know_each_other?"서로 공개":"서로 비공개"}</dd></div>
  </dl></section>
  ${drawingSettings}
  ${isHost?"":'<p class="muted round-waiting-host-notice">방장이 다음 라운드를 시작할 때까지 기다려 주세요.</p>'}
 </section>`;
}
