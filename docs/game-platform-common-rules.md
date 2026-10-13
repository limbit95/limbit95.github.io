# Game Platform vNext — 공통 개발·품질 규칙

> **문서 분류:** CURRENT
> **적용 범위:** 신규 vNext (기존 consumer 제외)
> **계약 식별:** GP-COMMON/1

신규 vNext 상위 진입은 [AR](game-platform-architecture.md)다. 기존 consumer는 [기존 development](game-platform-development-rules.md)·[기존 UI](game-platform-ui-rules.md)·선택 DB의 기존 계약을 유지한다. 이 CURRENT는 topic+계약/consumer scope의 단일 본문이며 문서 존재는 runtime 구현/지원 완료가 아니다.

승인 근거: [STEP6 Target](game-platform-rebuild/artifacts/step-6-target-architecture.md), [전수 ID/f](game-platform-rebuild/artifacts/step-6-clause-destinations.md), [CP0089](game-platform-rebuild/checkpoints/CP-0089-step-6-design-result-approved.md), 실제 PR417/418 병합. STEP7A1 반영 PR은 REVIEW_PENDING이며 최종 결과 검토·병합은 남아 있다. 행동 NOT_RUN·UNKNOWN·후속 의무를 유지한다.

## CO1 조사·출처·권리

실제 제품/경험의 규칙·출처·판본·시각자료·자산사용가능범위를 개발 전에 조사하고 출처→관찰→구현결정으로 기록한다. 공개된 기존 보드게임 조건과 실물조사의 보드 의미는 AR4 보드 경로에서 확인한다. 확인되지 않은 규칙/권리를 추측하지 않고 불명확 자산은 확인 전 사용하지 않는다. 장문 규칙/공식 artwork를 안내 필요만으로 복제하지 않는다. 다른 판본을 설명 없이 섞지 않는다.

장르명으로 기술모델이나 실제 Probe 게임을 결정하지 않는다. 예시/맥락은 적용 조건과 함께 읽고 공통 MUST로 승격하지 않는다. 실제 GAME_SPEC/UI_DESIGN에 출처·해석/VI·권리·선택과 미확인을 남긴다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-agent-037-f0"></a>
#### LEGACY-AGENT-037 / f0

- 원문: [AGENTS.md L61–61](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L61-L61); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 사용자가 새로운 게임 개발을 요청하면 gameplay/runtime 구현 전에 게임 규칙·제품 범위와 원본 디자인·구성물·Visual Identity·자산 사용 가능 범위를 조사하고 `games/&lt;game-id&gt;/GAME_SPEC.md`, `games/&lt;game-id&gt;/DEVELOPMENT.md`, `games/&lt;game-id&gt;/UI_DESIGN.md`, `games/&lt;game-id&gt;/UI_DECISIONS.md`를 먼저 생성합니다.
```

<a id="legacy-dev-033-f0"></a>
#### LEGACY-DEV-033 / f0

- 원문: [docs/game-platform-development-rules.md L61–61](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L61-L61); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
사용자가 `새 게임 만들자`, `&lt;게임명&gt; 개발 시작하자`처럼 신규 게임 개발을 요청하면 gameplay/runtime 코드부터 작성하지 않는다. 먼저 게임 규칙과 제품 범위뿐 아니라 원본 디자인과 Visual Identity까지 조사해 다음 작업자가 구현 방향을 복원할 수 있는 bootstrap 문서를 만든다.
```

<a id="legacy-dev-034-f0"></a>
#### LEGACY-DEV-034 / f0

- 원문: [docs/game-platform-development-rules.md L63–63](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L63-L63); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
기본 순서는 다음과 같다.
```

<a id="legacy-dev-035-f0"></a>
#### LEGACY-DEV-035 / f0

- 원문: [docs/game-platform-development-rules.md L65–65](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L65-L65); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. 게임의 원본 규칙과 구성요소를 조사한다.
```

<a id="legacy-dev-036-f1"></a>
#### LEGACY-DEV-036 / f1

- 원문: [docs/game-platform-development-rules.md L66–66](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L66-L66); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 일반디자인/권리조사; 원문 범위: 색상·심볼·레이아웃·타이포그래피·분위기·자산사용가능범위 조사.
- 검증 대응: V-D.

```text
2. 공식/퍼블리셔 자료와 실제 구성물을 기준으로 색상, 심볼, 카드/보드/칩 구조, 레이아웃, 타이포그래피, 분위기와 자산 사용 가능 범위를 조사한다.
```

<a id="legacy-dev-037-f0"></a>
#### LEGACY-DEV-037 / f0

- 원문: [docs/game-platform-development-rules.md L67–67](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L67-L67); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. 이번 웹게임에서 지원할 인원, 규칙 버전/변형, online/local 범위와 제외 범위를 정한다.
```

<a id="legacy-dev-042-f0"></a>
#### LEGACY-DEV-042 / f0

- 원문: [docs/game-platform-development-rules.md L72–72](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L72-L72); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
8. 규칙 해석, 디자인 출처, 자산 사용 권리가 불명확한 항목은 임의로 확정하지 않고 책임 문서의 `Open Questions / Deferred`에 남긴다.
```

<a id="legacy-dev-044-f3"></a>
#### LEGACY-DEV-044 / f3

- 원문: [docs/game-platform-development-rules.md L75–75](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L75-L75); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 출처재구성/권리; 원문 범위: 제3문장: 장문복제안함·필요사실/결정요약.
- 검증 대응: V-D.

```text
공개된 기존 보드게임을 웹게임으로 구현하는 경우 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 문서를 우선 확인한다. `GAME_SPEC.md`에는 사용한 출처와 구현상 해석 결정을 남긴다. 규칙 원문을 장문 복제하지 않고 구현에 필요한 사실과 결정만 요약한다.
```

<a id="legacy-dev-291-f0"></a>
#### LEGACY-DEV-291 / f0

- 원문: [docs/game-platform-development-rules.md L571–571](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L571-L571); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C044.
- 승인된 적용/전환: 규칙안내 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 규칙 원문을 장문 복제하지 않고 출처를 남긴 뒤 웹게임에 필요한 사실과 해석을 상세히 재구성한다.
```

<a id="legacy-dev-386-f1"></a>
#### LEGACY-DEV-386 / f1

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 원본규칙/출처·구성물조사; 원문 범위: 코드블록순서1.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f2"></a>
#### LEGACY-DEV-386 / f2

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 원본디자인/VI/자산조사; 원문 범위: 코드블록순서2.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-ui-001-f0"></a>
#### LEGACY-UI-001 / f0

- 원문: [docs/game-platform-ui-rules.md L3–5](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L3-L5); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:검증,필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C080.
- 승인된 적용/전환: 공통디자인목적 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
&gt; **문서 분류:** CURRENT<br>&gt;<br>&gt; 현재 Game Platform의 최상위 실행 규칙은 `docs/game-platform-development-rules.md`다. 이 문서는 신규 platform-native 게임의 UI/UX 조사, 설계, 구현 및 검증에 추가로 적용하는 필수 규칙이다.
```

<a id="legacy-ui-002-f0"></a>
#### LEGACY-UI-002 / f0

- 원문: [docs/game-platform-ui-rules.md L9–9](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L9-L9); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C081.
- 승인된 적용/전환: 공통디자인목적 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
청파 같이의 신규 게임은 동일한 플랫폼 기능을 공유하더라도 시각적으로 하나의 공통 템플릿에 끼워 넣지 않는다.
```

<a id="legacy-ui-003-f0"></a>
#### LEGACY-UI-003 / f0

- 원문: [docs/game-platform-ui-rules.md L11–11](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L11-L11); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C081.
- 승인된 적용/전환: 공통디자인목적 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
각 게임은 원본 게임의 규칙과 구성물뿐 아니라 고유한 색상, 심볼, 카드/보드 구조, 타이포그래피, 재질감, 분위기를 조사한 뒤 **해당 게임만의 독립적인 디지털 공간**으로 설계한다.
```

<a id="legacy-ui-004-f0"></a>
#### LEGACY-UI-004 / f0

- 원문: [docs/game-platform-ui-rules.md L13–13](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L13-L13); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C081.
- 승인된 적용/전환: 공통디자인목적 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
공통 플랫폼 UX와 게임별 Visual Identity의 책임은 분리한다.
```

<a id="legacy-ui-005-f0"></a>
#### LEGACY-UI-005 / f0

- 원문: [docs/game-platform-ui-rules.md L15–15](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L15-L15); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C081.
- 승인된 적용/전환: 공통디자인목적 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- SHARED: 접근 권한, Room/Lobby, 연결 상태, 플레이어 identity, 준비/시작 lifecycle, 안전한 종료 등 반복 가능한 플랫폼 책임
```

<a id="legacy-ui-006-f0"></a>
#### LEGACY-UI-006 / f0

- 원문: [docs/game-platform-ui-rules.md L16–16](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L16-L16); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C081.
- 승인된 적용/전환: 공통디자인목적 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- GAME-LOCAL: 색상, 배경, 심볼, 카드/보드/칩 표현, 게임별 레이아웃, 모션, 사운드와 presentation
```

<a id="legacy-ui-007-f0"></a>
#### LEGACY-UI-007 / f0

- 원문: [docs/game-platform-ui-rules.md L17–17](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L17-L17); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C081.
- 승인된 적용/전환: 공통디자인목적 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 공통 Shell을 사용하더라도 게임 고유 Visual Identity를 획일화하지 않는다.
```

<a id="legacy-ui-008-f0"></a>
#### LEGACY-UI-008 / f0

- 원문: [docs/game-platform-ui-rules.md L21–21](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L21-L21); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
사용자가 `&lt;게임명&gt; 개발하자`, `신규 게임 개발 시작하자`처럼 새 게임 개발을 요청하면 UI 조사를 별도 요청으로 기다리지 않는다.
```

<a id="legacy-ui-009-f0"></a>
#### LEGACY-UI-009 / f0

- 원문: [docs/game-platform-ui-rules.md L23–23](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L23-L23); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
runtime 구현 전에 게임 규칙 조사와 함께 최소 다음을 조사한다.
```

<a id="legacy-ui-010-f0"></a>
#### LEGACY-UI-010 / f0

- 원문: [docs/game-platform-ui-rules.md L25–25](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L25-L25); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 공식 제품/퍼블리셔 페이지와 공식 규칙서
```

<a id="legacy-ui-011-f1"></a>
#### LEGACY-UI-011 / f1

- 원문: [docs/game-platform-ui-rules.md L26–26](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L26-L26); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 일반시각조사; 원문 범위: 신뢰가능시각자료존재시텍스트만으로VI확정금지·직접확인.
- 검증 대응: V-D.

```text
- 공식 또는 신뢰 가능한 시각 자료가 존재하면 텍스트 설명만으로 Visual Identity를 확정하지 않고 실제 카드·보드·패키지·토큰 등 visual reference를 직접 확인한다.
```

<a id="legacy-ui-012-f0"></a>
#### LEGACY-UI-012 / f0

- 원문: [docs/game-platform-ui-rules.md L27–27](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L27-L27); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 박스, 카드, 보드, 칩, 토큰, 말, 주사위 등 실제 구성물
```

<a id="legacy-ui-013-f0"></a>
#### LEGACY-UI-013 / f0

- 원문: [docs/game-platform-ui-rules.md L28–28](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L28-L28); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 대표 색상과 보조/강조 색상
```

<a id="legacy-ui-014-f0"></a>
#### LEGACY-UI-014 / f0

- 원문: [docs/game-platform-ui-rules.md L29–29](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L29-L29); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 로고가 아닌 게임을 연상시키는 기능적 심볼과 형태
```

<a id="legacy-ui-015-f1"></a>
#### LEGACY-UI-015 / f1

- 원문: [docs/game-platform-ui-rules.md L30–30](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L30-L30); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 일반시각정보조사; 원문 범위: 숫자/정보배치·타이포그래피분위기.
- 검증 대응: V-D.

```text
- 숫자/정보의 배치, 카드 비율, 타이포그래피 분위기
```

<a id="legacy-ui-016-f0"></a>
#### LEGACY-UI-016 / f0

- 원문: [docs/game-platform-ui-rules.md L31–31](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L31-L31); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 패턴, 테이블/재질감, 배경과 장식 요소
```

<a id="legacy-ui-017-f0"></a>
#### LEGACY-UI-017 / f0

- 원문: [docs/game-platform-ui-rules.md L32–32](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L32-L32); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 실제 테이블에서 구성물이 배치되는 방식
```

<a id="legacy-ui-018-f0"></a>
#### LEGACY-UI-018 / f0

- 원문: [docs/game-platform-ui-rules.md L33–33](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L33-L33); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 필요한 경우 공식 또는 신뢰 가능한 디지털 구현과 실제 플레이 영상의 interaction/presentation
```

<a id="legacy-ui-019-f0"></a>
#### LEGACY-UI-019 / f0

- 원문: [docs/game-platform-ui-rules.md L34–34](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L34-L34); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 사용하려는 이미지, 로고, 일러스트, 폰트, 사운드 등 자산의 저작권·상표·라이선스·사용 조건
```

<a id="legacy-ui-020-f0"></a>
#### LEGACY-UI-020 / f0

- 원문: [docs/game-platform-ui-rules.md L36–36](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L36-L36); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
조사 결과는 구현 전에 `games/&lt;game-id&gt;/UI_DESIGN.md`에 기록한다.
```

<a id="legacy-ui-021-f0"></a>
#### LEGACY-UI-021 / f0

- 원문: [docs/game-platform-ui-rules.md L38–38](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L38-L38); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
조사 기록은 가능한 범위에서 **출처 → 관찰한 디자인 요소 → 구현 결정**이 추적되게 남긴다.
```

<a id="legacy-ui-024-f0"></a>
#### LEGACY-UI-024 / f0

- 원문: [docs/game-platform-ui-rules.md L49–49](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L49-L49); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
단순 링크 모음만 남기지 않고 그 자료가 실제 설계 결정에 어떤 근거가 됐는지 기록한다.
```

<a id="legacy-ui-025-f0"></a>
#### LEGACY-UI-025 / f0

- 원문: [docs/game-platform-ui-rules.md L51–51](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L51-L51); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 본문:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C082.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 조사 없이 청파 같이 일반 페이지의 색상과 컴포넌트를 그대로 복사해 게임의 기본 디자인으로 확정하지 않는다.
```

<a id="legacy-ui-026-f0"></a>
#### LEGACY-UI-026 / f0

- 원문: [docs/game-platform-ui-rules.md L55–55](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L55-L55); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C083.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
원본 게임의 시각적 정체성을 적극적으로 조사하되 보호받는 자산을 무단 복제하지 않는다.
```

<a id="legacy-ui-027-f0"></a>
#### LEGACY-UI-027 / f0

- 원문: [docs/game-platform-ui-rules.md L59–59](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L59-L59); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C084.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 출처와 확인 날짜 또는 판본을 가능한 범위에서 기록한다.
```

<a id="legacy-ui-028-f0"></a>
#### LEGACY-UI-028 / f0

- 원문: [docs/game-platform-ui-rules.md L60–60](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L60-L60); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C084.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 여러 판본의 디자인이 다른 경우 목표 판본 또는 혼합하지 않을 기준을 정한다.
```

<a id="legacy-ui-029-f0"></a>
#### LEGACY-UI-029 / f0

- 원문: [docs/game-platform-ui-rules.md L61–61](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L61-L61); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C084.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 직접 사용할 자산은 사용 근거와 라이선스/허가 상태를 기록한다.
```

<a id="legacy-ui-030-f0"></a>
#### LEGACY-UI-030 / f0

- 원문: [docs/game-platform-ui-rules.md L62–62](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L62-L62); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C084.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 사용 권리가 불명확한 로고, 일러스트, 사진, 폰트, 음원은 그대로 포함하지 않는다.
```

<a id="legacy-ui-031-f0"></a>
#### LEGACY-UI-031 / f0

- 원문: [docs/game-platform-ui-rules.md L63–63](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L63-L63); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C084.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 직접 복제가 어려운 경우 대표 색상, 정보 계층, 기능적 형태, 공간 배치, 분위기를 분석해 독자적인 게임-local 표현으로 재구성한다.
```

<a id="legacy-ui-032-f0"></a>
#### LEGACY-UI-032 / f0

- 원문: [docs/game-platform-ui-rules.md L65–65](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L65-L65); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C084.
- 승인된 적용/전환: 조사/권리/선택판본 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
목표는 **원본 게임의 정체성과 플레이 감각을 살리되 보호되는 자산을 무단 복제하지 않는 것**이다.
```

<a id="legacy-ui-066-f2"></a>
#### LEGACY-UI-066 / f2

- 원문: [docs/game-platform-ui-rules.md L118–118](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L118-L118); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C088.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 자산권리; 원문 범위: 권리불명공식artwork를안내이유로복제금지.
- 검증 대응: V-D.

```text
- 카드, 주사위, 말, 칩, 보드, 트랙 등 게임 구성물을 표현할 때는 `UI_DESIGN.md`의 자산 사용 경계와 game-local component 언어를 재사용하거나 독자적으로 재구성한다. 사용 권리가 불명확한 공식 artwork를 규칙 설명이라는 이유로 직접 복제하지 않는다.
```

## CO2 네 문서·시간축·기록

GAME_SPEC.md는 현재 제품/기능·구조·선택7축/적용계약/모델·Capability·비적용/미지원·검증을 소유한다. DEVELOPMENT.md는 실제 기능진행·검증·다음행동을 소유한다. UI_DESIGN.md는 개발 전 전수조사/VI/초기baseline, UI_DECISIONS.md는 개발 후 의미 있는 디자인변경·대안/이유/검증·유효override를 소유한다.

동일 항목은 최신 non-superseded UI_DECISIONS override가 baseline보다 우선한다. SUPERSEDED/REVERTED를 부활시키거나 후속 사용자수정을 초기Phase로 원복하지 않는다. 명백한 초기조사/출처오기 정정 예외는 이유를 추적한다. 모든 CSS수치나 요청횟수를 기록하지 않고 하나의 디자인영역이 안정화될 때 의미 있는 결정으로 기록한다.

`기능 체크포인트 기록하자`는 DEVELOPMENT와 기능설계가 바뀐 경우 GAME_SPEC, `디자인 체크포인트 기록하자`는 안정화 UI_DECISIONS에 적용한다. 두 명령은 같은 요청에서 가능하나 책임문서를 구분한다. 일반 checkpoint/새채팅요약 요청을 공식기록명령으로 자동 해석하지 않는다. 별도로 기능Phase/release closeout·디자인 lifecycle 기록시점은 계속 적용한다. 기존 게임의 adoption baseline은 원래범위/이력으로 유지하고 새baseline으로 다시 만들지 않는다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-agent-039-f0"></a>
#### LEGACY-AGENT-039 / f0

- 원문: [AGENTS.md L63–63](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L63-L63); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `GAME_SPEC.md`는 현재 기능 규칙·구조의 기준, `DEVELOPMENT.md`는 기능 개발 진행·검증 인수인계, `UI_DESIGN.md`는 소스 개발 전 전수 조사·분석으로 수립한 초기 디자인 baseline, `UI_DECISIONS.md`는 개발 시작 후의 의미 있는 디자인 변경·대안·결정 이유·검증 이력과 baseline override를 기록합니다.
```

<a id="legacy-agent-041-f0"></a>
#### LEGACY-AGENT-041 / f0

- 원문: [AGENTS.md L65–65](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L65-L65); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 각 platform-native 게임은 `games/&lt;game-id&gt;/DEVELOPMENT.md`를 기능 개발상태의 인수인계 문서로 유지하고, 디자인 개발의 진행·변경 이력은 `games/&lt;game-id&gt;/UI_DECISIONS.md`에 분리합니다.
```

<a id="legacy-agent-042-f0"></a>
#### LEGACY-AGENT-042 / f0

- 원문: [AGENTS.md L66–66](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L66-L66); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- `UI_DECISIONS.md`에는 모든 CSS 수치 변경을 쌓지 않고, 다음 작업자가 현재 UI만 보고 복원하기 어려운 의미 있는 디자인/interaction 결정과 그 이유를 기록합니다. 개발 시작 후의 변경으로 `UI_DESIGN.md` baseline을 덮어쓰지 않으며, 같은 항목에서 충돌하면 최신 non-superseded `UI_DECISIONS.md`가 우선합니다.
```

<a id="legacy-agent-043-f0"></a>
#### LEGACY-AGENT-043 / f0

- 원문: [AGENTS.md L67–67](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L67-L67); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 표현:반드시; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 기존 신규 게임 개발을 이어갈 때는 새 브랜치를 만들기 전에 해당 `DEVELOPMENT.md`와 진행 중 game-id 브랜치를 확인합니다. UI Phase를 이어갈 때는 반드시 `UI_DESIGN.md` baseline과 `UI_DECISIONS.md`의 최신 non-superseded 결정을 함께 읽고, 후속 결정이 초기 Phase보다 우선하도록 하며 이미 반영된 디자인을 원복하지 않습니다. 명확한 진행 중 checkpoint branch가 있으면 그 브랜치를 이어갑니다.
```

<a id="legacy-agent-045-f0"></a>
#### LEGACY-AGENT-045 / f0

- 원문: [AGENTS.md L69–69](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L69-L69); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 이 수동 리뷰에서 개발자가 요청한 여러 디테일 수정은 요청 횟수대로 기록하지 않고, 하나의 디자인 영역이 안정화되어 최종 방향이 확정될 때 의미 있는 decision 하나로 `UI_DECISIONS.md`에 기록합니다. 디자인 PR merge/close, 작업 브랜치 종료, release closeout 전에는 기록 누락이 없는지 확인합니다.
```

<a id="legacy-agent-046-f0"></a>
#### LEGACY-AGENT-046 / f0

- 원문: [AGENTS.md L70–70](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L70-L70); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 사용자가 `기능 체크포인트 기록하자`라고 요청하면 기능 개발 상태를 `DEVELOPMENT.md`에 기록하고, 기능 설계가 바뀐 경우에만 `GAME_SPEC.md`를 함께 정합화합니다. 디자인 문서는 이 명령 때문에 수정하지 않습니다.
```

<a id="legacy-agent-047-f0"></a>
#### LEGACY-AGENT-047 / f0

- 원문: [AGENTS.md L71–71](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L71-L71); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 사용자가 `디자인 체크포인트 기록하자`라고 요청하면 현재까지 안정화된 의미 있는 디자인 결정을 `UI_DECISIONS.md`에 기록합니다. 초기 `UI_DESIGN.md` baseline은 재작성하지 않고, 기능 진행 문서는 이 명령 때문에 수정하지 않습니다.
```

<a id="legacy-agent-048-f0"></a>
#### LEGACY-AGENT-048 / f0

- 원문: [AGENTS.md L72–72](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L72-L72); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 두 checkpoint 명령은 같은 요청에서 함께 사용할 수 있으며, 각각의 책임 문서만 갱신합니다. 접두어가 없는 일반적인 checkpoint 표현이나 새 채팅용 정리·문서·요약 요청은 공식 repository checkpoint 명령으로 자동 해석하지 않습니다. 유효한 현재 작업 브랜치가 있으면 그 브랜치에 commit하고, 없으면 저장소의 일반 브랜치 규칙에 따라 별도 작업 브랜치를 사용합니다.
```

<a id="legacy-agent-049-f0"></a>
#### LEGACY-AGENT-049 / f0

- 원문: [AGENTS.md L73–73](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L73-L73); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 두 사용자 명령과 별개로 기능 Phase 완료·release closeout의 `DEVELOPMENT.md` 갱신 시점과 디자인 lifecycle의 `UI_DECISIONS.md` 기록 트리거는 계속 적용합니다.
```

<a id="legacy-agent-050-f0"></a>
#### LEGACY-AGENT-050 / f0

- 원문: [AGENTS.md L74–74](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L74-L74); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 중간 checkpoint에서는 Phase를 완료 처리하지 않으며 실제 완료 항목, 미완료 항목, 다음 첫 작업, 검증 상태를 명확히 구분합니다.
```

<a id="legacy-dev-038-f0"></a>
#### LEGACY-DEV-038 / f0

- 원문: [docs/game-platform-development-rules.md L68–68](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L68-L68); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. `games/&lt;game-id&gt;/GAME_SPEC.md`를 생성해 현재 게임 규칙과 기능 구현 설계를 기록한다.
```

<a id="legacy-dev-039-f0"></a>
#### LEGACY-DEV-039 / f0

- 원문: [docs/game-platform-development-rules.md L69–69](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L69-L69); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
5. `games/&lt;game-id&gt;/DEVELOPMENT.md`를 생성해 기능 개발의 현재 진행·검증 상태와 다음 기능 작업을 기록한다.
```

<a id="legacy-dev-040-f0"></a>
#### LEGACY-DEV-040 / f0

- 원문: [docs/game-platform-development-rules.md L70–70](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L70-L70); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
6. `games/&lt;game-id&gt;/UI_DESIGN.md`를 생성해 디자인 전수 조사 결과, Visual Identity, 독립 페이지 경험, 최초 UI/presentation Phase와 validation 기준을 runtime 개발 전에 기록한다.
```

<a id="legacy-dev-041-f0"></a>
#### LEGACY-DEV-041 / f0

- 원문: [docs/game-platform-development-rules.md L71–71](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L71-L71); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
7. `games/&lt;game-id&gt;/UI_DECISIONS.md`를 생성해 이후 의미 있는 디자인/interaction 변경, 대안, 결정 이유, 구현 상태와 디자인 검증 이력을 기록할 자리를 만든다.
```

<a id="legacy-dev-044-f2"></a>
#### LEGACY-DEV-044 / f2

- 원문: [docs/game-platform-development-rules.md L75–75](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L75-L75); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 실제규칙출처/해석기록; 원문 범위: 제2문장: GAME_SPEC에출처와해석결정.
- 검증 대응: V-D.

```text
공개된 기존 보드게임을 웹게임으로 구현하는 경우 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 문서를 우선 확인한다. `GAME_SPEC.md`에는 사용한 출처와 구현상 해석 결정을 남긴다. 규칙 원문을 장문 복제하지 않고 구현에 필요한 사실과 결정만 요약한다.
```

<a id="legacy-dev-045-f0"></a>
#### LEGACY-DEV-045 / f0

- 원문: [docs/game-platform-development-rules.md L79–79](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L79-L79); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C016.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`GAME_SPEC.md`는 **이 게임이 무엇이며 청파 같이에서 어떻게 구현할지 정의하는 game-local 설계 기준**이다. 최소 다음 섹션을 유지한다.
```

<a id="legacy-dev-046-f0"></a>
#### LEGACY-DEV-046 / f0

- 원문: [docs/game-platform-development-rules.md L81–93](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L81-L93); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C016.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>## Game Overview<br>## Rules and Sources<br>## Product Scope<br>## State Machine<br>## Domain Model<br>## Platform Boundary<br>## Authority and Persistence<br>## UI / UX Direction<br>## Implementation Plan<br>## Validation Plan<br>## Open Questions / Deferred<br>```
````

<a id="legacy-dev-047-f0"></a>
#### LEGACY-DEV-047 / f0

- 원문: [docs/game-platform-development-rules.md L95–95](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L95-L95); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C016.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
게임 규칙, 상태 머신, 도메인 모델 또는 구현 경계가 바뀌면 현재 설계와 일치하도록 `GAME_SPEC.md`를 갱신한다. 작은 commit 내역을 쌓는 changelog로 사용하지 않는다.
```

<a id="legacy-dev-048-f0"></a>
#### LEGACY-DEV-048 / f0

- 원문: [docs/game-platform-development-rules.md L99–99](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L99-L99); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C017.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`UI_DESIGN.md`는 **신규 게임의 runtime/UI 소스 개발을 시작하기 전에 수행한 디자인 전수 조사와 분석을 바탕으로 수립한 초기 game-local presentation baseline**이다. 세부 작성 규칙과 필수 섹션은 `docs/game-platform-ui-rules.md`와 `games/UI_DESIGN_TEMPLATE.md`를 따른다.
```

<a id="legacy-dev-049-f0"></a>
#### LEGACY-DEV-049 / f0

- 원문: [docs/game-platform-development-rules.md L101–101](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L101-L101); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C017.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
최소한 디자인 조사 출처, 자산 사용 경계, 목표 판본, Visual Identity, page/lobby/gameplay/result/rematch 방향, 핵심 motion, responsive 전략, 최초 구현 Phase/순서와 validation 기준을 runtime 구현 전에 확정한다.
```

<a id="legacy-dev-050-f0"></a>
#### LEGACY-DEV-050 / f0

- 원문: [docs/game-platform-development-rules.md L103–103](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L103-L103); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C017.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
개발이 시작된 뒤 사용자 피드백, 실제 브라우저 QA, 구현 관찰로 디자인을 수정하는 경우 그 변경으로 `UI_DESIGN.md`의 과거 baseline을 덮어쓰지 않는다. 이후 변경은 `UI_DECISIONS.md`에 기록한다. `UI_DESIGN.md`는 최초 조사·설계 당시 무엇을 근거로 어떤 방향과 Phase를 세웠는지 복원할 수 있어야 한다.
```

<a id="legacy-dev-051-f0"></a>
#### LEGACY-DEV-051 / f0

- 원문: [docs/game-platform-development-rules.md L105–105](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L105-L105); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C017.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 후속 디자인 수정에 맞춰 `UI_DESIGN.md`를 계속 최신 화면으로 재작성해 최초 설계와 후속 변경의 경계를 없애지 않는다. 단, 출처 오기·명백한 사실 오류처럼 초기 조사 자체의 오류를 바로잡는 경우에는 수정 이유가 추적되도록 `UI_DECISIONS.md`에도 남긴다.
```

<a id="legacy-dev-052-f0"></a>
#### LEGACY-DEV-052 / f0

- 원문: [docs/game-platform-development-rules.md L107–107](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L107-L107); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:예외,할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C017.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 4문서 체계 도입 전에 이미 runtime/UI 개발이 시작되었거나 release된 platform-native 게임은 과거를 꾸며내어 "개발 전 baseline"으로 재작성하지 않는다. 그런 게임은 도입 시점에 확인 가능한 가장 이른 신뢰 가능한 UI 설계 또는 현재 production/작업 baseline을 **adoption baseline**으로 명시할 수 있다. 이 예외는 기존 게임의 전환을 위한 것이며 신규 게임에는 적용하지 않는다. adoption 이후의 새 디자인 수정은 동일하게 `UI_DECISIONS.md`에 기록한다.
```

<a id="legacy-dev-053-f0"></a>
#### LEGACY-DEV-053 / f0

- 원문: [docs/game-platform-development-rules.md L111–111](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L111-L111); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C018.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`UI_DECISIONS.md`는 **초기 `UI_DESIGN.md` baseline 이후 확정된 의미 있는 디자인 변경·결정·검증 이력을 보존하는 game-local 기록**이다. 특히 개발자의 실제 브라우저 수동 리뷰와 디테일 수정에서 확정된 결정을 핵심 대상으로 하며, `games/UI_DECISIONS_TEMPLATE.md`를 기준으로 관리한다.
```

<a id="legacy-dev-054-f0"></a>
#### LEGACY-DEV-054 / f0

- 원문: [docs/game-platform-development-rules.md L113–113](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L113-L113); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C018.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
다음 작업자가 현재 UI 코드나 최종 화면만 보고는 복원하기 어려운 변경을 기록한다.
```

<a id="legacy-dev-055-f0"></a>
#### LEGACY-DEV-055 / f0

- 원문: [docs/game-platform-development-rules.md L115–115](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L115-L115); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C018.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 사용자 피드백이나 실제 브라우저 관찰로 초기 `UI_DESIGN.md` 방향을 변경한 이유
```

<a id="legacy-dev-056-f0"></a>
#### LEGACY-DEV-056 / f0

- 원문: [docs/game-platform-development-rules.md L116–116](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L116-L116); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C018.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 검토한 대안과 폐기한 안, 다시 반복하면 안 되는 실패 원인
```

<a id="legacy-dev-057-f0"></a>
#### LEGACY-DEV-057 / f0

- 원문: [docs/game-platform-development-rules.md L117–117](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L117-L117); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C018.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- layout/component/interaction/motion/responsive의 의미 있는 변경
```

<a id="legacy-dev-058-f0"></a>
#### LEGACY-DEV-058 / f0

- 원문: [docs/game-platform-development-rules.md L118–118](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L118-L118); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C018.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 구현 상태와 실제 UI/브라우저 validation 결과
```

<a id="legacy-dev-059-f0"></a>
#### LEGACY-DEV-059 / f0

- 원문: [docs/game-platform-development-rules.md L119–119](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L119-L119); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C018.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 어떤 `UI_DESIGN.md` Phase/항목을 유지·수정·대체하는 결정인지
```

<a id="legacy-dev-060-f0"></a>
#### LEGACY-DEV-060 / f0

- 원문: [docs/game-platform-development-rules.md L121–121](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L121-L121); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C018.
- 승인된 적용/전환: 네문서 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 모든 spacing, CSS 숫자, 작은 commit을 changelog처럼 기록하지 않는다. 과거 결정을 뒤에서 바꾸더라도 기존 항목을 삭제하지 않고 새 항목을 추가해 `SUPERSEDED` 또는 `REVERTED` 관계를 남긴다.
```

<a id="legacy-dev-064-f0"></a>
#### LEGACY-DEV-064 / f0

- 원문: [docs/game-platform-development-rules.md L130–130](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L130-L130); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C019.
- 승인된 적용/전환: 수동gate / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 이 과정에서 개발자가 요청한 의미 있는 디자인 수정은 `UI_DECISIONS.md`에 확정 결정 단위로 남긴다.
```

<a id="legacy-dev-065-f0"></a>
#### LEGACY-DEV-065 / f0

- 원문: [docs/game-platform-development-rules.md L131–131](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L131-L131); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C019.
- 승인된 적용/전환: 수동gate / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 연속된 미세 조정은 요청별 changelog로 남기지 않고 해당 디자인 영역이 안정화된 시점에 하나의 decision으로 정리한다.
```

<a id="legacy-dev-066-f0"></a>
#### LEGACY-DEV-066 / f0

- 원문: [docs/game-platform-development-rules.md L132–132](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L132-L132); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C019.
- 승인된 적용/전환: 수동gate / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 디자인 작업을 merge/close하거나 release closeout으로 넘어가기 전에 기록 누락이 없는지 확인한다.
```

<a id="legacy-dev-068-f0"></a>
#### LEGACY-DEV-068 / f0

- 원문: [docs/game-platform-development-rules.md L135–135](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L135-L135); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C019.
- 승인된 적용/전환: 수동gate / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`디자인 체크포인트 기록하자`의 세부 의미와 기록 단위는 `docs/game-platform-ui-rules.md`가 소유한다. 이 명령의 존재 여부와 관계없이 UI Rules의 lifecycle 기반 기록 규칙은 적용한다.
```

<a id="legacy-dev-069-f0"></a>
#### LEGACY-DEV-069 / f0

- 원문: [docs/game-platform-development-rules.md L139–139](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L139-L139); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C020.
- 승인된 적용/전환: 네문서권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
네 문서는 서로 대체 관계가 아니라 책임이 다른 authoritative/record 문서다.
```

<a id="legacy-dev-070-f0"></a>
#### LEGACY-DEV-070 / f0

- 원문: [docs/game-platform-development-rules.md L141–141](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L141-L141); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C020.
- 승인된 적용/전환: 네문서권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `GAME_SPEC.md`: 현재 게임 규칙, 상태 머신, 기능 lifecycle, 도메인 모델, 서버 권위와 기능 범위의 기준
```

<a id="legacy-dev-071-f0"></a>
#### LEGACY-DEV-071 / f0

- 원문: [docs/game-platform-development-rules.md L142–142](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L142-L142); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C020.
- 승인된 적용/전환: 네문서권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `DEVELOPMENT.md`: 기능 구현·검증의 현재 Phase, 작업 브랜치, 다음 기능 작업을 전달하는 handoff 기준
```

<a id="legacy-dev-072-f0"></a>
#### LEGACY-DEV-072 / f0

- 원문: [docs/game-platform-development-rules.md L143–143](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L143-L143); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C020.
- 승인된 적용/전환: 네문서권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `UI_DESIGN.md`: runtime 구현 전 전수 조사·분석으로 수립한 최초 Visual Identity, page/layout, 구성물 표현, motion, responsive, Phase 계획의 baseline
```

<a id="legacy-dev-073-f0"></a>
#### LEGACY-DEV-073 / f0

- 원문: [docs/game-platform-development-rules.md L144–144](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L144-L144); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C020.
- 승인된 적용/전환: 네문서권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `UI_DECISIONS.md`: 개발 시작 후 디자인 개발 진행, 변경 배경, 대안, 사용자 피드백, 결정 이유, 구현/검증 이력을 보존하며 baseline을 보정하는 변경 기록
```

<a id="legacy-dev-074-f0"></a>
#### LEGACY-DEV-074 / f0

- 원문: [docs/game-platform-development-rules.md L146–146](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L146-L146); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C020.
- 승인된 적용/전환: 네문서권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
같은 주제가 여러 문서에 등장하면 **기능과 디자인의 시간축을 함께 적용**한다. 기능 규칙은 `GAME_SPEC.md`, 기능 진행은 `DEVELOPMENT.md`가 책임진다. 디자인은 `UI_DESIGN.md`를 최초 baseline으로 시작하되, 개발 시작 후 해당 항목을 변경한 유효한 `UI_DECISIONS.md` 결정이 있으면 **후속 결정이 우선한다**.
```

<a id="legacy-dev-075-f0"></a>
#### LEGACY-DEV-075 / f0

- 원문: [docs/game-platform-development-rules.md L148–148](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L148-L148); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C020.
- 승인된 적용/전환: 네문서권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
따라서 현재 유효 디자인은 단순히 `UI_DESIGN.md` 하나가 아니라 **`UI_DESIGN.md` baseline + `UI_DECISIONS.md`의 최신 non-superseded 변경 결정**으로 해석한다. `UI_DECISIONS.md`에서 `SUPERSEDED` 또는 `REVERTED` 처리된 결정은 현재 기준으로 사용하지 않는다.
```

<a id="legacy-dev-076-f0"></a>
#### LEGACY-DEV-076 / f0

- 원문: [docs/game-platform-development-rules.md L150–150](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L150-L150); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C020.
- 승인된 적용/전환: 네문서권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 과거 `UI_DESIGN.md`의 Phase를 이어간다는 이유로 그 이후 확정된 `UI_DECISIONS.md`를 무시하거나, 이미 수정된 UI를 초기 설계안으로 원복하거나, 폐기된 디자인 방향을 다시 구현하지 않는다.
```

<a id="legacy-dev-077-f0"></a>
#### LEGACY-DEV-077 / f0

- 원문: [docs/game-platform-development-rules.md L152–152](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L152-L152); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C020.
- 승인된 적용/전환: 네문서권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: `DEVELOPMENT.md`에서 새로운 게임 규칙이나 UI 설계를 독자적으로 확정하거나 상세 UI 변경 이력을 중복 관리하지 않는다. 기능 설계 변경은 `GAME_SPEC.md`, 후속 디자인 변경은 `UI_DECISIONS.md`에 둔다.
```

<a id="legacy-dev-078-f0"></a>
#### LEGACY-DEV-078 / f0

- 원문: [docs/game-platform-development-rules.md L154–154](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L154-L154); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C020.
- 승인된 적용/전환: 네문서권위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
문서끼리 모순이 발견되면 runtime 구현을 계속 진행하기 전에 실제 코드/테스트와 사용자 결정을 확인하고 책임 문서 기준으로 정합화한다.
```

<a id="legacy-dev-088-f0"></a>
#### LEGACY-DEV-088 / f0

- 원문: [docs/game-platform-development-rules.md L181–181](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L181-L181); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C022.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
모든 platform-native 게임은 최초 구현 PR부터 게임 디렉터리 안에 다음 문서를 둔다.
```

<a id="legacy-dev-089-f0"></a>
#### LEGACY-DEV-089 / f0

- 원문: [docs/game-platform-development-rules.md L183–185](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L183-L185); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C022.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>games/&lt;game-id&gt;/DEVELOPMENT.md<br>```
````

<a id="legacy-dev-090-f0"></a>
#### LEGACY-DEV-090 / f0

- 원문: [docs/game-platform-development-rules.md L187–187](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L187-L187); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C022.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`DEVELOPMENT.md`는 긴 작업 일지나 commit changelog가 아니라 **다음 작업자가 현재 기능 개발 상태를 즉시 복원하기 위한 인수인계 문서**다. 기능 구현 상태는 `GAME_SPEC.md`와 대조해 기록한다. 디자인 작업이 병행 중이면 상세 이력을 복제하지 않고 `UI_DECISIONS.md`의 현재 디자인 트랙을 참조하며, release 판단에 필요한 상위 UI 상태만 요약할 수 있다.
```

<a id="legacy-dev-091-f0"></a>
#### LEGACY-DEV-091 / f0

- 원문: [docs/game-platform-development-rules.md L189–189](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L189-L189); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C022.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
문서는 최소 다음 섹션을 유지한다.
```

<a id="legacy-dev-092-f0"></a>
#### LEGACY-DEV-092 / f0

- 원문: [docs/game-platform-development-rules.md L191–199](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L191-L199); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C022.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>## Current Status<br>## Completed<br>## Current Work<br>## Next Work<br>## Decisions<br>## Validation<br>## Known Issues / Deferred<br>```
````

<a id="legacy-dev-093-f0"></a>
#### LEGACY-DEV-093 / f0

- 원문: [docs/game-platform-development-rules.md L201–201](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L201-L201); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C022.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`Current Status`에는 최소한 현재 Phase, 상태(`IN_PROGRESS` / `BLOCKED` / `RELEASED`), 현재 작업 브랜치를 기록한다. 전체 게임이 production에 공개된 상태는 `COMPLETED` 대신 `RELEASED`를 사용하고, 개별 Phase 완료 사실은 `Completed`에 기록한다.
```

<a id="legacy-dev-094-f0"></a>
#### LEGACY-DEV-094 / f0

- 원문: [docs/game-platform-development-rules.md L205–205](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L205-L205); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C023.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 신규 게임의 첫 구현 단계에서 `DEVELOPMENT.md`를 함께 생성한다.
```

<a id="legacy-dev-095-f0"></a>
#### LEGACY-DEV-095 / f0

- 원문: [docs/game-platform-development-rules.md L206–206](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L206-L206); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C023.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기존 게임 개발을 이어갈 때는 소스 수정 전에 해당 게임의 `DEVELOPMENT.md`를 먼저 읽고 현재 기능 범위의 `GAME_SPEC.md`를 확인한다.
```

<a id="legacy-dev-096-f0"></a>
#### LEGACY-DEV-096 / f0

- 원문: [docs/game-platform-development-rules.md L207–207](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L207-L207); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:반드시; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C023.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- UI/presentation 작업이 포함되거나 기존 `UI_DESIGN.md`의 다음 Phase를 이어갈 때는 반드시 `UI_DESIGN.md` 전체 baseline과 `UI_DECISIONS.md`의 최신 non-superseded 결정을 함께 읽는다. 해당 Phase의 초기 계획과 후속 결정이 충돌하면 후속 결정을 우선하며, 이미 반영된 사용자 디자인 수정을 회귀시키지 않는다.
```

<a id="legacy-dev-097-f0"></a>
#### LEGACY-DEV-097 / f0

- 원문: [docs/game-platform-development-rules.md L208–208](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L208-L208); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C023.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `DEVELOPMENT.md`가 진행 중 Phase와 active branch를 가리키면 새 브랜치를 만들기 전에 해당 브랜치가 실제로 존재하고 계속해야 할 작업인지 확인한다.
```

<a id="legacy-dev-098-f0"></a>
#### LEGACY-DEV-098 / f0

- 원문: [docs/game-platform-development-rules.md L209–209](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L209-L209); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C023.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 진행 중 Phase를 다른 채팅에서 이어가는 것은 새로운 작업 시작이 아니므로, 정상적인 checkpoint branch가 확인되면 최신 `main`에서 별도 브랜치를 새로 만들지 않고 기존 작업 브랜치를 이어간다.
```

<a id="legacy-dev-099-f0"></a>
#### LEGACY-DEV-099 / f0

- 원문: [docs/game-platform-development-rules.md L210–210](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L210-L210); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C023.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임별 Phase 브랜치명은 가능하면 game id와 작업 범위를 포함해 `feature/game-platform-&lt;phase&gt;-&lt;game-id&gt;-&lt;scope&gt;`처럼 다른 채팅에서도 검색 가능한 형태로 유지한다.
```

<a id="legacy-dev-100-f0"></a>
#### LEGACY-DEV-100 / f0

- 원문: [docs/game-platform-development-rules.md L214–214](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L214-L214); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C024.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기능 Phase 완료 PR에는 `DEVELOPMENT.md`를 갱신해 실제 완료 기능, 검증, 다음 기능 작업을 남긴다.
```

<a id="legacy-dev-101-f0"></a>
#### LEGACY-DEV-101 / f0

- 원문: [docs/game-platform-development-rules.md L215–215](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L215-L215); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C024.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 디자인 Phase 완료 자체만으로 Decision Log를 만들지 않는다. 다만 해당 구간에서 baseline을 벗어난 의미 있는 변경이나 수동 디자인 리뷰의 확정 결정이 있었다면 `UI_DECISIONS.md`에 결정 근거, 어떤 초기 Phase/항목을 대체하는지, 구현/브라우저 검증을 남기고 Current Design Track을 현재 lifecycle 상태로 정리한다.
```

<a id="legacy-dev-102-f0"></a>
#### LEGACY-DEV-102 / f0

- 원문: [docs/game-platform-development-rules.md L216–216](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L216-L216); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C024.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기능 설계 자체가 변경됐다면 `GAME_SPEC.md`를 갱신한다. 개발 시작 후의 디자인 변경은 `UI_DESIGN.md`를 재작성하지 않고 `UI_DECISIONS.md`에 누적한다.
```

<a id="legacy-dev-103-f0"></a>
#### LEGACY-DEV-103 / f0

- 원문: [docs/game-platform-development-rules.md L217–217](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L217-L217); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C024.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `DEVELOPMENT.md`에는 UI 세부 변경사를 복제하지 않고 release 판단에 필요한 design track 참조만 남긴다.
```

<a id="legacy-dev-104-f0"></a>
#### LEGACY-DEV-104 / f0

- 원문: [docs/game-platform-development-rules.md L218–218](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L218-L218); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C024.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 다음 기능 작업은 `DEVELOPMENT.md / Next Work`, 다음 디자인 작업은 `UI_DECISIONS.md / Current Design Track` 또는 `Open Follow-up`에 구체적으로 남긴다.
```

<a id="legacy-dev-105-f0"></a>
#### LEGACY-DEV-105 / f0

- 원문: [docs/game-platform-development-rules.md L219–219](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L219-L219); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C024.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 완료되지 않은 항목을 완료한 것처럼 기록하지 않는다.
```

<a id="legacy-dev-106-f0"></a>
#### LEGACY-DEV-106 / f0

- 원문: [docs/game-platform-development-rules.md L223–223](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L223-L223); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
첫 production 공개는 구현 완료와 별개의 lifecycle 단계로 다룬다.
```

<a id="legacy-dev-107-f0"></a>
#### LEGACY-DEV-107 / f0

- 원문: [docs/game-platform-development-rules.md L225–225](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L225-L225); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. 게임 runtime과 필요한 DB migration이 main에 들어갈 수 있는 상태인지 확인한다.
```

<a id="legacy-dev-108-f0"></a>
#### LEGACY-DEV-108 / f0

- 원문: [docs/game-platform-development-rules.md L226–226](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L226-L226); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. production migration이 필요한 게임은 실제 적용 이력과 RLS/grant/RPC 권한 경계를 검증한다.
```

<a id="legacy-dev-109-f0"></a>
#### LEGACY-DEV-109 / f0

- 원문: [docs/game-platform-development-rules.md L227–227](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L227-L227); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. Registry capability는 **소스가 존재한다는 이유만으로** 활성화하지 않는다. 실제 제공 가능한 기능만 activation PR에서 켠다.
```

<a id="legacy-dev-110-f0"></a>
#### LEGACY-DEV-110 / f0

- 원문: [docs/game-platform-development-rules.md L228–228](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L228-L228); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. 관련 unit / Game Platform / DB integration / E2E / build 검증을 통과하고 알려진 기능 release blocker가 없어야 한다.
```

<a id="legacy-dev-111-f0"></a>
#### LEGACY-DEV-111 / f0

- 원문: [docs/game-platform-development-rules.md L229–229](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L229-L229); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
5. 기능 구현이 충분히 완료되면 `docs/game-platform-ui-rules.md`의 Developer Manual Design Review / Detail Polish를 거쳐 개발자의 실제 브라우저 수동 검토와 디자인 수정 단계를 수행한다. 이 단계에서 확정된 의미 있는 변경은 `UI_DECISIONS.md`에 기록한다.
```

<a id="legacy-dev-112-f0"></a>
#### LEGACY-DEV-112 / f0

- 원문: [docs/game-platform-development-rules.md L230–230](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L230-L230); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
6. 사람 중심 다중 브라우저 exploratory playtest가 자동 검증으로 대체되지 않는 위험을 발견하면 수행한다. `UI_DESIGN.md`의 초기 Validation Checklist와 `UI_DECISIONS.md`의 실제 디자인 validation/override 이력을 production 구현과 대조한다. 남은 UI 항목이 blocker가 아니라 후속 polish라면 `UI_DECISIONS.md / Open Follow-up`에 남긴다.
```

<a id="legacy-dev-113-f0"></a>
#### LEGACY-DEV-113 / f0

- 원문: [docs/game-platform-development-rules.md L231–231](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L231-L231); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
7. release 기준의 기능 설계는 `GAME_SPEC.md`, 기능 진행은 `DEVELOPMENT.md`, 디자인은 `UI_DESIGN.md` baseline + 최신 non-superseded `UI_DECISIONS.md` overrides와 production 상태가 일치하는지 확인한다.
```

<a id="legacy-dev-114-f0"></a>
#### LEGACY-DEV-114 / f0

- 원문: [docs/game-platform-development-rules.md L232–232](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L232-L232); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
8. 사용자에게 노출한 뒤 `DEVELOPMENT.md`를 `Status: RELEASED`, `Active branch: main`으로 갱신하고 날짜가 있는 `## Release — YYYY-MM-DD` 기록에 activation, production migration, 주요 기능/게임플레이 검증, 현재 capability와 디자인 release gate 참조를 남긴다. `UI_DECISIONS.md`의 design track도 release 또는 후속 polish 상태를 명확히 한다.
```

<a id="legacy-dev-115-f0"></a>
#### LEGACY-DEV-115 / f0

- 원문: [docs/game-platform-development-rules.md L233–233](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L233-L233); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
9. `Completed`의 과거 중간 상태가 현재 상태처럼 읽히지 않도록 "당시/초기 단계"임을 명시하거나 진행 로그로 이동한다.
```

<a id="legacy-dev-116-f0"></a>
#### LEGACY-DEV-116 / f0

- 원문: [docs/game-platform-development-rules.md L234–234](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L234-L234); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
10. 통합·대체된 stacked PR은 close하고 release에 흡수된 작업/임시 브랜치는 정리한다.
```

<a id="legacy-dev-117-f0"></a>
#### LEGACY-DEV-117 / f0

- 원문: [docs/game-platform-development-rules.md L235–235](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L235-L235); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
11. 이후 수정은 종료된 Phase 브랜치를 재사용하지 않고 최신 `main`에서 새 `fix/*` 또는 `feature/*` 브랜치로 시작한다.
```

<a id="legacy-dev-118-f0"></a>
#### LEGACY-DEV-118 / f0

- 원문: [docs/game-platform-development-rules.md L237–237](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L237-L237); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C025.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`RELEASED`는 "더 이상 개선하지 않는다"는 뜻이 아니라 **현재 production baseline이 main으로 확정됐다는 뜻**이다.
```

<a id="legacy-dev-119-f0"></a>
#### LEGACY-DEV-119 / f0

- 원문: [docs/game-platform-development-rules.md L241–241](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L241-L241); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C026.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`기능 체크포인트 기록하자`는 Game Platform의 명시적 기능 handoff checkpoint 명령이다.
```

<a id="legacy-dev-120-f0"></a>
#### LEGACY-DEV-120 / f0

- 원문: [docs/game-platform-development-rules.md L243–243](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L243-L243); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C026.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
사용자가 이 명령을 요청하면 현재 기능 개발 구간의 상태를 `DEVELOPMENT.md`에 갱신하고, 유효한 현재 작업 브랜치에 commit해 다음 채팅이나 다음 작업자가 GitHub에서 바로 이어갈 수 있게 한다.
```

<a id="legacy-dev-122-f0"></a>
#### LEGACY-DEV-122 / f0

- 원문: [docs/game-platform-development-rules.md L247–247](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L247-L247); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C026.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. 기능 Phase가 진행 중이면 상태를 `IN_PROGRESS`로 유지하고 실제 완료 기능, 미완료 기능, 다음 기능 작업, 기능 검증을 기록한다.
```

<a id="legacy-dev-123-f0"></a>
#### LEGACY-DEV-123 / f0

- 원문: [docs/game-platform-development-rules.md L248–248](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L248-L248); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C026.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. 기능 설계 자체가 바뀌었다면 책임 문서인 `GAME_SPEC.md`를 먼저 또는 함께 정합화한다.
```

<a id="legacy-dev-124-f0"></a>
#### LEGACY-DEV-124 / f0

- 원문: [docs/game-platform-development-rules.md L249–249](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L249-L249); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C026.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. 기능 blocker, 임시 결정, 확인이 필요한 사항을 책임 섹션에 남긴다.
```

<a id="legacy-dev-125-f0"></a>
#### LEGACY-DEV-125 / f0

- 원문: [docs/game-platform-development-rules.md L250–250](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L250-L250); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C026.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. 기능 checkpoint라는 이유로 `UI_DECISIONS.md`의 디자인 이력을 수정하지 않는다.
```

<a id="legacy-dev-126-f0"></a>
#### LEGACY-DEV-126 / f0

- 원문: [docs/game-platform-development-rules.md L251–251](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L251-L251); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C026.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
5. 이 명령 자체는 기능 Phase 완료를 의미하지 않는다.
```

<a id="legacy-dev-127-f0"></a>
#### LEGACY-DEV-127 / f0

- 원문: [docs/game-platform-development-rules.md L253–253](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L253-L253); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C026.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`디자인 체크포인트 기록하자`는 별도의 디자인 handoff 명령이며, 세부 규칙은 `docs/game-platform-ui-rules.md`가 소유한다. 사용자가 한 요청에서 두 명령을 모두 명시하면 `DEVELOPMENT.md`와 `UI_DECISIONS.md`를 각각의 책임에 따라 갱신할 수 있다.
```

<a id="legacy-dev-128-f0"></a>
#### LEGACY-DEV-128 / f0

- 원문: [docs/game-platform-development-rules.md L255–255](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L255-L255); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C026.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
접두어가 없는 일반적인 checkpoint 표현이나 `새 채팅에서 이어서 정리해줘`, `문서로 만들어줘`, `진행상황 요약해줘` 요청은 두 공식 repository checkpoint 명령 중 하나로 자동 확대 해석하지 않는다.
```

<a id="legacy-dev-129-f0"></a>
#### LEGACY-DEV-129 / f0

- 원문: [docs/game-platform-development-rules.md L257–257](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L257-L257); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C026.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
두 사용자 명령은 중간 handoff를 즉시 남기는 방법일 뿐이며, Phase 시작/작업 범위 확정, Phase 완료, 디자인 lifecycle 기록 트리거, release closeout, 중요한 설계 변경, blocker/known issue 발생 등 기존 lifecycle 기반 문서 갱신 시점을 대체하거나 제한하지 않는다.
```

<a id="legacy-dev-130-f0"></a>
#### LEGACY-DEV-130 / f0

- 원문: [docs/game-platform-development-rules.md L259–259](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L259-L259); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C026.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
중간 checkpoint를 남긴다는 이유만으로 Phase를 완료 처리하지 않는다. 진행 중 유효한 작업 브랜치가 있으면 그 브랜치를 계속 사용하며, 유효한 작업 브랜치가 없다면 저장소의 일반 브랜치 작업 규칙을 따른다.
```

<a id="legacy-dev-131-f0"></a>
#### LEGACY-DEV-131 / f0

- 원문: [docs/game-platform-development-rules.md L263–263](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L263-L263); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`DEVELOPMENT.md`와 `UI_DECISIONS.md`는 모든 작은 commit마다 갱신하지 않는다.
```

<a id="legacy-dev-132-f0"></a>
#### LEGACY-DEV-132 / f0

- 원문: [docs/game-platform-development-rules.md L265–265](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L265-L265); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`DEVELOPMENT.md`는 다음 시점을 기본으로 한다.
```

<a id="legacy-dev-133-f0"></a>
#### LEGACY-DEV-133 / f0

- 원문: [docs/game-platform-development-rules.md L267–267](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L267-L267); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기능 Phase 시작 또는 기능 작업 범위가 확정될 때
```

<a id="legacy-dev-134-f0"></a>
#### LEGACY-DEV-134 / f0

- 원문: [docs/game-platform-development-rules.md L268–268](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L268-L268); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기능 Phase 완료 시
```

<a id="legacy-dev-135-f0"></a>
#### LEGACY-DEV-135 / f0

- 원문: [docs/game-platform-development-rules.md L269–269](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L269-L269); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 사용자가 `기능 체크포인트 기록하자`라고 요청한 경우
```

<a id="legacy-dev-136-f0"></a>
#### LEGACY-DEV-136 / f0

- 원문: [docs/game-platform-development-rules.md L270–270](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L270-L270); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 중요한 아키텍처/게임 규칙 결정이 바뀔 때
```

<a id="legacy-dev-137-f0"></a>
#### LEGACY-DEV-137 / f0

- 원문: [docs/game-platform-development-rules.md L271–271](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L271-L271); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 표현:반드시; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 다음 작업자에게 반드시 전달해야 할 기능 blocker나 known issue가 생길 때
```

<a id="legacy-dev-138-f0"></a>
#### LEGACY-DEV-138 / f0

- 원문: [docs/game-platform-development-rules.md L273–273](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L273-L273); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`UI_DECISIONS.md`는 다음 시점을 기본으로 한다.
```

<a id="legacy-dev-139-f0"></a>
#### LEGACY-DEV-139 / f0

- 원문: [docs/game-platform-development-rules.md L275–275](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L275-L275); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 디자인 Phase/범위가 시작·완료·중단될 때
```

<a id="legacy-dev-140-f0"></a>
#### LEGACY-DEV-140 / f0

- 원문: [docs/game-platform-development-rules.md L276–276](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L276-L276); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 사용자 피드백이나 브라우저 QA로 layout/component/interaction/motion/responsive 방향이 의미 있게 변경될 때
```

<a id="legacy-dev-141-f0"></a>
#### LEGACY-DEV-141 / f0

- 원문: [docs/game-platform-development-rules.md L277–277](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L277-L277); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기존 디자인 안을 폐기·되돌림·대체할 때
```

<a id="legacy-dev-142-f0"></a>
#### LEGACY-DEV-142 / f0

- 원문: [docs/game-platform-development-rules.md L278–278](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L278-L278); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 실제 UI/browser validation 결과가 다음 디자인 작업에 영향을 줄 때
```

<a id="legacy-dev-143-f0"></a>
#### LEGACY-DEV-143 / f0

- 원문: [docs/game-platform-development-rules.md L279–279](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L279-L279); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C027.
- 승인된 적용/전환: 기능기록/명령/원SHOULD / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 사용자가 `디자인 체크포인트 기록하자`라고 요청한 경우
```

<a id="legacy-dev-386-f3"></a>
#### LEGACY-DEV-386 / f3

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 네문서bootstrap; 원문 범위: 코드블록순서3.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f14"></a>
#### LEGACY-DEV-386 / f14

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 초기UIbaseline구현; 원문 범위: 코드블록순서14.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f18"></a>
#### LEGACY-DEV-386 / f18

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 안정화디자인decision기록; 원문 범위: 코드블록순서18.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f21"></a>
#### LEGACY-DEV-386 / f21

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: baseline+유효override/브라우저이력; 원문 범위: 코드블록순서21.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-ui-046-f0"></a>
#### LEGACY-UI-046 / f0

- 원문: [docs/game-platform-ui-rules.md L89–89](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L89-L89); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
조사가 끝났다고 즉시 UI 코드를 작성하지 않는다. `UI_DESIGN.md`에 최소 다음을 먼저 정의한다.
```

<a id="legacy-ui-047-f0"></a>
#### LEGACY-UI-047 / f0

- 원문: [docs/game-platform-ui-rules.md L91–91](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L91-L91); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Primary / Secondary / Accent / Background color
```

<a id="legacy-ui-048-f0"></a>
#### LEGACY-UI-048 / f0

- 원문: [docs/game-platform-ui-rules.md L92–92](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L92-L92); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 전체 분위기와 시각적 키워드
```

<a id="legacy-ui-049-f0"></a>
#### LEGACY-UI-049 / f0

- 원문: [docs/game-platform-ui-rules.md L93–93](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L93-L93); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 심볼/패턴/재질감 방향
```

<a id="legacy-ui-050-f0"></a>
#### LEGACY-UI-050 / f0

- 원문: [docs/game-platform-ui-rules.md L94–94](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L94-L94); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 타이포그래피 방향
```

<a id="legacy-ui-051-f0"></a>
#### LEGACY-UI-051 / f0

- 원문: [docs/game-platform-ui-rules.md L95–95](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L95-L95); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- page identity와 일반 사이트에서 게임 공간으로 전환되는 방식
```

<a id="legacy-ui-052-f0"></a>
#### LEGACY-UI-052 / f0

- 원문: [docs/game-platform-ui-rules.md L96–96](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L96-L96); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- lobby/setup 구성
```

<a id="legacy-ui-053-f0"></a>
#### LEGACY-UI-053 / f0

- 원문: [docs/game-platform-ui-rules.md L97–97](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L97-L97); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- gameplay 핵심 레이아웃
```

<a id="legacy-ui-054-f0"></a>
#### LEGACY-UI-054 / f0

- 원문: [docs/game-platform-ui-rules.md L98–98](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L98-L98); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 주요 game component 표현
```

<a id="legacy-ui-055-f0"></a>
#### LEGACY-UI-055 / f0

- 원문: [docs/game-platform-ui-rules.md L99–99](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L99-L99); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 핵심 motion/interaction
```

<a id="legacy-ui-056-f0"></a>
#### LEGACY-UI-056 / f0

- 원문: [docs/game-platform-ui-rules.md L100–100](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L100-L100); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- result/rematch presentation
```

<a id="legacy-ui-057-f0"></a>
#### LEGACY-UI-057 / f0

- 원문: [docs/game-platform-ui-rules.md L101–101](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L101-L101); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- desktop/mobile responsive 전략
```

<a id="legacy-ui-058-f0"></a>
#### LEGACY-UI-058 / f0

- 원문: [docs/game-platform-ui-rules.md L102–102](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L102-L102); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 필요한 asset과 사용 권리 상태
```

<a id="legacy-ui-059-f0"></a>
#### LEGACY-UI-059 / f0

- 원문: [docs/game-platform-ui-rules.md L103–103](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L103-L103); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 구현 순서와 validation 기준
```

<a id="legacy-ui-060-f0"></a>
#### LEGACY-UI-060 / f0

- 원문: [docs/game-platform-ui-rules.md L105–105](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L105-L105); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C086.
- 승인된 적용/전환: 초기VIbaseline / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
초기 구현에서 모든 polish를 완성할 필요는 없지만, 방향이 정해지지 않은 상태에서 generic UI를 먼저 굳히지 않는다.
```

<a id="legacy-ui-076-f0"></a>
#### LEGACY-UI-076 / f0

- 원문: [docs/game-platform-ui-rules.md L137–137](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L137-L137); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C091.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 게임은 runtime 개발 전에 `UI_DESIGN.md`에서 최소 다음을 정한다.
```

<a id="legacy-ui-077-f0"></a>
#### LEGACY-UI-077 / f0

- 원문: [docs/game-platform-ui-rules.md L139–139](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L139-L139); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C091.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- rules entry 위치와 modal / dedicated page 선택
```

<a id="legacy-ui-078-f0"></a>
#### LEGACY-UI-078 / f0

- 원문: [docs/game-platform-ui-rules.md L140–140](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L140-L140); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C091.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- rules/help presentation이 Visual Identity를 유지하는 방식
```

<a id="legacy-ui-079-f0"></a>
#### LEGACY-UI-079 / f0

- 원문: [docs/game-platform-ui-rules.md L141–141](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L141-L141); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C091.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 핵심 메커니즘 중 시각화할 대상과 사용할 game component
```

<a id="legacy-ui-080-f0"></a>
#### LEGACY-UI-080 / f0

- 원문: [docs/game-platform-ui-rules.md L142–142](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L142-L142); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C091.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 긴 설명의 정보 계층, scroll, desktop/mobile adaptation
```

<a id="legacy-ui-081-f0"></a>
#### LEGACY-UI-081 / f0

- 원문: [docs/game-platform-ui-rules.md L143–143](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L143-L143); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C091.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 자산 사용 및 저작권 경계
```

<a id="legacy-ui-082-f0"></a>
#### LEGACY-UI-082 / f0

- 원문: [docs/game-platform-ui-rules.md L145–145](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L145-L145); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C091.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
개발 시작 후 실제 브라우저 리뷰에서 규칙 안내의 layout, visual example, 정보 계층 또는 responsive 방식이 의미 있게 바뀌면 `UI_DESIGN.md` baseline을 덮어쓰지 않고 `UI_DECISIONS.md`에 최신 non-superseded 결정으로 기록한다.
```

<a id="legacy-ui-083-f0"></a>
#### LEGACY-UI-083 / f0

- 원문: [docs/game-platform-ui-rules.md L149–149](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L149-L149); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C092.
- 승인된 적용/전환: baseline생성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
모든 platform-native 게임은 다음 문서를 가진다.
```

<a id="legacy-ui-084-f0"></a>
#### LEGACY-UI-084 / f0

- 원문: [docs/game-platform-ui-rules.md L151–153](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L151-L153); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C092.
- 승인된 적용/전환: baseline생성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>games/&lt;game-id&gt;/UI_DESIGN.md<br>```
````

<a id="legacy-ui-085-f0"></a>
#### LEGACY-UI-085 / f0

- 원문: [docs/game-platform-ui-rules.md L155–155](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L155-L155); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C092.
- 승인된 적용/전환: baseline생성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 문서는 **runtime/UI 소스 개발을 시작하기 전에 게임 디자인을 전수 조사·분석해 수립하는 game-local 초기 UI/presentation baseline**이다.
```

<a id="legacy-ui-086-f0"></a>
#### LEGACY-UI-086 / f0

- 원문: [docs/game-platform-ui-rules.md L157–157](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L157-L157); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C092.
- 승인된 적용/전환: baseline생성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`GAME_SPEC.md`가 게임 규칙과 기능 구조를 정의하고, `DEVELOPMENT.md`가 기능 개발 진행을 추적한다. 디자인은 `UI_DESIGN.md`가 최초 조사·설계와 Phase 계획의 출발점을 보존하고, `UI_DECISIONS.md`가 개발 시작 후 발생한 사용자 피드백·실제 화면 관찰·디자인 변경과 검증 이력을 누적한다.
```

<a id="legacy-ui-087-f0"></a>
#### LEGACY-UI-087 / f0

- 원문: [docs/game-platform-ui-rules.md L161–161](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L161-L161); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C093.
- 승인된 적용/전환: baseline생성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 게임 bootstrap에서 다음 네 문서를 runtime보다 먼저 생성한다.
```

<a id="legacy-ui-088-f0"></a>
#### LEGACY-UI-088 / f0

- 원문: [docs/game-platform-ui-rules.md L163–168](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L163-L168); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C093.
- 승인된 적용/전환: baseline생성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>GAME_SPEC.md<br>DEVELOPMENT.md<br>UI_DESIGN.md<br>UI_DECISIONS.md<br>```
````

<a id="legacy-ui-089-f0"></a>
#### LEGACY-UI-089 / f0

- 원문: [docs/game-platform-ui-rules.md L170–170](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L170-L170); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C093.
- 승인된 적용/전환: baseline생성 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`games/UI_DESIGN_TEMPLATE.md`와 `games/UI_DECISIONS_TEMPLATE.md`를 기준으로 작성한다.
```

<a id="legacy-ui-090-f0"></a>
#### LEGACY-UI-090 / f0

- 원문: [docs/game-platform-ui-rules.md L174–174](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L174-L174); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C094.
- 승인된 적용/전환: 기존adoption범위유지;기존재작성금지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 규칙이 도입되기 전에 이미 runtime/UI 개발이 시작됐거나 release된 platform-native 게임은 과거를 임의로 재구성하지 않는다.
```

<a id="legacy-ui-091-f0"></a>
#### LEGACY-UI-091 / f0

- 원문: [docs/game-platform-ui-rules.md L176–176](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L176-L176); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:반드시; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C094.
- 승인된 적용/전환: 기존adoption범위유지;기존재작성금지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 신규 게임은 반드시 runtime 개발 전 `UI_DESIGN.md` baseline을 만든다.
```

<a id="legacy-ui-092-f0"></a>
#### LEGACY-UI-092 / f0

- 원문: [docs/game-platform-ui-rules.md L177–177](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L177-L177); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C094.
- 승인된 적용/전환: 기존adoption범위유지;기존재작성금지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기존 게임은 확인 가능한 당시 설계 문서 또는 도입 시점의 production/작업 상태를 **adoption baseline**으로 명시할 수 있다.
```

<a id="legacy-ui-093-f0"></a>
#### LEGACY-UI-093 / f0

- 원문: [docs/game-platform-ui-rules.md L178–178](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L178-L178); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C094.
- 승인된 적용/전환: 기존adoption범위유지;기존재작성금지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- adoption baseline은 "원래 처음부터 이렇게 계획했다"는 의미가 아니다. 문서 체계 도입 시점에서 신뢰할 수 있게 고정한 출발점이다.
```

<a id="legacy-ui-094-f0"></a>
#### LEGACY-UI-094 / f0

- 원문: [docs/game-platform-ui-rules.md L179–179](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L179-L179); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C094.
- 승인된 적용/전환: 기존adoption범위유지;기존재작성금지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 이미 `UI_DESIGN.md` 안에 과거 구현 과정의 수정 결과가 섞여 있다면 증거 없이 억지로 분리하거나 삭제하지 않는다.
```

<a id="legacy-ui-095-f0"></a>
#### LEGACY-UI-095 / f0

- 원문: [docs/game-platform-ui-rules.md L180–180](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L180-L180); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C094.
- 승인된 적용/전환: 기존adoption범위유지;기존재작성금지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 과거 사용자 피드백/PR/commit을 복원할 때는 확인 가능한 결정만 `UI_DECISIONS.md`에 추가한다.
```

<a id="legacy-ui-096-f0"></a>
#### LEGACY-UI-096 / f0

- 원문: [docs/game-platform-ui-rules.md L181–181](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L181-L181); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C094.
- 승인된 적용/전환: 기존adoption범위유지;기존재작성금지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- adoption 이후 새 디자인 수정은 모두 일반 규칙대로 `UI_DECISIONS.md`에 기록한다.
```

<a id="legacy-ui-097-f0"></a>
#### LEGACY-UI-097 / f0

- 원문: [docs/game-platform-ui-rules.md L183–183](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L183-L183); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C094.
- 승인된 적용/전환: 기존adoption범위유지;기존재작성금지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 전환 예외는 기존 게임을 새 규칙에 맞추기 위해 과거 기록을 왜곡하지 않기 위한 것이며, 이후 신규 게임의 pre-development baseline 의무를 약화하지 않는다.
```

<a id="legacy-ui-098-f0"></a>
#### LEGACY-UI-098 / f0

- 원문: [docs/game-platform-ui-rules.md L187–187](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L187-L187); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C095.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`UI_DESIGN.md`는 신규 게임 소스 개발 전에 확정한 조사·분석·설계 baseline을 보존한다. 개발 시작 후 발생하는 디자인 수정 때문에 이 문서를 현재 화면에 맞춰 계속 덮어쓰지 않는다.
```

<a id="legacy-ui-099-f0"></a>
#### LEGACY-UI-099 / f0

- 원문: [docs/game-platform-ui-rules.md L189–189](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L189-L189); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C095.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
다음과 같은 후속 변경은 `UI_DECISIONS.md`에 기록한다.
```

<a id="legacy-ui-100-f0"></a>
#### LEGACY-UI-100 / f0

- 원문: [docs/game-platform-ui-rules.md L191–191](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L191-L191); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C095.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 사용자 피드백으로 대표 색상/배경/심볼/타이포그래피 방향을 수정한 경우
```

<a id="legacy-ui-101-f0"></a>
#### LEGACY-UI-101 / f0

- 원문: [docs/game-platform-ui-rules.md L192–192](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L192-L192); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C095.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 실제 브라우저 QA로 page identity 또는 핵심 레이아웃을 바꾼 경우
```

<a id="legacy-ui-102-f0"></a>
#### LEGACY-UI-102 / f0

- 원문: [docs/game-platform-ui-rules.md L193–193](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L193-L193); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C095.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 카드/보드/칩/토큰 등 핵심 구성물 표현을 조정한 경우
```

<a id="legacy-ui-103-f0"></a>
#### LEGACY-UI-103 / f0

- 원문: [docs/game-platform-ui-rules.md L194–194](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L194-L194); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 표현:원칙; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C095.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 주요 motion/interaction 원칙이나 responsive 전략을 수정한 경우
```

<a id="legacy-ui-104-f0"></a>
#### LEGACY-UI-104 / f0

- 원문: [docs/game-platform-ui-rules.md L195–195](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L195-L195); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C095.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 구현하면서 기존 Phase 계획의 일부를 폐기하거나 다른 방식으로 대체한 경우
```

<a id="legacy-ui-105-f0"></a>
#### LEGACY-UI-105 / f0

- 원문: [docs/game-platform-ui-rules.md L197–197](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L197-L197); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 표현:원칙; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C095.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
작은 spacing 값이나 commit 단위 변경을 쌓는 changelog로 사용하지 않는 원칙은 `UI_DECISIONS.md`에도 동일하다.
```

<a id="legacy-ui-106-f0"></a>
#### LEGACY-UI-106 / f0

- 원문: [docs/game-platform-ui-rules.md L199–199](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L199-L199); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C095.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
예외적으로 초기 조사 문서 자체의 출처 오기나 명백한 사실 오류를 고칠 수는 있지만, 왜 고쳤는지는 `UI_DECISIONS.md`에서 추적 가능해야 한다.
```

<a id="legacy-ui-107-f0"></a>
#### LEGACY-UI-107 / f0

- 원문: [docs/game-platform-ui-rules.md L203–203](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L203-L203); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
모든 platform-native 게임은 다음 디자인 개발 이력 문서를 가진다.
```

<a id="legacy-ui-108-f0"></a>
#### LEGACY-UI-108 / f0

- 원문: [docs/game-platform-ui-rules.md L205–207](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L205-L207); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>games/&lt;game-id&gt;/UI_DECISIONS.md<br>```
````

<a id="legacy-ui-109-f0"></a>
#### LEGACY-UI-109 / f0

- 원문: [docs/game-platform-ui-rules.md L209–209](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L209-L209); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`UI_DECISIONS.md`는 다음을 기록한다.
```

<a id="legacy-ui-110-f0"></a>
#### LEGACY-UI-110 / f0

- 원문: [docs/game-platform-ui-rules.md L211–211](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L211-L211); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 실제 브라우저 QA나 사용자 피드백으로 디자인이 바뀐 배경
```

<a id="legacy-ui-111-f0"></a>
#### LEGACY-UI-111 / f0

- 원문: [docs/game-platform-ui-rules.md L212–212](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L212-L212); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 이전안과 검토한 대안, 최종 결정과 이유
```

<a id="legacy-ui-112-f0"></a>
#### LEGACY-UI-112 / f0

- 원문: [docs/game-platform-ui-rules.md L213–213](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L213-L213); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 의미 있는 layout/component/interaction/motion/responsive 변경
```

<a id="legacy-ui-113-f0"></a>
#### LEGACY-UI-113 / f0

- 원문: [docs/game-platform-ui-rules.md L214–214](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L214-L214); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 구현 상태와 UI/browser validation
```

<a id="legacy-ui-114-f0"></a>
#### LEGACY-UI-114 / f0

- 원문: [docs/game-platform-ui-rules.md L215–215](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L215-L215); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 다음 디자인 작업 또는 미확정 polish
```

<a id="legacy-ui-115-f0"></a>
#### LEGACY-UI-115 / f0

- 원문: [docs/game-platform-ui-rules.md L216–216](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L216-L216); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 어떤 초기 `UI_DESIGN.md` Phase/항목을 유지·보정·대체하는지
```

<a id="legacy-ui-116-f0"></a>
#### LEGACY-UI-116 / f0

- 원문: [docs/game-platform-ui-rules.md L218–218](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L218-L218); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
모든 CSS 수치나 commit을 기록하지 않는다. 현재 화면만 보고도 자명한 미세 조정은 생략하고, 다음 작업자가 동일한 시행착오를 반복하거나 사용자 의도를 잃을 수 있는 결정만 남긴다.
```

<a id="legacy-ui-117-f0"></a>
#### LEGACY-UI-117 / f0

- 원문: [docs/game-platform-ui-rules.md L220–220](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L220-L220); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
과거 결정이 뒤에서 바뀌어도 기존 기록을 삭제하지 않고 새 결정으로 대체하며 이전 항목을 `SUPERSEDED` 또는 `REVERTED`로 표시한다.
```

<a id="legacy-ui-118-f0"></a>
#### LEGACY-UI-118 / f0

- 원문: [docs/game-platform-ui-rules.md L222–222](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L222-L222); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`UI_DESIGN.md`와 `UI_DECISIONS.md`가 같은 UI 항목에서 충돌하면 **baseline 이후 확정된 최신 non-superseded `UI_DECISIONS.md` 결정이 우선한다.** 신규 게임의 pre-development baseline이든 기존 게임의 adoption baseline이든 `UI_DESIGN.md`는 후속 변경을 되돌리는 근거로 사용할 수 없다.
```

<a id="legacy-ui-119-f0"></a>
#### LEGACY-UI-119 / f0

- 원문: [docs/game-platform-ui-rules.md L224–224](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L224-L224); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
현재 유효 디자인은 다음처럼 해석한다.
```

<a id="legacy-ui-120-f0"></a>
#### LEGACY-UI-120 / f0

- 원문: [docs/game-platform-ui-rules.md L226–230](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L226-L230); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>effective design<br>= UI_DESIGN baseline (pre-development or explicit adoption baseline)<br>+ latest applicable UI_DECISIONS overrides<br>```
````

<a id="legacy-ui-121-f0"></a>
#### LEGACY-UI-121 / f0

- 원문: [docs/game-platform-ui-rules.md L232–232](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L232-L232); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C096.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`SUPERSEDED` 또는 `REVERTED` 처리된 과거 결정은 현재 override로 사용하지 않는다.
```

<a id="legacy-ui-122-f0"></a>
#### LEGACY-UI-122 / f0

- 원문: [docs/game-platform-ui-rules.md L236–236](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L236-L236); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
platform-native 게임의 디자인 개발은 기본적으로 다음 네 단계로 본다.
```

<a id="legacy-ui-123-f0"></a>
#### LEGACY-UI-123 / f0

- 원문: [docs/game-platform-ui-rules.md L238–238](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L238-L238); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. **Design Research / Baseline**
```

<a id="legacy-ui-124-f0"></a>
#### LEGACY-UI-124 / f0

- 원문: [docs/game-platform-ui-rules.md L239–239](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L239-L239); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: LEGACY-UI-123.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 신규 게임 runtime 개발 전에 원본 디자인을 전수 조사·분석한다.
```

<a id="legacy-ui-125-f0"></a>
#### LEGACY-UI-125 / f0

- 원문: [docs/game-platform-ui-rules.md L240–240](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L240-L240); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: LEGACY-UI-123.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- Visual Identity, layout, component, motion, responsive, 최초 UI Phase를 `UI_DESIGN.md`에 기록한다.
```

<a id="legacy-ui-126-f0"></a>
#### LEGACY-UI-126 / f0

- 원문: [docs/game-platform-ui-rules.md L241–241](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L241-L241); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 표현:할 수 있다; 명시부모: LEGACY-UI-123.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 이 단계는 아직 후속 수정이 없으므로 `UI_DECISIONS.md / Decision Log`를 억지로 채우지 않는다. 문서 구조와 빈 current track만 준비할 수 있다.
```

<a id="legacy-ui-127-f0"></a>
#### LEGACY-UI-127 / f0

- 원문: [docs/game-platform-ui-rules.md L242–242](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L242-L242); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. **Baseline Implementation**
```

<a id="legacy-ui-128-f0"></a>
#### LEGACY-UI-128 / f0

- 원문: [docs/game-platform-ui-rules.md L243–243](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L243-L243); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: LEGACY-UI-127.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `UI_DESIGN.md`에 수립한 Phase와 규칙대로 최초 UI를 구현한다.
```

<a id="legacy-ui-129-f0"></a>
#### LEGACY-UI-129 / f0

- 원문: [docs/game-platform-ui-rules.md L244–244](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L244-L244); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: LEGACY-UI-127.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- baseline을 그대로 구현한 사실 자체는 `UI_DECISIONS.md`의 decision으로 기록하지 않는다.
```

<a id="legacy-ui-130-f0"></a>
#### LEGACY-UI-130 / f0

- 원문: [docs/game-platform-ui-rules.md L245–245](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L245-L245); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 표현:검증; 명시부모: LEGACY-UI-127.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 다만 실제 구현 제약이나 검증 때문에 baseline에서 의미 있게 벗어나기로 확정했다면 그 시점부터 `UI_DECISIONS.md`에 기록한다.
```

<a id="legacy-ui-131-f0"></a>
#### LEGACY-UI-131 / f0

- 원문: [docs/game-platform-ui-rules.md L246–246](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L246-L246); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. **Developer Manual Design Review / Detail Polish**
```

<a id="legacy-ui-132-f0"></a>
#### LEGACY-UI-132 / f0

- 원문: [docs/game-platform-ui-rules.md L247–247](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L247-L247); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 표현:검증; 명시부모: LEGACY-UI-131.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기능 구현이 충분히 완료되고 release 전 검증·마무리 단계에 들어가면 개발자가 실제 브라우저에서 직접 플레이하며 디자인을 수동 검토한다.
```

<a id="legacy-ui-133-f0"></a>
#### LEGACY-UI-133 / f0

- 원문: [docs/game-platform-ui-rules.md L248–248](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L248-L248); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: LEGACY-UI-131.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 이 단계에서 발생하는 개발자의 구체적인 layout, component, spacing 관계, interaction, motion, responsive, 시각적 우선순위 수정 요청은 `UI_DECISIONS.md`의 핵심 기록 대상이다.
```

<a id="legacy-ui-134-f0"></a>
#### LEGACY-UI-134 / f0

- 원문: [docs/game-platform-ui-rules.md L249–249](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L249-L249); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: LEGACY-UI-131.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 여러 번의 미세 조정 요청을 요청 횟수대로 기록하지 않고, 하나의 디자인 영역이 안정화되어 최종 방향이 정해졌을 때 하나의 의미 있는 decision으로 정리한다.
```

<a id="legacy-ui-135-f0"></a>
#### LEGACY-UI-135 / f0

- 원문: [docs/game-platform-ui-rules.md L250–250](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L250-L250); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. **Design Closeout**
```

<a id="legacy-ui-136-f0"></a>
#### LEGACY-UI-136 / f0

- 원문: [docs/game-platform-ui-rules.md L251–251](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L251-L251); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: LEGACY-UI-135.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 주요 디자인 영역의 수동 검토와 수정이 끝나면 `UI_DECISIONS.md / Current Design Track`에서 현재 상태, active overrides, superseded/reverted decisions, 남은 follow-up을 정리한다.
```

<a id="legacy-ui-137-f0"></a>
#### LEGACY-UI-137 / f0

- 원문: [docs/game-platform-ui-rules.md L252–252](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L252-L252); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: LEGACY-UI-135.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 최종 결과를 만들기 위해 `UI_DESIGN.md` baseline을 현재 화면으로 덮어쓰지 않는다. 최종 유효 디자인은 baseline + 최신 decision overrides로 복원 가능해야 한다.
```

<a id="legacy-ui-138-f0"></a>
#### LEGACY-UI-138 / f0

- 원문: [docs/game-platform-ui-rules.md L254–254](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L254-L254); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`UI_DECISIONS.md`의 기록 단위는 **수정 요청 하나**가 아니라 **확정된 디자인 결정 하나**다.
```

<a id="legacy-ui-139-f0"></a>
#### LEGACY-UI-139 / f0

- 원문: [docs/game-platform-ui-rules.md L256–256](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L256-L256); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C097.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
예를 들어 개발자가 한 영역에 대해 위치를 올렸다가 내리고, 크기를 키웠다가 줄이는 여러 요청을 연속으로 했더라도 그 영역이 안정화되기 전까지 각각을 별도 decision으로 만들지 않는다. 최종적으로 채택된 상태, 변경 이유, 버린 대안과 영향 범위를 하나의 decision으로 기록한다.
```

<a id="legacy-ui-140-f0"></a>
#### LEGACY-UI-140 / f0

- 원문: [docs/game-platform-ui-rules.md L260–260](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L260-L260); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C098.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
다음 시점에는 아직 문서화되지 않은 의미 있는 디자인 결정이 있는지 확인하고, 있다면 `UI_DECISIONS.md`를 갱신한다.
```

<a id="legacy-ui-141-f0"></a>
#### LEGACY-UI-141 / f0

- 원문: [docs/game-platform-ui-rules.md L262–262](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L262-L262); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C098.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `UI_DESIGN.md` baseline에서 벗어나는 의미 있는 구현 방향이 확정됐을 때
```

<a id="legacy-ui-142-f0"></a>
#### LEGACY-UI-142 / f0

- 원문: [docs/game-platform-ui-rules.md L263–263](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L263-L263); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C098.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 개발자의 수동 브라우저 디자인 리뷰에서 하나의 component/layout/interaction/motion 영역이 안정화되고 다른 영역으로 넘어갈 때
```

<a id="legacy-ui-143-f0"></a>
#### LEGACY-UI-143 / f0

- 원문: [docs/game-platform-ui-rules.md L264–264](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L264-L264); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C098.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 디자인 Phase 또는 detail-polish 작업 범위를 완료할 때
```

<a id="legacy-ui-144-f0"></a>
#### LEGACY-UI-144 / f0

- 원문: [docs/game-platform-ui-rules.md L265–265](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L265-L265); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C098.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 해당 디자인 작업 PR을 merge/close하거나 작업 브랜치를 종료하기 전
```

<a id="legacy-ui-145-f0"></a>
#### LEGACY-UI-145 / f0

- 원문: [docs/game-platform-ui-rules.md L266–266](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L266-L266); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C098.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 다른 큰 기능 작업이나 release closeout으로 전환하기 전
```

<a id="legacy-ui-146-f0"></a>
#### LEGACY-UI-146 / f0

- 원문: [docs/game-platform-ui-rules.md L268–268](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L268-L268); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 본문:SHOULD; 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C098.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
SHOULD: 같은 디자인 영역이 아직 빠르게 반복 수정 중이면 매 수정마다 문서를 갱신하지 않고 안정화 시점에 묶어서 기록한다.
```

<a id="legacy-ui-147-f0"></a>
#### LEGACY-UI-147 / f0

- 원문: [docs/game-platform-ui-rules.md L270–270](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L270-L270); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 본문:MUST NOT; 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C098.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 디자인 작업 PR이나 브랜치를 종료하면서 아직 복원 가치가 있는 개발자 피드백과 확정 디자인 결정을 코드에만 남기고 `UI_DECISIONS.md` 기록 없이 버리지 않는다.
```

<a id="legacy-ui-148-f0"></a>
#### LEGACY-UI-148 / f0

- 원문: [docs/game-platform-ui-rules.md L274–274](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L274-L274); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C099.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`디자인 체크포인트 기록하자`는 Game Platform의 명시적 디자인 handoff checkpoint 명령이다.
```

<a id="legacy-ui-149-f0"></a>
#### LEGACY-UI-149 / f0

- 원문: [docs/game-platform-ui-rules.md L276–276](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L276-L276); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C099.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
사용자가 이 명령을 요청하면 현재 작업 구간에서 **이미 확정되어 복원 가치가 있는 디자인 결정만** `UI_DECISIONS.md`에 정리하고, 유효한 현재 작업 브랜치에 commit해 다음 채팅이나 다음 작업자가 그대로 이어갈 수 있게 한다.
```

<a id="legacy-ui-151-f0"></a>
#### LEGACY-UI-151 / f0

- 원문: [docs/game-platform-ui-rules.md L280–280](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L280-L280); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C099.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. 같은 디자인 영역에서 아직 빠르게 반복 수정 중인 요청은 각각 별도 decision으로 만들지 않는다.
```

<a id="legacy-ui-152-f0"></a>
#### LEGACY-UI-152 / f0

- 원문: [docs/game-platform-ui-rules.md L281–281](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L281-L281); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C099.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. 현재까지 안정화된 component/layout/interaction/motion 단위를 기준으로 최종 채택안, 변경 이유, 이전 대안, 적용 범위, 구현/검증 상태를 기록한다.
```

<a id="legacy-ui-153-f0"></a>
#### LEGACY-UI-153 / f0

- 원문: [docs/game-platform-ui-rules.md L282–282](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L282-L282); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C099.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. 기존 decision을 대체하거나 되돌린 경우 `Supersedes`와 `SUPERSEDED` / `REVERTED` 관계를 명시한다.
```

<a id="legacy-ui-154-f0"></a>
#### LEGACY-UI-154 / f0

- 원문: [docs/game-platform-ui-rules.md L283–283](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L283-L283); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C099.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. 아직 확정되지 않은 디자인은 `Open Follow-up`에 남기고 확정 decision처럼 기록하지 않는다.
```

<a id="legacy-ui-155-f0"></a>
#### LEGACY-UI-155 / f0

- 원문: [docs/game-platform-ui-rules.md L284–284](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L284-L284); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C099.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
5. 초기 `UI_DESIGN.md` baseline을 현재 화면에 맞춰 재작성하지 않는다.
```

<a id="legacy-ui-156-f0"></a>
#### LEGACY-UI-156 / f0

- 원문: [docs/game-platform-ui-rules.md L285–285](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L285-L285); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 표현:할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C099.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
6. 이 명령 자체는 디자인 Phase 완료나 `FINAL` 상태를 의미하지 않는다. 수동 디자인 리뷰 중간에도 사용할 수 있다.
```

<a id="legacy-ui-157-f0"></a>
#### LEGACY-UI-157 / f0

- 원문: [docs/game-platform-ui-rules.md L286–286](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L286-L286); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C099.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
7. 기능 진행상태를 기록하기 위한 `DEVELOPMENT.md`는 디자인 checkpoint라는 이유만으로 수정하지 않는다.
```

<a id="legacy-ui-158-f0"></a>
#### LEGACY-UI-158 / f0

- 원문: [docs/game-platform-ui-rules.md L288–288](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L288-L288); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 표현:할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C099.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
사용자가 기능과 디자인 checkpoint를 한 요청에서 모두 명시하면 두 책임 문서를 각각 갱신할 수 있다.
```

<a id="legacy-ui-159-f0"></a>
#### LEGACY-UI-159 / f0

- 원문: [docs/game-platform-ui-rules.md L290–290](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L290-L290); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C099.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 명령과 별개로 위 lifecycle 기반 기록 트리거는 계속 적용한다.
```

<a id="legacy-ui-160-f0"></a>
#### LEGACY-UI-160 / f0

- 원문: [docs/game-platform-ui-rules.md L294–294](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L294-L294); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 표현:반드시; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C100.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`UI_DESIGN.md / Implementation Plan`에 정의된 다음 Phase를 구현하거나 과거에 미완료였던 UI 작업을 재개할 때는 소스 수정 전에 반드시 다음을 수행한다.
```

<a id="legacy-ui-161-f0"></a>
#### LEGACY-UI-161 / f0

- 원문: [docs/game-platform-ui-rules.md L296–296](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L296-L296); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C100.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. 해당 Phase의 초기 `UI_DESIGN.md` 요구사항을 확인한다.
```

<a id="legacy-ui-162-f0"></a>
#### LEGACY-UI-162 / f0

- 원문: [docs/game-platform-ui-rules.md L297–297](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L297-L297); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C100.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. `UI_DECISIONS.md`에서 그 Phase, component, layout, interaction, motion과 관련된 후속 결정을 확인한다.
```

<a id="legacy-ui-163-f0"></a>
#### LEGACY-UI-163 / f0

- 원문: [docs/game-platform-ui-rules.md L298–298](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L298-L298); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C100.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. 이미 runtime에 반영된 디자인과 후속 결정이 초기 계획보다 발전한 상태라면 그 상태를 보존한다.
```

<a id="legacy-ui-164-f0"></a>
#### LEGACY-UI-164 / f0

- 원문: [docs/game-platform-ui-rules.md L299–299](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L299-L299); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C100.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. 초기 Phase 문구와 최신 유효 결정이 충돌하면 최신 `UI_DECISIONS.md`를 적용한다.
```

<a id="legacy-ui-165-f0"></a>
#### LEGACY-UI-165 / f0

- 원문: [docs/game-platform-ui-rules.md L300–300](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L300-L300); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C100.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
5. 폐기되거나 supersede된 안을 "원래 계획"이라는 이유로 다시 구현하지 않는다.
```

<a id="legacy-ui-166-f0"></a>
#### LEGACY-UI-166 / f0

- 원문: [docs/game-platform-ui-rules.md L301–301](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L301-L301); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C100.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
6. 작업 완료 전 변경 범위가 기존 유효 decision을 회귀시키지 않았는지 확인한다.
```

<a id="legacy-ui-167-f0"></a>
#### LEGACY-UI-167 / f0

- 원문: [docs/game-platform-ui-rules.md L303–303](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L303-L303); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 본문:MUST NOT; 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C100.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: Phase 체크리스트를 순서대로 완료하는 과정에서 후속 사용자 수정, 실제 브라우저 QA 결과, 이미 채택된 interaction을 과거 설계안으로 원복한다.
```

<a id="legacy-ui-168-f0"></a>
#### LEGACY-UI-168 / f0

- 원문: [docs/game-platform-ui-rules.md L307–307](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L307-L307); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C101.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`DEVELOPMENT.md`는 기능 개발 handoff를 책임진다. 디자인 작업이 release 판단에 영향을 주는 경우 현재 design track을 짧게 참조할 수 있지만, baseline 이후의 의미 있는 UI 변경·결정·디자인 검증 이력은 `UI_DECISIONS.md`에 둔다.
```

<a id="legacy-ui-169-f0"></a>
#### LEGACY-UI-169 / f0

- 원문: [docs/game-platform-ui-rules.md L309–309](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L309-L309); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C101.
- 승인된 적용/전환: baseline/override/lifecycle/checkpoint / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
완료되지 않은 UI 항목을 `UI_DESIGN.md`에서 삭제해 현재 구현처럼 보이게 하지 않고, 초기 baseline의 단순 미구현인지 후속 decision으로 변경·대체된 것인지 `UI_DECISIONS.md`에서 구분한다.
```

<a id="legacy-ui-177-f2"></a>
#### LEGACY-UI-177 / f2

- 원문: [docs/game-platform-ui-rules.md L323–323](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L323-L323); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C102.
- 승인된 적용/전환: 실물경험/예시비승격 / 참조계승.
- 책임 의미: baseline/후속기록시간축; 원문 범위: 최초계획UI_DESIGN·개발후수정최신유효결정/이유UI_DECISIONS.
- 검증 대응: V-D.

```text
원본 배치를 그대로 복제하는 것이 가독성을 해치면 웹 환경에 맞게 재구성할 수 있다. 최초 adaptation 계획은 `UI_DESIGN.md`에 두고, 개발 시작 후 실제 브라우저 검토로 그 배치를 수정했다면 최신 유효 결정과 이유를 `UI_DECISIONS.md`에 남긴다.
```

<a id="legacy-ui-205-f1"></a>
#### LEGACY-UI-205 / f1

- 원문: [docs/game-platform-ui-rules.md L371–371](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L371-L371); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C106.
- 승인된 적용/전환: responsive/계획책임 / 참조계승.
- 책임 의미: 디자인baseline시간축; 원문 범위: 제1문장:UI_DESIGN초기적용순서·liveprogress아님.
- 검증 대응: V-D.

```text
`UI_DESIGN.md / Implementation Plan`은 runtime 개발 전에 수립한 **초기 presentation 적용 순서와 가이드**를 보존하며 live progress/changelog로 사용하지 않는다. 기능 상태 머신, DB/RPC, 서버 권위 구현 순서는 `GAME_SPEC.md`, 실제 기능 다음 작업은 `DEVELOPMENT.md / Next Work`에서 관리한다. 개발 시작 후 baseline에서 벗어나 확정된 디자인 변경, 수동 브라우저 리뷰 결과와 그에 따른 후속 UI 작업만 `UI_DECISIONS.md`에서 추적한다.
```

<a id="legacy-ui-205-f2"></a>
#### LEGACY-UI-205 / f2

- 원문: [docs/game-platform-ui-rules.md L371–371](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L371-L371); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C106.
- 승인된 적용/전환: responsive/계획책임 / 참조계승.
- 책임 의미: 기능문서역할분리; 원문 범위: 제2문장:GAME_SPEC기능순서·DEVELOPMENT실제다음작업.
- 검증 대응: V-D.

```text
`UI_DESIGN.md / Implementation Plan`은 runtime 개발 전에 수립한 **초기 presentation 적용 순서와 가이드**를 보존하며 live progress/changelog로 사용하지 않는다. 기능 상태 머신, DB/RPC, 서버 권위 구현 순서는 `GAME_SPEC.md`, 실제 기능 다음 작업은 `DEVELOPMENT.md / Next Work`에서 관리한다. 개발 시작 후 baseline에서 벗어나 확정된 디자인 변경, 수동 브라우저 리뷰 결과와 그에 따른 후속 UI 작업만 `UI_DECISIONS.md`에서 추적한다.
```

<a id="legacy-ui-205-f3"></a>
#### LEGACY-UI-205 / f3

- 원문: [docs/game-platform-ui-rules.md L371–371](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L371-L371); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C106.
- 승인된 적용/전환: responsive/계획책임 / 참조계승.
- 책임 의미: 후속디자인결정/진행; 원문 범위: 제3문장:baseline이후확정변경/수동리뷰/후속UI작업은UI_DECISIONS.
- 검증 대응: V-D.

```text
`UI_DESIGN.md / Implementation Plan`은 runtime 개발 전에 수립한 **초기 presentation 적용 순서와 가이드**를 보존하며 live progress/changelog로 사용하지 않는다. 기능 상태 머신, DB/RPC, 서버 권위 구현 순서는 `GAME_SPEC.md`, 실제 기능 다음 작업은 `DEVELOPMENT.md / Next Work`에서 관리한다. 개발 시작 후 baseline에서 벗어나 확정된 디자인 변경, 수동 브라우저 리뷰 결과와 그에 따른 후속 UI 작업만 `UI_DECISIONS.md`에서 추적한다.
```

<a id="legacy-ui-206-f0"></a>
#### LEGACY-UI-206 / f0

- 원문: [docs/game-platform-ui-rules.md L373–373](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L373-L373); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C106.
- 승인된 적용/전환: responsive/계획책임 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
같은 TODO나 결정 이력을 네 문서에 반복 복제하지 않는다.
```

## CO3 bootstrap·단계·검증·수동 gate

gameplay/runtime 전에 실제 조사와 네 문서 bootstrap을 작성한다. 정확히 네 문서만 있는 미등록 bootstrap은 허용하되 runtime 추가 순간 Registry/플랫폼 요구를 적용한다. 신규 vNext 선택과 적용 계약은 GAME_SPEC에 명시하며 모델 미정과 실제 비적용을 구분한다.

작은 구현/검증 순서와 허용 단계는 승인 계획을 따른다. 기능 자동검증은 Developer Manual Design Review / Detail Polish를 대체하지 않는다. 개발자가 실제 브라우저 플레이로 수동검토하며 디자인PR merge/close·작업브랜치 종료·release closeout 전에 기록누락을 확인한다. 기능완료와 디자인polish완료는 다른 상태다.

설계/문서 검사·Guard 검사·실제 unit/모델/DB/browser/audio/두client·성능·운영 증거를 구분한다. 미실행은 NOT_RUN, trace미상은 INCONCLUSIVE, 운영/실측은 UNKNOWN을 유지한다. 현재CI제한이나 제안표본을 승인예산으로 승격하지 않는다. 변경에 맞는 의미 있는 검사를 수행하고 실제 등록/실행을 확인한다. 전수표의 개수/링크성공을 새 규범 의미검토/행동 PASS로 쓰지 않는다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-agent-040-f0"></a>
#### LEGACY-AGENT-040 / f0

- 원문: [AGENTS.md L64–64](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L64-L64); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- bootstrap 단계에서는 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`만 있는 게임 디렉터리를 Registry 등록 전 상태로 둘 수 있습니다. 실제 runtime 파일을 추가하는 순간 Game Registry와 기존 platform-native 규칙을 함께 적용합니다.
```

<a id="legacy-agent-044-f0"></a>
#### LEGACY-AGENT-044 / f0

- 원문: [AGENTS.md L68–68](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L68-L68); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 기능 구현과 자동 검증이 충분히 끝났다고 해서 디자인까지 완료된 것으로 처리하지 않습니다. release 전에는 `docs/game-platform-ui-rules.md`의 Developer Manual Design Review / Detail Polish 단계에서 개발자가 실제 브라우저로 플레이하며 디자인을 수동 검토하는 흐름을 적용합니다.
```

<a id="legacy-dev-022-f0"></a>
#### LEGACY-DEV-022 / f0

- 원문: [docs/game-platform-development-rules.md L40–40](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L40-L40); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C014.
- 승인된 적용/전환: 착수/실제작업범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 게임 작업자는 소스 수정 전에 다음을 확인해야 한다.
```

<a id="legacy-dev-023-f0"></a>
#### LEGACY-DEV-023 / f0

- 원문: [docs/game-platform-development-rules.md L42–42](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L42-L42); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C014.
- 승인된 적용/전환: 착수/실제작업범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. 최신 `main`에서 작업 브랜치를 만든다.
```

<a id="legacy-dev-024-f0"></a>
#### LEGACY-DEV-024 / f0

- 원문: [docs/game-platform-development-rules.md L43–43](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L43-L43); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C014.
- 승인된 적용/전환: 착수/실제작업범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. **이 문서와 `docs/game-platform-ui-rules.md`를 필수 실행 기준으로 읽는다.**
```

<a id="legacy-dev-025-f0"></a>
#### LEGACY-DEV-025 / f0

- 원문: [docs/game-platform-development-rules.md L44–44](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L44-L44); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C014.
- 승인된 적용/전환: 착수/실제작업범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. `games/shared/`의 현재 공통 계약과 관련 테스트를 확인한다.
```

<a id="legacy-dev-026-f0"></a>
#### LEGACY-DEV-026 / f0

- 원문: [docs/game-platform-development-rules.md L45–45](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L45-L45); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C014.
- 승인된 적용/전환: 착수/실제작업범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. `games/GAME_SPEC_TEMPLATE.md`, `games/DEVELOPMENT_TEMPLATE.md`, `games/UI_DESIGN_TEMPLATE.md`, `games/UI_DECISIONS_TEMPLATE.md`를 기준으로 초기 문서를 준비한다.
```

<a id="legacy-dev-027-f0"></a>
#### LEGACY-DEV-027 / f0

- 원문: [docs/game-platform-development-rules.md L46–46](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L46-L46); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C014.
- 승인된 적용/전환: 착수/실제작업범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
5. DB/RPC가 포함되면 정식 계약 문서인 `docs/game-platform-db-test-contract.md`를 추가로 확인한다.
```

<a id="legacy-dev-028-f0"></a>
#### LEGACY-DEV-028 / f0

- 원문: [docs/game-platform-development-rules.md L47–47](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L47-L47); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C014.
- 승인된 적용/전환: 착수/실제작업범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
6. Legacy 게임 코드를 신규 게임의 기본 구조로 복사하지 않는다.
```

<a id="legacy-dev-029-f0"></a>
#### LEGACY-DEV-029 / f0

- 원문: [docs/game-platform-development-rules.md L49–49](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L49-L49); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C014.
- 승인된 적용/전환: 착수/실제작업범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`docs/game-platform-strategy.md`와 `docs/game-platform-invite-analysis.md`는 플랫폼을 구축한 배경과 결정 과정을 보존하는 참고 문서다. 신규 게임 개발을 시작하기 위한 필수 선행 문서가 아니며, 현재 실행 규칙은 이 문서와 실제 `games/shared/` 코드·테스트를 우선한다.
```

<a id="legacy-dev-030-f0"></a>
#### LEGACY-DEV-030 / f0

- 원문: [docs/game-platform-development-rules.md L51–51](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L51-L51); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C014.
- 승인된 적용/전환: 착수/실제작업범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
새 게임의 기본 위치는 다음과 같다.
```

<a id="legacy-dev-031-f0"></a>
#### LEGACY-DEV-031 / f0

- 원문: [docs/game-platform-development-rules.md L53–55](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L53-L55); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C014.
- 승인된 적용/전환: 착수/실제작업범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>games/&lt;game-id&gt;/<br>```
````

<a id="legacy-dev-032-f0"></a>
#### LEGACY-DEV-032 / f0

- 원문: [docs/game-platform-development-rules.md L57–57](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L57-L57); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C014.
- 승인된 적용/전환: 착수/실제작업범위 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
`game-id`는 lowercase kebab-case를 사용하고 Game Registry에도 동일한 ID를 등록한다.
```

<a id="legacy-dev-043-f0"></a>
#### LEGACY-DEV-043 / f0

- 원문: [docs/game-platform-development-rules.md L73–73](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L73-L73); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C015.
- 승인된 적용/전환: 조사/선택경험조건 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
9. 네 문서가 최소 기준을 충족한 뒤 게임 규칙 엔진, Registry, DB/RPC, UI 등 실제 구현을 시작한다.
```

<a id="legacy-dev-061-f0"></a>
#### LEGACY-DEV-061 / f0

- 원문: [docs/game-platform-development-rules.md L125–125](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L125-L125); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C019.
- 승인된 적용/전환: 수동gate / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 게임의 기능 구현이 충분히 완료되어 release 전 검증·마무리 단계에 들어가면, 자동 테스트 통과만으로 UI를 최종 완료 처리하지 않는다.
```

<a id="legacy-dev-062-f0"></a>
#### LEGACY-DEV-062 / f0

- 원문: [docs/game-platform-development-rules.md L127–127](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L127-L127); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C019.
- 승인된 적용/전환: 수동gate / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 시점에는 `docs/game-platform-ui-rules.md`의 **Developer Manual Design Review / Detail Polish** 단계를 적용한다.
```

<a id="legacy-dev-063-f0"></a>
#### LEGACY-DEV-063 / f0

- 원문: [docs/game-platform-development-rules.md L129–129](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L129-L129); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C019.
- 승인된 적용/전환: 수동gate / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 개발자가 실제 브라우저에서 게임을 플레이하며 초기 `UI_DESIGN.md` 구현 결과를 직접 확인한다.
```

<a id="legacy-dev-067-f0"></a>
#### LEGACY-DEV-067 / f0

- 원문: [docs/game-platform-development-rules.md L133–133](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L133-L133); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C019.
- 승인된 적용/전환: 수동gate / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 기능 개발의 완료 상태와 디자인 polish 완료 상태를 같은 것으로 취급하지 않는다.
```

<a id="legacy-dev-079-f0"></a>
#### LEGACY-DEV-079 / f0

- 원문: [docs/game-platform-development-rules.md L158–158](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L158-L158); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C021.
- 승인된 적용/전환: bootstrap/runtime경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 게임은 설계를 먼저 확정하기 위해 `games/&lt;game-id&gt;/`에 다음 네 파일만 존재하는 **bootstrap 상태**를 가질 수 있다.
```

<a id="legacy-dev-080-f0"></a>
#### LEGACY-DEV-080 / f0

- 원문: [docs/game-platform-development-rules.md L160–165](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L160-L165); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C021.
- 승인된 적용/전환: bootstrap/runtime경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

````text
```text<br>GAME_SPEC.md<br>DEVELOPMENT.md<br>UI_DESIGN.md<br>UI_DECISIONS.md<br>```
````

<a id="legacy-dev-081-f0"></a>
#### LEGACY-DEV-081 / f0

- 원문: [docs/game-platform-development-rules.md L167–167](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L167-L167); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C021.
- 승인된 적용/전환: bootstrap/runtime경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 bootstrap 상태에서는 아직 Game Registry에 등록하지 않아도 된다. 미완성 게임이 게임 목록이나 실제 서비스 경로에 노출되는 것을 막기 위한 예외다.
```

<a id="legacy-dev-082-f0"></a>
#### LEGACY-DEV-082 / f0

- 원문: [docs/game-platform-development-rules.md L169–169](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L169-L169); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C021.
- 승인된 적용/전환: bootstrap/runtime경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
다음 중 하나라도 시작하면 bootstrap 상태가 끝난다.
```

<a id="legacy-dev-083-f0"></a>
#### LEGACY-DEV-083 / f0

- 원문: [docs/game-platform-development-rules.md L171–171](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L171-L171); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C021.
- 승인된 적용/전환: bootstrap/runtime경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `index.html`, JavaScript, CSS 등 실제 game runtime 파일 추가
```

<a id="legacy-dev-084-f0"></a>
#### LEGACY-DEV-084 / f0

- 원문: [docs/game-platform-development-rules.md L172–172](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L172-L172); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C021.
- 승인된 적용/전환: bootstrap/runtime경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임 전용 asset 또는 실행 모듈 추가
```

<a id="legacy-dev-085-f0"></a>
#### LEGACY-DEV-085 / f0

- 원문: [docs/game-platform-development-rules.md L173–173](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L173-L173); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C021.
- 승인된 적용/전환: bootstrap/runtime경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 실제 플레이 가능한 화면/엔진 구현 시작
```

<a id="legacy-dev-086-f0"></a>
#### LEGACY-DEV-086 / f0

- 원문: [docs/game-platform-development-rules.md L175–175](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L175-L175); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C021.
- 승인된 적용/전환: bootstrap/runtime경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
bootstrap 상태가 끝나는 PR에서는 같은 변경 범위 안에서 Game Registry 등록을 추가하고 실제 구현된 capability만 선언한다.
```

<a id="legacy-dev-087-f0"></a>
#### LEGACY-DEV-087 / f0

- 원문: [docs/game-platform-development-rules.md L177–177](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L177-L177); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 본문:MUST NOT; 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C021.
- 승인된 적용/전환: bootstrap/runtime경계 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
MUST NOT: 구현 예정이라는 이유만으로 `online`, `invite`, `presence` 같은 capability를 미리 선언하지 않는다.
```

<a id="legacy-dev-385-f0"></a>
#### LEGACY-DEV-385 / f0

- 원문: [docs/game-platform-development-rules.md L759–759](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L759-L759); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
특별한 이유가 없다면 다음 순서로 개발한다.
```

<a id="legacy-dev-386-f4"></a>
#### LEGACY-DEV-386 / f4

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 규칙/상태머신구현·unit; 원문 범위: 코드블록순서4.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f16"></a>
#### LEGACY-DEV-386 / f16

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 기능/자동검증수렴; 원문 범위: 코드블록순서16.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f17"></a>
#### LEGACY-DEV-386 / f17

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 실제브라우저manualpolish; 원문 범위: 코드블록순서17.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-387-f0"></a>
#### LEGACY-DEV-387 / f0

- 원문: [docs/game-platform-development-rules.md L790–790](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L790-L790); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 순서는 게임 고유 시각 연출을 늦추기 위한 강제 단계가 아니라, 네트워크와 권위 모델이 흔들린 상태에서 UI 복잡도를 먼저 키우지 않기 위한 기본 작업 순서다.
```

<a id="legacy-dev-388-f0"></a>
#### LEGACY-DEV-388 / f0

- 원문: [docs/game-platform-development-rules.md L792–792](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L792-L792); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
네 문서의 설계와 진행 기록은 다음 책임으로 구분한다.
```

<a id="legacy-dev-389-f0"></a>
#### LEGACY-DEV-389 / f0

- 원문: [docs/game-platform-development-rules.md L794–794](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L794-L794); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `GAME_SPEC.md / Implementation Plan`: 기능·상태 머신·DB/RPC·플랫폼 연결의 설계 순서
```

<a id="legacy-dev-390-f0"></a>
#### LEGACY-DEV-390 / f0

- 원문: [docs/game-platform-development-rules.md L795–795](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L795-L795); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `DEVELOPMENT.md / Next Work`: 지금 실제 기능 작업에서 다음으로 수행할 구체적인 행동
```

<a id="legacy-dev-391-f0"></a>
#### LEGACY-DEV-391 / f0

- 원문: [docs/game-platform-development-rules.md L796–796](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L796-L796); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `UI_DESIGN.md / Implementation Plan`: 현재 디자인을 구현할 때의 안정적인 presentation 적용 순서/가이드이며 실시간 작업 일지가 아니다
```

<a id="legacy-dev-392-f0"></a>
#### LEGACY-DEV-392 / f0

- 원문: [docs/game-platform-development-rules.md L797–797](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L797-L797); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `UI_DECISIONS.md / Current Design Track · Decision Log · Open Follow-up`: 실제 디자인 개발 진행, 중요한 변경 이유, 대안, 검증, 다음 UI 작업
```

<a id="legacy-dev-393-f0"></a>
#### LEGACY-DEV-393 / f0

- 원문: [docs/game-platform-development-rules.md L799–799](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L799-L799); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
같은 TODO나 변경 이력을 여러 문서에 복제해 각각 따로 관리하지 않는다. 특히 17~18의 수동 디자인 리뷰와 decision 기록은 기능 구현과 별도의 마무리 단계다. 첫 공개 또는 큰 release에서는 이 단계를 생략하지 않고, 작은 유지보수 수정에서는 변경 범위에 필요한 항목만 적용한다.
```

<a id="legacy-dev-394-f0"></a>
#### LEGACY-DEV-394 / f0

- 원문: [docs/game-platform-development-rules.md L803–803](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L803-L803); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
신규 온라인 게임 PR을 완료하기 전에 다음을 확인한다.
```

<a id="legacy-dev-395-f0"></a>
#### LEGACY-DEV-395 / f0

- 원문: [docs/game-platform-development-rules.md L805–805](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L805-L805); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; `games/&lt;game-id&gt;/`에 게임이 독립적으로 위치한다.
```

<a id="legacy-dev-396-f0"></a>
#### LEGACY-DEV-396 / f0

- 원문: [docs/game-platform-development-rules.md L806–806](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L806-L806); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; `games/&lt;game-id&gt;/GAME_SPEC.md`가 현재 게임 규칙, 구현 범위, 상태 머신, 플랫폼 경계를 반영한다.
```

<a id="legacy-dev-397-f0"></a>
#### LEGACY-DEV-397 / f0

- 원문: [docs/game-platform-development-rules.md L807–807](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L807-L807); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; `games/&lt;game-id&gt;/UI_DESIGN.md`가 runtime 개발 전 디자인 조사 출처, 자산 사용 경계, Visual Identity, 독립 페이지 방향, motion/responsive, 최초 Phase baseline을 반영한다.
```

<a id="legacy-dev-398-f0"></a>
#### LEGACY-DEV-398 / f0

- 원문: [docs/game-platform-development-rules.md L808–808](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L808-L808); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 기능 구현 후 Developer Manual Design Review / Detail Polish를 수행했거나, 수행 전이라면 아직 디자인 완료로 표시하지 않았다.
```

<a id="legacy-dev-399-f0"></a>
#### LEGACY-DEV-399 / f0

- 원문: [docs/game-platform-development-rules.md L809–809](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L809-L809); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; `games/&lt;game-id&gt;/UI_DECISIONS.md`가 개발자 수동 브라우저 리뷰에서 확정된 의미 있는 디자인 수정, 변경 이유, 폐기/대체 결정, UI/browser validation과 후속 디자인 작업을 반영한다.
```

<a id="legacy-dev-400-f0"></a>
#### LEGACY-DEV-400 / f0

- 원문: [docs/game-platform-development-rules.md L810–810](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L810-L810); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 디자인 PR merge/close 또는 release closeout 전에 기록되지 않은 확정 디자인 decision이 남아 있지 않다.
```

<a id="legacy-dev-401-f0"></a>
#### LEGACY-DEV-401 / f0

- 원문: [docs/game-platform-development-rules.md L811–811](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L811-L811); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; `games/&lt;game-id&gt;/DEVELOPMENT.md`가 GAME_SPEC 기준 기능 Phase/브랜치/다음 기능 작업/검증 상태를 반영하고 UI 세부 이력을 중복 관리하지 않는다.
```

<a id="legacy-dev-402-f0"></a>
#### LEGACY-DEV-402 / f0

- 원문: [docs/game-platform-development-rules.md L812–812](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L812-L812); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; Registry에 `platform: "shared"`로 등록되어 있다.
```

<a id="legacy-dev-403-f0"></a>
#### LEGACY-DEV-403 / f0

- 원문: [docs/game-platform-development-rules.md L813–813](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L813-L813); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 실제 구현된 capability만 선언되어 있다.
```

<a id="legacy-dev-404-f0"></a>
#### LEGACY-DEV-404 / f0

- 원문: [docs/game-platform-development-rules.md L814–814](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L814-L814); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; Approved Member / Access Gate를 사용한다.
```

<a id="legacy-dev-405-f0"></a>
#### LEGACY-DEV-405 / f0

- 원문: [docs/game-platform-development-rules.md L815–815](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L815-L815); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; room/session 기반 online 게임이라면 현재 shared adapter가 lifecycle에 맞는지 확인하고, 맞지 않으면 의미 없는 method를 추가하지 않고 계약 확장 여부를 검토했다.
```

<a id="legacy-dev-406-f0"></a>
#### LEGACY-DEV-406 / f0

- 원문: [docs/game-platform-development-rules.md L816–816](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L816-L816); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 사이트 계정 기반 multiplayer라면 게임별 entry/lobby에서 닉네임을 따로 만들지 않고 사이트 프로필 닉네임을 사용한다.
```

<a id="legacy-dev-407-f0"></a>
#### LEGACY-DEV-407 / f0

- 원문: [docs/game-platform-development-rules.md L817–817](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L817-L817); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 서버 RPC가 권한과 상태 전이를 최종 판정한다.
```

<a id="legacy-dev-408-f0"></a>
#### LEGACY-DEV-408 / f0

- 원문: [docs/game-platform-development-rules.md L818–818](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L818-L818); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; state-changing action이 version/idempotency 경계를 가진다.
```

<a id="legacy-dev-409-f0"></a>
#### LEGACY-DEV-409 / f0

- 원문: [docs/game-platform-development-rules.md L819–819](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L819-L819); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; snapshot version과 stale snapshot 방어가 있다.
```

<a id="legacy-dev-410-f0"></a>
#### LEGACY-DEV-410 / f0

- 원문: [docs/game-platform-development-rules.md L820–820](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L820-L820); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; Realtime은 invalidation으로만 사용한다.
```

<a id="legacy-dev-411-f0"></a>
#### LEGACY-DEV-411 / f0

- 원문: [docs/game-platform-development-rules.md L821–821](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L821-L821); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; reconnect가 authoritative snapshot으로 복원된다.
```

<a id="legacy-dev-412-f0"></a>
#### LEGACY-DEV-412 / f0

- 원문: [docs/game-platform-development-rules.md L822–822](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L822-L822); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 구독/listener 정리 경로가 있다.
```

<a id="legacy-dev-413-f0"></a>
#### LEGACY-DEV-413 / f0

- 원문: [docs/game-platform-development-rules.md L823–823](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L823-L823); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 플레이 시작 전 entry/setup 화면에서 상세 게임 규칙을 확인할 수 있고 플레이 중에도 다시 접근할 수 있다.
```

<a id="legacy-dev-414-f0"></a>
#### LEGACY-DEV-414 / f0

- 원문: [docs/game-platform-development-rules.md L824–824](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L824-L824); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 진행 중 세션을 안전하게 끝낼 수 있는 게임 종료 경로와 종료 후 복구/이탈 흐름이 있다.
```

<a id="legacy-dev-415-f0"></a>
#### LEGACY-DEV-415 / f0

- 원문: [docs/game-platform-development-rules.md L825–825](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L825-L825); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 멀티플레이 게임이라면 GAME_OVER → 재대결 준비 → 참여자 ready → 방장 시작 → 새 게임의 흐름이 있고 reconnect/이탈/최소 인원 조건을 authoritative하게 처리한다.
```

<a id="legacy-dev-416-f0"></a>
#### LEGACY-DEV-416 / f0

- 원문: [docs/game-platform-development-rules.md L826–826](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L826-L826); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; Common Game Shell 사용 여부와 게임-local UI 경계가 명확하다.
```

<a id="legacy-dev-417-f0"></a>
#### LEGACY-DEV-417 / f0

- 원문: [docs/game-platform-development-rules.md L827–827](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L827-L827); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; entry/lobby/gameplay/result/rematch가 `UI_DESIGN.md` baseline과 최신 non-superseded `UI_DECISIONS.md` overrides로 계산한 유효 디자인을 유지하고 일반 청파 같이 페이지와 구별되는 독립적인 게임 공간으로 느껴진다.
```

<a id="legacy-dev-418-f0"></a>
#### LEGACY-DEV-418 / f0

- 원문: [docs/game-platform-development-rules.md L828–828](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L828-L828); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; UI_DESIGN validation checklist와 UI_DECISIONS의 desktop/mobile/interaction 검증 이력을 확인했다.
```

<a id="legacy-dev-419-f0"></a>
#### LEGACY-DEV-419 / f0

- 원문: [docs/game-platform-development-rules.md L829–829](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L829-L829); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; Invite를 제공한다면 `game_room` 계약을 사용한다.
```

<a id="legacy-dev-420-f0"></a>
#### LEGACY-DEV-420 / f0

- 원문: [docs/game-platform-development-rules.md L830–830](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L830-L830); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; DB/Test Contract 필수 시나리오를 모두 구현한다.
```

<a id="legacy-dev-421-f0"></a>
#### LEGACY-DEV-421 / f0

- 원문: [docs/game-platform-development-rules.md L831–831](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L831-L831); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 다른 플레이어의 private state가 노출되지 않는다.
```

<a id="legacy-dev-422-f0"></a>
#### LEGACY-DEV-422 / f0

- 원문: [docs/game-platform-development-rules.md L832–832](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L832-L832); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 기존 Legacy 게임을 불필요하게 수정하지 않았다.
```

<a id="legacy-dev-423-f0"></a>
#### LEGACY-DEV-423 / f0

- 원문: [docs/game-platform-development-rules.md L833–833](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L833-L833); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 관련 unit / DB integration / E2E / build 검증을 실행했다.
```

<a id="legacy-dev-424-f0"></a>
#### LEGACY-DEV-424 / f0

- 원문: [docs/game-platform-development-rules.md L834–834](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L834-L834); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C058.
- 승인된 적용/전환: 적용항목완료체크 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; shared 계약을 변경했다면 테스트와 문서를 함께 갱신했다.
```

<a id="legacy-ui-207-f0"></a>
#### LEGACY-UI-207 / f0

- 원문: [docs/game-platform-ui-rules.md L377–377](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L377-L377); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C107.
- 승인된 적용/전환: 실제UI검증 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
UI 구현을 완료했다고 판단하기 전에 최소 다음을 확인한다.
```

<a id="legacy-ui-208-f0"></a>
#### LEGACY-UI-208 / f0

- 원문: [docs/game-platform-ui-rules.md L379–379](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L379-L379); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C107.
- 승인된 적용/전환: 실제UI검증 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 원본 게임 조사 결과가 `UI_DESIGN.md`에 남아 있는가
```

<a id="legacy-ui-209-f0"></a>
#### LEGACY-UI-209 / f0

- 원문: [docs/game-platform-ui-rules.md L380–380](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L380-L380); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C107.
- 승인된 적용/전환: 실제UI검증 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 디자인 출처와 자산 사용 가능 여부가 구분돼 있는가
```

<a id="legacy-ui-210-f0"></a>
#### LEGACY-UI-210 / f0

- 원문: [docs/game-platform-ui-rules.md L381–381](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L381-L381); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C107.
- 승인된 적용/전환: 실제UI검증 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- generic 청파 같이 페이지가 아니라 해당 게임의 독립적인 공간으로 느껴지는가
```

<a id="legacy-ui-211-f0"></a>
#### LEGACY-UI-211 / f0

- 원문: [docs/game-platform-ui-rules.md L382–382](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L382-L382); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C107.
- 승인된 적용/전환: 실제UI검증 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 대표 색상/심볼/구성물 표현이 설계와 일치하는가
```

<a id="legacy-ui-212-f0"></a>
#### LEGACY-UI-212 / f0

- 원문: [docs/game-platform-ui-rules.md L383–383](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L383-L383); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C107.
- 승인된 적용/전환: 실제UI검증 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- lobby부터 result/rematch까지 Visual Identity가 끊기지 않는가
```

<a id="legacy-ui-213-f0"></a>
#### LEGACY-UI-213 / f0

- 원문: [docs/game-platform-ui-rules.md L384–384](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L384-L384); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C107.
- 승인된 적용/전환: 실제UI검증 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- gameplay 핵심 정보의 가독성이 충분한가
```

<a id="legacy-ui-214-f0"></a>
#### LEGACY-UI-214 / f0

- 원문: [docs/game-platform-ui-rules.md L385–385](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L385-L385); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C107.
- 승인된 적용/전환: 실제UI검증 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- motion이 서버 권위와 충돌하지 않고 행동 순서를 이해시키는가
```

<a id="legacy-ui-215-f0"></a>
#### LEGACY-UI-215 / f0

- 원문: [docs/game-platform-ui-rules.md L386–386](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L386-L386); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C107.
- 승인된 적용/전환: 실제UI검증 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- desktop/mobile에서 핵심 action을 사용할 수 있는가
```

<a id="legacy-ui-216-f0"></a>
#### LEGACY-UI-216 / f0

- 원문: [docs/game-platform-ui-rules.md L387–387](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L387-L387); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C107.
- 승인된 적용/전환: 실제UI검증 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- `UI_DECISIONS.md`의 디자인 진행·중요 결정·검증 이력이 실제 구현과 일치하는가
```

## CO4 공통 UX·안내·종료

외부검색 없이 이해 가능한 상세 규칙안내를 로비/시작전에 제공하고 플레이중 재진입점을 유지한다. 목표·선택·실패/패널티·종료·실제 경험의 대표예시를 설명한다. 없는 턴/승자/점수/Room을 생성하지 않는다. 규칙 내용의 기능적 사실은 GAME_SPEC, 시각/interaction은 UI_DESIGN과 유효 UI_DECISIONS가 소유한다.

안내를 generic 문서/modal이나 특정 다른게임 layout으로 고정하지 않는다. 텍스트/semantic structure만으로도 이해 가능해야 하고 실제 구성물 표현은 권리와 해당 장르 조건을 따른다. 반응형/터치/키보드/포커스·작은화면 조건의 원 MUST/SHOULD/예외를 유지한다.

진행 세션을 명시적으로 안전하게 끝내는 제품경로를 제공한다. 온라인 타참가자 영향 종료는 서버권위/확인UI와 MO2/LI2를 따른다. browser close는 경기종료가 아니다. 잠정 피드백과 확정 결과를 구분하고 예측/동일state 재적용으로 보상·효과를 재발행하지 않는다. 실제 UI/결과연출은 game-local이며 CA4의 공식 소비·중복 책임을 참조한다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-agent-051-f0"></a>
#### LEGACY-AGENT-051 / f0

- 원문: [AGENTS.md L75–75](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/AGENTS.md#L75-L75); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C006.
- 승인된 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D/C.

```text
- 모든 platform-native 게임은 로비 또는 시작 전 화면에서 처음 플레이하는 사용자도 이해할 수 있는 상세 규칙 안내를 제공하고, 플레이 중에도 다시 확인할 수 있는 진입점을 유지합니다.
```

<a id="legacy-dev-285-f1"></a>
#### LEGACY-DEV-285 / f1

- 원문: [docs/game-platform-development-rules.md L562–562](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L562-L562); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C043.
- 승인된 적용/전환: 규칙안내 / 참조계승.
- 책임 의미: 사용자안내; 원문 범위: 외부검색없이게임을이해.
- 검증 대응: V-D.

```text
모든 platform-native 게임은 처음 플레이하는 사용자가 외부 검색 없이 게임을 이해하고 안전하게 세션을 끝낼 수 있어야 한다.
```

<a id="legacy-dev-285-f2"></a>
#### LEGACY-DEV-285 / f2

- 원문: [docs/game-platform-development-rules.md L562–562](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L562-L562); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C043.
- 승인된 적용/전환: 규칙안내 / 참조계승.
- 책임 의미: 안전종료의제품접근; 원문 범위: 안전하게세션을끝냄.
- 검증 대응: V-D.

```text
모든 platform-native 게임은 처음 플레이하는 사용자가 외부 검색 없이 게임을 이해하고 안전하게 세션을 끝낼 수 있어야 한다.
```

<a id="legacy-dev-286-f0"></a>
#### LEGACY-DEV-286 / f0

- 원문: [docs/game-platform-development-rules.md L566–566](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L566-L566); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C044.
- 승인된 적용/전환: 규칙안내 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 사용자가 플레이를 시작하기 전에 접근 가능한 entry/setup 화면(로비가 있는 게임은 로비 포함)에서 항상 **게임 규칙 보기**에 접근할 수 있어야 한다.
```

<a id="legacy-dev-287-f1"></a>
#### LEGACY-DEV-287 / f1

- 원문: [docs/game-platform-development-rules.md L567–567](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L567-L567); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C044.
- 승인된 적용/전환: 규칙안내 / 참조계승.
- 책임 의미: 일반규칙안내; 원문 범위: 목표·가능선택·실패/패널티·종료·대표예시의충분한설명.
- 검증 대응: V-D.

```text
- 규칙 안내는 처음 플레이하는 사용자가 읽고 바로 플레이할 수 있을 정도로 목표, 구성요소, 턴 순서, 가능한 선택, 실패/패널티, 종료/승리 조건, 대표 예시를 충분히 설명한다.
```

<a id="legacy-dev-289-f0"></a>
#### LEGACY-DEV-289 / f0

- 원문: [docs/game-platform-development-rules.md L569–569](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L569-L569); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C044.
- 승인된 적용/전환: 규칙안내 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 규칙이 짧거나 중간 분량이면 modal/dialog를 사용할 수 있고, 내용이 길거나 예시·도표가 많으면 game-local 전용 규칙 페이지를 사용한다.
```

<a id="legacy-dev-290-f0"></a>
#### LEGACY-DEV-290 / f0

- 원문: [docs/game-platform-development-rules.md L570–570](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L570-L570); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C044.
- 승인된 적용/전환: 규칙안내 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 규칙 modal/page의 Visual Identity, game component 활용, 정보 계층, 접근성·responsive presentation은 `docs/game-platform-ui-rules.md`의 게임 규칙 안내 presentation 기준을 따른다.
```

<a id="legacy-dev-292-f0"></a>
#### LEGACY-DEV-292 / f0

- 원문: [docs/game-platform-development-rules.md L572–572](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L572-L572); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C044.
- 승인된 적용/전환: 규칙안내 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 실제 플레이 중에도 규칙 안내를 다시 열 수 있는 경로를 유지하는 것을 기본값으로 한다.
```

<a id="legacy-dev-293-f0"></a>
#### LEGACY-DEV-293 / f0

- 원문: [docs/game-platform-development-rules.md L576–576](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L576-L576); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C045.
- 승인된 적용/전환: 지속세션/온라인권위종료 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 지속되는 플레이 세션을 갖는 게임은 진행 중인 세션을 끝낼 수 있는 명시적 **게임 종료** 또는 이에 준하는 안전한 종료 경로를 제공한다.
```

<a id="legacy-dev-295-f0"></a>
#### LEGACY-DEV-295 / f0

- 원문: [docs/game-platform-development-rules.md L578–578](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L578-L578); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C045.
- 승인된 적용/전환: 지속세션/온라인권위종료 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 파괴적 종료는 확인 modal/dialog를 거쳐 오조작을 방지한다.
```

<a id="legacy-dev-305-f0"></a>
#### LEGACY-DEV-305 / f0

- 원문: [docs/game-platform-development-rules.md L606–606](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L606-L606); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C047.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 재대결 준비 상태에서 참여 플레이어의 ready 상태와 방장의 시작 가능 조건을 명확히 표현한다.
```

<a id="legacy-dev-309-f0"></a>
#### LEGACY-DEV-309 / f0

- 원문: [docs/game-platform-development-rules.md L610–610](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L610-L610); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C047.
- 승인된 적용/전환: multiplayer재대결;§4.2 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 결과와 재대결 presentation은 `docs/game-platform-ui-rules.md`에 따라 게임 고유 Visual Identity 안에서 이어진다.
```

<a id="legacy-dev-386-f19"></a>
#### LEGACY-DEV-386 / f19

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 게임고유motion/responsivepolish; 원문 범위: 코드블록순서19.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-ui-033-f0"></a>
#### LEGACY-UI-033 / f0

- 원문: [docs/game-platform-ui-rules.md L69–69](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L69-L69); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
게임 목록에서 특정 게임으로 진입한 뒤에는 청파 같이 일반 서비스의 하위 화면이 아니라 **해당 게임의 독립적인 공간에 들어온 느낌**을 제공한다.
```

<a id="legacy-ui-034-f0"></a>
#### LEGACY-UI-034 / f0

- 원문: [docs/game-platform-ui-rules.md L71–71](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L71-L71); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:원칙; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
이 원칙은 플레이 보드만이 아니라 다음 전체 흐름에 적용한다.
```

<a id="legacy-ui-035-f0"></a>
#### LEGACY-UI-035 / f0

- 원문: [docs/game-platform-ui-rules.md L73–73](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L73-L73); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- entry / landing
```

<a id="legacy-ui-036-f0"></a>
#### LEGACY-UI-036 / f0

- 원문: [docs/game-platform-ui-rules.md L74–74](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L74-L74); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 방 생성 / 참가
```

<a id="legacy-ui-037-f0"></a>
#### LEGACY-UI-037 / f0

- 원문: [docs/game-platform-ui-rules.md L75–75](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L75-L75); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- lobby / ready
```

<a id="legacy-ui-038-f0"></a>
#### LEGACY-UI-038 / f0

- 원문: [docs/game-platform-ui-rules.md L76–76](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L76-L76); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 규칙 안내
```

<a id="legacy-ui-039-f0"></a>
#### LEGACY-UI-039 / f0

- 원문: [docs/game-platform-ui-rules.md L77–77](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L77-L77); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- gameplay
```

<a id="legacy-ui-040-f0"></a>
#### LEGACY-UI-040 / f0

- 원문: [docs/game-platform-ui-rules.md L78–78](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L78-L78); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- modal / status / error presentation
```

<a id="legacy-ui-041-f0"></a>
#### LEGACY-UI-041 / f0

- 원문: [docs/game-platform-ui-rules.md L79–79](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L79-L79); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- result
```

<a id="legacy-ui-042-f0"></a>
#### LEGACY-UI-042 / f0

- 원문: [docs/game-platform-ui-rules.md L80–80](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L80-L80); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- rematch 준비
```

<a id="legacy-ui-043-f0"></a>
#### LEGACY-UI-043 / f0

- 원문: [docs/game-platform-ui-rules.md L81–81](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L81-L81); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- loading / reconnect presentation
```

<a id="legacy-ui-044-f0"></a>
#### LEGACY-UI-044 / f0

- 원문: [docs/game-platform-ui-rules.md L83–83](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L83-L83); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:할 수 있다; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
게임-local 디자인은 필요하면 일반 사이트와 다른 배경, 레이아웃, 버튼, 패널, 폰트, 심볼, 장식, 모션을 사용할 수 있다.
```

<a id="legacy-ui-045-f0"></a>
#### LEGACY-UI-045 / f0

- 원문: [docs/game-platform-ui-rules.md L85–85](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L85-L85); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C085.
- 승인된 적용/전환: 독립페이지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
다만 사이트 계정 identity, 접근 권한, Room/Lobby 계약, authoritative state 같은 플랫폼 책임까지 시각적 독립성을 이유로 다시 구현하지 않는다.
```

<a id="legacy-ui-061-f0"></a>
#### LEGACY-UI-061 / f0

- 원문: [docs/game-platform-ui-rules.md L109–109](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L109-L109); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C087.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
게임 규칙 modal/page는 게임 밖의 일반 도움말 문서가 아니라 **처음 플레이하는 사용자가 실제 구성물과 행동 구조를 이해하는 game-local presentation**으로 설계한다.
```

<a id="legacy-ui-062-f0"></a>
#### LEGACY-UI-062 / f0

- 원문: [docs/game-platform-ui-rules.md L111–111](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L111-L111); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:필수; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C087.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
규칙 내용의 기능적 사실과 필수 설명 범위는 `GAME_SPEC.md`와 `docs/game-platform-development-rules.md`가 책임진다. 이 섹션은 그 내용을 어떤 시각 언어와 정보 계층으로 전달할지에 대한 UI 기준을 소유한다.
```

<a id="legacy-ui-063-f0"></a>
#### LEGACY-UI-063 / f0

- 원문: [docs/game-platform-ui-rules.md L115–115](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L115-L115); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C088.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 규칙 안내는 해당 게임의 `Visual Identity`와 동일한 색상, 형태, 타이포그래피, 재질감 또는 공간 메타포를 유지한다. 일반 서비스의 generic 문서/modal 스타일을 그대로 기본값으로 확정하지 않는다.
```

<a id="legacy-ui-064-f0"></a>
#### LEGACY-UI-064 / f0

- 원문: [docs/game-platform-ui-rules.md L116–116](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L116-L116); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C088.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 규칙 안내의 시각화는 `GAME_SPEC.md`에 정의된 실제 규칙과 같은 의미를 사용해야 하며, 예쁜 연출을 위해 규칙을 단순화하거나 다른 동작처럼 보이게 만들지 않는다.
```

<a id="legacy-ui-065-f0"></a>
#### LEGACY-UI-065 / f0

- 원문: [docs/game-platform-ui-rules.md L117–117](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L117-L117); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C088.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 핵심 목표, 턴/행동 순서, 주요 선택, 실패·위험·패널티, 종료·승리 조건과 대표 예시는 명확한 정보 계층으로 구분한다.
```

<a id="legacy-ui-066-f1"></a>
#### LEGACY-UI-066 / f1

- 원문: [docs/game-platform-ui-rules.md L118–118](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L118-L118); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C088.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 실제구성물/표현의연결; 원문 범위: 구성물표현시UI_DESIGN자산경계와game-localcomponent언어.
- 검증 대응: V-D.

```text
- 카드, 주사위, 말, 칩, 보드, 트랙 등 게임 구성물을 표현할 때는 `UI_DESIGN.md`의 자산 사용 경계와 game-local component 언어를 재사용하거나 독자적으로 재구성한다. 사용 권리가 불명확한 공식 artwork를 규칙 설명이라는 이유로 직접 복제하지 않는다.
```

<a id="legacy-ui-067-f0"></a>
#### LEGACY-UI-067 / f0

- 원문: [docs/game-platform-ui-rules.md L119–119](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L119-L119); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C088.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 시각적 예시가 있더라도 핵심 규칙은 텍스트/semantic structure만으로도 이해 가능해야 한다. 색상·장식·animation 하나에만 의미를 의존하지 않는다.
```

<a id="legacy-ui-068-f0"></a>
#### LEGACY-UI-068 / f0

- 원문: [docs/game-platform-ui-rules.md L120–120](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L120-L120); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C088.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- modal/dialog를 사용하면 작은 높이 화면에서도 제목, 닫기 경로, 핵심 규칙, 내부 scroll이 안정적으로 동작해야 하며 gameplay를 복구 불가능하게 가리지 않는다. 전용 rules page를 쓰는 경우에도 동일한 game-local presentation 기준을 적용한다.
```

<a id="legacy-ui-069-f0"></a>
#### LEGACY-UI-069 / f0

- 원문: [docs/game-platform-ui-rules.md L121–121](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L121-L121); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C088.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- desktop/mobile에서 핵심 예시와 본문 순서가 무너지지 않는지 확인한다.
```

<a id="legacy-ui-070-f0"></a>
#### LEGACY-UI-070 / f0

- 원문: [docs/game-platform-ui-rules.md L125–125](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L125-L125); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C089.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 실제 구성물, 공간 구조, 행동 순서나 계산을 시각화했을 때 처음 플레이하는 사용자의 이해가 크게 좋아지는 핵심 메커니즘은 **게임 구성물 언어를 활용한 짧은 시각적 예시**로 보여준다.
```

<a id="legacy-ui-071-f0"></a>
#### LEGACY-UI-071 / f0

- 원문: [docs/game-platform-ui-rules.md L126–126](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L126-L126); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:SHOULD; 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C089.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 규칙이 길면 모든 문단을 장식하기보다 목표 → 핵심 loop → 중요한 예외/위험 → 승리의 순서를 우선하고, 반복되는 세부 설명은 읽기 쉬운 section/card 구조로 정리한다.
```

<a id="legacy-ui-072-f0"></a>
#### LEGACY-UI-072 / f0

- 원문: [docs/game-platform-ui-rules.md L127–127](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L127-L127); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:SHOULD; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C089.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임 플레이 화면에서 이미 익히게 되는 component를 규칙 안내에서도 재사용해 “설명 속 구성물”과 “실제 플레이 구성물”의 인지 차이를 줄인다.
```

<a id="legacy-ui-073-f0"></a>
#### LEGACY-UI-073 / f0

- 원문: [docs/game-platform-ui-rules.md L131–131](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L131-L131); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C090.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 특정 다른 게임의 규칙 modal layout이나 장식 구조를 공통 template처럼 복제하지 않는다.
```

<a id="legacy-ui-074-f0"></a>
#### LEGACY-UI-074 / f0

- 원문: [docs/game-platform-ui-rules.md L132–132](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L132-L132); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 절:MUST NOT; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C090.
- 승인된 적용/전환: 안내/MUST-SHOULD-예외유지 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 규칙 안내를 화려하게 만들기 위해 본문 가독성, 접근성, scroll 안정성 또는 핵심 설명 순서를 희생하지 않는다.
```

<a id="legacy-ui-188-f1"></a>
#### LEGACY-UI-188 / f1

- 원문: [docs/game-platform-ui-rules.md L340–340](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L340-L340); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C103.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 행동피드백의이해; 원문 범위: 원인→이동/행동→결과반영을사용자가이해.
- 검증 대응: V-D.

```text
애니메이션은 장식보다 **원인 → 이동/행동 → authoritative 결과 반영**의 순서를 사용자가 이해하게 만드는 것이 우선이다.
```

<a id="legacy-ui-189-f2"></a>
#### LEGACY-UI-189 / f2

- 원문: [docs/game-platform-ui-rules.md L342–342](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L342-L342); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C103.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 잠정/확정presentation; 원문 범위: 실제서버상태와다른결과먼저확정표시금지.
- 검증 대응: V-D.

```text
동기화 안정성을 해치거나 실제 서버 상태와 다른 결과를 먼저 확정해서 보여주지 않는다.
```

<a id="legacy-ui-190-f0"></a>
#### LEGACY-UI-190 / f0

- 원문: [docs/game-platform-ui-rules.md L346–346](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L346-L346); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C104.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
멀티플레이 게임의 결과 화면과 재대결 준비 화면도 해당 게임의 Visual Identity 안에서 설계한다.
```

<a id="legacy-ui-192-f0"></a>
#### LEGACY-UI-192 / f0

- 원문: [docs/game-platform-ui-rules.md L350–350](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L350-L350); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C104.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
UI는 최소 다음을 명확히 표현한다.
```

<a id="legacy-ui-193-f0"></a>
#### LEGACY-UI-193 / f0

- 원문: [docs/game-platform-ui-rules.md L352–352](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L352-L352); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C104.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임 종료 이유와 결과
```

<a id="legacy-ui-195-f0"></a>
#### LEGACY-UI-195 / f0

- 원문: [docs/game-platform-ui-rules.md L354–354](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L354-L354); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C104.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 재대결 선택 상태
```

<a id="legacy-ui-196-f0"></a>
#### LEGACY-UI-196 / f0

- 원문: [docs/game-platform-ui-rules.md L355–355](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L355-L355); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C104.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 플레이어별 준비 상태
```

<a id="legacy-ui-197-f0"></a>
#### LEGACY-UI-197 / f0

- 원문: [docs/game-platform-ui-rules.md L356–356](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L356-L356); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:조건; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C104.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 방장이 새 게임을 시작할 수 있는 조건
```

<a id="legacy-ui-198-f0"></a>
#### LEGACY-UI-198 / f0

- 원문: [docs/game-platform-ui-rules.md L357–357](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L357-L357); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C104.
- 승인된 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 재대결하지 않는 플레이어의 이탈 경로
```

<a id="legacy-ui-199-f0"></a>
#### LEGACY-UI-199 / f0

- 원문: [docs/game-platform-ui-rules.md L361–361](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L361-L361); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C105.
- 승인된 적용/전환: responsive/계획책임 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
게임 UI는 desktop과 mobile 모두에서 핵심 정보와 action이 유지되어야 한다.
```

<a id="legacy-ui-200-f1"></a>
#### LEGACY-UI-200 / f1

- 원문: [docs/game-platform-ui-rules.md L363–363](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L363-L363); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C105.
- 승인된 적용/전환: responsive/계획책임 / 참조계승.
- 책임 의미: 공통작은화면접근; 원문 범위: 화면높이제한시불필요한상하스크롤강요금지.
- 검증 대응: V-D.

```text
- 화면 높이가 제한돼도 매 턴 불필요한 상하 스크롤을 강요하지 않는다.
```

<a id="legacy-ui-202-f0"></a>
#### LEGACY-UI-202 / f0

- 원문: [docs/game-platform-ui-rules.md L365–365](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L365-L365); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C105.
- 승인된 적용/전환: responsive/계획책임 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 핵심 숫자와 상태는 구성물이 겹쳐도 읽을 수 있는 위치를 우선한다.
```

<a id="legacy-ui-203-f0"></a>
#### LEGACY-UI-203 / f0

- 원문: [docs/game-platform-ui-rules.md L366–366](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L366-L366); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C105.
- 승인된 적용/전환: responsive/계획책임 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- hover에만 의존하는 핵심 interaction을 만들지 않는다.
```

<a id="legacy-ui-204-f0"></a>
#### LEGACY-UI-204 / f0

- 원문: [docs/game-platform-ui-rules.md L367–367](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-ui-rules.md#L367-L367); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C105.
- 승인된 적용/전환: responsive/계획책임 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- mobile에서 터치 target과 modal/overlay가 gameplay를 막지 않는지 검증한다.
```

## CO5 출시·회고·변경

release 전에 기능/디자인/검증 기록을 닫고 Status: RELEASED·Active branch: main·날짜 있는 release 기록 등 원 lifecycle 조건을 보존한다. 출시 후 회고·피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 분리한다. 공통변경은 topic-owner에 먼저 반영하고 상위는 요약/참조만 전파한다. 게임 수와 함께 구조이해비용/신규개발시간이 비례 증가하지 않도록 실제 반복 근거를 검토한다.

상위 충돌은 GV의 명시적 토의·ARCHITECTURE CHANGE·영향도/설계 게이트를 따른다. 기능목록을 자동 구현약속으로 바꾸지 않고 선제 보상/통계/공개자동화/audio/Profile 엔진을 만들지 않는다. 구현·activation·공개사건·공지/NEW 소비를 CA5대로 분리한다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-dev-176-f0"></a>
#### LEGACY-DEV-176 / f0

- 원문: [docs/game-platform-development-rules.md L332–332](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L332-L332); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C032.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
각 platform-native 게임을 출시한 뒤 구현 과정에서 나온 결정을 다음 세 종류로 다시 분류한다.
```

<a id="legacy-dev-177-f0"></a>
#### LEGACY-DEV-177 / f0

- 원문: [docs/game-platform-development-rules.md L334–334](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L334-L334); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C032.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. **SHARED 후보** — 인증, 권한, room/lobby, snapshot/reconnect, version/idempotency, invite, 공통 identity처럼 게임 규칙과 무관하게 반복될 플랫폼 책임
```

<a id="legacy-dev-178-f0"></a>
#### LEGACY-DEV-178 / f0

- 원문: [docs/game-platform-development-rules.md L335–335](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L335-L335); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C032.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. **GAME-LOCAL 유지** — 규칙, 상태 머신, 플레이 중 이탈 정책의 게임별 의미, 보드/주사위/연출처럼 해당 게임의 도메인 책임
```

<a id="legacy-dev-179-f0"></a>
#### LEGACY-DEV-179 / f0

- 원문: [docs/game-platform-development-rules.md L336–336](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L336-L336); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C032.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. **RELEASE-OPERATIONS 규칙** — production migration, capability activation, 문서 closeout, PR/브랜치 정리처럼 개발 lifecycle 책임
```

<a id="legacy-dev-180-f0"></a>
#### LEGACY-DEV-180 / f0

- 원문: [docs/game-platform-development-rules.md L338–338](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L338-L338); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C032.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
첫 게임 한 번에서 편리했다는 이유만으로 SHARED 후보를 즉시 공통 API로 승격하지 않는다. 다음 게임에서도 같은 책임이 반복되거나 플랫폼 경계상 명백히 공통인 경우에만 shared 코드/계약을 확장하며, 그때 계약 테스트와 이 규칙 문서를 함께 갱신한다.
```

<a id="legacy-dev-181-f0"></a>
#### LEGACY-DEV-181 / f0

- 원문: [docs/game-platform-development-rules.md L342–342](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L342-L342); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
Game Platform 규칙은 한 번 완성하고 고정하는 규칙집이 아니다. 신규 platform-native 게임을 실제로 구현하고 출시할 때마다 **그 게임에서 드러난 구조적 마찰을 근거로 갱신하는 살아 있는 개발 기준**으로 유지한다.
```

<a id="legacy-dev-182-f0"></a>
#### LEGACY-DEV-182 / f0

- 원문: [docs/game-platform-development-rules.md L344–344](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L344-L344); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
release closeout에서는 최소한 다음 질문을 다시 검토한다.
```

<a id="legacy-dev-183-f0"></a>
#### LEGACY-DEV-183 / f0

- 원문: [docs/game-platform-development-rules.md L346–346](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L346-L346); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
1. 기존 shared 계약을 그대로 재사용할 수 있었는가?
```

<a id="legacy-dev-184-f0"></a>
#### LEGACY-DEV-184 / f0

- 원문: [docs/game-platform-development-rules.md L347–347](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L347-L347); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
2. 게임마다 다시 구현한 코드나 판단이 있었는가?
```

<a id="legacy-dev-185-f0"></a>
#### LEGACY-DEV-185 / f0

- 원문: [docs/game-platform-development-rules.md L348–348](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L348-L348); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
3. 공통 책임인데 game-local workaround로 우회한 부분이 있었는가?
```

<a id="legacy-dev-186-f0"></a>
#### LEGACY-DEV-186 / f0

- 원문: [docs/game-platform-development-rules.md L349–349](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L349-L349); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
4. 기존 규칙이 불필요하게 복잡하거나 실제 개발 흐름을 방해한 부분이 있었는가?
```

<a id="legacy-dev-187-f0"></a>
#### LEGACY-DEV-187 / f0

- 원문: [docs/game-platform-development-rules.md L350–350](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L350-L350); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
5. 반대로 규칙이 부족해 파일 위치, 권위 모델, DB 경계, release 절차가 흔들린 부분이 있었는가?
```

<a id="legacy-dev-188-f0"></a>
#### LEGACY-DEV-188 / f0

- 원문: [docs/game-platform-development-rules.md L351–351](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L351-L351); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
6. 새 게임 추가로 탐색해야 할 경로·문서·예외가 불필요하게 늘어나지는 않았는가?
```

<a id="legacy-dev-189-f0"></a>
#### LEGACY-DEV-189 / f0

- 원문: [docs/game-platform-development-rules.md L352–352](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L352-L352); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
7. 다음 게임 개발자가 이전 게임의 내부 구현을 읽지 않고도 플랫폼 계약만으로 시작할 수 있는가?
```

<a id="legacy-dev-190-f0"></a>
#### LEGACY-DEV-190 / f0

- 원문: [docs/game-platform-development-rules.md L354–354](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L354-L354); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:예외; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
문제가 확인되면 단순히 문서에 예외를 하나 더 붙이는 것으로 끝내지 않는다. 먼저 기존 규칙을 단순화하거나 공통 계약을 정돈해서 **게임 수가 늘어도 구조 이해 비용과 신규 개발 시간이 비례해서 증가하지 않도록** 한다.
```

<a id="legacy-dev-191-f0"></a>
#### LEGACY-DEV-191 / f0

- 원문: [docs/game-platform-development-rules.md L356–356](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L356-L356); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
플랫폼 개선의 목표는 코드량 자체를 줄이는 것이 아니라 다음을 유지하는 것이다.
```

<a id="legacy-dev-192-f0"></a>
#### LEGACY-DEV-192 / f0

- 원문: [docs/game-platform-development-rules.md L358–358](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L358-L358); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 같은 종류의 파일과 책임이 예측 가능한 위치에 있다.
```

<a id="legacy-dev-193-f0"></a>
#### LEGACY-DEV-193 / f0

- 원문: [docs/game-platform-development-rules.md L359–359](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L359-L359); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 같은 플랫폼 문제는 같은 방식으로 해결한다.
```

<a id="legacy-dev-194-f0"></a>
#### LEGACY-DEV-194 / f0

- 원문: [docs/game-platform-development-rules.md L360–360](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L360-L360); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 새 게임이 기존 게임의 세부 구현을 복사하지 않아도 된다.
```

<a id="legacy-dev-195-f0"></a>
#### LEGACY-DEV-195 / f0

- 원문: [docs/game-platform-development-rules.md L361–361](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L361-L361); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 공통 변경의 영향 범위와 검증 방법을 빠르게 찾을 수 있다.
```

<a id="legacy-dev-196-f0"></a>
#### LEGACY-DEV-196 / f0

- 원문: [docs/game-platform-development-rules.md L362–362](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L362-L362); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- 게임 수가 늘어도 한 게임을 추가하기 위해 읽고 판단해야 하는 범위가 급격히 커지지 않는다.
```

<a id="legacy-dev-197-f0"></a>
#### LEGACY-DEV-197 / f0

- 원문: [docs/game-platform-development-rules.md L364–364](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L364-L364); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 절:MUST; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C033.
- 승인된 적용/전환: release/회고 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
따라서 **일관성 없는 빠른 구현보다 반복 가능한 구조를 우선**한다. 다만 미래를 추측한 과도한 추상화도 같은 비용을 만들 수 있으므로, 실제 신규 게임에서 반복해서 확인된 문제를 근거로 최소 범위에서 규칙과 shared 계약을 개선한다.
```

<a id="legacy-dev-386-f24"></a>
#### LEGACY-DEV-386 / f24

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: design/releasecloseout; 원문 범위: 코드블록순서24.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-386-f26"></a>
#### LEGACY-DEV-386 / f26

- 원문: [docs/game-platform-development-rules.md L761–788](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L761-L788); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 표현:검증; 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C057.
- 승인된 적용/전환: 모델별작은구현 / 참조계승.
- 책임 의미: 구현피드백분류; 원문 범위: 코드블록순서26.
- 검증 대응: V-D.

````text
```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>```
````

<a id="legacy-dev-425-f0"></a>
#### LEGACY-DEV-425 / f0

- 원문: [docs/game-platform-development-rules.md L838–838](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L838-L838); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C059.
- 승인된 적용/전환: releasecloseout / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; production DB 변경이 있다면 적용 이력과 권한 경계를 확인했다.
```

<a id="legacy-dev-426-f0"></a>
#### LEGACY-DEV-426 / f0

- 원문: [docs/game-platform-development-rules.md L839–839](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L839-L839); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C059.
- 승인된 적용/전환: releasecloseout / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 사용자에게 제공할 capability만 true로 활성화했다.
```

<a id="legacy-dev-427-f0"></a>
#### LEGACY-DEV-427 / f0

- 원문: [docs/game-platform-development-rules.md L840–840](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L840-L840); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C059.
- 승인된 적용/전환: releasecloseout / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 게임 목록/entry/invite 등 실제 노출 경로를 확인했다.
```

<a id="legacy-dev-428-f0"></a>
#### LEGACY-DEV-428 / f0

- 원문: [docs/game-platform-development-rules.md L841–841](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L841-L841); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C059.
- 승인된 적용/전환: releasecloseout / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; `DEVELOPMENT.md`가 `Status: RELEASED`, `Active branch: main`, 날짜가 있는 `## Release — YYYY-MM-DD` 기록을 가진다.
```

<a id="legacy-dev-429-f0"></a>
#### LEGACY-DEV-429 / f0

- 원문: [docs/game-platform-development-rules.md L842–842](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L842-L842); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C059.
- 승인된 적용/전환: releasecloseout / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 현재 상태와 모순되는 개발 중 문구를 정리했다.
```

<a id="legacy-dev-430-f0"></a>
#### LEGACY-DEV-430 / f0

- 원문: [docs/game-platform-development-rules.md L843–843](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L843-L843); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C059.
- 승인된 적용/전환: releasecloseout / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 통합되거나 대체된 PR을 닫고 불필요한 작업/임시 브랜치를 정리했다.
```

<a id="legacy-dev-431-f0"></a>
#### LEGACY-DEV-431 / f0

- 원문: [docs/game-platform-development-rules.md L844–844](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L844-L844); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C059.
- 승인된 적용/전환: releasecloseout / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 이후 유지보수는 최신 `main`에서 새 브랜치로 시작한다.
```

<a id="legacy-dev-432-f0"></a>
#### LEGACY-DEV-432 / f0

- 원문: [docs/game-platform-development-rules.md L845–845](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L845-L845); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C059.
- 승인된 적용/전환: releasecloseout / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
- &#91; &#93; 이번 게임에서 얻은 교훈을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 분류하고 필요한 플랫폼 문서/계약에 환류했다.
```

