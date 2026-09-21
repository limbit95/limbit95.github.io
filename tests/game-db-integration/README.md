# Game DB 통합 테스트 기반

이 문서는 게임 DB 통합 테스트 기반의 범위와 운영 원칙을 설명한다.

Phase 2-A에서 기존 게임 RPC/RLS 동작을 수정하기 전에 disposable Supabase 통합 테스트 환경을 먼저 구축했다. Phase 2-B에서는 이 기반을 당시 Liar v1.0 이후 스키마까지 확장하고 Liar / Drawing Spy 진입 권한 경계를 보호하도록 했다.

## 현재 범위

- shared membership helper가 의존하는 site baseline 및 운영 migration
- Liar Game / Drawing Spy v1.0.0 canonical fresh-install baseline과 저장소에 반영된 v1.1/v1.2/v1.3 후속 migration
- 운영 migration history에서 복원해 저장소에 반영한 The Game migration
- 저장소에 반영된 Marble additive migration
- 저장소에 반영된 Can’t Stop room/gameplay/invite/leave migration
- anonymous 접근, 승인회원 Liar 진입/복구, room membership, player-key 보유, Marble optimistic version 거부, Can’t Stop platform-native lifecycle/security contract에 대한 HTTP-level RPC 검증

Drawing Spy는 별도 애플리케이션이 아니라 Liar Game의 게임 모드이므로 Liar DB baseline에서 함께 검증한다.

The Game migration history는 현재 `scripts/prepare-game-db-e2e.mjs`가 disposable database에 replay한다. 기존 foundation assertion은 Liar / Drawing Spy 접근 경계와 Marble lobby/version 경계를 중심으로 유지하며, The Game 전용 RPC assertion이 더 필요해지면 기존 게임 동작을 변경하지 않는 별도 범위로 확장한다.

## 안전 경계

- harness는 disposable local Supabase workdir인 `.game-db-e2e`만 사용한다.
- production Supabase 프로젝트에 연결하거나 migration을 적용하지 않는다.
- Marble runtime/gameplay 파일은 수정하지 않으며 migration만 disposable database에 replay한다.
- Liar / Drawing Spy의 pending, rejected, suspended 계정은 room을 생성하거나 참가할 수 없다. 참가 후 suspended 상태가 된 계정도 entry API를 통해 기존 room을 다시 찾거나 resume할 수 없다.
- Phase 2-B는 Liar gameplay RPC를 리팩터링하거나 broad mid-session revocation mechanism을 추가하지 않는다. 이런 변경은 접근 경계 수정에 숨겨 넣지 않고 별도의 lifecycle 정책과 회귀 검증 범위로 다룬다.

## 실행

`Game DB integration` GitHub Actions workflow는 관련 game DB/harness Pull Request에서만 자동 실행하며 필요할 때 수동 실행할 수 있다. GitHub Actions 사용량을 아끼기 위해 모든 feature branch push마다 실행하지 않는다.

workflow는 Liar canonical installer가 immutable pinned Git blob을 해석해야 하므로 full Git history를 checkout한다.

## Platform-native 계약

Phase 3E에서 `platformContract.js`를 신규 platform-native 게임이 재사용하는 server-boundary 계약으로 추가했다.

이 계약은 공통 game schema나 공통 gameplay RPC 구현을 만들지 않는다. 각 게임은 자신의 table, RPC 이름, rule state, fixture를 유지한다.

신규 online platform game은 `tests/game-db-integration/<game-id>.test.js`를 추가하고 `docs/game-platform-db-test-contract.md`에 정의된 필수 10개 시나리오를 등록해야 한다.

workflow는 동일한 disposable Supabase instance에서 모든 `tests/game-db-integration/*.test.js`를 실행한다. 따라서 신규 게임 contract test를 추가할 때 별도의 workflow를 만들 필요가 없다.

Can’t Stop은 이 계약의 첫 production platform-native 소비 사례다. `tests/game-db-integration/cant-stop.test.js`는 승인회원, room membership, host 권한, stale version, idempotency, concurrent conflict, reconnect, private-state 경계에 더해 Can’t Stop의 gameplay, Invite, rematch/leave lifecycle을 회귀 검증한다.
