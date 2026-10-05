# STEP4B — 추가 결정·Free 서울 핵심 설계 후속 판단

2026-10-05 KST. 고정 입력 CP0056 / `0faf2f48b52b4dcaaa0e616a79c34b89ced7583c`. 역할은 Astra 성격의 구조·위험 판단이며 별도 모델 실행이나 독립 감사 인증이 아니다. [추가 결정](step-4b-additional-user-decisions.md)·[Sol 권한 근거](step-4b-free-seoul-authorization-evidence.md)·[Sol 비용 근거](step-4b-free-seoul-cost-backup-evidence.md)를 입력으로 삼았다. 기존 정식 계약은 수정하지 않는다.

## 1. 결론과 채택 범위

**현재 자료로 모든 목표를 동시에 충족하는 배포 구성을 확정할 수 없다. G03 OPEN/BLOCKING과 전체 구현 HOLD를 유지한다.** 기술적으로 모든 제품 조합이 불가능하다는 판정은 아니다. A는 안전성 기준으로 유지하고 DB 안의 저빈도 제어·최소 기록을 우선 검토한다. 외부 권위 실행과 송신은 별도 지원 증명이 필요하다.

| ID | 이번 설계 판단 | 분류·남은 조건 |
|---|---|---|
| J01 | DB의 true 응답 후 외부 apply/send, JWT/TTL/cache, Realtime 채널 권한만으로 A 충족 주장 거부 | 분석상 배제. 실제 구현 시험 PASS를 의미하지 않음 |
| J02 | DB 내 join/ready/start/terminal은 현재 인가·dedupe·owner 검증과 같은 transaction을 우선 | 조건부 설계 방향. Auth writer·만료·실제 잠금 지원 미증명 |
| J03 | 외부 C/P의 최종 실행 경계와 모든 R writer를 연결하는 증명이 없으면 고빈도 runtime 채택 보류 | 권한 요청 횟수 최적화보다 먼저 해결. B로 자동 전환하지 않음 |
| J04 | 권한 불명 즉시 새 보호 입력/출력 차단, 해당 판 전체 pause, 최초 장애부터60초 후 abort | 사용자 결정의 실행 의미 구체화. 다른 판은 독립, 공통 DB 장애면 영향 판 모두 적용 |
| J05 | durable start 후 시작, terminal once, 저장 불명은 PENDING, crash 판은 새 owner가 abort | 기존 판단 유지·정합화. completed 덮어쓰기와 같은 판 자동 복원 금지 |
| J06 | 재해 복원은 격리 상태에서 시작하고 이전 session/owner/미확인 승인으로 자동 재개 금지 | 기술 안전 조건 선택. 최신 권한 복원·재확인 절차 미증명 |
| J07 | 서울2GB IPv4 VM+Free+외부 bucket을 비용·자원 검증의 우선 후보로 유지 | 구매/최종 제품 채택 아님. 1GB 대조, 신규 Pro는 현재 예산 후보에서 제외 |
| J08 | 30일 삭제를 백업 속 추가 보존 허용으로 확대하지 않음 | 전체 복구 가능한 사본의 만료 방식과 보존 기산점 미정; 정책 질문과 연결 |

100명/판8명/세금 포함 추가월비3만원, 모바일 기본 참여, 반응 p95 250ms, 정상망 회복 후 재연결5초를 유지한다. 사용량 UNKNOWN은 비용0이 아니다. p99/tick/queue/RTO/백업 보존/탈퇴 정책은 자동 승인하지 않는다.

## 2. G03 — C/P/R를 만족하는 구조와 배제할 축약

C는 권위 상태 반영, P는 특정 수신자·현재 view·구체 payload 제공, R은 해당 권위에서 철회 확정 순서다. client 시각이나 철회 알림 수신 시각으로 R을 늦추지 않는다. C<R인 결과의 존재와 R 뒤 새로운 결과 열람 P를 구분한다.

### 2.1 경계별 판단

| 경계 | 선택/조건 | 반례·남은 증거 |
|---|---|---|
| DB 내부 C | 승인/session/membership/역할·owner·dedupe·mutation을 같은 순서에서 확정. 권한 범위별 안정된 잠금 대상·일관된 순서 필요 | 비키 status UPDATE와 충돌하지 않는 FOR KEY SHARE는 불충분. 삭제/재삽입·존재하지 않는 행·phantom·직접 SQL도 포함. managed Auth 지원은 별도 |
| 외부 simulation C | `DB allow → await → apply`는 거부. DB가 구체 command의 권위 결정을 소유하고 외부가 재구성만 하는 경우 또는 실제 외부 C를 R과 직렬화하는 경우만 검토 | 전자는 자율 tick·충돌·랜덤·시간 진행까지 권위 모델/비용 변화. command 승인만 기록하고 외부가 새 권위 결정을 하면 미해결 |
| 외부 P | 최종 송신 주체가 수신자/session/view/owner와 고정 payload를 R과 같은 순서로 검증·release해야 함 | snapshot 생성·outbox 삽입·permit 발급은 WSS release 자체가 아님. 앱/SDK queue·retry·배포 중 옛 프로세스의 송신 포함 |
| duplicate/결과 read | mutation은 같은 command identity+payload hash로 once, 응답은 현재 인가로 새 P | C<R 성공 응답을 R 뒤 cached bytes로 다시 제공하면 실패. 재시도 새 ID 발급도 금지 |
| old owner | 저장소의 epoch/CAS가 terminal 거부, 최종 egress도 독립적으로 옛 owner를 거부 | DB 쓰기 fence만으로 살아 있는 socket 송신 차단 불가. 새 owner 선출만으로 해결 아님 |
| 오류/운영 열람 | 보호 payload·토큰 없는 오류 whitelist, 필요한 운영 권한의 현재성 확인 | admin service key 보유를 제품 열람 권한으로 대체하지 않음. read-only라도 P 의무 유지 |

P의 제안 경계는 **권한 통제를 받는 최종 송신 컴포넌트가 구체 bytes를 transport에 넘기는 순서 지점**이다. 그 이전 모든 큐는 미승인으로 취급하고 R 때 폐기/재인가한다. 그 이후 transport 내부 bytes는 P<R일 때 늦게 도착할 수 있다. 소켓 라이브러리 send 호출이 이 경계를 제공하는지, 내부 queue가 어디에 속하는지 실제 버전의 구현/계측으로 확인해야 한다. 사전 포괄 permit을 P로 재명명하지 않는다. 이미 받은 byte 회수는 약속하지 않으며 정상 client의 이전 view/수명 무효화는 별도로 지킨다.

### 2.2 잠금 유지 방식도 즉시 채택할 수 없는 이유

`DB lock 획득 → 외부 send → lock 해제`만으로 지원 완료가 되지 않는다. 분석 반례는 다음과 같다.

1. DB와 외부 프로세스의 연결이 끊기거나 transaction이 종료되어 DB lock이 풀린다.
2. managed Auth 또는 운영 writer가 R을 확정한다.
3. 외부 프로세스가 연결 소실을 아직 모르거나 pause에서 깨어나 이전 allow로 C/P를 실행한다.

락이 살아 있다는 마지막 확인과 실제 외부 실행 사이에도 같은 틈이 있다. R writer는 로컬 DB 상태만으로 진행하고 외부 송신기는 다른 상태로 진행하기 때문이다. 장애 감지 시간 단축은 이 반례를 제거하지 않는다. 이 세 사건을 구조적으로 배제하는 원자성·외부 fence·지원된 프로토콜의 증거가 필요하다. 이는 분석 trace이며 실제 장애 주입 결과가 아니다.

고빈도 경로의 우선 설계 방향은 **권위 실행·최종 송신의 직렬화 책임을 명확한 한 경계로 모으고, 모든 철회 writer가 그 경계와 동등한 차단을 수행하도록 하는 것**이다. 그러나 현재 managed Auth/직접 운영 writer를 모두 연결할 지원 근거가 없다. 별도 게임 세션을 만들거나 기존 signout 성공을 게임 pending으로 바꾸는 방식은 사이트 권한 의미 변경이므로 이번에 채택하지 않는다. B의 lease/ack 구조를 A 구현이라고 이름만 바꿔 넣지도 않는다.

따라서 다음 기술 작업은 프레임워크 코딩이 아니라 **지원 가능한 Auth/DB/egress 경계의 증명 자료 확보**다. managed Auth가 참여하지 못하는 경우 현재 구조의 한계를 명시하고, 기존 Auth/사이트 계약 영향까지 포함한 대안 설계 범위를 후속 판단해야 한다. 예산 증액만으로 이 정합성이 해결된다고 하지 않는다.

### 2.3 철회 경로 전수 대응

CP0054 R01~10을 유지한다. 여기의 '필요'는 현재 지원 사실이 아니다.

| 경로 | 필요한 경계·후속 증거 |
|---|---|
| R01 승인 정지/재승인 | profile status commit R과 C/P 정렬. 현행 관리자 성공 의미 유지, 재승인은 새 맥락 |
| R02 가입 거절/보류/승인 | 모든 비승인 상태 deny. 승인 cache·join_request 잠금만으로 대체 금지 |
| R03 운영 역할/권한 감소 | 일반 플레이와 관리 열람 scope 분리. permission 삭제/재삽입 및 직접 profile 변경 포함 |
| R04 앱 logout | default/global/local/others의 실제 SDK scope 확인. client는 즉시 수명 무효화, 서버 R은 Auth 확정과 정렬 |
| R05 직접 Auth·만료·세션 종료 | wrapper 우회 포함. session 존재+정책+현재 토큰 만료 모두 확인, 권한 시간 경계 증명 필요 |
| R06 탈퇴/Auth user/profile 삭제 | 콘솔/API/SQL/cascade 포함. 삭제 실패와 권한 차단을 구분하고 기록 식별 연결·백업 정책 연결 |
| R07 방 이탈/강퇴 | 해당 membership C/P 차단, 다른 방 권한 보존. 재입장에 옛 명령/ready 재사용 금지 |
| R08 참가자/관전자·view 변경 | old projection·대기 응답 폐기, 새 view snapshot. 같은 revision도 새 view 필요 |
| R09 owner 변경/판 종료 | 저장과 송신의 옛 owner fence 각각 증명, 늦은 재시작 불허 |
| R10 운영 SQL·batch·migration·service credential | 실제 GRANT/function/trigger/실행 주체 목록, 우회 writer의 통제/차단. 문서 권고만으로 배제 금지 |

JWT exp는 시간 조건이어서 row lock만으로 만료를 멈추지 못한다. trusted clock의 오차/불확실성, commit/release 지점의 유효기간 확인을 명세해야 한다. 만료된 토큰으로 새 C/P 금지, refresh는 같은 session이 현재 유효할 때만 새 자격이다. Supabase session row는 만료 후 남을 수 있으므로 row 존재만으로 허용하지 않는다. user_metadata를 권한 근거로 쓰지 않고, app_metadata/JWT claim도 최신성 증명이 별도다.

## 3. G02 — 장애 종류·시간 목표의 정합화

| 사건 | 처리 | 복구/종결 조건 |
|---|---|---|
| client 일시 단절, 서버 권한 근거 유효 | client 보호 입력 차단·DEGRADED, 새 연결 수명으로 재인가 | 같은 판이 살아 있으면 현재 owner/view snapshot cut와 연속 stream 채택 후 LIVE. 단절 자체를 탈퇴로 간주하지 않음 |
| 한 사용자 권한 확인 불가 | 그 순간부터 해당 판의 새 보호 입력·정보 제공 차단, 자율 gameplay pause | 최초 확인 불가 시점 t0 고정. 해당 판의 모든 필요한 인가·owner·동기화가 t0+60초 전에 회복돼야 재개 |
| 공통 DB/Auth 경로 장애 | 의존하는 판마다 같은 정책 적용 | 다른 독립 판까지 불필요한 전역 epoch 폐기 금지. 비보호 장애 안내만 허용 |
| 60초 deadline 경합 | deadline 도달 시 내부 abort 결정, 이후 회복돼도 같은 판 재개 금지 | timer 호출이 늦어져도 실제 deadline 비교. 부분 재시도/새 socket으로 t0 리셋 금지 |
| 명확한 철회/방 이탈 | UNKNOWN pause 유예를 주지 않고 해당 권한 즉시 deny | 기존 leave/hostless/종료 규칙 적용. 철회와 단순 조회 장애를 혼동하지 않음 |
| 게임 서버 crash/owner 교체 | 옛 owner 저장·송신 fence, durable 미종결 판 abort | 같은 판 메모리 복원·자동 failover 없음. 새 판 identity와 ready/방장 조건으로 재시작 |
| DB 재해 | 서비스 닫힌 격리 복구 상태 | §4의 데이터·권한·삭제 복구 검증 뒤 개방. 5초 reconnect 목표 적용 사고가 아님 |

'즉시 차단'은 다음 보호 C/P를 허용하지 않는다는 의미다. socket healthcheck나 heartbeat 간격까지 권한을 연장하지 않는다. 알려지지 않은 철회를 뒤늦게 감지하는 문제는 위 pause 정책으로 해결되지 않으며 G03 barrier가 필요하다. 보호 상태를 담지 않는 연결 상태/오류 안내와 제한된 내부 cleanup은 사용자 gameplay 권한과 분리한다.

재연결5초는 **정상망이 실제로 회복된 시점 → 재인가 및 올바른 현재 snapshot/stream을 채택해 조작 가능한 LIVE**까지다. 서버/Auth/DB도 정상이고 같은 판이 계속 존재하는 일시 단절 사례를 대상으로 한다. 건강한 망이어도 DB 장애가 지속되면 별도 장애 사례로 기록하며 성공 표본에서 몰래 제거하지 않는다. timer를 Auth 복구 뒤로 늦춰5초라고 보고하지 않는다. 이미 aborted면 빠르게 종료 상태로 수렴하는 별도 결과이며 LIVE 성공으로 세지 않는다.

retry/backoff는 이5초 목표에 맞게 설계자가 튜닝한다. CP0054의 0.5/1/2/4/8초 열을 그대로 채택하면5초를 놓칠 수 있으므로 자동 채택하지 않는다. 중복 command는 원래 identity로 상태 조회하며 client queue 자동 replay 금지. snapshot cut 중 R/view 변경, 조용한 마지막 event 유실, A→B→A·dispose 후 error/null/finally/effect도 기존 수명/권한 검사 대상이다.

## 4. G04 — 최소 기록·삭제·재해 복원

### 4.1 기록 수명과 실패

최소 record는 match identity, 참가자 식별 연결, 시작/종결 시각, completed/aborted, 최소 reason이다. 이메일·실명·토큰·게임 private payload·랭킹·보상을 추가하지 않는다. owner/dedupe 내부 metadata는 사용자 projection과 분리한다.

- durable start와 현재 ready/방장/8명 조건이 확정되기 전 플레이 시작 성공을 표시하지 않는다.
- terminal은 match identity+현재 owner epoch+미종결 상태의 CAS와 dedupe를 같은 durable 연산에서 확정한다. completed/aborted는 한 번만, 재시도 payload 불일치는 거부한다.
- terminal ack 유실은 PENDING/UNKNOWN이다. 현재 인가로 재조회할 때만 저장 완료를 표시한다. DB 불가 중60초 abort는 gameplay 중단 결정이며 DB 저장 성공을 뜻하지 않는다.
- crash 복구자는 제한된 내부 cleanup 권한으로 미종결 start를 abort한다. 이용자가 logout했어도 정리는 가능하나 결과 제공 P는 별도다. 이미 completed인 판은 보존한다.
- terminal 미저장 중 crash가 나면 메모리 승리를 복원해 completed로 만들지 않는다. durable start의 abort 수렴을 이용한다. 큐가 유실될 수 있으므로 메모리 재시도만으로 최소 기록 보장 금지.
- 일반 서버 crash에서 확정 기록 유지가 의무다. DB 재해에만 목표 RPO24h를 적용하고, 이미 저장된 기록을 일반 장애 때 삭제해도 된다는 뜻으로 확대하지 않는다.

열람 predicate는 현재 승인/session AND (본인 참가 판 OR 필요한 현재 운영 권한)이다. 본인 참가 판이어도 타인의 불필요한 식별정보를 모두 공개하는 승인이 아니다. 공개 projection은 본인의 참여/판 상태 중심으로 최소화하고, 참가자 목록이 제품상 필요하면 별도 판단한다. service role 우회/Data API 직접 조회/오류 payload도 검사한다.

### 4.2 30일 삭제와 백업

보존 기산점의 추천은 **최초 권위 종결 시각+30일**이다. 늦은 저장 재시도·복원·조회로 만료를 연장하지 않는다. crash 후 처음 종결을 판정한 경우 recovery abort 시각임을 구분하며 실제 crash 시각을 꾸미지 않는다. 이 기산점은 사용자 확인 전 후보다.

논리 조회 차단, 운영 DB 삭제, 외부 backup/이전 object version/로그/임시 dump 삭제는 서로 다른 증거다. 복원 후 필터만으로 원본 사본의30일 삭제를 달성했다고 하지 않는다. 사용자 결정에는 '백업은 추가7일 보존해도 됨'이 없으므로 이를 가정하지 않는다.

기술 우선 방향은 기록 만료시각을 변하지 않게 보존하고, 만료 기록은 복원 격리 단계에서 제거하며, backup 사본도 그 정책을 충족하도록 구성하는 것이다. 전체 dump를7일간 그대로 보관하면29일 된 기록이 최대36~37일 남을 수 있으므로 **일률7일 full dump 보존은 현재 정책 충족안으로 미채택**한다. 만료 묶음별 export/삭제, 사본 재작성 또는 검증 가능한 key 폐기 등은 구현 후보이며 SDK/권한/복원성·비용 증명이 필요하다. 특정 알고리즘을 지원 완료로 선택하지 않는다. 백업 버전 관리가 삭제를 무효화하지 않는지도 확인한다.

오래된 retry로 삭제 기록이 재생성되지 않도록 유효한 현재 match namespace/start/owner 없이는 terminal 생성 불가로 설계한다. 무기한 개인정보 tombstone을 대신 남기지 않는다. 재해 뒤 새 runtime incarnation과 폐기된 명령 공간의 경계도 검증한다.

### 4.3 백업·재해 복원

우선 비교 후보는 지원된 export 도구로 일일 일관된 backup을 외부 private 저장소에 복사하는 방식이다. 게임VM scheduler는 추가 고정비가 작지만 VM 장애와 backup job 중단이 겹친다. 독립 감시·실패 재시도·자격증명 분리·복원 연습 없이는 채택 불가다. 개인PC는 상시 가동 근거가 없어 기본 복구 책임자로 추천하지 않는다. VM snapshot만으로 Supabase DB가 백업되지 않는다.

RPO는 job 성공 표시가 아니라 **재해 직전 최신 검증 가능한 consistent cut의 나이≤24h**로 측정한다. 하루 한 번 시작만 하면 실행 시간/누락으로 이를 넘길 수 있다. 일일 기준에 전송·재시도 여유를 두는 일정과 실패 경보를 기술 명세로 제안하되, 추가 backup 빈도/비용도 계산한다. 아직24h 보장 아님. 복구점에서 정책상 삭제해야 하는 기록 제거는 '재해 손실'과 구분한다.

복구 범위는 최소 게임 기록과 그 기록을 해석하는 schema/function/RLS/GRANT·참가자 매핑·migration manifest·암호화 key다. 사이트 전체 Auth 재해 복원은 별도 영향 범위이며 게임 table dump만으로 완료할 수 없다. managed schema dump 제한·Storage object 제외·role/secret 복구도 확인한다.

복원 절차의 안전 순서를 선택한다: 외부 ingress/egress 차단 → 격리 복원/manifest 검증 → 만료·탈퇴 삭제 재적용 → 새 복구 incarnation/옛 owner·command 무효화 → 현재 권한 재검증 → 최소 기록·권한 회귀 확인 → 개방. 백업에서 돌아온 승인 상태를 최신 사실로 신뢰하지 않는다.

사이트 DB도 과거로 돌아갔다면 재로그인만으로 충분하지 않다. 이미 철회된 승인/운영권한이 되살아날 수 있기 때문이다. 복구 밖의 신뢰 가능한 최신 철회 이력 또는 보수적 재승인 절차가 없으면 **권한 불명 상태로 계속 차단**한다. 재승인·전체 session 폐기는 사이트 영향이 있어 후속 영향 검토가 필요하다. 이 안전 조건은 RPO 허용과 별개다. 운영자가 최신 권한을 확인할 수 없는 경우 RTO를 맞추려고 개방하지 않는다.

## 5. G01 — 구체 시험 기준 제안

사용자 확정 목표 외의 표본 수·시간·기기 선택은 후속 시험 명세 후보다. 더 낮은 목표를 채택하는 것이 아니다.

| 구분 | 최초 인수 명세 제안 | 기록/판정 |
|---|---|---|
| 반응 | 입력 발생 → 다른 참여자의 권위 상태 화면 반영 p95≤250ms. 이동/상호작용 각각, PC와 모바일 각각 판정 | prediction 제외. command ID·C/P/revision·render trace, 계측 오차 포함. 시계 불일치는 동기화 오차 측정 또는 동일 관측 clock으로 보완 |
| 정상망 | 한국 유선/Wi-Fi/이동통신 실망별 RTT·jitter·loss 실측, 서비스 종속 경로 정상 여부 기록 | RTT40/100/200ms·loss0/1/3% 주입은 별도 손상망 분석. 결과가 나쁜 망을 사후 정상망 정의에서 삭제 금지 |
| 규모 | 100 고유 사용자 유지, 판 최대8명. 12×8+4, 로비/관전 혼합, 허용되는1인 분산방 사례 | 13방만으로 최악 방 수 증명 금지. 8명 초과 거부와 100명 admission 함께 확인 |
| 지속 부하 | 각 주요 조합60분, reconnect burst10분, 조작 종류별1000표본 이상 제안 | p50/p95/p99·timeout/오류/미완료 수·CPU/RAM/GC/queue/DB wait/전송량. p99는 관측값, 승인된500ms 합격선 없음 |
| 재연결 | 정상망 복귀→authorized LIVE≤5초. foreground에서1/5/15초 단절 각30회 후보 | 사용자가 재연결 p95라고 승인한 것은 아니므로 최초 명세는 대상 각 회≤5초로 제안. 미달 횟수·최대값·실패도 모두 보고 |
| 모바일 | Android Chrome·iOS Safari 각 실제 기기, 모델/OS/browser build와 touch viewport 고정 | 이동·상호작용·준비·종료 확인 UI·재접속 전부. background 복귀/화면 잠금·망 전환은 별도 상태 수렴도 검사. 연출 축소가 조작 누락을 허용하지 않음 |
| 장애 | 인가 불명 즉시0개 새 보호C/P, 판 pause, deadline60초 이후 재개0 | process pause/DB partition/60초 직전·직후 복구. deadline은 타이머 callback 시간으로 재정의하지 않음 |
| 안전성 | R 뒤 불허C/P·중복mutation·타인 정보·old owner terminal 각0 | percentile로 위반 허용 금지. CP0054 E01~12 및 이번 반례 포함 |

최저 지원 기기 후보는 Sol이 실제 확보 가능한 기기 정보를 모아 명세로 제출한다. 최신 플래그십만 시험한 결과를 모바일 전체 지원으로 표시하지 않는다. 하드웨어/브라우저 최소 지원 범위를 제품 제한으로 확정해야 할 때만 사용자에게 좁혀 묻는다. 현재 부하·기기·복구 시험은 전부 NOT_RUN이다.

## 6. G05 — 현실성 및 우선 조합

[공식 재확인·계산](step-4b-free-seoul-design-evidence.md)을 따른다. 가격 확인2026-10-05, 사용량·계정 quota·환율·세금 실결제는 UNKNOWN이다.

| 항목/조합 | 판단 | 이유·조건 |
|---|---|---|
| Free+Seoul2GB IPv4 VM+외부5GB bucket | 조건부 우선 평가, 최종 채택 HOLD | 기본$13, 환율1500/세율10% 가정21,450원. DB gate·egress·backup·기타비·CPU/RAM·G03 증거 필요 |
| 같은1GB VM+bucket | 비용 대조 후보 | 기본$8/13,200원. 100명/안전성/모바일 같은 시험 통과 없이 자원 하향 채택 금지 |
| 2GB VM+100GB bucket | 조건부 backup 용량 후보 | 기본$15/24,750원. bucket 증액은 Supabase5GB 반출 한도를 해결하지 않음 |
| 새 Supabase Pro+2GB VM | 현재 예산 후보에서 제외 | 외부 backup 미포함$37/61,050원. compute credit 이중 합산 안 함. G03도 자동 해결 안 됨 |
| Free Realtime20Hz relay | 주어진 부하 구성 배제 | 113×20=2260events/s 대조는 Free100/s 초과. 200 connections는 전송 허용량 아님 |
| 원격 개별gate4000/s | 주어진100h/256B 구성 배제 | 응답만368.64GB. batch/응답 축소 후에도 C/P/R 보안 의무 유지 |
| 모든 목표 동시 충족 | 추가 증거 없이는 판단 불가 | 현재 배포 가능한 안전한 조합 확정 못함. 사용자 목표 하향 대신 G03 지원 경계부터 해결 |

실시간 gameplay를 Supabase Realtime relay로 보내지 않는 VM WSS 방향을 우선 비교하되, 이 선택만으로 외부 P 문제가 사라지지 않는다. 최소 종료 기록은 Supabase에 두는 방향을 유지한다. framework는 G03를 집행할 수 있는지 먼저 판단한다. 전용 서버와 Nakama 중 제품명/버전을 지금 확정할 근거가 없으며 외부 SDK 자체를 권한 barrier로 보지 않는다. 지역은 사용자 확인 DB서울에 맞춰 VM서울 우선, Tokyo 이전 이유 없음. 서울 내부 RTT도 실측이 필요하다.

최종 예산은 실제 월평균 동접·활성 시간·방 분포·packet 크기와 backup 반출량을 넣어 검증한다. 데이터가 없으므로 여러 envelope를 유지한다. 월예산과 무제한 월이용시간을 동시에 보증하지 않는다. 오픈 전 계정 기존 소비도 모르면 남은 Free quota를 확정하지 않는다. 과금 알림은 hard cap이 아니며 admission/중단 정책은 사용자 결정 전 적용하지 않는다.

## 7. 사용자 결정이 필요한 항목만

아래는 아직 승인되지 않은 추천이다. 이미 선택한100명/8명/3만원·30일·Free서울·즉시차단을 다시 묻지 않는다. 잠금/SDK/egress/backup 알고리즘은 기술 담당 책임이다.

| 우선/ID | 쉬운 질문 | 선택지 | 추천·이유 |
|---|---|---|---|
| 1 / UQ1 | 삭제30일은 언제부터 셀까? 탈퇴하면 참여자 연결은 어떻게 할까? | 최초 종결부터30일+탈퇴 시 본인 식별 연결 제거 / 같은30일 동안 식별 연결도 유지 | 첫 안 추천. 최소 기록 목적에 맞춤. 다른 참가자의 판 상태는 기간까지 유지하되 탈퇴자 재식별 가능성·백업 삭제도 검토. 완전 익명화 보장 표현 금지 |
| 2 / UQ2 | DB 재해를 확인한 뒤 복구 목표와 대응 가능 시간은? | 발견 후24시간 내 수동 복구 목표·대응 가능 시간 명시 / 더 짧은8시간 목표와 추가 운영 견적 | 첫 안 추천. 직접 운영 상황에 맞는 출발점. 사고 발생부터 복구까지의 실제 시간과 발견 지연은 별도 기록, 24시간 상시 대응 약속 아님 |
| 3 / UQ3 | 실수·손상을 뒤늦게 발견했을 때 며칠 전 복구점까지 필요할까? | 최근1일 / 최근7일 | 7일 후보 추천. 늦게 발견한 손상 대응. 단30일 만료가 우선하므로7일 full dump 무조건 보관을 승인하는 질문이 아님. 사본 만료·용량 증명 전 채택 불가 |
| 조건부 / UQ4 | 검증 후 예산 충돌이 확인되면 어떻게 할까? | 안전하게 신규 판을 제한하는 운영 정책 / 예산 증액 후 목표 유지 | 지금 결정 요청은 보류. 실제 견적·초과 시점·현재 판 처리안을 먼저 제시. 무단 운영 제한/증액 없음 |

30일 이후 backup에 기록을 더 남기는 정책은 추천 기본안에 없다. 엄격한 삭제와 원하는 복구 이력을 기술적으로 함께 만족하지 못하면 그때 보존 예외의 정확한 기간·접근 제한·삭제 방식과 대안을 별도 제출한다. 사용자의 '추천안' 응답을 받기 전 위 항목을 ADOPTED로 기록하지 않는다.

## 8. 게이트·증거·다음 담당

| 게이트 | 현재 상태 | 남은 결정 | 필요한 증거 | 다음 담당 |
|---|---|---|---|---|
| G01 | PARTIAL/OPEN | 시험 환경/기기·정상망 정의 고정 | §5 조작별PC/모바일 p95·reconnect·100명 결과 | Sol 시험 명세 → 별도 허용된 시험 → Astra 판정 |
| G02 | PARTIAL/OPEN | SDK·retry/queue·deadline 구현 명세 | cut/view/revoke·단절·60초 경합·ack loss | Sol SDK 지원/명세 → 후속 시험 |
| G03 | OPEN/BLOCKING | 외부 C/P와 모든 Auth/운영 R을 포괄할 지원 경계 | U01~10, R01~10 실제 writer/GRANT, 잠금 소실 후 send·old owner·expiry trace | Sol 읽기 전용 지원/운영 근거 묶음 → Astra 구조 재판단 |
| G04 | PARTIAL/OPEN | UQ1~3·backup 상세 범위/기술·복구 운영 | start/terminal once·삭제 사본·RPO/restore·권한 rollback·현재 승인 재확인 | 사용자 정책 → Sol 복원/삭제 명세 → 후속 시험 |
| G05 | PARTIAL/OPEN | runtime·SKU 최종 선택, 필요시UQ4 | 실제 quota/부하/backupwire/checkout·총비용 | Sol 계정/지원 자료·계산 갱신 → Astra 적합 판정 |
| G06 | SCOPED_DESIGN_RESOLVED | 두 Probe 밖 확대 없음 | 기존 규칙·재대결/solo 경계 유지 | 후속 정식반영 허용 시 보존 |

다음 Sol 작업은 (1) 실제 적용 DB 함수/GRANT·Auth/SDK 버전·우회 writer 목록의 읽기 전용 근거, (2) 지원되는 session 검증/잠금/egress 경계에 대한 공식 문서 또는 지원 답변, (3) 최신 quota·실견적·backup 도구의 schema/data/Auth 범위, (4) 시험/복구/삭제 명세를 한 묶음으로 준비하는 것이다. production 키를 문서에 넣지 않는다. 접근 불가 항목은 UNKNOWN으로 남기고 사용자의 미래 사용량 예측을 강요하지 않는다.

구현·검증은 별도 허용 단계다. 이번에는 runtime/SQL/SDK/backup job을 만들거나 실행하지 않는다. STEP6 이전 공통 runtime 구현 금지를 우회하는 '증명용 구현'을 시작하지 않는다. 필요한 기술 검증의 범위는 먼저 별도 지정한다. 문서 분석상 배제/선택과 실행 증거를 구분하며 공식 문서 존재를 G03 PASS로 승격하지 않는다.

전체 STEP4B IN_PROGRESS / FOLLOWUP_DESIGN_JUDGMENT_SUBMITTED / 구현 HOLD. 정식6문서·이전 판단/감사·checkpoint·DECISIONS 보존. 결과·진행 기록을 기존 PR에 원격 제출한 뒤 정지한다. 정식 산출물 반영·STEP5A·병합·main 없음.
