# Game Platform vNext — 보드게임 하위 규칙

> **문서 분류:** CURRENT
> **적용 범위:** 신규 vNext (기존 consumer 제외)
> **계약 식별:** GP-GENRE-BOARD/1

상위 [AR](game-platform-architecture.md)의 보드 경험 하위 topic-owner다. 신규 vNext 보드 경험에 적용하며 다른 장르/기존 consumer에 보드 전제를 강제하지 않는다. 공통 개발 [CO](game-platform-common-rules.md), 수명 [LI](game-platform-lifetime-contract.md), 선택 모델 [MO](game-platform-model-contracts.md), 기능 [CA](game-platform-capability-contracts.md), 전파 [GV](game-platform-governance.md)를 참조한다. 기존 [development](game-platform-development-rules.md)/[UI](game-platform-ui-rules.md)/[DB](game-platform-db-test-contract.md)의 기존 scope·고정 원문은 유지한다.

승인 STEP5C 보드 논리 계승·STEP6 Target의 BO1~4와 전수 ID/f를 실제 반영한 문서다. 승인/검토 이력과 source trace는 [STEP7A2 기록](game-platform-rebuild/artifacts/step-7a2-source-trace.md)에서 구별한다. 문서의 계약 revision은 구현/API/wire 지원 버전이나 게임 행동 PASS가 아니다. 관련 정식 결과는 REVIEW_PENDING이며 최종 결과 검토·완료/병합/main/7A3 이후는 별도 게이트다.

## BO1 판본·출처·제품 조사

이 하위 규칙은 신규 vNext 보드 경험에 적용한다. 보드가 아닌 경험에 카드/판본/구성물을 가짜로 만들지 않는다. 조사·출처·권리의 일반 의무와 기록 방식은 [CO1](game-platform-common-rules.md)이 소유한다. 여기서는 실제 보드 제품과 구성물에 그 의무를 어떻게 적용하는지 정한다.

공개된 기존 보드게임을 구현하는 경우 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 문서를 우선 확인한다. 구현 규칙과 사용자 규칙 안내는 같은 해석을 사용한다. `GAME_SPEC.md`에는 출처와 구현상 해석 결정을 기록한다. 공개된 기존 보드게임이라는 조건을 모든 신규 장르의 외부 원본 존재 의무로 확대하지 않는다. 규칙 원문을 장문 복제하지 않는 기록 의무는 CO1을 참조한다.

공식/퍼블리셔 자료와 실제 구성물을 기준으로 카드·보드·칩 구조를 조사한다. 공식 또는 신뢰 가능한 시각 자료가 존재하면 텍스트만으로 VI를 확정하지 않고 실제 카드·보드·패키지·토큰 visual reference를 직접 확인한다. 실제로 존재하지 않는 구성물은 요구하지 않는다. 일반 색상·심볼·타이포그래피·분위기·자산 권리 조사는 CO1이 소유하며 같은 원문이 분할되었다고 별도 공통 엔진이나 두 규범 owner를 만들지 않는다.

목표 판본과 그 정체성, 여러 판본이 있다면 선택/혼합 방지 근거를 보드 적용 질문으로 확인한다. 원본의 가능한 확인 범위·날짜/판본 조건과 권리 불명확 자산 배제는 CO1을 따른다. 실제 규칙 해석은 GAME_SPEC, VI/자산 사용 가능 범위·출처→관찰→결정과 최초 adaptation은 UI_DESIGN에 기록한다. 확인되지 않은 규칙·권리를 추측하지 않는다. 특정 제품/판본/자산은 이 문서가 선택하지 않으며 개별 게임 조사에서 확인한다.

### 고정 원문·승인 조각 참조

f0는 원문전체·원부모/조건/예외의 참조 계승이다. 명시f는 지정 의미만 이 절이 소유하며 전체 원문인용은 출처/조건문맥이다. 원강도를 바꾸거나 다른 조각·예시·L/H/I를 새 의무로 승격하지 않는다. 상세 적용 대응은 [step-7a2-clause-correspondence](game-platform-rebuild/artifacts/step-7a2-clause-correspondence.md)를 따른다.

<a id="legacy-agent-038-f0"></a>
#### LEGACY-AGENT-038 / f0

- 고정 원문: [AGENTS.md L62–62](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/AGENTS.md#L62-L62); blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`; source 절 `Game Platform 신규 게임 필수 규칙`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C006`.
- 승인 적용/전환: 원문조건;상위진입은실제전환뒤 / 참조전환.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `f380db59ee046e5d75f43698b6cce4fd9ca24fddb4138bd6f3a2c43c0e8313cc`; 검증 대응 V-D/C.

```text
- 공개된 기존 보드게임을 구현하는 경우 공식 규칙서나 신뢰 가능한 규칙 출처를 우선 확인하고 `GAME_SPEC.md`에 출처와 해석 결정을 남깁니다. UI는 공식/퍼블리셔 자료와 실제 구성물을 조사하고 `UI_DESIGN.md`에 디자인 출처, 목표 판본, Visual Identity, 저작권·라이선스 판단과 구현 계획을 기록합니다. 확인되지 않은 규칙이나 자산 사용 권리는 추측하지 않습니다.
```

<a id="legacy-dev-036-f2"></a>
#### LEGACY-DEV-036 / f2

- 고정 원문: [docs/game-platform-development-rules.md L66–66](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-development-rules.md#L66-L66); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`; source 절 `3A. 신규 게임 초기 세팅과 설계 문서`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C015`.
- 승인 적용/전환: 조사/선택경험조건 / 참조계승.
- 이 절의 의미 조각: 실물보드경험조사; 지정 범위: 실제구성물·카드/보드/칩구조 조사.
- 원문 SHA256 `28c72a30a810fbe16656d7faaba0725882758be957b38a78176d2801d01372b6`; 검증 대응 V-D.

```text
2. 공식/퍼블리셔 자료와 실제 구성물을 기준으로 색상, 심볼, 카드/보드/칩 구조, 레이아웃, 타이포그래피, 분위기와 자산 사용 가능 범위를 조사한다.
```

<a id="legacy-dev-044-f1"></a>
#### LEGACY-DEV-044 / f1

- 고정 원문: [docs/game-platform-development-rules.md L75–75](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-development-rules.md#L75-L75); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`; source 절 `3A. 신규 게임 초기 세팅과 설계 문서`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C015`.
- 승인 적용/전환: 조사/선택경험조건 / 참조계승.
- 이 절의 의미 조각: 공개보드게임출처조건; 지정 범위: 제1문장: 공개된기존보드게임인경우…규칙문서우선확인.
- 원문 SHA256 `d1b77af58d1203a69711ae2eb28e9b19860883af88b7f3313a4c70abe296f5cd`; 검증 대응 V-D.

```text
공개된 기존 보드게임을 웹게임으로 구현하는 경우 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 문서를 우선 확인한다. `GAME_SPEC.md`에는 사용한 출처와 구현상 해석 결정을 남긴다. 규칙 원문을 장문 복제하지 않고 구현에 필요한 사실과 결정만 요약한다.
```

<a id="legacy-dev-288-f0"></a>
#### LEGACY-DEV-288 / f0

- 고정 원문: [docs/game-platform-development-rules.md L568–568](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-development-rules.md#L568-L568); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`; source 절 `10A. 게임 규칙 안내와 게임 종료 > MUST: 게임 규칙 안내`.
- 원강도: 절:MUST; 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C044`.
- 승인 적용/전환: 규칙안내 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `5c697f8436a54175d545c8f6296922f43174e4ec1d92b20f6391f0c47ce54d04`; 검증 대응 V-D.

```text
- 공개된 기존 보드게임은 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 출처를 먼저 확인하고 구현 규칙과 사용자 안내가 같은 해석을 사용해야 한다.
```

<a id="legacy-ui-011-f2"></a>
#### LEGACY-UI-011 / f2

- 고정 원문: [docs/game-platform-ui-rules.md L26–26](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L26-L26); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `2. 신규 게임 개발 전 UI 조사`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C082`.
- 승인 적용/전환: 조사/권리/선택판본 / 참조계승.
- 이 절의 의미 조각: 보드실물시각조사; 지정 범위: 카드·보드·패키지·토큰visualreference.
- 원문 SHA256 `c05751795440f610c37a6fb8bd4471c9775358766234df2f724eeb41b8b142bc`; 검증 대응 V-D.

```text
- 공식 또는 신뢰 가능한 시각 자료가 존재하면 텍스트 설명만으로 Visual Identity를 확정하지 않고 실제 카드·보드·패키지·토큰 등 visual reference를 직접 확인한다.
```

## BO2 실물 공간·구성물·웹 해석

웹 UI는 실제 게임에서 플레이어가 정보를 읽고 구성물을 다루는 방식을 조사해 가능한 범위에서 반영한다. 중앙 공용 영역, 개인 영역, 카드/칩의 쌓임·겹침, 공개/비공개 정보의 시각적 구분, 보드의 진행 방향·상태 읽기는 해당 게임에 존재할 때 확인할 예다. 원문의 예시 도입 `LEGACY-UI-171`은 문맥(I)이며 이 목록을 모든 게임의 필수 중앙 보드/카드/DOM으로 승격하지 않는다.

카드 비율과 실제 공간/구성물 배치는 보드 경험의 해석 대상이다. 일반 정보 가독성과 접근·반응형 조건은 [CO4](game-platform-common-rules.md), 전달되는 공개/비공개 상태의 권한은 [MO3](game-platform-model-contracts.md)가 소유한다. 시각적 가림은 private-state 전달권한 집행을 대신하지 않는다.

원본 배치를 그대로 복제하는 것이 가독성을 해치면 웹 환경에 맞게 재구성할 수 있다. 이 허용을 원작 배치의 일괄 복제나 일괄 변경 의무로 바꾸지 않는다. 최초 계획과 개발 이후 유효 override의 기록/정정 예외는 [CO2](game-platform-common-rules.md)를 따른다. 실제 공간 배치는 game-local UI_DESIGN/유효 UI_DECISIONS가 소유한다. 어떤 renderer·DOM·camera·physics를 사용할지는 장르명으로 확정하지 않는다.

### 고정 원문·승인 조각 참조

f0는 원문전체·원부모/조건/예외의 참조 계승이다. 명시f는 지정 의미만 이 절이 소유하며 전체 원문인용은 출처/조건문맥이다. 원강도를 바꾸거나 다른 조각·예시·L/H/I를 새 의무로 승격하지 않는다. 상세 적용 대응은 [step-7a2-clause-correspondence](game-platform-rebuild/artifacts/step-7a2-clause-correspondence.md)를 따른다.

<a id="legacy-ui-015-f2"></a>
#### LEGACY-UI-015 / f2

- 고정 원문: [docs/game-platform-ui-rules.md L30–30](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L30-L30); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `2. 신규 게임 개발 전 UI 조사`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C082`.
- 승인 적용/전환: 조사/권리/선택판본 / 참조계승.
- 이 절의 의미 조각: 카드경험조사; 지정 범위: 카드비율.
- 원문 SHA256 `1be24653ffeabdb4f378fea9089ec64949ac431cc1f37f2ebc7aff24fc282fbd`; 검증 대응 V-D.

```text
- 숫자/정보의 배치, 카드 비율, 타이포그래피 분위기
```

<a id="legacy-ui-170-f0"></a>
#### LEGACY-UI-170 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L313–313](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L313-L313); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `7. 실제 보드게임의 공간 구조 반영`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C102`.
- 승인 적용/전환: 실물경험/예시비승격 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `a912b74ed12bf5fd6cb8ae503b7f618c43aba64f958dfbba41a6242a30439583`; 검증 대응 V-D.

```text
웹 UI는 실제 게임에서 플레이어가 정보를 읽고 구성물을 다루는 방식을 조사해 가능한 범위에서 반영한다.
```

<a id="legacy-ui-172-f0"></a>
#### LEGACY-UI-172 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L317–317](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L317-L317); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `7. 실제 보드게임의 공간 구조 반영`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C102`.
- 승인 적용/전환: 실물경험/예시비승격 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `ce039ec8f7d4d5f2d12ad0cacc51f5a34da2023ef11ea5050d3050e3a119e8c6`; 검증 대응 V-D.

```text
- 중앙 공용 영역
```

<a id="legacy-ui-173-f0"></a>
#### LEGACY-UI-173 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L318–318](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L318-L318); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `7. 실제 보드게임의 공간 구조 반영`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C102`.
- 승인 적용/전환: 실물경험/예시비승격 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `f453f7d3356e32ee3ae67e538b16c69e060593f7e5a570d2fc0d74053c184126`; 검증 대응 V-D.

```text
- 개인 플레이어 영역
```

<a id="legacy-ui-174-f0"></a>
#### LEGACY-UI-174 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L319–319](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L319-L319); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `7. 실제 보드게임의 공간 구조 반영`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C102`.
- 승인 적용/전환: 실물경험/예시비승격 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `ce273cfa8a3d19e4d55b0f67874abc3c11645cb4889e46d6afd1e61fb2a55fe4`; 검증 대응 V-D.

```text
- 카드/칩이 실제로 쌓이거나 겹치는 방식
```

<a id="legacy-ui-175-f0"></a>
#### LEGACY-UI-175 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L320–320](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L320-L320); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `7. 실제 보드게임의 공간 구조 반영`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C102`.
- 승인 적용/전환: 실물경험/예시비승격 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `c935d0346c44a39c6297b82062dcf54fea5b8d729b15615d33149f47b72dce99`; 검증 대응 V-D.

```text
- 공개 정보와 비공개 정보의 시각적 구분
```

<a id="legacy-ui-176-f0"></a>
#### LEGACY-UI-176 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L321–321](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L321-L321); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `7. 실제 보드게임의 공간 구조 반영`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C102`.
- 승인 적용/전환: 실물경험/예시비승격 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `c248bf1214d1bb633a2993c2c89dc1d0f2af116ccdee978cc1a8934d9a2f2aa3`; 검증 대응 V-D.

```text
- 보드에서 진행 방향과 상태를 읽는 방식
```

<a id="legacy-ui-177-f1"></a>
#### LEGACY-UI-177 / f1

- 고정 원문: [docs/game-platform-ui-rules.md L323–323](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L323-L323); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `7. 실제 보드게임의 공간 구조 반영`.
- 원강도: 표현:할 수 있다; 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C102`.
- 승인 적용/전환: 실물경험/예시비승격 / 참조계승.
- 이 절의 의미 조각: 보드웹adaptation허용; 지정 범위: 원본배치가가독성을해치면웹재구성가능.
- 원문 SHA256 `4de6d692f5991768b8df2bc1bb374c60006ce9cbb3dcac3d49600eb9d84e2e94`; 검증 대응 V-D.

```text
원본 배치를 그대로 복제하는 것이 가독성을 해치면 웹 환경에 맞게 재구성할 수 있다. 최초 adaptation 계획은 `UI_DESIGN.md`에 두고, 개발 시작 후 실제 브라우저 검토로 그 배치를 수정했다면 최신 유효 결정과 이유를 `UI_DECISIONS.md`에 남긴다.
```

## BO3 세션·권위·복구·재대결 모델 연결

보드 규칙은 세션/권위/순서·복구 엔진을 소유하지 않는다. 실제 적용 모델을 [MO1~4](game-platform-model-contracts.md)에 연결하고, 공통 완료·자원 수명은 [LI1~3](game-platform-lifetime-contract.md)를 참조한다. 보드라는 이유로 Room/host/online/DB를 강제하거나 온라인 안전을 면제하지 않는다.

| 실제 적용 조건 | 단일 본문 / 적용 질문 | 유지할 경계 |
|---|---|---|
| Room/session 온라인 multiplayer, 현재 Room Adapter 채택 | MO2 및 [기존 development §6](game-platform-development-rules.md)의 8개 surface 의미·ready/start를 확인 | 8개 모두 실제 의미 필요. RPC 이름은 비고정; 불일치는 최소 분리/확장 판단으로 반환. no-op/local 우회 금지 |
| 신규 vNext 온라인 | MO3의 안전11·현재 A/C/P, 실제 권위/인가와 모델 검증 경로 | 7B oracle/discovery 준비 전 runtime admission 미지원. 하위 보드 규칙만으로 기존 온라인 안전 검사 제거 금지 |
| 실제 DB/RPC 모델 | MO3/4 및 [기존 DB 계약](game-platform-db-test-contract.md), 원 development §7/§9 | DB 상세·version/idempotency/invalidation의 원 적용 범위 유지. 기존 consumer/SQL 무이관 |
| 승인 범위 비DB/stream | MO3/4의 동등 안전·checkpoint/tail/gap/quiet loss·권위/복구와 해당 모델 oracle | SQL/정수 version을 형식으로 강제하지 않으나 안전성/복구 면제 없음. 구현/실행 증거는 후속 |
| snapshot/reconnect·전환/이탈 | MO4 단일 최종 채택/복구 + LI 전체 완료/T01~03 | 같은 Room 새 Match·A→B→A·role/view/user에서 room ID/숫자 version만으로 현재성 확정 금지 |
| 실제 multiplayer 재대결 | MO2의 same-context·준비/host 시작·초기화·safe leave/필요 승계·서버 조건/복구와 원 DB/UI 연결 | 새 방/코드 재입력 강제로 원 의무를 대체하지 않음. product/모델 의무를 보드 전용으로 축소하지 않음 |
| 초기 hostless, 재대결 host 의미 성립 | MO2/승인 STEP6 §4.2 | 초기 시작은 실제 권위 조건; 재대결 ready/host/start 의무 유지 |
| 재대결에도 host 의미 불성립 | [승인 Target §4.2](game-platform-rebuild/artifacts/step-6-target-architecture.md)·GV Architecture Change | 별도 상위 의미/대체 사용자 의사·시작 권위·공정성·이탈/복구·영향도 승인 전 해당 조합 blocker |
| multiplayer 정책 미정 | 실제 GAME_SPEC/선택 모델에서 구현 전에 닫음 | N/A/면제가 아님. 플랫폼 전체 blocker로 확대하지 않음 |
| 실제 pure local solo | run 수명/안전 종료/새 run 격리와 실제 모델 | Room/host/ready/온라인 RPC/multiplayer 재대결은 실제 의미상 비적용 가능 |

이 표는 모델 계약의 적용 안내이며 새 인가·순서·수명·정리 규칙의 독립 본문이 아니다. BO3의 승인 계승은 다른 owner 참조로 성립하며 별도 BO3 직접 ID가 없다는 이유로 모델 본문을 복제하지 않는다. [MO3](game-platform-model-contracts.md)의 known expiry 뒤 새 A 금지·동일 transaction late C 제한/실제 C·fresh P/retry·owner anchor·최초60초/terminal·부분 대체와 [MO6](game-platform-model-contracts.md)의 D0006~10 UNKNOWN은 유지된다.

복구 문구는 STEP6 정정을 사용한다. `LEGACY-DEV-271`은 Realtime 이벤트순서·전달 성공만으로 복구하지 않는 원 의무이고, payload를 최종 진실로 취급하지 않는 직접 원문은 `LEGACY-DEV-251`이다. 두 의미의 실제 owner는 MO3/4 및 해당 DB/원 source이며 요약의 ID 혼동을 새 규칙으로 재발행하지 않는다. 기존 B08 원본은 이력으로 보존한다.

세션 종료의 사용자 의미는 CO4, authoritative terminal과 후속 이탈은 MO2/LI2를 참조한다. 브라우저 close를 경기 종료로 보지 않는다. 실제 backend 집행·복구·두 client 검증은 NOT_RUN/후속 의무이며 문서 연결이 지원 완료를 뜻하지 않는다.

## BO4 피드백·검증·네 문서 추가 질문

규칙 안내의 공통 목표/접근/안전 종료는 [CO4](game-platform-common-rules.md)를 따른다. 보드에서는 실제 구성요소·턴 순서·가능한 선택·실패/패널티·종료/승리 조건·대표 예시를 처음 읽고 플레이할 수 있도록 설명한다. 없는 턴/승자/점수를 만들어 넣지 않는다. 공개된 기존 보드게임의 사용자 안내와 구현 해석 일치는 BO1을 적용한다.

게임의 핵심 행동은 값만 즉시 바꾸는 방식보다 실제 구성물이 움직인다는 감각을 우선 검토한다. 카드 공개/뒤집기/이동, 칩·토큰 지불/획득, 주사위, 말, 돈/자산, 턴 전환, 큰 점수·중요 행동, 종료/승자 발표는 해당 경험의 예다. `LEGACY-UI-179`의 예시(I) 문맥을 유지하여 모든 보드에 해당 구성물/승자/animation 엔진을 강제하지 않는다. 많은 카드/토큰 등은 겹침·축약·scroll area 등 게임에 맞는 표현을 설계하고, 실제 턴이 있는 경우 화면 높이 때문에 매 턴 불필요한 상하 스크롤을 강요하지 않는 관측 조건을 유지한다.

일반 핵심 정보/action·작은 화면/터치·hover 의존/overlay·잠정 피드백과 확정 상태는 CO4/MO4를 참조한다. 실제 표현·VI/곡/결과 연출은 game-local, Shell 공통 표시는 [CA1](game-platform-capability-contracts.md)이다. 공식 결과/참여자 outcome/관람자 표현·정정과 여섯 중복 의미/효과 소비는 [CA4](game-platform-capability-contracts.md), BGM H1은 CA3, Invite 전 구간 identity/사이트 handler/dialog H2~4는 CA2를 따른다. 예측 결과·같은 snapshot 재적용을 확정 보상/효과 재발행 근거로 쓰지 않는다. winner/score/XP/공통 결과 화면을 전게임 필수로 만들지 않는다.

| 네 문서 / 단일 책임 | 보드 추가 질문 / 실제 기록 | 재정의하지 않을 것 |
|---|---|---|
| GAME_SPEC | 실제 제품/판본·규칙 출처/해석·공간/구성물·규칙 안내, 적용 장르 `GP-GENRE-BOARD/1`, 선택 모델/기능·비적용/미지원·미정 이유 | 기능 현재 기준. UI baseline이나 진행 상태를 독립 복제하지 않음 |
| DEVELOPMENT | 관련 BO/공통/모델 적용의 구현 진행·원문/계약/실제 실행 증거·다음 행동 | 기능 인수인계. 원칙/설계 TODO를 중복 소유하지 않음 |
| UI_DESIGN | 실제 visual reference/구성물/정보공간·판본/VI·최초 웹 adaptation·보드 관측/검증 계획 | 개발 전 baseline. 이후 변경으로 덮어쓰지 않음 |
| UI_DECISIONS | 개발 이후 실제 배치/interaction·브라우저 수동 관측의 안정화된 결정/대안/이유/검증·유효 override | CO2/3의 lifecycle 기록·정정 예외·SUPERSEDED/REVERTED와 manual gate 적용 |

조사→네 문서 bootstrap→실제 모델 연결→작은 구현/검증·수동 디자인 검토의 절차는 [CO1~3](game-platform-common-rules.md), 전파/충돌 절차는 [기존 GV](game-platform-governance.md)가 소유한다. 기능 자동 검증은 실제 브라우저 Developer Manual Design Review / Detail Polish를 대신하지 않는다. 구성물/공간/행동 이해와 피드백, 안내/종료·선택된 lifecycle의 관측을 추가 질문으로 연결하고 모든 CSS 수치/요청 횟수를 decision으로 강제하지 않는다.

문서/Guard 검증, 계약·fault 검증, 실제 지원 단말/수동 플레이·DB/두 client·성능·운영 증거는 각각 구별한다. 동일 ID 개수/문서 존재/CI 성공만으로 게임 행동·지원/오픈 완료를 표시하지 않는다. 실제 제품/판본/renderer·효과 정책/단말 관측은 game-local 후속 선택/검증이고 UNKNOWN을 남긴다. 실제 새 상위 충돌은 원 ID/줄/f·owner·누락 의미·영향만 GV 절차로 반환한다. Adapter 안의 새 엔진, 장르명 기술 선택, 기존 game-local 이관은 허용하지 않는다.

### 고정 원문·승인 조각 참조

f0는 원문전체·원부모/조건/예외의 참조 계승이다. 명시f는 지정 의미만 이 절이 소유하며 전체 원문인용은 출처/조건문맥이다. 원강도를 바꾸거나 다른 조각·예시·L/H/I를 새 의무로 승격하지 않는다. 상세 적용 대응은 [step-7a2-clause-correspondence](game-platform-rebuild/artifacts/step-7a2-clause-correspondence.md)를 따른다.

<a id="legacy-dev-287-f2"></a>
#### LEGACY-DEV-287 / f2

- 고정 원문: [docs/game-platform-development-rules.md L567–567](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-development-rules.md#L567-L567); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`; source 절 `10A. 게임 규칙 안내와 게임 종료 > MUST: 게임 규칙 안내`.
- 원강도: 절:MUST; 표현:조건; 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C044`.
- 승인 적용/전환: 규칙안내 / 참조계승.
- 이 절의 의미 조각: 해당보드/제품의실제규칙설명;없는개념비강제; 지정 범위: 구성요소·턴순서·승리조건.
- 원문 SHA256 `e4e32069223d609e80a0a1d5cc247b975cb00fb31d1b118efce7ea8be8fa7e97`; 검증 대응 V-D.

```text
- 규칙 안내는 처음 플레이하는 사용자가 읽고 바로 플레이할 수 있을 정도로 목표, 구성요소, 턴 순서, 가능한 선택, 실패/패널티, 종료/승리 조건, 대표 예시를 충분히 설명한다.
```

<a id="legacy-ui-178-f0"></a>
#### LEGACY-UI-178 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L327–327](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L327-L327); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `8. 모션과 행동 피드백`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C103`.
- 승인 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `a0ea486807ad316a3e7ee9492550f6c6710a67fb18c689ff32672656d89826a7`; 검증 대응 V-D.

```text
게임의 핵심 행동은 상태 값만 즉시 바뀌는 방식보다 실제 구성물이 움직인다는 감각을 우선 검토한다.
```

<a id="legacy-ui-180-f0"></a>
#### LEGACY-UI-180 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L331–331](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L331-L331); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `8. 모션과 행동 피드백`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C103`.
- 승인 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `f4c8dcf9f0b4e1f64ab1c3a861ae592b4d0faa0776070f1a8b877b83028bcdc8`; 검증 대응 V-D.

```text
- 카드 공개 / 뒤집기 / 이동
```

<a id="legacy-ui-181-f0"></a>
#### LEGACY-UI-181 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L332–332](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L332-L332); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `8. 모션과 행동 피드백`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C103`.
- 승인 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `3c30882fb547577919cdd81afb288763a01d973f45ee990c1705f8d527e7aec6`; 검증 대응 V-D.

```text
- 칩 또는 토큰 지불과 획득
```

<a id="legacy-ui-182-f0"></a>
#### LEGACY-UI-182 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L333–333](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L333-L333); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `8. 모션과 행동 피드백`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C103`.
- 승인 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `9ad5f86a63e362fa54531912bfee4f1b634fa4271ac676ac565c5f9374ccc6b9`; 검증 대응 V-D.

```text
- 주사위 굴림
```

<a id="legacy-ui-183-f0"></a>
#### LEGACY-UI-183 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L334–334](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L334-L334); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `8. 모션과 행동 피드백`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C103`.
- 승인 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `fbcaaf4d657e616d0b7ce7cb03112cb2c79c0682f9559eeb325e85b61e6ccbc5`; 검증 대응 V-D.

```text
- 말 이동
```

<a id="legacy-ui-184-f0"></a>
#### LEGACY-UI-184 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L335–335](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L335-L335); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `8. 모션과 행동 피드백`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C103`.
- 승인 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `a31bcbc6017a5a48b644a7c376ff7513b9ef1a3bf6dd021e7515adae500dea14`; 검증 대응 V-D.

```text
- 돈/자산 이동
```

<a id="legacy-ui-185-f0"></a>
#### LEGACY-UI-185 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L336–336](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L336-L336); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `8. 모션과 행동 피드백`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C103`.
- 승인 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `4ff58138ddf29c9e24a99773b9e536ea83c098fa745f48a4625576b6952be1e7`; 검증 대응 V-D.

```text
- 턴 전환
```

<a id="legacy-ui-186-f0"></a>
#### LEGACY-UI-186 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L337–337](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L337-L337); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `8. 모션과 행동 피드백`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C103`.
- 승인 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `eb389cb57ad3b934f8a097958352e64a0b54b98128d3c92cebbc9a708c9240b9`; 검증 대응 V-D.

```text
- 큰 점수/중요 행동 피드백
```

<a id="legacy-ui-187-f0"></a>
#### LEGACY-UI-187 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L338–338](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L338-L338); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `8. 모션과 행동 피드백`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C103`.
- 승인 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `b93b7ad8939b1f43623bc356e3e8e9914852092d05766f974af5db8897566a6b`; 검증 대응 V-D.

```text
- 게임 종료와 승자 발표
```

<a id="legacy-ui-194-f0"></a>
#### LEGACY-UI-194 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L353–353](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L353-L353); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `9. 결과와 재대결 presentation`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C104`.
- 승인 적용/전환: 피드백/결과/조건부재대결 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `b5581cfbaa956eae3f7805089f48462db78f95585c21340649d0d248c5706c34`; 검증 대응 V-D.

```text
- 승자 또는 공동 승자
```

<a id="legacy-ui-200-f2"></a>
#### LEGACY-UI-200 / f2

- 고정 원문: [docs/game-platform-ui-rules.md L363–363](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L363-L363); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `10. Responsive 기준`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C105`.
- 승인 적용/전환: responsive/계획책임 / 참조계승.
- 이 절의 의미 조각: 턴형경험에서의적용; 지정 범위: 매턴이라는관측단위.
- 원문 SHA256 `4e926c75701bb2fcd43ad5a44245203eb4fb4acb7d94a912e7344f40410a9144`; 검증 대응 V-D.

```text
- 화면 높이가 제한돼도 매 턴 불필요한 상하 스크롤을 강요하지 않는다.
```

<a id="legacy-ui-201-f0"></a>
#### LEGACY-UI-201 / f0

- 고정 원문: [docs/game-platform-ui-rules.md L364–364](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md#L364-L364); blob `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; source 절 `10. Responsive 기준`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 도입/형제 문맥 유지; 조건/예외 `C105`.
- 승인 적용/전환: responsive/계획책임 / 참조계승.
- 이 절의 의미 조각: 원문전체+원부모/조건/예외; 지정 범위: 원문전체 f0.
- 원문 SHA256 `ac0323b6e56c14d7a9110be8f6ab7a8dc974c9382f42a4b1ded28a4e5c2867dc`; 검증 대응 V-D.

```text
- 많은 카드/토큰 등은 겹침, 축약, scroll area 등 게임에 맞는 표현을 설계한다.
```
