import { escapeHTML, GAME_MODE } from "../constants.js";
import { store } from "../store.js";
import { drawingPreviewView } from "./drawing.js";

const section=(title,body)=>`<div class="result-section" data-result-section><h3>${title}</h3>${body}</div>`;
const stageTitle=s=>s.kind==="original"?"1차 투표":`재투표 ${Math.max(1,Number(s.stage_no)-1)}`;
const names=(players=[],hidden="-")=>players.length?players.map(p=>`<span class="result-name-chip">${escapeHTML(p.nickname)}</span>`).join(""):`<span class="result-name-chip is-hidden">${hidden}</span>`;
const modeOf=mode=>mode||store.get().snapshot?.game?.game_mode||GAME_MODE.CLASSIC;
const gameStatsSlot=context=>`<section class="game-stats-slot" data-game-stats data-game-stats-context="${context}" aria-live="polite"><p class="muted game-stats-loading">게임 기록을 불러오는 중…</p></section>`;

function voteHistory(stages=[],liarCount=1,hiddenRoleName="라이어"){
 return section("🗳️ 투표 과정",`<div class="result-vote-history">${stages.map(s=>`<article class="result-vote-stage"><header class="result-vote-stage-header"><h4>${stageTitle(s)}</h4><span>${hiddenRoleName}: ${Number(liarCount)}명</span></header><h5>득표 결과</h5><ul class="result-vote-tally">${(s.tally||[]).map(x=>`<li><span>${escapeHTML(x.nickname)}</span><strong>${Number(x.votes)}표</strong></li>`).join("")}</ul><h5>투표 상세</h5><div class="result-vote-ballots">${(s.ballot_details||[]).map(b=>`<div><strong>${escapeHTML(b.voter)}</strong><span>→</span><span>${(b.targets||[]).map(t=>escapeHTML(t.nickname)).join(", ")||"선택 없음"}</span></div>`).join("")}</div>${s.runoff_required?`<div class="result-runoff-summary"><strong>재투표 발생</strong><p>확정된 지목: ${(s.stage_winners||[]).map(x=>escapeHTML(x.nickname)).join(", ")||"없음"}</p><p>동률 후보: ${(s.boundary_candidates||[]).map(x=>escapeHTML(x.nickname)).join(", ")}</p><p>남은 자리: ${Number(s.remaining_seats)}명</p></div>`:""}${(s.locked_winners||[]).length?`<p class="result-locked">이전 단계 확정: ${s.locked_winners.map(x=>escapeHTML(x.nickname)).join(", ")}</p>`:""}</article>`).join("")||'<p class="notice">투표 기록을 확인할 수 없습니다.</p>'}</div>`);
}

function comparison(r,revealed,hiddenRoleName){
 return `<section class="result-comparison" data-result-section aria-label="최종 지목과 실제 ${hiddenRoleName} 비교">
  <article class="result-comparison-card is-picked"><span class="result-comparison-label">🔍 최종 지목</span><div class="result-comparison-names">${names(r?.final_suspects||[],"없음")}</div></article>
  <div class="result-comparison-vs" aria-hidden="true">VS</div>
  <article class="result-comparison-card is-liar"><span class="result-comparison-label">🎭 실제 ${hiddenRoleName}</span><div class="result-comparison-names">${revealed?names(r?.actual_liars||[],"확인 불가"):names([],"공개 대기")}</div></article>
 </section>`;
}

function drawingResultExperience(s){
 const strokes=Array.isArray(s?.drawing?.strokes)?s.drawing.strokes:[];
 if(!s?.drawing||!strokes.length)return "";
 const preview=drawingPreviewView(s);
 return `<section class="drawing-result-experience" data-result-section>
  <h3>🎨 완성된 공동 그림</h3>
  ${preview}
  <div class="drawing-replay-controls"><button type="button" class="secondary" data-drawing-replay-start>▶ 그림 과정 다시 보기</button><span class="muted">누가 어떤 순서로 그림을 더했는지 획 단위로 재생합니다.</span></div>
  <div class="drawing-replay-panel" data-drawing-replay-panel hidden>
   <div class="drawing-replay-meta"><span data-drawing-replay-stage>최초 그림</span><strong data-drawing-replay-player>준비 중…</strong></div>
   <div class="drawing-board-shell is-readonly is-preview"><canvas class="drawing-board drawing-replay-canvas" data-drawing-replay-canvas aria-label="공동 그림 리플레이"></canvas></div>
   <div class="drawing-replay-progress"><span data-drawing-replay-progress>0 / ${strokes.length}획</span><button type="button" class="secondary" data-drawing-replay-restart>처음부터</button></div>
  </div>
 </section>`;
}

export function resultView(r,isHost,gameMode){
 const resolvedMode=modeOf(gameMode);const drawingMode=resolvedMode===GAME_MODE.DRAWING_SPY;const hiddenRoleName=drawingMode?"스파이":"라이어";
 const citizen=r?.winner==="citizen",revealed=r?.liars_revealed===true,captureSucceeded=r?.capture_succeeded===true;
 const reasons={CAPTURE_FAILED:`시민의 지목을 피해 ${hiddenRoleName}가 승리했습니다.`,GUESS_CORRECT:`${hiddenRoleName}가 제시어를 맞혀 역전했습니다.`,GUESSES_EXHAUSTED:`시민이 ${hiddenRoleName}를 찾아내고 제시어까지 지켜냈습니다.`};
 const guesses=Array.isArray(r?.guesses)?r.guesses:[];
 const guessSection=captureSucceeded?section(`🎯 ${hiddenRoleName} 제시어 추측`,guesses.length?`<ol class="result-guess-list">${guesses.map(g=>`<li><strong>${Number(g.attempt_no)}회차 · ${escapeHTML(g.guesser)}</strong><blockquote>“${escapeHTML(g.guess_text)}”</blockquote><span class="${g.is_correct?"success":"error"}">${g.is_correct?"✅ 정답":"❌ 오답"}</span></li>`).join("")}</ol>`:'<p class="notice">추측 기록을 확인할 수 없습니다.</p>'):"";
 const drawingSection=drawingMode?drawingResultExperience(store.get().snapshot):"";
 let action="";
 if(citizen||captureSucceeded||revealed)action=isHost?'<button data-action="prepare-next-round">다음 라운드 준비</button><button class="secondary" data-action="restart-game">새 게임 · 설정 변경</button>':'<p class="muted">방장이 다음 라운드 또는 새 게임을 준비할 때까지 기다려 주세요.</p>';
 return `<section class="card result-card ${citizen?"result-citizen":"result-liar"}" data-result-card data-result-id="${escapeHTML(r?.round_id||"")}" data-result-round="${Number(r?.round_no||0)}" data-result-winner="${citizen?"citizen":"liar"}" data-game-mode="${escapeHTML(resolvedMode)}" data-capture-succeeded="${captureSucceeded?"true":"false"}" data-liars-revealed="${revealed?"true":"false"}" data-finished-at="${escapeHTML(r?.finished_at||"")}" data-server-now="${escapeHTML(r?.server_now||"")}"><header class="result-hero"><h2 class="result-title" data-result-title>${citizen?"🏆 시민 승리!":`🎭 ${hiddenRoleName} 승리!`}</h2><strong>Round ${Number(r?.round_no||0)}</strong><p>${reasons[r?.result_reason]||"최종 결과가 확정되었습니다."}</p></header>${gameStatsSlot("result")}${section("제시어",`<p class="result-category">${escapeHTML(r?.category||"")}</p><p class="result-answer">${escapeHTML(r?.word||"")}</p>`)}${drawingSection}${comparison(r,revealed,hiddenRoleName)}${voteHistory(r?.vote_stages,Number(r?.liar_count||1),hiddenRoleName)}${guessSection}${action?`<div class="result-actions">${action}</div>`:""}</section>`;
}
