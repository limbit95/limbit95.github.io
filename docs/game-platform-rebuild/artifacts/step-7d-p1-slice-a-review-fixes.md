# STEP7D P1 Slice A — F1 review fixes

2026-10-16. **REVIEW_PENDING / P1 미해소 / 모델·Adapter 미착수 / 실제 행동 NOT_RUN / 운영 UNKNOWN**.

## 입력·범위

Astra의 game-platform-vnext-step7d-p1-slice-a-final-review-2026-10-16.md 전체를 읽고 §4 F1만 보완한다. 사용자 요청은 기존 PR #426 / chore/game-platform-vnext-phase7d-publication-artifact-gate에서 최소 수정·검증·commit/push·PR 갱신·재검토 제출까지다.

착수 시 remote head b604c33228cb21a72950cbf9610f71ce83671b15, tree b139d5b598fb4bb99107fb3964f57dac511c7cbb; integration base 50f5ec49cfa5d6932ae29814ab3326bf0a9be5e3이며 원 검토 이후 변경 없음. 로컬262add79는 같은 tree/다른 commit identity이므로 정식 부모는 remote b604로 유지한다. 새 remote head/tree/CI는 PR와 전달 인수인계에 기록한다. CP0104와 과거 승인/기록은 당시 이력으로 보존한다.

## 원인·최소 보완

tarfile이 directory의 trailing slash를 제거해 원본 '/'를 빈 이름으로 만들고, 기존 safe_path도 빈 directory를 정상 root로 허용했다. 다운로드 ZIP 안의 실제 tar raw header를 읽어 name이 비어 있거나 절대경로이면 거부하고, prefix/name 조합을 검사한 뒤 parser 경로와 일치하는지 확인한다. 정상 root는 '.'와 './'만 허용하고 정상 부모 directory를 보존한다.

- helper: 기존 raw type 검사를 512-byte 원본 header 읽기로 확장. 경로 외 identity/digest/deploy 조건·format 제한은 유지.
- Python fixture: checksum을 재계산한 실제 tar header에서 기존 root를 '/', '////', 빈 이름, './/'로 교체. '.'/'./'와 prefix를 가진 정상 부모 directory는 통과. 절대/상위 prefix·절대 name·빈 name+prefix는 거부.
- 기존 Node discovery/CI/workflow는 변경하지 않는다. 새 dependency·공개 runtime API 없음.

수정 전 새 fixture 실행에서 5개 subcase가 기대한 거부 없이 통과하여 실패했고, 수정 후 16개 Python test가 모두 통과했다. 이는 로컬 계약 재현이며 실제 공격/업로드/배포/게임 행동 시험이 아니다.

## 검증

- Python fixture: 16/16 PASS.
- publication Node: 19/19 PASS, Python16 포함.
- npm run test:game-platform: 398/398 PASS. Python subtests를 Node 합계에 더하지 않는다.
- 기존 governance/boundary CLI: PASS.
- build:publication/check:publication: exact384 PASS.
- 로컬 GNU tar → ZIP → 수정 helper: exact384 PASS. 실제 GitHub Pages artifact 아님.
- diff whitespace 검사: PASS. 기존 dependency 설치를 재사용했다.
- 원격 자동 PR CI는 새 remote head를 기준으로 확인한다. 실제 upload/원격 artifact 검사/deploy는 PR 조건상 skipped이며 fixture/CI PASS로 대체하지 않는다.

## 보존·후속

변경은 helper/Python fixture/게시 안내/현재 진입 기록/이 보완 근거에 한정한다. workflow·Guard·policy384·builder/generated assets·Core·기존 consumer/API/Registry metadata/barrel·게임/Auth/API/SQL·game-local 네 문서·원본·과거 checkpoint는 변경하지 않는다.

승인 Target 및 [STEP7B 계획 §7 전체](game-platform-vnext-step7b-plan-and-handoff.md#7-반드시-유지할-조건), 빈 모델/미구현 미지원·runtime/online 차단·기존 online DB 요구·server 제외 미확인 차단·H1~4/단일채택·복구/안전11/current A/C/P/hostless·미승인 재대결 예외 금지·원ID/줄/f/원본·전체 후속 의무를 유지한다. F1 보완은 P1 해소나 모델 지원 선언이 아니다.

다음은 Astra의 새 고정 remote head 재검토다. 최종 승인/완료·병합·main·Slice B·설정/dispatch·실제 업로드/배포·Guard 해제·모델 구현·실제 행동 시험은 수행하지 않는다.

