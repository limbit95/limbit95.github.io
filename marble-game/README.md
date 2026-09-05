# Marble Worlds

테마마다 다른 세계관과 규칙을 선택해 즐기는 3D 온라인 마블 보드게임 모듈입니다.

## 현재 개발 단계

`Phase 2 — Classic Core`

Classic을 공통 엔진의 첫 실제 규칙 세트로 구현했습니다. 아직 3D 렌더링과 온라인 동기화는 연결하지 않고, 엔진 상태만으로 한 턴의 핵심 흐름과 한 판의 승패를 계산할 수 있도록 합니다.

구현 범위:

- 20칸 오리지널 세계일주 Classic 보드
- 2주사위 결과 검증과 로컬 주사위 helper
- Node/Edge 보드를 따라가는 이동 경로 계산
- 출발점 통과 보너스
- 도시 구매와 소유권
- 최대 3단계 건설
- 건설 단계별 통행료
- 지원금 / 세금 / 이벤트 / 휴식 특수 타일
- 이벤트 카드 순환 상태
- 휴식 턴 스킵
- 자금 부족 시 파산 및 소유지 은행 반환
- 마지막 생존 플레이어 승리
- 렌더러가 재생할 수 있는 `lastEvents` 이동/경제 이벤트 기록

## 핵심 구조

```text
marble-game/
├── js/
│   ├── core/
│   │   ├── actions.js
│   │   ├── boardGraph.js
│   │   ├── dice.js
│   │   ├── gameEngine.js
│   │   ├── movement.js
│   │   └── turnMachine.js
│   ├── renderer/
│   │   └── rendererContract.js
│   └── themes/
│       ├── themeRegistry.js
│       └── classic/
│           ├── board.js
│           ├── rules.js
│           └── theme.js
└── tests/
    ├── foundation.test.js
    └── classic.test.js
```

## 게임 상태와 애니메이션

엔진은 주사위와 이동 결과를 먼저 확정한 뒤 `lastEvents`에 렌더링 힌트를 남깁니다.

예:

```text
DICE_ROLLED
PLAYER_MOVED(path)
START_PASSED
TILE_LANDED
PROPERTY_BOUGHT / MONEY_PAID / PLAYER_BANKRUPT
```

3D 단계에서는 이 이벤트를 시각적으로 재생하되, 애니메이션 완료 여부가 게임 규칙을 결정하지 않습니다.

## 현재 Classic 규칙의 의도적 한계

Phase 2에서는 핵심 엔진 검증에 집중하기 때문에 아래 고급 규칙은 아직 포함하지 않습니다.

- 자산 매각 후 파산 회피
- 경매
- 거래 / 협상
- 비밀 목표
- 운 조절 자원
- 반응 카드
- 공동 이벤트

위 기능은 전체 로드맵의 Advanced Gameplay 단계에서 공통 시스템으로 추가합니다.

## 테스트

저장소 루트에서:

```bash
npm run test:marble
```

## 다음 단계

`Phase 3 — 3D Technical Prototype`

- Classic 3D 테스트 보드
- 카메라 / 조명
- 타일 선택
- 플레이어 말
- `PLAYER_MOVED.path` 기반 칸 단위 이동
- PC 클릭 / 모바일 터치
- 기본 성능 검증

Game Engine은 3D 라이브러리를 직접 참조하지 않고 기존 renderer contract를 유지합니다.
