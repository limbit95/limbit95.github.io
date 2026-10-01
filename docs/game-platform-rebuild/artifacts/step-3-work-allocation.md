# STEP 3 — 작업 분담과 진행 체크

- 기준: 계획 1.3 STEP 3 / integration `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`.
- STEP branch: `docs/game-platform-vnext-phase3-stress-preparation`. 현재는 **Work Sol 근거 준비 완료 / STEP 3 IN_PROGRESS**.
- 결과 승인·integration merge 승인·main 반영 승인 없음. Astra 판단·정식 matrix 미수행.

## 진행 체크

- [x] PR409 병합·integration HEAD·CP0017 계보 확인
- [x] STEP 3 전용 브랜치 생성·착수 기록
- [x] 11개 사례·6개 시나리오 요구/근거/미확인 준비
- [x] 일반 채팅 Sol5.6 전달 자료·요청문 준비
- [x] 준비 산출물·착수 기록의 로컬 trace/링크/범위/상태 검증
- [ ] candidate commit Governance·원격 보존 — 결과는 검증 기록/최신 checkpoint
- [ ] integration base Draft PR 제출·read-back — 실제 PR 번호는 CURRENT/최신 checkpoint
- [ ] 사용자 보조 조사 활용/전달
- [ ] Work Astra 핵심 판단
- [ ] Work Sol 정식 산출물 반영·검증·제출
- [ ] Work Astra 사후 감사·필요 보완 재검토
- [ ] 사용자 결과 승인·integration 병합 승인

## 모델별 순서

| 순서 | 담당 | 입력 | 산출물 / 검토 지점 |
|---|---|---|---|
| 1 | Work Sol 6.1 / Codex | 최신 integration·계획·STEP1/2 | evidence brief·source trace·조사 입력. 지원/Core 판정 없음 |
| 2 | 일반 채팅 Sol 5.6, 필요 시 | 조사 입력·기존 STEP2 조사·요청문 | 비교표·공식 링크/근거 위치·사실/추론/미확인·Astra 쟁점. 저장소 접근 가정 없음 |
| 3 | Work Astra | 계획·brief·전달된 조사 | 정식 matrix·6개 시나리오·Core/충돌/회귀 판단. 근거 부족·불일치 주장 원문 선택 확인 |
| 4 | Work Sol / Codex | Astra 판단 전체 | 문서 반영·기록·검증·원격 제출. 단계 완료/지원 상태 과장 없음 |
| 5 | Work Astra | 최종 제출 SHA·diff·검증 | 누락/의무 약화/후속 단계 선행 확정 감사; Sol 보완 후 집중 재검토 |
| 6 | 사용자 | 최종 산출물·감사·PR | 결과·integration 병합 승인. main/다음 STEP은 별도 지시 |

보조 조사는 필수 절차가 아니다. 이번 준비에서는 시간/동기화/정보 격리의 추가 질문을 마련했으며 사용 여부와 결과 전달은 사용자 다음 행동이다. 활용 계획이면 결과 전달 후 Astra 핵심 판단을 진행한다. 전수 리딩·중복 조사 대신 원문 추적을 유지한다.

## 다음 첫 행동

사용자가 [조사 입력](step-3-auxiliary-research-input.md)과 [요청문](step-3-auxiliary-research-request.md), 필요 시 기존 STEP 2 조사 메모를 일반 채팅 Sol5.6에 전달한다. 보고서를 Work 방에 전달한 뒤 Astra 판단을 별도 지시한다. 보조 조사를 생략하려면 그 선택과 미확인 근거를 남기고 Astra 판단을 별도 지시한다. 이번 준비 작업에서 자동으로 어느 경로도 실행하지 않는다.

현재 브랜치/PR을 계속 사용한다. 채팅방·모델 변경만으로 새 브랜치를 만들지 않는다. runtime·API·계약·물리 경로는 선결정하지 않는다. [근거 brief](step-3-evidence-brief.md) · [검증](step-3-preparation-validation.md)
