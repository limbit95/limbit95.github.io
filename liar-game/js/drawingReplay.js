import { store } from "./store.js";

const WIDTH=900;
const HEIGHT=600;
let replayToken=0;
const reducedMotion=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches===true;
const wait=ms=>new Promise(resolve=>window.setTimeout(resolve,ms));

function prepareCanvas(canvas){
 canvas.width=WIDTH;
 canvas.height=HEIGHT;
 const ctx=canvas.getContext("2d");
 ctx.fillStyle="#fff";
 ctx.fillRect(0,0,WIDTH,HEIGHT);
 ctx.strokeStyle="#171717";
 ctx.fillStyle="#171717";
 ctx.lineWidth=6;
 ctx.lineCap="round";
 ctx.lineJoin="round";
 return ctx;
}

function pointOf(point){return {x:Number(point?.x||0)*WIDTH,y:Number(point?.y||0)*HEIGHT};}

function drawInstant(ctx,points=[]){
 if(!points.length)return;
 const first=pointOf(points[0]);
 if(points.length<2||points.every(point=>Number(point.x)===Number(points[0].x)&&Number(point.y)===Number(points[0].y))){
  ctx.beginPath();ctx.arc(first.x,first.y,3,0,Math.PI*2);ctx.fill();return;
 }
 ctx.beginPath();ctx.moveTo(first.x,first.y);
 points.slice(1).forEach(point=>{const next=pointOf(point);ctx.lineTo(next.x,next.y);});
 ctx.stroke();
}

async function animateStroke(ctx,points,token){
 if(reducedMotion()||!Array.isArray(points)||points.length<3){drawInstant(ctx,points);return;}
 const first=pointOf(points[0]);
 ctx.beginPath();ctx.moveTo(first.x,first.y);
 const duration=Math.min(650,Math.max(220,points.length*7));
 const started=performance.now();
 let drawn=1;
 await new Promise(resolve=>{
  const frame=now=>{
   if(token!==replayToken){resolve();return;}
   const ratio=Math.min(1,(now-started)/duration);
   const target=Math.max(2,Math.ceil(ratio*points.length));
   while(drawn<target){const point=pointOf(points[drawn]);ctx.lineTo(point.x,point.y);drawn+=1;}
   ctx.stroke();
   if(ratio>=1)resolve();else requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
 });
}

function replayStageLabel(stageNo){
 const stage=Number(stageNo||0);
 if(stage<=0)return "최초 그림";
 return `재투표 추가 그림 ${Math.max(1,stage-1)}차`;
}

async function runReplay(root){
 const strokes=Array.isArray(store.get().snapshot?.drawing?.strokes)?store.get().snapshot.drawing.strokes:[];
 if(!strokes.length)return;
 const canvas=root.querySelector("[data-drawing-replay-canvas]");
 const panel=root.querySelector("[data-drawing-replay-panel]");
 const stage=root.querySelector("[data-drawing-replay-stage]");
 const player=root.querySelector("[data-drawing-replay-player]");
 const progress=root.querySelector("[data-drawing-replay-progress]");
 const start=root.querySelector("[data-drawing-replay-start]");
 if(!canvas||!panel)return;
 const token=++replayToken;
 panel.hidden=false;
 panel.scrollIntoView?.({behavior:reducedMotion()?"auto":"smooth",block:"nearest"});
 const ctx=prepareCanvas(canvas);
 if(start)start.disabled=true;
 for(let i=0;i<strokes.length;i+=1){
  if(token!==replayToken)return;
  const stroke=strokes[i];
  if(stage)stage.textContent=replayStageLabel(stroke.drawing_stage_no);
  if(player)player.textContent=`${stroke.nickname||"참가자"} · ${Number(stroke.stroke_no||1)}획`;
  if(progress)progress.textContent=`${i} / ${strokes.length}획`;
  await animateStroke(ctx,stroke.points||[],token);
  if(progress)progress.textContent=`${i+1} / ${strokes.length}획`;
  if(i<strokes.length-1)await wait(reducedMotion()?80:180);
 }
 if(token!==replayToken)return;
 if(stage)stage.textContent="REPLAY COMPLETE";
 if(player)player.textContent="🎨 완성!";
 if(start){start.disabled=false;start.textContent="↻ 다시 재생";}
}

document.addEventListener("click",event=>{
 const start=event.target.closest?.("[data-drawing-replay-start],[data-drawing-replay-restart]");
 if(!start)return;
 const root=start.closest("[data-result-card]")?.querySelector(".drawing-result-experience")||start.closest(".drawing-result-experience");
 if(root)void runReplay(root);
});

window.addEventListener("pagehide",()=>{replayToken+=1;},{once:true});
