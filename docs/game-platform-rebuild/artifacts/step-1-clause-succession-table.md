# STEP 1 — Clause Succession Table

- 계획: 루트 실행 계획 개정 1.3, STEP 1 전수 계승표 **검토 초안**
- 원문 기준: `132ec1576e316d0238c9ca6e07d0d3ab91950ec8` (승인 integration / STEP 1 분기점)
- 소유 위치 확정: **미수행**. 실제 새 책임 문서·절은 STEP 6에서 확정하고 STEP 7에서 원문 ID별로 닫는다.
- 기존 의무를 없애거나 강도를 바꾸는 결정: 없음. 기존 문서와 게임은 수정하지 않는다.

## 읽는 순서

1. [AS-IS 감사](step-1-as-is-audit.md)의 권위·공통 모듈·findings를 읽는다.
2. 아래 범례와 증거 표로 각 행의 현재 책임·적용 범위·소비 근거를 해석한다.
3. [개발·Governance·DB](step-1-clauses-platform.md), [UI·안내·템플릿](step-1-clauses-design.md), [기존 게임](step-1-clauses-games.md), [사이트·BGM·이력](step-1-clauses-site-history.md)을 해당 source 절 순서로 읽는다.
4. STEP 6/7에서는 각 `K` ID의 **새 문서/절·조건·원래 강도·검증 증거**를 추가한다. 분할한 의무는 모든 목적지, 중복 통합은 모든 원본 ID를 남긴다. 누락/설명 없는 완화/발견 불가능한 경로가 있으면 해당 게이트를 닫지 않는다.

## 집계와 단위

원문 문단, 목록 항목, 표의 행, 필수 형식 블록을 관리단위로 고정했다. 문서 전체를 한 조항으로 세지 않는다. 하나의 문단에 붙어 있는 부정·조건·예외는 같이 보존하며 문단 속 의무 문장 수를 임의로 별개 통계로 늘리지 않는다. 부모 목록 ID와 전체 절 제목도 보존한다.

- 전수 검토 문서: **26개**, `games/` Markdown **14개 전부** 포함.
- 추적 관리단위: **3,232개**.
- 그중 규칙·필수 형식·템플릿 필드: **2,104개**. 이는 중복 제거된 독립 MUST 개수가 아니다.
- 나머지 **1,128개**: 설명·현재 상태·예시·과거 사실·범위 밖 사이트 기능·vNext 작업 제어. 의무로 승격하지 않는다.
- 공통/보드/공용 모델/사이트 계승 검토 대상 `K`: **1,198개**.
- 기존 게임/소비자 한정 보존 `L`: **906개**. 신규 장르 공통 규칙으로 승격하지 않는다.

| 1차 분류 | 규칙·필드 수 | board-game 전용? | 플랫폼 공통? | 특정 runtime/model 종속? |
|---|---:|---|---|---|
| P — 현행 공통 절차·품질·변경관리 | 897 | 일반화 여부는 원문 조건 유지. 구성물 예시는 별도 검토 | 현행 platform-native 적용 | Core 소유를 뜻하지 않음 |
| B — 명시적 보드게임 조사/공간 규칙 | 11 | 예 | 장르 조건부 | 아직 모델 소유 확정 없음 |
| M-ROOM | 30 | 보드게임 사례가 있으나 장르 독점 아님 | 선택 조건부 | 현행 room/lobby/host/ready lifecycle |
| M-DB | 114 | 아니오 | 선택 조건부 | DB/RPC/version/snapshot 권위 |
| M-DOM | 11 | 아니오 | 선택 조건부 | 현행 DOM Shell/명시적 CSS opt-in |
| M-INVITE | 7 | 아니오 | 선택 조건부 | game_room + 사이트 초대 연결 |
| S — 사이트 정책·utility | 128 | 아니오 | 사이트 적용 조건부 | 인증/프로필/DB 운영/BGM의 기존 조건 |
| L — 기존 game-local / 개별 소비자 | 906 | 해당 게임의 보드 규칙·표현 포함. 장르 의무 아님 | 아니오 | 해당 구현만 사실로 보존 |

P 중 **38개**는 보드/카드/구성물·판본 중심 전제가 섞여 `R01-BOARD`로 별도 표시했다. 지금 보드게임 전용으로 단정해 공통 의무에서 제거하지 않으며 STEP 2/5C/6에서 조건을 나눠야 한다.

분류는 STEP 1에서 요구한 **현행 요구의 분류 초안**이다. P를 미래 Core 필수 개념으로, M을 확정된 vNext Runtime Model로 해석하지 않는다. 원문에 온라인 게임 전체로 쓰인 문장을 표의 M 분류만으로 폐기/완화하지 않는다. 모든 책임 재배치는 STEP 2~6과 Architecture Change 검토 대상이다.

## 행의 필드와 강도 해석

| 요구된 필드 | 이 표의 위치/의미 |
|---|---|
| source file / 기준 SHA / 절 / clause | source heading의 파일·blob·기준 commit, 각 소제목의 전체 원문 절, 행의 안정 ID·줄·부모 ID |
| 원래 규칙/강도/조건 | 원문 열 전체 + `본문:MUST/SHOULD…`, `절:MUST…`, 한국어 강도 표현. 본문의 조건·예외·부정이 우선하고 heading은 문맥을 보존함 |
| 명시적 강도가 없는 의무 | `서술형(수치화 안 함)` + RULE/LOCAL_RULE로 표시. SHALL/MUST로 새 승격하지 않음 |
| scope | source의 적용 대상 절 + 해당 절의 도입문 + 원문 조건 + 분류. 원문을 떠난 무조건 적용 금지 |
| 현재 책임 / 관련 코드·문서 / 기존 소비 | 행의 E-*를 아래 표에 연결. 구현을 읽었다는 것과 해당 규칙을 모두 준수한다는 것은 다름 |
| 계승 필요 / 기존 게임 회귀 / 새 게임 설계 가능성 | K/L/H/I 범례와 **기존 게임 회귀 / 신규 게임 적용·미결정의 별도 두 열**. 기존 게임은 그대로 유지; K도 새 소유 위치는 미정. 소스 적용을 바꾸면 후속 impact audit 필요 |
| board-game / 공통 / runtime 종속 | 위 1차 분류 표 + 원문. L의 기존 보드게임 특수규칙은 B 공통 장르 규칙으로 자동 승격하지 않음 |
| 중복 / 충돌 / 모호함 / 미확인 | D01~D10, C01~C03, R01/R02, U03, adoption/override 표시. 표시 없음은 새로운 소유 위치가 확정됐다는 뜻 아님 |
| 이후 결정 | `계승 / 후속 STEP` 열의 STEP 번호. 새 책임 문서·절/유지·세분화·보강·참조 전환 방식은 STEP 6까지 미정 |

K = 원래 의무·권고·허용·예외의 강도와 범위를 계승해야 한다. 기존 코드의 일괄 이동이나 새 Core 편입을 허용하지 않는다.
L = 기존 게임/개별 utility 소비자의 현행 기능/디자인 요구를 보존한다. 새 플랫폼 설계를 제약하는 공통 의무로 쓰지 않는다.
H = 당시 이력·판단을 보존한다. 현재 의무로 재해석하지 않는다.
I = 설명, 예시, 참조, 작업 제어 또는 범위 밖 사이트 기능. 연결된 규칙의 조건/증거로 사용하되 독립 의무 개수에서 제외한다.

`RULE`은 규범 문맥의 서술·금지·허용·조건을 포함하며 모두 MUST라는 뜻이 아니다. `TEMPLATE_FIELD`는 기록할 항목이며 예시값을 강제하지 않는다. `REQUIRED_SHAPE`는 원문이 가리킨 형식/순서를 보존한다. `LOCAL_CONTEXT/LOCAL_HISTORY`는 구현/검증의 과거 보고다. 줄 안의 기존 `CS-UI-*`, `NT-UI-*`, DB scenario ID는 그대로 유지했으며 LEGACY ID가 이들을 대체하지 않는다.

원문 인용 안의 상대 링크/목록 표시는 원문 문자로 보존한다. 원본 파일을 열 때는 각 source 절의 **고정 SHA 링크**를 사용한다. 감사표 위치에서 원래 상대 링크를 재해석하지 않는다.

## 현재 책임과 소비 근거

| E 코드 | 현재 책임 주체·문서 | 실제 코드/검증 연결 | 기존 게임 소비와 확인 한계 |
|---|---|---|---|
| E-GOV | 저장소 작업자 / AGENTS, development §13~14B, governance | `scripts/check-game-platform-governance.mjs`; governance workflow/test | 두 shared 등록 게임 및 기존 Legacy 보호. 문장 의미/production 승인 전부 자동 검증 아님 |
| E-DOC | 게임 작업자 / development, games README, 각 책임 문서·템플릿 | Guard의 4문서 필수 절·교차참조, 각 게임 4문서 | Can’t Stop/No Thanks! 문서 존재 확인. 상세 준수는 F02 등과 구분 |
| E-UI | UI 작업자 / UI Rules, UI_DESIGN baseline + 유효 UI_DECISIONS | 두 게임 UI_DESIGN/UI_DECISIONS, `app.js`/`main.js` presentation 연결 일부 | 기존 adoption 예외·후속 override 보존. 이번 감사에서 브라우저 수동 디자인 검토 재실행 안 함 |
| E-REG | 플랫폼 metadata / development §5 + Registry | `games/shared/registry.js`, game별 registry tests; `js/pages/games.js`의 별도 GAMES | Registry 5개 항목, shared 2개. 사이트 목록은 자동 Registry view가 아님 |
| E-SITE | 사이트 인증/프로필/DB 운영 담당 / AGENTS, Supabase README, development §6A | `js/auth.js`, Access Gate, 두 entry imports, profile nickname migration | 두 게임이 동일 auth source 사용. site 정책을 Core 자체 계약으로 확정 안 함 |
| E-ROOM | room/session 구현 게임 담당 / development §6·10B | shared adapter + 두 `roomLobby.js`/`lobbyController.js`, game-local rematch RPC | 두 게임이 8메서드 adapter를 실제 사용. 멱등성/멤버십/host는 각 서버가 소유 |
| E-DB | DB 모델 소비자 / DB/Test Contract, development §7~9·12 | snapshot/action/reconnect, `platformContract.js`, 두 game DB tests, 읽은 SQL 경계 | 두 게임 snapshot/RPC 연결 확인. production 전체 권한·실행 상태를 새로 증명하지 않음 |
| E-SHELL | DOM UI 소비자 / development §10, UI Rules | `gameShell.js`, `gameShellState.js`, opt-in CSS, 두 game entry | DOM 생성 + player/status normalization 재사용. Canvas/input 엔진은 없음 |
| E-INVITE | 사이트 초대 본체 + shared routing + game별 join | `gameInvite.js`, `js/invites/*`, site invite SQL, cant-stop/invite.js 및 join RPC | Can’t Stop game_room 소비. No Thanks! invite=false/연결 미구현. The Game legacy target 유지 |
| E-BGM | 사이트 presentation utility + 게임별 곡/상태 mapping / game-bgm.md | `js/game-audio/*`, 두 game `bgm.js`, The Game/Liar BGM imports | shared 플랫폼 계약으로 승격 안 된 site utility. 사운드 실패는 게임 권위와 별개 |
| E-CS | Can’t Stop 기능/디자인 책임자 / 자체 4문서 | `games/cant-stop/*` 읽은 연결부, `supabase/cant-stop/*` 선택 경계, 관련 test | RELEASED 기록/등록 상태. 개별 연출·dice/runner 규칙은 신규 게임 템플릿 아님 |
| E-NT | No Thanks! 기능/디자인 책임자 / 자체 4문서·release checklist | `games/no-thanks/*` 읽은 연결부, `supabase/no-thanks/*` 선택 경계, 관련 test | 활성 Registry와 과거 DEVELOPMENT 충돌 F02. private counter·Presence는 game-local |

정확한 함수 exports, 호출자, 읽은 파일/줄 범위는 [AS-IS](step-1-as-is-audit.md)에 연결했다. 범용 E 그룹 안에서도 해당 원문에 관련 없는 모듈까지 그 조항의 소비자로 주장하지 않는다. 문서 절차는 문서/Guard 소비, runtime 계약은 명시한 코드 소비로 구분한다.

## 중복·충돌·미확인

의미가 반복되는 **10개 전파/중복 그룹**을 식별했다. 각 그룹은 삭제 대상으로 확정한 것이 아니며 topic-owner가 명확한 반복은 정상적인 요약·전파다. 총 **141개 행**이 한 개 이상의 그룹에 연결된다(그룹별 행 수의 합과 다름). 게임별 구현 사실과 공통 의무를 같은 의미로 합치지 않는다.

| 그룹 | 반복 주제 | 현재 의미 소유자 | 연결 ID |
|---|---|---|---|
| D01 | 4문서 bootstrap | development §3A | LEGACY-AGENT-037, LEGACY-AGENT-040, LEGACY-DEV-386, LEGACY-GOV-012, LEGACY-GUIDE-008, LEGACY-GUIDE-009, LEGACY-UID-T-001, LEGACY-CS-DEV-105 |
| D02 | 기능 checkpoint | development §3B | LEGACY-AGENT-046, LEGACY-DEV-119, LEGACY-DEV-135, LEGACY-GOV-047, LEGACY-GUIDE-011 |
| D03 | 디자인 checkpoint | UI §6 | LEGACY-AGENT-047, LEGACY-DEV-068, LEGACY-DEV-127, LEGACY-DEV-143, LEGACY-GOV-048, LEGACY-UI-148, LEGACY-GUIDE-012, LEGACY-UID-T-030 |
| D04 | baseline/override | UI §6 / development §3A | LEGACY-AGENT-039, LEGACY-AGENT-042, LEGACY-AGENT-043, LEGACY-DEV-050, LEGACY-DEV-075, LEGACY-DEV-096, LEGACY-DEV-113, LEGACY-DEV-417, LEGACY-GOV-057, LEGACY-UI-082, LEGACY-UI-098, LEGACY-UI-118, LEGACY-UI-137, LEGACY-GUIDE-010, LEGACY-GUIDE-016, LEGACY-DEV-T-001, LEGACY-UID-T-001, LEGACY-UID-T-038, LEGACY-CS-SPEC-001, LEGACY-CS-DEV-001, LEGACY-CS-UI-001, LEGACY-CS-UID-001, LEGACY-CS-UID-101, LEGACY-NT-SPEC-001, LEGACY-NT-DEV-001, LEGACY-NT-UI-001, LEGACY-NT-UID-001, LEGACY-NT-REL-031 |
| D05 | 사이트 닉네임 | development §6A + site profile | LEGACY-DEV-238, LEGACY-DEV-239, LEGACY-DEV-240, LEGACY-DEV-241, LEGACY-DEV-243, LEGACY-DEV-406, LEGACY-SPEC-T-031, LEGACY-CS-SPEC-105, LEGACY-CS-SPEC-154, LEGACY-CS-DEV-131, LEGACY-NT-SPEC-054, LEGACY-NT-SPEC-152, LEGACY-NT-SPEC-192, LEGACY-NT-DEV-172, LEGACY-NT-DEV-176, LEGACY-NT-DEV-183, LEGACY-NT-DEV-192, LEGACY-NT-UI-028 |
| D06 | Realtime invalidation | development §7~9 / DB Contract | LEGACY-DEV-247, LEGACY-DEV-251, LEGACY-DEV-270, LEGACY-DEV-386, LEGACY-DEV-410, LEGACY-DB-036, LEGACY-DB-037, LEGACY-CS-SPEC-126, LEGACY-CS-SPEC-134, LEGACY-CS-SPEC-172, LEGACY-CS-SPEC-196, LEGACY-CS-DEV-115, LEGACY-CS-UID-076, LEGACY-NT-SPEC-156, LEGACY-NT-DEV-185, LEGACY-NT-DEV-191 |
| D07 | same-room rematch | development §10B / DB Contract | LEGACY-AGENT-053, LEGACY-DEV-301, LEGACY-DEV-310, LEGACY-DEV-334, LEGACY-DB-016, LEGACY-DB-039, LEGACY-DB-042, LEGACY-GUIDE-020, LEGACY-SPEC-T-016, LEGACY-CS-SPEC-227, LEGACY-CS-UI-051, LEGACY-NT-SPEC-172, LEGACY-NT-SPEC-179, LEGACY-NT-SPEC-197, LEGACY-NT-SPEC-240, LEGACY-NT-SPEC-253, LEGACY-NT-DEV-143, LEGACY-NT-DEV-148, LEGACY-NT-DEV-208, LEGACY-NT-DEV-209, LEGACY-NT-DEV-282, LEGACY-NT-DEV-287, LEGACY-NT-UI-060, LEGACY-NT-UI-061, LEGACY-NT-UI-062, LEGACY-NT-REL-016, LEGACY-NT-REL-018, LEGACY-NT-REL-030 |
| D08 | 명시적 DB 권한 | Supabase README / DB Contract | LEGACY-DEV-321, LEGACY-DB-020, LEGACY-DB-026, LEGACY-DBOPS-027, LEGACY-DBOPS-029 |
| D09 | production activation | development §5/§3B | LEGACY-DEV-109, LEGACY-DEV-114, LEGACY-DEV-179, LEGACY-DEV-206, LEGACY-DEV-214, LEGACY-DEV-386, LEGACY-DEV-426, LEGACY-CS-SPEC-173, LEGACY-CS-SPEC-230, LEGACY-CS-DEV-093, LEGACY-CS-DEV-116, LEGACY-CS-DEV-130, LEGACY-NT-SPEC-051, LEGACY-NT-SPEC-225, LEGACY-NT-DEV-144, LEGACY-NT-DEV-146, LEGACY-NT-DEV-151, LEGACY-NT-DEV-285, LEGACY-NT-DEV-290, LEGACY-NT-REL-054 |
| D10 | Architecture Change | development §13A / governance | LEGACY-AGENT-054, LEGACY-DEV-021, LEGACY-DEV-354, LEGACY-DEV-357, LEGACY-DEV-436, LEGACY-GOV-037, LEGACY-GOV-038, LEGACY-GUIDE-019 |

| 관계 | 실제 판단 | 후속 책임 |
|---|---|---|
| C01 / F02 | DEVELOPMENT 비활성/release-candidate와 Registry·release checklist 활성 기록 불일치 | STEP 6 기존 소비자 영향 기준에 명시; 기존 게임 문서 수정은 별도 승인 maintenance 범위 |
| C02 / F03 | DB test README의 필수 10개와 CURRENT DB Contract/runner 11개 불일치 | STEP 6/7A2·7B에서 계승 참조 정합성 검토. 과거 10개 당시 기록은 보존 |
| C03 / R01 | §6 host/ready 비보편성과 §10B 모든 multiplayer 재대결 host/ready 의무의 범위 긴장. 현행 예외 승격 절차가 있으므로 직접 논리 모순으로 단정하지 않음 | STEP 2/4B/5C/6. 7A2 전 기존 상세 의무 유효 |
| R02 / F01 | snapshot 버전·수명 문서 요구와 실제 응답 수용 경계 차이 | STEP 3 스트레스, 4B/6 계약 경계 검토. 기존 구현 수정은 별도 범위 |
| U01 | 미래 책임 문서·절/분할·참조 목적지 전부 미확정 | STEP 2~6의 정상 입력. STEP 1 종료 실패가 아님 |
| U02 | 명시적 독립 tick/실시간 입력/Canvas/WebGL/rollback 계약 없음 | STEP 2/3의 조사 입력. 현행 DOM/DB 강제나 새 API 선결정 금지 |
| U03 | 일부 production/manual 검증은 원문이 미완료 또는 역사적 성공을 보고할 뿐 현재 실제 환경 재검증 안 됨 | 기존 게임 상태를 임의 수정하지 않음. 새 Probe 공개 검증과도 구분 |

확정 불일치 **2건(C01/C02)**, 범위 긴장 **1건(C03)**, 코드 기반 암묵적 계약 후보 **8건**, 미확인 범주 **3개(U01~U03)**다. 암묵적 후보는 AS-IS에서 별도 `IMPL-*` ID로 관리하고 기존 규칙 2,104개에 더하지 않는다.

## 원문 인벤토리

| 코드 | source | 권위/상태 | 줄 수 | 관리단위 / 규칙·필드 | 기준 blob |
|---|---|---|---:|---:|---|
| AGENT | [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/AGENTS.md) | CURRENT | 135 | 83 / 70 | `2686a3c37502bbf1f7f2a9407640e78cc026dadb` |
| DEV | [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md) | CURRENT | 863 | 443 / 435 | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` |
| GOV | [docs/game-platform-governance.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-governance.md) | CURRENT | 114 | 59 / 58 | `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169` |
| DB | [docs/game-platform-db-test-contract.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-db-test-contract.md) | CURRENT | 160 | 60 / 55 | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` |
| UI | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) | CURRENT | 395 | 219 / 214 | `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9` |
| GUIDE | [games/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/README.md) | CURRENT | 55 | 37 / 37 | `49c3d8604b8b24d6a5cf5e66d848b35a22610bee` |
| SPEC-T | [games/GAME_SPEC_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/GAME_SPEC_TEMPLATE.md) | TEMPLATE | 81 | 43 / 43 | `2b63d9cafee15bd952fcb4ddb8bb06bcec3240d2` |
| DEV-T | [games/DEVELOPMENT_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/DEVELOPMENT_TEMPLATE.md) | TEMPLATE | 61 | 22 / 21 | `e48f42067682975202067537f005270054ed1e7c` |
| UI-T | [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md) | TEMPLATE | 138 | 92 / 92 | `e412138d9d60f5189709c20c634bcb0f5f28be82` |
| UID-T | [games/UI_DECISIONS_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DECISIONS_TEMPLATE.md) | TEMPLATE | 69 | 39 / 39 | `a8bedc2de5cb80de99c67044c071f3940b778248` |
| CS-SPEC | [games/cant-stop/GAME_SPEC.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/GAME_SPEC.md) | GAME_LOCAL | 350 | 236 / 174 | `8c28edf2c84b351a7ddbc0504c37df2e79b962e4` |
| CS-DEV | [games/cant-stop/DEVELOPMENT.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/DEVELOPMENT.md) | GAME_LOCAL | 199 | 169 / 35 | `de9c2774e43b3646402edbf5785d9580df6e86e6` |
| CS-UI | [games/cant-stop/UI_DESIGN.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/UI_DESIGN.md) | ADOPTION_BASELINE | 118 | 74 / 57 | `4127eb5129923725e1e2c2b1c8a4b7ea87f7bcfe` |
| CS-UID | [games/cant-stop/UI_DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/UI_DECISIONS.md) | GAME_LOCAL | 130 | 101 / 39 | `c77ed6c6acf69888dec8510711c7aa850a424948` |
| NT-SPEC | [games/no-thanks/GAME_SPEC.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/GAME_SPEC.md) | GAME_LOCAL | 399 | 254 / 243 | `11408e010a86c8197068be96a6cbede34c42e477` |
| NT-DEV | [games/no-thanks/DEVELOPMENT.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/DEVELOPMENT.md) | GAME_LOCAL | 332 | 291 / 72 | `c5167e1dc6004d663a58d304e2d8604acfaf3f68` |
| NT-UI | [games/no-thanks/UI_DESIGN.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/UI_DESIGN.md) | ADOPTION_BASELINE | 132 | 88 / 70 | `6d956599f9dfc11fade9a082d68ddec4be05bea2` |
| NT-UID | [games/no-thanks/UI_DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/UI_DECISIONS.md) | GAME_LOCAL | 330 | 271 / 117 | `65437a239c6d9ac2bdb40191bd0f6e5a388b3ead` |
| NT-REL | [games/no-thanks/RELEASE_CHECKLIST.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/RELEASE_CHECKLIST.md) | GAME_LOCAL | 88 | 61 / 60 | `28d562743296889439d19d72bcaa84d843669b0d` |
| BGM | [docs/game-bgm.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-bgm.md) | CURRENT_SITE_UTILITY | 128 | 81 / 81 | `e3767e0b366a5e1f57d5978edf47eb1e129a0931` |
| SITE | [README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/README.md) | SITE_ENTRY | 370 | 155 / 25 | `d51a355bb106e8ff3579e4615e6db1e2709fcd06` |
| DBOPS | [supabase/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/README.md) | SITE_POLICY | 179 | 102 / 46 | `6f79e559386f600bd524615d61dd1e60c361c759` |
| SITEDB | [supabase/site/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/site/README.md) | SITE_POLICY | 149 | 64 / 7 | `02426634228d360249c868d7ed2529ecfded8dd5` |
| DBTEST | [tests/game-db-integration/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-db-integration/README.md) | TEST_GUIDE | 44 | 22 / 14 | `99b8acac6244f4e128766d6a36b6159ce9883848` |
| STRATEGY | [docs/game-platform-strategy.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-strategy.md) | HISTORY | 253 | 121 / 0 | `344297d7d806f164082bcb5a88e41610d3db4d10` |
| INV-H | [docs/game-platform-invite-analysis.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-invite-analysis.md) | HISTORY | 125 | 45 / 0 | `645f565e9c9a2b069bb2be13d70e14c12af2a38f` |

## 범위와 완전성의 한계

상기 26개는 AGENTS → 현재 4개 rulebook → games 안내/템플릿/게임별 14문서 → DB 운영/테스트/BGM의 연결을 추적한 전수 원문 집합이다. 그 파일들의 비어 있지 않은 본문은 규칙뿐 아니라 설명/이력/예시까지 관리단위로 남겨, 키워드 검색에 걸리지 않는 의무가 사라지지 않게 했다. 문서의 모든 문장을 새로운 규칙으로 간주한 것은 아니다.

루트 실행 계획·재구축 README/CURRENT/checkpoint/DECISIONS는 이번 작업의 제어 기준으로 읽었고 legacy 조항 수에 포함하지 않는다. `docs/site-foundation-audit.md`와 `AUDIT_REPORT.md`는 날짜가 있는 사이트 과거 감사임을 진입/범위 절에서 확인했다. 플랫폼 현재 규칙을 대신하지 않으므로 별도 과거 사이트 작업 전체를 계승표에 복제하지 않는다. Legacy 게임 전용 과거 계획/게임play 명세 전체를 신규 플랫폼 의무로 만들지 않는다.

공식 보드게임 규칙서/퍼블리셔 링크는 기존 GAME_SPEC/UI_DESIGN에 기록된 조사 출처라는 사실만 고정했다. 이번 단계에서 외부 원본 규칙을 다시 조사하거나 기존 게임 해석을 고치지 않는다. 새 장르 조사는 이후 STEP이다.

완전성 검증은 원문 blob/줄/본문/ID/부모/절·강도 표현을 대조한다. 의미 분류와 중복 그룹은 인간 검토 대상이며 기계적 trace PASS만으로 계승 결정이 승인된 것으로 간주하지 않는다. 새 소유 목적지가 비어 있는 것은 STEP 1의 미결정 상태로 명시되며 STEP 6/7 완료 때는 허용되지 않는다.
