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
- `marble-game/tests/trade.test.js`
  - 제안 생성
  - self trade / unknown player / bankrupt player 차단
  - terms immutability
  - 수신자 전용 accept/reject
  - 중복 resolve 차단
  - stale bankrupt proposal 차단

기존 `ACTION_TYPES`에 예약되어 있던 다음 액션은 유지합니다.

```text
TRADE_OFFER
TRADE_ACCEPT
TRADE_REJECT
```

이번 foundation에서는 이 액션들을 아직 Game Engine에 연결하지 않습니다.

## 다음 단계

제품 규칙을 먼저 확정한 뒤 다음 순서로 진행합니다.

```text
Trade asset/turn rules
→ deterministic settlement
→ local runtime
→ authoritative Supabase RPC
→ Realtime / reconnect
→ UI
→ multiplayer regression
```

Phase 7A의 안정화된 구매/건설/경매/턴 흐름은 이 foundation에서 변경하지 않습니다.
