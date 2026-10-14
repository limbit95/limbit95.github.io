# STEP7B — 검증·미실행·사용자 최종 검토

- 지위: **APPROVED_TARGET_APPLIED / FORMAL_RESULT_REVIEW_PENDING**, STEP7B **REVIEW_PENDING**. 2026-10-13 14:59:28 KST 사용자 요청의 승인 범위만 수행했다. 정식 결과 최종 검토·완료 기록·병합·main·7C 이후는 별도다.
- 기준 integration f65537f0226457857b2084fd0a2c2d21d02c0804 / tree31b9b8f13a66c81f60d09f39675ac61e26673674. PR421 최종 승인 기록·merge parents/tree/ref 보존 확인, 기준 뒤 새 변경0. STEP7A3 완료/정식 승인/병합·STEP6 승인/동결·7A1/7A2 완료/병합 유지.
- branch chore/game-platform-vnext-phase7b-discovery-module-guide / PR base feature/game-platform-vnext-integration. actual head/tree/PR/CI와 원격 read-back은 최종 PR/Git에 보고한다. integration/main 직접 commit 없음.
- [계획 원본](game-platform-vnext-step7b-plan-and-handoff.md)·승인 Target/D4·STEP5A~5C/7A1~3의 의미/조건/미확인과 전체 후속 의무를 유지한다. 새 Target/상위 완화/hostless 재대결 예외·별도 사후 감사 없음.

## 1. 실제 검증과 정확한 범위

| 검사 | 실제 결과 | 한계 |
|---|---|---|
| 계획 원본 Library 전체·bytes/hash/identity | 249/249행, exact32,318bytes·SHA25601cc8a20685b25ec19c1b6697a5fb7a1884b544afeb939ff2ba144b015a84c77 | 원본 이력/계획 지위 유지 |
| 관련 ID/f·원문/source·부모/강도/조건/분할/owner anchor | 85ID/111f의 원 approved 목적지·정규화 source bytes 대응. f0 전체 원문 문맥과 규범 명시f 구별 | 전수 새 규범 본문/전체 의미 검토 완료 선언 아님 |
| 관련 Guard/helper unit | **93/93 PASS**. 기존66+이번27 의미 있는 관련 사례 | fixture 구조/거부 동작이며 실제 모델/게임 지원 인증 아님 |
| npm run test:game-platform | **336/336 PASS**, skip0. 위93개 포함 | configured Node 계약/unit 및 정적 SQL source assertion. 실제 DB/두 client 게임 시험 아님 |
| syntax | 변경 Guard/helper와 새 test node --check PASS | local Node v24.19.0. 등록 CI Node22 결과는 별도 |
| 실제 repository Governance | PASS | 기존 consumer·문서/scope/Registry와 새 모델 발견 연결 |
| 실제 browser/server/static 경계 helper | PASS | tracked browser bytes/asset outputs. server root는 없음; 제외 미확인 차단 유지. arbitrary eval/완전한 calculated URL 인증 아님 |
| 기존 site→shared module 링크 | PASS, 78 modules. 기존 games page stub 명시 | 실제 browser 실행이 아니라 기존 link checker 범위 |
| actual base/head Governance·diff / 문서 링크·표·상태·한owner/허용diff / 원격 read-back | 실제 SHA/bytes 증거를 최종 PR에 보고 | 로컬 commit/원격 head 구별. 실제 원격 조회 없이 완료로 쓰지 않음 |
| 기존 자산/원본 보호 | 허용18경로 밖 변경0·삭제0 및 원격 complete tree/read-back 확인 | 기존 게임/Auth/API/SQL/barrel/metadata/네 문서·승인 원본/artifacts/계획/DECISIONS/과거 CP 무이관 |
| 등록 CI | 제출 뒤 실제 run/check 상태를 최종 PR에 보고 | 미등록/미실행을 PASS로 쓰지 않음 |

초기 로컬 configured unit 실행은 scoped checkout에 빠진 기존 test dependency bytes 때문에 실패했다. 해당 고정 helper/SQL 입력만 추가 materialize했고 source/SQL을 수정·재조사하거나 DB를 실행하지 않았다. dependency 확보 뒤 위336개가 통과했다. 이후 변경·미확인에 필요한 검사만 수행한다.

## 2. 허용 diff·보존·미실행

수정8/신규10/삭제0의 제출18경로를 실제 diff 검사로 확인한다: 기존 Governance/site-static workflow의 최소 필터/기존 job 연결, GV/games README, Guard/tests, 새 경계 helper·관련 unit·빈 모델 oracle 설정, 계획 원본 및 대응md/json·trace·영향도·검증 artifact, CURRENT/README/CP0097.

기존 workflow의 main push 검증·실제 배포/운영 설정·site build source/산출물은 변경하지 않는다. 실제 tracked server/root/runtime 파일·빈 stub·모델/backend/API/SQL/Core/게임 구현0. LI/MO/CA/BO/RT 규범 본체/상위 Target 재작성 없음. 검사 내부 descriptor는 runtime API/schema/file/class 동결이 아니다.

실제 게임/DB/browser/audio/두 client/성능/운영 **NOT_RUN**, 실행/운영 **UNKNOWN**, 구현/실행/오픈 후속 의무 유지. 안전11/current A/C/P·actual C/known expiry/late C 제한/fresh A/P/retry/anchor/최초60초/terminal·부분 대체, STEP4A 전체 완료/T01~03, D0006~10·H1~4·결과정정/여섯중복/공개/Profile·B/R/hostless 조건을 유지한다. server 공개 제외와 실제 nonDB 모델/oracle/취소·시간공백은 후속 미확인/미지원이며 검사/문서 성공으로 닫지 않는다.

## 3. 사용자가 검토할 문서와 핵심 항목

| 검토 문서 | 확인할 핵심 |
|---|---|
| [GV STEP7B](../../game-platform-governance.md#step7b-탐지검증-연결과-제한) | nested/server·기존 consumer 격리·같은 CI 연결, 빈 모델 설정/미지원 거부와 oracle 구조 검사의 한계, 공개 제외 증명 전 server 존재 차단 |
| [공통 모듈 안내](../../../games/README.md#step7b-공통-모듈-연결구현-상태-안내) | 실제 exports·모델/consumer·정리/완료 owner, 단일 Registry/채택·복구, Shell/local, Invite H2~4/BGM H1 무보완 판정 보류 |
| [ID/f 대응](step-7b-clause-correspondence.md) / [정확한 metadata](step-7b-clause-correspondence.json) | 기존 owner/원 강도/조건/분할 보존. f0 원문 문맥과 규범 명시f 구별, 새 규범 전수 완료로 확대하지 않음 |
| [게임 영향도](step-7b-game-impact.md) / [trace](step-7b-source-trace.md) | 기존 게임/SQL/Auth/Registry/barrel/네 문서와 원본 불변. COMPLIANT는 정책/검사 호환이며 실제 행동 PASS 아님 |
| 이 검증 §1~2 및 최종 PR CI/read-back | 실제 수행한 문서/Guard/unit과 NOT_RUN·UNKNOWN/후속 의무 구분 |

모든 ID/코드를 수작업 대조할 필요는 없다. 책임/적용 범위·미지원 차단·실제 검증/미실행 구분과 기존 무이관이 승인 목적과 맞는지 최종 검토한다.

## 4. 다음 첫 작업 하나와 정지

사용자의 STEP7B 정식 결과 최종 검토. 현재 **REVIEW_PENDING**이며 이번 제출로 완료/최종 승인·병합·main·7C 이후를 선언/진행하지 않는다. 최종 승인 시 실제 PR head를 특정하여 승인·완료 기록만 보존하는 별도 요청을 사용하고 integration 병합은 별도 게이트로 남긴다.

## 5. 2026-10-14 최종 검토 F1~F4 보완 제출

§1의 93/336개 및 최초18경로는 원 제출 head567d848572b29f933dcccf2cc31b3fc05271c236의 검증 이력이다. [보완 결과](step-7b-review-fixes.md)는 그 이후 변경을 구분한다. 관련 Guard/helper **101/101**, configured 계약 **344/344**, skip0, repository Guard·boundary helper·변경 checker syntax를 확인했다. 신규8사례는 CI 대상 누락·inline import/CSS @import·origin root 위 이동·명시 revision 전체와 정상 허용 사례를 검증한다.

원격 보완 head/tree·기존 CI의 실제 run 결과는 PR422에서 제출 뒤 확인하며 로컬 성공으로 CI 성공을 추정하지 않는다. **REVIEW_PENDING / FORMAL_RESULT_REVIEW_PENDING**, 실제 행동 **NOT_RUN**·실행/운영 **UNKNOWN**, 계획 §7 전체와 후속 의무를 유지한다. 승인/완료 기록·병합·main·7C 이후는 수행하지 않는다.

## 6. 2026-10-14 F2-R1 추가 보완 검증

§5의101/344개는 직전 보완 입력69e6b7a8e7b79b6c478b43a031f901244601d0a3의 이력이다. [F2-R1 보완](step-7b-review-fixes.md#f2-r1-추가-보완--2026-10-14)은 무공백/주석 경유 quoted CSS @import와 HTML style에서 같은 참조만 추가 검사한다. 수정 전 신규 차단 test 실패로 누락을 재현했으며 수정 후 관련 **103/103**, configured 전체 **346/346**, skip0. 두 신규 test는12개 차단 조합 및 정상 자산/주석/일반 문자열 허용을 검사한다. 변경 helper/test syntax·repository Guard·boundary helper PASS. base/head diff Guard와 새 원격 head/tree/기존 CI 실제 결과는 PR422에 별도 보고하며 로컬 성공을 CI로 대체하지 않는다.

F1/F3/F4·승인 Target/D4·계획 §7 전체와 기존 증거/원본/consumer는 유지한다. 실제 모델·게임 지원 또는 행동 PASS가 아니다. **REVIEW_PENDING / FORMAL_RESULT_REVIEW_PENDING**, 행동 **NOT_RUN**, 실행/운영 **UNKNOWN**·후속 의무 유지. 승인/완료 기록·병합·main·7C 이후·실제 구현/행동 시험·전수/운영 재조사·별도 사후 감사 없음.
