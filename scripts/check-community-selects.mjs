import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function relative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

const files = walk(path.join(root, "js"))
  .filter((filePath) => filePath.endsWith(".js"))
  .filter((filePath) => relative(filePath) !== "js/pages/games.js");

for (const filePath of files) {
  const source = fs.readFileSync(filePath, "utf8");
  const file = relative(filePath);

  if (/\.select\(\s*["']\*["']/.test(source)) {
    failures.push(`${file}: direct wildcard .select(\"*\") is not allowed`);
  }
  if (/\.select\(\s*\)/.test(source)) {
    failures.push(`${file}: bare .select() is not allowed; declare returned columns`);
  }
  if (source.includes(".select(") && /\(\s*\*\s*\)/.test(source)) {
    failures.push(`${file}: referenced-table wildcard (*) is not allowed`);
  }
}

if (failures.length) {
  console.error("Community explicit-column checks failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Community explicit-column checks passed (${files.length} site JS files).`);
