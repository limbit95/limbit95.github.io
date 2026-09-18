# Marble Phase 7C — Debt Recovery / Asset Liquidation Foundation

Phase 7C는 **현금 부족 시 즉시 파산하기 전에 보유 자산을 정리해 지불 가능성을 회복하는 단계**입니다.

현재 Classic Core의 `chargePlayer()`는 지불액보다 현금이 부족하면 곧바로 `settleBankruptcy()`를 호출합니다. 이 foundation은 그 기존 경로를 아직 수정하지 않고, debt recovery 규칙을 독립 모듈로 먼저 고정합니다.

## 이번 foundation에서 확정하는 것

### Debt recovery case

`createDebtRecoveryCase()`는 다음을 계산합니다.

- debtor player
- amount due
- creditor
- reason
- 현재 현금
- 부족액(shortfall)
- 현재 보유 자산 목록
- 각 자산의 현재 building level

현금이 이미 지불액을 충족하면 debt recovery를 만들지 않습니다.

보유 자산이 하나도 없으면 recovery 상태는 즉시 `IMPOSSIBLE`입니다.

### Liquidation catalog

`createLiquidationCatalog()`는 자산별 환급액을 명시적으로 받습니다.

예:

```text
singapore → 70 gold
seoul     → 180 gold
```

중요한 점은 **foundation이 환급액을 계산하지 않는다는 것**입니다.

현재 제품 규칙에는 다음 공식이 아직 없기 때문입니다.

- 도시 가격의 몇 %를 돌려주는가
- 건물 투자액을 얼마만큼 환급하는가
- 건물이 있는 도시를 통째로 매각하는가
- 건물을 먼저 철거해야 하는가

따라서 foundation은 외부 정책이 계산한 refund만 검증하고 사용합니다.

### Liquidation value policy engine

후속 stacked 단계에서 `liquidationPolicy.js`를 추가해 **환급률 숫자 자체가 아니라 계산 방식**을 고정합니다.

- 토지 원가와 건물 투자액을 분리해 계산
- 각 환급률은 0~10000 basis point 정수로 주입
- 골드 결과는 `FLOOR` 정수 반올림으로 결정
- Classic 실제 환급률은 theme rule로 별도 주입 가능

### Classic v1 liquidation policy

Classic 첫 적용 규칙은 다음으로 고정합니다.

- 도시 원가 환급: **50%**
- 누적 건설비 환급: **50%**
- 계산 단위: basis point `5000 / 10000`
- 결과 골드: 소수점 버림(`FLOOR`)

예를 들어 싱가포르(도시 원가 260, 건설비 130)에 건물 2단계가 있다면:

```text
도시 환급 130
+ 건설 투자 260의 50% = 130
= 총 260 골드
```

이 비율은 Classic v1 밸런스 규칙이며, 계산 엔진과 분리되어 있어 후속 밸런싱에서 비율만 변경할 수 있습니다.

### Liquidation plan

`evaluateLiquidationPlan()`은 선택한 자산들의 refund를 합산해 다음을 계산합니다.

- 매각 환급 총액
- 매각 후 사용 가능한 현금
- 남은 부족액
- 현재 선택으로 debt를 갚을 수 있는지

`canDebtBeRecovered()`는 전체 매각 후보를 사용해도 지불 가능 여부가 있는지 판단합니다.

## 구현 파일

- `marble-game/js/core/liquidation.js`
  - `createDebtRecoveryCase()`
  - `createLiquidationCatalog()`
  - `evaluateLiquidationPlan()`
  - `canDebtBeRecovered()`
  - `DEBT_RECOVERY_STATUS`
- `marble-game/js/core/liquidationPolicy.js`
  - `createLiquidationValuePolicy()`
  - `calculatePropertyLiquidationRefund()`
  - `createBoardLiquidationCatalog()`
- `marble-game/tests/liquidation.test.js`
  - 부족액 계산
  - 보유 자산 추출
  - 자산 없음 → IMPOSSIBLE
  - 외부 refund catalog 검증
  - unowned / duplicate / invalid refund 차단
  - 선택 자산으로 debt 충족 여부 계산
  - 기존 state 비변경 확인
- `marble-game/tests/liquidationPolicy.test.js`
  - basis point 정책 검증
  - 토지/건물 환급 분리 계산
  - 정수 floor rounding
  - building level / board drift fail-closed

## 의도적으로 아직 하지 않는 것

- 기존 `gameEngine.js` 수정
- 기존 `chargePlayer()` / `settleBankruptcy()` 수정
- 새로운 turn phase 추가
- Supabase migration / RPC 추가
- Realtime 변경
- UI 추가
- 다른 테마의 매각 환급률 결정
- creditor settlement 변경
- 실제 property ownership 해제

## 다음 설계 결정

다음 단계에서 먼저 아래 두 가지를 결정합니다.

1. **Debt recovery lifecycle**
2. **실제 property ownership 해제 및 payment settlement 순서**

이 두 규칙을 고정한 뒤:

```text
liquidation policy
→ debt recovery Game Engine integration
→ local runtime
→ authoritative RPC
→ Realtime / reconnect
→ UI
→ multiplayer regression
```

순서로 진행합니다.

Phase 7A 경매와 Phase 7B 거래의 기존 서버 권위 / version / idempotency 원칙은 그대로 유지합니다.
