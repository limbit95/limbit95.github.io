# CP0107 — STEP7D publication checkout 검증 준비 제출

2026-10-20 KST · Sol/Codex · **REVIEW_PENDING**.

## 입력과 허용

- 루트 실행계획 개정1.6 / blob `5ce448431c9ed8fce2699160a744b7d92ed08ce8`, 승인 Target/STEP7B 계획 §7 전체 유지.
- 사용자 2026-10-20 13:14:39 KST 요청: 기존 publication 검증을 실제 checkout/revision·현재 source/정책/output에 결속하는 준비, 관련 tests/현재 기록·commit/push·integration base 검토 PR 제출까지.
- 별도 전달본 `game-platform-vnext-step7d-p1-server-boundary-next-plan-2026-10-20.md` §4.1/§5만 구현. §4.2의 조건부 server 허용·Guard 연결은 미구현.
- base integration `b59994ce6a8435220229a77b52c136a7e6ad9495`, tree `3a8e4213b79e2aceb9137dec4d73e0f99707da0c`.
- branch `chore/game-platform-vnext-phase7d-publication-checkout-proof`. 원격 조회상 해당 준비 branch/PR이 없어 별도로 시작했다. 정식 제출 remote head/tree/PR/CI와 로컬 검사 commit은 PR/Git 및 저장소 밖 handoff에 남긴다.
- current main은 고정 M `0e4089f345c1f0a33c86c96a1f07a9dab484cc2e`, tree `d4f9b568f705a17cca3274f0862d46f5b56b3b76`이며 integration도 고정값에서 이동하지 않았다. PR427 merged=true/merge=M, PR428 merged=true/merge=b59994ce 실제 조회. CP0106의 미병합 표기는 당시 이력으로 보존했다.

## 구현과 소비자 경계

기존 builder에 `verifyCheckoutPublication`을 추가하고 production build/check CLI가 실제 Git에서 입력을 읽도록 했다. fixture용 `buildPublication`/`verifyPublication` inventory·revision 옵션은 production 검증에 전달하지 않는다. developer tooling 함수이며 runtime public API·새 지원/진단 API가 아니다.

repository root/HEAD·실제 tracked inventory를 읽고 tracked staged/unstaged 변경을 거부한다. 관련 public/server bytes·정책·template·build/verifier 도구를 HEAD blob과 비교하여 assume-unchanged도 우회 근거로 쓰지 않는다. public/server roots 내 ignored 후보를 포함한 미추적 관련 입력도 거부한다. generated ignored `.site-publication` 출력은 source 검사에서 제외하고 기존 실제 출력 검증으로 검사한다. production build/check는 commit된 깨끗한 tracked snapshot에서 수행한다.

manifest.sourceRevision=HEAD 확인 → 기존 exact policy/server hash 별칭/참조/build provenance/출력 bytes 검증 → 실제 checkout 상태 재확인 순서다. 결과 kind는 `LOCAL_CHECKOUT_PUBLICATION`이다. manifest schema1·공개 목록·public bytes·workflow·package 의존성은 보존했다. fixture 테스트는 임시 Git repository에서 수행하며 실제 server 파일을 저장소에 만들지 않았다.

production boundary helper L180~183와 CLI의 server 존재 차단은 **동일 blob**으로 유지했다. 빈 모델·미구현 조합·vNext runtime/online 미지원·기존 online DB 요구는 바꾸지 않았다. integration Core2를 main으로 이식하지 않았고 consumer/API/Registry 단일 metadata/barrel·게임/Auth/API/SQL/원본은 변경하지 않았다.

## 관련 검증

- `npm ci --no-audit --no-fund` 성공. 최초 offline 시도는 playwright-core cache 부재로 ENOTCACHED였으며 일반 설치로 완료했다. lock/dependency 변경 없음.
- `node --test tests/game-platform-publication*.test.js`: 26 pass/0 fail (Python16 fixture 포함). 새 checkout 계약7개는 실제 임시 Git/CLI로 revision mismatch, 위조 revision+변조 bytes/hash, dirty/staged/build 입력/누락, ignored/untracked public/server 입력, 현 server 제외와 독립 Guard 차단, output 변조/실패 시 성공 manifest 미생성을 검증한다.
- `npm run test:game-platform`: 405 pass/0 fail/0 skip.
- `npm run build:assets` 및 committed `index.html assets/build` 무변경, governance/boundary Guard 및 site→shared module link 검사 성공.
- 최종 commit의 full-checkout build/check:publication·base/head governance·exact384 파일별 bytes/정책 보존과 원격 CI는 실제 최종 검증/제출 결과로 인수인계한다. CI 합성 merge revision과 정식 remote head는 구분한다. 실제 Pages public upload/artifact 검증/deploy는 수행하지 않는다.

## P1 판단과 미완료 의무

사용자 2026-10-20 11:48:59 KST 결정은 **고정 M/run39191903797/attempt1/public artifact12160182245**에 한해 기존 browser loaded-resource/cache/SW를 선행조건에서 분리하고 미완료 후속 의무로 유지한 것이다. 별도 `game-platform-vnext-step7d-p1-final-astra-judgment-2026-10-20.md`는 실제 source/build/package/deployment/HTTP 근거를 평가해 변경 범위 증거 충족/최종 승인 가능으로 판단했다. 이번 준비가 그 최종 사용자 결과 승인/완료 기록을 대신하지 않는다.

browser actual bytes·옛 cache/SW 영향은 **UNKNOWN**이다. 고정 M의 기존 실제 package/배포/HTTP 증거는 새 branch revision의 remote artifact·배포·browser·미래 server 지원 증거가 아니다. 신규 server 공개 제외·신규 게임 loaded bytes·Guard fail-closed는 면제하지 않는다. 초기 STEP7D 모델 계획 원문 미확보 상태에서 모델 정책을 추정 복원하지 않았다.

승인 Target/STEP7B §7 전체, main exact382/integration exact384·Core 미이식, H1~4/단일채택·복구/안전11/current A/C/P/hostless·미승인 재대결 예외 금지, STEP4A 수명/모든 완료/T01~03·D0010 current delta·STEP5B results revision/producer-consumer/dedup/merge activation·Profile/B01~12/R01~13·D0006~10 비용/성능/log/삭제·탈퇴/backup 복구·baseline/override/manual gates·원ID/줄/f와 모든 후속 의무를 유지한다.

다음 첫 작업은 **Astra의 정식 고정 remote 제출본 검토**다. STEP7D 전체 미완료·모델/Adapter 미착수·vNext 행동 NOT_RUN·운영 UNKNOWN 유지. 최종 승인/완료·병합·main·설정/dispatch/rerun/실제 upload/deploy·새 방문/게임/DB/browser/audio/두 client/성능/운영 시험·Guard 해제·전수 감사/외부 운영 재조사는 수행하지 않았다.
