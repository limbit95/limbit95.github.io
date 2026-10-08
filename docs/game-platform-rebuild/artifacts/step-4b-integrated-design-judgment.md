# STEP4B — D0008 적용 통합 설계 판단

2026-10-07 KST. 고정 입력 CP0072 `2a48b3d1d3c5ffe7a64675051181b2efa6c86c81`, tree `3c4110fc543e90286ff6c9ec7a07d3e40ddb9b62`. 시작 PR412 HEAD 일치/추가변경0. AGENTS → 계획1.3 → 기록 README → CURRENT → CP0072/D0006~08 → PR 순서 확인. Astra는 이번 설계 판단 책임의 명칭이며 별도 모델 실행 인증이 아니다.

## 1. 결론 — 조건부 채택 가능, 전체 설계 승인 전 조건은 남음

**추천 구조는 기존 Auth 유지 + primary DB 권위 commit + 단일 통제 송신 gate다. D0008 아래에서 조건부 채택 가능하다.** CP0071의 ‘모든 after-check 정지에도 예외 없는5초’ 충돌을 새 기준의 불가능 사유로 반복하지 않는다. 다만 정책 변경만으로 Auth predicate/최소권한·전체 writer·실제 transport·복원 삭제 원천이 완성된 것은 아니다.

이번에 확정하는 것은 아래 추천 설계의 책임·순서·실패 처리와 조건의 배치다. 제품 구매/배포, 현재 운영 적용, G03 전체 해소, STEP4B 최종 승인 또는 오픈 지원 완료를 선언하지 않는다. **설계 승인 전 필수 조건은 §7의 S-A~S-C 세 묶음**으로 한정한다. 이를 구현 시험 목록으로 숨기지 않는다. 이미 정의한 구조를 구현하지 않았다는 이유만으로 별도 설계 부족을 추가하지 않는다.

다음 추천 작업은 **Sol/Codex의 정식 계약·계획 정합화 한 작업**이다. 이 판단의 결정 가능한 규칙과 남은 조건을 정확히 반영한다. S-A~C가 미해결이면 결과는 설계 중간본이며 STEP4B 완료가 아니다. 같은 증거 수집·공급자 문의·새 포괄 감사를 기본 단계로 추가하지 않는다. 이번에 추가 사용자 정책 질문은 없다.

입력은 [CP0072 결정/범위](step-4b-operating-scope-user-decision.md), [검증](step-4b-operating-scope-decision-validation.md), [CP0071 판단](step-4b-binding-adoption-judgment.md), [CP0070 바인딩](step-4b-s1-s2-binding-specification.md)이다. G02/G04/G05는 [CP0060 판단](step-4b-support-design-judgment.md)·[CP0062 판단](step-4b-operations-design-judgment.md)의 관련 잔여만 사용한다. 과거의 미채택/실제-egress/무지연 결론은 당시 이력으로 보존한다.

## 2. S1 — 신원·현재 권한·최소권한

추천 판정은 `verified identity AND current user/session AND approved profile AND action permission AND match/view entitlement AND current incarnation/owner AND open gate`다. 하나라도 불명/실패면 positive permit을 발급하지 않는다. 조회 성공과 허가를 구분하며 browser가 넘긴 sub/sid는 검증 전 신원이 아니다.

| 경계 | 추천 설계와 판정 | 설계 잔여 또는 실행 의무 |
|---|---|---|
| JWT | 신뢰한 issuer/audience/algorithm/key로 서명 확인, sub/session_id/exp 필수. JWT role=authenticated나 user_metadata를 현재 운영 권한으로 사용하지 않음 | exact verifier/SDK/key 유형·clock manifest는 구현 전 고정. 현재 CDN@2를 exact 실행 버전으로 표시 금지 |
| 현재 session/user | primary의 새 statement snapshot에서 sid/sub 연결과 user 존재·현재 삭제/금지 조건 검사. session 부재는 deny. known exp/not_after 중 적용되는 가장 이른 기한으로 제한 | 실제 활성 만료·soft-delete/ban 조건과 Auth column 의미는 S-A. Free에 Pro timeout을 가정하지 않음. row 존재/getUser/refresh 하나로 전체 허가 금지 |
| site 권한 | 현재 profiles.status=approved 및 private helper와 동등한 역할/permission 규칙. operator는 필요한 기능별 권한. public.is_admin와 private 판정 혼용 금지 | 판정 규칙 연결은 설계 완료. vNext의 match 참가/recipient/view별 projection은 새 객체 구현 의무 |
| 서버 최소권한 | 전용 NOLOGIN predicate owner + 전용 server caller, 비노출 schema의 좁은 함수 EXECUTE. owner에는 필요한 column read만; PUBLIC/anon/authenticated 실행 차단. 고정 search_path/완전 수식 이름·검증된 sub/sid·결과 최소화 | 추천 배치 확정. Auth 실제 GRANT/RLS 통과 가능성과 grantor/role membership 명세는 S-A. postgres connector/service_role 권한 승계 금지. GRANT 기능 존재만으로 managed Auth 접근 가능 확정 금지 |
| 호출 신뢰 | 외부 JWT를 검증한 ingress만 내부 요청 생성. 내부 caller identity와 검증된 subject를 모두 확인. 직접 SQL에서 auth.uid()가 자동 설정된다고 가정하지 않음 | 내부 자격증명·role 분리 및 spoofed subject/claims 거절은 구현/시험. SECURITY DEFINER의 current_user를 원래 caller로 오인하지 않음 |
| 외부 Auth | global/default·local·others 대상 session을 나눠 같은 current predicate에 연결. direct API/console/delete/expiry를 앱 event의 유무와 무관하게 검사 | actual R 의미/활성 정책은 S-A manifest. logout wrapper 강제나 Auth writer와 공통 lock 계약을 필수로 요구하지 않음 |

S-A는 단순 ‘정확한 버전이 아직 없음’과 다르다. 어떤 실제 조건을 읽으면 삭제/만료를 판정하는지, 누가 그 조건을 읽을 권한을 부여할 수 있는지가 빠지면 positive 경로 자체가 미완성이므로 설계 승인 전 해결해야 한다. 버전 pin·배포 GRANT 실행·회귀 통과는 그 뒤의 구현/오픈 조건이다. 신규 운영 조회/실사용자 조회는 이번에 하지 않는다.

### 전체 writer와 Auth cascade

CP0070의 사이트 fence 순서를 유지하되 구현 경계를 다음과 같이 구체화한다.

1. subject/인가 의존성별 안정 anchor에 변경 operation과 closed 상태를 durable하게 등록한다. actor와 target 권한 의존성을 모두 대상으로 하고, permission 행 부재·재삽입도 같은 anchor를 사용한다.
2. DB finalizer는 같은 anchor를 잠그고 closed이면 C를 거절한다. gate는 대상 session/view의 신규 P를 막고 취소 가능 queue를 폐기한다. 이미 진입한 final send가 끝나거나 sender 격리가 확인되기 전에는 ACK하지 않는다.
3. fence controller의 제한 역할만 `(operation, incarnation, gate generation, closed/drained)` 확인을 저장한다. writer transaction은 현재 actor 권한과 이 확인을 다시 검증하고 status/role/permission 및 revision을 commit한다. 이것이 내부 R이다.
4. ACK 유실/실패/다른 gate generation이면 닫힘 유지. 변경 후 current predicate 재검증 전 재개하지 않는다. retry는 같은 operation ID이며 무조건 새 승인으로 처리하지 않는다.

적용 대상은 admin_set_member_status/role, system_admin_set_permissions, 가입 승인/거절 RPC, privileged profile 변경 trigger, bootstrap·직접 INSERT/UPDATE/DELETE·배포 SQL이다. 일반 직접 DML은 guard/최소권한으로 같은 절차를 강제하고, trigger/권한을 바꾸는 유지보수는 먼저 vNext gate 전체를 폐쇄·확인한 상태에서만 실행하는 운영 계약으로 둔다. 기존 운영 SQL을 단지 믿을 만하다는 이유로 제외하지 않는다. 정상 DML까지 bypass 가능하게 두고 문서만으로 통제 완료라고 하지 않는다.

Auth 삭제 cascade에는 위 사이트 사전 ACK를 무조건 요구하지 않는다. 원천 auth user 삭제는 외부 R, 그로 인한 profile/permission 삭제는 그 파생 효과다. 후보 분류 방법은 trusted caller 경계와 동일 transaction에서 원천 user 제거 관계를 검증하는 것이다. 일반 profile/permission 변경에 임의 GUC/flag만으로 예외를 허용하지 않는다. **실제 actor/soft-delete 경로에서 이 구별이 성립하는지는 S-A에 남으며, 해결 전 blanket trigger 추가나 candidate 전체 승인은 금지한다.**

기존 Auth/게임 무이관 유지. 공통 사이트 RPC/guard/운영 DML 진입 절차의 변경은 필요할 수 있다. 기존 승인·가입·관리·삭제 의미와 마지막 관리자 보호를 보존하고 caller/응답 호환·기존 게임 회귀를 구현 단계에서 확인한다. 새 fence/anchor/ACK가 현재 운영에 있다는 뜻이 아니다.

## 3. S2 — DB C와 통제된 P의 실제 배치

### DB 권위 C

외부 worker는 명령/계산 제안을 제출하고, 권위 state·revision·결과·command 원장을 primary의 짧은 transaction에서 함께 확정한다. 입력 검증·인가 의존 anchor·owner/incarnation·command ID/hash를 결합한다. 권위 C는 실제 commit이며 DB 응답·statement 종료·외부 simulation 화면 반영으로 바꾸지 않는다. 외부에서 새로운 권위 tick/난수/충돌을 결정한 뒤 DB에 뒤늦게 기록하는 구조는 이 추천에 포함하지 않는다. 저빈도 DB 우선 방향이며100명/품질 충족은 아직 미측정이다.

owner 전환과 command finalization은 같은 anchor lock을 사용한다. 먼저 잠근 old command는 takeover보다 앞서 commit하거나 rollback하고, takeover 뒤 old epoch/incarnation write는 거절한다. raw mutation 권한을 제거한다. command commit 뒤 ack가 유실돼도 재요청은 같은 payload hash에 한해 원장 결과를 찾고 mutation을 재적용하지 않는다. 결과 응답은 언제나 새 P 인가다.

clock_timestamp와 timeout은 fresh 검사·취소 보조로 사용하며 atomic deadline commit이라고 주장하지 않는다. final check부터 commit까지의 일반 실행 지연도 시간 예산에 포함한다. 일반 lock/WAL/network 지연이 예산을 넘으면 FAIL이며 ‘DB 정지 예외’로 자동 전환하지 않는다. D0008이 허용한 실제 after-check 실행 정지의 late C만 별도로 분류한다.

### 송신 P — 구체 수단을 가진 제한 후보

**송신 구현 추천 후보는 단일 Linux gate의 TLS memory BIO + 직접 nonblocking socket send 경계**다. gameplay/HTTP 보호 응답 모두 같은 경계로 보낸다. worker는 외부 client socket을 소유하지 않는다. OpenSSL의 표준 TLS를 사용하며 암호 알고리즘을 직접 구현하지 않는다. 이 배치는 설계 제안이고 제품·버전·운영 적용의 채택 사실이 아니다.

- OpenSSL output BIO를 socket에 자동 연결하지 않고 앱이 읽는 memory BIO로 연결한다. TLS 생성물도 아직 앱이 폐기할 수 있는 ciphertext queue이며 P가 아니다.
- recipient/session/view/payload hash와 연결된 frame/byte range를 gate가 관리한다. 최종 checks 후 실제 `send(MSG_DONTWAIT)`가 kernel에 수락시킨 byte 구간만 P로 계산한다. syscall 직전/직후 구간으로 관측하고 정확한 순간을 로그 한 줄로 꾸미지 않는다.
- partial send는 수락된 prefix만 P다. 나머지는 다음 send마다 새 gate/기한 검사한다. EAGAIN이면 인계 완료가 아니며 대기 후 다시 검사한다. 허가가 사라지면 남은 ciphertext를 버리고 연결을 종료한다. TLS sequence가 진행된 뒤 일부 데이터를 버리고 같은 연결을 계속 재사용하는 방식은 금지한다.
- TLS handshake/control 출력에도 오래된 보호 plaintext가 함께 flush되지 않게 app-data queue의 소유권과 flush 경로를 단일화한다. 최종 gate를 우회하는 다른 TLS writer/SDK buffer/proxy는 허용하지 않는다. 통제 가능한 queue를 앞당겨 P로 이름만 바꾸지 않는다.
- bounded memory/frame·backpressure·연결 종료 처리·TLS retry와 payload 매핑은 구현 설계 세부 의무다. 무제한 BIO 성장·오래된 queue 보존을 허용하지 않는다. 값은 승인된 사용자 수치가 아니며 구현 manifest에 근거와 함께 고정한다.

Node socket.write만 최종 P라고 선언하는 기존 단순 후보보다 구현 부담이 크다. CP0070의 native send 관측 후보에 TLS까지 연결한 차이다. 표준 기능으로 구성 가능한 수단이지만 **완성된 라이브러리/성능/총비용 보장은 아니다**. 이 구현 부담을 감당하는 실행 제품 조합은 S-C에서 결정해야 한다. 구조 판단 없이 Sol에게 transport 라이브러리를 다시 찾아오라고 하지 않는다.

### gate 교체·owner 송신 차단

초기 추천 배치는 active gate 하나이며 불명확한 자동 다중 gate failover를 채택하지 않는다. 같은 host의 교체는 기존 process의 종료를 OS가 확인하고 기존 FD 소유가 끝난 뒤 새 gate를 시작한다. host가 partition되어 종료를 확인할 수 없으면 새 gate를 열지 않는다. cross-host takeover가 필요하면 host 전원/네트워크 격리의 독립 확인을 필수로 하며, 그 수단 없는 자동 failover는 범위에서 보류한다. 기존 gate를 실제로 격리하지 않은 채 DB epoch만 올리고 새 gate를 활성화하는 구조는 불허다.

match owner 전환도 gate의 해당 match를 먼저 닫고 in-progress send 종료 확인 → DB owner 전환 → fresh view/권한 확인 후 재개 순서다. 기존 worker가 gate에 보낸 요청은 owner generation mismatch로 거절한다. 이미 P가 끝난 bytes의 네트워크 전달은 회수 범위 밖이다. gate 중단 동안 서비스 가용성은 상실할 수 있으나 권한 확인/서버 장애를 정상망 재연결 성공으로 계산하지 않는다.

## 4. 운영 장애 범위·시간 예산·관측 oracle

운영 범위는 ‘정상적이면 된다’는 순환 정의가 아니다. deployment manifest에 primary/transport/OS/clock·부하·queue/DB wait 제한·실패 처리와 fault 목록을 사전 고정한다. 숫자는 이번 사용자 승인값으로 만들어 넣지 않는다. 검증 시작 s, source freshness 오차 d, permit 유효구간 L, 최종 commit/handoff 잔여 b, clock 오차 e를 사용해 `d+L+b+e≤5초`를 만족하도록 구성한다. 완료 시각부터 새 L을 시작하지 않는다. primary 새 snapshot을 사용하고 replica/장기 transaction cache를 fresh로 간주하지 않는다.

known expiry에는 잔여 b/e를 예약해 이전에 finalization을 시작하도록 하고 의도적 만료 유예를 두지 않는다. 검증 실패를 알면 잔여 permit 시간과 무관하게 폐쇄/pause한다. failure t0+60초 전 검증된 복구가 확정된 경우만 재개, 정각/이후에는 abort 우선이며 retry/재시작으로 t0를 새로 만들지 않는다. 시간 예산의 값/환경을 고정하고 입증하는 것은 E01이지만, **일반 DB commit 지연까지 제한할 전제가 성립하지 않으면 이 배치의 상한 조건은 실패**다. timeout 기능만으로 그 전제가 충족됐다고 선언하지 않는다.

| 사건 | 분류·처리 | 필요한 관측 / 합격 판단 |
|---|---|---|
| 일반 latency/lock wait/WAL wait/partition/이벤트 유실 | 기본 검증 범위. source 응답 늦음/실패는 허가 연장 아님; queue retry마다 재검증 | 제한 초과 C/P는 FAIL. 관측되지 않은 stall을 예외로 추정 금지 |
| worker 최종 검사 이전 정지 | old permit을 새 작업에 사용 금지, DB/gate가 다시 검사 | resume/새요청·permit시작·DB/gate 검사 trace |
| worker 정지, DB backend 계속 진행 | 제출 transaction과 새 worker 작업 분리 | DB commit 사실을 independently 확인. worker timeout만으로 rollback 가정 금지 |
| backend 또는 sender 최종 검사 이후 실제 실행 정지 | D0008의 제한된 예외. 이미 검사된 해당 C 또는 해당 send 시도만 late 완료 가능 | OS scheduler/process-stop/host-suspend 등 원인·정지구간·최종검사 이전시점·해당 command/byte range 연결 필요. 단순 긴 RTT/로그 공백은 불충분 |
| host 전체 정지 | 같은 host watchdog도 실행 못할 수 있음. 진행 중 작업 한계 인정, 새 작업 폐쇄/재검증 | 외부 관측과 host resume 기록 결합. 모든 queued 작업에 예외를 승계하지 않음 |
| 재개 후 후속 작업·새 callback | 새 작업이므로 D0008 late 예외 아님. 폐쇄 상태 확인/현재 인가부터 다시 진행 | finalization마다 age/clock/generation 검사를 적용. 첫 이미 진입한 명령의 잔여와 구별 |
| failure/known expiry/60초 중 실제 정지 | 동일 물리 한계를 기록, 의도적 유예 없음. 재개 후 deadline 경과면 abort로 수렴 | t0 보존·abort 우선, 정지 중 정각 실행했다고 표시 금지 |
| P 이후 전달 | 이미 수락된 구간은 회수 미보장 | 커널 수락 이후 지연/재전송을 새 P로 계산하지 않음 |

‘장시간’이라는 새 숫자는 확정하지 않는다. 예외 판정은 단순히5초가 넘었다는 결과가 아니라 **최종 검사 뒤 실제 실행 정지가 해당 지연을 일으켰다는 증거**로 한다. 일반 과부하/지연을 장시간 정지로 사후 재분류하지 않는다. 증거가 부족하면 INCONCLUSIVE, 증거로 범위 내 위반이 확인되면 FAIL, 승인된 예외가 확인되면 ACCEPTED_LIMITATION으로 별도 집계한다. 예외 표본을 정상 성공이나5초 PASS로 넣지 않는다.

실제 R은 원천 효과/commit 또는 보수적인 권위 관측 구간, C는 실제 DB commit, P는 syscall 수락 구간으로 연결한다. source R부터 마지막 허용 C/P까지의 상한을 clock 오차 포함 보수적으로 계산한다. callback/timestamp/xid 할당을 실제 순서로 대신하지 않는다. trace 누락·clock 미계측·R/P 불명은 INCONCLUSIVE/오픈 차단. payload 원문·토큰은 로그에 남기지 않고 opaque correlation ID/hash·revision·owner/incarnation·view·byte range를 기록한다.

## 5. G02·G04·G01·G05의 설계 잔여 정리

G02의 설계 규칙은 latest snapshot cut/revision/view와 독립 재동기화, 모든 늦은 callback의 generation 확인, mutation 원장과 새 P 분리로 고정한다. 정상망 회복 후 각5초는 판이 LIVE이며 서버/DB/현재 인가 정상인 사례의 `tnet→fresh view+조작 가능`이다. 서버/권한/재해 장애 사례를 성공 집계에서 숨기지 않고 별도 결과로 보고한다.

G04의 durable start 전에 LIVE를 알리지 않고 terminal은 command/판 ID·owner/incarnation으로 단 한 번 확정한다. DB 정상 crash에서 durable terminal을 보존한다. DB 장애 중 중단을 결정했으면 최초 권위 종결 시각과 삭제 deadline을 외부 durable journal에 보존한 뒤 DB에 재적용하는 방향을 추천한다. 최초 시각의 증거가 없으면 늦은 저장 시각으로30일을 늘려 성공 기록하지 않는다. 이 journal을 어디에 어떻게 내구 저장하고 rollback에서 보호할지는 S-B다. 이름만 붙여 완료로 하지 않는다.

복원은 폐쇄·격리·새 incarnation으로 시작하고 old gate/owner/session을 무효화한다. 과거 backup의 승인/운영권한을 현재 권위로 재사용하지 않는다. 재로그인만으로 승인/권한/삭제의 rollback을 해결했다고 하지 않는다. 현재 기준 원천이 없거나 rollback 의심이면 닫힘 유지한다.

분리 archive+참가자 연결 분리 우선 방향은 유지한다. first terminal+30일 삭제와 탈퇴 unlink를 운영DB·archive/version/temp/pending upload에 적용하고 retry/restore 재생성을 막아야 한다. 삭제 의도의 durable 기록 → 사본 publish 차단 → 각 사본 삭제 → 검증된 완료를 분리한다. 두 시스템 write 원자성을 가정하지 않는다. **현재 삭제/권한 원천 자체 rollback과 bounded tombstone/오래된 upload 폐기를 집행할 구체 제품·내구성 경계는 S-B의 설계 부족**으로 남는다. 암호화/hash/restore filter만으로 해결됐다고 하지 않는다. full PII dump7일 추가 보존이나 무기한 tombstone 승인은 없다.

RPO는 검증 완료 복구점의 consistent cut 나이를 기준으로 `Δ+v+m≤24h`를 유지한다. 매24h cut+양수 검증 지연 또는20h 사람 공백만을 retry 예산으로 두는 방식은 배제한다. 추가 cut/증분·자동 retry·독립 감시 방향을 추천하되 주기/제품은 S-B에서 예산과 함께 확정한다. 연속 실패는 목표 미달로 기록하고 안전 확인 전 개방하지 않는다. 발견/경보/인지/착수/복원/검증/개방을 구별하며 RTO의 시작은 실제 발견이다. 평일20~24/주말“풀”을24/7로 확대하지 않고 공휴일·부재 대응은 오픈 운영 준비 조건으로 둔다.

G01은100명 총접속/판8에서 원격 참여자 권위 화면까지 p95≤250ms, 정상망 각 재연결≤5s, Windows10/11 Chrome/Edge·iPhone Safari와 모바일5기능으로 인수 기준을 고정한다. exact build·망·기기·표본/기간은 시험 manifest 후보를 확정할 구현/QA 의무이며 새 사용자 목표가 아니다. 실패/누락 표본은 별도 건수와 실패 판정으로 남겨 성공 표본만으로 충족 선언하지 않는다. 권한 위반은 percentile 허용0이다.

G05는 Free서울+game server+외부backup 후보를 그대로 비교 입력으로 사용한다. 이번 native TLS gate의 구현/운영 부담을 총비용에 추가 연결해야 하며 기본 VM 요금만으로30,000원 준수 선언 불가다. DB gate/gameplay/Realtime/backup 반출/저장/검증·복원/기타운영비, 세금·수수료·환율 민감도·기존 소비를 분리한 기존 산식을 유지한다. 신규 가격 수치를 제시하지 않으며 과거 견적은 당시 값이다. 제품/SKU와 전체 비용 상한 조건은 S-C, 실제 청구/부하 측정은 실행 의무다. 사용자 정책 목표와 충돌하면 몰래 낮추지 않는다.

## 6. 근거 수준과 제한 확인

| 수준 | 사용 범위 |
|---|---|
| 저장소 정적/기존 운영 관측 | CP0070·CP0059/61의 선택 함수·ACL/FK/Auth SELECT 관측만. 전수 writer 감사·원자 snapshot·현재 운영 불변 증거 아님 |
| 공식 지원 사실 | 아래 기능별 문서. 완성된 조합/managed 설치 버전/5초 SLA와 다름 |
| 이번 설계 결론 | DB 권위·단일 gate·native TLS buffer/P 관측 후보·close-before-writer/takeover·장애 분류·필수 조건의 단계 구분 |
| 미확인 | S-A~S-C 및 exact 배포 manifest. UNKNOWN을 성공이나0으로 대체하지 않음 |
| 실행 증명 | T01~14/B01~07와 아래 E01~04, 전부 NOT_RUN |

조회일2026-10-07 KST. 새로운 송신 후보와 권한 배치에 필요한 문서만 제한 확인했다. 기존 가격/metadata 반복 조사·문의 없음.

- [Supabase Sessions](https://supabase.com/docs/guides/auth/sessions): session_id와 auth.sessions 연결, logout 대상 row 제거 및 timeout 정리 지연을 설명한다. Free에서 Pro 세션 제한 기능을 가정하지 않는 근거다. 전체 current predicate나 게임5초 계약을 제공하지 않는다.
- [PG17 GRANT](https://www.postgresql.org/docs/17/sql-grant.html): 객체/column 권한·역할에 따른 부여 기능. managed Auth에서 선택한 grantor가 실제로 부여할 수 있다는 별도 증거는 아니다.
- [Node net](https://nodejs.org/api/net.html#socketwritedata-encoding-callback): write가 내부 버퍼에 남을 수 있어 단순 반환/callback을 선택한 최종 P 증거로 쓰지 않는다.
- [OpenSSL3.5 memory BIO](https://docs.openssl.org/3.5/man3/BIO_s_mem/)·[SSL BIO 연결](https://docs.openssl.org/3.5/man3/SSL_set_bio/): TLS I/O를 BIO에 연결하고 메모리의 출력 데이터를 앱에서 읽을 수 있다. final gate 조합과 payload/byte 매핑은 이번 설계 추론이다. 실제 버전 pin·구현 완료 사실이 아니다.
- [Linux send(2)](https://man7.org/linux/man-pages/man2/send.2.html): nonblocking 수락 byte/재시도 경계의 기능 근거. 전달 완료나 hard deadline 기능으로 확대하지 않는다.

## 7. 필수 조건과 단계별 상태

| ID | 완료 시점 | 정확한 조건 / 현재 상태 | 담당 |
|---|---|---|---|
| S-A | G03 설계 승인 전 | 현재 user/session 만료·삭제 predicate의 실제 필드/활성 정책, 좁은 role의 grantor/RLS 명세, 전체 writer guard와 Auth cascade 분류의 지원 경계. 현재 미확보 부분이 있어 전체 승인 불가 | 설계 담당, 확보된 정의를 실제 명세로 확정. 공급자 문의 자동 조건 아님 |
| S-B | G04/STEP4B 설계 종료 전 | 최초 terminal·현재 권한/삭제의 복원 독립 원천 및 이중 write/publish 실패 처리, finite replay/tombstone/allcopies 삭제·cut/retry의 구체 저장 수단. 현재 후보 방향만 있고 binding 부족 | 설계 담당. backup job/복원 시험으로 설계 부재를 대신하지 않음 |
| S-C | STEP4B 제품/운영 설계 종료 전 | native gate 포함 실제 server/transport/backup 제품 조합과 총30,000원 비용 조건, S-B의 운영·복구 시간예산. 조합 최종 미확정 | 설계 담당. 과거 견적 재사용 시 조회일 표시, 필요 변경 사실만 확인 |
| E01 | 구현 설정 고정 후 오픈 전 | exact SDK/Auth 설정/DB/OS/TLS manifest, d/L/b/e 예산·일반 DB 지연 bound·fault 분류 관측. 범위 내5초 초과 FAIL | 구현/QA. 숫자 임의 승인 없음, 지원 전제 부재는 S-A~C로 복귀 |
| E02 | 구현 후 오픈 전 | T01~10 권한·Data API·writer/cascade·duplicate·view/queue·old owner·60초/crash 경합 | 구현/QA, NOT_RUN |
| E03 | 구현 후 오픈 전 | T11/T14·B01~07 사본삭제/restore/current 원천/RPO/RTO/운영calendar 실증 | 운영/QA, NOT_RUN |
| E04 | 구현 후 오픈 전 | T12/T13 100명/판8·remote p95·각 reconnect·모바일·총비용 측정 | 성능/QA/운영, NOT_RUN |

이는 같은 연구를 다시 나누자는 요청이 아니다. **현재 기준으로 설계 전체가 끝났다고 할 수 없는 최소 세 조건**을 드러낸 것이다. 정식 반영 작업자는 이 조건을 자의적으로 없애거나 ‘설계 완료’로 치환하면 안 된다. 정보·제품 지원이 없는 것을 파일 반영만으로 닫을 수 없다.

| 게이트 | 설계 상태 | 남은 필수 설계 | 실행/오픈 상태 | 다음 작업 |
|---|---|---|---|---|
| G01 | 품질/관측 규칙 정리, PARTIAL/OPEN | S-C의 배치와 품질 조건 연결 | E04 NOT_RUN/오픈 차단 | 정식 J10~12·T12/13 정합화 |
| G02 | handoff/재연결/60초 규칙 정리, PARTIAL/OPEN | S-A와 구체 배치 조건 연결 | E01/02 NOT_RUN/오픈 차단 | J02~05에 fresh view·정지 예외·deadline 반영 |
| G03 | 조건부 채택 가능, OPEN/BLOCKING | S-A; S-C 배치 및 §4 운영 범위 명세 | E01/02 NOT_RUN/오픈 차단 | J07~09에 D0006~08 및 본 구조/조건 반영 |
| G04 | 기록/복원/삭제 방향과 실패 규칙 정리, PARTIAL/OPEN | S-B 및 S-C | E03 NOT_RUN/오픈 차단 | J04/H07·B01~07과 조건 연결 |
| G05 | 제품 조합 미확정, PARTIAL/OPEN | S-C | E04 및 실청구 UNKNOWN | J10~12 총비용/제품 조건 반영 |
| G06 | 두 Probe 적용만 SCOPED_DESIGN_RESOLVED | 추가 없음 | 실행 지원 선언 없음 | 기존 범위 보존 |

## 8. 정식 반영 담당에게 전달할 정확한 변경 범위

이번에는 아래 정식 파일을 수정하지 않는다. 후속 반영은 원문 이력 블록/hash를 보존하고 새 적용 규칙과 supersedes 관계를 분명히 연결한다. CP0071 C 판정이나 당시 source trace를 최신 사실처럼 덮어쓰지 않는다.

| 파일/절 | 반영할 내용 |
|---|---|
| [runtime/sync](step-4b-runtime-sync-contract.md) J01 | §3의 DB 실제commit C, 외부 worker 비권위, 단일 Linux/TLS gate 추천 및 S-A~C 조건. 채택 확정 제품으로 표시 금지 |
| 같은 문서 J02~05 | command once/새P, revision/view/reconciliation, owner 저장·송신 순서, §4 fault/resume/60초, §5 durable start/terminal와 최초시각 조건. J06의11개 안전성은 승인된 대체 범위만 연결 |
| [security/site](step-4b-security-site-contract.md) J07~09 | §2 current predicate/최소권한·전체 writer/cascade, §3 P/partial send/old gate, D0007+08 부분 대체·최초 무권한0·미해결 S-A |
| [contract trace](step-4b-contract-source-trace.md) | 원래5블록 hash 이력 보존. 새 source CP0072/D0008/이번 제출 SHA → §2~7 → 대상 조항별 변경/유지/조건부/실행 연결표 추가 |
| [risks/followup](step-4b-risks-and-followup.md) | 당시 감사 대기/전체OPEN 블록과 현재 상태 구별. §7 S-A~C/E01~04·승인된 정지 위험·기술 잔여·다음 작업 하나 반영 |
| [validation](step-4b-validation.md) | 정식 문서 정합 검사와 행동 NOT_RUN 분리. actual R/C/P·clock/error·FAIL/INCONCLUSIVE/ACCEPTED_LIMITATION oracle. 지원 PASS 금지 |
| [execution/operations](step-4b-execution-operations-decisions.md) J10~13 | 위5파일만 바꾸면 기존 J12 gate와 충돌하므로 이 파일도 후속 범위에 포함. 확정 품질/비용 목표·제품 미확정·G06 제한·설계/실행 상태표 정합화. 비용 명세 재작성 없음 |
| 기존 T01~14/B01~07 | 원본 CP0059 명세/이력 보존, 별도 amendment로 T01~03 writer/Auth/fault·T04~08 queue/owner·T09/10 terminal/권한·T11/14 restore·T12/13 기존 품질을 §2~7에 연결. B명세는 S-B 미확정을 완료로 승격 금지 |
| 루트 계획1.3 STEP4B/연결 게이트 | D0006~08에 따라 ‘권한/복원 설계 공백 해결’은 S-A~C, 행동 검증은 E01~04/오픈 조건으로 분리. 22단계/STEP6 전 공통runtime 금지·별도 병합 승인 유지. 실제 개정 번호/이력은 그 반영 작업에서 명시 |

종료 순서는 이 판단의 정식 정합화 → S-A~C의 구체 설계 충족 여부 확인 및 설계 승인이다. 이미 증거가 생긴 조건은 같은 반영 작업에서 명시 근거로 닫을 수 있으나, 없으면 그대로 남긴다. 실행 의무만 남았을 때 설계 종료를 허용하되 실행/오픈은 별도다. 새로운 포괄 감사나 사용자 재승인을 임의로 추가하지 않고 기존 승인 경계를 따른다. 달력상 완료일·다음 제출만으로 완료를 약속하지 않는다.

100명/판8·세금포함월추가30,000원·p95 250ms·정상망각재연결5초·모바일5기능·기록열람/최초종결+30일삭제/탈퇴unlink·daily외부/RPO24h/발견후24h/7일복구점·Free서울·기존 운영조건 유지. 사용량/기존 무료 소비를0으로 가정하지 않으며 미래workload/실청구/실제지원은 UNKNOWN이다.

**다음 담당/한 작업: Sol/Codex — 위 표에 따른 정식 계약·계획 정합화, S-A~C 미해결과 실행 NOT_RUN을 보존한 제출.** 이번에는 그 작업을 시작하지 않는다. 조건부 추천의 실제 추가 정책/제품 채택은 없으므로 DECISIONS 보존. STEP4B IN_PROGRESS/전체 완료·구현 HOLD. 정식반영·구현·시험·권한변경·문의·job/dump/복원·STEP5A·병합·main 없이 제출 확인 뒤 정지.
