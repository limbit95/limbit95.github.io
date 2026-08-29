let lastTrigger = null;

function createRulesOverlay() {
  const existing = document.querySelector("#game-rules-overlay");
  if (existing) return existing;

  const overlay = document.createElement("div");
  overlay.id = "game-rules-overlay";
  overlay.className = "overlay rules-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="overlay-card rules-modal" role="dialog" aria-modal="true" aria-labelledby="game-rules-title">
      <header class="rules-modal__header">
        <div>
          <p class="eyebrow">HOW TO PLAY</p>
          <h2 id="game-rules-title">게임 규칙</h2>
        </div>
        <button class="ghost-button rules-modal__close" type="button" data-game-rules-close aria-label="게임 규칙 닫기">닫기</button>
      </header>

      <div class="rules-modal__content">
        <section class="rules-section">
          <h3>게임 목표</h3>
          <p>모든 플레이어가 한 팀이 되어 숫자 카드 2부터 99까지 총 98장을 네 개의 더미에 모두 내려놓으면 승리합니다.</p>
        </section>

        <section class="rules-section">
          <h3>게임 준비</h3>
          <ul>
            <li>공용 더미는 오름차순 2개가 <strong>1</strong>에서, 내림차순 2개가 <strong>100</strong>에서 시작합니다.</li>
            <li>1명은 8장, 2명은 7장, 3~5명은 각자 6장의 손패로 시작합니다.</li>
            <li>남은 카드는 뽑기 덱이 되며, 다른 플레이어의 손패 숫자는 볼 수 없습니다.</li>
          </ul>
        </section>

        <section class="rules-section">
          <h3>내 턴에 할 일</h3>
          <ul>
            <li>뽑기 덱에 카드가 남아 있는 동안에는 한 턴에 <strong>최소 2장</strong>을 내려놓아야 합니다.</li>
            <li>뽑기 덱이 모두 소진된 뒤에는 한 턴에 <strong>최소 1장</strong>을 내려놓으면 됩니다.</li>
            <li>최소 장수를 넘겨서 더 많은 카드를 내려놓아도 됩니다.</li>
            <li>카드는 한 장씩 원하는 공용 더미에 놓으며, 매번 현재 더미의 맨 위 숫자를 기준으로 다음 카드를 판단합니다.</li>
          </ul>
        </section>

        <section class="rules-section rules-section--split">
          <div>
            <h3>오름차순 ↑</h3>
            <p>현재 숫자보다 <strong>더 큰 숫자</strong>만 놓을 수 있습니다.</p>
            <p class="rules-example">예: 18 → 24 → 39</p>
          </div>
          <div>
            <h3>내림차순 ↓</h3>
            <p>현재 숫자보다 <strong>더 작은 숫자</strong>만 놓을 수 있습니다.</p>
            <p class="rules-example">예: 87 → 71 → 64</p>
          </div>
        </section>

        <section class="rules-section rules-section--highlight">
          <h3>±10 되돌리기</h3>
          <p>정확히 10 차이가 나면 해당 더미의 진행 방향과 반대로 카드를 놓을 수 있습니다. 이 규칙을 잘 활용하면 더미의 여유 공간을 다시 확보할 수 있습니다.</p>
          <ul>
            <li>오름차순 더미가 47이라면 <strong>37</strong>을 놓을 수 있습니다.</li>
            <li>내림차순 더미가 54라면 <strong>64</strong>를 놓을 수 있습니다.</li>
          </ul>
        </section>

        <section class="rules-section">
          <h3>턴 종료와 손패 보충</h3>
          <p>필요한 최소 장수를 내려놓은 뒤 턴을 종료할 수 있습니다. 뽑기 덱이 남아 있다면 턴 종료 후 처음 정해진 손패 수까지 다시 보충합니다. 덱이 비면 더 이상 보충하지 않습니다.</p>
        </section>

        <section class="rules-section">
          <h3>승리와 패배</h3>
          <ul>
            <li><strong>승리:</strong> 숫자 카드 2~99를 모두 공용 더미에 내려놓으면 즉시 팀 전체가 승리합니다.</li>
            <li><strong>패배:</strong> 자신의 턴에 필요한 최소 제출 장수를 규칙에 맞게 내려놓을 수 없으면 팀 전체가 패배합니다.</li>
          </ul>
        </section>

        <section class="rules-section">
          <h3>협력 팁</h3>
          <p>이 게임은 서로의 손패를 직접 보여주지 않고 협력하는 게임입니다. 특정 더미를 잠시 비워 달라거나 큰 간격을 만들지 말아 달라는 식으로 의논하면서, ±10 되돌리기를 만들 수 있는 공간을 함께 남겨두는 것이 중요합니다.</p>
        </section>
      </div>

      <button class="primary-button rules-modal__done" type="button" data-game-rules-close>확인했어요</button>
    </section>
  `;

  document.body.append(overlay);
  return overlay;
}

const overlay = createRulesOverlay();

function closeRules() {
  if (overlay.hidden) return;
  overlay.hidden = true;
  document.body.classList.remove("rules-modal-open");
  lastTrigger?.focus?.();
  lastTrigger = null;
}

function openRules(trigger) {
  lastTrigger = trigger;
  overlay.hidden = false;
  document.body.classList.add("rules-modal-open");
  overlay.querySelector("[data-game-rules-close]")?.focus();
}

function installRuleButton() {
  const modeScreen = document.querySelector("#mode-screen");
  const summary = modeScreen?.querySelector(".rule-summary");
  const backLink = modeScreen?.querySelector(".back-link");
  const modeMessage = modeScreen?.querySelector("#mode-message");
  if (!modeScreen || !summary || !backLink) return false;

  backLink.textContent = "게임 목록으로";
  modeScreen.insertBefore(summary, backLink);
  if (modeMessage) modeScreen.append(modeMessage);

  if (summary.querySelector("[data-game-rules-open]")) return true;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "ghost-button rules-open-button";
  button.dataset.gameRulesOpen = "true";
  button.textContent = "게임 규칙";
  button.addEventListener("click", () => openRules(button));
  summary.append(button);
  return true;
}

if (!installRuleButton()) {
  const observer = new MutationObserver(() => {
    if (installRuleButton()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

overlay.addEventListener("click", (event) => {
  if (event.target === overlay || event.target.closest("[data-game-rules-close]")) {
    closeRules();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !overlay.hidden) closeRules();
});
