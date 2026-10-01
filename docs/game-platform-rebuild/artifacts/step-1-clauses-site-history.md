# STEP 1 조항별 계승표 — 사이트 정책·공통 BGM·이력

감사 기준 commit: `132ec1576e316d0238c9ca6e07d0d3ab91950ec8`. 이 파일은 STEP 1 감사 산출물이며 CURRENT 규칙을 대체하지 않는다.

[읽는 법·분류·증거 코드·집계](step-1-clause-succession-table.md). `K` 원 범위/강도 계승, `L` 기존 게임 안에서 보존, `H` 과거 기록 보존, `I` 설명/예시/범위 밖/작업 제어. 모든 새 책임 문서·절은 **미정(STEP 6)**이며 아래 분류는 소유 위치 설계가 아니다.

원문은 목록/문단/표의 행/코드 블록 단위로 고정한다. 원문의 부정·조건·예외를 삭제하지 않는다. 절 제목과 같은 절의 도입문, 부모 항목을 함께 읽는다. 서술형은 임의로 MUST나 SHOULD로 환산하지 않는다. 동일 의미의 반복도 서로 다른 원문 ID로 남긴다.

## BGM — `docs/game-bgm.md`

- source: [docs/game-bgm.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-bgm.md)
- blob: `e3767e0b366a5e1f57d5978edf47eb1e129a0931`; 원문 128줄; 상태 `CURRENT_SITE_UTILITY`; 81 관리단위 / 81 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### Game BGM Pilot

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-001 · L3–5 | &gt; **문서 분류:** CURRENT<br>&gt;<br>&gt; Game Platform 자체를 변경해야 하는 작업에서는 `docs/game-platform-development-rules.md`가 현재 최상위 실행 규칙이다. 이 문서는 그 계약을 확장하지 않고, Legacy 게임인 The Game에서 먼저 검증하는 사이트 공통 BGM presentation utility의 현재 설계를 기록한다. | 표현:검증 | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 1. 목적

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-002 · L9–9 | BGM이 등록된 게임 페이지에 진입하면 가능한 환경에서 즉시 음악 재생을 시도한다. 브라우저 autoplay 정책이 이를 차단하면 사용자의 자연스러운 게임 조작을 재생 기회로 사용하며, 실제 게임 시작 시 한 번 더 재생을 시도한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-003 · L11–11 | 음악이 한 번 정상 재생된 뒤에는 게임 화면 interaction을 더 이상 BGM 입력으로 사용하지 않는다. 사용자가 Player UI에서 일시정지했다면 이후 카드·버튼·주사위 등 게임 조작으로 음악을 강제 재생하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 2. Pilot 구조

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-004 · L15–15 | 현재 공통 utility는 formal Game Platform 계약인 `games/shared/`로 승격하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-005 · L17–17 | - `js/game-audio/bgmCatalog.js`: 게임별 트랙, 출처, 라이선스, 기본 볼륨 | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-006 · L18–18 | - `js/game-audio/bgmPreferences.js`: 사용자 볼륨 저장 | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-007 · L19–19 | - `js/game-audio/bgmController.js`: 재생 상태와 autoplay/interaction fallback | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-008 · L20–20 | - `js/game-audio/bgmPlayer.js`: 작은 Floating Player UI | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-009 · L21–21 | - `css/game-bgm-player.css`: 공통 Player 스타일 | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-010 · L23–23 | The Game, Liar Game, Can’t Stop에서 같은 site-level utility를 재사용하고 있다. Can’t Stop의 상태별 BGM도 `games/shared/` 계약을 확장하지 않고 game-local presentation에서 utility를 소비한다. formal Game Platform shared 계약 승격은 별도의 공통화 근거가 충분해질 때 검토한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 3. 재생 정책

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-011 · L27–27 | 1. The Game document가 로드되면 BGM Controller가 즉시 `audio.play()`를 시도한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-012 · L28–28 | 2. 차단되면 `pointerdown`, Enter, Space를 임시 감지한다. Player UI 내부 interaction은 이 fallback에서 제외한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-013 · L29–29 | 3. 자연스러운 게임 interaction으로 재생이 성공하는 즉시 모든 전역 interaction listener를 제거한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-014 · L30–30 | 4. authoritative gameplay 진입 시 아직 한 번도 재생되지 않았다면 다시 재생을 시도한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-015 · L31–31 | 5. 그래도 차단되면 Player의 재생 버튼을 사용자가 직접 누를 수 있도록 재생 버튼을 은은하게 강조한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-016 · L33–33 | 게임 목록에서 별도의 session intent를 저장하지 않는다. 현재 게임 페이지가 독립 document이므로 페이지 진입 자체에서 동일한 즉시 재생 시도를 수행하는 편이 더 단순하고, 직접 URL·초대·새로고침·재접속에도 같은 정책을 적용할 수 있다. | 표현:할 수 있다 | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-017 · L35–35 | 전역 interaction fallback은 `hasEverPlayed === false`인 동안에만 존재할 수 있다. | 표현:할 수 있다 | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 4. 사용자 제어

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-018 · L39–39 | Player UI는 다음 네 요소만 유지한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-019 · L41–41 | - 재생 상태를 보여주는 작은 Equalizer | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-020 · L42–42 | - 재생/일시정지 토글 | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-021 · L43–43 | - 볼륨 버튼과 작은 slider | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-022 · L44–44 | - 곡명과 출처/라이선스 확인 영역 | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-023 · L46–46 | 볼륨 또는 출처 popover가 열린 상태에서 Player 바깥 영역을 클릭하거나 터치하면 해당 popover를 닫는다. Player 내부 조작은 popover 외부 클릭으로 취급하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-024 · L48–48 | 사용자가 일시정지를 누르면 상태는 `PAUSED_BY_USER`가 되며 전역 interaction listener를 설치하지 않는다. 다시 듣고 싶을 때는 Player의 재생 버튼만 사용한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-025 · L50–50 | 볼륨은 `localStorage`에 저장한다. Player의 slider 값은 사용자 설정값으로 그대로 유지하고, 게임별 `defaultOutputVolume`은 기본 slider 위치에서의 실제 Audio 출력을 별도로 정의한다. The Game은 저장된 사용자 설정이 없을 때 slider를 70%로 시작하고 실제 초기 출력은 0.6으로 맞춘다. 이후 slider는 100%까지 계속 증가해 최대 출력 1.0에 도달한다. 같은 document 안에서 track이 전환되면 현재 slider 값, `hasEverPlayed`, 사용자 pause 상태를 유지하고 Player의 곡명/출처 metadata만 현재 track에 맞게 갱신한다. 새 document가 생성되면 runtime 상태는 다시 초기화한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 5. The Game Pilot

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-026 · L54–54 | The Game은 같은 document 안에서 대기/설정과 실제 gameplay의 BGM을 구분한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-027 · L56–56 | - Page entry / mode / local setup / online entry / online waiting / rematch waiting: **Constance — Kevin MacLeod** | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-028 · L57–57 · 부모 LEGACY-BGM-027 |   - ISRC: USUAN1100850 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-029 · L58–58 · 부모 LEGACY-BGM-027 |   - Official source: Incompetech | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-030 · L59–59 · 부모 LEGACY-BGM-027 |   - License: CC BY 4.0 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-031 · L60–60 | - Local/online gameplay 시작 이후 / result presentation: **Invariance — Kevin MacLeod** | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-032 · L61–61 · 부모 LEGACY-BGM-031 |   - ISRC: USUAN1100847 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-033 · L62–62 · 부모 LEGACY-BGM-031 |   - Official source: Incompetech | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-034 · L63–63 · 부모 LEGACY-BGM-031 |   - Reference video: Kevin MacLeod: Invariance (`CpPQeDIA2S0`) | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-035 · L64–64 · 부모 LEGACY-BGM-031 |   - License: CC BY 4.0 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-036 · L65–65 | - 두 track 모두 기본 slider 0.70 / 기본 Audio output 0.60을 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-037 · L66–66 | - `the-game:lobby-entered` presentation event는 mode/setup/online waiting/rematch waiting 진입을 알리고 Constance로 복귀시킨다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-038 · L67–67 | - 기존 `the-game:game-started` presentation event는 local/online gameplay 시작을 알리고 Invariance로 전환시킨다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-039 · L68–68 | - BGM event는 게임 상태를 변경하지 않으며, 사용자 pause와 저장 volume은 track 전환보다 우선한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-040 · L70–70 | Player의 출처 영역은 현재 재생 중인 곡의 곡명, 아티스트, ISRC, 공식 Incompetech 곡 페이지와 CC BY 4.0 라이선스를 표시한다. Invariance에는 기존 YouTube reference도 함께 유지한다. Attribution의 기준은 YouTube 설명이나 MP3 파일명이 아니라 공식 Incompetech 곡 정보다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-041 · L72–72 | 현재 두 곡 모두 Incompetech의 공식 MP3 URL을 직접 사용한다. 향후 저장소에 self-host할 경우에도 공식 배포본 또는 출처가 검증된 사본을 사용하고, attribution metadata는 그대로 유지한 채 `src`만 로컬 asset으로 전환한다. | 표현:검증 | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### 6. Liar Game

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-042 · L76–76 | - Track: Deadly Roulette | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-043 · L77–77 | - Artist: Kevin MacLeod | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-044 · L78–78 | - ISRC: USUAN1600033 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-045 · L79–79 | - Official source: Incompetech | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-046 · L80–80 | - Reference video: Kevin MacLeod: Deadly Roulette (`Hnbv_KNxVo8`) | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-047 · L81–81 | - License: CC BY 4.0 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-048 · L82–82 | - Default slider volume: 0.35 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-049 · L83–83 | - Default output volume: 0.35 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-050 · L84–84 | - Loop: enabled | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-051 · L86–86 | Liar Game document가 로드되면 The Game과 같은 공통 BGM controller/player를 mount하고 즉시 재생을 시도한다. autoplay가 차단되면 기존 공통 interaction fallback을 사용하며 게임 인증, 방 생성/참가, Realtime 상태와는 독립적으로 동작한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### 7. Can’t Stop

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-052 · L90–90 | Can’t Stop은 하나의 게임 안에서 상태에 따라 BGM을 전환하는 첫 사례다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-053 · L92–92 | - Page entry / entry / waiting / rematch waiting: **Frozen Star — Kevin MacLeod** | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-054 · L93–93 · 부모 LEGACY-BGM-053 |   - ISRC: USUAN1100356 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-055 · L94–94 · 부모 LEGACY-BGM-053 |   - Official source: Incompetech | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-056 · L95–95 · 부모 LEGACY-BGM-053 |   - License: CC BY 4.0 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-057 · L96–96 | - Authoritative room status `playing` / gameplay / GAME_OVER presentation: **Mountain Emperor — Kevin MacLeod** | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-058 · L97–97 · 부모 LEGACY-BGM-057 |   - ISRC: USUAN1700012 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-059 · L98–98 · 부모 LEGACY-BGM-057 |   - Official source: Incompetech | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-060 · L99–99 · 부모 LEGACY-BGM-057 |   - License: CC BY 4.0 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-061 · L100–100 | - 두 track 모두 기본 slider 0.70 / 기본 Audio output 0.60을 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-062 · L101–101 | - 기존 dice/blizzard Web Audio SFX는 BGM과 분리된 game-local 효과음으로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-063 · L102–102 | - BGM 전환은 authoritative snapshot을 변경하지 않고 `CANT_STOP_LOBBY_VIEW`를 읽는 presentation-only 동작이다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-064 · L103–103 | - 사용자가 Player에서 pause한 상태라면 lobby/gameplay 전환이 음악을 자동으로 다시 재생하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-DOC | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### 8. 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-065 · L107–107 | - BGM 오류는 방 생성, 참가, 준비, 게임 시작, Realtime, reconnect에 영향을 주지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-066 · L108–108 | - 기존 SFX/Web Audio 구현은 수정하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-067 · L109–109 | - Room/Lobby shared contract에 BGM 메서드를 추가하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-068 · L110–110 | - 음악 선택, 기본 음량, 재생 연출은 각 게임의 presentation 책임으로 남긴다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-069 · L111–111 | - 저작권 또는 라이선스가 불명확한 음원을 catalog에 등록하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 9. 검증

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-070 · L115–115 | 자동 검증은 `the-game/tests/bgm.test.js`에서 수행한다. | 표현:검증 | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-071 · L117–117 | - catalog와 attribution metadata | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-072 · L118–118 | - 공식 ISRC와 reference video URL | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-073 · L119–119 | - 볼륨 persistence | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-074 · L120–120 | - 페이지 진입 autoplay 성공 시 interaction listener 미설치 | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-075 · L121–121 | - autoplay 차단 후 자연스러운 interaction 성공 시 listener 즉시 제거 | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-076 · L122–122 | - 한 번 재생 후 사용자 pause 시 게임 interaction으로 재생되지 않음 | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-077 · L123–123 | - authoritative gameplay 시작 fallback | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-078 · L124–124 | - 재생 성공 이력과 사용자 pause를 보존하는 track switching | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-079 · L125–125 | - The Game lobby/setup/rematch ↔ gameplay BGM mapping | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-080 · L126–126 | - Can’t Stop lobby ↔ gameplay BGM mapping | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-081 · L128–128 | 브라우저 수동 검증에서는 desktop/mobile에서 Player가 핵심 게임 action을 가리지 않는지, autoplay 차단 환경에서 첫 interaction fallback이 동작하는지 확인한다. | 표현:검증 | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## SITE — `README.md`

- source: [README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/README.md)
- blob: `d51a355bb106e8ff3579e4615e6db1e2709fcd06`; 원문 370줄; 상태 `SITE_ENTRY`; 155 관리단위 / 25 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### 청파 같이

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-001 · L3–3 | 청년 공동체의 활동, 공지, 기도 제목, 프로필, 알림과 소통을 위한 모바일 우선 웹 애플리케이션입니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-002 · L5–5 | 프론트엔드는 HTML/CSS/Vanilla JavaScript ES Modules로 구성됩니다. 루트 커뮤니티 앱은 `npm run build:assets`로 `js/app.js`를 content-hashed asset으로 빌드해 `assets/build/`과 `index.html`을 갱신한 뒤 GitHub Pages에서 제공합니다. 인증·데이터·권한·Storage·Realtime은 Supabase가 담당합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-003 · L7–7 | &gt; 이 README는 **청파 같이 본 사이트**를 설명합니다. Liar Game, The Game, Marble 등 게임 구현은 별도 영역으로 관리하며, 본 사이트 기반/구조 정리 작업에서는 게임 전용 소스·문서·DB 객체를 임의로 수정하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 1. 현재 주요 기능 > 회원/권한

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-004 · L13–13 | - 이메일 회원가입 및 로그인 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-005 · L14–14 | - 가입 신청 후 관리자 승인 | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-006 · L15–15 | - 승인 대기/거절/정지 상태별 접근 제어 | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-007 · L16–16 | - 일반 회원 / 관리자 / 활동 카테고리 담당자 권한 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-008 · L17–17 | - 프로필 이미지, 표시 이름, 나이 공개 범위, 소개, 관심 활동 관리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 1. 현재 주요 기능 > 활동

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-009 · L21–21 | - 활동 목록/검색/카테고리 필터 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-010 · L22–22 | - 월간 달력 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-011 · L23–23 | - 활동 상세 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-012 · L24–24 | - 참여/대기 신청 및 취소 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-013 · L25–25 | - 정원 초과 시 대기 등록 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-014 · L26–26 | - 참여 취소 시 대기자 자동 승급 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-015 · L27–27 | - 반복 활동 등록 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-016 · L28–28 | - 활동 등록/수정/취소 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-017 · L29–29 | - 참여자 프로필 조회 및 쪽지 보내기 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-018 · L30–30 | - 새 활동 알림 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-019 · L31–31 | - 참여 활동 시작 약 24시간 전 알림 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 1. 현재 주요 기능 > 공지사항 / 기도 제목

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-020 · L35–35 | - 공지사항 관리자 작성/수정/삭제 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-021 · L36–36 | - 중요/고정 공지 및 검색/페이지 이동 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-022 · L37–37 | - 기도 제목 승인 회원 작성/수정/삭제 | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-023 · L38–38 | - 함께 기도하기 반응 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-024 · L39–39 | - 응원 메시지 댓글 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-025 · L40–40 | - 댓글 작성자 프로필 조회 및 쪽지 보내기 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 1. 현재 주요 기능 > 쪽지/알림

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-026 · L44–44 | - 다른 회원 프로필에서 1:1 쪽지 보내기 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-027 · L45–45 | - 수신자 알림 생성 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-028 · L46–46 | - Supabase Realtime을 통한 새 알림 배지 갱신 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-029 · L47–47 | - 최근 알림 / 지난 알림 구분 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-030 · L48–48 | - 새 활동 알림의 유효 기간 관리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-031 · L49–49 | - 쪽지 읽기 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 1. 현재 주요 기능 > 관리자

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-032 · L53–53 | - 가입 신청 승인/보류/거절 | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-033 · L54–54 | - 회원 상태 및 관리자 권한 관리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-034 · L55–55 | - 활동 카테고리 담당자 관리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-035 · L56–56 | - 활동 카테고리 관리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 2. 기술 구성

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-036 · L60–79 | ```text<br>GitHub Pages<br>  └─ HTML + CSS + Vanilla JS ES Modules<br>           │<br>           ├─ Hash Router<br>           ├─ Persistent App Shell<br>           ├─ Auth state / Route Guard<br>           ├─ Domain API modules<br>           ├─ UI Components<br>           └─ Domain Pages<br>                    │<br>                    ▼<br>                Supabase<br>           ├─ Authentication<br>           ├─ PostgreSQL<br>           ├─ RLS / RPC<br>           ├─ Storage<br>           ├─ Realtime<br>           └─ pg_cron<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-037 · L81–81 | 루트 커뮤니티 앱의 배포 자산을 갱신할 때는 Node/npm 의존성을 설치한 뒤 `npm run build:assets`를 실행합니다. 이 빌드는 `index.template.html`과 `js/app.js`를 기준으로 content-hashed `assets/build/` 및 배포용 `index.html`을 생성합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 3. 주요 파일 구조

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-038 · L85–159 | ```text<br>.<br>├── index.html<br>├── README.md<br>├── AUDIT_REPORT.md                # 과거 감사 기록<br>├── assets/<br>├── css/<br>│   ├── reset.css<br>│   ├── variables.css<br>│   ├── layout.css<br>│   ├── navigation.css<br>│   ├── components.css<br>│   ├── pages.css<br>│   ├── activity-card.css<br>│   ├── profile.css<br>│   ├── modal.css<br>│   ├── messaging.css<br>│   └── responsive.css<br>├── js/<br>│   ├── app.js<br>│   ├── router.js<br>│   ├── auth.js<br>│   ├── api.js                     # 기존 import 호환용 facade<br>│   ├── api/<br>│   │   ├── shared.js<br>│   │   ├── profiles.js<br>│   │   ├── activities.js<br>│   │   ├── boards.js<br>│   │   ├── admin.js<br>│   │   └── notifications.js<br>│   ├── notifications.js<br>│   ├── ui.js<br>│   ├── validators.js<br>│   ├── constants.js<br>│   ├── supabaseClient.js<br>│   ├── components/<br>│   │   ├── header.js<br>│   │   ├── bottomNav.js<br>│   │   ├── activityCard.js<br>│   │   ├── profilePopover.js<br>│   │   ├── modal.js<br>│   │   ├── toast.js<br>│   │   └── loading.js<br>│   └── pages/<br>│       ├── activities.js           # 라우트/필터 조립<br>│       ├── activities/<br>│       │   ├── listView.js<br>│       │   └── calendarView.js<br>│       ├── admin.js                # 관리자 섹션 조립<br>│       ├── admin/<br>│       │   ├── dashboard.js<br>│       │   ├── approvals.js<br>│       │   ├── members.js<br>│       │   ├── managers.js<br>│       │   └── categories.js<br>│       └── ...<br>├── scripts/<br>│   └── check-site.mjs<br>├── .github/workflows/<br>│   ├── community-authenticated-e2e.yml<br>│   ├── community-e2e-smoke.yml<br>│   ├── community-hashed-assets.yml<br>│   ├── game-db-integration.yml<br>│   └── site-static-checks.yml<br>├── docs/<br>│   └── site-foundation-audit.md<br>└── supabase/<br>    ├── README.md<br>    ├── notification_messaging_patch.sql<br>    └── site/<br>        ├── README.md<br>        ├── baseline/<br>        ├── seed.sql<br>        └── migrations/<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-039 · L161–161 | 게임 디렉터리와 게임 전용 Supabase 파일은 별도 관리 대상이므로 위 본 사이트 구조 설명에서 상세히 다루지 않습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 4. 주요 Hash Route

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-040 · L165–165 | &#124; 화면 &#124; Route &#124; 접근 &#124; | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-041 · L166–166 | &#124;---&#124;---&#124;---&#124; | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-042 · L167–167 | &#124; 로그인 &#124; `#/login` &#124; 비로그인 &#124; | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-043 · L168–168 | &#124; 회원가입 &#124; `#/signup` &#124; 비로그인 &#124; | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-044 · L169–169 | &#124; 승인 대기/거절 &#124; `#/pending` &#124; 로그인 &#124; | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-045 · L170–170 | &#124; 이용 정지 안내 &#124; `#/suspended` &#124; 정지 회원 &#124; | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-046 · L171–171 | &#124; 홈 &#124; `#/` &#124; 승인 회원 &#124; | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-047 · L172–172 | &#124; 게임 허브 &#124; `#/games` &#124; 승인 회원 &#124; | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-048 · L173–173 | &#124; 활동 &#124; `#/activities` &#124; 승인 회원 &#124; | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-049 · L174–174 | &#124; 활동 상세 &#124; `#/activities/:id` &#124; 승인 회원 &#124; | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-050 · L175–175 | &#124; 활동 등록 &#124; `#/activities/new` &#124; 관리자/담당자 &#124; | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-051 · L176–176 | &#124; 활동 수정 &#124; `#/activities/:id/edit` &#124; 관리자/담당자 &#124; | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-052 · L177–177 | &#124; 공지사항 &#124; `#/notice` &#124; 승인 회원 &#124; | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-053 · L178–178 | &#124; 공지 작성 &#124; `#/notice/new` &#124; 관리자 &#124; | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-054 · L179–179 | &#124; 기도 제목 &#124; `#/prayer` &#124; 승인 회원 &#124; | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-055 · L180–180 | &#124; 기도 제목 작성 &#124; `#/prayer/new` &#124; 승인 회원 &#124; | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-056 · L181–181 | &#124; 마이페이지 &#124; `#/mypage` &#124; 승인 회원 &#124; | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-057 · L182–182 | &#124; 프로필 수정 &#124; `#/mypage/edit` &#124; 승인 회원 &#124; | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-058 · L183–183 | &#124; 관리자 &#124; `#/admin` &#124; 관리자 &#124; | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-059 · L185–185 | 활동 보기 방식은 query로 구분합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-060 · L187–187 | - `#/activities?view=list` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-061 · L188–188 | - `#/activities?view=calendar` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-062 · L190–190 | 과거 `#/community...` 주소는 현재 기도 제목 `#/prayer...`로 리다이렉트합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 5. 로컬 실행

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-063 · L194–194 | ES Module 보안 정책 때문에 `index.html`을 `file://`로 직접 열지 말고 정적 서버를 사용합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-064 · L196–198 | ```bash<br>python3 -m http.server 8080<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-065 · L200–200 | 브라우저에서 `http://localhost:8080`을 엽니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-066 · L202–202 | `js/config.js`에는 실제 Supabase Project URL과 브라우저 공개용 key가 필요합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-067 · L204–207 | ```js<br>export const SUPABASE_URL = "https://&lt;project-ref&gt;.supabase.co";<br>export const SUPABASE_PUBLISHABLE_KEY = "&lt;publishable-key&gt;";<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-068 · L209–209 | `service_role` 또는 secret key는 브라우저 코드와 공개 GitHub 저장소에 넣지 않습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 6. Supabase 운영

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-069 · L213–213 | 현재 운영 Supabase에는 본 사이트와 게임 영역의 DB 객체가 함께 존재합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-070 · L215–215 | 청파 같이 본 사이트의 초기 스키마와 seed는 `supabase/site/baseline/` 및 `supabase/site/seed.sql`에 보존하고, 이후 운영 변경은 `supabase/site/migrations/`에 실제 Supabase migration 버전과 이름을 맞춰 기록합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-071 · L217–217 | DB 운영/변경 원칙은 &#91;`supabase/README.md`&#93;(./supabase/README.md)와 &#91;`supabase/site/README.md`&#93;(./supabase/site/README.md)를 따릅니다. | 표현:원칙 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-072 · L219–219 | 현재 본 사이트에는 게시글/댓글/활동 참여자/담당자 프로필을 **필요한 사용자 ID 집합만** 조회하는 RPC가 적용되어 있습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-073 · L221–221 | 핵심 원칙: | 표현:원칙 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-074 · L223–223 | 1. 운영 catalog를 먼저 확인합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-075 · L224–224 | 2. 운영 DB와 저장소가 다르면 추측으로 덮어쓰지 않습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-076 · L225–225 | 3. 본 사이트 DDL 변경은 migration 이력으로 관리합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-077 · L226–226 | 4. 변경 전후 Security/Performance Advisor와 실제 SQL 검증을 수행합니다. | 표현:검증 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-078 · L227–227 | 5. 게임 DB 객체는 본 사이트 정리 작업에서 수정하지 않습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 7. 보안 모델

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-079 · L231–231 | - 로그인 상태만으로 권한을 신뢰하지 않고 RLS/RPC에서 다시 검증합니다. | 표현:검증 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-080 · L232–232 | - 승인된 회원만 일반 서비스 데이터에 접근하도록 제한합니다. | 표현:승인 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-081 · L233–233 | - 게시글/댓글의 일반 수정·삭제는 본인 소유권을 검사합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-082 · L234–234 | - 활동 관리 권한은 관리자 또는 현재 활성 카테고리 담당자를 검사합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-083 · L235–235 | - 알림은 자신의 row만 조회/수정합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-084 · L236–236 | - 쪽지는 발신자 또는 수신자만 조회합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-085 · L237–237 | - 공개 프로필 RPC는 승인 회원 여부를 서버에서 검사합니다. | 표현:승인 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 8. Web Push 운영 설정

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-086 · L241–243 | Web Push는 `notifications`를 원본으로 사용하며 참여 확정, 대기 신청, 참여 취소 알림만<br>`send-web-push` Edge Function으로 전달합니다. 브라우저에는 VAPID 공개키만 두고 다음 값은<br>Supabase Edge Function Secret으로 등록합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-087 · L245–252 | ```bash<br>supabase secrets set \<br>  VAPID_SUBJECT=mailto:ADMIN_EMAIL \<br>  VAPID_PUBLIC_KEY=PUBLIC_KEY \<br>  VAPID_PRIVATE_KEY=PRIVATE_KEY \<br>  WEB_PUSH_WEBHOOK_SECRET=LONG_RANDOM_SECRET<br>supabase functions deploy send-web-push --no-verify-jwt<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-088 · L254–256 | `SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`는 Supabase hosted Edge Function의 기본 Secret을<br>사용합니다. `VAPID_PUBLIC_KEY`와 동일한 공개키를 `js/config.js`의<br>`WEB_PUSH_VAPID_PUBLIC_KEY`에 설정하며 Private Key와 service role key는 저장소에 넣지 않습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-089 · L258–258 | Supabase Dashboard의 **Database Webhooks**에서 아래 Webhook을 추가합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-090 · L260–260 | - Table: `public.notifications` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-091 · L261–261 | - Event: `INSERT`만 선택 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-092 · L262–262 | - Method/URL: `POST`, `https://&lt;project-ref&gt;.supabase.co/functions/v1/send-web-push` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-093 · L263–263 | - Header: `x-webhook-secret: &lt;WEB_PUSH_WEBHOOK_SECRET과 같은 값&gt;` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-094 · L265–267 | Webhook은 DB transaction과 분리되어 Push 네트워크 실패가 참여 RPC를 되돌리지 않습니다.<br>Function은 전달된 수신자를 신뢰하지 않고 service role로 notification을 다시 조회하며,<br>대상이 아닌 알림은 건너뜁니다. 만료 응답(404/410)을 받은 Subscription은 삭제합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-095 · L268–268 | - 프로필 이미지는 private Storage bucket의 signed URL로 표시합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. UI / 구조 > Persistent App Shell

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-096 · L274–274 | 승인 회원용 화면에서는 Header와 BottomNav를 라우트마다 다시 만들지 않습니다. 인증/권한 identity가 유지되는 동안 공통 Shell을 재사용하고 `#main-content`의 내용만 교체합니다. | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-097 · L276–276 | 이 구조는 Header의 Realtime 알림 상태와 이벤트 리스너를 불필요하게 다시 만들지 않도록 합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. UI / 구조 > 반응형 내비게이션

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-098 · L280–280 | - 모바일: 하단 고정 주요 메뉴 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-099 · L281–281 | - 관리자도 하단 메뉴에서 `내 정보` 접근 유지 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-100 · L282–282 | - 관리자 전용 화면은 모바일 헤더의 관리 바로가기와 데스크톱 상단 관리자 메뉴로 접근 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-101 · L283–283 | - 데스크톱: 상단 내비게이션 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-102 · L284–284 | - `360px`급 작은 화면 기본 대응 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-103 · L285–285 | - `prefers-reduced-motion` 대응 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. UI / 구조 > CSS 역할

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-104 · L289–289 | - `variables.css`: 토큰 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-105 · L290–290 | - `layout.css`: 전체 Shell/레이아웃 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-106 · L291–291 | - `navigation.css`: 공통 내비게이션 보정 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-107 · L292–292 | - `components.css`: 공통 컴포넌트 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-108 · L293–293 | - `pages.css`: 페이지 전용 스타일 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-109 · L294–294 | - `activity-card.css`: 활동 카드 탐색/접근성 레이어 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-110 · L295–295 | - `profile.css`: 프로필 UI | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-111 · L296–296 | - `modal.css`: 모달 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-112 · L297–297 | - `messaging.css`: 쪽지/알림 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-113 · L298–298 | - `responsive.css`: 공통 반응형 보정 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-114 · L300–300 | 과거의 `theme.css` override 계층은 제거하고 현재 시각 결과를 각 담당 파일에 통합했습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. UI / 구조 > 활동 카드 접근성

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-115 · L304–304 | 활동 카드의 빈 영역 클릭 UX는 유지하지만 JS가 `window.location.hash`를 직접 변경하지 않습니다. 제목의 실제 `&lt;a&gt;` 링크가 stretched-link로 카드 영역을 담당하고 참여/취소 버튼은 독립된 상호작용 요소로 유지합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. UI / 구조 > 자동 검수

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-116 · L308–308 | `Site static checks` GitHub Actions는 현재 `main` 및 `feature/**` push와 `main` 대상 Pull Request에서 실행됩니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-117 · L310–310 | - content-hashed 커뮤니티 자산 재빌드 및 커밋된 산출물 최신 상태 확인 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-118 · L311–311 | - 본 사이트와 Liar Game, The Game, Marble JavaScript 문법 검사 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-119 · L312–312 | - Web Push, 회원가입, 관리자 권한, 활동 권한 테스트 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-120 · L313–313 | - Game Platform 공용 계약, The Game 규칙 엔진 및 Marble foundation 테스트 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-121 · L314–314 | - 커뮤니티 API 경계/ES Module/select 검사 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-122 · L315–315 | - Liar Game ES Module 및 canonical SQL baseline 검사 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-123 · L316–316 | - 사이트 파일 무결성 검사 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-124 · L318–318 | 브라우저 E2E는 `Community E2E smoke`, 인증·권한 흐름은 `Community authenticated E2E`, 게임 DB 재현성/경계 검증은 `Game DB integration` workflow가 별도로 담당합니다. | 표현:검증 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 8. UI / 구조 > 공통 접근성

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-125 · L322–322 | - 본문 바로가기 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-126 · L323–323 | - `aria-current`, `aria-live`, dialog role 사용 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-127 · L324–324 | - 공통 모달 Escape 닫기 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-128 · L325–325 | - 공통 모달 Tab focus trap | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-129 · L326–326 | - 모달 종료 후 이전 포커스 복귀 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 9. 현재 기반/구조 정리 상태

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-130 · L330–330 | 2026-08-25 기준 전체 구조 재검토 내용은 &#91;`docs/site-foundation-audit.md`&#93;(./docs/site-foundation-audit.md)에 기록합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-131 · L332–332 | 완료된 작업: | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-132 · L334–334 | 1. 본 사이트 DB baseline/seed 복원 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-133 · L335–335 | 2. 운영 migration 이력 복원 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-134 · L336–336 | 3. 공통 모달 접근성/스타일 정리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-135 · L337–337 | 4. 모바일 쪽지 액션 회귀 수정 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-136 · L338–338 | 5. CSS override 계층 제거 및 역할별 파일 정리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-137 · L339–339 | 6. 승인 회원용 Persistent App Shell 적용 | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-138 · L340–340 | 7. GitHub Actions 기반 static check 도입 및 구조 회귀 검사 강화 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-139 · L341–341 | 8. `api.js`를 도메인별 모듈로 분리하고 기존 facade 호환 유지 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-140 · L342–342 | 9. `activities.js`를 목록/달력 하위 모듈로 분리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-141 · L343–343 | 10. `admin.js`를 대시보드/승인/회원/담당자/카테고리 하위 모듈로 분리 | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-142 · L344–344 | 11. 공개 프로필 조회 범위를 필요한 사용자 ID 집합으로 최적화 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-143 · L345–345 | 12. 활동 카드 탐색을 실제 링크 기반 구조로 변경 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-144 · L346–346 | 13. 모바일 관리자 내비게이션에서 마이페이지 접근성 보완 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-145 · L348–348 | 남은 기반 개선은 영향도가 낮은 항목 중심입니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-146 · L350–350 | - 기존 `--forest-*`, `--coral-*` 등 색상 토큰을 의미 기반 이름으로 점진 전환 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-147 · L351–351 | - 현재 smoke/authenticated E2E 범위의 지속적인 보강 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-148 · L352–352 | - 알림 장기 누적 시 pagination/보관 정책 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-149 · L354–354 | 이후에는 쪽지함/답장, 알림 설정, 기도 제목 상태/카운트, 관심사 기반 홈 등 기능 확장 단계로 넘어갈 수 있습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 10. 개발/병합 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-150 · L358–358 | 큰 구조 변경은 `main`에 직접 작업하지 않고 별도 브랜치에서 진행합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-151 · L360–360 | 작업 후 변경 내용을 먼저 검토하고 승인된 경우에만 `main`에 반영합니다. | 표현:승인 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-152 · L362–362 | 청파 같이 본 사이트 정리 중에는 게임 활동 관련 소스를 건드리지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### Game Platform vNext 재구축 작업

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-153 · L366–366 | 게임 플랫폼 vNext 재구축 작업의 단일 실행 계획은 &#91;`game_platform_vnext_final_execution_plan.md`&#93;(./game_platform_vnext_final_execution_plan.md), 현재 진행/재개 기록의 진입점은 &#91;`docs/game-platform-rebuild/README.md`&#93;(./docs/game-platform-rebuild/README.md)입니다. | 서술형(수치화 안 함) | CONTROL / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-154 · L368–368 | 개정 1.3부터 승인된 STEP 결과는 `feature/game-platform-vnext-integration`에 누적하고, 각 STEP은 별도 작업 브랜치와 integration base PR로 검토합니다. STEP PR의 integration 병합과 최종 integration → main 반영은 서로 다른 승인 게이트입니다. | 표현:승인 | CONTROL / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-155 · L370–370 | 새 채팅에서 재개할 때는 루트 `AGENTS.md`의 **Game Platform vNext 재구축 작업 재개** 항목과 위 기록 진입점을 먼저 확인합니다. STEP 0이 integration에 아직 병합되지 않은 동안에는 현재 작업 브랜치 `docs/game-platform-vnext-phase0-bootstrap`과 PR #404도 함께 확인합니다. 이 안내는 vNext 재구축 작업에 한정되며 기존 Game Platform 규칙의 권위나 게임 구현 상태, 저장소 전체의 일반 브랜치 정책을 변경하지 않습니다. | 서술형(수치화 안 함) | CONTROL / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

## DBOPS — `supabase/README.md`

- source: [supabase/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/README.md)
- blob: `6f79e559386f600bd524615d61dd1e60c361c759`; 원문 179줄; 상태 `SITE_POLICY`; 102 관리단위 / 46 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### 청파 같이 Supabase 운영 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-001 · L3–3 | 이 문서는 **청파 같이 본 사이트**의 Supabase 변경 원칙을 정의합니다. | 표현:원칙 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-002 · L5–5 | &gt; Legacy와 platform-native를 포함한 게임 전용 테이블, RPC, Realtime, 문서와 SQL은 이 문서의 정리·리팩터링 범위에서 제외합니다. 게임 영역은 각 게임의 전용 DB/RPC 계약과 migration에서 별도 관리합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 1. 현재 Source of Truth

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-003 · L9–9 | 2026-09-16 기준으로 청파 같이 본 사이트의 DB 이력을 다음 구조로 확보했습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-004 · L11–11 | - 초기 구조: `supabase/site/baseline/00_setup.sql` ~ `12_avatar_storage.sql` | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-005 · L12–12 | - 초기 카테고리: `supabase/site/seed.sql` | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-006 · L13–13 | - 이후 실제 운영 migration: `supabase/site/migrations/` | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-007 · L14–14 | - 운영 상태 검증 기준: 실제 Supabase catalog와 `supabase_migrations.schema_migrations` | 표현:검증 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-008 · L16–16 | 상세 실행 순서와 출처는 &#91;`site/README.md`&#93;(./site/README.md)를 참고합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-009 · L18–18 | 기존 `notification_messaging_patch.sql`은 알림·쪽지 기능을 추가할 때 사용한 통합 패치 기록으로 보존합니다. 실제 운영 migration의 개별 버전 파일은 `site/migrations/`를 기준으로 합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-010 · L20–20 | 날짜 투표는 초기 개발 이력으로만 보존하며 현재 서비스 범위에서는 제거합니다. 기존 baseline/migration 기록은 재현성을 위해 유지하고, 최종 스키마 제거는 `20260916100000_remove_date_poll_feature.sql`을 기준으로 합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 2. 청파 같이 본 사이트 범위

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-011 · L24–24 | 현재 본 사이트의 핵심 DB 영역은 다음과 같습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-012 · L26–26 | - 회원/승인: `profiles`, `join_requests`, `profile_interests` | 표현:승인 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-013 · L27–27 | - 활동: `activity_categories`, `category_managers`, `events`, `event_series`, `event_participants` | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-014 · L28–28 | - 게시판: `posts`, `comments` | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-015 · L29–29 | - 알림/쪽지: `notifications`, `direct_messages` | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-016 · L31–31 | 같은 Supabase 프로젝트에 존재하더라도 `admin_users`, `site_settings`, `mission_posts` 등을 기준으로 동작하는 별도 객체는 청파 같이 본 사이트 baseline에 포함하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 3. DB 변경 절차

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-017 · L35–35 | 청파 같이 본 사이트 DB를 변경할 때는 아래 순서를 따릅니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-018 · L37–37 | 1. 변경 대상이 게임 영역인지 확인한다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-019 · L38–38 | 2. 운영 schema/RLS/function/trigger 상태를 조회한다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-020 · L39–39 | 3. 필요한 변경 SQL을 검토한다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-021 · L40–40 | 4. Security/Performance Advisor를 확인한다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-022 · L41–41 | 5. 실제 적용 migration과 동일한 이력을 `supabase/site/migrations/`에 기록한다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-023 · L42–42 | 6. 사용자 검토 전에는 `main`에 병합하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-024 · L43–43 | 7. 운영 DB 반영이 필요한 경우 변경 내용과 영향 범위를 먼저 보고한다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-025 · L44–44 | 8. 반영 후 실제 SQL 조회로 결과를 검증한다. | 표현:검증 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 4. 보안 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-026 · L48–48 | - 공개 schema의 청파 같이 테이블은 RLS를 유지합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-027 · L49–49 | - Data API에 노출되는 schema에 새 table/view/function/sequence를 생성하거나 기존 객체의 호출 role·직접 접근 방식 등 권한 경계를 변경할 때는 Supabase/Postgres 기본 권한에 의존하지 않습니다. 해당 migration에서 `anon`, `authenticated`, `service_role` 중 실제 호출 주체와 필요한 최소 `GRANT`/`REVOKE`를 명시적으로 검토합니다. 같은 객체의 구현만 바꾸고 권한 경계가 유지되는 변경에는 권한 SQL 반복을 강제하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | D08 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-028 · L50–50 | - 테이블 권한과 RLS는 서로 다른 보안 계층으로 취급해 둘 다 검토하며, RLS가 켜져 있다는 이유로 과도한 table privilege를 남기거나 table privilege가 있다는 이유로 RLS를 생략하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-029 · L51–51 | - 직접 Data API 접근이 필요하지 않은 객체에는 브라우저 role 권한을 주지 않으며, `service_role`도 관행적으로 `GRANT ALL`하지 않고 서버에서 직접 접근이 필요한 범위만 허용합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | D08 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-030 · L52–52 | - 브라우저에는 publishable/anon key만 사용하며 `service_role` 또는 secret key를 넣지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-031 · L53–53 | - 사용자 권한은 프론트 UI 숨김으로 보장하지 않고 RLS/RPC에서 다시 검증합니다. | 표현:검증 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-032 · L54–54 | - `SECURITY DEFINER` 함수는 목적이 명확한 경우에만 사용합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-033 · L55–55 | - 함수의 실행 권한은 실제 호출 주체에 필요한 최소 범위만 허용합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-034 · L56–56 | - 사용자 소유 row를 수정하는 정책은 `USING`과 `WITH CHECK`를 함께 검토합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-035 · L57–57 | - 함수의 `search_path`는 가능한 한 명시적으로 고정합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 5. 보안 점검 범위 정정

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-036 · L61–61 | 초기 Advisor 점검에서 다음 `public` 함수들이 경고 대상으로 보였습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-037 · L63–63 | - `public.set_updated_at()` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-038 · L64–64 | - `public.is_admin()` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-039 · L65–65 | - `public.rls_auto_enable()` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-040 · L67–67 | 운영 함수 정의를 추가 확인한 결과, 청파 같이 본 사이트는 `private.set_updated_at()`과 `private.is_admin()` 등 **`profiles` 기반 private 함수**를 사용합니다. 반면 위 `public` 함수 일부는 `admin_users` 등 다른 테이블을 참조하는 별도/레거시 영역입니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-041 · L69–69 | 따라서 이번 청파 같이 기반 정리에서는 위 별도 함수들을 경고만 보고 수정하거나 삭제하지 않습니다. 공통 event trigger처럼 프로젝트 전체에 영향을 줄 수 있는 객체는 별도 영향 분석이 필요한 경우에만 다룹니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-042 · L71–71 | 현재 본 사이트에서 계속 추적할 항목은 다음과 같습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-043 · L73–73 | - Supabase Auth의 Leaked Password Protection 설정 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-044 · L74–74 | - 본 사이트 `SECURITY DEFINER` RPC의 내부 권한 검증 유지 | 표현:검증 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 6. 게임 영역 보호 규칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-045 · L78–78 | 청파 같이 본 사이트 정리 작업에서는 Legacy와 platform-native를 포함한 게임 전용 DB 영역을 수정하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-046 · L80–80 | - 게임 전용 테이블/RPC/Realtime 구조 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-047 · L81–81 | - `supabase/&lt;game-id&gt;/` 아래의 게임 전용 migration | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-048 · L82–82 | - 게임 전용 SQL 및 게임 전용 문서 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-049 · L84–84 | 공통 DB 변경이 게임에 영향을 줄 가능성이 있으면 변경 전에 영향도를 별도로 확인합니다. 특정 게임명을 이 목록에 계속 추가하는 방식으로 범위를 관리하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 7. 활동 장소 검색 Edge Function 설정

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-050 · L88–88 | 활동 장소와 지도 링크의 좌표 해석은 `resolve-map-link` Edge Function에서 NAVER API HUB 지역 검색을 사용합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-051 · L90–90 | 운영 환경에는 다음 두 값을 **Supabase Edge Function Secret**으로 등록합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-052 · L92–92 | - `NAVER_API_HUB_CLIENT_ID` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-053 · L93–93 | - `NAVER_API_HUB_CLIENT_SECRET` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-054 · L95–95 | 이 값들은 서버 전용 인증 정보이므로 `js/config.js`나 다른 브라우저 소스에 넣지 않습니다. Secret을 변경하면 Edge Function을 다시 배포하지 않아도 런타임에서 새 값이 사용됩니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-055 · L97–97 | 지도 렌더링은 NAVER Cloud Maps Web Dynamic Map Client ID를 계속 사용하며, 카카오 JavaScript 키는 카카오톡 활동 공유 기능에서만 사용합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. 공통 메일 발송 시스템

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-056 · L101–101 | 메일은 **인증 메일**과 **서비스 메일**을 구분합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. 공통 메일 발송 시스템 > 8.1 인증 메일

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-057 · L105–105 | 회원가입 이메일 OTP, 비밀번호 재설정 등 인증 수명주기에 속한 메일은 Supabase Auth가 담당합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-058 · L107–107 | - 회원가입 인증번호: `supabase.auth.signInWithOtp()` / `verifyOtp()` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-059 · L108–108 | - 비밀번호 재설정: Supabase Auth recovery 흐름 | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-060 · L109–109 | - 발송 SMTP 설정: Supabase Auth의 Custom SMTP에서 Google 계정과 앱 비밀번호를 관리 | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-061 · L111–111 | 서비스 메일 공통화 작업은 `Authentication &gt; Emails &gt; SMTP Settings`의 기존 Auth SMTP 설정을 대체하거나 수정하지 않습니다. 서비스 Edge Function에서도 인증번호를 직접 생성하거나 별도의 challenge 테이블을 만들지 않습니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. 공통 메일 발송 시스템 > 8.2 서비스 메일

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-062 · L115–115 | 가입 신청 관리자 알림처럼 애플리케이션 업무에서 발생하는 메일은 다음 계층으로 분리합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-063 · L117–117 | - 공통 진입점/수신자 조회: `supabase/functions/_shared/email.ts` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-064 · L118–118 | - Google SMTP 전송 계층: `supabase/functions/_shared/email-transport.ts` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-065 · L119–119 | - 업무별 템플릿: `supabase/functions/_shared/email-templates.ts` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-066 · L120–120 | - 공통 HTML 레이아웃: `supabase/functions/_shared/email-layout.ts` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-067 · L122–122 | 업무별 Edge Function은 `sendEmail()` 또는 `sendUserEmail()`만 호출합니다. 업무 코드에서 SMTP host, Google 계정, 앱 비밀번호, Nodemailer를 직접 참조하지 않습니다. 따라서 향후 서비스 메일 종류가 늘어나도 업무 로직과 전송 공급자 세부 구현은 분리된 상태를 유지합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-068 · L124–124 | 현재 서비스 메일 transport는 **Google Gmail SMTP + Google 앱 비밀번호**로 고정합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-069 · L126–126 | - SMTP host: `smtp.gmail.com` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-070 · L127–127 | - SMTP port: `465` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-071 · L128–128 | - TLS: implicit TLS (`secure: true`) | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-072 · L129–129 | - SMTP client: `nodemailer@9.1.1` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-073 · L131–131 | Supabase hosted Edge Function은 outbound `587` 포트를 사용할 수 없으므로 서비스 메일 SMTP는 `465`를 사용합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-074 · L133–133 | 운영 Supabase 프로젝트에는 다음 값을 **Edge Function Secret**으로 한 번만 등록하고 모든 서비스 메일에서 공통 사용합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-075 · L135–135 | - `SMTP_USERNAME`: 발송에 사용하는 Google 계정 이메일 | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-076 · L136–136 | - `SMTP_PASSWORD`: 해당 Google 계정에서 발급한 앱 비밀번호 | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-077 · L137–137 | - `SMTP_FROM`: 메일의 From 값. 예: `청파 같이 &lt;example@gmail.com&gt;` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-078 · L138–138 | - `APP_SITE_URL`: 선택값. 메일에서 사이트 링크를 생성할 때 사용하며 미설정 시 `https://limbit95.github.io/`를 사용합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-079 · L140–140 | `SMTP_PASSWORD`에는 Google 계정의 일반 로그인 비밀번호를 사용하지 않습니다. Google 계정에 2단계 인증을 활성화한 뒤 발급한 앱 비밀번호만 사용합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-080 · L142–142 | Supabase Auth의 Custom SMTP 설정과 Edge Function Secret은 보안상 서로 별도 저장소입니다. 같은 Google SMTP 계정과 앱 비밀번호를 사용하더라도 서비스 메일용 Edge Function Secret은 별도로 등록해야 하며, 서비스 메일 코드가 Auth SMTP 비밀번호를 조회하거나 덮어쓰지 않습니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. 공통 메일 발송 시스템 > 8.3 새 서비스 메일 추가 규칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-081 · L146–146 | 새 프로세스에서 메일을 추가할 때는 다음 순서를 지킵니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-082 · L148–148 | 1. `email-templates.ts`에 템플릿 ID와 입력 데이터 타입, 제목/본문/CTA를 추가합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-083 · L149–149 | 2. 브랜드 헤더, 본문 여백, 버튼, 푸터처럼 모든 메일에 공통인 UI는 `email-layout.ts`에서만 관리합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-084 · L150–150 | 3. 업무 템플릿은 공통 레이아웃을 호출하고 사용자/업무 데이터는 HTML escape를 거쳐 렌더링합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-085 · L151–151 | 4. 업무 Edge Function은 `email.ts`의 `sendEmail()` 또는 Auth 사용자를 대상으로 하는 `sendUserEmail()`만 호출합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-086 · L152–152 | 5. Google SMTP host/port/TLS/Nodemailer/앱 비밀번호 처리는 `email-transport.ts` 안에서만 관리합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-087 · L153–153 | 6. 호출부는 업무 이벤트별로 안정적인 `idempotencyKey`를 전달합니다. SMTP 전송에서는 이 값을 고정 `Message-ID`와 `X-Cheongpa-Idempotency-Key`에 사용하여 재시도 시 동일 메시지를 식별할 수 있게 합니다. 이는 SMTP 서버 차원의 중복 전송 방지 보장을 의미하지는 않습니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-088 · L154–154 | 7. SMTP 비밀번호, 수신자 주소, SMTP 응답 원문을 운영 로그에 그대로 남기지 않습니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-089 · L155–155 | 8. 새로운 메일 프로세스를 추가할 때 기존 transport를 복사하거나 별도 SMTP 클라이언트를 만들지 않습니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-090 · L157–157 | 현재 첫 서비스 메일 템플릿은 `join_request_received`이며, 동일한 공통 프레임 안에서 제목·안내 문구·버튼 목적지만 업무에 맞게 교체합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. 공통 메일 발송 시스템 > 8.4 서비스 메일 운영 진단

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-091 · L161–161 | 서비스 메일 전송 결과는 업무 Edge Function 응답의 `email` 객체로 확인합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-092 · L163–163 | - `email.sent = 1`: Gmail SMTP 서버가 수신자를 accepted 처리한 상태 | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-093 · L164–164 | - `reason = "EMAIL_NOT_CONFIGURED"`: 필수 Secret이 누락된 상태이며 `missing` 배열에서 누락된 이름 확인 | 표현:필수 | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-094 · L165–165 | - `reason = "SMTP_NOT_ACCEPTED"`: SMTP 요청은 완료됐지만 수신자가 accepted 처리되지 않은 상태 | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-095 · L166–166 | - `reason = "SMTP_&lt;오류 코드&gt;"`: Nodemailer/SMTP 오류 코드가 확인된 상태. 예: 인증 실패, 연결 시간 초과 등 | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-096 · L167–167 | - `reason = "SMTP_DELIVERY_FAILED"`: SMTP 오류 코드 없이 전송 예외가 발생한 상태 | 표현:예외 | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-097 · L168–168 | - `reason = "RECIPIENT_EMAIL_MISSING"`: 대상 Auth 사용자에게 사용할 이메일 주소가 없음 | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-098 · L169–169 | - `reason = "EMAIL_DELIVERY_FAILED"`: Auth 수신자 조회 중 예외 발생 | 표현:예외 | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-099 · L171–171 | 가입 신청 관리자 알림처럼 필수 서비스 메일이 실패하면 Web Push 성공 여부와 관계없이 Webhook 응답을 `502`로 기록해 메일 실패가 정상 `200`으로 숨지 않도록 합니다. 가입 신청 알림은 `supabase_functions.hooks`와 `net._http_response`에서 Webhook HTTP 결과를 확인할 수 있으며, 운영 로그에는 SMTP 비밀번호, 수신자 이메일 주소, SMTP 응답 원문을 남기지 않습니다. | 표현:필수 | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-100 · L173–173 | Secret은 Supabase Dashboard의 Edge Functions Secrets 또는 Supabase CLI의 `supabase secrets set`으로 관리하고 소스 코드나 브라우저 설정에는 저장하지 않습니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. 공통 메일 발송 시스템 > 8.5 레거시 회원가입 메일 제거

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-101 · L177–177 | 초기 다단계 회원가입 구현에서 사용했던 `signup-verification` Edge Function과 `signup_email_challenges` 기반 자체 OTP 방식은 현재 Native Supabase Auth OTP 경로에서 사용하지 않습니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-102 · L179–179 | DB의 미사용 challenge 테이블 및 RPC는 `20260914075722_remove_legacy_signup_email_verification.sql`에서 제거합니다. 운영 반영 시에는 더 이상 호출되지 않는 배포본 `signup-verification` Edge Function도 함께 삭제하여 레거시 실행 경로를 남기지 않습니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

## SITEDB — `supabase/site/README.md`

- source: [supabase/site/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/site/README.md)
- blob: `02426634228d360249c868d7ed2529ecfded8dd5`; 원문 149줄; 상태 `SITE_POLICY`; 64 관리단위 / 7 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### 청파 같이 본 사이트 DB 이력

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-001 · L3–3 | 이 디렉터리는 **청파 같이 본 사이트**의 Supabase baseline과 이후 운영 migration을 보존합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-002 · L5–5 | Legacy와 platform-native를 포함한 게임 전용 소스와 DB 객체는 이 디렉터리의 관리 범위에서 제외하며, 각 게임의 전용 migration 영역에서 별도 관리합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 구성

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-003 · L9–34 | ```text<br>supabase/site/<br>├── README.md<br>├── baseline/<br>│   ├── 00_setup.sql<br>│   ├── 01_members.sql<br>│   ├── 02_activity_categories.sql<br>│   ├── 03_events.sql<br>│   ├── 04_posts_comments.sql<br>│   ├── 05_date_polls.sql<br>│   ├── 06_notifications.sql<br>│   ├── 07_common_triggers.sql<br>│   ├── 08_auth_profile.sql<br>│   ├── 09_admin_rpc.sql<br>│   ├── 10_participation_rpc.sql<br>│   ├── 11_rls.sql<br>│   └── 12_avatar_storage.sql<br>├── seed.sql<br>└── migrations/<br>    ├── 20260825041209_expand_notifications_and_direct_messages.sql<br>    ├── 20260825041340_lock_down_notification_rpc_permissions.sql<br>    ├── 20260825041418_schedule_activity_reminder_notifications.sql<br>    ├── 20260825041451_index_notification_message_target.sql<br>    ├── 20260825090540_add_date_poll_fk_covering_indexes.sql<br>    └── 20260825103805_add_public_member_profiles_by_ids.sql<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### baseline 출처

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-004 · L38–38 | `baseline/00_setup.sql`부터 `12_avatar_storage.sql`까지는 2026-08-25에 전달받은 청파 같이 원본 `schema.sql`을 번호가 매겨진 기존 섹션 기준으로 분리한 것입니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-005 · L40–40 | - SQL 객체의 의미와 정의는 바꾸지 않았습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-006 · L41–41 | - 각 파일을 순서대로 독립 실행할 수 있도록 `begin` / `commit` 경계만 파일 단위로 구성했습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-007 · L42–42 | - 원본과 분리본의 실행 SQL 2,139개 행을 비교하여 순서와 내용이 일치함을 확인했습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-008 · L43–43 | - 새 프로젝트를 재구성할 경우 파일명 순서대로 실행합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### seed

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-009 · L47–47 | `seed.sql`은 전달받은 초기 활동 카테고리 seed입니다. 2026-08-25 운영 DB와 비교하여 카테고리 이름, 아이콘, 색상, 설명, 활성 상태가 모두 일치함을 확인했습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-010 · L49–49 | baseline 실행 후 seed를 실행합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 운영 migration

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-011 · L53–53 | 운영 적용이 완료된 `migrations/` 파일은 Supabase `supabase_migrations.schema_migrations`에 실제 기록된 버전과 이름을 그대로 사용합니다. 운영 적용 전으로 표시한 migration은 예외입니다. | 표현:예외 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-012 · L55–55 | 운영 DB에 이미 적용된 migration은 다시 실행하기 위한 파일이 아니라 **현재 운영 DB가 baseline 이후 어떻게 변경되었는지 추적하기 위한 source of truth**입니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-013 · L57–57 | &gt; 문서 점검 기준 2026-09-18: 아래 파일 트리와 `현재 확인된 본 사이트 흐름` 목록은 초기 baseline 및 주요 전환 지점을 설명하는 축약 목록이며 `supabase/site/migrations/`의 전체 파일을 열거하지 않습니다. 저장소의 현재 migration 목록은 실제 디렉터리를 확인하고, 운영 적용 여부는 `supabase_migrations.schema_migrations`를 함께 대조합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-014 · L59–59 | 현재 확인된 본 사이트 흐름은 다음과 같습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-015 · L61–61 | 1. baseline + seed | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-016 · L62–62 | 2. `20260825041209_expand_notifications_and_direct_messages` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-017 · L63–63 | 3. `20260825041340_lock_down_notification_rpc_permissions` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-018 · L64–64 | 4. `20260825041418_schedule_activity_reminder_notifications` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-019 · L65–65 | 5. `20260825041451_index_notification_message_target` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-020 · L66–66 | 6. `20260825090540_add_date_poll_fk_covering_indexes` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-021 · L67–67 | 7. `20260825103805_add_public_member_profiles_by_ids` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-022 · L68–68 | 8. `20260908090000_add_admin_permission_system` (운영 적용 완료) | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-023 · L69–69 | 9. `20260909062324_multistep_signup_verification` (운영 적용 완료, 회원가입 Phase 1 이력) | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-024 · L70–70 | 10. `20260909094910_native_auth_otp_signup` (운영 적용 완료, Native Auth OTP 전환 단계) | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-025 · L71–71 | 11. `20260909124500_enforce_native_auth_otp_signup` (운영 적용 전) | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 운영 migration > 관리자 역할 및 영역 권한

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-026 · L75–79 | `20260908090000_add_admin_permission_system`은 기존 `profiles.role`을 유지하면서<br>`member`(USER), `admin`(ADMIN), `system_admin`(SYSTEM_ADMIN) 3단계 역할과<br>`admin_permissions`의 영역별 권한을 추가합니다. 기존 승인 관리자는 서비스 중단을<br>막기 위해 일반 관리자 역할과 5개 운영 영역 권한을 그대로 받지만 최고 관리자로<br>자동 승격되지는 않습니다. | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-027 · L81–82 | 권한 migration을 운영 DB에 적용한 후, 배포 담당자는 실제 소유자 UUID를 확인한 뒤 서버 권한으로 아래 초기화를 정확히 한 번<br>실행해야 합니다. 부분 unique index가 최고 관리자 2명 생성을 차단합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-028 · L84–86 | ```sql<br>select public.bootstrap_system_admin('&lt;verified-admin-uuid&gt;'::uuid);<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-029 · L88–89 | 브라우저에서는 이 초기화 RPC를 실행할 수 없습니다. 이후 일반 관리자 지정/해제와<br>영역 권한 관리는 최고 관리자 UI 및 서버에서 재검증되는 RPC만 사용합니다. | 표현:검증 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 운영 migration > 날짜투표 FK 인덱스

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-030 · L93–93 | `20260825090540_add_date_poll_fk_covering_indexes`는 Supabase Performance Advisor가 지적한 본 사이트 날짜투표 FK 2개의 covering index를 추가합니다. 적용 후 해당 `unindexed_foreign_keys` 경고가 사라졌음을 확인했습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 운영 migration > 필요한 회원 프로필만 조회

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-031 · L97–97 | `20260825103805_add_public_member_profiles_by_ids`는 승인 회원용 공개 프로필 RPC에 **UUID 배열 조회 경로**를 추가합니다. | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-032 · L99–99 | 기존 `get_public_member_profiles(p_user_id)`는 호환성을 위해 유지하며, 게시글/댓글/활동 참여자/카테고리 담당자처럼 필요한 사용자 ID 집합을 이미 알고 있는 화면에서는 `get_public_member_profiles_by_ids(uuid&#91;&#93;)`를 사용합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-033 · L101–101 | 새 RPC의 보안 조건은 기존 공개 프로필 RPC와 동일하게 유지합니다. | 표현:조건 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-034 · L103–103 | - `private.is_approved_member()` 검사 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-035 · L104–104 | - `SECURITY DEFINER` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-036 · L105–105 | - 고정 `search_path = ''` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-037 · L106–106 | - `anon` EXECUTE 없음 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-038 · L107–107 | - `authenticated`, `service_role`만 EXECUTE 허용 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-039 · L109–109 | 운영 적용 후 실제 함수 권한도 위 상태로 확인했습니다. Security Advisor의 `authenticated_security_definer_function_executable` 항목은 승인 회원이 의도적으로 호출하는 RPC이므로, 경고만 보고 EXECUTE를 제거하지 않습니다. | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 같은 Supabase 프로젝트의 별도 객체

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-040 · L113–113 | 운영 프로젝트에는 다음처럼 청파 같이 본 사이트 baseline이나 위 migration으로 생성되지 않은 별도 객체도 존재합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-041 · L115–115 | - `public.is_admin()` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-042 · L116–116 | - `public.rls_auto_enable()` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-043 · L117–117 | - `public.set_updated_at()` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-044 · L118–118 | - `public.get_admin_storage_usage(...)` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-045 · L119–119 | - `public.get_admin_table_usage()` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-046 · L121–121 | 일부 함수는 `admin_users`, `site_settings`, `mission_posts` 등 현재 청파 같이의 `profiles` 기반 권한 구조와 다른 테이블을 참조합니다. 따라서 이 디렉터리에 억지로 포함하거나 이번 기반 정리에서 삭제하지 않습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 운영 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-047 · L125–125 | - 운영 DB를 추측해서 덮어쓰지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-048 · L126–126 | - 새 DDL 변경은 실제 적용 migration과 GitHub 기록을 함께 남깁니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-049 · L127–127 | - 운영 반영 전 RLS, 함수 실행 권한, trigger 영향 범위를 확인합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-050 · L128–128 | - 새 Data API 노출 객체 또는 기존 객체의 권한 경계를 다루는 DDL은 상위 `supabase/README.md`의 명시적 권한 원칙을 따릅니다. | 표현:원칙 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-051 · L129–129 | - 이미 적용된 migration을 운영 DB에 재실행하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-052 · L130–130 | - Advisor의 SECURITY DEFINER 경고는 실제 호출 주체와 함수 내부 권한 검사를 확인한 뒤 판단합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-053 · L131–131 | - 게임 전용 DB 객체와 SQL은 각 게임 영역에서 별도 관리하며 이 디렉터리에서 수정하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 운영 원칙 > 다단계 회원가입 이메일 OTP 배포

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-054 · L135–135 | 회원가입 이메일 인증은 별도 메일 API를 두지 않고 **Supabase Auth의 기본 가입 확인 이메일과 OTP 검증 기능**을 사용합니다. 운영에 이미 적용된 `20260909062324_multistep_signup_verification.sql`은 당시 custom challenge 구조를 준비했던 이력으로 그대로 보존하며, 최종 전환에서는 해당 challenge를 사용하지 않습니다. | 표현:검증 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-055 · L137–137 | 배포 순서는 다음과 같습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-056 · L139–139 | 1. `20260909062324_multistep_signup_verification.sql` — **2026-09-09 운영 적용 완료**. `profiles.real_name`, 이용수칙 동의 컬럼과 실명 backfill은 계속 사용합니다. 이 migration에 포함된 custom challenge 테이블/RPC는 전환 완료 후 별도 cleanup 대상입니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-057 · L140–140 | 2. Supabase Dashboard의 **Auth &gt; Email Templates &gt; Confirm signup** 템플릿을 `{{ .ConfirmationURL }}` 링크 방식 대신 `{{ .Token }}` 6자리 코드가 표시되도록 변경합니다. Email OTP Expiration은 300초를 기준으로 맞춥니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-058 · L141–141 | 3. `20260909094910_native_auth_otp_signup.sql` — **2026-09-09 운영 적용 완료**. `signup_flow = 'auth_otp'` Auth 사용자는 `auth.users`만 먼저 생성하고, `profiles`/`join_requests` 생성은 이메일 인증 이후 `submit_join_request` RPC까지 미룹니다. 기존 운영 프론트의 full-metadata 가입 경로는 새 프론트 배포 전까지 계속 허용합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-059 · L142–142 | 4. 새 회원가입 프론트엔드를 배포합니다. 최초 인증번호 요청은 `supabase.auth.signUp()`, 재전송은 `supabase.auth.resend({ type: 'signup' })`, 코드 검증은 `supabase.auth.verifyOtp({ type: 'email' })`를 사용합니다. | 표현:검증 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-060 · L143–143 | 5. 최종 `가입 신청`은 인증된 세션에서 `submit_join_request` RPC를 호출합니다. RPC는 `auth.uid()`와 `auth.users.email/email_confirmed_at`을 서버에서 확인하고 `profiles`와 `join_requests`를 한 트랜잭션으로 생성합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-061 · L144–144 | 6. 새 프론트의 OTP 가입 흐름이 정상 동작하는 것을 확인한 뒤 `20260909124500_enforce_native_auth_otp_signup.sql`을 적용합니다. 이 단계부터 Auth INSERT trigger는 이메일이 있는 Auth user 생성을 허용하되 signup metadata를 `profiles`/`join_requests` 생성에 사용하지 않습니다. 신규 커뮤니티 신청 행은 이메일 인증을 마친 사용자가 `submit_join_request`를 호출하는 경로에서만 생성됩니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-062 · L145–145 | 7. 정상 가입, 잘못된/만료 OTP, 재전송, 가입 도중 이탈 후 복귀, 관리자 승인 대기 흐름을 검증한 뒤 기존 `signup_email_challenges`와 challenge RPC, 미사용 `signup-verification` Edge Function을 별도 cleanup합니다. | 표현:승인,검증 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-063 · L147–147 | `submit_join_request`에는 사용자 ID나 이메일을 클라이언트 입력으로 받지 않습니다. 동일 사용자의 최종 신청은 transaction advisory lock으로 직렬화하고 이미 양쪽 신청 데이터가 존재하면 idempotent 성공으로 처리합니다. 한쪽 데이터만 존재하는 비정상 상태는 오류로 차단합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-064 · L149–149 | 선택형 푸시 알림 체크는 이번 회원가입 변경에서도 UI에만 유지하며 Auth metadata, DB 또는 Push Subscription에 저장하지 않습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

## DBTEST — `tests/game-db-integration/README.md`

- source: [tests/game-db-integration/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-db-integration/README.md)
- blob: `99b8acac6244f4e128766d6a36b6159ce9883848`; 원문 44줄; 상태 `TEST_GUIDE`; 22 관리단위 / 14 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### Game DB 통합 테스트 기반

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBTEST-001 · L3–3 | 이 문서는 게임 DB 통합 테스트 기반의 범위와 운영 원칙을 설명한다. | 표현:원칙 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-002 · L5–5 | Phase 2-A에서 기존 게임 RPC/RLS 동작을 수정하기 전에 disposable Supabase 통합 테스트 환경을 먼저 구축했다. Phase 2-B에서는 이 기반을 당시 Liar v1.0 이후 스키마까지 확장하고 Liar / Drawing Spy 진입 권한 경계를 보호하도록 했다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 현재 범위

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBTEST-003 · L9–9 | - shared membership helper가 의존하는 site baseline 및 운영 migration | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBTEST-004 · L10–10 | - Liar Game / Drawing Spy v1.0.0 canonical fresh-install baseline과 저장소에 반영된 v1.1/v1.2/v1.3 후속 migration | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBTEST-005 · L11–11 | - 운영 migration history에서 복원해 저장소에 반영한 The Game migration | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBTEST-006 · L12–12 | - 저장소에 반영된 Marble additive migration | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBTEST-007 · L13–13 | - 저장소에 반영된 Can’t Stop room/gameplay/invite/leave migration | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBTEST-008 · L14–14 | - anonymous 접근, 승인회원 Liar 진입/복구, room membership, player-key 보유, Marble optimistic version 거부, Can’t Stop platform-native lifecycle/security contract에 대한 HTTP-level RPC 검증 | 표현:승인,검증 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBTEST-009 · L16–16 | Drawing Spy는 별도 애플리케이션이 아니라 Liar Game의 게임 모드이므로 Liar DB baseline에서 함께 검증한다. | 표현:검증 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBTEST-010 · L18–18 | The Game migration history는 현재 `scripts/prepare-game-db-e2e.mjs`가 disposable database에 replay한다. 기존 foundation assertion은 Liar / Drawing Spy 접근 경계와 Marble lobby/version 경계를 중심으로 유지하며, The Game 전용 RPC assertion이 더 필요해지면 기존 게임 동작을 변경하지 않는 별도 범위로 확장한다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 안전 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBTEST-011 · L22–22 | - harness는 disposable local Supabase workdir인 `.game-db-e2e`만 사용한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-012 · L23–23 | - production Supabase 프로젝트에 연결하거나 migration을 적용하지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-013 · L24–24 | - Marble runtime/gameplay 파일은 수정하지 않으며 migration만 disposable database에 replay한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-014 · L25–25 | - Liar / Drawing Spy의 pending, rejected, suspended 계정은 room을 생성하거나 참가할 수 없다. 참가 후 suspended 상태가 된 계정도 entry API를 통해 기존 room을 다시 찾거나 resume할 수 없다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-015 · L26–26 | - Phase 2-B는 Liar gameplay RPC를 리팩터링하거나 broad mid-session revocation mechanism을 추가하지 않는다. 이런 변경은 접근 경계 수정에 숨겨 넣지 않고 별도의 lifecycle 정책과 회귀 검증 범위로 다룬다. | 표현:검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### 실행

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBTEST-016 · L30–30 | `Game DB integration` GitHub Actions workflow는 관련 game DB/harness Pull Request에서만 자동 실행하며 필요할 때 수동 실행할 수 있다. GitHub Actions 사용량을 아끼기 위해 모든 feature branch push마다 실행하지 않는다. | 표현:할 수 있다 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-017 · L32–32 | workflow는 Liar canonical installer가 immutable pinned Git blob을 해석해야 하므로 full Git history를 checkout한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### Platform-native 계약

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBTEST-018 · L36–36 | Phase 3E에서 `platformContract.js`를 신규 platform-native 게임이 재사용하는 server-boundary 계약으로 추가했다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-019 · L38–38 | 이 계약은 공통 game schema나 공통 gameplay RPC 구현을 만들지 않는다. 각 게임은 자신의 table, RPC 이름, rule state, fixture를 유지한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-020 · L40–40 | 신규 online platform game은 `tests/game-db-integration/&lt;game-id&gt;.test.js`를 추가하고 `docs/game-platform-db-test-contract.md`에 정의된 필수 10개 시나리오를 등록해야 한다. | 표현:필수 | RULE / M-DB | E-DB | C02/F03 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-021 · L42–42 | workflow는 동일한 disposable Supabase instance에서 모든 `tests/game-db-integration/*.test.js`를 실행한다. 따라서 신규 게임 contract test를 추가할 때 별도의 workflow를 만들 필요가 없다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-022 · L44–44 | Can’t Stop은 이 계약의 첫 production platform-native 소비 사례다. `tests/game-db-integration/cant-stop.test.js`는 승인회원, room membership, host 권한, stale version, idempotency, concurrent conflict, reconnect, private-state 경계에 더해 Can’t Stop의 gameplay, Invite, rematch/leave lifecycle을 회귀 검증한다. | 표현:승인,검증 | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |

## STRATEGY — `docs/game-platform-strategy.md`

- source: [docs/game-platform-strategy.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-strategy.md)
- blob: `344297d7d806f164082bcb5a88e41610d3db4d10`; 원문 253줄; 상태 `HISTORY`; 121 관리단위 / 0 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### Game Platform Strategy

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-001 · L3–3 | &gt; **문서 분류:** HISTORY | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-002 · L5–5 | &gt; **문서 성격:** 이 문서는 Game Platform을 구축한 전략과 단계별 결정 배경을 보존하는 참고 문서다. 신규 platform-native 게임의 현재 실행 규칙은 `docs/game-platform-development-rules.md`를 따르며, 실제 계약은 `games/shared/` 코드와 테스트를 기준으로 확인한다. 특정 게임명이나 당시 구현 내용이 등장하더라도 역사적 이력일 뿐 현재 신규 게임의 규칙·템플릿·구현 기준으로 사용하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 1. 목적

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-003 · L9–9 | 청파 같이의 Game Platform 작업은 기존 게임 코드를 예쁘게 정리하는 프로젝트가 아니다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-004 · L11–11 | 가장 중요한 목적은 앞으로 수많은 게임이 추가되어도 게임 서비스가 구조적으로 무너지지 않도록 공통 기반을 먼저 만드는 것이다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-005 · L13–13 | 우선순위는 다음과 같다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-006 · L15–15 | 1. 게임 서비스 소스 구조 안정화 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-007 · L16–16 · 부모 LEGACY-STRATEGY-006 |    - 신규 게임에서 반복되는 중복 소스 방지 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-008 · L17–17 · 부모 LEGACY-STRATEGY-006 |    - 불필요한 소스와 게임별 재구현 최소화 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-009 · L18–18 · 부모 LEGACY-STRATEGY-006 |    - 역할과 경로가 예측 가능한 구조 유지 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-010 · L19–19 | 2. 성능 향상 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-011 · L20–20 · 부모 LEGACY-STRATEGY-010 |    - 게임 플레이 런타임 성능뿐 아니라 개발 탐색 비용 절감 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-012 · L21–21 · 부모 LEGACY-STRATEGY-010 |    - 신규 게임 개발 시 전체 프로젝트를 다시 탐색하는 비용 감소 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-013 · L22–22 · 부모 LEGACY-STRATEGY-010 |    - 공통 기능의 중복 구현과 중복 검증 감소 | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-014 · L23–23 | 3. 장기 유지보수 비용 절감 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-015 · L24–24 · 부모 LEGACY-STRATEGY-014 |    - 공통 기능 오류를 한 곳에서 수정 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-016 · L25–25 · 부모 LEGACY-STRATEGY-014 |    - 게임 수가 증가해도 인증, 방, 재접속, 초대 등 플랫폼 책임이 게임 수만큼 복제되지 않게 유지 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 2. Legacy 4게임 정책

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-017 · L29–29 | 현재 논리적으로 보호하는 기존 게임은 다음 네 가지다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-018 · L31–31 | - Liar Game | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-019 · L32–32 | - Drawing Spy | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-020 · L33–33 | - The Game | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-021 · L34–34 | - Blue Marble / Marble | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-022 · L36–36 | Drawing Spy는 Liar Game 안의 모드이므로 실제 소스 루트는 세 개일 수 있다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-023 · L38–38 | Legacy의 합격 기준은 **정상 작동**이다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-024 · L40–40 | 새 Game Platform에서 공통 규칙, 공통 기능, 공통 레이아웃이 만들어지더라도 기존 게임에 안전하게 적용할 수 없다면 적용하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-025 · L42–42 | 이 때문에 청파 같이 게임 서비스 안에서 다음과 같은 불일치를 허용한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-026 · L44–44 | - 신규 게임과 Legacy 게임의 로비 UI가 다름 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-027 · L45–45 | - 신규 게임만 공통 초대 기능을 사용함 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-028 · L46–46 | - 신규 게임만 공통 reconnect/presence UX를 사용함 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-029 · L47–47 | - 버튼, 모달, 레이아웃 등 시각적 통일성이 완전하지 않음 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-030 · L48–48 | - Legacy 내부에 과거 중복 코드가 일부 남아 있음 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-031 · L50–50 | 통일감을 위해 정상 작동 중인 Legacy를 위험하게 수정하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-032 · L52–52 | Legacy 변경은 실제 장애, 보안, 데이터 손상, 동기화 오류 등 검증된 필요가 있을 때 최소 범위로 수행한다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 3. Legacy는 플랫폼 설계의 제약조건이 아니다

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-033 · L56–56 | 새 플랫폼은 기존 네 게임에 모두 끼워 맞출 수 있어야 하는 호환 프레임워크가 아니다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-034 · L58–58 | 기존 구조와 호환시키기 위해 새로운 공통 API가 복잡해지거나 예외가 늘어난다면 Legacy 적용을 포기한다. | 표현:예외 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-035 · L60–60 | 즉 판단 기준은 다음과 같다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-036 · L62–62 | - "기존 게임에도 적용 가능한가?"보다 "앞으로 수십 개 게임에 단순하고 안정적인가?"를 우선한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-037 · L63–63 | - Legacy와 신규 플랫폼의 차이를 줄이기 위한 adapter/예외 코드를 무분별하게 추가하지 않는다. | 표현:예외 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-038 · L64–64 | - 과거 중복을 제거하기 위해 Legacy 전체를 공통화하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-039 · L65–65 | - 앞으로 생길 중복을 막는 데 집중한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 4. 신규 게임의 기본 구조

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-040 · L69–69 | 신규 platform-native 게임은 Game Platform 위에 구현한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-041 · L71–71 | 신규 게임의 실제 구현 절차와 MUST / MUST NOT 규칙은 `docs/game-platform-development-rules.md`를 실행 기준으로 사용한다. | 본문:MUST,MUST NOT | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-042 · L73–73 | 플랫폼이 담당할 후보: | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-043 · L75–75 | - Game Registry | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-044 · L76–76 | - Auth / Approved Member Gate | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-045 · L77–77 | - Room / Lobby | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-046 · L78–78 | - Invite | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-047 · L79–79 | - Snapshot / Reconnect | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-048 · L80–80 | - Realtime invalidation | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-049 · L81–81 | - Presence | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-050 · L82–82 | - Versioned / Idempotent Action | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-051 · L83–83 | - 공통 오류 및 연결 상태 처리 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-052 · L84–84 | - 공통 Game Shell / Layout | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-053 · L85–85 | - 공통 플레이어 UI | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-054 · L86–86 | - 공통 테스트 계약 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-055 · L88–88 | 게임이 담당할 영역: | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-056 · L90–90 | - 게임 규칙 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-057 · L91–91 | - 게임별 상태 머신 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-058 · L92–92 | - 턴/라운드 진행 방식 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-059 · L93–93 | - 승패 조건 | 표현:조건 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-060 · L94–94 | - 카드/주사위/보드 등 도메인 모델 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-061 · L95–95 | - 게임별 애니메이션과 연출 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-062 · L96–96 | - 게임 특유의 테마와 UX | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-063 · L98–98 | 공통화 기준은 "비슷해 보이는가"가 아니라 **게임 규칙과 무관하게 동일한 책임인가**이다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 5. 서버 권위와 Realtime 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-064 · L102–102 | 신규 멀티플레이 게임은 다음 흐름을 기본으로 한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-065 · L104–113 | ```text<br>Client intent<br>→ authenticated game-specific RPC<br>→ membership / role / phase / expected_version 검증<br>→ transaction / row lock<br>→ authoritative DB state<br>→ Realtime invalidation<br>→ authorized snapshot refresh<br>→ UI render<br>``` | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-066 · L115–115 | Realtime 이벤트 자체를 게임 상태의 최종 진실로 사용하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-067 · L117–117 | Reconnect 시 이벤트를 처음부터 재생하는 대신 authoritative snapshot을 다시 받아 복원할 수 있어야 한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 6. Versioned / Idempotent Action 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-068 · L121–121 | 새 게임의 상태 변경 명령은 가능한 한 다음 식별자를 가진다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-069 · L123–127 | ```text<br>room_id<br>expected_version<br>client_action_id<br>``` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-070 · L129–129 | - `expected_version`: 오래된 클라이언트의 명령이 최신 상태를 덮어쓰지 못하게 한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-071 · L130–130 | - `client_action_id`: 네트워크 재시도나 중복 클릭이 같은 명령을 두 번 처리하지 않게 한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-072 · L131–131 | - 실제 게임별 RPC와 테이블 이름은 게임 namespace에 남겨 둔다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-073 · L133–133 | 플랫폼은 하나의 거대한 공통 게임 상태 테이블을 만들지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 7. Common Game Shell 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-074 · L137–137 | 신규 게임은 공통 Shell을 사용할 수 있다. | 표현:할 수 있다 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-075 · L139–139 | Shell이 담당하는 범위: | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-076 · L141–141 | - 게임 제목 / 설명 / 게임 목록 복귀 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-077 · L142–142 | - 현재 방 식별 정보 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-078 · L143–143 | - 연결 / 재연결 / 오프라인 / 오류 상태 표시 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-079 · L144–144 | - 공통 플레이어 roster | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-080 · L145–145 | - 메인 게임 영역과 보조 정보 영역의 기본 배치 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-081 · L146–146 | - 하단 공통 action 영역 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-082 · L148–148 | Shell은 게임 화면 전체 디자인을 고정하는 템플릿이 아니다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-083 · L150–150 | 각 게임은 Shell 안의 메인 게임 영역에서 보드, 카드, 주사위, 3D, 애니메이션, 테마 등 고유한 시각 표현을 자유롭게 구현한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-084 · L152–152 | 공통 Shell CSS는 전역 사이트에 강제로 주입하지 않고 신규 게임이 명시적으로 opt-in 한다. 이 원칙으로 Legacy 게임과 기존 커뮤니티 화면의 CSS 회귀를 방지한다. | 표현:원칙 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-085 · L154–154 | 연결 상태 UI 역시 Realtime 자체를 신뢰하는 표시가 아니라 authoritative snapshot refresh 상태를 사용자에게 보여주는 역할에 집중한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 8. Platform-native Invite 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-086 · L158–158 | 기존 게임별 초대 구현은 새 Game Platform의 호환 기준이 아니다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-087 · L160–160 | Read-only 영향 분석 결과 사이트에는 이미 `private.site_invites`, `site_invite_create/resolve/revoke`, `/invite.html`, `js/invites/`로 구성된 게임 비종속 공통 초대 기반이 있다. 이 기반은 재사용하고 Game Platform이 같은 기능을 다시 구현하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-088 · L162–162 | 신규 게임은 게임별 target type을 늘리지 않고 다음 표준을 사용한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-089 · L164–171 | ```text<br>target_type = game_room<br>target_id   = &lt;game-specific room id&gt;<br>metadata    = {<br>  game_id: "&lt;Game Registry id&gt;",<br>  platform_version: 1<br>}<br>``` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-090 · L173–173 | platform-native Invite 대상 게임은 반드시 다음 조건을 만족해야 한다. | 표현:반드시,조건 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-091 · L175–175 | - `platform === "shared"` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-092 · L176–176 | - `capabilities.online === true` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-093 · L177–177 | - `capabilities.invite === true` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-094 · L179–179 | 초대 metadata에 redirect URL을 저장하거나 신뢰하지 않는다. `game_id`를 Registry에서 확인한 뒤 Registry의 site-relative `href`만 목적지로 사용한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-095 · L181–181 | 초대 토큰 해석은 방 입장 권한을 부여하지 않는다. 최종 참가 여부는 각 게임의 Room/Lobby 서버 RPC가 승인회원, 멤버십, 정원, 방 상태 등의 정책을 다시 검증해서 결정한다. | 표현:승인,검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-096 · L183–183 | 현재 Legacy 소비자는 The Game의 `the_game_room` 흐름이며 Phase 3D에서 제거하거나 마이그레이션하지 않는다. Legacy 초대 제거가 필요하면 별도 작은 작업으로 진행한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-097 · L185–185 | 상세 영향 범위와 제거 경계는 `docs/game-platform-invite-analysis.md`에 기록한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 9. 추후 Remaster 전략

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-098 · L189–189 | Game Platform이 충분히 검증된 뒤 기존 게임을 새 플랫폼 위에서 다시 제공하고 싶다면 선택적으로 Remaster 버전을 새로 구현할 수 있다. | 표현:검증,할 수 있다 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-099 · L191–191 | 이때 기본 전략은 과거 코드를 억지로 마이그레이션하는 것이 아니라: | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-100 · L193–193 | 1. 기존 게임을 동작/규칙/UX 참고 자료로 사용 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-101 · L194–194 | 2. 검증된 Game Platform 공통 기능을 재사용 | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-102 · L195–195 | 3. 게임 고유 규칙과 연출을 새 플랫폼 규칙에 맞게 다시 구현 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-103 · L196–196 | 4. 신규 버전이 충분히 검증된 뒤 교체 여부를 별도로 판단 | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-104 · L198–198 | 따라서 현재 Legacy를 그대로 보존하는 것은 기술 부채를 방치하는 것이 아니라 미래의 안전한 재구현을 위한 의도적인 경계다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 10. 현재 단계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-105 · L202–213 | ```text<br>Stable Legacy stabilization<br>→ Phase 3A: Registry + Access Gate<br>→ Phase 3B: Room/Lobby + Snapshot/Reconnect + Versioned Action contracts<br>→ Phase 3C: Common Game Shell + connection/player UI contract<br>→ Phase 3D: platform-native game_room Invite + legacy invite impact analysis<br>→ Phase 3E: reusable DB/test contract gate<br>→ Phase 4: Can’t Stop 신규 구현 및 첫 production 검증 — COMPLETE<br>→ Post-Phase 4: Can’t Stop 피드백을 플랫폼 규칙/거버넌스에 환류<br>→ 다음 platform-native 게임으로 공통성 2차 검증<br>→ 필요 시 Legacy Remaster<br>``` | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-106 · L215–215 | Phase 3D까지의 공통 기반은 Legacy 게임 런타임에 강제로 연결하지 않는다. The Game의 기존 초대 흐름은 별도 Legacy 경로로 유지한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-107 · L217–217 | Phase 3E에서는 공통 게임 DB 스키마나 공통 RPC를 만들지 않는다. 대신 신규 온라인 게임이 반드시 검증해야 할 승인회원, 멤버십, host 권한, stale version, idempotency, 동시성, reconnect snapshot, private-state 노출 방지 시나리오를 공통 테스트 계약으로 고정한다. 상세 기준은 `docs/game-platform-db-test-contract.md`를 따른다. | 표현:반드시,승인,검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-108 · L219–219 | Can’t Stop은 이미 존재하는 게임을 플랫폼으로 옮기는 작업이 아니라, Phase 4에서 `games/cant-stop/` 아래에 처음부터 생성하는 첫 platform-native 게임이며 Phase 3E DB 계약의 첫 실제 소비자가 된다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-109 · L221–221 | Can’t Stop v1은 2026-09-21 production release까지 완료되어 Registry `online` / `invite`, authoritative DB/RPC, reconnect, rematch/leave, shared Invite, Game DB contract가 실제 한 게임의 전체 lifecycle에서 동작하는 것을 검증했다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 11. Platform-native 출시 후 검증 사이클

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-110 · L225–225 | 첫 production 게임의 성공은 Game Platform이 완성됐다는 뜻이 아니다. 각 출시는 **하나의 실전 표본**이며, 다음 게임에서도 공통 기반의 일반성을 다시 검증한다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-111 · L227–227 | 첫 production 검증을 통해 다음 경계는 유지할 가치가 확인됐다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-112 · L229–229 | - 인증/승인회원, Registry, Room/Lobby adapter, snapshot/reconnect, version/idempotency, Invite, DB contract는 SHARED 책임으로 재사용한다. | 표현:승인 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-113 · L230–230 | - production migration과 capability activation은 소스 구현과 분리한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-114 · L231–231 | - 게임 출시 시 문서 상태를 `RELEASED / main`으로 닫고, stacked PR과 임시 브랜치를 정리해야 다음 작업자가 과거 브랜치를 현재 기준으로 오해하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-115 · L232–232 | - 한 게임에서 발견된 편의 기능은 곧바로 shared abstraction으로 승격하지 않는다. 두 번째 이후 게임에서 같은 플랫폼 책임이 반복될 때 계약을 확장한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-116 · L234–234 | 따라서 현재 Game Platform의 다음 목표는 "공통 기능을 더 많이 만드는 것"이 아니라 **다음 신규 게임에서 기존 shared 계약을 가능한 한 그대로 사용하고, 실제로 반복되는 부족한 계약만 최소 확장하는 것**이다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 12. 장기 확장성 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-117 · L238–238 | Game Platform은 신규 게임이 추가될수록 함께 검증되고 개선되어야 한다. 게임 수가 늘어나는 것 자체보다 더 큰 위험은 각 게임이 서로 다른 구조·용어·권위 모델·배포 절차를 갖게 되어 **새 기능을 만들 때마다 저장소 전체를 다시 탐색해야 하는 상태**가 되는 것이다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-118 · L240–240 | 따라서 플랫폼의 장기 성공 기준은 단순한 코드 재사용률이 아니라 **신규 게임 한 개를 추가하는 데 필요한 탐색·판단·검증 비용이 통제되는가**로 본다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-119 · L242–242 | 새 게임을 출시할 때마다 다음을 반복한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-120 · L244–251 | ```text<br>기존 플랫폼 규칙으로 구현<br>→ 실제 개발 마찰 기록<br>→ release 후 플랫폼 회고<br>→ SHARED / GAME-LOCAL / RELEASE-OPERATIONS 재분류<br>→ 필요한 규칙·계약·테스트만 최소 수정<br>→ 다음 게임에서 다시 검증<br>``` | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-121 · L253–253 | 이 순환을 통해 플랫폼 규칙은 점점 더 많은 게임을 포괄하면서도 예외가 누적되는 방향이 아니라 **더 예측 가능하고 단순한 방향**으로 발전해야 한다. 새 규칙을 추가하는 것만이 개선이 아니며, 사용하지 않는 규칙을 제거하거나 중복된 절차를 합치고 과도한 추상화를 되돌리는 것도 동일하게 중요한 개선으로 본다. | 표현:예외 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

## INV-H — `docs/game-platform-invite-analysis.md`

- source: [docs/game-platform-invite-analysis.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-invite-analysis.md)
- blob: `645f565e9c9a2b069bb2be13d70e14c12af2a38f`; 원문 125줄; 상태 `HISTORY`; 45 관리단위 / 0 규칙·필드 단위.
- 현재 책임·실제 소비·관련 코드/테스트는 각 행의 증거 E-*와 인덱스의 책임표로 연결된다. 이는 준수 완료 판정이 아니다.


### Game Platform Invite Analysis

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-001 · L3–3 | &gt; **문서 분류:** HISTORY | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-002 · L5–5 | &gt; **문서 성격:** 이 문서는 Phase 3D 당시 기존 Invite 구조를 조사하고 platform-native Invite 방향을 결정한 분석 기록이다. 신규 게임의 현재 Invite 구현 규칙은 `docs/game-platform-development-rules.md`와 `games/shared/gameInvite.js`를 기준으로 한다. 이 문서는 필수 선행 계약 문서가 아니다. | 표현:필수 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 목적

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-003 · L9–9 | Phase 3D는 기존 게임 초대를 그대로 플랫폼 표준으로 승격하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-004 · L11–11 | 현재 초대 구현의 실제 영향 범위를 확인한 뒤, 재사용할 수 있는 사이트 공통 기반과 Legacy 전용 연결 코드를 분리하고 신규 platform-native 게임용 Invite 계약을 정의한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 현재 구조

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-005 · L15–15 | 사이트에는 이미 게임과 무관한 공통 초대 인프라가 있다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-006 · L17–29 | ```text<br>private.site_invites<br>├─ public.site_invite_create<br>├─ public.site_invite_resolve<br>└─ public.site_invite_revoke<br><br>/invite.html<br>└─ js/invites/<br>   ├─ inviteApi.js<br>   ├─ inviteEntry.js<br>   ├─ inviteRegistry.js<br>   └─ inviteShare.js<br>``` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-007 · L31–31 | 이 기반은 다음 기능을 이미 제공한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-008 · L33–33 | - 승인회원만 초대 생성/해석/취소 | 표현:승인 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-009 · L34–34 | - 64자리 임의 토큰 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-010 · L35–35 | - 만료시간 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-011 · L36–36 | - revoke | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-012 · L37–37 | - target type / target id / metadata 저장 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-013 · L38–38 | - 로그인 전 초대 URL return target 보존 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-014 · L39–39 | - 링크 복사 / QR / 네이티브 공유 UI | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-015 · L41–41 | 따라서 Phase 3D에서 같은 기능을 Game Platform 내부에 중복 구현하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Legacy 소비 현황

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-016 · L45–45 | 현재 확인된 게임 초대 소비자는 The Game이다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-017 · L47–53 | ```text<br>the-game/js/inviteIntegration.js<br>target_type = the_game_room<br>/invite.html<br>→ /the-game/?invite=&lt;token&gt;<br>→ The Game 전용 참가 흐름<br>``` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-018 · L55–55 | Liar Game / Drawing Spy / Marble에는 별도의 invite 전용 모듈이 확인되지 않았다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-019 · L57–57 | The Game 초대는 Legacy 동작으로 취급한다. Phase 3D에서 제거하거나 platform-native 계약으로 마이그레이션하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### Platform-native 표준

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-020 · L61–61 | 신규 게임은 게임별 target type을 계속 만들지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-021 · L63–70 | ```text<br>target_type = game_room<br>target_id   = &lt;game-specific room id&gt;<br>metadata    = {<br>  game_id: "&lt;registry game id&gt;",<br>  platform_version: 1<br>}<br>``` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-022 · L72–72 | 게임 목적지는 invite metadata에 URL로 저장하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-023 · L74–74 | `game_id`를 Game Registry에서 조회하고, Registry에 등록된 site-relative `href`만 신뢰한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-024 · L76–76 | 또한 다음 조건을 모두 만족한 게임만 platform-native Invite를 사용할 수 있다. | 표현:조건,할 수 있다 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-025 · L78–78 | - `platform === "shared"` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-026 · L79–79 | - `capabilities.online === true` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-027 · L80–80 | - `capabilities.invite === true` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-028 · L82–82 | 이 규칙으로 Legacy 게임이 의도치 않게 새 플랫폼 초대 흐름에 들어오는 것을 막는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 라우팅

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-029 · L86–98 | ```text<br>/invite.html?token=...<br>→ site_invite_resolve(token)<br>→ target_type = game_room<br>→ metadata.game_id 검증<br>→ Game Registry 검증<br>→ Registry href + ?invite=&lt;token&gt;<br>→ platform-native 게임<br>→ 해당 게임이 token을 다시 resolve<br>→ expected game id 검증<br>→ room id 획득<br>→ 게임별 Room/Lobby join RPC<br>``` | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-030 · L100–100 | 초대 토큰을 해석하는 것만으로 방 멤버가 되지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-031 · L102–102 | 최종 참가 권한, 정원, 방 상태, 중복 참가, 게임별 정책은 반드시 해당 게임의 서버 RPC가 결정한다. | 표현:반드시 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 보안 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-032 · L106–106 | - 초대 metadata의 임의 URL을 redirect 대상으로 사용하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-033 · L107–107 | - Registry에 없는 게임으로 이동하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-034 · L108–108 | - Legacy 게임은 `game_room` 대상이 될 수 없다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-035 · L109–109 | - invite capability를 명시하지 않은 신규 게임은 대상이 될 수 없다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-036 · L110–110 | - 다른 게임용 token을 현재 게임에서 해석하면 game mismatch로 거부한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-037 · L111–111 | - 지원하지 않는 platform version은 거부한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-038 · L112–112 | - client-side 검증은 편의/라우팅 경계이며 DB authorization을 대체하지 않는다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### 기존 The Game 초대 제거 시점

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-039 · L116–116 | The Game의 기존 초대 기능은 현재 정상 동작 보호를 위해 이번 Phase에서 그대로 둔다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-040 · L118–118 | 향후 제거를 결정한다면 별도 작은 작업으로 다음만 제거한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-041 · L120–120 | - `the-game/js/inviteIntegration.js` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-042 · L121–121 | - The Game의 invite script/style 연결 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-043 · L122–122 | - `the_game_room` handler | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-044 · L123–123 | - The Game 전용 invite E2E | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-045 · L125–125 | 사이트 공통 `site_invites`, `/invite.html`, `js/invites/` 자체는 신규 Game Platform에서도 사용하므로 제거 대상이 아니다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
