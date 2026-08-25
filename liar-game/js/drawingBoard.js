import { commands } from "./commands.js";
import { ERROR_MESSAGES, ROUND_STATUS } from "./constants.js";
import { broadcastDrawingStroke, subscribeDrawingRealtime, unsubscribeDrawingRealtime } from "./realtime.js";
import { store } from "./store.js";

const WIDTH=900;
const HEIGHT=600;
const LIVE_BATCH_MS=32;
let observer=null;
let timer=null;
let timerKey="";
let turnUnlockAtPerf=0;
let autoAdvanceKey="";
let advancePending=false;
let advanceRequested=false;
let localTurnKey="";
let localExpectedRoundVersion=null;
let localStrokeCount=0;
let optimisticStrokes=[];
let saveQueue=[];
let saveWorker=false;
let lastCueKey="";
let lastOwnTurnKey="";
let audioContext=null;
const remotePaths=new Map();

const reducedMotion=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches===true;
function codeFor(error){return Object.keys(ERROR_MESSAGES).find(code=>String(error?.message||"").includes(code));}
function messageFor(error){return ERROR_MESSAGES[codeFor(error)]||String(error?.message||"그림을 저장하지 못했습니다.");}
function setStatus(text){document.querySelector("[data-drawing-local-status]")?.replaceChildren(document.createTextNode(text||""));}

function setupContext(ctx){
 ctx.strokeStyle="#171717";ctx.fillStyle="#171717";ctx.lineWidth=6;ctx.lineCap="round";ctx.lineJoin="round";
}
function strokePath(ctx,points){
 if(!Array.isArray(points)||!points.length)return;
 const first=points[0];
 const samePoint=points.every(point=>Number(point.x)===Number(first.x)&&Number(point.y)===Number(first.y));
 if(samePoint){ctx.beginPath();ctx.arc(Number(first.x)*WIDTH,Number(first.y)*HEIGHT,3,0,Math.PI*2);ctx.fill();return;}
 ctx.beginPath();ctx.moveTo(Number(first.x)*WIDTH,Number(first.y)*HEIGHT);
 points.slice(1).forEach(point=>ctx.lineTo(Number(point.x)*WIDTH,Number(point.y)*HEIGHT));ctx.stroke();
}
function drawPersisted(canvas){
 if(!canvas)return;
 const ctx=canvas.getContext("2d");
 canvas.width=WIDTH;canvas.height=HEIGHT;
 ctx.fillStyle="#ffffff";ctx.fillRect(0,0,WIDTH,HEIGHT);setupContext(ctx);
 const strokes=store.get().snapshot?.drawing?.strokes||[];
 strokes.forEach(stroke=>strokePath(ctx,stroke.points));
 optimisticStrokes.forEach(stroke=>strokePath(ctx,stroke.points));
}

function normalizePoint(event,canvas){
 const rect=canvas.getBoundingClientRect();
 return {x:Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width)),y:Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height))};
}
function pointDistance(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function compactPoint(point){return {x:Number(point.x.toFixed(5)),y:Number(point.y.toFixed(5))};}
function turnKey(snapshot){
 if(snapshot?.round?.status!==ROUND_STATUS.DRAWING)return "";
 return `${snapshot.round.id}:${snapshot.drawing?.drawing_stage_no||0}:${snapshot.drawing?.current_round_player_id||""}:${snapshot.drawing?.turn_started_at||""}`;
}
function isCurrentDrawer(snapshot){
 const currentId=snapshot?.drawing?.current_round_player_id;
 const current=snapshot?.round_players?.find(player=>String(player.id)===String(currentId));
 return current?.player_id===snapshot?.me?.player_id;
}
function syncLocalTurn(snapshot){
 const key=turnKey(snapshot);
 if(!key||key===localTurnKey)return;
 localTurnKey=key;
 localExpectedRoundVersion=snapshot.round.version;
 localStrokeCount=Number(snapshot.drawing?.current_stroke_count||0);
 optimisticStrokes=[];
 saveQueue=[];
 saveWorker=false;
 advanceRequested=false;
 autoAdvanceKey="";
 remotePaths.clear();
 updateStrokeIndicators(snapshot);
 if(isCurrentDrawer(snapshot)&&lastOwnTurnKey!==key){
  lastOwnTurnKey=key;
  requestAnimationFrame(()=>document.querySelector("[data-drawing-board-anchor]")?.scrollIntoView?.({behavior:reducedMotion()?"auto":"smooth",block:"center"}));
 }
}
function canAcceptStroke(snapshot){
 if(snapshot?.round?.status!==ROUND_STATUS.DRAWING||!isCurrentDrawer(snapshot)||advancePending||advanceRequested)return false;
 if(performance.now()<turnUnlockAtPerf)return false;
 const unlimited=snapshot.drawing?.stroke_unlimited===true;
 const limit=Number(snapshot.drawing?.stroke_limit||snapshot.round?.drawing_stroke_limit_snapshot||3);
 return unlimited||localStrokeCount<limit;
}
function updateStrokeIndicators(snapshot=store.get().snapshot){
 if(snapshot?.round?.status!==ROUND_STATUS.DRAWING)return;
 const unlimited=snapshot.drawing?.stroke_unlimited===true;
 const limit=Number(snapshot.drawing?.stroke_limit||snapshot.round?.drawing_stroke_limit_snapshot||3);
 const text=unlimited?`${localStrokeCount}획 · ∞`:`${Math.max(0,limit-localStrokeCount)} / ${limit}`;
 document.querySelectorAll("[data-drawing-strokes]").forEach(element=>{element.textContent=text;});
 const pending=saveWorker||saveQueue.length>0;
 document.querySelector("[data-drawing-board-anchor]")?.classList.toggle("is-saving",pending);
 const finish=document.querySelector('[data-action="finish-drawing-turn"]');
 if(finish&&isCurrentDrawer(snapshot))finish.disabled=pending;
}

function primeAudio(){
 try{
  audioContext??=new (window.AudioContext||window.webkitAudioContext)();
  if(audioContext.state==="suspended")void audioContext.resume();
 }catch{}
}
function playTone(frequency,duration=.07){
 try{
  primeAudio();
  if(!audioContext||audioContext.state!=="running")return;
  const oscillator=audioContext.createOscillator();const gain=audioContext.createGain();
  oscillator.frequency.value=frequency;gain.gain.value=.035;oscillator.connect(gain);gain.connect(audioContext.destination);
  oscillator.start();gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duration);oscillator.stop(audioContext.currentTime+duration);
 }catch{}
}
function cueCountdown(snapshot,label){
 if(!isCurrentDrawer(snapshot))return;
 const key=`${turnKey(snapshot)}:${label}`;if(lastCueKey===key)return;lastCueKey=key;
 if(label==="DRAW"){
  playTone(760,.12);
  try{navigator.vibrate?.([100,60,120]);}catch{}
 }else playTone(470,.055);
}

document.addEventListener("pointerdown",primeAudio,{capture:true});
document.addEventListener("keydown",primeAudio,{capture:true});

function broadcastPayload(phase,strokeId,points=[]){
 const snapshot=store.get().snapshot;
 if(snapshot?.round?.status!==ROUND_STATUS.DRAWING||!isCurrentDrawer(snapshot))return;
 void broadcastDrawingStroke({
  round_id:snapshot.round.id,
  drawing_stage_no:Number(snapshot.drawing?.drawing_stage_no||0),
  round_player_id:snapshot.drawing?.current_round_player_id,
  stroke_id:strokeId,
  phase,
  points:points.slice(0,50).map(compactPoint)
 });
}
function validLivePoints(points){
 if(!Array.isArray(points)||points.length>50)return [];
 return points.filter(point=>Number.isFinite(Number(point?.x))&&Number.isFinite(Number(point?.y))&&Number(point.x)>=0&&Number(point.x)<=1&&Number(point.y)>=0&&Number(point.y)<=1).map(point=>({x:Number(point.x),y:Number(point.y)}));
}
function handleRemoteStroke(payload){
 const snapshot=store.get().snapshot;
 if(snapshot?.round?.status!==ROUND_STATUS.DRAWING)return;
 if(String(payload?.round_id)!==String(snapshot.round.id))return;
 if(Number(payload?.drawing_stage_no||0)!==Number(snapshot.drawing?.drawing_stage_no||0))return;
 if(String(payload?.round_player_id)!==String(snapshot.drawing?.current_round_player_id||""))return;
 const strokeId=String(payload?.stroke_id||"");if(!strokeId)return;
 const phase=String(payload?.phase||"");
 const points=validLivePoints(payload?.points);
 const canvas=document.querySelector("[data-drawing-stage] [data-drawing-canvas]");if(!canvas)return;
 if(phase==="cancel"){remotePaths.delete(strokeId);drawPersisted(canvas);return;}
 const ctx=canvas.getContext("2d");setupContext(ctx);
 if(phase==="begin"){
  if(!points.length)return;
  remotePaths.set(strokeId,{last:points[0],moved:false});
  return;
 }
 const state=remotePaths.get(strokeId);if(!state)return;
 if(points.length){
  ctx.beginPath();ctx.moveTo(state.last.x*WIDTH,state.last.y*HEIGHT);
  for(const point of points){ctx.lineTo(point.x*WIDTH,point.y*HEIGHT);state.last=point;state.moved=true;}
  ctx.stroke();
 }
 if(phase==="end"){
  if(!state.moved){ctx.beginPath();ctx.arc(state.last.x*WIDTH,state.last.y*HEIGHT,3,0,Math.PI*2);ctx.fill();}
  remotePaths.delete(strokeId);
 }
}

async function ensureDrawingRealtime(){
 const snapshot=store.get().snapshot;
 if(snapshot?.round?.status===ROUND_STATUS.DRAWING&&snapshot.room?.id){
  await subscribeDrawingRealtime(snapshot.room.id,handleRemoteStroke);
 }else await unsubscribeDrawingRealtime();
}

function removeOptimistic(id){optimisticStrokes=optimisticStrokes.filter(stroke=>stroke.id!==id);}
async function processSaveQueue(){
 if(saveWorker||!saveQueue.length)return;
 saveWorker=true;updateStrokeIndicators();
 while(saveQueue.length){
  const item=saveQueue[0];
  const snapshot=store.get().snapshot;
  if(!snapshot||turnKey(snapshot)!==item.turnKey||snapshot.round?.status!==ROUND_STATUS.DRAWING){saveQueue=[];break;}
  try{
   const result=await commands.submitDrawingStroke(item.points,localExpectedRoundVersion??snapshot.round.version);
   const row=Array.isArray(result)?result[0]:result;
   if(row?.round_version!==undefined&&row?.round_version!==null)localExpectedRoundVersion=row.round_version;
   saveQueue.shift();
   if(row?.turn_finished===true){
    setStatus(row?.drawing_finished===true?"그림 단계가 완료되었습니다.":"다음 그림 차례로 이동합니다…");
    saveQueue=[];
    break;
   }
  }catch(error){
   const code=codeFor(error);saveQueue.shift();removeOptimistic(item.id);
   if(code==="DRAWING_TIME_EXPIRED"){localStrokeCount=Math.max(0,localStrokeCount-1);advanceRequested=true;setStatus(messageFor(error));}
   else if(code==="STALE_VERSION"||code==="INVALID_ROUND_STATE"||code==="NOT_CURRENT_DRAWER"){saveQueue=[];setStatus("그림 차례가 변경되어 최신 상태를 불러옵니다.");}
   else{localStrokeCount=Math.max(0,localStrokeCount-1);setStatus(messageFor(error));drawPersisted(document.querySelector("[data-drawing-stage] [data-drawing-canvas]"));}
  }
  updateStrokeIndicators();
 }
 saveWorker=false;updateStrokeIndicators();
 if(!saveQueue.length&&!advanceRequested&&!advancePending&&store.get().snapshot?.round?.status===ROUND_STATUS.DRAWING)setStatus("");
 if(advanceRequested&&!saveQueue.length)void advanceWhenAllowed();
}
function enqueueStroke(points){
 const snapshot=store.get().snapshot;if(!canAcceptStroke(snapshot))return;
 const id=crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`;
 localStrokeCount+=1;optimisticStrokes.push({id,points});
 saveQueue.push({id,points,turnKey:turnKey(snapshot)});updateStrokeIndicators(snapshot);
 setStatus(saveQueue.length>1?`${saveQueue.length}획을 순서대로 저장하고 있습니다…`:"획을 저장하고 있습니다…");
 void processSaveQueue();
}

function bindDrawing(canvas){
 if(canvas.dataset.drawingBound==="true")return;
 canvas.dataset.drawingBound="true";drawPersisted(canvas);
 const canDraw=canvas.dataset.canDraw==="true";
 canvas.style.touchAction=canDraw?"none":"auto";
 if(!canDraw)return;
 let drawing=false;let points=[];let pointerId=null;let strokeId="";let liveBuffer=[];let liveTimer=null;
 const ctx=canvas.getContext("2d");setupContext(ctx);
 const flushLive=()=>{
  if(liveTimer){clearTimeout(liveTimer);liveTimer=null;}
  if(!strokeId||!liveBuffer.length)return;
  const batch=liveBuffer;liveBuffer=[];broadcastPayload("move",strokeId,batch);
 };
 const queueLive=point=>{
  liveBuffer.push(point);
  if(liveBuffer.length>=6){flushLive();return;}
  if(!liveTimer)liveTimer=setTimeout(flushLive,LIVE_BATCH_MS);
 };
 canvas.addEventListener("pointerdown",event=>{
  const snapshot=store.get().snapshot;
  if(canvas.dataset.canDraw!=="true"||!canAcceptStroke(snapshot))return;
  drawing=true;pointerId=event.pointerId;points=[normalizePoint(event,canvas)];strokeId=crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`;
  canvas.setPointerCapture?.(event.pointerId);ctx.beginPath();ctx.moveTo(points[0].x*WIDTH,points[0].y*HEIGHT);broadcastPayload("begin",strokeId,[points[0]]);
 });
 canvas.addEventListener("pointermove",event=>{
  if(!drawing||event.pointerId!==pointerId)return;
  const point=normalizePoint(event,canvas);const last=points[points.length-1];
  if(points.length>=400||pointDistance(last,point)<.0025)return;
  points.push(point);ctx.lineTo(point.x*WIDTH,point.y*HEIGHT);ctx.stroke();queueLive(point);
 });
 const finish=event=>{
  if(!drawing||event.pointerId!==pointerId)return;
  drawing=false;canvas.releasePointerCapture?.(event.pointerId);pointerId=null;flushLive();
  if(points.length===1){ctx.beginPath();ctx.arc(points[0].x*WIDTH,points[0].y*HEIGHT,3,0,Math.PI*2);ctx.fill();points.push({...points[0]});}
  broadcastPayload("end",strokeId,[points[points.length-1]]);
  const payload=points.map(compactPoint);points=[];strokeId="";enqueueStroke(payload);
 };
 canvas.addEventListener("pointerup",finish);
 canvas.addEventListener("pointercancel",event=>{
  if(!drawing||event.pointerId!==pointerId)return;
  drawing=false;pointerId=null;points=[];flushLive();broadcastPayload("cancel",strokeId);strokeId="";drawPersisted(canvas);
 });
}

function currentDrawerCanAdvance(snapshot){
 if(snapshot?.round?.status!==ROUND_STATUS.DRAWING)return false;
 if(snapshot.me?.is_host===true)return true;
 return isCurrentDrawer(snapshot);
}
async function advanceWhenAllowed(){
 const snapshot=store.get().snapshot;
 if(!currentDrawerCanAdvance(snapshot)||advancePending)return;
 if(saveWorker||saveQueue.length){advanceRequested=true;setStatus("현재 획 저장이 끝난 뒤 다음 차례로 이동합니다…");return;}
 const key=`${snapshot.round.id}:${snapshot.round.version}:${snapshot.drawing?.current_round_player_id||""}`;
 if(autoAdvanceKey===key)return;
 autoAdvanceKey=key;advancePending=true;advanceRequested=false;setStatus("다음 그림 차례로 이동합니다…");updateStrokeIndicators(snapshot);
 try{await commands.advanceDrawingTurn(snapshot.round.version);}
 catch(error){if(codeFor(error)!=="STALE_VERSION"&&!String(error?.message||"").includes("요청을 처리 중"))setStatus(messageFor(error));autoAdvanceKey="";}
 finally{advancePending=false;updateStrokeIndicators();}
}

function updateCountdownOverlay(snapshot,untilStart){
 const overlay=document.querySelector("[data-drawing-countdown]");if(!overlay)return;
 const shell=overlay.closest(".drawing-board-shell");
 const value=overlay.querySelector("[data-drawing-countdown-value]");
 const label=overlay.querySelector("[data-drawing-countdown-label]");
 if(untilStart>0){
  const count=Math.max(1,Math.min(3,Math.ceil(untilStart/1000)));overlay.hidden=false;overlay.classList.remove("is-draw");shell?.classList.add("is-counting-down");
  if(value)value.textContent=String(count);if(label)label.textContent="준비!";cueCountdown(snapshot,String(count));
 }else if(untilStart>-650){
  overlay.hidden=false;overlay.classList.add("is-draw");shell?.classList.remove("is-counting-down");if(value)value.textContent="DRAW!";if(label)label.textContent="지금 시작하세요";cueCountdown(snapshot,"DRAW");
 }else{overlay.hidden=true;overlay.classList.remove("is-draw");shell?.classList.remove("is-counting-down");}
}
function startTimer(){
 const snapshot=store.get().snapshot;
 if(snapshot?.round?.status!==ROUND_STATUS.DRAWING){if(timer)clearInterval(timer);timer=null;timerKey="";return;}
 syncLocalTurn(snapshot);
 const drawing=snapshot.drawing||{};
 const key=turnKey(snapshot);
 if(timer&&timerKey===key)return;
 if(timer)clearInterval(timer);timer=null;timerKey=key;autoAdvanceKey="";lastCueKey="";
 const started=Date.parse(drawing.turn_started_at||"");
 const serverNow=Date.parse(drawing.server_now||"");
 const limit=Math.max(1,Number(drawing.time_limit||15))*1000;
 const startDelay=Number.isFinite(started)&&Number.isFinite(serverNow)?started-serverNow:0;
 turnUnlockAtPerf=performance.now()+Math.max(0,startDelay);
 const deadline=turnUnlockAtPerf+limit;
 const update=()=>{
  const elements=[...document.querySelectorAll("[data-drawing-timer]")];
  if(!elements.length){clearInterval(timer);timer=null;return;}
  const now=performance.now();const untilStart=turnUnlockAtPerf-now;const remaining=Math.max(0,deadline-now);
  updateCountdownOverlay(store.get().snapshot,untilStart);
  const label=untilStart>0?`${Math.ceil(limit/1000)}초`:`${Math.ceil(remaining/1000)}초`;
  elements.forEach(element=>{element.textContent=label;element.closest("span")?.classList.toggle("is-ending",untilStart<=0&&remaining>0&&remaining<=5000);});
  if(remaining<=0){
   clearInterval(timer);timer=null;advanceRequested=true;
   if(!saveWorker&&!saveQueue.length)void advanceWhenAllowed();
  }
 };
 update();timer=setInterval(update,90);
}

function inspect(){
 const snapshot=store.get().snapshot;
 [...document.querySelectorAll("[data-drawing-canvas]")].forEach(bindDrawing);
 if(document.querySelector("[data-drawing-stage]")){syncLocalTurn(snapshot);startTimer();void ensureDrawingRealtime();}
 else{
  if(timer){clearInterval(timer);timer=null;timerKey="";}
  remotePaths.clear();void unsubscribeDrawingRealtime();
 }
}

observer=new MutationObserver(inspect);
observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});
inspect();
window.addEventListener("pagehide",()=>{observer?.disconnect();if(timer)clearInterval(timer);void unsubscribeDrawingRealtime();},{once:true});
