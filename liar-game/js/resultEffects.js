import { getMyRoundRole } from "./api.js";

let lastEffectKey="";
let pendingEffectKey="";
let observer=null;

const reducedMotion=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches===true;
const cardKey=card=>`${card?.dataset.resultId||card?.dataset.resultRound||"0"}:${card?.dataset.resultWinner||""}`;

function cleanupFx(){
 document.querySelectorAll(".result-outcome-fx").forEach(node=>node.remove());
 document.querySelectorAll(".motion-result-win,.motion-result-loss").forEach(node=>node.classList.remove("motion-result-win","motion-result-loss"));
 document.querySelectorAll(".motion-result-win-title,.motion-result-loss-title").forEach(node=>node.classList.remove("motion-result-win-title","motion-result-loss-title"));
}

function addFirework(layer,x,y,delay,palette,index){
 const burst=document.createElement("div");
 burst.className="result-firework";
 burst.style.setProperty("--x",`${x}%`);
 burst.style.setProperty("--y",`${y}%`);
 burst.style.setProperty("--delay",`${delay}ms`);
 for(let i=0;i<18;i+=1){
  const ray=document.createElement("i");
  ray.style.setProperty("--angle",`${i*20}deg`);
  ray.style.setProperty("--delay",`${delay}ms`);
  ray.style.setProperty("--piece-color",palette[(index+i)%palette.length]);
  burst.append(ray);
 }
 layer.append(burst);
}

function addConfetti(){
 const layer=document.createElement("div");
 layer.className="result-outcome-fx is-win";
 layer.setAttribute("aria-hidden","true");
 const palette=["#ff6b6b","#ffd43b","#69db7c","#4dabf7","#9775fa","#f783ac","#ffa94d"];
 for(let i=0;i<118;i+=1){
  const piece=document.createElement("i");
  piece.className="result-confetti-piece";
  piece.style.setProperty("--x",`${Math.random()*100}%`);
  piece.style.setProperty("--drift",`${-150+Math.random()*300}px`);
  piece.style.setProperty("--spin",`${540+Math.round(Math.random()*1500)}deg`);
  piece.style.setProperty("--duration",`${2200+Math.random()*2200}ms`);
  piece.style.setProperty("--delay",`${Math.random()*850}ms`);
  piece.style.setProperty("--piece-color",palette[i%palette.length]);
  if(i%4===0){piece.style.width="7px";piece.style.height="7px";piece.style.borderRadius="50%";}
  layer.append(piece);
 }
 [[18,30,0],[48,18,280],[78,32,520],[34,45,760],[68,48,940]].forEach((point,index)=>addFirework(layer,point[0],point[1],point[2],palette,index));
 document.body.append(layer);
 window.setTimeout(()=>layer.remove(),5200);
}

function addDefeatAtmosphere(){
 const layer=document.createElement("div");
 layer.className="result-outcome-fx is-loss";
 layer.setAttribute("aria-hidden","true");
 for(let i=0;i<72;i+=1){
  const drop=document.createElement("i");
  drop.className="result-defeat-drop";
  drop.style.setProperty("--x",`${Math.random()*100}%`);
  drop.style.setProperty("--drift",`${-28+Math.random()*56}px`);
  drop.style.setProperty("--drop-height",`${36+Math.random()*62}px`);
  drop.style.setProperty("--duration",`${820+Math.random()*1250}ms`);
  drop.style.setProperty("--delay",`${Math.random()*1500}ms`);
  layer.append(drop);
 }
 for(let i=0;i<7;i+=1){
  const cloud=document.createElement("i");
  cloud.className="result-gloom-cloud";
  cloud.style.setProperty("--x",`${-15+Math.random()*90}%`);
  cloud.style.setProperty("--y",`${8+Math.random()*58}%`);
  cloud.style.setProperty("--width",`${180+Math.random()*260}px`);
  cloud.style.setProperty("--duration",`${2400+Math.random()*1800}ms`);
  cloud.style.setProperty("--delay",`${Math.random()*900}ms`);
  layer.append(cloud);
 }
 document.body.append(layer);
 window.setTimeout(()=>layer.remove(),5000);
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
  addDefeatAtmosphere();
 }
}

async function inspectResult(){
 const initialCard=document.querySelector("[data-result-card]");
 if(!initialCard)return;
 const key=cardKey(initialCard);
 if(key===lastEffectKey||key===pendingEffectKey)return;
 pendingEffectKey=key;
 try{
  const role=await getMyRoundRole();
  const currentCard=document.querySelector("[data-result-card]");
  if(!currentCard||cardKey(currentCard)!==key)return;
  const mySide=role?.role;
  if(mySide!=="citizen"&&mySide!=="liar")return;
  lastEffectKey=key;
  playOutcome(currentCard,mySide===currentCard.dataset.resultWinner);
 }catch{
  // Spectators and stale sessions do not receive a personal win/loss effect.
 }finally{
  pendingEffectKey="";
 }
}

function start(){
 inspectResult();
 observer=new MutationObserver(()=>inspectResult());
 observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});
 window.addEventListener("pagehide",()=>observer?.disconnect(),{once:true});
}

start();
