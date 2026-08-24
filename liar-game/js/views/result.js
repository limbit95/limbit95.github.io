import { escapeHTML } from "../constants.js";

const section=(title,body)=>`<div class="result-section" data-result-section><h3>${title}</h3>${body}</div>`;
const stageTitle=s=>s.kind==="original"?"1차 투표":`재투표 ${Math.max(1,Number(s.stage_no)-1)}`;
const names=(players=[],hidden="-")=>players.length?players.map(p=>`<span class="result-name-chip">${escapeHTML(p.nickname)}</span>`).join(""):`<span class="result-name-chip is-hidden">${hidden}</span>`;

function voteHistory(stages=[],liarCount=1){
 return section("🗳️ 투표 과정",`<div class="result-vote-history">${stages.map(s=>`<article class="result-vote-stage"><header class="result-vote-stage-header"><h4>${stageTitle(s)}</h4><span>라이어: ${Number(liarCount)}명</span></header><h5>득표 결과</h5><ul class="result-vote-tally">${(s.tally||[]).map(x=>`<li><span>${escapeHTML(x.nickname)}</span><strong>${Number(x.votes)}표</strong></li>`).join("")}</ul><h5>투표 상세</h5><div class="result-vote-ballots">${(s.ballot_details||[]).map(b=>`<div><strong>${escapeHTML(b.voter)}</strong><span>→</span><span>${(b.targets||[]).map(t=>escapeHTML(t.nickname)).join(", ")||"선택 없음"}</span></div>`).join("")}</div>${s.runoff_required?`<div class="result-runoff-summary"><strong>재투표 발생</strong><p>확정된 지목: ${(s.stage_winners||[]).map(x=>escapeHTML(x.nickname)).join(", ")||"없음"}</p><p>동률 후보: ${(s.boundary_candidates||[]).map(x=>escapeHTML(x.nickname)).join(", ")}</p><p>남은 자리: ${Number(s.remaining_seats)}명</p></div>`:""}${(s.locked_winners||[]).length?`<p class="result-locked">이전 단계 확정: ${s.locked_winners.map(x=>escapeHTML(x.nickname)).join(", ")}</p>`:""}</article>`).join("")||'<p class="notice">투표 기록을 확인할 수 없습니다.</p>'}</div>`);
}

function comparison(r,revealed){
 return `<section class="result-comparison" data-result-section aria-label="최종 지목과 실제 라이어 비교">
  <article class="result-comparison-card is-picked"><span class="result-comparison-label">🔍 최종 지목</span><div class="result-comparison-names">${names(r?.final_suspects||[],"없음")}</div></article>
  <div class="result-comparison-vs" aria-hidden="true">VS</div>
  <article class="result-comparison-card is-liar"><span class="result-comparison-label">🎭 실제 라이어</span><div class="result-comparison-names">${revealed?names(r?.actual_liars||[],"확인 불가"):names([],"공개 대기")}</div></article>
 </section>`;
}

export function resultView(r,isHost){
 const citizen=r?.winner==="citizen",revealed=r?.liars_revealed===true,captureSucceeded=r?.capture_succeeded===true;
 const reasons={CAPTURE_FAILED:"시민의 지목을 피해 라이어가 승리했습니다.",GUESS_CORRECT:"라이어가 제시어를 맞혀 역전했습니다.",GUESSES_EXHAUSTED:"시민이 라이어를 찾아내고 제시어까지 지켜냈습니다."};
 const guesses=Array.isArray(r?.guesses)?r.guesses:[];
 const guessSection=captureSucceeded?section("🎯 라이어 제시어 추측",guesses.length?`<ol class="result-guess-list">${guesses.map(g=>`<li><strong>${Number(g.attempt_no)}회차 · ${escapeHTML(g.guesser)}</strong><blockquote>“${escapeHTML(g.guess_text)}”</blockquote><span class="${g.is_correct?"success":"error"}">${g.is_correct?"✅ 정답":"❌ 오답"}</span></li>`).join("")}</ol>`:'<p class="notice">추측 기록을 확인할 수 없습니다.</p>'):"";
 let action="";
 if(citizen||captureSucceeded||revealed)action=isHost?'<button data-action="prepare-next-round">다음 라운드</button><button class="secondary" data-action="restart-game">새 게임 · 설정 변경</button>':'<p class="muted">방장이 다음 라운드 또는 새 게임을 준비할 때까지 기다려 주세요.</p>';
 return `<section class="card result-card ${citizen?"result-citizen":"result-liar"}" data-result-card data-result-id="${escapeHTML(r?.round_id||"")}" data-result-round="${Number(r?.round_no||0)}" data-result-winner="${citizen?"citizen":"liar"}" data-capture-succeeded="${captureSucceeded?"true":"false"}" data-liars-revealed="${revealed?"true":"false"}" data-finished-at="${escapeHTML(r?.finished_at||"")}" data-server-now="${escapeHTML(r?.server_now||"")}"><header class="result-hero"><h2 class="result-title" data-result-title>${citizen?"🏆 시민 승리!":"🎭 라이어 승리!"}</h2><strong>Round ${Number(r?.round_no||0)}</strong><p>${reasons[r?.result_reason]||"최종 결과가 확정되었습니다."}</p></header>${section("제시어",`<p class="result-category">${escapeHTML(r?.category||"")}</p><p class="result-answer">${escapeHTML(r?.word||"")}</p>`)}${comparison(r,revealed)}${voteHistory(r?.vote_stages,Number(r?.liar_count||1))}${guessSection}${action?`<div class="result-actions">${action}</div>`:""}</section>`;
}
