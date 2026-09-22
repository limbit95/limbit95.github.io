const GAME_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

export const PLATFORM_GAME_DB_SCENARIOS = Object.freeze([
  Object.freeze({
    id: "anonymous_entry_denied",
    title: "anonymous callers cannot enter protected game sessions",
  }),
  Object.freeze({
    id: "unapproved_entry_denied",
    title: "unapproved members cannot enter protected game sessions",
  }),
  Object.freeze({
    id: "approved_entry_allowed",
    title: "approved members can enter permitted game sessions",
  }),
  Object.freeze({
    id: "non_member_snapshot_denied",
    title: "non-members cannot read protected session snapshots",
  }),
  Object.freeze({
    id: "start_authorization_enforced",
    title: "game start conditions and authorization are enforced server-side",
  }),
  Object.freeze({
    id: "stale_version_rejected",
    title: "stale expected versions are rejected",
  }),
  Object.freeze({
    id: "duplicate_action_safe",
    title: "duplicate client actions are idempotent or safely rejected",
  }),
  Object.freeze({
    id: "concurrent_action_single_commit",
    title: "concurrent conflicting actions produce a single authoritative commit",
  }),
  Object.freeze({
    id: "reconnect_snapshot_authoritative",
    title: "reconnect restores the authoritative snapshot",
  }),
  Object.freeze({
    id: "rematch_lifecycle_authoritative",
    title: "rematch preserves participant context and authoritative restart conditions",
  }),
  Object.freeze({
    id: "private_state_not_exposed",
    title: "room snapshots do not expose another player private state",
  }),
]);

function nonEmptyText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`Platform game DB contract requires a non-empty ${field}.`);
  }
  return value.trim();
}

function requireFunction(value, field) {
  if (typeof value !== "function") {
    throw new TypeError(`Platform game DB contract requires ${field}().`);
  }
  return value;
}

export function definePlatformGameDbContract({
  gameId,
  createContext,
  destroyContext = async () => {},
  scenarios,
}) {
  const normalizedGameId = nonEmptyText(gameId, "gameId");
  if (!GAME_ID_PATTERN.test(normalizedGameId)) {
    throw new TypeError("Platform game DB contract gameId must be a lowercase kebab-case slug.");
  }

  if (!scenarios || typeof scenarios !== "object" || Array.isArray(scenarios)) {
    throw new TypeError("Platform game DB contract requires a scenarios object.");
  }

  const normalizedScenarios = {};
  for (const scenario of PLATFORM_GAME_DB_SCENARIOS) {
    normalizedScenarios[scenario.id] = requireFunction(
      scenarios[scenario.id],
      `scenarios.${scenario.id}`,
    );
  }

  return Object.freeze({
    gameId: normalizedGameId,
    createContext: requireFunction(createContext, "createContext"),
    destroyContext: requireFunction(destroyContext, "destroyContext"),
    scenarios: Object.freeze(normalizedScenarios),
  });
}

export function registerPlatformGameDbContract(
  contract,
  {
    before,
    after,
    test,
  },
) {
  const normalized = definePlatformGameDbContract(contract);
  const beforeHook = requireFunction(before, "before");
  const afterHook = requireFunction(after, "after");
  const testHook = requireFunction(test, "test");

  let context;

  beforeHook(async () => {
    context = await normalized.createContext();
  });

  afterHook(async () => {
    await normalized.destroyContext(context);
  });

  for (const scenario of PLATFORM_GAME_DB_SCENARIOS) {
    testHook(
      `${normalized.gameId}: ${scenario.title}`,
      async () => normalized.scenarios[scenario.id](context),
    );
  }

  return normalized;
}