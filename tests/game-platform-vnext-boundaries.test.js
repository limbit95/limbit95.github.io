import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import {
  MODEL_ORACLE_OBLIGATIONS, isBrowserAsset, resolveRepositoryReference, sourceModuleEdges,
  validateModelOracleConfiguration, validateModelOracleSelection, validateVnextBoundaries,
} from "../scripts/check-game-platform-vnext-boundaries.mjs";
import { platformGameIdFromPath, validatePullRequestChanges } from "../scripts/check-game-platform-governance.mjs";

function oracleFixture() {
  const file = "tests/game-platform-vnext-fixture.test.js";
  const source = MODEL_ORACLE_OBLIGATIONS.map((id) => `test('${id}', () => fixtureAssertion());`).join("\n");
  return {
    config: { models: [{ contract: "fixture/1", online: true, owner: "docs/game-platform-model-contracts.md#fixture",
      environment: "isolated authority fixture", runner: "node-contract", implementation: "services/game-platform-vnext/fixture.mjs",
      coverage: Object.fromEntries(MODEL_ORACLE_OBLIGATIONS.map((id) => [id, { file, test: id }])) }] },
    files: { [file]: source, "services/game-platform-vnext/fixture.mjs": "fixture only" },
    documents: { "docs/game-platform-model-contracts.md": '<a id="fixture"></a>\n- Model contract: fixture/1' },
  };
}

test("literal static/re-export/dynamic module edges ignore comments and decode escaped paths", () => {
  assert.deepEqual(sourceModuleEdges(`// import 'ignored';\nimport { x } from '../shared/a.js';
    export { x } from '../shared/b.js'; import('../shared/' + 'c.js?x');
    import('\\x2e\\x2e/services/game-platform-vnext/gate.mjs');`),
  ["../shared/a.js", "../shared/b.js", "../shared/c.js?x", "../services/game-platform-vnext/gate.mjs"]);
});

test("path normalization closes encoded traversal/query/hash aliases", () => {
  assert.equal(resolveRepositoryReference("games/shared/vnext/core/x.js", "../../../../%73ervices/game-platform-vnext/gate.mjs?q#x"),
    "services/game-platform-vnext/gate.mjs");
});

test("relative browser references clamp traversal at the origin root", () => {
  for (const reference of [
    "../../services/game-platform-vnext/gate.mjs",
    "../../../%73ervices/game-platform-vnext/gate.mjs?q#x",
    "..\\..\\services\\game-platform-vnext\\gate.mjs",
  ]) {
    assert.equal(resolveRepositoryReference("js/app.js", reference), "services/game-platform-vnext/gate.mjs");
    assert.match(validateVnextBoundaries({ files: { "js/app.js": "import " + JSON.stringify(reference.replaceAll("\\", "/")) + ";" } }).join("\n"),
      /boundary violation/u);
  }
  assert.equal(resolveRepositoryReference("js/pages/app.js", "../shared.js?q#x"), "js/shared.js");
  assert.equal(resolveRepositoryReference("js/app.js", "./bridge.js"), "js/bridge.js");
  assert.deepEqual(validateVnextBoundaries({ files: { "js/app.js": "import '../games/shared/index.js';" } }), []);
});

test("HTML inline executable modules and classic dynamic imports cannot reach server code", () => {
  for (const body of [
    '<script type="module">import "/services/game-platform-vnext/gate.mjs";</script>',
    '<script TYPE=module>export * from "/services/game-platform-vnext/gate.mjs";</script>',
    '<script>import("/services/game-platform-vnext/gate.mjs");</script>',
    '<script type="text/javascript">import("/services/game-platform-vnext/" + "gate.mjs");</script>',
  ]) assert.match(validateVnextBoundaries({ files: { "invite.html": body } }).join("\n"), /boundary violation/u);
});

test("quoted CSS imports are checked in stylesheets and inline HTML styles", () => {
  for (const body of [
    '@import "/services/game-platform-vnext/theme.css";',
    "@IMPORT '/services/game-platform-vnext/theme.css' screen;",
    '@import url("/services/game-platform-vnext/theme.css");',
  ]) {
    assert.match(validateVnextBoundaries({ files: { "css/page.css": body } }).join("\n"), /boundary violation/u);
    assert.match(validateVnextBoundaries({ files: { "invite.html": "<style>" + body + "</style>" } }).join("\n"), /boundary violation/u);
  }
});

test("quoted CSS imports without whitespace or with separating comments cannot reach server code", () => {
  for (const quote of ['"', "'"]) {
    for (const separator of ["", "/*comment*/", " /*comment*/ "]) {
      const body = "@import" + separator + quote + "/services/game-platform-vnext/theme.css" + quote + ";";
      for (const [filename, source] of [
        ["css/page.css", body],
        ["invite.html", "<style>" + body + "</style>"],
      ]) assert.match(validateVnextBoundaries({ files: { [filename]: source } }).join("\n"), /boundary violation/u,
        filename + ": " + body);
    }
  }
});

test("compact quoted CSS imports preserve allowed assets and ignore comments and example strings", () => {
  const body = [
    '@import"/css/base.css";',
    "@import/*comment*/'../games/shared/theme.css';",
    '/* @import"/services/game-platform-vnext/theme.css"; */',
    'a::before { content: "@import\'/services/game-platform-vnext/example.css\';"; }',
    "a::after { content: '@import\"/services/game-platform-vnext/example.css\";'; }",
  ].join("\n");
  assert.deepEqual(validateVnextBoundaries({ files: {
    "css/page.css": body,
    "invite.html": "<style>" + body + "</style>",
  } }), []);
});

test("comments, inert scripts and ignored external-script bodies do not create inline edges", () => {
  assert.deepEqual(validateVnextBoundaries({ files: {
    "invite.html": [
      '<!-- <script type="module">import "/services/game-platform-vnext/gate.mjs";</script> -->',
      '<script type="application/json">{"example":"import /services/game-platform-vnext/gate.mjs"}</script>',
      '<script type="text/plain">import "/services/game-platform-vnext/gate.mjs";</script>',
      '<script src="/js/app.js">import "/services/game-platform-vnext/gate.mjs";</script>',
      '<script type="module">// import "/services/game-platform-vnext/gate.mjs";\nimport "/games/shared/index.js";</script>',
      '<p>Example: @import "/services/game-platform-vnext/theme.css";</p>',
      '<style>/* @import "/services/game-platform-vnext/theme.css"; */ @import "/css/page.css";</style>',
    ].join("\n"),
    "css/page.css": '/* @import "/services/game-platform-vnext/theme.css"; */ @import "/css/base.css";'
      + 'a::before { content: "@import \'/services/game-platform-vnext/example.css\';"; }',
  } }), []);
});

test("browser static, dynamic, re-export and resource edges cannot reach server implementation", () => {
  for (const body of [
    "import x from '/services/game-platform-vnext/gate.mjs';",
    "export { x } from '/services/game-platform-vnext/gate.mjs';",
    "import('/services/game-platform-vnext/gate.mjs?x');",
    "new Worker(new URL('/services/game-platform-vnext/gate.mjs', import.meta.url));",
    'import(`/services/game-platform-vnext/${name}.mjs`);',
  ]) assert.match(validateVnextBoundaries({ files: { "js/page.js": body } }).join("\n"), /Browser\/server boundary violation/u);
  assert.match(validateVnextBoundaries({ files: { "index.html": '<script src="/services/game-platform-vnext/gate.js"></script>' } }).join("\n"), /boundary violation/u);
  assert.match(validateVnextBoundaries({ files: { "invite.html": '<script src="/services/game-platform-vnext/gate.js"></script>' } }).join("\n"), /boundary violation/u);
  assert.match(validateVnextBoundaries({ files: { "games/shared/x.css": 'a{background:url(/services/game-platform-vnext/x)}' } }).join("\n"), /boundary violation/u);
  assert.match(validateVnextBoundaries({ files: { "css/page.css": 'a{background:url(/services/game-platform-vnext/x)}' } }).join("\n"), /boundary violation/u);
});

test("indirect browser import closure is covered through each tracked module", () => {
  assert.match(validateVnextBoundaries({ files: {
    "js/app.js": "import './bridge.js';", "js/bridge.js": "export * from '../services/game-platform-vnext/gate.mjs';",
  } }).join("\n"), /js\/bridge.js/u);
});

test("server files fail closed without a verified static exclusion even with no imports", () => {
  assert.match(validateVnextBoundaries({ files: {}, trackedPaths: ["services/game-platform-vnext/gate.mjs"] }).join("\n"), /exclusion is unverified/u);
});

test("static output manifests cannot claim a server artifact as a browser output", () => {
  assert.match(validateVnextBoundaries({ files: {}, assetOutputs: ["./services/game-platform-vnext/gate.js"] }).join("\n"), /manifest exposes server/u);
});

test("missing browser bytes are a failure rather than an empty successful scan", () => {
  assert.match(validateVnextBoundaries({ files: {}, trackedPaths: ["js/app.js"] }).join("\n"), /could not read/u);
});

test("legacy imports and comment-only server examples do not require migration", () => {
  assert.deepEqual(validateVnextBoundaries({ files: {
    "games/cant-stop/app.js": "import { x } from '../shared/index.js'; // '/services/game-platform-vnext/a.js'",
    "games/shared/index.js": "export { x } from './registry.js';",
  } }), []);
});

test("the existing barrel cannot become a vNext re-export route", () => {
  assert.match(validateVnextBoundaries({ files: { "games/shared/index.js": "export * from './vnext/core/index.js';" } }).join("\n"), /barrel must not/u);
});

test("a game importing vNext must identify its consumer contract scope", () => {
  const files = { "games/new-game/app.js": "import '../shared/vnext/core/index.js';" };
  assert.match(validateVnextBoundaries({ files }).join("\n"), /must declare its scoped/u);
  files["games/new-game/GAME_SPEC.md"] = "- Platform contract: GP-COMMON/1";
  assert.deepEqual(validateVnextBoundaries({ files }), []);
});

test("nested shared entries require both contract test and documentation changes", () => {
  const change = { path: "games/shared/vnext/core/index.mjs", status: "A" };
  assert.equal(platformGameIdFromPath(change.path), null);
  assert.equal(validatePullRequestChanges({ changedFiles: [change] }).length, 2);
  assert.deepEqual(validatePullRequestChanges({ changedFiles: [change,
    { path: "tests/game-platform-vnext-core.test.js", status: "A" }, { path: "games/README.md", status: "M" }] }), []);
});

test("server-only additions are discovered and cannot mix with legacy runtime", () => {
  const change = { path: "services/game-platform-vnext/gate.py", status: "A" };
  assert.equal(validatePullRequestChanges({ changedFiles: [change] }).length, 2);
  assert.match(validatePullRequestChanges({ changedFiles: [change, { path: "the-game/js/app.js", status: "M" }] }).join("\n"), /Do not mix Legacy/u);
});

test("the legacy flat shared barrel exception is preserved", () => {
  assert.deepEqual(validatePullRequestChanges({ changedFiles: [{ path: "games/shared/index.js", status: "A" }] }), []);
});

test("empty shipped oracle discovery configuration admits no model", () => {
  const config = JSON.parse(readFileSync(new URL('./game-platform-vnext-model-oracles.json', import.meta.url), 'utf8'));
  assert.deepEqual(config, { models: [] });
  assert.deepEqual(validateModelOracleConfiguration({ config }), []);
  assert.match(validateModelOracleSelection({ contract: "unselected/1", online: true, config }).join("\n"), /unsupported/u);
});

test("a fixture with real structural bindings proves discovery, not production support", () => {
  const fixture = oracleFixture();
  assert.deepEqual(validateModelOracleConfiguration(fixture), []);
  assert.deepEqual(validateModelOracleSelection({ contract: "fixture/1", online: true, ...fixture }), []);
});

test("each of safety11, A/C/P, lifetime and adoption-recovery needs its own bound oracle", () => {
  for (const id of MODEL_ORACLE_OBLIGATIONS) {
    const fixture = oracleFixture(); delete fixture.config.models[0].coverage[id];
    assert.match(validateModelOracleConfiguration(fixture).join("\n"), new RegExp(id, "u"));
  }
});

test("named files without their test case and an environment cannot waive safety", () => {
  const fixture = oracleFixture(); fixture.files["tests/game-platform-vnext-fixture.test.js"] = "// no executable cases";
  fixture.config.models[0].environment = "UNKNOWN";
  const errors = validateModelOracleConfiguration(fixture).join("\n");
  assert.match(errors, /actual oracle environment/u); assert.match(errors, /safety11/u);
});

test("comment-only oracle names and a contract under another anchor are not evidence", () => {
  const fixture = oracleFixture();
  fixture.files["tests/game-platform-vnext-fixture.test.js"] = MODEL_ORACLE_OBLIGATIONS.map((id) => `// test('${id}', () => {});`).join("\n");
  assert.match(validateModelOracleConfiguration(fixture).join("\n"), /safety01/u);
  fixture.documents["docs/game-platform-model-contracts.md"] = '<a id="fixture"></a>\n<a id="other"></a>\n- Model contract: fixture/1';
  assert.match(validateModelOracleConfiguration(fixture).join("\n"), /single MO owner/u);
});

test("online models cannot mark private-state or other safety obligations N/A", () => {
  const fixture = oracleFixture(); fixture.config.models[0].coverage.safety11 = { notApplicable: "no private data" };
  assert.match(validateModelOracleConfiguration(fixture).join("\n"), /safety11/u);
});

test("model revision, single-owner anchor, implementation and consumer scope are checked", () => {
  const fixture = oracleFixture();
  assert.match(validateModelOracleSelection({ contract: "fixture/2", online: true, ...fixture }).join("\n"), /unsupported/u);
  assert.match(validateModelOracleSelection({ contract: "fixture/1", online: false, ...fixture }).join("\n"), /online scope/u);
  fixture.config.models[0].owner = "other.md#fixture";
  fixture.config.models[0].implementation = "games/shared/vnext/gate.js";
  const errors = validateModelOracleConfiguration(fixture).join("\n");
  assert.match(errors, /single MO owner/u); assert.match(errors, /execution scope/u);
});

test("pure local applicability cannot waive lifetime and final adoption evidence", () => {
  const fixture = oracleFixture(); const model = fixture.config.models[0]; model.online = false;
  model.implementation = "games/shared/vnext/fixture.js"; fixture.files[model.implementation] = "fixture";
  for (const row of MODEL_ORACLE_OBLIGATIONS) model.coverage[row] = { notApplicable: "pure local test context" };
  const errors = validateModelOracleConfiguration(fixture).join("\n");
  assert.match(errors, /lifetime/u); assert.match(errors, /adoptionRecovery/u);
});

test("duplicate descriptors and undiscovered nested tests are rejected", () => {
  const fixture = oracleFixture(); fixture.config.models.push(structuredClone(fixture.config.models[0]));
  assert.match(validateModelOracleConfiguration(fixture).join("\n"), /Duplicate/u);
  fixture.config.models.pop(); fixture.config.models[0].coverage.safety01.file = "tests/nested/model.test.js";
  assert.match(validateModelOracleConfiguration(fixture).join("\n"), /safety01/u);
});

test("disposable DB runner links remain distinct from flat non-DB contract discovery", () => {
  const fixture = oracleFixture(); const model = fixture.config.models[0]; model.runner = "disposable-db";
  assert.match(validateModelOracleConfiguration(fixture).join("\n"), /safety01/u);
  const dbFile = "tests/game-db-integration/fixture.test.js";
  fixture.files[dbFile] = fixture.files["tests/game-platform-vnext-fixture.test.js"];
  for (const row of Object.values(model.coverage)) row.file = dbFile;
  assert.deepEqual(validateModelOracleConfiguration(fixture), []);
});

test("existing workflow discovers server-only and boundary/config changes without a new workflow", () => {
  const workflow = readFileSync(new URL('../.github/workflows/game-platform-governance.yml', import.meta.url), 'utf8');
  for (const wanted of ['services/game-platform-vnext/**', 'scripts/check-game-platform-vnext-boundaries.mjs', 'tests/game-platform-vnext-model-oracles.json']) {
    assert.ok(workflow.includes(`- "${wanted}"`), wanted);
  }
  assert.ok(workflow.includes('run: node scripts/check-game-platform-vnext-boundaries.mjs'));
});

test("every tracked and supported browser asset change triggers the existing boundary workflow", () => {
  const workflow = readFileSync(new URL("../.github/workflows/game-platform-governance.yml", import.meta.url), "utf8");
  const filters = [...workflow.split("\njobs:")[0].matchAll(/^\s+- "([^"]+)"$/gmu)].map((match) => match[1]);
  const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: new URL("../", import.meta.url), encoding: "utf8" }).split("\0").filter(Boolean);
  const examples = ["invite.html", "css/page.css", "activity-link.html"];
  for (const root of ["", "js/", "css/", "games/shared/vnext/", "liar-game/", "the-game/", "marble-game/", "assets/"]) {
    for (const extension of ["js", "mjs", "html", "css", "JS", "MJS", "HTML", "CSS"]) examples.push(root + "probe." + extension);
  }
  for (const filename of [...tracked, ...examples].filter(isBrowserAsset)) {
    assert.ok(filters.some((filter) => path.matchesGlob(filename, filter)), "Boundary CI misses " + filename);
  }
  assert.equal(filters.some((filter) => path.matchesGlob("unrelated-server/file.js", filter)), false);
});
