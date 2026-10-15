# CP0104 — STEP7D P1 Slice A uploaded artifact gate 제출

2026-10-15 KST. **REVIEW_PENDING / P1 미해소 / 모델·Adapter 미착수 / 실제 행동 NOT_RUN / 운영 UNKNOWN**.

## 입력과 범위

사용자의 2026-10-15 22:39 KST “계속 진행하자”에 따라 cutover 계획의 다음 준비 Slice A만 수행한다. main 분리 경로의 제한 예외는 별도 결정으로 남기고 루트 계획/DECISIONS를 승인된 것처럼 개정하지 않는다. Slice B/main/설정/dispatch/실제 업로드/배포/Guard 해제/모델 구현은 진행하지 않는다.

기준 및 저장 직전 HEAD **50f5ec49cfa5d6932ae29814ab3326bf0a9be5e3**, tree **3e5b43cc1f677b3c2c1824a32fff86acd3f74d9c**. 현재 원격과 같으며 기준 이후 변경 없음 확인. PR424 merge73c9728·PR425 merge50f5 완료; CP0103의 기록 PR 대기는 당시 이력이다. 진행 중 vNext PR/후속 branch가 없어 **chore/game-platform-vnext-phase7d-publication-artifact-gate**를 분기했다. 검토 PR base는 integration; 실제 제출 head/tree/CI는 Git/PR 및 전달 인수인계를 따른다. 추가 병합 기록 PR을 만들지 않는다.

## 변경과 실제 책임

- 기존 publication workflow: attempt별 artifact name, 업로드 ID를 받아 실제 ZIP/tar 검사, 실패 시 dependent deploy 차단, 배포 직전 동일 ID/digest 재검사. same-ref concurrency, actions:read만 추가하고 Pages/OIDC는 기존 deploy job에 유지.
- `scripts/verify-site-publication-artifact.py`: Python 표준 라이브러리 + hosted runner gh CLI. manifest/policy/revision, run/repository/event/branch/attempt, artifact ID/name/origin/digest를 대조. payload를 디스크에 추출하지 않고 tar regular bytes/size/hash와 exact inventory 검사. 정상 부모 directory 외 추가/누락/중복/escape/link/device/sparse/extended metadata/trailing data 차단. 실제 API/다운로드/배포 경로는 이번에 실행하지 않음.
- `tests/game-platform-publication-artifact.test.js` → `tests/fixtures/site-publication-artifact-cases.py`: 기존 Node glob에서 Python 계약13개 발견/실행. 기존 publication workflow gate test도 새 검사 gate3개에 맞춤. docs/site-publication 안내와 CURRENT/README 및 이 checkpoint만 최소 기록.

Pinned upload-pages-artifact action 원문에서 artifact_id output·artifact.tar 포장을 확인했다. deploy-pages action은 ID 입력이 없어 동일 run의 고유 attempt name을 사용하며 직전 identity를 다시 확인한다. 검증 뒤 overwrite/재업로드 step은 없다. GitHub immutable artifact와 검토된 workflow/권한을 신뢰하며 외부 관리자 동시 변경까지 원자적 보장으로 주장하지 않는다. failed-job-only rerun의 attempt 불일치는 fail closed다.

## 검증

새 isolated worktree에 원격 기준 commit을 fetch/checkout했다. 기존 worktree의 사용자 누락 파일은 건드리지 않았다. 이번 worktree의 tracked 입력 전체는 존재한다.

- `npm ci --no-audit --no-fund`: PASS.
- `npm run build:assets` 및 `git diff --exit-code -- index.html assets/build`: PASS, generated runtime bytes 변경 없음.
- `npm run test:game-platform`: **398/398 PASS**, Python fixture13/13 포함. 기존396개와 새 Node 테스트2개이며 Python 개수를 중복 합산하지 않는다.
- publication 관련 Node tests: **19/19 PASS**; Python 별도 verbose13/13 PASS.
- 기존 governance 및 vNext boundary CLI: PASS, server 공개 제외 인증 아님.
- build:publication/check:publication: **384개 PASS**, 정책/기존 public bytes 변경 없음.
- 고정 upload action과 같은 GNU tar 옵션으로 만든 로컬 ZIP/tar를 helper로 검사:384개 PASS. 이 검사는 fixture/로컬 packaging이며 실제 GitHub public artifact 아님.
- 원격 자동 CI는 제출 head에 연결해 별도 확인한다. 수동 dispatch/재실행·실제 Pages 업로드/배포 및 vNext 행동/운영 검증은 NOT_RUN/UNKNOWN이다.

## 보존·검토 범위

기존 consumer cant-stop/no-thanks 및 Legacy 게임은 runtime/API/Registry metadata/barrel/게임별 네 문서 변경 없음; 현재 계약 consumer 유지. 모델 oracle config·Core·Auth/API/SQL·기존 Guard/helper·policy384·asset builder와 outputs 불변. 원본·과거 checkpoint 보존. 이는 Git diff/정적 영향도 판단이며 실제 게임 행동 PASS가 아니다.

승인 Target 및 [STEP7B 계획 §7 전체](../artifacts/game-platform-vnext-step7b-plan-and-handoff.md#7-반드시-유지할-조건)를 그대로 유지한다. 빈 모델/미구현 미지원·runtime/online 차단·기존 online DB 요구·server 제외 미확인 차단·H1~4/단일채택·복구/안전11/current A/C/P/hostless·미승인 재대결 예외 금지·원ID/줄/f/원본·전체 후속 의무 보존. 기존 승인 의미나 provider/운영 구조를 바꾸지 않는다.

Astra 검토 대상: 업로드 artifact identity/bytes 검사와 실패 시 배포 비진입, 기존 gate/Guard/consumer 보존. P1 실제 제외 증거·main 분리 반영·설정·dispatch·배포·Guard 해제는 별도 승인/실행이다. **제출 후 REVIEW_PENDING에서 정지**한다.
