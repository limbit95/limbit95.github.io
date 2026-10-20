# STEP7D — PR429 병합 후 첫 선택 모델/Adapter 재개 판단

작성: 2026-10-20 KST · 담당 **Astra** · 저장소 밖 전달 산출물.

**판정: 현재 승인 근거에 따른 새 구체화안은 제출 가능하다. 초기 STEP7D 원문 복원 완료나 첫 모델 구현 착수 가능으로 판정하지 않는다.** 다음 권고 작업은 **Sol/Codex의 아래 S0 계약·검증 명세 정식화**다. publication checkout 준비를 반복하지 않는다. 실제 모델/Adapter 코드는 S1 이후의 명시된 입력과 허용 범위를 충족한 뒤에만 착수한다.

**STEP7D 미완료 · 모델/Adapter 미착수 · vNext 행동 NOT_RUN · 운영 UNKNOWN.** 이 문서는 사용자 승인 기록·구현 지시·Guard 변경 허가가 아니다. 현재 지원은 빈 모델 설정에 따라 계속 미지원이다.

## 1. 실제 입력, 읽기 범위와 현재 Git

### 1.1 정식 고정 입력과 재확인

| 대상 | 실제 확인 결과 | 해석 |
|---|---|---|
| integration | `bb037653ca81bb294aafa16c248030ccc7eb7a87` / tree `760d5d13f0f98ec16fcc8c4f29fed21389b7c942` | 이번 판단 기준. 후속 재개 시 현재 ref와 다시 구분 |
| main M | `0e4089f345c1f0a33c86c96a1f07a9dab484cc2e` / tree `d4f9b568f705a17cca3274f0862d46f5b56b3b76` | 실제 게시 판단의 별도 고정 입력 |
| PR429 | merged=true, merge=`bb037653…`, head=`6b630c18e6a1ba1e7e02b95cdabed21670bb2326`, base=`feature/game-platform-vnext-integration` | 2026-10-20 17:31:58 KST 실제 병합. 부모는 `b59994ce…`와 `6b630c18…` |
| 현재 remote | 이 작업 후반 재조회에서도 integration=`bb037653…`, main=`M` | 두 고정 입력 이후 ref 이동 없음. 후속 변경 자동 포함 없음 |
| 로컬 읽기 checkout | HEAD=`6b630c18…`, tree=`760d5d13…`, worktree clean | integration과 내용 tree가 같아 코드/문서 읽기에 사용. identity가 다르므로 integration revision에서 새 검증을 실행한 증거로 쓰지 않음 |
| PR429 기록 head CI | governance `39393132494`, publication `39393132425`, static `39393132403`: 각각 attempt1/completed/success | PR head에 연결된 CI. 병합 commit에서 새로 수행한 행동 검증이 아님 |

[PR429](https://github.com/limbit95/limbit95.github.io/pull/429), [integration merge](https://github.com/limbit95/limbit95.github.io/commit/bb037653ca81bb294aafa16c248030ccc7eb7a87), [publication CI](https://github.com/limbit95/limbit95.github.io/actions/runs/39393132425).

승인 기록 포함 CI의 실제 검사 revision은 보존 인수인계의 합성 merge `4333b259ef97c1ec31fd80e0725e936fbe70741d` / 같은 tree `760d5d13…`다. evidence `12251040272`는 검사 evidence이며 실제 Pages public artifact가 아니다. 이전 보완 head `22b9baa2…`의 합성 merge `2bd11e8b…` / evidence `12246114285`와도 구분한다. 실제 upload/public artifact 검사/deploy는 해당 PR CI에서 skipped였다. 기존 publication 30/30, Game Platform 409/409 및 Guard/build/public bytes 보존 증거를 재사용했으며 이번에 다시 실행하지 않았다.

### 1.2 실제 읽은 근거

다음 두 전달 문서를 먼저 전체 읽었다.

- `game-platform-vnext-step7d-post-pr429-next-handoff-2026-10-20.md`
- `game-platform-vnext-step7d-p1-server-boundary-next-plan-2026-10-20.md`

이어 `publication-checkout-proof-approved-handoff`의 승인 대상·4문서 기록 범위·검증 구분·후속 제한과 `publication-checkout-proof-fixes-final-review`의 결론·보존·사용자 승인 범위를 읽었다. 저장소의 AGENTS → 실행계획1.6 → rebuild README → CURRENT → CP0108 → PR/Git 순서로 현재를 복원하고, 이후 아래 필요한 계약/코드만 읽었다.

- STEP6 Target §2.1/4/5/6.1/6.2 및 I2/I3·검증 V-L~V-O.
- STEP4B runtime J01~06, design-finalization §2~4 및 현재 CP0075/D0010 delta, 실제 사용자 Probe/재대결/기록/모바일 결정.
- STEP5A Registry/Access/Room/Snapshot/Reconnect/Invite/Shell/BGM 및 수명 owner·H1~4.
- STEP5C R01~13·7축·game-local 네 문서/검증 책임. 현재 MO1~6, CA1~4의 유효 본문.
- STEP7C Core 실제 2파일 전체. PR429 builder의 checkout 결속·최종 검증 경계, boundary helper의 server 차단·빈 모델 oracle 설정.
- H1 `bgmController.js`의 pending play/pause/destroy, H2 `inviteRegistry.js`, H3 `inviteShare.js`의 실제 late 완료 경로만 한정 읽기.

CP0108과 CURRENT의 `INTEGRATION_NOT_MERGED` 및 “다음은 병합 결정”은 기록 당시 상태다. 현재 Git의 병합 사실이 이를 대체한다. CP0108 원문을 소급 수정하지 않았고 별도 병합 기록 PR도 만들지 않았다. 다음 정상 작업의 CURRENT 정합화가 허용될 때 현재 표시만 고치고 과거 checkpoint를 보존한다.

### 1.3 원문 미확보의 정확한 의미

초기 `game-platform-vnext-step7d-plan-and-handoff-2026-10-14.md`와 `game-platform-vnext-step7d-astra-judgment-2026-10-15.md` 또는 승인된 정식 보존본은 **미확보**다. 이번에 새 원본이나 명확한 새 보존 경로가 제공되지 않았으므로 이전 실패 검색을 반복하지 않았다. 삭제됐다고 확정하지도 않는다.

따라서 과거의 모델 이름/transport/lease 수치/구현 순서/제품 선택을 복원했다고 주장하지 않는다. 아래 §4는 **현재 확보된 승인 근거에서 새로 작성한 제안**이다. 원문이 나중에 확보되면 그 실제 승인 범위와 차이만 대조하며 이 제안을 과거 승인으로 덮어쓰지 않는다. 현재 사용자가 새 구체화안을 요청했으므로 원문 부재를 이유로 이 계획 작성까지 중단할 필요는 없다.

## 2. 재판단하지 않는 승인 조건

아래 링크는 모두 고정 integration 내용 기준이며, 원문 ID/f를 임의 생성하지 않았다. 직접 사용자 결정은 문서/줄로 인용한다.

| 승인 근거 | 이번에 유지하는 의미 |
|---|---|
| [Target §2.1](https://github.com/limbit95/limbit95.github.io/blob/bb037653ca81bb294aafa16c248030ccc7eb7a87/docs/game-platform-rebuild/artifacts/step-6-target-architecture.md#L13-L27) | Core 최소 조립·수명, 선택 모델의 단일 채택/복구, backend 실제 인가, Site Adapter 연결, game-local 규칙/표현 분리 |
| [Target §6.1/6.2](https://github.com/limbit95/limbit95.github.io/blob/bb037653ca81bb294aafa16c248030ccc7eb7a87/docs/game-platform-rebuild/artifacts/step-6-target-architecture.md#L88-L114) | browser/shared root와 server root 분리, 기존 barrel 무이식, Registry 단일 metadata, 실제 새 경로 발견/공개 제외, 계약 revision과 구현 호환 증거 |
| [I2/I3](https://github.com/limbit95/limbit95.github.io/blob/bb037653ca81bb294aafa16c248030ccc7eb7a87/docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md#L24-L27) | 첫 Probe에 필요한 모델/backend 연결과 선택 기능만 구현. mock≠지원. H1~3 실제 owner 최소 보완 |
| [STEP4B 사용자 결정 L9~18](https://github.com/limbit95/limbit95.github.io/blob/bb037653ca81bb294aafa16c248030ccc7eb7a87/docs/game-platform-rebuild/artifacts/step-4b-user-decisions.md#L9-L18) | 이동·상호작용 중심 작은 2D 협동, 같은 참여 맥락의 재대결·준비 확인 후 방장 시작, 단절 후 현재 상태 복원, 미완료 판 서버 장애 시 중단·재시작 허용 |
| [추가 결정 L10~18/25](https://github.com/limbit95/limbit95.github.io/blob/bb037653ca81bb294aafa16c248030ccc7eb7a87/docs/game-platform-rebuild/artifacts/step-4b-additional-user-decisions.md#L10-L27) | 본인 참가/필요 운영자 최소 종료 기록·30일 삭제, 모바일 이동/상호작용/준비/종료/재접속, p95≤250ms·정상망 복구≤5초, 장애 즉시 차단/pause·60초. 과거 tick/queue/heartbeat 후보 수치 미승인 |
| [J01~06 현재 delta 및 본문](https://github.com/limbit95/limbit95.github.io/blob/bb037653ca81bb294aafa16c248030ccc7eb7a87/docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md#L13-L107) | 구체 PG 권위 설계는 저빈도 DB 후보에 한정. 연속 보호 상태는 신뢰 simulation owner 방향. 연결 성공≠LIVE, quiet loss·ACK loss·single owner·안전11 유지 |
| [D0010](https://github.com/limbit95/limbit95.github.io/blob/bb037653ca81bb294aafa16c248030ccc7eb7a87/docs/game-platform-rebuild/DECISIONS.md#L88-L96) | 같은 finalizer transaction의 적법 A 후 일반 I/O late C만 수용. 실제 C 유지, retry/new transaction/command fresh A, ACK/duplicate/snapshot도 fresh P |
| [STEP5A G1~5/H1~4](https://github.com/limbit95/limbit95.github.io/blob/bb037653ca81bb294aafa16c248030ccc7eb7a87/docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md#L23-L132) | 모든 완료/late resource/old disposer, Snapshot+Reconnect 한 owner, 기존 본체 최소 보완과 실제 consumer 보존 |
| [R01~13](https://github.com/limbit95/limbit95.github.io/blob/bb037653ca81bb294aafa16c248030ccc7eb7a87/docs/game-platform-rebuild/artifacts/step-5c-realtime-coop-spatial-rules.md#L48-L93) | 지속 협동/입력 취소/공간/시간/hidden/역할/start/rematch/복구/수명/결과/접근성/성능/증거 구분 |

운영 구조는 승인된 **Supabase Free 서울 + Lightsail Linux/IPv4 2GB 서울 + DynamoDB Standard 서울 provisioned**, 같은 VM의 권한 분리 gate/worker/controller, 독립 scheduler/monitor다. 공급자를 다시 선택하지 않았다. native Linux/OpenSSL memory BIO 최종 send 경계·비노출 predicate/전용 caller·writer ticket/guard·외부 현재 권한/기록/삭제/복구도 보존한다. 설치·활성 설정·실부하·비용 충족이 확인됐다는 뜻은 아니다.

초기 hostless 조건과 재대결 host 불성립은 구분한다. 이번에 초기 시작을 보편적인 ready/host 방식으로 강제하거나, 모든 멀티플레이의 재대결을 hostless로 바꾸지 않는다. 첫 Probe의 승인된 재대결은 **같은 참여 맥락 + ready 확인 + host start**다. 이 조합이 성립하지 않는 새 제품 선택은 별도 상위 판단 대상이다.

## 3. PR429가 닫은 범위와 실제 구현을 제한하는 경계

### 3.1 완료된 준비 — 재작업하지 않음

builder `scripts/build-site-publication.mjs` L26~56/L286~303은 실제 repository root·HEAD·index/inventory·현재 source/policy/output를 결속한다. HEAD↔index와 index↔worktree를 따로 검사하고 assume-unchanged 대상 bytes, ignored/untracked public/server 입력, manifest revision, 마지막 checkout 재검사를 유지한다. L215~259의 설치 후 실패 복원 및 read-only 성격은 승인 증거를 재사용한다.

이 결과는 **LOCAL_CHECKOUT_PUBLICATION**이다. 실제 원격 artifact/deployment/loaded resource/모델 지원 인증이 아니다. fixture inventory/revision/interleaving 주입으로 production 증거를 만들 수 없다.

### 3.2 이번 재개에서 드러나는 실제 범위 제약

| 항목 | 원문/현재 consumer·검사 | 영향 | 최소 처리와 owner |
|---|---|---|---|
| 새 server 파일 | Target L93/102, boundary helper L178~183은 server 존재 자체를 차단 | PR429 병합만으로 server 구현 PR을 통과시킬 수 없음 | 미래 **실제 승인 server 변경**에 한해 server-boundary-next-plan §4.2 별도 판단. publication/boundary owner가 같은 revision 실제 출력 제외와 참조 검사를 결속. 지금 차단 불변 |
| 새 browser model/adapter module | Target L92는 필요 시 새 모듈 경로 허용 방향. builder L119~121은 exact list 밖의 새 runtime asset을 거부. 현재 사용자 조건은 integration exact384 유지 | 모듈을 추가하고 정책을 그대로 두면 build 실패. 기존 Core에 끼워 넣거나 tests/docs에 production 코드를 숨기는 우회도 부적합 | 새 파일이 실제 필요한 구현 Slice에서 경로·개수·reference/bytes delta를 제출해 **그 revision의 정책 변경 범위**를 별도 허용받아야 함. 지금 main382/integration384 그대로 |
| 모델 admission | `tests/game-platform-vnext-model-oracles.json`=`{"models":[]}`; helper L69~73 선택 모델 거부 | Core resolver에 객체를 넣어도 production 모델 지원 아님 | 실제 구현·oracle·환경·적용 scope 증거가 준비될 때만 정상 검토. 이번에는 설정/Guard 변경 없음 |
| 연속 상태 권위의 상세 | J01 현재 delta L15~17은 저빈도 DB 후보, L44는 연속 simulation 방향. MO3 L662~666의 현재 A/C/P와 실제 PG finalizer 구체 설계 | DB를 매 frame 저장하거나 memory apply를 기존 C로 부르는 것은 근거 없음 | **선택 모델/backend owner**가 실제 연속 상태 확정·인가·fencing과 기존 계약의 관계를 명시. PG/D0010 의미를 바꿔야 하는 후보만 상위 변경 판단. 현재 일반 구현으로 자동 승인하지 않음 |

위 사항은 PR429의 새 결함이나 승인을 번복하는 판단이 아니다. 완료된 publication 준비와 아직 선택/허용되지 않은 runtime 변경 사이의 경계다. 소스·정책·Guard를 바꿔 확인하지 않았고 server canary도 생성하지 않았다.

## 4. 새 구체화안 — 승인 조건과 구별하는 권고

이 절의 구체 형식/기법은 **NEW_PROPOSAL / 사용자 채택 전**이다. 기존 provider·운영 구조는 그대로다. 정상적인 내부 함수명·자료구조·파일 분할·테스트 기법은 Sol/Codex가 선택한다. 여기서 장르명만으로 renderer/physics/prediction/Hz/timeout 수치를 동결하지 않는다.

### 4.1 첫 구현의 의미 단위와 선택지

**권고: 첫 I2를 ‘저빈도 세션 제어 + 단일 client 채택/복구 계약’으로 좁혀 구현 순서를 정한다.** 이것은 첫 Probe의 2D 이동·협동 목표를 삭제하거나 완료 기준을 낮추는 결정이 아니다. 연속 gameplay authority가 닫히기 전에는 이 부분 모델을 완성된 2D 실시간 모델로 등록/지원하지 않는다.

| 선택지 | 적용·장점 | 한계/판단 |
|---|---|---|
| **A. 승인된 저빈도 제어를 첫 부분 Slice로 구현 — 권고** | session membership, ready/start/rematch, command identity, terminal 기록 연결과 client adoption/recovery부터 기존 PG finalizer 구조에 연결 가능 | 이동/연속 충돌·시간 진행 전체 지원은 남는다. 이를 ‘STEP7D 모델 완성’으로 제출하지 않음. 실제 server/새 public 경로의 §3 게이트는 별도 |
| B. 연속 simulation까지 한 번에 구현 | 실제 이동·상호작용 수직 Slice에 빨리 접근 | 연속 확정 C와 A/P/owner fencing의 구체 계약이 미확보. 저빈도 DB 설계를 넓히거나 D0010을 memory apply에 붙이면 안 됨. 계약 차이를 먼저 판단해야 함 |
| C. client relay 또는 DB payload만으로 전체 상태 결정 | 구현이 작아 보일 수 있음 | J01/J06/MO3~4에 부합하는 권위·인가 근거가 없어 이번 권고에서 제외 |

A는 제품을 턴제로 바꾸거나 client 이동을 공식 상태로 믿는 대안이 아니다. **일부 책임만 먼저 구현하는 순서**다. 모든 구현이 현재 허용된다는 뜻도 아니다.

계약 후보 이름은 `GP-COOP-SESSION/1`로 제안한다. 실제 정식화 때 중복·scope를 확인하여 확정하며 현재 oracle/resolver에 등록하지 않는다. GP-MODELS/1 등 문서 revision, 구체 모델 contract revision, wire protocol revision, application build SHA, owner/stream revision은 각각 별개다. 정확한 지원 조합을 명시하고 `latest` 또는 `/1` 문자열 일치만으로 구현 호환을 인정하지 않는다. 나중에 연속 모델을 추가할 때 하나의 실행의 **최종 채택 owner는 계속 하나**이고 두 독립 Snapshot/Recovery 엔진을 두지 않는다.

### 4.2 transport·backend·API 경계

**transport 후보 권고는 인증된 WSS 연결 위의 명시 command/state/control envelope**다. 이유는 동시 참가의 양방향 전달과 승인된 단일 native 송신 gate를 한 경로로 연결하기 위해서다. 장르명 때문에 선택하는 것이 아니다. polling은 독립 current-state 확인의 후보로 남길 수 있지만 두 번째 최종 채택자가 되면 안 된다. WebRTC/client relay, Supabase Realtime payload를 최종 진실로 삼는 조합, worker가 client socket을 직접 소유하는 조합은 선택하지 않는다.

WSS 라이브러리/프레임 형식/서버 언어는 아직 선정하지 않는다. 선택 구현이 승인된 memory BIO→native send의 P 직전 재검사와 부분 송신 suffix 폐쇄를 표현해야 한다. SDK의 자동 flush나 Node `socket.write`를 P로 바꾸는 구현이면 해당 transport 연결을 중단한다. SDK 버전·설치 조건 확인은 실제 구현 준비에서 해당 기능에 필요한 범위만 수행한다. 이번 외부 조사/운영 조회는 없다.

| owner | 최소 경계/API 의미 — 이름은 후보 | 금지되는 책임 이동 |
|---|---|---|
| Core 기존 2파일 | `createExecutionBindings`·`register/start`, scope `capture/commit/advance/own/dispose` 그대로 소비 | 모델 ordering/current authority/서버 인가를 Core에 추가하지 않음 |
| 선택 모델 | `requestCurrentState(reason)`, `submitCommand(command)`, `cancelIntent(context)`, `invalidateContext(reason)`, `dispose()`에 해당하는 내부 계약. 권한 있는 state와 입력 준비·복구의 단일 owner | SnapshotCoordinator와 Reconnect가 별도 fresh LIVE 결정 금지 |
| Site Adapter | 기존 Registry 참조, Auth initialize/subscribe, route/view identity·reconnect signal·선택 capability의 연결 | 새 Auth/token/admission/오디오 엔진·두 번째 metadata 금지 |
| 신뢰 ingress/gate | 검증된 identity, 연결/recipient projection, fresh P와 실제 transport handoff | 브라우저 sub/session 또는 access flag를 신뢰하지 않음 |
| backend finalizer/controller | 실제 current predicate·command/owner 직렬화·A/C·현재 권한 제어·old writer/sender 격리 | browser `isApplicable()`·Core resolver를 실제 admission으로 사용 금지 |
| game-local | 이동/상호작용/목표/종료 조건, 공간·화면·입력 표현, 선택 결과 소비 | 임의 서버 권한 우회·공통 복구/Invite/BGM 본체 복제 금지 |

envelope 최소 의미는 contract/wire revision, execution/session/match/view·subject/session context, owner incarnation, stream 기준, command ID와 payload hash, message kind다. 어떤 필드를 서버가 발급/검증하는지 명시한다. 권한 secret·Auth dump·private predicate 원문은 browser/public bundle에 넣지 않는다. 모든 필드를 공통 Core나 기존 Registry 필수 필드로 만들지 않는다.

### 4.3 session/start/rematch

제안 상태는 `DETACHED → RECOVERING → LIVE`, 그리고 `PAUSED_AUTH/DEGRADED`, `TERMINAL`, `DISPOSED`다. transport의 CONNECTED는 별도 관측 값이다. socket 연결·UI mount·구독 성공만으로 LIVE/보호 입력을 열지 않는다.

- 실제 Room/Lobby 8 surface가 의미상 맞는 부분만 연결한다. 가짜 room/ready/start/no-op adapter를 만들지 않는다.
- 초기 start는 해당 승인 hostless 조건 또는 실제 선택 세션의 서버 시작 조건을 명세에 연결한다. 구체 조건 미정 상태를 자동 hostless로 채우지 않는다.
- 재대결은 **같은 room/player 참여 맥락**, 새 match identity, gameplay 초기화, ready 확인, host의 서버 검증 start다. old match의 성공/오류/null/finally/leave/result는 새 match에 반영하지 않는다.
- 명확한 이탈·철회는 UNKNOWN 장애 유예로 처리하지 않는다. 모르는 권한은 보호 입출력 차단/pause, 최초 fault deadline 유지. 미완료 판 crash 중단·재시작 허용과 durable terminal 소실 허용은 다르다.
- 첫 Probe 최소 종료 기록과 본인/필요 운영자 열람 의무는 선택 해제하지 않는다. winner/score/XP/랭킹/보상은 없으면 만들지 않는다.

### 4.4 원격 intent 취소 손실·시간 공백·hidden

**후보 권고: 현재 context의 단조 증가 intent 순서와 제한 유효기간을 사용하고, 해제/취소를 best-effort 전송하되 만료가 원격 잔존 intent를 끝내도록 설계한다.** 취소 패킷 전달 성공을 안전성 전제로 삼지 않는다. 이 방법은 새 제안이며 구체 유효기간은 승인된 수치가 아니다.

필요한 계약은 다음과 같다.

1. 유효기간은 서버가 확인하는 현재 실행·역할·owner 및 서버 발급/검증 기한에 결속한다. 늦게 도착한 옛 renew가 도착 시각부터 수명을 다시 얻거나, client timestamp를 믿어 연장하지 못한다. 중복/역순/옛 input epoch는 거부한다.
2. pointer cancel/blur/hidden/입력원 교체/역할 상실은 local intent를 즉시 무효화한다. 다음 정상 입력은 새 current context에서 다시 시작한다. 이미 권위적으로 수용된 행동을 client cancel로 rollback했다고 하지 않는다.
3. 원격 중단 상한은 input 유효기간 + 서버 관측/집행 지연으로 관측한다. 값을 정하기 전 stuck movement 방지를 ‘지원’으로 표시하지 않는다. 지연/조작성과 trade-off를 실제 첫 Probe 입력 기준으로 제시한다.
4. render, sampling, simulation, network, audio clock을 분리한다. 긴 공백/hidden 복귀 때 옛 입력·누락 frame을 몰아서 실행하지 않는다. 현재성 확인 실패 시 입력을 닫고 단일 복구 owner로 보낸다.
5. 정상 복구 후에도 이전 pressed state를 자동 재생하지 않는다. fresh state·역할·현재 owner·update 연결이 확인된 뒤 새 유효 입력만 허용한다. hidden 자체를 서버 전체 pause 명령으로 해석하지 않는다.

구체 intent lease/quiet reconciliation 주기/queue 상한/프로토콜 payload 한도는 구현 전에 선택 모델 명세에서 고정한다. 총100/판8, p95≤250ms, 정상망 각 복구≤5초, 권한 장애60초는 기존 승인 목표다. 그 밖의 임의 Hz/1초 heartbeat/64KiB queue 등을 과거 승인 수치로 재사용하지 않는다. Sol/Codex는 정상 기술 수치를 근거와 함께 선택할 수 있지만 승인 목표나 안전 의미를 완화할 수 없다.

### 4.5 단일 채택·복구의 실제 알고리즘 경계

첫 부분 모델에는 **완전한 authorized snapshot 교체를 우선하는 후보**를 권고한다. bounded ordered tail은 실제 필요한 경우만 추가한다. 둘 다 쓸 경우에도 cut과 연속성 증거 없이 delta를 섞지 않는다.

| 경우 | 필요한 처리/oracle |
|---|---|
| initial/live race | listener/transport 준비와 요청 epoch를 기록하고 initial 조회 중 invalidation을 잃지 않음. pending refresh를 소진한 뒤 현재 view/cut을 채택. SUBSCRIBED를 atomic cut으로 사용 금지 |
| live update | 같은 owner/stream/context의 권위 기준만 평가. 낮은 순서 거부. 같은 revision·다른 내용은 임의 last-arrival-wins 금지. 다른 view/match의 같은 숫자는 별개 |
| gap/reorder/overflow | 불완전 tail을 적용하지 않고 입력 차단→완전 current-state 재조회. 상한 초과를 성공 coalescing으로 숨기지 않음 |
| quiet loss | 마지막 변경 알림이 유실돼 다음 이벤트가 없어도 독립 current/cursor reconciliation 수행. 연결 유지≠fresh |
| ACK loss/commit unknown | 동일 command identity/hash 상태 조회 또는 명시 재시도. 새 ID로 재실행 금지. 저장 dedupe와 응답 fresh P는 별개 |
| duplicate | mutation once, 현재 응답 권한 재검사. snapshot 재적용·effect·집계·publication dedupe는 서로 별도 |
| recovery | 현재 권한·owner·match/view, authorized state와 update 연속성이 함께 확인돼야 LIVE. 실패/timeout은 드러내고 무한 spinner 금지 |
| auth unknown/terminal | 즉시 차단/pause, 최초 t0+60초 deadline·abort 우선. retry/restart로 t0 초기화 금지. late C/ACK/current 조회로 terminal 부활 금지 |

Core `commit`은 **단일 동기 반영**만 담당한다. `await`는 밖에서 끝낸 후 새 반영 직전 검사를 받아야 한다. thenable을 반환한 뒤 이미 일어난 side effect를 Core가 되돌리지 못하므로 callback 내부의 비동기 작업/재진입 후 복수 쓰기를 허용된 원자 반영으로 오해하지 않는다. 모델은 자기 상태/순서/권한 context를 검사하며 backend admission을 대신하지 않는다.

## 5. H1~H4의 실제 owner와 최소 보완 계획

이 절은 이미 승인된 STEP5A 보완 방향의 구체화다. 새 공통 엔진 제작이나 현재 기존 게임 수정 지시는 아니다. 선택하지 않은 기능은 미지원으로 남길 수 있지만 실제 제품에서 필요한 기능을 wrapper만 달아 충족 처리하면 안 된다.

| 항목 | 실제 코드·현재 consumer | 최소 보완/동등 격리와 시험 |
|---|---|---|
| H1 BGM | `js/game-audio/bgmController.js` L141~166은 `audio.play()` 뒤 상태/의도/finally를 변경. L196~211 pause/play, L271~280 destroy. 기존 게임 wrapper와 site player가 본체 소비 | controller 내부 최신 의도·종료·작업 identity를 success/catch/finally 모두 확인. old finally는 자기 작업만, old cleanup은 새 Audio/재생을 멈추지 않음. listener 재진입 뒤 후속 반영도 검사. pending play→pause/destroy→late success/reject, pause→새 play, track switch, listener 재진입, UI 통지와 자기 Audio 정리 계약 시험. 실제 소리/브라우저 promise는 별도 후속 |
| H2 등록 | `js/invites/inviteRegistry.js` L3~12: key 교체 뒤 old disposer가 동일 key 삭제 가능; dispatch는 당시 handler 호출 | 실제 동적 교체 consumer에는 등록별 identity와 소유 확인을 본체에서 최소 보완. 같은 함수 재등록도 구별해야 함. dispatch 중 교체/old disposer/반복 dispose 계약. 안정적 단일 site 등록만 쓸 경우 그 소유 조건을 증명하고 불필요 엔진은 추가하지 않음 |
| H3 handler/dialog | `js/invites/inviteShare.js` L32~39 QR await 이후 DOM, L75~102 copy/share/QR 완료, L108~109 destroy. site handler·dialog/view가 owner | 실행별 dialog/handler 귀속, destroy 선무효화, 내부 QR/copy/share 성공·실패·후속 DOM/오류 표시 보호. detach된 옛 node라는 이유만으로 전체 안전을 선언하지 않음. 실제 handler의 await 이후 navigation/admission/effect도 current identity 확인. 새 dialog에 old 완료가 영향 없음, 늦은 QR library/QR 생성·reject·close/destroy 경합 시험. 이미 시작한 clipboard/OS share 회수를 보장하지 않음 |
| H4 비room Invite | 기존 `game_room` envelope·route·Registry 기반 target | 실제 선택 전 미지원/미선택. fake room/token/지원 flag로 통과시키지 않음. 지금 전체 blocker로 확대하지 않음 |

API/정상 동작 보존이 불가능하면 기존 게임을 이관하지 않고 **해당 연결만** 중단·경계 판단한다. 사이트 공용 자원 파괴권은 실제 공용 owner에 남고 게임은 자기 사용권만 반납한다. 기존 token/route/target/admission 권한과 생성→resolve→entry→join identity를 전 구간 연결한다.

## 6. 최소 Slice와 재개 순서

S0~S3는 이 문서의 작업 구분이며 기존 legacy ID나 새 플랫폼 계약 ID가 아니다. 공식 22단계/STEP 순서를 바꾸지 않는다.

| Slice | 목적·산출물 | 진입 조건·끝에서의 주장 |
|---|---|---|
| **S0 — 다음 권고 작업** | 이 새 제안의 채택 범위만 선택 모델 명세/owner/API 의미/검증 표에 정식화. 첫 부분 모델과 미지원 연속 영역 분리. CURRENT의 현재 병합 사실 최소 정합화. 구현 후보 경로/의존성/public diff 예상과 미결정 입력 명시 | 사용자 새 제안 채택 및 문서 작업 허용 후 Sol/Codex. production 코드·oracle 등록·Guard/정책/기존 API 변경 없음. 실제 지원은 미지원. 문서 결과 REVIEW_PENDING |
| S1 — I2의 저빈도 제어/단일 채택 최소 구현 | 승인 PG 구조의 session/ready/start/rematch/command identity/terminal 연결과 client 단일 adoption/recovery. 작은 계약 fixture로 제어 순서 검증 | **실제 server 변경의 §4.2 검토**, 새 browser 경로의 exact policy 변경 범위, 구현 명세/관련 실제 oracle 환경이 먼저 닫혀야 함. unit/fixture만으로 runtime 지원 열지 않음 |
| S2 — 첫 Probe에 필요한 연속 입력/시간 연결 | 취소 손실/시간 공백/hidden·연속 상태와 보호 command의 확정 경계를 실제 선택 모델에 연결 | 연속 authority와 current A/C/P 관계를 구체화. 새 memory C/사전 permit/DB 저빈도 범위 확대가 필요하면 상위 변경을 먼저 반환. renderer/physics/prediction은 실제 제품 필요 없으면 만들지 않음 |
| S3 — I3 필요한 Adapter/기능 연결 | Registry/Auth/route/view/recovery trigger, 실제 선택 Invite/BGM/Shell·결과 consumer. H1~3 실제 본체 보완 또는 검증 가능한 격리 | 각 실제 consumer가 선택한 기능만. 기존 API/정상 동작 보존과 relevant oracle. 미선택 H4·보상·Profile 엔진 없음 |

S0 뒤 곧바로 S1~S3를 일괄 실행하지 않는다. 서로 독립인 문서 정식화/owner 보완을 필요 이상 막을 이유도 없다. 다만 현재 사용자 조건의 **server Guard 유지와 exact384 유지** 아래 새 production server/browser 모듈을 몰래 추가하는 경로는 없다. 새 public 코드의 실제 경로가 닫히기 전 숫자만 유지하려고 기존 파일을 합치거나 기존 public 항목을 삭제하지 않는다.

## 7. support / unsupported와 oracle·환경

### 7.1 현재 및 후속 주장 경계

| 범위 | 현재 상태 | 후속 지원 판정에 필요한 것 |
|---|---|---|
| Core 최소 실행 수명/등록 | 기존 승인 결과 재사용 | 실제 consumer 연결의 계약 시험. Core 자체를 재작성하지 않음 |
| PR429 checkout publication | 준비 결과 승인/병합 | 미래 source/revision의 local 검증을 새로 수행. remote artifact/deploy와 별도 |
| 첫 모델/Adapter | **미착수·미지원** | 선택 계약→실제 구현→실제 oracle/환경→관련 Guard 연결/검토. 빈 설정 유지 |
| 저빈도 제어 부분 모델 | 새 구현 순서 제안 | S1의 실제 범위만. 2D 연속 모델 전체 지원으로 확대 금지 |
| 연속 simulation/physics/prediction | 구체 선택/구현 미확보 | 실제 제품·확정 경계가 닫힐 때 해당 부분만 구현 |
| H1~3 | owner/최소 보완 방향 승인, 무보완 연결 지원 보류 | 본체 계약·기존 consumer 회귀 + 별도 실제 browser/audio/DOM 증거 |
| 미래 server 공개 제외 | 아직 해당 server revision 증거 없음 | 같은 변경의 실제 source/policy/output, 공개 참조/bytes 제외, 필요한 실제 게시 증거. M artifact로 대체 금지 |
| 실제 game/browser/cache/SW/운영 | vNext 행동 NOT_RUN, browser/cache/SW UNKNOWN, 운영 UNKNOWN | 해당 단계에서 허용된 실제 관측. fixture/CI로 대체 금지 |

### 7.2 검증 계획 — 이번에는 실행하지 않음

| 환경 | 의미 있는 oracle·최소 사례 | 주장 한계 |
|---|---|---|
| offline Node 계약 | 모든 완료/T01~03, 동기 반영 직전 재검사·await/reentrancy, 부분 초기화·반복 dispose·late resource, old registration disposer·정리 실패 후 독립 정리 | 실행하면 unit/fixture 결과로만 기록. 실제 backend/body/게임 행동 아님 |
| model protocol fault fixture | initial 조회 중 live 변경, quiet last loss, gap/overflow, 중복/역순, 같은 seq 다른 owner/view, ACK loss/commit unknown, 취소 packet loss·옛 renew 도착·hidden 복귀, 최초60초·terminal | 주입 clock/Auth/transport는 production 증거 아님. oracle는 기대 불변량을 검사하며 구현 코드 복제 금지 |
| disposable DB + 해당 신뢰 server 환경 | 안전11 각각의 실제 oracle, 비노출 caller/ACL/Data API·current predicate, lock wait 뒤 A, known expiry, 동일 transaction late C, 새 retry A/P, old writer와 old sender 독립 차단 | safety11 이름만 11개 만든 mock은 부족. 기존 online DB 요구 제거 없음. 실제 DB 시험은 별도 허용 전 NOT_RUN |
| native transport 시험 환경 | 실제 A/commit C/native prefix P의 연결 trace, queue/partial send/suffix 폐쇄, receiver/session/view/payload 재검사 | timestamp만으로 인과 증명 불가. 누락 R/trace/clock error는 INCONCLUSIVE. percentile로 안전 위반 면제 금지 |
| capability unit/DOM fixture | H1 success/reject/finally·Audio 소유, H2 old disposer·same-handler 재등록, H3 QR/copy/share·handler 늦은 완료 | fakeAudio/DOM fixture가 실제 소리·clipboard·OS share/browser 검증 아님 |
| full checkout/기존 CI | 해당 계약 테스트, `npm run test:game-platform`, governance/boundary, build/check:publication, 기존 module links·관련 consumer 회귀. 범위/정책/bytes 비교 | 필요한 변경 때 수행. PR429 준비 전부를 지금 반복하지 않음. 합성 merge/head/evidence/Pages artifact 구분 |
| 별도 허용 실제 실행 | Windows10/11 Chrome·Edge 및 iPhone Safari, 실제 두 client, 모바일5기능, 신규 게임 loaded bytes, local feedback vs 권위 반응, 총100/판8·p95≤250ms·정상망 각 복구≤5초, 운영/삭제/복원/비용 | 정확한 device/build/배포 bytes/망/표본/오차·부하를 실행 전에 닫음. 현행 NOT_RUN/UNKNOWN 유지 |

실제 수치 튜닝/고정 버전·배치 manifest는 정상 구현 책임이다. 승인 목표의 완화나 상위 권한/확정 의미 변경만 Astra/사용자 결정으로 반환한다. 전수 source/SQL 감사·별도 사후 감사·외부 운영 재조사는 추가하지 않는다.

## 8. 미해결 항목과 사용자 결정 범위

| 항목 | 정확한 미해결 | 권고/사용자 결정 범위 |
|---|---|---|
| 초기 두 원문 | 과거 실제 선택/승인 상세 미확보 | 새 자료가 없으면 재검색하지 않음. 이 새 구체화안을 새로운 계획으로 채택할지 결정. 과거 원문 복원 승인으로 쓰지 않음 |
| 첫 부분 구현 | §4의 A/B 선택 중 구현 범위 | **A의 단계적 접근 권고**. 저빈도 세션/단일 채택 부분부터 준비하되 첫 Probe의 이동·협동 및 전체 완료 의무 유지 |
| 연속 authority | 실제 연속 상태 C·인가·fencing과 현재 DB 계약의 관계 | 연속 전부를 PG에 넣거나 memory C를 D0010으로 정당화하지 않음. 구체 후보가 기존 의미로 성립하면 정상 구현, 의미를 바꾸는 경우만 변경 원문/owner/영향을 좁혀 사용자 판단 |
| 새 runtime 경로/정책 | exact384 고정과 신규 browser module 추가가 동시에 성립하지 않음 | 이번에는384 유지. 실제 추가 경로가 확정된 후 미래 revision의 최소 policy diff만 별도 허용 대상. main382·Core 미이식은 그대로 |
| 실제 server 허용 연결 | §4.2는 미래 실제 server 변경의 판단이며 현재 Guard는 존재 차단 | 별도 실제 source 변경/검증 패키지에서 판단. 빈server·fixture·지원flag·M artifact로 허용하지 않음. 이번 계획 채택에 Guard 허용을 묶지 않음 |
| 실제 제품 세부 | 목표/공간/장치/초기 시작 조건/정밀 시뮬레이션 필요·정책 수치의 구체 조합 | 첫 Probe 실제 game-local 조사/네 문서 단계에서 선택. 이번에 게임 규칙·renderer·physics·prediction을 확정하지 않음 |

**지금 검토/채택할 범위는 새 계획의 단계적 접근과 S0 문서 정식화까지**로 권고한다. 이미 승인된 provider/운영/Target/재대결 정책을 다시 고르는 질문은 필요 없다. 이 권고를 채택해도 S1 코드·새 server·policy 수정·Guard 조건부 허용·실제 DB/browser 시험·main/배포는 자동 승인되지 않는다. 이는 스킬이 만든 승인 절차가 아니라 이번 사용자 요청의 계획 한정 범위, 실행계획 §4/STEP7D 및 server-boundary-next-plan §4.2의 구분에 따른다.

## 9. 다음 담당 Sol/Codex 실행 프롬프트

아래는 **사용자가 S0 범위를 채택해 다음 작업으로 지시할 때** 사용할 프롬프트다. 현재 실행 지시가 아니다. 이 프롬프트는 새 모델 정책을 과거 승인으로 기록하지 않도록 범위를 제한한다.

```text
Game Platform vNext STEP7D의 첫 선택 모델/Adapter 새 구체화안을 정식화해줘.
담당 Sol/Codex.

game-platform-vnext-step7d-model-adapter-restart-astra-judgment-2026-10-20.md 전체와
post-pr429-next-handoff·server-boundary-next-plan 전체, 관련 승인 근거를 먼저 읽어줘.
이번에는 새 구체화안의 단계적 접근 A 및 S0 문서 정식화만 진행한다.
초기 STEP7D 원문 두 개의 복원 완료나 과거 모델 정책 승인으로 기록하지 마.

고정 integration bb037653ca81bb294aafa16c248030ccc7eb7a87 /
tree760d5d13f0f98ec16fcc8c4f29fed21389b7c942,
main M=0e4089f345c1f0a33c86c96a1f07a9dab484cc2e /
tree d4f9b568f705a17cca3274f0862d46f5b56b3b76를 구분해줘.
실제 현재 remote/PR429 병합·이후 변경을 먼저 확인하고 자동 포함하지 마.
AGENTS→계획1.6→rebuild README→CURRENT→CP0108→Git으로 복원해줘.
CP0108은 당시 이력으로 보존하고 CURRENT/README의 필요한 현재 표시만 정합화해줘.
별도 병합 기록 PR은 만들지 마.

I2의 저빈도 세션 제어/단일 채택·복구 부분과 미지원 연속 상태 영역을 분리해
계약 후보의 적용 scope·revision·owner/API 의미·명령/응답/확정의 구분,
session/start/rematch·intent 취소 손실·시간 공백/hidden·initial/live/gap/
overflow/quiet loss/ACK loss/중복 및 실제 oracle/환경 표를 정식 문서에 반영해줘.
정상 함수명/자료구조/내부 구현 기법은 선제 동결하지 마.
정식 모델명은 후보 중복/scope를 확인하되 실제 runtime/oracle 지원 등록은 하지 마.

승인 provider/운영 구조/current A/C/P·D0010을 재판단하지 마.
저빈도 PG 모델을 연속 상태 전체로 확대하거나 memory apply를 기존 C로 부르지 마.
H1 BGM 내부 late Audio/DOM, H2 old disposer, H3 handler/dialog 완료의 실제 owner와
최소 보완·동등 격리·기존 consumer 회귀 범위를 명시하고 wrapper 지원을 선언하지 마.
Core 단일 동기 반영과 model/backend 실제 admission을 구분해줘.

다음 코드 Slice에서 필요한 실제 경로/의존성과 publication 정책 변경 예상 범위를
검토 가능한 표로 남겨줘. main382/integration384와 public bytes는 이번에 그대로 유지해줘.
새 server/browser model/Adapter 파일, production 구현을 숨긴 tests/docs,
oracle 항목/지원 flag, source/Guard/workflow/policy/기존 API 변경은 하지 마.
server-boundary-next-plan §4.2의 실제 server 허용 연결은 별도 판단으로 남겨줘.
PR429 checkout 준비를 재구현하거나 같은 검증을 반복하지 마.

관련 진행 중 문서 브랜치가 있으면 확인해 이어가고 없으면 위 integration에서
이 문서 정식화용 브랜치를 사용해줘. 관련 문서/기존 governance 검증과 최소 현재 기록,
commit/push·integration base 검토 PR 제출까지 진행한 후 remote head/tree·diff·CI·
인수인계를 남기고 문서 결과 REVIEW_PENDING에서 멈춰줘.
이 프롬프트를 받은 경우에만 위 Git 변경 범위가 허용되며 모델 구현 승인은 아니다.

새 상위 의미 변경이 꼭 필요하면 원문/줄·현재 consumer·owner·영향·최소 보완·
사용자 결정 범위를 반환해줘. 직접 요구의 legacy ID/f는 만들지 마.
승인 Target/STEP7B §7 전체·기존 consumer/API/Registry 단일 metadata/barrel·
게임/Auth/API/SQL/game-local 네 문서·원본/과거 승인/원ID·줄·f를 보존해줘.
빈 모델/미구현 미지원·runtime/online 차단·기존 online DB 요구·server 차단·
H1~4/단일채택/복구/안전11/current A/C/P/hostless·미승인 재대결 예외 금지를 유지해줘.
고정 M/run39191903797/attempt1/artifact12160182245의 별도 P1 판단과 미래 revision,
browser/cache/SW UNKNOWN 및 전체 미완료 후속 의무를 구분해줘.
STEP7D 미완료·모델/Adapter 미착수·vNext 행동 NOT_RUN·운영 UNKNOWN 유지.
최종 승인/완료 기록·병합·main 변경·설정·dispatch/rerun/upload/deploy·
새 방문/실제 DB/browser/audio/두 client/성능/운영 시험·모델 구현·Guard 해제·
전수 source/SQL 감사·외부 운영 재조사는 하지 마.
```

## 10. 수행 사실과 보존 상태

이번 작업은 지정 전달 문서/승인 근거/고정 tree의 필요한 계약·코드 읽기, 현재 GitHub ref/PR/CI 조회, 이 새 판단·계획 작성이다. 새 HTTP/browser/DB/audio/게임 시험, unit/fixture 재실행, checkout 변경, 저장소 source/Guard/설정/Git/PR/배포 변경을 하지 않았다. repository worktree는 읽기 전후 clean이다.

고정 M/run39191903797/attempt1/public artifact12160182245의 P1 판단은 사용자 browser 선행조건 분리 범위에서 작성된 별도 증거 판단이다. 이번 문서가 그 최종 사용자 결과 승인·완료 기록이나 미래 revision/server 공개 제외 증거를 만들지 않는다. 실제 browser bytes·옛 cache/SW 영향은 UNKNOWN/미완료 의무이며 신규 게임 loaded bytes 확인과 fail-closed Guard는 면제되지 않는다. 옛 정상 root artifact 미확보·완전 원복/무중단 미보장·M 재생성과 보관 ZIP 직접 복원의 차이도 유지한다.

이번 재개 판단은 **새 계획 제출 가능 / S0 권고 / 실제 전체 모델 구현 착수의 전제 미충족**이다. 필요한 상위 변경의 가능성과 정상 구현 상세를 구별했다. 새 제안 채택이나 부분 Slice 결과가 STEP7D 완료/실행 지원/오픈을 뜻하지 않는다.

**최종 유지 상태: STEP7D 미완료 · 모델/Adapter 미착수 · vNext 행동 NOT_RUN · 운영 UNKNOWN · browser/cache/SW UNKNOWN.**

## 부록 A. STEP7B 계획 §7 전체 보존 원문

아래는 고정 integration의 해당 절을 그대로 첨부하는 보존 참조다. 새 규칙/승인으로 재작성하지 않는다.

## 7. 반드시 유지할 조건

- 기존 Auth/게임/API/SQL/Registry metadata/shared barrel/game-local 네 문서 무이관. 기존 승인 원본·STEP1~6/7A1~3 artifacts·루트 계획·DECISIONS·과거 checkpoint 보존. 네 문서 baseline/유효 override/manual gate·기능/디자인 기록 책임 유지.
- STEP4A success/error/null/finally/cleanup/leave/effect/후속 완료·부분 초기화/반복 dispose/late 자원과 T01~03 유지.
- CP0075/D0010 current A/C/P: known expiry 뒤 새 A 금지, 같은 적법 transaction의 일반 저장 지연 late C 제한 수용·실제 C 관측, 새 command/transaction/retry fresh A·새 P fresh 인가, owner anchor·최초60초·terminal·부분 대체 유지. 실제 C5초 PASS로 바꾸지 않음.
- D0006~10 성능/비용/기록/삭제/탈퇴/backup/복원/운영 조건과 UNKNOWN 유지. 공급자/요금/운영 정책 재조사·구매/문의/job/dump/복원 없음.
- Registry 단일 metadata·Snapshot/Reconnect 선택 모델 단일 최종 채택/복구·Shell 공통 표시/local UI/연출·BGM 기존 본체+내부 최소 수명/H1 무보완 연결 보류·Invite 전 구간 identity/사이트 handler/dialog owner/H2~4 유지. Invite/BGM 보완을 얇은 Adapter 안의 새 엔진으로 숨기지 않음.
- STEP5B 공식 결과/정정·producer-consumer·여섯 중복 의미·공개 merge/구현/activation/사건/NEW 소비 분리·Profile recipe 유지. 미래 미선택/비room Invite/보상/정밀 audio/Profile를 전체 blocker로 올리지 않음.
- B01~12/R01~13·안전11/DB와 nonDB 동등 안전·초기 hostless/재대결 host 불성립/미정 조건 유지. 모든 게임 Room/host/DOM/winner/score/XP 강제·multiplayer 재대결 no-op/local/N/A 우회 금지. 승인되지 않은 hostless 재대결 예외나 상위 완화 없음.
- 장르명으로 transport/renderer/tick/physics/prediction/Probe 게임을 선택하지 않음. Guard의 DB/nonDB 적용 연결은 새 권위/순서/수명/token/audio 엔진 또는 실제 모델 지원의 대체물이 아님.
- 원3232·305부모·16행58분할·원ID/줄/강도/부정/부모/조건/예외/f0/명시f 유지. L/H/I·49개/B01~12를 공통 MUST/전수 완료표로 승격하지 않음. STEP6 B08 DEV271 이벤트순서/전달 성공만으로 복구 금지와 DEV251 payload 최종 진실 금지 각각 보존.
