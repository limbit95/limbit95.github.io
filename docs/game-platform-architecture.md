# Game Platform vNext — 아키텍처 책임·적용 권위

> **문서 분류:** CURRENT
> **적용 범위:** 신규 vNext (기존 consumer 제외)

신규 vNext 상위 진입은 [AR](game-platform-architecture.md)다. 기존 consumer는 [기존 development](game-platform-development-rules.md)·[기존 UI](game-platform-ui-rules.md)·선택 DB의 기존 계약을 유지한다. 이 CURRENT는 topic+계약/consumer scope의 단일 본문이며 문서 존재는 runtime 구현/지원 완료가 아니다.

승인 근거: [STEP6 Target](game-platform-rebuild/artifacts/step-6-target-architecture.md), [전수 ID/f](game-platform-rebuild/artifacts/step-6-clause-destinations.md), [CP0089](game-platform-rebuild/checkpoints/CP-0089-step-6-design-result-approved.md), 실제 PR417/418 병합. STEP7A1 반영 PR은 REVIEW_PENDING이며 최종 결과 검토·병합은 남아 있다. 행동 NOT_RUN·UNKNOWN·후속 의무를 유지한다.

## AR1 적용·책임·의존

이 문서는 신규 vNext의 상위 진입/경계 owner다. 기존 consumer는 기존 development/UI/DB 계약을 유지하며 기존 Auth·게임·API·SQL·등록 metadata·shared barrel을 이관하지 않는다. 장르 문서와 코드 계층은 상속 구조가 아니다.

Core는 필수 식별·조립·실행 수명만 소유한다. Room/host/턴/DOM/tick/점수/DB를 기본값으로 강제하지 않는다. 선택 모델은 시간·세션·참여·권위·순서·입력·공간·지속성·현재성/최종 채택·복구를 책임진다. Snapshot과 Reconnect가 각각 최종 상태를 채택하지 않는다. backend는 실제 인가·권위 집행자이며 client Gate·표시flag·relay·prediction은 대체하지 못한다.

Capability는 실제 필요한 공통 의미, Site Adapter는 기존 사이트 서비스/정책 연결, game-local은 게임 규칙·상태 계산·실제 UI/VI·연출을 책임진다. Adapter에 새 권한·순서·수명·token/audio 엔진을 숨기지 않는다. Core는 특정 게임/사이트/선택 모델 구현을 역참조하지 않는다. 자원 최종 파괴권은 하나이며 게임은 site 공용자원 전체를 파괴하지 않고 자기 사용권을 반납한다. Profile은 실제 반복·검증된 조합의 recipe이며 선제 실행/상속 엔진을 만들지 않는다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-agent-036-f0"></a>
#### LEGACY-AGENT-036 / f0

- 원문: [AGENTS.md L60–60](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L60-L60); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- Legacy 보호 설명을 제외한 현재 Game Platform 공통 규칙·가이드·템플릿에는 특정 platform-native 게임명이나 그 게임만의 구현 세부사항을 기준 규칙으로 넣지 않습니다. 게임별 내용은 해당 게임의 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`, 게임별 테스트에 둡니다.
```

<a id="legacy-dev-002-f0"></a>
#### LEGACY-DEV-002 / f0

- 원문: [docs/game-platform-development-rules.md L5–5](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L5-L5); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C011.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 문서는 청파 같이에서 **새로운 platform-native 게임을 구현하거나 수정할 때 기본적으로 따라야 하는 실행 규칙**이다.
```

<a id="legacy-dev-003-f0"></a>
#### LEGACY-DEV-003 / f0

- 원문: [docs/game-platform-development-rules.md L7–7](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L7-L7); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C011.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
사용자가 매 작업마다 아래 규칙을 다시 설명하지 않아도, 신규 게임 작업은 이 문서를 기본 전제로 진행한다.
```

<a id="legacy-dev-004-f0"></a>
#### LEGACY-DEV-004 / f0

- 원문: [docs/game-platform-development-rules.md L9–9](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L9-L9); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C011.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`AGENTS.md`의 저장소 전체 작업 규칙은 그대로 적용되며, 이 문서는 Game Platform 영역의 추가 규칙이다. 게임별 UI/UX 조사·설계·구현은 `docs/game-platform-ui-rules.md`를 함께 필수 기준으로 적용한다. 문서 간 설명이 충돌하거나 현재 코드와 맞지 않는 경우 임의로 해석하지 않고 실제 코드와 테스트를 확인한 뒤 최소 범위로 정리한다.
```

<a id="legacy-dev-005-f0"></a>
#### LEGACY-DEV-005 / f0

- 원문: [docs/game-platform-development-rules.md L13–13](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L13-L13); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C012.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 규칙은 다음 작업에 적용한다.
```

<a id="legacy-dev-006-f0"></a>
#### LEGACY-DEV-006 / f0

- 원문: [docs/game-platform-development-rules.md L15–15](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L15-L15); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C012.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `games/&lt;game-id&gt;/` 아래 새 게임 생성
```

<a id="legacy-dev-007-f0"></a>
#### LEGACY-DEV-007 / f0

- 원문: [docs/game-platform-development-rules.md L16–16](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L16-L16); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C012.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기존 platform-native 게임 기능 추가 또는 수정
```

<a id="legacy-dev-008-f0"></a>
#### LEGACY-DEV-008 / f0

- 원문: [docs/game-platform-development-rules.md L17–17](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L17-L17); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C012.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 신규 게임의 Room/Lobby, Invite, Snapshot/Reconnect, Realtime, DB/RPC 연결
```

<a id="legacy-dev-009-f0"></a>
#### LEGACY-DEV-009 / f0

- 원문: [docs/game-platform-development-rules.md L18–18](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L18-L18); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C012.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 신규 게임 때문에 `games/shared/`의 공통 계약을 변경하려는 작업
```

<a id="legacy-dev-010-f0"></a>
#### LEGACY-DEV-010 / f0

- 원문: [docs/game-platform-development-rules.md L20–20](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L20-L20); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C012.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
다음 Legacy 게임은 이 규칙으로 강제 마이그레이션하지 않는다.
```

<a id="legacy-dev-011-f0"></a>
#### LEGACY-DEV-011 / f0

- 원문: [docs/game-platform-development-rules.md L22–22](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L22-L22); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C012.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Liar Game
```

<a id="legacy-dev-012-f0"></a>
#### LEGACY-DEV-012 / f0

- 원문: [docs/game-platform-development-rules.md L23–23](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L23-L23); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C012.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Drawing Spy
```

<a id="legacy-dev-013-f0"></a>
#### LEGACY-DEV-013 / f0

- 원문: [docs/game-platform-development-rules.md L24–24](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L24-L24); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C012.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- The Game
```

<a id="legacy-dev-014-f0"></a>
#### LEGACY-DEV-014 / f0

- 원문: [docs/game-platform-development-rules.md L25–25](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L25-L25); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C012.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Blue Marble / Marble
```

<a id="legacy-dev-015-f0"></a>
#### LEGACY-DEV-015 / f0

- 원문: [docs/game-platform-development-rules.md L27–27](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L27-L27); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C012.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Legacy의 현재 동작 보호가 우선이며, 신규 플랫폼과 맞추기 위한 이유만으로 Legacy를 수정하지 않는다.
```

<a id="legacy-dev-016-f0"></a>
#### LEGACY-DEV-016 / f0

- 원문: [docs/game-platform-development-rules.md L31–31](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L31-L31); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 표현:반드시; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C013.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- **MUST**: 신규 platform-native 게임에서 반드시 지켜야 한다.
```

<a id="legacy-dev-017-f0"></a>
#### LEGACY-DEV-017 / f0

- 원문: [docs/game-platform-development-rules.md L32–32](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L32-L32); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C013.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- **MUST NOT**: 신규 platform-native 게임에서 사용하면 안 된다.
```

<a id="legacy-dev-018-f0"></a>
#### LEGACY-DEV-018 / f0

- 원문: [docs/game-platform-development-rules.md L33–33](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L33-L33); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C013.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- **SHOULD**: 특별한 이유가 없다면 기본적으로 따른다.
```

<a id="legacy-dev-019-f0"></a>
#### LEGACY-DEV-019 / f0

- 원문: [docs/game-platform-development-rules.md L34–34](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L34-L34); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C013.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- **GAME-LOCAL**: 해당 게임의 규칙과 구현에 남겨야 하는 영역이다.
```

<a id="legacy-dev-020-f0"></a>
#### LEGACY-DEV-020 / f0

- 원문: [docs/game-platform-development-rules.md L35–35](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L35-L35); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C013.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- **SHARED**: 게임 규칙과 무관하게 미래 게임에서도 반복되는 플랫폼 책임이다.
```

<a id="legacy-dev-021-f0"></a>
#### LEGACY-DEV-021 / f0

- 원문: [docs/game-platform-development-rules.md L36–36](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L36-L36); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C013.
- 승인된 적용/전환: 원적용/용어 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- **ARCHITECTURE CHANGE**: 하위 topic-owner에서 발견한 필요가 현재 상위 Game Platform 규칙이나 shared contract의 허용 범위를 벗어나지만, 토의 결과 특정 게임의 예외가 아니라 플랫폼 전반에 필요한 변경으로 명시적으로 승격된 작업이다.
```

<a id="legacy-dev-144-f0"></a>
#### LEGACY-DEV-144 / f0

- 원문: [docs/game-platform-development-rules.md L285–285](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L285-L285); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C028.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
현재 공통 기반에 해당 책임이 있다면 신규 게임이 다시 구현하지 않는다.
```

<a id="legacy-dev-145-f0"></a>
#### LEGACY-DEV-145 / f0

- 원문: [docs/game-platform-development-rules.md L287–287](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L287-L287); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C028.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Game Registry
```

<a id="legacy-dev-146-f0"></a>
#### LEGACY-DEV-146 / f0

- 원문: [docs/game-platform-development-rules.md L288–288](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L288-L288); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C028.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Approved Member / Access Gate
```

<a id="legacy-dev-147-f0"></a>
#### LEGACY-DEV-147 / f0

- 원문: [docs/game-platform-development-rules.md L289–289](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L289-L289); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C028.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Room / Lobby 계약
```

<a id="legacy-dev-148-f0"></a>
#### LEGACY-DEV-148 / f0

- 원문: [docs/game-platform-development-rules.md L290–290](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L290-L290); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C028.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Versioned / Idempotent Action envelope
```

<a id="legacy-dev-149-f0"></a>
#### LEGACY-DEV-149 / f0

- 원문: [docs/game-platform-development-rules.md L291–291](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L291-L291); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C028.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Snapshot Coordinator
```

<a id="legacy-dev-150-f0"></a>
#### LEGACY-DEV-150 / f0

- 원문: [docs/game-platform-development-rules.md L292–292](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L292-L292); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C028.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Reconnect refresh trigger
```

<a id="legacy-dev-151-f0"></a>
#### LEGACY-DEV-151 / f0

- 원문: [docs/game-platform-development-rules.md L293–293](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L293-L293); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C028.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Common Game Shell
```

<a id="legacy-dev-152-f0"></a>
#### LEGACY-DEV-152 / f0

- 원문: [docs/game-platform-development-rules.md L294–294](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L294-L294); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C028.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- connection/player view-state
```

<a id="legacy-dev-153-f0"></a>
#### LEGACY-DEV-153 / f0

- 원문: [docs/game-platform-development-rules.md L295–295](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L295-L295); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C028.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- platform-native Invite
```

<a id="legacy-dev-154-f0"></a>
#### LEGACY-DEV-154 / f0

- 원문: [docs/game-platform-development-rules.md L296–296](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L296-L296); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C028.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- DB/Test Contract Gate
```

<a id="legacy-dev-155-f0"></a>
#### LEGACY-DEV-155 / f0

- 원문: [docs/game-platform-development-rules.md L300–300](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L300-L300); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C029.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
다음은 각 게임 내부에 남긴다.
```

<a id="legacy-dev-156-f0"></a>
#### LEGACY-DEV-156 / f0

- 원문: [docs/game-platform-development-rules.md L302–302](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L302-L302); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C029.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임 규칙
```

<a id="legacy-dev-157-f0"></a>
#### LEGACY-DEV-157 / f0

- 원문: [docs/game-platform-development-rules.md L303–303](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L303-L303); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C029.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 턴/라운드 상태 머신
```

<a id="legacy-dev-158-f0"></a>
#### LEGACY-DEV-158 / f0

- 원문: [docs/game-platform-development-rules.md L304–304](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L304-L304); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C029.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 승리/패배 조건
```

<a id="legacy-dev-159-f0"></a>
#### LEGACY-DEV-159 / f0

- 원문: [docs/game-platform-development-rules.md L305–305](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L305-L305); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C029.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 보드, 카드, 주사위 등 도메인 모델
```

<a id="legacy-dev-160-f0"></a>
#### LEGACY-DEV-160 / f0

- 원문: [docs/game-platform-development-rules.md L306–306](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L306-L306); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C029.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임별 상태와 계산
```

<a id="legacy-dev-161-f0"></a>
#### LEGACY-DEV-161 / f0

- 원문: [docs/game-platform-development-rules.md L307–307](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L307-L307); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C029.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임 특유의 애니메이션과 연출
```

<a id="legacy-dev-162-f0"></a>
#### LEGACY-DEV-162 / f0

- 원문: [docs/game-platform-development-rules.md L308–308](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L308-L308); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C029.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임 테마와 Visual Identity, 독립 페이지 레이아웃, 카드/보드/칩 등 구성물 표현
```

<a id="legacy-dev-163-f0"></a>
#### LEGACY-DEV-163 / f0

- 원문: [docs/game-platform-development-rules.md L309–309](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L309-L309); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C029.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임-local UI의 상세 설계는 `UI_DESIGN.md`와 `docs/game-platform-ui-rules.md`를 따른다.
```

<a id="legacy-dev-164-f0"></a>
#### LEGACY-DEV-164 / f0

- 원문: [docs/game-platform-development-rules.md L313–313](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L313-L313); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C030.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
공통화 기준은 "코드가 비슷해 보이는가"가 아니라 **게임 규칙과 무관하게 동일한 책임인가**이다.
```

<a id="legacy-dev-165-f0"></a>
#### LEGACY-DEV-165 / f0

- 원문: [docs/game-platform-development-rules.md L315–315](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L315-L315); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST NOT; 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C030.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
한 게임에서만 필요한 예외를 위해 `games/shared/` API를 복잡하게 만들지 않는다.
```

<a id="legacy-dev-166-f0"></a>
#### LEGACY-DEV-166 / f0

- 원문: [docs/game-platform-development-rules.md L319–319](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L319-L319); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C031.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Legacy 보호 경계를 설명하기 위해 기존 Legacy 게임을 명시하는 경우를 제외하면, 현재 실행 규칙·공통 가이드·템플릿은 특정 platform-native 게임 이름, 경로, 상태 머신 또는 구현 세부사항을 신규 게임의 기준으로 삼지 않는다.
```

<a id="legacy-dev-167-f0"></a>
#### LEGACY-DEV-167 / f0

- 원문: [docs/game-platform-development-rules.md L321–321](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L321-L321); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C031.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 신규 게임을 설명하는 예시는 `&lt;game-id&gt;`, `example-game` 같은 중립적인 placeholder를 사용한다.
```

<a id="legacy-dev-168-f0"></a>
#### LEGACY-DEV-168 / f0

- 원문: [docs/game-platform-development-rules.md L322–322](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L322-L322); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C031.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 특정 platform-native 게임의 실제 규칙·UI·DB 구조·release 상태는 해당 게임의 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`, 게임별 테스트에 둔다.
```

<a id="legacy-dev-169-f0"></a>
#### LEGACY-DEV-169 / f0

- 원문: [docs/game-platform-development-rules.md L323–323](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L323-L323); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:반드시; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C031.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 과거 플랫폼 구축 과정을 보존하는 strategy/analysis 문서는 특정 게임 이력을 기록할 수 있지만, 반드시 현재 실행 규칙보다 우선하지 않는 참고 문서임을 명시한다.
```

<a id="legacy-dev-170-f0"></a>
#### LEGACY-DEV-170 / f0

- 원문: [docs/game-platform-development-rules.md L324–324](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L324-L324); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C031.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 한 게임에서 검증된 구현을 다른 게임에 그대로 요구하지 않고, 반복해서 확인된 게임 비종속 책임만 SHARED 계약으로 승격한다.
```

<a id="legacy-dev-171-f0"></a>
#### LEGACY-DEV-171 / f0

- 원문: [docs/game-platform-development-rules.md L325–325](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L325-L325); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:반드시; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C031.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `docs/game-platform-*.md` 문서는 제목 아래에 `&gt; **문서 분류:** CURRENT` 또는 `HISTORY`를 반드시 선언한다.
```

<a id="legacy-dev-172-f0"></a>
#### LEGACY-DEV-172 / f0

- 원문: [docs/game-platform-development-rules.md L326–326](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L326-L326); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C031.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `CURRENT` 문서는 현재 Registry의 어떤 platform-native 게임명/ID도 공통 규칙으로 포함하지 않는다.
```

<a id="legacy-dev-173-f0"></a>
#### LEGACY-DEV-173 / f0

- 원문: [docs/game-platform-development-rules.md L327–327](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L327-L327); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C031.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 메인 규칙서 자신을 제외한 모든 `docs/game-platform-*.md`는 `docs/game-platform-development-rules.md`를 현재 rulebook으로 명시해야 한다.
```

<a id="legacy-dev-174-f0"></a>
#### LEGACY-DEV-174 / f0

- 원문: [docs/game-platform-development-rules.md L328–328](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L328-L328); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C031.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `HISTORY` 문서는 과거 구현 이력을 기록할 수 있지만 현재 규칙·템플릿·구현 기준으로 사용하지 않는다.
```

<a id="legacy-dev-175-f0"></a>
#### LEGACY-DEV-175 / f0

- 원문: [docs/game-platform-development-rules.md L329–329](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L329-L329); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C031.
- 승인된 적용/전환: 공통/local/원game-agnostic범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `AGENTS.md`와 `games/` 최상위의 공통 Markdown 문서는 별도 표기가 없어도 `CURRENT`로 취급한다.
```

<a id="legacy-ui-075-f0"></a>
#### LEGACY-UI-075 / f0

- 원문: [docs/game-platform-ui-rules.md L133–133](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L133-L133); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C090.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 규칙 모달의 시각적 polish를 이유로 공통 Shell, authoritative state, 게임 규칙 계산을 UI layer에서 다시 구현하지 않는다.
```

<a id="legacy-ui-217-f0"></a>
#### LEGACY-UI-217 / f0

- 원문: [docs/game-platform-ui-rules.md L391–391](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L391-L391); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C108.
- 승인된 적용/전환: 공통화경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
게임 하나에서 편리했던 CSS, 컴포넌트, 애니메이션을 즉시 `games/shared/` 공통 계약으로 승격하지 않는다.
```

<a id="legacy-ui-218-f0"></a>
#### LEGACY-UI-218 / f0

- 원문: [docs/game-platform-ui-rules.md L393–393](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L393-L393); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C108.
- 승인된 적용/전환: 공통화경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
게임 규칙과 무관하게 여러 신규 게임에서 반복되는 접근성, 연결 상태, Room/Lobby 같은 책임만 기존 Game Platform 규칙에 따라 SHARED 후보로 검토한다.
```

<a id="legacy-ui-219-f0"></a>
#### LEGACY-UI-219 / f0

- 원문: [docs/game-platform-ui-rules.md L395–395](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L395-L395); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C108.
- 승인된 적용/전환: 공통화경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Visual Identity와 game-specific presentation은 기본적으로 GAME-LOCAL에 유지한다.
```

## AR2 계약 식별·호환

이 인덱스가 계약 식별자→owner/절→유효 승인→적용 consumer scope를 연결한다. /1은 STEP6에서 승인된 첫 의미 revision이며 wire/API/schema version이나 구현 지원 인증이 아니다.

| 계약 | 단일 본문 owner | 적용 |
|---|---|---|
| GP-COMMON/1 | [CO](game-platform-common-rules.md) CO1~5 | 신규 vNext 개발/품질 |
| GP-LIFETIME/1 | [LI](game-platform-lifetime-contract.md) LI1~3 | 모든 적용 owner의 전체완료/정리 |
| GP-MODELS/1 | [MO](game-platform-model-contracts.md) MO1~6 | 실제 선택 모델·미지원 구분 |
| GP-CAPABILITIES/1 | [CA](game-platform-capability-contracts.md) CA1~6 | 선택된 기능의 책임/조건 |
| GP-GENRE-BOARD/1 | [BO1~4](game-platform-board-rules.md) 실제 하위 본문 | 신규 vNext 보드 경험; 기존 consumer 제외 |
| GP-GENRE-REALTIME-COOP/1 | [RT1~6](game-platform-realtime-coop-rules.md) 실제 하위 본문 | 신규 vNext의 제한 실시간협동/공간 경험; 기존 consumer 제외 |

GAME_SPEC에 적용 계약ID/revision·실제 선택모델 계약·장르·Capability·비적용/미지원/미정·선택이유·검증 링크를 기록한다. 구체 모델 식별자는 실제 정의될 때 부여한다. 기존 게임 비교기준 legacy@f34f4f1은 문서 지칭이며 Registry나 기존 게임에 필드를 강제하지 않는다. Invite VERSION=1·legacy SQL v1.0.0·실행계획1.5를 플랫폼 전체 계약 버전으로 쓰지 않는다.

같은 public API라도 인가·수명·순서·결과/정정 의미 변경은 revision/consumer 재검토 대상이다. 편집/링크 정정과 구분하고 latest/정수 크기만으로 호환을 추정하지 않는다. 제공 구현의 명시적 호환 증거가 필요하며 한 모델 구현이 다른 모델 지원을 뜻하지 않는다. 구체 API/schema/class/전역semver/wire 협상은 이 문서로 동결하지 않는다.

## AR3 기존 공존·적용 전환

기존 계약 범위의 development/UI/DB 본문과 게임별 네 문서·Auth/API/SQL을 유지한다. 신규 vNext 공통 owner는 이 인덱스→CO/LI/MO/CA이며 이전 본문은 해당 원문/기존scope의 참조다. 원문/기존적용을 무차별 HISTORY로 바꾸지 않는다. 같은 topic+계약/consumer scope에 경쟁하는 CURRENT 본문을 두지 않는다.

권위 전환의 최소 단위는 AR/CO/LI·승인 MO/CA 본문·진입/네템플릿/GV·해당 literal/필수절/참조 Guard와 테스트다. BO/RT가 실제 반영되기 전 유효 계승 경로를 제거하지 않는다. 전체7A1/7A2/7A3/7B를 한 대형PR로 합치지 않는다.

신규 browser 경로 games/shared/vnext/와 server 전용 services/game-platform-vnext/는 승인된 후속 배치다. 지금 runtime/서버 구현·exports는 없다. 기존 games/shared/index.js를 신규 재수출 통로로 바꾸지 않는다. 중첩 모듈 탐지/test발견·server의 browser-import/정적 배포 제외는7B에서 코드 추가 전에 준비해야 한다. 폴더명은 비밀 경계가 아니며 비밀을 Git/browser bundle에 넣지 않는다.

현재 Registry 전수 영향도는 GV 절차에 따라 근거와 COMPLIANT/MIGRATION_REQUIRED/NOT_APPLICABLE로 기록한다. MIGRATION_REQUIRED면 기존 게임 이관 대신 vNext 격리 경계를 수정하고 핵심 변경은 설계 게이트로 반환한다. 이번 문서 연결은 실행 회귀/지원 완료 증거가 아니다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-agent-035-f0"></a>
#### LEGACY-AGENT-035 / f0

- 원문: [AGENTS.md L59–59](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L59-L59); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- Legacy 게임 소스는 참고 자료일 뿐 신규 게임의 기본 구조나 공통 계약으로 사용하지 않습니다.
```

<a id="legacy-dev-366-f0"></a>
#### LEGACY-DEV-366 / f0

- 원문: [docs/game-platform-development-rules.md L725–725](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L725-L725); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C054.
- 승인된 적용/전환: 기존게임보존 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 게임 개발 중 다음을 기본값으로 한다.
```

<a id="legacy-dev-367-f0"></a>
#### LEGACY-DEV-367 / f0

- 원문: [docs/game-platform-development-rules.md L727–727](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L727-L727); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C054.
- 승인된 적용/전환: 기존게임보존 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Legacy 파일을 수정하지 않는다.
```

<a id="legacy-dev-368-f0"></a>
#### LEGACY-DEV-368 / f0

- 원문: [docs/game-platform-development-rules.md L728–728](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L728-L728); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C054.
- 승인된 적용/전환: 기존게임보존 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Legacy DB/RPC를 새 게임의 공통 인터페이스로 삼지 않는다.
```

<a id="legacy-dev-369-f0"></a>
#### LEGACY-DEV-369 / f0

- 원문: [docs/game-platform-development-rules.md L729–729](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L729-L729); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C054.
- 승인된 적용/전환: 기존게임보존 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Legacy의 중복 코드를 제거하기 위해 신규 게임 작업 범위를 확장하지 않는다.
```

<a id="legacy-dev-370-f0"></a>
#### LEGACY-DEV-370 / f0

- 원문: [docs/game-platform-development-rules.md L730–730](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L730-L730); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C054.
- 승인된 적용/전환: 기존게임보존 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Legacy와 신규 게임의 UI 불일치를 이유로 Legacy를 마이그레이션하지 않는다.
```

<a id="legacy-dev-371-f0"></a>
#### LEGACY-DEV-371 / f0

- 원문: [docs/game-platform-development-rules.md L732–732](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L732-L732); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C054.
- 승인된 적용/전환: 기존게임보존 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Legacy에서 확인된 패턴은 참고 자료일 뿐 신규 플랫폼의 계약이 아니다.
```

<a id="legacy-dev-372-f0"></a>
#### LEGACY-DEV-372 / f0

- 원문: [docs/game-platform-development-rules.md L734–734](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L734-L734); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C054.
- 승인된 적용/전환: 기존게임보존 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Legacy 변경이 필요해 보이면 현재 신규 게임 PR에 섞지 않고 실제 장애/보안/데이터/동기화 위험인지 별도로 검토한다.
```

## AR4 장르·모델·절차 인덱스

상위→공통→경험 장르→네 문서 bootstrap→실제 모델/Capability→검증 순서로 찾는다. 신규 보드는 CO→보드 원문/승인계승→네문서→MO/CA, 실시간2D협동은 CO→승인R01~13→네문서→MO/CA, room·host없는local/async는 실제 경험에 맞는 기존경로/차이조사→run/기록/권위조건→검증을 따른다. 장르명에서 transport/renderer/tick/physics/prediction을 선택하지 않는다.

보드의 실제 하위 owner: [BO1~4](game-platform-board-rules.md), 문서 계약 `GP-GENRE-BOARD/1`. 신규 보드 경험은 CO→BO→네 문서→MO/CA→검증으로 연결한다. 고정 원문/승인 계승의 발견 경로는 [기존 development](game-platform-development-rules.md), [기존 UI](game-platform-ui-rules.md), [승인 B01~12/조건](game-platform-rebuild/artifacts/step-5c-board-rule-succession.md)에 보존한다. 기존 consumer는 원래 scope를 유지한다.

실시간 협동·공간 경험의 실제 하위 owner는 [RT1~6](game-platform-realtime-coop-rules.md), 문서 계약 GP-GENRE-REALTIME-COOP/1이다. [고정 R01~13/최소6항목](game-platform-rebuild/artifacts/step-5c-realtime-coop-spatial-rules.md), [장르/모델 연결](game-platform-rebuild/artifacts/step-5c-genre-model-connections.md)의 승인 조건·trace는 보존한다. 단지2D/online으로 RT를 강제하지 않으며 게임/엔진/실제지원은 미선택·미검증이다.

[CO](game-platform-common-rules.md), [LI](game-platform-lifetime-contract.md), [MO](game-platform-model-contracts.md), [CA](game-platform-capability-contracts.md), [기존 Governance](game-platform-governance.md)를 따른다. 혼합장르는 phase/행동/역할별로 적용하며 같은 상태를 둘이 다른 권위/순서/종료로 정의하면 단순합집합/더엄격한쪽으로 해결하지 않고 해당 경계만 Architecture Change로 반환한다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-agent-031-f0"></a>
#### LEGACY-AGENT-031 / f0

- 원문: [AGENTS.md L55–55](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L55-L55); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 표현:반드시; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `games/&lt;game-id&gt;/` 아래 신규 platform-native 게임을 생성하거나 수정하기 전에 반드시 `docs/game-platform-development-rules.md`와 `docs/game-platform-ui-rules.md`를 읽고 따릅니다.
```

<a id="legacy-agent-032-f0"></a>
#### LEGACY-AGENT-032 / f0

- 원문: [AGENTS.md L56–56](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L56-L56); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 사용자가 매번 Game Platform 규칙이나 UI 조사/설계 규칙을 다시 명시하지 않아도 두 문서를 신규 게임 작업의 기본 전제로 적용합니다.
```

<a id="legacy-agent-034-f0"></a>
#### LEGACY-AGENT-034 / f0

- 원문: [AGENTS.md L58–58](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L58-L58); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `docs/game-platform-strategy.md`와 `docs/game-platform-invite-analysis.md`는 배경/이력 참고 문서이며 신규 게임 작업의 필수 선행 문서로 취급하지 않습니다.
```

<a id="legacy-dev-433-f0"></a>
#### LEGACY-DEV-433 / f0

- 원문: [docs/game-platform-development-rules.md L849–849](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L849-L849); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C060.
- 승인된 적용/전환: 권위/진입 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 platform-native 게임 구현에서 문서 우선순위는 다음과 같다.
```

<a id="legacy-dev-434-f0"></a>
#### LEGACY-DEV-434 / f0

- 원문: [docs/game-platform-development-rules.md L851–851](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L851-L851); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C060.
- 승인된 적용/전환: 권위/진입 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. **이 문서** — 현재 실행 규칙의 최상위 기준
```

<a id="legacy-dev-435-f0"></a>
#### LEGACY-DEV-435 / f0

- 원문: [docs/game-platform-development-rules.md L852–852](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L852-L852); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C060.
- 승인된 적용/전환: 권위/진입 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. **`docs/game-platform-ui-rules.md`** — 신규 게임 UI 조사·Visual Identity·UI_DESIGN/UI_DECISIONS 관리와 presentation 실행 규칙
```

<a id="legacy-dev-436-f0"></a>
#### LEGACY-DEV-436 / f0

- 원문: [docs/game-platform-development-rules.md L853–853](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L853-L853); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C060.
- 승인된 적용/전환: 권위/진입 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. **`docs/game-platform-governance.md`** — 공통 규칙 변경 전파, Architecture Change 승격 이후 영향도 감사와 자동 Guard 경계
```

<a id="legacy-dev-437-f0"></a>
#### LEGACY-DEV-437 / f0

- 원문: [docs/game-platform-development-rules.md L854–854](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L854-L854); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C060.
- 승인된 적용/전환: 권위/진입 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. **실제 `games/shared/` 코드와 계약 테스트** — 현재 구현된 계약의 최종 확인
```

<a id="legacy-dev-438-f0"></a>
#### LEGACY-DEV-438 / f0

- 원문: [docs/game-platform-development-rules.md L855–855](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L855-L855); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C060.
- 승인된 적용/전환: 권위/진입 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
5. **`docs/game-platform-db-test-contract.md`** — DB/RPC 작업 시 적용하는 정식 품질 계약
```

<a id="legacy-dev-439-f0"></a>
#### LEGACY-DEV-439 / f0

- 원문: [docs/game-platform-development-rules.md L856–856](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L856-L856); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C060.
- 승인된 적용/전환: 권위/진입 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
6. **`games/README.md`** — 현재 shared 모듈과 디렉터리 안내
```

<a id="legacy-dev-440-f0"></a>
#### LEGACY-DEV-440 / f0

- 원문: [docs/game-platform-development-rules.md L858–858](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L858-L858); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C060.
- 승인된 적용/전환: 권위/진입 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
다음 문서는 **배경/이력 참고용**이며 신규 게임 개발의 필수 선행 문서가 아니다.
```

<a id="legacy-dev-441-f0"></a>
#### LEGACY-DEV-441 / f0

- 원문: [docs/game-platform-development-rules.md L860–860](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L860-L860); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C060.
- 승인된 적용/전환: 권위/진입 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `docs/game-platform-strategy.md`: 플랫폼을 왜 이런 구조로 만들었는지에 대한 전략과 단계 기록
```

<a id="legacy-dev-442-f0"></a>
#### LEGACY-DEV-442 / f0

- 원문: [docs/game-platform-development-rules.md L861–861](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L861-L861); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C060.
- 승인된 적용/전환: 권위/진입 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `docs/game-platform-invite-analysis.md`: Phase 3D 당시 Invite 구조 조사와 결정 과정
```

<a id="legacy-dev-443-f0"></a>
#### LEGACY-DEV-443 / f0

- 원문: [docs/game-platform-development-rules.md L863–863](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L863-L863); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C060.
- 승인된 적용/전환: 권위/진입 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
배경 문서와 현재 실행 규칙이 다르게 보일 경우 과거 문서를 현재 계약으로 재해석하지 않는다. 현재 규칙서와 실제 코드·테스트를 우선하고, 불일치가 의심되면 별도 문서 정합성 작업으로 다룬다.
```

<a id="legacy-guide-001-f0"></a>
#### LEGACY-GUIDE-001 / f0

- 원문: [games/README.md L3–3](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L3-L3); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C109.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 디렉터리는 앞으로 추가되는 게임을 위한 공통 Game Platform 기반입니다.
```

<a id="legacy-guide-002-f0"></a>
#### LEGACY-GUIDE-002 / f0

- 원문: [games/README.md L5–5](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L5-L5); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C109.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 platform-native 게임을 구현하거나 수정할 때는 &#91;Game Platform Development Rules&#93;(../docs/game-platform-development-rules.md)와 &#91;Game Platform UI Design Rules&#93;(../docs/game-platform-ui-rules.md)를 **필수 실행 기준**으로 먼저 확인합니다. 사용자가 매 작업마다 플랫폼 규칙이나 UI 조사/설계를 다시 설명하지 않아도 두 문서를 기본 전제로 적용합니다.
```

<a id="legacy-guide-003-f0"></a>
#### LEGACY-GUIDE-003 / f0

- 원문: [games/README.md L7–7](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L7-L7); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C109.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
&#91;Game Platform Strategy&#93;(../docs/game-platform-strategy.md)는 플랫폼 구축 배경과 Legacy 정책을 이해하기 위한 참고 문서이며, 신규 게임의 현재 실행 규칙보다 우선하지 않습니다.
```

<a id="legacy-guide-004-f0"></a>
#### LEGACY-GUIDE-004 / f0

- 원문: [games/README.md L11–11](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L11-L11); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기존 `liar-game/`, `the-game/`, `marble-game/`은 기존 경로와 런타임을 유지합니다.
```

<a id="legacy-guide-005-f0"></a>
#### LEGACY-GUIDE-005 / f0

- 원문: [games/README.md L12–12](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L12-L12); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Drawing Spy는 Liar Game 내부 모드이므로 별도 루트로 이동하지 않습니다.
```

<a id="legacy-guide-006-f0"></a>
#### LEGACY-GUIDE-006 / f0

- 원문: [games/README.md L13–13](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L13-L13); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기존 게임은 새 플랫폼 기능이나 공통 레이아웃을 강제로 적용하지 않습니다.
```

<a id="legacy-guide-007-f0"></a>
#### LEGACY-GUIDE-007 / f0

- 원문: [games/README.md L14–14](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L14-L14); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 새 게임은 가능한 한 `games/&lt;game-id&gt;/` 아래에 두고 `games/shared/`의 공통 계약을 사용합니다.
```

<a id="legacy-guide-008-f0"></a>
#### LEGACY-GUIDE-008 / f0

- 원문: [games/README.md L15–15](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L15-L15); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 신규 게임은 runtime 구현 전에 `games/GAME_SPEC_TEMPLATE.md`, `games/DEVELOPMENT_TEMPLATE.md`, `games/UI_DESIGN_TEMPLATE.md`, `games/UI_DECISIONS_TEMPLATE.md`를 기준으로 `games/&lt;game-id&gt;/GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`를 만들고, 기능 기준과 디자인 기준뿐 아니라 각 트랙의 진행 기록 경계까지 먼저 정리합니다.
```

<a id="legacy-guide-009-f0"></a>
#### LEGACY-GUIDE-009 / f0

- 원문: [games/README.md L16–16](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L16-L16); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`만 존재하는 bootstrap 디렉터리는 미완성 게임 노출을 막기 위해 Registry 등록 전 상태로 둘 수 있습니다. runtime 파일을 추가하는 순간 Registry 규칙이 적용됩니다.
```

<a id="legacy-guide-010-f0"></a>
#### LEGACY-GUIDE-010 / f0

- 원문: [games/README.md L17–17](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L17-L17); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 각 platform-native 게임은 `GAME_SPEC.md`를 현재 기능 설계 기준, `DEVELOPMENT.md`를 기능 구현·검증 진행 인수인계, `UI_DESIGN.md`를 runtime 개발 전 디자인 전수 조사·분석과 최초 Phase를 담은 baseline, `UI_DECISIONS.md`를 개발 시작 후 디자인 진행·변경 의사결정·검증과 baseline override 이력으로 관리합니다.
```

<a id="legacy-guide-011-f0"></a>
#### LEGACY-GUIDE-011 / f0

- 원문: [games/README.md L18–18](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L18-L18); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `기능 체크포인트 기록하자`는 `DEVELOPMENT.md` 중심의 기능 handoff 명령이며 기능 설계 변경이 있을 때만 `GAME_SPEC.md`를 함께 정합화합니다. 디자인 문서는 이 명령 때문에 수정하지 않습니다.
```

<a id="legacy-guide-012-f0"></a>
#### LEGACY-GUIDE-012 / f0

- 원문: [games/README.md L19–19](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L19-L19); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `디자인 체크포인트 기록하자`는 `UI_DECISIONS.md` 중심의 디자인 handoff 명령이며 현재까지 안정화된 확정 디자인 decision만 기록합니다. `UI_DESIGN.md` baseline과 기능 진행 문서는 이 명령 때문에 수정하지 않습니다.
```

<a id="legacy-guide-013-f0"></a>
#### LEGACY-GUIDE-013 / f0

- 원문: [games/README.md L20–20](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L20-L20); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 표현:할 수 있습니다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 두 명령은 한 요청에서 함께 사용할 수 있습니다. 접두어가 없는 일반적인 checkpoint 표현이나 새 채팅용 정리·문서·요약 요청은 공식 repository checkpoint 명령으로 확대 해석하지 않습니다. 유효한 현재 작업 브랜치가 있으면 그 브랜치에 commit하고, 없으면 저장소의 일반 브랜치 규칙에 따라 별도 작업 브랜치를 사용합니다.
```

<a id="legacy-guide-014-f0"></a>
#### LEGACY-GUIDE-014 / f0

- 원문: [games/README.md L21–21](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L21-L21); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 두 사용자 명령과 별개로 기능 Phase 완료, 디자인 lifecycle 기록 트리거, release closeout 등 규칙 문서의 기존 자동 갱신 시점은 그대로 유지합니다.
```

<a id="legacy-guide-015-f0"></a>
#### LEGACY-GUIDE-015 / f0

- 원문: [games/README.md L22–22](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L22-L22); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임 규칙, 턴 상태 머신, 승패 조건은 기능 문서에, 게임별 Visual Identity·레이아웃·애니메이션의 최초 baseline과 후속 변경 이력은 각각 `UI_DESIGN.md`와 `UI_DECISIONS.md`에 남겨 둡니다.
```

<a id="legacy-guide-016-f0"></a>
#### LEGACY-GUIDE-016 / f0

- 원문: [games/README.md L23–23](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L23-L23); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- UI Phase를 이어갈 때 초기 계획과 후속 결정이 충돌하면 최신 non-superseded `UI_DECISIONS.md`를 우선하며, 이미 반영된 사용자 디자인 수정을 과거 `UI_DESIGN.md` 안으로 회귀시키지 않습니다.
```

<a id="legacy-guide-017-f0"></a>
#### LEGACY-GUIDE-017 / f0

- 원문: [games/README.md L24–24](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L24-L24); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기능 구현이 release 후보 수준에 도달하면 디자인을 자동 완료 처리하지 않고 Developer Manual Design Review / Detail Polish로 전환합니다. 개발자가 실제 브라우저에서 플레이하며 요청한 디테일 수정은 영역이 안정화된 시점에 `UI_DECISIONS.md`에 확정 decision 단위로 남기며, 디자인 PR/브랜치 종료 또는 release closeout 전에 누락을 확인합니다.
```

<a id="legacy-guide-018-f0"></a>
#### LEGACY-GUIDE-018 / f0

- 원문: [games/README.md L25–25](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L25-L25); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 최초 `UI_DESIGN.md`를 계획대로 구현한 사실 자체는 `UI_DECISIONS.md`에 중복 기록하지 않습니다. 이 문서는 baseline에서 벗어난 확정 변경과 개발자의 수동 디자인 리뷰 결과를 보존하는 데 사용합니다.
```

<a id="legacy-guide-019-f0"></a>
#### LEGACY-GUIDE-019 / f0

- 원문: [games/README.md L26–26](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L26-L26); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- game-local 작업에서 상위 Game Platform 규칙과 충돌하는 새 필요를 발견하면 일반 하위 변경으로 바로 구현하지 않습니다. 플랫폼 전반에 필요한 변경으로 토의·합의되면 **ARCHITECTURE CHANGE**로 승격해 Development Rules와 Governance의 상·하위 정합화 및 전체 platform-native 게임 영향도 감사를 거칩니다.
```

<a id="legacy-guide-020-f0"></a>
#### LEGACY-GUIDE-020 / f0

- 원문: [games/README.md L27–27](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L27-L27); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C110.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 멀티플레이 게임은 게임 종료 후 동일 room/player context에서 재대결 준비 상태로 전환하고, 참여자 준비 완료 후 방장이 다시 시작할 수 있는 흐름을 기본 제품 요구사항으로 설계합니다. 내부 RPC/adapter 공통화는 별도 근거 없이 강제하지 않습니다.
```

<a id="legacy-guide-021-f0"></a>
#### LEGACY-GUIDE-021 / f0

- 원문: [games/README.md L31–31](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L31-L31); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C111.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
출시가 끝난 platform-native 게임의 `DEVELOPMENT.md`는 `Status: RELEASED`, `Active branch: main`과 날짜가 있는 release 기록을 유지합니다.
```

<a id="legacy-guide-022-f0"></a>
#### LEGACY-GUIDE-022 / f0

- 원문: [games/README.md L33–33](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L33-L33); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C111.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
후속 수정은 종료된 feature 브랜치를 재사용하지 않고 최신 `main`에서 새 브랜치로 시작합니다. 구현 중 발견한 플랫폼 교훈은 &#91;Game Platform Development Rules&#93;(../docs/game-platform-development-rules.md)의 release feedback loop에 따라 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 다시 분류합니다.
```

<a id="legacy-guide-023-f0"></a>
#### LEGACY-GUIDE-023 / f0

- 원문: [games/README.md L35–35](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L35-L35); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C111.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
특정 platform-native 게임의 구현을 다른 신규 게임의 기준 사례로 삼지 않습니다. 현재 공통 계약과 규칙 문서, 템플릿을 기준으로 시작하고 게임별 기능 기준/진행과 디자인 기준/이력은 해당 게임 디렉터리 안의 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`에서 분리해 관리합니다.
```

<a id="legacy-guide-024-f0"></a>
#### LEGACY-GUIDE-024 / f0

- 원문: [games/README.md L38–38](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L38-L38); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `registry.js`: 게임 메타데이터와 capability Registry
```

<a id="legacy-guide-025-f0"></a>
#### LEGACY-GUIDE-025 / f0

- 원문: [games/README.md L39–39](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L39-L39); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 표현:승인; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `accessGate.js`: 인증/승인회원 Access Gate
```

<a id="legacy-guide-026-f0"></a>
#### LEGACY-GUIDE-026 / f0

- 원문: [games/README.md L40–40](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L40-L40); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `roomLobbyContract.js`: 방 생성/참가/준비/시작 등 Room/Lobby adapter 계약
```

<a id="legacy-guide-027-f0"></a>
#### LEGACY-GUIDE-027 / f0

- 원문: [games/README.md L41–41](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L41-L41); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `snapshotCoordinator.js`: authoritative snapshot refresh, stale version 거부, invalidation coalescing
```

<a id="legacy-guide-028-f0"></a>
#### LEGACY-GUIDE-028 / f0

- 원문: [games/README.md L42–42](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L42-L42); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `reconnectRefresh.js`: online/pageshow/visibility 복귀 시 snapshot refresh trigger
```

<a id="legacy-guide-029-f0"></a>
#### LEGACY-GUIDE-029 / f0

- 원문: [games/README.md L43–43](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L43-L43); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `actionContract.js`: `expectedVersion` + `clientActionId`를 포함하는 versioned/idempotent action envelope
```

<a id="legacy-guide-030-f0"></a>
#### LEGACY-GUIDE-030 / f0

- 원문: [games/README.md L44–44](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L44-L44); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `gameShellState.js`: 연결 상태와 플레이어 표시용 공통 view-state 계약
```

<a id="legacy-guide-031-f0"></a>
#### LEGACY-GUIDE-031 / f0

- 원문: [games/README.md L45–45](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L45-L45); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `gameShell.js`: 신규 게임용 공통 화면 골격, 연결 상태, 플레이어 roster
```

<a id="legacy-guide-032-f0"></a>
#### LEGACY-GUIDE-032 / f0

- 원문: [games/README.md L46–46](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L46-L46); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `game-shell.css`: 신규 게임이 명시적으로 opt-in 하는 공통 Shell 스타일
```

<a id="legacy-guide-033-f0"></a>
#### LEGACY-GUIDE-033 / f0

- 원문: [games/README.md L47–47](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L47-L47); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `gameInvite.js`: site invite 인프라를 재사용하는 platform-native `game_room` 초대 계약
```

<a id="legacy-guide-034-f0"></a>
#### LEGACY-GUIDE-034 / f0

- 원문: [games/README.md L49–49](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L49-L49); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
공통 계약은 새 게임을 위한 기준입니다. 기존 게임을 이 구조로 마이그레이션하기 위한 호환 계층으로 사용하지 않습니다.
```

<a id="legacy-guide-035-f0"></a>
#### LEGACY-GUIDE-035 / f0

- 원문: [games/README.md L51–51](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L51-L51); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`game-shell.css`는 전역 사이트 CSS에 자동으로 포함하지 않습니다. 신규 게임 페이지가 필요할 때 직접 로드하며, Legacy 게임과 기존 커뮤니티 화면에는 적용하지 않습니다.
```

<a id="legacy-guide-036-f0"></a>
#### LEGACY-GUIDE-036 / f0

- 원문: [games/README.md L53–53](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L53-L53); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
서버 권한 검증과 게임 상태 판정은 계속 각 게임의 DB/RPC가 최종 권위입니다. 프런트 공통 모듈은 DB authorization을 대체하지 않습니다.
```

<a id="legacy-guide-037-f0"></a>
#### LEGACY-GUIDE-037 / f0

- 원문: [games/README.md L55–55](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/games/README.md#L55-L55); blob `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C112.
- 승인된 적용/전환: 진입/선택모델조건;세부는owner참조 / 진입참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Invite 영향 분석과 Legacy 경계는 &#91;Game Platform Invite Analysis&#93;(../docs/game-platform-invite-analysis.md)를 참고합니다.
```

