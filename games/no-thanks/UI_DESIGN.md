# No Thanks! UI Design

> 이 문서는 No Thanks!의 소스/UI 개발 당시 전수 조사·분석을 바탕으로 정리한 game-local 디자인 baseline입니다.
> 플랫폼 공통 기준은 `docs/game-platform-ui-rules.md`, 기능 규칙은 `GAME_SPEC.md`, 개발 시작 후의 디자인 수정·결정·검증과 baseline override는 `UI_DECISIONS.md`, 기능 구현 진행은 `DEVELOPMENT.md`에서 관리합니다.
>
> 이 baseline 이후 사용자 피드백과 실제 구현 과정에서 수정된 디자인은 `UI_DECISIONS.md`의 최신 non-superseded 결정이 우선합니다. 이 문서의 초기 Phase를 근거로 이미 반영된 수정 사항을 원복하지 않습니다.

## Design Research

- Target edition / visual baseline: 기본 숫자 카드와 칩 중심의 No Thanks! 정체성을 우선하며, 특정 재판의 보호되는 일러스트/로고를 그대로 복제하지 않습니다.
- Official / publisher sources:
  - AMIGO 공식 영문 규칙서: https://blog.amigo-spiele.de/content/ap/rule/02455-GB-AmigoRule.pdf
  - AMIGO 공식 제품 페이지: https://www.amigo-spiele.de/no-thanks_2455_1247
- Additional references:
  - Board Game Arena 규칙 요약: https://en.doc.boardgamearena.com/Gamehelpnothanks
- 조사/구현 대상 구성물: 숫자 카드, 중앙 카드, 카드 위 공개 칩 더미, 플레이어 보유 카드 묶음, 플레이어 프로필/비공개 칩 상태
- 핵심 관찰: 복잡한 보드보다 큰 숫자 카드와 칩의 선택이 중심이며, 카드 숫자는 겹쳐도 읽히는 정보 계층이 중요합니다.
- Last reviewed: 2026-09-22

## Copyright / Asset Usage

- Directly usable: 직접 제작한 CSS shape, 숫자/텍스트, 라이선스가 확인된 일반 아이콘
- Recreate / reinterpret: 원본 카드의 정보 계층, 시그니처 컬러 관계, 카드/칩의 물리적 느낌
- Do not use directly: 사용 허가가 확인되지 않은 공식 로고, 박스/카드 일러스트, 제품 사진
- License / attribution notes: 최종 polish에서 특정 판본의 정확한 색/그래픽을 차용하기 전에 공식 자산 사용 조건을 다시 확인합니다.

## Visual Identity

- Primary color: 목표 판본 조사에서 확인한 카드 중심 시그니처 컬러를 기준으로 확정
- Secondary color: 카드/칩과 충돌하지 않는 중립 계열
- Accent color: 현재 차례, 선택 가능 action, 중요한 칩 이동에 제한적으로 사용
- Background color: 카드와 칩이 테이블 위 구성물처럼 분리되어 보이는 game-local 배경
- Typography direction: 큰 숫자를 최우선 정보로 읽을 수 있는 굵고 단순한 숫자 표현
- Symbols / patterns: 과도한 장식보다 카드/칩 자체를 상징 요소로 사용
- Material / texture: 카드와 플라스틱/목재 칩의 물리감을 가볍게 전달
- Visual keywords: 숫자 카드, 칩, 긴장감, 간결함, 테이블 게임

## Page Identity

- 게임 목록에서 진입하면 청파 같이 일반 카드 UI가 아니라 No Thanks! 전용 table/game frame으로 전환합니다.
- lobby부터 gameplay까지 같은 배경, 타이포그래피, 카드/칩 언어를 유지합니다.
- 사이트 공통 identity/접근 경계는 유지하되 header와 panel의 시각 표현은 게임-local 테마에 맞춥니다.
- loading/reconnect/error도 generic 흰 카드가 아니라 같은 game frame 안에서 표시합니다.

## Lobby / Setup Design

- 방 생성/참가와 준비 완료는 플랫폼 공통 lifecycle을 유지합니다.
- 프로필 이미지와 닉네임을 플레이어 seat/패널의 핵심 identity로 사용합니다.
- host/ready 상태는 layout을 흔들지 않는 badge/tint로 표현합니다.
- 규칙 보기는 gameplay 이전에 항상 접근 가능하게 유지합니다.
- 시작 action은 방장에게만 명확히 노출하고 준비 미완료 이유를 함께 이해할 수 있게 합니다.

## Gameplay Layout

- WAITING과 PLAYING은 같은 대형 직사각형 game board scene을 사용하고, 중앙에는 타원형 table을 둡니다.
- 3–7인 좌석은 authoritative seat/turn order를 바꾸지 않고 viewer 기준 표현 순서만 회전해 자신의 좌석이 항상 6시 방향에 오게 합니다.
- 좌석 프로필 이미지의 중심점이 타원형 테이블의 실제 외곽 테두리 중심선에 오도록 배치하고, 현재 차례 avatar만 약 30% 확대해 턴을 읽게 합니다.
- 보드 우측 상단에는 room code / 인원 / ready / connection / host를 compact HUD로 표시하며, board mode에서는 공통 대형 sidebar roster를 숨깁니다.
- 모바일에서도 host/ready/connection 상태는 compact indicator로 유지하고 핵심 상태를 통째로 숨기지 않습니다.
- 보드 아래 개인 패널은 보드와 같은 폭을 사용하며 desktop chip 열은 약 192px, hand 영역은 많은 카드를 수용하도록 동적 overlap을 사용합니다.
- 보유 카드는 좌상단/우하단 숫자를 유지하고 hover/focus 시 위로만 들어 올려 인접 카드 숫자를 가리지 않습니다.
- 중앙에는 deck / 현재 공개 카드 / 공개 칩 더미가 하나의 핵심 zone으로 보이게 합니다.
- 각 플레이어가 가져간 카드는 개인 패널에서 포커 카드처럼 일부 겹쳐 정리할 수 있게 하되 숫자 식별성을 유지합니다.
- 겹치는 카드에서도 숫자를 읽을 수 있도록 최소 왼쪽 상단 정보가 항상 노출되게 설계하고, 필요하면 반대 모서리 정보도 사용합니다.
- 현재 카드의 칩과 플레이어 개인 칩의 공개/비공개 경계를 시각적으로 구분합니다.
- 핵심 action은 거절과 카드 가져오기에 집중하고 부가 controls가 경쟁하지 않게 합니다.

## Components

- Cards: 실제 카드 비율과 큰 숫자 중심. 많은 카드가 생겨도 겹침 상태에서 숫자를 읽을 수 있어야 합니다.
- Chips / tokens: 이동 출발점과 도착점이 명확한 실물 구성물처럼 표현합니다.
- Dice / pieces: 해당 없음
- Player panel: 프로필, 공개 카드, 현재 턴/준비 상태를 수용하고 과도한 높이 증가를 막습니다.
- Buttons: 게임 시그니처 컬러를 사용하되 action priority가 명확해야 합니다.
- Modal / dialog: 규칙/종료 확인 등 기능은 유지하되 game-local visual language를 사용합니다.
- Status / event message: 플레이 흐름을 방해하는 고정 카드 대신 짧은 overlay/message presentation을 우선합니다.
- Result component: 최종 점수와 승자를 카드/칩 언어 안에서 보여줍니다.

## Motion / Interaction

- 카드 공개: draw deck의 실제 위치에서 별도 fixed flight card가 출발해 약 760ms 동안 arc 이동과 flip을 수행합니다. presentation effect는 시작 시점이 아니라 landing 완료 시점까지 유지하며, 동일 snapshot 재렌더가 중간에 발생해도 실제 current card는 `is-awaiting-deal` 상태로 숨겨 둡니다. 이동 카드가 도착한 프레임에 최신 current-card DOM을 공개하고 약 130ms settle/fade로 handoff합니다. landing 완료 시 `roomId:version:currentCard:deckRemaining` 기반 settled deal key를 기록하며, 브라우저 visibility/pageshow reconnect refresh 또는 같은 페이지의 controller 재구성으로 동일 authoritative snapshot을 다시 받아도 이미 settled된 deal은 재생하지 않습니다. deck visual depth는 남은 카드 단계 규칙으로만 변합니다.
- 칩 제출: 약 26px token이 플레이어 seat에서 중앙 pile까지 약 780ms 이동하고, 도착 후 약 100ms landing dwell을 거친 뒤 presentation count를 authoritative 최종 값으로 handoff합니다.
- 카드 가져오기: TAKE_CARD 직전 중앙 공개 카드와 실제 중앙 칩 DOM을 fixed overlay로 보존해 authoritative snapshot render 때 원본이 먼저 사라져 보이지 않게 합니다. 공개 카드는 개인 패널의 기존 보유 카드가 없으면 맨 왼쪽, 있으면 현재 가장 오른쪽 카드 다음 transient slot으로 The Game과 같은 22% / 50% / 78% / 94% arc timing을 따라 이동·안착합니다. 카드 landing과 chip landing은 뒤이어 실행되는 deal effect와 별도 상태로 기록합니다. 한 번 안착한 카드는 다음 카드 deal 중 동일 snapshot 재렌더가 발생해도 다시 `is-awaiting-take-landing` 상태로 돌아가지 않으며, landing 대상은 해당 card value의 최신 DOM만 선택합니다. 중앙 칩은 TAKE 시점의 authoritative center count를 batch count로 고정하고 그 수만 한 번 소비합니다. 부루마블 money transfer처럼 각 visible chip의 실제 출발 위치에서 내 보유 칩 영역으로 짧은 stagger 곡선 이동을 수행하며, batch 전체가 끝난 같은 task에서 overlay를 제거하고 개인 칩 count/cluster를 authoritative 최종 값으로 handoff합니다. 카드/칩 handoff가 끝난 뒤에만 draw deck의 다음 카드 공개 motion을 시작합니다.
- turn transition: action 완료 presentation 이후 다음 active player를 강조합니다.
- timing 원칙: 상태 숫자 증가가 구성물 도착보다 먼저 보여 원인/결과가 뒤집히지 않게 합니다.
- server-authoritative state와 presentation의 동기화 기준: 서버 결과가 truth이며 animation은 그 결과를 설명하는 presentation layer로만 동작합니다.
- sound: 칩/카드 행동을 보조하되 브라우저 autoplay 정책과 사용자 음소거 선택을 존중합니다.

## Result / Rematch Presentation

- 최종 점수의 카드 합, 남은 칩 차감, 공동 승리를 읽을 수 있어야 합니다.
- 재대결은 새 방 생성이 아니라 동일 room/player context에서 준비 상태로 전환되는 흐름을 사용합니다.
- same-room rematch가 authoritative lifecycle로 구현되어 room code와 active membership을 유지하고 이전 gameplay/private state만 초기화합니다.
- rematch 준비 화면도 동일한 No Thanks! page identity 안에 유지합니다.
- 각 플레이어 ready 상태와 방장의 시작 가능 조건을 명확히 표현합니다.
- 재대결하지 않는 플레이어는 방 나가기 action을 사용할 수 있어야 합니다.

## Responsive Strategy

- Desktop: 중앙 카드/칩 zone과 플레이어 패널을 동시에 읽는 것을 우선합니다.
- Tablet: 핵심 중앙 zone을 고정하고 플레이어 영역 밀도를 조정합니다.
- Mobile: 행동 버튼과 현재 카드가 첫 화면에서 우선 보이게 하고, 개인 카드가 많아질수록 overlap/scroll 전략을 사용합니다.
- 작은 높이 화면: 고정 패널 때문에 매 턴 상하 스크롤이 필요하지 않도록 최대 높이와 내부 overflow를 사용합니다.
- 많은 카드/토큰: 카드 overlap과 숫자 corner visibility로 수용합니다.
- touch / accessibility: hover 없이 모든 핵심 action을 사용할 수 있게 합니다.

## Implementation Plan

1. 대상 판본/공식 시각 자료와 자산 사용 가능 범위를 최종 확인합니다.
2. 게임 전체 background/page frame과 card/chip visual token을 확정합니다.
3. lobby/setup을 game-local Visual Identity로 통일합니다.
4. 중앙 card/chip zone과 플레이어 카드 overlap layout을 완성합니다.
5. card flip / chip travel / take-card sequencing을 authoritative state와 맞춥니다.
6. result/rematch 화면을 같은 디자인 언어로 연결합니다.
7. desktop/mobile에서 높이, overlap, interaction timing을 실제 멀티플레이로 검증합니다.

## Validation Checklist

- [ ] 목표 판본의 공식 디자인 자료와 palette를 최종 교차 확인했다.
- [ ] 직접 사용하는 자산의 권리 상태를 확인했다.
- [ ] 일반 청파 같이 페이지가 아니라 No Thanks! 전용 게임 공간으로 느껴진다.
- [ ] 카드가 많이 쌓여도 숫자를 식별할 수 있다.
- [ ] 칩 이동이 출발 → 이동 → 도착 → count 반영 순서로 이해된다.
- [ ] 카드 공개가 deck → 이동 → flip → 공개 완료 순서로 이해된다.
- [ ] lobby → gameplay → result/rematch가 하나의 Visual Identity를 유지한다.
- [ ] desktop/mobile에서 핵심 action과 정보가 한 화면 흐름으로 유지된다.
- [ ] DEVELOPMENT.md가 실제 UI 구현 진행상태를 추적한다.

## Open Questions / Deferred

- 특정 AMIGO 판본을 최종 visual baseline으로 고정할지, 원본의 기능적 특징만 재해석할지 최종 polish 전에 확정합니다.
- 공식 로고/제품 artwork는 명시적인 사용 근거가 확인되기 전까지 직접 사용하지 않습니다.
