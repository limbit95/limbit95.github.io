# Can't Stop UI Decisions

> 이 문서는 Can't Stop의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.
> `UI_DESIGN.md`는 규칙 체계 도입 시점의 Can't Stop v1 **adoption baseline**입니다. 이후 확정된 이 문서의 최신 non-superseded 결정이 같은 항목에서는 우선하며, 현재 유효 디자인은 baseline + decision overrides로 해석합니다. 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.
> 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.
>
> 이 문서 체계 도입 이전의 모든 UI 변경사를 소급해 꾸며내지 않습니다. 현재 release baseline은 `UI_DESIGN.md`와 main runtime을 기준으로 하며, 이후 의미 있는 디자인 결정부터 이 문서에 누적합니다.

## Current Design Track

- Status: RELEASED
- Lifecycle stage: RELEASED
- Current UI phase / scope: post-release Rules Guide redesign 승인 완료
- Active branch: main (PR #382 병합 후 handoff baseline)
- Last updated: 2026-09-23
- Adoption baseline: `UI_DESIGN.md` (v1 release state)
- Active overrides: CS-UI-001
- Next design work: 전체 gameplay presentation 재구성은 별도 실험 PR #383에서 검증합니다.

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

## Superseded / Rejected

- v1의 text-heavy rules modal presentation은 CS-UI-001에 의해 superseded.
- No Thanks!의 rules modal layout을 Can’t Stop에 재사용하는 방향은 game-local identity 원칙에 따라 채택하지 않았습니다.
- 과거 UI 변경사는 이 문서 도입만으로 소급 재구성하지 않습니다.

## Validation History

- 2026-09-23 — UI_DECISIONS 체계 도입 당시 v1 release baseline만 기록.
- 2026-09-23 — CS-UI-001 alpine rules guide: desktop 실제 화면 수동 리뷰 승인.
- 2026-09-23 — Game Platform governance run #493: JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard 모두 success.

## Open Follow-up

- PR #383에서 동일 공통 디자인 규칙이 Entry/Lobby/Gameplay/Result 전체에도 일관되게 작동하는지 별도 실험합니다.
- 후속 수정이 확정되면 `UI_DESIGN.md` baseline을 덮어쓰지 말고 Decision Log에 추가합니다.
