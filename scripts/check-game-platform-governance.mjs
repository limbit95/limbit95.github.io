import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { GAME_REGISTRY } from "../games/shared/registry.js";

const GAME_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const LEGACY_ROOTS = Object.freeze(["liar-game/", "the-game/", "marble-game/"]);
const RULEBOOK_PATH = "docs/game-platform-development-rules.md";
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

export function validateRepositoryState({
  gameDirectories,
  registry = GAME_REGISTRY,
  dbTestFiles,
  gameFiles = {},
  gameSpecDocuments = {},
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
      ["docs/game-platform-strategy.md", documents["docs/game-platform-strategy.md"]],
      ["docs/game-platform-invite-analysis.md", documents["docs/game-platform-invite-analysis.md"]],
    ];
    for (const [filename, content] of requiredLinks) {
      if (typeof content !== "string" || !content.includes(RULEBOOK_PATH)) {
        errors.push(`${filename} must identify ${RULEBOOK_PATH} when the rulebook exists.`);
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
  const developmentDocuments = readGameDocuments(gamesDirectory, gameDirectories, "DEVELOPMENT.md");
  const documents = Object.fromEntries([
    RULEBOOK_PATH,
    "AGENTS.md",
    "games/README.md",
    "docs/game-platform-strategy.md",
    "docs/game-platform-invite-analysis.md",
  ].map((filename) => [filename, readOptional(path.join(repositoryRoot, filename))]));

  const errors = validateRepositoryState({
    gameDirectories,
    registry: GAME_REGISTRY,
    dbTestFiles,
    gameFiles,
    gameSpecDocuments,
    developmentDocuments,
    documents,
  });

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