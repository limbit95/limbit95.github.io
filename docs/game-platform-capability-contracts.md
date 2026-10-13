# Game Platform vNext — 공통 기능 계약

> **문서 분류:** CURRENT
> **적용 범위:** 신규 vNext (기존 consumer 제외)
> **계약 식별:** GP-CAPABILITIES/1

신규 vNext 상위 진입은 [AR](game-platform-architecture.md)다. 기존 consumer는 [기존 development](game-platform-development-rules.md)·[기존 UI](game-platform-ui-rules.md)·선택 DB의 기존 계약을 유지한다. 이 CURRENT는 topic+계약/consumer scope의 단일 본문이며 문서 존재는 runtime 구현/지원 완료가 아니다.

승인 근거: [STEP6 Target](game-platform-rebuild/artifacts/step-6-target-architecture.md), [전수 ID/f](game-platform-rebuild/artifacts/step-6-clause-destinations.md), [CP0089](game-platform-rebuild/checkpoints/CP-0089-step-6-design-result-approved.md), 실제 PR417/418 병합. STEP7A1 반영 PR은 REVIEW_PENDING이며 최종 결과 검토·병합은 남아 있다. 행동 NOT_RUN·UNKNOWN·후속 의무를 유지한다.

## CA1 Registry·Access·Shell

Registry는 기존단일 discovery metadata와 사이트목록projection이다. 실행선택은GAME_SPEC/신규game-local구성에서연결하고 두번째catalog를만들지 않는다. metadata/AccessGate는backend권한집행의대체가 아니다. 기존Auth Gate의진입UX·runtime완료채택·backend최종인가를구분하고 기존Auth를이관하지 않는다.

Shell은공통표시부품이며 모델별의미/mount수명·게임UI·결과연출은game-local이다. 공통renderer/결과화면으로덮어쓰지 않는다. Room8surface·Snapshot/coalescing·Reconnecttrigger의의미는선택MO와LI에서연결한다. 원API상세는기존본체owner를참조하고 여기서새exports/사용가능상태를꾸미지 않는다. 기존본체존재만으로vNext충족완료를선언하지 않는다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-agent-033-f0"></a>
#### LEGACY-AGENT-033 / f0

- 원문: [AGENTS.md L57–57](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L57-L57); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `games/shared/`의 현재 코드와 계약 테스트를 함께 확인하고, DB/RPC 작업이면 정식 계약 문서인 `docs/game-platform-db-test-contract.md`를 추가로 확인합니다.
```

<a id="legacy-dev-198-f0"></a>
#### LEGACY-DEV-198 / f0

- 원문: [docs/game-platform-development-rules.md L368–368](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L368-L368); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C034.
- 승인된 적용/전환: Registry선언 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 게임의 bootstrap 문서 단계에서는 Registry 등록을 유예할 수 있다. 실제 runtime 구현을 시작하는 순간 Game Registry에 등록한다.
```

<a id="legacy-dev-199-f0"></a>
#### LEGACY-DEV-199 / f0

- 원문: [docs/game-platform-development-rules.md L370–370](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L370-L370); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C034.
- 승인된 적용/전환: Registry선언 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
platform-native 게임은 다음 값을 사용한다.
```

<a id="legacy-dev-200-f0"></a>
#### LEGACY-DEV-200 / f0

- 원문: [docs/game-platform-development-rules.md L372–374](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L372-L374); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C034.
- 승인된 적용/전환: Registry선언 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>platform = "shared"<br>```
````

<a id="legacy-dev-201-f0"></a>
#### LEGACY-DEV-201 / f0

- 원문: [docs/game-platform-development-rules.md L376–376](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L376-L376); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C034.
- 승인된 적용/전환: Registry선언 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
실제 제공하는 기능만 capability로 선언한다.
```

<a id="legacy-dev-204-f0"></a>
#### LEGACY-DEV-204 / f0

- 원문: [docs/game-platform-development-rules.md L387–387](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L387-L387); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C034.
- 승인된 적용/전환: Registry선언 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 구현되지 않은 기능을 capability에 미리 선언하지 않는다.
```

<a id="legacy-dev-215-f0"></a>
#### LEGACY-DEV-215 / f0

- 원문: [docs/game-platform-development-rules.md L408–408](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L408-L408); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증,할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C036.
- 승인된 적용/전환: Registry검증분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Legacy 보호 테스트는 보호 대상 Legacy 게임의 존재와 핵심 계약을 명시적으로 검증할 수 있다.
```

<a id="legacy-dev-216-f0"></a>
#### LEGACY-DEV-216 / f0

- 원문: [docs/game-platform-development-rules.md L410–410](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L410-L410); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C036.
- 승인된 적용/전환: Registry검증분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
공통 Game Platform 테스트는 Registry의 전체 게임 개수나 전체 ID 목록을 고정하지 않는다. 신규 platform-native 게임이 추가될 때마다 공통 foundation 테스트의 기대 배열이나 고정 길이를 수정하는 구조를 만들지 않는다.
```

<a id="legacy-dev-217-f0"></a>
#### LEGACY-DEV-217 / f0

- 원문: [docs/game-platform-development-rules.md L412–412](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L412-L412); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:조건,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C036.
- 승인된 적용/전환: Registry검증분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
개별 platform-native 게임의 Registry 설정과 capability, 실제 사용자 노출 상태는 해당 게임의 테스트가 검증한다. Registry ID 중복, shared 경로, runtime 등록 여부처럼 게임 수와 무관한 불변조건은 공통 계약 또는 Governance Guard가 검증한다.
```

<a id="legacy-dev-218-f0"></a>
#### LEGACY-DEV-218 / f0

- 원문: [docs/game-platform-development-rules.md L414–414](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L414-L414); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C036.
- 승인된 적용/전환: Registry검증분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 분리의 목적은 Legacy 보호 강도를 낮추는 것이 아니라, 보호 대상과 확장 가능한 신규 게임의 테스트 책임을 분리해 게임 수 증가가 공통 테스트 수정량 증가로 이어지지 않게 하는 것이다.
```

<a id="legacy-dev-219-f0"></a>
#### LEGACY-DEV-219 / f0

- 원문: [docs/game-platform-development-rules.md L416–416](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L416-L416); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증,할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C036.
- 승인된 적용/전환: Registry검증분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
전체 사람이 직접 플레이하는 exploratory smoke는 자동 검증을 대체하지 않는다. 반대로 자동/운영 계약이 충분히 검증된 상태에서 남은 위험이 presentation·브라우저 정책 같은 관찰 항목뿐이라면 해당 항목을 `Known Issues / Deferred`에 남기고 post-release에서 확인할 수 있다.
```

<a id="legacy-dev-238-f0"></a>
#### LEGACY-DEV-238 / f0

- 원문: [docs/game-platform-development-rules.md L459–459](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L459-L459); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C038.
- 승인된 적용/전환: site계정multiplayer정체성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
사이트 계정으로 참가하는 platform-native 멀티플레이 게임에서 플레이어 표시 이름은 **사이트 계정 프로필의 확정 닉네임**을 사용한다.
```

<a id="legacy-dev-239-f0"></a>
#### LEGACY-DEV-239 / f0

- 원문: [docs/game-platform-development-rules.md L461–461](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L461-L461); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C038.
- 승인된 적용/전환: site계정multiplayer정체성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- MUST: 세션 생성/참가/초대 등 플레이어 identity가 확정되는 모든 진입 경로에서 현재 로그인 사용자의 프로필 닉네임을 사용한다.
```

<a id="legacy-dev-240-f0"></a>
#### LEGACY-DEV-240 / f0

- 원문: [docs/game-platform-development-rules.md L462–462](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L462-L462); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C038.
- 승인된 적용/전환: site계정multiplayer정체성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- MUST: 닉네임의 생성·변경·중복 검사는 마이페이지 등 사이트 공통 프로필 흐름에서만 수행한다.
```

<a id="legacy-dev-241-f0"></a>
#### LEGACY-DEV-241 / f0

- 원문: [docs/game-platform-development-rules.md L463–463](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L463-L463); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C038.
- 승인된 적용/전환: site계정multiplayer정체성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- MUST NOT: 게임별 entry/lobby 화면에 닉네임 입력, 임시 닉네임, 게임별 닉네임 변경 UI를 제공하지 않는다.
```

<a id="legacy-dev-242-f0"></a>
#### LEGACY-DEV-242 / f0

- 원문: [docs/game-platform-development-rules.md L464–464](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L464-L464); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C038.
- 승인된 적용/전환: site계정multiplayer정체성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- MUST NOT: 게임 참가 요청의 임의 client payload를 authoritative 닉네임으로 신뢰하지 않는다.
```

<a id="legacy-dev-243-f0"></a>
#### LEGACY-DEV-243 / f0

- 원문: [docs/game-platform-development-rules.md L465–465](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L465-L465); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C038.
- 승인된 적용/전환: site계정multiplayer정체성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- SHOULD: 게임별 서버 RPC는 가능한 경우 `auth.uid()`에 연결된 프로필의 닉네임을 직접 조회해 room member 표시 이름을 확정한다.
```

<a id="legacy-dev-244-f0"></a>
#### LEGACY-DEV-244 / f0

- 원문: [docs/game-platform-development-rules.md L466–466](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L466-L466); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C038.
- 승인된 적용/전환: site계정multiplayer정체성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기존 호환성 때문에 RPC에 nickname 파라미터가 남아 있더라도 서버는 해당 값을 표시 이름의 권위로 사용하지 않는다.
```

<a id="legacy-dev-245-f0"></a>
#### LEGACY-DEV-245 / f0

- 원문: [docs/game-platform-development-rules.md L468–468](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L468-L468); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C038.
- 승인된 적용/전환: site계정multiplayer정체성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 규칙의 목적은 게임마다 다른 이름을 사용하는 것을 막고, 사이트에서 중복 검사를 거쳐 확정한 하나의 커뮤니티 정체성을 모든 게임에서 일관되게 사용하는 것이다.
```

<a id="legacy-dev-273-f0"></a>
#### LEGACY-DEV-273 / f0

- 원문: [docs/game-platform-development-rules.md L542–542](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L542-L542); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C042.
- 승인된 적용/전환: 선택Shell/local / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 게임은 Common Game Shell을 기본 화면 골격으로 사용할 수 있다.
```

<a id="legacy-dev-275-f0"></a>
#### LEGACY-DEV-275 / f0

- 원문: [docs/game-platform-development-rules.md L546–546](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L546-L546); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C042.
- 승인된 적용/전환: 선택Shell/local / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임 제목과 설명
```

<a id="legacy-dev-276-f0"></a>
#### LEGACY-DEV-276 / f0

- 원문: [docs/game-platform-development-rules.md L547–547](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L547-L547); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C042.
- 승인된 적용/전환: 선택Shell/local / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임 목록 복귀
```

<a id="legacy-dev-277-f0"></a>
#### LEGACY-DEV-277 / f0

- 원문: [docs/game-platform-development-rules.md L548–548](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L548-L548); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C042.
- 승인된 적용/전환: 선택Shell/local / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 방 식별 정보
```

<a id="legacy-dev-278-f0"></a>
#### LEGACY-DEV-278 / f0

- 원문: [docs/game-platform-development-rules.md L549–549](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L549-L549); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C042.
- 승인된 적용/전환: 선택Shell/local / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 연결 / 재연결 / 오프라인 / 오류 상태
```

<a id="legacy-dev-279-f0"></a>
#### LEGACY-DEV-279 / f0

- 원문: [docs/game-platform-development-rules.md L550–550](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L550-L550); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C042.
- 승인된 적용/전환: 선택Shell/local / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 공통 플레이어 roster
```

<a id="legacy-dev-280-f0"></a>
#### LEGACY-DEV-280 / f0

- 원문: [docs/game-platform-development-rules.md L551–551](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L551-L551); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C042.
- 승인된 적용/전환: 선택Shell/local / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 메인 게임 영역과 sidebar 기본 배치
```

<a id="legacy-dev-281-f0"></a>
#### LEGACY-DEV-281 / f0

- 원문: [docs/game-platform-development-rules.md L552–552](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L552-L552); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C042.
- 승인된 적용/전환: 선택Shell/local / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 하단 action 영역
```

<a id="legacy-dev-282-f0"></a>
#### LEGACY-DEV-282 / f0

- 원문: [docs/game-platform-development-rules.md L554–554](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L554-L554); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C042.
- 승인된 적용/전환: 선택Shell/local / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`game-shell.css`는 신규 게임 페이지가 명시적으로 opt-in 한다.
```

<a id="legacy-dev-283-f0"></a>
#### LEGACY-DEV-283 / f0

- 원문: [docs/game-platform-development-rules.md L556–556](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L556-L556); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C042.
- 승인된 적용/전환: 선택Shell/local / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 공통 Shell을 이유로 게임 고유 보드, 카드, 주사위, 3D, 애니메이션, 테마를 획일화하지 않는다.
```

<a id="legacy-dev-284-f0"></a>
#### LEGACY-DEV-284 / f0

- 원문: [docs/game-platform-development-rules.md L558–558](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L558-L558); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C042.
- 승인된 적용/전환: 선택Shell/local / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST: 게임 목록에서 진입한 뒤의 entry/lobby/gameplay/result/rematch는 `docs/game-platform-ui-rules.md`에 따라 해당 게임의 독립적인 Visual Identity를 갖도록 설계한다.
```

<a id="legacy-dev-386-f5"></a>
#### LEGACY-DEV-386 / f5

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 첫runtime동시Registry; 원문 범위: 코드블록순서5.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f6"></a>
#### LEGACY-DEV-386 / f6

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: AccessGate; 원문 범위: 코드블록순서6.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f13"></a>
#### LEGACY-DEV-386 / f13

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 필요Shellsurface; 원문 범위: 코드블록순서13.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

## CA2 Invite

games/shared/gameInvite.js의game_room envelope/route/share와js/invites/사이트본체를우선재사용한다. game-local join연결을본체중복으로단정하지 않는다. identity는생성/등록/route/target/admission/handler/dialog/완료/정리 전구간이어야 한다.

H2 등록/old disposer, H3 늦은handler/dialog완료는실제owner의최소보완/동등격리가필요하다. 사이트handler/dialog owner와권한을유지한다. wrapper안에새token/수명/인가엔진을숨기지 않는다. H4 비room초대는미래미선택이며전체blocker가 아니다. VERSION=1은game_room envelope의호환만의미한다. [STEP5A선택](game-platform-rebuild/artifacts/step-5a-common-module-selection.md)의조건과후속구현/실행의무를참조한다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-dev-312-f0"></a>
#### LEGACY-DEV-312 / f0

- 원문: [docs/game-platform-development-rules.md L618–618](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L618-L618); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C048.
- 승인된 적용/전환: 선택Invite / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Invite를 제공하는 신규 게임은 기존 사이트 공통 invite 인프라와 Game Platform Invite 계약을 사용한다.
```

<a id="legacy-dev-313-f0"></a>
#### LEGACY-DEV-313 / f0

- 원문: [docs/game-platform-development-rules.md L620–620](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L620-L620); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:조건,필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C048.
- 승인된 적용/전환: 선택Invite / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
필수 Registry 조건:
```

<a id="legacy-dev-314-f0"></a>
#### LEGACY-DEV-314 / f0

- 원문: [docs/game-platform-development-rules.md L622–626](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L622-L626); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C048.
- 승인된 적용/전환: 선택Invite / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>platform === "shared"<br>capabilities.online === true<br>capabilities.invite === true<br>```
````

<a id="legacy-dev-316-f0"></a>
#### LEGACY-DEV-316 / f0

- 원문: [docs/game-platform-development-rules.md L630–637](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L630-L637); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C048.
- 승인된 적용/전환: 선택Invite / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>target_type = game_room<br>target_id   = &lt;game-specific room id&gt;<br>metadata    = {<br>  game_id: "&lt;registry game id&gt;",<br>  platform_version: 1<br>}<br>```
````

<a id="legacy-dev-317-f0"></a>
#### LEGACY-DEV-317 / f0

- 원문: [docs/game-platform-development-rules.md L639–639](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L639-L639); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C048.
- 승인된 적용/전환: 선택Invite / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST: 이동 목적지는 invite metadata의 임의 URL이 아니라 Game Registry의 `href`에서 결정한다.
```

<a id="legacy-dev-318-f0"></a>
#### LEGACY-DEV-318 / f0

- 원문: [docs/game-platform-development-rules.md L641–641](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L641-L641); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C048.
- 승인된 적용/전환: 선택Invite / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST: 초대 token resolve 이후에도 실제 참가 권한은 게임별 join RPC가 다시 검증한다.
```

<a id="legacy-dev-319-f0"></a>
#### LEGACY-DEV-319 / f0

- 원문: [docs/game-platform-development-rules.md L643–643](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L643-L643); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C048.
- 승인된 적용/전환: 선택Invite / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 게임마다 별도의 새로운 invite target type이나 전용 invite infrastructure를 만들지 않는다.
```

## CA3 BGM·표현

기존사이트BGM controller/player본체를재사용하고실제owner를유지한다. 게임별곡/mode/결과연출은game-local연결이다. site utility를이름만바꿔정식shared로승격시키지 않는다. [기존BGM본체계약](game-bgm.md)을참조한다.

H1은본체내부최신의도/종료/작업귀속의최소수명보완전무보완직결보류다. 외부wrapper만으로내부Audio/DOM late완료를보호했다고표시하지 않는다. 보완을얇은Adapter속새audio/수명엔진으로숨기지 않는다. fakeAudio/unit과실제browser/audio증거는별도이며현재NOT_RUN이다. 미래정밀audio/보상/표현엔진은선제구현하지 않는다.

## CA4 Result 소비·여섯 중복

공식producer/확정·정정/참여자outcome/viewer표현은MO6, game-local실제UI/연출은그게임, 통계/보상/기록consumer는자기정정·중복책임을소유한다. 예상값·동일snapshot재적용은확정보상/효과재발행근거가아니다. 공식정정은새경기집계가아니며기존기여의대체다.

action retry, simulation replay, current state/snapshot 재적용, UI effect/SFX, 통계·기록·보상집계, publication은서로다른중복scope다. 하나의done/version으로전부해결하지 않는다. 정정/재처리/역순/commit미상에선택consumer별증거가필요하며없는통계/보상엔진을선제작성하지 않는다. [STEP5B공식결과/소비](game-platform-rebuild/artifacts/step-5b-contract-boundaries.md)를원문우선으로참조한다.

## CA5 Publication·사이트 연결

merge·구현·activation·실제공개사건·사이트NEW/공지소비는독립사실이다. 구현/merge만으로공개/공지·NEW를발행하지 않는다. Registry단일metadata와실제공개근거를소비하며공개자동화엔진을선제작성하지 않는다. 기존사이트Auth/route/profile/Invite/BGM연결은Site Adapter이며새권위/순서/수명엔진을숨기지 않는다. 구체API/schema는후속단계전에동결하지 않는다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-dev-205-f0"></a>
#### LEGACY-DEV-205 / f0

- 원문: [docs/game-platform-development-rules.md L391–391](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L391-L391); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C035.
- 승인된 적용/전환: 구현/activation분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`online`, `invite`, `presence` 같은 capability가 true라는 것은 코드 파일이 존재한다는 뜻이 아니라 **현재 배포 환경에서 사용자에게 제공할 준비가 끝났다는 선언**이다.
```

<a id="legacy-dev-206-f0"></a>
#### LEGACY-DEV-206 / f0

- 원문: [docs/game-platform-development-rules.md L393–393](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L393-L393); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C035.
- 승인된 적용/전환: 구현/activation분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
online capability를 활성화하기 전에는 최소한 다음을 확인한다.
```

<a id="legacy-dev-207-f0"></a>
#### LEGACY-DEV-207 / f0

- 원문: [docs/game-platform-development-rules.md L395–395](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L395-L395); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C035.
- 승인된 적용/전환: 구현/activation분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 필요한 production migration 적용 여부
```

<a id="legacy-dev-208-f0"></a>
#### LEGACY-DEV-208 / f0

- 원문: [docs/game-platform-development-rules.md L396–396](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L396-L396); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C035.
- 승인된 적용/전환: 구현/activation분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- RLS / grant / RPC authorization 경계
```

<a id="legacy-dev-209-f0"></a>
#### LEGACY-DEV-209 / f0

- 원문: [docs/game-platform-development-rules.md L397–397](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L397-L397); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C035.
- 승인된 적용/전환: 구현/activation분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 해당 게임의 DB/Test Contract
```

<a id="legacy-dev-210-f0"></a>
#### LEGACY-DEV-210 / f0

- 원문: [docs/game-platform-development-rules.md L398–398](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L398-L398); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C035.
- 승인된 적용/전환: 구현/activation분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- stale version / idempotency / reconnect 등 관련 회귀
```

<a id="legacy-dev-211-f0"></a>
#### LEGACY-DEV-211 / f0

- 원문: [docs/game-platform-development-rules.md L399–399](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L399-L399); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C035.
- 승인된 적용/전환: 구현/activation분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 실제 entry route와 Registry href
```

<a id="legacy-dev-212-f0"></a>
#### LEGACY-DEV-212 / f0

- 원문: [docs/game-platform-development-rules.md L400–400](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L400-L400); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C035.
- 승인된 적용/전환: 구현/activation분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- release blocker 부재
```

<a id="legacy-dev-213-f0"></a>
#### LEGACY-DEV-213 / f0

- 원문: [docs/game-platform-development-rules.md L402–402](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L402-L402); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C035.
- 승인된 적용/전환: 구현/activation분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Invite를 활성화한다면 shared `game_room` routing과 서버-side token 재검증까지 확인한다.
```

<a id="legacy-dev-214-f0"></a>
#### LEGACY-DEV-214 / f0

- 원문: [docs/game-platform-development-rules.md L404–404](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L404-L404); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C035.
- 승인된 적용/전환: 구현/activation분리 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: Registry capability 값이나 게임 목록 미노출을 인증/인가 보안 경계로 취급하지 않는다. 정적 route를 직접 아는 사용자가 페이지에 접근할 수 있으므로 실제 접근 제어는 Access Gate와 서버 RPC/RLS가 계속 책임진다. capability와 목록 노출은 release/기능 제공 상태를 선언하는 운영 메타데이터다.
```

<a id="legacy-dev-386-f23"></a>
#### LEGACY-DEV-386 / f23

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: activation/목록entry; 원문 범위: 코드블록순서23.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

## CA6 확장·Profile

공통본체중복과정상game-local연결/실제UI/결과연출을구분한다. 동일의미·owner·consumer범위의공통본체를새로복제하지 않는다. 기존계약이새요구를표현하지못하면해당차이와최소새책임을먼저설계한다. 재사용가능성과현재무보완사용가능성을혼동하지 않는다.

Profile은실제Probe필요와반복된검증조합의recipe다. 반복전생성/필수화·상속/실행엔진·전용디렉터리/선제보상·통계·공개·audio/Profile엔진을만들지 않는다. 미래미선택은전체blocker가아니며새요구가생길때해당경계만설계한다. 실제Probe게임은이번에선택하지 않는다.

