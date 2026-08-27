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

function applyCommittedPurchase(purchase){
  const state=store.get();
  const role=state.myRole;
  if(!role||role.role!=="liar"||!purchase)return;
  const hintType=String(purchase.hint_type||"");
  if(!hintType)return;
  const nextShop=Array.isArray(role.hint_shop)
    ? role.hint_shop.map(offer=>String(offer?.id||"")===hintType
      ? {...offer,purchased:true,value:purchase.value}
      : offer)
    : role.hint_shop;
  store.set({
    myRole:{...role,hint_coins:Math.max(0,Number(purchase.balance||0)),hint_shop:nextShop},
    myRoleRoundId:state.snapshot?.round?.id||state.myRoleRoundId,
    message:"",
  });
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
  let committed=false;
  try{
    const purchase=await commands.purchaseHint(hintType);
    committed=true;
    applyCommittedPurchase(purchase);
    try{
      await refreshRole();
    }catch{
      // The purchase is already committed. Keep the optimistic committed state and
      // never present a transient refresh failure as a failed purchase.
      store.set({message:"힌트 구매는 완료되었습니다. 최신 정보는 다음 상태 동기화 때 자동으로 갱신됩니다."});
    }
  }catch(error){
    if(!committed){
      store.set({message:messageFor(error)});
      button.disabled=false;
      button.textContent=original;
    }
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
  hero.insertAdjacentHTML('afterend',`<section class="hint-coin-reward" data-hint-coin-reward><span><span class="hint-coin-icon" aria-hidden="true">P</span> 라이어 패배 보상</span><strong>+${reward}P</strong><small>현재 힌트 코인 ${balance}P · 같은 게임의 다음 라운드에서 사용할 수 있습니다.</small></section>`);
}

store.subscribe((state)=>queueMicrotask(()=>renderReward(state)));
queueMicrotask(()=>renderReward(store.get()));
