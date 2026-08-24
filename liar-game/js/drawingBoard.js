import { commands } from "./commands.js";
import { ERROR_MESSAGES, ROUND_STATUS } from "./constants.js";
import { store } from "./store.js";

const WIDTH=900;
const HEIGHT=600;
let observer=null;
let timer=null;
let timerKey="";
let autoAdvanceKey="";
let actionPending=false;

function codeFor(error){return Object.keys(ERROR_MESSAGES).find(code=>String(error?.message||"").includes(code));}
function messageFor(error){return ERROR_MESSAGES[codeFor(error)]||String(error?.message||"그림을 저장하지 못했습니다.");}
function setStatus(text){document.querySelector("[data-drawing-local-status]")?.replaceChildren(document.createTextNode(text||""));}

function strokePath(ctx,points){
 if(!Array.isArray(points)||!points.length)return;
 const first=points[0];
 const samePoint=points.every(point=>Number(point.x)===Number(first.x)&&Number(point.y)===Number(first.y));
 if(samePoint){ctx.beginPath();ctx.arc(Number(first.x)*WIDTH,Number(first.y)*HEIGHT,3,0,Math.PI*2);ctx.fillStyle="#171717";ctx.fill();return;}
 ctx.beginPath();ctx.moveTo(Number(first.x)*WIDTH,Number(first.y)*HEIGHT);
 points.slice(1).forEach(point=>ctx.lineTo(Number(point.x)*WIDTH,Number(point.y)*HEIGHT));ctx.stroke();
}

function drawPersisted(canvas){
 const ctx=canvas.getContext("2d");
 canvas.width=WIDTH;canvas.height=HEIGHT;
 ctx.fillStyle="#ffffff";ctx.fillRect(0,0,WIDTH,HEIGHT);
 ctx.strokeStyle="#171717";ctx.lineWidth=6;ctx.lineCap="round";ctx.lineJoin="round";
 const strokes=store.get().snapshot?.drawing?.strokes||[];
 strokes.forEach(stroke=>strokePath(ctx,stroke.points));
}

function normalizePoint(event,canvas){
 const rect=canvas.getBoundingClientRect();
 return {x:Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width)),y:Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height))};
}
function pointDistance(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}

async function submitStroke(points,canvas){
 if(actionPending)return;
 const state=store.get();
 const round=state.snapshot?.round;
 if(round?.status!==ROUND_STATUS.DRAWING)return;
 let shouldAdvance=false;
 actionPending=true;canvas.dataset.submitting="true";setStatus("획을 저장하고 있습니다…");
 try{
  await commands.submitDrawingStroke(points,round.version);
  setStatus("획을 저장했습니다.");
 }catch(error){
  const code=codeFor(error);setStatus(messageFor(error));
  shouldAdvance=code==="DRAWING_TIME_EXPIRED";
  if(!shouldAdvance)window.setTimeout(()=>drawPersisted(canvas),180);
 }finally{
  actionPending=false;delete canvas.dataset.submitting;
  if(shouldAdvance)void advanceWhenAllowed();
 }
}

function bindDrawing(canvas){
 if(canvas.dataset.drawingBound==="true")return;
 canvas.dataset.drawingBound="true";drawPersisted(canvas);
 const canDraw=canvas.dataset.canDraw==="true";
 canvas.style.touchAction=canDraw?"none":"auto";
 if(!canDraw)return;
 let drawing=false;let points=[];let pointerId=null;
 const ctx=canvas.getContext("2d");
 ctx.strokeStyle="#171717";ctx.fillStyle="#171717";ctx.lineWidth=6;ctx.lineCap="round";ctx.lineJoin="round";
 canvas.addEventListener("pointerdown",event=>{
  if(actionPending||canvas.dataset.canDraw!=="true")return;
  drawing=true;pointerId=event.pointerId;points=[normalizePoint(event,canvas)];
  canvas.setPointerCapture?.(event.pointerId);ctx.beginPath();ctx.moveTo(points[0].x*WIDTH,points[0].y*HEIGHT);
 });
 canvas.addEventListener("pointermove",event=>{
  if(!drawing||event.pointerId!==pointerId)return;
  const point=normalizePoint(event,canvas);const last=points[points.length-1];
  if(points.length>=400||pointDistance(last,point)<.0025)return;
  points.push(point);ctx.lineTo(point.x*WIDTH,point.y*HEIGHT);ctx.stroke();
 });
 const finish=event=>{
  if(!drawing||event.pointerId!==pointerId)return;
  drawing=false;canvas.releasePointerCapture?.(event.pointerId);pointerId=null;
  if(points.length===1){ctx.beginPath();ctx.arc(points[0].x*WIDTH,points[0].y*HEIGHT,3,0,Math.PI*2);ctx.fill();points.push({...points[0]});}
  const payload=points.map(point=>({x:Number(point.x.toFixed(5)),y:Number(point.y.toFixed(5))}));
  points=[];void submitStroke(payload,canvas);
 };
 canvas.addEventListener("pointerup",finish);
 canvas.addEventListener("pointercancel",event=>{if(drawing&&event.pointerId===pointerId){drawing=false;pointerId=null;points=[];drawPersisted(canvas);}});
}

function currentDrawerCanAdvance(snapshot){
 if(snapshot?.round?.status!==ROUND_STATUS.DRAWING)return false;
 if(snapshot.me?.is_host===true)return true;
 const currentId=snapshot.drawing?.current_round_player_id;
 const current=snapshot.round_players?.find(player=>String(player.id)===String(currentId));
 return current?.player_id===snapshot.me?.player_id;
}

async function advanceWhenAllowed(){
 const snapshot=store.get().snapshot;
 if(!currentDrawerCanAdvance(snapshot)||actionPending)return;
 const key=`${snapshot.round.id}:${snapshot.round.version}`;
 if(autoAdvanceKey===key)return;
 autoAdvanceKey=key;actionPending=true;setStatus("다음 그림 차례로 이동합니다…");
 try{await commands.advanceDrawingTurn(snapshot.round.version);}
 catch(error){if(codeFor(error)!=="STALE_VERSION"&&!String(error?.message||"").includes("요청을 처리 중"))setStatus(messageFor(error));autoAdvanceKey="";}
 finally{actionPending=false;}
}

function startTimer(){
 const snapshot=store.get().snapshot;
 if(snapshot?.round?.status!==ROUND_STATUS.DRAWING){if(timer)clearInterval(timer);timer=null;timerKey="";return;}
 const drawing=snapshot.drawing||{};
 const key=`${snapshot.round.id}:${drawing.turn_started_at||""}`;
 if(timer&&timerKey===key)return;
 if(timer)clearInterval(timer);timer=null;timerKey=key;autoAdvanceKey="";
 const started=Date.parse(drawing.turn_started_at||"");
 const serverNow=Date.parse(drawing.server_now||"");
 const limit=Math.max(1,Number(drawing.time_limit||15))*1000;
 const elapsedAtSnapshot=Number.isFinite(started)&&Number.isFinite(serverNow)?Math.max(0,serverNow-started):0;
 const deadline=performance.now()+Math.max(0,limit-elapsedAtSnapshot);
 const update=()=>{
  const element=document.querySelector("[data-drawing-timer]");
  if(!element){clearInterval(timer);timer=null;return;}
  const remaining=Math.max(0,deadline-performance.now());
  element.textContent=`${Math.ceil(remaining/1000)}초`;
  element.closest("span")?.classList.toggle("is-ending",remaining>0&&remaining<=5000);
  if(remaining<=0&&!actionPending){clearInterval(timer);timer=null;void advanceWhenAllowed();}
 };
 update();timer=setInterval(update,120);
}

function inspect(){
 [...document.querySelectorAll("[data-drawing-canvas]")].forEach(bindDrawing);
 if(document.querySelector("[data-drawing-stage]"))startTimer();
 else if(timer){clearInterval(timer);timer=null;timerKey="";}
}

observer=new MutationObserver(inspect);
observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});
inspect();
window.addEventListener("pagehide",()=>{observer?.disconnect();if(timer)clearInterval(timer);},{once:true});
