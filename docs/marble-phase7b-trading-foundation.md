# Marble Phase 7B — Trading Foundation

Phase 7B는 Classic Advanced Gameplay의 거래/협상 단계입니다.

이번 foundation은 거래 자산 종류나 턴 제한을 먼저 하드코딩하지 않고, 서버 권위 거래로 확장할 수 있는 **거래 제안 lifecycle 규칙**만 독립 모듈로 고정합니다.

## 현재 확정 범위

- 거래는 서로 다른 두 활성 플레이어 사이에서만 생성할 수 있습니다.
- 파산 플레이어는 거래 제안자 또는 수신자가 될 수 없습니다.
- 거래 제안은 `OPEN` 상태로 생성됩니다.
- 현재 foundation에서는 수신자만 제안을 수락하거나 거절할 수 있습니다.
- 수락한 제안은 `ACCEPTED`, 거절한 제안은 `REJECTED` 상태가 됩니다.
- 이미 해결된 제안은 다시 수락/거절할 수 없습니다.
- 제안 생성 후 참가자 중 한 명이 파산한 stale proposal은 수락/거절할 수 없습니다.
- 거래 terms는 지금 단계에서 opaque object로 보존하며 core lifecycle이 자산 의미를 해석하지 않습니다.

## 의도적으로 확정하지 않은 규칙

다음 항목은 아직 제품 규칙이 확정되지 않았으므로 foundation에서 임의로 결정하지 않습니다.

- 거래 가능한 자산 종류
- 골드 포함 여부와 최소/최대 금액
- 건물이 있는 도시의 거래 허용 여부
- 한 번에 거래할 수 있는 지역 수
- 거래 제안 가능 시점
- 자신의 턴 외 거래 가능 여부
- 제안 수정 / counter offer
- 제안자 취소
- 자동 만료 / deadline
- 동시에 여러 제안 허용 여부
- 거래 수락 시 실제 골드/소유권 정산 순서

이 규칙들이 확정되기 전에는 Game Engine 상태, Supabase RPC, Realtime, UI에 거래를 연결하지 않습니다.

## 구현

- `marble-game/js/core/trade.js`
  - `createTradeProposal()`
  - `reduceTradeProposal()`
  - `TRADE_STATUS`
- `marble-game/js/core/tradeSettlement.js`
  - accepted proposal 전용 deterministic settlement
  - `offered` = 제안자가 수신자에게 주는 자산
  - `requested` = 수신자가 제안자에게 주는 자산
  - 각 측의 `propertyIds` + `gold`를 정규화
  - 정산 시 현재 소유권 / 골드 / 파산 여부를 다시 검증
  - 검증 완료 후 골드와 소유권을 하나의 결과로 계산
  - 기존 state를 직접 mutate하지 않음
- `marble-game/tests/trade.test.js`
  - 제안 생성
  - self trade / unknown player / bankrupt player 차단
  - terms immutability
  - 수신자 전용 accept/reject
  - 중복 resolve 차단
  - stale bankrupt proposal 차단
- `marble-game/tests/tradeSettlement.test.js`
  - terms 정규화
  - 빈 거래 / 중복 지역 / 양쪽 중복 지역 차단
  - property + gold 양방향 정산
  - 수락 전 정산 차단
  - stale ownership / stale balance / stale bankrupt 재검증
  - 기존 입력 state immutability

기존 `ACTION_TYPES`에 예약되어 있던 다음 액션은 유지합니다.

```text
TRADE_OFFER
TRADE_ACCEPT
TRADE_REJECT
```

이번 단계에서 이 액션들을 `tradeGameEngine.js`를 통해 Phase 7 reducer 위에 연결합니다. 기존 `gameEngine.js`와 Phase 7A 경매 reducer는 직접 수정하지 않습니다.

## 현재 settlement 경계

정산 terms는 다음 최소 형태만 해석합니다.

```text
offered:
  propertyIds: proposer → recipient
  gold: proposer → recipient

requested:
  propertyIds: recipient → proposer
  gold: recipient → proposer
```

건물이 올라간 지역(`buildingLevel > 0`)은 최종 제품 규칙이 정해질 때까지 거래를 차단합니다. 이는 최종 게임 규칙 확정이 아니라 복잡한 건물 가치/해체/그룹 규칙을 임의로 만들지 않기 위한 foundation 안전 경계입니다.

## 초기 Game Engine 거래 타이밍

현재 엔진 통합에서는 기존 구매/건설/경매와 상태가 겹치지 않도록 다음 최소 규칙을 사용합니다.

- 거래 제안은 현재 플레이어만 생성할 수 있습니다.
- 거래 제안 시점은 주사위를 굴리기 전 `WAITING_ROLL`로 제한합니다.
- 동시에 하나의 거래 제안만 열 수 있습니다.
- 거래 제안이 열려 있는 동안에는 수락/거절 또는 게임 종료 외의 일반 게임 액션을 진행하지 않습니다.
- 수신자는 현재 턴 플레이어가 아니어도 수락/거절할 수 있습니다.
- 수락/거절 후 현재 플레이어와 `WAITING_ROLL` phase를 그대로 유지합니다.
- 수락 시 현재 소유권/골드/파산 여부를 다시 검증한 뒤 deterministic settlement를 적용합니다.
- 제안 생성 시에도 현재 소유권/골드/건물 여부를 검증하여 이미 유효하지 않은 제안을 열지 않습니다.

이 정책은 거래를 구매/건설/경매 resolution과 겹치지 않게 하기 위한 초기 안전 계약입니다. 향후 실제 UX 검증 후 거래 가능 시점을 넓힐 수 있습니다.

## 구현 추가

- `marble-game/js/core/tradeGameEngine.js`
  - `reducePhase7TradingGameAction()`
  - Phase 7A reducer에 거래 lifecycle을 additive wrapper로 연결
  - `TRADE_OFFERED / TRADE_ACCEPTED / TRADE_REJECTED / TRADE_SETTLED` event 흐름
  - open trade 중 일반 액션 차단
- `marble-game/tests/tradeGameEngine.test.js`
  - 현재 플레이어 / WAITING_ROLL 제약
  - 수락 정산 / 거절 복귀
  - open trade action lock
  - stale ownership 재검증
  - improved property guard
  - 기존 Phase 7A auction delegate 회귀

## 다음 단계

```text
local runtime
→ authoritative Supabase RPC
→ Realtime / reconnect
→ UI
→ multiplayer regression
```

Phase 7A의 안정화된 구매/건설/경매/턴 흐름은 직접 수정하지 않습니다.
