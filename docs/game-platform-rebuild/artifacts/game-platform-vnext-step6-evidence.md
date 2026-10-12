# Game Platform vNext STEP6 — 판단 근거

작성: Sol/Codex · 2026-10-11 UTC  
문서 지위: Astra 판단을 위한 사실·승인 근거 입력. 승인된 Target, 전수 목적지 선택표, 정식 저장소 산출물 또는 실행 결과가 아니다.

## 1. 입력 원본과 상태 복원

계획 `game-platform-vnext-step6-plan-and-handoff.md`의 **실제 원본 전체**를 읽었다. 원본은 수정하지 않았다.

| 항목 | 확인 값 |
|---|---|
| 원본 identity | `libfile_8c6317f6dd8c819192ba505d8cc23fee` / `file_0000000078c88206a4746d56d9f0cb0f` |
| 원본 경로·크기 | `/청파 같이/game-platform-vnext-step6-plan-and-handoff.md` / 21,260 bytes |
| 원본 SHA-256 | `eab8ae06a0c29517aa28876664403b6ac8bb64087dd5d7e511e51fb6293122a3` |
| 저장소 / integration | `limbit95/limbit95.github.io` / `feature/game-platform-vnext-integration` |
| 고정 기준 및 실제 원격 HEAD | `f34f4f180e14ea36847b9740dea43de2f1325e56` — 대조 일치, 추가 변경 없음 |
| PR416 | 실제 merged; merge `f34f4f180e14ea36847b9740dea43de2f1325e56`; 최종 head `fe1d627f5c6fa39c1f540fcf17dfad22fdd82e18` |
| merge 부모 | `2751e9241a3debbd40506fa1b2ea7e688dfe0140`, `fe1d627f5c6fa39c1f540fcf17dfad22fdd82e18` |
| merge tree·시각 | `6f0dca17d9eb0ee666f237522af7751b2da3f8c6` / 2026-10-11T12:33:50Z |
| 실제 main HEAD | `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09` — 이번 integration 반영 없음, 별도 게이트 |
| 복원 상태 | STEP5C COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED; STEP6 기록 NOT_STARTED |
| 실행 지위 | 행동 NOT_RUN; 기존 UNKNOWN·구현/실행/오픈 의무 유지 |

AGENTS → 실행 계획 개정1.5 → rebuild README → CURRENT → CP0087 → 실제 PR416/Git 순서로 확인했다. [PR416](https://github.com/limbit95/limbit95.github.io/pull/416)과 merge 부모는 현재 병합 증거다. CURRENT/README/CP0087의 OPEN·미병합·이전 마지막 승인 표기는 병합 전 이력이며, 명시된 복원 조건과 실제 Git으로 현재 승인/병합을 복원한다. 기록 파일은 바꾸지 않았다. 각 상태 파일의 고정 blob은 §10에 있다.

## 2. 증거 구분과 읽는 법

- **F 관찰 사실**: 고정 tree/blob, 실제 원문·호출/import·탐지 조건 또는 PR/Git에서 확인한 것.
- **A 승인 요구**: 유효 결정 및 사용자 승인 STEP1~5C의 원문 의미. 소스가 이미 충족한다는 뜻은 아니다.
- **I 추론**: 확인 사실과 승인 요구를 연결한 영향/의존 관계. 새 구조 선택으로 사용하지 않는다.
- **U 미확인/미선택**: 새 목적지·버전·지원 조합 등 Astra 선택 또는 후속 구현/실행 증거가 필요한 것.

R은 기존 승인/trace 재사용, N은 이번 추가 확인, C는 기계적 대조다. **동일 blob은 기존 관찰을 재사용할 근거이지 기존 분석의 모든 공백이나 실행 미검증을 해소하는 근거가 아니다.** 유효 결정/승인 원문 → 원문 적용 보완 → 이 문서 요약 순으로 읽는다. 과거 HOLD·검토 대기·PROPOSED는 당시 헤더와 이후 승인/대체 범위를 함께 읽는다.

§13은 STEP1 전수 원문 행을 재사용한 입력 부록이다. 각 source 절의 원문·강도·조건·부정·예외와 기존 E owner/이력 분류를 보존한다. 분류는 Target 책임 선택이 아니다. 이 부록을 전부 새 MUST 목록이나 전수 목적지 완료표로 사용하지 않는다.

## 3. E1~6 근거표

| 묶음 | F / A 재사용·새 사실 | I 판단에 미치는 영향 | U Astra 선택/정확한 공백 |
|---|---|---|---|
| E1 승인 연결·충돌 | STEP2 7축/네 문서, STEP3 전환, STEP4A 전체 수명, STEP4B 현재 적용, STEP5A 본체/Adapter/local, STEP5B 소비/확장, STEP5C B/R 연결. CP0075/D0010 부분 대체가 현재 우선 | 같은 수명·권위·복구를 여러 엔진이 독립 소유하면 승인 계약과 충돌. 현행 DB/host/문서 권위와 새 적용 조건은 전환 대상으로 남음 | §4의 실제 범위 긴장·전환 영향만 판단. 완료된 공급자/운영 선택 재판단 없음 |
| E2 전수 계승 입력 | STEP1 26문서/3,232 ID; K1,198/L906/H562/I566. §13 전체 원문 행과 source heading/blob, §5 논리 후보 | K를 Core에 일괄 편입하거나 L을 공통 장르로 승격할 수 없음. 49/B01~12는 전수 모수가 아님 | 모든 ID·의미 조각의 목적지/참조·검증 대응, 정확한 부모 ID/분할 연결은 아직 미선택·미완성 |
| E3 세 요청 추적 | 공통→장르→네 문서→모델→검증을 §6에서 조건별 연결. 신규 게임/모델 선택은 하지 않음 | roomless/local/async와 realtime 경험은 장르명으로 동일 기술을 강제할 수 없음 | 각 조합의 계약상 성립·미지원 조건, 미선택 제품 정책이 특정 구현을 막는 범위 |
| E4 경로·공존 | Guard direct games 디렉터리(shared 제외), flat shared 새 JS 탐지, flat 테스트 glob; site 빌드/import 진입 및 기존 게임 barrel import 확인 | `games/core` 등 direct 경로는 게임 오분류 위험. nested shared는 syntax 검사와 새 모듈 정책 탐지가 다름 | 물리 경로·탐지 확대·새 export의 기존 소비자 격리 방법. 경로 추가 전에 필요한 탐지 조건 |
| E5 버전·권위 | 현행 RULEBOOK/UI 경로 literal, CURRENT/HISTORY, templates/bootstrap, Registry 구조, Invite VERSION=1, legacy SQL bundle v1.0.0 | 설계 승인·구현 완료·CURRENT 권위 적용은 다름. 기존 특정 버전을 전체 vNext 계약 버전으로 쓰면 범위 혼동 | 버전 식별/호환 정책과 새 권위, STEP7에서 함께 바뀌어야 할 최소 원자적 연결 |
| E6 Slice·검증 | 실제 workflow/test discovery, 승인 T/안전11/수명/H/R/운영 oracle, 모든 행동 NOT_RUN. 현재 CI 시간 제한은 §9에 있음 | 권위/탐지 기반 없이 새 모델·게임 추가는 검증 공백. 실행 환경/표본은 문서상 설계 성립과 분리 | Slice 순서·테스트 예산·중단 조건. 실제 지원 기기/망/배포 bytes와 측정값은 후속 U |

## 4. E1 — 승인 책임 연결과 범위 긴장

### 4.1 재사용하는 단일 책임

| A 승인된 의미 | 승인 원문 / 연결 | Target 판단에 넘길 범위 |
|---|---|---|
| Core 최소 공통/수명; 선택 runtime/model의 시간·세션·권위·순서·최종 채택/복구; backend 권한 집행 | STEP4A responsibility/lifetime, STEP4B runtime J01~06, STEP5A Snapshot/Reconnect | 공통 invariant와 모델 구현을 연결하되 최종 채택/복구 owner를 둘로 만들지 않음 |
| Site Adapter는 기존 Auth/route/정책/metadata·Invite/BGM 연결; game-local은 규칙·VI·실제 UI/결과 연출 | STEP4A, STEP5A 8대상 선택 및 중복 기준 | Adapter에 새 권한/순서/수명/token/audio 엔진 숨김 금지. Registry는 단일 metadata |
| 성공 이외 전체 완료 경로와 적용 직전 채택 조건 | STEP4A lifetime §§6~7 | success/error/null/finally/cleanup/leave/effect/후속 비동기 완료; 부분 초기화·반복 dispose·late resource. T01 같은 room 새 match/T02 A→B→A/T03 role·view·user |
| Result producer와 consumer, 공식 결과/정정/개별 outcome/viewer 표현 분리 | STEP5B contract §§3~5 | 공식 정정은 새 경기 집계 아님. 결과 없는 게임에 winner/score/XP 추가 금지 |
| 여섯 중복 의미와 공개 단계 분리 | STEP5B duplication/extension 및 contract §4.2 | action retry/simulation replay/state reapply/effect/stat·reward/publication의 서로 다른 scope. merge/구현/activation/공개 사실/NEW·공지 소비 분리 |
| 경험 규칙과 기술 모델 분리, 한 의무의 본문은 한 owner | STEP5C board §2~4, realtime §5, connections §6~8 | B01~12/R01~13은 승인된 논리/내용; 경로·버전·CURRENT 전환·구체 기술은 미선택 |
| Profile은 실제 검증된 반복 조합의 recipe | STEP5B J17~19/extension, STEP5C connections | 반복 전 Profile 필수화·선제 엔진 없음. 미래 미선택이 전체 blocker가 되지 않음 |

### 4.2 Astra에 넘기는 실제 충돌/전환 행

아래는 새 위반을 발견했다는 판정이 아니라 현재 원문과 승인 설계가 만나는 **조건별 긴장 또는 전환 연결**이다. 기존 승인 의미 자체를 새로 선택하지 않았다.

| 행 | F 현행 원문/소비 | A 승인된 범위 | I 영향 / U 선택 |
|---|---|---|---|
| X01 권위 본문 | development §17·AGENTS·governance·templates는 development/UI 현재 rulebook을 참조. Guard RULEBOOK_PATH 및 literal 검사 | 공통/장르/모델 분리, topic-owner 참조; 아직 CURRENT 전환 없음 | 새 본문·인덱스를 현재 권위로 적용하려면 진입/링크/Guard/test의 최소 연결을 함께 정해야 함. 경쟁 CURRENT 2개 허용 불가 |
| X02 온라인 DB 범위 | LEGACY-DB-006 등 모든 신규 온라인 DB 계약; Guard online shared→game별 DB test | STEP4B J06·STEP5C §4.1 비DB 안전11 동등 입증, 면제 없음 | 비DB 상세를 DB RPC 형태로 강제하지 않되 현행 하위 우회도 불가. 적용 범위 정식 전환/모델별 동등 oracle이 구현 선행 조건 |
| X03 hostless 조건 | DEV-299~311/DB-038~044/UI-190~198·AGENTS의 multiplayer 재대결/host·ready | STEP5C §4.2 초기 hostless/재대결 host 불성립/미정/solo 구분 | 초기만 hostless이며 재대결 충족은 성립 가능. 재대결에도 host 의미 불성립을 실제 선택하면 상위 변경 승인 필요. 정책 미정은 NA 아님; solo는 의미상 비적용 |
| X04 이전 strict C oracle | 원래 STEP4B verification T01~03은 실제 C deadline 문구를 갖는 이력 | DECISIONS D0010, z1-closeout §§2~3 현재 적용 | 오래된 시험 표를 그대로 현재 oracle로 복제하면 충돌. 실제 C 관측은 유지하되 기한 내 lawful A 동일 transaction late C 제한 수용. 새 A/P/retry 인가는 별도 |
| X05 경로/탐지 | directgames는 shared 외 게임; 새 shared 정책은 flat JS; flat policy/test 발견 | Target 경로는 Guard/build/import 증거 뒤 선택 | nested shared 선택 시 해당 정책/테스트/문서 탐지 확대가 경로 추가에 선행. direct core/model/profile 후보는 game 오분류 해결이 필요 |
| X06 기존 consumer 공존 | shared/index barrel를 cant-stop/app·no-thanks/main이 실제 import; site Auth 및 game-local 연결 유지 | 무이관/기존 API·SQL·게임 보존; 신규 소비자와 책임 경계 | 새 export/import graph가 기존 소비자 초기화/정책을 바꾸지 않는지 후속 확인. 새 barrel 선택·새 경로를 이번에 고정하지 않음 |
| X07 BGM/Invite | 기존 본체와 game/site 연결은 STEP5A trace 재사용 | H1 내부 최소 수명 보완 전 무보완 연결 보류; H2~3 identity·handler/dialog owner 보호; H4 비room 미래 미선택 | 기존 본체 사용 가능성과 현재 무보완 구현 사용 가능을 동일시하지 않음. 내부 보완을 새 Adapter 엔진으로 포장 금지 |
| X08 과거 drift | STEP1 C01 No Thanks! 과거 DEVELOPMENT/활성 Registry 불일치; C02 README 10 vs 안전 runner 11 | 과거 기록 보존, 유효 원문·실제 11개 계약 우선 | 새 Target 기준을 오래된 기록에서 추정하지 않음. 이번에 기존 문서/게임 수정 없음 |

범위 내 확인에서 새 승인 의미 충돌은 추가 발견하지 않았다. 위 조건은 이미 승인 문서가 남긴 전환/미선택을 현재 탐지와 연결한 것이다. 의미 충돌이 없는 항목까지 별도 감사·재조사로 되돌리지 않는다.

### 4.3 CP0075/D0010 현재 적용 — 과거 문구 대체 범위

**A:** 최종 인가·착수 A는 필요한 owner/command lock 획득 후, 동일 finalizer transaction에서 현재 predicate를 확인한 뒤 실제 command storage를 시작하는 경계다. ingress/BEGIN/queue는 A가 아니다. lock wait 뒤 낡은 allow를 재사용하지 않는다. 알려진 만료 뒤 새 A 금지, 처음부터 무권한 허용 금지, 새 command/새 transaction/retry는 fresh A다.

기한 내 적법 A를 지난 **같은 transaction의 일반 저장 지연 late C만 제한 수용**한다. C는 실제 commit이며 A의 시각으로 대체하지 않는다. actual C deadline에 관한 D0007/08 및 Z1 HOLD 일부만 D0010이 대체한다. 입증된 after-check 장기 정지의 D0008 한계와 일반 I/O late C 수용은 서로 다른 범위다. 새 P/ACK/duplicate/snapshot의 recipient·session·view·payload 최종 fresh 인가와 transport 인계 경계는 그대로다.

owner anchor는 C/rollback까지 유지한다. old writer와 old sender 보호는 각각 남는다. 권한 불명/실패 인지 시 보호 입력·출력 차단/pause, 최초 t0+60초 deadline과 retry로 초기화 금지, terminal 뒤 LIVE 부활 금지를 유지한다. STEP4B z1 §3의 T01~14/B01~07 현재 delta를 원래 명세와 함께 읽는다. 시계만으로 인과/transaction 동일성을 증명할 수 없고 trace 누락은 INCONCLUSIVE이며 안전성 위반을 percentile로 면제하지 않는다.

## 5. E2 — 전수 계승 입력표와 남은 연결

### 5.1 모수와 조건 보존

| F 기계적 재확인 / A 기존 의미 | 값 / 해석 |
|---|---|
| STEP1 원문 기준 | `132ec1576e316d0238c9ca6e07d0d3ab91950ec8` |
| 전수 원문 문서 | 26개; games Markdown 14개 포함 |
| 안정 ID | 3,232개, 고유 ID 3,232개 — §13 네 원문 표 전체 |
| K/L/H/I | 1,198 / 906 / 562 / 566 |
| 규칙·필수 형식·필드 / 그 외 | 2,104 / 1,128. 독립 MUST 또는 중복 제거 개수가 아님 |
| 원문 분류 | P897/B11/M-ROOM30/M-DB114/M-DOM11/M-INVITE7/S128/L906 |
| P 안의 보드 전제 | R01-BOARD 38행. 공통 의무에서 자동 제거하지 않음 |
| 중복·긴장 | D01~10의 141행; 기존 C01/C02, C03 범위 긴장·U01~03. 의미 통합은 원본 ID 삭제가 아님 |
| 기존 source inventory 대조 | 89행/88고유 경로. 85행 동일 blob, 계획/README/CURRENT/DECISIONS 4행 변화. 26 원문 문서 blob 동일 |

원 inventory의 code/test/workflow 경계도 동일 blob인 행에 한해 재사용한다. 이 결과는 저장소 전체 SQL/모든 파일의 완전 감사가 아니다. 변경 4개는 승인 진행·결정 축적이며 §1 현재 상태와 §4 D0010으로 읽었다. 이전 source의 조건/예외를 현재 행으로 재작성하지 않았다.

### 5.2 전수 행에 적용하는 필수 열

| 요구 열 | 이 근거에서 실제 확보한 입력 | U Target 판단에서 닫을 것 |
|---|---|---|
| ID·출처 SHA/절/줄/blob | §13 각 source heading과 모든 안정 ID/원문 L범위; §10 inventory 대조 | 원문 의미 조각을 참조할 최종 목적지 연결 |
| 강도·의도 | 원문 및 원 강도 열의 MUST/MUST NOT/SHOULD/서술형/REQUIRED_SHAPE/CONTEXT 구분 | 강도 변환을 임의 수행하지 않고 의도/적용 의미 연결 |
| 부모·조건·예외 | 전체 source 소제목/도입문/sibling과 원문 부정·조건·예외; 첫 ID·줄 열에 명시 부모 표기 305행, 모든 부모 ID 존재 확인 | 별도 부모 열은 없지만 **기존 명시 parent-ID는 실제 포함되어 있다**. 평면 항목의 의미상 부모/조건과 새 분할 조각 연결은 원문 문맥으로 판단해야 함 |
| 현재 책임·소비 | 원 STEP1 E-* 코드 및 clause-index E owner 표, 기존 regression/new game 열 | E-*를 새 Core/API owner로 자동 승격하지 않음 |
| 새 책임 문서·절 | K는 **미선택**. B01~12와 승인 STEP4A~5B 해당 논리 후보만 연결 | 각 K/분할 조각의 정확한 새 본문·절/참조 및 적용 범위 |
| 유지·세분화·보강·참조 전환 | 원 K/L/H/I 보존, B 표의 기존 논리 분할/참조 | 각 조각 전환 방식과 조건. 독립 본문 중복 없는지 판단 |
| 검증 증거 | E-* 기존 위치, STEP3/4A/4B/5A/B/C 후속 oracle | 실제 PASS 없음. 목적지 문서 검증과 후속 행동 증거 요구를 별도 연결 |

원문에는 명시 부모 표기 305행이 있으며 부록에서 그대로 보존했고, 참조 부모 ID는 모두 전수 모수 안에 있다. 나머지 행에 표기가 없다는 이유만으로 부모 누락이라고 단정하지 않는다. 다만 평면 목록도 source 도입/절 강도에 종속될 수 있다. 예를 들어 DEV-053의 UI_DECISIONS 설명과 이어지는 DEV-055~059 항목은 함께 읽어야 하지만 이 자료가 자동 parent-ID를 새로 부여하지는 않는다. 정확한 의미상 부모/조건과 새 분할 연결은 Astra의 전수 목적지 작업에서 **해당 원문 문맥을 잃지 않는 연결**로 닫을 항목이다. 한 문단에 여러 의미가 있으면 문단 ID를 보존하고 의미 조각별 목적지를 남겨야 한다. 현재 새 fragment ID나 최종 목적지는 만들지 않았다.

L906은 기존 game-local/개별 consumer 범위 보존, H562는 당시 이력, I566은 문맥/예시/범위 밖/제어로 표시한다. 삭제 대상이나 신규 MUST로 취급하지 않는다. K1,198의 분할 목적지를 닫아도 전체 L/H/I 보존·참조와 신규 승인 요구의 위치가 누락됐는지 함께 확인해야 한다. STEP2 49개와 STEP5C 147 anchor/B01~12는 전수 소진 목록이 아니다.

### 5.3 승인된 B01~12 논리 후보

다음은 STEP5C의 이미 승인된 표를 그대로 재사용한다. J는 원문 작성 당시 표기이며 현재는 승인된 논리 판단이다. **Target 물리 문서·절 선택표는 아니다.** 아래 source-ID 묶음 이외 K도 전수 입력에 남는다.

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

B01~12 바깥의 기존 K는 STEP1 원 범위/강도를 보존한 미선택으로 남긴다. STEP4A/B·5A/B의 이미 승인된 topic-owner와 적용 조건은 §4/§7~9의 참조 후보이며, 이를 개별 전수 ID의 새 목적지가 확정된 것으로 표시하지 않았다.

## 6. E3 — 세 요청의 코드 없는 추적

표의 **필요/조건부/비적용/미선택/미지원**은 문서상 적용 설명이다. 실제 게임 선택, 새 bootstrap 생성 또는 지원 인증이 아니다. 각 요청은 공통 절차에서 시작하고 선택 경험/모델의 해당 의미만 연결한다.

### 6.1 신규 보드게임

| 순서 | A 연결 입력 / 필요 | F/I 적용 추적 | U·비적용·후속 증거 |
|---|---|---|---|
| 공통 절차 | AGENTS·현행 development/UI → B01/B04/B05/B12 | 원문 조사·제품/규칙/VI·권리→네 문서→작은 구현/검증→수동 gate/기록 | 신규 제품/판본/권리 실제 조사 필요; 이번에는 제품 선택/외부 조사 없음 |
| 장르 | B01~12의 보드 의미 + 공통/모델 참조 | 판본·규칙 해석·구성물·정보 공간·웹 adaptation 조건 | 존재하지 않는 카드/중앙 보드 예시는 강제하지 않음; local 규칙 L을 공통으로 승격하지 않음 |
| 네 문서 bootstrap | GAME_SPEC/DEVELOPMENT/UI_DESIGN/UI_DECISIONS 역할·baseline/유효 override | doc-only 4파일은 등록 전 bootstrap 가능. runtime 추가 시 Registry 등 적용 | 실제 문서 생성 없음. 최종 진입 경로·버전·장르 연결 위치 U |
| 모델 | STEP2 7축; B06~10 및 STEP4B/5A | Room/DB 모델을 실제 고르면 8 surface·안전11·version/invalidation/snapshot/rematch 의미 적용 | 보드라는 이유로 Room/host/DB/DOM 선택 금지. 비DB 선택은 X02 정식 전환 필요 |
| 공통 기능 | Registry/Access·선택 Shell/Invite/BGM·결과 소비 | 동일 metadata 및 기존 본체, selected model 단일 최종 채택·복구 | H1~3 무보완 연결 사용 가능 아님. 결과/관전/Invite가 없으면 이유와 적용 정책 기록 |
| 검증/완료 | 수명 T01~03·안전·선택 UI/모바일·회귀·운영 | 네 문서 추적과 실제 browser/manual/DB 또는 동등 모델 증거 분리 | 실행 NOT_RUN; 지원 표시는 적용 oracle 충족 뒤. multiplayer 재대결은 no-op 면제 불가 |

### 6.2 실시간 2D 온라인 협동 — 첫 비보드 Probe 범위

| 순서 | A 연결 입력 / 필요 | F/I 적용 추적 | U·비적용·미지원·후속 증거 |
|---|---|---|---|
| 공통 절차 | B01/B04/B05/B12·기존 site 정책 | 공통 조사/권리/네 문서/수동 gate를 재사용 | 실제 게임·기기·세계/목표 미선택 |
| 장르 | STEP5C 최소6항목 및 R01~13 | 지속 input/취소, 공간·camera, 시간 분리, hidden/복귀, 역할/visibility, 시작/종결, 복구, 수명, 잠정/확정, 접근성/성능 | 2D/온라인 명칭만으로 renderer/transport/tick/physics/prediction 선택 금지. 경쟁·정밀 리듬·3D·대규모 장기 세계는 이 초안 지원 선언 밖 |
| 네 문서 bootstrap | realtime §5.4의 4문서 보완 | GAME_SPEC는 7축·input/복구/제품정책·미지원; UI_DESIGN은 공간·HUD·조작·초기 baseline, 이후 변경은 UI_DECISIONS | 템플릿/진입 전환 연결 U; 실제 bootstrap 없음 |
| 모델 | STEP4B J01~06·CP0075/D0010·STEP5A 단일 owner | 승인 권위/인가 구조, current checkpoint+후속갱신/quiet loss/gap, input ready와 LIVE 의미 연결 | stream≠DB invalidation; 선택 model 계약의 적용 지점·cancel 손실/원격 intent 종료 의미 U. 임의 timeout/tick 새 고정 금지 |
| 공통 기능/제품 조건 | H1~4·공통 Shell/local HUD·STEP5B 결과/효과 | 초기 hostless/재대결 충족과 재대결 host 불성립/미정을 구분; 예측 결과는 확정 소비 아님 | 실제 start/rematch/종료·result/관전 정책 U; H4 미선택이 전체 blocker 아님 |
| 검증/완료 | realtime §5.5·R01~13·안전11·T01~03 | 입력취소/hidden/camera전환·두 client·권한/복구·성능/모바일·수동 gate·운영 oracle | 문서 추적 성공은 실행 지원이 아님. 총100/판8·p95≤250ms·정상망 각복구≤5초·모바일5기능 유지; 실제기기/표본 U |

### 6.3 방·host 없는 독립 게임 — 둘째 Probe의 local 또는 비동기·기록형 범위

| 순서 | A 연결 입력 / 필요 | F/I 적용 추적 | U·비적용·후속 증거 |
|---|---|---|---|
| 공통 절차 | 조사/권리·네 문서·수동 gate·site 조건 | roomless도 새 게임 절차와 run/view/resource 수명은 유지 | Room 없는 것이 site Auth/권한 정책 전체 면제를 뜻하지 않음 |
| 장르 | STEP5C §6 기존 경험규칙+모델조건 우선 | 보드 경험이면 해당 B 참조, 지속공간이면 R 적용. 경험 차이가 설명되지 않을 때 별도 장르 필요 | 별도 장르를 선제 작성하거나 actual Probe 게임 선택하지 않음 |
| 네 문서 bootstrap | 역할/시간축은 동일; 실제local/async의 7축·비적용 이유 | GAME_SPEC에 run/저장/종결·상위권한/미지원, UI는 실제조작·복귀·기록표현 | 최종버전/경로·새경험규칙 필요 여부 U |
| pure local 모델 | 실행/run 수명·종료/새run·local 보존한계 | Room/host/ready/온라인RPC/multiplayer재대결은 의미상 비적용 가능. 가짜Room·no-op8surface 불필요 | 실제저장손실/새run/late완료 격리 증거 NOT_RUN. local은 multiplayer의무 우회 수단이 아님 |
| async/보호기록 경계 | 선택 persistence/model/backend·안전성 | 보호된 기록 제출/조회가 있으면 그 온라인경계의 인가/권위/중복/복구 적용. client local결과를 서버가 무조건 신뢰하지 않음 | 제출권위/검증/공식결과 여부·기록정정/수명 U. online:true와 현행Guard DB전제 X02 필요 |
| 검증/완료 | Room 없는 T01~03 대응·해당결과/표현/기록·회귀·운영 | run/맥락전환·A→B→A·role/view/user·cleanup·late resource 등에 동일 invariant 대입 | 실제 실행·지원 NOT_RUN. 미지원조합/모델계약 공백만 차단하고 미래보상/Profile을 전체 blocker로 올리지 않음 |

## 7. E4 — 실제 경로·탐지·import·빌드·공존

### 7.1 확인한 기계적 경계

| F 소스/심볼 | 실제 발견/검사 범위 | I 경로 선택에 필요한 조건 / U |
|---|---|---|
| Guard `platformGameIdFromPath`, `readDirectoryNames`, `gameDirectoriesAtRef` | games의 첫 하위 디렉터리를 game으로 해석; shared만 제외. 직접 game디렉터리 전체를 4문서/Registry 검증 | games/core·models·profiles를 고르면 게임 오분류 해소가 먼저 필요. 이 경로를 권고/동결하지 않음 |
| Guard `validatePullRequestChanges` flat shared regex | 새 `games/shared/[^/]+.js`(index 제외)에 문서·tests/game-platform-* 변경 요구 | nested shared 새module은 같은 regex에 잡히지 않음. 탐지 확대·새테스트 discovery가 추가 전 선행해야 함 |
| Guard `readPlatformPolicyDocuments`·class/path regex | flat docs/game-platform-*.md·flat games/*.md; CURRENT/HISTORY 분류/현재rulebook literal 등 | 중첩 genre/model/rebuild artifact는 현재policycontent 탐지와 다름. 새권위문서의 발견·분류·reference 범위를 정해야 함 |
| Guard `validateRepositoryState` | directgame 4문서 필수절/교차참조·href·Registry/online DBtests | doc-only exactly4bootstrap 허용과 runtime추가 등록의 경계 보존. 온라인을 model별oracle로 바꿀 전환 범위 U |
| governance workflow | games의 재귀 JS node --check, community module link, flat platform tests, Guard base/head | nestedJS syntax검사는 존재하지만 새module정책/중첩tests semantic discovery를 대신하지 않음 |
| package.json `test:game-platform` | `node --test tests/game-platform-*.test.js` | 테스트디렉터리 중첩 선택시 현재glob만으로 발견되지 않음. selectedtestsource≠실행PASS |
| `check-community-modules` | js/app.js·recursivejs/*.js, relative imports existing/.js/index.js resolution. games page는 stub/제외 | 사이트 import를 통해 도달한 shared는 link 가능하나 모든 게임entry 자동발견 아님. query/hash 제거는 실제 cacheversion검증 아님 |
| `build-community-assets` | js/app.js entry, ESM splitting es2022, assets build/index/manifest | site build와 게임 runtime 전체 bundling을 동일시하지 않음. 실제build는 수행하지 않음 |
| `build-liar-canonical` | legacy liar SQL canonical manifest v1.0.0와 생성/check | vNext Target/모델 계약버전·빌드 경로의 본체 아님. 실행·SQL감사 없음 |
| playwright config | tests/e2e, Chromium desktop·WebKit iPhone15 emulation, 정적server | 실제 Windows10/11 Chrome·Edge/iPhone Safari 기기인증 대체 불가. nestedunit/DBcoverage와 별도 |

### 7.2 기존 consumer 격리 사실

**F/N:** cant-stop/app.js와 no-thanks/main.js의 첫 import 구간은 Gate/Shell을 `../shared/index.js`에서 가져오고 site Auth/supabase/profile 및 game-local runtime/presentation/audio/BGM을 직접 연결한다. shared/index.js는 Registry/Gate/Room/action/Snapshot/trigger/Shell/Invite를 flat reexport한다. Registry에는 legacy 3게임과 shared 2게임이 있고 platform/flags/href projection이 있다. Invite는 game_room envelope VERSION=1이다.

**A:** 기존 Auth/게임·public API/SQL·현재 네 문서·legacy 보호는 무이관/무변경. Registry의 metadata 두 번째 목록을 새로 만들지 않는다. 실제 선택 기능만 연결하고 game-local UI/연출은 공통본체 중복으로 오판하지 않는다.

**I/U:** 새경로/새barrel/reexport는 기존 import graph에 영향을 줄 수 있으므로 격리 경계와 opt-in 소비자를 명시해야 한다. 현재 import 관찰만으로 side effect 없음을 실행 증명한 것은 아니다. 한 flatshared 본체를 계속쓰거나 새vNext책임을 병존할 때 각각적용consumer/API/권위경계를 판단해야 한다. 모든 legacy source를 다시 읽어야 한다는 의미는 아니다.

## 8. E5 — 계약 버전·CURRENT 권위·원자적 연결 입력

### 8.1 현재 식별자의 의미

| F 식별/권위 | 실제 범위 | U 남은 Target 선택 |
|---|---|---|
| 실행 계획 개정1.5·고정SHA·artifact 승인기록 | 재구축 단계/설계 승인과 고정입력 식별 | 이것만으로 runtime compatibility version 정의가 되지 않음 |
| development/UI rulebook CURRENT, background HISTORY | AGENTS/guide/template/Guard가 current path를 문자로 참조 | 새공통/장르/모델 본문의 topic-owner/인덱스·구버전 보존과 적용시점 |
| fourdocs bootstrap·baseline/유효override | 기능현재·개발진행·초기UIbaseline·후속디자인결정 시간축 | game가 참조할 선택모델/장르/계약버전식별 방식과 변경재검증 조건 |
| Registry `defineGame` 반환형 | id/title/href/icon/description/buttonText/flags/platform; 이 반환형에 vNext model/contractversion 없음 | 승인metadata 단일성 유지하면서 어떤 configuration을 어디서 참조할지 U. 두번째catalog 금지 |
| Invite VERSION=1 | game_room token/envelope 호환 | 플랫폼전체버전으로 승격하지 않음. H2~4/identity를 유지하며 선택범위만 연결 |
| legacy canonical v1.0.0 | liar SQLbundle manifest의 국소버전 | vNext API/schema/클래스/전역semver로 사용하지 않음 |

선택 모델의 권한·순서·수명 의미를 변경하는 계약 호환과 단순 파일/format version은 별개다. 실제 새 버전체계·호환정책·파일을 이번에 선택하지 않는다. 관찰한 반환형/상수 외 저장소 전체에 버전이 없다고 주장하지 않는다.

### 8.2 STEP7 실제 전환 전에 함께 연결할 사실

| 연결 묶음 | F 현존 소비/가정 | A/I 함께 정합화할 최소 의미 / U 판단 |
|---|---|---|
| 권위/발견 | AGENTS·development§17·governance·gamesREADME·templates·flatpolicyreader | 한 topic의 current owner, 상위인덱스→공통/장르/모델→game선택 참조가 끊기거나 old/new경쟁하지 않도록 전환계획 필요 |
| 적용/조건 | DB전체online·room/host/rematch·UIwinner표현·구체invalidation전제 | 공통invariant와 model상세 분리의 승인조건을 유지. 상위의무변경 선택은명시승인, game/Adapter 자체예외 불가 |
| Guard/테스트 | game경로·newmodule regex·requiredsections·링크 literal·DBtest조건·source문자assertion | 변경대상policyreader/workflowpaths/discovery/assertion이 새권위·경로를 동시에 설명해야 함. Guard가새경로를보호하지못하는기간에runtime추가금지 |
| 기존자산/버전 | 현재API/Registry/barrel/legacyroots와두sharedconsumer | 이전consumer는현재계약보존. 신계약opt-in/참조·버전변경영향과회귀조건명시 |
| 조항/참조 | 모든K및분할조각·L/H/I·신승인본문·template보강 | 같은의미의독립현재본문복제금지. 새목적지없음/강도완화/불발견경로는전환gate를못닫음 |

이는 원자적으로 일관돼야 할 **연결 사실**이다. 전체변경을 무조건 한PR/한commit에 넣는 실행선택이나 실제 권위전환이 아니다. 최소 Slice 묶음과 안전한 적용순서는 Astra가 정하고 STEP7의 별도 허용뒤 실행한다.

## 9. E6 — Slice·테스트 예산 판단 입력

### 9.1 승인된 검증 의무, 환경과 증거

| A 검증 묶음 | 요구 증거 / 현재 F | U 후속 구현·실행 의무 |
|---|---|---|
| 조항/Target 문서 | 모든ID·원강도·부모조건/예외·분할조각목적지·reference·세추적·원본hash·허용diff | 이번자료는입력확보까지만. 새Target대응문서검증/동결게이트 남음 |
| 수명/모델 | STEP4A 전체완료/T01~03·apply직전현재owner/context/권한/order·late자원정리 | unit/model사건oracle·실제두client전환 모두NOT_RUN |
| 권위·인가·순서·복구 | 안전11·A/C/P·currentview·actualC·owneranchor·freshretry/P·knownexpiry·최초60초·terminal | 원천R/lock/A/실제C/P·transaction·command/hash·view/incarnation/revision·시계오차trace. currentdelta는z1§3 우선 |
| snapshot/stream | initial/live race·gap/overflow/quiet loss·ACKloss·duplicate·복귀 | 연결성공≠LIVE. selectedmodel단일adoption/reconciliation 증거NOT_RUN |
| H1~4/표현 | BGM내부수명·Inviteidentity/handler/dialog·Shell/local·결과/정정·각중복scope | fakeAudio/unit과실제browser/audio별도. 미지원기능을wholeblocker로승격하지않음 |
| 두Probe/장르 | 보드B조건·첫ProbeR01~13·둘째local/async적용·hidden/cancel/camera/role | 실제게임/제품정책은후속선택. WCAG전면/브라우저인증없음 |
| 성능/모바일 | 총접속100(로비/관전포함), 판최대8, 원격권위feedback p95≤250ms, 정상망각복구≤5초, 이동/상호작용/준비/종료/재접속 | exact기기/망/측정구간·rawsamples·오차·실제CPU/RAM/traffic/quota U. FPS나predictionframe은원격권위측정대체아님 |
| 지원환경 | D0005 Windows10/11 Chrome·Edge, iPhone Safari; 승인scope의모바일기능 | 정확한OS/browser/build/device·배포SDK/CLI/Authserver/게임서버/loadedbytesmanifest U. emulatedWebKit은실제기기대체아님 |
| 운영/오픈 | D0006~10 성능/비용/기록/삭제/탈퇴/backup/복원·상위운영조건 | 운영/실측 UNKNOWN; 환경·권한·삭제inventory·backupmanifest·복원ACL·비용meter·open증거필요. 이번엔실행없음 |

**A 운영 조건 재사용:** 추가 월비용 세금포함 3만원 이내, 참가자기록접근·최초종결기준30일삭제·탈퇴본인연결해제/타참가최소기록원래deadline, 외부backup RPO≤24h 목표·discovery→authorized recovery≤24h 목표·7일복구점, 기존 Free/서울운영조건. 표의 목표/조건을 현재실측지원으로 쓰지 않는다. 장기정지/동시저장실패의 승인한계와 UNKNOWN은 원문범위를 유지한다. 공급자·요금·운영정책의 재결정/새약속 없음.

현재 verification T12의 warm-up후조건별60분/입력1000개/재연결30회 등의 표본은 **제안 후보**이며 승인된 의무/예산으로 승격하지 않는다. 기존허용한계의 지연/사례수는별도보고하고 실패/timeout/drop을성공표본에서숨기지 않는다. 실행못한CI도PASS로쓰지않는다.

### 9.2 실제 실행 발견/시간 제한 — 예산과 구분

| F 실행 정의 | 등록 범위/현재 제한 | 판단 입력과 한계 |
|---|---|---|
| governance workflow | PR paths 기반; Node22; timeout5분; 재귀node syntax/link/flatplatformtest/Guard | currentCI5분은전체vNext시험예산아님. nestedpolicy/test새발견필요 |
| game-db integration workflow | Node22·CLI2.115.0·격리local환경; tests/game-db-integration/*.test.js; timeout15분·always stop/no backup | 운영시험/복원job허용아님. 비DB동등검증경로는미선택; safety11runner는등록체크/증거요구이며이번PASS없음 |
| platformContract.js | 11namedscenario 구현과setup/cleanup 함수 등록요구 | 시나리오등록과실제안전성검증수준은다름. 11개명칭이모든modeloracle를자동보장하지않음 |
| npm platform unit | flat tests/game-platform-*.test.js | nestedtests/logical모델구현이생기면발견범위판단필요 |
| Playwright | case30초/expect10초, CI retry1·workers2; desktop/mobileemulation·정적server | 실제two-client·지원기기·성능·운영budget과별도. 이번실행없음 |

### 9.3 순서를 고정하지 않은 의존관계

| I 조건/의존 | 먼저 갖춰야 할 승인/사실 | U Astra Slice·예산 판단 |
|---|---|---|
| 새권위/경로를runtime이소비 | 전수목적지·한owner참조·경로탐지/test발견·기존격리 | 최소권위/Guard연결을어느Slice로묶을지 |
| 선택model의최종adoption/recovery | STEP4A 전체수명·STEP4B currentA/C/P/안전oracle·context/view | Core/model연결과backend/client검증을나눌최소범위 |
| Invite/BGM신consumer | H1~3최소내부보완과실제owner·identity검증 | 선행보완범위·unit/browser/audio예산; H4미래미선택제외 |
| 첫/둘째Probe수직추적 | 장르조건·7축/4문서·제품start/rematch/종료·selectedmodel/capability | 각Probe의증거범위와지원/미지원·중단조건; 실제게임은이번선택금지 |
| 성능/복원/오픈주장 | exactmanifest·지원기기/망·부하/원시측정·권한/삭제/비용·실행허용 | 실제시험종류/시간·반복수·예산을설계할근거. 제안표본강제금지 |

소프트웨어 owner는 Core/runtime-model/capability/Site Adapter/game-local/backend의 승인범위다. **작업모델**은 Sol/Codex가 사실보완/승인반영/기계검증, Astra가 핵심경계·충돌·Target/Slice판단을 맡는다. 구현담당의임의수명기법·API를여기서동결하지않는다.

## 10. 고정 source trace — 재사용과 새 확인

모든 아래 repo링크는 고정판단SHA에 고정돼 있다. blob은 Git blob SHA-1이며 SHA-256 원본파일hash와다르다. C는원문bytes/blob대조, R은승인/기존관찰재사용, N은현재결론영향부분추가읽기다. 파일확보/존재확인은전본문의새분석·실행검증이아니다.

| 방식/경로·고정 링크 | blob | 이번 재사용/읽기 범위·줄 또는 심볼 |
|---|---|---|
| [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/AGENTS.md) | `2686a3c37502bbf1f7f2a9407640e78cc026dadb` | F/R 전체 상태·절차; C STEP1 동일blob |
| [game_platform_vnext_final_execution_plan.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/game_platform_vnext_final_execution_plan.md) | `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` | F/R 개정1.5·STEP6/7 및 단계게이트 |
| [docs/game-platform-rebuild/README.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/README.md) | `02e04363157266947c82721c76b37cf8f4989e85` | F/R 승인목록·STEP5C 이력/복원조건 |
| [docs/game-platform-rebuild/CURRENT.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/CURRENT.md) | `f609b2a06a8d89d0b9ee10a0ec1918cb43303cd5` | F/R 상태·CP0087/PR416 복원조건 |
| [docs/game-platform-rebuild/checkpoints/CP-0087-step-5c-integration-merge-approved.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/checkpoints/CP-0087-step-5c-integration-merge-approved.md) | `c5f6eb0684aacc81425084a457158fddfa207cf0` | F/R 승인head·병합허용/복원조건; PR/Git 대조 |
| [docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md) | `f7929e663f9ba5465536bfecffad0f039156781c` | R §4~5 권위·본체·consumer·findings 및 확인한계 |
| [docs/game-platform-rebuild/artifacts/step-1-source-inventory.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-1-source-inventory.md) | `0d407aa9020ceab4785c5745e67f826bfeb4b94c` | C/R 89원 inventory행과현재tree blob대조; 새전체소스감사없음 |
| [docs/game-platform-rebuild/artifacts/step-1-clause-succession-table.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-1-clause-succession-table.md) | `18c3c76589a7db8303ca210886ba981dd8518813` | A/F/R 분류/모수·원문필드·E owner·중복/갈등/미확인 |
| [docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md) | `e1a6515b38db0164146ca3a51fc29aae60275c6a` | C/R 전체 원문행·ID·source절 파싱/그대로재사용; 모든의미를새로재판단하지않음 |
| [docs/game-platform-rebuild/artifacts/step-1-clauses-design.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md) | `981555ea5fab6b3899ebd03599bac7e992f51691` | C/R 전체 원문행·ID·source절 파싱/그대로재사용; 모든의미를새로재판단하지않음 |
| [docs/game-platform-rebuild/artifacts/step-1-clauses-games.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-1-clauses-games.md) | `53d6c1e994b424c7142712f070bb00a37e6c4031` | C/R 전체 원문행·ID·source절 파싱/그대로재사용; 모든의미를새로재판단하지않음 |
| [docs/game-platform-rebuild/artifacts/step-1-clauses-site-history.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-1-clauses-site-history.md) | `fb80ff3e9f80c43ce4a40a3d8567fce604b54a0d` | C/R 전체 원문행·ID·source절 파싱/그대로재사용; 모든의미를새로재판단하지않음 |
| [docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md) | `1c1f103adf56a160f1fba8e993cd7c38bbcf09e8` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 9:## 분류 원칙, 26:## 장르와 교차하는 특성, 38:## 기존 의무 보존과 ID별 제안, 104:## host/ready/rematch 경계와 미결정, 116:## 미결정과 리스크 |
| [docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md) | `52d209d250ba76f351ea13db33aa6259ba641e71` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 9:## 선택표, 25:## 선택과 실행 모델 연결, 39:## 시간·빈도 기록, 52:## 별도 Capability 선택, 61:## 호환·충돌 예시, 78:## 외부 조사와 판단 구분 |
| [docs/game-platform-rebuild/artifacts/step-2-game-spec-selection-rationale.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-2-game-spec-selection-rationale.md) | `a5e7be7989c1daeedfb515f751aade754b7f1990` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 23:## 기록 예시 — 지원 구현 선언이 아님, 41:## 미결정 보존 |
| [docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md) | `0236dccd268617edf14e6158f582cda9b25b8c8b` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 1. 판단 요약과 읽는 법, 16:### 표기 기준, 30:### 현재 규칙 적용의 공통 주의점, 37:## 2. 11개 사례의 7축 대입, 69:## 3. 적용 장르·계약·구현 증거의 독립 matrix, 87:## 4. 분류 결과 해석 |
| [docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md) | `036dab34e4445fb1a6059b4ca6bce0545a74ae94` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 5. 여섯 전환·실패 시나리오의 핵심 판단, 14:### S3-T01 — 같은 방의 새 경기 뒤 이전 응답, 22:### S3-T02 — 다른 방의 콜백, 30:### S3-T03 — 관전 전환 뒤 private 정보, 39:### S3-T04 — 재접속 시 이벤트 유실, 47:### S3-T05 — rollback 중 결과 중복, 55:### S3-T06 — 출시 활성화 중복 |
| [docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md) | `9f291884fc0de2e4e0ff65a43f6d92002f62c9a7` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 6. Core·규칙 리스크와 STEP 2 회귀 판정, 12:### 리스크 인덱스, 26:### 회귀 조건을 직접 대입한 최종 판단, 37:### 후속 책임과 미결정, 51:## 7. Sol 5.6 조사 활용과 선택 원문 확인, 65:### 확인하지 않은 범위와 판단에 반영한 방법, 74:### Q01~Q06 판단 연결 |
| [docs/game-platform-rebuild/artifacts/step-3-source-trace.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-3-source-trace.md) | `812100981f55fab9793b7ba44237399db76a5781` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 판단 원문 → 정식 산출물, 21:## 근거 약칭 해석, 29:## source 근거 인덱스, 56:## 추가 원문 위치 연결, 67:## 조건 보존과 감사 검토 지점 |
| [docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md) | `610efc904bdaec8881535d3405fe81102bd3d5df` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 1. 기준과 판단 방법, 18:## 2. 3A — 책임 경계 판단, 33:## 3. 3A — 허용 의존과 금지 규칙, 44:## 4. 3A — 규칙에서 계약으로 이어지는 의무 |
| [docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md) | `5e40988234caba6cb605ea4c0b386a0a5b83b9c5` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 5. 3B — 관계와 수명, 27:## 6. 3B — 늦은 완료 채택과 정리, 29:### 6.1 채택 조건, 50:### 6.2 dispose와 자원 소유 판단, 62:## 7. 3B — T01~03 대입 결과, 79:## 8. 기존 구현·새 모델 공존과 반례 |
| [docs/game-platform-rebuild/artifacts/step-4a-contract-source-trace.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-4a-contract-source-trace.md) | `f549969caa3bfffb914bf276e594bb61c76668e8` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 5:## 1. 고정 입력과 원본 보존, 12:## 2. 판단 전체의 반영 대응, 28:## 3. 고정 저장소 source index33개, 66:## 4. 조항·시나리오·후속의 연결 |
| [docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md) | `a6cfe51029e3fc3b2b546222b6a6afb0ad428f14` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 3:## CP0075 현재 적용 — D0010과 A/C 구분, 13:## CP0074 현재 적용 — J01~06 보완, 26:## 최초 정식 반영 이력 — 이하 원문 보존, 35:## 3A — 권위·동기화·복구, 37:### J01. 권위와 책임의 배치 — 채택, 50:### J02. 시간·순서·중복의 의미 — 채택, wire/API 형식은 미동결, 61:### J03. initial/live 연결과 놓친 마지막 변경 — 조건부 채택, 69:### J04. 재전송·복구·영속성 — 채택, 83:### J05. prediction·소비 효과와 STEP4A 수명 — 채택, 89:### J06. 현행 11개 안전성의 비DB 대응 — 의미 계승, 면제 없음 |
| [docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md) | `e140c90d830ff891c2abd5e40b038249eeeb8ebf` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 3:## CP0075 현재 적용 — D0010의 제한된 대체, 11:## CP0074 현재 적용 — J07~09 보완, 23:## 최초 정식 반영 이력 — 이하 원문 보존, 32:## 3B — private·권한·사이트, 34:### J07. 검사 시점과 철회의 경계 — 채택, 실제 집행 증거 보류, 48:### J08. private 전달과 cache — 안전 기준 채택, private stream 도입 보류, 56:### J09. 사이트와 게임 서버의 연결 — 책임 채택, 구체 연결 구현 보류 |
| [docs/game-platform-rebuild/artifacts/step-4b-design-finalization.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-4b-design-finalization.md) | `522baab76c2bc4b56109d33d9bf1a7e984f31bf9` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 5:## 1. 결론과 선택, 18:## 2. S-A: 신원·현재 권한과 최소 호출 권한, 20:### A1. predicate와 신뢰 경계, 39:### A2. 현재 권한 제약을 반영한 함수 배치, 52:### A3. 모든 writer와 cascade, 65:## 3. C/P·owner·운영 장애 경계, 86:## 4. S-B: 분리 외부 archive와 복원 제어, 88:### B1. 구체 저장 배치, 102:### B2. authoritative 저장과 중복, 108:### B3. 삭제와 재생성 방지, 118:### B4. 복구점·권한 복원, 130:### B5. 저장 불능과 종결 시각, 138:## 5. S-C: 선택 구성과 비용 조건, 159:## 6. 시험 보완 — 전부 NOT_RUN, 179:## 7. 종료 조건과 다음 행동 |
| [docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md) | `f3232f64c846bf4b17fcea2ae0bf6baed90ffc03` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 5:## 1. 결정과 판정, 11:## 2. 최종 인가·착수 A와 실제 commit C, 33:## 3. 시험 명세의 현재 적용 변경, 47:## 4. 설계 종료 조건 대조, 73:## 5. 정식 반영과 다음 작업 |
| [docs/game-platform-rebuild/artifacts/step-4b-verification-specification.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-4b-verification-specification.md) | `91d41480837c6ca3486b28aa1c615177d0fabcea` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 5:## 공통 사전 조건·관측 계약, 30:## 구체적인 품질 시험 기준 제안 |
| [docs/game-platform-rebuild/artifacts/step-4b-risks-and-followup.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-4b-risks-and-followup.md) | `5555a698f178eda9e7b9cd2e1a793a69ceb83482` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 3:## CP0075 현재 상태와 남은 의무, 11:## CP0074 현재 위험과 다음 작업, 21:## 최초 정식 반영 이력 — 이하 원문 보존, 30:## 현재 미해소 상태, 43:## 정식 반영과 후속 단계, 51:## 가이드3 입력·판단 방법 원문 보존, 62:## 충돌 대조와 제출 경계 |
| [docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md) | `e80d67aa5a3fa74ffcd441fa977fd4755d6d4c85` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 1. 결론과 문서 지위, 23:## 3. 모든 분류에 적용하는 승인 요구, 35:### CP0075/D0010 보존, 47:## 4. 8개 대상 책임 단위별 선택 판단표, 51:### 4.1 Registry, 61:### 4.2 Access, 69:### 4.3 Room, 77:### 4.4 Snapshot, 88:### 4.5 Reconnect, 95:### 4.6 Invite, 109:### 4.7 Game Shell, 119:### 4.8 사이트 BGM |
| [docs/game-platform-rebuild/artifacts/step-5a-duplication-prevention.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5a-duplication-prevention.md) | `f43b06d3b728258789534a4d401132d3b0461cd7` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 5. 중복 방지 기준 |
| [docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md) | `fb2fa919c12905153360209bb692a3adc626a42c` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 6. 소프트웨어 owner와 호환·수명·검증 책임, 25:## 7. Codex안 유지·수정·보류와 이유, 40:### 보류 항목의 해소 기준·담당·시점, 51:## 8. 설계 공백·실행 의무·사용자 승인, 53:### 8.1 구분, 65:### 8.2 후속 검증 묶음 — 전부 NOT_RUN, 80:### 8.3 사용자가 검토·승인할 항목, 90:## 11. 작업 모델의 후속 책임 |
| [docs/game-platform-rebuild/artifacts/step-5a-source-trace.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5a-source-trace.md) | `3bafb8e95a4d3a854bad2bf5c25e9d1735369428` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 0. 현재 승인과 원문 보존, 27:## 2. 입력과 상태 복원, 29:### 2.1 실제로 읽은 입력, 38:### 2.2 지정 순서로 직접 복원한 결과, 56:## 9. Source trace와 추가 읽기 범위, 82:## 11. 재사용 근거의 고정 경로 연결 |
| [docs/game-platform-rebuild/artifacts/step-5b-contract-boundaries.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5b-contract-boundaries.md) | `fb3c782d6aad08126c452099c6f67441ece20fd0` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 9:## 2. 모든 분류에 적용할 승인 요구, 17:## 3. 책임 단위별 3분류, 21:### 3.1 Result / Statistics / Meta Progression, 33:### 3.2 Publication / Site Integration, 43:### 3.3 Presentation / Sound / Profile / Capability, 55:## 4. 결과·정정·중복의 구체적인 최소 의미, 57:### 4.1 종료에서 소비까지, 69:### 4.2 서로 다른 중복 범위, 82:## 5. 공개·사이트·표현의 연결 조건, 84:### 5.1 Publication의 최소 경계, 92:### 5.2 공통 표시와 게임 표현 |
| [docs/game-platform-rebuild/artifacts/step-5b-duplication-and-extension.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5b-duplication-and-extension.md) | `b51394438a5bcedd284892c7552576fc90213f0a` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 9:## 6. 실제 Probe 적용과 중복·확장 기준, 11:### 6.1 두 Probe에서 지금 필요한 것, 21:### 6.2 공통화와 확장 판단 기준 |
| [docs/game-platform-rebuild/artifacts/step-5b-compatibility-lifetime-verification.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5b-compatibility-lifetime-verification.md) | `6dfa14d0c3056dc12d1388e9ab7295729137cc4a` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 9:## 7. 소프트웨어 owner와 후속 작업 담당, 22:## 8. 설계 blocker와 남는 의무, 24:### 8.1 현재 결론, 37:### 8.2 후속 검증 의무 — 이번에는 전부 NOT_RUN, 46:## 9. 사용자 승인할 핵심 선택과 정식 반영 범위, 48:### 9.1 승인 요청 대상, 58:### 9.2 승인 후 Sol/Codex가 반영할 내용 |
| [docs/game-platform-rebuild/artifacts/step-5b-source-trace.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5b-source-trace.md) | `ce70c3617304b914db40afbfa513e3c97114af01` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 9:## 0. 이번 정식 반영의 승인·원본 보존, 27:## 1. 입력·상태와 판단 권위, 29:### 1.1 실제 읽은 입력과 원격 확인, 50:### 1.2 증거 표기와 한계, 63:## 10. 직접 읽기와 재사용 trace |
| [docs/game-platform-rebuild/artifacts/step-5c-board-rule-succession.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5c-board-rule-succession.md) | `a788db771b8cc26d4d7896a346b00bac12cd085b` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 2. 핵심 판단과 논리적 책임 원칙, 33:## 3. 보드게임 조항 계승 설계, 35:### 3.1 읽는 법과 보존 단위, 41:### 3.2 B01~12 — 책임, 분할, 조건 및 미확인, 58:### 3.3 계승 범위와 누락 방지, 64:## 4. DB 적용과 hostless 범위의 조건부 연결, 66:### 4.1 현행 DB 규칙과 비DB 동등 안전성, 82:### 4.2 초기 hostless, 재대결 hostless와 미정, 94:### 4.3 실제 상위 의미 변경과 문구 전환 |
| [docs/game-platform-rebuild/artifacts/step-5c-realtime-coop-spatial-rules.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5c-realtime-coop-spatial-rules.md) | `9c7108a2327c4ab89043b92211b165e2b0923600` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 5. 첫 비보드 Probe — 실시간 협동·공간형 규칙 내용 초안, 14:### 5.1 범위와 출처 — 최소항목 1, 30:### 5.2 플랫폼 연결 — 최소항목 2, 44:### 5.3 독립 장르 요구 — 최소항목 3, 64:### 5.4 개발과 네 문서 보완 — 최소항목 4, 77:### 5.5 검증과 완료 기준 — 최소항목 5, 95:### 5.6 권위와 이력 — 최소항목 6 |
| [docs/game-platform-rebuild/artifacts/step-5c-genre-model-connections.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5c-genre-model-connections.md) | `876b357defc488dd8890e8aa71244564568490f2` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 6. 둘째 Probe의 별도 규칙 필요성과 선택 조건, 25:## 7. 공통·장르·모델 연결, 혼합 장르와 신규 추가 절차, 27:### 7.1 한 의미 한 owner의 연결표, 41:### 7.2 혼합 장르의 충돌 처리, 51:### 7.3 신규 장르 추가 절차, 64:## 8. 승인 계약 보존과 미확인의 분류, 66:### 8.1 이 판단으로 바뀌지 않는 승인 경계, 84:### 8.2 설계 blocker, 후속 구체화와 실행 의무 |
| [docs/game-platform-rebuild/artifacts/step-5c-source-trace.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5c-source-trace.md) | `6427171cb7c4f4a65a944e070d01baaa1e9c78fd` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 10:## 0. 이번 정식 반영 승인·원본 및 Git 증거, 28:## 1. 입력, 현재 상태와 증거의 지위, 30:### 1.1 실제 읽은 입력과 보존, 42:### 1.2 상태 복원과 실제 원격 대조, 57:## 9. 사용자 승인 범위와 승인 후 정식 반영, 59:### 9.1 지금 승인할 핵심 선택, 72:### 9.2 승인 뒤 Sol/Codex가 할 범위, 80:## 10. Source trace, 추가 읽기와 문서 검증, 82:### 10.1 기존 근거 재사용, 101:### 10.2 결론에 영향을 줄 수 있는 공백만 추가 확인, 114:### 10.3 문서 검증과 미실행 |
| [docs/game-platform-rebuild/artifacts/step-5c-validation.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-5c-validation.md) | `2e3efac5bd8a4a5324d00b1a23bb58976cea620d` | A/R 승인된 관련 책임/조건/보존/검증·기존trace; 절 3:## 1. 승인·현재 상태, 7:## 2. 문서 검사, 13:## 3. 미실행·영향·후속 의무, 23:## 4. 다음 첫 작업 하나 — 사용자 정식 결과 최종 검토 |
| [docs/game-platform-rebuild/DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/DECISIONS.md) | `ab4896bd01b591895d0e30946a810c41eaa74e5a` | A/R D0005~10·대체관계; D0010 §§91~96 부근 |
| [scripts/check-game-platform-governance.mjs](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/scripts/check-game-platform-governance.mjs) | `2aa47527fc57a1ba0fe8a5d6c3c72eb984b8477b` | F/N constants L10~86; platformGameIdFromPath L95~100; policy L117~223; repository L229~375; PR L379~430; filesystem/ref/run L433~594 |
| [tests/game-platform-governance.test.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-platform-governance.test.js) | `4c7d3c865cb09ab19d4831404f0c43fa77bc3b12` | F/N 테스트명·path/bootstrap/authority/online/shared/lifecycle/baseline 관련 assertion. 검사소스이며 실행없음 |
| [.github/workflows/game-platform-governance.yml](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/.github/workflows/game-platform-governance.yml) | `984d2c36c506c2e51ba50765fe0b5d667c06f055` | F/N 전체 workflow path·step·timeout; 실행없음 |
| [docs/game-platform-governance.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-governance.md) | `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169` | F/R CURRENT/HISTORY·topic-owner/전파·Guard전제; 원래상태보존 |
| [package.json](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/package.json) | `917a55aa474d98cc663364c5e7dab84ff6fe5cf1` | F/N scripts/test:game-platform·build:assets 및 기존별도test |
| [playwright.config.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/playwright.config.js) | `4189438b0f3e7fc222ccec9ed50899cf40aac8ca` | F/N 전체 discovery·project·server·timeout/retry/workers |
| [scripts/build-community-assets.mjs](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/scripts/build-community-assets.mjs) | `a863b954ac20a1c1d77f0b0892373cfd51901d9e` | F/N entry/output·esbuild/splitting·manifest; 실행없음 |
| [scripts/build-liar-canonical.mjs](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/scripts/build-liar-canonical.mjs) | `749fa85fdd5d4b0f8b4463782085bfa6b23a4534` | F/N canonical manifest/entry/check symbols 및 국소version; SQL본문감사없음 |
| [scripts/check-community-modules.mjs](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/scripts/check-community-modules.mjs) | `2aafeebc1ab74087b1b6f30fc940355513f84535` | F/N entry/recursive js·games-page stub·resolve/link 함수; 실행없음 |
| [games/shared/index.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/index.js) | `96041e478da57e87f3248be1e1d539e8dbdd6939` | F/N 전체 reexports |
| [games/shared/registry.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/registry.js) | `afa4ba25824157534eca7ca7538b89571cfca30e` | F/N defineGame·GAME_REGISTRY·flags/platform/href 반환형 |
| [games/README.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/README.md) | `49c3d8604b8b24d6a5cf5e66d848b35a22610bee` | F/R 신규game진입·4문서·기존legacy/common/current links |
| [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-development-rules.md) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | F/R 네문서/bootstrap·적용조건·§17 CURRENT권위; 정확한전수의무는 STEP1동일blob행재사용 |
| [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md) | `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9` | F/R CURRENT진입·baseline/후속결정/장르조건; 정확한전수행은 STEP1재사용 |
| [docs/game-platform-db-test-contract.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-db-test-contract.md) | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` | F/R 도입모든신규online·안전11/모델조건; 실제운영SQL최종정의완전확인아님 |
| [games/GAME_SPEC_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/GAME_SPEC_TEMPLATE.md) | `2b63d9cafee15bd952fcb4ddb8bb06bcec3240d2` | F/R bootstrap·rulebook/UI링크·문서역할/시간축/필수절; 예시값을의무화하지않음 |
| [games/DEVELOPMENT_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/DEVELOPMENT_TEMPLATE.md) | `e48f42067682975202067537f005270054ed1e7c` | F/R bootstrap·rulebook/UI링크·문서역할/시간축/필수절; 예시값을의무화하지않음 |
| [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/UI_DESIGN_TEMPLATE.md) | `e412138d9d60f5189709c20c634bcb0f5f28be82` | F/R bootstrap·rulebook/UI링크·문서역할/시간축/필수절; 예시값을의무화하지않음 |
| [games/UI_DECISIONS_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/UI_DECISIONS_TEMPLATE.md) | `a8bedc2de5cb80de99c67044c071f3940b778248` | F/R bootstrap·rulebook/UI링크·문서역할/시간축/필수절; 예시값을의무화하지않음 |
| [.github/workflows/game-db-integration.yml](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/.github/workflows/game-db-integration.yml) | `9b962356a28951b1d8ccf171d1fece8df5a580b6` | F/N 전체 workflow·등록범위·timeout/격리환경/runner; 실행없음 |
| [tests/game-db-integration/platformContract.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-db-integration/platformContract.js) | `972dad82fe201924260cd528d6b794c5b33fb32a` | F/N 전체 등록helper·11시나리오/함수 요구; 실행없음 |
| [games/cant-stop/app.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/cant-stop/app.js) | `29eba21d4637febb2a74dc12d89847d86af9d7b0` | F/N L1~90 import·Gate초기연결만; 기존 STEP5A/B trace재사용 |
| [games/no-thanks/main.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/no-thanks/main.js) | `9e09b49d2365fe880e40a6c2180476573043cb0b` | F/N L1~90 import·site/local 연결만; 기존 STEP5A/B trace재사용 |
| [games/shared/gameInvite.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/gameInvite.js) | `4d4b667e85162b19fb4e1607bfcc094a1bd4556d` | F/N L1~35 Registry import·TARGET_TYPE/VERSION; 본체수명/consumer는 STEP5A trace재사용 |

### inventory 원문→현재 blob 대조 (89행/88고유경로)

같은 AGENTS가 원 inventory의 문서/제어 범위에 두 번 등장한다. 아래는 88고유경로이며 집계는 원89행 기준이다. old source 기준은 `132ec1576e316d0238c9ca6e07d0d3ab91950ec8`이다.

| 경로 | STEP1 old blob | 고정현재 blob | 대조 |
|---|---|---|---|
| [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/AGENTS.md) | `2686a3c37502bbf1f7f2a9407640e78cc026dadb` | `2686a3c37502bbf1f7f2a9407640e78cc026dadb` | 동일·기존근거재사용 |
| [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-development-rules.md) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | 동일·기존근거재사용 |
| [docs/game-platform-governance.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-governance.md) | `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169` | `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169` | 동일·기존근거재사용 |
| [docs/game-platform-db-test-contract.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-db-test-contract.md) | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` | 동일·기존근거재사용 |
| [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-ui-rules.md) | `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9` | `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9` | 동일·기존근거재사용 |
| [games/README.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/README.md) | `49c3d8604b8b24d6a5cf5e66d848b35a22610bee` | `49c3d8604b8b24d6a5cf5e66d848b35a22610bee` | 동일·기존근거재사용 |
| [games/GAME_SPEC_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/GAME_SPEC_TEMPLATE.md) | `2b63d9cafee15bd952fcb4ddb8bb06bcec3240d2` | `2b63d9cafee15bd952fcb4ddb8bb06bcec3240d2` | 동일·기존근거재사용 |
| [games/DEVELOPMENT_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/DEVELOPMENT_TEMPLATE.md) | `e48f42067682975202067537f005270054ed1e7c` | `e48f42067682975202067537f005270054ed1e7c` | 동일·기존근거재사용 |
| [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/UI_DESIGN_TEMPLATE.md) | `e412138d9d60f5189709c20c634bcb0f5f28be82` | `e412138d9d60f5189709c20c634bcb0f5f28be82` | 동일·기존근거재사용 |
| [games/UI_DECISIONS_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/UI_DECISIONS_TEMPLATE.md) | `a8bedc2de5cb80de99c67044c071f3940b778248` | `a8bedc2de5cb80de99c67044c071f3940b778248` | 동일·기존근거재사용 |
| [games/cant-stop/GAME_SPEC.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/cant-stop/GAME_SPEC.md) | `8c28edf2c84b351a7ddbc0504c37df2e79b962e4` | `8c28edf2c84b351a7ddbc0504c37df2e79b962e4` | 동일·기존근거재사용 |
| [games/cant-stop/DEVELOPMENT.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/cant-stop/DEVELOPMENT.md) | `de9c2774e43b3646402edbf5785d9580df6e86e6` | `de9c2774e43b3646402edbf5785d9580df6e86e6` | 동일·기존근거재사용 |
| [games/cant-stop/UI_DESIGN.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/cant-stop/UI_DESIGN.md) | `4127eb5129923725e1e2c2b1c8a4b7ea87f7bcfe` | `4127eb5129923725e1e2c2b1c8a4b7ea87f7bcfe` | 동일·기존근거재사용 |
| [games/cant-stop/UI_DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/cant-stop/UI_DECISIONS.md) | `c77ed6c6acf69888dec8510711c7aa850a424948` | `c77ed6c6acf69888dec8510711c7aa850a424948` | 동일·기존근거재사용 |
| [games/no-thanks/GAME_SPEC.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/no-thanks/GAME_SPEC.md) | `11408e010a86c8197068be96a6cbede34c42e477` | `11408e010a86c8197068be96a6cbede34c42e477` | 동일·기존근거재사용 |
| [games/no-thanks/DEVELOPMENT.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/no-thanks/DEVELOPMENT.md) | `c5167e1dc6004d663a58d304e2d8604acfaf3f68` | `c5167e1dc6004d663a58d304e2d8604acfaf3f68` | 동일·기존근거재사용 |
| [games/no-thanks/UI_DESIGN.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/no-thanks/UI_DESIGN.md) | `6d956599f9dfc11fade9a082d68ddec4be05bea2` | `6d956599f9dfc11fade9a082d68ddec4be05bea2` | 동일·기존근거재사용 |
| [games/no-thanks/UI_DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/no-thanks/UI_DECISIONS.md) | `65437a239c6d9ac2bdb40191bd0f6e5a388b3ead` | `65437a239c6d9ac2bdb40191bd0f6e5a388b3ead` | 동일·기존근거재사용 |
| [games/no-thanks/RELEASE_CHECKLIST.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/no-thanks/RELEASE_CHECKLIST.md) | `28d562743296889439d19d72bcaa84d843669b0d` | `28d562743296889439d19d72bcaa84d843669b0d` | 동일·기존근거재사용 |
| [docs/game-bgm.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-bgm.md) | `e3767e0b366a5e1f57d5978edf47eb1e129a0931` | `e3767e0b366a5e1f57d5978edf47eb1e129a0931` | 동일·기존근거재사용 |
| [README.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/README.md) | `d51a355bb106e8ff3579e4615e6db1e2709fcd06` | `d51a355bb106e8ff3579e4615e6db1e2709fcd06` | 동일·기존근거재사용 |
| [supabase/README.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/supabase/README.md) | `6f79e559386f600bd524615d61dd1e60c361c759` | `6f79e559386f600bd524615d61dd1e60c361c759` | 동일·기존근거재사용 |
| [supabase/site/README.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/supabase/site/README.md) | `02426634228d360249c868d7ed2529ecfded8dd5` | `02426634228d360249c868d7ed2529ecfded8dd5` | 동일·기존근거재사용 |
| [tests/game-db-integration/README.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-db-integration/README.md) | `99b8acac6244f4e128766d6a36b6159ce9883848` | `99b8acac6244f4e128766d6a36b6159ce9883848` | 동일·기존근거재사용 |
| [docs/game-platform-strategy.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-strategy.md) | `344297d7d806f164082bcb5a88e41610d3db4d10` | `344297d7d806f164082bcb5a88e41610d3db4d10` | 동일·기존근거재사용 |
| [docs/game-platform-invite-analysis.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-invite-analysis.md) | `645f565e9c9a2b069bb2be13d70e14c12af2a38f` | `645f565e9c9a2b069bb2be13d70e14c12af2a38f` | 동일·기존근거재사용 |
| [game_platform_vnext_final_execution_plan.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/game_platform_vnext_final_execution_plan.md) | `e12ef038913eb6d605709b782f1b73f18e0d1253` | `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` | 변경·현재승인/상태로분리 |
| [docs/game-platform-rebuild/README.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/README.md) | `2263aa90a0e49f0cb6935f0d2558d25c5799426c` | `02e04363157266947c82721c76b37cf8f4989e85` | 변경·현재승인/상태로분리 |
| [docs/game-platform-rebuild/CURRENT.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/CURRENT.md) | `447d75e3cc84840fb0c5fc79f6c285c4e4f7a39e` | `f609b2a06a8d89d0b9ee10a0ec1918cb43303cd5` | 변경·현재승인/상태로분리 |
| [docs/game-platform-rebuild/checkpoints/CP-0005-step-0-record-audit-correction.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/checkpoints/CP-0005-step-0-record-audit-correction.md) | `8d2193c489a2e15da1fd4282de02973192ace0e6` | `8d2193c489a2e15da1fd4282de02973192ace0e6` | 동일·기존근거재사용 |
| [docs/game-platform-rebuild/DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/DECISIONS.md) | `0dc4e896075917cb8ddb37c24f7e8c0c9d21c381` | `ab4896bd01b591895d0e30946a810c41eaa74e5a` | 변경·현재승인/상태로분리 |
| [.github/workflows/game-db-integration.yml](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/.github/workflows/game-db-integration.yml) | `9b962356a28951b1d8ccf171d1fece8df5a580b6` | `9b962356a28951b1d8ccf171d1fece8df5a580b6` | 동일·기존근거재사용 |
| [.github/workflows/game-platform-governance.yml](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/.github/workflows/game-platform-governance.yml) | `984d2c36c506c2e51ba50765fe0b5d667c06f055` | `984d2c36c506c2e51ba50765fe0b5d667c06f055` | 동일·기존근거재사용 |
| [.github/workflows/site-static-checks.yml](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/.github/workflows/site-static-checks.yml) | `2cb746bda0ade2f2344a2a8e21f5a48148b10bb4` | `2cb746bda0ade2f2344a2a8e21f5a48148b10bb4` | 동일·기존근거재사용 |
| [games/cant-stop/app.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/cant-stop/app.js) | `29eba21d4637febb2a74dc12d89847d86af9d7b0` | `29eba21d4637febb2a74dc12d89847d86af9d7b0` | 동일·기존근거재사용 |
| [games/cant-stop/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/cant-stop/bgm.js) | `5f7ce828d6becee5e6023398f8c44d610d02f9a5` | `5f7ce828d6becee5e6023398f8c44d610d02f9a5` | 동일·기존근거재사용 |
| [games/cant-stop/invite.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/cant-stop/invite.js) | `855a13f2753cafcaa1af69a51ddd97ad61349890` | `855a13f2753cafcaa1af69a51ddd97ad61349890` | 동일·기존근거재사용 |
| [games/cant-stop/lobbyController.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/cant-stop/lobbyController.js) | `9fdecdea73fa6b96680d887a6ad5ad2d9031e8d6` | `9fdecdea73fa6b96680d887a6ad5ad2d9031e8d6` | 동일·기존근거재사용 |
| [games/cant-stop/roomLobby.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/cant-stop/roomLobby.js) | `881d0c34211225ba1ec4f1616d8fd9f6e36ea66b` | `881d0c34211225ba1ec4f1616d8fd9f6e36ea66b` | 동일·기존근거재사용 |
| [games/no-thanks/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/no-thanks/bgm.js) | `1f7c850ffbb8e25c038114b1d7ed2f34ed420332` | `1f7c850ffbb8e25c038114b1d7ed2f34ed420332` | 동일·기존근거재사용 |
| [games/no-thanks/lobbyController.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/no-thanks/lobbyController.js) | `942a628ff1a675754f7ab92c53d5ecbddf3e6eab` | `942a628ff1a675754f7ab92c53d5ecbddf3e6eab` | 동일·기존근거재사용 |
| [games/no-thanks/main.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/no-thanks/main.js) | `9e09b49d2365fe880e40a6c2180476573043cb0b` | `9e09b49d2365fe880e40a6c2180476573043cb0b` | 동일·기존근거재사용 |
| [games/no-thanks/presence.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/no-thanks/presence.js) | `43e0f094e0efc184e721dcb55624c30a328deb57` | `43e0f094e0efc184e721dcb55624c30a328deb57` | 동일·기존근거재사용 |
| [games/no-thanks/roomLobby.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/no-thanks/roomLobby.js) | `b689e6c0628824cc3d617bd5dc71ace424857fb3` | `b689e6c0628824cc3d617bd5dc71ace424857fb3` | 동일·기존근거재사용 |
| [games/shared/accessGate.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/accessGate.js) | `4803cd8fd141c98d97bd6357243a9f955843d6cc` | `4803cd8fd141c98d97bd6357243a9f955843d6cc` | 동일·기존근거재사용 |
| [games/shared/actionContract.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/actionContract.js) | `93ff86e5a83073f6cd88ee7555fb171caf467443` | `93ff86e5a83073f6cd88ee7555fb171caf467443` | 동일·기존근거재사용 |
| [games/shared/game-shell.css](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/game-shell.css) | `daad52e6658b8e7e1d8510f8607201921272e794` | `daad52e6658b8e7e1d8510f8607201921272e794` | 동일·기존근거재사용 |
| [games/shared/gameInvite.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/gameInvite.js) | `4d4b667e85162b19fb4e1607bfcc094a1bd4556d` | `4d4b667e85162b19fb4e1607bfcc094a1bd4556d` | 동일·기존근거재사용 |
| [games/shared/gameShell.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/gameShell.js) | `298ab13998662aafa0efea35d32824f85e84e18e` | `298ab13998662aafa0efea35d32824f85e84e18e` | 동일·기존근거재사용 |
| [games/shared/gameShellState.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/gameShellState.js) | `1f068aa14348b166b13c34e50daf2c5698db2914` | `1f068aa14348b166b13c34e50daf2c5698db2914` | 동일·기존근거재사용 |
| [games/shared/index.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/index.js) | `96041e478da57e87f3248be1e1d539e8dbdd6939` | `96041e478da57e87f3248be1e1d539e8dbdd6939` | 동일·기존근거재사용 |
| [games/shared/reconnectRefresh.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/reconnectRefresh.js) | `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4` | `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4` | 동일·기존근거재사용 |
| [games/shared/registry.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/registry.js) | `afa4ba25824157534eca7ca7538b89571cfca30e` | `afa4ba25824157534eca7ca7538b89571cfca30e` | 동일·기존근거재사용 |
| [games/shared/roomLobbyContract.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/roomLobbyContract.js) | `4d037bd1b56715aae631220d1c848bc521a56ce0` | `4d037bd1b56715aae631220d1c848bc521a56ce0` | 동일·기존근거재사용 |
| [games/shared/snapshotCoordinator.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/games/shared/snapshotCoordinator.js) | `069f49aa23cfb2c5d591cafaed523fa358c78ba1` | `069f49aa23cfb2c5d591cafaed523fa358c78ba1` | 동일·기존근거재사용 |
| [js/auth.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/js/auth.js) | `09eb6d21b2d259567c0ba1b1a0aecfbd1bcac723` | `09eb6d21b2d259567c0ba1b1a0aecfbd1bcac723` | 동일·기존근거재사용 |
| [js/game-audio/bgmCatalog.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/js/game-audio/bgmCatalog.js) | `93ee1e699349c7596ca462fd2a1e9b5559c87f8e` | `93ee1e699349c7596ca462fd2a1e9b5559c87f8e` | 동일·기존근거재사용 |
| [js/game-audio/bgmController.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/js/game-audio/bgmController.js) | `4757a1de3477dbebe44f2dd49b7071eb8b03d9c2` | `4757a1de3477dbebe44f2dd49b7071eb8b03d9c2` | 동일·기존근거재사용 |
| [js/game-audio/bgmPlayer.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/js/game-audio/bgmPlayer.js) | `c7c8f07187c7450bff4ff7256b37227a3ee0e86c` | `c7c8f07187c7450bff4ff7256b37227a3ee0e86c` | 동일·기존근거재사용 |
| [js/game-audio/bgmPreferences.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/js/game-audio/bgmPreferences.js) | `902e2893c4ac2ebc5da0dad4fdda8aea40792a7c` | `902e2893c4ac2ebc5da0dad4fdda8aea40792a7c` | 동일·기존근거재사용 |
| [js/invites/inviteApi.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/js/invites/inviteApi.js) | `e1747b294e25fec6e83502dc20299499f72843fa` | `e1747b294e25fec6e83502dc20299499f72843fa` | 동일·기존근거재사용 |
| [js/invites/inviteEntry.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/js/invites/inviteEntry.js) | `f5438286f61c880fcdb428108ab9cfa9b4339941` | `f5438286f61c880fcdb428108ab9cfa9b4339941` | 동일·기존근거재사용 |
| [js/invites/inviteRegistry.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/js/invites/inviteRegistry.js) | `0c2c8473656245ac3990a8d97868647ec60485bf` | `0c2c8473656245ac3990a8d97868647ec60485bf` | 동일·기존근거재사용 |
| [js/invites/inviteShare.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/js/invites/inviteShare.js) | `f1d370c83cbcbcabcf405b3544e3ba1129d69203` | `f1d370c83cbcbcabcf405b3544e3ba1129d69203` | 동일·기존근거재사용 |
| [js/pages/games.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/js/pages/games.js) | `81614a6496b77415f4aef7aa26181f63dbc6f948` | `81614a6496b77415f4aef7aa26181f63dbc6f948` | 동일·기존근거재사용 |
| [liar-game/js/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/liar-game/js/bgm.js) | `3c93e555b1d0253f3044d4d1b9ac354c2120cd1a` | `3c93e555b1d0253f3044d4d1b9ac354c2120cd1a` | 동일·기존근거재사용 |
| [package.json](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/package.json) | `917a55aa474d98cc663364c5e7dab84ff6fe5cf1` | `917a55aa474d98cc663364c5e7dab84ff6fe5cf1` | 동일·기존근거재사용 |
| [scripts/check-community-modules.mjs](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/scripts/check-community-modules.mjs) | `2aafeebc1ab74087b1b6f30fc940355513f84535` | `2aafeebc1ab74087b1b6f30fc940355513f84535` | 동일·기존근거재사용 |
| [scripts/check-game-platform-governance.mjs](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/scripts/check-game-platform-governance.mjs) | `2aa47527fc57a1ba0fe8a5d6c3c72eb984b8477b` | `2aa47527fc57a1ba0fe8a5d6c3c72eb984b8477b` | 동일·기존근거재사용 |
| [supabase/cant-stop/20260919074500_cant_stop_invite_join.sql](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/supabase/cant-stop/20260919074500_cant_stop_invite_join.sql) | `61ec96f5691cfb686a97e2b302260b9bd4f44b59` | `61ec96f5691cfb686a97e2b302260b9bd4f44b59` | 동일·기존근거재사용 |
| [supabase/cant-stop/20260920205000_cant_stop_profile_nickname.sql](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/supabase/cant-stop/20260920205000_cant_stop_profile_nickname.sql) | `66da72b90a4c2ae8c8985647e163cb7f9e31b63b` | `66da72b90a4c2ae8c8985647e163cb7f9e31b63b` | 동일·기존근거재사용 |
| [supabase/no-thanks/20260921225000_no_thanks_room_lobby_foundation.sql](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/supabase/no-thanks/20260921225000_no_thanks_room_lobby_foundation.sql) | `3bcd84b7b4cdfa40dbc5b2c3aa2c10e35dbc3538` | `3bcd84b7b4cdfa40dbc5b2c3aa2c10e35dbc3538` | 동일·기존근거재사용 |
| [supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql) | `d24ff683c8ffa6861bb287f986395d24fa4a8422` | `d24ff683c8ffa6861bb287f986395d24fa4a8422` | 동일·기존근거재사용 |
| [supabase/no-thanks/20260922060000_no_thanks_realtime_publication.sql](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/supabase/no-thanks/20260922060000_no_thanks_realtime_publication.sql) | `a08e5e42daeac0881ec9c9b2a1bad5e1c7f9f13f` | `a08e5e42daeac0881ec9c9b2a1bad5e1c7f9f13f` | 동일·기존근거재사용 |
| [supabase/no-thanks/20260922060100_no_thanks_private_helper_permissions.sql](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/supabase/no-thanks/20260922060100_no_thanks_private_helper_permissions.sql) | `2d991a5d1ea5b3933fa4da1324f402ad0e3fcaed` | `2d991a5d1ea5b3933fa4da1324f402ad0e3fcaed` | 동일·기존근거재사용 |
| [supabase/no-thanks/20260922085900_no_thanks_rematch.sql](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/supabase/no-thanks/20260922085900_no_thanks_rematch.sql) | `25c8a1e4a9fdb196ecd1c88c532c5832cc0522ee` | `25c8a1e4a9fdb196ecd1c88c532c5832cc0522ee` | 동일·기존근거재사용 |
| [supabase/no-thanks/20260924073500_no_thanks_randomized_draw_order.sql](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/supabase/no-thanks/20260924073500_no_thanks_randomized_draw_order.sql) | `7ab1a46e2fd3655e98767455d85e55ab432db8ae` | `7ab1a46e2fd3655e98767455d85e55ab432db8ae` | 동일·기존근거재사용 |
| [supabase/site/migrations/20260828073047_create_site_invite_infrastructure.sql](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/supabase/site/migrations/20260828073047_create_site_invite_infrastructure.sql) | `c0afec893da8d33deda14b8784deb1108f7b4cbb` | `c0afec893da8d33deda14b8784deb1108f7b4cbb` | 동일·기존근거재사용 |
| [tests/game-db-integration/cant-stop.test.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-db-integration/cant-stop.test.js) | `80658a5877238de5db934764a573fa70090047ae` | `80658a5877238de5db934764a573fa70090047ae` | 동일·기존근거재사용 |
| [tests/game-db-integration/no-thanks.test.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-db-integration/no-thanks.test.js) | `a1b25c2f4056b4494fd1e9613f745752f5f37cfd` | `a1b25c2f4056b4494fd1e9613f745752f5f37cfd` | 동일·기존근거재사용 |
| [tests/game-db-integration/platformContract.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-db-integration/platformContract.js) | `972dad82fe201924260cd528d6b794c5b33fb32a` | `972dad82fe201924260cd528d6b794c5b33fb32a` | 동일·기존근거재사용 |
| [tests/game-platform-contracts.test.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-platform-contracts.test.js) | `182dd2719bcfc4872c3d990ab7b6d2149399c2c4` | `182dd2719bcfc4872c3d990ab7b6d2149399c2c4` | 동일·기존근거재사용 |
| [tests/game-platform-db-contract.test.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-platform-db-contract.test.js) | `03cf2a54967ac2cd1267391fb8c8df20a7854ed3` | `03cf2a54967ac2cd1267391fb8c8df20a7854ed3` | 동일·기존근거재사용 |
| [tests/game-platform-foundation.test.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-platform-foundation.test.js) | `eed28ef5e853d5d40ec041f0408fe80d533a6181` | `eed28ef5e853d5d40ec041f0408fe80d533a6181` | 동일·기존근거재사용 |
| [tests/game-platform-governance.test.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-platform-governance.test.js) | `4c7d3c865cb09ab19d4831404f0c43fa77bc3b12` | `4c7d3c865cb09ab19d4831404f0c43fa77bc3b12` | 동일·기존근거재사용 |
| [tests/game-platform-invite.test.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-platform-invite.test.js) | `106bc5e0f92f3e9276aad52a3108d786f9aac4dc` | `106bc5e0f92f3e9276aad52a3108d786f9aac4dc` | 동일·기존근거재사용 |
| [tests/game-platform-shell.test.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/tests/game-platform-shell.test.js) | `64e6251a273fe972a6932052e777bc5fe91152ba` | `64e6251a273fe972a6932052e777bc5fe91152ba` | 동일·기존근거재사용 |
| [the-game/js/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/the-game/js/bgm.js) | `658dad4a481e9d5737bbd837813c788201197fb3` | `658dad4a481e9d5737bbd837813c788201197fb3` | 동일·기존근거재사용 |

## 11. Astra 핵심 질문·blocker와 후속 의무

| 질문 | 이번 확보 / 실제 설계 blocker | 실행으로 확인할 항목 |
|---|---|---|
| Q1 전수목적지/문서계층 | 전체ID/원문문맥확보. K및분할조각의최종책임문서·절/적용/참조·parent연결미완료는동결gate blocker | 실제행동PASS가없다는것은문서목적지판단전체를막지않음 |
| Q2 DB/hostless권위조건 | 승인분리조건확보. 선택에따라X02/03의상위진입/검증조건전환필요. 미래host불성립정책은별도승인 | 안전11등모델oracle·실제backend/2client·제품rematch검증 |
| Q3 경로/탐지공존 | 현재flat/direct특성확보. 선택경로를Guard/test가발견못하면그전환blocker | import sideeffect·기존Auth/게임회귀·실제build/link/unit실행 |
| Q4 계약버전/CURRENT | 현재국소버전/권위와링크확보. 경쟁CURRENT/깨진entry/구버전consumer강제이관은blocker | deploymentmanifest·exactloadedbytes/호환증거 |
| Q5 단일권위/수명owner | 이미승인된Coreinvariant/선택model/실제resourceowner보존. 숨은Adapter엔진·복수최종판정충돌은blocker | success부터cleanup/lateeffect까지·T01~03·A/C/Pactualtrace |
| Q6 Slice/테스트예산 | 등록CIscope/시간제한·승인oracle·미선택환경확보. 구현을나중시험으로권위공백해결한다고숨기면blocker | 실제지원기기/망/성능·BGM/Invite·backup/삭제/비용/운영은후속NOT_RUN/UNKNOWN |

정밀audio·보상·미선택Profile·비roomInvite·아직선택하지않은미래장르/모델은전체Targetblocker로올리지않는다. 실제선택조합의권위/순서/수명안전의미로설명되지않는정확한공백만해당결론을멈춘다. 실행증거가없는것과설계의미가없는것은다르다.

이번 검사: 실제HEAD/PR병합대조, 계획원본hash·identity보존, 66확보파일Gitblob대조, STEP1 3,232고유ID/분류·원문source문맥기계집계, inventory89행대조, 고정링크·표·상태/허용범위검사. 이는 문서입력 검사이며 Guard/unit/DB/browser/audio/두client/성능/운영을 실행하지 않았다. source/tests존재로PASS·지원완료를선언하지않는다.

## 12. 다음 첫 작업 — Astra 판단용 전달 프롬프트

다음담당은 **Astra**. 아래는복사하여다음요청에서사용할프롬프트다. 이번문서작성은그판단실행·정식반영·동결승인이아니다.

```text
Game Platform vNext STEP6의 핵심 경계와 Target 판단안을 준비해줘.

담당: Astra.
실제 입력: game-platform-vnext-step6-evidence.md 전체 구조와 관련 원문/전수 입력 부록;
필요 시 game-platform-vnext-step6-plan-and-handoff.md 실제 원본.
저장소 limbit95/limbit95.github.io.
integration feature/game-platform-vnext-integration.
고정 판단 SHA f34f4f180e14ea36847b9740dea43de2f1325e56.

AGENTS → 실행 계획1.5 → rebuild README → CURRENT → CP0087 → PR416/Git 순서로
필요 상태를 복원해줘. Sol의 실제 HEAD·merge 증거/동일 blob/trace를 재사용하고
최신 remote와 고정 SHA의 추가 변경·의미 충돌만 분리해줘.
STEP5C COMPLETED/DESIGN_RESULT_APPROVED/INTEGRATION_MERGED,
STEP6 기록 NOT_STARTED·행동 NOT_RUN·UNKNOWN·구현/실행/오픈 의무·main 별도 게이트 유지.
OPEN/미병합/과거HOLD는 복원 조건·유효 결정·실제 Git과 함께 당시 이력으로 읽어줘.
근거 요약과 승인 원문이 다르면 유효 결정·원문을 우선하고 차이를 명시해줘.

판단은 근거 E1~6을 모두 연결해줘:
1. 승인 책임·적용 조건과 실제 충돌 행만 해소. 완료된 구조/공급자/요금/운영 재판단 금지.
2. Target 논리·문서 계층 및 전수 조항 목적지/적용/전환/검증 대응 판단안.
   STEP1 3,232관리단위(K1,198/L906/H562/I566)의 원문ID/부모문맥/강도/의도/조건/예외,
   분할 의미조각을 보존. STEP2 49조항/B01~12는 전수표가 아님.
   §13 전수 원문 행을 입력으로 사용하고, 명시 parent-ID·분할 연결 공백을 숨기지 마.
   각 조각의 새 책임 문서·절/참조 또는 정확한 동결 blocker를 제시해줘.
   L/H/I는 기존범위·이력·문맥으로 보존하고 공통MUST로 승격하지 마.
3. 신규 보드 / 실시간2D 온라인협동 / room·host없는 local 또는 async·기록형 요청을
   공통→장르→네문서bootstrap→모델→검증까지 코드없이 추적해줘.
   필요/조건부/비적용/미지원/미선택을 구분. 실제Probe게임은 새로 선택하지 마.
4. 물리 경로·기존consumer 격리와 Guard/build/import/test발견 변경범위 판단안.
   direct games의 shared만 제외·flatshared 새module·flatpolicy/test 조건을 반영.
   nestedshared 선택이면 탐지/테스트 확대가 경로 추가 전에 확보되어야 함.
5. 계약버전·기존/신규 적용·한 CURRENT 권위·STEP7 원자적 연결/전환 범위 판단안.
   Invite v1/legacySQL v1.0.0/계획개정을 전체플랫폼계약버전으로 오해하지 마.
6. 구현 Slice·의존순서·검증종류/예산·중단/재검토조건 판단안.
   기존CI5/15분이나 제안표본60분/1000입력/30재연결을 승인예산으로 승격하지 마.
   실제실행 의무와 설계blocker를 분리하고 미실행 때문에 전부 보류하지 마.

계획§6 및 근거§4/5/6/9의 보존 조건 전체를 유지해줘:
기존Auth/게임/API/SQL 무이관; 네문서baseline/유효override/수동gate;
STEP4A success/error/null/finally/cleanup/leave/effect/후속완료·T01~03;
CP0075/D0010 A/C/P·knownexpiry뒤새A금지·동일transaction lateC제한/실제C관측·
fresh P/retry·owneranchor·최초60초/terminal와부분대체 범위;
D0006~10 성능/비용/기록/삭제/탈퇴/backup/복원/운영 UNKNOWN;
Registry단일metadata·Snapshot/Reconnect선택model단일최종채택/복구;
Shell공통/local·BGM기존본체+내부최소수명/H1무보완연결보류·Inviteidentity/handler/dialog/H2~4;
STEP5B 공식결과/정정·producer-consumer·여섯중복·공개분리·Profile recipe;
STEP5C B01~12/R01~13·DB/비DB동등안전·초기hostless/재대결host불성립/미정 조건.
Room/host/DOM/winner/score/XP 강제, multiplayer재대결 no-op/local우회,
Adapter안의새권한/순서/수명/token/audio엔진, 미래미선택전체blocker승격 금지.
장르명으로transport/renderer/tick/physics/prediction을 확정하지 마.
실제상위의미 변경이 필요하면 해당원문·행·영향·승인항목만 명시해줘.

기존 trace·동일blob과 승인원문을 재사용. 결론을바꿀 해당공백/충돌만 추가읽고
고정SHA/blob·줄/심볼·판단영향을 남겨줘. 전체source/SQL감사·외부재조사·별도사후감사 금지.

제출:
A. Target/문서계층/물리경로·owner·조건/기존격리 판단표.
B. 전수ID/의미조각 목적지·적용/전환/검증대응 또는 정확한동결blocker 표.
C. 세요청 추적·계약버전/권위전환·Guard범위/원자적연결 판단표.
D. Slice/테스트예산·실제설계blocker와후속구현/실행/오픈 의무.
E. 사용자승인핵심선택·승인뒤Sol/Codex정식반영범위·다음첫작업과복사형인계프롬프트.
관찰사실/승인요구/Astra판단/미확인을 구분해줘.

결과를 game-platform-vnext-step6-astra-judgment.md로 자동 문서화해줘.
판단안 제출만 하고 멈춰줘. 사용자핵심판단승인+명시적정식반영 허용을 별도 게이트로 남겨줘.
Target 판단안을 승인된동결/STEP6 COMPLETED/행동PASS/지원완료로 선언하지 마.
저장소변경·branch/PR/checkpoint·실제rulebook/Guard권위전환·구현·실제시험·운영·
구매/문의/job/dump/복원·병합/main·STEP7이후는 하지 마.
```

## 13. 전수 원문 입력 부록 — 목적지 미선택

이 부록은 고정 STEP1 조항표의 **전체 안정 ID 행과 원문 열을 재사용**한다. 원문 source별 절 제목/도입·조건/예외·강도·E 소비근거·K/L/H/I를 유지하고, 새 목적지를 덧붙이지 않았다. 각 source 링크와 blob은 원 STEP1 기준이며 이번 inventory 대조에서 동일 blob을 확인했다. 표에 적힌 원래 STEP 진행/상태는 당시 입력의 이력이다. 현재 상태는 §1이다.

기계적으로 원표의 9개열·3232행을 옮겼다. 행의 원문·강도·조건을 요약/재판단하지 않았다. 절 제목을 함께 읽고 parent 도입과 sibling을 분리하지 않는다. 정확한 source 절/줄은 각 행의 L범위와 고정source링크를 사용한다. 명시parent-ID·semanticfragment·새목적지 미완성은 §5.2에 밝힌다. 전수입력확보는 전수계승/Target동결완료가 아니다.

### 전수 입력: platform

고정 원표: [docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md) · blob `e1a6515b38db0164146ca3a51fc29aae60275c6a`.





### AGENT — `AGENTS.md`

- source: [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/AGENTS.md)
- blob: `2686a3c37502bbf1f7f2a9407640e78cc026dadb`; 원문 135줄; 상태 `CURRENT`; 83 관리단위 / 70 규칙·필드 단위.


#### AGENTS.md

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-AGENT-001 · L3–3 | 이 저장소는 `청파 같이` 사이트와 웹게임을 함께 관리하는 프로젝트입니다. Codex를 포함한 자동화 에이전트는 아래 규칙을 우선하여 작업합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 기본 작업 흐름

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-AGENT-002 · L7–7 | - 모든 작업은 최신 `main` 브랜치를 기준으로 시작합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-003 · L8–8 | - 소스를 수정하기 전에 작업 목적에 맞는 별도 작업 브랜치를 사용합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-004 · L9–9 | - `main` 브랜치에 직접 commit 또는 push하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-005 · L10–10 | - 변경사항은 작업 브랜치에 commit한 뒤 Pull Request로 제출합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-006 · L11–11 | - 사용자의 명시적 승인 없이 Pull Request를 `main`에 merge하지 않습니다. | 표현:승인 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 브랜치 명명 규칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-AGENT-007 · L15–15 | - 기본 형식은 `&lt;type&gt;/&lt;root-slug&gt;-phase&lt;N&gt;-&lt;detail&gt;`을 사용합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-008 · L16–16 | - `feature`, `fix`, `refactor`, `chore` 등 `type`은 실제 작업 성격에 맞게 선택합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-009 · L17–17 | - 하나의 큰 작업이 시작되어 완료될 때까지 `root-slug`는 동일하게 유지합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-010 · L18–18 | - 세부 단계나 후속 작업은 `phase&lt;N&gt;`과 `detail`만 변경하여 구분합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-011 · L19–19 | - 기존 작업의 후속 브랜치에서 별도 `root-slug`를 임의로 만들지 않습니다. 새로운 `root-slug`는 완전히 별개의 작업을 시작할 때만 사용합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-012 · L20–20 | - 브랜치 정리, 삭제 대상 제안, 기존 작업 참조 시에는 `type`보다 `root-slug`를 우선 기준으로 삼습니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-013 · L21–21 | - 삭제 대상 브랜치는 같은 `root-slug`끼리 묶어 검토하고, 현재 작업과 다른 `root-slug`의 브랜치를 작업 기준으로 혼용하거나 참조하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-014 · L22–22 | - 단계 구분이 불필요한 단일 작업은 `phase&lt;N&gt;`을 생략할 수 있지만, 여러 단계로 이어질 가능성이 있다면 처음부터 `phase&lt;N&gt;` 형식을 우선 사용합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-015 · L24–24 | 예시: | 서술형(수치화 안 함) | CONTEXT / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-016 · L26–30 | ```text<br>feature/marble-stability-phase1-foundation<br>feature/marble-stability-phase2-room-sync<br>fix/marble-stability-phase3-ci<br>``` | 서술형(수치화 안 함) | EXAMPLE / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-017 · L32–32 | 위 예시처럼 `type`은 달라질 수 있어도 같은 작업 계보라면 `marble-stability`를 공통 `root-slug`로 유지합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 변경 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-AGENT-018 · L36–36 | - 기존 아키텍처, 코딩 스타일, 데이터 구조와 기존 동작을 최대한 유지합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-019 · L37–37 | - 요구사항을 충족하는 데 필요한 최소 범위만 수정합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-020 · L38–38 | - 기존 기능에 의도하지 않은 영향을 줄 수 있는 변경을 피합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-021 · L39–39 | - 요청과 관계없는 리팩터링, 파일 이동, 이름 변경, 포맷 전체 변경은 하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-022 · L40–40 | - 기존에 사용 중인 패턴과 유틸리티가 있다면 새 구조를 추가하기 전에 우선 재사용합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-023 · L41–41 | - 외부 의존성 추가는 꼭 필요한 경우에만 하며, 기존 방식으로 해결할 수 있는지 먼저 확인합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-024 · L42–42 | - Supabase DB 객체를 새로 생성하거나 기존 객체의 Data API 권한 경계를 변경할 때는 권한을 프로젝트 기본값에 맡기지 않고 실제 호출 주체와 필요한 최소 권한을 명시적으로 검토합니다. 본 사이트 DB는 `supabase/README.md`, Game Platform DB/RPC는 `docs/game-platform-db-test-contract.md`를 세부 기준으로 따릅니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-025 · L43–43 | - GitHub Actions 워크플로 수정이나 불필요한 CI 실행을 유발하는 변경은 요청이 없는 한 하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 문서 점검 및 변경 안전 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-AGENT-026 · L47–47 | - 문서 정리를 이유로 기존 아키텍처 결정, 게임 규칙, DB 계약, 진행 중인 Phase 정의를 임의로 변경하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-027 · L48–48 | - 기준일, 기준 브랜치 또는 release version이 명시된 audit, plan, release 문서는 해당 시점의 이력으로 보존하며 현재 상태에 맞추기 위해 내용을 전면 재작성하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-028 · L49–49 | - 루트 README나 영역별 README처럼 현재 상태를 설명하는 문서는 실제 코드, 테스트, workflow, migration 등으로 명백한 불일치가 확인된 경우에만 필요한 문구를 최소 수정합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-029 · L50–50 | - 문서끼리 충돌하거나 어느 설명이 현재 기준인지 불명확하면 추측으로 하나를 선택하지 않고 기존 내용을 유지한 채 불일치와 확인 필요 사항을 보고합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-030 · L51–51 | - 문서 이동, 삭제, 통합과 대규모 표현 통일은 별도 범위의 작업으로 취급합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Game Platform 신규 게임 필수 규칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-AGENT-031 · L55–55 | - `games/&lt;game-id&gt;/` 아래 신규 platform-native 게임을 생성하거나 수정하기 전에 반드시 `docs/game-platform-development-rules.md`와 `docs/game-platform-ui-rules.md`를 읽고 따릅니다. | 표현:반드시 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-032 · L56–56 | - 사용자가 매번 Game Platform 규칙이나 UI 조사/설계 규칙을 다시 명시하지 않아도 두 문서를 신규 게임 작업의 기본 전제로 적용합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-033 · L57–57 | - `games/shared/`의 현재 코드와 계약 테스트를 함께 확인하고, DB/RPC 작업이면 정식 계약 문서인 `docs/game-platform-db-test-contract.md`를 추가로 확인합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-034 · L58–58 | - `docs/game-platform-strategy.md`와 `docs/game-platform-invite-analysis.md`는 배경/이력 참고 문서이며 신규 게임 작업의 필수 선행 문서로 취급하지 않습니다. | 표현:필수 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-035 · L59–59 | - Legacy 게임 소스는 참고 자료일 뿐 신규 게임의 기본 구조나 공통 계약으로 사용하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-036 · L60–60 | - Legacy 보호 설명을 제외한 현재 Game Platform 공통 규칙·가이드·템플릿에는 특정 platform-native 게임명이나 그 게임만의 구현 세부사항을 기준 규칙으로 넣지 않습니다. 게임별 내용은 해당 게임의 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`, 게임별 테스트에 둡니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-037 · L61–61 | - 사용자가 새로운 게임 개발을 요청하면 gameplay/runtime 구현 전에 게임 규칙·제품 범위와 원본 디자인·구성물·Visual Identity·자산 사용 가능 범위를 조사하고 `games/&lt;game-id&gt;/GAME_SPEC.md`, `games/&lt;game-id&gt;/DEVELOPMENT.md`, `games/&lt;game-id&gt;/UI_DESIGN.md`, `games/&lt;game-id&gt;/UI_DECISIONS.md`를 먼저 생성합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D01 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-038 · L62–62 | - 공개된 기존 보드게임을 구현하는 경우 공식 규칙서나 신뢰 가능한 규칙 출처를 우선 확인하고 `GAME_SPEC.md`에 출처와 해석 결정을 남깁니다. UI는 공식/퍼블리셔 자료와 실제 구성물을 조사하고 `UI_DESIGN.md`에 디자인 출처, 목표 판본, Visual Identity, 저작권·라이선스 판단과 구현 계획을 기록합니다. 확인되지 않은 규칙이나 자산 사용 권리는 추측하지 않습니다. | 서술형(수치화 안 함) | RULE / B | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-039 · L63–63 | - `GAME_SPEC.md`는 현재 기능 규칙·구조의 기준, `DEVELOPMENT.md`는 기능 개발 진행·검증 인수인계, `UI_DESIGN.md`는 소스 개발 전 전수 조사·분석으로 수립한 초기 디자인 baseline, `UI_DECISIONS.md`는 개발 시작 후의 의미 있는 디자인 변경·대안·결정 이유·검증 이력과 baseline override를 기록합니다. | 표현:검증 | RULE / P | E-GOV | D04 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-040 · L64–64 | - bootstrap 단계에서는 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`만 있는 게임 디렉터리를 Registry 등록 전 상태로 둘 수 있습니다. 실제 runtime 파일을 추가하는 순간 Game Registry와 기존 platform-native 규칙을 함께 적용합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D01 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-041 · L65–65 | - 각 platform-native 게임은 `games/&lt;game-id&gt;/DEVELOPMENT.md`를 기능 개발상태의 인수인계 문서로 유지하고, 디자인 개발의 진행·변경 이력은 `games/&lt;game-id&gt;/UI_DECISIONS.md`에 분리합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-042 · L66–66 | - `UI_DECISIONS.md`에는 모든 CSS 수치 변경을 쌓지 않고, 다음 작업자가 현재 UI만 보고 복원하기 어려운 의미 있는 디자인/interaction 결정과 그 이유를 기록합니다. 개발 시작 후의 변경으로 `UI_DESIGN.md` baseline을 덮어쓰지 않으며, 같은 항목에서 충돌하면 최신 non-superseded `UI_DECISIONS.md`가 우선합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D04 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-043 · L67–67 | - 기존 신규 게임 개발을 이어갈 때는 새 브랜치를 만들기 전에 해당 `DEVELOPMENT.md`와 진행 중 game-id 브랜치를 확인합니다. UI Phase를 이어갈 때는 반드시 `UI_DESIGN.md` baseline과 `UI_DECISIONS.md`의 최신 non-superseded 결정을 함께 읽고, 후속 결정이 초기 Phase보다 우선하도록 하며 이미 반영된 디자인을 원복하지 않습니다. 명확한 진행 중 checkpoint branch가 있으면 그 브랜치를 이어갑니다. | 표현:반드시 | RULE / P | E-GOV | D04 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-044 · L68–68 | - 기능 구현과 자동 검증이 충분히 끝났다고 해서 디자인까지 완료된 것으로 처리하지 않습니다. release 전에는 `docs/game-platform-ui-rules.md`의 Developer Manual Design Review / Detail Polish 단계에서 개발자가 실제 브라우저로 플레이하며 디자인을 수동 검토하는 흐름을 적용합니다. | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-045 · L69–69 | - 이 수동 리뷰에서 개발자가 요청한 여러 디테일 수정은 요청 횟수대로 기록하지 않고, 하나의 디자인 영역이 안정화되어 최종 방향이 확정될 때 의미 있는 decision 하나로 `UI_DECISIONS.md`에 기록합니다. 디자인 PR merge/close, 작업 브랜치 종료, release closeout 전에는 기록 누락이 없는지 확인합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-046 · L70–70 | - 사용자가 `기능 체크포인트 기록하자`라고 요청하면 기능 개발 상태를 `DEVELOPMENT.md`에 기록하고, 기능 설계가 바뀐 경우에만 `GAME_SPEC.md`를 함께 정합화합니다. 디자인 문서는 이 명령 때문에 수정하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D02 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-047 · L71–71 | - 사용자가 `디자인 체크포인트 기록하자`라고 요청하면 현재까지 안정화된 의미 있는 디자인 결정을 `UI_DECISIONS.md`에 기록합니다. 초기 `UI_DESIGN.md` baseline은 재작성하지 않고, 기능 진행 문서는 이 명령 때문에 수정하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D03 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-048 · L72–72 | - 두 checkpoint 명령은 같은 요청에서 함께 사용할 수 있으며, 각각의 책임 문서만 갱신합니다. 접두어가 없는 일반적인 checkpoint 표현이나 새 채팅용 정리·문서·요약 요청은 공식 repository checkpoint 명령으로 자동 해석하지 않습니다. 유효한 현재 작업 브랜치가 있으면 그 브랜치에 commit하고, 없으면 저장소의 일반 브랜치 규칙에 따라 별도 작업 브랜치를 사용합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-049 · L73–73 | - 두 사용자 명령과 별개로 기능 Phase 완료·release closeout의 `DEVELOPMENT.md` 갱신 시점과 디자인 lifecycle의 `UI_DECISIONS.md` 기록 트리거는 계속 적용합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-050 · L74–74 | - 중간 checkpoint에서는 Phase를 완료 처리하지 않으며 실제 완료 항목, 미완료 항목, 다음 첫 작업, 검증 상태를 명확히 구분합니다. | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-051 · L75–75 | - 모든 platform-native 게임은 로비 또는 시작 전 화면에서 처음 플레이하는 사용자도 이해할 수 있는 상세 규칙 안내를 제공하고, 플레이 중에도 다시 확인할 수 있는 진입점을 유지합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-052 · L76–76 | - 모든 platform-native 게임은 진행 중 세션을 안전하게 끝낼 수 있는 명시적 게임 종료 경로를 제공하며, 온라인 멀티플레이 종료는 서버 권위와 확인 UI를 적용합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-053 · L77–77 | - 모든 멀티플레이 platform-native 게임은 게임 종료 후 기존 room/player context를 유지하는 재대결 흐름을 기본 기능으로 제공하고, 참여 플레이어 준비 완료 후 방장이 다시 시작할 수 있어야 합니다. 세부 lifecycle과 서버 권위는 `docs/game-platform-development-rules.md`를 따릅니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D07 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-054 · L78–78 | - 하위 game-local/topic-owner 작업에서 현재 상위 Game Platform 규칙과 충돌하는 새 필요를 발견했다고 해서 바로 소스나 하위 규칙을 수정하지 않습니다. 먼저 기존 상위 규칙과 shared/runtime 경계를 확인하고, 사용자와의 토의에서 플랫폼 전반에 필요한 변경으로 명시적으로 합의된 경우에만 **Game Platform ARCHITECTURE CHANGE**로 승격합니다. 승격된 작업은 `docs/game-platform-development-rules.md`와 `docs/game-platform-governance.md`의 전파/영향도 감사 절차를 따릅니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D10 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-055 · L79–79 | - Game Platform CURRENT 규칙, shared 계약 또는 필수 lifecycle을 변경하는 작업은 현재 Registry의 모든 platform-native 게임을 전수 검토하고 각 게임을 `COMPLIANT` / `MIGRATION_REQUIRED` / `NOT_APPLICABLE`로 분류합니다. `IN_PROGRESS` 게임의 충돌은 release 전에 해소하고, `RELEASED` 게임은 별도 migration/follow-up 필요 여부를 작업 결과와 PR에 남깁니다. | 표현:필수 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 작업 전 확인

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-AGENT-056 · L83–83 | - 작업 대상과 연관된 기존 코드와 주변 호출부를 먼저 확인합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-057 · L84–84 | - `README.md`, 관련 문서, 기존 테스트 및 설정 파일을 참고하여 프로젝트의 현재 동작을 파악합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-058 · L85–85 | - `package.json`에 정의된 명령을 우선 사용하고 존재하지 않는 lint/typecheck 명령을 임의로 만들지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 설치 및 검증

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-AGENT-059 · L89–89 | 의존성 설치가 필요한 경우 기본적으로 다음 명령을 사용합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-060 · L91–93 | ```bash<br>npm ci<br>``` | 서술형(수치화 안 함) | EXAMPLE / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-061 · L95–95 | 현재 루트 `package.json`에서 사용할 수 있는 주요 검증 명령은 다음과 같습니다. | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-062 · L97–103 | ```bash<br>npm run build:assets<br>npm run test:e2e<br>npm run test:game-platform<br>npm run test:the-game<br>npm run test:marble<br>``` | 서술형(수치화 안 함) | EXAMPLE / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-063 · L105–105 | - 변경 범위와 관련된 테스트, build 및 기타 검증을 실행합니다. | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-064 · L106–106 | - 테스트가 존재하는 기능을 수정했다면 해당 테스트를 반드시 실행합니다. | 표현:반드시 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-065 · L107–107 | - 오류가 발생하면 원인을 분석하여 필요한 수정을 한 뒤 다시 검증합니다. | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-066 · L108–108 | - Playwright 등 환경 의존성 때문에 실행할 수 없는 검증이 있다면 실패 원인과 미실행 항목을 작업 결과에 명확히 기록합니다. | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-067 · L109–109 | - 코드 변경이 없는 문서 전용 작업은 불필요한 전체 테스트 실행을 생략할 수 있으나, 변경 파일과 diff가 의도한 범위인지 확인합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 작업 완료 보고

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-AGENT-068 · L113–113 | 작업 완료 시 다음 내용을 간결하게 정리합니다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-069 · L115–115 | - 변경한 파일 | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-070 · L116–116 | - 각 변경의 이유 | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-071 · L117–117 | - 수행한 테스트, lint, typecheck, build 및 결과 | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-072 · L118–118 | - 실행하지 못한 검증과 그 이유 | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-073 · L119–119 | - 남아 있는 주의사항 또는 후속 작업 | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-AGENT-074 · L121–121 | 모든 변경사항을 작업 브랜치에 commit하고 Pull Request를 생성합니다. `main` 병합은 사용자의 명시적 승인이 있을 때만 진행합니다. | 표현:승인 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Game Platform vNext 재구축 작업 재개

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-AGENT-075 · L125–125 | `game-platform-vnext` 재구축 작업은 루트 `game_platform_vnext_final_execution_plan.md`와 `docs/game-platform-rebuild/README.md`를 진입점으로 사용합니다. 이 재구축에 한해 루트 계획 개정 1.3의 integration 운영이 일반적인 “최신 main에서 시작” 규칙보다 구체적인 작업 기준입니다. | 서술형(수치화 안 함) | CONTROL / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-076 · L127–127 | - 정식 저장소 기준은 `main`, vNext 누적 통합 기준은 `feature/game-platform-vnext-integration`입니다. | 서술형(수치화 안 함) | CONTROL / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-077 · L128–128 | - 각 신규 STEP은 최신 승인 integration에서 별도 STEP 브랜치를 만들고, STEP PR의 base를 integration으로 둡니다. 작업·기록을 integration에서 직접 누적 개발하지 않습니다. | 표현:승인 | CONTROL / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-078 · L129–129 | - `작업 진행 기록하자`: 현재 재구축 작업을 완료 처리하지 않고 checkpoint/CURRENT에 저장하고 원격 보존을 확인합니다. | 서술형(수치화 안 함) | CONTROL / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-079 · L130–130 | - `다시 이어서 시작하자` / `이어서 시작하자` / `이어서 진행하자`: 루트 계획 → 기록 README → integration/CURRENT → 현재 STEP 브랜치·PR → 최신 checkpoint/DECISIONS/artifacts 순으로 실제 Git 상태를 대조합니다. STEP 0이 integration에 미병합된 동안에는 `docs/game-platform-vnext-phase0-bootstrap`과 PR #404를 확인합니다. | 서술형(수치화 안 함) | CONTROL / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-080 · L131–131 | - 채팅방 변경만으로 새 브랜치를 만들지 않고 유효한 미완료 STEP 브랜치를 이어갑니다. 통상 재개 시 main과 integration을 매번 비교·동기화하지 않으며, 실제 main 별도 변경이 확인된 경우에만 영향도를 검토합니다. | 서술형(수치화 안 함) | CONTROL / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-081 · L132–132 | - STEP PR의 integration 병합과 integration → main 반영은 별도의 승인 게이트입니다. 검토/승인 대기 상태를 승인으로 확대하지 않고 사용자의 명시적 승인 없이 어느 쪽도 merge하거나 다음 STEP을 시작하지 않습니다. | 표현:승인 | CONTROL / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-082 · L133–133 | - 이 integration 운영은 vNext 재구축에 한정되며 저장소 전체의 신규 기능 개발 금지나 일반 작업 Governance로 확대하지 않습니다. | 표현:금지 | CONTROL / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-AGENT-083 · L135–135 | 상세 기록 규칙과 단계별 통과 기준은 루트 실행 계획 개정 1.3 및 `docs/game-platform-rebuild/`를 따릅니다. | 서술형(수치화 안 함) | CONTROL / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### DEV — `docs/game-platform-development-rules.md`

- source: [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-development-rules.md)
- blob: `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`; 원문 863줄; 상태 `CURRENT`; 443 관리단위 / 435 규칙·필드 단위.


#### Game Platform Development Rules

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-001 · L3–3 | &gt; **문서 분류:** CURRENT | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DEV-002 · L5–5 | 이 문서는 청파 같이에서 **새로운 platform-native 게임을 구현하거나 수정할 때 기본적으로 따라야 하는 실행 규칙**이다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-003 · L7–7 | 사용자가 매 작업마다 아래 규칙을 다시 설명하지 않아도, 신규 게임 작업은 이 문서를 기본 전제로 진행한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-004 · L9–9 | `AGENTS.md`의 저장소 전체 작업 규칙은 그대로 적용되며, 이 문서는 Game Platform 영역의 추가 규칙이다. 게임별 UI/UX 조사·설계·구현은 `docs/game-platform-ui-rules.md`를 함께 필수 기준으로 적용한다. 문서 간 설명이 충돌하거나 현재 코드와 맞지 않는 경우 임의로 해석하지 않고 실제 코드와 테스트를 확인한 뒤 최소 범위로 정리한다. | 표현:필수 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 1. 적용 대상

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-005 · L13–13 | 이 규칙은 다음 작업에 적용한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-006 · L15–15 | - `games/&lt;game-id&gt;/` 아래 새 게임 생성 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-007 · L16–16 | - 기존 platform-native 게임 기능 추가 또는 수정 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-008 · L17–17 | - 신규 게임의 Room/Lobby, Invite, Snapshot/Reconnect, Realtime, DB/RPC 연결 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-009 · L18–18 | - 신규 게임 때문에 `games/shared/`의 공통 계약을 변경하려는 작업 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-010 · L20–20 | 다음 Legacy 게임은 이 규칙으로 강제 마이그레이션하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-011 · L22–22 | - Liar Game | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-012 · L23–23 | - Drawing Spy | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-013 · L24–24 | - The Game | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-014 · L25–25 | - Blue Marble / Marble | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-015 · L27–27 | Legacy의 현재 동작 보호가 우선이며, 신규 플랫폼과 맞추기 위한 이유만으로 Legacy를 수정하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 2. 규칙 용어

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-016 · L31–31 | - **MUST**: 신규 platform-native 게임에서 반드시 지켜야 한다. | 본문:MUST; 표현:반드시 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-017 · L32–32 | - **MUST NOT**: 신규 platform-native 게임에서 사용하면 안 된다. | 본문:MUST NOT | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-018 · L33–33 | - **SHOULD**: 특별한 이유가 없다면 기본적으로 따른다. | 본문:SHOULD | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-019 · L34–34 | - **GAME-LOCAL**: 해당 게임의 규칙과 구현에 남겨야 하는 영역이다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-020 · L35–35 | - **SHARED**: 게임 규칙과 무관하게 미래 게임에서도 반복되는 플랫폼 책임이다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-021 · L36–36 | - **ARCHITECTURE CHANGE**: 하위 topic-owner에서 발견한 필요가 현재 상위 Game Platform 규칙이나 shared contract의 허용 범위를 벗어나지만, 토의 결과 특정 게임의 예외가 아니라 플랫폼 전반에 필요한 변경으로 명시적으로 승격된 작업이다. | 표현:예외 | RULE / P | E-DOC | D10 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3. 작업 시작 전

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-022 · L40–40 | 신규 게임 작업자는 소스 수정 전에 다음을 확인해야 한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-023 · L42–42 | 1. 최신 `main`에서 작업 브랜치를 만든다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-024 · L43–43 | 2. **이 문서와 `docs/game-platform-ui-rules.md`를 필수 실행 기준으로 읽는다.** | 표현:필수 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-025 · L44–44 | 3. `games/shared/`의 현재 공통 계약과 관련 테스트를 확인한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-026 · L45–45 | 4. `games/GAME_SPEC_TEMPLATE.md`, `games/DEVELOPMENT_TEMPLATE.md`, `games/UI_DESIGN_TEMPLATE.md`, `games/UI_DECISIONS_TEMPLATE.md`를 기준으로 초기 문서를 준비한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-027 · L46–46 | 5. DB/RPC가 포함되면 정식 계약 문서인 `docs/game-platform-db-test-contract.md`를 추가로 확인한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-028 · L47–47 | 6. Legacy 게임 코드를 신규 게임의 기본 구조로 복사하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-029 · L49–49 | `docs/game-platform-strategy.md`와 `docs/game-platform-invite-analysis.md`는 플랫폼을 구축한 배경과 결정 과정을 보존하는 참고 문서다. 신규 게임 개발을 시작하기 위한 필수 선행 문서가 아니며, 현재 실행 규칙은 이 문서와 실제 `games/shared/` 코드·테스트를 우선한다. | 표현:필수 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-030 · L51–51 | 새 게임의 기본 위치는 다음과 같다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-031 · L53–55 | ```text<br>games/&lt;game-id&gt;/<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-032 · L57–57 | `game-id`는 lowercase kebab-case를 사용하고 Game Registry에도 동일한 ID를 등록한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3A. 신규 게임 초기 세팅과 설계 문서

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-033 · L61–61 | 사용자가 `새 게임 만들자`, `&lt;게임명&gt; 개발 시작하자`처럼 신규 게임 개발을 요청하면 gameplay/runtime 코드부터 작성하지 않는다. 먼저 게임 규칙과 제품 범위뿐 아니라 원본 디자인과 Visual Identity까지 조사해 다음 작업자가 구현 방향을 복원할 수 있는 bootstrap 문서를 만든다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-034 · L63–63 | 기본 순서는 다음과 같다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-035 · L65–65 | 1. 게임의 원본 규칙과 구성요소를 조사한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-036 · L66–66 | 2. 공식/퍼블리셔 자료와 실제 구성물을 기준으로 색상, 심볼, 카드/보드/칩 구조, 레이아웃, 타이포그래피, 분위기와 자산 사용 가능 범위를 조사한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-037 · L67–67 | 3. 이번 웹게임에서 지원할 인원, 규칙 버전/변형, online/local 범위와 제외 범위를 정한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-038 · L68–68 | 4. `games/&lt;game-id&gt;/GAME_SPEC.md`를 생성해 현재 게임 규칙과 기능 구현 설계를 기록한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-039 · L69–69 | 5. `games/&lt;game-id&gt;/DEVELOPMENT.md`를 생성해 기능 개발의 현재 진행·검증 상태와 다음 기능 작업을 기록한다. | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-040 · L70–70 | 6. `games/&lt;game-id&gt;/UI_DESIGN.md`를 생성해 디자인 전수 조사 결과, Visual Identity, 독립 페이지 경험, 최초 UI/presentation Phase와 validation 기준을 runtime 개발 전에 기록한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-041 · L71–71 | 7. `games/&lt;game-id&gt;/UI_DECISIONS.md`를 생성해 이후 의미 있는 디자인/interaction 변경, 대안, 결정 이유, 구현 상태와 디자인 검증 이력을 기록할 자리를 만든다. | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-042 · L72–72 | 8. 규칙 해석, 디자인 출처, 자산 사용 권리가 불명확한 항목은 임의로 확정하지 않고 책임 문서의 `Open Questions / Deferred`에 남긴다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-043 · L73–73 | 9. 네 문서가 최소 기준을 충족한 뒤 게임 규칙 엔진, Registry, DB/RPC, UI 등 실제 구현을 시작한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-044 · L75–75 | 공개된 기존 보드게임을 웹게임으로 구현하는 경우 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 문서를 우선 확인한다. `GAME_SPEC.md`에는 사용한 출처와 구현상 해석 결정을 남긴다. 규칙 원문을 장문 복제하지 않고 구현에 필요한 사실과 결정만 요약한다. | 서술형(수치화 안 함) | RULE / B | E-DOC | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: GAME_SPEC의 역할

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-045 · L79–79 | `GAME_SPEC.md`는 **이 게임이 무엇이며 청파 같이에서 어떻게 구현할지 정의하는 game-local 설계 기준**이다. 최소 다음 섹션을 유지한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-046 · L81–93 | ```text<br>## Game Overview<br>## Rules and Sources<br>## Product Scope<br>## State Machine<br>## Domain Model<br>## Platform Boundary<br>## Authority and Persistence<br>## UI / UX Direction<br>## Implementation Plan<br>## Validation Plan<br>## Open Questions / Deferred<br>``` | 절:MUST | REQUIRED_SHAPE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-047 · L95–95 | 게임 규칙, 상태 머신, 도메인 모델 또는 구현 경계가 바뀌면 현재 설계와 일치하도록 `GAME_SPEC.md`를 갱신한다. 작은 commit 내역을 쌓는 changelog로 사용하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: UI_DESIGN의 역할

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-048 · L99–99 | `UI_DESIGN.md`는 **신규 게임의 runtime/UI 소스 개발을 시작하기 전에 수행한 디자인 전수 조사와 분석을 바탕으로 수립한 초기 game-local presentation baseline**이다. 세부 작성 규칙과 필수 섹션은 `docs/game-platform-ui-rules.md`와 `games/UI_DESIGN_TEMPLATE.md`를 따른다. | 절:MUST; 표현:필수 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-049 · L101–101 | 최소한 디자인 조사 출처, 자산 사용 경계, 목표 판본, Visual Identity, page/lobby/gameplay/result/rematch 방향, 핵심 motion, responsive 전략, 최초 구현 Phase/순서와 validation 기준을 runtime 구현 전에 확정한다. | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-050 · L103–103 | 개발이 시작된 뒤 사용자 피드백, 실제 브라우저 QA, 구현 관찰로 디자인을 수정하는 경우 그 변경으로 `UI_DESIGN.md`의 과거 baseline을 덮어쓰지 않는다. 이후 변경은 `UI_DECISIONS.md`에 기록한다. `UI_DESIGN.md`는 최초 조사·설계 당시 무엇을 근거로 어떤 방향과 Phase를 세웠는지 복원할 수 있어야 한다. | 절:MUST | RULE / P | E-DOC | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-051 · L105–105 | MUST NOT: 후속 디자인 수정에 맞춰 `UI_DESIGN.md`를 계속 최신 화면으로 재작성해 최초 설계와 후속 변경의 경계를 없애지 않는다. 단, 출처 오기·명백한 사실 오류처럼 초기 조사 자체의 오류를 바로잡는 경우에는 수정 이유가 추적되도록 `UI_DECISIONS.md`에도 남긴다. | 본문:MUST NOT; 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-052 · L107–107 | 이 4문서 체계 도입 전에 이미 runtime/UI 개발이 시작되었거나 release된 platform-native 게임은 과거를 꾸며내어 "개발 전 baseline"으로 재작성하지 않는다. 그런 게임은 도입 시점에 확인 가능한 가장 이른 신뢰 가능한 UI 설계 또는 현재 production/작업 baseline을 **adoption baseline**으로 명시할 수 있다. 이 예외는 기존 게임의 전환을 위한 것이며 신규 게임에는 적용하지 않는다. adoption 이후의 새 디자인 수정은 동일하게 `UI_DECISIONS.md`에 기록한다. | 절:MUST; 표현:예외,할 수 있다 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: UI_DECISIONS의 역할

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-053 · L111–111 | `UI_DECISIONS.md`는 **초기 `UI_DESIGN.md` baseline 이후 확정된 의미 있는 디자인 변경·결정·검증 이력을 보존하는 game-local 기록**이다. 특히 개발자의 실제 브라우저 수동 리뷰와 디테일 수정에서 확정된 결정을 핵심 대상으로 하며, `games/UI_DECISIONS_TEMPLATE.md`를 기준으로 관리한다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-054 · L113–113 | 다음 작업자가 현재 UI 코드나 최종 화면만 보고는 복원하기 어려운 변경을 기록한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-055 · L115–115 | - 사용자 피드백이나 실제 브라우저 관찰로 초기 `UI_DESIGN.md` 방향을 변경한 이유 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-056 · L116–116 | - 검토한 대안과 폐기한 안, 다시 반복하면 안 되는 실패 원인 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-057 · L117–117 | - layout/component/interaction/motion/responsive의 의미 있는 변경 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-058 · L118–118 | - 구현 상태와 실제 UI/브라우저 validation 결과 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-059 · L119–119 | - 어떤 `UI_DESIGN.md` Phase/항목을 유지·수정·대체하는 결정인지 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-060 · L121–121 | MUST NOT: 모든 spacing, CSS 숫자, 작은 commit을 changelog처럼 기록하지 않는다. 과거 결정을 뒤에서 바꾸더라도 기존 항목을 삭제하지 않고 새 항목을 추가해 `SUPERSEDED` 또는 `REVERTED` 관계를 남긴다. | 본문:MUST NOT; 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: 기능 완료 이후 디자인 수동 리뷰 gate

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-061 · L125–125 | 신규 게임의 기능 구현이 충분히 완료되어 release 전 검증·마무리 단계에 들어가면, 자동 테스트 통과만으로 UI를 최종 완료 처리하지 않는다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-062 · L127–127 | 이 시점에는 `docs/game-platform-ui-rules.md`의 **Developer Manual Design Review / Detail Polish** 단계를 적용한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-063 · L129–129 | - 개발자가 실제 브라우저에서 게임을 플레이하며 초기 `UI_DESIGN.md` 구현 결과를 직접 확인한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-064 · L130–130 | - 이 과정에서 개발자가 요청한 의미 있는 디자인 수정은 `UI_DECISIONS.md`에 확정 결정 단위로 남긴다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-065 · L131–131 | - 연속된 미세 조정은 요청별 changelog로 남기지 않고 해당 디자인 영역이 안정화된 시점에 하나의 decision으로 정리한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-066 · L132–132 | - 디자인 작업을 merge/close하거나 release closeout으로 넘어가기 전에 기록 누락이 없는지 확인한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-067 · L133–133 | - 기능 개발의 완료 상태와 디자인 polish 완료 상태를 같은 것으로 취급하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-068 · L135–135 | `디자인 체크포인트 기록하자`의 세부 의미와 기록 단위는 `docs/game-platform-ui-rules.md`가 소유한다. 이 명령의 존재 여부와 관계없이 UI Rules의 lifecycle 기반 기록 규칙은 적용한다. | 절:MUST | RULE / P | E-DOC | D03 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: 게임별 네 문서의 권위와 충돌 해결

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-069 · L139–139 | 네 문서는 서로 대체 관계가 아니라 책임이 다른 authoritative/record 문서다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-070 · L141–141 | - `GAME_SPEC.md`: 현재 게임 규칙, 상태 머신, 기능 lifecycle, 도메인 모델, 서버 권위와 기능 범위의 기준 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-071 · L142–142 | - `DEVELOPMENT.md`: 기능 구현·검증의 현재 Phase, 작업 브랜치, 다음 기능 작업을 전달하는 handoff 기준 | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-072 · L143–143 | - `UI_DESIGN.md`: runtime 구현 전 전수 조사·분석으로 수립한 최초 Visual Identity, page/layout, 구성물 표현, motion, responsive, Phase 계획의 baseline | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-073 · L144–144 | - `UI_DECISIONS.md`: 개발 시작 후 디자인 개발 진행, 변경 배경, 대안, 사용자 피드백, 결정 이유, 구현/검증 이력을 보존하며 baseline을 보정하는 변경 기록 | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-074 · L146–146 | 같은 주제가 여러 문서에 등장하면 **기능과 디자인의 시간축을 함께 적용**한다. 기능 규칙은 `GAME_SPEC.md`, 기능 진행은 `DEVELOPMENT.md`가 책임진다. 디자인은 `UI_DESIGN.md`를 최초 baseline으로 시작하되, 개발 시작 후 해당 항목을 변경한 유효한 `UI_DECISIONS.md` 결정이 있으면 **후속 결정이 우선한다**. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-075 · L148–148 | 따라서 현재 유효 디자인은 단순히 `UI_DESIGN.md` 하나가 아니라 **`UI_DESIGN.md` baseline + `UI_DECISIONS.md`의 최신 non-superseded 변경 결정**으로 해석한다. `UI_DECISIONS.md`에서 `SUPERSEDED` 또는 `REVERTED` 처리된 결정은 현재 기준으로 사용하지 않는다. | 절:MUST | RULE / P | E-DOC | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-076 · L150–150 | MUST NOT: 과거 `UI_DESIGN.md`의 Phase를 이어간다는 이유로 그 이후 확정된 `UI_DECISIONS.md`를 무시하거나, 이미 수정된 UI를 초기 설계안으로 원복하거나, 폐기된 디자인 방향을 다시 구현하지 않는다. | 본문:MUST NOT; 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-077 · L152–152 | MUST NOT: `DEVELOPMENT.md`에서 새로운 게임 규칙이나 UI 설계를 독자적으로 확정하거나 상세 UI 변경 이력을 중복 관리하지 않는다. 기능 설계 변경은 `GAME_SPEC.md`, 후속 디자인 변경은 `UI_DECISIONS.md`에 둔다. | 본문:MUST NOT; 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-078 · L154–154 | 문서끼리 모순이 발견되면 runtime 구현을 계속 진행하기 전에 실제 코드/테스트와 사용자 결정을 확인하고 책임 문서 기준으로 정합화한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: bootstrap 상태와 Registry 노출 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-079 · L158–158 | 신규 게임은 설계를 먼저 확정하기 위해 `games/&lt;game-id&gt;/`에 다음 네 파일만 존재하는 **bootstrap 상태**를 가질 수 있다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-080 · L160–165 | ```text<br>GAME_SPEC.md<br>DEVELOPMENT.md<br>UI_DESIGN.md<br>UI_DECISIONS.md<br>``` | 절:MUST | REQUIRED_SHAPE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-081 · L167–167 | 이 bootstrap 상태에서는 아직 Game Registry에 등록하지 않아도 된다. 미완성 게임이 게임 목록이나 실제 서비스 경로에 노출되는 것을 막기 위한 예외다. | 절:MUST; 표현:예외 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-082 · L169–169 | 다음 중 하나라도 시작하면 bootstrap 상태가 끝난다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-083 · L171–171 | - `index.html`, JavaScript, CSS 등 실제 game runtime 파일 추가 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-084 · L172–172 | - 게임 전용 asset 또는 실행 모듈 추가 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-085 · L173–173 | - 실제 플레이 가능한 화면/엔진 구현 시작 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-086 · L175–175 | bootstrap 상태가 끝나는 PR에서는 같은 변경 범위 안에서 Game Registry 등록을 추가하고 실제 구현된 capability만 선언한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-087 · L177–177 | MUST NOT: 구현 예정이라는 이유만으로 `online`, `invite`, `presence` 같은 capability를 미리 선언하지 않는다. | 본문:MUST NOT; 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3B. 게임별 개발 진행 기록과 채팅 연속성

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-088 · L181–181 | 모든 platform-native 게임은 최초 구현 PR부터 게임 디렉터리 안에 다음 문서를 둔다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-089 · L183–185 | ```text<br>games/&lt;game-id&gt;/DEVELOPMENT.md<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-090 · L187–187 | `DEVELOPMENT.md`는 긴 작업 일지나 commit changelog가 아니라 **다음 작업자가 현재 기능 개발 상태를 즉시 복원하기 위한 인수인계 문서**다. 기능 구현 상태는 `GAME_SPEC.md`와 대조해 기록한다. 디자인 작업이 병행 중이면 상세 이력을 복제하지 않고 `UI_DECISIONS.md`의 현재 디자인 트랙을 참조하며, release 판단에 필요한 상위 UI 상태만 요약할 수 있다. | 표현:할 수 있다 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-091 · L189–189 | 문서는 최소 다음 섹션을 유지한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-092 · L191–199 | ```text<br>## Current Status<br>## Completed<br>## Current Work<br>## Next Work<br>## Decisions<br>## Validation<br>## Known Issues / Deferred<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-093 · L201–201 | `Current Status`에는 최소한 현재 Phase, 상태(`IN_PROGRESS` / `BLOCKED` / `RELEASED`), 현재 작업 브랜치를 기록한다. 전체 게임이 production에 공개된 상태는 `COMPLETED` 대신 `RELEASED`를 사용하고, 개별 Phase 완료 사실은 `Completed`에 기록한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3B. 게임별 개발 진행 기록과 채팅 연속성 > MUST: 작업 시작과 이어서 진행할 때

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-094 · L205–205 | - 신규 게임의 첫 구현 단계에서 `DEVELOPMENT.md`를 함께 생성한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-095 · L206–206 | - 기존 게임 개발을 이어갈 때는 소스 수정 전에 해당 게임의 `DEVELOPMENT.md`를 먼저 읽고 현재 기능 범위의 `GAME_SPEC.md`를 확인한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-096 · L207–207 | - UI/presentation 작업이 포함되거나 기존 `UI_DESIGN.md`의 다음 Phase를 이어갈 때는 반드시 `UI_DESIGN.md` 전체 baseline과 `UI_DECISIONS.md`의 최신 non-superseded 결정을 함께 읽는다. 해당 Phase의 초기 계획과 후속 결정이 충돌하면 후속 결정을 우선하며, 이미 반영된 사용자 디자인 수정을 회귀시키지 않는다. | 절:MUST; 표현:반드시 | RULE / P | E-DOC | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-097 · L208–208 | - `DEVELOPMENT.md`가 진행 중 Phase와 active branch를 가리키면 새 브랜치를 만들기 전에 해당 브랜치가 실제로 존재하고 계속해야 할 작업인지 확인한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-098 · L209–209 | - 진행 중 Phase를 다른 채팅에서 이어가는 것은 새로운 작업 시작이 아니므로, 정상적인 checkpoint branch가 확인되면 최신 `main`에서 별도 브랜치를 새로 만들지 않고 기존 작업 브랜치를 이어간다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-099 · L210–210 | - 게임별 Phase 브랜치명은 가능하면 game id와 작업 범위를 포함해 `feature/game-platform-&lt;phase&gt;-&lt;game-id&gt;-&lt;scope&gt;`처럼 다른 채팅에서도 검색 가능한 형태로 유지한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3B. 게임별 개발 진행 기록과 채팅 연속성 > MUST: Phase 완료 시

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-100 · L214–214 | - 기능 Phase 완료 PR에는 `DEVELOPMENT.md`를 갱신해 실제 완료 기능, 검증, 다음 기능 작업을 남긴다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-101 · L215–215 | - 디자인 Phase 완료 자체만으로 Decision Log를 만들지 않는다. 다만 해당 구간에서 baseline을 벗어난 의미 있는 변경이나 수동 디자인 리뷰의 확정 결정이 있었다면 `UI_DECISIONS.md`에 결정 근거, 어떤 초기 Phase/항목을 대체하는지, 구현/브라우저 검증을 남기고 Current Design Track을 현재 lifecycle 상태로 정리한다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-102 · L216–216 | - 기능 설계 자체가 변경됐다면 `GAME_SPEC.md`를 갱신한다. 개발 시작 후의 디자인 변경은 `UI_DESIGN.md`를 재작성하지 않고 `UI_DECISIONS.md`에 누적한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-103 · L217–217 | - `DEVELOPMENT.md`에는 UI 세부 변경사를 복제하지 않고 release 판단에 필요한 design track 참조만 남긴다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-104 · L218–218 | - 다음 기능 작업은 `DEVELOPMENT.md / Next Work`, 다음 디자인 작업은 `UI_DECISIONS.md / Current Design Track` 또는 `Open Follow-up`에 구체적으로 남긴다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-105 · L219–219 | - 완료되지 않은 항목을 완료한 것처럼 기록하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3B. 게임별 개발 진행 기록과 채팅 연속성 > MUST: 게임 출시 및 release closeout 시

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-106 · L223–223 | 첫 production 공개는 구현 완료와 별개의 lifecycle 단계로 다룬다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-107 · L225–225 | 1. 게임 runtime과 필요한 DB migration이 main에 들어갈 수 있는 상태인지 확인한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-108 · L226–226 | 2. production migration이 필요한 게임은 실제 적용 이력과 RLS/grant/RPC 권한 경계를 검증한다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-109 · L227–227 | 3. Registry capability는 **소스가 존재한다는 이유만으로** 활성화하지 않는다. 실제 제공 가능한 기능만 activation PR에서 켠다. | 절:MUST | RULE / P | E-DOC | D09 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-110 · L228–228 | 4. 관련 unit / Game Platform / DB integration / E2E / build 검증을 통과하고 알려진 기능 release blocker가 없어야 한다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-111 · L229–229 | 5. 기능 구현이 충분히 완료되면 `docs/game-platform-ui-rules.md`의 Developer Manual Design Review / Detail Polish를 거쳐 개발자의 실제 브라우저 수동 검토와 디자인 수정 단계를 수행한다. 이 단계에서 확정된 의미 있는 변경은 `UI_DECISIONS.md`에 기록한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-112 · L230–230 | 6. 사람 중심 다중 브라우저 exploratory playtest가 자동 검증으로 대체되지 않는 위험을 발견하면 수행한다. `UI_DESIGN.md`의 초기 Validation Checklist와 `UI_DECISIONS.md`의 실제 디자인 validation/override 이력을 production 구현과 대조한다. 남은 UI 항목이 blocker가 아니라 후속 polish라면 `UI_DECISIONS.md / Open Follow-up`에 남긴다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-113 · L231–231 | 7. release 기준의 기능 설계는 `GAME_SPEC.md`, 기능 진행은 `DEVELOPMENT.md`, 디자인은 `UI_DESIGN.md` baseline + 최신 non-superseded `UI_DECISIONS.md` overrides와 production 상태가 일치하는지 확인한다. | 절:MUST | RULE / P | E-DOC | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-114 · L232–232 | 8. 사용자에게 노출한 뒤 `DEVELOPMENT.md`를 `Status: RELEASED`, `Active branch: main`으로 갱신하고 날짜가 있는 `## Release — YYYY-MM-DD` 기록에 activation, production migration, 주요 기능/게임플레이 검증, 현재 capability와 디자인 release gate 참조를 남긴다. `UI_DECISIONS.md`의 design track도 release 또는 후속 polish 상태를 명확히 한다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | D09 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-115 · L233–233 | 9. `Completed`의 과거 중간 상태가 현재 상태처럼 읽히지 않도록 "당시/초기 단계"임을 명시하거나 진행 로그로 이동한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-116 · L234–234 | 10. 통합·대체된 stacked PR은 close하고 release에 흡수된 작업/임시 브랜치는 정리한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-117 · L235–235 | 11. 이후 수정은 종료된 Phase 브랜치를 재사용하지 않고 최신 `main`에서 새 `fix/*` 또는 `feature/*` 브랜치로 시작한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-118 · L237–237 | `RELEASED`는 "더 이상 개선하지 않는다"는 뜻이 아니라 **현재 production baseline이 main으로 확정됐다는 뜻**이다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3B. 게임별 개발 진행 기록과 채팅 연속성 > MUST: 사용자가 `기능 체크포인트 기록하자`라고 요청할 때

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-119 · L241–241 | `기능 체크포인트 기록하자`는 Game Platform의 명시적 기능 handoff checkpoint 명령이다. | 절:MUST | RULE / P | E-DOC | D02 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-120 · L243–243 | 사용자가 이 명령을 요청하면 현재 기능 개발 구간의 상태를 `DEVELOPMENT.md`에 갱신하고, 유효한 현재 작업 브랜치에 commit해 다음 채팅이나 다음 작업자가 GitHub에서 바로 이어갈 수 있게 한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-121 · L245–245 | 이 경우: | 절:MUST | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DEV-122 · L247–247 | 1. 기능 Phase가 진행 중이면 상태를 `IN_PROGRESS`로 유지하고 실제 완료 기능, 미완료 기능, 다음 기능 작업, 기능 검증을 기록한다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-123 · L248–248 | 2. 기능 설계 자체가 바뀌었다면 책임 문서인 `GAME_SPEC.md`를 먼저 또는 함께 정합화한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-124 · L249–249 | 3. 기능 blocker, 임시 결정, 확인이 필요한 사항을 책임 섹션에 남긴다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-125 · L250–250 | 4. 기능 checkpoint라는 이유로 `UI_DECISIONS.md`의 디자인 이력을 수정하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-126 · L251–251 | 5. 이 명령 자체는 기능 Phase 완료를 의미하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-127 · L253–253 | `디자인 체크포인트 기록하자`는 별도의 디자인 handoff 명령이며, 세부 규칙은 `docs/game-platform-ui-rules.md`가 소유한다. 사용자가 한 요청에서 두 명령을 모두 명시하면 `DEVELOPMENT.md`와 `UI_DECISIONS.md`를 각각의 책임에 따라 갱신할 수 있다. | 절:MUST; 표현:할 수 있다 | RULE / P | E-DOC | D03 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-128 · L255–255 | 접두어가 없는 일반적인 checkpoint 표현이나 `새 채팅에서 이어서 정리해줘`, `문서로 만들어줘`, `진행상황 요약해줘` 요청은 두 공식 repository checkpoint 명령 중 하나로 자동 확대 해석하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-129 · L257–257 | 두 사용자 명령은 중간 handoff를 즉시 남기는 방법일 뿐이며, Phase 시작/작업 범위 확정, Phase 완료, 디자인 lifecycle 기록 트리거, release closeout, 중요한 설계 변경, blocker/known issue 발생 등 기존 lifecycle 기반 문서 갱신 시점을 대체하거나 제한하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-130 · L259–259 | 중간 checkpoint를 남긴다는 이유만으로 Phase를 완료 처리하지 않는다. 진행 중 유효한 작업 브랜치가 있으면 그 브랜치를 계속 사용하며, 유효한 작업 브랜치가 없다면 저장소의 일반 브랜치 작업 규칙을 따른다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3B. 게임별 개발 진행 기록과 채팅 연속성 > SHOULD: 갱신 빈도

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-131 · L263–263 | `DEVELOPMENT.md`와 `UI_DECISIONS.md`는 모든 작은 commit마다 갱신하지 않는다. | 절:SHOULD | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-132 · L265–265 | `DEVELOPMENT.md`는 다음 시점을 기본으로 한다. | 절:SHOULD | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-133 · L267–267 | - 기능 Phase 시작 또는 기능 작업 범위가 확정될 때 | 절:SHOULD | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-134 · L268–268 | - 기능 Phase 완료 시 | 절:SHOULD | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-135 · L269–269 | - 사용자가 `기능 체크포인트 기록하자`라고 요청한 경우 | 절:SHOULD | RULE / P | E-DOC | D02 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-136 · L270–270 | - 중요한 아키텍처/게임 규칙 결정이 바뀔 때 | 절:SHOULD | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-137 · L271–271 | - 다음 작업자에게 반드시 전달해야 할 기능 blocker나 known issue가 생길 때 | 절:SHOULD; 표현:반드시 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-138 · L273–273 | `UI_DECISIONS.md`는 다음 시점을 기본으로 한다. | 절:SHOULD | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-139 · L275–275 | - 디자인 Phase/범위가 시작·완료·중단될 때 | 절:SHOULD | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-140 · L276–276 | - 사용자 피드백이나 브라우저 QA로 layout/component/interaction/motion/responsive 방향이 의미 있게 변경될 때 | 절:SHOULD | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-141 · L277–277 | - 기존 디자인 안을 폐기·되돌림·대체할 때 | 절:SHOULD | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-142 · L278–278 | - 실제 UI/browser validation 결과가 다음 디자인 작업에 영향을 줄 때 | 절:SHOULD | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-143 · L279–279 | - 사용자가 `디자인 체크포인트 기록하자`라고 요청한 경우 | 절:SHOULD | RULE / P | E-DOC | D03 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 4. 플랫폼과 게임 규칙의 경계 > MUST: 플랫폼 책임을 우선 재사용한다

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-144 · L285–285 | 현재 공통 기반에 해당 책임이 있다면 신규 게임이 다시 구현하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-145 · L287–287 | - Game Registry | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-146 · L288–288 | - Approved Member / Access Gate | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-147 · L289–289 | - Room / Lobby 계약 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-148 · L290–290 | - Versioned / Idempotent Action envelope | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-149 · L291–291 | - Snapshot Coordinator | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-150 · L292–292 | - Reconnect refresh trigger | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-151 · L293–293 | - Common Game Shell | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-152 · L294–294 | - connection/player view-state | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-153 · L295–295 | - platform-native Invite | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-154 · L296–296 | - DB/Test Contract Gate | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 4. 플랫폼과 게임 규칙의 경계 > MUST: 게임 규칙은 GAME-LOCAL에 둔다

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-155 · L300–300 | 다음은 각 게임 내부에 남긴다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-156 · L302–302 | - 게임 규칙 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-157 · L303–303 | - 턴/라운드 상태 머신 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-158 · L304–304 | - 승리/패배 조건 | 절:MUST; 표현:조건 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-159 · L305–305 | - 보드, 카드, 주사위 등 도메인 모델 | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-160 · L306–306 | - 게임별 상태와 계산 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-161 · L307–307 | - 게임 특유의 애니메이션과 연출 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-162 · L308–308 | - 게임 테마와 Visual Identity, 독립 페이지 레이아웃, 카드/보드/칩 등 구성물 표현 | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-163 · L309–309 | - 게임-local UI의 상세 설계는 `UI_DESIGN.md`와 `docs/game-platform-ui-rules.md`를 따른다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 4. 플랫폼과 게임 규칙의 경계 > MUST NOT: 한 게임의 특수 규칙을 shared 계약에 넣지 않는다

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-164 · L313–313 | 공통화 기준은 "코드가 비슷해 보이는가"가 아니라 **게임 규칙과 무관하게 동일한 책임인가**이다. | 절:MUST NOT | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-165 · L315–315 | 한 게임에서만 필요한 예외를 위해 `games/shared/` API를 복잡하게 만들지 않는다. | 절:MUST NOT; 표현:예외 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 4. 플랫폼과 게임 규칙의 경계 > MUST: 현재 플랫폼 규칙과 공통 가이드는 game-agnostic하게 유지한다

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-166 · L319–319 | Legacy 보호 경계를 설명하기 위해 기존 Legacy 게임을 명시하는 경우를 제외하면, 현재 실행 규칙·공통 가이드·템플릿은 특정 platform-native 게임 이름, 경로, 상태 머신 또는 구현 세부사항을 신규 게임의 기준으로 삼지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-167 · L321–321 | - 신규 게임을 설명하는 예시는 `&lt;game-id&gt;`, `example-game` 같은 중립적인 placeholder를 사용한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-168 · L322–322 | - 특정 platform-native 게임의 실제 규칙·UI·DB 구조·release 상태는 해당 게임의 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`, 게임별 테스트에 둔다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-169 · L323–323 | - 과거 플랫폼 구축 과정을 보존하는 strategy/analysis 문서는 특정 게임 이력을 기록할 수 있지만, 반드시 현재 실행 규칙보다 우선하지 않는 참고 문서임을 명시한다. | 절:MUST; 표현:반드시 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-170 · L324–324 | - 한 게임에서 검증된 구현을 다른 게임에 그대로 요구하지 않고, 반복해서 확인된 게임 비종속 책임만 SHARED 계약으로 승격한다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-171 · L325–325 | - `docs/game-platform-*.md` 문서는 제목 아래에 `&gt; **문서 분류:** CURRENT` 또는 `HISTORY`를 반드시 선언한다. | 절:MUST; 표현:반드시 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-172 · L326–326 | - `CURRENT` 문서는 현재 Registry의 어떤 platform-native 게임명/ID도 공통 규칙으로 포함하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-173 · L327–327 | - 메인 규칙서 자신을 제외한 모든 `docs/game-platform-*.md`는 `docs/game-platform-development-rules.md`를 현재 rulebook으로 명시해야 한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-174 · L328–328 | - `HISTORY` 문서는 과거 구현 이력을 기록할 수 있지만 현재 규칙·템플릿·구현 기준으로 사용하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-175 · L329–329 | - `AGENTS.md`와 `games/` 최상위의 공통 Markdown 문서는 별도 표기가 없어도 `CURRENT`로 취급한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 4. 플랫폼과 게임 규칙의 경계 > MUST: 출시 후 플랫폼 피드백 루프를 수행한다

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-176 · L332–332 | 각 platform-native 게임을 출시한 뒤 구현 과정에서 나온 결정을 다음 세 종류로 다시 분류한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-177 · L334–334 | 1. **SHARED 후보** — 인증, 권한, room/lobby, snapshot/reconnect, version/idempotency, invite, 공통 identity처럼 게임 규칙과 무관하게 반복될 플랫폼 책임 | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-178 · L335–335 | 2. **GAME-LOCAL 유지** — 규칙, 상태 머신, 플레이 중 이탈 정책의 게임별 의미, 보드/주사위/연출처럼 해당 게임의 도메인 책임 | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-179 · L336–336 | 3. **RELEASE-OPERATIONS 규칙** — production migration, capability activation, 문서 closeout, PR/브랜치 정리처럼 개발 lifecycle 책임 | 절:MUST | RULE / P | E-DOC | D09 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-180 · L338–338 | 첫 게임 한 번에서 편리했다는 이유만으로 SHARED 후보를 즉시 공통 API로 승격하지 않는다. 다음 게임에서도 같은 책임이 반복되거나 플랫폼 경계상 명백히 공통인 경우에만 shared 코드/계약을 확장하며, 그때 계약 테스트와 이 규칙 문서를 함께 갱신한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 4. 플랫폼과 게임 규칙의 경계 > MUST: 모든 신규 게임 release 뒤 플랫폼 회고를 수행한다

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-181 · L342–342 | Game Platform 규칙은 한 번 완성하고 고정하는 규칙집이 아니다. 신규 platform-native 게임을 실제로 구현하고 출시할 때마다 **그 게임에서 드러난 구조적 마찰을 근거로 갱신하는 살아 있는 개발 기준**으로 유지한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-182 · L344–344 | release closeout에서는 최소한 다음 질문을 다시 검토한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-183 · L346–346 | 1. 기존 shared 계약을 그대로 재사용할 수 있었는가? | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-184 · L347–347 | 2. 게임마다 다시 구현한 코드나 판단이 있었는가? | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-185 · L348–348 | 3. 공통 책임인데 game-local workaround로 우회한 부분이 있었는가? | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-186 · L349–349 | 4. 기존 규칙이 불필요하게 복잡하거나 실제 개발 흐름을 방해한 부분이 있었는가? | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-187 · L350–350 | 5. 반대로 규칙이 부족해 파일 위치, 권위 모델, DB 경계, release 절차가 흔들린 부분이 있었는가? | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-188 · L351–351 | 6. 새 게임 추가로 탐색해야 할 경로·문서·예외가 불필요하게 늘어나지는 않았는가? | 절:MUST; 표현:예외 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-189 · L352–352 | 7. 다음 게임 개발자가 이전 게임의 내부 구현을 읽지 않고도 플랫폼 계약만으로 시작할 수 있는가? | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-190 · L354–354 | 문제가 확인되면 단순히 문서에 예외를 하나 더 붙이는 것으로 끝내지 않는다. 먼저 기존 규칙을 단순화하거나 공통 계약을 정돈해서 **게임 수가 늘어도 구조 이해 비용과 신규 개발 시간이 비례해서 증가하지 않도록** 한다. | 절:MUST; 표현:예외 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-191 · L356–356 | 플랫폼 개선의 목표는 코드량 자체를 줄이는 것이 아니라 다음을 유지하는 것이다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-192 · L358–358 | - 같은 종류의 파일과 책임이 예측 가능한 위치에 있다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-193 · L359–359 | - 같은 플랫폼 문제는 같은 방식으로 해결한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-194 · L360–360 | - 새 게임이 기존 게임의 세부 구현을 복사하지 않아도 된다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-195 · L361–361 | - 공통 변경의 영향 범위와 검증 방법을 빠르게 찾을 수 있다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-196 · L362–362 | - 게임 수가 늘어도 한 게임을 추가하기 위해 읽고 판단해야 하는 범위가 급격히 커지지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-197 · L364–364 | 따라서 **일관성 없는 빠른 구현보다 반복 가능한 구조를 우선**한다. 다만 미래를 추측한 과도한 추상화도 같은 비용을 만들 수 있으므로, 실제 신규 게임에서 반복해서 확인된 문제를 근거로 최소 범위에서 규칙과 shared 계약을 개선한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 5. Registry와 capability

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-198 · L368–368 | 신규 게임의 bootstrap 문서 단계에서는 Registry 등록을 유예할 수 있다. 실제 runtime 구현을 시작하는 순간 Game Registry에 등록한다. | 표현:할 수 있다 | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-199 · L370–370 | platform-native 게임은 다음 값을 사용한다. | 서술형(수치화 안 함) | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-200 · L372–374 | ```text<br>platform = "shared"<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-201 · L376–376 | 실제 제공하는 기능만 capability로 선언한다. | 서술형(수치화 안 함) | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-202 · L378–378 | 예: | 서술형(수치화 안 함) | CONTEXT / I | E-REG | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DEV-203 · L380–385 | ```text<br>online<br>local<br>invite<br>presence<br>``` | 서술형(수치화 안 함) | EXAMPLE / I | E-REG | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DEV-204 · L387–387 | MUST NOT: 구현되지 않은 기능을 capability에 미리 선언하지 않는다. | 본문:MUST NOT | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 5. Registry와 capability > MUST: 구현 완료와 production activation을 구분한다

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-205 · L391–391 | `online`, `invite`, `presence` 같은 capability가 true라는 것은 코드 파일이 존재한다는 뜻이 아니라 **현재 배포 환경에서 사용자에게 제공할 준비가 끝났다는 선언**이다. | 절:MUST | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-206 · L393–393 | online capability를 활성화하기 전에는 최소한 다음을 확인한다. | 절:MUST | RULE / P | E-REG | D09 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-207 · L395–395 | - 필요한 production migration 적용 여부 | 절:MUST | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-208 · L396–396 | - RLS / grant / RPC authorization 경계 | 절:MUST | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-209 · L397–397 | - 해당 게임의 DB/Test Contract | 절:MUST | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-210 · L398–398 | - stale version / idempotency / reconnect 등 관련 회귀 | 절:MUST | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-211 · L399–399 | - 실제 entry route와 Registry href | 절:MUST | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-212 · L400–400 | - release blocker 부재 | 절:MUST | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-213 · L402–402 | Invite를 활성화한다면 shared `game_room` routing과 서버-side token 재검증까지 확인한다. | 절:MUST; 표현:검증 | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-214 · L404–404 | MUST NOT: Registry capability 값이나 게임 목록 미노출을 인증/인가 보안 경계로 취급하지 않는다. 정적 route를 직접 아는 사용자가 페이지에 접근할 수 있으므로 실제 접근 제어는 Access Gate와 서버 RPC/RLS가 계속 책임진다. capability와 목록 노출은 release/기능 제공 상태를 선언하는 운영 메타데이터다. | 본문:MUST NOT; 절:MUST | RULE / P | E-REG | D09 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 5. Registry와 capability > MUST: Registry 테스트 책임을 분리한다

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-215 · L408–408 | Legacy 보호 테스트는 보호 대상 Legacy 게임의 존재와 핵심 계약을 명시적으로 검증할 수 있다. | 절:MUST; 표현:검증,할 수 있다 | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-216 · L410–410 | 공통 Game Platform 테스트는 Registry의 전체 게임 개수나 전체 ID 목록을 고정하지 않는다. 신규 platform-native 게임이 추가될 때마다 공통 foundation 테스트의 기대 배열이나 고정 길이를 수정하는 구조를 만들지 않는다. | 절:MUST | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-217 · L412–412 | 개별 platform-native 게임의 Registry 설정과 capability, 실제 사용자 노출 상태는 해당 게임의 테스트가 검증한다. Registry ID 중복, shared 경로, runtime 등록 여부처럼 게임 수와 무관한 불변조건은 공통 계약 또는 Governance Guard가 검증한다. | 절:MUST; 표현:조건,검증 | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-218 · L414–414 | 이 분리의 목적은 Legacy 보호 강도를 낮추는 것이 아니라, 보호 대상과 확장 가능한 신규 게임의 테스트 책임을 분리해 게임 수 증가가 공통 테스트 수정량 증가로 이어지지 않게 하는 것이다. | 절:MUST | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-219 · L416–416 | 전체 사람이 직접 플레이하는 exploratory smoke는 자동 검증을 대체하지 않는다. 반대로 자동/운영 계약이 충분히 검증된 상태에서 남은 위험이 presentation·브라우저 정책 같은 관찰 항목뿐이라면 해당 항목을 `Known Issues / Deferred`에 남기고 post-release에서 확인할 수 있다. | 절:MUST; 표현:검증,할 수 있다 | RULE / P | E-REG | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6. Room / Session 계약

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-220 · L420–420 | 온라인 멀티플레이가 room/session 개념을 사용하는 경우 기존 shared Room/Lobby 계약을 우선 검토한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-221 · L422–422 | 플랫폼이 공통으로 보장해야 하는 책임은 특정 보드게임의 준비 방식이 아니라 다음과 같은 **세션 경계**다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-222 · L424–424 | - 세션 생성 또는 참가 | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-223 · L425–425 | - 현재 사용자가 속한 활성 세션 확인 | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-224 · L426–426 | - 권한이 적용된 authoritative snapshot 조회 | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-225 · L427–427 | - 안전한 세션 이탈 | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-226 · L428–428 | - 상태 변경을 감지해 snapshot refresh를 유도하는 invalidation 구독 | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-227 · L430–430 | 현재 `defineRoomLobbyAdapter` 구현은 다음 surface를 제공한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-228 · L432–441 | ```text<br>createRoom<br>joinRoom<br>getMyActiveRoom<br>getLobbySnapshot<br>setReady<br>leaveRoom<br>startGame<br>subscribeInvalidation<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / M-ROOM | E-ROOM | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-229 · L443–443 | `setReady`와 `startGame`은 현재 shared 구현에서 검증된 lifecycle이지만 **모든 미래 게임의 보편 규칙으로 간주하지 않는다.** 전원 ready가 없거나, 자동 시작하거나, host가 없거나, 다른 방식으로 세션이 시작되는 게임에 억지로 빈 메서드나 가짜 의미를 추가하지 않는다. | 표현:검증 | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-230 · L445–445 | 새 게임의 자연스러운 lifecycle이 현재 adapter와 맞지 않으면: | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DEV-231 · L447–447 | 1. game-local workaround로 shared 계약을 우회하지 않는다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-232 · L448–448 | 2. 현재 adapter를 그대로 강제하기 위해 의미 없는 method를 구현하지 않는다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-233 · L449–449 | 3. 실제 반복 가능한 플랫폼 책임인지 검토한 뒤 shared 계약을 가장 작은 범위로 확장하거나 분리한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-234 · L450–450 | 4. 계약 변경 시 관련 contract test와 이 문서를 함께 갱신한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-235 · L452–452 | 현재 adapter를 그대로 사용하는 게임은 해당 surface 전체를 구현해야 하며, 각 메서드 내부 구현과 실제 RPC 이름은 게임별로 달라도 된다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-236 · L454–454 | MUST: 세션 생성/참가/준비/시작 등 상태 전이가 존재한다면 해당 권한과 조건은 서버가 최종 판단한다. | 본문:MUST; 표현:조건 | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-237 · L456–456 | MUST NOT: UI에서 버튼을 숨기거나 비활성화했다는 이유로 서버 권한 검증을 생략하지 않는다. | 본문:MUST NOT; 표현:검증 | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6A. 플레이어 닉네임 / 로비 정체성

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-238 · L459–459 | 사이트 계정으로 참가하는 platform-native 멀티플레이 게임에서 플레이어 표시 이름은 **사이트 계정 프로필의 확정 닉네임**을 사용한다. | 서술형(수치화 안 함) | RULE / S | E-SITE | D05 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-239 · L461–461 | - MUST: 세션 생성/참가/초대 등 플레이어 identity가 확정되는 모든 진입 경로에서 현재 로그인 사용자의 프로필 닉네임을 사용한다. | 본문:MUST | RULE / S | E-SITE | D05 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-240 · L462–462 | - MUST: 닉네임의 생성·변경·중복 검사는 마이페이지 등 사이트 공통 프로필 흐름에서만 수행한다. | 본문:MUST | RULE / S | E-SITE | D05 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-241 · L463–463 | - MUST NOT: 게임별 entry/lobby 화면에 닉네임 입력, 임시 닉네임, 게임별 닉네임 변경 UI를 제공하지 않는다. | 본문:MUST NOT | RULE / S | E-SITE | D05 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-242 · L464–464 | - MUST NOT: 게임 참가 요청의 임의 client payload를 authoritative 닉네임으로 신뢰하지 않는다. | 본문:MUST NOT | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-243 · L465–465 | - SHOULD: 게임별 서버 RPC는 가능한 경우 `auth.uid()`에 연결된 프로필의 닉네임을 직접 조회해 room member 표시 이름을 확정한다. | 본문:SHOULD | RULE / S | E-SITE | D05 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-244 · L466–466 | - 기존 호환성 때문에 RPC에 nickname 파라미터가 남아 있더라도 서버는 해당 값을 표시 이름의 권위로 사용하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-245 · L468–468 | 이 규칙의 목적은 게임마다 다른 이름을 사용하는 것을 막고, 사이트에서 중복 검사를 거쳐 확정한 하나의 커뮤니티 정체성을 모든 게임에서 일관되게 사용하는 것이다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 7. 서버 권위

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-246 · L472–472 | 온라인 게임의 상태 변경은 기본적으로 다음 흐름을 따른다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-247 · L474–483 | ```text<br>Client intent<br>→ authenticated game-specific RPC<br>→ auth / approval / membership / role / phase / version validation<br>→ transaction / row lock when needed<br>→ authoritative DB state<br>→ Realtime invalidation<br>→ authorized snapshot refresh<br>→ UI render<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / M-DB | E-DB | D06, R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-248 · L485–485 | MUST: 클라이언트는 사용자의 **의도(intent)** 를 전달한다. | 본문:MUST | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-249 · L487–487 | MUST: 실제 게임 상태 변경 가능 여부와 결과는 서버가 결정한다. | 본문:MUST | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-250 · L489–489 | MUST NOT: 클라이언트가 계산한 결과를 검증 없이 authoritative state로 저장하지 않는다. | 본문:MUST NOT; 표현:검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-251 · L491–491 | MUST NOT: Realtime payload 자체를 게임 상태의 최종 진실로 사용하지 않는다. | 본문:MUST NOT | RULE / M-DB | E-DB | D06 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 8. Versioned / Idempotent Action

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-252 · L495–495 | 게임 상태를 변경하는 명령은 가능한 한 공통 action envelope를 사용한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-253 · L497–503 | ```text<br>roomId<br>expectedVersion<br>clientActionId<br>actionType<br>payload<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-254 · L505–505 | `actionType`은 lowercase snake_case를 사용한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-255 · L507–507 | MUST: `expectedVersion`으로 stale client action이 최신 상태를 덮어쓰지 못하게 한다. | 본문:MUST | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-256 · L509–509 | MUST: `clientActionId`로 중복 클릭, 재전송, 네트워크 retry가 상태를 두 번 진행시키지 못하게 한다. | 본문:MUST | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-257 · L511–511 | 게임별 RPC와 테이블 이름은 게임 namespace에 남긴다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-258 · L513–513 | MUST NOT: 모든 게임을 하나의 거대한 공통 game-state 테이블이나 공통 gameplay RPC로 합치지 않는다. | 본문:MUST NOT | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 9. Snapshot / Reconnect / Realtime

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-259 · L517–517 | authoritative snapshot은 non-negative integer `version`을 가져야 한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-260 · L519–519 | 신규 게임은 `createSnapshotCoordinator`를 기준으로 다음 동작을 유지한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-261 · L521–521 | - authoritative snapshot 로드 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-262 · L522–522 | - stale snapshot 거부 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-263 · L523–523 | - 연속 invalidation refresh coalescing | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-264 · L524–524 | - 최신 accepted snapshot을 UI에 반영 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-265 · L526–526 | Reconnect는 이벤트 replay가 아니라 authoritative snapshot 재조회로 복원한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-266 · L528–528 | 브라우저의 다음 복귀 신호에서는 snapshot refresh가 가능해야 한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-267 · L530–530 | - online | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-268 · L531–531 | - pageshow | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-269 · L532–532 | - visibility visible | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-270 · L534–534 | MUST: Realtime은 **invalidation 신호**로 사용한다. | 본문:MUST | RULE / M-DB | E-DB | D06 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-271 · L536–536 | MUST NOT: Realtime 이벤트 순서나 전달 성공만으로 게임 상태를 복원하지 않는다. | 본문:MUST NOT | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-272 · L538–538 | 구독과 browser listener는 게임 화면 종료 시 정리할 수 있어야 한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 10. Common Game Shell

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-273 · L542–542 | 신규 게임은 Common Game Shell을 기본 화면 골격으로 사용할 수 있다. | 표현:할 수 있다 | RULE / M-DOM | E-SHELL | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-274 · L544–544 | Shell이 담당하는 범위: | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DEV-275 · L546–546 | - 게임 제목과 설명 | 서술형(수치화 안 함) | RULE / M-DOM | E-SHELL | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-276 · L547–547 | - 게임 목록 복귀 | 서술형(수치화 안 함) | RULE / M-DOM | E-SHELL | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-277 · L548–548 | - 방 식별 정보 | 서술형(수치화 안 함) | RULE / M-DOM | E-SHELL | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-278 · L549–549 | - 연결 / 재연결 / 오프라인 / 오류 상태 | 서술형(수치화 안 함) | RULE / M-DOM | E-SHELL | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-279 · L550–550 | - 공통 플레이어 roster | 서술형(수치화 안 함) | RULE / M-DOM | E-SHELL | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-280 · L551–551 | - 메인 게임 영역과 sidebar 기본 배치 | 서술형(수치화 안 함) | RULE / M-DOM | E-SHELL | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-281 · L552–552 | - 하단 action 영역 | 서술형(수치화 안 함) | RULE / M-DOM | E-SHELL | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-282 · L554–554 | `game-shell.css`는 신규 게임 페이지가 명시적으로 opt-in 한다. | 서술형(수치화 안 함) | RULE / M-DOM | E-SHELL | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-283 · L556–556 | MUST NOT: 공통 Shell을 이유로 게임 고유 보드, 카드, 주사위, 3D, 애니메이션, 테마를 획일화하지 않는다. | 본문:MUST NOT | RULE / M-DOM | E-SHELL | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-284 · L558–558 | MUST: 게임 목록에서 진입한 뒤의 entry/lobby/gameplay/result/rematch는 `docs/game-platform-ui-rules.md`에 따라 해당 게임의 독립적인 Visual Identity를 갖도록 설계한다. | 본문:MUST | RULE / M-DOM | E-SHELL | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 10A. 게임 규칙 안내와 게임 종료

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-285 · L562–562 | 모든 platform-native 게임은 처음 플레이하는 사용자가 외부 검색 없이 게임을 이해하고 안전하게 세션을 끝낼 수 있어야 한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 10A. 게임 규칙 안내와 게임 종료 > MUST: 게임 규칙 안내

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-286 · L566–566 | - 사용자가 플레이를 시작하기 전에 접근 가능한 entry/setup 화면(로비가 있는 게임은 로비 포함)에서 항상 **게임 규칙 보기**에 접근할 수 있어야 한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-287 · L567–567 | - 규칙 안내는 처음 플레이하는 사용자가 읽고 바로 플레이할 수 있을 정도로 목표, 구성요소, 턴 순서, 가능한 선택, 실패/패널티, 종료/승리 조건, 대표 예시를 충분히 설명한다. | 절:MUST; 표현:조건 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-288 · L568–568 | - 공개된 기존 보드게임은 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 출처를 먼저 확인하고 구현 규칙과 사용자 안내가 같은 해석을 사용해야 한다. | 절:MUST | RULE / B | E-DOC | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-289 · L569–569 | - 규칙이 짧거나 중간 분량이면 modal/dialog를 사용할 수 있고, 내용이 길거나 예시·도표가 많으면 game-local 전용 규칙 페이지를 사용한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-290 · L570–570 | - 규칙 modal/page의 Visual Identity, game component 활용, 정보 계층, 접근성·responsive presentation은 `docs/game-platform-ui-rules.md`의 게임 규칙 안내 presentation 기준을 따른다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-291 · L571–571 | - 규칙 원문을 장문 복제하지 않고 출처를 남긴 뒤 웹게임에 필요한 사실과 해석을 상세히 재구성한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-292 · L572–572 | - 실제 플레이 중에도 규칙 안내를 다시 열 수 있는 경로를 유지하는 것을 기본값으로 한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 10A. 게임 규칙 안내와 게임 종료 > MUST: 게임 종료 / 세션 이탈

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-293 · L576–576 | - 지속되는 플레이 세션을 갖는 게임은 진행 중인 세션을 끝낼 수 있는 명시적 **게임 종료** 또는 이에 준하는 안전한 종료 경로를 제공한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-294 · L577–577 | - 온라인 멀티플레이에서 게임 전체를 종료하는 권한은 게임별로 명확히 정의하며, 다른 플레이어의 세션에 영향을 주는 종료는 서버가 최종 권한을 검증한다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-295 · L578–578 | - 파괴적 종료는 확인 modal/dialog를 거쳐 오조작을 방지한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-296 · L579–579 | - 종료 후 모든 클라이언트가 authoritative snapshot 또는 명시적 terminal state로 동일한 결과를 복구할 수 있어야 한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-297 · L580–580 | - 종료된 사용자가 active session에 영구히 묶이지 않도록 leave, rematch, entry return 등 후속 경로를 정의한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-298 · L581–581 | - 브라우저를 닫거나 단순히 다른 페이지로 이동하는 것을 authoritative 게임 종료로 간주하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 10B. 멀티플레이 재대결 lifecycle

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-299 · L585–585 | 모든 멀티플레이 platform-native 게임은 정상 종료 또는 재대결을 허용하는 terminal state 이후 **같은 참여 맥락에서 다시 플레이할 수 있는 재대결 기능**을 기본 제품 요구사항으로 제공한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-300 · L587–587 | 기본 사용자 흐름은 다음과 같다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-301 · L589–599 | ```text<br>GAME_OVER / TERMINAL<br>→ 결과 확인<br>→ 재대결 선택<br>→ 기존 room / active player identity를 유지한 준비 상태<br>→ 참여 플레이어가 준비 완료<br>→ 시작 가능한 인원과 준비 조건 충족<br>→ 방장이 게임 시작<br>→ 이전 gameplay state 초기화<br>→ 새 게임 시작<br>``` | 표현:조건 | REQUIRED_SHAPE / M-ROOM | E-ROOM | D07, C03/R01, R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |

#### 10B. 멀티플레이 재대결 lifecycle > MUST

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-302 · L603–603 | - 재대결을 위해 사용자가 새 방을 생성하거나 방 코드를 다시 입력하도록 강제하지 않는다. | 절:MUST | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-303 · L604–604 | - 기존 room, 참여 player identity, host와 플랫폼 세션 맥락은 가능한 범위에서 유지한다. | 절:MUST | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-304 · L605–605 | - 이전 게임의 점수, 카드, 보드, 칩, 주사위, 턴, 승패, 임시 효과 등 gameplay state는 새 게임 기준으로 초기화한다. | 절:MUST | RULE / M-ROOM | E-ROOM | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-305 · L606–606 | - 재대결 준비 상태에서 참여 플레이어의 ready 상태와 방장의 시작 가능 조건을 명확히 표현한다. | 절:MUST; 표현:조건 | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-306 · L607–607 | - 새 게임 시작 조건과 권한은 서버가 최종 검증한다. | 절:MUST; 표현:조건,검증 | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-307 · L608–608 | - 재대결을 원하지 않는 플레이어는 안전하게 이탈할 수 있어야 하며, 이탈 후 최소 플레이 인원과 host 승계 등 필요한 조건을 authoritative하게 다시 검증한다. | 절:MUST; 표현:조건,검증 | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-308 · L609–609 | - reconnect가 발생해도 authoritative snapshot으로 재대결 준비 상태 또는 새 게임 상태를 복구할 수 있어야 한다. | 절:MUST | RULE / M-ROOM | E-ROOM | C03/R01, R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-309 · L610–610 | - 결과와 재대결 presentation은 `docs/game-platform-ui-rules.md`에 따라 게임 고유 Visual Identity 안에서 이어진다. | 절:MUST | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-310 · L612–612 | 재대결이 공통 제품 요구사항이라는 이유만으로 모든 게임에 동일한 RPC 이름이나 `games/shared/` adapter method를 즉시 강제하지 않는다. 현재 Room/Lobby 계약으로 자연스럽게 표현되면 재사용하고, 여러 게임에서 반복되는 구현 책임이 확인될 때만 shared 계약 승격을 검토한다. | 절:MUST | RULE / M-ROOM | E-ROOM | D07 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-311 · L614–614 | 초기 게임 시작에 ready/host 개념이 없는 특수한 게임이라도 재대결에서는 사용자가 다시 플레이하겠다는 의사를 명시하고 방장이 시작 가능한 준비 화면으로 전환하는 청파 같이 공통 UX를 제공한다. 게임 규칙상 방장 자체가 성립하지 않는 구조를 도입하려면 별도 플랫폼 규칙 변경으로 다룬다. | 절:MUST | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 11. Invite

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-312 · L618–618 | Invite를 제공하는 신규 게임은 기존 사이트 공통 invite 인프라와 Game Platform Invite 계약을 사용한다. | 서술형(수치화 안 함) | RULE / M-INVITE | E-INVITE | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-313 · L620–620 | 필수 Registry 조건: | 표현:조건,필수 | RULE / M-INVITE | E-INVITE | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-314 · L622–626 | ```text<br>platform === "shared"<br>capabilities.online === true<br>capabilities.invite === true<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / M-INVITE | E-INVITE | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-315 · L628–628 | 공통 포맷: | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DEV-316 · L630–637 | ```text<br>target_type = game_room<br>target_id   = &lt;game-specific room id&gt;<br>metadata    = {<br>  game_id: "&lt;registry game id&gt;",<br>  platform_version: 1<br>}<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / M-INVITE | E-INVITE | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-317 · L639–639 | MUST: 이동 목적지는 invite metadata의 임의 URL이 아니라 Game Registry의 `href`에서 결정한다. | 본문:MUST | RULE / M-INVITE | E-INVITE | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-318 · L641–641 | MUST: 초대 token resolve 이후에도 실제 참가 권한은 게임별 join RPC가 다시 검증한다. | 본문:MUST; 표현:검증 | RULE / M-INVITE | E-INVITE | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-319 · L643–643 | MUST NOT: 게임마다 별도의 새로운 invite target type이나 전용 invite infrastructure를 만들지 않는다. | 본문:MUST NOT | RULE / M-INVITE | E-INVITE | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 12. DB / RPC 품질 게이트

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-320 · L647–647 | 신규 온라인 platform-native 게임은 `tests/game-db-integration/platformContract.js`의 공통 계약을 첫 구현부터 적용한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-321 · L649–649 | MUST: DB migration이 Data API 노출 schema에 새 table/view/function/sequence를 생성하거나 기존 객체의 권한 경계를 변경하면 프로젝트의 자동 default privilege에 의존하지 않고 `docs/game-platform-db-test-contract.md`의 Data API 권한 계약에 따라 역할별 `GRANT`/`REVOKE`, 테이블 RLS, RPC `EXECUTE` 경계를 명시적으로 검토한다. | 본문:MUST | RULE / M-DB | E-DB | D08 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-322 · L651–651 | 게임별 테스트 파일 예: | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DEV-323 · L653–655 | ```text<br>tests/game-db-integration/&lt;game-id&gt;.test.js<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-324 · L657–657 | 최소 필수 시나리오: | 표현:필수 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-325 · L659–659 | 1. 익명 사용자의 create + join 차단 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-326 · L660–660 | 2. 미승인 회원의 create + join 차단 | 표현:승인 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-327 · L661–661 | 3. 승인 회원의 create + join 허용 | 표현:승인 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-328 · L662–662 | 4. non-member snapshot 차단 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-329 · L663–663 | 5. 게임 시작 조건/권한의 server-side 검증 | 표현:조건,검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-330 · L664–664 | 6. stale version 거부 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-331 · L665–665 | 7. duplicate action 중복 적용 방지 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-332 · L666–666 | 8. concurrent conflicting action의 single authoritative commit | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-333 · L667–667 | 9. reconnect 시 authoritative snapshot 복원 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-334 · L668–668 | 10. 멀티플레이 게임의 same-room rematch lifecycle과 재시작 권한/조건의 server-side 검증 | 표현:조건,검증 | RULE / M-DB | E-DB | D07 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-335 · L669–669 | 11. 다른 플레이어 private state 미노출 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-336 · L671–671 | private state가 없는 게임도 11번을 생략하지 않고 **노출될 private state가 없음을 검증**한다. | 표현:검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-337 · L673–673 | MUST: DB integration은 disposable local Supabase에서 검증한다. | 본문:MUST; 표현:검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-338 · L675–675 | MUST NOT: 테스트를 위해 production Supabase 데이터나 스키마를 직접 변경하지 않는다. | 본문:MUST NOT | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 13. shared 계약을 변경해야 할 때

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-339 · L679–679 | 신규 게임을 구현하다 현재 플랫폼 계약으로 표현할 수 없는 요구가 발견될 수 있다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-340 · L681–681 | 그 경우 다음 순서로 판단한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-341 · L683–683 | 1. 해당 요구가 게임 규칙 자체인지 확인한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-342 · L684–684 | 2. 게임 규칙이면 GAME-LOCAL에 둔다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-343 · L685–685 | 3. 게임 규칙과 무관하고 미래의 여러 게임에서도 반복될 플랫폼 책임인지 확인한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-344 · L686–686 | 4. SHARED 책임으로 확인된 경우에만 가장 작은 범위로 공통 계약을 확장한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-345 · L687–687 | 5. shared 변경에는 계약 테스트와 관련 문서 변경을 함께 포함한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-346 · L688–688 | 6. `games/shared/` 모듈을 사이트 공통 `js/`나 다른 영역이 직접 소비한다면 해당 소비자 모듈의 import/export 연결 검증도 유지한다. Game Platform 전용 CI로 분리하더라도 이 교차 경계를 검증 없이 제외하지 않는다. | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-347 · L690–690 | MUST NOT: 현재 게임을 빠르게 구현하기 위한 편의 때문에 shared에 게임별 예외를 추가하지 않는다. | 본문:MUST NOT; 표현:예외 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-348 · L692–692 | MUST NOT: 실제 소비자가 없는 미래 기능을 추측해 범용 엔진으로 선행 구현하지 않는다. | 본문:MUST NOT | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 13A. 하위 규칙 발견과 Game Platform Architecture Change 승격

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-349 · L696–696 | 신규 게임 개발 중 하위 game-local 문서나 topic-owner 규칙에서 현재 상위 규칙으로는 수용할 수 없는 필요가 먼저 발견될 수 있다. **하위에서 먼저 발견했다는 사실은 그 변경에 상위 권위를 부여하지 않는다.** | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 13A. 하위 규칙 발견과 Game Platform Architecture Change 승격 > 일반 변경

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-350 · L700–700 | - 새 필요가 현재 상위 규칙과 shared/runtime 경계 안에서 세부화 가능한 경우 topic-owner 문서에서 가장 구체적인 규칙을 먼저 정의한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-351 · L701–701 | - 이후 상위/진입 문서는 같은 세부 규칙을 다시 독립 정의하지 않고 필요한 invariant와 topic-owner 참조만 전파한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 13A. 하위 규칙 발견과 Game Platform Architecture Change 승격 > 상위 규칙과 충돌하는 경우

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-352 · L705–705 | - 토의·승격 없이 하위 문서 또는 runtime/source부터 상위 규칙을 벗어나게 수정하는 것은 **불허용**이다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-353 · L706–706 | - 소스 수정 전에 현재 상위 규칙, shared contract, 기존 platform-native 게임에 미치는 영향을 확인한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-354 · L707–707 | - 사용자/maintainer와의 토의에서 해당 필요가 특정 게임의 예외가 아니라 Game Platform 전반에 필요한 변경이라고 명시적으로 합의되면 **ARCHITECTURE CHANGE**로 승격한다. | 표현:예외 | RULE / P | E-DOC | D10 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-355 · L708–708 | - 승격된 뒤에는 하위 topic-owner와 상위 규칙을 같은 작업 범위에서 함께 정합화할 수 있으며, runtime 구현보다 규칙/계약 변경과 영향도 감사를 먼저 또는 같은 원자적 변경에서 완료한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-356 · L709–709 | - 승격 전의 하위 제안을 기존 상위 규칙을 우회하는 임시 예외로 구현하지 않는다. | 표현:예외 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-357 · L711–711 | ARCHITECTURE CHANGE 작업은 최소 다음을 함께 검토한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D10 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-358 · L713–713 | 1. `docs/game-platform-development-rules.md` 최상위 invariant | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-359 · L714–714 | 2. 관련 topic-owner 문서(UI, DB/Test, Governance 등) | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-360 · L715–715 | 3. `games/shared/` 계약과 관련 contract test | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-361 · L716–716 | 4. game-local 템플릿과 신규 게임 bootstrap 규칙 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-362 · L717–717 | 5. Governance Guard와 workflow/검증 범위 | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-363 · L718–718 | 6. Registry의 모든 `platform: "shared"` 게임 영향도 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-364 · L719–719 | 7. Legacy 경계와 site-level 소비자 영향 여부 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-365 · L721–721 | 세부 전파 절차와 자동 검증 경계는 `docs/game-platform-governance.md`의 **공통 규칙 변경 전파 원칙**을 따른다. | 표현:원칙,검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 14. Legacy 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-366 · L725–725 | 신규 게임 개발 중 다음을 기본값으로 한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-367 · L727–727 | - Legacy 파일을 수정하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-368 · L728–728 | - Legacy DB/RPC를 새 게임의 공통 인터페이스로 삼지 않는다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-369 · L729–729 | - Legacy의 중복 코드를 제거하기 위해 신규 게임 작업 범위를 확장하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-370 · L730–730 | - Legacy와 신규 게임의 UI 불일치를 이유로 Legacy를 마이그레이션하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-371 · L732–732 | Legacy에서 확인된 패턴은 참고 자료일 뿐 신규 플랫폼의 계약이 아니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-372 · L734–734 | Legacy 변경이 필요해 보이면 현재 신규 게임 PR에 섞지 않고 실제 장애/보안/데이터/동기화 위험인지 별도로 검토한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 14B. 공통 규칙 변경 시 기존 게임 영향도 감사

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-373 · L738–738 | Game Platform의 CURRENT 규칙, shared 계약, DB/Test Contract 또는 공통 lifecycle을 변경하는 작업은 **새 게임에만 적용하고 끝내지 않는다.** 현재 Registry에서 `platform: "shared"`인 모든 게임을 전수 검토한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-374 · L740–740 | 각 게임은 최소 다음 중 하나로 분류한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-375 · L742–742 | - `COMPLIANT`: 현재 구현·게임별 문서·테스트가 새 규칙과 이미 일치한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-376 · L743–743 | - `MIGRATION_REQUIRED`: 현재 구현이나 문서가 새 규칙과 충돌하며 후속 수정이 필요하다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-377 · L744–744 | - `NOT_APPLICABLE`: 게임 구조상 해당 규칙이 적용되지 않으며 그 이유가 명확하다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 14B. 공통 규칙 변경 시 기존 게임 영향도 감사 > MUST

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-378 · L748–748 | - 규칙 변경 PR의 작업 결과 또는 PR 설명에 영향도 감사 결과를 남긴다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-379 · L749–749 | - `IN_PROGRESS` 게임이 `MIGRATION_REQUIRED`라면 release 전에 충돌을 해소한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-380 · L750–750 | - `RELEASED` 게임이 `MIGRATION_REQUIRED`라면 현재 동작을 임의로 같은 PR에서 바꾸지 않고 별도 migration/follow-up 범위를 정한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-381 · L751–751 | - shared runtime/API가 비호환으로 바뀌는 경우 RELEASED consumer를 깨뜨린 채 공통 계약만 먼저 merge하지 않는다. 기존 surface를 호환 유지하거나 consumer migration을 먼저 또는 같은 원자적 변경으로 완료한 뒤 기존 surface를 제거한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-382 · L752–752 | - 게임별 문서와 실제 코드/테스트가 서로 다른 정책을 말하면 문서만 맞춰 적지 말고 runtime 영향까지 확인한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-383 · L753–753 | - 특정 게임의 예외를 허용해야 한다면 공통 규칙을 조용히 위반하게 두지 않고 적용 제외 근거 또는 플랫폼 규칙 변경으로 명시한다. | 절:MUST; 표현:예외 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-384 · L755–755 | Governance Guard가 문서 구조와 링크를 확인하더라도 이 영향도의 의미적 판단까지 자동화할 수는 없다. 따라서 공통 규칙 변경 시 영향도 감사는 작업자의 필수 검토 절차다. | 절:MUST; 표현:필수 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 15. 신규 게임 구현 순서

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-385 · L759–759 | 특별한 이유가 없다면 다음 순서로 개발한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-386 · L761–788 | ```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>``` | 표현:검증 | REQUIRED_SHAPE / P | E-DOC | D01, D06, D09, R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-387 · L790–790 | 이 순서는 게임 고유 시각 연출을 늦추기 위한 강제 단계가 아니라, 네트워크와 권위 모델이 흔들린 상태에서 UI 복잡도를 먼저 키우지 않기 위한 기본 작업 순서다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-388 · L792–792 | 네 문서의 설계와 진행 기록은 다음 책임으로 구분한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-389 · L794–794 | - `GAME_SPEC.md / Implementation Plan`: 기능·상태 머신·DB/RPC·플랫폼 연결의 설계 순서 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-390 · L795–795 | - `DEVELOPMENT.md / Next Work`: 지금 실제 기능 작업에서 다음으로 수행할 구체적인 행동 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-391 · L796–796 | - `UI_DESIGN.md / Implementation Plan`: 현재 디자인을 구현할 때의 안정적인 presentation 적용 순서/가이드이며 실시간 작업 일지가 아니다 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-392 · L797–797 | - `UI_DECISIONS.md / Current Design Track · Decision Log · Open Follow-up`: 실제 디자인 개발 진행, 중요한 변경 이유, 대안, 검증, 다음 UI 작업 | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-393 · L799–799 | 같은 TODO나 변경 이력을 여러 문서에 복제해 각각 따로 관리하지 않는다. 특히 17~18의 수동 디자인 리뷰와 decision 기록은 기능 구현과 별도의 마무리 단계다. 첫 공개 또는 큰 release에서는 이 단계를 생략하지 않고, 작은 유지보수 수정에서는 변경 범위에 필요한 항목만 적용한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 16. 완료 체크리스트

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-394 · L803–803 | 신규 온라인 게임 PR을 완료하기 전에 다음을 확인한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-395 · L805–805 | - &#91; &#93; `games/&lt;game-id&gt;/`에 게임이 독립적으로 위치한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-396 · L806–806 | - &#91; &#93; `games/&lt;game-id&gt;/GAME_SPEC.md`가 현재 게임 규칙, 구현 범위, 상태 머신, 플랫폼 경계를 반영한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-397 · L807–807 | - &#91; &#93; `games/&lt;game-id&gt;/UI_DESIGN.md`가 runtime 개발 전 디자인 조사 출처, 자산 사용 경계, Visual Identity, 독립 페이지 방향, motion/responsive, 최초 Phase baseline을 반영한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-398 · L808–808 | - &#91; &#93; 기능 구현 후 Developer Manual Design Review / Detail Polish를 수행했거나, 수행 전이라면 아직 디자인 완료로 표시하지 않았다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-399 · L809–809 | - &#91; &#93; `games/&lt;game-id&gt;/UI_DECISIONS.md`가 개발자 수동 브라우저 리뷰에서 확정된 의미 있는 디자인 수정, 변경 이유, 폐기/대체 결정, UI/browser validation과 후속 디자인 작업을 반영한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-400 · L810–810 | - &#91; &#93; 디자인 PR merge/close 또는 release closeout 전에 기록되지 않은 확정 디자인 decision이 남아 있지 않다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-401 · L811–811 | - &#91; &#93; `games/&lt;game-id&gt;/DEVELOPMENT.md`가 GAME_SPEC 기준 기능 Phase/브랜치/다음 기능 작업/검증 상태를 반영하고 UI 세부 이력을 중복 관리하지 않는다. | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-402 · L812–812 | - &#91; &#93; Registry에 `platform: "shared"`로 등록되어 있다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-403 · L813–813 | - &#91; &#93; 실제 구현된 capability만 선언되어 있다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-404 · L814–814 | - &#91; &#93; Approved Member / Access Gate를 사용한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-405 · L815–815 | - &#91; &#93; room/session 기반 online 게임이라면 현재 shared adapter가 lifecycle에 맞는지 확인하고, 맞지 않으면 의미 없는 method를 추가하지 않고 계약 확장 여부를 검토했다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-406 · L816–816 | - &#91; &#93; 사이트 계정 기반 multiplayer라면 게임별 entry/lobby에서 닉네임을 따로 만들지 않고 사이트 프로필 닉네임을 사용한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D05 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-407 · L817–817 | - &#91; &#93; 서버 RPC가 권한과 상태 전이를 최종 판정한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-408 · L818–818 | - &#91; &#93; state-changing action이 version/idempotency 경계를 가진다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-409 · L819–819 | - &#91; &#93; snapshot version과 stale snapshot 방어가 있다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-410 · L820–820 | - &#91; &#93; Realtime은 invalidation으로만 사용한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D06 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-411 · L821–821 | - &#91; &#93; reconnect가 authoritative snapshot으로 복원된다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-412 · L822–822 | - &#91; &#93; 구독/listener 정리 경로가 있다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-413 · L823–823 | - &#91; &#93; 플레이 시작 전 entry/setup 화면에서 상세 게임 규칙을 확인할 수 있고 플레이 중에도 다시 접근할 수 있다. | 표현:할 수 있다 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-414 · L824–824 | - &#91; &#93; 진행 중 세션을 안전하게 끝낼 수 있는 게임 종료 경로와 종료 후 복구/이탈 흐름이 있다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-415 · L825–825 | - &#91; &#93; 멀티플레이 게임이라면 GAME_OVER → 재대결 준비 → 참여자 ready → 방장 시작 → 새 게임의 흐름이 있고 reconnect/이탈/최소 인원 조건을 authoritative하게 처리한다. | 표현:조건 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-416 · L826–826 | - &#91; &#93; Common Game Shell 사용 여부와 게임-local UI 경계가 명확하다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-417 · L827–827 | - &#91; &#93; entry/lobby/gameplay/result/rematch가 `UI_DESIGN.md` baseline과 최신 non-superseded `UI_DECISIONS.md` overrides로 계산한 유효 디자인을 유지하고 일반 청파 같이 페이지와 구별되는 독립적인 게임 공간으로 느껴진다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-418 · L828–828 | - &#91; &#93; UI_DESIGN validation checklist와 UI_DECISIONS의 desktop/mobile/interaction 검증 이력을 확인했다. | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-419 · L829–829 | - &#91; &#93; Invite를 제공한다면 `game_room` 계약을 사용한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-420 · L830–830 | - &#91; &#93; DB/Test Contract 필수 시나리오를 모두 구현한다. | 표현:필수 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-421 · L831–831 | - &#91; &#93; 다른 플레이어의 private state가 노출되지 않는다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-422 · L832–832 | - &#91; &#93; 기존 Legacy 게임을 불필요하게 수정하지 않았다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-423 · L833–833 | - &#91; &#93; 관련 unit / DB integration / E2E / build 검증을 실행했다. | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-424 · L834–834 | - &#91; &#93; shared 계약을 변경했다면 테스트와 문서를 함께 갱신했다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 16. 완료 체크리스트 > RELEASED closeout

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-425 · L838–838 | - &#91; &#93; production DB 변경이 있다면 적용 이력과 권한 경계를 확인했다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-426 · L839–839 | - &#91; &#93; 사용자에게 제공할 capability만 true로 활성화했다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D09 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-427 · L840–840 | - &#91; &#93; 게임 목록/entry/invite 등 실제 노출 경로를 확인했다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-428 · L841–841 | - &#91; &#93; `DEVELOPMENT.md`가 `Status: RELEASED`, `Active branch: main`, 날짜가 있는 `## Release — YYYY-MM-DD` 기록을 가진다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-429 · L842–842 | - &#91; &#93; 현재 상태와 모순되는 개발 중 문구를 정리했다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-430 · L843–843 | - &#91; &#93; 통합되거나 대체된 PR을 닫고 불필요한 작업/임시 브랜치를 정리했다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-431 · L844–844 | - &#91; &#93; 이후 유지보수는 최신 `main`에서 새 브랜치로 시작한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-432 · L845–845 | - &#91; &#93; 이번 게임에서 얻은 교훈을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 분류하고 필요한 플랫폼 문서/계약에 환류했다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 17. 문서 권위와 관련 문서

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-433 · L849–849 | 신규 platform-native 게임 구현에서 문서 우선순위는 다음과 같다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-434 · L851–851 | 1. **이 문서** — 현재 실행 규칙의 최상위 기준 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-435 · L852–852 | 2. **`docs/game-platform-ui-rules.md`** — 신규 게임 UI 조사·Visual Identity·UI_DESIGN/UI_DECISIONS 관리와 presentation 실행 규칙 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-436 · L853–853 | 3. **`docs/game-platform-governance.md`** — 공통 규칙 변경 전파, Architecture Change 승격 이후 영향도 감사와 자동 Guard 경계 | 서술형(수치화 안 함) | RULE / P | E-DOC | D10 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-437 · L854–854 | 4. **실제 `games/shared/` 코드와 계약 테스트** — 현재 구현된 계약의 최종 확인 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-438 · L855–855 | 5. **`docs/game-platform-db-test-contract.md`** — DB/RPC 작업 시 적용하는 정식 품질 계약 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-439 · L856–856 | 6. **`games/README.md`** — 현재 shared 모듈과 디렉터리 안내 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-440 · L858–858 | 다음 문서는 **배경/이력 참고용**이며 신규 게임 개발의 필수 선행 문서가 아니다. | 표현:필수 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-441 · L860–860 | - `docs/game-platform-strategy.md`: 플랫폼을 왜 이런 구조로 만들었는지에 대한 전략과 단계 기록 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-442 · L861–861 | - `docs/game-platform-invite-analysis.md`: Phase 3D 당시 Invite 구조 조사와 결정 과정 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-443 · L863–863 | 배경 문서와 현재 실행 규칙이 다르게 보일 경우 과거 문서를 현재 계약으로 재해석하지 않는다. 현재 규칙서와 실제 코드·테스트를 우선하고, 불일치가 의심되면 별도 문서 정합성 작업으로 다룬다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### GOV — `docs/game-platform-governance.md`

- source: [docs/game-platform-governance.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-governance.md)
- blob: `a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169`; 원문 114줄; 상태 `CURRENT`; 59 관리단위 / 58 규칙·필드 단위.


#### Game Platform Governance Guard

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GOV-001 · L3–3 | &gt; **문서 분류:** CURRENT | 서술형(수치화 안 함) | CONTEXT / I | E-GOV | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-GOV-002 · L5–5 | 이 문서는 신규 Game Platform 작업의 자동 검증 범위를 설명한다. | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-003 · L7–7 | Governance Guard는 사이트 런타임 기능이 아니다. Pull Request 단계에서 신규 platform-native 게임과 `games/shared/` 변경이 현재 플랫폼 경계를 벗어나지 않는지 확인하는 개발용 안전장치다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 적용 범위

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GOV-004 · L11–11 | 전용 workflow는 다음 경로가 변경된 Pull Request에서만 실행한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-005 · L13–21 | ```text<br>games/**<br>tests/game-platform-*.test.js<br>tests/game-db-integration/**<br>scripts/check-game-platform-governance.mjs<br>docs/game-platform-*.md<br>AGENTS.md<br>.github/workflows/game-platform-governance.yml<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-006 · L23–23 | 활동, 커뮤니티, 회원가입, 알림, 관리자 등 일반 서비스 변경만 있는 PR에서는 이 workflow가 실행되지 않는다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 자동 차단하는 구조 위반

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GOV-007 · L27–27 | - `games/&lt;game-id&gt;/` 디렉터리에 `GAME_SPEC.md`가 없거나 필수 설계 섹션이 빠진 경우 | 표현:필수 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-008 · L28–28 | - `docs/game-platform-ui-rules.md`가 존재하는 현재 체계에서 `games/&lt;game-id&gt;/UI_DESIGN.md`가 없거나 필수 UI 설계 섹션이 빠진 경우 | 표현:필수 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-009 · L29–29 | - `games/&lt;game-id&gt;/` 디렉터리에 `DEVELOPMENT.md`가 없거나 필수 기능 인수인계 섹션이 빠진 경우 | 표현:필수 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-010 · L30–30 | - `games/&lt;game-id&gt;/` 디렉터리에 `UI_DECISIONS.md`가 없거나 필수 디자인 이력 섹션이 빠진 경우 | 표현:필수 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-011 · L31–31 | - `DEVELOPMENT.md`가 `Status: RELEASED`인데 `Active branch: main`이 아니거나 `## Release` 기록이 없는 경우 | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-012 · L32–32 | - Registry 미등록 bootstrap 디렉터리에 `GAME_SPEC.md` / `DEVELOPMENT.md` / `UI_DESIGN.md` / `UI_DECISIONS.md` 외 runtime 파일이 추가된 경우 | 서술형(수치화 안 함) | RULE / P | E-GOV | D01 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-013 · L33–33 | - runtime이 있는 `games/&lt;game-id&gt;/` 디렉터리가 shared Game Registry에 등록되지 않은 경우 | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-014 · L34–34 | - shared Game Registry에 등록했지만 실제 `games/&lt;game-id&gt;/` 디렉터리가 없는 경우 | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-015 · L35–35 | - online shared 게임인데 `tests/game-db-integration/&lt;game-id&gt;.test.js`가 없는 경우 | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-016 · L36–36 | - 새 platform-native runtime을 추가하면서 Registry를 같은 PR에서 갱신하지 않은 경우 | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-017 · L37–37 | - Legacy 런타임과 Game Platform 런타임을 같은 PR에서 함께 수정한 경우 | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-018 · L38–38 | - 새 `games/shared/*.js` 모듈을 추가하면서 Game Platform 계약 테스트 또는 관련 문서를 함께 갱신하지 않은 경우 | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 자동으로 검증하지만 과도하게 강제하지 않는 것

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GOV-019 · L42–42 | 기존 `games/shared/` 모듈 수정은 매번 새 테스트 파일이나 문서 변경을 강제하지 않는다. 대신 전용 workflow가 기존 `npm run test:game-platform` 전체를 실행해 회귀를 확인한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-020 · L44–44 | 이 방식은 단순 버그 수정이나 내부 구현 개선까지 문서 변경을 강제해 개발 속도를 떨어뜨리는 것을 피하기 위한 것이다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 문서 권위 연결

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GOV-021 · L48–48 | `docs/game-platform-*.md`는 Governance Guard가 자동으로 발견하며 각 문서는 제목 아래에 `&gt; **문서 분류:** CURRENT` 또는 `HISTORY`를 선언해야 한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-022 · L50–50 | - `CURRENT`: 현재 실행 규칙/공통 계약 문서다. Registry의 특정 platform-native 게임명이나 ID를 공통 규칙으로 포함할 수 없다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-023 · L51–51 | - `HISTORY`: 과거 전략·분석·구현 이력을 보존하는 문서다. 특정 게임 이력을 기록할 수 있지만 현재 실행 기준으로 사용하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-024 · L52–52 | - 메인 규칙서 `docs/game-platform-development-rules.md`를 제외한 모든 `docs/game-platform-*.md`는 해당 규칙서를 현재 rulebook으로 명시해야 한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-025 · L53–53 | - 신규 UI rulebook `docs/game-platform-ui-rules.md`가 존재하면 `AGENTS.md`, 메인 개발 규칙, `games/README.md`, `games/GAME_SPEC_TEMPLATE.md`, `games/DEVELOPMENT_TEMPLATE.md`, `games/UI_DESIGN_TEMPLATE.md`, `games/UI_DECISIONS_TEMPLATE.md`가 해당 UI rulebook을 명시해야 한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-026 · L54–54 | - `AGENTS.md`와 `games/` 최상위 Markdown 가이드/템플릿은 별도 분류 표기 없이 `CURRENT`로 간주해 같은 game-agnostic 검사를 적용한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-027 · L56–56 | 따라서 새 공통 UI 문서가 단독으로 고립되지 않고 신규 게임 개발 진입점과 네 game-local 문서 체계까지 연결된다. 새 `docs/game-platform-*.md` 추가 자체는 Governance 테스트의 파일 목록을 수동으로 수정할 필요가 없으며, 분류 누락·권위 연결 누락·특정 신규 게임 종속 규칙이 자동으로 차단된다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 공통 규칙 변경 전파 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GOV-028 · L60–60 | Game Platform 규칙을 보완할 때는 문서 계층의 높이만 보고 무조건 최상위부터 또는 최하위부터 고치지 않는다. 먼저 **이번 변경의 세부 의미를 소유하는 topic-owner 문서**를 식별한다. | 표현:조건 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-029 · L62–62 | 기본 절차는 다음과 같다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-030 · L64–64 | 1. 변경 전 현재 최상위 규칙과 shared/runtime 경계를 확인해 제안이 기존 플랫폼 구조와 충돌하지 않는지 먼저 감사한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-031 · L65–65 | 2. 충돌이 없다면 가장 구체적인 세부 의미는 topic-owner 문서에서 먼저 정의한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-032 · L66–66 · 부모 LEGACY-GOV-031 |    - 예: UI lifecycle·디자인 기록 방식은 `docs/game-platform-ui-rules.md` | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-033 · L67–67 · 부모 LEGACY-GOV-031 |    - 기능 개발 lifecycle·기능 checkpoint는 `docs/game-platform-development-rules.md` | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-034 · L68–68 · 부모 LEGACY-GOV-031 |    - 자동 검증 범위와 문서 연결 강제는 이 Governance 문서와 Guard 소스 | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-035 · L69–69 | 3. topic-owner의 의미가 확정된 뒤 `docs/game-platform-development-rules.md`, `AGENTS.md`, `games/README.md` 같은 상위/진입 문서에는 필요한 요약과 참조만 전파한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-036 · L70–70 | 4. 같은 세부 규칙을 여러 상위 문서에서 독립적으로 다시 정의하지 않는다. 상위 문서는 책임 문서를 가리키고 핵심 invariant만 반복한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-037 · L71–71 | 5. 상위 규칙과 충돌하는 하위 필요는 **발견/토의 단계에서는 제안으로만 유지**하고, 승격 없이 하위 문서나 runtime을 상위 규칙 밖으로 먼저 수정하지 않는다. 사용자/maintainer와의 토의에서 플랫폼 전반에 필요한 변경으로 명시적으로 합의되면 Development Rules의 **ARCHITECTURE CHANGE**로 승격한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D10 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-038 · L72–72 | 6. ARCHITECTURE CHANGE로 승격된 뒤에는 topic-owner와 상위 규칙을 같은 작업 범위에서 함께 정합화하고, 현재 platform-native 게임 영향도 감사를 수행한 뒤 runtime/shared 변경으로 진행한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D10 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-039 · L73–73 | 7. 전파가 끝나면 Governance/contract 테스트와 현재 platform-native 게임의 `COMPLIANT` / `MIGRATION_REQUIRED` / `NOT_APPLICABLE` 영향을 확인한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-040 · L75–75 | 이 방식은 **세부 결정은 한 곳에서 소유하고 상위 문서는 그 결정을 참조하는 구조**를 유지해 규칙 중복과 drift를 줄인다. 따라서 topic-owner → 상위 참조 문서 → Governance/테스트 순서의 전파는 기존 Game Platform 구조를 훼손하는 방식이 아니라, 오히려 문서 권위와 책임 경계를 유지하기 위한 기본 변경 방식으로 사용한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Legacy 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GOV-041 · L79–79 | Governance Guard는 Liar Game, Drawing Spy, The Game, Marble을 새 플랫폼 규칙으로 마이그레이션하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-042 · L81–81 | 다만 신규 Game Platform 런타임 변경과 Legacy 런타임 변경이 한 PR에 섞이는 경우에는 작업 범위를 분리하도록 차단한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### GitHub Actions 사용량

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GOV-043 · L85–85 | workflow는 `pull_request`에만 반응하고 Game Platform 관련 경로가 바뀐 경우에만 실행한다. 별도 `push` 실행이나 전체 사이트 workflow 복제는 하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-044 · L87–87 | 검증은 Node 기본 기능과 기존 Game Platform 테스트만 사용하므로 별도 `npm ci` 단계도 추가하지 않는다. | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 게임 bootstrap 및 개발 기록 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GOV-045 · L90–90 | Governance Guard는 각 platform-native 게임 디렉터리에 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`가 존재하고 각 문서의 필수 섹션이 유지되는지 검사한다. | 표현:필수 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-046 · L92–92 | 또한 기능/디자인 checkpoint 명령이 상위 진입 문서마다 달라지는 것을 막기 위해 명령 표기를 구조적으로 검사한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-047 · L94–94 | - `기능 체크포인트 기록하자`: `docs/game-platform-development-rules.md`, `AGENTS.md`, `games/README.md`가 공통으로 식별해야 한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D02 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-048 · L95–95 | - `디자인 체크포인트 기록하자`: `docs/game-platform-ui-rules.md`, `docs/game-platform-development-rules.md`, `AGENTS.md`, `games/README.md`가 공통으로 식별해야 한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D03 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-049 · L97–97 | 기능 checkpoint의 상세 절차는 Development Rules가, 디자인 checkpoint의 상세 절차는 UI Rules가 소유한다. 상위 진입 문서는 두 명령을 재정의하지 않고 책임 문서로 연결한다. Phase 완료, 디자인 lifecycle 기록 트리거, release closeout 등 lifecycle 기반 문서 갱신 규칙은 사용자 checkpoint 명령과 독립적으로 유지한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-050 · L99–99 | 네 문서만 있는 새 디렉터리는 bootstrap 상태로 인정하며 Registry 등록을 요구하지 않는다. 반대로 runtime 파일이 하나라도 추가되면 bootstrap 상태가 끝난 것으로 보고 같은 저장소 상태에서 shared Game Registry 등록을 요구한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-051 · L101–101 | `UI_DESIGN.md` 검사는 디자인 조사, 자산 사용 경계, Visual Identity, page/lobby/gameplay/result/rematch, motion, responsive, 구현 가이드, validation 섹션의 구조적 존재를 확인한다. `UI_DECISIONS.md` 검사는 현재 design track, decision log, superseded/rejected, validation history, open follow-up 구조를 확인한다. 특정 색상이나 디자인의 미적 적합성, developer manual review에서 어느 수정이 "안정화된 결정"인지, 실제로 중요한 결정이 빠짐없이 기록됐는지는 CI가 판단할 수 없으며 그 의미적 검토는 `docs/game-platform-ui-rules.md`의 lifecycle과 실제 브라우저 검증이 담당한다. | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-052 · L103–103 | 네 문서가 각각 독립 파일로만 존재하고 서로 고립되는 것을 막기 위해 game-local cross-link도 검사한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-053 · L105–105 | - `GAME_SPEC.md` → `UI_DESIGN.md`, `UI_DECISIONS.md`, `DEVELOPMENT.md` | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-054 · L106–106 | - `DEVELOPMENT.md` → `GAME_SPEC.md`, `UI_DESIGN.md`, `UI_DECISIONS.md` | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-055 · L107–107 | - `UI_DESIGN.md` → `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DECISIONS.md` | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-056 · L108–108 | - `UI_DECISIONS.md` → `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md` | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-057 · L110–110 | 다만 Guard는 어느 문서의 내용이 의미적으로 다른 문서와 모순되는지까지 판정하지 않는다. 현재 기능 기준은 `GAME_SPEC.md`, 기능 진행은 `DEVELOPMENT.md`를 기준으로 한다. 디자인은 신규 게임의 pre-development baseline 또는 기존 게임의 명시된 adoption baseline인 `UI_DESIGN.md`와 `UI_DECISIONS.md`의 최신 non-superseded override를 함께 적용하며, 후속 결정이 baseline보다 우선하는지는 작업자가 의미적으로 검토한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D04 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-058 · L112–112 | Release 상태는 최소한의 기계적 정합성도 검사한다. `Status: RELEASED`인 게임은 production baseline이므로 `Active branch: main`이어야 하고 날짜가 포함된 `## Release` 섹션을 가져야 한다. 이는 실제 production migration 여부나 플레이 품질을 추론하는 검사가 아니라, 종료된 작업 브랜치가 현재 기준으로 남는 문서 오류를 막기 위한 guard다. | 서술형(수치화 안 함) | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GOV-059 · L114–114 | Guard는 규칙/디자인 출처의 신뢰도, 게임 규칙의 의미적 정확성, Visual Identity의 품질, `UI_DECISIONS.md`에 기록된 선택 이유의 타당성, 수동 브라우저 디자인 리뷰의 완료 여부, 자산 사용 권리의 법적 판단, Phase 진행상황의 사실 여부까지 자동 판정하지 않는다. 또한 각 게임의 재대결 구현이 실제 멀티클라이언트에서 완전한지를 문서 구조만으로 추론하지 않는다. 해당 내용은 `docs/game-platform-development-rules.md`, `docs/game-platform-ui-rules.md`, 게임별 테스트와 실제 브라우저 검증으로 확인한다. | 표현:검증 | RULE / P | E-GOV | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### DB — `docs/game-platform-db-test-contract.md`

- source: [docs/game-platform-db-test-contract.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-db-test-contract.md)
- blob: `ff5eaf6aa5e6459e098d607119033169ac05f5f1`; 원문 160줄; 상태 `CURRENT`; 60 관리단위 / 55 규칙·필드 단위.


#### Game Platform DB/Test Contract

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-001 · L3–3 | &gt; **문서 분류:** CURRENT | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DB-002 · L5–5 | &gt; 현재 실행 규칙의 최상위 기준은 `docs/game-platform-development-rules.md`이며, 이 문서는 DB/RPC 품질 계약을 구체화한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-003 · L7–7 | 이 문서는 신규 online platform-native 게임의 **현재 정식 DB/RPC 품질 계약**이다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-004 · L9–9 | 게임별 테이블 구조, RPC 이름, 규칙 상태 머신과 session lifecycle은 각 게임에 남겨 두되, 모든 신규 온라인 게임은 아래 서버 경계와 테스트 시나리오를 만족해야 한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-005 · L11–11 | 공통 게임 DB 스키마나 공통 gameplay RPC를 강제하지 않는다. 공통화 대상은 SQL 구현 자체가 아니라 **반드시 검증해야 하는 안전성 계약**이다. | 표현:반드시,검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 필수 계약

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-006 · L15–15 | 모든 신규 온라인 platform-native 게임은 최소 다음 시나리오를 검증한다. | 표현:검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-007 · L17–17 | 1. 익명 사용자는 보호된 게임 세션에 진입할 수 없다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-008 · L18–18 | 2. 승인되지 않은 회원은 보호된 게임 세션에 진입할 수 없다. | 표현:승인 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-009 · L19–19 | 3. 승인 회원은 해당 게임 정책이 허용하는 세션 진입을 수행할 수 있다. | 표현:승인,할 수 있다 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-010 · L20–20 | 4. 세션 멤버가 아닌 사용자는 보호된 authoritative snapshot을 읽을 수 없다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-011 · L21–21 | 5. 게임 시작 조건과 시작 권한은 서버가 해당 게임의 lifecycle 정책에 맞게 검증한다. | 표현:조건,검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-012 · L22–22 | 6. 오래된 `expected_version` 명령은 거부된다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-013 · L23–23 | 7. 동일한 `client_action_id` 재전송은 중복 적용되지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-014 · L24–24 | 8. 동시에 충돌하는 명령은 하나의 authoritative commit만 만든다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-015 · L25–25 | 9. 재접속 시 authoritative snapshot으로 현재 상태를 복원한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-016 · L26–26 | 10. 멀티플레이 게임 종료 후 재대결은 기존 room/player context를 유지하고 gameplay state를 초기화한 준비 상태로 전환하며, 준비/시작 조건과 reconnect 복원이 서버 권위로 검증된다. | 표현:조건,검증 | RULE / M-DB | E-DB | D07, R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-017 · L27–27 | 11. 다른 플레이어의 private state가 snapshot에 노출되지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-018 · L29–29 | 게임에 private state가 존재하지 않더라도 11번은 생략하지 않는다. 해당 게임의 snapshot에 private 정보가 없음을 명시적으로 검증한다. | 표현:검증 | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |

#### Data API 권한 계약

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-019 · L33–33 | 다음 규칙은 위 11개 behavioral scenario를 늘리는 별도 gameplay contract가 아니라, migration이 같은 서버 경계를 실제 DB 권한으로 보존하기 위한 구현 계약이다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | C02/F03 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-020 · L35–35 | - Data API에 노출되는 schema에 새 table/view/function/sequence를 생성하거나 기존 객체의 호출 role·직접 접근 방식 등 권한 경계를 변경할 때는 프로젝트의 자동 default privilege에 의존하지 않는다. 해당 migration에서 `anon`, `authenticated`, `service_role` 중 실제 호출 주체와 필요한 최소 `GRANT`/`REVOKE`를 명시한다. 같은 object identity의 함수 구현만 교체하면서 기존 권한 경계를 유지하는 변경에는 권한 SQL 반복을 강제하지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | D08 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-021 · L36–36 | - 테이블 privilege와 RLS는 서로 다른 보안 계층으로 각각 검토한다. 직접 읽기나 쓰기가 필요한 테이블에만 필요한 privilege를 부여하고, 허용 row 범위는 RLS 또는 서버 권위 RPC가 별도로 제한한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-022 · L37–37 | - public RPC는 기본 `PUBLIC EXECUTE`에 의존하지 않는다. 실제 호출 주체만 실행할 수 있도록 기존 실행 권한을 회수한 뒤 필요한 role에만 `EXECUTE`를 허용한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-023 · L38–38 | - `service_role`에도 관행적으로 모든 객체 권한을 열지 않는다. 서버가 Data API로 직접 접근해야 하는 객체와 작업에 필요한 최소 권한만 허용하며, browser runtime에는 `service_role` credential을 노출하지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-024 · L39–39 | - `SECURITY DEFINER` RPC 내부에서만 사용하는 상태 테이블처럼 browser의 직접 Data API 접근이 필요하지 않은 객체는 `anon`/`authenticated` table privilege를 열지 않아도 된다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-025 · L40–40 | - 이미 운영에 적용된 migration의 과거 SQL을 권한 보정 목적으로 다시 작성하지 않는다. 기존 객체의 권한을 보정해야 하면 새로운 forward migration으로 현재 최종 권한을 명시한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-026 · L42–42 | 이 권한 계약은 아래 behavioral DB integration test의 통과만으로 검증 완료로 간주하지 않는다. disposable test DB가 fixture 생성과 검사를 위해 `service_role`에 추가 권한을 주는 bootstrap을 사용하더라도 그것은 production 권한 판단 근거가 아니며, production migration의 `GRANT`/`REVOKE`와 실제 적용 후 권한 상태를 별도로 확인한다. | 표현:검증 | RULE / M-DB | E-DB | D08 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 사용 위치

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-027 · L46–46 | 공통 계약 러너: | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DB-028 · L48–50 | ```text<br>tests/game-db-integration/platformContract.js<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-029 · L52–52 | 신규 게임은 다음과 같이 자체 통합 테스트 파일을 추가한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-030 · L54–59 | ```text<br>tests/game-db-integration/<br>  foundation.test.js<br>  &lt;game-id&gt;.test.js<br>  &lt;another-game-id&gt;.test.js<br>``` | 서술형(수치화 안 함) | EXAMPLE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DB-031 · L61–61 | 각 게임 테스트 파일은 자체 RPC 이름과 fixture 생성 방법을 유지하면서 `definePlatformGameDbContract` / `registerPlatformGameDbContract`를 사용한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-032 · L63–63 | 예시 구조: | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DB-033 · L65–89 | ```js<br>registerPlatformGameDbContract({<br>  gameId: "example-game",<br>  createContext: async () =&gt; {<br>    // approved / pending / outsider users and a disposable room fixture<br>    return context;<br>  },<br>  destroyContext: async (context) =&gt; {<br>    // test fixture cleanup<br>  },<br>  scenarios: {<br>    anonymous_entry_denied: async (context) =&gt; { /* session entry boundary assertions */ },<br>    unapproved_entry_denied: async (context) =&gt; { /* session entry boundary assertions */ },<br>    approved_entry_allowed: async (context) =&gt; { /* permitted session entry assertions */ },<br>    non_member_snapshot_denied: async (context) =&gt; { /* ... */ },<br>    start_authorization_enforced: async (context) =&gt; { /* game-specific start policy assertions */ },<br>    stale_version_rejected: async (context) =&gt; { /* ... */ },<br>    duplicate_action_safe: async (context) =&gt; { /* ... */ },<br>    concurrent_action_single_commit: async (context) =&gt; { /* ... */ },<br>    reconnect_snapshot_authoritative: async (context) =&gt; { /* ... */ },<br>    rematch_lifecycle_authoritative: async (context) =&gt; { /* same room/player context + ready/start/reconnect */ },<br>    private_state_not_exposed: async (context) =&gt; { /* ... */ },<br>  },<br>}, { before, after, test });<br>``` | 서술형(수치화 안 함) | EXAMPLE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 서버 권위 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-034 · L93–93 | 이 계약은 다음 흐름을 검증하기 위한 것이다. | 표현:검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-035 · L95–102 | ```text<br>Client intent<br>→ authenticated game RPC<br>→ authorization / phase / version validation<br>→ transaction / row lock<br>→ authoritative DB mutation<br>→ snapshot refresh<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-036 · L104–104 | Realtime 이벤트 자체의 수신 여부는 DB 계약의 최종 성공 조건이 아니다. | 표현:조건 | RULE / M-DB | E-DB | D06 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-037 · L106–106 | Realtime은 invalidation 신호로 사용하고, 최종 상태 검증은 DB/RPC snapshot으로 수행한다. | 표현:검증 | RULE / M-DB | E-DB | D06, R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |

#### 재대결 lifecycle

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-038 · L110–110 | `rematch_lifecycle_authoritative`는 특정 RPC 이름이나 SQL 구조를 강제하지 않는다. 각 게임은 자체 구현으로 최소 다음을 증명한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-039 · L112–112 | - terminal state 이후 재대결 준비가 기존 room과 남아 있는 active player identity를 유지한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | D07 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-040 · L113–113 | - 이전 gameplay state와 private state가 새 게임에 섞이지 않게 초기화된다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-041 · L114–114 | - 재대결 준비 후 ready/start 조건과 시작 권한을 서버가 다시 검증한다. | 표현:조건,검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-042 · L115–115 | - 재접속한 참가자는 같은 room의 authoritative rematch 준비 상태 또는 재시작된 새 게임 snapshot을 복원한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | D07, R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-043 · L116–116 | - 재대결을 원하지 않는 참가자의 이탈과 필요한 host 승계가 서버 상태를 깨뜨리지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-044 · L118–118 | 세부 인원수, host/ready 의미, 게임별 초기화 필드는 `GAME_SPEC.md`에 남겨 둔다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Idempotency

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-045 · L122–122 | 신규 상태 변경 RPC는 해당 게임의 action model에 맞는 경우 가능한 한 다음 값을 받는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-046 · L124–128 | ```text<br>room_id<br>expected_version<br>client_action_id<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-047 · L130–130 | `duplicate_action_safe` 시나리오는 동일한 `client_action_id` 요청을 두 번 보내도 게임 상태가 두 번 진행되지 않음을 검증한다. | 표현:검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-048 · L132–132 | 서버 구현은 동일 결과를 재반환하거나 명확한 duplicate 오류를 반환할 수 있다. 어느 방식이든 authoritative state가 한 번만 변경되어야 한다. | 표현:할 수 있다 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 동시성

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-049 · L136–136 | `concurrent_action_single_commit`은 동일한 버전을 기준으로 충돌하는 두 명령을 거의 동시에 보내고 다음을 확인한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-050 · L138–138 | 게임이 명시적 room/start 버튼을 사용하지 않더라도 이 계약의 핵심은 동일하다. 예를 들어 자동 시작 게임은 참가 인원/조건을 만족하지 않은 상태에서 클라이언트가 시작 상태를 임의로 만들 수 없음을 검증하고, host가 없는 게임은 특정 역할이 아니라 **게임이 정의한 시작 조건 자체가 서버에서 강제됨**을 검증한다. | 표현:조건,검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-051 · L140–140 | - 둘 다 상태 변경에 성공하지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-052 · L141–141 | - 최종 room version은 한 번만 진행된다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-053 · L142–142 | - snapshot이 하나의 일관된 결과를 가진다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-054 · L144–144 | 구체적인 lock/transaction 구현은 게임 DB가 결정하며 공통 플랫폼은 SQL 구현을 강제하지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### CI

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-055 · L148–148 | `Game DB integration` workflow는 관련 DB/harness 파일이 변경된 PR에서만 실행한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-056 · L150–150 | workflow는 `tests/game-db-integration/*.test.js` 전체를 실행하므로, 신규 게임이 계약 테스트 파일을 추가하면 별도 workflow를 만들 필요가 없다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-057 · L152–152 | GitHub Actions 사용량을 줄이기 위해 일반 feature push마다 DB integration을 실행하지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Legacy 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-058 · L156–156 | 현재 `foundation.test.js`의 Liar/Marble 검증을 이 계약으로 강제로 재작성하지 않는다. | 표현:검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-059 · L158–158 | Legacy는 현재 동작을 보호하는 회귀 테스트를 유지한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-060 · L160–160 | 공통 계약은 모든 신규 online platform-native 게임의 기본 품질 게이트로 사용한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
### 전수 입력: design

고정 원표: [docs/game-platform-rebuild/artifacts/step-1-clauses-design.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md) · blob `981555ea5fab6b3899ebd03599bac7e992f51691`.





### UI — `docs/game-platform-ui-rules.md`

- source: [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-ui-rules.md)
- blob: `76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9`; 원문 395줄; 상태 `CURRENT`; 219 관리단위 / 214 규칙·필드 단위.


#### Game Platform UI Design Rules

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-001 · L3–5 | &gt; **문서 분류:** CURRENT<br>&gt;<br>&gt; 현재 Game Platform의 최상위 실행 규칙은 `docs/game-platform-development-rules.md`다. 이 문서는 신규 platform-native 게임의 UI/UX 조사, 설계, 구현 및 검증에 추가로 적용하는 필수 규칙이다. | 표현:검증,필수 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 1. 목적

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-002 · L9–9 | 청파 같이의 신규 게임은 동일한 플랫폼 기능을 공유하더라도 시각적으로 하나의 공통 템플릿에 끼워 넣지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-003 · L11–11 | 각 게임은 원본 게임의 규칙과 구성물뿐 아니라 고유한 색상, 심볼, 카드/보드 구조, 타이포그래피, 재질감, 분위기를 조사한 뒤 **해당 게임만의 독립적인 디지털 공간**으로 설계한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-004 · L13–13 | 공통 플랫폼 UX와 게임별 Visual Identity의 책임은 분리한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-005 · L15–15 | - SHARED: 접근 권한, Room/Lobby, 연결 상태, 플레이어 identity, 준비/시작 lifecycle, 안전한 종료 등 반복 가능한 플랫폼 책임 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-006 · L16–16 | - GAME-LOCAL: 색상, 배경, 심볼, 카드/보드/칩 표현, 게임별 레이아웃, 모션, 사운드와 presentation | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-007 · L17–17 | - 공통 Shell을 사용하더라도 게임 고유 Visual Identity를 획일화하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 2. 신규 게임 개발 전 UI 조사

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-008 · L21–21 | 사용자가 `&lt;게임명&gt; 개발하자`, `신규 게임 개발 시작하자`처럼 새 게임 개발을 요청하면 UI 조사를 별도 요청으로 기다리지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-009 · L23–23 | runtime 구현 전에 게임 규칙 조사와 함께 최소 다음을 조사한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-010 · L25–25 | - 공식 제품/퍼블리셔 페이지와 공식 규칙서 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-011 · L26–26 | - 공식 또는 신뢰 가능한 시각 자료가 존재하면 텍스트 설명만으로 Visual Identity를 확정하지 않고 실제 카드·보드·패키지·토큰 등 visual reference를 직접 확인한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-012 · L27–27 | - 박스, 카드, 보드, 칩, 토큰, 말, 주사위 등 실제 구성물 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-013 · L28–28 | - 대표 색상과 보조/강조 색상 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-014 · L29–29 | - 로고가 아닌 게임을 연상시키는 기능적 심볼과 형태 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-015 · L30–30 | - 숫자/정보의 배치, 카드 비율, 타이포그래피 분위기 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-016 · L31–31 | - 패턴, 테이블/재질감, 배경과 장식 요소 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-017 · L32–32 | - 실제 테이블에서 구성물이 배치되는 방식 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-018 · L33–33 | - 필요한 경우 공식 또는 신뢰 가능한 디지털 구현과 실제 플레이 영상의 interaction/presentation | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-019 · L34–34 | - 사용하려는 이미지, 로고, 일러스트, 폰트, 사운드 등 자산의 저작권·상표·라이선스·사용 조건 | 표현:조건 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-020 · L36–36 | 조사 결과는 구현 전에 `games/&lt;game-id&gt;/UI_DESIGN.md`에 기록한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-021 · L38–38 | 조사 기록은 가능한 범위에서 **출처 → 관찰한 디자인 요소 → 구현 결정**이 추적되게 남긴다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-022 · L40–40 | 예: | 서술형(수치화 안 함) | CONTEXT / I | E-UI | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-UI-023 · L42–47 | ```text<br>Source: 공식 제품 페이지 / 규칙서 / 실제 구성물 사진<br>Observed: 카드 모서리 숫자 위치, 주 색상, 칩 형태, 테이블 배치<br>Decision: 직접 사용 / 독자 재구성 / 사용하지 않음<br>Reason: 라이선스, 가독성, responsive adaptation 등<br>``` | 서술형(수치화 안 함) | EXAMPLE / I | E-UI | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-UI-024 · L49–49 | 단순 링크 모음만 남기지 않고 그 자료가 실제 설계 결정에 어떤 근거가 됐는지 기록한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-025 · L51–51 | MUST NOT: 조사 없이 청파 같이 일반 페이지의 색상과 컴포넌트를 그대로 복사해 게임의 기본 디자인으로 확정하지 않는다. | 본문:MUST NOT | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3. 원본 디자인과 자산 사용

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-026 · L55–55 | 원본 게임의 시각적 정체성을 적극적으로 조사하되 보호받는 자산을 무단 복제하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3. 원본 디자인과 자산 사용 > MUST

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-027 · L59–59 | - 출처와 확인 날짜 또는 판본을 가능한 범위에서 기록한다. | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-028 · L60–60 | - 여러 판본의 디자인이 다른 경우 목표 판본 또는 혼합하지 않을 기준을 정한다. | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-029 · L61–61 | - 직접 사용할 자산은 사용 근거와 라이선스/허가 상태를 기록한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-030 · L62–62 | - 사용 권리가 불명확한 로고, 일러스트, 사진, 폰트, 음원은 그대로 포함하지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-031 · L63–63 | - 직접 복제가 어려운 경우 대표 색상, 정보 계층, 기능적 형태, 공간 배치, 분위기를 분석해 독자적인 게임-local 표현으로 재구성한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-032 · L65–65 | 목표는 **원본 게임의 정체성과 플레이 감각을 살리되 보호되는 자산을 무단 복제하지 않는 것**이다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 4. 독립 페이지 경험

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-033 · L69–69 | 게임 목록에서 특정 게임으로 진입한 뒤에는 청파 같이 일반 서비스의 하위 화면이 아니라 **해당 게임의 독립적인 공간에 들어온 느낌**을 제공한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-034 · L71–71 | 이 원칙은 플레이 보드만이 아니라 다음 전체 흐름에 적용한다. | 표현:원칙 | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-035 · L73–73 | - entry / landing | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-036 · L74–74 | - 방 생성 / 참가 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-037 · L75–75 | - lobby / ready | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-038 · L76–76 | - 규칙 안내 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-039 · L77–77 | - gameplay | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-040 · L78–78 | - modal / status / error presentation | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-041 · L79–79 | - result | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-042 · L80–80 | - rematch 준비 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-043 · L81–81 | - loading / reconnect presentation | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-044 · L83–83 | 게임-local 디자인은 필요하면 일반 사이트와 다른 배경, 레이아웃, 버튼, 패널, 폰트, 심볼, 장식, 모션을 사용할 수 있다. | 표현:할 수 있다 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-045 · L85–85 | 다만 사이트 계정 identity, 접근 권한, Room/Lobby 계약, authoritative state 같은 플랫폼 책임까지 시각적 독립성을 이유로 다시 구현하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 5. Visual Identity를 구현 전에 정의

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-046 · L89–89 | 조사가 끝났다고 즉시 UI 코드를 작성하지 않는다. `UI_DESIGN.md`에 최소 다음을 먼저 정의한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-047 · L91–91 | - Primary / Secondary / Accent / Background color | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-048 · L92–92 | - 전체 분위기와 시각적 키워드 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-049 · L93–93 | - 심볼/패턴/재질감 방향 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-050 · L94–94 | - 타이포그래피 방향 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-051 · L95–95 | - page identity와 일반 사이트에서 게임 공간으로 전환되는 방식 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-052 · L96–96 | - lobby/setup 구성 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-053 · L97–97 | - gameplay 핵심 레이아웃 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-054 · L98–98 | - 주요 game component 표현 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-055 · L99–99 | - 핵심 motion/interaction | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-056 · L100–100 | - result/rematch presentation | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-057 · L101–101 | - desktop/mobile responsive 전략 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-058 · L102–102 | - 필요한 asset과 사용 권리 상태 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-059 · L103–103 | - 구현 순서와 validation 기준 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-060 · L105–105 | 초기 구현에서 모든 polish를 완성할 필요는 없지만, 방향이 정해지지 않은 상태에서 generic UI를 먼저 굳히지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-061 · L109–109 | 게임 규칙 modal/page는 게임 밖의 일반 도움말 문서가 아니라 **처음 플레이하는 사용자가 실제 구성물과 행동 구조를 이해하는 game-local presentation**으로 설계한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-062 · L111–111 | 규칙 내용의 기능적 사실과 필수 설명 범위는 `GAME_SPEC.md`와 `docs/game-platform-development-rules.md`가 책임진다. 이 섹션은 그 내용을 어떤 시각 언어와 정보 계층으로 전달할지에 대한 UI 기준을 소유한다. | 표현:필수 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > MUST

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-063 · L115–115 | - 규칙 안내는 해당 게임의 `Visual Identity`와 동일한 색상, 형태, 타이포그래피, 재질감 또는 공간 메타포를 유지한다. 일반 서비스의 generic 문서/modal 스타일을 그대로 기본값으로 확정하지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-064 · L116–116 | - 규칙 안내의 시각화는 `GAME_SPEC.md`에 정의된 실제 규칙과 같은 의미를 사용해야 하며, 예쁜 연출을 위해 규칙을 단순화하거나 다른 동작처럼 보이게 만들지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-065 · L117–117 | - 핵심 목표, 턴/행동 순서, 주요 선택, 실패·위험·패널티, 종료·승리 조건과 대표 예시는 명확한 정보 계층으로 구분한다. | 절:MUST; 표현:조건 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-066 · L118–118 | - 카드, 주사위, 말, 칩, 보드, 트랙 등 게임 구성물을 표현할 때는 `UI_DESIGN.md`의 자산 사용 경계와 game-local component 언어를 재사용하거나 독자적으로 재구성한다. 사용 권리가 불명확한 공식 artwork를 규칙 설명이라는 이유로 직접 복제하지 않는다. | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-067 · L119–119 | - 시각적 예시가 있더라도 핵심 규칙은 텍스트/semantic structure만으로도 이해 가능해야 한다. 색상·장식·animation 하나에만 의미를 의존하지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-068 · L120–120 | - modal/dialog를 사용하면 작은 높이 화면에서도 제목, 닫기 경로, 핵심 규칙, 내부 scroll이 안정적으로 동작해야 하며 gameplay를 복구 불가능하게 가리지 않는다. 전용 rules page를 쓰는 경우에도 동일한 game-local presentation 기준을 적용한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-069 · L121–121 | - desktop/mobile에서 핵심 예시와 본문 순서가 무너지지 않는지 확인한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > SHOULD

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-070 · L125–125 | - 실제 구성물, 공간 구조, 행동 순서나 계산을 시각화했을 때 처음 플레이하는 사용자의 이해가 크게 좋아지는 핵심 메커니즘은 **게임 구성물 언어를 활용한 짧은 시각적 예시**로 보여준다. | 절:SHOULD | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-071 · L126–126 | - 규칙이 길면 모든 문단을 장식하기보다 목표 → 핵심 loop → 중요한 예외/위험 → 승리의 순서를 우선하고, 반복되는 세부 설명은 읽기 쉬운 section/card 구조로 정리한다. | 절:SHOULD; 표현:예외 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-072 · L127–127 | - 게임 플레이 화면에서 이미 익히게 되는 component를 규칙 안내에서도 재사용해 “설명 속 구성물”과 “실제 플레이 구성물”의 인지 차이를 줄인다. | 절:SHOULD | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > MUST NOT

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-073 · L131–131 | - 특정 다른 게임의 규칙 modal layout이나 장식 구조를 공통 template처럼 복제하지 않는다. | 절:MUST NOT | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-074 · L132–132 | - 규칙 안내를 화려하게 만들기 위해 본문 가독성, 접근성, scroll 안정성 또는 핵심 설명 순서를 희생하지 않는다. | 절:MUST NOT | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-075 · L133–133 | - 규칙 모달의 시각적 polish를 이유로 공통 Shell, authoritative state, 게임 규칙 계산을 UI layer에서 다시 구현하지 않는다. | 절:MUST NOT | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > game-local 문서 연결

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-076 · L137–137 | 신규 게임은 runtime 개발 전에 `UI_DESIGN.md`에서 최소 다음을 정한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-077 · L139–139 | - rules entry 위치와 modal / dedicated page 선택 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-078 · L140–140 | - rules/help presentation이 Visual Identity를 유지하는 방식 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-079 · L141–141 | - 핵심 메커니즘 중 시각화할 대상과 사용할 game component | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-080 · L142–142 | - 긴 설명의 정보 계층, scroll, desktop/mobile adaptation | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-081 · L143–143 | - 자산 사용 및 저작권 경계 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-082 · L145–145 | 개발 시작 후 실제 브라우저 리뷰에서 규칙 안내의 layout, visual example, 정보 계층 또는 responsive 방식이 의미 있게 바뀌면 `UI_DESIGN.md` baseline을 덮어쓰지 않고 `UI_DECISIONS.md`에 최신 non-superseded 결정으로 기록한다. | 서술형(수치화 안 함) | RULE / P | E-UI | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6. UI_DESIGN.md 관리 규칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-083 · L149–149 | 모든 platform-native 게임은 다음 문서를 가진다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-084 · L151–153 | ```text<br>games/&lt;game-id&gt;/UI_DESIGN.md<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-085 · L155–155 | 이 문서는 **runtime/UI 소스 개발을 시작하기 전에 게임 디자인을 전수 조사·분석해 수립하는 game-local 초기 UI/presentation baseline**이다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-086 · L157–157 | `GAME_SPEC.md`가 게임 규칙과 기능 구조를 정의하고, `DEVELOPMENT.md`가 기능 개발 진행을 추적한다. 디자인은 `UI_DESIGN.md`가 최초 조사·설계와 Phase 계획의 출발점을 보존하고, `UI_DECISIONS.md`가 개발 시작 후 발생한 사용자 피드백·실제 화면 관찰·디자인 변경과 검증 이력을 누적한다. | 표현:검증 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6. UI_DESIGN.md 관리 규칙 > 생성 시점

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-087 · L161–161 | 신규 게임 bootstrap에서 다음 네 문서를 runtime보다 먼저 생성한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-088 · L163–168 | ```text<br>GAME_SPEC.md<br>DEVELOPMENT.md<br>UI_DESIGN.md<br>UI_DECISIONS.md<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-089 · L170–170 | `games/UI_DESIGN_TEMPLATE.md`와 `games/UI_DECISIONS_TEMPLATE.md`를 기준으로 작성한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6. UI_DESIGN.md 관리 규칙 > 기존 게임의 adoption baseline

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-090 · L174–174 | 이 규칙이 도입되기 전에 이미 runtime/UI 개발이 시작됐거나 release된 platform-native 게임은 과거를 임의로 재구성하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-091 · L176–176 | - 신규 게임은 반드시 runtime 개발 전 `UI_DESIGN.md` baseline을 만든다. | 표현:반드시 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-092 · L177–177 | - 기존 게임은 확인 가능한 당시 설계 문서 또는 도입 시점의 production/작업 상태를 **adoption baseline**으로 명시할 수 있다. | 표현:할 수 있다 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-093 · L178–178 | - adoption baseline은 "원래 처음부터 이렇게 계획했다"는 의미가 아니다. 문서 체계 도입 시점에서 신뢰할 수 있게 고정한 출발점이다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-094 · L179–179 | - 이미 `UI_DESIGN.md` 안에 과거 구현 과정의 수정 결과가 섞여 있다면 증거 없이 억지로 분리하거나 삭제하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-095 · L180–180 | - 과거 사용자 피드백/PR/commit을 복원할 때는 확인 가능한 결정만 `UI_DECISIONS.md`에 추가한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-096 · L181–181 | - adoption 이후 새 디자인 수정은 모두 일반 규칙대로 `UI_DECISIONS.md`에 기록한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-097 · L183–183 | 이 전환 예외는 기존 게임을 새 규칙에 맞추기 위해 과거 기록을 왜곡하지 않기 위한 것이며, 이후 신규 게임의 pre-development baseline 의무를 약화하지 않는다. | 표현:예외 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6. UI_DESIGN.md 관리 규칙 > MUST: baseline 보존

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-098 · L187–187 | `UI_DESIGN.md`는 신규 게임 소스 개발 전에 확정한 조사·분석·설계 baseline을 보존한다. 개발 시작 후 발생하는 디자인 수정 때문에 이 문서를 현재 화면에 맞춰 계속 덮어쓰지 않는다. | 절:MUST | RULE / P | E-UI | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-099 · L189–189 | 다음과 같은 후속 변경은 `UI_DECISIONS.md`에 기록한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-100 · L191–191 | - 사용자 피드백으로 대표 색상/배경/심볼/타이포그래피 방향을 수정한 경우 | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-101 · L192–192 | - 실제 브라우저 QA로 page identity 또는 핵심 레이아웃을 바꾼 경우 | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-102 · L193–193 | - 카드/보드/칩/토큰 등 핵심 구성물 표현을 조정한 경우 | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-103 · L194–194 | - 주요 motion/interaction 원칙이나 responsive 전략을 수정한 경우 | 절:MUST; 표현:원칙 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-104 · L195–195 | - 구현하면서 기존 Phase 계획의 일부를 폐기하거나 다른 방식으로 대체한 경우 | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-105 · L197–197 | 작은 spacing 값이나 commit 단위 변경을 쌓는 changelog로 사용하지 않는 원칙은 `UI_DECISIONS.md`에도 동일하다. | 절:MUST; 표현:원칙 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-106 · L199–199 | 예외적으로 초기 조사 문서 자체의 출처 오기나 명백한 사실 오류를 고칠 수는 있지만, 왜 고쳤는지는 `UI_DECISIONS.md`에서 추적 가능해야 한다. | 절:MUST; 표현:예외 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6. UI_DESIGN.md 관리 규칙 > UI_DECISIONS.md와의 연결

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-107 · L203–203 | 모든 platform-native 게임은 다음 디자인 개발 이력 문서를 가진다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-108 · L205–207 | ```text<br>games/&lt;game-id&gt;/UI_DECISIONS.md<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-109 · L209–209 | `UI_DECISIONS.md`는 다음을 기록한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-110 · L211–211 | - 실제 브라우저 QA나 사용자 피드백으로 디자인이 바뀐 배경 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-111 · L212–212 | - 이전안과 검토한 대안, 최종 결정과 이유 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-112 · L213–213 | - 의미 있는 layout/component/interaction/motion/responsive 변경 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-113 · L214–214 | - 구현 상태와 UI/browser validation | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-114 · L215–215 | - 다음 디자인 작업 또는 미확정 polish | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-115 · L216–216 | - 어떤 초기 `UI_DESIGN.md` Phase/항목을 유지·보정·대체하는지 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-116 · L218–218 | 모든 CSS 수치나 commit을 기록하지 않는다. 현재 화면만 보고도 자명한 미세 조정은 생략하고, 다음 작업자가 동일한 시행착오를 반복하거나 사용자 의도를 잃을 수 있는 결정만 남긴다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-117 · L220–220 | 과거 결정이 뒤에서 바뀌어도 기존 기록을 삭제하지 않고 새 결정으로 대체하며 이전 항목을 `SUPERSEDED` 또는 `REVERTED`로 표시한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-118 · L222–222 | `UI_DESIGN.md`와 `UI_DECISIONS.md`가 같은 UI 항목에서 충돌하면 **baseline 이후 확정된 최신 non-superseded `UI_DECISIONS.md` 결정이 우선한다.** 신규 게임의 pre-development baseline이든 기존 게임의 adoption baseline이든 `UI_DESIGN.md`는 후속 변경을 되돌리는 근거로 사용할 수 없다. | 서술형(수치화 안 함) | RULE / P | E-UI | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-119 · L224–224 | 현재 유효 디자인은 다음처럼 해석한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-120 · L226–230 | ```text<br>effective design<br>= UI_DESIGN baseline (pre-development or explicit adoption baseline)<br>+ latest applicable UI_DECISIONS overrides<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-121 · L232–232 | `SUPERSEDED` 또는 `REVERTED` 처리된 과거 결정은 현재 override로 사용하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6. UI_DESIGN.md 관리 규칙 > MUST: 디자인 개발 lifecycle과 UI_DECISIONS 기록 타이밍

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-122 · L236–236 | platform-native 게임의 디자인 개발은 기본적으로 다음 네 단계로 본다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-123 · L238–238 | 1. **Design Research / Baseline** | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-124 · L239–239 · 부모 LEGACY-UI-123 |    - 신규 게임 runtime 개발 전에 원본 디자인을 전수 조사·분석한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-125 · L240–240 · 부모 LEGACY-UI-123 |    - Visual Identity, layout, component, motion, responsive, 최초 UI Phase를 `UI_DESIGN.md`에 기록한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-126 · L241–241 · 부모 LEGACY-UI-123 |    - 이 단계는 아직 후속 수정이 없으므로 `UI_DECISIONS.md / Decision Log`를 억지로 채우지 않는다. 문서 구조와 빈 current track만 준비할 수 있다. | 절:MUST; 표현:할 수 있다 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-127 · L242–242 | 2. **Baseline Implementation** | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-128 · L243–243 · 부모 LEGACY-UI-127 |    - `UI_DESIGN.md`에 수립한 Phase와 규칙대로 최초 UI를 구현한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-129 · L244–244 · 부모 LEGACY-UI-127 |    - baseline을 그대로 구현한 사실 자체는 `UI_DECISIONS.md`의 decision으로 기록하지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-130 · L245–245 · 부모 LEGACY-UI-127 |    - 다만 실제 구현 제약이나 검증 때문에 baseline에서 의미 있게 벗어나기로 확정했다면 그 시점부터 `UI_DECISIONS.md`에 기록한다. | 절:MUST; 표현:검증 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-131 · L246–246 | 3. **Developer Manual Design Review / Detail Polish** | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-132 · L247–247 · 부모 LEGACY-UI-131 |    - 기능 구현이 충분히 완료되고 release 전 검증·마무리 단계에 들어가면 개발자가 실제 브라우저에서 직접 플레이하며 디자인을 수동 검토한다. | 절:MUST; 표현:검증 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-133 · L248–248 · 부모 LEGACY-UI-131 |    - 이 단계에서 발생하는 개발자의 구체적인 layout, component, spacing 관계, interaction, motion, responsive, 시각적 우선순위 수정 요청은 `UI_DECISIONS.md`의 핵심 기록 대상이다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-134 · L249–249 · 부모 LEGACY-UI-131 |    - 여러 번의 미세 조정 요청을 요청 횟수대로 기록하지 않고, 하나의 디자인 영역이 안정화되어 최종 방향이 정해졌을 때 하나의 의미 있는 decision으로 정리한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-135 · L250–250 | 4. **Design Closeout** | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-136 · L251–251 · 부모 LEGACY-UI-135 |    - 주요 디자인 영역의 수동 검토와 수정이 끝나면 `UI_DECISIONS.md / Current Design Track`에서 현재 상태, active overrides, superseded/reverted decisions, 남은 follow-up을 정리한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-137 · L252–252 · 부모 LEGACY-UI-135 |    - 최종 결과를 만들기 위해 `UI_DESIGN.md` baseline을 현재 화면으로 덮어쓰지 않는다. 최종 유효 디자인은 baseline + 최신 decision overrides로 복원 가능해야 한다. | 절:MUST | RULE / P | E-UI | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-138 · L254–254 | `UI_DECISIONS.md`의 기록 단위는 **수정 요청 하나**가 아니라 **확정된 디자인 결정 하나**다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-139 · L256–256 | 예를 들어 개발자가 한 영역에 대해 위치를 올렸다가 내리고, 크기를 키웠다가 줄이는 여러 요청을 연속으로 했더라도 그 영역이 안정화되기 전까지 각각을 별도 decision으로 만들지 않는다. 최종적으로 채택된 상태, 변경 이유, 버린 대안과 영향 범위를 하나의 decision으로 기록한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6. UI_DESIGN.md 관리 규칙 > MUST: 디자인 개발 lifecycle과 UI_DECISIONS 기록 타이밍 > MUST: 기록 트리거

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-140 · L260–260 | 다음 시점에는 아직 문서화되지 않은 의미 있는 디자인 결정이 있는지 확인하고, 있다면 `UI_DECISIONS.md`를 갱신한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-141 · L262–262 | - `UI_DESIGN.md` baseline에서 벗어나는 의미 있는 구현 방향이 확정됐을 때 | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-142 · L263–263 | - 개발자의 수동 브라우저 디자인 리뷰에서 하나의 component/layout/interaction/motion 영역이 안정화되고 다른 영역으로 넘어갈 때 | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-143 · L264–264 | - 디자인 Phase 또는 detail-polish 작업 범위를 완료할 때 | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-144 · L265–265 | - 해당 디자인 작업 PR을 merge/close하거나 작업 브랜치를 종료하기 전 | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-145 · L266–266 | - 다른 큰 기능 작업이나 release closeout으로 전환하기 전 | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-146 · L268–268 | SHOULD: 같은 디자인 영역이 아직 빠르게 반복 수정 중이면 매 수정마다 문서를 갱신하지 않고 안정화 시점에 묶어서 기록한다. | 본문:SHOULD; 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-147 · L270–270 | MUST NOT: 디자인 작업 PR이나 브랜치를 종료하면서 아직 복원 가치가 있는 개발자 피드백과 확정 디자인 결정을 코드에만 남기고 `UI_DECISIONS.md` 기록 없이 버리지 않는다. | 본문:MUST NOT; 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6. UI_DESIGN.md 관리 규칙 > MUST: 사용자가 `디자인 체크포인트 기록하자`라고 요청할 때

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-148 · L274–274 | `디자인 체크포인트 기록하자`는 Game Platform의 명시적 디자인 handoff checkpoint 명령이다. | 절:MUST | RULE / P | E-UI | D03 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-149 · L276–276 | 사용자가 이 명령을 요청하면 현재 작업 구간에서 **이미 확정되어 복원 가치가 있는 디자인 결정만** `UI_DECISIONS.md`에 정리하고, 유효한 현재 작업 브랜치에 commit해 다음 채팅이나 다음 작업자가 그대로 이어갈 수 있게 한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-150 · L278–278 | 이 경우: | 절:MUST | CONTEXT / I | E-UI | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-UI-151 · L280–280 | 1. 같은 디자인 영역에서 아직 빠르게 반복 수정 중인 요청은 각각 별도 decision으로 만들지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-152 · L281–281 | 2. 현재까지 안정화된 component/layout/interaction/motion 단위를 기준으로 최종 채택안, 변경 이유, 이전 대안, 적용 범위, 구현/검증 상태를 기록한다. | 절:MUST; 표현:검증 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-153 · L282–282 | 3. 기존 decision을 대체하거나 되돌린 경우 `Supersedes`와 `SUPERSEDED` / `REVERTED` 관계를 명시한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-154 · L283–283 | 4. 아직 확정되지 않은 디자인은 `Open Follow-up`에 남기고 확정 decision처럼 기록하지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-155 · L284–284 | 5. 초기 `UI_DESIGN.md` baseline을 현재 화면에 맞춰 재작성하지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-156 · L285–285 | 6. 이 명령 자체는 디자인 Phase 완료나 `FINAL` 상태를 의미하지 않는다. 수동 디자인 리뷰 중간에도 사용할 수 있다. | 절:MUST; 표현:할 수 있다 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-157 · L286–286 | 7. 기능 진행상태를 기록하기 위한 `DEVELOPMENT.md`는 디자인 checkpoint라는 이유만으로 수정하지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-158 · L288–288 | 사용자가 기능과 디자인 checkpoint를 한 요청에서 모두 명시하면 두 책임 문서를 각각 갱신할 수 있다. | 절:MUST; 표현:할 수 있다 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-159 · L290–290 | 이 명령과 별개로 위 lifecycle 기반 기록 트리거는 계속 적용한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6. UI_DESIGN.md 관리 규칙 > MUST: Phase를 이어갈 때 디자인 회귀 방지

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-160 · L294–294 | `UI_DESIGN.md / Implementation Plan`에 정의된 다음 Phase를 구현하거나 과거에 미완료였던 UI 작업을 재개할 때는 소스 수정 전에 반드시 다음을 수행한다. | 절:MUST; 표현:반드시 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-161 · L296–296 | 1. 해당 Phase의 초기 `UI_DESIGN.md` 요구사항을 확인한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-162 · L297–297 | 2. `UI_DECISIONS.md`에서 그 Phase, component, layout, interaction, motion과 관련된 후속 결정을 확인한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-163 · L298–298 | 3. 이미 runtime에 반영된 디자인과 후속 결정이 초기 계획보다 발전한 상태라면 그 상태를 보존한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-164 · L299–299 | 4. 초기 Phase 문구와 최신 유효 결정이 충돌하면 최신 `UI_DECISIONS.md`를 적용한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-165 · L300–300 | 5. 폐기되거나 supersede된 안을 "원래 계획"이라는 이유로 다시 구현하지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-166 · L301–301 | 6. 작업 완료 전 변경 범위가 기존 유효 decision을 회귀시키지 않았는지 확인한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-167 · L303–303 | MUST NOT: Phase 체크리스트를 순서대로 완료하는 과정에서 후속 사용자 수정, 실제 브라우저 QA 결과, 이미 채택된 interaction을 과거 설계안으로 원복한다. | 본문:MUST NOT; 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 6. UI_DESIGN.md 관리 규칙 > DEVELOPMENT.md와의 연결

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-168 · L307–307 | `DEVELOPMENT.md`는 기능 개발 handoff를 책임진다. 디자인 작업이 release 판단에 영향을 주는 경우 현재 design track을 짧게 참조할 수 있지만, baseline 이후의 의미 있는 UI 변경·결정·디자인 검증 이력은 `UI_DECISIONS.md`에 둔다. | 표현:검증 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-169 · L309–309 | 완료되지 않은 UI 항목을 `UI_DESIGN.md`에서 삭제해 현재 구현처럼 보이게 하지 않고, 초기 baseline의 단순 미구현인지 후속 decision으로 변경·대체된 것인지 `UI_DECISIONS.md`에서 구분한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 7. 실제 보드게임의 공간 구조 반영

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-170 · L313–313 | 웹 UI는 실제 게임에서 플레이어가 정보를 읽고 구성물을 다루는 방식을 조사해 가능한 범위에서 반영한다. | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-171 · L315–315 | 예: | 서술형(수치화 안 함) | CONTEXT / I | E-UI | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-UI-172 · L317–317 | - 중앙 공용 영역 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-173 · L318–318 | - 개인 플레이어 영역 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-174 · L319–319 | - 카드/칩이 실제로 쌓이거나 겹치는 방식 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-175 · L320–320 | - 공개 정보와 비공개 정보의 시각적 구분 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-176 · L321–321 | - 보드에서 진행 방향과 상태를 읽는 방식 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-177 · L323–323 | 원본 배치를 그대로 복제하는 것이 가독성을 해치면 웹 환경에 맞게 재구성할 수 있다. 최초 adaptation 계획은 `UI_DESIGN.md`에 두고, 개발 시작 후 실제 브라우저 검토로 그 배치를 수정했다면 최신 유효 결정과 이유를 `UI_DECISIONS.md`에 남긴다. | 표현:할 수 있다 | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 8. 모션과 행동 피드백

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-178 · L327–327 | 게임의 핵심 행동은 상태 값만 즉시 바뀌는 방식보다 실제 구성물이 움직인다는 감각을 우선 검토한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-179 · L329–329 | 예: | 서술형(수치화 안 함) | CONTEXT / I | E-UI | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-UI-180 · L331–331 | - 카드 공개 / 뒤집기 / 이동 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-181 · L332–332 | - 칩 또는 토큰 지불과 획득 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-182 · L333–333 | - 주사위 굴림 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-183 · L334–334 | - 말 이동 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-184 · L335–335 | - 돈/자산 이동 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-185 · L336–336 | - 턴 전환 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-186 · L337–337 | - 큰 점수/중요 행동 피드백 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-187 · L338–338 | - 게임 종료와 승자 발표 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-188 · L340–340 | 애니메이션은 장식보다 **원인 → 이동/행동 → authoritative 결과 반영**의 순서를 사용자가 이해하게 만드는 것이 우선이다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-189 · L342–342 | 동기화 안정성을 해치거나 실제 서버 상태와 다른 결과를 먼저 확정해서 보여주지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 9. 결과와 재대결 presentation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-190 · L346–346 | 멀티플레이 게임의 결과 화면과 재대결 준비 화면도 해당 게임의 Visual Identity 안에서 설계한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-191 · L348–348 | 재대결 lifecycle 자체의 기능 규칙과 서버 권위는 `docs/game-platform-development-rules.md`를 따른다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-192 · L350–350 | UI는 최소 다음을 명확히 표현한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-193 · L352–352 | - 게임 종료 이유와 결과 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-194 · L353–353 | - 승자 또는 공동 승자 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-195 · L354–354 | - 재대결 선택 상태 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-196 · L355–355 | - 플레이어별 준비 상태 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-197 · L356–356 | - 방장이 새 게임을 시작할 수 있는 조건 | 표현:조건 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-198 · L357–357 | - 재대결하지 않는 플레이어의 이탈 경로 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 10. Responsive 기준

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-199 · L361–361 | 게임 UI는 desktop과 mobile 모두에서 핵심 정보와 action이 유지되어야 한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-200 · L363–363 | - 화면 높이가 제한돼도 매 턴 불필요한 상하 스크롤을 강요하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-201 · L364–364 | - 많은 카드/토큰 등은 겹침, 축약, scroll area 등 게임에 맞는 표현을 설계한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-202 · L365–365 | - 핵심 숫자와 상태는 구성물이 겹쳐도 읽을 수 있는 위치를 우선한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-203 · L366–366 | - hover에만 의존하는 핵심 interaction을 만들지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-204 · L367–367 | - mobile에서 터치 target과 modal/overlay가 gameplay를 막지 않는지 검증한다. | 표현:검증 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 10. Responsive 기준 > Implementation Plan 책임

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-205 · L371–371 | `UI_DESIGN.md / Implementation Plan`은 runtime 개발 전에 수립한 **초기 presentation 적용 순서와 가이드**를 보존하며 live progress/changelog로 사용하지 않는다. 기능 상태 머신, DB/RPC, 서버 권위 구현 순서는 `GAME_SPEC.md`, 실제 기능 다음 작업은 `DEVELOPMENT.md / Next Work`에서 관리한다. 개발 시작 후 baseline에서 벗어나 확정된 디자인 변경, 수동 브라우저 리뷰 결과와 그에 따른 후속 UI 작업만 `UI_DECISIONS.md`에서 추적한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-206 · L373–373 | 같은 TODO나 결정 이력을 네 문서에 반복 복제하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 11. 구현 완료 검증

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-207 · L377–377 | UI 구현을 완료했다고 판단하기 전에 최소 다음을 확인한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-208 · L379–379 | - 원본 게임 조사 결과가 `UI_DESIGN.md`에 남아 있는가 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-209 · L380–380 | - 디자인 출처와 자산 사용 가능 여부가 구분돼 있는가 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-210 · L381–381 | - generic 청파 같이 페이지가 아니라 해당 게임의 독립적인 공간으로 느껴지는가 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-211 · L382–382 | - 대표 색상/심볼/구성물 표현이 설계와 일치하는가 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-212 · L383–383 | - lobby부터 result/rematch까지 Visual Identity가 끊기지 않는가 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-213 · L384–384 | - gameplay 핵심 정보의 가독성이 충분한가 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-214 · L385–385 | - motion이 서버 권위와 충돌하지 않고 행동 순서를 이해시키는가 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-215 · L386–386 | - desktop/mobile에서 핵심 action을 사용할 수 있는가 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-216 · L387–387 | - `UI_DECISIONS.md`의 디자인 진행·중요 결정·검증 이력이 실제 구현과 일치하는가 | 표현:검증 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 12. 공통화 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-217 · L391–391 | 게임 하나에서 편리했던 CSS, 컴포넌트, 애니메이션을 즉시 `games/shared/` 공통 계약으로 승격하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-218 · L393–393 | 게임 규칙과 무관하게 여러 신규 게임에서 반복되는 접근성, 연결 상태, Room/Lobby 같은 책임만 기존 Game Platform 규칙에 따라 SHARED 후보로 검토한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-219 · L395–395 | Visual Identity와 game-specific presentation은 기본적으로 GAME-LOCAL에 유지한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### GUIDE — `games/README.md`

- source: [games/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/README.md)
- blob: `49c3d8604b8b24d6a5cf5e66d848b35a22610bee`; 원문 55줄; 상태 `CURRENT`; 37 관리단위 / 37 규칙·필드 단위.


#### Game Platform

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GUIDE-001 · L3–3 | 이 디렉터리는 앞으로 추가되는 게임을 위한 공통 Game Platform 기반입니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-002 · L5–5 | 신규 platform-native 게임을 구현하거나 수정할 때는 &#91;Game Platform Development Rules&#93;(../docs/game-platform-development-rules.md)와 &#91;Game Platform UI Design Rules&#93;(../docs/game-platform-ui-rules.md)를 **필수 실행 기준**으로 먼저 확인합니다. 사용자가 매 작업마다 플랫폼 규칙이나 UI 조사/설계를 다시 설명하지 않아도 두 문서를 기본 전제로 적용합니다. | 표현:필수 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-003 · L7–7 | &#91;Game Platform Strategy&#93;(../docs/game-platform-strategy.md)는 플랫폼 구축 배경과 Legacy 정책을 이해하기 위한 참고 문서이며, 신규 게임의 현재 실행 규칙보다 우선하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GUIDE-004 · L11–11 | - 기존 `liar-game/`, `the-game/`, `marble-game/`은 기존 경로와 런타임을 유지합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-005 · L12–12 | - Drawing Spy는 Liar Game 내부 모드이므로 별도 루트로 이동하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-006 · L13–13 | - 기존 게임은 새 플랫폼 기능이나 공통 레이아웃을 강제로 적용하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-007 · L14–14 | - 새 게임은 가능한 한 `games/&lt;game-id&gt;/` 아래에 두고 `games/shared/`의 공통 계약을 사용합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-008 · L15–15 | - 신규 게임은 runtime 구현 전에 `games/GAME_SPEC_TEMPLATE.md`, `games/DEVELOPMENT_TEMPLATE.md`, `games/UI_DESIGN_TEMPLATE.md`, `games/UI_DECISIONS_TEMPLATE.md`를 기준으로 `games/&lt;game-id&gt;/GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`를 만들고, 기능 기준과 디자인 기준뿐 아니라 각 트랙의 진행 기록 경계까지 먼저 정리합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D01 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-009 · L16–16 | - `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`만 존재하는 bootstrap 디렉터리는 미완성 게임 노출을 막기 위해 Registry 등록 전 상태로 둘 수 있습니다. runtime 파일을 추가하는 순간 Registry 규칙이 적용됩니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D01 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-010 · L17–17 | - 각 platform-native 게임은 `GAME_SPEC.md`를 현재 기능 설계 기준, `DEVELOPMENT.md`를 기능 구현·검증 진행 인수인계, `UI_DESIGN.md`를 runtime 개발 전 디자인 전수 조사·분석과 최초 Phase를 담은 baseline, `UI_DECISIONS.md`를 개발 시작 후 디자인 진행·변경 의사결정·검증과 baseline override 이력으로 관리합니다. | 표현:검증 | RULE / P | E-DOC | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-011 · L18–18 | - `기능 체크포인트 기록하자`는 `DEVELOPMENT.md` 중심의 기능 handoff 명령이며 기능 설계 변경이 있을 때만 `GAME_SPEC.md`를 함께 정합화합니다. 디자인 문서는 이 명령 때문에 수정하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D02 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-012 · L19–19 | - `디자인 체크포인트 기록하자`는 `UI_DECISIONS.md` 중심의 디자인 handoff 명령이며 현재까지 안정화된 확정 디자인 decision만 기록합니다. `UI_DESIGN.md` baseline과 기능 진행 문서는 이 명령 때문에 수정하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D03 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-013 · L20–20 | - 두 명령은 한 요청에서 함께 사용할 수 있습니다. 접두어가 없는 일반적인 checkpoint 표현이나 새 채팅용 정리·문서·요약 요청은 공식 repository checkpoint 명령으로 확대 해석하지 않습니다. 유효한 현재 작업 브랜치가 있으면 그 브랜치에 commit하고, 없으면 저장소의 일반 브랜치 규칙에 따라 별도 작업 브랜치를 사용합니다. | 표현:할 수 있습니다 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-014 · L21–21 | - 두 사용자 명령과 별개로 기능 Phase 완료, 디자인 lifecycle 기록 트리거, release closeout 등 규칙 문서의 기존 자동 갱신 시점은 그대로 유지합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-015 · L22–22 | - 게임 규칙, 턴 상태 머신, 승패 조건은 기능 문서에, 게임별 Visual Identity·레이아웃·애니메이션의 최초 baseline과 후속 변경 이력은 각각 `UI_DESIGN.md`와 `UI_DECISIONS.md`에 남겨 둡니다. | 표현:조건 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-016 · L23–23 | - UI Phase를 이어갈 때 초기 계획과 후속 결정이 충돌하면 최신 non-superseded `UI_DECISIONS.md`를 우선하며, 이미 반영된 사용자 디자인 수정을 과거 `UI_DESIGN.md` 안으로 회귀시키지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-017 · L24–24 | - 기능 구현이 release 후보 수준에 도달하면 디자인을 자동 완료 처리하지 않고 Developer Manual Design Review / Detail Polish로 전환합니다. 개발자가 실제 브라우저에서 플레이하며 요청한 디테일 수정은 영역이 안정화된 시점에 `UI_DECISIONS.md`에 확정 decision 단위로 남기며, 디자인 PR/브랜치 종료 또는 release closeout 전에 누락을 확인합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-018 · L25–25 | - 최초 `UI_DESIGN.md`를 계획대로 구현한 사실 자체는 `UI_DECISIONS.md`에 중복 기록하지 않습니다. 이 문서는 baseline에서 벗어난 확정 변경과 개발자의 수동 디자인 리뷰 결과를 보존하는 데 사용합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-019 · L26–26 | - game-local 작업에서 상위 Game Platform 규칙과 충돌하는 새 필요를 발견하면 일반 하위 변경으로 바로 구현하지 않습니다. 플랫폼 전반에 필요한 변경으로 토의·합의되면 **ARCHITECTURE CHANGE**로 승격해 Development Rules와 Governance의 상·하위 정합화 및 전체 platform-native 게임 영향도 감사를 거칩니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D10, R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-020 · L27–27 | - 멀티플레이 게임은 게임 종료 후 동일 room/player context에서 재대결 준비 상태로 전환하고, 참여자 준비 완료 후 방장이 다시 시작할 수 있는 흐름을 기본 제품 요구사항으로 설계합니다. 내부 RPC/adapter 공통화는 별도 근거 없이 강제하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D07 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Released game lifecycle

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GUIDE-021 · L31–31 | 출시가 끝난 platform-native 게임의 `DEVELOPMENT.md`는 `Status: RELEASED`, `Active branch: main`과 날짜가 있는 release 기록을 유지합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-022 · L33–33 | 후속 수정은 종료된 feature 브랜치를 재사용하지 않고 최신 `main`에서 새 브랜치로 시작합니다. 구현 중 발견한 플랫폼 교훈은 &#91;Game Platform Development Rules&#93;(../docs/game-platform-development-rules.md)의 release feedback loop에 따라 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 다시 분류합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-023 · L35–35 | 특정 platform-native 게임의 구현을 다른 신규 게임의 기준 사례로 삼지 않습니다. 현재 공통 계약과 규칙 문서, 템플릿을 기준으로 시작하고 게임별 기능 기준/진행과 디자인 기준/이력은 해당 게임 디렉터리 안의 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`에서 분리해 관리합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Phase 3 foundation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GUIDE-024 · L38–38 | - `registry.js`: 게임 메타데이터와 capability Registry | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-025 · L39–39 | - `accessGate.js`: 인증/승인회원 Access Gate | 표현:승인 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-026 · L40–40 | - `roomLobbyContract.js`: 방 생성/참가/준비/시작 등 Room/Lobby adapter 계약 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-027 · L41–41 | - `snapshotCoordinator.js`: authoritative snapshot refresh, stale version 거부, invalidation coalescing | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-028 · L42–42 | - `reconnectRefresh.js`: online/pageshow/visibility 복귀 시 snapshot refresh trigger | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-029 · L43–43 | - `actionContract.js`: `expectedVersion` + `clientActionId`를 포함하는 versioned/idempotent action envelope | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-030 · L44–44 | - `gameShellState.js`: 연결 상태와 플레이어 표시용 공통 view-state 계약 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-031 · L45–45 | - `gameShell.js`: 신규 게임용 공통 화면 골격, 연결 상태, 플레이어 roster | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-032 · L46–46 | - `game-shell.css`: 신규 게임이 명시적으로 opt-in 하는 공통 Shell 스타일 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-033 · L47–47 | - `gameInvite.js`: site invite 인프라를 재사용하는 platform-native `game_room` 초대 계약 | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-034 · L49–49 | 공통 계약은 새 게임을 위한 기준입니다. 기존 게임을 이 구조로 마이그레이션하기 위한 호환 계층으로 사용하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-035 · L51–51 | `game-shell.css`는 전역 사이트 CSS에 자동으로 포함하지 않습니다. 신규 게임 페이지가 필요할 때 직접 로드하며, Legacy 게임과 기존 커뮤니티 화면에는 적용하지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-036 · L53–53 | 서버 권한 검증과 게임 상태 판정은 계속 각 게임의 DB/RPC가 최종 권위입니다. 프런트 공통 모듈은 DB authorization을 대체하지 않습니다. | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-GUIDE-037 · L55–55 | Invite 영향 분석과 Legacy 경계는 &#91;Game Platform Invite Analysis&#93;(../docs/game-platform-invite-analysis.md)를 참고합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### SPEC-T — `games/GAME_SPEC_TEMPLATE.md`

- source: [games/GAME_SPEC_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/GAME_SPEC_TEMPLATE.md)
- blob: `2b63d9cafee15bd952fcb4ddb8bb06bcec3240d2`; 원문 81줄; 상태 `TEMPLATE`; 43 관리단위 / 43 규칙·필드 단위.


#### <Game Title> Game Spec

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-001 · L3–5 | &gt; 이 문서는 이 게임이 무엇이며 청파 같이에서 어떤 규칙과 구조로 구현할지 정의하는 game-local 설계 기준입니다.<br>&gt; UI/presentation은 같은 디렉터리의 `UI_DESIGN.md`에 소스 개발 전 초기 baseline을 두고, 개발 시작 후 변경·결정·검증과 override는 `UI_DECISIONS.md`에서 관리합니다. 기능 구현 진행상황은 `DEVELOPMENT.md`에서 관리합니다.<br>&gt; 공통 UI 조사/설계 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다. | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Game Overview

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-002 · L9–9 | - Game id: &lt;lowercase-kebab-case&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-003 · L10–10 | - Players: &lt;supported player count&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-004 · L11–11 | - Core loop: &lt;한 문장&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-005 · L12–12 | - Win condition: &lt;한 문장&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Rules and Sources

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-006 · L16–16 | - &lt;공식 규칙서 / 퍼블리셔 / 신뢰 가능한 규칙 출처&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-007 · L17–17 | - &lt;출처마다 구현에 필요한 규칙 차이 또는 버전 차이를 기록&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-008 · L18–18 | - 원문을 장문 복제하지 않고 구현에 필요한 사실과 해석만 요약합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-009 · L19–19 | - 처음 플레이하는 사용자가 읽고 바로 플레이할 수 있는 사용자용 규칙 안내의 구성과 노출 위치(modal 또는 전용 페이지)를 정의합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Product Scope

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-010 · L23–23 | - Included: &lt;이번 제품에서 지원할 규칙/모드&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-011 · L24–24 | - Deferred: &lt;후속으로 미룰 규칙/모드&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-012 · L25–25 | - Not planned: &lt;명시적 제외&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### State Machine

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-013 · L29–29 | - &lt;ENTRY / SETUP / PLAY / TERMINAL 등 이 게임에 필요한 상태와 전이&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-014 · L30–30 | - 각 상태에서 가능한 action과 전이 조건을 기록합니다. | 표현:조건 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-015 · L31–31 | - lobby, ready, host start 같은 시작 lifecycle은 실제 게임 구조에 맞게 정의합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-016 · L32–32 | - 멀티플레이 게임은 TERMINAL/GAME_OVER 이후 동일 room/player context를 유지하는 rematch 준비 상태와 준비 완료 → 방장 시작 흐름을 정의합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | D07 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Domain Model

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-017 · L36–36 | - &lt;보드/카드/주사위/말/플레이어 상태 등&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-018 · L37–37 | - deterministic 계산에 필요한 핵심 데이터 구조를 기록합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Platform Boundary

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-019 · L41–41 | - SHARED: &lt;이 게임이 실제 사용하는 Registry / Access Gate / Room-Session / Snapshot / Reconnect / Invite 등 재사용 항목&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-020 · L42–42 | - GAME-LOCAL: &lt;게임 규칙, 상태 머신, 도메인 계산, 전용 UI&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-021 · L43–43 | - shared 계약 확장이 필요해 보이는 항목은 실제 공통 책임인지 확인 전까지 GAME-LOCAL로 둡니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-022 · L44–44 | - 현재 shared lifecycle에 맞추기 위해 게임에 존재하지 않는 ready/host 같은 시작 개념을 억지로 추가하지 않습니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-023 · L45–45 | - 멀티플레이 재대결 UX는 공통 제품 요구사항으로 설계하되 이를 위해 특정 RPC 이름이나 shared adapter method를 선행 강제하지 않습니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Authority and Persistence

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-024 · L49–49 | - online/stateful 게임이라면 서버가 최종 결정해야 하는 action과 난수 결과 | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-025 · L50–50 | - authoritative snapshot이 필요한 경우 포함할 public/private state | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-026 · L51–51 | - 상태 변경 action이 있다면 version / idempotency / transaction 경계 | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-027 · L52–52 | - reconnect가 필요한 경우 복원 기준 | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### UI / UX Direction

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-028 · L56–56 | - 상세 Visual Identity, 원본 디자인 조사, page/lobby/gameplay/result layout, motion, responsive 계획은 `UI_DESIGN.md`에서 관리합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-029 · L57–57 | - 공통 Shell 사용 범위와 game-local UI 경계를 요약합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-030 · L58–58 | - 플레이 시작 전 entry/setup 화면과 플레이 중 게임 규칙 보기 진입점을 정의합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-031 · L59–59 | - 사이트 계정 기반 multiplayer라면 플레이어 표시 이름은 사이트 프로필 닉네임을 사용하고 게임별 입력/변경 UI를 두지 않습니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | D05 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-032 · L60–60 | - 지속되는 플레이 세션이 있다면 종료 권한과 확인 UX를 정의합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-033 · L61–61 | - 멀티플레이 게임이면 게임 종료 → 재대결 준비 → 참여자 준비 완료 → 방장 시작 → 새 게임의 lifecycle을 정의합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Implementation Plan

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-034 · L65–65 | &gt; 기능·상태 머신·DB/RPC·플랫폼 연결의 설계 순서만 관리합니다. 디자인 기준은 `UI_DESIGN.md`, 디자인 개발 진행·결정 이력은 `UI_DECISIONS.md`, 현재 실제 기능 다음 작업은 `DEVELOPMENT.md / Next Work`에서 관리합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-035 · L67–67 | 1. &lt;첫 구현 slice&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-036 · L68–68 | 2. &lt;다음 slice&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-037 · L69–69 | 3. &lt;이 게임이 사용하는 online/DB/snapshot/realtime/UI capability 순서&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Validation Plan

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-038 · L73–73 | - 게임 규칙 unit test | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-039 · L74–74 | - Game Platform contract test | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-040 · L75–75 | - online인 경우 DB/Test Contract | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-041 · L76–76 | - 해당하는 경우 multiplayer / reconnect / stale action 회귀 | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SPEC-T-042 · L77–77 | - 필요한 수동 브라우저 검증 | 표현:검증 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Open Questions / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SPEC-T-043 · L81–81 | - &lt;아직 확정하지 않은 규칙/UX/기술 결정, 없으면 없음&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### DEV-T — `games/DEVELOPMENT_TEMPLATE.md`

- source: [games/DEVELOPMENT_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/DEVELOPMENT_TEMPLATE.md)
- blob: `e48f42067682975202067537f005270054ed1e7c`; 원문 61줄; 상태 `TEMPLATE`; 22 관리단위 / 21 규칙·필드 단위.


#### <Game Title> Development

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-T-001 · L3–6 | &gt; 이 문서는 기능 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다. 긴 changelog 대신 현재 기능 상태와 다음 행동을 유지합니다.<br>&gt;<br>&gt; 게임 규칙과 기능 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다. UI는 `UI_DESIGN.md`의 소스 개발 전 baseline과 `UI_DECISIONS.md`의 최신 non-superseded override를 함께 적용합니다. 이 문서에는 UI 세부 변경사를 중복 기록하지 않고 기능 구현·검증 상태와 release 관점의 상위 UI 트랙 상태만 참조합니다.<br>&gt; 공통 UI 조사/설계 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다. | 표현:검증 | RULE / P | E-DOC | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Current Status

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-T-002 · L10–10 | - Phase: &lt;phase&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-003 · L11–11 | - Status: IN_PROGRESS | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-004 · L12–12 | - Active branch: &lt;branch&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-005 · L13–13 | - Last checkpoint: &lt;YYYY-MM-DD / commit if available&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Completed

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-T-006 · L17–17 | - 기능: &lt;GAME_SPEC.md 기준 실제로 완료된 기능/규칙/DB 작업&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-007 · L18–18 | - Design track reference: &lt;필요한 경우 UI_DECISIONS.md의 현재 UI 단계/결정 항목 링크 또는 요약&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Current Work

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-T-008 · L22–22 | - 기능: &lt;현재 진행 중이며 아직 완료되지 않은 기능 작업&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-009 · L23–23 | - Design track reference: &lt;UI 작업이 병행 중이면 UI_DECISIONS.md의 현재 항목을 참조&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Next Work

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-T-010 · L27–27 | &gt; 설계 계획을 복제하지 않고 현재 작업에서 바로 수행할 구체적인 행동만 기록합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-011 · L29–29 | - &lt;다음 채팅/작업자가 가장 먼저 수행할 기능/DB/플랫폼 작업&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-012 · L30–30 | - UI 작업 자체의 다음 행동은 `UI_DECISIONS.md`의 현재 디자인 트랙에 기록하고 여기에는 중복 복제하지 않습니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Decisions

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-T-013 · L34–34 | - &lt;확정된 게임 규칙/기능 아키텍처 결정&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-014 · L35–35 | - UI/presentation의 개발 시작 후 결정은 `UI_DECISIONS.md`에 기록하며 `UI_DESIGN.md` baseline을 현재 화면에 맞춰 재작성하지 않습니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Validation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-T-015 · L39–39 | - Functional / contract: &lt;실행 완료 기능·규칙·DB·contract 검증&gt; | 표현:검증 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-016 · L40–40 | - Design validation reference: &lt;release 판단에 필요한 경우 UI_DECISIONS.md의 브라우저/반응형/animation 검증 기록 참조&gt; | 표현:검증 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-017 · L41–41 | - Pending: &lt;아직 실행하지 못한 기능 검증&gt; | 표현:검증 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Known Issues / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-T-018 · L45–45 | - &lt;기능 blocker / known issue / 보류 사항, 없으면 없음&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-019 · L46–46 | - UI 설계와 실제 구현의 차이, 미확정 asset/license, 후속 visual polish는 `UI_DECISIONS.md`에서 추적합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Release closeout 안내

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-T-020 · L50–50 | 게임을 production에 공개해 `Status: RELEASED`로 전환할 때는 이 안내 섹션을 실제 날짜가 있는 다음 형식의 release 기록으로 교체합니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-T-021 · L52–59 | ```text<br>## Release — YYYY-MM-DD<br><br>- production activation / migration 요약<br>- 현재 Registry capability<br>- 핵심 검증 결과<br>- 유지보수 baseline 및 남은 관찰 항목<br>``` | 표현:검증 | EXAMPLE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DEV-T-022 · L61–61 | `RELEASED` 상태에서는 `Active branch: main`을 사용하고, 과거 feature branch를 현재 기준으로 남기지 않습니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### UI-T — `games/UI_DESIGN_TEMPLATE.md`

- source: [games/UI_DESIGN_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DESIGN_TEMPLATE.md)
- blob: `e412138d9d60f5189709c20c634bcb0f5f28be82`; 원문 138줄; 상태 `TEMPLATE`; 92 관리단위 / 92 규칙·필드 단위.


#### <Game Title> UI Design

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-001 · L3–5 | &gt; 이 문서는 신규 게임의 runtime/UI 소스 개발을 시작하기 전에 디자인 전수 조사와 분석을 바탕으로 수립하는 game-local 초기 UI/presentation baseline입니다.<br>&gt; 개발 시작 후 발생하는 사용자 피드백·디자인 수정·대안·검증 이력은 이 문서를 덮어쓰지 않고 `UI_DECISIONS.md`에 기록합니다.<br>&gt; 공통 UI 조사/설계 규칙은 `docs/game-platform-ui-rules.md`, 게임 기능 설계는 같은 디렉터리의 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다. | 표현:검증 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Design Research

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-002 · L9–9 | - Target edition / visual baseline: &lt;대상 판본 또는 기준&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-003 · L10–10 | - Official / publisher sources: &lt;공식 제품 페이지, 규칙서, 이미지 자료&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-004 · L11–11 | - Additional references: &lt;실제 플레이, 신뢰 가능한 디지털 구현 등&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-005 · L12–12 | - 조사한 구성물: &lt;카드/보드/칩/토큰/주사위/말 등&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-006 · L13–13 | - Source → Observation → Decision: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-007 · L14–14 · 부모 LEGACY-UI-T-006 |   - &lt;출처&gt;: &lt;관찰한 색상/형태/배치/타이포그래피&gt; → &lt;직접 사용 / 재구성 / 사용하지 않음 + 이유&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-008 · L15–15 | - 핵심 관찰: &lt;원본에서 반복되는 색상, 배치, 형태, 분위기&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-009 · L16–16 | - Last reviewed: &lt;YYYY-MM-DD&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Copyright / Asset Usage

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-010 · L20–20 | - Directly usable: &lt;사용 근거가 확인된 자산&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-011 · L21–21 | - Recreate / reinterpret: &lt;직접 복제하지 않고 재구성할 요소&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-012 · L22–22 | - Do not use directly: &lt;권리가 불명확하거나 보호되는 자산&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-013 · L23–23 | - License / attribution notes: &lt;출처와 사용 조건&gt; | 표현:조건 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Visual Identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-014 · L27–27 | - Primary color: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-015 · L28–28 | - Secondary color: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-016 · L29–29 | - Accent color: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-017 · L30–30 | - Background color: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-018 · L31–31 | - Typography direction: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-019 · L32–32 | - Symbols / patterns: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-020 · L33–33 | - Material / texture: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-021 · L34–34 | - Visual keywords: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Page Identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-022 · L38–38 | - 청파 같이 일반 화면에서 게임 공간으로 전환되는 방식: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-023 · L39–39 | - 전체 배경 / frame: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-024 · L40–40 | - title / logo treatment: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-025 · L41–41 | - navigation / back-to-games 처리: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-026 · L42–42 | - loading / reconnect / error presentation: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-027 · L43–43 | - 독립적인 게임 페이지 느낌을 만드는 핵심 요소: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Lobby / Setup Design

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-028 · L47–47 | - 방 생성 / 참가: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-029 · L48–48 | - 플레이어 roster: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-030 · L49–49 | - host / ready 표현: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-031 · L50–50 | - rules entry: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-032 · L51–51 | - rules / help presentation: &lt;modal 또는 전용 page, Visual Identity 연결, 핵심 메커니즘 시각화, scroll/responsive 방식&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-033 · L52–52 | - start action: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-034 · L53–53 | - invite / room code presentation: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-035 · L54–54 | - desktop / mobile 배치: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Gameplay Layout

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-036 · L58–58 | - Main board / shared zone: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-037 · L59–59 | - Player zones: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-038 · L60–60 | - Public / private information: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-039 · L61–61 | - Primary actions: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-040 · L62–62 | - Secondary controls: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-041 · L63–63 | - 정보 우선순위: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-042 · L64–64 | - 실제 보드게임의 공간 구조를 웹으로 옮길 때의 adaptation: | 템플릿 필드 | TEMPLATE_FIELD / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Components

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-043 · L68–68 | - Cards: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-044 · L69–69 | - Chips / tokens: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-045 · L70–70 | - Dice / pieces: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-046 · L71–71 | - Player panel: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-047 · L72–72 | - Buttons: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-048 · L73–73 | - Modal / dialog: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-049 · L74–74 | - Rules visual examples: &lt;카드/주사위/말/칩/보드 등 실제 game component를 활용해 설명할 핵심 규칙과 accessibility fallback&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-050 · L75–75 | - Status / toast / event message: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-051 · L76–76 | - Result component: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Motion / Interaction

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-052 · L80–80 | - 핵심 행동 1: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-053 · L81–81 | - 핵심 행동 2: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-054 · L82–82 | - turn transition: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-055 · L83–83 | - acquire / spend / move feedback: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-056 · L84–84 | - timing 원칙: | 표현:원칙 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-057 · L85–85 | - server-authoritative state와 presentation의 동기화 기준: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-058 · L86–86 | - sound / haptic 계획이 있다면: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Result / Rematch Presentation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-059 · L90–90 | - 결과 정보 계층: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-060 · L91–91 | - winner / draw 표현: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-061 · L92–92 | - rematch CTA: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-062 · L93–93 | - ready 상태 표현: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-063 · L94–94 | - host start condition 표현: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-064 · L95–95 | - leave action: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-065 · L96–96 | - 다음 게임으로 전환되는 presentation: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Responsive Strategy

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-066 · L100–100 | - Desktop: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-067 · L101–101 | - Tablet: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-068 · L102–102 | - Mobile: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-069 · L103–103 | - 작은 높이 화면: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-070 · L104–104 | - 많은 카드/토큰을 수용하는 방식: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-071 · L105–105 | - touch / accessibility 고려: | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Implementation Plan

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-072 · L109–110 | &gt; 이 섹션은 소스 개발 시작 전에 수립한 최초 UI/presentation Phase와 구현 순서를 기록합니다. 개발 중 이 순서나 세부안이 변경되면 이 baseline을 지우거나 재작성하지 않고 `UI_DECISIONS.md`에 override 결정을 남깁니다.<br>&gt; 기능/DB/RPC 구현 순서는 `GAME_SPEC.md`, 실제 디자인 진행·변경 결정은 `UI_DECISIONS.md`, 기능 다음 작업은 `DEVELOPMENT.md / Next Work`에서 관리합니다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-073 · L112–112 | 1. &lt;Visual Identity / page frame&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-074 · L113–113 | 2. &lt;Lobby/setup&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-075 · L114–114 | 3. &lt;Gameplay core layout/components&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-076 · L115–115 | 4. &lt;Motion/interaction&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-077 · L116–116 | 5. &lt;Result/rematch&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-078 · L117–117 | 6. &lt;Responsive/polish&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-079 · L119–119 | 필요한 asset과 라이선스 확인 상태를 각 단계에 함께 기록합니다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Validation Checklist

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-080 · L123–123 | - &#91; &#93; 조사 출처와 목표 판본이 기록되어 있다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-081 · L124–124 | - &#91; &#93; 자산의 직접 사용 / 재구성 / 사용 금지 경계가 기록되어 있다. | 표현:금지 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-082 · L125–125 | - &#91; &#93; 게임 고유 Visual Identity가 정의되어 있다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-083 · L126–126 | - &#91; &#93; 일반 청파 같이 페이지와 구별되는 독립적인 game page identity가 있다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-084 · L127–127 | - &#91; &#93; lobby → gameplay → result/rematch가 하나의 디자인 언어를 유지한다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-085 · L128–128 | - &#91; &#93; 규칙 안내가 generic 문서 UI로 분리되지 않고 해당 게임의 Visual Identity와 정보 계층을 유지한다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-086 · L129–129 | - &#91; &#93; 규칙의 핵심 시각 예시는 실제 규칙과 일치하고, 장식 없이도 텍스트/semantic structure로 이해할 수 있다. | 표현:할 수 있다 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-087 · L130–130 | - &#91; &#93; 핵심 구성물과 action이 실제 게임의 플레이 감각을 전달한다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-088 · L131–131 | - &#91; &#93; animation timing이 authoritative state와 충돌하지 않는다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-089 · L132–132 | - &#91; &#93; desktop/mobile에서 핵심 정보와 action을 사용할 수 있다. | 표현:할 수 있다 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-090 · L133–133 | - &#91; &#93; 개발 시작 후 baseline에서 벗어난 의미 있는 디자인 결정·수동 리뷰 결과·검증 이력이 있다면 `UI_DECISIONS.md`가 이를 추적한다. | 표현:검증 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Open Questions / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-T-091 · L137–137 | - &lt;아직 확정하지 않은 디자인/asset/interaction 결정, 없으면 없음&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-T-092 · L138–138 | - runtime 개발 전에 확정된 내용은 이 baseline에 반영합니다. 개발 시작 후 확정되는 변경은 이 문서를 덮어쓰지 않고 `UI_DECISIONS.md`에 남깁니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

### UID-T — `games/UI_DECISIONS_TEMPLATE.md`

- source: [games/UI_DECISIONS_TEMPLATE.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/UI_DECISIONS_TEMPLATE.md)
- blob: `a8bedc2de5cb80de99c67044c071f3940b778248`; 원문 69줄; 상태 `TEMPLATE`; 39 관리단위 / 39 규칙·필드 단위.


#### <Game Title> UI Decisions

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UID-T-001 · L3–10 | &gt; 이 문서는 초기 `UI_DESIGN.md` baseline 이후 확정된 의미 있는 디자인 변경·의사결정·검증 이력을 보존하는 game-local 기록입니다.<br>&gt; `UI_DESIGN.md`는 소스 개발 전 수립한 초기 디자인 baseline입니다. 개발 시작 후 변경된 항목은 이 문서의 최신 non-superseded 결정이 우선하며, 현재 유효 디자인은 `UI_DESIGN.md + UI_DECISIONS.md overrides`로 해석합니다.<br>&gt; 기능 설계는 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.<br>&gt; 공통 UI 조사/설계 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.<br>&gt;<br>&gt; 모든 CSS 수치 변경이나 commit을 기록하지 않습니다. 이 문서의 핵심은 초기 `UI_DESIGN.md` 구현 이후 개발자가 실제 브라우저에서 확인하며 요청·확정한 의미 있는 디자인/interaction 수정과 그 이유를 보존하는 것입니다.<br>&gt; 계획대로 baseline을 구현한 사실은 decision으로 만들지 않고, baseline에서 벗어나기로 확정했거나 수동 디자인 리뷰에서 하나의 영역이 안정화된 경우에 기록합니다.<br>&gt; 플랫폼 문서 체계 변경, 브랜치 정리, 단순 구현 진행 자체처럼 게임 화면의 디자인 결정을 바꾸지 않는 메타 작업은 game-local Decision Log에 넣지 않습니다. | 표현:검증 | RULE / P | E-UI | D01, D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Current Design Track

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UID-T-002 · L14–14 | - Status: &lt;ACTIVE / PAUSED / FINAL / RELEASED&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-003 · L15–15 | - Lifecycle stage: &lt;BASELINE_IMPLEMENTATION / MANUAL_DESIGN_REVIEW / DESIGN_CLOSEOUT / RELEASED&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-004 · L16–16 | - Current UI phase / scope: &lt;현재 디자인 작업 범위&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-005 · L17–17 | - Active branch: &lt;branch or main&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-006 · L18–18 | - Last updated: &lt;YYYY-MM-DD&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-007 · L19–19 | - Initial design baseline: `UI_DESIGN.md` | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-008 · L20–20 | - Active overrides: &lt;현재 적용 중인 주요 Decision ID 또는 없음&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-009 · L21–21 | - Next design work: &lt;다음 UI 작업, 없으면 없음&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Decision Log > YYYY-MM-DD — <decision title>

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UID-T-010 · L27–27 | - Decision ID: &lt;UI-001&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-011 · L28–28 | - Applies to: &lt;UI_DESIGN Phase / component / layout / interaction&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-012 · L29–29 | - Supersedes: &lt;이전 Decision ID 또는 없음&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-013 · L30–30 | - Source: &lt;developer manual browser review / implementation constraint / responsive QA / other&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-014 · L31–31 | - Context / trigger: &lt;어떤 문제·피드백·관찰 때문에 결정이 필요했는지&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-015 · L32–32 | - Previous / alternatives: &lt;UI_DESIGN 초기안 또는 검토한 대안&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-016 · L33–33 | - Decision: &lt;최종 선택&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-017 · L34–34 | - Rationale: &lt;선택 이유와 중요 UX 원칙&gt; | 표현:원칙 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-018 · L35–35 | - Affected surfaces: &lt;page / lobby / board / component / motion / responsive 등&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-019 · L36–36 | - Implementation status: &lt;PLANNED / IN_PROGRESS / IMPLEMENTED / REVERTED / SUPERSEDED&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-020 · L37–37 | - Validation: &lt;브라우저/반응형/animation/사용성 확인 결과 또는 미확인&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-021 · L38–38 | - Baseline relation: &lt;UI_DESIGN.md 초기안을 유지 / 보정 / 대체 / 무관 중 하나&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-022 · L39–39 | - Related functional boundary: &lt;필요한 경우 GAME_SPEC.md 기능 규칙 참조&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-023 · L41–41 | &gt; 같은 결정을 뒤에서 바꾸더라도 과거 항목을 삭제하지 않습니다. 새 결정 항목을 추가하고 이전 항목은 `SUPERSEDED` 또는 `REVERTED`로 표시합니다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Recording Timing

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UID-T-024 · L45–45 | - 초기 `UI_DESIGN.md`를 그대로 구현한 내용은 기록하지 않습니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-025 · L46–46 | - baseline에서 의미 있게 벗어나는 방향이 확정되면 기록합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-026 · L47–47 | - 개발자 수동 브라우저 리뷰에서 같은 영역을 여러 번 미세 조정하는 중에는 매 요청마다 기록하지 않습니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-027 · L48–48 | - 해당 component/layout/interaction/motion 영역이 안정화되어 다음 영역으로 넘어갈 때 최종 결정을 하나로 정리합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-028 · L49–49 | - 디자인 Phase/detail-polish 범위 완료, 디자인 PR merge/close, 작업 브랜치 종료, release closeout 진입 전에는 기록 누락이 없는지 확인합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-029 · L50–50 | - 코드에만 남은 복원 가치가 있는 디자인 결정을 브랜치 정리와 함께 잃어버리지 않습니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-030 · L51–51 | - 사용자가 `디자인 체크포인트 기록하자`라고 요청하면 현재까지 안정화된 확정 decision을 이 문서에 즉시 정리합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | D03 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-031 · L52–52 | - 이 명령은 디자인 Phase 완료나 `FINAL`을 의미하지 않으며, lifecycle 기반 기록 타이밍도 별도로 계속 적용됩니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Superseded / Rejected

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UID-T-032 · L56–56 | - &lt;폐기된 큰 디자인 방향 또는 반복해서 다시 검토하면 안 되는 대안&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-033 · L57–57 | - 단순히 취향이 바뀌었다는 기록보다, 왜 폐기했는지와 어떤 문제가 있었는지를 남깁니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Validation History

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UID-T-034 · L61–61 | - &lt;YYYY-MM-DD — desktop / mobile / multi-browser / animation / accessibility 검증과 결과&gt; | 표현:검증 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-035 · L62–62 | - 기능/DB contract 검증은 `DEVELOPMENT.md`에 기록하고, 여기에는 디자인 품질·interaction·presentation 검증을 기록합니다. | 표현:검증 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Open Follow-up

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UID-T-036 · L66–66 | - &lt;아직 구현하지 않았거나 실제 브라우저에서 추가 확인이 필요한 UI 작업&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-037 · L67–67 | - &lt;미확정 asset/license/design detail&gt; | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-038 · L68–68 | - 후속 수정이 확정되면 `UI_DESIGN.md` baseline을 덮어쓰지 말고 Decision Log에 추가합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UID-T-039 · L69–69 | - 다음 UI Phase를 시작할 때는 관련 최신 non-superseded decision을 먼저 적용해 과거 설계안으로 회귀하지 않도록 합니다. | 템플릿 필드 | TEMPLATE_FIELD / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
### 전수 입력: games

고정 원표: [docs/game-platform-rebuild/artifacts/step-1-clauses-games.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-1-clauses-games.md) · blob `53d6c1e994b424c7142712f070bb00a37e6c4031`.





### CS-SPEC — `games/cant-stop/GAME_SPEC.md`

- source: [games/cant-stop/GAME_SPEC.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/GAME_SPEC.md)
- blob: `8c28edf2c84b351a7ddbc0504c37df2e79b962e4`; 원문 350줄; 상태 `GAME_LOCAL`; 236 관리단위 / 174 규칙·필드 단위.


#### Can't Stop Game Spec

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-001 · L3–6 | &gt; Phase 4에서 Game Platform을 처음 실제 신규 게임에 적용해 v1까지 출시한 기준 명세입니다.<br>&gt; bootstrap 당시의 설계 의도와 최종 구현 결정을 함께 보존하되, 현재 동작과 충돌하는 미완료 표현은 release 기준으로 갱신합니다.<br>&gt; UI/presentation은 같은 디렉터리의 `UI_DESIGN.md` adoption baseline과 이후 `UI_DECISIONS.md`의 최신 non-superseded 변경 결정을 함께 적용합니다.<br>&gt; 실제 기능 구현 진행과 검증 상태는 같은 디렉터리의 `DEVELOPMENT.md`에서 관리합니다. | 표현:검증 | LOCAL_RULE / L | E-CS | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Game Overview

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-002 · L10–10 | - Game id: `cant-stop` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-003 · L11–11 | - Designer: Sid Sackson | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-004 · L12–12 | - Players: 2–4명 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-005 · L13–13 | - Release status: v1 RELEASED (2026-09-21) | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-006 · L14–14 | - Platform status: first production `platform: "shared"` game, `online=true`, `invite=true` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-007 · L15–15 | - Core loop: 네 개의 주사위를 두 쌍으로 나눠 2–12 열을 전진하고, 현재 턴의 임시 진척을 확정할지 더 굴릴지 선택하는 push-your-luck 게임 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-008 · L16–16 | - Win condition: 서로 다른 세 개의 열을 먼저 claim한 플레이어가 승리 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-009 · L17–17 | - Board: 2–12의 11개 열 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | C02/F03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-010 · L18–18 | - Column heights: `2:3, 3:5, 4:7, 5:9, 6:11, 7:13, 8:11, 9:9, 10:7, 11:5, 12:3` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Rules and Sources

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-011 · L22–22 | 구현 기준은 다음 자료를 교차 확인한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-012 · L24–24 | - Can't Stop rulebook PDF: https://cdn.1j1ju.com/medias/d8/88/07-cant-stop-rulebook.pdf | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-013 · L25–25 | - Board Game Arena rules summary: https://boardgamearena.com/gamepanel?game=cantstop | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-014 · L26–26 | - BoardGameGeek game page: https://boardgamegeek.com/boardgame/41/cant-stop | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-015 · L27–27 | - Column length cross-check: https://en.wikipedia.org/wiki/Can%27t_Stop_%28board_game%29 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-016 · L29–29 | 현재 구현 기준으로 정리한 핵심 규칙: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-017 · L31–31 | 1. 턴 시작 시 최대 세 개의 neutral runner를 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-018 · L32–32 | 2. 네 개의 d6를 굴리고, 두 개씩 짝지은 두 합을 하나의 pairing으로 선택한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-019 · L33–33 | 3. 한 roll에는 최대 세 가지 pairing이 존재하며 같은 두 합을 만드는 중복 pairing은 하나의 선택지로 취급할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-020 · L34–34 | 4. 선택한 pairing의 각 합은 해당 열의 runner를 한 칸 전진시키거나, 빈 runner가 있으면 그 열에 새 runner를 놓는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-021 · L35–35 | 5. 새 runner는 해당 플레이어의 이전 permanent progress 바로 다음 칸에서 시작하며, 이전 진척이 없으면 열의 첫 칸에서 시작한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-022 · L36–36 | 6. 한 턴에 runner가 존재할 수 있는 열은 최대 세 개이며, 이미 세 열을 사용 중이면 새 열을 열 수 없다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-023 · L37–37 | 7. 선택한 pairing 안에서 합 하나만 합법적으로 움직일 수 있는 경우 한 번만 전진하는 것은 허용된다. 합법적인 이동을 임의로 버리지는 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-024 · L38–38 | 8. 두 합이 같은 열이면 같은 runner를 순차적으로 두 번 전진할 수 있다. 두 번째 이동 시점에 더 전진할 수 없다면 가능한 이동만 적용한다. | 표현:할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-025 · L39–39 | 9. 이미 claim된 열은 모든 플레이어에게 닫혀 있고 이후 roll의 합으로 사용할 수 없다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-026 · L40–40 | 10. runner가 열의 top에 도달한 뒤에도 플레이어는 더 굴릴 수 있지만 그 runner 자체는 더 전진할 수 없다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-027 · L41–41 | 11. 어떤 pairing으로도 runner를 하나 이상 합법적으로 전진/배치할 수 없으면 bust다. 해당 턴의 모든 임시 진척을 잃고 다음 플레이어로 넘어간다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-028 · L42–42 | 12. 성공적으로 이동한 뒤 플레이어는 다시 굴리거나 stop을 선택한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-029 · L43–43 | 13. stop하면 runner 위치를 자신의 permanent progress로 확정한다. top에 도달한 열은 그 시점에 claim되고 다른 플레이어의 해당 열 진척은 제거된다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-030 · L44–44 | 14. 세 번째 열을 claim한 stop 처리와 함께 게임이 종료된다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-031 · L45–45 | 15. 다른 플레이어의 permanent marker와 같은 칸을 공유하는 것은 허용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-032 · L47–47 | 청파 같이 구현에서는 사전 주사위로 선 플레이어를 정하지 않는다. 게임 시작 RPC가 서버에서 플레이어 순서를 한 번 무작위로 확정하고 authoritative game state에 저장한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Rules and Sources > Rules Audit — 2026-09-20

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-033 · L51–51 | 정식 기본 규칙과 pure JS rules engine, 운영 Supabase의 `private.cant_stop_legal_pairings` / `private.cant_stop_commit_stop` 계산을 대조했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-034 · L53–53 | 감사에서 확인한 엣지 케이스: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-035 · L55–55 | - runner 두 개 사용 중이고 남은 한 자리로 두 새 열 중 하나만 열 수 있을 때 두 single plan을 모두 허용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-036 · L56–56 | - runner 두 개 사용 중이며 기존 열 + 새 열을 함께 움직일 수 있으면 두 이동을 모두 강제 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-037 · L57–57 | - runner 세 개를 이미 사용 중이면 새 열은 막고 기존 runner 이동만 허용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-038 · L58–58 | - 한 합이 claim된 열이면 다른 합만 합법적으로 움직일 수 있을 때 single move 허용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-039 · L59–59 | - 같은 합 두 번에서 정상까지 한 칸만 남았으면 가능한 한 칸만 이동 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-040 · L60–60 | - runner가 이미 정상에 있어 더 못 움직여도 다른 합이 합법이면 다른 합 이동 허용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-041 · L61–61 | - 모든 가능한 합이 정상/runner 제한/claim으로 막히면 bust | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-042 · L62–62 | - 정상 도달은 즉시 claim이 아니며 stop 전 bust 시 해당 정상 도달도 소멸 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-043 · L63–63 | - 한 번의 stop에서 여러 열을 동시에 claim 가능 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-044 · L64–64 | - 기존 두 claim + 두 동시 claim처럼 세 개를 넘어도 `claimedCount &gt;= 3`으로 즉시 승리 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-045 · L65–65 | - claim 전에는 서로 다른 플레이어의 permanent marker가 같은 칸에 공존 가능 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-046 · L66–66 | - claim 시에만 다른 플레이어의 해당 열 progress 제거 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-047 · L68–68 | 감사 결과 core gameplay 규칙 차이는 발견되지 않았다. 정식 규칙서와 다른 의도적 digital adaptation은 **게임 시작 순서 결정**뿐이다. 규칙서는 선 플레이어를 별도 방식으로 정한 뒤 좌석 순서로 진행하지만, 청파 같이 버전은 온라인 좌석에 물리적 의미가 없으므로 서버가 전체 turn order를 한 번 무작위 확정하고 이후 그 순서를 순환한다. 이 차이는 pairing / runner / bust / stop / claim / 승리 규칙에는 영향을 주지 않는다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-048 · L70–70 | 사용자용 규칙은 `rulesHelp.js`의 상세 가이드를 로비와 실제 플레이 화면에서 modal로 제공한다. 처음 플레이하는 사용자가 외부 검색 없이 목표, 열 높이, 주사위 pairing, runner 제한, stop, bust, claim, 승리, 수동 종료까지 이해할 수 있는 수준을 유지한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Product Scope > Included

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-049 · L76–76 | - 2–4인 online multiplayer | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-050 · L77–77 | - 표준 2–12 / 11열 board | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-051 · L78–78 | - 네 개의 d6와 세 runner | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-052 · L79–79 | - pairing 선택 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-053 · L80–80 | - roll again / stop 흐름 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-054 · L81–81 | - bust | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-055 · L82–82 | - column claim | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-056 · L83–83 | - 세 열 claim 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-057 · L84–84 | - Approved Member 기반 Room/Lobby | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-058 · L85–85 | - authoritative snapshot / reconnect | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-059 · L86–86 | - online core 안정화 이후 platform-native Invite | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-060 · L87–87 | - 로비/플레이 중 상세 게임 규칙 modal | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-061 · L88–88 | - 방장 권한의 authoritative 수동 게임 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-062 · L89–89 | - 설산 등반 테마 보드, 2.5D 주사위 롤링, bust 미끄러짐 피드백 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Product Scope > Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-063 · L93–93 | - 고급 통계/확률 힌트 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-064 · L94–94 | - 관전자 모드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-065 · L95–95 | - turn timer | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-066 · L96–96 | - AI/bot | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-067 · L97–97 | - 변형 규칙 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-068 · L98–98 | - 랭킹/전적 시스템 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-069 · L99–99 | - 물리 엔진 기반 고급 3D 주사위/보드 연출 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Product Scope > Not planned for initial version

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-070 · L103–103 | - 원본 판본의 아트워크나 상표 디자인 복제 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-071 · L104–104 | - Legacy 게임 코드 재사용 또는 마이그레이션 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### State Machine

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-072 · L108–123 | ```text<br>LOBBY<br>→ TURN_ROLL<br>→ PAIRING_SELECTION<br>→ PUSH_OR_STOP<br>   ├─ roll again → TURN_ROLL<br>   └─ stop → COMMIT_PROGRESS<br>                ├─ winner → GAME_OVER<br>                └─ next player → TURN_ROLL<br><br>TURN_ROLL<br>└─ no legal pairing → BUST → next player → TURN_ROLL<br><br>TURN_ROLL / PAIRING_SELECTION / PUSH_OR_STOP<br>└─ host manual end → GAME_OVER(endReason = MANUAL, winnerId = null)<br>``` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-073 · L125–125 | - `TURN_ROLL`: 현재 플레이어만 roll intent를 보낼 수 있다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-074 · L126–126 | - `PAIRING_SELECTION`: 서버가 주사위 결과에서 계산한 legal pairing과 그 pairing에 속한 legal move plan만 선택 가능하다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-075 · L127–127 | - `PUSH_OR_STOP`: pairing 적용 이후 현재 플레이어가 다시 roll하거나 stop한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-076 · L128–128 | - `COMMIT_PROGRESS`: 임시 runner를 permanent progress로 확정하고 claim/win을 계산한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-077 · L129–129 | - `BUST`: 임시 진척을 폐기하고 permanent state는 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-078 · L130–130 | - `GAME_OVER`: 일반 gameplay action을 더 받지 않는다. 승리 종료 또는 방장 수동 종료 뒤 leave/rematch lifecycle로 이동한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Domain Model

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-079 · L134–134 | - `columns`: number, height, claimedBy | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-080 · L135–135 | - `players`: player id, 서버가 게임 시작 시 무작위로 확정한 turn order, column별 permanent progress, claimed columns | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-081 · L136–136 | - `turn`: activePlayerId, 최대 세 개의 runner positions, latest dice, legal pairings + legal move plans, phase | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-082 · L137–137 | - `game`: status, version, winnerId, endReason, endedById, turn index | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-083 · L139–139 | pairing은 주사위 인덱스 조합보다 최종 두 합을 canonical form으로 저장한다. 동일한 합 조합은 선택지에서 중복 제거하되, 같은 합 두 개는 `&#91;7, 7&#93;`처럼 두 번의 이동 가능성을 보존한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-084 · L141–141 | pairing 하나가 항상 하나의 이동 결과를 뜻하지는 않는다. neutral runner 자리가 하나만 남았는데 두 합이 모두 새 열인 경우처럼 두 합을 모두 사용할 수 없지만 각각 하나씩은 사용할 수 있다면, 해당 pairing은 `plans: &#91;&#91;sumA&#93;, &#91;sumB&#93;&#93;`처럼 여러 legal move plan을 가진다. 두 합을 모두 사용할 수 있다면 반드시 두 이동을 적용하는 plan만 허용한다. | 표현:반드시,할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-085 · L143–143 | 게임 규칙 계산은 pure deterministic function 중심으로 분리해 같은 입력 snapshot + action이 같은 결과를 만들게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Platform Boundary > SHARED 재사용

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-086 · L149–149 | - Game Registry | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-087 · L150–150 | - Approved Member / Access Gate | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-088 · L151–151 | - Room/Lobby adapter | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-089 · L152–152 | - Versioned / Idempotent Action envelope | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-090 · L153–153 | - Snapshot Coordinator | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-091 · L154–154 | - Reconnect refresh trigger | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-092 · L155–155 | - Common Game Shell / connection state / roster | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-093 · L156–156 | - platform-native `game_room` Invite | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-094 · L157–157 | - DB/Test Contract gate | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Platform Boundary > GAME-LOCAL 유지

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-095 · L161–161 | - 11개 column 구조와 높이 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | C02/F03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-096 · L162–162 | - 네 주사위 pairing 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-097 · L163–163 | - runner 최대 3개 규칙 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-098 · L164–164 | - legal pairing 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-099 · L165–165 | - roll / pairing / push / stop / bust 상태 머신 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-100 · L166–166 | - column claim과 승리 판정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-101 · L167–167 | - Can't Stop board UI와 주사위/runner 연출 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-102 · L169–169 | Can’t Stop 구현 편의를 위해 shared API에 pairing, dice, runner 같은 개념을 추가하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Authority and Persistence

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-103 · L173–173 | online version의 최종 권위는 서버 RPC와 DB state다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-104 · L175–175 | 서버가 최종 결정하는 항목: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-105 · L177–177 | - 방 생성/참가 시 표시할 플레이어 닉네임은 클라이언트 입력값이 아니라 사이트 `profiles.display_name`으로 확정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-106 · L178–178 | - 실제 주사위 네 개의 결과 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-107 · L179–179 | - 가능한 pairing 목록과 선택 유효성 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-108 · L180–180 | - runner 이동 가능 여부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-109 · L181–181 | - bust 여부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-110 · L182–182 | - stop commit | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-111 · L183–183 | - column claim | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-112 · L184–184 | - 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-113 · L185–185 | - 게임 시작 시 최초 turn order 무작위 확정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-114 · L186–186 | - turn 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-115 · L187–187 | - 방장 수동 게임 종료 권한과 terminal state | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-116 · L188–188 | - room/game version 증가 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-117 · L190–190 | 클라이언트는 `roll_dice`, `choose_pairing`, `continue_turn`, `stop_turn`, `end_game` 같은 intent만 보낸다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-118 · L192–192 | `roll_dice`는 클라이언트가 dice 값을 전달하지 않는다. 서버 RPC가 네 개의 d6를 생성하고 현재 authoritative `claimedColumns`, `runners`, `playerProgress`를 기준으로 legal pairing / legal move plan을 계산한다. legal pairing이 하나도 없으면 같은 transaction 안에서 bust 처리와 다음 turn 전환까지 수행한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-119 · L194–194 | `choose_pairing`은 클라이언트가 `sums`와 실제 적용할 `columns` plan을 선택해 보내되, 서버가 직전 roll snapshot에 저장한 `legalPairings&#91;&#93;.plans`와 정확히 일치하는 선택만 허용한다. 서버는 선택된 plan을 다시 simulation해 runner 위치를 계산하고 `PUSH_OR_STOP`으로 전환한다. 같은 `clientActionId`를 다른 pairing payload로 재사용하면 replay로 인정하지 않고 conflict로 거부한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-120 · L196–196 | `continue_turn`은 `PUSH_OR_STOP`에서 현재 runner를 그대로 유지하고 `latestDice`와 `legalPairings`만 초기화해 같은 active player의 `TURN_ROLL`로 돌아간다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-121 · L198–198 | `stop_turn`은 현재 runner 위치를 active player의 `playerProgress`에 commit한다. top에 도달한 runner는 해당 column을 claim하고 다른 플레이어의 같은 column progress를 삭제한다. active player의 claim이 세 개 이상이면 `GAME_OVER`와 `winnerId`를 기록하고, 아니면 runner/roll 상태를 비운 뒤 다음 player의 `TURN_ROLL`로 전환한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-122 · L200–200 | `end_game`은 진행 중 게임의 방장만 호출할 수 있다. 서버는 현재 room/version/member/host를 다시 검증하고 `GAME_OVER`, `winnerId = null`, `endReason = MANUAL`을 기록한다. 종료 뒤에는 기존 GAME_OVER leave/rematch 흐름을 그대로 재사용한다. | 표현:검증,할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-123 · L202–202 | state-changing action은 공통 envelope의 `expectedVersion`과 `clientActionId`를 사용한다. 동일 action 재전송은 두 번 적용되지 않아야 하고 같은 version을 기준으로 충돌하는 action은 하나만 authoritative commit되어야 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-124 · L204–204 | authoritative snapshot에는 보드, 모든 플레이어의 공개 진척, 현재 runner, 공개된 dice, 현재 phase, turn, claimed columns, winner와 `version`을 포함한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-125 · L206–206 | Can’t Stop에는 상대에게 숨겨야 하는 hand/role 같은 gameplay private state가 없다. DB/Test Contract의 private-state 시나리오는 "노출될 private gameplay state 자체가 없음"을 명시적으로 검증한다. | 표현:검증 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-126 · L208–208 | Realtime은 snapshot 교체 데이터가 아니라 invalidation 신호로만 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-127 · L210–210 | 클라이언트의 시각 연출은 authoritative snapshot을 변경하지 않는다. 주사위 roll이나 bust처럼 짧은 presentation이 필요한 경우 서버 응답 snapshot을 잠시 보류하고 기존 snapshot으로 애니메이션을 끝낸 뒤 최신 snapshot을 화면에 적용한다. 서버 결과 자체를 지연하거나 재계산하지 않으며, presentation 완료 후에는 항상 가장 최신 authoritative snapshot으로 수렴한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-128 · L212–212 | Room/Lobby foundation은 다음 game-local DB 객체를 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-129 · L214–214 | - `public.cant_stop_rooms`: room identity, host, status, max players, authoritative `version`, game state | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-130 · L215–215 | - `public.cant_stop_room_players`: room membership, seat, nickname, ready state | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-131 · L216–216 | - `public.cant_stop_room_actions`: `client_action_id` 기반 lobby action replay/idempotency 기록 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-132 · L217–217 | - public RPC: `cant_stop_create_room`, `cant_stop_join_room`, `cant_stop_join_room_by_invite`, `cant_stop_get_my_active_room`, `cant_stop_get_lobby_snapshot`, `cant_stop_set_ready`, `cant_stop_leave_room`, `cant_stop_start_game`, `cant_stop_roll_dice`, `cant_stop_choose_pairing`, `cant_stop_continue_turn`, `cant_stop_stop_turn`, `cant_stop_end_game`, `cant_stop_prepare_rematch` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-133 · L219–219 | 브라우저에는 위 테이블의 직접 쓰기 권한을 주지 않는다. 승인회원 RPC가 권한, membership, host, phase, expected version을 검증하고 room row lock 안에서 변경한다. `set_ready`와 `start_game`은 `client_action_id`를 기록해 재전송 시 같은 authoritative snapshot을 반환한다. | 표현:승인,검증 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-134 · L221–221 | Realtime은 `cant_stop_rooms`와 `cant_stop_room_players` 변경만 invalidation으로 구독하고, 실제 렌더 상태는 `cant_stop_get_lobby_snapshot` 또는 후속 authoritative snapshot RPC로 다시 읽는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### UI / UX Direction

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-135 · L225–225 | - Common Game Shell로 제목, 방 정보, 연결 상태, roster, 공통 action 영역을 제공한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-136 · L226–226 | - 메인 영역은 2–12 열이 산 형태로 올라가는 Can't Stop 전용 board로 구성하고, 상용판 아트를 복제하지 않은 고유 설산/빙설 테마를 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-137 · L227–227 | - permanent progress와 현재 턴의 temporary runner를 시각적으로 구분한다. 최대 4명의 player는 seat별 고유 고대비 색상을 사용해 검은 track 위에서도 말의 소유자를 빠르게 구분할 수 있게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-138 · L228–228 | - 현재 roll의 네 주사위와 가능한 pairing 선택지는 보드 위에 삽입하지 않고 오른쪽 sidebar의 전용 dice/route panel에서 함께 보여준다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-139 · L229–229 | - dice/route panel은 게임 phase가 바뀌어도 높이를 유지해 board playfield가 위아래로 흔들리지 않게 한다. 플레이 중에는 별도 현재 턴 정보 카드를 두지 않고 이 패널이 sidebar 정보 영역을 주로 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-140 · L230–230 | - 플레이어 roster는 대기 중의 준비 상태를 게임 시작 후 `게임 중`으로 전환하고, 연결이 끊기면 `연결 끊김`을 표시한다. active player는 고유 player color의 `현재 턴` badge와 card accent로 강조한다. 각 player card에는 현재 차지한 열 수를 `완주 N/3`으로 함께 표시한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-141 · L231–231 | - pairing 선택 시 실제 네 주사위가 어떤 두 쌍으로 묶여 각 열의 합을 만드는지 mini-dice → column number 형태로 설명하고, 서버가 허용한 legal move plan만 선택 버튼으로 노출한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-142 · L232–232 | - 주사위는 오른쪽 sidebar 하단의 전용 2.5D dice stage에서 굴러가는 움직임을 보여주며 최종 숫자는 authoritative server snapshot만 표시한다. 주사위 눈금은 폰트 glyph에 의존하지 않고 3×3 pip face로 그려 작은 화면에서도 값이 즉시 읽혀야 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-143 · L233–233 | - 턴의 첫 roll에는 `주사위 굴리기` 하나만 노출한다. pairing 이동 이후 PUSH OR STOP에서는 같은 dice card 안에 왼쪽 `주사위 굴리기`, 오른쪽 `멈추기`를 나란히 배치한다. 어느 단계에서든 roll 요청이 진행 중이면 두 버튼을 숨기고 폭 전체의 비활성 `주사위 굴리는 중…` 버튼 하나만 보여 layout clipping을 방지한다. 계속 굴리기는 client에서 authoritative `continue_turn` 결과 version을 사용해 곧바로 `roll_dice`를 이어 호출하되 중간 TURN_ROLL snapshot은 화면에 노출하지 않아 한 번의 사용자 클릭/한 번의 roll presentation으로 진행한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-144 · L234–234 | - dice roll에는 짧은 clatter 효과음을, bust에는 눈보라/바람 효과음을 Web Audio로 제공한다. 효과음 재생 실패는 게임 진행을 막지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-145 · L235–235 | - legal pairing이 하나만 존재해도 자동 적용하지 않고 active player가 이동 plan을 명시적으로 선택한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-146 · L236–236 | - temporary runner와 permanent progress는 서로 다른 marker 스타일로 표시하고 claimed column은 완주자를 함께 표시한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-147 · L237–237 | - `한 번 더 굴리기`와 `여기서 멈추기`를 turn의 핵심 선택으로 강조한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-148 · L238–238 | - bust 시 runner가 산 정상 기준 좌우 경사 방향으로 미끄러지고, 말 주변의 눈가루와 짧은 눈사태/powder 연출을 함께 보여줘 설산 등반 실패의 재미를 강화한다. 눈보라 전경 입자는 선형 streak가 아니라 크기가 다른 둥근 눈덩이/눈가루 particle로 표현한다. 눈/runner 연출 자체는 짧게 끝내되 결과 안내 카드는 보드 중앙에서 약 4초 유지해 사용자가 내용을 읽을 시간을 보장한다. actor의 local RPC 응답과 다른 player의 Realtime refresh 모두 동일한 bust presentation을 끝까지 보여준 뒤 다음 snapshot으로 전환한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-149 · L239–239 | - 로비/플레이 중 언제든 상세 규칙 modal을 열 수 있다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-150 · L240–240 | - 진행 중 방장은 확인 dialog를 거쳐 전체 게임을 수동 종료할 수 있고, 종료 결과는 모든 클라이언트의 authoritative GAME_OVER snapshot으로 동기화한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-151 · L241–241 | - 모바일에서는 11개 열 전체 판독성을 우선하고 과도한 3D/카메라 조작은 초기 버전에서 사용하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | C02/F03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-152 · L242–242 | - 원본 상용판의 보드/말 그래픽은 복제하지 않고 청파 같이 고유 시각 디자인을 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-153 · L243–243 | - online entry는 방 만들기 또는 6자리 코드 참가로 시작하며, waiting room에서 준비 상태와 방장 시작 조건을 명확히 보여준다. | 표현:조건 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-154 · L244–244 | - entry lobby에는 닉네임 입력/변경 UI를 두지 않는다. 로그인한 승인회원의 사이트 프로필 닉네임을 그대로 사용하며 닉네임 변경과 중복 검사는 마이페이지의 공통 프로필 흐름에서만 수행한다. | 표현:승인 | LOCAL_RULE / L | E-CS | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-155 · L245–245 | - entry 화면은 정상 연결 상태 카드를 별도로 노출하지 않고 새 방 만들기 / 코드 참가 두 행동에 집중한다. 규칙 보기는 오른쪽 온라인 플레이 안내 카드 하단에 둔다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-156 · L246–246 | - waiting room은 별도 준비 카드 대신 실제 게임 보드를 미리 보여주며, 보드 phase card에 `게임 준비 중`과 전원 준비 안내를 표시한다. 오른쪽은 profile avatar 기반 player roster와 방 안내/ready-start controls를 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-157 · L247–247 | - player roster는 사이트 공개 프로필의 avatar를 사용하고 avatar가 없거나 서명 URL을 얻지 못하면 사이트 공통 `assets/images/default-avatar.svg`를 사용한다. waiting에서 ready player는 seat accent를 활용한 card background로 구분한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-158 · L248–248 | - desktop gameplay board mountain은 900px 기준으로 확대하고 right sidebar를 같은 grid row에 stretch해 dice/route card 하단과 board 영역 하단이 일렬로 맞도록 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-159 · L249–249 | - gameplay의 규칙/새로고침/게임 종료 같은 utility action은 하단 sticky footer가 아니라 player roster와 dice stage 사이의 compact sidebar toolbar에 둔다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-160 · L250–250 | - waiting/playing room에서는 manual refresh 중 Common Shell connection status card를 별도로 생성하지 않는다. 오류는 기존 inline error presentation으로 전달한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-161 · L251–251 | - GAME_OVER에서는 새로고침 utility를 숨기고 규칙/재대결/방 나가기만 보여 compact toolbar 높이가 불필요하게 늘어나지 않게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-162 · L252–252 | - 진행 중 비방장 플레이어는 자신의 턴에서만 방 나가기를 실행할 수 있다. 3~4인 게임에서 이탈 후 2명 이상이 남으면 서버는 이탈자를 turnOrder/playerProgress/claimedColumns에서 제거하고 해당 턴 runners/latestDice/legalPairings를 초기화한 뒤 남은 순서의 다음 플레이어에게 TURN_ROLL을 넘긴다. | 표현:할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-163 · L253–253 | - 2인 게임에서 비방장이 자신의 턴에 나가면 이탈 자체는 허용하되 게임을 즉시 `GAME_OVER`로 종료한다. 승자는 지정하지 않고 `endReason = PLAYER_LEFT`와 `endedById`를 기록하며, 남은 방장은 재대결을 눌러 1인 waiting room으로 돌아간 뒤 새 플레이어가 참가해야 다시 시작할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-164 · L254–254 | - 진행 중 방장은 방 나가기 대신 게임 종료를 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-165 · L255–255 | - 진행 중 gameplay utility toolbar는 현재 버튼 수에 맞춰 동일 폭 column으로 채우며 빈 가로 여백을 남기지 않는다. 방장은 `게임 종료`, 일반 플레이어는 `방 나가기`를 본다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-166 · L256–256 | - 일반 플레이어의 진행 중 방 나가기는 자신의 턴에서만 허용한다. 3명 이상일 때는 남은 플레이어가 2명 이상이면 게임을 계속하고, 정확히 2명일 때 비방장이 나가면 게임을 종료한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-167 · L257–257 | - 진행 중 이탈이 성공하면 해당 플레이어를 active room membership / turn order / player progress에서 제거하고, 해당 플레이어 소유 claim과 현재 runner를 제거한다. 2명 이상 남으면 다음 플레이어의 `TURN_ROLL`로 정규화하고, 1명만 남으면 `PLAYER_LEFT` GAME_OVER로 정규화한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-168 · L258–258 | - 방장은 진행 중 방 나가기를 사용하지 않고 host-only `게임 종료` 흐름을 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-169 · L259–259 | - action validation 오류는 board 안의 inline error card로 레이아웃을 밀지 않고 3초 뒤 자동으로 닫히는 transient modal로 표시한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-170 · L260–260 | - Game Shell patch 시 entry/waiting/playing state class를 기존 shell root에도 동기화해 waiting ready tint와 gameplay 900px board override가 실제 DOM에 즉시 적용되게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-171 · L261–261 | - host manual-end confirmation dialog는 alpine sky/mountain/number marker visual language를 재사용하고 계속 플레이/게임 종료 선택을 명확한 bordered controls로 구분한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-172 · L262–262 | - Room/Lobby Realtime은 화면 상태를 직접 덮어쓰지 않고 authoritative snapshot refresh만 유도한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-173 · L263–263 | - 소스의 online 흐름 구현과 운영 activation은 분리한다. v1에서는 production migration·RLS/grant/RPC 권한·관련 회귀 검증을 확인한 뒤 Registry `online`/`invite`와 게임 목록 노출을 별도 activation 단계에서 활성화했다. 사람 중심 다중 브라우저 exploratory playtest는 자동 검증을 대체하지 않으며, release blocker가 없고 잔여 UX 위험을 문서화한 경우 post-release 관찰로 이어갈 수 있다. | 표현:검증 | LOCAL_RULE / L | E-CS | D09 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Implementation Plan — v1 Completed

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-174 · L267–267 | 아래 순서는 v1에서 모두 구현·검증 완료했다. 후속 버전은 이 순서를 다시 수행하는 것이 아니라 변경 범위에 해당하는 계약과 회귀만 재검증한다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-175 · L269–269 | 1. pure game-local rules engine | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-176 · L270–270 · 부모 LEGACY-CS-SPEC-175 |    - column constants | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-177 · L271–271 · 부모 LEGACY-CS-SPEC-175 |    - four-dice pairing enumeration/deduplication | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-178 · L272–272 · 부모 LEGACY-CS-SPEC-175 |    - legal move 계산 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-179 · L273–273 · 부모 LEGACY-CS-SPEC-175 |    - runner movement | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-180 · L274–274 · 부모 LEGACY-CS-SPEC-175 |    - bust / stop / claim / win | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-181 · L275–275 · 부모 LEGACY-CS-SPEC-175 |    - unit tests | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-182 · L276–276 | 2. 첫 runtime slice | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-183 · L277–277 · 부모 LEGACY-CS-SPEC-182 |    - Game Registry 등록 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-184 · L278–278 · 부모 LEGACY-CS-SPEC-182 |    - Access Gate | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-185 · L279–279 · 부모 LEGACY-CS-SPEC-182 |    - Common Game Shell 기반 최소 board | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-186 · L280–280 | 3. online room foundation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-187 · L281–281 · 부모 LEGACY-CS-SPEC-186 |    - game-specific schema/RPC | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-188 · L282–282 · 부모 LEGACY-CS-SPEC-186 |    - Room/Lobby adapter | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-189 · L283–283 · 부모 LEGACY-CS-SPEC-186 |    - approved member/host 권한 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-190 · L284–284 | 4. authoritative gameplay actions | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-191 · L285–285 · 부모 LEGACY-CS-SPEC-190 |    - server dice roll | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-192 · L286–286 · 부모 LEGACY-CS-SPEC-190 |    - `choose_pairing` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-193 · L287–287 · 부모 LEGACY-CS-SPEC-190 |    - `stop_turn` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-194 · L288–288 · 부모 LEGACY-CS-SPEC-190 |    - version/idempotency/concurrency | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-195 · L289–289 | 5. DB/Test Contract 10개 시나리오 적용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | C02/F03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-196 · L290–290 | 6. snapshot + Realtime invalidation + reconnect | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | D06 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-197 · L291–291 | 7. multiplayer UI와 game-specific animations | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-198 · L292–292 | 8. platform-native Invite | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-199 · L293–293 | 9. 멀티클라이언트 / reconnect / stale action 회귀 검증 | 표현:검증 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-200 · L295–295 | shared 계약으로 표현되지 않는 요구가 나오면 먼저 game-local로 해결 가능한지 확인한다. 여러 미래 게임에서도 동일한 플랫폼 책임으로 반복되는 경우에만 shared 변경을 계약 테스트와 문서와 함께 수행한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Validation Plan > Rules

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-201 · L301–301 | - 4 dice의 세 pairing 생성과 중복 제거 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-202 · L302–302 | - 동일 합 두 번 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-203 · L303–303 | - runner 0/1/2/3개 사용 상태 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-204 · L304–304 | - 세 runner 사용 후 새 열 차단 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-205 · L305–305 | - closed column 차단 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-206 · L306–306 | - top runner 추가 이동 차단 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-207 · L307–307 | - 한 pairing에서 한 이동만 가능한 경우 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-208 · L308–308 | - legal pairing 없음 → bust | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-209 · L309–309 | - bust 시 permanent progress 불변 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-210 · L310–310 | - stop 시 runner commit | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-211 · L311–311 | - top에서 stop → claim | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-212 · L312–312 | - claim된 열의 타 플레이어 진척 제거 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-213 · L313–313 | - 세 번째 claim → game over | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Validation Plan > Platform

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-214 · L317–317 | - Game Registry / capability | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-215 · L318–318 | - Access Gate | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-216 · L319–319 | - Room/Lobby adapter | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-217 · L320–320 | - snapshot stale version 거부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-218 · L321–321 | - reconnect refresh | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-219 · L322–322 | - idempotent action | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-220 · L323–323 | - DB/Test Contract 10개 시나리오 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | C02/F03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Validation Plan > Multiplayer regression

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-221 · L327–327 | - 2/3/4인 turn order | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-222 · L328–328 | - 서로 같은 칸/열 progress | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-223 · L329–329 | - player A action이 B/C client에 snapshot으로 반영 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-224 · L330–330 | - 연속 roll 중 reconnect 후 runner 복원 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-225 · L331–331 | - stop/claim 직전 stale client action 거부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-226 · L332–332 | - bust 직후 reconnect 상태 일치 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Open Questions / Deferred > Resolved in v1

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-227 · L338–338 | - GAME_OVER 이후 leave/rematch lifecycle을 구현했다. 모든 player는 종료 후 방을 나갈 수 있고, host는 같은 room을 waiting으로 되돌려 기존 active members / seats / room code를 유지한 채 재대결 준비를 시작할 수 있다. | 표현:할 수 있다 | LOCAL_CONTEXT / I | E-CS | D07 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-228 · L339–339 | - 진행 중 non-host leave 정책을 확정했다. 자신의 턴에만 이탈 가능하며 3~4인에서는 2명 이상 남으면 계속 진행하고, 2인에서 한 명이 나가면 승자 없는 `PLAYER_LEFT` GAME_OVER로 종료한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-229 · L340–340 | - Invite는 shared `game_room` 계약과 사이트 공용 invite infrastructure를 사용하며, 최종 참가 권한은 `cant_stop_join_room_by_invite`가 서버에서 token을 다시 검증해 결정한다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-230 · L341–341 | - production migration과 권한/회귀 검증 후 Registry `online=true`, `invite=true`와 사이트 게임 목록 노출을 활성화했다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | D09 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-231 · L342–342 | - 정상 connected gameplay에서는 상단 연결 상태 카드를 숨기고 reconnect/error일 때만 필요한 연결 정보를 노출한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-SPEC-232 · L343–343 | - gameplay phase card, PUSH OR STOP action, bust 결과 카드 등 v1 presentation 기준을 확정했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Open Questions / Deferred > Post-release Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-SPEC-233 · L347–347 | - 설산/2.5D 주사위/bust 연출의 속도·크기·강도는 실제 사용자 플레이 피드백이 누적되면 v1.1 이후 조정할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-234 · L348–348 | - Web Audio 기반 remote bust 사운드는 브라우저 autoplay 정책 영향을 받으므로 실사용 관찰 대상으로 남긴다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-235 · L349–349 | - `local` / `presence` capability는 v1 제품 범위가 아니며 필요성이 생기기 전까지 false로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-SPEC-236 · L350–350 | - Can’t Stop에서 편리했던 game-local 규칙이나 UI를 한 사례만 보고 shared 계약으로 승격하지 않는다. 두 번째 이후 platform-native 게임에서도 같은 플랫폼 책임이 반복될 때 Game Platform 규칙과 계약 테스트를 확장한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### CS-DEV — `games/cant-stop/DEVELOPMENT.md`

- source: [games/cant-stop/DEVELOPMENT.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/DEVELOPMENT.md)
- blob: `de9c2774e43b3646402edbf5785d9580df6e86e6`; 원문 199줄; 상태 `GAME_LOCAL`; 169 관리단위 / 35 규칙·필드 단위.


#### Can't Stop Development

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-001 · L3–4 | &gt; 현재 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다.<br>&gt; 게임 규칙과 기능 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다. UI/presentation은 `UI_DESIGN.md` adoption baseline과 `UI_DECISIONS.md`의 최신 non-superseded override를 함께 적용합니다. 이 문서의 기존 UI 관련 항목은 과거 release 이력으로 보존하되 이후 세부 UI 이력은 `UI_DECISIONS.md`에 기록합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | D04 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Current Status

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-002 · L8–8 | - Phase: Phase 4 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-003 · L9–9 | - Status: RELEASED | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-004 · L10–10 | - Active branch: main | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-005 · L11–11 | - Last checkpoint: 2026-09-26 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Release Baseline

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-006 · L15–15 | - v1 source of truth는 `main`이며 2026-09-26 post-release multiplayer feedback 보강까지 PR #400으로 main에 반영됐다. 현재 기준 merge commit은 `3cf189708f88d4634cd7878476ea4e6fdb0e75f9`이다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-007 · L16–16 | - Game Registry는 `platform: "shared"`, `online=true`, `invite=true`, `local=false`, `presence=false` 상태다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-008 · L17–17 | - 사이트 게임 목록에서 Can’t Stop을 정식 노출하고 `./games/cant-stop/` 경로로 진입한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-009 · L18–18 | - 운영 Supabase에는 v1에 필요한 room/gameplay/invite/manual-end/profile-nickname/active-leave/2-player leave migration이 적용되어 있다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-010 · L19–19 | - 이후 Can’t Stop 변경은 과거 Phase 4 브랜치를 재사용하지 않고 최신 `main`에서 새 `fix/*` 또는 `feature/*` 브랜치를 만든다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Completed

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-011 · L23–23 | - 2026-09-26 post-release multiplayer feedback checkpoint: 다른 플레이어의 authoritative dice result도 동일한 rolling presentation cycle을 거쳐 보이도록 동기화했고, Realtime invalidation에서 `PUSH_OR_STOP → continue → roll → bust`가 중간 snapshot 없이 합쳐져 도착하는 경우에도 모든 클라이언트가 같은 bust presentation을 재생하도록 보강했다. 정상 stop 및 player leave와는 구분하며 bust 결과에는 실제 미끄러진 플레이어 이름을 표시한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-012 · L24–24 | - 2026-09-26 gameplay ownership/result feedback checkpoint: pairing plan hover/focus의 보드 이동 preview, player-color HUD/말 badge, permanent progress 1/2/3인 분할 색상, claimed column의 소유자 색상 표현을 반영했다. 이 항목들의 시각적 세부 결정은 `UI_DECISIONS.md` CS-UI-003이 책임진다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-013 · L25–25 | - 2026-09-26 GAME_OVER result checkpoint: 세 번째 column claim으로 실제 승리가 확정되는 순간 승자 본인을 포함한 방의 모든 플레이어에게 summit victory presentation을 재생한다. 이미 종료된 방으로 reconnect한 경우, host manual end, `PLAYER_LEFT` 종료에는 재생하지 않으며 authoritative winner/claim state나 rematch lifecycle은 변경하지 않는다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-014 · L26–26 | - 위 post-release 변경은 PR #400으로 main에 병합 완료했다. core rules, DB/RPC, Supabase migration, Registry capability, shared Game Shell 계약은 변경하지 않았다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-015 · L27–27 | - 2026-09-23 BGM polish: page entry/entry/waiting/rematch waiting에는 `Frozen Star`, authoritative `PLAYING` 상태에는 `Mountain Emperor`를 적용했다. 기존 공통 BGM Player와 저장 volume/pause 정책을 재사용하고 dice/blizzard Web Audio SFX는 분리 유지했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-016 · L28–28 | - 2026-09-22 Game Platform UI 규칙 도입에 맞춰 현재 v1의 Visual Identity, page/lobby/gameplay/result-rematch presentation 기준을 `UI_DESIGN.md`에 소급 문서화했다. runtime 동작은 변경하지 않았다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-017 · L29–29 | - 최신 Game Platform 규칙과 shared 계약을 확인했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-018 · L30–30 | - 당시 신규 게임 초기 세팅에 `GAME_SPEC.md`를 의무화하는 bootstrap 규칙 방향을 확정했다. 이후 플랫폼 규칙은 `GAME_SPEC.md` + `DEVELOPMENT.md` + `UI_DESIGN.md` + `UI_DECISIONS.md` 4문서 bootstrap으로 발전했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-019 · L31–31 | - Can't Stop 원본 규칙을 여러 공개 규칙 자료로 교차 확인했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-020 · L32–32 | - 2–12 column, four-dice pairing, three-runner, push/stop, bust, claim, three-column win 규칙을 구현 기준으로 정리했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-021 · L33–33 | - Game Platform의 SHARED 책임과 Can't Stop GAME-LOCAL 책임을 분리했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-022 · L34–34 | - online authoritative action / snapshot / reconnect / DB contract 적용 계획을 작성했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-023 · L35–35 | - 당시 Game Platform Governance Guard에 `GAME_SPEC.md` 필수 섹션 검증과 문서-only bootstrap 상태를 추가했다. 현재 Governance는 `UI_DESIGN.md` 필수 섹션까지 함께 검증한다. | 표현:검증,필수 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-024 · L36–36 | - 신규 game directory에 runtime 파일이 추가되는 순간 Registry가 필요하도록 회귀 테스트를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-025 · L37–37 | - deterministic rules engine을 추가해 2–12 column, dice pairing, runner 이동, bust, stop, claim, win을 game-local로 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-026 · L38–38 | - pairing만으로 이동이 하나로 결정되지 않는 경우를 legal move plan으로 표현하도록 규칙 모델을 고정했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-027 · L39–39 | - server-random turn order를 rules engine 입력으로 받고 client-local randomness는 사용하지 않도록 했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-028 · L40–40 | - rules engine 초기 구현 단계에서는 Game Registry에 `cant-stop`을 `platform: "shared"`로 등록하되 미구현 capability를 false로 유지했고, v1 release에서 검증된 `online`/`invite`만 true로 활성화했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-029 · L41–41 | - rules engine 핵심 경계 13개 unit test를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-030 · L42–42 | - 기존 사이트 auth source를 Game Platform Access Gate에 연결해 로그인/승인회원 접근 경계를 적용했다. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-031 · L43–43 | - 승인회원에게 Common Game Shell과 현재 사용자 roster를 표시하는 최소 runtime을 추가했다. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-032 · L44–44 | - rules engine의 2–12 column 높이를 재사용하는 11열 보드 골격을 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-033 · L45–45 | - 미승인/비로그인 사용자는 각각 승인 상태/로그인 화면으로 안내하고 gameplay shell은 렌더링하지 않는다. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-034 · L46–46 | - Room/Lobby 구현 전 단계에서는 Registry capability를 선행 활성화하지 않았고, 실제 Room/Lobby·DB 계약이 연결된 뒤에도 production 검증 전까지 비활성 상태를 유지했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-035 · L47–47 | - runtime model 및 실제 `app.js` syntax/index wiring 검증 테스트를 추가했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-036 · L48–48 | - Can’t Stop 전용 `cant_stop_rooms`, `cant_stop_room_players`, `cant_stop_room_actions` DB foundation을 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-037 · L49–49 | - 승인회원 전용 create/join/snapshot/ready/leave/start RPC와 명시적 RLS/grant 경계를 추가했다. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-038 · L50–50 | - room row lock + `expected_version`으로 충돌을 직렬화하고, `client_action_id` action replay로 ready/start 재전송 idempotency를 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-039 · L51–51 | - 게임 시작 시 서버가 turn order를 무작위로 확정해 authoritative `game_state`에 저장하도록 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-040 · L52–52 | - `createCantStopRoomLobbyAdapter`를 Shared `defineRoomLobbyAdapter` 계약에 연결하고 Realtime Postgres Changes를 invalidation 신호로만 사용하도록 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-041 · L53–53 | - Game DB integration harness가 Can’t Stop migration을 disposable Supabase에 replay하도록 확장했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-042 · L54–54 | - 당시 `tests/game-db-integration/cant-stop.test.js`에 플랫폼 필수 10개 DB 시나리오를 등록했다. 이후 공통 계약에 same-room rematch가 추가되어 현재는 11개 필수 시나리오를 구현한다. | 표현:필수 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-043 · L55–55 | - 기존 DB integration workflow에 `supabase/cant-stop/**/*.sql` 경로만 추가했으며 별도 workflow는 만들지 않았다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-044 · L56–56 | - 승인회원 runtime에 방 만들기 / 코드 참가 / 준비 / 준비 취소 / 방장 시작 / 나가기 사용자 흐름을 연결했다. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-045 · L57–57 | - authoritative lobby snapshot을 Common Game Shell roster와 room label에 연결했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-046 · L58–58 | - Shared Snapshot Coordinator를 lobby에도 적용해 Realtime payload는 invalidation으로만 소비하고 RPC snapshot을 다시 읽도록 했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-047 · L59–59 | - online/pageshow/visibility 복귀 시 authoritative lobby snapshot을 다시 불러오도록 reconnect refresh trigger를 연결했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-048 · L60–60 | - 게임 시작 snapshot을 받으면 서버 확정 turn order 상태를 유지한 채 기존 보드 골격 화면으로 전환한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-049 · L61–61 | - gameplay 구현 단계에서는 운영 Supabase migration과 Registry 활성화를 분리해 진행했고, production migration·권한 검증 후 별도 activation 단계에서 `online`/`invite`와 게임 목록 노출을 켰다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-050 · L62–62 | - authoritative gameplay 첫 slice로 `cant_stop_roll_dice` RPC를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-051 · L63–63 | - 클라이언트는 dice 값을 전달하지 않고 room/version/action id intent만 보내며 서버가 4d6를 생성한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-052 · L64–64 | - 서버가 현재 claimed column / runner / permanent progress를 기준으로 legal pairing과 legal move plan을 계산한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-053 · L65–65 | - 첫 roll SQL 결과를 JS rules engine `enumeratePairings()`와 대조하는 DB parity 검증을 추가했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-054 · L66–66 | - 동일 `client_action_id` roll 재전송은 최초 dice/pairing snapshot을 그대로 반환하며 version을 다시 증가시키지 않는다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-055 · L67–67 | - non-active player roll과 stale version roll을 서버에서 거부하도록 검증했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-056 · L68–68 | - game start state에 플레이어별 permanent progress를 위한 `playerProgress` authoritative 필드를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-057 · L69–69 | - gameplay client adapter `createCantStopGameplayAdapter`를 추가했으며 client가 임의 dice/random 값을 전달하지 못하는 계약 테스트를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-058 · L70–70 | - authoritative `cant_stop_choose_pairing` RPC를 추가해 서버 snapshot의 `legalPairings&#91;&#93;.plans`에 존재하는 선택만 허용한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-059 · L71–71 | - 선택된 legal move plan을 서버 `cant_stop_simulate_plan`으로 다시 계산해 authoritative `runners`에 반영하고 phase를 `PUSH_OR_STOP`으로 전환한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-060 · L72–72 | - `choose_pairing`도 room row lock + `expected_version` + `client_action_id` replay 계약을 적용했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-061 · L73–73 | - pairing action에는 `request_payload`를 기록해 같은 action id를 다른 sums/plan으로 재사용하면 `ACTION_ID_CONFLICT`로 거부한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-062 · L74–74 | - gameplay adapter에 `choosePairing()`을 추가하고 sums 2개 / plan 1~2개 / 2~12 범위를 client shape 경계에서 검증한다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-063 · L75–75 | - disposable Supabase 테스트에 JS rules engine `applyPairingChoice()`와 서버 runner 결과 parity, illegal choice 무변경, stale/non-active 거부, replay payload conflict 검증을 추가했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-064 · L76–76 | - authoritative `cant_stop_continue_turn` RPC를 추가해 `PUSH_OR_STOP`에서 runner는 유지하고 dice/pairing만 지운 뒤 같은 플레이어의 `TURN_ROLL`로 복귀하도록 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-065 · L77–77 | - authoritative `cant_stop_stop_turn` RPC를 추가해 runner를 active player의 permanent progress로 commit하고 다음 플레이어로 넘기도록 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-066 · L78–78 | - stop 시 top runner는 column claim으로 확정하고 다른 플레이어의 해당 column progress를 제거하도록 구현했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-067 · L79–79 | - stop 결과 active player의 claimed column이 3개 이상이면 `GAME_OVER`와 `winnerId`를 authoritative state에 기록한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-068 · L80–80 | - continue/stop 모두 room row lock + `expected_version` + `client_action_id` idempotency 계약을 적용했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-069 · L81–81 | - 같은 `PUSH_OR_STOP` version에 continue/stop이 동시에 들어오면 하나만 commit되고 다른 하나는 `VERSION_CONFLICT`가 되도록 DB regression을 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-070 · L82–82 | - gameplay adapter에 `continueTurn()`, `stopTurn()` intent를 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-071 · L83–83 | - disposable Supabase fixture를 사용해 JS `continueTurn()/stopTurn()` parity, permanent progress commit, claim, 상대 progress 제거, 3번째 claim 승리를 결정적으로 검증한다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-072 · L84–84 | - gameplay adapter를 기존 lobby controller에 주입해 `rollDice / choosePairing / continueTurn / stopTurn`을 같은 busy/error/snapshot 흐름으로 연결했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-073 · L85–85 | - authoritative gameplay view model을 추가해 UI가 규칙을 다시 계산하지 않고 server snapshot의 dice, legal pairings, runners, permanent progress, claims, winner를 렌더링하게 했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-074 · L86–86 | - 실제 board에 네 주사위, legal pairing/plan 선택, temporary runner, player별 permanent marker, claimed column을 표시한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-075 · L87–87 | - `TURN_ROLL`에서는 active player에게 서버 주사위 굴리기, `PUSH_OR_STOP`에서는 한 번 더 굴리기/멈추기 action을 노출한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-076 · L88–88 | - `GAME_OVER`에서는 authoritative winner와 최종 claim 상태를 표시한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-077 · L89–89 | - legal pairing이 하나만 있어도 자동 commit하지 않고 사용자가 명시적으로 이동 plan 버튼을 눌러 확정하도록 초기 UX를 고정했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-078 · L90–90 | - runtime/controller 단위 테스트에 gameplay view mapping과 versioned gameplay command wiring을 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-079 · L91–91 | - GAME_OVER 상태에서만 `cant_stop_leave_room`을 허용하도록 확장해 종료 후 active membership을 해제할 수 있게 했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-080 · L92–92 | - 방장 전용 `cant_stop_prepare_rematch` RPC를 추가해 같은 room code / active members / seats를 유지한 채 room을 `waiting`으로 되돌리고 game state를 초기화한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-081 · L93–93 | - 재대결 준비 시 방장만 ready=true, 나머지 active player는 ready=false로 초기화하고 기존 ready/start flow를 그대로 재사용한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-082 · L94–94 | - GAME_OVER에서 방장이 나가면 기존 seat 순서 기준 다음 player에게 host를 승계하고, 새 host가 재대결 준비를 수행할 수 있게 했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-083 · L95–95 | - 재대결 준비 시 room expiry를 8시간 연장한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-084 · L96–96 | - GAME_OVER UI에서 방장에게 `같은 방에서 재대결`, 모든 player에게 `방 나가기` action을 노출한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-085 · L97–97 | - disposable Supabase 테스트에 GAME_OVER leave 후 새 방 생성, rematch reset/restart, active-game guard, host-only rematch, host succession을 추가했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-086 · L98–98 | - 멀티클라이언트/reconnect 검증에서 GAME_OVER → rematch lobby → 재접속 → 재시작, host leave → host succession → 재접속 흐름을 추가 검증했고 DB integration run #116까지 통과했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-087 · L99–99 | - platform-native Invite용 `createCantStopInviteAdapter`를 추가해 공용 `game_room` envelope과 Registry capability guard를 재사용한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-088 · L100–100 | - Invite 공유는 사이트 공용 `site_invite_create` + `inviteShare` 링크/QR UI를 그대로 사용하도록 연결했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-089 · L101–101 | - 초대 진입은 `?invite=&lt;token&gt;`을 다시 resolve하고 expected game id를 검증한 뒤 Can’t Stop 서버 참가 RPC로 넘긴다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-090 · L102–102 | - `cant_stop_join_room_by_invite` RPC는 서버에서 같은 token을 다시 `site_invite_resolve`하고 target type / game id / platform version / room id를 재검증한 뒤에만 waiting room 참가를 허용한다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-091 · L103–103 | - revoked/mismatched invite 및 server/client room parity를 테스트로 고정했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-092 · L104–104 | - Invite 소스 구현 단계에서는 Registry `online/invite` capability를 비활성으로 유지했고, production migration과 권한/회귀 검증이 끝난 v1 activation에서 두 capability를 활성화했다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Current Work

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-093 · L108–108 | - Can’t Stop v1 기능 개발, 규칙 감사, 운영 DB 반영, Game Registry 활성화, 게임 목록 노출과 2026-09-26 post-release multiplayer feedback 보강까지 main에 반영 완료했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | D09, U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-094 · L109–109 | - Can’t Stop 자체는 유지보수 단계다. 현재 진행 중인 필수 기능 작업이나 기능 blocker는 없다. | 표현:필수 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-095 · L110–110 | - 이번 checkpoint의 기능 기준점은 PR #400 merge 이후 main이며, 후속 기능 수정은 종료된 작업 브랜치를 재사용하지 않고 최신 main에서 새 브랜치로 시작한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-096 · L111–111 | - Can’t Stop에서 얻은 첫 platform-native 실전 피드백은 Game Platform 규칙/거버넌스에 환류하며, 이후 게임에서 공통성이 다시 검증될 때 shared 계약을 확장한다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Next Work

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-097 · L115–115 | - 필수 기능 후속 작업은 없다. 새 기능/버그가 발견될 때 최신 main에서 별도 maintenance 브랜치로 진행한다. | 표현:필수 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-098 · L116–116 | - 2~4인 다중 브라우저 exploratory playtest는 자동 회귀 검증과 별개인 post-release 관찰 항목으로 계속 수행할 수 있다. | 표현:검증,할 수 있다 | LOCAL_RULE / L | E-CS | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-099 · L117–117 | - 실제 플레이에서 `Frozen Star` → `Mountain Emperor` 전환 체감과 BGM/SFX 상대 음량, remote bust audio의 브라우저 autoplay 제약을 관찰하고 필요할 때 game-local polish로 조정한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-100 · L118–118 | - summit victory presentation의 motion 강도·card 크기·완주 column token 가독성은 기능 blocker가 아니라 `UI_DECISIONS.md`의 디자인 follow-up으로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-101 · L119–119 | - core rules / server-authoritative contract / production migrations는 v1 release baseline으로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decisions

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-102 · L123–123 | - BGM은 Game Platform shared contract로 올리지 않고 site-level `js/game-audio/` utility를 game-local presentation에서 소비한다. entry/waiting/rematch waiting은 `Frozen Star`, authoritative room `playing`은 `Mountain Emperor`로 고정한다. 사용자 pause는 상태 전환보다 우선한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-103 · L124–124 | - 공식 로드맵 단계명은 `Phase 4`를 사용하며 임의의 `Phase 4A`를 만들지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-104 · L125–125 | - Can’t Stop은 기존 게임을 복사하지 않고 `games/cant-stop/`에서 처음부터 platform-native로 개발한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-105 · L126–126 | - bootstrap 당시에는 `GAME_SPEC.md`와 `DEVELOPMENT.md`만 두는 기준을 사용했으나, 현재 신규 게임 공통 기준은 `GAME_SPEC.md` + `DEVELOPMENT.md` + `UI_DESIGN.md` + `UI_DECISIONS.md` 네 문서다. Can't Stop의 `UI_DESIGN.md`는 v1 release 시점 baseline을 소급 문서화했고, 이후 디자인 변경은 `UI_DECISIONS.md`에 남긴다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D01 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-106 · L127–127 | - game-specific dice/pairing/runner 규칙은 `games/shared/`로 올리지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-107 · L128–128 | - online gameplay의 주사위 결과와 상태 전이는 최종적으로 서버가 authoritative하게 결정한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-108 · L129–129 | - 첫 플레이어는 사전 주사위 없이 게임 시작 RPC가 서버에서 turn order를 무작위로 한 번 확정하고 authoritative state에 저장하는 방식으로 결정한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-109 · L130–130 | - pairing에서 두 합을 모두 사용할 수 있으면 두 이동을 모두 적용해야 하며, 둘 다 쓸 수 없지만 각각 하나씩 가능한 경우에는 legal move plan으로 어느 한 합을 사용할지 명시적으로 선택한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-110 · L131–131 | - Game Registry 등록 시점에는 아직 실제 제공하지 않는 capability를 선행 선언하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-111 · L132–132 | - 최소 runtime은 기존 청파 같이 auth module을 직접 재구현하지 않고 Shared Access Gate adapter로 소비한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-112 · L133–133 | - Common Game Shell은 공통 header/status/roster/layout까지만 담당하고 11열 보드 표현은 Can’t Stop GAME-LOCAL로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-113 · L134–134 | - Room/Lobby DB는 공통 gameplay 테이블을 만들지 않고 `cant_stop_*` namespace를 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-114 · L135–135 | - 브라우저는 room/player 테이블을 직접 수정하지 않고 승인회원 RPC만 호출한다. | 표현:승인 | LOCAL_RULE / L | E-CS | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-115 · L136–136 | - Realtime payload는 최종 truth로 사용하지 않고 room/player 변경을 snapshot refresh invalidation으로만 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-116 · L137–137 | - Registry `online` capability는 소스 구현만으로 활성화하지 않고 운영 Supabase migration과 배포 smoke test까지 완료된 시점에 true로 전환한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D09, U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-117 · L138–138 | - lobby Realtime payload는 상태 자체로 렌더링하지 않고 Shared Snapshot Coordinator refresh trigger로만 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-118 · L139–139 | - 방 생성/참가/ready/start/leave 결과는 모두 RPC가 반환한 authoritative snapshot을 기준으로 렌더링한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-119 · L140–140 | - `choose_pairing`은 client가 임의 이동을 제안하는 API가 아니라 서버가 이미 발행한 legal pairing + legal move plan 중 하나를 선택하는 intent다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-120 · L141–141 | - idempotency key가 같아도 action payload가 달라지면 같은 요청으로 간주하지 않고 conflict로 거부한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-121 · L142–142 | - `continue_turn`은 현재 turn의 runner를 유지하고 공개된 dice/pairing만 초기화한 뒤 같은 active player가 다시 roll하게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-122 · L143–143 | - `stop_turn`은 runner 위치를 permanent progress로 commit한 뒤 claim/win을 계산하며 승자가 없으면 다음 player의 `TURN_ROLL`로 넘긴다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-123 · L144–144 | - 3번째 claim 승리 시 room status는 당장 닫지 않고 `game.phase = GAME_OVER`를 authoritative final state로 유지해 reconnect가 최종 결과를 복구할 수 있게 한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-124 · L145–145 | - gameplay UI는 authoritative snapshot을 표시할 뿐 dice/pairing/runner 결과를 client에서 재계산해 truth로 사용하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-125 · L146–146 | - legal pairing이 정확히 하나여도 자동 적용하지 않고 active player가 명시적으로 plan을 선택해 commit한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-126 · L147–147 | - 재대결은 즉시 새 게임을 강제 시작하지 않고 GAME_OVER room을 waiting으로 되돌린 뒤 기존 ready/start 계약을 다시 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-127 · L148–148 | - 진행 중 비방장 플레이어는 자신의 턴에 방 나가기가 가능하다. 3~4인 게임은 2명 이상 남으면 계속 진행하고, 2인 게임의 비방장 이탈은 승자 없이 `PLAYER_LEFT` GAME_OVER로 종료한다. 진행 중 방장은 게임 종료 흐름을 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-128 · L149–149 | - Invite는 반드시 shared `game_room` 계약을 사용하고 game-local target type을 새로 만들지 않는다. | 표현:반드시 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-129 · L150–150 | - client invite resolve는 라우팅/UX 검증이고 최종 room 참가 권한은 서버 `cant_stop_join_room_by_invite`가 token을 다시 검증해 결정한다. | 표현:검증 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-130 · L151–151 | - Invite 소스가 구현되어도 Registry `online/invite` capability는 운영 migration + smoke test가 끝날 때까지 false로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D09, U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-DEV-131 · L152–152 | - 게임 로비의 닉네임 입력/변경 UI는 제거하고 사이트 프로필 닉네임을 사용한다. Can’t Stop DB는 room player nickname 저장 시 `profiles.display_name`을 강제해 client override를 authoritative 값으로 사용하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Validation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-132 · L156–156 | - 2026-09-26 PR #400 `feat: refine Can't Stop shared gameplay feedback` main 병합 완료. merge commit: `3cf189708f88d4634cd7878476ea4e6fdb0e75f9`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-133 · L157–157 | - PR #400 최종 head `aada948809dab290cbd4fc71266a637cae3f82df` 기준 Game Platform governance run #598 SUCCESS: JavaScript syntax, shared-module link check, `npm run test:game-platform`, Governance Guard 모두 통과했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-134 · L158–158 | - multiplayer feedback 회귀에는 remote continue-and-roll bust 복원, 정상 stop의 bust 오인 방지, active-player leave의 bust 오인 방지, bust actor 이름 표시, winner 포함 all-client victory-event 조건을 포함한다. | 표현:조건 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-135 · L159–159 | - 상태별 BGM catalog / controller track switching / Can’t Stop mode mapping 자동 회귀 테스트를 추가했다. 최종 CI 결과는 이 PR 검증 후 갱신한다. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-136 · L160–160 | - PR #327 최종 기능 브랜치: Game Platform Governance / Site static checks / Game DB integration SUCCESS 후 main 병합 완료. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-137 · L161–161 | - 규칙 감사: JS rules engine + 운영 Supabase legal pairing/stop 계산 + 정식 기본 규칙을 대조했고 core gameplay 차이 없음. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-138 · L162–162 | - active leave 회귀: 4→3, 3→2 계속 진행 / 2→1 PLAYER_LEFT GAME_OVER / out-of-turn leave 거부 / active host leave 거부 / 이탈자 progress·claim·runner 정리 / replacement 재대결 재시작 검증 완료. | 표현:검증 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-139 · L163–163 | - production migration 검증: profile nickname authority, active-turn leave, two-player leave GAME_OVER 함수/권한/제약 확인 완료. | 표현:검증 | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-140 · L164–164 | - PR #331 activation: Game Platform Governance SUCCESS, Site static checks SUCCESS, Community E2E smoke SUCCESS, Community authenticated E2E SUCCESS. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-141 · L165–165 | - PR #331 merge commit: `9225b3a22b4170f3f183de7915a9cc2edbf8f1a3`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-142 · L166–166 | - PR #332에서 RELEASED 상태의 최종 인수인계 문서를 main에 반영했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-143 · L167–167 | - 게임 목록 카드 정렬/설명 UI 후속 PR #334~#336은 Site static checks / Community E2E smoke / Community authenticated E2E를 통과한 뒤 main에 반영됐다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Known Issues / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-144 · L171–171 | - v1 출시를 막는 known issue는 현재 없다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-145 · L172–172 | - 실제 다중 브라우저 live smoke는 자동 회귀 검증과 별개로 사용자 관점에서 한 번 더 수행하면 좋다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-146 · L173–173 | - Web Audio 기반 remote bust 사운드는 브라우저 autoplay 정책에 따라 해당 탭에서 사용자 상호작용 전에는 재생되지 않을 수 있다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-147 · L174–174 | - Supabase security/performance advisor에는 프로젝트 전체에 이미 존재하던 경고가 남아 있다. 이번 Can’t Stop migration으로 anon EXECUTE가 새로 노출된 것은 확인되지 않았다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-148 · L175–175 | - Can’t Stop Registry capability는 현재 `online=true`, `invite=true`, `local=false`, `presence=false`다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Release — 2026-09-21

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-DEV-149 · L179–179 | - PR #327을 main에 병합했다. merge commit: `0fa282901d5be8b0d1bdb0d25beba7d5d4764a7e`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-150 · L180–180 | - 운영 Supabase에 Can’t Stop room/gameplay/manual-end/profile-nickname/active-leave/2-player leave GAME_OVER migration까지 반영했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-151 · L181–181 | - production migration history: | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-152 · L182–182 · 부모 LEGACY-CS-DEV-151 |   - `20260919140250 cant_stop_manual_end` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-153 · L183–183 · 부모 LEGACY-CS-DEV-151 |   - `20260920143502 cant_stop_profile_nickname` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-154 · L184–184 · 부모 LEGACY-CS-DEV-151 |   - `20260920143513 cant_stop_active_turn_leave` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-155 · L185–185 · 부모 LEGACY-CS-DEV-151 |   - `20260920150002 cant_stop_two_player_leave_game_over` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-156 · L186–186 | - 2인 게임에서 비방장이 자신의 턴에 나가면 승자 없이 `PLAYER_LEFT` GAME_OVER가 되고, 남은 방장은 재대결을 눌러 1인 waiting room으로 돌아간 뒤 새 플레이어 참가 후 다시 시작한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-157 · L187–187 | - PR #331에서 Game Registry `online=true`, `invite=true`를 활성화하고 사이트 게임 목록에 Can’t Stop 카드를 노출했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-158 · L188–188 | - PR #331은 main에 병합 완료했다. merge commit: `9225b3a22b4170f3f183de7915a9cc2edbf8f1a3`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-159 · L189–189 | - 공용 `game_room` invite entry가 Registry의 Can’t Stop 경로를 통해 `./games/cant-stop/?invite=...`로 연결된다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-160 · L190–190 | - v1 기준 사용자 흐름: | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-161 · L191–191 · 부모 LEGACY-CS-DEV-160 |   - 승인회원 + 사이트 프로필 닉네임으로 방 생성/코드 참가/초대 참가 | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-162 · L192–192 · 부모 LEGACY-CS-DEV-160 |   - waiting board preview + profile avatar + ready tint + host start | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-163 · L193–193 · 부모 LEGACY-CS-DEV-160 |   - server-random turn order, server-generated 4d6, authoritative pairing/runner/progress/claim | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-164 · L194–194 · 부모 LEGACY-CS-DEV-160 |   - push/stop, 4초 bust presentation, Web Audio dice/blizzard sound | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-165 · L195–195 · 부모 LEGACY-CS-DEV-160 |   - host manual game end, non-host own-turn leave, reconnect/snapshot recovery | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-166 · L196–196 · 부모 LEGACY-CS-DEV-160 |   - GAME_OVER rematch / leave | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-167 · L197–197 | - 규칙 감사 결과 기본 Can’t Stop 규칙과 core gameplay 구현은 일치하며, 의도적 digital adaptation은 시작 순서를 서버 랜덤 turn order로 정하는 부분이다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-168 · L198–198 | - release closeout 시점에 Can’t Stop 관련 개발/임시 브랜치를 정리했고 최종 기준 브랜치를 `main`으로 고정했다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-DEV-169 · L199–199 | - Can’t Stop은 Game Platform의 첫 production platform-native 기준 사례이며, 이 구현에서 확인한 release/document/feedback 규칙을 공통 플랫폼 규칙으로 환류한다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### CS-UI — `games/cant-stop/UI_DESIGN.md`

- source: [games/cant-stop/UI_DESIGN.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/UI_DESIGN.md)
- blob: `4127eb5129923725e1e2c2b1c8a4b7ea87f7bcfe`; 원문 118줄; 상태 `ADOPTION_BASELINE`; 74 관리단위 / 57 규칙·필드 단위.


#### Can't Stop UI Design

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-001 · L3–6 | &gt; 이 문서는 UI_DESIGN/UI_DECISIONS 체계 도입 전에 이미 release된 Can't Stop v1의 production 상태를 소급 정리한 **adoption baseline**입니다. 신규 게임의 pre-development baseline 사례로 사용하지 않습니다.<br>&gt; 플랫폼 공통 기준은 `docs/game-platform-ui-rules.md`, 기능 규칙은 `GAME_SPEC.md`, 이 baseline 이후 디자인 수정·결정·검증과 override는 `UI_DECISIONS.md`, 기능 구현 진행은 `DEVELOPMENT.md`에서 관리합니다.<br>&gt;<br>&gt; v1 RELEASED 이후 UI Design 규칙을 도입하면서 기존 구현을 소급 문서화한 baseline이며, 이후 후속 디자인 변경은 이 문서를 덮어쓰지 않고 `UI_DECISIONS.md`에 누적합니다. | 표현:검증 | LOCAL_RULE / L | E-CS | D04, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Design Research

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-002 · L10–10 | - Target edition / visual baseline: 원본 gameplay의 산악 등반 메타포를 기능적으로 재해석한 청파 같이 v1 설산 등반 테마 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-003 · L11–11 | - Official / rules sources: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-004 · L12–12 · 부모 LEGACY-CS-UI-003 |   - Can't Stop rulebook PDF: https://cdn.1j1ju.com/medias/d8/88/07-cant-stop-rulebook.pdf | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-005 · L13–13 · 부모 LEGACY-CS-UI-003 |   - Board Game Arena: https://boardgamearena.com/gamepanel?game=cantstop | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-006 · L14–14 · 부모 LEGACY-CS-UI-003 |   - BoardGameGeek: https://boardgamegeek.com/boardgame/41/cant-stop | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-007 · L15–15 | - Additional reference: 실제 2–12 column 구조와 push-your-luck 진행을 원본 규칙과 교차 확인 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-008 · L16–16 | - 조사/구현 대상 구성물: 2–12 열, neutral runner, player marker, 네 개의 d6, claim 상태 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-009 · L17–17 | - 핵심 관찰: 숫자 열의 높낮이와 정상 도달이 시각적으로 즉시 읽혀야 하며, push/stop/bust의 위험감이 핵심입니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-010 · L18–18 | - Last reviewed: 2026-09-22 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Copyright / Asset Usage

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-011 · L22–22 | - Directly usable: 자체 제작한 설산 board SVG/CSS, 자체 제작 dice/marker presentation | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-012 · L23–23 | - Recreate / reinterpret: 등반/정상 메타포와 열 구조를 독자적인 설산 테마로 재구성 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-013 · L24–24 | - Do not use directly: 사용 허가가 확인되지 않은 원본 판본의 artwork, 로고, 제품 이미지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-014 · L25–25 | - License / attribution notes: v1은 원본 artwork/상표 디자인 복제를 제품 범위에서 제외합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Visual Identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-015 · L29–29 | - Primary color: 설산/빙설 board의 차가운 자연 계열 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-016 · L30–30 | - Secondary color: column과 board depth를 구분하는 중립 계열 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-017 · L31–31 | - Accent color: active runner, claim, 위험/성공 상태 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-018 · L32–32 | - Background color: 게임 보드가 독립적으로 떠 보이는 어두운/중립 game frame | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-019 · L33–33 | - Typography direction: column 번호와 진행 상태를 빠르게 읽을 수 있는 명확한 숫자 우선 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-020 · L34–34 | - Symbols / patterns: 산, 정상, 눈/빙판, 등반 marker | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-021 · L35–35 | - Material / texture: 2.5D board와 주사위가 물리 구성물처럼 느껴지는 깊이 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-022 · L36–36 | - Visual keywords: 설산, 등반, push-your-luck, 정상, 미끄러짐 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Page Identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-023 · L40–40 | - entry/lobby/gameplay이 일반 사이트 카드 모음처럼 보이지 않고 하나의 설산 게임 공간으로 이어집니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-024 · L41–41 | - 공통 Game Shell을 사용하더라도 board와 player presentation은 game-local 테마를 우선합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-025 · L42–42 | - reconnect/error 상태도 보드 맥락을 유지하면서 명확한 시스템 상태를 전달합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Lobby / Setup Design

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-026 · L46–46 | - 플랫폼 공통 room/ready/host start 구조를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-027 · L47–47 | - 게임 시작 전 2–12 board preview와 플레이어 identity가 같은 설산 디자인 언어로 보입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-028 · L48–48 | - 규칙 modal에서 pairing, runner, stop, bust, claim을 시각적으로 이해할 수 있게 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-029 · L49–49 | - invite/room code는 기능적으로 명확하되 board presentation과 경쟁하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Gameplay Layout

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-030 · L53–53 | - 2–12의 11개 column이 중앙 보드의 최우선 정보입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-031 · L54–54 | - 각 column의 높이, runner, permanent progress, claim 상태를 같은 좌표계에서 읽습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-032 · L55–55 | - 네 개의 주사위와 legal pairing action은 board를 가리지 않는 action zone에 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-033 · L56–56 | - player state와 active turn은 board 진행 상태를 해치지 않는 보조 계층으로 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Components

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-034 · L60–60 | - Cards: 해당 없음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-035 · L61–61 | - Chips / tokens: runner/permanent marker/claim marker를 역할별로 구분 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-036 · L62–62 | - Dice / pieces: 2.5D dice rolling과 결과 숫자의 가독성을 함께 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-037 · L63–63 | - Player panel: 프로필, 차례, claim 상태를 간결하게 표시 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-038 · L64–64 | - Buttons: roll / pairing / push / stop의 위험과 우선순위를 구분 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-039 · L65–65 | - Modal / dialog: 규칙/수동 종료 확인을 game-local frame 안에서 표시 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-040 · L66–66 | - Status / event message: bust, claim, salary가 아닌 게임 핵심 이벤트를 보드 위 presentation으로 전달 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-041 · L67–67 | - Result component: 승자와 세 column claim 상태를 보드 맥락에서 보여줌 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Motion / Interaction

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-042 · L71–71 | - dice roll: 결과가 확정된 뒤 물리적으로 굴러 정착하는 느낌을 제공 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-043 · L72–72 | - runner move: 선택 pairing에 따라 어떤 column이 이동했는지 추적 가능해야 함 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-044 · L73–73 | - bust: 임시 progress가 사라지는 위험을 미끄러짐/후퇴 presentation으로 전달 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-045 · L74–74 | - claim: 정상 도달 후 stop commit에서 확정되는 순서를 명확히 표현 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-046 · L75–75 | - turn transition: action presentation이 끝난 뒤 다음 플레이어 강조 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-047 · L76–76 | - timing 원칙: authoritative 결과와 presentation 순서를 분리하되 서로 모순되지 않게 함 | 표현:원칙 | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-048 · L77–77 | - server-authoritative state와 presentation의 동기화 기준: UI는 snapshot 결과를 설명하고 client-local 계산을 truth로 사용하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-049 · L78–78 | - sound: dice/bust Web Audio SFX는 game-local 효과음으로 유지한다. BGM은 page entry·entry·waiting·rematch waiting에서 `Frozen Star`, authoritative room status가 `playing`인 gameplay/GAME_OVER에서 `Mountain Emperor`를 사용한다. 상태 전환은 presentation-only이며 서버 snapshot truth를 변경하지 않는다. Player pause/저장 volume은 track 전환에서도 유지하고 브라우저 autoplay 제한을 따른다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Result / Rematch Presentation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-050 · L82–82 | - winner와 claim된 세 column을 명확히 보여줍니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-051 · L83–83 | - GAME_OVER 이후 동일 room/player context를 유지한 rematch 준비로 전환합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D07, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-052 · L84–84 | - ready 상태와 host start 가능 조건을 lobby visual language로 다시 표시합니다. | 표현:조건 | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-053 · L85–85 | - host succession이나 player leave가 발생해도 authoritative snapshot을 기준으로 UI를 복구합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Responsive Strategy

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-054 · L89–89 | - Desktop: 11개 column 전체와 dice/action zone을 한눈에 보는 것을 우선합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-055 · L90–90 | - Tablet: board 비율을 유지하면서 player panel 밀도를 낮춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-056 · L91–91 | - Mobile: board의 column 가독성을 먼저 보존하고 secondary roster/action을 접거나 재배치합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-057 · L92–92 | - 작은 높이 화면: dice/action panel이 board를 과도하게 가리지 않게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-058 · L93–93 | - 많은 marker: player별 marker가 같은 칸에 공존할 수 있는 규칙을 표현할 수 있어야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-059 · L94–94 | - touch / accessibility: pairing/stop 등 핵심 선택을 hover 없이 실행할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Implementation Plan

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-060 · L98–98 | 1. 현재 v1 설산 Visual Identity와 자체 asset을 baseline으로 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-061 · L99–99 | 2. 후속 변경 시 board/dice/runner hierarchy가 실제 규칙 이해를 더 돕는지 우선 검토합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-062 · L100–100 | 3. motion 변경은 roll → pairing → runner → push/stop → bust/claim 순서를 해치지 않게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-063 · L101–101 | 4. result/rematch와 lobby 복귀가 같은 game identity 안에서 이어지는지 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-064 · L102–102 | 5. 실제 다중 브라우저와 mobile에서 board/action 가독성을 검증합니다. | 표현:검증 | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Validation Checklist

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-065 · L106–106 | - &#91;x&#93; 원본 gameplay 구조를 독자적인 설산 테마로 재해석했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-066 · L107–107 | - &#91;x&#93; 원본 artwork/상표 디자인의 직접 복제를 제품 범위에서 제외했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-067 · L108–108 | - &#91;x&#93; 일반 사이트와 구별되는 game-local board identity가 있다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-068 · L109–109 | - &#91;x&#93; dice, runner, permanent progress, claim을 구분할 수 있다. | 표현:할 수 있다 | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-069 · L110–110 | - &#91;x&#93; GAME_OVER → rematch lobby 흐름이 존재한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-070 · L111–111 | - &#91;x&#93; 설산 대기 분위기(`Frozen Star`)와 실제 등반 gameplay(`Mountain Emperor`)를 상태별 BGM으로 구분하고 rematch waiting에서 대기 음악으로 복귀한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-071 · L112–112 | - &#91; &#93; 후속 exploratory playtest에서 다양한 mobile 높이의 board/action 밀도를 계속 관찰한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UI-072 · L113–113 | - &#91; &#93; 브라우저 autoplay 정책에 따른 remote sound 경험을 계속 관찰한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Open Questions / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UI-073 · L117–117 | - 물리 엔진 기반 고급 3D 주사위/보드 연출은 현재 v1 scope 밖입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UI-074 · L118–118 | - v1 release baseline을 변경하는 UI polish는 별도 유지보수 PR에서 진행합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### CS-UID — `games/cant-stop/UI_DECISIONS.md`

- source: [games/cant-stop/UI_DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/cant-stop/UI_DECISIONS.md)
- blob: `c77ed6c6acf69888dec8510711c7aa850a424948`; 원문 130줄; 상태 `GAME_LOCAL`; 101 관리단위 / 39 규칙·필드 단위.


#### Can't Stop UI Decisions

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-001 · L3–7 | &gt; 이 문서는 Can't Stop의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.<br>&gt; `UI_DESIGN.md`는 규칙 체계 도입 시점의 Can't Stop v1 **adoption baseline**입니다. 이후 확정된 이 문서의 최신 non-superseded 결정이 같은 항목에서는 우선하며, 현재 유효 디자인은 baseline + decision overrides로 해석합니다. 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.<br>&gt; 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.<br>&gt;<br>&gt; 이 문서 체계 도입 이전의 모든 UI 변경사를 소급해 꾸며내지 않습니다. 현재 release baseline은 `UI_DESIGN.md`와 main runtime을 기준으로 하며, 이후 의미 있는 디자인 결정부터 이 문서에 누적합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Current Design Track

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-002 · L11–11 | - Status: IN_PROGRESS | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-003 · L12–12 | - Lifecycle stage: DEVELOPER_MANUAL_DESIGN_REVIEW | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-004 · L13–13 | - Current UI phase / scope: CS-UI-003 post-release gameplay feedback가 main에 반영된 상태이며 summit victory celebration의 최종 수동 리뷰만 follow-up으로 남아 있음 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-005 · L14–14 | - Active branch: main | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-006 · L15–15 | - Last updated: 2026-09-26 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-007 · L16–16 | - Adoption baseline: `UI_DESIGN.md` (v1 release state) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-008 · L17–17 | - Active overrides: CS-UI-001, CS-UI-002, CS-UI-003 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-009 · L18–18 | - Last checkpoint: PR #400 merge commit `3cf189708f88d4634cd7878476ea4e6fdb0e75f9` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-010 · L19–19 | - Next design work: summit victory celebration 실제 브라우저 motion 강도, 중앙 card 크기, 3개 summit token 가독성을 수동 리뷰하고 필요할 때 detail polish. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Decision Log > 2026-09-23 — Alpine Rules Guide

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-011 · L25–25 | - Decision ID: CS-UI-001 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-012 · L26–26 | - Applies to: rules/help modal, Visual Identity, rules presentation, responsive dialog | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-013 · L27–27 | - Supersedes: 없음 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-014 · L28–28 | - Source: developer manual browser review + Game Platform Rules Guide Presentation experiment | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-015 · L29–29 | - Context / trigger: v1 규칙 modal은 설산 계열 색상은 사용했지만 긴 텍스트 카드 중심이어서, 처음 플레이하는 사용자가 pairing, runner, push/stop, bust, win 같은 핵심 메커니즘을 게임 구성물과 연결해 이해하기 어려웠습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-016 · L30–30 | - Previous / alternatives: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-017 · L31–31 · 부모 LEGACY-CS-UID-016 |   - 기존 compact text-section modal 유지 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-018 · L32–32 · 부모 LEGACY-CS-UID-016 |   - No Thanks! 규칙 modal의 카드/칩 구조를 재사용 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-019 · L33–33 · 부모 LEGACY-CS-UID-016 |   - Can’t Stop 고유 구성물과 설산 메타포로 새로 설계 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-020 · L34–34 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-021 · L35–35 · 부모 LEGACY-CS-UID-020 |   - 규칙 modal을 `MOUNTAIN GUIDE · HOW TO PLAY` 콘셉트의 alpine play guide로 재구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-022 · L36–36 · 부모 LEGACY-CS-UID-020 |   - 기존 v1의 설산, 4개 주사위, runner, 2–12 mountain columns, push-your-luck 언어를 사용하고 다른 게임의 modal layout은 복제하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-023 · L37–37 · 부모 LEGACY-CS-UID-020 |   - 상단에 `ROLL → PAIR &amp; CLIMB → PUSH OR STOP` 핵심 loop를 quick guide로 제공합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-024 · L38–38 · 부모 LEGACY-CS-UID-020 |   - 2–12 mountain 구조, 4 dice pairing 예시, runner 최대 3개, PUSH/STOP, BUST, 3-column win, server-authoritative adaptation을 각각 game-local visual example로 설명합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-025 · L39–39 · 부모 LEGACY-CS-UID-020 |   - 기존 상세 규칙 문장은 유지하여 visual example 없이도 semantic text만으로 전체 규칙을 이해할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-026 · L40–40 · 부모 LEGACY-CS-UID-020 |   - 공식 artwork/logo는 직접 사용하지 않고 기존 자체 dice/runner/alpine presentation으로 재구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-027 · L41–41 · 부모 LEGACY-CS-UID-020 |   - desktop/mobile에서 같은 정보 순서를 유지하고 작은 화면에서는 visual example을 본문 아래로 재배치합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-028 · L42–42 | - Rationale: 규칙 안내를 일반 도움말이 아니라 실제 gameplay presentation의 일부로 만들면서도 규칙 정확성, 접근성, 저작권 경계를 유지합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-029 · L43–43 | - Affected surfaces: rules modal header, quick loop, rule sections, dice/runner/mountain visual examples, source footer, mobile dialog | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-030 · L44–44 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-031 · L45–45 | - Validation: 2026-09-23 사용자 실제 화면 리뷰에서 “거의 손 안대도 될 정도의 퀄리티”로 승인. Game Platform governance run #493 성공. | 표현:승인 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-032 · L46–46 | - Baseline relation: `UI_DESIGN.md` adoption baseline의 game-local rules modal 방향을 구체화하고 기존 text-heavy presentation을 대체합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-033 · L47–47 | - Related functional boundary: 규칙 사실과 필수 설명 내용은 `GAME_SPEC.md`를 유지하며 runtime rules/DB/RPC/state authority는 변경하지 않습니다. | 표현:필수 | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > 2026-09-23 — Full Alpine Expedition Presentation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-034 · L51–51 | - Decision ID: CS-UI-002 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-035 · L52–52 | - Applies to: entry, lobby, shell/header, player roster, gameplay board, dice/route station, phase feedback, result/rematch, responsive presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-036 · L53–53 | - Supersedes: v1 release baseline의 전반적인 generic/light shell presentation과 개별 polish 중심 시각 체계 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-037 · L54–54 | - Source: developer manual browser review + Game Platform full-design-rule experiment | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-038 · L55–55 | - Context / trigger: CS-UI-001 규칙 모달이 기존 gameplay보다 더 강한 Can’t Stop 고유 정체성을 보여 주면서, 공통 디자인 규칙이 한 modal을 넘어 게임 전체에도 일관되게 적용되는지 검증할 필요가 생겼습니다. | 표현:검증 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-039 · L56–56 | - Previous / alternatives: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-040 · L57–57 · 부모 LEGACY-CS-UID-039 |   - v1 보드/사이드바/헤더 구조를 유지하고 색상·spacing만 미세 조정 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-041 · L58–58 · 부모 LEGACY-CS-UID-039 |   - rules modal의 스타일을 일부 gameplay card에만 제한적으로 확장 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-042 · L59–59 · 부모 LEGACY-CS-UID-039 |   - 기능 구조를 유지한 채 Entry → Lobby → Gameplay → Result 전체 presentation을 하나의 alpine expedition 언어로 재구성 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-043 · L60–60 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-044 · L61–61 · 부모 LEGACY-CS-UID-043 |   - Can’t Stop 전체 화면을 **alpine expedition** 경험으로 통일합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-045 · L62–62 · 부모 LEGACY-CS-UID-043 |   - Entry는 trailhead / expedition briefing, Lobby는 `BASE CAMP`, gameplay는 mountain board + route station, GAME_OVER는 summit/winner presentation으로 이어지는 하나의 공간 언어를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-046 · L63–63 · 부모 LEGACY-CS-UID-043 |   - 공식/신뢰 가능한 제품 자료에서 확인한 4개의 red dice, 3개의 white runner, 2–12 mountain-column 구조를 참고하되 공식 artwork/logo는 직접 복제하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-047 · L64–64 · 부모 LEGACY-CS-UID-043 |   - gameplay dice는 red physical component로 강조하고, active runner는 white expedition marker + player accent로 재해석합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-048 · L65–65 · 부모 LEGACY-CS-UID-043 |   - 2–12 column은 독립 원형 cell의 나열보다 rope/trail 축을 따라 정상으로 오르는 구조로 보이게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-049 · L66–66 · 부모 LEGACY-CS-UID-043 |   - shell/header, roster, utility controls는 deep alpine blue expedition frame으로 통일하고 summit/winner/checkpoint는 gold accent를 제한적으로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-050 · L67–67 · 부모 LEGACY-CS-UID-043 |   - pairing/route selection은 밝은 route-map surface로 분리해 행동 선택과 보드 상태를 시각적으로 구분합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-051 · L68–68 · 부모 LEGACY-CS-UID-043 |   - `ROLL`, `PAIRING_SELECTION`, `PUSH_OR_STOP`, `GAME_OVER` 상태에 presentation class를 부여해 같은 기능 구조 안에서 현재 단계가 자연스럽게 읽히게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-052 · L69–69 · 부모 LEGACY-CS-UID-043 |   - 기존 authoritative gameplay, RPC, DB, randomness, turn lifecycle, reconnect, rematch 구조는 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-053 · L70–70 · 부모 LEGACY-CS-UID-043 |   - desktop/tablet/mobile에서 같은 design language를 유지하되 좁은 화면에서는 정보 밀도와 열 배치를 조절합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-054 · L71–71 | - Rationale: 기존 Can’t Stop은 기능적으로 완성되어 있었지만 UI 규칙 도입 전에 개발되어 각 요소가 개별 기능을 설명하는 방식으로 성장했습니다. 전체 presentation을 하나의 원정 메타포로 묶으면 규칙 모달에서 발견한 game-local identity를 실제 플레이 전 과정으로 확장하면서도 기존 안정적인 기능 구조를 그대로 보존할 수 있습니다. | 표현:할 수 있습니다 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-055 · L72–72 | - Affected surfaces: page background, Common Game Shell overrides, entry cards, basecamp lobby, player roster, board frame, columns, markers, dice station, route panel, gameplay tools, bust feedback, game-over/rematch, responsive layout | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-056 · L73–73 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-057 · L74–74 | - Validation: 2026-09-23 사용자 실제 화면 리뷰에서 “미쳤어 완전 마음에 들어”라고 명시적으로 승인. Game Platform governance run #494 성공. | 표현:승인 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-058 · L75–75 | - Baseline relation: `UI_DESIGN.md` v1 adoption baseline의 기능적 구조와 핵심 구성물은 유지하고, 전반적인 presentation hierarchy와 visual language를 대체합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-059 · L76–76 | - Related functional boundary: `GAME_SPEC.md`의 rules, authoritative state, dice/pairing/runner/claim/win 의미는 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > 2026-09-26 — Shared Gameplay Feedback & Summit Completion

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-060 · L80–80 | - Decision ID: CS-UI-003 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-061 · L81–81 | - Applies to: multiplayer dice presentation, route hover preview, player HUD, permanent progress ownership, claimed columns, bust feedback, GAME_OVER victory event | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-062 · L82–82 | - Supersedes: 없음. CS-UI-002의 alpine expedition presentation을 post-release interaction/detail 영역에서 확장합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-063 · L83–83 | - Source: developer manual browser review + 2026-09-25~26 사용자 피드백 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-064 · L84–84 | - Context / trigger: 실제 멀티플레이 반복 테스트에서 다른 플레이어의 주사위 굴림, 경로 선택 결과, 말 소유권, 저장 진척, bust가 기능적으로는 맞아도 관전자 화면에서 즉시 읽히지 않는 구간이 확인됐고, 세 column을 완주해 게임이 끝나는 가장 큰 성공 이벤트에는 별도 축하 presentation이 없었습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-065 · L85–85 | - Previous / alternatives: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-066 · L86–86 · 부모 LEGACY-CS-UID-065 |   - authoritative snapshot이 갱신되는 즉시 결과만 표시하고 추가 motion을 두지 않음 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-067 · L87–87 · 부모 LEGACY-CS-UID-065 |   - 모든 preview/progress/완주 표시를 neutral/gold 한 색으로 통일 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-068 · L88–88 · 부모 LEGACY-CS-UID-065 |   - 일반적인 confetti modal을 GAME_OVER 위에 띄움 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-069 · L89–89 · 부모 LEGACY-CS-UID-065 |   - 기존 alpine expedition 언어 안에서 player color + summit/gold checkpoint + snow/peak motion으로 이벤트를 재구성 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-070 · L90–90 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-071 · L91–91 · 부모 LEGACY-CS-UID-070 |   - 다른 플레이어의 authoritative dice result도 현재 플레이어와 동일한 rolling cycle을 거친 뒤 결과를 보여 주어 멀티클라이언트 presentation을 맞춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-072 · L92–92 · 부모 LEGACY-CS-UID-070 |   - pairing plan hover/focus에서는 실제 이동 예정 칸을 보드에 preview하고, 현재 플레이어의 말 색상을 사용하되 점선/반투명 ring으로 active runner와 구분합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-073 · L93–93 · 부모 LEGACY-CS-UID-070 |   - permanent progress는 같은 칸에 1명이면 전체 원, 2명이면 1/2, 3명이면 1/3, 4명이면 기존 4-marker 구조로 표시하여 말 소유권과 겹침 상태를 동시에 읽게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-074 · L94–94 · 부모 LEGACY-CS-UID-070 |   - player HUD는 아바타/이름·상태·완주/현재 턴/말 색상/연결 상태를 정렬하고, card accent·avatar ring·turn badge·명시적 `내 말/말` badge에 실제 player color를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-075 · L95–95 · 부모 LEGACY-CS-UID-070 |   - claimed column의 cell과 번호는 완주 플레이어의 말 색상으로 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-076 · L96–96 · 부모 LEGACY-CS-UID-070 |   - bust는 기존 설산 눈보라 언어를 유지하되 runner 낙하/회전과 board impact를 강화합니다. actor의 local RPC 결과뿐 아니라 Realtime invalidation을 받는 모든 플레이어 화면에서도 동일한 roll → bust presentation을 재생하고, 결과 카드에 실제 미끄러진 플레이어의 이름을 명시합니다. `PUSH_OR_STOP → continue → roll → bust` 두 서버 action이 하나의 remote snapshot으로 합쳐진 경우도 version 차이를 사용해 bust로 복원하되 정상 stop이나 player leave와 혼동하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-077 · L97–97 · 부모 LEGACY-CS-UID-070 |   - 실제 3-column win으로 GAME_OVER에 **전환되는 순간** 승리한 플레이어 본인을 포함한 방의 모든 플레이어에게 5.2초의 summit celebration을 재생합니다. reconnect로 이미 끝난 방에 처음 들어온 경우, 수동 게임 종료, 플레이어 이탈 종료에는 재생하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-078 · L98–98 · 부모 LEGACY-CS-UID-070 |   - victory event는 generic confetti 대신 alpine expedition의 deep-blue frame, gold summit/checkpoint, 설산 crest/flag, 눈·금빛 입자, 실제 완주한 3개 column 번호를 사용합니다. winner flag/accent에는 해당 플레이어의 말 색상을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-079 · L99–99 · 부모 LEGACY-CS-UID-070 |   - celebration은 authoritative winner/claimed columns를 읽기만 하며 result/rematch 상태나 RPC를 변경하지 않고, pointer event를 차단하지 않습니다. reduced-motion 환경에서는 particle/flare motion을 제거하고 정적 승리 card만 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-080 · L100–100 | - Rationale: Can’t Stop의 핵심 감정 곡선은 위험을 감수한 등반과 정상 정복이므로, 성공/실패/소유권을 모두 같은 board language로 읽게 해야 합니다. 특히 GAME_OVER는 일반 서비스형 결과 modal보다 지금까지 쌓아 온 설산 원정 공간 안에서 “세 정상 정복”으로 마무리될 때 game-local identity와 성취감이 가장 잘 연결됩니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-081 · L101–101 | - Affected surfaces: presentation coordinator 소비 UI, route plan interaction, board marker/cell, player roster, claimed column, bust motion, GAME_OVER board overlay, responsive/reduced-motion presentation | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-082 · L102–102 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-083 · L103–103 | - Validation: player-color HUD/progress/preview 방향은 2026-09-26 사용자 실제 화면 리뷰에서 “마음에 들어” 승인. 이후 multiplayer QA에서 remote continue-and-roll bust가 actor 화면에만 남는 문제와 winner 본인의 summit celebration 누락 가능성을 확인해 all-client event derivation/arming을 보강했습니다. 최종 구현은 PR #400으로 main에 병합됐고 Game Platform governance run #598을 통과했습니다. summit celebration의 최종 motion 체감 수동 리뷰는 남아 있습니다. | 표현:승인 | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-084 · L104–104 | - Baseline relation: `UI_DESIGN.md`의 Motion / Interaction 및 Result / Rematch Presentation과 CS-UI-002의 alpine expedition 언어를 유지하면서, 멀티플레이 관전성과 victory climax를 구체화합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-CS | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-085 · L105–105 | - Related functional boundary: `GAME_SPEC.md`의 server-authoritative dice, runner/progress, claim, 3-column win, GAME_OVER/rematch lifecycle은 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Superseded / Rejected

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-086 · L109–109 | - v1의 text-heavy rules modal presentation은 CS-UI-001에 의해 superseded. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-087 · L110–110 | - v1의 generic/light shell 중심 전반 presentation은 CS-UI-002에 의해 superseded. 기능 구조와 server-authoritative gameplay는 유지합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-088 · L111–111 | - No Thanks!의 rules modal/layout을 Can’t Stop에 재사용하는 방향은 game-local identity 원칙에 따라 채택하지 않았습니다. | 표현:원칙 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-089 · L112–112 | - 과거 UI 변경사는 이 문서 도입만으로 소급 재구성하지 않습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Validation History

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-090 · L116–116 | - 2026-09-23 — UI_DECISIONS 체계 도입 당시 v1 release baseline만 기록. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-091 · L117–117 | - 2026-09-23 — CS-UI-001 alpine rules guide: desktop 실제 화면 수동 리뷰 승인. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-092 · L118–118 | - 2026-09-23 — Game Platform governance run #493: JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard 모두 success. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-093 · L119–119 | - 2026-09-23 — CS-UI-002 full alpine expedition redesign: Entry/Lobby/Gameplay/GAME_OVER 실제 화면 수동 리뷰 승인. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-094 · L120–120 | - 2026-09-23 — Game Platform governance run #494: JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard 모두 success. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-095 · L121–121 | - 2026-09-26 — CS-UI-003 gameplay ownership/feedback 구현 중 player-color HUD, permanent progress split, route preview 방향을 사용자 실제 화면 리뷰에서 승인. | 표현:승인 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-096 · L122–122 | - 2026-09-26 — multiplayer QA에서 bust presentation을 모든 플레이어에게 동기화하고 실제 미끄러진 플레이어 이름을 표시하도록 보강. victory event도 승자 본인을 포함한 모든 플레이어에게 재생되도록 arming 조건을 보강. | 표현:조건 | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-097 · L123–123 | - 2026-09-26 — PR #400 main 병합 완료, merge commit `3cf189708f88d4634cd7878476ea4e6fdb0e75f9`. 최종 head 기준 Game Platform governance run #598 success. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-CS-UID-098 · L124–124 | - 2026-09-26 — 디자인 체크포인트: CS-UI-003의 확정 component/interaction/motion 결정은 main에 보존됐으며, summit victory celebration의 최종 브라우저 체감 확인만 Open Follow-up으로 유지. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-CS | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Open Follow-up

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-CS-UID-099 · L128–128 | - CS-UI-003 summit victory celebration의 실제 브라우저 motion 강도, card 크기, 3개 summit token 가독성을 수동 검토합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-100 · L129–129 | - 전체 디자인 실험 결과 공통 디자인 규칙이 rules modal뿐 아니라 Entry/Lobby/Gameplay/Result에서도 game-local identity를 유지하며 작동하는 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-CS-UID-101 · L130–130 | - 후속 수정이 확정되면 `UI_DESIGN.md` baseline을 덮어쓰지 말고 Decision Log에 추가합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-CS | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### NT-SPEC — `games/no-thanks/GAME_SPEC.md`

- source: [games/no-thanks/GAME_SPEC.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/GAME_SPEC.md)
- blob: `11408e010a86c8197068be96a6cbede34c42e477`; 원문 399줄; 상태 `GAME_LOCAL`; 254 관리단위 / 243 규칙·필드 단위.


#### No Thanks! 게임 명세

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-001 · L3–5 | &gt; 이 문서는 No Thanks!가 어떤 게임이며 청파 같이에서 어떤 규칙과 구조로 구현할지 정의하는 게임별 설계 기준입니다.<br>&gt; 실제 기능 개발 진행 상황은 같은 디렉터리의 `DEVELOPMENT.md`에서 관리합니다.<br>&gt; UI/presentation은 같은 디렉터리의 `UI_DESIGN.md` adoption baseline과 `UI_DECISIONS.md`의 최신 non-superseded 변경 결정을 함께 적용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Game Overview

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-002 · L9–9 | - 게임 식별자: `no-thanks` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-003 · L10–10 | - 디자이너: Thorsten Gimmler | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-004 · L11–11 | - 지원 인원: 3–7명 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-005 · L12–12 | - 목표 방식: 온라인 멀티플레이 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-006 · L13–13 | - 핵심 진행: 현재 공개된 숫자 카드를 칩 1개를 내고 거절하거나, 카드와 그 위에 쌓인 칩을 함께 가져오는 선택을 반복합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-007 · L14–14 | - 승리 조건: 마지막 카드가 가져가진 뒤 숫자 카드 점수에서 남은 칩을 뺀 최종 점수가 가장 낮은 플레이어가 승리합니다. | 표현:조건 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-008 · L15–15 | - 기본 카드 구성: 3–35의 숫자 카드 33장 중 무작위 9장을 제외하고 24장을 사용합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Rules and Sources

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-009 · L19–19 | 구현 기준은 다음 자료를 우선 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-010 · L21–21 | - AMIGO 공식 영문 규칙서: https://blog.amigo-spiele.de/content/ap/rule/02455-GB-AmigoRule.pdf | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-011 · L22–22 | - AMIGO 공식 제품 페이지: https://www.amigo-spiele.de/no-thanks_2455_1247 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-012 · L23–23 | - Board Game Arena 규칙 요약: https://en.doc.boardgamearena.com/Gamehelpnothanks | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-013 · L25–25 | 현재 첫 버전에 적용할 기본 규칙은 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-014 · L27–27 | 1. 3–5인은 각 11개, 6인은 각 9개, 7인은 각 7개의 칩으로 시작합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-015 · L28–28 | 2. 각 플레이어가 가진 칩 개수는 게임이 끝날 때까지 다른 플레이어에게 공개하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-016 · L29–29 | 3. 3–35의 숫자 카드 33장을 섞고 9장을 보지 않은 채 제외합니다. 남은 24장을 실제 게임에 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-017 · L30–30 | 4. 현재 차례의 플레이어는 공개된 카드를 가져가거나 칩 1개를 내고 거절할 수 있습니다. | 표현:할 수 있습니다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-018 · L31–31 | 5. 카드를 거절하면 칩 1개가 현재 카드 위의 공개 칩 더미에 추가되고 차례는 다음 플레이어에게 넘어갑니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-019 · L32–32 | 6. 칩이 하나도 없는 플레이어는 거절할 수 없으며 현재 카드를 반드시 가져가야 합니다. | 표현:반드시 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-020 · L33–33 | 7. 현재 카드를 가져가면 카드 위에 쌓인 모든 칩도 함께 가져갑니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-021 · L34–34 | 8. 카드를 가져간 플레이어가 다음 카드를 공개하며 같은 플레이어가 다시 선택합니다. 즉 카드를 가져가는 행동 자체로는 차례가 끝나지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-022 · L35–35 | 9. 마지막 카드를 누군가 가져가는 순간 게임이 끝납니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-023 · L36–36 | 10. 단독 숫자 카드는 적힌 값만큼 점수가 됩니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-024 · L37–37 | 11. 연속된 숫자 카드 묶음은 가장 낮은 숫자 하나만 점수에 포함합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-025 · L38–38 | 12. 최종 점수는 숫자 카드 점수 합에서 남은 칩 수를 뺀 값입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-026 · L39–39 | 13. 최종 점수가 가장 낮은 플레이어가 승리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-027 · L40–40 | 14. 최저 점수가 동점이면 해당 플레이어들은 공동 승리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Rules and Sources > 온라인 구현에 따른 조정

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-028 · L44–44 | 공식 규칙의 선 플레이어 결정은 "가장 최근에 No thanks!라고 말한 사람"이지만 온라인 환경에서는 적용하기 어렵기 때문에 청파 같이 첫 버전에서는 서버가 게임 시작 시 플레이 순서를 한 번 무작위로 확정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-029 · L46–46 | 게임 중 다른 플레이어의 보유 칩 수는 공식 규칙대로 비공개로 유지합니다. 현재 공개 카드 위에 쌓인 칩 수와 각 플레이어가 획득한 숫자 카드는 모든 플레이어에게 공개합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-030 · L48–48 | 사용자용 규칙 안내는 로비와 실제 플레이 화면에서 다시 열 수 있는 모달로 제공합니다. 처음 플레이하는 사용자도 목표, 시작 칩 수, 9장 제외, 거절과 카드 가져오기, 칩이 없을 때의 강제 수락, 연속 숫자 점수 계산, 남은 칩 차감, 공동 승리를 이해할 수 있는 수준으로 설명합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Product Scope > 이번 버전에 포함

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-031 · L54–54 | - 3–7인 온라인 멀티플레이 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-032 · L55–55 | - 기본 규칙 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-033 · L56–56 | - 3–35 숫자 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-034 · L57–57 | - 무작위 9장 비공개 제외 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-035 · L58–58 | - 인원별 초기 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-036 · L59–59 | - 플레이어별 보유 칩 수 비공개 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-037 · L60–60 | - 카드 거절 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-038 · L61–61 | - 카드 가져오기 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-039 · L62–62 | - 현재 카드 위의 공개 칩 더미 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-040 · L63–63 | - 연속 숫자 묶음 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-041 · L64–64 | - 최종 점수와 공동 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-042 · L65–65 | - 서버 기준 재접속 상태 복원 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-043 · L66–66 | - 상세 게임 규칙 모달 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-044 · L67–67 | - 진행 중 세션의 안전한 종료와 이탈 경로 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Product Scope > 후속 개발로 보류

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-045 · L71–71 | - 2024년 AMIGO 재판에 포함된 22장 특수 카드 확장 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-046 · L72–72 | - Board Game Arena의 Tactical Variant | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-047 · L73–73 | - 플레이 기록과 전적 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-048 · L74–74 | - 관전자 모드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-049 · L75–75 | - 인공지능 플레이어 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-050 · L76–76 | - 별도 애니메이션과 사운드 완성도 개선 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-051 · L77–77 | - 운영 환경 기능 활성화 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D09 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Product Scope > 첫 버전에서 제외

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-052 · L81–81 | - 기존 Legacy 게임 구조 복사 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-053 · L82–82 | - 클라이언트가 카드 섞기, 카드 뽑기, 점수 계산, 칩 사용 가능 여부를 최종 판단하는 구조 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-054 · L83–83 | - 게임별 닉네임 입력 또는 변경 화면 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-055 · L84–84 | - 다른 플레이어의 정확한 보유 칩 수 공개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### State Machine > 방 진행 상태

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-056 · L90–90 | - `ENTRY`: 승인회원 진입 | 표현:승인 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-057 · L91–91 | - `WAITING`: 방 생성 또는 참가, 3–7명 구성, 준비 상태 관리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-058 · L92–92 | - `PLAYING`: 서버가 관리하는 게임 진행 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-059 · L93–93 | - `GAME_OVER`: 마지막 카드 수락 또는 수동 종료로 게임 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-060 · L94–94 | - `POST_GAME`: 결과 확인 후 방 나가기 또는 재대결 흐름 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-061 · L96–96 | 현재 공통 방/로비 계약에서 사용하는 준비 완료와 방장 시작 흐름을 첫 버전에 그대로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### State Machine > 실제 게임 진행 상태

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-062 · L100–100 | `PLAYING` 안에서는 불필요하게 세부 단계를 늘리지 않고 다음 상태를 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-063 · L102–102 | - `currentCard`: 현재 공개 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-064 · L103–103 | - `centerCounters`: 현재 카드 위에 쌓인 공개 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-065 · L104–104 | - `activePlayerId`: 현재 선택권을 가진 플레이어 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-066 · L105–105 | - `deckRemaining`: 아직 공개되지 않은 카드 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-067 · L107–107 | 가능한 행동은 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-068 · L109–109 | - `REFUSE_CARD` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-069 · L110–110 · 부모 LEGACY-NT-SPEC-068 |   - 조건: 현재 차례의 플레이어이며 본인 칩이 1개 이상 남아 있어야 합니다. | 표현:조건 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-070 · L111–111 · 부모 LEGACY-NT-SPEC-068 |   - 결과: 본인 칩 1개 감소, `centerCounters` 1개 증가, 차례가 다음 플레이어에게 넘어갑니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-071 · L112–112 | - `TAKE_CARD` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-072 · L113–113 · 부모 LEGACY-NT-SPEC-071 |   - 조건: 현재 차례의 플레이어여야 합니다. | 표현:조건 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-073 · L114–114 · 부모 LEGACY-NT-SPEC-071 |   - 결과: `currentCard`를 플레이어가 획득한 공개 카드에 추가하고 `centerCounters`만큼 본인 칩이 증가합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-074 · L115–115 · 부모 LEGACY-NT-SPEC-071 |   - 남은 카드가 있으면 서버가 다음 카드를 공개하며 현재 플레이어가 계속 선택합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-075 · L116–116 · 부모 LEGACY-NT-SPEC-071 |   - 마지막 카드였다면 최종 점수를 계산하고 `GAME_OVER`로 전환합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-076 · L117–117 | - `END_GAME` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-077 · L118–118 · 부모 LEGACY-NT-SPEC-076 |   - 조건: 방장만 요청할 수 있습니다. | 표현:조건,할 수 있습니다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-078 · L119–119 · 부모 LEGACY-NT-SPEC-076 |   - 결과: 서버가 방장 여부와 현재 게임 상태를 검증한 뒤 전체 게임을 종료 상태로 전환합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-079 · L121–121 | 보유 칩이 0개라면 `REFUSE_CARD`는 사용할 수 없고 `TAKE_CARD`만 허용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Domain Model

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-080 · L125–125 | 서버가 관리하는 게임 상태의 핵심 구조는 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-081 · L127–143 | ```text<br>game<br>  phase<br>  turnOrder&#91;&#93;<br>  activePlayerId<br>  currentCard<br>  centerCounters<br>  deckRemaining<br>  excludedCount<br>  players{<br>    playerId<br>    cards&#91;&#93;<br>  }<br>  winners&#91;&#93;<br>  finalScores{}<br>  endReason<br>``` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-082 · L145–145 | 현재 사용자에게만 제공하는 비공개 상태는 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-083 · L147–151 | ```text<br>viewer<br>  playerId<br>  counters<br>``` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-084 · L153–153 | 서버 내부에서만 유지할 상태는 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-085 · L155–159 | ```text<br>drawDeck&#91;&#93;<br>playerCounters{}<br>excludedCards&#91;&#93; 또는 이에 준하는 비공개 상태<br>``` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-086 · L161–161 | 클라이언트는 앞으로 뽑힐 카드 순서나 제외된 카드 목록을 미리 알 수 없어야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Domain Model > 점수 계산

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-087 · L165–165 | 숫자 카드를 오름차순으로 정렬한 뒤 각 연속 숫자 묶음의 첫 숫자만 합산합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-088 · L167–167 | 예시는 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-089 · L169–174 | ```text<br>보유 카드 = &#91;3, 10, 11, 12, 20&#93;<br>카드 점수 = 3 + 10 + 20 = 33<br>남은 칩 = 5<br>최종 점수 = 28<br>``` | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-SPEC-090 · L176–176 | 동일한 최저 점수를 기록한 플레이어가 여러 명이면 공동 승리로 처리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Platform Boundary > SHARED

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-091 · L182–182 | 다음 책임은 기존 공통 게임 플랫폼을 재사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-092 · L184–184 | - 게임 등록부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-093 · L185–185 | - 승인회원 접근 제어 | 표현:승인 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-094 · L186–186 | - 공통 게임 화면 골격 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-095 · L187–187 | - 방/로비 계약 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-096 · L188–188 | - 버전과 중복 요청 방지 정보를 포함하는 행동 요청 규격 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-097 · L189–189 | - 스냅샷 조정 기능 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-098 · L190–190 | - 재접속 시 새로고침 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-099 · L191–191 | - 연결 상태와 플레이어 표시 상태 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-100 · L192–192 | - 게임 초대 기능 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-101 · L193–193 | - 데이터베이스 통합 검증 계약 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-102 · L195–195 | 게임 초대 기능은 실제 구현과 운영 검증이 끝난 뒤에만 활성화합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Platform Boundary > GAME-LOCAL

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-103 · L199–199 | 다음 책임은 No Thanks! 내부에 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-104 · L201–201 | - 카드 구성과 섞기 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-105 · L202–202 | - 9장 제외 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-106 · L203–203 | - 인원별 초기 칩 수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-107 · L204–204 | - 공개 카드와 카드 위 칩 더미 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-108 · L205–205 | - 카드 거절과 가져오기 가능 여부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-109 · L206–206 | - 플레이어별 비공개 칩 상태 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-110 · L207–207 | - 차례 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-111 · L208–208 | - 연속 숫자 묶음 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-112 · L209–209 | - 최종 점수와 공동 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-113 · L210–210 | - No Thanks! 전용 카드와 획득 카드 화면 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-114 · L211–211 | - 게임 고유 애니메이션과 사운드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-115 · L213–213 | 현재 공통 계약을 변경하지 않고 구현하는 것을 기본으로 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Authority and Persistence

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-116 · L217–217 | 첫 온라인 버전은 서버가 최종 판단하는 구조로 구현합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-117 · L219–219 | 서버가 최종 결정해야 하는 항목은 다음과 같습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-118 · L221–221 | - 방 참가 여부와 준비 상태, 게임 시작 조건 | 표현:조건 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-119 · L222–222 | - 플레이 순서 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-120 · L223–223 | - 카드 섞기 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-121 · L224–224 | - 제외되는 9장 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-122 · L225–225 | - 카드가 공개되는 순서 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-123 · L226–226 | - 현재 공개 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-124 · L227–227 | - 각 플레이어의 보유 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-125 · L228–228 | - 카드 거절 가능 여부 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-126 · L229–229 | - 현재 카드 위의 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-127 · L230–230 | - 카드 가져오기 결과 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-128 · L231–231 | - 다음 차례 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-129 · L232–232 | - 최종 점수와 승자 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-130 · L233–233 | - 방장 전용 수동 게임 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-131 · L235–235 | 상태를 변경하는 요청은 기본적으로 다음 값을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-132 · L237–242 | ```text<br>room_id<br>expected_version<br>client_action_id<br>action payload<br>``` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-133 · L244–244 | 서버는 방 단위 잠금과 트랜잭션 안에서 방 참가 여부, 현재 차례, 게임 상태, `expected_version`, `client_action_id`를 검증한 뒤 상태를 한 번만 반영합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Authority and Persistence > 스냅샷 공개 범위

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-134 · L248–248 | 모든 참여자에게 공개하는 상태: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-135 · L250–250 | - 방 정보와 버전, 진행 상태 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-136 · L251–251 | - 플레이 순서 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-137 · L252–252 | - 현재 차례의 플레이어 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-138 · L253–253 | - 현재 공개 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-139 · L254–254 | - 현재 카드 위에 쌓인 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-140 · L255–255 | - 남은 카드 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-141 · L256–256 | - 모든 플레이어가 획득한 공개 숫자 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-142 · L257–257 | - 게임 종료 후 최종 점수와 승자 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-143 · L259–259 | 현재 사용자에게만 공개하는 상태: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-144 · L261–261 | - 본인의 정확한 보유 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-145 · L263–263 | 공개하지 않는 상태: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-146 · L265–265 | - 다른 플레이어의 정확한 보유 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-147 · L266–266 | - 아직 공개되지 않은 카드 순서 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-148 · L267–267 | - 제외된 9장 목록 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-149 · L269–269 | 실시간 이벤트는 상태 변경을 알리는 신호로만 사용하고, 최종 상태는 서버의 권위 있는 스냅샷을 다시 조회해 확인합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-150 · L271–271 | Room/Lobby foundation은 다음 game-local DB 객체를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-151 · L273–273 | - `public.no_thanks_rooms`: room identity, host, waiting/playing/closed 상태, 최대 인원, authoritative `version`, 공개 `game_state` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-152 · L274–274 | - `public.no_thanks_room_players`: active membership, 사이트 프로필 `display_name`, seat, ready, 공개 획득 카드 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-153 · L275–275 | - `public.no_thanks_room_actions`: `client_action_id` 기반 ready/start/gameplay replay와 payload conflict 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-154 · L276–276 | - `public.no_thanks_room_private_state`: 남은 draw deck, 제외된 9장, 플레이어별 비공개 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-155 · L277–277 | - public RPC: `no_thanks_create_room`, `no_thanks_join_room`, `no_thanks_get_my_active_room`, `no_thanks_get_lobby_snapshot`, `no_thanks_set_ready`, `no_thanks_leave_room`, `no_thanks_start_game`, `no_thanks_play_action`, `no_thanks_prepare_rematch` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-156 · L279–279 | 브라우저는 위 테이블을 직접 수정하지 않고 승인회원 RPC만 호출합니다. 특히 `no_thanks_room_private_state`에는 authenticated select 권한을 주지 않으며 Realtime 구독 대상에서도 제외합니다. 공개 room/player 변경은 invalidation 신호로만 사용하고, 실제 화면 상태는 RPC snapshot을 다시 조회해 복원합니다. | 표현:승인 | LOCAL_RULE / L | E-NT | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-157 · L281–281 | 게임 시작 시 서버가 3–7명 조건과 방장/ready 상태를 검증한 뒤 turn order와 3–35 카드 순서를 무작위로 확정합니다. 24장 중 첫 카드만 공개 `game_state`에 두고 남은 23장, 제외된 9장, 모든 플레이어의 칩 수는 private state에 유지합니다. snapshot은 호출자 자신의 칩 수만 `viewer.counters`로 합성하며 다른 플레이어의 칩 수와 미공개 카드 순서는 반환하지 않습니다. | 표현:조건,검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-158 · L283–283 | 게임 진행 중 `REFUSE_CARD`, `TAKE_CARD`, `END_GAME`은 game-local `no_thanks_play_action` RPC가 처리합니다. 모든 요청은 `expected_version`과 `client_action_id`를 받아 room/private state를 같은 트랜잭션에서 잠그고, 현재 차례·보유 칩·방장 권한·중복 요청 여부를 서버가 최종 판정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-159 · L285–285 | - `REFUSE_CARD`: 현재 플레이어만 가능하며 private counter를 1개 차감하고 공개 중앙 칩을 1개 늘린 뒤 다음 플레이어로 차례를 이동합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-160 · L286–286 | - `TAKE_CARD`: 현재 플레이어가 공개 카드를 획득하고 중앙 칩을 private counter에 더합니다. 남은 private deck의 다음 카드만 공개하며 같은 플레이어가 계속 선택합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-161 · L287–287 | - 마지막 카드 `TAKE_CARD`: 공개 획득 카드와 private counter로 최종 점수를 서버에서 계산하고 `GAME_OVER / LAST_CARD_TAKEN`과 공동 승자를 authoritative snapshot에 확정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-162 · L288–288 | - `END_GAME`: 방장만 가능하며 확인 UI를 거친 뒤 `GAME_OVER / HOST_TERMINATED`로 전환합니다. 수동 종료는 최종 점수와 승자를 계산하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-163 · L289–289 | - `GAME_OVER` 이후에는 참가자가 결과를 확인한 뒤 안전하게 세션에서 이탈할 수 있습니다. | 표현:할 수 있습니다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Authority and Persistence > Disconnect / Presence / Reconnect 정책

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-164 · L293–293 | - 브라우저 종료, 네트워크 단절, 모바일 백그라운드 진입 같은 비정상 연결 끊김은 `leave`로 취급하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-165 · L294–294 | - 연결이 끊겨도 room membership, host ownership, turn, 공개/비공개 game state는 서버에 그대로 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-166 · L295–295 | - 현재 차례 플레이어의 연결이 끊겨도 자동으로 turn을 넘기지 않습니다. 해당 사용자가 재접속하면 authoritative snapshot을 다시 받아 같은 turn에서 이어서 진행합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-167 · L296–296 | - 방장의 연결이 끊겨도 다른 사용자에게 방장 권한을 자동 위임하지 않으며 게임도 자동 종료하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-168 · L297–297 | - Supabase Realtime Presence는 roster의 온라인/오프라인 표시용 보조 신호로만 사용합니다. Presence 결과는 ready/start/action 권한이나 server-authoritative game rule 판정에 사용하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-169 · L298–298 | - Presence payload에는 `userId`와 접속 시각만 포함하고, 닉네임·카드·칩·turn state 같은 게임 데이터는 넣지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-170 · L299–299 | - 동일 사용자가 여러 탭으로 접속할 수 있으므로 각 브라우저 client는 고유 Presence key를 사용하고 UI에서는 user id 기준으로 접속 여부를 합칩니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-171 · L300–300 | - `online`, `pageshow`, visible 복귀 시 최종 화면 상태는 Presence가 아니라 snapshot RPC 재조회로 복원합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Authority and Persistence > 재대결 정책

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-172 · L304–304 | 게임 종료 후에는 기존 room과 남아 있는 active player identity를 유지한 채 재대결 준비 상태로 돌아갑니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-173 · L306–306 | - 방장만 결과 화면에서 `재대결 준비`를 시작할 수 있습니다. | 표현:할 수 있습니다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-174 · L307–307 | - 서버는 room code / active membership / 현재 host를 유지하고 room을 `waiting`으로 되돌립니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-175 · L308–308 | - 이전 게임의 public game state, private deck/counter state, 플레이어 획득 카드는 초기화합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-176 · L309–309 | - active player의 ready는 다시 false가 되며 기존 ready/start 권한 검증을 그대로 재사용합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-177 · L310–310 | - 결과 화면에서 재대결을 원하지 않는 플레이어는 안전하게 나갈 수 있습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-178 · L311–311 | - GAME_OVER에서 방장이 먼저 나가면 남은 active player 중 seat가 가장 빠른 플레이어에게 host를 승계해 남은 참가자가 재대결을 계속 선택할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-179 · L312–312 | - 재대결 준비 후 인원이 최소 3명보다 적다면 같은 room code로 새 참가자 또는 이전 이탈자가 다시 참가할 수 있습니다. | 표현:할 수 있습니다 | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-180 · L313–313 | - 기존 room action history는 idempotency/replay 안전성을 위해 유지하되 새 gameplay state는 이전 게임 상태와 분리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### UI / UX Direction

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-181 · L317–317 | - 공통 게임 화면 골격을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-182 · L318–318 | - 데스크톱에서는 중앙에 현재 카드와 칩 더미를 크게 두고, 주변에 플레이어별 획득 카드와 참가자 정보를 배치합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-183 · L319–319 | - 모바일에서는 현재 카드와 선택 버튼을 첫 화면에서 가장 먼저 볼 수 있게 배치하고, 다른 플레이어 정보는 세로 흐름으로 정리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-184 · L320–320 | - 자신의 보유 칩 수는 명확하게 표시하지만 다른 플레이어의 칩 수는 숫자로 보여주지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-185 · L321–321 | - 현재 카드 위에 쌓인 칩 수는 모든 플레이어에게 공개합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-186 · L322–322 | - 핵심 선택 버튼은 두 개만 강조합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-187 · L323–323 · 부모 LEGACY-NT-SPEC-186 |   - `거절하기 (-1)` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-188 · L324–324 · 부모 LEGACY-NT-SPEC-186 |   - `카드 가져오기 (+쌓인 칩)` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-189 · L325–325 | - 칩이 0개라면 거절 버튼을 숨기거나 비활성화하되, 최종 가능 여부는 서버가 다시 검증합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-190 · L326–326 | - 획득한 숫자 카드는 연속된 숫자 묶음을 쉽게 확인할 수 있도록 정렬하고 묶어서 보여줍니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-191 · L327–327 | - 로비와 실제 플레이 화면 모두 `게임 규칙` 진입점을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-192 · L328–328 | - 사이트 프로필 닉네임을 사용하며 게임 안에서 별도의 닉네임 입력이나 변경 기능을 제공하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-193 · L329–329 | - 게임 전체 종료는 방장에게만 제공하며, 확인 화면을 거친 뒤 서버가 방장 권한을 다시 검증하고 최종 상태를 변경합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-194 · L330–330 | - 접속이 끊긴 플레이어는 roster에 `재접속 대기`로 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-195 · L331–331 | - 현재 차례 플레이어가 오프라인이면 자동 진행하지 않고 재접속 후 이어진다는 안내를 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-196 · L332–332 | - 방장이 오프라인이어도 자동 위임 또는 자동 종료가 발생하지 않는다는 안내를 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-197 · L333–333 | - 결과 화면의 재대결은 같은 room/player context를 유지한 채 waiting/ready 상태로 전환된다는 점을 확인 dialog에서 명확히 안내합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Implementation Plan

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-198 · L337–337 | 1. 초기 설계 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-199 · L338–338 · 부모 LEGACY-NT-SPEC-198 |    - `GAME_SPEC.md` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-200 · L339–339 · 부모 LEGACY-NT-SPEC-198 |    - `UI_DESIGN.md` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-201 · L340–340 · 부모 LEGACY-NT-SPEC-198 |    - `DEVELOPMENT.md` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-202 · L341–341 | 2. 순수 규칙 엔진 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-203 · L342–342 · 부모 LEGACY-NT-SPEC-202 |    - 인원별 시작 칩 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-204 · L343–343 · 부모 LEGACY-NT-SPEC-202 |    - 카드 거절 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-205 · L344–344 · 부모 LEGACY-NT-SPEC-202 |    - 카드 가져오기 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-206 · L345–345 · 부모 LEGACY-NT-SPEC-202 |    - 차례 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-207 · L346–346 · 부모 LEGACY-NT-SPEC-202 |    - 연속 숫자 묶음 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-208 · L347–347 · 부모 LEGACY-NT-SPEC-202 |    - 공동 승리 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-209 · L348–348 · 부모 LEGACY-NT-SPEC-202 |    - 게임 종료 전환 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-210 · L349–349 · 부모 LEGACY-NT-SPEC-202 |    - 단위 테스트 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-211 · L350–350 | 3. 승인회원 접근 제어와 공통 게임 화면의 최소 실행 코드 | 표현:승인 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-212 · L351–351 | 4. 방/로비 데이터베이스 및 RPC 기반 구성 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-213 · L352–352 · 부모 LEGACY-NT-SPEC-212 |    - 3–7명 참가 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-214 · L353–353 · 부모 LEGACY-NT-SPEC-212 |    - 준비 완료와 방장 시작 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-215 · L354–354 · 부모 LEGACY-NT-SPEC-212 |    - 서버에서 플레이 순서와 카드 순서 초기화 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-216 · L355–355 · 부모 LEGACY-NT-SPEC-212 |    - 데이터베이스 통합 검증 계약 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-217 · L356–356 | 5. 실제 방/로비 사용자 흐름 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-218 · L357–357 | 6. 서버 권위 게임 행동 RPC | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-219 · L358–358 · 부모 LEGACY-NT-SPEC-218 |    - 카드 거절 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-220 · L359–359 · 부모 LEGACY-NT-SPEC-218 |    - 카드 가져오기와 다음 카드 공개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-221 · L360–360 · 부모 LEGACY-NT-SPEC-218 |    - 최종 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-222 · L361–361 | 7. 비공개 상태 보호, 재접속, 실시간 변경 감지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-223 · L362–362 | 8. 상세 규칙 모달, 게임 종료, 게임 후 화면 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-224 · L363–363 | 9. 게임 초대 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-225 · L364–364 | 10. 운영 마이그레이션, 다중 사용자 점검, 기능 활성화 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D09 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-226 · L365–365 | 11. 출시 마무리와 게임 플랫폼 회고 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Validation Plan

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-227 · L369–369 | - 게임 규칙 단위 테스트 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-228 · L370–370 · 부모 LEGACY-NT-SPEC-227 |   - 인원별 시작 칩 수 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-229 · L371–371 · 부모 LEGACY-NT-SPEC-227 |   - 칩이 0개일 때 카드 가져오기 강제 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-230 · L372–372 · 부모 LEGACY-NT-SPEC-227 |   - 거절 시 본인 칩 감소, 중앙 칩 증가, 다음 차례 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-231 · L373–373 · 부모 LEGACY-NT-SPEC-227 |   - 카드 가져오기 시 중앙 칩 획득, 현재 플레이어 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-232 · L374–374 · 부모 LEGACY-NT-SPEC-227 |   - 마지막 카드 획득 후 게임 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-233 · L375–375 · 부모 LEGACY-NT-SPEC-227 |   - 연속 숫자 묶음 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-234 · L376–376 · 부모 LEGACY-NT-SPEC-227 |   - 떨어져 있는 숫자 묶음의 개별 점수 계산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-235 · L377–377 · 부모 LEGACY-NT-SPEC-227 |   - 남은 칩 수 차감 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-236 · L378–378 · 부모 LEGACY-NT-SPEC-227 |   - 공동 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-237 · L379–379 · 부모 LEGACY-NT-SPEC-227 |   - 입력 상태를 직접 변경하지 않는지 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-238 · L380–380 | - 게임 플랫폼 공통 계약과 관리 규칙 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-239 · L381–381 | - 데이터베이스 통합 계약의 필수 시나리오 11개 검증 | 표현:검증,필수 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-240 · L382–382 | - 재대결의 same-room/player 유지, gameplay/private state reset, ready/start 권한, reconnect 복원 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-241 · L383–383 | - 다른 플레이어의 칩 수가 노출되지 않는지 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-242 · L384–384 | - 미공개 카드 순서와 제외 카드가 노출되지 않는지 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-243 · L385–385 | - 오래된 버전 요청, 같은 요청의 중복 전송, 동시 요청 충돌 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-244 · L386–386 | - 재접속 시 서버 상태 복원 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-245 · L387–387 | - disposable Supabase에서 3개 독립 인증 세션의 자연 종료까지 다중 클라이언트 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-246 · L388–388 | - disposable Supabase에서 7개 독립 인증 세션의 full refuse cycle, private counter 격리, take/reconnect 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-247 · L389–389 | - 실제 브라우저 Presence join/leave, host/active-player reconnect, 모바일 background/foreground는 release manual gate로 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-248 · L390–390 | - 모바일과 데스크톱에서 규칙 모달과 행동 버튼 배치 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-249 · L391–391 | - release gate 전체 상태는 `RELEASE_CHECKLIST.md`에서 추적 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Open Questions / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-SPEC-250 · L395–395 | - 특수 카드 확장은 기본 규칙 첫 버전을 출시한 뒤 별도 단계에서 검토합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-251 · L396–396 | - 명시적 leave는 WAITING 또는 GAME_OVER에서만 허용하고 PLAYING 중 비정상 disconnect는 membership을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-252 · L397–397 | - 방장 비정상 disconnect는 권한 위임이나 자동 종료 없이 재접속을 기다리는 정책으로 확정했습니다. 명시적 `게임 종료`만 방장 전용 서버 액션으로 처리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-253 · L398–398 | - 재대결은 같은 room/player context를 유지하면서 이전 gameplay/private state만 초기화하고 기존 ready/start 흐름을 재사용하는 방식으로 확정했습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-SPEC-254 · L399–399 | - 운영 환경에서 초대 기능을 활성화하는 시점은 마이그레이션, 데이터베이스 통합 검증, 실제 멀티플레이 점검 이후로 미룹니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### NT-DEV — `games/no-thanks/DEVELOPMENT.md`

- source: [games/no-thanks/DEVELOPMENT.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/DEVELOPMENT.md)
- blob: `c5167e1dc6004d663a58d304e2d8604acfaf3f68`; 원문 332줄; 상태 `GAME_LOCAL`; 291 관리단위 / 72 규칙·필드 단위.


#### No Thanks! 개발 진행

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-001 · L3–4 | &gt; 이 문서는 현재 개발 상태를 다음 작업자나 다음 채팅으로 전달하기 위한 인수인계 문서입니다.<br>&gt; 게임 규칙과 기능 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다. UI/presentation은 `UI_DESIGN.md` adoption baseline과 `UI_DECISIONS.md`의 최신 non-superseded override를 함께 적용합니다. 이 문서에 이미 남아 있는 UI Phase 기록은 과거 인수인계 이력으로 보존하되 이후 세부 UI 이력은 `UI_DECISIONS.md`에 기록합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | D04 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Current Status

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-002 · L8–8 | - Phase: Release candidate — 첫 공개 버전의 core rules / Room-Lobby / server-authoritative gameplay / reconnect-rematch / board presentation / audio polish 구현 완료. 남은 범위는 새 기능 개발 단계가 아니라 release gate와 activation입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-003 · L9–9 | - Status: RELEASE_CANDIDATE | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-004 · L10–10 | - Active branch: `main` (이 checkpoint PR 병합 후 handoff baseline) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-005 · L11–11 | - Current main baseline: `616626f53f5fb8554fff8df2e86cc50a22e8aefa` (PR #397 merge) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-006 · L12–12 | - Phase A–D merge baseline: `66531c7820285b37dc8d1e2961156ab95560758f` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-007 · L13–13 | - Design baseline: `UI_DESIGN.md` + `UI_DECISIONS.md` NT-UI-001~013 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-008 · L14–14 | - Registry capability: `online=false / local=false / invite=false / presence=false` | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-009 · L15–15 | - 마지막 기록: 2026-09-25 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Completed

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-010 · L19–19 | - 2026-09-25 PR #396을 병합해 출시 전 실제 플레이에서 발견된 card interaction/presentation 흐름을 안정화했습니다. opening 직후 첫 TAKE/거절이 새로고침 없이 동작하도록 하고, next-card deal 출발 전 draw-deck source를 유지하며, TAKE 카드를 오름차순 최종 위치에 직접 landing하고 기존 보유 카드는 FLIP-style slide로 공간을 만들도록 정리했습니다. 개인 hand는 실제 가용 폭을 측정해 펼친 상태를 우선하고 필요할 때만 약 5px 단위로 overlap을 높이며 run 경계 여백을 별도로 유지합니다. focus/visibility 전환으로 이미 시작한 deal이 재생되는 문제도 차단했습니다. merge commit은 `2666267f673e2035ceb678ab950cc889ee188c09`입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-011 · L20–20 | - 2026-09-25 PR #397을 병합해 Rules Guide의 0칩 문구를 **플레이어 본인이 보유한 칩** 기준으로 명확히 하고, lobby/gameplay BGM 역할을 `Covert Affair / Hard Boiled`로 확정했습니다. opening shuffle+chip distribution, TAKE card slide+chip stack, refuse chip `스윽 → 착` tactile SFX를 game-local Web Audio로 추가했으며 TAKE 카드/회수 칩 효과음은 사용자 검토 후 기존 대비 약 2배로 조정했습니다. gameplay/RPC/DB authority는 변경하지 않았습니다. merge commit은 `616626f53f5fb8554fff8df2e86cc50a22e8aefa`입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-012 · L21–21 | - 2026-09-25 기준 사용자가 실제 멀티플레이 환경에서 여러 차례 플레이 테스트를 수행했고, 현재 첫 공개 버전에 필요한 추가 core 개발 단계는 식별되지 않았습니다. 이 기록은 **기능 구현 완료 checkpoint**이며, `RELEASE_CHECKLIST.md`의 세부 browser/production gate는 확인된 항목만 별도로 완료 처리합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-013 · L22–22 | - 2026-09-24 통합 PR #394를 최신 `main`에서 충돌 검토한 뒤 병합했습니다. PR #390 final-take presentation, PR #391 game-start opening presentation, PR #389 release-blocker 안정화 변경을 하나의 통합 브랜치에서 순차 결합했고, 최신 main의 No Thanks! BGM 변경을 보존한 채 merge commit `91d9ca42b6340888f6c9680bda2dcce604da6ed3`으로 main에 반영했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-014 · L23–23 | - PR #389의 `20260924073500_no_thanks_randomized_draw_order.sql`을 통합해 `generate_series(3, 35)`가 실제 행을 만든 뒤 `ORDER BY random()`이 평가되도록 start RPC를 보정했습니다. disposable Game DB integration에서 3~35 전체 33장이 정확히 한 번씩 존재하면서 canonical ascending order와 다른 실제 shuffled order를 저장하는 회귀 테스트를 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-015 · L24–24 | - 게임 시작 presentation은 WAITING 테이블의 고정 deck/chip 위치, 2.5초 안내 카드 2장, 중앙 chip bank의 동시 배분, 4단계 card shuffle, 정돈 직후 기존 first-card deal/flip으로 연결되는 순서를 확정했습니다. viewer 시작 칩은 개인 패널의 최종 chip-pile 슬롯에 하나씩 쌓이고, 다른 플레이어 몫은 seat avatar에 닿으면서 흡수되도록 연출합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-016 · L25–25 | - TAKE/종료 presentation lifecycle을 보강했습니다. 마지막 카드 TAKE에서는 원형 테이블의 source card를 flight 시작과 동시에 숨겨 중복 잔상을 제거하고, 방장 수동 종료에서는 실행 중 deal animation을 cancel하여 종료 이후 카드 공개 애니메이션이 재생되지 않도록 했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-017 · L26–26 | - 개인 패널과 FINAL TABLE의 많은 획득 카드는 최대 24장까지 고려합니다. 일반 hand overlap은 장수에 따라 더 타이트해지고, 결과 rack은 실제 available width와 run 시작 수를 측정해 overlap/run margin을 동적으로 다시 계산하여 overflow를 방지합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-018 · L27–27 | - 2026-09-23 PR #378을 main에 병합해 muted blue environmental identity, compact `LIVE ROOM` header, first-place celebration overlay, `FINAL TABLE` result plates를 현재 디자인 baseline으로 확정했습니다. 세부 디자인 결정은 `UI_DECISIONS.md`의 NT-UI-001~004가 소유합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-019 · L28–28 | - 2026-09-23 PR #381을 최신 main과 동기화한 뒤 main에 병합했습니다. in-room reconnecting banner를 조용히 처리하는 presentation, centered `FINAL WINNER` card, No Thanks! tabletop Rules Guide를 구현했고 NT-UI-005~007로 기록했습니다. merge commit은 `c43f96f984b90049b59b163bffd16c9a5fb5cf04`입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-020 · L29–29 | - PR #381에서 카드 공개 순서의 서버 권위 random deck 계약을 다시 검증했습니다. start RPC는 3~35의 33장을 서버에서 무작위 정렬한 뒤 24장을 draw deck으로 사용하고 9장을 비공개 제외하며, 이후 공개 카드는 private draw deck 순서대로 소비합니다. 결과/보유 카드가 오름차순으로 보이는 것은 획득 카드 정렬 presentation/state 정리 때문이며 reveal 순서를 정렬하는 로직은 아닙니다. 기존 gameplay DB 로직은 수정하지 않고 회귀 테스트만 추가했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-021 · L30–30 | - 최신 Game Platform의 Rules Guide Presentation 공통 규칙과 No Thanks! `NT-UI-007`의 책임 경계가 일치함을 확인했습니다. 규칙 사실은 `GAME_SPEC.md`/server-authoritative gameplay가 소유하고, 규칙 modal의 game-local presentation은 `UI_DESIGN.md + UI_DECISIONS.md`가 소유합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-022 · L31–31 | - Board UI Phase A–D 작업 PR #364 (`feature/no-thanks-board-ui-phase1-a-d`)을 최신 `main`과 충돌 없이 재동기화한 뒤 2026-09-22에 병합했습니다. 병합 commit은 `66531c7820285b37dc8d1e2961156ab95560758f`입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-023 · L32–32 | - WAITING / PLAYING 공통 대형 board scene, 3–7인 viewer 6시 기준 좌석 회전, compact HUD, site profile avatar, 실제 타원 table border 중심선 기반 좌석 geometry를 현재 main baseline으로 확정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-024 · L33–33 | - 개인 패널의 `내 보유 칩`, 정확한 own chip count/cluster, 오름차순 획득 카드, 동적 overlap, corner number, top-only hover/focus를 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-025 · L34–34 | - TAKE_CARD presentation은 중앙 공개 카드 → 내 보유 카드, 중앙 칩 batch → 내 보유 칩, 이후 draw deck → 다음 current card 순서로 handoff하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-026 · L35–35 | - TAKE 카드/칩 landing과 다음 deal lifecycle을 분리해 same-snapshot rerender 중 획득 카드가 잠깐 사라지거나 이전 카드가 다시 숨겨지는 race condition을 수정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-027 · L36–36 | - 카드 landing 대상은 generic hidden slot이 아니라 `data-card-value` 기준 최신 DOM으로 한정하고, `takeCardLanded / takeChipsLanded` 상태 이후에는 authoritative final hand/chip state를 유지하도록 했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-028 · L37–37 | - deal presentation lifecycle을 `started → running → completed`로 관리하고 실제 landing 전까지 current card를 `is-awaiting-deal`로 숨겨 새 카드와 flight card가 겹치는 문제를 막았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-029 · L38–38 | - `roomId:version:currentCard:deckRemaining` 기반 `lastSettledDealKey`를 기록해 브라우저 최소화/다른 탭 이동 후 `visibilitychange / pageshow` refresh가 발생해도 이미 공개 완료된 카드의 deal animation이 재생되지 않도록 수정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-030 · L39–39 | - 중앙 칩 획득은 TAKE 시점 center count를 고정 batch로 소비하고 약 620ms + 26ms stagger의 단일 Web Animation batch로 처리해 중복/추가 칩처럼 보이는 tail 현상을 정리했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-031 · L40–40 | - draw deck → current card는 약 760ms fixed flight/flip + 약 130ms settle/handoff로 유지하며, 실제 current card DOM은 landing 시점에만 공개합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-032 · L41–41 | - Phase A–D 작업 동안 기능/DB authority와 same-room rematch lifecycle은 기존 main 구현을 보존했고, UI/presentation 결정은 `UI_DESIGN.md`에 반영했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-033 · L44–44 | - 최신 `main` `fda8e2294356...`의 Game Platform Development/UI 규칙과 No Thanks! same-room rematch lifecycle을 현재 UI 작업 브랜치에 통합했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-034 · L45–45 | - 당시 UI_DESIGN 중심 규칙에 따라 UI/presentation 결정을 `UI_DESIGN.md`에 정리했고, #364에서 중복 추가했던 rematch migration/옛 rematch error 계약은 최신 main 구현을 따르도록 제거했습니다. 현재는 해당 문서를 adoption baseline으로 보존하고 후속 결정은 `UI_DECISIONS.md`가 담당합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-035 · L46–46 | - WAITING / PLAYING 공통 대형 board scene, 중앙 타원 table, 3–7인 viewer 6시 고정 표현 회전, compact HUD, site profile avatar 좌석을 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-036 · L47–47 | - 개인 패널에 정확한 내 칩 수와 visual chip cluster, 오름차순 보유 카드, 동적 overlap, corner number, top-only hover/focus를 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-037 · L48–48 | - 현재 카드 직접 클릭으로 take, 중앙 `칩 1개 내기`로 refuse를 수행하며 기존 server-authoritative gameplay action 계약을 그대로 사용합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-038 · L49–49 | - draw deck → current card 공개는 약 760ms fixed flight/flip + 약 130ms landing handoff로 구성했고, chip 제출은 약 780ms flight + 100ms dwell 뒤 중앙 pile/count를 반영합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-039 · L50–50 | - take/refuse 성공 경로는 silent busy lock을 사용해 authoritative result snapshot 기준 전체 render를 1회로 줄였습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-040 · L51–51 | - main의 GAME_OVER host succession / same-room rematch / replacement 참가 가능 계약은 UI 변경보다 우선해 그대로 유지했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-041 · L53–53 | - Game Platform 공통 재대결 규칙에 맞춰 새 room 생성 방식 대신 기존 room/player context를 유지하는 authoritative rematch lifecycle로 전환했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-042 · L54–54 | - `no_thanks_prepare_rematch` RPC가 GAME_OVER → waiting reset, private state/획득 카드 초기화, ready/start 재사용을 처리하도록 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-043 · L55–55 | - GAME_OVER에서 방장이 나가면 남은 active player에게 host를 승계하도록 terminal leave 정책을 보완했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-044 · L56–56 | - rematch lifecycle을 Game Platform DB/Test Contract 필수 시나리오로 승격하고 Can't Stop / No Thanks!가 각각 자기 RPC로 계약을 증명하도록 통합 테스트를 추가했습니다. | 표현:필수 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-045 · L58–58 | - Game Platform UI 규칙 도입에 맞춰 No Thanks!의 원본 디자인 조사 방향, Visual Identity, 카드/칩 layout, motion, result/rematch, responsive 구현 기준을 `UI_DESIGN.md`에 분리해 관리하기 시작했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-046 · L59–59 | - 규칙 엔진 재정렬 PR #347이 병합된 최신 `main` (`049493f8...`)을 기준으로 Phase 3 작업 브랜치를 생성했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-047 · L60–60 | - 기존 #343/#344의 공통 foundation 전체 Registry 목록/개수 고정 변경은 새 Game Platform 규칙에 맞지 않아 가져오지 않았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-048 · L61–61 | - 저장소 `AGENTS.md`와 게임 플랫폼 신규 게임 개발 규칙을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-049 · L62–62 | - `games/shared/`의 공통 계약과 데이터베이스 통합 검증 계약을 확인했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-050 · L63–63 | - AMIGO 공식 No Thanks! 영문 규칙서를 기준으로 첫 버전 규칙을 확정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-051 · L64–64 | - 첫 버전은 3–7인 기본 규칙으로 구현하며 2024년 재판의 22장 특수 카드 확장은 후속 개발 단계로 분리했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-052 · L65–65 | - 공식 규칙의 보유 칩 비공개 원칙을 사용자별 비공개 스냅샷 요구사항에 반영했습니다. | 표현:원칙 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-053 · L66–66 | - 온라인 환경의 선 플레이어는 서버가 무작위로 결정하도록 확정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-054 · L67–67 | - 전체 게임 종료 권한은 방장만 가지도록 확정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-055 · L68–68 | - `games/no-thanks/rules.js`에 순수 규칙 엔진을 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-056 · L69–69 | - 3–5인 11개, 6인 9개, 7인 7개의 시작 칩 계산을 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-057 · L70–70 | - 서버가 준비한 24장 카드 구성을 검증하고 첫 공개 카드와 남은 카드 상태를 초기화하도록 구현했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-058 · L71–71 | - 카드 거절 시 칩 1개 차감, 중앙 칩 증가, 다음 플레이어 이동을 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-059 · L72–72 | - 보유 칩이 0개라면 카드 거절을 허용하지 않고 카드 가져오기만 가능하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-060 · L73–73 | - 카드 가져오기 시 중앙 칩을 획득하고 같은 플레이어가 다음 카드도 계속 처리하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-061 · L74–74 | - 연속된 숫자 묶음에서는 가장 낮은 숫자만 합산하고 남은 칩 수를 차감하는 점수 계산을 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-062 · L75–75 | - 마지막 카드 획득 시 최종 점수와 공동 승자를 계산하고 `GAME_OVER`로 전환하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-063 · L76–76 | - 규칙 엔진이 입력 상태를 직접 변경하지 않고 새 상태를 반환하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-064 · L77–77 | - 규칙 엔진 단위 테스트 12개를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-065 · L78–78 | - 실행 코드가 시작됨에 따라 게임 등록부에 `no-thanks`를 등록했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-066 · L79–79 | - No Thanks! Registry/capability 검증은 공통 foundation이 아니라 게임별 `tests/game-platform-no-thanks-registry.test.js`에서 수행하도록 새 구조에 맞췄습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-067 · L80–80 | - 아직 실제 제공 전이므로 `online`, `local`, `invite`, `presence` 기능은 모두 비활성 상태로 유지했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-068 · L81–81 | - `games/no-thanks/index.html`에 신규 게임 전용 entry page를 추가하고 shared `game-shell.css`를 명시적으로 opt-in 했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-069 · L82–82 | - `createGameAccessGate`를 사이트 `initializeAuth / getAuthState / subscribeAuth`와 연결해 로그인/승인회원 경계를 적용했습니다. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-070 · L83–83 | - 승인된 사용자만 Common Game Shell을 볼 수 있고, 미로그인/미승인 사용자는 사이트 공통 로그인/승인 상태 화면으로 이동할 수 있게 했습니다. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-071 · L84–84 | - 게임별 닉네임 입력을 만들지 않고 사이트 프로필의 `display_name`만 플레이어 표시 이름으로 사용하도록 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-072 · L85–85 | - 프로필 닉네임이 누락된 경우 임시 이름을 생성하지 않고 마이페이지 확인을 안내합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-073 · L86–86 | - 아직 방/로비 서버가 없으므로 방 생성·참가·게임 시작 기능을 노출하지 않고 준비 화면임을 명시했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-074 · L87–87 | - 플레이 전과 화면 하단에서 다시 열 수 있는 No Thanks! 기본 규칙 dialog를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-075 · L88–88 | - No Thanks! entry/shell 전용 정적 계약 테스트를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-076 · L89–89 | - 최신 `main` 커밋 `220bf820...`에서 Phase 4 작업 브랜치를 생성했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-077 · L90–90 | - `no_thanks_rooms / no_thanks_room_players / no_thanks_room_actions / no_thanks_room_private_state` DB foundation을 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-078 · L91–91 | - 3–7인 create/join/snapshot/ready/leave/start RPC와 explicit grant/RLS 경계를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-079 · L92–92 | - 방 생성/참가 시 클라이언트 닉네임을 받지 않고 서버가 승인된 사이트 프로필 `display_name`을 확정하도록 구현했습니다. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-080 · L93–93 | - start RPC가 최소 3명, 방장 권한, non-host ready 상태, expected version을 서버에서 검증하도록 구현했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-081 · L94–94 | - start 시 서버가 turn order와 3–35 카드 순서를 무작위 확정하고 첫 공개 카드만 public state에 노출하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-082 · L95–95 | - 남은 23장, 제외된 9장, 플레이어별 칩 수는 별도 private table에 저장하고 authenticated select/Reatime 대상에서 제외했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-083 · L96–96 | - snapshot은 호출자 자신의 칩 수만 `viewer.counters`로 합성하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-084 · L97–97 | - ready/start에 `client_action_id` + request payload를 기록해 동일 요청 replay는 같은 snapshot을 반환하고 다른 payload 재사용은 거부하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-085 · L98–98 | - shared `defineRoomLobbyAdapter` 계약에 맞는 `createNoThanksRoomLobbyAdapter`를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-086 · L99–99 | - 당시 No Thanks! migration을 disposable Game DB integration harness에 포함하고 플랫폼 필수 10개 시나리오 테스트를 추가했습니다. 이후 same-room rematch 계약이 추가되어 현재 테스트는 11개 필수 시나리오를 구현합니다. | 표현:필수 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-087 · L100–100 | - Phase 4 PR #353 head를 부모로 별도 Phase 5 브랜치를 생성해 DB foundation과 runtime 연결 변경을 분리했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-088 · L101–101 | - No Thanks! entry에 Supabase browser client를 로드하고 `createNoThanksRoomLobbyAdapter`를 실제 runtime에 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-089 · L102–102 | - 방 만들기에서 최대 인원을 3–7명으로 선택하고, 코드 참가에서는 6자리 방 코드만 입력하도록 사용자 흐름을 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-090 · L103–103 | - 게임별 닉네임 입력은 추가하지 않았고 서버가 사이트 프로필 `display_name`을 확정하는 기존 권한 경계를 유지했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-091 · L104–104 | - waiting room에서 authoritative snapshot의 room code, 인원, ready 상태, host를 Common Game Shell roster에 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-092 · L105–105 | - 일반 플레이어는 준비/준비 취소를, 방장은 최소 3명 + 일반 플레이어 전원 ready일 때만 게임 시작을 요청하도록 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-093 · L106–106 | - shared `createSnapshotCoordinator`와 `createReconnectRefreshTriggers`를 사용해 Realtime payload는 invalidation으로만 소비하고 RPC snapshot을 다시 읽도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-094 · L107–107 | - online/pageshow/visibility 복귀 시 최신 snapshot을 다시 조회하고, host가 waiting room을 닫아 `ROOM_NOT_FOUND`가 되면 다른 참가자도 entry로 복귀하도록 처리했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-095 · L108–108 | - 게임 시작 후 서버가 확정한 첫 카드, 본인 칩 수, 남은 카드 수를 읽기 전용 preview로 표시하고 `REFUSE_CARD / TAKE_CARD` UI는 아직 노출하지 않았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-096 · L109–109 | - No Thanks! 전용 lobby controller/runtime model 테스트를 추가하고 기존 shell 계약 테스트를 online lobby 단계에 맞게 갱신했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-097 · L110–110 | - 최신 `main` 커밋 `f47bf8bbb9d016c706b1c289cf4081646ddbabcd`에서 Phase 6 작업 브랜치를 생성했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-098 · L111–111 | - 기존 Room/Lobby foundation migration을 수정하지 않고 후속 gameplay migration `20260922055300_no_thanks_gameplay_actions.sql`을 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-099 · L112–112 | - game-local `no_thanks_play_action` RPC가 `refuse_card / take_card / end_game`을 서버 권위로 처리하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-100 · L113–113 | - gameplay action도 `expected_version + client_action_id`를 사용하고 room/private state를 transaction 안에서 잠가 stale/duplicate/concurrent action을 방어합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-101 · L114–114 | - `REFUSE_CARD`에서 현재 차례와 private counter를 서버가 검증하고 칩 1개 차감, 중앙 칩 증가, 다음 플레이어 이동을 구현했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-102 · L115–115 | - `TAKE_CARD`에서 공개 카드 획득, 중앙 칩 수령, private draw deck의 다음 카드 공개, 같은 플레이어 turn 유지를 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-103 · L116–116 | - 마지막 카드 획득 시 공개 카드와 private counter를 기준으로 연속 카드 점수, 최종 점수, 공동 승자를 서버에서 계산해 `GAME_OVER / LAST_CARD_TAKEN`을 확정합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-104 · L117–117 | - 방장 전용 `END_GAME`을 추가하고 확인 dialog 뒤 서버가 방장 권한을 다시 검증해 `GAME_OVER / HOST_TERMINATED`으로 전환하도록 구현했습니다. 수동 종료 시 최종 점수와 승자는 계산하지 않습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-105 · L118–118 | - 자연 종료 또는 방장 수동 종료 후에는 결과방에서 참가자가 안전하게 leave할 수 있도록 terminal leave 경계를 확장했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-106 · L119–119 | - `createNoThanksGameplayAdapter`를 추가하고 shared Room/Lobby 계약은 변경하지 않은 채 game-local controller에 gameplay command만 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-107 · L120–120 | - 실제 플레이 화면에 현재 카드, 중앙 칩, 본인 칩, 남은 카드, 모든 플레이어의 공개 획득 카드와 현재 차례를 표시하도록 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-108 · L121–121 | - 내 차례에서만 거절/가져오기 버튼을 활성화하고, 본인 칩이 0개라면 거절 버튼을 비활성화해 강제 가져오기 상태를 명확히 표시합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-109 · L122–122 | - 자연 종료 결과 화면에 최종 점수와 공동 승자를 표시하고, 방장 수동 종료는 별도 종료 사유를 표시하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-110 · L123–123 | - gameplay adapter/controller/runtime/shell 정적 테스트와 disposable Supabase gameplay DB integration 시나리오를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-111 · L124–124 | - 동일 `client_action_id` gameplay 요청이 동시에 두 번 도착하는 경우에도 room lock 획득 후 action row를 다시 확인해 첫 authoritative snapshot으로 수렴하도록 idempotency 경계를 보강했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-112 · L125–125 | - concurrent duplicate retry가 둘 다 동일 snapshot을 반환하고 room version은 한 번만 증가하는 disposable DB integration 회귀 테스트를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-113 · L126–126 | - 최신 `main` 커밋 `20bdc844d5bf3012dad38146814a09ae6e057257`에서 Phase 7 안정화 브랜치를 생성했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-114 · L127–127 | - Supabase Realtime Presence를 사용하는 game-local `createNoThanksPresenceAdapter`를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-115 · L128–128 | - Presence key는 브라우저 client 단위로 생성하고 payload에는 `userId / onlineAt`만 전송해 게임 상태나 비공개 칩 정보를 싣지 않도록 했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-116 · L129–129 | - 같은 사용자가 여러 탭으로 접속한 경우 Presence state를 user id 기준으로 합쳐 한 명의 온라인 사용자로 표시하도록 구현했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-117 · L130–130 | - Presence는 온라인/오프라인 UI 표시 전용이며 ready/start/turn/action 권한의 authoritative 조건에는 사용하지 않도록 분리했습니다. | 표현:조건 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-118 · L131–131 | - 브라우저 `offline` 이벤트에서는 게임 상태를 변경하지 않고 connection banner만 오프라인으로 전환하며, `online / pageshow / visibility` 복귀 시 기존 shared reconnect refresh 경로로 authoritative snapshot을 다시 조회합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-119 · L132–132 | - 브라우저 종료·네트워크 단절 시 membership/turn/host 권한을 유지하고 재접속 시 기존 active room snapshot으로 복원하는 정책을 확정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-120 · L133–133 | - 방장이 연결을 잃어도 자동 방장 위임이나 자동 게임 종료를 하지 않고, 현재 차례 플레이어가 끊겨도 turn을 유지해 재접속 후 이어서 진행하도록 UI 안내를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-121 · L134–134 | - roster에 Presence 기반 `재접속 대기` 상태와 현재 차례 표시를 연결했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-122 · L135–135 | - 재대결은 같은 room code와 active membership을 유지하면서 public/private gameplay state를 초기화하고 waiting/ready 상태로 돌아가는 방식으로 변경했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-123 · L136–136 | - 재대결 준비는 host-only authoritative RPC이며 version/client_action_id 경계를 사용하고, 이전 private deck/counter와 획득 카드를 초기화합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-124 · L137–137 | - GAME_OVER에서 방장이 이탈하면 다음 active seat로 host를 승계해 남은 참가자의 재대결 흐름을 유지합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-125 · L138–138 | - Presence lifecycle, 다중 탭 user merge, offline→online refresh, same-room rematch/reconnect 정책에 대한 회귀 테스트를 유지·확장했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-126 · L139–139 | - 최신 `main` 커밋 `2454e5e9d8a76a26002f794f8338255b62aababb`에서 Phase 8 검증 브랜치를 생성했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-127 · L140–140 | - disposable Supabase에서 3개의 독립 승인회원 인증 세션이 같은 room에 참가해 각자 비공개 칩 snapshot을 받고, 세 플레이어가 한 번씩 거절한 뒤 자연 종료까지 진행하는 다중 클라이언트 통합 시나리오를 추가했습니다. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-128 · L141–141 | - 3인 시나리오에서 명시적 leave 없이 `get_my_active_room`으로 재접속했을 때 최신 room/version/turn/center counter가 복원되는지 검증하도록 했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-129 · L142–142 | - disposable Supabase에서 7개의 독립 승인회원 인증 세션이 모두 참가·준비·시작하고, 일곱 플레이어가 한 번씩 거절해 full turn cycle을 만든 뒤 각 viewer의 private counter가 6으로 독립 유지되는지 검증하는 시나리오를 추가했습니다. | 표현:승인,검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-130 · L143–143 | - 7인 시나리오에서 7개 중앙 칩을 현재 플레이어가 가져간 뒤 본인 칩이 13으로 계산되고 같은 플레이어가 turn을 유지하는지 검증하도록 했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-131 · L144–144 | - 3인·7인 모두 다른 플레이어 counter가 public player snapshot에 노출되지 않는지 반복 검증하도록 했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-132 · L145–145 | - 자동 검증과 실제 브라우저/운영 검증을 분리한 `games/no-thanks/RELEASE_CHECKLIST.md`를 추가했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-133 · L146–146 | - 실제 브라우저 Presence join/leave, 모바일 background 복귀, host/active-player disconnect는 자동 DB 테스트가 대체하지 않는 manual release gate로 명시했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-134 · L147–147 | - 운영 Supabase 프로젝트와 main의 `SUPABASE_URL`이 동일한 프로젝트를 가리키는 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-135 · L148–148 | - 운영 DB에 `no_thanks_room_lobby_foundation`과 `no_thanks_gameplay_actions` migration을 순서대로 적용했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-136 · L149–149 | - 브라우저 Realtime invalidation을 위해 공개 테이블 `no_thanks_rooms / no_thanks_room_players`만 `supabase_realtime` publication에 등록하는 migration을 추가·적용했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-137 · L150–150 | - `no_thanks_room_actions / no_thanks_room_private_state`는 Realtime publication에 포함하지 않았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-138 · L151–151 | - 운영 권한 검증에서 anon의 create/play RPC 실행이 차단되고 authenticated만 허용되는 것을 확인했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-139 · L152–152 | - private state table은 anon/authenticated SELECT가 모두 차단되고 공개 room/player table은 RLS가 활성화된 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-140 · L153–153 | - 내부 `private.no_thanks_snapshot` helper가 authenticated에 기본 EXECUTE 권한을 가지고 있는 것을 발견해, private helper 권한 hardening migration을 추가·적용했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-141 · L154–154 | - hardening 후 snapshot/generate/profile/card-score helper는 anon/authenticated 직접 실행이 차단되고, RLS에 필요한 `private.no_thanks_is_room_member`만 authenticated에 유지되는 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-142 · L155–155 | - 운영 적용 후 Supabase security/performance advisor를 다시 실행해 No Thanks! 관련 신규 critical/error 항목이 없음을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Current Work

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-143 · L159–159 | - 첫 공개 버전의 core rules, Room/Lobby, server-authoritative gameplay, Presence/reconnect, same-room rematch, 운영 DB hardening, Phase A–D board UI, opening/final-take/result-rack, sorted hand interaction, BGM/SFX까지 `main`에 반영했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | D07, U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-144 · L160–160 | - 기능 checkpoint 기준으로 **추가 core 개발 phase는 없습니다.** 이후 작업은 `RELEASE_CHECKLIST.md`에 남아 있는 실제 운영 browser/rematch/reconnect/production gate와 Registry activation이며, 새 기능 구현과 분리합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | D09, U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-145 · L161–161 | - 디자인 트랙은 `UI_DECISIONS.md`의 `FINAL / DESIGN_CLOSEOUT`이 기준입니다. NT-UI-001~013이 현재 main의 active design baseline이며 Phase E 후보는 release blocker가 아닌 post-release follow-up입니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-146 · L162–162 | - Registry의 No Thanks! capability는 아직 모두 비활성입니다. release gate 완료 전에는 `online/presence`를 선행 활성화하지 않고, `invite`는 별도 구현·검증 전까지 비활성으로 유지합니다. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | D09, C01/F02 | I / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-147 · L163–163 | - 이후 버그/UX 개선이 필요해지면 이 release-candidate baseline을 출발점으로 최신 `main`에서 새 작업 브랜치를 생성하며, 이미 종료된 과거 브랜치는 재사용하지 않습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Next Work

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-148 · L167–167 | 1. `RELEASE_CHECKLIST.md`의 아직 미확인인 same-room rematch / Presence / reconnect / 실제 데스크톱·모바일 browser gate를 최종 확인합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07, C01/F02 | L / 기존 보존/6 영향확인 | 변경 없음; F02 상태 충돌 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-149 · L168–168 | 2. 문서상 pending인 `20260924073500_no_thanks_randomized_draw_order.sql`의 운영 Supabase 적용/migration history와 승인회원 create/join/snapshot/gameplay smoke를 확인합니다. | 표현:승인 | LOCAL_RULE / L | E-NT | C01/F02, U03 | L / 기존 보존/6 영향확인 | 변경 없음; F02 상태 충돌 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-150 · L169–169 | 3. 운영 DB 권한/RLS/private-state 경계가 release 기준과 일치함을 최종 확인합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-151 · L170–170 | 4. release blocker가 모두 해소되면 별도 activation 작업에서 실제 제공할 `online` 및 필요 시 `presence` capability를 활성화하고 게임 목록 사용자 노출을 검증합니다. `invite`는 별도 구현·검증 전까지 비활성으로 유지합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | D09, C01/F02 | L / 기존 보존/6 영향확인 | 변경 없음; F02 상태 충돌 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-152 · L171–171 | 5. 오픈 직후 실제 세션 오류/로그를 확인하고, 이후 발견되는 UX 개선과 Phase E 후보는 post-release scope로 분리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decisions

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-153 · L175–175 | - 게임 식별자: `no-thanks` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-154 · L176–176 | - 지원 인원: 3–7명 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-155 · L177–177 | - 첫 버전 규칙: 기본 규칙만 구현 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-156 · L178–178 | - 숫자 카드: 3–35 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-157 · L179–179 | - 카드 준비: 33장 중 9장을 비공개로 제외하고 24장을 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-158 · L180–180 | - 규칙 엔진의 초기 카드 입력: 서버가 이미 확정한 24장 순서를 전달 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-159 · L181–181 | - 규칙 엔진 내부에서 난수 생성: 하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-160 · L182–182 | - 시작 칩: 3–5인 11개, 6인 9개, 7인 7개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-161 · L183–183 | - 플레이어 보유 칩 수: 다른 플레이어에게 비공개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-162 · L184–184 | - 현재 카드 위에 쌓인 칩 수: 공개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-163 · L185–185 | - 각 플레이어가 획득한 숫자 카드: 공개 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-164 · L186–186 | - 카드를 가져간 뒤에는 같은 플레이어가 다음 카드도 계속 선택 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-165 · L187–187 | - 카드를 거절하면 다음 플레이어로 차례 이동 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-166 · L188–188 | - 칩이 0개라면 현재 카드를 반드시 가져가야 함 | 표현:반드시 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-167 · L189–189 | - 점수 계산: 연속 숫자 묶음의 가장 낮은 숫자만 합산하고 남은 칩 수를 차감 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-168 · L190–190 | - 최저 점수 동점: 공동 승리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-169 · L191–191 | - 선 플레이어: 서버가 무작위 결정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-170 · L192–192 | - 카드 섞기, 제외 카드, 공개 순서, 칩 사용 가능 여부, 최종 점수는 서버가 최종 판단 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-171 · L193–193 | - 특수 카드: 후속 개발로 보류 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-172 · L194–194 | - 게임 내부 닉네임 입력 또는 변경 기능: 제공하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-173 · L195–195 | - 전체 게임 종료 권한: 방장만 가능 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-174 · L196–196 | - 게임 등록부 기능 상태: 현재 모두 비활성 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | C01/F02 | L / 기존 보존/6 영향확인 | 변경 없음; F02 상태 충돌 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-175 · L197–197 | - Access Gate: shared `createGameAccessGate` 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-176 · L198–198 | - 사용자 표시 이름: 사이트 프로필 `display_name`만 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-177 · L199–199 | - Common Game Shell: shared `createGameShell` 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-178 · L200–200 | - 현재 entry 단계의 플레이어 표시: 승인된 현재 사용자 1명만 접속 계정으로 표시 | 표현:승인 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-179 · L201–201 | - 방 생성/코드 참가/준비/방장 시작 UI: Room/Lobby RPC에 연결 완료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-180 · L202–202 | - 게임 규칙 안내: game-local dialog로 제공하며 entry와 Shell action에서 다시 열 수 있음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-181 · L203–203 | - Room/Lobby DB namespace: `no_thanks_*` game-local 객체 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-182 · L204–204 | - 방 최대 인원: 생성 시 3–7명 범위에서 서버 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-183 · L205–205 | - 방 생성/참가 표시 이름: 클라이언트 입력 없이 서버가 `profiles.display_name` 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-184 · L206–206 | - room 공개 state와 카드/칩 private state를 물리적으로 별도 table로 분리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-185 · L207–207 | - Realtime invalidation: 공개 room/player table만 구독하고 private table은 구독하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-186 · L208–208 | - 게임 시작 조건: 방장 호출 + 3명 이상 + non-host 전원 ready | 표현:조건 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-187 · L209–209 | - 시작 시 서버 난수: turn order와 33장 카드 순서를 서버에서 생성 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-188 · L210–210 | - 공개 카드: 24장 중 첫 카드만 snapshot 공개, 남은 23장/제외 9장은 private | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-189 · L211–211 | - 초기 칩 수: 3–5인 11, 6인 9, 7인 7을 서버 private state에 저장 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-190 · L212–212 | - Room/Lobby runtime 상태: shared Snapshot Coordinator + reconnect refresh trigger 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-191 · L213–213 | - Realtime payload 사용 방식: 화면 state로 직접 사용하지 않고 authoritative snapshot 재조회 신호로만 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D06 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-192 · L214–214 | - entry 입력: 최대 인원 + 방 코드만 제공하고 game-local 닉네임 입력은 제공하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-193 · L215–215 | - waiting room 방장 ready: 별도 버튼 없이 준비 완료로 간주하며 일반 플레이어 전원 ready를 시작 조건으로 계산 | 표현:조건 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-194 · L216–216 | - PLAYING UI: 현재 카드/중앙 칩/본인 칩/남은 카드/공개 획득 카드 표시와 서버 권위 거절/가져오기 action 연결 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-195 · L217–217 | - gameplay RPC: shared 계약을 확장하지 않고 game-local `no_thanks_play_action` 하나에서 `refuse_card / take_card / end_game` 처리 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-196 · L218–218 | - gameplay mutation: room version, active player, private counter/deck을 서버 transaction에서 최종 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-197 · L219–219 | - 자연 종료: 마지막 카드 획득 시 서버가 `GAME_OVER / LAST_CARD_TAKEN`, 최종 점수와 공동 승자를 확정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-198 · L220–220 | - 수동 종료: 방장 확인 dialog + 서버 방장 권한 검증 후 `GAME_OVER / HOST_TERMINATED`, 점수/승자 미계산 | 표현:검증 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-199 · L221–221 | - 결과방 이탈: GAME_OVER에서 허용하고 진행 중 PLAYING에서는 일반 leave를 차단 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-200 · L222–222 | - 연결 끊김 정책: 비정상 disconnect는 leave가 아니며 membership/turn/host 권한을 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-201 · L223–223 | - Presence 용도: 접속 상태 표시 전용이며 server authorization이나 gameplay legality 판정에는 사용하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-202 · L224–224 | - Presence payload: `userId / onlineAt`만 사용하고 game state/private counter는 포함하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-203 · L225–225 | - 다중 탭: client별 Presence key를 사용하고 동일 user id는 온라인 1명으로 합산 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-204 · L226–226 | - 방장 disconnect: 자동 위임·자동 종료 없음, 재접속 시 기존 방장 권한 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-205 · L227–227 | - 현재 차례 플레이어 disconnect: turn을 다른 사용자에게 넘기지 않고 재접속을 기다림 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-206 · L228–228 | - browser offline: local connection UI만 offline으로 표시하고 서버 state는 변경하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-207 · L229–229 | - reconnect: `online / pageshow / visibility` 이벤트에서 authoritative snapshot 재조회 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-208 · L230–230 | - 재대결: GAME_OVER에서 host가 같은 room을 waiting으로 reset하고 기존 active membership / room code 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-209 · L231–231 | - 재대결 참가: 일반 플레이어 ready 재설정 후 기존 start flow 재사용, 이탈자가 있으면 같은 room code로 replacement/rejoin 가능 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-210 · L232–232 | - 자동 multi-client 검증: disposable Supabase에서 독립 auth session 3개/7개를 실제 RPC client로 취급 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-211 · L233–233 | - 3인 자동 시나리오: 전원 snapshot privacy 확인 + full refuse cycle + reconnect snapshot + 자연 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-212 · L234–234 | - 7인 자동 시나리오: 전원 snapshot privacy 확인 + full refuse cycle + private counter 독립성 + take/reconnect | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-213 · L235–235 | - 실제 browser Presence 검증: CI Actions 비용을 늘리는 별도 browser/Supabase workflow를 만들지 않고 release 직전 manual gate로 유지 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-214 · L236–236 | - release gate 기록: `games/no-thanks/RELEASE_CHECKLIST.md` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-215 · L237–237 | - 첫 공개 기능 checkpoint baseline: PR #397 merge commit `616626f53f5fb8554fff8df2e86cc50a22e8aefa` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-216 · L238–238 | - 첫 공개 버전 core development 상태: COMPLETE — 이후 미완료 항목은 release/activation gate로 분리하고 별도 기능 phase를 추가하지 않음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Validation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-217 · L242–242 | - 최신 체크포인트: | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-218 · L243–243 · 부모 LEGACY-NT-DEV-217 |   - PR #396은 release-readiness manual play에서 발견된 첫 action, sorted TAKE landing, adaptive hand spacing, focus/visibility deal replay 문제를 game-local presentation 범위에서 수정했고 Game Platform governance #573을 통과한 뒤 main에 병합했습니다. merge commit: `2666267f673e2035ceb678ab950cc889ee188c09`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-219 · L244–244 · 부모 LEGACY-NT-DEV-217 |   - PR #397은 Rules Guide 0칩 의미 명확화, BGM 역할 교체, opening/TAKE/refuse tactile SFX와 후속 볼륨·타이밍 조정을 포함했고 Game Platform governance #580을 통과한 뒤 main에 병합했습니다. merge commit `616626f53f5fb8554fff8df2e86cc50a22e8aefa`가 현재 **기능 release-candidate handoff baseline**입니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-220 · L245–245 · 부모 LEGACY-NT-DEV-217 |   - 사용자는 2026-09-25까지 실제 멀티플레이 환경에서 여러 차례 플레이 테스트를 수행했다고 확인했습니다. 다만 이 사실만으로 `RELEASE_CHECKLIST.md`의 reconnect/7-client/mobile/background 등 개별 수동 gate를 자동 완료 처리하지 않습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-221 · L246–246 · 부모 LEGACY-NT-DEV-217 |   - randomized draw-order migration은 disposable DB에서 3~35 전체 카드 집합 보존 + 비정렬 저장을 회귀 검증했습니다. 문서상 운영 Supabase 적용 확인은 release gate로 유지합니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-222 · L247–247 · 부모 LEGACY-NT-DEV-217 |   - No Thanks! Registry는 현재 `capabilities: {}`로 해석되어 `online/local/invite/presence` 모두 비활성 상태를 유지합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-223 · L248–248 · 부모 LEGACY-NT-DEV-217 |   - 디자인 checkpoint는 NT-UI-001~013을 현재 active baseline으로 확정하고 `FINAL / DESIGN_CLOSEOUT`으로 되돌립니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-224 · L249–249 | - 완료: | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-225 · L250–250 · 부모 LEGACY-NT-DEV-224 |   - Phase A–D 최종 브랜치 head `71ac396077628e53bebe1bbbc862c1c7383f64b9`를 당시 최신 main과 동기화한 상태에서 PR #364가 mergeable / behind 0임을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-226 · L251–251 · 부모 LEGACY-NT-DEV-224 |   - 최종 브랜치에서 Game Platform JavaScript syntax, shared module link, Game Platform contract tests, Governance Guard와 `build-assets`가 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-227 · L252–252 · 부모 LEGACY-NT-DEV-224 |   - PR #364 병합 후 main commit `66531c7820285b37dc8d1e2961156ab95560758f`에서 `build`, 전체 `site-checks`, `report-build-status`, `deploy`가 모두 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-228 · L253–253 · 부모 LEGACY-NT-DEV-224 |   - 병합 후 전체 site-checks에서 Game Platform contracts뿐 아니라 The Game rules, Marble foundation, Web Push/signup/admin/activity 권한 검사, module/link/file-integrity 검사까지 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-229 · L254–254 · 부모 LEGACY-NT-DEV-224 |   - Phase 3 작업 브랜치를 관리자 후보 조회 안정화 PR #348까지 반영된 최신 `main` 커밋 `049493f8964f2424a7669290ae733d6e388c799b`에 다시 동기화했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-230 · L255–255 · 부모 LEGACY-NT-DEV-224 |   - 기존 #344의 공통 foundation 전체 Registry ID/개수 고정 변경을 폐기하고 No Thanks! Registry 검증을 게임별 테스트로 분리했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-231 · L256–256 · 부모 LEGACY-NT-DEV-224 |   - PR #347은 최신 `main` 동기화 전 Game Platform governance를 통과했고, 동기화 후 동일 검증을 다시 수행합니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-232 · L257–257 · 부모 LEGACY-NT-DEV-224 |   - Game Platform JavaScript syntax check, 사이트 ↔ `games/shared` module link check, `npm run test:game-platform`, Governance Guard가 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-233 · L258–258 · 부모 LEGACY-NT-DEV-224 |   - Phase 3 PR #349에서 신규 `index.html / main.js / styles.css`의 JavaScript syntax와 module link 검증이 통과했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-234 · L259–259 · 부모 LEGACY-NT-DEV-224 |   - `tests/game-platform-no-thanks-shell.test.js`를 포함한 `npm run test:game-platform` 전체 계약 테스트가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-235 · L260–260 · 부모 LEGACY-NT-DEV-224 |   - Access Gate의 인증 필요/승인 필요 사유를 runtime에서 명시적으로 분기하고 알 수 없는 접근 상태는 별도 오류 화면으로 처리하도록 보완했습니다. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-236 · L261–261 · 부모 LEGACY-NT-DEV-224 |   - 최신 Phase 3 head의 Game Platform Governance Guard가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-237 · L262–262 · 부모 LEGACY-NT-DEV-224 |   - Phase 4 Room/Lobby adapter 정적 계약 테스트와 private-state 경계 테스트가 `npm run test:game-platform`에서 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-238 · L263–263 · 부모 LEGACY-NT-DEV-224 |   - disposable Supabase에서 No Thanks! migration을 replay하고 플랫폼 DB/Test Contract 10개 시나리오를 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-239 · L264–264 · 부모 LEGACY-NT-DEV-224 |   - 첫 DB integration 실행에서 seat 빈자리 계산 alias가 모호해 join 시 `seat = null`이 되는 문제를 발견했고, `generate_series ... as s(seat)`로 명시해 수정한 뒤 재검증했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-240 · L265–265 · 부모 LEGACY-NT-DEV-224 |   - 수정 후 Game DB integration의 No Thanks! 시나리오와 기존 게임 DB integration 전체가 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-241 · L266–266 · 부모 LEGACY-NT-DEV-224 |   - 최신 Phase 4 code head에서 Site static checks와 Game Platform governance가 모두 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-242 · L267–267 · 부모 LEGACY-NT-DEV-224 |   - Phase 5 stacked PR #354에서 No Thanks! lobby controller/runtime model/shell 계약 테스트를 포함한 `npm run test:game-platform`이 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-243 · L268–268 · 부모 LEGACY-NT-DEV-224 |   - Phase 5 최신 code head의 Game Platform JavaScript syntax, site ↔ `games/shared` module link, Governance Guard가 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-244 · L269–269 · 부모 LEGACY-NT-DEV-224 |   - Phase 5는 DB/schema 변경이 없으므로 disposable Game DB integration은 #353에서 검증된 Room/Lobby foundation 결과를 그대로 전제로 하며 별도 DB workflow는 실행되지 않았습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-245 · L270–270 · 부모 LEGACY-NT-DEV-224 |   - Phase 5는 `games/**`와 `tests/game-platform-*.test.js` 범위만 변경해 CI 경계 정책에 따라 전체 Site static checks는 실행하지 않았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-246 · L271–271 · 부모 LEGACY-NT-DEV-224 |   - PR #354 자동 리뷰에서 command 응답보다 늦게 도착한 stale refresh가 최신 ready/start 상태를 덮을 수 있는 race condition을 발견했고, 현재 렌더 snapshot보다 낮은 version은 game-local controller에서 거부하도록 수정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-247 · L272–272 · 부모 LEGACY-NT-DEV-224 |   - stale refresh가 command의 최신 snapshot을 덮지 못하는 회귀 테스트를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-248 · L273–273 · 부모 LEGACY-NT-DEV-224 |   - 방장 waiting-room 이탈은 전체 대기실을 닫는 파괴적 동작이므로 즉시 RPC를 호출하지 않고 명시적 `방 닫기` 확인 dialog를 거치도록 수정했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-249 · L274–274 · 부모 LEGACY-NT-DEV-224 |   - No Thanks! standalone HTML에 남아 있던 literal `\\n` 문자를 실제 줄바꿈으로 수정하고 회귀 테스트를 추가했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-250 · L275–275 · 부모 LEGACY-NT-DEV-224 |   - 위 리뷰 수정이 포함된 최신 head에서도 JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard가 모두 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-251 · L276–276 · 부모 LEGACY-NT-DEV-224 |   - Phase 6 PR #356에서 server-authoritative gameplay adapter/controller/runtime/shell 계약을 포함한 Game Platform governance가 성공했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-252 · L277–277 · 부모 LEGACY-NT-DEV-224 |   - Phase 6 변경을 포함한 Site static checks 전체 회귀 검증이 성공했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-253 · L278–278 · 부모 LEGACY-NT-DEV-224 |   - disposable Supabase에서 Room/Lobby foundation + gameplay migration을 순서대로 replay하고 기존 플랫폼 필수 시나리오와 추가 gameplay 시나리오가 모두 성공했습니다. | 표현:필수 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-254 · L279–279 · 부모 LEGACY-NT-DEV-224 |   - gameplay DB 검증에서 active-player refuse, private counter 감소, center counter 증가, turn 이동, take 후 중앙 칩 수령과 same-player turn 유지, concurrent conflict single commit, 마지막 카드 점수/공동 승자, host-only manual termination, terminal leave를 확인했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-255 · L280–280 · 부모 LEGACY-NT-DEV-224 |   - `p_expected_version = null` 직접 RPC 호출도 `VERSION_CONFLICT`로 거부되는 것을 검증했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-256 · L281–281 · 부모 LEGACY-NT-DEV-224 |   - 동일 `client_action_id`의 concurrent duplicate retry가 동일 authoritative snapshot으로 수렴하고 version을 두 번 증가시키지 않는 것을 검증했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-257 · L282–282 · 부모 LEGACY-NT-DEV-224 |   - Phase 7 PR #358의 최신 code head에서 Game Platform JavaScript syntax가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-258 · L283–283 · 부모 LEGACY-NT-DEV-224 |   - Phase 7 PR #358의 site ↔ `games/shared` module link 검증이 통과했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-259 · L284–284 · 부모 LEGACY-NT-DEV-224 |   - Presence lifecycle, 다중 탭 user merge, offline→online refresh를 포함한 당시 Phase 7 `npm run test:game-platform` 전체 계약 테스트가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-260 · L285–285 · 부모 LEGACY-NT-DEV-224 |   - same-room rematch, terminal host succession, replacement restart를 포함한 최신 `npm run test:game-platform`이 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-261 · L286–286 · 부모 LEGACY-NT-DEV-224 |   - 최신 Site static checks가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-262 · L287–287 · 부모 LEGACY-NT-DEV-224 |   - isolated Supabase Game DB integration에서 No Thanks! same-room rematch 계약과 기존 Can't Stop rematch 계약이 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-263 · L288–288 · 부모 LEGACY-NT-DEV-224 |   - Game Platform Governance Guard가 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-264 · L289–289 · 부모 LEGACY-NT-DEV-224 |   - Phase 7은 DB schema/RPC를 변경하지 않아 disposable Game DB integration은 실행 대상이 아닙니다. 서버 DB 경계는 Phase 6의 성공 결과를 그대로 유지합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-265 · L290–290 · 부모 LEGACY-NT-DEV-224 |   - 최신 main 대비 뒤처짐 없이 PR #358이 mergeable 상태임을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-266 · L291–291 · 부모 LEGACY-NT-DEV-224 |   - 운영 DB migration history에 `no_thanks_room_lobby_foundation / no_thanks_gameplay_actions / no_thanks_realtime_publication / no_thanks_private_helper_permissions`가 기록된 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-267 · L292–292 · 부모 LEGACY-NT-DEV-224 |   - 운영 DB에서 `no_thanks_rooms / no_thanks_room_players / no_thanks_room_actions / no_thanks_room_private_state` RLS 활성 상태를 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-268 · L293–293 · 부모 LEGACY-NT-DEV-224 |   - authenticated는 공개 room/player SELECT와 public RPC 실행 권한만 가지며 private-state SELECT와 private snapshot helper 실행은 차단된 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-269 · L294–294 · 부모 LEGACY-NT-DEV-224 |   - Realtime publication에는 공개 room/player 두 테이블만 등록된 것을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-270 · L295–295 · 부모 LEGACY-NT-DEV-224 |   - Game Platform-only PR이므로 개선된 CI 규칙에 따라 무관한 전체 Site static checks는 실행하지 않았습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-271 · L296–296 · 부모 LEGACY-NT-DEV-224 |   - `package.json`에서 게임 플랫폼 관련 검증 명령이 `npm run test:game-platform`임을 확인했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-272 · L297–297 · 부모 LEGACY-NT-DEV-224 |   - 새 `rules.js`와 단위 테스트 파일에 `node --check`를 실행해 문법 오류가 없음을 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-273 · L298–298 · 부모 LEGACY-NT-DEV-224 |   - `node --test tests/game-platform-no-thanks-rules.test.js`에 해당하는 동일 파일 구성을 로컬 검증 환경에서 실행했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-274 · L299–299 · 부모 LEGACY-NT-DEV-224 |   - 규칙 엔진 단위 테스트 12개가 모두 통과했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-275 · L300–300 · 부모 LEGACY-NT-DEV-224 |   - 실제 브랜치의 `rules.js`, 단위 테스트, 게임 등록부 파일과 로컬 검증 파일의 Git blob SHA가 각각 일치하는지 확인했습니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-276 · L301–301 · 부모 LEGACY-NT-DEV-224 |   - 게임 등록부의 `no-thanks` 항목이 `platform: "shared"`이고 모든 기능 활성화 값이 `false`로 해석되는지 확인했습니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | C01/F02 | H / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-277 · L302–302 · 부모 LEGACY-NT-DEV-224 |   - 당시 `GAME_SPEC.md`와 `DEVELOPMENT.md`의 필수 섹션을 유지했습니다. 이후 플랫폼 규칙은 `UI_DESIGN.md`와 `UI_DECISIONS.md`를 추가한 네 문서 체계로 발전했습니다. | 표현:필수 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-278 · L303–303 | - 이번 단계에서 아직 수행하지 않는 검증: | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-279 · L304–304 · 부모 LEGACY-NT-DEV-278 |   - 승인회원 계정의 운영 create/join/snapshot/gameplay 브라우저 smoke test | 표현:승인 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-280 · L305–305 · 부모 LEGACY-NT-DEV-278 |   - 실제 데스크톱/모바일 브라우저의 Presence/reconnect 멀티플레이 점검 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-281 · L306–306 | - 운영 Supabase migration, 권한/RLS/private-state 비노출, Realtime publication 구조 검증은 완료했습니다. 남은 항목은 실제 브라우저 동작 확인입니다. | 표현:검증 | LOCAL_HISTORY / H | E-NT | U03 | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Known Issues / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-282 · L310–310 | - Game Platform 공통 재대결 규칙 영향도 감사에서 확인된 `MIGRATION_REQUIRED` 항목은 이번 same-room rematch 구현으로 해소했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | D07 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-283 · L312–312 | - 승인회원 접근 제어부터 Room/Lobby, server-authoritative gameplay action, 자연 종료와 방장 수동 종료 UI까지 연결했습니다. | 표현:승인 | LOCAL_CONTEXT / I | E-NT | U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-284 · L313–313 | - Room/Lobby, gameplay, Realtime publication, private helper permission hardening migration을 운영 Supabase에 적용했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-285 · L314–314 | - 게임 등록부에는 등록되어 있지만 모든 기능 활성화 값이 비활성 상태이며 출시된 게임으로 취급하지 않습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | D09, C01/F02 | I / 참고/권위 승격 금지 | 변경 없음; F02 상태 충돌 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-286 · L315–315 | - 특수 카드 확장은 기본 규칙 첫 버전 이후 별도 설계가 필요합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-287 · L316–316 | - 비정상 disconnect와 Presence 정책은 Phase 7~8에서 검증했습니다. 재대결 정책은 Game Platform 공통 규칙에 맞춰 same-room lifecycle로 변경했고 자동 DB/contract 검증을 완료했습니다. 실제 브라우저 Presence/모바일 복귀/rematch 검증은 release manual gate로 남아 있습니다. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | D07, U03 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-DEV-288 · L317–317 | - Phase A–D 구현 브랜치는 이미 PR #364로 main에 병합됐으며 후속 구현에서는 해당 종료 브랜치를 재사용하지 않습니다. 다음 구현 시에는 먼저 No Thanks! 관련 진행 중 브랜치 존재 여부를 확인합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Release closeout 안내

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-DEV-289 · L321–321 | 게임을 운영 환경에 공개해 `Status: RELEASED`로 전환할 때는 이 안내 부분을 실제 날짜가 있는 출시 기록으로 교체합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-290 · L323–330 | ```text<br>## Release — YYYY-MM-DD<br><br>- 운영 환경 기능 활성화와 마이그레이션 요약<br>- 현재 게임 등록부 기능 상태<br>- 핵심 검증 결과<br>- 유지보수 기준과 남은 확인 사항<br>``` | 표현:검증 | LOCAL_RULE / L | E-NT | D09, C01/F02, U03 | L / 기존 보존/6 영향확인 | 변경 없음; F02 상태 충돌 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-DEV-291 · L332–332 | `RELEASED` 상태에서는 `Active branch: main`을 사용하고, 과거 작업 브랜치를 현재 기준으로 남기지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### NT-UI — `games/no-thanks/UI_DESIGN.md`

- source: [games/no-thanks/UI_DESIGN.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/UI_DESIGN.md)
- blob: `6d956599f9dfc11fade9a082d68ddec4be05bea2`; 원문 132줄; 상태 `ADOPTION_BASELINE`; 88 관리단위 / 70 규칙·필드 단위.


#### No Thanks! UI Design

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-001 · L3–6 | &gt; 이 문서는 UI_DECISIONS 체계 도입 전에 이미 진행된 No Thanks! UI 작업을 기준으로 고정한 **adoption baseline**입니다. 신규 게임의 pre-development UI_DESIGN과 달리, 도입 이전 구현·수정 결과가 일부 함께 포함되어 있을 수 있으며 과거를 추측해 억지로 분리하지 않습니다.<br>&gt; 플랫폼 공통 기준은 `docs/game-platform-ui-rules.md`, 기능 규칙은 `GAME_SPEC.md`, 개발 시작 후의 디자인 수정·결정·검증과 baseline override는 `UI_DECISIONS.md`, 기능 구현 진행은 `DEVELOPMENT.md`에서 관리합니다.<br>&gt;<br>&gt; adoption 이후 또는 과거 기록 복원으로 확인된 디자인 변경은 `UI_DECISIONS.md`의 최신 non-superseded 결정이 우선합니다. 이 문서의 기존 Phase 문구를 근거로 이미 반영된 수정 사항을 원복하지 않습니다. | 표현:검증 | LOCAL_RULE / L | E-NT | D04, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Design Research

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-002 · L10–10 | - Target edition / visual baseline: 기본 숫자 카드와 칩 중심의 No Thanks! 정체성을 우선하며, 특정 재판의 보호되는 일러스트/로고를 그대로 복제하지 않습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-003 · L11–11 | - Official / publisher sources: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-004 · L12–12 · 부모 LEGACY-NT-UI-003 |   - AMIGO 공식 영문 규칙서: https://blog.amigo-spiele.de/content/ap/rule/02455-GB-AmigoRule.pdf | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-005 · L13–13 · 부모 LEGACY-NT-UI-003 |   - AMIGO 공식 제품 페이지: https://www.amigo-spiele.de/no-thanks_2455_1247 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-006 · L14–14 | - Additional references: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-007 · L15–15 · 부모 LEGACY-NT-UI-006 |   - Board Game Arena 규칙 요약: https://en.doc.boardgamearena.com/Gamehelpnothanks | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-008 · L16–16 | - 조사/구현 대상 구성물: 숫자 카드, 중앙 카드, 카드 위 공개 칩 더미, 플레이어 보유 카드 묶음, 플레이어 프로필/비공개 칩 상태 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-009 · L17–17 | - 핵심 관찰: 복잡한 보드보다 큰 숫자 카드와 칩의 선택이 중심이며, 카드 숫자는 겹쳐도 읽히는 정보 계층이 중요합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-010 · L18–18 | - Last reviewed: 2026-09-22 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Copyright / Asset Usage

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-011 · L22–22 | - Directly usable: 직접 제작한 CSS shape, 숫자/텍스트, 라이선스가 확인된 일반 아이콘 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-012 · L23–23 | - Recreate / reinterpret: 원본 카드의 정보 계층, 시그니처 컬러 관계, 카드/칩의 물리적 느낌 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-013 · L24–24 | - Do not use directly: 사용 허가가 확인되지 않은 공식 로고, 박스/카드 일러스트, 제품 사진 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-014 · L25–25 | - License / attribution notes: 최종 polish에서 특정 판본의 정확한 색/그래픽을 차용하기 전에 공식 자산 사용 조건을 다시 확인합니다. | 표현:조건 | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Visual Identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-015 · L29–29 | - Primary color: 목표 판본 조사에서 확인한 카드 중심 시그니처 컬러를 기준으로 확정 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-016 · L30–30 | - Secondary color: 카드/칩과 충돌하지 않는 중립 계열 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-017 · L31–31 | - Accent color: 현재 차례, 선택 가능 action, 중요한 칩 이동에 제한적으로 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-018 · L32–32 | - Background color: 카드와 칩이 테이블 위 구성물처럼 분리되어 보이는 game-local 배경 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-019 · L33–33 | - Typography direction: 큰 숫자를 최우선 정보로 읽을 수 있는 굵고 단순한 숫자 표현 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-020 · L34–34 | - Symbols / patterns: 과도한 장식보다 카드/칩 자체를 상징 요소로 사용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-021 · L35–35 | - Material / texture: 카드와 플라스틱/목재 칩의 물리감을 가볍게 전달 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-022 · L36–36 | - Visual keywords: 숫자 카드, 칩, 긴장감, 간결함, 테이블 게임 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Page Identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-023 · L40–40 | - 게임 목록에서 진입하면 청파 같이 일반 카드 UI가 아니라 No Thanks! 전용 table/game frame으로 전환합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-024 · L41–41 | - lobby부터 gameplay까지 같은 배경, 타이포그래피, 카드/칩 언어를 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-025 · L42–42 | - 사이트 공통 identity/접근 경계는 유지하되 header와 panel의 시각 표현은 게임-local 테마에 맞춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-026 · L43–43 | - loading/reconnect/error도 generic 흰 카드가 아니라 같은 game frame 안에서 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Lobby / Setup Design

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-027 · L47–47 | - 방 생성/참가와 준비 완료는 플랫폼 공통 lifecycle을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-028 · L48–48 | - 프로필 이미지와 닉네임을 플레이어 seat/패널의 핵심 identity로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D05, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-029 · L49–49 | - host/ready 상태는 layout을 흔들지 않는 badge/tint로 표현합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-030 · L50–50 | - 규칙 보기는 gameplay 이전에 항상 접근 가능하게 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-031 · L51–51 | - 시작 action은 방장에게만 명확히 노출하고 준비 미완료 이유를 함께 이해할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Gameplay Layout

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-032 · L55–55 | - WAITING과 PLAYING은 같은 대형 직사각형 game board scene을 사용하고, 중앙에는 타원형 table을 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-033 · L56–56 | - 3–7인 좌석은 authoritative seat/turn order를 바꾸지 않고 viewer 기준 표현 순서만 회전해 자신의 좌석이 항상 6시 방향에 오게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-034 · L57–57 | - 좌석 프로필 이미지의 중심점이 타원형 테이블의 실제 외곽 테두리 중심선에 오도록 배치하고, 현재 차례 avatar만 약 30% 확대해 턴을 읽게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-035 · L58–58 | - 보드 우측 상단에는 room code / 인원 / ready / connection / host를 compact HUD로 표시하며, board mode에서는 공통 대형 sidebar roster를 숨깁니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-036 · L59–59 | - 모바일에서도 host/ready/connection 상태는 compact indicator로 유지하고 핵심 상태를 통째로 숨기지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-037 · L60–60 | - 보드 아래 개인 패널은 보드와 같은 폭을 사용하며 desktop chip 열은 약 192px, hand 영역은 많은 카드를 수용하도록 동적 overlap을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-038 · L61–61 | - 보유 카드는 좌상단/우하단 숫자를 유지하고 hover/focus 시 위로만 들어 올려 인접 카드 숫자를 가리지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-039 · L62–62 | - 중앙에는 deck / 현재 공개 카드 / 공개 칩 더미가 하나의 핵심 zone으로 보이게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-040 · L63–63 | - 각 플레이어가 가져간 카드는 개인 패널에서 포커 카드처럼 일부 겹쳐 정리할 수 있게 하되 숫자 식별성을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-041 · L64–64 | - 겹치는 카드에서도 숫자를 읽을 수 있도록 최소 왼쪽 상단 정보가 항상 노출되게 설계하고, 필요하면 반대 모서리 정보도 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-042 · L65–65 | - 현재 카드의 칩과 플레이어 개인 칩의 공개/비공개 경계를 시각적으로 구분합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-043 · L66–66 | - 핵심 action은 거절과 카드 가져오기에 집중하고 부가 controls가 경쟁하지 않게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Components

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-044 · L70–70 | - Cards: 실제 카드 비율과 큰 숫자 중심. 많은 카드가 생겨도 겹침 상태에서 숫자를 읽을 수 있어야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-045 · L71–71 | - Chips / tokens: 이동 출발점과 도착점이 명확한 실물 구성물처럼 표현합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-046 · L72–72 | - Dice / pieces: 해당 없음 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-047 · L73–73 | - Player panel: 프로필, 공개 카드, 현재 턴/준비 상태를 수용하고 과도한 높이 증가를 막습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-048 · L74–74 | - Buttons: 게임 시그니처 컬러를 사용하되 action priority가 명확해야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-049 · L75–75 | - Modal / dialog: 규칙/종료 확인 등 기능은 유지하되 game-local visual language를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-050 · L76–76 | - Status / event message: 플레이 흐름을 방해하는 고정 카드 대신 짧은 overlay/message presentation을 우선합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-051 · L77–77 | - Result component: 최종 점수와 승자를 카드/칩 언어 안에서 보여줍니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Motion / Interaction

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-052 · L81–81 | - 카드 공개: draw deck의 실제 위치에서 별도 fixed flight card가 출발해 약 760ms 동안 arc 이동과 flip을 수행합니다. presentation effect는 시작 시점이 아니라 landing 완료 시점까지 유지하며, 동일 snapshot 재렌더가 중간에 발생해도 실제 current card는 `is-awaiting-deal` 상태로 숨겨 둡니다. 이동 카드가 도착한 프레임에 최신 current-card DOM을 공개하고 약 130ms settle/fade로 handoff합니다. landing 완료 시 `roomId:version:currentCard:deckRemaining` 기반 settled deal key를 기록하며, 브라우저 visibility/pageshow reconnect refresh 또는 같은 페이지의 controller 재구성으로 동일 authoritative snapshot을 다시 받아도 이미 settled된 deal은 재생하지 않습니다. deck visual depth는 남은 카드 단계 규칙으로만 변합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-053 · L82–82 | - 칩 제출: 약 26px token이 플레이어 seat에서 중앙 pile까지 약 780ms 이동하고, 도착 후 약 100ms landing dwell을 거친 뒤 presentation count를 authoritative 최종 값으로 handoff합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-054 · L83–83 | - 카드 가져오기: TAKE_CARD 직전 중앙 공개 카드와 실제 중앙 칩 DOM을 fixed overlay로 보존해 authoritative snapshot render 때 원본이 먼저 사라져 보이지 않게 합니다. 공개 카드는 개인 패널의 기존 보유 카드가 없으면 맨 왼쪽, 있으면 현재 가장 오른쪽 카드 다음 transient slot으로 The Game과 같은 22% / 50% / 78% / 94% arc timing을 따라 이동·안착합니다. 카드 landing과 chip landing은 뒤이어 실행되는 deal effect와 별도 상태로 기록합니다. 한 번 안착한 카드는 다음 카드 deal 중 동일 snapshot 재렌더가 발생해도 다시 `is-awaiting-take-landing` 상태로 돌아가지 않으며, landing 대상은 해당 card value의 최신 DOM만 선택합니다. 중앙 칩은 TAKE 시점의 authoritative center count를 batch count로 고정하고 그 수만 한 번 소비합니다. 부루마블 money transfer처럼 각 visible chip의 실제 출발 위치에서 내 보유 칩 영역으로 짧은 stagger 곡선 이동을 수행하며, batch 전체가 끝난 같은 task에서 overlay를 제거하고 개인 칩 count/cluster를 authoritative 최종 값으로 handoff합니다. 카드/칩 handoff가 끝난 뒤에만 draw deck의 다음 카드 공개 motion을 시작합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-055 · L84–84 | - turn transition: action 완료 presentation 이후 다음 active player를 강조합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-056 · L85–85 | - timing 원칙: 상태 숫자 증가가 구성물 도착보다 먼저 보여 원인/결과가 뒤집히지 않게 합니다. | 표현:원칙 | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-057 · L86–86 | - server-authoritative state와 presentation의 동기화 기준: 서버 결과가 truth이며 animation은 그 결과를 설명하는 presentation layer로만 동작합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-058 · L87–87 | - sound: 칩/카드 행동을 보조하되 브라우저 autoplay 정책과 사용자 음소거 선택을 존중합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Result / Rematch Presentation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-059 · L91–91 | - 최종 점수의 카드 합, 남은 칩 차감, 공동 승리를 읽을 수 있어야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-060 · L92–92 | - 재대결은 새 방 생성이 아니라 동일 room/player context에서 준비 상태로 전환되는 흐름을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-061 · L93–93 | - same-room rematch가 authoritative lifecycle로 구현되어 room code와 active membership을 유지하고 이전 gameplay/private state만 초기화합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-062 · L94–94 | - rematch 준비 화면도 동일한 No Thanks! page identity 안에 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07, 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-063 · L95–95 | - 각 플레이어 ready 상태와 방장의 시작 가능 조건을 명확히 표현합니다. | 표현:조건 | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-064 · L96–96 | - 재대결하지 않는 플레이어는 방 나가기 action을 사용할 수 있어야 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Responsive Strategy

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-065 · L100–100 | - Desktop: 중앙 카드/칩 zone과 플레이어 패널을 동시에 읽는 것을 우선합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-066 · L101–101 | - Tablet: 핵심 중앙 zone을 고정하고 플레이어 영역 밀도를 조정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-067 · L102–102 | - Mobile: 행동 버튼과 현재 카드가 첫 화면에서 우선 보이게 하고, 개인 카드가 많아질수록 overlap/scroll 전략을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-068 · L103–103 | - 작은 높이 화면: 고정 패널 때문에 매 턴 상하 스크롤이 필요하지 않도록 최대 높이와 내부 overflow를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-069 · L104–104 | - 많은 카드/토큰: 카드 overlap과 숫자 corner visibility로 수용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-070 · L105–105 | - touch / accessibility: hover 없이 모든 핵심 action을 사용할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Implementation Plan

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-071 · L109–109 | 1. 대상 판본/공식 시각 자료와 자산 사용 가능 범위를 최종 확인합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-072 · L110–110 | 2. 게임 전체 background/page frame과 card/chip visual token을 확정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-073 · L111–111 | 3. lobby/setup을 game-local Visual Identity로 통일합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-074 · L112–112 | 4. 중앙 card/chip zone과 플레이어 카드 overlap layout을 완성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-075 · L113–113 | 5. card flip / chip travel / take-card sequencing을 authoritative state와 맞춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-076 · L114–114 | 6. result/rematch 화면을 같은 디자인 언어로 연결합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-077 · L115–115 | 7. desktop/mobile에서 높이, overlap, interaction timing을 실제 멀티플레이로 검증합니다. | 표현:검증 | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Validation Checklist

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-078 · L119–119 | - &#91; &#93; 목표 판본의 공식 디자인 자료와 palette를 최종 교차 확인했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-079 · L120–120 | - &#91; &#93; 직접 사용하는 자산의 권리 상태를 확인했다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-080 · L121–121 | - &#91; &#93; 일반 청파 같이 페이지가 아니라 No Thanks! 전용 게임 공간으로 느껴진다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-081 · L122–122 | - &#91; &#93; 카드가 많이 쌓여도 숫자를 식별할 수 있다. | 표현:할 수 있다 | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-082 · L123–123 | - &#91; &#93; 칩 이동이 출발 → 이동 → 도착 → count 반영 순서로 이해된다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-083 · L124–124 | - &#91; &#93; 카드 공개가 deck → 이동 → flip → 공개 완료 순서로 이해된다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-084 · L125–125 | - &#91; &#93; lobby → gameplay → result/rematch가 하나의 Visual Identity를 유지한다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-085 · L126–126 | - &#91; &#93; desktop/mobile에서 핵심 action과 정보가 한 화면 흐름으로 유지된다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UI-086 · L127–127 | - &#91; &#93; UI_DECISIONS.md가 adoption baseline 이후의 실제 UI 결정·검증·후속 작업을 추적한다. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | 기존 adoption; override 병독 | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Open Questions / Deferred

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UI-087 · L131–131 | - 특정 AMIGO 판본을 최종 visual baseline으로 고정할지, 원본의 기능적 특징만 재해석할지 최종 polish 전에 확정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UI-088 · L132–132 | - 공식 로고/제품 artwork는 명시적인 사용 근거가 확인되기 전까지 직접 사용하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 기존 adoption; override 병독 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### NT-UID — `games/no-thanks/UI_DECISIONS.md`

- source: [games/no-thanks/UI_DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/UI_DECISIONS.md)
- blob: `65437a239c6d9ac2bdb40191bd0f6e5a388b3ead`; 원문 330줄; 상태 `GAME_LOCAL`; 271 관리단위 / 117 규칙·필드 단위.


#### No Thanks! UI Decisions

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-001 · L3–7 | &gt; 이 문서는 No Thanks!의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.<br>&gt; `UI_DESIGN.md`는 UI_DECISIONS 체계 도입 시점의 No Thanks! **adoption baseline**입니다. 개발 시작 후 확정된 이 문서의 최신 non-superseded 결정이 같은 항목에서는 우선하며, 현재 유효 디자인은 baseline + decision overrides로 해석합니다. 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.<br>&gt; 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.<br>&gt;<br>&gt; 이 문서 체계 도입 전 No Thanks!는 여러 UI 수정과 일부 미병합/종료 PR을 거쳤으므로 과거 세부 결정이 완전하게 보존되어 있지 않습니다. 이 baseline에서 누락된 과거 결정을 임의로 복원하지 않으며, 별도 복원 작업에서 실제 main·과거 PR/commit·사용자 결정과 대조해 추가합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Current Design Track

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-002 · L11–11 | - Status: FINAL | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-003 · L12–12 | - Lifecycle stage: DESIGN_CLOSEOUT | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-004 · L13–13 | - Current UI phase / scope: 첫 공개 버전 room/gameplay/result/rules/motion/audio presentation closeout 완료 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-005 · L14–14 | - Active branch: `main` (이 checkpoint PR 병합 후 design baseline) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-006 · L15–15 | - Last updated: 2026-09-25 | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-007 · L16–16 | - Adoption baseline: `UI_DESIGN.md` (UI_DECISIONS 체계 도입 전 작업 상태 포함) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-008 · L17–17 | - Active overrides: | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-009 · L18–18 · 부모 LEGACY-NT-UID-008 |   - NT-UI-001 — muted blue game-local environmental background | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-010 · L19–19 · 부모 LEGACY-NT-UID-008 |   - NT-UI-002 — compact LIVE ROOM header identity | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-011 · L20–20 · 부모 LEGACY-NT-UID-008 |   - NT-UI-003 — first-place celebration overlay | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-012 · L21–21 · 부모 LEGACY-NT-UID-008 |   - NT-UI-004 — FINAL TABLE result plates | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-013 · L22–22 · 부모 LEGACY-NT-UID-008 |   - NT-UI-005 — quiet in-room reconnect presentation | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-014 · L23–23 · 부모 LEGACY-NT-UID-008 |   - NT-UI-006 — centered FINAL WINNER result card | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-015 · L24–24 · 부모 LEGACY-NT-UID-008 |   - NT-UI-007 — tabletop Rules Guide | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-016 · L25–25 · 부모 LEGACY-NT-UID-008 |   - NT-UI-008 — Covert Affair / Hard Boiled soundtrack split | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-017 · L26–26 · 부모 LEGACY-NT-UID-008 |   - NT-UI-009 — staged tabletop game-start sequence | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-018 · L27–27 · 부모 LEGACY-NT-UID-008 |   - NT-UI-010 — authoritative transfer continuity at take/end boundaries | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-019 · L28–28 · 부모 LEGACY-NT-UID-008 |   - NT-UI-011 — maximum-hand responsive overlap | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-020 · L29–29 · 부모 LEGACY-NT-UID-008 |   - NT-UI-012 — tighter gameplay hand and ordered insertion slide | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-021 · L30–30 · 부모 LEGACY-NT-UID-008 |   - NT-UI-013 — tactile card/chip audio feedback | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-022 · L31–31 | - Main design baseline: PR #397 merge commit `616626f53f5fb8554fff8df2e86cc50a22e8aefa` (NT-UI-001~013 포함) | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-023 · L32–32 | - Next design work: 첫 공개 전 필수 디자인 작업 없음. Phase E 후보인 다른 플레이어 공개 획득 카드 popover와 추가 polish는 release blocker가 아닌 post-release follow-up으로 유지합니다. | 표현:필수 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Decision Log > NT-UI-001 — No Thanks! page environmental identity

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-024 · L38–38 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-025 · L39–39 | - Applies to: No Thanks! room / gameplay / result page world | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-026 · L40–40 | - Source: 2026-09-23 developer manual browser review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-027 · L41–41 | - Context / trigger: 기존 흰 페이지 배경이 게임별 개성을 충분히 전달하지 못했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-028 · L42–42 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-029 · L43–43 · 부모 LEGACY-NT-UID-028 |   - 페이지 전체를 muted navy / blue-gray 계열 game-local background로 구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-030 · L44–44 · 부모 LEGACY-NT-UID-028 |   - 중앙 gameplay surface는 밝게 유지하고, 장식은 가장자리 위주로 배치합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-031 · L45–45 · 부모 LEGACY-NT-UID-028 |   - oversized number-card ghost motif와 현재 gameplay의 red tactile chip visual language를 배경 accent로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-032 · L46–46 · 부모 LEGACY-NT-UID-028 |   - 공식 제품 artwork를 직접 배경 자산으로 사용하지 않고 CSS 기반 카드/칩 모티프로 재해석합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-033 · L47–47 · 부모 LEGACY-NT-UID-028 |   - mobile에서는 장식 밀도를 줄입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-034 · L48–48 | - Rationale: 장시간 플레이 가독성을 해치지 않으면서 No Thanks!에 진입했다는 즉각적인 환경 정체성을 제공합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-035 · L49–49 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-036 · L50–50 | - Validation: 2026-09-23 manual browser review에서 배경 색상과 장식 방향 승인. PR #378 automated governance 통과. | 표현:승인 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-037 · L51–51 | - Baseline relation: adoption baseline의 page-frame/environment 항목을 구체화한 후속 override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-038 · L52–52 | - Functional boundary: gameplay state / rules / RPC / DB authority 변경 없음. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-002 — Room header identity and connection-state cleanup

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-039 · L56–56 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-040 · L57–57 | - Applies to: in-room Game Shell header | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-041 · L58–58 | - Source: 2026-09-23 developer manual browser review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-042 · L59–59 | - Context / trigger: 방 코드/상태 표현이 중복되고 게임 설명이 약하게 보였습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-043 · L60–60 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-044 · L61–61 · 부모 LEGACY-NT-UID-043 |   - 설명 문구는 `칩으로 버틸지, 카드와 칩을 가져갈지—한 번의 선택이 흐름을 바꾸는 심리전 카드 게임`으로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-045 · L62–62 · 부모 LEGACY-NT-UID-043 |   - 우측 room label은 `LIVE ROOM`으로 표시하고 실제 room code 중복 노출을 제거합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-046 · L63–63 · 부모 LEGACY-NT-UID-043 |   - 정상 연결된 in-room 상태의 `방 상태 최신` 성공 카드는 숨깁니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-047 · L64–64 · 부모 LEGACY-NT-UID-043 |   - offline / reconnecting / error 등 recovery-critical connection state는 계속 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-048 · L65–65 | - Rationale: 헤더를 상태 정보 묶음이 아니라 게임 진입부/정체성 영역으로 정리하면서 중요한 복구 정보는 보존합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-049 · L66–66 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-050 · L67–67 | - Validation: 2026-09-23 manual browser review를 거쳐 후속 결과 화면 작업까지 유지됨. PR #378 automated governance 통과. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-051 · L68–68 | - Baseline relation: post-baseline manual review override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-052 · L69–69 | - Functional boundary: connection semantics 자체는 변경하지 않고 정상 success presentation만 숨김. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-003 — First-place celebration overlay

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-053 · L73–73 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-054 · L74–74 | - Applies to: natural game completion (`LAST_CARD_TAKEN`) immediately before result review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-055 · L75–75 | - Source: 2026-09-23 developer manual browser review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-056 · L76–76 | - Context / trigger: 게임 종료 직후 결과표만 표시되어 승리 순간의 재미와 보상이 약했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-057 · L77–77 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-058 · L78–78 · 부모 LEGACY-NT-UID-057 |   - 자연 종료 시 1등을 알리는 centered modal을 먼저 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-059 · L79–79 · 부모 LEGACY-NT-UID-057 |   - browser-wide confetti, floating No Thanks! number cards, red tactile chip motion으로 축하 연출을 제공합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-060 · L80–80 · 부모 LEGACY-NT-UID-057 |   - 공동 1등을 지원합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-061 · L81–81 · 부모 LEGACY-NT-UID-057 |   - modal을 닫으면 FINAL TABLE 결과 화면을 확인합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-062 · L82–82 · 부모 LEGACY-NT-UID-057 |   - host 강제 종료에는 승자 celebration을 표시하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-063 · L83–83 · 부모 LEGACY-NT-UID-057 |   - 동일 결과는 결과 version 기반 key를 `sessionStorage`에 기록하여 focus/page lifecycle 재렌더에서도 반복 재생하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-064 · L84–84 · 부모 LEGACY-NT-UID-057 |   - `prefers-reduced-motion`에서는 full-screen FX를 제거합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-065 · L85–85 | - Rationale: 결과 진입을 단순 데이터 표시가 아니라 게임의 명확한 종료 이벤트로 만들되 반복 애니메이션과 접근성 문제를 방지합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-066 · L86–86 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-067 · L87–87 | - Validation: focus/minimize 복귀 재렌더 이슈에 대한 상태 보강 포함. PR #378 automated governance 통과. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-068 · L88–88 | - Baseline relation: post-baseline game-over experience override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-069 · L89–89 | - Functional boundary: 승자 판정은 기존 server-authoritative final result를 사용하며 새로운 승자 계산 권한을 UI에 두지 않음. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-004 — FINAL TABLE result plates

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-070 · L93–93 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-071 · L94–94 | - Applies to: GAME_OVER result presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-072 · L95–95 | - Source: 2026-09-23 developer manual browser review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-073 · L96–96 | - Context / trigger: 기존의 순위/칩/획득 카드를 표 형태로 분할한 결과 화면은 게임 결과의 재미와 시각적 보상이 부족했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-074 · L97–97 | - Previous / rejected direction: | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-075 · L98–98 · 부모 LEGACY-NT-UID-074 |   - 단일 가로 카드 내부를 `플레이어 정보 &#124; 보유 칩 &#124; 획득 카드` 3영역으로 나누는 구조는 폐기합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-076 · L99–99 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-077 · L100–100 · 부모 LEGACY-NT-UID-076 |   - 결과 화면은 `FINAL TABLE` 콘셉트로 구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-078 · L101–101 · 부모 LEGACY-NT-UID-076 |   - 1등은 상단 전체 폭의 winner plate로 강조합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-079 · L102–102 · 부모 LEGACY-NT-UID-076 |   - 나머지 플레이어는 아래 2열 result plate grid로 배치하고, 좁은 viewport에서는 1열로 전환합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-080 · L103–103 · 부모 LEGACY-NT-UID-076 |   - 각 plate는 상단 masthead(rank medal / player / final score card)와 하단 playmat(chip tray / acquired-card rack)로 구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-081 · L104–104 · 부모 LEGACY-NT-UID-076 |   - 1등 rank/score/card/chip presentation을 한 단계 더 크게 표현합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-082 · L105–105 · 부모 LEGACY-NT-UID-076 |   - 2등/3등 rank medal은 silver/bronze hierarchy를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-083 · L106–106 · 부모 LEGACY-NT-UID-076 |   - 획득 카드는 gameplay 개인 패널의 `createHandCard()` UI/hover/focus UX를 재사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-084 · L107–107 · 부모 LEGACY-NT-UID-076 |   - 카드 개수별 overlap은 단계적으로 조절하고, 연속 숫자 run 내부는 함께 겹치며 새 run 시작점에는 별도 간격을 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-085 · L108–108 · 부모 LEGACY-NT-UID-076 |   - 최종 보유 칩은 gameplay의 tactile chip visual language를 재사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-086 · L109–109 | - Rationale: 결과를 관리용 표가 아니라 보드게임의 최종 테이블처럼 보여 주어 순위, 점수, 구성물과 플레이 결과를 하나의 게임적 장면으로 읽게 합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-087 · L110–110 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-088 · L111–111 | - Validation: 2026-09-23 developer manual browser review에서 최종 결과 레이아웃을 명시적으로 승인하고 main 병합을 요청함. PR #378 automated governance 통과. | 표현:승인 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-089 · L112–112 | - Baseline relation: adoption baseline 이후 game-over/result layout의 최종 manual-review override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-090 · L113–113 | - Functional boundary: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-091 · L114–114 · 부모 LEGACY-NT-UID-090 |   - 최종 score/winner는 기존 server result를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-092 · L115–115 · 부모 LEGACY-NT-UID-090 |   - 다른 플레이어의 gameplay private counter state는 공개하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-093 · L116–116 · 부모 LEGACY-NT-UID-090 |   - GAME_OVER chip count는 공개 acquired cards의 card score와 server final score의 관계로 계산하여 결과 화면에서만 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-005 — Quiet in-room reconnect presentation

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-094 · L120–120 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-095 · L121–121 | - Applies to: in-room Game Shell connection presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-096 · L122–122 | - Supersedes: NT-UI-002의 `reconnecting` 상태를 항상 recovery-critical card로 노출하던 부분 | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-097 · L123–123 | - Source: 2026-09-23 developer manual design review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-098 · L124–124 | - Context / trigger: 정상적인 짧은 재동기화에서도 `방 상태 동기화 중` 카드가 반복 노출되어 실제 gameplay보다 시스템 상태가 더 크게 느껴졌습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-099 · L125–125 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-002 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-100 · L126–126 · 부모 LEGACY-NT-UID-099 |   - in-room에서는 정상 success card뿐 아니라 `reconnecting` connection card도 숨깁니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-002 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-101 · L127–127 · 부모 LEGACY-NT-UID-099 |   - 실제 사용자의 개입이 필요한 `offline` / `error` 상태는 계속 명확히 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-002 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-102 · L128–128 · 부모 LEGACY-NT-UID-099 |   - authoritative snapshot refresh/reconnect 동작 자체는 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-002 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-103 · L129–129 | - Rationale: 자동 복구 가능한 일시적 동기화는 조용히 처리하고, 사용자가 대응해야 할 실패 상태만 시각적으로 승격합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-104 · L130–130 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-105 · L131–131 | - Validation: 최신 main 동기화 후 PR #381 Game Platform governance run #502에서 JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard 모두 성공했고 main 병합 완료. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-106 · L132–132 | - Baseline relation: NT-UI-002의 connection-state presentation 일부를 후속 override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-002 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-107 · L133–133 | - Functional boundary: reconnect/snapshot/network semantics 변경 없음. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-002 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-006 — Centered FINAL WINNER result card

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-108 · L137–137 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-109 · L138–138 | - Applies to: natural GAME_OVER result hero | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-110 · L139–139 | - Supersedes: 자연 종료 결과에서 승자 문구를 일반 왼쪽 정렬 heading으로만 표시하던 presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-111 · L140–140 | - Source: 2026-09-23 developer manual design review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-112 · L141–141 | - Context / trigger: FINAL TABLE 위의 승자 선언이 정보성 heading처럼 보여, 이미 강화된 winner celebration/result plate와 비교해 결과 진입의 중심점이 약했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-113 · L142–142 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-114 · L143–143 · 부모 LEGACY-NT-UID-113 |   - 자연 종료 시 `FINAL WINNER` label과 `&lt;winner&gt; 승리!`를 중앙 정렬된 독립 winner card로 표시합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-115 · L144–144 · 부모 LEGACY-NT-UID-113 |   - card는 No Thanks!의 dark table surface, gold border/highlight, red tactile chip motif를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-116 · L145–145 · 부모 LEGACY-NT-UID-113 |   - host 수동 종료는 승자 선언이 아니므로 기존 정보형 heading을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-117 · L146–146 · 부모 LEGACY-NT-UID-113 |   - mobile에서도 winner card의 중심 hierarchy와 chip motif가 무너지지 않게 축소합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-118 · L147–147 | - Rationale: 승자 선언 → FINAL TABLE이라는 결과 정보 순서를 명확히 만들고, game-over presentation을 카드/칩 언어 안에서 마무리합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-119 · L148–148 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-120 · L149–149 | - Validation: PR #381 shell regression test와 최신 main 동기화 후 Game Platform governance run #502가 성공했고 main 병합 완료. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-121 · L150–150 | - Baseline relation: NT-UI-003/004의 game-over experience를 연결하는 후속 presentation override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-122 · L151–151 | - Functional boundary: winner/final score 계산은 기존 server-authoritative result를 그대로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-007 — Tabletop Rules Guide

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-123 · L155–155 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-124 · L156–156 | - Applies to: rules/help modal, rules information hierarchy, responsive dialog | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-125 · L157–157 | - Supersedes: generic text-list 중심의 기존 No Thanks! rules modal presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-126 · L158–158 | - Source: 2026-09-23 design implementation review + Game Platform Rules Guide Presentation experiment | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-127 · L159–159 | - Context / trigger: 규칙 내용은 충분했지만 일반 문서형 modal에 가까워, No Thanks!의 핵심인 숫자 카드·칩·거절/가져오기 선택·연속 숫자 점수 계산이 실제 gameplay 구성물과 연결되어 보이지 않았습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-128 · L160–160 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-129 · L161–161 · 부모 LEGACY-NT-UID-128 |   - 규칙 modal을 일반 도움말이 아니라 **tabletop quick guide**로 재구성합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-130 · L162–162 · 부모 LEGACY-NT-UID-128 |   - header에 large number card와 red tactile chip motif를 사용하고 `HOW TO PLAY` hierarchy를 명확히 둡니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-131 · L163–163 · 부모 LEGACY-NT-UID-128 |   - `GOAL` 영역에서 가장 낮은 최종 점수를 만드는 목표를 먼저 설명합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-132 · L164–164 · 부모 LEGACY-NT-UID-128 |   - 준비 규칙은 `3–35 / 33장 → 9장 비공개 제외 → 24장 실제 덱` 흐름으로 시각화합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-133 · L165–165 · 부모 LEGACY-NT-UID-128 |   - 턴의 핵심 선택은 `NO THANKS!`와 `TAKE` 두 game-local choice card로 설명합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-134 · L166–166 · 부모 LEGACY-NT-UID-128 |   - 연속 숫자 scoring은 실제 number-card visual과 equation을 함께 사용해 `연속 묶음에서는 가장 낮은 숫자만 계산`하는 규칙을 보여줍니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-135 · L167–167 · 부모 LEGACY-NT-UID-128 |   - 종료/승리는 `LOWEST SCORE WINS` hierarchy로 마무리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-136 · L168–168 · 부모 LEGACY-NT-UID-128 |   - 기존 규칙 의미를 유지하고 visual example 없이도 semantic text로 이해할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-137 · L169–169 · 부모 LEGACY-NT-UID-128 |   - 공식 logo/product artwork를 직접 복제하지 않고 기존 CSS card/chip language로 재해석합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-138 · L170–170 · 부모 LEGACY-NT-UID-128 |   - 700px 이하에서는 setup/choice/scoring 구조를 세로로 재배치하고 modal 내부 scroll을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-139 · L171–171 | - Rationale: 규칙 안내 자체를 No Thanks! gameplay presentation의 일부로 만들면서 처음 플레이하는 사용자가 핵심 선택과 점수 구조를 실제 구성물 언어로 더 빠르게 이해하게 합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-140 · L172–172 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-141 · L173–173 | - Validation: PR #381 rules-modal regression test와 최신 main 동기화 후 Game Platform governance run #502가 성공했고 main 병합 완료. 이후 동일 원칙을 Can’t Stop Rules Guide와 전체 redesign에 적용해 공통 UI 규칙으로 승격됨. | 표현:원칙 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-142 · L174–174 | - Baseline relation: `UI_DESIGN.md`의 game-local modal 방향을 구체화하고 기존 generic rules presentation을 대체합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-143 · L175–175 | - Functional boundary: 규칙 사실은 `GAME_SPEC.md`/authoritative gameplay를 따르며 DB/RPC/game state를 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-008 — Covert Affair / Hard Boiled soundtrack split

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-144 · L179–179 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-145 · L180–180 | - Applies to: entry / waiting lobby / gameplay / result-rematch audio presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-146 · L181–181 | - Source: 2026-09-24 user soundtrack selection | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-147 · L182–182 | - Context / trigger: No Thanks!의 카드·칩 심리전 분위기에 맞는 로비/플레이 전용 BGM을 확정했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-148 · L183–183 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-149 · L184–184 · 부모 LEGACY-NT-UID-148 |   - lobby 계열 화면에는 Kevin MacLeod의 `Covert Affair` (ISRC `USUAN1100795`)를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-150 · L185–185 · 부모 LEGACY-NT-UID-148 |   - 실제 `PLAYING` phase에는 Kevin MacLeod의 `Hard Boiled` (ISRC `USUAN1700076`)를 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-151 · L186–186 · 부모 LEGACY-NT-UID-148 |   - GAME_OVER / rematch 준비를 포함해 `PLAYING`이 아닌 상태는 lobby track으로 복귀합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-152 · L187–187 · 부모 LEGACY-NT-UID-148 |   - 기존 shared Game BGM controller/player를 재사용해 재생/일시정지, 볼륨, 출처/라이선스 UI와 브라우저 autoplay 대응을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-153 · L188–188 · 부모 LEGACY-NT-UID-148 |   - 두 곡의 Incompetech CC BY 4.0 attribution metadata를 shared BGM catalog에 등록합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-154 · L189–189 | - Rationale: 실제 사용감을 기준으로 두 트랙의 역할을 교체해 로비에는 `Covert Affair`, 플레이에는 `Hard Boiled`를 배치하면서 기존 Game Platform 오디오 UX는 그대로 유지합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-155 · L190–190 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-156 · L191–191 | - Validation: `tests/game-platform-no-thanks-bgm.test.js`에서 track metadata, lobby ↔ gameplay 전환, page wiring을 회귀 검증합니다. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-157 · L192–192 | - Baseline relation: `UI_DESIGN.md`의 sound 방향을 실제 사용자 확정 soundtrack으로 구체화한 post-closeout override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-158 · L193–193 | - Functional boundary: gameplay state / RPC / DB authority / 카드·칩 규칙 변경 없음. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-009 — Staged tabletop game-start sequence

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-159 · L197–197 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-160 · L198–198 | - Applies to: WAITING → PLAYING 전환 직후의 opening presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-161 · L199–199 | - Source: 2026-09-24 iterative manual design review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-162 · L200–200 | - Context / trigger: 방장이 게임 시작을 눌렀을 때 board가 즉시 나타나 첫 카드가 공개되는 흐름은 준비된 카드·칩 게임을 시작한다는 몰입감이 약했고, 대기 화면과 플레이 화면의 deck/chip 위치가 바뀌면 순간이동처럼 보였습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-163 · L201–201 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-164 · L202–202 · 부모 LEGACY-NT-UID-163 |   - WAITING 원형 테이블에 실제 플레이와 동일한 좌표의 draw deck과 중앙 chip bank를 미리 배치합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-165 · L203–203 · 부모 LEGACY-NT-UID-163 |   - 중앙에는 compact `게임 준비 중 / 모두 준비되면 / 바로 시작합니다.` card를 사용하고 deck/center/chip 세 슬롯의 위치는 WAITING과 PLAYING에서 동일하게 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-166 · L204–204 · 부모 LEGACY-NT-UID-163 |   - host start 후 goal message card와 `곧 게임이 시작됩니다.` message card를 각각 2.5초 노출합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-167 · L205–205 · 부모 LEGACY-NT-UID-163 |   - 두 번째 message card의 fade-out이 완전히 끝나면 추가 idle delay 없이 table setup motion을 시작합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-168 · L206–206 · 부모 LEGACY-NT-UID-163 |   - 중앙 chip bank의 배분과 deck shuffle은 동시에 시작하되 chip 배분이 먼저 끝나고 deck shuffle은 더 길게 이어집니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-169 · L207–207 · 부모 LEGACY-NT-UID-163 |   - viewer에게 지급되는 시작 칩은 중앙 bank에서 빠져나와 개인 패널의 최종 chip-pile 슬롯에 하나씩 그대로 쌓입니다. 다른 플레이어 몫은 seat avatar로 이동하고 avatar에 닿는 마지막 구간에서만 작아지며 투명해져 흡수되는 인상을 줍니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-170 · L208–208 · 부모 LEGACY-NT-UID-163 |   - source chip은 각 flight가 출발할 때 중앙 bank에서 함께 사라져 실제로 더미가 줄어드는 모습을 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-171 · L209–209 · 부모 LEGACY-NT-UID-163 |   - draw deck은 새 카드가 날아와 쌓이는 방식이 아니라 이미 놓인 deck이 펼쳐진 뒤 **4번의 discrete mix beat**를 거치고 다시 한 덱으로 모입니다. 각 beat 사이에는 짧은 hold를 두되 개별 이동은 부드러운 easing을 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-172 · L210–210 · 부모 LEGACY-NT-UID-163 |   - deck 정돈이 끝나는 즉시 기존 deck → current-card deal/flip animation으로 첫 카드를 공개합니다. 첫 카드 landing 전까지 TAKE/REFUSE는 잠급니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-173 · L211–211 · 부모 LEGACY-NT-UID-163 |   - opening sequence는 실제 WAITING → PLAYING authoritative transition에서만 재생하고 reload/reconnect로 이미 PLAYING에 들어온 경우 재생하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-174 · L212–212 · 부모 LEGACY-NT-UID-163 |   - `prefers-reduced-motion`에서는 대규모 이동 motion을 생략하고 동일 authoritative state로 빠르게 수렴합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-175 · L213–213 | - Rationale: game state를 바꾸지 않고도 카드와 칩이 실제 테이블에 준비되고 배분되는 물리적 흐름을 보여 주며, 대기→플레이 전환에서 위치 점프와 과도한 idle 시간을 제거합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-176 · L214–214 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-177 · L215–215 | - Validation: PR #391 반복 manual review 후 PR #394에 통합. PR #394 integration head에서 Game Platform governance #555와 Site static checks #3446 성공. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-178 · L216–216 | - Baseline relation: `UI_DESIGN.md`의 tabletop motion / cause→movement→authoritative result 원칙을 game-start 영역에 구체화한 post-closeout override. | 표현:원칙 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-179 · L217–217 | - Functional boundary: room status/current card/chip count의 authority는 서버 snapshot이 소유하고 opening은 presentation layer에서만 conceal/reveal/flight를 수행합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-010 — Authoritative transfer continuity at take/end boundaries

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-180 · L221–221 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-181 · L222–222 | - Applies to: TAKE_CARD, opponent take presentation, last-card transition, host manual termination | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-182 · L223–223 | - Source: 2026-09-24 iterative manual design review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-183 · L224–224 | - Context / trigger: TAKE 시 실제 source component와 flight component가 동시에 보이거나, 마지막 카드 획득 뒤 테이블에 원본 카드가 남거나, 수동 게임 종료 직후 이미 예약된 deal animation이 재생되면 authoritative state와 시각 상태가 어긋나 보였습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-184 · L225–225 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-185 · L226–226 · 부모 LEGACY-NT-UID-184 |   - TAKE presentation은 source component가 이동을 시작하는 순간 원본 presentation을 숨기고 flight copy만 보이게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-186 · L227–227 · 부모 LEGACY-NT-UID-184 |   - viewer TAKE의 카드/칩은 실제 개인 패널의 최종 landing target으로 이동하며, opponent TAKE의 공개 획득 요소는 해당 player seat/avatar 방향으로 수렴합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-187 · L228–228 · 부모 LEGACY-NT-UID-184 |   - 마지막 카드 TAKE에서도 원형 테이블의 source card를 flight 시작과 함께 숨겨, 개인 패널로 이동하는 카드와 테이블 카드가 중복 노출되지 않게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-188 · L229–229 · 부모 LEGACY-NT-UID-184 |   - 마지막 카드가 landing한 뒤에는 3초간 game-local `게임 결과를 집계 중입니다` gate를 거쳐 FINAL TABLE로 전환합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-189 · L230–230 · 부모 LEGACY-NT-UID-184 |   - 방장이 진행 중 게임을 수동 종료하면 활성 deal presentation을 즉시 cancel하고 flight/receiving 상태를 정리하여 종료 이후 새 카드가 뒤집혀 이동하는 연출을 남기지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-190 · L231–231 · 부모 LEGACY-NT-UID-184 |   - opponent seat로 흡수되는 시작/이동 칩은 flight 대부분 구간에서 선명도를 유지하고 avatar contact 직전 마지막 구간에서만 fade/scale down합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-191 · L232–232 | - Rationale: 애니메이션이 authoritative snapshot과 다른 카드/칩을 주장하지 않도록 하고, 실제 구성물이 한 위치에서 다른 위치로 이동했다는 continuity를 유지합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-192 · L233–233 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-193 · L234–234 | - Validation: PR #390/#391 회귀 테스트를 PR #394에서 통합하고 Game Platform governance #555 통과. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-194 · L235–235 | - Baseline relation: Phase A–D TAKE/deal motion과 NT-UI-003/004의 game-over transition을 보강하는 post-closeout override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-195 · L236–236 | - Functional boundary: TAKE legality, next card, final score, end reason은 기존 server-authoritative RPC/snapshot만 사용하며 presentation cancel/hide는 결과를 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-011 — Maximum-hand responsive overlap

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-196 · L240–240 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-197 · L241–241 | - Applies to: gameplay 개인 획득 카드 hand / GAME_OVER FINAL TABLE acquired-card rack | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-198 · L242–242 | - Source: 2026-09-24 manual review of dense hands | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-199 · L243–243 | - Context / trigger: 획득 카드가 많아질수록 개인 패널과 결과 카드 rack 바깥으로 카드가 밀려나고, 연속 숫자 run 사이의 고정 간격도 dense hand에서 지나치게 많은 폭을 사용했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-200 · L244–244 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-201 · L245–245 · 부모 LEGACY-NT-UID-200 |   - 첫 버전 24장 draw deck을 기준으로 한 플레이어가 최대 24장을 보유할 수 있는 worst case까지 레이아웃에 포함합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-202 · L246–246 · 부모 LEGACY-NT-UID-200 |   - gameplay hand overlap은 보유 장수 구간에 따라 단계적으로 더 타이트해집니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-203 · L247–247 · 부모 LEGACY-NT-UID-200 |   - FINAL TABLE은 기본 card-count overlap 단계뿐 아니라 실제 rack의 available width, card width, run-start count를 측정해 overlap과 run margin을 동적으로 다시 계산합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-204 · L248–248 · 부모 LEGACY-NT-UID-200 |   - 새 run 시작점의 간격도 카드 수/가용 폭이 부족하면 함께 축소하며, dense hand 때문에 horizontal overflow가 발생하지 않게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-205 · L249–249 · 부모 LEGACY-NT-UID-200 |   - 왼쪽 상단/오른쪽 하단 corner number와 기존 hover/focus UX는 유지하여 겹침이 커져도 카드 값을 읽을 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-206 · L250–250 | - Rationale: 고정 폭을 늘려 화면 전체를 키우는 대신 카드 수에 따라 presentation 밀도를 조절하여 데스크톱/좁은 viewport 모두에서 최대 hand를 수용합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-207 · L251–251 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-208 · L252–252 | - Validation: PR #389의 measured result-rack 계산과 PR #391의 강화된 최대-hand overlap을 PR #394에서 통합. Game Platform governance #555 / Site static checks #3446 통과. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-209 · L253–253 | - Baseline relation: NT-UI-004 FINAL TABLE card rack과 `UI_DESIGN.md` 개인 패널 overlap 정책의 후속 override. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-210 · L254–254 | - Functional boundary: 카드 보유/정렬/점수 데이터는 변경하지 않고 DOM spacing만 계산합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-012 — Tighter gameplay hand and ordered insertion slide

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-211 · L258–258 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-212 · L259–259 | - Applies to: gameplay 개인 획득 카드 hand / TAKE_CARD landing motion | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-213 · L260–260 | - Supersedes: NT-UI-011의 gameplay hand density 수치와 TAKE 후 기존 카드가 단계적으로 재배치되던 presentation | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-214 · L261–261 | - Source: 2026-09-25 developer manual browser review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-215 · L262–262 | - Context / trigger: 개인 hand는 카드 수가 늘어날수록 더 타이트하게 겹쳐도 hover/focus로 값을 확인할 수 있고, 새 카드를 오름차순 위치에 바로 넣을 때 기존 카드가 순간적으로 자리만 바꾸면 실제 카드 사이에 공간을 만드는 감각이 약했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-216 · L263–263 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-217 · L264–264 · 부모 LEGACY-NT-UID-216 |   - gameplay hand는 적은 카드부터 과도하게 겹치지 않습니다. 카드 장수별 fallback overlap을 1장 단위로 세분화하되, 실제 화면에서는 개인 패널의 사용 가능한 폭과 카드 폭을 측정해 **오른쪽 여백이 남아 있으면 펼친 상태를 우선**합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-218 · L265–265 · 부모 LEGACY-NT-UID-216 |   - 펼친 카드가 실제 가용 폭을 넘기기 시작할 때만 약 5px 단위로 overlap level을 한 단계씩 높이고, 카드가 더 늘어나거나 viewport가 좁아질수록 필요한 만큼만 추가 압축합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-219 · L266–266 · 부모 LEGACY-NT-UID-216 |   - 같은 연속 숫자 run 내부는 이 adaptive overlap을 사용하고, 새 run 시작점은 일반 카드 간격보다 최대 약 28px 더 넓게 유지해 연속 묶음 경계를 한눈에 구분할 수 있게 합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-220 · L267–267 · 부모 LEGACY-NT-UID-216 |   - run 경계 공간까지 포함해 폭이 부족해질 때에는 run 간격도 함께 점진적으로 줄이되 항상 같은 run 내부보다 넓게 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-221 · L268–268 · 부모 LEGACY-NT-UID-216 |   - 이 adaptive spacing은 gameplay 개인 패널에만 적용하며 FINAL TABLE의 measured result-rack 계산은 그대로 유지합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-222 · L269–269 · 부모 LEGACY-NT-UID-216 |   - TAKE 성공 시 새 카드는 처음부터 최종 오름차순 slot을 landing target으로 사용합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-223 · L270–270 · 부모 LEGACY-NT-UID-216 |   - 기존 보유 카드는 authoritative rerender 전 좌표와 최종 정렬 좌표의 차이를 기준으로 약 420ms FLIP-style slide를 적용해 새 카드가 들어올 공간을 부드럽게 만듭니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-224 · L271–271 · 부모 LEGACY-NT-UID-216 |   - 마지막 카드 TAKE도 동일한 정렬/slide 원칙을 사용합니다. | 표현:원칙 | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-225 · L272–272 · 부모 LEGACY-NT-UID-216 |   - `prefers-reduced-motion`에서는 기존 카드 slide를 생략하고 최종 정렬 상태로 즉시 수렴합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-226 · L273–273 | - Rationale: 개인 패널 높이와 폭을 늘리지 않고 카드 밀도를 높이면서도, 정렬 변경을 순간적인 점프가 아니라 실제 카드를 옆으로 밀어 자리를 만드는 동작으로 읽히게 합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-227 · L274–274 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-228 · L275–275 | - Validation: PR #396 후속 작업에서 Game Platform governance 및 developer manual browser review 예정. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-229 · L276–276 | - Baseline relation: NT-UI-011의 dense-hand 원칙을 유지하되 gameplay hand의 구체 밀도와 TAKE insertion motion을 후속 override합니다. FINAL TABLE의 measured result-rack 계산은 변경하지 않습니다. | 표현:원칙 | LOCAL_CONTEXT / I | E-NT | NT-UI-011 부분 대체(충돌 아님) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-230 · L277–277 | - Functional boundary: 카드 보유 순서/점수/RPC authority는 변경하지 않고 presentation geometry와 motion만 조정합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | NT-UI-011 부분 대체(충돌 아님) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Decision Log > NT-UI-013 — Tactile card/chip audio feedback

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-231 · L281–281 | - Status: ACTIVE | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-232 · L282–282 | - Applies to: game-start setup, TAKE_CARD transfer, REFUSE_CARD chip transfer | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-233 · L283–283 | - Source: 2026-09-25 iterative user audio review | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-234 · L284–284 | - Context / trigger: 초기 효과음은 pitched oscillator 중심이라 카드 이동이 전자음처럼 들리고 칩도 실제 tabletop token보다 금속성 cue에 가까웠습니다. 사용자는 카드가 실제로 미끄러지고 칩이 실제 더미에 쌓이는 물성감을 원했습니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-235 · L285–285 | - Decision: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-236 · L286–286 · 부모 LEGACY-NT-UID-235 |   - 카드 이동은 음높이가 두드러지는 `뿅` 계열 cue 대신 filtered-noise 기반의 짧은 cardstock slide `스윽/스륵` 질감으로 표현합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-237 · L287–287 · 부모 LEGACY-NT-UID-235 |   - 중앙 칩을 가져올 때는 금속 동전의 `짤랑` 대신 플라스틱 칩이 더미에 닿는 짧고 건조한 `착` impact를 chip count에 맞춰 연속 재생합니다. 과도한 소음 방지를 위해 audible stack hit는 최대 8회로 제한합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-238 · L288–288 · 부모 LEGACY-NT-UID-235 |   - TAKE의 card slide와 collected-chip stack cue는 사용자 manual review 후 opening setup SFX에는 영향을 주지 않고 **TAKE 동작에서만 기존 대비 약 2배** gain으로 강화합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-239 · L289–289 · 부모 LEGACY-NT-UID-235 |   - REFUSE_CARD는 authoritative chip flight가 시작할 때 `스윽` 이동 질감을 시작하고 약 620ms flight가 끝나기 직전 `착` stack impact가 들리도록 맞춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-240 · L290–290 · 부모 LEGACY-NT-UID-235 |   - `prefers-reduced-motion`에서 flight가 생략되면 이동음 없이 landing `착`만 재생하여 실제 시각 흐름과 사운드 원인/결과를 맞춥니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-241 · L291–291 · 부모 LEGACY-NT-UID-235 |   - game-start deck shuffle과 초기 chip distribution은 서로 독립적인 효과음을 동시에 쌓지 않고 하나의 coordinated timeline으로 스케줄해 competing audio bed를 만들지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-242 · L292–292 · 부모 LEGACY-NT-UID-235 |   - SFX는 game-local Web Audio로 구현하며 실패하거나 브라우저 정책에 의해 재생되지 않아도 gameplay state/action은 중단하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-243 · L293–293 | - Rationale: No Thanks!의 핵심 상호작용을 전자 UI cue가 아니라 실제 카드와 칩을 만지는 tabletop feedback으로 읽히게 하고, 시각 animation의 출발/도착과 소리의 원인/결과를 일치시킵니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-244 · L294–294 | - Implementation status: IMPLEMENTED | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-245 · L295–295 | - Validation: PR #397의 `tests/game-platform-no-thanks-audio-feedback.test.js`로 card slide, stacked-chip cue, REFUSE flight/landing timing을 회귀 검증했고 Game Platform governance #580 전체 성공 후 main 병합 완료. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-246 · L296–296 | - Baseline relation: NT-UI-008의 soundtrack/BGM 결정을 보완하는 game-action SFX layer이며 NT-UI-009/010의 physical transfer motion에 audio feedback을 연결합니다. | 서술형(수치화 안 함) | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-247 · L297–297 | - Functional boundary: sound는 presentation only이며 gameplay legality, RPC, DB state, turn timing authority를 변경하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Superseded / Rejected

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-248 · L301–301 | - 기존 generic text-list 중심 rules modal은 NT-UI-007에 의해 superseded. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-249 · L302–302 | - NT-UI-002에서 reconnecting 상태를 recovery card로 유지하던 부분은 NT-UI-005에 의해 superseded하며 offline/error 노출 원칙은 유지합니다. | 표현:원칙 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-250 · L303–303 | - 자연 종료 결과의 일반 heading형 승자 선언은 NT-UI-006에 의해 superseded. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-251 · L304–304 | - 결과 화면의 이전 `순위 목록 + 별도 획득 카드 목록` 구조는 NT-UI-004에 의해 superseded. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-252 · L305–305 | - 결과 플레이어 카드를 `플레이어 정보 &#124; 최종 보유 칩 &#124; 획득 카드` 3분할 행으로 표현하던 manual-review 중간안은 NT-UI-004에 의해 superseded. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-253 · L306–306 | - 과거의 별도 redesign 제안이나 종료된 PR에 남아 있는 디자인안은 그 자체로 현재 기준이 아닙니다. 복원할 때는 현재 main과 `UI_DESIGN.md`, 실제 사용자 결정과 대조해 살아 있는 결정만 구분합니다. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Validation History

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-254 · L310–310 | - 2026-09-23 — UI_DECISIONS 문서 체계 도입. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-255 · L311–311 | - 2026-09-23 — PR #378 room header / environmental identity / winner celebration / FINAL TABLE result design automated governance 반복 검증. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-256 · L312–312 | - 2026-09-23 — FINAL TABLE 결과 디자인에 대해 developer manual browser review 완료 및 main 병합 승인. | 표현:승인 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-257 · L313–313 | - 2026-09-23 — PR #381 quiet reconnect / FINAL WINNER card / tabletop Rules Guide 구현 및 자동 회귀 검증 완료. | 표현:검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-258 · L314–314 | - 2026-09-23 — 최신 main 동기화 후 PR #381 Game Platform governance run #502 전체 성공. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-259 · L315–315 | - 2026-09-23 — PR #381 main 병합 완료. merge commit: `c43f96f984b90049b59b163bffd16c9a5fb5cf04`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-260 · L316–316 | - 2026-09-23 — Tabletop Rules Guide에서 검증한 game-local rules presentation 원칙이 Can’t Stop 실험을 거쳐 Game Platform 공통 UI 규칙으로 승격됨. | 표현:원칙,검증 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-261 · L317–317 | - 2026-09-23 — 기능 체크포인트와 함께 디자인 closeout을 재검토해 NT-UI-001~007이 현재 main의 active design baseline임을 확인. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-262 · L318–318 | - 2026-09-24 — user-selected No Thanks! soundtrack을 NT-UI-008로 확정하고 shared BGM 패턴으로 구현. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-263 · L319–319 | - 2026-09-24 — PR #390/#391의 final-take 및 game-start presentation을 반복 manual review로 다듬고 NT-UI-009~010의 안정된 motion/transition 원칙으로 확정. | 표현:원칙 | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-264 · L320–320 | - 2026-09-24 — dense hand overflow 수정과 PR #389 measured result-rack 계산을 통합해 NT-UI-011로 확정. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-265 · L321–321 | - 2026-09-24 — 통합 PR #394를 최신 main 대비 `behind 0 / mergeable` 상태와 Governance/Site/DB 통과를 확인한 뒤 main에 병합. merge commit: `91d9ca42b6340888f6c9680bda2dcce604da6ed3`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-266 · L322–322 | - 2026-09-24 — post-#394 디자인 체크포인트에서 NT-UI-001~011을 현재 active design baseline으로 재확인. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-267 · L323–323 | - 2026-09-25 — PR #396 follow-up manual review에서 gameplay hand density와 sorted insertion slide를 NT-UI-012로 확정하고, opening goal copy의 명시적 2줄 배치와 focus/visibility deal replay 방지를 함께 구현. PR #396 merge commit: `2666267f673e2035ceb678ab950cc889ee188c09`. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-268 · L324–324 | - 2026-09-25 — PR #397에서 lobby/gameplay BGM 역할을 `Covert Affair / Hard Boiled`로 확정하고, card slide / collected-chip stack / refuse `스윽 → 착` SFX를 사용자 반복 검토로 조정해 NT-UI-013으로 기록. Game Platform governance #580 통과 후 merge commit `616626f53f5fb8554fff8df2e86cc50a22e8aefa`로 main 병합. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-NT-UID-269 · L325–325 | - 2026-09-25 — 첫 공개 버전 디자인 체크포인트에서 NT-UI-001~013을 현재 active design baseline으로 재확인하고 Current Design Track을 `FINAL / DESIGN_CLOSEOUT`으로 전환. 이후 Phase E 후보는 post-release follow-up으로 분리. | 서술형(수치화 안 함) | LOCAL_HISTORY / H | E-NT | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Open Follow-up

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-UID-270 · L329–329 | - Phase E 후보인 다른 플레이어 공개 획득 카드 popover와 후속 polish는 release blocker가 아닌 별도 post-closeout scope로 진행합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-UID-271 · L330–330 | - 과거 No Thanks! 관련 PR/commit의 pre-UI_DECISIONS 디자인 결정을 복원할 필요가 생기면 실제 main·과거 증거·현재 active decision을 함께 대조하고 폐기된 안을 되살리지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

### NT-REL — `games/no-thanks/RELEASE_CHECKLIST.md`

- source: [games/no-thanks/RELEASE_CHECKLIST.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/games/no-thanks/RELEASE_CHECKLIST.md)
- blob: `28d562743296889439d19d72bcaa84d843669b0d`; 원문 88줄; 상태 `GAME_LOCAL`; 61 관리단위 / 60 규칙·필드 단위.


#### No Thanks! Release Readiness Checklist

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-001 · L3–3 | 이 문서는 No Thanks!를 실제 서비스 기능으로 활성화하기 전 마지막 검증 게이트를 추적합니다. | 표현:검증 | LOCAL_CONTEXT / I | E-NT | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Automated gates

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-002 · L7–7 | - &#91;x&#93; 순수 규칙 엔진 단위 테스트 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-003 · L8–8 | - &#91;x&#93; 승인회원 Access Gate / Common Game Shell 계약 테스트 | 표현:승인 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-004 · L9–9 | - &#91;x&#93; Room/Lobby DB/RPC 플랫폼 필수 계약 | 표현:필수 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-005 · L10–10 | - &#91;x&#93; private counter / draw deck / excluded card 비노출 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-006 · L11–11 | - &#91;x&#93; gameplay stale version / duplicate / concurrent conflict 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-007 · L12–12 | - &#91;x&#93; 자연 종료 점수 / 공동 승자 / 방장 수동 종료 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-008 · L13–13 | - &#91;x&#93; reconnect snapshot authoritative 복원 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-009 · L14–14 | - &#91;x&#93; Presence lifecycle / 다중 탭 user merge 계약 테스트 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-010 · L15–15 | - &#91;x&#93; 3개 독립 인증 세션 자연 종료 통합 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-011 · L16–16 | - &#91;x&#93; 7개 독립 인증 세션 full refuse cycle / private counter 격리 통합 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-012 · L17–17 | - &#91;x&#93; start RPC가 3~35 전체 33장을 정확히 한 번씩 포함하면서 canonical ascending order와 다른 randomized draw order를 저장하는 회귀 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-013 · L18–18 | - &#91;x&#93; 마지막 카드 TAKE source-card 중복 제거 / 수동 종료 시 active deal cancel / 최대 24장 result-rack responsive fit 계약 검증 | 표현:검증 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-014 · L19–19 | - &#91;x&#93; PR #396 첫 action / sorted TAKE landing / adaptive hand spacing / focus·visibility deal replay 회귀 검증 및 Game Platform governance #573 통과 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-015 · L20–20 | - &#91;x&#93; PR #397 Rules Guide 0칩 문구 / lobby↔gameplay BGM / card·chip tactile SFX 회귀 검증 및 Game Platform governance #580 통과 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Rematch / post-game

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-016 · L24–24 | - &#91; &#93; 자연 종료 후 방장이 `재대결 준비`를 누르면 room code와 참가자 context가 유지된 채 waiting 상태로 돌아간다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-017 · L25–25 | - &#91; &#93; 일반 플레이어 ready를 다시 완료한 뒤 방장이 같은 room에서 새 게임을 시작할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-018 · L26–26 | - &#91; &#93; 재대결 준비 상태에서 새로고침/재접속해도 같은 room의 authoritative waiting snapshot을 복원한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-019 · L27–27 | - &#91; &#93; GAME_OVER에서 방장이 나가면 남은 active player에게 host가 승계되고 새 host가 재대결 준비를 실행할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-020 · L28–28 | - &#91; &#93; 결과방에서 이탈한 플레이어가 있어 최소 인원 미만이면 새 참가자 또는 이탈자가 같은 room code로 참가한 뒤 다시 시작할 수 있다. | 표현:할 수 있다 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Manual browser gates

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-021 · L32–32 | 아래 항목은 자동 DB 통합 테스트가 대체하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-022 · L34–34 | - &#91;x&#93; 2026-09-25까지 실제 멀티플레이 환경에서 반복 플레이 테스트 수행 (사용자 확인). 아래 세부 reconnect / 7-client / mobile / offline 시나리오는 각각 확인된 경우에만 별도 완료 처리합니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-023 · L35–35 | - &#91; &#93; 데스크톱 3개 실제 브라우저/프로필에서 방 생성 → 참가 → 준비 → 시작 → 자연 종료 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-024 · L36–36 | - &#91; &#93; 실제 7개 클라이언트에서 roster와 현재 차례 표시 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-025 · L37–37 | - &#91; &#93; 현재 차례 플레이어 브라우저 종료 → 다른 클라이언트에서 `재접속 대기` 확인 → 재접속 후 같은 turn 복원 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-026 · L38–38 | - &#91; &#93; 방장 브라우저 종료 → 자동 위임/자동 종료가 발생하지 않는지 확인 → 방장 재접속 후 권한 복원 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-027 · L39–39 | - &#91; &#93; 동일 사용자의 2개 탭 접속 시 Presence가 사용자 1명으로 표시되는지 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-028 · L40–40 | - &#91; &#93; 모바일 백그라운드 → foreground 복귀 시 authoritative snapshot 재조회 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-029 · L41–41 | - &#91; &#93; 네트워크 offline → online 복귀 시 connection banner와 최신 snapshot 복원 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-030 · L42–42 | - &#91; &#93; 결과방에서 재대결 준비 → 같은 room code와 참가자 맥락 유지 → ready 재설정 → 방장 재시작 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D07 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Design closeout gate

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-031 · L46–46 | - &#91;x&#93; `UI_DESIGN.md` adoption baseline과 `UI_DECISIONS.md`의 최신 non-superseded decision(NT-UI-001~013)을 함께 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D04 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-032 · L47–47 | - &#91;x&#93; 수동 디자인 리뷰에서 확정된 game-start / transfer-continuity / dense-hand / sorted insertion / tactile audio 수정이 코드에만 남지 않도록 `UI_DECISIONS.md`에 NT-UI-009~013으로 기록 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-033 · L48–48 | - &#91;x&#93; PR #396 gameplay hand/motion/focus polish와 PR #397 BGM/SFX polish를 main 병합 상태에서 디자인 baseline으로 재확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-034 · L49–49 | - &#91;x&#93; 남은 UI 항목을 release blocker와 post-release follow-up으로 구분 — Phase E 공개 획득 카드 popover/추가 polish는 post-release follow-up | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-035 · L50–50 | - &#91;x&#93; `UI_DECISIONS.md / Current Design Track`을 `FINAL / DESIGN_CLOSEOUT`으로 기록 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Production database gates

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-036 · L54–54 | - &#91;x&#93; 운영 DB migration 적용 순서 재확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-037 · L55–55 | - &#91;x&#93; `20260924073500_no_thanks_randomized_draw_order.sql` 운영 Supabase 적용 및 migration history / 현재 함수 정의 확인 (2026-09-26) | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-038 · L56–56 | - &#91;x&#93; Room/Lobby foundation 운영 migration 적용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-039 · L57–57 | - &#91;x&#93; Gameplay actions 운영 migration 적용 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-040 · L58–58 | - &#91;x&#93; 공개 room/player 테이블만 Supabase Realtime publication에 등록 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-041 · L59–59 | - &#91;x&#93; private helper 함수 EXECUTE 권한을 `PUBLIC / anon / authenticated`에서 회수하고 RLS helper만 authenticated에 유지 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-042 · L60–60 | - &#91;x&#93; 운영 적용 직전/직후 Supabase security/performance advisor 확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-043 · L61–61 | - &#91; &#93; 운영 migration 적용 후 승인회원 create/join/snapshot/gameplay 브라우저 smoke test | 표현:승인 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-044 · L62–62 | - &#91;x&#93; private table이 authenticated SELECT 및 Realtime publication에 노출되지 않는지 운영 환경 재확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-045 · L63–63 | - &#91;x&#93; public gameplay/create RPC execute 권한이 authenticated에만 허용되는지 운영 환경 재확인 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-046 · L65–65 | 운영 적용 확인 완료 migration history: | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-047 · L66–66 | - `no_thanks_room_lobby_foundation` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-048 · L67–67 | - `no_thanks_gameplay_actions` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-049 · L68–68 | - `no_thanks_realtime_publication` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-050 · L69–69 | - `no_thanks_private_helper_permissions` | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-051 · L70–70 | - `20260923224856 no_thanks_randomized_draw_order` — 저장소의 `20260924073500_no_thanks_randomized_draw_order.sql`과 동일한 start RPC 랜덤 draw-order 보정이 운영 함수 정의에 반영된 것을 2026-09-26 재확인. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-052 · L72–72 | Advisor에서 No Thanks! 관련으로 남는 항목 중 `no_thanks_room_actions / no_thanks_room_private_state`의 RLS-without-policy는 직접 table access를 막는 의도적인 deny-all 경계입니다. public `SECURITY DEFINER` RPC 경고는 authenticated 사용자에게 의도적으로 노출한 API이며 각 함수가 승인회원/room/turn/version 권한을 서버에서 다시 검증합니다. FK covering index 2건은 현재 QA 차단 이슈가 아닌 INFO 항목으로 release hardening에서 재검토합니다. | 표현:승인,검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Activation gates

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-053 · L76–76 | 2026-09-26 사용자의 명시적 공개 출시 승인에 따라 서비스 활성화를 진행합니다. 아래에서 아직 체크되지 않은 세부 manual browser / production smoke 항목은 완료로 간주하지 않으며 post-release hardening으로 계속 추적합니다. | 표현:승인 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-054 · L78–78 | - &#91;x&#93; Registry `online: true` 활성화 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | D09 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-055 · L79–79 | - &#91;x&#93; 구현된 Realtime Presence 기준으로 `presence: true` 활성화 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-056 · L80–80 | - &#91;x&#93; 게임 목록에 사용자용 서비스 상태로 노출 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-057 · L81–81 | - &#91;x&#93; invite 기능은 별도 구현/검증 전까지 비활성 유지 | 표현:검증 | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-058 · L82–82 | - &#91; &#93; release 후 첫 실제 세션 로그/오류 모니터링 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### Release rule

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-NT-REL-059 · L86–86 | - 기능 구현 checkpoint baseline은 PR #397 merge commit `616626f53f5fb8554fff8df2e86cc50a22e8aefa`입니다. 이 시점 이후 별도 core development phase는 계획하지 않습니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-060 · L87–87 | - 디자인 checkpoint baseline은 `UI_DESIGN.md + UI_DECISIONS.md NT-UI-001~013`이며 `FINAL / DESIGN_CLOSEOUT` 상태입니다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-NT | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-NT-REL-061 · L88–88 | - 2026-09-26 공개 활성화는 사용자의 명시적 출시 승인으로 진행합니다. 아직 체크되지 않은 manual browser / production smoke / rematch 항목은 검증 완료로 간주하지 않으며 post-release hardening으로 계속 추적합니다. | 표현:승인,검증 | LOCAL_RULE / L | E-NT | U03 | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
### 전수 입력: site-history

고정 원표: [docs/game-platform-rebuild/artifacts/step-1-clauses-site-history.md](https://github.com/limbit95/limbit95.github.io/blob/f34f4f180e14ea36847b9740dea43de2f1325e56/docs/game-platform-rebuild/artifacts/step-1-clauses-site-history.md) · blob `fb80ff3e9f80c43ce4a40a3d8567fce604b54a0d`.





### BGM — `docs/game-bgm.md`

- source: [docs/game-bgm.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-bgm.md)
- blob: `e3767e0b366a5e1f57d5978edf47eb1e129a0931`; 원문 128줄; 상태 `CURRENT_SITE_UTILITY`; 81 관리단위 / 81 규칙·필드 단위.


#### Game BGM Pilot

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-001 · L3–5 | &gt; **문서 분류:** CURRENT<br>&gt;<br>&gt; Game Platform 자체를 변경해야 하는 작업에서는 `docs/game-platform-development-rules.md`가 현재 최상위 실행 규칙이다. 이 문서는 그 계약을 확장하지 않고, Legacy 게임인 The Game에서 먼저 검증하는 사이트 공통 BGM presentation utility의 현재 설계를 기록한다. | 표현:검증 | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 1. 목적

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-002 · L9–9 | BGM이 등록된 게임 페이지에 진입하면 가능한 환경에서 즉시 음악 재생을 시도한다. 브라우저 autoplay 정책이 이를 차단하면 사용자의 자연스러운 게임 조작을 재생 기회로 사용하며, 실제 게임 시작 시 한 번 더 재생을 시도한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-003 · L11–11 | 음악이 한 번 정상 재생된 뒤에는 게임 화면 interaction을 더 이상 BGM 입력으로 사용하지 않는다. 사용자가 Player UI에서 일시정지했다면 이후 카드·버튼·주사위 등 게임 조작으로 음악을 강제 재생하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 2. Pilot 구조

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-004 · L15–15 | 현재 공통 utility는 formal Game Platform 계약인 `games/shared/`로 승격하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-005 · L17–17 | - `js/game-audio/bgmCatalog.js`: 게임별 트랙, 출처, 라이선스, 기본 볼륨 | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-006 · L18–18 | - `js/game-audio/bgmPreferences.js`: 사용자 볼륨 저장 | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-007 · L19–19 | - `js/game-audio/bgmController.js`: 재생 상태와 autoplay/interaction fallback | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-008 · L20–20 | - `js/game-audio/bgmPlayer.js`: 작은 Floating Player UI | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-009 · L21–21 | - `css/game-bgm-player.css`: 공통 Player 스타일 | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-010 · L23–23 | The Game, Liar Game, Can’t Stop에서 같은 site-level utility를 재사용하고 있다. Can’t Stop의 상태별 BGM도 `games/shared/` 계약을 확장하지 않고 game-local presentation에서 utility를 소비한다. formal Game Platform shared 계약 승격은 별도의 공통화 근거가 충분해질 때 검토한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3. 재생 정책

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-011 · L27–27 | 1. The Game document가 로드되면 BGM Controller가 즉시 `audio.play()`를 시도한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-012 · L28–28 | 2. 차단되면 `pointerdown`, Enter, Space를 임시 감지한다. Player UI 내부 interaction은 이 fallback에서 제외한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-013 · L29–29 | 3. 자연스러운 게임 interaction으로 재생이 성공하는 즉시 모든 전역 interaction listener를 제거한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-014 · L30–30 | 4. authoritative gameplay 진입 시 아직 한 번도 재생되지 않았다면 다시 재생을 시도한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-015 · L31–31 | 5. 그래도 차단되면 Player의 재생 버튼을 사용자가 직접 누를 수 있도록 재생 버튼을 은은하게 강조한다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-016 · L33–33 | 게임 목록에서 별도의 session intent를 저장하지 않는다. 현재 게임 페이지가 독립 document이므로 페이지 진입 자체에서 동일한 즉시 재생 시도를 수행하는 편이 더 단순하고, 직접 URL·초대·새로고침·재접속에도 같은 정책을 적용할 수 있다. | 표현:할 수 있다 | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-017 · L35–35 | 전역 interaction fallback은 `hasEverPlayed === false`인 동안에만 존재할 수 있다. | 표현:할 수 있다 | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 4. 사용자 제어

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

#### 5. The Game Pilot

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-026 · L54–54 | The Game은 같은 document 안에서 대기/설정과 실제 gameplay의 BGM을 구분한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-027 · L56–56 | - Page entry / mode / local setup / online entry / online waiting / rematch waiting: **Constance — Kevin MacLeod** | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-028 · L57–57 · 부모 LEGACY-BGM-027 |   - ISRC: USUAN1100850 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-029 · L58–58 · 부모 LEGACY-BGM-027 |   - Official source: Incompetech | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-030 · L59–59 · 부모 LEGACY-BGM-027 |   - License: CC BY 4.0 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-031 · L60–60 | - Local/online gameplay 시작 이후 / result presentation: **Invariance — Kevin MacLeod** | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-032 · L61–61 · 부모 LEGACY-BGM-031 |   - ISRC: USUAN1100847 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-033 · L62–62 · 부모 LEGACY-BGM-031 |   - Official source: Incompetech | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-034 · L63–63 · 부모 LEGACY-BGM-031 |   - Reference video: Kevin MacLeod: Invariance (`CpPQeDIA2S0`) | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-035 · L64–64 · 부모 LEGACY-BGM-031 |   - License: CC BY 4.0 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-036 · L65–65 | - 두 track 모두 기본 slider 0.70 / 기본 Audio output 0.60을 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-037 · L66–66 | - `the-game:lobby-entered` presentation event는 mode/setup/online waiting/rematch waiting 진입을 알리고 Constance로 복귀시킨다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-038 · L67–67 | - 기존 `the-game:game-started` presentation event는 local/online gameplay 시작을 알리고 Invariance로 전환시킨다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-039 · L68–68 | - BGM event는 게임 상태를 변경하지 않으며, 사용자 pause와 저장 volume은 track 전환보다 우선한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-040 · L70–70 | Player의 출처 영역은 현재 재생 중인 곡의 곡명, 아티스트, ISRC, 공식 Incompetech 곡 페이지와 CC BY 4.0 라이선스를 표시한다. Invariance에는 기존 YouTube reference도 함께 유지한다. Attribution의 기준은 YouTube 설명이나 MP3 파일명이 아니라 공식 Incompetech 곡 정보다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-041 · L72–72 | 현재 두 곡 모두 Incompetech의 공식 MP3 URL을 직접 사용한다. 향후 저장소에 self-host할 경우에도 공식 배포본 또는 출처가 검증된 사본을 사용하고, attribution metadata는 그대로 유지한 채 `src`만 로컬 asset으로 전환한다. | 표현:검증 | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### 6. Liar Game

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-042 · L76–76 | - Track: Deadly Roulette | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-043 · L77–77 | - Artist: Kevin MacLeod | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-044 · L78–78 | - ISRC: USUAN1600033 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-045 · L79–79 | - Official source: Incompetech | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-046 · L80–80 | - Reference video: Kevin MacLeod: Deadly Roulette (`Hnbv_KNxVo8`) | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-047 · L81–81 | - License: CC BY 4.0 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-048 · L82–82 | - Default slider volume: 0.35 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-049 · L83–83 | - Default output volume: 0.35 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-050 · L84–84 | - Loop: enabled | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-051 · L86–86 | Liar Game document가 로드되면 The Game과 같은 공통 BGM controller/player를 mount하고 즉시 재생을 시도한다. autoplay가 차단되면 기존 공통 interaction fallback을 사용하며 게임 인증, 방 생성/참가, Realtime 상태와는 독립적으로 동작한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### 7. Can’t Stop

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-052 · L90–90 | Can’t Stop은 하나의 게임 안에서 상태에 따라 BGM을 전환하는 첫 사례다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-053 · L92–92 | - Page entry / entry / waiting / rematch waiting: **Frozen Star — Kevin MacLeod** | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-054 · L93–93 · 부모 LEGACY-BGM-053 |   - ISRC: USUAN1100356 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-055 · L94–94 · 부모 LEGACY-BGM-053 |   - Official source: Incompetech | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-056 · L95–95 · 부모 LEGACY-BGM-053 |   - License: CC BY 4.0 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-057 · L96–96 | - Authoritative room status `playing` / gameplay / GAME_OVER presentation: **Mountain Emperor — Kevin MacLeod** | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-058 · L97–97 · 부모 LEGACY-BGM-057 |   - ISRC: USUAN1700012 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-059 · L98–98 · 부모 LEGACY-BGM-057 |   - Official source: Incompetech | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-060 · L99–99 · 부모 LEGACY-BGM-057 |   - License: CC BY 4.0 | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-061 · L100–100 | - 두 track 모두 기본 slider 0.70 / 기본 Audio output 0.60을 사용한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-062 · L101–101 | - 기존 dice/blizzard Web Audio SFX는 BGM과 분리된 game-local 효과음으로 유지한다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-063 · L102–102 | - BGM 전환은 authoritative snapshot을 변경하지 않고 `CANT_STOP_LOBBY_VIEW`를 읽는 presentation-only 동작이다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |
| LEGACY-BGM-064 · L103–103 | - 사용자가 Player에서 pause한 상태라면 lobby/gameplay 전환이 음악을 자동으로 다시 재생하지 않는다. | 서술형(수치화 안 함) | LOCAL_RULE / L | E-BGM | 발견 없음(새 소유 위치 미정) | L / 기존 보존/6 영향확인 | 변경 없음; 기존 범위 보존 | 개별 사례; 공통 승격 안 함 |

#### 8. 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-BGM-065 · L107–107 | - BGM 오류는 방 생성, 참가, 준비, 게임 시작, Realtime, reconnect에 영향을 주지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-066 · L108–108 | - 기존 SFX/Web Audio 구현은 수정하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-067 · L109–109 | - Room/Lobby shared contract에 BGM 메서드를 추가하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-068 · L110–110 | - 음악 선택, 기본 음량, 재생 연출은 각 게임의 presentation 책임으로 남긴다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-BGM-069 · L111–111 | - 저작권 또는 라이선스가 불명확한 음원을 catalog에 등록하지 않는다. | 서술형(수치화 안 함) | RULE / S | E-BGM | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 9. 검증

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

### SITE — `README.md`

- source: [README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/README.md)
- blob: `d51a355bb106e8ff3579e4615e6db1e2709fcd06`; 원문 370줄; 상태 `SITE_ENTRY`; 155 관리단위 / 25 규칙·필드 단위.


#### 청파 같이

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-001 · L3–3 | 청년 공동체의 활동, 공지, 기도 제목, 프로필, 알림과 소통을 위한 모바일 우선 웹 애플리케이션입니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-002 · L5–5 | 프론트엔드는 HTML/CSS/Vanilla JavaScript ES Modules로 구성됩니다. 루트 커뮤니티 앱은 `npm run build:assets`로 `js/app.js`를 content-hashed asset으로 빌드해 `assets/build/`과 `index.html`을 갱신한 뒤 GitHub Pages에서 제공합니다. 인증·데이터·권한·Storage·Realtime은 Supabase가 담당합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-003 · L7–7 | &gt; 이 README는 **청파 같이 본 사이트**를 설명합니다. Liar Game, The Game, Marble 등 게임 구현은 별도 영역으로 관리하며, 본 사이트 기반/구조 정리 작업에서는 게임 전용 소스·문서·DB 객체를 임의로 수정하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 1. 현재 주요 기능 > 회원/권한

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-004 · L13–13 | - 이메일 회원가입 및 로그인 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-005 · L14–14 | - 가입 신청 후 관리자 승인 | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-006 · L15–15 | - 승인 대기/거절/정지 상태별 접근 제어 | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-007 · L16–16 | - 일반 회원 / 관리자 / 활동 카테고리 담당자 권한 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-008 · L17–17 | - 프로필 이미지, 표시 이름, 나이 공개 범위, 소개, 관심 활동 관리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 1. 현재 주요 기능 > 활동

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

#### 1. 현재 주요 기능 > 공지사항 / 기도 제목

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-020 · L35–35 | - 공지사항 관리자 작성/수정/삭제 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-021 · L36–36 | - 중요/고정 공지 및 검색/페이지 이동 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-022 · L37–37 | - 기도 제목 승인 회원 작성/수정/삭제 | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-023 · L38–38 | - 함께 기도하기 반응 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-024 · L39–39 | - 응원 메시지 댓글 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-025 · L40–40 | - 댓글 작성자 프로필 조회 및 쪽지 보내기 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 1. 현재 주요 기능 > 쪽지/알림

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-026 · L44–44 | - 다른 회원 프로필에서 1:1 쪽지 보내기 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-027 · L45–45 | - 수신자 알림 생성 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-028 · L46–46 | - Supabase Realtime을 통한 새 알림 배지 갱신 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-029 · L47–47 | - 최근 알림 / 지난 알림 구분 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-030 · L48–48 | - 새 활동 알림의 유효 기간 관리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-031 · L49–49 | - 쪽지 읽기 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 1. 현재 주요 기능 > 관리자

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-032 · L53–53 | - 가입 신청 승인/보류/거절 | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-033 · L54–54 | - 회원 상태 및 관리자 권한 관리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-034 · L55–55 | - 활동 카테고리 담당자 관리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-035 · L56–56 | - 활동 카테고리 관리 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 2. 기술 구성

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-036 · L60–79 | ```text<br>GitHub Pages<br>  └─ HTML + CSS + Vanilla JS ES Modules<br>           │<br>           ├─ Hash Router<br>           ├─ Persistent App Shell<br>           ├─ Auth state / Route Guard<br>           ├─ Domain API modules<br>           ├─ UI Components<br>           └─ Domain Pages<br>                    │<br>                    ▼<br>                Supabase<br>           ├─ Authentication<br>           ├─ PostgreSQL<br>           ├─ RLS / RPC<br>           ├─ Storage<br>           ├─ Realtime<br>           └─ pg_cron<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-037 · L81–81 | 루트 커뮤니티 앱의 배포 자산을 갱신할 때는 Node/npm 의존성을 설치한 뒤 `npm run build:assets`를 실행합니다. 이 빌드는 `index.template.html`과 `js/app.js`를 기준으로 content-hashed `assets/build/` 및 배포용 `index.html`을 생성합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 3. 주요 파일 구조

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-038 · L85–159 | ```text<br>.<br>├── index.html<br>├── README.md<br>├── AUDIT_REPORT.md                # 과거 감사 기록<br>├── assets/<br>├── css/<br>│   ├── reset.css<br>│   ├── variables.css<br>│   ├── layout.css<br>│   ├── navigation.css<br>│   ├── components.css<br>│   ├── pages.css<br>│   ├── activity-card.css<br>│   ├── profile.css<br>│   ├── modal.css<br>│   ├── messaging.css<br>│   └── responsive.css<br>├── js/<br>│   ├── app.js<br>│   ├── router.js<br>│   ├── auth.js<br>│   ├── api.js                     # 기존 import 호환용 facade<br>│   ├── api/<br>│   │   ├── shared.js<br>│   │   ├── profiles.js<br>│   │   ├── activities.js<br>│   │   ├── boards.js<br>│   │   ├── admin.js<br>│   │   └── notifications.js<br>│   ├── notifications.js<br>│   ├── ui.js<br>│   ├── validators.js<br>│   ├── constants.js<br>│   ├── supabaseClient.js<br>│   ├── components/<br>│   │   ├── header.js<br>│   │   ├── bottomNav.js<br>│   │   ├── activityCard.js<br>│   │   ├── profilePopover.js<br>│   │   ├── modal.js<br>│   │   ├── toast.js<br>│   │   └── loading.js<br>│   └── pages/<br>│       ├── activities.js           # 라우트/필터 조립<br>│       ├── activities/<br>│       │   ├── listView.js<br>│       │   └── calendarView.js<br>│       ├── admin.js                # 관리자 섹션 조립<br>│       ├── admin/<br>│       │   ├── dashboard.js<br>│       │   ├── approvals.js<br>│       │   ├── members.js<br>│       │   ├── managers.js<br>│       │   └── categories.js<br>│       └── ...<br>├── scripts/<br>│   └── check-site.mjs<br>├── .github/workflows/<br>│   ├── community-authenticated-e2e.yml<br>│   ├── community-e2e-smoke.yml<br>│   ├── community-hashed-assets.yml<br>│   ├── game-db-integration.yml<br>│   └── site-static-checks.yml<br>├── docs/<br>│   └── site-foundation-audit.md<br>└── supabase/<br>    ├── README.md<br>    ├── notification_messaging_patch.sql<br>    └── site/<br>        ├── README.md<br>        ├── baseline/<br>        ├── seed.sql<br>        └── migrations/<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-039 · L161–161 | 게임 디렉터리와 게임 전용 Supabase 파일은 별도 관리 대상이므로 위 본 사이트 구조 설명에서 상세히 다루지 않습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 4. 주요 Hash Route

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

#### 5. 로컬 실행

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-063 · L194–194 | ES Module 보안 정책 때문에 `index.html`을 `file://`로 직접 열지 말고 정적 서버를 사용합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-064 · L196–198 | ```bash<br>python3 -m http.server 8080<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-065 · L200–200 | 브라우저에서 `http://localhost:8080`을 엽니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-066 · L202–202 | `js/config.js`에는 실제 Supabase Project URL과 브라우저 공개용 key가 필요합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-067 · L204–207 | ```js<br>export const SUPABASE_URL = "https://&lt;project-ref&gt;.supabase.co";<br>export const SUPABASE_PUBLISHABLE_KEY = "&lt;publishable-key&gt;";<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-068 · L209–209 | `service_role` 또는 secret key는 브라우저 코드와 공개 GitHub 저장소에 넣지 않습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 6. Supabase 운영

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

#### 7. 보안 모델

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-079 · L231–231 | - 로그인 상태만으로 권한을 신뢰하지 않고 RLS/RPC에서 다시 검증합니다. | 표현:검증 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-080 · L232–232 | - 승인된 회원만 일반 서비스 데이터에 접근하도록 제한합니다. | 표현:승인 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-081 · L233–233 | - 게시글/댓글의 일반 수정·삭제는 본인 소유권을 검사합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-082 · L234–234 | - 활동 관리 권한은 관리자 또는 현재 활성 카테고리 담당자를 검사합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-083 · L235–235 | - 알림은 자신의 row만 조회/수정합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-084 · L236–236 | - 쪽지는 발신자 또는 수신자만 조회합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-085 · L237–237 | - 공개 프로필 RPC는 승인 회원 여부를 서버에서 검사합니다. | 표현:승인 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 8. Web Push 운영 설정

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

#### 8. UI / 구조 > Persistent App Shell

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-096 · L274–274 | 승인 회원용 화면에서는 Header와 BottomNav를 라우트마다 다시 만들지 않습니다. 인증/권한 identity가 유지되는 동안 공통 Shell을 재사용하고 `#main-content`의 내용만 교체합니다. | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-097 · L276–276 | 이 구조는 Header의 Realtime 알림 상태와 이벤트 리스너를 불필요하게 다시 만들지 않도록 합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 8. UI / 구조 > 반응형 내비게이션

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-098 · L280–280 | - 모바일: 하단 고정 주요 메뉴 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-099 · L281–281 | - 관리자도 하단 메뉴에서 `내 정보` 접근 유지 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-100 · L282–282 | - 관리자 전용 화면은 모바일 헤더의 관리 바로가기와 데스크톱 상단 관리자 메뉴로 접근 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-101 · L283–283 | - 데스크톱: 상단 내비게이션 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-102 · L284–284 | - `360px`급 작은 화면 기본 대응 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-103 · L285–285 | - `prefers-reduced-motion` 대응 | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 8. UI / 구조 > CSS 역할

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

#### 8. UI / 구조 > 활동 카드 접근성

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-115 · L304–304 | 활동 카드의 빈 영역 클릭 UX는 유지하지만 JS가 `window.location.hash`를 직접 변경하지 않습니다. 제목의 실제 `&lt;a&gt;` 링크가 stretched-link로 카드 영역을 담당하고 참여/취소 버튼은 독립된 상호작용 요소로 유지합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 8. UI / 구조 > 자동 검수

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

#### 8. UI / 구조 > 공통 접근성

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-125 · L322–322 | - 본문 바로가기 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-126 · L323–323 | - `aria-current`, `aria-live`, dialog role 사용 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-127 · L324–324 | - 공통 모달 Escape 닫기 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-128 · L325–325 | - 공통 모달 Tab focus trap | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-129 · L326–326 | - 모달 종료 후 이전 포커스 복귀 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 9. 현재 기반/구조 정리 상태

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

#### 10. 개발/병합 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-150 · L358–358 | 큰 구조 변경은 `main`에 직접 작업하지 않고 별도 브랜치에서 진행합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-151 · L360–360 | 작업 후 변경 내용을 먼저 검토하고 승인된 경우에만 `main`에 반영합니다. | 표현:승인 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITE-152 · L362–362 | 청파 같이 본 사이트 정리 중에는 게임 활동 관련 소스를 건드리지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Game Platform vNext 재구축 작업

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITE-153 · L366–366 | 게임 플랫폼 vNext 재구축 작업의 단일 실행 계획은 &#91;`game_platform_vnext_final_execution_plan.md`&#93;(./game_platform_vnext_final_execution_plan.md), 현재 진행/재개 기록의 진입점은 &#91;`docs/game-platform-rebuild/README.md`&#93;(./docs/game-platform-rebuild/README.md)입니다. | 서술형(수치화 안 함) | CONTROL / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-154 · L368–368 | 개정 1.3부터 승인된 STEP 결과는 `feature/game-platform-vnext-integration`에 누적하고, 각 STEP은 별도 작업 브랜치와 integration base PR로 검토합니다. STEP PR의 integration 병합과 최종 integration → main 반영은 서로 다른 승인 게이트입니다. | 표현:승인 | CONTROL / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITE-155 · L370–370 | 새 채팅에서 재개할 때는 루트 `AGENTS.md`의 **Game Platform vNext 재구축 작업 재개** 항목과 위 기록 진입점을 먼저 확인합니다. STEP 0이 integration에 아직 병합되지 않은 동안에는 현재 작업 브랜치 `docs/game-platform-vnext-phase0-bootstrap`과 PR #404도 함께 확인합니다. 이 안내는 vNext 재구축 작업에 한정되며 기존 Game Platform 규칙의 권위나 게임 구현 상태, 저장소 전체의 일반 브랜치 정책을 변경하지 않습니다. | 서술형(수치화 안 함) | CONTROL / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### DBOPS — `supabase/README.md`

- source: [supabase/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/README.md)
- blob: `6f79e559386f600bd524615d61dd1e60c361c759`; 원문 179줄; 상태 `SITE_POLICY`; 102 관리단위 / 46 규칙·필드 단위.


#### 청파 같이 Supabase 운영 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-001 · L3–3 | 이 문서는 **청파 같이 본 사이트**의 Supabase 변경 원칙을 정의합니다. | 표현:원칙 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-002 · L5–5 | &gt; Legacy와 platform-native를 포함한 게임 전용 테이블, RPC, Realtime, 문서와 SQL은 이 문서의 정리·리팩터링 범위에서 제외합니다. 게임 영역은 각 게임의 전용 DB/RPC 계약과 migration에서 별도 관리합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 1. 현재 Source of Truth

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

#### 2. 청파 같이 본 사이트 범위

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-011 · L24–24 | 현재 본 사이트의 핵심 DB 영역은 다음과 같습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-012 · L26–26 | - 회원/승인: `profiles`, `join_requests`, `profile_interests` | 표현:승인 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-013 · L27–27 | - 활동: `activity_categories`, `category_managers`, `events`, `event_series`, `event_participants` | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-014 · L28–28 | - 게시판: `posts`, `comments` | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-015 · L29–29 | - 알림/쪽지: `notifications`, `direct_messages` | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-016 · L31–31 | 같은 Supabase 프로젝트에 존재하더라도 `admin_users`, `site_settings`, `mission_posts` 등을 기준으로 동작하는 별도 객체는 청파 같이 본 사이트 baseline에 포함하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 3. DB 변경 절차

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

#### 4. 보안 원칙

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

#### 5. 보안 점검 범위 정정

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

#### 6. 게임 영역 보호 규칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-045 · L78–78 | 청파 같이 본 사이트 정리 작업에서는 Legacy와 platform-native를 포함한 게임 전용 DB 영역을 수정하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-046 · L80–80 | - 게임 전용 테이블/RPC/Realtime 구조 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-047 · L81–81 | - `supabase/&lt;game-id&gt;/` 아래의 게임 전용 migration | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-048 · L82–82 | - 게임 전용 SQL 및 게임 전용 문서 | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBOPS-049 · L84–84 | 공통 DB 변경이 게임에 영향을 줄 가능성이 있으면 변경 전에 영향도를 별도로 확인합니다. 특정 게임명을 이 목록에 계속 추가하는 방식으로 범위를 관리하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 7. 활동 장소 검색 Edge Function 설정

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-050 · L88–88 | 활동 장소와 지도 링크의 좌표 해석은 `resolve-map-link` Edge Function에서 NAVER API HUB 지역 검색을 사용합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-051 · L90–90 | 운영 환경에는 다음 두 값을 **Supabase Edge Function Secret**으로 등록합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-052 · L92–92 | - `NAVER_API_HUB_CLIENT_ID` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-053 · L93–93 | - `NAVER_API_HUB_CLIENT_SECRET` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-054 · L95–95 | 이 값들은 서버 전용 인증 정보이므로 `js/config.js`나 다른 브라우저 소스에 넣지 않습니다. Secret을 변경하면 Edge Function을 다시 배포하지 않아도 런타임에서 새 값이 사용됩니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-055 · L97–97 | 지도 렌더링은 NAVER Cloud Maps Web Dynamic Map Client ID를 계속 사용하며, 카카오 JavaScript 키는 카카오톡 활동 공유 기능에서만 사용합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 8. 공통 메일 발송 시스템

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-056 · L101–101 | 메일은 **인증 메일**과 **서비스 메일**을 구분합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 8. 공통 메일 발송 시스템 > 8.1 인증 메일

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-057 · L105–105 | 회원가입 이메일 OTP, 비밀번호 재설정 등 인증 수명주기에 속한 메일은 Supabase Auth가 담당합니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-058 · L107–107 | - 회원가입 인증번호: `supabase.auth.signInWithOtp()` / `verifyOtp()` | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-059 · L108–108 | - 비밀번호 재설정: Supabase Auth recovery 흐름 | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-060 · L109–109 | - 발송 SMTP 설정: Supabase Auth의 Custom SMTP에서 Google 계정과 앱 비밀번호를 관리 | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-061 · L111–111 | 서비스 메일 공통화 작업은 `Authentication &gt; Emails &gt; SMTP Settings`의 기존 Auth SMTP 설정을 대체하거나 수정하지 않습니다. 서비스 Edge Function에서도 인증번호를 직접 생성하거나 별도의 challenge 테이블을 만들지 않습니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 8. 공통 메일 발송 시스템 > 8.2 서비스 메일

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

#### 8. 공통 메일 발송 시스템 > 8.3 새 서비스 메일 추가 규칙

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

#### 8. 공통 메일 발송 시스템 > 8.4 서비스 메일 운영 진단

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

#### 8. 공통 메일 발송 시스템 > 8.5 레거시 회원가입 메일 제거

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBOPS-101 · L177–177 | 초기 다단계 회원가입 구현에서 사용했던 `signup-verification` Edge Function과 `signup_email_challenges` 기반 자체 OTP 방식은 현재 Native Supabase Auth OTP 경로에서 사용하지 않습니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DBOPS-102 · L179–179 | DB의 미사용 challenge 테이블 및 RPC는 `20260914075722_remove_legacy_signup_email_verification.sql`에서 제거합니다. 운영 반영 시에는 더 이상 호출되지 않는 배포본 `signup-verification` Edge Function도 함께 삭제하여 레거시 실행 경로를 남기지 않습니다. | 서술형(수치화 안 함) | OUT_OF_SCOPE / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### SITEDB — `supabase/site/README.md`

- source: [supabase/site/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/supabase/site/README.md)
- blob: `02426634228d360249c868d7ed2529ecfded8dd5`; 원문 149줄; 상태 `SITE_POLICY`; 64 관리단위 / 7 규칙·필드 단위.


#### 청파 같이 본 사이트 DB 이력

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-001 · L3–3 | 이 디렉터리는 **청파 같이 본 사이트**의 Supabase baseline과 이후 운영 migration을 보존합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-002 · L5–5 | Legacy와 platform-native를 포함한 게임 전용 소스와 DB 객체는 이 디렉터리의 관리 범위에서 제외하며, 각 게임의 전용 migration 영역에서 별도 관리합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 구성

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-003 · L9–34 | ```text<br>supabase/site/<br>├── README.md<br>├── baseline/<br>│   ├── 00_setup.sql<br>│   ├── 01_members.sql<br>│   ├── 02_activity_categories.sql<br>│   ├── 03_events.sql<br>│   ├── 04_posts_comments.sql<br>│   ├── 05_date_polls.sql<br>│   ├── 06_notifications.sql<br>│   ├── 07_common_triggers.sql<br>│   ├── 08_auth_profile.sql<br>│   ├── 09_admin_rpc.sql<br>│   ├── 10_participation_rpc.sql<br>│   ├── 11_rls.sql<br>│   └── 12_avatar_storage.sql<br>├── seed.sql<br>└── migrations/<br>    ├── 20260825041209_expand_notifications_and_direct_messages.sql<br>    ├── 20260825041340_lock_down_notification_rpc_permissions.sql<br>    ├── 20260825041418_schedule_activity_reminder_notifications.sql<br>    ├── 20260825041451_index_notification_message_target.sql<br>    ├── 20260825090540_add_date_poll_fk_covering_indexes.sql<br>    └── 20260825103805_add_public_member_profiles_by_ids.sql<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### baseline 출처

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-004 · L38–38 | `baseline/00_setup.sql`부터 `12_avatar_storage.sql`까지는 2026-08-25에 전달받은 청파 같이 원본 `schema.sql`을 번호가 매겨진 기존 섹션 기준으로 분리한 것입니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-005 · L40–40 | - SQL 객체의 의미와 정의는 바꾸지 않았습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-006 · L41–41 | - 각 파일을 순서대로 독립 실행할 수 있도록 `begin` / `commit` 경계만 파일 단위로 구성했습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-007 · L42–42 | - 원본과 분리본의 실행 SQL 2,139개 행을 비교하여 순서와 내용이 일치함을 확인했습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-008 · L43–43 | - 새 프로젝트를 재구성할 경우 파일명 순서대로 실행합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### seed

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-009 · L47–47 | `seed.sql`은 전달받은 초기 활동 카테고리 seed입니다. 2026-08-25 운영 DB와 비교하여 카테고리 이름, 아이콘, 색상, 설명, 활성 상태가 모두 일치함을 확인했습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-010 · L49–49 | baseline 실행 후 seed를 실행합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 운영 migration

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

#### 운영 migration > 관리자 역할 및 영역 권한

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-026 · L75–79 | `20260908090000_add_admin_permission_system`은 기존 `profiles.role`을 유지하면서<br>`member`(USER), `admin`(ADMIN), `system_admin`(SYSTEM_ADMIN) 3단계 역할과<br>`admin_permissions`의 영역별 권한을 추가합니다. 기존 승인 관리자는 서비스 중단을<br>막기 위해 일반 관리자 역할과 5개 운영 영역 권한을 그대로 받지만 최고 관리자로<br>자동 승격되지는 않습니다. | 표현:승인 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-027 · L81–82 | 권한 migration을 운영 DB에 적용한 후, 배포 담당자는 실제 소유자 UUID를 확인한 뒤 서버 권한으로 아래 초기화를 정확히 한 번<br>실행해야 합니다. 부분 unique index가 최고 관리자 2명 생성을 차단합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-028 · L84–86 | ```sql<br>select public.bootstrap_system_admin('&lt;verified-admin-uuid&gt;'::uuid);<br>``` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-029 · L88–89 | 브라우저에서는 이 초기화 RPC를 실행할 수 없습니다. 이후 일반 관리자 지정/해제와<br>영역 권한 관리는 최고 관리자 UI 및 서버에서 재검증되는 RPC만 사용합니다. | 표현:검증 | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 운영 migration > 날짜투표 FK 인덱스

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-030 · L93–93 | `20260825090540_add_date_poll_fk_covering_indexes`는 Supabase Performance Advisor가 지적한 본 사이트 날짜투표 FK 2개의 covering index를 추가합니다. 적용 후 해당 `unindexed_foreign_keys` 경고가 사라졌음을 확인했습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 운영 migration > 필요한 회원 프로필만 조회

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

#### 같은 Supabase 프로젝트의 별도 객체

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-040 · L113–113 | 운영 프로젝트에는 다음처럼 청파 같이 본 사이트 baseline이나 위 migration으로 생성되지 않은 별도 객체도 존재합니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-041 · L115–115 | - `public.is_admin()` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-042 · L116–116 | - `public.rls_auto_enable()` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-043 · L117–117 | - `public.set_updated_at()` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-044 · L118–118 | - `public.get_admin_storage_usage(...)` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-045 · L119–119 | - `public.get_admin_table_usage()` | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-SITEDB-046 · L121–121 | 일부 함수는 `admin_users`, `site_settings`, `mission_posts` 등 현재 청파 같이의 `profiles` 기반 권한 구조와 다른 테이블을 참조합니다. 따라서 이 디렉터리에 억지로 포함하거나 이번 기반 정리에서 삭제하지 않습니다. | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 운영 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-SITEDB-047 · L125–125 | - 운영 DB를 추측해서 덮어쓰지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-048 · L126–126 | - 새 DDL 변경은 실제 적용 migration과 GitHub 기록을 함께 남깁니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-049 · L127–127 | - 운영 반영 전 RLS, 함수 실행 권한, trigger 영향 범위를 확인합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-050 · L128–128 | - 새 Data API 노출 객체 또는 기존 객체의 권한 경계를 다루는 DDL은 상위 `supabase/README.md`의 명시적 권한 원칙을 따릅니다. | 표현:원칙 | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-051 · L129–129 | - 이미 적용된 migration을 운영 DB에 재실행하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-052 · L130–130 | - Advisor의 SECURITY DEFINER 경고는 실제 호출 주체와 함수 내부 권한 검사를 확인한 뒤 판단합니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-SITEDB-053 · L131–131 | - 게임 전용 DB 객체와 SQL은 각 게임 영역에서 별도 관리하며 이 디렉터리에서 수정하지 않습니다. | 서술형(수치화 안 함) | RULE / S | E-SITE | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 운영 원칙 > 다단계 회원가입 이메일 OTP 배포

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

### DBTEST — `tests/game-db-integration/README.md`

- source: [tests/game-db-integration/README.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/tests/game-db-integration/README.md)
- blob: `99b8acac6244f4e128766d6a36b6159ce9883848`; 원문 44줄; 상태 `TEST_GUIDE`; 22 관리단위 / 14 규칙·필드 단위.


#### Game DB 통합 테스트 기반

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBTEST-001 · L3–3 | 이 문서는 게임 DB 통합 테스트 기반의 범위와 운영 원칙을 설명한다. | 표현:원칙 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-002 · L5–5 | Phase 2-A에서 기존 게임 RPC/RLS 동작을 수정하기 전에 disposable Supabase 통합 테스트 환경을 먼저 구축했다. Phase 2-B에서는 이 기반을 당시 Liar v1.0 이후 스키마까지 확장하고 Liar / Drawing Spy 진입 권한 경계를 보호하도록 했다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 현재 범위

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

#### 안전 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBTEST-011 · L22–22 | - harness는 disposable local Supabase workdir인 `.game-db-e2e`만 사용한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-012 · L23–23 | - production Supabase 프로젝트에 연결하거나 migration을 적용하지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-013 · L24–24 | - Marble runtime/gameplay 파일은 수정하지 않으며 migration만 disposable database에 replay한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-014 · L25–25 | - Liar / Drawing Spy의 pending, rejected, suspended 계정은 room을 생성하거나 참가할 수 없다. 참가 후 suspended 상태가 된 계정도 entry API를 통해 기존 room을 다시 찾거나 resume할 수 없다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-015 · L26–26 | - Phase 2-B는 Liar gameplay RPC를 리팩터링하거나 broad mid-session revocation mechanism을 추가하지 않는다. 이런 변경은 접근 경계 수정에 숨겨 넣지 않고 별도의 lifecycle 정책과 회귀 검증 범위로 다룬다. | 표현:검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### 실행

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBTEST-016 · L30–30 | `Game DB integration` GitHub Actions workflow는 관련 game DB/harness Pull Request에서만 자동 실행하며 필요할 때 수동 실행할 수 있다. GitHub Actions 사용량을 아끼기 위해 모든 feature branch push마다 실행하지 않는다. | 표현:할 수 있다 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-017 · L32–32 | workflow는 Liar canonical installer가 immutable pinned Git blob을 해석해야 하므로 full Git history를 checkout한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

#### Platform-native 계약

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DBTEST-018 · L36–36 | Phase 3E에서 `platformContract.js`를 신규 platform-native 게임이 재사용하는 server-boundary 계약으로 추가했다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-019 · L38–38 | 이 계약은 공통 game schema나 공통 gameplay RPC 구현을 만들지 않는다. 각 게임은 자신의 table, RPC 이름, rule state, fixture를 유지한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-020 · L40–40 | 신규 online platform game은 `tests/game-db-integration/&lt;game-id&gt;.test.js`를 추가하고 `docs/game-platform-db-test-contract.md`에 정의된 필수 10개 시나리오를 등록해야 한다. | 표현:필수 | RULE / M-DB | E-DB | C02/F03 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-021 · L42–42 | workflow는 동일한 disposable Supabase instance에서 모든 `tests/game-db-integration/*.test.js`를 실행한다. 따라서 신규 게임 contract test를 추가할 때 별도의 workflow를 만들 필요가 없다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DBTEST-022 · L44–44 | Can’t Stop은 이 계약의 첫 production platform-native 소비 사례다. `tests/game-db-integration/cant-stop.test.js`는 승인회원, room membership, host 권한, stale version, idempotency, concurrent conflict, reconnect, private-state 경계에 더해 Can’t Stop의 gameplay, Invite, rematch/leave lifecycle을 회귀 검증한다. | 표현:승인,검증 | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |

### STRATEGY — `docs/game-platform-strategy.md`

- source: [docs/game-platform-strategy.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-strategy.md)
- blob: `344297d7d806f164082bcb5a88e41610d3db4d10`; 원문 253줄; 상태 `HISTORY`; 121 관리단위 / 0 규칙·필드 단위.


#### Game Platform Strategy

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-001 · L3–3 | &gt; **문서 분류:** HISTORY | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-002 · L5–5 | &gt; **문서 성격:** 이 문서는 Game Platform을 구축한 전략과 단계별 결정 배경을 보존하는 참고 문서다. 신규 platform-native 게임의 현재 실행 규칙은 `docs/game-platform-development-rules.md`를 따르며, 실제 계약은 `games/shared/` 코드와 테스트를 기준으로 확인한다. 특정 게임명이나 당시 구현 내용이 등장하더라도 역사적 이력일 뿐 현재 신규 게임의 규칙·템플릿·구현 기준으로 사용하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 1. 목적

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

#### 2. Legacy 4게임 정책

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

#### 3. Legacy는 플랫폼 설계의 제약조건이 아니다

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-033 · L56–56 | 새 플랫폼은 기존 네 게임에 모두 끼워 맞출 수 있어야 하는 호환 프레임워크가 아니다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-034 · L58–58 | 기존 구조와 호환시키기 위해 새로운 공통 API가 복잡해지거나 예외가 늘어난다면 Legacy 적용을 포기한다. | 표현:예외 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-035 · L60–60 | 즉 판단 기준은 다음과 같다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-036 · L62–62 | - "기존 게임에도 적용 가능한가?"보다 "앞으로 수십 개 게임에 단순하고 안정적인가?"를 우선한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-037 · L63–63 | - Legacy와 신규 플랫폼의 차이를 줄이기 위한 adapter/예외 코드를 무분별하게 추가하지 않는다. | 표현:예외 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-038 · L64–64 | - 과거 중복을 제거하기 위해 Legacy 전체를 공통화하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-039 · L65–65 | - 앞으로 생길 중복을 막는 데 집중한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 4. 신규 게임의 기본 구조

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

#### 5. 서버 권위와 Realtime 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-064 · L102–102 | 신규 멀티플레이 게임은 다음 흐름을 기본으로 한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-065 · L104–113 | ```text<br>Client intent<br>→ authenticated game-specific RPC<br>→ membership / role / phase / expected_version 검증<br>→ transaction / row lock<br>→ authoritative DB state<br>→ Realtime invalidation<br>→ authorized snapshot refresh<br>→ UI render<br>``` | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-066 · L115–115 | Realtime 이벤트 자체를 게임 상태의 최종 진실로 사용하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-067 · L117–117 | Reconnect 시 이벤트를 처음부터 재생하는 대신 authoritative snapshot을 다시 받아 복원할 수 있어야 한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 6. Versioned / Idempotent Action 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-068 · L121–121 | 새 게임의 상태 변경 명령은 가능한 한 다음 식별자를 가진다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-069 · L123–127 | ```text<br>room_id<br>expected_version<br>client_action_id<br>``` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-070 · L129–129 | - `expected_version`: 오래된 클라이언트의 명령이 최신 상태를 덮어쓰지 못하게 한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-071 · L130–130 | - `client_action_id`: 네트워크 재시도나 중복 클릭이 같은 명령을 두 번 처리하지 않게 한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-072 · L131–131 | - 실제 게임별 RPC와 테이블 이름은 게임 namespace에 남겨 둔다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-073 · L133–133 | 플랫폼은 하나의 거대한 공통 게임 상태 테이블을 만들지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 7. Common Game Shell 원칙

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

#### 8. Platform-native Invite 원칙

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

#### 9. 추후 Remaster 전략

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-098 · L189–189 | Game Platform이 충분히 검증된 뒤 기존 게임을 새 플랫폼 위에서 다시 제공하고 싶다면 선택적으로 Remaster 버전을 새로 구현할 수 있다. | 표현:검증,할 수 있다 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-099 · L191–191 | 이때 기본 전략은 과거 코드를 억지로 마이그레이션하는 것이 아니라: | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-100 · L193–193 | 1. 기존 게임을 동작/규칙/UX 참고 자료로 사용 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-101 · L194–194 | 2. 검증된 Game Platform 공통 기능을 재사용 | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-102 · L195–195 | 3. 게임 고유 규칙과 연출을 새 플랫폼 규칙에 맞게 다시 구현 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-103 · L196–196 | 4. 신규 버전이 충분히 검증된 뒤 교체 여부를 별도로 판단 | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-104 · L198–198 | 따라서 현재 Legacy를 그대로 보존하는 것은 기술 부채를 방치하는 것이 아니라 미래의 안전한 재구현을 위한 의도적인 경계다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 10. 현재 단계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-105 · L202–213 | ```text<br>Stable Legacy stabilization<br>→ Phase 3A: Registry + Access Gate<br>→ Phase 3B: Room/Lobby + Snapshot/Reconnect + Versioned Action contracts<br>→ Phase 3C: Common Game Shell + connection/player UI contract<br>→ Phase 3D: platform-native game_room Invite + legacy invite impact analysis<br>→ Phase 3E: reusable DB/test contract gate<br>→ Phase 4: Can’t Stop 신규 구현 및 첫 production 검증 — COMPLETE<br>→ Post-Phase 4: Can’t Stop 피드백을 플랫폼 규칙/거버넌스에 환류<br>→ 다음 platform-native 게임으로 공통성 2차 검증<br>→ 필요 시 Legacy Remaster<br>``` | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-106 · L215–215 | Phase 3D까지의 공통 기반은 Legacy 게임 런타임에 강제로 연결하지 않는다. The Game의 기존 초대 흐름은 별도 Legacy 경로로 유지한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-107 · L217–217 | Phase 3E에서는 공통 게임 DB 스키마나 공통 RPC를 만들지 않는다. 대신 신규 온라인 게임이 반드시 검증해야 할 승인회원, 멤버십, host 권한, stale version, idempotency, 동시성, reconnect snapshot, private-state 노출 방지 시나리오를 공통 테스트 계약으로 고정한다. 상세 기준은 `docs/game-platform-db-test-contract.md`를 따른다. | 표현:반드시,승인,검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-108 · L219–219 | Can’t Stop은 이미 존재하는 게임을 플랫폼으로 옮기는 작업이 아니라, Phase 4에서 `games/cant-stop/` 아래에 처음부터 생성하는 첫 platform-native 게임이며 Phase 3E DB 계약의 첫 실제 소비자가 된다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-109 · L221–221 | Can’t Stop v1은 2026-09-21 production release까지 완료되어 Registry `online` / `invite`, authoritative DB/RPC, reconnect, rematch/leave, shared Invite, Game DB contract가 실제 한 게임의 전체 lifecycle에서 동작하는 것을 검증했다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 11. Platform-native 출시 후 검증 사이클

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-110 · L225–225 | 첫 production 게임의 성공은 Game Platform이 완성됐다는 뜻이 아니다. 각 출시는 **하나의 실전 표본**이며, 다음 게임에서도 공통 기반의 일반성을 다시 검증한다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-111 · L227–227 | 첫 production 검증을 통해 다음 경계는 유지할 가치가 확인됐다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-112 · L229–229 | - 인증/승인회원, Registry, Room/Lobby adapter, snapshot/reconnect, version/idempotency, Invite, DB contract는 SHARED 책임으로 재사용한다. | 표현:승인 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-113 · L230–230 | - production migration과 capability activation은 소스 구현과 분리한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-114 · L231–231 | - 게임 출시 시 문서 상태를 `RELEASED / main`으로 닫고, stacked PR과 임시 브랜치를 정리해야 다음 작업자가 과거 브랜치를 현재 기준으로 오해하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-115 · L232–232 | - 한 게임에서 발견된 편의 기능은 곧바로 shared abstraction으로 승격하지 않는다. 두 번째 이후 게임에서 같은 플랫폼 책임이 반복될 때 계약을 확장한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-116 · L234–234 | 따라서 현재 Game Platform의 다음 목표는 "공통 기능을 더 많이 만드는 것"이 아니라 **다음 신규 게임에서 기존 shared 계약을 가능한 한 그대로 사용하고, 실제로 반복되는 부족한 계약만 최소 확장하는 것**이다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 12. 장기 확장성 원칙

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-STRATEGY-117 · L238–238 | Game Platform은 신규 게임이 추가될수록 함께 검증되고 개선되어야 한다. 게임 수가 늘어나는 것 자체보다 더 큰 위험은 각 게임이 서로 다른 구조·용어·권위 모델·배포 절차를 갖게 되어 **새 기능을 만들 때마다 저장소 전체를 다시 탐색해야 하는 상태**가 되는 것이다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-118 · L240–240 | 따라서 플랫폼의 장기 성공 기준은 단순한 코드 재사용률이 아니라 **신규 게임 한 개를 추가하는 데 필요한 탐색·판단·검증 비용이 통제되는가**로 본다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-119 · L242–242 | 새 게임을 출시할 때마다 다음을 반복한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-120 · L244–251 | ```text<br>기존 플랫폼 규칙으로 구현<br>→ 실제 개발 마찰 기록<br>→ release 후 플랫폼 회고<br>→ SHARED / GAME-LOCAL / RELEASE-OPERATIONS 재분류<br>→ 필요한 규칙·계약·테스트만 최소 수정<br>→ 다음 게임에서 다시 검증<br>``` | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-STRATEGY-121 · L253–253 | 이 순환을 통해 플랫폼 규칙은 점점 더 많은 게임을 포괄하면서도 예외가 누적되는 방향이 아니라 **더 예측 가능하고 단순한 방향**으로 발전해야 한다. 새 규칙을 추가하는 것만이 개선이 아니며, 사용하지 않는 규칙을 제거하거나 중복된 절차를 합치고 과도한 추상화를 되돌리는 것도 동일하게 중요한 개선으로 본다. | 표현:예외 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

### INV-H — `docs/game-platform-invite-analysis.md`

- source: [docs/game-platform-invite-analysis.md](https://github.com/limbit95/limbit95.github.io/blob/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/docs/game-platform-invite-analysis.md)
- blob: `645f565e9c9a2b069bb2be13d70e14c12af2a38f`; 원문 125줄; 상태 `HISTORY`; 45 관리단위 / 0 규칙·필드 단위.


#### Game Platform Invite Analysis

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-001 · L3–3 | &gt; **문서 분류:** HISTORY | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-002 · L5–5 | &gt; **문서 성격:** 이 문서는 Phase 3D 당시 기존 Invite 구조를 조사하고 platform-native Invite 방향을 결정한 분석 기록이다. 신규 게임의 현재 Invite 구현 규칙은 `docs/game-platform-development-rules.md`와 `games/shared/gameInvite.js`를 기준으로 한다. 이 문서는 필수 선행 계약 문서가 아니다. | 표현:필수 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 목적

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-003 · L9–9 | Phase 3D는 기존 게임 초대를 그대로 플랫폼 표준으로 승격하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-004 · L11–11 | 현재 초대 구현의 실제 영향 범위를 확인한 뒤, 재사용할 수 있는 사이트 공통 기반과 Legacy 전용 연결 코드를 분리하고 신규 platform-native 게임용 Invite 계약을 정의한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 현재 구조

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

#### Legacy 소비 현황

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-016 · L45–45 | 현재 확인된 게임 초대 소비자는 The Game이다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-017 · L47–53 | ```text<br>the-game/js/inviteIntegration.js<br>target_type = the_game_room<br>/invite.html<br>→ /the-game/?invite=&lt;token&gt;<br>→ The Game 전용 참가 흐름<br>``` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-018 · L55–55 | Liar Game / Drawing Spy / Marble에는 별도의 invite 전용 모듈이 확인되지 않았다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-019 · L57–57 | The Game 초대는 Legacy 동작으로 취급한다. Phase 3D에서 제거하거나 platform-native 계약으로 마이그레이션하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### Platform-native 표준

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

#### 라우팅

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-029 · L86–98 | ```text<br>/invite.html?token=...<br>→ site_invite_resolve(token)<br>→ target_type = game_room<br>→ metadata.game_id 검증<br>→ Game Registry 검증<br>→ Registry href + ?invite=&lt;token&gt;<br>→ platform-native 게임<br>→ 해당 게임이 token을 다시 resolve<br>→ expected game id 검증<br>→ room id 획득<br>→ 게임별 Room/Lobby join RPC<br>``` | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-030 · L100–100 | 초대 토큰을 해석하는 것만으로 방 멤버가 되지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-031 · L102–102 | 최종 참가 권한, 정원, 방 상태, 중복 참가, 게임별 정책은 반드시 해당 게임의 서버 RPC가 결정한다. | 표현:반드시 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 보안 경계

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-032 · L106–106 | - 초대 metadata의 임의 URL을 redirect 대상으로 사용하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-033 · L107–107 | - Registry에 없는 게임으로 이동하지 않는다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-034 · L108–108 | - Legacy 게임은 `game_room` 대상이 될 수 없다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-035 · L109–109 | - invite capability를 명시하지 않은 신규 게임은 대상이 될 수 없다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-036 · L110–110 | - 다른 게임용 token을 현재 게임에서 해석하면 game mismatch로 거부한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-037 · L111–111 | - 지원하지 않는 platform version은 거부한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-038 · L112–112 | - client-side 검증은 편의/라우팅 경계이며 DB authorization을 대체하지 않는다. | 표현:검증 | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |

#### 기존 The Game 초대 제거 시점

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-INV-H-039 · L116–116 | The Game의 기존 초대 기능은 현재 정상 동작 보호를 위해 이번 Phase에서 그대로 둔다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-040 · L118–118 | 향후 제거를 결정한다면 별도 작은 작업으로 다음만 제거한다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-041 · L120–120 | - `the-game/js/inviteIntegration.js` | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-042 · L121–121 | - The Game의 invite script/style 연결 | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-043 · L122–122 | - `the_game_room` handler | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-044 · L123–123 | - The Game 전용 invite E2E | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-INV-H-045 · L125–125 | 사이트 공통 `site_invites`, `/invite.html`, `js/invites/` 자체는 신규 Game Platform에서도 사용하므로 제거 대상이 아니다. | 서술형(수치화 안 함) | HISTORY / H | E-DOC | 발견 없음(새 소유 위치 미정) | H / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
