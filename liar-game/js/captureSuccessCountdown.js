import { getGuessSnapshot, getRoomSnapshot, getVoteSnapshot } from "./api.js";
import { commands } from "./commands.js";
import { store } from "./store.js";

const MARKER_PREFIX="liar_capture_success_reveal";
let activeRoundId="";
let overlay=null;
let timer=null;
let revealCloseTimer=null;
let deadline=0;
let revealRequested=false;
let revealed=false;
let capturedNames=[];
let observer=null;

const markerKey=roundId=>`${MARKER_PREFIX}:${store.get().session?.user?.id||"anon"}:${roundId}`;
const roleName=()=>overlay?.dataset.hiddenRoleName||"라이어";
const clearTimer=()=>{if(timer){clearInterval(timer);timer=null;}};
const clearRevealCloseTimer=()=>{if(revealCloseTimer){clearTimeout(revealCloseTimer);revealCloseTimer=null;}};

function writeMarker(roundId,value){try{localStorage.setItem(markerKey(roundId),value);}catch{}}
function readMarker(roundId){try{return localStorage.getItem(markerKey(roundId))||"";}catch{return "";}}

function currentNames(){
 const suspects=Array.isArray(store.get().voteState?.final_suspects)?store.get().voteState.final_suspects:[];
 return suspects.map(item=>String(item?.nickname||"")).filter(Boolean);
}

function removeOverlay(){
 clearTimer();clearRevealCloseTimer();
 overlay?.remove();
 overlay=null;
 activeRoundId="";
 revealRequested=false;
 revealed=false;
 capturedNames=[];
}

function makeOverlay(card){
 const hiddenRoleName=card.dataset.hiddenRoleName||"라이어";
 const node=document.createElement("div");
 node.className="capture-success-countdown";
 node.dataset.captureSuccessCountdown="";
 node.dataset.hiddenRoleName=hiddenRoleName;
 node.setAttribute("role","dialog");
 node.setAttribute("aria-modal","true");
 node.setAttribute("aria-live","assertive");
 node.innerHTML=`<div class="capture-success-countdown-inner">
  <span class="capture-success-kicker">CAPTURE SUCCESS</span>
  <h2>🎉 ${hiddenRoleName} 검거 성공!</h2>
  <p>정확히 찾아냈습니다. 잠시 후 ${hiddenRoleName}가 공개됩니다.</p>
  <strong class="capture-success-count" data-capture-success-count>5</strong>
  <div class="capture-success-ring" aria-hidden="true"></div>
 </div>`;
 document.body.append(node);
 return node;
}

function setCount(value){
 const count=overlay?.querySelector("[data-capture-success-count]");
 if(!count||count.textContent===String(value))return;
 count.textContent=String(value);
 count.classList.remove("is-ticking");
 void count.offsetWidth;
 count.classList.add("is-ticking");
}

function showRevealed(){
 if(!overlay||revealed)return;
 revealed=true;
 clearTimer();clearRevealCloseTimer();
 writeMarker(activeRoundId,"revealed");
 const inner=overlay.querySelector(".capture-success-countdown-inner");
 if(!inner)return;
 const hiddenRoleName=roleName();
 inner.classList.add("is-revealed");
 inner.replaceChildren();
 const kicker=document.createElement("span");kicker.className="capture-success-kicker";kicker.textContent="CAPTURE COMPLETE";
 const title=document.createElement("h2");title.textContent=`🎉 ${hiddenRoleName} 검거 성공!`;
 const names=document.createElement("div");names.className="capture-success-names";
 const list=capturedNames.length?capturedNames:[`${hiddenRoleName} 공개 완료`];
 list.forEach(name=>{const chip=document.createElement("strong");chip.className="capture-success-name";chip.textContent=name;names.append(chip);});
 const copy=document.createElement("p");copy.className="capture-success-copy";
 const first=document.createElement("span");first.className="capture-success-copy-line";first.textContent=`시민이 ${hiddenRoleName}를 정확히 찾아냈습니다.`;
 const second=document.createElement("span");second.className="capture-success-copy-line";second.textContent="이제 제시어 추측 단계로 넘어갑니다.";
 copy.append(first,second);
 const button=document.createElement("button");button.type="button";button.className="capture-success-close";button.dataset.captureSuccessClose="";button.textContent="바로 추측 화면 보기";
 const auto=document.createElement("small");auto.className="capture-success-auto-note";auto.textContent="잠시 후 모든 참가자가 자동으로 이동합니다.";
 inner.append(kicker,title,names,copy,button,auto);
 requestAnimationFrame(()=>button.focus({preventScroll:true}));
 revealCloseTimer=setTimeout(removeOverlay,4000);
}

async function syncNextStage(){
 const snapshot=await getRoomSnapshot();
 if(snapshot?.round?.status!=="LIAR_GUESS")return false;
 const [voteState,guessState]=await Promise.all([getVoteSnapshot(),getGuessSnapshot()]);
 store.set({snapshot,voteState,guessState,message:"",myBallot:[]});
 return true;
}

async function requestReveal(card){
 if(revealRequested||revealed)return;
 revealRequested=true;
 clearTimer();
 const isHost=card.dataset.isHost==="true";
 if(!isHost){
  const count=overlay?.querySelector("[data-capture-success-count]");
  if(count)count.textContent="✓";
  return;
 }
 try{
  const version=Number(card.dataset.roundVersion||store.get().snapshot?.round?.version);
  await commands.revealLiars(version);
  await syncNextStage();
  if(store.get().snapshot?.round?.status==="LIAR_GUESS")showRevealed();
 }catch(error){
  const message=String(error?.message||"");
  if(message.includes("STALE_VERSION")||message.includes("INVALID_ROUND_STATE")||message.includes("요청을 처리 중")){
   try{await syncNextStage();}catch{}
   if(store.get().snapshot?.round?.status==="LIAR_GUESS")showRevealed();
   return;
  }
  removeOverlay();
  store.set({message:"라이어 공개를 진행하지 못했습니다. 다시 시도해 주세요."});
 }
}

function start(card){
 const roundId=String(card.dataset.roundId||"");
 if(!roundId||activeRoundId===roundId)return;
 removeOverlay();
 activeRoundId=roundId;
 capturedNames=currentNames();
 overlay=makeOverlay(card);
 const marker=readMarker(roundId);
 if(marker==="revealed"&&store.get().snapshot?.round?.status==="LIAR_GUESS"){showRevealed();return;}
 writeMarker(roundId,"started");
 deadline=performance.now()+5000;
 let previous=null;
 const tick=()=>{
  if(!overlay||revealed)return;
  if(store.get().snapshot?.round?.status==="LIAR_GUESS"){showRevealed();return;}
  const remaining=Math.max(0,deadline-performance.now());
  if(remaining<=0){void requestReveal(card);return;}
  const count=Math.max(1,Math.ceil(remaining/1000));
  if(count!==previous){previous=count;setCount(count);}
 };
 tick();
 timer=setInterval(tick,80);
}

function inspect(){
 if(activeRoundId)return;
 const card=document.querySelector("[data-capture-success-card]");
 if(card)start(card);
}

store.subscribe(state=>{
 if(activeRoundId&&!revealed&&state.snapshot?.round?.status==="LIAR_GUESS")showRevealed();
 queueMicrotask(inspect);
});

document.addEventListener("click",event=>{
 const button=event.target.closest?.("[data-capture-success-close]");
 if(!button)return;
 removeOverlay();
});

observer=new MutationObserver(inspect);
observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});
inspect();
window.addEventListener("pagehide",()=>{observer?.disconnect();clearTimer();clearRevealCloseTimer();},{once:true});
