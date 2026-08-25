import { escapeHTML } from "../constants.js";

const orderItem=(player,position,index,meId)=>{
 const state=position<index?"done":position===index?"current":"upcoming";
 const stateLabel=state==="done"?"✓ 완료":state==="current"?"🎨 DRAW":"대기";
 return `<li class="speaker-order-item drawing-order-item is-${state}">
  <span class="speaker-order-number">${position+1}</span>
  <span class="speaker-order-copy"><strong>${escapeHTML(player.nickname_snapshot)}</strong>${player.player_id===meId?'<small>나</small>':""}</span>
  <span class="speaker-order-state">${stateLabel}</span>
 </li>`;
};

function drawingOrder(s){
 const all=[...s.round_players].sort((a,b)=>Number(a.turn_order)-Number(b.turn_order));
 const drawing=s.drawing||{};
 const candidateIds=Array.isArray(drawing.candidate_round_player_ids)?drawing.candidate_round_player_ids.map(String):[];
 return drawing.is_runoff===true&&candidateIds.length
  ?all.filter(player=>candidateIds.includes(String(player.id)))
  :all;
}

export function drawingView(s,isHost){
 const index=Number(s.round.current_speaker_index||0);
 const ordered=drawingOrder(s);
 const current=ordered[index];
 const drawing=s.drawing||{};
 const runoff=drawing.is_runoff===true;
 const strokeLimit=Number(drawing.stroke_limit||s.round.drawing_stroke_limit_snapshot||3);
 const unlimitedStrokes=drawing.stroke_unlimited===true;
 const used=Number(drawing.current_stroke_count||0);
 const remaining=unlimitedStrokes?null:Math.max(0,strokeLimit-used);
 const isCurrentDrawer=current?.player_id===s.me?.player_id;
 const canDraw=isCurrentDrawer&&(unlimitedStrokes||remaining>0);
 const canAdvance=isCurrentDrawer||isHost;
 const orderList=ordered.map((player,position)=>orderItem(player,position,index,s.me?.player_id)).join("");
 const guide=isCurrentDrawer
  ?unlimitedStrokes
   ?`내 차례입니다. 획 수 제한 없이 <strong>${Number(drawing.time_limit||15)}초</strong> 동안 자유롭게 그릴 수 있습니다.`
   :runoff
    ?`동률 후보 추가 그림 차례입니다. <strong>${Number(drawing.time_limit||10)}초 · ${strokeLimit}획</strong> 안에서 마지막 힌트를 남겨보세요.`
    :`내 차례입니다. 한 번 눌러 그리기 시작해 손이나 마우스를 떼면 <strong>1획</strong>으로 저장됩니다.`
  :`${escapeHTML(current?.nickname_snapshot||"현재 참가자")}님이 그림을 그리고 있습니다.`;
 const strokeBadge=unlimitedStrokes
  ?`<span>사용 획 <strong data-drawing-strokes>${used}획 · ∞</strong></span>`
  :`<span>남은 획 <strong data-drawing-strokes>${remaining} / ${strokeLimit}</strong></span>`;
 const ruleText=runoff
  ?"재투표 동률 후보만 추가로 그립니다. 모든 후보가 끝나면 바로 재투표로 이동합니다."
  :unlimitedStrokes
   ?"획 수 제한 없이 그림을 그릴 수 있습니다. 시간이 끝나거나 그림 완료 버튼을 누르면 다음 사람에게 넘어갑니다."
   :"시간이 끝나거나 최대 획을 모두 사용하면 자동으로 다음 사람에게 넘어갑니다.";
 const penHint=unlimitedStrokes
  ?"획 수 무제한"
  :runoff
   ?`${strokeLimit}획 추가 그림`
   :"한 번의 터치/드래그가 1획입니다";
 return `<section class="card drawing-stage${runoff?" is-runoff":""}" data-drawing-stage>
  <header class="drawing-stage-header">
   <div><span class="speaking-eyebrow">${runoff?"TIE-BREAK DRAWING":"DRAWING SPY"}</span><h2>${runoff?"🎨 동률 후보 추가 그림":"🎨 공동 그림판"}</h2><p>${guide}</p></div>
   <div class="drawing-turn-badges"><span>남은 시간 <strong data-drawing-timer>--</strong></span>${strokeBadge}</div>
  </header>
  ${runoff?`<p class="notice drawing-runoff-notice">동률 후보 ${ordered.length}명만 추가 그림을 진행합니다. 추가 그림이 끝나면 자유 토론 없이 바로 재투표합니다.</p>`:""}
  <div class="drawing-current"><span>${runoff?"현재 추가 그림":"현재 그림 차례"}</span><strong>${escapeHTML(current?.nickname_snapshot||"-")}</strong></div>
  <div class="drawing-board-shell ${canDraw?"is-active":"is-readonly"}">
   <canvas class="drawing-board" data-drawing-canvas data-can-draw="${canDraw?"true":"false"}" aria-label="그림 스파이 공동 그림판"></canvas>
   ${canDraw?`<div class="drawing-board-hint">검정 펜 · ${escapeHTML(penHint)}</div>`:'<div class="drawing-board-hint">현재 차례의 그림을 기다리고 있습니다</div>'}
  </div>
  <p class="drawing-local-status muted" data-drawing-local-status aria-live="polite"></p>
  <div class="drawing-layout-bottom">
   <div><h3>${runoff?"동률 후보 순서":"그림 순서"}</h3><ol class="speaker-order-list drawing-order-list">${orderList}</ol></div>
   <aside class="drawing-rule-card"><h3>${runoff?"추가 그림 규칙":"이번 라운드 규칙"}</h3><dl><div><dt>한 사람당 시간</dt><dd>${Number(drawing.time_limit||15)}초</dd></div><div><dt>최대 획</dt><dd>${unlimitedStrokes?"∞ 무제한":`${strokeLimit}획`}</dd></div></dl><p>${ruleText}</p></aside>
  </div>
  ${canAdvance?`<div class="drawing-actions"><button type="button" class="secondary" data-action="finish-drawing-turn">${isCurrentDrawer?"그림 완료 · 다음 사람":"방장 · 다음 사람으로 넘기기"}</button></div>`:""}
 </section>`;
}

export function drawingPreviewView(s,{title="🎨 공동 그림",description="그림 단계에서 완성된 그림입니다.",className=""}={}){
 if(!s?.drawing)return "";
 return `<section class="drawing-preview-card ${escapeHTML(className)}" aria-label="완성된 공동 그림"><div class="drawing-preview-heading"><span>${escapeHTML(title)}</span><small>${escapeHTML(description)}</small></div><div class="drawing-board-shell is-readonly is-preview"><canvas class="drawing-board" data-drawing-canvas data-can-draw="false" aria-label="완성된 공동 그림"></canvas></div></section>`;
}

export function drawingResultExperienceView(s){
 const strokes=Array.isArray(s?.drawing?.strokes)?s.drawing.strokes:[];
 if(!s?.drawing||!strokes.length)return "";
 return `<section class="drawing-result-experience" data-result-section>
  <h3>🎨 완성된 공동 그림</h3>
  <div class="drawing-board-shell is-readonly is-preview drawing-result-board"><canvas class="drawing-board" data-drawing-canvas data-can-draw="false" aria-label="최종 공동 그림"></canvas></div>
  <div class="drawing-replay-controls"><button type="button" class="secondary" data-drawing-replay-start>▶ 그림 과정 다시 보기</button><span class="muted">누가 어떤 순서로 그림을 더했는지 획 단위로 재생합니다.</span></div>
  <div class="drawing-replay-panel" data-drawing-replay-panel hidden>
   <div class="drawing-replay-meta"><span data-drawing-replay-stage>최초 그림</span><strong data-drawing-replay-player>준비 중…</strong></div>
   <div class="drawing-board-shell is-readonly is-preview"><canvas class="drawing-board drawing-replay-canvas" data-drawing-replay-canvas aria-label="공동 그림 리플레이"></canvas></div>
   <div class="drawing-replay-progress"><span data-drawing-replay-progress>0 / ${strokes.length}획</span><button type="button" class="secondary" data-drawing-replay-restart>처음부터</button></div>
  </div>
 </section>`;
}
