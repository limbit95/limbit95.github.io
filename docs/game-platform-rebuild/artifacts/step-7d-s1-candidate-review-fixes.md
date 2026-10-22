# STEP7D S1 — 저장소 밖 후보 Astra F1~F3 보완

2026-10-21 KST · Sol/Codex · **후보 보완 작성 / 정식 반영 없음 / 실제 지원 미입증**.

검토 입력은 local candidate `7aad8d0f92e780917a04e9c3bb4d6012113ac32c` / tree `8c0b0e0a89818bc666a89bd14e65ed91fe8bcbe4`다.
정식 integration/base는 `e987d38829334bd6435a5a74b1fbf9f3851cbaa0` / tree `272fafcfcd357c41f962984803fb1eb2a2e2cf82`다.
저장소 밖 Astra 검토 보고서 `game-platform-vnext-step7d-s1-candidate-astra-review-2026-10-21.md` §4를 보완한다.
사용자의 `바로 진행하자`는 직전 제안의 저장소 밖 후보 보완·offline 검증·재제출 범위로 수행한다.
정식 source/Guard/policy·원본 checkout·branch/remote 변경이나 PR 제출 허용으로 확대하지 않는다.

## F1 — 실제 server 입력 발견과 같은 checkout 검증

builder의 repository-root 확인을 재사용하는 `hasServerPublicationInputs(root)`를 분리했다.
HEAD tree와 index의 server 항목, 실제 `services/game-platform-vnext` 경로를 확인한다.
index에서 모든 server를 제거해도 HEAD가 증거 요구를 유지하며, untracked/ignored 입력도 실제 경로로 발견한다.
이 경로 발견은 검증을 **요구하는 조건**일 뿐 공개 제외 성공 근거가 아니다. symlink/비directory·읽기 실패는 차단한다.
발견 뒤 기존 `verifyCheckoutPublication`이 root/HEAD/index/worktree·source/policy/output·최종 재검사를 수행한다.
독립 CLI/governance가 같은 함수를 소비하며 정상 no-server는 별도 publication receipt 없이 기존 참조 검사를 유지한다.
실제 server가 있는 clean checkout은 같은 revision proof 없이는 통과하지 않는다. allow flag/skip/과거 M receipt는 없다.
기존 PR429 검증/rollback/read-only 의미와 순수 parser/oracle·workflow는 추가 변경하지 않았다.

## F2 — 통지 중 재진입한 pending refresh 소진

동기 LIVE 통지 후 현재 task/context와 ticket을 다시 확인한다. 통지 중 invalidation이 늘면 기존 bounded refresh loop가
다음 full read를 수행하며, 그 요청까지 소진하기 전 준비 성공을 반환하지 않는다. 반복 재진입은 기존 maxRefreshes로
DEGRADED/false에 도달한다. dispose/context 교체 뒤 이전 activation은 성공을 반환하지 않는다.
Core callback은 단일 동기 내부 반영을 유지하며 별도 복구 owner/공개 Core API는 추가하지 않았다.

## F3 — 동일 execution의 terminal 기억

이 후보의 execution 식별자는 **session + match**다. user/view/role/owner 재연결은 같은 execution을 다시 여는 근거가 아니다.
모델 인스턴스 안에서 terminal을 채택하면 이 식별자의 tombstone을 보유하고 같은 execution의 activate를 거절한다.
종결 A→다른 B→A 복귀도 거절하며 다른 session 또는 match는 구분한다. 새 identity 허용은 실제 start/rematch admission이 아니다.
tombstone에는 snapshot/private state를 보관하지 않고 식별자만 보유한다. 인스턴스 수명 중 임의 eviction은 없으며 dispose에서 해제한다.
새 인스턴스/프로세스 이후 durable terminal 보호·실제 조회 인가·최초60초/R+5초 집행은 여전히 backend의 미구현 의무다.
이를 실제 DB terminal 쓰기나 재대결 구현으로 기록하지 않는다.

## 계약·실제 검증의 구분

추가8계약은 F1의 index 제거/untracked/ignored 및 정상 no-server/symlink, F2의 통지 재진입/반복 bound/context 교체,
F3의 낮거나 높은 revision 재활성화/role-view-user/ABA와 별도 execution을 확인한다.
보완 전 관련41계약 중7실패를 확인했고 보완 후41/41이 통과했다. 기존 정상 구분1개도 추가8계약에 포함된다.
full Game Platform·publication 묶음·실제 local HEAD의 build/check/Guard/governance·bytes 비교 결과는 외부 인수인계/evidence에 남긴다.
fixture의 reader/clock/Auth 주입이나 임시 server 입력은 production 증거가 아니다. 실제 checkout publication은 local 결과뿐이다.

public 후보는 기존384 + model1 =385, 실제 바뀐 bytes는 model1뿐이다. 기존384·moduleMaps·server public0·server source bytes 보존을 확인한다.
정식 main382/integration384·Core 미이식·기존 consumer/API/Registry 단일 metadata/barrel·게임/Auth/API/SQL/game-local4문서·원본은 보존한다.
실제 admission/A/PG finalizer/actual C/native P·durable dedupe·start/rematch/terminal 쓰기·최초60초 강제·Adapter는 미구현이다.
빈 model oracle/runtime·online 미지원·기존 online DB 요구·server 제외 미확인 차단을 유지한다.
승인 Target/STEP7B §7 전체/current A/C/P/D0010/안전11/H1~4/hostless·미승인 재대결 예외 금지·전체 후속 의무 유지.
fixed M/run39191903797/attempt1/artifact12160182245의 별도 P1과 미래 revision은 다르며 browser/cache/SW UNKNOWN을 유지한다.

**후보 보완 Astra 재검토 대기 / 정식 반영 없음 / 실제 지원 미입증 / STEP7D 미완료 / vNext 행동 NOT_RUN / 운영 UNKNOWN**.

## F1-R1 — 2026-10-22 저장소 밖 추가 보완

입력은 local HEAD `88c045b42cef97ac69c6a7ea1e2c7ee8b72f63d9` / tree `a0f1c4b461a60a9a1e2a8687aaae2773516a87c2`와
`game-platform-vnext-step7d-s1-candidate-fixes-astra-review-2026-10-22.md` §4다. 사용자 지시는 이 후보의 F1-R1 보완에 한정한다.

builder의 private `serverDirectoryEntries`를 발견과 production `readCheckout` 양쪽에서 재사용한다.
HEAD/index 조회가 성공해도 먼저 실제 services/server root의 symlink·비directory·읽기 실패를 확인하며 대상 링크를 따라가지 않는다.
root 부재는 HEAD/index의 증거 요구를 지우지 않는다. 두 root의 exact path도 checkout 입력으로 검사하여,
assume-unchanged 상태의 tracked root 삭제가 raw bytes 검사에서 빠지지 않게 했다.
직접 build/check·독립 boundary CLI·governance가 같은 오류를 소비한다. 정상 no-server/빈 directory와 기존 검증/rollback/read-only 의미는 유지한다.

추가4계약은 tracked exact-root symlink/file, tracked services 부모 symlink/file,
assume-unchanged tracked root 삭제 및 tracked server가 있는 directory 읽기 실패를 확인한다.
fixture의 같은 revision manifest는 누락/옛 증거 오류와 root 오류를 구별하기 위한 주입 자료이고 production 증거가 아니다.
읽기 실패 주입도 tests 안의 mock/preload뿐이며 production hook/allow flag/검사 override는 없다.
보완 전4실패를 확인했고 최종 관련 checkout20계약이 통과했다. 최종 full 검증·실제 local revision/publication 근거는 외부 인수인계로 구분한다.

F2/F3·model/server source·workflow·public385 path/정책/moduleMaps·기존384 bytes·Core/Registry/barrel/consumer를 추가 변경하지 않았다.
정식 Guard/main382/integration384·fixed M의 별도 P1·browser/cache/SW UNKNOWN·전체 보존/후속 의무를 유지한다.
**후보 F1-R1 보완 작성 / Astra 재검토 대기 / 정식 반영 없음 / 실제 지원 미입증 / STEP7D 미완료 / vNext 행동 NOT_RUN / 운영 UNKNOWN**.
