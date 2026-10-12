# CP-0090 — STEP6 integration 병합 실제 증거와 사후 기록

## 허용 범위·실제 병합

- 사용자 승인: PR #417의 head `487fc8111a98d8f9966e58303b3f85cd81c8fc33`를 integration에 병합하고 실제 병합 증거를 기록한다. main·STEP7은 진행하지 않는다. 이 승인에 사후 기록 PR의 자동 병합은 포함하지 않는다.
- PR417 CLOSED / merged=true, merged_at `2026-10-12T22:29:41Z` = 2026-10-13 07:29:41 KST. 병합 대상 `feature/game-platform-vnext-integration`, merge commit `1a950b06ac895028330587dc53fae151b981123a`.
- merge 부모: 기존 integration `f34f4f180e14ea36847b9740dea43de2f1325e56` + 승인 final head `487fc8111a98d8f9966e58303b3f85cd81c8fc33`. merge tree `0df7be0a2c95a9652968e4037a4847e28db41f56`는 승인된 final head tree와 동일하다. 실제 integration ref `1a950b06ac895028330587dc53fae151b981123a` 확인.
- STEP6 **COMPLETED / DESIGN_RESULT_APPROVED / TARGET_FROZEN / INTEGRATION_MERGED**. 정식 결과 최초 승인 head `1f52c47335d741c68126187d32ad5b87b8fbdb8d`와 완료 기록 후 병합 승인 head를 구분한다. [CP0089](CP-0089-step-6-design-result-approved.md)의 OPEN/미병합은 당시 이력이다.
- main `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09` 유지, main 반영/동기화 없음. STEP7 이후 NOT_STARTED, 실제 권위 전환·runtime 구현·지원/오픈 완료 아님.

## 기록·보존·검증

기록 branch `docs/game-platform-vnext-phase6-merge-record`는 실제 merge SHA에서 분기한다. PR base integration. 사후 기록은 CURRENT/README/새 CP0090의 세 경로만 변경한다. integration/main 직접 commit은 하지 않는다. 원격 read-back·허용 tree diff·승인된 artifacts/원본·과거 checkpoint·계획/DECISIONS·게임/Auth/API/SQL/현재rulebook/Guard 불변을 확인해 실제 기록 head/tree/PR 번호와 함께 해당 PR 설명에 보존한다.

[Target](../artifacts/step-6-target-architecture.md), [전수 ID/f](../artifacts/step-6-clause-destinations.md), [세 요청](../artifacts/step-6-request-traces.md), [Slice/검증](../artifacts/step-6-slices-and-verification.md), [source trace](../artifacts/step-6-source-trace.md), [정식 문서 검증](../artifacts/step-6-validation.md) 및 세 원본을 변경하지 않는다. 3,232 ID/305부모/16행58분할, f0 원문전체·조건/예외/강도·단일owner와 기존scope 보존. 이력의 REVIEW_PENDING·PROPOSED를 현재 미승인으로 읽지 않는다.

기존 Auth/게임/API/SQL 무이관, 네 문서 baseline/유효override/manualgate, STEP4A 전체완료/T01~03, CP0075/D0010 A/C/P·knownexpiry/동일transaction lateC제한/실제C·freshP/retry·anchor/최초60초/terminal·부분대체, D0006~10 UNKNOWN 유지. Registry단일metadata·단일adoption/복구·Shell/local·BGM H1/Invite H2~4, 결과정정/producer-consumer/여섯중복/공개분리/Profile recipe, B01~12/R01~13·안전11/DB·hostless조건을 보존한다. hostless multiplayer 재대결 예외·상위 완화 미승인.

행동/unit/GuardCLI/build/DB/browser/audio/두client/성능/운영 **NOT_RUN**. 실행/운영 **UNKNOWN**·구현/실행/오픈·후속 규범 본문/권위 전환 의무 유지. CI 미실행을 PASS로 표시하지 않는다. 공급자/운영 재판단·외부재조사·구매/문의/job/dump/복원 없음.

## 다음 첫 작업 하나·정지

사용자의 사후 병합 기록 PR 검토·integration 반영 여부 결정. 이번 기록 PR의 병합과 STEP7 시작은 각각 별도 요청이다. 이번에는 PR417 병합·실제 확인·기록 원격 제출 뒤 멈춘다.
