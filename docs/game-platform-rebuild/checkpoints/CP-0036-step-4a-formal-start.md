# CP-0036 — STEP 4A 가이드4 정식 반영 착수

이전: [CP0035](CP-0035-step-4a-judgment-complete.md). STEP4A IN_PROGRESS / 가이드4 진행.

## 범위와 실제 복원

사용자 2026-10-02T14:34:06+09:00 “다음 단계 진행하자”. 첨부 가이드 순서4 Work Sol 정식 산출물 반영·검증·기록·원격 제출만 허용한다. 다음 순서5 감사·4B·병합은 별도다.

- AGENTS→계획1.3→기록 README→실제 원격→CURRENT/CP0035를 복원했다. 계획 blob `e12ef038913eb6d605709b782f1b73f18e0d1253`.
- integration `ad7655a051f0dbb13444eec6f469f6f98f9794f4`, PR410 MERGED. PR411 OPEN/Draft/merged=false, base integration, 기존 branch `docs/game-platform-vnext-phase4a-evidence-preparation`.
- 판단 입력/시작 head `36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd`, tree `09f1d49d760af4f3d52954b8fd809740ac7ab226`. [판단](../artifacts/step-4a-astra-judgment.md) blob `b471f4c3c6a45976f2a08008d2263102886c6959`.
- [출처 검토](../artifacts/step-4a-research-verification.md) blob `cb08c6531dbdb1c4efe108910583d0ec1d8bd896`·[조사 원본](../artifacts/step-4a-auxiliary-research-report.md) blob `b034af1639ae3c94c80373623f856c48517c0c9d`을 다시 받았다. 가이드3 완료는 실제 원격 입력으로 확인했다.

## 완료·미완료·다음 첫 작업

완료: 기준 복원·허용 범위/보존 대상 확정. 미완료: 정식 책임/의존·수명/전환·충돌/회귀/후속 반영, trace/검증·최종 제출. 다음은 판단 §1~9 전체를 제한까지 보존해 정식 문서로 나누고 정확한 절 대응을 검사한다.

이번 착수 기록/CURRENT/분담을 기존 branch에 보존한다. 자기 commit SHA는 저장 후 다음 checkpoint에서 기록한다. 전체 checkout이 아닌 선택 파일 materialization 상태이므로 local clean/full Guard PASS를 주장하지 않는다. 기존 코드·규칙·계획·판단/조사 원본·승인 STEP1~3·과거 checkpoint·DECISIONS는 수정하지 않는다. runtime/unit/build/DB/browser/production 미실행.
