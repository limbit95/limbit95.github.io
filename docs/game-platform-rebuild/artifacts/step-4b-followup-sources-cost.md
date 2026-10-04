# STEP4B — 후속 공식 근거와 비용 민감도

조회일 2026-10-04. 사용자 결정은 [별도 원본 기록](step-4b-user-decisions.md). 이 문서는 설계 판단의 근거이며 계약 반영/제품 구매/실측 견적이 아니다. 지역·평균 동접·이용시간 미정이므로 **예상 청구액을 단일 값으로 확정할 수 없다**. 아래는 사용자 최대 규모에 기초한 계산 가능한 시험 부하와 비용 경계다.

## 공식 원문 선택 확인

| ID | 공식 원문/선택 범위 | 확인 사실과 판단 한계 |
|---|---|---|
| F01 | [AWS Lightsail 가격](https://aws.amazon.com/lightsail/pricing/), Virtual servers/public IPv4/Linux, transfer allowance, snapshots | $7: 1GB RAM/40GB disk/2TB transfer; $12: 2GB/60GB/3TB. ingress+egress가 allowance에 포함, 초과 outbound 과금. 일부 지역 allowance 절반(현재 목록에 Seoul 없음). snapshot $0.05/GB-month. 가격은 처리 용량 보증이 아님; 지역별 실제 SKU/초과율/세금 재견적 필요 |
| F02 | [Supabase 가격](https://supabase.com/pricing), Pro·compute·Free | Pro 시작 $25/월, $10 compute credit 포함(첫 Micro와 이중 합산 금지). 별도 프로젝트/초과량 별도. Free egress 5GB, 비활동 pause 정책. 기존 계정 요금/여유량은 조회하지 않았으며 Free 여유를 사실로 가정하지 않음 |
| F03 | [Realtime 메시지 과금](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages), metering/pricing | Broadcast 송신1+각 수신자1; Free 2M/Pro 5M, 초과 $2.50/1M 올림. 메시지 비용과 egress/compute는 별개. CCU만으로 월비용 판단 불가 |
| F04 | [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization), Updating RLS policies·Interaction with Postgres Changes | channel 정책 cache와 JWT 갱신/만료 조건 확인. row별 Postgres Changes RLS와 구별. 연결 시 허용만으로 즉시 철회 보장 불가 |
| F05 | [Postgres Changes troubleshooting](https://supabase.com/docs/guides/troubleshooting/realtime-postgres-changes-troubleshooting), Step6/8 | SUBSCRIBED와 replication 준비 사이 gap, 모든 변경 durable delivery 아님. system 준비 신호도 snapshot/live 원자적 cut이나 마지막 유실 감지를 증명하지 않음 |
| F06 | [Nakama authoritative](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/), match state·broadcast·idle·tick | match 메모리 상태·서버 검증/명시 송신·빈 match도 handler 실행. 제품만으로 crash restore/우리의 auth bridge/100명 용량이 해결되지 않음 |
| F07 | [Nakama JavaScript](https://heroiclabs.com/docs/nakama/client-libraries/javascript/)·[공식 SDK README](https://github.com/heroiclabs/nakama-js), browser/client/socket | browser용 JS 경로 존재 확인. 실제 설치 버전/번들/우리 handoff·token bridge 미검증. PUN2 문서로 browser SDK 지원을 추정하지 않음 |
| F08 | [WebSockets Standard](https://websockets.spec.whatwg.org/), interface/send/close | browser 표준 transport 근거. send 성공/연결 open은 application commit·authorized snapshot·재연결 replay가 아님. 앱별 queue/크기/세대 제한 필요 |
| F09 | [Supabase JWT](https://supabase.com/docs/guides/auth/jwts), claims/verifying; [Sessions](https://supabase.com/docs/guides/auth/sessions), session lifecycle | 서명·issuer/audience/expiry/session 검증과 사이트 승인/현재 room 권한은 다른 검증. JWT 유효성만으로 DB 승인철회나 logout 후 모든 접근 차단을 추론하지 않음 |
| F10 | [Supabase changelog](https://supabase.com/changelog) | HTML 접근 확인. changelog.md는 조회 오류. 이번 판단에 적용할 SDK 고정 버전/변경 영향 전수 검증은 하지 않았으므로 G02/G05 OPEN |

가격표 본문과 구형 예시가 다르면 현행 SKU 표를 사용한다. Lightsail 페이지 하단 과거 $5/1GB 예시는 이번 IPv4 $7 SKU 근거로 사용하지 않았다. AWS object-storage 초과율을 VM 초과율로 전용하지 않는다. 공식 문서 사실, 아래 계산, 설계 추천은 서로 다른 증거다.

## 비용 산식과 시나리오

기준 단위는 decimal GB(10^9 bytes), 아래 byte 값은 application payload다. R=실제 결제 KRW/USD, t=실제 적용 세율, A=추가 유료 서비스/트래픽/백업 등 USD, K=원화 비용. **월 총추가비=(서버 기본료+A)×R×(1+t)+K ≤30,000**. 카드/환전 수수료도 A/K에 반영해야 한다. 기존 사이트 요금은 중복 합산하지 않지만 게임 때문에 생기는 증액은 포함한다.

환율 1,400/1,500/1,600과 세율10%는 **민감도 가정**, 조회한 실환율/확정 세율이 아니다. 공급자/청구계정의 실제 세금·환전 조건은 배포 전 확인한다. 무료 체험 할인은 제외한다.

| 조합 | USD 기본비 | R=1,400 / 1,500 / 1,600, t=10% 가정 | 조건/판정 |
|---|---:|---|---|
| Lightsail IPv4 1GB | 7 | 10,780 / 11,550 / 12,320원 | 저비용 비교 후보; CPU/RAM 충분 미확인 |
| Lightsail IPv4 2GB | 12 | 18,480 / 19,800 / 21,120원 | 우선 검토 후보; 추가비 여유 8,880~11,520원 |
| 2GB + snapshot 20GB-month 가정 | 13 | 20,020 / 21,450 / 22,880원 | snapshot 사용량 가정; 백업20GB 보장 아님 |
| Supabase Pro 새 증액만 | 25 | 38,500 / 41,250 / 44,000원 | 이 환율/세율 범위에서 서버 없이도 예산 초과 |
| 2GB + Supabase Pro 새 증액 | 37 | 56,980 / 61,050 / 65,120원 | 현 상한에 부적합; 이미 지불 중인 Pro 여부는 미확인 |

Pro $25만으로 예산을 맞추려면 기타비0·t=10%일 때 R≤1,090.91이어야 한다. $12 서버만의 같은 경계는 R≤2,272.73. 이는 환율 전망이 아니라 대수 계산이다. $13 후보·R=1,500·t=10%에서 다른 비용 여유는 8,550원(약$5.18). 공급자 알림은 청구 hard cap이 아니므로 알림만으로 상한 보장을 선언하지 않는다.

## 사용자 규모에 대한 트래픽 계산

C=실제 활성 수신자 수(전체100 중 일부일 수 있음), f=수신자당 상태 송신 Hz, b=수신자당 한 frame payload bytes, h=해당 평균 부하 시간. **outbound=C×f×b×3,600×h/10^9 GB**. b는 이미 각 수신자에게 보내는 전체 room projection 크기이며 8명을 다시 곱하지 않는다. inbound=C×inputHz×inputBytes×3,600×h/10^9. 프로토콜/TLS/heartbeat/재시도/auth/로비/배포 다운로드는 추가다.

| 시험 envelope (사용 예측 아님) | 조건 | outbound | inbound | 합계payload |
|---|---|---:|---:|---:|
| E1 소형/낮은 송신 | C100, 10Hz×256B, input10Hz×64B, 100h | 92.16GB | 23.04GB | 115.20GB |
| E2 큰 full snapshot | C100, 20Hz×1,024B, input20Hz×64B, 100h | 737.28GB | 46.08GB | 783.36GB |
| E3 E2 지속 점유 | 같은 E2, 730h | 5,382.14GB | 336.38GB | 5,718.53GB |

100h는 예상 이용시간이 아니고 비교 단위다. 730h는 월 가동 계산 예시(실제 달 일수 차이)다. 100명이 로비에 머무르면 위처럼 gameplay frame을 모두 송신할 필요 없지만, 최악의 활성100명을 임의로 줄여 계산하지 않았다. 여유20%를 가정하면 E2는 940.03GB/100h, E3는6,862.23GB로 3TB bundle을 넘는다. 이 20%는 측정된 overhead나 안전 보증이 아니다.

3TB를3,000GB로 보수적으로 환산하면 E2+20%는 약319.14h에 quota에 도달한다(다른 사용0 가정). E1+20% 730h는1,009.15GB. 즉 동일100명 목표도 packet 설계와 점유시간에 따라 예산 성립이 달라진다. 지역별 실제 계량 단위/포함량 확인 필요. 초과비는 VM 해당 지역 단가 p를 확인해 `p×청구대상 초과GB`로 추가하며 현재 미정이라 E3 총액을 확정하지 않는다.

Realtime Broadcast로 E2의 상태를 relay하는 비교: 100명을 8명씩 채운13개 방(12×8+4)에서 room당20Hz 한 frame이면 `(13 송신+100 수신)×20×3,600×100 = 813.6M` 메시지. Pro 초과 `ceil((813.6M−5M)/1M)×$2.50=$2,022.50` **메시지비만**, 기본료/입력/egress 제외. 이는 그런 설계를 채택하라는 뜻이 아니라 고빈도 full-state relay를 비용상 제외하는 근거다. 방당 private 개별 송신이면 더 늘 수 있다. Free2M도 이 부하에서는 약14.75분에 소진하며 무료 CCU 여유가 월 지속 부하 증거가 아니다.

방13개는 꽉 채웠을 때 예시일 뿐 동시 방 상한이 아니다. 1인 방을 허용하면 활성100명으로100방 가능, 빈 방 수는 별도 수명/상한이 필요하다. CPU는 연결 수뿐 아니라 방 수·tick·충돌 계산·빈 방 정리·TLS/auth·DB 지연의 함수다. 2GB/2vCPU의100명 통과는 실측 전 미확인.

## 비용 판단·조정안

우선안은 **직접 운영하는 단일 권위 서버+WSS**, 사이트 인증/기존 저장소 연결은 저빈도 제어 경로로 제한하는 설계 방향이다. Lightsail $12는 비용 검토 후보이고 최종 제품/region/서버 framework 채택은 HOLD. 기존 Supabase 증액 없이 필요한 권한·저장 처리가 가능한지는 계정 여유량과 G03 실험으로 확인해야 한다. 보안 확인을 비용 때문에 생략하거나 캐시 TTL을 임의 연장하지 않는다.

예산 충돌 시 먼저 delta/변경분·수신 범위·빈 방 정리로 같은 경험/100명 목표를 유지할 수 있는지 측정한다. 그래도 초과하면 (1) 상한 증액, (2) 운영 시간/월 사용량 제한, (3) 허용 품질 범위 내 송신 품질 조정 중 사용자 승인을 받는다. (2)(3)은 아직 선택되지 않았고 몰래 적용하지 않는다. 장기 Supabase Pro 전환과 저장소 분리는 재견적 트리거이며 게임40~50개라는 개수만으로 사용량·필수 유료 전환 시점을 정하지 않는다.

배포 전 필요한 자료: 대상 지역, 실제 트래픽 profile, 현재 Supabase plan/잔여량/게임 증분, 서버 패키지/버전의 RAM·CPU, snapshot/log 보존량, 적용 세금/환율/수수료, DNS/TLS/모니터링 비용, 과금 차단 또는 사전 승인된 서비스 제한 정책. 운영 담당은 사용자로 확인됐으나 대응 가능 시간과 RTO는 미정이다.
