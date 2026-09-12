import {
  createHudMoneyPresenter as createBaseHudMoneyPresenter,
} from "./moneyPresentation.js?v=20260912-r23-impl";

export {
  createMoneyPresentationPlan,
  createMoneyPresentationSequence,
  formatClassicMoneyBalance,
  formatClassicMoneyDelta,
  interpolateMoneyBalance,
  resolveMoneyTransferCoinCount,
  resolveMoneyTransferFlight,
  syncHudMoneyBalances,
} from "./moneyPresentation.js?v=20260912-r23-impl";

function createSparkles(documentObject, host) {
  for (let index = 0; index < 10; index += 1) {
    const sparkle = documentObject.createElement("span");
    sparkle.className = "start-salary-celebration-sparkle";
    sparkle.setAttribute("aria-hidden", "true");
    sparkle.style.setProperty("--start-salary-angle", `${index * 36}deg`);
    sparkle.style.setProperty("--start-salary-delay", `${index * 34}ms`);
    host.append(sparkle);
  }
}

function createStartSalaryCelebrationElement(documentObject, event) {
  const amount = Math.max(0, Number(event?.amount) || 0);
  const count = Math.max(1, Math.round(Number(event?.count) || 1));

  const layer = documentObject.createElement("div");
  layer.className = "start-salary-celebration";
  layer.setAttribute("role", "status");
  layer.setAttribute(
    "aria-label",
    `${count > 1 ? `${count}바퀴` : "한 바퀴"} 완주 START 월급 ${amount.toLocaleString("ko-KR")} 골드 지급`,
  );

  const halo = documentObject.createElement("div");
  halo.className = "start-salary-celebration-halo";
  halo.setAttribute("aria-hidden", "true");
  createSparkles(documentObject, halo);

  const card = documentObject.createElement("div");
  card.className = "start-salary-celebration-card";

  const eyebrow = documentObject.createElement("span");
  eyebrow.className = "start-salary-celebration-eyebrow";
  eyebrow.textContent = count > 1 ? `${count}바퀴 완주!` : "한 바퀴 완주!";

  const title = documentObject.createElement("strong");
  title.className = "start-salary-celebration-title";
  title.textContent = "START 월급 지급";

  const amountElement = documentObject.createElement("b");
  amountElement.className = "start-salary-celebration-amount";
  amountElement.textContent = `+${amount.toLocaleString("ko-KR")} 골드`;

  const caption = documentObject.createElement("span");
  caption.className = "start-salary-celebration-caption";
  caption.textContent = "완주 보상이 지급됩니다";

  card.append(eyebrow, title, amountElement, caption);
  layer.append(halo, card);
  return layer;
}

export function createHudMoneyPresenter(options = {}) {
  const basePresenter = createBaseHudMoneyPresenter(options);
  const documentObject = options.documentObject ?? globalThis.document;
  const reducedMotion = options.reducedMotion
    ?? globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const wait = options.wait
    ?? ((ms) => new Promise((resolve) => globalThis.setTimeout(resolve, ms)));

  async function presentStartSalaryCelebration(event) {
    if (!documentObject?.createElement || !documentObject?.body?.append) return;

    documentObject.querySelectorAll?.(".start-salary-celebration")
      .forEach((element) => element.remove());

    const layer = createStartSalaryCelebrationElement(documentObject, event);
    documentObject.body.append(layer);

    await wait(reducedMotion ? 420 : 1020);
    layer.dataset.state = "exit";
    await wait(reducedMotion ? 80 : 180);
    layer.remove();
  }

  async function play(event) {
    if (event?.type === "START_PASSED") {
      await presentStartSalaryCelebration(event);
    }
    await basePresenter.play(event);
  }

  return Object.freeze({ play });
}
