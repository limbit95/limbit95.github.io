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
gameNavigation.className = "liar-shell-nav";
gameNavigation.setAttribute("aria-label", "라이어 게임 이동");
gameNavigation.innerHTML = `
  <button class="secondary" type="button" data-liar-welcome>처음으로</button>
  <a class="button" href="../#/games">게임 목록으로</a>
`;

gameRoot.before(welcomeRoot, gameNavigation);
gameRoot.hidden = true;
gameNavigation.hidden = true;

function showGame() {
  welcomeRoot.hidden = true;
  gameRoot.hidden = false;
  gameNavigation.hidden = false;
  gameRoot.focus({ preventScroll: true });
}

function showWelcome() {
  gameRoot.hidden = true;
  gameNavigation.hidden = true;
  welcomeRoot.hidden = false;
  welcomeRoot.querySelector("[data-action='open-lobby']")?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "auto" });
}

welcomeRoot.addEventListener("click", (event) => {
  if (!event.target.closest("[data-action='open-lobby']")) return;
  showGame();
});

gameNavigation.querySelector("[data-liar-welcome]")?.addEventListener("click", showWelcome);
