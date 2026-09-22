import { BGM_STATE } from "./bgmController.js";

function element(tagName, attributes = {}, children = []) {
  const node = document.createElement(tagName);
  for (const [key, value] of Object.entries(attributes)) {
    if (value == null) continue;
    if (key === "className") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("aria-")) node.setAttribute(key, value);
    else if (key === "title") node.title = value;
    else node[key] = value;
  }
  for (const child of children) if (child) node.append(child);
  return node;
}

function iconButton(label, text, className) {
  return element("button", {
    type: "button",
    className,
    text,
    "aria-label": label,
    title: label,
  });
}

export function mountBgmPlayer({ controller, mount = document.body } = {}) {
  if (!controller || !mount) return null;
  const { track } = controller;

  const root = element("aside", {
    className: "game-bgm-player",
    "aria-label": "게임 배경 음악",
  });
  root.dataset.gameBgmPlayer = "true";

  const equalizer = element("span", {
    className: "game-bgm-player__equalizer",
    "aria-hidden": "true",
  }, [0, 1, 2].map(() => element("span", { className: "game-bgm-player__equalizer-bar" })));

  const toggle = iconButton("배경 음악 재생", "▶", "game-bgm-player__control game-bgm-player__toggle");
  const volumeButton = iconButton("배경 음악 볼륨", "🔊", "game-bgm-player__control game-bgm-player__volume-button");
  volumeButton.setAttribute("aria-expanded", "false");
  const sourceButton = iconButton(
    "음악 출처 보기",
    `${track.title} · 출처`,
    "game-bgm-player__source-button",
  );
  sourceButton.setAttribute("aria-expanded", "false");

  const volumePanel = element("div", {
    className: "game-bgm-player__popover game-bgm-player__volume-popover",
  });
  volumePanel.hidden = true;
  const volumeInput = element("input", {
    type: "range",
    min: "0",
    max: "1",
    step: "0.01",
    className: "game-bgm-player__volume-range",
    "aria-label": "배경 음악 볼륨",
  });
  volumePanel.append(volumeInput);

  const sourcePanel = element("div", {
    className: "game-bgm-player__popover game-bgm-player__source-popover",
  });
  sourcePanel.hidden = true;
  const sourceItems = [
    element("strong", { text: track.title }),
    element("span", { text: track.artist }),
    track.isrc ? element("span", { text: `ISRC ${track.isrc}` }) : null,
    element("span", { text: track.license }),
    element("a", {
      href: track.sourceUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      text: "공식 출처 ↗",
    }),
    track.previewUrl ? element("a", {
      href: track.previewUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      text: "YouTube 영상 ↗",
    }) : null,
    element("a", {
      href: track.licenseUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      text: "라이선스 ↗",
    }),
  ].filter(Boolean);
  sourcePanel.append(...sourceItems);

  root.append(equalizer, toggle, volumeButton, sourceButton, volumePanel, sourcePanel);
  mount.append(root);

  const ownerDocument = root.ownerDocument ?? document;

  function closePopovers(except = null) {
    if (except !== volumePanel) {
      volumePanel.hidden = true;
      volumeButton.setAttribute("aria-expanded", "false");
    }
    if (except !== sourcePanel) {
      sourcePanel.hidden = true;
      sourceButton.setAttribute("aria-expanded", "false");
    }
  }

  toggle.addEventListener("click", () => {
    closePopovers();
    void controller.toggleByUser();
  });

  volumeButton.addEventListener("click", () => {
    const opening = volumePanel.hidden;
    closePopovers(opening ? volumePanel : null);
    volumePanel.hidden = !opening;
    volumeButton.setAttribute("aria-expanded", String(opening));
    if (opening) volumeInput.focus({ preventScroll: true });
  });

  sourceButton.addEventListener("click", () => {
    const opening = sourcePanel.hidden;
    closePopovers(opening ? sourcePanel : null);
    sourcePanel.hidden = !opening;
    sourceButton.setAttribute("aria-expanded", String(opening));
  });

  volumeInput.addEventListener("input", () => {
    controller.setVolume(volumeInput.value);
  });

  function onOutsidePointerDown(event) {
    if (!root.contains(event.target)) closePopovers();
  }

  ownerDocument.addEventListener("pointerdown", onOutsidePointerDown);

  const unsubscribe = controller.subscribe((state) => {
    const playing = state.status === BGM_STATE.PLAYING;
    root.dataset.bgmState = state.status;
    root.classList.toggle("is-playing", playing && state.volume > 0);
    root.classList.toggle("needs-interaction", state.status === BGM_STATE.NEEDS_INTERACTION);
    toggle.textContent = playing ? "⏸" : "▶";
    toggle.setAttribute("aria-label", playing ? "배경 음악 일시정지" : "배경 음악 재생");
    toggle.title = playing ? "배경 음악 일시정지" : "배경 음악 재생";
    volumeInput.value = String(state.volume);
    volumeButton.textContent = state.volume <= 0 ? "🔇" : state.volume < 0.5 ? "🔉" : "🔊";
  });

  return Object.freeze({
    root,
    destroy() {
      unsubscribe();
      ownerDocument.removeEventListener("pointerdown", onOutsidePointerDown);
      root.remove();
    },
  });
}
