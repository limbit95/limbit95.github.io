# Game Platform vNext STEP5C — Astra 핵심 판단안

작성: 2026-10-10 · 판단 담당: Astra · 상태: **PROPOSED / 사용자 핵심 판단 승인 대기**

보드 규칙은 조항의 의미별로 공통·보드·선택 모델·game-local 책임을 나누어 계승한다. 첫 비보드 규칙은 실시간 협동·공간 경험에 필요한 입력 취소, 공간 이해, 시간과 복구, 역할별 정보, 잠정 표현과 확정 결과의 기준을 독립적으로 정의한다. 둘째 Probe는 room/host 부재만으로 별도 장르 규칙을 만들지 않으며, 기존 경험 규칙으로 설명할 수 없는 플레이·마감·기록 의미가 있을 때 해당 규칙을 보완하거나 신설한다.

이 문서는 **판단안과 규칙 내용 초안**이다. 저장소 STEP5C 기록은 **NOT_STARTED**, 행동 검증은 **NOT_RUN**, 기존 **UNKNOWN**과 구현/실행/오픈 의무를 유지한다. 문서 제출은 사용자 승인, STEP5C 완료, 정식 CURRENT rulebook 전환, 지원 완료를 뜻하지 않는다. 저장소 변경·브랜치/PR/checkpoint·구현·실제 시험·운영·병합·main·STEP6 이후 작업을 수행하지 않았다.

## 1. 입력, 현재 상태와 증거의 지위

### 1.1 실제 읽은 입력과 보존

| 입력 | identity / 고정 내용 | 이번 취급 |
|---|---|---|
| `game-platform-vnext-step5c-evidence.md` | Library `libfile_0bdb7dd3b3b08191afb7ecb61c243ee8`; file `file_00000000ccb0820687fc83d99fbb7588`; 130,313 bytes; SHA256 `d5c690690414d19fb2a1692a42123bd2780b31730a5c39c4c132018c3a843025` | 현재 Library 원문 681줄 실제 읽기. 로컬 보존본과 내용/hash 일치. 근거 B01~12/N01~13/§11을 판단 입력으로 사용하고 원본 미수정 |
| `game-platform-vnext-step5c-plan-and-handoff.md` | Library `libfile_a3e953e18a788191929cad929955fb42`; file `file_00000000365c820690c651c397b0e23c`; 24,830 bytes; SHA256 `5a03ffdadbd68b713e6d2fc491c8da489e5fea5786fc79693746602503b0eb2c` | 현재 Library 원문도 실제 읽기. 계획/분담/게이트 재사용. 원본 미수정 |
| 고정 저장소 | `limbit95/limbit95.github.io`; integration `feature/game-platform-vnext-integration`; SHA `2751e9241a3debbd40506fa1b2ea7e688dfe0140` | 모든 내부 source trace의 현재 고정 기준. 이전 STEP 작성 SHA는 역사 입력으로 보존 |

Library read 응답의 version은 null이었다. 별도 버전을 추정하지 않는다. 근거 문서가 보존한 계획 당시 version 0과 이번 응답을 혼동하지 않는다. 입력 두 파일의 identity와 bytes를 교체하지 않고 결과를 별도 새 파일로 작성한다.

**F**는 이번 직접 관찰 또는 명시한 기존 관찰의 재사용, **A**는 유효 사용자 결정/승인 설계, **J**는 이번 Astra 판단안, **U**는 미확인·미선택이다. 아래 J 또는 S5C-R 규칙은 승인을 요청하는 내용이며 기존 조항의 원래 강도를 소급 변경한 것이 아니다. Sol 근거의 I는 자동으로 A가 되지 않는다. 유효 사용자 승인·DECISIONS/계획1.5·승인 원문이 요약보다 우선한다.

### 1.2 상태 복원과 실제 원격 대조

AGENTS → 계획1.5 → rebuild README → CURRENT → CP0084 → 실제 PR415 순서로 필요한 상태를 복원했다. 기존 근거의 blob·원문 확인을 재사용하며 원격 integration ref와 PR 메타데이터를 새로 확인했다.

| 구분 | 확인 결과 |
|---|---|
| F 실제 integration HEAD | `2751e9241a3debbd40506fa1b2ea7e688dfe0140`; 고정 SHA와 동일, 기준 뒤 추가 변경 0 |
| F [PR415](https://github.com/limbit95/limbit95.github.io/pull/415) | closed / merged=true; base integration; final head `a71097d469781dbc0c8b441dce93da6f1057506c`; merge 위 SHA; merged_at `2026-10-10T02:44:49Z` |
| A 현재 STEP5B | **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED**. CP0084가 요구한 실제 PR/Git 복원 경로를 적용 |
| F/A 과거 문구 | CURRENT/README/CP0084의 OPEN·미병합, 승인 산출물 헤더의 REVIEW_PENDING은 해당 저장 당시 이력. 현재 blocker로 되살리지 않음 |
| F/A 현재 작업 한계 | STEP5C 저장소 기록 NOT_STARTED 유지. 이번 허용은 핵심 판단안·문서 제출. 정식 반영과 단계 결과 승인은 별개 |
| A 실행 지위 | 행동/DB/browser/audio/두 client/성능·운영 NOT_RUN, 기존 UNKNOWN과 구현/실행/오픈 의무 유지. main 별도 게이트 |

merge parents/tree의 이전 확인은 근거 §1과 PR415 설명을 재사용했다. 전수 tree·source/SQL 감사를 반복하지 않았다. root 계획 blob `da353e2e64daef6b1b0b7267c21997bfd7cda4ed`의 개정1.5와 CP0075/D0010을 적용하며 과거 strict-C/HOLD는 부분 대체 이력으로 읽는다.

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

## 5. 첫 비보드 Probe — 실시간 협동·공간형 규칙 내용 초안

이 절은 실제 규칙 내용이다. **A에서 계승한 의무와 J에서 추가 제안한 경험 기준을 구분**한다. S5C-R의 규정형 문장은 핵심 판단 승인 후 정식 설계에 반영할 제안이며 현재 rulebook의 즉시 변경은 아니다.

### 5.1 범위와 출처 — 최소항목 1

**A 범위:** 첫 Probe의 작은 실시간 2D 온라인 협동 수직 Slice. 지속적인 공간 이동/행동과 동시 참가가 있을 수 있으며 준비·결과·종료는 이벤트성 전이로 연결할 수 있다. 실제 게임·세계 구조·목표·camera·transport·renderer·tick/physics/network 주기·prediction 채택을 여기서 정하지 않는다.

**J 적용 범위:** 지속 입력과 공간 상태가 플레이 판단에 영향을 주는 제한 실시간 협동 경험에 이 규칙을 적용한다. 단지 2D로 그리거나 온라인이라는 이유만으로 적용하지 않는다. 경쟁 대전·전용 물리·정밀 리듬·3D·대규모 장기 세계는 이 초안의 지원 범위로 선언하지 않는다. 추후 필요 시 기반 규칙과 차이를 조사한다. 이 범위 제한은 다른 장르의 개발을 금지하는 정책이 아니다.

출처는 계획 §3/STEP5C, STEP2 7축, S3-C02/C08/C09/C10 및 전환, 승인 STEP4A/B·5A/B, 근거 N01~13과 B01~12다. E01~03은 Sol이 2026-10-10에 확인한 제한 웹플랫폼 사실을 재사용한다. 실제 제품 사례·권리·입력장치 선정은 개별 Probe 조사로 남긴다.

| 제한 공식 근거 | 재사용하는 사실 | 이 초안의 J 연결과 한계 |
|---|---|---|
| E01 [W3C Keyboard 설명](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | 기능 키보드 조작과 본질적인 경로 의존 입력 예외의 구분 | S5C-R11의 기능별 조작 검토. informative 설명을 WCAG 전면 채택·준수 인증으로 확대하지 않음 |
| E02 [Pointer Events Level3](https://www.w3.org/TR/2026/REC-pointerevents3-20260630/) §4.1.3.3/4.2.7/4.1.4 | pointer stream 취소/억제와 경계 사건 가능 | S5C-R02의 취소·좌표/기기 전환 검토. pointer capture라는 기법이나 브라우저 지원을 확정하지 않음 |
| E03 [HTML 렌더 갱신](https://html.spec.whatwg.org/multipage/webappapis.html#update-the-rendering)·[animation callbacks](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames) | hidden/렌더 기회와 render callback 처리의 구별 | S5C-R04/05의 시계 분리·복귀 검토. 모든 timer/서버가 멈춘다는 주장이나 정확한 브라우저 재개 보장 아님 |

이번에 외부 자료를 새로 조사하지 않았다. 과거 X01~07 등은 근거 §4.2에 명시된 확인 시점·판본/commit 한계를 유지하며 새 제품·공급자·요금·운영 권고로 쓰지 않는다.

### 5.2 플랫폼 연결 — 최소항목 2

**A 공통 재사용:** Registry 단일 metadata, site Access/기존 Auth, 실행·viewer 수명, 네 문서·수동 gate, 선택 모델의 권위/인가/복구, STEP5A/B의 공통 기능 본체를 참조한다. 장르 전용 Core·Auth·초대·BGM·결과 집계 엔진을 새로 정의하지 않는다.

**J 선택 기록:** GAME_SPEC는 STEP2의 7축 — 흐름, 갱신/시간 특성, 세션 수명, 참여/역할, 권위·동기화·복구, 공간·입력·렌더링, 결과·지속성 — 을 기존 선택표 의미로 기록하고 필요한 Capability를 별도 선택한다. 세부 기능은 **사용 / 비적용(이유) / 미선택·미결정 / 미지원**을 구별한다. 문서 존재·모델 선택·구현 증거·실행 지원은 별도 상태다.

| 연결 주제 | owner / 참조 | 금지 조합·적용 조건 |
|---|---|---|
| 실행·시간·공간 | 선택 모델의 진행/입력/공간 의미; game-local의 조작·세계·카메라 | 장르명만으로 고정 Hz·DOM/Canvas·physics·prediction 채택 금지 |
| 권위·송수신·복구 | STEP4B 승인 모델/backend, STEP5A Snapshot/Reconnect 단일 최종 채택·복구 | relay를 판정 권위로 오해하거나 예측 상태를 공식 결과로 소비하지 않음. DB·stream은 §4.1 조건 |
| 세션·진입·재대결 | 선택 세션 모델, site 인가, §4.2 | roomless를 무권한 허가로 해석 금지. 현 adapter의 무의미한 8 surface 금지 |
| Shell·게임 UI | 공통 표시 부품 vs game-local 공간·HUD·결과 연출 | 공통 Shell이 모든 게임 레이아웃/renderer를 소유하지 않음 |
| Invite·BGM·표현/결과 | STEP5A H1~4·STEP5B producer/consumer와 효과 owner | 미선택 기능 강제·무보완 연결 지원 인증·Adapter 내부 새 본체 금지 |

### 5.3 독립 장르 요구 — 최소항목 3

다음 표의 관측 기준은 후속 시험에서 확인할 oracle이며 이번 실행 결과가 아니다. R01~13은 근거 N01~13을 단순 재진술한 질문 목록이 아니라 **채택을 제안하는 최소 행동/기록 규칙**이다.

| 규칙 ID / J 내용 | owner·조건 | 후속 관측 / 미선택·미지원 |
|---|---|---|
| **S5C-R01 지속 협동 흐름**: GAME_SPEC는 행동의 시작·유지·중단·해결, 동시 행동의 충돌/협동 기여, 플레이 가능/대기/종결을 구분한다. 턴 대기를 대신 붙이지 않는다. 플레이어가 현재 가능한 행동과 협동 진행의 원인을 이해할 수 있게 표현한다 | game-local 규칙·상태; 전이의 권위/순서는 선택 모델. 지속 진행이 실제 없는 부분은 이벤트 전이로 설명 | 동시 입력/같은 대상 경합/참가자 이탈 때 상태와 표현이 정의한 규칙으로 설명되는지 확인. 실제 목표·실패 조건 미선택 |
| **S5C-R02 입력 시작·해제·취소**: 연속 intent의 owner와 유효 범위를 정한다. cancel/blur/입력원 교체/역할 상실 등으로 유효성을 잃은 눌림·방향·drag는 이후 입력의 근거로 자동 유지하거나 복귀 때 재생하지 않는다. 다시 활성화는 현재 맥락과 새 유효 입력을 근거로 한다 | game-local 조작 의미 + 선택 입력 모델; 현재 권한은 backend. 실제 장치에 존재하는 cancel 신호만 연결하고 단발·지속·조합 입력을 구별 | down 후 up 없이 cancel, 포커스 상실, 입력원 변경 뒤 stuck movement/중복 행동 없음. 이미 권위적으로 수용된 행동을 client cancel로 rollback했다고 표시하지 않음. cancel 전달/손실 시 원격 intent 종료의 관측 가능 의미는 구현 전 해당 모델이 정의; 임의 timeout 수치 미동결 |
| **S5C-R03 공간·카메라·좌표**: 플레이어가 조작 대상·위치·경계·중요 상호작용을 식별할 수 있게 한다. viewport/camera/확대/방향 변화 후 입력의 화면 좌표와 게임 공간 해석을 다시 맞추며, 옛 좌표 해석을 새 공간에 적용하지 않는다 | game-local 세계·카메라 정책; 선택 공간/입력 모델. 고정 camera·격자/연속·충돌·physics 유무는 실제 선택 | 작은 화면·크기/방향 전환·가림·화면 경계에서 목표와 action이 유지되는지 확인. camera가 없거나 물리가 없으면 이유 기록; 억지 camera/physics 추가 없음 |
| **S5C-R04 시간의 분리**: render/FPS, input sampling, simulation, physics(사용 시), network, audio 시간을 구별한다. 화면 frame 수/브라우저 timer 횟수를 경기 권위 시간·순서·서버 마감과 등치하지 않는다. 큰 시간 공백의 처리 의미를 선택 모델에 기록한다 | 시간/진행 모델; game-local 행동 시간 요구. 승인 권위 구조를 참조 | frame 저하/긴 공백에서 잘못된 진행·명령 폭주·권위 순서 역전이 없는지 확인. catch-up/폐기/보간 방식·수치·tick은 미선택이며 이 초안이 고정하지 않음 |
| **S5C-R05 비가시·복귀**: 비가시/포커스 상실과 게임의 pause/종료를 구별한다. local의 더 이상 유효하지 않은 지속 intent는 R02로 해소한다. 복귀 시 현재 실행/역할·권한·authorized state와 갱신 연결의 준비를 확인한 뒤 보호 입력을 재개한다. 옛 buffered intent나 빠진 frame을 무조건 몰아서 실행하지 않는다 | view/input owner + 단일 복구 모델. browser 신호 자체는 서버 경기 pause/종결 명령이 아님 | 숨김 중 진행·권한 철회·terminal·재연결 뒤 fresh view만 사용하고 terminal을 LIVE로 되살리지 않음. 단순 visibility 변화가 항상 rejoin/전체 snapshot을 요구한다는 구현은 미선택; 현재성 입증이 불가능하면 복구/차단 |
| **S5C-R06 가시성·역할**: 공간에 그려지는 정보와 전달 가능한 정보를 구분한다. camera 가림·CSS 숨김·화면 밖 entity는 서버 projection/recipient 권한의 대체물이 아니다. 역할/view 교체 때 이전 private 정보·입력 활성·effect를 새 viewer에 자동 이어 붙이지 않는다 | backend의 authorized view·전달 + viewer 수명; game-local 표현 | participant↔spectator·동일 user 다른 role·새 user·중도 참가를 선택했다면 그 전환에서 정보/입력 격리. 관전/중도 참가/팀 private는 미선택 가능; private 없음도 비노출 검증 |
| **S5C-R07 시작·종료·재참여**: UI 준비, 서버 start 허가, 실제 진행, terminal, local detach를 별도로 설명한다. 종료 영향 범위와 확인·안전 이탈·다시 진입을 제공하며, 적용 multiplayer 재대결은 §4.2를 따른다 | game-local 제품 lifecycle + 세션/권위 모델; 안내/확인 UX는 공통 참조 | 동시 start/leave/종료, 종료 후 복귀, 같은 맥락 새 match에 이전 결과 불채택. 지속 세션이면 안전 종료 경로. winner/score/result 없음 허용; 실제 종료/결과 정책 미선택 |
| **S5C-R08 복구와 입력 준비**: 연결 성공만으로 플레이 가능을 표시하지 않는다. authorized current checkpoint/state와 이후 갱신의 일관성·gap/quiet loss 처리·현재 owner/view를 단일 모델이 판정하고, 실패/복구 중/terminal을 실제 상태대로 보인다 | STEP4B J02~05와 STEP5A 단일 최종 채택·복구 owner | initial/live 경합·마지막 이벤트 유실·tail gap/overflow·끊김/복귀에서 최신 상태/입력 허용 일치. history replay와 현재 상태 복구를 분리. 장기 history 보존은 요구 시만 |
| **S5C-R09 전체 수명**: 입력·camera/renderer·timer·listener·effect·늦게 얻은 자원에 STEP4A 전체 완료 계약을 적용한다. 반영 대상/맥락/권한/모델 순서/반영 시점이 맞는 결과만 채택하고 자기 owner 자원만 정리한다 | Core 공통 수명, 선택 모델의 맥락, 실제 자원 owner. 게임은 site 공용 자원의 자기 사용권만 반납 | success/error/null/finally/cleanup/leave/effect·후속 작업, 부분 초기화 실패·재진입·반복 dispose·dispose 뒤 자원 획득을 관측. 취소 요청과 실제 중단/채택 무효화/정리를 분리. T01~03 모두 유지 |
| **S5C-R10 잠정 피드백·공식 결과**: 즉각 반응이나 선택한 prediction은 잠정임을 의미상 구분하고 권위 상태와 조정 가능해야 한다. 공식 결과·개인 outcome·viewer 연출은 STEP5B 경계로 연결한다. 재시뮬레이션/재조회/재렌더가 새 보상·집계·SFX 발행 근거가 되지 않는다 | 선택 모델 + game-local presentation, 공식 producer 및 각 consumer | 거부/보정·snapshot 반복·ACK 유실·정정에서 확정 결과/효과 중복 없음. prediction 사용 여부 미선택, 보정 시각 방식 미동결. 이미 재생한 SFX를 rollback으로 취소했다고 주장하지 않음 |
| **S5C-R11 조작 발견·접근성**: 메뉴·시작/종료·규칙 보기·복귀 안내처럼 본질적 경로 의존이 없는 기능은 키보드로 도달/실행하고 포커스와 상태를 알 수 있게 설계한다. gameplay는 본질적 조작 요구와 제공 대체 입력을 기능별로 명시한다. 색/소리/hover 하나에만 핵심 상태나 action 발견을 맡기지 않도록 검토한다 | J 장르 품질 보완 + 공통 UI/수동 gate; game-local 조작/정보 설계 | 키보드·실제 제공 터치/포인터·포커스 이동·비가시 복귀·음소거에서 핵심 안내/종료 경로 확인. 실시간이라는 이유만으로 모든 gameplay를 예외 처리하지 않음. 전 장치/gamepad 지원·WCAG 전면 인증을 약속하지 않음 |
| **S5C-R12 반응성·부하**: local input-to-feedback과 authoritative end-to-end 반응을 따로 관측한다. FPS·DB 왕복·prediction frame만으로 원격 권위 p95 목표를 충족했다고 쓰지 않는다. render/input 부하·queue·지연 편차·복귀를 실제 조건과 함께 기록한다 | 선택 모델/backend의 측정, game-local 조작성, 공통 품질 gate | 승인 총100/판8·원격 p95≤250ms·정상망 각 복구≤5초·모바일5기능 유지. 새 tick/FPS/p99/샘플 수 의무는 만들지 않음. 지원 단말/망·측정 구간/오차·표본은 구현/실행 전에 구체화 |
| **S5C-R13 검증·완료 주장**: 기능 수렴·권한·수명·조작성·가독성·반응성·수동 polish는 서로 다른 증거로 확인한다. 미지원·미실행을 별도 표시하고 선택된 기능에만 지원 주장을 붙인다 | 모델/게임 검증 owner + 공통 release/manual gate | unit/model·실제 두 client·브라우저/모바일·수동 플레이·운영 검증을 해당 조건에 연결. 기존 invalidation 테스트나 이 초안만으로 공간형 품질/지원 PASS 선언 금지 |

### 5.4 개발과 네 문서 보완 — 최소항목 4

**A 재사용:** 조사→네 문서→작은 구현→기능/모델 검증→실제 브라우저 디자인 검토→기록/closeout의 공통 절차와 권위는 B01/B04/B05를 따른다. 아래는 추가로 기록할 내용이며 공통 흐름의 두 번째 본문을 만드는 것이 아니다.

| 문서 | J 첫 Probe에서 보완할 내용 | 다른 owner를 복제하지 않을 경계 |
|---|---|---|
| GAME_SPEC | 실제 협동 목표/행동/실패/종료, 적용 공통·장르·모델과 버전/근거, 7축·Capability, 지속 intent/취소 의미, 시간·권위/복구·역할, start/rematch/결과 유무, 선택·미지원·미결정 | 모델의 인가/수명 본문은 링크. UI 수치/장식 이력과 live TODO를 소유하지 않음 |
| DEVELOPMENT | 위 선택의 작은 구현 단계, 실제 branch/작업·기능/모델/실행 증거, 미실행 사유, 다음 기능 작업 | 기능 규칙/장르 계약/디자인 최종 결정을 독자 확정하지 않음 |
| UI_DESIGN | 최초 조사·권리/VI·공간/camera/HUD·조작 발견·포커스/중단/복귀·잠정/확정 피드백·responsive·규칙 안내·초기 validation baseline | 보드 중앙/카드 배치를 무조건 재사용하지 않음. 아직 선택하지 않은 renderer/physics를 장르명이 확정하지 않음 |
| UI_DECISIONS | 개발 시작 후 조작성·camera·피드백·모바일·브라우저 관찰로 바뀐 의미 있는 결정, 이유/대안/검증·최신 유효 override | 최초 baseline 보존. 모든 CSS 수치·수동 요청 횟수·기능 TODO 복제 금지 |

**J 보드에서 이어받는 것:** 조사 충실도, 출처·권리, 설명 가능한 VI/상태, baseline/후속 결정, 수동 플레이 검토. **채택하지 않는 보드 전제:** 턴 단위 input만 존재, 중앙/개인 보드·카드 배치 필수, 인원 ready가 모든 초기 시작의 전제, 모든 권위 상태가 DB integer version, 모든 결과가 승자/점수. 이 비채택은 기존 보드 의무 삭제가 아니라 해당 경험의 적용 조건 구분이다. multiplayer 재대결과 온라인 안전성은 §4의 별도 조건을 그대로 따른다.

### 5.5 검증과 완료 기준 — 최소항목 5

**J 설계 문서의 준비 기준:** 범위·owner·조건·원문 연결과 R01~13의 실제 제품 결정 위치가 명확하고, 현재 상위 계약과 충돌하는 선택을 숨기지 않으며, 검증 oracle/미지원/미선택이 구별되어야 한다. 이 기준 충족은 실제 Probe 실행의 완료가 아니다.

| 검증 묶음 | 필수 연결 / 실제 완료에서 확인할 것 | 현재 |
|---|---|---|
| 입력·공간·시간 | R01~05: 취소 후 잔존 intent, viewport/camera 변화, 긴 frame 공백·hidden 복귀, local/권위 반응을 실제 지원 기기에서 확인 | NOT_RUN |
| 권한·정보·복구 | 안전11·A/C/P·현재 view·initial/live/gap/quiet loss·known expiry/인지 실패·최초60초·terminal을 해당 모델 oracle로 확인 | NOT_RUN |
| 전체 수명 | STEP4A T01 같은 Room 새 Match, T02 A→B→A, T03 role/view/user 변경과 모든 완료 경로. Room 없는 Probe는 의미 없는 Room을 만들지 않고 실행/run/view/자원 전환에 같은 의무를 대입 | NOT_RUN |
| 결과·표현 소비 | 공식 결과/정정·producer/consumer·선택된 통계/보상/효과의 각 중복 범위 확인. 결과 없음이면 가짜 결과 없는 정상 종료 확인 | NOT_RUN |
| 성능·모바일 | 총100/판8·원격 p95≤250ms·정상망 각 복구≤5초와 모바일5기능(**이동·상호작용·준비·종료·재접속**, STEP4B T13)의 기존 적용 범위 확인. 미선택 기능으로 목표 범위/기존 승인 조건을 임의 삭제하지 않음 | NOT_RUN; 실제 기기/망·표본·오차 U |
| 디자인·접근성 | 실제 브라우저 플레이로 R03/10/11 및 안내/종료/반응형·overlay를 검토하고 안정화된 변경을 UI_DECISIONS에 기록 | NOT_RUN |
| 운영·공존 | D0006~10의 기록/삭제/탈퇴/backup·복원·비용/운영 조건, 기존 Auth/게임·공용 본체의 회귀 | NOT_RUN / UNKNOWN |

각 Probe가 검증할 실제 모바일 기능과 준비/재접속의 해당 모델 의미, 공통 모듈의 모바일 의무, 실제 지원 주장 범위를 명시한다. Room이 없는 Probe에 가짜 로비를 만들지는 않지만 적용 제품 의무를 Capability라는 이름으로 선택 해제할 수는 없다. STEP4B의 기본 시험 범위 D0005(Windows10/11 Chrome·Edge, iPhone Safari)는 재사용하며 정확한 build/기기 사양 미확인도 유지한다. 기존 제안 표본을 승인 수치로 승격하지 않는다.

실제 Probe의 완료는 적용된 계약/기능 시험, 다중 client·지원 모바일 조작과 복구, 성능 조건, 수동 디자인 gate, 미지원 설명, 해당 운영/공개 게이트의 증거를 갖춰야 한다. 문서의 ‘가능’, 코드 존재, unit PASS, 두 client PASS, 운영 활성화는 각각 분리한다.

### 5.6 권위와 이력 — 최소항목 6

**J:** 이 초안의 topic-owner는 실시간 협동·공간 경험 규칙 책임이다. 공통 의무는 공통 owner, 권위/시간/복구는 선택 모델, 실제 제품 규칙·VI는 game-local owner가 유지한다. 현재 상태는 PROPOSED이며 승인 전 정식 rulebook으로 링크해 적용하지 않는다.

정식 설계에는 적용 공통/모델의 버전·고정 출처, 변경 이유, 기존 규칙과의 분할/참조, 적용 대상, 상위 충돌 여부, 재검증 범위를 기록한다. 상위 인덱스가 발견할 수 있도록 연결하고 GAME_SPEC에서 선택 근거를 남긴다. 실제 파일·버전/경로·Guard와 권위 전환은 STEP6/7의 산출물이다. 새 장르 경험만의 변화가 기존 수명/안전성 보장을 약화할 수 없다.

## 6. 둘째 Probe의 별도 규칙 필요성과 선택 조건

**J 결론:** 현재 범위만으로 별도 ‘roomless 장르’ 문서를 필수화하지 않는다. **기반 경험 규칙 + 실제 local/비동기/지속성 모델의 조건 보완**을 기본 경로로 삼는다. 다만 해당 조합으로 설명되지 않는 새로운 플레이 경험 기준이 있으면 runtime 전에 보완 묶음 또는 독립 장르 문서를 작성·검토한다. 실제 Probe 게임은 이번에 선택하지 않는다.

| 실제 후속 선택 조건 | 기존 규칙+모델 조건으로 충분한 범위 | 새 경험 규칙/보완이 필요한 조건 |
|---|---|---|
| solo local, 결과 없는 run | 기반 퍼즐/보드/공간 등 경험 규칙 + 등록/접근·실행/자원 수명 + local 진행/재시작·종료 | 기존 경험 규칙에 없는 조작·공간/시간·목표/실패·접근성/완료 기준이 생길 때 그 부분 작성 |
| solo local, 단일 기록 | 위 범위 + 기록의 권위·저장/소실 한계·재진입/정정 의미 | 기록 자체가 제품 경험의 핵심이면 유효 run·중단 run·기록 비교/표시·실패 시 사용자가 이해할 기준 보완. 자동 leaderboard/통계/보상 선택 아님 |
| 보호 온라인 기록 제출 | 기반 경험 규칙 + 제출 인가/검증·중복·공식 결과/consumer·보존/삭제 모델 | local 계산을 서버가 신뢰할 근거, 실패/재시도/정정의 사용자 경험이 빠져 있으면 보완. 새로운 권위 의미가 필요하면 먼저 해당 설계 STEP |
| 비동기 또는 장기 진행 | 기존 보드 등 기반 규칙 + durable state·권위 마감·명령 순서/중복·현재 권한 복귀·참가 수명 | offline 참가자의 기다림/알림 필요, 마감·지연 명령의 게임상 효과, 이탈·재가입/포기, 장기 결과·진행 이해가 기존 규칙으로 표현되지 않을 때 별도 경험 보완 |
| 초기 hostless multiplayer | §4.2의 초기 조건 + 기존 재대결 정책 + 적합한 세션 모델 | hostless 자체로 새 장르 불필요. 새 협동/경쟁 흐름이 다를 때만 경험 규칙 추가 |
| 재대결 host 불성립/미정 | 일반 확장으로 자동 해결하지 않음 | §4.2의 상위 변경 필요/미확인 판정. 새 장르 문서를 만드는 것으로 승인 면제 불가 |

새 문서와 기존 문서 보완 중 선택은 **독립된 조사·검토·재사용이 필요한 의미 묶음인지**로 정한다. 작은 조건 차이는 기존 owner 절에 보완하고 인덱스에 조건을 연결한다. 별도 경험 묶음이면 계획 최소6항목을 갖춘 한 문서로 시작할 수 있다. 결과·Invite·Presence·history·통계·reward가 불필요하면 미선택 이유를 남긴다. 가짜 Room/host/ready/winner·공통 결과 schema를 만들지 않는다.

## 7. 공통·장르·모델 연결, 혼합 장르와 신규 추가 절차

### 7.1 한 의미 한 owner의 연결표

| 발견/적용 지점 | 소유 본문 | 남겨야 할 참조와 적용 근거 |
|---|---|---|
| AGENTS·상위 아키텍처·장르 인덱스 | 공통 진입/책임·탐색 순서 | 아키텍처→공통→해당 장르/모델→공통 모듈→개별 네 문서. 인덱스는 세부 규칙을 다시 정의하지 않음 |
| 조사·자산·네 문서·수동 gate | 공통 개발/디자인 품질 owner | 장르별 추가 조사·검증 항목은 해당 owner 참조와 차이만 |
| 판본/실물 정보공간 | 보드 경험 owner | 공통 권리·가독성/기록 및 실제 선택 모델 링크; game-local 해석/배치 |
| 지속 입력·공간 이해·복귀/피드백 경험 | §5 실시간 경험 owner | 공통 수명·선택 시간/입력/권위/복구 모델과 R별 제품 결정 |
| 권위·인가·중복·순서·상태 복구 | STEP4B 모델/backend owner | 장르의 검증 상황을 연결. genre별 독자 인가/복구 엔진 본문 금지 |
| Registry·Invite·BGM·결과/공개 소비 | 승인 STEP5A/B의 실제 owner | 선택 기능/조건/호환·수명 owner와 검증 링크. 두 번째 metadata/공통 본체 복제 금지 |
| 실제 제품 규칙·VI·지원 범위 | GAME_SPEC, UI_DESIGN+유효 UI_DECISIONS | 사용 계약·장르·모델 버전/선택 이유·비적용/미지원·적용 test. 독자 opt-out 아님 |
| 실제 기능 진행·증거 | DEVELOPMENT | 현재 Phase/branch·검증·미실행·다음 작업. 기준 문서 링크 |
| 상위 충돌·권위 전환·전파 | Governance/Architecture Change owner | 원문 조항/영향 대상/최소 변경·승인/검증·Guard 연결. 실제 적용은 허용 단계 |

### 7.2 혼합 장르의 충돌 처리

1. **적용 단위를 나눈다.** 게임 전체 이름보다 모드·phase·행동·역할에 필요한 경험 규칙과 모델을 기록한다. 예를 들어 보드 준비 화면과 공간 협동 플레이는 각각 필요한 경험 규칙을 적용할 수 있다.
2. **같은 의미는 합치지 말고 단일 참조로 모은다.** 네 문서·권리·안전 종료·수명 같은 공통 의미는 공통 owner 한 곳을 사용한다. 두 장르의 화면 예시는 동시에 반드시 구현해야 할 두 의무가 아니다.
3. **조건 차이와 진짜 충돌을 구별한다.** 턴 단계와 지속 입력 단계가 분리되면 각 범위를 GAME_SPEC에 기록한다. 같은 상태의 권위/순서/종료를 두 계약이 서로 다르게 요구하면 단순 설정 합집합이나 ‘더 엄격한 쪽’ 선택으로 해결했다고 쓰지 않는다.
4. **경계별 owner가 양립 근거를 제시한다.** phase 전환·입력 비활성·view/자원·결과 소비가 어느 owner로 넘어가는지 설명하고 전환 검증을 연결한다. 계약 내부 조건으로 해결되면 해당 owner 보완 후 game-local에서 적용 근거를 참조한다.
5. **상위 의미 충돌은 해당 선택을 멈춘다.** 원문 ID·조건·불가능한 조합·최소 변경·기존 소비자 영향을 기록해 Architecture Change 합의를 받는다. 빈 adapter·fake Room·local 독자 권한으로 회피하지 않는다. 미선택 다른 기능까지 전체 blocker로 올리지 않는다.

예: 보드 phase의 확인 애니메이션과 실시간 phase의 즉각 잠정 피드백은 각각의 phase에서 표현할 수 있다. 양쪽 모두 공식 결과를 소비할 때는 하나의 STEP5B producer/consumer 의미를 따라야 하며 화면 표현 방식 두 개가 공식 결과 권위 두 개를 만들지는 않는다.

### 7.3 신규 장르 추가 절차

| 순서 | J 해야 할 일 | 산출/판정과 owner |
|---|---|---|
| 1 범위·조사 | 사용자 제품 범위, 플레이/입력/시간/공간/참여·규칙/디자인/권리 출처 조사. 확인 사실·판단·U 분리 | game-local 조사. 실제 권리 불명확 자산을 사용하지 않음 |
| 2 기존 규칙 적합성 | 장르 인덱스와 7축·선택 모델/Capability를 읽고 기존 경험 규칙으로 설명 가능한 부분과 남은 차이를 분리 | 기존 owner 참조 / 작은 보완 / 새 경험 묶음 중 하나를 이유와 함께 제안 |
| 3 최소 내용 작성 | 신규 묶음이면 범위/출처·플랫폼 연결·독립 요구·네 문서 보완·검증/완료·권위/이력 여섯 항목 작성. 조건부 비적용 이유 포함 | 장르 topic-owner가 경험 요구 소유. 모델 의미를 복사하지 않음 |
| 4 충돌/검토 | 공통 안전성·문서 품질·현재 모델/세션·기존 consumer와 충돌 검토. 위 §7.2와 기존 Governance 적용 | 기존 의미 안의 보완은 owner 정합화. 상위 의미 변경은 사용자/maintainer 명시 합의·Architecture Change |
| 5 연결·제품 결정 | 상위 인덱스에서 발견 가능하게 연결하고 GAME_SPEC에 적용 규칙/버전·선택/미지원 근거 기록. UI baseline 등 네 문서 bootstrap | gameplay/runtime 전에 해당 규칙 작성·검토와 네 문서 기준 충족 |
| 6 작은 구현·검증·수동 gate | 허용된 단계에서 실제 소비자에 필요한 최소 계약 구현, 모델·기능·권한/복구·조작·수명·성능·수동 리뷰·기록 | 구현/계약/실행 지원/운영 활성화를 따로 기록. 미선택 미래 기능 선제 구현 없음 |

새 장르는 별도 플랫폼을 만드는 허가가 아니다. 공통화는 Game-local→재사용 Model/Capability의 실제 필요·반복 근거로 판단하며 Core 편입은 필수성·안정성·낮은 결합을 별도로 검토한다. Profile은 검증된 반복 조합의 recipe이고 장르 상속 엔진·코드 승격 단계가 아니다.

## 8. 승인 계약 보존과 미확인의 분류

### 8.1 이 판단으로 바뀌지 않는 승인 경계

| 승인 경계 | A 재사용할 정확한 의미 |
|---|---|
| 기존 Auth·게임·네 문서 | 기존 Auth/게임 무이관, 기존 public API/SQL/Registry 설정·규칙·UI baseline·유효 override 보존. 실제 상위 변경 때 기존 게임 영향도는 수행하되 MIGRATION_REQUIRED이면 vNext 격리/버전 재설계 |
| STEP4A 전체 완료 | success/error/null/finally/cleanup/leave/effect·후속 작업 전부, 반영 직전 현재성·자기 자원 정리·늦은 자원·재진입·부분 실패·반복 dispose. T01 같은 Room 새 Match/T02 A→B→A/T03 role/view/user 유지. room ID/version만으로 안전 선언 금지 |
| CP0075/D0010 A/C/P | 현재 predicate/잠금 뒤 같은 finalizer transaction의 최종 인가·착수 A, **실제 commit C**, recipient/view/payload별 최종 송신 P 분리. BEGIN/queue/ingress는 A가 아님 |
| 알려진 만료와 늦은 C | known expiry 뒤 새 A 금지. 기한 내 적법한 A를 통과한 **동일 transaction**의 일반 저장 지연 late C만 제한 수용. 다른 명령·별도 transaction/retry/무기한 사전 permit으로 예외 상속 금지. C 관측점을 ACK/A로 바꾸지 않음 |
| 새 송신·retry·owner·terminal | 새 P는 fresh 인가, retry/새 transaction은 fresh A; duplicate 응답도 새 P. owner anchor와 old writer/old sender 보호 유지. 실패 인지 즉시 보호 차단·pause, 최초 t0+60초 정각 abort·retry/restart 초기화 금지·terminal 뒤 LIVE 재개 금지 |
| D0006~10 부분 대체 | D0007 외부 R 이후 차단 상한/최종 transport 인계, D0008 입증된 장시간 정지 한계, D0010 동일 transaction 일반 저장 지연 C 범위를 구분. 정지 예외를 일반 장애/임의 만료 유예로 확대 금지. 통제 가능한 내부 변경의 DB 순서 보호 유지 |
| 기존 수치/운영 | 총100/판8, 세금포함 월추가3만원, 원격 p95≤250ms, 정상망 각재연결≤5초, 모바일5기능, 기록열람·30일삭제·탈퇴 unlink·외부 backup/RPO24h/발견후24h/7일복구점·Free서울·기존 운영시간 조건. 미래 사용량/실청구/실제 달성 UNKNOWN, 공급자 재선정 없음 |
| Registry·Snapshot/Reconnect·Shell | 단일 metadata와 실행 구성 분리; Access/표시값은 backend 권한이 아님. 최종 상태 채택·복구는 선택 모델 내 단일 owner. Shell은 필요한 공통 표시, 실제 공간/HUD/결과 연출은 game-local |
| BGM H1 | 기존 사이트 BGM 본체 재사용+controller 내부 최신 의도/종료/작업 귀속 최소 수명 보완. wrapper 검사만으로 내부 늦은 Audio/DOM 부작용을 보호했다고 인증하지 않음. **H1 무보완 직결 사용 가능 판정 보류** |
| Invite H2~4 | 초대 전 구간 identity·target/admission·사이트 handler/dialog owner 유지. H2 등록/old disposer와 H3 내부 늦은 dialog 완료는 최소 보완/동등 격리·실제 증거 필요. H4 비room 미래 미선택은 전체 blocker 아님 |
| STEP5B 결과·정정 | 실행/경기 종료·공식 결과·참가자 outcome·관전자 표현 분리. producer의 확정/정정과 consumer의 반영·중복/재시도 분리. 정정은 대체 전후 관계이며 새 경기로 중복 집계하지 않음. commit 미상은 새 ID 무조건 재발행 근거 아님 |
| STEP5B 여섯 중복 의미 | action retry; simulation replay/rollback; current snapshot 재적용; UI effect/SFX; 통계/기록/보상 소비; publication 소비. 각 owner/동일성은 승인 STEP5B §4.2 단일 본문 참조. 하나의 version/done flag나 여섯 새 엔진으로 대체하지 않음 |
| 공개·Profile·미래 기능 | merge/기능 구현/activation/공개 사실/NEW·공지 소비 분리. Profile은 검증된 반복 조합 recipe. 미래 보상·정밀 audio·publication/Profile 엔진·비room Invite를 선제 구현하거나 전체 설계 blocker로 삼지 않음 |

### 8.2 설계 blocker, 후속 구체화와 실행 의무

**J 판단:** 현재 확보한 근거와 위 조건 분리로 §3~7의 논리 계승·첫 비보드 내용·둘째 Probe 조건부 필요성 판단안을 제출할 수 있다. 이 범위에 대해 미해결된 전체 설계 blocker는 발견하지 않았다. 이는 사용자 승인이나 정식 결과 PASS가 아니다. 아래 선택별 제한을 모두 함께 유지한다.

| 종류 | 항목 | 처리와 해소 책임 |
|---|---|---|
| 실제 선택 시 설계 blocker | host 자체가 불성립하는 multiplayer 재대결을 기존 의무 대신 채택 | 해당 제품/모델의 상위 변경안과 명시 승인 필요. 현재 미선택이며 두 Probe 승인 범위 재개방 안 함 |
| 실제 선택 시 설계 blocker | 새 인가·권위/순서·수명 의미, 동등 안전11로 설명되지 않는 모델 또는 상위 보장 완화 | 관련 설계 STEP/Astra·사용자 검토. Adapter/local에서 숨겨 구현 금지 |
| 문서 권위 전환 의무 | 실제 DB/장르/모델 적용 범위·전수 destination·CURRENT/Guard/진입 링크 | STEP6/7에서 정식 전환. 이번 하위 초안으로 우회 불가. 지금 설계 연결 자체를 막는 공백은 아님 |
| 제품/모델 구체화 의무 | 실제 게임·목표/종료·입력장치·camera·공간/물리·시간 공백/remote intent 취소·세션/재대결·결과/지속성 선택 | 허용된 Probe GAME_SPEC/선택 모델 설계에서 구현 전 기록. 새 공통 의미가 필요하면 관련 설계로 복귀. 이번에 제품/엔진 동결하지 않음 |
| 구현 의무 | 승인 계약 구현, H1~3의 실제 owner 최소 보완·기존 소비자 호환, 단일 채택/복구, 모든 완료 경로 | 허용된 후속 구현 단계. 문서와 기존 source 존재만으로 지원 선언 불가 |
| 실행/오픈 의무 | 권한/정보 격리·A/C/P·actual C/최종 P·두 client·입력/복귀·T01~03·효과 정정/중복·성능·모바일·수동 리뷰·운영/기록/삭제/복구·비용/기존 회귀 | 전부 NOT_RUN/UNKNOWN. 시험 조건과 실제 oracle를 제출하고 오픈 게이트에서 확인 |
| 미래 미선택 | 비room Invite, 보상/leaderboard·정밀 audio·Profile·3D/전용 물리/리듬 엔진 | 지금 필요성/지원 미선택. 전체 STEP5C blocker로 올리지 않음 |

## 9. 사용자 승인 범위와 승인 후 정식 반영

### 9.1 지금 승인할 핵심 선택

아래 여섯 묶음을 전체 조건·제한과 함께 승인할지 검토한다. 표의 묶음은 §2 판단 ID에 대응하며 상세 본문을 생략한 별도 규칙이 아니다.

1. **S5C-J01 / §2~3:** B01~12 의미별 논리 계승, 원문 ID/강도·부모·조건/예외 보존, 한 의미 한 owner, 신규 보드 적용, STEP6/7 전수 목적지 의무.
2. **S5C-J02 / §5:** 첫 비보드 규칙의 최소6항목과 R01~13 내용. 특히 입력 취소·비가시 복귀·역할/정보·잠정/확정·전체 수명·접근성/검증의 제안 기준, 실제 게임/엔진·수치 미동결.
3. **S5C-J03 / §6:** 둘째 Probe의 기반 경험+모델 조건 우선, 새 경험 의미가 있을 때만 규칙 보완/신설, 실제 게임 미선택.
4. **S5C-J04 / §7:** 공통/장르/모델 연결표, 혼합 장르의 조건/진짜 충돌 구분, 신규 장르 추가 절차 및 단일 owner 참조.
5. **S5C-J05 / §4:** DB 현행 적용과 승인 비DB 동등 안전성의 연결 및 후속 권위 전환, 초기 hostless/재대결 host 불성립/미정 분리. 미래 hostless 재대결 면제나 새로운 상위 보장 변경은 승인 대상에 포함하지 않음.
6. **S5C-J06 / §8~11:** 승인 계약·NOT_RUN/UNKNOWN·설계 blocker/실행 의무·원본/trace·단계별 승인 게이트와 Sol 정식 반영 범위.

핵심 판단 승인, **명시적 정식 반영 허용**, 정식 결과 최종 승인/단계 완료, integration 병합, main, STEP6 진행은 서로 다른 게이트다. 아래 인계 프롬프트가 문서에 있다는 사실 자체는 승인이나 실행 허용이 아니다.

### 9.2 승인 뒤 Sol/Codex가 할 범위

사용자가 §9.1을 승인하고 정식 반영을 명시적으로 허용한 뒤에만 진행한다. 허용된 작업은 승인 범위를 고정하고 최신 integration/유효 작업 상태의 **추가 변경·충돌만** 대조한 후, rebuild 관례의 정식 설계 산출물·원본/trace·필요 현재 기록을 별도 STEP5C 작업 브랜치에서 작성·검증하여 integration base PR로 제출하는 것이다. 기존 유효 STEP5C branch/PR이 있으면 중복 생성하지 않는다.

정식 문서에는 §3 보드 계승, §4 적용 긴장, §5 비보드 내용, §6~7 둘째 Probe/연결/추가 절차, §8 제한·의무, §1/10 trace를 의미·조건·원문 ID까지 보존한다. 문서 분할은 반영 편의이며 새 핵심 판단이 아니다. 입력 원본 두 개와 이 판단 원본을 identity/bytes로 보존하고, 역사 상태를 덮어쓰지 않으며 정식 헤더/현재 기록에서 제출 시점을 구분한다.

정식 결과는 사용자 최종 검토를 위한 **REVIEW_PENDING**으로 제출한다. 핵심 판단 승인만으로 STEP5C COMPLETED를 기록하지 않는다. 계획·DECISIONS·STEP1~5B·과거 checkpoint·기존 Auth/게임/source/SQL·현재 rulebook/Guard는 이 정식 설계 반영의 수정 대상으로 삼지 않는다. 새 의미 충돌이 실제 발견되면 해당 행/원문/영향만 반환하고 전체 조사·구조 재판단·별도 사후 감사를 추가하지 않는다.

## 10. Source trace, 추가 읽기와 문서 검증

### 10.1 기존 근거 재사용

근거 §11의 T01~34와 6개 원문 동일 blob 확인, source/test 5개 기존 STEP3 관찰을 재사용한다. 아래는 판단에 직접 연결한 주요 trace다. 모든 링크는 고정 SHA `2751e9241a3debbd40506fa1b2ea7e688dfe0140`이다.

| trace / source | 고정 blob / 절·줄 | 판단에 사용 |
|---|---|---|
| T02 [STEP1 platform](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md) | `e1a6515b38db0164146ca3a51fc29aae60275c6a`; DEV §3A/6/7/9/10A/10B/13A/15·DB 필수/재대결·GOV | B01~12 ID·부모·원 강도/성격 |
| T03 [STEP1 design](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md) | `981555ea5fab6b3899ebd03599bac7e992f51691`; UI §2/3/5A/6/7~10·GUIDE 경계 | 예시/강도·baseline/override·보드/공통 분리 |
| T05~09 [STEP2 장르 인덱스](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md)·[STEP3 matrix](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md) | `1c1f103adf56a160f1fba8e993cd7c38bbcf09e8` / `0236dccd268617edf14e6158f582cda9b25b8c8b`; 49선택/7축·S3-C02/C08~11 | 범위·둘째 Probe·hostless 조건 |
| T14 [STEP4A 수명](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md) | `5e40988234caba6cb605ea4c0b386a0a5b83b9c5`; §5~8 | R06/08/09, 전체 완료·T01~03 |
| T15 [STEP4B runtime](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md) | `a6cfe51029e3fc3b2b546222b6a6afb0ad428f14`; J01~06, J06 L89~107 | 권위·순서·복구·동등 안전11, CP0075 delta 우선 |
| T17 [CP0075 설계 종료](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md) | `f3232f64c846bf4b17fcea2ae0bf6baed90ffc03`; §1~4/G01~06 | A/C/P·late C·두 Probe 범위·실행 분리 |
| T19~20 [STEP5A 선택](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md)·[owner/보류](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md) | `e80d67aa5a3fa74ffcd441fa977fd4755d6d4c85` / `fb2fa919c12905153360209bb692a3adc626a42c`; §3~4/6~8 | Registry·복구·Shell·BGM H1·Invite H2~4 |
| T21~23 [STEP5B 계약](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5b-contract-boundaries.md)·[Probe/확장](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5b-duplication-and-extension.md) | `fb3c782d6aad08126c452099c6f67441ece20fd0` / `b51394438a5bcedd284892c7552576fc90213f0a`; J01~19/§4.2/§6.1~2 | 공식 결과·정정·여섯 중복·공개·Profile·두 Probe |
| T24 [DECISIONS](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/DECISIONS.md) | `ab4896bd01b591895d0e30946a810c41eaa74e5a`; L1~35/L49~96 및 D0005 | 유효 결정·부분 대체·단말/운영 경계 |
| T25 [Development 원문](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-development-rules.md) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`; L139~154/418~456/562~614/694~724 | 네 문서·8 surface·재대결·상위 변경 |
| T26 [UI 원문](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-ui-rules.md) | `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; §7~10, L344~373 | winner/host 예시와 결과 없는 모델의 연결·반응형 |
| T28 [DB 원문](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-db-test-contract.md) | `ff5eaf6aa5e6459e098d607119033169ac05f5f1`; L15~29/L110~117 | 현행 온라인 범위·11개·재대결 조건 |

### 10.2 결론에 영향을 줄 수 있는 공백만 추가 확인

| 확인 이유 | 추가 읽기/재대조 | 영향 |
|---|---|---|
| B 표의 범위에 selected anchor로 인용되지 않은 sibling이 있어 강도를 통째 MUST로 처리할 위험 | 위 T02/T03의 B01~12 관련 ID만 추출해 부모·강도/성격을 대조. 신규 전체 감사/전수 목적지 작성 아님 | B04의 052 예외·MUST NOT, B06의 REQUIRED_SHAPE/CONTEXT, B09 SHOULD/MUST NOT, B10 REQUIRED_SHAPE 등 보존. 원문147행 전체 재복제 없음 |
| DEV-229의 초기 hostless를 DEV-311 재대결 면제로 읽을 가능성 | T25 §6/§10B, T08 S3-C09 a/b/c/d, T15 J06 L89~107·T17 G06 확인 | §4.2 조건표로 분리. 두 Probe 범위만 해소된 승인 유지, 미래 전면 면제 불채택 |
| UI winner/host의 현재 표현을 모든 게임 필수 domain field로 읽을 가능성 | T26 §9와 T21 J01~04/§4.2, T22 §6.1 연결 | §3 B09~11/§4.3/§5 R10의 조건부 설명. 기존 결과 화면 변경 없음 |
| 수명 요약이 오류/null/finally·늦은 자원 또는 BGM 내부 보완을 빠뜨릴 위험 | T14 §5~6, T20 H1~4, T21 §4.2/표현 owner 재확인 | R09·§8 보존, wrapper/단일 disposed flag를 증거로 인증하지 않음 |
| 과거 strict C/HOLD를 현재 요구로 부활시킬 위험 | T24 D0006~10, T17 CP0075 현재 delta 확인 | §8 A/C/P·실제 C·동일 transaction 제한·최초60초 유지. 기존 공급자/운영 선택 재판단 없음 |
| ‘모바일5기능’의 축약이 구체 기능을 잘못 대체할 위험 | 근거 T18의 `step-4b-verification-specification.md`, blob `91d41480837c6ca3486b28aa1c615177d0fabcea`, T12/T13 L26~27 | 승인된 이동·상호작용·준비·종료·재접속을 §5.5에 그대로 연결. 표본/단말 미확인은 유지 |

추가 읽기는 위 같은 의미 충돌/누락 위험에 한정했다. 새로운 JS/SQL·게임 source 전수 분석, 공급자/요금·운영 조사, 외부 전체 표준/브라우저 지원 확인, 별도 사후 감사를 수행하지 않았다. 근거의 새 E01~03은 제한 사실이며 엔진·전체 표준 준수·실제 지원 인증이 아니다.

### 10.3 문서 검증과 미실행

문서 검사에서 주 절번호 1~11, B01~12·S5C-J01~06·S5C-R01~13 식별, 19개 표의 열 수, 23개 링크 형식과 저장소 링크의 고정 SHA·대상 경로, 입력 두 원본 SHA256 보존을 확인했다. 최소6항목·승인/인계 게이트·조건/미확인의 연결을 본문과 함께 점검했다. 오류를 고친 뒤 문서 정합성 검사 오류 0이다. 이 확인은 행동/CI/지원 PASS가 아니다.

행동/runtime/unit/build/Guard CLI·DB/browser/audio/실제 두 client·성능/모바일·운영 시험은 **NOT_RUN**이다. 기존 UNKNOWN과 구현/실행/오픈 의무를 유지하며 저장소 입력과 원본을 수정하지 않았다.

## 11. 다음 첫 작업과 조건부 Sol/Codex 인계 프롬프트

**다음 첫 작업 하나: 사용자의 §9.1 핵심 판단 검토·승인 여부 결정. 담당 사용자.**

아래 프롬프트는 사용자가 핵심 판단을 승인하고 정식 반영을 명시적으로 허용할 때에만 사용한다. 현재 자동 실행하지 않는다.

```text
Game Platform vNext STEP5C의 Astra 판단안 §9.1 여섯 묶음을
본문의 조건·제한·미확인까지 포함해 승인할게.
이 승인 판단을 정식 설계 문서에 반영하고 문서 검증과 integration base PR 제출까지
진행하도록 명시적으로 허용할게. 담당 Sol/Codex.

입력:
- game-platform-vnext-step5c-astra-judgment.md 실제 원본 전체
- game-platform-vnext-step5c-evidence.md 실제 원본
- game-platform-vnext-step5c-plan-and-handoff.md 실제 원본
저장소 limbit95/limbit95.github.io.
integration feature/game-platform-vnext-integration.
고정 판단 SHA 2751e9241a3debbd40506fa1b2ea7e688dfe0140.

AGENTS→계획1.5→rebuild README→CURRENT→CP0084→실제 PR415/Git 순서로 필요한 상태를
복원하고 최신 integration과 고정 판단 SHA의 추가 변경·의미 충돌만 확인해줘.
STEP5B COMPLETED/DESIGN_RESULT_APPROVED/INTEGRATION_MERGED를 유지하고
과거 OPEN/HOLD/검토대기는 유효 결정·현재 Git과 당시 이력을 구분해줘.
유효한 미완료 STEP5C branch/PR이 있으면 이어 쓰고, 없으면 최신 승인 integration에서
game-platform-vnext 계보의 별도 STEP5C branch를 만들어 integration base PR로 제출해줘.

승인 범위는 Astra §9.1 전체:
§2~3 B01~12 논리 계승과 ID/강도/부모/조건/예외·전수 목적지 후속 의무,
§4 DB/비DB·초기hostless/재대결host불성립/미정 조건,
§5 최소6항목 및 R01~13 첫비보드 규칙 내용,
§6 둘째Probe 필요성, §7 공통/장르/모델 연결·혼합/추가 절차,
§8 보존·blocker/실행 의무, §1/10 trace와 §9/11 게이트를 보존해줘.
rebuild 관례의 정식 산출물·원본 보존·필요 CURRENT/README/checkpoint·문서 검증을 작성해줘.
세 입력의 identity/bytes와 역사 상태를 보존하고 정식 헤더/현재 기록으로 시점을 구별해줘.
문서 분할은 승인 본문의 의미·조건·보류를 exact하게 전달하는 편의로만 해줘.

기존 STEP1~5B/계획/DECISIONS/과거 checkpoint·Auth/게임/source/SQL·현재rulebook/Guard를
고치지 말고 기존 구조·공급자·운영 선택 재판단이나 전수source/SQL 재조사·별도 사후 감사를
추가하지 마. 새 의미 충돌이 실제 있으면 해당 행/원문/영향만 보고하고 그 선택을 멈춰줘.
같은 의무를 여러 문서가 독립 소유하지 않게 하고 STEP2 49조항이나 STEP5C 선택표를
전수 계승 완료로 표시하지 마. STEP6/7 전수 목적지/권위전환 의무를 남겨줘.

기존Auth/게임무이관, 네문서 baseline/유효override/수동gate,
STEP4A 전체완료/T01~03, CP0075/D0010 A/C/P·knownexpiry뒤새A금지·
동일transaction lateC제한/실제C관측·새P/retryfresh인가·owneranchor·최초60초/terminal,
D0006~10·성능/비용/기록/삭제/탈퇴/backup/복원/운영UNKNOWN을 유지해줘.
Registry단일metadata·Snapshot/Reconnect단일모델최종채택/복구·Shell공통/local,
BGM기존본체+내부최소수명/H1무보완직결보류·Invite전구간identity/사이트handler/dialog/H2~4,
STEP5B공식결과/정정/producer-consumer/여섯중복/공개분리/Profile recipe를 보존해줘.
모든게임에 Room/host/DOM/winner/score/XP를 강제하거나 기존multiplayer재대결 의무를
no-op/local우회로 없애지 마. 미래미선택 기능을 전체blocker로 올리지 마.
Adapter안에 새권한/순서/수명/token/audio엔진을 숨기지 마.

검증은 승인본문 대응·ID/강도/조건·절/표/링크·source trace·원본hash·상태·허용diff와
원격 read-back으로 범위에 맞게 해줘. 실제 등록 CI가 없거나 실행되지 않았으면 PASS로 쓰지 마.
정식 결과는 REVIEW_PENDING이며 사용자 최종 결과 검토를 남겨줘.
핵심판단승인을 STEP5C COMPLETED·정식결과승인·행동PASS/지원완료로 확대하지 마.
NOT_RUN/UNKNOWN·구현/실행/오픈 의무를 유지해줘.

실제게임/transport/renderer/tick/physics/prediction 선택, Target/API/schema/file/class/코드경로
동결, 구현·실제시험·운영·구매/문의/job/dump/복원·병합/main·STEP6이후는 진행하지 마.
정식반영 PR의 base/head·허용diff·원격보존·문서검증/미실행·기존게임영향·남은의무를 보고하고
다음 첫 작업을 사용자의 정식 결과 최종 검토 하나로 제시한 뒤 멈춰줘.
```

사용자가 일부만 승인하거나 문구를 수정하면 실제 승인 범위에 맞춰 위 프롬프트를 먼저 좁힌다. 정식 결과 승인/완료 기록과 integration 병합은 이후 각각 명시적 허용을 받아야 하며 main과 STEP6 역시 별도다.
