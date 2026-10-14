# STEP7C F1/F2 최소 보완 제출

- 담당 Sol/Codex, 2026-10-14 사용자 17:54:58 KST 요청.
- **REVIEW_PENDING / FORMAL_RESULT_REVIEW_PENDING**. 원 최종 검토 head e72bffd135b8c943dc8d337bfbf17cc3c57833a4 / tree7395753f18164ab37b77977c1ac222280adb4ae5. base integration e57e1fe8f34aa557259bf288f30c59e226db8f6c. 착수 시 실제 PR423 OPEN/merged=false·head/base 일치, integration 기준 뒤 변경0.
- game-platform-vnext-step7c-final-review-2026-10-14.md 현재 저장본154행을 먼저 전체 읽었다. §4 F1/F2만 보완한다. 기존 branch feature/game-platform-vnext-phase7c-core와 PR423을 사용하며 새 branch/PR 없음. 새 정식 remote head/tree/CI는 해당 PR/Git·전달 인수인계에 고정한다.

## 1. F1 — 완료한 소유 항목 제거, 진행 중 정리·실패 증거 유지

executionScope owner의 자원 목록은 활성/정리 중 lease만 보관한다. release가 성공/실패로 끝나면 부모 목록에서 제거하고 캡처 resource/release callback 참조도 비운다. 반환 lease는 memoized promise를 유지하여 한 번만 해제하고 동일 결과를 관측한다. 부모는 실패 reason만 별도 보존하고 반복 종료에서도 이를 보고한다. 오류 자체가 보유하는 진단 정보는 성공 객체 보유와 구분한다.

capture는 child의 root lease를 즉시 등록한다. task.dispose는 child 반영권을 즉시 무효화하고 같은 lease를 release한다. child 정리가 끝나면 tasks 및 root lease 목록에서 분리된다. advance도 같은 경로를 쓰므로 종료한 child를 root 종료까지 쌓지 않는다. 아직 진행 중인 child/lease는 부모가 계속 기다린다. cleanup 실패를 목록 삭제와 함께 숨기지 않는다.

Bindings는 initializer에 노출된 scope.dispose와 run.dispose를 같은 종료 경계에 연결한다. 정상 종료/부분 초기화 실패/등록 교체 모두 cleanup settlement 뒤 binding.scopes에서 분리하며 pending scope는 등록 종료가 계속 기다린다. 실패한 scope 객체는 보유하지 않고 오류 근거만 보존한다. persistent 등록 수명은 각 실행과 분리하며 old registration disposer의 동일 binding 확인은 유지한다.

기존 LI2·STEP4A §6.2 L54~59·STEP5A Core/등록 owner 및 I1의 구현 보완이다. LEGACY-DEV-272/f0(L538,C041)은 원 구독/listener 종료 의미로 보존한다. 새 legacy ID/f·메모리 사용 상한 규칙을 만들지 않는다.

## 2. F2 — child 역순 순차 정리

advance는 먼저 이전 child 전부를 무효화하고 생성 역순으로 각 dispose를 기다린다. 한 실패가 이후 독립 child 정리를 막지 않으며 AggregateError로 보고한다. 각 child 내부 자원은 등록 역순이다. root.dispose가 advance와 겹쳐도 같은 lease/disposal을 기다리며 해제를 중복 실행하지 않는다.

STEP4A §6.2 L56의 의존 순서·실패 기록과 실제 games README 안내를 일치시켰다. 서로 다른 child에서 임의로 뒤늦게 획득한 자원의 의존관계까지 자동 정렬하지 않는다. 실제 의존은 명시된 owner/등록 순서·자기 release callback으로 표현한다. 새 일반 의존성 엔진이나 모델 의미 없음.

## 3. 검증과 한계

- Core 기존25+추가8 = **33/33 PASS**, 실패0/skip0. 전체 configured 계약 **379/379 PASS**, 기존346+Core33. 기존 제출25/371 증거는 CP0099/validation 초기 절에 당시 이력으로 보존한다.
- 새6개 F1 case: 장기 등록의 run/scope 종료·부분 초기화 실패, task.dispose/advance의 종료 child/root lease, 개별 release 완료 목록 제거, pending lease 대기·실패 근거, 이미 실패한 task의 root 오류 보존, 노출 scope 종료와 등록 교체의 pending 대기/old disposer.
- F1 목록 관측은 실제 Core 소스를 격리 VM에서 읽고 import/export 문법만 제거해 collection을 관측한다. production 로직을 교체하거나 public 진단 API를 추가하지 않는다. 결정적 보유 경로 검사이며 GC timing/메모리 용량/성능·운영 측정 아님.
- 새2개 F2 case: 두 child 중 나중 child의 deferred cleanup 종료 뒤 앞 child 정리·전부 선무효화 및 동시 root dispose, 나중 child 실패 뒤 앞 독립 정리·반복 해제 없음.
- 문서 실제 사용 예 및 전체 완료/T01~03/roomless·await/반영 직전/재진입·부분 실패·late resource·공유 자원·미지원/Registry 원 참조의 기존 tests는 계속 실행한다.
- 관련 syntax/기존 repository·base-head Governance/boundary·site→shared link/보호 diff·새 remote CI는 실제 수행 결과를 validation 추가 절·PR/인수인계에 보고한다. CI/NOT_TRIGGERED를 로컬 unit으로 대신하지 않는다.

## 4. 보존·후속·다음

승인 Target/I1 및 [STEP7B 계획 §7 전체](game-platform-vnext-step7b-plan-and-handoff.md#7-반드시-유지할-조건), 기존 consumer/API/metadata/barrel/Auth/게임/SQL/네 문서·원본/과거 CP/계획/DECISIONS·ID/줄/f/단일owner 및 후속 의무를 유지한다. 기존 영향도/보존 증거를 재사용하며 전수 source/SQL 감사·외부/운영 재조사·별도 사후 감사 없음.

빈 models·미구현 미지원·vNext runtime/online 차단·기존 online DB 요구·server 제외 미확인 차단, H1~4/단일채택·복구/안전11/current A/C/P/known expiry/late C 제한/fresh A/P/retry/anchor/최초60초/terminal·D0006~10·hostless·미승인 재대결 예외 금지·전체 승인 의미 보존. 실제 모델/backend/Adapter/Invite/BGM/게임 구현 없음.

Core unit/fixture/문서/Guard/CI 성공은 실제 모델/게임 지원·행동 PASS가 아니다. 실제 게임/DB/browser/audio/두 client/성능/운영 **NOT_RUN**, 운영 **UNKNOWN**. 최종 승인/완료 기록·병합·main·STEP7D 이후·실제 구현/행동 시험 없음. 다음 첫 작업은 **Astra의 고정 remote 보완본 최종 재검토**다.
