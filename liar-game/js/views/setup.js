import { CATEGORIES, GAME_MODE, MIN_CITIZENS, MIN_READY_PLAYERS } from "../constants.js";

const selected=(value,current)=>Number(value)===Number(current)?"selected":"";

export function setupView(s,isHost){
 const g=s.game;
 const readyCount=s.players.filter(player=>player.ready).length;
 const liarCount=Number(g.liar_count);
 const recommendedLiarCount=readyCount<=4?1:readyCount<=9?2:3;
 const hasEnoughPlayers=readyCount>=MIN_READY_PLAYERS;
 const citizenCount=readyCount-liarCount;
 const hasEnoughCitizens=citizenCount>=MIN_CITIZENS;
 const canStart=hasEnoughPlayers&&hasEnoughCitizens;
 const mode=g.game_mode||GAME_MODE.CLASSIC;
 const unlimitedStrokes=g.drawing_stroke_unlimited===true;
 const speakingTime=Number(g.speaking_time_limit??30);
 const discussionTime=Number(g.discussion_time_limit??90);
 const liarsKnowEachOther=g.liars_know_each_other===true;
 const startStatus=!hasEnoughPlayers
  ?`게임 시작까지 ${MIN_READY_PLAYERS-readyCount}명이 더 필요합니다.`
  :!hasEnoughCitizens
   ?`현재 설정에서는 시민이 ${Math.max(0,citizenCount)}명입니다. 게임 시작에는 최소 ${MIN_CITIZENS}명의 시민이 필요합니다.`
   :"게임을 시작할 수 있습니다.";
 return `<section class="card setup-card">
  <header class="setup-header">
   <h2>게임 설정</h2>
   <p class="setup-subtitle">이번 게임의 모드와 규칙을 정해주세요.</p>
  </header>
  <form data-action="settings" class="setup-form">
   <fieldset class="setup-fieldset" ${isHost?"":"disabled"}>
    <legend class="setup-legend">게임 설정 항목</legend>
    <section class="setup-section setup-mode-section">
     <div class="setup-section-heading"><h3 class="setup-section-title">게임 모드</h3><p class="setup-section-description">같은 역할·투표 규칙을 사용하고 진행 방식만 달라집니다.</p></div>
     <div class="game-mode-grid">
      <label class="game-mode-option"><input type="radio" name="gameMode" value="${GAME_MODE.CLASSIC}" ${mode===GAME_MODE.CLASSIC?"checked":""}><span><strong>💬 기본 라이어게임</strong><small>제시어 확인 후 순서대로 말로 설명합니다.</small></span></label>
      <label class="game-mode-option"><input type="radio" name="gameMode" value="${GAME_MODE.DRAWING_SPY}" ${mode===GAME_MODE.DRAWING_SPY?"checked":""}><span><strong>🎨 그림 스파이</strong><small>발언 대신 한 사람씩 공동 그림판에 그림을 추가합니다.</small></span></label>
     </div>
    </section>
    <section class="setup-section drawing-mode-settings">
     <div class="setup-section-heading"><h3 class="setup-section-title">🎨 그림 스파이 규칙</h3><p class="setup-section-description">한 사람의 차례에 적용할 시간과 획 수 규칙입니다.</p></div>
     <div class="setup-rule-grid drawing-rule-grid">
      <label class="setup-control"><span>그림 시간</span><input name="drawingTimeLimit" type="number" min="5" max="60" value="${Number(g.drawing_time_limit||15)}"><small>1인당 5~60초</small></label>
      <label class="setup-control drawing-stroke-limit-control ${unlimitedStrokes?"is-unlimited":""}"><span>최대 획 수</span><input name="drawingStrokeLimit" type="number" min="1" max="10" value="${Number(g.drawing_stroke_limit||3)}" ${unlimitedStrokes?"readonly":""}><small>${unlimitedStrokes?"무제한 모드에서는 사용하지 않습니다.":"1인당 1~10획"}</small></label>
     </div>
     <label class="setup-setting-row drawing-unlimited-row">
      <span class="setup-setting-copy"><strong>획 수 무제한</strong><small>켜면 획 수 제한 없이 설정된 시간 동안 자유롭게 그릴 수 있습니다. 시간 종료 또는 그림 완료 버튼으로 다음 차례로 넘어갑니다.</small></span>
      <input name="drawingStrokeUnlimited" type="checkbox" ${unlimitedStrokes?"checked":""}>
     </label>
     <p class="drawing-mode-hint">기본 추천은 <strong>15초 · 3획</strong>입니다. 자유롭게 그리는 방식은 <strong>획 수 무제한</strong>을 켜고 시간으로 난이도를 조절하세요.</p>
    </section>
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
      <label class="setup-control"><span>라이어 / 스파이 수</span><input name="liarCount" type="number" min="1" max="3" value="${g.liar_count}"><small>1~3명 자유 설정 · 현재 인원 권장 ${recommendedLiarCount}명<br>게임 시작 시 최소 2명의 시민이 필요합니다.</small></label>
      <label class="setup-control"><span>추측 횟수</span><input name="guessLimit" type="number" min="1" max="3" value="${g.guess_limit}"><small>라이어/스파이 팀이 공유하는 기회</small></label>
      <label class="setup-control"><span>기본 라이어 발언 시간</span><select name="speakingTimeLimit"><option value="0" ${selected(0,speakingTime)}>무제한</option><option value="15" ${selected(15,speakingTime)}>15초</option><option value="30" ${selected(30,speakingTime)}>30초</option><option value="45" ${selected(45,speakingTime)}>45초</option><option value="60" ${selected(60,speakingTime)}>60초</option></select><small>기본 라이어게임의 1인당 발언 시간</small></label>
      <label class="setup-control"><span>자유토론 시간</span><select name="discussionTimeLimit"><option value="0" ${selected(0,discussionTime)}>무제한</option><option value="60" ${selected(60,discussionTime)}>60초</option><option value="90" ${selected(90,discussionTime)}>90초</option><option value="120" ${selected(120,discussionTime)}>120초</option><option value="180" ${selected(180,discussionTime)}>180초</option></select><small>두 모드 공통 · 종료 후 방장이 투표 시작</small></label>
     </div>
     <p class="phase3-rule-note">발언 시간은 기본 라이어게임에서만 사용됩니다. 그림 스파이는 그림 시간 설정을 따릅니다.</p>
    </section>
    <section class="setup-section">
     <div class="setup-section-heading"><h3 class="setup-section-title">역할 정보</h3></div>
     <label class="setup-setting-row">
      <span class="setup-setting-copy"><strong>라이어/스파이에게 카테고리 공개</strong><small>켜면 카테고리만 공개하며, 제시어는 항상 숨겨집니다. 끄면 카테고리와 제시어를 모두 공개하지 않습니다.</small></span>
      <input name="showCategoryToLiar" type="checkbox" ${g.show_category_to_liar?"checked":""}>
     </label>
     <label class="setup-setting-row">
      <span class="setup-setting-copy"><strong>다중 라이어/스파이는 서로 정체 알기</strong><small>2명 이상일 때 서로 같은 팀의 닉네임을 역할 화면에서 확인합니다. 끄면 기존처럼 서로의 정체도 모릅니다.</small></span>
      <input name="liarsKnowEachOther" type="checkbox" ${liarsKnowEachOther?"checked":""}>
     </label>
    </section>
   </fieldset>
   <p class="start-readiness ${canStart?"is-ready":""}" role="status" aria-live="polite">${startStatus}</p>
   ${isHost?`<div class="setup-actions"><button type="submit" class="secondary">설정 저장</button><button type="button" data-action="start-round" ${canStart?"":"disabled"}>게임 시작</button></div>`:`<p class="muted setup-host-notice">방장만 설정하고 게임을 시작할 수 있습니다.</p>`}
  </form>
 </section>`;
}
