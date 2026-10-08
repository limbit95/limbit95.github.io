# Game Platform vNext Decisions

이 파일은 `game_platform_vnext_final_execution_plan.md` 개정 1.3의 목표를 새로 정의하는 문서가 아니다. 재구축 과정에서 채택·대체·폐기된 결정을 누적 추적한다.

현재 적용 보완: D0006~09 원문 상태는 채택 당시 이력이다. CP0075/D0010이 Z1의 실제 C 시간 보장과 설계 잔여 상태만 부분 대체하며 계획1.5·CURRENT에서 현재 결과 검토 상태를 확인한다.

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

## D-0008 — G03 운영 장애 범위와 장시간 정지 잔여 위험 수용

- 상태: **USER_ADOPTED_POLICY / DESIGN_BOUNDARY_PENDING / EXECUTION_NOT_RUN**.
- 출처: 2026-10-07 KST 사용자 CP0071 선택1 추천안 명시 채택. 고정 입력 `ef4676cedccbe23205f687fe958d82cf3ad24f00`. [결정/후속 범위](artifacts/step-4b-operating-scope-user-decision.md)·[CP0072](checkpoints/CP-0072-step-4b-operating-scope-adopted.md).
- 결정: 외부 Auth 실제 철회 R부터 C/P 최대5초 차단을 명시된 운영 장애 범위에 적용. 정상 실행·일반 지연/통신 단절/이벤트 유실은 재검증·실패 차단 대상으로 유지한다.
- 수용 위험: 최종 검사 이후 runtime/DB/host 장시간 정지까지 예외 없는5초를 보장하지 않으며 이미 검사된 행동/정보가 늦게 완료될 수 있다. 재개 시 새 작업을 닫고 현재 권한 재검증, 이미 진행 중인 작업 회수는 약속하지 않는다. 동일 정지 한계가 known expiry·인지 실패·60초 집행에도 영향을 줄 수 있다.
- 부분 대체: D0007의 예외 없는 최종 상한 및 after-check 정지 뒤 late C/P 불허 해석을 위 범위에서 대체한다. D0007 원문과 과거 checkpoint는 당시 이력으로 보존한다. D0006 및 D0007의 transport 인계/P 이후 전달 경계·내부 DB 순서·기본 권한/중복/owner/복원 보호는 유지한다.
- 계속 금지: 의도적 만료 유예·실패 인지 후 추가 허가·처음부터 무권한 허가 발급·일반 장애 사후 예외 확대·5초 percentile 전환. 외부철회5초/각재연결5초/장애60초 구분, 최초 장애 deadline의 retry/재시작 초기화 금지 유지.
- 설계 잔여: 정확한 기술적 운영 경계/검증 조건은 Astra 후속 판단. 임의 수치·예외 목록·제품·주기·알고리즘·Auth 교체 채택 아님. 실제 보장 변경이지 설명 정리 아님.
- 한계: 후보 설계 채택·G03/STEP4B 완료·정식 반영·구현·실행/오픈·STEP5A·병합 승인 아님. 구조적 공백을 시험으로 대체하지 않으며 NOT_RUN만으로 설계 전체를 자동 HOLD하지 않는다. 다른 비용/품질/단말/기록/삭제/복구/Free서울/운영 목표 불변.

## D-0009 — STEP4B 구체 수단 선택과 정식 계약·계획 정합화

- 상태: **DESIGN_SELECTION_RECORDED / DESIGN_BLOCKERS_REMAIN / EXECUTION_NOT_RUN**.
- 출처: CP0073 고정 입력과2026-10-07 사용자 ‘S-A·S-B·S-C 설계 확정 및 정식 계약·루트 계획 반영’ 지시. [CP0074 판단](artifacts/step-4b-design-finalization.md).
- 선택: 비노출 fixed SECURITY DEFINER의 전용 EXECUTE caller·보호 DML ticket/guard·단일 native TLS gate·Free서울/Lightsail2GB/DynamoDB 분리 archive 및 Scheduler/Lambda/SNS 조합. 기존 Auth/게임 보존. 최소권한 owner가 실제로 확보됐다는 주장은 대체하고 넓은 definer owner의 제한 capability 책임을 명시한다.
- 부분 대체: CP0073의 S-A~C 미선택 수단을 위 설계로 구체화. 과거 판단·CP는 그대로 보존. D0006~08의 사용자 보장 범위는 변경하지 않는다.
- 한계: Z1 일반 DB 실제commit deadline은 미해결. §7의 보장 변경 추천은 **PROPOSED_NOT_ADOPTED**다. 제품 선택은 구매/배포/추가 요금 승인 또는 실제 성능/복구 보증이 아니다.
- 계획: 개정1.4는 STEP4B 및 연결 설계/실행 게이트만 정합화한다. 22단계·무이관·STEP6 전 구현 금지·별도 병합 승인 유지. 현재 rulebook/code/SQL/운영 권한 변경 없음.

## D-0010 — Z1 동일 transaction의 늦은 commit 수용

- 상태: **USER_ADOPTED_POLICY / FORMAL_REFLECTED / EXECUTION_NOT_RUN**.
- 출처: 2026-10-07 18:32 KST 사용자 “오키 추천안으로 가자” 및 CP0074 고정 입력 `abf44a4c0269cf69173ea5881d8697c948fab8db`에 대한 명시적 반영 지시. [결정/설계 종료 확인](artifacts/step-4b-z1-decision-and-design-closeout.md)·[CP0075](checkpoints/CP-0075-step-4b-z1-adopted-design-closeout.md).
- 결정: 외부 R 후5초 안에 새 보호 행동의 최종 인가·착수 A를 차단한다. 같은 DB finalizer에서 현재 검사를 통과해 저장 처리에 착수한 동일 transaction은 일반 저장 지연으로 실제 C가 늦게 완료될 수 있음을 수용한다. ingress allow/BEGIN/queue는 A가 아니며 무기한 사전 permit·별도 transaction/retry에 예외를 상속하지 않는다.
- 부분 대체: D0007/08의 C 실제 완료5초 상한 중 위 in-progress 일반 저장 지연, CP0074/D0009의 Z1 미해결·미채택 상태. 실제 보장 변경이며 D0008 정지 설명과 동일하지 않다. C 관측점은 실제 commit 그대로다.
- 유지: 새 P5초/최종 transport·recipient/view/payload 검사, 초기 무권한 금지, 실패 인지 즉시 차단/pause·최초60초/정각abort/retry초기화금지, owner/중복/현재 권한/삭제 보호. known expiry 전 A를 지난 동일 transaction의 늦은 C만 수용하며 만료 유예·만료 뒤 새 A는 금지한다.
- 결과: Z1 설계상 해소, 설계 산출물 완료. 단계는 계획§4.2 사용자 결과 검토 때문에 REVIEW_PENDING이다. 이 정책 승인을 전체 결과/병합/STEP5A/구현/실행/오픈 승인으로 확대하지 않는다.
- 계획: 개정1.5에 위 대체와 상태 구분만 반영. CP0074 제품/알고리즘/비용·보존·운영 조건과22단계/기존게임 무이관 유지. 과거 결정 원문은 보존한다.
