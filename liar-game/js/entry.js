import { welcomeView } from "./views/welcome.js";

const gameRoot = document.querySelector("#app");

if (!gameRoot) {
  throw new Error("Liar Game root element was not found.");
}

const welcomeRoot = document.createElement("main");
welcomeRoot.id = "liar-welcome";
welcomeRoot.className = "app-shell";
welcomeRoot.innerHTML = welcomeView();

const gameNavigation = document.createElement("nav");
gameNavigation.className = "app-shell row";
gameNavigation.style.paddingBottom = "0";
gameNavigation.style.justifyContent = "flex-end";
gameNavigation.setAttribute("aria-label", "라이어 게임 이동");
gameNavigation.innerHTML = `
  <a class="button" href="../#/games">게임 목록으로</a>
`;

gameRoot.before(welcomeRoot, gameNavigation);

function setVisible(element, visible) {
  element.hidden = !visible;
  element.style.display = visible ? "" : "none";
}

setVisible(welcomeRoot, true);
setVisible(gameRoot, false);
setVisible(gameNavigation, false);

function showGame() {
  setVisible(welcomeRoot, false);
  setVisible(gameRoot, true);
  setVisible(gameNavigation, true);
  gameRoot.focus({ preventScroll: true });
}

welcomeRoot.addEventListener("click", (event) => {
  if (!event.target.closest("[data-action='open-lobby']")) return;
  showGame();
});
