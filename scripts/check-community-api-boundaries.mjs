import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const jsRoot = path.join(root, "js");
const facadePath = path.join(jsRoot, "api.js");
const legacyCompatPath = path.join(jsRoot, "api", "legacy-compat.js");
const excludedFiles = new Set([
  facadePath,
  path.join(jsRoot, "pages", "games.js"),
]);
const legacyExportNames = new Set([
  "listMyParticipations",
  "listComments",
  "listNotifications",
]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(fullPath);
  }
  return files;
}

const violations = [];
const importPattern = /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g;
const legacyExportPattern = /\bexport\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g;

for (const filePath of await walk(jsRoot)) {
  const source = await readFile(filePath, "utf8");

  if (!excludedFiles.has(filePath)) {
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1].split("?")[0].split("#")[0];
      if (!specifier.startsWith(".")) continue;
      const resolved = path.resolve(path.dirname(filePath), specifier);
      if (resolved === facadePath) {
        violations.push(`${path.relative(root, filePath)} imports compatibility facade ${match[1]}`);
      }
      if (resolved === legacyCompatPath) {
        violations.push(`${path.relative(root, filePath)} imports legacy compatibility module ${match[1]}`);
      }
    }
  }

  if (filePath.startsWith(path.join(jsRoot, "api") + path.sep) && filePath !== legacyCompatPath) {
    for (const match of source.matchAll(legacyExportPattern)) {
      if (legacyExportNames.has(match[1])) {
        violations.push(`${path.relative(root, filePath)} reintroduces legacy export ${match[1]}`);
      }
    }
  }
}

if (violations.length) {
  console.error("Community API boundary violations:\n" + violations.join("\n"));
  process.exit(1);
}

console.log("Community API boundary check passed: facade and legacy compatibility stay isolated.");
