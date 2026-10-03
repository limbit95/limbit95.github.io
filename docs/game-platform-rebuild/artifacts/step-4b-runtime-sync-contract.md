# STEP 4B — 모델별 Runtime·Sync 품질 계약

- 상태: **정식 STEP4B 제출 산출물 / 사후 감사 대기 / STEP4B IN_PROGRESS**. 가이드4 반영이며 사용자 승인·현행 CURRENT rulebook 변경·Target 동결·구현 지원 완료가 아니다.
- 고정 입력: [Astra 판단 원문](https://github.com/limbit95/limbit95.github.io/blob/ddfa7a5e226fe0c5f62779a19b708ca0802899ce/docs/game-platform-rebuild/artifacts/step-4b-astra-judgment.md), commit `ddfa7a5e226fe0c5f62779a19b708ca0802899ce`, blob `bd4c5b4991921c17d74bd99ef275819e4ae046f5`.
- Work Sol은 아래 판단 본문 전체를 그대로 옮겼다. 선택·보류·사유·조건·미확인·후속 책임을 축약하거나 새로운 선택으로 바꾸지 않았다. J번호는 판단 절, B번호는 [저장소 근거](step-4b-source-trace.md), V번호는 [기존 선택 원문 검토](step-4b-research-verification.md)다.
- [전체 반영 trace](step-4b-contract-source-trace.md), [미결정·충돌·후속](step-4b-risks-and-followup.md), [정식 제출 검증](step-4b-validation.md)을 함께 읽는다. 다른 절 연결은 [모델 품질](step-4b-runtime-sync-contract.md)·[권한/사이트](step-4b-security-site-contract.md)·[실행/운영](step-4b-execution-operations-decisions.md)에서 찾는다.
- 본문의 “이번 판단/미수행/후속 STEP4B”, “정식 반영 필요”는 가이드3 작성 시점의 판단·조건으로 보존했다. 이번 완료는 **가이드4 문서 반영**뿐이다. G01~06은 미해소이며 모델/제품 지원 PASS, STEP4B 전체 완료 또는 후속 구현 허용으로 승격하지 않는다.
- 공식 원문 확인/가격은 가이드3 확인 이력의 재사용이다. 이번 새 browsing·견적·배포·runtime/DB 검증은 수행하지 않았다. 구현 전 제품/가격/버전 확인 조건을 유지한다.

## 3A — 권위·동기화·복구

### J01. 권위와 책임의 배치 — 채택

서버 권위 snapshot은 유지할 하나의 모델이다. 모든 게임을 DB transaction·Room·host·tick에 맞추지 않는다. 최소 Core는 실행 수명과 공통 오류/정리만 소유하고, 현재성·순서·복구 의미는 선택 Runtime Model, 게임 규칙 판정은 Game-local 서버 로직이 소유한다. 사이트 승인 정책은 Site Adapter가 연결하되 실제 집행은 신뢰 서버 경계에 둔다. transport 연결 성공은 권위 획득이나 상태 복구 완료가 아니다. 근거 B01~06/B11, V02/V05/V08.

| 모델/적용 범위 | authoritative owner와 확정 경계 | 동기화/복구 방향 | 채택의 제한 |
|---|---|---|---|
| 기존 DB snapshot형 온라인 | 서버 RPC 검증과 DB transaction commit | invalidation 후 승인된 현재 snapshot 재조회 | 기존 SQL/API를 다른 모델의 공통 필수 필드로 복제하지 않음 |
| 연속 상태를 다루는 보호된 온라인 | 신뢰할 수 있는 서버 simulation owner가 입력 검증·순서·확정 담당 | checkpoint와 ordered update 또는 완전 snapshot 교체 | 실행 방식 방향 채택; 공급자/배포/수치는 J10~12·G01~05 보류 |
| 장기·비동기 진행 | 지속 상태를 소유하는 서버와 durable commit | 재진입 시 현재 상태, 필요한 경우 별도 history | 상시 tick을 강제하지 않음; 확정된 진행의 영속 기준 필요 |
| 로컬 전용 경험 | 해당 실행의 로컬 상태 | 게임 정책의 local save/reset | 보호된 다중 사용자 결과의 서버 권위 증거로 사용할 수 없음 |

서버가 단순 중계하고 client가 모든 보호 상태를 결정하는 방식은 위 온라인 안전성을 만족하는 기본 선택으로 채택하지 않는다. 별도 모델이 필요하면 같은 안전성에 대한 구체적 위협 모델·동등 집행 증거를 먼저 제출한다. 서비스 이름에 authoritative가 포함되어도 플랫폼의 승인회원·private·idempotency가 자동 충족되지는 않는다.

### J02. 시간·순서·중복의 의미 — 채택, wire/API 형식은 미동결

하나의 version만으로 모든 현재성을 판정하지 않는다. 실행 owner의 생존, 사용자/권한 view, 참여·match 의미, 해당 authoritative stream의 순서를 함께 확인한다. 공유 상태에 충돌하는 명령은 하나의 직렬화/확정 경계를 가져야 하지만 서로 독립인 세션까지 전역 total order를 강제하지 않는다. 서버 재시작 후 같은 식별자를 재사용할 때는 이전 owner/update를 구별하고 차단할 경계가 필요하다. epoch는 가능한 구현이지 필수 공통 필드명으로 동결하지 않는다.

- DB 모델의 nonnegative integer version과 낮은 version 거부는 계승한다. 같은 version의 현재 승인 view 재적용은 상태 복구상 허용할 수 있지만 결과·효과의 재발행 근거는 아니다. 같은 의미/version에 상충하는 내용이면 임의 last-arrival-wins 대신 재조회·오류 또는 명시적인 projection revision 규칙으로 해소한다.
- T01 같은 room의 새 match, T02 A→B→A, T03 participant/spectator 또는 login user 변경은 version이 같아도 다른 의미일 수 있다. room-id equality나 숫자 대소만으로 안전하지 않다.
- stream sequence는 해당 owner/stream 범위에서 해석한다. gap·재정렬 window·queue 상한을 넘으면 불완전 delta를 확정 상태에 적용하지 않고 resync 또는 세션 종료 정책으로 전환한다. timestamp는 인과 순서나 commit 증거를 대신하지 않는다.
- 명령 identity는 주체·대상 의미·명령 종류/payload 충돌 정책과 연결한다. 전송 ACK, 서버 접수, 검증 통과, authoritative commit, 수신자의 적용은 각각 다른 상태다.

B06/B10~12/B15~20/B24, V03/V07. 현재 source의 version check와 disposal 관찰은 전체 동등 보장 PASS가 아니다.

### J03. initial/live 연결과 놓친 마지막 변경 — 조건부 채택

DB 모델에서는 이벤트를 최종 상태로 적용하는 대신 현재 snapshot을 재조회하는 방향을 채택한다. listener 설치·구독 준비 관찰·최초 조회·동시 invalidation 병합을 설계하되 SUBSCRIBED를 replication-ready나 atomic cut으로 간주하지 않는다. 선택 SDK에서 별도 준비 신호를 사용할 수 있는지는 G02에서 확인한다. 최초 조회 중 invalidation이 오면 후속 조회 필요를 보존하고, 정지한 실행에는 재조회 결과를 적용하지 않는다.

초기 handoff만 고쳐도 이후 마지막 이벤트 하나가 유실되고 아무 이벤트도 더 오지 않는 경우는 남는다. reconnect/visible 시 재조회에 더해, 활성 세션에서 정한 staleness 상한 안에 현재 상태를 다시 확인하는 독립적인 reconciliation 경로가 필요하다. 주기 조회·서버 cursor 검증 등 방식은 부하와 G01 목표를 보고 선택한다. 연결이 유지된다는 이유로 영구히 오래된 상태를 정상 표시하지 않는다. timeout/retry 소진은 명시적인 degraded/recovery-failed 상태로 드러내며 무한 spinner로 숨기지 않는다.

연속 stream 모델은 승인 checkpoint의 논리적 cut과 그 이후 update의 연결 증거가 필요하다. tail을 보존하지 못하면 완전 snapshot으로 새 기준을 잡는다. 이미 다른 기준에 적용된 delta를 임의 재사용하지 않는다. bounded cache/replay는 최적화 후보이며 유실 없는 전체 history를 뜻하지 않는다. DB Broadcast replay 제한이나 PUN2 cache 순서를 다른 SDK의 보장으로 일반화하지 않는다. B06/B15~18, V01~03/V07.

### J04. 재전송·복구·영속성 — 채택

명령 timeout은 실패 확정이 아니라 commit 여부 미상일 수 있다. 동일 명령의 상태 조회 또는 같은 idempotency identity 재시도로 판정하고, 새 identity로 무조건 다시 실행하지 않는다. 재시도된 명령은 mutation 중복을 막아야 한다. 동시에 **그때 반환할 데이터의 현재 접근 권한**을 별도로 확인해야 한다. 과거에 저장한 private response를 현재 탈퇴/철회된 사용자에게 그대로 돌려주는 것은 허용하지 않는다. 재실행 없이 safe ACK·현재 승인 snapshot·접근 거절 중 명시한 정책을 적용한다. B24의 저장 response 반환 경로는 이 회귀 시나리오를 요구하는 관찰 근거이며 실제 유출 재현 판정은 아니다.

| 복구 대상 | 이번 선택 | 추가 닫힘 증거 |
|---|---|---|
| client 연결 중단 | 현재 권위 상태 재획득, 권한 재확인 후 재개 | 단절 중 commit·마지막 알림 유실·동일명령 재시도 실험 |
| 이벤트 history | 현재 복구와 별개 계약; 게임상 필요할 때만 retention/cursor 정의 | 보존 만료·gap·overflow의 명시 실패/대체 경로 |
| 결정적 replay/rollback | 입력·난수·시간/버전 등 결정성 증거가 있을 때만 | 같은 기록 재실행 결과와 reconciliation 검증 |
| 서버 정상 종료 | drain·인계 또는 durable 저장 후 종료 정책 | handoff 중 단일 owner와 새 권한 경계 |
| 서버 crash | 정상 종료 hook에 의존하지 않는 내구성/복구 정책 | durable 경계, RPO/RTO, 구 owner fencing, 중복 commit 방지 |

확정 결과·장기 진행의 durability 의미와 허용 소실 범위는 G04에서 명시한다. 메모리 세션이 crash 후 종료되는 정책 자체는 가능하지만 이를 정상 완료/확정 결과로 꾸미거나 이미 durable로 약속한 상태를 잃어서는 안 된다. Nakama 문서는 메모리 match와 hot-loop I/O 회피를 설명하고 중간 내구성이 필요하면 coarse interval/중요 event 저장도 제시한다. 이로부터 자동 crash recovery를 추론하지 않는다. B03/04/B23~26, V05/06.

### J05. prediction·소비 효과와 STEP4A 수명 — 채택

prediction은 표현 지연을 줄이는 잠정 상태이며 보호된 commit을 대체하지 않는다. rollback/reconciliation은 Sound·결과·영속 기록처럼 되돌릴 수 없는 효과의 중복 발생을 허용하는 면제가 아니다. 서버 명령 dedupe와 소비자 효과 dedupe는 서로 다른 책임이다. 확정/잠정 구분과 소비 identity 경계를 모델이 제공해야 하며 Result/Sound의 상세 API는 STEP5B에서 이 판단을 입력으로 구체화한다.

STEP4A의 살아 있는 owner·현재 의미·승인 view·모델 순서 검사는 apply 직전에도 필요하다. await나 재진입 뒤 success뿐 아니라 error/null/finally/cleanup/effect에도 적용한다. 오래된 요청이 최신 승인 snapshot을 반환하는 경우 현재 소비자가 명시적으로 재검증해 채택할 수 있으므로 모든 늦은 데이터의 무조건 폐기 규칙으로 바꾸지 않는다. dispose는 먼저 무효화하고 반복 안전하며 개별 정리 실패가 나머지 정리를 막지 않아야 한다. 늦게 획득한 자원과 부분 초기화도 해제 대상이다. 공용 socket/채널은 실제 소유권에 맞게 정리하며 한 실행이 다른 실행의 자원을 닫지 않는다. 기존 callback identity와 해제 API의 정확한 대응은 구현 검증 대상이다. B10~13/B15~20/B42~44.

### J06. 현행 11개 안전성의 비DB 대응 — 의미 계승, 면제 없음

아래는 현재 DB contract를 수정한 정식 규칙이 아니라 비DB 모델의 동등성 판단이다. 신규 모델을 구현하기 전에 정식 반영과 해당 검증 경로가 필요하다. hostless 시작 조건이 있다고 재대결 host 규칙까지 자동 면제하지 않는다. B03/04/B07~09/B22.

| 현행 번호/의무 | 비DB 구현이 입증할 동등 경계 |
|---|---|
| 1 익명 진입 거부 | 신뢰 서버가 검증한 identity 없이는 보호 세션 진입 거부 |
| 2 미승인 진입 거부 | 사이트 승인 상태의 최신성 계약에 따른 서버 집행 |
| 3 승인 진입 허용 | 승인만으로 모든 세션 허용하지 않고 게임별 join 정책 적용 |
| 4 비멤버 snapshot 거부 | checkpoint/stream/projection도 현재 membership·view 범위에서 제공 |
| 5 서버 시작 조건/권한 | 서버 상태·참여 조건에 대한 원자적 start 판정 |
| 6 stale expected_version 거부 | 모델의 authoritative 기준과 불일치하는 보호 명령 거부; 숫자 필드 복제만으로 대체 금지 |
| 7 같은 action 중복 금지 | 동일 identity 재전송 mutation once 및 현재 응답 권한 |
| 8 충돌 명령 단일 commit | 공유 충돌 영역의 단일 권위 직렬화·split-owner 차단 |
| 9 reconnect snapshot 복원 | 승인 checkpoint/current-state와 이후 update의 일관된 재연결 |
| 10 같은 context 재대결 | gameplay만 초기화, 준비·시작·복원 검증; 새 match 의미로 늦은 이전 결과 차단 |
| 11 타인 private 비노출 | 서버 projection과 전달 대상 분리; private가 없어도 비노출 검증 |

Room/host 의미가 없는 모델에 가짜 Room을 추가하지 않는다. 동시에 현행 멀티플레이 재대결 의무와 충돌하는 모델은 G06에서 상위 규칙 검토·명시 승인을 거쳐야 한다. 장르 이름이나 하위 설정만으로 NOT_APPLICABLE 처리하지 않는다.

