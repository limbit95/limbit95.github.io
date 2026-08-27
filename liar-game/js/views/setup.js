import { CATEGORIES, escapeHTML, GAME_MODE, MIN_CITIZENS, MIN_READY_PLAYERS } from "../constants.js";
import { getSetupDraft } from "../setupDraft.js";

const selected=(value,current)=>Number(value)===Number(current)?"selected":"";
const info=(text)=>`<span class="setup-info" tabindex="0" role="button" aria-expanded="false" aria-label="도움말: ${escapeHTML(text)}">i<span class="setup-tooltip" role="tooltip">${escapeHTML(text)}</span></span>`;
const controlTitle=(title,description)=>`<span class="setup-control-title">${escapeHTML(title)}${info(description)}</span>`;
const stepper=(name,value,min,max,step=1,{readonly=false}={})=>`<span class="setup-number-stepper ${readonly?"is-readonly":""}" data-stepper><button type="button" class="setup-stepper-button" data-step-input="${name}" data-step-dir="-1" aria-label="${name} 값 줄이기" ${readonly?"disabled":""}>−</button><input name="${name}" type="number" min="${min}" max="${max}" step="${step}" value="${Number(value)}" readonly inputmode="none" aria-live="polite"><button type="button" class="setup-stepper-button" data-step-input="${name}" data-step-dir="1" aria-label="${name} 값 늘리기" ${readonly?"disabled":""}>+</button></span>`;

export function setupView(s,isHost){
 const g=s.game;
 const d=getSetupDraft(s)||{};
 const readyCount=s.players.filter(player=>player.ready).length;
 const liarCount=Math.max(1,Number(d.liarCount??g.liar_count??1));
 const recommendedLiarCount=readyCount<=4?1:readyCount<=9?2:3;
 const requiredReady=Math.max(MIN_READY_PLAYERS,liarCount+MIN_CITIZENS);
 const missingReady=Math.max(0,requiredReady-readyCount);
 const canStart=missingReady===0;
 const mode=d.gameMode||g.game_mode||GAME_MODE.CLASSIC;
 const unlimitedStrokes=d.drawingStrokeUnlimited===true;
 const speakingTime=Number(d.speakingTimeLimit??g.speaking_time_limit??30);
 const discussionTime=Number(d.discussionTimeLimit??g.discussion_time_limit??90);
 const liarsKnowEachOther=d.liarsKnowEachOther===true;
 const wordSourceMode=["builtin","custom","mixed"].includes(d.wordSourceMode)?d.wordSourceMode:"builtin";
 const customPackName=String(g.custom_word_pack_name||"");
 const customWordCount=Math.max(0,Number(g.custom_word_count||0));
 const customPackId=d.customWordPackId?String(d.customWordPackId):"";
 const categories=Array.isArray(d.selectedCategories)?d.selectedCategories:g.selected_categories;
 const startControl=isHost?`<div class="setup-start-control"><button type="button" class="setup-start-button" data-action="start-round" data-can-start="${canStart?"true":"false"}" ${canStart?"":"disabled"}>${canStart?"게임 시작":`게임 시작까지 ${missingReady}명이 더 필요합니다`}</button></div>`:"";
 return `${startControl}<section class="card setup-card setup-card-v11">
  <header class="setup-header"><h2>게임 설정</h2></header>
  <form data-action="settings" class="setup-form setup-flow-form" data-word-source-mode="${escapeHTML(wordSourceMode)}">
   <fieldset class="setup-fieldset" ${isHost?"":"disabled"}>
    <legend class="setup-legend">게임 설정 항목</legend>

    <section class="setup-section setup-step setup-mode-section">
     <div class="setup-step-heading">
      <span class="setup-step-number">1</span>
      <div class="setup-step-copy"><h3 class="setup-section-title">게임 방식</h3><p class="setup-section-description">먼저 어떤 방식으로 플레이할지 선택하세요.</p></div>
     </div>
     <div class="game-mode-grid">
      <label class="game-mode-option"><input type="radio" name="gameMode" value="${GAME_MODE.CLASSIC}" ${mode===GAME_MODE.CLASSIC?"checked":""}><span><strong>💬 기본 라이어게임</strong><small>말로 제시어를 설명해 라이어를 찾습니다.</small></span></label>
      <label class="game-mode-option"><input type="radio" name="gameMode" value="${GAME_MODE.DRAWING_SPY}" ${mode===GAME_MODE.DRAWING_SPY?"checked":""}><span><strong>🎨 그림 스파이</strong><small>공동 그림으로 스파이를 찾습니다.</small></span></label>
     </div>
    </section>

    <section class="setup-section setup-step setup-word-section">
     <div class="setup-step-heading">
      <span class="setup-step-number">2</span>
      <div class="setup-step-copy"><h3 class="setup-section-title">제시어</h3><p class="setup-section-description">어디에서 제시어를 가져올지 정하고 필요한 범위만 선택하세요.</p></div>
     </div>
     <div class="custom-word-pack-slot" data-custom-word-pack-slot data-host="${isHost?"true":"false"}" data-word-source-mode="${escapeHTML(wordSourceMode)}" data-custom-pack-id="${escapeHTML(customPackId)}" data-custom-pack-name="${escapeHTML(customPackName)}" data-custom-word-count="${customWordCount}">
      <p class="muted custom-pack-loading">${isHost?"내 커스텀 제시어 팩을 불러오는 중…":wordSourceMode==="builtin"?"이번 게임은 기본 제시어를 사용합니다.":`이번 게임은 ${escapeHTML(customPackName||"커스텀 팩")} · ${customWordCount}개 제시어를 ${wordSourceMode==="mixed"?"기본 제시어와 섞어서 ":""}사용합니다.`}</p>
     </div>
     <div class="setup-word-details" data-builtin-word-settings>
      <div class="setup-word-details-heading"><strong>기본 제시어 범위</strong><small>기본 제시어를 사용하는 경우에만 적용됩니다.</small></div>
      <label class="setup-control setup-difficulty-control"><span>난이도</span><div class="setup-difficulty-row"><select name="difficulty"><option value="all" ${String(d.difficulty||g.difficulty)==="all"?"selected":""}>전체</option><option value="easy" ${String(d.difficulty||g.difficulty)==="easy"?"selected":""}>쉬움</option><option value="normal" ${String(d.difficulty||g.difficulty)==="normal"?"selected":""}>보통</option><option value="hard" ${String(d.difficulty||g.difficulty)==="hard"?"selected":""}>어려움</option></select><small>원하는 난이도를 선택하세요.</small></div></label>
      <div class="setup-options-grid setup-category-grid">${CATEGORIES.map(c=>`<label class="category-option"><input type="checkbox" name="category" value="${c}" ${categories.includes(c)?"checked":""}><span>${c}</span></label>`).join("")}</div>
     </div>
    </section>

    <section class="setup-section setup-step setup-role-section">
     <div class="setup-step-heading">
      <span class="setup-step-number">3</span>
      <div class="setup-step-copy"><h3 class="setup-section-title">역할</h3><p class="setup-section-description">라이어·스파이 수와 역할 공개 방식을 정하세요.</p></div>
      <div class="setup-player-info setup-role-summary"><span>준비 완료 <strong>${readyCount}명</strong></span><span>추천 라이어·스파이 <strong>${recommendedLiarCount}명</strong></span></div>
     </div>
     <div class="setup-role-options-grid">
      <label class="setup-control setup-role-count-control"><span>라이어 / 스파이 수</span>${stepper("liarCount",liarCount,1,3)}<small>1~3명 · 시민은 최소 ${MIN_CITIZENS}명이 필요합니다.</small></label>
      <label class="setup-setting-row setup-role-toggle"><span class="setup-setting-copy"><strong>카테고리 공개</strong><small>라이어/스파이에게 카테고리만 보여주고 제시어는 숨깁니다.</small></span><input name="showCategoryToLiar" type="checkbox" ${d.showCategoryToLiar===true?"checked":""}></label>
      <label class="setup-setting-row setup-role-toggle"><span class="setup-setting-copy"><strong>같은 팀 정체 공개</strong><small>라이어/스파이가 2명 이상이면 서로의 닉네임을 확인합니다.</small></span><input name="liarsKnowEachOther" type="checkbox" ${liarsKnowEachOther?"checked":""}></label>
     </div>
    </section>

    <section class="setup-section setup-step setup-progress-section">
     <div class="setup-step-heading">
      <span class="setup-step-number">4</span>
      <div class="setup-step-copy" data-mode-only="classic"><h3 class="setup-section-title">💬 기본 라이어 진행 규칙</h3><p class="setup-section-description">말로 설명하고 토론한 뒤 투표하는 흐름에 맞춰 설정하세요.</p></div>
      <div class="setup-step-copy" data-mode-only="drawing_spy"><h3 class="setup-section-title">🎨 그림 스파이 진행 규칙</h3><p class="setup-section-description">그림 차례와 토론, 투표 흐름에 맞춰 설정하세요.</p></div>
     </div>

     <div class="setup-rule-grid setup-flow-grid">
      <label class="setup-control" data-mode-only="classic">${controlTitle("발언 시간","한 사람의 설명 차례에 적용됩니다.")}<select name="speakingTimeLimit"><option value="0" ${selected(0,speakingTime)}>무제한</option><option value="15" ${selected(15,speakingTime)}>15초</option><option value="30" ${selected(30,speakingTime)}>30초</option><option value="45" ${selected(45,speakingTime)}>45초</option><option value="60" ${selected(60,speakingTime)}>60초</option></select></label>
      <label class="setup-control" data-mode-only="drawing_spy">${controlTitle("그림 시간","한 사람당 5~60초로 설정합니다.")}${stepper("drawingTimeLimit",Number(d.drawingTimeLimit||15),5,60,5)}</label>
      <label class="setup-control drawing-stroke-limit-control ${unlimitedStrokes?"is-unlimited":""}" data-mode-only="drawing_spy">${controlTitle("최대 획 수",unlimitedStrokes?"현재 획 수 무제한 모드입니다.":"한 사람당 1~10획으로 설정합니다.")}${stepper("drawingStrokeLimit",Number(d.drawingStrokeLimit||3),1,10,1,{readonly:unlimitedStrokes})}</label>
      <label class="setup-control">${controlTitle("자유토론 시간","토론 종료 후 방장이 투표를 시작합니다.")}<select name="discussionTimeLimit"><option value="0" ${selected(0,discussionTime)}>무제한</option><option value="60" ${selected(60,discussionTime)}>60초</option><option value="90" ${selected(90,discussionTime)}>90초</option><option value="120" ${selected(120,discussionTime)}>120초</option><option value="180" ${selected(180,discussionTime)}>180초</option></select></label>
      <label class="setup-control">${controlTitle("제시어 추측 횟수","붙잡힌 라이어/스파이 팀이 함께 공유하는 추측 기회입니다.")}${stepper("guessLimit",Number(d.guessLimit||1),1,3)}</label>
     </div>

     <label class="setup-setting-row drawing-unlimited-row" data-mode-only="drawing_spy"><span class="setup-setting-copy"><strong>획 수 무제한</strong><small>시간 안에 자유롭게 그리고 완료하면 다음 차례로 넘어갑니다.</small></span><input name="drawingStrokeUnlimited" type="checkbox" ${unlimitedStrokes?"checked":""}></label>
     <p class="drawing-mode-hint" data-mode-only="drawing_spy">기본 추천은 <strong>15초 · 3획</strong>입니다.</p>
    </section>
   </fieldset>
   ${isHost?"":`<p class="muted setup-host-notice">방장만 설정할 수 있습니다.</p>`}
  </form>
 </section>`;
}
