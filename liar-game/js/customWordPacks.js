import { getMyWordPack, getMyWordPacks } from "./api.js";
import { commands } from "./commands.js";
import { ERROR_MESSAGES, escapeHTML } from "./constants.js";
import { getSetupDraft, patchSetupDraft } from "./setupDraft.js";
import { store } from "./store.js";

let packs=[];
let packsPromise=null;
let slotKey="";
let editorPackId=null;
let editorBusy=false;

const errorCode=error=>Object.keys(ERROR_MESSAGES).find(code=>String(error?.message||"").includes(code));
const messageFor=error=>ERROR_MESSAGES[errorCode(error)]||String(error?.message||"커스텀 제시어 팩을 처리하지 못했습니다.");
const currentSlot=()=>document.querySelector("[data-custom-word-pack-slot]");
const currentGameId=()=>store.get().snapshot?.game?.id||"";

function selectedPack(){return packs.find(pack=>pack.selected_in_current_game===true)||null;}
function sourceLabel(mode){return mode==="custom"?"내 팩만":mode==="mixed"?"기본 + 내 팩":"기본 제시어";}
function selectedOption(pack,selectedId){return `<option value="${escapeHTML(pack.id)}" ${String(pack.id)===String(selectedId||"")?"selected":""}>${escapeHTML(pack.name)} · ${Number(pack.word_count)}개</option>`;}

function renderHostSlot(slot){
 const snapshot=store.get().snapshot;
 const draft=getSetupDraft(snapshot)||{};
 const mode=["builtin","custom","mixed"].includes(slot.dataset.wordSourceMode)?slot.dataset.wordSourceMode:"builtin";
 const selected=selectedPack();
 const requestedId=slot.dataset.customPackId||draft.customWordPackId||"";
 const requested=packs.find(pack=>String(pack.id)===String(requestedId));
 const fallback=selected||packs[0]||null;
 const selectedId=(requested||fallback)?.id||"";
 const hasPacks=packs.length>0;
 slot.dataset.selectedPackId=String(selectedId||"");
 slot.dataset.customPackId=String(selectedId||"");
 if(selectedId)patchSetupDraft(snapshot,{customWordPackId:String(selectedId)});
 slot.innerHTML=`
  <div class="setup-section-heading"><h3 class="setup-section-title">🧩 제시어 소스</h3><p class="setup-section-description">기본 제시어와 내가 저장한 커스텀 팩을 선택합니다. 팩의 실제 단어 목록은 다른 참가자에게 공개되지 않습니다.</p></div>
  <div class="custom-word-source-grid" role="radiogroup" aria-label="제시어 소스">
   <label class="custom-word-source-option ${mode==="builtin"?"is-selected":""}"><input type="radio" name="wordSourceMode" value="builtin" ${mode==="builtin"?"checked":""}><span><strong>📚 기본 제시어</strong><small>현재 12개 카테고리의 기본 풀을 사용합니다.</small></span></label>
   <label class="custom-word-source-option ${mode==="custom"?"is-selected":""}"><input type="radio" name="wordSourceMode" value="custom" ${mode==="custom"?"checked":""} ${hasPacks?"":"disabled"}><span><strong>🧩 내 팩만</strong><small>${hasPacks?"선택한 커스텀 팩에서만 출제합니다.":"먼저 커스텀 팩을 만들어 주세요."}</small></span></label>
   <label class="custom-word-source-option ${mode==="mixed"?"is-selected":""}"><input type="radio" name="wordSourceMode" value="mixed" ${mode==="mixed"?"checked":""} ${hasPacks?"":"disabled"}><span><strong>🔀 기본 + 내 팩</strong><small>${hasPacks?"두 풀이 남아 있으면 대략 반반으로 출제합니다.":"먼저 커스텀 팩을 만들어 주세요."}</small></span></label>
  </div>
  <div class="custom-pack-picker ${mode==="builtin"?"is-inactive":""}" data-custom-pack-picker>
   <label class="setup-control"><span>사용할 커스텀 팩</span><select name="customWordPackId" ${mode==="builtin"?"disabled":""}>${hasPacks?packs.map(pack=>selectedOption(pack,selectedId)).join(""):'<option value="">저장된 팩 없음</option>'}</select><small>${selectedId?`현재 선택: ${escapeHTML((requested||fallback)?.name||"커스텀 팩")} · ${Number((requested||fallback)?.word_count||0)}개 · 게임 시작 시 적용됩니다.`:hasPacks?"팩을 선택하면 게임 시작 시 적용됩니다.":"새 팩은 5~200개의 제시어로 만들 수 있습니다."}</small></label>
   <div class="custom-pack-actions"><button type="button" class="secondary" data-custom-pack-new>+ 새 팩</button><button type="button" class="secondary" data-custom-pack-edit ${selectedId?"":"disabled"}>편집</button><button type="button" class="danger-secondary" data-custom-pack-delete ${selectedId?"":"disabled"}>삭제</button></div>
  </div>
  <p class="custom-pack-note">💡 게임 설정 선택값은 서버에 바로 저장되지 않으며, <strong>게임 시작</strong>을 누를 때 현재 선택한 내용이 한 번에 적용됩니다.</p>`;
 updateSourceUI(slot);
}

function renderGuestSlot(slot){
 const mode=["builtin","custom","mixed"].includes(slot.dataset.wordSourceMode)?slot.dataset.wordSourceMode:"builtin";
 const name=slot.dataset.customPackName||"커스텀 팩";
 const count=Number(slot.dataset.customWordCount||0);
 slot.innerHTML=`<div class="setup-section-heading"><h3 class="setup-section-title">🧩 제시어 소스</h3><p class="setup-section-description">방장이 선택한 이번 Game의 제시어 소스입니다.</p></div><div class="custom-pack-guest-summary"><strong>${escapeHTML(sourceLabel(mode))}</strong><span>${mode==="builtin"?"기본 제시어 풀 사용":`${escapeHTML(name)} · ${count}개${mode==="mixed"?" + 기본 제시어":""}`}</span></div><p class="muted">커스텀 팩의 실제 제시어 목록은 게임 중에도 소유자 외에는 조회할 수 없습니다.</p>`;
}

function updateSourceUI(slot=currentSlot()){
 if(!slot||slot.dataset.host!=="true")return;
 const checked=slot.querySelector('input[name="wordSourceMode"]:checked');
 const mode=checked?.value||"builtin";
 slot.dataset.wordSourceMode=mode;
 slot.querySelectorAll(".custom-word-source-option").forEach(option=>option.classList.toggle("is-selected",option.querySelector("input")?.checked===true));
 const picker=slot.querySelector("[data-custom-pack-picker]");
 picker?.classList.toggle("is-inactive",mode==="builtin");
 const select=slot.querySelector('select[name="customWordPackId"]');
 if(select)select.disabled=mode==="builtin";
 const patch={wordSourceMode:mode};
 if(mode!=="builtin"&&select?.value)patch.customWordPackId=String(select.value);
 patchSetupDraft(store.get().snapshot,patch);
}

async function loadPacks({force=false}={}){
 if(!force&&packsPromise)return packsPromise;
 packsPromise=(async()=>{
  const next=await getMyWordPacks();
  packs=Array.isArray(next)?next:[];
  return packs;
 })();
 try{return await packsPromise;}finally{packsPromise=null;}
}

async function hydrateSlot(){
 const slot=currentSlot();
 if(!slot)return;
 const key=`${currentGameId()}:${slot.dataset.host}:${slot.dataset.wordSourceMode}:${slot.dataset.customPackId||""}:${slot.dataset.customPackName}:${slot.dataset.customWordCount}`;
 if(slotKey===key&&slot.dataset.hydrated==="true")return;
 slotKey=key;
 if(slot.dataset.host!=="true"){
  renderGuestSlot(slot);slot.dataset.hydrated="true";return;
 }
 try{
  await loadPacks();
  if(slot!==currentSlot())return;
  renderHostSlot(slot);slot.dataset.hydrated="true";
 }catch(error){
  if(slot===currentSlot())slot.innerHTML=`<div class="setup-section-heading"><h3 class="setup-section-title">🧩 제시어 소스</h3></div><p class="error">${escapeHTML(messageFor(error))}</p><button type="button" class="secondary" data-custom-pack-retry>다시 불러오기</button>`;
 }
}

function ensureDialog(){
 let dialog=document.querySelector("[data-custom-pack-dialog]");
 if(dialog)return dialog;
 dialog=document.createElement("dialog");
 dialog.className="custom-pack-dialog";
 dialog.dataset.customPackDialog="";
 dialog.innerHTML=`<form class="custom-pack-editor" data-custom-pack-editor>
  <header><div><span class="custom-pack-eyebrow">MY WORD PACK</span><h2 data-custom-pack-editor-title>커스텀 제시어 팩 만들기</h2></div><button type="button" class="custom-pack-close" data-custom-pack-close aria-label="닫기">×</button></header>
  <label class="setup-control"><span>팩 이름</span><input name="packName" maxlength="40" autocomplete="off" placeholder="예: 우리 크루 추억" required><small>1~40자 · 계정에 저장되어 다른 방에서도 다시 사용할 수 있습니다.</small></label>
  <label class="setup-control"><span>제시어</span><textarea name="packWords" rows="12" placeholder="한 줄에 하나씩 입력하세요.&#10;수련회&#10;단기선교&#10;공동체예배&#10;..." required></textarea><small><span data-custom-pack-word-count>0개</span> · 최소 5개 / 최대 200개 · 공백/대소문자만 다른 중복도 사용할 수 없습니다.</small></label>
  <p class="custom-pack-editor-message" data-custom-pack-editor-message aria-live="polite"></p>
  <footer><button type="button" class="secondary" data-custom-pack-close>취소</button><button type="submit" data-custom-pack-save>저장</button></footer>
 </form>`;
 document.body.append(dialog);
 return dialog;
}

function closeEditor(){
 const dialog=ensureDialog();
 if(editorBusy)return;
 if(typeof dialog.close==="function"&&dialog.open)dialog.close();else dialog.removeAttribute("open");
 editorPackId=null;
}

function editorWords(){
 const textarea=ensureDialog().querySelector('textarea[name="packWords"]');
 return String(textarea?.value||"").split(/\r?\n/u).map(word=>word.trim()).filter(Boolean);
}

function updateEditorCount(){
 const count=editorWords().length;
 const label=ensureDialog().querySelector("[data-custom-pack-word-count]");
 if(label){label.textContent=`${count}개`;label.classList.toggle("is-invalid",count<5||count>200);}
}

async function openEditor(packId=null){
 const dialog=ensureDialog();
 editorPackId=packId||null;
 editorBusy=false;
 const title=dialog.querySelector("[data-custom-pack-editor-title]");
 const nameInput=dialog.querySelector('input[name="packName"]');
 const wordsInput=dialog.querySelector('textarea[name="packWords"]');
 const message=dialog.querySelector("[data-custom-pack-editor-message]");
 if(message)message.textContent="";
 if(title)title.textContent=packId?"커스텀 제시어 팩 편집":"커스텀 제시어 팩 만들기";
 if(nameInput)nameInput.value="";
 if(wordsInput)wordsInput.value="";
 if(typeof dialog.showModal==="function"&&!dialog.open)dialog.showModal();else dialog.setAttribute("open","");
 if(packId){
  if(message)message.textContent="팩 내용을 불러오는 중…";
  try{
   const pack=await getMyWordPack(packId);
   if(editorPackId!==packId)return;
   if(nameInput)nameInput.value=pack?.name||"";
   if(wordsInput)wordsInput.value=Array.isArray(pack?.words)?pack.words.join("\n"):"";
   if(message)message.textContent="";
  }catch(error){if(message)message.textContent=messageFor(error);}
 }
 updateEditorCount();
 nameInput?.focus();
}

async function saveEditor(form){
 if(editorBusy)return;
 const name=String(form.elements.packName?.value||"").trim();
 const words=editorWords();
 const message=form.querySelector("[data-custom-pack-editor-message]");
 if(!name||name.length>40){if(message)message.textContent=ERROR_MESSAGES.INVALID_CUSTOM_WORD_PACK_NAME;return;}
 if(words.length<5||words.length>200){if(message)message.textContent=ERROR_MESSAGES.INVALID_CUSTOM_WORD_PACK;return;}
 editorBusy=true;
 const save=form.querySelector("[data-custom-pack-save]");if(save)save.disabled=true;
 if(message)message.textContent="저장하고 있습니다…";
 try{
  const result=await commands.saveWordPack(editorPackId,name,words);
  const row=Array.isArray(result)?result[0]:result;
  const savedId=row?.pack_id||editorPackId;
  await loadPacks({force:true});
  const slot=currentSlot();
  if(slot){
   if(savedId){slot.dataset.customPackId=String(savedId);patchSetupDraft(store.get().snapshot,{customWordPackId:String(savedId)});}
   renderHostSlot(slot);slot.dataset.hydrated="true";
   updateSourceUI(slot);
  }
  if(typeof ensureDialog().close==="function")ensureDialog().close();else ensureDialog().removeAttribute("open");
  editorPackId=null;
  store.set({message:"커스텀 제시어 팩을 저장했습니다. 게임 시작 시 현재 선택에 반영됩니다."});
 }catch(error){if(message)message.textContent=messageFor(error);}
 finally{editorBusy=false;if(save)save.disabled=false;}
}

async function deleteSelected(){
 const slot=currentSlot();const select=slot?.querySelector('select[name="customWordPackId"]');const packId=select?.value||slot?.dataset.selectedPackId;
 if(!packId)return;
 const pack=packs.find(item=>String(item.id)===String(packId));
 if(!confirm(`“${pack?.name||"이 팩"}”을 삭제하시겠습니까?\n\n현재 Game에서 사용 중이면 삭제할 수 없습니다.`))return;
 try{
  await commands.deleteWordPack(packId);
  await loadPacks({force:true});
  const snapshot=store.get().snapshot;
  const nextPack=packs[0]||null;
  if(nextPack)patchSetupDraft(snapshot,{customWordPackId:String(nextPack.id)});
  else patchSetupDraft(snapshot,{customWordPackId:null,wordSourceMode:"builtin"});
  if(slot===currentSlot()){
   slot.dataset.customPackId=nextPack?String(nextPack.id):"";
   if(!nextPack)slot.dataset.wordSourceMode="builtin";
   renderHostSlot(slot);slot.dataset.hydrated="true";
  }
  store.set({message:"커스텀 제시어 팩을 삭제했습니다."});
 }catch(error){store.set({message:messageFor(error)});}
}

const observer=new MutationObserver(()=>{void hydrateSlot();});
observer.observe(document.querySelector("#app")||document.body,{childList:true,subtree:true});

document.addEventListener("change",event=>{
 const slot=event.target.closest?.("[data-custom-word-pack-slot]");
 if(!slot)return;
 if(event.target.name==="wordSourceMode")updateSourceUI(slot);
 if(event.target.name==="customWordPackId"){
  slot.dataset.selectedPackId=event.target.value;
  slot.dataset.customPackId=event.target.value;
  patchSetupDraft(store.get().snapshot,{customWordPackId:String(event.target.value||"")||null});
 }
});

document.addEventListener("click",event=>{
 if(event.target.closest("[data-custom-pack-retry]")){packs=[];slotKey="";void loadPacks({force:true}).then(()=>hydrateSlot()).catch(()=>hydrateSlot());return;}
 if(event.target.closest("[data-custom-pack-new]")){void openEditor();return;}
 if(event.target.closest("[data-custom-pack-edit]")){const slot=currentSlot();const id=slot?.querySelector('select[name="customWordPackId"]')?.value||slot?.dataset.selectedPackId;if(id)void openEditor(id);return;}
 if(event.target.closest("[data-custom-pack-delete]")){void deleteSelected();return;}
 if(event.target.closest("[data-custom-pack-close]")){closeEditor();return;}
});

document.addEventListener("input",event=>{if(event.target.matches?.('[data-custom-pack-editor] textarea[name="packWords"]'))updateEditorCount();});
document.addEventListener("submit",event=>{const form=event.target.closest?.("[data-custom-pack-editor]");if(!form)return;event.preventDefault();void saveEditor(form);});

ensureDialog().addEventListener("cancel",event=>{if(editorBusy){event.preventDefault();return;}editorPackId=null;});
void hydrateSlot();
window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});