# STEP4B — CP0068 기준 G03 단일 설계 보완·검토

고정 입력 CP0068 `f05043d8cb950eeda13a3decb10684669c04b887`, tree `ca52bcd565a2c0245c584db92a6e4eace26d05a4`. 검토 2026-10-07 KST. 시작 PR412 HEAD 일치, 추가 변경0. AGENTS → 계획1.3 → 기록 README → CURRENT → CP0068/DECISIONS → PR 순서 확인. [D0006/D0007](../DECISIONS.md)을 적용한다. 과거 제안·판단·명세는 당시 이력이며 이 보완은 정식 계약 반영이 아니다.

## 결론과 추천

**추천은 기존 Supabase Auth/기존 게임을 유지하고, vNext만 DB 권위 처리 + 단일 통제 송신 경계로 분리하는 구조다. 논리 구조는 조건부 채택 가능하지만, 전체 G03 설계 승인은 아래 S1/S2의 구체적 바인딩이 없어 아직 불가하다.** 미실행 때문이 아니라 현재 사용 수단으로 충족시키는 방법이 비어 있기 때문이다. 단순 “5초마다 확인 후 send”는 채택하지 않는다.

이번에 끝낸 것은 C/P/R의 의미, 신선도 계산, 실패/재개, 중복/owner/복원의 책임 구분이다. 기존의 모든 외부 철회를 최종 actual-egress와 무지연 직렬화해야 한다는 전제는 D0007 범위에서 폐기했다. 따라서 managed Auth 내부 writer와 외부 송신의 공동 lock/hook을 확보하는 일을 기본 선행 과제로 다시 요구하지 않는다.

반면 외부 R 이후5초를 넘기는 **최종 확인→DB commit/transport 인계 사이 정지**는 새 기준에서도 위반이다. 이를 일반 이벤트 루프·타이머만으로 방지했다고 할 수 없다. 아래 두 설계 조건을 닫지 않고 “나중에 시험하면 됨”으로 전체 설계를 승인하지 않는다. 공급자 문의나 같은 자료 수집 재개도 추천하지 않는다.

## 한 구조의 권위 경계

| 구성 | 책임과 선택 이유 | 금지/한계 |
|---|---|---|
| 기존 사이트 Auth/게임 | 기존 UID·로그인/OTP·별도 game client·RPC 유지. vNext만 검증 adapter를 이용 | 기존 게임을 이관하거나 공통 UI gate만으로 모든 API를 보호했다고 간주하지 않음 |
| vNext DB 권위 처리 | command ID/payload hash·현재 권한·match revision·owner epoch·incarnation을 검증하고 상태/중복 원장을 한 transaction으로 확정 | worker의 계산은 제안일 뿐 C 아님. 독립 simulation의 늦은 apply로 권위 상태를 변경하지 않음 |
| 서버 전용 권한 validator | JWT identity/서명/issuer/audience/exp + 대상 session + 현재 user/승인/가입/역할/permission/참가/view를 검증. 제한 predicate만 반환 | getUser/getClaims/session row 하나로 전체 판정 대체 금지. postgres connector 권한 승계 금지 |
| 단일 vNext 송신 gate | recipient/session/view generation/payload hash/revision/owner/incarnation별 최종 release. 모든 snapshot/ack/error/retry도 통과 | worker는 client socket/우회 Realtime private payload 송신 권한 없음. 앱 queue에는 철회 불가능한 영구 permit를 넣지 않음 |
| 통제된 사이트 권한 변경 | 대상 gate를 먼저 닫고 outstanding finalizer 정리를 확인한 뒤 권한 변경 commit. 새 권한으로 재검증 전 재개 금지 | 일반 직접 SQL도 동일 fence 절차 또는 사전 폐쇄된 유지보수 경로 필요. 현재 운영이 이미 그렇게 되어 있다는 주장 아님 |
| owner 교체/복원 | DB 조건부 저장과 송신 gate의 route 전환을 각각 집행. 복원은 폐쇄·새 incarnation·현재 권한/삭제 기준 검증 후 개방 | DB fencing만으로 old socket 송신 차단 증명 불가. old gate 격리 확인 없이 새 gate 자동 승격 금지 |

**C**는 DB의 권위 상태 transaction commit이다. 외부 화면/worker 캐시는 그 revision을 복제하며 새 권위 결정을 하지 않는다. commit 요청/응답 또는 SQL 문 실행 완료와 C를 같다고 하지 않는다.

**P**는 서버가 통제하는 최종 경계에서 특정 payload를 되돌릴 수 없게 transport에 인계한 사건이다. app enqueue/dequeue·snapshot 생성은 P가 아니다. 고정 transport의 소유권/취소 가능성을 확인해 정확한 호출 내부 지점을 정해야 한다. socket.write 호출 진입/반환/callback 중 임의의 하나를 P로 선언하지 않는다. SDK가 여전히 취소할 수 있는 queue는 gate 안쪽이다. 실제로 인계가 끝난 OS/TLS/네트워크의 지연 전달·재전송은 회수 대상 밖이다. 부분 인계는 payload/fragment별로 기록하며 새 나머지 인계에는 새 인가가 필요하다.

**R**은 경로별 실제 효력이다. 통제된 사이트 권한은 해당 DB 변경 commit, 외부 logout/delete는 대상 session/user에 실제 철회가 적용되는 지점, 만료는 적용되는 만료 시각이다. 앱이 통지를 받은 시각이나 운영자가 확인한 시각으로 늦추지 않는다. 모든 외부 R에 대한 새로운 C/P는 R+5초 시점부터 금지한다. 처음부터 무권한이면 C/P는 처음부터0이다. 통제된 내부 R은 기존 즉시 순서를 유지하며 5초 잔여 허용을 확대하지 않는다.

### R 경로별 처리

| 경로 | 추천 처리 | 아직 필요한 설계 바인딩/실행 증명 |
|---|---|---|
| 승인·가입·운영 역할·permission 변경/삭제 | 안정된 권한 anchor/revision에 모든 writer를 연결. gate close/fence ACK 후 commit R, 이후 현재 권한으로 재개. 변경 실패 시 자동 과거 permit 재개 금지 | S1: 함수/trigger/GRANT/일반 직접 SQL writer의 실제 연결표. row 부재·삭제도 anchor를 우회하지 않아야 함 |
| 직접 운영 SQL | 일반 운영 변경은 같은 fence 절차, 불가하면 대상 vNext를 먼저 폐쇄하고 수행. 긴급 revoke도 닫힘 확인 없이 무검증 LIVE 유지 금지 | SQL editor를 사용하는 사람의 존재만으로 우회가 해결되지 않음. 기존 경로 보호/변경 영향은 후속 바인딩 대상 |
| default/global/local/others logout·직접 Auth API | global 전체/local 현재/others 현재 제외의 실제 대상 session을 검증. 외부 R부터 신선도 예산으로 최대5초 차단 | SDK@2 scope 없음은 정적 사실; 실제 exact SDK 동작 미확인. others의 비대상 session과 새 로그인은 별도 검증 |
| console/계정 hard·soft delete | user 존재만 아니라 삭제/사용금지 상태와 session을 확인. 식별 연결 제거는 기존 삭제 정책 적용 | S1: 운영 설정의 hard/soft 경로와 predicate. JWT가 남는다는 이유로 승인하지 않음 |
| JWT/session 만료·refresh | known exp보다 먼저 닫음. 새 토큰도 같은 session/current 권한 확인. 실제 활성화된 session 만료 정책을 포함 | Free에 유료 timeout 기능을 가정하지 않음. session row 잔존은 만료 후 허용 근거 아님 |
| Auth의 그 밖의 실제 session 종료 | 비밀번호 변경/refresh 재사용 탐지 등 현재 사용 설정의 종료도 동일 대상 predicate로 판정 | 별도 앱 event 목록만으로 전체 경로를 열거했다고 하지 않음 |

의도적 superuser의 보안 장치 제거까지 보장하는 구조는 아니다. 그러나 정상 운영자의 직접 SQL을 단지 “신뢰하는 사람”이라는 이유로 검사 범위에서 빼지 않는다. 사이트 변경과 transport의 분산 원자 transaction은 가정하지 않는다. fence ACK는 incarnation/fence ID에 묶고 durable한 닫힘 상태를 확인해야 하며 ACK 손실·DB 실패는 폐쇄 유지다.

## 신선도·실패·정지 경계

검증 요청 시작을 s, 그 요청의 최신 권위 관측에 남을 수 있는 지연 상한을 d, 허가 사용 가능 기간을 L, 마지막 검사부터 실제 C/P까지의 미차단 진행 상한을 b, 보수적 시계/측정 오차를 e라 두면 **d+L+b+e ≤5초**가 필요하다. 숫자는 제품/주기 승인이 아닌 충족 조건이다. d 또는 b가 무제한/UNKNOWN이면 이 부등식으로 충족을 선언할 수 없다.

- permit deadline은 s+L과 known expiry 중 이른 시점에서 필요한 오차 여유를 뺀 값이다. 응답 완료 시각에 L을 다시 더하지 않는다. 느린 조회·retry·pool 대기도 예산을 소비한다.
- fresh primary query가 필요하다. 긴 repeatable-read transaction/replica/cache의 과거 snapshot을 새 검증으로 취급하지 않는다. HTTP validator를 쓸 경우 그 내부 freshness가 별도 전제다.
- 검증 실패를 알면 모든 기존 positive permit를 즉시 무효화하고 보호 입력/정보를 차단한다. 실패 후 남은5초를 쓰지 않는다. session별 실패의 영향 판을 pause하고 최초 실패 t0를 보존한다.
- 재개 시 이전 permit를 버리고 현재 권한·owner·incarnation·view를 다시 확인한다. 긴 pause/clock 불연속/partition은 갱신 성공으로 처리하지 않는다. callback success/error/null/finally 모두 같은 generation 검사를 거친다.
- t0+60초 이전에 검증된 복구가 완료되지 않으면 abort. 정확히 deadline이면 abort 우선, retry/owner 교체로 t0 재설정 금지. 자동 집행이며 운영자 가용 시간과 무관하다.
- healthy-network 재연결 각5초는 별도 T13 목표다. Auth/서버 장애 중5초 안에 권한 확인 없이 LIVE로 돌리는 정책이 아니다.

**남는 반례:** 마지막 deadline 검사 성공 → process pause → 외부 R →5초 초과 → 검사 다음 명령에서 commit/send. 재개 때 재검증을 넣어도 검사 직후 다시 멈출 수 있다. DB 잠금 소실 후 저장은 DB 권위 처리로 막을 수 있지만 독립 socket은 따라 닫히지 않는다. 일반 timer/같은 event-loop/no-await만으로 b의 상한은 증명되지 않는다.

따라서 추천 gate의 실행 adapter는 (1) deadline과 최종 commit/handoff를 같은 집행 경계에서 거절하거나, (2) 그 경계 밖의 독립적인 fail-closed 집행으로 기한 초과 후 진행이 불가능함을 보여야 한다. “watchdog 있음”만으로는 부족하며 watchdog 자신/host 정지와 복귀까지 포함한다. **현 후보에 이 primitive가 확보됐다는 증거는 없다(S2).** lease를 짧게 설정하는 것만으로 해결하지 않는다. known expiry·이미 인지한 실패에 대해서도 추가 유예를 만드는 primitive는 불허다.

## 중복·송신·owner·복원

- command 중복은 DB 원장으로 동일 mutation 한 번만 반영. commit 뒤 ack 유실/철회가 있어도 replay는 기존 결과를 무조건 전송하지 않고 새 P 인가를 한다. 같은 ID 다른 payload는 거절하며 오류에도 private 내용이 새지 않아야 한다.
- snapshot은 cut revision + view generation에 묶는다. view/권한 변화 후 오래된 snapshot/queue/callback은 폐기하고 새로 만든다. 인계 전 취소 가능한 모든 경로가 gate 안에 있어야 한다.
- 저장: owner epoch/incarnation/revision 비교와 mutation을 같은 DB 권위 경계에서 집행. 오래된 DB transaction의 순서와 owner 전환을 직렬화한다. 외부 worker의 ACK만으로 저장권한을 주지 않는다.
- 송신: gate가 현재 owner별 route/generation을 보유하고 old worker의 message를 거절한다. gate 자체가 old owner가 된 경우 DB CAS만으로 충분하지 않다. old gate 종료/격리 또는 S2의 만료 집행이 확인되기 전 새 gate를 활성화하지 않는다. 늦은 callback도 동일 경계로 돌아온다.
- 복원: 과거 DB의 session/승인/epoch를 현재 권한으로 신뢰하지 않는다. 새 incarnation으로 시작하고 old owner/connection/permit를 폐기한다. 현재 권한·탈퇴/삭제 기준의 독립 원천과 그 원천 자체의 rollback/이중 write 실패를 검증하지 못하면 닫힌 상태를 유지한다. RPO24h는 철회 부활 허용이 아니다. 구체 원천/삭제 방식은 기존 G04 미해결 조건을 유지하며 여기서 재설계하지 않는다.

## 확인 수준과 새 근거

| 분류 | 사실/결론 | 적용 상한 |
|---|---|---|
| 공식 지원 사실 F69-1 | [Supabase Sessions](https://supabase.com/docs/guides/auth/sessions): signout 대상 session 삭제와 session_id 조회, 만료 정리 지연을 설명. 2026-10-07 KST 재확인 | logout 검증 경로의 근거이지 모든 만료 판정·최소권한 배치·5초 SLA가 아님 |
| 공식 지원 사실 F69-2 | [PG17 isolation](https://www.postgresql.org/docs/17/transaction-iso.html): read committed 조회는 query 시작 snapshot, 반복 조회가 다를 수 있음. 같은 날 재확인 | fresh primary query 선정 근거. DB commit deadline/외부 P fencing 보장 아님 |
| 공식 지원 사실 F69-3 | [Node net](https://nodejs.org/api/net.html#socketwritedata-encoding-callback): write의 kernel buffer/사용자 메모리 queue/비동기 callback을 구분. 같은 날 v26.10.0 문서 재확인 | Node/해당 버전 채택 아님. 실제 TLS/WebSocket handoff나 deadline primitive 근거 아님 |
| 저장소 정적 정의 | scope 없는 signOut/CDN@2·기존 게임별 client 경계는 [CP0063](step-4b-g03-focused-support-evidence.md)/[CP0066](step-4b-g03-compatibility-boundary.md) 계승 | exact 실행 SDK/managed Auth 설치 버전 아님 |
| 운영 관측 | CP0059/61의 선택 함수12개·ACL/fingerprint | 전수 writer 감사·원자 snapshot·adapter 권한 승인 아님. 이번 운영 조회0 |
| 설계 결론 | DB 내 C·통제 P·시작시각 기반 freshness·모든 응답 새 P·저장/송신 분리·폐쇄 복원 | 이번 추천/부분 판정. 제품/성능/실제 지원 완료 아님 |
| 미확인 | S1/S2의 구체 바인딩, 전체 current authority/deletion 원천 | 근거 미확보이지 공급자가 명시적으로 불가라고 한 사실 아님 |
| 실행 증명 | T01~14 해당 경합·부하·복구·삭제 | 전부 NOT_RUN |

## 설계 완료·남은 조건·오픈 blocker

| 항목 | 설계 상태 | 구현·시험 의무 | 오픈 blocker |
|---|---|---|---|
| C/P/R·D0007 범위, 최초 무권한0 | 설계상 결정 완료 | 실제 commit/handoff/R oracle T01~05/T10 | 미증명 동안 YES |
| 시작시각 기반 deadline·실패 즉시 닫힘·60초 | 논리 규칙 완료, 최종 집행은 S2 필요 | T02/T03/T07/T13, 지연/정지/오차 경계 | YES |
| **S1 현재 권한 predicate와 모든 writer 연결** | **설계 단계 필수 부족**: 실제 Free Auth 설정별 predicate/최소권한, 사이트 writer의 fence 경로가 아직 특정되지 않음 | 고정 manifest로 T01/T03/T10. 함수/권한 존재와 경합 통과는 별도 | YES; 구현 전에도 차단 |
| **S2 deadline을 지키는 DB finalizer/transport adapter** | **설계 단계 필수 부족**: 구체 집행 primitive·P 위치·old gate fence·b/d/e 상한 근거 없음 | 고정 primitive의 T02/T05/T08. 단순 polling/send는 이 설계 조건 미충족 | YES; 구현 전에도 차단 |
| 중복·snapshot·late callback | 설계상 결정 완료, S1/S2에 의존 | T04~06/T08 | YES |
| 복원 후 현재 권한/삭제·새 incarnation | 닫힘 원칙 완료, 현재 기준 원천의 구체 방식은 G04 잔여 설계 | T08~11/T14 | YES |
| 품질/예산/단말 | 기존 목표·후보 유지, 이번 재선택 없음 | T12/T13/T14, 실비/기존소비 포함 | YES; 기본 서버료만으로 해소 불가 |

사용자에게 추가 정책 선택을 요청할 항목은 이번에 없다. S1/S2는 기술 담당 책임이다. 새 정책 완화·제품/주기/Auth 교체를 채택하지 않았으므로 DECISIONS는 변경하지 않는다. 이 문서의 구조는 **조건부 추천**이며 전체 채택 기록으로 확대하지 않는다.

## 기존 T01~14의 필요한 변경만

공통 oracle: 외부 R 대상의 C/P는 R+5초부터0, 최초 무권한과 내부 통제 R 이후 불허 C/P는0. 인지한 확인 실패 이후 추가 허용0. known expiry에 별도5초를 더하지 않음. 마지막 허용 표본만으로 차단 시각을 추정하지 말고 차단 이후 지속적인 명령/송신 시도를 주입해 거절 trace를 남긴다.

| 시험 | 변경/보완 | 관측·판정 |
|---|---|---|
| T01/T03 | 내부 R 즉시/외부 R 최대5초로 분리. 모든 logout scope·direct API·삭제·실제 만료별 target/non-target 포함 | R source commit/만료, 대상 session, C commit/P handoff, 지속 deny. getUser 응답/event 시간을 R로 대체 금지 |
| T02 | 검증 시작/완료·deadline·마지막 검사 직전/직후 pause, DB lock 소실/partition, resume 뒤 재정지 포함 | s/d/L/b/e와 실제 C/P. 5초 초과1건도 FAIL. finalizer 관측/보장 없으면 INCONCLUSIVE, timeout으로 commit 취소 추정 금지 |
| T04/T05 | commit/ack 유실 뒤 duplicate 새 P, view 변경/snapshot cut/부분 handoff/SDK 내부 queue 포함 | command/payload hash·recipient/session/view/revision·handoff ID. P 이전 취소·이후 전달 범위를 구분 |
| T06 | 모든 callback 경로의 generation 검사, 재개 시 fresh 검증 추가 | 이벤트 마지막 유실 상태에서도 deadline 만료. 이벤트 수신이 유일 차단 수단이면 FAIL |
| T07 | 인지한 실패 즉시 deny/pause, 최초60초 직전/정각/직후 유지. 외부 R5초와 분리 | 장애 인지와 R 각각 기록. 자동복구 성공이 deadline 정각이면 abort 우선 |
| T08 | old owner DB 저장/송신 독립 검증, old gate host 정지→복귀·새 owner 활성화 포함 | DB commit 순서와 gate route/handoff를 각각 관측. 저장 실패 로그만으로 송신 PASS 금지 |
| T10 | 최초 무권한0·Data API/RPC/오류/우회 P 유지 | 철회 잔여5초를 타인 정보 접근에 적용하면 FAIL |
| T09/T11/T12/T13/T14 | 기존 commit crash/삭제/품질/각 재연결5초/복구 비용 기준 유지; 새 incarnation/권한 바인딩 참조만 추가 | p95 원격 권위 화면·실패 표본 처리·모바일5기능·기존 후보 manifest 유지. 새 표본/주기 승인 없음 |

**관측 방법:** synthetic session/user로 source R trace와 DB C commit 순서를 수집하고, finalizer의 실제 handoff 계측을 같은 correlation ID로 연결한다. app 로그 timestamp/sequence/xid 할당을 cross-system 순서 증거로 대신하지 않는다. 로그에는 opaque ID와 hash를 쓰고 토큰/private payload는 남기지 않는다.

직접 Auth R의 exact oracle이 없으면 last-valid/first-invalid **권위 관측**으로 R 구간 [r_lo,r_hi]를 보수적으로 한정할 수 있는지 먼저 검증한다. source 관측 자체의 cache/시계 오차가 미확인이면 구간도 성립하지 않는다. 보수적으로 r_lo+5초까지 지속 차단이 확인되면 그 구간에 대한 상한 근거, r_hi+5초 이후 허용이면 FAIL, 그 사이는 INCONCLUSIVE다. HTTP logout 응답 시각만으로 합격시키지 않는다.

P도 계측이 앞/뒤 구간뿐이면 전체 구간이 허용 범위인지 판정한다. callback/packet capture만으로 정확한 handoff를 추정하지 않는다. trace 유실·clock 오차 미계측·실제 R/P 관측 불가이면 INCONCLUSIVE로 오픈 차단. 유한 시험 성공은 모든 실행 순서의 증명이 아니므로 S1/S2 설계 근거도 필요하다. 이번 시험 실행은 없다.

## 게이트·종료 경로

| 게이트 | 설계 상태 | 실행 검증 | 다음 필수 작업 |
|---|---|---|---|
| G01 PARTIAL/OPEN | 품질 목표/기본 단말 후보 유지 | NOT_RUN | 기존 T12/T13 manifest를 허용 시험 단계에서 고정/실행 |
| G02 PARTIAL/OPEN | freshness/재개/duplicate/60초 관계 보완 완료; S2 의존 | NOT_RUN | 바인딩 이후 정식 runtime/sync 계약 정합화 |
| G03 OPEN/BLOCKING | 논리 구조 조건부 추천, S1/S2 설계 조건 잔존 | NOT_RUN | 아래 한 작업으로 실행 경계 바인딩 판정 |
| G04 PARTIAL/OPEN | 복원 폐쇄/새 incarnation 유지, 독립 current 권한·삭제 원천 잔여 | NOT_RUN | 기존 B01~07 방식의 잔여 설계 결정을 별도 허용 범위에서 완료 |
| G05 PARTIAL/OPEN | 제품/총비용/부하 양립 미확정 | NOT_RUN | 구조 확정 후 기존 계산에 영향분만 반영, 미래소비 UNKNOWN |
| G06 | 두 Probe 적용만 SCOPED_DESIGN_RESOLVED | 실행 증거 없음 | 적용 범위를 확대하지 않음 |

STEP4B 종료까지 필수: (1) S1/S2를 실제 최소권한/DB/transport 배치에 연결하거나 그 후보를 배제, (2) 기존 G01/G02/G04/G05의 설계 필수 잔여를 결정하고 실행 의무를 분리, (3) 별도 승인 범위에서 정식 STEP4B runtime/sync·security/site·trace·risks·validation과 계획1.3 STEP4B 게이트를 D0006/D0007에 정합화한 뒤 설계 승인. 실행 시험 미완료는 오픈 blocker로 명시하되 그것만으로 설계 승인 무기한 대기시키지 않는다. 이번에는 어느 정식 파일도 변경하지 않는다.

**다음 담당 Sol, 다음 작업 하나: S1/S2 실행 경계 바인딩 명세 작성.** 일반 근거 재수집이 아니라 이 추천 구조에 대해 실제 predicate/최소권한/사이트 writer 경로와 DB finalizer/transport의 정확한 deadline·handoff·owner 차단 수단을 하나의 대응표로 작성한다. 바인딩 가능 근거가 없으면 해당 행을 미지원/미확인으로 구분하여 후보 채택 불가로 종료하고 같은 수집 cycle을 반복하지 않는다. 문의·실제 구현/시험을 자동 후속으로 붙이지 않는다. 이 작업의 산출물을 확보하기 전 전체 G03 설계 채택이나 STEP4B 종료를 선언하지 않는다.

100명/판8·세금포함월추가3만원·p95 250ms·정상망 회복 후 각 재연결5초·모바일 필수·기록 열람/30일삭제/탈퇴 연결 제거·외부 backup/RPO24h/발견 후24h/7일 복구점·Free서울·기존 운영 조건 유지. 비용/단말/백업 문서 재작성 없음. STEP4B IN_PROGRESS/전체 완료·구현 HOLD. 정식 반영·구현·실제 시험·권한 변경·문의·job/dump/복원·STEP5A·병합·main 없이 원격 제출 확인 뒤 정지한다.
