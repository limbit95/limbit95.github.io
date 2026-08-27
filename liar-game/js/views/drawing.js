import { escapeHTML } from "../constants.js";

const orderTrackItem=(player,position,index,meId,submittedIds)=>{
 const state=position<index?"done":position===index?"current":"upcoming";
 const missed=state==="done"&&!submittedIds.has(String(player.id));
 const marker=missed?"⏰":state==="done"?"✓":state==="current"?"🎨":String(position+1);
 const label=missed?"미제출":state==="done"?"완료":state==="current"?"NOW":"대기";
 return `<li class="drawing-turn-track-item is-${missed?"missed":state}" ${state==="current"?'aria-current="step"':""}>
  <span class="drawing-turn-track-marker" aria-hidden="true">${marker}</span>
  <span class="drawing-turn-track-copy"><strong>${escapeHTML(player.nickname_snapshot)}</strong><small>${player.player_id===meId?`나 · ${label}`:label}</small></span>
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
 const next=ordered[index+1];
 const drawing=s.drawing||{};
 const runoff=drawing.is_runoff===true;
 const drawingStageNo=Number(drawing.drawing_stage_no||0);
 const submittedIds=new Set((Array.isArray(drawing.strokes)?drawing.strokes:[]).filter(stroke=>Number(stroke.drawing_stage_no||0)===drawingStageNo).map(stroke=>String(stroke.round_player_id||"")));
 const strokeLimit=Number(drawing.stroke_limit||s.round.drawing_stroke_limit_snapshot||3);
 const unlimitedStrokes=drawing.stroke_unlimited===true;
 const used=Number(drawing.current_stroke_count||0);
 const remaining=unlimitedStrokes?null:Math.max(0,strokeLimit-used);
 const isCurrentDrawer=current?.player_id===s.me?.player_id;
 const canDraw=isCurrentDrawer&&(unlimitedStrokes||remaining>0);
 const canAdvance=isCurrentDrawer||isHost;
 const orderTrack=ordered.map((player,position)=>orderTrackItem(player,position,index,s.me?.player_id,submittedIds)).join("");
 const guide=isCurrentDrawer
  ?unlimitedStrokes
   ?`내 차례입니다. 3초 준비 후 <strong>${Number(drawing.time_limit||15)}초</strong> 동안 자유롭게 그릴 수 있습니다.`
   :runoff
    ?`동률 후보 추가 그림입니다. 3초 준비 후 <strong>${Number(drawing.time_limit||10)}초 · ${strokeLimit}획</strong> 안에서 마지막 힌트를 남겨보세요.`
    :`내 차례입니다. 3초 준비 후 시작하며 손이나 마우스를 떼면 <strong>1획</strong>으로 저장됩니다.`
  :`${escapeHTML(current?.nickname_snapshot||"현재 참가자")}님의 차례입니다. 3초 준비 후 그림이 시작됩니다.`;
 const strokeText=unlimitedStrokes?`${used}획 · ∞`:`${remaining} / ${strokeLimit}`;
 const strokeBadge=unlimitedStrokes
  ?`<span>사용 획 <strong data-drawing-strokes>${strokeText}</strong></span>`
  :`<span>남은 획 <strong data-drawing-strokes>${strokeText}</strong></span>`;
 const ruleText=runoff
  ?"재투표 동률 후보만 3초 준비 후 추가로 그립니다. 모든 후보가 끝나면 바로 재투표로 이동합니다."
  :unlimitedStrokes
   ?"획 수 제한 없이 그릴 수 있습니다. 시간이 끝나거나 그림 완료 버튼을 누르면 다음 사람에게 넘어갑니다."
   :"시간이 끝나거나 최대 획을 모두 사용하면 자동으로 다음 사람에게 넘어갑니다.";
 const penHint=unlimitedStrokes
  ?"획 수 무제한"
  :runoff
   ?`${strokeLimit}획 추가 그림`
   :"한 번의 터치/드래그가 1획입니다";
 return `<section class="card drawing-stage${runoff?" is-runoff":""}" data-drawing-stage data-current-drawer="${escapeHTML(current?.player_id||"")}">
  <header class="drawing-stage-header">
   <div><span class="speaking-eyebrow">${runoff?"TIE-BREAK DRAWING":"DRAWING SPY"}</span><h2>${runoff?"🎨 동률 후보 추가 그림":"🎨 공동 그림판"}</h2><p>${guide}</p></div>
   <div class="drawing-turn-badges"><span>남은 시간 <strong data-drawing-timer>--</strong></span>${strokeBadge}</div>
  </header>
  <div class="drawing-mobile-hud" aria-live="polite"><span>${runoff?"추가 그림":"현재 차례"}</span><strong>${escapeHTML(current?.nickname_snapshot||"-")}</strong><span class="drawing-mobile-hud-stats"><b data-drawing-timer>--</b><i aria-hidden="true">·</i><b data-drawing-strokes>${escapeHTML(strokeText)}</b></span></div>
  ${runoff?`<p class="notice drawing-runoff-notice">동률 후보 ${ordered.length}명만 추가 그림을 진행합니다. 추가 그림이 끝나면 자유 토론 없이 바로 재투표합니다.</p>`:""}
  <div class="drawing-now-next" aria-live="polite">
   <div class="drawing-now-next-card is-now"><span>${runoff?"🎨 지금 추가 그림":"🎨 지금 그리는 사람"}</span><strong>${escapeHTML(current?.nickname_snapshot||"-")}</strong></div>
   <span class="drawing-now-next-arrow" aria-hidden="true">→</span>
   <div class="drawing-now-next-card is-next"><span>다음 차례</span><strong>${next?escapeHTML(next.nickname_snapshot):"마지막 차례"}</strong></div>
  </div>
  <section class="drawing-turn-track" aria-label="${runoff?"동률 후보 추가 그림 순서":"그림 순서"}">
   <header class="drawing-turn-track-heading"><div><span>${runoff?"추가 그림 순서":"전체 그림 순서"}</span><strong>현재 ${Math.min(index+1,ordered.length)} / ${ordered.length}</strong></div><small>왼쪽부터 차례대로 진행됩니다</small></header>
   <div class="drawing-turn-track-scroll"><ol class="drawing-turn-track-list">${orderTrack}</ol></div>
  </section>
  <div class="drawing-board-shell ${canDraw?"is-active":"is-readonly"}" data-drawing-board-anchor>
   <canvas class="drawing-board" data-drawing-canvas data-can-draw="${canDraw?"true":"false"}" aria-label="그림 스파이 공동 그림판"></canvas>
   <div class="drawing-countdown-overlay" data-drawing-countdown hidden><strong data-drawing-countdown-value>3</strong><span data-drawing-countdown-label>준비!</span></div>
   ${canDraw?`<div class="drawing-board-hint">검정 펜 · ${escapeHTML(penHint)}</div>`:'<div class="drawing-board-hint">현재 차례의 그림을 기다리고 있습니다</div>'}
  </div>
  <p class="drawing-local-status muted" data-drawing-local-status aria-live="polite"></p>
  <aside class="drawing-rule-card"><h3>${runoff?"추가 그림 규칙":"이번 라운드 규칙"}</h3><dl><div><dt>한 사람당 시간</dt><dd>${Number(drawing.time_limit||15)}초</dd></div><div><dt>최대 획</dt><dd>${unlimitedStrokes?"∞ 무제한":`${strokeLimit}획`}</dd></div></dl><p>${ruleText}</p></aside>
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
