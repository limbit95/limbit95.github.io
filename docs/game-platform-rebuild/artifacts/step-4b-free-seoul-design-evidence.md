# STEP4B — 후속 설계 판단 근거·계산·반례

2026-10-05 KST. 입력 CP0056 `0faf2f48b52b4dcaaa0e616a79c34b89ced7583c`. [판단 본문](step-4b-free-seoul-design-judgment.md)의 근거다. 공식 사실과 우리의 분석을 구분하며 실측은 없다.

## 1. 입력·공식 근거 재확인

원격 AGENTS→계획1.3→기록README→CURRENT→CP0056·DECISIONS→PR412를 확인했다. PR HEAD는 고정 입력과 같고 추가 commit은 없었다. 시작152개 로컬 파일의 Git blob이 입력 tree와 일치했다. CP0055·추가 결정, Sol의 권한/비용/검증, CP0053 권한 판단과 CP0054 조건·R01~10/E01~12를 대조했다. 과거153파일 정적 감사는 참조 근거이며 운영 DB 활성 경로를 이번에 전수 조회한 것이 아니다.

| ID | 공식 URL·확인 절 | 이번에 확인한 사실 | 판단과 한계 |
|---|---|---|---|
| S01 | [Auth sessions](https://supabase.com/docs/guides/auth/sessions) §session_id·signout·timeouts | session_id와 session row 연결, signout 시 제거, 시간 만료 후 row가 남을 수 있음 | 현재 session 조회와 외부 C/P 원자성은 별개. row 존재만으로 만료 허용 금지 |
| S02 | [Signout](https://supabase.com/docs/guides/auth/signout) §scope·JWT | global/local/others와 access token 잔존 | scope 밖 session까지 임의 철회 금지. JWT 자체로 즉시 철회 보장 불가 |
| S03 | [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization) §Updating RLS policies | 연결 중 권한 cache, 연결/새 JWT 때 갱신 | 고빈도 메시지마다 현재 DB 권한을 검사한다는 근거 없음 |
| S04 | [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html) §row locks | lock mode별 충돌·transaction 종료 시 해제 | current PG18 설명. 운영 버전/managed Auth 권한은 미확인. 외부 송신까지 원자적으로 만든다는 설명 없음 |
| S05 | [Supabase pricing](https://supabase.com/pricing) §Free·Pro·compute | Free500MB DB/sharedCPU·500MBRAM/5GB egress/별도 cached5GB/Storage1GB; Pro$25와compute credit$10 | 100명 처리 성능·기존 org quota 여유·실결제 미확인. Free1주 비활동 pause 조건도 존재 |
| S06 | [Realtime limits](https://supabase.com/docs/guides/realtime/limits) §Limits/tenant_events | Free200connections·100events/s·100joins/s, 초과 throughput disconnect | 2260events/s 대조 배제. 자동 reconnect가5초 보장은 아님 |
| S07 | [Backups](https://supabase.com/docs/guides/platform/backups) §Daily backups | Free는 정기CLI export/off-site 권고, Pro daily7일 | Free 자동 백업을 설계 전제로 두지 않음. DB backup에Storage object 본체 제외 |
| S08 | [CLI backup/restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) | schema/data/role/복원 절차의 구별 | 실제 버전·managed schema·Auth custom 변경·참가자 FK·복원 권한을 실험 전 명세해야 함 |
| S09 | [Egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress) §usage | 서비스별 반출과 cached/uncached 구분 | pooler/API/backup 응답과 사이트 소비 합산. Free에Pro 초과단가를 붙여 무조건 계속 운영 가능하다고 하지 않음 |
| S10 | [Lightsail pricing](https://aws.amazon.com/lightsail/pricing/) §IPv4 Linux/Object storage | 1GB$7/2TB,2GB$12/3TB,object5GB$1·100GB$3 | IPv6-only $5/$10와 혼동하지 않음. CPU2개 표기는100명 성능 보장 아님. 계정 SKU/checkout 미확인 |
| S11 | [Lightsail transfer](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-data-transfer-allowance.html) | Seoul VM 초과 internet outbound$0.13/GB; in/out이 allowance 소비 | ingress 초과 자체는 청구하지 않음. bucket/CDN의 초과 단가와 VM 단가 구분 |
| S12 | [Changelog](https://supabase.com/changelog) | Data API 노출 변경·PG14 지원 종료·Node20 지원 종료 안내가 있음 | 적용 버전·project 설정을 확인할 항목. 이 환경이 해당 버전이거나 이미 변경 적용됐다고 추정하지 않음 |

조회일2026-10-05. 일부 공급자 crawl표시는5일 전으로 표시되었다. 가격은 공개 표 선택 재확인이고 checkout 견적이 아니다. changelog.md 조회는 unsupported text/markdown 오류라 HTML로 대체했다. changelog 상세3개 click은 도구 인자 해석 오류였으므로 상세 영향 감사를 완료했다고 쓰지 않는다. 검색 일부는 무관한 결과를 반환해 근거로 사용하지 않았고 직접 공식 문서 조회를 기준으로 삼았다. managed Auth writer와 외부 egress를 묶는 지원 보장은 이번 검색으로 확보하지 못했다. 보장 미확보는 모든 구현의 불가능 증명과 다르다.

## 2. 비용 산식 재검산과 추가 판단

Sol 산식의 기본 비교는 일치한다. decimalGB, 30일 backup, 월730h는 비교 단위이며 실제 월일수·이용시간·압축률·packet은 미확인이다. 과금 단위와 실제 meter 차이는 실측 때 대조한다.

| 조합 | 기본USD | 환율1400/1500/1600·세율10% 가정 KRW |
|---|---:|---|
| 1GB VM+외부5GB bucket | 8 | 12,320 / 13,200 / 14,080 |
| 2GB VM+외부5GB bucket | 13 | 20,020 / 21,450 / 22,880 |
| 2GB VM+외부100GB bucket | 15 | 23,100 / 24,750 / 26,400 |
| 2GB VM+5GB bucket+VM snapshot20GB-month 가정 | 14 | 21,560 / 23,100 / 24,640 |
| 신규Pro+2GB VM,외부backup 미포함 | 37 | 56,980 / 61,050 / 65,120 |

실환율/세금/결제 수수료/모니터링/도메인/추가 저장·복원 전송은 UNKNOWN이다. 직접 운영 시간은 현금0으로 간주하지 않고 운영 부담을 별도로 평가한다. $13 조합의1500/10% 가정 여유8,550원은 $5.1818이며 VM의 청구되는 추가 outbound39.86GB 수준이다. 실제 순서별 in/out meter와 다른 비용이 있으면 여유가 줄어든다.

### gameplay·gate·backup의 분리와 합산

VM gameplay outbound = `active recipients × Hz × bytes × 3600 × hours / 10^9`. room8명이 payload 크기에 반영돼 있으면 다시8배하지 않는다. 사용자100명을 월 평균100명으로 예측하지 않는다.

| 대조 | 10h | 100h | 730h | 의미 |
|---|---:|---:|---:|---|
| VM L: out100×10Hz×256B | 9.216GB | 92.16GB | 672.768GB | inbound100×10Hz×64B는 각각2.304/23.04/168.192GB 별도 |
| VM H: out100×20Hz×1024B | 73.728GB | 737.28GB | 5382.144GB | inbound100×20Hz×64B는4.608/46.08/336.384GB |
| DB gate 전체5/s×256B | 0.04608GB | 0.4608GB | 3.36384GB | 저빈도 control 대조일 뿐 모든 C/P 보안 해결안 아님 |
| DB gate4000/s×256B | 36.864GB | 368.64GB | 2691.072GB | 원격 개별 gate 고빈도 구성의 한도 충돌 |

L730h는 in/out 합840.96GB, H730h는5718.528GB. 20% overhead 가정 H100h940.032GB,3TB(3000GB 비교치)까지 약319.14h. overhead는 실측치가 아니다. H월전체활성은2GB VM 기본 전송량과 충돌한다. 트래픽 최적화는 같은 gameplay/권한 의무를 충족하는 실측을 요구한다.

Free uncached 5GB에 대해 `E_site + E_auth + E_gate + E_backup + E_other ≤ 5GB`가 필요하다. 일부 항목은 제공자 meter 안에서 이미 합산될 수 있어 중복 계산을 피하고 최종 meter와 맞춘다. 각 항목은UNKNOWN이다.

- 일일10/100/500MB 전송은30일에0.3/3/15GB. 7copy 저장0.07/0.7/3.5GB,30copy 저장0.3/3/15GB. copy보존 감소는 일일 반출을 줄이지 않는다.
- 5gate/s를730h 유지하고 backup100MB/day면 **3.36384+3=6.36384GB**로, 다른 소비를 제외한 대조에서도Free5GB 초과다.
- backup10MB/day면 gate와 합3.66384GB, 다른 소비에 남는 비교치1.33616GB. 실제 여유라는 뜻이 아니다.
- 5GB 전부를 backup에 쓸 수 있다고 해도 일평균 전송 한계는166.67MB. 위5gate/s가 있다면 기타 소비 전에도54.54MB/day 수준이다. 압축/차등 성공을 미리 가정하지 않는다.
- 4000gate/s×256B가5GB에 도달하는 비교시간1.3563h. batch520rpc/s는 호출 수 감소일 뿐100명 검증·구체P 의무를 없애지 않는다.

Realtime relay는13방(12×8+4) 송신13+수신100,20Hz에서2260events/s,10h81.36M·100h813.6M이다. Free2M 도달 대조14.75분 이전에 초당100한도와 충돌한다. Pro 기본500/s도 부족하므로 메시지 초과비$2022.5만 계산해 실제 가동 가능한 견적으로 제시하지 않는다. Realtime200연결은 이 부하의 해결 근거가 아니다.

### backup 후보 판정

| 후보 | 판정 | 조건 |
|---|---|---|
| VM export→외부 bucket | 우선 기술 검증 후보 | 독립 감시/실패 재시도, 분리된 credential,30일 삭제 사본 정책, 복원 검증·반출 합산 필요 |
| 별도PC/서버 scheduler | 대조 후보 | 기존 장비의 가동·대응 근거가 있어야 추가 compute0 가정 가능 |
| SupabasePro daily | 현재 예산 조합 제외 | 신규 plan비와 외부copy 요구를 함께 계산. 자동 daily가 외부copy·삭제 의무를 대신하지 않음 |
| VM snapshot/로컬 dump만 | 외부DB backup 완성안으로 배제 | 원격 Supabase 상태를 포함하지 않거나 동시 유실 위험 |

무료 backup scheduler·archive 저장 서비스를 더 붙여도 managed Auth/외부 P 경계와 Supabase 반출 한도를 해결하지 못한다. 지원/삭제/복원 범위를 먼저 좁힌 후 추가 제품 비교를 한다.

## 3. 분석 반례와 실행 증거의 구분

| ID | 문서상 반례/논증 | 필요한 실행 증거 |
|---|---|---|
| A01 | check(true)→R→외부C/P는 사전 검사만으로 방지 못함 | 실 SDK/DB의 interleaving·동일 command trace |
| A02 | DB lock 종료→R→pause에서 깨어난 sender의 old allow 사용 | DB 강제 연결 종료·partition·process pause·transport queue 계측 |
| A03 | C<R→ack 유실→R→duplicate private P는 새 read 권한이 필요 | 결과 once와 새 P 거부를 분리한 trace |
| A04 | old owner DB write 차단과 WSS 송신 차단은 별개 | old/new 동시 실행에서 terminal1회·old P0 |
| A05 | 만료 Auth row 존재/옛 JWT 서명 유효가 현재 인가를 뜻하지 않음 | 직접Auth scope/시간 경계/refresh/운영 삭제 경합 |
| A06 | 29일 기록을 담은7일 full dump는30일 사본 삭제와 충돌 가능 | object version·임시dump·restore·삭제 proof |
| A07 | 과거 승인/운영권한 복원 뒤 재로그인만 하면 철회 부활 가능 | 재해 이후 fresh incarnation·현재 권한 재검증·미확인 deny |
| A08 | 60초 timer가 process pause로 늦게 실행될 수 있음 | deadline 전후 복구·timer지연에도 재개 없음 |

분석 반례의 구조가 있다는 판단과 구현에서 관측한 결함은 구분한다. 이번 A01~08은 실행 NOT_RUN이다. CP0056 U01~10은 해소되지 않았으며 판단 본문§2~4가 증명 의무를 좁힌 것이다. 정식6문서·현재 사이트 API·runtime은 변경하지 않았다.
