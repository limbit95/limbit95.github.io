import { getRoomSnapshot } from "./api.js";
import { commands } from "./commands.js";
import { ERROR_MESSAGES, MIN_CITIZENS, MIN_READY_PLAYERS, ROUND_STATUS } from "./constants.js";
import { clearSetupDraft, getSetupDraft, patchSetupDraft } from "./setupDraft.js";
import { store } from "./store.js";

let speakingKey="";
let speakingOffset=0;
let discussionKey="";
let discussionOffset=0;
let autoAdvanceKey="";
let autoAdvancePending=false;
let setupStartInFlight=false;

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

function setupForm(){return document.querySelector('form[data-action="settings"]');}
function startButton(){return document.querySelector('[data-action="start-round"][data-can-start]');}

function captureSetupDraft(form=setupForm()){
 const snapshot=store.get().snapshot;
 if(!snapshot?.me?.is_host||snapshot.round||snapshot.game?.status!=="setup"||!form)return getSetupDraft(snapshot);
 const data=new FormData(form);
 const current=getSetupDraft(snapshot)||{};
 const wordSourceMode=String(data.get("wordSourceMode")||current.wordSourceMode||snapshot.game?.word_source_mode||"builtin");
 const customPackValue=data.get("customWordPackId");
 const patch={
  selectedCategories:data.getAll("category"),
  difficulty:String(data.get("difficulty")||"all"),
  liarCount:Number(data.get("liarCount")||1),
  guessLimit:Number(data.get("guessLimit")||1),
  showCategoryToLiar:data.has("showCategoryToLiar"),
  gameMode:String(data.get("gameMode")||"classic"),
  drawingTimeLimit:Number(data.get("drawingTimeLimit")||15),
  drawingStrokeLimit:Number(data.get("drawingStrokeLimit")||3),
  drawingStrokeUnlimited:data.has("drawingStrokeUnlimited"),
  speakingTimeLimit:Number(data.get("speakingTimeLimit")||0),
  discussionTimeLimit:Number(data.get("discussionTimeLimit")||0),
  liarsKnowEachOther:data.has("liarsKnowEachOther"),
  wordSourceMode,
 };
 if(wordSourceMode!=="builtin"&&customPackValue)patch.customWordPackId=String(customPackValue);
 return patchSetupDraft(snapshot,patch);
}

function draftStartState(form=setupForm()){
 const snapshot=store.get().snapshot;
 if(!snapshot||!form)return null;
 const draft=captureSetupDraft(form)||getSetupDraft(snapshot)||{};
 const readyCount=(snapshot.players||[]).filter(player=>player.ready).length;
 const liarCount=Math.max(1,Number(draft.liarCount||snapshot.game?.liar_count||1));
 const requiredReady=Math.max(MIN_READY_PLAYERS,liarCount+MIN_CITIZENS);
 const missing=Math.max(0,requiredReady-readyCount);
 return {canStart:missing===0,label:missing===0?"게임 시작":`게임 시작까지 ${missing}명이 더 필요합니다`};
}

function updateStartButton(form=setupForm()){
 if(setupStartInFlight)return;
 const button=startButton();
 const state=draftStartState(form);
 if(!button||!state)return;
 button.dataset.canStart=state.canStart?"true":"false";
 button.textContent=state.label;
 button.disabled=!state.canStart;
}

function startSettings(form,snapshot){
 const draft=captureSetupDraft(form)||getSetupDraft(snapshot)||{};
 return {
  p_selected_categories:Array.isArray(draft.selectedCategories)?draft.selectedCategories:[],
  p_difficulty:String(draft.difficulty||"all"),
  p_liar_count:Number(draft.liarCount||1),
  p_guess_limit:Number(draft.guessLimit||1),
  p_show_category_to_liar:draft.showCategoryToLiar===true,
  p_game_mode:String(draft.gameMode||"classic"),
  p_drawing_time_limit:Number(draft.drawingTimeLimit||15),
  p_drawing_stroke_limit:Number(draft.drawingStrokeLimit||3),
  p_drawing_stroke_unlimited:draft.drawingStrokeUnlimited===true,
  p_speaking_time_limit:Number(draft.speakingTimeLimit||0),
  p_discussion_time_limit:Number(draft.discussionTimeLimit||0),
  p_liars_know_each_other:draft.liarsKnowEachOther===true,
  p_word_source_mode:String(draft.wordSourceMode||"builtin"),
  p_custom_word_pack_id:draft.wordSourceMode==="builtin"?null:(draft.customWordPackId||null),
 };
}

document.addEventListener("change",event=>{
 const form=event.target.closest?.('form[data-action="settings"]');
 if(!form)return;
 queueMicrotask(()=>{captureSetupDraft(form);updateStartButton(form);});
},true);

document.addEventListener("input",event=>{
 const form=event.target.closest?.('form[data-action="settings"]');
 if(!form)return;
 captureSetupDraft(form);updateStartButton(form);
},true);

// There is intentionally no settings-save request while editing. Pressing Enter
// inside setup also does not invoke the historical settings submit handler.
document.addEventListener("submit",event=>{
 const form=event.target;
 if(!(form instanceof HTMLFormElement)||form.dataset.action!=="settings")return;
 event.preventDefault();event.stopPropagation();
},true);

// Apply the current local draft and create the round in one server transaction.
document.addEventListener("click",async event=>{
 const button=event.target.closest?.('[data-action="start-round"][data-can-start]');
 if(!button||button.disabled||setupStartInFlight)return;
 const snapshot=store.get().snapshot;
 if(!snapshot?.me?.is_host||snapshot.round||snapshot.game?.status!=="setup")return;
 event.preventDefault();event.stopImmediatePropagation();
 const form=setupForm();
 if(!form)return;
 if(!form.checkValidity()){form.reportValidity();return;}
 const settings=startSettings(form,snapshot);
 if(!settings.p_selected_categories.length&&settings.p_word_source_mode!=="custom"){
  store.set({message:ERROR_MESSAGES.INVALID_GAME_SETTINGS});return;
 }
 if(settings.p_word_source_mode!=="builtin"&&!settings.p_custom_word_pack_id){
  store.set({message:ERROR_MESSAGES.CUSTOM_WORD_PACK_REQUIRED});return;
 }
 setupStartInFlight=true;
 button.disabled=true;
 button.textContent="게임 시작 중…";
 store.set({message:""});
 try{
  await commands.startRoundWithSettings(settings,snapshot.room.version);
  clearSetupDraft();
  const nextSnapshot=await getRoomSnapshot();
  store.set({snapshot:nextSnapshot,message:"",myRole:null,myRoleRoundId:null,roleModalOpen:false,roleModalLoading:false,voteState:null,guessState:null,resultState:null,myBallot:[]});
 }catch(error){
  const code=codeFor(error);
  if(code==="STALE_VERSION")store.set({message:"상태가 변경되었습니다. 최신 참가자 상태를 확인한 뒤 다시 게임 시작을 눌러 주세요."});
  else store.set({message:messageFor(error)});
 }finally{
  setupStartInFlight=false;
  updateStartButton();
 }
},true);

const timer=window.setInterval(tick,140);
tick();
window.addEventListener("pagehide",()=>window.clearInterval(timer),{once:true});
