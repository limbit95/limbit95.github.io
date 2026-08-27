import { escapeHTML, GAME_MODE, MAX_ROOM_PLAYERS } from "../constants.js";
const realtimeLabel={connecting:"실시간 연결 중",subscribed:"실시간 연결됨",error:"실시간 연결 오류",closed:"실시간 연결 종료"};

export function roomView(s,message="",realtimeStatus="closed"){
 const orderedPlayers=[...(s.players||[])].sort((a,b)=>{
  const at=Date.parse(a.joined_at||"");const bt=Date.parse(b.joined_at||"");
  if(Number.isFinite(at)&&Number.isFinite(bt)&&at!==bt)return at-bt;
  if(Number.isFinite(at)!==Number.isFinite(bt))return Number.isFinite(at)?-1:1;
  return String(a.id||"").localeCompare(String(b.id||""));
 });
 const host=orderedPlayers.find(p=>p.id===s.room.host_player_id);const me=orderedPlayers.find(p=>p.id===s.me?.player_id);
 const isSpectator=s.me?.is_spectator===true;const drawingMode=(s.game?.game_mode||GAME_MODE.CLASSIC)===GAME_MODE.DRAWING_SPY;const hiddenRoleName=drawingMode?"스파이":"라이어";
 const statusFor=p=>{if(!s.round)return {text:p.ready?"준비완료":"미준비",className:p.ready?"ready":""};if(s.round.status==="ROUND_RESULT")return {text:"게임종료",className:"ended"};const playing=s.round_players.some(rp=>rp.player_id===p.id);return {text:playing?"게임중":"관전중",className:playing?"playing":"spectating"};};
 const players=orderedPlayers.map(p=>{const isMe=p.id===s.me?.player_id;const status=statusFor(p);const roundPlayer=s.round_players.find(rp=>rp.player_id===p.id);const liarBadge=isSpectator&&roundPlayer?.is_liar===true?`<span class="badge">🎭 ${hiddenRoleName}</span> `:"";return `<li class="player${isMe?" me":""}"><span class="player-name">${escapeHTML(p.nickname)}${isMe?' <span class="badge me-badge">나</span>':""}${p.id===s.room.host_player_id?" 👑":""}</span><span>${liarBadge}<span class="badge ${status.className}">${status.text}</span></span></li>`;}).join("");
 const readyButton=!s.round?`<button data-action="ready">${me?.ready?"준비취소":"준비완료"}</button>`:"";
 const isHost=s.me?.is_host===true;const isRoundParticipant=Boolean(s.round&&s.round_players.some(rp=>rp.player_id===s.me?.player_id));
 const leaveBlocked=!isHost&&isRoundParticipant&&!['ROUND_RESULT','FORCE_ENDED'].includes(s.round?.status);
 const leaveButton=`<button class="danger" data-action="leave"${leaveBlocked?' disabled':''}>${leaveBlocked?'라운드 진행 중':'나가기'}</button>${leaveBlocked?'<small class="muted">라운드가 끝난 뒤 방에서 나갈 수 있습니다.</small>':''}`;
 const forceEndButton=isHost&&s.game?.status==='active'&&s.round?.status!=='ROUND_RESULT'?'<div class="room-danger-zone"><button type="button" class="danger-secondary" data-action="force-end-game">게임 강제 종료</button></div>':'';
 const spectatorInfo=isSpectator&&s.round&&!["ROUND_RESULT","FORCE_ENDED"].includes(s.round.status)?`<section class="card stack"><h2>👀 관전 정보</h2><div><span class="muted">카테고리</span><p>${escapeHTML(s.round.spectator_category||"-")}</p></div><div><span class="muted">제시어</span><p>${escapeHTML(s.round.spectator_word||"-")}</p></div><small class="muted">관전자는 게임 진행 정보를 모두 확인할 수 있습니다.</small></section>`:"";
 return `<h1 class="brand">🎭 LIAR GAME</h1>${message?`<p class="card error">${escapeHTML(message)}</p>`:""}${spectatorInfo}<section class="card stack"><div class="row between"><div><span class="muted">방 코드</span><div class="room-code">${escapeHTML(s.room.room_code)}</div></div><span class="badge">방장 ${escapeHTML(host?.nickname||"-")}</span></div><small class="muted">${realtimeLabel[realtimeStatus]||realtimeLabel.closed}</small><h2>참가자 ${orderedPlayers.length}/${MAX_ROOM_PLAYERS}</h2><ul>${players}</ul><div class="row">${readyButton}<button class="secondary" data-action="edit-nickname">닉네임 수정</button>${leaveButton}</div>${forceEndButton}</section>`;
}