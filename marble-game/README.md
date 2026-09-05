# Marble Worlds

테마마다 다른 세계관과 규칙을 선택해 즐기는 3D 온라인 마블 보드게임 모듈입니다.

## 현재 개발 단계

`Phase 3 — 3D Technical Prototype`

Classic 핵심 규칙 엔진과 브라우저 수동 테스트 흐름을 실제 3D 보드에 연결해 기술 방향을 검증하는 단계입니다.

현재 구현 범위:

- Classic / Space / Ocean / Fantasy 테마 선택 로비
- Theme Registry
- 방향/분기 이동을 지원하는 Board Graph 기반
- Turn State Machine
- 공통 Action 타입과 Action 생성 검증
- **32칸 Classic 세계일주 보드**
- 2주사위, 이동 경로, 출발점 통과 보너스
- 도시 구매 / 소유권 / 최대 3단계 건설
- 단계별 통행료와 플레이어 간 자금 이동
- 지원금 / 세금 / 이벤트 / 휴식 특수 타일
- 휴식 턴 스킵
- 파산 / 소유지 반환 / 마지막 생존자 승리
- 향후 3D 애니메이션용 `lastEvents`와 이동 `path`
- Game Engine과 3D Renderer를 분리하는 renderer contract
- Classic 2인 로컬 수동 플레이테스트
- Three.js 기반 3D Scene / Perspective Camera / Lighting / Shadow
- 32칸 외곽형 3D 보드와 한글 타일 라벨
- 플레이어 3D 말 및 동일 칸 오프셋
- `PLAYER_MOVED.path`를 이용한 칸 단위 3D 이동
- 도시 소유권 및 건설 단계의 3D 표시
- 드래그 회전 / 휠 확대·축소 / 터치 조작
- Raycaster 기반 타일 클릭·터치 선택
- 3D 로드 실패 시에도 유지되는 2D 상태 보드
- 30~40칸 규모를 검증하는 순수 레이아웃 테스트

## Classic 보드 규모 원칙

최종 Classic 보드는 **30칸 이상**을 유지합니다.

Phase 3부터 실제 카메라 거리, 타일 간격, 라벨 가독성, 모바일 화면을 최종 규모에 가까운 상태에서 검증하기 위해 테스트 보드를 기존 20칸에서 32칸으로 확장했습니다.

현재 32칸의 가격과 도시 구성은 3D 기술 검증과 Classic Core 테스트를 위한 기준값이며, 실제 플레이 시간과 경제 밸런스는 이후 고급 규칙 단계에서 다시 조정할 수 있습니다.

## 브라우저에서 수동 테스트

`marble-game/` 페이지에서 Classic 테마를 선택한 뒤 **Classic 3D 테스트 플레이 시작** 버튼을 누릅니다.

한 화면에서 다음 흐름을 직접 확인할 수 있습니다.

1. 32칸 3D 보드가 표시되는지
2. 마우스 드래그 / 터치 드래그로 시점을 조작할 수 있는지
3. 휠 또는 핀치로 확대·축소할 수 있는지
4. 3D 타일 클릭/터치 시 해당 칸 정보가 표시되는지
5. 플레이어 A/B 턴 진행
6. 주사위 결과에 따라 말이 `PLAYER_MOVED.path`를 한 칸씩 이동하는지
7. 두 플레이어가 같은 칸에 있어도 말이 겹쳐 사라지지 않는지
8. 빈 도시 구매 또는 건너뛰기
9. 자신의 도시 재방문 시 건설 또는 건너뛰기
10. 소유 도시와 건설 단계가 3D 보드에 반영되는지
11. 상대 도시 통행료
12. 지원금 / 세금 / 이벤트 / 휴식
13. 파산 및 승리
14. 필요하면 **2D 상태 보드 함께 보기**로 엔진 상태와 3D 표현을 비교

이 화면의 주사위는 로컬 브라우저 테스트용 `Math.random`을 사용합니다. 온라인 멀티플레이 단계에서는 클라이언트 난수를 신뢰하지 않고 서버 RPC가 결과를 확정합니다.

## 3D 기술

Three.js는 브라우저 ES Module로 버전을 고정해 사용합니다.

```text
three@0.185.1
```

`threeClassicPrototype.js`는 Three.js를 `mount()` 시점에 동적으로 불러오기 때문에 Node 기반 게임 규칙 테스트는 WebGL이나 DOM 없이도 계속 실행할 수 있습니다.

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
│   │   ├── rendererContract.js
│   │   └── threeClassicPrototype.js
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
    ├── localPlaytest.test.js
    └── threePrototype.test.js
```

## 핵심 설계 원칙

1. 게임 규칙은 DOM이나 Three.js를 직접 참조하지 않습니다.
2. 보드는 단순한 위치 배열이 아니라 Node/Edge 그래프로 유지합니다.
3. Theme은 공통 Engine에 등록되는 모듈이며 새 Theme 추가를 위해 Classic 코드를 복제하지 않습니다.
4. 애니메이션은 Engine에서 확정된 `Game State`와 `lastEvents`를 표현하는 역할만 담당합니다.
5. 3D 말 이동은 `PLAYER_MOVED.path`를 읽을 뿐, 애니메이션 완료가 게임 결과를 결정하지 않습니다.
6. 수동 테스트 UI도 `localPlaytest.js`를 통해 Engine Action을 호출하며 규칙을 별도로 복제하지 않습니다.
7. 온라인 단계에서는 클라이언트가 아니라 서버 RPC가 authoritative state를 갱신합니다.
8. `prefers-reduced-motion` 사용자는 3D 말 이동을 즉시 반영합니다.

## 테스트

저장소 루트에서:

```bash
npm run test:marble
```

## 다음 단계

`Phase 4 — 3D Foundation`

Phase 3에서 검증한 기술 프로토타입을 정식 Renderer 계층으로 다듬습니다.

- Scene / Camera 생명주기 정리
- 테마별 Renderer Config
- 정식 3D 보드 컴포넌트
- 말 / 건물 / 소유권 시각 시스템
- 카메라 프리셋과 턴 연출
- 모바일 그래픽 품질 단계
- 로딩 / WebGL 오류 처리
- 다음 Multiplayer 단계가 authoritative state를 그대로 공급할 수 있는 렌더링 경계 확정
