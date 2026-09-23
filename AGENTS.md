# AGENTS.md

이 저장소는 `청파 같이` 사이트와 웹게임을 함께 관리하는 프로젝트입니다. Codex를 포함한 자동화 에이전트는 아래 규칙을 우선하여 작업합니다.

## 기본 작업 흐름

- 모든 작업은 최신 `main` 브랜치를 기준으로 시작합니다.
- 소스를 수정하기 전에 작업 목적에 맞는 별도 작업 브랜치를 사용합니다.
- `main` 브랜치에 직접 commit 또는 push하지 않습니다.
- 변경사항은 작업 브랜치에 commit한 뒤 Pull Request로 제출합니다.
- 사용자의 명시적 승인 없이 Pull Request를 `main`에 merge하지 않습니다.

## 브랜치 명명 규칙

- 기본 형식은 `<type>/<root-slug>-phase<N>-<detail>`을 사용합니다.
- `feature`, `fix`, `refactor`, `chore` 등 `type`은 실제 작업 성격에 맞게 선택합니다.
- 하나의 큰 작업이 시작되어 완료될 때까지 `root-slug`는 동일하게 유지합니다.
- 세부 단계나 후속 작업은 `phase<N>`과 `detail`만 변경하여 구분합니다.
- 기존 작업의 후속 브랜치에서 별도 `root-slug`를 임의로 만들지 않습니다. 새로운 `root-slug`는 완전히 별개의 작업을 시작할 때만 사용합니다.
- 브랜치 정리, 삭제 대상 제안, 기존 작업 참조 시에는 `type`보다 `root-slug`를 우선 기준으로 삼습니다.
- 삭제 대상 브랜치는 같은 `root-slug`끼리 묶어 검토하고, 현재 작업과 다른 `root-slug`의 브랜치를 작업 기준으로 혼용하거나 참조하지 않습니다.
- 단계 구분이 불필요한 단일 작업은 `phase<N>`을 생략할 수 있지만, 여러 단계로 이어질 가능성이 있다면 처음부터 `phase<N>` 형식을 우선 사용합니다.

예시:

```text
feature/marble-stability-phase1-foundation
feature/marble-stability-phase2-room-sync
fix/marble-stability-phase3-ci
```

위 예시처럼 `type`은 달라질 수 있어도 같은 작업 계보라면 `marble-stability`를 공통 `root-slug`로 유지합니다.

## 변경 원칙

- 기존 아키텍처, 코딩 스타일, 데이터 구조와 기존 동작을 최대한 유지합니다.
- 요구사항을 충족하는 데 필요한 최소 범위만 수정합니다.
- 기존 기능에 의도하지 않은 영향을 줄 수 있는 변경을 피합니다.
- 요청과 관계없는 리팩터링, 파일 이동, 이름 변경, 포맷 전체 변경은 하지 않습니다.
- 기존에 사용 중인 패턴과 유틸리티가 있다면 새 구조를 추가하기 전에 우선 재사용합니다.
- 외부 의존성 추가는 꼭 필요한 경우에만 하며, 기존 방식으로 해결할 수 있는지 먼저 확인합니다.
- GitHub Actions 워크플로 수정이나 불필요한 CI 실행을 유발하는 변경은 요청이 없는 한 하지 않습니다.

## 문서 점검 및 변경 안전 원칙

- 문서 정리를 이유로 기존 아키텍처 결정, 게임 규칙, DB 계약, 진행 중인 Phase 정의를 임의로 변경하지 않습니다.
- 기준일, 기준 브랜치 또는 release version이 명시된 audit, plan, release 문서는 해당 시점의 이력으로 보존하며 현재 상태에 맞추기 위해 내용을 전면 재작성하지 않습니다.
- 루트 README나 영역별 README처럼 현재 상태를 설명하는 문서는 실제 코드, 테스트, workflow, migration 등으로 명백한 불일치가 확인된 경우에만 필요한 문구를 최소 수정합니다.
- 문서끼리 충돌하거나 어느 설명이 현재 기준인지 불명확하면 추측으로 하나를 선택하지 않고 기존 내용을 유지한 채 불일치와 확인 필요 사항을 보고합니다.
- 문서 이동, 삭제, 통합과 대규모 표현 통일은 별도 범위의 작업으로 취급합니다.

## Game Platform 신규 게임 필수 규칙

- `games/<game-id>/` 아래 신규 platform-native 게임을 생성하거나 수정하기 전에 반드시 `docs/game-platform-development-rules.md`와 `docs/game-platform-ui-rules.md`를 읽고 따릅니다.
- 사용자가 매번 Game Platform 규칙이나 UI 조사/설계 규칙을 다시 명시하지 않아도 두 문서를 신규 게임 작업의 기본 전제로 적용합니다.
- `games/shared/`의 현재 코드와 계약 테스트를 함께 확인하고, DB/RPC 작업이면 정식 계약 문서인 `docs/game-platform-db-test-contract.md`를 추가로 확인합니다.
- `docs/game-platform-strategy.md`와 `docs/game-platform-invite-analysis.md`는 배경/이력 참고 문서이며 신규 게임 작업의 필수 선행 문서로 취급하지 않습니다.
- Legacy 게임 소스는 참고 자료일 뿐 신규 게임의 기본 구조나 공통 계약으로 사용하지 않습니다.
- Legacy 보호 설명을 제외한 현재 Game Platform 공통 규칙·가이드·템플릿에는 특정 platform-native 게임명이나 그 게임만의 구현 세부사항을 기준 규칙으로 넣지 않습니다. 게임별 내용은 해당 게임의 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`, 게임별 테스트에 둡니다.
- 사용자가 새로운 게임 개발을 요청하면 gameplay/runtime 구현 전에 게임 규칙·제품 범위와 원본 디자인·구성물·Visual Identity·자산 사용 가능 범위를 조사하고 `games/<game-id>/GAME_SPEC.md`, `games/<game-id>/DEVELOPMENT.md`, `games/<game-id>/UI_DESIGN.md`, `games/<game-id>/UI_DECISIONS.md`를 먼저 생성합니다.
- 공개된 기존 보드게임을 구현하는 경우 공식 규칙서나 신뢰 가능한 규칙 출처를 우선 확인하고 `GAME_SPEC.md`에 출처와 해석 결정을 남깁니다. UI는 공식/퍼블리셔 자료와 실제 구성물을 조사하고 `UI_DESIGN.md`에 디자인 출처, 목표 판본, Visual Identity, 저작권·라이선스 판단과 구현 계획을 기록합니다. 확인되지 않은 규칙이나 자산 사용 권리는 추측하지 않습니다.
- `GAME_SPEC.md`는 현재 기능 규칙·구조의 기준, `DEVELOPMENT.md`는 기능 개발 진행·검증 인수인계, `UI_DESIGN.md`는 소스 개발 전 전수 조사·분석으로 수립한 초기 디자인 baseline, `UI_DECISIONS.md`는 개발 시작 후의 의미 있는 디자인 변경·대안·결정 이유·검증 이력과 baseline override를 기록합니다.
- bootstrap 단계에서는 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`만 있는 게임 디렉터리를 Registry 등록 전 상태로 둘 수 있습니다. 실제 runtime 파일을 추가하는 순간 Game Registry와 기존 platform-native 규칙을 함께 적용합니다.
- 각 platform-native 게임은 `games/<game-id>/DEVELOPMENT.md`를 기능 개발상태의 인수인계 문서로 유지하고, 디자인 개발의 진행·변경 이력은 `games/<game-id>/UI_DECISIONS.md`에 분리합니다.
- `UI_DECISIONS.md`에는 모든 CSS 수치 변경을 쌓지 않고, 다음 작업자가 현재 UI만 보고 복원하기 어려운 의미 있는 디자인/interaction 결정과 그 이유를 기록합니다. 개발 시작 후의 변경으로 `UI_DESIGN.md` baseline을 덮어쓰지 않으며, 같은 항목에서 충돌하면 최신 non-superseded `UI_DECISIONS.md`가 우선합니다.
- 기존 신규 게임 개발을 이어갈 때는 새 브랜치를 만들기 전에 해당 `DEVELOPMENT.md`와 진행 중 game-id 브랜치를 확인합니다. UI Phase를 이어갈 때는 반드시 `UI_DESIGN.md` baseline과 `UI_DECISIONS.md`의 최신 non-superseded 결정을 함께 읽고, 후속 결정이 초기 Phase보다 우선하도록 하며 이미 반영된 디자인을 원복하지 않습니다. 명확한 진행 중 checkpoint branch가 있으면 그 브랜치를 이어갑니다.
- 기능 구현과 자동 검증이 충분히 끝났다고 해서 디자인까지 완료된 것으로 처리하지 않습니다. release 전에는 `docs/game-platform-ui-rules.md`의 Developer Manual Design Review / Detail Polish 단계에서 개발자가 실제 브라우저로 플레이하며 디자인을 수동 검토하는 흐름을 적용합니다.
- 이 수동 리뷰에서 개발자가 요청한 여러 디테일 수정은 요청 횟수대로 기록하지 않고, 하나의 디자인 영역이 안정화되어 최종 방향이 확정될 때 의미 있는 decision 하나로 `UI_DECISIONS.md`에 기록합니다. 디자인 PR merge/close, 작업 브랜치 종료, release closeout 전에는 기록 누락이 없는지 확인합니다.
- 사용자가 `기능 체크포인트 기록하자`라고 요청하면 기능 개발 상태를 `DEVELOPMENT.md`에 기록하고, 기능 설계가 바뀐 경우에만 `GAME_SPEC.md`를 함께 정합화합니다. 디자인 문서는 이 명령 때문에 수정하지 않습니다.
- 사용자가 `디자인 체크포인트 기록하자`라고 요청하면 현재까지 안정화된 의미 있는 디자인 결정을 `UI_DECISIONS.md`에 기록합니다. 초기 `UI_DESIGN.md` baseline은 재작성하지 않고, 기능 진행 문서는 이 명령 때문에 수정하지 않습니다.
- 두 checkpoint 명령은 같은 요청에서 함께 사용할 수 있으며, 각각의 책임 문서만 갱신합니다. 접두어가 없는 일반적인 checkpoint 표현이나 새 채팅용 정리·문서·요약 요청은 공식 repository checkpoint 명령으로 자동 해석하지 않습니다. 유효한 현재 작업 브랜치가 있으면 그 브랜치에 commit하고, 없으면 저장소의 일반 브랜치 규칙에 따라 별도 작업 브랜치를 사용합니다.
- 두 사용자 명령과 별개로 기능 Phase 완료·release closeout의 `DEVELOPMENT.md` 갱신 시점과 디자인 lifecycle의 `UI_DECISIONS.md` 기록 트리거는 계속 적용합니다.
- 중간 checkpoint에서는 Phase를 완료 처리하지 않으며 실제 완료 항목, 미완료 항목, 다음 첫 작업, 검증 상태를 명확히 구분합니다.
- 모든 platform-native 게임은 로비 또는 시작 전 화면에서 처음 플레이하는 사용자도 이해할 수 있는 상세 규칙 안내를 제공하고, 플레이 중에도 다시 확인할 수 있는 진입점을 유지합니다.
- 모든 platform-native 게임은 진행 중 세션을 안전하게 끝낼 수 있는 명시적 게임 종료 경로를 제공하며, 온라인 멀티플레이 종료는 서버 권위와 확인 UI를 적용합니다.
- 모든 멀티플레이 platform-native 게임은 게임 종료 후 기존 room/player context를 유지하는 재대결 흐름을 기본 기능으로 제공하고, 참여 플레이어 준비 완료 후 방장이 다시 시작할 수 있어야 합니다. 세부 lifecycle과 서버 권위는 `docs/game-platform-development-rules.md`를 따릅니다.
- 하위 game-local/topic-owner 작업에서 현재 상위 Game Platform 규칙과 충돌하는 새 필요를 발견했다고 해서 바로 소스나 하위 규칙을 수정하지 않습니다. 먼저 기존 상위 규칙과 shared/runtime 경계를 확인하고, 사용자와의 토의에서 플랫폼 전반에 필요한 변경으로 명시적으로 합의된 경우에만 **Game Platform ARCHITECTURE CHANGE**로 승격합니다. 승격된 작업은 `docs/game-platform-development-rules.md`와 `docs/game-platform-governance.md`의 전파/영향도 감사 절차를 따릅니다.
- Game Platform CURRENT 규칙, shared 계약 또는 필수 lifecycle을 변경하는 작업은 현재 Registry의 모든 platform-native 게임을 전수 검토하고 각 게임을 `COMPLIANT` / `MIGRATION_REQUIRED` / `NOT_APPLICABLE`로 분류합니다. `IN_PROGRESS` 게임의 충돌은 release 전에 해소하고, `RELEASED` 게임은 별도 migration/follow-up 필요 여부를 작업 결과와 PR에 남깁니다.

## 작업 전 확인

- 작업 대상과 연관된 기존 코드와 주변 호출부를 먼저 확인합니다.
- `README.md`, 관련 문서, 기존 테스트 및 설정 파일을 참고하여 프로젝트의 현재 동작을 파악합니다.
- `package.json`에 정의된 명령을 우선 사용하고 존재하지 않는 lint/typecheck 명령을 임의로 만들지 않습니다.

## 설치 및 검증

의존성 설치가 필요한 경우 기본적으로 다음 명령을 사용합니다.

```bash
npm ci
```

현재 루트 `package.json`에서 사용할 수 있는 주요 검증 명령은 다음과 같습니다.

```bash
npm run build:assets
npm run test:e2e
npm run test:game-platform
npm run test:the-game
npm run test:marble
```

- 변경 범위와 관련된 테스트, build 및 기타 검증을 실행합니다.
- 테스트가 존재하는 기능을 수정했다면 해당 테스트를 반드시 실행합니다.
- 오류가 발생하면 원인을 분석하여 필요한 수정을 한 뒤 다시 검증합니다.
- Playwright 등 환경 의존성 때문에 실행할 수 없는 검증이 있다면 실패 원인과 미실행 항목을 작업 결과에 명확히 기록합니다.
- 코드 변경이 없는 문서 전용 작업은 불필요한 전체 테스트 실행을 생략할 수 있으나, 변경 파일과 diff가 의도한 범위인지 확인합니다.

## 작업 완료 보고

작업 완료 시 다음 내용을 간결하게 정리합니다.

- 변경한 파일
- 각 변경의 이유
- 수행한 테스트, lint, typecheck, build 및 결과
- 실행하지 못한 검증과 그 이유
- 남아 있는 주의사항 또는 후속 작업

모든 변경사항을 작업 브랜치에 commit하고 Pull Request를 생성합니다. `main` 병합은 사용자의 명시적 승인이 있을 때만 진행합니다.