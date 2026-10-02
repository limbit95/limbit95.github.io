# STEP 4A — Work Sol 근거 brief

작성: 2026-10-02 KST. **모델별 순서 1번 준비만 완료 / STEP4A IN_PROGRESS**. Astra 3A/3B 판단·정식 책임/수명 계약은 미작성이다. 입력 우선순위는 계획1.3 → 유효 규칙·승인 STEP1~3 → 이번 근거 준비 → 선택 보조 조사다.

## 1. 실제 기준선과 승인 복원

- 저장소: `limbit95/limbit95.github.io`.
- integration: `feature/game-platform-vnext-integration` @ `ad7655a051f0dbb13444eec6f469f6f98f9794f4`.
- [PR410](https://github.com/limbit95/limbit95.github.io/pull/410) closed/merged=true, base integration, 최종 head `d5b2b6086e1061fb70a9dfb4eecce88ec666f2ed`, merge `ad7655a051f0dbb13444eec6f469f6f98f9794f4`, merged_at 2026-10-02T02:35:33Z.
- GitHub compare 최종 head…integration: ahead1/behind0/files0. 최종 head의 포함과 동일 산출물 tree를 대조했다. 고정 merge tree는 `f8e36e325c5d9ca487950d6d8b82838dc22b6638`.
- CURRENT·CP0029의 PR OPEN/Draft·반영 STEP2는 병합 직전 기록이다. STEP3 COMPLETED/반영 완료, phase3 종료 이력. 착수 전 vNext branch 목록7개·열린 PR4개(405/16/8/1)에 유효 phase4A 작업은 없었다.
- 새 전용 branch: `docs/game-platform-vnext-phase4a-evidence-preparation`, 승인 integration에서 분기. Draft PR base도 integration이다.
- STEP3 승인 범위는 matrix·시나리오·리스크와 사후 감사다. API/최종 모델/Target 동결/구현 지원 승인이 아니다. 감사 대상 `79a03bca8ecba10eee4473156168aae5fa7faeb3`; 신규 Critical0/Major0/Minor0은 당시 감사 결과이며 이번 준비의 독립 감사 판정이 아니다.
- [CP0029](../checkpoints/CP-0029-step-3-approved.md), [위치33개·선택10조항](step-4a-source-trace.md), [진행 분담](step-4a-work-allocation.md).

## 2. 분류와 ID 사용

**사실(Fact)**: 고정 source에서 확인한 현재 문서/코드/원격 상태. 실행되지 않은 코드 읽기는 runtime 성공 증거가 아니다.
**승인 요구(Requirement)**: 계획·유효 규칙·승인 STEP1~3가 남긴 검토 의무. 설계안 채택과 구분한다.
**추론(Inference)**: 사실/요구에서 도출한 이번 검토 질문. 소유자·필드·API 결정이 아니다.
**미확인/Open**: Astra 판단·후속 STEP·보조 원문 확인·실행 증거가 필요한 사항.

STEP1 F01=Major snapshot 버전/수명 경계 차이, F02=Major No Thanks handoff/활성화 불일치, F03=Minor DB 테스트 필수 개수 불일치. 이전 채팅 F02의 '다른 방 응답' 의미와 혼용하지 않는다. R01~05/U01~03/IMPL-001~008도 저장소 정의를 유지한다(S4A-E06). 이번 준비는 기존 finding을 해결·재등급화하지 않는다.

## 3. 책임·의존 경계 검토 입력 — Astra 3A

아래는 계획이 이미 설명한 역할의 근거와 열린 질문이다. 정식 책임 표·의존 금지 계약이 아니다.

| 입력 ID | 사실·승인 요구와 근거 | 추론/미확인 질문 |
|---|---|---|
| S4A-B01 Core | 계획 §2는 식별/등록·실행 인스턴스/수명·구성 연결·계약/오류/정리를 최소 범위로 설명. Room/host/턴/점수/DOM/Canvas/tick/RPC/snapshot 보편 강제 금지(S4A-E02/03) | 실행 맥락 보호에 필요한 공통 의미와 모델별 식별 방법을 어디서 나눌 것인가? 새 필수 Core 필드·전역 상태 미정 |
| S4A-B02 선택 모듈 | 7축과 실행/시간·참여·권위/복구·공간·지속성은 선택 특성. 다중·단계별 변경 가능(S4A-E02/09) | 어떤 의미가 모델에 속하고 연결/정리 의무와 어떻게 만나는가? 모듈 이름/수/API 미정 |
| S4A-B03 Profile | 검증된 조합의 레시피이며 상속 계층/전용 게임 규칙이 아님. 조합 반복 전 선제 생성 금지(S4A-E02) | 기본값·금지 조합·검증 참조와 실행 자원 소유를 구분할 입력은 무엇인가? 실제 Profile 생성 없음 |
| S4A-B04 Game-local | 도메인 규칙/콘텐츠/상태 계산·시각 정체성·전용 입력·해당 서버 로직. 얇은 설정/연결 허용, 공통 본체 복제와 계약 우회 금지(S4A-E02/14/18) | 게임 고유 결정과 공통 수명/권한 의무를 구분할 수 있는가? 반복 사용만으로 Core 승격 불가 |
| S4A-B05 Site Adapter | 승인회원/프로필·routing/catalog/publication·기존 Invite/BGM 연결. Registry 표시값은 보안 경계가 아님(S4A-E02/29/30/31) | site auth/view 변경이 실행 수명과 연결되는 경계는? 접근 집행·publication/sound 세부는4B/5B; 기존 모듈 재사용 분류는5A |
| S4A-B06 규칙↔계약 | 아키텍처/공통→장르→네 문서, 기술 모델은 특정 장르 독점 아님. 강도/조건/예외·baseline override 보존(S4A-E02/07/08/18/19) | 어떤 공통 의무가 어떤 모델 계약을 지시하고 장르 규칙은 어떤 적용 조건을 추가하는가? 공통 수명/권한의 local/Capability 우회 금지 |
| S4A-B07 공존 | 현재 shared public API/import·게임/DB/UI/Registry/규칙 보존. 현재 snapshot은 검증된 한 모델; 전 소비경로 안전 보장 아님(S4A-E02/06/22/24~28) | 기존 계약과 새 의미가 섞이지 않는 논리적 스코프를 설명할 수 있는가? adapter/신규 구현 판정5A, 경로/버전/Guard6. 이번 migration 없음 |

기존 규칙·선택 조항을 짧은 Core 책임명으로 대체해 의무를 약화하지 않는다. S4A-E07과 trace의 10행은 조항 단위 연결 입력이며 전수 계승 2,104행을 새로 조사하거나 분류하지 않았다. 관련 UI는 독립 Visual Identity·baseline/후속 결정·수동 리뷰 의무를 보존하며 Shell을 필수 보편 renderer로 확정하지 않는다.

## 4. 관계·수명 검토 입력 — Astra 3B

| 입력 ID | 승인된 검토 요구·기존 사실 | 열린 질문과 경계 |
|---|---|---|
| S4A-L01 실행 인스턴스 | 계획4A의 실행 수명·dispose·오류/정리. 현 controller와 Coordinator/listener의 종료 범위는 다름(S4A-E03/22~27) | 인스턴스 생성/종료, callback 적용 대상, 소유 자원의 정리 경계? 인스턴스=방=경기=연결로 동일시하지 않음 |
| S4A-L02 Room/Lobby/Match/Round | 현행 재대결은 room/player identity 유지·gameplay/private 초기화·ready/start 서버 재검증(S4A-E17/21). STEP2③⑦도 유지/초기화를 별도로 기록 | 같은 room의 경기 교체·라운드 교체·로비 전환은 어떤 수명인가? 모든 게임에 이 개념 전부 강제하지 않음 |
| S4A-L03 session/match 식별 | T01은 데이터의 현재 맥락 적합성과 맥락 안 순서 둘 다 요구(S4A-E10). version의 비교 범위/리셋·단조 증가가 모델마다 다름 | 식별의 의미를 어떻게 설명할 것인가? 별도 matchId/epoch/정수 version 필드 필수 확정 금지; ordering 세부4B |
| S4A-L04 generation | No Thanks trackingGeneration+roomId+disposed는 일부 snapshot/Presence/reconnect 경로에 존재. same-room track 재사용은 generation을 새로 만들지 않음(S4A-E26/27) | A→B→A에서 이전 A와 새 A 구별? 같은 room 경기/view 변화를 그 방어가 포괄하는가? 공통 보장으로 승격하지 않음 |
| S4A-L05 view/auth | T03은 room/경기/version 일치와 권한 일치를 분리(S4A-E10/20). accessGate는 현재 auth 판단/구독 제공(S4A-E29) | 역할·로그인 전환, cache/로그/이전 callback 수명은? 서버 제공 시점·전송 경계4B, 관전 정책5C |
| S4A-L06 room/host 없는 실행 | C09a solo roomless 가능, b 초기hostless+준수rematch, c rematch host불성립 변경검토, d 정책미정 미확인(S4A-E08/09/11/15/17) | fake room/ready/start 없이 같은 플랫폼 수명 의미를 설명할 수 있는가? 현8surface 호환/비DB 의무 면제 미승인 |
| S4A-L07 장기 상태 | C11 저장 상태는 연결·실행 인스턴스보다 길 수 있음. browser refresh는 저장/재개 증거 아님(S4A-E09/11/12/23) | 실행 종료 때 끝낼 자원과 남길 authorized 상태의 차이? 탈퇴/재가입·마감·재개/저장은4B/5C, history는 제품 요구 시 |

Room/Lobby/Match/Round/장기 상태의 포함 관계·동시 실행 수·필드·owner를 이번에 설계하지 않는다. 단일 전역 currentRoom/currentMatch·상시 연결·단일 tick·DB snapshot 필수 전제를 추가하지 않는다.

## 5. 비동기 유입 경로와 부족한 근거

| 경로 | source에서 확인한 사실 | Astra가 검토할 요구/미확인 |
|---|---|---|
| Coordinator 성공 | await load 후 낮은 version 거부, 동등 version 허용; await 뒤 disposed 재검사 없음(S4A-E22) | 최신성 비교 이전/이후 맥락의 유효성을 설명. 기존 F01 재현을 참조하며 새 실행 재현 없음 |
| Coordinator 오류 | catch에서 onError 호출 후 재throw. start 후 subscribe도 별도 수명(S4A-E22) | 늦은 오류가 새 맥락의 오류/연결 UI·후속 작업을 바꾸지 않는 조건 |
| Coordinator finally | inFlight=null은 해당 coordinator closure의 local 정리(S4A-E22) | local 자원 정리와 현재 화면 busy 해제를 동일시하지 않음. 이미 진행한 완료의 적용 대상 구분 |
| action/initial/leave/null | Can’t Stop ready/start 직접 apply; initialize null·leave 후 stopTracking/apply(null). No Thanks에도 직접 action/leave와 command 경로 존재(S4A-E24~27) | refresh 방어만으로 전 유입 안전 주장 불가. 초기조회/null/leave 실패와 성공·generic catch/finally를 포함 |
| No Thanks 부분 방어 | captured roomCoordinator·generation 검사는 refresh 성공/오류·Presence 일부에 있음. generic command의 catch/finally에는 같은 captured tracking 검사가 없음(S4A-E26/27) | 구체 호출 가능성/취약성은 별도 검증. 일부 방어를 same-room/new-match/view 전체 안전성으로 확대하지 않음 |
| listener/stop/dispose | Coordinator stop은 unsubscribe/queue 정리, dispose는 새 refresh 금지. Reconnect stop은 browser listener 제거, 이미 시작된 Promise 오류는 별개(S4A-E22/23) | 취소 요청·실제 중단·완료 채택 거부를 구분. 반복 dispose/부분 초기화·정리 예외의 규범은 미정 |
| view/private/cache | T03·DB private 의무가 존재; 해당 controller에 관전 전환의 전 경로 검증 근거 없음(S4A-E10/20/26) | 허용된 과거 비밀 회수 보장 불가. 현재 view의 표시/병합/재사용과 서버 집행 양쪽 필요 |

위 코드 관찰은 신규 finding 판정이나 기존 코드 수정 지시가 아니다. 성공/오류/null/finally/정리는 동등하게 추적해야 한다는 승인 요구에 연결한다.

## 6. T01~03 검토 입력과 증거 한계

| 시나리오 | 대입할 변형 | 승인 STEP3가 요구한 검토 | 이번 미확인 |
|---|---|---|---|
| T01 같은 방 새 경기 | 이전 경기 action/snapshot/error/연출 완료; room 동일·version 낮음/동등/큼·reset/단조 증가 | 새 경기와 데이터 맥락·순서 분리. 이전 발행 요청이 실제 현재 authorized snapshot을 반환하면 일괄 거부하지 않음 | 구체 식별/채택 계약·전환 양방향 검증. busy/finally 포함. match 필드 선결정 없음 |
| T02 다른 방·A→B→A | initial/refresh/action/leave 대기→종료→새 수명→이전 성공/error/null/finally | 이전 맥락은 새 UI/연결/후속 작업 변경 금지; 이전 소유 자원 정리는 가능하나 새 자원 정리 금지 | 반복 dispose/부분 초기화·실제 취소 한계. client 거부가 서버 leave rollback은 아님 |
| T03 관전/private | 같은 room/match/version에서 participant→spectator, 역전환·역할 A→B·로그인 변경; 응답/구독/cache | 서버 허용 정보 제공과 client 현재 view 채택 분리. 예전 private cache 자동 재사용 금지, 로그도 검토 | 제공/철회 시점·cache 정책4B/관전5C. generation만으로 서버 보안 완료 판정 불가 |

근거: S4A-E10 원문 전체와 S4A-E20~27. 이번은 **요구 정리**이며 세 시나리오의 새 계약 채택/거부 설명 작성·실행 테스트 PASS가 아니다.

## 7. 회귀·후속 결정과 다음 첫 행동

- 승인 STEP3의 '새 필수 Core 전제 미발견 / STEP2 즉시 회귀 불필요' 유지. 새 설계가 room/host/DB snapshot/단일 tick/전역 currentRoom을 필수화하거나 7축으로 표현 못 할 새 전제를 요구하면 회귀 검토(S4A-E12). 이번에 회귀 여부를 새로 판정하지 않는다.
- 4B: authority/ordering/중복/복원/private/transport/실행 위치·운영비/비DB 의무 전환.
- 5A: 기존 모듈 재사용 분류. 5B: Result/Publication/Sound. 5C: 장르 규칙·관전/장기/hostless 정책. 6: 실제 경로·버전·문서 권위·동결. 7이후: 구현/실행 검증.
- 선택 보조 조사는 STEP3 X01~07 재조사 없이 **취소·정리·view 수명의 부족한 질문3개**만 준비했다. [전달 입력](step-4a-auxiliary-research-input.md)과 [요청문](step-4a-auxiliary-research-request.md).
- 활용할 경우 사용자가 일반 Sol5.6 조사 원본을 전달한 뒤 저장·출처/미확인 확인을 거쳐 Astra 3A/3B를 별도 지시한다. **원본 수신 전 핵심 판단 진행 금지**. 조사 생략은 별도 지시에서 이유와 잔여 미확인을 기록한다.
- 이번 준비 제출 후 멈춘다. 사용자 결과/merge 승인 미수행, integration/main 미병합, production/STEP4B 미착수.
