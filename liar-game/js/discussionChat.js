import { escapeHTML, ROUND_STATUS } from "./constants.js";
import { supabase } from "./supabase.js";
import { store } from "./store.js";

const PREFIX="liar_discussion_chat";
const MAX_MESSAGES=80;
let channel=null;
let roomId=null;
let roundId=null;
let localKey="";
let realtimeStatus="closed";
let syncing=false;

const currentState=()=>store.get();
const currentSnapshot=()=>currentState().snapshot;
const isDiscussion=()=>currentSnapshot()?.round?.status===ROUND_STATUS.DISCUSSION;
const keyFor=(state,room,round)=>`${PREFIX}:${state.session?.user?.id||"anon"}:${room}:${round}`;

function readMessages(){
 if(!localKey)return [];
 try{
  const parsed=JSON.parse(localStorage.getItem(localKey)||"[]");
  return Array.isArray(parsed)?parsed.slice(-MAX_MESSAGES):[];
 }catch{return [];}
}

function writeMessages(messages){
 if(!localKey)return;
 try{localStorage.setItem(localKey,JSON.stringify(messages.slice(-MAX_MESSAGES)));}catch{}
}

function removeCurrentHistory(){
 if(localKey)try{localStorage.removeItem(localKey);}catch{}
 localKey="";
}

function pruneOldHistory(state,currentKey){
 const userPrefix=`${PREFIX}:${state.session?.user?.id||"anon"}:`;
 try{
  for(let i=localStorage.length-1;i>=0;i-=1){
   const key=localStorage.key(i);
   if(key?.startsWith(userPrefix)&&key!==currentKey)localStorage.removeItem(key);
  }
 }catch{}
}

function canonicalSender(senderId,fallback=""){
 const s=currentSnapshot();
 return s?.players?.find(player=>player.id===senderId)?.nickname
  ||s?.round_players?.find(player=>player.player_id===senderId)?.nickname_snapshot
  ||fallback
  ||"참가자";
}

function messageHTML(message){
 const s=currentSnapshot();
 const mine=message.senderId===s?.me?.player_id;
 const time=new Date(Number(message.sentAt)||Date.now()).toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});
 return `<article class="discussion-message ${mine?"is-mine":""}">
  <div class="discussion-message-meta"><strong>${escapeHTML(canonicalSender(message.senderId,message.nickname))}</strong><time>${escapeHTML(time)}</time></div>
  <p>${escapeHTML(message.text).replace(/\n/g,"<br>")}</p>
 </article>`;
}

function renderChat(){
 const panel=document.querySelector("[data-discussion-chat]");
 if(!panel)return;
 const messages=readMessages();
 panel.innerHTML=messages.length?messages.map(messageHTML).join(""):'<p class="discussion-chat-empty">아직 대화가 없습니다. 첫 메시지를 남겨보세요.</p>';
 requestAnimationFrame(()=>{panel.scrollTop=panel.scrollHeight;});
 const status=document.querySelector("[data-discussion-chat-status]");
 if(status)status.textContent=realtimeStatus==="subscribed"?"실시간 채팅 연결됨":realtimeStatus==="error"?"채팅 연결이 불안정합니다":"채팅 연결 중…";
 const submit=document.querySelector('form[data-action="discussion-chat"] button[type="submit"]');
 if(submit)submit.disabled=realtimeStatus!=="subscribed";
}

function appendMessage(message){
 const messages=readMessages();
 if(messages.some(item=>item.id===message.id))return;
 messages.push(message);
 writeMessages(messages);
 renderChat();
}

function receiveMessage(payload){
 const s=currentSnapshot();
 if(!isDiscussion()||!payload||payload.room_id!==roomId||payload.round_id!==roundId)return;
 if(!s?.round_players?.some(player=>player.player_id===payload.sender_id))return;
 const text=String(payload.text||"").trim();
 if(!text||text.length>160)return;
 appendMessage({
  id:String(payload.message_id||crypto.randomUUID()),
  senderId:String(payload.sender_id||""),
  nickname:canonicalSender(payload.sender_id),
  text,
  sentAt:Number(payload.sent_at)||Date.now(),
 });
}

async function disconnect(){
 const old=channel;
 channel=null;roomId=null;roundId=null;realtimeStatus="closed";
 if(old)try{await supabase.removeChannel(old);}catch{}
}

async function connect(targetRoom,targetRound){
 if(channel&&roomId===targetRoom&&roundId===targetRound){renderChat();return;}
 await disconnect();
 await supabase.realtime.setAuth();
 roomId=targetRoom;roundId=targetRound;realtimeStatus="connecting";
 const next=supabase
  .channel(`liar-room:${targetRoom}`,{config:{private:true}})
  .on("broadcast",{event:"discussion_chat"},({payload})=>receiveMessage(payload));
 channel=next;
 next.subscribe(status=>{
  if(next!==channel)return;
  if(status==="SUBSCRIBED")realtimeStatus="subscribed";
  else if(status==="CHANNEL_ERROR"||status==="TIMED_OUT")realtimeStatus="error";
  else if(status==="CLOSED")realtimeStatus="closed";
  renderChat();
 });
}

async function syncView(){
 if(syncing)return;
 syncing=true;
 try{
  const panel=document.querySelector("[data-discussion-panel]");
  const s=currentState();
  if(!panel||!isDiscussion()){
   if(roundId){removeCurrentHistory();await disconnect();}
   return;
  }
  const nextRoom=panel.dataset.roomId;
  const nextRound=panel.dataset.roundId;
  const nextKey=keyFor(s,nextRoom,nextRound);
  if(localKey&&localKey!==nextKey)removeCurrentHistory();
  localKey=nextKey;
  pruneOldHistory(s,nextKey);
  renderChat();
  await connect(nextRoom,nextRound);
 }finally{syncing=false;}
}

async function sendCurrentMessage(form){
 const s=currentSnapshot();
 if(!s||s.round?.status!==ROUND_STATUS.DISCUSSION||s.me?.is_spectator===true||!channel||realtimeStatus!=="subscribed")return;
 const textarea=form.querySelector('textarea[name="chat"]');
 const text=String(textarea?.value||"").trim();
 if(!text||text.length>160)return;
 const message={id:crypto.randomUUID(),senderId:s.me.player_id,nickname:s.me.nickname,text,sentAt:Date.now()};
 try{
  const result=await channel.send({type:"broadcast",event:"discussion_chat",payload:{room_id:s.room.id,round_id:s.round.id,sender_id:s.me.player_id,message_id:message.id,text:message.text,sent_at:message.sentAt}});
  if(result!=="ok"){realtimeStatus="error";renderChat();return;}
  appendMessage(message);
  if(textarea)textarea.value="";
 }catch{realtimeStatus="error";renderChat();}
}

document.addEventListener("submit",event=>{
 const form=event.target.closest?.('form[data-action="discussion-chat"]');
 if(!form)return;
 event.preventDefault();
 void sendCurrentMessage(form);
});

document.addEventListener("keydown",event=>{
 const textarea=event.target.closest?.('form[data-action="discussion-chat"] textarea[name="chat"]');
 if(!textarea||event.key!=="Enter"||event.shiftKey||event.isComposing)return;
 event.preventDefault();
 textarea.form?.requestSubmit();
});

const observer=new MutationObserver(()=>{void syncView();});
observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});
void syncView();
window.addEventListener("pagehide",()=>{observer.disconnect();void disconnect();},{once:true});
