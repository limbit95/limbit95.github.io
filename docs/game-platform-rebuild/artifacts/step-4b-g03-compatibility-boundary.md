# STEP4B — G03 추천 방향의 기존 코드 호환 경계

## 입력과 결론

2026-10-06. 고정 입력 CP0065 `7cb224c36d934be90e3c237d0bed2d105b9fa181`, tree `247ab29ddd3b84a2b0768d85f592a7c16ee71c6a`. 시작 PR412 HEAD 일치/추가 변경0. 기존 브랜치/integration base 유지. [CP0065](step-4b-g03-no-inquiry-alternative.md)의 사이트·게임 변경 경계를 선택 소스에 대입했다.

**공통 로그인 adapter만 교체하면 기존 게임을 그대로 유지하면서 G03가 해결된다는 결론은 채택 불가.** 별도 client, 직접 RPC/Realtime, Auth 사용자 FK/OTP가 존재한다. browser wrapper는 모든 R의 권위 경계가 아니다. 기존 Auth와 게임을 유지한 vNext 격리는 후보지만 managed R와 최종 C/P 연결은 미증명이다.

이번 확인은 고정 입력의 선택 소스 정적 경계다. 전수 소비자/writer 감사·운영 적용·exact SDK 동작·호환 시험이 아니다. CP0059/61 관찰은 당시 이력. 문의·운영 재조회·반복 공식 문서 조사는 없음.

## 선택 소스와 영향

줄 번호는 고정 입력 기준. baseline보다 후속 migration이 우선이며 정적 SQL을 운영 정의로 취급하지 않는다. 선택 blob은 [검증](step-4b-g03-compatibility-validation.md)에 기록한다.

| 경계 | 저장소 정적 근거 | 변경 시 영향 |
|---|---|---|
| 사이트 공통 client | `js/supabaseClient.js` L1~29: 같은 URL/key로 생성, persist/refresh/PKCE | Auth만 교체해 DB/RPC/Realtime 인증이 보존된다고 할 수 없음 |
| 사이트 Auth | `js/auth.js`: profile/admin RPC, getSession/events, password/OTP/recovery/updateUser, scope 없는 signOut | 가입·복구·Push·권한 refresh 포함. local lifecycleEpoch는 서버 송신 fence 아님 |
| shared 입장 gate | `games/shared/accessGate.js`: 전달된 인증/승인 state 판정/구독 | 재사용 seam 후보. managed R와 C/P 직렬화 primitive 아님 |
| 공통 client 게임 | `games/no-thanks/main.js` L7~12/L4036~4038; `marble-game/js/multiplayerApi.js` L1/L13/L65; `onlineGameApi.js` L1/L9/L194/L271 | RPC/Realtime/presence 파급. 파일 무변경과 동작 호환은 별도 증명 |
| 별도 client 게임 | `the-game/js/supabase.js`, `liar-game/js/supabase.js`: 자체 createClient/persist/refresh/PKCE | 공통 client 하나의 교체로 포괄되지 않음 |
| 별도 client 소비 | `the-game/js/multiplayerApi.js` L1~4/L111~148; `liar-game/js/api.js` L1~4/`sessionGuard.js` L17~39 | 직접 RPC/Realtime 및 별도 getSession/event 경로 |
| 회원 식별 | `supabase/site/baseline/01_members.sql` L12/L38: profiles/join_requests → auth.users CASCADE | UUID/FK/탈퇴 cascade 호환 필요 |
| 가입 정적 이력 | `20260909094910_native_auth_otp_signup.sql` L78~97/L154~155; `20260909124500_enforce_native_auth_otp_signup.sql` L5~19 | submit_join_request는 auth.uid/확인된 Auth email에 연결. 초기 08_auth_profile만으로 현재 trigger body 주장 금지 |
| 게임 DB 예시 | `supabase/no-thanks/20260921225000_no_thanks_room_lobby_foundation.sql` L7/L23/L41/L115~121/L257 | auth.users FK/auth.uid 계약. 같은 UID 전달과 session 철회 의미 보존은 다름 |

다른 게임/HTML/Edge/SQL 전체의 영향 없음은 주장하지 않는다. 설정값·키·토큰·실사용자 데이터 수집/기록 없음.

## 변경 후보 판정

| 후보 | 유지/변경 경계 | 판정 |
|---|---|---|
| 공통 browser adapter만 변경 | 별도 client·직접 Auth API/console/SQL R 통제 불가. check→독립 apply/send 틈 유지 | 충족 구조로 배제 |
| 기존 Auth/게임 유지 + vNext 전용 권위/송신 | 기존 게임을 손대지 않는 격리 방향. managed R 실제 효력과 같은 권위 순서에 C/P를 넣는 지원 계약·최종 송신 primitive 필요 | 조건부 후보, G03 HOLD |
| 사이트 Auth까지 통제 가능한 원천으로 변경 | 공통/별도 client·OTP/recovery·토큰/role/UID·FK/cascade·RPC/Realtime·Push·console/SQL/expiry 계약 호환 필요 | 광범위 영향, 미채택/HOLD |

**추천은 기존 사이트·게임을 보존한 격리 후보 유지다. 운영 채택은 아니다.** 즉시 Auth 교체는 무이관·비용·운영·안전성 증거가 없다. 자체 Auth도 OS/egress/expiry 원자성을 자동 해결하지 않는다. managed Auth를 신원 전용으로 바꾸거나 별도 game token만으로 기존 R 의미를 제외하지 않는다. 제품 구매/교체 승인을 요청하지 않는다.

## 다음 판단에 필요한 최소 결과물

| 부족 항목 | 판정을 바꾸는 결과물 | 담당 |
|---|---|---|
| managed R와 C/P 연결 | 실제 R 효력과 최종 C/P를 함께 통제하는 구체 primitive/지원 계약. 과거 getUser 성공/이벤트 도착은 불충분 | 구조 담당 |
| actual egress·expiry·old owner | pause/partition/잠금 소실 후에도 R 이후 새 불허 C/P 0을 보장하는 경계와 관측 방법. DB 저장/송신 fence 독립 증명 | 구조 담당 → 별도 허용 단계의 시험 담당 |
| 격리/교체 호환 | 선택 호출 경로 포함 전체 영향도와 토큰/UID/RPC/Realtime/가입/탈퇴 계약 대응 | 구체 후보가 나온 뒤 담당 |
| 실제 제품 실현성 | 위 primitive를 제공하는 실제 후보와 총비용/100명·8명/품질/복원 검증 경로 | 후보 특정 후 담당 |

다음 한 가지 추천 경로는 **구체적인 권위 실행 경계 후보 검토**다. “어느 시스템의 어떤 원자적 연산이 모든 R와 실제 최종 C/P를 함께 순서화하는가”를 먼저 특정한다. 저장소만으로 그 primitive의 존재를 확인할 수 없다. 같은 CP0063 검색·요약 또는 조건만 적은 새 판단 문서를 반복하지 않는다. 새 경계가 없으면 HOLD를 정지 사유로 보고한다.

R 이전 유효하게 완료된 P의 늦은 도착과 R 이후 새 불허 P를 구분한다. app/SDK/TLS/OS/proxy queue·socket write·실제 egress·in-flight를 합치지 않는다. snapshot/duplicate ack/늦은 callback은 새로운 P 인가 대상. DB 저장 fence로 old owner 송신을 증명하지 않는다. 복원은 현재 권한/삭제 원천과 새 incarnation 검증 필요. RPO24h는 철회 rollback 허용이 아니다.

이번 “진행”은 실제 교체/구현/시험 허용이 아니다. STEP6 전 runtime 금지 유지. 실행 증거가 필요하면 허용 단계와 범위를 먼저 명시한다. 일반 check→send prototype은 이미 배제한 반례를 반복하므로 추천하지 않는다.

## 게이트와 정지 조건

| 게이트 | 상태 | 다음 필수 작업 |
|---|---|---|
| G03 | OPEN/BLOCKING | 구체 권위 primitive 판정 후 경합/만료/중복 P/snapshot/old owner/복원 실행 증거 |
| G01·G05 | PARTIAL/OPEN | 실제 후보 후 총비용/부하/모바일/품질 증거 |
| G02·G04 | PARTIAL/OPEN | 자동 deny/pause/60초·재연결·durable 기록·복원/삭제 실행 증거 |
| G06 | 두 Probe 적용 판단만 SCOPED_DESIGN_RESOLVED | 범위 확대 없음 |

STEP4B IN_PROGRESS / 전체 완료·구현 HOLD. [CURRENT](../CURRENT.md)의 100명/판8·세금포함3만원·p95 250ms·재연결 각5초·모바일·즉시 차단/60초·기록/삭제/백업/복구와 운영 조건 그대로. 미래 사용량/소비/청구 UNKNOWN. 행동 시험 NOT_RUN.

사용자에게 지금 추가로 요구할 비밀·단말·사용량 자료는 없다. 기술 경계 부족을 사용자 정책 승인으로 대신하지 않는다. 정식 문서·과거 판단·DECISIONS·코드/SQL 보존. 정식 반영·구현·실제 시험·권한 변경·문의·job/dump/복원·STEP5A·병합·main 없이 제출 뒤 정지.
