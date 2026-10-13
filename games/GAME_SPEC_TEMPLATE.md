# <Game Title> Game Spec

> 이 문서는 이 게임이 무엇이며 청파 같이에서 어떤 규칙과 구조로 구현할지 정의하는 game-local 설계 기준입니다.
> UI/presentation은 같은 디렉터리의 `UI_DESIGN.md`에 소스 개발 전 초기 baseline을 두고, 개발 시작 후 변경·결정·검증과 override는 `UI_DECISIONS.md`에서 관리합니다. 기능 구현 진행상황은 `DEVELOPMENT.md`에서 관리합니다.
> 공통 UI 조사/설계 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.

## Game Overview

- Game id: <lowercase-kebab-case>
- Players: <supported player count>
- Core loop: <한 문장>
- Win condition: <한 문장>

## Rules and Sources

- <공식 규칙서 / 퍼블리셔 / 신뢰 가능한 규칙 출처>
- <출처마다 구현에 필요한 규칙 차이 또는 버전 차이를 기록>
- 원문을 장문 복제하지 않고 구현에 필요한 사실과 해석만 요약합니다.
- 처음 플레이하는 사용자가 읽고 바로 플레이할 수 있는 사용자용 규칙 안내의 구성과 노출 위치(modal 또는 전용 페이지)를 정의합니다.

## Product Scope

- Included: <이번 제품에서 지원할 규칙/모드>
- Deferred: <후속으로 미룰 규칙/모드>
- Not planned: <명시적 제외>

## State Machine

- <ENTRY / SETUP / PLAY / TERMINAL 등 이 게임에 필요한 상태와 전이>
- 각 상태에서 가능한 action과 전이 조건을 기록합니다.
- lobby, ready, host start 같은 시작 lifecycle은 실제 게임 구조에 맞게 정의합니다.
- 멀티플레이 게임은 TERMINAL/GAME_OVER 이후 동일 room/player context를 유지하는 rematch 준비 상태와 준비 완료 → 방장 시작 흐름을 정의합니다.

## Domain Model

- <보드/카드/주사위/말/플레이어 상태 등>
- deterministic 계산에 필요한 핵심 데이터 구조를 기록합니다.

## Platform Boundary

- SHARED: <이 게임이 실제 사용하는 Registry / Access Gate / Room-Session / Snapshot / Reconnect / Invite 등 재사용 항목>
- GAME-LOCAL: <게임 규칙, 상태 머신, 도메인 계산, 전용 UI>
- shared 계약 확장이 필요해 보이는 항목은 실제 공통 책임인지 확인 전까지 GAME-LOCAL로 둡니다.
- 현재 shared lifecycle에 맞추기 위해 게임에 존재하지 않는 ready/host 같은 시작 개념을 억지로 추가하지 않습니다.
- 멀티플레이 재대결 UX는 공통 제품 요구사항으로 설계하되 이를 위해 특정 RPC 이름이나 shared adapter method를 선행 강제하지 않습니다.

## Authority and Persistence

- online/stateful 게임이라면 서버가 최종 결정해야 하는 action과 난수 결과
- authoritative snapshot이 필요한 경우 포함할 public/private state
- 상태 변경 action이 있다면 version / idempotency / transaction 경계
- reconnect가 필요한 경우 복원 기준

## UI / UX Direction

- 상세 Visual Identity, 원본 디자인 조사, page/lobby/gameplay/result layout, motion, responsive 계획은 `UI_DESIGN.md`에서 관리합니다.
- 공통 Shell 사용 범위와 game-local UI 경계를 요약합니다.
- 플레이 시작 전 entry/setup 화면과 플레이 중 게임 규칙 보기 진입점을 정의합니다.
- 사이트 계정 기반 multiplayer라면 플레이어 표시 이름은 사이트 프로필 닉네임을 사용하고 게임별 입력/변경 UI를 두지 않습니다.
- 지속되는 플레이 세션이 있다면 종료 권한과 확인 UX를 정의합니다.
- 멀티플레이 게임이면 게임 종료 → 재대결 준비 → 참여자 준비 완료 → 방장 시작 → 새 게임의 lifecycle을 정의합니다.

## Implementation Plan

> 기능·상태 머신·DB/RPC·플랫폼 연결의 설계 순서만 관리합니다. 디자인 기준은 `UI_DESIGN.md`, 디자인 개발 진행·결정 이력은 `UI_DECISIONS.md`, 현재 실제 기능 다음 작업은 `DEVELOPMENT.md / Next Work`에서 관리합니다.

1. <첫 구현 slice>
2. <다음 slice>
3. <이 게임이 사용하는 online/DB/snapshot/realtime/UI capability 순서>

## Validation Plan

- 게임 규칙 unit test
- Game Platform contract test
- online인 경우 DB/Test Contract
- 해당하는 경우 multiplayer / reconnect / stale action 회귀
- 필요한 수동 브라우저 검증

## Open Questions / Deferred

- <아직 확정하지 않은 규칙/UX/기술 결정, 없으면 없음>

## Applied Contract / Scope — 신규 vNext 선택 시

상위 `docs/game-platform-architecture.md`, 공통 `docs/game-platform-common-rules.md`, 수명 `docs/game-platform-lifetime-contract.md`, 선택 모델 `docs/game-platform-model-contracts.md`, 기능 `docs/game-platform-capability-contracts.md`를 따른다. 기존 consumer는 원래 계약/네 문서 baseline과 유효 override를 유지한다.

- Platform contract: 실제 신규 vNext 선택이면 GAME_SPEC에 `GP-COMMON/1` 한 값을 기록; 미선택과 legacy 범위를 구분.
- Selected model contract: 실제 선택 계약ID/revision·7축·선택이유. 미정이면 UNSELECTED와 구현 전 닫을 질문을 기록.
- Genre / capability contracts: 적용 ID/revision과 현재 유효 원문/승인 내용 경로.
- Not applicable / unsupported / undecided: 실제 이유·조건·검증/후속 의무. 없는 Room/host/DOM/winner/score/XP를 생성하지 않음.
- 기능현재/진행/초기디자인baseline/후속유효디자인결정 책임은 각각 GAME_SPEC/DEVELOPMENT/UI_DESIGN/UI_DECISIONS.
- 실제 multiplayer 재대결·온라인 안전11을 N/A/no-op/local로 지우지 않음. hostless 재대결 예외는 미승인.
- 정확히 네 문서의 bootstrap은 미등록 가능; runtime 추가 순간 Registry/선택모델 검사 적용. 미지원 oracle를 기존 DB 검사 제거로 허용하지 않음.

이 추가 질문을 기존 game-local 네 문서의 새baseline으로 강제 적용하지 않는다. BO 실제본문은7A2의 하위 owner에 연결하고 RT 실제본문은7A3의 하위 owner로 연결하고 AR4의 고정 승인 계승 경로를 유지한다.

## Board Experience — 신규 vNext 보드 적용 시

상위 `docs/game-platform-architecture.md` → 보드 `docs/game-platform-board-rules.md` BO1~4 → 실제 네 문서/선택 모델/검증으로 연결한다. 실제 보드 경험일 때 `GP-GENRE-BOARD/1` 적용과 선택 이유·제품/목표 판본·공식 규칙 출처/해석·실제 구성물·정보 공간·안내를 기능 현재 기준에 기록한다. 실제 선택 모델/Capability·비적용/미지원/미정과 안전/재대결 조건은 AR/MO/CA를 참조한다.

이 질문은 실제 보드 경험에만 적용하며 기존 game-local 네 문서의 재작성/이관이나 모든 게임의 Room/host/DOM/winner/score/XP 강제가 아니다. multiplayer 재대결·온라인 안전 의무를 N/A/no-op/local로 제거하지 않는다. 장르 계약 존재를 runtime 지원/행동 PASS로 표시하지 않는다.

## Realtime Cooperative / Spatial Experience — 해당 신규 vNext 경험 적용 시

상위 docs/game-platform-architecture.md → 장르 docs/game-platform-realtime-coop-rules.md RT1~6/R01~13 → 실제네문서/모델/검증으로연결한다. 실제협동흐름/목표/실패/종료·지속intent/취소·공간/시간·역할·시작/재대결/결과유무·7축/선택모델·적용GP-GENRE-REALTIME-COOP/1·기능사용/비적용/미선택/미지원을현재기준에기록한다.

없는Room/host/winner/score/XP를생성하지않고 실제multiplayer재대결/온라인안전/수명은 MO/LI의승인조건을따른다. cancel전달/시간공백·지원환경/표본은후속선택·검증이며임의기술/수치를동결하지않는다. 기존game-local네문서이관과행동지원PASS선언은아니다.
