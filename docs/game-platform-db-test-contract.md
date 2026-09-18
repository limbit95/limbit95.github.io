# Game Platform DB/Test Contract

이 문서는 신규 online platform-native 게임의 **현재 정식 DB/RPC 품질 계약**이다.

게임별 테이블 구조, RPC 이름, 규칙 상태 머신은 각 게임에 남겨 두되, 모든 신규 온라인 게임은 아래 서버 경계와 테스트 시나리오를 만족해야 한다.

공통 게임 DB 스키마나 공통 gameplay RPC를 강제하지 않는다. 공통화 대상은 SQL 구현 자체가 아니라 **반드시 검증해야 하는 안전성 계약**이다.

## 필수 계약

모든 신규 온라인 platform-native 게임은 최소 다음 시나리오를 검증한다.

1. 익명 사용자는 방을 생성하거나 참가할 수 없다.
2. 승인되지 않은 회원은 방을 생성하거나 참가할 수 없다.
3. 승인 회원은 정상적으로 방을 생성하고 다른 방에 참가할 수 있다.
4. 방 멤버가 아닌 사용자는 방 snapshot을 읽을 수 없다.
5. 방장이 아닌 사용자는 게임을 시작할 수 없다.
6. 오래된 `expected_version` 명령은 거부된다.
7. 동일한 `client_action_id` 재전송은 중복 적용되지 않는다.
8. 동시에 충돌하는 명령은 하나의 authoritative commit만 만든다.
9. 재접속 시 authoritative snapshot으로 현재 상태를 복원한다.
10. 다른 플레이어의 private state가 snapshot에 노출되지 않는다.

게임에 private state가 존재하지 않더라도 10번은 생략하지 않는다. 해당 게임의 snapshot에 private 정보가 없음을 명시적으로 검증한다.

## 사용 위치

공통 계약 러너:

```text
tests/game-db-integration/platformContract.js
```

신규 게임은 다음과 같이 자체 통합 테스트 파일을 추가한다.

```text
tests/game-db-integration/
  foundation.test.js
  cant-stop.test.js
  future-game.test.js
```

각 게임 테스트 파일은 자체 RPC 이름과 fixture 생성 방법을 유지하면서 `definePlatformGameDbContract` / `registerPlatformGameDbContract`를 사용한다.

예시 구조:

```js
registerPlatformGameDbContract({
  gameId: "cant-stop",
  createContext: async () => {
    // approved / pending / outsider users and a disposable room fixture
    return context;
  },
  destroyContext: async (context) => {
    // test fixture cleanup
  },
  scenarios: {
    anonymous_entry_denied: async (context) => { /* create + join RPC assertions */ },
    unapproved_entry_denied: async (context) => { /* create + join RPC assertions */ },
    approved_entry_allowed: async (context) => { /* create + join RPC assertions */ },
    non_member_snapshot_denied: async (context) => { /* ... */ },
    non_host_start_denied: async (context) => { /* ... */ },
    stale_version_rejected: async (context) => { /* ... */ },
    duplicate_action_safe: async (context) => { /* ... */ },
    concurrent_action_single_commit: async (context) => { /* ... */ },
    reconnect_snapshot_authoritative: async (context) => { /* ... */ },
    private_state_not_exposed: async (context) => { /* ... */ },
  },
}, { before, after, test });
```

## 서버 권위 원칙

이 계약은 다음 흐름을 검증하기 위한 것이다.

```text
Client intent
→ authenticated game RPC
→ authorization / phase / version validation
→ transaction / row lock
→ authoritative DB mutation
→ snapshot refresh
```

Realtime 이벤트 자체의 수신 여부는 DB 계약의 최종 성공 조건이 아니다.

Realtime은 invalidation 신호로 사용하고, 최종 상태 검증은 DB/RPC snapshot으로 수행한다.

## Idempotency

신규 상태 변경 RPC는 가능한 한 다음 값을 받는다.

```text
room_id
expected_version
client_action_id
```

`duplicate_action_safe` 시나리오는 동일한 `client_action_id` 요청을 두 번 보내도 게임 상태가 두 번 진행되지 않음을 검증한다.

서버 구현은 동일 결과를 재반환하거나 명확한 duplicate 오류를 반환할 수 있다. 어느 방식이든 authoritative state가 한 번만 변경되어야 한다.

## 동시성

`concurrent_action_single_commit`은 동일한 버전을 기준으로 충돌하는 두 명령을 거의 동시에 보내고 다음을 확인한다.

- 둘 다 상태 변경에 성공하지 않는다.
- 최종 room version은 한 번만 진행된다.
- snapshot이 하나의 일관된 결과를 가진다.

구체적인 lock/transaction 구현은 게임 DB가 결정하며 공통 플랫폼은 SQL 구현을 강제하지 않는다.

## CI

`Game DB integration` workflow는 관련 DB/harness 파일이 변경된 PR에서만 실행한다.

workflow는 `tests/game-db-integration/*.test.js` 전체를 실행하므로, 신규 게임이 계약 테스트 파일을 추가하면 별도 workflow를 만들 필요가 없다.

GitHub Actions 사용량을 줄이기 위해 일반 feature push마다 DB integration을 실행하지 않는다.

## Legacy 경계

현재 `foundation.test.js`의 Liar/Marble 검증을 이 계약으로 강제로 재작성하지 않는다.

Legacy는 현재 동작을 보호하는 회귀 테스트를 유지한다.

공통 계약은 모든 신규 online platform-native 게임의 기본 품질 게이트로 사용한다.