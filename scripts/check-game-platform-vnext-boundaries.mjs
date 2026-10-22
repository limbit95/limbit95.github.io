import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VNEXT_MODEL_ORACLES_PATH, isBrowserAsset, validateVnextReferences } from "./game-platform-vnext-boundary-rules.mjs";
import { hasServerPublicationInputs, verifyCheckoutPublication } from "./build-site-publication.mjs";
export * from "./game-platform-vnext-boundary-rules.mjs";
const normalized = (value) => String(value).replaceAll("\\", "/");
const contractTestPath = (value) => /^tests\/game-platform-[^/]+\.test\.js$/u.test(value);
const dbTestPath = (value) => /^tests\/game-db-integration\/[^/]+\.test\.js$/u.test(value);

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
  const errors = validateVnextReferences({ files, trackedPaths, assetOutputs: outputs });
  if (errors.length) return errors;
  try { if (hasServerPublicationInputs(repositoryRoot)) verifyCheckoutPublication(repositoryRoot); }
  catch (error) { errors.push(`Server publication exclusion failed for current checkout: ${error.message}`); }
  return errors;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const errors = runVnextBoundaryCheck(process.cwd());
  if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
  else console.log("vNext boundary checks passed (local checkout exclusion only; no remote publication/runtime support certification).");
}
