# STEP4B — 구현 전 조건과 사용자 결정 구체화

2026-10-04 KST. 상태: PREIMPLEMENTATION_CONDITIONS_SUBMITTED / STEP4B IN_PROGRESS.
고정 입력 [CP0053](../checkpoints/CP-0053-step-4b-authorization-boundary.md) 및 제출 SHA `12181366b39a2d5da083701cd7bf056046566e9f`.
이번 문서는 후속 판단이며 정식 계약 반영·독립 사후 감사·구현 지원 인증이 아니다. 기술 조건은 후속 검토안, 수치·제품·사용자 정책 추천은 미채택이다.

## 1. 유지한 결정과 이번 진전

기존 branch `docs/game-platform-vnext-phase4b-evidence-preparation`, PR412 OPEN/Draft/미병합, base integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`를 확인했다. 기존 정식 제출 d2819c0과 CP0049 감사는 당시 이력으로 보존한다.

- Probe1: 이동·상호작용 중심 작은 2D 협동, 같은 참여 맥락에서 준비 확인 후 방장 시작.
- Probe2: 서버 기록 없는 로컬 단독. 새 방·host·서버 결과 기록을 강제하지 않는다.
- 총접속 최대100명(로비·관전자 포함), 한 판 최대8명, 한국 중심 PC 검증, 모바일 참여 검토.
- 세금 포함 게임용 월추가비30,000원, 직접 운영 가능. 24시간 대응 약속은 없음.
- 일시 단절은 현재 상태 복원, 게임 서버 crash는 미완료 판 중단·재시작 허용.
- Probe1 최소 종료 기록: 판 식별·참가자·완료/중단. 랭킹·보상 없음. DB 재해의 확정 기록 손실 허용은 아직 결정되지 않음.

이번에는 권한 writer 범위를 소스153파일로 넓혀 확인하고, A의 연산별 증명 의무·복구 상태 전이·수치 후보·Seoul 제품 조합·질문을 정리했다. 모든 게이트 상태는 유지한다. [근거·가격·계산](step-4b-preimplementation-evidence.md), [검증](step-4b-preimplementation-validation.md).

## 2. G03 — A의 직렬화 경계

R=해당 권한 철회가 권위에서 확정된 순서, C=권위 상태 반영, P=특정 수신자·view·구체 payload의 정보 제공 확정이다. 벽시계 비교나 client timestamp가 아니라 실제 연산 순서로 입증한다.

1. C 또는 P가 R보다 뒤라면 해당 철회 범위에서 새 보호 행위를 허용하지 않는다.
2. C<R인 mutation은 소급 취소하지 않지만, 그 결과를 다시 읽거나 중복 응답하는 새 P에는 현재 권한이 필요하다.
3. P<R에 이미 전송된 byte는 회수할 수 없다. DB permit 발급을 외부 WSS P로 이름만 바꾸거나 포괄적 미래 송신권을 발급하지 않는다.
4. 권한 조회 실패·단절·불명확은 새 C/P 차단이다. TTL·JWT 만료 대기·이벤트 수신만으로 안전성을 충족했다고 쓰지 않는다.
5. 재승인·재로그인·재입장은 새 권한 맥락이다. 과거 command/view/owner를 자동 부활시키지 않는다.

### 2.1 철회 writer 목록과 조건

아래는 경로 종류별 포괄 목록이다. 저장소 내 정적 확인과 운영에서 활성화된 모든 경로의 증명을 구별한다. UI에 버튼이 없어도 Auth API·운영 콘솔·직접 SQL 경로를 제외하지 않는다.

| ID | 경로·범위 | 확인 사실 | A에서 필요한 처리·미확인 |
|---|---|---|---|
| R01 | 승인 정지·재승인 / 계정 | admin_set_member_status가 profile FOR UPDATE 후 상태 갱신, UI 성공 표시 | 보호 연산이 같은 profile 변경과 실제 충돌하는 순서 사용. 현재 성공 의미를 게임 pending으로 바꾸지 않음. 운영 적용 정의·외부 P 미증명 |
| R02 | 가입 거절·보류·승인 / 계정 | admin_review_join_request·admin_approve_join_request도 profile status writer | 승인 아닌 상태 전부 deny. join_request 잠금만으로 외부 권한 직렬화 주장 금지. 과거 승인 cache 재사용 금지 |
| R03 | 사이트 역할·관리 권한 감소 | admin_set_member_role, system_admin_set_permissions 확인 | 게임 관리자/기록 열람에 사용한 권한만 해당 scope로 재검사. 일반 플레이 권한과 관리자 열람을 혼동하지 않음. admin_permissions 삭제와 read의 순서도 포함 |
| R04 | 앱 logout / session scope | header·pending·passwordReset에서 js/auth.js signOut 호출, SDK scope 인자 없음 | local 사용은 인지 즉시 무효화. 실제 SDK의 default/global/local/others를 고정하고 서버 session 종료와 C/P의 경합 증명. push cleanup 대기는 서버 철회 증거 아님 |
| R05 | 직접 Auth signout·세션 만료·관리자 세션 철회 | 공식 Auth 경로 존재, 앱 wrapper 외 호출 가능 | session_id 현재성·만료·정책을 최종 경계에서 검사. session row 존재 조회만으로 외부 C/P가 원자적인 것은 아님. Auth 관리 schema 임의 변경 금지 |
| R06 | 회원 탈퇴·Auth user 삭제·profile 삭제 | 선택153파일에서 계정 삭제 API 호출/탈퇴 구현 미발견; profile FK cascade 존재 | Auth 콘솔/API·운영 SQL은 별도 조사. 부재/삭제는 deny. 삭제 실패를 완료로 표시하지 않음. 권한 차단 후 식별 연결 제거·백업 처리까지 기록 정책과 연결 |
| R07 | 방 이탈·강퇴·참여권 감소 / membership | vNext 구현 없음, 필수 설계 경로 | membership 변경과 해당 action/read/P를 같은 순서로 처리. 다른 방 권한은 유지. 재입장에 과거 command 재사용 금지 |
| R08 | 참가자↔관전자·private view 변경 | STEP4A T03 계약 | old projection·응답 queue·client cache 차단. 새 view snapshot 재취득. 동일 revision도 옛 view를 허용하지 않음 |
| R09 | owner 교체·match 종료·운영 재시작 | vNext 구현 없음 | 사용자 철회와 별개의 서버 쓰기/송신 권한 fence. old owner의 저장 거부만으로 WSS 차단 완료라 하지 않음 |
| R10 | service credential·SQL·관리 콘솔·배치·migration | repository만으로 전수 활성 경로 확인 불가 | 실DB 함수/trigger/privilege·실행 주체 목록과 배포 운영 경로 대조. 우회 가능한 writer를 문서 권고만으로 막았다고 하지 않음 |

profiles 직접 update API도 존재한다. 일반 사용자 privileged-column 변경은 trigger·RLS 경계와 함께 검토하며, “프런트에서 안 보냄”은 권한 증거가 아니다. bootstrap_system_admin·배포 SQL도 역할 변경 경로로 추적한다. 사이트 초대 token 취소는 기존 membership까지 철회하는지 정책을 먼저 구별하며, 취소를 과거 합류 전체 취소로 확대하지 않는다.

### 2.2 보호 연산별 설계와 필요한 증거

| 연산 | 설계상 고정 가능한 조건 | 구현·시험으로 증명할 것 |
|---|---|---|
| join·ready·start·rematch | current user/session/approval/membership와 준비·방장 조건, dedupe, durable start를 동일 권위 연산에 포함 | 실제 transaction·lock order·권한 범위·rollback, 8명 초과 거부와 중복 start once |
| DB 내 결과/상태 mutation | identity+payload hash 검증, expected revision, owner fence, terminal CAS | 동시 철회/중복/owner 교체와 commit의 순서, 분리된 연결에서 재현 |
| 외부 simulation 입력 C | 사전 true 응답 뒤 메모리 apply 금지. DB에 특정 명령의 권위 결정을 저장해 외부를 재구성으로 둘지, 외부 C까지 포괄할 gate를 쓸지 결정 필요 | 실제 apply 선형화 지점, 모든 writer와 경합 trace, 비용. 아직 구체 adapter 선택 공백 |
| snapshot·live·재연결·private P | 수신자·view·payload를 특정, 최종 release를 R과 직렬화 | DB 응답→외부 queue→socket 사이 틈을 포함한 P 위치·purge·in-flight 한계. 연결 시 RLS만으로 완료 불가 |
| duplicate response·결과 열람 | mutation dedupe와 read 인가 분리; 과거 private response 그대로 재전송 금지 | 완료 C 이후 logout/역할 감소 후 재조회 거부, 본인 참가 판 predicate |
| 오류·로그·진단 | 보호 상태/토큰이 오류·일반 로그로 우회 노출되지 않음 | wire payload whitelist와 오류 응답/진단 권한 검사 |
| 서버 crash 후 aborted 정리 | 이용자가 나간 뒤에도 내부 복구 주체가 기존 판을 종결 가능; 사용자 session의 생존과 별개 | 제한된 내부 권한+current owner fence+미종결 조건. 결과를 사용자에게 제공하는 P는 별도 인가 |

DB 내부는 transaction commit을 C로 둘 수 있지만 외부 송신은 자동 포함되지 않는다. profile 비키 UPDATE를 막는 데 FOR KEY SHARE를 근거로 삼지 않는다. lock의 대상·순서·timeout·deadlock retry와 Auth row 접근의 지원 여부는 실제 버전에서 정해야 한다. 삭제될 수 있는 membership·permission row는 부재/재삽입 경합도 포함하고 단순 “조회한 row lock”으로 범위 전체를 잠갔다고 하지 않는다.

**G03의 구체 차단 조건:** (a) 관리형 Auth/session writer까지 포함한 직렬화 방식, (b) 외부 simulation C, (c) 외부 WSS P 중 하나라도 설명·증거가 없으면 전체 OPEN/BLOCKING이다. A는 안전성 기준·DB 저빈도 우선안이지 완성된 WSS adapter가 아니다. B로 자동 전환하지 않는다. B 재선택은 모든 writer·owner ack·단절/재기동 fence 증거와 별도 판단이 필요하다.

## 3. G02·G04 — 복구와 기록의 일관성

| 상태·사건 | 허용되는 다음 동작 | 금지/보존 조건 |
|---|---|---|
| CONNECTING→AUTH_PENDING | 새 연결 수명으로 user/session/approval/membership/owner 확인 | socket open만으로 LIVE 금지 |
| AUTH_PENDING→SYNCING | authorized snapshot cut n과 n+1 이후 stream을 같은 owner 순서로 연결 | cut 중 R이면 snapshot/buffer 폐기, 새 view 또는 접근 거부 |
| SYNCING→LIVE | 현재 view와 연속 revision 검증 후 표시/조작 | 이전 tracking의 성공·error·null·finally·effect 채택 금지 |
| gap·quiet loss·일시 단절 | DEGRADED로 조작 차단, 새 인가 후 snapshot 재취득 | 누락 마지막 event는 heartbeat/reconciliation으로 탐지. heartbeat는 권한 허용권 아님 |
| 명령 commit 후 ack 유실 | 동일 identity/payload로 상태 확인; UNKNOWN 유지 | 새 ID로 재실행 금지, 재조회 P에 현재 인가 |
| auth 근거 불명확 | 새 C/P 즉시 차단. 사용자별 격리 또는 match pause는 Q04 선택 후 확정 | 복구 deadline은 철회 유예기간이 아님 |
| 서버 crash·owner 교체 | old owner fence→durable start 중 미종결 판만 aborted CAS | completed 덮어쓰기 금지, 같은 판 메모리 이어하기 없음 |
| terminal DB 응답 유실 | 확인 전 PENDING, durable 상태 재조회 | 사용자에게 저장 완료/완료 판으로 선확정 금지 |
| 재대결 | 기존 참여 맥락 유지, 새 match identity와 ready 검증 | 이전 판 기록·dedupe·effect를 새 판에 전용 금지 |

start 기록이 commit되지 않으면 플레이 시작을 확정하지 않는다. start가 commit됐지만 UI ack 전에 crash해도 복구자는 그 판을 찾아 aborted로 수렴시킨다. completed와 aborted는 상호 배타적 terminal이며 반복 호출은 같은 결과로 수렴한다. owner epoch CAS와 terminal 저장은 한 durable 경계여야 한다. DB가 단절된 동안 aborted 저장 완료를 주장하지 않고 복구 후 정리한다.

초기 Probe는 자동 failover로 같은 판을 계속하지 않는 기존 판단을 유지한다. 단일 서버라도 split process·배포 중 이전 프로세스·장기 pause 후 재개를 시험한다. “프로세스 하나 예정”으로 owner fence를 면제하지 않는다.

최소 기록 후보는 판 식별, 참가자 식별 연결, 시작/종료 시각, 완료/중단 및 최소 reason code다. 시각·reason은 보존/운영을 위한 기술 metadata 제안이며 점수·랭킹·private gameplay를 추가하지 않는다. 내부 owner/dedupe metadata와 사용자에게 보이는 기록을 구별한다. 보존 종료 후 늦은 retry가 삭제한 기록을 되살리지 않도록 만료된 match namespace/권한을 거부하는 정책도 필요하다.

## 4. G01 — 승인 전 품질 후보

다음 수치는 제품 보장·실측 결과가 아닌 **비교 가능한 최초 인수 기준 제안**이다. Q03 답변과 측정 후 조정한다. 안전성 항목은 성능 협상 대상이 아니다.

| 항목 | 후보 기준 | 측정·미확정 사항 |
|---|---|---|
| 규모 | 총100 고유 사용자, 판당8명 유지 | 96명/12판+4명/1판, 1인 분산100판 가능 경로, 로비/관전 혼합을 각각 검사. 중복탭·재접속으로 200socket transient도 시험 후보, 200명 지원 의미 아님 |
| PC 기본 | 한국 PC Chrome·Edge, 1366×768, 60Hz 화면 | 정확한 OS/browser build와 CPU/RAM을 시험 명세에 기록. 기준 저사양 실기기 1대 선정 필요 |
| 권위 반응 | 조작→다른 PC에 권위 상태 표시 p95≤250ms, p99≤500ms | local prediction을 성공으로 세지 않음. 동기화된 계측 시계의 오차 또는 왕복 probe로 분해 측정. 실패/timeout도 별도 포함 |
| 렌더 | PC 프레임 간격 p95≤33ms | 연출 하향으로 모바일을 자동 충족 처리하지 않음 |
| 진입·복구 | healthy network 시 join p95≤3초; 일시 단절 후 네트워크 회복부터 authorized LIVE p95≤5초 | 서버 crash 복원/RTO와 구별. AUTH_PENDING 포함 전체 시간 |
| 상태 최신성 | heartbeat 1초 후보, 진전 확인 3초 없으면 DEGRADED; 강제 gap 후 snapshot 수렴≤5초 후보 | 표시용 stale 탐지 기준. R 뒤 3초 송신 허용이라는 뜻 아님 |
| 조작·전송 | 서버 tick20Hz, 상태10Hz 시작 후보; input 최대20Hz 시험 | 서버 권위 효과는 C 이후. 이동 input 병합 가능해도 상호작용 command 손실/중복 적용 금지. 미채택 |
| queue·retry | 연결별 앱 queue64KiB 또는 2초분 중 먼저 도달 시 resync; reconnect 0.5/1/2/4/8초 지수+jitter, 30초 후 수동 재시도 후보 | control/revoke 우선, overflow는 명시 실패. OS/socket buffer까지 합산 측정. SDK 자동 retry와 곱셈 폭주 방지 |
| 안전성 | R 이후 불허 C/P 0, 중복 mutation0, 타인 private 노출0, old owner terminal0 | 평균/percentile로 위반 허용 금지; 모든 필수 반례 통과 증거 필요 |

시험안: 100명 부하60분 soak + 10분 재접속 burst, 8명 실제 두 클라이언트 이상 동작 검증, 한국 서로 다른 망2종. 네트워크 RTT40/100/200ms·loss0/1/3% 주입은 비교 envelope이며 한국 실망 측정치를 대신하지 않는다. 정상망과 손상망 결과를 섞어 p95를 좋게 만들지 않는다. 200ms/loss3%에도 250ms를 보장한다고 가정하지 않는다. 현재 코드·부하 도구 실행은 이번 범위 밖이다.

## 5. G05 — 제품·지역·운영비 판단

[공식 근거 및 산식](step-4b-preimplementation-evidence.md)을 따른다. 가격 확인일 2026-10-04, 실환율·계정 요금·사용량은 미확인이다.

| 후보 조합 | 구체 지역/제품 | 비용 비교·선택 사유 | 상태 |
|---|---|---|---|
| C1 우선 평가 | Lightsail Linux IPv4 2GB/2vCPU, Seoul ap-northeast-2; HTTPS/WSS 직접 운영; 기존 Supabase Auth/DB 연결 | VM $12 + snapshot20GB-month 가정$1. 기존 DB 증액0인 경우에만 기본 민감도20,020~22,880원 | 안전성/부하/DB egress 미검증. 최종 채택 HOLD |
| C2 대조 | 같은 Seoul 1GB/2vCPU + snapshot20GB-month 가정 | $8, 민감도12,320~14,080원. 여유 비용은 크지만 TLS/runtime/로그 메모리·CPU 검증 필요 | 100명 요구를 낮추지 않고 같은 시험으로만 비교 |
| C3 지역 대조 | Lightsail 2GB Tokyo ap-northeast-1 + 기존 DB | 기본 $13 가정 동일, VM 초과 송신$0.14/GB. 기존 DB가 Tokyo라면 gate RTT 비교 가치 | 한국→Tokyo 지연 실측 전 Seoul보다 낫다고 판단 안 함 |
| C4 새 유료 DB | Seoul2GB + Supabase Pro 신규 증액 | 최소 $37, snapshot 제외56,980~65,120원 민감도. $10 compute credit 이중 합산 안 함 | 월3만원 후보에서 제외. 요구/예산을 몰래 조정하지 않음 |
| C5 DB 동거 대안 | Seoul2GB에 게임 저장소까지 직접 운영, 사이트 Auth는 기존 연결 | 별도 DB 기본료를 줄여도 같은 VM crash/백업·복원 책임 증가, 사이트 Auth와 분산 경계는 그대로 | A를 해결하는 지름길 아님. 현재 우선안으로 선택하지 않음 |

runtime 제품 후보는 기존 조사 대상 Nakama authoritative+browser JS/WSS와 작은 전용 서버를 비교한다. Nakama의 match loop·메모리 상태 기능은 유효한 평가 근거지만 별도 DB/프로세스 메모리와 사이트 권한 adapter 비용이 포함돼야 한다. “2GB SKU가 있으니 Nakama100명 가능”으로 쓰지 않는다. 전용 서버는 구현량·운영 책임이 증가한다. SDK·server·OS 버전 pin, 실제 메모리/CPU/DB 연결 시험 후 결정하며 이번에 임의 버전이나 프레임워크를 채택하지 않는다.

Pages는 HTML/JS 등 정적 배포에 쓰고 게임 WSS 권위 실행 서버를 대신하지 않는다. 장기 저장소 분리는 배포 경계 변화이며 공통 권한 계약을 분리하는 승인이 아니다. 기존 Supabase 프로젝트 region을 모르는 상태에서 Seoul 이전을 결정하지 않는다.

**비용의 남은 차단점:** A를 100명×입출력20Hz마다 원격 DB gate로 단순 구현하면 4,000 gate/s이다. 응답256B 가정만으로100시간에368.64GB의 DB outbound가 된다. 이는 실제 과금량은 아니지만, 기존 Free egress 여유가 무제한이라는 가정을 배제한다. batch는 네트워크 호출을 줄여도 구체 연산·수신자 권한 검사를 없애거나 미래 permit을 허용할 수 없다.

월 사용시간·평균 active와 room 분포·packet bytes·기존 DB quota를 알아야 최종 견적을 낼 수 있다. 현재는 유료 제품 구매·배포·account 조회를 하지 않았다. 예산 초과 시 delta/전송 범위 최적화는 동일 경험·안전성을 유지해 검증하고, 운영시간 제한/신규 판 제한/예산 증액은 사용자 별도 선택으로 남긴다. 과금 알림만으로 hard cap을 보장하지 않는다.

## 6. 사용자에게 필요한 결정만 — 모두 미채택

알고리즘·lock mode·C/P 구현·SDK 버전 선택은 기술 담당 책임이다. 아래 제품 정책만 사용자에게 묻는다. 기존100명/8명/3만원·한국·직접 운영·최소 기록은 다시 질문하지 않는다.

| 우선/ID | 질문 | 선택지 | 추천과 이유 |
|---|---|---|---|
| 1 / Q01 | 종료 기록을 누가 보고 얼마나 남길까? | 본인 참가 판+권한 있는 운영자, 30일 / 같은 범위90일 / 승인회원 공개 | 본인 참가 판+필요한 운영자만,30일 후 삭제. 최소 기록 목적·관리량에 맞음. 탈퇴 시 계정 식별 연결 제거, 다른 참가자의 판 상태는 기간까지 보존 제안. 법정 기간 주장 아님 |
| 2 / Q02 | DB 자체가 망가지면 최근 종료 기록 손실과 수동 복구를 어느 정도 허용할까? | 일1회 외부 백업·목표RPO24시간, 발견 후24시간 내 수동 복구 목표 / 확정 기록 손실 불허, 더 강한 백업 견적 필요 | 첫 안을 비용 평가 기준으로 추천. 실제 백업 실패 시24시간을 넘을 수 있어 보장 전 백업 감시·복구 연습 필요. 서버 crash에서 확정 기록 유지 의무는 그대로 |
| 3 / Q03 | 첫 협동게임의 반응·복구 목표를 §4 수치로 검증할까? | p95 250ms/p99 500ms·재연결5초 후보 / 더 빠른 목표 필요 / 실측 후 선택 | 첫 안을 최초 검증 목표로 추천. 이동·장치 조작에 맞춘 출발점이고, 실제 지원 확정이나 자동 하향 승인 아님 |
| 4 / Q04 | 한 사람의 권한 확인이 끊기면 함께 잠시 멈출까? | 해당 판 pause,60초 안 복구 실패 시 중단 후보 / 해당 사용자 격리·나머지 진행 | 협동 첫 Probe는 pause 후 중단 후보 추천. 확인 불가 순간부터 새 C/P는 차단하며60초 동안 권한을 유지하지 않음. 단순 네트워크 단절과 명확한 탈퇴는 별도 lifecycle |
| 5 / Q05 | 첫 공개 때 모바일 참여를 필수로 할까? | 기본 이동·상호작용·준비·종료·재접속까지 필수, 연출 축소 허용 / PC 검증 먼저, 모바일 지원 확정은 후속 | 기본 참여 필수안을 추천. 원래 참여 의도를 충족하되 PC와 같은 연출까지 약속하지 않음. 실기기 성능 미달이면 사용자에게 범위 재검토, 임의 제외 금지 |
| 6 / Q06 | 현재 요금·사용량 자료를 어떻게 확보할까? | 기존 Supabase plan/region/사용량을 알려주거나 read-only 확인 허용 / 모르면 미정 유지 후 확인 | 실제 plan·region·egress/DB 잔여량 확인 우선. 비밀키 불필요. 월 게임활동은 주간 예상 이용시간만 알려줘도 견적에 도움; 미정이면 envelope 유지 |

Q01 추가 조건: “탈퇴 시 연결 제거”가 재식별 불가능한 완전 익명화를 보장하는 것은 아니다. backup 속 식별정보 만료·복원 시 삭제 재적용·운영 로그 보존을 포함한 정책을 설계해야 하며, Q02의 백업 보존7일 후보와 함께 검토한다. 30일 운영 DB 삭제와 백업 즉시 삭제를 혼동하지 않는다.

Q02의 RTO는 장애 발생 자동 감지/24시간 상시 대응 SLA가 아니다. “발견 후” 기산점과 대응 가능 시간은 운영 지침에서 명시한다. 최근 종료 기록 소실 허용은 아직 사용자가 선택하지 않았으므로 지금 RPO24h를 확정하지 않는다.

Q04의 pause가 종료 기록 저장 등 안전한 내부 정리 작업까지 차단하는 것은 아니다. 해당 사용자 또는 전체 DB 권한 근거가 없을 때 새 보호 출력/명령을 허용하지 않으며, 다른 판에 장애를 전역 전파하지 않는다.

## 7. 게이트·증거·다음 담당

| 게이트 | 현재 상태 | 남은 결정 | 필요한 증거 | 다음 담당 작업 |
|---|---|---|---|---|
| G01 | PARTIAL/OPEN | Q03·Q05, 기준 실기기·손상망 허용 범위 | §4 기준에 대한 실제 PC/모바일·100명 부하·복구 결과 | 사용자 제품 목표 선택 → Sol 시험 명세/자료 준비 → Astra 판정 |
| G02 | PARTIAL/OPEN | Q04, SDK 및 queue/retry 수치 후보 채택 | cut/revoke·quiet loss·역순/중복·재접속·ST4A T01~03 trace | Sol 명세/소스 근거 수집 → Astra 모델 정합 판단; 실행은 별도 허용 단계 |
| G03 | OPEN/BLOCKING | 외부 C/P와 관리형 Auth writer 포함 gate 구체안 | R01~10 운영 writer inventory, 실제 C/P/R 경합·partition·old owner 증거 | Sol 운영 정의·공식 지원 근거 수집 → Astra adapter 설계 판단. 사용자에게 알고리즘 선택 전가 금지 |
| G04 | PARTIAL/OPEN | Q01·Q02, 저장 위치·backup·delete 처리 | start/terminal CAS·ack loss·crash·복원·retention·탈퇴 검증 | 사용자 정책 선택 → Astra 내구성/fence 판단 → Sol 검증 명세 |
| G05 | PARTIAL/OPEN | Q06, C1~5/런타임 버전·region·월부하 | SKU 실견적·환전/세금·egress/CPU/메모리·과금 억제·복구 연습 | Sol 가격/계정/부하 근거 → Astra 최종 조합·예산 적합 판단 |
| G06 | SCOPED_DESIGN_RESOLVED 유지 | 두 Probe 외 확장 시 별도 검토 | 기존 재대결/종료/solo 범위의 회귀 oracle; 실제 지원은 미검증 | Sol 정식반영 요청 시 범위 보존 → Astra 재감사 |

문서에서 조건을 결정한 사실과 실행 증거를 확보한 사실을 분리한다. 문서/산식 PASS로 G03 또는 실제 지원을 닫지 않는다. STEP4B 전체 완료·구현 HOLD 유지. 모델 역할은 작업 성격 분류이며 이번 별도 Astra 인스턴스/독립 감사 실행 인증이 아니다.

## 8. 실행 증거 인수 목록 — 이번 NOT_RUN

| 증거 ID | 필수 반례·성공 조건 | 관련 |
|---|---|---|
| E01 | 각 R01~10 경로를 C 전/후·P 전/후에 주입, R 뒤 불허 C/P 0 | G03 / H05~06 |
| E02 | DB true 응답 뒤 await·app queue·socket 직전 철회, delayed grant/ack 재사용 차단 | G03 |
| E03 | Auth API 직접 global/local/others·만료·계정삭제와 동시 보호 연산, scope 외 정상 session 유지 | G03 |
| E04 | DB↔서버 partition, 서버 process pause/resume, revoke event 유실; 새 C/P 차단 | G03/G02 |
| E05 | C 완료·ack 유실·logout 후 같은 ID 재시도, mutation once 및 private read 거부 | G02/G03 |
| E06 | snapshot cut 중 revoke/view 교체, last event 유실, A→B→A·dispose 후 모든 완료 경로 | G02 / STEP4A |
| E07 | start commit 전/후 crash, terminal commit 전/후 crash·ack 유실, completed 보존 | G04 |
| E08 | old/new owner 동시 complete/abort, 하나의 terminal만 성공, old WSS 차단 별도 | G03/G04 |
| E09 | 다른 사람 판 직접 조회·Data API 우회·오류 payload·private 없는 snapshot whitelist | G03/G04 / DB11 |
| E10 | 보존 만료·탈퇴·backup restore 후 삭제 재적용, 오래된 retry로 기록 부활 없음 | G04 |
| E11 | 100사용자/8명, 분산방·중복탭·reconnect storm, gate 비용·지연·CPU credit·메모리 실측 | G01/G05 |
| E12 | 월 비용 산식에 실제 meter 대입, backup 복원·DB불가 상태·예산 초과 사전 절차 | G04/G05 |

H번호 기존 정의는 원문이 우선하며 E번호는 이번 추가 추적용이다. 실행을 위한 신규 runtime을 이번 문서와 함께 만들지 않는다. 설계 근거만으로 해소할 수 없는 항목은 차단 상태로 남기고, 별도 허용된 검증 범위를 먼저 정한다. STEP6 동결 전 공통 runtime 구현 금지 조건을 우회하지 않는다.

다음 첫 작업은 Q01~06 사용자 정책/자료 확인과 G03 외부 C/P·Auth 지원 경계의 후속 범위 지정이다. 정식 산출물 반영·구현·STEP5A·병합·main 반영 없이 원격 제출 후 정지한다.

