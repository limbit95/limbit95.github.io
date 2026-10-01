# STEP 3 — Work Astra 사후 감사

- 감사일: 2026-10-02 KST (2026-10-01 UTC).
- 역할·범위: `Game_Platform_vNext_STEP3_work_guide.md` 모델별 작업 순서 **5번**. 가이드 3번 Astra 판단도 독립 검증 대상이다.
- **고정 감사 대상: `79a03bca8ecba10eee4473156168aae5fa7faeb3`.** 아래 산출물·줄 번호·제출 상태 판정은 이 SHA에 적용한다.
- 기준 integration: `feature/game-platform-vnext-integration` / `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`. 마지막 반영 승인 STEP 2 / PR #409 MERGED.
- 유지할 작업 브랜치: `docs/game-platform-vnext-phase3-stress-preparation`; 기존 [PR #410](https://github.com/limbit95/limbit95.github.io/pull/410), base integration, OPEN / Draft / 미병합.
- 입력 우선순위: 계획 개정 1.3 → 유효한 기존 규칙·STEP 1 계승 근거 → 승인된 STEP 2 산출물 → STEP 3 판단/정식 산출물. 보조 조사는 참고다.

## 1. 판정과 적용 한계

**최종 판정: 승인 검토 가능. 신규 finding Critical 0 / Major 0 / Minor 0. STEP 2 즉시 회귀 불필요라는 결론은 감사 범위에서 타당하다.**

11개 사례의 7축·Capability·장르/신규 문서·Core 필요성, 규칙/계약/구현 증거의 분리, 6개 시나리오와 7개 리스크·후속 책임이 보존됐다. 기존 규칙의 예외를 새로 승인하거나 실제 구현 지원을 선언한 부분은 발견하지 않았다. 원문과 동일하다는 사실 외에 현행 규칙·선택 코드·계획을 직접 대조했다.

이 판정은 STEP 3 문서 결과를 사용자가 검토할 수 있다는 뜻이다. 사용자 결과 승인, integration 또는 main 병합 승인, STEP 3 COMPLETED, STEP 4A 착수, production 활성화를 대신하지 않는다. 현행 F01~F03, S2-R01~04, S3-R01~07 및 U02 등 후속 미결정은 해소 처리하지 않는다. runtime 안전성·성능·운영 지원을 증명한 감사가 아니다.

## 2. 실제 복원 상태와 비교 범위

AGENTS → 루트 실행 계획 1.3 → 기록 README를 읽고, 재개 담당이 원격 branch/PR을 조회한 결과와 CURRENT/CP-0026을 대조했다. 기록만으로 원격 상태를 단정하지 않았다. 감사 시작 시 PR #410 head와 원격 STEP branch가 모두 대상 `79a03bc…`, base와 integration이 `177533f…`임을 확인했다.

| 비교 | 확인 결과와 의미 |
|---|---|
| integration → 고정 감사 SHA | PR 전체 22개 문서 경로. STEP 3 준비/판단/제출 및 진행 기록의 누적 범위 |
| 가이드 4번 입력 `41d78ef37f88cd7ea179c805fd9bf1141541284b` → 대상 SHA | union 10파일. 정식 산출물 5개, CURRENT, 분담, CP-0024~0026. PR 전체와 구분 |
| Astra 판단 원문 | 입력 `41d78ef…`의 blob `8341f47ef729403437b6778db78b252abc02da1b` 보존. §1~7은 정식 세 문서 본문과 동일; §8은 당시 인계 이력으로 보존 |
| 보조 조사 원본 | SHA256 `464b78d36fe47a14a414f94448c579c5c848811d24bf9204149b5fd1cee0cc16` 보존 |
| 감사 중 기록 저장 `0213c899b4ede706d7586ecc56016dd22a3bcb4d` | 대상 이후 CURRENT와 새 CP-0027만 변경. `git diff --name-status 79a03bc… 0213c89…`로 확인. 감사 대상 산출물은 불변 |
| 감사 제출 commit | 본 보고서와 필요한 진행 기록의 저장 commit이다. 자기 SHA를 미리 기록하지 않으며 실제 원격 read-back은 새 checkpoint/PR 설명으로 연결한다. 대상 SHA 판정을 후속 변경에 자동 확대하지 않는다 |

주요 대상은 [matrix](step-3-stress-matrix.md), [시나리오](step-3-transition-scenarios.md), [리스크/후속](step-3-risks-and-followup.md), [source trace](step-3-source-trace.md), [검증](step-3-validation.md), [Astra 판단 원문](step-3-astra-judgment.md), [보조 조사 원본](step-3-auxiliary-research-report.md)이다. 아래 내부 줄 번호는 고정 감사 SHA 기준이며, source trace의 S3-E01~24는 integration의 경로·blob·줄에 고정돼 있다.

## 3. 사용자 요청 10항목별 판정

여기서 **적합**은 해당 문서 감사 기준 충족이며 실행 테스트 PASS가 아니다.

| 항목 | 판정 | 근거와 감사 결과 |
|---|---|---|
| 1. 11사례·7축·Capability·장르·신규 문서·Core·증거 | 적합 | matrix §2~3의 동일 C01~11이 두 7축표와 독립 matrix에 각 1회씩, 총 33행 존재. Invite/Presence를 별도 기록하고 미정/미사용 이유를 보존. 새 장르 문서는 논리 묶음이며 사례별 파일/모델 신설 명령이 아님. §4의 보류 범위도 연결됨 |
| 2. 규칙/계약/구현 증거 독립 | 적합 | matrix L18~36, L70~93. C01/C03a/C08의 제한된 계약 표현과 C02~11의 추가 검토/보류를 구분. 각 행 N, C/H/X 한계가 있어 표현 가능을 구현 완료로 승격하지 않음. 승인 STEP 2 선택표 §선택과 실행 모델 연결과 일치 |
| 3. 6시나리오·7리스크·후속/미확인 | 적합 | 시나리오 T01~06 전체와 리스크 R01~07·후속 표·§7의 미확인 보존. 아래 §5에서 성공/실패/한계가 근거와 맞는지 별도 대조 |
| 4. Astra 판단 자체의 정합성 | 적합 | 계획 §1~3/STEP 3~7, development §5/6/10B, DB 계약 도입·11시나리오·재대결/중복/동시성, STEP 1 F/R/U/IMPL, STEP 2 7축/장르/hostless 조건 및 선택 코드를 직접 읽음. 동일 본문 검증만으로 결론을 승인하지 않음 |
| 5. 의무·강도·조건·예외 보존 | 적합 | matrix L31~36, C09 L83; 리스크 R02/R03. 현행 비DB 온라인 적용 범위를 면제하지 않음. hostless 초기/재대결/미정을 구분. STEP 1 LEGACY-DEV-229~234/311과 원 규칙 §6/10B 대조 결과 동일. 아래 §4 참조 |
| 6. 불필요한 보드/Core 전제·STEP 2 회귀 | 적합 | 리스크 L26~35의 4회귀 조건은 실제 STEP 2의 하위 항목/복수·단계별 선택과 양립. room/host/snapshot/단일 tick/전역 상태를 새 Core 의무로 넣지 않음. 즉시 회귀 사유 미발견; 재검토 조건은 §6에 유지 |
| 7. 후속 API/모델/경로/백엔드/운영/지원 선결정 | 적합 | matrix L70/90, 시나리오 L12와 T05/06, 리스크 L37~49. 책임 STEP을 지정하고 식별 필드·모델 수·엔진·transport·저장 방식·파일 경로·공지 서비스를 미정으로 남김. 현행 코드 재사용도 5A 검토 입력 |
| 8. 근거 ID·SHA·경로·절/줄의 실질 뒷받침 | 적합 | S3-E01~24 blob/범위 검증과 별개로 아래 §5의 핵심 규칙/코드 주장을 원문 대조. F/IMPL 약칭 해석이 올바르고, X01~07 핵심 문단 선택 확인. 외부 참고 전체 또는 실제 제품 채택 검증으로 확대하지 않음 |
| 9. 검증/CURRENT/checkpoint/PR 최종 상태 | 적합, 명시된 예외 유지 | 대상 SHA의 CURRENT·CP-0026·PR 설명은 가이드4 완료/가이드5 대기/REVIEW_PENDING/Draft/미승인·미병합과 일치. 10파일/22파일 범위 구분 적절. 전체 strict 공백 FAIL, CI NOT_TRIGGERED, 실행 NOT_RUN을 보존. §7 참조 |
| 10. 보호 대상 보존 | 적합 | integration 대비 기존 코드·CURRENT 규칙·계획·STEP 1/2·DECISIONS·CP-0001~0017 변경 없음. 가이드4 입력 대비 판단/조사/준비 산출물·CP-0018~0023 불변. 감사 중 대상 산출물 수정 없음. 신규 감사/진행 기록만 후속 저장 |

## 4. 규칙 적용에서 특히 확인한 조건

### 비DB 모델과 현행 계약

`docs/game-platform-db-test-contract.md` L5~29는 모든 신규 online platform-native 게임을 대상으로 하며, snapshot, `expected_version`, `client_action_id`, authoritative commit/복원/재대결/private 검증을 포함한다. 같은 문서 L122~144의 실제 RPC 입력 권고 조건과 구체 SQL 비강제도 유지된다. 계획의 동등 안전성 방향만으로 이 현행 적용 범위를 이미 면제한 것으로 해석할 수 없다.

matrix의 공통 주의점과 C02~04/C06/C09/C11, R02는 이 전환을 STEP 4B/5C/6 및 7A/7B의 정식 책임으로 남긴다. 반대로 현행 SQL·정수 version·snapshot을 미래 Core의 보편 API로 새로 고정하지도 않는다. 기존 적용 의무와 미래 모델 설계 가능성을 분리한 판단은 계획 §2/§3, STEP 1 U02 및 승인 STEP 2 선택표와 양립한다. 보조 보고서의 외부 비DB 사례는 프로젝트 면제 근거로 사용되지 않았다.

### hostless 네 하위 사례

| C09 하위 사례 | 현행 원문과 대조한 판정 |
|---|---|
| a. solo | multiplayer rematch의 host 요구 비적용. 조사/네 문서/수명/검증 등 적용되는 공통 의무는 남음 |
| b. 초기만 hostless, 재대결은 기존 의무 충족 | 초기 hostless라는 사실만으로 규칙 변경 필요로 단정하지 않음. 다른 의무와 adapter 호환·구현은 별도 확인 |
| c. 재대결에서도 게임 규칙상 host 불성립 | development L614 / LEGACY-DEV-311에 따라 별도 플랫폼 규칙 변경 검토. 승인 전 예외·no-op 우회 불가 |
| d. 재대결 정책 미정 | 규칙 적합성 미확인·지원 보류. 양립 또는 변경 필수로 선결정하지 않음 |

development L418~454의 host/ready 비보편성과 8 surface 전체 구현 조건·빈 메서드/우회 금지, L582~614의 재대결 흐름·명시적 재참여·서버 검증·안전 이탈·복원 의무를 함께 읽었다. STEP 2 S2-R03 및 LEGACY-DEV-229~234/311의 원문·강도·조건과 C09가 일치한다. 초기 자동 시작에 관한 DB 계약 L138의 서버 조건 검증은 host 없는 재대결을 승인하는 조항으로 쓰이지 않았다.

## 5. 판단을 뒷받침하는 선택 원문 대조

### 내부 규칙·코드

| 대상 | 직접 대조한 원문과 확인 결과 |
|---|---|
| T01 같은 room의 새 경기 | `snapshotCoordinator.js` L8~90에서 non-negative integer 기본 version, 낮은 값 거부/동등 값 수용, 자체 load 경로 추적을 확인. Can’t Stop controller L149~220/274~314의 직접 apply와 No Thanks controller L103~170/402~465의 낮은 version 방어·재대결 apply를 대조. room-wide 단조 version 대안을 인정하고 별도 match ID를 필수화하지 않은 판단은 타당. 실제 새 경기 오염 재현을 수행했다고 하지 않음 |
| T02 다른 room의 callback | coordinator L36~90/94~137은 await 이후 dispose 재검사 없이 callback을 호출하며 stop/dispose가 이미 시작한 promise를 취소하지 않음. Can’t Stop leave 뒤 tracking 정리, No Thanks L228~265의 generation/room/disposed 보호 범위를 확인. 일부 controller 방어를 전체 안전성으로 확대하지 않음 |
| T03 관전/private | DB 계약 L15~29/108~119의 접근·private·초기화와 No Thanks tracking을 대조. 현 코드의 viewer 전환 보장은 증거 부족이며 server 제공 권한과 client 채택/캐시를 별도로 요구하는 추론은 타당. 이미 적법하게 전달된 비밀 회수 보장을 주장하지 않음 |
| T04 reconnect/event 유실 | `reconnectRefresh.js` L12~58 및 `tests/game-platform-contracts.test.js` L80~195에서 복귀 신호/refresh/listener 정리 테스트의 범위를 확인. 실제 상태 수렴·history replay 증거는 아님. DB 계약 L104~119는 현재 snapshot 복원 의미를 뒷받침하며 모든 이벤트 재생 의무를 추가하지 않음 |
| T05 rollback/result 중복 | 계획 L73~81의 예측 결과 소비 금지·Result 식별/확정/정정 경계와 DB 계약 L122~144의 동일 명령 중복 방지를 대조. retry 보장이 frame 재실행·외부 소비를 자동 보호하지 않는다는 판단은 타당. 외부 보상 방법을 GGPO의 직접 사실로 적지 않음 |
| T06 activation 중복 | development L366~416, `registry.js` L1~51 및 L93~104, `js/pages/games.js` L75~88, STEP 1 F02를 대조. Registry boolean, 사이트 카드, handoff 상태가 별개라는 근거가 있음. 이미 중복 공지가 구현돼 발생했다고 단정하지 않고 boolean 재설정의 멱등 가능성을 인정함 |
| 기존 finding/후속 | STEP 1 AS-IS L113~163의 F01~03·R01~05·U02·IMPL-001~008을 확인. F01의 과거 메모리 재현은 H로만 참조. F02의 기존 게임 문서 정정과 F03의 DB 시나리오 개수 문제를 이번 완료 사항으로 바꾸지 않음 |

위 코드 경로의 고정 SHA 링크·blob은 [source trace](step-3-source-trace.md) S3-E06~24에 있다. E18의 L1~51은 Registry 구조를 증명하며 현재 특정 게임의 activation 값은 L93~104와 E20/F02로 따로 확인했다. 넓은 근거 범위를 각 결론 전체의 단독 증명으로 취급하지 않았다.

### 외부 근거의 필요한 문단만 재확인

정식 리스크 문서 §7과 보조 보고서의 연결 주장을 대조하고 다음 부분만 공식 원문에서 확인했다. 확인일은 감사일이며, 이전 작성자의 당시 browsing 행위를 소급 증명한다는 뜻은 아니다. 이동하는 웹 문서나 GGPO master의 과거 commit까지 고정 확인한 것은 아니다.

| 기존 ID | 이번 선택 확인과 판단 한계 |
|---|---|
| X01 | [Nakama Authoritative](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/)의 gameplay modes/passive 문단: 저장 뒤 loop 종료 사례. 상시 tick 필수 가정을 반박할 참고이며 프로젝트 장기 운영 지원은 아님 |
| X02 | [Nakama Relayed](https://heroiclabs.com/docs/nakama/concepts/multiplayer/relayed/) 서두: 전달과 내용 검증·client-host의 구분. 현행 서버 검증 면제 근거 아님 |
| X03 | [GGPO Developer Guide](https://github.com/pond3r/ggpo/blob/master/doc/DeveloperGuide.md)의 Using State and Inputs 및 Separate Updating Game State from Rendering: 결정적 재실행 조건, sound/effect 지연. 보상/통계 commit 방법까지 증명하지 않음 |
| X04 | [W3C Web Audio 1.1](https://www.w3.org/TR/webaudio-1.1/) 표제와 §1.1.1 `currentTime`: Working Draft 2026-09-22와 다른 clock과의 비동기 가능성 확인. 브라우저 지연 보정 지원 판정 아님 |
| X05 | [Photon PUN 2 Cached Events](https://doc.photonengine.com/pun/current/gameplay/cached-events)의 Cached Events/Ordered Delivery: join 이전 event cache와 live 전달의 구분. 제품별 신뢰성/순서 조건을 프로젝트 보편 보장으로 쓰지 않음 |
| X06 | [Nakama Lua Match Runtime](https://heroiclabs.com/docs/nakama/server-framework/lua-runtime/function-reference/match-runtime/)의 `broadcast_message`: initial state 및 subset presences 전달. 이전 viewer의 client response/cache 폐기는 별도 |
| X07 | [Photon Realtime 5](https://doc.photonengine.com/realtime/v5/troubleshooting/analyzing-disconnects)의 Quick Rejoin: PlayerTTL 조건 및 room/player 소멸 시 실패 가능. 프로젝트 timeout 수치/운영 정책으로 채택하지 않음 |

Nakama의 별도 `llm.md` 경로 2개는 열기 오류 후 위 원 URL에서 해당 문단을 확인했다. Unity R13·Apple timeout·Unreal 판본·High Resolution Time 날짜·Unity 주기·Fusion·RTS 연구 수치 등 결론에 쓰이지 않은 범위는 재조사하지 않았다. 리스크 문서의 미확인/참고 상태를 유지한다. 외부 사례는 규칙 적합성의 최상위 근거가 아니다.

## 6. STEP 2 회귀 판단과 재검토 조건

즉시 회귀가 필요하지 않은 이유는 실제 계약/구현이 모두 준비됐기 때문이 아니라, 아직 계약이 없는 요구까지 승인 STEP 2의 **하위 항목·복수 선택·단계별 변경과 별도 규칙 상태**로 정직하게 표현할 수 있기 때문이다.

- C05의 audio/input, C07의 비물리 3D, C09의 room/host 없는 run, C11의 연결/실행보다 긴 상태는 현재 7축으로 기술된다. renderer/simulation/physics/network/audio를 하나의 주기로 축약하지 않는다.
- T01~03의 채택/오류/정리 맥락은 계획이 이미 정한 실행 수명과 모델별 채택 의미의 검토다. 모든 게임에 room/match/viewer ID를 새 필수 Core 필드로 추가할 이유는 발견하지 않았다.
- T04는 선택한 복원 의미, T05는 선택 모델/Result 소비, T06은 Publication/Site Adapter 책임에 연결된다. 하나의 전역 버스나 보상/공지 서비스를 선행 채택하지 않는다.
- 비DB 현행 의무와 hostless rematch 충돌은 명시적으로 변경 검토/미확인으로 남아 있다. 이를 숨기거나 면제해야만 matrix를 작성할 수 있는 상태가 아니다.

다음 증거가 나오면 해당 부분의 STEP 2 회귀 여부를 다시 검토한다: 모든 게임에 Room/host/DB snapshot/단일 tick/전역 currentRoom을 강제해야만 설계가 성립함, 새 필수 Core 전제가 생김, 7축의 독립 하위 항목/단계 변화로 필수 요구가 표현되지 않음, 기존 의무를 미승인 완화해야만 사례를 지원할 수 있음. 새 선택 모델 필요 또는 후속 계약 미완성만으로 STEP 2 회귀를 자동 선언하지 않는다. 현재 미결정은 정해진 STEP 4A/4B/5A~5C/6의 책임으로 남는다.

## 7. 검증·공백 예외·진행 기록 감사

| 검증/기록 | 대상 SHA에서 재확인한 결과 |
|---|---|
| 가이드4 재현 검사 | 같은 감사 세션의 Sol 재실행: 7절 동일, 사례 11/33행, 시나리오6, 리스크7, 외부표7, 근거24의 SHA/blob/줄, 링크80, 표15, 상태22, 원본 hash·변경 범위 PASS. 이는 기계적 문서 정합성 범위 |
| Governance Guard | 대상 SHA에서 PASS. Guard 통과를 미지원 모델의 안전성이나 새 문서 권위 승인으로 확대하지 않음 |
| 전체 strict 공백 | `git diff --check 177533f… 79a03bc…` **FAIL**. 조사 원본 L3~5, L222~223, L249~255 총12곳의 Markdown 줄바꿈용 끝2공백 |
| 가이드4 공백 | `git diff --check 41d78ef… 79a03bc…` PASS. 원본 보고서는 이 구간에서 수정되지 않음 |
| 원본 제외 전체 공백 | `git diff --check 177533f… 79a03bc… -- . ':(exclude)docs/game-platform-rebuild/artifacts/step-3-auxiliary-research-report.md'` PASS. 제외 범위를 특정하고 전체 FAIL을 보존한 기록은 적절 |
| 원격 CI | 대상 SHA의 workflow runs 0 / check-runs 0을 원격 재조회: **NOT_TRIGGERED**. 성공한 CI가 있다는 뜻이 아님 |
| runtime/unit/build/DB/browser/production | **NOT_RUN**. 문서 감사이며 실행 코드·계약을 변경하지 않음. 기존 테스트 코드를 읽은 것과 테스트 실행을 구분 |
| lint/typecheck | package.json 해당 script 없음. 존재하지 않는 검사를 PASS로 기록하지 않음 |

대상 SHA의 [검증](step-3-validation.md) 실행 표에 있는 `diff공백 PASS`는 앞의 가이드4 입력 범위·재현 명령 및 마지막 정정 절과 함께 읽으면 이번 변경 범위를 뜻한다. 마지막 절·CP-0026·PR 설명이 전체 FAIL과 예외를 명시하므로 전체 검사를 PASS로 바꾼 상태가 아니다. 원문 hash 보존 때문에 해당 12곳을 수정하지 않은 선택도 이번 감사/원본 보존 범위에 맞다.

CURRENT와 CP-0026의 저장 직전 SHA는 자신의 최종 commit SHA를 뜻하지 않는다. CP-0025의 중간 제출, CP-0026의 최종 정정, PR 설명의 실제 감사 SHA `79a03bc…`를 구분하면 일관된다. PR 설명의 80링크/15표 및 union10파일 수치도 대상 SHA 재현과 맞는다. 과거 CURRENT 절의 IN_PROGRESS/미착수는 해당 시점 이력이며 상단 현재 상태와 최신 checkpoint를 우선한다. 감사 이후에는 새 기록/PR 설명을 연결하고 원래 검증·판단 원본의 당시 상태를 전면 재작성하지 않는다.

## 8. Findings와 남은 일

신규 감사 finding은 없다. 따라서 새 고유 finding ID·심각도·최소 보완 요구를 만들지 않는다. 기존 STEP 1 F01 Major / F02 Major / F03 Minor와 STEP 2·3 리스크는 이번 감사 finding 수와 별도이며, 해소되었다고 표시하지 않는다.

- **완료:** 고정 SHA 범위 복원, 요청10항목 감사, 11사례/6시나리오/7리스크의 의미 대조, 핵심 내부 원문/코드 및 외부 필요한 문단 확인, 공백 예외·미실행 구분·제출 기록 감사, 본 보고서 작성.
- **미완료:** 이 보고서·필요 진행 기록의 최종 원격 제출/read-back은 저장 담당이 새 checkpoint/PR 설명에 결과를 연결한다. 사용자 결과 승인과 두 병합 승인은 없다. 후속 계약/실행 검증도 미완료다.
- **다음 첫 작업:** 같은 작업 브랜치·PR #410에서 감사 보고서와 진행 기록만 저장하고, 원격 SHA/파일·PR head를 대조한 뒤 **가이드5 제출에서 정지**한다. 가이드6 보완, 승인 처리, merge, STEP4A, production은 수행하지 않는다.

감사 대상 이후 제출 산출물·근거·규칙이 바뀌면 그 변경 diff를 먼저 확인하고 해당 항목을 재감사한다. 감사/진행 기록만 추가된 경우에도 실제 diff 확인 없이 이전 판정을 최신 head 전체에 확대하지 않는다.
