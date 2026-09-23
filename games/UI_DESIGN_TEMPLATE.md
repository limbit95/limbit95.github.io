# <Game Title> UI Design

> 이 문서는 신규 게임의 runtime/UI 소스 개발을 시작하기 전에 디자인 전수 조사와 분석을 바탕으로 수립하는 game-local 초기 UI/presentation baseline입니다.
> 개발 시작 후 발생하는 사용자 피드백·디자인 수정·대안·검증 이력은 이 문서를 덮어쓰지 않고 `UI_DECISIONS.md`에 기록합니다.
> 공통 UI 조사/설계 규칙은 `docs/game-platform-ui-rules.md`, 게임 기능 설계는 같은 디렉터리의 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.

## Design Research

- Target edition / visual baseline: <대상 판본 또는 기준>
- Official / publisher sources: <공식 제품 페이지, 규칙서, 이미지 자료>
- Additional references: <실제 플레이, 신뢰 가능한 디지털 구현 등>
- 조사한 구성물: <카드/보드/칩/토큰/주사위/말 등>
- Source → Observation → Decision:
  - <출처>: <관찰한 색상/형태/배치/타이포그래피> → <직접 사용 / 재구성 / 사용하지 않음 + 이유>
- 핵심 관찰: <원본에서 반복되는 색상, 배치, 형태, 분위기>
- Last reviewed: <YYYY-MM-DD>

## Copyright / Asset Usage

- Directly usable: <사용 근거가 확인된 자산>
- Recreate / reinterpret: <직접 복제하지 않고 재구성할 요소>
- Do not use directly: <권리가 불명확하거나 보호되는 자산>
- License / attribution notes: <출처와 사용 조건>

## Visual Identity

- Primary color:
- Secondary color:
- Accent color:
- Background color:
- Typography direction:
- Symbols / patterns:
- Material / texture:
- Visual keywords:

## Page Identity

- 청파 같이 일반 화면에서 게임 공간으로 전환되는 방식:
- 전체 배경 / frame:
- title / logo treatment:
- navigation / back-to-games 처리:
- loading / reconnect / error presentation:
- 독립적인 게임 페이지 느낌을 만드는 핵심 요소:

## Lobby / Setup Design

- 방 생성 / 참가:
- 플레이어 roster:
- host / ready 표현:
- rules entry:
- rules / help presentation: <modal 또는 전용 page, Visual Identity 연결, 핵심 메커니즘 시각화, scroll/responsive 방식>
- start action:
- invite / room code presentation:
- desktop / mobile 배치:

## Gameplay Layout

- Main board / shared zone:
- Player zones:
- Public / private information:
- Primary actions:
- Secondary controls:
- 정보 우선순위:
- 실제 보드게임의 공간 구조를 웹으로 옮길 때의 adaptation:

## Components

- Cards:
- Chips / tokens:
- Dice / pieces:
- Player panel:
- Buttons:
- Modal / dialog:
- Rules visual examples: <카드/주사위/말/칩/보드 등 실제 game component를 활용해 설명할 핵심 규칙과 accessibility fallback>
- Status / toast / event message:
- Result component:

## Motion / Interaction

- 핵심 행동 1:
- 핵심 행동 2:
- turn transition:
- acquire / spend / move feedback:
- timing 원칙:
- server-authoritative state와 presentation의 동기화 기준:
- sound / haptic 계획이 있다면:

## Result / Rematch Presentation

- 결과 정보 계층:
- winner / draw 표현:
- rematch CTA:
- ready 상태 표현:
- host start condition 표현:
- leave action:
- 다음 게임으로 전환되는 presentation:

## Responsive Strategy

- Desktop:
- Tablet:
- Mobile:
- 작은 높이 화면:
- 많은 카드/토큰을 수용하는 방식:
- touch / accessibility 고려:

## Implementation Plan

> 이 섹션은 소스 개발 시작 전에 수립한 최초 UI/presentation Phase와 구현 순서를 기록합니다. 개발 중 이 순서나 세부안이 변경되면 이 baseline을 지우거나 재작성하지 않고 `UI_DECISIONS.md`에 override 결정을 남깁니다.
> 기능/DB/RPC 구현 순서는 `GAME_SPEC.md`, 실제 디자인 진행·변경 결정은 `UI_DECISIONS.md`, 기능 다음 작업은 `DEVELOPMENT.md / Next Work`에서 관리합니다.

1. <Visual Identity / page frame>
2. <Lobby/setup>
3. <Gameplay core layout/components>
4. <Motion/interaction>
5. <Result/rematch>
6. <Responsive/polish>

필요한 asset과 라이선스 확인 상태를 각 단계에 함께 기록합니다.

## Validation Checklist

- [ ] 조사 출처와 목표 판본이 기록되어 있다.
- [ ] 자산의 직접 사용 / 재구성 / 사용 금지 경계가 기록되어 있다.
- [ ] 게임 고유 Visual Identity가 정의되어 있다.
- [ ] 일반 청파 같이 페이지와 구별되는 독립적인 game page identity가 있다.
- [ ] lobby → gameplay → result/rematch가 하나의 디자인 언어를 유지한다.
- [ ] 규칙 안내가 generic 문서 UI로 분리되지 않고 해당 게임의 Visual Identity와 정보 계층을 유지한다.
- [ ] 규칙의 핵심 시각 예시는 실제 규칙과 일치하고, 장식 없이도 텍스트/semantic structure로 이해할 수 있다.
- [ ] 핵심 구성물과 action이 실제 게임의 플레이 감각을 전달한다.
- [ ] animation timing이 authoritative state와 충돌하지 않는다.
- [ ] desktop/mobile에서 핵심 정보와 action을 사용할 수 있다.
- [ ] 개발 시작 후 baseline에서 벗어난 의미 있는 디자인 결정·수동 리뷰 결과·검증 이력이 있다면 `UI_DECISIONS.md`가 이를 추적한다.

## Open Questions / Deferred

- <아직 확정하지 않은 디자인/asset/interaction 결정, 없으면 없음>
- runtime 개발 전에 확정된 내용은 이 baseline에 반영합니다. 개발 시작 후 확정되는 변경은 이 문서를 덮어쓰지 않고 `UI_DECISIONS.md`에 남깁니다.
