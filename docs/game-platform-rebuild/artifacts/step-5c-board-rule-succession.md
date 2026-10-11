# STEP5C — 보드 규칙 논리 계승과 DB·hostless 적용 조건

- 상태: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-11 21:13:17 KST 사용자 메시지로 Astra §9.1 여섯 묶음 전체를 본문의 조건·제한·미확인까지 승인하고 정식 문서 반영·검증·integration base PR 제출을 명시적으로 허용했다. STEP5C **REVIEW_PENDING**, 사용자 정식 결과 최종 검토는 남아 있다.
- 판단 원문: [Astra](game-platform-vnext-step5c-astra-judgment.md), 사실 입력: [Sol 근거](game-platform-vnext-step5c-evidence.md), 계획: [계획/인계](game-platform-vnext-step5c-plan-and-handoff.md). 승인 판단을 Sol/Codex가 다시 수행하지 않았다.
- 아래 원문 절은 내용·절번호를 그대로 반영한다. 원문의 PROPOSED·승인 대기/전·NOT_STARTED·직접 읽기·다음 첫 작업은 Astra 작성 당시 상태/행위다. 현재 승인·제출 상태는 이 헤더, [CURRENT](../CURRENT.md), [CP0085](../checkpoints/CP-0085-step-5c-formal-submitted.md), [문서 검증](step-5c-validation.md)을 따른다. 원문의 적용 조건·예외·강도·보류·미확인은 유지한다. J는 지금 승인된 판단이며 새 현재 rulebook 적용 완료를 뜻하지 않는다.
- 고정 판단/착수 SHA `2751e9241a3debbd40506fa1b2ea7e688dfe0140`; STEP5B **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED**. 행동 **NOT_RUN**, 기존 **UNKNOWN**·구현/실행/오픈 의무 유지. 기존 Auth/게임 무이관.
- 정식 대응: [§2~4 보드 계승·조건표](step-5c-board-rule-succession.md), [§5 비보드 최소6항목/R01~13](step-5c-realtime-coop-spatial-rules.md), [§6~8 둘째 Probe·연결/추가·보존/의무](step-5c-genre-model-connections.md), [§1/9/10 입력·승인·trace](step-5c-source-trace.md). 각 의미는 해당 절의 단일 본문을 참조한다. 원본 §11의 실행 프롬프트/게이트는 원본에 보존하며 재실행하지 않는다.
- STEP2 49조항/B01~12는 전수 계승 완료가 아니다. STEP6/7의 전수 목적지·권위 전환 의무, Target/API/schema/file/class/코드경로 미동결 유지. PR 제출은 단계 완료·병합·main·STEP6 허용이 아니다.

## 2. 핵심 판단과 논리적 책임 원칙

| 판단 ID | J 선택 | 이유와 한계 |
|---|---|---|
| S5C-J01 | 보드 계승은 B01~12의 의미 조각을 나누고 각 조각의 단일 owner를 참조 | 기존 파일 전체를 보드 전용 또는 공통으로 옮기면 권리·문서·안전성 누락이나 보드 표현 강제가 생김. 실제 경로·전수 목적지는 STEP6/7 |
| S5C-J02 | 실시간 협동·공간형에 §5의 여섯 항목과 S5C-R01~13을 내용 초안으로 채택 제안 | 입력 지속/취소·공간·시간·복귀·역할·잠정 표현은 보드 구성물 규칙의 이름 교체로 설명되지 않음. 구체 게임/엔진은 미선택 |
| S5C-J03 | 둘째 Probe는 경험 차이를 기준으로 재사용·보완·신설을 판단 | roomless/local/비동기/기록형은 그 자체로 새 장르명이나 새 Core의 근거가 아님. 실제 제품을 지금 선택하지 않음 |
| S5C-J04 | 같은 의무의 본문은 한 owner, 인덱스·장르·GAME_SPEC는 적용 조건과 참조 | 장르와 실행 모델은 상속 관계가 아님. 혼합 장르도 계약의 동시 충족 가능성을 검토 |
| S5C-J05 | DB 동등 안전성과 초기/재대결 hostless를 §4의 조건으로 연결 | 기존 온라인 범위·재대결 의무를 하위 문서에서 면제하지 않음. 승인 설계 연결과 후속 CURRENT 권위 전환을 구별 |
| S5C-J06 | 문서 설계 판단과 실제 실행 입증을 분리하고 §9의 승인 범위만 다음 정식 반영 입력으로 사용 | 미선택 미래 기능이나 NOT_RUN을 포괄 설계 HOLD로 만들지 않음. 실제 상위 충돌은 그 선택에 한정해 차단 |

이 표의 owner는 **규칙/소프트웨어 책임**이다. Astra/Sol은 작업 담당 구분이며 런타임 owner가 아니다. 다음 논리 이름은 파일명·class·API·Target의 동결이 아니다.

| 논리 책임 | 단일 본문이 소유할 의미 | 참조하는 곳 |
|---|---|---|
| 공통 개발·품질 | 조사 수준, 출처/권리, 네 문서 시간축, 작은 구현/검증, 수동 디자인 gate, 기록/closeout | 모든 장르 규칙, 게임 네 문서, 진입 안내 |
| 공통 플랫폼·안전성 | 등록/접근/수명 invariant, 적용 권위 모델의 안전성 요구, 상위 변경 절차 | 장르·모델·Capability. 구체 인가/순서/복구 구현은 해당 모델/backend |
| 보드 경험 규칙 | 판본과 규칙 해석, 실제 구성물·정보 공간·행동 표현, 웹 adaptation의 조건 | 신규 보드게임. 공통 절차와 모델 계약은 링크로 적용 |
| 실시간 협동·공간 경험 규칙 | 지속 입력/취소, 공간 이해, 반응·중단/복귀 경험, 협동 피드백과 검토 기준 | 첫 비보드 Probe, 추후 범위가 맞는 게임 |
| 선택 Runtime Model | 시간/진행, 세션/참여, 권위/순서/복구, 입력·공간 연결, 지속성의 선택된 의미와 검증 | 여러 장르가 같은 모델을 참조 가능. 장르 독점 아님 |
| Capability / Site Adapter | 승인 STEP5A/B의 선택 기능 본체와 사이트 연결 책임 | 실제 선택 consumer만 연결. 새 인가/순서/수명/token/audio 엔진을 Adapter에 숨기지 않음 |
| game-local | 실제 규칙·상태·콘텐츠·VI·조작/카메라·결과 유무·정책 값과 구현 근거 | GAME_SPEC / UI_DESIGN / 유효 UI_DECISIONS. DEVELOPMENT는 진행/검증 인수인계 |

## 3. 보드게임 조항 계승 설계

### 3.1 읽는 법과 보존 단위

아래 `DEV-nnn`, `UI-nnn`, `DB-nnn`, `GOV-nnn`, `GUIDE-nnn`은 각각 **`LEGACY-`가 붙은 STEP1 원문 ID의 축약**이다. LEGACY prefix는 기존 조항 식별자이며 Legacy 게임에만 적용된다는 뜻이 아니다. 각 범위는 sibling과 부모 도입문을 포함한다. 정확한 원문·source 줄·강도는 근거 §11.3 및 고정 STEP1 [platform 조항표](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md), [design 조항표](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md)가 소유한다. 아래 요약을 원문 대신 현재 규칙으로 사용하지 않는다.

강도의 `서술형`, `표현:검증/조건/예외/할 수 있다`, `REQUIRED_SHAPE`, `CONTEXT/I`를 모두 MUST로 재기록하지 않는다. 부모 MUST 안의 세부 문장과 명시 MUST NOT/SHOULD의 차이를 보존한다. K는 원래 범위 계승, L은 game-local, H는 이력, I는 문맥이라는 STEP1 구분을 유지한다. 동일 원문이 둘 이상의 묶음에 등장하면 여러 새 본문을 만드는 것이 아니라 동일 조항의 분할·참조다.

### 3.2 B01~12 — 책임, 분할, 조건 및 미확인

| 묶음 / 원문 ID·부모·강도 | J 논리적 계승·분할/참조 | A 보존할 의미·조건·예외 / U 남은 것 |
|---|---|---|
| **B01 조사·개발 순서**: DEV-035~044, DEV-386; UI-010/011/015. development §3A·§15, UI §2. DEV-035~044 대부분 서술형, 039/041 표현:검증; DEV-386 REQUIRED_SHAPE/표현:검증; UI 세 항목 서술형 | 조사→제품/규칙·VI/자산→네 문서→작은 구현/검증→수동 검토는 공통 개발 owner. DEV-036의 실물 카드/보드/칩 조사와 DEV-044의 공개 보드 규칙 출처는 보드 owner의 추가 조사로 분할. DEV-386의 Room/online/stateful/action 등 조건은 해당 모델 참조. game-local이 실제 출처·범위·해석 결정 기록 | 원본 규칙·실제 visual reference와 권리 불명확을 추측하지 않음. DEV-044는 **공개된 기존 보드게임** 조건을 유지. §15를 장르와 무관한 DB·Room 필수 순서로 바꾸지 않음. U 실제 보드 제품·판본은 해당 게임 조사 |
| **B02 판본·출처·자산**: DEV-044/288; UI-027~032. development §3A/§10A MUST 규칙 안내, UI §3 MUST. DEV-044 서술형, DEV-288 절:MUST, UI 전 항목 절:MUST | 출처/확인일·사용 권리·불명확 자산 배제·독자 표현은 공통 디자인 owner. 목표 판본/여러 판본 혼합 방지·원본 정체성의 보드 적용은 보드 owner가 참조·구체화. GAME_SPEC는 규칙 해석, UI_DESIGN은 자산/VI의 실제 baseline | 확인 날짜 또는 판본은 원문의 가능한 범위 조건, 다판본이면 목표/혼합 금지 기준을 보존. 로고·그림·사진·폰트·음원 권리 불명확 시 그대로 포함 금지. 원문 장문 복제 금지. 다른 장르도 권리 의무 적용. U 개별 권리 상태 |
| **B03 실제 보드 공간**: UI-170~177; UI §7. 170/172~176 서술형 RULE/B, **171 예시 도입 CONTEXT/I**, 177 표현:할 수 있다 | 실제 정보 읽기/구성물 취급 조사와 물리 공간의 웹 해석은 보드 owner. 중앙/개인/쌓임/공개·비공개/진행방향은 해당 게임에 존재할 때 조사할 예시. 공통 가독성·정보 접근 및 권한 모델을 참조. game-local baseline/후속 결정이 실제 배치 소유 | 가독성을 해치는 원본 배치는 웹 adaptation 허용. 최초 계획과 후속 이유를 분리. 예시를 모든 장르의 중앙 보드·카드·DOM 의무로 승격하지 않음. UI 가림이 권한 필터를 대신하지 않음. U 구체 배치·공간 사례 |
| **B04 네 문서 역할**: DEV-045~078; UI-098~118. development §3A MUST 하위절, UI §6 baseline MUST/후속 연결. DEV-051/060/076/077 MUST NOT, DEV-052 예외, UI-106 예외; UI-107~118은 서술형·108 REQUIRED_SHAPE | 공통 기록 owner가 네 문서 역할·시간축·충돌 해결 본문 소유. 보드/비보드 규칙은 추가 질문과 연결 위치만 제시. game-local의 기능 현재 기준·기능 진행·최초 VI baseline·유효 후속 override를 분리 | 후속 디자인으로 baseline 덮어쓰기 금지. 출처 오기/명백한 초기 조사 오류 정정은 이유 추적 예외. SUPERSEDED/REVERTED를 현재 기준으로 부활시키지 않음. 같은 TODO/API/상태를 네 문서가 독립 소유하지 않음. U 개별 게임의 내용만 후속 |
| **B05 수동 검토·기록**: DEV-061~068/386; UI-102/118. development §3A 수동 리뷰 MUST·§15 REQUIRED_SHAPE, UI §6 | 수동 디자인 gate와 lifecycle 기록은 공통 디자인 owner. 보드는 구성물·공간·행동 이해, 비보드는 조작성·카메라·복귀·피드백을 추가 검토 항목으로 참조. UI_DECISIONS가 안정화된 의미 있는 결과 기록 | 기능 자동 검증은 디자인 완료를 대신하지 않음. 실제 브라우저 플레이 및 merge/close/release closeout 전 기록 확인. 모든 CSS 수치나 요청 횟수를 changelog로 쌓지 않음. U 실제 수동 검토 NOT_RUN |
| **B06 세션·8 surface**: DEV-220~237; development §6. 대부분 서술형, 228 REQUIRED_SHAPE, 229 표현:검증, 230 CONTEXT/I, 236 본문:MUST/조건, 237 본문:MUST NOT/검증 | 세션 생성/참여·조회·이탈의 안전 의미는 공통 invariant에서 선택 세션 모델로 연결. 현재 Room/Lobby 8 surface와 ready/start 의미는 해당 모델 owner. 보드 규칙은 실제 선택 모델을 참조. 초기 hostless와 재대결은 §4.2로 분리 | Room/session을 쓰는 온라인 multiplayer는 기존 계약 우선 검토. 현 adapter 채택 시 **8개 전체의 실제 의미** 구현, RPC 이름은 달라도 됨. 안 맞으면 최소 확장/분리 검토와 계약 테스트 연결, no-op/local 우회 금지. UI 숨김은 서버 권한 대체 불가. U 선택 lifecycle의 실제 호환 |
| **B07 온라인 권위·DB 안전성**: DEV-246~251; DB-006~018. development §7/DB 필수계약 도입. DEV-246 서술형/247 REQUIRED_SHAPE/248~249 MUST/250~251 MUST NOT; DB 각 행은 서술형·승인·검증·조건 표지 | 공통 안전 invariant와 **DB 상세 모델**을 분리하고, 보드/비보드는 선택 모델을 참조. 비DB 대응은 승인 STEP4B J06의 안전11과 §4.1을 사용. game-local 도메인 판정이 client/relay로 권위 면제를 만들 수 없음 | DB-006의 모든 신규 온라인 적용을 현행 그대로 보존. 현재 문서의 RPC→DB→invalidation 흐름을 모든 모델에 복제하지 않되, 정식 상위 권위 전환 전 하위 면제는 불가. private 없음도 DB-018 비노출 검증 필요. U 실제 backend 집행/동등 검증 NOT_RUN |
| **B08 snapshot·복구**: DEV-259~272; development §9. 서술형, DEV-270 MUST invalidation·271 MUST NOT payload 최종진실 | 정수 version·snapshot coordinator·DB invalidation은 DB 모델 본문. 최신성/authorized current state·복귀/정리 invariant는 공통에서 해당 모델 owner 참조. stream checkpoint/tail/gap/quiet loss는 STEP4B J02~05 단일 모델 책임. 보드 규칙은 선택 계약 링크 | 같은 version/더 큰 version이 다른 match/view/수명을 살리지 못함. Reconnect 신호와 최종 상태 채택을 이중 owner로 만들지 않음. stream을 DB invalidation처럼 취급하지 않으며 복구 안전은 면제하지 않음. U 실제 복구·정리 증거 |
| **B09 규칙 안내·안전 종료**: DEV-285~298, UI-061~082; development §10A 및 UI §5A. DEV-285 서술형/286~298 절:MUST; UI-063~069 MUST, 070~072 SHOULD(071 예외), 073~075 MUST NOT, 나머지 서술형/필수 | 안내 접근·이해 가능성·안전한 종료는 공통 owner. 보드는 구성물/턴/승리 설명을 적용하고, 비보드는 행동·협동 목표·실패/종료·중단/복귀 설명을 적용. game-local이 VI와 설명 사례 소유. 서버 종료/terminal 복원은 모델 참조 | 시작 전 상세 안내, 플레이 중 재접근 기본값, 지속 세션 안전 종료, 파괴적 종료 확인, 다른 참가자 영향은 서버 권한, authoritative terminal 및 이탈 후속. 브라우저 close≠경기 종료. 긴 안내의 전용 페이지 허용·짧은 modal 선택 등 원문 조건 유지. 없는 턴/승자를 만들어 넣지 않음. U 실제 목표/종료 표현 |
| **B10 재대결**: DEV-299~311, DB-038~044, UI-190~198; development §10B/DB 재대결/UI §9. DEV-299~300 서술형, **301 REQUIRED_SHAPE/조건**, 302~311 절:MUST; DB 서술형·041 조건/검증; UI 서술형·197 조건 | **multiplayer의 재참여 제품 의무**는 공통 세션 정책 owner. ready/host·same-context 상태와 서버 검증·복구는 선택 세션/권위 모델, 보드 규칙은 그 적용 프로필을 참조. UI owner는 게임 VI/표시, lifecycle 본문은 재정의하지 않음 | 기존 room/player 맥락·명시 의사·준비·host 시작·초기화·safe leave·필요 host 승계·서버 조건·reconnect 유지. 새 방/코드 재입력 강제 금지. 초기 hostless는 재대결 면제 아님. solo 비적용/host 불성립 상위 변경/정책 미정은 §4.2로 분리. U 미선택 미래 재대결 정책 |
| **B11 motion·결과·반응형**: UI-178~206; UI §8~10. 서술형, 179 CONTEXT/I, 197 조건, 204 검증, 205~206 문서 책임 | 원인과 행동/권위 결과의 이해·동기화·핵심 정보/action 유지·hover 의존 금지는 공통 UX. 카드/주사위/칩 움직임 사례는 보드 경험 owner, 실제 연출은 game-local. 잠정 피드백/확정·공식 결과/소비는 STEP4B J05·STEP5B owner 참조 | 모든 실시간 화면을 서버 확정까지 정지시키라는 의미로 해석하지 않음. 잠정 표현은 확정 상태·보상·효과로 소비 금지. winner/score/XP/공통 결과 화면 강제 없음. 작은 화면/터치/overlay 차단과 네 문서 TODO 중복 금지 유지. U 실제 renderer·효과 정책/단말 검증 |
| **B12 topic-owner·상위 변경**: DEV-350~362, GOV-037, GUIDE-019; development §13A 일반/상위충돌, governance 전파, games README 경계. 서술형 및 예외·검증 표지 | 공통 Governance owner가 topic-owner 참조·승격/전파·영향도 절차 소유. 장르 문서는 충돌 발견 사실과 최소 변경 제안만 기록. 모델 상세 보완과 상위 invariant 변경을 구별 | 사용자/maintainer의 명시 합의→Architecture Change→상하위/테스트/템플릿/Guard/소비자 정합화. 승인 전 임시 예외 구현 금지. 기존 게임 영향도 의무는 남기되 MIGRATION_REQUIRED이면 vNext 격리 재설계, 무이관 보존. 실제 Guard/권위 변경은 STEP6/7. U 그 단계 전수 목적지/영향 확인 |

### 3.3 계승 범위와 누락 방지

**J:** 신규 보드게임은 B01~12의 보드 부분과 공통/선택 모델 참조를 함께 적용한다. 기존 게임 유지보수 자료로만 축소하지 않는다. 게임별 카드 수·칩 계산·승리 산식·현재 UI baseline은 L/game-local로 남고, 실제 반복/승격 근거 없이 보드 공통 규칙에 넣지 않는다.

이 표는 STEP5C의 논리 설계이며 전수 계승 완료표가 아니다. STEP2의 49개 선택 조항도 전수표가 아니다. 근거의 147개 anchor와 이번 관련 sibling 확인은 기존 전체 ID를 소진한 목록이 아니다. STEP6/7에서 모든 기존 조항을 원문 ID·SHA/절·강도·조건·예외·각 의미 조각의 새 목적지·적용 대상·전환 방식·검증 증거에 연결해야 한다. 한 원문이 나뉘면 조각별 destination을 모두 남기며 원문 ID를 없애지 않는다. 목적지 없음, 설명 없는 의무 완화, 둘 이상의 현재 정의가 남으면 해당 전환은 통과할 수 없다.

## 4. DB 적용과 hostless 범위의 조건부 연결

### 4.1 현행 DB 규칙과 비DB 동등 안전성

**A:** DB-006 도입문은 현재 모든 신규 온라인 platform-native 게임에 적용된다. 승인 STEP4B J06은 비DB에 동일 SQL/정수 expectedVersion을 강제하지 않으면서 안전11을 동등하게 입증하는 설계다. J06 자신도 현재 DB rulebook을 이미 수정한 것으로 보지 않는다.

**J:** 공통 안전성 owner가 입증해야 할 의미를 소유하고, DB 모델 owner가 DB 상세를, 다른 선택 모델 owner가 동등한 판정·관측 경계를 소유하는 참조 구조를 채택 제안한다. 장르 문서가 자체 DB 면제를 발행하지 않는다. 승인 설계의 의미는 지금 연결할 수 있으나 CURRENT 적용 범위·상위 진입/템플릿/Guard의 실제 전환은 STEP6/7의 명시적 작업이다.

| 조건 | 적용 판단 | 차단 또는 후속 의무 |
|---|---|---|
| 기존 게임/기존 DB snapshot 모델 | 기존 권위·version·idempotency·invalidation·snapshot·재대결 계약 보존 | vNext를 이유로 변경·이관하지 않음 |
| 신규 게임이 DB 모델 선택 | 해당 DB 상세와 공통 안전성 함께 적용 | 새 장르명은 DB 검증 면제 근거 아님 |
| 신규 게임이 승인 범위의 비DB/stream 모델 선택 | STEP4B J01~06과 CP0075/D0010의 승인 의미를 참조. 아래 11개를 모델 언어로 대입 | 구현 전에 상위 적용 범위 정식 반영과 해당 검증 경로 필요. 현재 하위 초안만으로 기존 rulebook 우회 불가 |
| 순수 local/서버 보호 데이터 없음 | 온라인 RPC/transport 상세는 그 조건에서 비적용. 실행 수명·등록/접근의 해당 사이트 정책·표현/문서 품질 유지 | 나중 보호 기록 제출/조회가 생기면 그 온라인 경계부터 backend 의무 적용. local 결과를 그대로 신뢰하는 서버 저장 금지 |
| 새 모델이 기존 안전 의미로 표현되지 않음 | 해당 의미만 설계 blocker | 관련 STEP으로 돌아가 권위/순서/인가·복구 계약을 먼저 판단. 테스트로 나중 해결한다고 숨기지 않음 |

안전11의 단일 정의는 승인 [STEP4B runtime §J06](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md#L89-L107)을 참조한다. 연결 시 누락을 막기 위한 대응 목록은 다음과 같다: ①익명 보호 진입 거부 ②미승인 거부 ③승인+실제 join 정책 허용 ④비멤버/현재 view 밖 정보 거부 ⑤서버 시작 조건·권한 ⑥모델 권위 기준에 맞지 않는 stale 명령 거부 ⑦동일 명령 mutation 중복 금지+현재 응답 권한 ⑧충돌 영역의 단일 권위 commit·split-owner 차단 ⑨authorized current state와 후속 갱신의 일관된 복구 ⑩해당 multiplayer의 같은 맥락 재대결·새 match 초기화/복원 ⑪private 비노출. private가 없어도 ⑪의 없음/비노출을 검증한다. 이 목록은 장르별 새로운 안전11 본문이나 별도 엔진이 아니다.

### 4.2 초기 hostless, 재대결 hostless와 미정

| 조건 | J 적용 | 승인·구현 경계 |
|---|---|---|
| Room/host 없는 **solo local run** | Room/host/ready와 multiplayer 재대결은 그 의미가 없어 비적용. 다시 실행은 실제 run의 restart 의미로 정의 | 가짜 Room/host/서버 RPC를 만들지 않음. 종료·새 run 수명·local 보존 한계는 남음 |
| **초기만 hostless/자동 시작**, 재대결은 기존 명시 의사·ready·host 시작 준수 | DEV-229와 DEV-311을 함께 충족할 수 있음. 초기 host 부재만으로 상위 변경 불필요 | 초기 start의 서버 조건/권한과 실제 모델 호환은 별도 입증. 현재 adapter 채택 시 8 surface no-op 금지 |
| multiplayer의 **재대결에도 host 자체가 의미상 불성립** | 현행 DEV-311/AGENTS와의 실제 상위 의미 충돌 | 그 적용을 선택할 때 명시적 Architecture Change 승인 필요. 대안은 재참여 의사·같은 참여 맥락·시작 조건/권한·safe leave·복원·중복/수명을 어떻게 유지할지 제시해야 함. 이번 문서는 대체 정책을 채택하지 않음 |
| multiplayer 재대결 **정책 미정** | U, NOT_APPLICABLE이 아님 | 해당 GAME_SPEC/lifecycle 구현 전에 닫아야 함. 이번 장르 규칙 전체 설계 blocker로 확대하지 않음 |
| STEP4B G06 두 Probe의 기존 승인 범위 | SCOPED_DESIGN_RESOLVED를 유지 | 두 Probe의 해당 검증 의무를 유지하고 미래 hostless multiplayer 전체 면제로 확장하지 않음. 실제 Probe가 승인 범위를 벗어나면 그 선택만 재검토 |

**J:** 재대결의 기존 제품 의무를 보드 문서만의 의무로 축소하지 않는다. 반대로 모든 게임에 Room/host를 강제하는 방식으로 충돌을 없애지 않는다. 모델 선택과 제품 재대결 정책의 적용 조건을 위처럼 별도 판정한다. 첫 Probe의 구체 제품 정책을 이번에 선택하지 않으며 기존 승인 범위 안에서 후속 GAME_SPEC가 기록하게 한다.

### 4.3 실제 상위 의미 변경과 문구 전환

DB 안전 의미/모델 상세 분리와 결과 없는 게임의 조건부 설명은 이미 승인된 계획·STEP4B/5B를 잇는 설계다. 다만 현행 DB 도입문, development §6~10B, AGENTS, UI §9 등을 실제로 고치는 권위 전환은 아직 수행하지 않았다. STEP6에서 조각별 목적지/영향 범위를 정하고 STEP7에서 관련 owner·진입·Guard를 정합화해야 한다.

미래 재대결 host 불성립, 새 인가 보장 완화, 신규 권위/순서/수명 의미처럼 **승인된 계약 자체를 바꾸는 선택**은 별도 사용자 승인 항목이다. 이번 §9.1 승인만으로 이 미선택 변경을 포괄 허용하지 않는다. UI의 winner 문구는 공식 결과가 있을 때 실제 outcome을 설명하는 조건으로 연결할 수 있으나, 기존 게임의 승자/결과 화면을 제거하는 허가가 아니다.

