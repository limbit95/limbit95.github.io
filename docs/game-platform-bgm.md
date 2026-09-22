# Game BGM Platform

> **문서 분류:** CURRENT
>
> 게임별 음악 선택은 GAME-LOCAL presentation 책임으로 유지하고, 재생 lifecycle·사용자 제어·출처 표시는 반복 가능한 공통 BGM foundation으로 관리한다.

## 1. 목적

게임 목록에서 BGM이 등록된 게임으로 진입하면 가능한 환경에서 즉시 음악 재생을 시도한다. 브라우저 autoplay 정책이 이를 차단하면 사용자의 자연스러운 게임 조작을 재생 기회로 사용하며, 실제 게임 시작 시 한 번 더 재생을 시도한다.

음악이 한 번 정상 재생된 뒤에는 게임 화면 interaction을 더 이상 BGM 입력으로 사용하지 않는다. 사용자가 Player UI에서 일시정지했다면 이후 카드·버튼·주사위 등 게임 조작으로 음악을 강제 재생하지 않는다.

## 2. 구조

공통 모듈은 `games/shared/audio/`에 둔다.

- `bgmCatalog.js`: 게임별 트랙, 출처, 라이선스, 기본 볼륨
- `bgmIntent.js`: 게임 목록에서 게임 페이지로 전달하는 일회성 autoplay intent
- `bgmPreferences.js`: 사용자 볼륨 저장
- `bgmController.js`: 재생 상태와 autoplay/interaction fallback
- `bgmPlayer.js`: 작은 Floating Player UI
- `bgmPlayer.css`: 공통 Player 스타일

게임별 코드는 자신의 lifecycle에서 `게임이 실제로 시작됨` 같은 신호만 BGM Controller에 전달한다. BGM Controller는 Room/Lobby, RPC, Supabase 또는 게임 규칙을 직접 알지 않는다.

## 3. 재생 정책

1. 게임 목록에서 BGM 지원 게임 링크를 정상 클릭하면 `sessionStorage`에 5분 TTL의 autoplay intent를 저장한다.
2. 게임 페이지가 intent를 소비하면 `audio.play()`를 즉시 시도한다.
3. 차단되면 `pointerdown`, Enter, Space를 임시 감지한다. Player UI 내부 interaction은 이 fallback에서 제외한다.
4. 자연스러운 게임 interaction으로 재생이 성공하는 즉시 모든 전역 interaction listener를 제거한다.
5. authoritative gameplay 진입 시 아직 한 번도 재생되지 않았다면 다시 재생을 시도한다.
6. 그래도 차단되면 Player의 재생 버튼을 사용자가 직접 누를 수 있도록 재생 버튼을 은은하게 강조한다.

전역 interaction fallback은 `hasEverPlayed === false`인 동안에만 존재할 수 있다.

## 4. 사용자 제어

Player UI는 다음 네 요소만 유지한다.

- 재생 상태를 보여주는 작은 Equalizer
- 재생/일시정지 토글
- 볼륨 버튼과 작은 slider
- 곡명과 출처/라이선스 확인 영역

사용자가 일시정지를 누르면 상태는 `PAUSED_BY_USER`가 되며 전역 interaction listener를 설치하지 않는다. 다시 듣고 싶을 때는 Player의 재생 버튼만 사용한다.

볼륨은 `localStorage`에 저장한다. 게임별 runtime 재생 상태는 새 document에서 다시 초기화한다.

## 5. The Game Pilot

첫 Pilot은 `the-game/`에 적용한다.

- Track: Invariance
- Artist: Kevin MacLeod
- Source: Incompetech
- License: CC BY 4.0
- Default volume: 0.22
- Loop: enabled

현재 Pilot은 Incompetech의 공식 MP3 URL을 직접 사용한다. 향후 동일 음원을 저장소에 self-host할 경우 출처와 라이선스 metadata는 그대로 유지하고 `src`만 로컬 asset으로 전환한다.

The Game의 로컬 `startGame()`과 온라인 authoritative `openGame()`은 `the-game:game-started` presentation event를 발생시킨다. 이 이벤트는 게임 상태를 바꾸지 않고 BGM fallback에만 사용한다.

## 6. 경계

- BGM 오류는 방 생성, 참가, 준비, 게임 시작, Realtime, reconnect에 영향을 주지 않는다.
- 기존 SFX/Web Audio 구현은 수정하지 않는다.
- 한 게임에 편리하다는 이유만으로 Room/Lobby shared contract에 BGM 메서드를 추가하지 않는다.
- 여러 게임에서 동일 lifecycle 연결이 반복되는 것이 확인된 뒤에만 shared integration helper 승격을 검토한다.
- 저작권 또는 라이선스가 불명확한 음원을 catalog에 등록하지 않는다.

## 7. 검증

최소 자동 검증:

- catalog와 attribution metadata
- game-list intent 저장/소비/만료
- 볼륨 persistence
- autoplay 성공 시 interaction listener 미설치
- autoplay 차단 후 interaction 성공 시 listener 즉시 제거
- 한 번 재생 후 사용자 pause 시 게임 클릭으로 재생되지 않음
- gameplay 시작 fallback
- BGM 미등록 링크에는 intent를 남기지 않음

브라우저 수동 검증에서는 desktop/mobile에서 Player가 핵심 게임 action을 가리지 않는지, autoplay 차단 환경에서 첫 interaction fallback이 동작하는지 확인한다.
