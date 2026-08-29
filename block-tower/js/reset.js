const resetButton = document.querySelector("#tower-reset-button");
const selectionStatus = document.querySelector("#selection-status");
const RESET_NOTICE_KEY = "block-tower-reset-notice";

let resetting = false;

function showResetNotice() {
  if (sessionStorage.getItem(RESET_NOTICE_KEY) !== "done") return;
  sessionStorage.removeItem(RESET_NOTICE_KEY);
  if (selectionStatus) selectionStatus.textContent = "블록 타워와 게임 진행 상태가 처음 상태로 초기화되었습니다.";
}

function resetTower() {
  if (resetting) return;

  const confirmed = window.confirm(
    "블록 타워와 현재 진행 중인 턴을 처음 상태로 되돌릴까요?\n게임 설정과 저장된 물리 설정은 유지됩니다.",
  );
  if (!confirmed) return;

  resetting = true;
  resetButton.disabled = true;
  resetButton.textContent = "↻ 초기화 중…";
  window.__blockTowerStage5Rules?.resetSession?.();
  sessionStorage.setItem(RESET_NOTICE_KEY, "done");

  requestAnimationFrame(() => window.location.reload());
}

showResetNotice();
resetButton?.addEventListener("click", resetTower);
