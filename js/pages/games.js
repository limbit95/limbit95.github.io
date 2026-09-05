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
