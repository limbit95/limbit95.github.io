const bellButton = document.querySelector("#mobile-bell-button");
const gameView = document.querySelector("#game-view");

function releasePressedState() {
  bellButton?.classList.remove("is-pressed");
}

function triggerSpaceBell(event) {
  if (!bellButton || !gameView || gameView.hidden) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;

  event.preventDefault();
  bellButton.classList.add("is-pressed");
  window.setTimeout(releasePressedState, 110);

  document.dispatchEvent(new KeyboardEvent("keydown", {
    key: " ",
    code: "Space",
    bubbles: true,
    cancelable: true,
  }));
}

bellButton?.addEventListener("pointerdown", triggerSpaceBell);
bellButton?.addEventListener("pointercancel", releasePressedState);
bellButton?.addEventListener("pointerleave", releasePressedState);
