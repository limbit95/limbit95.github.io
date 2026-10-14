# STEP7C — 실제 검증·기존 consumer 영향도·미실행

- **REVIEW_PENDING / FORMAL_RESULT_REVIEW_PENDING**, 승인 Target/I1 범위의 검토 제출이다. 기준 integration e57e1fe8f34aa557259bf288f30c59e226db8f6c.
- branch feature/game-platform-vnext-phase7c-core / PR base integration. 실제 remote head/tree/PR/CI는 제출 뒤 해당 PR/Git 조회로 고정한다. 로컬 commit과 remote identity를 구분한다.
- [trace/전체 보존](step-7c-core-trace.md), [계획 원본](game-platform-vnext-step7c-plan-and-handoff.md), [실제 API/실행 예](../../../games/README.md#step7c-최소-core--구현검토-대기).

## 1. 수행 범위

| 검증 | 실제 결과 / 한계 |
|---|---|
| 최소 Core 계약 tests | **25/25 PASS**, skip0. 모든 완료종류/T01~03·roomless/await·reentrant policy/부분 실패·반복 dispose·late resource/독립 자원·등록 교체·미지원 조합·정상 허용·현재 명시 재검증 |
| 문서 작은 예 | tests에서 실제 Node stdin 실행, shown7/acceptedOldfalse. fixture Core 예이며 실제 모델/게임 지원 아님 |
| npm run test:game-platform | **371/371 PASS**, skip0. 기존346개+Core25개. configured Node 계약/unit·정적 SQL source assertion. 실제 DB 실행 아님 |
| 변경 JS syntax / actual repository Governance | PASS. 로컬 Node v24.19.0. 기존 CI Node22의 결과는 별도 |
| site→shared module link | PASS, 기존78modules·games page stub·lazy route/focused API 경계. 실제 browser 실행 아님 |
| tracked browser/server/static helper / 실제 base→head Guard / diff --check | tracked 경계 helper PASS. 실제 base/head는 commit 후 확인하며 diff check는 아래 원본 EOF 예외를 구분한다. server 제외 미확인 차단은 유지하며 arbitrary eval/완전한 URL 인증 아님 |
| 보호·허용 diff | 10경로: 수정3/신규7/삭제0. 변경 밖 Git blob/mode 동일성과 원격 tree/read-back을 제출 시 확인해 PR에 보고. 새 전수 의미/source 감사 아님 |
| 기존 등록 CI | 새 remote head의 실제 run을 조회해 보고. 미실행/NOT_TRIGGERED를 PASS로 대체하지 않음 |

원본 계획의 exact bytes를 보존해 Git diff --check의 EOF 빈 줄 경고1개가 있다. 원본 외 작성/변경 파일의 diff --check는 PASS이며 이 공백을 제거해 원본 hash를 바꾸지 않았다. 실행 의미/코드 경고는 아니다.

위 표에서 제출 직전/원격 조회 항목은 로컬 unit 성공으로 대신하지 않는다. 재실행은 새로운 변경·실패·미확인에 필요한 경우만 수행한다. 별도 workflow/새 의존성 추가 없음.

## 2. Registry 전수 영향도 — 정책/격리 판단

| entry / platform | 분류 | 근거 |
|---|---|---|
| cant-stop / shared | COMPLIANT | 기존 import/barrel/API/metadata/네 문서/DB 계약 불변. 새 Core를 실제 consumer에 연결하지 않음. 기존 configured tests/links 재사용. 게임 행동 PASS 아님 |
| no-thanks / shared | COMPLIANT | 같은 기존consumer 보호. Core가 미선언 기존 scope에 새 모델을 강제하지 않음 |
| liar / legacy | NOT_APPLICABLE | Registry/root/게임/API/SQL/BGM 무이관, 신규 Core import 강제 없음 |
| the-game / legacy | NOT_APPLICABLE | 기존 runtime/SQL/audio owner 불변. 새 scope로 내부 BGM 보완을 완료 처리하지 않음 |
| marble / legacy | NOT_APPLICABLE | 기존 API/게임/SQL/Registry/네 문서 보호, vNext 이관 없음 |

MIGRATION_REQUIRED0은 이번 격리/정책 범위 판단이다. 기존 source/SQL 전체를 다시 감사하거나 실제 browser/두 client 시험을 수행한 결과가 아니다. 기존 baseline/유효 override/manual gate·기록 책임 유지. Registry entry 목록을 미래의 공통 고정 규칙으로 만들지 않는다.

## 3. 실제 변경 범위·남는 의무

Core2파일, flat test1, games README/CURRENT/rebuild README3 수정, 계획 원본/trace/검증/CP0099 신규4개. existing Guard/helper/workflow/model config/Registry/barrel/package/기존게임/Auth/API/SQL/네 문서·승인 규범 본체는 변경하지 않는다.

[STEP7B 계획 §7 전체](game-platform-vnext-step7b-plan-and-handoff.md#7-반드시-유지할-조건), 승인 Target/I1·빈 모델/미지원 차단·기존 online DB 요구·server 제외 미확인 차단·H1~4/단일채택·복구/안전11/current A/C/P/hostless·미승인 재대결 예외 금지 및 원본/ID/f/consumer 보존 유지.

Core tests는 구성/로컬 수명/거부·허용 연결만 검증하며 fixture resolver/policy를 실제 권한·모델 지원으로 쓰지 않는다. 실제 게임/DB/browser/audio/두 client/성능/운영 **NOT_RUN**, 실행/운영 **UNKNOWN**. 실제 모델/Core 소비자 연결/backend/H1~3/Probe/지원/운영/공개 제외 증거 등 후속 의무 유지. 최종 승인·완료 기록·병합·main·STEP7D 이후·실제 구현/행동 시험·전수 source/SQL 감사·외부/운영 재조사·별도 사후 감사 미수행.

## 4. 다음 첫 작업

Astra가 정식 remote head를 고정해 Core·tests·사용 예·이 trace/검증 및 현재 기록을 검토한다. 승인 의미를 재판단하지 않고 실제 새 문제는 원문ID/줄/f·승인 원문·현재 consumer·예상 owner·영향·최소 보완으로 보고한다. 사용자 최종 승인 전 REVIEW_PENDING을 유지한다.
