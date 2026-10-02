# STEP 4A — 정식 계약 반영 source trace

상태: **가이드4 정식 제출 / 검토 대기**. 준비 [source trace](step-4a-source-trace.md)를 변경하지 않고 그 고정 source index33개를 재사용한다. 이 문서는 정확한 반영 위치와 판단 근거를 연결하며 새 설계 결정을 추가하지 않는다.

## 1. 고정 입력과 원본 보존

- 판단 입력 commit `36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd`, blob `b471f4c3c6a45976f2a08008d2263102886c6959`. 원문 [Astra 판단](step-4a-astra-judgment.md)의 §1~9 전체를 아래 세 문서에 각1회 반영한다.
- [보조 조사 원본](step-4a-auxiliary-research-report.md): blob `b034af1639ae3c94c80373623f856c48517c0c9d`, SHA256 `7d51370677e5e351a43655e92d07ff8e1e7d2cbc32d2badb7bee1b603f404927`, 35368 bytes.
- [출처/미확인 검토](step-4a-research-verification.md): blob `cb08c6531dbdb1c4efe108910583d0ec1d8bd896`. 공식 출처 S01~07은 이 확인 범위와 제한을 그대로 따른다. listener 재사용 제한·resolved/settled 구분·OAuth/HTTP cache의 적용 범위도 보존한다.
- 계획1.3·유효 규칙·승인 STEP1~3는 integration `ad7655a051f0dbb13444eec6f469f6f98f9794f4`에 고정한다. 해당 source의 기존 승인/이력 표기를 현재 상태로 재작성하지 않는다.

## 2. 판단 전체의 반영 대응

| 원문 절 | 고정 원문 줄 | 정식 반영 문서·줄 | 내용/근거 연결 |
|---|---|---|---|
| §1 | [L5–12](https://github.com/limbit95/limbit95.github.io/blob/36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd/docs/game-platform-rebuild/artifacts/step-4a-astra-judgment.md#L5-L12) | [step-4a-responsibility-boundaries.md](step-4a-responsibility-boundaries.md) L10–17 | 기준/방법·원본·출처 제한 / E01~05·검토S01~07 |
| §2 | [L13–27](https://github.com/limbit95/limbit95.github.io/blob/36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd/docs/game-platform-rebuild/artifacts/step-4a-astra-judgment.md#L13-L27) | [step-4a-responsibility-boundaries.md](step-4a-responsibility-boundaries.md) L18–32 | 책임6주체 / E02/03/07~11/14/17~19/29~31 |
| §3 | [L28–38](https://github.com/limbit95/limbit95.github.io/blob/36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd/docs/game-platform-rebuild/artifacts/step-4a-astra-judgment.md#L28-L38) | [step-4a-responsibility-boundaries.md](step-4a-responsibility-boundaries.md) L33–43 | 의존 허용·금지/공존 / E02/03/14/15/22~28 |
| §4 | [L39–52](https://github.com/limbit95/limbit95.github.io/blob/36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd/docs/game-platform-rebuild/artifacts/step-4a-astra-judgment.md#L39-L52) | [step-4a-responsibility-boundaries.md](step-4a-responsibility-boundaries.md) L44–57 | 규칙→계약7행 / E07~09/15~21·LEGACY선택10조항 |
| §5 | [L53–69](https://github.com/limbit95/limbit95.github.io/blob/36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd/docs/game-platform-rebuild/artifacts/step-4a-astra-judgment.md#L53-L69) | [step-4a-lifetime-contract.md](step-4a-lifetime-contract.md) L10–26 | 수명8범위·식별/generation / E02/03/10/11/17/22~27 |
| §6 | [L70–104](https://github.com/limbit95/limbit95.github.io/blob/36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd/docs/game-platform-rebuild/artifacts/step-4a-astra-judgment.md#L70-L104) | [step-4a-lifetime-contract.md](step-4a-lifetime-contract.md) L27–61 | 채택5조건·완료6경로·정리7조건 / E10/16/22~27·S01~07 |
| §7 | [L105–121](https://github.com/limbit95/limbit95.github.io/blob/36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd/docs/game-platform-rebuild/artifacts/step-4a-astra-judgment.md#L105-L121) | [step-4a-lifetime-contract.md](step-4a-lifetime-contract.md) L62–78 | T01~03×6경로·권한/version 제한 / E10/20~27 |
| §8 | [L122–134](https://github.com/limbit95/limbit95.github.io/blob/36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd/docs/game-platform-rebuild/artifacts/step-4a-astra-judgment.md#L122-L134) | [step-4a-lifetime-contract.md](step-4a-lifetime-contract.md) L79–91 | source보장부족·공존4사례 / E02/06/10~12/15~17/22~28 |
| §9 | [L135–151](https://github.com/limbit95/limbit95.github.io/blob/36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd/docs/game-platform-rebuild/artifacts/step-4a-astra-judgment.md#L135-L151) | [step-4a-risks-and-followup.md](step-4a-risks-and-followup.md) L10–26 | 충돌/회귀·후속7행 / E02/03/08~13·S3-R01~07 |

각 절 본문은 원문과 바이트 동일하다. 상대 링크는 모두 같은 artifacts 디렉토리에 남아 있어 해석 대상이 동일하다. 새 헤더는 상태/권위/탐색 안내만 추가한다. 본문에 있는 과거 단계 상태를 새 설계 결론으로 고쳐 쓰지 않는다.

## 3. 고정 저장소 source index33개

| ID | 고정 SHA 경로·줄 | blob SHA | 확인 범위 |
|---|---|---|---|
| S4A-E01 | [AGENTS.md L123–135](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/AGENTS.md#L123-L135) | `2686a3c37502bbf1f7f2a9407640e78cc026dadb` | vNext 운영 예외 |
| S4A-E02 | [game_platform_vnext_final_execution_plan.md L9–137](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/game_platform_vnext_final_execution_plan.md#L9-L137) | `e12ef038913eb6d605709b782f1b73f18e0d1253` | §1~3 계승·Core 최소·공존 |
| S4A-E03 | [game_platform_vnext_final_execution_plan.md L285–295](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/game_platform_vnext_final_execution_plan.md#L285-L295) | `e12ef038913eb6d605709b782f1b73f18e0d1253` | 4A/4B 게이트 |
| S4A-E04 | [docs/game-platform-rebuild/README.md L1–60](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-rebuild/README.md#L1-L60) | `2263aa90a0e49f0cb6935f0d2558d25c5799426c` | 기록 운영 |
| S4A-E05 | [docs/game-platform-rebuild/checkpoints/CP-0029-step-3-approved.md L1–31](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-rebuild/checkpoints/CP-0029-step-3-approved.md#L1-L31) | `6ee329b295985e5ddcfc45d8566463484efdb360` | 승인 범위 |
| S4A-E06 | [docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md L111–163](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md#L111-L163) | `f7929e663f9ba5465536bfecffad0f039156781c` | F/R/U/IMPL |
| S4A-E07 | [docs/game-platform-rebuild/artifacts/step-1-clause-succession-table.md L41–110](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-rebuild/artifacts/step-1-clause-succession-table.md#L41-L110) | `18c3c76589a7db8303ca210886ba981dd8518813` | 조항 강도·조건·계승 |
| S4A-E08 | [docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md L15–125](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md#L15-L125) | `1c1f103adf56a160f1fba8e993cd7c38bbcf09e8` | 장르·조건·리스크 |
| S4A-E09 | [docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md L9–76](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md#L9-L76) | `52d209d250ba76f351ea13db33aa6259ba641e71` | 7축·Capability |
| S4A-E10 | [docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md L14–43](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md#L14-L43) | `036dab34e4445fb1a6059b4ca6bce0545a74ae94` | T01~03 전체 |
| S4A-E11 | [docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md L37–93](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md#L37-L93) | `0236dccd268617edf14e6158f582cda9b25b8c8b` | C09/C11 |
| S4A-E12 | [docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md L14–83](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md#L14-L83) | `9f291884fc0de2e4e0ff65a43f6d92002f62c9a7` | R01~07/회귀/후속/X01~07 |
| S4A-E13 | [docs/game-platform-rebuild/artifacts/step-3-post-audit.md L1–137](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-rebuild/artifacts/step-3-post-audit.md#L1-L137) | `8ce22106def93adb5bb7c3b29b440ae5c9dc80d0` | 고정 감사·한계 |
| S4A-E14 | [docs/game-platform-development-rules.md L281–364](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-development-rules.md#L281-L364) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | reuse/game-local |
| S4A-E15 | [docs/game-platform-development-rules.md L418–454](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-development-rules.md#L418-L454) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | Room/Session·fake method 금지 |
| S4A-E16 | [docs/game-platform-development-rules.md L470–538](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-development-rules.md#L470-L538) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | 권위/version/cleanup |
| S4A-E17 | [docs/game-platform-development-rules.md L574–614](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-development-rules.md#L574-L614) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | 종료·재대결 |
| S4A-E18 | [docs/game-platform-ui-rules.md L147–309](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-ui-rules.md#L147-L309) | `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9` | baseline/override |
| S4A-E19 | [docs/game-platform-governance.md L46–76](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-governance.md#L46-L76) | `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169` | 문서 권위·영향도 |
| S4A-E20 | [docs/game-platform-db-test-contract.md L5–39](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-db-test-contract.md#L5-L39) | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` | 현행 적용·11안전성 |
| S4A-E21 | [docs/game-platform-db-test-contract.md L104–144](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-db-test-contract.md#L104-L144) | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` | rematch/private/중복/동시성 |
| S4A-E22 | [games/shared/snapshotCoordinator.js L8–137](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/shared/snapshotCoordinator.js#L8-L137) | `069f49aa23cfb2c5d591cafaed523fa358c78ba1` | version/load/catch/finally/stop/dispose |
| S4A-E23 | [games/shared/reconnectRefresh.js L12–58](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/shared/reconnectRefresh.js#L12-L58) | `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4` | refresh/listener/error |
| S4A-E24 | [games/cant-stop/lobbyController.js L99–241](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/cant-stop/lobbyController.js#L99-L241) | `9fdecdea73fa6b96680d887a6ad5ad2d9031e8d6` | emit/trackRoom/command/initialize |
| S4A-E25 | [games/cant-stop/lobbyController.js L274–314](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/cant-stop/lobbyController.js#L274-L314) | `9fdecdea73fa6b96680d887a6ad5ad2d9031e8d6` | ready/start/leave |
| S4A-E26 | [games/no-thanks/lobbyController.js L103–300](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/no-thanks/lobbyController.js#L103-L300) | `942a628ff1a675754f7ab92c53d5ecbddf3e6eab` | generation/room/disposed·command |
| S4A-E27 | [games/no-thanks/lobbyController.js L388–465](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/no-thanks/lobbyController.js#L388-L465) | `942a628ff1a675754f7ab92c53d5ecbddf3e6eab` | leave/rematch/refresh/dispose |
| S4A-E28 | [games/shared/roomLobbyContract.js L1–28](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/shared/roomLobbyContract.js#L1-L28) | `4d037bd1b56715aae631220d1c848bc521a56ce0` | 8surface |
| S4A-E29 | [games/shared/accessGate.js L1–67](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/shared/accessGate.js#L1-L67) | `4803cd8fd141c98d97bd6357243a9f955843d6cc` | 인증·승인gate |
| S4A-E30 | [games/shared/registry.js L1–51](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/shared/registry.js#L1-L51) | `afa4ba25824157534eca7ca7538b89571cfca30e` | metadata |
| S4A-E31 | [games/shared/gameInvite.js L30–90](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/shared/gameInvite.js#L30-L90) | `4d4b667e85162b19fb4e1607bfcc094a1bd4556d` | room Invite |
| S4A-E32 | [tests/game-platform-contracts.test.js L80–195](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/tests/game-platform-contracts.test.js#L80-L195) | `182dd2719bcfc4872c3d990ab7b6d2149399c2c4` | 기존test(이번 미실행) |
| S4A-E33 | [package.json L1–20](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/package.json#L1-L20) | `917a55aa474d98cc663364c5e7dab84ff6fe5cf1` | 실제scripts |

## 4. 조항·시나리오·후속의 연결

- LEGACY-DEV-229~234/262/264/272/311 원문10행: [준비 trace의 선택 조항](step-4a-source-trace.md). 원문·강도·조건을 유지하며 정식 책임 문서 §4로 연결한다. 전수 계승표2104행을 재분류한 작업이 아니다.
- T01~03: [승인 STEP3](step-3-transition-scenarios.md)와 정식 수명 문서 §7. room 동일/재진입/view 변경에서 성공·오류·null·finally·정리·경계 판정을 모두 보존한다. effect는 §6에서 동일 채택 조건으로 연결한다.
- C09/C11: [승인 matrix](step-3-stress-matrix.md)와 수명 문서 §5/8. roomless/초기hostless·현행 재대결 의무·장기 상태·현행snapshot 공존의 제한을 함께 보존한다.
- S3-R01~07/회귀 조건: [승인 리스크](step-3-risks-and-followup.md)와 정식 후속 문서 §9. 이번에 해결 완료로 닫지 않는다.
- 단계 소유: 4B ordering/보안/운영, 5A 재사용, 5B Result/Publication/Sound, 5C 장르, 6 API/경로/동결. 이번 정식 반영이 후속 결정을 선확정하지 않는다.
- 현재 F01=버전·수명, F02=No Thanks handoff/활성화 불일치, F03=DB 테스트 안내 개수 불일치. 오래된 채팅의 F02 의미를 사용하지 않는다.
