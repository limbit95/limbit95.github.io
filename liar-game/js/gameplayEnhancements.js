import { commands } from "./commands.js";
import { ERROR_MESSAGES, ROUND_STATUS } from "./constants.js";
import { store } from "./store.js";

let speakingKey="";
let speakingOffset=0;
let discussionKey="";
let discussionOffset=0;
let autoAdvanceKey="";
let autoAdvancePending=false;

const codeFor=error=>Object.keys(ERROR_MESSAGES).find(code=>String(error?.message||"").includes(code));
const messageFor=error=>ERROR_MESSAGES[codeFor(error)]||String(error?.message||"요청을 처리하지 못했습니다.");

function orderedSpeakers(snapshot){
 const all=[...(snapshot?.round_players||[])].sort((a,b)=>Number(a.turn_order)-Number(b.turn_order));
 const runoff=Number(snapshot?.round?.current_vote_stage||0)>0;
 const runoffIds=Array.isArray(snapshot?.round?.runoff_speaker_round_player_ids)
  ?snapshot.round.runoff_speaker_round_player_ids.map(String)
  :[];
 return runoff&&runoffIds.length?all.filter(player=>runoffIds.includes(String(player.id))):all;
}

function timerState(kind,snapshot){
 const round=snapshot?.round;
 if(!round)return null;
 const speaking=kind==="speaking";
 const limit=Number(speaking?round.speaking_time_limit_snapshot:round.discussion_time_limit_snapshot)||0;
 const startedAt=speaking?round.speaking_turn_started_at:round.discussion_started_at;
 const key=speaking
  ?`${round.id}:${round.current_vote_stage||0}:${round.current_speaker_index}:${startedAt||""}`
  :`${round.id}:${startedAt||""}`;
 if(speaking){
  if(key!==speakingKey){speakingKey=key;speakingOffset=Date.parse(round.server_now||"")-Date.now();autoAdvanceKey="";}
 }else if(key!==discussionKey){discussionKey=key;discussionOffset=Date.parse(round.server_now||"")-Date.now();}
 if(limit<=0)return {limit,key,remaining:null};
 const started=Date.parse(startedAt||"");
 if(!Number.isFinite(started))return {limit,key,remaining:null};
 const offset=speaking?speakingOffset:discussionOffset;
 const remaining=started+limit*1000-(Date.now()+(Number.isFinite(offset)?offset:0));
 return {limit,key,remaining};
}

function renderTimer(selector,state,{expiredLabel="시간 종료"}={}){
 const element=document.querySelector(selector);
 if(!element)return;
 const shell=element.closest(".phase3-timer-badge");
 if(!state||state.limit<=0){element.textContent="무제한";shell?.classList.remove("is-ending","is-expired");return;}
 if(state.remaining===null){element.textContent="--";return;}
 const remaining=Math.max(0,state.remaining);
 element.textContent=remaining<=0?expiredLabel:`${Math.ceil(remaining/1000)}초`;
 shell?.classList.toggle("is-ending",remaining>0&&remaining<=5000);
 shell?.classList.toggle("is-expired",remaining<=0);
}

async function autoAdvanceSpeaking(snapshot,state){
 if(!state||state.limit<=0||state.remaining===null||state.remaining>0||autoAdvancePending)return;
 const ordered=orderedSpeakers(snapshot);
 const index=Number(snapshot.round.current_speaker_index||0);
 const current=ordered[index];
 if(!current)return;
 const last=index>=ordered.length-1;
 const meIsCurrent=current.player_id===snapshot.me?.player_id;
 const isHost=snapshot.me?.is_host===true;
 if(last&&!isHost)return;
 if(!last&&!meIsCurrent&&!(isHost&&state.remaining<=-800))return;
 if(autoAdvanceKey===state.key)return;
 autoAdvanceKey=state.key;
 autoAdvancePending=true;
 try{
  if(last)await commands.finishSpeaking(snapshot.round.version);
  else await commands.moveSpeaker("NEXT",snapshot.round.version);
 }catch(error){
  const code=codeFor(error);
  if(code!=="STALE_VERSION"&&code!=="INVALID_ROUND_STATE"&&!String(error?.message||"").includes("요청을 처리 중"))store.set({message:messageFor(error)});
  if(String(error?.message||"").includes("요청을 처리 중"))autoAdvanceKey="";
 }finally{autoAdvancePending=false;}
}

function tick(){
 const snapshot=store.get().snapshot;
 if(snapshot?.round?.status===ROUND_STATUS.SPEAKING){
  const state=timerState("speaking",snapshot);
  renderTimer("[data-speaking-timer]",state);
  void autoAdvanceSpeaking(snapshot,state);
 }else{speakingKey="";autoAdvanceKey="";}
 if(snapshot?.round?.status===ROUND_STATUS.DISCUSSION){
  const state=timerState("discussion",snapshot);
  renderTimer("[data-discussion-timer]",state);
  const notice=document.querySelector("[data-discussion-time-notice]");
  if(notice)notice.hidden=!(state?.limit>0&&state.remaining!==null&&state.remaining<=0);
 }else discussionKey="";
}

// Capture the setup form before app.js's historical v3 submit handler. v1.1
// sends the complete settings contract through v5, including the private
// custom-word source selection. The server revokes older settings RPCs.
document.addEventListener("submit",async event=>{
 const form=event.target;
 if(!(form instanceof HTMLFormElement)||form.dataset.action!=="settings")return;
 event.preventDefault();event.stopPropagation();
 const snapshot=store.get().snapshot;
 if(!snapshot?.me?.is_host)return;
 const data=new FormData(form);
 const wordSourceMode=String(data.get("wordSourceMode")||snapshot.game?.word_source_mode||"builtin");
 const customPackValue=data.get("customWordPackId");
 const settings={
  p_selected_categories:data.getAll("category"),
  p_difficulty:String(data.get("difficulty")||"all"),
  p_liar_count:Number(data.get("liarCount")),
  p_guess_limit:Number(data.get("guessLimit")),
  p_show_category_to_liar:data.has("showCategoryToLiar"),
  p_game_mode:String(data.get("gameMode")||"classic"),
  p_drawing_time_limit:Number(data.get("drawingTimeLimit")||15),
  p_drawing_stroke_limit:Number(data.get("drawingStrokeLimit")||3),
  p_drawing_stroke_unlimited:data.has("drawingStrokeUnlimited"),
  p_speaking_time_limit:Number(data.get("speakingTimeLimit")||0),
  p_discussion_time_limit:Number(data.get("discussionTimeLimit")||0),
  p_liars_know_each_other:data.has("liarsKnowEachOther"),
  p_word_source_mode:wordSourceMode,
  p_custom_word_pack_id:wordSourceMode==="builtin"?null:(customPackValue?String(customPackValue):null),
 };
 store.set({message:""});
 try{
  await commands.updateSettingsV5(settings,snapshot.room.version);
  store.set({message:"설정을 저장했습니다."});
 }catch(error){store.set({message:messageFor(error)});}
},true);

const timer=window.setInterval(tick,140);
tick();
window.addEventListener("pagehide",()=>window.clearInterval(timer),{once:true});