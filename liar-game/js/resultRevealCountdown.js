import { getRoundResult } from "./api.js";
import { commands } from "./commands.js";
import { store } from "./store.js";

const MARKER_PREFIX="liar_result_reveal";
let activeKey="";
let timer=null;
let revealing=false;
let observer=null;
let pendingResult=null;
let pendingVersions=null;

const cardKey=card=>`${card?.dataset.resultId||""}:${card?.dataset.finishedAt||""}`;
const markerKey=card=>`${MARKER_PREFIX}:${store.get().session?.user?.id||"anon"}:${card?.dataset.resultId||"unknown"}`;

function readMarker(card){
 try{return localStorage.getItem(markerKey(card))||"";}catch{return "";}
}
function writeMarker(card,value){
 try{localStorage.setItem(markerKey(card),value);}catch{}
}
function pruneMarkers(card){
 const prefix=`${MARKER_PREFIX}:${store.get().session?.user?.id||"anon"}:`;
 const keep=markerKey(card);
 try{
  for(let i=localStorage.length-1;i>=0;i-=1){
   const key=localStorage.key(i);
   if(key?.startsWith(prefix)&&key!==keep)localStorage.removeItem(key);
  }
 }catch{}
}

function clearTimer(){
 if(timer){clearInterval(timer);timer=null;}
}

function removeOverlay(){
 clearTimer();
 document.querySelector("[data-result-reveal-countdown]")?.remove();
 activeKey="";
 revealing=false;
}

function applyPendingResult(){
 if(!pendingResult)return;
 const state=store.get();
 const snapshot=state.snapshot;
 const roundVersion=Number(pendingVersions?.round_version);
 const roomVersion=Number(pendingVersions?.room_version);
 const nextSnapshot=snapshot?{
  ...snapshot,
  room:{...snapshot.room,version:Number.isFinite(roomVersion)?roomVersion:snapshot.room.version},
  round:snapshot.round?{...snapshot.round,version:Number.isFinite(roundVersion)?roundVersion:snapshot.round.version}:snapshot.round,
 }:snapshot;
 store.set({snapshot:nextSnapshot,resultState:pendingResult});
 pendingResult=null;
 pendingVersions=null;
}

function makeOverlay(){
 const overlay=document.createElement("div");
 overlay.className="result-reveal-countdown";
 overlay.dataset.resultRevealCountdown="";
 overlay.setAttribute("role","dialog");
 overlay.setAttribute("aria-modal","true");
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

function showRevealedLiars(overlay,liars=[]){
 const inner=overlay.querySelector(".result-reveal-countdown-inner");
 if(!inner)return;
 inner.classList.add("is-revealing","is-revealed");
 const names=liars.map(liar=>String(liar?.nickname||"")).filter(Boolean);
 inner.replaceChildren();
 const kicker=document.createElement("span");
 kicker.className="result-reveal-kicker";
 kicker.textContent="IDENTITY REVEALED";
 const title=document.createElement("h2");
 title.textContent="실제 라이어";
 const nameWrap=document.createElement("div");
 nameWrap.className="result-revealed-liars";
 if(names.length){
  names.forEach(name=>{
   const chip=document.createElement("strong");
   chip.className="result-revealed-liar-name";
   chip.textContent=name;
   nameWrap.append(chip);
  });
 }else{
  const chip=document.createElement("strong");
  chip.className="result-revealed-liar-name";
  chip.textContent="라이어 공개 완료";
  nameWrap.append(chip);
 }
 const copy=document.createElement("p");
 copy.textContent="투표 결과와 실제 라이어를 비교해 보세요.";
 const button=document.createElement("button");
 button.type="button";
 button.className="result-reveal-close";
 button.dataset.resultRevealClose="";
 button.textContent="결과 화면 보기";
 inner.append(kicker,title,nameWrap,copy,button);
 requestAnimationFrame(()=>button.focus({preventScroll:true}));
}

function timingFor(card){
 const finishedAt=Date.parse(card.dataset.finishedAt||"");
 const serverNow=Date.parse(card.dataset.serverNow||"");
 const elapsed=Number.isFinite(finishedAt)&&Number.isFinite(serverNow)?Math.max(0,serverNow-finishedAt):0;
 return Math.max(0,5000-elapsed);
}

async function completeReveal(card,overlay=null){
 if(revealing)return;
 revealing=true;
 const key=cardKey(card);
 try{
  const version=store.get().snapshot?.round?.version;
  if(version==null)throw new Error("INVALID_ROUND_STATE");
  const result=await commands.autoRevealResultLiars(version);
  const latest=await getRoundResult();
  const versions=result?.[0]||{};
  pendingResult=latest;
  pendingVersions=versions;
  writeMarker(card,"revealed");
  if(overlay&&activeKey===key){
   clearTimer();
   showRevealedLiars(overlay,latest?.actual_liars||[]);
   revealing=false;
  }else{
   applyPendingResult();
   revealing=false;
  }
 }catch(error){
  const message=String(error?.message||"");
  revealing=false;
  if(message.includes("RESULT_REVEAL_COUNTDOWN_ACTIVE")||message.includes("STALE_VERSION")||message.includes("요청을 처리 중")){
   window.setTimeout(()=>{
    const current=document.querySelector("[data-result-card]");
    if(current&&cardKey(current)===key&&current.dataset.liarsRevealed!=="true")void completeReveal(current,overlay?.isConnected?overlay:null);
   },350);
   return;
  }
  if(overlay?.isConnected)removeOverlay();
 }
}

function runSilentReveal(card){
 const key=cardKey(card);
 if(activeKey===key)return;
 activeKey=key;
 const wait=timingFor(card);
 const deadline=performance.now()+wait;
 const tick=()=>{
  const current=document.querySelector("[data-result-card]");
  if(!current||cardKey(current)!==key||current.dataset.liarsRevealed==="true"){
   clearTimer();activeKey="";return;
  }
  if(performance.now()>=deadline){clearTimer();void completeReveal(current,null);}
 };
 tick();
 timer=setInterval(tick,100);
}

function startCountdown(card){
 const key=cardKey(card);
 if(!key||key===activeKey)return;
 removeOverlay();
 activeKey=key;
 pruneMarkers(card);
 writeMarker(card,"started");
 const overlay=makeOverlay();
 const deadline=performance.now()+timingFor(card);
 let lastCount=null;
 const tick=()=>{
  if(activeKey!==key)return;
  const current=document.querySelector("[data-result-card]");
  if(!current||cardKey(current)!==key){removeOverlay();return;}
  if(current.dataset.liarsRevealed==="true"){
   clearTimer();
   void getRoundResult().then(latest=>{
    pendingResult=latest;
    writeMarker(current,"revealed");
    showRevealedLiars(overlay,latest?.actual_liars||[]);
   }).catch(()=>removeOverlay());
   return;
  }
  const remaining=Math.max(0,deadline-performance.now());
  if(remaining<=0){clearTimer();void completeReveal(current,overlay);return;}
  const count=Math.max(1,Math.ceil(remaining/1000));
  if(count!==lastCount){lastCount=count;setCount(overlay,count);}
 };
 tick();
 timer=setInterval(tick,80);
}

function inspect(){
 const card=document.querySelector("[data-result-card]");
 const needsReveal=card
  &&card.dataset.resultWinner==="liar"
  &&card.dataset.captureSucceeded==="false"
  &&card.dataset.liarsRevealed!=="true";
 if(!needsReveal){
  if(activeKey&&!document.querySelector("[data-result-reveal-countdown]")){clearTimer();activeKey="";}
  return;
 }
 const marker=readMarker(card);
 if(marker==="revealed"){
  void getRoundResult().then(latest=>{
   if(latest?.liars_revealed){pendingResult=latest;applyPendingResult();}
   else runSilentReveal(card);
  }).catch(()=>runSilentReveal(card));
  return;
 }
 if(marker==="started"){runSilentReveal(card);return;}
 startCountdown(card);
}

document.addEventListener("click",event=>{
 const button=event.target.closest?.("[data-result-reveal-close]");
 if(!button)return;
 removeOverlay();
 applyPendingResult();
});

observer=new MutationObserver(inspect);
observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});
inspect();
window.addEventListener("pagehide",()=>{observer?.disconnect();clearTimer();},{once:true});
