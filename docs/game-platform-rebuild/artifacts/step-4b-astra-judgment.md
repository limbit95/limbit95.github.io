# STEP 4B — Work Astra 핵심 판단

상태: **GUIDE_ORDER_3_JUDGMENT_SUBMITTED / STEP4B IN_PROGRESS**. 2026-10-03 사용자 요청 범위의 설계 판단이며, 정식 산출물 반영·독립 사후 감사·구현·승인이 아니다. 역할은 작업 책임을 뜻한다. 기존 PR412와 STEP4B branch를 이어간다.

입력: [보존 원본](step-4b-auxiliary-research-report.md), [출처 검토 V01~12](step-4b-research-verification.md), [저장소 근거 B01~44](step-4b-source-trace.md), [이번 판단 trace](step-4b-judgment-source-trace.md). 준비 HEAD `ce3426803cc7ac53da3ba38ac908778ae4423b30`, 승인 integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`. 원본 수신과 별개로 아래 순서대로 판단했다. **채택**은 설계 방향의 선택이며 실행 지원 PASS를 뜻하지 않는다. **보류**는 구현을 막는 조건과 닫힘 증거를 동반한다.

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

## 3B — private·권한·사이트

### J07. 검사 시점과 철회의 경계 — 채택, 실제 집행 증거 보류

클라이언트 access gate는 UX이고 보안의 최종 경계가 아니다. 승인/세션/역할 정책과 authoritative action의 관계를 서버에서 정의한다. 철회와 행위가 경합할 때 어느 것이 먼저 확정되었는지 판정 가능한 직렬화 경계가 필요하다. 전 지구적 wall-clock 즉시철회를 약속하지 않는다. 이미 적법하게 전달된 데이터를 악의적 client에서 회수할 수 없고, 철회 이전 확정된 행위를 client dispose로 rollback하지 않는다. 반대로 철회 경계 이후 새 보호 행위나 private 제공을 오래된 승인 cache만으로 허용해서도 안 된다.

| 경계 | 필요한 검사 | 부족한 대체물 |
|---|---|---|
| 진입/재접속 | 검증한 identity·현재 승인·join/membership 정책 | Registry 표시·invite 보유만으로 입장 |
| 명령 적용/확정 | 대상/역할/현재성·게임 조건; queued command도 권한 경계와 일관 | 과거 join 때 한 번의 client check |
| snapshot/private 제공 | 해당 반환 시점의 승인 recipient/view, 저장 응답 포함 | 과거 commit 때 승인되었다는 사실만 사용 |
| channel 구독/갱신 | topic 권한과 membership 변경 전달·철회 집행 계약 | client에게 JWT refresh 요청만 함 |
| client 사용/보존 | 알려진 권한 변화 즉시 이전 view invalidation·구독/캐시 정리 | 네트워크 성공 응답이면 무조건 표시 |

서버의 authorization decision과 commit/release 사이에 틈이 있으면 재검사 또는 같은 원자적 경계라는 증거가 필요하다. 기존 SQL의 승인 predicate 존재만으로 모든 동시 철회가 직렬화되었다고 결론내리지 않는다. 실제 migration 최종 상태·GRANT/REVOKE·RLS·publication·정책 propagation은 미확인이다. 기본 privilege와 RLS는 별도로 검증하며 browser에 service credential을 전달하지 않는다. B03/B23~38, V04.

### J08. private 전달과 cache — 안전 기준 채택, private stream 도입 보류

private 정보는 서버에서 recipient별 승인 projection을 만든 뒤 제공한다. public 채널에 보내고 client UI에서 숨기는 방식은 제외한다. 현재 기본 방향은 승인 검사를 수행하는 snapshot/RPC 경계이며, 이는 기존 배포가 완전 검증되었다는 뜻이 아니다. private stream은 G03의 권한 freshness·recipient fencing 증거가 있을 때만 선택한다.

Supabase Broadcast/Presence channel policy cache와 JWT 갱신 경계는 철회 모델의 제약이다. JWT expiry를 기다리거나 협조적 client가 재가입한다는 가정만으로 요구를 닫지 않는다. 서버 측 연결 차단·권한 세대·lease 등은 후보 수단이며 제품이 실제 제공하는지, cache/in-flight와 어떤 순서로 작동하는지 검증해야 한다. 증거가 없으면 보호 데이터를 보류하고 명시적 재인가 경로를 택한다. 이 판단은 모든 Realtime 제품이 원천 불가능하다는 판정도, Postgres row RLS의 모든 내부 cache가 같다는 판정도 아니다.

client cache는 사용자·세션 의미·권한 view가 바뀌면 보호 데이터를 재사용하지 않는다. pending error/null/finally가 새 view를 지우거나 옛 private 정보를 다시 표시하지 않도록 STEP4A 검사를 적용한다. public 데이터의 재사용도 실제 공개 projection이라는 증거가 있어야 한다. 로그·telemetry·replay 저장에는 private payload를 무차별 남기지 않고 접근·보존 범위를 정한다. auth 상태를 확인할 수 없는 동안 보호 데이터/행위는 fail closed 한다. B10~12/B24/B29~33, V04.

### J09. 사이트와 게임 서버의 연결 — 책임 채택, 구체 연결 구현 보류

사이트의 승인회원/프로필 정책은 사이트가 소유한다. Site Adapter는 identity와 정책 변화 신호를 모델에 연결하고, 모델 backend는 token/claim의 진위·대상·유효기간·철회 의미와 외부 사용자 매핑을 검증한다. browser가 보낸 user-id/nickname을 서버의 신뢰 근거로 삼지 않는다. 외부 게임 서버를 도입할 경우 사이트 auth→게임 session bridge와 logout/승인철회 전파를 G03에서 닫아야 한다.

현행 TOKEN_REFRESHED 처리나 auth cache는 profile 재확인·승인철회 감지와 동일하지 않다. nickname은 서버가 승인된 profile에서 가져오는 현행 방향을 유지하고, 진행 중 변경 반영 시점은 별도 정책으로 명시한다. 현재 초대는 승인·만료·철회·게임 메타데이터를 검증하는 기존 사이트 흐름을 계승한다. invite 해석/라우팅 성공은 membership 획득이나 private 읽기 허가가 아니다. 실제 join에서 다시 서버 정책을 적용한다.

Registry의 routing/지원 metadata와 사이트 목록 표시, 공개/출시 정책을 보안 권위로 합치지 않는다. B40/B41의 별도 경로는 연결 근거이며 이번에 목록을 일괄 변경하지 않는다. 초대 본체 재사용 선택은 STEP5A, Publication 상세는 STEP5B에서 하되, 위 서버 경계를 약화하지 않는다. B29~41.

## 3C — 실행 위치·transport·운영/비용

### J10. 실행과 transport의 선택 범위

| 대상 | 이번 판단 | 이유와 보류 조건 |
|---|---|---|
| 기존 snapshot형 | 서버 RPC/DB commit + invalidation/reconciliation 방향 유지 | 현행 계약과 일치. 구독 준비·마지막 알림 유실·권한 경합은 검증 필요 |
| 연속 보호 온라인 | 서버 simulation 실행 방향 채택 | 권위 검증·private projection·단일 owner를 담당할 신뢰 실행 필요 |
| Nakama | authoritative 실행 후보 유지, 제품 채택 보류 | handler/메모리 match 근거는 있으나 사이트 auth bridge·crash·운영 수치 미확정 |
| Supabase Realtime | 알림/전달 후보; 이것만으로 simulation backend 선택 완료 아님 | 문서상 전달 기능과 게임 로직 실행은 다른 책임 |
| Photon | 제품/SDK별 후보 조사 수준 유지, 채택 보류 | PUN2 cache 근거를 browser JS와 모든 제품에 전이할 수 없음; server logic/SKU 검증 필요 |
| browser transport | WebSocket을 평가 후보로 유지, production 선택 보류 | 실제 SDK/browser 호환·reconnect·flow control·지연을 측정해야 함 |
| UDP/WebRTC 또는 relay 방식 | 이번 기본 선택으로 채택하지 않음 | 실제 browser 경로·인증·권위·순서/유실·지역/운영 증거 없이 속도 가정만으로 결정 불가 |

실행 위치와 transport를 같은 선택으로 묶지 않는다. TCP 기반 연결도 application-level exactly-once commit·durability·새 연결의 상태 복구를 보장하지 않는다. 반대로 모든 장르에 unreliable stream이 필요한 것도 아니다. 숫자로 정한 workload와 허용 경험을 만족하는 가장 단순한 검증된 조합을 후속 4B 결정에 제출한다. B01/02, V01~08.

### J11. 품질·운영·비용 판정 — 수치/공급자 선택 보류

현재 입력에는 채택할 게임의 target CCU·room size·지역·tick/input/update rate·payload·burst·허용 지연/소실·가용성·운영 예산이 없다. 따라서 특정 backend가 더 싸다거나 목표 latency를 만족한다고 판정하지 않는다. G01·G04·G05는 구현 전 필수 닫힘 조건이며 STEP6에서 API 이름을 정하면 해결되는 문제로 넘기지 않는다.

| 품질 축 | 구현 전 제출할 기준과 측정 |
|---|---|
| latency/jitter | 입력→서버 확정→상대 표현의 구간별 p50/p95/p99, reconnect deadline, 대상 지역·단말/회선 |
| 빈도/부하 | 입력·상태·invalidation rate, room당 fan-out, burst와 queue 상한, 서버 tick/CPU budget |
| bandwidth | payload 크기·전송/수신 fan-out·압축·snapshot 크기·recovery traffic·월 egress |
| 안전성 | J06의 11개와 J07/08 철회·projection·중복 응답; 경합/장애에서도 같은 oracle |
| 복구/운영 | RPO/RTO, crash/restart/drain, 저장/보존, 모니터링·알림·on-call·배포 rollback |
| 비용 | 구독/compute/DB/storage/egress/연결/메시지/운영 인력, 정상·peak·장애 재시도 시나리오 |

메시지 추정은 active sender 수 × 빈도 × 시간에 sender/receiver 과금 규칙과 fan-out을 적용하고 reconnect/snapshot/heartbeat 등 실제 과금 항목을 별도로 센다. 단순 CCU만으로 총 전송량을 계산하지 않는다. Supabase는 선택 확인한 문서상 Pro/Team 초과 메시지 $2.50/1M·peak connections $10/1K이며 package 올림과 project별 peak 합산을 적용한다. 이는 기본료·compute·egress를 포함한 총견적이 아니다. Heroic Cloud는 idle이어도 할당 자원이 과금될 수 있다. Photon PUN Premium의 CCU 최소요금·traffic/지역 조건은 그 SKU의 조건이며 server plugin이나 다른 제품을 포함한 견적이 아니다. 이번에는 실제 배포 구성/사용량/견적을 만들지 않았다. V09~12.

self-host는 인프라 가격 외에 배포·보안 갱신·관측·장애 대응·복구 훈련 비용까지 비교한다. managed도 auth bridge·게임 코드·가용성 설계 책임이 사라지지 않는다. 가격표 확인일과 제품/지역/플랜을 고정한 견적을 구현 착수 결정 시 다시 확인한다.

### J12. 추가 증거와 구현 전 해소 게이트

| 게이트 | 현재 미확정 / 필요한 증거 | 닫힘 책임·기준 |
|---|---|---|
| G01 품질 목표 | 대상 경험·CCU/room/지역·rate/크기·지연/staleness·budget 수치 | 후속 STEP4B에서 사용자 요구와 모델별 측정 기준 승인; 근거 없는 임의 숫자 금지 |
| G02 handoff/recovery | 실제 SDK/version, 준비 신호, initial/write race·마지막 알림 유실·gap/overflow 처리 | STEP4B 설계 보완에서 프로토콜/실험계획 고정; 승인된 검증 단계에서 목표 내 복구 실측 전 지원 PASS 금지 |
| G03 권한/private | auth bridge, 철회 직렬화·cache·in-flight·저장 duplicate response·logout/role전환 | STEP4B에서 서버 집행 방식/실패정책 결정, 구현·보안 검증에서 oracle 충족; 미충족 private stream 선택 금지 |
| G04 영속/owner | 확정의 durability 의미·RPO/RTO·crash·분리된 old owner·history retention | STEP4B에서 실패/소실 정책과 fencing 방식 확정, 장애 주입 검증 후 지원 판정 |
| G05 실행/transport/비용 | 제품·SKU·SDK/browser·region·deployment·운영 담당·시나리오 견적 | STEP4B 후속 선택/보류 갱신을 구현 전에 승인; 이름만 STEP6에서 정하도록 넘기지 않음 |
| G06 현행 규칙 충돌 | roomless/hostless 모델의 재대결 등 적용 의미·11개 동등 test | 필요 시 STEP2/상위 Architecture Change와 영향 감사/승인; 하위 구현 면제 금지 |

게이트의 설계 결정을 닫는 것과 실제 지원 검증을 통과하는 것은 별개다. 설계 단계에서 구현 테스트를 했다고 기록하지 않는다. 부족 증거 때문에 production 조합은 보류하지만 권위·안전성·복구의 판단 전체를 조사자에게 다시 위임하지 않는다.

### J13. 검증 계획과 합격 oracle — 이번 실행 NOT_RUN

| 시나리오 | 관찰해야 할 결과 |
|---|---|
| H01 최초 조회/구독 사이 commit·연결 유지 중 마지막 알림 유실 | 목표 staleness 안에 현재 권위 상태 복구 또는 명시 실패; 영구 stale 정상 표시 없음 |
| H02 gap/역순/중복/queue overflow·replay 만료 | 잘못된 기준의 delta 미적용, bounded resync, side effect 중복 없음 |
| H03 T01/T02/T03·동일version·await 뒤 error/null/finally | 이전 의미/view가 새 실행을 변경하거나 private 노출하지 않음 |
| H04 응답 유실 후 같은 명령 재시도·동시 충돌 | authoritative mutation once, 결과 조회/응답의 현재 권한 별도 집행 |
| H05 승인철회/탈퇴와 queued action·snapshot·stored response 경합 | 정한 철회 경계 이후 새 보호 행위/private 제공 거부; 이전 확정과 구별 |
| H06 logout/다른사용자·participant↔spectator·token/profile 변경 | auth cache만으로 권한 승격/지속 없음, 이전 보호 cache/소비 무효화 |
| H07 server crash/restart/drain·구 owner 메시지 | 선언한 durability/RPO/RTO와 단일 owner, split commit·확정 결과 조작 없음 |
| H08 prediction rollback·reconnect 반복·partial init/cleanup 실패 | 결과/Sound 소비 dedupe, 독립 정리, 타 실행 자원 침해 없음 |
| H09 목표 workload/지역·부하 급증·장애 재시도 | G01 latency/queue/bandwidth/복구 기준과 G05 비용/운영 한도 측정 |
| H10 현행 11개 안전성과 재대결 | DB 의미와 비DB 대응의 동등성, private 없음도 명시 검증 |

## 충돌 대조와 제출 경계

STEP4A의 생존/현재 의미/권한/순서 및 재검사 계약을 축소하지 않았다. Core에 새 전역 room/host/auth authority를 추가하지 않았고, 7축·선택모델·기존 게임 무이관 원칙을 유지했다. DB 11개 의무는 SQL 필드명과 구별해 계승했다. hostless 초기 시작 조건과 모든 멀티플레이의 현행 host 재대결 조건은 서로 다르므로 G06을 남겼다. 기존 구현 관찰에서 드러난 빈틈은 vNext 검증 조건으로 기록했으며 기존 게임 긴급 수정이나 현재 rulebook 변경으로 확대하지 않았다.

**완료:** 원본 보존·출처/범위/미확인 검토, 필요한 공식 원문 선택 확인, 3A→3B→3C 핵심 판단과 보류/추가 증거/닫힘 조건 제출. **미완료:** G01~06의 제품별 해소·실제 지원 검증, 가이드4 정식 산출물 반영, 가이드5 독립 사후 감사, 사용자 결과 승인. STEP4B 전체는 IN_PROGRESS다.

이번 판단 전체와 진행 기록을 PR412에 보존한 뒤 정지한다. 정식 산출물 반영·구현·STEP5A·병합·main 반영은 진행하지 않는다. 다음 작업은 사용자가 범위를 지정한 뒤에만 진행한다.
