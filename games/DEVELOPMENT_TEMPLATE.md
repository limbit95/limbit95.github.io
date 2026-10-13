# <Game Title> Development

> 이 문서는 기능 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다. 긴 changelog 대신 현재 기능 상태와 다음 행동을 유지합니다.
>
> 게임 규칙과 기능 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다. UI는 `UI_DESIGN.md`의 소스 개발 전 baseline과 `UI_DECISIONS.md`의 최신 non-superseded override를 함께 적용합니다. 이 문서에는 UI 세부 변경사를 중복 기록하지 않고 기능 구현·검증 상태와 release 관점의 상위 UI 트랙 상태만 참조합니다.
> 공통 UI 조사/설계 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.

## Current Status

- Phase: <phase>
- Status: IN_PROGRESS
- Active branch: <branch>
- Last checkpoint: <YYYY-MM-DD / commit if available>

## Completed

- 기능: <GAME_SPEC.md 기준 실제로 완료된 기능/규칙/DB 작업>
- Design track reference: <필요한 경우 UI_DECISIONS.md의 현재 UI 단계/결정 항목 링크 또는 요약>

## Current Work

- 기능: <현재 진행 중이며 아직 완료되지 않은 기능 작업>
- Design track reference: <UI 작업이 병행 중이면 UI_DECISIONS.md의 현재 항목을 참조>

## Next Work

> 설계 계획을 복제하지 않고 현재 작업에서 바로 수행할 구체적인 행동만 기록합니다.

- <다음 채팅/작업자가 가장 먼저 수행할 기능/DB/플랫폼 작업>
- UI 작업 자체의 다음 행동은 `UI_DECISIONS.md`의 현재 디자인 트랙에 기록하고 여기에는 중복 복제하지 않습니다.

## Decisions

- <확정된 게임 규칙/기능 아키텍처 결정>
- UI/presentation의 개발 시작 후 결정은 `UI_DECISIONS.md`에 기록하며 `UI_DESIGN.md` baseline을 현재 화면에 맞춰 재작성하지 않습니다.

## Validation

- Functional / contract: <실행 완료 기능·규칙·DB·contract 검증>
- Design validation reference: <release 판단에 필요한 경우 UI_DECISIONS.md의 브라우저/반응형/animation 검증 기록 참조>
- Pending: <아직 실행하지 못한 기능 검증>

## Known Issues / Deferred

- <기능 blocker / known issue / 보류 사항, 없으면 없음>
- UI 설계와 실제 구현의 차이, 미확정 asset/license, 후속 visual polish는 `UI_DECISIONS.md`에서 추적합니다.

## Release closeout 안내

게임을 production에 공개해 `Status: RELEASED`로 전환할 때는 이 안내 섹션을 실제 날짜가 있는 다음 형식의 release 기록으로 교체합니다.

```text
## Release — YYYY-MM-DD

- production activation / migration 요약
- 현재 Registry capability
- 핵심 검증 결과
- 유지보수 baseline 및 남은 관찰 항목
```

`RELEASED` 상태에서는 `Active branch: main`을 사용하고, 과거 feature branch를 현재 기준으로 남기지 않습니다.

## Applied Contract / Scope — 신규 vNext 선택 시

상위 `docs/game-platform-architecture.md`, 공통 `docs/game-platform-common-rules.md`, 수명 `docs/game-platform-lifetime-contract.md`, 선택 모델 `docs/game-platform-model-contracts.md`, 기능 `docs/game-platform-capability-contracts.md`를 따른다. 기존 consumer는 원래 계약/네 문서 baseline과 유효 override를 유지한다.

- Platform contract: 실제 신규 vNext 선택이면 GAME_SPEC에 `GP-COMMON/1` 한 값을 기록; 미선택과 legacy 범위를 구분.
- Selected model contract: 실제 선택 계약ID/revision·7축·선택이유. 미정이면 UNSELECTED와 구현 전 닫을 질문을 기록.
- Genre / capability contracts: 적용 ID/revision과 현재 유효 원문/승인 내용 경로.
- Not applicable / unsupported / undecided: 실제 이유·조건·검증/후속 의무. 없는 Room/host/DOM/winner/score/XP를 생성하지 않음.
- 기능현재/진행/초기디자인baseline/후속유효디자인결정 책임은 각각 GAME_SPEC/DEVELOPMENT/UI_DESIGN/UI_DECISIONS.
- 실제 multiplayer 재대결·온라인 안전11을 N/A/no-op/local로 지우지 않음. hostless 재대결 예외는 미승인.
- 정확히 네 문서의 bootstrap은 미등록 가능; runtime 추가 순간 Registry/선택모델 검사 적용. 미지원 oracle를 기존 DB 검사 제거로 허용하지 않음.

이 추가 질문을 기존 game-local 네 문서의 새baseline으로 강제 적용하지 않는다. BO 실제본문은7A2의 하위 owner에 연결하고 RT 실제본문은7A3의 하위 owner로 연결하고 AR4의 고정 승인 계승 경로를 유지한다.

## Board Experience — 신규 vNext 보드 적용 시

상위 `docs/game-platform-architecture.md` → 보드 `docs/game-platform-board-rules.md` BO1~4 → 실제 네 문서/선택 모델/검증으로 연결한다. GAME_SPEC/BO 적용 항목의 구현 진행·검증 증거·다음 행동만 기록한다. 문서/Guard·계약·실제 게임/DB/두 client/수동 플레이 검증을 구분하며 미실행은 NOT_RUN/UNKNOWN으로 남긴다. 설계/VI baseline이나 TODO를 독립 복제하지 않는다.

이 질문은 실제 보드 경험에만 적용하며 기존 game-local 네 문서의 재작성/이관이나 모든 게임의 Room/host/DOM/winner/score/XP 강제가 아니다. multiplayer 재대결·온라인 안전 의무를 N/A/no-op/local로 제거하지 않는다. 장르 계약 존재를 runtime 지원/행동 PASS로 표시하지 않는다.

## Realtime Cooperative / Spatial Experience — 해당 신규 vNext 경험 적용 시

상위 docs/game-platform-architecture.md → 장르 docs/game-platform-realtime-coop-rules.md RT1~6/R01~13 → 실제네문서/모델/검증으로연결한다. 선택된R01~13/모델/기능의실제구현진행·문서/계약/실행증거·미실행사유/다음행동을기록한다. 장르규칙/디자인결정을별도확정하지않는다.

없는Room/host/winner/score/XP를생성하지않고 실제multiplayer재대결/온라인안전/수명은 MO/LI의승인조건을따른다. cancel전달/시간공백·지원환경/표본은후속선택·검증이며임의기술/수치를동결하지않는다. 기존game-local네문서이관과행동지원PASS선언은아니다.
