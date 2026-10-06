# Game Platform vNext Decisions

이 파일은 `game_platform_vnext_final_execution_plan.md` 개정 1.3의 목표를 새로 정의하는 문서가 아니다. 재구축 과정에서 채택·대체·폐기된 결정을 누적 추적한다.

## D-0001 — 하나의 통합 게임 플랫폼

- 상태: **ADOPTED_FROM_PLAN**
- 출처: 실행 계획 개정 1.2 §1~2
- 결정: 신규 게임은 하나의 상위 게임 플랫폼 아키텍처 안에서 개발한다. 장르별 규칙은 하위 규칙이며 장르별 별도 플랫폼/Core를 만들지 않는다.
- STEP 0 변경 여부: 없음.

## D-0002 — 기존 규칙의 조항별 계승

- 상태: **ADOPTED_FROM_PLAN**
- 출처: 실행 계획 개정 1.2 §1, §3
- 결정: 기존 게임 구현 코드는 참고/회귀 대상이지만, 기존 플랫폼 개발 흐름·품질 기준·보드게임 상세 규칙은 적용 범위와 의도를 유지해 조항별로 계승한다.
- STEP 0 변경 여부: 없음.

## D-0003 — 기존 구현 게임 무이관

- 상태: **ADOPTED_FROM_PLAN**
- 출처: 실행 계획 개정 1.2 §1, STEP 8
- 결정: 기존 게임을 vNext 구조에 맞춰 migration하지 않는다. 공유 경계 변경의 영향도는 감사하되, `MIGRATION_REQUIRED`가 나오면 기존 게임을 고치기보다 vNext 격리/스코프/버전 경계를 재검토한다.
- STEP 0 변경 여부: 없음.

## D-0004 — vNext integration 누적 운영

- 상태: **ADOPTED_FROM_PLAN**
- 출처: 실행 계획 개정 1.3 §4, STEP 0 및 사용자 승인
- 결정: vNext 재구축은 `feature/game-platform-vnext-integration`에 사용자 승인된 STEP 결과를 순서대로 누적한다. 각 STEP은 별도 작업 브랜치와 integration base PR을 유지하며, STEP PR의 integration 병합과 최종 integration → main 반영은 별도 승인으로 구분한다.
- 범위: 이번 `game-platform-vnext` 재구축 작업에 한정한다. 저장소 전체의 신규 기능 개발 금지나 일반 브랜치 Governance로 확대하지 않는다.
- 기준선: integration 최초 생성 기준 main은 `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`.
- STEP 0 적용 당시: 기존 `docs/game-platform-vnext-phase0-bootstrap`과 PR #404를 유지하고 PR base를 integration으로 변경했다. 개정 1.3 채택 당시 STEP 0은 미병합 상태였으며, 이후의 실제 진행·승인·병합 상태는 `CURRENT.md`와 checkpoint에서 추적한다.

## STEP 0 메모

사전 검토에서 확인한 STEP 9B 실행 주의사항은 **새 아키텍처 결정이 아니므로 이 결정 목록에 별도 decision으로 추가하지 않는다.** 해당 내용은 `CURRENT.md`와 STEP 0 checkpoint에서 실행 계획 1.3의 기존 규칙을 적용할 때의 해석상 경계로 보존한다.

## D-0005 — STEP4B 기본 시험 브라우저 조합

- 상태: **USER_ADOPTED_TEST_SCOPE / EXECUTION_NOT_RUN**
- 출처: 2026-10-06 사용자 Windows10/11·개인 iPhone iOS18.7.8 제공 및 “추천대로 해줘”.
- 채택: Windows10·11 Chrome/Edge, iPhone Safari를 기본 시험 대상으로 준비한다.
- 한계: exact OS/browser build·iPhone 모델·각 PC 접근/사양은 미확인. 다른 단말 지원 제외 정책,표본 수/시간·p99/tick/queue 기준 승인으로 확대하지 않는다.
- [CP0061 사용자/관측](artifacts/step-4b-operations-device-usage-evidence.md),[후속 준비](artifacts/step-4b-support-followup-preparation.md). 운영 대응시간은 가용성 정보이며24/7 지원 약속이 아니다. G03/전체 구현 HOLD와 확정 안전성·품질·비용 목표 유지.

## D-0006 — G03 설계 승인과 오픈 전 실행 검증 분리

- 상태: **USER_ADOPTED_POLICY / DESIGN_AMENDMENT_PENDING / EXECUTION_NOT_RUN**.
- 출처: CP0067 `d9227be38a05c9ebe1097d397a2ac30d090a4b98`의 두 변경안 설명 후, 2026-10-07 07:07 KST 사용자 “응 그러자”. [제안 당시 문서](artifacts/step-4b-g03-practical-scope-proposal.md)·[채택 CP0068](checkpoints/CP-0068-step-4b-g03-practical-scope-adopted.md).
- 결정: 설계에서는 모순 없는 구체 구조·차단 방식·시험 계획을 확정하고, 실제 안전성·성능은 허용된 구현 단계에서 시험하여 오픈 전에 증명한다. 설계 적합성과 실행 지원/출시 blocker를 별도 상태로 추적한다.
- 대체 범위: 실행 시험 NOT_RUN만으로 설계 완료를 무조건 막던 G03 검토 방식. 구조적으로 불가능하거나 공식 지원 전제가 부족한 부분을 나중 시험으로 넘기는 것은 허용하지 않는다.
- 한계: 이번 결정만으로 G03/STEP4B 완료·정식 반영·구현·STEP5A·병합·오픈 승인 없음. 계획/정식 문서와의 명시적 정합화는 후속 보완 범위이며 이번에는 원문을 보존한다. STEP6 전 공통 runtime 금지와 기존 무이관 유지.

## D-0007 — G03 외부 철회 차단 상한과 정보 제공 경계

- 상태: **USER_ADOPTED_REQUIREMENT / IMPLEMENTATION_SUPPORT_NOT_PROVEN**.
- 출처: D-0006과 같은 두 변경안에 대한 명시적 사용자 동의.
- 결정: 외부 managed Auth/direct API/console/logout·사용자 삭제·외부 session 철회의 실제 효력 R부터 대상 session의 보호 행동 반영과 새 정보 제공을 **최대5초 이내** 차단한다. 그 구간에 제한된 잔여 접근이 가능하다는 위험을 수용한다. global/local/others의 해당 대상은 구분한다.
- P 경계: 서버가 통제하는 최종 송신 경계에서 되돌릴 수 없는 transport 인계 시점을 정보 제공 완료로 정한다. 그 이후 OS/TLS/네트워크의 지연 전달·재전송은 회수 보장하지 않는다. 취소 가능한 app queue나 snapshot 생성은 완료 경계가 아니다. 실제 transport별 인계 지점은 후속 설계/시험에서 특정한다.
- 대체 범위: CP0053~66의 모든 외부 R 직후 불허 C/P 0 및 actual-egress/in-flight까지의 엄격한 회수/차단 보장 중 위 범위. 과거 A안 전체가 그대로 유지된다고 표시하지 않는다. 나머지 현재 권한·DB 권위·중복/owner·복원 보호는 유지한다.
- 유지: 권한 확인 실패를 알게 되면 보호 입력/정보 즉시 차단·판 pause·최초 장애60초 중단. 이미 알려진 JWT 만료 이후 새 유효 검증 없이 계속 허용하지 않는다. 처음부터 무권한인 타인 정보 접근을5초 허용하는 정책이 아니다. 통제 가능한 사이트 내부 승인/역할 변경의 DB 순서 보호도 유지한다.
- 한계: 5초는 새 확정 요구이며 실제 달성/공급자 SLA가 아니다. 각 재연결5초와 별개이며 percentile 기준이 아니다. check→pause→무기한 늦은 apply/send는 계속 불허. 알고리즘·주기·제품·Auth 교체·기존 게임 이관 채택 없음. 오픈 전 전체 경로/실제R/최종인계/old owner 증거 필요.
- 다른 목표: 100명/판8·세금포함월3만원·p95 250ms·각 재연결5초·모바일·기록열람/30일삭제/탈퇴연결제거·외부backup/RPO24h/발견후24h/7일복구점·Free서울·운영조건 변경 없음.
