# STEP7D publication checkout — F1/F2 최소 보완

2026-10-20 KST · Sol/Codex · **REVIEW_PENDING**.

## 입력과 범위

- 저장소 밖 `game-platform-vnext-step7d-publication-checkout-proof-final-review-2026-10-20.md` 전체/§4를 읽었다.
- 원 검토 remote head `1e832ff195456ab9f49027853f2102ba07d164b5`, tree `6694a27beb2929b38cac900490cc5069f65138f4`.
- 작업 전 실제 PR429 head는 원 검토 head와 같았고 이후 변경0. 기존 branch
  `chore/game-platform-vnext-phase7d-publication-checkout-proof`, integration base
  `b59994ce6a8435220229a77b52c136a7e6ad9495` 유지. main도 고정 M에서 이동0.
- 사용자 요청은 F1/F2만 최소 수정·관련 검증·최소 기록·commit/push·기존 PR 갱신까지다.
  F1/F2는 이번 검토 발견 번호이며 legacy ID/f를 새로 만들지 않는다.

## F1 — index/worktree 분리 검사

기존 `git diff HEAD`는 staged B와 HEAD 내용 A로 되돌린 worktree가 상쇄되는 경우를 놓쳤다.
HEAD↔index(`diff --cached HEAD`)와 index↔worktree(`diff`)를 각각 검사한다.
기존 관련 HEAD blob/실제 bytes·assume-unchanged 검사, actual root/HEAD/inventory,
untracked/ignored public/server 차단과 generated `.site-publication` 구분을 유지한다.

새 계약은 실제 임시 Git에서 direct diff가 비어도 staged 변경이 남는 사례를 만들고
production build/check 및 checkout 함수가 실패하며 기존 증거가 바뀌지 않음을 확인한다.

## F2 — 최종 검증까지 이전 managed 결과 보존

기존 builder의 파일/정책/참조/bytes 검증은 재사용한다. 내부 쓰기 함수만 분리해
임시 staging에 새 public/manifest를 조립하고 기존 managed 쌍을 staging에 보관한다.
새 쌍 설치 뒤 production actual checkout 최종 검증까지 성공해야 정상 반환한다.
실패하면 이번 새 쌍을 제거하고 이전 쌍을 복원한다. 첫 생성 실패에는 새 쌍이 남지 않는다.
복원 자체의 I/O 실패는 오류로 보고하고 복구 입력 staging을 보존한다. 성공 stdout은 없다.

기존 lower-level `buildPublication`/`verifyPublication` 함수 서명·fixture 의미와
manifest schema1은 유지한다. 최종 검증 callback은 내부 함수만 사용하며 CLI의 주입 입력이 아니다.
read-only check는 결과를 삭제/수정하지 않는다. unmanaged output·symlink/state/evidence 보호 유지.
이는 로컬 generated 결과의 실패 정리이며 원격 artifact 복구/배포 기능이 아니다.

추가 계약3개는 test-only Node preload로 결정적 interleaving을 만든다.
첫 생성의 source/output 변경 실패, 기존 결과 교체 중 source 변경 및 output 검사 후 최종
checkout 재검사 실패에서 새 증거 미잔류/이전 쌍 bytes 복원을 확인한다.
실패한 read-only check의 기존 증거/output 보존도 확인한다. production hook·환경 flag는 없다.

## 검증과 보존

- publication 계약 **30 pass / 0 fail**, 기존 Python16 fixture 포함.
- `npm run test:game-platform`: **409 pass / 0 fail / 0 skip**.
- 기존 governance/boundary Guard·site→shared 78module 연결·build:assets 통과.
  committed index.html/assets/build 변경0.
- commit된 full checkout의 build/check:publication·실제 base/head governance·정책/384개 파일별
  bytes 보존·새 CI는 정식 제출 인수인계의 실제 결과로 기록한다. 과거26/405 PASS는 당시 증거다.
- workflow·production server 존재 차단·public 정책/bytes·consumer/API/Registry 단일 metadata/barrel·
  게임/Auth/API/SQL·원본/과거 CP0107 및 승인 의미는 보존한다. main382/integration384·Core 미이식 유지.

고정 M/run39191903797/attempt1/public artifact12160182245의 별도 P1 증거 판단과 이번 revision을
구분한다. browser/cache/SW UNKNOWN·미완료 후속 의무, 미래 server 실제 제외·신규 게임 loaded bytes,
승인 Target/STEP7B §7 전체·H1~4/단일채택/복구/안전11/current A/C/P/hostless 및 전체 후속 의무 유지.
빈 모델/미구현 조합 미지원·vNext runtime/online 차단·기존 online DB 요구·server 제외 미확인 차단,
미승인 재대결 예외 금지를 유지한다. §4.2 조건부 server 허용이나 모델 정책 복원은 하지 않았다.

다음: **Astra의 새 고정 remote 제출본 재검토**. 최종 승인/완료·병합·main/설정/dispatch/rerun·
실제 upload/deploy·새 방문·실제 모델/게임/DB/browser/audio/두 client/성능/운영 시험·Guard 해제·
전수 감사·외부 운영 재조사는 하지 않았다. 문서/unit/fixture/Guard/CI/local publication은 실제 지원·행동 PASS가 아니다.

**REVIEW_PENDING / STEP7D 전체 미완료 / 모델·Adapter 미착수 / vNext 행동 NOT_RUN / 운영 UNKNOWN.**
