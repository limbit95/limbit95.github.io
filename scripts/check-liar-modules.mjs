import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import vm from "node:vm";

const root = process.cwd();
const moduleCache = new Map();

function resolveModule(specifier, parentIdentifier) {
  if (!specifier.startsWith(".")) {
    throw new Error(`Unsupported non-relative module import: ${specifier} from ${parentIdentifier}`);
  }
  const parentPath = fileURLToPath(parentIdentifier);
  const resolved = path.resolve(path.dirname(parentPath), specifier);
  const candidates = [resolved, `${resolved}.js`, path.join(resolved, "index.js")];
  const target = candidates.find((candidate) => fs.existsSync(candidate));
  if (!target) throw new Error(`Module not found: ${specifier} from ${path.relative(root, parentPath)}`);
  return target;
}

function getModule(filePath) {
  const absolutePath = path.resolve(filePath);
  if (moduleCache.has(absolutePath)) return moduleCache.get(absolutePath);
  const source = fs.readFileSync(absolutePath, "utf8");
  const module = new vm.SourceTextModule(source, {
    identifier: pathToFileURL(absolutePath).href,
  });
  moduleCache.set(absolutePath, module);
  return module;
}

const linker = async (specifier, referencingModule) => {
  const target = resolveModule(specifier, referencingModule.identifier);
  return getModule(target);
};

const entries = [
  "liar-game/js/app.js",
  "liar-game/js/discussionChat.js",
  "liar-game/js/drawingBoard.js",
  "liar-game/js/resultRevealCountdown.js",
  "liar-game/js/resultEffects.js",
];

for (const entry of entries) {
  const module = getModule(path.join(root, entry));
  if (module.status === "unlinked") await module.link(linker);
}

console.log(`Liar Game module links passed (${moduleCache.size} modules).`);
