# No Thanks! UI Decisions

> 이 문서는 No Thanks!의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.
> `UI_DESIGN.md`는 UI_DECISIONS 체계 도입 시점의 No Thanks! **adoption baseline**입니다. 개발 시작 후 확정된 이 문서의 최신 non-superseded 결정이 같은 항목에서는 우선하며, 현재 유효 디자인은 baseline + decision overrides로 해석합니다. 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.
> 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.
>
> 이 문서 체계 도입 전 No Thanks!는 여러 UI 수정과 일부 미병합/종료 PR을 거쳤으므로 과거 세부 결정이 완전하게 보존되어 있지 않습니다. 이 baseline에서 누락된 과거 결정을 임의로 복원하지 않으며, 별도 복원 작업에서 실제 main·과거 PR/commit·사용자 결정과 대조해 추가합니다.

## Current Design Track

- Status: IN_REVIEW
- Lifecycle stage: DEVELOPER_MANUAL_DESIGN_REVIEW
- Current UI phase / scope: room/gameplay/result/rules closeout + 2026-09-25 gameplay hand/motion/focus post-closeout polish
- Active branch: `fix/no-thanks-turn-and-card-flow-20260924`
- Last updated: 2026-09-25
- Adoption baseline: `UI_DESIGN.md` (UI_DECISIONS 체계 도입 전 작업 상태 포함)
- Active overrides:
  - NT-UI-001 — muted blue game-local environmental background
  - NT-UI-002 — compact LIVE ROOM header identity
  - NT-UI-003 — first-place celebration overlay
  - NT-UI-004 — FINAL TABLE result plates
  - NT-UI-005 — quiet in-room reconnect presentation
  - NT-UI-006 — centered FINAL WINNER result card
  - NT-UI-007 — tabletop Rules Guide
  - NT-UI-008 — Hard Boiled / Covert Affair soundtrack split
  - NT-UI-009 — staged tabletop game-start sequence
  - NT-UI-010 — authoritative transfer continuity at take/end boundaries
  - NT-UI-011 — maximum-hand responsive overlap
  - NT-UI-012 — tighter gameplay hand and ordered insertion slide
- Main design baseline: PR #394 merge commit `91d9ca42b6340888f6c9680bda2dcce604da6ed3` (prior active decisions + PR #393 BGM + #389/#390/#391 integration)
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

### NT-UI-008 — Hard Boiled / Covert Affair soundtrack split

- Status: ACTIVE
- Applies to: entry / waiting lobby / gameplay / result-rematch audio presentation
- Source: 2026-09-24 user soundtrack selection
- Context / trigger: No Thanks!의 카드·칩 심리전 분위기에 맞는 로비/플레이 전용 BGM을 확정했습니다.
- Decision:
  - lobby 계열 화면에는 Kevin MacLeod의 `Hard Boiled` (ISRC `USUAN1700076`)를 사용합니다.
  - 실제 `PLAYING` phase에는 Kevin MacLeod의 `Covert Affair` (ISRC `USUAN1100795`)를 사용합니다.
  - GAME_OVER / rematch 준비를 포함해 `PLAYING`이 아닌 상태는 lobby track으로 복귀합니다.
  - 기존 shared Game BGM controller/player를 재사용해 재생/일시정지, 볼륨, 출처/라이선스 UI와 브라우저 autoplay 대응을 유지합니다.
  - 두 곡의 Incompetech CC BY 4.0 attribution metadata를 shared BGM catalog에 등록합니다.
- Rationale: 대기 화면은 느긋한 재즈 카드룸 분위기를 유지하고, 실제 플레이에서는 더 은근한 긴장감을 주면서도 기존 Game Platform 오디오 UX를 그대로 유지합니다.
- Implementation status: IMPLEMENTED
- Validation: `tests/game-platform-no-thanks-bgm.test.js`에서 track metadata, lobby ↔ gameplay 전환, page wiring을 회귀 검증합니다.
- Baseline relation: `UI_DESIGN.md`의 sound 방향을 실제 사용자 확정 soundtrack으로 구체화한 post-closeout override.
- Functional boundary: gameplay state / RPC / DB authority / 카드·칩 규칙 변경 없음.

### NT-UI-009 — Staged tabletop game-start sequence

- Status: ACTIVE
- Applies to: WAITING → PLAYING 전환 직후의 opening presentation
- Source: 2026-09-24 iterative manual design review
- Context / trigger: 방장이 게임 시작을 눌렀을 때 board가 즉시 나타나 첫 카드가 공개되는 흐름은 준비된 카드·칩 게임을 시작한다는 몰입감이 약했고, 대기 화면과 플레이 화면의 deck/chip 위치가 바뀌면 순간이동처럼 보였습니다.
- Decision:
  - WAITING 원형 테이블에 실제 플레이와 동일한 좌표의 draw deck과 중앙 chip bank를 미리 배치합니다.
  - 중앙에는 compact `게임 준비 중 / 모두 준비되면 / 바로 시작합니다.` card를 사용하고 deck/center/chip 세 슬롯의 위치는 WAITING과 PLAYING에서 동일하게 유지합니다.
  - host start 후 goal message card와 `곧 게임이 시작됩니다.` message card를 각각 2.5초 노출합니다.
  - 두 번째 message card의 fade-out이 완전히 끝나면 추가 idle delay 없이 table setup motion을 시작합니다.
  - 중앙 chip bank의 배분과 deck shuffle은 동시에 시작하되 chip 배분이 먼저 끝나고 deck shuffle은 더 길게 이어집니다.
  - viewer에게 지급되는 시작 칩은 중앙 bank에서 빠져나와 개인 패널의 최종 chip-pile 슬롯에 하나씩 그대로 쌓입니다. 다른 플레이어 몫은 seat avatar로 이동하고 avatar에 닿는 마지막 구간에서만 작아지며 투명해져 흡수되는 인상을 줍니다.
  - source chip은 각 flight가 출발할 때 중앙 bank에서 함께 사라져 실제로 더미가 줄어드는 모습을 유지합니다.
  - draw deck은 새 카드가 날아와 쌓이는 방식이 아니라 이미 놓인 deck이 펼쳐진 뒤 **4번의 discrete mix beat**를 거치고 다시 한 덱으로 모입니다. 각 beat 사이에는 짧은 hold를 두되 개별 이동은 부드러운 easing을 사용합니다.
  - deck 정돈이 끝나는 즉시 기존 deck → current-card deal/flip animation으로 첫 카드를 공개합니다. 첫 카드 landing 전까지 TAKE/REFUSE는 잠급니다.
  - opening sequence는 실제 WAITING → PLAYING authoritative transition에서만 재생하고 reload/reconnect로 이미 PLAYING에 들어온 경우 재생하지 않습니다.
  - `prefers-reduced-motion`에서는 대규모 이동 motion을 생략하고 동일 authoritative state로 빠르게 수렴합니다.
- Rationale: game state를 바꾸지 않고도 카드와 칩이 실제 테이블에 준비되고 배분되는 물리적 흐름을 보여 주며, 대기→플레이 전환에서 위치 점프와 과도한 idle 시간을 제거합니다.
- Implementation status: IMPLEMENTED
- Validation: PR #391 반복 manual review 후 PR #394에 통합. PR #394 integration head에서 Game Platform governance #555와 Site static checks #3446 성공.
- Baseline relation: `UI_DESIGN.md`의 tabletop motion / cause→movement→authoritative result 원칙을 game-start 영역에 구체화한 post-closeout override.
- Functional boundary: room status/current card/chip count의 authority는 서버 snapshot이 소유하고 opening은 presentation layer에서만 conceal/reveal/flight를 수행합니다.

### NT-UI-010 — Authoritative transfer continuity at take/end boundaries

- Status: ACTIVE
- Applies to: TAKE_CARD, opponent take presentation, last-card transition, host manual termination
- Source: 2026-09-24 iterative manual design review
- Context / trigger: TAKE 시 실제 source component와 flight component가 동시에 보이거나, 마지막 카드 획득 뒤 테이블에 원본 카드가 남거나, 수동 게임 종료 직후 이미 예약된 deal animation이 재생되면 authoritative state와 시각 상태가 어긋나 보였습니다.
- Decision:
  - TAKE presentation은 source component가 이동을 시작하는 순간 원본 presentation을 숨기고 flight copy만 보이게 합니다.
  - viewer TAKE의 카드/칩은 실제 개인 패널의 최종 landing target으로 이동하며, opponent TAKE의 공개 획득 요소는 해당 player seat/avatar 방향으로 수렴합니다.
  - 마지막 카드 TAKE에서도 원형 테이블의 source card를 flight 시작과 함께 숨겨, 개인 패널로 이동하는 카드와 테이블 카드가 중복 노출되지 않게 합니다.
  - 마지막 카드가 landing한 뒤에는 3초간 game-local `게임 결과를 집계 중입니다` gate를 거쳐 FINAL TABLE로 전환합니다.
  - 방장이 진행 중 게임을 수동 종료하면 활성 deal presentation을 즉시 cancel하고 flight/receiving 상태를 정리하여 종료 이후 새 카드가 뒤집혀 이동하는 연출을 남기지 않습니다.
  - opponent seat로 흡수되는 시작/이동 칩은 flight 대부분 구간에서 선명도를 유지하고 avatar contact 직전 마지막 구간에서만 fade/scale down합니다.
- Rationale: 애니메이션이 authoritative snapshot과 다른 카드/칩을 주장하지 않도록 하고, 실제 구성물이 한 위치에서 다른 위치로 이동했다는 continuity를 유지합니다.
- Implementation status: IMPLEMENTED
- Validation: PR #390/#391 회귀 테스트를 PR #394에서 통합하고 Game Platform governance #555 통과.
- Baseline relation: Phase A–D TAKE/deal motion과 NT-UI-003/004의 game-over transition을 보강하는 post-closeout override.
- Functional boundary: TAKE legality, next card, final score, end reason은 기존 server-authoritative RPC/snapshot만 사용하며 presentation cancel/hide는 결과를 변경하지 않습니다.

### NT-UI-011 — Maximum-hand responsive overlap

- Status: ACTIVE
- Applies to: gameplay 개인 획득 카드 hand / GAME_OVER FINAL TABLE acquired-card rack
- Source: 2026-09-24 manual review of dense hands
- Context / trigger: 획득 카드가 많아질수록 개인 패널과 결과 카드 rack 바깥으로 카드가 밀려나고, 연속 숫자 run 사이의 고정 간격도 dense hand에서 지나치게 많은 폭을 사용했습니다.
- Decision:
  - 첫 버전 24장 draw deck을 기준으로 한 플레이어가 최대 24장을 보유할 수 있는 worst case까지 레이아웃에 포함합니다.
  - gameplay hand overlap은 보유 장수 구간에 따라 단계적으로 더 타이트해집니다.
  - FINAL TABLE은 기본 card-count overlap 단계뿐 아니라 실제 rack의 available width, card width, run-start count를 측정해 overlap과 run margin을 동적으로 다시 계산합니다.
  - 새 run 시작점의 간격도 카드 수/가용 폭이 부족하면 함께 축소하며, dense hand 때문에 horizontal overflow가 발생하지 않게 합니다.
  - 왼쪽 상단/오른쪽 하단 corner number와 기존 hover/focus UX는 유지하여 겹침이 커져도 카드 값을 읽을 수 있게 합니다.
- Rationale: 고정 폭을 늘려 화면 전체를 키우는 대신 카드 수에 따라 presentation 밀도를 조절하여 데스크톱/좁은 viewport 모두에서 최대 hand를 수용합니다.
- Implementation status: IMPLEMENTED
- Validation: PR #389의 measured result-rack 계산과 PR #391의 강화된 최대-hand overlap을 PR #394에서 통합. Game Platform governance #555 / Site static checks #3446 통과.
- Baseline relation: NT-UI-004 FINAL TABLE card rack과 `UI_DESIGN.md` 개인 패널 overlap 정책의 후속 override.
- Functional boundary: 카드 보유/정렬/점수 데이터는 변경하지 않고 DOM spacing만 계산합니다.

### NT-UI-012 — Tighter gameplay hand and ordered insertion slide

- Status: ACTIVE
- Applies to: gameplay 개인 획득 카드 hand / TAKE_CARD landing motion
- Supersedes: NT-UI-011의 gameplay hand density 수치와 TAKE 후 기존 카드가 단계적으로 재배치되던 presentation
- Source: 2026-09-25 developer manual browser review
- Context / trigger: 개인 hand는 카드 수가 늘어날수록 더 타이트하게 겹쳐도 hover/focus로 값을 확인할 수 있고, 새 카드를 오름차순 위치에 바로 넣을 때 기존 카드가 순간적으로 자리만 바꾸면 실제 카드 사이에 공간을 만드는 감각이 약했습니다.
- Decision:
  - gameplay hand는 적은 카드부터 과도하게 겹치지 않습니다. 카드 장수별 fallback overlap을 1장 단위로 세분화하되, 실제 화면에서는 개인 패널의 사용 가능한 폭과 카드 폭을 측정해 **오른쪽 여백이 남아 있으면 펼친 상태를 우선**합니다.
  - 펼친 카드가 실제 가용 폭을 넘기기 시작할 때만 약 5px 단위로 overlap level을 한 단계씩 높이고, 카드가 더 늘어나거나 viewport가 좁아질수록 필요한 만큼만 추가 압축합니다.
  - 같은 연속 숫자 run 내부는 이 adaptive overlap을 사용하고, 새 run 시작점은 일반 카드 간격보다 최대 약 28px 더 넓게 유지해 연속 묶음 경계를 한눈에 구분할 수 있게 합니다.
  - run 경계 공간까지 포함해 폭이 부족해질 때에는 run 간격도 함께 점진적으로 줄이되 항상 같은 run 내부보다 넓게 유지합니다.
  - 이 adaptive spacing은 gameplay 개인 패널에만 적용하며 FINAL TABLE의 measured result-rack 계산은 그대로 유지합니다.
  - TAKE 성공 시 새 카드는 처음부터 최종 오름차순 slot을 landing target으로 사용합니다.
  - 기존 보유 카드는 authoritative rerender 전 좌표와 최종 정렬 좌표의 차이를 기준으로 약 420ms FLIP-style slide를 적용해 새 카드가 들어올 공간을 부드럽게 만듭니다.
  - 마지막 카드 TAKE도 동일한 정렬/slide 원칙을 사용합니다.
  - `prefers-reduced-motion`에서는 기존 카드 slide를 생략하고 최종 정렬 상태로 즉시 수렴합니다.
- Rationale: 개인 패널 높이와 폭을 늘리지 않고 카드 밀도를 높이면서도, 정렬 변경을 순간적인 점프가 아니라 실제 카드를 옆으로 밀어 자리를 만드는 동작으로 읽히게 합니다.
- Implementation status: IMPLEMENTED
- Validation: PR #396 후속 작업에서 Game Platform governance 및 developer manual browser review 예정.
- Baseline relation: NT-UI-011의 dense-hand 원칙을 유지하되 gameplay hand의 구체 밀도와 TAKE insertion motion을 후속 override합니다. FINAL TABLE의 measured result-rack 계산은 변경하지 않습니다.
- Functional boundary: 카드 보유 순서/점수/RPC authority는 변경하지 않고 presentation geometry와 motion만 조정합니다.

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
- 2026-09-24 — user-selected No Thanks! soundtrack을 NT-UI-008로 확정하고 shared BGM 패턴으로 구현.
- 2026-09-24 — PR #390/#391의 final-take 및 game-start presentation을 반복 manual review로 다듬고 NT-UI-009~010의 안정된 motion/transition 원칙으로 확정.
- 2026-09-24 — dense hand overflow 수정과 PR #389 measured result-rack 계산을 통합해 NT-UI-011로 확정.
- 2026-09-24 — 통합 PR #394를 최신 main 대비 `behind 0 / mergeable` 상태와 Governance/Site/DB 통과를 확인한 뒤 main에 병합. merge commit: `91d9ca42b6340888f6c9680bda2dcce604da6ed3`.
- 2026-09-24 — post-#394 디자인 체크포인트에서 NT-UI-001~011을 현재 active design baseline으로 재확인.
- 2026-09-25 — PR #396 follow-up manual review에서 gameplay hand density와 sorted insertion slide를 NT-UI-012로 확정하고, opening goal copy의 명시적 2줄 배치와 focus/visibility deal replay 방지를 함께 구현.

## Open Follow-up

- Phase E 후보인 다른 플레이어 공개 획득 카드 popover와 후속 polish는 release blocker가 아닌 별도 post-closeout scope로 진행합니다.
- 과거 No Thanks! 관련 PR/commit의 pre-UI_DECISIONS 디자인 결정을 복원할 필요가 생기면 실제 main·과거 증거·현재 active decision을 함께 대조하고 폐기된 안을 되살리지 않습니다.
