# STEP4B — G01·G06 요구 검토와 결정 범위

상태: **요구 검토/결정 질문 제출 / 사용자 답변 미수신 / G01~06 OPEN**. 2026-10-04 KST. 이번 문서는 설계 보완의 첫 입력이며 새 제품 선택·규칙 개정·게이트 해소가 아니다.

시작 HEAD `905f424217a515aa92b0feee4a74d5ced51bcf45`, PR412 OPEN/Draft/미병합, 기존 STEP4B branch 유지. 승인 integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`. CURRENT/CP0049와 감사 결과를 복원했다. 감사 대상 `d2819c02db31f8b4f426d99b8a26c02e622ac46f` 및 당시 정식6문서는 보존한다.

## 이미 정해진 요구와 아직 정하지 않은 값

| 항목 | 저장소에서 정한 것 | 아직 미정 / 이번 질문 |
|---|---|---|
| 플랫폼 목표 | 하나의 플랫폼, 최소Core·선택모델, 기존 게임 무이관 | 새 Core/엔진으로 재설계할지 다시 묻지 않음 |
| 첫 Probe | STEP9A 작은 2D 협동 수직 Slice, 실제 다중 client·재연결·권한·늦은응답·정리 검증 | 구체 조작/속도/표현, 제한 시험의 규모·환경·운영 목표: Q01~04 |
| 첫 Probe 증거 | 자동·수동 2클라이언트 증거 필요 | **2는 최소 증거이지 목표 CCU/방 정원/확장 용량이 아님**. 목표 수치는 Q02 답변 전 공란 |
| 두 번째 Probe | STEP9B 방/host 없는 로컬 또는 비동기·기록형, 첫 Probe와 다른 제약 | local-only 또는 서버 지속 상태/기록 중 어느 쪽을 먼저 검증할지 Q06 |
| 공개 | Probe 서비스 공개·production 활성화는 별도 결정 | 이번에 공개를 승인받거나 실행하지 않음. 첫 검증 대상 환경만 Q02에서 확인 |
| 안전성 | 권한·private·중복·충돌·복원·수명 동등 안전성, 현행DB11개 의무 유지 | 안전성 삭제를 사용자 선택지로 제시하지 않음 |
| 모델 품질 | DB snapshot 모델과 stream 모델 구별, current/history/crash 구별, G01~06 조건 존재 | latency/frequency/bandwidth·staleness·RPO/RTO 등 실제 수치/방식 미확정 |
| 사이트 | 승인회원/프로필 정책, invite 재인가·Registry 표시와 서버권위 분리 | auth bridge·철회/전파·private stream 집행은 G03에서 기술 검토 |
| 재대결 적용 | 기존 보드게임 범위 same-room/ready/host 유지; 새 보드게임에도 계승. 타 장르는 독립 정책 설계 방향 | 첫 온라인 Probe의 사용자 재참여 흐름 Q05; 실제 상위규칙 정합화/승인은 별도 |
| 백엔드/운영 | 신뢰 서버 simulation 방향과 공급자 후보/production 조합 보류 구별 | 공급자·SDK·배포·transport는 Q답변 뒤 G02~05 비교. 지금 브랜드 투표를 요청하지 않음 |

## G06 적용 경계의 구체 검토

계획1.3 §3 계승표와 마지막 개정 비교표는 기존 보드게임의 same-room/ready/host를 보존하면서 다른 장르 정책을 독립 설계하도록 한다. **host 없는 유형을 수용할지 자체는 다시 승인받을 미정 목표가 아니다.** 다만 현행 개발규칙 §10B의 멀티플레이 재대결 문구가 자동으로 개정된 것은 아니다. 승인 STEP2의 S2-R03과 STEP3 S3-C09가 구분한 다음 조건을 적용한다.

| 실제 적용 대상 | 유지할 의무 / 판단 | 이번 상태 |
|---|---|---|
| 기존 게임·기존/신규 보드게임 해당 lifecycle | 기존 코드 무이관, 규칙의 same-room/player·명시적 의사/ready/host·서버 검증 의미 유지 | 사용자에게 삭제 여부를 다시 묻지 않음 |
| 초기 시작만 hostless, 재대결은 현행 의무 충족 | 초기 hostless만으로 규칙 변경 필요라고 단정하지 않음 | 구체 흐름 확인 필요 |
| 멀티플레이 재대결에서도 host가 성립하지 않음 | 독립 장르 정책·동등 안전성 설계 후 상위규칙 변경 범위/영향/승인 명시 | Q05에서 요구를 선택해도 즉시 규칙 변경/지원 완료가 아님 |
| solo/local-only 두 번째 Probe | 멀티플레이 재대결 규칙을 이유로 fake room/host를 만들지 않음 | Q06 및 실제 기능별 적용성 근거 필요 |
| 비동기/기록형 두 번째 Probe | roomless라는 이유로 권한/중복/보존 의무를 면제하지 않음; 다중 사용자 여부도 확인 | local과 같은 비용/복구 범위로 취급하지 않음 |
| 아직 선택하지 않은 미래 장르 | 전체 장르의 정책·성능을 지금 전부 확정하지 않음 | 미지원/미검증 범위와 재검토 조건을 남김 |

따라서 G06은 “모든 게임에 host를 유지할까/전부 없앨까”라는 양자택일이 아니다. 첫 Probe의 실제 흐름과 두 번째 Probe의 local/server 의미를 정한 뒤 적용 범위를 문서로 설명해야 한다. 사용자 답변이 없다면 G06 OPEN을 유지한다. 답변만 받아도 자동 CLOSED가 되지 않으며 조건별 설계·현행 문구 충돌 처리·필요 승인 증거가 뒤따라야 한다.

## G01 품질 목표를 정하는 순서

먼저 사용자가 경험/규모/허용 중단/운영 여건을 정한다. 이후 Work가 그 요구를 측정 가능한 지표와 검증 시나리오로 변환해 제안하고 다시 확인받는다. 사용자가 network tick·p99·권한 세대 구현을 직접 설계할 필요는 없다.

- 동접(CCU)은 같은 시간 접속자, 방 정원은 한 판 인원, 동시 세션은 같은 시간 진행되는 판 수다. 가입자 수·누적 방문자 수와 구별한다.
- 재연결 대기 한도는 사용자 경험, 목표 복구 시간(RTO)은 서버 장애 뒤 서비스 회복, 허용 상태 소실(RPO)은 저장 약속과 관계된다. 확정 결과 소실을 임의 허용하지 않는다.
- 입력/서버simulation/상태송신/화면render 빈도는 다른 값이다. “부드럽게”라는 답을 임의의 tick/latency 수치로 바꾸지 않는다.
- 월 추가 운영비 상한·가동 시간·장애 대응 여건을 먼저 확인한다. 어떤 유료 제품도 지금 구매/가입하지 않고 최신 SKU/가격 비교는 G05 후속에서 수행한다.

## 결정 책임과 G02~05 연결

| 주체 | 지금 할 일 | 답변 이후 필요한 일 |
|---|---|---|
| 사용자 | [Q01~07](step-4b-decision-questions.md)의 경험·적용범위·규모·비용/운영 선호 결정. 모르는 수치는 모름으로 남김 | 기술 제안의 사용자 영향·비용·허용 실패를 확인 |
| Work 설계 검토 | 승인 요구와 미정 분리, 선택지/추천 이유, 질문 우선순위 정리 | G02 SDK/cut/reconciliation, G03 auth/revoke/private, G04 durability/owner, G05 후보/transport/견적 비교와 이유·미확인·검증 계획 제출 |
| 후속 구현/검증 | 이번 미착수 | 승인된 단계에서 H01~10/11안전성/부하·장애 실측. 설계 결정과 실행 PASS 구별 |

질문 답변은 G01·G06 및 G02~05의 요구 입력이다. 이번에 전체 게이트를 닫거나 STEP5A로 넘기지 않는다. 먼저 질문 답변을 받고 해당 범위의 후속 설계 판단·정식반영/검토 경로를 정한다. 기존 감사의 문서 PASS/전체 완료 HOLD 판정은 당시 이력으로 유지한다.

## 고정 근거

아래는 시작 HEAD의 파일/절이다. 검토한 범위 안에서 동접·예산·성능 목표 수치를 찾지 못했으며 저장소 모든 파일에 없다고 전칭하지 않는다.

| 근거 | 고정 원문 | blob |
|---|---|---|
| 최소Core·동등안전성 | [game_platform_vnext_final_execution_plan.md:59–78](https://github.com/limbit95/limbit95.github.io/blob/905f424217a515aa92b0feee4a74d5ced51bcf45/game_platform_vnext_final_execution_plan.md#L59-L78) | `e12ef038913eb6d605709b782f1b73f18e0d1253` |
| 규칙 계승·새 장르 | [game_platform_vnext_final_execution_plan.md:105–128](https://github.com/limbit95/limbit95.github.io/blob/905f424217a515aa92b0feee4a74d5ced51bcf45/game_platform_vnext_final_execution_plan.md#L105-L128) | `e12ef038913eb6d605709b782f1b73f18e0d1253` |
| STEP4B 게이트 | [game_platform_vnext_final_execution_plan.md:291–295](https://github.com/limbit95/limbit95.github.io/blob/905f424217a515aa92b0feee4a74d5ced51bcf45/game_platform_vnext_final_execution_plan.md#L291-L295) | `e12ef038913eb6d605709b782f1b73f18e0d1253` |
| 구현 선결정 경계·Probe1/2 | [game_platform_vnext_final_execution_plan.md:350–373](https://github.com/limbit95/limbit95.github.io/blob/905f424217a515aa92b0feee4a74d5ced51bcf45/game_platform_vnext_final_execution_plan.md#L350-L373) | `e12ef038913eb6d605709b782f1b73f18e0d1253` |
| 기존 보드게임 보존/다른 장르 독립 정책 | [game_platform_vnext_final_execution_plan.md:440–453](https://github.com/limbit95/limbit95.github.io/blob/905f424217a515aa92b0feee4a74d5ced51bcf45/game_platform_vnext_final_execution_plan.md#L440-L453) | `e12ef038913eb6d605709b782f1b73f18e0d1253` |
| 현행 멀티플레이 재대결 | [docs/game-platform-development-rules.md:583–621](https://github.com/limbit95/limbit95.github.io/blob/905f424217a515aa92b0feee4a74d5ced51bcf45/docs/game-platform-development-rules.md#L583-L621) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` |
| 11개 안전성·Data API | [docs/game-platform-db-test-contract.md:15–44](https://github.com/limbit95/limbit95.github.io/blob/905f424217a515aa92b0feee4a74d5ced51bcf45/docs/game-platform-db-test-contract.md#L15-L44) | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` |
| S2-R03 세 조건 | [docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md:104–125](https://github.com/limbit95/limbit95.github.io/blob/905f424217a515aa92b0feee4a74d5ced51bcf45/docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md#L104-L125) | `1c1f103adf56a160f1fba8e993cd7c38bbcf09e8` |
| S3-C02/C09 지원/정책 구별 | [docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md:74–86](https://github.com/limbit95/limbit95.github.io/blob/905f424217a515aa92b0feee4a74d5ced51bcf45/docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md#L74-L86) | `0236dccd268617edf14e6158f582cda9b25b8c8b` |
| J11~13·G01~06·H01~10 | [docs/game-platform-rebuild/artifacts/step-4b-execution-operations-decisions.md:25–70](https://github.com/limbit95/limbit95.github.io/blob/905f424217a515aa92b0feee4a74d5ced51bcf45/docs/game-platform-rebuild/artifacts/step-4b-execution-operations-decisions.md#L25-L70) | `7131d6aad35f896dd8368f2e7bfe60f973ecd655` |
| 고정 감사와 미해소 경계 | [docs/game-platform-rebuild/artifacts/step-4b-post-audit.md:1–15](https://github.com/limbit95/limbit95.github.io/blob/905f424217a515aa92b0feee4a74d5ced51bcf45/docs/game-platform-rebuild/artifacts/step-4b-post-audit.md#L1-L15) | `ebb152b773f4168806b562546712804259373080` |

이번 검토는 저장소 요구·설계 결정 질문에 한정한다. 제품/가격 추천을 새로 확정하거나 외부 제품 조사를 수행하지 않았다. [검증 기록](step-4b-decision-preparation-validation.md).
