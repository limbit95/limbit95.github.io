import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const jsRoot = path.join(root, "js");
const facadePath = path.join(jsRoot, "api.js");
const excludedFiles = new Set([
  path.join(jsRoot, "pages", "games.js"),
]);

const domainFiles = [
  "profiles.js",
  "activities.js",
  "boards.js",
  "admin.js",
  "polls.js",
  "notifications.js",
];

function exportedNames(source) {
  const names = new Set();
  for (const match of source.matchAll(/\bexport\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g)) names.add(match[1]);
  for (const match of source.matchAll(/\bexport\s+(?:const|let|var|class)\s+([A-Za-z_$][\w$]*)/g)) names.add(match[1]);
  for (const match of source.matchAll(/\bexport\s*\{([^}]+)\}/g)) {
    for (const raw of match[1].split(",")) {
      const name = raw.trim().split(/\s+as\s+/i).at(-1)?.trim();
      if (name) names.add(name);
    }
  }
  return names;
}

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

const exportOwners = new Map();
for (const filename of domainFiles) {
  const domainPath = path.join(jsRoot, "api", filename);
  const source = await readFile(domainPath, "utf8");
  for (const name of exportedNames(source)) {
    if (exportOwners.has(name)) {
      throw new Error(`Duplicate API export ${name}: ${exportOwners.get(name)} and ${filename}`);
    }
    exportOwners.set(name, filename);
  }
}

const importPattern = /import\s*\{([\s\S]*?)\}\s*from\s*["']([^"']*api\.js(?:\?[^"']*)?)["'];?/g;
let changedFiles = 0;
let rewrittenImports = 0;

for (const filePath of await walk(jsRoot)) {
  if (filePath === facadePath || excludedFiles.has(filePath) || filePath.startsWith(path.join(jsRoot, "api") + path.sep)) continue;
  const original = await readFile(filePath, "utf8");
  let changed = false;
  const next = original.replace(importPattern, (fullMatch, specifierText, importPath) => {
    const resolved = path.resolve(path.dirname(filePath), importPath.split("?")[0]);
    if (resolved !== facadePath) return fullMatch;

    const groups = new Map();
    const specs = specifierText.split(",").map((item) => item.trim()).filter(Boolean);
    for (const spec of specs) {
      const [importedName] = spec.split(/\s+as\s+/i);
      const domainFile = exportOwners.get(importedName.trim());
      if (!domainFile) {
        throw new Error(`Cannot map API facade import ${spec} in ${path.relative(root, filePath)}`);
      }
      if (!groups.has(domainFile)) groups.set(domainFile, []);
      groups.get(domainFile).push(spec);
    }

    const imports = [];
    for (const domainFile of domainFiles) {
      const names = groups.get(domainFile);
      if (!names?.length) continue;
      let relative = path.relative(path.dirname(filePath), path.join(jsRoot, "api", domainFile)).replaceAll(path.sep, "/");
      if (!relative.startsWith(".")) relative = `./${relative}`;
      if (names.length === 1) imports.push(`import { ${names[0]} } from "${relative}";`);
      else imports.push(`import {\n  ${names.join(",\n  ")},\n} from "${relative}";`);
    }

    changed = true;
    rewrittenImports += 1;
    return imports.join("\n");
  });

  if (changed) {
    await writeFile(filePath, next, "utf8");
    changedFiles += 1;
  }
}

const remaining = [];
for (const filePath of await walk(jsRoot)) {
  if (filePath === facadePath || excludedFiles.has(filePath) || filePath.startsWith(path.join(jsRoot, "api") + path.sep)) continue;
  const source = await readFile(filePath, "utf8");
  importPattern.lastIndex = 0;
  for (const match of source.matchAll(importPattern)) {
    const resolved = path.resolve(path.dirname(filePath), match[2].split("?")[0]);
    if (resolved === facadePath) remaining.push(path.relative(root, filePath));
  }
}

if (remaining.length) {
  throw new Error(`Facade imports remain after rewrite: ${remaining.join(", ")}`);
}

console.log(`Rewrote ${rewrittenImports} facade imports across ${changedFiles} community files.`);
