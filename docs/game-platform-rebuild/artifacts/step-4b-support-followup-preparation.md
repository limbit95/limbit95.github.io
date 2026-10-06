# STEP4B — CP0060 후속 Sol 지원·운영·비용 자료 준비

2026-10-06 KST. 입력 `c1f1c41d3f3cb7de160f529ad7e6c50215e93d22`. [운영/단말/관측](step-4b-operations-device-usage-evidence.md), [선택 함수 재조회](step-4b-operational-fingerprint-refresh.json). CP0060 판단·T01~14/B01~07 보완은 당시 원문으로 보존한다. 이번 알고리즘 재선택 없음, 실행시험 NOT_RUN.

## 1. 확인 수준

| 종류 | 이번 확인 | 한계 |
|---|---|---|
| 저장소 정적 | 고정 입력 index.html과 js/accessTracker.js는 CDN @supabase/supabase-js@2; js/auth.js signOut()은 scope 인자 없음. js/supabaseClient.js·package/lock도 고정 입력 조회 | exact SDK patch/Auth SDK/Realtime SDK bytes·배포browser 실제 로드 버전 UNKNOWN. CDN 현재 응답을 과거 실행버전으로 대체 금지 |
| 운영 metadata | connector project zxwdculpycqvbcfdoxvu, ap-northeast-2, platform17.6.1.084. 2026-10-06 11:16:51 KST catalog SELECT1, 선택 함수12의 body MD5/ACL 모두 CP0059와 일치 | body 전체 재조회 아님; fingerprint는 보안 보증 아님. trigger/RLS/FK/Auth 내부writer/직접SQL 전수 현재성 감사 아님 |
| 공식 설명 | JavaScript signout default/global/local/others·JWT잔존, sessions검증 설명, Realtime cache, CLI dump/restore·가격/limits 재확인 | 최소권한adapter 채택·Auth내부rowlock upgrade 안정성·최종외부C/P fence 지원계약 없음 |
| 사용자 관측 | Free/기간/조직사용량/DB보고서 확인 | 프로젝트 귀속·최종월소비·실청구·100명 실측 UNKNOWN |
| 실행 증거 | 없음 | metadata SELECT/문서 검사/자동staticCI는 행동시험과 다름 |

이번 metadata SELECT는 동일 statement의 선택 row 관찰이지만 이전10SELECT·이번project listing·Dashboard/SDK와 합친 원자적 snapshot이 아니다. postgres connector 권한은 미래adapter 최소권한을 승인하지 않는다. 기존 SQL 호출은 사용자/운영자 자격을 이용하는 RPC 경로, 직접SQL/console/관리API는 별도 writer inventory가 필요하다. 실제 credential 내용은 요구하지 않는다.

## 2. 공식 출처 재확인 — 조회일 2026-10-06 KST

| ID | 원문 | 확인/후속 경계 |
|---|---|---|
| S61-01 | [Signout](https://supabase.com/docs/guides/auth/signout) | JS default global,local 현재session,others 나머지. refresh 철회 뒤 access JWT는exp까지 유효할 수 있음 |
| S61-02 | [Sessions](https://supabase.com/docs/guides/auth/sessions) | session_id↔auth.sessions,로그아웃 row 제거 검증 설명. lifetime/timeout 제한은Pro+. row존재만으로 모든expiry/현재권한/finalC/P 보장 아님 |
| S61-03 | [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization) Updating RLS policies | connection 권한cache,subscribe/newJWT때 재평가; 철회후 메시지를 계속 받을 수 있음을 명시. 즉시P철회 보장으로 사용 금지 |
| S61-04 | [CLI dump](https://supabase.com/docs/reference/cli/supabase-db-dump) | 기본 managed schema 제외·schema/data/roles 별도 mode,정확CLI/옵션 출력범위 미확인 |
| S61-05 | [CLI backup/restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) | auth/storage custom trigger/RLS 별도; pg-delta는관리schema 내부function/index 누락범위 명시. 모든권한자동완전복구 주장 금지 |
| S61-06 | [Usage summary](https://supabase.com/docs/guides/troubleshooting/understanding-the-usage-summary-on-the-dashboard-D7Gnle) | organization 현재/해당주기 과거활성project 집계. Database 평균값과live/report 구분 |
| S61-07 | [Pricing](https://supabase.com/pricing) | Free DB500MB/Storage1GB,uncached5GB/cached5GB,자동backup미포함·1주비활동pause,Pro$25. 계정실청구와 별도 |
| S61-08 | [Realtime limits](https://supabase.com/docs/guides/realtime/limits) | Free200connections·100messages/s·100joins/s. 월2M은pricing/캡처와 대조,100명의게임지원증거아님 |
| S61-09 | [Lightsail pricing](https://aws.amazon.com/lightsail/pricing/) | IPv4 Linux1GB$7/2GB$12,object5GB$1/100GB$3 후보 유지. 실제Seoul계정견적/구매 없음 |
| S61-10 | [Changelog](https://supabase.com/changelog) | markdown index fetch오류로HTML확인. SDK/DB upgrade 실행 없음 |

공식 session row 존재 검증은 조회 시점의 사실이다. DB check뒤processpause/lock loss/R후늦은apply/send 반례를 닫지 않는다. TTL/refresh/event 수신도 외부 C/P↔R 순서 보증이 아니다. queue/socketwrite/실제egress/in-flight 경계·oldowner 저장0/송신0 독립 oracle는 CP0060 그대로 HOLD다.

## 3. 현재 소비를 넣은 비용 민감도

decimal GB, backup30일/게임730h는 독립민감도 가정. 화면uncached Eobs=0.026GB이므로 관측 시점 산술잔여=5-0.026=4.974GB다. 미래기존사이트추가소비 Efuture·meter지연은 UNKNOWN이며 잔여 전부를 game 몫으로 예약하지 않는다. backup archive/data wire는 실제 export 미실행으로 UNKNOWN.

| 경로/후보 | 예측 계산 | 5GB와 대조 |
|---|---|---|
| gate5/s·256B·100h + daily10MB | 0.4608+0.3+0.026=0.7868GB | 산술상 여유, Efuture/overhead/재시도/검증/삭제재작성 추가 필요 |
| gate5/s·256B·730h + daily10MB | 3.36384+0.3+0.026=3.68984GB | 잔여1.31016GB,최종충족HOLD |
| 같은gate730h + daily100MB | 3.36384+3+0.026=6.38984GB | 표시5GB와 충돌 |
| 같은gate730h + 12h10MB 후보 | 3.36384+0.6+0.026=3.98984GB | 잔여1.01016GB,12h 채택 아님 |
| 같은gate730h + 12h100MB 후보 | 3.36384+6+0.026=9.38984GB | Free한도와 충돌 |
| 참고크기55MB ×30회/60회 | 1.65/3.3GB | DBUsage0.055를 단순크기proxy로만 대입,실dump측정값 아님 |
| proxy55MB + gate730h + Eobs | daily5.03984GB /12h6.68984GB | 이 proxy가실wire라면충돌;실제최소archive wire필요 |
| Realtime 잔여messages | 2,000,000-920=1,999,080 | 현재표시산술,미래소비/heartbeat/fanout추가;고빈도gameplay전송안 충돌 유지 |
| gameplay 저부하100명×10Hz×256B/64B | 100h out92.16+in23.04GB | VM전송경로,DBgate/Realtime/backup 별도;성능실측 아님 |

DBgate와backup 반출은uncached로 보수적대조하며cached잔여4.999GB를합산하지 않는다. 실제meter지원은S61-06 및후속확인. gate5/s/256B·10Hz/20Hz·sample수는시나리오,승인된필수알고리즘/시험합격선 아님.

| 후보 기본료 USD | 1400원·10% | 1500원·10% | 1600원·10% |
|---|---:|---:|---:|
| Free +1GB IPv4 VM+5GBbucket $8 | 12,320 | 13,200 | 14,080 |
| Free +2GB IPv4 VM+5GBbucket $13 | 20,020 | 21,450 | 22,880 |
| Free +2GB IPv4 VM+100GBbucket $15 | 23,100 | 24,750 | 26,400 |
| Pro+2GB VM $37,외부bucket 별도 | 56,980 | 61,050 | 65,120 |

환율·10%세율은민감도 가정, 실결제통화/과세/수수료확인값 아님. 추가backup/restore/삭제재작성CPU·전송·임시저장·version·monitoring·유료운영도구·증분인건비를총비용에포함한다. 계정구매/실청구 없음. 본인운영가능시간은활동시간/요금0 증거 아님. 총3만원 준수/100명/p95/재연결 지원 HOLD.

## 4. 운영 시간과 복원·삭제 자료 요구

평일최대대기20h 조건이면 RTO24h의 복원+검증+현재권한재확인+안전개방 예산≤4h. 작업이24시이후까지이어질수없다면 같은4h window내완료 또는주말/대체담당 경로가필요하다. 실제복원duration/경보인지상한/대체담당/공휴일정책 UNKNOWN. 24h상시대응채택없음.

RPO는 Δ+v+m≤24h 조건 유지. 평일공백20h를 단순 human retry예산 m으로 쓰면 Δ+v≤4h가필요해12h 후보와양립하지 않는다. 이는 장애가공백시작에발생하고오직사람만복구하는최악가정의조건계산이다. 자동retry/독립감시·추가cut·대체담당의실제상한을확보해Astra가구조를판단해야하며본작업에서4h주기/12h주기를선택하지않는다.

| B 연결 | 확보할 artifact | 후보와확정 분리 |
|---|---|---|
| B01/02 | exactCLI/pg_dump/Docker/PG·mode·schema/data/roles/Auth/customization/Storage범위matrix,동일cut manifest | 도구/backupjob없음. schema/data별호출만으로consistent cut인증금지 |
| B03~05 | live/archive/version/delete-marker/temp/upload/retry/workercache inventory,각최초terminal+30일·withdrawal 연결삭제deadline,7일유효복구점 참조표 | 분리archive추천유지,full dump추가개인정보보존승인없음 |
| B06 | 새incarnation원천·oldsession/owner저장/egress fence·현재권한/삭제원천 rollback저항·재승인bootstrap지원계약 | 외부삭제log이중write원자성미해결,source누락시닫힌복원 |
| B07 | discovery/alert/ack/start/cut/transfer/validated/restore/delete/authorize/reopen 시각,독립감시/대응공백 | RTO/RPO실측NOT_RUN,발견시각을착수시각으로변경금지 |

## 5. T01~14 다음 환경 manifest

Windows10 Chrome/Edge,Windows11 Chrome/Edge,iPhone 사용자iOS18.7.8 Safari를 기본조합으로기록한다. 실기접근·모델·OS/browserbuild/네트워크는확인필요. exactSDKbytes/hash·Auth설정/버전·serveradapter/DBgate/finalegress trace·queue/in-flightoracle 없으면INCONCLUSIVE/HOLD. T12는원격참여자권위화면end-to-end p95≤250ms,실패표본제외금지·100명/판8·방분포·PC/모바일기능전수. T13은정상망회복후대상각회≤5초,임의p95전환금지. T07 최초장애60초정각abort우선·모든C/P/R안전위반0. 표본후보를승인요구로확대하지않는다. 이번시험실행없음.

## 6. 미확인·담당과 게이트

| 미확인 | 확보 자료 | 담당 |
|---|---|---|
| M01 모든 writer/actor/console/directSQL/service 배치 | 비밀없는 경로·caller·권한·변경 로그 목록,동적SQL 누락 감사 | Sol/운영자→Astra |
| M02 exact SDK/Auth/CLI | 실제 browser 로드 manifest·tool versions·Auth 설정값,키/토큰 제외 | 후속 Sol |
| M03/04 final C/P와 모든 R 지원 | session 검증 최소권한·내부 writer lock 호환·최종 egress fence 공식 지원 답변 | Sol 문의 초안→Astra,미전송 |
| M05/08 rollback/삭제 | 복원 독립 현재권한/삭제 source·사본 inventory·순서/원자성 | Astra→허용후 구현/시험 |
| M06 quota | 조직 현재기간 관측 KNOWN;프로젝트 귀속/서비스별 wire/최종월 소비/실청구 UNKNOWN | Sol/운영자 |
| M07/09 tool/복원 상한 | mode 범위·consistent cut·실측 v/m/restore | Sol 명세→시험 담당 |
| M10 운영/단말 | 기본 요일시간/브라우저 채택 KNOWN;예외/공백 담당·device 상세 UNKNOWN | 운영자→Sol |

| 게이트 | 현재 상태 | 남은 결정 | 필요한 증거 | 다음 담당 |
|---|---|---|---|---|
| G01 | PARTIAL/OPEN | 제품·품질 시험 환경 고정 | 100명/판8·p95·각회 재연결5초·모바일5기능 T12/13 | Sol 환경→허용후 QA |
| G02 | PARTIAL/OPEN | owner/reconnect/auth outage 경계 | T06/07/08·old owner 저장/송신0·deadline | Astra 구조→허용후 시험 |
| G03 | OPEN/BLOCKING | 모든 R과 final C/P 지원 구조 | M01~05 공식 계약·ordering/egress T01~08 | Sol 지원 자료→Astra |
| G04 | PARTIAL/OPEN | archive/현재권한/삭제 source·RPO 운영 | B01~07·terminal crash·30일/탈퇴/7일·실제 RTO/RPO | Astra→허용후 운영 시험 |
| G05 | PARTIAL/OPEN | 단일 구성 총비용·wire 예산 | meter/실견적/backup wire/기존 소비/운영비 | Sol 계산→Astra |
| G06 | SCOPED_DESIGN_RESOLVED | 두 Probe 적용 판단 이외는 별도 범위 | 이번 추가 실행 증거 없음 | 유지 |

## 7. 지원 문의 추가 초점 — 미전송

기존 S60 문의6항목을 유지한다. 질문3은 global/local/others·직접API/console/user 삭제·JWT expiry와 external final apply/send의 권위 순서에 대한 공식 지원, DB lock 소실 후 늦은 send를 배제하는 계약에 초점을 둔다. session row 존재 설명은 이후 R과의 경합을 닫지 못하므로 질문1/2도 query 결과와 final effect 사이를 포함한다. 질문4는 exact version/mode별 Auth data·custom managed 객체·roles/GRANT·consistent cut을 각각 답할 수 있는 matrix를 요구한다. 답변 기한/Free 우선 지원/유료 지원 구매는 가정하지 않는다. 실제 전송 없음.

다음 Sol은 지원 계약·버전 manifest·inventory 부족 자료를 좁혀 확보한다. Astra는 대응 공백20h를 포함한 RPO/RTO 조건·final C/P 지원 구조·삭제 rollback source를 판단한다. 구현/시험/job/dump/restore는 별도 허용 단계다.

사용자 추가 정보 우선순위: ① 공휴일/부재시 대체 대응 유무(없으면 UNKNOWN이 아니라 대체담당 없음으로 기록,목표는 유지) ② iPhone 모델·각 Windows 시험기 이용 가능 여부 ③ 필요시 project-filtered meter·실청구. 이미 확인한 기본 대응시간/사용량 화면은 재요청하지 않는다. 기술 알고리즘 선택을 사용자에게 전가하지 않는다.
