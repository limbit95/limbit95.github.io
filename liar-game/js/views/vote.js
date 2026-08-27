import { escapeHTML, GAME_MODE } from "../constants.js";
import { store } from "../store.js";
import { drawingPreviewView } from "./drawing.js";

const peopleList=(people=[])=>people.length?`<ul>${people.map(person=>`<li>${escapeHTML(person.nickname)}</li>`).join("")}</ul>`:"";

export function voteBallotDetails(voteState){
 const ballots=Array.isArray(voteState?.ballot_details)?voteState.ballot_details:[];
 if(!ballots.length)return "";
 return `<div class="vote-detail" data-vote-details><h3>투표 상세</h3><div class="vote-detail-list">${ballots.map(ballot=>`<div class="vote-detail-item"><strong class="vote-detail-voter">${escapeHTML(ballot.voter)}</strong><span class="vote-detail-targets">→ ${(ballot.targets||[]).map(target=>escapeHTML(target.nickname)).join(", ")}</span></div>`).join("")}</div></div>`;
}

export function voteView(s,voteState,myBallot,isHost){
 const seats=Number(voteState?.seats_to_fill||0);const selected=new Set(myBallot||[]);const submitted=voteState?.has_submitted===true;
 const candidates=(voteState?.candidates||[]).filter(candidate=>!candidate.is_me);const locked=voteState?.locked_winners||[];const participant=voteState?.is_round_participant===true;const complete=Number(voteState?.submitted_count)===Number(voteState?.required_count);
 const runoff=voteState?.kind==="runoff";const title=runoff?`재투표 ${Math.max(1,Number(voteState?.stage_no||2)-1)}`:"투표";
 const drawingMode=s.round?.game_mode_snapshot==="drawing_spy";
 const targetName=drawingMode?"스파이":"라이어";
 const selectionGuide=`${targetName}로 의심되는 사람을 선택하세요.`;
 const progress=`<div class="vote-progress-row"><strong class="vote-progress-label">투표</strong><span class="vote-progress-count"><b>${voteState?.submitted_count||0}</b> / ${voteState?.required_count||0}명 완료</span>${isHost?`<button data-action="close-vote" ${complete?"":"disabled"}>투표 마감</button>`:""}</div>`;
 return `<section class="card stack vote-panel"><h2>${title}</h2>${drawingMode?drawingPreviewView(s):""}<p class="notice vote-target-guide">${selectionGuide}</p>${runoff&&locked.length?`<div><h3>확정된 의심 후보</h3>${peopleList(locked)}</div>`:""}${runoff?"<h3>재투표 후보</h3>":""}${participant?`<form class="stack vote-ballot-form" data-action="ballot"><div class="vote-candidates">${candidates.map(candidate=>`<label class="vote-candidate"><input type="checkbox" name="target" value="${escapeHTML(candidate.round_player_id)}" ${selected.has(candidate.round_player_id)?"checked":""}><span>${escapeHTML(candidate.nickname)}</span></label>`).join("")}</div><div class="vote-selection-meta"><p>현재 선택: <strong data-vote-selected>${selected.size}</strong> / ${seats}</p><small>${seats}명을 선택해야 합니다.</small></div><button type="submit" data-ballot-submit ${selected.size!==seats?"disabled":""}>${submitted?"투표 수정":"투표하기"}</button></form>`:`<p class="notice">이번 라운드 관전자는 투표할 수 없습니다.</p>`}${progress}</section>`;
}

export function voteResultView(voteState,isHost,gameMode){
 const resolvedMode=gameMode||store.get().snapshot?.game?.game_mode||GAME_MODE.CLASSIC;
 const drawingMode=resolvedMode===GAME_MODE.DRAWING_SPY;
 const hiddenRoleName=drawingMode?"스파이":"라이어";
 const tally=voteState?.tally||[];const runoff=voteState?.runoff_required===true;const boundary=voteState?.boundary_candidates||[];const locked=voteState?.locked_winners||[];const finalSuspects=voteState?.final_suspects||[];
 const extraTurnLabel=drawingMode?"추가 그림 후 재투표":"한 바퀴 더 발언 후 재투표";
 const extraTurnCopy=drawingMode?"동률 후보만 10초·1획의 추가 그림을 진행한 뒤 바로 재투표합니다.":"동률 후보만 한 바퀴 더 발언한 뒤 재투표합니다.";
 return `<section class="card stack"><h2>투표 결과</h2><ol class="vote-results">${tally.map(item=>`<li data-vote-result-row><strong>${escapeHTML(item.nickname)}</strong><span>${Number(item.votes)||0}표</span></li>`).join("")}</ol><p class="vote-details-deferred">누가 누구에게 투표했는지는 라운드 최종 결과에서 공개됩니다.</p>${runoff?`<div class="stack"><h3>동률이 발생했습니다.</h3><p>아래 후보를 대상으로 재투표가 필요합니다.</p>${locked.length?`<div><h3>확정된 의심 후보</h3>${peopleList(locked)}</div>`:""}<div><h3>재투표 후보</h3>${peopleList(boundary)}</div><p>남은 자리: <strong>${Number(voteState?.remaining_seats)||0}명</strong></p>${isHost?`<p class="muted">${extraTurnCopy}</p><div class="row"><button class="secondary" data-action="start-runoff-speaking">${extraTurnLabel}</button><button data-action="start-runoff">바로 재투표</button></div>`:'<p class="notice">방장이 다음 진행 방식을 선택할 때까지 기다려 주세요.</p>'}</div>`:finalSuspects.length?`<div><h3>최종 의심자</h3>${peopleList(finalSuspects)}<p class="notice">${hiddenRoleName} 검거 판정은 다음 단계에서 진행됩니다.</p></div>`:'<p class="notice">투표 결과를 확인할 수 없습니다.</p>'}</section>`;
}
