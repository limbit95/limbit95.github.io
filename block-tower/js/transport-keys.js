const sceneHost = document.querySelector("#scene");
const selectionStatus = document.querySelector("#selection-status");

const HEIGHT_SPEED_PX_PER_SECOND = 520;
const FINE_HEIGHT_SPEED_PX_PER_SECOND = 150;
const HEIGHT_KEYS = new Set(["KeyE", "KeyQ"]);

let canvas = null;
let activePointer = null;
let heightOffset = 0;
let raisePressed = false;
let lowerPressed = false;
let finePressed = false;
let previousFrame = performance.now();

function isExtractedDrag() {
  return Boolean(activePointer && selectionStatus?.textContent.includes("추출됨"));
}

function resetTransportKeys() {
  activePointer = null;
  heightOffset = 0;
  raisePressed = false;
  lowerPressed = false;
  finePressed = false;
}

function bindCanvas(nextCanvas) {
  if (!nextCanvas || canvas === nextCanvas) return;
  canvas = nextCanvas;

  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" || event.button !== 0) return;
    activePointer = {
      pointerId: event.pointerId,
      pointerType: event.pointerType || "mouse",
      clientX: event.clientX,
      clientY: event.clientY,
    };
    heightOffset = 0;
  }, { capture: true });

  canvas.addEventListener("pointermove", (event) => {
    if (!activePointer || event.pointerId !== activePointer.pointerId || !event.isTrusted) return;
    activePointer.clientX = event.clientX;
    activePointer.clientY = event.clientY;
  }, { capture: true });

  const finishPointer = (event) => {
    if (!activePointer || event.pointerId !== activePointer.pointerId) return;
    resetTransportKeys();
  };

  canvas.addEventListener("pointerup", finishPointer, { capture: true });
  canvas.addEventListener("pointercancel", finishPointer, { capture: true });
}

function findCanvas() {
  const nextCanvas = sceneHost?.querySelector("canvas");
  if (nextCanvas) bindCanvas(nextCanvas);
}

findCanvas();
if (sceneHost && !canvas) {
  const observer = new MutationObserver(() => {
    findCanvas();
    if (canvas) observer.disconnect();
  });
  observer.observe(sceneHost, { childList: true, subtree: true });
}

window.addEventListener("keydown", (event) => {
  if (!activePointer) return;

  if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    finePressed = true;
    return;
  }

  if (!HEIGHT_KEYS.has(event.code) || !isExtractedDrag()) return;
  event.preventDefault();
  if (event.code === "KeyE") raisePressed = true;
  if (event.code === "KeyQ") lowerPressed = true;
});

window.addEventListener("keyup", (event) => {
  if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    finePressed = false;
    return;
  }

  if (event.code === "KeyE") raisePressed = false;
  if (event.code === "KeyQ") lowerPressed = false;
});

window.addEventListener("blur", () => {
  raisePressed = false;
  lowerPressed = false;
  finePressed = false;
});

function dispatchVirtualHeightMove() {
  if (!canvas || !activePointer || !isExtractedDrag()) return;
  const virtualEvent = new PointerEvent("pointermove", {
    bubbles: true,
    cancelable: true,
    pointerId: activePointer.pointerId,
    pointerType: activePointer.pointerType,
    isPrimary: true,
    button: -1,
    buttons: 1,
    clientX: activePointer.clientX,
    clientY: activePointer.clientY + heightOffset,
  });
  canvas.dispatchEvent(virtualEvent);
}

function animateHeightInput(now) {
  const deltaSeconds = Math.min((now - previousFrame) / 1000, 0.05);
  previousFrame = now;

  if (isExtractedDrag() && raisePressed !== lowerPressed) {
    const speed = finePressed
      ? FINE_HEIGHT_SPEED_PX_PER_SECOND
      : HEIGHT_SPEED_PX_PER_SECOND;
    const direction = raisePressed ? -1 : 1;
    heightOffset += direction * speed * deltaSeconds;
    dispatchVirtualHeightMove();
  }

  requestAnimationFrame(animateHeightInput);
}

requestAnimationFrame(animateHeightInput);
