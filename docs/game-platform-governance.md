# Game Platform Governance Guard

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

- `games/<game-id>/` 디렉터리가 있는데 shared Game Registry 등록이 없는 경우
- shared Game Registry에 등록했지만 실제 `games/<game-id>/` 디렉터리가 없는 경우
- online shared 게임인데 `tests/game-db-integration/<game-id>.test.js`가 없는 경우
- 새 platform-native 게임 디렉터리를 추가하면서 Registry를 같은 PR에서 갱신하지 않은 경우
- Legacy 런타임과 Game Platform 런타임을 같은 PR에서 함께 수정한 경우
- 새 `games/shared/*.js` 모듈을 추가하면서 Game Platform 계약 테스트 또는 관련 문서를 함께 갱신하지 않은 경우

## 자동으로 검증하지만 과도하게 강제하지 않는 것

기존 `games/shared/` 모듈 수정은 매번 새 테스트 파일이나 문서 변경을 강제하지 않는다. 대신 전용 workflow가 기존 `npm run test:game-platform` 전체를 실행해 회귀를 확인한다.

이 방식은 단순 버그 수정이나 내부 구현 개선까지 문서 변경을 강제해 개발 속도를 떨어뜨리는 것을 피하기 위한 것이다.

## 문서 권위 연결

`docs/game-platform-development-rules.md`가 저장소에 존재하는 경우 Governance Guard는 다음 문서가 규칙서를 명시적으로 참조하는지 확인한다.

- `AGENTS.md`
- `games/README.md`
- `docs/game-platform-strategy.md`
- `docs/game-platform-invite-analysis.md`

따라서 규칙서가 main에 들어온 이후 문서 권위 관계가 우연히 끊어지는 것도 자동으로 감지한다.

## Legacy 경계

Governance Guard는 Liar Game, Drawing Spy, The Game, Marble을 새 플랫폼 규칙으로 마이그레이션하지 않는다.

다만 신규 Game Platform 런타임 변경과 Legacy 런타임 변경이 한 PR에 섞이는 경우에는 작업 범위를 분리하도록 차단한다.

## GitHub Actions 사용량

workflow는 `pull_request`에만 반응하고 Game Platform 관련 경로가 바뀐 경우에만 실행한다. 별도 `push` 실행이나 전체 사이트 workflow 복제는 하지 않는다.

검증은 Node 기본 기능과 기존 Game Platform 테스트만 사용하므로 별도 `npm ci` 단계도 추가하지 않는다.
