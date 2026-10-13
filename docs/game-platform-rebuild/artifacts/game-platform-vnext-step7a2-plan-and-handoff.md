# Game Platform vNext STEP7A2 — 작업 계획과 Sol/Astra 인계

작성일: 2026-10-13 KST. 담당: Sol/Codex.
지위: **계획/인계 문서**. 이번 요청은 PR #419 integration 병합·실제 반영 확인 및 STEP7A2 계획/분담 준비까지만 허용했다. 실제 보드 규칙·진입/템플릿·Guard 수정, 구현·시험·main 반영은 시작하지 않았다. 아래 실행 프롬프트는 다음 명시적 요청을 위한 문구다.

## 1. 실제 병합과 현재 상태

| 확인 항목 | 실제 증거 / 의미 |
|---|---|
| 저장소 | `limbit95/limbit95.github.io` |
| integration / 계획 기준 SHA | `feature/game-platform-vnext-integration` / `41c5b167e19a55095ea57732527a6947b48e7efe` |
| PR #419 | CLOSED / merged=true / base integration |
| 정식 결과 사용자 승인 대상 head | `bc4e9f6559cd12bc215d409105ccc2e921d99b46` |
| 승인·완료 기록을 포함한 최종 head | `f3f8ca96b1063efe1d46bc381efa3cafd762eddc` |
| merge commit | `41c5b167e19a55095ea57732527a6947b48e7efe` |
| merge parents | 기존 integration `90f14ceb3e609267aa559980994a07eacb0160f3` + 최종 head `f3f8ca96b1063efe1d46bc381efa3cafd762eddc` |
| merge tree = 최종 head tree | `7109d1c27c6b26aafcf72cc68120d49028481cf9` — 승인 본문과 완료 기록이 동일하게 반영됨 |
| 실제 병합 시각 | `2026-10-13T00:36:12Z` = 2026-10-13 09:36:12 KST |
| 실제 integration ref | merge commit과 일치 |
| main | `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09` 유지; 별도 게이트 |
| 최종 head의 등록 CI | governance completed/success 확인. 새 시험을 이번 계획에서 실행한 것이 아님 |
| STEP7A1 복원 상태 | COMPLETED / DESIGN_RESULT_APPROVED / FORMAL_RESULT_APPROVED / INTEGRATION_MERGED |
| STEP6 | COMPLETED / DESIGN_RESULT_APPROVED / TARGET_FROZEN / INTEGRATION_MERGED 유지 |
| STEP7A2 | 저장소 기록 NOT_STARTED; 계획 준비는 본문 반영 착수/완료가 아님 |
| 행동 / 운영·실행 | NOT_RUN / UNKNOWN. 구현·실행·오픈 의무 유지 |

[PR419](https://github.com/limbit95/limbit95.github.io/pull/419)의 실제 Git 증거를 기준으로 복원한다. integration에 들어간 CURRENT/README/CP0092의 OPEN·INTEGRATION_NOT_MERGED는 병합 전 기록이다. 이번에는 이 문구를 바꾸는 별도 사후 기록 branch/PR/checkpoint를 만들지 않았다. 이후 허용된 STEP7A2 작업의 현재 기록에서 실제 병합을 복원하면 된다. CP0091의 REVIEW_PENDING 및 STEP6/5C 산출물의 PROPOSED/검토대기는 당시 지위이며 사용자 승인·동결·실제 Git과 함께 읽는다.

## 2. STEP7A2 목적과 범위

쉬운 말로, **기존 보드게임 규칙에서 계속 지켜야 할 보드 경험의 의무를 실제 하위 규칙 문서에 옮기고, 이미 마련한 공통·모델 계약으로 연결하는 단계**다. 새 보드게임 개발자가 무엇을 조사하고 어떻게 웹으로 해석하며 어느 모델/검증 의무를 참조해야 하는지 찾을 수 있어야 한다.

실행 계획1.5 STEP7A2, 승인 STEP6 Target §2/§4/§6.3 및 Slice D2를 적용한다. 승인된 경로는 `docs/game-platform-board-rules.md`, 필수 책임 절은 BO1~4다. 새 아키텍처·수명·인가·모델·계약 버전을 다시 선택하는 단계가 아니다.

| 책임 / 대상 | 실제 반영할 내용 | 참조 / 경계 |
|---|---|---|
| BO1 판본·출처·제품 조사 | 실제 구성물/공개된 기존 보드게임 규칙 출처, 목표 판본·혼합 방지·원본 정체성의 적용 질문 | 조사·권리 일반 의무는 CO1, 실제 규칙 해석 GAME_SPEC/VI baseline UI_DESIGN. 공개 보드 조건·가능한 확인 범위 보존 |
| BO2 실물 공간·구성물·웹 해석 | 존재하는 중앙/개인/공개·비공개 공간, 구성물 취급·정보 읽기, 웹 adaptation의 조건 | 중앙 보드/카드/DOM 의무를 모든 게임에 강제하지 않음. 공통 가독성 CO4, 전달 권한 MO3 |
| BO3 세션·권위·복구·재대결 연결 | 실제 선택 모델의 8 surface/ready/start, 온라인 안전, snapshot·복구·same-context multiplayer 재대결 의무에 도달하는 연결 | MO2~4/LI 및 실제 DB 모델의 기존 DB 계약을 참조. 모델 계약을 보드 문서가 독립 재소유하지 않음 |
| BO4 피드백·검증·네 문서 추가 질문 | 보드의 행동/원인·구성물/공간 이해, game-local motion/결과 표현, 검증·수동 검토 추가 관측 | CO2/3/4·LI·MO·CA를 참조. 기능 자동 검사와 수동 디자인 gate 분리; 게임별 연출/규칙은 네 문서 |
| 계승 대응 | STEP6 전수 입력 중 BO 목적지 조각과 보드 적용 관련 공통/모델/원 owner 참조의 실제 절 대응 | B01~12는 요약 묶음, STEP2 49개는 전수표가 아님. 전체 3,232개를 새로 재분류하지 않음 |
| 발견/템플릿 연결 | AR4 보드 인덱스, 필요한 진입/네 템플릿 보드 질문·정확한 참조 | 기존 game-local 네 문서 무이관; 네 파일명/역할·baseline/유효 override/manual gate 유지 |
| 최소 Guard 연결 | 승인 BO를 기존 vNext owner 체계 아래에서 발견·참조·scope/필수절 검증 | BO 반영과 동일 적용 단위. full nestedshared/serverroot/import/배포/test discovery/model oracle는7B |

새 BO가 실제 존재하기 전 유효했던 기존 원문/승인 artifact의 발견 경로를 끊지 않는다. 실제 BO 반영 뒤 상위 진입은 새 BO를 가리키되 고정 원문 trace와 기존 consumer의 적용 경로는 보존한다. RT 실제 본문은7A3 후속이며 현 R01~13 승인 artifact 발견 경로를 유지한다.

## 3. 재사용 입력과 필요한 새 확인

| 입력 | 재사용할 부분 | 이후 실제 반영 때 새로 확인할 부분만 |
|---|---|---|
| 계획1.5 / STEP6 Target | STEP7A2·BO1~4 경로/단일 owner·조건·scope·D2 | 기준 뒤 변경 또는 해당 BO 적용의 실제 의미 충돌 |
| STEP6 clause-destinations §3/§12 | 3,232 관리단위(K1198/L906/H562/I566),305 명시부모,16행58 명시분할, f0/명시f·원 ID/줄/강도/부정/조건/예외 | BO 관련 행/f의 실제 본문 목적지·원 부모/절/형제 문맥 및 다른 owner 참조가 성립하는지 |
| STEP5C board-rule-succession §2~4 | B01~12 논리 계승·조건/예외·DB/비DB·hostless | 요약과 원문 차이만. B08 DEV271은 이벤트순서/전달 성공만으로 복구 금지, payload최종진실금지는DEV251이라는 STEP6 정정 유지 |
| STEP1 clause-succession / clauses-platform / clauses-design / source-inventory | 고정 원문 ID·source blob·부모·강도·조건 범위 | 동일 blob/trace 재사용. BO 관련 의미·공백을 확인하는 범위만 원문 읽기 |
| STEP7A1 AR/CO/LI/MO/CA/GV | 이미 적용된 단일 책임 본문·scope·보드 원문/승인 artifact 연결 | 새 BO를 붙이는 필요한 참조/절만. 승인된 본문을 다시 설계하지 않음 |
| STEP6 request-traces / slices-and-verification | 신규 보드 요청의 공통→장르→네 문서→모델→검증, D2와 후속 실행 의무 | BO 진입 뒤 흐름 단절·모델 강제·미지원 은폐 여부 |
| STEP7A1 correspondence / impact / source-trace / validation, CP0092, 실제 PR419/Git | 승인 결과·기존 소비자 격리·실제 검증/미실행 증거 | 같은 파일의 기준 뒤 delta 및 이번 변경 영향만 |
| DECISIONS의 유효 결정 / STEP4A/B·5A/B 관련 승인 본문 | 기존 안전·수명·공통 기능/결과 보존 조건 | 실제 충돌이 있는 해당 결정/원문만. 공급자·운영 정책 재조사 금지 |
| Guard / 관련 test / 네 템플릿·AR4 | 현재 authority/정확한 링크/필수절·scope·보드 진입 조건 | BO 추가에 필요한 최소 심볼·consumer/테스트만. 전체 소스/SQL 감사 아님 |

B01~12 모두를 BO 본문으로 복제하지 않는다. B01/02의 보드 고유 조사, B03의 공간, B05/11의 추가 관측은 BO 책임을 구체화하고, B04 네 문서·B06~10 모델/안전/수명·B12 Governance는 승인된 공통/모델/원 owner에 정확히 연결한다. 실제 BO ID/f 모수·변경 행은 후속 T1에서 승인 전수표를 읽어 확정하며 이번 계획에서 새로 배정하지 않는다.

## 4. 현재 연결 사실과 예정 변경 묶음

- **관찰 사실:** STEP7A1 Guard의 `VNEXT_POLICY_DOCUMENTS`는 AR/CO/LI/MO/CA 다섯 owner를 등록한다. `validateVnextDocumentAuthority`는 이 밖의 CURRENT·신규 vNext scope 문서를 경쟁 권위로 거부한다. AR4는 새 BO가 아직 없음을 명시하고 기존 development/UI·승인 board artifact로 연결한다.
- **계획상 필요한 연결:** 후속 BO 반영 시 해당 장르 하위 owner를 승인 경계 안에서 인정하고 BO1~4의 실체 본문·상위/공통/모델 참조·적용 scope와 발견을 검증하도록 최소 정합화해야 한다. 문서만 먼저 권위화하고 필요한 검사를7B로 미루지 않는다.
- **범위 제한:** 정확한 코드 행/테스트 목록은 T1에서 현재 source의 해당 심볼을 읽고 좁힌다. 이번 관찰은 새 Guard 정책을 구현·동결한 결과가 아니다. 경쟁 CURRENT 전체를 허용하거나 기존 online DB 검사를 제거하는 방식은 금지한다.

| 예정 경로 묶음 | 허용받은 후 목적 |
|---|---|
| `docs/game-platform-board-rules.md` | BO1~4 승인 본문·정확한 ID/f 계승 및 책임 참조 |
| `docs/game-platform-architecture.md` AR4, 필요한 CO/GV/AGENTS/games README·기존 상위 안내 | 실제 BO 진입·적용 범위·원문 발견 연결. 필요한 링크/안내만 |
| `games/GAME_SPEC_TEMPLATE.md`, `DEVELOPMENT_TEMPLATE.md`, `UI_DESIGN_TEMPLATE.md`, `UI_DECISIONS_TEMPLATE.md` | 보드 추가 질문/참조만. 공통 모델/상태 중복 소유 금지 |
| `scripts/check-game-platform-governance.mjs`, `tests/game-platform-governance.test.js` | BO 권위/필수절/참조·scope 관련 최소 검사와 의미 있는 양/음성 사례 |
| rebuild artifacts / CURRENT / README / 신규 checkpoint | 실제 대응·trace·영향도·검증/미실행·REVIEW_PENDING. 원본/과거 기록 재작성 금지 |

이 목록은 예정 변경 묶음이다. 기존 원본문을 지우거나 기존 게임을 바꿔 맞추는 허용이 아니며 모든 경로를 꼭 수정하라는 뜻도 아니다. 실제 필요한 diff만 선택한다. workflow/package 변경이나 새 CI·운영 단계는 선제 추가하지 않는다.

## 5. 작업 순서와 Sol/Astra 분담

작업 모델과 문서/소프트웨어 owner는 다르다. **STEP7A2는 승인 설계의 적용 단계이므로 Sol/Codex가 정상 흐름을 이어가고 Astra는 실제 새 의미 충돌에만 참여한다.** 별도 전면 판단·사후 감사 단계는 만들지 않는다.

| 작업 / 담당 | 목적 | 입력·확인 범위 | 산출물·완료 조건 | 다음으로 넘길 항목 |
|---|---|---|---|---|
| T1 Sol/Codex — 승인 대응·전환 준비 | BO 본문/참조와 최소 진입/검사 범위를 특정 | §3 원문·관련 전수 ID/f·부모/강도/조건, 기존 BO 발견·Guard 해당 심볼, 실제 Registry | 조항→BO/다른 owner 실제 절 대응 준비, 최소 변경 묶음, scope/전환/영향 근거. 새 목적지/규칙 선택 없음 | 정상분 T3; 새 의미 충돌의 해당 행만 T2 |
| T2 Astra — 실제 충돌 때만 | 승인 Target만으로 해결되지 않는 의미 충돌 판단 | 원 ID/줄/f·예상 owner·빠진 의미·승인 원문·현재 Guard/consumer·영향 | 해당 경계의 좁은 판단 및 상위 승인 필요 여부. 단순 링크/형식 차이는 Sol 처리. 충돌 없으면 생략 | 의미 변경이 필요한 해당 항목만 사용자 승인 게이트; 정상분 계속 |
| T3 Sol/Codex — 보드 본문·진입·최소 Guard 반영 | 실제 하위 규칙과 연결을 한 적용 단위로 반영 | T1 및 승인된 해당 delta가 있으면 그 범위 | BO1~4 실체 본문, 한 owner 참조, 실제 ID/f 대응·진입/템플릿·최소 검사/관련 tests. 강도/부정/조건/예외·기존 scope 유지 | T4 실제 검증·제출 |
| T4 Sol/Codex — 범위 검증·PR 제출 | 정확한 계승과 필요한 검사 동작 확인 | 승인 본문/source trace·base/head diff·현재 Registry 전수 | 기계검사와 의미대응 구별, 설명 없는 완화0/참조단절0, 관련 Guard 검사/테스트, 원본·기존 소비자 불변, 원격 read-back. REVIEW_PENDING | 사용자 정식 결과 최종 검토 하나 |

T1→T3→T4는 하나의 STEP7A2 반영 작업 안의 흐름이다. 매번 새 evidence/판단 문서를 만들어 조사→판단→재조사를 반복하지 않는다. 이번 계획 요청은 T1의 본격 대응/본문 작업을 시작한 것이 아니다.

Registry의 모든 platform-native 소비자를 COMPLIANT/NOT_APPLICABLE/MIGRATION_REQUIRED로 근거와 함께 분류한다. 직전7A1의 cant-stop/no-thanks 정책 격리 결과는 재사용 입력이며 새 diff의 영향도까지 자동 보장하지 않는다. MIGRATION_REQUIRED면 기존 게임을 이관·수정하지 않고 vNext scope 침범만 반환한다. 영향도 COMPLIANT는 행동 회귀 PASS가 아니다.

## 6. 필수 산출물과 종료 조건

후속 반영을 허용받았을 때의 제출물:

1. 실제 `docs/game-platform-board-rules.md` BO1~4와 한 owner 참조·조건부 모델 연결.
2. 보드 관련 **전수 원문/ID/f→실제 본문·참조** 대응: 원 출처/SHA/blob/줄·부모/강도/부정/조건/예외·적용/전환/검증. BO 단독 행뿐 아니라 관련 공통/모델/원 owner의 유효 목적지도 확인.
3. 같은 PR의 목차/상위 진입/필요 네 템플릿 연결과 최소 Guard/관련 tests.
4. source trace·기존 Registry 영향도·문서/Guard 검증/미실행·허용 diff·원격 read-back, 필요한 현재 기록/checkpoint.
5. 실제 integration base/head의 검토 PR, **REVIEW_PENDING**과 사용자 정식 결과 최종 검토 항목.

종료 조건은 원문 의무의 설명 없는 완화0, 부모/조건/예외 손실0, 참조 단절0, 단일 owner/scope·승인 경로·필수절 대응과 허용 diff 확인이다. 단순 표 채움/ID 개수를 실제 규범 본문 의미검토 완료로 쓰지 않는다. 삭제가 필요하다면 같은 의미의 실제 소유 위치를 먼저 확인해야 하며 보존 대상으로 승인된 원문은 삭제/재작성하지 않는다.

문서 hash/ID/f/표/anchor/link·원본/기존 자산 보존 등의 **기계검사**와 원문 의도/조건·모델 강제/누락 여부의 **의미 대응 검토**를 구별한다. 변경한 Guard의 의미 있는 관련 tests 및 실제 repository/base-head Governance 검사를 허용된 반영 작업에서 수행한다. 등록 CI는 실제 상태만 보고하며 미실행을 PASS로 쓰지 않는다. 전체 무관 tests나 실제 게임/DB/browser/audio/두 client/성능/운영 시험은 자동 확대하지 않는다.

정식 결과 최종 검토·승인/완료 기록·integration 병합·main·7A3 이후는 각각 별도 게이트다. 이번 계획으로 STEP7A2 COMPLETED·행동 PASS·지원 완료를 선언하지 않는다.

## 7. 보존 조건과 중단/후속 경계

- 기존 Auth/게임/API/SQL·Registry metadata/shared barrel/game-local 네 문서 무이관. 기존 development/UI/DB 적용 scope와 원문 이력 유지. 네 문서 baseline/유효 override/manual gate 유지.
- 승인 STEP6 Target/경로/책임·3,232 관리단위/305 명시부모/16행58분할 유지. STEP2 49개/B01~12를 전수 완료로 쓰지 않고 L/H/I·예시를 공통 MUST로 승격하지 않는다.
- STEP4A success/error/null/finally/cleanup/leave/effect/후속 완료·late 자원·T01~03, CP0075/D0010 A/C/P·known expiry 뒤 새 A 금지·동일 transaction late C 제한/실제 C 관측·새 P/retry fresh 인가·owner anchor·최초60초/terminal·부분 대체 유지. D0006~10 성능/비용/기록/삭제/탈퇴/backup/복원·운영 UNKNOWN 유지.
- Registry 단일 metadata·Snapshot/Reconnect 선택 모델 단일 최종 채택/복구, Shell 공통 표시/game-local 연출, BGM 기존 본체+내부 최소 수명 보완/H1 무보완 연결 보류, Invite 전 구간 identity/사이트 handler/dialog owner·H2~4 유지.
- 공식 결과/정정·producer-consumer·여섯 중복 의미·공개 merge/구현/activation/공개 사실/NEW 소비 분리·Profile recipe 유지. 미래 비room Invite/보상/정밀audio/Profile을 전체 blocker로 승격하지 않는다.
- B01~12/R01~13, DB/비DB 동등 안전11 및 DB 적용 scope 유지. 7B 모델 oracle/discovery 준비 전 신규 vNext online 미지원 경계를 보드 문서/Guard가 풀지 않는다.
- 초기 hostless/재대결 host 불성립/정책 미정의 조건을 구분한다. 초기 hostless는 재대결 면제가 아니다. multiplayer same-context/ready/host/start·복구 의무를 no-op/local/N/A로 우회하지 않는다. host 불성립 multiplayer의 상위 예외는 별도 미승인 선택이다.
- 모든 게임에 Room/host/DOM/winner/score/XP 강제 금지. 장르명으로 transport/renderer/tick/physics/prediction 확정 금지. Adapter 안에 새 권한/순서/수명/token/audio 엔진 숨김 금지.
- BO 새 본문의 실제 목적지 불성립·조건/원강도 손실·경쟁 owner 또는 승인 상위 의미 충돌은 해당 ID/줄/f·예상 owner·빠진 의미·현재 consumer 영향만 blocker로 반환한다. Sol이 새 Target로 메우지 않는다.
- 후속 runtime/모델/Core/Adapter 구현, H1~3 본체 보완과 행동/DB/browser/audio/두 client·성능/운영 증거는 후속 의무다. 미실행 때문에 보드 규칙 적용 전체를 보류하지 않고 실행 미검증 상태는 그대로 남긴다.
- RT 실제 본문7A3, 전체 탐지/모듈 안내/oracle7B, Core7C/모델·Adapter7D·Probe/오픈은 이번 범위 밖이다. 전수 source/SQL 감사·공급자/요금/운영 재판단·외부 재조사·별도 사후 감사·구매/문의/job/dump/복원 없음.

## 8. 고정 source trace와 현재 확인 한계

아래는 계획 기준 integration tree에서 확인된 고정 blob이다. 동일 승인 trace/bytes와 이번 실제 merge tree 일치를 재사용했으며 모든 원문을 새로 전수 분석했다는 표시가 아니다. 이번에 실행 계획7A2, STEP6 Target/전수 계승 방식/D2, STEP5C B01~12 관련 본문 및 현재 AR4/Guard authority 심볼을 읽었다. 실제 BO 전수 ID/f 대응 작업·실제 Guard 수정·테스트 실행은 하지 않았다.

| 입력 파일 / 고정 commit 링크 | blob |
|---|---|
| [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/AGENTS.md) | `3726d2253918896fe9b7a9f21e78af97f64f4983` |
| [game_platform_vnext_final_execution_plan.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/game_platform_vnext_final_execution_plan.md) | `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` |
| [docs/game-platform-rebuild/README.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/README.md) | `043ff35e4fbdf0cb87e42f4db81f0f8f33965402` |
| [docs/game-platform-rebuild/CURRENT.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/CURRENT.md) | `feeaba88af81d8bac75ebfce1c24042631ca8e82` |
| [docs/game-platform-rebuild/checkpoints/CP-0092-step-7a1-result-approved.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/checkpoints/CP-0092-step-7a1-result-approved.md) | `abc283a016cd5290d73cb899312ec5c1eca5e62e` |
| [docs/game-platform-rebuild/artifacts/step-6-target-architecture.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/artifacts/step-6-target-architecture.md) | `4c12e5a5ce88aa7ea71a83c7180ad34aec1c1a12` |
| [docs/game-platform-rebuild/artifacts/step-6-clause-destinations.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/artifacts/step-6-clause-destinations.md) | `b53d557d41b8cd09827ae98ebe68a376b4040e01` |
| [docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md) | `000a87c4dbd249d8266c583196d3b43d31e3f83c` |
| [docs/game-platform-rebuild/artifacts/step-6-request-traces.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/artifacts/step-6-request-traces.md) | `1f0c644f7764ce5c7b84aacbf259ffaad0768aa6` |
| [docs/game-platform-rebuild/artifacts/step-5c-board-rule-succession.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/artifacts/step-5c-board-rule-succession.md) | `a788db771b8cc26d4d7896a346b00bac12cd085b` |
| [docs/game-platform-architecture.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-architecture.md) | `84751f9330327716f8d1760261d08d5b7220ecd3` |
| [scripts/check-game-platform-governance.mjs](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/scripts/check-game-platform-governance.mjs) | `10ad5d5fee00941f6937485f0a2192554da1dd00` |
| [tests/game-platform-governance.test.js](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/tests/game-platform-governance.test.js) | `482e0b326313bf27149b601bc4f1441099b48f0f` |

현재 source 소비 지점: `VNEXT_POLICY_DOCUMENTS`, `validateVnextDocumentAuthority`, `referencesPolicyDocument`, `validateRepositoryState`, `validatePullRequestChanges`, AR4 보드 발견 경로. 후속 반영에서 관련 줄/심볼·허용 diff를 기록한다. BO 파일은 기준 tree에 없으며 승인 경로일 뿐 실제 생성 경로가 아니다.

## 9. 다음 첫 작업과 복사 가능한 전달 프롬프트

**다음 담당: Sol/Codex. 다음 첫 작업: STEP7A2 승인 계승 대응·최소 전환 준비(T1).** 다음 반영 요청을 하면 새 의미 충돌이 없는 정상분은 T3→T4까지 같은 작업으로 이어간다. Astra 전면 판단부터 다시 시작하지 않는다. 아래 문구를 실제로 전달할 때에만 반영/관련 검증/PR 제출 허용을 부여한다. 이 파일 안에 문구가 있다는 사실 자체는 허용이 아니다.

```text
Game Platform vNext STEP7A2 — 보드게임 하위 규칙 계승을 진행해줘.
담당 Sol/Codex. 승인된 STEP5C/STEP6의 경계·Target를 다시 판단하지 마.

game-platform-vnext-step7a2-plan-and-handoff.md 실제 원본 전체와
승인 STEP6 Target/전수 ID/f·trace, STEP5C 보드 계승 관련 본문을 실제 읽어줘.
저장소 limbit95/limbit95.github.io,
integration feature/game-platform-vnext-integration,
계획 기준 SHA 41c5b167e19a55095ea57732527a6947b48e7efe.

이번 요청으로 승인 범위의 STEP7A2 보드 규칙 문서 작성·진입/템플릿 연결,
필요한 최소 Guard/관련 테스트 수정·문서/Guard 범위 검증 실행과
integration base 검토 PR 제출을 명시적으로 허용한다.
gameplay/runtime/모델/backend/API/SQL 구현 및 실제 게임·DB/browser/audio/
두 client/성능/운영 시험은 포함하지 않는다.

AGENTS→계획1.5→rebuild README→CURRENT→CP0092→실제 PR419/Git 순서로
복원하고 최신 integration과 기준 SHA를 대조해 새 변경·의미 충돌만 분리해줘.
PR419 승인 대상 head bc4e9f6559cd12bc215d409105ccc2e921d99b46,
최종 기록 head f3f8ca96b1063efe1d46bc381efa3cafd762eddc,
merge 41c5b167e19a55095ea57732527a6947b48e7efe,
merge/final tree 7109d1c27c6b26aafcf72cc68120d49028481cf9를 재사용해줘.
STEP7A1 COMPLETED/FORMAL_RESULT_APPROVED/INTEGRATION_MERGED,
STEP6 COMPLETED/DESIGN_RESULT_APPROVED/TARGET_FROZEN/INTEGRATION_MERGED 유지.
CP0092/CURRENT의 OPEN·미병합은 실제 Git과 함께 병합 전 이력으로 읽어줘.

유효 미완료 STEP7A2 branch/PR이 있으면 이어가고 없으면 최신 승인 integration에서
같은 game-platform-vnext 계보의 별도 phase7a2 branch를 만들어줘.
integration/main 직접 commit 금지. T1 승인 대응·최소 전환 준비를 먼저 하고
새 의미 충돌이 없으면 별도 Astra 재판단/사후 감사 없이 T3→T4로 이어가줘.
새 충돌이면 원문 ID/줄/f·예상 owner·빠진 의미·승인 원문·현재 Guard/consumer·영향만
Astra/사용자에게 반환해줘. Sol이 새 Target/상위 완화/hostless 재대결 예외를 만들지 마.

승인 STEP6 Target §2/§4/§6.3 및 D2대로 docs/game-platform-board-rules.md의
BO1~4 실제 본문을 작성하고 기존 보드 의무의 원 범위/강도/조건/예외를 보존해줘.
B01~12는 논리 묶음이며 전수표를 대신하지 않는다. STEP6 전체3232관리단위
(K1198/L906/H562/I566)/305부모/16행58명시분할 중 이번 관련 ID/f를 실제 새 본문/
공통·모델·원 owner 참조로 대응해줘. 원 ID/줄/부모/부정/강도/조건/예외·source/blob,
f0 전체 의미 참조와 명시f 범위를 보존하고 원문 목적지를 자동 재분류하지 마.
L/H/I·예시/49조항을 공통 MUST/전수 계승 완료로 승격하지 마.
STEP6 B08 정정(DEV271 이벤트순서/전달 성공만으로 복구 금지, DEV251 payload최종진실 금지)을 유지해줘.

공통 조사/네 문서/manual gate는 CO, 전체 수명 LI, 세션/안전/복구는 MO와 실제
DB 모델의 기존 DB 계약, 기능/결과/공개는 CA, 전파는 GV가 한 owner로 소유한다.
BO는 보드 고유 조사/정보공간/구성물/웹 adaptation과 추가 관측·적용 질문을 소유하고
같은 의무를 독립 본문으로 복제하지 마. AR4의 실제 BO 발견 및 필요한 진입/네 템플릿과
BO 권위/필수절/실체본문/참조/scope 최소 Guard·관련 테스트를 같은 적용 단위로 정합화해줘.
기존 원문/consumer scope와 승인 artifact trace는 유지하고 RT7A3 발견도 끊지 마.
full nestedshared/serverroot/import/배포제외/test발견/model oracle/exports안내는7B에 남겨줘.
7B 준비 전 신규 vNext online 미지원과 기존 online DB 검사를 삭제/면제하지 마.

계획 §7 보존 조건 전체를 지켜줘. 기존 Auth/게임/API/SQL/Registry metadata/shared barrel/
game-local 네 문서 무이관; baseline/유효override/manual gate;
STEP4A 전체 완료/T01~03; CP0075/D0010 current A/C/P·knownexpiry뒤새A금지·
동일transaction lateC제한/실제C·freshP/retry·owneranchor·최초60초/terminal·부분대체;
D0006~10 UNKNOWN; Registry 단일metadata/모델단일채택·복구/Shell-local/BGM H1/Invite H2~4;
공식결과/정정/producer-consumer/여섯중복/공개분리/Profile recipe;
B01~12/R01~13/안전11/DB범위/초기hostless·재대결host불성립·미정 조건을 유지해줘.
Room/host/DOM/winner/score/XP를 전게임에 강제하지 말고 multiplayer재대결을
no-op/local/N/A로 없애지 마. Adapter에 새 권한/순서/수명/token/audio엔진을 숨기지 마.
미래미선택을 전체 blocker로 올리거나 장르명으로 transport/renderer/tick/physics/prediction을 정하지 마.

원본/승인 STEP1~6 artifacts/계획/DECISIONS/과거checkpoint를 보존해줘.
실제 correspondence/source trace·현재Registry 전수 영향도·문서/Guard 검증·미실행 및
필요현재기록만 작성해줘. 모든 platform-native게임을 COMPLIANT/NOT_APPLICABLE/
MIGRATION_REQUIRED로 근거와 함께 분류하고 충돌을 기존게임이관으로 닫지 마.
기계검사(hash/ID/f/부모/조건/표/링크/한owner/scope/허용diff)와 의미대응검토를 구별하고
변경 Guard의 의미 있는 관련 tests, 실제 repository/base-head Governance 검사,
원격 read-back을 수행해줘. 실제 CI 상태만 보고하고 미등록/미실행을 PASS로 쓰지 마.
설명 없는 의무 완화0·참조단절0을 확인하되 단순 ID개수로 전수의미검토완료를 선언하지 마.
행동 NOT_RUN·UNKNOWN·구현/실행/오픈 후속 의무를 유지해줘.
전체 source/SQL 감사·외부재조사·공급자/운영재결정·별도사후감사를 추가하지 마.

최종 PR의 실제 base/head·변경파일·원문/게임보존·문서/Guard검증·기존게임영향·
원격보존·미실행/후속의무를 보고하고 STEP7A2 REVIEW_PENDING으로 제출한 뒤 멈춰줘.
사용자가 검토할 문서와 핵심 검토항목을 구체적으로 보여주고 다음 첫 작업은
사용자의 정식 결과 최종 검토 하나로 남겨줘.
완료/최종승인·병합·main·7A3이후·runtime/게임/backend/API/SQL구현·실제행동시험·
운영변경·구매/문의/job/dump/복원은 진행하지 마.
```

이번 계획 준비는 여기서 정지한다. 저장소 파일·branch/PR/checkpoint를 추가하지 않았고, 실제 BO 작성·Guard 변경·새 시험·구현·main은 진행하지 않았다.
