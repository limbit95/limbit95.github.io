# Game Platform Governance Guard

> **문서 분류:** CURRENT

이 문서는 신규 Game Platform 작업의 자동 검증 범위를 설명한다.

Governance Guard는 사이트 런타임 기능이 아니다. Pull Request 단계에서 신규 platform-native 게임과 `games/shared/` 변경이 현재 플랫폼 경계를 벗어나지 않는지 확인하는 개발용 안전장치다.

## 적용 범위

전용 workflow는 다음 경로가 변경된 Pull Request에서만 실행한다.

```text
games/**
tests/game-platform-*.test.js
tests/game-db-integration/**
scripts/check-game-platform-governance.mjs
docs/game-platform-*.md
AGENTS.md
.github/workflows/game-platform-governance.yml
```

활동, 커뮤니티, 회원가입, 알림, 관리자 등 일반 서비스 변경만 있는 PR에서는 이 workflow가 실행되지 않는다.

## 자동 차단하는 구조 위반

- `games/<game-id>/` 디렉터리에 `GAME_SPEC.md`가 없거나 필수 설계 섹션이 빠진 경우
- `docs/game-platform-ui-rules.md`가 존재하는 현재 체계에서 `games/<game-id>/UI_DESIGN.md`가 없거나 필수 UI 설계 섹션이 빠진 경우
- `games/<game-id>/` 디렉터리에 `DEVELOPMENT.md`가 없거나 필수 인수인계 섹션이 빠진 경우
- `DEVELOPMENT.md`가 `Status: RELEASED`인데 `Active branch: main`이 아니거나 `## Release` 기록이 없는 경우
- Registry 미등록 bootstrap 디렉터리에 `GAME_SPEC.md` / `UI_DESIGN.md` / `DEVELOPMENT.md` 외 runtime 파일이 추가된 경우
- runtime이 있는 `games/<game-id>/` 디렉터리가 shared Game Registry에 등록되지 않은 경우
- shared Game Registry에 등록했지만 실제 `games/<game-id>/` 디렉터리가 없는 경우
- online shared 게임인데 `tests/game-db-integration/<game-id>.test.js`가 없는 경우
- 새 platform-native runtime을 추가하면서 Registry를 같은 PR에서 갱신하지 않은 경우
- Legacy 런타임과 Game Platform 런타임을 같은 PR에서 함께 수정한 경우
- 새 `games/shared/*.js` 모듈을 추가하면서 Game Platform 계약 테스트 또는 관련 문서를 함께 갱신하지 않은 경우

## 자동으로 검증하지만 과도하게 강제하지 않는 것

기존 `games/shared/` 모듈 수정은 매번 새 테스트 파일이나 문서 변경을 강제하지 않는다. 대신 전용 workflow가 기존 `npm run test:game-platform` 전체를 실행해 회귀를 확인한다.

이 방식은 단순 버그 수정이나 내부 구현 개선까지 문서 변경을 강제해 개발 속도를 떨어뜨리는 것을 피하기 위한 것이다.

## 문서 권위 연결

`docs/game-platform-*.md`는 Governance Guard가 자동으로 발견하며 각 문서는 제목 아래에 `> **문서 분류:** CURRENT` 또는 `HISTORY`를 선언해야 한다.

- `CURRENT`: 현재 실행 규칙/공통 계약 문서다. Registry의 특정 platform-native 게임명이나 ID를 공통 규칙으로 포함할 수 없다.
- `HISTORY`: 과거 전략·분석·구현 이력을 보존하는 문서다. 특정 게임 이력을 기록할 수 있지만 현재 실행 기준으로 사용하지 않는다.
- 메인 규칙서 `docs/game-platform-development-rules.md`를 제외한 모든 `docs/game-platform-*.md`는 해당 규칙서를 현재 rulebook으로 명시해야 한다.
- 신규 UI rulebook `docs/game-platform-ui-rules.md`가 존재하면 `AGENTS.md`, 메인 개발 규칙, `games/README.md`, `games/GAME_SPEC_TEMPLATE.md`, `games/DEVELOPMENT_TEMPLATE.md`, `games/UI_DESIGN_TEMPLATE.md`가 해당 UI rulebook을 명시해야 한다.
- `AGENTS.md`와 `games/` 최상위 Markdown 가이드/템플릿은 별도 분류 표기 없이 `CURRENT`로 간주해 같은 game-agnostic 검사를 적용한다.

따라서 새 공통 UI 문서가 단독으로 고립되지 않고 신규 게임 개발 진입점과 세 설계/인수인계 문서 체계까지 연결된다. 새 `docs/game-platform-*.md` 추가 자체는 Governance 테스트의 파일 목록을 수동으로 수정할 필요가 없으며, 분류 누락·권위 연결 누락·특정 신규 게임 종속 규칙이 자동으로 차단된다.
## Legacy 경계

Governance Guard는 Liar Game, Drawing Spy, The Game, Marble을 새 플랫폼 규칙으로 마이그레이션하지 않는다.

다만 신규 Game Platform 런타임 변경과 Legacy 런타임 변경이 한 PR에 섞이는 경우에는 작업 범위를 분리하도록 차단한다.

## GitHub Actions 사용량

workflow는 `pull_request`에만 반응하고 Game Platform 관련 경로가 바뀐 경우에만 실행한다. 별도 `push` 실행이나 전체 사이트 workflow 복제는 하지 않는다.

검증은 Node 기본 기능과 기존 Game Platform 테스트만 사용하므로 별도 `npm ci` 단계도 추가하지 않는다.
## 게임 bootstrap 및 개발 기록 경계

Governance Guard는 각 platform-native 게임 디렉터리에 `GAME_SPEC.md`, `UI_DESIGN.md`, `DEVELOPMENT.md`가 존재하고 각 문서의 필수 섹션이 유지되는지 검사한다.

세 문서만 있는 새 디렉터리는 bootstrap 상태로 인정하며 Registry 등록을 요구하지 않는다. 반대로 runtime 파일이 하나라도 추가되면 bootstrap 상태가 끝난 것으로 보고 같은 저장소 상태에서 shared Game Registry 등록을 요구한다.

`UI_DESIGN.md` 검사는 디자인 조사, 자산 사용 경계, Visual Identity, page/lobby/gameplay/result-rematch, motion, responsive, 구현 계획, validation 섹션의 구조적 존재를 확인한다. 특정 색상이나 디자인의 미적 적합성을 CI가 판단하는 것은 아니며 그 의미적 검토는 `docs/game-platform-ui-rules.md`의 작업 절차와 실제 브라우저 검증이 담당한다.

Release 상태는 최소한의 기계적 정합성도 검사한다. `Status: RELEASED`인 게임은 production baseline이므로 `Active branch: main`이어야 하고 날짜가 포함된 `## Release` 섹션을 가져야 한다. 이는 실제 production migration 여부나 플레이 품질을 추론하는 검사가 아니라, 종료된 작업 브랜치가 현재 기준으로 남는 문서 오류를 막기 위한 guard다.

Guard는 규칙/디자인 출처의 신뢰도, 게임 규칙의 의미적 정확성, Visual Identity의 품질, 자산 사용 권리의 법적 판단, Phase 진행상황의 사실 여부까지 자동 판정하지 않는다. 또한 각 게임의 재대결 구현이 실제 멀티클라이언트에서 완전한지를 문서 구조만으로 추론하지 않는다. 해당 내용은 `docs/game-platform-development-rules.md`, `docs/game-platform-ui-rules.md`, 게임별 테스트와 실제 브라우저 검증으로 확인한다.
