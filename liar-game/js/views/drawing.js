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

export function drawingView(s,isHost){
 const index=Number(s.round.current_speaker_index||0);
 const ordered=[...s.round_players].sort((a,b)=>Number(a.turn_order)-Number(b.turn_order));
 const current=ordered[index];
 const drawing=s.drawing||{};
 const strokeLimit=Number(drawing.stroke_limit||s.round.drawing_stroke_limit_snapshot||3);
 const unlimitedStrokes=drawing.stroke_unlimited===true||s.round.drawing_stroke_unlimited_snapshot===true;
 const used=Number(drawing.current_stroke_count||0);
 const remaining=unlimitedStrokes?null:Math.max(0,strokeLimit-used);
 const isCurrentDrawer=current?.player_id===s.me?.player_id;
 const canDraw=isCurrentDrawer&&(unlimitedStrokes||remaining>0);
 const canAdvance=isCurrentDrawer||isHost;
 const orderList=ordered.map((player,position)=>orderItem(player,position,index,s.me?.player_id)).join("");
 const guide=isCurrentDrawer
  ?unlimitedStrokes
   ?`내 차례입니다. 획 수 제한 없이 <strong>${Number(drawing.time_limit||15)}초</strong> 동안 자유롭게 그릴 수 있습니다.`
   :`내 차례입니다. 한 번 눌러 그리기 시작해 손이나 마우스를 떼면 <strong>1획</strong>으로 저장됩니다.`
  :`${escapeHTML(current?.nickname_snapshot||"현재 참가자")}님이 그림을 그리고 있습니다.`;
 const strokeBadge=unlimitedStrokes
  ?`<span>사용 획 <strong data-drawing-strokes>${used}획 · ∞</strong></span>`
  :`<span>남은 획 <strong data-drawing-strokes>${remaining} / ${strokeLimit}</strong></span>`;
 const ruleText=unlimitedStrokes
  ?"획 수 제한 없이 그림을 그릴 수 있습니다. 시간이 끝나거나 그림 완료 버튼을 누르면 다음 사람에게 넘어갑니다."
  :"시간이 끝나거나 최대 획을 모두 사용하면 자동으로 다음 사람에게 넘어갑니다.";
 return `<section class="card drawing-stage" data-drawing-stage>
  <header class="drawing-stage-header">
   <div><span class="speaking-eyebrow">DRAWING SPY</span><h2>🎨 공동 그림판</h2><p>${guide}</p></div>
   <div class="drawing-turn-badges"><span>남은 시간 <strong data-drawing-timer>--</strong></span>${strokeBadge}</div>
  </header>
  <div class="drawing-current"><span>현재 그림 차례</span><strong>${escapeHTML(current?.nickname_snapshot||"-")}</strong></div>
  <div class="drawing-board-shell ${canDraw?"is-active":"is-readonly"}">
   <canvas class="drawing-board" data-drawing-canvas data-can-draw="${canDraw?"true":"false"}" aria-label="그림 스파이 공동 그림판"></canvas>
   ${canDraw?`<div class="drawing-board-hint">검정 펜 · ${unlimitedStrokes?"획 수 무제한":"한 번의 터치/드래그가 1획입니다"}</div>`:'<div class="drawing-board-hint">현재 차례의 그림을 기다리고 있습니다</div>'}
  </div>
  <p class="drawing-local-status muted" data-drawing-local-status aria-live="polite"></p>
  <div class="drawing-layout-bottom">
   <div><h3>그림 순서</h3><ol class="speaker-order-list drawing-order-list">${orderList}</ol></div>
   <aside class="drawing-rule-card"><h3>이번 라운드 규칙</h3><dl><div><dt>한 사람당 시간</dt><dd>${Number(drawing.time_limit||15)}초</dd></div><div><dt>최대 획</dt><dd>${unlimitedStrokes?"∞ 무제한":`${strokeLimit}획`}</dd></div></dl><p>${ruleText}</p></aside>
  </div>
  ${canAdvance?`<div class="drawing-actions"><button type="button" class="secondary" data-action="finish-drawing-turn">${isCurrentDrawer?"그림 완료 · 다음 사람":"방장 · 다음 사람으로 넘기기"}</button></div>`:""}
 </section>`;
}

export function drawingPreviewView(s){
 if(!s?.drawing)return "";
 return `<section class="drawing-preview-card" aria-label="완성된 공동 그림"><div class="drawing-preview-heading"><span>🎨 공동 그림</span><small>그림 단계에서 완성된 그림입니다.</small></div><div class="drawing-board-shell is-readonly is-preview"><canvas class="drawing-board" data-drawing-canvas data-can-draw="false" aria-label="완성된 공동 그림"></canvas></div></section>`;
}