import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { GAME_REGISTRY } from "../games/shared/registry.js";

import {
  platformGameIdFromPath,
  validatePullRequestChanges,
  validateRepositoryState,
} from "../scripts/check-game-platform-governance.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function game({
  id,
  href = `./games/${id}/`,
  online = true,
  platform = "shared",
} = {}) {
  return { id, href, platform, capabilities: { online } };
}

function gameSpecDocument() {
  return [
    "## Game Overview",
    "## Rules and Sources",
    "## Product Scope",
    "## State Machine",
    "## Domain Model",
    "## Platform Boundary",
    "## Authority and Persistence",
    "## UI / UX Direction",
    "## Implementation Plan",
    "## Validation Plan",
    "## Open Questions / Deferred",
  ].join("\n");
}

function developmentDocument() {
  return [
    "## Current Status",
    "Phase: Phase 4",
    "Status: IN_PROGRESS",
    "Active branch: feature/game-platform-phase4-cant-stop-bootstrap",
    "## Completed",
    "## Current Work",
    "## Next Work",
    "## Decisions",
    "## Validation",
    "## Known Issues / Deferred",
  ].join("\n");
}

function releasedDevelopmentDocument({
  activeBranch = "main",
  includeRelease = true,
} = {}) {
  return [
    "## Current Status",
    "Phase: Phase 4",
    "Status: RELEASED",
    `Active branch: ${activeBranch}`,
    "## Completed",
    "## Current Work",
    "## Next Work",
    "## Decisions",
    "## Validation",
    "## Known Issues / Deferred",
    ...(includeRelease ? ["## Release — 2026-09-21"] : []),
  ].join("\n");
}

test("platform game path extraction excludes shared infrastructure", () => {
  assert.equal(platformGameIdFromPath("games/cant-stop/index.html"), "cant-stop");
  assert.equal(platformGameIdFromPath("games/shared/registry.js"), null);
  assert.equal(platformGameIdFromPath("liar-game/index.html"), null);
});

test("repository state allows a documentation-only bootstrap game before Registry registration", () => {
  assert.deepEqual(validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [],
    dbTestFiles: [],
    gameFiles: { "cant-stop": ["DEVELOPMENT.md", "GAME_SPEC.md"] },
    gameSpecDocuments: { "cant-stop": gameSpecDocument() },
    developmentDocuments: { "cant-stop": developmentDocument() },
  }), []);
});

test("repository state requires Registry registration once a platform game has runtime files", () => {
  const errors = validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [],
    dbTestFiles: [],
    gameFiles: { "cant-stop": ["DEVELOPMENT.md", "GAME_SPEC.md", "index.html"] },
    gameSpecDocuments: { "cant-stop": gameSpecDocument() },
    developmentDocuments: { "cant-stop": developmentDocument() },
  });
  assert.match(errors.join("\n"), /runtime files but is missing a shared Game Registry entry/u);
});

test("repository state requires a game specification for each platform game", () => {
  const missing = validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop", online: false })],
    dbTestFiles: [],
    gameFiles: { "cant-stop": ["DEVELOPMENT.md", "index.html"] },
    developmentDocuments: { "cant-stop": developmentDocument() },
  });
  assert.match(missing.join("\n"), /requires games\/cant-stop\/GAME_SPEC\.md/u);

  const incomplete = validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop", online: false })],
    dbTestFiles: [],
    gameFiles: { "cant-stop": ["DEVELOPMENT.md", "GAME_SPEC.md", "index.html"] },
    gameSpecDocuments: { "cant-stop": "## Game Overview" },
    developmentDocuments: { "cant-stop": developmentDocument() },
  });
  assert.match(incomplete.join("\n"), /GAME_SPEC\.md is missing required section/u);
});

test("repository state requires a development handoff document for each platform game", () => {
  const missing = validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop", online: false })],
    dbTestFiles: [],
    gameFiles: { "cant-stop": ["GAME_SPEC.md", "index.html"] },
    gameSpecDocuments: { "cant-stop": gameSpecDocument() },
  });
  assert.match(missing.join("\n"), /requires games\/cant-stop\/DEVELOPMENT\.md/u);

  const incomplete = validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop", online: false })],
    dbTestFiles: [],
    gameFiles: { "cant-stop": ["DEVELOPMENT.md", "GAME_SPEC.md", "index.html"] },
    gameSpecDocuments: { "cant-stop": gameSpecDocument() },
    developmentDocuments: { "cant-stop": "## Current Status" },
  });
  assert.match(incomplete.join("\n"), /missing required section/u);

  assert.deepEqual(validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop", online: false })],
    dbTestFiles: [],
    gameFiles: { "cant-stop": ["DEVELOPMENT.md", "GAME_SPEC.md", "index.html"] },
    gameSpecDocuments: { "cant-stop": gameSpecDocument() },
    developmentDocuments: { "cant-stop": developmentDocument() },
  }), []);
});

test("released platform games must point DEVELOPMENT.md at main and record release closeout", () => {
  const base = {
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop", online: false })],
    dbTestFiles: [],
    gameFiles: { "cant-stop": ["DEVELOPMENT.md", "GAME_SPEC.md", "index.html"] },
    gameSpecDocuments: { "cant-stop": gameSpecDocument() },
  };

  const staleBranch = validateRepositoryState({
    ...base,
    developmentDocuments: {
      "cant-stop": releasedDevelopmentDocument({ activeBranch: "feature/cant-stop-release" }),
    },
  });
  assert.match(staleBranch.join("\n"), /must set Active branch: main/u);

  const missingRelease = validateRepositoryState({
    ...base,
    developmentDocuments: {
      "cant-stop": `${releasedDevelopmentDocument({ includeRelease: false })}\n## Release Baseline`,
    },
  });
  assert.match(missingRelease.join("\n"), /must record a dated ## Release/u);

  assert.deepEqual(validateRepositoryState({
    ...base,
    developmentDocuments: { "cant-stop": releasedDevelopmentDocument() },
  }), []);
});

test("repository state requires online shared games to provide a DB contract test", () => {
  const errors = validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop" })],
    dbTestFiles: [],
    gameFiles: { "cant-stop": ["DEVELOPMENT.md", "GAME_SPEC.md", "index.html"] },
    gameSpecDocuments: { "cant-stop": gameSpecDocument() },
    developmentDocuments: { "cant-stop": developmentDocument() },
  });
  assert.match(errors.join("\n"), /cant-stop\.test\.js/u);

  assert.deepEqual(validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop" })],
    dbTestFiles: ["cant-stop.test.js"],
    gameFiles: { "cant-stop": ["DEVELOPMENT.md", "GAME_SPEC.md", "index.html"] },
    gameSpecDocuments: { "cant-stop": gameSpecDocument() },
    developmentDocuments: { "cant-stop": developmentDocument() },
  }), []);
});

test("repository state rejects shared registry entries without matching game directories", () => {
  const errors = validateRepositoryState({
    gameDirectories: [],
    registry: [game({ id: "cant-stop" })],
    dbTestFiles: ["cant-stop.test.js"],
    developmentDocuments: { "cant-stop": developmentDocument() },
  });
  assert.match(errors.join("\n"), /has no games\/cant-stop\/ directory/u);
});

test("document authority links are enforced only when the rulebook exists", () => {
  const withoutRulebook = validateRepositoryState({
    gameDirectories: [],
    registry: [],
    dbTestFiles: [],
    documents: { "AGENTS.md": "" },
  });
  assert.deepEqual(withoutRulebook, []);

  const errors = validateRepositoryState({
    gameDirectories: [],
    registry: [],
    dbTestFiles: [],
    documents: {
      "docs/game-platform-development-rules.md": "rules",
      "AGENTS.md": "rules",
      "games/README.md": "rules",
      "docs/game-platform-strategy.md": "rules",
      "docs/game-platform-invite-analysis.md": "rules",
    },
  });
  assert.equal(errors.length, 4);
});

test("pull request guard blocks Legacy and Game Platform runtime changes in the same PR", () => {
  const errors = validatePullRequestChanges({
    changedFiles: [
      { status: "M", path: "games/cant-stop/js/game.js" },
      { status: "M", path: "the-game/js/game.js" },
    ],
  });
  assert.match(errors.join("\n"), /Do not mix Legacy runtime changes/u);
});

test("pull request guard allows bootstrap documents without Registry and requires Registry for runtime", () => {
  assert.deepEqual(validatePullRequestChanges({
    changedFiles: [
      { status: "A", path: "games/cant-stop/GAME_SPEC.md" },
      { status: "A", path: "games/cant-stop/DEVELOPMENT.md" },
    ],
    baseGameDirectories: [],
    headGameDirectories: ["cant-stop"],
  }), []);

  const errors = validatePullRequestChanges({
    changedFiles: [
      { status: "A", path: "games/cant-stop/GAME_SPEC.md" },
      { status: "A", path: "games/cant-stop/DEVELOPMENT.md" },
      { status: "A", path: "games/cant-stop/index.html" },
    ],
    baseGameDirectories: [],
    headGameDirectories: ["cant-stop"],
  });
  assert.match(errors.join("\n"), /require a Game Registry change/u);

  assert.deepEqual(validatePullRequestChanges({
    changedFiles: [
      { status: "A", path: "games/cant-stop/GAME_SPEC.md" },
      { status: "A", path: "games/cant-stop/DEVELOPMENT.md" },
      { status: "A", path: "games/cant-stop/index.html" },
      { status: "M", path: "games/shared/registry.js" },
    ],
    baseGameDirectories: [],
    headGameDirectories: ["cant-stop"],
  }), []);
});

test("new shared modules require contract test and platform documentation changes", () => {
  const baseChanges = [{ status: "A", path: "games/shared/presence.js" }];
  const errors = validatePullRequestChanges({ changedFiles: baseChanges });
  assert.match(errors.join("\n"), /contract test change/u);
  assert.match(errors.join("\n"), /documentation change/u);

  assert.deepEqual(validatePullRequestChanges({
    changedFiles: [
      ...baseChanges,
      { status: "M", path: "tests/game-platform-contracts.test.js" },
      { status: "M", path: "docs/game-platform-development-rules.md" },
    ],
  }), []);
});


test("Game Platform rules prohibit game-local nickname editing", () => {
  const rules = readFileSync(
    path.join(repositoryRoot, "docs", "game-platform-development-rules.md"),
    "utf8",
  );

  assert.match(rules, /게임별 entry\/lobby 화면에 닉네임 입력, 임시 닉네임, 게임별 닉네임 변경 UI를 제공하지 않는다/u);
  assert.match(rules, /프로필의 닉네임을 직접 조회/u);
});

test("Game Platform rules separate Legacy protection from growing Registry entries", () => {
  const rules = readFileSync(
    path.join(repositoryRoot, "docs", "game-platform-development-rules.md"),
    "utf8",
  );

  assert.match(rules, /Legacy 보호 테스트는 보호 대상 Legacy 게임의 존재와 핵심 계약/u);
  assert.match(rules, /Registry의 전체 게임 개수나 전체 ID 목록을 고정하지 않는다/u);
  assert.match(rules, /개별 platform-native 게임의 Registry 설정과 capability/u);
});

test("current Game Platform rule documents remain platform-native game-agnostic", () => {
  const rulePaths = [
    path.join(repositoryRoot, "docs", "game-platform-development-rules.md"),
    path.join(repositoryRoot, "docs", "game-platform-db-test-contract.md"),
    path.join(repositoryRoot, "games", "README.md"),
    path.join(repositoryRoot, "games", "GAME_SPEC_TEMPLATE.md"),
    path.join(repositoryRoot, "games", "DEVELOPMENT_TEMPLATE.md"),
  ];
  const platformNativeGames = GAME_REGISTRY.filter((game) => game.platform === "shared");

  for (const filename of rulePaths) {
    const content = readFileSync(filename, "utf8");
    const normalizedContent = content.toLocaleLowerCase("en-US");
    for (const game of platformNativeGames) {
      assert.equal(normalizedContent.includes(game.id.toLocaleLowerCase("en-US")), false);
      assert.equal(normalizedContent.includes(game.title.toLocaleLowerCase("en-US")), false);
    }
  }
});
test("Game Platform rules codify release closeout and post-release feedback loop", () => {
  const rules = readFileSync(
    path.join(repositoryRoot, "docs", "game-platform-development-rules.md"),
    "utf8",
  );

  assert.match(rules, /Status: RELEASED/u);
  assert.match(rules, /Active branch: main/u);
  assert.match(rules, /출시 후 플랫폼 피드백 루프/u);
  assert.match(rules, /모든 신규 게임 release 뒤 플랫폼 회고/u);
  assert.match(rules, /게임 수가 늘어도 구조 이해 비용과 신규 개발 시간이 비례해서 증가하지 않도록/u);
  assert.match(rules, /SHARED \/ GAME-LOCAL \/ RELEASE-OPERATIONS/u);
});
