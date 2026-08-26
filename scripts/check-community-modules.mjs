import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import vm from "node:vm";

const root = process.cwd();
const jsRoot = path.join(root, "js");
const moduleCache = new Map();
const gamePagePath = path.resolve(root, "js/pages/games.js");
let gameStub = null;

function stripQueryHash(specifier) {
  return specifier.split(/[?#]/, 1)[0];
}

function relative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function resolveModule(specifier, parentIdentifier) {
  if (!specifier.startsWith(".")) {
    throw new Error(`Unsupported non-relative module import: ${specifier} from ${parentIdentifier}`);
  }

  const parentPath = fileURLToPath(parentIdentifier);
  const cleanSpecifier = stripQueryHash(specifier);
  const resolved = path.resolve(path.dirname(parentPath), cleanSpecifier);
  const candidates = [resolved, `${resolved}.js`, path.join(resolved, "index.js")];
  const target = candidates.find((candidate) => fs.existsSync(candidate));
  if (!target) {
    throw new Error(`Module not found: ${specifier} from ${relative(parentPath)}`);
  }
  return target;
}

function getGameStub() {
  if (gameStub) return gameStub;
  gameStub = new vm.SyntheticModule(["renderGames"], () => {}, {
    identifier: "synthetic:community-games-page",
  });
  return gameStub;
}

function getModule(filePath) {
  const absolutePath = path.resolve(filePath);
  if (absolutePath === gamePagePath) return getGameStub();
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

function listJavaScriptFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listJavaScriptFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(fullPath);
  }
  return files;
}

function assertNoApiFacadeImport(filePath, specifier, label) {
  const source = fs.readFileSync(filePath, "utf8");
  const escaped = specifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(?:from\\s+|import\\s*\\()(["'])${escaped}\\1`);
  if (pattern.test(source)) {
    throw new Error(`${label} must import focused API modules instead of the eager ${specifier} facade.`);
  }
}

function assertLazyRouteBoundaries() {
  const appPath = path.join(jsRoot, "app.js");
  const appSource = fs.readFileSync(appPath, "utf8");
  if (/^\s*import\s+[^;\n]+from\s+["']\.\/pages\//m.test(appSource)) {
    throw new Error("js/app.js must lazy-load route page modules instead of eagerly importing ./pages/*.");
  }

  const adminPath = path.join(jsRoot, "pages/admin.js");
  const adminSource = fs.readFileSync(adminPath, "utf8");
  if (/^\s*import\s+[^;\n]+from\s+["']\.\/admin\//m.test(adminSource)) {
    throw new Error("js/pages/admin.js must lazy-load individual admin sections.");
  }

  assertNoApiFacadeImport(path.join(jsRoot, "components/header.js"), "../api.js", "js/components/header.js");
  assertNoApiFacadeImport(path.join(jsRoot, "notifications.js"), "./api.js", "js/notifications.js");
  assertNoApiFacadeImport(path.join(jsRoot, "pages/home.js"), "../api.js", "js/pages/home.js");
}

async function assertNamedExportValidationWorks() {
  const provider = new vm.SyntheticModule(["present"], () => {}, {
    identifier: "synthetic:named-export-provider",
  });
  const consumer = new vm.SourceTextModule(
    'import { missing } from "synthetic:named-export-provider"; export { missing };',
    { identifier: "synthetic:named-export-consumer" },
  );

  let rejected = false;
  try {
    await consumer.link(async () => provider);
  } catch (error) {
    rejected = /export|missing|requested module/i.test(String(error?.message ?? error));
  }

  if (!rejected) {
    throw new Error("Named export self-test failed: missing exports were not rejected during module linking.");
  }
}

await assertNamedExportValidationWorks();
assertLazyRouteBoundaries();

const entry = getModule(path.join(jsRoot, "app.js"));
await entry.link(linker);

for (const filePath of listJavaScriptFiles(jsRoot)) {
  if (path.resolve(filePath) === gamePagePath) continue;
  const module = getModule(filePath);
  if (module.status === "unlinked") await module.link(linker);
}

console.log(`Community module links passed (${moduleCache.size} modules, games page stubbed, lazy route and focused API boundaries enforced).`);