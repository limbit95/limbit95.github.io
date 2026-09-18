# Game Platform Invite Analysis

## 목적

Phase 3D는 기존 게임 초대를 그대로 플랫폼 표준으로 승격하지 않는다.

현재 초대 구현의 실제 영향 범위를 확인한 뒤, 재사용할 수 있는 사이트 공통 기반과 Legacy 전용 연결 코드를 분리하고 신규 platform-native 게임용 Invite 계약을 정의한다.

## 현재 구조

사이트에는 이미 게임과 무관한 공통 초대 인프라가 있다.

```text
private.site_invites
├─ public.site_invite_create
├─ public.site_invite_resolve
└─ public.site_invite_revoke

/invite.html
└─ js/invites/
   ├─ inviteApi.js
   ├─ inviteEntry.js
   ├─ inviteRegistry.js
   └─ inviteShare.js
```

이 기반은 다음 기능을 이미 제공한다.

- 승인회원만 초대 생성/해석/취소
- 64자리 임의 토큰
- 만료시간
- revoke
- target type / target id / metadata 저장
- 로그인 전 초대 URL return target 보존
- 링크 복사 / QR / 네이티브 공유 UI

따라서 Phase 3D에서 같은 기능을 Game Platform 내부에 중복 구현하지 않는다.

## Legacy 소비 현황

현재 확인된 게임 초대 소비자는 The Game이다.

```text
the-game/js/inviteIntegration.js
target_type = the_game_room
/invite.html
→ /the-game/?invite=<token>
→ The Game 전용 참가 흐름
```

Liar Game / Drawing Spy / Marble에는 별도의 invite 전용 모듈이 확인되지 않았다.

The Game 초대는 Legacy 동작으로 취급한다. Phase 3D에서 제거하거나 platform-native 계약으로 마이그레이션하지 않는다.

## Platform-native 표준

신규 게임은 게임별 target type을 계속 만들지 않는다.

```text
target_type = game_room
target_id   = <game-specific room id>
metadata    = {
  game_id: "<registry game id>",
  platform_version: 1
}
```

게임 목적지는 invite metadata에 URL로 저장하지 않는다.

`game_id`를 Game Registry에서 조회하고, Registry에 등록된 site-relative `href`만 신뢰한다.

또한 다음 조건을 모두 만족한 게임만 platform-native Invite를 사용할 수 있다.

- `platform === "shared"`
- `capabilities.online === true`
- `capabilities.invite === true`

이 규칙으로 Legacy 게임이 의도치 않게 새 플랫폼 초대 흐름에 들어오는 것을 막는다.

## 라우팅

```text
/invite.html?token=...
→ site_invite_resolve(token)
→ target_type = game_room
→ metadata.game_id 검증
→ Game Registry 검증
→ Registry href + ?invite=<token>
→ platform-native 게임
→ 해당 게임이 token을 다시 resolve
→ expected game id 검증
→ room id 획득
→ 게임별 Room/Lobby join RPC
```

초대 토큰을 해석하는 것만으로 방 멤버가 되지 않는다.

최종 참가 권한, 정원, 방 상태, 중복 참가, 게임별 정책은 반드시 해당 게임의 서버 RPC가 결정한다.

## 보안 경계

- 초대 metadata의 임의 URL을 redirect 대상으로 사용하지 않는다.
- Registry에 없는 게임으로 이동하지 않는다.
- Legacy 게임은 `game_room` 대상이 될 수 없다.
- invite capability를 명시하지 않은 신규 게임은 대상이 될 수 없다.
- 다른 게임용 token을 현재 게임에서 해석하면 game mismatch로 거부한다.
- 지원하지 않는 platform version은 거부한다.
- client-side 검증은 편의/라우팅 경계이며 DB authorization을 대체하지 않는다.

## 기존 The Game 초대 제거 시점

The Game의 기존 초대 기능은 현재 정상 동작 보호를 위해 이번 Phase에서 그대로 둔다.

향후 제거를 결정한다면 별도 작은 작업으로 다음만 제거한다.

- `the-game/js/inviteIntegration.js`
- The Game의 invite script/style 연결
- `the_game_room` handler
- The Game 전용 invite E2E

사이트 공통 `site_invites`, `/invite.html`, `js/invites/` 자체는 신규 Game Platform에서도 사용하므로 제거 대상이 아니다.
