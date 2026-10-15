# CP0101 — STEP7D P1 publication 준비본 정식 검토 제출

기록일: 2026-10-15 KST. **REVIEW_PENDING / P1 미해소 / STEP7D 모델·Adapter 구현 미착수 / 실제 행동 NOT_RUN / 운영 UNKNOWN**.

## 기준과 입력

정식 integration 기준은 `af1e2b4cc3c24a5c72ba64491473be7c0803ee33`, tree `66d3481f250a160bed516a08b28668656bf107a6`이다. PR423 실제 CLOSED/merged=true 및 merge SHA를 확인했다. CP0100/과거 미병합 표기는 당시 이력이며 원본을 수정하지 않는다. 제출 착수 현재 integration은 기준과 identical이다.

기존 `feature/game-platform-vnext-phase7d-model-adapter`에서 작업하며 PR base는 `feature/game-platform-vnext-integration`이다. 원격에 없던 같은 이름의 branch를 정식 push한다. 로컬 이전 동등 tree의 b60b8d17 identity와 정식 merge identity를 구분했으며, 원본 commit bytes/SHA를 검증하여 이번 로컬 parent도 실제 기준 af1e2b4로 연결했다. 정식 remote head/tree·PR·CI는 실제 Git/PR 및 제출 인수인계로 식별한다. 이 파일에 자기 commit SHA를 선기입하지 않는다.

저장소 밖 전달 입력 3개를 전체 읽었다: `game-platform-vnext-step7d-p1-publication-preparation-2026-10-15.md`, 같은 basename의 `.patch`, `game-platform-vnext-step7d-p1-publication-review-2026-10-15.md`. 검토 patch SHA-256은 `df5a69aa340260c4ab3b7e9e2ea427196aeed6a78acd9e97cba310437d2331c0`이다. Astra는 검토 PR 제출 차단 결함을 발견하지 않았으나 실제 배포/P1 해소 승인이 아님을 명시했다.

## 제출 범위와 실제 경계

검토된 publication **9파일의 구현·계약 diff는 그대로** 유지한다. `scripts/build-site-publication.mjs`, exact `scripts/site-publication-files.json`, publication 계약 tests, 준비 workflow, asset builder/build manifest 입력 기록, npm 명령·ignore·게시 안내다. 추가 변경은 이 CP와 CURRENT/rebuild README의 최소 현재 기록 3파일뿐이다. 새 Guard/helper·server 파일·모델/Adapter·의존성/API/Registry metadata/barrel 변경은 없다.

별도 `.site-publication/public`에 선택한 384개 public 파일만 조립하고, 공개 밖 evidence의 exact inventory/크기/SHA-256 및 동일 source bytes를 다시 검사한다. 일반 source/output symlink, server 동일 bytes alias·browser 참조, 누락/추가/변경된 output, bundle input/output 불일치를 실패 처리한다. 기존 해시 entry/45개 outputs 및 앱/게임 자산 bytes는 그대로이고 build manifest에 실제 입력58개만 기록한다.

현재 관측 Pages publisher는 **Deploy from a branch / main / (root)**다. 기존 성공 run36669119022는 main69a7fcb2와 root `.` upload를 연결한다. 기존 보존 근거를 재사용하며 운영 설정을 다시 조사하거나 바꾸지 않는다. 새 workflow는 미적용 제안이며 PR에서는 검증만 한다. Pages package/deploy 두 단계 모두 명시적 main `workflow_dispatch`와 `publish: true`가 필요하고 기본 false다. PR의 CI evidence artifact는 검증 기록이며 실제 Pages public artifact 업로드·배포가 아니다. 기존 server 존재 차단 Guard를 면제하지 않는다.

저장소 내부 docs/tests/scripts/SQL/template/archive/source map은 제안 public artifact에서 제외한다. 기존 앱·게임 runtime 경로 보존과 과거 우연히 공개됐던 내부 파일 URL 보존을 혼동하지 않는다. content hash가 바뀌면 exact policy도 site publication owner가 함께 검토·갱신해야 한다.

## full checkout 및 검증

기준의 생략 tracked 파일338개를 exact blob/SHA로 복원하여 **1074개 tracked 파일 모두** 확보했다. skip-worktree를 해제하고 baseline bytes를 대조했다. 복원은 원본 파일의 자료화이며 SQL/source 내용 감사나 수정이 아니다. 기존 immutable canonical 검사에 필요한 historical blob도 SHA로 복원한다.

- `npm ci --no-audit --no-fund`, `npm run build:assets`: PASS. 의존성/lock 변경 없음, 기존 해시 entry 유지.
- `npm run test:game-platform`: **396/396 PASS**, 실패0/skip0. 이 안에 publication17개가 포함된다.
- `npm run build:publication` / `npm run check:publication`: **384개 PASS**.
- 기존 web-push/signup/admin/activity/The Game/Marble unit 명령: PASS. 기존 fixture/unit이며 실제 모델/게임 행동 PASS가 아니다.
- repository governance·vNext browser/server/static Guard, site static(76JS), community module(78)·Liar module(34) 연결, community API 경계·명시 select·Liar canonical pinned blob 검사: PASS. 앞서 파일 누락 때문에 완료하지 못했던 site/Liar 검사는 이번 full checkout에서 통과했다.
- 검토 patch 역방향 적용 검사·diff whitespace 및 구현9파일 보존 확인. 실제 base/head Governance와 원격 CI는 정식 제출 head에서 구분해 확인한다.

원격 CI 결과는 GitHub의 해당 제출 head에서 별도로 확인하며 이 기록을 CI PASS로 사용하지 않는다. 기존 자동 CI의 isolated fixture/browser/DB 결과도 vNext 실제 행동이나 운영 지원 검증으로 승격하지 않는다. 별도 workflow dispatch, 실제 게임/DB/browser/audio/두 client/성능/운영 시험을 실행하지 않는다.

## 미해결·보존·다음 작업

**P1은 미해소**다. 실제 main 반영·Pages source 전환·같은 commit/run/public artifact/deployment의 연결 및 server 제외 증거는 후속 별도 승인/실행 범위다. 이 준비본·unit/Guard/CI·tar fixture 성공으로 Guard 해제나 모델 구현에 진입하지 않는다. static literal 검사로 arbitrary dynamic URL·CDN·변환 코드 provenance·service-worker cache/loaded bytes를 전부 입증하지 않았다.

승인 Target과 [STEP7B 계획 §7 전체](../artifacts/game-platform-vnext-step7b-plan-and-handoff.md#7-반드시-유지할-조건), 빈 모델/미구현 조합 미지원·vNext runtime/online 차단·기존 online DB 요구·server 제외 미확인 차단을 유지한다. H1~4/단일 채택·복구/안전11/current A/C/P/hostless·미승인 재대결 예외 금지 및 전체 후속 의무, 기존 consumer/API/Registry 단일 metadata/barrel·게임/Auth/API/SQL·game-local 네 문서·원본/원ID/줄/f/단일 owner·과거 기록은 보존한다.

다음 첫 작업은 **Astra의 고정 정식 remote 제출본 검토**다. STEP7D 최종 승인/완료·main/integration 병합·Pages 설정·실제 public 업로드/배포·server/모델/Adapter 구현·STEP8 이후·전수 source/SQL 감사·외부/운영 재조사·별도 사후 감사는 진행하지 않는다. 실제 행동 **NOT_RUN**, 운영 **UNKNOWN**.
