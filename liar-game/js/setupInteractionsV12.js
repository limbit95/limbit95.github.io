function setupForm(){return document.querySelector('form[data-action="settings"]');}

function closeInfo(except=null){
 document.querySelectorAll('.setup-info.is-open').forEach(info=>{
  if(info===except)return;
  info.classList.remove('is-open');
  info.setAttribute('aria-expanded','false');
 });
}

function toggleInfo(info){
 const opening=!info.classList.contains('is-open');
 closeInfo(info);
 info.classList.toggle('is-open',opening);
 info.setAttribute('aria-expanded',opening?'true':'false');
}

// The info icon lives inside a label for visual grouping. Prevent pointer/touch
// activation from bubbling to that label, otherwise mobile browsers focus or
// open the associated select/input when the user only wanted the tooltip.
document.addEventListener('pointerdown',event=>{
 const info=event.target.closest?.('.setup-info');
 if(!info)return;
 event.preventDefault();
 event.stopPropagation();
},true);

document.addEventListener('click',event=>{
 const info=event.target.closest?.('.setup-info');
 if(info){
  event.preventDefault();
  event.stopPropagation();
  toggleInfo(info);
  return;
 }
 closeInfo();
},true);

document.addEventListener('keydown',event=>{
 const info=event.target.closest?.('.setup-info');
 if(!info)return;
 if(event.key==='Enter'||event.key===' '){
  event.preventDefault();
  event.stopPropagation();
  toggleInfo(info);
 }else if(event.key==='Escape'){
  closeInfo();
  info.blur();
 }
},true);

document.addEventListener('click',event=>{
 const button=event.target.closest?.('[data-step-input][data-step-dir]');
 if(!button)return;
 event.preventDefault();
 event.stopPropagation();
 if(button.disabled)return;
 const form=button.closest('form[data-action="settings"]')||setupForm();
 const input=form?.elements?.namedItem(button.dataset.stepInput);
 if(!(input instanceof HTMLInputElement)||input.disabled)return;
 const min=Number.isFinite(Number(input.min))?Number(input.min):-Infinity;
 const max=Number.isFinite(Number(input.max))?Number(input.max):Infinity;
 const step=Number(input.step)>0?Number(input.step):1;
 const current=Number(input.value)||0;
 const direction=Number(button.dataset.stepDir)||0;
 const next=Math.min(max,Math.max(min,current+step*direction));
 if(next===current)return;
 input.value=String(next);
 input.dispatchEvent(new Event('input',{bubbles:true}));
 input.dispatchEvent(new Event('change',{bubbles:true}));
},true);

document.addEventListener('change',event=>{
 if(!(event.target instanceof HTMLInputElement)||event.target.name!=='drawingStrokeUnlimited')return;
 queueMicrotask(()=>{
  const form=event.target.closest('form[data-action="settings"]');
  const stepper=form?.querySelector('[data-stepper] input[name="drawingStrokeLimit"]')?.closest('[data-stepper]');
  if(!stepper)return;
  const disabled=event.target.checked;
  stepper.classList.toggle('is-readonly',disabled);
  stepper.querySelectorAll('.setup-stepper-button').forEach(button=>{button.disabled=disabled;});
 });
},true);

window.addEventListener('pagehide',()=>closeInfo(),{once:true});
