# STEP 1 — Source Inventory

모든 legacy source는 승인 integration `132ec1576e316d0238c9ca6e07d0d3ab91950ec8` 기준이다. source blob은 읽은 원본을 고정하며 새 산출물 commit SHA와 다르다.

## 권위 연결과 탐색 범위

- AGENTS가 development/UI를 필수 진입점, DB 작업에서 DB/Test Contract를 추가 기준으로 지정한다.
- development/Governance가 games 안내·4개 템플릿·shared 코드/테스트·게임별 4문서로 연결한다.
- games 아래 Markdown을 실제 탐색해 14개 모두 읽었다. 게임별 release 체크리스트도 포함한다.
- DB 권한 절은 Supabase README/site README, test contract는 tests/game-db-integration/README 및 runner와 대조했다.
- source import 탐색으로 BGM site utility의 game-bgm.md까지 포함했다. CURRENT 표시가 있어도 game-platform 파일명 Guard 탐색에는 포함되지 않는 문서다.
- 재구축 artifacts는 권위 규칙이 아니라 감사 기록이다. CURRENT/HISTORY game-rulebook으로 등록하지 않는다.

## 전수 원문 문서

| source | 상태 | 줄 | 추적 단위 | 원문 blob |
|---|---|---:|---:|---|
| [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/AGENTS.md) | CURRENT | 135 | 83 | `2686a3c37502bbf1f7f2a9407640e78cc026dadb` |
| [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md) | CURRENT | 863 | 443 | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` |
| [docs/game-platform-governance.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-governance.md) | CURRENT | 114 | 59 | `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169` |
| [docs/game-platform-db-test-contract.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-db-test-contract.md) | CURRENT | 160 | 60 | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` |
| [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) | CURRENT | 395 | 219 | `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9` |
| [games/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/README.md) | CURRENT | 55 | 37 | `49c3d8604b8b24d6a5cf5e66d848b35a22610bee` |
| [games/GAME_SPEC_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/GAME_SPEC_TEMPLATE.md) | TEMPLATE | 81 | 43 | `2b63d9cafee15bd952fcb4ddb8bb06bcec3240d2` |
| [games/DEVELOPMENT_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/DEVELOPMENT_TEMPLATE.md) | TEMPLATE | 61 | 22 | `e48f42067682975202067537f005270054ed1e7c` |
| [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md) | TEMPLATE | 138 | 92 | `e412138d9d60f5189709c20c634bcb0f5f28be82` |
| [games/UI_DECISIONS_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DECISIONS_TEMPLATE.md) | TEMPLATE | 69 | 39 | `a8bedc2de5cb80de99c67044c071f3940b778248` |
| [games/cant-stop/GAME_SPEC.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/GAME_SPEC.md) | GAME_LOCAL | 350 | 236 | `8c28edf2c84b351a7ddbc0504c37df2e79b962e4` |
| [games/cant-stop/DEVELOPMENT.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/DEVELOPMENT.md) | GAME_LOCAL | 199 | 169 | `de9c2774e43b3646402edbf5785d9580df6e86e6` |
| [games/cant-stop/UI_DESIGN.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/UI_DESIGN.md) | ADOPTION_BASELINE | 118 | 74 | `4127eb5129923725e1e2c2b1c8a4b7ea87f7bcfe` |
| [games/cant-stop/UI_DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/UI_DECISIONS.md) | GAME_LOCAL | 130 | 101 | `c77ed6c6acf69888dec8510711c7aa850a424948` |
| [games/no-thanks/GAME_SPEC.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/GAME_SPEC.md) | GAME_LOCAL | 399 | 254 | `11408e010a86c8197068be96a6cbede34c42e477` |
| [games/no-thanks/DEVELOPMENT.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/DEVELOPMENT.md) | GAME_LOCAL | 332 | 291 | `c5167e1dc6004d663a58d304e2d8604acfaf3f68` |
| [games/no-thanks/UI_DESIGN.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/UI_DESIGN.md) | ADOPTION_BASELINE | 132 | 88 | `6d956599f9dfc11fade9a082d68ddec4be05bea2` |
| [games/no-thanks/UI_DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/UI_DECISIONS.md) | GAME_LOCAL | 330 | 271 | `65437a239c6d9ac2bdb40191bd0f6e5a388b3ead` |
| [games/no-thanks/RELEASE_CHECKLIST.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/RELEASE_CHECKLIST.md) | GAME_LOCAL | 88 | 61 | `28d562743296889439d19d72bcaa84d843669b0d` |
| [docs/game-bgm.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-bgm.md) | CURRENT_SITE_UTILITY | 128 | 81 | `e3767e0b366a5e1f57d5978edf47eb1e129a0931` |
| [README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/README.md) | SITE_ENTRY | 370 | 155 | `d51a355bb106e8ff3579e4615e6db1e2709fcd06` |
| [supabase/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/README.md) | SITE_POLICY | 179 | 102 | `6f79e559386f600bd524615d61dd1e60c361c759` |
| [supabase/site/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/site/README.md) | SITE_POLICY | 149 | 64 | `02426634228d360249c868d7ed2529ecfded8dd5` |
| [tests/game-db-integration/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-db-integration/README.md) | TEST_GUIDE | 44 | 22 | `99b8acac6244f4e128766d6a36b6159ce9883848` |
| [docs/game-platform-strategy.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-strategy.md) | HISTORY | 253 | 121 | `344297d7d806f164082bcb5a88e41610d3db4d10` |
| [docs/game-platform-invite-analysis.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-invite-analysis.md) | HISTORY | 125 | 45 | `645f565e9c9a2b069bb2be13d70e14c12af2a38f` |

## 작업 제어 문서(legacy 조항 수에 미포함)

| source | 승인 integration blob |
|---|---|
| [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/AGENTS.md) | `2686a3c37502bbf1f7f2a9407640e78cc026dadb` |
| [game_platform_vnext_final_execution_plan.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/game_platform_vnext_final_execution_plan.md) | `e12ef038913eb6d605709b782f1b73f18e0d1253` |
| [docs/game-platform-rebuild/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-rebuild/README.md) | `2263aa90a0e49f0cb6935f0d2558d25c5799426c` |
| [docs/game-platform-rebuild/CURRENT.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-rebuild/CURRENT.md) | `447d75e3cc84840fb0c5fc79f6c285c4e4f7a39e` |
| [docs/game-platform-rebuild/checkpoints/CP-0005-step-0-record-audit-correction.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-rebuild/checkpoints/CP-0005-step-0-record-audit-correction.md) | `8d2193c489a2e15da1fd4282de02973192ace0e6` |
| [docs/game-platform-rebuild/DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-rebuild/DECISIONS.md) | `0dc4e896075917cb8ddb37c24f7e8c0c9d21c381` |

이후 STEP branch의 CP-0006(착수), CP-0007(중단 상태 대조)와 최신 CURRENT를 읽어 실제 진행을 복원했다. STEP 0 과거 CP-0001~0004는 변경하지 않는다.

## 코드·테스트·workflow 읽기 증거

| source | 실제 읽기 범위 | 기준 blob |
|---|---|---|
| [.github/workflows/game-db-integration.yml](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/.github/workflows/game-db-integration.yml) | 전체 trigger/disposable execution | `9b962356a28951b1d8ccf171d1fece8df5a580b6` |
| [.github/workflows/game-platform-governance.yml](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/.github/workflows/game-platform-governance.yml) | 전체 trigger/job | `984d2c36c506c2e51ba50765fe0b5d667c06f055` |
| [.github/workflows/site-static-checks.yml](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/.github/workflows/site-static-checks.yml) | PR paths-ignore 및 validation jobs | `2cb746bda0ade2f2344a2a8e21f5a48148b10bb4` |
| [games/cant-stop/app.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/app.js) | imports 1–75, Shell/controller/auth bootstrap 연결부 및 호출 검색; 전체 UI 리뷰 아님 | `29eba21d4637febb2a74dc12d89847d86af9d7b0` |
| [games/cant-stop/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/bgm.js) | 전체; shared/site 연결 및 game-local lifecycle | `5f7ce828d6becee5e6023398f8c44d610d02f9a5` |
| [games/cant-stop/invite.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/invite.js) | 전체; site/shared invite + server join 연결 | `855a13f2753cafcaa1af69a51ddd97ad61349890` |
| [games/cant-stop/lobbyController.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/lobbyController.js) | 전체; shared/site 연결 및 game-local lifecycle | `9fdecdea73fa6b96680d887a6ad5ad2d9031e8d6` |
| [games/cant-stop/roomLobby.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/roomLobby.js) | 전체; shared/site 연결 및 game-local lifecycle | `881d0c34211225ba1ec4f1616d8fd9f6e36ea66b` |
| [games/no-thanks/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/bgm.js) | 전체; shared/site 연결 및 game-local lifecycle | `1f7c850ffbb8e25c038114b1d7ed2f34ed420332` |
| [games/no-thanks/lobbyController.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/lobbyController.js) | 전체; shared/site 연결 및 game-local lifecycle | `942a628ff1a675754f7ab92c53d5ecbddf3e6eab` |
| [games/no-thanks/main.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/main.js) | imports 1–88, Shell/controller/auth bootstrap 연결부 및 호출 검색; 전체 UI 리뷰 아님 | `9e09b49d2365fe880e40a6c2180476573043cb0b` |
| [games/no-thanks/presence.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/presence.js) | 전체; client key/user merge/payload/cleanup | `43e0f094e0efc184e721dcb55624c30a328deb57` |
| [games/no-thanks/roomLobby.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/roomLobby.js) | 전체; shared/site 연결 및 game-local lifecycle | `b689e6c0628824cc3d617bd5dc71ace424857fb3` |
| [games/shared/accessGate.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/shared/accessGate.js) | 전체; exports/조건/수명/호출 surface | `4803cd8fd141c98d97bd6357243a9f955843d6cc` |
| [games/shared/actionContract.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/shared/actionContract.js) | 전체; exports/조건/수명/호출 surface | `93ff86e5a83073f6cd88ee7555fb171caf467443` |
| [games/shared/game-shell.css](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/shared/game-shell.css) | 선택자와 두 game HTML의 opt-in 연결 | `daad52e6658b8e7e1d8510f8607201921272e794` |
| [games/shared/gameInvite.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/shared/gameInvite.js) | 전체; exports/조건/수명/호출 surface | `4d4b667e85162b19fb4e1607bfcc094a1bd4556d` |
| [games/shared/gameShell.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/shared/gameShell.js) | 전체; exports/조건/수명/호출 surface | `298ab13998662aafa0efea35d32824f85e84e18e` |
| [games/shared/gameShellState.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/shared/gameShellState.js) | 전체; exports/조건/수명/호출 surface | `1f068aa14348b166b13c34e50daf2c5698db2914` |
| [games/shared/index.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/shared/index.js) | 전체; exports/조건/수명/호출 surface | `96041e478da57e87f3248be1e1d539e8dbdd6939` |
| [games/shared/reconnectRefresh.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/shared/reconnectRefresh.js) | 전체; exports/조건/수명/호출 surface | `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4` |
| [games/shared/registry.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/shared/registry.js) | 전체; exports/조건/수명/호출 surface | `afa4ba25824157534eca7ca7538b89571cfca30e` |
| [games/shared/roomLobbyContract.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/shared/roomLobbyContract.js) | 전체; exports/조건/수명/호출 surface | `4d037bd1b56715aae631220d1c848bc521a56ce0` |
| [games/shared/snapshotCoordinator.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/shared/snapshotCoordinator.js) | 전체; exports/조건/수명/호출 surface | `069f49aa23cfb2c5d591cafaed523fa358c78ba1` |
| [js/auth.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/js/auth.js) | getAuthState/subscribeAuth/initializeAuth 승인 상태/API와 두 game entry 소비 | `09eb6d21b2d259567c0ba1b1a0aecfbd1bcac723` |
| [js/game-audio/bgmCatalog.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/js/game-audio/bgmCatalog.js) | exports와 game track 등록/lookup 검색 | `93ee1e699349c7596ca462fd2a1e9b5559c87f8e` |
| [js/game-audio/bgmController.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/js/game-audio/bgmController.js) | 상태·play/pause/track/volume/destroy 경계 및 exports; 특히 205–298 | `4757a1de3477dbebe44f2dd49b7071eb8b03d9c2` |
| [js/game-audio/bgmPlayer.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/js/game-audio/bgmPlayer.js) | exports/mount/controls/state subscription/cleanup 검색 | `c7c8f07187c7450bff4ff7256b37227a3ee0e86c` |
| [js/game-audio/bgmPreferences.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/js/game-audio/bgmPreferences.js) | 전체 | `902e2893c4ac2ebc5da0dad4fdda8aea40792a7c` |
| [js/invites/inviteApi.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/js/invites/inviteApi.js) | 전체 | `e1747b294e25fec6e83502dc20299499f72843fa` |
| [js/invites/inviteEntry.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/js/invites/inviteEntry.js) | 전체 | `f5438286f61c880fcdb428108ab9cfa9b4339941` |
| [js/invites/inviteRegistry.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/js/invites/inviteRegistry.js) | 전체 | `0c2c8473656245ac3990a8d97868647ec60485bf` |
| [js/invites/inviteShare.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/js/invites/inviteShare.js) | 전체 | `f1d370c83cbcbcabcf405b3544e3ba1129d69203` |
| [js/pages/games.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/js/pages/games.js) | GAMES 배열과 renderGames/노출 흐름 | `81614a6496b77415f4aef7aa26181f63dbc6f948` |
| [liar-game/js/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/liar-game/js/bgm.js) | site controller/player imports 검색 | `3c93e555b1d0253f3044d4d1b9ac354c2120cd1a` |
| [package.json](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/package.json) | 전체 scripts | `917a55aa474d98cc663364c5e7dab84ff6fe5cf1` |
| [scripts/check-community-modules.mjs](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/scripts/check-community-modules.mjs) | 1–80; linker와 games-page stub 경계 | `2aafeebc1ab74087b1b6f30fc940355513f84535` |
| [scripts/check-game-platform-governance.mjs](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/scripts/check-game-platform-governance.mjs) | 전체 594줄; discovery/repository/PR 검증 | `2aa47527fc57a1ba0fe8a5d6c3c72eb984b8477b` |
| [supabase/cant-stop/20260919074500_cant_stop_invite_join.sql](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/cant-stop/20260919074500_cant_stop_invite_join.sql) | 1–88 및 grants; token revalidation/room authorization | `61ec96f5691cfb686a97e2b302260b9bd4f44b59` |
| [supabase/cant-stop/20260920205000_cant_stop_profile_nickname.sql](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/cant-stop/20260920205000_cant_stop_profile_nickname.sql) | 후속 profile nickname authority 정의 검색 | `66da72b90a4c2ae8c8985647e163cb7f9e31b63b` |
| [supabase/no-thanks/20260921225000_no_thanks_room_lobby_foundation.sql](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/no-thanks/20260921225000_no_thanks_room_lobby_foundation.sql) | schema/권한·RLS·RPC/snapshot 정의 관련 검색 | `3bcd84b7b4cdfa40dbc5b2c3aa2c10e35dbc3538` |
| [supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql) | snapshot viewer/authorization/lock/replay/expected version 구간 직접 읽기 + 정의 검색 | `d24ff683c8ffa6861bb287f986395d24fa4a8422` |
| [supabase/no-thanks/20260922060000_no_thanks_realtime_publication.sql](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/no-thanks/20260922060000_no_thanks_realtime_publication.sql) | 공개 room/player publication 구간 | `a08e5e42daeac0881ec9c9b2a1bad5e1c7f9f13f` |
| [supabase/no-thanks/20260922060100_no_thanks_private_helper_permissions.sql](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/no-thanks/20260922060100_no_thanks_private_helper_permissions.sql) | helper EXECUTE revoke/grant 구간 | `2d991a5d1ea5b3933fa4da1324f402ad0e3fcaed` |
| [supabase/no-thanks/20260922085900_no_thanks_rematch.sql](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/no-thanks/20260922085900_no_thanks_rematch.sql) | rematch/leave/expected version/privilege 정의 검색 | `25c8a1e4a9fdb196ecd1c88c532c5832cc0522ee` |
| [supabase/no-thanks/20260924073500_no_thanks_randomized_draw_order.sql](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/no-thanks/20260924073500_no_thanks_randomized_draw_order.sql) | 후속 start RPC/권한/expected version 정의 검색 | `7ab1a46e2fd3655e98767455d85e55ab432db8ae` |
| [supabase/site/migrations/20260828073047_create_site_invite_infrastructure.sql](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/site/migrations/20260828073047_create_site_invite_infrastructure.sql) | table/create/resolve/revoke/privilege 경계 | `c0afec893da8d33deda14b8784deb1108f7b4cbb` |
| [tests/game-db-integration/cant-stop.test.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-db-integration/cant-stop.test.js) | register/scenario 함수 연결(296 이후) 검색; 실제 DB 실행 안 함 | `80658a5877238de5db934764a573fa70090047ae` |
| [tests/game-db-integration/no-thanks.test.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-db-integration/no-thanks.test.js) | register/scenario 함수 연결(301 이후) 검색; 실제 DB 실행 안 함 | `a1b25c2f4056b4494fd1e9613f745752f5f37cfd` |
| [tests/game-db-integration/platformContract.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-db-integration/platformContract.js) | 전체 125줄; 기존 11 scenario ID/등록 계약 | `972dad82fe201924260cd528d6b794c5b33fb32a` |
| [tests/game-platform-contracts.test.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-platform-contracts.test.js) | 전체 195줄; 6개 공통 계약 테스트 | `182dd2719bcfc4872c3d990ab7b6d2149399c2c4` |
| [tests/game-platform-db-contract.test.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-platform-db-contract.test.js) | 관련 runner/scenario assertion과 test 목록; 기존 테스트 실행 | `03cf2a54967ac2cd1267391fb8c8df20a7854ed3` |
| [tests/game-platform-foundation.test.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-platform-foundation.test.js) | Registry/Access Gate 관련 계약·test 목록 | `eed28ef5e853d5d40ec041f0408fe80d533a6181` |
| [tests/game-platform-governance.test.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-platform-governance.test.js) | 관련 assertion과 test 목록 검색; 기존 테스트 실행 | `4c7d3c865cb09ab19d4831404f0c43fa77bc3b12` |
| [tests/game-platform-invite.test.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-platform-invite.test.js) | shared routing/capability/metadata 관련 검증 | `106bc5e0f92f3e9276aad52a3108d786f9aac4dc` |
| [tests/game-platform-shell.test.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-platform-shell.test.js) | normalize/connection/roster API 관련 검증 | `64e6251a273fe972a6932052e777bc5fe91152ba` |
| [the-game/js/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/the-game/js/bgm.js) | site controller/player imports 검색 | `658dad4a481e9d5737bbd837813c788201197fb3` |

## 배제·한계

- `docs/site-foundation-audit.md` 1–45, `AUDIT_REPORT.md` 1–25를 읽어 날짜 있는 과거 사이트 감사임을 확인했다. 현재 Game Platform 규칙으로 승격하지 않는다.
- `supabase/README.md` §7 이후 지도/메일, 사이트 README의 활동/Push 등은 전수 문맥에는 포함하되 Game Platform 의무에서 제외했다.
- 다른 Legacy 게임 전용 대형 요구사항·디자인/안정화 계획은 보호 대상의 구현 이력이며 신규 플랫폼 의무 집합이 아니다. 전체 legacy game code/security 감사를 수행하지 않았다.
- 모든 코드 파일을 읽었다거나 production DB/권한/수동 browser 상태를 새로 검증했다고 주장하지 않는다. 선택 코드의 정확한 읽기 범위를 위에 적었다.
- 외부 규칙서/제품/음원 라이선스 링크는 repository의 조사 이력으로 보존했고 이번 STEP에서 현 시점 권리 판정을 하지 않았다.
