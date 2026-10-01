# Game Platform vNext — CURRENT

> 이 파일은 플랫폼 규칙의 CURRENT rulebook이 아니라 `game-platform-vnext` 재구축 작업의 **현재 진행 상태**다.

## 기준

- 실행 계획: `/game_platform_vnext_final_execution_plan.md`
- 계획 개정: **1.3**
- 계획 blob SHA: `e12ef038913eb6d605709b782f1b73f18e0d1253`
- 작업 root-slug: `game-platform-vnext`
- 계획의 이전 대조 기준 main: `c6b1e31b3fefef2c20a7a0f5841c5a16c996a559`
- STEP 0 착수 main: `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`
- integration 최초 생성 기준 main: `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`
- vNext integration: `feature/game-platform-vnext-integration`
- STEP 1 착수 시 확인한 integration HEAD: `132ec1576e316d0238c9ca6e07d0d3ab91950ec8`
- 승인 기록 저장 직전 integration에 반영된 마지막 승인 STEP: **STEP 0 — PR #404 / merge commit `df43b4a60518ace86f6c5db4344bea81b0d0d4f7`**
- STEP 0 사후 기록 반영: **PR #406 / merge commit `394ae9aada9b99d9fb049fa0a3278f50133f3290`**
- 기준 SHA 이후 변경 감사: `c6b1e31... → STEP 0 착수 main` 사이에는 실행 계획 개정 1.2 파일 1개 추가만 있었고 기존 플랫폼 규칙, `games/shared/`, Registry, Guard, 테스트, 출시 상태 변경은 없었음.
- 개정 1.3 정합화 시점의 main과 integration: **identical**. 이후 각 STEP에서 반복 main 동기화를 기본 절차로 두지 않음.

## 현재 상태

- 현재 STEP: **STEP 3 — 미래 게임 Stress Test 1차 / Work Sol 근거 준비**
- STEP 0 / STEP 1 / STEP 2: **COMPLETED / COMPLETED / COMPLETED**
- integration 마지막 승인 반영 STEP: **STEP 2 — PR #409 MERGED / merge SHA `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`**
- STEP 3 착수 integration HEAD / 분기 SHA: `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`
- STEP 3: **IN_PROGRESS — 근거 준비만; Astra 핵심 판단·정식 matrix 미수행**
- active STEP branch: `docs/game-platform-vnext-phase3-stress-preparation`
- STEP PR: 준비 제출 전 미생성. Draft 제출 후 실제 번호/base/head는 후속 기록에서 확인한다.
- STEP 3 시작 허용: 있음 — 2026-10-01T17:26:10+09:00 사용자 근거 준비 범위 명시
- STEP 3 결과 승인 / integration merge 승인: 없음 / 없음
- integration → main 승인/반영: 없음 / 미수행
- 최신 checkpoint: `checkpoints/CP-0019-step-3-preparation.md`
- 산출물: [분담](artifacts/step-3-work-allocation.md), [근거](artifacts/step-3-evidence-brief.md), [조사 입력](artifacts/step-3-auxiliary-research-input.md), [조사 요청](artifacts/step-3-auxiliary-research-request.md), [검증](artifacts/step-3-preparation-validation.md)
- 다음 첫 작업: 준비 자료의 원격 제출 확인 후 사용자에게 조사 입력·요청문을 전달하고 정지. 보조 조사 활용 시 사용자가 결과를 Work에 전달한 뒤 Astra 판단을 별도 지시한다.
- STEP 4A 이후 NOT_STARTED. 기존 코드·규칙·계획·STEP1/2 산출물·DECISIONS·과거 checkpoint 보존.
- 과거 CURRENT/CP0017의 PR409 OPEN/반영 STEP1은 병합 직전 이력이다. 실제 merged 상태·CP0017 계보에 따라 복원했다. phase2 브랜치는 종료 이력이다.

## 22개 검토 지점

| 단계 | 상태 |
|---|---|
| 0 | COMPLETED |
| 1 | COMPLETED |
| 2 | COMPLETED |
| 3 | IN_PROGRESS |
| 4A | NOT_STARTED |
| 4B | NOT_STARTED |
| 5A | NOT_STARTED |
| 5B | NOT_STARTED |
| 5C | NOT_STARTED |
| 6 | NOT_STARTED |
| 7A1 | NOT_STARTED |
| 7A2 | NOT_STARTED |
| 7A3 | NOT_STARTED |
| 7B | NOT_STARTED |
| 7C | NOT_STARTED |
| 7D | NOT_STARTED |
| 8 | NOT_STARTED |
| 9A | NOT_STARTED |
| 9B | NOT_STARTED |
| 10 | NOT_STARTED |
| 11 | NOT_STARTED |
| 12 | NOT_STARTED |

## 유지해야 할 실행 경계

- 통합 플랫폼 / 기존 규칙 조항별 계승 / 기존 게임 무이관 원칙을 유지한다.
- STEP 6 전에는 실제 vNext 코드 물리 배치를 확정하거나 새 공통 runtime 구현을 시작하지 않는다.
- STEP별 작업은 최신 승인 integration에서 별도 브랜치로 수행하고, STEP PR은 integration을 base로 둔다.
- STEP PR의 integration 병합과 integration → main 반영은 별도의 승인 게이트로 구분한다.
- 사용자가 재구축 중 main에 새 기능을 추가하지 않을 예정이라는 점은 이번 작업의 운영 가정이며 저장소 전체의 개발 금지 규칙으로 확대하지 않는다.
- **STEP 9B 주의:** 추가 구현 허용은 이미 검토된 계약의 구현에 한정한다. 기존 계약으로 표현할 수 없는 새 공통 계약·새 Runtime Model 의미·Core 책임이 필요하면 구현을 확장하지 않고 관련 설계 STEP으로 돌아가 검토하며, 필요한 범위에서 STEP 6 Target 동결 검토를 다시 거친다.
- Game-local이나 Capability는 공통 수명·권한·모델 계약을 우회하기 위한 수단으로 사용하지 않는다.

## STEP 0 검증 요약

- integration 최초 생성: PASS — 실제 최신 main `69a7fcb...`에서 `feature/game-platform-vnext-integration` 생성
- STEP 0 착수 main / integration 최초 생성 main: PASS — 동일 SHA `69a7fcb...`, 두 의미는 기록상 구분
- main ↔ integration 최초 상태: PASS — identical
- PR #404 base/head: PASS — integration ← `docs/game-platform-vnext-phase0-bootstrap`, MERGED / merge commit `df43b4a60518ace86f6c5db4344bea81b0d0d4f7`
- 루트 실행 계획 교체: PASS — 첨부 개정 1.3과 Git blob SHA `e12ef038913eb6d605709b782f1b73f18e0d1253` 일치
- PR diff 범위: PASS — 계획/기록/AGENTS/루트 진입 안내 10개 경로만 변경, 게임 코드·DB/RPC·Registry·Guard·runtime 변경 없음
- 기존 CP-0001 보존: PASS — 개정 1.2 당시 사실 기록으로 수정하지 않음
- 전체 테스트: NOT_RUN — 문서/브랜치 운영 정합화이며 코드·아키텍처 계약 변경 없음
- 새 채팅 관점 기록 탐색 재현: PASS — AGENTS/루트 계획 → 기록 README → integration/CURRENT → 최신 checkpoint/DECISIONS 순서로 STEP 0 완료·STEP 1 미착수·통합 기준선·승인 상태·다음 행동 복원
- 원격 보존: PASS — CP-0002 생성 commit `070ca2e53135dbe73a85c35df34b631050963115` 후 작업 브랜치에서 계획/CURRENT/CP-0001/CP-0002/DECISIONS read-back 확인

## STEP 0 사후 병합 정합화

- PR #404 실제 병합: PASS — 2026-09-30T17:54:59+09:00
- 병합 대상: `feature/game-platform-vnext-integration`
- merge commit: `df43b4a60518ace86f6c5db4344bea81b0d0d4f7`
- 병합 후 integration에서 개정 1.3 계획/CURRENT/CP-0003 조회: PASS
- `main` 반영: 미수행 — 별도 승인 게이트 유지
- STEP 1: NOT_STARTED

## STEP 0 사후 감사 정정

- 감사 판정: **경미한 수정 후 STEP 1 진입 가능**
- 아키텍처/실행 계획 1.3/Governance 훼손: **확인되지 않음**
- D-0004의 미병합 상태 문구: 결정 채택 당시 상태로 정정하고 현재 상태는 CURRENT/checkpoint에서 추적
- PR #406: 사용자 명시적 병합 승인 후 integration에 MERGED / merge commit `394ae9aada9b99d9fb049fa0a3278f50133f3290`
- CP-0001의 “open PR 없음”: 저장소 전체가 아니라 당시 동일 `game-platform-vnext` 작업 계보의 open PR 없음으로 범위를 정정 기록
- 과거 CP-0001~0004는 당시 기록 보존 원칙에 따라 수정하지 않음
- STEP 1 시작 조건: **이 정정 기록이 integration에 반영되고 사용자 별도 시작 지시가 있을 것**

## STEP 1 재개 확인

- CP-0007에서 로컬/원격 HEAD `467e6b8351c1236d4a9eb6fed71de534594f1e27` 일치와 깨끗한 작업 트리를 확인했다.
- CP-0007 당시 착수 기록 두 파일만 반영돼 있었고, AS-IS/조항표/최종 검증/PR은 미완료, 코드 테스트는 미실행이었다. 이후 진행은 아래 제출 준비 기록으로 연결한다.
- 아래/위 STEP 0 절의 STEP 1 미착수 표기는 당시 종료 이력이다. 현재 STEP 상태는 상단과 22개 검토 지점 표를 따른다.


## STEP 1 결과 제출과 검토 대기

- 기록 시각: **2026-10-01T00:45:31+00:00**
- checkpoint 저장 직전 STEP HEAD: `77ddb87f9ade947a763bffca0b108d80baa558f5` (자신의 commit SHA가 아님)
- integration 재확인: `132ec1576e316d0238c9ca6e07d0d3ab91950ec8` — 마지막 승인 반영 STEP 0 유지
- 산출물: [AS-IS](artifacts/step-1-as-is-audit.md), [전수 계승표 인덱스](artifacts/step-1-clause-succession-table.md), [source inventory](artifacts/step-1-source-inventory.md), [검증/재현](artifacts/step-1-validation.md)
- 원문 표: [공통·Governance·DB](artifacts/step-1-clauses-platform.md), [UI·템플릿](artifacts/step-1-clauses-design.md), [기존 게임](artifacts/step-1-clauses-games.md), [사이트·이력](artifacts/step-1-clauses-site-history.md)
- 감사 완료 범위: 26문서(게임 Markdown 14개 전부), 원문 3,232단위, 규칙·필드 2,104개(K 1,198 / L 906). 코드 증거 57파일은 산출물의 명시된 범위에서 읽음.
- findings: Critical 0 / Major 2 / Minor 1; 실행 위험 5, 암묵적 후보 8. 기존 코드/문서 수정으로 해결하지 않음.
- 검증: 본문 trace/ID/강도/원본 불변 PASS, 기존 contract/governance 45 PASS, Guard PASS. F01 두 메모리 재현 OBSERVED. 전체 게임/DB/browser/production 검증 NOT_RUN(문서 단계).
- 미완료: 사용자 범위·분류·누락·finding 검토 및 STEP 승인. 새 책임 문서/계약/모델은 이후 설계 STEP의 미결정이다.
- 새 Architecture Decision 없음. DECISIONS와 실행 계획 개정 1.3 불변. STEP 2 NOT_STARTED, integration/main 병합 승인 없음.

- 원격 산출물 보존: `77ddb87f9ade947a763bffca0b108d80baa558f5` — 로컬 index tree와 원격 commit tree `47f9deb85d26318894eaafe524530793de536278` 일치, fetch 후 깨끗한 작업 트리 확인.
- PR #408 생성: `2026-10-01T00:43:28Z`. 제출 시 base SHA `132ec1576e316d0238c9ca6e07d0d3ab91950ec8`, head SHA `77ddb87f9ade947a763bffca0b108d80baa558f5`, OPEN / merged=false / mergeable_state=clean 확인.
- CI: 제출 head에서 PR workflow runs 0 / check-runs 0, **NOT_TRIGGERED**. 문서 경로 제외와 일치하며 PASS로 기록하지 않음.
- 최신 기록 commit 자체의 SHA는 Git에서 CP-0009를 포함하는 commit으로 찾는다. PR 제출 head와 기록 저장 후 HEAD를 혼동하지 않는다.
- 이 기록은 #408과 같은 STEP 브랜치에 누적한다. 사용자 검토·명시적 integration merge 승인 전에는 병합하지 않고, STEP 2 시작도 별도 지시와 실제 integration 반영 확인이 필요하다.


## STEP 1 사후 감사 보완 — 2026-10-01T02:33:59+00:00

- 요청 범위: 사후 감사 보고서 §4 P1-1/P1-2의 문서 보완·검증·기록·원격 제출.
- AUDIT-S1-001 Minor: LEGACY-BGM-026~064 총 39행의 E-DOC→E-BGM 근거 연결 보완 완료, 사용자 재검토 대기.
- ID·원문·강도·조건·분류·계승 정보와 나머지 BGM 42행 불변; 3,232단위/2,104규칙·필드/K1,198/L906 유지. 검증은 [validation](artifacts/step-1-validation.md), 사실 기록은 [CP-0010](checkpoints/CP-0010-step-1-audit-correction.md).
- 기존 AS-IS F01~F03(Critical 0/Major 2/Minor 1)은 불변이며 이번 산출물 오류와 별도 집계한다.
- 보완 저장 직전 HEAD: `8e02d0dba5c3d3e9d48f7bb62afab54acf6158af`. 실제 저장 후 commit SHA·원격 보존·CI 상태는 Git/PR read-back과 결과 보고로 확인한다.
- STEP 1 REVIEW_PENDING, STEP 2 이후 NOT_STARTED. 사용자 최종 승인·integration merge 승인 없음, integration/main 병합 미수행.


## STEP 1 사용자 승인 — 2026-10-01T03:39:32+00:00

- STEP 1 결과 승인 및 PR #408 → integration 병합이 명시적으로 승인됐다. STEP 2는 시작하지 말라는 사용자 지시가 있다.
- 최신 [CP-0011](checkpoints/CP-0011-step-1-approved.md)이 승인과 병합 사실 조회 경로를 기록한다. 위 과거 절의 REVIEW_PENDING/미승인은 당시 사실이며 현재 결과 승인 상태를 대신하지 않는다.
- 이 파일의 저장 직전 integration은 STEP 0까지만 반영됐다. #408 실제 merged 상태와 CP-0011 존재가 확인되면 integration에 반영된 마지막 승인 STEP은 STEP 1이며 현재 작업 브랜치는 종료 이력이다. 실제 merge SHA·최신 integration HEAD는 Git/PR에서 조회한다.
- STEP 2 및 이후 NOT_STARTED, STEP 2 시작 승인 없음. integration→main 미승인·미수행.

## STEP 2 착수

- PR #408 merged=true와 실제 integration HEAD를 대조해 병합 후 기준선을 복원했다. 과거 절의 미승인·미착수는 당시 기록이며 현재 상태와 22개 표가 최신이다.
- 모델별 분담과 선택 조항 근거만 준비했다. 정식 STEP 2 산출물·Astra 판단·사용자 검토는 미완료다.
- 로컬 검증: 선택 조항56행(보드 조건49+경계7)의 원문·ID·강도·분류 완전 일치/중복ID 없음, 링크와 22개 상태표, diff 공백 및 Governance Guard PASS. 변경은 착수 문서4파일이며 기존 계획·STEP 1 표·과거 checkpoint·게임 코드 변경 없음. 전체 게임/DB/브라우저 테스트는 기존 구현·계약 변경 없는 문서 준비 단계여서 재실행하지 않는다. 원격 CI 미실행은 PASS로 표시하지 않는다.

- 착수 원격 보존: `5d8f94a4448caeb5e232e4e3d19131d0169cd013`, tree `24b8be3b55c05c3a10185b0ddf6dd35a31387a58`. Draft PR #409 생성 확인. 최신 기록 저장 후 SHA는 Git에서 조회한다.
- 착수 제출 head `5d8f94a...`의 PR workflow runs 0 / check-runs 0: NOT_TRIGGERED. PASS로 집계하지 않는다.

## STEP 2 정식 산출물 작성과 검토 대기

- 직접 입력: 이 채팅 Astra STEP 2 판단 결과 전체. Sol 5.6 메모는 참고 입력으로 별도 원본 보존. 계획1.3·기존 유효 규칙이 우선한다.
- [장르 인덱스](artifacts/step-2-genre-rule-index.md): 묶음·논리적 소유자·조건·49개 조항별 제안·S2-R01~04.
- [구현 선택표](artifacts/step-2-implementation-selection.md): 7축·단일/복수·단계 변경·Capability·시간 분리·호환/충돌·지원 상태 구분.
- [GAME_SPEC 근거](artifacts/step-2-game-spec-selection-rationale.md): 기록 제안과 예시. 실제 템플릿 불변.
- [검증](artifacts/step-2-validation.md), [참고 조사 원본](artifacts/step-2-auxiliary-research-memo.md).
- 기존 분류·강도·조건·예외와 F01~F03을 보존한다. 논리적 분류 제안은 아직 채택된 Architecture Decision이 아니므로 DECISIONS 불변.
- 저장 직전 HEAD: `792d73befe676cfdc8f8c1f7b7a58a984841cc01`. 이번 저장 후 SHA는 Git/PR read-back으로 확인한다.
- PR #409는 제출 시 메타데이터를 갱신하고 검토 가능 상태로 전환한다. 현재 Draft 표기는 전환 전 조회 결과이며 실제 상태는 Git/PR에서 확인한다.
- STEP 2 REVIEW_PENDING, STEP 3 이후 NOT_STARTED. 사용자 결과 승인/merge 승인 없음. integration/main 미반영.

## STEP 2 제출 read-back

- 산출물 원격 commit: `882d8556a8e66b59c3b8f0f46f815fffb7869783`. 원격 branch ref·fetch와 로컬 tree 일치 확인.
- PR #409 OPEN / Ready for review / 미병합, 제목·설명 갱신 완료. PR head 반영은 최종 Git/PR read-back에서 별도로 대조한다.
- 위 산출물 commit의 workflow runs0/check-runs0: NOT_TRIGGERED. CI PASS 아님.
- 최신 제출 기록 자신의 SHA는 저장 후 Git에서 확인한다. STEP2 REVIEW_PENDING, 다음은 Astra 사후 감사.

- 제출 최종 조회 주의: 원격 STEP branch ref/fetch는 `d07a6760a50b1e9f6e6944055b62c7c654bc2053`으로 확인됐지만 PR #409 API head는 여전히 착수 HEAD `792d73befe676cfdc8f8c1f7b7a58a984841cc01`을 반환했다. PR head 일치 검증은 **확인 필요**이며 PASS가 아니다. 이후 Git/PR에서 다시 대조한다. 사후 감사는 최신 branch 또는 위 고정 commit의 정식 산출물로 수행하고 이전 PR diff만으로 판단하지 않는다.
- 위 최종 기록 head의 workflow/check-runs0/0도 NOT_TRIGGERED. 원격 산출물 보존과 PR 메타데이터/ready 갱신은 확인했으며 PR head 조회 불일치를 숨기지 않는다.

- 후속 재조회에서 PR #409 API head=`d61283c9db7bbc3ce795d32b6ccb7e739e89f4b3`과 원격 STEP branch가 일치함을 확인했다. 위 제출 당시 조회 불일치는 해소됐으며 승인 blocker로 남기지 않는다. 이 확인 기록 자체의 최신 SHA는 Git/PR에서 조회한다.

## STEP 2 사후 감사 문서 보완

- 감사 판정: 경미한 보완 후 승인 검토 가능 — Critical0 / Major0 / Minor2.
- AUDIT-S2-001: 기존 Astra 초안의 hostless 적용 조건을 보완. 초기 시작만 hostless이고 재대결은 기존 의무 충족 / 재대결에서도 host 불성립 / 정책 미정을 구분했다. 다른 의무·계약·구현 증거 확인은 별도이며 기존 규칙 변경은 없다.
- AUDIT-S2-002: 최초 검증7개, 감사 당시 제출8개/PR전체12개, 이번 보완 포함9개/PR전체13개의 비교 기준을 검증 기록에서 구분했다.
- 저장 직전 STEP HEAD: `78467ef4ecd54df4dfa352824abbbe3b79dd01f7`. 상세 보완·검증·제출 후 확인 방식: [CP0016](checkpoints/CP-0016-step-2-post-audit-fix.md), [STEP2 검증](artifacts/step-2-validation.md).
- STEP2 REVIEW_PENDING, STEP3 이후 NOT_STARTED. 사용자 결과 승인/merge 승인 없음. 새로운 Architecture Decision 없음; DECISIONS와 과거 checkpoint 불변.

## STEP 2 사용자 승인 및 병합 복원

- 사용자 지시: 2026-10-01T16:33:44+09:00, “STEP 2 결과를 승인하고 PR #409를 integration에 병합해줘. STEP 3는 시작하지 마.”
- 승인 대상: `101a1240b2d4a1411fe41dc1ce94983aa9b0d7ae`의 STEP2 산출물. 집중 재검토에서 AUDIT-S2-001/002 모두 해소, 추가 보완 불필요. 새 API/최종 모델/구현 지원을 승인한 것으로 확대하지 않는다.
- 위 사후 감사 절의 검토 대기/미승인은 당시 사실이다. 현재 사용자 결과 승인과 PR409의 integration 병합 승인으로 대체됐다.
- 승인 기록 저장 직전 integration은 STEP1까지 반영됐다. PR409의 실제 병합과 [CP0017](checkpoints/CP-0017-step-2-approved.md)/STEP2 산출물이 integration에 반영된 사실을 확인하면 마지막 반영 승인 STEP은 STEP2이며 active STEP branch는 없음(phase2 브랜치는 종료 이력)이다.
- 현재 STEP branch가 가리키는 승인 기록 commit의 integration 포함 여부는 Git 조상 관계로도 확인한다. 실제 merge SHA/최신 integration HEAD는 Git 또는 PR에서 조회하며 병합 직전 기록 값을 최신 상태보다 우선하지 않는다.
- STEP3 이후 NOT_STARTED, 시작 승인 없음. integration→main 승인/반영 없음. 승인 기록 외 산출물·기존 규칙·코드·DECISIONS·과거 checkpoint 불변.

## STEP 3 근거 준비 착수·제출 경계

PR409 실제 병합·integration `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`와 CP0017 반영을 확인하고 사용자 허용 범위만 시작했다. [CP0018](checkpoints/CP-0018-step-3-start.md)은 착수 사실, [CP0019](checkpoints/CP-0019-step-3-preparation.md)는 준비 결과·검증·다음 행동을 기록한다. source 읽기·사례 가정·미확인 질문을 분리했으며 정식 matrix/지원/Core 판정·외부 신규 조사·STEP4 계약 설계는 미수행이다. 원격 제출 SHA/PR/CI는 read-back 후 새 기록으로 연결한다.
