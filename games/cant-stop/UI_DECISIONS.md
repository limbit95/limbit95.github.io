# Can't Stop UI Decisions

> 이 문서는 Can't Stop의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.
> `UI_DESIGN.md`는 규칙 체계 도입 시점의 Can't Stop v1 **adoption baseline**입니다. 이후 확정된 이 문서의 최신 non-superseded 결정이 같은 항목에서는 우선하며, 현재 유효 디자인은 baseline + decision overrides로 해석합니다. 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.
> 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.
>
> 이 문서 체계 도입 이전의 모든 UI 변경사를 소급해 꾸며내지 않습니다. 현재 release baseline은 `UI_DESIGN.md`와 main runtime을 기준으로 하며, 이후 의미 있는 디자인 결정부터 이 문서에 누적합니다.

## Current Design Track

- Status: FINAL
- Lifecycle stage: DESIGN_CLOSEOUT
- Current UI phase / scope: Rules Guide + full alpine expedition visual redesign 수동 리뷰 승인 완료
- Active branch: `experiment/cant-stop-full-visual-redesign-20260923`
- Last updated: 2026-09-23
- Adoption baseline: `UI_DESIGN.md` (v1 release state)
- Active overrides: CS-UI-001, CS-UI-002
- Next design work: main 병합 전 최종 CI/충돌 확인 외 없음.

## Decision Log

### 2026-09-23 — Alpine Rules Guide

- Decision ID: CS-UI-001
- Applies to: rules/help modal, Visual Identity, rules presentation, responsive dialog
- Supersedes: 없음
- Source: developer manual browser review + Game Platform Rules Guide Presentation experiment
- Context / trigger: v1 규칙 modal은 설산 계열 색상은 사용했지만 긴 텍스트 카드 중심이어서, 처음 플레이하는 사용자가 pairing, runner, push/stop, bust, win 같은 핵심 메커니즘을 게임 구성물과 연결해 이해하기 어려웠습니다.
- Previous / alternatives:
  - 기존 compact text-section modal 유지
  - No Thanks! 규칙 modal의 카드/칩 구조를 재사용
  - Can’t Stop 고유 구성물과 설산 메타포로 새로 설계
- Decision:
  - 규칙 modal을 `MOUNTAIN GUIDE · HOW TO PLAY` 콘셉트의 alpine play guide로 재구성합니다.
  - 기존 v1의 설산, 4개 주사위, runner, 2–12 mountain columns, push-your-luck 언어를 사용하고 다른 게임의 modal layout은 복제하지 않습니다.
  - 상단에 `ROLL → PAIR & CLIMB → PUSH OR STOP` 핵심 loop를 quick guide로 제공합니다.
  - 2–12 mountain 구조, 4 dice pairing 예시, runner 최대 3개, PUSH/STOP, BUST, 3-column win, server-authoritative adaptation을 각각 game-local visual example로 설명합니다.
  - 기존 상세 규칙 문장은 유지하여 visual example 없이도 semantic text만으로 전체 규칙을 이해할 수 있게 합니다.
  - 공식 artwork/logo는 직접 사용하지 않고 기존 자체 dice/runner/alpine presentation으로 재구성합니다.
  - desktop/mobile에서 같은 정보 순서를 유지하고 작은 화면에서는 visual example을 본문 아래로 재배치합니다.
- Rationale: 규칙 안내를 일반 도움말이 아니라 실제 gameplay presentation의 일부로 만들면서도 규칙 정확성, 접근성, 저작권 경계를 유지합니다.
- Affected surfaces: rules modal header, quick loop, rule sections, dice/runner/mountain visual examples, source footer, mobile dialog
- Implementation status: IMPLEMENTED
- Validation: 2026-09-23 사용자 실제 화면 리뷰에서 “거의 손 안대도 될 정도의 퀄리티”로 승인. Game Platform governance run #493 성공.
- Baseline relation: `UI_DESIGN.md` adoption baseline의 game-local rules modal 방향을 구체화하고 기존 text-heavy presentation을 대체합니다.
- Related functional boundary: 규칙 사실과 필수 설명 내용은 `GAME_SPEC.md`를 유지하며 runtime rules/DB/RPC/state authority는 변경하지 않습니다.

### 2026-09-23 — Full Alpine Expedition Presentation

- Decision ID: CS-UI-002
- Applies to: entry, lobby, shell/header, player roster, gameplay board, dice/route station, phase feedback, result/rematch, responsive presentation
- Supersedes: v1 release baseline의 전반적인 generic/light shell presentation과 개별 polish 중심 시각 체계
- Source: developer manual browser review + Game Platform full-design-rule experiment
- Context / trigger: CS-UI-001 규칙 모달이 기존 gameplay보다 더 강한 Can’t Stop 고유 정체성을 보여 주면서, 공통 디자인 규칙이 한 modal을 넘어 게임 전체에도 일관되게 적용되는지 검증할 필요가 생겼습니다.
- Previous / alternatives:
  - v1 보드/사이드바/헤더 구조를 유지하고 색상·spacing만 미세 조정
  - rules modal의 스타일을 일부 gameplay card에만 제한적으로 확장
  - 기능 구조를 유지한 채 Entry → Lobby → Gameplay → Result 전체 presentation을 하나의 alpine expedition 언어로 재구성
- Decision:
  - Can’t Stop 전체 화면을 **alpine expedition** 경험으로 통일합니다.
  - Entry는 trailhead / expedition briefing, Lobby는 `BASE CAMP`, gameplay는 mountain board + route station, GAME_OVER는 summit/winner presentation으로 이어지는 하나의 공간 언어를 사용합니다.
  - 공식/신뢰 가능한 제품 자료에서 확인한 4개의 red dice, 3개의 white runner, 2–12 mountain-column 구조를 참고하되 공식 artwork/logo는 직접 복제하지 않습니다.
  - gameplay dice는 red physical component로 강조하고, active runner는 white expedition marker + player accent로 재해석합니다.
  - 2–12 column은 독립 원형 cell의 나열보다 rope/trail 축을 따라 정상으로 오르는 구조로 보이게 합니다.
  - shell/header, roster, utility controls는 deep alpine blue expedition frame으로 통일하고 summit/winner/checkpoint는 gold accent를 제한적으로 사용합니다.
  - pairing/route selection은 밝은 route-map surface로 분리해 행동 선택과 보드 상태를 시각적으로 구분합니다.
  - `ROLL`, `PAIRING_SELECTION`, `PUSH_OR_STOP`, `GAME_OVER` 상태에 presentation class를 부여해 같은 기능 구조 안에서 현재 단계가 자연스럽게 읽히게 합니다.
  - 기존 authoritative gameplay, RPC, DB, randomness, turn lifecycle, reconnect, rematch 구조는 변경하지 않습니다.
  - desktop/tablet/mobile에서 같은 design language를 유지하되 좁은 화면에서는 정보 밀도와 열 배치를 조절합니다.
- Rationale: 기존 Can’t Stop은 기능적으로 완성되어 있었지만 UI 규칙 도입 전에 개발되어 각 요소가 개별 기능을 설명하는 방식으로 성장했습니다. 전체 presentation을 하나의 원정 메타포로 묶으면 규칙 모달에서 발견한 game-local identity를 실제 플레이 전 과정으로 확장하면서도 기존 안정적인 기능 구조를 그대로 보존할 수 있습니다.
- Affected surfaces: page background, Common Game Shell overrides, entry cards, basecamp lobby, player roster, board frame, columns, markers, dice station, route panel, gameplay tools, bust feedback, game-over/rematch, responsive layout
- Implementation status: IMPLEMENTED
- Validation: 2026-09-23 사용자 실제 화면 리뷰에서 “미쳤어 완전 마음에 들어”라고 명시적으로 승인. Game Platform governance run #494 성공.
- Baseline relation: `UI_DESIGN.md` v1 adoption baseline의 기능적 구조와 핵심 구성물은 유지하고, 전반적인 presentation hierarchy와 visual language를 대체합니다.
- Related functional boundary: `GAME_SPEC.md`의 rules, authoritative state, dice/pairing/runner/claim/win 의미는 변경하지 않습니다.

## Superseded / Rejected

- v1의 text-heavy rules modal presentation은 CS-UI-001에 의해 superseded.
- v1의 generic/light shell 중심 전반 presentation은 CS-UI-002에 의해 superseded. 기능 구조와 server-authoritative gameplay는 유지합니다.
- No Thanks!의 rules modal/layout을 Can’t Stop에 재사용하는 방향은 game-local identity 원칙에 따라 채택하지 않았습니다.
- 과거 UI 변경사는 이 문서 도입만으로 소급 재구성하지 않습니다.

## Validation History

- 2026-09-23 — UI_DECISIONS 체계 도입 당시 v1 release baseline만 기록.
- 2026-09-23 — CS-UI-001 alpine rules guide: desktop 실제 화면 수동 리뷰 승인.
- 2026-09-23 — Game Platform governance run #493: JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard 모두 success.
- 2026-09-23 — CS-UI-002 full alpine expedition redesign: Entry/Lobby/Gameplay/GAME_OVER 실제 화면 수동 리뷰 승인.
- 2026-09-23 — Game Platform governance run #494: JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard 모두 success.

## Open Follow-up

- 전체 디자인 실험 결과 공통 디자인 규칙이 rules modal뿐 아니라 Entry/Lobby/Gameplay/Result에서도 game-local identity를 유지하며 작동하는 것을 확인했습니다.
- 후속 수정이 확정되면 `UI_DESIGN.md` baseline을 덮어쓰지 말고 Decision Log에 추가합니다.
