# STEP 2 — Astra 판단용 근거 요약

이 문서는 준비 입력이다. 정식 장르 규칙 인덱스·구현 선택표·신규 규칙을 대신하지 않는다.

## 기준과 범위

- 실행 계획 개정 1.3 STEP 2. 승인 integration / STEP 2 분기: `2636d47d4a47e09c9ba4729ee5a16bc1cc7216ad`.
- PR #408 MERGED, merge SHA는 위와 동일. STEP 1 COMPLETED. CP-0011은 병합 전 사실 기록으로 보존한다.
- STEP 2 IN_PROGRESS, STEP 3 이후 NOT_STARTED, integration→main 미승인·미수행.
- branch: `docs/game-platform-vnext-phase2-taxonomy`.
- 모델별 요청: [작업 분담](step-2-work-allocation.md).

## STEP 2 필수 산출물과 경계

장르 규칙 묶음·적용 조건·논리적 문서 소유자를 정의하고, 장르 규칙 인덱스 초안 / 구현 선택표와 호환·충돌 예시 / GAME_SPEC에 남길 장르·모델 선택 근거를 작성한다.

7축: gameplay flow(턴/동시/지속), 시간·입력 주기, 세션/지속성, 참여/가시성, 권위/동기화/복원, 공간·렌더링·입력/물리, 결과·메타 progression. 단일/복수 선택과 단계별 변경을 명시한다. 장르와 실행 모델은 다대다 관계다. Invite/Presence는 별도 선택 목록이며 renderer FPS / simulation tick / network update 빈도를 구분한다.

논리적 문서 소유자는 STEP 2 초안이며 물리 경로·Core API·Runtime Model 계약·STEP 6 Target을 확정하지 않는다. STEP 7의 실제 규칙 개편과 STEP 3 전수 stress matrix를 진행하지 않는다. 기존 board/host/ready/DOM/DB 전제를 모든 신규 게임에 강제하지 않되 기존 의무를 분류만으로 삭제하지 않는다.

## 승인 STEP 1의 판단 입력

- 26문서 / 3,232관리단위 / 2,104규칙·필드 / K1,198 / L906. 독립 MUST의 수가 아니다.
- P897 / B11 / M-ROOM30 / M-DB114 / M-DOM11 / M-INVITE7 / S128 / L906. P38개 R01-BOARD는 조건 분해 대상이며 B11만이 전체 보드게임 의무는 아니다.
- P는 미래 Core, M은 확정 Runtime Model이 아니다. L의 기존 게임 사양은 장르 공통 의무로 자동 승격하지 않는다.
- F01 Major(snapshot/action 버전·수명), F02 Major(No Thanks! handoff/활성화 기록), F03 Minor(DB test 10/11)는 기존 findings다. 이번 STEP에서 기존 코드·원문을 고치지 않는다.
- host/ready 비보편성·fake method 금지와 multiplayer rematch의 host/ready 의무는 범위 긴장으로 보존한다. 임의로 한쪽을 삭제하지 않는다.
- 실제 shared API·소비자는 [AS-IS](step-1-as-is-audit.md), 강도·분류·E-* 근거의 의미는 [STEP 1 index](step-1-clause-succession-table.md)에서 필요한 절만 확인한다.

## Astra 집중 질문

1. 일반 개발 절차와 board/card/판본·구성물 조건을 어떻게 분리하며 강도·예외·부모 조건을 보존할까?
2. 장르 규칙과 구현 특성을 구분하면서 하나의 장르가 여러 모델을 사용하도록 표현했는가?
3. 7축의 단일/복수 선택·단계별 변경·호환 예시는 어떤 근거로 판단하는가?
4. host/ready/rematch의 범위 긴장을 미결정으로 보존했는가?
5. Capability·모델·렌더링을 혼동하지 않고 세 가지 빈도를 구분했는가?
6. 신규 장르 문서와 논리적 책임을 제안하되 후속 설계·Target Freeze를 선결정하지 않았는가?

## 선택 원문 trace

다음 49행은 B11 + P/R01-BOARD38이다. 전수 목록이 아니며 다른 조건부 의무는 필요할 때 STEP 1 표에서 추가 확인한다. source·절·부모 ID 및 해당 절 도입문을 함께 읽는다. 원문·강도·분류·조건·예외를 그대로 복사하며 여기서 기존 분류를 변경하지 않는다. 추가 7행은 host/ready/adapter 경계 입력이다.

## 보드게임 조건 분해 입력

## UI — `docs/game-platform-ui-rules.md` / 1. 목적

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-003 · L11–11 | 각 게임은 원본 게임의 규칙과 구성물뿐 아니라 고유한 색상, 심볼, 카드/보드 구조, 타이포그래피, 재질감, 분위기를 조사한 뒤 **해당 게임만의 독립적인 디지털 공간**으로 설계한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 1. 목적

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-006 · L16–16 | - GAME-LOCAL: 색상, 배경, 심볼, 카드/보드/칩 표현, 게임별 레이아웃, 모션, 사운드와 presentation | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 2. 신규 게임 개발 전 UI 조사

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-010 · L25–25 | - 공식 제품/퍼블리셔 페이지와 공식 규칙서 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 2. 신규 게임 개발 전 UI 조사

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-011 · L26–26 | - 공식 또는 신뢰 가능한 시각 자료가 존재하면 텍스트 설명만으로 Visual Identity를 확정하지 않고 실제 카드·보드·패키지·토큰 등 visual reference를 직접 확인한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 2. 신규 게임 개발 전 UI 조사

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-012 · L27–27 | - 박스, 카드, 보드, 칩, 토큰, 말, 주사위 등 실제 구성물 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 2. 신규 게임 개발 전 UI 조사

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-015 · L30–30 | - 숫자/정보의 배치, 카드 비율, 타이포그래피 분위기 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 2. 신규 게임 개발 전 UI 조사

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-017 · L32–32 | - 실제 테이블에서 구성물이 배치되는 방식 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 3. 원본 디자인과 자산 사용 > MUST

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-027 · L59–59 | - 출처와 확인 날짜 또는 판본을 가능한 범위에서 기록한다. | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 3. 원본 디자인과 자산 사용 > MUST

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-028 · L60–60 | - 여러 판본의 디자인이 다른 경우 목표 판본 또는 혼합하지 않을 기준을 정한다. | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 4. 독립 페이지 경험

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-034 · L71–71 | 이 원칙은 플레이 보드만이 아니라 다음 전체 흐름에 적용한다. | 표현:원칙 | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-061 · L109–109 | 게임 규칙 modal/page는 게임 밖의 일반 도움말 문서가 아니라 **처음 플레이하는 사용자가 실제 구성물과 행동 구조를 이해하는 game-local presentation**으로 설계한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > MUST

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-066 · L118–118 | - 카드, 주사위, 말, 칩, 보드, 트랙 등 게임 구성물을 표현할 때는 `UI_DESIGN.md`의 자산 사용 경계와 game-local component 언어를 재사용하거나 독자적으로 재구성한다. 사용 권리가 불명확한 공식 artwork를 규칙 설명이라는 이유로 직접 복제하지 않는다. | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > SHOULD

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-070 · L125–125 | - 실제 구성물, 공간 구조, 행동 순서나 계산을 시각화했을 때 처음 플레이하는 사용자의 이해가 크게 좋아지는 핵심 메커니즘은 **게임 구성물 언어를 활용한 짧은 시각적 예시**로 보여준다. | 절:SHOULD | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > SHOULD

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-072 · L127–127 | - 게임 플레이 화면에서 이미 익히게 되는 component를 규칙 안내에서도 재사용해 “설명 속 구성물”과 “실제 플레이 구성물”의 인지 차이를 줄인다. | 절:SHOULD | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 6. UI_DESIGN.md 관리 규칙 > MUST: baseline 보존

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-102 · L193–193 | - 카드/보드/칩/토큰 등 핵심 구성물 표현을 조정한 경우 | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 7. 실제 보드게임의 공간 구조 반영

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-170 · L313–313 | 웹 UI는 실제 게임에서 플레이어가 정보를 읽고 구성물을 다루는 방식을 조사해 가능한 범위에서 반영한다. | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 7. 실제 보드게임의 공간 구조 반영

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-172 · L317–317 | - 중앙 공용 영역 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 7. 실제 보드게임의 공간 구조 반영

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-173 · L318–318 | - 개인 플레이어 영역 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 7. 실제 보드게임의 공간 구조 반영

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-174 · L319–319 | - 카드/칩이 실제로 쌓이거나 겹치는 방식 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 7. 실제 보드게임의 공간 구조 반영

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-175 · L320–320 | - 공개 정보와 비공개 정보의 시각적 구분 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 7. 실제 보드게임의 공간 구조 반영

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-176 · L321–321 | - 보드에서 진행 방향과 상태를 읽는 방식 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 7. 실제 보드게임의 공간 구조 반영

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-177 · L323–323 | 원본 배치를 그대로 복제하는 것이 가독성을 해치면 웹 환경에 맞게 재구성할 수 있다. 최초 adaptation 계획은 `UI_DESIGN.md`에 두고, 개발 시작 후 실제 브라우저 검토로 그 배치를 수정했다면 최신 유효 결정과 이유를 `UI_DECISIONS.md`에 남긴다. | 표현:할 수 있다 | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 8. 모션과 행동 피드백

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-178 · L327–327 | 게임의 핵심 행동은 상태 값만 즉시 바뀌는 방식보다 실제 구성물이 움직인다는 감각을 우선 검토한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 8. 모션과 행동 피드백

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-180 · L331–331 | - 카드 공개 / 뒤집기 / 이동 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 8. 모션과 행동 피드백

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-181 · L332–332 | - 칩 또는 토큰 지불과 획득 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 8. 모션과 행동 피드백

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-182 · L333–333 | - 주사위 굴림 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 10. Responsive 기준

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-201 · L364–364 | - 많은 카드/토큰 등은 겹침, 축약, scroll area 등 게임에 맞는 표현을 설계한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 10. Responsive 기준

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-202 · L365–365 | - 핵심 숫자와 상태는 구성물이 겹쳐도 읽을 수 있는 위치를 우선한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI — `docs/game-platform-ui-rules.md` / 11. 구현 완료 검증

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-211 · L382–382 | - 대표 색상/심볼/구성물 표현이 설계와 일치하는가 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## GUIDE — `games/README.md` / 경계

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/README.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GUIDE-019 · L26–26 | - game-local 작업에서 상위 Game Platform 규칙과 충돌하는 새 필요를 발견하면 일반 하위 변경으로 바로 구현하지 않습니다. 플랫폼 전반에 필요한 변경으로 토의·합의되면 **ARCHITECTURE CHANGE**로 승격해 Development Rules와 Governance의 상·하위 정합화 및 전체 platform-native 게임 영향도 감사를 거칩니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D10, R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## SPEC-T — `games/GAME_SPEC_TEMPLATE.md` / Rules and Sources

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/GAME_SPEC_TEMPLATE.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-006 · L16–16 | - &lt;공식 규칙서 / 퍼블리셔 / 신뢰 가능한 규칙 출처&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## SPEC-T — `games/GAME_SPEC_TEMPLATE.md` / Domain Model

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/GAME_SPEC_TEMPLATE.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-017 · L36–36 | - &lt;보드/카드/주사위/말/플레이어 상태 등&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI-T — `games/UI_DESIGN_TEMPLATE.md` / Design Research

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-002 · L9–9 | - Target edition / visual baseline: &lt;대상 판본 또는 기준&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI-T — `games/UI_DESIGN_TEMPLATE.md` / Design Research

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-005 · L12–12 | - 조사한 구성물: &lt;카드/보드/칩/토큰/주사위/말 등&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI-T — `games/UI_DESIGN_TEMPLATE.md` / Gameplay Layout

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-042 · L64–64 | - 실제 보드게임의 공간 구조를 웹으로 옮길 때의 adaptation: | 템플릿 필드 | TEMPLATE_FIELD / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI-T — `games/UI_DESIGN_TEMPLATE.md` / Components

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-049 · L74–74 | - Rules visual examples: &lt;카드/주사위/말/칩/보드 등 실제 game component를 활용해 설명할 핵심 규칙과 accessibility fallback&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI-T — `games/UI_DESIGN_TEMPLATE.md` / Responsive Strategy

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-070 · L104–104 | - 많은 카드/토큰을 수용하는 방식: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI-T — `games/UI_DESIGN_TEMPLATE.md` / Validation Checklist

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-080 · L123–123 | - &#91; &#93; 조사 출처와 목표 판본이 기록되어 있다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## UI-T — `games/UI_DESIGN_TEMPLATE.md` / Validation Checklist

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md · 표: [step-1-clauses-design.md](step-1-clauses-design.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-087 · L130–130 | - &#91; &#93; 핵심 구성물과 action이 실제 게임의 플레이 감각을 전달한다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## AGENT — `AGENTS.md` / Game Platform 신규 게임 필수 규칙

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/AGENTS.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-AGENT-038 · L62–62 | - 공개된 기존 보드게임을 구현하는 경우 공식 규칙서나 신뢰 가능한 규칙 출처를 우선 확인하고 `GAME_SPEC.md`에 출처와 해석 결정을 남깁니다. UI는 공식/퍼블리셔 자료와 실제 구성물을 조사하고 `UI_DESIGN.md`에 디자인 출처, 목표 판본, Visual Identity, 저작권·라이선스 판단과 구현 계획을 기록합니다. 확인되지 않은 규칙이나 자산 사용 권리는 추측하지 않습니다. | 서술형(수치화 안 함) | RULE / B | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 3A. 신규 게임 초기 세팅과 설계 문서

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-036 · L66–66 | 2. 공식/퍼블리셔 자료와 실제 구성물을 기준으로 색상, 심볼, 카드/보드/칩 구조, 레이아웃, 타이포그래피, 분위기와 자산 사용 가능 범위를 조사한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 3A. 신규 게임 초기 세팅과 설계 문서

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-044 · L75–75 | 공개된 기존 보드게임을 웹게임으로 구현하는 경우 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 문서를 우선 확인한다. `GAME_SPEC.md`에는 사용한 출처와 구현상 해석 결정을 남긴다. 규칙 원문을 장문 복제하지 않고 구현에 필요한 사실과 결정만 요약한다. | 서술형(수치화 안 함) | RULE / B | E-DOC | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: UI_DESIGN의 역할

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-049 · L101–101 | 최소한 디자인 조사 출처, 자산 사용 경계, 목표 판본, Visual Identity, page/lobby/gameplay/result/rematch 방향, 핵심 motion, responsive 전략, 최초 구현 Phase/순서와 validation 기준을 runtime 구현 전에 확정한다. | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: 게임별 네 문서의 권위와 충돌 해결

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-072 · L143–143 | - `UI_DESIGN.md`: runtime 구현 전 전수 조사·분석으로 수립한 최초 Visual Identity, page/layout, 구성물 표현, motion, responsive, Phase 계획의 baseline | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 4. 플랫폼과 게임 규칙의 경계 > MUST: 게임 규칙은 GAME-LOCAL에 둔다

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-159 · L305–305 | - 보드, 카드, 주사위 등 도메인 모델 | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 4. 플랫폼과 게임 규칙의 경계 > MUST: 게임 규칙은 GAME-LOCAL에 둔다

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-162 · L308–308 | - 게임 테마와 Visual Identity, 독립 페이지 레이아웃, 카드/보드/칩 등 구성물 표현 | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 4. 플랫폼과 게임 규칙의 경계 > MUST: 출시 후 플랫폼 피드백 루프를 수행한다

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-178 · L335–335 | 2. **GAME-LOCAL 유지** — 규칙, 상태 머신, 플레이 중 이탈 정책의 게임별 의미, 보드/주사위/연출처럼 해당 게임의 도메인 책임 | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 10A. 게임 규칙 안내와 게임 종료 > MUST: 게임 규칙 안내

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-288 · L568–568 | - 공개된 기존 보드게임은 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 출처를 먼저 확인하고 구현 규칙과 사용자 안내가 같은 해석을 사용해야 한다. | 절:MUST | RULE / B | E-DOC | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 15. 신규 게임 구현 순서

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-386 · L761–788 | ```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>``` | 표현:검증 | REQUIRED_SHAPE / P | E-DOC | D01, D06, D09, R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## host/ready/adapter 경계 입력

## DEV — `docs/game-platform-development-rules.md` / 6. Room / Session 계약

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-229 · L443–443 | `setReady`와 `startGame`은 현재 shared 구현에서 검증된 lifecycle이지만 **모든 미래 게임의 보편 규칙으로 간주하지 않는다.** 전원 ready가 없거나, 자동 시작하거나, host가 없거나, 다른 방식으로 세션이 시작되는 게임에 억지로 빈 메서드나 가짜 의미를 추가하지 않는다. | 표현:검증 | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 6. Room / Session 계약

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-230 · L445–445 | 새 게임의 자연스러운 lifecycle이 현재 adapter와 맞지 않으면: | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

## DEV — `docs/game-platform-development-rules.md` / 6. Room / Session 계약

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-231 · L447–447 | 1. game-local workaround로 shared 계약을 우회하지 않는다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 6. Room / Session 계약

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-232 · L448–448 | 2. 현재 adapter를 그대로 강제하기 위해 의미 없는 method를 구현하지 않는다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 6. Room / Session 계약

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-233 · L449–449 | 3. 실제 반복 가능한 플랫폼 책임인지 검토한 뒤 shared 계약을 가장 작은 범위로 확장하거나 분리한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 6. Room / Session 계약

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-234 · L450–450 | 4. 계약 변경 시 관련 contract test와 이 문서를 함께 갱신한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## DEV — `docs/game-platform-development-rules.md` / 10B. 멀티플레이 재대결 lifecycle > MUST

원문: https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md · 표: [step-1-clauses-platform.md](step-1-clauses-platform.md)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-311 · L614–614 | 초기 게임 시작에 ready/host 개념이 없는 특수한 게임이라도 재대결에서는 사용자가 다시 플레이하겠다는 의사를 명시하고 방장이 시작 가능한 준비 화면으로 전환하는 청파 같이 공통 UX를 제공한다. 게임 규칙상 방장 자체가 성립하지 않는 구조를 도입하려면 별도 플랫폼 규칙 변경으로 다룬다. | 절:MUST | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
