import { getMyRoundRole } from "./api.js";

let lastEffectKey="";
let observer=null;

const reducedMotion=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches===true;

function cleanupFx(){
 document.querySelectorAll(".result-outcome-fx").forEach(node=>node.remove());
 document.querySelectorAll(".motion-result-win,.motion-result-loss").forEach(node=>node.classList.remove("motion-result-win","motion-result-loss"));
 document.querySelectorAll(".motion-result-win-title,.motion-result-loss-title").forEach(node=>node.classList.remove("motion-result-win-title","motion-result-loss-title"));
}

function addConfetti(){
 const layer=document.createElement("div");
 layer.className="result-outcome-fx is-win";
 layer.setAttribute("aria-hidden","true");
 const palette=["#ff6b6b","#ffd43b","#69db7c","#4dabf7","#9775fa","#f783ac"];
 for(let i=0;i<58;i+=1){
  const piece=document.createElement("i");
  piece.className="result-confetti-piece";
  piece.style.setProperty("--x",`${Math.random()*100}%`);
  piece.style.setProperty("--drift",`${-80+Math.random()*160}px`);
  piece.style.setProperty("--spin",`${360+Math.round(Math.random()*900)}deg`);
  piece.style.setProperty("--duration",`${1800+Math.random()*1500}ms`);
  piece.style.setProperty("--delay",`${Math.random()*550}ms`);
  piece.style.setProperty("--piece-color",palette[i%palette.length]);
  layer.append(piece);
 }
 document.body.append(layer);
 window.setTimeout(()=>layer.remove(),3900);
}

function addDefeatRain(){
 const layer=document.createElement("div");
 layer.className="result-outcome-fx is-loss";
 layer.setAttribute("aria-hidden","true");
 for(let i=0;i<34;i+=1){
  const drop=document.createElement("i");
  drop.className="result-defeat-drop";
  drop.style.setProperty("--x",`${Math.random()*100}%`);
  drop.style.setProperty("--drift",`${-16+Math.random()*32}px`);
  drop.style.setProperty("--drop-height",`${28+Math.random()*38}px`);
  drop.style.setProperty("--duration",`${900+Math.random()*1100}ms`);
  drop.style.setProperty("--delay",`${Math.random()*900}ms`);
  layer.append(drop);
 }
 document.body.append(layer);
 window.setTimeout(()=>layer.remove(),3200);
}

function playOutcome(card,won){
 cleanupFx();
 if(reducedMotion())return;
 const title=card.querySelector("[data-result-title]");
 if(won){
  card.classList.add("motion-result-win");
  title?.classList.add("motion-result-win-title");
  addConfetti();
 }else{
  card.classList.add("motion-result-loss");
  title?.classList.add("motion-result-loss-title");
  addDefeatRain();
 }
}

async function inspectResult(){
 const card=document.querySelector("[data-result-card]");
 if(!card)return;
 const round=card.dataset.resultRound||"0";
 const winner=card.dataset.resultWinner;
 const key=`${round}:${winner}`;
 if(key===lastEffectKey)return;
 lastEffectKey=key;
 try{
  const role=await getMyRoundRole();
  if(!card.isConnected||`${card.dataset.resultRound||"0"}:${card.dataset.resultWinner}`!==key)return;
  const mySide=role?.role;
  if(mySide!=="citizen"&&mySide!=="liar")return;
  playOutcome(card,mySide===winner);
 }catch{
  // Spectators and stale sessions do not receive a personal win/loss effect.
 }
}

function start(){
 inspectResult();
 observer=new MutationObserver(()=>inspectResult());
 observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});
 window.addEventListener("pagehide",()=>observer?.disconnect(),{once:true});
}

start();
