import { commands } from "./commands.js";
import { store } from "./store.js";

let activeKey="";
let timer=null;
let revealing=false;
let observer=null;

const cardKey=card=>`${card?.dataset.resultId||""}:${card?.dataset.finishedAt||""}`;

function clearTimer(){
 if(timer){clearInterval(timer);timer=null;}
}

function removeOverlay(){
 clearTimer();
 document.querySelector("[data-result-reveal-countdown]")?.remove();
 activeKey="";
 revealing=false;
}

function makeOverlay(){
 const overlay=document.createElement("div");
 overlay.className="result-reveal-countdown";
 overlay.dataset.resultRevealCountdown="";
 overlay.setAttribute("role","status");
 overlay.setAttribute("aria-live","assertive");
 overlay.innerHTML=`<div class="result-reveal-countdown-inner">
  <span class="result-reveal-kicker">LIAR REVEAL</span>
  <h2>라이어 검거 실패</h2>
  <p>잠시 후 실제 라이어가 공개됩니다</p>
  <strong class="result-reveal-count" data-result-reveal-count>5</strong>
  <div class="result-reveal-ring" aria-hidden="true"></div>
 </div>`;
 document.body.append(overlay);
 return overlay;
}

function setCount(overlay,value){
 const count=overlay.querySelector("[data-result-reveal-count]");
 if(!count||count.textContent===String(value))return;
 count.textContent=String(value);
 count.classList.remove("is-ticking");
 void count.offsetWidth;
 count.classList.add("is-ticking");
 overlay.classList.remove("is-pulsing");
 void overlay.offsetWidth;
 overlay.classList.add("is-pulsing");
}

function setRevealText(overlay){
 const inner=overlay.querySelector(".result-reveal-countdown-inner");
 if(!inner)return;
 inner.classList.add("is-revealing");
 const count=overlay.querySelector("[data-result-reveal-count]");
 if(count)count.textContent="!";
 const title=overlay.querySelector("h2");
 const copy=overlay.querySelector("p");
 if(title)title.textContent="정체 공개!";
 if(copy)copy.textContent="실제 라이어를 확인합니다";
}

async function revealWhenReady(key,overlay){
 if(revealing||activeKey!==key)return;
 revealing=true;
 setRevealText(overlay);
 try{
  const version=store.get().snapshot?.round?.version;
  if(version==null)throw new Error("INVALID_ROUND_STATE");
  await commands.autoRevealResultLiars(version);
  // The room version update broadcasts state_changed; the normal app refresh will replace the result card.
 }catch(error){
  const message=String(error?.message||"");
  revealing=false;
  if(message.includes("RESULT_REVEAL_COUNTDOWN_ACTIVE")||message.includes("STALE_VERSION")||message.includes("요청을 처리 중")){
   window.setTimeout(()=>{
    const current=document.querySelector("[data-result-card]");
    if(current&&cardKey(current)===key&&current.dataset.liarsRevealed!=="true")void revealWhenReady(key,overlay);
   },400);
   return;
  }
  removeOverlay();
 }
}

function startCountdown(card){
 const key=cardKey(card);
 if(!key||key===activeKey)return;
 removeOverlay();
 activeKey=key;
 const overlay=makeOverlay();
 const finishedAt=Date.parse(card.dataset.finishedAt||"");
 const serverNow=Date.parse(card.dataset.serverNow||"");
 const elapsed=Number.isFinite(finishedAt)&&Number.isFinite(serverNow)?Math.max(0,serverNow-finishedAt):0;
 const initialRemaining=Math.max(0,5000-elapsed);
 const deadline=performance.now()+initialRemaining;
 let lastCount=null;
 const tick=()=>{
  if(activeKey!==key)return;
  const current=document.querySelector("[data-result-card]");
  if(!current||cardKey(current)!==key||current.dataset.liarsRevealed==="true"){
   removeOverlay();
   return;
  }
  const remaining=Math.max(0,deadline-performance.now());
  if(remaining<=0){
   clearTimer();
   void revealWhenReady(key,overlay);
   return;
  }
  const count=Math.max(1,Math.ceil(remaining/1000));
  if(count!==lastCount){lastCount=count;setCount(overlay,count);}
 };
 tick();
 timer=setInterval(tick,80);
}

function inspect(){
 const card=document.querySelector("[data-result-card]");
 const needsCountdown=card
  &&card.dataset.resultWinner==="liar"
  &&card.dataset.captureSucceeded==="false"
  &&card.dataset.liarsRevealed!=="true";
 if(!needsCountdown){
  if(activeKey)removeOverlay();
  return;
 }
 startCountdown(card);
}

observer=new MutationObserver(inspect);
observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});
inspect();
window.addEventListener("pagehide",()=>{observer?.disconnect();removeOverlay();},{once:true});
