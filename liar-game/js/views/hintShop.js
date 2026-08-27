import { escapeHTML } from "../constants.js";

const iconForHint=id=>({word_length:"🔢",category:"🗂️",first_letter:"🔤"})[String(id||"")]||"💡";

export function hintShopView(role,{compact=false}={}){
  if(role?.role!=="liar")return "";
  const balance=Math.max(0,Number(role?.hint_coins||0));
  const offers=Array.isArray(role?.hint_shop)?role.hint_shop:[];
  const forced=role?.category_forced_hidden===true;
  const starting=Math.max(0,Number(role?.hint_coins_at_start||0));
  const items=offers.map(offer=>{
    const cost=Math.max(0,Number(offer?.cost||0));
    const purchased=offer?.purchased===true;
    const known=offer?.already_known===true;
    const value=offer?.value==null?"":String(offer.value);
    const disabled=purchased||known||balance<cost;
    const buttonLabel=purchased?"구매 완료":known?"이미 공개됨":balance<cost?`${cost}P 필요`:`${cost}P 사용`;
    return `<article class="hint-shop-item${purchased?" is-purchased":""}${known?" is-known":""}">
      <div class="hint-shop-item-content">
       <span class="hint-shop-item-icon" aria-hidden="true">${iconForHint(offer?.id)}</span>
       <div class="hint-shop-item-copy"><strong>${escapeHTML(offer?.label||"")}</strong><small>${escapeHTML(offer?.description||"")}</small></div>
       ${purchased&&value?`<div class="hint-shop-value"><span>힌트</span><strong>${escapeHTML(value)}</strong></div>`:'<div class="hint-shop-value is-placeholder" aria-hidden="true"></div>'}
       <button type="button" class="secondary hint-shop-buy" data-action="purchase-hint" data-hint-type="${escapeHTML(offer?.id||"")}"${disabled?" disabled":""}>${buttonLabel}</button>
      </div>
    </article>`;
  }).join("");
  return `<section class="hint-shop${compact?" is-compact":""}" aria-label="힌트 상점">
    <header class="hint-shop-header"><div><span class="hint-shop-eyebrow">🎭 LIAR SHOP</span><h4>힌트 상점</h4></div><strong class="hint-shop-balance"><span>${balance}P</span><span class="hint-coin-icon" aria-hidden="true">P</span></strong></header>
    ${forced?`<p class="hint-shop-rule">라운드 시작 시 <strong>${starting}P</strong>를 보유해 이번 라운드는 카테고리가 자동으로 비공개되었습니다.</p>`:""}
    <div class="hint-shop-grid">${items||'<p class="muted">구매할 수 있는 힌트가 없습니다.</p>'}</div>
    <small class="hint-shop-footnote"><span>힌트 코인은 이번 게임에서 라이어·스파이로</span><span>패배할 때 1P씩 획득합니다.</span></small>
  </section>`;
}
