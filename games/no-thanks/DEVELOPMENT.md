# No Thanks! Development

> 이 문서는 현재 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다.
> 게임 규칙과 구현 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다.

## Current Status

- Phase: Bootstrap
- Status: IN_PROGRESS
- Active branch: `feature/no-thanks-game-20260921`
- Last checkpoint: 2026-09-21

## Completed

- 최신 `main` 기준 작업 브랜치 생성
- 저장소 `AGENTS.md` 및 Game Platform 신규 게임 개발 규칙 확인
- `games/shared/` 공통 계약 및 DB/Test Contract 확인
- AMIGO 공식 No Thanks! 최신 영문 규칙 확인
- v1을 3–7인 classic base game으로 확정
- 2024 재판의 22장 special-card expansion은 후속 Phase로 분리
- 공식 규칙의 hidden counter를 viewer-private snapshot 요구사항으로 반영
- 온라인 환경의 선 플레이어 결정은 server-random digital adaptation으로 확정
- gameplay state / authority / privacy / validation 방향 정의

## Current Work

- bootstrap 명세를 repository에 고정하고 governance 기준을 검증하는 단계

## Next Work

1. `games/no-thanks/rules.js` deterministic rules engine 구현
2. initial counter / refuse / take / turn / scoring / tie unit test 추가
3. runtime 파일이 시작되는 같은 변경에서 Game Registry에 `no-thanks` 등록
4. capability는 실제 제공 전까지 모두 false 유지
5. 이후 Approved Member Access Gate + Common Game Shell 최소 runtime 연결

## Decisions

- Game id: `no-thanks`
- v1 players: 3–7명
- v1 rules: classic base game only
- number cards: 3–35
- setup: 33장 중 9장 비공개 제외, 24장 사용
- initial counters: 3–5인 11개 / 6인 9개 / 7인 7개
- player counter count: 다른 플레이어에게 비공개
- current card 위 center counter 수: 공개
- acquired number cards: 공개
- take 후 같은 플레이어가 다음 카드를 계속 처리
- refuse 후 다음 플레이어로 turn 이동
- counter 0이면 take 강제
- scoring: 연속 숫자 chain의 최저값만 합산 후 남은 counter 수 차감
- 최저 점수 동점은 공동 승리
- first player: server-random digital adaptation
- deck shuffle / excluded cards / draw order / counter legality / score는 server authoritative
- special cards: deferred
- game-local nickname UI: 없음

## Validation

- Completed:
  - 공식 AMIGO rulebook과 AMIGO product page 규칙 교차 확인
  - Game Platform Development Rules 확인
  - Game Platform DB/Test Contract 확인
  - Released reference인 Can’t Stop의 bootstrap / rules-engine 진행 방식 확인
- Pending:
  - Game Platform governance/unit test
  - rules engine unit test
  - runtime syntax / shell test
  - disposable Supabase DB integration
  - browser multiplayer smoke

## Known Issues / Deferred

- 아직 runtime 파일, Registry 등록, DB migration, RPC, production 변경은 없습니다.
- 게임 목록에는 노출하지 않습니다.
- special-card expansion은 classic v1 이후 별도 설계가 필요합니다.
- 진행 중 player leave/host leave/rematch 정책은 authoritative Room/Lobby 설계 단계에서 확정합니다.
- 현재 브랜치는 bootstrap 시작 브랜치이며 main에는 병합하지 않습니다.

## Release closeout 안내

게임을 production에 공개해 `Status: RELEASED`로 전환할 때는 이 안내 섹션을 실제 날짜가 있는 release 기록으로 교체합니다.

```text
## Release — YYYY-MM-DD

- production activation / migration 요약
- 현재 Registry capability
- 핵심 검증 결과
- 유지보수 baseline 및 남은 관찰 항목
```

`RELEASED` 상태에서는 `Active branch: main`을 사용하고, 과거 feature branch를 현재 기준으로 남기지 않습니다.
