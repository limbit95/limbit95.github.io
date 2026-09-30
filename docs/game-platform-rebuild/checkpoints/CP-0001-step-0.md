# CP-0001 — STEP 0 기준선/진행 기록 bootstrap

- checkpoint ID: `CP-0001-step-0`
- 작성 시각: `2026-09-30T16:27:00+09:00`
- 단계: **STEP 0 — 기준선 고정과 진행 기록 체계 구축**
- 단계 상태: **REVIEW_PENDING**
- 계획: `/game_platform_vnext_final_execution_plan.md` 개정 1.2
- 계획 blob SHA: `cbfbe00a4ce66805e40f097b64f670911b4edeb1`
- 작업 root-slug: `game-platform-vnext`

## 소스 위치

- 계획의 이전 대조 기준 main: `c6b1e31b3fefef2c20a7a0f5841c5a16c996a559`
- STEP 0 착수 main: `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`
- active branch: `docs/game-platform-vnext-phase0-bootstrap`
- checkpoint 저장 직전 작업 HEAD: `d2ca8b9bb3cac44be06a8020a32827a55930e5d6`
- PR: **#404**
- PR base/head: `main` ← `docs/game-platform-vnext-phase0-bootstrap`
- merge 상태: **미병합 / 사용자 승인 대기**

## 기준 SHA 이후 차이

`c6b1e31b3fefef2c20a7a0f5841c5a16c996a559...main` 비교 결과:

- ahead by: 1 commit
- 추가 파일: `game_platform_vnext_final_execution_plan.md` 1개
- 기존 Game Platform 규칙 문서 변경: 없음
- `games/shared/` 변경: 없음
- Registry 변경: 없음
- Guard 변경: 없음
- 테스트/CI 계약 변경: 없음
- 기존 게임 출시 상태 변경: 없음

따라서 STEP 0의 최신 기준은 계획 원문이 저장소 루트에 추가된 `69a7fcb...`이며, 기존 아키텍처/공통 구현에 대한 새로운 변경 가정은 없다.

## STEP 0에서 완료한 항목

1. 최신 `main`, 기준 SHA 이후 diff, open PR, 기존 `game-platform-vnext` 브랜치를 확인했다.
2. 기존 open PR과 동일 root-slug 진행 브랜치는 착수 시점에 없음을 확인했다.
3. `docs/game-platform-rebuild/` 기록 진입점과 CURRENT/DECISIONS/artifacts index를 생성했다.
4. 22개 검토 지점을 초기화하고 STEP 0만 `REVIEW_PENDING`, 나머지는 `NOT_STARTED`로 두었다.
5. 루트 `AGENTS.md`에 두 재개 명령과 실제 기록 탐색 순서를 연결했다.
6. 루트 `README.md`에 실행 계획과 기록 디렉토리 진입 링크를 추가했다.
7. STEP 0 문서 bootstrap을 별도 브랜치/PR #404로 제출했다.
8. 게임 코드, DB/RPC, Registry, Guard, 테스트, runtime, 아키텍처 계약은 수정하지 않았다.

## 유지 결정과 범위

실행 계획 1.2에서 이미 확정된 다음 경계를 그대로 유지한다.

- 하나의 통합 게임 플랫폼 아키텍처
- 기존 플랫폼 개발/품질/보드게임 규칙의 조항별 계승
- 기존 구현 게임 무이관
- 물리 코드 배치는 STEP 6 전 선결정하지 않음
- 공통 runtime 구현은 Target 동결 전 시작하지 않음

이 checkpoint는 위 결정을 새로 만드는 것이 아니라 STEP 0 착수 기준으로 고정한다.

## STEP 9B 실행 주의사항

사전 검토에서 아래 내용을 **실행 계획 1.2의 해석상 경계**로 확인했다. 새로운 Architecture Decision으로 취급하지 않는다.

> STEP 9B의 추가 구현 허용은 이미 검토된 계약의 구현에 한정한다. 기존 계약으로 표현할 수 없는 새로운 공통 의미나 책임이 발견되면 구현을 즉시 확장하지 않는다.
>
> 먼저 기존 모델로 표현 가능한지, Game-local 책임인지, Capability인지, 새로운 Runtime Model이 필요한지, Core 계약 변경이 필요한지를 구분한다.
>
> 새로운 공통 계약·Runtime Model 의미·Core 책임을 정의해야 하는 경우에는 영향을 받는 관련 설계 STEP으로 돌아가 검토하고, 필요한 범위에서 STEP 6 Target 동결 검토를 다시 거친 뒤 구현한다.
>
> Game-local이나 Capability는 공통 수명·권한·모델 계약을 우회하기 위한 수단으로 사용하지 않는다.

`DECISIONS.md`에는 이 내용을 새 결정으로 추가하지 않았다.

## 검증

| 검증 | 결과 |
|---|---|
| 최신 main 확인 | PASS — `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09` |
| 기준 SHA 이후 compare | PASS — 계획 파일 1개 추가만 확인 |
| 착수 시 open PR 확인 | PASS — 없음 |
| 착수 시 동일 root-slug branch 확인 | PASS — 없음 |
| 변경 범위 확인 | PASS — 문서/기록/재개 안내만 |
| 전체 테스트 | NOT_RUN — 문서 전용 bootstrap이며 코드/계약 변경 없음 |
| 새 채팅 관점 기록 탐색 재현 | PENDING — checkpoint 원격 생성 후 read-back으로 확인 |
| 원격 보존 | PENDING — checkpoint 생성 후 branch/PR에서 read-back 확인 |

## 기존 게임 영향도

- 기존 게임 코드 변경: **없음**
- 기존 게임 문서 변경: **없음**
- 기존 게임 Registry/공개 상태 변경: **없음**
- 기존 DB/RPC 변경: **없음**
- 기존 공통 runtime 계약 변경: **없음**

STEP 0의 영향도는 인수인계 링크와 기록 파일 추가로 한정된다.

## 미완료 / 승인 상태

- STEP 0 산출물의 사용자 검토: **미완료**
- PR #404 merge 승인: **없음**
- STEP 0 merge: **미수행**
- STEP 1 시작 승인: **없음**

따라서 STEP 0은 `COMPLETED`가 아니라 `REVIEW_PENDING`이다.

## 다음 첫 작업

**사용자가 STEP 0 산출물과 PR #404를 검토한다.**

검토/수정/merge 승인 없이 STEP 1을 시작하지 않는다.
