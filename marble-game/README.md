# Marble Worlds

테마마다 다른 세계관과 규칙을 선택해 즐기는 3D 온라인 마블 보드게임 모듈입니다.

## 현재 개발 단계

`Phase 1 — Marble Foundation`

현재 단계에서는 실제 게임 플레이, 온라인 방, 3D 렌더링을 구현하지 않고 이후 기능이 서로 얽히지 않도록 공통 경계를 먼저 만듭니다.

구현 범위:

- Classic / Space / Ocean / Fantasy 테마 선택 로비
- Theme Registry
- 방향/분기 이동을 지원하는 Board Graph 기반
- Turn State Machine
- 공통 Action 타입과 Action 생성 검증
- 공통 Game State 및 최소 START/END reducer
- Game Engine과 3D Renderer를 분리하기 위한 renderer contract
- Node 기반 foundation 테스트

## 구조

```text
marble-game/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── core/
│   │   ├── actions.js
│   │   ├── boardGraph.js
│   │   ├── gameEngine.js
│   │   └── turnMachine.js
│   ├── renderer/
│   │   └── rendererContract.js
│   └── themes/
│       ├── themeRegistry.js
│       ├── classic/theme.js
│       ├── space/theme.js
│       ├── ocean/theme.js
│       └── fantasy/theme.js
└── tests/
    └── foundation.test.js
```

## 핵심 설계 원칙

1. 게임 규칙은 DOM이나 3D 렌더러를 직접 참조하지 않습니다.
2. 보드는 단순한 0~39 위치 배열이 아니라 Node/Edge 그래프로 확장할 수 있게 시작합니다.
3. Theme은 공통 Engine에 등록되는 모듈이며 새 Theme 추가를 위해 Classic 코드를 복제하지 않습니다.
4. 애니메이션은 서버/엔진에서 확정된 Game State를 표현하는 역할만 담당합니다.
5. 온라인 단계에서는 클라이언트가 아니라 서버 RPC가 authoritative state를 갱신합니다.

## 테스트

저장소 루트에서:

```bash
npm run test:marble
```

## 다음 단계

`Phase 2 — Classic Core`

- 전체 Classic 보드 데이터
- 주사위
- 이동 경로 계산
- 출발점 통과
- 도시 구매/소유
- 건설
- 통행료
- 특수 타일
- 파산/승리의 핵심 규칙
