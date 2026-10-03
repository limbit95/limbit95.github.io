# STEP 4B — 핵심 판단 근거 연결

[판단 전체](step-4b-astra-judgment.md)의 J01~13과 저장소 원문/공식 선택 확인을 연결한다. B는 source 관찰, V는 공식 문서 사실, J의 채택/보류는 이번 설계 추론이다. 출처가 있다는 이유만으로 프로젝트 구현·배포 검증 PASS가 되지 않는다.

## 판단별 연결

| 판단 | 저장소 근거 | 공식 원문 선택 확인 |
|---|---|---|
| J01 | B01, B02, B03, B05, B06, B11 | V02, V05, V08 |
| J02 | B06, B10, B11, B12, B15, B16, B19, B20, B24 | V03, V07 |
| J03 | B06, B15, B16, B17, B18 | V01, V02, V03, V07 |
| J04 | B03, B04, B23, B24, B25, B26 | V05, V06 |
| J05 | B10, B11, B12, B13, B15, B16, B17, B18, B19, B20, B42, B43, B44 | 기존 승인 계약/조사 확인 범위 재사용 |
| J06 | B03, B04, B07, B08, B09, B22 | 기존 승인 계약/조사 확인 범위 재사용 |
| J07 | B03, B23, B24, B27, B28, B29, B30, B31, B32, B33, B37, B38 | V04 |
| J08 | B10, B11, B12, B24, B29, B30, B31, B32, B33 | V04 |
| J09 | B29, B30, B31, B32, B33, B34, B35, B36, B37, B38, B39, B40, B41 | 기존 승인 계약/조사 확인 범위 재사용 |
| J10 | B01, B02 | V01, V02, V03, V04, V05, V06, V07, V08 |
| J11 | B02 | V09, V10, V11, V12 |
| J12 | B01, B02, B03, B07, B09, B11 | V01, V02, V03, V04, V05, V06, V07, V08, V09, V10, V11, V12 |
| J13 | B03, B04, B10, B11, B12, B15, B16, B17, B18, B19, B20, B24 | V02, V03, V04, V05, V07 |

## 저장소 고정 원문

기준 commit `3aeae1dfcce7788f88e706dcd49d283b91b67e82`의 blob/줄은 [준비 trace](step-4b-source-trace.md)에 있다. 이번 실제 HEAD tree에서도 아래 source blob이 같음을 재검증했다. 총44개 중 이 판단이 참조하는 source를 연결한다.

| ID | 고정 원문과 줄 | blob | 관찰 범위 |
|---|---|---|---|
| B01 | [game_platform_vnext_final_execution_plan.md:39–91](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/game_platform_vnext_final_execution_plan.md#L39-L91) | `e12ef038913eb6d605709b782f1b73f18e0d1253` | 최소Core·선택모델·비DB 동등 안전성의 승인 요구 |
| B02 | [game_platform_vnext_final_execution_plan.md:291–295](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/game_platform_vnext_final_execution_plan.md#L291-L295) | `e12ef038913eb6d605709b782f1b73f18e0d1253` | STEP4B 작업·게이트 |
| B03 | [docs/game-platform-db-test-contract.md:5–44](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-db-test-contract.md#L5-L44) | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` | 신규online 11안전성·Data API 권한 현행 의무 |
| B04 | [docs/game-platform-db-test-contract.md:93–144](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-db-test-contract.md#L93-L144) | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` | invalidation·rematch·중복/동시성·hostless 시작 조건 |
| B05 | [docs/game-platform-development-rules.md:417–465](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-development-rules.md#L417-L465) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | 조건부 Room·fake surface 금지·profile nickname |
| B06 | [docs/game-platform-development-rules.md:469–536](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-development-rules.md#L469-L536) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | 서버 검증·snapshot version·복귀 refresh |
| B07 | [docs/game-platform-development-rules.md:583–641](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-development-rules.md#L583-L641) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | 재대결 UX·hostless 변경 조건·invite 후 join 검사 |
| B08 | [docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md:975–1019](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L975-L1019) | `e1a6515b38db0164146ca3a51fc29aae60275c6a` | 실재 STEP1 LEGACY-DB ID와 원문 대응 |
| B09 | [docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md:104–125](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md#L104-L125) | `1c1f103adf56a160f1fba8e993cd7c38bbcf09e8` | 승인 hostless 조건·S2-R03 |
| B10 | [docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md:14–54](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md#L14-L54) | `036dab34e4445fb1a6059b4ca6bce0545a74ae94` | 승인 S3-T01~05 복구/rollback 판단 |
| B11 | [docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md:10–77](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md#L10-L77) | `5e40988234caba6cb605ea4c0b386a0a5b83b9c5` | owner/context/권한/순서/반영직전 재검증·T01~03 |
| B12 | [docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md:79–91](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md#L79-L91) | `5e40988234caba6cb605ea4c0b386a0a5b83b9c5` | 기존 부분 방어·공존 한계 |
| B13 | [docs/game-platform-rebuild/artifacts/step-4a-risks-and-followup.md:1–26](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-rebuild/artifacts/step-4a-risks-and-followup.md#L1-L26) | `127dba7bbfe7a423a5824efea6ac0043a1ab368f` | 승인 4B/5A/5B/5C/6 후속 경계 |
| B15 | [games/shared/snapshotCoordinator.js:8–69](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/games/shared/snapshotCoordinator.js#L8-L69) | `069f49aa23cfb2c5d591cafaed523fa358c78ba1` | integer version·낮은 값 거부·동일값 채택·await 후 처리 |
| B16 | [games/shared/snapshotCoordinator.js:72–124](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/games/shared/snapshotCoordinator.js#L72-L124) | `069f49aa23cfb2c5d591cafaed523fa358c78ba1` | coalesce·subscribe 후 refresh·stop/dispose |
| B17 | [games/shared/reconnectRefresh.js:12–58](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/games/shared/reconnectRefresh.js#L12-L58) | `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4` | online/pageshow/visible refresh·listener 정리 |
| B18 | [games/no-thanks/roomLobby.js:126–160](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/games/no-thanks/roomLobby.js#L126-L160) | `b689e6c0628824cc3d617bd5dc71ace424857fb3` | rooms/players notify·removeChannel 비동기 |
| B19 | [games/cant-stop/lobbyController.js:149–220](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/games/cant-stop/lobbyController.js#L149-L220) | `9fdecdea73fa6b96680d887a6ad5ad2d9031e8d6` | direct apply·same-room 추적·coordinator |
| B20 | [games/no-thanks/lobbyController.js:103–170](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/games/no-thanks/lobbyController.js#L103-L170) | `942a628ff1a675754f7ab92c53d5ecbddf3e6eab` | version/room/trackingGeneration 부분 방어 |
| B22 | [tests/game-db-integration/platformContract.js:1–126](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/tests/game-db-integration/platformContract.js#L1-L126) | `972dad82fe201924260cd528d6b794c5b33fb32a` | 11필수 시나리오 runner 정의 |
| B23 | [supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql:34–131](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql#L34-L131) | `d24ff683c8ffa6861bb287f986395d24fa4a8422` | snapshot 승인/active member·자기 counters 반환 |
| B24 | [supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql:169–239](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql#L169-L239) | `d24ff683c8ffa6861bb287f986395d24fa4a8422` | actor/payload 중복·저장응답·lock 후 재검사·version/member |
| B25 | [supabase/no-thanks/20260922085900_no_thanks_rematch.sql:17–118](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/no-thanks/20260922085900_no_thanks_rematch.sql#L17-L118) | `25c8a1e4a9fdb196ecd1c88c532c5832cc0522ee` | same-room 재대결·host/version/member·game/private/ready 초기화 |
| B26 | [supabase/no-thanks/20260924073500_no_thanks_randomized_draw_order.sql:3–90](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/no-thanks/20260924073500_no_thanks_randomized_draw_order.sql#L3-L90) | `7ab1a46e2fd3655e98767455d85e55ab432db8ae` | 후속 start 교체·승인/host/version/인원/ready |
| B27 | [supabase/no-thanks/20260922060000_no_thanks_realtime_publication.sql:1–27](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/no-thanks/20260922060000_no_thanks_realtime_publication.sql#L1-L27) | `a08e5e42daeac0881ec9c9b2a1bad5e1c7f9f13f` | publication rooms/players 추가 SQL |
| B28 | [supabase/no-thanks/20260922060100_no_thanks_private_helper_permissions.sql:1–19](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/no-thanks/20260922060100_no_thanks_private_helper_permissions.sql#L1-L19) | `2d991a5d1ea5b3933fa4da1324f402ad0e3fcaed` | private helper execute 회수·membership helper grant |
| B29 | [games/shared/accessGate.js:1–67](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/games/shared/accessGate.js#L1-L67) | `4803cd8fd141c98d97bd6357243a9f955843d6cc` | client authState access 계산·구독 |
| B30 | [js/auth.js:137–218](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/js/auth.js#L137-L218) | `09eb6d21b2d259567c0ba1b1a0aecfbd1bcac723` | profile approval·auth epoch·병렬 profile 조회 |
| B31 | [js/auth.js:252–297](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/js/auth.js#L252-L297) | `09eb6d21b2d259567c0ba1b1a0aecfbd1bcac723` | auth 이벤트·TOKEN_REFRESHED session/user 갱신 |
| B32 | [supabase/site/baseline/07_common_triggers.sql:85–158](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/site/baseline/07_common_triggers.sql#L85-L158) | `e92963433b9c4e95b9a2dc8e174862e64ece5b4a` | auth.uid/profiles approval helper·특권column trigger |
| B33 | [supabase/site/baseline/11_rls.sql:90–119](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/site/baseline/11_rls.sql#L90-L119) | `f5d7db2a36e39e65c4d3f7f5718ad40757761f33` | profile 본인/admin RLS·browser INSERT 없음 |
| B34 | [supabase/cant-stop/20260920205000_cant_stop_profile_nickname.sql:10–78](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/cant-stop/20260920205000_cant_stop_profile_nickname.sql#L10-L78) | `66da72b90a4c2ae8c8985647e163cb7f9e31b63b` | server profile nickname 조회·trigger |
| B35 | [supabase/no-thanks/20260921225000_no_thanks_room_lobby_foundation.sql:136–161](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/no-thanks/20260921225000_no_thanks_room_lobby_foundation.sql#L136-L161) | `3bcd84b7b4cdfa40dbc5b2c3aa2c10e35dbc3538` | approved profile display name helper |
| B36 | [supabase/site/migrations/20260920062255_display_name_uniqueness.sql:1–45](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/site/migrations/20260920062255_display_name_uniqueness.sql#L1-L45) | `53420ea42df2633170f8e36fc2579a9a5e47d8bf` | uniqueness index·availability 함수·grant |
| B37 | [supabase/site/migrations/20260828073047_create_site_invite_infrastructure.sql:1–132](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/supabase/site/migrations/20260828073047_create_site_invite_infrastructure.sql#L1-L132) | `c0afec893da8d33deda14b8784deb1108f7b4cbb` | site invite 본체·approval/expiry/revoke/creator/admin |
| B38 | [js/invites/inviteApi.js:1–25](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/js/invites/inviteApi.js#L1-L25) | `e1747b294e25fec6e83502dc20299499f72843fa` | site_invite RPC 공통 wrapper |
| B39 | [games/shared/gameInvite.js:29–115](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/games/shared/gameInvite.js#L29-L115) | `4d4b667e85162b19fb4e1607bfcc094a1bd4556d` | Registry gate·game_room metadata 검사 |
| B40 | [games/shared/registry.js:1–113](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/games/shared/registry.js#L1-L113) | `afa4ba25824157534eca7ca7538b89571cfca30e` | Registry5/shared2·capability metadata |
| B41 | [js/pages/games.js:47–128](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/js/pages/games.js#L47-L128) | `81614a6496b77415f4aef7aa26181f63dbc6f948` | 사이트 별도 카드 목록·renderGames |
| B42 | [docs/game-platform-rebuild/artifacts/step-4a-research-verification.md:1–32](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-rebuild/artifacts/step-4a-research-verification.md#L1-L32) | `cb08c6531dbdb1c4efe108910583d0ec1d8bd896` | 전회 원본·S01~07 선택 확인 기록 |
| B43 | [docs/game-platform-rebuild/artifacts/step-3-auxiliary-research-report.md:1–258](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-rebuild/artifacts/step-3-auxiliary-research-report.md#L1-L258) | `2c14ae22a279859eabbfbba31a29eaf4911607e6` | 전회 authority/rollback/rejoin/time 조사 원본 |
| B44 | [docs/game-platform-rebuild/artifacts/step-3-source-trace.md:1–73](https://github.com/limbit95/limbit95.github.io/blob/3aeae1dfcce7788f88e706dcd49d283b91b67e82/docs/game-platform-rebuild/artifacts/step-3-source-trace.md#L1-L73) | `812100981f55fab9793b7ba44237399db76a5781` | 승인 S3-E/X 참조·확인 위치·제한 |

V01~12의 URL·선택 절·한계는 [출처 검토](step-4b-research-verification.md)에 기록했다. 원본 Q01은 J02/03, Q02는 J04/05, Q03은 J07/08, Q04는 J01/10/11에 주로 대응한다. 사이트 source는 J09, 현행 의무 충돌은 J06, 미확정은 J12, 검증 oracle은 J13에서 종합했다. 외부 원문 전수 감사나 실제 제품 통합 테스트는 수행하지 않았다.
