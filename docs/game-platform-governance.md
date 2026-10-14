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
scripts/check-game-platform-vnext-boundaries.mjs
scripts/check-community-modules.mjs
scripts/build-community-assets.mjs
services/game-platform-vnext/**
tests/game-platform-vnext-model-oracles.json
js/** / liar-game/** / the-game/** / marble-game/** / assets/**
index.html / index.template.html / .nojekyll / _config.yml / package.json
docs/game-platform-*.md
AGENTS.md
.github/workflows/game-platform-governance.yml
```

활동, 커뮤니티, 회원가입, 알림, 관리자 등 일반 서비스 변경만 있는 PR에서는 이 workflow가 실행되지 않는다.

## 자동 차단하는 구조 위반

- `games/<game-id>/` 디렉터리에 `GAME_SPEC.md`가 없거나 필수 설계 섹션이 빠진 경우
- `docs/game-platform-ui-rules.md`가 존재하는 현재 체계에서 `games/<game-id>/UI_DESIGN.md`가 없거나 필수 UI 설계 섹션이 빠진 경우
- `games/<game-id>/` 디렉터리에 `DEVELOPMENT.md`가 없거나 필수 기능 인수인계 섹션이 빠진 경우
- `games/<game-id>/` 디렉터리에 `UI_DECISIONS.md`가 없거나 필수 디자인 이력 섹션이 빠진 경우
- `DEVELOPMENT.md`가 `Status: RELEASED`인데 `Active branch: main`이 아니거나 `## Release` 기록이 없는 경우
- Registry 미등록 bootstrap 디렉터리에 `GAME_SPEC.md` / `DEVELOPMENT.md` / `UI_DESIGN.md` / `UI_DECISIONS.md` 외 runtime 파일이 추가된 경우
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
- 신규 UI rulebook `docs/game-platform-ui-rules.md`가 존재하면 `AGENTS.md`, 메인 개발 규칙, `games/README.md`, `games/GAME_SPEC_TEMPLATE.md`, `games/DEVELOPMENT_TEMPLATE.md`, `games/UI_DESIGN_TEMPLATE.md`, `games/UI_DECISIONS_TEMPLATE.md`가 해당 UI rulebook을 명시해야 한다.
- `AGENTS.md`와 `games/` 최상위 Markdown 가이드/템플릿은 별도 분류 표기 없이 `CURRENT`로 간주해 같은 game-agnostic 검사를 적용한다.

따라서 새 공통 UI 문서가 단독으로 고립되지 않고 신규 게임 개발 진입점과 네 game-local 문서 체계까지 연결된다. 새 `docs/game-platform-*.md` 추가 자체는 Governance 테스트의 파일 목록을 수동으로 수정할 필요가 없으며, 분류 누락·권위 연결 누락·특정 신규 게임 종속 규칙이 자동으로 차단된다.

## 공통 규칙 변경 전파 원칙

Game Platform 규칙을 보완할 때는 문서 계층의 높이만 보고 무조건 최상위부터 또는 최하위부터 고치지 않는다. 먼저 **이번 변경의 세부 의미를 소유하는 topic-owner 문서**를 식별한다.

기본 절차는 다음과 같다.

1. 변경 전 현재 최상위 규칙과 shared/runtime 경계를 확인해 제안이 기존 플랫폼 구조와 충돌하지 않는지 먼저 감사한다.
2. 충돌이 없다면 가장 구체적인 세부 의미는 topic-owner 문서에서 먼저 정의한다.
   - 예: UI lifecycle·디자인 기록 방식은 `docs/game-platform-ui-rules.md`
   - 기능 개발 lifecycle·기능 checkpoint는 `docs/game-platform-development-rules.md`
   - 자동 검증 범위와 문서 연결 강제는 이 Governance 문서와 Guard 소스
3. topic-owner의 의미가 확정된 뒤 `docs/game-platform-development-rules.md`, `AGENTS.md`, `games/README.md` 같은 상위/진입 문서에는 필요한 요약과 참조만 전파한다.
4. 같은 세부 규칙을 여러 상위 문서에서 독립적으로 다시 정의하지 않는다. 상위 문서는 책임 문서를 가리키고 핵심 invariant만 반복한다.
5. 상위 규칙과 충돌하는 하위 필요는 **발견/토의 단계에서는 제안으로만 유지**하고, 승격 없이 하위 문서나 runtime을 상위 규칙 밖으로 먼저 수정하지 않는다. 사용자/maintainer와의 토의에서 플랫폼 전반에 필요한 변경으로 명시적으로 합의되면 Development Rules의 **ARCHITECTURE CHANGE**로 승격한다.
6. ARCHITECTURE CHANGE로 승격된 뒤에는 topic-owner와 상위 규칙을 같은 작업 범위에서 함께 정합화하고, 현재 platform-native 게임 영향도 감사를 수행한 뒤 runtime/shared 변경으로 진행한다.
7. 전파가 끝나면 Governance/contract 테스트와 현재 platform-native 게임의 `COMPLIANT` / `MIGRATION_REQUIRED` / `NOT_APPLICABLE` 영향을 확인한다.

이 방식은 **세부 결정은 한 곳에서 소유하고 상위 문서는 그 결정을 참조하는 구조**를 유지해 규칙 중복과 drift를 줄인다. 따라서 topic-owner → 상위 참조 문서 → Governance/테스트 순서의 전파는 기존 Game Platform 구조를 훼손하는 방식이 아니라, 오히려 문서 권위와 책임 경계를 유지하기 위한 기본 변경 방식으로 사용한다.

## Legacy 경계

Governance Guard는 Liar Game, Drawing Spy, The Game, Marble을 새 플랫폼 규칙으로 마이그레이션하지 않는다.

다만 신규 Game Platform 런타임 변경과 Legacy 런타임 변경이 한 PR에 섞이는 경우에는 작업 범위를 분리하도록 차단한다.

## GitHub Actions 사용량

workflow는 `pull_request`에만 반응하고 Game Platform 관련 경로가 바뀐 경우에만 실행한다. 별도 `push` 실행이나 전체 사이트 workflow 복제는 하지 않는다.

검증은 Node 기본 기능과 기존 Game Platform 테스트만 사용하므로 별도 `npm ci` 단계도 추가하지 않는다.
## 게임 bootstrap 및 개발 기록 경계

Governance Guard는 각 platform-native 게임 디렉터리에 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`가 존재하고 각 문서의 필수 섹션이 유지되는지 검사한다.

또한 기능/디자인 checkpoint 명령이 상위 진입 문서마다 달라지는 것을 막기 위해 명령 표기를 구조적으로 검사한다.

- `기능 체크포인트 기록하자`: `docs/game-platform-development-rules.md`, `AGENTS.md`, `games/README.md`가 공통으로 식별해야 한다.
- `디자인 체크포인트 기록하자`: `docs/game-platform-ui-rules.md`, `docs/game-platform-development-rules.md`, `AGENTS.md`, `games/README.md`가 공통으로 식별해야 한다.

기능 checkpoint의 상세 절차는 Development Rules가, 디자인 checkpoint의 상세 절차는 UI Rules가 소유한다. 상위 진입 문서는 두 명령을 재정의하지 않고 책임 문서로 연결한다. Phase 완료, 디자인 lifecycle 기록 트리거, release closeout 등 lifecycle 기반 문서 갱신 규칙은 사용자 checkpoint 명령과 독립적으로 유지한다.

네 문서만 있는 새 디렉터리는 bootstrap 상태로 인정하며 Registry 등록을 요구하지 않는다. 반대로 runtime 파일이 하나라도 추가되면 bootstrap 상태가 끝난 것으로 보고 같은 저장소 상태에서 shared Game Registry 등록을 요구한다.

`UI_DESIGN.md` 검사는 디자인 조사, 자산 사용 경계, Visual Identity, page/lobby/gameplay/result/rematch, motion, responsive, 구현 가이드, validation 섹션의 구조적 존재를 확인한다. `UI_DECISIONS.md` 검사는 현재 design track, decision log, superseded/rejected, validation history, open follow-up 구조를 확인한다. 특정 색상이나 디자인의 미적 적합성, developer manual review에서 어느 수정이 "안정화된 결정"인지, 실제로 중요한 결정이 빠짐없이 기록됐는지는 CI가 판단할 수 없으며 그 의미적 검토는 `docs/game-platform-ui-rules.md`의 lifecycle과 실제 브라우저 검증이 담당한다.

네 문서가 각각 독립 파일로만 존재하고 서로 고립되는 것을 막기 위해 game-local cross-link도 검사한다.

- `GAME_SPEC.md` → `UI_DESIGN.md`, `UI_DECISIONS.md`, `DEVELOPMENT.md`
- `DEVELOPMENT.md` → `GAME_SPEC.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`
- `UI_DESIGN.md` → `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DECISIONS.md`
- `UI_DECISIONS.md` → `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`

다만 Guard는 어느 문서의 내용이 의미적으로 다른 문서와 모순되는지까지 판정하지 않는다. 현재 기능 기준은 `GAME_SPEC.md`, 기능 진행은 `DEVELOPMENT.md`를 기준으로 한다. 디자인은 신규 게임의 pre-development baseline 또는 기존 게임의 명시된 adoption baseline인 `UI_DESIGN.md`와 `UI_DECISIONS.md`의 최신 non-superseded override를 함께 적용하며, 후속 결정이 baseline보다 우선하는지는 작업자가 의미적으로 검토한다.

Release 상태는 최소한의 기계적 정합성도 검사한다. `Status: RELEASED`인 게임은 production baseline이므로 `Active branch: main`이어야 하고 날짜가 포함된 `## Release` 섹션을 가져야 한다. 이는 실제 production migration 여부나 플레이 품질을 추론하는 검사가 아니라, 종료된 작업 브랜치가 현재 기준으로 남는 문서 오류를 막기 위한 guard다.

Guard는 규칙/디자인 출처의 신뢰도, 게임 규칙의 의미적 정확성, Visual Identity의 품질, `UI_DECISIONS.md`에 기록된 선택 이유의 타당성, 수동 브라우저 디자인 리뷰의 완료 여부, 자산 사용 권리의 법적 판단, Phase 진행상황의 사실 여부까지 자동 판정하지 않는다. 또한 각 게임의 재대결 구현이 실제 멀티클라이언트에서 완전한지를 문서 구조만으로 추론하지 않는다. 해당 내용은 `docs/game-platform-development-rules.md`, `docs/game-platform-ui-rules.md`, 게임별 테스트와 실제 브라우저 검증으로 확인한다.

## GV1 신규 vNext 권위·적용 전환

신규 vNext 상위는 `docs/game-platform-architecture.md`, 공통은 `docs/game-platform-common-rules.md`, 상세는 LI/MO/CA의 단일topic-owner다. 기존 development/UI/DB는 기존consumer scope와 원문/보드 계승에 유효하다. 하나의 topic+계약/consumer scope에 경쟁CURRENT를 두지 않는다. AR/CO/LI·승인 MO/CA 본문·AGENTS/진입/네템플릿·필요최소Guard/테스트는 같은 적용단위에서 맞춘다. BO/RT의7A2/7A3 후속본문 전에는 AR4 원문/승인내용의 발견경로를 제거하지 않는다.

## GV2 발견·버전·검증

topic별/1은 의미revision이며 wire/API 구현지원이 아니다. 신규scope를GAME_SPEC에서 명시하고 실제 모델/oracle·구현/미지원 상태를 구분한다. 현재7A1 최소Guard는 상위/필수절/참조/scope를 검사하며 전체nestedmodule/server/import/배포제외/oracle/test발견은7B이다. 준비전 runtime을 먼저 추가하지 않는다. CI/문서추적 성공을 실제행동/지원PASS로 표시하지 않는다.

## GV3 전파·영향도와 설계 게이트

기존 topic-owner 먼저 반영하고 상위/진입은요약/참조만전파한다. 같은세부의무를여러본문이독립소유하지 않는다. 승인조항ID/f→실제본문/참조·부모/강도/부정/조건/예외·원문출처를보존하고 L/H/I/예시를공통MUST로승격하지 않는다. actual목적지미성립/누락의미는해당ID/줄/f와owner/영향만반환한다. 원문표개수만으로전수의미검토완료를선언하지 않는다.

현재Registry 모든platform-native게임을 COMPLIANT / MIGRATION_REQUIRED / NOT_APPLICABLE로 근거와함께분류한다. 기존게임/API/SQL/metadata/네문서는무이관이며 MIGRATION_REQUIRED는기존consumer를고쳐해결하지 않고 vNext격리침범을반환한다. 새상위의미변경은 명시사용자합의→ARCHITECTURE CHANGE→해당설계게이트/전파·영향도 절차다. 별도사후감사단계를추가하지 않는다. 기능/디자인명령·baseline/유효override/manualgate·허용단계를보존한다.

## GV2 원문 참조 계승

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-gov-002-f0"></a>
#### LEGACY-GOV-002 / f0

- 원문: [docs/game-platform-governance.md L5–5](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L5-L5); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C061.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
이 문서는 신규 Game Platform 작업의 자동 검증 범위를 설명한다.
```

<a id="legacy-gov-003-f0"></a>
#### LEGACY-GOV-003 / f0

- 원문: [docs/game-platform-governance.md L7–7](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L7-L7); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C061.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
Governance Guard는 사이트 런타임 기능이 아니다. Pull Request 단계에서 신규 platform-native 게임과 `games/shared/` 변경이 현재 플랫폼 경계를 벗어나지 않는지 확인하는 개발용 안전장치다.
```

<a id="legacy-gov-004-f0"></a>
#### LEGACY-GOV-004 / f0

- 원문: [docs/game-platform-governance.md L11–11](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L11-L11); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C062.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
전용 workflow는 다음 경로가 변경된 Pull Request에서만 실행한다.
```

<a id="legacy-gov-005-f0"></a>
#### LEGACY-GOV-005 / f0

- 원문: [docs/game-platform-governance.md L13–21](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L13-L21); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C062.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

````text
```text<br>games/**<br>tests/game-platform-*.test.js<br>tests/game-db-integration/**<br>scripts/check-game-platform-governance.mjs<br>docs/game-platform-*.md<br>AGENTS.md<br>.github/workflows/game-platform-governance.yml<br>```
````

<a id="legacy-gov-006-f0"></a>
#### LEGACY-GOV-006 / f0

- 원문: [docs/game-platform-governance.md L23–23](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L23-L23); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C062.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
활동, 커뮤니티, 회원가입, 알림, 관리자 등 일반 서비스 변경만 있는 PR에서는 이 workflow가 실행되지 않는다.
```

<a id="legacy-gov-007-f0"></a>
#### LEGACY-GOV-007 / f0

- 원문: [docs/game-platform-governance.md L27–27](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L27-L27); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `games/&lt;game-id&gt;/` 디렉터리에 `GAME_SPEC.md`가 없거나 필수 설계 섹션이 빠진 경우
```

<a id="legacy-gov-008-f0"></a>
#### LEGACY-GOV-008 / f0

- 원문: [docs/game-platform-governance.md L28–28](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L28-L28); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `docs/game-platform-ui-rules.md`가 존재하는 현재 체계에서 `games/&lt;game-id&gt;/UI_DESIGN.md`가 없거나 필수 UI 설계 섹션이 빠진 경우
```

<a id="legacy-gov-009-f0"></a>
#### LEGACY-GOV-009 / f0

- 원문: [docs/game-platform-governance.md L29–29](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L29-L29); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `games/&lt;game-id&gt;/` 디렉터리에 `DEVELOPMENT.md`가 없거나 필수 기능 인수인계 섹션이 빠진 경우
```

<a id="legacy-gov-010-f0"></a>
#### LEGACY-GOV-010 / f0

- 원문: [docs/game-platform-governance.md L30–30](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L30-L30); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `games/&lt;game-id&gt;/` 디렉터리에 `UI_DECISIONS.md`가 없거나 필수 디자인 이력 섹션이 빠진 경우
```

<a id="legacy-gov-011-f0"></a>
#### LEGACY-GOV-011 / f0

- 원문: [docs/game-platform-governance.md L31–31](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L31-L31); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `DEVELOPMENT.md`가 `Status: RELEASED`인데 `Active branch: main`이 아니거나 `## Release` 기록이 없는 경우
```

<a id="legacy-gov-012-f0"></a>
#### LEGACY-GOV-012 / f0

- 원문: [docs/game-platform-governance.md L32–32](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L32-L32); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- Registry 미등록 bootstrap 디렉터리에 `GAME_SPEC.md` / `DEVELOPMENT.md` / `UI_DESIGN.md` / `UI_DECISIONS.md` 외 runtime 파일이 추가된 경우
```

<a id="legacy-gov-013-f0"></a>
#### LEGACY-GOV-013 / f0

- 원문: [docs/game-platform-governance.md L33–33](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L33-L33); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- runtime이 있는 `games/&lt;game-id&gt;/` 디렉터리가 shared Game Registry에 등록되지 않은 경우
```

<a id="legacy-gov-014-f0"></a>
#### LEGACY-GOV-014 / f0

- 원문: [docs/game-platform-governance.md L34–34](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L34-L34); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- shared Game Registry에 등록했지만 실제 `games/&lt;game-id&gt;/` 디렉터리가 없는 경우
```

<a id="legacy-gov-015-f0"></a>
#### LEGACY-GOV-015 / f0

- 원문: [docs/game-platform-governance.md L35–35](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L35-L35); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- online shared 게임인데 `tests/game-db-integration/&lt;game-id&gt;.test.js`가 없는 경우
```

<a id="legacy-gov-016-f0"></a>
#### LEGACY-GOV-016 / f0

- 원문: [docs/game-platform-governance.md L36–36](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L36-L36); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 새 platform-native runtime을 추가하면서 Registry를 같은 PR에서 갱신하지 않은 경우
```

<a id="legacy-gov-017-f0"></a>
#### LEGACY-GOV-017 / f0

- 원문: [docs/game-platform-governance.md L37–37](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L37-L37); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- Legacy 런타임과 Game Platform 런타임을 같은 PR에서 함께 수정한 경우
```

<a id="legacy-gov-018-f0"></a>
#### LEGACY-GOV-018 / f0

- 원문: [docs/game-platform-governance.md L38–38](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L38-L38); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C063.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 새 `games/shared/*.js` 모듈을 추가하면서 Game Platform 계약 테스트 또는 관련 문서를 함께 갱신하지 않은 경우
```

<a id="legacy-gov-019-f0"></a>
#### LEGACY-GOV-019 / f0

- 원문: [docs/game-platform-governance.md L42–42](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L42-L42); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C064.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
기존 `games/shared/` 모듈 수정은 매번 새 테스트 파일이나 문서 변경을 강제하지 않는다. 대신 전용 workflow가 기존 `npm run test:game-platform` 전체를 실행해 회귀를 확인한다.
```

<a id="legacy-gov-020-f0"></a>
#### LEGACY-GOV-020 / f0

- 원문: [docs/game-platform-governance.md L44–44](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L44-L44); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C064.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
이 방식은 단순 버그 수정이나 내부 구현 개선까지 문서 변경을 강제해 개발 속도를 떨어뜨리는 것을 피하기 위한 것이다.
```

<a id="legacy-gov-021-f0"></a>
#### LEGACY-GOV-021 / f0

- 원문: [docs/game-platform-governance.md L48–48](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L48-L48); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C065.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
`docs/game-platform-*.md`는 Governance Guard가 자동으로 발견하며 각 문서는 제목 아래에 `&gt; **문서 분류:** CURRENT` 또는 `HISTORY`를 선언해야 한다.
```

<a id="legacy-gov-022-f0"></a>
#### LEGACY-GOV-022 / f0

- 원문: [docs/game-platform-governance.md L50–50](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L50-L50); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C065.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `CURRENT`: 현재 실행 규칙/공통 계약 문서다. Registry의 특정 platform-native 게임명이나 ID를 공통 규칙으로 포함할 수 없다.
```

<a id="legacy-gov-023-f0"></a>
#### LEGACY-GOV-023 / f0

- 원문: [docs/game-platform-governance.md L51–51](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L51-L51); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C065.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `HISTORY`: 과거 전략·분석·구현 이력을 보존하는 문서다. 특정 게임 이력을 기록할 수 있지만 현재 실행 기준으로 사용하지 않는다.
```

<a id="legacy-gov-024-f0"></a>
#### LEGACY-GOV-024 / f0

- 원문: [docs/game-platform-governance.md L52–52](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L52-L52); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C065.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 메인 규칙서 `docs/game-platform-development-rules.md`를 제외한 모든 `docs/game-platform-*.md`는 해당 규칙서를 현재 rulebook으로 명시해야 한다.
```

<a id="legacy-gov-025-f0"></a>
#### LEGACY-GOV-025 / f0

- 원문: [docs/game-platform-governance.md L53–53](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L53-L53); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C065.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 신규 UI rulebook `docs/game-platform-ui-rules.md`가 존재하면 `AGENTS.md`, 메인 개발 규칙, `games/README.md`, `games/GAME_SPEC_TEMPLATE.md`, `games/DEVELOPMENT_TEMPLATE.md`, `games/UI_DESIGN_TEMPLATE.md`, `games/UI_DECISIONS_TEMPLATE.md`가 해당 UI rulebook을 명시해야 한다.
```

<a id="legacy-gov-026-f0"></a>
#### LEGACY-GOV-026 / f0

- 원문: [docs/game-platform-governance.md L54–54](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L54-L54); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C065.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `AGENTS.md`와 `games/` 최상위 Markdown 가이드/템플릿은 별도 분류 표기 없이 `CURRENT`로 간주해 같은 game-agnostic 검사를 적용한다.
```

<a id="legacy-gov-027-f0"></a>
#### LEGACY-GOV-027 / f0

- 원문: [docs/game-platform-governance.md L56–56](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L56-L56); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C065.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
따라서 새 공통 UI 문서가 단독으로 고립되지 않고 신규 게임 개발 진입점과 네 game-local 문서 체계까지 연결된다. 새 `docs/game-platform-*.md` 추가 자체는 Governance 테스트의 파일 목록을 수동으로 수정할 필요가 없으며, 분류 누락·권위 연결 누락·특정 신규 게임 종속 규칙이 자동으로 차단된다.
```

<a id="legacy-gov-041-f0"></a>
#### LEGACY-GOV-041 / f0

- 원문: [docs/game-platform-governance.md L79–79](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L79-L79); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C067.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
Governance Guard는 Liar Game, Drawing Spy, The Game, Marble을 새 플랫폼 규칙으로 마이그레이션하지 않는다.
```

<a id="legacy-gov-042-f0"></a>
#### LEGACY-GOV-042 / f0

- 원문: [docs/game-platform-governance.md L81–81](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L81-L81); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C067.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
다만 신규 Game Platform 런타임 변경과 Legacy 런타임 변경이 한 PR에 섞이는 경우에는 작업 범위를 분리하도록 차단한다.
```

<a id="legacy-gov-043-f0"></a>
#### LEGACY-GOV-043 / f0

- 원문: [docs/game-platform-governance.md L85–85](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L85-L85); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C068.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
workflow는 `pull_request`에만 반응하고 Game Platform 관련 경로가 바뀐 경우에만 실행한다. 별도 `push` 실행이나 전체 사이트 workflow 복제는 하지 않는다.
```

<a id="legacy-gov-044-f0"></a>
#### LEGACY-GOV-044 / f0

- 원문: [docs/game-platform-governance.md L87–87](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L87-L87); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C068.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
검증은 Node 기본 기능과 기존 Game Platform 테스트만 사용하므로 별도 `npm ci` 단계도 추가하지 않는다.
```

<a id="legacy-gov-045-f0"></a>
#### LEGACY-GOV-045 / f0

- 원문: [docs/game-platform-governance.md L90–90](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L90-L90); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
Governance Guard는 각 platform-native 게임 디렉터리에 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`가 존재하고 각 문서의 필수 섹션이 유지되는지 검사한다.
```

<a id="legacy-gov-046-f0"></a>
#### LEGACY-GOV-046 / f0

- 원문: [docs/game-platform-governance.md L92–92](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L92-L92); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
또한 기능/디자인 checkpoint 명령이 상위 진입 문서마다 달라지는 것을 막기 위해 명령 표기를 구조적으로 검사한다.
```

<a id="legacy-gov-047-f0"></a>
#### LEGACY-GOV-047 / f0

- 원문: [docs/game-platform-governance.md L94–94](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L94-L94); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `기능 체크포인트 기록하자`: `docs/game-platform-development-rules.md`, `AGENTS.md`, `games/README.md`가 공통으로 식별해야 한다.
```

<a id="legacy-gov-048-f0"></a>
#### LEGACY-GOV-048 / f0

- 원문: [docs/game-platform-governance.md L95–95](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L95-L95); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `디자인 체크포인트 기록하자`: `docs/game-platform-ui-rules.md`, `docs/game-platform-development-rules.md`, `AGENTS.md`, `games/README.md`가 공통으로 식별해야 한다.
```

<a id="legacy-gov-049-f0"></a>
#### LEGACY-GOV-049 / f0

- 원문: [docs/game-platform-governance.md L97–97](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L97-L97); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
기능 checkpoint의 상세 절차는 Development Rules가, 디자인 checkpoint의 상세 절차는 UI Rules가 소유한다. 상위 진입 문서는 두 명령을 재정의하지 않고 책임 문서로 연결한다. Phase 완료, 디자인 lifecycle 기록 트리거, release closeout 등 lifecycle 기반 문서 갱신 규칙은 사용자 checkpoint 명령과 독립적으로 유지한다.
```

<a id="legacy-gov-050-f0"></a>
#### LEGACY-GOV-050 / f0

- 원문: [docs/game-platform-governance.md L99–99](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L99-L99); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
네 문서만 있는 새 디렉터리는 bootstrap 상태로 인정하며 Registry 등록을 요구하지 않는다. 반대로 runtime 파일이 하나라도 추가되면 bootstrap 상태가 끝난 것으로 보고 같은 저장소 상태에서 shared Game Registry 등록을 요구한다.
```

<a id="legacy-gov-051-f0"></a>
#### LEGACY-GOV-051 / f0

- 원문: [docs/game-platform-governance.md L101–101](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L101-L101); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
`UI_DESIGN.md` 검사는 디자인 조사, 자산 사용 경계, Visual Identity, page/lobby/gameplay/result/rematch, motion, responsive, 구현 가이드, validation 섹션의 구조적 존재를 확인한다. `UI_DECISIONS.md` 검사는 현재 design track, decision log, superseded/rejected, validation history, open follow-up 구조를 확인한다. 특정 색상이나 디자인의 미적 적합성, developer manual review에서 어느 수정이 "안정화된 결정"인지, 실제로 중요한 결정이 빠짐없이 기록됐는지는 CI가 판단할 수 없으며 그 의미적 검토는 `docs/game-platform-ui-rules.md`의 lifecycle과 실제 브라우저 검증이 담당한다.
```

<a id="legacy-gov-052-f0"></a>
#### LEGACY-GOV-052 / f0

- 원문: [docs/game-platform-governance.md L103–103](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L103-L103); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
네 문서가 각각 독립 파일로만 존재하고 서로 고립되는 것을 막기 위해 game-local cross-link도 검사한다.
```

<a id="legacy-gov-053-f0"></a>
#### LEGACY-GOV-053 / f0

- 원문: [docs/game-platform-governance.md L105–105](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L105-L105); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `GAME_SPEC.md` → `UI_DESIGN.md`, `UI_DECISIONS.md`, `DEVELOPMENT.md`
```

<a id="legacy-gov-054-f0"></a>
#### LEGACY-GOV-054 / f0

- 원문: [docs/game-platform-governance.md L106–106](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L106-L106); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `DEVELOPMENT.md` → `GAME_SPEC.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`
```

<a id="legacy-gov-055-f0"></a>
#### LEGACY-GOV-055 / f0

- 원문: [docs/game-platform-governance.md L107–107](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L107-L107); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `UI_DESIGN.md` → `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DECISIONS.md`
```

<a id="legacy-gov-056-f0"></a>
#### LEGACY-GOV-056 / f0

- 원문: [docs/game-platform-governance.md L108–108](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L108-L108); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `UI_DECISIONS.md` → `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`
```

<a id="legacy-gov-057-f0"></a>
#### LEGACY-GOV-057 / f0

- 원문: [docs/game-platform-governance.md L110–110](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L110-L110); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
다만 Guard는 어느 문서의 내용이 의미적으로 다른 문서와 모순되는지까지 판정하지 않는다. 현재 기능 기준은 `GAME_SPEC.md`, 기능 진행은 `DEVELOPMENT.md`를 기준으로 한다. 디자인은 신규 게임의 pre-development baseline 또는 기존 게임의 명시된 adoption baseline인 `UI_DESIGN.md`와 `UI_DECISIONS.md`의 최신 non-superseded override를 함께 적용하며, 후속 결정이 baseline보다 우선하는지는 작업자가 의미적으로 검토한다.
```

<a id="legacy-gov-058-f0"></a>
#### LEGACY-GOV-058 / f0

- 원문: [docs/game-platform-governance.md L112–112](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L112-L112); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
Release 상태는 최소한의 기계적 정합성도 검사한다. `Status: RELEASED`인 게임은 production baseline이므로 `Active branch: main`이어야 하고 날짜가 포함된 `## Release` 섹션을 가져야 한다. 이는 실제 production migration 여부나 플레이 품질을 추론하는 검사가 아니라, 종료된 작업 브랜치가 현재 기준으로 남는 문서 오류를 막기 위한 guard다.
```

<a id="legacy-gov-059-f0"></a>
#### LEGACY-GOV-059 / f0

- 원문: [docs/game-platform-governance.md L114–114](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L114-L114); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C069.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
Guard는 규칙/디자인 출처의 신뢰도, 게임 규칙의 의미적 정확성, Visual Identity의 품질, `UI_DECISIONS.md`에 기록된 선택 이유의 타당성, 수동 브라우저 디자인 리뷰의 완료 여부, 자산 사용 권리의 법적 판단, Phase 진행상황의 사실 여부까지 자동 판정하지 않는다. 또한 각 게임의 재대결 구현이 실제 멀티클라이언트에서 완전한지를 문서 구조만으로 추론하지 않는다. 해당 내용은 `docs/game-platform-development-rules.md`, `docs/game-platform-ui-rules.md`, 게임별 테스트와 실제 브라우저 검증으로 확인한다.
```


## GV3 원문 참조 계승

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-agent-054-f0"></a>
#### LEGACY-AGENT-054 / f0

- 원문: [AGENTS.md L78–78](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L78-L78); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 하위 game-local/topic-owner 작업에서 현재 상위 Game Platform 규칙과 충돌하는 새 필요를 발견했다고 해서 바로 소스나 하위 규칙을 수정하지 않습니다. 먼저 기존 상위 규칙과 shared/runtime 경계를 확인하고, 사용자와의 토의에서 플랫폼 전반에 필요한 변경으로 명시적으로 합의된 경우에만 **Game Platform ARCHITECTURE CHANGE**로 승격합니다. 승격된 작업은 `docs/game-platform-development-rules.md`와 `docs/game-platform-governance.md`의 전파/영향도 감사 절차를 따릅니다.
```

<a id="legacy-agent-055-f0"></a>
#### LEGACY-AGENT-055 / f0

- 원문: [AGENTS.md L79–79](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L79-L79); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- Game Platform CURRENT 규칙, shared 계약 또는 필수 lifecycle을 변경하는 작업은 현재 Registry의 모든 platform-native 게임을 전수 검토하고 각 게임을 `COMPLIANT` / `MIGRATION_REQUIRED` / `NOT_APPLICABLE`로 분류합니다. `IN_PROGRESS` 게임의 충돌은 release 전에 해소하고, `RELEASED` 게임은 별도 migration/follow-up 필요 여부를 작업 결과와 PR에 남깁니다.
```

<a id="legacy-dev-339-f0"></a>
#### LEGACY-DEV-339 / f0

- 원문: [docs/game-platform-development-rules.md L679–679](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L679-L679); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C050.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 게임을 구현하다 현재 플랫폼 계약으로 표현할 수 없는 요구가 발견될 수 있다.
```

<a id="legacy-dev-340-f0"></a>
#### LEGACY-DEV-340 / f0

- 원문: [docs/game-platform-development-rules.md L681–681](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L681-L681); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C050.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
그 경우 다음 순서로 판단한다.
```

<a id="legacy-dev-341-f0"></a>
#### LEGACY-DEV-341 / f0

- 원문: [docs/game-platform-development-rules.md L683–683](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L683-L683); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C050.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. 해당 요구가 게임 규칙 자체인지 확인한다.
```

<a id="legacy-dev-342-f0"></a>
#### LEGACY-DEV-342 / f0

- 원문: [docs/game-platform-development-rules.md L684–684](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L684-L684); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C050.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. 게임 규칙이면 GAME-LOCAL에 둔다.
```

<a id="legacy-dev-343-f0"></a>
#### LEGACY-DEV-343 / f0

- 원문: [docs/game-platform-development-rules.md L685–685](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L685-L685); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C050.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. 게임 규칙과 무관하고 미래의 여러 게임에서도 반복될 플랫폼 책임인지 확인한다.
```

<a id="legacy-dev-344-f0"></a>
#### LEGACY-DEV-344 / f0

- 원문: [docs/game-platform-development-rules.md L686–686](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L686-L686); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C050.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. SHARED 책임으로 확인된 경우에만 가장 작은 범위로 공통 계약을 확장한다.
```

<a id="legacy-dev-345-f0"></a>
#### LEGACY-DEV-345 / f0

- 원문: [docs/game-platform-development-rules.md L687–687](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L687-L687); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C050.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
5. shared 변경에는 계약 테스트와 관련 문서 변경을 함께 포함한다.
```

<a id="legacy-dev-346-f0"></a>
#### LEGACY-DEV-346 / f0

- 원문: [docs/game-platform-development-rules.md L688–688](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L688-L688); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C050.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
6. `games/shared/` 모듈을 사이트 공통 `js/`나 다른 영역이 직접 소비한다면 해당 소비자 모듈의 import/export 연결 검증도 유지한다. Game Platform 전용 CI로 분리하더라도 이 교차 경계를 검증 없이 제외하지 않는다.
```

<a id="legacy-dev-347-f0"></a>
#### LEGACY-DEV-347 / f0

- 원문: [docs/game-platform-development-rules.md L690–690](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L690-L690); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C050.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 현재 게임을 빠르게 구현하기 위한 편의 때문에 shared에 게임별 예외를 추가하지 않는다.
```

<a id="legacy-dev-348-f0"></a>
#### LEGACY-DEV-348 / f0

- 원문: [docs/game-platform-development-rules.md L692–692](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L692-L692); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C050.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 실제 소비자가 없는 미래 기능을 추측해 범용 엔진으로 선행 구현하지 않는다.
```

<a id="legacy-dev-349-f0"></a>
#### LEGACY-DEV-349 / f0

- 원문: [docs/game-platform-development-rules.md L696–696](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L696-L696); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C051.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 게임 개발 중 하위 game-local 문서나 topic-owner 규칙에서 현재 상위 규칙으로는 수용할 수 없는 필요가 먼저 발견될 수 있다. **하위에서 먼저 발견했다는 사실은 그 변경에 상위 권위를 부여하지 않는다.**
```

<a id="legacy-dev-350-f0"></a>
#### LEGACY-DEV-350 / f0

- 원문: [docs/game-platform-development-rules.md L700–700](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L700-L700); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C052.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 새 필요가 현재 상위 규칙과 shared/runtime 경계 안에서 세부화 가능한 경우 topic-owner 문서에서 가장 구체적인 규칙을 먼저 정의한다.
```

<a id="legacy-dev-351-f0"></a>
#### LEGACY-DEV-351 / f0

- 원문: [docs/game-platform-development-rules.md L701–701](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L701-L701); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C052.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 이후 상위/진입 문서는 같은 세부 규칙을 다시 독립 정의하지 않고 필요한 invariant와 topic-owner 참조만 전파한다.
```

<a id="legacy-dev-352-f0"></a>
#### LEGACY-DEV-352 / f0

- 원문: [docs/game-platform-development-rules.md L705–705](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L705-L705); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 토의·승격 없이 하위 문서 또는 runtime/source부터 상위 규칙을 벗어나게 수정하는 것은 **불허용**이다.
```

<a id="legacy-dev-353-f0"></a>
#### LEGACY-DEV-353 / f0

- 원문: [docs/game-platform-development-rules.md L706–706](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L706-L706); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 소스 수정 전에 현재 상위 규칙, shared contract, 기존 platform-native 게임에 미치는 영향을 확인한다.
```

<a id="legacy-dev-354-f0"></a>
#### LEGACY-DEV-354 / f0

- 원문: [docs/game-platform-development-rules.md L707–707](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L707-L707); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 사용자/maintainer와의 토의에서 해당 필요가 특정 게임의 예외가 아니라 Game Platform 전반에 필요한 변경이라고 명시적으로 합의되면 **ARCHITECTURE CHANGE**로 승격한다.
```

<a id="legacy-dev-355-f0"></a>
#### LEGACY-DEV-355 / f0

- 원문: [docs/game-platform-development-rules.md L708–708](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L708-L708); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 승격된 뒤에는 하위 topic-owner와 상위 규칙을 같은 작업 범위에서 함께 정합화할 수 있으며, runtime 구현보다 규칙/계약 변경과 영향도 감사를 먼저 또는 같은 원자적 변경에서 완료한다.
```

<a id="legacy-dev-356-f0"></a>
#### LEGACY-DEV-356 / f0

- 원문: [docs/game-platform-development-rules.md L709–709](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L709-L709); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 승격 전의 하위 제안을 기존 상위 규칙을 우회하는 임시 예외로 구현하지 않는다.
```

<a id="legacy-dev-357-f0"></a>
#### LEGACY-DEV-357 / f0

- 원문: [docs/game-platform-development-rules.md L711–711](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L711-L711); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
ARCHITECTURE CHANGE 작업은 최소 다음을 함께 검토한다.
```

<a id="legacy-dev-358-f0"></a>
#### LEGACY-DEV-358 / f0

- 원문: [docs/game-platform-development-rules.md L713–713](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L713-L713); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. `docs/game-platform-development-rules.md` 최상위 invariant
```

<a id="legacy-dev-359-f0"></a>
#### LEGACY-DEV-359 / f0

- 원문: [docs/game-platform-development-rules.md L714–714](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L714-L714); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. 관련 topic-owner 문서(UI, DB/Test, Governance 등)
```

<a id="legacy-dev-360-f0"></a>
#### LEGACY-DEV-360 / f0

- 원문: [docs/game-platform-development-rules.md L715–715](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L715-L715); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. `games/shared/` 계약과 관련 contract test
```

<a id="legacy-dev-361-f0"></a>
#### LEGACY-DEV-361 / f0

- 원문: [docs/game-platform-development-rules.md L716–716](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L716-L716); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. game-local 템플릿과 신규 게임 bootstrap 규칙
```

<a id="legacy-dev-362-f0"></a>
#### LEGACY-DEV-362 / f0

- 원문: [docs/game-platform-development-rules.md L717–717](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L717-L717); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
5. Governance Guard와 workflow/검증 범위
```

<a id="legacy-dev-363-f0"></a>
#### LEGACY-DEV-363 / f0

- 원문: [docs/game-platform-development-rules.md L718–718](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L718-L718); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
6. Registry의 모든 `platform: "shared"` 게임 영향도
```

<a id="legacy-dev-364-f0"></a>
#### LEGACY-DEV-364 / f0

- 원문: [docs/game-platform-development-rules.md L719–719](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L719-L719); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
7. Legacy 경계와 site-level 소비자 영향 여부
```

<a id="legacy-dev-365-f0"></a>
#### LEGACY-DEV-365 / f0

- 원문: [docs/game-platform-development-rules.md L721–721](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L721-L721); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:원칙,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C053.
- 승인된 적용/전환: 공통변경/명시상위승인 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
세부 전파 절차와 자동 검증 경계는 `docs/game-platform-governance.md`의 **공통 규칙 변경 전파 원칙**을 따른다.
```

<a id="legacy-dev-373-f0"></a>
#### LEGACY-DEV-373 / f0

- 원문: [docs/game-platform-development-rules.md L738–738](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L738-L738); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C055.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Game Platform의 CURRENT 규칙, shared 계약, DB/Test Contract 또는 공통 lifecycle을 변경하는 작업은 **새 게임에만 적용하고 끝내지 않는다.** 현재 Registry에서 `platform: "shared"`인 모든 게임을 전수 검토한다.
```

<a id="legacy-dev-374-f0"></a>
#### LEGACY-DEV-374 / f0

- 원문: [docs/game-platform-development-rules.md L740–740](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L740-L740); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C055.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
각 게임은 최소 다음 중 하나로 분류한다.
```

<a id="legacy-dev-375-f0"></a>
#### LEGACY-DEV-375 / f0

- 원문: [docs/game-platform-development-rules.md L742–742](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L742-L742); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C055.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `COMPLIANT`: 현재 구현·게임별 문서·테스트가 새 규칙과 이미 일치한다.
```

<a id="legacy-dev-376-f0"></a>
#### LEGACY-DEV-376 / f0

- 원문: [docs/game-platform-development-rules.md L743–743](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L743-L743); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C055.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `MIGRATION_REQUIRED`: 현재 구현이나 문서가 새 규칙과 충돌하며 후속 수정이 필요하다.
```

<a id="legacy-dev-377-f0"></a>
#### LEGACY-DEV-377 / f0

- 원문: [docs/game-platform-development-rules.md L744–744](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L744-L744); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C055.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `NOT_APPLICABLE`: 게임 구조상 해당 규칙이 적용되지 않으며 그 이유가 명확하다.
```

<a id="legacy-dev-378-f0"></a>
#### LEGACY-DEV-378 / f0

- 원문: [docs/game-platform-development-rules.md L748–748](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L748-L748); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C056.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 규칙 변경 PR의 작업 결과 또는 PR 설명에 영향도 감사 결과를 남긴다.
```

<a id="legacy-dev-379-f0"></a>
#### LEGACY-DEV-379 / f0

- 원문: [docs/game-platform-development-rules.md L749–749](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L749-L749); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C056.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `IN_PROGRESS` 게임이 `MIGRATION_REQUIRED`라면 release 전에 충돌을 해소한다.
```

<a id="legacy-dev-380-f0"></a>
#### LEGACY-DEV-380 / f0

- 원문: [docs/game-platform-development-rules.md L750–750](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L750-L750); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C056.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `RELEASED` 게임이 `MIGRATION_REQUIRED`라면 현재 동작을 임의로 같은 PR에서 바꾸지 않고 별도 migration/follow-up 범위를 정한다.
```

<a id="legacy-dev-381-f0"></a>
#### LEGACY-DEV-381 / f0

- 원문: [docs/game-platform-development-rules.md L751–751](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L751-L751); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C056.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- shared runtime/API가 비호환으로 바뀌는 경우 RELEASED consumer를 깨뜨린 채 공통 계약만 먼저 merge하지 않는다. 기존 surface를 호환 유지하거나 consumer migration을 먼저 또는 같은 원자적 변경으로 완료한 뒤 기존 surface를 제거한다.
```

<a id="legacy-dev-382-f0"></a>
#### LEGACY-DEV-382 / f0

- 원문: [docs/game-platform-development-rules.md L752–752](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L752-L752); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C056.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임별 문서와 실제 코드/테스트가 서로 다른 정책을 말하면 문서만 맞춰 적지 말고 runtime 영향까지 확인한다.
```

<a id="legacy-dev-383-f0"></a>
#### LEGACY-DEV-383 / f0

- 원문: [docs/game-platform-development-rules.md L753–753](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L753-L753); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C056.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 특정 게임의 예외를 허용해야 한다면 공통 규칙을 조용히 위반하게 두지 않고 적용 제외 근거 또는 플랫폼 규칙 변경으로 명시한다.
```

<a id="legacy-dev-384-f0"></a>
#### LEGACY-DEV-384 / f0

- 원문: [docs/game-platform-development-rules.md L755–755](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L755-L755); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C056.
- 승인된 적용/전환: 기존영향도/무이관 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Governance Guard가 문서 구조와 링크를 확인하더라도 이 영향도의 의미적 판단까지 자동화할 수는 없다. 따라서 공통 규칙 변경 시 영향도 감사는 작업자의 필수 검토 절차다.
```

<a id="legacy-dev-386-f25"></a>
#### LEGACY-DEV-386 / f25

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 승인된PR/작업브랜치정리; 원문 범위: 코드블록순서25.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-gov-028-f0"></a>
#### LEGACY-GOV-028 / f0

- 원문: [docs/game-platform-governance.md L60–60](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L60-L60); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
Game Platform 규칙을 보완할 때는 문서 계층의 높이만 보고 무조건 최상위부터 또는 최하위부터 고치지 않는다. 먼저 **이번 변경의 세부 의미를 소유하는 topic-owner 문서**를 식별한다.
```

<a id="legacy-gov-029-f0"></a>
#### LEGACY-GOV-029 / f0

- 원문: [docs/game-platform-governance.md L62–62](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L62-L62); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
기본 절차는 다음과 같다.
```

<a id="legacy-gov-030-f0"></a>
#### LEGACY-GOV-030 / f0

- 원문: [docs/game-platform-governance.md L64–64](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L64-L64); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
1. 변경 전 현재 최상위 규칙과 shared/runtime 경계를 확인해 제안이 기존 플랫폼 구조와 충돌하지 않는지 먼저 감사한다.
```

<a id="legacy-gov-031-f0"></a>
#### LEGACY-GOV-031 / f0

- 원문: [docs/game-platform-governance.md L65–65](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L65-L65); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
2. 충돌이 없다면 가장 구체적인 세부 의미는 topic-owner 문서에서 먼저 정의한다.
```

<a id="legacy-gov-032-f0"></a>
#### LEGACY-GOV-032 / f0

- 원문: [docs/game-platform-governance.md L66–66](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L66-L66); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: LEGACY-GOV-031.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 예: UI lifecycle·디자인 기록 방식은 `docs/game-platform-ui-rules.md`
```

<a id="legacy-gov-033-f0"></a>
#### LEGACY-GOV-033 / f0

- 원문: [docs/game-platform-governance.md L67–67](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L67-L67); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: LEGACY-GOV-031.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 기능 개발 lifecycle·기능 checkpoint는 `docs/game-platform-development-rules.md`
```

<a id="legacy-gov-034-f0"></a>
#### LEGACY-GOV-034 / f0

- 원문: [docs/game-platform-governance.md L68–68](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L68-L68); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 표현:검증; 명시부모: LEGACY-GOV-031.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 자동 검증 범위와 문서 연결 강제는 이 Governance 문서와 Guard 소스
```

<a id="legacy-gov-035-f0"></a>
#### LEGACY-GOV-035 / f0

- 원문: [docs/game-platform-governance.md L69–69](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L69-L69); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
3. topic-owner의 의미가 확정된 뒤 `docs/game-platform-development-rules.md`, `AGENTS.md`, `games/README.md` 같은 상위/진입 문서에는 필요한 요약과 참조만 전파한다.
```

<a id="legacy-gov-036-f0"></a>
#### LEGACY-GOV-036 / f0

- 원문: [docs/game-platform-governance.md L70–70](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L70-L70); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
4. 같은 세부 규칙을 여러 상위 문서에서 독립적으로 다시 정의하지 않는다. 상위 문서는 책임 문서를 가리키고 핵심 invariant만 반복한다.
```

<a id="legacy-gov-037-f0"></a>
#### LEGACY-GOV-037 / f0

- 원문: [docs/game-platform-governance.md L71–71](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L71-L71); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
5. 상위 규칙과 충돌하는 하위 필요는 **발견/토의 단계에서는 제안으로만 유지**하고, 승격 없이 하위 문서나 runtime을 상위 규칙 밖으로 먼저 수정하지 않는다. 사용자/maintainer와의 토의에서 플랫폼 전반에 필요한 변경으로 명시적으로 합의되면 Development Rules의 **ARCHITECTURE CHANGE**로 승격한다.
```

<a id="legacy-gov-038-f0"></a>
#### LEGACY-GOV-038 / f0

- 원문: [docs/game-platform-governance.md L72–72](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L72-L72); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
6. ARCHITECTURE CHANGE로 승격된 뒤에는 topic-owner와 상위 규칙을 같은 작업 범위에서 함께 정합화하고, 현재 platform-native 게임 영향도 감사를 수행한 뒤 runtime/shared 변경으로 진행한다.
```

<a id="legacy-gov-039-f0"></a>
#### LEGACY-GOV-039 / f0

- 원문: [docs/game-platform-governance.md L73–73](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L73-L73); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
7. 전파가 끝나면 Governance/contract 테스트와 현재 platform-native 게임의 `COMPLIANT` / `MIGRATION_REQUIRED` / `NOT_APPLICABLE` 영향을 확인한다.
```

<a id="legacy-gov-040-f0"></a>
#### LEGACY-GOV-040 / f0

- 원문: [docs/game-platform-governance.md L75–75](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-governance.md#L75-L75); blob `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C066.
- 승인된 적용/전환: 원Governance적용범위 / 원owner유지+상위연결.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
이 방식은 **세부 결정은 한 곳에서 소유하고 상위 문서는 그 결정을 참조하는 구조**를 유지해 규칙 중복과 drift를 줄인다. 따라서 topic-owner → 상위 참조 문서 → Governance/테스트 순서의 전파는 기존 Game Platform 구조를 훼손하는 방식이 아니라, 오히려 문서 권위와 책임 경계를 유지하기 위한 기본 변경 방식으로 사용한다.
```


## STEP7A2 보드 하위 규칙 연결 — 기존 적용 범위 유지

신규 vNext 보드 경험의 추가 규칙은 [BO1~4](game-platform-board-rules.md)이며 상위 [AR](game-platform-architecture.md)의 공통/모델 owner를 참조한다. 기존 consumer·규범본문·고정 원문/계승과 네 문서 baseline은 유지한다. 실제 BO 발견과 최소 Guard 연결은 같은 적용 단위다. RT는7A3 후속으로 승인 artifact 발견을 유지하며 full 경로/모델 oracle/test발견은7B이다. 이 연결로 신규 온라인 미지원·기존 온라인 DB 검사·multiplayer 재대결 의무를 면제하지 않는다.

## STEP7A3 실시간 협동·공간 하위 규칙 연결

신규 vNext의 제한 실시간협동/공간 경험은 [RT1~6](game-platform-realtime-coop-rules.md)을 상위 [AR](game-platform-architecture.md) 아래에서 적용한다. BO 실제발견·공통/모델 단일owner·기존consumer/규범본문은 보존한다. R01~13의제품질문/조건·둘째Probe/혼합/신규추가절차는 RT6에서 정확한승인owner를참조한다. 이 연결은 게임/기술/Runtime구현·지원인증이나 online안전/재대결면제가 아니다. full발견/모델oracle는7B후속이다.

## STEP7B 탐지·검증 연결과 제한

승인 경로의 browser 공통 구현은 games/shared/vnext/, 서버 전용 구현은 services/game-platform-vnext/다. 실제 runtime/서버 코드는 아직 없다. [AR](game-platform-architecture.md)의 책임/scope·[MO](game-platform-model-contracts.md)의 안전11/A·C·P/권위·복구·[LI](game-platform-lifetime-contract.md)의 전체 수명이 의미를 소유한다. 이 절과 검사 코드는 그 요구의 발견·전파/누락 거부만 소유한다. 모듈 exports/현재 상태 안내는 [games README](../games/README.md#step7b-공통-모듈-연결구현-상태-안내)다.

### 발견과 기존 소비자 격리

[Guard](../scripts/check-game-platform-governance.mjs)의 새 shared 모듈 발견은 기존 flat .js/.mjs와 nested vnext .js/.mjs를 포함한다. 기존 games/shared/index.js 예외는 정확히 그 기존 파일에만 유지하며 nested index 모듈은 계약 tests/문서 요구에서 제외하지 않는다. server root의 새 파일도 test/문서 변경을 요구한다. games 직계 shared 제외와 네 문서만 있는 bootstrap 미등록 허용을 유지한다. server-only 변경은 기존 Governance workflow의 paths와 검사에 들어가며 별도 workflow를 생성하지 않는다.

기존 flat tests/game-platform-*.test.js에는 tests/game-platform-vnext-*.test.js가 포함된다. DB runner는 기존 tests/game-db-integration/<game-id>.test.js/disposable 경계를 유지한다. 기존 online consumer의 DB 테스트 요구는 삭제/면제하지 않는다. CI의 Game Platform syntax·community import/export 연결·configured contracts·actual base/head Guard도 유지한다. browser 경계에 영향을 주는 site/game/asset/entry 및 검사/config 변경이 기존 Governance workflow에서 발견되며, 전용 검사로 다루는 경로만 site-static PR ignore에 추가했다. site-static의 main push 검사나 실제 배포 설정은 바꾸지 않는다.

### 선택 계약과 모델 oracle의 기계적 연결

GAME_SPEC의 Platform contract 선언은 하나이며 현재 승인 GP-COMMON/1과 일치해야 한다. 명시한 Genre / capability contracts의 revision은 현재 승인 owner와 일치해야 한다. 더 큰 revision/latest·Invite v1·SQL v1.0.0·계획1.5를 호환 증거로 쓰지 않는다. 신규 vNext를 import하는 실제 게임은 적용 scope를 선언하고, runtime 추가 순간 단일 기존 Registry와 실제 선택 모델/검증 연결 요구가 적용된다. 기존 consumer를 vNext로 자동 전환하지 않는다.

적용 계약 필드는 전체 ID/revision 토큰·목록과 제공한 owner 경로/링크를 검사하며 부분 문자열만 유효하다고 축소하지 않는다. 필드 부재 또는 명시 미선택/비적용/미지원 표시는 장르 선택이나 실제 모델 지원을 만들지 않으며, 별도 runtime/oracle·online DB·안전 의무를 면제하지 않는다.

[모델 oracle 발견 설정](../tests/game-platform-vnext-model-oracles.json)은 **models: []**다. 실제 지원/선택 모델을 새로 등록하지 않았고 현재 신규 vNext online 및 미구현 local runtime 조합은 미지원이다. 네 문서만의 local bootstrap은 구현 지원을 주장하지 않는 준비 상태로 허용한다. 모델별 실제 정의와 oracle가 준비되지 않았다는 이유로 플랫폼 전체 준비를 보류하지 않는다.

후속 허용된 모델 구현 시, checker용 descriptor는 model contract ID/revision·MO의 같은 명시 anchor/정의·online scope·기존 runner(node-contract/disposable-db)·실제 oracle 환경·승인 root의 구현 파일·coverage를 연결한다. coverage는 safety01~11·authorizationACP·lifetime·adoptionRecovery 각각의 discovered test 파일/실제 test 이름을 가리킨다. online의 안전11 항목을 private 정보 없음/N/A로 없애지 않는다. 실제 local의 비적용은 이유가 있어야 하고 전체 수명·최종 채택은 N/A로 면제하지 않는다. 기존 flat test/DB runner 밖의 파일이나 주석의 case 이름·없는 환경/구현·다른 owner anchor는 증거로 인정하지 않는다.

이 설정은 **검사 내부 발견 형식**이며 runtime 공개 API/schema/wire·새 게임 metadata나 Profile 엔진이 아니다. 구현 Slice에서 실제 oracle/runner를 연결할 때 필요한 최소 검사 정합화가 가능하다. 파일/명칭/환경 선언이 있거나 descriptor 검사를 통과해도 테스트 의미 검토·실행/actual C·backend/두 client·지원 검증 완료가 아니다. unit fixture의 구조적 양성 결과를 production 모델 지원으로 표시하지 않는다. 새 상위 의미/인가/수명 완화가 필요한 경우 해당 원문/영향만 Architecture Change로 반환한다.

### browser/server import와 정적 공개 차단

[경계 helper](../scripts/check-game-platform-vnext-boundaries.mjs)는 tracked browser .js/.mjs/.html/.css와 asset manifest 출력에서 server root 참조를 검사한다. static import/re-export·literal dynamic import·명시적인 server root template/resource URL 및 query/hash/encoded traversal을 확인하며 각 tracked browser 모듈을 읽어 중간 연결의 server edge도 발견한다. 기존 barrel→vNext 재수출도 거부한다. browser bytes/manifest를 읽을 수 없으면 빈 성공으로 처리하지 않는다.

기존 Governance CI의 변경 필터는 css/와 모든 루트 browser 확장자도 포함한다. HTML의 실행 가능한 inline script module edge와 CSS/HTML style의 quoted @import(공백 없음·주석 경유 포함)를 검사하고, 상대경로의 origin root 위 이동을 root에 제한해 server 경계와 대조한다. 주석·비실행 script 본문을 실행 import로 간주하지 않는다.

js/app.js를 entry로 하는 현재 browser bundle은 모든 게임 entry를 자동 포함한다는 증거가 아니다. .nojekyll의 존재나 services라는 폴더명·.gitignore·임의 manifest flag는 서버 비노출 증거가 아니다. 현재 tracked 배포 자료에서 새 server root의 공개 제외가 증명되지 않았고 실제 hosting 설정/loaded bytes는 미확인이다. 따라서 helper는 **server root의 tracked 파일/산출물 존재 자체를 fail closed로 차단**한다. 이를 해제하려면 후속 허용 단계에서 실제 배포 source/artifact 경계·제외 검사가 확보되어야 하며 단순 support/excluded flag를 추가하는 것으로 해제할 수 없다. 이번에는 실제 배포/운영 설정을 변경하지 않는다.

검사는 임의 eval/모든 계산된 URL의 완전한 JavaScript 보안 증명이 아니다. 현재 server 산출물 자체의 공개 제외 미확인 차단과 함께 사용하며, 미래 server 경계를 완화할 때 실제 build/import closure·artifact·loaded bytes 증거를 대신하지 않는다. HTTP/RPC 계약 통신과 서버 구현 모듈의 browser import를 구별한다.

### 검증/상태의 구분

관련 tests와 실제 repository/base-head 검사·원격 read-back을 확인한다. 기계 검사와 의미 대응/기존 모든 platform-native 영향도는 구별한다. 기존 게임/API/SQL/Auth/barrel/metadata/네 문서를 고쳐 MIGRATION_REQUIRED를 닫지 않는다. 행동 게임/DB/browser/audio/두 client/성능/운영 NOT_RUN·UNKNOWN 및 구현/실행/오픈 의무 유지. 새 Core·모델/backend/oracle·H1~3 최소 본체 보완·Probe 게임·transport/renderer/tick/physics/prediction·예산/운영 선택은 이번 검사 연결에서 구현/동결하지 않는다.
