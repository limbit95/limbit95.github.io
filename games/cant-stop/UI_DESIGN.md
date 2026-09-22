# Can't Stop UI Design

> 이 문서는 현재 Can't Stop v1의 game-local UI/presentation baseline과 후속 개선 기준을 기록합니다.
> 플랫폼 공통 기준은 `docs/game-platform-ui-rules.md`, 기능 규칙은 `GAME_SPEC.md`, 디자인 개발 진행·결정 이력은 `UI_DECISIONS.md`, 기능 구현 진행은 `DEVELOPMENT.md`에서 관리합니다.
>
> v1 RELEASED 이후 UI Design 규칙을 도입하면서 기존 구현을 소급 문서화한 baseline이며, 이 문서 추가만으로 release runtime을 변경하지 않습니다.

## Design Research

- Target edition / visual baseline: 원본 gameplay의 산악 등반 메타포를 기능적으로 재해석한 청파 같이 v1 설산 등반 테마
- Official / rules sources:
  - Can't Stop rulebook PDF: https://cdn.1j1ju.com/medias/d8/88/07-cant-stop-rulebook.pdf
  - Board Game Arena: https://boardgamearena.com/gamepanel?game=cantstop
  - BoardGameGeek: https://boardgamegeek.com/boardgame/41/cant-stop
- Additional reference: 실제 2–12 column 구조와 push-your-luck 진행을 원본 규칙과 교차 확인
- 조사/구현 대상 구성물: 2–12 열, neutral runner, player marker, 네 개의 d6, claim 상태
- 핵심 관찰: 숫자 열의 높낮이와 정상 도달이 시각적으로 즉시 읽혀야 하며, push/stop/bust의 위험감이 핵심입니다.
- Last reviewed: 2026-09-22

## Copyright / Asset Usage

- Directly usable: 자체 제작한 설산 board SVG/CSS, 자체 제작 dice/marker presentation
- Recreate / reinterpret: 등반/정상 메타포와 열 구조를 독자적인 설산 테마로 재구성
- Do not use directly: 사용 허가가 확인되지 않은 원본 판본의 artwork, 로고, 제품 이미지
- License / attribution notes: v1은 원본 artwork/상표 디자인 복제를 제품 범위에서 제외합니다.

## Visual Identity

- Primary color: 설산/빙설 board의 차가운 자연 계열
- Secondary color: column과 board depth를 구분하는 중립 계열
- Accent color: active runner, claim, 위험/성공 상태
- Background color: 게임 보드가 독립적으로 떠 보이는 어두운/중립 game frame
- Typography direction: column 번호와 진행 상태를 빠르게 읽을 수 있는 명확한 숫자 우선
- Symbols / patterns: 산, 정상, 눈/빙판, 등반 marker
- Material / texture: 2.5D board와 주사위가 물리 구성물처럼 느껴지는 깊이
- Visual keywords: 설산, 등반, push-your-luck, 정상, 미끄러짐

## Page Identity

- entry/lobby/gameplay이 일반 사이트 카드 모음처럼 보이지 않고 하나의 설산 게임 공간으로 이어집니다.
- 공통 Game Shell을 사용하더라도 board와 player presentation은 game-local 테마를 우선합니다.
- reconnect/error 상태도 보드 맥락을 유지하면서 명확한 시스템 상태를 전달합니다.

## Lobby / Setup Design

- 플랫폼 공통 room/ready/host start 구조를 사용합니다.
- 게임 시작 전 2–12 board preview와 플레이어 identity가 같은 설산 디자인 언어로 보입니다.
- 규칙 modal에서 pairing, runner, stop, bust, claim을 시각적으로 이해할 수 있게 유지합니다.
- invite/room code는 기능적으로 명확하되 board presentation과 경쟁하지 않습니다.

## Gameplay Layout

- 2–12의 11개 column이 중앙 보드의 최우선 정보입니다.
- 각 column의 높이, runner, permanent progress, claim 상태를 같은 좌표계에서 읽습니다.
- 네 개의 주사위와 legal pairing action은 board를 가리지 않는 action zone에 둡니다.
- player state와 active turn은 board 진행 상태를 해치지 않는 보조 계층으로 둡니다.

## Components

- Cards: 해당 없음
- Chips / tokens: runner/permanent marker/claim marker를 역할별로 구분
- Dice / pieces: 2.5D dice rolling과 결과 숫자의 가독성을 함께 유지
- Player panel: 프로필, 차례, claim 상태를 간결하게 표시
- Buttons: roll / pairing / push / stop의 위험과 우선순위를 구분
- Modal / dialog: 규칙/수동 종료 확인을 game-local frame 안에서 표시
- Status / event message: bust, claim, salary가 아닌 게임 핵심 이벤트를 보드 위 presentation으로 전달
- Result component: 승자와 세 column claim 상태를 보드 맥락에서 보여줌

## Motion / Interaction

- dice roll: 결과가 확정된 뒤 물리적으로 굴러 정착하는 느낌을 제공
- runner move: 선택 pairing에 따라 어떤 column이 이동했는지 추적 가능해야 함
- bust: 임시 progress가 사라지는 위험을 미끄러짐/후퇴 presentation으로 전달
- claim: 정상 도달 후 stop commit에서 확정되는 순서를 명확히 표현
- turn transition: action presentation이 끝난 뒤 다음 플레이어 강조
- timing 원칙: authoritative 결과와 presentation 순서를 분리하되 서로 모순되지 않게 함
- server-authoritative state와 presentation의 동기화 기준: UI는 snapshot 결과를 설명하고 client-local 계산을 truth로 사용하지 않음
- sound: dice/bust Web Audio SFX는 game-local 효과음으로 유지한다. BGM은 page entry·entry·waiting·rematch waiting에서 `Frozen Star`, authoritative room status가 `playing`인 gameplay/GAME_OVER에서 `Mountain Emperor`를 사용한다. 상태 전환은 presentation-only이며 서버 snapshot truth를 변경하지 않는다. Player pause/저장 volume은 track 전환에서도 유지하고 브라우저 autoplay 제한을 따른다.

## Result / Rematch Presentation

- winner와 claim된 세 column을 명확히 보여줍니다.
- GAME_OVER 이후 동일 room/player context를 유지한 rematch 준비로 전환합니다.
- ready 상태와 host start 가능 조건을 lobby visual language로 다시 표시합니다.
- host succession이나 player leave가 발생해도 authoritative snapshot을 기준으로 UI를 복구합니다.

## Responsive Strategy

- Desktop: 11개 column 전체와 dice/action zone을 한눈에 보는 것을 우선합니다.
- Tablet: board 비율을 유지하면서 player panel 밀도를 낮춥니다.
- Mobile: board의 column 가독성을 먼저 보존하고 secondary roster/action을 접거나 재배치합니다.
- 작은 높이 화면: dice/action panel이 board를 과도하게 가리지 않게 합니다.
- 많은 marker: player별 marker가 같은 칸에 공존할 수 있는 규칙을 표현할 수 있어야 합니다.
- touch / accessibility: pairing/stop 등 핵심 선택을 hover 없이 실행할 수 있게 합니다.

## Implementation Plan

1. 현재 v1 설산 Visual Identity와 자체 asset을 baseline으로 유지합니다.
2. 후속 변경 시 board/dice/runner hierarchy가 실제 규칙 이해를 더 돕는지 우선 검토합니다.
3. motion 변경은 roll → pairing → runner → push/stop → bust/claim 순서를 해치지 않게 합니다.
4. result/rematch와 lobby 복귀가 같은 game identity 안에서 이어지는지 유지합니다.
5. 실제 다중 브라우저와 mobile에서 board/action 가독성을 검증합니다.

## Validation Checklist

- [x] 원본 gameplay 구조를 독자적인 설산 테마로 재해석했다.
- [x] 원본 artwork/상표 디자인의 직접 복제를 제품 범위에서 제외했다.
- [x] 일반 사이트와 구별되는 game-local board identity가 있다.
- [x] dice, runner, permanent progress, claim을 구분할 수 있다.
- [x] GAME_OVER → rematch lobby 흐름이 존재한다.
- [x] 설산 대기 분위기(`Frozen Star`)와 실제 등반 gameplay(`Mountain Emperor`)를 상태별 BGM으로 구분하고 rematch waiting에서 대기 음악으로 복귀한다.
- [ ] 후속 exploratory playtest에서 다양한 mobile 높이의 board/action 밀도를 계속 관찰한다.
- [ ] 브라우저 autoplay 정책에 따른 remote sound 경험을 계속 관찰한다.

## Open Questions / Deferred

- 물리 엔진 기반 고급 3D 주사위/보드 연출은 현재 v1 scope 밖입니다.
- v1 release baseline을 변경하는 UI polish는 별도 유지보수 PR에서 진행합니다.
