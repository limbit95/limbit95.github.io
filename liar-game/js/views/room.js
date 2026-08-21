import { escapeHTML } from "../constants.js";
const realtimeLabel={connecting:"실시간 연결 중",subscribed:"실시간 연결됨",error:"실시간 연결 오류",closed:"실시간 연결 종료"};

export function roomView(s,message="",realtimeStatus="closed"){
 const host=s.players.find(p=>p.id===s.room.host_player_id);const me=s.players.find(p=>p.id===s.me?.player_id);
 const statusFor=p=>{if(!s.round)return {text:p.ready?"준비완료":"미준비",className:p.ready?"ready":""};if(s.round.status==="ROUND_RESULT")return {text:"게임종료",className:"ended"};const playing=s.round_players.some(rp=>rp.player_id===p.id);return {text:playing?"게임중":"관전중",className:playing?"playing":"spectating"};};
 const players=s.players.map(p=>{const isMe=p.id===s.me?.player_id;const status=statusFor(p);return `<li class="player${isMe?" me":""}"><span class="player-name">${escapeHTML(p.nickname)}${isMe?' <span class="badge me-badge">나</span>':""}${p.id===s.room.host_player_id?" 👑":""}</span><span class="badge ${status.className}">${status.text}</span></li>`;}).join("");
 const readyButton=!s.round?`<button data-action="ready">${me?.ready?"준비취소":"준비완료"}</button>`:"";
 return `<h1 class="brand">🎭 LIAR GAME</h1>${message?`<p class="card error">${escapeHTML(message)}</p>`:""}<section class="card stack"><div class="row between"><div><span class="muted">방 코드</span><div class="room-code">${escapeHTML(s.room.room_code)}</div></div><span class="badge">방장 ${escapeHTML(host?.nickname||"-")}</span></div><small class="muted">${realtimeLabel[realtimeStatus]||realtimeLabel.closed}</small><h2>참가자 ${s.players.length}/12</h2><ul>${players}</ul><div class="row">${readyButton}<button class="secondary" data-action="edit-nickname">닉네임 수정</button><button class="danger" data-action="leave">나가기</button></div></section>`;
}