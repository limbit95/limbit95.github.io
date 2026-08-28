const PILE_PRESETS = Object.freeze([
  Object.freeze({
    value: "standard",
    label: "기본 4더미",
    values: ["1", "1", "100", "100"],
  }),
  Object.freeze({
    value: "one-ascending",
    label: "오름차순 1개",
    values: ["1", "—", "100", "100"],
  }),
  Object.freeze({
    value: "one-each",
    label: "오름·내림 1개씩",
    values: ["1", "—", "100", "—"],
  }),
  Object.freeze({
    value: "one-descending",
    label: "내림차순 1개",
    values: ["1", "1", "100", "—"],
  }),
]);

let apiPromise = null;
let modal = null;
let currentSnapshot = null;
let busy = false;

function ensureApi() {
  apiPromise ??= import("./multiplayerApi.js");
  return apiPromise;
}

function presetOptionsMarkup() {
  return PILE_PRESETS.map((preset, index) => `
    <label class="pile-preset-option">
      <input type="radio" name="the-game-pile-preset" value="${preset.value}" ${index === 0 ? "checked" : ""}>
      <span class="pile-preset-option__body">
        <strong>${preset.label}</strong>
        <span class="pile-preset-preview" aria-label="${preset.values.join(", ")}">
          <span class="ascending">↑ ${preset.values[0]}</span>
          <span class="ascending">↑ ${preset.values[1]}</span>
          <span class="descending">↓ ${preset.values[2]}</span>
          <span class="descending">↓ ${preset.values[3]}</span>
        </span>
      </span>
    </label>
  `).join("");
}

function ensureModal() {
  if (modal) return modal;

  modal = document.createElement("div");
  modal.className = "overlay game-settings-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <form class="overlay-card game-settings-card" data-game-settings-form role="dialog" aria-modal="true" aria-labelledby="the-game-settings-title">
      <p class="eyebrow">GAME SETTINGS</p>
      <h2 id="the-game-settings-title">게임 설정</h2>
      <p class="game-settings-copy">게임을 시작할 때 사용할 오름차순·내림차순 더미 구성을 선택하세요.</p>
      <fieldset class="pile-preset-list" data-pile-preset-list>
        <legend>시작 더미</legend>
        ${presetOptionsMarkup()}
      </fieldset>
      <p class="game-settings-message" data-game-settings-message role="status" aria-live="polite"></p>
      <div class="game-settings-actions">
        <button class="ghost-button" type="button" data-game-settings-close>취소</button>
        <button class="primary-button" type="submit" data-game-settings-save>설정 저장</button>
      </div>
    </form>
  `;
  document.body.append(modal);

  modal.querySelector("[data-game-settings-close]").addEventListener("click", closeSettings);
  modal.querySelector("[data-game-settings-form]").addEventListener("submit", saveSettings);
  modal.addEventListener("click", (event) => {
    if (event.target === modal && !busy) closeSettings();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden && !busy) closeSettings();
  });

  return modal;
}

function setModalMessage(message = "") {
  ensureModal().querySelector("[data-game-settings-message]").textContent = message;
}

function setModalBusy(nextBusy) {
  busy = nextBusy;
  const root = ensureModal();
  for (const control of root.querySelectorAll("button, input")) {
    control.disabled = nextBusy || (control.matches("input") && !currentSnapshot?.self?.is_host);
  }
}

function renderSnapshot(snapshot) {
  currentSnapshot = snapshot;
  const root = ensureModal();
  const preset = snapshot?.room?.pile_preset ?? "standard";
  const isHost = snapshot?.self?.is_host === true;

  for (const radio of root.querySelectorAll('input[name="the-game-pile-preset"]')) {
    radio.checked = radio.value === preset;
    radio.disabled = !isHost || busy;
  }

  const saveButton = root.querySelector("[data-game-settings-save]");
  const closeButton = root.querySelector("[data-game-settings-close]");
  saveButton.textContent = isHost ? "설정 저장" : "확인";
  closeButton.hidden = !isHost;
  setModalMessage(isHost ? "" : "게임 설정은 방장만 변경할 수 있습니다.");
}

function closeSettings() {
  if (!modal || busy) return;
  modal.hidden = true;
  currentSnapshot = null;
}

async function openSettings() {
  const root = ensureModal();
  root.hidden = false;
  currentSnapshot = null;
  setModalMessage("현재 설정을 불러오는 중…");
  setModalBusy(true);

  try {
    const api = await ensureApi();
    const snapshot = await api.getMyActiveRoom();
    if (!snapshot?.room || snapshot.room.status !== "waiting") {
      throw new Error("ROOM_NOT_WAITING");
    }
    currentSnapshot = snapshot;
    setModalBusy(false);
    renderSnapshot(snapshot);
  } catch (error) {
    currentSnapshot = null;
    setModalBusy(false);
    const message = error?.message ?? "";
    setModalMessage(
      message.includes("ROOM_NOT_WAITING")
        ? "게임을 시작하기 전 대기방에서만 설정을 변경할 수 있습니다."
        : "게임 설정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    );
  }
}

async function saveSettings(event) {
  event.preventDefault();
  if (busy) return;

  if (!currentSnapshot?.self?.is_host) {
    closeSettings();
    return;
  }

  const data = new FormData(event.currentTarget);
  const pilePreset = data.get("the-game-pile-preset");
  if (!PILE_PRESETS.some((preset) => preset.value === pilePreset)) return;

  setModalBusy(true);
  setModalMessage("게임 설정을 저장하는 중…");
  const startButton = document.querySelector("#lobby-screen:not([hidden]) [data-start]");
  if (startButton) startButton.disabled = true;

  try {
    const api = await ensureApi();
    currentSnapshot = await api.setGameSettings({
      roomId: currentSnapshot.room.id,
      pilePreset,
      expectedVersion: currentSnapshot.room.version,
    });
    const lobbyMessage = document.querySelector("#lobby-screen [data-lobby-message]");
    if (lobbyMessage) lobbyMessage.textContent = "게임 설정을 저장했습니다.";
    setModalBusy(false);
    closeSettings();
  } catch (error) {
    const message = error?.message ?? "";
    setModalBusy(false);
    if (message.includes("STATE_CHANGED")) {
      setModalMessage("방 상태가 먼저 변경되었습니다. 설정 창을 닫았다가 다시 열어 최신 설정을 확인해 주세요.");
    } else if (message.includes("HOST_REQUIRED")) {
      setModalMessage("게임 설정은 방장만 변경할 수 있습니다.");
    } else {
      setModalMessage("게임 설정을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }
}

function installSettingsButton(lobby) {
  const actions = lobby.querySelector(".lobby-actions");
  if (!actions || actions.querySelector("[data-game-settings-open]")) return;

  const button = document.createElement("button");
  button.className = "ghost-button lobby-settings-button";
  button.type = "button";
  button.dataset.gameSettingsOpen = "";
  button.textContent = "게임 설정";
  button.addEventListener("click", openSettings);

  const startButton = actions.querySelector("[data-start]");
  actions.classList.add("has-game-settings");
  actions.insertBefore(button, startButton ?? null);
}

function installAvailableLobby() {
  const lobby = document.querySelector("#lobby-screen");
  if (lobby) installSettingsButton(lobby);
}

const observer = new MutationObserver(installAvailableLobby);
observer.observe(document.querySelector(".app-shell") ?? document.body, {
  childList: true,
  subtree: true,
});
installAvailableLobby();
