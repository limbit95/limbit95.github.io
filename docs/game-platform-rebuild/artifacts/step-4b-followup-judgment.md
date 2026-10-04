# STEP4B — 사용자 결정 기반 G01~06 후속 설계 판단

상태: FOLLOWUP_JUDGMENT_SUBMITTED / STEP4B IN_PROGRESS / 전체 해소 HOLD. 2026-10-04. 이번은 후속 판단과 기록 제출이며 정식6문서 반영·새 사후 감사·구현 승인이 아니다. Work 역할로 수행했으며 별도 Astra 모델 실행을 인증하지 않는다.

## 0. 입력·선보존·판단 범위

PR412 시작 HEAD `9ff96e8515e8a43d3945ef1fae62777f9282bed4`, integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`, CP0050을 실제 원격과 대조했다. 기존 branch와 Draft PR을 유지했다. [사용자 결정](step-4b-user-decisions.md)을 먼저 commit `244fc33a3b58765821a15aa831ecd0ed1f7b645f`로 보존하고 3파일 exact read-back을 확인한 뒤 판단했다.

원래 [J01~13 판단](step-4b-astra-judgment.md) 입력 `ddfa7a5e226fe0c5f62779a19b708ca0802899ce`, 정식/감사 대상 `d2819c02db31f8b4f426d99b8a26c02e622ac46f`, [CP0049](../checkpoints/CP-0049-step-4b-post-audit.md)의 문서 PASS/전체 HOLD를 과거 이력으로 보존한다. Sol5.6 조사 원본·기존 판단·정식 문서·감사 결론을 재작성하지 않는다. 후속 선택은 이 문서에만 기록하며 정식 반영은 별도 허용을 기다린다.

출처 구분: 사용자 경험/상한은 사용자 결정 기록, 현행 의무는 아래 저장소 원문, 제품 사실은 [F01~10 공식 근거](step-4b-followup-sources-cost.md), 프로토콜·비용 산식은 이번 설계 판단이다. SDK 실제 설치/서버 계정/지역/실제 요금·production 권한·부하 실험은 미확인이다. 조사 원본 수신이나 vendor 문서에 기능이 있다는 사실을 지원 완료로 전환하지 않는다.

이번에 원문 대조한 저장소 근거(시작 HEAD 고정, 부분 자료132파일 blob 일치):

- [계획1.3](../../../game_platform_vnext_final_execution_plan.md) §2 최소Core/안전성, §3 계승표, STEP4B·7D·9A/9B, 말미 개정 비교표.
- [현행 개발규칙](../../game-platform-development-rules.md) §10B (583~621), [DB 계약](../../game-platform-db-test-contract.md) 최소11시나리오·Data API (15~44).
- [STEP2 장르 규칙](step-2-genre-rule-index.md) S2-R03 (104~125), [STEP4A 수명](step-4a-lifetime-contract.md) §5~8 (10~91).
- J01~13 전체와 G/H표, [요구 검토](step-4b-requirements-review.md)의 고정11구간. 기존 구현은 이력 trace B24 저장 duplicate 응답/멤버 확인 순서, B30/31 auth cache, B32 승인 helper의 한계를 참고하되 현행 운영 취약점 재현으로 주장하지 않는다.

## 1. G01 — 품질 목표 구체화

**확정된 사용자 목표:** 로비·관전자·플레이어 합계100명, 한 판 최대8명, PC 우선 작은2D 이동/상호작용 협동, 일시 단절 현재 상태 복원, 서버 장애 미완료 판 중단/재시작 허용, 게임 증분 전체 세금 포함 월3만원, 직접 운영. 모바일 필수 범위·주 지역·월 점유시간·운영 대응시간은 미정이다.

100명은 사람 기준 요구다. 구현 자원은 authenticated user/session/socket/활성 simulation 수를 별도 계량해야 한다. 중복 탭이 socket 부하를 늘릴 수 있으므로 100명=100소켓으로 지원을 선언하지 않는다. 초기 시험에서는 100사용자/100socket 기본과 중복 탭·reconnect 겹침을 별도 시험하고, 같은 사용자 동시 조작권 정책·connection 상한은 승인 전 미정이다. 13방은 채운 경우의 예시이며 1인방/빈방을 고려한 실제 방 상한은 별도 결정한다.

| 품질 항목 | 구체 측정/합격 의미 | 수치 상태 |
|---|---|---|
| 입력/표현 | 입력→local 표시와 입력→서버 확정→다른 client 표시를 분리, p50/p95/p99·최대 정지 측정 | latency 합격선 미정; 지역/기기 확인 없이 확정 금지 |
| simulation/송신 | tick 간격/누락·서버 queue·수신자별 bytes·CPU/RAM·빈방 비용 | 10/20Hz·256/1,024B는 비용/시험 envelope 제안, 승인 품질 목표 아님 |
| 복원 | 연결 성공 이후 현재 authorized snapshot 채택까지 시간; quiet 마지막 유실 포함 | 복구 제한시간/재시도 횟수·queue bytes 임계값 구현 전 결정 |
| stale/단절 표시 | 마지막 확인 이후 age가 임계 초과하면 정상으로 표시하지 않고 입력/확정 소비를 제한; 명시 재시도/실패 | staleness 허용 시간 미정, 무한 정상 표시 금지 |
| 장애 | 미완료 판 중단 사실 표시·중복 결과 없음·사용자 재시작 경로 | 서비스 RTO/운영 대응시간 미정, HA 약속 없음 |
| 기기 | PC 키보드/포인터·실제2client 검증, foreground/background·탭 이동 검증 | 모바일 touch/작은화면 필수 목록 후속 검토, 지원 인증 없음 |
| 비용 | 월 증분 총액·일별 egress/연결시간/요금 예측·retry 폭주 감시 | 30,000원 확정 상한, 부하 수치는 민감도 가정 |

추천하는 다음 품질 결정 방법은 선택 지역의 실제 PC 기준선에서 체감·지연을 측정하고 그 결과로 사용자에게 허용 지연/재연결 대기 시간을 제안하는 것이다. 이번 구현 금지이므로 측정을 수행하지 않았다. 측정 전 설계용 잠정값이 필요하면 별도로 제안/승인하고 SLA처럼 쓰지 않는다. **G01 PARTIAL/OPEN**: 경험·규모·비용·장애 의미는 해소했으나 측정 가능한 수치 합격선은 미해소다.

## 2. G06 — 규칙 적용과 동등 안전성

Probe1은 same context→ready→host start를 선택했으므로 현행 §10B와 직접 충돌하지 않는다. ready는 새 판마다 초기화하며 준비 완료·최소 인원·권한을 server가 검증한다. 이탈/방장 승계·재접속 중 준비 상태도 권위 상태에 포함한다. 정상 재대결에서 새 방/초대코드 재입력을 강제하지 않는다. 서버 장애로 참여 맥락을 잃는 비정상 재시작은 사용자 허용 장애 정책이며 정상 재대결 의무의 면제가 아니다.

Probe2는 local solo/no server records이므로 multiplayer ready/host/room, 서버 재연결·서버 결과 보존은 해당 없음이다. 실행 수명·늦은 callback·명시 종료·문서/디자인·Registry/사이트 진입 정책은 여전히 적용한다. fake Room을 만들지 않는다. local 상태를 공식 서버 기록/랭킹으로 승격하지 않는다. 사이트 접근 제한과 local gameplay authority는 분리한다.

| 현행 11의 의미 | Probe1 비DB 대응 / 시험 oracle | Probe2 |
|---|---|---|
| 1 익명 거부 | server join/action/read 거부 | 보호된 사이트 진입은 유지; 온라인 세션 N/A |
| 2 미승인 거부 | 현재 승인 확인, token만으로 통과 금지 | 사이트 정책 동일; local server session N/A |
| 3 허용 진입 | 승인+게임 정책+정원/참여 검증 | local 시작 수명 유효성 |
| 4 비회원 snapshot 거부 | projection release 시 현재 room/view 권한 | 서버 snapshot 없음 |
| 5 시작 권한 | host/ready/인원·상태 확인 후 한 번 시작 | local 의사에 따른 시작 |
| 6 오래된 명령 | match/owner/actor 순서 범위를 벗어난 입력 거부; SQL expected_version 강제 아님 | 이전 run 명령 채택 금지 |
| 7 중복 | action identity로 mutation once; 현재 권한으로 재조회 | 반복 effect/완료 중복 방지 |
| 8 충돌 | 단일 owner의 순서에서 하나의 결정, durable 효과는 fenced commit | local 권위 내 단일 결과 |
| 9 복원 | 새 연결 재인가 후 현재 snapshot, 옛 callback 격리 | server reconnect N/A; refresh 보존 약속 없음 |
| 10 재대결 | 기존 참여 맥락·준비/host/초기화·재연결 모두 server 검증 | multiplayer rematch N/A; 새 run 수명 |
| 11 private | 다른 사람 비공개 정보 제외, private 없는 경우도 projection whitelist 검사 | 타인 서버정보 없음 명시 검증; local 비밀=보안 경계 아님 |

**G06 SCOPED_DESIGN_RESOLVED (두 Probe 적용 판단에 한정)**. 상위규칙 개정 없이 표현 가능한 범위를 구체화했다. 정식 반영/검토와 실제11대응 시험은 미완료다. 미래 roomless multiplayer/hostless rematch/async 기록형은 이 해소에 포함되지 않으며 요구가 추가되면 G06 재개 및 필요 시 STEP2/Architecture Change·Registry 전수 영향 감사로 돌아간다. 기존/신규 보드게임 의무나 기존 게임 무이관을 약화하지 않는다.

## 3. G02 — 동기화·복구

**선택 방향:** Probe1은 신뢰 서버가 현재 match state와 입력 순서를 소유하며 WSS로 입력/authorized projection을 전달한다. 클라이언트 예측은 임시 표현이고 공식 결과·보상·효과를 확정하지 않는다. 모든 게임에 stream/tick을 강제하지 않고 기존 DB snapshot 모델과 병존한다. Probe2는 local 권위이며 network dependency를 넣지 않는다.

**후속 프로토콜 설계안(구체 wire API 동결 아님):**

1. 새 tracking에서 token/현재 권한을 확인하고 server owner queue 안에서 join/view 전환을 직렬화한다. snapshot cut n을 고정하고 같은 owner가 이후 n+1 업데이트를 순서대로 송신한다. snapshot보다 뒤 업데이트가 앞서 도착할 수 있는 adapter라면 bounded buffer 뒤 연결하거나 full snapshot으로 재시작한다.
2. client는 owner/session/match/view/현재 실행의 적용 범위를 확인한 후 cut을 채택한다. 범위가 바뀌면 이전 delta·명령·private cache를 재사용하지 않는다. delta는 기준 revision 일치가 전제다. 동일 revision 자체는 현재 viewer 허가 증거가 아니다.
3. gap/역순/overflow는 잘못된 delta 적용 대신 새 authorized full snapshot으로 복구한다. 중복 revision/명령은 중복 효과를 만들지 않는다. 안정된 연결의 frame 순서와 reconnect 전후 application 순서는 별도다.
4. 다음 업데이트가 오지 않는 마지막 유실/정지에도 server revision 확인 heartbeat 또는 주기적 authorized reconciliation으로 stale을 발견한다. heartbeat의 ping/pong만으로 상태 최신성을 인증하지 않는다. 제한시간 경과 시 degraded/failed로 전환하고 무한 resync하지 않는다.
5. 재연결은 현재 match가 살아 있고 권한이 유효하면 현재 상태로 복귀한다. 종료/서버 restart/자리 상실이면 현재 terminal 또는 재시작 안내로 귀결한다. 연결 open을 복구 성공으로 표시하지 않는다. 같은 command 재시도는 mutation once와 현재 응답 권한을 각각 검증한다.

DB/RPC 모델은 기존 J03을 유지한다. F05 준비 신호만으로 atomic snapshot cut을 가정하지 않고 version+invalidation+독립 reconciliation으로 quiet loss를 검출한다. Supabase Realtime를 Probe1 고빈도 gameplay authority로 사용하지 않는다.

**G02 PARTIAL/OPEN**: handoff/quiet loss/overflow 처리 의미를 선택했지만 제품/SDK version·실제 readiness·queue/timeout 한계가 미정이다. 구현 전 packet schema와 sequence scope, snapshot cut oracle, retry/dedupe 보존 범위, 실패 상태를 고정하고 H01~04/H08의 race 실험계획을 승인해야 한다. 실행 후 목표 내 복구 증거가 있어야 지원 PASS다.

## 4. G03 — 권한·private·사이트

Site Adapter는 identity/승인회원/프로필과 invite를 연결하고 서버가 실제 권한을 집행한다. Registry 표시는 권한 근거가 아니다. nickname은 site profile 출처를 사용하며 invite resolve 성공 후에도 join 현재 인가를 다시 한다. browser에 service credential을 주지 않는다. DB privilege/RLS/RPC 내부검사는 각각 검토한다.

**선택:** JWT 서명/issuer/audience/expiry/subject/session 검증 + 현재 사이트 승인 + 현재 match membership/role을 분리한다. 서명키 유형/회전/cache를 실제 프로젝트에서 확인해야 하며 JWKS 존재를 무조건 가정하지 않는다(F09). Nakama custom auth를 쓴다면 arbitrary user ID를 신뢰하거나 Nakama 발급 session만으로 Supabase 승인 철회를 대신하지 않는다. bridge token의 대상/짧은 수명/재사용/서버 검증 방식은 별도 고정 대상이다.

**철회 경계 판단:** 서버 owner 내부의 leave/role change는 동일 queue에서 직렬화하고 그 경계 이후 queued command·snapshot release·stored duplicate response를 현재 권한으로 다시 검사한다. 먼저 commit된 유효 명령과 그 뒤 전달되는 응답의 공개 권한은 별개다. 이미 정당하게 전달한 비밀을 회수할 수 있다고 약속하지 않는다. client는 인지 즉시 private 표시/cache/후속 effect를 무효화하고 await 뒤 성공/error/null/finally도 재검사한다.

사이트 DB 승인철회와 외부 simulation owner 사이에는 아직 하나의 직렬화 경계가 없다. **TTL/JWT 만료/클라이언트 협조만으로 그 공백을 해소했다고 판단하지 않는다.** 비교안 A는 권한 gate를 거치는 서버 commit/release와 철회를 같은 권위 경계에서 직렬화; B는 명시적 authorization epoch/lease와 owner ack·partition fail-closed를 갖춘 bridge다. A는 고빈도 DB 부하, B는 기존 사이트 변경 범위/철회 완료 의미가 부담이다. 둘 다 실제 설계/성능·현행 의무 대조 증거가 부족하여 이번 최종 선택 HOLD. 배포나 권한 캐시 완화로 대신하지 않는다.

로그아웃 시 로컬 무효화만으로 공격자의 유효 access token을 즉시 무효화했다고 쓰지 않는다. F09 session 조회 등 현재 정책에 맞는 server 증거가 필요하며 확인 실패 시 새로운 보호 join/action/read/release는 fail-closed한다. 이미 진행 중인 물리 송신과 검증 뒤 await 경합은 H05/06의 oracle로 명시해야 한다.

Probe1에서 숨겨진 gameplay 정보를 아직 요구하지 않았더라도 현재 projection의 비공개 필드 부재를 검사해야 한다. 승인회원/방멤버 정보 자체도 보호 대상이다. **private stream은 recipient별 현재권한 fence가 입증되기 전 선택 금지**. F04 channel cache가 즉시 철회를 보장하지 않으므로 기존 Broadcast private 채널만으로 대체하지 않는다.

**G03 OPEN/BLOCKING**: auth bridge·사이트 철회·owner 권한 경계의 구현 가능한 일관성 설계 선택이 남았다. 필요한 추가 증거는 실제 승인 변경 경로/세션 검증·키 구성, 최소 권한 DB 호출 비용, in-flight/partition/duplicate-response 경합의 증명이다. 사용자에게 보안 약화를 선택시키는 질문으로 넘기지 않는다.

## 5. G04 — 영속성·owner

**선택한 실패 의미:** Probe1의 진행 상태는 owner 메모리 권위로 둘 수 있으며 해당 프로세스가 살아 있을 때 일시 단절 복원한다. server crash 때 미완료 판의 진행 소실·중단/재시작은 허용된다. 이는 graceful drain 저장 성공이나 current snapshot 존재를 crash 복구 지원으로 잘못 읽던 위험을 제거한다. 진행 중 판의 crash-RPO는 그 판 진행 전체 소실 허용이며 서비스 RTO는 아직 미정이다.

정상 terminal 결과와 durable 기록 확정은 구별한다. 서버 DB가 commit한 결과는 동일 result identity로 중복 확정/소비하지 않고 timeout 뒤 조회로 확인한다. 저장을 하지 않는 결과는 세션 한정으로 표시하며 저장완료/영구 통계/보상으로 제시하지 않는다. Probe1에서 어떤 결과를 영속 보존할지는 여전히 미정이므로 **서버 장애 허용을 근거로 이미 확정한 기록을 버리지 않는다**. Probe2는 사용자 결정대로 서버 기록 없음; local 저장도 별도 제품 약속 없으며 새로 약속하지 않는다.

owner 판단: 단일 서버 배포 후보에서는 동시에 둘이 같은 match를 서비스하지 않도록 restart/drain 경계를 둔다. 새 boot/owner는 이전 match 입력·resume·effect를 수용하지 않는다. 단순 랜덤 boot ID는 client 혼동 방지 수단일 뿐 DB 쓰기 fencing의 대체물이 아니다. 영속 쓰기가 있으면 저장소가 현재 owner epoch/lease를 원자적으로 확인한 commit만 받아야 한다. 네트워크로 고립된 old owner가 살아 있는데 새 owner를 무조건 승격하면 split brain이므로, fencing 증거 없이 자동 failover를 선택하지 않는다.

**G04 PARTIAL/OPEN**: 미완료 판 소실 정책은 해소. 세션/ready context 보존기간·reconnect grace, terminal 결과 보존 범위/retention, lease/fencing 방식과 서비스 복구시간은 미해소. 단일 인스턴스 장애 허용이 보호된 결과의 저장 무결성을 면제하지 않는다. H07 crash-before/after-commit·ack loss·old owner late write·drain 실패를 구현 전 계획하고 실제 증거 없이 내구성 지원으로 표시하지 않는다.

## 6. G05 — 실행 위치·transport·운영비

선택 방향은 browser 표현/입력 + 별도 신뢰 서버 simulation + WSS, static 배포와 server 권위 분리다. 단일 self-managed VM이 현재 예산/직접 운영/장애 허용에 맞는 우선 검토안이다. 관리형 HA, 다중 owner, 새 Supabase Pro 필수 전환은 지금 선택하지 않는다. 장기 repo/Pages 분리는 배포 경계 검토 대상이며 인증·초대·수명 계약이 별도 플랫폼으로 갈라지는 이유가 아니다.

| 후보 | 선택/보류 이유 | 구현 전 조건 |
|---|---|---|
| 단일 VM+WSS | 우선 방향. 고빈도 메시지를 별도 relay 과금 없이 처리하고 중단 허용 정책과 맞음 | 서버 framework/버전·OS/보안패치·region·인증 bridge·부하 및 비용 한도 결정 |
| Lightsail IPv4 $12/2GB | 가격 비교 우선 SKU 후보, 조건부 예산 여유 | G03 충족·실제100명/방 분산 부하·burst CPU/메모리·egress·현재 사이트 증분 검증; 제품 최종 채택 HOLD |
| Nakama+JavaScript | authoritative match/client 근거 있어 후보 유지 | 자체 DB/운영 메모리·사이트 identity bridge·server runtime/SDK 버전·접속복원/owner 의미 검증; 제품 선정 아님 |
| 직접 작성한 WSS server | 작은 기능 범위 대안 | 보안/인가/룸·재접속·운영을 직접 소유해야 함. 단순함/저렴함을 검증 없이 우위로 선언하지 않음 |
| Supabase Realtime 고빈도 relay | 현재 Probe 핵심 transport로 비추천 | 메시지 fanout 비용·철회 cache·simulation authority 별도 필요. 기존 저빈도 DB 모델은 유지 |
| Supabase Pro 새 가입/증액 | 장기 검토, 현 월상한에서는 조건 충돌 | F02/비용표로 재예산 승인 필요. 기존 요금 납부 여부 미확인 |

F01~03의 최신 공식 단가·가정·계산·한계는 [비용 문서](step-4b-followup-sources-cost.md)에 전부 보존했다. $12+가정20GB backup은 환율1,500/세금10% 시 월21,450원이나 다른 증분이0이고 bundle 안일 때만 해당한다. E2+20%/100h 약940GB와 E3/730h 약6.86TB의 차이 때문에 **월3만원 충족 확정은 불가**다. 승인100명/8명은 유지하며 payload/tick을 낮춰 요구를 충족한 것으로 임의 처리하지 않는다.

운영 책임은 사용자 직접 관리로 확인. 배포 재현·rollback/drain·OS/secret rotation·health/비용 경보·log 개인정보 제거·백업복원·장애 안내 절차는 필요하다. 지원 시간/RTO를 Work가 임의 약속하지 않는다. 공급자 가격 알림은 hard cap이 아니고 quota 소진 시 무단 서비스 중단도 사용자 요구로 확정되지 않았다.

**G05 PARTIAL/OPEN**: 실행/transport 방향 및 비용상 후보/제외 사유를 좁혔으나 제품/SKU/SDK/region 최종 조합·실부하/운영 견적은 미해소. STEP6에 이름만 미루지 않고 STEP4B 후속에서 이 결정을 완료해야 한다.

## 7. STEP4A 정합성·회귀와 구현 전 게이트

새 프로토콜도 alive + 현재 session/match/tracking/view 의미 + 현재 권한 + 모델 순서 + 반영 직전 재검사를 모두 만족해야 한다. A→B→A, 같은 방의 새 match, participant↔spectator, user/logout 전환에서 성공뿐 아니라 error/null/finally/cleanup/effect도 검증한다. dispose는 먼저 채택 권리를 무효화하고 독립 자원은 실패가 있어도 정리한다. 늦게 얻은 자원은 이전 owner가 해제하고 site 공유 자원은 사용권만 반환한다. 이는 stream SDK의 close/remove 성공과 별개의 의무다.

Core에 room/host/tick/auth authority를 추가하지 않았다. 기존 게임/규칙/코드 무이관·DB11의 의미·사이트 승인 의무를 보존한다. G06 범위 내에는 새 상위규칙 변경 필요를 발견하지 않았으나 G03 해결안이 사이트/현행 계약 변경을 요구하면 영향 범위와 Architecture Change를 먼저 검토해야 한다. 비용을 이유로 현행 철회 의무를 바꾸지 않는다.

| 게이트 | 이번 해소 여부 | 남은 증거·구현 전 조건 |
|---|---|---|
| G01 | PARTIAL/OPEN | 지역/기기 기준·지연/staleness/복구 숫자·socket/방/입력 envelope 승인 |
| G06 | SCOPED_DESIGN_RESOLVED, 전체 장르 해소 아님 | 정식반영/검토, 두 Probe 11대응·재대결 구현 증거; hostless/async 추가 시 재개 |
| G02 | PARTIAL/OPEN | 제품 SDK/version·snapshot cut/queue/timeout·H01~04/08 계획 고정 |
| G03 | OPEN/BLOCKING | site revoke↔server commit/release 일관성 선택·private fence·H05/06; 실패 시 private 채택 금지 |
| G04 | PARTIAL/OPEN | 결과 보존·owner fence·grace/retention/RTO·H07; 확정 데이터 소실 허용 금지 |
| G05 | PARTIAL/OPEN | 최종 SKU/framework/SDK/region·운영 및 세금포함 견적·H09, 무근거 월비용 PASS 금지 |

H01~10을 삭제하지 않는다. G06의 좁은 적용 판단과 나머지 partial 진전이 전체 gate 해소/STEP4B 승인/실행 지원을 의미하지 않는다. 설계 gate를 닫을 조건과 승인된 구현 단계에서 실제 시험을 통과할 조건을 구별한다. **전체 STEP4B 완료·구현 착수 HOLD**.

## 8. 다음에 필요한 사용자 입력과 기술 후속

이번 확인 질문으로 총접속 범위/총추가비/직접 운영은 답을 받았고 모바일 필수 범위·지역/월 부하는 모름으로 보존했다. 같은 질문을 반복하지 않는다. 다음 사용자 결정은 다음 순서로 좁힌다.

1. 테스트 참여자의 주 지역과 PC 환경이 확인되면 지연/복구 목표를 제안할 수 있다. 모르면 지역을 임의 확정하지 않고 후보 지역 RTT/운영 견적 검토 계획을 먼저 만든다.
2. Probe1 종료 결과를 나중에 다시 볼 서버 기록으로 남길지, 해당 세션 결과 표시로 충분할지는 미정이다. 추천은 통계/보상까지 확대하지 않고 필요한 최소 종료 기록 범위를 명시하는 것. 영속 기록 선택 시 보존기간·정정·접근과 비용을 함께 결정한다. Probe2 no-server-record 결정에는 영향 없다.
3. 월 상한 초과가 예상될 때 신규 판 접수 제한/운영 시간 제한을 허용할지 또는 예산을 조정할지는 **실제 견적이 충돌할 때** 선택한다. 아직 자동 제한 승인으로 기록하지 않는다.

Work가 먼저 해소할 기술 항목은 G03 bridge/철회 경계 두 안의 설계·부하 비교, G02/04 protocol과 owner/결과 계약, 그에 맞는 G05 제품/version/SKU 조합이다. 모바일을 필수로 확대하거나 성능 수치를 확정할 때만 사용자 영향과 선택지를 다시 제출한다. 이번 판단을 원격 제출한 뒤 정지하며 정식 산출물 반영·구현·STEP5A·병합·main은 진행하지 않는다.
