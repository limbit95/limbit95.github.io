# STEP4B — CP0062 지원·사용량·비용 판단 근거

고정 입력 CP0061 `b564d71b88e8317116cae8111a7c52b0b1206858`. 조회일 2026-10-06 KST. [판단](step-4b-operations-design-judgment.md)·[명세 보완](step-4b-operations-specification-amendments.md). 이번 추가 운영 SQL/사용자 행/SDK/backup 실행은 없다. CP0061 관측은 과거 시점 그대로 인용한다.

## 1. 공식 지원 재확인

| ID/공식 원문 | 확인 사실 | 판단에 사용하는 한계 |
|---|---|---|
| S62-01 [Signout](https://supabase.com/docs/guides/auth/signout), scopes | JavaScript 기본 global. local은 현 session, others는 현 session 제외. refresh 철회와 JWT 만료는 다름 | 저장소 scope 생략만 확인. 당시 로드된 exact SDK bytes/실제 동작은 미확인. 현재 CDN으로 과거 버전 대체 금지 |
| S62-02 [Sessions](https://supabase.com/docs/guides/auth/sessions), timeout/FAQ | timeout 설정은 refresh 시 확인, 만료 row 정리 지연 가능, 짧은 JWT의 clock/refresh 제약 | session row 존재·JWT 검증만으로 최종C/P 현재성 보증 아님. Pro 기능을 Free에 가정하지 않음 |
| S62-03 [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization), Updating RLS policies | 연결 동안 정책 cache, join 또는 새 JWT에서 재평가. 연결 중 철회 후에도 JWT 변경/만료까지 수신 가능 설명 | cached private channel을 A안 즉시 P 철회 구현으로 채택 불가. Postgres Changes RLS 설명도 외부 최종 egress 순서 보증으로 확대 금지 |
| S62-04 [Pricing](https://supabase.com/pricing), Free/Pro | Free DB500MB·Storage1GB·uncached5GB/cached5GB 별도·Realtime200/월2M. 자동백업·SLA 없음, 비활동1주 pause, Pro 기본$25 | 잔여quota·성능·실청구 보증 아님. DB provisioned8GB와 Free500MB 구별 |
| S62-05 [Realtime limits](https://supabase.com/docs/guides/realtime/limits) | Free100messages/s·100joins/s·200connections, presence20messages/s·client당30초5calls | transport별 계량/팬아웃·재연결 storm 별도. 100명 게임 성능 보증 아님 |
| S62-06 [DB backups](https://supabase.com/docs/guides/platform/backups) | Free 외부 export 권고, DB backup에 Storage object 본체 제외, custom role password 별도 | Free 자동백업 가정 금지. schema/data/roles·Storage별 복구 증거 필요 |
| S62-07 [CLI dump](https://supabase.com/docs/reference/cli/supabase-db-dump), dump/privilege migration | 기본 managed schema 제외, 기본 data/custom role 없음; 별도 옵션. target default privileges 주의 | 실제 CLI/mode/옵션 manifest 미확보. Auth data가 모든 옵션에서 포함/제외된다고 단정 금지 |
| S62-08 [CLI restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore), managed customizations | pg-delta/migra별 custom trigger/RLS 처리 차이, 관리 schema 안 custom function/index 누락 가능. Storage object 이동 별도 절차 | 여러 export가 한 snapshot이라는 보장 아님. 원래 권한·session을 되살릴 승인 아님 |
| S62-09 [Lightsail pricing](https://aws.amazon.com/lightsail/pricing/), IPv4 Linux/object storage; [transfer](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-data-transfer-allowance.html) | VM1GB$7/2TB·2GB$12/3TB, bucket5GB/25GB$1·100GB/250GB$3. VM in/out allowance 소비, 서울 초과 out $0.13/GB | VM과bucket meter 다름. 같은region bucket→Lightsail 예외는 Supabase→AWS 무료 근거 아님. 실제 계정 quote/세금·최소단위 별도 |
| S62-10 [S3 expiration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html) | 비version object는 비동기 제거, versioned current expiration은 delete marker, noncurrent 별도 | 정확 deadline 전체사본 삭제 증거 아님. Lightsail 삭제 API 계약은 별도 확인 필요 |

공식 문서에서 모든 managed Auth R/외부 C/P의 공동 최종 경계 보증은 이번에 확보하지 못했다. 보장이 없다고 기술 전반의 불가능을 단정하는 대신, 그 계약이 없는 현재 후보는 채택 HOLD다. Supabase CLI의 `/reference/cli/…` 경로는 fetch 오류, `/docs/reference/cli/…` 공식 경로로 확인했다. AWS 페이지는 조회 당시 crawler6일전, S3는2주전 표시였다. 조회일과 공급자 갱신/실청구일은 다르다. CP0060/61에 확인한 changelog와 실제 설치버전을 혼합하지 않고 이번 설치버전 재조회/변경은 하지 않았다.

## 2. 관측값의 범위

원천은 [CP0061 관측 기록](step-4b-operations-device-usage-evidence.md)과 [fingerprint](step-4b-operational-fingerprint-refresh.json)다. 이번 첨부를 다시 판독하거나 새로운 Dashboard/운영 snapshot을 만든 것이 아니다.

| 관측 | 값/범위 | 사용 제한 |
|---|---|---|
| Dashboard B | 현재기간2026-09-30~10-30, All projects,Free | 조직 집계; 프로젝트 단독·완료월 아님 |
| DB/Storage | DB0.055/0.5GB,Storage0.003/1GB | 앞선A Storage0.004는 별도 관측. 시점/집계 차이를 임의 오차처리 안 함 |
| 반출 | Egress0.026/5GB,Cached0.001/5GB | 합산10GB 게임/DB 한도 아님 |
| Realtime/Auth/Edge | peak4/200,messages920/2M,MAU5,Edge19 | peak의 동시성과 향후 여유를 보장하지 않음 |
| DB 보고서 C/D | Disk318.37MB,space used0.05GB,provisioned8GB,connections5 | 메타데이터·WAL/system 포함범위/집계기간과 DB size 다름. export/압축 wire 아님 |
| catalog | CP0061 SELECT1의12함수 MD5/ACL은 CP0059와 일치,PG17.6 | 선택 범위만. SDK/전체 writer/권한 안전성 미증명 |

표시값 차감 `5-0.026=4.974GB`, `2,000,000-920=1,999,080`은 반올림된 현재 표시 잔여의 산술값이다. 앞으로 사용 가능한 보장 할당이 아니다. 미래 기존 사이트 소비·오픈 후 workload·실청구는 UNKNOWN. 공식 월 한도와 현재 계정 quota override/정확 byte는 구별한다.

## 3. 분리 비용 산식과 민감도

decimal GB 사용. 30일 backup과730h 부하는 비교용 독립 축이다. 아래 현재 관측0.026+가상730h 합은 **스트레스 비교**이며 현재 청구기간 남은 시간 예측이 아니다. 실제 잔여기간 산식은 `E이미관측 + E남은기존사이트 + E남은gate + E남은backup/retry/검증 + E기타 ≤5GB`다. 월 전체 예측에는 기간 전체 기존소비를 넣는다. 미래 항을0으로 가정하지 않는다. cached5GB는 별도 저장소 cache 경로에서만 계산한다.

| 경로/예측 가정 | 계산값 | 해석 |
|---|---|---|
| DB gate 전체5/s·응답256B | 5×256×3600×730/1e9=3.36384GB | 응답 payload 하한 모델. 실제 header/TLS/추가쿼리·pool·실패 재시도 별도. gate 주기 승인 아님 |
| daily10MB backup30회 + 위gate + 관측0.026 | 0.3+3.36384+0.026=3.68984GB | 미계량 나머지1.31016GB는 실제 여유 보증 아님 |
| daily100MB backup | 3+3.36384+0.026=6.38984GB | 다른소비 전에도 Free uncached5GB 충돌 |
| 12h cut10MB/100MB,월60회 | 3.98984/9.38984GB(같은gate·관측 포함) | 주기 후보일 뿐.100MB는 명백한 반출 충돌 |
| DB표시55MB를 가상wire로 둔 예시 | daily5.03984/12h6.68984GB | 감도 예시만. DB size가 실제 dump크기라는 추정 금지 |
| gameplay100명×10Hz×256B out,64B in,100h | out92.16+in23.04=115.2GB,20%추가시138.24GB | 승인된tick/queue값·실측 아님. gameplay VM경로,DB/Realtime와 중복계량 주의 |
| 고부하100명×20Hz×1024B out,64B in,100h | 737.28+46.08=783.36GB,20%추가시940.032GB | 3TB 안이라는 것만으로 CPU/안전성/총비용 충족 아님 |
| 같은고부하730h | out5382.144+in336.384,20%추가시6862.2336GB | 3TB allowance 충돌. 정확 초과 out은 시간별 in/out meter 필요 |
| Realtime 113메시지×20/s 모델 | 2260/s,100h813.6M | 해당 모델은100/s·월2M 충돌. 실제 fanout 계량 검증 전 추정. gameplay Realtime 이전이 해결책 아님 |
| 저장 | 10/100MB×daily7cut=0.07/0.7GB;12h14cut=0.14/1.4GB | versions/temp/재작성/manifest 추가.7일 raw PII보존 승인 아님 |
| 검증·복원·삭제 | N검증×읽기wire+N복원×복구wire+재작성·retry bytes,최대동시임시저장 | 측정/방식 UNKNOWN. 같은region 무료 조건별 분리,DB source 재조회 반출 추가 |
| 기타 | 감시·로그·DNS/TLS·키관리·유급대응·수수료·초과저장/전송 | 제품 선택 전 견적 필요. 본인 무급시간은 별도 공수; 유료 대체 도입시 실제 추가비 포함 |

보호 P 횟수를 성능/비용 때문에 생략할 수 없다. gate 전체4000/s·256B·100h이면368.64GB여서 현 Free와 충돌한다. 저빈도 모델은 지원 가능한 구조가 먼저 성립할 때만 의미가 있다. 실제 game workload가 없는 상태에서 평균 gate5/s를 기본설계로 고정하지 않는다.

| 제품 후보,모두 Free서울 기준 | 기본USD/월 | 환율1400 / 1500 / 1600,세율10% 가정 KRW | 평가 |
|---|---|---|---|
| 서울 IPv4 Linux1GB +5GB bucket | 8 | 12,320 / 13,200 / 14,080 | 비용비교 후보,100명/품질·memory 미증명 |
| 서울 IPv4 Linux2GB +5GB bucket | 13 | 20,020 / 21,450 / 22,880 | 우선 검증 후보 유지,제품 채택 아님 |
| 서울 IPv4 Linux2GB +100GB bucket | 15 | 23,100 / 24,750 / 26,400 | 저장만 늘며 Supabase 반출 제약 해결 안 됨 |
| Pro +2GB VM,외부 backup 별도 | 37 | 56,980 / 61,050 / 65,120 | 기본료만 예산 충돌,자동전환 배제 |

`총추가KRW=(VM+bucket+초과전송/저장+검증/복원+감시/키관리/운영 등 USD)×실제환율×실제세금계수 + 원화비용 + 수수료`. 위 환율/10%는 민감도일 뿐 실청구 확인값이 아니다. $13/1500/10% 예시의 잔여8,550원도 모든 미계량비용을 감당한다는 증거가 아니다. Free 한도 초과에 Pro단가만 붙여 계속 Free 운영된다고 가정하지 않는다. 할인/일시무료 credit을 지속 예산으로 쓰지 않는다.

| 목표 | 항목별 결론 | 다음 증거 |
|---|---|---|
| C/P/R 안전성 | 증거 부족/HOLD; 사전allow 외부apply/send는 현 후보 충돌 | 모든R와최종effect/egress 지원계약·경합시험 |
| 100명/판8·p95≤250ms·재연결≤5초·모바일 | 증거 부족/HOLD | T12/T13 고정 manifest·실제 원격frame/실패전수 |
| 최소기록 열람·30일/탈퇴삭제·7일 복구점 | 조건부 가능 | 분리archive/삭제원천·allcopies·T09~11/B01~07 |
| daily/RPO24h | 조건부 가능;24h cut+양수지연은 충돌 | Δ/v/m 한계·자동retry·독립감시·실패모형 |
| 발견후24h 수동복구 | 증거 부족/HOLD | 실제운영calendar/부재대체·최악시간 모의복구 |
| 월추가3만원 | 조건부 비용 후보,총액 HOLD | 계정quote·기존소비/미래workload·wire·운영/검증비 |
| 모든목표 동시충족 | 증거 부족/HOLD | 같은단일구성의 위 증거 모두 필요 |

## 4. 지원 질문과 확보 우선순위 — 전송하지 않음

CP0060/61 초안을 유지하고 다음 답변 형식을 요구한다. “JWT 유효”, “이벤트를 구독”, “session row 조회”만 답한 경우 G03 해결 증거가 아니다.

1. **P0 Auth/egress**: Free managed Auth의 고정버전에서 global/local/others·직접 API·console 삭제·만료 각각 실제 R 지점과, 외부 최종C/P가 R 이후 실행되지 않도록 제공되는 지원 계약은 무엇인가? DB 연결 소실→process resume 반례도 포함한다. 지원하지 않거나 문서화되지 않은 부분을 명시해 달라.
2. **P0 session 최소권한**: 지원되는 API/DB권한이 어떤 session조건·expiry를 확인하는가? 내부 auth table lock/trigger를 다른 writer와 공동 직렬화에 사용하는 것이 지원되는가, upgrade 안정성과 한계는? 현재 connector postgres read권한을 adapter로 복제하지 않는다.
3. **P1 restore/delete**: CLI exactversion/mode별 schema/data/Auth/Storage/roles/customGRANT 포함·누락과 단일cut 계약은? 복원된 Auth session을 안전하게 무효화할 지원절차는? Storage는 object bytes·versions·late multipart/upload 삭제 완료 경계를 별도로 답변해야 한다.
4. **P1 계량**: 프로젝트와 조직 Free meter 귀속, uncached export/검증 반출 및 실제 서울 견적의 세금/수수료 확인 경로는? 비밀 없는 자료만 요청한다.

Sol은 source URL/버전/답변일/적용상품·scope/지원내용/명시적비지원/미답변을 분리한 수용표를 준비한다. 지원 답변을 받을 채널·응답 SLA는 Free에서 보장하지 않는다. 실제 문의 전송·지원상품 구매는 이번 범위 밖이다. 사용자에게 토큰·비밀번호·비밀키를 요구하지 않는다.
