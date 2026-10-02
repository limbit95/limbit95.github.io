# CP-0037 — STEP 4A 정식 반영·1차 검증

이전: [CP0036](CP-0036-step-4a-formal-start.md). STEP4A IN_PROGRESS / 가이드4 반영 완료·최종 제출 진행.

## 실제 원격 착수와 완료

착수 기록 commit `c91a76e7d46ab53f9c6e5b761472e8aec895e6ea`, tree `de3672f9706180887689c353b4de8c8acae920d2`를 기존 branch/PR411에 보존했다. 입력 판단 SHA `36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd`·blob `b471f4c3c6a45976f2a08008d2263102886c6959`는 불변이다.

- 정식 [책임/의존](../artifacts/step-4a-responsibility-boundaries.md) §1~4, [수명/전환](../artifacts/step-4a-lifetime-contract.md) §5~8, [충돌/후속](../artifacts/step-4a-risks-and-followup.md) §9를 원문 그대로 반영했다.
- [trace](../artifacts/step-4a-contract-source-trace.md): 9절 대응 줄·고정 source33·선택 조항10·T01~03/C09/C11/리스크/후속 연결. [검증](../artifacts/step-4a-validation.md)은 재현 방법과 미실행을 기록한다.
- 최초8문서 검사: exact9절·source33 hash/줄·조항10·링크110/표11·상태22/과거 CURRENT 이력/공백 오류0. 이 checkpoint가 추가된 후 최종 문서 범위 검사를 다시 한다.
- 고정 Governance 입력22파일·원격 inventory로 RepositoryState/DocumentPolicy 및 변경분 분류 실행 오류0. full Git 수집/Guard CLI는 NOT_RUN이며 함수 검사와 구분한다. runtime/unit/build/DB/browser/production NOT_RUN.

## 미완료·다음 첫 작업

이번 반영·중간 기록을 기존 STEPbranch에 저장하고 전체 tree·파일 read-back과 CI 상태를 확인한다. 다음은 최종 제출 기록/CURRENT/분담을 갱신하고 최종 HEAD를 다시 대조하는 것이다. 최종 SHA를 자기 문서에 미리 확정하지 않는다.

가이드5 사후 감사·STEP 승인·4B·병합 미수행. 판단/조사 원본·준비 trace·승인STEP1~3·기존 코드/규칙/계획·과거 checkpoint·DECISIONS 불변. 정식 문서 반영은 현재 실행 규칙 변경·구현 지원·Target 동결 승인이 아니다.
