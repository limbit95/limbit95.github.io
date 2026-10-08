# STEP4B — 구현 전 조건의 원문·가격·계산 근거

2026-10-04 KST. [판단](step-4b-preimplementation-conditions.md)의 근거. 공식 페이지 조회와 저장소 정적 확인이며 운영 DB·SDK·실제 과금·부하 검증이 아니다.

## 1. 저장소 고정 입력과 확인 범위

입력 commit `12181366b39a2d5da083701cd7bf056046566e9f`, tree `4de018cac2d5506b33a8f2eda570b1fadd687638`, recursive966 entries/truncated=false.
PR412 head가 입력과 일치했고 integration ref는 `3aeae1dfcce7788f88e706dcd49d283b91b67e82`였다.
루트 AGENTS와 실행 계획1.3, 기록README, integration/CURRENT, STEP CURRENT, CP0053, 기존 판단·STEP4A 수명 계약·DB11을 대조했다. integration CURRENT의 PR411 미병합 표기는 저장 직전 이력이며 실제 ref/현재 PR과 구별했다.

tree에서 다음 조건의 blob 전체153개를 고정 SHA로 fetch하고 content의 Git blob SHA를 검증했다.

- `js/**/*.js` 77개: 앱 Auth/관리/프로필/API 호출.
- `supabase/site/**/*.sql` 70개: baseline·migration·seed. lexical search 후 관련 writer·trigger를 읽었다.
- `supabase/functions/**/*.{ts,js}` 6개: 선택 경로 내 Auth 삭제/세션 writer 검색.
- 검색식: signOut/deleteUser/logout/탈퇴/auth.sessions/UPDATE public.profiles/admin_set_member_status/admin_permissions 등.
- 이것은 선택 디렉터리의 정적 inventory다. 모든966 entries의 의미 감사, games·legacy의 모든 코드, 실DB 최종 정의·콘솔·직접 API·외부 자동화 전수 확인으로 확대하지 않는다. 동적 SQL·권한 있는 운영 경로도 남아 있다.

| 근거 | 고정 원문 경로·위치 | 확인 사실·한계 |
|---|---|---|
| S01 | js/auth.js:430~471; js/app.js:131~139; js/pages/pending.js; js/pages/passwordReset.js | wrapper signOut과 push 정리 선행, 직접 SDK signOut에 scope 인자 없음. 실제 배포 SDK 버전 미확인 |
| S02 | supabase/site/migrations/20260908090000_add_admin_permission_system.sql:299~535 | approve/review/role/status writer, status와 role에서 profile FOR UPDATE. 게임 gate와 연동 증거 없음 |
| S03 | 같은 migration:158~176,261~298 | privileged columns 보호, permission 삭제/재삽입과 bootstrap 역할 writer. admin permission 변경도 결과관리 권한에 쓰면 추적 필요 |
| S04 | js/api/profiles.js:70~76; supabase/site/baseline/11_rls.sql:90~119 | 직접 profile update API, privilege/RLS/trigger를 함께 판단해야 함 |
| S05 | supabase/site/baseline/01_members.sql; 07_common_triggers.sql | Auth FK cascade, approved helper. baseline만으로 현재 운영 정의 확정 불가 |
| S06 | js/accessTracker.js:24~35; js/supabaseClient.js | 동적 CDN @supabase/supabase-js@2 로드 경로 관찰, 정확한 patch pin 증거 없음. 기존 파일은 수정하지 않음 |
| S07 | docs/game-platform-rebuild/artifacts/step-4b-authorization-boundary-judgment.md §2~9 | A 안전성/저빈도 우선·B HOLD, C/P/R와 owner/durable start 의무 유지 |
| S08 | game_platform_vnext_final_execution_plan.md STEP4B/6; step-4a-lifetime-contract.md §6~8; game-platform-db-test-contract.md | 현재 게이트·동결 전 구현 금지·수명 조건·11개 안전성과 최소 Data API 권한 유지 |

경로의 고정 링크는 `https://github.com/limbit95/limbit95.github.io/blob/12181366b39a2d5da083701cd7bf056046566e9f/<path>`다.
[Auth](https://github.com/limbit95/limbit95.github.io/blob/12181366b39a2d5da083701cd7bf056046566e9f/js/auth.js),
[권한 migration](https://github.com/limbit95/limbit95.github.io/blob/12181366b39a2d5da083701cd7bf056046566e9f/supabase/site/migrations/20260908090000_add_admin_permission_system.sql),
[프로필 API](https://github.com/limbit95/limbit95.github.io/blob/12181366b39a2d5da083701cd7bf056046566e9f/js/api/profiles.js).

계정 삭제 호출이 검색되지 않았다는 관찰을 “탈퇴 경로 없음”으로 확정하지 않았다. 운영 정의·실제 적용 migration·API scope/지원 lock·service 주체 확인이 G03 W6의 남은 증거다. production에서 요청을 발생시키거나 권한을 변경하지 않았다.

## 2. 공식 자료 — 사실과 설계 추론 분리

| ID | 공식 URL | 이번 확인 사실 / 한계 |
|---|---|---|
| F01 | [Lightsail 가격](https://aws.amazon.com/lightsail/pricing/) | Linux public IPv4 1GB $7/40GB/2TB,2GB $12/60GB/3TB; snapshot $0.05/GB-month. 처리 성능 보증 아님 |
| F02 | [Lightsail FAQ](https://aws.amazon.com/lightsail/faq/) | VM allowance 초과 outbound Seoul $0.13/GB,Tokyo $0.14/GB. inbound도 allowance 사용, outbound 초과 과금. object storage·CDN 단가와 구별 |
| F03 | [Lightsail regions](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-regions-and-availability-zones-in-amazon-lightsail.html) | Seoul ap-northeast-2·Tokyo ap-northeast-1 지원. 계정의 구매 가능 SKU/용량·실제 RTT 미확인 |
| F04 | [Supabase 가격](https://supabase.com/pricing) | Pro 시작$25, 유료 compute credit$10; Free DB500MB·egress5GB·자동 backup 없음. 기존 계정 상태/게임 증액 미확인 |
| F05 | [Supabase regions](https://supabase.com/docs/guides/platform/regions) | Seoul·Tokyo 옵션 존재. 현재 프로젝트 region 미조회, 이전 승인 아님 |
| F06 | [Sessions](https://supabase.com/docs/guides/auth/sessions)·[Signout](https://supabase.com/docs/guides/auth/signout) | session_id 검사와 signout scope, refresh 철회 후에도 access token 만료 전 유효성 한계. 외부 C/P 직렬화 보장 아님 |
| F07 | [Managing user data](https://supabase.com/docs/guides/auth/managing-user-data) | Auth 삭제·JWT 잔존·Storage 소유 시 삭제 조건. 저장소 내 탈퇴 UX 존재 증거 아님 |
| F08 | [Postgres explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html) | row lock 모드 충돌·deadlock/잠금 순서. 공식 current는18, 실제 프로젝트 버전 미확인. WSS 원자성 보증 아님 |
| F09 | [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization) | join 시 정책 계산과 cache/갱신; realtime 관리 schema 변경 제한. 연결 시 인가를 R 이후 계속 권한으로 쓰지 않음 |
| F10 | [Backups](https://supabase.com/docs/guides/platform/backups) | Pro daily backup7일, Free는 정기 export/off-site 권고. DB backup은 Storage object 복구를 대신하지 않음 |
| F11 | [Realtime message usage](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages) | 송신·수신 단위 metering. high-rate relay의 호출/egress/compute 구분 |
| F12 | [Nakama authoritative](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/) | authoritative match와 메모리 state/loop. Supabase bridge·우리 권한 freshness·2GB100명 보증 아님 |
| F13 | [WebSockets Standard](https://websockets.spec.whatwg.org/) | browser transport/send/buffer. 앱 commit·권한·recovery oracle은 별도 설계 |
| F14 | [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) | 정적 사이트 hosting. repository 분리는 persistent WSS 실행 서비스를 제공하지 않음 |
| F15 | [Supabase changelog](https://supabase.com/changelog) | 최신 변경 목록과 Data API 노출/자동 retry/managed schema 관련 항목 확인. md 접근/일부 상세 링크 조회 불완전, 설치 버전별 전체 영향 검증 아님 |

Changelog의 기능명만으로 실제 SDK 동작을 확정하지 않는다. 별도 상세 링크 조회가 실패한 항목은 기존 DB 권한 계약과 현재 공식 topic 문서에서 확인한 의무만 적용했다. 향후 SDK pin 시 자동 GET/HEAD retry가 앱 retry와 중첩되는지 실측한다. Supabase skill의 권한 검토 원칙을 적용했으며 DB/정책/서비스 설정 변경은 하지 않았다.

RLS와 table/function GRANT는 별개다. service credential은 browser에 노출하지 않고, 내부 table/function의 default PUBLIC EXECUTE/광범위 service grant를 안전성 증거로 쓰지 않는다. user_metadata와 오래된 JWT claim을 현재 승인 근거로 쓰지 않는다. 이 조건들은 향후 구현 점검 사항이지 이번 production 설정 검사 PASS가 아니다.

## 3. 비용 산식과 비교

`총추가비=(VM + backup + DB증액 + 초과전송 + 기타USD)×결제KRW/USD×(1+적용세율)+원화비용`.
환율1400/1500/1600원,세율10%는 기존 민감도 가정이며 현재 실환율/확정 세율이 아니다. 카드·환전 수수료, 외부 backup/log/monitoring, domain 신규비 등은 실제 비용 확인 후 더한다. 무료 체험 제외.

| 시나리오 | USD | 1400원/1500원/1600원 및10% 가정 | 판정 |
|---|---:|---|---|
| Seoul1GB + snapshot20GB-month 가정 | 8 | 12,320 / 13,200 / 14,080원 | 여유는 있으나 100명 용량 미증명 |
| Seoul2GB + snapshot20GB-month 가정 | 13 | 20,020 / 21,450 / 22,880원 | DB증액·기타비0일 때만 기본비, 총액 확정 아님 |
| Seoul2GB + 새 Pro, backup 제외 | 37 | 56,980 / 61,050 / 65,120원 | 민감도 전체에서 월3만원 초과 |

20GB-month snapshot은 사용량 가정이지 7일 backup이나 DB 일관성 보증이 아니다. 실제 변경 block/보존에 따라 달라진다. 게임 VM snapshot은 원격 Supabase DB backup이 아니므로 Q02를 충족시키는 비용으로 자동 전용하지 않는다.

C1,$13,R1500,t10%라면 여유8,550원=$5.1818. 다른 비용0이면 Seoul VM 초과 outbound 약39.86GB만 추가해도 이 여유를 소진한다. 실제 inbound/outbound 발생 순서와 provider meter에 따라 초과 outbound를 산정해야 하며 총payload 초과량을 전부 청구량으로 동일시하지 않는다.
$25 Pro만의 예산 경계는 기타0·t10%일 때 R≤1090.91원/USD. 새 Pro를 현재3만원에 맞는다고 판정하지 않는다.

## 4. 사용량 envelope — 월 예측이 아님

`outbound=C×f×b×3600×h/10^9 GB`.
C=활성 수신자, f=수신자당 전송Hz, b=수신자에게 가는 전체 projection bytes, h=평균 해당 부하시간. room8명은 b에 이미 반영되므로 다시8배하지 않는다. 총100명 목표를 활성10명으로 축소해 예산을 맞추지 않는다.

| envelope | outbound / inbound 조건 | 100시간 payload | 의미 |
|---|---|---|---|
| L | 100명×10Hz×256B / 100명×10Hz×64B | 92.16GB /23.04GB | 작은 payload 후보; 실측/요구 승인 아님 |
| H | 100명×20Hz×1024B /100명×20Hz×64B | 737.28GB /46.08GB | full-state 큰 frame 대조 |
| H 월730시간 | 위 H 지속 | 5,382.14GB /336.38GB | 3TB allowance 초과 가능. 실제 월 평균 사용을 의미하지 않음 |
| A 단순 gate | 100명×20Hz×입출력2 =4000gate/s, 응답256B 가정 | 14.4억gate / DB 응답368.64GB | 실제 endpoint 응답크기·meter·latency 미확인, Free egress 여유 가정 배제 |

TLS·재시도·heartbeat·Auth·로비·배포·backup 트래픽은 추가다. 이전 H+20% 가정은940.032GB/100h,3,000GB까지약319.14h. 20%는 측정한 overhead가 아니다. CPU credit 소진·100개 분산 room·DB lock wait는 byte 산식이 설명하지 못한다.

최소 기록 용량은 월판수×(match row+participant rows+indexes+운영 metadata)×보존개월+backup이다. 예를 들어10,000판/월×4KiB/판을 가정하면 월40.96MB,90일 단순3개월122.88MB이나 bytes/판·참가자 분포·index/WAL은 실측 전 미확인이다. 100CCU만으로 월판수를 산출하지 않는다.

두 비용 경로를 별도로 측정한다: client↔게임VM WSS와 게임VM↔Supabase gate/result/backup. 첫 경로가3TB 이하라도 두 번째 경로가 무료 egress/compute를 넘을 수 있다. 저빈도 control만 Supabase에 남긴다는 방향도 외부 C/P의 안전성을 먼저 해결해야 선택 가능하다.

## 5. 이번 근거의 결론

Seoul2GB 후보의 기본 가격은 좁혔지만 전체100명·8명·3만원 조합은 미증명이다. G03 adapter와 실제 기존 DB quota·월 사용량이 먼저 필요하다. 무료 여유/직접 DB 동거/짧은 TTL로 공백을 해결했다고 처리하지 않는다. 운영 자료 확인과 별도 허용된 시험 후 새 고정 SHA로 판단한다.

