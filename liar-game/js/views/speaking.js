import { escapeHTML } from "../constants.js";
import { drawingPreviewView } from "./drawing.js";

export function speakingView(s,isHost){
 const index=Number(s.round.current_speaker_index);
 const allOrdered=[...s.round_players].sort((a,b)=>Number(a.turn_order)-Number(b.turn_order));
 const runoff=Number(s.round.current_vote_stage)>0;
 const runoffIds=Array.isArray(s.round.runoff_speaker_round_player_ids)?s.round.runoff_speaker_round_player_ids.map(String):[];
 const ordered=runoff&&runoffIds.length
  ?allOrdered.filter(player=>runoffIds.includes(String(player.id)))
  :allOrdered;
 const current=ordered[index];
 const isCurrentSpeaker=current?.player_id===s.me?.player_id;
 const last=index===ordered.length-1;
 const controls=isHost
  ?`<div class="row"><button class="secondary" data-action="speaker-prev" ${index===0?"disabled":""}>PREVIOUS</button>${last?`<button class="secondary" data-action="speaker-restart">한 바퀴 더!</button><button data-action="finish-speaking">발언 종료 (방장)</button>`:`<button data-action="speaker-next">NEXT (방장)</button>`}</div>`
  :isCurrentSpeaker&&!last
   ?'<button data-action="speaker-next">다음 발언자</button>'
   :isCurrentSpeaker&&last
    ?'<p class="muted">마지막 발언입니다. 방장이 발언 종료를 진행합니다.</p>'
    :"";
 const orderList=ordered.map((p,position)=>{
  const state=position<index?"done":position===index?"current":"upcoming";
  const stateLabel=state==="done"?"✓ 완료":state==="current"?"● NOW":"대기";
  return `<li class="speaker-order-item is-${state}">
   <span class="speaker-order-number">${position+1}</span>
   <span class="speaker-order-copy"><strong>${escapeHTML(p.nickname_snapshot)}</strong>${p.player_id===s.me?.player_id?'<small>나</small>':""}</span>
   <span class="speaker-order-state">${stateLabel}</span>
  </li>`;
 }).join("");
 return `<section class="card stack speaking-card">
  <div class="speaking-heading"><div><span class="speaking-eyebrow">${runoff?"TIE-BREAK SPEAKING":"SPEAKING ORDER"}</span><h2>${runoff?"동률 후보 추가 발언":"발언 순서"}</h2></div><div class="speaking-heading-side"><span class="phase3-timer-badge">남은 시간<strong data-speaking-timer>--</strong></span><span class="speaking-progress">${index+1} / ${ordered.length}</span></div></div>
  ${runoff?`<p class="notice">동률 후보 ${ordered.length}명만 추가 발언합니다. 발언 종료 후 재투표로 이동합니다.</p>`:""}
  <div class="speaker speaker-current-card" data-current-speaker><span>지금 발언 중</span><strong>${escapeHTML(current?.nickname_snapshot||"-")}</strong></div>
  <ol class="speaker-order-list">${orderList}</ol>
  ${controls}
 </section>`;
}

export function discussionView(s,isHost){
 const canChat=s.me?.is_spectator!==true;
 const drawingPreview=s.round?.game_mode_snapshot==="drawing_spy"?drawingPreviewView(s):"";
 return `<section class="card stack discussion-card" data-discussion-panel data-room-id="${escapeHTML(s.room.id)}" data-round-id="${escapeHTML(s.round.id)}">
  <div class="discussion-heading"><div><span class="speaking-eyebrow">FREE TALK</span><h2>자유 토론</h2></div><div class="discussion-heading-side"><span class="phase3-timer-badge">토론 시간<strong data-discussion-timer>--</strong></span><span class="discussion-live"><i></i> LIVE</span></div></div>
  ${drawingPreview}
  <aside class="discussion-guide" aria-label="자유 토론 안내"><span class="discussion-guide-icon" aria-hidden="true">💬</span><div><p>의심되는 점이나 짧은 의견을 실시간으로 나눠보세요.</p><p>이 대화는 DB에 저장되지 않고 현재 토론에서만 사용됩니다.</p></div></aside>
  <p class="notice discussion-time-notice" data-discussion-time-notice hidden><span>토론 시간이 종료되어 실시간 채팅이 잠겼습니다.</span><span>방장이 준비되면 투표를 시작해 주세요.</span></p>
  <div class="discussion-chat" data-discussion-chat role="log" aria-live="polite"><p class="discussion-chat-empty">아직 대화가 없습니다. 첫 메시지를 남겨보세요.</p></div>
  ${canChat?`<form class="discussion-chat-form" data-action="discussion-chat"><textarea name="chat" maxlength="160" rows="2" placeholder="메시지를 입력하세요 · Enter 전송 / Shift+Enter 줄바꿈" aria-label="토론 메시지"></textarea><button type="submit">보내기</button></form>`:'<p class="notice">관전자는 대화를 볼 수 있지만 메시지를 보낼 수 없습니다.</p>'}
  <div class="discussion-footer${isHost?" is-host":""}">${isHost?'<button type="button" data-action="start-vote">투표 시작</button>':""}</div>
 </section>`;
}
