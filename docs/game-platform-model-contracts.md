# Game Platform vNext — 선택 모델 계약

> **문서 분류:** CURRENT
> **적용 범위:** 신규 vNext (기존 consumer 제외)
> **계약 식별:** GP-MODELS/1

신규 vNext 상위 진입은 [AR](game-platform-architecture.md)다. 기존 consumer는 [기존 development](game-platform-development-rules.md)·[기존 UI](game-platform-ui-rules.md)·선택 DB의 기존 계약을 유지한다. 이 CURRENT는 topic+계약/consumer scope의 단일 본문이며 문서 존재는 runtime 구현/지원 완료가 아니다.

승인 근거: [STEP6 Target](game-platform-rebuild/artifacts/step-6-target-architecture.md), [전수 ID/f](game-platform-rebuild/artifacts/step-6-clause-destinations.md), [CP0089](game-platform-rebuild/checkpoints/CP-0089-step-6-design-result-approved.md), 실제 PR417/418 병합. STEP7A1 반영 PR은 REVIEW_PENDING이며 최종 결과 검토·병합은 남아 있다. 행동 NOT_RUN·UNKNOWN·후속 의무를 유지한다.

## MO1 선택7축·호환

승인 STEP2의7축으로 실제 모델을 선택한다. 장르명·현재코드 존재·템플릿 질문으로 Room/host/DOM/DB/transport/renderer/tick/physics/prediction을 강제하지 않는다. ①Gameplay flow ②시간·입력 ③세션·지속성 ④참여·가시성 ⑤권위·동기화·복원 ⑥공간·렌더링·입력·물리 ⑦결과·메타 progression의 하위 항목을 독립적으로 기록한다. 각 축을 하나의 배타 enum으로 만들지 않고 모드/단계/역할/상태별 복수선택·변화조건·해당없음/미결정/후속계약검토를 구분하며 모델간 계약은 명시 참조한다. 세부 선택축의 정식 원문은 [STEP2](game-platform-rebuild/artifacts/step-2-implementation-selection.md)를 따른다.

실제 미선택 모델/API/oracle는 미지원/후속으로 표시한다. /1은 의미계약이며 제공 구현의 호환 증거 없이 사용가능으로 표시하지 않는다. 실제 선택모델의 구체 식별자/취소손실/시간공백 정책은 구현전 닫아야 한다. 새로운 상위선택이 필요하면 설계 게이트로 반환한다.

## MO2 세션·참여·재대결

실제 Room/Lobby adapter를 채택하면 기존8 surface의 실제 의미와 정책/RPC를 보존한다. 불일치를 no-op/local우회로 숨기지 않고 계약분리/확장이 필요하면 반환한다. roomless 모델에 Room을 강제하지 않는다. 안전진입/조회/이탈·권위종료·후속정리는 LI와 연결한다.

모든 해당 multiplayer는 종료후 기존 room/player context의 재참여·초기화/ready/start/reconnect 의미를 유지한다. 초기시작만hostless이며 재대결에host/ready가 성립하면 기존의무를 적용한다. 재대결에서도host의미불성립인 조합은 대체 사용자의사·시작권위·공정성·이탈/복구와 기존영향을 제시해 별도상위변경승인을 받아야 한다. 이 예외는 현재 승인하지 않았다. multiplayer 재대결 정책미정은 N/A가 아니며 구현전 닫는다. purelocal solo는 의미상 Room/host/ready/온라인RPC/multiplayer재대결 비적용 가능하나 run수명/안전종료/새run격리는 유지한다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-agent-052-f0"></a>
#### LEGACY-AGENT-052 / f0

- 원문: [AGENTS.md L76–76](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L76-L76); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 모든 platform-native 게임은 진행 중 세션을 안전하게 끝낼 수 있는 명시적 게임 종료 경로를 제공하며, 온라인 멀티플레이 종료는 서버 권위와 확인 UI를 적용합니다.
```

<a id="legacy-agent-053-f0"></a>
#### LEGACY-AGENT-053 / f0

- 원문: [AGENTS.md L77–77](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L77-L77); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 모든 멀티플레이 platform-native 게임은 게임 종료 후 기존 room/player context를 유지하는 재대결 흐름을 기본 기능으로 제공하고, 참여 플레이어 준비 완료 후 방장이 다시 시작할 수 있어야 합니다. 세부 lifecycle과 서버 권위는 `docs/game-platform-development-rules.md`를 따릅니다.
```

<a id="legacy-dev-220-f0"></a>
#### LEGACY-DEV-220 / f0

- 원문: [docs/game-platform-development-rules.md L420–420](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L420-L420); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
온라인 멀티플레이가 room/session 개념을 사용하는 경우 기존 shared Room/Lobby 계약을 우선 검토한다.
```

<a id="legacy-dev-221-f0"></a>
#### LEGACY-DEV-221 / f0

- 원문: [docs/game-platform-development-rules.md L422–422](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L422-L422); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
플랫폼이 공통으로 보장해야 하는 책임은 특정 보드게임의 준비 방식이 아니라 다음과 같은 **세션 경계**다.
```

<a id="legacy-dev-222-f0"></a>
#### LEGACY-DEV-222 / f0

- 원문: [docs/game-platform-development-rules.md L424–424](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L424-L424); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 세션 생성 또는 참가
```

<a id="legacy-dev-223-f0"></a>
#### LEGACY-DEV-223 / f0

- 원문: [docs/game-platform-development-rules.md L425–425](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L425-L425); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 현재 사용자가 속한 활성 세션 확인
```

<a id="legacy-dev-224-f0"></a>
#### LEGACY-DEV-224 / f0

- 원문: [docs/game-platform-development-rules.md L426–426](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L426-L426); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 권한이 적용된 authoritative snapshot 조회
```

<a id="legacy-dev-225-f0"></a>
#### LEGACY-DEV-225 / f0

- 원문: [docs/game-platform-development-rules.md L427–427](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L427-L427); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 안전한 세션 이탈
```

<a id="legacy-dev-226-f0"></a>
#### LEGACY-DEV-226 / f0

- 원문: [docs/game-platform-development-rules.md L428–428](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L428-L428); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 상태 변경을 감지해 snapshot refresh를 유도하는 invalidation 구독
```

<a id="legacy-dev-227-f0"></a>
#### LEGACY-DEV-227 / f0

- 원문: [docs/game-platform-development-rules.md L430–430](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L430-L430); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
현재 `defineRoomLobbyAdapter` 구현은 다음 surface를 제공한다.
```

<a id="legacy-dev-228-f0"></a>
#### LEGACY-DEV-228 / f0

- 원문: [docs/game-platform-development-rules.md L432–441](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L432-L441); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>createRoom<br>joinRoom<br>getMyActiveRoom<br>getLobbySnapshot<br>setReady<br>leaveRoom<br>startGame<br>subscribeInvalidation<br>```
````

<a id="legacy-dev-229-f0"></a>
#### LEGACY-DEV-229 / f0

- 원문: [docs/game-platform-development-rules.md L443–443](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L443-L443); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`setReady`와 `startGame`은 현재 shared 구현에서 검증된 lifecycle이지만 **모든 미래 게임의 보편 규칙으로 간주하지 않는다.** 전원 ready가 없거나, 자동 시작하거나, host가 없거나, 다른 방식으로 세션이 시작되는 게임에 억지로 빈 메서드나 가짜 의미를 추가하지 않는다.
```

<a id="legacy-dev-231-f0"></a>
#### LEGACY-DEV-231 / f0

- 원문: [docs/game-platform-development-rules.md L447–447](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L447-L447); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. game-local workaround로 shared 계약을 우회하지 않는다.
```

<a id="legacy-dev-232-f0"></a>
#### LEGACY-DEV-232 / f0

- 원문: [docs/game-platform-development-rules.md L448–448](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L448-L448); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. 현재 adapter를 그대로 강제하기 위해 의미 없는 method를 구현하지 않는다.
```

<a id="legacy-dev-233-f0"></a>
#### LEGACY-DEV-233 / f0

- 원문: [docs/game-platform-development-rules.md L449–449](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L449-L449); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. 실제 반복 가능한 플랫폼 책임인지 검토한 뒤 shared 계약을 가장 작은 범위로 확장하거나 분리한다.
```

<a id="legacy-dev-234-f0"></a>
#### LEGACY-DEV-234 / f0

- 원문: [docs/game-platform-development-rules.md L450–450](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L450-L450); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. 계약 변경 시 관련 contract test와 이 문서를 함께 갱신한다.
```

<a id="legacy-dev-235-f0"></a>
#### LEGACY-DEV-235 / f0

- 원문: [docs/game-platform-development-rules.md L452–452](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L452-L452); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
현재 adapter를 그대로 사용하는 게임은 해당 surface 전체를 구현해야 하며, 각 메서드 내부 구현과 실제 RPC 이름은 게임별로 달라도 된다.
```

<a id="legacy-dev-236-f0"></a>
#### LEGACY-DEV-236 / f0

- 원문: [docs/game-platform-development-rules.md L454–454](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L454-L454); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST: 세션 생성/참가/준비/시작 등 상태 전이가 존재한다면 해당 권한과 조건은 서버가 최종 판단한다.
```

<a id="legacy-dev-237-f0"></a>
#### LEGACY-DEV-237 / f0

- 원문: [docs/game-platform-development-rules.md L456–456](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L456-L456); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C037.
- 승인된 적용/전환: 선택Room/8surface / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: UI에서 버튼을 숨기거나 비활성화했다는 이유로 서버 권한 검증을 생략하지 않는다.
```

<a id="legacy-dev-294-f1"></a>
#### LEGACY-DEV-294 / f1

- 원문: [docs/game-platform-development-rules.md L577–577](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L577-L577); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C045.
- 승인된 적용/전환: 지속세션/온라인권위종료 / 참조계승.
- 책임 의미: 세션제품정책; 원문 범위: 게임전체종료권한을게임별명확히정의.
- 검증 대응: V-D.

```text
- 온라인 멀티플레이에서 게임 전체를 종료하는 권한은 게임별로 명확히 정의하며, 다른 플레이어의 세션에 영향을 주는 종료는 서버가 최종 권한을 검증한다.
```

<a id="legacy-dev-297-f0"></a>
#### LEGACY-DEV-297 / f0

- 원문: [docs/game-platform-development-rules.md L580–580](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L580-L580); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C045.
- 승인된 적용/전환: 지속세션/온라인권위종료 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 종료된 사용자가 active session에 영구히 묶이지 않도록 leave, rematch, entry return 등 후속 경로를 정의한다.
```

<a id="legacy-dev-298-f0"></a>
#### LEGACY-DEV-298 / f0

- 원문: [docs/game-platform-development-rules.md L581–581](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L581-L581); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C045.
- 승인된 적용/전환: 지속세션/온라인권위종료 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 브라우저를 닫거나 단순히 다른 페이지로 이동하는 것을 authoritative 게임 종료로 간주하지 않는다.
```

<a id="legacy-dev-299-f0"></a>
#### LEGACY-DEV-299 / f0

- 원문: [docs/game-platform-development-rules.md L585–585](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L585-L585); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C046.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
모든 멀티플레이 platform-native 게임은 정상 종료 또는 재대결을 허용하는 terminal state 이후 **같은 참여 맥락에서 다시 플레이할 수 있는 재대결 기능**을 기본 제품 요구사항으로 제공한다.
```

<a id="legacy-dev-300-f0"></a>
#### LEGACY-DEV-300 / f0

- 원문: [docs/game-platform-development-rules.md L587–587](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L587-L587); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C046.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
기본 사용자 흐름은 다음과 같다.
```

<a id="legacy-dev-301-f1"></a>
#### LEGACY-DEV-301 / f1

- 원문: [docs/game-platform-development-rules.md L589–599](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L589-L599); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C046.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 종료/재참여의제품단계; 원문 범위: 목록결과확인/재대결선택.
- 검증 대응: V-D.

````text
```text<br>GAME_OVER / TERMINAL<br>→ 결과 확인<br>→ 재대결 선택<br>→ 기존 room / active player identity를 유지한 준비 상태<br>→ 참여 플레이어가 준비 완료<br>→ 시작 가능한 인원과 준비 조건 충족<br>→ 방장이 게임 시작<br>→ 이전 gameplay state 초기화<br>→ 새 게임 시작<br>```
````

<a id="legacy-dev-301-f2"></a>
#### LEGACY-DEV-301 / f2

- 원문: [docs/game-platform-development-rules.md L589–599](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L589-L599); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C046.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 재대결모델lifecycle; 원문 범위: 기존room/player·준비·인원·host시작·이전state초기화·새게임.
- 검증 대응: V-D.

````text
```text<br>GAME_OVER / TERMINAL<br>→ 결과 확인<br>→ 재대결 선택<br>→ 기존 room / active player identity를 유지한 준비 상태<br>→ 참여 플레이어가 준비 완료<br>→ 시작 가능한 인원과 준비 조건 충족<br>→ 방장이 게임 시작<br>→ 이전 gameplay state 초기화<br>→ 새 게임 시작<br>```
````

<a id="legacy-dev-302-f0"></a>
#### LEGACY-DEV-302 / f0

- 원문: [docs/game-platform-development-rules.md L603–603](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L603-L603); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C047.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 재대결을 위해 사용자가 새 방을 생성하거나 방 코드를 다시 입력하도록 강제하지 않는다.
```

<a id="legacy-dev-303-f0"></a>
#### LEGACY-DEV-303 / f0

- 원문: [docs/game-platform-development-rules.md L604–604](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L604-L604); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C047.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기존 room, 참여 player identity, host와 플랫폼 세션 맥락은 가능한 범위에서 유지한다.
```

<a id="legacy-dev-304-f0"></a>
#### LEGACY-DEV-304 / f0

- 원문: [docs/game-platform-development-rules.md L605–605](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L605-L605); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C047.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 이전 게임의 점수, 카드, 보드, 칩, 주사위, 턴, 승패, 임시 효과 등 gameplay state는 새 게임 기준으로 초기화한다.
```

<a id="legacy-dev-306-f0"></a>
#### LEGACY-DEV-306 / f0

- 원문: [docs/game-platform-development-rules.md L607–607](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L607-L607); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:조건,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C047.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 새 게임 시작 조건과 권한은 서버가 최종 검증한다.
```

<a id="legacy-dev-307-f1"></a>
#### LEGACY-DEV-307 / f1

- 원문: [docs/game-platform-development-rules.md L608–608](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L608-L608); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:조건,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C047.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 세션이탈; 원문 범위: 재대결원하지않는플레이어안전이탈.
- 검증 대응: V-D.

```text
- 재대결을 원하지 않는 플레이어는 안전하게 이탈할 수 있어야 하며, 이탈 후 최소 플레이 인원과 host 승계 등 필요한 조건을 authoritative하게 다시 검증한다.
```

<a id="legacy-dev-308-f0"></a>
#### LEGACY-DEV-308 / f0

- 원문: [docs/game-platform-development-rules.md L609–609](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L609-L609); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C047.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- reconnect가 발생해도 authoritative snapshot으로 재대결 준비 상태 또는 새 게임 상태를 복구할 수 있어야 한다.
```

<a id="legacy-dev-310-f0"></a>
#### LEGACY-DEV-310 / f0

- 원문: [docs/game-platform-development-rules.md L612–612](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L612-L612); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C047.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
재대결이 공통 제품 요구사항이라는 이유만으로 모든 게임에 동일한 RPC 이름이나 `games/shared/` adapter method를 즉시 강제하지 않는다. 현재 Room/Lobby 계약으로 자연스럽게 표현되면 재사용하고, 여러 게임에서 반복되는 구현 책임이 확인될 때만 shared 계약 승격을 검토한다.
```

<a id="legacy-dev-311-f0"></a>
#### LEGACY-DEV-311 / f0

- 원문: [docs/game-platform-development-rules.md L614–614](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L614-L614); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C047.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
초기 게임 시작에 ready/host 개념이 없는 특수한 게임이라도 재대결에서는 사용자가 다시 플레이하겠다는 의사를 명시하고 방장이 시작 가능한 준비 화면으로 전환하는 청파 같이 공통 UX를 제공한다. 게임 규칙상 방장 자체가 성립하지 않는 구조를 도입하려면 별도 플랫폼 규칙 변경으로 다룬다.
```

<a id="legacy-dev-386-f8"></a>
#### LEGACY-DEV-386 / f8

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 해당lifecycleRoom/Session; 원문 범위: 코드블록순서8.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f15"></a>
#### LEGACY-DEV-386 / f15

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: multiplayerresult/rematch; 원문 범위: 코드블록순서15.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-db-016-f0"></a>
#### LEGACY-DB-016 / f0

- 원문: [docs/game-platform-db-test-contract.md L26–26](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L26-L26); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:조건,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
10. 멀티플레이 게임 종료 후 재대결은 기존 room/player context를 유지하고 gameplay state를 초기화한 준비 상태로 전환하며, 준비/시작 조건과 reconnect 복원이 서버 권위로 검증된다.
```

<a id="legacy-db-038-f0"></a>
#### LEGACY-DB-038 / f0

- 원문: [docs/game-platform-db-test-contract.md L110–110](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L110-L110); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C075.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
`rematch_lifecycle_authoritative`는 특정 RPC 이름이나 SQL 구조를 강제하지 않는다. 각 게임은 자체 구현으로 최소 다음을 증명한다.
```

<a id="legacy-db-039-f0"></a>
#### LEGACY-DB-039 / f0

- 원문: [docs/game-platform-db-test-contract.md L112–112](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L112-L112); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C075.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- terminal state 이후 재대결 준비가 기존 room과 남아 있는 active player identity를 유지한다.
```

<a id="legacy-db-040-f0"></a>
#### LEGACY-DB-040 / f0

- 원문: [docs/game-platform-db-test-contract.md L113–113](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L113-L113); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C075.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- 이전 gameplay state와 private state가 새 게임에 섞이지 않게 초기화된다.
```

<a id="legacy-db-041-f0"></a>
#### LEGACY-DB-041 / f0

- 원문: [docs/game-platform-db-test-contract.md L114–114](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L114-L114); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:조건,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C075.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- 재대결 준비 후 ready/start 조건과 시작 권한을 서버가 다시 검증한다.
```

<a id="legacy-db-042-f0"></a>
#### LEGACY-DB-042 / f0

- 원문: [docs/game-platform-db-test-contract.md L115–115](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L115-L115); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C075.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- 재접속한 참가자는 같은 room의 authoritative rematch 준비 상태 또는 재시작된 새 게임 snapshot을 복원한다.
```

<a id="legacy-db-043-f0"></a>
#### LEGACY-DB-043 / f0

- 원문: [docs/game-platform-db-test-contract.md L116–116](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L116-L116); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C075.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- 재대결을 원하지 않는 참가자의 이탈과 필요한 host 승계가 서버 상태를 깨뜨리지 않는다.
```

<a id="legacy-db-044-f0"></a>
#### LEGACY-DB-044 / f0

- 원문: [docs/game-platform-db-test-contract.md L118–118](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L118-L118); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C075.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
세부 인원수, host/ready 의미, 게임별 초기화 필드는 `GAME_SPEC.md`에 남겨 둔다.
```

<a id="legacy-ui-191-f0"></a>
#### LEGACY-UI-191 / f0

- 원문: [docs/game-platform-ui-rules.md L348–348](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L348-L348); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C104.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
재대결 lifecycle 자체의 기능 규칙과 서버 권위는 `docs/game-platform-development-rules.md`를 따른다.
```

## MO3 안전11·권위·인가·A/C/P

신규 vNext online의 동등안전11을 공통 의미로 소유한다. ①익명보호진입차단 ②미승인회원차단 ③허용회원정책진입 ④비멤버보호상태차단 ⑤승인권위start조건 ⑥낡은입력/순서거부 ⑦동일명령중복mutation방지 ⑧충돌명령의단일권위결과 ⑨authorized current state복구 ⑩해당multiplayer same-context재대결/초기화/ready/start/reconnect ⑪private-state비노출. private정보가 없는 경우도 비노출검증을 생략하지 않는다.

DB/RPC 상세는 [기존DB계약](game-platform-db-test-contract.md)과 기존 개발규칙의 해당 모델 절을 참조한다. nonDB에SQL/정수expected_version 모양을 강제하지 않으나 같은안전의미와 실제oracle를 명시해야 한다. 이번7A1은 아직 nonDB oracle/탐지 구현을 만들지 않으며 미지원조합의 기존DB 검사를 제거해 허용하지 않는다. Guard의7B 모델별oracle 준비 전 신규vNext online runtime 지원을 선언하지 않는다. 안전11은 Data API최소권한/RLS·privilege 또는 아래A/C/P 전체oracle를 대체하지 않는다.

A는 필요한 owner/command lock을 획득하고 같은 finalizer transaction에서 현재predicate를 확인한 뒤 실제command storage를 시작하는 최종인가·착수다. ingress/BEGIN/queue는A가 아니며 lock wait뒤 낡은allow를 쓰지 않는다. 명시 운영 범위에서 외부 R+5초 이후 새A·known expiry뒤 새A/처음부터무권한A·실패인지뒤새허가는금지한다. 검사와착수사이에대기/제어반환이있으면fresh검사가필요하다. 적법A를 기한내지난 동일transaction의 일반저장I/O late C만 D0010범위로 제한수용한다. C는 실제commit으로관측하며 A/ACK시각으로 바꾸지 않는다. 새command/transaction/retry는fresh A다.

새P는 recipient/session/view/payload의 최종fresh인가와 실제transport인계경계다. duplicate응답/ACK/snapshot도새P다. 명시운영P5초/최종취소불가transport경계를유지하고 앱queue삽입을P로삼지않는다. owner anchor는C/rollback까지 유지하고 old writer/old sender를 각각 보호한다. 권한불명/실패인지시 보호입출력차단/pause, 최초t0+60초deadline·retry/restart로초기화금지·terminal뒤LIVE부활금지. D0007/08 actualCdeadline/Z1HOLD중 D0010이대체한 부분만 적용한다. after-check 장시간정지 한계와 일반I/O lateC수용을 합치지 않으며 transaction/인과를 시계값만으로증명하지 않는다. 누락trace는INCONCLUSIVE, 안전위반을percentile로면제하지 않는다.

운영 backend는 승인 STEP4B의 같은 VM gate/worker/controller·독립scheduler/monitor·권한분리·native최종송신/인가·ticket/guard·외부기록/삭제/복구 계약을 따른다. 구현·공급자 선택을 새로 하지 않는다. [CP0075/D0010 현재delta](game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md)와 유효 DECISIONS를 원문우선으로 참조한다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-dev-246-f0"></a>
#### LEGACY-DEV-246 / f0

- 원문: [docs/game-platform-development-rules.md L472–472](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L472-L472); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C039.
- 승인된 적용/전환: online권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
온라인 게임의 상태 변경은 기본적으로 다음 흐름을 따른다.
```

<a id="legacy-dev-247-f0"></a>
#### LEGACY-DEV-247 / f0

- 원문: [docs/game-platform-development-rules.md L474–483](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L474-L483); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C039.
- 승인된 적용/전환: online권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>Client intent<br>→ authenticated game-specific RPC<br>→ auth / approval / membership / role / phase / version validation<br>→ transaction / row lock when needed<br>→ authoritative DB state<br>→ Realtime invalidation<br>→ authorized snapshot refresh<br>→ UI render<br>```
````

<a id="legacy-dev-248-f0"></a>
#### LEGACY-DEV-248 / f0

- 원문: [docs/game-platform-development-rules.md L485–485](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L485-L485); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C039.
- 승인된 적용/전환: online권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST: 클라이언트는 사용자의 **의도(intent)** 를 전달한다.
```

<a id="legacy-dev-249-f0"></a>
#### LEGACY-DEV-249 / f0

- 원문: [docs/game-platform-development-rules.md L487–487](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L487-L487); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C039.
- 승인된 적용/전환: online권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST: 실제 게임 상태 변경 가능 여부와 결과는 서버가 결정한다.
```

<a id="legacy-dev-250-f0"></a>
#### LEGACY-DEV-250 / f0

- 원문: [docs/game-platform-development-rules.md L489–489](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L489-L489); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C039.
- 승인된 적용/전환: online권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 클라이언트가 계산한 결과를 검증 없이 authoritative state로 저장하지 않는다.
```

<a id="legacy-dev-294-f2"></a>
#### LEGACY-DEV-294 / f2

- 원문: [docs/game-platform-development-rules.md L577–577](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L577-L577); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C045.
- 승인된 적용/전환: 지속세션/온라인권위종료 / 참조계승.
- 책임 의미: 서버인가집행; 원문 범위: 다른플레이어세션에영향주는종료서버최종권한검증.
- 검증 대응: V-D.

```text
- 온라인 멀티플레이에서 게임 전체를 종료하는 권한은 게임별로 명확히 정의하며, 다른 플레이어의 세션에 영향을 주는 종료는 서버가 최종 권한을 검증한다.
```

<a id="legacy-dev-307-f2"></a>
#### LEGACY-DEV-307 / f2

- 원문: [docs/game-platform-development-rules.md L608–608](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L608-L608); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:조건,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C047.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 세션조건의권위집행; 원문 범위: 최소인원/host승계필요조건authoritative재검증.
- 검증 대응: V-D.

```text
- 재대결을 원하지 않는 플레이어는 안전하게 이탈할 수 있어야 하며, 이탈 후 최소 플레이 인원과 host 승계 등 필요한 조건을 authoritative하게 다시 검증한다.
```

<a id="legacy-dev-320-f0"></a>
#### LEGACY-DEV-320 / f0

- 원문: [docs/game-platform-development-rules.md L647–647](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L647-L647); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 온라인 platform-native 게임은 `tests/game-db-integration/platformContract.js`의 공통 계약을 첫 구현부터 적용한다.
```

<a id="legacy-dev-321-f0"></a>
#### LEGACY-DEV-321 / f0

- 원문: [docs/game-platform-development-rules.md L649–649](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L649-L649); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST: DB migration이 Data API 노출 schema에 새 table/view/function/sequence를 생성하거나 기존 객체의 권한 경계를 변경하면 프로젝트의 자동 default privilege에 의존하지 않고 `docs/game-platform-db-test-contract.md`의 Data API 권한 계약에 따라 역할별 `GRANT`/`REVOKE`, 테이블 RLS, RPC `EXECUTE` 경계를 명시적으로 검토한다.
```

<a id="legacy-dev-323-f0"></a>
#### LEGACY-DEV-323 / f0

- 원문: [docs/game-platform-development-rules.md L653–655](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L653-L655); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>tests/game-db-integration/&lt;game-id&gt;.test.js<br>```
````

<a id="legacy-dev-324-f0"></a>
#### LEGACY-DEV-324 / f0

- 원문: [docs/game-platform-development-rules.md L657–657](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L657-L657); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
최소 필수 시나리오:
```

<a id="legacy-dev-325-f0"></a>
#### LEGACY-DEV-325 / f0

- 원문: [docs/game-platform-development-rules.md L659–659](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L659-L659); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. 익명 사용자의 create + join 차단
```

<a id="legacy-dev-326-f0"></a>
#### LEGACY-DEV-326 / f0

- 원문: [docs/game-platform-development-rules.md L660–660](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L660-L660); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:승인; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. 미승인 회원의 create + join 차단
```

<a id="legacy-dev-327-f0"></a>
#### LEGACY-DEV-327 / f0

- 원문: [docs/game-platform-development-rules.md L661–661](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L661-L661); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:승인; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. 승인 회원의 create + join 허용
```

<a id="legacy-dev-328-f0"></a>
#### LEGACY-DEV-328 / f0

- 원문: [docs/game-platform-development-rules.md L662–662](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L662-L662); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. non-member snapshot 차단
```

<a id="legacy-dev-329-f0"></a>
#### LEGACY-DEV-329 / f0

- 원문: [docs/game-platform-development-rules.md L663–663](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L663-L663); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:조건,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
5. 게임 시작 조건/권한의 server-side 검증
```

<a id="legacy-dev-330-f0"></a>
#### LEGACY-DEV-330 / f0

- 원문: [docs/game-platform-development-rules.md L664–664](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L664-L664); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
6. stale version 거부
```

<a id="legacy-dev-331-f0"></a>
#### LEGACY-DEV-331 / f0

- 원문: [docs/game-platform-development-rules.md L665–665](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L665-L665); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
7. duplicate action 중복 적용 방지
```

<a id="legacy-dev-332-f0"></a>
#### LEGACY-DEV-332 / f0

- 원문: [docs/game-platform-development-rules.md L666–666](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L666-L666); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
8. concurrent conflicting action의 single authoritative commit
```

<a id="legacy-dev-333-f0"></a>
#### LEGACY-DEV-333 / f0

- 원문: [docs/game-platform-development-rules.md L667–667](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L667-L667); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
9. reconnect 시 authoritative snapshot 복원
```

<a id="legacy-dev-334-f0"></a>
#### LEGACY-DEV-334 / f0

- 원문: [docs/game-platform-development-rules.md L668–668](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L668-L668); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:조건,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
10. 멀티플레이 게임의 same-room rematch lifecycle과 재시작 권한/조건의 server-side 검증
```

<a id="legacy-dev-335-f0"></a>
#### LEGACY-DEV-335 / f0

- 원문: [docs/game-platform-development-rules.md L669–669](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L669-L669); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
11. 다른 플레이어 private state 미노출
```

<a id="legacy-dev-336-f0"></a>
#### LEGACY-DEV-336 / f0

- 원문: [docs/game-platform-development-rules.md L671–671](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L671-L671); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
private state가 없는 게임도 11번을 생략하지 않고 **노출될 private state가 없음을 검증**한다.
```

<a id="legacy-dev-337-f0"></a>
#### LEGACY-DEV-337 / f0

- 원문: [docs/game-platform-development-rules.md L673–673](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L673-L673); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST: DB integration은 disposable local Supabase에서 검증한다.
```

<a id="legacy-dev-338-f0"></a>
#### LEGACY-DEV-338 / f0

- 원문: [docs/game-platform-development-rules.md L675–675](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L675-L675); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C049.
- 승인된 적용/전환: DB상세원owner참조;§4.1 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 테스트를 위해 production Supabase 데이터나 스키마를 직접 변경하지 않는다.
```

<a id="legacy-dev-386-f7"></a>
#### LEGACY-DEV-386 / f7

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 선택DB모델schema/RPC; 원문 범위: 코드블록순서7.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f9"></a>
#### LEGACY-DEV-386 / f9

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: online안전11/DB선택상세; 원문 범위: 코드블록순서9.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f22"></a>
#### LEGACY-DEV-386 / f22

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 선택productionmigration/권한검증; 원문 범위: 코드블록순서22.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-db-002-f0"></a>
#### LEGACY-DB-002 / f0

- 원문: [docs/game-platform-db-test-contract.md L5–5](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L5-L5); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C070.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
&gt; 현재 실행 규칙의 최상위 기준은 `docs/game-platform-development-rules.md`이며, 이 문서는 DB/RPC 품질 계약을 구체화한다.
```

<a id="legacy-db-003-f0"></a>
#### LEGACY-DB-003 / f0

- 원문: [docs/game-platform-db-test-contract.md L7–7](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L7-L7); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C070.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
이 문서는 신규 online platform-native 게임의 **현재 정식 DB/RPC 품질 계약**이다.
```

<a id="legacy-db-004-f0"></a>
#### LEGACY-DB-004 / f0

- 원문: [docs/game-platform-db-test-contract.md L9–9](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L9-L9); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C070.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
게임별 테이블 구조, RPC 이름, 규칙 상태 머신과 session lifecycle은 각 게임에 남겨 두되, 모든 신규 온라인 게임은 아래 서버 경계와 테스트 시나리오를 만족해야 한다.
```

<a id="legacy-db-005-f0"></a>
#### LEGACY-DB-005 / f0

- 원문: [docs/game-platform-db-test-contract.md L11–11](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L11-L11); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:반드시,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C070.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
공통 게임 DB 스키마나 공통 gameplay RPC를 강제하지 않는다. 공통화 대상은 SQL 구현 자체가 아니라 **반드시 검증해야 하는 안전성 계약**이다.
```

<a id="legacy-db-006-f0"></a>
#### LEGACY-DB-006 / f0

- 원문: [docs/game-platform-db-test-contract.md L15–15](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L15-L15); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
모든 신규 온라인 platform-native 게임은 최소 다음 시나리오를 검증한다.
```

<a id="legacy-db-007-f0"></a>
#### LEGACY-DB-007 / f0

- 원문: [docs/game-platform-db-test-contract.md L17–17](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L17-L17); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
1. 익명 사용자는 보호된 게임 세션에 진입할 수 없다.
```

<a id="legacy-db-008-f0"></a>
#### LEGACY-DB-008 / f0

- 원문: [docs/game-platform-db-test-contract.md L18–18](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L18-L18); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:승인; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
2. 승인되지 않은 회원은 보호된 게임 세션에 진입할 수 없다.
```

<a id="legacy-db-009-f0"></a>
#### LEGACY-DB-009 / f0

- 원문: [docs/game-platform-db-test-contract.md L19–19](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L19-L19); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:승인,할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
3. 승인 회원은 해당 게임 정책이 허용하는 세션 진입을 수행할 수 있다.
```

<a id="legacy-db-010-f0"></a>
#### LEGACY-DB-010 / f0

- 원문: [docs/game-platform-db-test-contract.md L20–20](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L20-L20); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
4. 세션 멤버가 아닌 사용자는 보호된 authoritative snapshot을 읽을 수 없다.
```

<a id="legacy-db-011-f0"></a>
#### LEGACY-DB-011 / f0

- 원문: [docs/game-platform-db-test-contract.md L21–21](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L21-L21); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:조건,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
5. 게임 시작 조건과 시작 권한은 서버가 해당 게임의 lifecycle 정책에 맞게 검증한다.
```

<a id="legacy-db-012-f0"></a>
#### LEGACY-DB-012 / f0

- 원문: [docs/game-platform-db-test-contract.md L22–22](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L22-L22); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
6. 오래된 `expected_version` 명령은 거부된다.
```

<a id="legacy-db-013-f0"></a>
#### LEGACY-DB-013 / f0

- 원문: [docs/game-platform-db-test-contract.md L23–23](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L23-L23); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
7. 동일한 `client_action_id` 재전송은 중복 적용되지 않는다.
```

<a id="legacy-db-014-f0"></a>
#### LEGACY-DB-014 / f0

- 원문: [docs/game-platform-db-test-contract.md L24–24](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L24-L24); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
8. 동시에 충돌하는 명령은 하나의 authoritative commit만 만든다.
```

<a id="legacy-db-015-f0"></a>
#### LEGACY-DB-015 / f0

- 원문: [docs/game-platform-db-test-contract.md L25–25](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L25-L25); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
9. 재접속 시 authoritative snapshot으로 현재 상태를 복원한다.
```

<a id="legacy-db-017-f0"></a>
#### LEGACY-DB-017 / f0

- 원문: [docs/game-platform-db-test-contract.md L27–27](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L27-L27); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
11. 다른 플레이어의 private state가 snapshot에 노출되지 않는다.
```

<a id="legacy-db-018-f0"></a>
#### LEGACY-DB-018 / f0

- 원문: [docs/game-platform-db-test-contract.md L29–29](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L29-L29); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C071.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
게임에 private state가 존재하지 않더라도 11번은 생략하지 않는다. 해당 게임의 snapshot에 private 정보가 없음을 명시적으로 검증한다.
```

<a id="legacy-db-019-f0"></a>
#### LEGACY-DB-019 / f0

- 원문: [docs/game-platform-db-test-contract.md L33–33](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L33-L33); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C072.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
다음 규칙은 위 11개 behavioral scenario를 늘리는 별도 gameplay contract가 아니라, migration이 같은 서버 경계를 실제 DB 권한으로 보존하기 위한 구현 계약이다.
```

<a id="legacy-db-020-f0"></a>
#### LEGACY-DB-020 / f0

- 원문: [docs/game-platform-db-test-contract.md L35–35](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L35-L35); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C072.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- Data API에 노출되는 schema에 새 table/view/function/sequence를 생성하거나 기존 객체의 호출 role·직접 접근 방식 등 권한 경계를 변경할 때는 프로젝트의 자동 default privilege에 의존하지 않는다. 해당 migration에서 `anon`, `authenticated`, `service_role` 중 실제 호출 주체와 필요한 최소 `GRANT`/`REVOKE`를 명시한다. 같은 object identity의 함수 구현만 교체하면서 기존 권한 경계를 유지하는 변경에는 권한 SQL 반복을 강제하지 않는다.
```

<a id="legacy-db-021-f0"></a>
#### LEGACY-DB-021 / f0

- 원문: [docs/game-platform-db-test-contract.md L36–36](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L36-L36); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C072.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- 테이블 privilege와 RLS는 서로 다른 보안 계층으로 각각 검토한다. 직접 읽기나 쓰기가 필요한 테이블에만 필요한 privilege를 부여하고, 허용 row 범위는 RLS 또는 서버 권위 RPC가 별도로 제한한다.
```

<a id="legacy-db-022-f0"></a>
#### LEGACY-DB-022 / f0

- 원문: [docs/game-platform-db-test-contract.md L37–37](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L37-L37); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C072.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- public RPC는 기본 `PUBLIC EXECUTE`에 의존하지 않는다. 실제 호출 주체만 실행할 수 있도록 기존 실행 권한을 회수한 뒤 필요한 role에만 `EXECUTE`를 허용한다.
```

<a id="legacy-db-023-f0"></a>
#### LEGACY-DB-023 / f0

- 원문: [docs/game-platform-db-test-contract.md L38–38](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L38-L38); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C072.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- `service_role`에도 관행적으로 모든 객체 권한을 열지 않는다. 서버가 Data API로 직접 접근해야 하는 객체와 작업에 필요한 최소 권한만 허용하며, browser runtime에는 `service_role` credential을 노출하지 않는다.
```

<a id="legacy-db-024-f0"></a>
#### LEGACY-DB-024 / f0

- 원문: [docs/game-platform-db-test-contract.md L39–39](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L39-L39); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C072.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- `SECURITY DEFINER` RPC 내부에서만 사용하는 상태 테이블처럼 browser의 직접 Data API 접근이 필요하지 않은 객체는 `anon`/`authenticated` table privilege를 열지 않아도 된다.
```

<a id="legacy-db-025-f0"></a>
#### LEGACY-DB-025 / f0

- 원문: [docs/game-platform-db-test-contract.md L40–40](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L40-L40); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C072.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- 이미 운영에 적용된 migration의 과거 SQL을 권한 보정 목적으로 다시 작성하지 않는다. 기존 객체의 권한을 보정해야 하면 새로운 forward migration으로 현재 최종 권한을 명시한다.
```

<a id="legacy-db-026-f0"></a>
#### LEGACY-DB-026 / f0

- 원문: [docs/game-platform-db-test-contract.md L42–42](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L42-L42); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C072.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
이 권한 계약은 아래 behavioral DB integration test의 통과만으로 검증 완료로 간주하지 않는다. disposable test DB가 fixture 생성과 검사를 위해 `service_role`에 추가 권한을 주는 bootstrap을 사용하더라도 그것은 production 권한 판단 근거가 아니며, production migration의 `GRANT`/`REVOKE`와 실제 적용 후 권한 상태를 별도로 확인한다.
```

<a id="legacy-db-028-f0"></a>
#### LEGACY-DB-028 / f0

- 원문: [docs/game-platform-db-test-contract.md L48–50](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L48-L50); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C073.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

````text
```text<br>tests/game-db-integration/platformContract.js<br>```
````

<a id="legacy-db-029-f0"></a>
#### LEGACY-DB-029 / f0

- 원문: [docs/game-platform-db-test-contract.md L52–52](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L52-L52); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C073.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
신규 게임은 다음과 같이 자체 통합 테스트 파일을 추가한다.
```

<a id="legacy-db-031-f0"></a>
#### LEGACY-DB-031 / f0

- 원문: [docs/game-platform-db-test-contract.md L61–61](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L61-L61); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C073.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
각 게임 테스트 파일은 자체 RPC 이름과 fixture 생성 방법을 유지하면서 `definePlatformGameDbContract` / `registerPlatformGameDbContract`를 사용한다.
```

<a id="legacy-db-034-f0"></a>
#### LEGACY-DB-034 / f0

- 원문: [docs/game-platform-db-test-contract.md L93–93](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L93-L93); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C074.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
이 계약은 다음 흐름을 검증하기 위한 것이다.
```

<a id="legacy-db-035-f0"></a>
#### LEGACY-DB-035 / f0

- 원문: [docs/game-platform-db-test-contract.md L95–102](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L95-L102); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C074.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

````text
```text<br>Client intent<br>→ authenticated game RPC<br>→ authorization / phase / version validation<br>→ transaction / row lock<br>→ authoritative DB mutation<br>→ snapshot refresh<br>```
````

<a id="legacy-db-036-f0"></a>
#### LEGACY-DB-036 / f0

- 원문: [docs/game-platform-db-test-contract.md L104–104](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L104-L104); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C074.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
Realtime 이벤트 자체의 수신 여부는 DB 계약의 최종 성공 조건이 아니다.
```

<a id="legacy-db-037-f0"></a>
#### LEGACY-DB-037 / f0

- 원문: [docs/game-platform-db-test-contract.md L106–106](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L106-L106); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C074.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
Realtime은 invalidation 신호로 사용하고, 최종 상태 검증은 DB/RPC snapshot으로 수행한다.
```

<a id="legacy-db-045-f0"></a>
#### LEGACY-DB-045 / f0

- 원문: [docs/game-platform-db-test-contract.md L122–122](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L122-L122); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C076.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
신규 상태 변경 RPC는 해당 게임의 action model에 맞는 경우 가능한 한 다음 값을 받는다.
```

<a id="legacy-db-046-f0"></a>
#### LEGACY-DB-046 / f0

- 원문: [docs/game-platform-db-test-contract.md L124–128](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L124-L128); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C076.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

````text
```text<br>room_id<br>expected_version<br>client_action_id<br>```
````

<a id="legacy-db-047-f0"></a>
#### LEGACY-DB-047 / f0

- 원문: [docs/game-platform-db-test-contract.md L130–130](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L130-L130); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C076.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
`duplicate_action_safe` 시나리오는 동일한 `client_action_id` 요청을 두 번 보내도 게임 상태가 두 번 진행되지 않음을 검증한다.
```

<a id="legacy-db-048-f0"></a>
#### LEGACY-DB-048 / f0

- 원문: [docs/game-platform-db-test-contract.md L132–132](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L132-L132); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C076.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
서버 구현은 동일 결과를 재반환하거나 명확한 duplicate 오류를 반환할 수 있다. 어느 방식이든 authoritative state가 한 번만 변경되어야 한다.
```

<a id="legacy-db-049-f0"></a>
#### LEGACY-DB-049 / f0

- 원문: [docs/game-platform-db-test-contract.md L136–136](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L136-L136); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C077.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
`concurrent_action_single_commit`은 동일한 버전을 기준으로 충돌하는 두 명령을 거의 동시에 보내고 다음을 확인한다.
```

<a id="legacy-db-050-f0"></a>
#### LEGACY-DB-050 / f0

- 원문: [docs/game-platform-db-test-contract.md L138–138](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L138-L138); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:조건,검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C077.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
게임이 명시적 room/start 버튼을 사용하지 않더라도 이 계약의 핵심은 동일하다. 예를 들어 자동 시작 게임은 참가 인원/조건을 만족하지 않은 상태에서 클라이언트가 시작 상태를 임의로 만들 수 없음을 검증하고, host가 없는 게임은 특정 역할이 아니라 **게임이 정의한 시작 조건 자체가 서버에서 강제됨**을 검증한다.
```

<a id="legacy-db-051-f0"></a>
#### LEGACY-DB-051 / f0

- 원문: [docs/game-platform-db-test-contract.md L140–140](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L140-L140); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C077.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- 둘 다 상태 변경에 성공하지 않는다.
```

<a id="legacy-db-052-f0"></a>
#### LEGACY-DB-052 / f0

- 원문: [docs/game-platform-db-test-contract.md L141–141](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L141-L141); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C077.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- 최종 room version은 한 번만 진행된다.
```

<a id="legacy-db-053-f0"></a>
#### LEGACY-DB-053 / f0

- 원문: [docs/game-platform-db-test-contract.md L142–142](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L142-L142); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C077.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
- snapshot이 하나의 일관된 결과를 가진다.
```

<a id="legacy-db-054-f0"></a>
#### LEGACY-DB-054 / f0

- 원문: [docs/game-platform-db-test-contract.md L144–144](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L144-L144); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C077.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
구체적인 lock/transaction 구현은 게임 DB가 결정하며 공통 플랫폼은 SQL 구현을 강제하지 않는다.
```

<a id="legacy-db-055-f0"></a>
#### LEGACY-DB-055 / f0

- 원문: [docs/game-platform-db-test-contract.md L148–148](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L148-L148); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C078.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
`Game DB integration` workflow는 관련 DB/harness 파일이 변경된 PR에서만 실행한다.
```

<a id="legacy-db-056-f0"></a>
#### LEGACY-DB-056 / f0

- 원문: [docs/game-platform-db-test-contract.md L150–150](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L150-L150); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C078.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
workflow는 `tests/game-db-integration/*.test.js` 전체를 실행하므로, 신규 게임이 계약 테스트 파일을 추가하면 별도 workflow를 만들 필요가 없다.
```

<a id="legacy-db-057-f0"></a>
#### LEGACY-DB-057 / f0

- 원문: [docs/game-platform-db-test-contract.md L152–152](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L152-L152); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C078.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
GitHub Actions 사용량을 줄이기 위해 일반 feature push마다 DB integration을 실행하지 않는다.
```

<a id="legacy-db-058-f0"></a>
#### LEGACY-DB-058 / f0

- 원문: [docs/game-platform-db-test-contract.md L156–156](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L156-L156); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C079.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
현재 `foundation.test.js`의 Liar/Marble 검증을 이 계약으로 강제로 재작성하지 않는다.
```

<a id="legacy-db-059-f0"></a>
#### LEGACY-DB-059 / f0

- 원문: [docs/game-platform-db-test-contract.md L158–158](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L158-L158); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C079.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
Legacy는 현재 동작을 보호하는 회귀 테스트를 유지한다.
```

<a id="legacy-db-060-f0"></a>
#### LEGACY-DB-060 / f0

- 원문: [docs/game-platform-db-test-contract.md L160–160](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-db-test-contract.md#L160-L160); blob `ff5eaf6aa5e6459e098d607119033169ac05f5f1`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C079.
- 승인된 적용/전환: DB선택시원상세+§4.1/4.2 / 원DB본문유지+모델참조.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/S/M.

```text
공통 계약은 모든 신규 online platform-native 게임의 기본 품질 게이트로 사용한다.
```

## MO4 상태·순서·복구

선택모델 하나가 authorized current state의 최종채택·복구와 입력준비를 끝까지 소유한다. Snapshot/Reconnect는 독립 엔진이 아니다. browser온라인/가시성trigger·구독연결성공은LIVE가 아니다. initial/live race, checkpoint/tail/gap/overflow/quiet loss·ACKloss/duplicate·복귀를 해당모델oracle로 검증한다.

DB의integer version·snapshot coalescing/invalidation은 해당모델조건이며 context/권한/현재성·최종채택 전체를 대신하지 않는다. LEGACY-DEV-271은Realtime 이벤트순서/전달성공만으로복구금지, LEGACY-DEV-251은Realtime payload자체를최종진실로사용금지다. 두의무를각각유지한다. 같은version도 다른match/run/view를부활시키지 못한다. simulation replay·action retry·snapshot재적용·effect·집계·publication 중복은CA4대로 구분한다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-dev-251-f0"></a>
#### LEGACY-DEV-251 / f0

- 원문: [docs/game-platform-development-rules.md L491–491](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L491-L491); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C039.
- 승인된 적용/전환: online권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: Realtime payload 자체를 게임 상태의 최종 진실로 사용하지 않는다.
```

<a id="legacy-dev-252-f0"></a>
#### LEGACY-DEV-252 / f0

- 원문: [docs/game-platform-development-rules.md L495–495](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L495-L495); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C040.
- 승인된 적용/전환: 선택action모델 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
게임 상태를 변경하는 명령은 가능한 한 공통 action envelope를 사용한다.
```

<a id="legacy-dev-253-f0"></a>
#### LEGACY-DEV-253 / f0

- 원문: [docs/game-platform-development-rules.md L497–503](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L497-L503); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C040.
- 승인된 적용/전환: 선택action모델 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>roomId<br>expectedVersion<br>clientActionId<br>actionType<br>payload<br>```
````

<a id="legacy-dev-254-f0"></a>
#### LEGACY-DEV-254 / f0

- 원문: [docs/game-platform-development-rules.md L505–505](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L505-L505); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C040.
- 승인된 적용/전환: 선택action모델 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`actionType`은 lowercase snake_case를 사용한다.
```

<a id="legacy-dev-255-f0"></a>
#### LEGACY-DEV-255 / f0

- 원문: [docs/game-platform-development-rules.md L507–507](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L507-L507); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C040.
- 승인된 적용/전환: 선택action모델 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST: `expectedVersion`으로 stale client action이 최신 상태를 덮어쓰지 못하게 한다.
```

<a id="legacy-dev-256-f0"></a>
#### LEGACY-DEV-256 / f0

- 원문: [docs/game-platform-development-rules.md L509–509](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L509-L509); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C040.
- 승인된 적용/전환: 선택action모델 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST: `clientActionId`로 중복 클릭, 재전송, 네트워크 retry가 상태를 두 번 진행시키지 못하게 한다.
```

<a id="legacy-dev-257-f0"></a>
#### LEGACY-DEV-257 / f0

- 원문: [docs/game-platform-development-rules.md L511–511](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L511-L511); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C040.
- 승인된 적용/전환: 선택action모델 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
게임별 RPC와 테이블 이름은 게임 namespace에 남긴다.
```

<a id="legacy-dev-258-f0"></a>
#### LEGACY-DEV-258 / f0

- 원문: [docs/game-platform-development-rules.md L513–513](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L513-L513); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C040.
- 승인된 적용/전환: 선택action모델 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 모든 게임을 하나의 거대한 공통 game-state 테이블이나 공통 gameplay RPC로 합치지 않는다.
```

<a id="legacy-dev-259-f0"></a>
#### LEGACY-DEV-259 / f0

- 원문: [docs/game-platform-development-rules.md L517–517](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L517-L517); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
authoritative snapshot은 non-negative integer `version`을 가져야 한다.
```

<a id="legacy-dev-260-f0"></a>
#### LEGACY-DEV-260 / f0

- 원문: [docs/game-platform-development-rules.md L519–519](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L519-L519); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 게임은 `createSnapshotCoordinator`를 기준으로 다음 동작을 유지한다.
```

<a id="legacy-dev-261-f0"></a>
#### LEGACY-DEV-261 / f0

- 원문: [docs/game-platform-development-rules.md L521–521](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L521-L521); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- authoritative snapshot 로드
```

<a id="legacy-dev-262-f0"></a>
#### LEGACY-DEV-262 / f0

- 원문: [docs/game-platform-development-rules.md L522–522](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L522-L522); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- stale snapshot 거부
```

<a id="legacy-dev-263-f0"></a>
#### LEGACY-DEV-263 / f0

- 원문: [docs/game-platform-development-rules.md L523–523](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L523-L523); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 연속 invalidation refresh coalescing
```

<a id="legacy-dev-264-f0"></a>
#### LEGACY-DEV-264 / f0

- 원문: [docs/game-platform-development-rules.md L524–524](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L524-L524); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 최신 accepted snapshot을 UI에 반영
```

<a id="legacy-dev-265-f0"></a>
#### LEGACY-DEV-265 / f0

- 원문: [docs/game-platform-development-rules.md L526–526](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L526-L526); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Reconnect는 이벤트 replay가 아니라 authoritative snapshot 재조회로 복원한다.
```

<a id="legacy-dev-266-f0"></a>
#### LEGACY-DEV-266 / f0

- 원문: [docs/game-platform-development-rules.md L528–528](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L528-L528); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
브라우저의 다음 복귀 신호에서는 snapshot refresh가 가능해야 한다.
```

<a id="legacy-dev-267-f0"></a>
#### LEGACY-DEV-267 / f0

- 원문: [docs/game-platform-development-rules.md L530–530](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L530-L530); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- online
```

<a id="legacy-dev-268-f0"></a>
#### LEGACY-DEV-268 / f0

- 원문: [docs/game-platform-development-rules.md L531–531](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L531-L531); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- pageshow
```

<a id="legacy-dev-269-f0"></a>
#### LEGACY-DEV-269 / f0

- 원문: [docs/game-platform-development-rules.md L532–532](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L532-L532); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- visibility visible
```

<a id="legacy-dev-270-f0"></a>
#### LEGACY-DEV-270 / f0

- 원문: [docs/game-platform-development-rules.md L534–534](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L534-L534); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST: Realtime은 **invalidation 신호**로 사용한다.
```

<a id="legacy-dev-271-f0"></a>
#### LEGACY-DEV-271 / f0

- 원문: [docs/game-platform-development-rules.md L536–536](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L536-L536); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: Realtime 이벤트 순서나 전달 성공만으로 게임 상태를 복원하지 않는다.
```

<a id="legacy-dev-296-f0"></a>
#### LEGACY-DEV-296 / f0

- 원문: [docs/game-platform-development-rules.md L579–579](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L579-L579); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C045.
- 승인된 적용/전환: 지속세션/온라인권위종료 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 종료 후 모든 클라이언트가 authoritative snapshot 또는 명시적 terminal state로 동일한 결과를 복구할 수 있어야 한다.
```

<a id="legacy-dev-386-f10"></a>
#### LEGACY-DEV-386 / f10

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: statefulonline권위상태; 원문 범위: 코드블록순서10.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f11"></a>
#### LEGACY-DEV-386 / f11

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 상태변경action순서/중복; 원문 범위: 코드블록순서11.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f12"></a>
#### LEGACY-DEV-386 / f12

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 선택onlineRealtime모델복구;DBinvalidation조건; 원문 범위: 코드블록순서12.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f20"></a>
#### LEGACY-DEV-386 / f20

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 멀티client/reconnect검증; 원문 범위: 코드블록순서20.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-ui-188-f2"></a>
#### LEGACY-UI-188 / f2

- 원문: [docs/game-platform-ui-rules.md L340–340](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L340-L340); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C103.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 권위결과/잠정구분참조; 원문 범위: authoritative결과반영.
- 검증 대응: V-D.

```text
애니메이션은 장식보다 **원인 → 이동/행동 → authoritative 결과 반영**의 순서를 사용자가 이해하게 만드는 것이 우선이다.
```

<a id="legacy-ui-189-f1"></a>
#### LEGACY-UI-189 / f1

- 원문: [docs/game-platform-ui-rules.md L342–342](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L342-L342); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C103.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 선택모델동기화; 원문 범위: 동기화안정성을해치지않음.
- 검증 대응: V-D.

```text
동기화 안정성을 해치거나 실제 서버 상태와 다른 결과를 먼저 확정해서 보여주지 않는다.
```

## MO5 시간·입력·공간

선택모델이 실제 권위시간·입력순서/유효범위·공간좌표/가시성을 소유하며 장르경험조건과 연결한다. 실시간협동은 승인R01~13의 지속흐름·입력해제/취소·공간/카메라·시간분리·hidden/복귀·역할/정보·시작/종료/재참여·복구/입력준비·전체수명·잠정/공식소비·접근성/반응성/성능관측을 따른다.

실제장치/원격intent취소손실·시간공백·선택제품정책은 구현전 해당모델절과GAME_SPEC에서 닫는다. 없는camera/physics/관전은이유와함께비적용으로명시하되 안전/수명/현재성을삭제하지 않는다. 경쟁/3D/정밀리듬/대규모장기세계지원이나 WCAG전면/브라우저인증을 주장하지 않는다. [승인RT내용](game-platform-rebuild/artifacts/step-5c-realtime-coop-spatial-rules.md)을참조하며 실제RT본문은7A3이다.

## MO6 결과·지속성·운영

종료·공식결과·참여자outcome·관람자표현을 구분한다. 승인권위 producer가 식별·확정·정정을 소유하며 game-local 도메인규칙과연결한다. 통계/보상consumer는공식값을소비하되 정정은새경기가아니라기존기여대체다. commit미상으로새identity를무조건재발행하지 않는다. 없는winner/score/XP·결과를만들지 않는다. consumer중복은CA4를참조한다.

local/async·기록형은 보존/손실·제출/조회권위·공식판단/정정·복구의 실제경계를정한다. client점수를무조건신뢰하지 않으며 보호된제출/조회에는인가/중복/복구를적용한다. purelocal과보호async의성립경로를구분한다.

D0006~10의성능/비용/기록/삭제/탈퇴/backup/복원/운영조건·UNKNOWN을유지한다. 총접속100(로비/관전포함)/판최대8/원격권위p95≤250ms/정상망각복구≤5초, 세금포함월추가3만원한도, 참가자기록접근·최초종결30일삭제·탈퇴본인연결해제/타참가최소기록기존deadline, RPO≤24h목표·발견→인가복구≤24h목표·7일복구점 등 원조건을유지한다. 실제Windows10/11 Chrome·Edge/iPhoneSafari 환경·배포bytes/망/표본/오차·부하·삭제/복원ACL/비용증거를 후속 실행전구체화한다. 공급자/요금/운영재판단·구매/job/dump/복원허용이 아니다. 실제실행/지원/오픈은미완료다.

