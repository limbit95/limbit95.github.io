import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  platformGameIdFromPath,
  validatePlatformDocumentPolicy,
  validatePullRequestChanges,
  validateRepositoryState,
} from "../scripts/check-game-platform-governance.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function game({
  id,
  title = "Sample Game",
  href = `./games/${id}/`,
  online = true,
  platform = "shared",
} = {}) {
  return { id, title, href, platform, capabilities: { online } };
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
    "UI_DESIGN.md",
    "UI_DECISIONS.md",
    "DEVELOPMENT.md",
  ].join("\n");
}

function uiDesignDocument() {
  return [
    "## Design Research",
    "## Copyright / Asset Usage",
    "## Visual Identity",
    "## Page Identity",
    "## Lobby / Setup Design",
    "## Gameplay Layout",
    "## Components",
    "## Motion / Interaction",
    "## Result / Rematch Presentation",
    "## Responsive Strategy",
    "## Implementation Plan",
    "## Validation Checklist",
    "## Open Questions / Deferred",
    "GAME_SPEC.md",
    "UI_DECISIONS.md",
    "DEVELOPMENT.md",
  ].join("\n");
}

function uiDecisionDocument() {
  return [
    "## Current Design Track",
    "## Decision Log",
    "## Superseded / Rejected",
    "## Validation History",
    "## Open Follow-up",
    "GAME_SPEC.md",
    "DEVELOPMENT.md",
    "UI_DESIGN.md",
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
    "GAME_SPEC.md",
    "UI_DESIGN.md",
    "UI_DECISIONS.md",
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
    "GAME_SPEC.md",
    "UI_DESIGN.md",
    "UI_DECISIONS.md",
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
      "docs/game-platform-development-rules.md": "rules\n체크포인트 기록하자",
      "AGENTS.md": "rules\n체크포인트 기록하자",
      "games/README.md": "rules\n체크포인트 기록하자",
      "docs/game-platform-strategy.md": "rules",
      "docs/game-platform-invite-analysis.md": "rules",
    },
  });
  assert.equal(errors.length, 4);
});

test("platform checkpoint command stays consistent across command entrypoints", () => {
  const command = "체크포인트 기록하자";

  assert.deepEqual(validatePlatformDocumentPolicy({
    registry: [],
    documents: {
      "docs/game-platform-development-rules.md": [
        "> **문서 분류:** CURRENT",
        command,
      ].join("\n"),
      "AGENTS.md": command,
      "games/README.md": command,
    },
  }), []);

  const missingCommand = validatePlatformDocumentPolicy({
    registry: [],
    documents: {
      "docs/game-platform-development-rules.md": [
        "> **문서 분류:** CURRENT",
        command,
      ].join("\n"),
      "AGENTS.md": command,
      "games/README.md": "일반적인 진행상황 정리 요청",
    },
  });
  assert.equal(missingCommand.length, 1);
  assert.match(missingCommand[0], /games\/README\.md must identify the Game Platform DEVELOPMENT\.md checkpoint command/u);

});

test("platform entrypoints preserve the manual UI decision review lifecycle", () => {
  const checkpoint = "체크포인트 기록하자";
  const lifecycle = "UI_DECISIONS.md Developer Manual Design Review";

  const documents = {
    "docs/game-platform-development-rules.md": [
      "> **문서 분류:** CURRENT",
      "docs/game-platform-ui-rules.md",
      checkpoint,
      lifecycle,
    ].join("\n"),
    "docs/game-platform-ui-rules.md": [
      "> **문서 분류:** CURRENT",
      "docs/game-platform-development-rules.md",
      lifecycle,
    ].join("\n"),
    "AGENTS.md": [checkpoint, "UI_DECISIONS.md", "수동 브라우저"].join("\n"),
    "games/README.md": [checkpoint, "UI_DECISIONS.md", "수동 브라우저"].join("\n"),
  };

  assert.deepEqual(validatePlatformDocumentPolicy({ registry: [], documents }), []);

  const missingManualReview = validatePlatformDocumentPolicy({
    registry: [],
    documents: {
      ...documents,
      "AGENTS.md": [checkpoint, "UI_DECISIONS.md"].join("\n"),
    },
  });
  assert.equal(missingManualReview.length, 1);
  assert.match(missingManualReview[0], /manual-browser design review lifecycle/u);
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
      { status: "A", path: "games/cant-stop/UI_DESIGN.md" },
      { status: "A", path: "games/cant-stop/UI_DECISIONS.md" },
    ],
    baseGameDirectories: [],
    headGameDirectories: ["cant-stop"],
  }), []);

  const errors = validatePullRequestChanges({
    changedFiles: [
      { status: "A", path: "games/cant-stop/GAME_SPEC.md" },
      { status: "A", path: "games/cant-stop/DEVELOPMENT.md" },
      { status: "A", path: "games/cant-stop/UI_DESIGN.md" },
      { status: "A", path: "games/cant-stop/UI_DECISIONS.md" },
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
      { status: "A", path: "games/cant-stop/UI_DESIGN.md" },
      { status: "A", path: "games/cant-stop/UI_DECISIONS.md" },
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

test("platform document policy rejects platform-native game guidance in any current common document", () => {
  const registry = [game({ id: "sample-game", title: "Sample Game", online: false })];
  const errors = validatePlatformDocumentPolicy({
    registry,
    documents: {
      "docs/game-platform-ui-rules.md": [
        "> **문서 분류:** CURRENT",
        "현재 실행 규칙: docs/game-platform-development-rules.md",
        "sample-game 전용 구현을 모든 신규 게임의 기준으로 사용한다.",
      ].join("\n"),
      "games/NEW_GAME_GUIDE.md": "Sample Game 구현을 공통 기준으로 사용한다.",
    },
  });

  assert.equal(errors.length, 2);
  assert.match(errors.join("\n"), /game-platform-ui-rules\.md must stay game-agnostic/u);
  assert.match(errors.join("\n"), /games\/NEW_GAME_GUIDE\.md must stay game-agnostic/u);
});

test("platform document policy requires explicit classification and isolates historical documents", () => {
  const registry = [game({ id: "sample-game", title: "Sample Game", online: false })];

  const missingClassification = validatePlatformDocumentPolicy({
    registry,
    documents: {
      "docs/game-platform-future-guide.md": "공통 규칙",
    },
  });
  assert.match(missingClassification.join("\n"), /must declare .*CURRENT or HISTORY/u);

  const missingRulebookLink = validatePlatformDocumentPolicy({
    registry,
    documents: {
      "docs/game-platform-release-history.md": [
        "> **문서 분류:** HISTORY",
        "Sample Game 당시 구현 기록",
      ].join("\n"),
    },
  });
  assert.match(missingRulebookLink.join("\n"), /must identify docs\/game-platform-development-rules\.md/u);

  assert.deepEqual(validatePlatformDocumentPolicy({
    registry,
    documents: {
      "docs/game-platform-release-history.md": [
        "> **문서 분류:** HISTORY",
        "현재 실행 규칙: docs/game-platform-development-rules.md",
        "Sample Game 당시 구현 기록",
      ].join("\n"),
    },
  }), []);
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


test("repository state requires UI_DESIGN and UI_DECISIONS with required sections when the UI rulebook exists", () => {
  const documents = {
    "docs/game-platform-development-rules.md": "docs/game-platform-ui-rules.md",
    "docs/game-platform-ui-rules.md": "docs/game-platform-development-rules.md",
    "AGENTS.md": "docs/game-platform-development-rules.md docs/game-platform-ui-rules.md",
    "games/README.md": "docs/game-platform-development-rules.md docs/game-platform-ui-rules.md",
    "games/GAME_SPEC_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "games/DEVELOPMENT_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "games/UI_DESIGN_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "games/UI_DECISIONS_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "docs/game-platform-strategy.md": "docs/game-platform-development-rules.md",
    "docs/game-platform-invite-analysis.md": "docs/game-platform-development-rules.md",
  };
  const base = {
    gameDirectories: ["sample-game"],
    registry: [],
    dbTestFiles: [],
    gameFiles: {
      "sample-game": ["DEVELOPMENT.md", "GAME_SPEC.md", "UI_DESIGN.md", "UI_DECISIONS.md"],
    },
    gameSpecDocuments: { "sample-game": gameSpecDocument() },
    uiDecisionDocuments: { "sample-game": uiDecisionDocument() },
    developmentDocuments: { "sample-game": developmentDocument() },
    documents,
  };

  const missing = validateRepositoryState({
    ...base,
    uiDesignDocuments: {},
  });
  assert.match(missing.join("\n"), /requires games\/sample-game\/UI_DESIGN\.md/u);

  const incomplete = validateRepositoryState({
    ...base,
    uiDesignDocuments: { "sample-game": "## Design Research" },
  });
  assert.match(incomplete.join("\n"), /UI_DESIGN\.md is missing required section/u);

  const missingDecisions = validateRepositoryState({
    ...base,
    uiDesignDocuments: { "sample-game": uiDesignDocument() },
    uiDecisionDocuments: {},
  });
  assert.match(missingDecisions.join("\n"), /requires games\/sample-game\/UI_DECISIONS\.md/u);

  const incompleteDecisions = validateRepositoryState({
    ...base,
    uiDesignDocuments: { "sample-game": uiDesignDocument() },
    uiDecisionDocuments: { "sample-game": "## Decision Log" },
  });
  assert.match(incompleteDecisions.join("\n"), /UI_DECISIONS\.md is missing required section/u);

  assert.deepEqual(validateRepositoryState({
    ...base,
    uiDesignDocuments: { "sample-game": uiDesignDocument() },
    uiDecisionDocuments: { "sample-game": uiDecisionDocument() },
  }), []);
});

test("UI rulebook authority links are enforced across game entry documents and templates", () => {
  const documents = {
    "docs/game-platform-development-rules.md": "docs/game-platform-ui-rules.md",
    "docs/game-platform-ui-rules.md": "docs/game-platform-development-rules.md",
    "AGENTS.md": "docs/game-platform-development-rules.md docs/game-platform-ui-rules.md",
    "games/README.md": "docs/game-platform-development-rules.md docs/game-platform-ui-rules.md",
    "games/GAME_SPEC_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "games/DEVELOPMENT_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "games/UI_DESIGN_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "games/UI_DECISIONS_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "docs/game-platform-strategy.md": "docs/game-platform-development-rules.md",
    "docs/game-platform-invite-analysis.md": "docs/game-platform-development-rules.md",
  };

  assert.deepEqual(validateRepositoryState({
    gameDirectories: [],
    registry: [],
    dbTestFiles: [],
    documents,
  }), []);

  const broken = validateRepositoryState({
    gameDirectories: [],
    registry: [],
    dbTestFiles: [],
    documents: {
      ...documents,
      "games/GAME_SPEC_TEMPLATE.md": "missing ui rulebook link",
    },
  });
  assert.match(
    broken.join("\n"),
    /games\/GAME_SPEC_TEMPLATE\.md must identify docs\/game-platform-ui-rules\.md/u,
  );
});

test("Game Platform rules require multiplayer rematch without prematurely forcing a shared RPC shape", () => {
  const rules = readFileSync(
    path.join(repositoryRoot, "docs", "game-platform-development-rules.md"),
    "utf8",
  );

  assert.match(rules, /모든 멀티플레이 platform-native 게임/u);
  assert.match(rules, /기존 room \/ active player identity/u);
  assert.match(rules, /참여 플레이어가 준비 완료/u);
  assert.match(rules, /방장이 게임 시작/u);
  assert.match(rules, /동일한 RPC 이름/u);
});

test("UI rulebook treats UI_DESIGN as pre-development baseline and UI_DECISIONS as later overrides", () => {
  const uiRules = readFileSync(
    path.join(repositoryRoot, "docs", "game-platform-ui-rules.md"),
    "utf8",
  );

  assert.match(uiRules, /신규 게임 개발 전 UI 조사/u);
  assert.match(uiRules, /독립적인 디지털 공간/u);
  assert.match(uiRules, /games\/<game-id>\/UI_DESIGN\.md/u);
  assert.match(uiRules, /games\/<game-id>\/UI_DECISIONS\.md/u);
  assert.match(uiRules, /저작권·상표·라이선스/u);
  assert.match(uiRules, /최신 non-superseded `UI_DECISIONS\.md` 결정이 우선/u);
  assert.match(uiRules, /effective design/u);
  assert.match(uiRules, /후속 변경을 되돌리는 근거로 사용할 수 없다/u);
});


test("UI phase continuation cannot revert later user design decisions", () => {
  const uiRules = readFileSync(
    path.join(repositoryRoot, "docs", "game-platform-ui-rules.md"),
    "utf8",
  );
  const developmentRules = readFileSync(
    path.join(repositoryRoot, "docs", "game-platform-development-rules.md"),
    "utf8",
  );
  const decisionsTemplate = readFileSync(
    path.join(repositoryRoot, "games", "UI_DECISIONS_TEMPLATE.md"),
    "utf8",
  );

  assert.match(uiRules, /Phase를 이어갈 때 디자인 회귀 방지/u);
  assert.match(uiRules, /디자인 개발 lifecycle과 UI_DECISIONS 기록 타이밍/u);
  assert.match(uiRules, /Developer Manual Design Review \/ Detail Polish/u);
  assert.match(uiRules, /하나의 디자인 영역이 안정화/u);
  assert.match(uiRules, /디자인 작업 PR을 merge\/close하거나 작업 브랜치를 종료하기 전/u);
  assert.match(uiRules, /초기 Phase 문구와 최신 유효 결정이 충돌하면 최신 `UI_DECISIONS\.md`를 적용/u);
  assert.match(uiRules, /과거 설계안으로 원복/u);
  assert.match(developmentRules, /기능 완료 이후 디자인 수동 리뷰 gate/u);
  assert.match(developmentRules, /기능 개발의 완료 상태와 디자인 polish 완료 상태를 같은 것으로 취급하지 않는다/u);
  assert.match(developmentRules, /이미 반영된 사용자 디자인 수정을 회귀시키지 않는다/u);
  assert.match(developmentRules, /UI_DESIGN\.md.*baseline.*UI_DECISIONS\.md.*최신 non-superseded/su);
  assert.match(decisionsTemplate, /Lifecycle stage:/u);
  assert.match(decisionsTemplate, /## Recording Timing/u);
  assert.match(decisionsTemplate, /developer manual browser review/u);
  assert.match(decisionsTemplate, /Decision ID:/u);
  assert.match(decisionsTemplate, /Supersedes:/u);
  assert.match(decisionsTemplate, /UI_DESIGN\.md \+ UI_DECISIONS\.md overrides/u);
});

test("actual game platform entry docs route work through developer manual design review", () => {
  const agents = readFileSync(path.join(repositoryRoot, "AGENTS.md"), "utf8");
  const readme = readFileSync(path.join(repositoryRoot, "games", "README.md"), "utf8");

  assert.match(agents, /Developer Manual Design Review \/ Detail Polish/u);
  assert.match(agents, /디자인 PR merge\/close, 작업 브랜치 종료, release closeout 전/u);
  assert.match(readme, /Developer Manual Design Review \/ Detail Polish/u);
  assert.match(readme, /최초 `UI_DESIGN\.md`를 계획대로 구현한 사실 자체는 `UI_DECISIONS\.md`에 중복 기록하지 않는다/u);
});

test("development handoff stays functional while UI decisions track design progress", () => {
  const rules = readFileSync(
    path.join(repositoryRoot, "docs", "game-platform-development-rules.md"),
    "utf8",
  );
  const template = readFileSync(
    path.join(repositoryRoot, "games", "DEVELOPMENT_TEMPLATE.md"),
    "utf8",
  );

  assert.match(rules, /DEVELOPMENT\.md.*현재 기능 개발 상태/us);
  assert.match(rules, /UI_DECISIONS\.md.*디자인 개발 진행/su);
  assert.match(rules, /UI_DESIGN\.md.*Validation Checklist/u);
  assert.match(template, /Design track reference:/u);
  assert.match(template, /UI_DECISIONS\.md/u);
  assert.doesNotMatch(template, /UI \/ presentation:/u);
});


test("game-local documents must cross-reference the other design and handoff documents", () => {
  const documents = {
    "docs/game-platform-development-rules.md": "docs/game-platform-ui-rules.md",
    "docs/game-platform-ui-rules.md": "docs/game-platform-development-rules.md",
    "AGENTS.md": "docs/game-platform-development-rules.md docs/game-platform-ui-rules.md",
    "games/README.md": "docs/game-platform-development-rules.md docs/game-platform-ui-rules.md",
    "games/GAME_SPEC_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "games/DEVELOPMENT_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "games/UI_DESIGN_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "games/UI_DECISIONS_TEMPLATE.md": "docs/game-platform-ui-rules.md",
    "docs/game-platform-strategy.md": "docs/game-platform-development-rules.md",
    "docs/game-platform-invite-analysis.md": "docs/game-platform-development-rules.md",
  };
  const base = {
    gameDirectories: ["sample-game"],
    registry: [],
    dbTestFiles: [],
    gameFiles: {
      "sample-game": ["DEVELOPMENT.md", "GAME_SPEC.md", "UI_DESIGN.md", "UI_DECISIONS.md"],
    },
    gameSpecDocuments: { "sample-game": gameSpecDocument() },
    uiDesignDocuments: { "sample-game": uiDesignDocument() },
    uiDecisionDocuments: { "sample-game": uiDecisionDocument() },
    developmentDocuments: { "sample-game": developmentDocument() },
    documents,
  };

  assert.deepEqual(validateRepositoryState(base), []);

  const brokenSpec = validateRepositoryState({
    ...base,
    gameSpecDocuments: {
      "sample-game": gameSpecDocument().replace("UI_DESIGN.md", ""),
    },
  });
  assert.match(brokenSpec.join("\n"), /GAME_SPEC\.md must reference UI_DESIGN\.md/u);

  const brokenUi = validateRepositoryState({
    ...base,
    uiDesignDocuments: {
      "sample-game": uiDesignDocument().replace("DEVELOPMENT.md", ""),
    },
  });
  assert.match(brokenUi.join("\n"), /UI_DESIGN\.md must reference DEVELOPMENT\.md/u);

  const brokenDevelopment = validateRepositoryState({
    ...base,
    developmentDocuments: {
      "sample-game": developmentDocument().replace("GAME_SPEC.md", ""),
    },
  });
  assert.match(brokenDevelopment.join("\n"), /DEVELOPMENT\.md must reference GAME_SPEC\.md/u);

  const brokenDecisions = validateRepositoryState({
    ...base,
    uiDecisionDocuments: {
      "sample-game": uiDecisionDocument().replace("UI_DESIGN.md", ""),
    },
  });
  assert.match(brokenDecisions.join("\n"), /UI_DECISIONS\.md must reference UI_DESIGN\.md/u);
});

test("platform rules define document authority and current-game impact auditing", () => {
  const rules = readFileSync(
    path.join(repositoryRoot, "docs", "game-platform-development-rules.md"),
    "utf8",
  );

  assert.match(rules, /게임별 네 문서의 권위와 충돌 해결/u);
  assert.match(rules, /GAME_SPEC\.md.*기능 lifecycle/su);
  assert.match(rules, /DEVELOPMENT\.md.*기능 구현.*현재 Phase/su);
  assert.match(rules, /UI_DESIGN\.md.*presentation/su);
  assert.match(rules, /UI_DECISIONS\.md.*디자인 개발 진행/su);
  assert.match(rules, /COMPLIANT/u);
  assert.match(rules, /MIGRATION_REQUIRED/u);
  assert.match(rules, /NOT_APPLICABLE/u);
  assert.match(rules, /IN_PROGRESS.*release 전에/su);
});

test("UI research records source, observation, and implementation decision", () => {
  const uiRules = readFileSync(
    path.join(repositoryRoot, "docs", "game-platform-ui-rules.md"),
    "utf8",
  );
  const template = readFileSync(
    path.join(repositoryRoot, "games", "UI_DESIGN_TEMPLATE.md"),
    "utf8",
  );

  assert.match(uiRules, /출처 → 관찰한 디자인 요소 → 구현 결정/u);
  assert.match(uiRules, /visual reference를 직접 확인/u);
  assert.match(template, /Source → Observation → Decision/u);
});
