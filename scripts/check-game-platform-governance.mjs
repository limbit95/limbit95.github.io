import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { GAME_REGISTRY } from "../games/shared/registry.js";
import {
  readModelOracleInputs,
  validateModelOracleConfiguration,
  validateModelOracleSelection,
} from "./check-game-platform-vnext-boundaries.mjs";

const GAME_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const LEGACY_ROOTS = Object.freeze(["liar-game/", "the-game/", "marble-game/"]);
const RULEBOOK_PATH = "docs/game-platform-development-rules.md";
const UI_RULEBOOK_PATH = "docs/game-platform-ui-rules.md";
const VNEXT_ARCHITECTURE_PATH = "docs/game-platform-architecture.md";
const VNEXT_BOARD_PATH = "docs/game-platform-board-rules.md";
const VNEXT_REALTIME_PATH = "docs/game-platform-realtime-coop-rules.md";
const VNEXT_POLICY_DOCUMENTS = Object.freeze({
  [VNEXT_ARCHITECTURE_PATH]: { sections: ["AR1", "AR2", "AR3", "AR4"] },
  "docs/game-platform-common-rules.md": { revision: "GP-COMMON/1", sections: ["CO1", "CO2", "CO3", "CO4", "CO5"] },
  "docs/game-platform-lifetime-contract.md": { revision: "GP-LIFETIME/1", sections: ["LI1", "LI2", "LI3"] },
  "docs/game-platform-model-contracts.md": { revision: "GP-MODELS/1", sections: ["MO1", "MO2", "MO3", "MO4", "MO5", "MO6"] },
  "docs/game-platform-capability-contracts.md": { revision: "GP-CAPABILITIES/1", sections: ["CA1", "CA2", "CA3", "CA4", "CA5", "CA6"] },
  [VNEXT_BOARD_PATH]: { revision: "GP-GENRE-BOARD/1", sections: ["BO1", "BO2", "BO3", "BO4"] },
  [VNEXT_REALTIME_PATH]: { revision: "GP-GENRE-REALTIME-COOP/1", sections: ["RT1", "RT2", "RT3", "RT4", "RT5", "RT6"] },
});
const VNEXT_ENTRY_PATHS = Object.freeze([
  "AGENTS.md", "games/README.md", RULEBOOK_PATH, UI_RULEBOOK_PATH,
  "docs/game-platform-governance.md", "games/GAME_SPEC_TEMPLATE.md",
  "games/DEVELOPMENT_TEMPLATE.md", "games/UI_DESIGN_TEMPLATE.md", "games/UI_DECISIONS_TEMPLATE.md",
]);

// Internal documentation selection, not a runtime/API/wire version field.
function vnextContractSelection(content) {
  return typeof content === "string"
    ? content.match(/^\s*-\s*Platform contract:\s*([^\n]+)$/mu)?.[1]?.trim() ?? null
    : null;
}

function referencesPolicyDocument(filename, content, target) {
  if (typeof content !== "string") return false;
  if (content.includes(target)) return true;
  return [...content.matchAll(/\]\(([^\s)]+)\)/gu)].some((match) => {
    const href = match[1].split("#")[0];
    const resolved = href.startsWith("/") ? href.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(filename), href));
    return resolved === target;
  });
}

export function validateVnextDocumentAuthority({ documents = {} }) {
  const hasVnextScope = Object.values(documents).some((content) => typeof content === "string" && /^> \*\*적용 범위:\*\* 신규 vNext \(기존 consumer 제외\)\s*$/mu.test(content));
  if (!hasVnextScope && !Object.keys(VNEXT_POLICY_DOCUMENTS).some((filename) => documents[filename] != null)) return [];
  const errors = [];
  for (const [filename, contract] of Object.entries(VNEXT_POLICY_DOCUMENTS)) {
    const content = documents[filename];
    if (typeof content !== "string") {
      errors.push(`vNext authority requires ${filename} in the same transition.`);
      continue;
    }
    if (content.match(PLATFORM_DOCUMENT_CLASS_PATTERN)?.[1] !== "CURRENT") {
      errors.push(`${filename} must be CURRENT for its vNext contract scope.`);
    }
    if (!/^> \*\*적용 범위:\*\* 신규 vNext \(기존 consumer 제외\)\s*$/mu.test(content)) {
      errors.push(`${filename} must declare the isolated vNext consumer scope.`);
    }
    if (contract.revision && !content.split("\n").some((line) => line.trim() === `> **계약 식별:** ${contract.revision}`)) {
      errors.push(`${filename} must identify approved contract ${contract.revision}.`);
    }
    if (filename !== VNEXT_ARCHITECTURE_PATH && !referencesPolicyDocument(filename, content, VNEXT_ARCHITECTURE_PATH)) {
      errors.push(`${filename} must identify ${VNEXT_ARCHITECTURE_PATH} as its vNext entry.`);
    }
    for (const section of contract.sections) {
      const lines = content.split("\n");
      const start = lines.findIndex((line) => line === `## ${section}` || line.startsWith(`## ${section} `));
      const next = start < 0 ? -1 : lines.findIndex((line, index) => index > start && line.startsWith("## "));
      const body = start < 0 ? null : lines.slice(start + 1, next < 0 ? undefined : next).join("\n").trim();
      if (!body || /^(TODO|TBD|미작성)$/u.test(body)) {
        errors.push(`${filename} requires a substantive ${section} body or precise approved inheritance reference.`);
      }
    }
  }
  for (const [filename, content] of Object.entries(documents)) {
    if (filename in VNEXT_POLICY_DOCUMENTS || typeof content !== "string") continue;
    if (PLATFORM_DOCUMENT_PATH_PATTERN.test(filename)
      && content.match(PLATFORM_DOCUMENT_CLASS_PATTERN)?.[1] === "CURRENT"
      && /^> \*\*적용 범위:\*\* 신규 vNext \(기존 consumer 제외\)\s*$/mu.test(content)) {
      errors.push(`${filename} must reference its existing vNext topic-owner, not introduce competing CURRENT authority.`);
    }
  }
  // Approved board experience is a subordinate topic-owner, not a second platform.
  // Requiring its document in this atomic bundle does not select board/Room/DB for a game.
  const board = documents[VNEXT_BOARD_PATH];
  if (typeof board === "string") {
    for (const target of [
      "docs/game-platform-common-rules.md", "docs/game-platform-lifetime-contract.md",
      "docs/game-platform-model-contracts.md", "docs/game-platform-capability-contracts.md",
      "docs/game-platform-governance.md", "docs/game-platform-db-test-contract.md",
    ]) {
      if (!referencesPolicyDocument(VNEXT_BOARD_PATH, board, target)) {
        errors.push(`vNext board owner must reference ${target} rather than redefine that responsibility.`);
      }
    }
    for (const filename of VNEXT_ENTRY_PATHS) {
      if (!referencesPolicyDocument(filename, documents[filename], VNEXT_BOARD_PATH)) {
        errors.push(`${filename} must connect the actual vNext board owner ${VNEXT_BOARD_PATH}.`);
      }
    }
  }
  // The genre document carries experience requirements; canonical owners retain engines.
  const realtime = documents[VNEXT_REALTIME_PATH];
  if (typeof realtime === "string") {
    for (const target of [
      "docs/game-platform-common-rules.md", "docs/game-platform-lifetime-contract.md",
      "docs/game-platform-model-contracts.md", "docs/game-platform-capability-contracts.md",
      "docs/game-platform-governance.md", VNEXT_BOARD_PATH, "docs/game-platform-db-test-contract.md",
    ]) {
      if (!referencesPolicyDocument(VNEXT_REALTIME_PATH, realtime, target)) {
        errors.push("vNext realtime owner must reference " + target + " rather than redefine that responsibility.");
      }
    }
    for (const filename of VNEXT_ENTRY_PATHS) {
      if (!referencesPolicyDocument(filename, documents[filename], VNEXT_REALTIME_PATH)) {
        errors.push(filename + " must connect the actual vNext realtime owner " + VNEXT_REALTIME_PATH + ".");
      }
    }
    const lines = realtime.split("\n");
    const start = lines.findIndex((line) => line === "## RT3" || line.startsWith("## RT3 "));
    const next = lines.findIndex((line, index) => index > start && line.startsWith("## "));
    const body = start < 0 ? [] : lines.slice(start + 1, next < 0 ? undefined : next);
    for (let index = 1; index <= 13; index += 1) {
      const id = "S5C-R" + String(index).padStart(2, "0");
      const row = body.find((line) => line.startsWith("|") && line.includes("**" + id + " "));
      const cells = row?.split("|").slice(1, -1) ?? [];
      if (cells.length !== 3 || cells.some((cell) => !cell.trim() || /^(TODO|TBD|미작성)$/u.test(cell.trim()))) {
        errors.push("vNext RT3 requires " + id + " content, owner/conditions, and follow-up observation.");
      }
    }
  }
  const architecture = documents[VNEXT_ARCHITECTURE_PATH];
  if (typeof architecture === "string") {
    for (const filename of Object.keys(VNEXT_POLICY_DOCUMENTS)) {
      if (filename !== VNEXT_ARCHITECTURE_PATH && !architecture.includes(filename.split("/").at(-1))) {
        errors.push(`vNext architecture must link the actual owner ${filename}.`);
      }
    }
    for (const inherited of ["step-5c-board-rule-succession.md", "step-5c-realtime-coop-spatial-rules.md"]) {
      if (!architecture.includes(inherited)) errors.push(`vNext genre discovery must preserve ${inherited} until its later transition.`);
    }
    for (const filename of VNEXT_ENTRY_PATHS) {
      if (typeof documents[filename] !== "string" || !documents[filename].includes(VNEXT_ARCHITECTURE_PATH)) {
        errors.push(`${filename} must identify the scoped vNext entry ${VNEXT_ARCHITECTURE_PATH}.`);
      }
    }
    for (const filename of [RULEBOOK_PATH, UI_RULEBOOK_PATH]) {
      if (typeof documents[filename] === "string" && !documents[filename].includes("> **적용 범위:** 기존 계약/consumer")) {
        errors.push(`${filename} must retain its existing-consumer scope rather than competing for vNext authority.`);
      }
    }
  }
  return errors;
}

const FUNCTION_CHECKPOINT_COMMAND = "기능 체크포인트 기록하자";
const DESIGN_CHECKPOINT_COMMAND = "디자인 체크포인트 기록하자";
const RETIRED_GENERIC_CHECKPOINT_MARKER = `\`${["체크포인트", "기록하자"].join(" ")}\``;
const FUNCTION_CHECKPOINT_POLICY_PATHS = Object.freeze([
  "AGENTS.md",
  "games/README.md",
  RULEBOOK_PATH,
]);
const DESIGN_CHECKPOINT_POLICY_PATHS = Object.freeze([
  "AGENTS.md",
  "games/README.md",
  RULEBOOK_PATH,
  UI_RULEBOOK_PATH,
]);
const UI_DECISION_LIFECYCLE_POLICY_PATHS = Object.freeze([
  "AGENTS.md",
  "games/README.md",
  RULEBOOK_PATH,
  UI_RULEBOOK_PATH,
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
const UI_DECISIONS_REQUIRED_SECTIONS = Object.freeze([
  "## Current Design Track",
  "## Decision Log",
  "## Superseded / Rejected",
  "## Validation History",
  "## Open Follow-up",
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
  "UI_DESIGN.md",
  "UI_DECISIONS.md",
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

    if (PLATFORM_DOCUMENT_PATH_PATTERN.test(filename) && filename !== RULEBOOK_PATH && !(filename in VNEXT_POLICY_DOCUMENTS) && !content.includes(RULEBOOK_PATH)) {
      errors.push(
        `Game Platform document ${filename} must identify ${RULEBOOK_PATH} as the current rulebook.`,
      );
    }

    if (classification === "HISTORY") continue;

    for (const game of sharedGames) {
      if (containsPlatformGameReference(content, game)) {
        errors.push(
          `Current Game Platform document ${filename} must stay game-agnostic; move ${game.id}-specific guidance to that game\'s documents/tests.`,
        );
      }
    }
  }

  if (documents[RULEBOOK_PATH] != null) {
    for (const filename of FUNCTION_CHECKPOINT_POLICY_PATHS) {
      const content = documents[filename];
      if (typeof content !== "string" || !content.includes(FUNCTION_CHECKPOINT_COMMAND)) {
        errors.push(
          `${filename} must identify the Game Platform functional checkpoint command: ${FUNCTION_CHECKPOINT_COMMAND}`,
        );
      }
    }
  }

  if (documents[RULEBOOK_PATH] != null && documents[UI_RULEBOOK_PATH] != null) {
    for (const filename of DESIGN_CHECKPOINT_POLICY_PATHS) {
      const content = documents[filename];
      if (typeof content !== "string" || !content.includes(DESIGN_CHECKPOINT_COMMAND)) {
        errors.push(
          `${filename} must identify the Game Platform design checkpoint command: ${DESIGN_CHECKPOINT_COMMAND}`,
        );
      }
    }
  }

  if (documents[RULEBOOK_PATH] != null) {
    for (const filename of unique([
      ...FUNCTION_CHECKPOINT_POLICY_PATHS,
      ...DESIGN_CHECKPOINT_POLICY_PATHS,
    ])) {
      const content = documents[filename];
      if (typeof content === "string" && content.includes(RETIRED_GENERIC_CHECKPOINT_MARKER)) {
        errors.push(
          `${filename} must not restore the retired generic checkpoint command; use the functional/design commands explicitly.`,
        );
      }
    }
  }

  if (documents[UI_RULEBOOK_PATH] != null && documents[RULEBOOK_PATH] != null) {
    for (const filename of UI_DECISION_LIFECYCLE_POLICY_PATHS) {
      const content = documents[filename];
      const identifiesDecisionLog = typeof content === "string" && content.includes("UI_DECISIONS.md");
      const identifiesManualReview = typeof content === "string"
        && (content.includes("Developer Manual Design Review") || content.includes("수동 브라우저"));
      if (!identifiesDecisionLog || !identifiesManualReview) {
        errors.push(
          `${filename} must identify the UI_DECISIONS.md manual-browser design review lifecycle.`,
        );
      }
    }
  }

  errors.push(...validateVnextDocumentAuthority({ documents }));
  return errors;
}
export function validateRepositoryState({
  gameDirectories,
  registry = GAME_REGISTRY,
  dbTestFiles,
  gameFiles = {},
  gameSpecDocuments = {},
  uiDesignDocuments = {},
  uiDecisionDocuments = {},
  developmentDocuments = {},
  documents = {},
  modelOracleConfig = { models: [] },
  modelOracleFiles = {},
}) {
  const errors = [];
  errors.push(...validateModelOracleConfiguration({ config: modelOracleConfig, files: modelOracleFiles, documents }));
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
        for (const linkedDocument of ["UI_DESIGN.md", "UI_DECISIONS.md", "DEVELOPMENT.md"]) {
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
        for (const linkedDocument of ["GAME_SPEC.md", "DEVELOPMENT.md", "UI_DECISIONS.md"]) {
          if (!uiDesign.includes(linkedDocument)) {
            errors.push(`games/${gameId}/UI_DESIGN.md must reference ${linkedDocument}.`);
          }
        }
      }

      const uiDecisions = uiDecisionDocuments[gameId];
      if (typeof uiDecisions !== "string") {
        errors.push(`Platform game ${gameId} requires games/${gameId}/UI_DECISIONS.md.`);
      } else {
        for (const section of UI_DECISIONS_REQUIRED_SECTIONS) {
          if (!uiDecisions.includes(section)) {
            errors.push(`games/${gameId}/UI_DECISIONS.md is missing required section: ${section}`);
          }
        }
        for (const linkedDocument of ["GAME_SPEC.md", "DEVELOPMENT.md", "UI_DESIGN.md"]) {
          if (!uiDecisions.includes(linkedDocument)) {
            errors.push(`games/${gameId}/UI_DECISIONS.md must reference ${linkedDocument}.`);
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
        for (const linkedDocument of ["GAME_SPEC.md", "UI_DESIGN.md", "UI_DECISIONS.md"]) {
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

    const selectedVnextContract = vnextContractSelection(gameSpec);
    if (selectedVnextContract) {
      if ((gameSpec.match(/^\s*-\s*Platform contract:/gmu) ?? []).length !== 1) {
        errors.push(`games/${gameId}/GAME_SPEC.md must declare one unambiguous Platform contract.`);
      }
      if (selectedVnextContract !== "GP-COMMON/1") {
        errors.push(`games/${gameId}/GAME_SPEC.md selects unsupported vNext contract ${selectedVnextContract}.`);
      }
      if (documents[VNEXT_ARCHITECTURE_PATH] == null) {
        errors.push(`vNext game ${gameId} requires the scoped architecture authority.`);
      }
      const applied = gameSpec.match(/^\s*-\s*Genre \/ capability contracts:\s*([^\n]+)$/mu)?.[1] ?? "";
      const approved = new Set(Object.values(VNEXT_POLICY_DOCUMENTS).map((owner) => owner.revision).filter(Boolean));
      for (const revision of applied.match(/GP-[A-Z-]+\/\d+/gu) ?? []) {
        if (!approved.has(revision)) errors.push(`games/${gameId}/GAME_SPEC.md selects unsupported applied contract ${revision}.`);
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
    if (selectedVnextContract) {
      const selectedModel = gameSpec.match(/^\s*-\s*Selected model contract:\s*([^\n]+)$/mu)?.[1]?.trim();
      if (!selectedModel || /^(UNSELECTED|TBD|미정)$/iu.test(selectedModel)) {
        errors.push(`vNext runtime ${gameId} must record an actual selected model contract before runtime admission.`);
      }
    }

    // Discovery is structural evidence only; the shipped oracle configuration is empty.
    // Online or actual runtime admission requires a real selected model and all its bindings.
    const hasRuntime = (gameFiles[gameId] ?? []).some((file) => !BOOTSTRAP_ALLOWED_FILES.has(normalizePath(file)));
    if (selectedVnextContract && (game.capabilities?.online === true || hasRuntime)) {
      const contract = gameSpec.match(/^\s*-\s*Selected model contract:\s*([^\n]+)$/mu)?.[1]?.trim();
      errors.push(...validateModelOracleSelection({ contract, online: game.capabilities?.online === true,
        config: modelOracleConfig, files: modelOracleFiles, documents }));
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

  if (documents[UI_RULEBOOK_PATH] != null) {
    const requiredUiLinks = [
      ["AGENTS.md", documents["AGENTS.md"]],
      [RULEBOOK_PATH, documents[RULEBOOK_PATH]],
      ["games/README.md", documents["games/README.md"]],
      ["games/GAME_SPEC_TEMPLATE.md", documents["games/GAME_SPEC_TEMPLATE.md"]],
      ["games/DEVELOPMENT_TEMPLATE.md", documents["games/DEVELOPMENT_TEMPLATE.md"]],
      ["games/UI_DESIGN_TEMPLATE.md", documents["games/UI_DESIGN_TEMPLATE.md"]],
      ["games/UI_DECISIONS_TEMPLATE.md", documents["games/UI_DECISIONS_TEMPLATE.md"]],
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
    file.startsWith("games/shared/") || file.startsWith("services/game-platform-vnext/") || platformGameIdFromPath(file) != null,
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
      `games/${gameId}/UI_DESIGN.md`,
      `games/${gameId}/UI_DECISIONS.md`,
    ]);
    return gamePaths.some((file) => !allowed.has(file));
  });
  if (newRuntimeGameIds.length && !paths.includes("games/shared/registry.js")) {
    errors.push(`New platform game runtime(s) ${newRuntimeGameIds.join(", ")} require a Game Registry change in the same PR.`);
  }

  const addedSharedModules = changedFiles
    .filter((change) => change.status === "A")
    .map((change) => normalizePath(change.path))
    .filter((file) => (/^games\/shared\/(?:[^/]+|vnext\/.+)\.[cm]?js$/u.test(file)
      || file.startsWith("services/game-platform-vnext/")) && file !== "games/shared/index.js");

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
  const uiDecisionDocuments = readGameDocuments(gamesDirectory, gameDirectories, "UI_DECISIONS.md");
  const developmentDocuments = readGameDocuments(gamesDirectory, gameDirectories, "DEVELOPMENT.md");
  const documents = readPlatformPolicyDocuments(repositoryRoot);
  let modelOracleInputs;
  try { modelOracleInputs = readModelOracleInputs(repositoryRoot); }
  catch (error) { return [`Model oracle discovery configuration could not be read: ${error.message}`]; }

  const errors = validateRepositoryState({
    gameDirectories,
    registry: GAME_REGISTRY,
    dbTestFiles,
    gameFiles,
    gameSpecDocuments,
    uiDesignDocuments,
    uiDecisionDocuments,
    developmentDocuments,
    documents,
    modelOracleConfig: modelOracleInputs.config,
    modelOracleFiles: modelOracleInputs.files,
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
