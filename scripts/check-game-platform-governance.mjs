import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { GAME_REGISTRY } from "../games/shared/registry.js";

const GAME_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const LEGACY_ROOTS = Object.freeze(["liar-game/", "the-game/", "marble-game/"]);
const RULEBOOK_PATH = "docs/game-platform-development-rules.md";
const UI_RULEBOOK_PATH = "docs/game-platform-ui-rules.md";
const DEVELOPMENT_CHECKPOINT_TRIGGER = "사용자 요청을 repository checkpoint 명령으로 해석하는 명시적 트리거는 요청 문장에서 `디벨롭 파일에`가 실제 기록 대상으로 지정된 경우다.";
const DEVELOPMENT_CHECKPOINT_LIFECYCLE_GUARD = "`디벨롭 파일에` 트리거는 사용자 요청의 해석에만 적용하며, Phase 시작/작업 범위 확정, Phase 완료, release closeout, 중요한 기능·UI 설계 변경, blocker/known issue 발생 등 `DEVELOPMENT.md`의 기존 필수·기본 갱신 시점을 제한하지 않는다.";
const DEVELOPMENT_CHECKPOINT_POLICY_PATHS = Object.freeze([
  "AGENTS.md",
  "games/README.md",
  RULEBOOK_PATH,
]);
const DEVELOPMENT_CHECKPOINT_AMBIGUOUS_PATTERNS = Object.freeze([
  "게임 진행 checkpoint의 명시적 트리거는 사용자의 요청 문장에 `디벨롭 파일에`라는 표현이 포함된 경우다.",
  "사용자가 명시적으로 중간 진행 기록을 요청할 때",
  "사용자가 중간 checkpoint 기록을 요청할 때",
  "Phase 완료 시와 사용자가 중간 checkpoint 기록을 요청할 때",
]);
const PLATFORM_DOCUMENT_CLASS_PATTERN = /^> \*\*문서 분류:\*\* (CURRENT|HISTORY)\s*$/mu;
const PLATFORM_DOCUMENT_PATH_PATTERN = /^docs\/game-platform-.+\.md$/u;
const GAME_GUIDE_PATH_PATTERN = /^games\/[^/]+\.md$/u;
const GAME_SPEC_REQUIRED_SECTIONS = Object.freeze([
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
]);
const UI_DESIGN_REQUIRED_SECTIONS = Object.freeze([
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
]);
const DEVELOPMENT_REQUIRED_SECTIONS = Object.freeze([
  "## Current Status",
  "## Completed",
  "## Current Work",
  "## Next Work",
  "## Decisions",
  "## Validation",
  "## Known Issues / Deferred",
]);
const BOOTSTRAP_ALLOWED_FILES = Object.freeze(new Set([
  "GAME_SPEC.md",
  "UI_DESIGN.md",
  "DEVELOPMENT.md",
]));

function normalizePath(value) {
  return String(value).replaceAll("\\", "/").replace(/^\.\//u, "");
}

function unique(values) {
  return [...new Set(values)];
}

export function platformGameIdFromPath(filename) {
  const match = normalizePath(filename).match(/^games\/([^/]+)\//u);
  if (!match || match[1] === "shared") return null;
  return match[1];
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsPlatformGameReference(content, game) {
  const idPattern = new RegExp(
    `(^|[^a-z0-9-])${escapeRegExp(game.id)}([^a-z0-9-]|$)`,
    "iu",
  );
  if (idPattern.test(content)) return true;

  const title = String(game.title ?? "").trim();
  return title ? new RegExp(escapeRegExp(title), "iu").test(content) : false;
}

export function validatePlatformDocumentPolicy({
  documents = {},
  registry = GAME_REGISTRY,
}) {
  const errors = [];
  const sharedGames = registry.filter((game) => game.platform === "shared");

  for (const [rawFilename, content] of Object.entries(documents)) {
    const filename = normalizePath(rawFilename);
    if (typeof content !== "string") continue;

    let classification = null;
    if (PLATFORM_DOCUMENT_PATH_PATTERN.test(filename)) {
      const match = content.match(PLATFORM_DOCUMENT_CLASS_PATTERN);
      if (!match) {
        errors.push(`${filename} must declare > **문서 분류:** CURRENT or HISTORY.`);
        continue;
      }
      classification = match[1];
    } else if (filename === "AGENTS.md" || GAME_GUIDE_PATH_PATTERN.test(filename)) {
      classification = "CURRENT";
    } else {
      continue;
    }

    if (PLATFORM_DOCUMENT_PATH_PATTERN.test(filename) && filename !== RULEBOOK_PATH && !content.includes(RULEBOOK_PATH)) {
      errors.push(
        `Game Platform document ${filename} must identify ${RULEBOOK_PATH} as the current rulebook.`,
      );
    }

    if (classification === "HISTORY") continue;

    for (const pattern of DEVELOPMENT_CHECKPOINT_AMBIGUOUS_PATTERNS) {
      if (content.includes(pattern)) {
        errors.push(
          `Current Game Platform document ${filename} contains ambiguous DEVELOPMENT.md checkpoint wording: ${pattern}`,
        );
      }
    }

    for (const game of sharedGames) {
      if (containsPlatformGameReference(content, game)) {
        errors.push(
          `Current Game Platform document ${filename} must stay game-agnostic; move ${game.id}-specific guidance to that game\'s documents/tests.`,
        );
      }
    }
  }

  if (documents[RULEBOOK_PATH] != null) {
    for (const filename of DEVELOPMENT_CHECKPOINT_POLICY_PATHS) {
      const content = documents[filename];
      if (typeof content !== "string" || !content.includes(DEVELOPMENT_CHECKPOINT_TRIGGER)) {
        errors.push(
          `${filename} must use the canonical Game Platform DEVELOPMENT.md user checkpoint trigger: ${DEVELOPMENT_CHECKPOINT_TRIGGER}`,
        );
      }
      if (typeof content !== "string" || !content.includes(DEVELOPMENT_CHECKPOINT_LIFECYCLE_GUARD)) {
        errors.push(
          `${filename} must preserve the canonical Game Platform DEVELOPMENT.md lifecycle update rule: ${DEVELOPMENT_CHECKPOINT_LIFECYCLE_GUARD}`,
        );
      }
    }
  }

  return errors;
}
export function validateRepositoryState({
  gameDirectories,
  registry = GAME_REGISTRY,
  dbTestFiles,
  gameFiles = {},
  gameSpecDocuments = {},
  uiDesignDocuments = {},
  developmentDocuments = {},
  documents = {},
}) {
  const errors = [];
  const ids = registry.map((game) => game.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) {
    errors.push(`Duplicate Game Registry id(s): ${unique(duplicateIds).join(", ")}`);
  }

  const sharedGames = registry.filter((game) => game.platform === "shared");
  const sharedById = new Map(sharedGames.map((game) => [game.id, game]));
  const directorySet = new Set(gameDirectories);
  const dbTestSet = new Set(dbTestFiles);

  for (const gameId of gameDirectories) {
    if (!GAME_ID_PATTERN.test(gameId)) {
      errors.push(`Platform game directory must use lowercase kebab-case: games/${gameId}/`);
      continue;
    }
    const gameSpec = gameSpecDocuments[gameId];
    if (typeof gameSpec !== "string") {
      errors.push(`Platform game ${gameId} requires games/${gameId}/GAME_SPEC.md.`);
    } else {
      for (const section of GAME_SPEC_REQUIRED_SECTIONS) {
        if (!gameSpec.includes(section)) {
          errors.push(`games/${gameId}/GAME_SPEC.md is missing required section: ${section}`);
        }
      }
      if (documents[UI_RULEBOOK_PATH] != null) {
        for (const linkedDocument of ["UI_DESIGN.md", "DEVELOPMENT.md"]) {
          if (!gameSpec.includes(linkedDocument)) {
            errors.push(`games/${gameId}/GAME_SPEC.md must reference ${linkedDocument}.`);
          }
        }
      }
    }

    if (documents[UI_RULEBOOK_PATH] != null) {
      const uiDesign = uiDesignDocuments[gameId];
      if (typeof uiDesign !== "string") {
        errors.push(`Platform game ${gameId} requires games/${gameId}/UI_DESIGN.md.`);
      } else {
        for (const section of UI_DESIGN_REQUIRED_SECTIONS) {
          if (!uiDesign.includes(section)) {
            errors.push(`games/${gameId}/UI_DESIGN.md is missing required section: ${section}`);
          }
        }
        for (const linkedDocument of ["GAME_SPEC.md", "DEVELOPMENT.md"]) {
          if (!uiDesign.includes(linkedDocument)) {
            errors.push(`games/${gameId}/UI_DESIGN.md must reference ${linkedDocument}.`);
          }
        }
      }
    }

    const development = developmentDocuments[gameId];
    if (typeof development !== "string") {
      errors.push(`Platform game ${gameId} requires games/${gameId}/DEVELOPMENT.md.`);
    } else {
      for (const section of DEVELOPMENT_REQUIRED_SECTIONS) {
        if (!development.includes(section)) {
          errors.push(`games/${gameId}/DEVELOPMENT.md is missing required section: ${section}`);
        }
      }
      if (documents[UI_RULEBOOK_PATH] != null) {
        for (const linkedDocument of ["GAME_SPEC.md", "UI_DESIGN.md"]) {
          if (!development.includes(linkedDocument)) {
            errors.push(`games/${gameId}/DEVELOPMENT.md must reference ${linkedDocument}.`);
          }
        }
      }

      const released = /^\s*-?\s*Status:\s*RELEASED\s*$/mu.test(development);
      if (released) {
        if (!/^\s*-?\s*Active branch:\s*main\s*$/mu.test(development)) {
          errors.push(`Released platform game ${gameId} must set Active branch: main in DEVELOPMENT.md.`);
        }
        if (!/^## Release\s+[—-]\s+\d{4}-\d{2}-\d{2}\s*$/mu.test(development)) {
          errors.push(`Released platform game ${gameId} must record a dated ## Release — YYYY-MM-DD section in DEVELOPMENT.md.`);
        }
      }
    }

    const game = sharedById.get(gameId);
    if (!game) {
      const files = gameFiles[gameId];
      const bootstrapOnly = Array.isArray(files)
        && files.length > 0
        && files.every((file) => BOOTSTRAP_ALLOWED_FILES.has(normalizePath(file)));
      if (!bootstrapOnly) {
        errors.push(`Platform game directory games/${gameId}/ has runtime files but is missing a shared Game Registry entry.`);
      }
      continue;
    }

    const expectedHrefs = new Set([`./games/${gameId}/`, `/games/${gameId}/`]);
    if (!expectedHrefs.has(game.href)) {
      errors.push(`Shared game ${gameId} must route to games/${gameId}/ via its Registry href.`);
    }
    if (game.capabilities?.online === true && !dbTestSet.has(`${gameId}.test.js`)) {
      errors.push(`Online shared game ${gameId} requires tests/game-db-integration/${gameId}.test.js.`);
    }
  }

  for (const game of sharedGames) {
    if (!directorySet.has(game.id)) {
      errors.push(`Shared Game Registry entry ${game.id} has no games/${game.id}/ directory.`);
    }
  }

  if (documents[RULEBOOK_PATH] != null) {
    const requiredLinks = [
      ["AGENTS.md", documents["AGENTS.md"]],
      ["games/README.md", documents["games/README.md"]],
      ["games/GAME_SPEC_TEMPLATE.md", documents["games/GAME_SPEC_TEMPLATE.md"]],
      ["games/DEVELOPMENT_TEMPLATE.md", documents["games/DEVELOPMENT_TEMPLATE.md"]],
      ["games/UI_DESIGN_TEMPLATE.md", documents["games/UI_DESIGN_TEMPLATE.md"]],
      ["docs/game-platform-strategy.md", documents["docs/game-platform-strategy.md"]],
      ["docs/game-platform-invite-analysis.md", documents["docs/game-platform-invite-analysis.md"]],
    ];
    for (const [filename, content] of requiredLinks) {
      if (typeof content !== "string" || !content.includes(RULEBOOK_PATH)) {
        errors.push(`${filename} must identify ${RULEBOOK_PATH} when the rulebook exists.`);
      }
    }
  }

  if (documents[UI_RULEBOOK_PATH] != null) {
    const requiredUiLinks = [
      ["AGENTS.md", documents["AGENTS.md"]],
      [RULEBOOK_PATH, documents[RULEBOOK_PATH]],
      ["games/README.md", documents["games/README.md"]],
      ["games/GAME_SPEC_TEMPLATE.md", documents["games/GAME_SPEC_TEMPLATE.md"]],
      ["games/DEVELOPMENT_TEMPLATE.md", documents["games/DEVELOPMENT_TEMPLATE.md"]],
      ["games/UI_DESIGN_TEMPLATE.md", documents["games/UI_DESIGN_TEMPLATE.md"]],
    ];
    for (const [filename, content] of requiredUiLinks) {
      if (typeof content !== "string" || !content.includes(UI_RULEBOOK_PATH)) {
        errors.push(`${filename} must identify ${UI_RULEBOOK_PATH} when the UI rulebook exists.`);
      }
    }
  }

  return errors;
}

export function validatePullRequestChanges({
  changedFiles,
  baseGameDirectories = [],
  headGameDirectories = [],
}) {
  const errors = [];
  const paths = changedFiles.map((change) => normalizePath(change.path));
  const touchedLegacy = LEGACY_ROOTS.filter((root) => paths.some((file) => file.startsWith(root)));
  const platformRuntimeTouched = paths.some((file) =>
    file.startsWith("games/shared/") || platformGameIdFromPath(file) != null,
  );

  if (touchedLegacy.length && platformRuntimeTouched) {
    errors.push(
      `Do not mix Legacy runtime changes (${touchedLegacy.join(", ")}) with Game Platform runtime changes in one PR.`,
    );
  }

  const newGameIds = headGameDirectories.filter((id) => !baseGameDirectories.includes(id));
  const newRuntimeGameIds = newGameIds.filter((gameId) => {
    const gamePaths = paths.filter((file) => platformGameIdFromPath(file) === gameId);
    const allowed = new Set([
      `games/${gameId}/GAME_SPEC.md`,
      `games/${gameId}/UI_DESIGN.md`,
      `games/${gameId}/DEVELOPMENT.md`,
    ]);
    return gamePaths.some((file) => !allowed.has(file));
  });
  if (newRuntimeGameIds.length && !paths.includes("games/shared/registry.js")) {
    errors.push(`New platform game runtime(s) ${newRuntimeGameIds.join(", ")} require a Game Registry change in the same PR.`);
  }

  const addedSharedModules = changedFiles
    .filter((change) => change.status === "A")
    .map((change) => normalizePath(change.path))
    .filter((file) => /^games\/shared\/[^/]+\.js$/u.test(file) && file !== "games/shared/index.js");

  if (addedSharedModules.length) {
    const hasPlatformTestChange = paths.some((file) => /^tests\/game-platform-.+\.test\.js$/u.test(file));
    const hasPlatformDocChange = paths.some((file) =>
      /^docs\/game-platform-.+\.md$/u.test(file) || file === "games/README.md",
    );
    if (!hasPlatformTestChange) {
      errors.push(`New shared module(s) require a Game Platform contract test change: ${addedSharedModules.join(", ")}`);
    }
    if (!hasPlatformDocChange) {
      errors.push(`New shared module(s) require a Game Platform documentation change: ${addedSharedModules.join(", ")}`);
    }
  }

  return errors;
}

function readDirectoryNames(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((name) => name !== "shared")
    .filter((name) => statSync(path.join(directory, name)).isDirectory())
    .sort();
}

function readDbTestFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).filter((name) => name.endsWith(".test.js")).sort();
}

function readGameDocuments(gamesDirectory, gameDirectories, documentName) {
  return Object.fromEntries(gameDirectories.map((gameId) => {
    const filename = path.join(gamesDirectory, gameId, documentName);
    return [gameId, readOptional(filename)];
  }));
}

function readRelativeFiles(directory, prefix = "") {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const fullPath = path.join(directory, name);
    const relativePath = prefix ? `${prefix}/${name}` : name;
    if (statSync(fullPath).isDirectory()) {
      return readRelativeFiles(fullPath, relativePath);
    }
    return [relativePath];
  }).sort();
}

function readGameFiles(gamesDirectory, gameDirectories) {
  return Object.fromEntries(gameDirectories.map((gameId) => [
    gameId,
    readRelativeFiles(path.join(gamesDirectory, gameId)),
  ]));
}

function readOptional(filename) {
  return existsSync(filename) ? readFileSync(filename, "utf8") : null;
}

function readPlatformPolicyDocuments(repositoryRoot) {
  const filenames = new Set(["AGENTS.md"]);
  const docsDirectory = path.join(repositoryRoot, "docs");
  const gamesDirectory = path.join(repositoryRoot, "games");

  if (existsSync(docsDirectory)) {
    for (const name of readdirSync(docsDirectory)) {
      const relativePath = `docs/${name}`;
      const fullPath = path.join(docsDirectory, name);
      if (statSync(fullPath).isFile() && PLATFORM_DOCUMENT_PATH_PATTERN.test(relativePath)) {
        filenames.add(relativePath);
      }
    }
  }

  if (existsSync(gamesDirectory)) {
    for (const name of readdirSync(gamesDirectory)) {
      const relativePath = `games/${name}`;
      const fullPath = path.join(gamesDirectory, name);
      if (statSync(fullPath).isFile() && GAME_GUIDE_PATH_PATTERN.test(relativePath)) {
        filenames.add(relativePath);
      }
    }
  }

  return Object.fromEntries(
    [...filenames]
      .sort()
      .map((filename) => [filename, readOptional(path.join(repositoryRoot, filename))]),
  );
}
function runGit(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function gameDirectoriesAtRef(ref, cwd) {
  if (!ref) return [];
  const output = runGit(["ls-tree", "-d", "--name-only", ref, "games"], cwd);
  if (!output) return [];
  const gamesTree = runGit(["ls-tree", "-d", "--name-only", `${ref}:games`], cwd);
  return gamesTree
    .split(/\r?\n/u)
    .map((name) => name.trim())
    .filter(Boolean)
    .filter((name) => name !== "shared")
    .sort();
}

function changedFilesBetween(base, head, cwd) {
  if (!base) return [];
  const output = runGit(["diff", "--name-status", `${base}...${head}`], cwd);
  if (!output) return [];
  return output.split(/\r?\n/u).map((line) => {
    const [rawStatus, ...parts] = line.split("\t");
    const status = rawStatus[0];
    const filename = parts.at(-1);
    return { status, path: filename };
  });
}

function parseArgs(argv) {
  const args = { base: null, head: "HEAD" };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--base") args.base = argv[index + 1] ?? null;
    if (argv[index] === "--head") args.head = argv[index + 1] ?? "HEAD";
  }
  return args;
}

export function runGovernanceCheck({ repositoryRoot, base = null, head = "HEAD" }) {
  const gamesDirectory = path.join(repositoryRoot, "games");
  const gameDirectories = readDirectoryNames(gamesDirectory);
  const dbTestFiles = readDbTestFiles(path.join(repositoryRoot, "tests", "game-db-integration"));
  const gameFiles = readGameFiles(gamesDirectory, gameDirectories);
  const gameSpecDocuments = readGameDocuments(gamesDirectory, gameDirectories, "GAME_SPEC.md");
  const uiDesignDocuments = readGameDocuments(gamesDirectory, gameDirectories, "UI_DESIGN.md");
  const developmentDocuments = readGameDocuments(gamesDirectory, gameDirectories, "DEVELOPMENT.md");
  const documents = readPlatformPolicyDocuments(repositoryRoot);

  const errors = validateRepositoryState({
    gameDirectories,
    registry: GAME_REGISTRY,
    dbTestFiles,
    gameFiles,
    gameSpecDocuments,
    uiDesignDocuments,
    developmentDocuments,
    documents,
  });

  errors.push(...validatePlatformDocumentPolicy({
    documents,
    registry: GAME_REGISTRY,
  }));

  if (base) {
    errors.push(...validatePullRequestChanges({
      changedFiles: changedFilesBetween(base, head, repositoryRoot),
      baseGameDirectories: gameDirectoriesAtRef(base, repositoryRoot),
      headGameDirectories: gameDirectories,
    }));
  }

  return errors;
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  const { base, head } = parseArgs(process.argv.slice(2));
  const errors = runGovernanceCheck({ repositoryRoot: process.cwd(), base, head });
  if (errors.length) {
    console.error("Game Platform governance guard failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
  } else {
    console.log("Game Platform governance guard passed.");
  }
}