import { store } from "./store.js";

let scheduled=false;
let observer=null;

function strokeCountFromDom(){
  let used=0;
  document.querySelectorAll("[data-drawing-strokes]").forEach(node=>{
    const text=String(node.textContent||"").trim();
    const usedMatch=text.match(/(\d+)\s*획/);
    if(usedMatch){used=Math.max(used,Number(usedMatch[1])||0);return;}
    const limitedMatch=text.match(/(\d+)\s*\/\s*(\d+)/);
    if(limitedMatch){
      const remaining=Number(limitedMatch[1])||0;
      const limit=Number(limitedMatch[2])||0;
      used=Math.max(used,Math.max(0,limit-remaining));
    }
  });
  return used;
}

function currentDrawerState(){
  const snapshot=store.get().snapshot;
  const stage=document.querySelector("[data-drawing-stage]");
  if(!snapshot||!stage)return {snapshot:null,stage:null,isCurrent:false,used:0};
  const isCurrent=String(stage.dataset.currentDrawer||"")===String(snapshot.me?.player_id||"");
  const serverUsed=Math.max(0,Number(snapshot.drawing?.current_stroke_count||0));
  return {snapshot,stage,isCurrent,used:Math.max(serverUsed,strokeCountFromDom())};
}

function syncDrawingFinishGuard(){
  const {stage,isCurrent,used}=currentDrawerState();
  const button=stage?.querySelector('[data-action="finish-drawing-turn"]');
  if(!stage||!button)return;

  let note=stage.querySelector("[data-drawing-finish-requirement]");
  if(!note){
    note=document.createElement("p");
    note.className="drawing-finish-requirement";
    note.dataset.drawingFinishRequirement="";
    note.textContent="한 획 이상 그려야 그림 완료 버튼을 사용할 수 있습니다.";
    stage.querySelector(".drawing-actions")?.append(note);
  }

  if(!isCurrent){
    note?.classList.add("is-satisfied");
    return;
  }

  const saving=stage.querySelector("[data-drawing-board-anchor]")?.classList.contains("is-saving")===true;
  const blocked=used<1;
  const shouldDisable=blocked||saving;
  if(button.disabled!==shouldDisable)button.disabled=shouldDisable;
  const blockedValue=blocked?"true":"false";
  if(button.dataset.emptyDrawingBlocked!==blockedValue)button.dataset.emptyDrawingBlocked=blockedValue;
  const title=blocked?"한 획 이상 그린 뒤 완료할 수 있습니다.":"";
  if(button.title!==title)button.title=title;
  note?.classList.toggle("is-satisfied",!blocked);
}

function syncMvpSeparators(){
  document.querySelectorAll(".game-fun-stat-result").forEach(result=>{
    [...result.childNodes].forEach(node=>{
      if(node.nodeType!==Node.TEXT_NODE)return;
      const next=String(node.nodeValue||"").replaceAll(" · ",", ");
      if(next!==node.nodeValue)node.nodeValue=next;
    });
  });
}

function syncRoundProgressLabel(){
  document.querySelectorAll(".game-round-count").forEach(card=>{
    const count=Number(card.querySelector("strong")?.textContent||0);
    const label=`${count} ROUND 진행`;
    if(card.getAttribute("aria-label")!==label)card.setAttribute("aria-label",label);
  });
}

function sync(){
  scheduled=false;
  syncDrawingFinishGuard();
  syncMvpSeparators();
  syncRoundProgressLabel();
}

function schedule(){
  if(scheduled)return;
  scheduled=true;
  queueMicrotask(sync);
}

document.addEventListener("click",event=>{
  const button=event.target.closest?.('[data-action="finish-drawing-turn"]');
  if(!button)return;
  const {stage,isCurrent,used}=currentDrawerState();
  if(!stage||!isCurrent||used>0)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if(!button.disabled)button.disabled=true;
  const status=stage.querySelector("[data-drawing-local-status]");
  if(status)status.textContent="한 획 이상 그린 뒤 그림을 완료할 수 있습니다.";
  syncDrawingFinishGuard();
},true);

store.subscribe(schedule);
observer=new MutationObserver(schedule);
// Observe rendered content only. Do not observe class/disabled attributes because
// this module updates those attributes itself and could create a feedback loop.
observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true,characterData:true});
schedule();
window.addEventListener("pagehide",()=>observer?.disconnect(),{once:true});
