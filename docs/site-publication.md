# Static publication preparation — STEP7D P1

Status: local preparation only. P1 is **not resolved**. Actual game behavior is
**NOT_RUN**; operation is **UNKNOWN**. No model, backend, or Adapter is implemented
or supported by this change. Existing server admission Guard remains unchanged.

## Current publisher and proposed boundary

Read-only Pages settings observation on 2026-10-15: **Deploy from a branch**, branch
`main`, directory `/ (root)`. The previous successful generated Pages run
`36669119022` built commit `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09` and uploaded
path `.`. That is the active publisher, not the workflow prepared here. Its
artifact `11077057593` is no longer available for direct inspection. These facts
do not establish exclusion of future server files from the current publisher.

The proposed publisher assembles only the 384 exact paths in
`scripts/site-publication-files.json` into `.site-publication/public/`. Existing
public HTML, JS, CSS, images, CNAME, webmanifest and legacy game routes keep their
paths and bytes. Repository documents, tests, scripts, SQL, templates, archives,
source maps and server trees are not copied. They are intentionally absent from
the proposed public artifact. This is not a promise to preserve direct public
URLs for repository-internal files.

## Local contract

```sh
npm ci --no-audit --no-fund
npm run build:assets
node --test tests/game-platform-publication.test.js
node scripts/check-game-platform-governance.mjs
node scripts/check-game-platform-vnext-boundaries.mjs
npm run build:publication
npm run check:publication
```

The policy is an exact file list, not an exclusion inferred from directory names
or ignore rules. Newly tracked runtime candidates require explicit policy review.
Source files and their parents must be regular, without symlinks. Tracked server
source/artifact bytes cannot be copied under a public alias with identical bytes.
Browser references to the server root are rejected using the existing helper.
Local literal module, HTML/CSS and webmanifest references must resolve within
the public set; Marble's existing import map is checked under its declared module
root. No browser import map is modified.

The existing asset builder records actual esbuild inputs in its manifest.
Inputs and outputs must be in the approved public set. Workflow rebuild plus
committed-output comparison connects these records to generated bundles.
Standalone assembly does not prove a preexisting bundle's internal provenance.

Independent output checking requires the exact file set and identical source
bytes, including sizes and SHA-256 recorded in `.site-publication/manifest.json`
outside the public directory. Extra, missing, changed or symlinked output fails.
The manifest records the checkout revision; local uncommitted work must also be
identified by its review patch. A manifest is not an external attestation.

Static literal checks do not prove arbitrary dynamic URL construction, external
CDN availability, transformed server-code provenance, browser rendering, service
worker cache migration, Auth, database behavior or operational health. The
existing service-worker bytes are preserved; production cutover/cache validation
remains a separate authorized follow-up.

## Workflow and remaining gate

`.github/workflows/site-pages-publication.yml` validates pull requests and manual
dispatches. No push event deploys. Pages packaging and deployment both require
explicit `workflow_dispatch`, `publish: true`, and `refs/heads/main`. The build
job is read-only; only the gated deployment job requests Pages/OIDC permissions.
It uploads `.site-publication/public`, never repository root, and deployment
consumes `github-pages` from the same run. The separate evidence artifact records
the checkout and exact inventory. The default dispatch does not deploy.

This workflow does not change the current branch publisher. Actual adoption
requires separately authorized review/submission, main integration as appropriate,
changing Pages source to GitHub Actions, and verifying a real deployment's
commit → workflow run → uploaded public artifact → deployment connection and
exclusion evidence. No such action was performed here. Do not unlock the server
Guard or start model implementation on the strength of local preparation.

Approved Target §6.1, STEP7B plan §7 in full, empty-model/unsupported-combination
blocking, vNext runtime/online blocking, existing online DB requirement,
server-exclusion-unconfirmed blocking, H1–4, single adoption/recovery, safety11,
current A/C/P/hostless and the ban on unapproved rematch exceptions remain in
force. Core/model/backend/site Auth responsibilities and all later obligations
are unchanged. Tests, fixtures, documents and CI are not actual support or
behavior PASS. Historical approval/checkpoint documents are not rewritten.
