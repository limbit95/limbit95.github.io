# STEP5A — 입력·승인·source trace

- 상태: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 사용자는 실제 Astra 핵심 판단과 이번 문서 반영·검증·원격 PR 제출을 명시적으로 승인했다. 정식 결과 최종 검토·STEP5A 완료·integration 병합·main 반영은 남아 있다.
- 직접 반영 입력: [실제 Astra 판단 원본](game-platform-vnext-step5a-astra-judgment.md) §2·9. 기준 commit `aabb7646c0cdfd6466f2195579dce54689c7b81c`. [원본 식별·source trace](step-5a-source-trace.md), [문서 검증](step-5a-validation.md).
- Sol/Codex는 승인된 판단을 다시 선택하지 않고 아래 원문 절을 그대로 반영했다. [Sol 근거](game-platform-vnext-step5a-evidence.md)는 사실 입력, [앞선 Codex안](game-platform-vnext-step5a-judgment-and-handoff.md)은 실제 Astra 판단보다 아래의 이력이다.
- 아래 원문의 ‘사용자 승인 전’, ‘이번 직접 읽기’, ‘현재 NOT_STARTED’, ‘다음 처리’는 Astra 작성 당시의 상태·행위다. 현재 승인/제출 상태는 이 헤더와 [CURRENT](../CURRENT.md), [CP0079](../checkpoints/CP-0079-step-5a-formal-submitted.md)를 따른다. 원문의 조건·미확인·제한적 보류는 그대로 유효하며 ‘그대로 연결’도 구현 지원 인증이 아니다.
- 행동 시험 **NOT_RUN**, 구현·실행·오픈 의무와 **UNKNOWN** 유지. 기존 Auth·게임 무이관, 계획1.5·STEP4A/4B·CP0075/D0010 유지. 실제 경로/API/수명 기법의 STEP6 동결이나 STEP5B 이후 착수 없음.
- G1~G5는 [선택표 §3](step-5a-common-module-selection.md#3-모든-분류에-적용하는-승인-요구), source ID는 [trace §9](step-5a-source-trace.md#9-source-trace와-추가-읽기-범위)를 참조한다.

## 0. 현재 승인과 원문 보존

이번 사용자 지시는 실제 Astra 판단 §4~8 승인과 정식 문서 반영·문서 검증·기록·원격 제출만 허용한다. 아래 §2의 NOT_STARTED/승인 전 상태는 당시 이력이다. 현재 STEP5A는 **REVIEW_PENDING**이며 정식 결과 최종 검토가 남았다. PR 생성 허용은 병합 승인으로 확대하지 않는다.

세 입력은 전달받은 원본 bytes를 새 저장소 파일로 복사하며 원본 내용은 수정하지 않는다. 판단 우선순위는 유효한 승인 원문/결정 → 실제 Astra → 사실 근거/앞선 Codex안이다. 실제 Astra §2.1의 정정(만료 **뒤 새 A 금지**, `defineRoomLobbyAdapter`, The Game/Liar BGM N의 추가 본문 읽기 의미)을 적용하고 잘못된 과거 문구는 원본 이력으로 보존한다.

| 원본 보존 파일 | 입력 식별 | bytes | SHA-256 | Git blob |
|---|---|---|---|---|
| [game-platform-vnext-step5a-evidence.md](game-platform-vnext-step5a-evidence.md) | `libfile_c163b692e0c4819191700916162e6642` | 28286 | `c6ec23a339e28e3ee8cc20ca63f64a9ff1319ec1e9e3d0907c18fe29057a8b94` | `f0325c062584fb1f298279b02033b8c01fe07afb` |
| [game-platform-vnext-step5a-judgment-and-handoff.md](game-platform-vnext-step5a-judgment-and-handoff.md) | `libfile_cf97e82dfaf881918679e75984003a1c` | 21606 | `2ea36a2e0f6b46736ebe4219f7d5d4e64bb2aea617ab65a65217879eeedc7493` | `319949fe390d3f156949e796a0fba709379e9b74` |
| [game-platform-vnext-step5a-astra-judgment.md](game-platform-vnext-step5a-astra-judgment.md) | `libfile_764bd455e2288191b423fd255cbb1e0d` | 50325 | `5ee7f30d2859ccdd67a0ce24061859262617e4e8200be7af3aad2d2758451c66` | `7ff69e10002939dc58980512da28d383f1c633ae` |


정식 대응: 선택표는 Astra §1·3·4, 중복 기준은 §5, owner/제한적 보류/검증은 §6~8, 이 trace는 §2·9를 원문 그대로 반영한다. 원문의 ‘직접/재사용’은 Astra 작업 이력이며 Sol/Codex의 이번 재조사 범위가 아니다. Sol의 57/681 blob 대조는 입력 근거 재사용이며 이번 전수 재조사/실행 감사로 표기하지 않는다.

이번에 AGENTS → 계획1.5 → README → CURRENT → CP0078 → PR412/413을 실제 읽고 원격 ref와 대조했다. integration `aabb7646c0cdfd6466f2195579dce54689c7b81c`로 추가 변경 없음. PR412/413 merged=true와 지정 merge SHA 일치. 기존 STEP5A branch/PR 없음 확인 후 `docs/game-platform-vnext-phase5a-common-module-selection`에서 문서만 반영한다. main `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09` ref는 보호 상태 확인용이며 동기화/변경하지 않는다.

## 2. 입력과 상태 복원

### 2.1 실제로 읽은 입력

| 입력 | 식별 | 적용 |
|---|---|---|
| `game-platform-vnext-step5a-evidence.md` | `libfile_c163b692e0c4819191700916162e6642` | Sol 역할 근거·consumer/test trace 재사용. 승인 선택표가 아님 |
| `game-platform-vnext-step5a-judgment-and-handoff.md` | `libfile_cf97e82dfaf881918679e75984003a1c` | Codex 판단안·정정·§9 전달 프롬프트 전체 적용. 실제 Astra 결과나 사용자 승인으로 간주하지 않음 |

입력 정정 세 가지를 계승한다. ‘알려진 만료 전 A 금지’는 **‘알려진 만료 뒤 새 A 금지’**, Room 심볼은 `defineRoomLobbyAdapter`, The Game/Liar BGM의 N 표기는 inventory 미수록이 아니라 추가 본문 확인이다. 원본을 수정하지 않았다.

### 2.2 지정 순서로 직접 복원한 결과

실제 읽기 순서는 **AGENTS → 루트 실행 계획 → rebuild README → CURRENT → CP0078 → PR412/413 → 원격 integration ref**였다. 고정 SHA의 문서와 현재 원격 상태를 구분했다.

| 항목 | 직접 확인 결과 |
|---|---|
| AGENTS | blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`. vNext는 integration 기준이며 현 사용자 지시의 저장소 밖 판단 범위 적용 |
| 실행 계획 | 개정 **1.5**, blob `da353e2e64daef6b1b0b7267c21997bfd7cda4ed`. §5 STEP5A 범위·무이관·STEP6 전 구현 금지 확인 |
| README | blob `2e12850f8c1209bb6113d4bacbe49936e05cf057`. CP0077 안내는 당시 이력이고 CURRENT/CP0078·실제 PR과 함께 판독 |
| CURRENT | blob `012a9769c64e26d08288c44c09eff8f0fdeef3f7`. STEP4B COMPLETED, STEP5A NOT_STARTED, NOT_RUN·오픈 의무 유지 |
| CP0078 | blob `d66a7f22847491d0e3387d265c91609151a1129b`. PR412 병합 확인; PR413 대기는 기록 작성 당시 상태 |
| [PR412](https://github.com/limbit95/limbit95.github.io/pull/412) | 실제 merged=true; 승인 head `3e105be42f4dbcdf0875486bd8f0e5d38bcd1d1a`; merge `32429a20f76a7fde6733db384fa067fbcd7307d1` |
| [PR413](https://github.com/limbit95/limbit95.github.io/pull/413) | 실제 merged=true; head `d19f268ee56fad6ff1fd9d79ab3f27148f0224cd`; merge는 고정 판단 SHA |
| 현재 원격 integration HEAD | `aabb7646c0cdfd6466f2195579dce54689c7b81c` — 고정 판단 SHA와 동일. 조회 시점 추가 변경 없음 |
| main | 기존 근거·CURRENT의 `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09` 및 vNext 미반영 상태를 계승. 이번에 main ref를 새로 조회·동기화하지 않았으며 현재 main HEAD를 새로 검증했다고 주장하지 않음 |

CURRENT의 ‘STEP5A 진행 승인 미수행’은 저장소 기록 상태다. 이번 사용자의 §9 실행 지시로 저장소 밖 핵심 판단은 수행했지만, 이를 정식 STEP5A 착수 기록·branch/PR 생성 허용으로 확대하지 않는다. 과거 HOLD·검토 대기는 당시 이력으로 읽고 CP0075/D0010의 부분 대체를 적용한다.

## 9. Source trace와 추가 읽기 범위

모든 repository source는 고정 SHA 기준이다. 기본 URL은 `https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/`이며 아래 경로를 잇는다. ID는 이 문서 내부 참조다. ‘직접’은 이번에 본문을 다시 읽은 항목, ‘재사용’은 실제로 읽은 두 입력의 source/consumer/test 근거를 사용한 항목이다. 재사용을 이번 직접 전수 감사로 표기하지 않는다.

| ID | 경로·blob | 위치·적용 | 방식 |
|---|---|---|---|
| E | `game-platform-vnext-step5a-evidence.md` §3~6 | 기존 consumer·test source·57개/681개 blob 동일성 조사 범위 | 입력 직접 읽기, 그 조사 결과 재사용; 이번 681개 전수 읽기/대조 아님 |
| R1 | `games/shared/registry.js` · `afa4ba25824157534eca7ca7538b89571cfca30e` | defineGame/GAME_REGISTRY/list/get; metadata와 실행 구성 차이 | 직접 |
| A1 | `games/shared/accessGate.js` · `4803cd8fd141c98d97bd6357243a9f955843d6cc` | resolveApprovedMemberAccess/createGameAccessGate; `js/auth.js` 연결 | 재사용 |
| Rm1 | `games/shared/roomLobbyContract.js` · `4d037bd1b56715aae631220d1c848bc521a56ce0` | defineRoomLobbyAdapter·8개 함수 검사; 두 게임 adapter/controller | 재사용 |
| S1 | `games/shared/snapshotCoordinator.js` · `069f49aa23cfb2c5d591cafaed523fa358c78ba1` | snapshotVersion/runRefresh/refresh/start/stop/dispose | 직접 |
| Rc1 | `games/shared/reconnectRefresh.js` · `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4` | requestRefresh/start/stop; 두 controller 연결 | 재사용 |
| I1 | `games/shared/gameInvite.js` · `4d4b667e85162b19fb4e1607bfcc094a1bd4556d` | requirePlatformInviteGame/create/parse/resolve/destination | 직접 |
| I2 | `js/invites/inviteEntry.js` · `f5438286f61c880fcdb428108ab9cfa9b4339941` | 두 handler 등록·boot/auth/resolve/dispatch·기본 Registry | 직접 |
| I3 | `js/invites/inviteRegistry.js` · `0c2c8473656245ac3990a8d97868647ec60485bf` | registerInviteHandler/dispatchInvite | 직접 |
| I4 | `js/invites/inviteShare.js` · `f1d370c83cbcbcabcf405b3544e3ba1129d69203` | renderInviteQr/copy/share/createInviteShareDialog/open/destroy | 직접 |
| Sh1 | `games/shared/gameShell.js` · `298ab13998662aafa0efea35d32824f85e84e18e`; `gameShellState.js` · `1f068aa14348b166b13c34e50daf2c5698db2914` | 표시 부품·createGameShell·pure state | 재사용 |
| B1 | `js/game-audio/bgmController.js` · `4757a1de3477dbebe44f2dd49b7071eb8b03d9c2` | tryPlay/pauseByUser/playByUser/switchTrack/subscribe/destroy | 직접; player/preferences/catalog/각 게임 wrapper는 E 재사용 |
| G-L | `docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md` · `5e40988234caba6cb605ea4c0b386a0a5b83b9c5` | §5~8 전체 완료·owner·T01~03·현재 재검증 예외 | 직접 |
| G-B | `docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md` · `610efc904bdaec8881535d3405fe81102bd3d5df` | Core/model/capability/Site/local 책임 | 입력 근거 재사용 |
| G-S | `docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md` · `a6cfe51029e3fc3b2b546222b6a6afb0ad428f14`; `step-4b-security-site-contract.md` · `e140c90d830ff891c2abd5e40b038249eeeb8ebf` | 현재 CP0074/0075 적용·동기화/권한 | 입력 근거 재사용 |
| G-C | `docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md` · `f3232f64c846bf4b17fcea2ae0bf6baed90ffc03` | §2 A/C/P·§3 oracle·설계/실행 구분 | 직접 |
| G-D | `docs/game-platform-rebuild/DECISIONS.md` · `ab4896bd01b591895d0e30946a810c41eaa74e5a` | D0006~10 유효 대체 관계 | 입력 근거 재사용 + 계획1.5/G-C 직접 대조 |

추가 읽기 이유는 Registry 중복 범위, coordinator의 실제 내부 채택 책임, Invite 생성/entry 비대칭·내부 완료, BGM pending play의 보완 owner, G-L/G-C 해석을 확정하는 데 한정했다. 공급자·가격·운영 정책 외부 조사, 기존 전체 inventory 재조사, 별도 사후 감사는 하지 않았다. 저장소 소스 조회는 변경·실행 작업이 아니다.

## 11. 재사용 근거의 고정 경로 연결

아래 링크는 세 입력에 이미 식별된 경로와 기존 테스트 blob을 기준 tree에 연결한 문서상 추적이다. source 본문 재감사·테스트 실행이 아니다. §9의 심볼/위치와 Sol 근거 §3~5의 consumer/test 범위를 함께 읽는다. 실행 계획·STEP1~4B·DECISIONS의 유효 대체 관계를 재사용하며 완료된 공급자/운영 정책 조사는 반복하지 않는다.

| 고정 source 경로 | baseline blob |
|---|---|
| [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/AGENTS.md) | `2686a3c37502bbf1f7f2a9407640e78cc026dadb` |
| [game_platform_vnext_final_execution_plan.md](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/game_platform_vnext_final_execution_plan.md) | `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` |
| [docs/game-platform-rebuild/README.md](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/docs/game-platform-rebuild/README.md) | `2e12850f8c1209bb6113d4bacbe49936e05cf057` |
| [games/shared/registry.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/shared/registry.js) | `afa4ba25824157534eca7ca7538b89571cfca30e` |
| [js/pages/games.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/js/pages/games.js) | `81614a6496b77415f4aef7aa26181f63dbc6f948` |
| [games/shared/accessGate.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/shared/accessGate.js) | `4803cd8fd141c98d97bd6357243a9f955843d6cc` |
| [js/auth.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/js/auth.js) | `09eb6d21b2d259567c0ba1b1a0aecfbd1bcac723` |
| [js/invites/inviteApi.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/js/invites/inviteApi.js) | `e1747b294e25fec6e83502dc20299499f72843fa` |
| [docs/game-bgm.md](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/docs/game-bgm.md) | `e3767e0b366a5e1f57d5978edf47eb1e129a0931` |
| [games/shared/roomLobbyContract.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/shared/roomLobbyContract.js) | `4d037bd1b56715aae631220d1c848bc521a56ce0` |
| [games/shared/snapshotCoordinator.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/shared/snapshotCoordinator.js) | `069f49aa23cfb2c5d591cafaed523fa358c78ba1` |
| [games/shared/reconnectRefresh.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/shared/reconnectRefresh.js) | `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4` |
| [games/shared/gameInvite.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/shared/gameInvite.js) | `4d4b667e85162b19fb4e1607bfcc094a1bd4556d` |
| [games/shared/gameShell.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/shared/gameShell.js) | `298ab13998662aafa0efea35d32824f85e84e18e` |
| [games/shared/gameShellState.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/shared/gameShellState.js) | `1f068aa14348b166b13c34e50daf2c5698db2914` |
| [js/game-audio/bgmController.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/js/game-audio/bgmController.js) | `4757a1de3477dbebe44f2dd49b7071eb8b03d9c2` |
| [js/game-audio/bgmPlayer.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/js/game-audio/bgmPlayer.js) | `c7c8f07187c7450bff4ff7256b37227a3ee0e86c` |
| [js/game-audio/bgmPreferences.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/js/game-audio/bgmPreferences.js) | `902e2893c4ac2ebc5da0dad4fdda8aea40792a7c` |
| [js/game-audio/bgmCatalog.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/js/game-audio/bgmCatalog.js) | `93ee1e699349c7596ca462fd2a1e9b5559c87f8e` |
| [js/invites/inviteRegistry.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/js/invites/inviteRegistry.js) | `0c2c8473656245ac3990a8d97868647ec60485bf` |
| [js/invites/inviteEntry.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/js/invites/inviteEntry.js) | `f5438286f61c880fcdb428108ab9cfa9b4339941` |
| [js/invites/inviteShare.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/js/invites/inviteShare.js) | `f1d370c83cbcbcabcf405b3544e3ba1129d69203` |
| [games/shared/actionContract.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/shared/actionContract.js) | `93ff86e5a83073f6cd88ee7555fb171caf467443` |
| [games/shared/index.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/shared/index.js) | `96041e478da57e87f3248be1e1d539e8dbdd6939` |
| [games/shared/game-shell.css](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/shared/game-shell.css) | `daad52e6658b8e7e1d8510f8607201921272e794` |
| [games/cant-stop/roomLobby.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/cant-stop/roomLobby.js) | `881d0c34211225ba1ec4f1616d8fd9f6e36ea66b` |
| [games/no-thanks/roomLobby.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/no-thanks/roomLobby.js) | `b689e6c0628824cc3d617bd5dc71ace424857fb3` |
| [games/cant-stop/lobbyController.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/cant-stop/lobbyController.js) | `9fdecdea73fa6b96680d887a6ad5ad2d9031e8d6` |
| [games/no-thanks/lobbyController.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/no-thanks/lobbyController.js) | `942a628ff1a675754f7ab92c53d5ecbddf3e6eab` |
| [games/cant-stop/app.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/cant-stop/app.js) | `29eba21d4637febb2a74dc12d89847d86af9d7b0` |
| [games/no-thanks/main.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/no-thanks/main.js) | `9e09b49d2365fe880e40a6c2180476573043cb0b` |
| [games/cant-stop/invite.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/cant-stop/invite.js) | `855a13f2753cafcaa1af69a51ddd97ad61349890` |
| [the-game/js/inviteIntegration.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/the-game/js/inviteIntegration.js) | `61a1d5e73c75a36181770bd7c836af12cc0c0d49` |
| [games/cant-stop/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/cant-stop/bgm.js) | `5f7ce828d6becee5e6023398f8c44d610d02f9a5` |
| [games/no-thanks/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/no-thanks/bgm.js) | `1f7c850ffbb8e25c038114b1d7ed2f34ed420332` |
| [the-game/js/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/the-game/js/bgm.js) | `658dad4a481e9d5737bbd837813c788201197fb3` |
| [liar-game/js/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/liar-game/js/bgm.js) | `3c93e555b1d0253f3044d4d1b9ac354c2120cd1a` |
| [games/cant-stop/index.html](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/cant-stop/index.html) | `ff5c9370540b3e95bc722cad42497b02c975f858` |
| [games/no-thanks/index.html](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/games/no-thanks/index.html) | `f8cc1bab14eaa6b5e07505fe490074715c9b923e` |
| [docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md) | `5e40988234caba6cb605ea4c0b386a0a5b83b9c5` |
| [docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md) | `610efc904bdaec8881535d3405fe81102bd3d5df` |
| [docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md) | `a6cfe51029e3fc3b2b546222b6a6afb0ad428f14` |
| [docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md) | `f3232f64c846bf4b17fcea2ae0bf6baed90ffc03` |
| [docs/game-platform-rebuild/DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/docs/game-platform-rebuild/DECISIONS.md) | `ab4896bd01b591895d0e30946a810c41eaa74e5a` |
| [docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md) | `e140c90d830ff891c2abd5e40b038249eeeb8ebf` |
| [tests/game-platform-foundation.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-foundation.test.js) | `eed28ef5e853d5d40ec041f0408fe80d533a6181` |
| [tests/game-platform-contracts.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-contracts.test.js) | `182dd2719bcfc4872c3d990ab7b6d2149399c2c4` |
| [tests/game-platform-invite.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-invite.test.js) | `106bc5e0f92f3e9276aad52a3108d786f9aac4dc` |
| [tests/game-platform-shell.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-shell.test.js) | `64e6251a273fe972a6932052e777bc5fe91152ba` |
| [tests/game-platform-cant-stop-invite.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-cant-stop-invite.test.js) | `a5d45e048897b6de7f97b1fc4972f35de3cefe96` |
| [tests/game-platform-cant-stop-room-lobby.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-cant-stop-room-lobby.test.js) | `3fbc8df4ea5e9eeebf267073eee4eaa065bc6131` |
| [tests/game-platform-no-thanks-room-lobby.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-no-thanks-room-lobby.test.js) | `6a81337d01ef914bba52c5205424fe929c4c28db` |
| [tests/game-platform-cant-stop-lobby-controller.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-cant-stop-lobby-controller.test.js) | `6f24996d26ff20965b07b238c2747c37e1ed42e8` |
| [tests/game-platform-no-thanks-lobby-controller.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-no-thanks-lobby-controller.test.js) | `025c9110b53b57dbf73cd42f0d7cb4f779780a26` |
| [the-game/tests/bgm.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/the-game/tests/bgm.test.js) | `e0a781de94d6b5dcebb5abd76d2347aefd09f9bd` |
| [tests/game-platform-no-thanks-bgm.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-no-thanks-bgm.test.js) | `c5400f0aa8c5744198a05b6e073f92dc800984da` |
| [tests/game-platform-cant-stop-audio.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-cant-stop-audio.test.js) | `47cb580e9dc6e77a147c3f13977d6f09f6ee4031` |
| [tests/e2e/site-invite.spec.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/e2e/site-invite.spec.js) | `3b91a71067d7ff38ae170cad5b8ffae6971adc2d` |
| [tests/game-platform-no-thanks-shell.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-no-thanks-shell.test.js) | `ef16781d81ca813d7d80c6925c769266e19bf076` |
| [tests/game-platform-cant-stop-runtime.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-cant-stop-runtime.test.js) | `f3495259fe694dbca7a7776d66a5d735a637216d` |
| [tests/game-platform-no-thanks-runtime.test.js](https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/tests/game-platform-no-thanks-runtime.test.js) | `878e7028bce52114aa9d65f6fc75f4ccccfcaa44` |
