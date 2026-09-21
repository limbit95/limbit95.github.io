# Game Platform Strategy

> **문서 성격:** 이 문서는 Game Platform을 구축한 전략과 단계별 결정 배경을 보존하는 참고 문서다. 신규 platform-native 게임의 현재 실행 규칙은 `docs/game-platform-development-rules.md`를 따르며, 실제 계약은 `games/shared/` 코드와 테스트를 기준으로 확인한다.

## 1. 목적

청파 같이의 Game Platform 작업은 기존 게임 코드를 예쁘게 정리하는 프로젝트가 아니다.

가장 중요한 목적은 앞으로 수많은 게임이 추가되어도 게임 서비스가 구조적으로 무너지지 않도록 공통 기반을 먼저 만드는 것이다.

우선순위는 다음과 같다.

1. 게임 서비스 소스 구조 안정화
   - 신규 게임에서 반복되는 중복 소스 방지
   - 불필요한 소스와 게임별 재구현 최소화
   - 역할과 경로가 예측 가능한 구조 유지
2. 성능 향상
   - 게임 플레이 런타임 성능뿐 아니라 개발 탐색 비용 절감
   - 신규 게임 개발 시 전체 프로젝트를 다시 탐색하는 비용 감소
   - 공통 기능의 중복 구현과 중복 검증 감소
3. 장기 유지보수 비용 절감
   - 공통 기능 오류를 한 곳에서 수정
   - 게임 수가 증가해도 인증, 방, 재접속, 초대 등 플랫폼 책임이 게임 수만큼 복제되지 않게 유지

## 2. Legacy 4게임 정책

현재 논리적으로 보호하는 기존 게임은 다음 네 가지다.

- Liar Game
- Drawing Spy
- The Game
- Blue Marble / Marble

Drawing Spy는 Liar Game 안의 모드이므로 실제 소스 루트는 세 개일 수 있다.

Legacy의 합격 기준은 **정상 작동**이다.

새 Game Platform에서 공통 규칙, 공통 기능, 공통 레이아웃이 만들어지더라도 기존 게임에 안전하게 적용할 수 없다면 적용하지 않는다.

이 때문에 청파 같이 게임 서비스 안에서 다음과 같은 불일치를 허용한다.

- 신규 게임과 Legacy 게임의 로비 UI가 다름
- 신규 게임만 공통 초대 기능을 사용함
- 신규 게임만 공통 reconnect/presence UX를 사용함
- 버튼, 모달, 레이아웃 등 시각적 통일성이 완전하지 않음
- Legacy 내부에 과거 중복 코드가 일부 남아 있음

통일감을 위해 정상 작동 중인 Legacy를 위험하게 수정하지 않는다.

Legacy 변경은 실제 장애, 보안, 데이터 손상, 동기화 오류 등 검증된 필요가 있을 때 최소 범위로 수행한다.

## 3. Legacy는 플랫폼 설계의 제약조건이 아니다

새 플랫폼은 기존 네 게임에 모두 끼워 맞출 수 있어야 하는 호환 프레임워크가 아니다.

기존 구조와 호환시키기 위해 새로운 공통 API가 복잡해지거나 예외가 늘어난다면 Legacy 적용을 포기한다.

즉 판단 기준은 다음과 같다.

- "기존 게임에도 적용 가능한가?"보다 "앞으로 수십 개 게임에 단순하고 안정적인가?"를 우선한다.
- Legacy와 신규 플랫폼의 차이를 줄이기 위한 adapter/예외 코드를 무분별하게 추가하지 않는다.
- 과거 중복을 제거하기 위해 Legacy 전체를 공통화하지 않는다.
- 앞으로 생길 중복을 막는 데 집중한다.

## 4. 신규 게임의 기본 구조

Can’t Stop을 시작으로 신규 게임은 Game Platform 위에 구현한다.

신규 게임의 실제 구현 절차와 MUST / MUST NOT 규칙은 `docs/game-platform-development-rules.md`를 실행 기준으로 사용한다.

플랫폼이 담당할 후보:

- Game Registry
- Auth / Approved Member Gate
- Room / Lobby
- Invite
- Snapshot / Reconnect
- Realtime invalidation
- Presence
- Versioned / Idempotent Action
- 공통 오류 및 연결 상태 처리
- 공통 Game Shell / Layout
- 공통 플레이어 UI
- 공통 테스트 계약

게임이 담당할 영역:

- 게임 규칙
- 게임별 상태 머신
- 턴/라운드 진행 방식
- 승패 조건
- 카드/주사위/보드 등 도메인 모델
- 게임별 애니메이션과 연출
- 게임 특유의 테마와 UX

공통화 기준은 "비슷해 보이는가"가 아니라 **게임 규칙과 무관하게 동일한 책임인가**이다.

## 5. 서버 권위와 Realtime 원칙

신규 멀티플레이 게임은 다음 흐름을 기본으로 한다.

```text
Client intent
→ authenticated game-specific RPC
→ membership / role / phase / expected_version 검증
→ transaction / row lock
→ authoritative DB state
→ Realtime invalidation
→ authorized snapshot refresh
→ UI render
```

Realtime 이벤트 자체를 게임 상태의 최종 진실로 사용하지 않는다.

Reconnect 시 이벤트를 처음부터 재생하는 대신 authoritative snapshot을 다시 받아 복원할 수 있어야 한다.

## 6. Versioned / Idempotent Action 원칙

새 게임의 상태 변경 명령은 가능한 한 다음 식별자를 가진다.

```text
room_id
expected_version
client_action_id
```

- `expected_version`: 오래된 클라이언트의 명령이 최신 상태를 덮어쓰지 못하게 한다.
- `client_action_id`: 네트워크 재시도나 중복 클릭이 같은 명령을 두 번 처리하지 않게 한다.
- 실제 게임별 RPC와 테이블 이름은 게임 namespace에 남겨 둔다.

플랫폼은 하나의 거대한 공통 게임 상태 테이블을 만들지 않는다.

## 7. Common Game Shell 원칙

신규 게임은 공통 Shell을 사용할 수 있다.

Shell이 담당하는 범위:

- 게임 제목 / 설명 / 게임 목록 복귀
- 현재 방 식별 정보
- 연결 / 재연결 / 오프라인 / 오류 상태 표시
- 공통 플레이어 roster
- 메인 게임 영역과 보조 정보 영역의 기본 배치
- 하단 공통 action 영역

Shell은 게임 화면 전체 디자인을 고정하는 템플릿이 아니다.

각 게임은 Shell 안의 메인 게임 영역에서 보드, 카드, 주사위, 3D, 애니메이션, 테마 등 고유한 시각 표현을 자유롭게 구현한다.

공통 Shell CSS는 전역 사이트에 강제로 주입하지 않고 신규 게임이 명시적으로 opt-in 한다. 이 원칙으로 Legacy 게임과 기존 커뮤니티 화면의 CSS 회귀를 방지한다.

연결 상태 UI 역시 Realtime 자체를 신뢰하는 표시가 아니라 authoritative snapshot refresh 상태를 사용자에게 보여주는 역할에 집중한다.

## 8. Platform-native Invite 원칙

기존 게임별 초대 구현은 새 Game Platform의 호환 기준이 아니다.

Read-only 영향 분석 결과 사이트에는 이미 `private.site_invites`, `site_invite_create/resolve/revoke`, `/invite.html`, `js/invites/`로 구성된 게임 비종속 공통 초대 기반이 있다. 이 기반은 재사용하고 Game Platform이 같은 기능을 다시 구현하지 않는다.

신규 게임은 게임별 target type을 늘리지 않고 다음 표준을 사용한다.

```text
target_type = game_room
target_id   = <game-specific room id>
metadata    = {
  game_id: "<Game Registry id>",
  platform_version: 1
}
```

platform-native Invite 대상 게임은 반드시 다음 조건을 만족해야 한다.

- `platform === "shared"`
- `capabilities.online === true`
- `capabilities.invite === true`

초대 metadata에 redirect URL을 저장하거나 신뢰하지 않는다. `game_id`를 Registry에서 확인한 뒤 Registry의 site-relative `href`만 목적지로 사용한다.

초대 토큰 해석은 방 입장 권한을 부여하지 않는다. 최종 참가 여부는 각 게임의 Room/Lobby 서버 RPC가 승인회원, 멤버십, 정원, 방 상태 등의 정책을 다시 검증해서 결정한다.

현재 Legacy 소비자는 The Game의 `the_game_room` 흐름이며 Phase 3D에서 제거하거나 마이그레이션하지 않는다. Legacy 초대 제거가 필요하면 별도 작은 작업으로 진행한다.

상세 영향 범위와 제거 경계는 `docs/game-platform-invite-analysis.md`에 기록한다.

## 9. 추후 Remaster 전략

Game Platform이 충분히 검증된 뒤 기존 게임을 새 플랫폼 위에서 다시 제공하고 싶다면 선택적으로 Remaster 버전을 새로 구현할 수 있다.

이때 기본 전략은 과거 코드를 억지로 마이그레이션하는 것이 아니라:

1. 기존 게임을 동작/규칙/UX 참고 자료로 사용
2. 검증된 Game Platform 공통 기능을 재사용
3. 게임 고유 규칙과 연출을 새 플랫폼 규칙에 맞게 다시 구현
4. 신규 버전이 충분히 검증된 뒤 교체 여부를 별도로 판단

따라서 현재 Legacy를 그대로 보존하는 것은 기술 부채를 방치하는 것이 아니라 미래의 안전한 재구현을 위한 의도적인 경계다.

## 10. 현재 단계

```text
Stable Legacy stabilization
→ Phase 3A: Registry + Access Gate
→ Phase 3B: Room/Lobby + Snapshot/Reconnect + Versioned Action contracts
→ Phase 3C: Common Game Shell + connection/player UI contract
→ Phase 3D: platform-native game_room Invite + legacy invite impact analysis
→ Phase 3E: reusable DB/test contract gate
→ Phase 4: Can’t Stop 신규 구현 및 첫 production 검증 — COMPLETE
→ Post-Phase 4: Can’t Stop 피드백을 플랫폼 규칙/거버넌스에 환류
→ 다음 platform-native 게임으로 공통성 2차 검증
→ 필요 시 Legacy Remaster
```

Phase 3D까지의 공통 기반은 Legacy 게임 런타임에 강제로 연결하지 않는다. The Game의 기존 초대 흐름은 별도 Legacy 경로로 유지한다.

Phase 3E에서는 공통 게임 DB 스키마나 공통 RPC를 만들지 않는다. 대신 신규 온라인 게임이 반드시 검증해야 할 승인회원, 멤버십, host 권한, stale version, idempotency, 동시성, reconnect snapshot, private-state 노출 방지 시나리오를 공통 테스트 계약으로 고정한다. 상세 기준은 `docs/game-platform-db-test-contract.md`를 따른다.

Can’t Stop은 이미 존재하는 게임을 플랫폼으로 옮기는 작업이 아니라, Phase 4에서 `games/cant-stop/` 아래에 처음부터 생성하는 첫 platform-native 게임이며 Phase 3E DB 계약의 첫 실제 소비자가 된다.

Can’t Stop v1은 2026-09-21 production release까지 완료되어 Registry `online` / `invite`, authoritative DB/RPC, reconnect, rematch/leave, shared Invite, Game DB contract가 실제 한 게임의 전체 lifecycle에서 동작하는 것을 검증했다.

## 11. Can’t Stop 이후 플랫폼 검증 사이클

첫 게임의 성공은 Game Platform이 완성됐다는 뜻이 아니다. Can’t Stop은 **첫 번째 실전 표본**이며, 이제 다음 게임에서 공통 기반의 일반성을 다시 검증한다.

Can’t Stop 구현을 통해 다음 경계는 유지할 가치가 확인됐다.

- 인증/승인회원, Registry, Room/Lobby adapter, snapshot/reconnect, version/idempotency, Invite, DB contract는 SHARED 책임으로 재사용한다.
- production migration과 capability activation은 소스 구현과 분리한다.
- 게임 출시 시 문서 상태를 `RELEASED / main`으로 닫고, stacked PR과 임시 브랜치를 정리해야 다음 작업자가 과거 브랜치를 현재 기준으로 오해하지 않는다.
- 한 게임에서 발견된 편의 기능은 곧바로 shared abstraction으로 승격하지 않는다. 두 번째 이후 게임에서 같은 플랫폼 책임이 반복될 때 계약을 확장한다.

따라서 현재 Game Platform의 다음 목표는 "공통 기능을 더 많이 만드는 것"이 아니라 **다음 신규 게임에서 기존 shared 계약을 가능한 한 그대로 사용하고, 실제로 반복되는 부족한 계약만 최소 확장하는 것**이다.

## 12. 장기 확장성 원칙

Game Platform은 신규 게임이 추가될수록 함께 검증되고 개선되어야 한다. 게임 수가 늘어나는 것 자체보다 더 큰 위험은 각 게임이 서로 다른 구조·용어·권위 모델·배포 절차를 갖게 되어 **새 기능을 만들 때마다 저장소 전체를 다시 탐색해야 하는 상태**가 되는 것이다.

따라서 플랫폼의 장기 성공 기준은 단순한 코드 재사용률이 아니라 **신규 게임 한 개를 추가하는 데 필요한 탐색·판단·검증 비용이 통제되는가**로 본다.

새 게임을 출시할 때마다 다음을 반복한다.

```text
기존 플랫폼 규칙으로 구현
→ 실제 개발 마찰 기록
→ release 후 플랫폼 회고
→ SHARED / GAME-LOCAL / RELEASE-OPERATIONS 재분류
→ 필요한 규칙·계약·테스트만 최소 수정
→ 다음 게임에서 다시 검증
```

이 순환을 통해 플랫폼 규칙은 점점 더 많은 게임을 포괄하면서도 예외가 누적되는 방향이 아니라 **더 예측 가능하고 단순한 방향**으로 발전해야 한다. 새 규칙을 추가하는 것만이 개선이 아니며, 사용하지 않는 규칙을 제거하거나 중복된 절차를 합치고 과도한 추상화를 되돌리는 것도 동일하게 중요한 개선으로 본다.