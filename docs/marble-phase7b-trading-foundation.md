# Marble Phase 7B — Trading Foundation

Phase 7B는 Classic Advanced Gameplay의 거래/협상 단계입니다.

Phase 7B는 거래 lifecycle과 deterministic settlement, 서버 권위 RPC, Realtime·재접속, 온라인 UI, 멀티플레이 회귀 검증까지 완료했고 현재 **최종 main 통합 검증** 단계입니다.

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

확정되지 않은 counter offer / 제안자 취소 / 자동 만료 / 건물 포함 거래 등은 여전히 임의로 추가하지 않습니다. 현재 서버 권위 단계는 이미 확정한 pre-roll 거래와 property/gold 정산 계약만 구현합니다.

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

## Local runtime 연결

`createLocalClassicSession()`은 기존 API를 유지하면서 다음 거래 메서드를 additive하게 제공합니다.

- `offerTrade(recipientPlayerId, terms, offerId)`
- `acceptTrade(playerId)`
- `rejectTrade(playerId)`

로컬 세션 역시 `reducePhase7TradingGameAction()`을 사용하므로 Game Engine과 동일한 pre-roll 거래 규칙, open trade action lock, deterministic settlement를 따릅니다.

회귀 테스트에서는 기존 구매/경매 흐름을 유지하면서 실제 로컬 세션에서 지역 + 골드 거래의 수락/거절을 검증합니다.

## Authoritative Supabase RPC

온라인 거래는 기존 Marble action contract를 그대로 사용합니다.

- `expected_version`으로 stale client action 차단
- `client_action_id`로 retry / replay idempotency 유지
- `offer_id`를 거래 accept/reject 요청에도 포함하여 다른 거래에 동일 action id가 재사용되는 것을 방어
- room / game / player / property row lock 후 현재 상태 재검증
- `marble_games.pending_trade`를 authoritative 거래 상태로 사용
- snapshot에 `pendingTrade`를 포함해 reconnect 시 이벤트 재생 없이 복원 가능
- `marble_trade_offer / marble_trade_accept / marble_trade_reject` RPC만 신규 추가
- 기존 `marble_roll_dice`는 live/repository drift를 보존하기 위해 재정의하지 않음
- open trade 중 phase/current seat/pending choice/last roll 진행을 DB trigger가 `TRADE_PENDING`으로 차단
- public / anon RPC 실행 권한은 제거하고 authenticated만 허용

거래 수락 시 property ownership과 양쪽 gold를 같은 DB transaction에서 정산하고, 현재 ownership / balance / bankrupt / building 상태를 다시 확인합니다.

운영 Supabase에는 이 단계에서 바로 적용하지 않고, repository migration을 isolated Game DB integration에서 먼저 검증합니다.

## Realtime / reconnect

- snapshot의 `pendingTrade`를 immutable state로 복원합니다.
- 기존 `marble_games.version` Realtime refresh 경로를 재사용합니다.
- channel recovery polling에서도 open trade를 authoritative snapshot으로 복원합니다.
- offer / accept / reject는 기존 shared action retry와 동일한 `client_action_id`를 유지합니다.

## Online UI

- 현재 플레이어의 `WAITING_ROLL`에서 거래 작성 패널을 노출합니다.
- 활성 상대 플레이어를 선택하고 건물이 없는 소유 도시와 골드를 양방향 조건으로 구성합니다.
- open trade는 모든 활성 플레이어에게 표시하되 수신자만 수락/거절할 수 있습니다.
- UI는 소유권/골드를 직접 변경하지 않고 online session RPC만 호출합니다.

## Multiplayer regression

3개 온라인 세션을 공유 authoritative backend에 연결해 다음 흐름을 검증합니다.

- 제안자의 거래 생성과 다른 클라이언트 Realtime 전파
- 수신자만 수락/거절할 수 있는 UI 상태
- 수락 시 양쪽 골드와 지역 소유권의 동일 결과 전파
- 거절 시 자산 상태 불변
- 오래된 snapshot이 최신 정산 결과를 되돌리지 못하는지 확인
- 재접속 시 open trade를 snapshot만으로 복원
- expected version / client action id / offer id 계약 유지

## 현재 상태

Phase 7B 구현과 단계별 회귀 검증은 완료되었습니다.

```text
trade lifecycle
→ deterministic settlement
→ Game Engine integration
→ local runtime
→ authoritative Supabase RPC
→ Realtime / reconnect
→ online UI
→ multiplayer regression
→ 최종 main 통합 검증
```

main 반영은 최종 integration PR의 정적/DB 통합 검증을 확인한 뒤 사용자 명시 승인에 따라 진행합니다.

Phase 7A의 안정화된 구매/건설/경매/턴 흐름과 기존 roll RPC는 직접 수정하지 않습니다.
