# STEP4B — 백업·복원·삭제 명세와 비용 조건

2026-10-05 조회, CP0058 고정 입력. **SPEC_PREPARED / backup job·dump·복원·삭제 시험 NOT_RUN**. 핵심 알고리즘 선택은 Astra 후속 판단. [지원·운영 근거](step-4b-support-readonly-evidence.md)·[시험 T01~14](step-4b-verification-specification.md). 운영 metadata SELECT와 실제 백업/복구 지원 증거를 구분한다.

## 공식 도구 범위와 복구 계약

[Supabase CLI dump](https://supabase.com/docs/reference/cli/supabase-db-dump)는 기본 schema dump에서 auth/storage/extension 관리 schema를 제외하고, data/roles는 각각 별도 옵션이다. [restore 안내](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore)는 schema/data/roles와 관리 schema 변경의 별도 확인을 요구한다. 대상 프로젝트의 default privileges가 복원 ACL을 확대할 수 있으므로 복원 뒤 재검증해야 한다. [DB backup](https://supabase.com/docs/guides/platform/backups)은 Storage의 실제 object를 포함하지 않는다. CLI 호출 여러 개가 하나의 snapshot이라고 보장하지 않는다. [PG17 pg_dump](https://www.postgresql.org/docs/17/app-pgdump.html)의 consistent snapshot 지원은 DB dump 경계에 대한 사실이며 Auth 외부 session 처리·Storage bytes까지 원자적으로 묶는 보장은 아니다.

| ID | 준비 명세·합격 조건 | 미확인·후속 담당 |
|---|---|---|
| B01 복구점 | manifest에 권위 consistent cut tcut, transfer complete ttransfer, checksum/복원검증 완료 tvalidated를 별도 저장. 서로 다른 schema/data/roles export의 동시성·referential integrity 검증. 복구점은 검증 완료 뒤에만 사용 가능 | 단일 snapshot 연결 방식/검증 비용 Astra; 실행 증거 복구 담당 |
| B02 범위 | 최소 종료 기록(match/incarnation·terminal reason/revision·최초 종결·삭제 deadline), 참가자 매핑 및 그 참조 대상, schema/RLS/GRANT/roles/extensions 포함 범위를 명시. Auth 데이터 포함 여부·관리 schema와 Storage object 별도. 이전 사용자 식별자 매핑이 누락되거나 임의 신규 계정에 재연결되면 FAIL | 최소 schema·FK/Auth 매핑 결정 Astra. 실제 artifact inventory 후속 담당 |
| B03 보존 | 최근7일 복구점과 최초 종결+30일 삭제 동시 충족. deadline 넘은 기록이 읽힐 수 있는 백업·object version·임시본에 남으면 FAIL. 7일 full dump 추가 보존 예외 없음 | 후보 방식 아래 비교; 선택 Astra |
| B04 탈퇴 | 운영 DB의 본인 식별 연결과 FK/운영 참조를 추적하여 제거. 다른 참가 최소 기록의 기존 deadline 유지. 백업/버전/임시본의 연결 제거도 재복원으로 검증; 암호화·hash만으로 삭제/익명화 완료 주장 금지 | 삭제 대상 inventory·key 분리/erasure 충분성 Astra·보안 검증 |
| B05 재생성 차단 | 삭제 완료 record/identity의 오래된 command retry·backup restore·queue replay로 재생성 금지. 삭제 원천이 복원 rollback되지 않도록 설계. suppression/tombstone 최소 정보·보존 조건은 미채택이며 무기한 개인식별 보존 승인 아님 | rollback 불가 원천과 정보 최소화 Astra |
| B06 격리 복원 | ingress/egress 차단된 새 환경 → backup manifest 검증 → schema/data/ACL 복원 → 현재 시점 삭제·탈퇴 재적용 → 새 incarnation → old owner/session 무효화 → 현재 승인·운영권한 재확인 → 기록/인가 검증 → 제한된 서비스 개방. 단계 실패 시 닫힌 상태 유지 | 현재 권한 원천·복원 Auth와 실제 logout 범위 지원 미증명. 자동 복구 완료 아님 |
| B07 계측/운영 | incident time·discovery time·담당 인지/착수·복원/검증·authorized reopen 시각·실제 RPO 기록. 목표는 발견 후24h 수동 복구, 발견까지 지연도 별도 보고. 이미 durable terminal은 서버 crash에서 보존; DB 재해의 최대24h 기록 손실 목표와 분리 | 실제 대응 요일·시간 UNKNOWN. 운영자 체크리스트/연락·보안 저장 위치 후속 운영 담당 |

RPO 목표를 검사할 때 마지막 사용 가능한 verified backup의 tcut과 장애 시점 차이를 계산한다. 단순 하루1회 job 성공 표시는 충분하지 않다. 최대 cut 간격 Δ와 검증 지연 v, 실패 재시도 여유 m을 함께 두어 Δ+v+m≤24h를 목표로 해야 한다. 24시간마다 cut인데 완료/검증 지연이 양수이면 최악 시점에 24h를 넘는다. 일정 단축·중간 추가 복구점·검증 지연 제한 후보는 Astra가 고르며 이번에 자동 job이나 새 주기를 채택하지 않는다. 한 번 실패하면 다음 날까지 기다리는 운영은 목표 위반 가능성이 크다. 실패·미전송·checksum 불일치·cut age 경고와 실제 대응 가능한 시간의 조합을 검증해야 한다.

7일 복구점 요구는 현재 권한·탈퇴/30일 삭제를 되돌릴 권한이 아니다. 과거 승인·role·session row를 복원해 곧바로 authorize하지 않는다. 현시점 권한을 증명하지 못하면 보호 입력/정보 제공 즉시 차단, pause·첫 장애60초 중단 정책을 유지한다. JWT 만료/refresh/session row 존재만으로 current authorization 검증 완료가 아니다.

| 보존 후보(미선택) | 7일 복구점·삭제 처리 | 증명/비용 부담 |
|---|---|---|
| deadline별 분리 archive와 복구 manifest | 각 복구점의 읽기 가능한 범위를 삭제 deadline에 맞춰 제거·재구성. 탈퇴 연결도 별도 제거 | FK/일관성·삭제 이후 restore의 기능·모든 object version 검증 필요 |
| 개인/기록 범위 분리 암호화와 검증된 key erasure | 복구점 metadata는 남기고 해당 식별/기록의 복호화 능력을 deadline에 제거하는 후보 | 키 사본·index/로그·메모리/임시본까지 erasure 증명 및 개인정보 최소화. 암호화 자체는 삭제 증명 아님 |
| 과거 복구점 재작성·검증 후 교체 | 7일 각각에서 만료·탈퇴 데이터를 제거한 복구점으로 교체 | 최대7개 rewrite 비용·실패 중 원본 접근·versions/backup 중복 삭제·consistent cut 의미 검증 |
| 그대로7일 full dump 유지 | 29일 된 기록이 새 dump에 포함되면 이후7일로30일 초과 가능 | 현 결정과 충돌, 채택 불가. 단순 복원 후 삭제만으로 백업 보존 문제 해소 불가 |

복구 checklist 초안: discovery와 담당 확보→기존 서버/송신/쓰기 차단 확인→최근 verified point 선택 및 RPO 기록→격리 환경·새 incarnation 준비→복원 schema/ACL/hash 확인→기한/탈퇴 삭제 재적용→현 권한·session/owner 원천 확인→T08/T10/T11 해당 증거 확보→authorized reopen 시각 기록→24h/RPO 목표 판정·후속 장애 기록. 대응시간 미정이라 24시간 상시 대응이나 현재 목표 달성을 보장하지 않는다.

## 최신 공식 무료 제한·비용 가정

2026-10-05 [Supabase pricing](https://supabase.com/pricing)·[Realtime limits](https://supabase.com/docs/guides/realtime/limits)·[AWS Lightsail pricing](https://aws.amazon.com/lightsail/pricing/)·[Seoul transfer](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-data-transfer-allowance.html)·[object storage](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-buckets.html)를 조회했다. 플랜 Free·ap-northeast-2 및 PG17.6은 연결 metadata로 확인했지만 월 quota 사용량·기존 사이트 소비·실제 계정 청구/환율은 UNKNOWN. PG17 최신 minor 공지와 실제 설치를 구분한다. [changelog](https://supabase.com/changelog)의 PG17.11 rollout 안내는 이 프로젝트 업그레이드 완료 증거가 아니다.

| 경로 | 공식 제한/단가 | 평가 조건 |
|---|---|---|
| Free DB gate | DB500MB/shared CPU·500MB RAM, uncached egress5GB/month, cached 별도5GB | 실제39,636,115-byte DB 크기는 이번 시점 현황. dump bytes·성능·잔여500MB 한도 또는 월 소비량과 같지 않음 |
| gameplay 별도 VM | IPv4 Linux 서울 후보1GB $7/2TB, 2GB $12/3TB monthly | IPv6-only $5/$10과 혼동 금지. VM 양방향 사용은 allowance에 포함, 서울 outbound 초과 $0.13/GB; ingress 자체 과금과 구분 |
| Free Realtime | 200 concurrent connections,100 events/sec,100 joins/sec,2M messages/month | 총100명이 중복탭/관리 채널로200연결 넘을 수 있음. broadcast fanout/수신 메시지 계산 필요; gameplay와 분리 |
| Free backup/Storage | 자동 DB backup 미포함,Storage1GB. Free 비활성 project1주 pause 조건 | offsite 외부 backup 필요. Storage cached allowance로 DB dump uncached를 상쇄하지 않음 |
| 외부 bucket | 5GB저장/25GB전송 $1,100GB/250GB $3 monthly | private 기본,versioning 기본off,서울 선택 가능. actualquote·모든 복구점/임시본/versions inventory 필요 |
| Pro 비교 | 기본 $25/month(일부compute credit),기본 VM/bucket 별도 | Free에서 유료 초과 구매로 같은 제한 유지된다고 가정 금지. 기본만으로 예산 충돌 가능 |

계산은 decimal GB, 30일/month와 가동 시간 h=10/100/730의 **예측 시나리오**다. usage UNKNOWN이며 실제 사용량/측정값이 아니다. wire protocol·TLS·재전송 등 별도20% 여유 후보, 실제 meter 검증 전 미확정. USDKRW 1400/1500/1600은 민감도 가정이며 현재 환율 확인값이 아니다. 세금10% 가정·카드 수수료/실청구·환율·tax는 실제 견적 확인이 필요하다.

| VM+외부 bucket 후보(제품 채택 아님) | 기본USD | 환율1400/1500/1600·세금10% KRW | 총비용 결론 |
|---|---|---|---|
| Free서울+IPv4 1GB+5GBbucket | 8 | 12,320 / 13,200 / 14,080 | RAM/부하/인가/복구 증거 부족, 조건부 후보 |
| Free서울+IPv4 2GB+5GBbucket | 13 | 20,020 / 21,450 / 22,880 | 기본료 여유 있으나 전송/기타 포함30,000 준수 미확정 |
| Free서울+IPv4 2GB+100GBbucket | 15 | 23,100 / 24,750 / 26,400 | 삭제 방식/전송/운영비 포함 추가 검증 필요 |
| Pro+IPv4 2GB(backup 별도) | 37 | 56,980 / 61,050 / 65,120 | 이 환율/세금 가정에서 기본료만30,000 초과. 목표 낮추거나 Pro 채택 안 함 |

| 분리 부하 모델 | 10h | 100h | 730h | 해석 |
|---|---|---|---|---|
| gameplay100명,각10Hz/256B 송신 | 9.216GB | 92.16GB | 672.768GB | client→VM 각10Hz/64B 별도2.304/23.04/168.192GB |
| gameplay100명,각20Hz/1024B 송신 | 73.728GB | 737.28GB | 5382.144GB | client→VM 각20Hz/64B 별도4.608/46.08/336.384GB; 20% 여유면100h 양방향940.032GB. 730h는 기본 allowance 초과 후보 |
| DB gate 전체5회/sec·응답256B | 0.04608GB | 0.4608GB | 3.36384GB | 5/sec는 가정이며 gate 알고리즘 승인/인가유예 아님. 요청/추가query·기존소비 별도 |
| DB gate 전체4000회/sec·응답256B | 36.864GB | 368.64GB | 2691.072GB | 5GB는 기존소비0인 이론상 상한에서도 약1.3563h; 실제남은시간 UNKNOWN |

Realtime fanout 모델113메시지×20회/sec=2260messages/sec라면100events/sec 제약 검토 단계에서 이미 부적합 후보다. 100h는813.6M messages, Free2M을 약14.75분에 소진하는 이론적 모델(기존 소비 제외 상한). service-specific event/message 계량 정의를 실제 meter로 대조해야 하며 위 모델은 실측이 아니다. gameplay를 Realtime로 옮기면 자동 무료 충족이 아니다.

| 일별 external dump wire size 가정 | 월30회 반출 | 7개 원본 저장 상한 예시 | 제약 |
|---|---|---|---|
| 10MB | 0.3GB | 0.07GB | compression/schema/roles/temp/rewrite/verification 추가분 별도 |
| 100MB | 3GB | 0.7GB | DB gate730h3.36384와 합6.36384GB로 uncached5GB 초과(다른소비 제외해도) |
| 500MB | 15GB | 3.5GB | storage5GB 내라는 이유로 DB반출 무료 아님;7일원본 retention 예외 승인 아님 |

월 uncached egress = 기존 사이트 실제 Eexisting(UNKNOWN)+gate+backup+기타. 낮은 gate730h와10MB일별 backup은3.66384GB지만 기존소비가 UNKNOWN이라 Free 준수 확정 불가. VM outgoing+incoming allowance·bucket outgoing/restore·삭제 재작성/검증 download·object/temp storage·monitoring/logging/DNS·운영 인건비 추가비 처리·세금/환율/수수료까지 총액 산식에 넣는다. 같은 AWS region의 특정 bucket→Lightsail 무료 조건은 Supabase→AWS 전송 무료 보장이 아니다. 초과 전에 대응 절차와 실제 견적을 확보해야 한다.

## 현재 결론·Astra 후속 판단

| 게이트 | 현재 상태 | 남은 결정·필요한 증거 | 다음 담당 |
|---|---|---|---|
| G01 | PARTIAL/OPEN | 100/8·p95 250ms·reconnect5s·모바일 시험 환경과 실측. 이 표는 목표 검증 지원 아님 | Astra 시험 경계 판단 → 이후 성능/QA 실행 |
| G02 | PARTIAL/OPEN | 정상망 회복과 auth/서버 장애 구분,cut/view/duplicate P·60초 deadline 선형 순서 | Astra 계약 → T04~07,T13 구현·시험 |
| G03 | OPEN/BLOCKING | 실제12함수/권한 metadata 확보. 모든Auth R·C/P/owner egress fence·복원 현재 권한 근거 여전히 미완 | Astra 지원 답변·경계 판단 → T01~05,T08,T10 |
| G04 | PARTIAL/OPEN | terminal once/durable crash·B01~07 삭제/복원/RPO/RTO·운영 시간 | Astra 보존 방식 → 사용자 대응시간 → 후속 복구 시험 |
| G05 | PARTIAL/OPEN | 실제 quota/청구·원화견적·wire량·운영비/실측. 총비용 충족 판단 불가 | Sol 추가 계량자료 → Astra 조합 → 후속 meter 검증 |
| G06 | SCOPED_DESIGN_RESOLVED | 두 Probe 규칙 적용 판단만 유지, 실행 증거/전체완료 아님 | 기존 범위 유지 |

Astra 쟁점: ① 실제 Auth/운영 R와 외부 C/P의 동일 순서가 지원되는 구조 및 불가능할 때 대안(목표 유지) ② lock 소실·old owner egress/in-flight fence ③ snapshot/duplicate P·deadline equality ④ rollback되지 않는 현재 권한/삭제 원천과 새 incarnation ⑤7일 복구점과30일/탈퇴 삭제를 동시에 충족하는 archive 방식 ⑥검증 지연·실패 여유를 포함한 daily/RPO schedule ⑦현실적 지원 단말·품질 시험과 실제 quota에 맞는 제품/비용 조건. 이번 Sol은 핵심 설계를 재선택하지 않는다.

사용자 추가 정보는 구체적 대응 가능 요일·시간/대체 담당, 비밀정보 없는 실제 quota·기존 사이트 소비·청구 통화/운영비 처리, 지원 대상 PC/모바일 단말 목록이다. 알고리즘 선택을 사용자에게 전가하지 않는다. 전체 STEP4B IN_PROGRESS/구현 HOLD, 정식반영·구현·실제 시험·STEP5A·병합·main 없이 제출 후 정지한다.
