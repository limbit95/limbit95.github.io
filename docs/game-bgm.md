# Game BGM Pilot

> **문서 분류:** CURRENT
>
> Game Platform 자체를 변경해야 하는 작업에서는 `docs/game-platform-development-rules.md`가 현재 최상위 실행 규칙이다. 이 문서는 그 계약을 확장하지 않고, Legacy 게임인 The Game에서 먼저 검증하는 사이트 공통 BGM presentation utility의 현재 설계를 기록한다.

## 1. 목적

BGM이 등록된 게임 페이지에 진입하면 가능한 환경에서 즉시 음악 재생을 시도한다. 브라우저 autoplay 정책이 이를 차단하면 사용자의 자연스러운 게임 조작을 재생 기회로 사용하며, 실제 게임 시작 시 한 번 더 재생을 시도한다.

음악이 한 번 정상 재생된 뒤에는 게임 화면 interaction을 더 이상 BGM 입력으로 사용하지 않는다. 사용자가 Player UI에서 일시정지했다면 이후 카드·버튼·주사위 등 게임 조작으로 음악을 강제 재생하지 않는다.

## 2. Pilot 구조

현재 공통 utility는 formal Game Platform 계약인 `games/shared/`로 승격하지 않는다.

- `js/game-audio/bgmCatalog.js`: 게임별 트랙, 출처, 라이선스, 기본 볼륨
- `js/game-audio/bgmPreferences.js`: 사용자 볼륨 저장
- `js/game-audio/bgmController.js`: 재생 상태와 autoplay/interaction fallback
- `js/game-audio/bgmPlayer.js`: 작은 Floating Player UI
- `css/game-bgm-player.css`: 공통 Player 스타일

The Game, Liar Game, Can’t Stop에서 같은 site-level utility를 재사용하고 있다. Can’t Stop의 상태별 BGM도 `games/shared/` 계약을 확장하지 않고 game-local presentation에서 utility를 소비한다. formal Game Platform shared 계약 승격은 별도의 공통화 근거가 충분해질 때 검토한다.

## 3. 재생 정책

1. The Game document가 로드되면 BGM Controller가 즉시 `audio.play()`를 시도한다.
2. 차단되면 `pointerdown`, Enter, Space를 임시 감지한다. Player UI 내부 interaction은 이 fallback에서 제외한다.
3. 자연스러운 게임 interaction으로 재생이 성공하는 즉시 모든 전역 interaction listener를 제거한다.
4. authoritative gameplay 진입 시 아직 한 번도 재생되지 않았다면 다시 재생을 시도한다.
5. 그래도 차단되면 Player의 재생 버튼을 사용자가 직접 누를 수 있도록 재생 버튼을 은은하게 강조한다.

게임 목록에서 별도의 session intent를 저장하지 않는다. 현재 게임 페이지가 독립 document이므로 페이지 진입 자체에서 동일한 즉시 재생 시도를 수행하는 편이 더 단순하고, 직접 URL·초대·새로고침·재접속에도 같은 정책을 적용할 수 있다.

전역 interaction fallback은 `hasEverPlayed === false`인 동안에만 존재할 수 있다.

## 4. 사용자 제어

Player UI는 다음 네 요소만 유지한다.

- 재생 상태를 보여주는 작은 Equalizer
- 재생/일시정지 토글
- 볼륨 버튼과 작은 slider
- 곡명과 출처/라이선스 확인 영역

볼륨 또는 출처 popover가 열린 상태에서 Player 바깥 영역을 클릭하거나 터치하면 해당 popover를 닫는다. Player 내부 조작은 popover 외부 클릭으로 취급하지 않는다.

사용자가 일시정지를 누르면 상태는 `PAUSED_BY_USER`가 되며 전역 interaction listener를 설치하지 않는다. 다시 듣고 싶을 때는 Player의 재생 버튼만 사용한다.

볼륨은 `localStorage`에 저장한다. Player의 slider 값은 사용자 설정값으로 그대로 유지하고, 게임별 `defaultOutputVolume`은 기본 slider 위치에서의 실제 Audio 출력을 별도로 정의한다. The Game은 저장된 사용자 설정이 없을 때 slider를 70%로 시작하고 실제 초기 출력은 0.6으로 맞춘다. 이후 slider는 100%까지 계속 증가해 최대 출력 1.0에 도달한다. 같은 document 안에서 track이 전환되면 현재 slider 값, `hasEverPlayed`, 사용자 pause 상태를 유지하고 Player의 곡명/출처 metadata만 현재 track에 맞게 갱신한다. 새 document가 생성되면 runtime 상태는 다시 초기화한다.

## 5. The Game Pilot

- Track: Invariance
- Artist: Kevin MacLeod
- ISRC: USUAN1100847
- Official source: Incompetech
- Reference video: Kevin MacLeod: Invariance (`CpPQeDIA2S0`)
- License: CC BY 4.0
- Default slider volume: 0.70
- Default output volume: 0.60
- Loop: enabled

Player의 출처 영역은 곡명, 아티스트, ISRC, 공식 Incompetech 곡 페이지, 사용자가 제공한 YouTube 확인 영상, CC BY 4.0 라이선스를 함께 표시한다. Attribution의 기준은 YouTube 설명이나 MP3 파일명이 아니라 공식 Incompetech 곡 정보다.

사용자가 제공한 MP3는 3분 38초, 192 kbps, 44.1 kHz stereo 파일로 확인했으며 ID3에는 곡명·아티스트·라이선스가 아닌 encoder 정보만 들어 있었다. 따라서 해당 파일은 곡 확인 자료로 사용하되, 출처와 사용 권한의 근거로 취급하지 않는다.

현재 Pilot은 Incompetech의 공식 MP3 URL을 직접 사용한다. 향후 저장소에 self-host할 경우에도 공식 배포본 또는 출처가 검증된 사본을 사용하고, attribution metadata는 그대로 유지한 채 `src`만 로컬 asset으로 전환한다.

The Game의 로컬 `startGame()`과 온라인 authoritative `openGame()`은 `the-game:game-started` presentation event를 발생시킨다. 이 이벤트는 게임 상태를 바꾸지 않고 BGM fallback에만 사용한다.

## 6. Liar Game

- Track: Deadly Roulette
- Artist: Kevin MacLeod
- ISRC: USUAN1600033
- Official source: Incompetech
- Reference video: Kevin MacLeod: Deadly Roulette (`Hnbv_KNxVo8`)
- License: CC BY 4.0
- Default slider volume: 0.35
- Default output volume: 0.35
- Loop: enabled

Liar Game document가 로드되면 The Game과 같은 공통 BGM controller/player를 mount하고 즉시 재생을 시도한다. autoplay가 차단되면 기존 공통 interaction fallback을 사용하며 게임 인증, 방 생성/참가, Realtime 상태와는 독립적으로 동작한다.

## 7. Can’t Stop

Can’t Stop은 하나의 게임 안에서 상태에 따라 BGM을 전환하는 첫 사례다.

- Page entry / entry / waiting / rematch waiting: **Frozen Star — Kevin MacLeod**
  - ISRC: USUAN1100356
  - Official source: Incompetech
  - License: CC BY 4.0
- Authoritative room status `playing` / gameplay / GAME_OVER presentation: **Mountain Emperor — Kevin MacLeod**
  - ISRC: USUAN1700012
  - Official source: Incompetech
  - License: CC BY 4.0
- 두 track 모두 기본 slider 0.70 / 기본 Audio output 0.60을 사용한다.
- 기존 dice/blizzard Web Audio SFX는 BGM과 분리된 game-local 효과음으로 유지한다.
- BGM 전환은 authoritative snapshot을 변경하지 않고 `CANT_STOP_LOBBY_VIEW`를 읽는 presentation-only 동작이다.
- 사용자가 Player에서 pause한 상태라면 lobby/gameplay 전환이 음악을 자동으로 다시 재생하지 않는다.

## 8. 경계

- BGM 오류는 방 생성, 참가, 준비, 게임 시작, Realtime, reconnect에 영향을 주지 않는다.
- 기존 SFX/Web Audio 구현은 수정하지 않는다.
- Room/Lobby shared contract에 BGM 메서드를 추가하지 않는다.
- 음악 선택, 기본 음량, 재생 연출은 각 게임의 presentation 책임으로 남긴다.
- 저작권 또는 라이선스가 불명확한 음원을 catalog에 등록하지 않는다.

## 9. 검증

자동 검증은 `the-game/tests/bgm.test.js`에서 수행한다.

- catalog와 attribution metadata
- 공식 ISRC와 reference video URL
- 볼륨 persistence
- 페이지 진입 autoplay 성공 시 interaction listener 미설치
- autoplay 차단 후 자연스러운 interaction 성공 시 listener 즉시 제거
- 한 번 재생 후 사용자 pause 시 게임 interaction으로 재생되지 않음
- authoritative gameplay 시작 fallback
- 재생 성공 이력과 사용자 pause를 보존하는 track switching
- Can’t Stop lobby ↔ gameplay BGM mapping

브라우저 수동 검증에서는 desktop/mobile에서 Player가 핵심 게임 action을 가리지 않는지, autoplay 차단 환경에서 첫 interaction fallback이 동작하는지 확인한다.
