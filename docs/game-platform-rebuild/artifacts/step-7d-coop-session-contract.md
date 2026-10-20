# STEP7D S0 — 첫 선택 모델/Adapter 계약 명세

2026-10-20 KST · 담당 **Sol/Codex** · **S0_DOCUMENT_RESULT_REVIEW_PENDING**.
**STEP7D 미완료 / 모델·Adapter 미착수 / vNext 행동 NOT_RUN / 운영 UNKNOWN**.

## 1. 지위·입력·적용 범위

사용자의 2026-10-20 S0 실행 지시는 새 구체화안의 **단계적 접근 A와 문서 정식화·관련 검증·commit/push·integration base 검토 PR 제출**을 허용한다. 문서 결과 최종 승인, 모델 구현·실제 지원·Guard/정책 변경·병합 허가는 아니다. [Astra 새 판단 원문](game-platform-vnext-step7d-model-adapter-restart-astra-judgment.md) §4~9를 의미 범위대로 반영한다. 정식 원문 보존본은 새 설계 판단이며 과거 승인 원문을 대체하지 않는다.

- 고정 integration: `bb037653ca81bb294aafa16c248030ccc7eb7a87`, tree `760d5d13f0f98ec16fcc8c4f29fed21389b7c942`. PR429 실제 merge이며 이전 head `6b630c18e6a1ba1e7e02b95cdabed21670bb2326`과 commit identity가 다르다.
- 별도 고정 main M: `0e4089f345c1f0a33c86c96a1f07a9dab484cc2e`, tree `d4f9b568f705a17cca3274f0862d46f5b56b3b76`. 착수 시 현재 remote는 두 고정 ref와 일치하며 이후 변경0이다.
- 초기 `game-platform-vnext-step7d-plan-and-handoff-2026-10-14.md`와 `game-platform-vnext-step7d-astra-judgment-2026-10-15.md` 및 승인 보존본은 **미확보**다. 새 자료/보존 경로 없이 실패 검색을 반복하지 않았다. 원문 복원 완료·과거 모델 정책 승인으로 기록하지 않는다.
- 상위 owner는 [MO1~6](../../game-platform-model-contracts.md), [CA1~4](../../game-platform-capability-contracts.md), [LI](../../game-platform-lifetime-contract.md), [Target §2.1/6.1](step-6-target-architecture.md), [I2/I3](step-6-slices-and-verification.md)다. 이 산출물은 신규 부분 모델의 설계 명세이며 CURRENT rulebook의 경쟁 본문이 아니다. 기존 consumer에는 소급 적용하지 않는다.

### 1.1 계약 후보와 revision

설계 명세의 계약 후보 식별자는 **`GP-COOP-SESSION/1`**로 기록한다. 고정 base의 `docs/`, `games/`, `tests/`, `scripts/`에 동일 식별자/모델 선언이 없음을 확인했다. `/1`은 이 부분 의미의 **첫 설계 revision 후보 / 결과 REVIEW_PENDING**이다. oracle 설정·Core resolver·Registry의 지원 등록이 아니며 wire revision이나 구현 호환 인증도 아니다.

| 구분 | 이 명세에서의 의미 |
|---|---|
| 문서 계약 | GP-COMMON/1·GP-LIFETIME/1·GP-MODELS/1·GP-CAPABILITIES/1·GP-GENRE-REALTIME-COOP/1의 유효 scope를 참조 |
| 선택 모델 후보 | GP-COOP-SESSION/1: 첫 Probe의 저빈도 session/control와 단일 client adoption/recovery 부분만 |
| wire revision | 실제 transport envelope 정의 시 별도 명시. `/1`과 자동 동일 취급하지 않음 |
| 구현 revision | 실제 source commit/build SHA와 호환 증거. `latest`·정수 대소만으로 호환 판단 금지 |
| owner/stream revision | 해당 session/match/view/owner 범위의 ordering. 문서 revision·배포 SHA와 별개 |

**단계적 접근 A**는 membership·ready/start/rematch·command identity·terminal 기록 연결 및 단일 채택/복구를 먼저 구현하는 순서다. 첫 Probe의 이동·상호작용 중심 작은 실시간 2D 협동 목표와 R01~13/모바일5기능/전체 완료 의무를 유지한다. 이 부분 모델을 턴제 제품 전환, 연속 이동·충돌·시간 진행 전체의 지원 또는 STEP7D 완성으로 표시하지 않는다.

연속 보호 상태는 승인 J01의 신뢰 simulation owner 방향을 따른다. 구체 확정·인가·fencing 경계는 미확보다. 저빈도 PG finalizer 설계를 매 frame/연속 상태 전체로 확대하지 않고 memory apply를 기존 C로 부르지 않는다. 해당 연속 영역은 **미지원 / 후속 S2**다.

## 2. owner·API 의미와 명령/응답/확정

| owner / 실제 기존 경계 | 필요한 API 의미 — 이름·서명은 미동결 | 소유하지 않는 책임 |
|---|---|---|
| Core `games/shared/vnext/core/executionBindings.js`, `executionScope.js` | 기존 register/start·capture/commit/advance/own/dispose를 그대로 소비 | model ordering·fresh authority·backend admission·보편 Room/DOM/host/tick |
| 선택 모델 | 현재 권위 상태 요청, 보호 명령 제출/상태 조회, context 무효화·자원 정리, 단일 최종 채택/복구·입력 준비 | 두 번째 Snapshot/Recovery 엔진, 독자 사이트 인증·게임 규칙 |
| Site Adapter | 기존 Auth initialize/subscribe·Registry/route/view identity·복구 신호·실제 선택 capability 연결 | 새 Auth/token/인가/audio/수명 엔진·두 번째 metadata |
| 신뢰 ingress/gate | 서버 검증 subject/session·recipient/view/payload와 최종 native P, old sender 폐쇄 | client Gate/지원 flag를 서버 신뢰로 사용, worker client socket 소유 |
| backend finalizer/controller | current predicate·command/owner 직렬화·A/실제 C·writer ticket/guard·권한/삭제 current·fencing | Core resolver/클라이언트 isApplicable로 실제 admission 대체 |
| game-local | 실제 목표/이동/상호작용/종료·공간/화면·입력 표현·선택 결과 소비 | 공통 본체 복제·독자 권한 우회·공용 자원 파괴 |

Core commit callback은 **단일 동기 반영**이다. await는 밖에서 완료하고 반영 직전 다시 commit 검사를 받는다. callback 내 await/thenable·재진입 뒤 후속 쓰기를 Core가 원자화하거나 이미 일어난 효과를 rollback한다고 가정하지 않는다. Core의 로컬 수명 검사는 선택 모델의 현재 맥락/권한/순서 검사 및 backend의 실제 admission과 각각 다르다. 기본 model resolver는 아무 모델도 허용하지 않는다.

### 2.1 명령 identity와 관측 사건

| 사건/데이터 | 구분과 필요한 처리 |
|---|---|
| client 명령 생성 | 대상 session/match/view·주체·명령 종류/payload hash·명령 identity를 결속. 같은 ID/다른 payload는 충돌 거절 |
| 전송/접수 ACK | 전달·접수 관측일 뿐 권위 commit/수신자 적용/입력 준비를 증명하지 않음 |
| 최종 인가·착수 A | 필요한 anchor/owner/command 잠금 뒤 같은 finalizer transaction의 현재 predicate 검사와 한 command 저장 착수. ingress/BEGIN/enqueue는 A 아님 |
| 확정 C | 실제 DB commit. 적법 A를 기한 내 지난 동일 transaction의 일반 I/O late C만 D0010 제한 수용. memory 적용/ACK 시각을 C로 대체 금지 |
| 최종 송신 P | recipient/session/view/payload fresh 검사와 native 취소 불가 transport 인계. ACK/duplicate/snapshot도 각각 새 P |
| commit 미상 | 동일 command 상태 조회 또는 같은 identity/hash의 명시 재시도. 새 ID로 무조건 다시 실행 금지. 새 transaction/command/retry는 fresh A |
| client 채택 | 현재 owner/context/권한/ordering·반영 직전 조건 확인. commit 사실만으로 옛 view의 응답을 채택하지 않음 |

원천 R+5초·known expiry·인지 실패 뒤 새 A/P 차단, owner anchor를 C/rollback까지 유지, 최초 t0+60초·abort 우선·terminal 뒤 LIVE 부활 금지를 유지한다. D0010은 P/retry/new command에 상속되지 않는다. 일반 I/O late C와 입증된 after-check 실행 정지의 D0008 한계는 구분한다. 누락 trace/원천 R/시계 오차는 INCONCLUSIVE이며 안전 위반을 percentile로 면제하지 않는다.

### 2.2 transport/운영 연결 후보

승인 provider/운영 구조는 **Supabase Free 서울 + Lightsail Linux/IPv4 2GB 서울 + DynamoDB Standard 서울 provisioned**, 같은 VM 권한 분리 gate/worker/controller, 독립 scheduler/monitor 그대로다. 실제 설치/계정/성능/비용/지원은 확인됐다고 쓰지 않는다.

Astra의 **인증된 WSS command/state/control envelope**를 연결 후보로 보존한다. 단일 native Linux/OpenSSL memory BIO→nonblocking send의 승인 P 경계와 양립해야 한다. 자동 flush·Node socket.write를 최종 P로 바꾸는 구현, client relay를 권위로 삼는 연결은 제외한다. WSS library·언어·프레임 schema·배포 설정·수치의 최종 선정은 이번 S0 허용 범위에 없다. polling/current cursor 확인은 동일 모델의 reconciliation 입력일 수 있으며 별도 채택 owner가 아니다.

envelope에는 실제 선택에 필요한 contract/wire revision, execution/session/match/view·subject/session 맥락, owner incarnation/stream 기준, command ID/hash, message kind의 발급·검증 owner를 명시한다. 필드명/schema는 구현 때 선택한다. client subject/session은 서버 검증 입력이지 신뢰 권한이 아니다. credential·Auth dump·server predicate 구현은 public/browser에 넣지 않는다.

## 3. session/start/rematch·종료 기록

| 전이/맥락 | 부분 모델의 명세 |
|---|---|
| 진입/복구 | DETACHED/RECOVERING과 연결 관측을 구분. authorized current state·현재 owner/view·갱신 연결 준비가 확인된 뒤만 LIVE/보호 입력 허용 |
| 초기 start | 실제 선택 세션의 승인된 시작 조건을 서버가 집행. 초기 hostless의 적용 조건을 보존하고 조건 미정을 자동 hostless로 채우지 않음. 보편 ready/host를 Core에 강제하지 않음 |
| 실제 Room/Lobby 연결 | 8 surface의 의미가 맞는 consumer만 연결. roomless에 fake room/ready/no-op adapter를 만들지 않음 |
| 같은 참여 맥락 재대결 | 기존 room/player 맥락 유지, 새 match identity·gameplay 초기화, ready 확인 후 host가 서버 검증 start. old match 완료·error/null/finally/leave/result를 새 match에 반영 금지 |
| 재대결 host 불성립/미정 | N/A/local 우회로 면제하지 않음. 대체 사용자 의사·시작 권위·공정성·이탈/복구·기존 영향을 갖춘 별도 상위 승인 전 해당 조합 차단 |
| 이탈/권한 | 명확한 탈퇴·철회는 UNKNOWN 유예가 아님. 권한 불명/실패 인지 시 보호 입력·정보 즉시 차단/pause. 최초 t0+60초·retry/restart 비초기화·abort 우선 |
| crash/terminal | 미완료 판 중단·재시작 허용과 이미 durable인 기록 소실 허용을 구분. terminal/최초 ID·시각·deadline 유지, 늦은 결과로 LIVE 복귀 금지 |
| 최소 종료 기록 | 첫 Probe 본인 참가/필요 운영자 열람·첫 종결30일 삭제 및 외부기록/삭제/탈퇴/복구 조건 유지. 없는 winner/score/XP/랭킹/보상을 만들지 않음 |

DETACHED/RECOVERING/LIVE/PAUSED_AUTH/DEGRADED/TERMINAL/DISPOSED는 설계 상태 이름이며 public enum/API 동결이 아니다. transport CONNECTED나 구독 SUBSCRIBED를 LIVE의 대체물로 쓰지 않는다.

## 4. 단일 채택·복구와 원격 intent/시간 정책

### 4.1 저빈도 상태의 단일 채택

첫 부분 모델은 **완전 authorized snapshot 교체 우선**의 설계 후보를 따른다. bounded ordered tail은 실제 필요가 생긴 경우에만 cut/연속성 계약과 함께 추가한다. Snapshot/Reconnect는 같은 모델의 한 최종 채택·복구 owner에 연결하며 기존 snapshotCoordinator 전체를 무보완 채택자로 붙이지 않는다. 분리 가능한 coalescing/비교 알고리즘의 재사용은 가능하다.

| 사례 | 처리 불변량 / oracle 기대 |
|---|---|
| initial/live race | listener/준비 관측·요청 epoch 연결, 최초 조회 중 invalidation의 pending refresh 보존. atomic cut 증거 없는 SUBSCRIBED를 replication-ready로 취급하지 않음 |
| live/같은 revision | 같은 owner/stream/context에서만 순서를 평가. 낮은 순서 거부. 같은 의미/revision의 다른 내용은 last-arrival-wins 대신 재조회/명시 오류. 같은 숫자의 다른 match/view는 별개 |
| gap/reorder/overflow | 불완전 delta 적용·입력 지속 금지. 완전 current-state 재조회/명시 실패로 전환. 새 기준 이전 delta 임의 재사용 금지 |
| quiet last loss | 다음 이벤트가 없어도 독립 current/cursor reconciliation으로 stale 상태를 탐지. 연결 유지 자체는 fresh 근거가 아님 |
| ACK loss/commit unknown | 동일 ID/hash 원장/명령 상태로 판정. mutation once와 현재 응답 fresh P 각각 확인 |
| duplicate/재적용 | 현재 승인 state 재적용이 새 효과·SFX/통계/보상/publication 발행 근거가 되지 않음. 여섯 dedup scope를 하나의 done/version으로 대체 금지 |
| 복귀/실패 | 현재 role/user/session/view/owner·authorized state·갱신 준비 확인 뒤 LIVE. timeout/실패를 DEGRADED/RECOVERING으로 표시하고 무한 spinner 금지 |
| terminal/권한 장애 | 처음 t0+60초 고정·abort 우선. late ACK/C/retry/snapshot으로 terminal 부활 금지 |

DEV271의 이벤트 순서/전달 성공만으로 복구 금지와 DEV251의 Realtime payload 최종 진실 금지를 각각 유지한다. T01 같은 Room 새 Match, T02 A→B→A, T03 role/view/user 전환은 모든 완료 경로에 적용한다. roomless인 부분은 run/view/resource 맥락에 대응한다.

### 4.2 연속 intent·시간의 후속 설계 후보 — S1 지원 아님

지속 입력의 취소 손실·시간 공백 정책은 전체 첫 Probe 구현 전에 닫아야 한다. Astra 후보는 **현재 context의 단조 증가 intent 순서 + 제한 유효기간 + best-effort cancel**이다. 숫자/갱신 방식은 미정이며 이 후보를 production 구현·성능 보장·이미 승인된 과거 정책으로 표시하지 않는다.

- 유효기간은 서버 검증 실행/역할/owner와 서버 발급·검증 기한에 결속한다. 늦은 옛 renew가 수신 시각부터 수명을 다시 얻거나 client timestamp만으로 연장하면 안 된다. 중복/역순/옛 input epoch는 거부한다.
- cancel/blur/hidden/입력원 교체/역할 상실 때 local 지속 intent 즉시 무효화. 취소 packet 유실 시 원격 intent 만료/집행이 끝내는 관측 가능 상한이 필요하다. 이미 권위 수용된 행동을 client cancel로 rollback했다고 쓰지 않는다.
- 복귀는 fresh state/현재 역할·권한/owner와 갱신 준비 확인 뒤 **새 유효 입력**으로 재개한다. 옛 pressed state·buffered intent·빠진 frame을 몰아 재생하지 않는다. hidden 자체가 서버 전체 pause/종료는 아니다.
- render/input sampling/simulation/physics(선택 시)/network/audio clock을 분리한다. 큰 공백 때 무제한 catch-up·명령 폭주를 금지하고 현재성 불명은 복구/차단으로 보낸다.
- intent lease·quiet reconciliation 주기·queue/payload 한도는 실제 구현 전에 부하/조작성/상한을 근거로 확정한다. 임의 tick20Hz/update10Hz/heartbeat1초/queue64KiB 등을 승인 수치로 만들지 않는다. renderer/physics/prediction/게임 규칙도 장르명으로 동결하지 않는다.

## 5. H1~4 실제 owner·최소 보완·기존 consumer 회귀

| 항목/실제 본체 | 실제 owner / 필요한 최소 보완 또는 동등 격리 | 관련 회귀·미실행 경계 |
|---|---|---|
| H1 `js/game-audio/bgmController.js`의 pending play·pause/play·destroy | Audio/상태 owner는 controller. 최신 사용자 의도·종료·작업 귀속을 success/catch/finally 모두 보호. old finally/cleanup은 자기 작업·Audio만 정리. listener 재진입 후 반영도 재검사 | 기존 player/preferences/catalog 및 Cant Stop/No Thanks/The Game/Liar wrapper API·정상 곡/mode/volume/autoplay 의미 보존. pending play→pause/destroy→late success/reject, 새 play/track·재진입 fakeAudio 계약 후 실제 browser/audio 별도. 외부 wrapper만으로 내부 Audio/DOM late 완료 해결 선언 금지 |
| H2 `js/invites/inviteRegistry.js` 등록/dispatch | site 등록 owner. 동적 교체 consumer에는 등록별 identity/소유 확인. 같은 handler 함수 재등록도 별개 등록. old disposer가 새 등록을 삭제하지 않음. 안정 단일 등록만 쓸 때는 실제 조건 입증 | old disposer/new registration·반복 disposer·dispatch 중 교체/늦은 handler 완료. 기존 등록/dispatch API·사이트 handler/권한 보존, 별도 Registry 엔진 금지 |
| H3 `js/invites/inviteShare.js` 및 `inviteEntry.js`의 handler 연결 | dialog/view/site handler가 owner. destroy 선무효화, QR library/QR canvas·copy/share 성공/실패·후속 DOM/오류/navigation/admission 반영에 실행 identity. detach된 옛 node만으로 전체 안전 선언 금지 | QR await/destroy/새 dialog, copy/share success/reject/close·handler late 완료를 구분. 기존 token/route·생성→resolve→entry→join target/admission 의미 보존. 이미 시작한 OS share/clipboard 회수 보장 금지 |
| H4 비room Invite | 실제 consumer가 선택할 때 target/admission·기존 token/route owner 검토 | 현재 미선택/미지원. fake room/지원 flag로 연결하지 않고 전체 blocker로 확대하지 않음 |

사이트 공용 자원은 공용 owner만 파괴하고 게임은 자기 연결/사용권만 반환한다. API/정상 동작 보존이 불가능하면 기존 게임 이관 대신 해당 vNext 연결을 보류해 경계를 반환한다. H1~3의 최소 보완 방향은 승인 STEP5A를 따르지만 실제 코드/DOM/audio 증거는 아직 없다. 얇은 Adapter 안에 새 audio/token/auth/복구/수명 엔진을 숨기지 않는다.

## 6. 후속 코드 Slice의 경로·의존성·publication 예상 diff

이 표는 실제 저장소 root와 현행 검사에 대조한 **구현 위치 후보**다. 파일/폴더를 생성하지 않았다. 최종 파일명/언어/함수·자료구조는 해당 Slice에서 최소 선택하며 정상 구현 결정마다 사용자 승인을 새로 요구하지 않는다. source/정책/Guard 변경 범위 허용은 별도다.

| 실제 경로/후보 | 의존성과 owner 경계 | public/검사 영향·진입 조건 |
|---|---|---|
| 기존 `games/shared/vnext/core/executionScope.js`, `executionBindings.js` | 모델/Adapter가 import. Core에서 site/model/backend 역방향 import 없음 | 기존 2파일 그대로. 기존 barrel `games/shared/index.js` 재수출 금지, main에 Core 추가 이식 없음 |
| 후보 `games/shared/vnext/models/coopSession.js` | Core·선택 transport 계약만 소비, 단일 adoption/recovery owner. server 구현 import 금지 | 별도 모듈이면 public +1. 현재 exact384 정책 밖 새 자산이므로 builder가 거부. 실제 경로/closure 검토 후 해당 revision policy diff 허용 필요 |
| 후보 `games/shared/vnext/adapters/siteSession.js` | 기존 Registry/Auth/route·복구 trigger·선택 capability와 model 연결, metadata 복제 없음 | 별도 모듈이면 추가 +1. 위 직접 후보2개만이면384→386이나 전체 closure/필요 파일 확정 전 최종 N은 미정. 이번 정책/bytes 변경0 |
| 후보 `services/game-platform-vnext/` 아래 session/ingress/finalizer/gate/controller의 실제 필요한 파일만 | 승인 server 전용 root·권한 분리, worker는 계산 제안/클라이언트 socket 미소유 | public +0이어야 함. production helper는 지금 존재 자체를 차단. **server-boundary-next-plan §4.2 별도 판단 전 생성/조건부 허용 금지** |
| 신규 DB 지원물 — 기존 `supabase/` 관리·배포 경계 안에서 후속 위치 결정 | 기존 game별 SQL 이관·재작성 없음. actual predicate/finalizer/ACL·migration owner가 결정 | public 추가 금지. 실제 DB 모델의 forward migration·disposable runner/호환 책임. filename/schema/API 선제 생성 없음 |
| 후보 `tests/game-platform-vnext-coop-session.test.js`, 필요 시 실제 `tests/game-db-integration/<선택 대상>.test.js` | 기존 `test:game-platform` flat discovery·실제 모델 oracle/환경. production 코드를 tests에 숨기지 않음 | public +0. test 파일명 존재/fixture 통과≠model 지원. DB online 요구를 제거하지 않음 |
| 기존 `js/game-audio/bgmController.js`, `js/invites/inviteRegistry.js`, `inviteShare.js`, 필요한 실제 handler | 선택 H1~3 본체의 최소 호환 보완, Adapter는 소비만 | 항목 수가 같아도 실제 public bytes 변경이다. 후속 관련 consumer/API/회귀·publication 새 revision 검증 필요. 이번 변경0 |
| 기존 `scripts/site-publication-files.json`·builder/helper·workflow | 새 실제 public 목록/closure와 server 제외 결속을 해당 owner가 검토 | 이번 모두 불변. conditional server 검증 순환 import·기존 CLI/governance/검사 순서 문제는 실제 §4.2 연결 때 필요한 만큼만 판단. skip/continue-on-error/지원 flag 금지 |

**S0 → S1 → S2/S3**는 구현 범위를 잘라 검토하는 순서이며 공식 STEP를 추가하지 않는다. S1은 저빈도 제어/단일 채택의 부분 구현, S2는 실제 연속 입력/권위 연결, S3는 실제 선택 capability/Adapter 연결이다. S0 결과 제출만으로 후속 코드를 일괄 실행하지 않는다. 실제 server source/산출물 제외와 지원은 별개이며 로컬 publication을 actual Pages artifact/deploy로 확대하지 않는다.

## 7. support / unsupported 및 oracle·환경 명세

| 범위 | 현재 판정 | 미래 증거/게이트 |
|---|---|---|
| Core 최소 조립/수명 | 기존 승인 결과 재사용 | 실제 선택 consumer 연결의 적용 계약 검증 |
| GP-COOP-SESSION/1 후보 | **설계 문서 REVIEW_PENDING / 구현·runtime·online 미지원** | 실제 구현·호환·모델별 oracle/환경·Guard 연결 검토 전 지원 등록 없음 |
| 연속 simulation/이동/충돌/prediction | **미지원 / 후속 선택** | 실제 authority/확정·인가·fencing 계약 및 첫 Probe 제품 필요. 저빈도 PG 범위 확대 금지 |
| H1~3 | 무보완 연결 지원 보류, 본체 최소 보완 owner 유지 | 선택 본체 계약/consumer 회귀와 실제 browser/DOM/audio는 별도 |
| H4/미선택 기능 | 미선택/미지원 | actual consumer 필요 시 해당 경계만 판단 |
| 새 server 공개 제외 | 해당 revision 증거 없음·production 차단 | 실제 source/policy/output·참조/bytes/closure 검증과 별도 §4.2 판단 |
| browser/cache/SW/운영 | **UNKNOWN / 미완료 의무** | fixed M 예외를 미래 revision/server/신규 게임에 상속하지 않음 |

### 7.1 실행 환경별 oracle — 모두 후속 NOT_RUN

아래 표는 실제 필요한 판정 환경/관측값이다. 시험을 실행했다는 기록이나 oracle 설정 항목이 아니다. 안전11은 Data API 최소권한·RLS/privilege 및 current A/C/P 전체 검증을 대신하지 않는다.

| 묶음 | 실제 필요한 환경·관측 | 판정/실패 조건 |
|---|---|---|
| 수명/반영 | offline 계약: 모든 success/error/null/finally/cleanup/leave/effect/후속 완료×T01~03, 반영 직전·await/재진입, 부분 초기화·반복 dispose·late resource·정리 실패 | old context 효과/자원 침범0·독립 정리 지속·실패 관측. unit만으로 실제 게임/서버 행동 PASS 금지 |
| 상태/복구 | protocol fault fixture와 실제 신뢰 server/두 client를 구분. initial 조회 중 invalidation, gap/reorder/overflow·quiet last loss·같은 seq 다른 owner/view, ACK loss/commit unknown/duplicate | 현재 권한·연속성 확보 전 입력 차단, mutation once와 응답 인가 별도. fixture clock/Auth/transport 주입은 production 증거 아님 |
| 안전11-1~5 | disposable DB+해당 신뢰 server: 익명/미승인 거절, 허용회원 게임별 진입, 비멤버 보호 state 거절, 서버 start 조건/권한 원자 판정 | UI Gate·인증 존재·dummy mock으로 대체 금지. actual predicate/caller/ACL/Data API와 실제 subject/session 관측 |
| 안전11-6~8 | 같은 환경: stale 보호 입력 거절, 동일 ID/hash 중복 mutation once, 충돌 명령 단일 권위/old owner 차단 | 단순 expected_version 필드/DB epoch만으로 old sender까지 증명 금지 |
| 안전11-9~11 | authorized current recovery·same-context ready/rematch/start/reconnect, recipient/view private 비노출 | private가 없더라도 비노출 시험. 재대결 N/A 우회·다른 view 채택·새 P 인가 누락 실패 |
| current A/C/P | 실제 lock/predicate/A/DB commit C/native send prefix P·transaction/command/hash/owner/view·R/clock 오차 trace. lock wait·known expiry·late C·retry·부분 송신·old writer/old sender | 새 A/P 기준 위반 FAIL. 동일 적법 transaction 일반 I/O late C만 제한 수용. trace 누락 INCONCLUSIVE. 안전 위반 percentile 면제 없음 |
| intent/시간 | 선택 모델 fault fixture 후 실제 지원 장치/두 client: 취소 packet/renew 손실·지연·역순·hidden/blur·역할 전환·큰 시간 공백 | stale intent 재생/무한 원격 유지 금지. 실제 상한/수치 미정이면 지원 미판정 |
| H1~3 | fakeAudio·등록·DOM fixture 후 실제 browser/audio·QR/copy/share/handler 관측 | old completion/current UI 영향0, 자기 자원만 정리. fixture가 실제 소리/OS share 증거를 대체하지 않음 |
| 통합/공존 | 허용된 코드 Slice의 full checkout, 관련 계약·기존 Game Platform/Guard·module links·build/check:publication·정책/bytes 비교 | 기존 consumer/API/metadata/barrel/game-local4문서/SQL 보존. synthetic merge와 formal head 및 CI evidence/Pages artifact 구분 |
| 품질/운영 | 별도 허용된 Windows10/11 Chrome·Edge, iPhone Safari·실제 두 client/모바일5기능·부하·신규 게임 loaded bytes·삭제/복원/비용 관측 | 총100(로비/관전 포함)/판8·원격권위p95≤250ms·정상망 각복구≤5초, 세금포함월추가3만원 및 D0006~10 조건. 실제 device/build/망/표본/오차를 실행 전 명시 |

## 8. 미확인·후속 판단과 전체 보존

- 초기 두 원문 미확보, 실제 제품/장치/초기 start 세부·정밀 시뮬레이션 필요와 연속 authority/수치 미확인은 유지한다. 새로운 자료가 생기면 해당 승인 범위와의 차이만 읽는다.
- 기존 의미로 성립하는 정상 구현 상세는 담당 Sol/Codex가 선택한다. memory C/사전 permit/권한·확정 의미 변경, 미승인 hostless 재대결 등 상위 변경이 꼭 필요할 때만 **원문/줄·현재 consumer·owner·영향·최소 보완·사용자 결정 범위**를 반환한다. 직접 요구에 legacy ID/f를 만들지 않는다.
- main exact382/integration exact384·Core 미이식, 기존 consumer/API/Registry 단일 metadata/barrel·게임/Auth/API/SQL/game-local 네 문서·원본/과거 승인/CP/원ID·줄·f·baseline/유효 override/manual gate를 보존한다. production 구현을 tests/docs에 숨기지 않는다.
- [STEP7B 계획 §7 전체](game-platform-vnext-step7b-plan-and-handoff.md#7-반드시-유지할-조건)를 조건·예외·강도까지 유지한다. STEP4A 모든 완료/수명/T01~03, D0010 current delta·D0006~10, H1~4/단일 채택·복구/안전11/current A/C/P/hostless, STEP5B 결과/정정/producer-consumer/여섯 dedup/merge·activation·공개/NEW·Profile, B01~12/R01~13, 원3232/305부모/16행58분할·L/H/I/49 비승격·DEV271/DEV251 각각 보존한다.
- `tests/game-platform-vnext-model-oracles.json`의 빈 models·vNext runtime/online 차단·기존 online DB 요구·server 제외 미확인 차단은 그대로다. 실제 제외 증거 없이 빈 server/지원 flag/fixture/과거 M artifact로 Guard를 통과시키지 않는다.
- fixed M/run39191903797/attempt1/public artifact12160182245의 별도 P1 판단은 browser 선행조건 분리 범위의 증거 충족/최종 승인 가능이었다. 이 S0가 그 최종 사용자 결과 승인·완료 기록이나 미래 revision 공개 증거가 아니다. browser actual bytes·옛 cache/SW UNKNOWN 및 미완료 의무, 미래 server 실제 공개 제외·신규 게임 loaded bytes·fail-closed Guard 의무를 유지한다.
- 옛 정상 root artifact 미확보·완전 원복/무중단 미보장·M 재생성과 보관 ZIP 직접 복원의 차이, 운영 기록/삭제·탈퇴/backup/복구/비용 후속은 그대로다. 이번 문서 검증/CI를 실제 모델·게임 지원/행동 PASS로 쓰지 않는다.

연결: [S0 검증/제출 근거](step-7d-model-adapter-s0-validation.md), [CP0109](../checkpoints/CP-0109-step-7d-model-adapter-s0-submitted.md).

**정지: S0 문서 결과 REVIEW_PENDING / STEP7D 미완료 / 모델·Adapter 미착수 / vNext 행동 NOT_RUN / 운영 UNKNOWN / browser·cache·SW UNKNOWN.**
