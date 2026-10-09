# Game Platform vNext STEP5B — Astra 핵심 경계 판단안

작성: 2026-10-09 UTC · 판단 담당: Astra · 상태: **사용자 판단 승인 대기 / 채팅 제출용 원문**

**권고 결론:** 종료·공식 결과·소비·공개·표현 사이의 의미와 owner는 지금 최소 계약으로 정한다. 구체 결과 형식·집계·정정 적용 방식·표현 방식은 실제 선택 모델과 consumer에 맞춰 확장한다. 공통 보상·공개 자동화·새 audio/Profile 엔진과 근거 없는 Capability 구현은 보류한다. 이것은 기능 구현 약속이나 STEP5B 완료 선언이 아니다.

## 1. 입력·상태와 판단 권위

### 1.1 실제 읽은 입력과 원격 확인

Library의 `game-platform-vnext-step5b-evidence.md`(51,284 bytes, 279줄)와 `game-platform-vnext-step5b-plan-and-handoff.md`(22,675 bytes)를 제목으로 식별한 뒤 실제 `read` 원문을 읽었다. 앞 문서는 Sol의 사실·승인 근거이며 최종 선택이 아니다. 이번 문서의 J 판단은 Astra가 수행한다.

AGENTS → 실행 계획 개정1.5 → rebuild README → CURRENT → CP0081 → PR414 순서로 원문을 복원했다. GitHub 원격 ref와 commit을 별도로 대조했다.

| 항목 | F: 이번 관찰 |
|---|---|
| 저장소 / integration | `limbit95/limbit95.github.io` / `feature/game-platform-vnext-integration` |
| 고정 판단 SHA | `3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0` |
| 실제 integration HEAD | 고정 SHA와 동일. 기준 뒤 추가 변경 없음 |
| PR414 | CLOSED, merged=true, merge SHA=고정 SHA, merged_at=`2026-10-09T07:28:44Z` |
| 실제 merge parents | `aabb7646c0cdfd6466f2195579dce54689c7b81c`, `90e89d0e4e6957c093680cfc77e054d997fcb282` |
| merge / 승인 최종 head tree | 모두 `420f3c35ee52a58b1970ba48fed1a699c928f02c` |
| 실제 main HEAD | `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`; 별도 반영 미수행 |
| 복원 상태 | STEP5A **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED** |
| STEP5B | 저장소 기록 **NOT_STARTED** 유지. 이번 채팅의 판단안 작성은 정식 상태 변경이 아님 |
| 구현·행동 | **NOT_RUN**, 기존 UNKNOWN·구현/실행 검증/오픈 의무 유지 |

CURRENT·CP0081의 OPEN/미병합은 저장 시점 이력이다. 두 문서에 명시된 복원 조건과 실제 PR/Git 증거를 적용한다. 정식 STEP 산출물의 과거 REVIEW_PENDING 헤더도 현재 승인 상태를 뒤집지 않는다. CP0074 및 과거 STEP4B의 strict C/HOLD는 CP0075/D0010이 부분 대체한 범위를 함께 읽는다. 별도 병합 후 기록 PR이나 사후 감사 단계를 선행 조건으로 추가하지 않는다.

### 1.2 증거 표기와 한계

- **F 관찰 사실:** 실제 읽은 문서·원격 Git과 Sol의 고정 source trace가 설명하는 구현 경로. 실행 보장과 구별한다.
- **A 승인 요구:** 실행 계획1.5·유효 STEP1~5A·DECISIONS의 현재 조건. 기존 코드 구현 여부와 독립적으로 보존한다.
- **J Astra 판단:** 이번 승인 요청의 책임·분류·조건. 사용자 승인 전이며 정식 repository 반영 전이다.
- **U 미확인:** 실제 배포/실행, 구체 Probe 제품 선택, 구현 기법 등. 해당 행에만 범위를 한정한다.

이 문서의 `Rxx/Nxx/Fxx/Axx/Txx/Uxx`는 별도 명시가 없으면 Sol 근거 문서의 ID다. **STEP4A T01~03**는 같은 Room 새 경기 / A→B→A / role·view·user 전환이며, Sol 근거의 테스트 T01~03와 다른 번호 공간이다.

Sol의 source inventory 대조(89기록 행 중85일치, 제어 문서4변경)와 N01~31·테스트 trace를 재사용했다. 이번에 source 전수 감사·SQL 계보 완전 확인·legacy 최종 운영 함수 확인을 수행하거나 가정하지 않았다. 특히 N14 base 함수와 N07의 실제 Liar v12 호출을 동일 정의로 취급하지 않는다. 특정 legacy RPC를 그대로 vNext 결과 본체로 선택하지 않으므로 이 미확인은 현재 경계 판단의 blocker가 아니다.

승인 원문과 Sol 요약 사이에서 이번 판단을 바꿀 새로운 의미 충돌은 확인하지 못했다. 원문으로 확인한 구별은 다음과 같다. STEP5A의 BGM **재사용 방향/내부 보완 책임은 이미 결정**됐고 H1은 무보완 사용 가능 판정만 보류한다. Registry 사이트 목록 통합 정책은 STEP5A가 선결정하지 않았으며 이번에도 기존 게임 목록 이관으로 확대하지 않는다. 정정·공개 사건 경계를 정하라는 STEP3/계획 요구는 새 서비스 구축 승인이 아니다.

## 2. 모든 분류에 적용할 승인 요구

1. **A — 최소 Core와 무이관:** 기존 Auth·게임의 public API/import·RPC/DB·규칙·UI·Registry 설정을 vNext에 맞춰 변경하지 않는다. 모든 게임에 winner/score/XP/Room/host/DOM/DB/tick을 강제하지 않는다. game-local은 공통 수명·권한을 우회하는 면제가 아니다.
2. **A — STEP4A 전체 완료:** 살아 있는 대상, 현재 적용 맥락, 허용 정보/행위, 모델 순서, 실제 반영 시점의 유효성을 success/error/null/finally/cleanup/leave/effect·후속 비동기 모두에 적용한다. 취소·unsubscribe·DOM 제거만으로 채택 무효화를 증명하지 않는다. T01~03과 현재 소비자의 명시적 재검증으로 현재 authorized 상태를 채택할 수 있다는 예외도 보존한다.
3. **A — STEP4B 권위/인가:** 예측은 확정이 아니다. CP0075/D0010의 known expiry 뒤 새 A 금지, 기한 내 적법하게 A를 지난 **동일 transaction**의 일반 저장 지연 late C 제한 수용, 실제 C 관측점, 새 transaction/retry의 fresh A 및 응답·duplicate·snapshot의 새 P, owner anchor, 최초60초·정각 중단·terminal 뒤 재개 금지를 유지한다. 결과·공개·통계 이름으로 이 예외를 확장하지 않는다.
4. **A — STEP5A 중복 방지:** Registry 두 번째 권위 metadata 목록 금지. Snapshot/Reconnect는 선택 모델 내부 하나의 최종 채택·복구 owner를 유지한다. Shell 순수 표시 부품과 game-local UI/결과 연출을 분리한다. BGM 기존 본체 재사용+내부 최소 수명 보완 및 H1~4의 제한을 보존한다.
5. **A — 게이트:** 의미·owner 판단과 API/schema/필드/클래스/파일 배치 동결은 다르다. STEP6 전 Target·물리 API를 동결하지 않는다. 설계 승인·정식 결과 승인·integration 병합·main 반영·구현·실제 시험·공개 활성화를 각각 구분한다.

## 3. 책임 단위별 3분류

분류는 다음 뜻이다. **지금 필요한 최소 계약**은 지금 합의할 의미·책임·안전 조건이며 즉시 구현 지시가 아니다. **추후 모델로 확장**은 기능의 실제 필요가 선택되면 선언된 경계 안에서 model/game-local/선택 capability를 구체화한다는 뜻이다. **구현 보류**는 현재 구현·공통화·지원 선언을 하지 않는다는 뜻이며 미래 기능을 영구 배제하지 않는다. 한 기능을 책임별로 나누었으므로 최소 의미를 지금 정하면서 그 엔진은 보류할 수 있다.

### 3.1 Result / Statistics / Meta Progression

| ID·실제 의미 / consumer·model | J 분류·권고 범위 / 계약 owner | 핵심 F/A 근거·이유 | 호환·수명 조건 | U·후속 검증 |
|---|---|---|---|---|
| J01 실행 종료, run/match 종료와 결과 유무. 모든 실행의 종료 경계, 결과가 있는 모델만 Result 사용 | **지금 필요한 최소 계약**. Core는 실행·자원 종료, 선택 runtime/model은 게임 진행의 terminal 의미, game-local은 종료 이유/도메인 판단. 화면 이탈·연결 종료·경기 종료·공식 결과 생성을 분리 | F01/N02~06: 자연 종료와 host 종료의 결과 유무가 다름. A01/03. terminal만으로 승자·패자·통계 기록을 만들 수 없음 | 결과 없음과 아직 미확정/조회 실패를 구분할 수 있어야 함. 형식/enum은 미동결. 종료가 장기 기록 삭제나 Room 종료를 강제하지 않음 | Probe별 terminal/중단/완료 의미 미선택. 실제 종료·재대결·late 완료 검증 NOT_RUN |
| J02 공식 결과의 권위·식별·확정·정정 관계. 온라인/로컬/지속 상태 모델의 결과 producer | **지금 필요한 최소 계약**. 선택 model은 결과의 적용 범위·권위·확정 기준과 정정 관계를 설명. 보호 온라인 결과는 backend 권위자가 확정하고 game-local 규칙을 적용. 동일 결과/새 결과/대체 결과 구별 | F02; R07 T05, R12 J01/02/04/05, A01/02. action identity나 snapshot version 하나는 결과 의미 전체를 대신하지 못함 | 같은 권위 범위의 충돌 결과를 last-arrival-wins로 확정하지 않음. 정정은 권한 있는 주체·대체 대상·적용 순서/유효성을 설명. 로컬 사실을 서버 인증 결과로 승격 금지 | 식별 표현·revision 형식·정정 절차·최종 저장 방식 미동결. 실제 duplicate/충돌/권한/정정 검증 의무 |
| J03 참가자 outcome와 viewer별 결과 해석. 팀/공동 승리·완료·비참가자 등 | **지금 필요한 최소 계약**. 도메인 outcome은 game-local 규칙/권위 결과, 허용된 참가자·viewer 관계는 model/backend, 표현은 game-local. 공식 팀 결과와 ‘내 결과’를 구분 | F01/07, N03/09/11. 관전자는 자동 패배자가 아니고 outcome 부재가 loss가 아님. 모든 참여자에 score/winner 강제 금지 | 현재 viewer 권한과 당시 결과의 참가 관계를 구분. role/user 전환이 과거 공식 사실을 수정하지 않음. private role을 무허가 표시 금지 | 탈퇴·중도참가·팀변경 등 선택 도메인 의미는 해당 모델/게임에서 구체화; T03·관전자 표현 실행 의무 |
| J04 공식 결과 → 통계/개인기록/보상 소비의 공통 의미 | **지금 필요한 최소 계약**. producer 확정과 consumer의 수용/중복 방지/정정 반영을 분리. 소비 owner는 자신의 대상·효과·재시도와 반영 사실을 소유; 영속 변경은 backend 권위 경계에서 집행 | F02/03; R07 T05, R12 J04/05. SQL finalize guard나 UI key는 서로의 중복 보장을 대신하지 못함 | 동일 결과의 재전달로 새 보상/집계를 늘리지 않음. 정정 소비가 기존 기여분을 남긴 채 새 경기처럼 더하지 않음. commit 미상과 미실행을 구별. 현재 P/기록 접근 정책 유지 | 원자성/ledger/outbox 등 구현 방식 미선택. 별도 소비 효과의 commit·retry·부분 실패·역순 정정 검증 필요 |
| J05 게임별 score/rank/MVP, per-game 통계·개인 기록의 계산·조회 | **추후 모델로 확장**. game-local이 계산 의미, 선택 persistence/result 모델이 정정 가능한 기여·저장/복구 의미, consumer가 조회·표시를 소유. 공통 통계 엔진을 지금 만들지 않음 | F03/N15~22. 서로 다른 MVP/힌트/승률은 동일 이름의 반복이지 같은 알고리즘·계약 반복이 아님 | 현재 게임 계산/API 불변. 기록 조회는 현재 경기 UI와 별도 수명일 수 있으나 현재 사용자/권한/요청 대상을 검증. 기존 기록열람·삭제/탈퇴/복원 의무 유지 | 선택 지표·집계창·정정/삭제 반영·접근·보존 구현은 미선택/NOT_RUN |
| J06 결과 없음/로컬 완료/장기 진행/비동기 기록의 구체 결과 모델 | **추후 모델로 확장**. 실제 Probe 선택에 맞는 가장 작은 model/game-local 표현. 결과 없는 실행에도 Core 진입/종료만 자연스럽게 적용 | R04 축⑦, R06, A01/10. 두 Probe의 제품 결과는 아직 미선택. roomless 기록형이라도 자동 leaderboard/보상이 아님 | 가짜 Room·host·winner·RPC·server result를 만들지 않음. 로컬 저장이 필요하면 해당 내구성 한계를 명시; 온라인 보호 기록이면 backend 의무 적용 | Probe가 기록형을 선택할 경우 무엇을 언제 보존/정정할지만 해당 설계에서 닫음. 이 미선택은 전체 STEP5B blocker 아님 |
| J07 플랫폼 Meta Progression/XP/영구 reward 및 범용 통계·보상 서비스 | **구현 보류**. 현재 새 엔진·공통 wallet·XP/랭킹 정책·자동 보상 발급 없음. 필요 발생 시 J02/04를 충족하는 선택 capability/backend 검토 | F04/N16~22; A01/10. 게임 내 hint currency, 과거 통계, 플랫폼 progression은 다른 의미. 실제 Probe 요구/반복 증거 없음 | 기존 게임 화폐·통계 경로 무이관. 도입 시 정정 가능한 범위와 회수 불가 효과의 처리 정책을 먼저 명시; UI 축하가 보상 명령이 되어서는 안 됨 | 요구와 정책 미선택. 보상 취소/상계/불가시 실패 정책을 정하지 않은 소비자는 활성화 보류. 모든 결과 설계까지 보류하지 않음 |

### 3.2 Publication / Site Integration

| ID·실제 의미 / consumer·model | J 분류·권고 범위 / 계약 owner | 핵심 F/A 근거·이유 | 호환·수명 조건 | U·후속 검증 |
|---|---|---|---|---|
| J08 merge·구현·검증·activation·공개 사실의 구분 | **지금 필요한 최소 계약**. 기존 사이트 release/운영 승인 책임이 공개 사실을 소유. Site Adapter는 그 허용된 사실을 연결; Core/runtime가 출시를 판정하지 않음 | F05/N27, R07 T06, A05. 파일·flag·카드 존재가 공개 승인/실행 완료가 아님 | 실제 공개 조치의 완료/실패/미상과 문서 handoff를 구분. 승인 범위 없는 activation 금지. 기존 release 정책 재결정 없음 | 현재 production 상태 재검증 안 함. 실행 시 실제 활성화 증거와 기록 정합성 필요 |
| J09 필요할 때 식별 가능한 공개 사건과 같은 사건 재처리·정정 | **지금 필요한 최소 계약**. release 사실 owner가 같은 공개 사건/새 공개 사건/정정·철회를 구분할 근거를 제공. Site Adapter는 의미 보존 연결 | R07 T06, F05/06. retry·복구·재활성화·새 출시를 한 boolean 전이로 판정할 수 없음 | 재활성화 자체는 자동 새 출시가 아님. 이미 식별된 사건의 재처리는 같은 사건. 새 공개 의미의 판단은 기존 승인 범위의 release owner. 사건 식별은 metadata 복제도 새 event service 의무도 아님 | 사건 기록 형식/운영 연결 미동결. 선택 시 재처리·복구·정정·권한·부분 실패 검증 |
| J10 Registry metadata → 사이트 목록/route/지원 표시 투영 | **지금 필요한 최소 계약**. 기존 metadata의 권위 출처를 참조하고 Site Adapter/사이트 consumer가 공개 eligibility·표시를 연결. 실행 구성과 게시 상태를 구분 | F06/N25/26, R17 §4.1. 현 별도 배열은 관찰 사실이고 두 번째 vNext metadata 목록의 근거가 아님 | 동일 game identity/route 일치; 사이트 표시가 서버 인가나 지원 인증이 아님. 게시 정책/사건 기록은 metadata의 복제본이 아님. 기존 게임 목록 일괄 교체 금지 | 정확한 연결/API/경로는 후속. 신규 consumer의 목록/등록/entry 일치와 기존 경로 회귀 의무 |
| J11 NEW 배지·공지·재공개/철회 시 구체 표시·소비 정책 | **추후 모델로 확장**. 필요 선택 시 Site Adapter + 해당 사이트 표시/공지 consumer가 대상·채널·노출·재처리·정정 정책 소유 | F06/U06, A05. 읽은 연결에 dispatcher 없음은 사이트 전체 공지 부재 증명이 아님. 현재 Probe에 공지 필수 근거 없음 | 목록 재렌더는 공지 발송과 다름. 같은 사건 재수신으로 NEW 기간/공지 발송을 자동 갱신하지 않음. 의도적 재공지라면 별도 승인된 소비 의미를 명시 | 배지 기간·공지 대상·전달 확인·정정 표시가 미선택. 실제 사용 전 필요한 그 항목만 닫음 |
| J12 release event bus·자동 activation/공지 dispatcher·새 publication 서비스 | **구현 보류**. 기존 release 흐름과 사이트 기능 우선; 반복/요구 없이 자동화 본체 추가 없음 | 계획 §2/STEP5B, R07 T06, A05/06. 경계 필요가 서비스 필요를 증명하지 않음 | 자동화가 생겨도 release 승인·실제 완료 증거와 consumer dedup을 대체하지 않음. SQL Realtime publication과 사이트 공개 사건은 별개 | 향후 선택되면 delivery·부분 실패·중복·권한·복구 검증. 지금 구현·외부 조사는 없음 |

### 3.3 Presentation / Sound / Profile / Capability

| ID·실제 의미 / consumer·model | J 분류·권고 범위 / 계약 owner | 핵심 F/A 근거·이유 | 호환·수명 조건 | U·후속 검증 |
|---|---|---|---|---|
| J13 채택된 상태/결과 → viewer 표현·effect/SFX 요청 | **지금 필요한 최소 계약**. 선택 model은 확정/잠정·현재 authorized 입력과 소비 identity 의미, game-local presentation은 viewer별 표현·효과 허용/재생 정책, 해당 effect owner는 실행/정리 책임 | F07/08/N09~12/20~23/31, R12 J05. 렌더·focus·animation·Sound는 결과 producer가 아님 | 동일 snapshot 재적용/rollback 횟수는 축하·SFX 재발행 근거 아님. 잠정 표현은 명시적 별도 의미, 확정 결과로 위장 금지. 모든 완료 경로/T01~03 적용 | 늦은 RPC·timer·observer·RAF·finally·정정 후 표현 검증 NOT_RUN |
| J14 보드/Canvas/DOM 결과 화면·staging·animation·곡/mode/SFX 의미 | **추후 모델로 확장**. game-local 디자인/연출 유지, 시간/예측/rollback 특성이 실제 필요하면 선택 presentation/sound 모델을 구체화 | F07~09, R17 §4.7~4.8. 게임별 DOM·점수/승리 표현은 범용 화면 반복 근거가 아님 | Shell pure 표시 재사용과 게임 결과 연출 구별. 일반 렌더 반복은 가능; 한 번 효과 반복은 별도 허용 필요. DOM·audio 필수화 금지 | 선택한 장치/모바일/접근성·재생 정책·시간 좌표는 해당 구현/디자인 단계 검증 |
| J15 기존 BGM 본체 + 내부 최소 수명 보완, site/game 연결 | **지금 필요한 최소 계약**. STEP5A 승인 그대로 사이트 BGM controller owner가 최신 재생 의도·종료·작업 귀속·자기 Audio 정리 보완; Adapter는 연결, game-local은 곡/mode | F09/N28/29, R17 §4.8, R19 H1. wrapper 차단만으로 내부 await 후 쓰기/Audio side effect 보호 불가 | 기존 catalog/preferences/player/API·정상 동작 보존. 공유 자원은 실제 공용 owner가 소유, 게임은 자기 사용권만 반납. singleton/lease/refcount 기법 미동결 | H1 무보완 직결 사용 가능 판정은 계속 보류. success/reject/finally·pause/play/track/destroy/reentrant·실제 browser와 기존 소비자 회귀 필요 |
| J16 범용 새 audio engine·공통 결과 연출 엔진·audio 기준 정밀 게임 모델 | **구현 보류**. 새 audio/효과 본체 선제 제작 없음. 정밀 audio 시간/게임 판정 모델은 실제 해당 게임 요구가 있을 때 선택 모델로 검토 | 계획 §2, A07~10, N30. game-local 합성음 존재만으로 공통 엔진 반복 입증 불가 | Adapter에 queue/retry/clock/권한·수명 엔진을 숨기지 않음. 기존 BGM 필수 최소 보완과 이 보류를 혼동하지 않음 | 리듬/정밀 동기 요구·반복 없음. 해당 모델 요구 선택 시 경계 재검토 |
| J17 선택 Capability의 존재/미선택/호환/owner 규약 | **지금 필요한 최소 계약**. capability는 실제 의미가 필요한 consumer만 연결하고 적용 model·권위·수명·결과/공개/표현 소비 범위를 선언 | R04, A03/10, R17~19. ‘선택적’은 공통 안전·적용 제품 의무 면제가 아님 | 미선택은 자연스럽게 동작. capability 선언을 지원 PASS나 권한으로 해석 금지. 기존 본체 재사용 우선. Invite H2/3 내부 완료 보호와 H4 미래 비room 미선택 유지 | 개별 capability의 API·실제 지원은 허용 단계에서 검증. 미선택 미래 기능은 전체 blocker 아님 |
| J18 Result/Statistics/Presentation/Sound 등 새 공통 Capability 본체 승격 | **추후 모델로 확장**. 실제 consumer 필요와 의미·수명·호환 반복이 확인되면 game-local/모델 경계에서 승격 검토. 현재는 최소 계약만 공유 | F10, R04~06, 계획 §2. 소비자 수·함수명·비슷한 DOM/SQL guard만으로 동일 본체 증명 불가 | 기존 본체가 같은 책임이면 재사용; 차이가 정책인지 다른 모델인지 먼저 판정. Core 편입은 별도 필수성/안정성/낮은 결합 근거 필요 | Probe 구현 전 선제 capability 파일/엔진 없음. 반복 증거와 안전성 검증이 부족한 부분만 미지원 표시 |
| J19 검증된 조합을 묶는 Profile recipe 및 Profile 엔진 | **구현 보류**. 현재 구체 Profile을 만들거나 필수화하지 않는다. 검증된 조합이 반복되면 recipe 문서로만 검토; Profile 엔진/상속 계층은 채택 안 함 | 계획 §2 Profile, F10/U10. 두 Probe는 의도적으로 다른 실행 제약이며 검증된 동일 조합 반복이 없음 | 모델+기능 선택 근거는 Profile 없이 기록 가능. recipe는 owner/권한/수명/규칙을 대신하지 않음. 반복되기 전 필수 Profile 금지 | 실제 반복 전 조합 이름·기본값·금지 조합 고정 안 함. 반복 후 검토도 현재 지원 인증 아님 |

## 4. 결과·정정·중복의 구체적인 최소 의미

### 4.1 종료에서 소비까지

**J — 경기는 끝났지만 공식 결과가 없을 수 있고, 공식 결과가 있어도 모든 viewer에게 개인 승패가 있지는 않다.** 결과를 갖는 모델은 해당 run/match/round 등 도메인 범위에서 누가 공식 판단자인지, 무엇이 확정 근거인지, 정정이 기존 무엇을 대체하는지 설명해야 한다. 이 의미를 설명할 수 있는 가장 작은 계약이면 충분하며 공통 `Result` 클래스나 모든 게임 공통 필드 묶음을 요구하지 않는다.

온라인 보호 결과는 client DOM·sound·예측 frame·UI acknowledgement가 확정자가 될 수 없다. 기존 DB 모델의 실제 commit과 다른 선택 모델의 권위 확정 경계는 각 모델의 승인 계약을 따른다. 로컬 전용 결과는 로컬 권위 범위에서 유효할 수 있지만, 서버 검증 기록/공용 보상에 제출하려면 별도의 신뢰·검증 경계를 충족해야 한다. 장기 결과의 존속 수명은 현재 화면/실행 수명보다 길 수 있다. UI를 dispose했다는 이유로 적법한 authoritative commit이나 기록이 취소되지는 않는다.

**J — 정정은 권위자가 같은 결과의 유효 내용을 바꾸는 관계다.** 새 run의 새 결과와 구분한다. 소비자는 자신이 어떤 공식 결과의 어떤 유효 상태를 반영했는지 구분하여 동일 소비의 재시도, 더 이상 유효하지 않은 내용, 순서가 뒤바뀐 정정을 처리해야 한다. 숫자 revision·UUID·event sourcing·전역 sequence를 지금 강제하지 않는다. 상충하는 내용을 동일 결과로 받았는데 모델이 선후/대체 관계를 설명하지 못하면 임의 최신 도착값으로 확정 집계하지 말고 해당 소비를 보류하고 현재 권위 상태를 확인한다.

결과 UI는 정정 후 현재 허용된 표현을 갱신할 수 있다. 이미 재생한 축하/효과를 정정마다 다시 재생할지는 별도 표현 정책이다. 정정이 생겼다는 사실만으로 같은 효과를 다시 발생시키지 않는다. 되돌릴 수 없는 SFX를 ‘rollback으로 취소했다’고 표시하지 않는다.

통계 소비가 필요하면 **대체 전 기여와 대체 후 기여의 관계**를 설명해야 한다. 재계산·대체·차이 적용 중 어떤 방식인지는 후속 구현 선택이다. 보상을 선택하면 회수·상계·취소 불가 효과의 별도 처리 또는 명시적 지원 제한이 필요하다. 아직 정하지 않은 보상 consumer를 활성화하지 않는 것이며 결과 경계 전체를 HOLD하는 것이 아니다. 재처리 여부 불명·commit 미상은 새 identity로 무조건 재발행하지 않는다. 네트워크 exactly-once나 영구 무손실 전달을 약속하지 않고, 선택한 효과의 중복 방지·복구 의미를 해당 owner가 증명한다.

### 4.2 서로 다른 중복 범위

| 중복 종류 | 같은 것의 의미 / owner | 안전 기준과 구별 |
|---|---|---|
| action retry | 명령 주체·대상·종류/payload와 연결된 동일 명령 / model+backend | mutation 중복 금지. timeout은 commit 미상 가능. 새 retry/transaction은 fresh A, 응답은 새 P. 이것만으로 결과 집계/효과 중복 방지 완료 아님 |
| simulation replay/rollback | 같은 논리 입력·상태를 다시 계산 / simulation model+game-local | 결정성·확정/잠정 구분. 재계산 횟수만큼 영구 결과·보상·SFX 발생 금지. 예측 UI가 필요하면 별도 잠정 정책 |
| current snapshot 재적용 | 현재 authorized 상태를 재구성 / 단일 최종 채택·복구 model | 같은 version도 상태 복구상 허용 가능. event 발생이나 결과/효과의 새 발행 증거는 아님 |
| UI effect/SFX | 현재 viewer·실행 맥락에서 해당 의미의 한 번 효과 / presentation/effect owner | 재렌더·재조회·mount 반복과 구별. 표시 복원은 가능해도 축하 재생은 별도 근거 필요. 사용자 명시 replay는 그 표현 소비에만 적용 |
| 통계/기록/보상 소비 | 결과의 유효 내용이 특정 consumer·대상에 주는 기여/효과 / 해당 consumer+backend | retry로 기여 증가 금지, 정정은 기존 반영과 일관. 다른 consumer는 독립 책임. UI key/sessionStorage로 영속 중복 보장 금지 |
| publication 소비 | 식별된 공개 사실에 대한 목록/NEW/공지 등 특정 소비 / release owner+site consumer | activation 재시도·복구와 새 공개를 구분. 같은 사건 재처리로 새 발송/NEW 기간 자동 시작 금지. 결과 identity와 다른 의미 |

위 표는 여섯 개 공통 dedupe 엔진을 만들라는 뜻이 아니다. 책임 의미가 다르므로 하나의 `lastVersion`/`done` flag/전역 bus가 모두 해결한다는 전제를 금지한다. 각 consumer가 필요한 범위에서 기존 구현을 재사용하거나 최소 구현을 선택한다.

## 5. 공개·사이트·표현의 연결 조건

### 5.1 Publication의 최소 경계

**J — 공개 사실의 권위는 기존 승인된 release/운영 흐름에 둔다.** Core Registry에 공개 승인자를 만들거나 runtime terminal을 출시 완료로 연결하지 않는다. merge 완료, 기능 구현 완료, 시험 결과, activation 요청/실제 완료, 공개 사실 기록, 사이트 표시/공지 소비는 각각 관찰 가능한 별도 사실이다. 하나의 상태값/API로 표현할 수 있더라도 서로의 증거를 대체해서는 안 된다.

식별 가능한 공개 사건은 NEW/공지 등 그 구분을 필요로 하는 consumer가 선택될 때 사용한다. 이때 기존 release 기록을 식별 근거로 사용할 수 있는지 먼저 확인한다. 영속 event bus·자동 dispatcher를 필수화하지 않는다. 기록되는 공개 사실은 game identity·공개 대상의 의미와 기존 승인/실제 활성화 근거를 추적할 수 있어야 하지만 구체 데이터 필드는 STEP6 전에 고정하지 않는다.

단순 복구로 동일 공개 상태가 돌아왔다면 그 사실만으로 신규 출시를 발행하지 않는다. 새 공개 범위/출시로 취급하려면 release owner의 기존 정책·승인 근거가 필요하다. 잘못된 공개 사실은 조용히 새 사건으로 덮어 공지/NEW를 중복시키지 말고 정정·철회 관계를 설명한다. 상세 재공지 정책은 J11의 실제 소비 선택 때만 정한다. 이 판단은 기존 게임의 release 문서 정정이나 production 활성화 재검증을 이번 선행 작업으로 만들지 않는다.

### 5.2 공통 표시와 게임 표현

**J — model이 채택한 상태가 실제 consumer에 도착한 뒤에도 consumer의 수명·viewer 유효성은 남는다.** 모델이 상태를 한 번 검증했다는 이유로 나중 timer/RPC/animation/finally가 새 화면을 변경해도 되는 것은 아니다. UI/cache/error/effect의 실제 쓰기 직전에 현재 반영 권리를 지킨다. 일반 렌더 복원과 일회 효과 재생을 분리하고, history 화면에서 이전 결과를 읽는 것은 현재 history owner·현재 권한·명시한 조회 대상에 대한 새 소비로 다룬다. 지난 경기 결과를 무조건 전역 폐기하거나 현재 경기 gameplay로 채택하지 않는다.

Shell의 banner/roster 등 순수 표시 부품은 맞는 경우 재사용한다. 결과 화면·승리 문구·색·animation·SFX·곡/mode는 승인된 game-local 디자인의 책임이다. 관전자에게 허용된 공통 결과 표시와 참가자 전용 개인 효과가 달라도 공식 결과를 두 번 만드는 것이 아니다. role 전환 후 private outcome/role을 과거 cache에서 복원하려면 현재 권한 근거가 필요하다.

기존 BGM의 최소 내부 보완은 J15와 STEP5A대로 유지한다. 최신 pause/play/track 의도, 종료 상태, 자기 작업의 success/catch/finally, 자기 Audio만 정리하는 조건을 **실제 본체 owner**가 만족해야 한다. 결과 효과 consumer의 중복 방지는 controller의 최신 재생 의도 보호와 다른 책임이다. 어느 한쪽을 구현했다고 다른 쪽의 검증을 대체하지 않는다.

## 6. 실제 Probe 적용과 중복·확장 기준

### 6.1 두 Probe에서 지금 필요한 것

| 적용 범위 | J 지금 요구할 최소 의미 | 지금 필수화하지 않는 것 / 후속 조건 |
|---|---|---|
| Probe1 작은 2D 협동 수직 Slice | 기존 승인 범위의 실행·권위·동기화/복구·다중 client·이탈·정리, 선택한 표현의 현재성/잠정·확정 구분. run 완료/공식 결과를 제품상 선택하면 J01~04/13 적용 | 승자/점수/영구 통계/XP/출시 공지/새 Sound capability를 협동이라는 이유만으로 요구하지 않음. 실제 결과가 필요한지는 해당 네 문서에서 선택 |
| Probe2 room/host 없는 local 또는 비동기·기록형 | Room 없이 등록·진입·종료·자원 소유. 결과 없음이면 Result 미선택을 자연스럽게 처리; 기록형을 선택하면 해당 기록의 권위/보존/재진입 의미를 설명 | 가짜 Room·host·ready·winner·서버 RPC·reward 금지. 단일 run 기록과 집계 통계/leaderboard는 별도 선택. 보호 온라인 저장이면 기존 backend 안전 의무 적용 |
| 두 Probe 공통 | 실제 consumer·model·기능 사용/미사용/미결정과 근거 기록. 동일 Core 공통 수명을 적용 | Profile 선행 생성·같은 결과 schema·공통 UI/audio 엔진으로 차이를 지우지 않음 |

이는 Probe 게임 규칙·제품 spec·장르 설계를 지금 결정한 표가 아니다. **필요 없는 선택 기능을 구현하지 않아도 현재 경계 판단은 진행할 수 있다.** 요구가 실제 선택되면 그 consumer에 필요한 최소 모델을 구현하는 원래 순서를 따른다. 새로운 권위·수명·Core 의미가 필요해 기존 계약으로 표현되지 않으면 해당 설계 STEP으로 돌아간다.

### 6.2 공통화와 확장 판단 기준

1. **기존 본체 우선:** 같은 의미·consumer 전제·API·수명 조건의 기존 본체가 있으면 재사용한다. 얇은 연결은 identity/데이터 투영·명시된 호출/구독·owner 귀속을 연결하는 범위다. Adapter 안에서 새로운 권위·순서·수명·token·audio 엔진을 운영하지 않는다.
2. **반복의 단위:** 같은 함수명/비슷한 화면/여러 SQL guard가 아니라, 같은 책임·입력 의미·권위·확정/정정·실패/복구·수명·호환 조건이 반복되는지를 본다. 게임별 score/MVP 알고리즘과 곡/mode 설정은 반복되는 공통 본체와 구별한다.
3. **선택 모델/Capability 승격:** 실제 consumer가 필요하고 반복되는 공통 의미가 확인되면 game-local에서 재사용 가능한 model/capability로 옮기는 안을 검토한다. 현재 승격 약속·임의 게임 수 기준·일괄 추상화는 없다. 기존 공통 본체 재사용은 새로운 반복을 기다리며 복제할 이유가 되지 않는다.
4. **Core의 별도 문턱:** 여러 게임이 쓴다는 사실만으로 Core에 넣지 않는다. 장르와 선택 기능을 넘어 필수이며 안정적·낮은 결합인지 입증해야 한다. Result schema/통계/공개 정책/audio는 현재 그 근거가 없다.
5. **Profile:** 검증된 조합의 반복 뒤 기본값·필요조건·금지 조합·검증 항목을 설명하는 recipe다. 코드 승격 단계·runtime owner·상속 엔진이 아니다. 반복 전에는 선택표로 충분하다.
6. **호환 실패 처리:** 공통 보완이 기존 API/정상 동작과 양립하지 않으면 기존 게임을 고치는 대신 해당 vNext 연결을 보류하고 격리/버전 경계를 재검토한다. 전체 vNext를 근거 없이 HOLD하지 않는다.

## 7. 소프트웨어 owner와 후속 작업 담당

| 소프트웨어 owner | J 책임 | 책임 밖 / 금지 | 구현·실행 증거의 주체 |
|---|---|---|---|
| Core | 최소 식별/발견·구성·실행 수명·공통 오류/정리. 미선택 기능을 강제하지 않는 연결 | 공식 결과 판정·Result 필수 schema·Room/host/DOM·통계/출시/오디오 의미 | 허용된 Core 구현 담당이 부분 초기화·dispose/재진입·현재 owner 보호 증거 제출 |
| runtime/model | 선택 권위·순서·현재성·확정/잠정·결과 범위/정정 관계·복구/terminal. Snapshot/Reconnect 단일 최종 채택·복구 | 별도 Result coordinator가 같은 상태의 두 번째 최종 채택자가 되는 것, 사이트 공개 승인/게임 규칙 소유 | model 구현 담당이 T01~03 전 경로·동기화/복구·예측/정정 oracle 제출 |
| capability | 실제 선택 기능의 본체·적용 조건·소비 계약·자기 자원/작업 수명. 공통 Result 소비가 승격되면 이 범위만 | feature 존재를 지원 인증으로 해석, 독자 인증·새 권위·제품 의무 면제 | 기능 구현 담당이 미선택/부적합 조합·retry/정정·자기 owner 정리 증거 제출 |
| Site Adapter + 사이트 utility/release owner | 기존 Auth/identity·metadata/route·공개 사실/사이트 consumer·Invite/BGM 연결. 사이트 공용 자원의 실제 owner 연결 | 새 metadata catalog·권한/순서/수명/token/audio 엔진 은닉, 표시를 인가로 대체 | 사이트 연결/본체 담당이 기존 API/entry/목록·H1~3·공개 소비 호환 증거 제출 |
| game-local | 규칙·결과/outcome 계산·게임 전용 서버 규칙·콘텐츠·UI/Visual Identity·표현/SFX/곡/mode·얇은 설정 | 공통 본체 복제·private 숨김으로 권한 대체·확정 소비를 예측으로 실행 | 게임/표현 구현 담당이 도메인 결과·viewer 표현·effect 수명·디자인 회귀 증거 제출 |
| backend / 해당 권위 저장 owner | 보호 결과 확정·정정 권한·직렬화/내구성·인가 A/C/P·영속 소비 중복/owner fencing·현재 정보 제공 | client Gate/DOM/ACK로 commit 증명, late C를 새 P/후속 소비의 자동 허가로 전파 | backend 구현 담당이 실제 transaction·lock·commit 미상/retry·정정·private/삭제/복원 증거 제출 |

소프트웨어 owner는 파일명·클래스·담당 모델명이 아니다. 작업 모델 **Astra**는 이번 핵심 판단 및 후속에 발견된 새 의미 충돌의 해당 항목만 맡는다. **Sol/Codex**는 사용자 승인 범위의 문서 정식 반영·source trace·기계적 정합성 검증을 맡고 판단을 다시 수행하지 않는다. 실제 구현·시험 담당과 환경은 원래 허용 단계에서 정한다. 여기서 owner를 배정했다는 사실은 구현·배포·시험 수행자를 확보했다는 뜻이 아니다.

## 8. 설계 blocker와 남는 의무

### 8.1 현재 결론

**J — 이번 최소 경계 선택을 막는 추가 필수 설계 공백은 확인하지 못했다.** 결과 정정의 의미, consumer 중복 책임, 공개 사실/소비 분리, 표현·Sound 수명, Profile 유보를 지금 판단할 수 있다. 실제 실행 증거가 없는 이유로 모든 설계를 보류할 필요는 없다. 이 말은 구현 가능성·지원 완료·운영 조건 충족 인증이 아니다.

| 종류 | 현재 처리 / 해당되는 범위 |
|---|---|
| 사용자 판단 승인 | §3~7의 핵심 선택 승인 대기. 정식 반영은 승인+명시적 반영 허용이 모두 필요 |
| 구체화가 남은 설계 | Probe 제품 결과/통계/표현 필요, 결과 식별·정정/소비 형식, 실제 게시 연결·NEW/공지 정책, BGM 내부 수명 기법. 해당 기능을 실제 선택할 때 필요한 부분만 원래 STEP에서 구체화 |
| 구현을 막는 조건부 문제 | 선택된 consumer가 결과 권위/정정/중복/접근 의미를 설명하지 못함; 보상 정정 불가를 숨김; 공통 보완이 기존 소비자와 비호환; Adapter가 새 엔진을 숨김. 그 consumer/연결을 보류하고 해당 설계로 회귀 |
| 미래 미선택 | 공통 XP/reward, 자동 publication, 정밀 audio 모델, 새 Profile, H4 비room Invite. 현재 전체 STEP5B blocker 아님 |
| legacy 미확인 | Liar v12/후속 SQL 최종 운영 정의 등. 직접 재사용 판정을 하지 않았으므로 전수 SQL 확인을 현재 전제로 삼지 않음. 실제 직접 재사용을 선택하면 해당 정의·caller만 좁게 확인 |
| 실행/오픈 의무 | 아래 전부 NOT_RUN/UNKNOWN 유지. 문서 판단이나 테스트 파일 존재로 닫지 않음 |

### 8.2 후속 검증 의무 — 이번에는 전부 NOT_RUN

- **결과·소비:** 정상 완료/중단/결과 없음·팀/동률·관전자, 예측→rollback→확정, commit 미상 후 동일 명령 retry, 같은 결과 소비 retry, 정정의 중복·역순·충돌·부분 실패, 정정 전 기여 보존 오류 방지. 필요한 영속 효과의 권위·내구성·재처리 증거.
- **전체 완료와 viewer:** STEP4A T01 같은 Room 새 match, T02 A→B→A, T03 role/view/user 전환을 success/error/null/finally/cleanup/leave/effect·timer/observer/RPC/후속 비동기에 적용. 과거 진단과 현재 UI 오류 구분; history 조회의 별도 owner·현재 권한; 현재 private 사용 차단과 옛 cache 자동 복원 금지.
- **인가·저장:** CP0075/D0010 현재 A/C/P·known expiry·owner anchor·최초60초/terminal oracle. 권위 결과 commit 후에도 새로운 consumer 보호 행위/응답은 자기 현재 인가 필요. STEP4B 기록 열람·30일 삭제·탈퇴 unlink·복원 정책 보존.
- **Publication:** 실제 release 승인/activation 증거, 같은 사건의 재처리/복구/정정·의도된 새 사건 구별, 선택한 목록/NEW/공지의 중복/부분 실패·현재 owner·접근·정정 표시. 기존 production 현재 완료를 이번에 선언하지 않음.
- **Presentation/BGM:** 정정/재조회/재접속을 효과 재발행 근거로 오인하지 않음. controller 내부 latest intent·success/reject/finally·pause/play/track/destroy·재진입·공유 Audio owner 및 기존 API/게임 회귀. 실제 browser 음향·autoplay/모바일은 source/fake Audio로 대체하지 않음. H1~3 그대로 유지.
- **기존 의무:** 실제 두 client·성능/복구·모바일·운영 비용/삭제/백업/복원과 기존 게임 공존을 승인된 owner/게이트에서 검증. 100명/판8·p95 250ms·각 재연결5초·세금 포함 월 추가3만원·외부 백업/RPO24h/발견 후24h/7일 복구점·Free서울/기존 운영 조건 및 UNKNOWN을 이번에 재결정하거나 닫지 않음.

## 9. 사용자 승인할 핵심 선택과 정식 반영 범위

### 9.1 승인 요청 대상

1. **J01~07:** 종료/결과/outcome/viewer와 producer/consumer 분리, 권위 결과의 식별·확정·정정·중복 의미는 지금 최소 계약. 계산/저장·집계 모델은 실제 필요에 따라 확장하고 공통 XP/보상 엔진은 보류.
2. **J08~12:** merge/구현/activation/공개 사실/표시·공지 분리, 필요 시 같은 공개 사건·정정 관계를 식별. Registry metadata 중복 없이 사이트 연결. NEW/공지 제품 정책은 실제 선택 때 구체화하고 자동화 서비스는 보류.
3. **J13~16:** model의 채택과 viewer/effect 소비 분리, game-local 디자인/SFX/곡/mode 유지. 기존 BGM 본체+내부 최소 수명 보완/H1 유지. 새 보편 결과 화면/audio 엔진은 보류.
4. **J17~19 및 §6:** 최소 Capability 선택 규약만 지금 정하고, 실제 필요·반복 증거로 model/capability 승격. Profile은 반복된 검증 조합의 recipe이며 현재 생성·필수화/엔진은 보류.
5. **§7~8:** 책임·호환·수명 조건과 범위 한정 보류, NOT_RUN/UNKNOWN·구현/실행/오픈 의무, API/Target 미동결 및 기존 승인 불변을 보존.

기존 D0010/STEP5A 결정을 다시 승인받는 요청이 아니다. 이번 판단 승인은 저장소 반영 허용과 별개이며 사용자가 두 가지를 함께 명시하면 그 범위로 다음 작업을 진행한다. 정식 반영/PR 제출 허용은 STEP5B 정식 결과 승인·완료·integration 병합·main·구현·STEP5C 허용이 아니다.

### 9.2 승인 후 Sol/Codex가 반영할 내용

| 정식 반영 단위 | 보존할 원문 / 검증 |
|---|---|
| 책임별 3분류·최소 계약 | §2~5, J01~19 전체. 분류와 이유·조건·미확인을 축약하여 구현 약속으로 바꾸지 않음 |
| 중복/확장·Probe 적용 | §4.2/6 전체. 여섯 중복 의미, Profile recipe, 반복/필요 기준, Probe 미선택의 조건을 보존 |
| owner·호환·수명·후속 | §7~8 전체. 소프트웨어 owner와 작업 모델 구분, 제한적 보류·조건부 회귀·NOT_RUN/UNKNOWN 보존 |
| 입력/trace·원본 | 이번 판단 원문과 Sol 근거·계획을 원본으로 보존하고 §1/10의 고정 SHA/blob/출처 연결. 기존 source를 다시 전수 감사하지 않음 |
| 진행 기록·제출 검증 | 정식 결과는 **REVIEW_PENDING**, 사용자 최종 검토·별도 병합/main 게이트 유지. 허용 diff·본문 의미/표/링크·상태·고정 입력·기존 자산 불변 확인. 별도 사후 감사 단계 추가 안 함 |

정식 파일 수/이름은 기존 rebuild 관례와 중복 최소 원칙으로 정한다. 실행 API/schema/코드 배치와 혼동하지 않는다. 새로운 의미 충돌이 발견되면 충돌 원문·영향 행·필요 선택만 Astra/사용자에게 돌리고, Sol이 전체 판단을 다시 수행하거나 과거 승인 정책을 재결정하지 않는다.

## 10. 직접 읽기와 재사용 trace

모든 저장소 원문은 고정 SHA `3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0` 기준이다. 링크의 파일 전체를 새 source 감사했다는 뜻은 아니며 아래 범위만 직접 판단에 사용했다. Sol N01~31/테스트는 근거 문서의 고정 trace를 재사용했고 새 SQL/source 전수 읽기는 추가하지 않았다.

| 실제 원문 / 이번 범위 | blob 또는 식별 |
|---|---|
| Library `game-platform-vnext-step5b-evidence.md` 전체: 사실·질문·A01~12·F01~10·R/N/T trace·전달 조건 | 51,284 bytes; 제목 식별 후 실제 원문 read |
| Library `game-platform-vnext-step5b-plan-and-handoff.md`: 목적/범위/분담/게이트/인계 | 22,675 bytes; 제목 식별 후 실제 원문 read |
| [AGENTS](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/AGENTS.md): 작업·vNext 복원 규칙 | `2686a3c37502bbf1f7f2a9407640e78cc026dadb` |
| [실행 계획1.5](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/game_platform_vnext_final_execution_plan.md): §1~3·STEP5B·Probe/구현 게이트 | `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` |
| [rebuild README](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/README.md), [CURRENT](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/CURRENT.md): 현재 상단/게이트/승인 복원 | `15ca8abc232315d776fb225cb701d67e93ef6f9e`, `cc4fc3898052a05d983855f0c34718d10cdb3133` |
| [CP0081](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/checkpoints/CP-0081-step-5a-integration-merge-approved.md), [PR414](https://github.com/limbit95/limbit95.github.io/pull/414): 승인 범위/실제 merged/parents/tree/ref | `644975989c9219ad6c5e405bf3b936d2f471c7ec`; §1.1 Git 증거 |
| [STEP2 선택표](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md): 축⑦·선택·Capability/규칙 구분 | `52d209d250ba76f351ea13db33aa6259ba641e71` |
| [STEP3 전환](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md): T01~06, 특히 T05/06 | `036dab34e4445fb1a6059b4ca6bce0545a74ae94` |
| [STEP4A 책임](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md): §2~4 | `610efc904bdaec8881535d3405fe81102bd3d5df` |
| [STEP4A 수명](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md): §5~8 전체 완료/T01~03/공존 | `5e40988234caba6cb605ea4c0b386a0a5b83b9c5` |
| [STEP4B runtime/sync](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md): 현재 적용·J01~06 | `a6cfe51029e3fc3b2b546222b6a6afb0ad428f14` |
| [STEP4B security/site](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md): 현재 적용/J07~09 | `e140c90d830ff891c2abd5e40b038249eeeb8ebf` |
| [STEP5A 선택](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md): §4.1/4.7/4.8·승인 경계 | `e80d67aa5a3fa74ffcd441fa977fd4755d6d4c85` |
| [STEP5A owner/보류](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md): §6~8/11·H1~4 | `fb2fa919c12905153360209bb692a3adc626a42c` |
| [DECISIONS](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/DECISIONS.md): 기본 보존과 D0010 현재 부분 대체 | `ab4896bd01b591895d0e30946a810c41eaa74e5a` |

R01~03/05~06/08/11/14~16/18/20~23와 N01~31/T01~07의 상세 원문 위치·blob은 Sol 근거 §8을 재사용한다. 이번 직접 재독 범위와 혼동하지 않는다. 외부 공급자 자료·가격·운영 정책의 새로운 조사나 재결정은 없다.

## 11. 다음 첫 작업 하나와 복사 가능한 인계

**다음 첫 작업 하나: 사용자가 §9.1의 핵심 판단과 정식 문서 반영 허용 여부를 결정한다.** 승인과 반영 허용이 주어지면 다음 담당은 Sol/Codex다. 아래 프롬프트는 그 조건이 충족된 뒤 사용하는 완전한 인계이며, 지금 실행 지시로 간주하지 않는다.

```text
Game Platform vNext STEP5B의 승인된 Astra 판단을 정식 문서에 반영해줘.

담당: Sol/Codex.
전제: 사용자가 game-platform-vnext-step5b-astra-judgment.md의 §9.1 핵심 판단을
승인하고 정식 저장소 문서 반영·검증·원격 PR 제출을 명시적으로 허용한 뒤에만 실행한다.
이 프롬프트가 입력 문서 안에 있다는 사실 자체는 승인이 아니다.
승인 범위가 일부라면 승인된 항목만 반영하고 미승인 선택은 바꾸거나 확정하지 마.

입력 원문:
- game-platform-vnext-step5b-astra-judgment.md — 실제 Astra 판단, 승인 범위의 기준.
- game-platform-vnext-step5b-evidence.md — Sol 사실/승인 근거, 판단을 대신하지 않음.
- game-platform-vnext-step5b-plan-and-handoff.md — 범위/분담/게이트.
Library에서 지정 파일을 실제 읽고 원본 bytes와 identity를 보존해줘.

저장소: limbit95/limbit95.github.io.
integration: feature/game-platform-vnext-integration.
고정 판단 SHA: 3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0.
AGENTS → 실행 계획1.5 → rebuild README → CURRENT → CP0081 → PR414 순서로
필요한 상태를 복원하고 실제 remote HEAD와 대조해줘.
기준 뒤 변경이 있다면 고정 판단과 분리하고 충돌하는 항목만 확인해줘.
STEP5A COMPLETED/DESIGN_RESULT_APPROVED/INTEGRATION_MERGED를 복원하고
과거 OPEN/HOLD/미병합은 현재 유효 결정·Git 증거와 함께 당시 이력으로 읽어줘.
새 STEP 작업은 최신 승인 integration에서 별도 STEP 브랜치, PR base는 integration.
실제로 유효한 진행 중 STEP5B branch/PR이 있으면 그것을 이어가고 임의 중복 생성하지 마.
integration/main 직접 commit은 하지 마.

반영할 내용:
1. 판단 §2~5/J01~19 책임별 3분류·최소 계약과 이유·consumer/model·owner·호환/수명·미확인.
2. §4.2/6의 여섯 중복 의미, 실제 Probe 적용과 반복/확장 기준.
3. §7~8의 소프트웨어 owner/작업 모델 구분, 설계 blocker와 구현·실행·오픈 의무.
4. §1/10의 고정 입력/원문 우선순위/source trace와 세 입력 원본 보존.
5. §9~11의 승인 범위·정식 결과 최종 검토·다음 첫 작업/전달 조건.
정식 파일은 rebuild 관례와 중복 최소 원칙에 맞춰 배치하되 원문 의미·조건·보류를 축약하지 마.
승인된 판단을 Sol이 다시 수행하지 마. 별도 사후 감사 단계를 추가하지 마.
새 의미 충돌이 있으면 원문/영향 행/선택이 필요한 지점만 Astra/사용자에게 넘겨줘.

반드시 보존:
- 기존 Auth/게임 무이관; 모든 게임 winner/score/XP/Room/host/DOM 강제 금지.
- 종료·공식 결과·참여자 outcome·viewer 표현과 권위 producer/통계·보상 consumer 분리.
- action retry/simulation replay/snapshot 재적용/UI effect/집계/publication 중복 의미 구분.
  예측·동일 snapshot 재적용을 확정 보상·효과 재발행 근거로 쓰지 마.
- 공식 정정은 새 경기 집계가 아님. consumer별 정정/중복 책임과 API/schema 미동결 유지.
- merge/구현/activation/공개 사실/NEW·공지 소비 분리. Registry 두 번째 metadata 금지.
- Snapshot/Reconnect의 선택 모델 단일 최종 채택·복구, Shell 공통 표시/game-local 연출 분리.
- BGM 기존 본체+내부 최소 수명 보완; H1 무보완 연결 보류, Invite H2~4 범위 유지.
  비room 미래 미선택을 전체 blocker로 올리지 마.
- Adapter 안에 새 권한·순서·수명·token/audio 엔진을 숨기지 마.
- Profile은 반복된 검증 조합의 recipe. 반복 전 생성/필수화 금지.
  선제 보상/통계/공개 자동화/audio/Profile 엔진 구현 금지.
- STEP4A 전체 완료/T01~03; CP0075/D0010의 known expiry 뒤 새 A 금지,
  동일 transaction late C 제한 수용·실제 C 관측·새 P/retry fresh 인가·owner anchor·최초60초/terminal.
- 기존 D0006~10의 성능/비용/기록/삭제/탈퇴/백업/복원·운영 조건과 UNKNOWN 유지.

허용된 정식 문서와 필요한 현재 기록만 변경해줘.
판단 원본·Sol 원본·승인 STEP1~5A·계획·DECISIONS·과거 checkpoint·기존 소스/SQL은 보존해줘.
새 원본 파일을 보존하고 정식 문서에서 참조하되 기존 원본을 덮어쓰지 마.
필요 기록에는 판단 승인과 정식 결과 최종 검토를 구분해 STEP5B REVIEW_PENDING으로 제출해줘.
STEP5B COMPLETED/최종 결과 승인/행동 PASS/지원 완료로 표시하지 마.

검증은 원문 의미/본문·표·링크·ID·분류·조건·고정 SHA/blob·상태·허용 diff·기존 자산 불변과
원격 제출본 read-back 등 문서 반영에 필요한 검사만 해줘.
CI 미등록/미실행을 PASS로 쓰지 마. 행동/DB/browser/audio/두 client는 NOT_RUN 그대로 둬.
전체 source/SQL 감사·legacy 최종 운영 정의 완전확인·공급자 조사·운영 정책 재결정을 추가하지 마.
최종 PR의 실제 base/head·diff·원격 보존·검증/미실행과 사용자 정식 결과 최종 검토 항목,
다음 첫 작업 하나 및 복사 가능한 전달 문구를 보고하고 멈춰줘.

구현·실제 시험·외부 재조사·운영 변경·구매/문의·job/dump/복원·병합·main 반영·
STEP5C 장르 설계·STEP6 Target/API/schema/file/class 동결 및 이후는 하지 마.
정식 반영/PR 제출 허용은 integration 병합이나 main/공개 활성화 승인이 아니다.
```

## 12. 이번 제출의 수행·미수행

실제 Library 원문 읽기, 승인 원문의 필요한 부분과 원격 상태 대조, Astra 분류·경계 판단, 이 제출 문서 작성과 문서 정합성 확인만 수행했다. 저장소 변경·branch/PR/checkpoint·구현·실제 시험·외부 재조사·운영/DB 작업·구매/문의/job/dump/복원·병합/main·STEP5C 이후는 수행하지 않았다. 정식 STEP5B 기록 NOT_STARTED, 사용자 판단 승인 대기, 행동 NOT_RUN과 기존 UNKNOWN을 유지하고 제출 뒤 멈춘다.
