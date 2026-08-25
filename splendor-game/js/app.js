const app = document.querySelector("#app");

const GEM_META = {
  white: { label: "흰색", className: "gem--white" },
  blue: { label: "파랑", className: "gem--blue" },
  green: { label: "초록", className: "gem--green" },
  red: { label: "빨강", className: "gem--red" },
  black: { label: "검정", className: "gem--black" },
  gold: { label: "금", className: "gem--gold" },
};

const DEMO_PLAYERS = [
  { name: "성혁", initial: "성", ready: true, score: 7, cards: 8, reserved: 1 },
  { name: "예진", initial: "예", ready: true, score: 5, cards: 7, reserved: 2 },
  { name: "민수", initial: "민", ready: true, score: 4, cards: 6, reserved: 0 },
];

const DEMO_NOBLES = [
  { id: "n1", prestige: 3, requirements: { white: 4, blue: 4, black: 4 } },
  { id: "n2", prestige: 3, requirements: { green: 3, red: 3, black: 3 } },
  { id: "n3", prestige: 3, requirements: { white: 4, green: 4, red: 4 } },
  { id: "n4", prestige: 3, requirements: { blue: 3, green: 3, black: 3 } },
];

const DEMO_CARDS = {
  3: [
    { id: "t3-1", tier: 3, bonus: "blue", prestige: 4, cost: { white: 3, green: 6, black: 3 } },
    { id: "t3-2", tier: 3, bonus: "red", prestige: 5, cost: { blue: 3, green: 3, black: 6 } },
    { id: "t3-3", tier: 3, bonus: "white", prestige: 4, cost: { blue: 7 } },
    { id: "t3-4", tier: 3, bonus: "black", prestige: 3, cost: { white: 3, blue: 3, red: 5, green: 3 } },
  ],
  2: [
    { id: "t2-1", tier: 2, bonus: "green", prestige: 2, cost: { white: 2, blue: 3, red: 2 } },
    { id: "t2-2", tier: 2, bonus: "black", prestige: 1, cost: { blue: 4, green: 2, red: 1 } },
    { id: "t2-3", tier: 2, bonus: "white", prestige: 2, cost: { green: 5, red: 3 } },
    { id: "t2-4", tier: 2, bonus: "blue", prestige: 1, cost: { white: 2, green: 2, red: 3 } },
  ],
  1: [
    { id: "t1-1", tier: 1, bonus: "red", prestige: 0, cost: { white: 1, blue: 1, green: 1, black: 1 } },
    { id: "t1-2", tier: 1, bonus: "blue", prestige: 0, cost: { green: 2, red: 1, black: 2 } },
    { id: "t1-3", tier: 1, bonus: "white", prestige: 1, cost: { blue: 4 } },
    { id: "t1-4", tier: 1, bonus: "green", prestige: 0, cost: { white: 2, blue: 1, red: 1, black: 1 } },
  ],
};

const BANK = { white: 5, blue: 5, green: 5, red: 5, black: 5, gold: 5 };
const MY_BONUSES = { white: 2, blue: 1, green: 3, red: 1, black: 1 };

const state = {
  screen: "welcome",
  selectedCardId: null,
  selectedTokens: new Set(),
  notice: "현재는 UI 프로토타입입니다. 실제 게임 데이터와 서버 동작은 다음 단계에서 연결합니다.",
};

function gemDot(color) {
  const meta = GEM_META[color];
  return `<span class="gem-dot ${meta.className}" aria-label="${meta.label}"></span>`;
}

function renderCosts(cost = {}) {
  return Object.entries(cost)
    .filter(([, amount]) => amount > 0)
    .map(([color, amount]) => `<span class="cost-chip">${gemDot(color)}${amount}</span>`)
    .join("");
}

function allCards() {
  return Object.values(DEMO_CARDS).flat();
}

function selectedCard() {
  return allCards().find((card) => card.id === state.selectedCardId) ?? null;
}

function prototypeBanner() {
  return `
    <div class="prototype-banner">
      <span><strong>UI PROTOTYPE</strong> · 화면 구조와 모바일 배치를 확인하는 1차 데모</span>
      <span class="prototype-badge">DB 미연결</span>
    </div>
  `;
}

function welcomeView() {
  return `
    ${prototypeBanner()}
    <section class="surface hero">
      <div class="hero-copy">
        <p class="eyebrow">GEM ENGINE · PROTOTYPE</p>
        <h1>스플렌더</h1>
        <p class="hero-description">보석을 모아 개발 카드를 구매하고 영구 보너스를 쌓는 전략 게임입니다. 지금은 실제 게임 로직을 붙이기 전, 화면과 플레이 흐름을 점검하는 프로토타입이에요.</p>
        <div class="hero-actions">
          <button class="button button--primary" type="button" data-go="lobby">UI 데모 시작</button>
          <a class="button button--secondary" href="../#/games">게임 목록으로</a>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="gem-orbit">
          <div class="gem-orbit__center">♛</div>
          <span class="orbit-gem gem--white"></span>
          <span class="orbit-gem gem--blue"></span>
          <span class="orbit-gem gem--green"></span>
          <span class="orbit-gem gem--red"></span>
          <span class="orbit-gem gem--black"></span>
        </div>
      </div>
    </section>
  `;
}

function lobbyView() {
  return `
    ${prototypeBanner()}
    <header class="page-header">
      <div>
        <p class="eyebrow">STEP 1 · LOBBY</p>
        <h1 class="page-title">게임 로비</h1>
        <p class="subtle">2차 구현에서 Supabase 방 생성/참가가 연결될 예정입니다.</p>
      </div>
      <button class="button button--ghost" type="button" data-go="welcome">처음으로</button>
    </header>
    <section class="flow-grid">
      <article class="surface panel">
        <span class="badge">HOST</span>
        <h2>새 게임방 만들기</h2>
        <p class="panel-copy">새로운 방을 만들고 친구들에게 방 코드를 공유합니다.</p>
        <button class="button button--primary button--block" type="button" data-go="room">데모 방 만들기</button>
      </article>
      <article class="surface panel">
        <span class="badge">JOIN</span>
        <h2>방 코드로 참가</h2>
        <p class="panel-copy">지금은 어떤 값을 입력해도 동일한 데모 방으로 이동합니다.</p>
        <input class="input" type="text" value="GEM7K2" aria-label="방 코드">
        <button class="button button--secondary button--block" type="button" data-go="room">데모 방 참가</button>
      </article>
    </section>
  `;
}

function playerRows() {
  return DEMO_PLAYERS.map((player, index) => `
    <li class="player-row">
      <div class="player-identity">
        <span class="avatar">${player.initial}</span>
        <div>
          <strong>${player.name}${index === 0 ? " · 방장" : ""}</strong>
          <p class="subtle">좌석 ${index + 1}</p>
        </div>
      </div>
      <span class="ready">✓ 준비 완료</span>
    </li>
  `).join("");
}

function roomView() {
  return `
    ${prototypeBanner()}
    <header class="page-header">
      <div>
        <p class="eyebrow">STEP 2 · ROOM</p>
        <h1 class="page-title">대기방 · GEM7K2</h1>
        <p class="subtle">플레이어 3명 · 최소 2명 / 최대 4명</p>
      </div>
      <button class="button button--ghost" type="button" data-go="lobby">로비로</button>
    </header>
    <section class="room-layout">
      <article class="surface panel">
        <div class="section-heading">
          <h2>플레이어</h2>
          <span class="section-meta">3 / 4</span>
        </div>
        <ul class="player-list">${playerRows()}</ul>
      </article>
      <aside class="surface panel">
        <span class="badge">ROOM STATUS</span>
        <h2>모두 준비됐어요</h2>
        <p class="panel-copy">실제 버전에서는 방장만 게임을 시작할 수 있고, 시작 순간 서버가 카드·귀족·보석을 세팅합니다.</p>
        <button class="button button--primary button--block" type="button" data-go="board">데모 게임 시작</button>
      </aside>
    </section>
  `;
}

function nobleCard(noble) {
  return `
    <article class="noble">
      <div class="noble__top">
        <strong>귀족</strong>
        <span class="prestige">${noble.prestige}</span>
      </div>
      <div class="requirements">${renderCosts(noble.requirements)}</div>
    </article>
  `;
}

function developmentCard(card) {
  const selected = state.selectedCardId === card.id ? " is-selected" : "";
  const meta = GEM_META[card.bonus];
  return `
    <button class="dev-card${selected}" type="button" data-card-id="${card.id}" aria-pressed="${state.selectedCardId === card.id}">
      <div class="dev-card__top">
        <span class="prestige">${card.prestige}</span>
        <span class="bonus-gem ${meta.className}" title="${meta.label} 영구 보너스"></span>
      </div>
      <p class="card-tier">TIER ${card.tier}</p>
      <div class="costs">${renderCosts(card.cost)}</div>
    </button>
  `;
}

function tierRows() {
  return [3, 2, 1].map((tier) => `
    <div class="tier-row">
      <div class="section-heading">
        <h3>${tier}단계 개발 카드</h3>
        <span class="section-meta">공개 4장</span>
      </div>
      <div class="card-row">${DEMO_CARDS[tier].map(developmentCard).join("")}</div>
    </div>
  `).join("");
}

function tokenButton(color, count) {
  const meta = GEM_META[color];
  const selected = state.selectedTokens.has(color) ? " is-selected" : "";
  return `
    <button class="token-button${selected}" type="button" data-token="${color}" ${color === "gold" ? "disabled" : ""}>
      <span class="token-gem ${meta.className}">${count}</span>
      <span><strong>${meta.label}</strong><span class="token-count">${color === "gold" ? "예약 시 획득" : "선택 가능"}</span></span>
    </button>
  `;
}

function playerSummary() {
  return DEMO_PLAYERS.map((player, index) => `
    <li class="player-row">
      <div class="player-identity">
        <span class="avatar">${player.initial}</span>
        <div>
          <strong>${player.name}${index === 0 ? " · 현재 턴" : ""}</strong>
          <p class="subtle">카드 ${player.cards} · 예약 ${player.reserved}</p>
        </div>
      </div>
      <span class="prestige">${player.score}</span>
    </li>
  `).join("");
}

function selectionPanel() {
  const card = selectedCard();
  if (!card) {
    return `
      <div class="selection-box">
        <p class="selection-title">카드를 선택해보세요</p>
        <p class="selection-copy">공개 카드를 누르면 비용과 향후 구매/예약 행동이 표시될 자리입니다.</p>
      </div>
    `;
  }

  return `
    <div class="selection-box">
      <p class="selection-title">${card.tier}단계 · ${GEM_META[card.bonus].label} 보너스 · ${card.prestige}점</p>
      <div class="costs">${renderCosts(card.cost)}</div>
      <div class="action-row">
        <button class="button button--primary" type="button" data-prototype-action="purchase">구매</button>
        <button class="button button--secondary" type="button" data-prototype-action="reserve">예약</button>
      </div>
    </div>
  `;
}

function boardView() {
  const tokenSelection = [...state.selectedTokens].map((color) => GEM_META[color].label).join(" · ") || "선택 없음";
  return `
    ${prototypeBanner()}
    <section class="board-shell">
      <header class="surface board-topbar">
        <div>
          <p class="eyebrow">STEP 3 · GAME BOARD</p>
          <h1 class="page-title">스플렌더 · GEM7K2</h1>
        </div>
        <div class="turn-info"><span class="turn-dot"></span><strong>성혁님의 턴</strong></div>
        <button class="button button--ghost" type="button" data-go="room">대기방으로</button>
      </header>

      <div class="board-layout">
        <div class="board-main">
          <section class="surface board-section">
            <div class="section-heading"><h2>👑 귀족</h2><span class="section-meta">3인 기준 4명</span></div>
            <div class="noble-row">${DEMO_NOBLES.map(nobleCard).join("")}</div>
          </section>

          <section class="surface board-section tier-stack">
            ${tierRows()}
          </section>

          <section class="surface board-section">
            <div class="section-heading"><h2>💎 보석 공급처</h2><span class="section-meta">선택: ${tokenSelection}</span></div>
            <div class="token-bank">${Object.entries(BANK).map(([color, count]) => tokenButton(color, count)).join("")}</div>
          </section>
        </div>

        <aside class="board-side">
          <section class="surface board-section">
            <div class="section-heading"><h2>플레이어</h2><span class="section-meta">3명</span></div>
            <ul class="player-list">${playerSummary()}</ul>
          </section>

          <section class="surface board-section">
            <div class="section-heading"><h2>내 상태</h2><span class="section-meta">성혁</span></div>
            <div class="stat-grid">
              <div class="stat"><strong>7</strong><span>점수</span></div>
              <div class="stat"><strong>5</strong><span>토큰</span></div>
              <div class="stat"><strong>1</strong><span>예약</span></div>
            </div>
            <div class="bonus-list">
              ${Object.entries(MY_BONUSES).map(([color, count]) => `<div class="bonus-item">${gemDot(color)}<span>${count}</span></div>`).join("")}
            </div>
          </section>

          <section class="surface board-section">
            <div class="section-heading"><h2>선택한 카드</h2><span class="section-meta">UI 미리보기</span></div>
            ${selectionPanel()}
          </section>

          <p class="notice" id="prototype-notice">${state.notice}</p>
        </aside>
      </div>
    </section>
  `;
}

function render() {
  const views = {
    welcome: welcomeView,
    lobby: lobbyView,
    room: roomView,
    board: boardView,
  };

  app.innerHTML = (views[state.screen] ?? welcomeView)();
  bindEvents();
}

function bindEvents() {
  app.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      state.screen = button.dataset.go;
      state.notice = "현재는 UI 프로토타입입니다. 실제 게임 데이터와 서버 동작은 다음 단계에서 연결합니다.";
      render();
    });
  });

  app.querySelectorAll("[data-card-id]").forEach((cardButton) => {
    cardButton.addEventListener("click", () => {
      state.selectedCardId = state.selectedCardId === cardButton.dataset.cardId ? null : cardButton.dataset.cardId;
      state.notice = state.selectedCardId
        ? "카드를 선택했습니다. 구매/예약 버튼은 아직 서버에 연결되지 않은 데모입니다."
        : "카드 선택을 해제했습니다.";
      render();
    });
  });

  app.querySelectorAll("[data-token]").forEach((tokenButtonElement) => {
    tokenButtonElement.addEventListener("click", () => {
      const color = tokenButtonElement.dataset.token;
      if (state.selectedTokens.has(color)) {
        state.selectedTokens.delete(color);
      } else if (state.selectedTokens.size < 3) {
        state.selectedTokens.add(color);
      } else {
        state.notice = "UI 데모에서는 서로 다른 보석을 최대 3개까지 선택해볼 수 있습니다.";
      }
      render();
    });
  });

  app.querySelectorAll("[data-prototype-action]").forEach((button) => {
    button.addEventListener("click", () => {
      state.notice = button.dataset.prototypeAction === "purchase"
        ? "구매 기능은 3~4차 구현에서 실제 카드 비용·할인 계산과 함께 연결할 예정입니다."
        : "예약 기능은 3~4차 구현에서 금 토큰 지급과 함께 연결할 예정입니다.";
      render();
    });
  });
}

render();
