import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const jsRoot = path.join(root, "js");
const facadePath = path.join(jsRoot, "api.js");
const excludedFiles = new Set([
  facadePath,
  path.join(jsRoot, "pages", "games.js"),
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

for (const filePath of await walk(jsRoot)) {
  if (excludedFiles.has(filePath) || filePath.startsWith(path.join(jsRoot, "api") + path.sep)) continue;
  const source = await readFile(filePath, "utf8");
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1].split("?")[0].split("#")[0];
    if (!specifier.startsWith(".")) continue;
    const resolved = path.resolve(path.dirname(filePath), specifier);
    if (resolved === facadePath) {
      violations.push(`${path.relative(root, filePath)} -> ${match[1]}`);
    }
  }
}

if (violations.length) {
  console.error("Community code must import domain APIs directly instead of js/api.js:\n" + violations.join("\n"));
  process.exit(1);
}

console.log("Community API boundary check passed: no modern facade imports.");
