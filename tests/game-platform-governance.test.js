import assert from "node:assert/strict";
import { test } from "node:test";

import {
  platformGameIdFromPath,
  validatePullRequestChanges,
  validateRepositoryState,
} from "../scripts/check-game-platform-governance.mjs";

function game({
  id,
  href = `./games/${id}/`,
  online = true,
  platform = "shared",
} = {}) {
  return { id, href, platform, capabilities: { online } };
}

function developmentDocument() {
  return [
    "## Current Status",
    "Phase: Phase 4A",
    "Status: IN_PROGRESS",
    "Active branch: feature/game-platform-phase4a-cant-stop-foundation",
    "## Completed",
    "## Current Work",
    "## Next Work",
    "## Decisions",
    "## Validation",
    "## Known Issues / Deferred",
  ].join("\n");
}

test("platform game path extraction excludes shared infrastructure", () => {
  assert.equal(platformGameIdFromPath("games/cant-stop/index.html"), "cant-stop");
  assert.equal(platformGameIdFromPath("games/shared/registry.js"), null);
  assert.equal(platformGameIdFromPath("liar-game/index.html"), null);
});

test("repository state requires each platform game directory to be registered", () => {
  const errors = validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [],
    dbTestFiles: [],
  });
  assert.match(errors.join("\n"), /missing a shared Game Registry entry/u);
});

test("repository state requires a development handoff document for each platform game", () => {
  const missing = validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop", online: false })],
    dbTestFiles: [],
  });
  assert.match(missing.join("\n"), /requires games\/cant-stop\/DEVELOPMENT\.md/u);

  const incomplete = validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop", online: false })],
    dbTestFiles: [],
    developmentDocuments: { "cant-stop": "## Current Status" },
  });
  assert.match(incomplete.join("\n"), /missing required section/u);

  assert.deepEqual(validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop", online: false })],
    dbTestFiles: [],
    developmentDocuments: { "cant-stop": developmentDocument() },
  }), []);
});

test("repository state requires online shared games to provide a DB contract test", () => {
  const errors = validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop" })],
    dbTestFiles: [],
    developmentDocuments: { "cant-stop": developmentDocument() },
  });
  assert.match(errors.join("\n"), /cant-stop\.test\.js/u);

  assert.deepEqual(validateRepositoryState({
    gameDirectories: ["cant-stop"],
    registry: [game({ id: "cant-stop" })],
    dbTestFiles: ["cant-stop.test.js"],
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

test("pull request guard requires Registry update when a new platform game directory appears", () => {
  const errors = validatePullRequestChanges({
    changedFiles: [{ status: "A", path: "games/cant-stop/index.html" }],
    baseGameDirectories: [],
    headGameDirectories: ["cant-stop"],
  });
  assert.match(errors.join("\n"), /require a Game Registry change/u);

  assert.deepEqual(validatePullRequestChanges({
    changedFiles: [
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