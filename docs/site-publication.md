# Static publication preparation — STEP7D P1

Status: publication preparation result **approved** on 2026-10-15; PR #424 merged
into integration at `73c9728b35b351d125f9a9853a4e21ede79b8273`, but not into main or deployed.
Merge evidence: [CP0103](game-platform-rebuild/checkpoints/CP-0103-step-7d-p1-publication-merged.md). Approved result: `8b58bdeaa47653f8ea74d2ceef04c2ab903cedd6`.
Approval/current-record changes are separate; see [CP0102](game-platform-rebuild/checkpoints/CP-0102-step-7d-p1-publication-approved.md).
P1 is **not resolved**. Actual game behavior is
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

## Slice A — uploaded artifact gate (APPROVED / INTEGRATION_NOT_MERGED)

The preparation workflow now checks the actual uploaded Pages artifact before
its dependent deployment job can start. It uses the upload action's artifact ID,
reads run/artifact metadata with `actions: read`, downloads that ID through `gh`,
and checks the downloaded ZIP SHA-256 against GitHub's artifact digest. Python
3.11+ standard-library ZIP/tar readers inspect the payload without extracting it.
The supported wrapper contains exactly `artifact.tar`; regular files must match
the source manifest's path, source, size and SHA-256 exactly. Normal directory
entries are allowed only for those files' ancestors. Duplicate/unsafe paths,
links, sparse files, devices, extra/missing files, extended tar metadata and
nonzero trailing content fail closed. Packages over 1 GiB are unsupported here.
The raw tar header name and prefix/name are checked before accepting the parser's
normalized path: absolute or empty names are rejected; only `.` and `./` are
accepted as root directories. Normal parent directories remain supported.
This restricted format passed a local GNU tar contract with all 384 public files;
it is not evidence that an actual Pages upload/deployment has run.

Checkout HEAD, manifest sourceRevision, run SHA, repository, explicit main dispatch,
run ID/attempt and artifact origin must agree. Every attempt uses a distinct name
`github-pages-<run-id>-<attempt>`. Before deployment, the job checks that this run
still has exactly one artifact with that name and the same verified ID/digest.
The pinned deploy action consumes that unique name from the same run. No overwrite
or extra Pages upload occurs between verification and deployment. This relies on
GitHub's immutable artifact identity and the reviewed workflow/permissions; it is
not an atomic guarantee against an administrator replacing the workflow or an
unrelated privileged actor. Re-running only failed jobs with a new attempt but
an old prepare output fails closed; use a separately authorized full attempt.

A verification error fails prepare (no continue-on-error); `needs: prepare`
blocks deploy. The deployment identity recheck can also block the deploy action.
The small verification report is retained outside public as
`site-publication-verified-<run-id>-<attempt>`; it is still not the public artifact
or a P1 certificate. Same-ref publication runs are serialized. `publish: true`
continues to authorize the package-and-deploy path, not package-only execution.

Tests: `node --test tests/game-platform-publication*.test.js` also executes the
Python fixture contracts via the existing `test:game-platform` Node glob. No
network is used by these fixtures. Current test/Guard success does not establish
actual model/game support, behavior PASS, live exclusion or operational health.

Slice A was approved by the user on 2026-10-17 at head
`8876fc0bd5e0e6412409b4a9e234a5cd7f065289` after Astra found F1 resolved.
See [CP0105](game-platform-rebuild/checkpoints/CP-0105-step-7d-p1-slice-a-approved.md).
Integration merge remains a separate decision. P1 is unresolved and STEP7D as a
whole is incomplete. Main-only publication separation and its root-plan exception
also remain separate decisions; this approval does not change the exact384 policy
or authorize settings, dispatch, upload, deployment, Guard release or model work.

## Workflow and remaining gate

`.github/workflows/site-pages-publication.yml` validates pull requests and manual
dispatches. No push event deploys. Pages packaging and deployment both require
explicit `workflow_dispatch`, `publish: true`, and `refs/heads/main`. The build
job is read-only; only the gated deployment job requests Pages/OIDC permissions.
It uploads `.site-publication/public`, never repository root, and deployment
consumes the verified attempt-specific Pages artifact from the same run. The separate evidence artifact records
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
