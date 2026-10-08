# STEP 4B — 실행 위치·transport·운영 선택과 보류

## CP0075 현재 적용 — 설계 종료와 실행 의무

J10/11의 제품·배치·품질·비용·보존·운영 선택은 CP0074 그대로다. D0010은 같은 transaction의 늦은 C만 수용하며, 새 A와 P의5초 차단·known expiry·실패 즉시 차단·최초60초·기존 owner/중복/삭제 보호를 유지한다.

J12의 현재 상태는 [결정/설계 종료 확인](step-4b-z1-decision-and-design-closeout.md) §4의 설계/실행/오픈 표를 따른다. G01~04 설계 산출물 완료, G05 조건부 조합 명세 완료, G06 두 Probe 범위만 해소. Z1은 설계상 해소하며 실행 검증·실청구·실제 지원은 NOT_RUN/UNKNOWN이다. 전체 STEP은 계획§4.2 사용자 결과 검토 때문에 REVIEW_PENDING이다.

J13/T01~03은 실제 R→A 차단과 동일 transaction A→C 지연을 구분한다. T04~10은 새 P·retry·owner·중단 보호를 유지한다. T11~14/B01~07은 기존 기준을 유지한다. 정확한 현재 delta는 위 문서§3이다. 계정/비용·성능·복구·삭제 오픈 blocker를 문서 완료로 해소하지 않는다. 다음 작업은 사용자 결과 검토·승인 하나다. 이하 CP0074의 Z1 HOLD/사용자 정책 결정 대기는 당시 이력이다.

## CP0074 현재 적용 — J10~13 선택과 종료 조건

[구체 설계](step-4b-design-finalization.md) §4~7 및 [가격/지원 근거](step-4b-design-finalization-evidence.md)를 적용한다. 아래의 수치/제품 미정 표는 가이드3 당시 이력이다.

J10 선택: Supabase Free 서울 + Lightsail Linux IPv4 2GB 서울 + 단일 Linux/OpenSSL memory BIO 송신 gate + DynamoDB Standard provisioned 서울의 분리 archive/current 원천. EventBridge Scheduler→Lambda가 cut/검증/retry/독립 감시, SNS가 경보를 담당한다. 구매/배포/무료 계정 잔여 확인은 미수행이다. 제품명이 실제 권한/성능/복구 지원 증거는 아니다.

J11 기준: 총접속100명·판8명, 원격 참여자의 권위 화면까지 p95 250ms, 정상망 회복 후 각 재연결5초, 모바일 이동/상호작용/준비/종료/재접속, 세금 포함 월추가30,000원. p99/tick/queue/표본은 추가 승인 기준으로 만들지 않는다. 본인 참가/필요 운영자 열람·최초종결+30일삭제·탈퇴unlink·daily외부/RPO24h·발견후24h·최근7일복구점/삭제우선·기존 운영시간을 유지한다.

비용은 DB gate/gameplay/Realtime/backup반출/archive/검증·복원/감시·운영을 분리한다. VM$12와 별도 비용의 원화 합계가3만원 안이어야 하며, 환율1400/1500/1600·세금10%는 가정이다. DynamoDB 무료 잔여·기존 사이트/계정 소비·실청구는 UNKNOWN, uncached/cached 무료 한도 합산 금지다. 한도 때문에 정상 목표 부하를 제한해야 하면 목표 충족이 아니다.

J12 상태:

| 게이트 | 설계 | 실행/오픈 |
|---|---|---|
| G01 | 기준·배치 연결, G03/G04 의존 | 품질/100명/모바일 NOT_RUN |
| G02 | snapshot/reconnect/owner/60초·B5 처리 결정 | 경합/복구 NOT_RUN |
| G03 | S-A/송신 수단 선택, Z1 실제 C deadline HOLD | 권한/철회 NOT_RUN |
| G04 | archive/삭제/restore 수단·동시저장불능 closed 선택 | 삭제/복원/RPO/RTO NOT_RUN |
| G05 | 제품·비용 성립 조건 선택 | 계정 견적/총비용/운영 측정 미완료 |
| G06 | 두 Probe만 SCOPED_DESIGN_RESOLVED | 범용 지원/실행 승인 없음 |

J13은 구체 설계§6의 T01~14/B01~07 delta를 적용한다. 실제R·PGcommit C·transport P·clock 오차/전체 trace를 관측한다. FAIL/INCONCLUSIVE/ACCEPTED_LIMITATION은 구분하며 마지막 것을 PASS로 집계하지 않는다. 정식 문서 검사나 CI는 행동 증거가 아니다. STEP4B IN_PROGRESS, Z1이 해소되기 전 설계 종료 불가. 다음은 Z1의 실제 보장 범위에 대한 사용자 결정이며 같은 조사 cycle을 기본 지정하지 않는다.

## 최초 정식 반영 이력 — 이하 원문 보존

- 상태: **정식 STEP4B 제출 산출물 / 사후 감사 대기 / STEP4B IN_PROGRESS**. 가이드4 반영이며 사용자 승인·현행 CURRENT rulebook 변경·Target 동결·구현 지원 완료가 아니다.
- 고정 입력: [Astra 판단 원문](https://github.com/limbit95/limbit95.github.io/blob/ddfa7a5e226fe0c5f62779a19b708ca0802899ce/docs/game-platform-rebuild/artifacts/step-4b-astra-judgment.md), commit `ddfa7a5e226fe0c5f62779a19b708ca0802899ce`, blob `bd4c5b4991921c17d74bd99ef275819e4ae046f5`.
- Work Sol은 아래 판단 본문 전체를 그대로 옮겼다. 선택·보류·사유·조건·미확인·후속 책임을 축약하거나 새로운 선택으로 바꾸지 않았다. J번호는 판단 절, B번호는 [저장소 근거](step-4b-source-trace.md), V번호는 [기존 선택 원문 검토](step-4b-research-verification.md)다.
- [전체 반영 trace](step-4b-contract-source-trace.md), [미결정·충돌·후속](step-4b-risks-and-followup.md), [정식 제출 검증](step-4b-validation.md)을 함께 읽는다. 다른 절 연결은 [모델 품질](step-4b-runtime-sync-contract.md)·[권한/사이트](step-4b-security-site-contract.md)·[실행/운영](step-4b-execution-operations-decisions.md)에서 찾는다.
- 본문의 “이번 판단/미수행/후속 STEP4B”, “정식 반영 필요”는 가이드3 작성 시점의 판단·조건으로 보존했다. 이번 완료는 **가이드4 문서 반영**뿐이다. G01~06은 미해소이며 모델/제품 지원 PASS, STEP4B 전체 완료 또는 후속 구현 허용으로 승격하지 않는다.
- 공식 원문 확인/가격은 가이드3 확인 이력의 재사용이다. 이번 새 browsing·견적·배포·runtime/DB 검증은 수행하지 않았다. 구현 전 제품/가격/버전 확인 조건을 유지한다.

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

