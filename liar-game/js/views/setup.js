import { CATEGORIES, escapeHTML, GAME_MODE, MIN_CITIZENS, MIN_READY_PLAYERS } from "../constants.js";

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
 const wordSourceMode=["builtin","custom","mixed"].includes(g.word_source_mode)?g.word_source_mode:"builtin";
 const customPackName=String(g.custom_word_pack_name||"");
 const customWordCount=Math.max(0,Number(g.custom_word_count||0));
 const startStatus=!hasEnoughPlayers
  ?`게임 시작까지 ${MIN_READY_PLAYERS-readyCount}명이 더 필요합니다.`
  :!hasEnoughCitizens
   ?`현재 설정에서는 시민이 ${Math.max(0,citizenCount)}명입니다. 게임 시작에는 최소 ${MIN_CITIZENS}명의 시민이 필요합니다.`
   :"게임을 시작할 수 있습니다.";
 return `<section class="card setup-card setup-card-v11">
  <header class="setup-header">
   <h2>게임 설정</h2>
   <p class="setup-subtitle">위에서부터 차례대로 정하면 바로 시작할 수 있어요.</p>
  </header>
  <form data-action="settings" class="setup-form setup-flow-form" data-word-source-mode="${escapeHTML(wordSourceMode)}">
   <fieldset class="setup-fieldset" ${isHost?"":"disabled"}>
    <legend class="setup-legend">게임 설정 항목</legend>

    <section class="setup-section setup-step setup-mode-section">
     <div class="setup-step-heading">
      <span class="setup-step-number">1</span>
      <div class="setup-step-copy">
       <h3 class="setup-section-title">게임 방식</h3>
       <p class="setup-section-description">먼저 어떤 방식으로 플레이할지 선택하세요.</p>
      </div>
     </div>
     <div class="game-mode-grid">
      <label class="game-mode-option"><input type="radio" name="gameMode" value="${GAME_MODE.CLASSIC}" ${mode===GAME_MODE.CLASSIC?"checked":""}><span><strong>💬 기본 라이어게임</strong><small>말로 제시어를 설명해 라이어를 찾습니다.</small></span></label>
      <label class="game-mode-option"><input type="radio" name="gameMode" value="${GAME_MODE.DRAWING_SPY}" ${mode===GAME_MODE.DRAWING_SPY?"checked":""}><span><strong>🎨 그림 스파이</strong><small>공동 그림으로 스파이를 찾습니다.</small></span></label>
     </div>
    </section>

    <section class="setup-section setup-step setup-word-section">
     <div class="setup-step-heading">
      <span class="setup-step-number">2</span>
      <div class="setup-step-copy">
       <h3 class="setup-section-title">제시어</h3>
       <p class="setup-section-description">어디에서 제시어를 가져올지 정하고 필요한 범위만 선택하세요.</p>
      </div>
     </div>
     <div class="custom-word-pack-slot" data-custom-word-pack-slot data-host="${isHost?"true":"false"}" data-word-source-mode="${escapeHTML(wordSourceMode)}" data-custom-pack-name="${escapeHTML(customPackName)}" data-custom-word-count="${customWordCount}">
      <p class="muted custom-pack-loading">${isHost?"내 커스텀 제시어 팩을 불러오는 중…":wordSourceMode==="builtin"?"이번 게임은 기본 제시어를 사용합니다.":`이번 게임은 ${escapeHTML(customPackName||"커스텀 팩")} · ${customWordCount}개 제시어를 ${wordSourceMode==="mixed"?"기본 제시어와 섞어서 ":""}사용합니다.`}</p>
     </div>
     <div class="setup-word-details" data-builtin-word-settings>
      <div class="setup-word-details-heading">
       <strong>기본 제시어 범위</strong>
       <small>기본 제시어를 사용하는 경우에만 적용됩니다.</small>
      </div>
      <label class="setup-control setup-difficulty-control"><span>난이도</span><select name="difficulty"><option value="all" ${g.difficulty==="all"?"selected":""}>전체</option><option value="easy" ${g.difficulty==="easy"?"selected":""}>쉬움</option><option value="normal" ${g.difficulty==="normal"?"selected":""}>보통</option><option value="hard" ${g.difficulty==="hard"?"selected":""}>어려움</option></select><small>원하는 난이도를 선택하세요.</small></label>
      <div class="setup-options-grid setup-category-grid">${CATEGORIES.map(c=>`<label class="category-option"><input type="checkbox" name="category" value="${c}" ${g.selected_categories.includes(c)?"checked":""}> <span>${c}</span></label>`).join("")}</div>
     </div>
    </section>

    <section class="setup-section setup-step">
     <div class="setup-step-heading">
      <span class="setup-step-number">3</span>
      <div class="setup-step-copy">
       <h3 class="setup-section-title">역할</h3>
       <p class="setup-section-description">라이어·스파이 수와 역할 공개 방식을 정하세요.</p>
      </div>
      <div class="setup-player-info"><span>준비 <strong>${readyCount}명</strong></span><span>권장 <strong>${recommendedLiarCount}명</strong></span></div>
     </div>
     <div class="setup-role-grid">
      <label class="setup-control"><span>라이어 / 스파이 수</span><input name="liarCount" type="number" min="1" max="3" value="${g.liar_count}"><small>1~3명 · 시민은 최소 ${MIN_CITIZENS}명이 필요합니다.</small></label>
     </div>
     <div class="setup-toggle-stack">
      <label class="setup-setting-row">
       <span class="setup-setting-copy"><strong>카테고리 공개</strong><small>라이어/스파이에게 카테고리만 보여주고 제시어는 숨깁니다.</small></span>
       <input name="showCategoryToLiar" type="checkbox" ${g.show_category_to_liar?"checked":""}>
      </label>
      <label class="setup-setting-row">
       <span class="setup-setting-copy"><strong>같은 팀 정체 공개</strong><small>라이어/스파이가 2명 이상이면 서로의 닉네임을 확인합니다.</small></span>
       <input name="liarsKnowEachOther" type="checkbox" ${liarsKnowEachOther?"checked":""}>
      </label>
     </div>
    </section>

    <section class="setup-section setup-step setup-progress-section">
     <div class="setup-step-heading">
      <span class="setup-step-number">4</span>
      <div class="setup-step-copy" data-mode-only="classic">
       <h3 class="setup-section-title">💬 기본 라이어 진행 규칙</h3>
       <p class="setup-section-description">말로 설명하고 토론한 뒤 투표하는 흐름에 맞춰 설정하세요.</p>
      </div>
      <div class="setup-step-copy" data-mode-only="drawing_spy">
       <h3 class="setup-section-title">🎨 그림 스파이 진행 규칙</h3>
       <p class="setup-section-description">그림 차례와 토론, 투표 흐름에 맞춰 설정하세요.</p>
      </div>
     </div>

     <div class="setup-rule-grid setup-flow-grid">
      <label class="setup-control" data-mode-only="classic"><span>발언 시간</span><select name="speakingTimeLimit"><option value="0" ${selected(0,speakingTime)}>무제한</option><option value="15" ${selected(15,speakingTime)}>15초</option><option value="30" ${selected(30,speakingTime)}>30초</option><option value="45" ${selected(45,speakingTime)}>45초</option><option value="60" ${selected(60,speakingTime)}>60초</option></select><small>한 사람의 설명 차례에 적용됩니다.</small></label>

      <label class="setup-control" data-mode-only="drawing_spy"><span>그림 시간</span><input name="drawingTimeLimit" type="number" min="5" max="60" value="${Number(g.drawing_time_limit||15)}"><small>한 사람당 5~60초</small></label>
      <label class="setup-control drawing-stroke-limit-control ${unlimitedStrokes?"is-unlimited":""}" data-mode-only="drawing_spy"><span>최대 획 수</span><input name="drawingStrokeLimit" type="number" min="1" max="10" value="${Number(g.drawing_stroke_limit||3)}" ${unlimitedStrokes?"readonly":""}><small>${unlimitedStrokes?"무제한 모드에서는 사용하지 않습니다.":"한 사람당 1~10획"}</small></label>

      <label class="setup-control"><span>자유토론 시간</span><select name="discussionTimeLimit"><option value="0" ${selected(0,discussionTime)}>무제한</option><option value="60" ${selected(60,discussionTime)}>60초</option><option value="90" ${selected(90,discussionTime)}>90초</option><option value="120" ${selected(120,discussionTime)}>120초</option><option value="180" ${selected(180,discussionTime)}>180초</option></select><small>토론 종료 후 방장이 투표를 시작합니다.</small></label>
      <label class="setup-control"><span>제시어 추측 횟수</span><input name="guessLimit" type="number" min="1" max="3" value="${g.guess_limit}"><small>붙잡힌 라이어/스파이 팀이 공유하는 기회입니다.</small></label>
     </div>

     <label class="setup-setting-row drawing-unlimited-row" data-mode-only="drawing_spy">
      <span class="setup-setting-copy"><strong>획 수 무제한</strong><small>시간 안에 자유롭게 그리고 완료하면 다음 차례로 넘어갑니다.</small></span>
      <input name="drawingStrokeUnlimited" type="checkbox" ${unlimitedStrokes?"checked":""}>
     </label>
     <p class="drawing-mode-hint" data-mode-only="drawing_spy">기본 추천은 <strong>15초 · 3획</strong>입니다.</p>
    </section>
   </fieldset>

   <p class="start-readiness ${canStart?"is-ready":""}" role="status" aria-live="polite">${startStatus}</p>
   ${isHost?`<div class="setup-actions"><button type="submit" class="secondary">설정 저장</button><button type="button" data-action="start-round" ${canStart?"":"disabled"}>게임 시작</button></div>`:`<p class="muted setup-host-notice">방장만 설정하고 게임을 시작할 수 있습니다.</p>`}
  </form>
 </section>`;
}
