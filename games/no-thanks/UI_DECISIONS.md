# No Thanks! UI Decisions

> 이 문서는 No Thanks!의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.
> `UI_DESIGN.md`는 UI_DECISIONS 체계 도입 시점의 No Thanks! **adoption baseline**입니다. 개발 시작 후 확정된 이 문서의 최신 non-superseded 결정이 같은 항목에서는 우선하며, 현재 유효 디자인은 baseline + decision overrides로 해석합니다. 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.
> 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.
>
> 이 문서 체계 도입 전 No Thanks!는 여러 UI 수정과 일부 미병합/종료 PR을 거쳤으므로 과거 세부 결정이 완전하게 보존되어 있지 않습니다. 이 baseline에서 누락된 과거 결정을 임의로 복원하지 않으며, 별도 복원 작업에서 실제 main·과거 PR/commit·사용자 결정과 대조해 추가합니다.

## Current Design Track

- Status: FINAL
- Lifecycle stage: DESIGN_CLOSEOUT
- Current UI phase / scope: room/gameplay/result/rules presentation 수동 리뷰 및 closeout 완료
- Active branch: `main`
- Last updated: 2026-09-23
- Adoption baseline: `UI_DESIGN.md` (UI_DECISIONS 체계 도입 전 작업 상태 포함)
- Active overrides:
  - NT-UI-001 — muted blue game-local environmental background
  - NT-UI-002 — compact LIVE ROOM header identity
  - NT-UI-003 — first-place celebration overlay
  - NT-UI-004 — FINAL TABLE result plates
  - NT-UI-005 — quiet in-room reconnect presentation
  - NT-UI-006 — centered FINAL WINNER result card
  - NT-UI-007 — tabletop Rules Guide
- Main design baseline: PR #378 + PR #381, latest merge commit `c43f96f984b90049b59b163bffd16c9a5fb5cf04`
- Next design work: 없음. Phase E 후보인 다른 플레이어 공개 획득 카드 popover와 추가 polish는 release blocker가 아닌 post-closeout follow-up으로 유지합니다.

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

### NT-UI-005 — Quiet in-room reconnect presentation

- Status: ACTIVE
- Applies to: in-room Game Shell connection presentation
- Supersedes: NT-UI-002의 `reconnecting` 상태를 항상 recovery-critical card로 노출하던 부분
- Source: 2026-09-23 developer manual design review
- Context / trigger: 정상적인 짧은 재동기화에서도 `방 상태 동기화 중` 카드가 반복 노출되어 실제 gameplay보다 시스템 상태가 더 크게 느껴졌습니다.
- Decision:
  - in-room에서는 정상 success card뿐 아니라 `reconnecting` connection card도 숨깁니다.
  - 실제 사용자의 개입이 필요한 `offline` / `error` 상태는 계속 명확히 표시합니다.
  - authoritative snapshot refresh/reconnect 동작 자체는 변경하지 않습니다.
- Rationale: 자동 복구 가능한 일시적 동기화는 조용히 처리하고, 사용자가 대응해야 할 실패 상태만 시각적으로 승격합니다.
- Implementation status: IMPLEMENTED
- Validation: 최신 main 동기화 후 PR #381 Game Platform governance run #502에서 JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard 모두 성공했고 main 병합 완료.
- Baseline relation: NT-UI-002의 connection-state presentation 일부를 후속 override.
- Functional boundary: reconnect/snapshot/network semantics 변경 없음.

### NT-UI-006 — Centered FINAL WINNER result card

- Status: ACTIVE
- Applies to: natural GAME_OVER result hero
- Supersedes: 자연 종료 결과에서 승자 문구를 일반 왼쪽 정렬 heading으로만 표시하던 presentation
- Source: 2026-09-23 developer manual design review
- Context / trigger: FINAL TABLE 위의 승자 선언이 정보성 heading처럼 보여, 이미 강화된 winner celebration/result plate와 비교해 결과 진입의 중심점이 약했습니다.
- Decision:
  - 자연 종료 시 `FINAL WINNER` label과 `<winner> 승리!`를 중앙 정렬된 독립 winner card로 표시합니다.
  - card는 No Thanks!의 dark table surface, gold border/highlight, red tactile chip motif를 사용합니다.
  - host 수동 종료는 승자 선언이 아니므로 기존 정보형 heading을 유지합니다.
  - mobile에서도 winner card의 중심 hierarchy와 chip motif가 무너지지 않게 축소합니다.
- Rationale: 승자 선언 → FINAL TABLE이라는 결과 정보 순서를 명확히 만들고, game-over presentation을 카드/칩 언어 안에서 마무리합니다.
- Implementation status: IMPLEMENTED
- Validation: PR #381 shell regression test와 최신 main 동기화 후 Game Platform governance run #502가 성공했고 main 병합 완료.
- Baseline relation: NT-UI-003/004의 game-over experience를 연결하는 후속 presentation override.
- Functional boundary: winner/final score 계산은 기존 server-authoritative result를 그대로 사용합니다.

### NT-UI-007 — Tabletop Rules Guide

- Status: ACTIVE
- Applies to: rules/help modal, rules information hierarchy, responsive dialog
- Supersedes: generic text-list 중심의 기존 No Thanks! rules modal presentation
- Source: 2026-09-23 design implementation review + Game Platform Rules Guide Presentation experiment
- Context / trigger: 규칙 내용은 충분했지만 일반 문서형 modal에 가까워, No Thanks!의 핵심인 숫자 카드·칩·거절/가져오기 선택·연속 숫자 점수 계산이 실제 gameplay 구성물과 연결되어 보이지 않았습니다.
- Decision:
  - 규칙 modal을 일반 도움말이 아니라 **tabletop quick guide**로 재구성합니다.
  - header에 large number card와 red tactile chip motif를 사용하고 `HOW TO PLAY` hierarchy를 명확히 둡니다.
  - `GOAL` 영역에서 가장 낮은 최종 점수를 만드는 목표를 먼저 설명합니다.
  - 준비 규칙은 `3–35 / 33장 → 9장 비공개 제외 → 24장 실제 덱` 흐름으로 시각화합니다.
  - 턴의 핵심 선택은 `NO THANKS!`와 `TAKE` 두 game-local choice card로 설명합니다.
  - 연속 숫자 scoring은 실제 number-card visual과 equation을 함께 사용해 `연속 묶음에서는 가장 낮은 숫자만 계산`하는 규칙을 보여줍니다.
  - 종료/승리는 `LOWEST SCORE WINS` hierarchy로 마무리합니다.
  - 기존 규칙 의미를 유지하고 visual example 없이도 semantic text로 이해할 수 있게 합니다.
  - 공식 logo/product artwork를 직접 복제하지 않고 기존 CSS card/chip language로 재해석합니다.
  - 700px 이하에서는 setup/choice/scoring 구조를 세로로 재배치하고 modal 내부 scroll을 유지합니다.
- Rationale: 규칙 안내 자체를 No Thanks! gameplay presentation의 일부로 만들면서 처음 플레이하는 사용자가 핵심 선택과 점수 구조를 실제 구성물 언어로 더 빠르게 이해하게 합니다.
- Implementation status: IMPLEMENTED
- Validation: PR #381 rules-modal regression test와 최신 main 동기화 후 Game Platform governance run #502가 성공했고 main 병합 완료. 이후 동일 원칙을 Can’t Stop Rules Guide와 전체 redesign에 적용해 공통 UI 규칙으로 승격됨.
- Baseline relation: `UI_DESIGN.md`의 game-local modal 방향을 구체화하고 기존 generic rules presentation을 대체합니다.
- Functional boundary: 규칙 사실은 `GAME_SPEC.md`/authoritative gameplay를 따르며 DB/RPC/game state를 변경하지 않습니다.

## Superseded / Rejected

- 기존 generic text-list 중심 rules modal은 NT-UI-007에 의해 superseded.
- NT-UI-002에서 reconnecting 상태를 recovery card로 유지하던 부분은 NT-UI-005에 의해 superseded하며 offline/error 노출 원칙은 유지합니다.
- 자연 종료 결과의 일반 heading형 승자 선언은 NT-UI-006에 의해 superseded.
- 결과 화면의 이전 `순위 목록 + 별도 획득 카드 목록` 구조는 NT-UI-004에 의해 superseded.
- 결과 플레이어 카드를 `플레이어 정보 | 최종 보유 칩 | 획득 카드` 3분할 행으로 표현하던 manual-review 중간안은 NT-UI-004에 의해 superseded.
- 과거의 별도 redesign 제안이나 종료된 PR에 남아 있는 디자인안은 그 자체로 현재 기준이 아닙니다. 복원할 때는 현재 main과 `UI_DESIGN.md`, 실제 사용자 결정과 대조해 살아 있는 결정만 구분합니다.

## Validation History

- 2026-09-23 — UI_DECISIONS 문서 체계 도입.
- 2026-09-23 — PR #378 room header / environmental identity / winner celebration / FINAL TABLE result design automated governance 반복 검증.
- 2026-09-23 — FINAL TABLE 결과 디자인에 대해 developer manual browser review 완료 및 main 병합 승인.
- 2026-09-23 — PR #381 quiet reconnect / FINAL WINNER card / tabletop Rules Guide 구현 및 자동 회귀 검증 완료.
- 2026-09-23 — 최신 main 동기화 후 PR #381 Game Platform governance run #502 전체 성공.
- 2026-09-23 — PR #381 main 병합 완료. merge commit: `c43f96f984b90049b59b163bffd16c9a5fb5cf04`.
- 2026-09-23 — Tabletop Rules Guide에서 검증한 game-local rules presentation 원칙이 Can’t Stop 실험을 거쳐 Game Platform 공통 UI 규칙으로 승격됨.
- 2026-09-23 — 기능 체크포인트와 함께 디자인 closeout을 재검토해 NT-UI-001~007이 현재 main의 active design baseline임을 확인.

## Open Follow-up

- Phase E 후보인 다른 플레이어 공개 획득 카드 popover와 후속 polish는 release blocker가 아닌 별도 post-closeout scope로 진행합니다.
- 과거 No Thanks! 관련 PR/commit의 pre-UI_DECISIONS 디자인 결정을 복원할 필요가 생기면 실제 main·과거 증거·현재 active decision을 함께 대조하고 폐기된 안을 되살리지 않습니다.
