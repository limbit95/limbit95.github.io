# STEP7D S1 — offline implementation candidate

2026-10-21 KST · Sol/Codex · **후보 구현 작성 / 정식 반영 없음 / 실제 지원 미입증**.
Base integration `e987d38829334bd6435a5a74b1fbf9f3851cbaa0`, tree `272fafcfcd357c41f962984803fb1eb2a2e2cf82`.
원본 밖 임시 checkout의 후보다. [승인 S0](step-7d-coop-session-contract.md)와 보존 Astra 판단을 따르며 초기 두 원문은 여전히 미확보다.
[Astra F1~F3 보완](step-7d-s1-candidate-review-fixes.md): server 발견을 HEAD/index/실제 경로에 결속하고,
LIVE 통지 중 pending refresh를 소진하며 동일 session/match의 terminal을 인스턴스 수명 동안 보존한다.

## 구현된 부분

- `games/shared/vnext/models/coopSession.js`: 한 full-state adoption/recovery owner. invalidation-only observer,
  요청 epoch/단일 refresh·quiet reconciliation·bounded refresh/command retention·명시 timeout,
  context 세대/owner/stream/revision·내용 충돌 검사, Core 단일 동기 반영, 선무효화·late acquisition 정리.
- API 후보 `createCoopSession` → `activate/reconcile/submit/lookupCommand/getState/dispose`.
  `readCurrent(context,{signal})`는 향후 신뢰 server의 실제 authorized projection을 제공해야 한다.
  현재 transport/Auth/backend admission은 없다. 로컬 protocol LIVE는 online 지원 인증이 아니다.
- observe는 자기 disposer만 반환한다. 준비 전 LIVE 금지, 늦은 disposer도 old owner가 반납한다.
  context는 session/match/user/view/role이며 owner/stream 변경은 새 activate를 요구한다.
  host가 quietMs/timeoutMs를 제공한다. maxRefreshes8/maxCommands64는 후보 유한 bound이며 승인 성능 수치가 아니다.
  onState는 동기 상태 통지이며 effect/통계/publication 발행 API가 아니다. 같은 snapshot 재검증은 값 identity를 유지한다.
- ACK loss는 UNKNOWN과 같은 ID/hash를 보유한다. mutation 재실행 대신 lookupCommand로 조회한다.
  응답/ACK는 state/C/P가 아니며 별도 current read를 거친다. server durable ledger는 미구현이다.
- `services/game-platform-vnext/sessionControl.mjs`: scoped SHA256 hash·session/match/member/WAITING/ready payload 검사,
  immutable ready write proposal·기존 ledger record 충돌 조회. **SESSION_WRITE_PROPOSAL은 A/실제 C/native P가 아니다**.

## 미구현·미지원

실제 신뢰 caller/Auth/current predicate·잠금 뒤 A·PG finalizer/unique ledger/실제 C·owner fencing/native P/gate,
worker/controller·외부기록/삭제/복구/운영은 없다. session 생성/join/start/rematch/terminate 정책은 명시 거부한다.
terminal server input은 불변으로 거부하고 client는 authorized terminal snapshot 뒤 LIVE로 복귀하지 않는다.
membership는 입력 state의 member 검사까지이며 실제 입장/허용회원 인가를 구현했다고 하지 않는다.
새 migration/SQL/API·SDK/WSS·site Adapter·게임 entry·Registry/oracle 등록은 없다.
연속 intent/simulation/physics/renderer/prediction·H1~3 본체·H4도 미구현이다.
안전11/current A/C/P 전체·실제 DB/native/browser/audio/두 client/성능/운영은 **NOT_RUN/미입증**이다.

## 공개 제외 연결 후보

pure parser/oracle 검사를 `scripts/game-platform-vnext-boundary-rules.mjs`로 분리하고 기존 helper export를 재수출한다.
pure validateVnextBoundaries는 여전히 server 존재를 거부한다. checkout CLI는 전체 참조 검사 후 server가 있으면
기존 verifyCheckoutPublication의 실제 HEAD/source/policy/output 증거를 요구한다. rules도 CHECKOUT_TOOLS에 포함한다.
builder는 pure rules만 import하여 순환하지 않는다. 독립 governance도 같은 boundary orchestration을 호출한다.
publication/governance workflow 후보는 build 후 독립 boundary를 수행한다. 실제 Pages upload/identity/deploy gate는 그대로다.
allowServer/skip/과거 receipt 경로는 없다. §4.2의 **검사 대체 제안**이며 원본 production Guard는 불변이다.

후보 policy는 기존384 + model1 = **385**. 기존384 각 파일 bytes·moduleMaps 보존. model→기존 Core만 명시 import한다.
server tracked source의 public 출력은 +0이어야 하며 실제 source/output·별칭·참조/provenance를 기존 builder로 검사한다.
후보 HEAD/tree·path/type/size/hash·검증은 외부 evidence/handoff에 기록한다. 결과는 LOCAL_CHECKOUT_PUBLICATION뿐이다.
고정 M/run39191903797/attempt1/artifact12160182245의 별도 P1과 미래 candidate를 구분한다.

원본/정식 main382·integration384·Core 미이식·기존 consumer/API/Registry metadata/barrel·게임/Auth/API/SQL/game-local 네 문서,
승인 Target/STEP7B §7 전체·H1~4/단일 채택/복구/안전11/current A/C/P/D0010/hostless·미승인 재대결 예외 금지,
빈 모델/미구현 미지원·runtime/online 차단·기존 online DB 요구·browser/cache/SW UNKNOWN·전체 후속 의무 유지.
**STEP7D 미완료 / 후보 구현 작성 / 정식 반영 없음 / 실제 지원 미입증 / vNext 행동 NOT_RUN / 운영 UNKNOWN**.

## 2026-10-22 정식 검토 제출 — 이전 후보 기록과 구분

위 본문은 저장소 밖 후보 작성 당시 범위/미구현 기록으로 보존한다. Astra의
`game-platform-vnext-step7d-s1-candidate-f1r1-astra-review-2026-10-22.md`에서 F1-R1 해소·F2/F3 해소 유지·부분 코드 PR 제출 가능을 판정했다.
사용자 `바로 진행하자`는 해당 보고서 §7의 integration-base 제출 작업에 대한 지시다. 최종 결과 승인/병합/지원 승인이 아니다.
local fb030329…/treeaa51…의 누적16파일을 source/tests/workflow/policy bytes 추가 변경 없이 반영하고 최소 현재 문서만 정합화한다.
이 branch의 검사 대체안은 실제 server/source/policy/output와 같은 revision의 LOCAL_CHECKOUT_PUBLICATION을 요구한다.
정식 integration384/main382·Core main 미이식과 기존 consumer는 보존하며 정책385·server 검사 연결은 미병합 검토 결과다.
[제출/검증 범위](step-7d-s1-submission-validation.md)와 [CP0111](../checkpoints/CP-0111-step-7d-s1-code-submitted.md)을 따른다.
**S1 부분 코드 결과 REVIEW_PENDING / STEP7D 미완료 / 실제 지원 미입증 / vNext 행동 NOT_RUN / 운영 UNKNOWN / browser·cache·SW UNKNOWN**.
