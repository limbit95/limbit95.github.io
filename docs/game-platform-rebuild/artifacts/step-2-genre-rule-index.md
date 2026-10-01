# STEP 2 — 장르 규칙 인덱스 초안

- 실행 계획: 루트 개정 **1.3 / STEP 2**.
- 승인 integration / STEP 2 분기: `2636d47d4a47e09c9ba4729ee5a16bc1cc7216ad`. 반영 작업 시작 HEAD: `792d73befe676cfdc8f8c1f7b7a58a984841cc01`.
- 직접 입력: 이 채팅의 “allocation의 3번 작업을 완료했어”로 시작하는 Astra STEP 2 판단 결과 전체(2026-10-01), 특히 §3~7. 아래는 그 결과를 문서로 반영한 **검토 초안**이며 사용자 채택·Target Freeze·지원 구현 완료가 아니다.
- 입력 순위: 실행 계획 → 유효한 기존 규칙·STEP 1 계승 근거 → Astra 검토 초안. [Sol 5.6 조사](step-2-auxiliary-research-memo.md)는 참고 자료다. 조사 주장으로 기존 의무를 완화하지 않는다.
- 논리적 문서 소유자/선택 항목은 초안이다. 물리 경로·Core API·Runtime Model 계약·공통 코드·실제 장르 규칙 문서를 이번에 확정하거나 구현하지 않는다.

## 분류 원칙

장르 규칙은 조사·보존해야 할 플레이 규칙을, 구현 선택표는 실행 특성을 다룬다. 한 게임에 여러 규칙 묶음과 여러 실행 특성이 적용될 수 있다. 묶음 이름은 문서 분류용 초안이며 고정 enum이 아니다. 장르별 별도 플랫폼/Core를 만들지 않는다.

| 묶음 | 적용 조건 | 규칙 묶음의 내용 | 논리적 문서 소유자 / 신규 문서 필요성 / 미결정 |
|---|---|---|---|
| 공통 개발 절차 | 신규 게임 개발 | 조사·제품 범위·출처/해석·디자인 준비·검증·진행 기록 | 플랫폼 공통 개발 규칙. DEV-035~043 흐름 계승; 책임 절은 STEP 6/7 |
| 보드·카드 | 보드/카드/구성물과 해당 게임 규칙 사용 | 판본·구성물·공개/비공개 정보·행동/정산·공간 adaptation | 보드게임 장르 규칙; 기존 상세 의무 계승. 실제 문서 재구성은 STEP 7A2 |
| 전략·자원·명령 | 자원 배분·생산·명령·전략적 상태 변화가 핵심 | 명령 의미·자원/생산 조건·정보 공개·종료/승리 | 신규 장르 규칙 묶음 후보. RTS 이름만으로 동기화 모델을 강제하지 않음; 신규 상세 문서는 후속 작성 |
| 반응·액션 | 입력 시점/순서/반응이 게임 규칙에 영향 | 행동 성립·판정 시점·실패/회복·결과 | 신규 장르 규칙 후보. PvP/협동·권위는 별도 선택; 판정법 미정 |
| 리듬·타이밍 | 기준 시간과 입력 차이가 판정에 영향 | timeline·판정 구간·지연 보정의 의미·점수/실패 | 신규 장르 규칙 후보. 네트워크 모델과 독립; 구체 판정법 미정 |
| 레이싱 | 코스·진행·완주·순위가 핵심 | 체크포인트·유효 진행·완주·동률 | 신규 장르 규칙 후보. 물리 구현/네트워크 모델 미정 |
| 플랫포머·이동 도전 | 이동·도달·실패·재시도가 핵심 | 행동 의미·성공/실패·재시작/체크포인트 | 신규 장르 규칙 후보. 레이싱과 무조건 통합하지 않음 |
| 기타·복합 장르 | 기존 묶음만으로 충분하지 않음 | 적용 묶음·추가 조사·충돌/미결정 | 개별 GAME_SPEC에서 필요성 식별 → 신규 장르 규칙 작성 입력. 묶음/지원 범위를 자동 확정하지 않음 |

신규 묶음의 내용은 **조사할 항목**이며 새로운 MUST나 특정 구현의 채택이 아니다. 현재 기존 규칙의 적용 범위는 이번 분류로 바뀌지 않는다.

## 장르와 교차하는 특성

| 특성 | 기록 위치 | 분류 경계 |
|---|---|---|
| 협동 / PvP / 비대칭 | 참여·가시성 축 + 게임별 규칙 | 독립 장르/모델로 자동 고정하지 않음 |
| 실시간 / 장기 비동기 | flow·시간·세션/지속성 | 장르명으로 결정하지 않음 |
| 2D / 3D / 물리 | 공간·렌더링·입력/물리 | 3D=물리=실시간 multiplayer 등치 금지 |
| 관전 / 중도 참가 | 참여·가시성 | 정보와 행동 권한 분리 |
| Invite / Presence | 별도 Capability 목록 | 선택 여부와 실제 계약·지원 증거 분리 |

실행 모델 연결은 [구현 선택표](step-2-implementation-selection.md) §선택과 실행 모델 연결, 기록 형식은 [GAME_SPEC 근거](step-2-game-spec-selection-rationale.md)를 따른다.

## 기존 의무 보존과 ID별 제안

아래는 brief의 B11+P/R01-BOARD38 **49개 선택 조항**의 분류 제안이며 전수 계승표를 대체하지 않는다. 기존 3,232단위/2,104규칙·필드/K1,198/L906, 기존 강도·조건·예외는 그대로다. 나머지 의무는 STEP 1 계승표와 후속 STEP 5C/6/7에서 계속 추적한다.

모든 행의 원문·조건·예외·현 책임/소비 E-*·부모 ID는 연결된 STEP 1 행 전체와 source 절의 도입문을 함께 읽는다. 아래 조건 설명은 적용 범위를 완결적으로 재작성한 규칙이 아니다. 새 책임 절은 **STEP 6에서 검토**, 실제 계승은 **STEP 7**에서 원래 강도·조건·예외·복수 목적지·검증 근거로 닫는다. 현재 상세 규칙은 그때까지 유효하며 임시 분류만으로 폐기·완화하지 않는다.

분류 제안 코드:

- G: 일반 의무와 board/card 예시·조건을 구분해 연결하는 초안. 공통 의무를 제거하지 않음.
- B: 보드게임/실제 구성물 조건부 계승 초안. 원문에 포함된 일반 의무는 함께 보존.
- D: 게임 도메인·presentation을 GAME-LOCAL로 두는 책임 경계 유지. 보드에 한정하지 않음.
- A: 플랫폼 변경관리 의무 연결. board-only로 축소 금지.
- X: 복합 개발 흐름/도입문. 한 장르로 일괄 이동 금지, 세부 조건·부모 연결 보존.

| ID · source 줄 · 부모 | source / 절 | 기존 강도 / 분류 / 증거 | 제안 | 적용 조건·보존 확인 / 후속 |
|---|---|---|---|---|
| [LEGACY-UI-003 · L11–11](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 1. 목적 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-006 · L16–16](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 1. 목적 | 서술형(수치화 안 함) / RULE / P / E-UI | D | 게임 고유 도메인/presentation game-local 경계 보존; 예시는 타 장르를 제한하지 않음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-010 · L25–25](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 2. 신규 게임 개발 전 UI 조사 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-011 · L26–26](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 2. 신규 게임 개발 전 UI 조사 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-012 · L27–27](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 2. 신규 게임 개발 전 UI 조사 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-015 · L30–30](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 2. 신규 게임 개발 전 UI 조사 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-017 · L32–32](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 2. 신규 게임 개발 전 UI 조사 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-027 · L59–59](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 3. 원본 디자인과 자산 사용 > MUST | 절:MUST / RULE / P / E-UI | G | 출처·확인 날짜 또는 판본을 가능한 범위에서 기록하는 조건 보존; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-028 · L60–60](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 3. 원본 디자인과 자산 사용 > MUST | 절:MUST / RULE / P / E-UI | G | 복수 판본 차이 발생 조건에서 목표 판본/혼합하지 않을 기준 보존; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-034 · L71–71](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 4. 독립 페이지 경험 | 표현:원칙 / RULE / P / E-UI | X | 전체 흐름/부모 범위 보존; 한 장르로 통째 이동하지 않음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-061 · L109–109](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-066 · L118–118](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > MUST | 절:MUST / RULE / P / E-UI | G | 구성물 표현 조건 및 사용 권리 불명확 artwork 복제 금지를 일반 자산 경계와 함께 보존; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-070 · L125–125](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > SHOULD | 절:SHOULD / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-072 · L127–127](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > SHOULD | 절:SHOULD / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-102 · L193–193](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 6. UI_DESIGN.md 관리 규칙 > MUST: baseline 보존 | 절:MUST / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-170 · L313–313](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 7. 실제 보드게임의 공간 구조 반영 | 서술형(수치화 안 함) / RULE / B / E-UI | B | 보드/실제 구성물 적용 조건 보존; §도입문·예외와 일반 의무를 함께 확인; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-172 · L317–317](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 7. 실제 보드게임의 공간 구조 반영 | 서술형(수치화 안 함) / RULE / B / E-UI | B | 보드/실제 구성물 적용 조건 보존; §도입문·예외와 일반 의무를 함께 확인; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-173 · L318–318](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 7. 실제 보드게임의 공간 구조 반영 | 서술형(수치화 안 함) / RULE / B / E-UI | B | 보드/실제 구성물 적용 조건 보존; §도입문·예외와 일반 의무를 함께 확인; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-174 · L319–319](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 7. 실제 보드게임의 공간 구조 반영 | 서술형(수치화 안 함) / RULE / B / E-UI | B | 보드/실제 구성물 적용 조건 보존; §도입문·예외와 일반 의무를 함께 확인; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-175 · L320–320](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 7. 실제 보드게임의 공간 구조 반영 | 서술형(수치화 안 함) / RULE / B / E-UI | B | 보드/실제 구성물 적용 조건 보존; §도입문·예외와 일반 의무를 함께 확인; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-176 · L321–321](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 7. 실제 보드게임의 공간 구조 반영 | 서술형(수치화 안 함) / RULE / B / E-UI | B | 보드/실제 구성물 적용 조건 보존; §도입문·예외와 일반 의무를 함께 확인; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-177 · L323–323](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 7. 실제 보드게임의 공간 구조 반영 | 표현:할 수 있다 / RULE / B / E-UI | B | 가독성 저해 시 재구성 허용과 UI_DESIGN baseline / 최신 유효 UI_DECISIONS 이유·기록을 함께 보존; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-178 · L327–327](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 8. 모션과 행동 피드백 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-180 · L331–331](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 8. 모션과 행동 피드백 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-181 · L332–332](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 8. 모션과 행동 피드백 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-182 · L333–333](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 8. 모션과 행동 피드백 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-201 · L364–364](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 10. Responsive 기준 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-202 · L365–365](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 10. Responsive 기준 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-211 · L382–382](step-1-clauses-design.md) | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md) / 11. 구현 완료 검증 | 서술형(수치화 안 함) / RULE / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-GUIDE-019 · L26–26](step-1-clauses-design.md) | [games/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/README.md) / 경계 | 서술형(수치화 안 함) / RULE / P / E-DOC | A | 상위 규칙 충돌 시 Architecture Change·합의·영향 감사 의무 보존; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-SPEC-T-006 · L16–16](step-1-clauses-design.md) | [games/GAME_SPEC_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/GAME_SPEC_TEMPLATE.md) / Rules and Sources | 템플릿 필드 / TEMPLATE_FIELD / P / E-DOC | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-SPEC-T-017 · L36–36](step-1-clauses-design.md) | [games/GAME_SPEC_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/GAME_SPEC_TEMPLATE.md) / Domain Model | 템플릿 필드 / TEMPLATE_FIELD / P / E-DOC | D | 게임 고유 도메인/presentation game-local 경계 보존; 예시는 타 장르를 제한하지 않음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-T-002 · L9–9](step-1-clauses-design.md) | [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md) / Design Research | 템플릿 필드 / TEMPLATE_FIELD / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-T-005 · L12–12](step-1-clauses-design.md) | [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md) / Design Research | 템플릿 필드 / TEMPLATE_FIELD / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-T-042 · L64–64](step-1-clauses-design.md) | [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md) / Gameplay Layout | 템플릿 필드 / TEMPLATE_FIELD / B / E-UI | B | 보드/실제 구성물 적용 조건 보존; §도입문·예외와 일반 의무를 함께 확인; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-T-049 · L74–74](step-1-clauses-design.md) | [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md) / Components | 템플릿 필드 / TEMPLATE_FIELD / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-T-070 · L104–104](step-1-clauses-design.md) | [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md) / Responsive Strategy | 템플릿 필드 / TEMPLATE_FIELD / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-T-080 · L123–123](step-1-clauses-design.md) | [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md) / Validation Checklist | 템플릿 필드 / TEMPLATE_FIELD / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-UI-T-087 · L130–130](step-1-clauses-design.md) | [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md) / Validation Checklist | 템플릿 필드 / TEMPLATE_FIELD / P / E-UI | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-AGENT-038 · L62–62](step-1-clauses-platform.md) | [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/AGENTS.md) / Game Platform 신규 게임 필수 규칙 | 서술형(수치화 안 함) / RULE / B / E-GOV | B | 보드/실제 구성물 적용 조건 보존; §도입문·예외와 일반 의무를 함께 확인; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-DEV-036 · L66–66](step-1-clauses-platform.md) | [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md) / 3A. 신규 게임 초기 세팅과 설계 문서 | 서술형(수치화 안 함) / RULE / P / E-DOC | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-DEV-044 · L75–75](step-1-clauses-platform.md) | [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md) / 3A. 신규 게임 초기 세팅과 설계 문서 | 서술형(수치화 안 함) / RULE / B / E-DOC | B | 보드/실제 구성물 적용 조건 보존; §도입문·예외와 일반 의무를 함께 확인; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-DEV-049 · L101–101](step-1-clauses-platform.md) | [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md) / 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: UI_DESIGN의 역할 | 절:MUST / RULE / P / E-DOC | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-DEV-072 · L143–143](step-1-clauses-platform.md) | [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md) / 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: 게임별 네 문서의 권위와 충돌 해결 | 절:MUST / RULE / P / E-DOC | G | 일반 조사·디자인·검증/기록 요구와 board 예시 조건 분리 검토; 일반 의무 축소 없음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-DEV-159 · L305–305](step-1-clauses-platform.md) | [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md) / 4. 플랫폼과 게임 규칙의 경계 > MUST: 게임 규칙은 GAME-LOCAL에 둔다 | 절:MUST / RULE / P / E-DOC | D | 게임 고유 도메인/presentation game-local 경계 보존; 예시는 타 장르를 제한하지 않음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-DEV-162 · L308–308](step-1-clauses-platform.md) | [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md) / 4. 플랫폼과 게임 규칙의 경계 > MUST: 게임 규칙은 GAME-LOCAL에 둔다 | 절:MUST / RULE / P / E-DOC | D | 게임 고유 도메인/presentation game-local 경계 보존; 예시는 타 장르를 제한하지 않음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-DEV-178 · L335–335](step-1-clauses-platform.md) | [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md) / 4. 플랫폼과 게임 규칙의 경계 > MUST: 출시 후 플랫폼 피드백 루프를 수행한다 | 절:MUST / RULE / P / E-DOC | D | 게임 고유 도메인/presentation game-local 경계 보존; 예시는 타 장르를 제한하지 않음; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-DEV-288 · L568–568](step-1-clauses-platform.md) | [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md) / 10A. 게임 규칙 안내와 게임 종료 > MUST: 게임 규칙 안내 | 절:MUST / RULE / B / E-DOC | B | 보드/실제 구성물 적용 조건 보존; §도입문·예외와 일반 의무를 함께 확인; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |
| [LEGACY-DEV-386 · L761–788](step-1-clauses-platform.md) | [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md) / 15. 신규 게임 구현 순서 | 표현:검증 / REQUIRED_SHAPE / P / E-DOC | X | 26항 개발 순서·online/stateful/room 등 조건을 개별 추적; board 일괄 이동 금지; 5C/6→7A1/7A2, 경계 A/D는 7B도 검토 |

## host/ready/rematch 경계와 미결정

LEGACY-DEV-229~234의 host/ready 비보편성·fake method 금지·계약 우회 금지·최소 확장 검토·문서/contract test 갱신 의무를 보존한다. LEGACY-DEV-311 및 현행 §10B는 multiplayer rematch에서 명시적 재참여 의사/host 기반 준비 흐름을 요구한다. 초기 시작과 재대결의 범위를 동일시하지 않는다.

hostless라는 표현만으로 현재 규칙 적합성을 일괄 판정하지 않는다. 현행 §10B / LEGACY-DEV-311의 멀티플레이 재대결 적용 범위에서 다음 조건을 구분한다.

- **초기 시작만 hostless이고 재대결은 기존 의무를 충족:** 초기 hostless라는 이유만으로 규칙 변경 대상으로 단정하지 않는다. 다른 의무 충족 여부는 별도로 확인한다.
- **재대결에서도 게임 규칙상 host가 성립하지 않음:** 별도 플랫폼 규칙 변경 검토 대상으로 둔다. 변경 승인을 뜻하지 않는다.
- **재대결 정책 미정:** 현재 규칙 적합성 미확인으로 둔다.

위 구분은 기존 adapter 호환이나 구현 지원 완료를 뜻하지 않는다. 현재 계약 적합성과 실제 구현 증거를 독립적으로 확인하고 no-op adapter나 game-local workaround로 우회하지 않는다. 규칙·공통 계약 변경이 필요한 경우 STEP 4B/5C/6에서 Architecture Change와 범위를 검토하고 STEP 7A2에서 기존 의무의 새 책임 위치를 확인한다.

## 미결정과 리스크

| ID | 문제 / 영향 | 처리·후속 |
|---|---|---|
| S2-R01 | STEP 1 임시 분류를 최종 소유자로 보면 공통 의무 축소 | 위 49개 조건별 연결은 제안. STEP 5C/6/7에서 전수 계승 확인 |
| S2-R02 | relay/권위/rollback을 단일 enum으로 혼합 | 구현 선택표의 ⑤ 하위 항목 분리; 계약은 STEP 4B/6 |
| S2-R03 | 초기 hostless·재대결 hostless·정책 미정을 혼동해 규칙 변경 필요 또는 rematch 준수를 단정 | 위 세 조건을 구분; 다른 의무·계약·구현 증거 별도 확인. 변경 필요 시 STEP 4B/5C/6 |
| S2-R04 | 선택표 항목을 지원 구현/공통 계약 채택으로 오인 | 규칙·계약·구현 증거를 별도로 기록 |

기존 F01~F03과 IMPL 후보는 [STEP 1 AS-IS](step-1-as-is-audit.md)의 상태 그대로 후속 입력이다. 이번 문서 리스크와 별도이며 기존 게임 유지보수/migration을 이 단계에 넣지 않는다.
