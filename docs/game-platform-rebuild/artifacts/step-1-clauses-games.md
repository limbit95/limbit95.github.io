# STEP 1 조항별 계승표 — 기존 두 게임의 규칙·기록·디자인

감사 기준 commit: `132ec1576e316d0238c9ca6e07d0d3ab91950ec8`. 이 파일은 STEP 1 감사 산출물이며 CURRENT 규칙을 대체하지 않는다.

[읽는 법·분류·증거 코드·집계](step-1-clause-succession-table.md). `K` 원 범위/강도 계승, `L` 기존 게임 안에서 보존, `H` 과거 기록 보존, `I` 설명/예시/범위 밖/작업 제어. 모든 새 책임 문서·절은 **미정(STEP 6)**이며 아래 분류는 소유 위치 설계가 아니다.

원문은 목록/문단/표의 행/코드 블록 단위로 고정한다. 원문의 부정·조건·예외를 삭제하지 않는다. 절 제목과 같은 절의 도입문, 부모 항목을 함께 읽는다. 서술형은 임의로 MUST나 SHOULD로 환산하지 않는다. 동일 의미의 반복도 서로 다른 원문 ID로 남긴다.

## CS-SPEC — `games/cant-stop/GAME_SPEC.md`

- source: [games/cant-stop/GAME_SPEC.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/GAME_SPEC.md)
- blob: `8c28edf2c84b351a7ddbc0504c37df2e79b962e4`; 원문 350줄; 상태 `GAME_LOCAL`; 236 관리단위 / 174 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### Can't Stop Game Spec

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-001 · L3–6 | &gt; Phase 4에서 Game Platform을 처음 실제 신규 게임에 적용해 v1까지 출시한 기준 명세입니다.<br>&gt; bootstrap 당시의 설계 의도와 최종 구현 결정을 함께 보존하되, 현재 동작과 충돌하는 미완료 표현은 release 기준으로 갱신합니다.<br>&gt; UI/presentation은 같은 디렉터리의 `UI_DESIGN.md` adoption baseline과 이후 `UI_DECISIONS.md`의 최신 non-superseded 변경 결정을 함께 적용합니다.<br>&gt; 실제 기능 구현 진행과 검증 상태는 같은 디렉터리의 `DEVELOPMENT.md`에서 관리합니다. | 표현:검증 | LOCAL_RULE / L | E-CS | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Game Overview

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-002 · L10–10 | - Game id: `cant-stop` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-003 · L11–11 | - Designer: Sid Sackson | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-004 · L12–12 | - Players: 2–4명 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-005 · L13–13 | - Release status: v1 RELEASED (2026-09-21) | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-006 · L14–14 | - Platform status: first production `platform: "shared"` game, `online=true`, `invite=true` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-007 · L15–15 | - Core loop: 네 개의 주사위를 두 쌍으로 나눠 2–12 열을 전진하고, 현재 턴의 임시 진척을 확정할지 더 굴릴지 선택하는 push-your-luck 게임 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-008 · L16–16 | - Win condition: 서로 다른 세 개의 열을 먼저 claim한 플레이어가 승리 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-009 · L17–17 | - Board: 2–12의 11개 열 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | C02/F03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-010 · L18–18 | - Column heights: `2:3, 3:5, 4:7, 5:9, 6:11, 7:13, 8:11, 9:9, 10:7, 11:5, 12:3` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Rules and Sources

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-011 · L22–22 | 구현 기준은 다음 자료를 교차 확인한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-012 · L24–24 | - Can't Stop rulebook PDF: https://cdn.1j1ju.com/medias/d8/88/07-cant-stop-rulebook.pdf | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-013 · L25–25 | - Board Game Arena rules summary: https://boardgamearena.com/gamepanel?game=cantstop | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-014 · L26–26 | - BoardGameGeek game page: https://boardgamegeek.com/boardgame/41/cant-stop | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-015 · L27–27 | - Column length cross-check: https://en.wikipedia.org/wiki/Can%27t_Stop_%28board_game%29 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-016 · L29–29 | 현재 구현 기준으로 정리한 핵심 규칙: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-017 · L31–31 | 1. 턴 시작 시 최대 세 개의 neutral runner를 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-018 · L32–32 | 2. 네 개의 d6를 굴리고, 두 개씩 짝지은 두 합을 하나의 pairing으로 선택한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-019 · L33–33 | 3. 한 roll에는 최대 세 가지 pairing이 존재하며 같은 두 합을 만드는 중복 pairing은 하나의 선택지로 취급할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-020 · L34–34 | 4. 선택한 pairing의 각 합은 해당 열의 runner를 한 칸 전진시키거나, 빈 runner가 있으면 그 열에 새 runner를 놓는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-021 · L35–35 | 5. 새 runner는 해당 플레이어의 이전 permanent progress 바로 다음 칸에서 시작하며, 이전 진척이 없으면 열의 첫 칸에서 시작한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-022 · L36–36 | 6. 한 턴에 runner가 존재할 수 있는 열은 최대 세 개이며, 이미 세 열을 사용 중이면 새 열을 열 수 없다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-023 · L37–37 | 7. 선택한 pairing 안에서 합 하나만 합법적으로 움직일 수 있는 경우 한 번만 전진하는 것은 허용된다. 합법적인 이동을 임의로 버리지는 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-024 · L38–38 | 8. 두 합이 같은 열이면 같은 runner를 순차적으로 두 번 전진할 수 있다. 두 번째 이동 시점에 더 전진할 수 없다면 가능한 이동만 적용한다. | 표현:할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-025 · L39–39 | 9. 이미 claim된 열은 모든 플레이어에게 닫혀 있고 이후 roll의 합으로 사용할 수 없다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-026 · L40–40 | 10. runner가 열의 top에 도달한 뒤에도 플레이어는 더 굴릴 수 있지만 그 runner 자체는 더 전진할 수 없다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-027 · L41–41 | 11. 어떤 pairing으로도 runner를 하나 이상 합법적으로 전진/배치할 수 없으면 bust다. 해당 턴의 모든 임시 진척을 잃고 다음 플레이어로 넘어간다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-028 · L42–42 | 12. 성공적으로 이동한 뒤 플레이어는 다시 굴리거나 stop을 선택한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-029 · L43–43 | 13. stop하면 runner 위치를 자신의 permanent progress로 확정한다. top에 도달한 열은 그 시점에 claim되고 다른 플레이어의 해당 열 진척은 제거된다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-030 · L44–44 | 14. 세 번째 열을 claim한 stop 처리와 함께 게임이 종료된다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-031 · L45–45 | 15. 다른 플레이어의 permanent marker와 같은 칸을 공유하는 것은 허용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-032 · L47–47 | 청파 같이 구현에서는 사전 주사위로 선 플레이어를 정하지 않는다. 게임 시작 RPC가 서버에서 플레이어 순서를 한 번 무작위로 확정하고 authoritative game state에 저장한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Rules and Sources > Rules Audit — 2026-09-20

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-033 · L51–51 | 정식 기본 규칙과 pure JS rules engine, 운영 Supabase의 `private.cant_stop_legal_pairings` / `private.cant_stop_commit_stop` 계산을 대조했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-034 · L53–53 | 감사에서 확인한 엣지 케이스: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-035 · L55–55 | - runner 두 개 사용 중이고 남은 한 자리로 두 새 열 중 하나만 열 수 있을 때 두 single plan을 모두 허용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-036 · L56–56 | - runner 두 개 사용 중이며 기존 열 + 새 열을 함께 움직일 수 있으면 두 이동을 모두 강제 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-037 · L57–57 | - runner 세 개를 이미 사용 중이면 새 열은 막고 기존 runner 이동만 허용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-038 · L58–58 | - 한 합이 claim된 열이면 다른 합만 합법적으로 움직일 수 있을 때 single move 허용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-039 · L59–59 | - 같은 합 두 번에서 정상까지 한 칸만 남았으면 가능한 한 칸만 이동 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-040 · L60–60 | - runner가 이미 정상에 있어 더 못 움직여도 다른 합이 합법이면 다른 합 이동 허용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-041 · L61–61 | - 모든 가능한 합이 정상/runner 제한/claim으로 막히면 bust | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-042 · L62–62 | - 정상 도달은 즉시 claim이 아니며 stop 전 bust 시 해당 정상 도달도 소멸 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-043 · L63–63 | - 한 번의 stop에서 여러 열을 동시에 claim 가능 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-044 · L64–64 | - 기존 두 claim + 두 동시 claim처럼 세 개를 넘어도 `claimedCount &gt;= 3`으로 즉시 승리 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-045 · L65–65 | - claim 전에는 서로 다른 플레이어의 permanent marker가 같은 칸에 공존 가능 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-046 · L66–66 | - claim 시에만 다른 플레이어의 해당 열 progress 제거 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-047 · L68–68 | 감사 결과 core gameplay 규칙 차이는 발견되지 않았다. 정식 규칙서와 다른 의도적 digital adaptation은 **게임 시작 순서 결정**뿐이다. 규칙서는 선 플레이어를 별도 방식으로 정한 뒤 좌석 순서로 진행하지만, 청파 같이 버전은 온라인 좌석에 물리적 의미가 없으므로 서버가 전체 turn order를 한 번 무작위 확정하고 이후 그 순서를 순환한다. 이 차이는 pairing / runner / bust / stop / claim / 승리 규칙에는 영향을 주지 않는다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-048 · L70–70 | 사용자용 규칙은 `rulesHelp.js`의 상세 가이드를 로비와 실제 플레이 화면에서 modal로 제공한다. 처음 플레이하는 사용자가 외부 검색 없이 목표, 열 높이, 주사위 pairing, runner 제한, stop, bust, claim, 승리, 수동 종료까지 이해할 수 있는 수준을 유지한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Product Scope > Included

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-049 · L76–76 | - 2–4인 online multiplayer | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-050 · L77–77 | - 표준 2–12 / 11열 board | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-051 · L78–78 | - 네 개의 d6와 세 runner | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-052 · L79–79 | - pairing 선택 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-053 · L80–80 | - roll again / stop 흐름 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-054 · L81–81 | - bust | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-055 · L82–82 | - column claim | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-056 · L83–83 | - 세 열 claim 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-057 · L84–84 | - Approved Member 기반 Room/Lobby | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-058 · L85–85 | - authoritative snapshot / reconnect | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-059 · L86–86 | - online core 안정화 이후 platform-native Invite | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-060 · L87–87 | - 로비/플레이 중 상세 게임 규칙 modal | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-061 · L88–88 | - 방장 권한의 authoritative 수동 게임 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-062 · L89–89 | - 설산 등반 테마 보드, 2.5D 주사위 롤링, bust 미끄러짐 피드백 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Product Scope > Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-063 · L93–93 | - 고급 통계/확률 힌트 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-064 · L94–94 | - 관전자 모드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-065 · L95–95 | - turn timer | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-066 · L96–96 | - AI/bot | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-067 · L97–97 | - 변형 규칙 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-068 · L98–98 | - 랭킹/전적 시스템 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-069 · L99–99 | - 물리 엔진 기반 고급 3D 주사위/보드 연출 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Product Scope > Not planned for initial version

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-070 · L103–103 | - 원본 판본의 아트워크나 상표 디자인 복제 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-071 · L104–104 | - Legacy 게임 코드 재사용 또는 마이그레이션 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### State Machine

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-072 · L108–123 | ```text<br>LOBBY<br>→ TURN_ROLL<br>→ PAIRING_SELECTION<br>→ PUSH_OR_STOP<br>   ├─ roll again → TURN_ROLL<br>   └─ stop → COMMIT_PROGRESS<br>                ├─ winner → GAME_OVER<br>                └─ next player → TURN_ROLL<br><br>TURN_ROLL<br>└─ no legal pairing → BUST → next player → TURN_ROLL<br><br>TURN_ROLL / PAIRING_SELECTION / PUSH_OR_STOP<br>└─ host manual end → GAME_OVER(endReason = MANUAL, winnerId = null)<br>``` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-073 · L125–125 | - `TURN_ROLL`: 현재 플레이어만 roll intent를 보낼 수 있다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-074 · L126–126 | - `PAIRING_SELECTION`: 서버가 주사위 결과에서 계산한 legal pairing과 그 pairing에 속한 legal move plan만 선택 가능하다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-075 · L127–127 | - `PUSH_OR_STOP`: pairing 적용 이후 현재 플레이어가 다시 roll하거나 stop한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-076 · L128–128 | - `COMMIT_PROGRESS`: 임시 runner를 permanent progress로 확정하고 claim/win을 계산한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-077 · L129–129 | - `BUST`: 임시 진척을 폐기하고 permanent state는 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-078 · L130–130 | - `GAME_OVER`: 일반 gameplay action을 더 받지 않는다. 승리 종료 또는 방장 수동 종료 뒤 leave/rematch lifecycle로 이동한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Domain Model

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-079 · L134–134 | - `columns`: number, height, claimedBy | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-080 · L135–135 | - `players`: player id, 서버가 게임 시작 시 무작위로 확정한 turn order, column별 permanent progress, claimed columns | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-081 · L136–136 | - `turn`: activePlayerId, 최대 세 개의 runner positions, latest dice, legal pairings + legal move plans, phase | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-082 · L137–137 | - `game`: status, version, winnerId, endReason, endedById, turn index | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-083 · L139–139 | pairing은 주사위 인덱스 조합보다 최종 두 합을 canonical form으로 저장한다. 동일한 합 조합은 선택지에서 중복 제거하되, 같은 합 두 개는 `&#91;7, 7&#93;`처럼 두 번의 이동 가능성을 보존한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-084 · L141–141 | pairing 하나가 항상 하나의 이동 결과를 뜻하지는 않는다. neutral runner 자리가 하나만 남았는데 두 합이 모두 새 열인 경우처럼 두 합을 모두 사용할 수 없지만 각각 하나씩은 사용할 수 있다면, 해당 pairing은 `plans: &#91;&#91;sumA&#93;, &#91;sumB&#93;&#93;`처럼 여러 legal move plan을 가진다. 두 합을 모두 사용할 수 있다면 반드시 두 이동을 적용하는 plan만 허용한다. | 표현:반드시,할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-085 · L143–143 | 게임 규칙 계산은 pure deterministic function 중심으로 분리해 같은 입력 snapshot + action이 같은 결과를 만들게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Platform Boundary > SHARED 재사용

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-086 · L149–149 | - Game Registry | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-087 · L150–150 | - Approved Member / Access Gate | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-088 · L151–151 | - Room/Lobby adapter | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-089 · L152–152 | - Versioned / Idempotent Action envelope | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-090 · L153–153 | - Snapshot Coordinator | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-091 · L154–154 | - Reconnect refresh trigger | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-092 · L155–155 | - Common Game Shell / connection state / roster | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-093 · L156–156 | - platform-native `game_room` Invite | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-094 · L157–157 | - DB/Test Contract gate | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Platform Boundary > GAME-LOCAL 유지

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-095 · L161–161 | - 11개 column 구조와 높이 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | C02/F03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-096 · L162–162 | - 네 주사위 pairing 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-097 · L163–163 | - runner 최대 3개 규칙 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-098 · L164–164 | - legal pairing 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-099 · L165–165 | - roll / pairing / push / stop / bust 상태 머신 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-100 · L166–166 | - column claim과 승리 판정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-101 · L167–167 | - Can't Stop board UI와 주사위/runner 연출 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-102 · L169–169 | Can’t Stop 구현 편의를 위해 shared API에 pairing, dice, runner 같은 개념을 추가하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Authority and Persistence

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-103 · L173–173 | online version의 최종 권위는 서버 RPC와 DB state다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-104 · L175–175 | 서버가 최종 결정하는 항목: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-105 · L177–177 | - 방 생성/참가 시 표시할 플레이어 닉네임은 클라이언트 입력값이 아니라 사이트 `profiles.display_name`으로 확정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-106 · L178–178 | - 실제 주사위 네 개의 결과 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-107 · L179–179 | - 가능한 pairing 목록과 선택 유효성 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-108 · L180–180 | - runner 이동 가능 여부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-109 · L181–181 | - bust 여부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-110 · L182–182 | - stop commit | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-111 · L183–183 | - column claim | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-112 · L184–184 | - 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-113 · L185–185 | - 게임 시작 시 최초 turn order 무작위 확정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-114 · L186–186 | - turn 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-115 · L187–187 | - 방장 수동 게임 종료 권한과 terminal state | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-116 · L188–188 | - room/game version 증가 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-117 · L190–190 | 클라이언트는 `roll_dice`, `choose_pairing`, `continue_turn`, `stop_turn`, `end_game` 같은 intent만 보낸다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-118 · L192–192 | `roll_dice`는 클라이언트가 dice 값을 전달하지 않는다. 서버 RPC가 네 개의 d6를 생성하고 현재 authoritative `claimedColumns`, `runners`, `playerProgress`를 기준으로 legal pairing / legal move plan을 계산한다. legal pairing이 하나도 없으면 같은 transaction 안에서 bust 처리와 다음 turn 전환까지 수행한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-119 · L194–194 | `choose_pairing`은 클라이언트가 `sums`와 실제 적용할 `columns` plan을 선택해 보내되, 서버가 직전 roll snapshot에 저장한 `legalPairings&#91;&#93;.plans`와 정확히 일치하는 선택만 허용한다. 서버는 선택된 plan을 다시 simulation해 runner 위치를 계산하고 `PUSH_OR_STOP`으로 전환한다. 같은 `clientActionId`를 다른 pairing payload로 재사용하면 replay로 인정하지 않고 conflict로 거부한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-120 · L196–196 | `continue_turn`은 `PUSH_OR_STOP`에서 현재 runner를 그대로 유지하고 `latestDice`와 `legalPairings`만 초기화해 같은 active player의 `TURN_ROLL`로 돌아간다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-121 · L198–198 | `stop_turn`은 현재 runner 위치를 active player의 `playerProgress`에 commit한다. top에 도달한 runner는 해당 column을 claim하고 다른 플레이어의 같은 column progress를 삭제한다. active player의 claim이 세 개 이상이면 `GAME_OVER`와 `winnerId`를 기록하고, 아니면 runner/roll 상태를 비운 뒤 다음 player의 `TURN_ROLL`로 전환한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-122 · L200–200 | `end_game`은 진행 중 게임의 방장만 호출할 수 있다. 서버는 현재 room/version/member/host를 다시 검증하고 `GAME_OVER`, `winnerId = null`, `endReason = MANUAL`을 기록한다. 종료 뒤에는 기존 GAME_OVER leave/rematch 흐름을 그대로 재사용한다. | 표현:검증,할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-123 · L202–202 | state-changing action은 공통 envelope의 `expectedVersion`과 `clientActionId`를 사용한다. 동일 action 재전송은 두 번 적용되지 않아야 하고 같은 version을 기준으로 충돌하는 action은 하나만 authoritative commit되어야 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-124 · L204–204 | authoritative snapshot에는 보드, 모든 플레이어의 공개 진척, 현재 runner, 공개된 dice, 현재 phase, turn, claimed columns, winner와 `version`을 포함한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-125 · L206–206 | Can’t Stop에는 상대에게 숨겨야 하는 hand/role 같은 gameplay private state가 없다. DB/Test Contract의 private-state 시나리오는 "노출될 private gameplay state 자체가 없음"을 명시적으로 검증한다. | 표현:검증 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-126 · L208–208 | Realtime은 snapshot 교체 데이터가 아니라 invalidation 신호로만 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-127 · L210–210 | 클라이언트의 시각 연출은 authoritative snapshot을 변경하지 않는다. 주사위 roll이나 bust처럼 짧은 presentation이 필요한 경우 서버 응답 snapshot을 잠시 보류하고 기존 snapshot으로 애니메이션을 끝낸 뒤 최신 snapshot을 화면에 적용한다. 서버 결과 자체를 지연하거나 재계산하지 않으며, presentation 완료 후에는 항상 가장 최신 authoritative snapshot으로 수렴한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-128 · L212–212 | Room/Lobby foundation은 다음 game-local DB 객체를 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-129 · L214–214 | - `public.cant_stop_rooms`: room identity, host, status, max players, authoritative `version`, game state | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-130 · L215–215 | - `public.cant_stop_room_players`: room membership, seat, nickname, ready state | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-131 · L216–216 | - `public.cant_stop_room_actions`: `client_action_id` 기반 lobby action replay/idempotency 기록 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-132 · L217–217 | - public RPC: `cant_stop_create_room`, `cant_stop_join_room`, `cant_stop_join_room_by_invite`, `cant_stop_get_my_active_room`, `cant_stop_get_lobby_snapshot`, `cant_stop_set_ready`, `cant_stop_leave_room`, `cant_stop_start_game`, `cant_stop_roll_dice`, `cant_stop_choose_pairing`, `cant_stop_continue_turn`, `cant_stop_stop_turn`, `cant_stop_end_game`, `cant_stop_prepare_rematch` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-133 · L219–219 | 브라우저에는 위 테이블의 직접 쓰기 권한을 주지 않는다. 승인회원 RPC가 권한, membership, host, phase, expected version을 검증하고 room row lock 안에서 변경한다. `set_ready`와 `start_game`은 `client_action_id`를 기록해 재전송 시 같은 authoritative snapshot을 반환한다. | 표현:승인,검증 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-134 · L221–221 | Realtime은 `cant_stop_rooms`와 `cant_stop_room_players` 변경만 invalidation으로 구독하고, 실제 렌더 상태는 `cant_stop_get_lobby_snapshot` 또는 후속 authoritative snapshot RPC로 다시 읽는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### UI / UX Direction

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-135 · L225–225 | - Common Game Shell로 제목, 방 정보, 연결 상태, roster, 공통 action 영역을 제공한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-136 · L226–226 | - 메인 영역은 2–12 열이 산 형태로 올라가는 Can't Stop 전용 board로 구성하고, 상용판 아트를 복제하지 않은 고유 설산/빙설 테마를 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-137 · L227–227 | - permanent progress와 현재 턴의 temporary runner를 시각적으로 구분한다. 최대 4명의 player는 seat별 고유 고대비 색상을 사용해 검은 track 위에서도 말의 소유자를 빠르게 구분할 수 있게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-138 · L228–228 | - 현재 roll의 네 주사위와 가능한 pairing 선택지는 보드 위에 삽입하지 않고 오른쪽 sidebar의 전용 dice/route panel에서 함께 보여준다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-139 · L229–229 | - dice/route panel은 게임 phase가 바뀌어도 높이를 유지해 board playfield가 위아래로 흔들리지 않게 한다. 플레이 중에는 별도 현재 턴 정보 카드를 두지 않고 이 패널이 sidebar 정보 영역을 주로 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-140 · L230–230 | - 플레이어 roster는 대기 중의 준비 상태를 게임 시작 후 `게임 중`으로 전환하고, 연결이 끊기면 `연결 끊김`을 표시한다. active player는 고유 player color의 `현재 턴` badge와 card accent로 강조한다. 각 player card에는 현재 차지한 열 수를 `완주 N/3`으로 함께 표시한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-141 · L231–231 | - pairing 선택 시 실제 네 주사위가 어떤 두 쌍으로 묶여 각 열의 합을 만드는지 mini-dice → column number 형태로 설명하고, 서버가 허용한 legal move plan만 선택 버튼으로 노출한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-142 · L232–232 | - 주사위는 오른쪽 sidebar 하단의 전용 2.5D dice stage에서 굴러가는 움직임을 보여주며 최종 숫자는 authoritative server snapshot만 표시한다. 주사위 눈금은 폰트 glyph에 의존하지 않고 3×3 pip face로 그려 작은 화면에서도 값이 즉시 읽혀야 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-143 · L233–233 | - 턴의 첫 roll에는 `주사위 굴리기` 하나만 노출한다. pairing 이동 이후 PUSH OR STOP에서는 같은 dice card 안에 왼쪽 `주사위 굴리기`, 오른쪽 `멈추기`를 나란히 배치한다. 어느 단계에서든 roll 요청이 진행 중이면 두 버튼을 숨기고 폭 전체의 비활성 `주사위 굴리는 중…` 버튼 하나만 보여 layout clipping을 방지한다. 계속 굴리기는 client에서 authoritative `continue_turn` 결과 version을 사용해 곧바로 `roll_dice`를 이어 호출하되 중간 TURN_ROLL snapshot은 화면에 노출하지 않아 한 번의 사용자 클릭/한 번의 roll presentation으로 진행한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-144 · L234–234 | - dice roll에는 짧은 clatter 효과음을, bust에는 눈보라/바람 효과음을 Web Audio로 제공한다. 효과음 재생 실패는 게임 진행을 막지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-145 · L235–235 | - legal pairing이 하나만 존재해도 자동 적용하지 않고 active player가 이동 plan을 명시적으로 선택한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-146 · L236–236 | - temporary runner와 permanent progress는 서로 다른 marker 스타일로 표시하고 claimed column은 완주자를 함께 표시한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-147 · L237–237 | - `한 번 더 굴리기`와 `여기서 멈추기`를 turn의 핵심 선택으로 강조한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-148 · L238–238 | - bust 시 runner가 산 정상 기준 좌우 경사 방향으로 미끄러지고, 말 주변의 눈가루와 짧은 눈사태/powder 연출을 함께 보여줘 설산 등반 실패의 재미를 강화한다. 눈보라 전경 입자는 선형 streak가 아니라 크기가 다른 둥근 눈덩이/눈가루 particle로 표현한다. 눈/runner 연출 자체는 짧게 끝내되 결과 안내 카드는 보드 중앙에서 약 4초 유지해 사용자가 내용을 읽을 시간을 보장한다. actor의 local RPC 응답과 다른 player의 Realtime refresh 모두 동일한 bust presentation을 끝까지 보여준 뒤 다음 snapshot으로 전환한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-149 · L239–239 | - 로비/플레이 중 언제든 상세 규칙 modal을 열 수 있다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-150 · L240–240 | - 진행 중 방장은 확인 dialog를 거쳐 전체 게임을 수동 종료할 수 있고, 종료 결과는 모든 클라이언트의 authoritative GAME_OVER snapshot으로 동기화한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-151 · L241–241 | - 모바일에서는 11개 열 전체 판독성을 우선하고 과도한 3D/카메라 조작은 초기 버전에서 사용하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | C02/F03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-152 · L242–242 | - 원본 상용판의 보드/말 그래픽은 복제하지 않고 청파 같이 고유 시각 디자인을 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-153 · L243–243 | - online entry는 방 만들기 또는 6자리 코드 참가로 시작하며, waiting room에서 준비 상태와 방장 시작 조건을 명확히 보여준다. | 표현:조건 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-154 · L244–244 | - entry lobby에는 닉네임 입력/변경 UI를 두지 않는다. 로그인한 승인회원의 사이트 프로필 닉네임을 그대로 사용하며 닉네임 변경과 중복 검사는 마이페이지의 공통 프로필 흐름에서만 수행한다. | 표현:승인 | LOCAL_RULE / L | E-CS | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-155 · L245–245 | - entry 화면은 정상 연결 상태 카드를 별도로 노출하지 않고 새 방 만들기 / 코드 참가 두 행동에 집중한다. 규칙 보기는 오른쪽 온라인 플레이 안내 카드 하단에 둔다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-156 · L246–246 | - waiting room은 별도 준비 카드 대신 실제 게임 보드를 미리 보여주며, 보드 phase card에 `게임 준비 중`과 전원 준비 안내를 표시한다. 오른쪽은 profile avatar 기반 player roster와 방 안내/ready-start controls를 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-157 · L247–247 | - player roster는 사이트 공개 프로필의 avatar를 사용하고 avatar가 없거나 서명 URL을 얻지 못하면 사이트 공통 `assets/images/default-avatar.svg`를 사용한다. waiting에서 ready player는 seat accent를 활용한 card background로 구분한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-158 · L248–248 | - desktop gameplay board mountain은 900px 기준으로 확대하고 right sidebar를 같은 grid row에 stretch해 dice/route card 하단과 board 영역 하단이 일렬로 맞도록 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-159 · L249–249 | - gameplay의 규칙/새로고침/게임 종료 같은 utility action은 하단 sticky footer가 아니라 player roster와 dice stage 사이의 compact sidebar toolbar에 둔다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-160 · L250–250 | - waiting/playing room에서는 manual refresh 중 Common Shell connection status card를 별도로 생성하지 않는다. 오류는 기존 inline error presentation으로 전달한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-161 · L251–251 | - GAME_OVER에서는 새로고침 utility를 숨기고 규칙/재대결/방 나가기만 보여 compact toolbar 높이가 불필요하게 늘어나지 않게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-162 · L252–252 | - 진행 중 비방장 플레이어는 자신의 턴에서만 방 나가기를 실행할 수 있다. 3~4인 게임에서 이탈 후 2명 이상이 남으면 서버는 이탈자를 turnOrder/playerProgress/claimedColumns에서 제거하고 해당 턴 runners/latestDice/legalPairings를 초기화한 뒤 남은 순서의 다음 플레이어에게 TURN_ROLL을 넘긴다. | 표현:할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-163 · L253–253 | - 2인 게임에서 비방장이 자신의 턴에 나가면 이탈 자체는 허용하되 게임을 즉시 `GAME_OVER`로 종료한다. 승자는 지정하지 않고 `endReason = PLAYER_LEFT`와 `endedById`를 기록하며, 남은 방장은 재대결을 눌러 1인 waiting room으로 돌아간 뒤 새 플레이어가 참가해야 다시 시작할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-164 · L254–254 | - 진행 중 방장은 방 나가기 대신 게임 종료를 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-165 · L255–255 | - 진행 중 gameplay utility toolbar는 현재 버튼 수에 맞춰 동일 폭 column으로 채우며 빈 가로 여백을 남기지 않는다. 방장은 `게임 종료`, 일반 플레이어는 `방 나가기`를 본다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-166 · L256–256 | - 일반 플레이어의 진행 중 방 나가기는 자신의 턴에서만 허용한다. 3명 이상일 때는 남은 플레이어가 2명 이상이면 게임을 계속하고, 정확히 2명일 때 비방장이 나가면 게임을 종료한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-167 · L257–257 | - 진행 중 이탈이 성공하면 해당 플레이어를 active room membership / turn order / player progress에서 제거하고, 해당 플레이어 소유 claim과 현재 runner를 제거한다. 2명 이상 남으면 다음 플레이어의 `TURN_ROLL`로 정규화하고, 1명만 남으면 `PLAYER_LEFT` GAME_OVER로 정규화한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-168 · L258–258 | - 방장은 진행 중 방 나가기를 사용하지 않고 host-only `게임 종료` 흐름을 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-169 · L259–259 | - action validation 오류는 board 안의 inline error card로 레이아웃을 밀지 않고 3초 뒤 자동으로 닫히는 transient modal로 표시한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-170 · L260–260 | - Game Shell patch 시 entry/waiting/playing state class를 기존 shell root에도 동기화해 waiting ready tint와 gameplay 900px board override가 실제 DOM에 즉시 적용되게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-171 · L261–261 | - host manual-end confirmation dialog는 alpine sky/mountain/number marker visual language를 재사용하고 계속 플레이/게임 종료 선택을 명확한 bordered controls로 구분한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-172 · L262–262 | - Room/Lobby Realtime은 화면 상태를 직접 덮어쓰지 않고 authoritative snapshot refresh만 유도한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-173 · L263–263 | - 소스의 online 흐름 구현과 운영 activation은 분리한다. v1에서는 production migration·RLS/grant/RPC 권한·관련 회귀 검증을 확인한 뒤 Registry `online`/`invite`와 게임 목록 노출을 별도 activation 단계에서 활성화했다. 사람 중심 다중 브라우저 exploratory playtest는 자동 검증을 대체하지 않으며, release blocker가 없고 잔여 UX 위험을 문서화한 경우 post-release 관찰로 이어갈 수 있다. | 표현:검증 | LOCAL_RULE / L | E-CS | D09 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Implementation Plan — v1 Completed

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-174 · L267–267 | 아래 순서는 v1에서 모두 구현·검증 완료했다. 후속 버전은 이 순서를 다시 수행하는 것이 아니라 변경 범위에 해당하는 계약과 회귀만 재검증한다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-175 · L269–269 | 1. pure game-local rules engine | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-176 · L270–270 · 부모 LEGACY-CS-SPEC-175 |    - column constants | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-177 · L271–271 · 부모 LEGACY-CS-SPEC-175 |    - four-dice pairing enumeration/deduplication | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-178 · L272–272 · 부모 LEGACY-CS-SPEC-175 |    - legal move 계산 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-179 · L273–273 · 부모 LEGACY-CS-SPEC-175 |    - runner movement | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-180 · L274–274 · 부모 LEGACY-CS-SPEC-175 |    - bust / stop / claim / win | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-181 · L275–275 · 부모 LEGACY-CS-SPEC-175 |    - unit tests | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-182 · L276–276 | 2. 첫 runtime slice | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-183 · L277–277 · 부모 LEGACY-CS-SPEC-182 |    - Game Registry 등록 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-184 · L278–278 · 부모 LEGACY-CS-SPEC-182 |    - Access Gate | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-185 · L279–279 · 부모 LEGACY-CS-SPEC-182 |    - Common Game Shell 기반 최소 board | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-186 · L280–280 | 3. online room foundation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-187 · L281–281 · 부모 LEGACY-CS-SPEC-186 |    - game-specific schema/RPC | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-188 · L282–282 · 부모 LEGACY-CS-SPEC-186 |    - Room/Lobby adapter | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-189 · L283–283 · 부모 LEGACY-CS-SPEC-186 |    - approved member/host 권한 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-190 · L284–284 | 4. authoritative gameplay actions | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-191 · L285–285 · 부모 LEGACY-CS-SPEC-190 |    - server dice roll | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-192 · L286–286 · 부모 LEGACY-CS-SPEC-190 |    - `choose_pairing` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-193 · L287–287 · 부모 LEGACY-CS-SPEC-190 |    - `stop_turn` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-194 · L288–288 · 부모 LEGACY-CS-SPEC-190 |    - version/idempotency/concurrency | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-195 · L289–289 | 5. DB/Test Contract 10개 시나리오 적용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | C02/F03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-196 · L290–290 | 6. snapshot + Realtime invalidation + reconnect | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | D06 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-197 · L291–291 | 7. multiplayer UI와 game-specific animations | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-198 · L292–292 | 8. platform-native Invite | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-199 · L293–293 | 9. 멀티클라이언트 / reconnect / stale action 회귀 검증 | 표현:검증 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-200 · L295–295 | shared 계약으로 표현되지 않는 요구가 나오면 먼저 game-local로 해결 가능한지 확인한다. 여러 미래 게임에서도 동일한 플랫폼 책임으로 반복되는 경우에만 shared 변경을 계약 테스트와 문서와 함께 수행한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Validation Plan > Rules

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-201 · L301–301 | - 4 dice의 세 pairing 생성과 중복 제거 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-202 · L302–302 | - 동일 합 두 번 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-203 · L303–303 | - runner 0/1/2/3개 사용 상태 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-204 · L304–304 | - 세 runner 사용 후 새 열 차단 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-205 · L305–305 | - closed column 차단 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-206 · L306–306 | - top runner 추가 이동 차단 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-207 · L307–307 | - 한 pairing에서 한 이동만 가능한 경우 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-208 · L308–308 | - legal pairing 없음 → bust | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-209 · L309–309 | - bust 시 permanent progress 불변 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-210 · L310–310 | - stop 시 runner commit | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-211 · L311–311 | - top에서 stop → claim | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-212 · L312–312 | - claim된 열의 타 플레이어 진척 제거 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-213 · L313–313 | - 세 번째 claim → game over | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Validation Plan > Platform

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-214 · L317–317 | - Game Registry / capability | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-215 · L318–318 | - Access Gate | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-216 · L319–319 | - Room/Lobby adapter | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-217 · L320–320 | - snapshot stale version 거부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-218 · L321–321 | - reconnect refresh | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-219 · L322–322 | - idempotent action | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-220 · L323–323 | - DB/Test Contract 10개 시나리오 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | C02/F03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Validation Plan > Multiplayer regression

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-221 · L327–327 | - 2/3/4인 turn order | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-222 · L328–328 | - 서로 같은 칸/열 progress | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-223 · L329–329 | - player A action이 B/C client에 snapshot으로 반영 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-224 · L330–330 | - 연속 roll 중 reconnect 후 runner 복원 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-225 · L331–331 | - stop/claim 직전 stale client action 거부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-226 · L332–332 | - bust 직후 reconnect 상태 일치 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Open Questions / Deferred > Resolved in v1

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-227 · L338–338 | - GAME_OVER 이후 leave/rematch lifecycle을 구현했다. 모든 player는 종료 후 방을 나갈 수 있고, host는 같은 room을 waiting으로 되돌려 기존 active members / seats / room code를 유지한 채 재대결 준비를 시작할 수 있다. | 표현:할 수 있다 | LOCAL_CONTEXT / I | E-CS | D07 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-228 · L339–339 | - 진행 중 non-host leave 정책을 확정했다. 자신의 턴에만 이탈 가능하며 3~4인에서는 2명 이상 남으면 계속 진행하고, 2인에서 한 명이 나가면 승자 없는 `PLAYER_LEFT` GAME_OVER로 종료한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-229 · L340–340 | - Invite는 shared `game_room` 계약과 사이트 공용 invite infrastructure를 사용하며, 최종 참가 권한은 `cant_stop_join_room_by_invite`가 서버에서 token을 다시 검증해 결정한다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-230 · L341–341 | - production migration과 권한/회귀 검증 후 Registry `online=true`, `invite=true`와 사이트 게임 목록 노출을 활성화했다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | D09 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-231 · L342–342 | - 정상 connected gameplay에서는 상단 연결 상태 카드를 숨기고 reconnect/error일 때만 필요한 연결 정보를 노출한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-232 · L343–343 | - gameplay phase card, PUSH OR STOP action, bust 결과 카드 등 v1 presentation 기준을 확정했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Open Questions / Deferred > Post-release Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-233 · L347–347 | - 설산/2.5D 주사위/bust 연출의 속도·크기·강도는 실제 사용자 플레이 피드백이 누적되면 v1.1 이후 조정할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-234 · L348–348 | - Web Audio 기반 remote bust 사운드는 브라우저 autoplay 정책 영향을 받으므로 실사용 관찰 대상으로 남긴다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-235 · L349–349 | - `local` / `presence` capability는 v1 제품 범위가 아니며 필요성이 생기기 전까지 false로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-236 · L350–350 | - Can’t Stop에서 편리했던 game-local 규칙이나 UI를 한 사례만 보고 shared 계약으로 승격하지 않는다. 두 번째 이후 platform-native 게임에서도 같은 플랫폼 책임이 반복될 때 Game Platform 규칙과 계약 테스트를 확장한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

## CS-DEV — `games/cant-stop/DEVELOPMENT.md`

- source: [games/cant-stop/DEVELOPMENT.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/DEVELOPMENT.md)
- blob: `de9c2774e43b3646402edbf5785d9580df6e86e6`; 원문 199줄; 상태 `GAME_LOCAL`; 169 관리단위 / 35 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### Can't Stop Development

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-001 · L3–4 | &gt; 현재 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다.<br>&gt; 게임 규칙과 기능 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다. UI/presentation은 `UI_DESIGN.md` adoption baseline과 `UI_DECISIONS.md`의 최신 non-superseded override를 함께 적용합니다. 이 문서의 기존 UI 관련 항목은 과거 release 이력으로 보존하되 이후 세부 UI 이력은 `UI_DECISIONS.md`에 기록합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | D04 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Current Status

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-002 · L8–8 | - Phase: Phase 4 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-003 · L9–9 | - Status: RELEASED | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-004 · L10–10 | - Active branch: main | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-005 · L11–11 | - Last checkpoint: 2026-09-26 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Release Baseline

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-006 · L15–15 | - v1 source of truth는 `main`이며 2026-09-26 post-release multiplayer feedback 보강까지 PR #400으로 main에 반영됐다. 현재 기준 merge commit은 `3cf189708f88d4634cd7878476ea4e6fdb0e75f9`이다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-007 · L16–16 | - Game Registry는 `platform: "shared"`, `online=true`, `invite=true`, `local=false`, `presence=false` 상태다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-008 · L17–17 | - 사이트 게임 목록에서 Can’t Stop을 정식 노출하고 `./games/cant-stop/` 경로로 진입한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-009 · L18–18 | - 운영 Supabase에는 v1에 필요한 room/gameplay/invite/manual-end/profile-nickname/active-leave/2-player leave migration이 적용되어 있다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-010 · L19–19 | - 이후 Can’t Stop 변경은 과거 Phase 4 브랜치를 재사용하지 않고 최신 `main`에서 새 `fix/*` 또는 `feature/*` 브랜치를 만든다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Completed

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-011 · L23–23 | - 2026-09-26 post-release multiplayer feedback checkpoint: 다른 플레이어의 authoritative dice result도 동일한 rolling presentation cycle을 거쳐 보이도록 동기화했고, Realtime invalidation에서 `PUSH_OR_STOP → continue → roll → bust`가 중간 snapshot 없이 합쳐져 도착하는 경우에도 모든 클라이언트가 같은 bust presentation을 재생하도록 보강했다. 정상 stop 및 player leave와는 구분하며 bust 결과에는 실제 미끄러진 플레이어 이름을 표시한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-012 · L24–24 | - 2026-09-26 gameplay ownership/result feedback checkpoint: pairing plan hover/focus의 보드 이동 preview, player-color HUD/말 badge, permanent progress 1/2/3인 분할 색상, claimed column의 소유자 색상 표현을 반영했다. 이 항목들의 시각적 세부 결정은 `UI_DECISIONS.md` CS-UI-003이 책임진다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-013 · L25–25 | - 2026-09-26 GAME_OVER result checkpoint: 세 번째 column claim으로 실제 승리가 확정되는 순간 승자 본인을 포함한 방의 모든 플레이어에게 summit victory presentation을 재생한다. 이미 종료된 방으로 reconnect한 경우, host manual end, `PLAYER_LEFT` 종료에는 재생하지 않으며 authoritative winner/claim state나 rematch lifecycle은 변경하지 않는다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-014 · L26–26 | - 위 post-release 변경은 PR #400으로 main에 병합 완료했다. core rules, DB/RPC, Supabase migration, Registry capability, shared Game Shell 계약은 변경하지 않았다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-015 · L27–27 | - 2026-09-23 BGM polish: page entry/entry/waiting/rematch waiting에는 `Frozen Star`, authoritative `PLAYING` 상태에는 `Mountain Emperor`를 적용했다. 기존 공통 BGM Player와 저장 volume/pause 정책을 재사용하고 dice/blizzard Web Audio SFX는 분리 유지했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-016 · L28–28 | - 2026-09-22 Game Platform UI 규칙 도입에 맞춰 현재 v1의 Visual Identity, page/lobby/gameplay/result-rematch presentation 기준을 `UI_DESIGN.md`에 소급 문서화했다. runtime 동작은 변경하지 않았다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-017 · L29–29 | - 최신 Game Platform 규칙과 shared 계약을 확인했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-018 · L30–30 | - 당시 신규 게임 초기 세팅에 `GAME_SPEC.md`를 의무화하는 bootstrap 규칙 방향을 확정했다. 이후 플랫폼 규칙은 `GAME_SPEC.md` + `DEVELOPMENT.md` + `UI_DESIGN.md` + `UI_DECISIONS.md` 4문서 bootstrap으로 발전했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-019 · L31–31 | - Can't Stop 원본 규칙을 여러 공개 규칙 자료로 교차 확인했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-020 · L32–32 | - 2–12 column, four-dice pairing, three-runner, push/stop, bust, claim, three-column win 규칙을 구현 기준으로 정리했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-021 · L33–33 | - Game Platform의 SHARED 책임과 Can't Stop GAME-LOCAL 책임을 분리했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-022 · L34–34 | - online authoritative action / snapshot / reconnect / DB contract 적용 계획을 작성했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-023 · L35–35 | - 당시 Game Platform Governance Guard에 `GAME_SPEC.md` 필수 섹션 검증과 문서-only bootstrap 상태를 추가했다. 현재 Governance는 `UI_DESIGN.md` 필수 섹션까지 함께 검증한다. | 표현:검증,필수 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-024 · L36–36 | - 신규 game directory에 runtime 파일이 추가되는 순간 Registry가 필요하도록 회귀 테스트를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-025 · L37–37 | - deterministic rules engine을 추가해 2–12 column, dice pairing, runner 이동, bust, stop, claim, win을 game-local로 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-026 · L38–38 | - pairing만으로 이동이 하나로 결정되지 않는 경우를 legal move plan으로 표현하도록 규칙 모델을 고정했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-027 · L39–39 | - server-random turn order를 rules engine 입력으로 받고 client-local randomness는 사용하지 않도록 했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-028 · L40–40 | - rules engine 초기 구현 단계에서는 Game Registry에 `cant-stop`을 `platform: "shared"`로 등록하되 미구현 capability를 false로 유지했고, v1 release에서 검증된 `online`/`invite`만 true로 활성화했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-029 · L41–41 | - rules engine 핵심 경계 13개 unit test를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-030 · L42–42 | - 기존 사이트 auth source를 Game Platform Access Gate에 연결해 로그인/승인회원 접근 경계를 적용했다. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-031 · L43–43 | - 승인회원에게 Common Game Shell과 현재 사용자 roster를 표시하는 최소 runtime을 추가했다. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-032 · L44–44 | - rules engine의 2–12 column 높이를 재사용하는 11열 보드 골격을 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-033 · L45–45 | - 미승인/비로그인 사용자는 각각 승인 상태/로그인 화면으로 안내하고 gameplay shell은 렌더링하지 않는다. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-034 · L46–46 | - Room/Lobby 구현 전 단계에서는 Registry capability를 선행 활성화하지 않았고, 실제 Room/Lobby·DB 계약이 연결된 뒤에도 production 검증 전까지 비활성 상태를 유지했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-035 · L47–47 | - runtime model 및 실제 `app.js` syntax/index wiring 검증 테스트를 추가했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-036 · L48–48 | - Can’t Stop 전용 `cant_stop_rooms`, `cant_stop_room_players`, `cant_stop_room_actions` DB foundation을 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-037 · L49–49 | - 승인회원 전용 create/join/snapshot/ready/leave/start RPC와 명시적 RLS/grant 경계를 추가했다. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-038 · L50–50 | - room row lock + `expected_version`으로 충돌을 직렬화하고, `client_action_id` action replay로 ready/start 재전송 idempotency를 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-039 · L51–51 | - 게임 시작 시 서버가 turn order를 무작위로 확정해 authoritative `game_state`에 저장하도록 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-040 · L52–52 | - `createCantStopRoomLobbyAdapter`를 Shared `defineRoomLobbyAdapter` 계약에 연결하고 Realtime Postgres Changes를 invalidation 신호로만 사용하도록 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-041 · L53–53 | - Game DB integration harness가 Can’t Stop migration을 disposable Supabase에 replay하도록 확장했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-042 · L54–54 | - 당시 `tests/game-db-integration/cant-stop.test.js`에 플랫폼 필수 10개 DB 시나리오를 등록했다. 이후 공통 계약에 same-room rematch가 추가되어 현재는 11개 필수 시나리오를 구현한다. | 표현:필수 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-043 · L55–55 | - 기존 DB integration workflow에 `supabase/cant-stop/**/*.sql` 경로만 추가했으며 별도 workflow는 만들지 않았다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-044 · L56–56 | - 승인회원 runtime에 방 만들기 / 코드 참가 / 준비 / 준비 취소 / 방장 시작 / 나가기 사용자 흐름을 연결했다. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-045 · L57–57 | - authoritative lobby snapshot을 Common Game Shell roster와 room label에 연결했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-046 · L58–58 | - Shared Snapshot Coordinator를 lobby에도 적용해 Realtime payload는 invalidation으로만 소비하고 RPC snapshot을 다시 읽도록 했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-047 · L59–59 | - online/pageshow/visibility 복귀 시 authoritative lobby snapshot을 다시 불러오도록 reconnect refresh trigger를 연결했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-048 · L60–60 | - 게임 시작 snapshot을 받으면 서버 확정 turn order 상태를 유지한 채 기존 보드 골격 화면으로 전환한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-049 · L61–61 | - gameplay 구현 단계에서는 운영 Supabase migration과 Registry 활성화를 분리해 진행했고, production migration·권한 검증 후 별도 activation 단계에서 `online`/`invite`와 게임 목록 노출을 켰다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-050 · L62–62 | - authoritative gameplay 첫 slice로 `cant_stop_roll_dice` RPC를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-051 · L63–63 | - 클라이언트는 dice 값을 전달하지 않고 room/version/action id intent만 보내며 서버가 4d6를 생성한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-052 · L64–64 | - 서버가 현재 claimed column / runner / permanent progress를 기준으로 legal pairing과 legal move plan을 계산한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-053 · L65–65 | - 첫 roll SQL 결과를 JS rules engine `enumeratePairings()`와 대조하는 DB parity 검증을 추가했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-054 · L66–66 | - 동일 `client_action_id` roll 재전송은 최초 dice/pairing snapshot을 그대로 반환하며 version을 다시 증가시키지 않는다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-055 · L67–67 | - non-active player roll과 stale version roll을 서버에서 거부하도록 검증했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-056 · L68–68 | - game start state에 플레이어별 permanent progress를 위한 `playerProgress` authoritative 필드를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-057 · L69–69 | - gameplay client adapter `createCantStopGameplayAdapter`를 추가했으며 client가 임의 dice/random 값을 전달하지 못하는 계약 테스트를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-058 · L70–70 | - authoritative `cant_stop_choose_pairing` RPC를 추가해 서버 snapshot의 `legalPairings&#91;&#93;.plans`에 존재하는 선택만 허용한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-059 · L71–71 | - 선택된 legal move plan을 서버 `cant_stop_simulate_plan`으로 다시 계산해 authoritative `runners`에 반영하고 phase를 `PUSH_OR_STOP`으로 전환한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-060 · L72–72 | - `choose_pairing`도 room row lock + `expected_version` + `client_action_id` replay 계약을 적용했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-061 · L73–73 | - pairing action에는 `request_payload`를 기록해 같은 action id를 다른 sums/plan으로 재사용하면 `ACTION_ID_CONFLICT`로 거부한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-062 · L74–74 | - gameplay adapter에 `choosePairing()`을 추가하고 sums 2개 / plan 1~2개 / 2~12 범위를 client shape 경계에서 검증한다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-063 · L75–75 | - disposable Supabase 테스트에 JS rules engine `applyPairingChoice()`와 서버 runner 결과 parity, illegal choice 무변경, stale/non-active 거부, replay payload conflict 검증을 추가했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-064 · L76–76 | - authoritative `cant_stop_continue_turn` RPC를 추가해 `PUSH_OR_STOP`에서 runner는 유지하고 dice/pairing만 지운 뒤 같은 플레이어의 `TURN_ROLL`로 복귀하도록 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-065 · L77–77 | - authoritative `cant_stop_stop_turn` RPC를 추가해 runner를 active player의 permanent progress로 commit하고 다음 플레이어로 넘기도록 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-066 · L78–78 | - stop 시 top runner는 column claim으로 확정하고 다른 플레이어의 해당 column progress를 제거하도록 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-067 · L79–79 | - stop 결과 active player의 claimed column이 3개 이상이면 `GAME_OVER`와 `winnerId`를 authoritative state에 기록한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-068 · L80–80 | - continue/stop 모두 room row lock + `expected_version` + `client_action_id` idempotency 계약을 적용했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-069 · L81–81 | - 같은 `PUSH_OR_STOP` version에 continue/stop이 동시에 들어오면 하나만 commit되고 다른 하나는 `VERSION_CONFLICT`가 되도록 DB regression을 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-070 · L82–82 | - gameplay adapter에 `continueTurn()`, `stopTurn()` intent를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-071 · L83–83 | - disposable Supabase fixture를 사용해 JS `continueTurn()/stopTurn()` parity, permanent progress commit, claim, 상대 progress 제거, 3번째 claim 승리를 결정적으로 검증한다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-072 · L84–84 | - gameplay adapter를 기존 lobby controller에 주입해 `rollDice / choosePairing / continueTurn / stopTurn`을 같은 busy/error/snapshot 흐름으로 연결했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-073 · L85–85 | - authoritative gameplay view model을 추가해 UI가 규칙을 다시 계산하지 않고 server snapshot의 dice, legal pairings, runners, permanent progress, claims, winner를 렌더링하게 했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-074 · L86–86 | - 실제 board에 네 주사위, legal pairing/plan 선택, temporary runner, player별 permanent marker, claimed column을 표시한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-075 · L87–87 | - `TURN_ROLL`에서는 active player에게 서버 주사위 굴리기, `PUSH_OR_STOP`에서는 한 번 더 굴리기/멈추기 action을 노출한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-076 · L88–88 | - `GAME_OVER`에서는 authoritative winner와 최종 claim 상태를 표시한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-077 · L89–89 | - legal pairing이 하나만 있어도 자동 commit하지 않고 사용자가 명시적으로 이동 plan 버튼을 눌러 확정하도록 초기 UX를 고정했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-078 · L90–90 | - runtime/controller 단위 테스트에 gameplay view mapping과 versioned gameplay command wiring을 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-079 · L91–91 | - GAME_OVER 상태에서만 `cant_stop_leave_room`을 허용하도록 확장해 종료 후 active membership을 해제할 수 있게 했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-080 · L92–92 | - 방장 전용 `cant_stop_prepare_rematch` RPC를 추가해 같은 room code / active members / seats를 유지한 채 room을 `waiting`으로 되돌리고 game state를 초기화한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-081 · L93–93 | - 재대결 준비 시 방장만 ready=true, 나머지 active player는 ready=false로 초기화하고 기존 ready/start flow를 그대로 재사용한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-082 · L94–94 | - GAME_OVER에서 방장이 나가면 기존 seat 순서 기준 다음 player에게 host를 승계하고, 새 host가 재대결 준비를 수행할 수 있게 했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-083 · L95–95 | - 재대결 준비 시 room expiry를 8시간 연장한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-084 · L96–96 | - GAME_OVER UI에서 방장에게 `같은 방에서 재대결`, 모든 player에게 `방 나가기` action을 노출한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-085 · L97–97 | - disposable Supabase 테스트에 GAME_OVER leave 후 새 방 생성, rematch reset/restart, active-game guard, host-only rematch, host succession을 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-086 · L98–98 | - 멀티클라이언트/reconnect 검증에서 GAME_OVER → rematch lobby → 재접속 → 재시작, host leave → host succession → 재접속 흐름을 추가 검증했고 DB integration run #116까지 통과했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-087 · L99–99 | - platform-native Invite용 `createCantStopInviteAdapter`를 추가해 공용 `game_room` envelope과 Registry capability guard를 재사용한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-088 · L100–100 | - Invite 공유는 사이트 공용 `site_invite_create` + `inviteShare` 링크/QR UI를 그대로 사용하도록 연결했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-089 · L101–101 | - 초대 진입은 `?invite=&lt;token&gt;`을 다시 resolve하고 expected game id를 검증한 뒤 Can’t Stop 서버 참가 RPC로 넘긴다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-090 · L102–102 | - `cant_stop_join_room_by_invite` RPC는 서버에서 같은 token을 다시 `site_invite_resolve`하고 target type / game id / platform version / room id를 재검증한 뒤에만 waiting room 참가를 허용한다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-091 · L103–103 | - revoked/mismatched invite 및 server/client room parity를 테스트로 고정했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-092 · L104–104 | - Invite 소스 구현 단계에서는 Registry `online/invite` capability를 비활성으로 유지했고, production migration과 권한/회귀 검증이 끝난 v1 activation에서 두 capability를 활성화했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Current Work

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-093 · L108–108 | - Can’t Stop v1 기능 개발, 규칙 감사, 운영 DB 반영, Game Registry 활성화, 게임 목록 노출과 2026-09-26 post-release multiplayer feedback 보강까지 main에 반영 완료했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | D09, U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-094 · L109–109 | - Can’t Stop 자체는 유지보수 단계다. 현재 진행 중인 필수 기능 작업이나 기능 blocker는 없다. | 표현:필수 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-095 · L110–110 | - 이번 checkpoint의 기능 기준점은 PR #400 merge 이후 main이며, 후속 기능 수정은 종료된 작업 브랜치를 재사용하지 않고 최신 main에서 새 브랜치로 시작한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-096 · L111–111 | - Can’t Stop에서 얻은 첫 platform-native 실전 피드백은 Game Platform 규칙/거버넌스에 환류하며, 이후 게임에서 공통성이 다시 검증될 때 shared 계약을 확장한다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Next Work

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-097 · L115–115 | - 필수 기능 후속 작업은 없다. 새 기능/버그가 발견될 때 최신 main에서 별도 maintenance 브랜치로 진행한다. | 표현:필수 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-098 · L116–116 | - 2~4인 다중 브라우저 exploratory playtest는 자동 회귀 검증과 별개인 post-release 관찰 항목으로 계속 수행할 수 있다. | 표현:검증,할 수 있다 | LOCAL_RULE / L | E-CS | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-099 · L117–117 | - 실제 플레이에서 `Frozen Star` → `Mountain Emperor` 전환 체감과 BGM/SFX 상대 음량, remote bust audio의 브라우저 autoplay 제약을 관찰하고 필요할 때 game-local polish로 조정한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-100 · L118–118 | - summit victory presentation의 motion 강도·card 크기·완주 column token 가독성은 기능 blocker가 아니라 `UI_DECISIONS.md`의 디자인 follow-up으로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-101 · L119–119 | - core rules / server-authoritative contract / production migrations는 v1 release baseline으로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decisions

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-102 · L123–123 | - BGM은 Game Platform shared contract로 올리지 않고 site-level `js/game-audio/` utility를 game-local presentation에서 소비한다. entry/waiting/rematch waiting은 `Frozen Star`, authoritative room `playing`은 `Mountain Emperor`로 고정한다. 사용자 pause는 상태 전환보다 우선한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-103 · L124–124 | - 공식 로드맵 단계명은 `Phase 4`를 사용하며 임의의 `Phase 4A`를 만들지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-104 · L125–125 | - Can’t Stop은 기존 게임을 복사하지 않고 `games/cant-stop/`에서 처음부터 platform-native로 개발한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-105 · L126–126 | - bootstrap 당시에는 `GAME_SPEC.md`와 `DEVELOPMENT.md`만 두는 기준을 사용했으나, 현재 신규 게임 공통 기준은 `GAME_SPEC.md` + `DEVELOPMENT.md` + `UI_DESIGN.md` + `UI_DECISIONS.md` 네 문서다. Can't Stop의 `UI_DESIGN.md`는 v1 release 시점 baseline을 소급 문서화했고, 이후 디자인 변경은 `UI_DECISIONS.md`에 남긴다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D01 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-106 · L127–127 | - game-specific dice/pairing/runner 규칙은 `games/shared/`로 올리지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-107 · L128–128 | - online gameplay의 주사위 결과와 상태 전이는 최종적으로 서버가 authoritative하게 결정한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-108 · L129–129 | - 첫 플레이어는 사전 주사위 없이 게임 시작 RPC가 서버에서 turn order를 무작위로 한 번 확정하고 authoritative state에 저장하는 방식으로 결정한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-109 · L130–130 | - pairing에서 두 합을 모두 사용할 수 있으면 두 이동을 모두 적용해야 하며, 둘 다 쓸 수 없지만 각각 하나씩 가능한 경우에는 legal move plan으로 어느 한 합을 사용할지 명시적으로 선택한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-110 · L131–131 | - Game Registry 등록 시점에는 아직 실제 제공하지 않는 capability를 선행 선언하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-111 · L132–132 | - 최소 runtime은 기존 청파 같이 auth module을 직접 재구현하지 않고 Shared Access Gate adapter로 소비한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-112 · L133–133 | - Common Game Shell은 공통 header/status/roster/layout까지만 담당하고 11열 보드 표현은 Can’t Stop GAME-LOCAL로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-113 · L134–134 | - Room/Lobby DB는 공통 gameplay 테이블을 만들지 않고 `cant_stop_*` namespace를 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-114 · L135–135 | - 브라우저는 room/player 테이블을 직접 수정하지 않고 승인회원 RPC만 호출한다. | 표현:승인 | LOCAL_RULE / L | E-CS | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-115 · L136–136 | - Realtime payload는 최종 truth로 사용하지 않고 room/player 변경을 snapshot refresh invalidation으로만 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-116 · L137–137 | - Registry `online` capability는 소스 구현만으로 활성화하지 않고 운영 Supabase migration과 배포 smoke test까지 완료된 시점에 true로 전환한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D09, U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-117 · L138–138 | - lobby Realtime payload는 상태 자체로 렌더링하지 않고 Shared Snapshot Coordinator refresh trigger로만 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-118 · L139–139 | - 방 생성/참가/ready/start/leave 결과는 모두 RPC가 반환한 authoritative snapshot을 기준으로 렌더링한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-119 · L140–140 | - `choose_pairing`은 client가 임의 이동을 제안하는 API가 아니라 서버가 이미 발행한 legal pairing + legal move plan 중 하나를 선택하는 intent다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-120 · L141–141 | - idempotency key가 같아도 action payload가 달라지면 같은 요청으로 간주하지 않고 conflict로 거부한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-121 · L142–142 | - `continue_turn`은 현재 turn의 runner를 유지하고 공개된 dice/pairing만 초기화한 뒤 같은 active player가 다시 roll하게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-122 · L143–143 | - `stop_turn`은 runner 위치를 permanent progress로 commit한 뒤 claim/win을 계산하며 승자가 없으면 다음 player의 `TURN_ROLL`로 넘긴다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-123 · L144–144 | - 3번째 claim 승리 시 room status는 당장 닫지 않고 `game.phase = GAME_OVER`를 authoritative final state로 유지해 reconnect가 최종 결과를 복구할 수 있게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-124 · L145–145 | - gameplay UI는 authoritative snapshot을 표시할 뿐 dice/pairing/runner 결과를 client에서 재계산해 truth로 사용하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-125 · L146–146 | - legal pairing이 정확히 하나여도 자동 적용하지 않고 active player가 명시적으로 plan을 선택해 commit한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-126 · L147–147 | - 재대결은 즉시 새 게임을 강제 시작하지 않고 GAME_OVER room을 waiting으로 되돌린 뒤 기존 ready/start 계약을 다시 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-127 · L148–148 | - 진행 중 비방장 플레이어는 자신의 턴에 방 나가기가 가능하다. 3~4인 게임은 2명 이상 남으면 계속 진행하고, 2인 게임의 비방장 이탈은 승자 없이 `PLAYER_LEFT` GAME_OVER로 종료한다. 진행 중 방장은 게임 종료 흐름을 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-128 · L149–149 | - Invite는 반드시 shared `game_room` 계약을 사용하고 game-local target type을 새로 만들지 않는다. | 표현:반드시 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-129 · L150–150 | - client invite resolve는 라우팅/UX 검증이고 최종 room 참가 권한은 서버 `cant_stop_join_room_by_invite`가 token을 다시 검증해 결정한다. | 표현:검증 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-130 · L151–151 | - Invite 소스가 구현되어도 Registry `online/invite` capability는 운영 migration + smoke test가 끝날 때까지 false로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D09, U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-131 · L152–152 | - 게임 로비의 닉네임 입력/변경 UI는 제거하고 사이트 프로필 닉네임을 사용한다. Can’t Stop DB는 room player nickname 저장 시 `profiles.display_name`을 강제해 client override를 authoritative 값으로 사용하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Validation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-132 · L156–156 | - 2026-09-26 PR #400 `feat: refine Can't Stop shared gameplay feedback` main 병합 완료. merge commit: `3cf189708f88d4634cd7878476ea4e6fdb0e75f9`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-133 · L157–157 | - PR #400 최종 head `aada948809dab290cbd4fc71266a637cae3f82df` 기준 Game Platform governance run #598 SUCCESS: JavaScript syntax, shared-module link check, `npm run test:game-platform`, Governance Guard 모두 통과했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-134 · L158–158 | - multiplayer feedback 회귀에는 remote continue-and-roll bust 복원, 정상 stop의 bust 오인 방지, active-player leave의 bust 오인 방지, bust actor 이름 표시, winner 포함 all-client victory-event 조건을 포함한다. | 표현:조건 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-135 · L159–159 | - 상태별 BGM catalog / controller track switching / Can’t Stop mode mapping 자동 회귀 테스트를 추가했다. 최종 CI 결과는 이 PR 검증 후 갱신한다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-136 · L160–160 | - PR #327 최종 기능 브랜치: Game Platform Governance / Site static checks / Game DB integration SUCCESS 후 main 병합 완료. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-137 · L161–161 | - 규칙 감사: JS rules engine + 운영 Supabase legal pairing/stop 계산 + 정식 기본 규칙을 대조했고 core gameplay 차이 없음. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-138 · L162–162 | - active leave 회귀: 4→3, 3→2 계속 진행 / 2→1 PLAYER_LEFT GAME_OVER / out-of-turn leave 거부 / active host leave 거부 / 이탈자 progress·claim·runner 정리 / replacement 재대결 재시작 검증 완료. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-139 · L163–163 | - production migration 검증: profile nickname authority, active-turn leave, two-player leave GAME_OVER 함수/권한/제약 확인 완료. | 표현:검증 | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-140 · L164–164 | - PR #331 activation: Game Platform Governance SUCCESS, Site static checks SUCCESS, Community E2E smoke SUCCESS, Community authenticated E2E SUCCESS. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-141 · L165–165 | - PR #331 merge commit: `9225b3a22b4170f3f183de7915a9cc2edbf8f1a3`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-142 · L166–166 | - PR #332에서 RELEASED 상태의 최종 인수인계 문서를 main에 반영했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-143 · L167–167 | - 게임 목록 카드 정렬/설명 UI 후속 PR #334~#336은 Site static checks / Community E2E smoke / Community authenticated E2E를 통과한 뒤 main에 반영됐다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Known Issues / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-144 · L171–171 | - v1 출시를 막는 known issue는 현재 없다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-145 · L172–172 | - 실제 다중 브라우저 live smoke는 자동 회귀 검증과 별개로 사용자 관점에서 한 번 더 수행하면 좋다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-146 · L173–173 | - Web Audio 기반 remote bust 사운드는 브라우저 autoplay 정책에 따라 해당 탭에서 사용자 상호작용 전에는 재생되지 않을 수 있다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-147 · L174–174 | - Supabase security/performance advisor에는 프로젝트 전체에 이미 존재하던 경고가 남아 있다. 이번 Can’t Stop migration으로 anon EXECUTE가 새로 노출된 것은 확인되지 않았다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-148 · L175–175 | - Can’t Stop Registry capability는 현재 `online=true`, `invite=true`, `local=false`, `presence=false`다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Release — 2026-09-21

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-149 · L179–179 | - PR #327을 main에 병합했다. merge commit: `0fa282901d5be8b0d1bdb0d25beba7d5d4764a7e`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-150 · L180–180 | - 운영 Supabase에 Can’t Stop room/gameplay/manual-end/profile-nickname/active-leave/2-player leave GAME_OVER migration까지 반영했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-151 · L181–181 | - production migration history: | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-152 · L182–182 · 부모 LEGACY-CS-DEV-151 |   - `20260919140250 cant_stop_manual_end` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-153 · L183–183 · 부모 LEGACY-CS-DEV-151 |   - `20260920143502 cant_stop_profile_nickname` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-154 · L184–184 · 부모 LEGACY-CS-DEV-151 |   - `20260920143513 cant_stop_active_turn_leave` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-155 · L185–185 · 부모 LEGACY-CS-DEV-151 |   - `20260920150002 cant_stop_two_player_leave_game_over` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-156 · L186–186 | - 2인 게임에서 비방장이 자신의 턴에 나가면 승자 없이 `PLAYER_LEFT` GAME_OVER가 되고, 남은 방장은 재대결을 눌러 1인 waiting room으로 돌아간 뒤 새 플레이어 참가 후 다시 시작한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-157 · L187–187 | - PR #331에서 Game Registry `online=true`, `invite=true`를 활성화하고 사이트 게임 목록에 Can’t Stop 카드를 노출했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-158 · L188–188 | - PR #331은 main에 병합 완료했다. merge commit: `9225b3a22b4170f3f183de7915a9cc2edbf8f1a3`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-159 · L189–189 | - 공용 `game_room` invite entry가 Registry의 Can’t Stop 경로를 통해 `./games/cant-stop/?invite=...`로 연결된다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-160 · L190–190 | - v1 기준 사용자 흐름: | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-161 · L191–191 · 부모 LEGACY-CS-DEV-160 |   - 승인회원 + 사이트 프로필 닉네임으로 방 생성/코드 참가/초대 참가 | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-162 · L192–192 · 부모 LEGACY-CS-DEV-160 |   - waiting board preview + profile avatar + ready tint + host start | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-163 · L193–193 · 부모 LEGACY-CS-DEV-160 |   - server-random turn order, server-generated 4d6, authoritative pairing/runner/progress/claim | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-164 · L194–194 · 부모 LEGACY-CS-DEV-160 |   - push/stop, 4초 bust presentation, Web Audio dice/blizzard sound | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-165 · L195–195 · 부모 LEGACY-CS-DEV-160 |   - host manual game end, non-host own-turn leave, reconnect/snapshot recovery | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-166 · L196–196 · 부모 LEGACY-CS-DEV-160 |   - GAME_OVER rematch / leave | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-167 · L197–197 | - 규칙 감사 결과 기본 Can’t Stop 규칙과 core gameplay 구현은 일치하며, 의도적 digital adaptation은 시작 순서를 서버 랜덤 turn order로 정하는 부분이다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-168 · L198–198 | - release closeout 시점에 Can’t Stop 관련 개발/임시 브랜치를 정리했고 최종 기준 브랜치를 `main`으로 고정했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-169 · L199–199 | - Can’t Stop은 Game Platform의 첫 production platform-native 기준 사례이며, 이 구현에서 확인한 release/document/feedback 규칙을 공통 플랫폼 규칙으로 환류한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

## CS-UI — `games/cant-stop/UI_DESIGN.md`

- source: [games/cant-stop/UI_DESIGN.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/UI_DESIGN.md)
- blob: `4127eb5129923725e1e2c2b1c8a4b7ea87f7bcfe`; 원문 118줄; 상태 `ADOPTION_BASELINE`; 74 관리단위 / 57 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### Can't Stop UI Design

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-001 · L3–6 | &gt; 이 문서는 UI_DESIGN/UI_DECISIONS 체계 도입 전에 이미 release된 Can't Stop v1의 production 상태를 소급 정리한 **adoption baseline**입니다. 신규 게임의 pre-development baseline 사례로 사용하지 않습니다.<br>&gt; 플랫폼 공통 기준은 `docs/game-platform-ui-rules.md`, 기능 규칙은 `GAME_SPEC.md`, 이 baseline 이후 디자인 수정·결정·검증과 override는 `UI_DECISIONS.md`, 기능 구현 진행은 `DEVELOPMENT.md`에서 관리합니다.<br>&gt;<br>&gt; v1 RELEASED 이후 UI Design 규칙을 도입하면서 기존 구현을 소급 문서화한 baseline이며, 이후 후속 디자인 변경은 이 문서를 덮어쓰지 않고 `UI_DECISIONS.md`에 누적합니다. | 표현:검증 | LOCAL_RULE / L | E-CS | D04, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Design Research

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-002 · L10–10 | - Target edition / visual baseline: 원본 gameplay의 산악 등반 메타포를 기능적으로 재해석한 청파 같이 v1 설산 등반 테마 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-003 · L11–11 | - Official / rules sources: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-004 · L12–12 · 부모 LEGACY-CS-UI-003 |   - Can't Stop rulebook PDF: https://cdn.1j1ju.com/medias/d8/88/07-cant-stop-rulebook.pdf | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-005 · L13–13 · 부모 LEGACY-CS-UI-003 |   - Board Game Arena: https://boardgamearena.com/gamepanel?game=cantstop | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-006 · L14–14 · 부모 LEGACY-CS-UI-003 |   - BoardGameGeek: https://boardgamegeek.com/boardgame/41/cant-stop | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-007 · L15–15 | - Additional reference: 실제 2–12 column 구조와 push-your-luck 진행을 원본 규칙과 교차 확인 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-008 · L16–16 | - 조사/구현 대상 구성물: 2–12 열, neutral runner, player marker, 네 개의 d6, claim 상태 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-009 · L17–17 | - 핵심 관찰: 숫자 열의 높낮이와 정상 도달이 시각적으로 즉시 읽혀야 하며, push/stop/bust의 위험감이 핵심입니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-010 · L18–18 | - Last reviewed: 2026-09-22 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Copyright / Asset Usage

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-011 · L22–22 | - Directly usable: 자체 제작한 설산 board SVG/CSS, 자체 제작 dice/marker presentation | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-012 · L23–23 | - Recreate / reinterpret: 등반/정상 메타포와 열 구조를 독자적인 설산 테마로 재구성 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-013 · L24–24 | - Do not use directly: 사용 허가가 확인되지 않은 원본 판본의 artwork, 로고, 제품 이미지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-014 · L25–25 | - License / attribution notes: v1은 원본 artwork/상표 디자인 복제를 제품 범위에서 제외합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Visual Identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-015 · L29–29 | - Primary color: 설산/빙설 board의 차가운 자연 계열 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-016 · L30–30 | - Secondary color: column과 board depth를 구분하는 중립 계열 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-017 · L31–31 | - Accent color: active runner, claim, 위험/성공 상태 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-018 · L32–32 | - Background color: 게임 보드가 독립적으로 떠 보이는 어두운/중립 game frame | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-019 · L33–33 | - Typography direction: column 번호와 진행 상태를 빠르게 읽을 수 있는 명확한 숫자 우선 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-020 · L34–34 | - Symbols / patterns: 산, 정상, 눈/빙판, 등반 marker | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-021 · L35–35 | - Material / texture: 2.5D board와 주사위가 물리 구성물처럼 느껴지는 깊이 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-022 · L36–36 | - Visual keywords: 설산, 등반, push-your-luck, 정상, 미끄러짐 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Page Identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-023 · L40–40 | - entry/lobby/gameplay이 일반 사이트 카드 모음처럼 보이지 않고 하나의 설산 게임 공간으로 이어집니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-024 · L41–41 | - 공통 Game Shell을 사용하더라도 board와 player presentation은 game-local 테마를 우선합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-025 · L42–42 | - reconnect/error 상태도 보드 맥락을 유지하면서 명확한 시스템 상태를 전달합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Lobby / Setup Design

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-026 · L46–46 | - 플랫폼 공통 room/ready/host start 구조를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-027 · L47–47 | - 게임 시작 전 2–12 board preview와 플레이어 identity가 같은 설산 디자인 언어로 보입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-028 · L48–48 | - 규칙 modal에서 pairing, runner, stop, bust, claim을 시각적으로 이해할 수 있게 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-029 · L49–49 | - invite/room code는 기능적으로 명확하되 board presentation과 경쟁하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Gameplay Layout

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-030 · L53–53 | - 2–12의 11개 column이 중앙 보드의 최우선 정보입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-031 · L54–54 | - 각 column의 높이, runner, permanent progress, claim 상태를 같은 좌표계에서 읽습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-032 · L55–55 | - 네 개의 주사위와 legal pairing action은 board를 가리지 않는 action zone에 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-033 · L56–56 | - player state와 active turn은 board 진행 상태를 해치지 않는 보조 계층으로 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Components

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-034 · L60–60 | - Cards: 해당 없음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-035 · L61–61 | - Chips / tokens: runner/permanent marker/claim marker를 역할별로 구분 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-036 · L62–62 | - Dice / pieces: 2.5D dice rolling과 결과 숫자의 가독성을 함께 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-037 · L63–63 | - Player panel: 프로필, 차례, claim 상태를 간결하게 표시 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-038 · L64–64 | - Buttons: roll / pairing / push / stop의 위험과 우선순위를 구분 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-039 · L65–65 | - Modal / dialog: 규칙/수동 종료 확인을 game-local frame 안에서 표시 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-040 · L66–66 | - Status / event message: bust, claim, salary가 아닌 게임 핵심 이벤트를 보드 위 presentation으로 전달 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-041 · L67–67 | - Result component: 승자와 세 column claim 상태를 보드 맥락에서 보여줌 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Motion / Interaction

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-042 · L71–71 | - dice roll: 결과가 확정된 뒤 물리적으로 굴러 정착하는 느낌을 제공 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-043 · L72–72 | - runner move: 선택 pairing에 따라 어떤 column이 이동했는지 추적 가능해야 함 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-044 · L73–73 | - bust: 임시 progress가 사라지는 위험을 미끄러짐/후퇴 presentation으로 전달 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-045 · L74–74 | - claim: 정상 도달 후 stop commit에서 확정되는 순서를 명확히 표현 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-046 · L75–75 | - turn transition: action presentation이 끝난 뒤 다음 플레이어 강조 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-047 · L76–76 | - timing 원칙: authoritative 결과와 presentation 순서를 분리하되 서로 모순되지 않게 함 | 표현:원칙 | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-048 · L77–77 | - server-authoritative state와 presentation의 동기화 기준: UI는 snapshot 결과를 설명하고 client-local 계산을 truth로 사용하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-049 · L78–78 | - sound: dice/bust Web Audio SFX는 game-local 효과음으로 유지한다. BGM은 page entry·entry·waiting·rematch waiting에서 `Frozen Star`, authoritative room status가 `playing`인 gameplay/GAME_OVER에서 `Mountain Emperor`를 사용한다. 상태 전환은 presentation-only이며 서버 snapshot truth를 변경하지 않는다. Player pause/저장 volume은 track 전환에서도 유지하고 브라우저 autoplay 제한을 따른다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Result / Rematch Presentation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-050 · L82–82 | - winner와 claim된 세 column을 명확히 보여줍니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-051 · L83–83 | - GAME_OVER 이후 동일 room/player context를 유지한 rematch 준비로 전환합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D07, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-052 · L84–84 | - ready 상태와 host start 가능 조건을 lobby visual language로 다시 표시합니다. | 표현:조건 | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-053 · L85–85 | - host succession이나 player leave가 발생해도 authoritative snapshot을 기준으로 UI를 복구합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Responsive Strategy

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-054 · L89–89 | - Desktop: 11개 column 전체와 dice/action zone을 한눈에 보는 것을 우선합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-055 · L90–90 | - Tablet: board 비율을 유지하면서 player panel 밀도를 낮춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-056 · L91–91 | - Mobile: board의 column 가독성을 먼저 보존하고 secondary roster/action을 접거나 재배치합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-057 · L92–92 | - 작은 높이 화면: dice/action panel이 board를 과도하게 가리지 않게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-058 · L93–93 | - 많은 marker: player별 marker가 같은 칸에 공존할 수 있는 규칙을 표현할 수 있어야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-059 · L94–94 | - touch / accessibility: pairing/stop 등 핵심 선택을 hover 없이 실행할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Implementation Plan

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-060 · L98–98 | 1. 현재 v1 설산 Visual Identity와 자체 asset을 baseline으로 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-061 · L99–99 | 2. 후속 변경 시 board/dice/runner hierarchy가 실제 규칙 이해를 더 돕는지 우선 검토합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-062 · L100–100 | 3. motion 변경은 roll → pairing → runner → push/stop → bust/claim 순서를 해치지 않게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-063 · L101–101 | 4. result/rematch와 lobby 복귀가 같은 game identity 안에서 이어지는지 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-064 · L102–102 | 5. 실제 다중 브라우저와 mobile에서 board/action 가독성을 검증합니다. | 표현:검증 | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Validation Checklist

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-065 · L106–106 | - &#91;x&#93; 원본 gameplay 구조를 독자적인 설산 테마로 재해석했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-066 · L107–107 | - &#91;x&#93; 원본 artwork/상표 디자인의 직접 복제를 제품 범위에서 제외했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-067 · L108–108 | - &#91;x&#93; 일반 사이트와 구별되는 game-local board identity가 있다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-068 · L109–109 | - &#91;x&#93; dice, runner, permanent progress, claim을 구분할 수 있다. | 표현:할 수 있다 | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-069 · L110–110 | - &#91;x&#93; GAME_OVER → rematch lobby 흐름이 존재한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-070 · L111–111 | - &#91;x&#93; 설산 대기 분위기(`Frozen Star`)와 실제 등반 gameplay(`Mountain Emperor`)를 상태별 BGM으로 구분하고 rematch waiting에서 대기 음악으로 복귀한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-071 · L112–112 | - &#91; &#93; 후속 exploratory playtest에서 다양한 mobile 높이의 board/action 밀도를 계속 관찰한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-072 · L113–113 | - &#91; &#93; 브라우저 autoplay 정책에 따른 remote sound 경험을 계속 관찰한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Open Questions / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-073 · L117–117 | - 물리 엔진 기반 고급 3D 주사위/보드 연출은 현재 v1 scope 밖입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-074 · L118–118 | - v1 release baseline을 변경하는 UI polish는 별도 유지보수 PR에서 진행합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

## CS-UID — `games/cant-stop/UI_DECISIONS.md`

- source: [games/cant-stop/UI_DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/UI_DECISIONS.md)
- blob: `c77ed6c6acf69888dec8510711c7aa850a424948`; 원문 130줄; 상태 `GAME_LOCAL`; 101 관리단위 / 39 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### Can't Stop UI Decisions

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-001 · L3–7 | &gt; 이 문서는 Can't Stop의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.<br>&gt; `UI_DESIGN.md`는 규칙 체계 도입 시점의 Can't Stop v1 **adoption baseline**입니다. 이후 확정된 이 문서의 최신 non-superseded 결정이 같은 항목에서는 우선하며, 현재 유효 디자인은 baseline + decision overrides로 해석합니다. 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.<br>&gt; 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.<br>&gt;<br>&gt; 이 문서 체계 도입 이전의 모든 UI 변경사를 소급해 꾸며내지 않습니다. 현재 release baseline은 `UI_DESIGN.md`와 main runtime을 기준으로 하며, 이후 의미 있는 디자인 결정부터 이 문서에 누적합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Current Design Track

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-002 · L11–11 | - Status: IN_PROGRESS | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-003 · L12–12 | - Lifecycle stage: DEVELOPER_MANUAL_DESIGN_REVIEW | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-004 · L13–13 | - Current UI phase / scope: CS-UI-003 post-release gameplay feedback가 main에 반영된 상태이며 summit victory celebration의 최종 수동 리뷰만 follow-up으로 남아 있음 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-005 · L14–14 | - Active branch: main | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-006 · L15–15 | - Last updated: 2026-09-26 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-007 · L16–16 | - Adoption baseline: `UI_DESIGN.md` (v1 release state) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-008 · L17–17 | - Active overrides: CS-UI-001, CS-UI-002, CS-UI-003 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-009 · L18–18 | - Last checkpoint: PR #400 merge commit `3cf189708f88d4634cd7878476ea4e6fdb0e75f9` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-010 · L19–19 | - Next design work: summit victory celebration 실제 브라우저 motion 강도, 중앙 card 크기, 3개 summit token 가독성을 수동 리뷰하고 필요할 때 detail polish. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Decision Log > 2026-09-23 — Alpine Rules Guide

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-011 · L25–25 | - Decision ID: CS-UI-001 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-012 · L26–26 | - Applies to: rules/help modal, Visual Identity, rules presentation, responsive dialog | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-013 · L27–27 | - Supersedes: 없음 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-014 · L28–28 | - Source: developer manual browser review + Game Platform Rules Guide Presentation experiment | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-015 · L29–29 | - Context / trigger: v1 규칙 modal은 설산 계열 색상은 사용했지만 긴 텍스트 카드 중심이어서, 처음 플레이하는 사용자가 pairing, runner, push/stop, bust, win 같은 핵심 메커니즘을 게임 구성물과 연결해 이해하기 어려웠습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-016 · L30–30 | - Previous / alternatives: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-017 · L31–31 · 부모 LEGACY-CS-UID-016 |   - 기존 compact text-section modal 유지 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-018 · L32–32 · 부모 LEGACY-CS-UID-016 |   - No Thanks! 규칙 modal의 카드/칩 구조를 재사용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-019 · L33–33 · 부모 LEGACY-CS-UID-016 |   - Can’t Stop 고유 구성물과 설산 메타포로 새로 설계 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-020 · L34–34 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-021 · L35–35 · 부모 LEGACY-CS-UID-020 |   - 규칙 modal을 `MOUNTAIN GUIDE · HOW TO PLAY` 콘셉트의 alpine play guide로 재구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-022 · L36–36 · 부모 LEGACY-CS-UID-020 |   - 기존 v1의 설산, 4개 주사위, runner, 2–12 mountain columns, push-your-luck 언어를 사용하고 다른 게임의 modal layout은 복제하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-023 · L37–37 · 부모 LEGACY-CS-UID-020 |   - 상단에 `ROLL → PAIR &amp; CLIMB → PUSH OR STOP` 핵심 loop를 quick guide로 제공합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-024 · L38–38 · 부모 LEGACY-CS-UID-020 |   - 2–12 mountain 구조, 4 dice pairing 예시, runner 최대 3개, PUSH/STOP, BUST, 3-column win, server-authoritative adaptation을 각각 game-local visual example로 설명합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-025 · L39–39 · 부모 LEGACY-CS-UID-020 |   - 기존 상세 규칙 문장은 유지하여 visual example 없이도 semantic text만으로 전체 규칙을 이해할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-026 · L40–40 · 부모 LEGACY-CS-UID-020 |   - 공식 artwork/logo는 직접 사용하지 않고 기존 자체 dice/runner/alpine presentation으로 재구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-027 · L41–41 · 부모 LEGACY-CS-UID-020 |   - desktop/mobile에서 같은 정보 순서를 유지하고 작은 화면에서는 visual example을 본문 아래로 재배치합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-028 · L42–42 | - Rationale: 규칙 안내를 일반 도움말이 아니라 실제 gameplay presentation의 일부로 만들면서도 규칙 정확성, 접근성, 저작권 경계를 유지합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-029 · L43–43 | - Affected surfaces: rules modal header, quick loop, rule sections, dice/runner/mountain visual examples, source footer, mobile dialog | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-030 · L44–44 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-031 · L45–45 | - Validation: 2026-09-23 사용자 실제 화면 리뷰에서 “거의 손 안대도 될 정도의 퀄리티”로 승인. Game Platform governance run #493 성공. | 표현:승인 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-032 · L46–46 | - Baseline relation: `UI_DESIGN.md` adoption baseline의 game-local rules modal 방향을 구체화하고 기존 text-heavy presentation을 대체합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-033 · L47–47 | - Related functional boundary: 규칙 사실과 필수 설명 내용은 `GAME_SPEC.md`를 유지하며 runtime rules/DB/RPC/state authority는 변경하지 않습니다. | 표현:필수 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > 2026-09-23 — Full Alpine Expedition Presentation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-034 · L51–51 | - Decision ID: CS-UI-002 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-035 · L52–52 | - Applies to: entry, lobby, shell/header, player roster, gameplay board, dice/route station, phase feedback, result/rematch, responsive presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-036 · L53–53 | - Supersedes: v1 release baseline의 전반적인 generic/light shell presentation과 개별 polish 중심 시각 체계 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-037 · L54–54 | - Source: developer manual browser review + Game Platform full-design-rule experiment | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-038 · L55–55 | - Context / trigger: CS-UI-001 규칙 모달이 기존 gameplay보다 더 강한 Can’t Stop 고유 정체성을 보여 주면서, 공통 디자인 규칙이 한 modal을 넘어 게임 전체에도 일관되게 적용되는지 검증할 필요가 생겼습니다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-039 · L56–56 | - Previous / alternatives: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-040 · L57–57 · 부모 LEGACY-CS-UID-039 |   - v1 보드/사이드바/헤더 구조를 유지하고 색상·spacing만 미세 조정 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-041 · L58–58 · 부모 LEGACY-CS-UID-039 |   - rules modal의 스타일을 일부 gameplay card에만 제한적으로 확장 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-042 · L59–59 · 부모 LEGACY-CS-UID-039 |   - 기능 구조를 유지한 채 Entry → Lobby → Gameplay → Result 전체 presentation을 하나의 alpine expedition 언어로 재구성 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-043 · L60–60 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-044 · L61–61 · 부모 LEGACY-CS-UID-043 |   - Can’t Stop 전체 화면을 **alpine expedition** 경험으로 통일합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-045 · L62–62 · 부모 LEGACY-CS-UID-043 |   - Entry는 trailhead / expedition briefing, Lobby는 `BASE CAMP`, gameplay는 mountain board + route station, GAME_OVER는 summit/winner presentation으로 이어지는 하나의 공간 언어를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-046 · L63–63 · 부모 LEGACY-CS-UID-043 |   - 공식/신뢰 가능한 제품 자료에서 확인한 4개의 red dice, 3개의 white runner, 2–12 mountain-column 구조를 참고하되 공식 artwork/logo는 직접 복제하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-047 · L64–64 · 부모 LEGACY-CS-UID-043 |   - gameplay dice는 red physical component로 강조하고, active runner는 white expedition marker + player accent로 재해석합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-048 · L65–65 · 부모 LEGACY-CS-UID-043 |   - 2–12 column은 독립 원형 cell의 나열보다 rope/trail 축을 따라 정상으로 오르는 구조로 보이게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-049 · L66–66 · 부모 LEGACY-CS-UID-043 |   - shell/header, roster, utility controls는 deep alpine blue expedition frame으로 통일하고 summit/winner/checkpoint는 gold accent를 제한적으로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-050 · L67–67 · 부모 LEGACY-CS-UID-043 |   - pairing/route selection은 밝은 route-map surface로 분리해 행동 선택과 보드 상태를 시각적으로 구분합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-051 · L68–68 · 부모 LEGACY-CS-UID-043 |   - `ROLL`, `PAIRING_SELECTION`, `PUSH_OR_STOP`, `GAME_OVER` 상태에 presentation class를 부여해 같은 기능 구조 안에서 현재 단계가 자연스럽게 읽히게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-052 · L69–69 · 부모 LEGACY-CS-UID-043 |   - 기존 authoritative gameplay, RPC, DB, randomness, turn lifecycle, reconnect, rematch 구조는 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-053 · L70–70 · 부모 LEGACY-CS-UID-043 |   - desktop/tablet/mobile에서 같은 design language를 유지하되 좁은 화면에서는 정보 밀도와 열 배치를 조절합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-054 · L71–71 | - Rationale: 기존 Can’t Stop은 기능적으로 완성되어 있었지만 UI 규칙 도입 전에 개발되어 각 요소가 개별 기능을 설명하는 방식으로 성장했습니다. 전체 presentation을 하나의 원정 메타포로 묶으면 규칙 모달에서 발견한 game-local identity를 실제 플레이 전 과정으로 확장하면서도 기존 안정적인 기능 구조를 그대로 보존할 수 있습니다. | 표현:할 수 있습니다 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-055 · L72–72 | - Affected surfaces: page background, Common Game Shell overrides, entry cards, basecamp lobby, player roster, board frame, columns, markers, dice station, route panel, gameplay tools, bust feedback, game-over/rematch, responsive layout | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-056 · L73–73 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-057 · L74–74 | - Validation: 2026-09-23 사용자 실제 화면 리뷰에서 “미쳤어 완전 마음에 들어”라고 명시적으로 승인. Game Platform governance run #494 성공. | 표현:승인 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-058 · L75–75 | - Baseline relation: `UI_DESIGN.md` v1 adoption baseline의 기능적 구조와 핵심 구성물은 유지하고, 전반적인 presentation hierarchy와 visual language를 대체합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-059 · L76–76 | - Related functional boundary: `GAME_SPEC.md`의 rules, authoritative state, dice/pairing/runner/claim/win 의미는 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > 2026-09-26 — Shared Gameplay Feedback & Summit Completion

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-060 · L80–80 | - Decision ID: CS-UI-003 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-061 · L81–81 | - Applies to: multiplayer dice presentation, route hover preview, player HUD, permanent progress ownership, claimed columns, bust feedback, GAME_OVER victory event | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-062 · L82–82 | - Supersedes: 없음. CS-UI-002의 alpine expedition presentation을 post-release interaction/detail 영역에서 확장합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-063 · L83–83 | - Source: developer manual browser review + 2026-09-25~26 사용자 피드백 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-064 · L84–84 | - Context / trigger: 실제 멀티플레이 반복 테스트에서 다른 플레이어의 주사위 굴림, 경로 선택 결과, 말 소유권, 저장 진척, bust가 기능적으로는 맞아도 관전자 화면에서 즉시 읽히지 않는 구간이 확인됐고, 세 column을 완주해 게임이 끝나는 가장 큰 성공 이벤트에는 별도 축하 presentation이 없었습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-065 · L85–85 | - Previous / alternatives: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-066 · L86–86 · 부모 LEGACY-CS-UID-065 |   - authoritative snapshot이 갱신되는 즉시 결과만 표시하고 추가 motion을 두지 않음 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-067 · L87–87 · 부모 LEGACY-CS-UID-065 |   - 모든 preview/progress/완주 표시를 neutral/gold 한 색으로 통일 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-068 · L88–88 · 부모 LEGACY-CS-UID-065 |   - 일반적인 confetti modal을 GAME_OVER 위에 띄움 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-069 · L89–89 · 부모 LEGACY-CS-UID-065 |   - 기존 alpine expedition 언어 안에서 player color + summit/gold checkpoint + snow/peak motion으로 이벤트를 재구성 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-070 · L90–90 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-071 · L91–91 · 부모 LEGACY-CS-UID-070 |   - 다른 플레이어의 authoritative dice result도 현재 플레이어와 동일한 rolling cycle을 거친 뒤 결과를 보여 주어 멀티클라이언트 presentation을 맞춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-072 · L92–92 · 부모 LEGACY-CS-UID-070 |   - pairing plan hover/focus에서는 실제 이동 예정 칸을 보드에 preview하고, 현재 플레이어의 말 색상을 사용하되 점선/반투명 ring으로 active runner와 구분합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-073 · L93–93 · 부모 LEGACY-CS-UID-070 |   - permanent progress는 같은 칸에 1명이면 전체 원, 2명이면 1/2, 3명이면 1/3, 4명이면 기존 4-marker 구조로 표시하여 말 소유권과 겹침 상태를 동시에 읽게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-074 · L94–94 · 부모 LEGACY-CS-UID-070 |   - player HUD는 아바타/이름·상태·완주/현재 턴/말 색상/연결 상태를 정렬하고, card accent·avatar ring·turn badge·명시적 `내 말/말` badge에 실제 player color를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-075 · L95–95 · 부모 LEGACY-CS-UID-070 |   - claimed column의 cell과 번호는 완주 플레이어의 말 색상으로 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-076 · L96–96 · 부모 LEGACY-CS-UID-070 |   - bust는 기존 설산 눈보라 언어를 유지하되 runner 낙하/회전과 board impact를 강화합니다. actor의 local RPC 결과뿐 아니라 Realtime invalidation을 받는 모든 플레이어 화면에서도 동일한 roll → bust presentation을 재생하고, 결과 카드에 실제 미끄러진 플레이어의 이름을 명시합니다. `PUSH_OR_STOP → continue → roll → bust` 두 서버 action이 하나의 remote snapshot으로 합쳐진 경우도 version 차이를 사용해 bust로 복원하되 정상 stop이나 player leave와 혼동하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-077 · L97–97 · 부모 LEGACY-CS-UID-070 |   - 실제 3-column win으로 GAME_OVER에 **전환되는 순간** 승리한 플레이어 본인을 포함한 방의 모든 플레이어에게 5.2초의 summit celebration을 재생합니다. reconnect로 이미 끝난 방에 처음 들어온 경우, 수동 게임 종료, 플레이어 이탈 종료에는 재생하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-078 · L98–98 · 부모 LEGACY-CS-UID-070 |   - victory event는 generic confetti 대신 alpine expedition의 deep-blue frame, gold summit/checkpoint, 설산 crest/flag, 눈·금빛 입자, 실제 완주한 3개 column 번호를 사용합니다. winner flag/accent에는 해당 플레이어의 말 색상을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-079 · L99–99 · 부모 LEGACY-CS-UID-070 |   - celebration은 authoritative winner/claimed columns를 읽기만 하며 result/rematch 상태나 RPC를 변경하지 않고, pointer event를 차단하지 않습니다. reduced-motion 환경에서는 particle/flare motion을 제거하고 정적 승리 card만 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-080 · L100–100 | - Rationale: Can’t Stop의 핵심 감정 곡선은 위험을 감수한 등반과 정상 정복이므로, 성공/실패/소유권을 모두 같은 board language로 읽게 해야 합니다. 특히 GAME_OVER는 일반 서비스형 결과 modal보다 지금까지 쌓아 온 설산 원정 공간 안에서 “세 정상 정복”으로 마무리될 때 game-local identity와 성취감이 가장 잘 연결됩니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-081 · L101–101 | - Affected surfaces: presentation coordinator 소비 UI, route plan interaction, board marker/cell, player roster, claimed column, bust motion, GAME_OVER board overlay, responsive/reduced-motion presentation | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-082 · L102–102 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-083 · L103–103 | - Validation: player-color HUD/progress/preview 방향은 2026-09-26 사용자 실제 화면 리뷰에서 “마음에 들어” 승인. 이후 multiplayer QA에서 remote continue-and-roll bust가 actor 화면에만 남는 문제와 winner 본인의 summit celebration 누락 가능성을 확인해 all-client event derivation/arming을 보강했습니다. 최종 구현은 PR #400으로 main에 병합됐고 Game Platform governance run #598을 통과했습니다. summit celebration의 최종 motion 체감 수동 리뷰는 남아 있습니다. | 표현:승인 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-084 · L104–104 | - Baseline relation: `UI_DESIGN.md`의 Motion / Interaction 및 Result / Rematch Presentation과 CS-UI-002의 alpine expedition 언어를 유지하면서, 멀티플레이 관전성과 victory climax를 구체화합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-085 · L105–105 | - Related functional boundary: `GAME_SPEC.md`의 server-authoritative dice, runner/progress, claim, 3-column win, GAME_OVER/rematch lifecycle은 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Superseded / Rejected

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-086 · L109–109 | - v1의 text-heavy rules modal presentation은 CS-UI-001에 의해 superseded. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-087 · L110–110 | - v1의 generic/light shell 중심 전반 presentation은 CS-UI-002에 의해 superseded. 기능 구조와 server-authoritative gameplay는 유지합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-088 · L111–111 | - No Thanks!의 rules modal/layout을 Can’t Stop에 재사용하는 방향은 game-local identity 원칙에 따라 채택하지 않았습니다. | 표현:원칙 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-089 · L112–112 | - 과거 UI 변경사는 이 문서 도입만으로 소급 재구성하지 않습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Validation History

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-090 · L116–116 | - 2026-09-23 — UI_DECISIONS 체계 도입 당시 v1 release baseline만 기록. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-091 · L117–117 | - 2026-09-23 — CS-UI-001 alpine rules guide: desktop 실제 화면 수동 리뷰 승인. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-092 · L118–118 | - 2026-09-23 — Game Platform governance run #493: JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard 모두 success. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-093 · L119–119 | - 2026-09-23 — CS-UI-002 full alpine expedition redesign: Entry/Lobby/Gameplay/GAME_OVER 실제 화면 수동 리뷰 승인. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-094 · L120–120 | - 2026-09-23 — Game Platform governance run #494: JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard 모두 success. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-095 · L121–121 | - 2026-09-26 — CS-UI-003 gameplay ownership/feedback 구현 중 player-color HUD, permanent progress split, route preview 방향을 사용자 실제 화면 리뷰에서 승인. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-096 · L122–122 | - 2026-09-26 — multiplayer QA에서 bust presentation을 모든 플레이어에게 동기화하고 실제 미끄러진 플레이어 이름을 표시하도록 보강. victory event도 승자 본인을 포함한 모든 플레이어에게 재생되도록 arming 조건을 보강. | 표현:조건 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-097 · L123–123 | - 2026-09-26 — PR #400 main 병합 완료, merge commit `3cf189708f88d4634cd7878476ea4e6fdb0e75f9`. 최종 head 기준 Game Platform governance run #598 success. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-098 · L124–124 | - 2026-09-26 — 디자인 체크포인트: CS-UI-003의 확정 component/interaction/motion 결정은 main에 보존됐으며, summit victory celebration의 최종 브라우저 체감 확인만 Open Follow-up으로 유지. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Open Follow-up

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-099 · L128–128 | - CS-UI-003 summit victory celebration의 실제 브라우저 motion 강도, card 크기, 3개 summit token 가독성을 수동 검토합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-100 · L129–129 | - 전체 디자인 실험 결과 공통 디자인 규칙이 rules modal뿐 아니라 Entry/Lobby/Gameplay/Result에서도 game-local identity를 유지하며 작동하는 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-101 · L130–130 | - 후속 수정이 확정되면 `UI_DESIGN.md` baseline을 덮어쓰지 말고 Decision Log에 추가합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

## NT-SPEC — `games/no-thanks/GAME_SPEC.md`

- source: [games/no-thanks/GAME_SPEC.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/GAME_SPEC.md)
- blob: `11408e010a86c8197068be96a6cbede34c42e477`; 원문 399줄; 상태 `GAME_LOCAL`; 254 관리단위 / 243 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### No Thanks! 게임 명세

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-001 · L3–5 | &gt; 이 문서는 No Thanks!가 어떤 게임이며 청파 같이에서 어떤 규칙과 구조로 구현할지 정의하는 게임별 설계 기준입니다.<br>&gt; 실제 기능 개발 진행 상황은 같은 디렉터리의 `DEVELOPMENT.md`에서 관리합니다.<br>&gt; UI/presentation은 같은 디렉터리의 `UI_DESIGN.md` adoption baseline과 `UI_DECISIONS.md`의 최신 non-superseded 변경 결정을 함께 적용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Game Overview

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-002 · L9–9 | - 게임 식별자: `no-thanks` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-003 · L10–10 | - 디자이너: Thorsten Gimmler | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-004 · L11–11 | - 지원 인원: 3–7명 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-005 · L12–12 | - 목표 방식: 온라인 멀티플레이 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-006 · L13–13 | - 핵심 진행: 현재 공개된 숫자 카드를 칩 1개를 내고 거절하거나, 카드와 그 위에 쌓인 칩을 함께 가져오는 선택을 반복합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-007 · L14–14 | - 승리 조건: 마지막 카드가 가져가진 뒤 숫자 카드 점수에서 남은 칩을 뺀 최종 점수가 가장 낮은 플레이어가 승리합니다. | 표현:조건 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-008 · L15–15 | - 기본 카드 구성: 3–35의 숫자 카드 33장 중 무작위 9장을 제외하고 24장을 사용합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Rules and Sources

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-009 · L19–19 | 구현 기준은 다음 자료를 우선 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-010 · L21–21 | - AMIGO 공식 영문 규칙서: https://blog.amigo-spiele.de/content/ap/rule/02455-GB-AmigoRule.pdf | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-011 · L22–22 | - AMIGO 공식 제품 페이지: https://www.amigo-spiele.de/no-thanks_2455_1247 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-012 · L23–23 | - Board Game Arena 규칙 요약: https://en.doc.boardgamearena.com/Gamehelpnothanks | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-013 · L25–25 | 현재 첫 버전에 적용할 기본 규칙은 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-014 · L27–27 | 1. 3–5인은 각 11개, 6인은 각 9개, 7인은 각 7개의 칩으로 시작합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-015 · L28–28 | 2. 각 플레이어가 가진 칩 개수는 게임이 끝날 때까지 다른 플레이어에게 공개하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-016 · L29–29 | 3. 3–35의 숫자 카드 33장을 섞고 9장을 보지 않은 채 제외합니다. 남은 24장을 실제 게임에 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-017 · L30–30 | 4. 현재 차례의 플레이어는 공개된 카드를 가져가거나 칩 1개를 내고 거절할 수 있습니다. | 표현:할 수 있습니다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-018 · L31–31 | 5. 카드를 거절하면 칩 1개가 현재 카드 위의 공개 칩 더미에 추가되고 차례는 다음 플레이어에게 넘어갑니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-019 · L32–32 | 6. 칩이 하나도 없는 플레이어는 거절할 수 없으며 현재 카드를 반드시 가져가야 합니다. | 표현:반드시 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-020 · L33–33 | 7. 현재 카드를 가져가면 카드 위에 쌓인 모든 칩도 함께 가져갑니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-021 · L34–34 | 8. 카드를 가져간 플레이어가 다음 카드를 공개하며 같은 플레이어가 다시 선택합니다. 즉 카드를 가져가는 행동 자체로는 차례가 끝나지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-022 · L35–35 | 9. 마지막 카드를 누군가 가져가는 순간 게임이 끝납니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-023 · L36–36 | 10. 단독 숫자 카드는 적힌 값만큼 점수가 됩니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-024 · L37–37 | 11. 연속된 숫자 카드 묶음은 가장 낮은 숫자 하나만 점수에 포함합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-025 · L38–38 | 12. 최종 점수는 숫자 카드 점수 합에서 남은 칩 수를 뺀 값입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-026 · L39–39 | 13. 최종 점수가 가장 낮은 플레이어가 승리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-027 · L40–40 | 14. 최저 점수가 동점이면 해당 플레이어들은 공동 승리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Rules and Sources > 온라인 구현에 따른 조정

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-028 · L44–44 | 공식 규칙의 선 플레이어 결정은 "가장 최근에 No thanks!라고 말한 사람"이지만 온라인 환경에서는 적용하기 어렵기 때문에 청파 같이 첫 버전에서는 서버가 게임 시작 시 플레이 순서를 한 번 무작위로 확정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-029 · L46–46 | 게임 중 다른 플레이어의 보유 칩 수는 공식 규칙대로 비공개로 유지합니다. 현재 공개 카드 위에 쌓인 칩 수와 각 플레이어가 획득한 숫자 카드는 모든 플레이어에게 공개합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-030 · L48–48 | 사용자용 규칙 안내는 로비와 실제 플레이 화면에서 다시 열 수 있는 모달로 제공합니다. 처음 플레이하는 사용자도 목표, 시작 칩 수, 9장 제외, 거절과 카드 가져오기, 칩이 없을 때의 강제 수락, 연속 숫자 점수 계산, 남은 칩 차감, 공동 승리를 이해할 수 있는 수준으로 설명합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Product Scope > 이번 버전에 포함

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-031 · L54–54 | - 3–7인 온라인 멀티플레이 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-032 · L55–55 | - 기본 규칙 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-033 · L56–56 | - 3–35 숫자 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-034 · L57–57 | - 무작위 9장 비공개 제외 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-035 · L58–58 | - 인원별 초기 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-036 · L59–59 | - 플레이어별 보유 칩 수 비공개 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-037 · L60–60 | - 카드 거절 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-038 · L61–61 | - 카드 가져오기 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-039 · L62–62 | - 현재 카드 위의 공개 칩 더미 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-040 · L63–63 | - 연속 숫자 묶음 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-041 · L64–64 | - 최종 점수와 공동 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-042 · L65–65 | - 서버 기준 재접속 상태 복원 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-043 · L66–66 | - 상세 게임 규칙 모달 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-044 · L67–67 | - 진행 중 세션의 안전한 종료와 이탈 경로 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Product Scope > 후속 개발로 보류

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-045 · L71–71 | - 2024년 AMIGO 재판에 포함된 22장 특수 카드 확장 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-046 · L72–72 | - Board Game Arena의 Tactical Variant | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-047 · L73–73 | - 플레이 기록과 전적 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-048 · L74–74 | - 관전자 모드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-049 · L75–75 | - 인공지능 플레이어 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-050 · L76–76 | - 별도 애니메이션과 사운드 완성도 개선 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-051 · L77–77 | - 운영 환경 기능 활성화 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D09 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Product Scope > 첫 버전에서 제외

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-052 · L81–81 | - 기존 Legacy 게임 구조 복사 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-053 · L82–82 | - 클라이언트가 카드 섞기, 카드 뽑기, 점수 계산, 칩 사용 가능 여부를 최종 판단하는 구조 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-054 · L83–83 | - 게임별 닉네임 입력 또는 변경 화면 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-055 · L84–84 | - 다른 플레이어의 정확한 보유 칩 수 공개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### State Machine > 방 진행 상태

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-056 · L90–90 | - `ENTRY`: 승인회원 진입 | 표현:승인 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-057 · L91–91 | - `WAITING`: 방 생성 또는 참가, 3–7명 구성, 준비 상태 관리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-058 · L92–92 | - `PLAYING`: 서버가 관리하는 게임 진행 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-059 · L93–93 | - `GAME_OVER`: 마지막 카드 수락 또는 수동 종료로 게임 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-060 · L94–94 | - `POST_GAME`: 결과 확인 후 방 나가기 또는 재대결 흐름 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-061 · L96–96 | 현재 공통 방/로비 계약에서 사용하는 준비 완료와 방장 시작 흐름을 첫 버전에 그대로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### State Machine > 실제 게임 진행 상태

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-062 · L100–100 | `PLAYING` 안에서는 불필요하게 세부 단계를 늘리지 않고 다음 상태를 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-063 · L102–102 | - `currentCard`: 현재 공개 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-064 · L103–103 | - `centerCounters`: 현재 카드 위에 쌓인 공개 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-065 · L104–104 | - `activePlayerId`: 현재 선택권을 가진 플레이어 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-066 · L105–105 | - `deckRemaining`: 아직 공개되지 않은 카드 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-067 · L107–107 | 가능한 행동은 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-068 · L109–109 | - `REFUSE_CARD` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-069 · L110–110 · 부모 LEGACY-NT-SPEC-068 |   - 조건: 현재 차례의 플레이어이며 본인 칩이 1개 이상 남아 있어야 합니다. | 표현:조건 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-070 · L111–111 · 부모 LEGACY-NT-SPEC-068 |   - 결과: 본인 칩 1개 감소, `centerCounters` 1개 증가, 차례가 다음 플레이어에게 넘어갑니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-071 · L112–112 | - `TAKE_CARD` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-072 · L113–113 · 부모 LEGACY-NT-SPEC-071 |   - 조건: 현재 차례의 플레이어여야 합니다. | 표현:조건 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-073 · L114–114 · 부모 LEGACY-NT-SPEC-071 |   - 결과: `currentCard`를 플레이어가 획득한 공개 카드에 추가하고 `centerCounters`만큼 본인 칩이 증가합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-074 · L115–115 · 부모 LEGACY-NT-SPEC-071 |   - 남은 카드가 있으면 서버가 다음 카드를 공개하며 현재 플레이어가 계속 선택합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-075 · L116–116 · 부모 LEGACY-NT-SPEC-071 |   - 마지막 카드였다면 최종 점수를 계산하고 `GAME_OVER`로 전환합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-076 · L117–117 | - `END_GAME` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-077 · L118–118 · 부모 LEGACY-NT-SPEC-076 |   - 조건: 방장만 요청할 수 있습니다. | 표현:조건,할 수 있습니다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-078 · L119–119 · 부모 LEGACY-NT-SPEC-076 |   - 결과: 서버가 방장 여부와 현재 게임 상태를 검증한 뒤 전체 게임을 종료 상태로 전환합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-079 · L121–121 | 보유 칩이 0개라면 `REFUSE_CARD`는 사용할 수 없고 `TAKE_CARD`만 허용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Domain Model

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-080 · L125–125 | 서버가 관리하는 게임 상태의 핵심 구조는 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-081 · L127–143 | ```text<br>game<br>  phase<br>  turnOrder&#91;&#93;<br>  activePlayerId<br>  currentCard<br>  centerCounters<br>  deckRemaining<br>  excludedCount<br>  players{<br>    playerId<br>    cards&#91;&#93;<br>  }<br>  winners&#91;&#93;<br>  finalScores{}<br>  endReason<br>``` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-082 · L145–145 | 현재 사용자에게만 제공하는 비공개 상태는 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-083 · L147–151 | ```text<br>viewer<br>  playerId<br>  counters<br>``` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-084 · L153–153 | 서버 내부에서만 유지할 상태는 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-085 · L155–159 | ```text<br>drawDeck&#91;&#93;<br>playerCounters{}<br>excludedCards&#91;&#93; 또는 이에 준하는 비공개 상태<br>``` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-086 · L161–161 | 클라이언트는 앞으로 뽑힐 카드 순서나 제외된 카드 목록을 미리 알 수 없어야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Domain Model > 점수 계산

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-087 · L165–165 | 숫자 카드를 오름차순으로 정렬한 뒤 각 연속 숫자 묶음의 첫 숫자만 합산합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-088 · L167–167 | 예시는 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-089 · L169–174 | ```text<br>보유 카드 = &#91;3, 10, 11, 12, 20&#93;<br>카드 점수 = 3 + 10 + 20 = 33<br>남은 칩 = 5<br>최종 점수 = 28<br>``` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-090 · L176–176 | 동일한 최저 점수를 기록한 플레이어가 여러 명이면 공동 승리로 처리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Platform Boundary > SHARED

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-091 · L182–182 | 다음 책임은 기존 공통 게임 플랫폼을 재사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-092 · L184–184 | - 게임 등록부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-093 · L185–185 | - 승인회원 접근 제어 | 표현:승인 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-094 · L186–186 | - 공통 게임 화면 골격 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-095 · L187–187 | - 방/로비 계약 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-096 · L188–188 | - 버전과 중복 요청 방지 정보를 포함하는 행동 요청 규격 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-097 · L189–189 | - 스냅샷 조정 기능 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-098 · L190–190 | - 재접속 시 새로고침 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-099 · L191–191 | - 연결 상태와 플레이어 표시 상태 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-100 · L192–192 | - 게임 초대 기능 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-101 · L193–193 | - 데이터베이스 통합 검증 계약 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-102 · L195–195 | 게임 초대 기능은 실제 구현과 운영 검증이 끝난 뒤에만 활성화합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Platform Boundary > GAME-LOCAL

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-103 · L199–199 | 다음 책임은 No Thanks! 내부에 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-104 · L201–201 | - 카드 구성과 섞기 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-105 · L202–202 | - 9장 제외 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-106 · L203–203 | - 인원별 초기 칩 수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-107 · L204–204 | - 공개 카드와 카드 위 칩 더미 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-108 · L205–205 | - 카드 거절과 가져오기 가능 여부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-109 · L206–206 | - 플레이어별 비공개 칩 상태 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-110 · L207–207 | - 차례 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-111 · L208–208 | - 연속 숫자 묶음 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-112 · L209–209 | - 최종 점수와 공동 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-113 · L210–210 | - No Thanks! 전용 카드와 획득 카드 화면 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-114 · L211–211 | - 게임 고유 애니메이션과 사운드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-115 · L213–213 | 현재 공통 계약을 변경하지 않고 구현하는 것을 기본으로 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Authority and Persistence

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-116 · L217–217 | 첫 온라인 버전은 서버가 최종 판단하는 구조로 구현합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-117 · L219–219 | 서버가 최종 결정해야 하는 항목은 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-118 · L221–221 | - 방 참가 여부와 준비 상태, 게임 시작 조건 | 표현:조건 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-119 · L222–222 | - 플레이 순서 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-120 · L223–223 | - 카드 섞기 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-121 · L224–224 | - 제외되는 9장 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-122 · L225–225 | - 카드가 공개되는 순서 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-123 · L226–226 | - 현재 공개 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-124 · L227–227 | - 각 플레이어의 보유 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-125 · L228–228 | - 카드 거절 가능 여부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-126 · L229–229 | - 현재 카드 위의 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-127 · L230–230 | - 카드 가져오기 결과 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-128 · L231–231 | - 다음 차례 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-129 · L232–232 | - 최종 점수와 승자 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-130 · L233–233 | - 방장 전용 수동 게임 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-131 · L235–235 | 상태를 변경하는 요청은 기본적으로 다음 값을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-132 · L237–242 | ```text<br>room_id<br>expected_version<br>client_action_id<br>action payload<br>``` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-133 · L244–244 | 서버는 방 단위 잠금과 트랜잭션 안에서 방 참가 여부, 현재 차례, 게임 상태, `expected_version`, `client_action_id`를 검증한 뒤 상태를 한 번만 반영합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Authority and Persistence > 스냅샷 공개 범위

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-134 · L248–248 | 모든 참여자에게 공개하는 상태: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-135 · L250–250 | - 방 정보와 버전, 진행 상태 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-136 · L251–251 | - 플레이 순서 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-137 · L252–252 | - 현재 차례의 플레이어 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-138 · L253–253 | - 현재 공개 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-139 · L254–254 | - 현재 카드 위에 쌓인 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-140 · L255–255 | - 남은 카드 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-141 · L256–256 | - 모든 플레이어가 획득한 공개 숫자 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-142 · L257–257 | - 게임 종료 후 최종 점수와 승자 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-143 · L259–259 | 현재 사용자에게만 공개하는 상태: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-144 · L261–261 | - 본인의 정확한 보유 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-145 · L263–263 | 공개하지 않는 상태: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-146 · L265–265 | - 다른 플레이어의 정확한 보유 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-147 · L266–266 | - 아직 공개되지 않은 카드 순서 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-148 · L267–267 | - 제외된 9장 목록 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-149 · L269–269 | 실시간 이벤트는 상태 변경을 알리는 신호로만 사용하고, 최종 상태는 서버의 권위 있는 스냅샷을 다시 조회해 확인합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-150 · L271–271 | Room/Lobby foundation은 다음 game-local DB 객체를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-151 · L273–273 | - `public.no_thanks_rooms`: room identity, host, waiting/playing/closed 상태, 최대 인원, authoritative `version`, 공개 `game_state` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-152 · L274–274 | - `public.no_thanks_room_players`: active membership, 사이트 프로필 `display_name`, seat, ready, 공개 획득 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-153 · L275–275 | - `public.no_thanks_room_actions`: `client_action_id` 기반 ready/start/gameplay replay와 payload conflict 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-154 · L276–276 | - `public.no_thanks_room_private_state`: 남은 draw deck, 제외된 9장, 플레이어별 비공개 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-155 · L277–277 | - public RPC: `no_thanks_create_room`, `no_thanks_join_room`, `no_thanks_get_my_active_room`, `no_thanks_get_lobby_snapshot`, `no_thanks_set_ready`, `no_thanks_leave_room`, `no_thanks_start_game`, `no_thanks_play_action`, `no_thanks_prepare_rematch` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-156 · L279–279 | 브라우저는 위 테이블을 직접 수정하지 않고 승인회원 RPC만 호출합니다. 특히 `no_thanks_room_private_state`에는 authenticated select 권한을 주지 않으며 Realtime 구독 대상에서도 제외합니다. 공개 room/player 변경은 invalidation 신호로만 사용하고, 실제 화면 상태는 RPC snapshot을 다시 조회해 복원합니다. | 표현:승인 | LOCAL_RULE / L | E-NT | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-157 · L281–281 | 게임 시작 시 서버가 3–7명 조건과 방장/ready 상태를 검증한 뒤 turn order와 3–35 카드 순서를 무작위로 확정합니다. 24장 중 첫 카드만 공개 `game_state`에 두고 남은 23장, 제외된 9장, 모든 플레이어의 칩 수는 private state에 유지합니다. snapshot은 호출자 자신의 칩 수만 `viewer.counters`로 합성하며 다른 플레이어의 칩 수와 미공개 카드 순서는 반환하지 않습니다. | 표현:조건,검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-158 · L283–283 | 게임 진행 중 `REFUSE_CARD`, `TAKE_CARD`, `END_GAME`은 game-local `no_thanks_play_action` RPC가 처리합니다. 모든 요청은 `expected_version`과 `client_action_id`를 받아 room/private state를 같은 트랜잭션에서 잠그고, 현재 차례·보유 칩·방장 권한·중복 요청 여부를 서버가 최종 판정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-159 · L285–285 | - `REFUSE_CARD`: 현재 플레이어만 가능하며 private counter를 1개 차감하고 공개 중앙 칩을 1개 늘린 뒤 다음 플레이어로 차례를 이동합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-160 · L286–286 | - `TAKE_CARD`: 현재 플레이어가 공개 카드를 획득하고 중앙 칩을 private counter에 더합니다. 남은 private deck의 다음 카드만 공개하며 같은 플레이어가 계속 선택합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-161 · L287–287 | - 마지막 카드 `TAKE_CARD`: 공개 획득 카드와 private counter로 최종 점수를 서버에서 계산하고 `GAME_OVER / LAST_CARD_TAKEN`과 공동 승자를 authoritative snapshot에 확정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-162 · L288–288 | - `END_GAME`: 방장만 가능하며 확인 UI를 거친 뒤 `GAME_OVER / HOST_TERMINATED`로 전환합니다. 수동 종료는 최종 점수와 승자를 계산하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-163 · L289–289 | - `GAME_OVER` 이후에는 참가자가 결과를 확인한 뒤 안전하게 세션에서 이탈할 수 있습니다. | 표현:할 수 있습니다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Authority and Persistence > Disconnect / Presence / Reconnect 정책

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-164 · L293–293 | - 브라우저 종료, 네트워크 단절, 모바일 백그라운드 진입 같은 비정상 연결 끊김은 `leave`로 취급하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-165 · L294–294 | - 연결이 끊겨도 room membership, host ownership, turn, 공개/비공개 game state는 서버에 그대로 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-166 · L295–295 | - 현재 차례 플레이어의 연결이 끊겨도 자동으로 turn을 넘기지 않습니다. 해당 사용자가 재접속하면 authoritative snapshot을 다시 받아 같은 turn에서 이어서 진행합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-167 · L296–296 | - 방장의 연결이 끊겨도 다른 사용자에게 방장 권한을 자동 위임하지 않으며 게임도 자동 종료하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-168 · L297–297 | - Supabase Realtime Presence는 roster의 온라인/오프라인 표시용 보조 신호로만 사용합니다. Presence 결과는 ready/start/action 권한이나 server-authoritative game rule 판정에 사용하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-169 · L298–298 | - Presence payload에는 `userId`와 접속 시각만 포함하고, 닉네임·카드·칩·turn state 같은 게임 데이터는 넣지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-170 · L299–299 | - 동일 사용자가 여러 탭으로 접속할 수 있으므로 각 브라우저 client는 고유 Presence key를 사용하고 UI에서는 user id 기준으로 접속 여부를 합칩니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-171 · L300–300 | - `online`, `pageshow`, visible 복귀 시 최종 화면 상태는 Presence가 아니라 snapshot RPC 재조회로 복원합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Authority and Persistence > 재대결 정책

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-172 · L304–304 | 게임 종료 후에는 기존 room과 남아 있는 active player identity를 유지한 채 재대결 준비 상태로 돌아갑니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-173 · L306–306 | - 방장만 결과 화면에서 `재대결 준비`를 시작할 수 있습니다. | 표현:할 수 있습니다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-174 · L307–307 | - 서버는 room code / active membership / 현재 host를 유지하고 room을 `waiting`으로 되돌립니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-175 · L308–308 | - 이전 게임의 public game state, private deck/counter state, 플레이어 획득 카드는 초기화합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-176 · L309–309 | - active player의 ready는 다시 false가 되며 기존 ready/start 권한 검증을 그대로 재사용합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-177 · L310–310 | - 결과 화면에서 재대결을 원하지 않는 플레이어는 안전하게 나갈 수 있습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-178 · L311–311 | - GAME_OVER에서 방장이 먼저 나가면 남은 active player 중 seat가 가장 빠른 플레이어에게 host를 승계해 남은 참가자가 재대결을 계속 선택할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-179 · L312–312 | - 재대결 준비 후 인원이 최소 3명보다 적다면 같은 room code로 새 참가자 또는 이전 이탈자가 다시 참가할 수 있습니다. | 표현:할 수 있습니다 | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-180 · L313–313 | - 기존 room action history는 idempotency/replay 안전성을 위해 유지하되 새 gameplay state는 이전 게임 상태와 분리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### UI / UX Direction

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-181 · L317–317 | - 공통 게임 화면 골격을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-182 · L318–318 | - 데스크톱에서는 중앙에 현재 카드와 칩 더미를 크게 두고, 주변에 플레이어별 획득 카드와 참가자 정보를 배치합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-183 · L319–319 | - 모바일에서는 현재 카드와 선택 버튼을 첫 화면에서 가장 먼저 볼 수 있게 배치하고, 다른 플레이어 정보는 세로 흐름으로 정리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-184 · L320–320 | - 자신의 보유 칩 수는 명확하게 표시하지만 다른 플레이어의 칩 수는 숫자로 보여주지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-185 · L321–321 | - 현재 카드 위에 쌓인 칩 수는 모든 플레이어에게 공개합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-186 · L322–322 | - 핵심 선택 버튼은 두 개만 강조합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-187 · L323–323 · 부모 LEGACY-NT-SPEC-186 |   - `거절하기 (-1)` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-188 · L324–324 · 부모 LEGACY-NT-SPEC-186 |   - `카드 가져오기 (+쌓인 칩)` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-189 · L325–325 | - 칩이 0개라면 거절 버튼을 숨기거나 비활성화하되, 최종 가능 여부는 서버가 다시 검증합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-190 · L326–326 | - 획득한 숫자 카드는 연속된 숫자 묶음을 쉽게 확인할 수 있도록 정렬하고 묶어서 보여줍니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-191 · L327–327 | - 로비와 실제 플레이 화면 모두 `게임 규칙` 진입점을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-192 · L328–328 | - 사이트 프로필 닉네임을 사용하며 게임 안에서 별도의 닉네임 입력이나 변경 기능을 제공하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-193 · L329–329 | - 게임 전체 종료는 방장에게만 제공하며, 확인 화면을 거친 뒤 서버가 방장 권한을 다시 검증하고 최종 상태를 변경합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-194 · L330–330 | - 접속이 끊긴 플레이어는 roster에 `재접속 대기`로 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-195 · L331–331 | - 현재 차례 플레이어가 오프라인이면 자동 진행하지 않고 재접속 후 이어진다는 안내를 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-196 · L332–332 | - 방장이 오프라인이어도 자동 위임 또는 자동 종료가 발생하지 않는다는 안내를 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-197 · L333–333 | - 결과 화면의 재대결은 같은 room/player context를 유지한 채 waiting/ready 상태로 전환된다는 점을 확인 dialog에서 명확히 안내합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Implementation Plan

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-198 · L337–337 | 1. 초기 설계 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-199 · L338–338 · 부모 LEGACY-NT-SPEC-198 |    - `GAME_SPEC.md` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-200 · L339–339 · 부모 LEGACY-NT-SPEC-198 |    - `UI_DESIGN.md` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-201 · L340–340 · 부모 LEGACY-NT-SPEC-198 |    - `DEVELOPMENT.md` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-202 · L341–341 | 2. 순수 규칙 엔진 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-203 · L342–342 · 부모 LEGACY-NT-SPEC-202 |    - 인원별 시작 칩 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-204 · L343–343 · 부모 LEGACY-NT-SPEC-202 |    - 카드 거절 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-205 · L344–344 · 부모 LEGACY-NT-SPEC-202 |    - 카드 가져오기 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-206 · L345–345 · 부모 LEGACY-NT-SPEC-202 |    - 차례 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-207 · L346–346 · 부모 LEGACY-NT-SPEC-202 |    - 연속 숫자 묶음 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-208 · L347–347 · 부모 LEGACY-NT-SPEC-202 |    - 공동 승리 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-209 · L348–348 · 부모 LEGACY-NT-SPEC-202 |    - 게임 종료 전환 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-210 · L349–349 · 부모 LEGACY-NT-SPEC-202 |    - 단위 테스트 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-211 · L350–350 | 3. 승인회원 접근 제어와 공통 게임 화면의 최소 실행 코드 | 표현:승인 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-212 · L351–351 | 4. 방/로비 데이터베이스 및 RPC 기반 구성 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-213 · L352–352 · 부모 LEGACY-NT-SPEC-212 |    - 3–7명 참가 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-214 · L353–353 · 부모 LEGACY-NT-SPEC-212 |    - 준비 완료와 방장 시작 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-215 · L354–354 · 부모 LEGACY-NT-SPEC-212 |    - 서버에서 플레이 순서와 카드 순서 초기화 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-216 · L355–355 · 부모 LEGACY-NT-SPEC-212 |    - 데이터베이스 통합 검증 계약 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-217 · L356–356 | 5. 실제 방/로비 사용자 흐름 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-218 · L357–357 | 6. 서버 권위 게임 행동 RPC | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-219 · L358–358 · 부모 LEGACY-NT-SPEC-218 |    - 카드 거절 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-220 · L359–359 · 부모 LEGACY-NT-SPEC-218 |    - 카드 가져오기와 다음 카드 공개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-221 · L360–360 · 부모 LEGACY-NT-SPEC-218 |    - 최종 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-222 · L361–361 | 7. 비공개 상태 보호, 재접속, 실시간 변경 감지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-223 · L362–362 | 8. 상세 규칙 모달, 게임 종료, 게임 후 화면 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-224 · L363–363 | 9. 게임 초대 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-225 · L364–364 | 10. 운영 마이그레이션, 다중 사용자 점검, 기능 활성화 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D09 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-226 · L365–365 | 11. 출시 마무리와 게임 플랫폼 회고 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Validation Plan

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-227 · L369–369 | - 게임 규칙 단위 테스트 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-228 · L370–370 · 부모 LEGACY-NT-SPEC-227 |   - 인원별 시작 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-229 · L371–371 · 부모 LEGACY-NT-SPEC-227 |   - 칩이 0개일 때 카드 가져오기 강제 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-230 · L372–372 · 부모 LEGACY-NT-SPEC-227 |   - 거절 시 본인 칩 감소, 중앙 칩 증가, 다음 차례 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-231 · L373–373 · 부모 LEGACY-NT-SPEC-227 |   - 카드 가져오기 시 중앙 칩 획득, 현재 플레이어 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-232 · L374–374 · 부모 LEGACY-NT-SPEC-227 |   - 마지막 카드 획득 후 게임 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-233 · L375–375 · 부모 LEGACY-NT-SPEC-227 |   - 연속 숫자 묶음 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-234 · L376–376 · 부모 LEGACY-NT-SPEC-227 |   - 떨어져 있는 숫자 묶음의 개별 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-235 · L377–377 · 부모 LEGACY-NT-SPEC-227 |   - 남은 칩 수 차감 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-236 · L378–378 · 부모 LEGACY-NT-SPEC-227 |   - 공동 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-237 · L379–379 · 부모 LEGACY-NT-SPEC-227 |   - 입력 상태를 직접 변경하지 않는지 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-238 · L380–380 | - 게임 플랫폼 공통 계약과 관리 규칙 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-239 · L381–381 | - 데이터베이스 통합 계약의 필수 시나리오 11개 검증 | 표현:검증,필수 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-240 · L382–382 | - 재대결의 same-room/player 유지, gameplay/private state reset, ready/start 권한, reconnect 복원 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-241 · L383–383 | - 다른 플레이어의 칩 수가 노출되지 않는지 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-242 · L384–384 | - 미공개 카드 순서와 제외 카드가 노출되지 않는지 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-243 · L385–385 | - 오래된 버전 요청, 같은 요청의 중복 전송, 동시 요청 충돌 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-244 · L386–386 | - 재접속 시 서버 상태 복원 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-245 · L387–387 | - disposable Supabase에서 3개 독립 인증 세션의 자연 종료까지 다중 클라이언트 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-246 · L388–388 | - disposable Supabase에서 7개 독립 인증 세션의 full refuse cycle, private counter 격리, take/reconnect 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-247 · L389–389 | - 실제 브라우저 Presence join/leave, host/active-player reconnect, 모바일 background/foreground는 release manual gate로 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-248 · L390–390 | - 모바일과 데스크톱에서 규칙 모달과 행동 버튼 배치 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-249 · L391–391 | - release gate 전체 상태는 `RELEASE_CHECKLIST.md`에서 추적 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Open Questions / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-250 · L395–395 | - 특수 카드 확장은 기본 규칙 첫 버전을 출시한 뒤 별도 단계에서 검토합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-251 · L396–396 | - 명시적 leave는 WAITING 또는 GAME_OVER에서만 허용하고 PLAYING 중 비정상 disconnect는 membership을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-252 · L397–397 | - 방장 비정상 disconnect는 권한 위임이나 자동 종료 없이 재접속을 기다리는 정책으로 확정했습니다. 명시적 `게임 종료`만 방장 전용 서버 액션으로 처리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-253 · L398–398 | - 재대결은 같은 room/player context를 유지하면서 이전 gameplay/private state만 초기화하고 기존 ready/start 흐름을 재사용하는 방식으로 확정했습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-254 · L399–399 | - 운영 환경에서 초대 기능을 활성화하는 시점은 마이그레이션, 데이터베이스 통합 검증, 실제 멀티플레이 점검 이후로 미룹니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

## NT-DEV — `games/no-thanks/DEVELOPMENT.md`

- source: [games/no-thanks/DEVELOPMENT.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/DEVELOPMENT.md)
- blob: `c5167e1dc6004d663a58d304e2d8604acfaf3f68`; 원문 332줄; 상태 `GAME_LOCAL`; 291 관리단위 / 72 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### No Thanks! 개발 진행

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-001 · L3–4 | &gt; 이 문서는 현재 개발 상태를 다음 작업자나 다음 채팅으로 전달하기 위한 인수인계 문서입니다.<br>&gt; 게임 규칙과 기능 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다. UI/presentation은 `UI_DESIGN.md` adoption baseline과 `UI_DECISIONS.md`의 최신 non-superseded override를 함께 적용합니다. 이 문서에 이미 남아 있는 UI Phase 기록은 과거 인수인계 이력으로 보존하되 이후 세부 UI 이력은 `UI_DECISIONS.md`에 기록합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | D04 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Current Status

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-002 · L8–8 | - Phase: Release candidate — 첫 공개 버전의 core rules / Room-Lobby / server-authoritative gameplay / reconnect-rematch / board presentation / audio polish 구현 완료. 남은 범위는 새 기능 개발 단계가 아니라 release gate와 activation입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-003 · L9–9 | - Status: RELEASE_CANDIDATE | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-004 · L10–10 | - Active branch: `main` (이 checkpoint PR 병합 후 handoff baseline) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-005 · L11–11 | - Current main baseline: `616626f53f5fb8554fff8df2e86cc50a22e8aefa` (PR #397 merge) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-006 · L12–12 | - Phase A–D merge baseline: `66531c7820285b37dc8d1e2961156ab95560758f` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-007 · L13–13 | - Design baseline: `UI_DESIGN.md` + `UI_DECISIONS.md` NT-UI-001~013 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-008 · L14–14 | - Registry capability: `online=false / local=false / invite=false / presence=false` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-009 · L15–15 | - 마지막 기록: 2026-09-25 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Completed

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-010 · L19–19 | - 2026-09-25 PR #396을 병합해 출시 전 실제 플레이에서 발견된 card interaction/presentation 흐름을 안정화했습니다. opening 직후 첫 TAKE/거절이 새로고침 없이 동작하도록 하고, next-card deal 출발 전 draw-deck source를 유지하며, TAKE 카드를 오름차순 최종 위치에 직접 landing하고 기존 보유 카드는 FLIP-style slide로 공간을 만들도록 정리했습니다. 개인 hand는 실제 가용 폭을 측정해 펼친 상태를 우선하고 필요할 때만 약 5px 단위로 overlap을 높이며 run 경계 여백을 별도로 유지합니다. focus/visibility 전환으로 이미 시작한 deal이 재생되는 문제도 차단했습니다. merge commit은 `2666267f673e2035ceb678ab950cc889ee188c09`입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-011 · L20–20 | - 2026-09-25 PR #397을 병합해 Rules Guide의 0칩 문구를 **플레이어 본인이 보유한 칩** 기준으로 명확히 하고, lobby/gameplay BGM 역할을 `Covert Affair / Hard Boiled`로 확정했습니다. opening shuffle+chip distribution, TAKE card slide+chip stack, refuse chip `스윽 → 착` tactile SFX를 game-local Web Audio로 추가했으며 TAKE 카드/회수 칩 효과음은 사용자 검토 후 기존 대비 약 2배로 조정했습니다. gameplay/RPC/DB authority는 변경하지 않았습니다. merge commit은 `616626f53f5fb8554fff8df2e86cc50a22e8aefa`입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-012 · L21–21 | - 2026-09-25 기준 사용자가 실제 멀티플레이 환경에서 여러 차례 플레이 테스트를 수행했고, 현재 첫 공개 버전에 필요한 추가 core 개발 단계는 식별되지 않았습니다. 이 기록은 **기능 구현 완료 checkpoint**이며, `RELEASE_CHECKLIST.md`의 세부 browser/production gate는 확인된 항목만 별도로 완료 처리합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-013 · L22–22 | - 2026-09-24 통합 PR #394를 최신 `main`에서 충돌 검토한 뒤 병합했습니다. PR #390 final-take presentation, PR #391 game-start opening presentation, PR #389 release-blocker 안정화 변경을 하나의 통합 브랜치에서 순차 결합했고, 최신 main의 No Thanks! BGM 변경을 보존한 채 merge commit `91d9ca42b6340888f6c9680bda2dcce604da6ed3`으로 main에 반영했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-014 · L23–23 | - PR #389의 `20260924073500_no_thanks_randomized_draw_order.sql`을 통합해 `generate_series(3, 35)`가 실제 행을 만든 뒤 `ORDER BY random()`이 평가되도록 start RPC를 보정했습니다. disposable Game DB integration에서 3~35 전체 33장이 정확히 한 번씩 존재하면서 canonical ascending order와 다른 실제 shuffled order를 저장하는 회귀 테스트를 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-015 · L24–24 | - 게임 시작 presentation은 WAITING 테이블의 고정 deck/chip 위치, 2.5초 안내 카드 2장, 중앙 chip bank의 동시 배분, 4단계 card shuffle, 정돈 직후 기존 first-card deal/flip으로 연결되는 순서를 확정했습니다. viewer 시작 칩은 개인 패널의 최종 chip-pile 슬롯에 하나씩 쌓이고, 다른 플레이어 몫은 seat avatar에 닿으면서 흡수되도록 연출합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-016 · L25–25 | - TAKE/종료 presentation lifecycle을 보강했습니다. 마지막 카드 TAKE에서는 원형 테이블의 source card를 flight 시작과 동시에 숨겨 중복 잔상을 제거하고, 방장 수동 종료에서는 실행 중 deal animation을 cancel하여 종료 이후 카드 공개 애니메이션이 재생되지 않도록 했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-017 · L26–26 | - 개인 패널과 FINAL TABLE의 많은 획득 카드는 최대 24장까지 고려합니다. 일반 hand overlap은 장수에 따라 더 타이트해지고, 결과 rack은 실제 available width와 run 시작 수를 측정해 overlap/run margin을 동적으로 다시 계산하여 overflow를 방지합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-018 · L27–27 | - 2026-09-23 PR #378을 main에 병합해 muted blue environmental identity, compact `LIVE ROOM` header, first-place celebration overlay, `FINAL TABLE` result plates를 현재 디자인 baseline으로 확정했습니다. 세부 디자인 결정은 `UI_DECISIONS.md`의 NT-UI-001~004가 소유합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-019 · L28–28 | - 2026-09-23 PR #381을 최신 main과 동기화한 뒤 main에 병합했습니다. in-room reconnecting banner를 조용히 처리하는 presentation, centered `FINAL WINNER` card, No Thanks! tabletop Rules Guide를 구현했고 NT-UI-005~007로 기록했습니다. merge commit은 `c43f96f984b90049b59b163bffd16c9a5fb5cf04`입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-020 · L29–29 | - PR #381에서 카드 공개 순서의 서버 권위 random deck 계약을 다시 검증했습니다. start RPC는 3~35의 33장을 서버에서 무작위 정렬한 뒤 24장을 draw deck으로 사용하고 9장을 비공개 제외하며, 이후 공개 카드는 private draw deck 순서대로 소비합니다. 결과/보유 카드가 오름차순으로 보이는 것은 획득 카드 정렬 presentation/state 정리 때문이며 reveal 순서를 정렬하는 로직은 아닙니다. 기존 gameplay DB 로직은 수정하지 않고 회귀 테스트만 추가했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-021 · L30–30 | - 최신 Game Platform의 Rules Guide Presentation 공통 규칙과 No Thanks! `NT-UI-007`의 책임 경계가 일치함을 확인했습니다. 규칙 사실은 `GAME_SPEC.md`/server-authoritative gameplay가 소유하고, 규칙 modal의 game-local presentation은 `UI_DESIGN.md + UI_DECISIONS.md`가 소유합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-022 · L31–31 | - Board UI Phase A–D 작업 PR #364 (`feature/no-thanks-board-ui-phase1-a-d`)을 최신 `main`과 충돌 없이 재동기화한 뒤 2026-09-22에 병합했습니다. 병합 commit은 `66531c7820285b37dc8d1e2961156ab95560758f`입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-023 · L32–32 | - WAITING / PLAYING 공통 대형 board scene, 3–7인 viewer 6시 기준 좌석 회전, compact HUD, site profile avatar, 실제 타원 table border 중심선 기반 좌석 geometry를 현재 main baseline으로 확정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-024 · L33–33 | - 개인 패널의 `내 보유 칩`, 정확한 own chip count/cluster, 오름차순 획득 카드, 동적 overlap, corner number, top-only hover/focus를 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-025 · L34–34 | - TAKE_CARD presentation은 중앙 공개 카드 → 내 보유 카드, 중앙 칩 batch → 내 보유 칩, 이후 draw deck → 다음 current card 순서로 handoff하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-026 · L35–35 | - TAKE 카드/칩 landing과 다음 deal lifecycle을 분리해 same-snapshot rerender 중 획득 카드가 잠깐 사라지거나 이전 카드가 다시 숨겨지는 race condition을 수정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-027 · L36–36 | - 카드 landing 대상은 generic hidden slot이 아니라 `data-card-value` 기준 최신 DOM으로 한정하고, `takeCardLanded / takeChipsLanded` 상태 이후에는 authoritative final hand/chip state를 유지하도록 했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-028 · L37–37 | - deal presentation lifecycle을 `started → running → completed`로 관리하고 실제 landing 전까지 current card를 `is-awaiting-deal`로 숨겨 새 카드와 flight card가 겹치는 문제를 막았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-029 · L38–38 | - `roomId:version:currentCard:deckRemaining` 기반 `lastSettledDealKey`를 기록해 브라우저 최소화/다른 탭 이동 후 `visibilitychange / pageshow` refresh가 발생해도 이미 공개 완료된 카드의 deal animation이 재생되지 않도록 수정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-030 · L39–39 | - 중앙 칩 획득은 TAKE 시점 center count를 고정 batch로 소비하고 약 620ms + 26ms stagger의 단일 Web Animation batch로 처리해 중복/추가 칩처럼 보이는 tail 현상을 정리했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-031 · L40–40 | - draw deck → current card는 약 760ms fixed flight/flip + 약 130ms settle/handoff로 유지하며, 실제 current card DOM은 landing 시점에만 공개합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-032 · L41–41 | - Phase A–D 작업 동안 기능/DB authority와 same-room rematch lifecycle은 기존 main 구현을 보존했고, UI/presentation 결정은 `UI_DESIGN.md`에 반영했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-033 · L44–44 | - 최신 `main` `fda8e2294356...`의 Game Platform Development/UI 규칙과 No Thanks! same-room rematch lifecycle을 현재 UI 작업 브랜치에 통합했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-034 · L45–45 | - 당시 UI_DESIGN 중심 규칙에 따라 UI/presentation 결정을 `UI_DESIGN.md`에 정리했고, #364에서 중복 추가했던 rematch migration/옛 rematch error 계약은 최신 main 구현을 따르도록 제거했습니다. 현재는 해당 문서를 adoption baseline으로 보존하고 후속 결정은 `UI_DECISIONS.md`가 담당합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-035 · L46–46 | - WAITING / PLAYING 공통 대형 board scene, 중앙 타원 table, 3–7인 viewer 6시 고정 표현 회전, compact HUD, site profile avatar 좌석을 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-036 · L47–47 | - 개인 패널에 정확한 내 칩 수와 visual chip cluster, 오름차순 보유 카드, 동적 overlap, corner number, top-only hover/focus를 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-037 · L48–48 | - 현재 카드 직접 클릭으로 take, 중앙 `칩 1개 내기`로 refuse를 수행하며 기존 server-authoritative gameplay action 계약을 그대로 사용합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-038 · L49–49 | - draw deck → current card 공개는 약 760ms fixed flight/flip + 약 130ms landing handoff로 구성했고, chip 제출은 약 780ms flight + 100ms dwell 뒤 중앙 pile/count를 반영합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-039 · L50–50 | - take/refuse 성공 경로는 silent busy lock을 사용해 authoritative result snapshot 기준 전체 render를 1회로 줄였습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-040 · L51–51 | - main의 GAME_OVER host succession / same-room rematch / replacement 참가 가능 계약은 UI 변경보다 우선해 그대로 유지했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-041 · L53–53 | - Game Platform 공통 재대결 규칙에 맞춰 새 room 생성 방식 대신 기존 room/player context를 유지하는 authoritative rematch lifecycle로 전환했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-042 · L54–54 | - `no_thanks_prepare_rematch` RPC가 GAME_OVER → waiting reset, private state/획득 카드 초기화, ready/start 재사용을 처리하도록 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-043 · L55–55 | - GAME_OVER에서 방장이 나가면 남은 active player에게 host를 승계하도록 terminal leave 정책을 보완했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-044 · L56–56 | - rematch lifecycle을 Game Platform DB/Test Contract 필수 시나리오로 승격하고 Can't Stop / No Thanks!가 각각 자기 RPC로 계약을 증명하도록 통합 테스트를 추가했습니다. | 표현:필수 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-045 · L58–58 | - Game Platform UI 규칙 도입에 맞춰 No Thanks!의 원본 디자인 조사 방향, Visual Identity, 카드/칩 layout, motion, result/rematch, responsive 구현 기준을 `UI_DESIGN.md`에 분리해 관리하기 시작했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-046 · L59–59 | - 규칙 엔진 재정렬 PR #347이 병합된 최신 `main` (`049493f8...`)을 기준으로 Phase 3 작업 브랜치를 생성했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-047 · L60–60 | - 기존 #343/#344의 공통 foundation 전체 Registry 목록/개수 고정 변경은 새 Game Platform 규칙에 맞지 않아 가져오지 않았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-048 · L61–61 | - 저장소 `AGENTS.md`와 게임 플랫폼 신규 게임 개발 규칙을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-049 · L62–62 | - `games/shared/`의 공통 계약과 데이터베이스 통합 검증 계약을 확인했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-050 · L63–63 | - AMIGO 공식 No Thanks! 영문 규칙서를 기준으로 첫 버전 규칙을 확정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-051 · L64–64 | - 첫 버전은 3–7인 기본 규칙으로 구현하며 2024년 재판의 22장 특수 카드 확장은 후속 개발 단계로 분리했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-052 · L65–65 | - 공식 규칙의 보유 칩 비공개 원칙을 사용자별 비공개 스냅샷 요구사항에 반영했습니다. | 표현:원칙 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-053 · L66–66 | - 온라인 환경의 선 플레이어는 서버가 무작위로 결정하도록 확정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-054 · L67–67 | - 전체 게임 종료 권한은 방장만 가지도록 확정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-055 · L68–68 | - `games/no-thanks/rules.js`에 순수 규칙 엔진을 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-056 · L69–69 | - 3–5인 11개, 6인 9개, 7인 7개의 시작 칩 계산을 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-057 · L70–70 | - 서버가 준비한 24장 카드 구성을 검증하고 첫 공개 카드와 남은 카드 상태를 초기화하도록 구현했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-058 · L71–71 | - 카드 거절 시 칩 1개 차감, 중앙 칩 증가, 다음 플레이어 이동을 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-059 · L72–72 | - 보유 칩이 0개라면 카드 거절을 허용하지 않고 카드 가져오기만 가능하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-060 · L73–73 | - 카드 가져오기 시 중앙 칩을 획득하고 같은 플레이어가 다음 카드도 계속 처리하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-061 · L74–74 | - 연속된 숫자 묶음에서는 가장 낮은 숫자만 합산하고 남은 칩 수를 차감하는 점수 계산을 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-062 · L75–75 | - 마지막 카드 획득 시 최종 점수와 공동 승자를 계산하고 `GAME_OVER`로 전환하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-063 · L76–76 | - 규칙 엔진이 입력 상태를 직접 변경하지 않고 새 상태를 반환하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-064 · L77–77 | - 규칙 엔진 단위 테스트 12개를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-065 · L78–78 | - 실행 코드가 시작됨에 따라 게임 등록부에 `no-thanks`를 등록했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-066 · L79–79 | - No Thanks! Registry/capability 검증은 공통 foundation이 아니라 게임별 `tests/game-platform-no-thanks-registry.test.js`에서 수행하도록 새 구조에 맞췄습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-067 · L80–80 | - 아직 실제 제공 전이므로 `online`, `local`, `invite`, `presence` 기능은 모두 비활성 상태로 유지했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-068 · L81–81 | - `games/no-thanks/index.html`에 신규 게임 전용 entry page를 추가하고 shared `game-shell.css`를 명시적으로 opt-in 했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-069 · L82–82 | - `createGameAccessGate`를 사이트 `initializeAuth / getAuthState / subscribeAuth`와 연결해 로그인/승인회원 경계를 적용했습니다. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-070 · L83–83 | - 승인된 사용자만 Common Game Shell을 볼 수 있고, 미로그인/미승인 사용자는 사이트 공통 로그인/승인 상태 화면으로 이동할 수 있게 했습니다. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-071 · L84–84 | - 게임별 닉네임 입력을 만들지 않고 사이트 프로필의 `display_name`만 플레이어 표시 이름으로 사용하도록 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-072 · L85–85 | - 프로필 닉네임이 누락된 경우 임시 이름을 생성하지 않고 마이페이지 확인을 안내합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-073 · L86–86 | - 아직 방/로비 서버가 없으므로 방 생성·참가·게임 시작 기능을 노출하지 않고 준비 화면임을 명시했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-074 · L87–87 | - 플레이 전과 화면 하단에서 다시 열 수 있는 No Thanks! 기본 규칙 dialog를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-075 · L88–88 | - No Thanks! entry/shell 전용 정적 계약 테스트를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-076 · L89–89 | - 최신 `main` 커밋 `220bf820...`에서 Phase 4 작업 브랜치를 생성했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-077 · L90–90 | - `no_thanks_rooms / no_thanks_room_players / no_thanks_room_actions / no_thanks_room_private_state` DB foundation을 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-078 · L91–91 | - 3–7인 create/join/snapshot/ready/leave/start RPC와 explicit grant/RLS 경계를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-079 · L92–92 | - 방 생성/참가 시 클라이언트 닉네임을 받지 않고 서버가 승인된 사이트 프로필 `display_name`을 확정하도록 구현했습니다. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-080 · L93–93 | - start RPC가 최소 3명, 방장 권한, non-host ready 상태, expected version을 서버에서 검증하도록 구현했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-081 · L94–94 | - start 시 서버가 turn order와 3–35 카드 순서를 무작위 확정하고 첫 공개 카드만 public state에 노출하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-082 · L95–95 | - 남은 23장, 제외된 9장, 플레이어별 칩 수는 별도 private table에 저장하고 authenticated select/Reatime 대상에서 제외했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-083 · L96–96 | - snapshot은 호출자 자신의 칩 수만 `viewer.counters`로 합성하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-084 · L97–97 | - ready/start에 `client_action_id` + request payload를 기록해 동일 요청 replay는 같은 snapshot을 반환하고 다른 payload 재사용은 거부하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-085 · L98–98 | - shared `defineRoomLobbyAdapter` 계약에 맞는 `createNoThanksRoomLobbyAdapter`를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-086 · L99–99 | - 당시 No Thanks! migration을 disposable Game DB integration harness에 포함하고 플랫폼 필수 10개 시나리오 테스트를 추가했습니다. 이후 same-room rematch 계약이 추가되어 현재 테스트는 11개 필수 시나리오를 구현합니다. | 표현:필수 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-087 · L100–100 | - Phase 4 PR #353 head를 부모로 별도 Phase 5 브랜치를 생성해 DB foundation과 runtime 연결 변경을 분리했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-088 · L101–101 | - No Thanks! entry에 Supabase browser client를 로드하고 `createNoThanksRoomLobbyAdapter`를 실제 runtime에 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-089 · L102–102 | - 방 만들기에서 최대 인원을 3–7명으로 선택하고, 코드 참가에서는 6자리 방 코드만 입력하도록 사용자 흐름을 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-090 · L103–103 | - 게임별 닉네임 입력은 추가하지 않았고 서버가 사이트 프로필 `display_name`을 확정하는 기존 권한 경계를 유지했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-091 · L104–104 | - waiting room에서 authoritative snapshot의 room code, 인원, ready 상태, host를 Common Game Shell roster에 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-092 · L105–105 | - 일반 플레이어는 준비/준비 취소를, 방장은 최소 3명 + 일반 플레이어 전원 ready일 때만 게임 시작을 요청하도록 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-093 · L106–106 | - shared `createSnapshotCoordinator`와 `createReconnectRefreshTriggers`를 사용해 Realtime payload는 invalidation으로만 소비하고 RPC snapshot을 다시 읽도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-094 · L107–107 | - online/pageshow/visibility 복귀 시 최신 snapshot을 다시 조회하고, host가 waiting room을 닫아 `ROOM_NOT_FOUND`가 되면 다른 참가자도 entry로 복귀하도록 처리했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-095 · L108–108 | - 게임 시작 후 서버가 확정한 첫 카드, 본인 칩 수, 남은 카드 수를 읽기 전용 preview로 표시하고 `REFUSE_CARD / TAKE_CARD` UI는 아직 노출하지 않았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-096 · L109–109 | - No Thanks! 전용 lobby controller/runtime model 테스트를 추가하고 기존 shell 계약 테스트를 online lobby 단계에 맞게 갱신했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-097 · L110–110 | - 최신 `main` 커밋 `f47bf8bbb9d016c706b1c289cf4081646ddbabcd`에서 Phase 6 작업 브랜치를 생성했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-098 · L111–111 | - 기존 Room/Lobby foundation migration을 수정하지 않고 후속 gameplay migration `20260922055300_no_thanks_gameplay_actions.sql`을 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-099 · L112–112 | - game-local `no_thanks_play_action` RPC가 `refuse_card / take_card / end_game`을 서버 권위로 처리하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-100 · L113–113 | - gameplay action도 `expected_version + client_action_id`를 사용하고 room/private state를 transaction 안에서 잠가 stale/duplicate/concurrent action을 방어합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-101 · L114–114 | - `REFUSE_CARD`에서 현재 차례와 private counter를 서버가 검증하고 칩 1개 차감, 중앙 칩 증가, 다음 플레이어 이동을 구현했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-102 · L115–115 | - `TAKE_CARD`에서 공개 카드 획득, 중앙 칩 수령, private draw deck의 다음 카드 공개, 같은 플레이어 turn 유지를 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-103 · L116–116 | - 마지막 카드 획득 시 공개 카드와 private counter를 기준으로 연속 카드 점수, 최종 점수, 공동 승자를 서버에서 계산해 `GAME_OVER / LAST_CARD_TAKEN`을 확정합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-104 · L117–117 | - 방장 전용 `END_GAME`을 추가하고 확인 dialog 뒤 서버가 방장 권한을 다시 검증해 `GAME_OVER / HOST_TERMINATED`으로 전환하도록 구현했습니다. 수동 종료 시 최종 점수와 승자는 계산하지 않습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-105 · L118–118 | - 자연 종료 또는 방장 수동 종료 후에는 결과방에서 참가자가 안전하게 leave할 수 있도록 terminal leave 경계를 확장했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-106 · L119–119 | - `createNoThanksGameplayAdapter`를 추가하고 shared Room/Lobby 계약은 변경하지 않은 채 game-local controller에 gameplay command만 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-107 · L120–120 | - 실제 플레이 화면에 현재 카드, 중앙 칩, 본인 칩, 남은 카드, 모든 플레이어의 공개 획득 카드와 현재 차례를 표시하도록 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-108 · L121–121 | - 내 차례에서만 거절/가져오기 버튼을 활성화하고, 본인 칩이 0개라면 거절 버튼을 비활성화해 강제 가져오기 상태를 명확히 표시합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-109 · L122–122 | - 자연 종료 결과 화면에 최종 점수와 공동 승자를 표시하고, 방장 수동 종료는 별도 종료 사유를 표시하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-110 · L123–123 | - gameplay adapter/controller/runtime/shell 정적 테스트와 disposable Supabase gameplay DB integration 시나리오를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-111 · L124–124 | - 동일 `client_action_id` gameplay 요청이 동시에 두 번 도착하는 경우에도 room lock 획득 후 action row를 다시 확인해 첫 authoritative snapshot으로 수렴하도록 idempotency 경계를 보강했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-112 · L125–125 | - concurrent duplicate retry가 둘 다 동일 snapshot을 반환하고 room version은 한 번만 증가하는 disposable DB integration 회귀 테스트를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-113 · L126–126 | - 최신 `main` 커밋 `20bdc844d5bf3012dad38146814a09ae6e057257`에서 Phase 7 안정화 브랜치를 생성했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-114 · L127–127 | - Supabase Realtime Presence를 사용하는 game-local `createNoThanksPresenceAdapter`를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-115 · L128–128 | - Presence key는 브라우저 client 단위로 생성하고 payload에는 `userId / onlineAt`만 전송해 게임 상태나 비공개 칩 정보를 싣지 않도록 했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-116 · L129–129 | - 같은 사용자가 여러 탭으로 접속한 경우 Presence state를 user id 기준으로 합쳐 한 명의 온라인 사용자로 표시하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-117 · L130–130 | - Presence는 온라인/오프라인 UI 표시 전용이며 ready/start/turn/action 권한의 authoritative 조건에는 사용하지 않도록 분리했습니다. | 표현:조건 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-118 · L131–131 | - 브라우저 `offline` 이벤트에서는 게임 상태를 변경하지 않고 connection banner만 오프라인으로 전환하며, `online / pageshow / visibility` 복귀 시 기존 shared reconnect refresh 경로로 authoritative snapshot을 다시 조회합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-119 · L132–132 | - 브라우저 종료·네트워크 단절 시 membership/turn/host 권한을 유지하고 재접속 시 기존 active room snapshot으로 복원하는 정책을 확정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-120 · L133–133 | - 방장이 연결을 잃어도 자동 방장 위임이나 자동 게임 종료를 하지 않고, 현재 차례 플레이어가 끊겨도 turn을 유지해 재접속 후 이어서 진행하도록 UI 안내를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-121 · L134–134 | - roster에 Presence 기반 `재접속 대기` 상태와 현재 차례 표시를 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-122 · L135–135 | - 재대결은 같은 room code와 active membership을 유지하면서 public/private gameplay state를 초기화하고 waiting/ready 상태로 돌아가는 방식으로 변경했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-123 · L136–136 | - 재대결 준비는 host-only authoritative RPC이며 version/client_action_id 경계를 사용하고, 이전 private deck/counter와 획득 카드를 초기화합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-124 · L137–137 | - GAME_OVER에서 방장이 이탈하면 다음 active seat로 host를 승계해 남은 참가자의 재대결 흐름을 유지합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-125 · L138–138 | - Presence lifecycle, 다중 탭 user merge, offline→online refresh, same-room rematch/reconnect 정책에 대한 회귀 테스트를 유지·확장했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-126 · L139–139 | - 최신 `main` 커밋 `2454e5e9d8a76a26002f794f8338255b62aababb`에서 Phase 8 검증 브랜치를 생성했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-127 · L140–140 | - disposable Supabase에서 3개의 독립 승인회원 인증 세션이 같은 room에 참가해 각자 비공개 칩 snapshot을 받고, 세 플레이어가 한 번씩 거절한 뒤 자연 종료까지 진행하는 다중 클라이언트 통합 시나리오를 추가했습니다. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-128 · L141–141 | - 3인 시나리오에서 명시적 leave 없이 `get_my_active_room`으로 재접속했을 때 최신 room/version/turn/center counter가 복원되는지 검증하도록 했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-129 · L142–142 | - disposable Supabase에서 7개의 독립 승인회원 인증 세션이 모두 참가·준비·시작하고, 일곱 플레이어가 한 번씩 거절해 full turn cycle을 만든 뒤 각 viewer의 private counter가 6으로 독립 유지되는지 검증하는 시나리오를 추가했습니다. | 표현:승인,검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-130 · L143–143 | - 7인 시나리오에서 7개 중앙 칩을 현재 플레이어가 가져간 뒤 본인 칩이 13으로 계산되고 같은 플레이어가 turn을 유지하는지 검증하도록 했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-131 · L144–144 | - 3인·7인 모두 다른 플레이어 counter가 public player snapshot에 노출되지 않는지 반복 검증하도록 했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-132 · L145–145 | - 자동 검증과 실제 브라우저/운영 검증을 분리한 `games/no-thanks/RELEASE_CHECKLIST.md`를 추가했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-133 · L146–146 | - 실제 브라우저 Presence join/leave, 모바일 background 복귀, host/active-player disconnect는 자동 DB 테스트가 대체하지 않는 manual release gate로 명시했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-134 · L147–147 | - 운영 Supabase 프로젝트와 main의 `SUPABASE_URL`이 동일한 프로젝트를 가리키는 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-135 · L148–148 | - 운영 DB에 `no_thanks_room_lobby_foundation`과 `no_thanks_gameplay_actions` migration을 순서대로 적용했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-136 · L149–149 | - 브라우저 Realtime invalidation을 위해 공개 테이블 `no_thanks_rooms / no_thanks_room_players`만 `supabase_realtime` publication에 등록하는 migration을 추가·적용했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-137 · L150–150 | - `no_thanks_room_actions / no_thanks_room_private_state`는 Realtime publication에 포함하지 않았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-138 · L151–151 | - 운영 권한 검증에서 anon의 create/play RPC 실행이 차단되고 authenticated만 허용되는 것을 확인했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-139 · L152–152 | - private state table은 anon/authenticated SELECT가 모두 차단되고 공개 room/player table은 RLS가 활성화된 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-140 · L153–153 | - 내부 `private.no_thanks_snapshot` helper가 authenticated에 기본 EXECUTE 권한을 가지고 있는 것을 발견해, private helper 권한 hardening migration을 추가·적용했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-141 · L154–154 | - hardening 후 snapshot/generate/profile/card-score helper는 anon/authenticated 직접 실행이 차단되고, RLS에 필요한 `private.no_thanks_is_room_member`만 authenticated에 유지되는 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-142 · L155–155 | - 운영 적용 후 Supabase security/performance advisor를 다시 실행해 No Thanks! 관련 신규 critical/error 항목이 없음을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Current Work

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-143 · L159–159 | - 첫 공개 버전의 core rules, Room/Lobby, server-authoritative gameplay, Presence/reconnect, same-room rematch, 운영 DB hardening, Phase A–D board UI, opening/final-take/result-rack, sorted hand interaction, BGM/SFX까지 `main`에 반영했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | D07, U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-144 · L160–160 | - 기능 checkpoint 기준으로 **추가 core 개발 phase는 없습니다.** 이후 작업은 `RELEASE_CHECKLIST.md`에 남아 있는 실제 운영 browser/rematch/reconnect/production gate와 Registry activation이며, 새 기능 구현과 분리합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | D09, U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-145 · L161–161 | - 디자인 트랙은 `UI_DECISIONS.md`의 `FINAL / DESIGN_CLOSEOUT`이 기준입니다. NT-UI-001~013이 현재 main의 active design baseline이며 Phase E 후보는 release blocker가 아닌 post-release follow-up입니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-146 · L162–162 | - Registry의 No Thanks! capability는 아직 모두 비활성입니다. release gate 완료 전에는 `online/presence`를 선행 활성화하지 않고, `invite`는 별도 구현·검증 전까지 비활성으로 유지합니다. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | D09, C01/F02 | I / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-147 · L163–163 | - 이후 버그/UX 개선이 필요해지면 이 release-candidate baseline을 출발점으로 최신 `main`에서 새 작업 브랜치를 생성하며, 이미 종료된 과거 브랜치는 재사용하지 않습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Next Work

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-148 · L167–167 | 1. `RELEASE_CHECKLIST.md`의 아직 미확인인 same-room rematch / Presence / reconnect / 실제 데스크톱·모바일 browser gate를 최종 확인합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07, C01/F02 | L / 기존 보존/6 영향확인 | 변경 없음; F02 상태 충돌 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-149 · L168–168 | 2. 문서상 pending인 `20260924073500_no_thanks_randomized_draw_order.sql`의 운영 Supabase 적용/migration history와 승인회원 create/join/snapshot/gameplay smoke를 확인합니다. | 표현:승인 | LOCAL_RULE / L | E-NT | C01/F02, U03 | L / 기존 보존/6 영향확인 | 변경 없음; F02 상태 충돌 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-150 · L169–169 | 3. 운영 DB 권한/RLS/private-state 경계가 release 기준과 일치함을 최종 확인합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-151 · L170–170 | 4. release blocker가 모두 해소되면 별도 activation 작업에서 실제 제공할 `online` 및 필요 시 `presence` capability를 활성화하고 게임 목록 사용자 노출을 검증합니다. `invite`는 별도 구현·검증 전까지 비활성으로 유지합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | D09, C01/F02 | L / 기존 보존/6 영향확인 | 변경 없음; F02 상태 충돌 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-152 · L171–171 | 5. 오픈 직후 실제 세션 오류/로그를 확인하고, 이후 발견되는 UX 개선과 Phase E 후보는 post-release scope로 분리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decisions

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-153 · L175–175 | - 게임 식별자: `no-thanks` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-154 · L176–176 | - 지원 인원: 3–7명 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-155 · L177–177 | - 첫 버전 규칙: 기본 규칙만 구현 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-156 · L178–178 | - 숫자 카드: 3–35 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-157 · L179–179 | - 카드 준비: 33장 중 9장을 비공개로 제외하고 24장을 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-158 · L180–180 | - 규칙 엔진의 초기 카드 입력: 서버가 이미 확정한 24장 순서를 전달 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-159 · L181–181 | - 규칙 엔진 내부에서 난수 생성: 하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-160 · L182–182 | - 시작 칩: 3–5인 11개, 6인 9개, 7인 7개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-161 · L183–183 | - 플레이어 보유 칩 수: 다른 플레이어에게 비공개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-162 · L184–184 | - 현재 카드 위에 쌓인 칩 수: 공개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-163 · L185–185 | - 각 플레이어가 획득한 숫자 카드: 공개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-164 · L186–186 | - 카드를 가져간 뒤에는 같은 플레이어가 다음 카드도 계속 선택 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-165 · L187–187 | - 카드를 거절하면 다음 플레이어로 차례 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-166 · L188–188 | - 칩이 0개라면 현재 카드를 반드시 가져가야 함 | 표현:반드시 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-167 · L189–189 | - 점수 계산: 연속 숫자 묶음의 가장 낮은 숫자만 합산하고 남은 칩 수를 차감 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-168 · L190–190 | - 최저 점수 동점: 공동 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-169 · L191–191 | - 선 플레이어: 서버가 무작위 결정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-170 · L192–192 | - 카드 섞기, 제외 카드, 공개 순서, 칩 사용 가능 여부, 최종 점수는 서버가 최종 판단 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-171 · L193–193 | - 특수 카드: 후속 개발로 보류 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-172 · L194–194 | - 게임 내부 닉네임 입력 또는 변경 기능: 제공하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-173 · L195–195 | - 전체 게임 종료 권한: 방장만 가능 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-174 · L196–196 | - 게임 등록부 기능 상태: 현재 모두 비활성 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | C01/F02 | L / 기존 보존/6 영향확인 | 변경 없음; F02 상태 충돌 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-175 · L197–197 | - Access Gate: shared `createGameAccessGate` 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-176 · L198–198 | - 사용자 표시 이름: 사이트 프로필 `display_name`만 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-177 · L199–199 | - Common Game Shell: shared `createGameShell` 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-178 · L200–200 | - 현재 entry 단계의 플레이어 표시: 승인된 현재 사용자 1명만 접속 계정으로 표시 | 표현:승인 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-179 · L201–201 | - 방 생성/코드 참가/준비/방장 시작 UI: Room/Lobby RPC에 연결 완료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-180 · L202–202 | - 게임 규칙 안내: game-local dialog로 제공하며 entry와 Shell action에서 다시 열 수 있음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-181 · L203–203 | - Room/Lobby DB namespace: `no_thanks_*` game-local 객체 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-182 · L204–204 | - 방 최대 인원: 생성 시 3–7명 범위에서 서버 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-183 · L205–205 | - 방 생성/참가 표시 이름: 클라이언트 입력 없이 서버가 `profiles.display_name` 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-184 · L206–206 | - room 공개 state와 카드/칩 private state를 물리적으로 별도 table로 분리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-185 · L207–207 | - Realtime invalidation: 공개 room/player table만 구독하고 private table은 구독하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-186 · L208–208 | - 게임 시작 조건: 방장 호출 + 3명 이상 + non-host 전원 ready | 표현:조건 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-187 · L209–209 | - 시작 시 서버 난수: turn order와 33장 카드 순서를 서버에서 생성 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-188 · L210–210 | - 공개 카드: 24장 중 첫 카드만 snapshot 공개, 남은 23장/제외 9장은 private | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-189 · L211–211 | - 초기 칩 수: 3–5인 11, 6인 9, 7인 7을 서버 private state에 저장 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-190 · L212–212 | - Room/Lobby runtime 상태: shared Snapshot Coordinator + reconnect refresh trigger 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-191 · L213–213 | - Realtime payload 사용 방식: 화면 state로 직접 사용하지 않고 authoritative snapshot 재조회 신호로만 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-192 · L214–214 | - entry 입력: 최대 인원 + 방 코드만 제공하고 game-local 닉네임 입력은 제공하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-193 · L215–215 | - waiting room 방장 ready: 별도 버튼 없이 준비 완료로 간주하며 일반 플레이어 전원 ready를 시작 조건으로 계산 | 표현:조건 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-194 · L216–216 | - PLAYING UI: 현재 카드/중앙 칩/본인 칩/남은 카드/공개 획득 카드 표시와 서버 권위 거절/가져오기 action 연결 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-195 · L217–217 | - gameplay RPC: shared 계약을 확장하지 않고 game-local `no_thanks_play_action` 하나에서 `refuse_card / take_card / end_game` 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-196 · L218–218 | - gameplay mutation: room version, active player, private counter/deck을 서버 transaction에서 최종 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-197 · L219–219 | - 자연 종료: 마지막 카드 획득 시 서버가 `GAME_OVER / LAST_CARD_TAKEN`, 최종 점수와 공동 승자를 확정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-198 · L220–220 | - 수동 종료: 방장 확인 dialog + 서버 방장 권한 검증 후 `GAME_OVER / HOST_TERMINATED`, 점수/승자 미계산 | 표현:검증 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-199 · L221–221 | - 결과방 이탈: GAME_OVER에서 허용하고 진행 중 PLAYING에서는 일반 leave를 차단 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-200 · L222–222 | - 연결 끊김 정책: 비정상 disconnect는 leave가 아니며 membership/turn/host 권한을 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-201 · L223–223 | - Presence 용도: 접속 상태 표시 전용이며 server authorization이나 gameplay legality 판정에는 사용하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-202 · L224–224 | - Presence payload: `userId / onlineAt`만 사용하고 game state/private counter는 포함하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-203 · L225–225 | - 다중 탭: client별 Presence key를 사용하고 동일 user id는 온라인 1명으로 합산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-204 · L226–226 | - 방장 disconnect: 자동 위임·자동 종료 없음, 재접속 시 기존 방장 권한 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-205 · L227–227 | - 현재 차례 플레이어 disconnect: turn을 다른 사용자에게 넘기지 않고 재접속을 기다림 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-206 · L228–228 | - browser offline: local connection UI만 offline으로 표시하고 서버 state는 변경하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-207 · L229–229 | - reconnect: `online / pageshow / visibility` 이벤트에서 authoritative snapshot 재조회 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-208 · L230–230 | - 재대결: GAME_OVER에서 host가 같은 room을 waiting으로 reset하고 기존 active membership / room code 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-209 · L231–231 | - 재대결 참가: 일반 플레이어 ready 재설정 후 기존 start flow 재사용, 이탈자가 있으면 같은 room code로 replacement/rejoin 가능 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-210 · L232–232 | - 자동 multi-client 검증: disposable Supabase에서 독립 auth session 3개/7개를 실제 RPC client로 취급 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-211 · L233–233 | - 3인 자동 시나리오: 전원 snapshot privacy 확인 + full refuse cycle + reconnect snapshot + 자연 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-212 · L234–234 | - 7인 자동 시나리오: 전원 snapshot privacy 확인 + full refuse cycle + private counter 독립성 + take/reconnect | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-213 · L235–235 | - 실제 browser Presence 검증: CI Actions 비용을 늘리는 별도 browser/Supabase workflow를 만들지 않고 release 직전 manual gate로 유지 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-214 · L236–236 | - release gate 기록: `games/no-thanks/RELEASE_CHECKLIST.md` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-215 · L237–237 | - 첫 공개 기능 checkpoint baseline: PR #397 merge commit `616626f53f5fb8554fff8df2e86cc50a22e8aefa` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-216 · L238–238 | - 첫 공개 버전 core development 상태: COMPLETE — 이후 미완료 항목은 release/activation gate로 분리하고 별도 기능 phase를 추가하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Validation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-217 · L242–242 | - 최신 체크포인트: | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-218 · L243–243 · 부모 LEGACY-NT-DEV-217 |   - PR #396은 release-readiness manual play에서 발견된 첫 action, sorted TAKE landing, adaptive hand spacing, focus/visibility deal replay 문제를 game-local presentation 범위에서 수정했고 Game Platform governance #573을 통과한 뒤 main에 병합했습니다. merge commit: `2666267f673e2035ceb678ab950cc889ee188c09`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-219 · L244–244 · 부모 LEGACY-NT-DEV-217 |   - PR #397은 Rules Guide 0칩 의미 명확화, BGM 역할 교체, opening/TAKE/refuse tactile SFX와 후속 볼륨·타이밍 조정을 포함했고 Game Platform governance #580을 통과한 뒤 main에 병합했습니다. merge commit `616626f53f5fb8554fff8df2e86cc50a22e8aefa`가 현재 **기능 release-candidate handoff baseline**입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-220 · L245–245 · 부모 LEGACY-NT-DEV-217 |   - 사용자는 2026-09-25까지 실제 멀티플레이 환경에서 여러 차례 플레이 테스트를 수행했다고 확인했습니다. 다만 이 사실만으로 `RELEASE_CHECKLIST.md`의 reconnect/7-client/mobile/background 등 개별 수동 gate를 자동 완료 처리하지 않습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-221 · L246–246 · 부모 LEGACY-NT-DEV-217 |   - randomized draw-order migration은 disposable DB에서 3~35 전체 카드 집합 보존 + 비정렬 저장을 회귀 검증했습니다. 문서상 운영 Supabase 적용 확인은 release gate로 유지합니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-222 · L247–247 · 부모 LEGACY-NT-DEV-217 |   - No Thanks! Registry는 현재 `capabilities: {}`로 해석되어 `online/local/invite/presence` 모두 비활성 상태를 유지합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-223 · L248–248 · 부모 LEGACY-NT-DEV-217 |   - 디자인 checkpoint는 NT-UI-001~013을 현재 active baseline으로 확정하고 `FINAL / DESIGN_CLOSEOUT`으로 되돌립니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-224 · L249–249 | - 완료: | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-225 · L250–250 · 부모 LEGACY-NT-DEV-224 |   - Phase A–D 최종 브랜치 head `71ac396077628e53bebe1bbbc862c1c7383f64b9`를 당시 최신 main과 동기화한 상태에서 PR #364가 mergeable / behind 0임을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-226 · L251–251 · 부모 LEGACY-NT-DEV-224 |   - 최종 브랜치에서 Game Platform JavaScript syntax, shared module link, Game Platform contract tests, Governance Guard와 `build-assets`가 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-227 · L252–252 · 부모 LEGACY-NT-DEV-224 |   - PR #364 병합 후 main commit `66531c7820285b37dc8d1e2961156ab95560758f`에서 `build`, 전체 `site-checks`, `report-build-status`, `deploy`가 모두 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-228 · L253–253 · 부모 LEGACY-NT-DEV-224 |   - 병합 후 전체 site-checks에서 Game Platform contracts뿐 아니라 The Game rules, Marble foundation, Web Push/signup/admin/activity 권한 검사, module/link/file-integrity 검사까지 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-229 · L254–254 · 부모 LEGACY-NT-DEV-224 |   - Phase 3 작업 브랜치를 관리자 후보 조회 안정화 PR #348까지 반영된 최신 `main` 커밋 `049493f8964f2424a7669290ae733d6e388c799b`에 다시 동기화했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-230 · L255–255 · 부모 LEGACY-NT-DEV-224 |   - 기존 #344의 공통 foundation 전체 Registry ID/개수 고정 변경을 폐기하고 No Thanks! Registry 검증을 게임별 테스트로 분리했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-231 · L256–256 · 부모 LEGACY-NT-DEV-224 |   - PR #347은 최신 `main` 동기화 전 Game Platform governance를 통과했고, 동기화 후 동일 검증을 다시 수행합니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-232 · L257–257 · 부모 LEGACY-NT-DEV-224 |   - Game Platform JavaScript syntax check, 사이트 ↔ `games/shared` module link check, `npm run test:game-platform`, Governance Guard가 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-233 · L258–258 · 부모 LEGACY-NT-DEV-224 |   - Phase 3 PR #349에서 신규 `index.html / main.js / styles.css`의 JavaScript syntax와 module link 검증이 통과했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-234 · L259–259 · 부모 LEGACY-NT-DEV-224 |   - `tests/game-platform-no-thanks-shell.test.js`를 포함한 `npm run test:game-platform` 전체 계약 테스트가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-235 · L260–260 · 부모 LEGACY-NT-DEV-224 |   - Access Gate의 인증 필요/승인 필요 사유를 runtime에서 명시적으로 분기하고 알 수 없는 접근 상태는 별도 오류 화면으로 처리하도록 보완했습니다. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-236 · L261–261 · 부모 LEGACY-NT-DEV-224 |   - 최신 Phase 3 head의 Game Platform Governance Guard가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-237 · L262–262 · 부모 LEGACY-NT-DEV-224 |   - Phase 4 Room/Lobby adapter 정적 계약 테스트와 private-state 경계 테스트가 `npm run test:game-platform`에서 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-238 · L263–263 · 부모 LEGACY-NT-DEV-224 |   - disposable Supabase에서 No Thanks! migration을 replay하고 플랫폼 DB/Test Contract 10개 시나리오를 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-239 · L264–264 · 부모 LEGACY-NT-DEV-224 |   - 첫 DB integration 실행에서 seat 빈자리 계산 alias가 모호해 join 시 `seat = null`이 되는 문제를 발견했고, `generate_series ... as s(seat)`로 명시해 수정한 뒤 재검증했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-240 · L265–265 · 부모 LEGACY-NT-DEV-224 |   - 수정 후 Game DB integration의 No Thanks! 시나리오와 기존 게임 DB integration 전체가 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-241 · L266–266 · 부모 LEGACY-NT-DEV-224 |   - 최신 Phase 4 code head에서 Site static checks와 Game Platform governance가 모두 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-242 · L267–267 · 부모 LEGACY-NT-DEV-224 |   - Phase 5 stacked PR #354에서 No Thanks! lobby controller/runtime model/shell 계약 테스트를 포함한 `npm run test:game-platform`이 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-243 · L268–268 · 부모 LEGACY-NT-DEV-224 |   - Phase 5 최신 code head의 Game Platform JavaScript syntax, site ↔ `games/shared` module link, Governance Guard가 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-244 · L269–269 · 부모 LEGACY-NT-DEV-224 |   - Phase 5는 DB/schema 변경이 없으므로 disposable Game DB integration은 #353에서 검증된 Room/Lobby foundation 결과를 그대로 전제로 하며 별도 DB workflow는 실행되지 않았습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-245 · L270–270 · 부모 LEGACY-NT-DEV-224 |   - Phase 5는 `games/**`와 `tests/game-platform-*.test.js` 범위만 변경해 CI 경계 정책에 따라 전체 Site static checks는 실행하지 않았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-246 · L271–271 · 부모 LEGACY-NT-DEV-224 |   - PR #354 자동 리뷰에서 command 응답보다 늦게 도착한 stale refresh가 최신 ready/start 상태를 덮을 수 있는 race condition을 발견했고, 현재 렌더 snapshot보다 낮은 version은 game-local controller에서 거부하도록 수정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-247 · L272–272 · 부모 LEGACY-NT-DEV-224 |   - stale refresh가 command의 최신 snapshot을 덮지 못하는 회귀 테스트를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-248 · L273–273 · 부모 LEGACY-NT-DEV-224 |   - 방장 waiting-room 이탈은 전체 대기실을 닫는 파괴적 동작이므로 즉시 RPC를 호출하지 않고 명시적 `방 닫기` 확인 dialog를 거치도록 수정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-249 · L274–274 · 부모 LEGACY-NT-DEV-224 |   - No Thanks! standalone HTML에 남아 있던 literal `\\n` 문자를 실제 줄바꿈으로 수정하고 회귀 테스트를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-250 · L275–275 · 부모 LEGACY-NT-DEV-224 |   - 위 리뷰 수정이 포함된 최신 head에서도 JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard가 모두 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-251 · L276–276 · 부모 LEGACY-NT-DEV-224 |   - Phase 6 PR #356에서 server-authoritative gameplay adapter/controller/runtime/shell 계약을 포함한 Game Platform governance가 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-252 · L277–277 · 부모 LEGACY-NT-DEV-224 |   - Phase 6 변경을 포함한 Site static checks 전체 회귀 검증이 성공했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-253 · L278–278 · 부모 LEGACY-NT-DEV-224 |   - disposable Supabase에서 Room/Lobby foundation + gameplay migration을 순서대로 replay하고 기존 플랫폼 필수 시나리오와 추가 gameplay 시나리오가 모두 성공했습니다. | 표현:필수 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-254 · L279–279 · 부모 LEGACY-NT-DEV-224 |   - gameplay DB 검증에서 active-player refuse, private counter 감소, center counter 증가, turn 이동, take 후 중앙 칩 수령과 same-player turn 유지, concurrent conflict single commit, 마지막 카드 점수/공동 승자, host-only manual termination, terminal leave를 확인했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-255 · L280–280 · 부모 LEGACY-NT-DEV-224 |   - `p_expected_version = null` 직접 RPC 호출도 `VERSION_CONFLICT`로 거부되는 것을 검증했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-256 · L281–281 · 부모 LEGACY-NT-DEV-224 |   - 동일 `client_action_id`의 concurrent duplicate retry가 동일 authoritative snapshot으로 수렴하고 version을 두 번 증가시키지 않는 것을 검증했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-257 · L282–282 · 부모 LEGACY-NT-DEV-224 |   - Phase 7 PR #358의 최신 code head에서 Game Platform JavaScript syntax가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-258 · L283–283 · 부모 LEGACY-NT-DEV-224 |   - Phase 7 PR #358의 site ↔ `games/shared` module link 검증이 통과했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-259 · L284–284 · 부모 LEGACY-NT-DEV-224 |   - Presence lifecycle, 다중 탭 user merge, offline→online refresh를 포함한 당시 Phase 7 `npm run test:game-platform` 전체 계약 테스트가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-260 · L285–285 · 부모 LEGACY-NT-DEV-224 |   - same-room rematch, terminal host succession, replacement restart를 포함한 최신 `npm run test:game-platform`이 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-261 · L286–286 · 부모 LEGACY-NT-DEV-224 |   - 최신 Site static checks가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-262 · L287–287 · 부모 LEGACY-NT-DEV-224 |   - isolated Supabase Game DB integration에서 No Thanks! same-room rematch 계약과 기존 Can't Stop rematch 계약이 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-263 · L288–288 · 부모 LEGACY-NT-DEV-224 |   - Game Platform Governance Guard가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-264 · L289–289 · 부모 LEGACY-NT-DEV-224 |   - Phase 7은 DB schema/RPC를 변경하지 않아 disposable Game DB integration은 실행 대상이 아닙니다. 서버 DB 경계는 Phase 6의 성공 결과를 그대로 유지합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-265 · L290–290 · 부모 LEGACY-NT-DEV-224 |   - 최신 main 대비 뒤처짐 없이 PR #358이 mergeable 상태임을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-266 · L291–291 · 부모 LEGACY-NT-DEV-224 |   - 운영 DB migration history에 `no_thanks_room_lobby_foundation / no_thanks_gameplay_actions / no_thanks_realtime_publication / no_thanks_private_helper_permissions`가 기록된 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-267 · L292–292 · 부모 LEGACY-NT-DEV-224 |   - 운영 DB에서 `no_thanks_rooms / no_thanks_room_players / no_thanks_room_actions / no_thanks_room_private_state` RLS 활성 상태를 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-268 · L293–293 · 부모 LEGACY-NT-DEV-224 |   - authenticated는 공개 room/player SELECT와 public RPC 실행 권한만 가지며 private-state SELECT와 private snapshot helper 실행은 차단된 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-269 · L294–294 · 부모 LEGACY-NT-DEV-224 |   - Realtime publication에는 공개 room/player 두 테이블만 등록된 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-270 · L295–295 · 부모 LEGACY-NT-DEV-224 |   - Game Platform-only PR이므로 개선된 CI 규칙에 따라 무관한 전체 Site static checks는 실행하지 않았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-271 · L296–296 · 부모 LEGACY-NT-DEV-224 |   - `package.json`에서 게임 플랫폼 관련 검증 명령이 `npm run test:game-platform`임을 확인했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-272 · L297–297 · 부모 LEGACY-NT-DEV-224 |   - 새 `rules.js`와 단위 테스트 파일에 `node --check`를 실행해 문법 오류가 없음을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-273 · L298–298 · 부모 LEGACY-NT-DEV-224 |   - `node --test tests/game-platform-no-thanks-rules.test.js`에 해당하는 동일 파일 구성을 로컬 검증 환경에서 실행했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-274 · L299–299 · 부모 LEGACY-NT-DEV-224 |   - 규칙 엔진 단위 테스트 12개가 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-275 · L300–300 · 부모 LEGACY-NT-DEV-224 |   - 실제 브랜치의 `rules.js`, 단위 테스트, 게임 등록부 파일과 로컬 검증 파일의 Git blob SHA가 각각 일치하는지 확인했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-276 · L301–301 · 부모 LEGACY-NT-DEV-224 |   - 게임 등록부의 `no-thanks` 항목이 `platform: "shared"`이고 모든 기능 활성화 값이 `false`로 해석되는지 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-277 · L302–302 · 부모 LEGACY-NT-DEV-224 |   - 당시 `GAME_SPEC.md`와 `DEVELOPMENT.md`의 필수 섹션을 유지했습니다. 이후 플랫폼 규칙은 `UI_DESIGN.md`와 `UI_DECISIONS.md`를 추가한 네 문서 체계로 발전했습니다. | 표현:필수 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-278 · L303–303 | - 이번 단계에서 아직 수행하지 않는 검증: | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-279 · L304–304 · 부모 LEGACY-NT-DEV-278 |   - 승인회원 계정의 운영 create/join/snapshot/gameplay 브라우저 smoke test | 표현:승인 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-280 · L305–305 · 부모 LEGACY-NT-DEV-278 |   - 실제 데스크톱/모바일 브라우저의 Presence/reconnect 멀티플레이 점검 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-281 · L306–306 | - 운영 Supabase migration, 권한/RLS/private-state 비노출, Realtime publication 구조 검증은 완료했습니다. 남은 항목은 실제 브라우저 동작 확인입니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Known Issues / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-282 · L310–310 | - Game Platform 공통 재대결 규칙 영향도 감사에서 확인된 `MIGRATION_REQUIRED` 항목은 이번 same-room rematch 구현으로 해소했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | D07 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-283 · L312–312 | - 승인회원 접근 제어부터 Room/Lobby, server-authoritative gameplay action, 자연 종료와 방장 수동 종료 UI까지 연결했습니다. | 표현:승인 | LOCAL_CONTEXT / I | E-NT | U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-284 · L313–313 | - Room/Lobby, gameplay, Realtime publication, private helper permission hardening migration을 운영 Supabase에 적용했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-285 · L314–314 | - 게임 등록부에는 등록되어 있지만 모든 기능 활성화 값이 비활성 상태이며 출시된 게임으로 취급하지 않습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | D09, C01/F02 | I / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-286 · L315–315 | - 특수 카드 확장은 기본 규칙 첫 버전 이후 별도 설계가 필요합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-287 · L316–316 | - 비정상 disconnect와 Presence 정책은 Phase 7~8에서 검증했습니다. 재대결 정책은 Game Platform 공통 규칙에 맞춰 same-room lifecycle로 변경했고 자동 DB/contract 검증을 완료했습니다. 실제 브라우저 Presence/모바일 복귀/rematch 검증은 release manual gate로 남아 있습니다. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | D07, U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-288 · L317–317 | - Phase A–D 구현 브랜치는 이미 PR #364로 main에 병합됐으며 후속 구현에서는 해당 종료 브랜치를 재사용하지 않습니다. 다음 구현 시에는 먼저 No Thanks! 관련 진행 중 브랜치 존재 여부를 확인합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Release closeout 안내

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-289 · L321–321 | 게임을 운영 환경에 공개해 `Status: RELEASED`로 전환할 때는 이 안내 부분을 실제 날짜가 있는 출시 기록으로 교체합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-290 · L323–330 | ```text<br>## Release — YYYY-MM-DD<br><br>- 운영 환경 기능 활성화와 마이그레이션 요약<br>- 현재 게임 등록부 기능 상태<br>- 핵심 검증 결과<br>- 유지보수 기준과 남은 확인 사항<br>``` | 표현:검증 | LOCAL_RULE / L | E-NT | D09, C01/F02, U03 | L / 기존 보존/6 영향확인 | 변경 없음; F02 상태 충돌 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-291 · L332–332 | `RELEASED` 상태에서는 `Active branch: main`을 사용하고, 과거 작업 브랜치를 현재 기준으로 남기지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

## NT-UI — `games/no-thanks/UI_DESIGN.md`

- source: [games/no-thanks/UI_DESIGN.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/UI_DESIGN.md)
- blob: `6d956599f9dfc11fade9a082d68ddec4be05bea2`; 원문 132줄; 상태 `ADOPTION_BASELINE`; 88 관리단위 / 70 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### No Thanks! UI Design

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-001 · L3–6 | &gt; 이 문서는 UI_DECISIONS 체계 도입 전에 이미 진행된 No Thanks! UI 작업을 기준으로 고정한 **adoption baseline**입니다. 신규 게임의 pre-development UI_DESIGN과 달리, 도입 이전 구현·수정 결과가 일부 함께 포함되어 있을 수 있으며 과거를 추측해 억지로 분리하지 않습니다.<br>&gt; 플랫폼 공통 기준은 `docs/game-platform-ui-rules.md`, 기능 규칙은 `GAME_SPEC.md`, 개발 시작 후의 디자인 수정·결정·검증과 baseline override는 `UI_DECISIONS.md`, 기능 구현 진행은 `DEVELOPMENT.md`에서 관리합니다.<br>&gt;<br>&gt; adoption 이후 또는 과거 기록 복원으로 확인된 디자인 변경은 `UI_DECISIONS.md`의 최신 non-superseded 결정이 우선합니다. 이 문서의 기존 Phase 문구를 근거로 이미 반영된 수정 사항을 원복하지 않습니다. | 표현:검증 | LOCAL_RULE / L | E-NT | D04, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Design Research

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-002 · L10–10 | - Target edition / visual baseline: 기본 숫자 카드와 칩 중심의 No Thanks! 정체성을 우선하며, 특정 재판의 보호되는 일러스트/로고를 그대로 복제하지 않습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-003 · L11–11 | - Official / publisher sources: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-004 · L12–12 · 부모 LEGACY-NT-UI-003 |   - AMIGO 공식 영문 규칙서: https://blog.amigo-spiele.de/content/ap/rule/02455-GB-AmigoRule.pdf | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-005 · L13–13 · 부모 LEGACY-NT-UI-003 |   - AMIGO 공식 제품 페이지: https://www.amigo-spiele.de/no-thanks_2455_1247 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-006 · L14–14 | - Additional references: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-007 · L15–15 · 부모 LEGACY-NT-UI-006 |   - Board Game Arena 규칙 요약: https://en.doc.boardgamearena.com/Gamehelpnothanks | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-008 · L16–16 | - 조사/구현 대상 구성물: 숫자 카드, 중앙 카드, 카드 위 공개 칩 더미, 플레이어 보유 카드 묶음, 플레이어 프로필/비공개 칩 상태 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-009 · L17–17 | - 핵심 관찰: 복잡한 보드보다 큰 숫자 카드와 칩의 선택이 중심이며, 카드 숫자는 겹쳐도 읽히는 정보 계층이 중요합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-010 · L18–18 | - Last reviewed: 2026-09-22 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Copyright / Asset Usage

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-011 · L22–22 | - Directly usable: 직접 제작한 CSS shape, 숫자/텍스트, 라이선스가 확인된 일반 아이콘 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-012 · L23–23 | - Recreate / reinterpret: 원본 카드의 정보 계층, 시그니처 컬러 관계, 카드/칩의 물리적 느낌 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-013 · L24–24 | - Do not use directly: 사용 허가가 확인되지 않은 공식 로고, 박스/카드 일러스트, 제품 사진 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-014 · L25–25 | - License / attribution notes: 최종 polish에서 특정 판본의 정확한 색/그래픽을 차용하기 전에 공식 자산 사용 조건을 다시 확인합니다. | 표현:조건 | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Visual Identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-015 · L29–29 | - Primary color: 목표 판본 조사에서 확인한 카드 중심 시그니처 컬러를 기준으로 확정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-016 · L30–30 | - Secondary color: 카드/칩과 충돌하지 않는 중립 계열 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-017 · L31–31 | - Accent color: 현재 차례, 선택 가능 action, 중요한 칩 이동에 제한적으로 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-018 · L32–32 | - Background color: 카드와 칩이 테이블 위 구성물처럼 분리되어 보이는 game-local 배경 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-019 · L33–33 | - Typography direction: 큰 숫자를 최우선 정보로 읽을 수 있는 굵고 단순한 숫자 표현 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-020 · L34–34 | - Symbols / patterns: 과도한 장식보다 카드/칩 자체를 상징 요소로 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-021 · L35–35 | - Material / texture: 카드와 플라스틱/목재 칩의 물리감을 가볍게 전달 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-022 · L36–36 | - Visual keywords: 숫자 카드, 칩, 긴장감, 간결함, 테이블 게임 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Page Identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-023 · L40–40 | - 게임 목록에서 진입하면 청파 같이 일반 카드 UI가 아니라 No Thanks! 전용 table/game frame으로 전환합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-024 · L41–41 | - lobby부터 gameplay까지 같은 배경, 타이포그래피, 카드/칩 언어를 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-025 · L42–42 | - 사이트 공통 identity/접근 경계는 유지하되 header와 panel의 시각 표현은 게임-local 테마에 맞춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-026 · L43–43 | - loading/reconnect/error도 generic 흰 카드가 아니라 같은 game frame 안에서 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Lobby / Setup Design

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-027 · L47–47 | - 방 생성/참가와 준비 완료는 플랫폼 공통 lifecycle을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-028 · L48–48 | - 프로필 이미지와 닉네임을 플레이어 seat/패널의 핵심 identity로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-029 · L49–49 | - host/ready 상태는 layout을 흔들지 않는 badge/tint로 표현합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-030 · L50–50 | - 규칙 보기는 gameplay 이전에 항상 접근 가능하게 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-031 · L51–51 | - 시작 action은 방장에게만 명확히 노출하고 준비 미완료 이유를 함께 이해할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Gameplay Layout

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-032 · L55–55 | - WAITING과 PLAYING은 같은 대형 직사각형 game board scene을 사용하고, 중앙에는 타원형 table을 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-033 · L56–56 | - 3–7인 좌석은 authoritative seat/turn order를 바꾸지 않고 viewer 기준 표현 순서만 회전해 자신의 좌석이 항상 6시 방향에 오게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-034 · L57–57 | - 좌석 프로필 이미지의 중심점이 타원형 테이블의 실제 외곽 테두리 중심선에 오도록 배치하고, 현재 차례 avatar만 약 30% 확대해 턴을 읽게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-035 · L58–58 | - 보드 우측 상단에는 room code / 인원 / ready / connection / host를 compact HUD로 표시하며, board mode에서는 공통 대형 sidebar roster를 숨깁니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-036 · L59–59 | - 모바일에서도 host/ready/connection 상태는 compact indicator로 유지하고 핵심 상태를 통째로 숨기지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-037 · L60–60 | - 보드 아래 개인 패널은 보드와 같은 폭을 사용하며 desktop chip 열은 약 192px, hand 영역은 많은 카드를 수용하도록 동적 overlap을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-038 · L61–61 | - 보유 카드는 좌상단/우하단 숫자를 유지하고 hover/focus 시 위로만 들어 올려 인접 카드 숫자를 가리지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-039 · L62–62 | - 중앙에는 deck / 현재 공개 카드 / 공개 칩 더미가 하나의 핵심 zone으로 보이게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-040 · L63–63 | - 각 플레이어가 가져간 카드는 개인 패널에서 포커 카드처럼 일부 겹쳐 정리할 수 있게 하되 숫자 식별성을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-041 · L64–64 | - 겹치는 카드에서도 숫자를 읽을 수 있도록 최소 왼쪽 상단 정보가 항상 노출되게 설계하고, 필요하면 반대 모서리 정보도 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-042 · L65–65 | - 현재 카드의 칩과 플레이어 개인 칩의 공개/비공개 경계를 시각적으로 구분합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-043 · L66–66 | - 핵심 action은 거절과 카드 가져오기에 집중하고 부가 controls가 경쟁하지 않게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Components

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-044 · L70–70 | - Cards: 실제 카드 비율과 큰 숫자 중심. 많은 카드가 생겨도 겹침 상태에서 숫자를 읽을 수 있어야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-045 · L71–71 | - Chips / tokens: 이동 출발점과 도착점이 명확한 실물 구성물처럼 표현합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-046 · L72–72 | - Dice / pieces: 해당 없음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-047 · L73–73 | - Player panel: 프로필, 공개 카드, 현재 턴/준비 상태를 수용하고 과도한 높이 증가를 막습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-048 · L74–74 | - Buttons: 게임 시그니처 컬러를 사용하되 action priority가 명확해야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-049 · L75–75 | - Modal / dialog: 규칙/종료 확인 등 기능은 유지하되 game-local visual language를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-050 · L76–76 | - Status / event message: 플레이 흐름을 방해하는 고정 카드 대신 짧은 overlay/message presentation을 우선합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-051 · L77–77 | - Result component: 최종 점수와 승자를 카드/칩 언어 안에서 보여줍니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Motion / Interaction

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-052 · L81–81 | - 카드 공개: draw deck의 실제 위치에서 별도 fixed flight card가 출발해 약 760ms 동안 arc 이동과 flip을 수행합니다. presentation effect는 시작 시점이 아니라 landing 완료 시점까지 유지하며, 동일 snapshot 재렌더가 중간에 발생해도 실제 current card는 `is-awaiting-deal` 상태로 숨겨 둡니다. 이동 카드가 도착한 프레임에 최신 current-card DOM을 공개하고 약 130ms settle/fade로 handoff합니다. landing 완료 시 `roomId:version:currentCard:deckRemaining` 기반 settled deal key를 기록하며, 브라우저 visibility/pageshow reconnect refresh 또는 같은 페이지의 controller 재구성으로 동일 authoritative snapshot을 다시 받아도 이미 settled된 deal은 재생하지 않습니다. deck visual depth는 남은 카드 단계 규칙으로만 변합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-053 · L82–82 | - 칩 제출: 약 26px token이 플레이어 seat에서 중앙 pile까지 약 780ms 이동하고, 도착 후 약 100ms landing dwell을 거친 뒤 presentation count를 authoritative 최종 값으로 handoff합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-054 · L83–83 | - 카드 가져오기: TAKE_CARD 직전 중앙 공개 카드와 실제 중앙 칩 DOM을 fixed overlay로 보존해 authoritative snapshot render 때 원본이 먼저 사라져 보이지 않게 합니다. 공개 카드는 개인 패널의 기존 보유 카드가 없으면 맨 왼쪽, 있으면 현재 가장 오른쪽 카드 다음 transient slot으로 The Game과 같은 22% / 50% / 78% / 94% arc timing을 따라 이동·안착합니다. 카드 landing과 chip landing은 뒤이어 실행되는 deal effect와 별도 상태로 기록합니다. 한 번 안착한 카드는 다음 카드 deal 중 동일 snapshot 재렌더가 발생해도 다시 `is-awaiting-take-landing` 상태로 돌아가지 않으며, landing 대상은 해당 card value의 최신 DOM만 선택합니다. 중앙 칩은 TAKE 시점의 authoritative center count를 batch count로 고정하고 그 수만 한 번 소비합니다. 부루마블 money transfer처럼 각 visible chip의 실제 출발 위치에서 내 보유 칩 영역으로 짧은 stagger 곡선 이동을 수행하며, batch 전체가 끝난 같은 task에서 overlay를 제거하고 개인 칩 count/cluster를 authoritative 최종 값으로 handoff합니다. 카드/칩 handoff가 끝난 뒤에만 draw deck의 다음 카드 공개 motion을 시작합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-055 · L84–84 | - turn transition: action 완료 presentation 이후 다음 active player를 강조합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-056 · L85–85 | - timing 원칙: 상태 숫자 증가가 구성물 도착보다 먼저 보여 원인/결과가 뒤집히지 않게 합니다. | 표현:원칙 | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-057 · L86–86 | - server-authoritative state와 presentation의 동기화 기준: 서버 결과가 truth이며 animation은 그 결과를 설명하는 presentation layer로만 동작합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-058 · L87–87 | - sound: 칩/카드 행동을 보조하되 브라우저 autoplay 정책과 사용자 음소거 선택을 존중합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Result / Rematch Presentation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-059 · L91–91 | - 최종 점수의 카드 합, 남은 칩 차감, 공동 승리를 읽을 수 있어야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-060 · L92–92 | - 재대결은 새 방 생성이 아니라 동일 room/player context에서 준비 상태로 전환되는 흐름을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-061 · L93–93 | - same-room rematch가 authoritative lifecycle로 구현되어 room code와 active membership을 유지하고 이전 gameplay/private state만 초기화합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-062 · L94–94 | - rematch 준비 화면도 동일한 No Thanks! page identity 안에 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-063 · L95–95 | - 각 플레이어 ready 상태와 방장의 시작 가능 조건을 명확히 표현합니다. | 표현:조건 | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-064 · L96–96 | - 재대결하지 않는 플레이어는 방 나가기 action을 사용할 수 있어야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Responsive Strategy

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-065 · L100–100 | - Desktop: 중앙 카드/칩 zone과 플레이어 패널을 동시에 읽는 것을 우선합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-066 · L101–101 | - Tablet: 핵심 중앙 zone을 고정하고 플레이어 영역 밀도를 조정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-067 · L102–102 | - Mobile: 행동 버튼과 현재 카드가 첫 화면에서 우선 보이게 하고, 개인 카드가 많아질수록 overlap/scroll 전략을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-068 · L103–103 | - 작은 높이 화면: 고정 패널 때문에 매 턴 상하 스크롤이 필요하지 않도록 최대 높이와 내부 overflow를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-069 · L104–104 | - 많은 카드/토큰: 카드 overlap과 숫자 corner visibility로 수용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-070 · L105–105 | - touch / accessibility: hover 없이 모든 핵심 action을 사용할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Implementation Plan

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-071 · L109–109 | 1. 대상 판본/공식 시각 자료와 자산 사용 가능 범위를 최종 확인합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-072 · L110–110 | 2. 게임 전체 background/page frame과 card/chip visual token을 확정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-073 · L111–111 | 3. lobby/setup을 game-local Visual Identity로 통일합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-074 · L112–112 | 4. 중앙 card/chip zone과 플레이어 카드 overlap layout을 완성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-075 · L113–113 | 5. card flip / chip travel / take-card sequencing을 authoritative state와 맞춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-076 · L114–114 | 6. result/rematch 화면을 같은 디자인 언어로 연결합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-077 · L115–115 | 7. desktop/mobile에서 높이, overlap, interaction timing을 실제 멀티플레이로 검증합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Validation Checklist

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-078 · L119–119 | - &#91; &#93; 목표 판본의 공식 디자인 자료와 palette를 최종 교차 확인했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-079 · L120–120 | - &#91; &#93; 직접 사용하는 자산의 권리 상태를 확인했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-080 · L121–121 | - &#91; &#93; 일반 청파 같이 페이지가 아니라 No Thanks! 전용 게임 공간으로 느껴진다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-081 · L122–122 | - &#91; &#93; 카드가 많이 쌓여도 숫자를 식별할 수 있다. | 표현:할 수 있다 | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-082 · L123–123 | - &#91; &#93; 칩 이동이 출발 → 이동 → 도착 → count 반영 순서로 이해된다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-083 · L124–124 | - &#91; &#93; 카드 공개가 deck → 이동 → flip → 공개 완료 순서로 이해된다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-084 · L125–125 | - &#91; &#93; lobby → gameplay → result/rematch가 하나의 Visual Identity를 유지한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-085 · L126–126 | - &#91; &#93; desktop/mobile에서 핵심 action과 정보가 한 화면 흐름으로 유지된다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-086 · L127–127 | - &#91; &#93; UI_DECISIONS.md가 adoption baseline 이후의 실제 UI 결정·검증·후속 작업을 추적한다. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Open Questions / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-087 · L131–131 | - 특정 AMIGO 판본을 최종 visual baseline으로 고정할지, 원본의 기능적 특징만 재해석할지 최종 polish 전에 확정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-088 · L132–132 | - 공식 로고/제품 artwork는 명시적인 사용 근거가 확인되기 전까지 직접 사용하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

## NT-UID — `games/no-thanks/UI_DECISIONS.md`

- source: [games/no-thanks/UI_DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/UI_DECISIONS.md)
- blob: `65437a239c6d9ac2bdb40191bd0f6e5a388b3ead`; 원문 330줄; 상태 `GAME_LOCAL`; 271 관리단위 / 117 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### No Thanks! UI Decisions

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-001 · L3–7 | &gt; 이 문서는 No Thanks!의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.<br>&gt; `UI_DESIGN.md`는 UI_DECISIONS 체계 도입 시점의 No Thanks! **adoption baseline**입니다. 개발 시작 후 확정된 이 문서의 최신 non-superseded 결정이 같은 항목에서는 우선하며, 현재 유효 디자인은 baseline + decision overrides로 해석합니다. 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.<br>&gt; 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.<br>&gt;<br>&gt; 이 문서 체계 도입 전 No Thanks!는 여러 UI 수정과 일부 미병합/종료 PR을 거쳤으므로 과거 세부 결정이 완전하게 보존되어 있지 않습니다. 이 baseline에서 누락된 과거 결정을 임의로 복원하지 않으며, 별도 복원 작업에서 실제 main·과거 PR/commit·사용자 결정과 대조해 추가합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Current Design Track

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-002 · L11–11 | - Status: FINAL | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-003 · L12–12 | - Lifecycle stage: DESIGN_CLOSEOUT | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-004 · L13–13 | - Current UI phase / scope: 첫 공개 버전 room/gameplay/result/rules/motion/audio presentation closeout 완료 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-005 · L14–14 | - Active branch: `main` (이 checkpoint PR 병합 후 design baseline) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-006 · L15–15 | - Last updated: 2026-09-25 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-007 · L16–16 | - Adoption baseline: `UI_DESIGN.md` (UI_DECISIONS 체계 도입 전 작업 상태 포함) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-008 · L17–17 | - Active overrides: | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-009 · L18–18 · 부모 LEGACY-NT-UID-008 |   - NT-UI-001 — muted blue game-local environmental background | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-010 · L19–19 · 부모 LEGACY-NT-UID-008 |   - NT-UI-002 — compact LIVE ROOM header identity | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-011 · L20–20 · 부모 LEGACY-NT-UID-008 |   - NT-UI-003 — first-place celebration overlay | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-012 · L21–21 · 부모 LEGACY-NT-UID-008 |   - NT-UI-004 — FINAL TABLE result plates | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-013 · L22–22 · 부모 LEGACY-NT-UID-008 |   - NT-UI-005 — quiet in-room reconnect presentation | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-014 · L23–23 · 부모 LEGACY-NT-UID-008 |   - NT-UI-006 — centered FINAL WINNER result card | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-015 · L24–24 · 부모 LEGACY-NT-UID-008 |   - NT-UI-007 — tabletop Rules Guide | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-016 · L25–25 · 부모 LEGACY-NT-UID-008 |   - NT-UI-008 — Covert Affair / Hard Boiled soundtrack split | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-017 · L26–26 · 부모 LEGACY-NT-UID-008 |   - NT-UI-009 — staged tabletop game-start sequence | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-018 · L27–27 · 부모 LEGACY-NT-UID-008 |   - NT-UI-010 — authoritative transfer continuity at take/end boundaries | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-019 · L28–28 · 부모 LEGACY-NT-UID-008 |   - NT-UI-011 — maximum-hand responsive overlap | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-020 · L29–29 · 부모 LEGACY-NT-UID-008 |   - NT-UI-012 — tighter gameplay hand and ordered insertion slide | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-021 · L30–30 · 부모 LEGACY-NT-UID-008 |   - NT-UI-013 — tactile card/chip audio feedback | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-022 · L31–31 | - Main design baseline: PR #397 merge commit `616626f53f5fb8554fff8df2e86cc50a22e8aefa` (NT-UI-001~013 포함) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-023 · L32–32 | - Next design work: 첫 공개 전 필수 디자인 작업 없음. Phase E 후보인 다른 플레이어 공개 획득 카드 popover와 추가 polish는 release blocker가 아닌 post-release follow-up으로 유지합니다. | 표현:필수 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Decision Log > NT-UI-001 — No Thanks! page environmental identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-024 · L38–38 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-025 · L39–39 | - Applies to: No Thanks! room / gameplay / result page world | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-026 · L40–40 | - Source: 2026-09-23 developer manual browser review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-027 · L41–41 | - Context / trigger: 기존 흰 페이지 배경이 게임별 개성을 충분히 전달하지 못했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-028 · L42–42 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-029 · L43–43 · 부모 LEGACY-NT-UID-028 |   - 페이지 전체를 muted navy / blue-gray 계열 game-local background로 구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-030 · L44–44 · 부모 LEGACY-NT-UID-028 |   - 중앙 gameplay surface는 밝게 유지하고, 장식은 가장자리 위주로 배치합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-031 · L45–45 · 부모 LEGACY-NT-UID-028 |   - oversized number-card ghost motif와 현재 gameplay의 red tactile chip visual language를 배경 accent로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-032 · L46–46 · 부모 LEGACY-NT-UID-028 |   - 공식 제품 artwork를 직접 배경 자산으로 사용하지 않고 CSS 기반 카드/칩 모티프로 재해석합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-033 · L47–47 · 부모 LEGACY-NT-UID-028 |   - mobile에서는 장식 밀도를 줄입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-034 · L48–48 | - Rationale: 장시간 플레이 가독성을 해치지 않으면서 No Thanks!에 진입했다는 즉각적인 환경 정체성을 제공합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-035 · L49–49 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-036 · L50–50 | - Validation: 2026-09-23 manual browser review에서 배경 색상과 장식 방향 승인. PR #378 automated governance 통과. | 표현:승인 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-037 · L51–51 | - Baseline relation: adoption baseline의 page-frame/environment 항목을 구체화한 후속 override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-038 · L52–52 | - Functional boundary: gameplay state / rules / RPC / DB authority 변경 없음. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-002 — Room header identity and connection-state cleanup

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-039 · L56–56 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-040 · L57–57 | - Applies to: in-room Game Shell header | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-041 · L58–58 | - Source: 2026-09-23 developer manual browser review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-042 · L59–59 | - Context / trigger: 방 코드/상태 표현이 중복되고 게임 설명이 약하게 보였습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-043 · L60–60 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-044 · L61–61 · 부모 LEGACY-NT-UID-043 |   - 설명 문구는 `칩으로 버틸지, 카드와 칩을 가져갈지—한 번의 선택이 흐름을 바꾸는 심리전 카드 게임`으로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-045 · L62–62 · 부모 LEGACY-NT-UID-043 |   - 우측 room label은 `LIVE ROOM`으로 표시하고 실제 room code 중복 노출을 제거합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-046 · L63–63 · 부모 LEGACY-NT-UID-043 |   - 정상 연결된 in-room 상태의 `방 상태 최신` 성공 카드는 숨깁니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-047 · L64–64 · 부모 LEGACY-NT-UID-043 |   - offline / reconnecting / error 등 recovery-critical connection state는 계속 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-048 · L65–65 | - Rationale: 헤더를 상태 정보 묶음이 아니라 게임 진입부/정체성 영역으로 정리하면서 중요한 복구 정보는 보존합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-049 · L66–66 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-050 · L67–67 | - Validation: 2026-09-23 manual browser review를 거쳐 후속 결과 화면 작업까지 유지됨. PR #378 automated governance 통과. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-051 · L68–68 | - Baseline relation: post-baseline manual review override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-052 · L69–69 | - Functional boundary: connection semantics 자체는 변경하지 않고 정상 success presentation만 숨김. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-003 — First-place celebration overlay

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-053 · L73–73 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-054 · L74–74 | - Applies to: natural game completion (`LAST_CARD_TAKEN`) immediately before result review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-055 · L75–75 | - Source: 2026-09-23 developer manual browser review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-056 · L76–76 | - Context / trigger: 게임 종료 직후 결과표만 표시되어 승리 순간의 재미와 보상이 약했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-057 · L77–77 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-058 · L78–78 · 부모 LEGACY-NT-UID-057 |   - 자연 종료 시 1등을 알리는 centered modal을 먼저 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-059 · L79–79 · 부모 LEGACY-NT-UID-057 |   - browser-wide confetti, floating No Thanks! number cards, red tactile chip motion으로 축하 연출을 제공합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-060 · L80–80 · 부모 LEGACY-NT-UID-057 |   - 공동 1등을 지원합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-061 · L81–81 · 부모 LEGACY-NT-UID-057 |   - modal을 닫으면 FINAL TABLE 결과 화면을 확인합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-062 · L82–82 · 부모 LEGACY-NT-UID-057 |   - host 강제 종료에는 승자 celebration을 표시하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-063 · L83–83 · 부모 LEGACY-NT-UID-057 |   - 동일 결과는 결과 version 기반 key를 `sessionStorage`에 기록하여 focus/page lifecycle 재렌더에서도 반복 재생하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-064 · L84–84 · 부모 LEGACY-NT-UID-057 |   - `prefers-reduced-motion`에서는 full-screen FX를 제거합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-065 · L85–85 | - Rationale: 결과 진입을 단순 데이터 표시가 아니라 게임의 명확한 종료 이벤트로 만들되 반복 애니메이션과 접근성 문제를 방지합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-066 · L86–86 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-067 · L87–87 | - Validation: focus/minimize 복귀 재렌더 이슈에 대한 상태 보강 포함. PR #378 automated governance 통과. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-068 · L88–88 | - Baseline relation: post-baseline game-over experience override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-069 · L89–89 | - Functional boundary: 승자 판정은 기존 server-authoritative final result를 사용하며 새로운 승자 계산 권한을 UI에 두지 않음. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-004 — FINAL TABLE result plates

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-070 · L93–93 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-071 · L94–94 | - Applies to: GAME_OVER result presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-072 · L95–95 | - Source: 2026-09-23 developer manual browser review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-073 · L96–96 | - Context / trigger: 기존의 순위/칩/획득 카드를 표 형태로 분할한 결과 화면은 게임 결과의 재미와 시각적 보상이 부족했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-074 · L97–97 | - Previous / rejected direction: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-075 · L98–98 · 부모 LEGACY-NT-UID-074 |   - 단일 가로 카드 내부를 `플레이어 정보 &#124; 보유 칩 &#124; 획득 카드` 3영역으로 나누는 구조는 폐기합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-076 · L99–99 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-077 · L100–100 · 부모 LEGACY-NT-UID-076 |   - 결과 화면은 `FINAL TABLE` 콘셉트로 구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-078 · L101–101 · 부모 LEGACY-NT-UID-076 |   - 1등은 상단 전체 폭의 winner plate로 강조합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-079 · L102–102 · 부모 LEGACY-NT-UID-076 |   - 나머지 플레이어는 아래 2열 result plate grid로 배치하고, 좁은 viewport에서는 1열로 전환합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-080 · L103–103 · 부모 LEGACY-NT-UID-076 |   - 각 plate는 상단 masthead(rank medal / player / final score card)와 하단 playmat(chip tray / acquired-card rack)로 구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-081 · L104–104 · 부모 LEGACY-NT-UID-076 |   - 1등 rank/score/card/chip presentation을 한 단계 더 크게 표현합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-082 · L105–105 · 부모 LEGACY-NT-UID-076 |   - 2등/3등 rank medal은 silver/bronze hierarchy를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-083 · L106–106 · 부모 LEGACY-NT-UID-076 |   - 획득 카드는 gameplay 개인 패널의 `createHandCard()` UI/hover/focus UX를 재사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-084 · L107–107 · 부모 LEGACY-NT-UID-076 |   - 카드 개수별 overlap은 단계적으로 조절하고, 연속 숫자 run 내부는 함께 겹치며 새 run 시작점에는 별도 간격을 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-085 · L108–108 · 부모 LEGACY-NT-UID-076 |   - 최종 보유 칩은 gameplay의 tactile chip visual language를 재사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-086 · L109–109 | - Rationale: 결과를 관리용 표가 아니라 보드게임의 최종 테이블처럼 보여 주어 순위, 점수, 구성물과 플레이 결과를 하나의 게임적 장면으로 읽게 합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-087 · L110–110 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-088 · L111–111 | - Validation: 2026-09-23 developer manual browser review에서 최종 결과 레이아웃을 명시적으로 승인하고 main 병합을 요청함. PR #378 automated governance 통과. | 표현:승인 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-089 · L112–112 | - Baseline relation: adoption baseline 이후 game-over/result layout의 최종 manual-review override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-090 · L113–113 | - Functional boundary: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-091 · L114–114 · 부모 LEGACY-NT-UID-090 |   - 최종 score/winner는 기존 server result를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-092 · L115–115 · 부모 LEGACY-NT-UID-090 |   - 다른 플레이어의 gameplay private counter state는 공개하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-093 · L116–116 · 부모 LEGACY-NT-UID-090 |   - GAME_OVER chip count는 공개 acquired cards의 card score와 server final score의 관계로 계산하여 결과 화면에서만 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-005 — Quiet in-room reconnect presentation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-094 · L120–120 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-095 · L121–121 | - Applies to: in-room Game Shell connection presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-096 · L122–122 | - Supersedes: NT-UI-002의 `reconnecting` 상태를 항상 recovery-critical card로 노출하던 부분 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-097 · L123–123 | - Source: 2026-09-23 developer manual design review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-098 · L124–124 | - Context / trigger: 정상적인 짧은 재동기화에서도 `방 상태 동기화 중` 카드가 반복 노출되어 실제 gameplay보다 시스템 상태가 더 크게 느껴졌습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-099 · L125–125 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-002 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-100 · L126–126 · 부모 LEGACY-NT-UID-099 |   - in-room에서는 정상 success card뿐 아니라 `reconnecting` connection card도 숨깁니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-002 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-101 · L127–127 · 부모 LEGACY-NT-UID-099 |   - 실제 사용자의 개입이 필요한 `offline` / `error` 상태는 계속 명확히 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-002 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-102 · L128–128 · 부모 LEGACY-NT-UID-099 |   - authoritative snapshot refresh/reconnect 동작 자체는 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-002 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-103 · L129–129 | - Rationale: 자동 복구 가능한 일시적 동기화는 조용히 처리하고, 사용자가 대응해야 할 실패 상태만 시각적으로 승격합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-104 · L130–130 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-105 · L131–131 | - Validation: 최신 main 동기화 후 PR #381 Game Platform governance run #502에서 JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard 모두 성공했고 main 병합 완료. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-106 · L132–132 | - Baseline relation: NT-UI-002의 connection-state presentation 일부를 후속 override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-107 · L133–133 | - Functional boundary: reconnect/snapshot/network semantics 변경 없음. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-002 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-006 — Centered FINAL WINNER result card

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-108 · L137–137 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-109 · L138–138 | - Applies to: natural GAME_OVER result hero | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-110 · L139–139 | - Supersedes: 자연 종료 결과에서 승자 문구를 일반 왼쪽 정렬 heading으로만 표시하던 presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-111 · L140–140 | - Source: 2026-09-23 developer manual design review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-112 · L141–141 | - Context / trigger: FINAL TABLE 위의 승자 선언이 정보성 heading처럼 보여, 이미 강화된 winner celebration/result plate와 비교해 결과 진입의 중심점이 약했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-113 · L142–142 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-114 · L143–143 · 부모 LEGACY-NT-UID-113 |   - 자연 종료 시 `FINAL WINNER` label과 `&lt;winner&gt; 승리!`를 중앙 정렬된 독립 winner card로 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-115 · L144–144 · 부모 LEGACY-NT-UID-113 |   - card는 No Thanks!의 dark table surface, gold border/highlight, red tactile chip motif를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-116 · L145–145 · 부모 LEGACY-NT-UID-113 |   - host 수동 종료는 승자 선언이 아니므로 기존 정보형 heading을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-117 · L146–146 · 부모 LEGACY-NT-UID-113 |   - mobile에서도 winner card의 중심 hierarchy와 chip motif가 무너지지 않게 축소합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-118 · L147–147 | - Rationale: 승자 선언 → FINAL TABLE이라는 결과 정보 순서를 명확히 만들고, game-over presentation을 카드/칩 언어 안에서 마무리합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-119 · L148–148 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-120 · L149–149 | - Validation: PR #381 shell regression test와 최신 main 동기화 후 Game Platform governance run #502가 성공했고 main 병합 완료. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-121 · L150–150 | - Baseline relation: NT-UI-003/004의 game-over experience를 연결하는 후속 presentation override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-122 · L151–151 | - Functional boundary: winner/final score 계산은 기존 server-authoritative result를 그대로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-007 — Tabletop Rules Guide

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-123 · L155–155 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-124 · L156–156 | - Applies to: rules/help modal, rules information hierarchy, responsive dialog | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-125 · L157–157 | - Supersedes: generic text-list 중심의 기존 No Thanks! rules modal presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-126 · L158–158 | - Source: 2026-09-23 design implementation review + Game Platform Rules Guide Presentation experiment | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-127 · L159–159 | - Context / trigger: 규칙 내용은 충분했지만 일반 문서형 modal에 가까워, No Thanks!의 핵심인 숫자 카드·칩·거절/가져오기 선택·연속 숫자 점수 계산이 실제 gameplay 구성물과 연결되어 보이지 않았습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-128 · L160–160 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-129 · L161–161 · 부모 LEGACY-NT-UID-128 |   - 규칙 modal을 일반 도움말이 아니라 **tabletop quick guide**로 재구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-130 · L162–162 · 부모 LEGACY-NT-UID-128 |   - header에 large number card와 red tactile chip motif를 사용하고 `HOW TO PLAY` hierarchy를 명확히 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-131 · L163–163 · 부모 LEGACY-NT-UID-128 |   - `GOAL` 영역에서 가장 낮은 최종 점수를 만드는 목표를 먼저 설명합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-132 · L164–164 · 부모 LEGACY-NT-UID-128 |   - 준비 규칙은 `3–35 / 33장 → 9장 비공개 제외 → 24장 실제 덱` 흐름으로 시각화합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-133 · L165–165 · 부모 LEGACY-NT-UID-128 |   - 턴의 핵심 선택은 `NO THANKS!`와 `TAKE` 두 game-local choice card로 설명합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-134 · L166–166 · 부모 LEGACY-NT-UID-128 |   - 연속 숫자 scoring은 실제 number-card visual과 equation을 함께 사용해 `연속 묶음에서는 가장 낮은 숫자만 계산`하는 규칙을 보여줍니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-135 · L167–167 · 부모 LEGACY-NT-UID-128 |   - 종료/승리는 `LOWEST SCORE WINS` hierarchy로 마무리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-136 · L168–168 · 부모 LEGACY-NT-UID-128 |   - 기존 규칙 의미를 유지하고 visual example 없이도 semantic text로 이해할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-137 · L169–169 · 부모 LEGACY-NT-UID-128 |   - 공식 logo/product artwork를 직접 복제하지 않고 기존 CSS card/chip language로 재해석합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-138 · L170–170 · 부모 LEGACY-NT-UID-128 |   - 700px 이하에서는 setup/choice/scoring 구조를 세로로 재배치하고 modal 내부 scroll을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-139 · L171–171 | - Rationale: 규칙 안내 자체를 No Thanks! gameplay presentation의 일부로 만들면서 처음 플레이하는 사용자가 핵심 선택과 점수 구조를 실제 구성물 언어로 더 빠르게 이해하게 합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-140 · L172–172 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-141 · L173–173 | - Validation: PR #381 rules-modal regression test와 최신 main 동기화 후 Game Platform governance run #502가 성공했고 main 병합 완료. 이후 동일 원칙을 Can’t Stop Rules Guide와 전체 redesign에 적용해 공통 UI 규칙으로 승격됨. | 표현:원칙 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-142 · L174–174 | - Baseline relation: `UI_DESIGN.md`의 game-local modal 방향을 구체화하고 기존 generic rules presentation을 대체합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-143 · L175–175 | - Functional boundary: 규칙 사실은 `GAME_SPEC.md`/authoritative gameplay를 따르며 DB/RPC/game state를 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-008 — Covert Affair / Hard Boiled soundtrack split

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-144 · L179–179 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-145 · L180–180 | - Applies to: entry / waiting lobby / gameplay / result-rematch audio presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-146 · L181–181 | - Source: 2026-09-24 user soundtrack selection | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-147 · L182–182 | - Context / trigger: No Thanks!의 카드·칩 심리전 분위기에 맞는 로비/플레이 전용 BGM을 확정했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-148 · L183–183 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-149 · L184–184 · 부모 LEGACY-NT-UID-148 |   - lobby 계열 화면에는 Kevin MacLeod의 `Covert Affair` (ISRC `USUAN1100795`)를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-150 · L185–185 · 부모 LEGACY-NT-UID-148 |   - 실제 `PLAYING` phase에는 Kevin MacLeod의 `Hard Boiled` (ISRC `USUAN1700076`)를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-151 · L186–186 · 부모 LEGACY-NT-UID-148 |   - GAME_OVER / rematch 준비를 포함해 `PLAYING`이 아닌 상태는 lobby track으로 복귀합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-152 · L187–187 · 부모 LEGACY-NT-UID-148 |   - 기존 shared Game BGM controller/player를 재사용해 재생/일시정지, 볼륨, 출처/라이선스 UI와 브라우저 autoplay 대응을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-153 · L188–188 · 부모 LEGACY-NT-UID-148 |   - 두 곡의 Incompetech CC BY 4.0 attribution metadata를 shared BGM catalog에 등록합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-154 · L189–189 | - Rationale: 실제 사용감을 기준으로 두 트랙의 역할을 교체해 로비에는 `Covert Affair`, 플레이에는 `Hard Boiled`를 배치하면서 기존 Game Platform 오디오 UX는 그대로 유지합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-155 · L190–190 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-156 · L191–191 | - Validation: `tests/game-platform-no-thanks-bgm.test.js`에서 track metadata, lobby ↔ gameplay 전환, page wiring을 회귀 검증합니다. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-157 · L192–192 | - Baseline relation: `UI_DESIGN.md`의 sound 방향을 실제 사용자 확정 soundtrack으로 구체화한 post-closeout override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-158 · L193–193 | - Functional boundary: gameplay state / RPC / DB authority / 카드·칩 규칙 변경 없음. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-009 — Staged tabletop game-start sequence

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-159 · L197–197 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-160 · L198–198 | - Applies to: WAITING → PLAYING 전환 직후의 opening presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-161 · L199–199 | - Source: 2026-09-24 iterative manual design review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-162 · L200–200 | - Context / trigger: 방장이 게임 시작을 눌렀을 때 board가 즉시 나타나 첫 카드가 공개되는 흐름은 준비된 카드·칩 게임을 시작한다는 몰입감이 약했고, 대기 화면과 플레이 화면의 deck/chip 위치가 바뀌면 순간이동처럼 보였습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-163 · L201–201 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-164 · L202–202 · 부모 LEGACY-NT-UID-163 |   - WAITING 원형 테이블에 실제 플레이와 동일한 좌표의 draw deck과 중앙 chip bank를 미리 배치합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-165 · L203–203 · 부모 LEGACY-NT-UID-163 |   - 중앙에는 compact `게임 준비 중 / 모두 준비되면 / 바로 시작합니다.` card를 사용하고 deck/center/chip 세 슬롯의 위치는 WAITING과 PLAYING에서 동일하게 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-166 · L204–204 · 부모 LEGACY-NT-UID-163 |   - host start 후 goal message card와 `곧 게임이 시작됩니다.` message card를 각각 2.5초 노출합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-167 · L205–205 · 부모 LEGACY-NT-UID-163 |   - 두 번째 message card의 fade-out이 완전히 끝나면 추가 idle delay 없이 table setup motion을 시작합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-168 · L206–206 · 부모 LEGACY-NT-UID-163 |   - 중앙 chip bank의 배분과 deck shuffle은 동시에 시작하되 chip 배분이 먼저 끝나고 deck shuffle은 더 길게 이어집니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-169 · L207–207 · 부모 LEGACY-NT-UID-163 |   - viewer에게 지급되는 시작 칩은 중앙 bank에서 빠져나와 개인 패널의 최종 chip-pile 슬롯에 하나씩 그대로 쌓입니다. 다른 플레이어 몫은 seat avatar로 이동하고 avatar에 닿는 마지막 구간에서만 작아지며 투명해져 흡수되는 인상을 줍니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-170 · L208–208 · 부모 LEGACY-NT-UID-163 |   - source chip은 각 flight가 출발할 때 중앙 bank에서 함께 사라져 실제로 더미가 줄어드는 모습을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-171 · L209–209 · 부모 LEGACY-NT-UID-163 |   - draw deck은 새 카드가 날아와 쌓이는 방식이 아니라 이미 놓인 deck이 펼쳐진 뒤 **4번의 discrete mix beat**를 거치고 다시 한 덱으로 모입니다. 각 beat 사이에는 짧은 hold를 두되 개별 이동은 부드러운 easing을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-172 · L210–210 · 부모 LEGACY-NT-UID-163 |   - deck 정돈이 끝나는 즉시 기존 deck → current-card deal/flip animation으로 첫 카드를 공개합니다. 첫 카드 landing 전까지 TAKE/REFUSE는 잠급니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-173 · L211–211 · 부모 LEGACY-NT-UID-163 |   - opening sequence는 실제 WAITING → PLAYING authoritative transition에서만 재생하고 reload/reconnect로 이미 PLAYING에 들어온 경우 재생하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-174 · L212–212 · 부모 LEGACY-NT-UID-163 |   - `prefers-reduced-motion`에서는 대규모 이동 motion을 생략하고 동일 authoritative state로 빠르게 수렴합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-175 · L213–213 | - Rationale: game state를 바꾸지 않고도 카드와 칩이 실제 테이블에 준비되고 배분되는 물리적 흐름을 보여 주며, 대기→플레이 전환에서 위치 점프와 과도한 idle 시간을 제거합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-176 · L214–214 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-177 · L215–215 | - Validation: PR #391 반복 manual review 후 PR #394에 통합. PR #394 integration head에서 Game Platform governance #555와 Site static checks #3446 성공. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-178 · L216–216 | - Baseline relation: `UI_DESIGN.md`의 tabletop motion / cause→movement→authoritative result 원칙을 game-start 영역에 구체화한 post-closeout override. | 표현:원칙 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-179 · L217–217 | - Functional boundary: room status/current card/chip count의 authority는 서버 snapshot이 소유하고 opening은 presentation layer에서만 conceal/reveal/flight를 수행합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-010 — Authoritative transfer continuity at take/end boundaries

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-180 · L221–221 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-181 · L222–222 | - Applies to: TAKE_CARD, opponent take presentation, last-card transition, host manual termination | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-182 · L223–223 | - Source: 2026-09-24 iterative manual design review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-183 · L224–224 | - Context / trigger: TAKE 시 실제 source component와 flight component가 동시에 보이거나, 마지막 카드 획득 뒤 테이블에 원본 카드가 남거나, 수동 게임 종료 직후 이미 예약된 deal animation이 재생되면 authoritative state와 시각 상태가 어긋나 보였습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-184 · L225–225 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-185 · L226–226 · 부모 LEGACY-NT-UID-184 |   - TAKE presentation은 source component가 이동을 시작하는 순간 원본 presentation을 숨기고 flight copy만 보이게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-186 · L227–227 · 부모 LEGACY-NT-UID-184 |   - viewer TAKE의 카드/칩은 실제 개인 패널의 최종 landing target으로 이동하며, opponent TAKE의 공개 획득 요소는 해당 player seat/avatar 방향으로 수렴합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-187 · L228–228 · 부모 LEGACY-NT-UID-184 |   - 마지막 카드 TAKE에서도 원형 테이블의 source card를 flight 시작과 함께 숨겨, 개인 패널로 이동하는 카드와 테이블 카드가 중복 노출되지 않게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-188 · L229–229 · 부모 LEGACY-NT-UID-184 |   - 마지막 카드가 landing한 뒤에는 3초간 game-local `게임 결과를 집계 중입니다` gate를 거쳐 FINAL TABLE로 전환합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-189 · L230–230 · 부모 LEGACY-NT-UID-184 |   - 방장이 진행 중 게임을 수동 종료하면 활성 deal presentation을 즉시 cancel하고 flight/receiving 상태를 정리하여 종료 이후 새 카드가 뒤집혀 이동하는 연출을 남기지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-190 · L231–231 · 부모 LEGACY-NT-UID-184 |   - opponent seat로 흡수되는 시작/이동 칩은 flight 대부분 구간에서 선명도를 유지하고 avatar contact 직전 마지막 구간에서만 fade/scale down합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-191 · L232–232 | - Rationale: 애니메이션이 authoritative snapshot과 다른 카드/칩을 주장하지 않도록 하고, 실제 구성물이 한 위치에서 다른 위치로 이동했다는 continuity를 유지합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-192 · L233–233 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-193 · L234–234 | - Validation: PR #390/#391 회귀 테스트를 PR #394에서 통합하고 Game Platform governance #555 통과. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-194 · L235–235 | - Baseline relation: Phase A–D TAKE/deal motion과 NT-UI-003/004의 game-over transition을 보강하는 post-closeout override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-195 · L236–236 | - Functional boundary: TAKE legality, next card, final score, end reason은 기존 server-authoritative RPC/snapshot만 사용하며 presentation cancel/hide는 결과를 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-011 — Maximum-hand responsive overlap

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-196 · L240–240 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-197 · L241–241 | - Applies to: gameplay 개인 획득 카드 hand / GAME_OVER FINAL TABLE acquired-card rack | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-198 · L242–242 | - Source: 2026-09-24 manual review of dense hands | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-199 · L243–243 | - Context / trigger: 획득 카드가 많아질수록 개인 패널과 결과 카드 rack 바깥으로 카드가 밀려나고, 연속 숫자 run 사이의 고정 간격도 dense hand에서 지나치게 많은 폭을 사용했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-200 · L244–244 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-201 · L245–245 · 부모 LEGACY-NT-UID-200 |   - 첫 버전 24장 draw deck을 기준으로 한 플레이어가 최대 24장을 보유할 수 있는 worst case까지 레이아웃에 포함합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-202 · L246–246 · 부모 LEGACY-NT-UID-200 |   - gameplay hand overlap은 보유 장수 구간에 따라 단계적으로 더 타이트해집니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-203 · L247–247 · 부모 LEGACY-NT-UID-200 |   - FINAL TABLE은 기본 card-count overlap 단계뿐 아니라 실제 rack의 available width, card width, run-start count를 측정해 overlap과 run margin을 동적으로 다시 계산합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-204 · L248–248 · 부모 LEGACY-NT-UID-200 |   - 새 run 시작점의 간격도 카드 수/가용 폭이 부족하면 함께 축소하며, dense hand 때문에 horizontal overflow가 발생하지 않게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-205 · L249–249 · 부모 LEGACY-NT-UID-200 |   - 왼쪽 상단/오른쪽 하단 corner number와 기존 hover/focus UX는 유지하여 겹침이 커져도 카드 값을 읽을 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-206 · L250–250 | - Rationale: 고정 폭을 늘려 화면 전체를 키우는 대신 카드 수에 따라 presentation 밀도를 조절하여 데스크톱/좁은 viewport 모두에서 최대 hand를 수용합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-207 · L251–251 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-208 · L252–252 | - Validation: PR #389의 measured result-rack 계산과 PR #391의 강화된 최대-hand overlap을 PR #394에서 통합. Game Platform governance #555 / Site static checks #3446 통과. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-209 · L253–253 | - Baseline relation: NT-UI-004 FINAL TABLE card rack과 `UI_DESIGN.md` 개인 패널 overlap 정책의 후속 override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-210 · L254–254 | - Functional boundary: 카드 보유/정렬/점수 데이터는 변경하지 않고 DOM spacing만 계산합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-012 — Tighter gameplay hand and ordered insertion slide

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-211 · L258–258 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-212 · L259–259 | - Applies to: gameplay 개인 획득 카드 hand / TAKE_CARD landing motion | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-213 · L260–260 | - Supersedes: NT-UI-011의 gameplay hand density 수치와 TAKE 후 기존 카드가 단계적으로 재배치되던 presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-214 · L261–261 | - Source: 2026-09-25 developer manual browser review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-215 · L262–262 | - Context / trigger: 개인 hand는 카드 수가 늘어날수록 더 타이트하게 겹쳐도 hover/focus로 값을 확인할 수 있고, 새 카드를 오름차순 위치에 바로 넣을 때 기존 카드가 순간적으로 자리만 바꾸면 실제 카드 사이에 공간을 만드는 감각이 약했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-216 · L263–263 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-217 · L264–264 · 부모 LEGACY-NT-UID-216 |   - gameplay hand는 적은 카드부터 과도하게 겹치지 않습니다. 카드 장수별 fallback overlap을 1장 단위로 세분화하되, 실제 화면에서는 개인 패널의 사용 가능한 폭과 카드 폭을 측정해 **오른쪽 여백이 남아 있으면 펼친 상태를 우선**합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-218 · L265–265 · 부모 LEGACY-NT-UID-216 |   - 펼친 카드가 실제 가용 폭을 넘기기 시작할 때만 약 5px 단위로 overlap level을 한 단계씩 높이고, 카드가 더 늘어나거나 viewport가 좁아질수록 필요한 만큼만 추가 압축합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-219 · L266–266 · 부모 LEGACY-NT-UID-216 |   - 같은 연속 숫자 run 내부는 이 adaptive overlap을 사용하고, 새 run 시작점은 일반 카드 간격보다 최대 약 28px 더 넓게 유지해 연속 묶음 경계를 한눈에 구분할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-220 · L267–267 · 부모 LEGACY-NT-UID-216 |   - run 경계 공간까지 포함해 폭이 부족해질 때에는 run 간격도 함께 점진적으로 줄이되 항상 같은 run 내부보다 넓게 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-221 · L268–268 · 부모 LEGACY-NT-UID-216 |   - 이 adaptive spacing은 gameplay 개인 패널에만 적용하며 FINAL TABLE의 measured result-rack 계산은 그대로 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-222 · L269–269 · 부모 LEGACY-NT-UID-216 |   - TAKE 성공 시 새 카드는 처음부터 최종 오름차순 slot을 landing target으로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-223 · L270–270 · 부모 LEGACY-NT-UID-216 |   - 기존 보유 카드는 authoritative rerender 전 좌표와 최종 정렬 좌표의 차이를 기준으로 약 420ms FLIP-style slide를 적용해 새 카드가 들어올 공간을 부드럽게 만듭니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-224 · L271–271 · 부모 LEGACY-NT-UID-216 |   - 마지막 카드 TAKE도 동일한 정렬/slide 원칙을 사용합니다. | 표현:원칙 | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-225 · L272–272 · 부모 LEGACY-NT-UID-216 |   - `prefers-reduced-motion`에서는 기존 카드 slide를 생략하고 최종 정렬 상태로 즉시 수렴합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-226 · L273–273 | - Rationale: 개인 패널 높이와 폭을 늘리지 않고 카드 밀도를 높이면서도, 정렬 변경을 순간적인 점프가 아니라 실제 카드를 옆으로 밀어 자리를 만드는 동작으로 읽히게 합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-227 · L274–274 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-228 · L275–275 | - Validation: PR #396 후속 작업에서 Game Platform governance 및 developer manual browser review 예정. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-229 · L276–276 | - Baseline relation: NT-UI-011의 dense-hand 원칙을 유지하되 gameplay hand의 구체 밀도와 TAKE insertion motion을 후속 override합니다. FINAL TABLE의 measured result-rack 계산은 변경하지 않습니다. | 표현:원칙 | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-230 · L277–277 | - Functional boundary: 카드 보유 순서/점수/RPC authority는 변경하지 않고 presentation geometry와 motion만 조정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Decision Log > NT-UI-013 — Tactile card/chip audio feedback

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-231 · L281–281 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-232 · L282–282 | - Applies to: game-start setup, TAKE_CARD transfer, REFUSE_CARD chip transfer | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-233 · L283–283 | - Source: 2026-09-25 iterative user audio review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-234 · L284–284 | - Context / trigger: 초기 효과음은 pitched oscillator 중심이라 카드 이동이 전자음처럼 들리고 칩도 실제 tabletop token보다 금속성 cue에 가까웠습니다. 사용자는 카드가 실제로 미끄러지고 칩이 실제 더미에 쌓이는 물성감을 원했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-235 · L285–285 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-236 · L286–286 · 부모 LEGACY-NT-UID-235 |   - 카드 이동은 음높이가 두드러지는 `뿅` 계열 cue 대신 filtered-noise 기반의 짧은 cardstock slide `스윽/스륵` 질감으로 표현합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-237 · L287–287 · 부모 LEGACY-NT-UID-235 |   - 중앙 칩을 가져올 때는 금속 동전의 `짤랑` 대신 플라스틱 칩이 더미에 닿는 짧고 건조한 `착` impact를 chip count에 맞춰 연속 재생합니다. 과도한 소음 방지를 위해 audible stack hit는 최대 8회로 제한합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-238 · L288–288 · 부모 LEGACY-NT-UID-235 |   - TAKE의 card slide와 collected-chip stack cue는 사용자 manual review 후 opening setup SFX에는 영향을 주지 않고 **TAKE 동작에서만 기존 대비 약 2배** gain으로 강화합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-239 · L289–289 · 부모 LEGACY-NT-UID-235 |   - REFUSE_CARD는 authoritative chip flight가 시작할 때 `스윽` 이동 질감을 시작하고 약 620ms flight가 끝나기 직전 `착` stack impact가 들리도록 맞춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-240 · L290–290 · 부모 LEGACY-NT-UID-235 |   - `prefers-reduced-motion`에서 flight가 생략되면 이동음 없이 landing `착`만 재생하여 실제 시각 흐름과 사운드 원인/결과를 맞춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-241 · L291–291 · 부모 LEGACY-NT-UID-235 |   - game-start deck shuffle과 초기 chip distribution은 서로 독립적인 효과음을 동시에 쌓지 않고 하나의 coordinated timeline으로 스케줄해 competing audio bed를 만들지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-242 · L292–292 · 부모 LEGACY-NT-UID-235 |   - SFX는 game-local Web Audio로 구현하며 실패하거나 브라우저 정책에 의해 재생되지 않아도 gameplay state/action은 중단하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-243 · L293–293 | - Rationale: No Thanks!의 핵심 상호작용을 전자 UI cue가 아니라 실제 카드와 칩을 만지는 tabletop feedback으로 읽히게 하고, 시각 animation의 출발/도착과 소리의 원인/결과를 일치시킵니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-244 · L294–294 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-245 · L295–295 | - Validation: PR #397의 `tests/game-platform-no-thanks-audio-feedback.test.js`로 card slide, stacked-chip cue, REFUSE flight/landing timing을 회귀 검증했고 Game Platform governance #580 전체 성공 후 main 병합 완료. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-246 · L296–296 | - Baseline relation: NT-UI-008의 soundtrack/BGM 결정을 보완하는 game-action SFX layer이며 NT-UI-009/010의 physical transfer motion에 audio feedback을 연결합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-247 · L297–297 | - Functional boundary: sound는 presentation only이며 gameplay legality, RPC, DB state, turn timing authority를 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Superseded / Rejected

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-248 · L301–301 | - 기존 generic text-list 중심 rules modal은 NT-UI-007에 의해 superseded. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-249 · L302–302 | - NT-UI-002에서 reconnecting 상태를 recovery card로 유지하던 부분은 NT-UI-005에 의해 superseded하며 offline/error 노출 원칙은 유지합니다. | 표현:원칙 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-250 · L303–303 | - 자연 종료 결과의 일반 heading형 승자 선언은 NT-UI-006에 의해 superseded. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-251 · L304–304 | - 결과 화면의 이전 `순위 목록 + 별도 획득 카드 목록` 구조는 NT-UI-004에 의해 superseded. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-252 · L305–305 | - 결과 플레이어 카드를 `플레이어 정보 &#124; 최종 보유 칩 &#124; 획득 카드` 3분할 행으로 표현하던 manual-review 중간안은 NT-UI-004에 의해 superseded. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-253 · L306–306 | - 과거의 별도 redesign 제안이나 종료된 PR에 남아 있는 디자인안은 그 자체로 현재 기준이 아닙니다. 복원할 때는 현재 main과 `UI_DESIGN.md`, 실제 사용자 결정과 대조해 살아 있는 결정만 구분합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Validation History

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-254 · L310–310 | - 2026-09-23 — UI_DECISIONS 문서 체계 도입. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-255 · L311–311 | - 2026-09-23 — PR #378 room header / environmental identity / winner celebration / FINAL TABLE result design automated governance 반복 검증. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-256 · L312–312 | - 2026-09-23 — FINAL TABLE 결과 디자인에 대해 developer manual browser review 완료 및 main 병합 승인. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-257 · L313–313 | - 2026-09-23 — PR #381 quiet reconnect / FINAL WINNER card / tabletop Rules Guide 구현 및 자동 회귀 검증 완료. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-258 · L314–314 | - 2026-09-23 — 최신 main 동기화 후 PR #381 Game Platform governance run #502 전체 성공. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-259 · L315–315 | - 2026-09-23 — PR #381 main 병합 완료. merge commit: `c43f96f984b90049b59b163bffd16c9a5fb5cf04`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-260 · L316–316 | - 2026-09-23 — Tabletop Rules Guide에서 검증한 game-local rules presentation 원칙이 Can’t Stop 실험을 거쳐 Game Platform 공통 UI 규칙으로 승격됨. | 표현:원칙,검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-261 · L317–317 | - 2026-09-23 — 기능 체크포인트와 함께 디자인 closeout을 재검토해 NT-UI-001~007이 현재 main의 active design baseline임을 확인. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-262 · L318–318 | - 2026-09-24 — user-selected No Thanks! soundtrack을 NT-UI-008로 확정하고 shared BGM 패턴으로 구현. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-263 · L319–319 | - 2026-09-24 — PR #390/#391의 final-take 및 game-start presentation을 반복 manual review로 다듬고 NT-UI-009~010의 안정된 motion/transition 원칙으로 확정. | 표현:원칙 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-264 · L320–320 | - 2026-09-24 — dense hand overflow 수정과 PR #389 measured result-rack 계산을 통합해 NT-UI-011로 확정. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-265 · L321–321 | - 2026-09-24 — 통합 PR #394를 최신 main 대비 `behind 0 / mergeable` 상태와 Governance/Site/DB 통과를 확인한 뒤 main에 병합. merge commit: `91d9ca42b6340888f6c9680bda2dcce604da6ed3`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-266 · L322–322 | - 2026-09-24 — post-#394 디자인 체크포인트에서 NT-UI-001~011을 현재 active design baseline으로 재확인. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-267 · L323–323 | - 2026-09-25 — PR #396 follow-up manual review에서 gameplay hand density와 sorted insertion slide를 NT-UI-012로 확정하고, opening goal copy의 명시적 2줄 배치와 focus/visibility deal replay 방지를 함께 구현. PR #396 merge commit: `2666267f673e2035ceb678ab950cc889ee188c09`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-268 · L324–324 | - 2026-09-25 — PR #397에서 lobby/gameplay BGM 역할을 `Covert Affair / Hard Boiled`로 확정하고, card slide / collected-chip stack / refuse `스윽 → 착` SFX를 사용자 반복 검토로 조정해 NT-UI-013으로 기록. Game Platform governance #580 통과 후 merge commit `616626f53f5fb8554fff8df2e86cc50a22e8aefa`로 main 병합. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-269 · L325–325 | - 2026-09-25 — 첫 공개 버전 디자인 체크포인트에서 NT-UI-001~013을 현재 active design baseline으로 재확인하고 Current Design Track을 `FINAL / DESIGN_CLOSEOUT`으로 전환. 이후 Phase E 후보는 post-release follow-up으로 분리. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Open Follow-up

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-270 · L329–329 | - Phase E 후보인 다른 플레이어 공개 획득 카드 popover와 후속 polish는 release blocker가 아닌 별도 post-closeout scope로 진행합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-271 · L330–330 | - 과거 No Thanks! 관련 PR/commit의 pre-UI_DECISIONS 디자인 결정을 복원할 필요가 생기면 실제 main·과거 증거·현재 active decision을 함께 대조하고 폐기된 안을 되살리지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

## NT-REL — `games/no-thanks/RELEASE_CHECKLIST.md`

- source: [games/no-thanks/RELEASE_CHECKLIST.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/RELEASE_CHECKLIST.md)
- blob: `28d562743296889439d19d72bcaa84d843669b0d`; 원문 88줄; 상태 `GAME_LOCAL`; 61 관리단위 / 60 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### No Thanks! Release Readiness Checklist

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-001 · L3–3 | 이 문서는 No Thanks!를 실제 서비스 기능으로 활성화하기 전 마지막 검증 게이트를 추적합니다. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Automated gates

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-002 · L7–7 | - &#91;x&#93; 순수 규칙 엔진 단위 테스트 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-003 · L8–8 | - &#91;x&#93; 승인회원 Access Gate / Common Game Shell 계약 테스트 | 표현:승인 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-004 · L9–9 | - &#91;x&#93; Room/Lobby DB/RPC 플랫폼 필수 계약 | 표현:필수 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-005 · L10–10 | - &#91;x&#93; private counter / draw deck / excluded card 비노출 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-006 · L11–11 | - &#91;x&#93; gameplay stale version / duplicate / concurrent conflict 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-007 · L12–12 | - &#91;x&#93; 자연 종료 점수 / 공동 승자 / 방장 수동 종료 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-008 · L13–13 | - &#91;x&#93; reconnect snapshot authoritative 복원 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-009 · L14–14 | - &#91;x&#93; Presence lifecycle / 다중 탭 user merge 계약 테스트 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-010 · L15–15 | - &#91;x&#93; 3개 독립 인증 세션 자연 종료 통합 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-011 · L16–16 | - &#91;x&#93; 7개 독립 인증 세션 full refuse cycle / private counter 격리 통합 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-012 · L17–17 | - &#91;x&#93; start RPC가 3~35 전체 33장을 정확히 한 번씩 포함하면서 canonical ascending order와 다른 randomized draw order를 저장하는 회귀 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-013 · L18–18 | - &#91;x&#93; 마지막 카드 TAKE source-card 중복 제거 / 수동 종료 시 active deal cancel / 최대 24장 result-rack responsive fit 계약 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-014 · L19–19 | - &#91;x&#93; PR #396 첫 action / sorted TAKE landing / adaptive hand spacing / focus·visibility deal replay 회귀 검증 및 Game Platform governance #573 통과 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-015 · L20–20 | - &#91;x&#93; PR #397 Rules Guide 0칩 문구 / lobby↔gameplay BGM / card·chip tactile SFX 회귀 검증 및 Game Platform governance #580 통과 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Rematch / post-game

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-016 · L24–24 | - &#91; &#93; 자연 종료 후 방장이 `재대결 준비`를 누르면 room code와 참가자 context가 유지된 채 waiting 상태로 돌아간다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-017 · L25–25 | - &#91; &#93; 일반 플레이어 ready를 다시 완료한 뒤 방장이 같은 room에서 새 게임을 시작할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-018 · L26–26 | - &#91; &#93; 재대결 준비 상태에서 새로고침/재접속해도 같은 room의 authoritative waiting snapshot을 복원한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-019 · L27–27 | - &#91; &#93; GAME_OVER에서 방장이 나가면 남은 active player에게 host가 승계되고 새 host가 재대결 준비를 실행할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-020 · L28–28 | - &#91; &#93; 결과방에서 이탈한 플레이어가 있어 최소 인원 미만이면 새 참가자 또는 이탈자가 같은 room code로 참가한 뒤 다시 시작할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Manual browser gates

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-021 · L32–32 | 아래 항목은 자동 DB 통합 테스트가 대체하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-022 · L34–34 | - &#91;x&#93; 2026-09-25까지 실제 멀티플레이 환경에서 반복 플레이 테스트 수행 (사용자 확인). 아래 세부 reconnect / 7-client / mobile / offline 시나리오는 각각 확인된 경우에만 별도 완료 처리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-023 · L35–35 | - &#91; &#93; 데스크톱 3개 실제 브라우저/프로필에서 방 생성 → 참가 → 준비 → 시작 → 자연 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-024 · L36–36 | - &#91; &#93; 실제 7개 클라이언트에서 roster와 현재 차례 표시 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-025 · L37–37 | - &#91; &#93; 현재 차례 플레이어 브라우저 종료 → 다른 클라이언트에서 `재접속 대기` 확인 → 재접속 후 같은 turn 복원 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-026 · L38–38 | - &#91; &#93; 방장 브라우저 종료 → 자동 위임/자동 종료가 발생하지 않는지 확인 → 방장 재접속 후 권한 복원 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-027 · L39–39 | - &#91; &#93; 동일 사용자의 2개 탭 접속 시 Presence가 사용자 1명으로 표시되는지 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-028 · L40–40 | - &#91; &#93; 모바일 백그라운드 → foreground 복귀 시 authoritative snapshot 재조회 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-029 · L41–41 | - &#91; &#93; 네트워크 offline → online 복귀 시 connection banner와 최신 snapshot 복원 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-030 · L42–42 | - &#91; &#93; 결과방에서 재대결 준비 → 같은 room code와 참가자 맥락 유지 → ready 재설정 → 방장 재시작 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Design closeout gate

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-031 · L46–46 | - &#91;x&#93; `UI_DESIGN.md` adoption baseline과 `UI_DECISIONS.md`의 최신 non-superseded decision(NT-UI-001~013)을 함께 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-032 · L47–47 | - &#91;x&#93; 수동 디자인 리뷰에서 확정된 game-start / transfer-continuity / dense-hand / sorted insertion / tactile audio 수정이 코드에만 남지 않도록 `UI_DECISIONS.md`에 NT-UI-009~013으로 기록 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-033 · L48–48 | - &#91;x&#93; PR #396 gameplay hand/motion/focus polish와 PR #397 BGM/SFX polish를 main 병합 상태에서 디자인 baseline으로 재확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-034 · L49–49 | - &#91;x&#93; 남은 UI 항목을 release blocker와 post-release follow-up으로 구분 — Phase E 공개 획득 카드 popover/추가 polish는 post-release follow-up | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-035 · L50–50 | - &#91;x&#93; `UI_DECISIONS.md / Current Design Track`을 `FINAL / DESIGN_CLOSEOUT`으로 기록 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Production database gates

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-036 · L54–54 | - &#91;x&#93; 운영 DB migration 적용 순서 재확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-037 · L55–55 | - &#91;x&#93; `20260924073500_no_thanks_randomized_draw_order.sql` 운영 Supabase 적용 및 migration history / 현재 함수 정의 확인 (2026-09-26) | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-038 · L56–56 | - &#91;x&#93; Room/Lobby foundation 운영 migration 적용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-039 · L57–57 | - &#91;x&#93; Gameplay actions 운영 migration 적용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-040 · L58–58 | - &#91;x&#93; 공개 room/player 테이블만 Supabase Realtime publication에 등록 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-041 · L59–59 | - &#91;x&#93; private helper 함수 EXECUTE 권한을 `PUBLIC / anon / authenticated`에서 회수하고 RLS helper만 authenticated에 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-042 · L60–60 | - &#91;x&#93; 운영 적용 직전/직후 Supabase security/performance advisor 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-043 · L61–61 | - &#91; &#93; 운영 migration 적용 후 승인회원 create/join/snapshot/gameplay 브라우저 smoke test | 표현:승인 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-044 · L62–62 | - &#91;x&#93; private table이 authenticated SELECT 및 Realtime publication에 노출되지 않는지 운영 환경 재확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-045 · L63–63 | - &#91;x&#93; public gameplay/create RPC execute 권한이 authenticated에만 허용되는지 운영 환경 재확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-046 · L65–65 | 운영 적용 확인 완료 migration history: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-047 · L66–66 | - `no_thanks_room_lobby_foundation` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-048 · L67–67 | - `no_thanks_gameplay_actions` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-049 · L68–68 | - `no_thanks_realtime_publication` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-050 · L69–69 | - `no_thanks_private_helper_permissions` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-051 · L70–70 | - `20260923224856 no_thanks_randomized_draw_order` — 저장소의 `20260924073500_no_thanks_randomized_draw_order.sql`과 동일한 start RPC 랜덤 draw-order 보정이 운영 함수 정의에 반영된 것을 2026-09-26 재확인. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-052 · L72–72 | Advisor에서 No Thanks! 관련으로 남는 항목 중 `no_thanks_room_actions / no_thanks_room_private_state`의 RLS-without-policy는 직접 table access를 막는 의도적인 deny-all 경계입니다. public `SECURITY DEFINER` RPC 경고는 authenticated 사용자에게 의도적으로 노출한 API이며 각 함수가 승인회원/room/turn/version 권한을 서버에서 다시 검증합니다. FK covering index 2건은 현재 QA 차단 이슈가 아닌 INFO 항목으로 release hardening에서 재검토합니다. | 표현:승인,검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Activation gates

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-053 · L76–76 | 2026-09-26 사용자의 명시적 공개 출시 승인에 따라 서비스 활성화를 진행합니다. 아래에서 아직 체크되지 않은 세부 manual browser / production smoke 항목은 완료로 간주하지 않으며 post-release hardening으로 계속 추적합니다. | 표현:승인 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-054 · L78–78 | - &#91;x&#93; Registry `online: true` 활성화 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D09 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-055 · L79–79 | - &#91;x&#93; 구현된 Realtime Presence 기준으로 `presence: true` 활성화 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-056 · L80–80 | - &#91;x&#93; 게임 목록에 사용자용 서비스 상태로 노출 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-057 · L81–81 | - &#91;x&#93; invite 기능은 별도 구현/검증 전까지 비활성 유지 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-058 · L82–82 | - &#91; &#93; release 후 첫 실제 세션 로그/오류 모니터링 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### Release rule

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-059 · L86–86 | - 기능 구현 checkpoint baseline은 PR #397 merge commit `616626f53f5fb8554fff8df2e86cc50a22e8aefa`입니다. 이 시점 이후 별도 core development phase는 계획하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-060 · L87–87 | - 디자인 checkpoint baseline은 `UI_DESIGN.md + UI_DECISIONS.md NT-UI-001~013`이며 `FINAL / DESIGN_CLOSEOUT` 상태입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-061 · L88–88 | - 2026-09-26 공개 활성화는 사용자의 명시적 출시 승인으로 진행합니다. 아직 체크되지 않은 manual browser / production smoke / rematch 항목은 검증 완료로 간주하지 않으며 post-release hardening으로 계속 추적합니다. | 표현:승인,검증 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
