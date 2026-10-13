import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const VNEXT_SERVER_ROOT = "services/game-platform-vnext/";
export const VNEXT_MODEL_ORACLES_PATH = "tests/game-platform-vnext-model-oracles.json";
export const MODEL_ORACLE_OBLIGATIONS = Object.freeze([
  ...Array.from({ length: 11 }, (_, i) => `safety${String(i + 1).padStart(2, "0")}`),
  "authorizationACP", "lifetime", "adoptionRecovery",
]);

const normalized = (value) => String(value).replaceAll("\\", "/");
const present = (value) => typeof value === "string" && value.trim().length > 0
  && !/^(TBD|TODO|UNKNOWN|UNSELECTED|미정)$/iu.test(value.trim());
const contractTestPath = (value) => /^tests\/game-platform-[^/]+\.test\.js$/u.test(value);
const dbTestPath = (value) => /^tests\/game-db-integration\/[^/]+\.test\.js$/u.test(value);

// This is checker configuration, not a runtime model registry or a support certificate.
export function validateModelOracleConfiguration({ config, files = {}, documents = {} }) {
  const errors = [];
  if (!config || !Array.isArray(config.models)) return ["Model oracle configuration must contain a models array."];
  const seen = new Set();
  for (const model of config.models) {
    if (!model || !present(model.contract) || !/\/[1-9]\d*$/u.test(model.contract)) {
      errors.push("Model oracle entry requires an explicit model contract ID/revision.");
      continue;
    }
    if (seen.has(model.contract)) errors.push(`Duplicate model oracle contract ${model.contract}.`);
    seen.add(model.contract);
    if (typeof model.online !== "boolean") errors.push(`${model.contract} requires an explicit online scope.`);
    if (!present(model.environment)) errors.push(`${model.contract} requires an actual oracle environment.`);
    if (model.runner !== "node-contract" && model.runner !== "disposable-db") {
      errors.push(`${model.contract} requires a discovered node-contract or disposable-db runner.`);
    }
    const [ownerPath, anchor] = String(model.owner ?? "").split("#");
    const owner = documents[ownerPath];
    const ownerStart = typeof owner === "string" ? owner.indexOf(`id="${anchor}"`) : -1;
    const nextAnchor = ownerStart >= 0 ? owner.indexOf('<a id="', ownerStart + 1) : -1;
    const definition = ownerStart >= 0 ? owner.slice(ownerStart, nextAnchor < 0 ? undefined : nextAnchor) : "";
    if (ownerPath !== "docs/game-platform-model-contracts.md" || !present(anchor)
      || typeof owner !== "string" || !owner.includes(`id="${anchor}"`)
      || !definition.includes(`- Model contract: ${model.contract}`)) {
      errors.push(`${model.contract} requires its explicit model definition and anchor in the single MO owner.`);
    }
    if (!present(model.implementation) || typeof files[model.implementation] !== "string"
      || !normalized(model.implementation).startsWith(model.online ? VNEXT_SERVER_ROOT : "games/shared/vnext/")) {
      errors.push(`${model.contract} requires an existing implementation in its approved execution scope.`);
    }
    for (const obligation of MODEL_ORACLE_OBLIGATIONS) {
      const evidence = model.coverage?.[obligation];
      if (!model.online && !["lifetime", "adoptionRecovery"].includes(obligation)
        && present(evidence?.notApplicable)) continue;
      const file = evidence?.file;
      const allowed = model.runner === "disposable-db" ? dbTestPath(file ?? "") : contractTestPath(file ?? "");
      const source = files[file];
      const tokens = typeof source === "string" ? sourceTokens(source) : [];
      const testFound = tokens.some((token, i) => token.type === "word" && token.value === "test"
        && tokens[i + 1]?.value === "(" && tokens[i + 2]?.type === "literal" && tokens[i + 2].value === evidence?.test);
      if (!allowed || typeof source !== "string" || !present(evidence?.test)
        || !testFound) {
        errors.push(`${model.contract} is missing discovered ${obligation} oracle/test evidence.`);
      }
    }
  }
  return errors;
}

export function validateModelOracleSelection({ contract, online, config, files = {}, documents = {} }) {
  const model = config?.models?.find((entry) => entry.contract === contract);
  if (!model) return [`Selected model ${contract} is unsupported: no model-specific oracle/discovery support; a DB filename alone does not prove it.`];
  const errors = validateModelOracleConfiguration({ config: { models: [model] }, files, documents });
  if (model.online !== online) errors.push(`Selected model ${contract} does not match this consumer's online scope.`);
  return errors;
}

// Read quoted literals without evaluating source, and skip comments. Static module edges,
// literal dynamic imports and literal resource URLs are checked; arbitrary eval is not certified.
function sourceTokens(source) {
  const tokens = [];
  for (let i = 0; i < source.length;) {
    const ch = source[i];
    if (/\s/u.test(ch)) { i += 1; continue; }
    if (source.startsWith("//", i)) { i = source.indexOf("\n", i); if (i < 0) break; continue; }
    if (source.startsWith("/*", i)) { const end = source.indexOf("*/", i + 2); i = end < 0 ? source.length : end + 2; continue; }
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch; let value = ""; let computed = false; i += 1;
      while (i < source.length && source[i] !== quote) {
        if (quote === "`" && source.startsWith("${", i)) computed = true;
        if (source[i] === "\\") {
          i += 1; const next = source[i];
          if ((next === "x" && /^[0-9a-f]{2}$/iu.test(source.slice(i + 1, i + 3)))
            || (next === "u" && /^[0-9a-f]{4}$/iu.test(source.slice(i + 1, i + 5)))) {
            const length = next === "x" ? 2 : 4;
            value += String.fromCharCode(parseInt(source.slice(i + 1, i + 1 + length), 16)); i += 1 + length;
          } else { value += ({ n: "\n", r: "\r", t: "\t" })[next] ?? next ?? ""; i += 1; }
        } else { value += source[i]; i += 1; }
      }
      i += 1; tokens.push({ type: computed ? "computed" : "literal", value }); continue;
    }
    const word = source.slice(i).match(/^[A-Za-z_$][\w$]*/u)?.[0];
    if (word) { tokens.push({ type: "word", value: word }); i += word.length; }
    else { tokens.push({ type: "punctuation", value: ch }); i += 1; }
  }
  return tokens;
}

export function sourceModuleEdges(source) {
  const tokens = sourceTokens(source); const edges = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type !== "word" || !["import", "export"].includes(token.value)) continue;
    if (tokens[i + 1]?.value === ".") continue; // import.meta
    if (tokens[i + 1]?.value === "(") {
      const pieces = []; let cursor = i + 2;
      while (tokens[cursor]?.type === "literal") {
        pieces.push(tokens[cursor].value); cursor += 1;
        if (tokens[cursor]?.value !== "+") break;
        cursor += 1;
      }
      if (pieces.length && [")", ","].includes(tokens[cursor]?.value)) edges.push(pieces.join(""));
      continue;
    }
    if (token.value === "import" && tokens[i + 1]?.type === "literal") edges.push(tokens[i + 1].value);
    for (let j = i + 1; j < tokens.length && j < i + 200; j += 1) {
      if (tokens[j].value === ";") break;
      if (tokens[j].value === "from" && tokens[j + 1]?.type === "literal") { edges.push(tokens[j + 1].value); break; }
    }
  }
  return [...new Set(edges)];
}

export function resolveRepositoryReference(sourcePath, reference) {
  let clean;
  try { clean = decodeURIComponent(reference).split(/[?#]/u, 1)[0]; } catch { clean = reference.split(/[?#]/u, 1)[0]; }
  clean = normalized(clean);
  if (/^[a-z][a-z\d+.-]*:\/\//iu.test(clean)) {
    try { clean = new URL(clean).pathname; } catch { return null; }
  }
  if (clean.startsWith("/")) return path.posix.normalize(clean).slice(1);
  if (clean.startsWith(".")) return path.posix.normalize(path.posix.join("/", path.posix.dirname(sourcePath), clean)).slice(1);
  return path.posix.normalize(clean);
}

export function isBrowserAsset(filename) {
  return /\.(?:js|mjs|html|css)$/iu.test(filename)
    && (!filename.includes("/")
      || /^(?:js|css|games|liar-game|the-game|marble-game|assets)\//u.test(filename));
}

function cssReferences(source) {
  const clean = source.replace(/\/\*[\s\S]*?\*\//gu, "");
  return [...clean.matchAll(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|url\(\s*["']?([^)'"\s]+)|@import\s+["']([^"']+)["']/giu)]
    .filter((match) => !match[1]).map((match) => match[2] ?? match[3]);
}

function htmlReferences(source) {
  const references = [];
  const clean = source.replace(/<!--[\s\S]*?-->/gu, "")
    .replace(/<script\b([^>]*?)>([\s\S]*?)<\/script\s*>/giu, (tag, attributes, body) => {
      const type = attributes.match(/(?:^|\s)type\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/iu);
      const mime = (type?.[1] ?? type?.[2] ?? type?.[3] ?? "").trim().toLowerCase();
      const executable = !mime || mime === "module"
        || /^(?:text|application)\/(?:x-)?(?:javascript|ecmascript)(?:\s*;.*)?$/u.test(mime);
      if (executable && !/(?:^|\s)src\s*=/iu.test(attributes)) references.push(...sourceModuleEdges(body));
      // Keep resource attributes, but do not parse inert script text as HTML/CSS.
      return "<script" + attributes + "></script>";
    })
    .replace(/<style\b([^>]*?)>([\s\S]*?)<\/style\s*>/giu, (tag, attributes, body) => {
      references.push(...cssReferences(body));
      return "<style" + attributes + "></style>";
    });
  references.push(...[...clean.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^)'"\s]+)/giu)]
    .map((match) => match[1] ?? match[2]));
  return references;
}

export function validateVnextBoundaries({ files, trackedPaths = Object.keys(files), assetOutputs = [] }) {
  const errors = [];
  // No verified server exclusion exists in the current static publication boundary.
  // Do not accept a filename/ignore rule/support flag as an exclusion proof.
  const serverFiles = trackedPaths.filter((filename) => normalized(filename).startsWith(VNEXT_SERVER_ROOT));
  if (serverFiles.length) errors.push(`Server static publication exclusion is unverified; block server source/artifacts: ${serverFiles.join(", ")}`);
  for (const filename of trackedPaths.filter(isBrowserAsset)) {
    const source = files[filename];
    if (typeof source !== "string") { errors.push(`Boundary check could not read browser asset ${filename}.`); continue; }
    const js = /\.(?:js|mjs)$/iu.test(filename);
    const references = js ? [...sourceModuleEdges(source), ...sourceTokens(source).filter((token) => ["literal", "computed"].includes(token.type)).map((token) => token.value)]
      : /\.css$/iu.test(filename) ? cssReferences(source) : htmlReferences(source);
    for (const ref of references) {
      const target = resolveRepositoryReference(filename, ref);
      if (target === VNEXT_SERVER_ROOT.slice(0, -1) || target?.startsWith(VNEXT_SERVER_ROOT)) errors.push(`Browser/server boundary violation: ${filename} -> ${ref}`);
      const gameId = filename.match(/^games\/([^/]+)\//u)?.[1];
      if (gameId && gameId !== "shared" && target?.startsWith("games/shared/vnext/")) {
        const gameSpec = files[`games/${gameId}/GAME_SPEC.md`] ?? "";
        if (!/^\s*-\s*Platform contract:\s*GP-COMMON\/1\s*$/mu.test(gameSpec)) {
          errors.push(`vNext consumer ${gameId} must declare its scoped Platform contract before importing vNext.`);
        }
      }
      if (filename === "games/shared/index.js" && target?.startsWith("games/shared/vnext/")) {
        errors.push("Existing shared barrel must not re-export or import vNext implementation.");
      }
    }
  }
  for (const output of assetOutputs) {
    if (resolveRepositoryReference("index.html", output)?.startsWith(VNEXT_SERVER_ROOT)) errors.push(`Static asset manifest exposes server output: ${output}`);
  }
  return [...new Set(errors)];
}

export function readModelOracleInputs(repositoryRoot) {
  const config = JSON.parse(readFileSync(path.join(repositoryRoot, VNEXT_MODEL_ORACLES_PATH), "utf8"));
  const files = {};
  for (const model of config.models ?? []) {
    const wanted = [model.implementation, ...Object.values(model.coverage ?? {}).map((entry) => entry.file)].filter(Boolean);
    for (const filename of wanted) {
      if (filename.startsWith("/") || normalized(filename).split("/").includes("..")
        || !(contractTestPath(filename) || dbTestPath(filename)
          || /^(?:services\/game-platform-vnext|games\/shared\/vnext)\/.+\.(?:[cm]?js|py|go|rs)$/u.test(filename))) continue;
      try { files[filename] = readFileSync(path.join(repositoryRoot, filename), "utf8"); } catch { /* validator reports missing */ }
    }
  }
  return { config, files };
}

export function runVnextBoundaryCheck(repositoryRoot) {
  const trackedPaths = execFileSync("git", ["ls-files", "-z"], { cwd: repositoryRoot, encoding: "utf8" }).split("\0").filter(Boolean);
  const files = {};
  for (const filename of trackedPaths.filter(isBrowserAsset)) {
    try { files[filename] = readFileSync(path.join(repositoryRoot, filename), "utf8"); } catch { /* fail closed below */ }
  }
  for (const filename of trackedPaths.filter((name) => /^games\/[^/]+\/GAME_SPEC\.md$/u.test(name))) {
    try { files[filename] = readFileSync(path.join(repositoryRoot, filename), "utf8"); } catch { /* consumer scope fails closed */ }
  }
  let outputs = [];
  if (trackedPaths.includes("assets/build/manifest.json")) {
    try { outputs = JSON.parse(readFileSync(path.join(repositoryRoot, "assets/build/manifest.json"), "utf8")).outputs;
      if (!Array.isArray(outputs)) return ["Static asset manifest requires an outputs array."];
    } catch { return ["Static asset manifest could not be read."]; }
  }
  return validateVnextBoundaries({ files, trackedPaths, assetOutputs: outputs });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const errors = runVnextBoundaryCheck(process.cwd());
  if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
  else console.log("vNext browser/server and static publication boundary checks passed (no server exclusion/support certification).");
}
