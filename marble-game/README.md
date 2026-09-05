# Marble Worlds

테마마다 다른 세계관과 규칙을 선택해 즐기는 3D 온라인 마블 보드게임 모듈입니다.

## 현재 개발 단계

`Phase 2.5 — Classic Manual Playtest`

Classic 핵심 규칙 엔진을 브라우저에서 직접 확인할 수 있도록 2인 로컬 수동 플레이테스트 UI까지 연결한 단계입니다.

현재 구현 범위:

- Classic / Space / Ocean / Fantasy 테마 선택 로비
- Theme Registry
- 방향/분기 이동을 지원하는 Board Graph 기반
- Turn State Machine
- 공통 Action 타입과 Action 생성 검증
- 20칸 오리지널 Classic 세계일주 보드
- 2주사위, 이동 경로, 출발점 통과 보너스
- 도시 구매 / 소유권 / 최대 3단계 건설
- 단계별 통행료와 플레이어 간 자금 이동
- 지원금 / 세금 / 이벤트 / 휴식 특수 타일
- 휴식 턴 스킵
- 파산 / 소유지 반환 / 마지막 생존자 승리
- 향후 3D 애니메이션용 `lastEvents`와 이동 `path`
- Game Engine과 3D Renderer를 분리하기 위한 renderer contract
- Classic 2인 로컬 수동 플레이테스트 UI
- 6×6 외곽형 2D 테스트 보드, 플레이어 상태, 액션 버튼, 게임 로그
- Node 기반 자동 테스트

## 브라우저에서 수동 테스트

`marble-game/` 페이지에서 Classic 테마를 선택한 뒤 **Classic 테스트 플레이 시작** 버튼을 누릅니다.

한 화면에서 다음 흐름을 직접 확인할 수 있습니다.

1. 플레이어 A/B 턴 진행
2. 주사위 굴리기
3. 보드 위 말 위치 변경
4. 빈 도시 구매 또는 건너뛰기
5. 자신의 도시 재방문 시 건설 또는 건너뛰기
6. 상대 도시 통행료
7. 지원금 / 세금 / 이벤트 / 휴식
8. 파산 및 승리

이 화면의 주사위는 로컬 브라우저 테스트용 `Math.random`을 사용합니다. 온라인 멀티플레이 단계에서는 클라이언트 난수를 신뢰하지 않고 서버 RPC가 결과를 확정합니다.

## 구조

```text
marble-game/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── localPlaytest.js
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
│       ├── classic/
│       │   ├── board.js
│       │   ├── rules.js
│       │   └── theme.js
│       ├── space/theme.js
│       ├── ocean/theme.js
│       └── fantasy/theme.js
└── tests/
    ├── foundation.test.js
    ├── classic.test.js
    └── localPlaytest.test.js
```

## 핵심 설계 원칙

1. 게임 규칙은 DOM이나 3D 렌더러를 직접 참조하지 않습니다.
2. 보드는 단순한 0~39 위치 배열이 아니라 Node/Edge 그래프로 확장할 수 있게 시작합니다.
3. Theme은 공통 Engine에 등록되는 모듈이며 새 Theme 추가를 위해 Classic 코드를 복제하지 않습니다.
4. 애니메이션은 서버/엔진에서 확정된 Game State를 표현하는 역할만 담당합니다.
5. 수동 테스트 UI도 `localPlaytest.js`를 통해 Engine Action을 호출하며 규칙을 별도로 복제하지 않습니다.
6. 온라인 단계에서는 클라이언트가 아니라 서버 RPC가 authoritative state를 갱신합니다.

## 테스트

저장소 루트에서:

```bash
npm run test:marble
```

## 다음 단계

`Phase 3 — 3D Technical Prototype`

현재 2D 수동 테스트에서 사용하는 동일한 보드 노드와 `PLAYER_MOVED.path`를 이용해 다음을 검증합니다.

- 3D Scene / Camera / Lighting
- Classic 3D 테스트 보드
- 플레이어 말
- 칸 단위 이동
- 클릭 / 터치 판정
- 여러 말의 동일 칸 표현
- PC / 모바일 기본 성능

3D 프로토타입에서도 게임 규칙은 현재 Classic Core를 그대로 사용합니다.
