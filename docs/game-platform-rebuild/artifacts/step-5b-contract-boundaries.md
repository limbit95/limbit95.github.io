# STEP5B — 결과·공개·표현의 책임별 확장 경계

- 상태: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-10 KST 사용자 실행 요청으로 Astra §9.1의 다섯 핵심 판단 묶음 전체와 정식 문서 반영·검증·원격 PR 제출을 허용했다. 정식 결과 최종 검토는 남아 있으며 STEP5B **REVIEW_PENDING**이다.
- 판단 원문: [실제 Astra](game-platform-vnext-step5b-astra-judgment.md). [Sol 근거](game-platform-vnext-step5b-evidence.md)는 사실 입력, [계획/인계](game-platform-vnext-step5b-plan-and-handoff.md)는 범위·분담·게이트다. 유효 승인 원문/결정이 우선하며 Astra 승인 판단을 Sol/Codex가 재수행하지 않는다.
- 아래 원문 절은 bytes를 그대로 반영하고 원문 절 번호를 유지한다. 원문의 ‘사용자 승인 대기/전’, ‘NOT_STARTED’, ‘이번 직접 읽기’, ‘다음 첫 작업’은 Astra 작성 당시 상태·행위다. 현재 승인 범위와 제출 상태는 이 헤더, [CURRENT](../CURRENT.md), [CP0082](../checkpoints/CP-0082-step-5b-formal-submitted.md), [문서 검증](step-5b-validation.md)을 따른다. 원문의 조건·미확인·보류는 유효하다.
- 고정 판단 SHA: `3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0`. STEP5A COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED. 행동·DB/browser/audio/두 client **NOT_RUN**, 기존 **UNKNOWN**·구현/실행/오픈 의무 유지. integration 병합·main·공개 활성화·STEP5C 이후는 이번 허용 범위가 아니다.
- 정식 대응: [책임별 선택/최소 계약 §2~5](step-5b-contract-boundaries.md), [중복/Probe/확장 §6](step-5b-duplication-and-extension.md), [owner/보류/검증 §7~9](step-5b-compatibility-lifetime-verification.md), [입력/source trace §1·10](step-5b-source-trace.md). 여섯 중복 의미는 계약 문서 §4.2에 단일 본문으로 둔다. R/N/F/A/T/U는 Sol 원본 ID, J01~19는 STEP5B Astra ID이며 STEP4A T01~03와 Sol 테스트 ID를 혼동하지 않는다.

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

