# STEP4B — CP0070 후보 채택 판정

2026-10-07 KST. 고정 입력 CP0070 `a89363cee72960e8fdbf08b8b2636f4358b207ab`, tree `359d9024260c5df79f0a2be78957645a658553b6`. 시작 PR412 HEAD 일치/추가 변경0. AGENTS → 계획1.3 → 기록 README → CURRENT → CP0070/DECISIONS → PR 순서 확인. 이 문서는 Astra 판단 역할의 제출이며 별도 모델/독립 감사 실행 인증이 아니다.

## 결론 C — 현재 구체 후보와 요구 충돌

**현재의 primary 권한 조회 + 유효기한 permit + PG commit + 사전 검사 후 Node/native send 조합은, 마지막 검사 이후 정지까지 포함한 D0007의 최대5초 C/P 상한을 충족하는 후보로 채택하지 않는다.** 기능 부재 전체나 모든 대안의 불가능 판정이 아니다. 특히 P는 마지막 검사와 transport 인계 사이에 프로세스가 멈추는 실행을 배제하지 못한다. C도 DB 내부 최종 검사와 실제 commit 사이의 지연을 deadline과 원자적으로 묶는 집행 근거가 없다. 실제 실패 시험을 수행했다는 뜻이 아니다.

S1에는 별개의 최소권한·현재 session predicate·writer/cascade 설계 조건이 남는다. 그 미확인만으로 C 판정을 한 것이 아니며, 그것을 보완해도 S2 반례는 남는다. NOT_RUN 때문에 설계를 보류하는 것도 아니다. 반면 DB 권위 처리, 중복 원장, owner anchor, 송신 gate 분리는 앱이 구현할 수 있는 설계 요소다. 공급자의 종합 SLA나 완성된 게임 API를 요구하지 않는다.

**추천 경로는 보장 범위에 관한 사용자 결정 한 번이다.** 아래의 제한된 운영 장애 범위 제안을 검토하고, 승인된 경우에만 남은 S1 조건과 계약 정합화를 한 작업 범위로 묶는다. 이번에 정책을 채택하거나 G03을 해소하지 않는다. 동일 Sol 자료 조사/공급자 문의를 다시 지정하지 않는다.

## 근거의 수준

입력: [CP0070](../checkpoints/CP-0070-step-4b-s1-s2-binding-specification.md), [바인딩 표 S1/S2·writer·관측점](step-4b-s1-s2-binding-specification.md), [검증](step-4b-s1-s2-binding-validation.md), [CP0069 보완](step-4b-g03-practical-design-review.md), [D0006/D0007](../DECISIONS.md), [CP0067 원래 제안](step-4b-g03-practical-scope-proposal.md). 새로운 제품/가격 사실이나 운영 조회를 추가하지 않고 고정 입력의 지원 근거를 사용했다.

| 구분 | 이번 판단에 사용한 범위 / 확대 금지 |
|---|---|
| 공식 지원 사실 | CP0070에 인용한 Supabase session/logout/JWT 설명, PG transaction/lock/clock/timeout, Node write와 Linux send의 기능. 이 기능들이 결합된 최종5초 보장은 공식 사실 아님 |
| 저장소 정적 정의 | supabase-js@2·scope 없는 signOut, 사이트 RPC/caller. 실제 로드된 exact SDK/managed Auth 버전 증거 아님 |
| 운영 관측 | CP0059/61 선택 함수12개·ACL/trigger/RLS/FK/Auth SELECT 권한. 전수 writer·동일 시점 전체 환경·현재 적용 불변 보증 아님 |
| 설계 결론 | 저장 순서와 송신 순서는 독립 집행 의무. 사전 검사와 뒤의 부수효과는 동일 원자 연산이 아님. 아래 C 판정은 이 조합/장애 모델에 한정 |
| 미확인 | 실제 만료/삭제 predicate와 최소권한 바인딩, 모든 privileged writer, old gate 격리·실제 handoff, 최종 지연 상한 |
| 실행 증명 | 실제 R/C/P 순서·5초·권한 경합·resume/owner/cascade·성능/복구/삭제. 모두 NOT_RUN |

문서에서 계약을 못 찾은 항목은 ‘근거 미확보’다. 공급자가 명시적으로 지원하지 않는다고 바꾸지 않는다. 공개 Auth 소스≠현재 managed 버전, session row/getUser/JWT 하나≠현재 권한 전체, connector postgres≠미래 adapter 역할을 유지한다.

## S1 항목별 판정

| 항목 | 판정 | 실제 연결 / 남은 설계 조건·변경 영향 |
|---|---|---|
| JWT identity | 조건부 채택 가능 | 검증된 issuer/audience/signature/sub/session_id/exp를 서버에서 묶고 호출자 입력 subject 거절. exact SDK/key 방식 고정은 구현 manifest 의무; JWT만으로 session/current 권한 대신하지 않음 |
| 현재 user/session·만료·삭제 | 설계 필수 근거 부족 | primary session/user 조회와 실제 활성 만료/삭제 조건을 하나의 predicate로 명시해야 함. getUser/row 존재/refresh만으로 전체 대체 불가. global/local/others 대상 session과 direct API/console/delete도 같은 predicate에 연결해야 함 |
| 최소권한·auth.uid 경계 | 조건부 채택 가능 | 서버 전용 좁은 predicate 함수 우선 추천. 검증 subject/session만 수용, 고정 search_path·PUBLIC 실행 금지·최소 SELECT owner와 명시 caller. 실제 Auth read/RLS 허용 및 SECURITY DEFINER owner/GRANT 명세 확정은 설계 잔여. 임의 claims 설정을 신원 검증으로 간주하지 않음 |
| 승인·가입·역할·permission | 설계상 채택 가능(판정 규칙 범위) | 승인/운영 권한 조건과 RPC caller는 CP0070 연결표 사용. public.is_admin와 private 검사 차이 보존. vNext 참가/view는 DB에서 추가 검증. 실제 적용/새 객체는 미구현 |
| 사이트 writer·직접 SQL | 조건부 채택 가능 | 공통 pending fence → 새 C 거절/송신 닫기·진행 중 인계 종료 확인 → 같은 incarnation ACK → writer commit. admin_set_member_status/role, system_admin_set_permissions, 가입 RPC, trigger, bootstrap/service role/운영 SQL 모두 연결. 임의 privileged SQL을 신뢰만으로 제외 불가: 실제 권한 제한 또는 동일 폐쇄 절차의 강제 경계 필요 |
| Auth 삭제 cascade | 설계 필수 근거 부족 | auth.users→profiles/join/permission cascade는 내부 사이트 R과 다른 외부 Auth R로 식별. 임의 GUC로 우회 표시 금지. caller/origin을 안전하게 구별하는 설계와 기존 Auth 삭제를 막지 않는 경계 필요. 모든 cascade에 사이트 gate ACK를 요구하는 trigger는 지금 채택 불가 |
| 외부 logout/API/console 경로 | 조건부 채택 가능(대상 모델 범위) | default global 설명과 exact SDK 동작 분리. 실제 R을 원천으로 새 검증 결과의 신선도 제한. 외부 writer에 사이트 ACK를 강제할 수 있다고 가정하지 않음. 현재 session/만료 predicate 및 S2 만족 전 전체5초 지원 승인은 불가 |

기존 Auth 교체·기존 게임 이관은 제안하지 않는다. 다만 ‘기존 보존’은 사이트 공통 권한 writer까지 무변경이라는 뜻이 아니다. 내부 R의 gate 폐쇄를 강제하려면 공통 RPC/trigger/권한 또는 운영 SQL 진입 절차에 변경 영향이 있다. 기존 승인·가입·관리·삭제 및 기존 게임 회귀 검증이 필요하며, 호환 가능한 실제 writer 목록/권한 경계 확정 전 배포 불가다. fence/anchor/ACK는 앱 명세 제안이며 운영에 이미 존재하는 API가 아니다.

## S2 — 집행 위치와 반례

| 경계/장애 | 판정과 이유 | 필요한 증명 또는 한계 |
|---|---|---|
| C: worker가 DB 요청 전에 정지 | 조건부 채택 가능 | 재개한 worker permit을 그대로 쓰지 않고 DB primary에서 새 검사. C는 응답/시뮬레이션 갱신이 아닌 실제 DB commit |
| C: worker 정지, DB는 계속 실행 | DB backend 정지와 구분 | 이미 제출된 transaction은 worker 정지로 취소됐다고 할 수 없음. 실제 DB 순서로 판정. retry는 원장에 의해 mutation 중복0, 응답은 새 P 인가 |
| C: DB 최종 검사 후 backend/host 정지, R 후5초 지나 commit | 필수 집행 근거 미확보 / 무조건 상한으로 채택 불가 | clock_timestamp/timeout은 검사·취소 기능이지 deadline과 실제 commit의 원자 조건이 아님. 같은 DB lock을 공유하는 R은 C보다 뒤로 직렬화될 수 있어 이 반례가 자동 성립하지 않음. 독립 session/외부 R에는 그 직렬화가 입증되지 않음 |
| 저장 owner fencing | 설계상 채택 가능(순서 범위) | 같은 DB anchor 잠금/CAS에 C와 소유권 전환을 참여시켜 old commit을 takeover 전으로 정렬하거나 이후 거절. raw write 우회 차단 필요. 이것은 시간 상한/송신 fencing 증거 아님 |
| P: 마지막 검사 이전 정지/queue 대기 | 조건부 채택 가능 | 인계 직전 신선도·현재 gate/owner·recipient/session/view/payload 다시 검사. snapshot 생성/duplicate/재시도/늦은 callback 모두 동일 경로 |
| P: 마지막 검사 후 sender 정지→외부R→5초 초과→send | 현재 수단과 요구 충돌 | 다음 실행 명령이 write/send라면 timer/no-await/nonblocking도 새 검사를 삽입하지 못함. native 부분 인계는 수락된 byte만 P이며 나머지는 다시 검사해야 하지만 검사→syscall 틈 자체는 남음 |
| P: host 전체 정지 | 별도의 확대된 장애 가정 | 같은 host watchdog도 멈출 수 있음. 독립 격리 수단 없이 ‘재개 전 반드시 차단’ 보장 불가. 이 경우를 제외해도 sender 단독 after-check 정지 반례는 남음 |
| old worker/old gate | 조건부 채택 가능 / 실제 격리 수단 잔여 | worker가 socket을 소유하지 않는 단일 송신 경계 추천. gate 교체는 old sender 종료 또는 실제 network 격리 확인 후에만 허용. 새 generation 표기만으로 살아 있는 old socket 차단 불가. 격리 미확인 시 새 gate도 닫힘 |
| P 이후 OS/TLS/network 전달 | 요구상 회수 범위 밖 | 이미 최종 취소 불가 handoff한 데이터의 지연 전달은 새 P가 아님. app/SDK의 취소 가능 queue를 P로 앞당겨 충족 표시하지 않음. socket.write 반환/callback만으로 실제 TLS 인계 확정 불가 |
| 복원/장애 deadline | 설계 규칙 유지 | 새 incarnation·격리 복원·현재 권한/삭제 기준 검증 실패 시 닫힘. old session/owner 부활 금지. 최초 실패 deadline은 durable하게 유지하고 retry/재시작으로 초기화 금지. 멈춘 process의 timer가 정각에 실행됐다고 주장하지 않음 |

d+L+b+e≤5초는 조건식이다. 검증 시작 기준 d와 읽기 신선도, permit L, 실제 최종 commit/handoff까지 b, clock 오차 e를 바인딩해야 한다. 허가 조회 완료 시각에서 다시 시작하지 않으며 UNKNOWN을0으로 넣지 않는다. b를 제한할 전제 없이 L만 짧게 하는 것으로 해결되지 않는다. 새 질문/기간/제품을 채택하지 않는다.

## 장애 가정 감사와 실제 정책 차이

CP0067/68에는 process pause 후 재검증, check 후 무기한 apply/send 불허가 있었다. 따라서 **after-check process pause 자체는 CP0070이 새로 발명한 의무가 아니다.** 반면 DB backend·전체 host·watchdog 동시 정지·임의 명령 사이 무제한 정지를 모두 별개의 승인된 제품 장애 모델로 단정한 것은 과도한 확대다. 기존 기록은 보존하되 이번 판단은 ‘명시된 pause 의무’와 ‘무조건 시간 보장을 시험하는 추가 반례’를 분리한다.

이 확대를 제거한다고 이미 있는 프로세스 정지 반례나 최대5초 요구가 사라지지는 않는다. 일반 앱이 가능한 정상 조건을 설계 전제로 밝히는 것은 정당하지만, 이전에 예외가 없던5초 보장에 정지 예외를 새로 넣는 것은 실제 보장 변경이다. 단순 해석 정리라고 승인 없이 적용하지 않는다.

| 사용자 선택 | 실제 보장 차이·위험 | 추천 |
|---|---|---|
| 1. 명시한 운영 장애 범위의5초 기준으로 변경 제안 | 정상 실행·일반 지연/통신 단절/이벤트 유실은 fail-closed 검사 대상으로 유지. 최종 검사 후 runtime/DB/host가 장시간 정지한 경우의 무조건5초는 보장하지 않음. 재개 시 새 작업을 닫고 재검증하되 이미 마지막 검사를 지난 C/P가 늦게 완료될 잔여 위험이 있음. 이를 ‘재개 후 언제나 추가 제공0’으로 약속하지 않음 | **추천, 미채택.** 기존 Auth/DB/gate 방향에서 구현 가능한 범위를 정직하게 계약화하는 경로. 오픈 전 경계·환경을 고정하고 범위 안에서5초 위반1건도 실패 처리. 모든 장애를 사후 예외로 돌리거나 percentile로 바꾸지 않음 |
| 2. 현재의 예외 없는 상한 유지 | 위 정지에서도 실제 C/P를 기한 이후 막아야 함. 현재 후보 채택 불가, 구체적으로 다른 deadline 집행 구조 확보까지 HOLD | 더 강한 보장이지만 현재 확보된 수단으로 진행 가능하다고 약속할 수 없음. 다른 모든 구조 불가능은 아님. 공급자 문의/반복 조사 자동 재개 없음 |

선택1도 known expiry에 의도적인5초 유예를 붙이거나 인지 실패 뒤 추가 허가하는 정책은 아니다. 다만 최종 검사를 이미 지난 동작의 장시간 정지라는 같은 물리적 틈은 expiry/실패/60초 집행에도 영향을 줄 수 있다. 이 예외를 숨기고 해당 경계만 절대 보장한다고 쓰지 않는다. 처음부터 무권한인 데이터에 새 허가를 발급하는 것은 계속 금지한다. 기술 알고리즘은 사용자가 고르지 않으며, 필요한 선택은 이 **잔여 위험을 허용할 보장 범위** 하나다. 승인 전 D0007/기존 기준 그대로 유효하다.

## 설계·실행·오픈 상태와 종료 경로

| 항목 | 설계상 완료 | 남은 필수 설계 조건 | 구현·시험 / 오픈 blocker | 다음 담당·작업 |
|---|---|---|---|---|
| G03 OPEN/BLOCKING | C/P/R 경계, 저장/송신 분리, 현재 후보 C 판정 | 위 정책 선택; 선택1이어도 S1 session/최소권한/writer/cascade·gate 격리·transport 배치 확정 필요 | 실제 R→C/P·owner·queue/duplicate/restore·권한 시험 NOT_RUN. 구조 잔여는 시험으로 대체 불가 | 사용자: 보장 범위 한 가지 결정. 그 전 새 조사 없음 |
| G01·G05 PARTIAL/OPEN | 기존100명/판8·품질·비용 산식/후보 보존 | 제품 조합·총비용/품질 달성 조건은 기존 잔여 그대로 | p95/각 재연결5초/모바일·총비용 증거 미확보, 기본 서버료로 충족 확정 금지 | 후속 설계 정합화 때 기존 잔여만 처리 |
| G02·G04 PARTIAL/OPEN | 재연결·인지 실패·60초·durable 기록/재해 구분 보존 | 선택 정책 영향 및 현재 권한/삭제 원천·복구/삭제 집행 조건 확정 | crash/RPO/RTO/allcopies삭제 NOT_RUN | 후속 설계 정합화·허용된 구현 시험 분리 |
| G06 | 두 Probe 적용만 SCOPED_DESIGN_RESOLVED | 범위 확대 없음 | 해당 실행은 미실시 | 기존 후속 범위 유지 |

시험 보완은 CP0070 관측점을 유지한다. R은 실제 효력 또는 보수적 구간, C는 실제 commit, P는 부분 byte와 최종 irreversible handoff다. timestamp/xid/callback만으로 실제 순서 대체 불가. trace 유실·clock 오차 미확인·R/P 관측 불가는 INCONCLUSIVE/오픈 차단. T01~14는 현재 D0007 기준 그대로이고 정책 선택1 승인 시에만 정지 전/후·host/backend/sender별 fault manifest와 예외 위험을 명시적으로 변경한다. NOT_RUN 자체는 설계 종료의 자동 차단 이유가 아니다.

STEP4B 종료에 필요한 일은 (1) 이 보장 범위 결정, (2) 채택 가능한 구조의 남은 S1·gate/transport 배치 및 기존 다른 게이트의 설계 필수 잔여를 한 번 정리, (3) 별도 허용 범위에서 정식 runtime/sync·security/site·trace·risks·validation과 루트 계획1.3 STEP4B의 설계/실행 종료 조건을 정합화하고 설계 승인하는 것이다. 실행 의무는 후속 구현/시험과 오픈 blocker로 이관하되 구조적 공백은 이관 불가. 계획의 STEP6 전 공통 runtime 금지 및 후속 단계 승인 경계 유지. 새 감사/근거 수집 checkpoint를 기본 필수 단계로 추가하지 않는다. 달력상 완료일 약속 없음.

100명/판8·세금포함월추가30,000원·원격권위화면p95 250ms·정상망회복각재연결5초·모바일5기능·본인참가/필요운영자 열람·최초종결+30일삭제·탈퇴unlink·daily외부/RPO24h·발견후24h수동복구·최근7일복구점/삭제우선·Free서울·기존 운영시간 유지. 미래 workload/기존소비/실청구 UNKNOWN. 비용·단말·backup 명세 재작성 없음.

**다음 담당/작업 하나: 사용자 — 선택1의 실제 보장 변경 수용 여부 결정.** 추천은 미채택이며 DECISIONS 보존. 이번은 현재 후보의 판단 제출로 종료한다. STEP4B IN_PROGRESS / 전체 완료·구현 HOLD. 정식 산출물·계획·코드/SQL·과거 기록 보존; 구현·시험·권한 변경·문의·job/dump/복원·STEP5A·병합·main 없이 원격 제출 확인 뒤 정지.
