# Marble Development Roadmap

업데이트 기준: 2026-09-18

이 문서는 Marble Worlds / 부루마블의 **현재 개발 위치를 확인하는 기준 문서**입니다.

과거 PR, Phase별 설계 문서, 실험 기록은 당시 결정을 보존하는 이력 문서로 유지하고, 현재 어느 단계까지 완료되었는지는 이 문서를 우선 확인합니다.

## 현재 위치

현재 개발 위치는 다음과 같습니다.

```text
Phase 1   Foundation                              완료
Phase 2   Classic Core                           완료
Phase 2.5 Local Manual Playtest                  완료
Phase 3   Fixed Quarter-view 2.5D Prototype      완료
Phase 4   Classic 2.5D Visual Foundation         완료
Phase 5   Online Multiplayer Foundation          완료
Phase 6   Online Stability / Recovery            완료
Phase 7   Classic Advanced Gameplay              진행 중
└─ Phase 7A Auction                              완료
└─ Phase 7B Trading / Negotiation                완료
└─ Phase 7C Debt Recovery / Asset Liquidation   진행 중 (foundation)
```

따라서 `marble-game/README.md`에 과거부터 남아 있던 **Phase 4가 현재 단계라는 표기는 더 이상 현재 상태가 아닙니다.**

현재 기준은 **Phase 7A 경매 완료, Phase 7B 거래/협상 완료, Phase 7C 자산 매각 기반 파산 회피 foundation 진행 중**입니다.

## Phase 1 — Foundation

대표 PR: #30

완료 범위:

- `marble-game/` 독립 모듈
- Theme Registry
- Node / Edge Board Graph
- Turn State Machine
- 공통 Action / Game State
- Game Engine / Renderer contract 분리
- Marble 자동 테스트와 Site static checks 연결

## Phase 2 / 2.5 — Classic Core + Local Playtest

대표 PR: #31

완료 범위:

- Classic 기본 보드 및 2주사위 이동
- 도시 구매 / 소유권 / 건설
- 통행료
- START / EVENT / TAX / BONUS / REST
- 파산 및 승패
- `lastEvents` 기반 presentation event
- 브라우저 2인 로컬 수동 플레이 세션

## Phase 3 — Fixed Quarter-view 2.5D Prototype

대표 PR: #33

완료 범위:

- Three.js 기반 보드
- 고정 Orthographic 쿼터뷰
- 32칸 Classic 보드
- 3D 말 / 건물 / ownership 표현
- `PLAYER_MOVED.path` 기반 이동 애니메이션
- 타일 클릭 / 터치
- 3D 실패 시 2D fallback

## Phase 4 — Classic 2.5D Visual Foundation

대표 PR: #36

완료 범위:

- Classic 고정 쿼터뷰 비주얼 기반
- 외곽 타일 가독성 개선
- 꼭짓점 타일 구조
- 도시명 / 랜드마크 / 상세 모달
- Classic 화폐의 골드 표현
- 플레이 전용 화면 기반

Phase 4의 비주얼 방향은 현재도 유효하지만, **개발 진행 위치 자체는 Phase 4에 머물러 있지 않습니다.**

## Phase 5 — Online Multiplayer Foundation

대표 PR: #40

완료 범위:

- 2~4인 온라인 대기실
- 방 생성 / 코드 참가 / 준비 / 방장 이관
- Supabase 기반 서버 권위 게임 시작
- 서버 주사위 및 턴 액션
- 구매 / 건설 / 통행료 / 이벤트 / 휴식 / 파산
- `version` optimistic concurrency
- `client_action_id` 기반 중복 액션 방지
- Realtime 동기화
- 새로고침 / 재접속 복구
- 온라인 게임 종료 lifecycle

## Phase 6 — Online Stability / Recovery

대표 PR:

- #92 — Phase 6A online presence / startup recovery
- #117 — Phase 6B online stability recovery
- #213 — Phase 7 진입 전 최종 Marble 통합

완료 범위:

- 온라인 게임 화면 로딩 안정화
- Realtime / snapshot recovery
- transport failure 시 동일 `client_action_id` 재시도
- stale snapshot / stale response 방어
- reconnect / visibility 복귀 시 authoritative refresh
- 로컬 Classic과 온라인 lifecycle 실행 경계 분리
- 진행 중 온라인 게임 재입장
- 3D 말 배치 및 전체화면 adaptive render budget
- Animation / Presentation foundation
- 구매 / 건설 / 통행료 / EVENT / TAX / START 등의 시각 피드백

Phase 7 진입 전 PR #213에서 당시 검증된 안정화 및 presentation 변경을 최신 main에 최종 통합했습니다.

## Phase 7 — Classic Advanced Gameplay

Phase 7은 기존 Phase 6 안정화 기반을 보호하면서, 다른 플레이어의 턴에도 판단과 상호작용이 발생하는 고급 게임플레이를 추가하는 단계입니다.

### Phase 7A — Auction

상태: **완료**

대표 PR:

- #216 — Auction foundation
- #223 / #226 / #227 — 경매 reducer, request gate, 요청자 입찰 규칙
- #228 — 로컬 runtime
- #231 — authoritative auction RPC
- #232 — Realtime / reconnect
- #234 — 온라인 경매 UI
- #240 — 멀티플레이 회귀 검증
- #248 — Phase 7A 최종 main 통합
- #250 — 최종 merge blocker 보정

현재 최종 동작:

- 도시 구매 거절 → `AUCTION_REQUEST`
- 다른 eligible 플레이어에게 경매 요청 기회 제공
- 요청 0명 → 경매 없이 `TURN_END`
- 요청 1명 이상 → `PROPERTY_AUCTION`
- 구매 거절자는 해당 경매 참여 제외
- 요청자는 자금이 충분하면 첫 유효 입찰 전 자발적 패스 불가
- 비요청 eligible 플레이어는 즉시 입찰 / 패스 가능
- 시작가는 도시 정가
- 최소 입찰가는 `max(시작가, 최고가 + 1)`
- 보유 골드 초과 입찰 금지
- 최고 입찰자 패스 금지
- 낙찰 시 골드 차감 + 소유권 이전을 authoritative transaction에서 처리
- `expected_version` / `client_action_id` replay / idempotency 유지
- Realtime / reconnect / stale snapshot 방어
- 로컬 shared-screen 경매 UI와 온라인 경매 UI 연결
- 경매 중 legacy `endTurn` 우회 차단

현재 요청창의 자동 deadline / 고정 시간 제한은 아직 확정된 제품 규칙이 아니므로 임의로 추가하지 않습니다.

### Phase 7B — Trading / Negotiation

상태: **완료**

거래 lifecycle과 deterministic settlement를 고정한 뒤, 현재는 기존 Phase 7A reducer를 직접 수정하지 않는 additive Game Engine integration을 진행합니다.

- 플레이어 간 거래 / 협상 기능을 Phase 7B로 진행
- `trade.js`에서 제안 생성 및 수락/거절 lifecycle foundation을 분리 구현
- `tradeSettlement.js`의 property/gold deterministic settlement를 Game Engine wrapper에 연결
- 현재 플레이어의 `WAITING_ROLL`에서만 거래 제안 가능, open trade 중 일반 액션 잠금
- 로컬 runtime까지 동일 거래 reducer를 연결 완료
- `pending_trade` snapshot + `expected_version` + `client_action_id` 기반 authoritative RPC와 isolated DB 검증 완료
- Realtime / reconnect snapshot 복구 연결 완료
- 온라인 거래 작성/수락/거절/제안자 취소 UI adapter 연결 완료
- 3클라이언트 authoritative/Realtime/stale snapshot/reconnect 멀티플레이 회귀 검증 완료
- 최신 main 통합 및 운영 Supabase migration 반영 완료
- Phase 7A에서 검증한 서버 권위, version, idempotency, Realtime / reconnect 원칙을 유지
- 기존 구매 / 건설 / 경매 / 턴 진행을 깨지 않도록 독립 규칙부터 설계
- 거래 가능 자산, 골드 포함 여부, 제안 / 수정 / 거절 / 취소 / 만료, 턴 제한 등 세부 제품 규칙은 구현 전에 별도로 확정

세부 거래 규칙은 아직 이 문서에서 임의로 고정하지 않습니다.

### Phase 7C — Debt Recovery / Asset Liquidation

상태: **진행 중 — Realtime / reconnect**

Phase 2 Classic Core는 지불해야 할 금액보다 현금이 부족하면 즉시 파산 처리하고 보유 도시를 은행에 반환합니다. Phase 7C는 이 즉시 파산 전에 플레이어가 보유 자산을 정리해 지불 가능성을 회복할 수 있는 규칙을 추가하는 단계입니다.

이번 foundation 범위:

- 기존 `gameEngine.js`의 즉시 파산 경로는 아직 변경하지 않음
- `liquidation.js`에서 debt recovery case를 독립 규칙으로 생성
- 현재 현금 / 지불액 / 부족액 / 보유 자산을 immutable하게 계산
- 매각 가능한 자산의 refund 값은 외부 정책에서 명시적으로 주입
- 선택한 자산 조합이 지불액을 충족하는지 deterministic하게 평가
- 건물 단계는 자산 metadata로 보존
- `liquidationPolicy.js`에서 토지/건물 환급률을 basis point로 주입하는 deterministic 계산 엔진 추가
- Classic v1 환급률을 도시 원가 50% + 누적 건설비 50%로 고정
- debt recovery lifecycle을 OPEN / READY / CONFIRMED / IMPOSSIBLE로 고정
- 자산 선택이 부족하면 OPEN 유지, debt 충족 시에만 확정 가능
- CONFIRMED recovery를 실제 property release + money settlement 결과로 계산하는 독립 settlement 추가
- settlement 직전 cash / ownership / building / refund drift 재검증
- creditor debt는 전액 지급, bank debt는 circulation에서 제거
- 기존 reducer는 default 즉시 파산 동작 유지
- Phase 7C wrapper에서만 TOLL / TAX / EVENT insolvency를 DEBT_RECOVERY로 defer
- LIQUIDATION_SELECT / LIQUIDATION_CONFIRM action 추가
- recovery 불가능 시 동일 action을 legacy path로 재실행해 기존 bankruptcy semantics 유지

의도적으로 아직 확정하지 않는 규칙:

- 여러 자산 선택/확정 lifecycle
- 매각 후 property ownership 해제 시점
- 한 번에 여러 자산을 선택하는 UI 흐름
- creditor가 있는 통행료와 은행 지불(TAX/EVENT)의 정산 차이
- 매각 후에도 부족할 경우 최종 파산 전환 시점

local Classic runtime과 authoritative liquidation RPC / isolated DB 검증을 완료했고, 현재 기존 version-based Realtime refresh와 reconnect recovery에 debt recovery snapshot을 연결합니다.

## 이후 Advanced Gameplay 후보

초기 Classic Core 단계에서 장기 확장 후보로 기록된 항목에는 다음이 있습니다.

- 운 조절
- 개인 비밀 목표
- 반응 카드
- 공동 이벤트
- 자산 매각 기반 파산 회피 — **Phase 7C로 착수**

이 항목들의 정확한 Phase 번호와 구현 순서는 각 단계 착수 전에 별도로 확정합니다.

## 개발 안전 원칙

1. Phase 6까지 안정화된 기본 Classic 동작을 보호합니다.
2. Phase 7 기능은 기존 `gameEngine.js`, turn rule, renderer를 불필요하게 광범위 수정하지 않습니다.
3. 온라인 상태의 최종 진실은 서버 authoritative state입니다.
4. Realtime 이벤트 자체를 최종 상태로 신뢰하지 않고 snapshot refresh를 사용합니다.
5. mutation은 가능한 한 `expected_version` + `client_action_id` 계약을 유지합니다.
6. 로컬 / 온라인 양쪽의 deterministic 규칙과 회귀 테스트를 유지합니다.
7. 한 Phase의 기능은 규칙 → runtime → authoritative RPC → Realtime / reconnect → UI → 멀티플레이 회귀 순으로 단계적으로 연결합니다.
8. main에는 직접 commit / push하지 않고 작업 브랜치와 PR을 사용합니다.

## 관련 문서

- [Marble README](../marble-game/README.md)
- [Animation & Presentation Design](../marble-game/ANIMATION_DESIGN.md)
- [Phase 7A Auction Foundation](./marble-phase7a-auction-foundation.md)
