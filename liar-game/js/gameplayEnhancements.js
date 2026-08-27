import { commands } from "./commands.js";
import { ERROR_MESSAGES, MIN_CITIZENS, MIN_READY_PLAYERS, ROUND_STATUS } from "./constants.js";
import { store } from "./store.js";

let speakingKey="";
let speakingOffset=0;
let discussionKey="";
let discussionOffset=0;
let autoAdvanceKey="";
let autoAdvancePending=false;
let setupSaveTimer=null;
let setupSaveInFlight=false;
let setupQueuedPayload=null;
let setupSaveVersion=null;
let setupSaveGameId="";
let setupSavedSignature="";
let setupLastSaveError=null;
let setupStartInFlight=false;

const codeFor=error=>Object.keys(ERROR_MESSAGES).find(code=>String(error?.message||"").includes(code));
const messageFor=error=>ERROR_MESSAGES[codeFor(error)]||String(error?.message||"요청을 처리하지 못했습니다.");
const sleep=ms=>new Promise(resolve=>window.setTimeout(resolve,ms));

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

function collectSetupSettings(form,snapshot){
 const data=new FormData(form);
 const wordSourceMode=String(data.get("wordSourceMode")||snapshot.game?.word_source_mode||"builtin");
 const customPackValue=data.get("customWordPackId");
 return {
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
}

function startButton(){return document.querySelector('[data-action="start-round"][data-can-start]');}

function draftStartState(form){
 const snapshot=store.get().snapshot;
 if(!snapshot||!form)return null;
 const readyCount=(snapshot.players||[]).filter(player=>player.ready).length;
 const liarCount=Math.max(1,Number(form.elements?.liarCount?.value||snapshot.game?.liar_count||1));
 const requiredReady=Math.max(MIN_READY_PLAYERS,liarCount+MIN_CITIZENS);
 const missing=Math.max(0,requiredReady-readyCount);
 return {canStart:missing===0,label:missing===0?"게임 시작":`게임 시작까지 ${missing}명이 더 필요합니다`};
}

function updateDraftStartButton(form){
 if(setupSaveInFlight||setupStartInFlight)return;
 const button=startButton();
 const state=draftStartState(form);
 if(!button||!state)return;
 button.dataset.canStart=state.canStart?"true":"false";
 button.textContent=state.label;
 button.disabled=!state.canStart;
}

function setSetupSaving(saving){
 const button=startButton();
 if(!button)return;
 if(saving){
  if(!button.dataset.autosaveLabel)button.dataset.autosaveLabel=button.textContent||"게임 시작";
  button.textContent="설정 저장 중…";
  button.disabled=true;
 }else{
  if(button.dataset.autosaveLabel){button.textContent=button.dataset.autosaveLabel;delete button.dataset.autosaveLabel;}
  button.disabled=button.dataset.canStart!=="true";
 }
}

function setupPayload(form){
 const snapshot=store.get().snapshot;
 if(!snapshot?.me?.is_host||snapshot.round||snapshot.game?.status!=="setup")return null;
 if(!form?.checkValidity?.())return null;
 const settings=collectSetupSettings(form,snapshot);
 if(!settings.p_selected_categories.length&&settings.p_word_source_mode!=="custom")return null;
 if(settings.p_word_source_mode!=="builtin"&&!settings.p_custom_word_pack_id)return null;
 const gameId=String(snapshot.game.id||"");
 if(setupSaveGameId!==gameId){
  setupSaveGameId=gameId;
  setupSaveVersion=Number(snapshot.room.version||0);
  setupSavedSignature="";
  setupQueuedPayload=null;
  setupLastSaveError=null;
 }
 const signature=JSON.stringify(settings);
 return {gameId,settings,signature};
}

function queueSetupSave(form,{delay=180}={}){
 const payload=setupPayload(form);
 updateDraftStartButton(form);
 if(!payload||payload.signature===setupSavedSignature)return;
 setupLastSaveError=null;
 setupQueuedPayload=payload;
 window.clearTimeout(setupSaveTimer);
 setupSaveTimer=window.setTimeout(()=>{setupSaveTimer=null;void flushSetupSave();},delay);
}

async function flushSetupSave(){
 if(setupSaveInFlight||!setupQueuedPayload)return;
 const payload=setupQueuedPayload;
 setupQueuedPayload=null;
 const snapshot=store.get().snapshot;
 if(!snapshot?.me?.is_host||String(snapshot.game?.id||"")!==payload.gameId||snapshot.round)return;
 setupSaveInFlight=true;
 setSetupSaving(true);
 const version=Number.isFinite(setupSaveVersion)?setupSaveVersion:Number(snapshot.room.version||0);
 try{
  const nextVersion=await commands.updateSettingsV5(payload.settings,version);
  const parsed=Number(nextVersion);
  if(Number.isFinite(parsed))setupSaveVersion=parsed;
  setupSavedSignature=payload.signature;
  setupLastSaveError=null;
 }catch(error){
  const code=codeFor(error);
  const busy=String(error?.message||"").includes("요청을 처리 중");
  if(code==="STALE_VERSION"||busy){
   setupSaveVersion=null;
   setupQueuedPayload=payload;
   window.clearTimeout(setupSaveTimer);
   setupSaveTimer=window.setTimeout(()=>{setupSaveTimer=null;const latest=store.get().snapshot;if(latest?.room?.version!=null)setupSaveVersion=Number(latest.room.version);void flushSetupSave();},320);
  }else{
   setupLastSaveError=error;
   store.set({message:messageFor(error)});
  }
 }finally{
  setupSaveInFlight=false;
  setSetupSaving(false);
  if(setupQueuedPayload&&!setupSaveTimer){setupSaveTimer=window.setTimeout(()=>{setupSaveTimer=null;void flushSetupSave();},0);}
 }
}

async function drainSetupSaves(){
 window.clearTimeout(setupSaveTimer);setupSaveTimer=null;
 if(setupQueuedPayload&&!setupSaveInFlight)await flushSetupSave();
 let spins=0;
 while((setupSaveInFlight||setupQueuedPayload||setupSaveTimer)&&spins<80){
  if(setupSaveTimer&&!setupSaveInFlight){window.clearTimeout(setupSaveTimer);setupSaveTimer=null;await flushSetupSave();}
  else if(setupQueuedPayload&&!setupSaveInFlight)await flushSetupSave();
  else await sleep(30);
  spins+=1;
 }
 return !setupSaveInFlight&&!setupQueuedPayload&&!setupSaveTimer&&!setupLastSaveError;
}

function setupFormFrom(target){return target?.closest?.('form[data-action="settings"][data-settings-autosave]')||null;}

document.addEventListener("change",event=>{
 const form=setupFormFrom(event.target);
 if(!form)return;
 queueSetupSave(form,{delay:120});
 if(event.target.closest?.("[data-custom-word-pack-slot]")&&event.target.name==="wordSourceMode"){
  queueMicrotask(()=>{
   const liveForm=document.querySelector('form[data-action="settings"][data-settings-autosave]');
   if(liveForm)queueSetupSave(liveForm,{delay:0});
  });
 }
},true);

document.addEventListener("input",event=>{
 const form=setupFormFrom(event.target);
 if(form&&event.target.matches?.('input[type="number"]'))queueSetupSave(form,{delay:360});
},true);

document.addEventListener("liar:settings-autosave",event=>{
 const form=event.target?.closest?.('form[data-action="settings"][data-settings-autosave]')||document.querySelector('form[data-action="settings"][data-settings-autosave]');
 if(form)queueSetupSave(form,{delay:0});
},true);

// Keep the historical submit path blocked. Settings are saved automatically.
document.addEventListener("submit",event=>{
 const form=event.target;
 if(!(form instanceof HTMLFormElement)||form.dataset.action!=="settings")return;
 event.preventDefault();event.stopPropagation();
 queueSetupSave(form,{delay:0});
},true);

// The start button is outside the settings form. Intercept it before app.js so
// a just-changed setting is persisted and its latest room version is used.
document.addEventListener("click",async event=>{
 const button=event.target.closest?.('[data-action="start-round"][data-can-start]');
 if(!button||button.disabled||setupStartInFlight)return;
 const snapshot=store.get().snapshot;
 if(!snapshot?.me?.is_host||snapshot.round||snapshot.game?.status!=="setup")return;
 event.preventDefault();event.stopImmediatePropagation();
 const form=document.querySelector('form[data-action="settings"][data-settings-autosave]');
 if(form){
  if(!form.checkValidity()){form.reportValidity();return;}
  queueSetupSave(form,{delay:0});
 }
 setupStartInFlight=true;
 button.disabled=true;
 button.textContent="게임 시작 중…";
 try{
  const saved=await drainSetupSaves();
  if(!saved)return;
  const latest=store.get().snapshot;
  const version=Number.isFinite(setupSaveVersion)?setupSaveVersion:Number(latest?.room?.version||0);
  await commands.startRound(version);
 }catch(error){
  const code=codeFor(error);
  if(code!=="STALE_VERSION")store.set({message:messageFor(error)});
  else store.set({message:"상태가 변경되었습니다. 잠시 후 다시 게임 시작을 눌러 주세요."});
 }finally{
  setupStartInFlight=false;
  const liveForm=document.querySelector('form[data-action="settings"][data-settings-autosave]');
  updateDraftStartButton(liveForm);
 }
},true);

const timer=window.setInterval(tick,140);
tick();
window.addEventListener("pagehide",()=>{window.clearInterval(timer);window.clearTimeout(setupSaveTimer);},{once:true});