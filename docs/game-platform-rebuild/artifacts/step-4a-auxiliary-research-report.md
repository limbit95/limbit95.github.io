# STEP 4A — Q01~03 선택 보조 조사 원본 보고서

- **대상**: 청파 같이 Game Platform vNext STEP 4A
- **조사 범위**: Q01 취소·늦은 완료 / Q02 반복 dispose·자원 소유 / Q03 역할·auth 전환과 private view 수명
- **입력 기준**: `step-4a-auxiliary-research-input.md`, `step-4a-auxiliary-research-request.md`
- **조회일**: 2026-10-02 (Asia/Seoul)
- **상태**: `AUXILIARY_RESEARCH_COMPLETE`
- **중요**: 이 문서는 STEP 4A 정식 계약이 아니며 Work Astra의 핵심 판단 완료를 뜻하지 않는다. 새 플랫폼 책임 소유자, API, 필드, 모델, 백엔드, 물리 경로를 확정하지 않는다. 저장소의 현재 구현 안전성 또는 지원 완료도 판정하지 않는다.

---

## 0. 조사 범위와 전제

입력 문서의 고정 맥락을 그대로 따른다.

- 승인 integration 기준은 `ad7655a051f0dbb13444eec6f469f6f98f9794f4`이며 STEP 3은 완료 상태다.
- 이번 조사는 STEP 3의 X01~07을 전면 재조사하지 않고, 그 근거가 직접 다루지 못한 Q01~03만 보완한다.
- T01~T03의 핵심은 단순한 `roomId`/version 비교만이 아니라 **현재 실행 맥락**, **순서**, **역할·view 권한**, **자원 소유 수명**을 구분해야 한다는 점이다.
- 입력에 포함된 코드 발췌는 현재 사실의 예시일 뿐 목표 API나 안전 인증으로 사용하지 않는다.
- 공식 표준 또는 공식 표준 발행처 문서만 직접 주장 근거로 사용했다.
- 조사 결과는 **확인된 사실 / 플랫폼 적용 추론 / 미확인 / Work Astra 질문**으로 분리한다.

### 핵심 요약

| 질문 | 직접 확인된 핵심 | 플랫폼 적용 시 가능한 추론 | 남는 핵심 미확인 |
|---|---|---|---|
| Q01 취소·늦은 완료 | `AbortSignal`은 취소 의사를 전달하지만 관찰 API가 이를 무시할 수 있다. Fetch는 이미 fulfilled된 Promise를 abort 시 다시 reject하지 않는다. settled Promise의 reaction callback은 별도 Job으로 enqueue된다. | **취소 요청 성공 여부와 완료 결과의 현재 맥락 채택 가능 여부는 별도 판단 축**으로 보는 것이 안전하다. | 브라우저 abort가 서버 측 작업/transaction/commit을 실제로 중단·rollback한다는 일반 보장은 확인되지 않았다. |
| Q02 반복 dispose·자원 소유 | 동일 `AbortSignal`의 반복 abort는 no-op이고, `removeEventListener`는 일치하는 listener가 있을 때만 제거한다. | 반복 정리를 안전하게 만들려면 **정리 대상의 정확한 소유자/identity와 현 실행 자원을 분리**해야 한다. | 프로젝트 정의 `dispose()` 전체가 idempotent하다는 일반 표준 보장은 없다. cleanup 중 예외·부분 초기화의 정책도 미확정이다. |
| Q03 역할/auth·private view | OAuth BCP는 resource server가 각 request의 허용 범위를 검증하도록 요구한다. HTTP `private`은 private cache 저장을 허용하고, `no-store`조차 privacy 전체를 보장하지 않는다. | 서버의 **현재 제공 권한**과 client의 **이미 받은 callback/cache를 현재 view에 표시·병합·재사용할 권한**은 별도 수명으로 보는 근거가 있다. | 같은 room/match/version에서 role만 바뀔 때 client view lifetime을 무엇으로 식별할지, role 복귀 시 과거 private data를 재사용할지 여부는 표준이 결정하지 않는다. |

---

# 1. Q01 — 취소 요청 vs 실제 작업 중단 vs 완료 결과 채택 무효화

## 1.1 비교표

| 조사 포인트 | 확인된 사실 | 플랫폼 적용 추론 | 미확인 / 한계 | Work Astra에게 넘길 질문 | 근거 |
|---|---|---|---|---|---|
| Abort의 의미 | WHATWG DOM은 `AbortController`/`AbortSignal`을 작업 취소 의사 전달 메커니즘으로 정의한다. 그러나 signal을 관찰하는 API는 이미 작업이 끝난 경우 등 abort를 무시할 수 있다고 명시한다. 동일 signal이 이미 aborted면 다시 signal abort 하는 단계는 즉시 return한다. | `abort()` 호출 사실만으로 “underlying 작업이 반드시 중단됐다”고 간주하면 안 된다. | 각 API가 실제 I/O·서버 처리까지 어디까지 중단하는지는 API별 정의가 필요하다. | STEP4A 계약에서 cancellation을 **best-effort transport/control**로 볼지, 결과 채택 권한과 어떻게 분리할지? | S01 직접 확인 |
| Fetch abort | Fetch Standard는 abort 시 fetch Promise를 reject하고 request/response body를 cancel/error 처리한다. 하지만 fetch Promise가 이미 fulfilled된 경우 reject는 no-op이다. | 늦게 호출된 abort는 이미 성공 결과가 존재하는 상태를 되돌리지 못할 수 있다. | Fetch abort가 원격 서버의 이미 실행·commit된 mutation을 rollback한다는 문구는 확인되지 않았다. | action 요청을 abort했더라도 서버 결과가 존재할 수 있다는 전제로 client 채택 규칙을 별도 둘 것인가? | S02 직접 확인 |
| Promise settled 이후 callback | ECMA-262는 fulfilled/rejected Promise에 `then`이 붙으면 corresponding reaction Job을 enqueue하도록 정의한다. Promise는 settled 이후 다시 resolve/reject하려 해도 상태가 바뀌지 않는다. | 이미 settled된 Promise 또는 이미 enqueue된 reaction의 callback 실행 가능성과, callback이 **현재 실행에 side effect를 적용할 수 있는지**는 별도 문제다. | ECMAScript Promise 자체에는 application “generation/room/auth context” 개념이 없다. | callback entry 시점과 side-effect apply 시점 중 어디에서 current context 검증을 요구할지? | S03 직접 확인 |
| 취소 실패/미지원 | DOM 표준 자체가 API가 abort를 무시할 수 있음을 인정한다. | cancellation이 실패·미지원이어도 old completion이 새 실행을 오염하지 않게 하려면 **result adoption gate**가 cancellation과 독립적으로 필요하다는 추론이 가능하다. | gate의 구체 key, field, owner, API 형태는 이번 조사 범위 밖이다. | “취소 가능” capability가 없는 모델에서도 동일한 stale-result rejection 원칙을 둘지? | S01 + 플랫폼 추론 |
| 서버 commit과 client 결과 | 선택한 브라우저/JS 표준은 server-side transaction commit/rollback 의미를 정의하지 않는다. | client가 결과를 버리는 것과 server mutation을 되돌리는 것은 별도 책임으로 봐야 한다. | 특정 백엔드의 cancellation/rollback 보장은 조사하지 않았다. | action의 client stale reject와 server authoritative state reconciliation을 어떤 책임 경계로 나눌지? | 직접 근거 부족 → 미확인 |

## 1.2 확인된 사실

### F-Q01-1 — Abort는 “취소 요청/신호”이지 보편적 중단 보장이 아니다

WHATWG DOM Living Standard는 `AbortSignal`의 변화가 controller의 의사를 나타내지만, 이를 관찰하는 API가 무시할 수도 있다고 설명한다. 예시로 “operation has already completed”를 든다.

또한 이미 aborted인 signal에 다시 abort를 signal하는 단계는 바로 return한다. 따라서 같은 signal에 대한 반복 abort는 표준 알고리즘상 추가 중단 효과를 발생시키지 않는다.

**범위 한계:** 이것은 AbortSignal의 일반 의미다. 특정 네트워크 요청, database RPC, worker, timer, custom Promise 작업이 실제로 중단되는 정도는 해당 API가 별도로 정의해야 한다.

### F-Q01-2 — Fetch는 이미 fulfilled된 Promise를 abort로 되돌리지 않는다

Fetch Standard의 “To abort a `fetch()` call” 절은 abort 시 Promise reject를 수행하지만, **Promise가 이미 fulfilled되었다면 no-op**이라고 명시한다. 이후 request body cancel, response body error 처리가 이어진다.

따라서 최소한 Fetch 수준에서도 다음 셋은 동일하지 않다.

1. abort가 요청됨
2. underlying 작업이 실제로 멈춤
3. 이미 만들어진/전달된 완료 결과가 사라짐

### F-Q01-3 — settled Promise의 callback 실행은 별도 Job이다

ECMAScript 2026의 `PerformPromiseThen`은 Promise가 fulfilled/rejected 상태이면 해당 reaction을 위한 Promise Job을 enqueue한다. 즉, “Promise가 이미 settled되었다”는 사실은 callback이 실행되지 않는다는 뜻이 아니다.

ECMAScript는 동시에 Promise가 resolved 이후 다시 resolve/reject되어도 상태가 변하지 않는다고 정의한다. 이는 **Promise settlement 자체의 불변성**이고, application callback이 UI/state에 무엇을 적용할 수 있는지는 별도 application 규칙이다.

## 1.3 플랫폼 적용 추론 — 정식 계약 아님

다음은 표준에서 직접 명령하는 플랫폼 계약이 아니라, T01/T02 맥락에 적용 가능한 추론이다.

- cancellation은 **old work를 줄이는 수단**일 수 있지만, **old result가 current state에 채택되는 것을 막는 유일 수단**으로 의존하기 어렵다.
- old request가 취소되지 않거나, 이미 settled되었거나, 서버가 이미 처리했더라도 client side effect를 적용하기 직전에 **현재 실행 맥락인지 판단하는 별도 조건**이 필요할 가능성이 높다.
- “발행 시점에 옛 요청이었다”와 “완료 시점의 결과가 현재 authoritative state를 재조회한 것”은 구분해야 한다. 입력 T01이 지적한 것처럼, old-originated flow라도 완료 결과의 의미가 현재 상태를 새로 반영한다면 자동 폐기 규칙은 과도할 수 있다.
- `success/error/null/finally` 각각이 side effect를 낼 수 있으므로 result object만이 아니라 error/busy/connection indicator 같은 completion-side effect도 동일한 현재성 문제를 가진다.

## 1.4 미확인

- Abort가 특정 백엔드 RPC의 이미 진행 중인 서버 mutation을 실제 중단하는지
- abort 시 server transaction이 rollback되는지
- server commit 이후 client abort가 의미 있는 보상 동작을 발생시키는지
- 어떤 completion은 current context에서 재사용 가능하고 어떤 completion은 반드시 폐기해야 하는지의 정식 판별 규칙
- `matchId`, epoch, generation 등 어떤 구체 식별자를 필수화할지

## 1.5 Work Astra 전달 질문

1. STEP4A에서 **cancellation capability**와 **completion adoption authority**를 별도 책임으로 명문화할 것인가?
2. stale 판단은 request 발행 시점 identity만 볼 것인가, 완료 결과의 semantic freshness/authoritative re-read 여부까지 볼 것인가?
3. success뿐 아니라 error/finally/loading/connection UI side effect에도 같은 current-context gate를 적용할 것인가?
4. server-side mutation이 이미 commit된 경우 client 결과 폐기와 authoritative reconciliation을 어떻게 구분할 것인가?
5. cancellation 미지원 모델도 지원해야 한다면, stale result rejection은 Core 수준인지 선택 capability인지?

---

# 2. Q02 — 반복 dispose, 부분 초기화·정리 예외, 자원 소유

## 2.1 비교표

| 조사 포인트 | 확인된 사실 | 플랫폼 적용 추론 | 미확인 / 한계 | Work Astra에게 넘길 질문 | 근거 |
|---|---|---|---|---|---|
| 반복 abort | DOM의 `signal abort` 알고리즘은 이미 aborted면 즉시 return한다. | 특정 cleanup primitive는 반복 호출을 안전하게 흡수할 수 있다. | 이것이 임의의 project `dispose()` 전체 idempotence를 보장하지 않는다. | Core가 disposer 자체 idempotence를 요구할지, caller가 once-only를 보장할지? | S01 직접 확인 |
| listener 정리 | `removeEventListener`는 동일 type/callback/capture listener가 존재할 때만 제거한다. 없다면 제거 단계가 실행되지 않는다. `addEventListener`에 AbortSignal을 연결하면 signal abort 시 해당 listener가 제거된다. | 정리는 “현재 존재하는 정확한 resource identity”에 한정할수록 이전 cleanup이 새 실행 resource를 건드릴 위험을 줄일 수 있다. | DOM listener identity 규칙을 subscription/RPC/timer 전체에 일반화할 수는 없다. | ownership token/handle을 어떤 계층이 소유하고, 교체 시 이전 handle만 정리하도록 할지? | S04 직접 확인 |
| 부분 초기화 | 선택한 표준은 project-specific `start()` 도중 일부 자원만 생성된 상태의 generic disposer 계약을 제공하지 않는다. | cleanup은 “생성 성공한 자원만 추적”하고 missing resource cleanup을 허용하는 쪽이 복구에 유리하다는 추론은 가능하다. | 정식 초기화 순서, rollback stack, owner 구조는 미정이다. | partial init 실패 시 어떤 owner가 이미 획득한 resource를 정리할 책임을 가지는가? | 직접 근거 부족 → 미확인 |
| cleanup 예외 | DOM의 listener removal/abort 알고리즘 자체는 특정 no-op 조건을 갖지만, project cleanup callback이 던지는 예외를 전체 dispose가 어떻게 다룰지는 정의하지 않는다. | 하나의 cleanup 실패가 다른 자원 cleanup을 막지 않게 할지, 오류를 수집/전파할지 별도 정책이 필요하다. | 이번 조사에서는 범용 disposer framework를 채택하거나 추천하지 않았다. | cleanup error policy가 fail-fast인지 best-effort-all인지? error가 current run UI를 오염시킬 수 있는지? | 미확인 |
| old vs new resource ownership | DOM listener 제거는 정확한 callback/type/capture matching을 요구한다. | “A 실행이 만든 resource handle”과 “B 실행이 만든 resource handle”을 구별할 수 있어야 A cleanup이 B resource를 해제하지 않는다는 규칙을 세울 수 있다. | 구체 generation/owner 객체/field는 정하지 않는다. | owner lifetime을 room, match, view/auth, runtime instance 중 무엇과 결합할지? | S04 + 플랫폼 추론 |
| async 작업과 dispose | AbortSignal은 이미 완료된 작업에서 무시될 수 있고, Promise reaction은 settled 이후에도 enqueue될 수 있다. | dispose는 새 callback 등록/구독 해제와 old async result adoption을 동시에 해결한다고 가정하면 안 된다. | project async operation의 실제 cancellation semantics 미확정. | dispose contract에 “future callbacks must be ignored”를 직접 포함할지 별도 adoption contract로 둘지? | S01 + S03 |

## 2.2 확인된 사실

### F-Q02-1 — 반복 cleanup이 안전한 것은 “특정 primitive의 정의”일 뿐이다

`AbortSignal`은 이미 aborted면 다시 signal abort 할 때 return한다. 이 primitive는 반복 abort에 대해 명시적인 no-op 경로가 있다.

그러나 이 사실만으로 `coordinator.dispose()`, subscription unsubscribe 함수, custom timer cleanup, transport close 등 **프로젝트 전체의 dispose 동작이 반복 안전하다**고 결론낼 수는 없다.

### F-Q02-2 — EventTarget cleanup은 정확한 listener identity를 기준으로 한다

WHATWG DOM의 `removeEventListener`는 event listener list 안에 같은 `type`, `callback`, `capture`를 가진 listener가 있을 때만 제거한다. 따라서 이미 제거된 동일 listener를 다시 제거해도 새 listener를 임의로 제거하지 않는다.

또한 `addEventListener`에 `AbortSignal`을 연결하면 그 signal이 aborted될 때 해당 listener가 제거된다.

이 사례가 주는 일반적 의미는 **cleanup 대상이 어떤 owner가 생성한 어떤 resource인지 정확히 식별하는 것이 중요하다**는 정도다. 이를 프로젝트 subscription/RPC 전체의 공식 API 형태로 승격할 근거는 아니다.

### F-Q02-3 — dispose와 async completion 채택은 다른 문제다

Q01 근거와 결합하면, listener/subscription을 제거하거나 abort를 signal해도 이미 완료됐거나 이미 scheduled된 async reaction까지 자동으로 “현재 실행에 적용 불가능” 상태로 만드는 보편적 보장은 없다.

따라서 “dispose가 불렸다”는 사실과 “그 실행에서 시작된 모든 미래 completion side effect가 새 실행에 적용되지 않는다”는 보장은 별도 검토 대상이다.

## 2.3 플랫폼 적용 추론 — 정식 계약 아님

- **idempotent cleanup**을 요구하려면 어떤 수준이 idempotent해야 하는지 구분해야 한다.
  - 동일 primitive handle에 대한 반복 cleanup
  - owner 전체 dispose 반복
  - start가 절반만 끝난 상태에서 dispose
  - dispose 도중 일부 cleanup이 실패한 뒤 재호출
- old owner가 가지고 있던 unsubscribe/listener/request handle을 변수 하나로 덮어쓰는 구조는, ownership이 섞이면 이전 dispose가 새 resource를 닫을 위험이 있다. 따라서 **old owner가 old handle만 닫는 구조**가 필요하다는 추론이 가능하다.
- listener/subscription cleanup은 **future event source 연결을 끊는 문제**, async completion adoption은 **이미 발생한 결과를 현재 state에 반영할 수 있는지의 문제**이므로 별도 축으로 다루는 것이 자연스럽다.
- `null`/부분 초기화 resource를 cleanup해도 안전한지, cleanup 한 개가 throw해도 나머지를 계속할지 등은 project contract가 정해야 한다.

## 2.4 미확인

- 현재 `stop()`/`dispose()`가 실제로 반복 호출 안전한지
- dispose 도중 cleanup 하나가 throw할 때 이후 cleanup이 계속되는지
- `start()`가 중간 실패한 경우 획득한 자원들의 rollback 책임
- old request의 AbortController/subscribe handle을 새 실행이 재사용하는지 여부
- unsubscribe 함수가 자체적으로 idempotent한지
- 자원 소유 lifetime을 room / match / view-auth / browser runtime 중 어디에 매핑할지

## 2.5 Work Astra 전달 질문

1. resource owner를 “한 실행 인스턴스가 획득한 handle 집합”으로 보는 정식 책임이 필요한가?
2. `dispose()` 반복 호출을 반드시 no-op-safe하게 요구할지, once-only invocation을 caller invariant로 둘지?
3. partial initialization 실패를 위한 cleanup 책임과 순서를 Core에 둘지 adapter/local에 둘지?
4. cleanup 하나의 예외가 나머지 cleanup을 중단해야 하는가, 계속 시도한 뒤 오류를 합성해야 하는가?
5. dispose 이후 늦은 Promise completion의 **채택 금지**를 disposer 책임에 넣을지, 별도 current-context guard 책임에 둘지?
6. A→B→A 전환에서 A1 owner와 A2 owner를 같은 room identity만으로 동일 취급하지 않도록 어떤 수명 개념이 필요한가?

---

# 3. Q03 — 역할/auth 전환과 private view 수명

## 3.1 비교표

| 조사 포인트 | 확인된 사실 | 플랫폼 적용 추론 | 미확인 / 한계 | Work Astra에게 넘길 질문 | 근거 |
|---|---|---|---|---|---|
| 서버 정보 제공 권한 | OAuth 2.0 Security BCP는 access token을 resource/action에 제한하고, resource server가 **각 request마다** 그 request의 resource/action에 허용된 token인지 검증하도록 요구한다. | private 정보 제공 여부는 “같은 room/match/version”만으로 결정되지 않고 **현재 authorization context**가 별도일 수 있다. | OAuth를 플랫폼에 채택하라는 의미가 아니다. 프로젝트의 실제 auth 모델은 조사하지 않았다. | 서버 snapshot/action 응답 생성 시 현재 role/view 권한을 어느 계층이 검증할지? | S05 부분 확인 |
| 권한 철회 | RFC 7009에서 token revocation은 즉시 invalidation을 목표로 하지만 propagation delay가 있을 수 있다고 명시한다. | 권한 변화는 시스템 전역에 원자적으로 즉시 보인다고 가정하면 안 되는 사례가 있다. | 프로젝트 role 전환이 OAuth token revocation으로 구현된다는 뜻이 아니다. | role/auth 변경 직후 in-flight request와 이미 응답된 payload의 처리 원칙은? | S06 부분 확인 |
| HTTP private cache | RFC 9111의 `private`은 shared cache 저장을 금지하지만 private cache 저장은 허용한다. `private`은 message content privacy 자체를 보장하지 않는다. | “private 응답이었다”는 사실만으로 client가 role 전환 뒤 해당 representation을 재사용하지 않는다고 보장할 수 없다. | 브라우저 application memory/custom cache는 HTTP cache와 동일하지 않다. | private view cache의 retention/reuse policy를 HTTP cache와 별도로 정의할지? | S07 직접/부분 |
| HTTP no-store | `no-store`는 standard cache가 request/response를 저장·재사용하지 않도록 요구하지만, RFC 자체가 privacy를 보장하는 충분한 메커니즘이 아니라고 명시한다. | sensitive view에 no-store가 있어도 이미 callback 변수나 application memory에 전달된 payload까지 회수된다고 볼 수 없다. | arbitrary JS memory wipe, malicious client, screenshot/observer 등은 이 RFC가 보장하지 않는다. | client private data의 clear-on-role-change를 어느 수준까지 “best effort”로 정의할지? | S07 직접/부분 |
| 같은 room/match/version 역할 전환 | 선택 표준들은 app의 room/match/version을 알지 못한다. 반면 authorization과 cached representation 수명은 별도 개념으로 정의된다. | T03처럼 room/match/version이 그대로여도 participant→spectator 전환은 private callback/cache의 채택 권한을 바꿀 수 있다는 추론이 가능하다. | 구체 auth epoch/version field를 필수화할 근거는 없다. | view/auth lifetime을 별도 identity로 둘 필요가 있는지? 있다면 필수 semantic invariant는 무엇인지? | S05 + S07 + 추론 |
| 역할 복귀 | 표준은 role 복귀 시 과거 private view를 다시 신뢰해도 되는지 결정하지 않는다. | 이전에 적법하게 받은 data라도 재진입 시 freshness와 authorization을 다시 확인해야 할 가능성이 있다. | 재사용 허용 여부는 게임/보안 정책에 달려 있다. | spectator→participant 복귀 시 old private cache reuse, clear, refetch 중 무엇을 요구할지? | 미확인 |
| 과거 비밀 회수 | RFC 7009는 앞으로 token을 쓰지 못하게 하는 revocation을 정의하고, RFC 9111은 cache-control이 privacy 전체를 보장하지 않는다고 명시한다. | 이미 적법하게 client에 전달된 bytes를 나중에 완전히 “회수”한다고 약속할 근거가 없다. 악의적 client까지 포함한 회수 보장은 하지 않아야 한다. | client가 이미 복사·기록한 데이터 삭제 보장은 확인되지 않았다. | 계약 문구를 “future disclosure/reuse 방지”와 “past disclosure 회수 불가”로 분리할지? | S06 + S07 |

## 3.2 확인된 사실

### F-Q03-1 — 서버의 현재 제공 권한은 request 시점의 authorization 문제다

RFC 9700은 OAuth 맥락에서 resource server가 access token이 **특정 resource와 action에 쓰일 수 있는지 매 request마다 검증**하도록 요구한다.

이것을 프로젝트에 OAuth 도입 권고로 사용하지 않는다. 다만 “한 번 인증됐으니 동일 room/match의 후속 응답은 계속 허용”이라는 보편 가정과 반대로, **서버 제공 권한은 요청 시점마다 변할 수 있는 별도 조건**이라는 공식 사례다.

### F-Q03-2 — 권한 철회는 future use를 제한해도 전파 지연이 존재할 수 있다

RFC 7009는 token revocation 후 token을 다시 쓸 수 없다고 규정하지만, 실제로 일부 서버가 invalidation을 아직 알지 못하는 propagation delay가 있을 수 있음을 명시한다.

따라서 권한 전환이 분산된 시스템 전체에서 완벽히 동시적이라고 일반화할 수 없다.

### F-Q03-3 — `private` cache는 “한 사용자용”이지 “저장 금지”가 아니다

RFC 9111은 `Cache-Control: private`이 shared cache에는 저장을 금지하지만 **private cache에는 저장을 허용**할 수 있다고 명시한다. 또한 `private`이라는 단어는 저장 위치를 통제하는 의미이며 message content의 privacy 자체를 보장하지 않는다고 설명한다.

따라서 private view를 반환했다는 사실만으로 역할 전환 후 client-side reuse가 자동 차단된다고 볼 수 없다.

### F-Q03-4 — `no-store`도 과거 비밀의 완전 회수 보장은 아니다

RFC 9111의 `no-store`는 표준 cache가 request/response를 저장하지 않고 다른 request에 재사용하지 않도록 강하게 제한한다. 하지만 같은 절에서 이것이 privacy를 보장하는 reliable/sufficient mechanism이 아니라고 명시한다.

이 자료는 **이미 application code에 전달된 payload, 메모리 복사본, 악의적 client가 보관한 정보**를 소급 제거한다는 보장을 제공하지 않는다.

## 3.3 플랫폼 적용 추론 — 정식 계약 아님

T03에 적용하면 다음 구분이 필요하다는 근거가 생긴다.

### A. 서버 제공 권한

- 해당 request 시점에 이 actor/role이 private field를 받을 수 있는가
- role 전환이 서버 authoritative state에 반영되었는가
- action/snapshot 생성 시 현재 authorization을 다시 평가하는가

### B. client 채택 권한

- response가 발행될 때는 허용됐더라도 callback이 도착한 현재 시점에도 표시 가능한가
- participant 상태에서 시작된 private callback이 spectator 상태에서 도착하면 폐기해야 하는가
- cached private state를 public view에 merge하지 않도록 어떤 current-view 검사가 필요한가

### C. client 보관·재사용 수명

- role 변경 시 private cache를 clear할 것인가
- role을 되돌렸을 때 예전 private cache를 다시 사용해도 되는가
- 현재 authorization이 복원돼도 data freshness가 보장되는가

이 셋은 같은 질문이 아니다.

특히 **roomId/matchId/version이 동일하다는 사실만으로 view authorization이 동일하다고 결론낼 수 없다.** 반대로 이번 조사만으로 새로운 `authEpoch` 같은 구체 필드를 필수화할 수도 없다. 필요한 것은 우선 semantic lifetime을 Astra가 판단하는 것이다.

## 3.4 미확인

- 현재 프로젝트의 participant/spectator 권한 검증 위치
- role 변경의 authoritative source와 propagation 방식
- private snapshot/action response에 HTTP caching directive가 실제로 적용되는지
- application memory/cache clear 정책
- role 복귀 시 이전 private payload 재사용 가능 여부
- same room/match/version 안에서 view authorization 변화의 정식 identity
- malicious client가 이미 취득한 비밀의 삭제/회수 보장

## 3.5 Work Astra 전달 질문

1. STEP4A에서 **server disclosure authorization**과 **client adoption authorization**을 별도 책임으로 명문화할 것인가?
2. room/match/version과 독립적인 **view/auth lifetime semantic**이 필요한가?
3. participant→spectator 시 이미 in-flight인 private response는 어떤 조건에서 폐기해야 하는가?
4. private callback/cache의 merge 전에 현재 role/view를 재검증하도록 요구할 것인가?
5. spectator→participant로 복귀했을 때 이전 participant cache를 재사용할 수 있는가, 아니면 현재 권한 + fresh snapshot을 요구할 것인가?
6. “past lawful disclosure는 회수 불가, future disclosure/reuse만 제한”이라는 한계를 명시할 것인가?
7. server가 role 변경을 아직 관찰하지 못하는 propagation window를 Core가 다뤄야 하는가, backend/local 책임으로 남길 것인가?

---

# 4. 공식 출처 검증표

> **상태 정의**
>
> - **직접 확인**: 해당 출처가 이번 주장 자체를 명시적으로 뒷받침한다.
> - **부분 확인**: 출처의 scope가 OAuth/HTTP cache 등 특정 영역이므로 일반 플랫폼 원칙으로의 전용은 추론이 필요하다.
> - **열기 실패**: 원문 접근에 실패해 직접 근거로 쓰지 못함.
>
> 이번 최종 채택 출처에는 **열기 실패 없음**. 열리지 않거나 직접 주장 범위를 넘는 자료는 근거 목록에서 제외했다.

| ID | 공식 출처 | 판본 / 날짜 | 확인 절 / 문구 범위 | 이번 조사에서 직접 확인한 내용 | 상태 | 조회일 |
|---|---|---|---|---|---|---|
| S01 | [WHATWG DOM Standard](https://dom.spec.whatwg.org/) | Living Standard, Last Updated **2026-09-24** | §3 Aborting ongoing activities, §3.1~3.3 | AbortSignal은 취소 의사를 나타내지만 observing API가 무시할 수 있음. 이미 aborted면 signal abort는 return. Promise-returning abortable API는 unsettled promise rejection 등의 패턴을 사용. | 직접 확인 | 2026-10-02 |
| S02 | [WHATWG Fetch Standard](https://fetch.spec.whatwg.org/) | Living Standard, Last Updated **2026-09-21** | §5 Fetch API, “To abort a `fetch()` call…” | fetch abort 시 Promise reject 및 body cancel/error. Promise가 이미 fulfilled면 abort의 reject는 no-op. | 직접 확인 | 2026-10-02 |
| S03 | [ECMA-262 — ECMAScript 2026](https://ecma-international.org/publications-and-standards/standards/ecma-262/) / [2026 HTML §27.2](https://tc39.es/ecma262/2026/multipage/control-abstraction-objects.html#sec-promise-objects) | **17th edition, June 2026** | §27.2 Promise Objects, §27.2.5.4.1 `PerformPromiseThen` | settled Promise 의미, resolved 후 재 resolve/reject 무효, fulfilled/rejected Promise의 reaction Job enqueue. | 직접 확인 | 2026-10-02 |
| S04 | [WHATWG DOM Standard — EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) | Living Standard, Last Updated **2026-09-24** | §2.7 `EventTarget`, `removeEventListener`, signal option | 같은 type/callback/capture listener가 있을 때만 제거. AbortSignal 연결 listener는 signal abort 시 제거. | 직접 확인 | 2026-10-02 |
| S05 | [RFC 9700 — Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html) | BCP 240, **January 2025** | §2.3 Access Token Privilege Restriction | resource server가 resource/action에 대해 token이 허용되는지 **every request**에서 검증하고 아니면 거부. | 부분 확인 — OAuth 사례 | 2026-10-02 |
| S06 | [RFC 7009 — OAuth 2.0 Token Revocation](https://www.rfc-editor.org/rfc/rfc7009.html) | Standards Track, **August 2013** | §2.1 Revocation Request, §5 Security Considerations | revocation 시 token invalidation, 이후 사용 불가를 목표로 하나 propagation delay가 있을 수 있음. | 부분 확인 — OAuth revocation 사례 | 2026-10-02 |
| S07 | [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html) | Internet Standard / STD 98, **June 2022** | §3, §3.5, §5.2.2.5 `no-store`, §5.2.2.7 `private` | `private`은 private cache 저장을 허용할 수 있음. `no-store`는 cache 저장/재사용을 막지만 privacy의 충분한 보장은 아님. | 직접 확인(HTTP cache), 부분 확인(application memory 전용) | 2026-10-02 |

---

# 5. 근거 간 차이·상충처럼 보일 수 있는 지점

## 5.1 “abort하면 취소된다” vs “abort가 무시될 수 있다”

상충이 아니다.

- DOM은 **취소 signaling framework**를 제공한다.
- 실제 observing API가 abort를 어떻게 처리하는지는 API-specific하다.
- Fetch는 자신의 abort 동작을 정의하지만 이미 fulfilled된 Promise rejection은 no-op이다.

따라서 “AbortController 존재” → “모든 underlying 작업 중단 보장”으로 확대할 수 없다.

## 5.2 “revocation은 즉시” vs “propagation delay가 있을 수 있음”

RFC 7009 자체가 둘을 함께 명시한다.

- 논리적 정책: revocation 후 token은 사용할 수 없어야 한다.
- 구현 현실: 분산 시스템에서 일부 server가 invalidation을 늦게 알 수 있는 window가 존재할 수 있다.

따라서 role/auth 전환도 시스템 전체 원자 전파를 자동 가정할 수 있다는 근거로 쓰면 안 된다.

## 5.3 `private` vs `no-store`

둘은 목적이 다르다.

- `private`: shared cache 저장을 막지만 single-user private cache 저장은 가능
- `no-store`: 표준 cache의 저장·재사용을 강하게 제한
- 그럼에도 RFC 9111은 `no-store`가 privacy 전체를 보장하는 충분한 메커니즘은 아니라고 명시

따라서 HTTP cache directive 하나로 application callback/cache/view lifetime 전체를 대체할 수 없다.

## 5.4 권한 철회 vs 이미 전달된 비밀

RFC 7009의 revocation은 **future token use**를 제어한다. RFC 9111은 cache control의 한계를 명시한다. 어느 출처도 이미 적법하게 client code에 전달된 private payload를 나중에 완전히 소급 회수할 수 있다고 보장하지 않는다.

따라서 T03의 입력 제약과 일치하게 **과거에 적법하게 전달된 비밀을 악의적 client에서 회수할 수 있다고 약속하면 안 된다.**

---

# 6. STEP4A에 넘길 수 있는 보조 근거 요약

아래 문장은 정식 계약이 아니라 Work Astra가 판단할 때 사용할 수 있는 근거 요약이다.

1. **Cancellation과 adoption은 동일하지 않다.** Abort는 요청/신호이며 이미 완료된 작업에서 무시될 수 있다. Fetch도 이미 fulfilled된 Promise의 abort reject는 no-op이다.
2. **Promise settlement와 callback side effect도 동일하지 않다.** settled Promise의 reaction callback은 enqueue되어 실행될 수 있다. current state에 적용 가능 여부는 application 책임이다.
3. **Client abort와 server rollback은 동일하지 않다.** 선택 표준은 server transaction rollback을 보장하지 않는다.
4. **특정 cleanup primitive의 반복 안전성을 전체 disposer의 idempotence로 일반화할 수 없다.**
5. **Resource cleanup은 정확한 ownership/identity가 중요하다.** DOM listener 제거는 일치하는 listener identity를 기준으로 한다.
6. **Dispose와 old async completion rejection은 별도 문제다.** 구독을 끊어도 이미 완료·scheduled된 callback이 사라진다고 일반 보장할 수 없다.
7. **Server disclosure auth와 client view adoption auth는 별도 수명일 수 있다.** OAuth BCP는 request별 권한 검증 사례를 제공한다.
8. **HTTP private response는 client-side private cache 보관 가능성이 있다.** role 전환 뒤 자동 삭제·재사용 금지를 뜻하지 않는다.
9. **no-store도 과거 비밀 회수 보장은 아니다.**
10. **같은 room/match/version이어도 role/view auth가 달라질 수 있다는 T03 가정은 외부 표준과 충돌하지 않는다.** 다만 이를 구현할 구체 epoch/field/API는 이번 조사로 확정할 수 없다.

---

# 7. 조사 종료 상태

- Q01 보조 조사: **완료**
- Q02 보조 조사: **완료**
- Q03 보조 조사: **완료**
- 11개 장르 전면 재조사: **수행하지 않음**
- 기존 Q01~06 전면 재조사: **수행하지 않음**
- 저장소 현재 구현 안전성 판정: **수행하지 않음**
- 새 플랫폼 owner/API/field/model/backend 확정: **수행하지 않음**
- 코드 구현: **수행하지 않음**
- STEP4A 정식 계약 작성: **수행하지 않음**
- Work Astra 핵심 판단: **NOT_DONE — 사용자 전달 후 Astra 책임**

**STOP. 이 문서는 Work Astra가 다음 판단을 수행하기 위한 선택 보조 조사 원본이며, 여기서 추가 설계·판단을 진행하지 않는다.**
