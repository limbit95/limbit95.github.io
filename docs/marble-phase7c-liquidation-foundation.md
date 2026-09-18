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
- `marble-game/js/core/debtRecoveryLifecycle.js`
  - `createDebtRecoveryLifecycle()`
  - `selectDebtRecoveryAssets()`
  - `confirmDebtRecovery()`
  - `getDebtRecoverySettlement()`
- `marble-game/tests/liquidationPolicy.test.js`
  - basis point 정책 검증
  - 토지/건물 환급 분리 계산
  - 정수 floor rounding
  - building level / board drift fail-closed
- `marble-game/js/core/debtRecoverySettlement.js`
  - `settleConfirmedDebtRecovery()`
- `marble-game/js/core/liquidationGameEngine.js`
  - recoverable insolvency → DEBT_RECOVERY
  - LIQUIDATION_SELECT / LIQUIDATION_CONFIRM
  - unrecoverable insolvency → legacy bankruptcy fallback
- `marble-game/tests/debtRecoveryLifecycle.test.js`
  - OPEN / READY / CONFIRMED / IMPOSSIBLE lifecycle
  - insufficient selection guard
  - confirmed selection immutability
  - over-liquidation leftover cash
  - creditor / bank debt settlement metadata
- `marble-game/tests/debtRecoverySettlement.test.js`
  - property release + creditor full payment
  - bank debt payment
  - stale cash / ownership / building level / refund drift guard
  - bankrupt creditor guard
  - input state immutability
- `marble-game/tests/liquidationGameEngine.test.js`
  - recoverable toll debt
  - legacy reducer compatibility
  - selection / confirm settlement
  - action lock / non-debtor guard
  - unrecoverable legacy bankruptcy fallback
  - TAX / EVENT debt recovery

## 의도적으로 아직 하지 않는 것

- 기존 `gameEngine.js` 수정
- 기존 `chargePlayer()` / `settleBankruptcy()` 수정
- 새로운 turn phase 추가
- Supabase migration / RPC 추가
- Realtime 변경
- UI 추가
- 다른 테마의 매각 환급률 결정
- 기존 `gameEngine.js` payment path 연결

### Debt recovery lifecycle

`debtRecoveryLifecycle.js`는 자산 선택과 확정 흐름을 별도 immutable state machine으로 관리합니다.

```text
OPEN
→ 자산 선택
→ 부족하면 OPEN 유지
→ 충분하면 READY
→ 확정하면 CONFIRMED
```

전체 매각 후보를 사용해도 debt를 갚을 수 없으면 즉시 `IMPOSSIBLE`입니다.

자동으로 자산을 선택하거나 강제 매각하지 않습니다. 플레이어가 선택한 자산 조합이 debt를 충족할 때만 확정할 수 있습니다.

확정 시에는 아직 실제 게임 state를 변경하지 않고 다음 settlement instruction만 생성합니다.

- liquidated asset ids
- refund total
- payment amount
- creditor / reason
- payment 전 현금
- payment 후 남는 현금

### Debt recovery settlement

`debtRecoverySettlement.js`는 CONFIRMED lifecycle을 실제 게임 state 변경 결과로 변환합니다.

정산 직전에 다음을 다시 검증합니다.

- debtor가 여전히 active인지
- debtor cash가 recovery 시작 시점과 동일한지
- creditor가 있다면 여전히 active인지
- 선택 자산을 debtor가 여전히 소유하는지
- 선택 자산의 building level이 바뀌지 않았는지
- catalog refund 합계가 confirmed settlement와 동일한지

검증이 통과하면 하나의 deterministic 결과에서:

- 선택한 도시 owner를 `null`로 반환
- 해당 도시 building level을 0으로 초기화
- debtor에게 refund를 반영한 뒤 amount due 전액 지불
- creditor가 있으면 amount due 전액을 creditor에게 지급
- creditor가 없으면 TAX/EVENT payment처럼 circulation에서 제거
- 남은 cash는 debtor가 보유

생성 이벤트:

- `PROPERTY_LIQUIDATED`
- `MONEY_PAID`
- `DEBT_RECOVERED`

### Game Engine integration

`liquidationGameEngine.js`를 Phase 7B trading reducer 위의 additive wrapper로 추가합니다.

핵심 원칙:

- 기존 `reduceGameAction()`의 기본 동작은 그대로 즉시 파산 유지
- Phase 7C wrapper만 `deferDebtRecovery` option을 아래 reducer에 전달
- TOLL / TAX / EVENT TAX에서 현금 부족 시 `DEBT_PAYMENT_REQUIRED` + `DEBT_RECOVERY` pending choice 생성
- recoverable이면 플레이어가 자산을 선택할 때까지 WAITING_CHOICE 유지
- `LIQUIDATION_SELECT`로 선택 변경
- 선택 refund가 debt를 충족하면 READY
- `LIQUIDATION_CONFIRM`에서 deterministic settlement 실행 후 TURN_END
- recovery 중 일반 game action 차단
- 전체 자산을 팔아도 부족하면 동일 deterministic action을 기존 reducer로 재실행해 기존 파산 semantics 유지

이 방식으로 Phase 6/7A/7B의 기존 reducer를 전면 교체하지 않고 opt-in layer로 확장합니다.

## 다음 단계

다음 단계에서는 이 reducer를 **local Classic runtime**에 연결합니다.

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

## Authoritative RPC

Phase 7C 온라인 권위 처리는 기존 `marble_roll_dice`를 재정의하지 않습니다.

- live와 repository 정의가 일치하는 `private.marble_charge_player()`만 확장
- 현금 부족 시 Classic v1 50% 환급 catalog로 회수 가능성 계산
- 회수 가능하면 즉시 파산 대신 `DEBT_RECOVERY` pending choice 생성
- 회수 불가능하면 기존 즉시 파산 semantics 유지
- `marble_liquidation_select`
  - debtor-only
  - asset selection / refund / remaining shortfall / ready 계산
- `marble_liquidation_confirm`
  - cash / creditor / ownership / building level / refund drift 재검증
  - 선택 자산 ownership 해제 + building level 0
  - creditor가 있으면 full debt 지급
  - bank debt는 circulation에서 제거
  - `PROPERTY_LIQUIDATED / MONEY_PAID / DEBT_RECOVERED` event
- `expected_version + client_action_id` replay/idempotency 유지
- `marble_guard_debt_recovery_progress` trigger로 debt recovery 중 end-turn 등 우회 차단
- public / anon RPC 실행 권한 제거, authenticated만 허용

현재 단계에서는 online session / Realtime / UI 연결은 아직 하지 않습니다.

## Realtime / reconnect

- snapshot의 `DEBT_RECOVERY` pending choice를 immutable하게 복원합니다.
- liquidation catalog / selected asset ids도 nested immutable state로 보존합니다.
- 기존 `marble_games.version` Realtime refresh 경로를 그대로 재사용합니다.
- channel CLOSED / TIMED_OUT / ERROR 후 recovery polling에서도 latest debt recovery를 snapshot으로 복원합니다.
- `selectLiquidation / confirmLiquidation`은 기존 shared action retry를 사용해 같은 `client_action_id`로 재시도합니다.
- stale snapshot은 기존 version guard에 의해 settled state를 되돌리지 못합니다.
- 거래/경매와 동일하게 별도 liquidation Realtime channel은 만들지 않습니다.
