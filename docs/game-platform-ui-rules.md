# Game Platform UI Design Rules

> **문서 분류:** CURRENT
>
> 현재 Game Platform의 최상위 실행 규칙은 `docs/game-platform-development-rules.md`다. 이 문서는 신규 platform-native 게임의 UI/UX 조사, 설계, 구현 및 검증에 추가로 적용하는 필수 규칙이다.

## 1. 목적

청파 같이의 신규 게임은 동일한 플랫폼 기능을 공유하더라도 시각적으로 하나의 공통 템플릿에 끼워 넣지 않는다.

각 게임은 원본 게임의 규칙과 구성물뿐 아니라 고유한 색상, 심볼, 카드/보드 구조, 타이포그래피, 재질감, 분위기를 조사한 뒤 **해당 게임만의 독립적인 디지털 공간**으로 설계한다.

공통 플랫폼 UX와 게임별 Visual Identity의 책임은 분리한다.

- SHARED: 접근 권한, Room/Lobby, 연결 상태, 플레이어 identity, 준비/시작 lifecycle, 안전한 종료 등 반복 가능한 플랫폼 책임
- GAME-LOCAL: 색상, 배경, 심볼, 카드/보드/칩 표현, 게임별 레이아웃, 모션, 사운드와 presentation
- 공통 Shell을 사용하더라도 게임 고유 Visual Identity를 획일화하지 않는다.

## 2. 신규 게임 개발 전 UI 조사

사용자가 `<게임명> 개발하자`, `신규 게임 개발 시작하자`처럼 새 게임 개발을 요청하면 UI 조사를 별도 요청으로 기다리지 않는다.

runtime 구현 전에 게임 규칙 조사와 함께 최소 다음을 조사한다.

- 공식 제품/퍼블리셔 페이지와 공식 규칙서
- 공식 또는 신뢰 가능한 시각 자료가 존재하면 텍스트 설명만으로 Visual Identity를 확정하지 않고 실제 카드·보드·패키지·토큰 등 visual reference를 직접 확인한다.
- 박스, 카드, 보드, 칩, 토큰, 말, 주사위 등 실제 구성물
- 대표 색상과 보조/강조 색상
- 로고가 아닌 게임을 연상시키는 기능적 심볼과 형태
- 숫자/정보의 배치, 카드 비율, 타이포그래피 분위기
- 패턴, 테이블/재질감, 배경과 장식 요소
- 실제 테이블에서 구성물이 배치되는 방식
- 필요한 경우 공식 또는 신뢰 가능한 디지털 구현과 실제 플레이 영상의 interaction/presentation
- 사용하려는 이미지, 로고, 일러스트, 폰트, 사운드 등 자산의 저작권·상표·라이선스·사용 조건

조사 결과는 구현 전에 `games/<game-id>/UI_DESIGN.md`에 기록한다.

조사 기록은 가능한 범위에서 **출처 → 관찰한 디자인 요소 → 구현 결정**이 추적되게 남긴다.

예:

```text
Source: 공식 제품 페이지 / 규칙서 / 실제 구성물 사진
Observed: 카드 모서리 숫자 위치, 주 색상, 칩 형태, 테이블 배치
Decision: 직접 사용 / 독자 재구성 / 사용하지 않음
Reason: 라이선스, 가독성, responsive adaptation 등
```

단순 링크 모음만 남기지 않고 그 자료가 실제 설계 결정에 어떤 근거가 됐는지 기록한다.

MUST NOT: 조사 없이 청파 같이 일반 페이지의 색상과 컴포넌트를 그대로 복사해 게임의 기본 디자인으로 확정하지 않는다.

## 3. 원본 디자인과 자산 사용

원본 게임의 시각적 정체성을 적극적으로 조사하되 보호받는 자산을 무단 복제하지 않는다.

### MUST

- 출처와 확인 날짜 또는 판본을 가능한 범위에서 기록한다.
- 여러 판본의 디자인이 다른 경우 목표 판본 또는 혼합하지 않을 기준을 정한다.
- 직접 사용할 자산은 사용 근거와 라이선스/허가 상태를 기록한다.
- 사용 권리가 불명확한 로고, 일러스트, 사진, 폰트, 음원은 그대로 포함하지 않는다.
- 직접 복제가 어려운 경우 대표 색상, 정보 계층, 기능적 형태, 공간 배치, 분위기를 분석해 독자적인 게임-local 표현으로 재구성한다.

목표는 **원본 게임의 정체성과 플레이 감각을 살리되 보호되는 자산을 무단 복제하지 않는 것**이다.

## 4. 독립 페이지 경험

게임 목록에서 특정 게임으로 진입한 뒤에는 청파 같이 일반 서비스의 하위 화면이 아니라 **해당 게임의 독립적인 공간에 들어온 느낌**을 제공한다.

이 원칙은 플레이 보드만이 아니라 다음 전체 흐름에 적용한다.

- entry / landing
- 방 생성 / 참가
- lobby / ready
- 규칙 안내
- gameplay
- modal / status / error presentation
- result
- rematch 준비
- loading / reconnect presentation

게임-local 디자인은 필요하면 일반 사이트와 다른 배경, 레이아웃, 버튼, 패널, 폰트, 심볼, 장식, 모션을 사용할 수 있다.

다만 사이트 계정 identity, 접근 권한, Room/Lobby 계약, authoritative state 같은 플랫폼 책임까지 시각적 독립성을 이유로 다시 구현하지 않는다.

## 5. Visual Identity를 구현 전에 정의

조사가 끝났다고 즉시 UI 코드를 작성하지 않는다. `UI_DESIGN.md`에 최소 다음을 먼저 정의한다.

- Primary / Secondary / Accent / Background color
- 전체 분위기와 시각적 키워드
- 심볼/패턴/재질감 방향
- 타이포그래피 방향
- page identity와 일반 사이트에서 게임 공간으로 전환되는 방식
- lobby/setup 구성
- gameplay 핵심 레이아웃
- 주요 game component 표현
- 핵심 motion/interaction
- result/rematch presentation
- desktop/mobile responsive 전략
- 필요한 asset과 사용 권리 상태
- 구현 순서와 validation 기준

초기 구현에서 모든 polish를 완성할 필요는 없지만, 방향이 정해지지 않은 상태에서 generic UI를 먼저 굳히지 않는다.

## 6. UI_DESIGN.md 관리 규칙

모든 platform-native 게임은 다음 문서를 가진다.

```text
games/<game-id>/UI_DESIGN.md
```

이 문서는 **runtime/UI 소스 개발을 시작하기 전에 게임 디자인을 전수 조사·분석해 수립하는 game-local 초기 UI/presentation baseline**이다.

`GAME_SPEC.md`가 게임 규칙과 기능 구조를 정의하고, `DEVELOPMENT.md`가 기능 개발 진행을 추적한다. 디자인은 `UI_DESIGN.md`가 최초 조사·설계와 Phase 계획의 출발점을 보존하고, `UI_DECISIONS.md`가 개발 시작 후 발생한 사용자 피드백·실제 화면 관찰·디자인 변경과 검증 이력을 누적한다.

### 생성 시점

신규 게임 bootstrap에서 다음 네 문서를 runtime보다 먼저 생성한다.

```text
GAME_SPEC.md
DEVELOPMENT.md
UI_DESIGN.md
UI_DECISIONS.md
```

`games/UI_DESIGN_TEMPLATE.md`와 `games/UI_DECISIONS_TEMPLATE.md`를 기준으로 작성한다.

### 기존 게임의 adoption baseline

이 규칙이 도입되기 전에 이미 runtime/UI 개발이 시작됐거나 release된 platform-native 게임은 과거를 임의로 재구성하지 않는다.

- 신규 게임은 반드시 runtime 개발 전 `UI_DESIGN.md` baseline을 만든다.
- 기존 게임은 확인 가능한 당시 설계 문서 또는 도입 시점의 production/작업 상태를 **adoption baseline**으로 명시할 수 있다.
- adoption baseline은 "원래 처음부터 이렇게 계획했다"는 의미가 아니다. 문서 체계 도입 시점에서 신뢰할 수 있게 고정한 출발점이다.
- 이미 `UI_DESIGN.md` 안에 과거 구현 과정의 수정 결과가 섞여 있다면 증거 없이 억지로 분리하거나 삭제하지 않는다.
- 과거 사용자 피드백/PR/commit을 복원할 때는 확인 가능한 결정만 `UI_DECISIONS.md`에 추가한다.
- adoption 이후 새 디자인 수정은 모두 일반 규칙대로 `UI_DECISIONS.md`에 기록한다.

이 전환 예외는 기존 게임을 새 규칙에 맞추기 위해 과거 기록을 왜곡하지 않기 위한 것이며, 이후 신규 게임의 pre-development baseline 의무를 약화하지 않는다.

### MUST: baseline 보존

`UI_DESIGN.md`는 신규 게임 소스 개발 전에 확정한 조사·분석·설계 baseline을 보존한다. 개발 시작 후 발생하는 디자인 수정 때문에 이 문서를 현재 화면에 맞춰 계속 덮어쓰지 않는다.

다음과 같은 후속 변경은 `UI_DECISIONS.md`에 기록한다.

- 사용자 피드백으로 대표 색상/배경/심볼/타이포그래피 방향을 수정한 경우
- 실제 브라우저 QA로 page identity 또는 핵심 레이아웃을 바꾼 경우
- 카드/보드/칩/토큰 등 핵심 구성물 표현을 조정한 경우
- 주요 motion/interaction 원칙이나 responsive 전략을 수정한 경우
- 구현하면서 기존 Phase 계획의 일부를 폐기하거나 다른 방식으로 대체한 경우

작은 spacing 값이나 commit 단위 변경을 쌓는 changelog로 사용하지 않는 원칙은 `UI_DECISIONS.md`에도 동일하다.

예외적으로 초기 조사 문서 자체의 출처 오기나 명백한 사실 오류를 고칠 수는 있지만, 왜 고쳤는지는 `UI_DECISIONS.md`에서 추적 가능해야 한다.

### UI_DECISIONS.md와의 연결

모든 platform-native 게임은 다음 디자인 개발 이력 문서를 가진다.

```text
games/<game-id>/UI_DECISIONS.md
```

`UI_DECISIONS.md`는 다음을 기록한다.

- 실제 브라우저 QA나 사용자 피드백으로 디자인이 바뀐 배경
- 이전안과 검토한 대안, 최종 결정과 이유
- 의미 있는 layout/component/interaction/motion/responsive 변경
- 구현 상태와 UI/browser validation
- 다음 디자인 작업 또는 미확정 polish
- 어떤 초기 `UI_DESIGN.md` Phase/항목을 유지·보정·대체하는지

모든 CSS 수치나 commit을 기록하지 않는다. 현재 화면만 보고도 자명한 미세 조정은 생략하고, 다음 작업자가 동일한 시행착오를 반복하거나 사용자 의도를 잃을 수 있는 결정만 남긴다.

과거 결정이 뒤에서 바뀌어도 기존 기록을 삭제하지 않고 새 결정으로 대체하며 이전 항목을 `SUPERSEDED` 또는 `REVERTED`로 표시한다.

`UI_DESIGN.md`와 `UI_DECISIONS.md`가 같은 UI 항목에서 충돌하면 **baseline 이후 확정된 최신 non-superseded `UI_DECISIONS.md` 결정이 우선한다.** 신규 게임의 pre-development baseline이든 기존 게임의 adoption baseline이든 `UI_DESIGN.md`는 후속 변경을 되돌리는 근거로 사용할 수 없다.

현재 유효 디자인은 다음처럼 해석한다.

```text
effective design
= UI_DESIGN baseline (pre-development or explicit adoption baseline)
+ latest applicable UI_DECISIONS overrides
```

`SUPERSEDED` 또는 `REVERTED` 처리된 과거 결정은 현재 override로 사용하지 않는다.

### MUST: 디자인 개발 lifecycle과 UI_DECISIONS 기록 타이밍

platform-native 게임의 디자인 개발은 기본적으로 다음 네 단계로 본다.

1. **Design Research / Baseline**
   - 신규 게임 runtime 개발 전에 원본 디자인을 전수 조사·분석한다.
   - Visual Identity, layout, component, motion, responsive, 최초 UI Phase를 `UI_DESIGN.md`에 기록한다.
   - 이 단계는 아직 후속 수정이 없으므로 `UI_DECISIONS.md / Decision Log`를 억지로 채우지 않는다. 문서 구조와 빈 current track만 준비할 수 있다.
2. **Baseline Implementation**
   - `UI_DESIGN.md`에 수립한 Phase와 규칙대로 최초 UI를 구현한다.
   - baseline을 그대로 구현한 사실 자체는 `UI_DECISIONS.md`의 decision으로 기록하지 않는다.
   - 다만 실제 구현 제약이나 검증 때문에 baseline에서 의미 있게 벗어나기로 확정했다면 그 시점부터 `UI_DECISIONS.md`에 기록한다.
3. **Developer Manual Design Review / Detail Polish**
   - 기능 구현이 충분히 완료되고 release 전 검증·마무리 단계에 들어가면 개발자가 실제 브라우저에서 직접 플레이하며 디자인을 수동 검토한다.
   - 이 단계에서 발생하는 개발자의 구체적인 layout, component, spacing 관계, interaction, motion, responsive, 시각적 우선순위 수정 요청은 `UI_DECISIONS.md`의 핵심 기록 대상이다.
   - 여러 번의 미세 조정 요청을 요청 횟수대로 기록하지 않고, 하나의 디자인 영역이 안정화되어 최종 방향이 정해졌을 때 하나의 의미 있는 decision으로 정리한다.
4. **Design Closeout**
   - 주요 디자인 영역의 수동 검토와 수정이 끝나면 `UI_DECISIONS.md / Current Design Track`에서 현재 상태, active overrides, superseded/reverted decisions, 남은 follow-up을 정리한다.
   - 최종 결과를 만들기 위해 `UI_DESIGN.md` baseline을 현재 화면으로 덮어쓰지 않는다. 최종 유효 디자인은 baseline + 최신 decision overrides로 복원 가능해야 한다.

`UI_DECISIONS.md`의 기록 단위는 **수정 요청 하나**가 아니라 **확정된 디자인 결정 하나**다.

예를 들어 개발자가 한 영역에 대해 위치를 올렸다가 내리고, 크기를 키웠다가 줄이는 여러 요청을 연속으로 했더라도 그 영역이 안정화되기 전까지 각각을 별도 decision으로 만들지 않는다. 최종적으로 채택된 상태, 변경 이유, 버린 대안과 영향 범위를 하나의 decision으로 기록한다.

#### MUST: 기록 트리거

다음 시점에는 아직 문서화되지 않은 의미 있는 디자인 결정이 있는지 확인하고, 있다면 `UI_DECISIONS.md`를 갱신한다.

- `UI_DESIGN.md` baseline에서 벗어나는 의미 있는 구현 방향이 확정됐을 때
- 개발자의 수동 브라우저 디자인 리뷰에서 하나의 component/layout/interaction/motion 영역이 안정화되고 다른 영역으로 넘어갈 때
- 디자인 Phase 또는 detail-polish 작업 범위를 완료할 때
- 해당 디자인 작업 PR을 merge/close하거나 작업 브랜치를 종료하기 전
- 다른 큰 기능 작업이나 release closeout으로 전환하기 전

SHOULD: 같은 디자인 영역이 아직 빠르게 반복 수정 중이면 매 수정마다 문서를 갱신하지 않고 안정화 시점에 묶어서 기록한다.

MUST NOT: 디자인 작업 PR이나 브랜치를 종료하면서 아직 복원 가치가 있는 개발자 피드백과 확정 디자인 결정을 코드에만 남기고 `UI_DECISIONS.md` 기록 없이 버리지 않는다.

### MUST: 사용자가 `디자인 체크포인트 기록하자`라고 요청할 때

`디자인 체크포인트 기록하자`는 Game Platform의 명시적 디자인 handoff checkpoint 명령이다.

사용자가 이 명령을 요청하면 현재 작업 구간에서 **이미 확정되어 복원 가치가 있는 디자인 결정만** `UI_DECISIONS.md`에 정리하고, 유효한 현재 작업 브랜치에 commit해 다음 채팅이나 다음 작업자가 그대로 이어갈 수 있게 한다.

이 경우:

1. 같은 디자인 영역에서 아직 빠르게 반복 수정 중인 요청은 각각 별도 decision으로 만들지 않는다.
2. 현재까지 안정화된 component/layout/interaction/motion 단위를 기준으로 최종 채택안, 변경 이유, 이전 대안, 적용 범위, 구현/검증 상태를 기록한다.
3. 기존 decision을 대체하거나 되돌린 경우 `Supersedes`와 `SUPERSEDED` / `REVERTED` 관계를 명시한다.
4. 아직 확정되지 않은 디자인은 `Open Follow-up`에 남기고 확정 decision처럼 기록하지 않는다.
5. 초기 `UI_DESIGN.md` baseline을 현재 화면에 맞춰 재작성하지 않는다.
6. 이 명령 자체는 디자인 Phase 완료나 `FINAL` 상태를 의미하지 않는다. 수동 디자인 리뷰 중간에도 사용할 수 있다.
7. 기능 진행상태를 기록하기 위한 `DEVELOPMENT.md`는 디자인 checkpoint라는 이유만으로 수정하지 않는다.

사용자가 기능과 디자인 checkpoint를 한 요청에서 모두 명시하면 두 책임 문서를 각각 갱신할 수 있다.

이 명령과 별개로 위 lifecycle 기반 기록 트리거는 계속 적용한다.

### MUST: Phase를 이어갈 때 디자인 회귀 방지

`UI_DESIGN.md / Implementation Plan`에 정의된 다음 Phase를 구현하거나 과거에 미완료였던 UI 작업을 재개할 때는 소스 수정 전에 반드시 다음을 수행한다.

1. 해당 Phase의 초기 `UI_DESIGN.md` 요구사항을 확인한다.
2. `UI_DECISIONS.md`에서 그 Phase, component, layout, interaction, motion과 관련된 후속 결정을 확인한다.
3. 이미 runtime에 반영된 디자인과 후속 결정이 초기 계획보다 발전한 상태라면 그 상태를 보존한다.
4. 초기 Phase 문구와 최신 유효 결정이 충돌하면 최신 `UI_DECISIONS.md`를 적용한다.
5. 폐기되거나 supersede된 안을 "원래 계획"이라는 이유로 다시 구현하지 않는다.
6. 작업 완료 전 변경 범위가 기존 유효 decision을 회귀시키지 않았는지 확인한다.

MUST NOT: Phase 체크리스트를 순서대로 완료하는 과정에서 후속 사용자 수정, 실제 브라우저 QA 결과, 이미 채택된 interaction을 과거 설계안으로 원복한다.

### DEVELOPMENT.md와의 연결

`DEVELOPMENT.md`는 기능 개발 handoff를 책임진다. 디자인 작업이 release 판단에 영향을 주는 경우 현재 design track을 짧게 참조할 수 있지만, baseline 이후의 의미 있는 UI 변경·결정·디자인 검증 이력은 `UI_DECISIONS.md`에 둔다.

완료되지 않은 UI 항목을 `UI_DESIGN.md`에서 삭제해 현재 구현처럼 보이게 하지 않고, 초기 baseline의 단순 미구현인지 후속 decision으로 변경·대체된 것인지 `UI_DECISIONS.md`에서 구분한다.

## 7. 실제 보드게임의 공간 구조 반영

웹 UI는 실제 게임에서 플레이어가 정보를 읽고 구성물을 다루는 방식을 조사해 가능한 범위에서 반영한다.

예:

- 중앙 공용 영역
- 개인 플레이어 영역
- 카드/칩이 실제로 쌓이거나 겹치는 방식
- 공개 정보와 비공개 정보의 시각적 구분
- 보드에서 진행 방향과 상태를 읽는 방식

원본 배치를 그대로 복제하는 것이 가독성을 해치면 웹 환경에 맞게 재구성할 수 있다. 최초 adaptation 계획은 `UI_DESIGN.md`에 두고, 개발 시작 후 실제 브라우저 검토로 그 배치를 수정했다면 최신 유효 결정과 이유를 `UI_DECISIONS.md`에 남긴다.

## 8. 모션과 행동 피드백

게임의 핵심 행동은 상태 값만 즉시 바뀌는 방식보다 실제 구성물이 움직인다는 감각을 우선 검토한다.

예:

- 카드 공개 / 뒤집기 / 이동
- 칩 또는 토큰 지불과 획득
- 주사위 굴림
- 말 이동
- 돈/자산 이동
- 턴 전환
- 큰 점수/중요 행동 피드백
- 게임 종료와 승자 발표

애니메이션은 장식보다 **원인 → 이동/행동 → authoritative 결과 반영**의 순서를 사용자가 이해하게 만드는 것이 우선이다.

동기화 안정성을 해치거나 실제 서버 상태와 다른 결과를 먼저 확정해서 보여주지 않는다.

## 9. 결과와 재대결 presentation

멀티플레이 게임의 결과 화면과 재대결 준비 화면도 해당 게임의 Visual Identity 안에서 설계한다.

재대결 lifecycle 자체의 기능 규칙과 서버 권위는 `docs/game-platform-development-rules.md`를 따른다.

UI는 최소 다음을 명확히 표현한다.

- 게임 종료 이유와 결과
- 승자 또는 공동 승자
- 재대결 선택 상태
- 플레이어별 준비 상태
- 방장이 새 게임을 시작할 수 있는 조건
- 재대결하지 않는 플레이어의 이탈 경로

## 10. Responsive 기준

게임 UI는 desktop과 mobile 모두에서 핵심 정보와 action이 유지되어야 한다.

- 화면 높이가 제한돼도 매 턴 불필요한 상하 스크롤을 강요하지 않는다.
- 많은 카드/토큰 등은 겹침, 축약, scroll area 등 게임에 맞는 표현을 설계한다.
- 핵심 숫자와 상태는 구성물이 겹쳐도 읽을 수 있는 위치를 우선한다.
- hover에만 의존하는 핵심 interaction을 만들지 않는다.
- mobile에서 터치 target과 modal/overlay가 gameplay를 막지 않는지 검증한다.

### Implementation Plan 책임

`UI_DESIGN.md / Implementation Plan`은 runtime 개발 전에 수립한 **초기 presentation 적용 순서와 가이드**를 보존하며 live progress/changelog로 사용하지 않는다. 기능 상태 머신, DB/RPC, 서버 권위 구현 순서는 `GAME_SPEC.md`, 실제 기능 다음 작업은 `DEVELOPMENT.md / Next Work`에서 관리한다. 개발 시작 후 baseline에서 벗어나 확정된 디자인 변경, 수동 브라우저 리뷰 결과와 그에 따른 후속 UI 작업만 `UI_DECISIONS.md`에서 추적한다.

같은 TODO나 결정 이력을 네 문서에 반복 복제하지 않는다.

## 11. 구현 완료 검증

UI 구현을 완료했다고 판단하기 전에 최소 다음을 확인한다.

- 원본 게임 조사 결과가 `UI_DESIGN.md`에 남아 있는가
- 디자인 출처와 자산 사용 가능 여부가 구분돼 있는가
- generic 청파 같이 페이지가 아니라 해당 게임의 독립적인 공간으로 느껴지는가
- 대표 색상/심볼/구성물 표현이 설계와 일치하는가
- lobby부터 result/rematch까지 Visual Identity가 끊기지 않는가
- gameplay 핵심 정보의 가독성이 충분한가
- motion이 서버 권위와 충돌하지 않고 행동 순서를 이해시키는가
- desktop/mobile에서 핵심 action을 사용할 수 있는가
- `UI_DECISIONS.md`의 디자인 진행·중요 결정·검증 이력이 실제 구현과 일치하는가

## 12. 공통화 경계

게임 하나에서 편리했던 CSS, 컴포넌트, 애니메이션을 즉시 `games/shared/` 공통 계약으로 승격하지 않는다.

게임 규칙과 무관하게 여러 신규 게임에서 반복되는 접근성, 연결 상태, Room/Lobby 같은 책임만 기존 Game Platform 규칙에 따라 SHARED 후보로 검토한다.

Visual Identity와 game-specific presentation은 기본적으로 GAME-LOCAL에 유지한다.
