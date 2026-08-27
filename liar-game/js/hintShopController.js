import { ERROR_MESSAGES } from "./constants.js";
import { commands } from "./commands.js";
import { getMyRoundRole } from "./api.js";
import { store } from "./store.js";

const errorCode=(error)=>Object.keys(ERROR_MESSAGES).find(code=>error?.message?.includes(code));
const messageFor=(error)=>{
  const code=errorCode(error);
  if(code==="NOT_LIAR")return "라이어/스파이만 힌트 상점을 이용할 수 있습니다.";
  return ERROR_MESSAGES[code]||error?.message||"힌트를 구매하지 못했습니다.";
};
let purchasing=false;

async function refreshRole(){
  const state=store.get();
  const roundId=state.snapshot?.round?.id;
  if(!roundId)return;
  const role=await getMyRoundRole();
  const latest=store.get();
  if(latest.snapshot?.round?.id!==roundId)return;
  store.set({myRole:role,myRoleRoundId:roundId,message:""});
}

document.addEventListener("click",async(event)=>{
  const button=event.target.closest('[data-action="purchase-hint"]');
  if(!button||purchasing)return;
  const hintType=button.dataset.hintType;
  if(!hintType)return;
  event.preventDefault();
  purchasing=true;
  button.disabled=true;
  const original=button.textContent;
  button.textContent="구매 중…";
  try{
    await commands.purchaseHint(hintType);
    await refreshRole();
  }catch(error){
    store.set({message:messageFor(error)});
    button.disabled=false;
    button.textContent=original;
  }finally{
    purchasing=false;
  }
});

function renderReward(state){
  const result=state?.resultState;
  const card=document.querySelector('[data-result-card]');
  if(!card||!result)return;
  card.querySelector('[data-hint-coin-reward]')?.remove();
  const reward=Math.max(0,Number(result.hint_coin_reward||0));
  if(!reward)return;
  const balance=Math.max(0,Number(result.hint_coin_balance||0));
  const hero=card.querySelector('.result-hero');
  if(!hero)return;
  hero.insertAdjacentHTML('afterend',`<section class="hint-coin-reward" data-hint-coin-reward><span>🪙 라이어 패배 보상</span><strong>+${reward}P</strong><small>현재 힌트 코인 ${balance}P · 같은 게임의 다음 라운드에서 사용할 수 있습니다.</small></section>`);
}

store.subscribe((state)=>queueMicrotask(()=>renderReward(state)));
queueMicrotask(()=>renderReward(store.get()));
