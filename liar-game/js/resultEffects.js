import { getMyRoundRole } from "./api.js";

let lastEffectKey="";
let pendingEffectKey="";
let observer=null;
let audioContext=null;

const reducedMotion=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches===true;
const cardKey=card=>`${card?.dataset.resultId||card?.dataset.resultRound||"0"}:${card?.dataset.resultWinner||""}`;

function getAudioContext(){
 if(!audioContext){
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(AudioContextClass)audioContext=new AudioContextClass();
 }
 return audioContext;
}

function primeAudio(){
 const ctx=getAudioContext();
 if(ctx?.state==="suspended")void ctx.resume().catch(()=>{});
}
window.addEventListener("pointerdown",primeAudio,{capture:true});
window.addEventListener("keydown",primeAudio,{capture:true});

function withAudio(callback){
 const ctx=getAudioContext();
 if(!ctx)return;
 const run=()=>{try{callback(ctx);}catch{}};
 if(ctx.state==="suspended")void ctx.resume().then(run).catch(()=>{});else run();
}

function tone(ctx,{frequency,start,duration,volume=.08,type="triangle",endFrequency=frequency}){
 const oscillator=ctx.createOscillator();
 const gain=ctx.createGain();
 oscillator.type=type;
 oscillator.frequency.setValueAtTime(Math.max(1,frequency),start);
 if(endFrequency!==frequency)oscillator.frequency.exponentialRampToValueAtTime(Math.max(1,endFrequency),start+duration);
 gain.gain.setValueAtTime(.0001,start);
 gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),start+.025);
 gain.gain.setValueAtTime(Math.max(.0002,volume),Math.max(start+.03,start+duration-.12));
 gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
 oscillator.connect(gain).connect(ctx.destination);
 oscillator.start(start);
 oscillator.stop(start+duration+.03);
}

function noiseBurst(ctx,start,duration=.09,volume=.055){
 const sampleRate=ctx.sampleRate;
 const buffer=ctx.createBuffer(1,Math.ceil(sampleRate*duration),sampleRate);
 const data=buffer.getChannelData(0);
 for(let i=0;i<data.length;i+=1)data[i]=(Math.random()*2-1)*(1-i/data.length);
 const source=ctx.createBufferSource();
 const filter=ctx.createBiquadFilter();
 const gain=ctx.createGain();
 filter.type="bandpass";filter.frequency.value=1200+Math.random()*1700;filter.Q.value=.65;
 gain.gain.setValueAtTime(.0001,start);
 gain.gain.linearRampToValueAtTime(volume,start+.012);
 gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
 source.buffer=buffer;source.connect(filter).connect(gain).connect(ctx.destination);
 source.start(start);source.stop(start+duration+.02);
}

function playWinSound(){
 withAudio(ctx=>{
  const now=ctx.currentTime+.04;
  [523.25,659.25,783.99].forEach((frequency,index)=>tone(ctx,{frequency,start:now+index*.16,duration:.32,volume:.075,type:"triangle"}));
  [523.25,659.25,783.99,1046.5].forEach((frequency,index)=>tone(ctx,{frequency,start:now+.52+index*.025,duration:1.15,volume:index===3?.055:.045,type:index===3?"sine":"triangle"}));
  [783.99,987.77,1174.66].forEach((frequency,index)=>tone(ctx,{frequency,start:now+1.28+index*.11,duration:.55,volume:.05,type:"sine"}));
  for(let i=0;i<25;i+=1)noiseBurst(ctx,now+.5+Math.random()*2.15,.055+Math.random()*.08,.025+Math.random()*.035);
 });
}

function booVoice(ctx,start,frequency,delay=0){
 const oscillator=ctx.createOscillator();
 const gain=ctx.createGain();
 const lfo=ctx.createOscillator();
 const lfoGain=ctx.createGain();
 oscillator.type="sine";oscillator.frequency.setValueAtTime(frequency,start+delay);oscillator.frequency.exponentialRampToValueAtTime(frequency*.86,start+delay+2.7);
 lfo.type="sine";lfo.frequency.value=4.2+Math.random()*1.6;lfoGain.gain.value=9+Math.random()*7;
 lfo.connect(lfoGain).connect(oscillator.detune);
 gain.gain.setValueAtTime(.0001,start+delay);
 gain.gain.exponentialRampToValueAtTime(.026,start+delay+.22);
 gain.gain.setValueAtTime(.026,start+delay+1.9);
 gain.gain.exponentialRampToValueAtTime(.0001,start+delay+2.8);
 oscillator.connect(gain).connect(ctx.destination);
 oscillator.start(start+delay);lfo.start(start+delay);
 oscillator.stop(start+delay+2.85);lfo.stop(start+delay+2.85);
}

function playLossSound(){
 withAudio(ctx=>{
  const now=ctx.currentTime+.04;
  [293.66,261.63,220,174.61].forEach((frequency,index)=>tone(ctx,{frequency,start:now+index*.34,duration:.72,volume:.045,type:"sine",endFrequency:frequency*.92}));
  booVoice(ctx,now+.35,128,0);booVoice(ctx,now+.35,146,.08);booVoice(ctx,now+.35,164,.16);booVoice(ctx,now+.35,112,.24);
  for(let i=0;i<9;i+=1)noiseBurst(ctx,now+.6+Math.random()*1.9,.18+Math.random()*.18,.012+Math.random()*.012);
 });
}

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
 const title=card.querySelector("[data-result-title]");
 if(won)playWinSound();else playLossSound();
 if(reducedMotion())return;
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
 if(document.querySelector("[data-result-reveal-countdown]"))return;
 const initialCard=document.querySelector("[data-result-card]");
 if(!initialCard||initialCard.dataset.liarsRevealed!=="true")return;
 const key=cardKey(initialCard);
 if(key===lastEffectKey||key===pendingEffectKey)return;
 pendingEffectKey=key;
 try{
  const role=await getMyRoundRole();
  const currentCard=document.querySelector("[data-result-card]");
  if(document.querySelector("[data-result-reveal-countdown]")||!currentCard||currentCard.dataset.liarsRevealed!=="true"||cardKey(currentCard)!==key)return;
  const mySide=role?.role;
  if(mySide!=="citizen"&&mySide!=="liar")return;
  lastEffectKey=key;
  playOutcome(currentCard,mySide===currentCard.dataset.resultWinner);
 }catch{
  // Spectators and stale sessions do not receive a personal win/loss effect or sound.
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
