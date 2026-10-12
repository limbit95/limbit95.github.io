# STEP6 — 세 요청의 코드 없는 추적

- 현재 지위: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-12 23:12:53 KST의 승인 게이트 설명 뒤 사용자가 “승인할게”라고 응답했다. §9.1 여섯 묶음의 본문 조건·제한·미확인 포함 핵심 판단 승인 및 앞선 STEP6 정식 반영·문서 검증·integration base 검토 PR 제출 요청의 시작 조건 충족으로 기록한다. 승인 시각 자체가 제공되지 않은 마지막 응답의 정확한 시각은 추정하지 않는다.
- STEP6 **REVIEW_PENDING**. 정식 결과 최종 검토·Target 동결 완료 기록·integration 병합·main·STEP7은 별도 게이트다. 현재 행동 **NOT_RUN**, 운영/실행 **UNKNOWN**과 후속 의무 유지.
- 판단 기준/착수 integration `f34f4f180e14ea36847b9740dea43de2f1325e56`. STEP5C **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED**. 기존 게임/Auth/API/SQL 무이관.
- 원본: [Astra 판단](game-platform-vnext-step6-astra-judgment.md), [Sol 근거](game-platform-vnext-step6-evidence.md), [계획/인계](game-platform-vnext-step6-plan-and-handoff.md). 세 입력 bytes/identity/hash·원문 이력 상태는 보존한다. Sol/Codex가 새 Target·책임·경로·버전·Slice를 선택하지 않았다.
- 아래 원본 절은 제목·번호·본문·표·조건을 exact하게 전달한다. 원문의 PROPOSED/미승인/NOT_STARTED·저장소 변경 금지·다음 작업/프롬프트는 작성 당시 상태와 요청이다. **현재 허용과 상태는 이 헤더·CURRENT·CP0088·검증 문서가 우선**한다. 이력 문구를 현재 미승인으로 해석하거나, 핵심 판단 승인을 구현·동결 완료로 확대하지 않는다.
- 정식 단일 본문: [Target 책임·문서 계층·적용 조건·물리 격리·계약 권위](step-6-target-architecture.md) / [전수 참조 계승·명시 분할·조항 목적지](step-6-clause-destinations.md) / [세 요청의 코드 없는 추적](step-6-request-traces.md) / [Slice·검증 예산·설계 blocker와 후속 의무](step-6-slices-and-verification.md) / [고정 원본·승인 대응·source trace·게이트](step-6-source-trace.md). 검증/최종 검토는 [step-6-validation](step-6-validation.md), 현재 기록은 [CURRENT](../CURRENT.md)와 [CP0088](../checkpoints/CP-0088-step-6-formal-submitted.md).
- 새 topic-owner와 runtime 경로는 승인 판단의 **후속 적용 경로**다. 이번 실제 생성 파일은 rebuild artifacts와 CP0088이며 현재 rulebook/AGENTS/Guard는 전환하지 않는다. §12의 목적지는 계획된 논리 책임과 원문 참조 계승이고 새 규칙 본문 적용 완료를 뜻하지 않는다. 실제 전환 시 특정 ID/f 목적지가 성립하지 않으면 해당 조각을 blocker로 반환한다.

## 5. C — 세 요청의 코드 없는 구현 추적

아래는 문서상 성립 조건이다. 실제 Probe 게임, 엔진, 제품 판본, renderer/transport/tick/physics/prediction을 새로 선택하거나 구현하지 않았다.

| 경로 | 신규 보드게임 | 실시간 2D 온라인 협동 | 방·host 없는 local 또는 async/기록형 |
|---|---|---|---|
| 공통 진입 | AR→CO→BO와 필요한 MO/CA | AR→CO→RT와 필요한 MO/CA | AR→CO→실제 경험에 맞는 BO/RT 또는 차이 조사; roomless라는 이유만으로 새 장르 생성 안 함 |
| 조사/제품 | 실제 규칙·판본·출처·실물/VI·권리. 공개된 기존 보드게임 조건 확인 | 협동목표/행동/종료·입력장치·공간/카메라·권리. RT는 지속입력/공간 경험에 적용 | 실제 local/async 경계, 보존/손실·제출/조회·종료 및 경험 차이 조사 |
| 네 문서 bootstrap | 네 책임/시간축 유지; 7축·보드 추가 질문·비적용 이유 | RT4의7축·intent취소·복귀·잠정/확정·HUD/조작·미지원 | run/기록/제출 권위·로컬 보존한계·모델별 N/A/미정 구별 |
| 모델 연결 | 보드명으로 DB/Room/DOM 선택 안 함. Room/DB 채택 시8surface·안전11·invalidation·재대결 적용 | 승인된 권위/인가 구조, 단일 checkpoint+후속 갱신/복구; initial/live/gap/quiet loss. cancel 손실 시 원격 intent 종료를 구현 전 해당 모델에 명시 | pure local은 fake Room/8no-op 불필요. 보호된 제출/조회가 있으면 그 경계의 인가·중복·공식 판단·복구 적용. client 점수 무조건 신뢰 안 함 |
| 기능/세션 | 선택 Invite/BGM H1~3·Shell/local·결과 유무. multiplayer 재대결 유지 | 시작/재대결/종료 정책 명시. 초기 hostless 가능, 재대결host 불성립은 별도 상위 승인 | solo 재대결 비적용; async multiplayer면 해당 의무 검토. non-room Invite·보상/Profile 미래 선택은 필수 아님 |
| 테스트 연결 | V-D/G/L/S/M/U/C 및 선택R/H/O | R01~13 전부에 적용·관측 연결; V-L/S/M/H/R/U/P/C/O | Room 없는 T01 대응 run전환, T02/T03/late정리. 보호기록이면 V-S/M/R/O 추가 |
| 문서상 판정 | 조건부 성립. 실제 판본/모델/자산 권리는 개별 게임 후속 | 조건부 성립. 협동 작은 Slice 범위이며 경쟁·3D·정밀리듬·대규모장기세계 지원 선언 아님 | pure local 성립 경로와 보호async 성립 경로를 분리. 온라인 경계 면제 경로 없음 |
| 지금 미지원/미선택 | 실제 조합/실행 증거 없음 | 실제 장치/원격취소/time-gap 정책·제품 선택 미정, 실행지원 없음 | protected record 검증/정정/내구성 모델 실제 선택 미정, 실행지원 없음 |

RT3은 R01 지속흐름, R02 입력 해제/취소, R03 공간/좌표, R04 시간 분리, R05 hidden/복귀, R06 역할/정보, R07 시작/종료/재참여, R08 복구/입력 준비, R09 전체 수명, R10 잠정/공식 소비, R11 조작 발견/접근성, R12 성능 관측, R13 증거/완료 주장에 대응한다. 모두 승인 STEP5C 원문을 소유 본문으로 계승한다. 사용하지 않는 camera/physics/관전은 이유를 적으며 안전·수명·현재성 의무를 삭제하지 않는다.

혼합 장르는 phase/행동/역할별로 적용을 나누고 같은 주제를 한 owner에 연결한다. 같은 상태를 두 모델이 서로 다른 권위·순서·종료로 정의하면 단순 합집합 또는 “더 엄격한 쪽”으로 처리하지 않는다. 그 경계만 Architecture Change로 돌린다.

