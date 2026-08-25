import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];

function fail(message) {
  errors.push(message);
}

function relativeFile(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(target);
    return [target];
  });
}

function stripQueryHash(specifier) {
  return specifier.split(/[?#]/, 1)[0];
}

function checkRelativeImports(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const importPattern = /(?:import|export)\s+(?:[^'";]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1] ?? match[2];
    if (!specifier?.startsWith(".")) continue;
    const resolved = path.resolve(path.dirname(filePath), stripQueryHash(specifier));
    const candidates = [resolved, `${resolved}.js`, path.join(resolved, "index.js")];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) {
      fail(`${relativeFile(filePath)}: import target not found: ${specifier}`);
    }
  }
}

function checkIndexAssets() {
  const indexPath = path.join(root, "index.html");
  const html = fs.readFileSync(indexPath, "utf8");
  const localAssetPattern = /(?:href|src)=["']\.\/([^"']+)["']/g;
  for (const match of html.matchAll(localAssetPattern)) {
    const asset = stripQueryHash(match[1]);
    if (/^https?:/i.test(asset)) continue;
    const target = path.join(root, asset);
    if (!fs.existsSync(target)) fail(`index.html: referenced file not found: ./${asset}`);
  }
  if (html.includes("theme.css")) {
    fail("index.html: removed theme.css is still referenced");
  }
}

function checkCssBraces() {
  for (const filePath of walk(path.join(root, "css")).filter((file) => file.endsWith(".css"))) {
    const source = fs.readFileSync(filePath, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    let depth = 0;
    for (const char of source) {
      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;
      if (depth < 0) break;
    }
    if (depth !== 0) fail(`${relativeFile(filePath)}: unbalanced CSS braces`);
  }
}

const siteJsFiles = walk(path.join(root, "js"))
  .filter((file) => file.endsWith(".js"))
  .filter((file) => relativeFile(file) !== "js/pages/games.js");

siteJsFiles.forEach(checkRelativeImports);
checkIndexAssets();
checkCssBraces();

if (errors.length) {
  console.error("Site static checks failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Site static checks passed (${siteJsFiles.length} site JS files).`);
