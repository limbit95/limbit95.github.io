import { getGuessSnapshot } from "./api.js";
import { store } from "./store.js";

let timer=null;
let activeKey="";
let deadline=0;
let refreshing=false;
let observer=null;

function stopTimer(){
 if(timer){clearInterval(timer);timer=null;}
 deadline=0;
}

function clear(){
 stopTimer();
 activeKey="";
}

async function refreshGuessState(){
 if(refreshing)return;
 refreshing=true;
 try{
  const guessState=await getGuessSnapshot();
  if(store.get().snapshot?.round?.status!=="LIAR_GUESS")return;
  store.set({guessState,message:""});
 }catch{}
 finally{refreshing=false;}
}

function start(card){
 const unlockAt=Date.parse(card.dataset.guessUnlockAt||"");
 const serverNow=Date.parse(card.dataset.serverNow||"");
 if(!Number.isFinite(unlockAt)||!Number.isFinite(serverNow))return;
 const key=`${card.dataset.guessUnlockAt}:${card.dataset.serverNow}`;
 if(activeKey===key)return;
 stopTimer();
 activeKey=key;
 deadline=performance.now()+Math.max(0,unlockAt-serverNow);
 const tick=()=>{
  const current=document.querySelector("[data-guess-unlock]");
  if(!current){clear();return;}
  const remaining=Math.max(0,deadline-performance.now());
  const count=current.querySelector("[data-guess-unlock-count]");
  if(count)count.textContent=String(Math.max(0,Math.ceil(remaining/1000)));
  if(remaining<=0){
   if(count)count.textContent="0";
   stopTimer();
   void refreshGuessState();
  }
 };
 tick();
 if(deadline>0)timer=setInterval(tick,100);
}

function inspect(){
 const card=document.querySelector("[data-guess-unlock]");
 if(card)start(card);else clear();
}

store.subscribe(()=>queueMicrotask(inspect));
observer=new MutationObserver(inspect);
observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});
inspect();
window.addEventListener("pagehide",()=>{observer?.disconnect();clear();},{once:true});
