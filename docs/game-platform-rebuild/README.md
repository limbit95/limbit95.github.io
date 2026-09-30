# Game Platform vNext 재구축 진행 기록

이 디렉토리는 `game_platform_vnext_final_execution_plan.md` 개정 1.2에 따른 **플랫폼 재구축 작업의 인수인계 기록**이다.

게임별 `DEVELOPMENT.md` / `UI_DECISIONS.md` checkpoint와 별개이며, 이 디렉토리의 기록은 기존 게임의 기능·디자인 상태를 대신하지 않는다.

## 단일 기준과 읽기 순서

새 채팅이나 새 작업자는 다음 순서로 복원한다.

1. 루트 `AGENTS.md`
2. 루트 `game_platform_vnext_final_execution_plan.md`
3. 이 `README.md`
4. `CURRENT.md`
5. `CURRENT.md`가 가리키는 최신 `checkpoints/CP-....md`
6. 필요 시 `DECISIONS.md`
7. 현재 단계가 연결한 `artifacts/` 산출물과 관련 source/test

`main`의 기록만으로 마지막 상태를 확정하지 않는다. `game-platform-vnext` root-slug를 공유하는 진행 중 브랜치와 열린 PR이 있으면 active branch, checkpoint ID, commit 계보와 PR 상태를 대조한다.

## 사용자 명령

### `작업 진행 기록하자`

현재 플랫폼 재구축 작업을 완료 처리하지 않고 중간 checkpoint로 저장한다.

- 완료/미완료
- 현재 결정과 유지할 경계
- 검증/미실행
- 유효 브랜치/PR
- 다음 첫 작업
- 원격 보존 여부

를 기록하고, `CURRENT.md` 포인터를 함께 갱신한다.

### `다시 이어서 시작하자`

과거 채팅 기억에 의존하지 않고 위 읽기 순서와 실제 Git 상태를 대조한다. 검토/승인 대기 상태를 승인으로 간주하지 않으며, 기록에서 허용된 미완료 작업 또는 승인된 다음 STEP만 진행한다.

## 브랜치 탐색 기준

- 작업 root-slug: `game-platform-vnext`
- 단계별 브랜치 예: `docs/game-platform-vnext-phase0-bootstrap`
- 채팅방 변경만으로 새 브랜치를 만들지 않는다.
- 유효한 미완료 작업 브랜치가 있으면 그 브랜치를 이어간다.
- `main` 직접 commit/push 또는 사용자 승인 없는 PR merge는 금지한다.

## 기록 파일

- `CURRENT.md`: 현재 상태의 단일 요약
- `DECISIONS.md`: 누적 결정과 대체 관계
- `checkpoints/`: 단계 시작/완료/중간 기록
- `artifacts/`: 감사표, 계승표, matrix, Target 설계, 중요 검증 근거

루트 실행 계획이 목표·범위·순서·통과 기준을 소유한다. 이 디렉토리의 기록은 계획을 묵시적으로 변경하지 않는다.
