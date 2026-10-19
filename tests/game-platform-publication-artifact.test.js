import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("uploaded Pages ZIP/tar and run identity contracts (Python standard library)", () => {
  execFileSync("python3", [fileURLToPath(new URL("./fixtures/site-publication-artifact-cases.py", import.meta.url)), "-v"], { stdio: "pipe" });
});

test("verification failures block deploy and every attempt consumes only its uploaded artifact", () => {
  const workflow = readFileSync(new URL("../.github/workflows/site-pages-publication.yml", import.meta.url), "utf8");
  const [prepare, deploy] = workflow.split("\n  deploy:\n");
  assert.match(prepare, /id: package/);
  assert.match(prepare, /id: verify/);
  assert.match(prepare, /PAGES_ARTIFACT_ID: \$\{\{ steps.package.outputs.artifact_id \}\}/);
  assert.match(deploy, /needs: prepare/);
  assert.match(deploy, /PAGES_ARTIFACT_ID: \$\{\{ needs.prepare.outputs.artifact_id \}\}/);
  assert.match(deploy, /PAGES_ARTIFACT_DIGEST: \$\{\{ needs.prepare.outputs.artifact_digest \}\}/);
  assert.ok(deploy.indexOf("--identity-only") < deploy.indexOf("actions/deploy-pages@"));
  assert.doesNotMatch(workflow, /continue-on-error|always\(\)|overwrite:|pull_request_target/);
  const name = "github-pages-${{ github.run_id }}-${{ github.run_attempt }}";
  assert.ok(prepare.includes(`name: ${name}`));
  assert.ok(deploy.includes(`artifact_name: ${name}`));
  assert.match(workflow, /cancel-in-progress: false/);
});
