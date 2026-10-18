# STEP7D P1 Slice B — main preparation submission

2026-10-18 KST. **PUBLICATION_PREPARATION_APPROVED / MAIN_NOT_MERGED / P1 unresolved / STEP7D incomplete / model·Adapter not started / behavior NOT_RUN / operations UNKNOWN**.

## User result approval — 2026-10-18 15:12:01 KST

- PR #427 approved publication preparation: head `b7558eb4fa3d36a635a801b06fa44120b78695de`, tree `745ae1e36e5083c2edda8354a6ec582ab29c885f`, base main @ `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`.
- PR #428 separately approved exception record: head `7b5774be691a60e47322aff7a0b73c730f3ea3f8`, tree `c342181c3e8b8cb659ef4eac1d001c0dae79ce1f`, base integration @ `57da5eda0511af4b7b6cf23348887e9f2484770a`.
- Astra's `game-platform-vnext-step7d-p1-slice-b-final-review-2026-10-18.md` found no pre-approval blockers for either fixed result. Approval does not resolve P1 or complete STEP7D.
- At approval-record start, both PRs were OPEN/unmerged with these exact heads/bases; no later code changes existed. This branch changes only this record and the publication guide. The record commit's remote head/tree and CI are reported separately, not precomputed here.
- The user authorized approval records, minimal current-document alignment, document validation, commit/push and existing PR updates only. Main/integration merge, Pages settings/cutover, dispatch/upload/deploy, Guard release and server/model/Adapter or behavior work remain prohibited. Later code is not automatically included in either approval.
- Existing validation below is reused for the approved source. New record validation checks documentation, unchanged non-document bytes and existing guards; no game behavior test is claimed.

## Authorization and owners

User at 2026-10-18 00:22:44 KST: “P1 publication에 한해서, 전체 vNext 최종 main 반영과 분리된 main 기준 최소 준비 PR 경로를 허용한다.” The authorization covers preparation, validation, commit/push and review PR submission only.

- Main baseline: `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`, tree `68c7f63ba262fccc1b3d0eff08b58ff503ad7944`.
- Approved integration source: `57da5eda0511af4b7b6cf23348887e9f2484770a`, tree `f49e5f57eda5902d7813bf621a061ed2a31b6490`.
- Slice A approved implementation: `8876fc0bd5e0e6412409b4a9e234a5cd7f065289`. PR426 actually merged at 2026-10-17 20:53:33 KST.
- Main and integration refs matched these inputs at start. Existing unrelated open PRs are excluded.
- Branch: `chore/game-platform-vnext-phase7d-publication-main`, review PR base main.
- Main guide/submission owns this preparation's policy, implementation, validation and pending cutover.
- Integration branch `docs/game-platform-vnext-phase7d-publication-exception` owns the minimal plan1.6/D-0011/CURRENT/README exception record. Its separate integration-base PR is not a PR426 merge-record PR. Both fixed results are now user-approved; neither PR is merged or authorized to merge.
- Main's existing root plan/AGENTS/rulebooks/governance remain unchanged. Full vNext plans/contracts/Core are not ported. Integration's exact384 policy is unchanged.

## Exact port and intentional differences

The main PR changes 14 files: original publication9, the existing boundary helper, artifact helper/Python fixture/Node discovery (3), and this submission record (1). This is not the same9-file claim used for earlier preparation.

Byte-identical to approved integration: publication workflow, builder, boundary helper, artifact helper, publication tests, Node artifact test and Python fixture. The asset builder's sole hunk records actual esbuild inputs; package adds only build/check publication commands. No new dependencies or lockfile change.

The policy removes exactly:
- games/shared/vnext/core/executionBindings.js
- games/shared/vnext/core/executionScope.js

All other policy fields, moduleMaps and 382 paths are preserved. Policy SHA256: `cbbac12f437136d517bb1cbed9805cf298e0f52d6148e3ed02bae90a8787f230`.

All 382 public source paths exist in the full checkout. Compared with the fixed main source bytes, only assets/build/manifest.json differs, adding58 actual input paths while preserving45 outputs. Main index, generated bundles, CNAME, manifest/SW, game entry/runtime and existing consumer/API/Registry metadata/barrel/Auth/SQL/game-local documents retain their bytes. This is static evidence, not browser/game behavior proof.

## Validation

- Full main source tree reconstructed from fixed Git blobs; every tracked input exists. Local baseline has the exact remote main tree but a synthetic commit identity; the remote SHA remains authoritative.
- npm ci --no-audit --no-fund: PASS.
- npm run build:assets: PASS. The initial main diff contained the intended inputs-only manifest hunk. After staging that approved port, generated comparison was clean; final committed comparison is verified before submission.
- publication Node:19/19 PASS including Python16 contracts.
- npm run test:game-platform:297/297 PASS (main's278 existing tests +19 publication Node tests). No integration-only vNext tests/Core are imported or counted.
- Existing main governance and same boundary CLI: PASS.
- build:publication/check:publication: exact382 PASS; references/moduleMap and each file/source size/hash checked.
- Same pinned-action GNU tar options → local ZIP → artifact verifier:382 PASS, including F1 raw name/prefix logic.
- Port identity/policy delta/public-byte comparison and diff whitespace: PASS.
- Automatic PR CI is recorded against the formal remote head in the handoff. CI/fixture success does not prove actual upload/deployment or support.

## Publication and recovery remain pending

Pages settings were not queried or changed here. The preserved observation was branch/main/root. If still true, merging this PR first can publish the old root. Before any future main merge, a separately authorized cutover must verify current source/old jobs/recovery inputs, switch source to Actions, and confirm the old publisher is not active. Main merge needs approval of the exact head and cutover order.

No workflow_dispatch, real Pages package, artifact download/remote verification or deployment was executed. The workflow's publish:true means upload → verification → successful deployment, not upload-only permission.

Previous public artifact11077057593 was unavailable in preserved evidence. No verified previous public package/inventory/hash or current environment/reviewer/domain/HTTPS/cached resource state is asserted available. Rebuilding old source is not proof of identical old artifact. Recovery input remains incomplete and must be resolved within a separately authorized cutover; do not promise unconditional branch/root fallback.

Actual commit/run/attempt/artifact ID/digest/deployment and limited live/cache evidence are required for P1 judgment. Evidence manifest ZIP is distinct from public Pages ZIP/tar. Even after P1 evidence, changing the server fail-closed Guard requires separate review.

## Preservation and stop

Approved Target and STEP7B plan §7 in full are retained through the approved integration source: empty-model/unsupported-combination and vNext runtime/online blocking, existing online DB requirements, unverified server exclusion blocking, H1–4/single adoption/recovery/safety11/current A/C/P/hostless, no unapproved rematch exception, original IDs/lines/f/source and all later obligations. No provider/operational architecture or owner responsibility changes.

The original preparation run performed no final approval/completion, main/integration merge, Pages settings, dispatch/upload/deploy, Guard release, server/model/Adapter implementation, actual game/DB/browser/audio/two-client/performance/operations tests, full source/SQL audit or separate after-the-fact audit. The later user result approval above is limited to the two fixed submissions; the remaining actions are still not performed or authorized.

Next: a separate user decision on PR #428 integration merge and separately scoped cutover preflight/planning before any PR #427 main merge. No automatic next-stage action. Stay **PREPARATION_RESULTS_APPROVED / MAIN_NOT_MERGED / INTEGRATION_NOT_MERGED / P1 unresolved / STEP7D incomplete / models unstarted / NOT_RUN / UNKNOWN**.
