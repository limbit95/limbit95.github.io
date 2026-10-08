# CP-0052 — STEP4B 사용자 결정·후속 설계 판단 제출

- 시작 PR412 HEAD `9ff96e8515e8a43d3945ef1fae62777f9282bed4`, 승인 integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`. 기존 branch/base 유지, OPEN/Draft/미병합.
- [CP0051](CP-0051-step-4b-user-decisions.md)과 [사용자 결정](../artifacts/step-4b-user-decisions.md)을 먼저 `244fc33a3b58765821a15aa831ecd0ed1f7b645f`로 원격 저장하고 exact read-back3개 일치 확인.
- 확인 답변: 100명은 로비/관전자 포함, 월3만원은 세금 포함 모든 게임 증분, 사용자 직접 운영 가능. 모바일 필수 범위/지역/월부하는 미정. 수치는 목표, 실제 지원 아님.
- [판단 전체](../artifacts/step-4b-followup-judgment.md) G01/G06→G02→G03→G04→G05, [공식 원문·비용](../artifacts/step-4b-followup-sources-cost.md), [검증](../artifacts/step-4b-followup-validation.md).
- G06은 두 Probe 현행규칙 적용 판단만 해소. G01/G02/G04/G05 PARTIAL/OPEN, G03 권한 bridge/철회 경계 OPEN/BLOCKING. 전체 STEP4B IN_PROGRESS/구현 HOLD.
- 비용: VM+WSS 우선 방향, Lightsail $12는 후보, 최종 제품/SDK/region HOLD. 월 점유시간 모름으로 단일 예상 청구액 불가; 세금/환율 가정과 E1~3 envelope·quota 경계 비교. Supabase Pro 새 증액은 비교 환율 구간에서 예산 초과. 보안/100명/8명 목표 임의 완화 없음.
- 기존 정식6문서/판단/조사/감사/규칙/코드/계획/DECISIONS/과거 checkpoint 보존. 새 정식 반영이나 새 사후 감사가 아님.
- 검증은 문서·계산·blob 보존·Governance 순수 검사와 원격 read-back. 부분 materialization, full checkout/Guard CLI/runtime/unit/build/DB/browser/production/부하 NOT_RUN. CI는 최종 SHA 조회 후 PR에 기록.
- 최종 SHA/tree·PR/integration·read-back 결과는 저장 후 PR본문에 보존. 다음은 사용자 검토와 미해소 기술 설계 범위 지정; 정식 반영·구현·STEP5A·병합·main 없이 정지.
