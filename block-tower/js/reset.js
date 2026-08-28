const resetButton = document.querySelector("#tower-reset-button");

let resetting = false;

function resetTower() {
  if (resetting) return;

  const confirmed = window.confirm(
    "블록 타워를 처음 상태로 되돌릴까요?\n게임 설정과 물리 설정은 유지됩니다.",
  );
  if (!confirmed) return;

  resetting = true;
  resetButton.disabled = true;
  resetButton.textContent = "↻ 초기화 중…";

  window.dispatchEvent(new CustomEvent("block-tower:reset"));
  requestAnimationFrame(() => window.location.reload());
}

resetButton?.addEventListener("click", resetTower);
