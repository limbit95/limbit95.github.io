import { build } from "esbuild";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outdir = path.join(root, "assets", "build");
const templatePath = path.join(root, "index.template.html");
const indexPath = path.join(root, "index.html");
const configPath = path.join(root, "js", "config.js");

await rm(outdir, { recursive: true, force: true });
await mkdir(outdir, { recursive: true });

const result = await build({
  entryPoints: { app: path.join(root, "js", "app.js") },
  outdir,
  bundle: true,
  splitting: true,
  format: "esm",
  platform: "browser",
  target: ["es2022"],
  minify: true,
  treeShaking: true,
  metafile: true,
  legalComments: "none",
  entryNames: "[name]-[hash]",
  chunkNames: "chunks/[name]-[hash]",
  assetNames: "assets/[name]-[hash]",
  plugins: [
    {
      name: "external-community-runtime-config",
      setup(ctx) {
        ctx.onResolve({ filter: /config\.js(?:\?.*)?$/ }, (args) => {
          const cleanPath = args.path.split("?")[0].split("#")[0];
          const resolved = path.resolve(args.resolveDir, cleanPath);
          if (resolved === configPath) {
            return { path: "/js/config.js", external: true };
          }
          return null;
        });
      },
    },
  ],
});

const entry = Object.entries(result.metafile.outputs).find(([, meta]) => {
  if (!meta.entryPoint) return false;
  return path.resolve(root, meta.entryPoint) === path.join(root, "js", "app.js");
});

if (!entry) {
  throw new Error("Hashed community app entry was not emitted.");
}

const [entryOutput] = entry;
const entryRelative = path.relative(root, path.resolve(root, entryOutput)).replaceAll(path.sep, "/");
if (!entryRelative.startsWith("assets/build/app-") || !entryRelative.endsWith(".js")) {
  throw new Error(`Unexpected hashed app entry: ${entryRelative}`);
}

const template = await readFile(templatePath, "utf8");
const marker = "<!-- COMMUNITY_BUNDLE_ENTRY -->";
if (!template.includes(marker)) {
  throw new Error(`Missing ${marker} in index.template.html`);
}

const index = template.replace(
  marker,
  `<script type="module" src="./${entryRelative}"></script>`,
);
await writeFile(indexPath, index, "utf8");

const outputs = Object.keys(result.metafile.outputs)
  .map((output) => path.relative(root, path.resolve(root, output)).replaceAll(path.sep, "/"))
  .sort();

await writeFile(
  path.join(outdir, "manifest.json"),
  `${JSON.stringify({ entry: entryRelative, outputs }, null, 2)}\n`,
  "utf8",
);

console.log(`Built hashed community entry: ${entryRelative}`);
