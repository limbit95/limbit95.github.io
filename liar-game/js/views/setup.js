import { CATEGORIES, MIN_CITIZENS, MIN_READY_PLAYERS } from "../constants.js";

export function setupView(s,isHost){
 const g=s.game;
 const readyCount=s.players.filter(player=>player.ready).length;
 const liarCount=Number(g.liar_count);
 const recommendedLiarCount=readyCount<=4?1:readyCount<=9?2:3;
 const hasEnoughPlayers=readyCount>=MIN_READY_PLAYERS;
 const citizenCount=readyCount-liarCount;
 const hasEnoughCitizens=citizenCount>=MIN_CITIZENS;
 const canStart=hasEnoughPlayers&&hasEnoughCitizens;
 const startStatus=!hasEnoughPlayers
  ?`게임 시작까지 ${MIN_READY_PLAYERS-readyCount}명이 더 필요합니다.`
  :!hasEnoughCitizens
   ?`현재 설정에서는 시민이 ${Math.max(0,citizenCount)}명입니다. 게임 시작에는 최소 ${MIN_CITIZENS}명의 시민이 필요합니다.`
   :"게임을 시작할 수 있습니다.";
 return `<section class="card setup-card">
  <header class="setup-header">
   <h2>게임 설정</h2>
   <p class="setup-subtitle">이번 게임의 규칙을 정해주세요.</p>
  </header>
  <form data-action="settings" class="setup-form">
   <fieldset class="setup-fieldset" ${isHost?"":"disabled"}>
    <legend class="setup-legend">게임 설정 항목</legend>
    <section class="setup-section">
     <div class="setup-section-heading">
      <h3 class="setup-section-title">카테고리</h3>
      <p class="setup-section-description">이번 게임에 사용할 카테고리를 선택하세요.</p>
     </div>
     <div class="setup-options-grid">${CATEGORIES.map(c=>`<label class="category-option"><input type="checkbox" name="category" value="${c}" ${g.selected_categories.includes(c)?"checked":""}> <span>${c}</span></label>`).join("")}</div>
    </section>
    <section class="setup-section">
     <div class="setup-section-heading">
      <h3 class="setup-section-title">게임 규칙</h3>
      <div class="setup-player-info"><span>준비 인원 <strong>${readyCount}명</strong></span><span>권장 라이어 <strong>${recommendedLiarCount}명</strong></span></div>
     </div>
     <div class="setup-rule-grid">
      <label class="setup-control"><span>난이도</span><select name="difficulty"><option value="all" ${g.difficulty==="all"?"selected":""}>전체</option><option value="easy" ${g.difficulty==="easy"?"selected":""}>쉬움</option><option value="normal" ${g.difficulty==="normal"?"selected":""}>보통</option><option value="hard" ${g.difficulty==="hard"?"selected":""}>어려움</option></select><small>제시어의 난이도</small></label>
      <label class="setup-control"><span>라이어 수</span><input name="liarCount" type="number" min="1" max="3" value="${g.liar_count}"><small>1~3명 자유 설정 · 현재 인원 권장 ${recommendedLiarCount}명<br>게임 시작 시 최소 2명의 시민이 필요합니다.</small></label>
      <label class="setup-control"><span>추측 횟수</span><input name="guessLimit" type="number" min="1" max="3" value="${g.guess_limit}"><small>라이어 팀이 공유하는 기회</small></label>
     </div>
    </section>
    <section class="setup-section">
     <div class="setup-section-heading"><h3 class="setup-section-title">라이어 정보</h3></div>
     <label class="setup-setting-row">
      <span class="setup-setting-copy"><strong>라이어에게 카테고리 공개</strong><small>켜면 카테고리만 공개하며, 제시어는 항상 숨겨집니다. 끄면 카테고리와 제시어를 모두 공개하지 않습니다.</small></span>
      <input name="showCategoryToLiar" type="checkbox" ${g.show_category_to_liar?"checked":""}>
     </label>
    </section>
   </fieldset>
   <p class="start-readiness ${canStart?"is-ready":""}" role="status" aria-live="polite">${startStatus}</p>
   ${isHost?`<div class="setup-actions"><button type="submit" class="secondary">설정 저장</button><button type="button" data-action="start-round" ${canStart?"":"disabled"}>게임 시작</button></div>`:`<p class="muted setup-host-notice">방장만 설정하고 게임을 시작할 수 있습니다.</p>`}
  </form>
 </section>`;
}