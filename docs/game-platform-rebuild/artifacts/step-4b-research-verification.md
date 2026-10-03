# STEP 4B — 조사 원본 수신과 선택 원문 검토

사용자 2026-10-03 순서3 요청. 이 검토와 이후 핵심 판단을 구별한다. 역할 표기는 가이드의 작업 책임이며 별도 모델·별도 에이전트 실행을 인증하는 증거가 아니다.

## 원본과 확인 범위

[첨부 원본](step-4b-auxiliary-research-report.md)을 byte 그대로 보존했다. 77,818 bytes, SHA256 `270c224ff0e2c75f64c77fd9360b4bf79bfd538a3f1828a2157756d4a7b01f5d`, Git blob `389c424beec332da935e08766529edb0485622c3`. 작성자/모델과 조사 당시 browsing 로그를 독립 인증하지 않았다. 원본의 조사일 2026-10-02는 원본 작성 기록이다. 이번 선택 확인 세션은 2026-10-03 요청에 따라 수행했다.

원본 Q01~04는 제공 packet 기준 구현 관찰·공식 출처 주장·적용 추론·미확인을 구별하며 repository/production 접근을 가정하지 않는다. 입력에 없는 부하나 예산으로 프로젝트 견적을 만들지 않았다. 기술판본·유실·replay·권한 cache·in-memory와 영속성의 한계도 기록했다. 원본 수신만으로 핵심 판단이나 전체 출처 검증을 완료 처리하지 않았다.

준비 source B01~44의 36파일과 기존 로컬 총110파일을 최신 원격 tree의 Git blob에 대조했다. 준비 HEAD `ce3426803cc7ac53da3ba38ac908778ae4423b30`, integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`가 유지된다. AGENTS/계획1.3/기록README/CURRENT/CP0044/DECISIONS는 고정 HEAD로 원격 재조회했다. PR412 OPEN/Draft, 동일 branch/base를 이어간다.

## 선택 확인한 공식 원문

아래 URL·절에서 결론에 필요한 내용만 재확인했다. rolling 문서는 특정 배포 release 보증이 아니다. 따옴표 인용을 늘리지 않고 확인 사실을 요약한다. 전체 문서/하위 링크/원본 출처 전수를 새로 확인하지 않았다.

| ID | 원본 대응·공식 URL | 실제 선택 절·확인 결과 | 한계/판단 연결 |
|---|---|---|---|
| V01 | SB-01 [Realtime Protocol](https://supabase.com/docs/guides/realtime/protocol) | phx_join 설정·system 관련 설명: replication_ready 요청 시 별도 준비 신호. 1.0.0/2.0.0을 함께 설명하며 기본값은1.0.0 | 원본의 예제2.0.0 표기를 프로젝트 버전으로 채택하지 않음. 원자적 snapshot cut 증거 아님 |
| V02 | SB-02 [Troubleshooting](https://supabase.com/docs/guides/troubleshooting/realtime-postgres-changes-troubleshooting) | Step6/8: SUBSCRIBED와 replication 준비 사이 gap, 이벤트 유실 가능, 상태 재조회 방향 확인 | 준비 신호만으로 이후 유실 제거 불가. 프로젝트 재현은 미실행 |
| V03 | SB-03 [Broadcast](https://supabase.com/docs/guides/realtime/broadcast) | Acknowledge messages: 서버 수신 ACK. Broadcast replay: private+DB Broadcast 한정, since·최대25·partition 보존 설명 | recipient/commit ACK 및 전체history 복구 보장으로 확대 금지. SDK 실제호환 미확인 |
| V04 | SB-05 [Authorization](https://supabase.com/docs/guides/realtime/authorization) | Interaction with Postgres Changes/Updating RLS policies: row read권한, channel policy cache, 연결/새JWT 시 갱신, 기존 연결의 철회 지연 설명 확인 | channel cache를 source-table RLS의 모든 내부처리에 일반화하지 않음. profile 철회의 원자적 SLA 미확인 |
| V05 | NK-01 [Authoritative Multiplayer](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/) | Match handler/state, Send data, Match migration: 서버 handler·in-memory state·과부하 drop·graceful migration 사례. Enterprise 복제 설명은 presences | 전체 gameplay state crash failover·자동 idempotency 증거 아님 |
| V06 | NK-02b [Best Practices](https://heroiclabs.com/docs/nakama/server-framework/introduction/best-practices/) | Match handlers/Launch checklist: hot loop I/O 회피, join 로드·종료 저장; 본문은 중간 내구성이 필요하면 coarse interval/중요 event 저장도 제시 | terminate 저장만으로 abrupt crash 복구 불가. 조사 원본의 Storing match state data 제목만 durable 저장 근거로 읽지 않음 |
| V07 | PH-01 [PUN2 Cached Events](https://doc.photonengine.com/pun/current/gameplay/cached-events) | Ordered Delivery/Special Considerations: properties→cache→live 순서와 unreliable 예외·cache 한계. PUN2 maintenance/LTS | PUN2 자료를 JS browser SDK나 Realtime v5 전 기능에 전이하지 않음 |
| V08 | SB-07 [Realtime overview](https://supabase.com/docs/guides/realtime) | Broadcast/Presence/Postgres Changes의 기능 구분 | 이 문서로 임의 game simulation 실행 지원을 입증할 수 없음. 기술적 불가능 전칭 판정 아님 |
| V09 | SB-09 [Realtime Pricing](https://supabase.com/docs/guides/realtime/pricing) | Messages/Peak connections: Pro/Team 초과 사용 $2.50/1M, $10/1K 및 quota 확인 | 구독·compute·egress·운영을 포함한 견적 아님. Free에 paid 초과 과금 적용 금지 |
| V10 | SB-10 [Messages usage](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages) / [Peak usage](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-peak-connections) | 과금·package 규칙; project별 peak 합산과 다음 whole package 경계 확인 | 총CCU 한 번·동시점 합계로 축약하지 않음. 실제 사용량 미입력 |
| V11 | NK-06b [Heroic Cloud Billing](https://heroiclabs.com/docs/heroic-cloud/concepts/organizations/billing-support/) | Idle deployments/Prorated billing: 사용자가 없어도 할당 자원 기준 과금 | configurator $600을 이번에 재확인한 최소 가격으로 쓰지 않음. deployment quote 필요 |
| V12 | PH-06 [Photon PUN Pricing](https://www.photonengine.com/pun/pricing) | Premium: $0.29/CCU·월최소$580, traffic 및 지역별추가GB. Enterprise plugin 조건 별도 | 해당SKU를 프로젝트 채택하지 않음. self-host 비용이나 Photon 모든 제품 가격 아님 |

## 보정·유보

1. 원본의 각 Q 아래 3A/3B/3C 분류는 가이드 순서와 다르다. 가이드의 **3A 권위/동기화/복구 → 3B private/권한/사이트 → 3C 실행/transport/운영**으로 판단을 재구성했다. 원본은 수정하지 않는다.
2. 원본에서 가격·limit·region·TTL·SDK version을 적었다고 프로젝트에 적용 가능한 값이 되지 않는다. 이번 V01~12 이외의 숫자/판본/링크는 원본의 확인 기록으로만 남기며 핵심 선택 근거로 승격하지 않는다. Postgres Changes 내부 즉시철회 보장, SDK 준비신호 연결, deployment 최종정책은 여전히 미확인이다.
3. Nakama의 in-memory 예제·graceful 저장/이동과 abrupt crash 시 복구는 분리한다. hot-loop I/O 회피 지침이 장기상태·확정결과의 소실 허용을 뜻하지 않는다. 필요하면 별도 영속 경계와 owner 복구를 설계·검증해야 한다.
4. 보안 정책 cache의 문서상 동작은 후보 평가의 제약이다. 악의적 client에게 token refresh/재가입을 요청하는 것만으로 철회 집행을 보장할 수 없다. 현재코드에서 실제 정보 유출을 재현했다는 판정은 하지 않는다.
5. 기존 STEP3 X/GGPO/WebAudio·STEP4A DOM/Fetch/ECMA/RFC 확인 이력은 해당 범위로 재사용했다. 이번 전체 재열람이나 외부 제품 통합 검증으로 표시하지 않는다.

**결론:** 제한을 유지하면 핵심 판단 입력으로 사용할 수 있다. 아래 [판단 원문](step-4b-astra-judgment.md)이 별도로 3A~3C 결론·보류·검증 닫힘 조건을 소유한다. 이 문서는 조사 수신/출처 검토 완료만 기록한다.
