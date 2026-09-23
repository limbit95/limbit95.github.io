# No Thanks! UI Decisions

> 이 문서는 No Thanks!의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.
> `UI_DESIGN.md`는 UI_DECISIONS 체계 도입 시점의 No Thanks! **adoption baseline**입니다. 개발 시작 후 확정된 이 문서의 최신 non-superseded 결정이 같은 항목에서는 우선하며, 현재 유효 디자인은 baseline + decision overrides로 해석합니다. 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.
> 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.
>
> 이 문서 체계 도입 전 No Thanks!는 여러 UI 수정과 일부 미병합/종료 PR을 거쳤으므로 과거 세부 결정이 완전하게 보존되어 있지 않습니다. 이 baseline에서 누락된 과거 결정을 임의로 복원하지 않으며, 별도 복원 작업에서 실제 main·과거 PR/commit·사용자 결정과 대조해 추가합니다.

## Current Design Track

- Status: PAUSED
- Lifecycle stage: MANUAL_DESIGN_REVIEW (PAUSED)
- Current UI phase / scope: room header + environmental identity + game-over experience manual review 완료, Phase E 후보는 후속 작업으로 유지
- Active branch: main (PR #378 병합 후 handoff baseline)
- Last updated: 2026-09-23
- Adoption baseline: `UI_DESIGN.md` (UI_DECISIONS 체계 도입 전 작업 상태 포함)
- Active overrides:
  - NT-UI-001 — muted blue game-local environmental background
  - NT-UI-002 — compact LIVE ROOM header identity
  - NT-UI-003 — first-place celebration overlay
  - NT-UI-004 — FINAL TABLE result plates
- Next design work: 이후 UI 작업은 adoption baseline과 아래 최신 decision을 함께 읽고 시작합니다. Phase E 후보인 다른 플레이어 공개 획득 카드 popover 및 추가 polish는 별도 후속 scope로 진행합니다.

## Decision Log

### NT-UI-001 — No Thanks! page environmental identity

- Status: ACTIVE
- Applies to: No Thanks! room / gameplay / result page world
- Source: 2026-09-23 developer manual browser review
- Context / trigger: 기존 흰 페이지 배경이 게임별 개성을 충분히 전달하지 못했습니다.
- Decision:
  - 페이지 전체를 muted navy / blue-gray 계열 game-local background로 구성합니다.
  - 중앙 gameplay surface는 밝게 유지하고, 장식은 가장자리 위주로 배치합니다.
  - oversized number-card ghost motif와 현재 gameplay의 red tactile chip visual language를 배경 accent로 사용합니다.
  - 공식 제품 artwork를 직접 배경 자산으로 사용하지 않고 CSS 기반 카드/칩 모티프로 재해석합니다.
  - mobile에서는 장식 밀도를 줄입니다.
- Rationale: 장시간 플레이 가독성을 해치지 않으면서 No Thanks!에 진입했다는 즉각적인 환경 정체성을 제공합니다.
- Implementation status: IMPLEMENTED
- Validation: 2026-09-23 manual browser review에서 배경 색상과 장식 방향 승인. PR #378 automated governance 통과.
- Baseline relation: adoption baseline의 page-frame/environment 항목을 구체화한 후속 override.
- Functional boundary: gameplay state / rules / RPC / DB authority 변경 없음.

### NT-UI-002 — Room header identity and connection-state cleanup

- Status: ACTIVE
- Applies to: in-room Game Shell header
- Source: 2026-09-23 developer manual browser review
- Context / trigger: 방 코드/상태 표현이 중복되고 게임 설명이 약하게 보였습니다.
- Decision:
  - 설명 문구는 `칩으로 버틸지, 카드와 칩을 가져갈지—한 번의 선택이 흐름을 바꾸는 심리전 카드 게임`으로 사용합니다.
  - 우측 room label은 `LIVE ROOM`으로 표시하고 실제 room code 중복 노출을 제거합니다.
  - 정상 연결된 in-room 상태의 `방 상태 최신` 성공 카드는 숨깁니다.
  - offline / reconnecting / error 등 recovery-critical connection state는 계속 표시합니다.
- Rationale: 헤더를 상태 정보 묶음이 아니라 게임 진입부/정체성 영역으로 정리하면서 중요한 복구 정보는 보존합니다.
- Implementation status: IMPLEMENTED
- Validation: 2026-09-23 manual browser review를 거쳐 후속 결과 화면 작업까지 유지됨. PR #378 automated governance 통과.
- Baseline relation: post-baseline manual review override.
- Functional boundary: connection semantics 자체는 변경하지 않고 정상 success presentation만 숨김.

### NT-UI-003 — First-place celebration overlay

- Status: ACTIVE
- Applies to: natural game completion (`LAST_CARD_TAKEN`) immediately before result review
- Source: 2026-09-23 developer manual browser review
- Context / trigger: 게임 종료 직후 결과표만 표시되어 승리 순간의 재미와 보상이 약했습니다.
- Decision:
  - 자연 종료 시 1등을 알리는 centered modal을 먼저 표시합니다.
  - browser-wide confetti, floating No Thanks! number cards, red tactile chip motion으로 축하 연출을 제공합니다.
  - 공동 1등을 지원합니다.
  - modal을 닫으면 FINAL TABLE 결과 화면을 확인합니다.
  - host 강제 종료에는 승자 celebration을 표시하지 않습니다.
  - 동일 결과는 결과 version 기반 key를 `sessionStorage`에 기록하여 focus/page lifecycle 재렌더에서도 반복 재생하지 않습니다.
  - `prefers-reduced-motion`에서는 full-screen FX를 제거합니다.
- Rationale: 결과 진입을 단순 데이터 표시가 아니라 게임의 명확한 종료 이벤트로 만들되 반복 애니메이션과 접근성 문제를 방지합니다.
- Implementation status: IMPLEMENTED
- Validation: focus/minimize 복귀 재렌더 이슈에 대한 상태 보강 포함. PR #378 automated governance 통과.
- Baseline relation: post-baseline game-over experience override.
- Functional boundary: 승자 판정은 기존 server-authoritative final result를 사용하며 새로운 승자 계산 권한을 UI에 두지 않음.

### NT-UI-004 — FINAL TABLE result plates

- Status: ACTIVE
- Applies to: GAME_OVER result presentation
- Source: 2026-09-23 developer manual browser review
- Context / trigger: 기존의 순위/칩/획득 카드를 표 형태로 분할한 결과 화면은 게임 결과의 재미와 시각적 보상이 부족했습니다.
- Previous / rejected direction:
  - 단일 가로 카드 내부를 `플레이어 정보 | 보유 칩 | 획득 카드` 3영역으로 나누는 구조는 폐기합니다.
- Decision:
  - 결과 화면은 `FINAL TABLE` 콘셉트로 구성합니다.
  - 1등은 상단 전체 폭의 winner plate로 강조합니다.
  - 나머지 플레이어는 아래 2열 result plate grid로 배치하고, 좁은 viewport에서는 1열로 전환합니다.
  - 각 plate는 상단 masthead(rank medal / player / final score card)와 하단 playmat(chip tray / acquired-card rack)로 구성합니다.
  - 1등 rank/score/card/chip presentation을 한 단계 더 크게 표현합니다.
  - 2등/3등 rank medal은 silver/bronze hierarchy를 사용합니다.
  - 획득 카드는 gameplay 개인 패널의 `createHandCard()` UI/hover/focus UX를 재사용합니다.
  - 카드 개수별 overlap은 단계적으로 조절하고, 연속 숫자 run 내부는 함께 겹치며 새 run 시작점에는 별도 간격을 둡니다.
  - 최종 보유 칩은 gameplay의 tactile chip visual language를 재사용합니다.
- Rationale: 결과를 관리용 표가 아니라 보드게임의 최종 테이블처럼 보여 주어 순위, 점수, 구성물과 플레이 결과를 하나의 게임적 장면으로 읽게 합니다.
- Implementation status: IMPLEMENTED
- Validation: 2026-09-23 developer manual browser review에서 최종 결과 레이아웃을 명시적으로 승인하고 main 병합을 요청함. PR #378 automated governance 통과.
- Baseline relation: adoption baseline 이후 game-over/result layout의 최종 manual-review override.
- Functional boundary:
  - 최종 score/winner는 기존 server result를 사용합니다.
  - 다른 플레이어의 gameplay private counter state는 공개하지 않습니다.
  - GAME_OVER chip count는 공개 acquired cards의 card score와 server final score의 관계로 계산하여 결과 화면에서만 표시합니다.

## Superseded / Rejected

- 결과 화면의 이전 `순위 목록 + 별도 획득 카드 목록` 구조는 NT-UI-004에 의해 superseded.
- 결과 플레이어 카드를 `플레이어 정보 | 최종 보유 칩 | 획득 카드` 3분할 행으로 표현하던 manual-review 중간안은 NT-UI-004에 의해 superseded.
- 과거의 별도 redesign 제안이나 종료된 PR에 남아 있는 디자인안은 그 자체로 현재 기준이 아닙니다. 복원할 때는 현재 main과 `UI_DESIGN.md`, 실제 사용자 결정과 대조해 살아 있는 결정만 구분합니다.

## Validation History

- 2026-09-23 — UI_DECISIONS 문서 체계 도입.
- 2026-09-23 — PR #378 room header / environmental identity / winner celebration / FINAL TABLE result design automated governance 반복 검증.
- 2026-09-23 — FINAL TABLE 결과 디자인에 대해 developer manual browser review 완료 및 main 병합 승인.

## Open Follow-up

- Phase E 후보인 다른 플레이어 공개 획득 카드 popover와 후속 polish는 UI 트랙 재개 시 별도 scope로 진행합니다.
- 과거 No Thanks! 관련 PR/commit의 pre-UI_DECISIONS 디자인 결정을 복원할 필요가 생기면 실제 main·과거 증거·현재 active decision을 함께 대조하고 폐기된 안을 되살리지 않습니다.
