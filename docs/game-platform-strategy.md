# Game Platform Strategy

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

## 7. 기존 초대 기능 정책

기존 게임별 초대 구현은 새 Game Platform의 호환 기준이 아니다.

현재 Legacy 초대 기능의 사용 가치가 낮고 새 플랫폼에서 공통 기능으로 재설계할 계획이므로, 기존 초대 기능은 별도 Read-only 영향 분석 후 안전하게 제거할 수 있다.

새 초대 기능은 향후 Game Platform의 공식 공통 기능으로 다시 설계한다.

Legacy 게임이 새 공통 Invite 기능을 적용하기 어렵다면 적용하지 않아도 된다.

기존 초대 링크를 영구적으로 보존하기 위해 새 플랫폼 설계를 복잡하게 만들지 않는다.

## 8. 추후 Remaster 전략

Game Platform이 충분히 검증된 뒤 기존 게임을 새 플랫폼 위에서 다시 제공하고 싶다면 선택적으로 Remaster 버전을 새로 구현할 수 있다.

이때 기본 전략은 과거 코드를 억지로 마이그레이션하는 것이 아니라:

1. 기존 게임을 동작/규칙/UX 참고 자료로 사용
2. 검증된 Game Platform 공통 기능을 재사용
3. 게임 고유 규칙과 연출을 새 플랫폼 규칙에 맞게 다시 구현
4. 신규 버전이 충분히 검증된 뒤 교체 여부를 별도로 판단

따라서 현재 Legacy를 그대로 보존하는 것은 기술 부채를 방치하는 것이 아니라 미래의 안전한 재구현을 위한 의도적인 경계다.

## 9. 현재 단계

```text
Stable Legacy stabilization
→ Phase 3A: Registry + Access Gate
→ Phase 3B: Room/Lobby + Snapshot/Reconnect + Versioned Action contracts
→ platform-side Invite / common shell 등 후속 기반
→ Can’t Stop: 첫 실제 플랫폼 검증 게임
→ 이후 신규 게임 확장
→ 필요 시 Legacy Remaster
```

Phase 3B의 계약은 아직 기존 게임 런타임에 연결하지 않는다. Can’t Stop에서 첫 실제 소비자로 검증한 뒤 공통 기능의 범위를 확정한다.
