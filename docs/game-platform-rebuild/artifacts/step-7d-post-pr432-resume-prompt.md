# 새 Work 방 재개 프롬프트 — PR432 병합 후 / CP0115

2026-10-23 KST · **담당 모델 Astra**. 다음 작업은 판단/계획이며 코드/DB 실행 지시가 아니다.

저장소: `limbit95/limbit95.github.io`.
재개 기록 branch: **`chore/game-platform-vnext-phase7d-resume-checkpoint`**.
integration: **`feature/game-platform-vnext-integration`**.
실제 integration **ec8bb5e113346681ed3d38b23fd54de07de60765** / tree **36ed89d77cf4e2950ca6c619dff4605483f705fc**.

integration에 이 checkpoint가 아직 없으면 위 기록 branch에서 CP0115/CURRENT/이 파일을 읽는다. 실제 현재 branch head/PR/CI와 integration 이후 변경을 구분하고 자동 포함하지 않는다.
이 checkpoint PR을 병합하지 않고도 판단 작업의 원문을 읽을 수 있다. 기록 branch에 소스 구현을 누적하거나 이 checkpoint를 모델 구현 승인으로 쓰지 않는다.

## 먼저 읽을 원문

아래는 `artifacts/step-7d-post-pr432-resume-sources/`에 저장한 원문 bytes 사본이다. 당시 미병합/REVIEW_PENDING 문구는 그 시점 이력이며 CP0115의 실제 Git 상태와 구분한다.

- [game-platform-vnext-step7d-post-pr432-next-handoff-2026-10-23.md](step-7d-post-pr432-resume-sources/game-platform-vnext-step7d-post-pr432-next-handoff-2026-10-23.md)
- [game-platform-vnext-step7d-s1-pg-storage-approved-handoff-2026-10-23.md](step-7d-post-pr432-resume-sources/game-platform-vnext-step7d-s1-pg-storage-approved-handoff-2026-10-23.md)
- [game-platform-vnext-step7d-s1-pg-storage-final-review-2026-10-23.md](step-7d-post-pr432-resume-sources/game-platform-vnext-step7d-s1-pg-storage-final-review-2026-10-23.md)
- [game-platform-vnext-step7d-s1-backend-slice-astra-judgment-2026-10-22.md](step-7d-post-pr432-resume-sources/game-platform-vnext-step7d-s1-backend-slice-astra-judgment-2026-10-22.md)
- [game-platform-vnext-step7d-p1-server-boundary-next-plan-2026-10-20.md](step-7d-post-pr432-resume-sources/game-platform-vnext-step7d-p1-server-boundary-next-plan-2026-10-20.md)
- [game-platform-vnext-step7d-s1-approved-handoff-2026-10-22.md](step-7d-post-pr432-resume-sources/game-platform-vnext-step7d-s1-approved-handoff-2026-10-22.md)
- [game-platform-vnext-step7d-s1-final-review-2026-10-22.md](step-7d-post-pr432-resume-sources/game-platform-vnext-step7d-s1-final-review-2026-10-22.md)
- [game-platform-vnext-step7d-post-pr430-s1-entry-plan-2026-10-21.md](step-7d-post-pr432-resume-sources/game-platform-vnext-step7d-post-pr430-s1-entry-plan-2026-10-21.md)

기존 source/SQL/tests·정식 계약은 기록 branch와 integration이 동일하며 S0/CP0114/기존 F1~3/F1-R1 판단을 재사용한다. 초기 STEP7D 원문 두 개는 미확보다. 불필요한 재검색·전수 감사·새 시험을 추가하지 않는다.

## 붙여 넣을 실행 프롬프트

```text
Game Platform vNext STEP7D의 PR432 병합 후 S1 잔여 backend 경계와 다음 최소 작업을 판단해줘. 담당 Astra.
기록 branch chore/game-platform-vnext-phase7d-resume-checkpoint의 CP0115와 이 프롬프트를 먼저 읽고,
artifacts/step-7d-post-pr432-resume-sources/의 post-pr432-next-handoff 전체와 pg-storage-approved-handoff·pg-storage-final-review의 승인/보존 범위,
backend-slice-astra-judgment §4~7, 승인 S0·CP0114·S1/F1~3/F1-R1 및 server-boundary-next-plan §4.2를 먼저 읽어줘.

고정 integration ec8bb5e113346681ed3d38b23fd54de07de60765 /
tree36ed89d77cf4e2950ca6c619dff4605483f705fc,
별도 main M=0e4089f345c1f0a33c86c96a1f07a9dab484cc2e /
tree d4f9b568f705a17cca3274f0862d46f5b56b3b76를 구분해줘.
AGENTS→계획1.6→rebuild README→CURRENT→CP0115→CP0114→PR432/Git을 필요한 범위만 복원하고
실제 현재 remote/PR432 merge·이후 변경을 확인해 자동 포함하지 마.
CP0114·현재 안내의 미병합 표기는 당시 기록이다. 과거 checkpoint는 보존하고 별도 병합 기록 PR을 만들지 마.

병합된 private PG storage/client model/proposal/publication을 재판단·재구현하지 마.
local receipt0158791·CI 합성7160126·실제 mergeec8bb5e는 같은 tree/다른 revision이다.
기존 receipt를 실제 merge의 새 LOCAL_CHECKOUT_PUBLICATION으로 쓰지 마.
CI evidence12472542493은 actual Pages artifact가 아니고 public upload/원격 artifact 검사/deploy skipped를 PASS로 대체하지 마.

다음 최소 backend 코드 Slice와 격리 PG 실제 검증 준비를 구분해 근거·대안·권고를 제시해줘.
trusted caller/subject/session·primary current predicate·external generation/writer fence·잠금 뒤 A·actual C·native P,
session bootstrap/입장·최초60초/abort/terminal·start/rematch 중 포함할 것/후속/정확한 부족 입력과 owner를 나눠줘.
없거나 미정인 경로를 no-op/fake success/allow flag/runtime postgres/직접 GRANT로 채우지 마.
독립 구현 가능한 부분은 제시하되 전체 S1 완성을 무조건 선행 요구하지 마.

격리 PG 검증을 먼저 준비하는 편이 적절하면 최소 SQL install/ACL·동시 lock/unique/rollback·COMMIT UNKNOWN/동일-ID 조회,
connection cleanup/late 완료의 실제 oracle·환경/role/버전/trace·정리 범위와 별도 사용자 허용 범위를 구체화해줘.
이번은 계획까지만이며 실제 DB 설치/시험/운영 조회·환경 설치·driver 추가·코드 작성은 하지 마.
scripted I/O/정적 SQL461계약을 실제 DB syntax/install/ACL/atomic C/A/P로 쓰지 마.

기존 PG 저빈도를 연속 상태 전체로 확대하거나 memory apply/ACK/Node socket.write를 C/native P로 쓰지 마.
Core 단일 동기 반영/현재성과 실제 backend admission을 구분해줘.
기존 consumer/Auth/SQL writer 영향이 꼭 필요한 경우 해당 원문/줄·현재 consumer·owner·영향·최소 보완·사용자 결정 범위를 제시해줘.
직접 사용자 요구의 legacy ID/f는 만들지 마. 정상 함수명/자료구조/내부 분할은 Sol/Codex에 맡겨줘.

실제 경로·owner/API·source/policy/SQL/검사 영향표·support/unsupported·offline/실제 DB/native 환경과 oracle·미실행,
후보 제출 범위 및 Sol/Codex 실행 프롬프트를 저장소 밖 파일로 남겨줘.
기존 검증/보존 근거를 재사용하고 새 시험/전수 감사·외부 운영 재조사는 추가하지 마.
초기 STEP7D 원문 두 개 미확보 상태를 유지하고 새 경로 없이 실패 검색 반복/과거 정책 추정 복원은 하지 마.

이번은 판단/계획까지다. source/Guard/policy/설정/Git/PR/배포 변경·병합·새 구현·새 HTTP/browser/DB/native/audio/두 client/
게임/성능/운영 시험·dispatch/rerun/upload/deploy·runtime GRANT·지원/oracle 등록은 하지 마.
integration385/main382·Core main 미이식·consumer/API/Registry 단일 metadata/barrel·기존게임/Auth/API/SQL/game-local 네 문서·원본/
과거 승인/원ID·줄·f·승인 Target/STEP7B §7 전체/current A/C/P/D0010/안전11/H1~4/단일 채택·복구/hostless/
미승인 재대결 예외 금지·빈 oracle/runtime/online 미지원·기존 online DB 요구·server fail-closed·전체 후속 의무를 유지해줘.
fixed M/run39191903797/attempt1/artifact12160182245의 별도 P1과 미래 revision을 구분하고
browser/cache/SW UNKNOWN·STEP7D 미완료·실제 지원 미입증·vNext 행동 NOT_RUN·운영 UNKNOWN으로 멈춰줘.
```

## 작업 종료 조건

Astra 판단 문서와 다음 **Sol/Codex 실행 프롬프트**를 저장소 밖에 남기고 멈춘다.
구현/시험/환경 설치/SQL 적용·runtime GRANT·Git/PR/설정/배포/Guard 변경은 하지 않는다.
STEP7D 미완료·실제 지원 미입증·vNext 행동 NOT_RUN·운영 UNKNOWN·browser/cache/SW UNKNOWN 유지.
