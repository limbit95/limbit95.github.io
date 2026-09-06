export const DICE_CHARGE_PROFILE = Object.freeze({
  cycleMs: 1450,
  minStrength: 0.18,
  defaultStrength: 0.55,
});

export function chargeValueAtElapsed(elapsedMs, cycleMs = DICE_CHARGE_PROFILE.cycleMs) {
  const safeCycle = Math.max(1, Number(cycleMs) || DICE_CHARGE_PROFILE.cycleMs);
  const phase = ((Math.max(0, Number(elapsedMs) || 0) % safeCycle) / safeCycle) * Math.PI * 2;
  return (1 - Math.cos(phase)) / 2;
}

export function chargeStrengthAtElapsed(elapsedMs) {
  const wave = chargeValueAtElapsed(elapsedMs);
  return DICE_CHARGE_PROFILE.minStrength + ((1 - DICE_CHARGE_PROFILE.minStrength) * wave);
}

export function createDiceChargeControl({ button, dock, gauge, gaugeFill, gaugeValue, diceStageElement } = {}) {
  if (!button || !dock || !gauge || !gaugeFill || !gaugeValue || !diceStageElement) return null;

  let charging = false;
  let startedAt = 0;
  let frameId = null;
  let strength = DICE_CHARGE_PROFILE.defaultStrength;
  let chargedPointerId = null;

  function isRollReady() {
    return button.dataset.action === "roll" && !button.hidden && !button.disabled;
  }

  function paint(nextStrength) {
    strength = Math.min(1, Math.max(DICE_CHARGE_PROFILE.minStrength, Number(nextStrength) || 0));
    const percent = Math.round(strength * 100);
    gaugeFill.style.width = `${percent}%`;
    gaugeValue.textContent = `${percent}%`;
    gauge.style.setProperty("--dice-charge", `${percent}%`);
  }

  function syncMode() {
    const rollReady = isRollReady();
    dock.dataset.rollReady = String(rollReady);
    gauge.hidden = !rollReady;
    if (!rollReady && charging) cancelCharge();
  }

  function animate(now) {
    if (!charging) return;
    paint(chargeStrengthAtElapsed(now - startedAt));
    frameId = requestAnimationFrame(animate);
  }

  function beginCharge(event) {
    if (!isRollReady() || charging) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    charging = true;
    chargedPointerId = event.pointerId;
    startedAt = performance.now();
    button.dataset.charging = "true";
    gauge.dataset.charging = "true";
    button.setPointerCapture?.(event.pointerId);
    paint(DICE_CHARGE_PROFILE.minStrength);
    frameId = requestAnimationFrame(animate);
  }

  function finishCharge(event) {
    if (!charging || (chargedPointerId !== null && event.pointerId !== chargedPointerId)) return;
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    charging = false;
    button.dataset.charging = "false";
    gauge.dataset.charging = "false";
    diceStageElement.dataset.rollStrength = strength.toFixed(3);
    chargedPointerId = null;
  }

  function cancelCharge() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    charging = false;
    chargedPointerId = null;
    button.dataset.charging = "false";
    gauge.dataset.charging = "false";
    paint(DICE_CHARGE_PROFILE.defaultStrength);
  }

  function ensureKeyboardStrength(event) {
    if (event.detail === 0 && isRollReady()) {
      diceStageElement.dataset.rollStrength = DICE_CHARGE_PROFILE.defaultStrength.toFixed(3);
    }
  }

  button.addEventListener("pointerdown", beginCharge);
  button.addEventListener("pointerup", finishCharge);
  button.addEventListener("pointercancel", cancelCharge);
  button.addEventListener("click", ensureKeyboardStrength);

  const observer = new MutationObserver(syncMode);
  observer.observe(button, { attributes: true, attributeFilter: ["data-action", "disabled", "hidden"] });

  paint(DICE_CHARGE_PROFILE.defaultStrength);
  syncMode();

  return Object.freeze({
    cancel: cancelCharge,
    dispose() {
      cancelCharge();
      observer.disconnect();
      button.removeEventListener("pointerdown", beginCharge);
      button.removeEventListener("pointerup", finishCharge);
      button.removeEventListener("pointercancel", cancelCharge);
      button.removeEventListener("click", ensureKeyboardStrength);
    },
  });
}

const button = document.querySelector("[data-primary-action]");
const dock = document.querySelector("[data-board-action-dock]");
const gauge = document.querySelector("[data-dice-charge]");
const gaugeFill = document.querySelector("[data-dice-charge-fill]");
const gaugeValue = document.querySelector("[data-dice-charge-value]");
const diceStageElement = document.querySelector("[data-dice-stage]");

if (button && dock && gauge && gaugeFill && gaugeValue && diceStageElement) {
  createDiceChargeControl({ button, dock, gauge, gaugeFill, gaugeValue, diceStageElement });
}
