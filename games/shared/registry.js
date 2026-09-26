const GAME_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

const DEFAULT_CAPABILITIES = Object.freeze({
  online: false,
  local: false,
  invite: false,
  presence: false,
});

function nonEmptyText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`Game definition requires a non-empty ${field}.`);
  }
  return value.trim();
}

function capabilitiesOf(value = {}) {
  return Object.freeze({
    ...DEFAULT_CAPABILITIES,
    online: value.online === true,
    local: value.local === true,
    invite: value.invite === true,
    presence: value.presence === true,
  });
}

export function defineGame(definition) {
  if (!definition || typeof definition !== "object") {
    throw new TypeError("Game definition must be an object.");
  }

  const id = nonEmptyText(definition.id, "id");
  if (!GAME_ID_PATTERN.test(id)) {
    throw new TypeError(`Game id must be a lowercase kebab-case slug: ${id}`);
  }

  const href = nonEmptyText(definition.href, "href");
  if (!href.startsWith("./") && !href.startsWith("/")) {
    throw new TypeError(`Game href must be site-relative: ${href}`);
  }

  return Object.freeze({
    id,
    title: nonEmptyText(definition.title, "title"),
    href,
    icon: nonEmptyText(definition.icon, "icon"),
    description: nonEmptyText(definition.description, "description"),
    buttonText: nonEmptyText(definition.buttonText, "buttonText"),
    capabilities: capabilitiesOf(definition.capabilities),
    platform: definition.platform === "shared" ? "shared" : "legacy",
  });
}

export const GAME_REGISTRY = Object.freeze([
  defineGame({
    id: "liar",
    icon: "🎭",
    title: "라이어 게임",
    description: "제시어를 모르는 라이어를 찾아내는 추리 게임이에요.",
    href: "./liar-game/",
    buttonText: "라이어 게임 시작",
    capabilities: { online: true },
    platform: "legacy",
  }),
  defineGame({
    id: "the-game",
    icon: "🔢",
    title: "더 게임",
    description: "1부터 100 사이의 네 더미를 함께 관리하며 모든 숫자 카드를 내려놓는 협력 카드 게임이에요.",
    href: "./the-game/",
    buttonText: "더 게임 시작",
    capabilities: { online: true, invite: true },
    platform: "legacy",
  }),
  defineGame({
    id: "marble",
    icon: "🌍",
    title: "마블 월드",
    description: "클래식부터 우주·바다·판타지까지 서로 다른 세계와 규칙을 선택해 즐기는 테마형 마블 게임이에요.",
    href: "./marble-game/",
    buttonText: "마블 월드 보기",
    capabilities: { online: true, presence: true },
    platform: "legacy",
  }),
  defineGame({
    id: "cant-stop",
    icon: "🎲",
    title: "Can’t Stop",
    description: "주사위 조합을 선택해 열을 오르고 멈출 타이밍을 겨루는 push-your-luck 게임이에요.",
    href: "./games/cant-stop/",
    buttonText: "Can’t Stop 시작",
    capabilities: { online: true, invite: true },
    platform: "shared",
  }),
  defineGame({
    id: "no-thanks",
    icon: "🙅",
    title: "No Thanks!",
    description: "카드를 거절하려면 칩을 내고, 가져오면 쌓인 칩을 받으며 가장 낮은 점수를 겨루는 카드 게임이에요.",
    href: "./games/no-thanks/",
    buttonText: "No Thanks! 시작",
    capabilities: {},
    platform: "shared",
  }),
  defineGame({
    id: "signal-room",
    icon: "⚡",
    title: "Signal Room",
    description: "4명의 러너가 신호 패드를 동기화하고 스캐너를 피해 함께 탈출하는 탑다운 협동 프로토타입이에요.",
    href: "./games/signal-room/",
    buttonText: "Signal Room 실험",
    capabilities: { local: true },
    platform: "shared",
  }),
]);

export function listRegisteredGames() {
  return [...GAME_REGISTRY];
}

export function getRegisteredGame(gameId) {
  return GAME_REGISTRY.find((game) => game.id === gameId) ?? null;
}
