import { el, pageContainer } from "../ui.js";

let gameDescriptionResizeBound = false;

function syncGameDescriptionOverflow(root = document) {
  root.querySelectorAll(".game-card__description-wrap").forEach((wrapper) => {
    const description = wrapper.querySelector(".game-card__description");
    const more = wrapper.querySelector(".game-card__more");
    if (!description || !more) return;

    wrapper.classList.remove("is-overflowing");
    more.hidden = true;

    const isOverflowing = description.scrollHeight > description.clientHeight + 1;
    wrapper.classList.toggle("is-overflowing", isOverflowing);
    more.hidden = !isOverflowing;
  });
}

function scheduleGameDescriptionOverflowSync(root) {
  window.requestAnimationFrame(() => syncGameDescriptionOverflow(root));
  document.fonts?.ready?.then(() => syncGameDescriptionOverflow(root));

  if (gameDescriptionResizeBound) return;
  gameDescriptionResizeBound = true;
  window.addEventListener("resize", () => syncGameDescriptionOverflow(document), { passive: true });
}

function createGameDescription(game, index) {
  const tooltipId = `game-description-${index}`;
  return el("div", { className: "game-card__description-wrap" }, [
    el("p", {
      className: "subtle game-card__description",
      text: game.description,
    }),
    el("button", {
      className: "game-card__more",
      type: "button",
      text: "… 더보기",
      hidden: true,
      "aria-label": `${game.title} 전체 설명 보기`,
      "aria-describedby": tooltipId,
    }),
    el("span", {
      className: "game-card__description-tooltip",
      id: tooltipId,
      role: "tooltip",
      text: game.description,
    }),
  ]);
}

const GAMES = [
  {
    icon: "🎭",
    title: "라이어 게임",
    description: "제시어를 모르는 라이어를 찾아내는 추리 게임이에요.",
    href: "./liar-game/",
    buttonText: "라이어 게임 시작",
  },
  {
    icon: "🔢",
    title: "더 게임",
    description: "1부터 100 사이의 네 더미를 함께 관리하며 모든 숫자 카드를 내려놓는 협력 카드 게임이에요.",
    href: "./the-game/",
    buttonText: "더 게임 시작",
  },
  {
    icon: "🌍",
    title: "마블 월드",
    description: "클래식부터 우주·바다·판타지까지 서로 다른 세계와 규칙을 선택해 즐기는 테마형 마블 게임이에요.",
    href: "./marble-game/",
    buttonText: "마블 월드 보기",
  },
  {
    icon: "🎲",
    title: "Can’t Stop",
    description: "주사위 조합을 선택해 열을 오르고 멈출 타이밍을 겨루는 push-your-luck 게임이에요.",
    href: "./games/cant-stop/",
    buttonText: "Can’t Stop 시작",
  },
];

export function renderGames() {
  const root = pageContainer();

  const header = el("section", { className: "page-stack" }, [
    el("div", {}, [
      el("p", { className: "eyebrow", text: "PLAY TOGETHER" }),
      el("h1", { className: "page-title", text: "게임" }),
      el("p", {
        className: "subtle",
        text: "함께 즐길 게임을 골라보세요. 새로운 게임도 이곳에 계속 추가될 예정이에요.",
      }),
    ]),
  ]);

  const grid = el("section", {
    className: "content-grid content-grid--2",
    "aria-label": "게임 목록",
  });

  GAMES.forEach((game, index) => {
    grid.append(el("article", { className: "card page-stack" }, [
      el("div", { className: "status-page__icon", text: game.icon, "aria-hidden": "true" }),
      el("div", {}, [
        el("h2", { className: "section-title", text: game.title }),
        createGameDescription(game, index),
      ]),
      el("a", {
        className: "button button--coral",
        href: game.href,
        text: game.buttonText,
      }),
    ]));
  });

  root.append(header, grid);
  scheduleGameDescriptionOverflowSync(root);
  return root;
}
