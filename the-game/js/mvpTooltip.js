import { getMvpDefinition } from "./gameStats.js";

const TOOLTIP_ID = "the-game-mvp-tooltip";
const INFO_TRIGGER_SELECTOR = ".round-mvp-label > [title], .round-mvp-label > [data-mvp-tooltip]";
const SYMBOL_TRIGGER_SELECTOR = ".round-mvp-icon";
const TRIGGER_SELECTOR = `${INFO_TRIGGER_SELECTOR}, ${SYMBOL_TRIGGER_SELECTOR}`;

let tooltip = null;
let activeTrigger = null;
let pinned = false;

function installTooltipStyle() {
  if (document.querySelector("style[data-the-game-mvp-tooltip]")) return;

  const style = document.createElement("style");
  style.dataset.theGameMvpTooltip = "true";
  style.textContent = `
    .round-mvp-label > [title]::before,
    .round-mvp-label > [title]::after,
    .round-mvp-label > [data-mvp-tooltip]::before,
    .round-mvp-label > [data-mvp-tooltip]::after {
      display: none !important;
      content: none !important;
    }

    #${TOOLTIP_ID} {
      position: fixed;
      z-index: 10000;
      width: max-content;
      max-width: min(260px, calc(100vw - 24px));
      padding: 10px 12px;
      border: 1px solid #4a4a44;
      border-radius: 11px;
      background: rgba(24, 24, 21, 0.98);
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.52);
      color: #efefe8;
      font-size: 11px;
      font-weight: 750;
      letter-spacing: -0.01em;
      line-height: 1.5;
      text-align: left;
      white-space: normal;
      pointer-events: none;
      opacity: 1;
      transform: translateZ(0);
    }

    #${TOOLTIP_ID}[hidden] {
      display: none !important;
    }

    #${TOOLTIP_ID}::after {
      content: "";
      position: absolute;
      left: var(--tooltip-arrow-left, 50%);
      width: 8px;
      height: 8px;
      background: #181815;
      transform: translateX(-50%) rotate(45deg);
    }

    #${TOOLTIP_ID}[data-placement="top"]::after {
      bottom: -5px;
      border-right: 1px solid #4a4a44;
      border-bottom: 1px solid #4a4a44;
    }

    #${TOOLTIP_ID}[data-placement="bottom"]::after {
      top: -5px;
      border-left: 1px solid #4a4a44;
      border-top: 1px solid #4a4a44;
    }
  `;
  document.head.append(style);
}

function ensureTooltip() {
  if (tooltip?.isConnected) return tooltip;

  tooltip = document.createElement("div");
  tooltip.id = TOOLTIP_ID;
  tooltip.setAttribute("role", "tooltip");
  tooltip.hidden = true;
  document.body.append(tooltip);
  return tooltip;
}

function isMvpTrigger(element) {
  if (!(element instanceof Element)) return false;
  const trigger = element.closest(TRIGGER_SELECTOR);
  if (!trigger) return false;
  return Boolean(trigger.closest("[data-mvp-code]"));
}

function getTrigger(element) {
  if (!(element instanceof Element)) return null;
  const trigger = element.closest(TRIGGER_SELECTOR);
  return trigger?.closest("[data-mvp-code]") ? trigger : null;
}

function getDescription(trigger) {
  if (!trigger) return "";

  if (trigger.matches(SYMBOL_TRIGGER_SELECTOR)) {
    const code = trigger.closest("[data-mvp-code]")?.dataset.mvpCode;
    return getMvpDefinition(code)?.description ?? "";
  }

  const title = trigger.getAttribute("title");
  if (title && !trigger.dataset.mvpTooltip) {
    trigger.dataset.mvpTooltip = title;
  }
  if (title) trigger.removeAttribute("title");
  return trigger.dataset.mvpTooltip ?? "";
}

function setTriggerExpanded(trigger, expanded) {
  if (!trigger || trigger.matches(SYMBOL_TRIGGER_SELECTOR)) return;
  trigger.setAttribute("aria-expanded", String(expanded));
  if (expanded) {
    trigger.setAttribute("aria-describedby", TOOLTIP_ID);
  } else {
    trigger.removeAttribute("aria-describedby");
  }
}

function positionTooltip(trigger) {
  const layer = ensureTooltip();
  if (!trigger?.isConnected || layer.hidden) return;

  const triggerRect = trigger.getBoundingClientRect();
  const tooltipRect = layer.getBoundingClientRect();
  const viewportPadding = 12;
  const gap = 10;

  let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
  left = Math.max(
    viewportPadding,
    Math.min(left, window.innerWidth - tooltipRect.width - viewportPadding),
  );

  let top = triggerRect.top - tooltipRect.height - gap;
  let placement = "top";
  if (top < viewportPadding) {
    top = triggerRect.bottom + gap;
    placement = "bottom";
  }
  if (top + tooltipRect.height > window.innerHeight - viewportPadding) {
    top = Math.max(viewportPadding, window.innerHeight - tooltipRect.height - viewportPadding);
  }

  const triggerCenter = triggerRect.left + (triggerRect.width / 2);
  const arrowLeft = Math.max(10, Math.min(tooltipRect.width - 10, triggerCenter - left));

  layer.dataset.placement = placement;
  layer.style.left = `${Math.round(left)}px`;
  layer.style.top = `${Math.round(top)}px`;
  layer.style.setProperty("--tooltip-arrow-left", `${Math.round(arrowLeft)}px`);
}

function showTooltip(trigger, { pin = false } = {}) {
  const description = getDescription(trigger);
  if (!description) return;

  if (activeTrigger && activeTrigger !== trigger) {
    setTriggerExpanded(activeTrigger, false);
  }

  const layer = ensureTooltip();
  activeTrigger = trigger;
  pinned = pin;
  layer.textContent = description;
  layer.hidden = false;
  setTriggerExpanded(trigger, true);
  positionTooltip(trigger);
}

function hideTooltip({ force = false } = {}) {
  if (pinned && !force) return;

  if (activeTrigger) setTriggerExpanded(activeTrigger, false);
  activeTrigger = null;
  pinned = false;
  if (tooltip) tooltip.hidden = true;
}

function isLeavingTrigger(event, trigger) {
  const next = event.relatedTarget;
  return !(next instanceof Node) || !trigger.contains(next);
}

document.addEventListener("pointerover", (event) => {
  const trigger = getTrigger(event.target);
  if (!trigger) return;
  showTooltip(trigger);
});

document.addEventListener("pointerout", (event) => {
  const trigger = getTrigger(event.target);
  if (!trigger || trigger !== activeTrigger || !isLeavingTrigger(event, trigger)) return;
  hideTooltip();
});

document.addEventListener("focusin", (event) => {
  const trigger = getTrigger(event.target);
  if (!trigger || trigger.matches(SYMBOL_TRIGGER_SELECTOR)) return;
  showTooltip(trigger);
});

document.addEventListener("focusout", (event) => {
  const trigger = getTrigger(event.target);
  if (!trigger || trigger !== activeTrigger || !isLeavingTrigger(event, trigger)) return;
  hideTooltip();
});

document.addEventListener("click", (event) => {
  const trigger = getTrigger(event.target);
  if (!trigger) {
    hideTooltip({ force: true });
    return;
  }

  if (!isMvpTrigger(trigger)) return;
  event.preventDefault();
  event.stopPropagation();

  if (activeTrigger === trigger && pinned) {
    hideTooltip({ force: true });
    return;
  }
  showTooltip(trigger, { pin: true });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideTooltip({ force: true });
});

window.addEventListener("resize", () => {
  if (activeTrigger && !tooltip?.hidden) positionTooltip(activeTrigger);
});

document.addEventListener("scroll", () => {
  if (activeTrigger && !tooltip?.hidden) positionTooltip(activeTrigger);
}, true);

installTooltipStyle();
ensureTooltip();
