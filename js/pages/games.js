import { el, pageContainer } from "../ui.js";

const GAMES = [
  {
    icon: "🎭",
    title: "라이어 게임",
    description: "제시어를 모르는 라이어를 찾아내는 추리 게임이에요.",
    href: "./liar-game/",
    buttonText: "라이어 게임 시작",
  },
  {
    icon: "💎",
    title: "스플렌더",
    description: "보석을 모아 개발 카드를 구매하고 영구 보너스를 쌓는 전략 게임이에요.",
    href: "./splendor-game/",
    buttonText: "스플렌더 UI 데모",
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

  GAMES.forEach((game) => {
    grid.append(el("article", { className: "card page-stack" }, [
      el("div", { className: "status-page__icon", text: game.icon, "aria-hidden": "true" }),
      el("div", {}, [
        el("h2", { className: "section-title", text: game.title }),
        el("p", { className: "subtle", text: game.description }),
      ]),
      el("a", {
        className: "button button--coral",
        href: game.href,
        text: game.buttonText,
      }),
    ]));
  });

  root.append(header, grid);
  return root;
}
