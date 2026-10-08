# STEP4B — Z1 사용자 결정과 설계 산출물 종료 확인

2026-10-07 KST. 담당 Sol/Codex. 고정 입력 CP0074 `abf44a4c0269cf69173ea5881d8697c948fab8db`, tree `4f076b178ce55de17a98c03eebd9daba6d4919fe`. 시작 PR412 HEAD 일치/추가변경0. 기존 branch와 integration base를 유지한다.

## 1. 결정과 판정

사용자의18:32 KST “오키 추천안으로 가자” 및 이번 명시적 반영 지시를 D-0010으로 보존한다. **최종 인가·착수한 동일 DB transaction의 일반 저장 지연에 따른 늦은 commit을 수용한다.** 실제 C 완료 시각의5초 상한을 이 범위에서 부분 변경한 것이며 D0008의 실행 정지 설명을 반복한 것이 아니다.

**Z1은 설계상 해소, STEP4B 설계 산출물은 완료하여 REVIEW_PENDING으로 제출한다.** CP0074가 특정한 필수 설계 잔여는 Z1 하나였고 이번 승인으로 그 계약을 정합화했다. 새 구조를 선택하거나 공급자 보장을 만들어 해결하지 않았다. 루트 계획§4.2는 사용자 검토가 남으면 REVIEW_PENDING을 요구하므로 STEP 전체 COMPLETED/사용자 최종 결과 승인/병합 완료로 표시하지 않는다. 실행 지원·오픈은 미승인이다.

## 2. 최종 인가·착수 A와 실제 commit C

이 문서의 A는 관측용 사건 이름이며 이전 설계안 A/B의 A가 아니다. CP0074의 DB finalizer 안에서 **필요한 anchor/owner/command 잠금을 확보한 후 현재 predicate를 검사하고, 허용된 하나의 command를 같은 transaction의 저장 처리로 받아들이는 지점**이다. ingress allow·BEGIN·함수 호출 도착·queue enqueue 자체는 A가 아니다.

- 검사 입력은 검증 subject/session, current user/session/expiry, 승인/permission, match/view/action, owner/incarnation, command ID와 payload hash다. CP0074의 private 함수/전용 caller/전체 writer 경계를 그대로 적용한다.
- 잠금·queue 대기는 A 전에 둔다. 검사 후 착수 전에 대기하거나 제어가 반환되면 이전 allow로 착수하지 않고 현재 권한/기한을 다시 검사한다. 앱에 재사용 가능한 permit을 반환한 뒤 별도 transaction으로 적용하는 방식은 불허다.
- A는 finalizer가 검사를 통과한 명령의 고정 저장 절차로 진입하는 사건이다. 같은 실행 경로에서 state/revision/중복 원장/필요 outbox를 처리한다. 일반 I/O 지연은 그 후 동일 transaction의 처리/commit 완료에 한정한다. 다른 command를 끼워 넣거나 추가 보호 작업을 무제한 수행하는 권한이 아니다.
- 최종 검사 이후 입증된 runtime/DB/host 실행 정지는 기존 D0008 범위로 별도 기록한다. 일반 지연을 정지로 재분류하지 않는다. 최종 검사 전 정지·재개 후 새 작업은 fresh 검사 대상이다.
- A에서 owner anchor를 잡고 C/rollback까지 유지한다. 내부 writer·owner 교체는 같은 anchor와 gate close/drain 순서를 지켜야 한다. owner 교체 commit 뒤 old owner가 새 저장을 착수하는 허가는 없다. 외부 Auth의 시간 경계 완화로 내부 writer 직렬화나 owner fencing을 약화하지 않는다.
- 실패/rollback 후 새 transaction, reconnect retry, 새 command는 새로운 A를 요구한다. commit 결과 불명은 중복 원장을 조회하며 무조건 재실행하지 않는다. 같은 command ID라도 새 실행이 필요하면 현재 인가를 받는다.

| 사건 | 현재 적용 기준 | 수용하지 않는 확대 |
|---|---|---|
| 외부 Auth 실제 철회 R | 명시된 운영 범위에서 R+5초에 이르면 새로운 A 금지 | 이전 ingress allow/대기열로 늦은 A 허용 |
| 정상적으로 A를 지난 동일 transaction의 C | 일반 저장 지연으로 R+5초 뒤 commit 가능. 실제 C 시각은 계속 기록 | 별도 transaction/retry/새 command에 예외 상속 |
| known expiry | 기한 전에 A를 통과해야 함. 이미 착수한 동일 transaction의 늦은 C만 수용 | exp/not_after에5초를 붙이거나 만료 뒤 새 A 발급 |
| 권한 실패 인지 | 즉시 새 인가·보호 입력·정보 차단, 판 pause. 동일 in-progress DB 작업의 회수 성공은 약속하지 않음 | 실패를 알면서 새 A 발급·추가 허가 |
| P | recipient/session/view/payload별 새 검사와 최종 취소 불가 transport 인계. R+5초 차단 유지 | 늦은 C의 ACK/결과/snapshot까지 자동 송신 허용 |
| 장애60초 | 최초 t0+60초 정각 abort 우선, retry/restart 초기화 금지 | 늦은 C/ACK가 중단 판을 LIVE로 재개 |

처음부터 무권한인 요청에는 A를 발급하지 않는다. A/실제 C/P를 분리하여 관측하며, 늦은 C의 존재만으로 정보를 제공하지 않는다. terminal/open 상태·revision 채택 규칙은 계속 적용한다. 제품·검증 주기·Auth 교체·새 알고리즘 선택은 없다.

## 3. 시험 명세의 현재 적용 변경

모든 행동 시험은 NOT_RUN이다. CP0074§6과 기존 T/B 원문을 보존하며 아래 행만 현재 기준으로 대체/보완한다.

| 시험 연결 | 새 합격/실패 기준과 증거 |
|---|---|
| T01~03 / E01~04 | 실제 R, 검사 시작/결과, A, 실제 C, P, transaction/backend·command ID/hash, owner/incarnation/view/revision을 연결. R+5초 이후 새 A 또는 새 불허 P는 FAIL. 기한 내 A를 입증한 동일 transaction의 늦은 C는 D0010 수용 사례로 별도 표시하며 ‘실제 C5초 PASS’로 쓰지 않음 |
| T01~03 경계 사례 | A 전 queue/lock wait·만료·철회·실패 인지, A 후 일반 WAL/I/O 지연, 입증된 실행 정지를 구분. A 전 지연 뒤 낡은 allow로 착수하면 FAIL. 시계오차 포함 경계와 transaction 동일성을 입증 못 하면 INCONCLUSIVE |
| T04~06 | commit 후 ACK 유실·철회·duplicate/snapshot/retry/late callback 각각 새 P 인가. 늦은 C 예외가 응답 인가로 전파되면 FAIL |
| T07~10 | old owner 저장/old gate 송신 독립 차단·최초60초·commit 전후 crash 유지. 이미 A를 지났다는 이유로 owner 교체 후 새 command 또는 terminal 뒤 LIVE 재개 불허 |
| T11~14 / B01~07 | 삭제/복구/품질/비용 기준 변경 없음. commit 시각 관측은 유지. B5의 closed·기한 초기화 금지·허위 기록 재생성 금지와 범위 밖 손실 보고 유지 |

clock timestamp만으로 순서를 증명하지 않는다. 잠금 획득/검사/A/commit의 연결 trace와 syscall 인계 관측을 함께 사용한다. trace 누락·원천 R 불명·시계 오차 불명은 INCONCLUSIVE. 안전성 위반의 percentile 허용은 없다. 수용한 한계의 사례 수/지연은 숨기지 않고 별도로 보고한다.

## 4. 설계 종료 조건 대조

| 계획/CP0074 조건 | 반영과 판정 | 후속 의무 |
|---|---|---|
| 모델별 권위·ordering·중복·복구·private view | runtime J01~06·security J07~09 및 CP0074 선택 구조 유지. 완료 | 실제 경합/동기화 증명 |
| 실제 실행 위치/transport·선택 이유 | DB finalizer·단일 native TLS gate, S-C 조합 유지. 완료 | 고정 버전/배치/ACL·sender 격리 확인 |
| S-A predicate/최소 callable 권한/전체writer/cascade | CP0074§2 그대로. 완료 | 활성 Auth 설정/설치 버전·실제 caller/호환 시험. 전제 불일치면 배포 차단 및 해당 계약 재검토 |
| S-B 기록·외부 current·삭제/replay·복원 | CP0074§4/B5 그대로. 완료 | 실제 allcopies 삭제·RPO/RTO·운영 예외 대응 검증 |
| S-C 제품/비용·운영 | CP0074§5의 조건부 조합과 산식 유지. 완료 | 실제 계정 잔여/서울 견적/100명 부하/총비용 검증. 목표 부하 제한은 미달 |
| Z1 실제 C 시간 경계 | D0010으로 최종 인가·착수 A와 완료 C 구분. 설계상 해소 | A/C/P 관측 및 경합 시험. 실행으로 해소됐다고 쓰지 않음 |
| 기존 소비자·기존 DB 계약 | 문서만 변경, 기존 Auth/게임 무이관 및 호환 조건 유지 | 허용된 후속 구현에서 기존 caller/게임 회귀 확인 |
| 정식 문서·계획·trace | 정식6문서/계획1.5/기록/시험 delta 연결. 작성 완료 | 계획§4.2 사용자 결과 검토·승인 대기 |

기존 선택 구조 범위에서 새 필수 설계 잔여를 발견하지 않았다. 실행 manifest·실측이 없는 사실은 지원 전제가 확인됐다는 뜻이 아니다. 해당 전제와 실패 시 닫힘이 명세돼 있으며, 실제 환경이 그 조건을 충족하지 않으면 오픈하지 않고 해당 설계만 재검토한다.

| 게이트 | 설계 상태 | 실행 검증 | 오픈 상태 |
|---|---|---|---|
| G01 | DESIGN_SPEC_COMPLETE / 결과 검토 대기 | T12/13 NOT_RUN | 100명/판8·원격p95 250ms·모바일 증거 필요 |
| G02 | DESIGN_SPEC_COMPLETE / 결과 검토 대기 | T04~09 NOT_RUN | 각 정상망 재연결5초·60초·복구 증거 필요 |
| G03 | DESIGN_SPEC_COMPLETE / Z1 SCOPED_DESIGN_RESOLVED | T01~10 NOT_RUN | 권한·A/C/P·writer/owner·실제 설정 검증 필요 |
| G04 | DESIGN_SPEC_COMPLETE / 결과 검토 대기 | B01~07·T11/14 NOT_RUN | 기록/삭제/현재권한 복원·RPO/RTO 증거 필요 |
| G05 | CONDITIONAL_DESIGN_SPEC_COMPLETE / 결과 검토 대기 | 계정/총비용·운영 측정 미완료 | 세금포함3만원 및 품질/안전성 동시 충족 필요 |
| G06 | 두 Probe만 SCOPED_DESIGN_RESOLVED | 범용 실행 지원 판정 아님 | 각 Probe의 해당 검증 의무 유지 |

과거 G03 OPEN/BLOCKING 등의 단일 상태를 전체 실행 PASS로 변경하지 않는다. 현재는 위 설계/실행/오픈 상태를 분리한다. 미래 사용량·실청구 UNKNOWN, 기존 무료 한도 소비0 가정 없음. 나머지 목표·보존·운영 조건은 CP0074대로다.

## 5. 정식 반영과 다음 작업

D0010→이 문서§2/3→runtime/security→execution J12/J13→risks/validation/trace→계획1.5/CURRENT 순서로 반영한다. CP0074 판단·근거·검증·checkpoint 및 D0006~09 원문은 당시 이력으로 보존한다. 계획22단계·STEP6 전 구현 제한·integration/main 별도 승인도 유지한다.

**다음 담당은 사용자, 작업 하나는 이번 STEP4B 설계 산출물의 결과 검토·승인이다.** Z1 정책 결정은 이미 승인됐으므로 다시 묻지 않는다. 전체 산출물 검토는 계획§4.2의 기존 절차이며 새 조사/감사 단계가 아니다. 승인 후 단계 완료 기록·병합·다음 단계 착수는 각각 승인 범위를 확인해 별도로 진행한다. 이번에는 구현/시험/오픈·구매·권한 변경·문의·job/dump/복원·STEP5A·병합·main을 수행하지 않는다.
