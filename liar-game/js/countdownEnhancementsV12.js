let audioContext=null;
const lastCounts=new WeakMap();
const finalPlayed=new WeakSet();

function context(){
 const AudioContext=window.AudioContext||window.webkitAudioContext;
 if(!AudioContext)return null;
 if(!audioContext)audioContext=new AudioContext();
 return audioContext;
}

async function tone(frequency,duration=0.055,volume=0.035,type="square",delay=0){
 const ctx=context();
 if(!ctx)return;
 try{if(ctx.state==="suspended")await ctx.resume();}catch{return;}
 const start=ctx.currentTime+delay;
 const oscillator=ctx.createOscillator();
 const gain=ctx.createGain();
 oscillator.type=type;
 oscillator.frequency.setValueAtTime(frequency,start);
 gain.gain.setValueAtTime(0.0001,start);
 gain.gain.exponentialRampToValueAtTime(volume,start+0.006);
 gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);
 oscillator.connect(gain);gain.connect(ctx.destination);
 oscillator.start(start);oscillator.stop(start+duration+0.01);
}

function tickTone(){void tone(930,0.045,0.028,"square");}
function revealTone(success){
 if(success){void tone(660,0.09,0.035,"sine");void tone(880,0.12,0.032,"sine",0.1);}
 else{void tone(520,0.09,0.03,"triangle");void tone(390,0.13,0.028,"triangle",0.09);}
}

function polishSuccessCopy(){
 document.querySelectorAll('.capture-success-countdown-inner.is-revealed p:not([data-copy-polished])').forEach(copy=>{
  copy.dataset.copyPolished="true";
  const text=copy.textContent||"";
  const split=text.indexOf(". ");
  if(split<0)return;
  const first=text.slice(0,split+1);
  const second=text.slice(split+2);
  copy.replaceChildren();
  [first,second].forEach(line=>{const span=document.createElement("span");span.className="capture-success-copy-line";span.textContent=line;copy.append(span);});
 });
}

function scan(){
 document.querySelectorAll('.result-reveal-count,.capture-success-count').forEach(node=>{
  const value=String(node.textContent||"").trim();
  const previous=lastCounts.get(node);
  if(/^\d+$/.test(value)&&value!==previous){lastCounts.set(node,value);tickTone();}
 });
 document.querySelectorAll('.result-reveal-countdown-inner.is-revealed,.capture-success-countdown-inner.is-revealed').forEach(node=>{
  if(finalPlayed.has(node))return;
  finalPlayed.add(node);
  revealTone(node.classList.contains('capture-success-countdown-inner'));
 });
 polishSuccessCopy();
}

document.addEventListener("pointerdown",()=>{const ctx=context();if(ctx?.state==="suspended")void ctx.resume().catch(()=>{});},{capture:true,once:false});
document.addEventListener("keydown",()=>{const ctx=context();if(ctx?.state==="suspended")void ctx.resume().catch(()=>{});},{capture:true,once:false});
const observer=new MutationObserver(()=>queueMicrotask(scan));
observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:["class"]});
scan();
window.addEventListener("pagehide",()=>{observer.disconnect();audioContext?.close?.().catch?.(()=>{});},{once:true});
