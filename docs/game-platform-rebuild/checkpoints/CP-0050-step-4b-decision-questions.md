# CP-0050 — STEP4B G01/G06 요구 검토·결정 질문 제출

- 사용자 허용: G01~06 설계 보완 착수 중 이번에는 저장소 확정 요구와 사용자 결정 항목 구분, G01/G06 우선 검토, 선택지/추천 이유를 담은 질문 원격 제출까지
- 실제 복원: PR412 OPEN/Draft/merged=false, 입력 HEAD `905f424217a515aa92b0feee4a74d5ced51bcf45`, tree `88892235085f38db9c639001be3af538648daac9` 952 entries/truncated=false. 승인 integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82` 유지
- 이전 최신 [CP0049](CP-0049-step-4b-post-audit.md). 기존 STEP4B branch `docs/game-platform-vnext-phase4b-evidence-preparation`, base `feature/game-platform-vnext-integration` 유지. 필수 진행6문서 재조회, 시작 로컬128파일 blob 일치
- [요구 검토/고정 근거](../artifacts/step-4b-requirements-review.md), [사용자 결정 질문Q01~07](../artifacts/step-4b-decision-questions.md), [검증](../artifacts/step-4b-decision-preparation-validation.md)
- 이미 결정: 첫 Probe 작은2D협동·실제2클라이언트 증거, 두 번째 room/host없는 local 또는 비동기/기록형, 최소Core/기존게임무이관/동등안전성. 2클라이언트는 목표CCU 아님
- G06 구체화: 기존/신규 보드게임 해당 의무 유지, 새 장르 독립정책 방향은 계획에 있음. 초기hostless/재대결hostless/solo/정책미정 구별. 상위규칙 변경 자동 승인 없음
- 질문 우선순위: Q01 경험·Q05 재대결·Q06 두 번째Probe 범위 → Q02 규모·Q03 환경·Q04 운영/비용 → Q07 장애/보존. 모든 답변 UNANSWERED, 추천안 미채택
- G01~06 OPEN, 수치/정책/제품 미확정. 감사 대상 `d2819c02db31f8b4f426d99b8a26c02e622ac46f`와 감사 제출/결론은 이력으로 보존; 이번 새 감사/정식계약 보완 완료 아님
- 이번6경로: 신규 검토/질문/검증3문서+CP0050, CURRENT/분담 수정2. 정식6문서·판단/조사/감사 원본·승인STEP1~4A·규칙/코드/계획·DECISIONS·과거checkpoint 불변
- 실제 최종 SHA·원격 read-back·tree·CI는 PR본문/제출 응답에 기록. 다음 첫 행동은 사용자 질문 답변 수신 후 요구/상충 확인, 이어서 허용된 후속 설계 범위 지정
- 이번에는 질문 제출 뒤 정지. 구현·STEP5A·병합·main 반영 없음. runtime/DB/browser/부하/제품 견적 검증 NOT_RUN
