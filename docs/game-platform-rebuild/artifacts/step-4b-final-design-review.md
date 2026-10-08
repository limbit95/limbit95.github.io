# STEP4B — CP0075 최종 설계 검토

2026-10-08 KST. 고정 검토 입력 `1c801eeb5fd75772adf7f60dc52d9a8a0c585392`, tree `c1aa8409a3ebcceb4357c7a0b279175f6574b660`. 시작 PR412 HEAD 일치/추가변경0. 본 검토 기록 commit은 검토 대상 설계를 변경하지 않는다. Astra는 요청한 설계 검토 책임 구분이며 별도 모델/독립 실행 인증이 아니다.

## 1. 결론

**설계 결과 승인 검토 가능. 필수 보완 불필요.** D0010으로 변경한 보장 범위가 정식 계약·계획1.5·현재 시험 기준에 일관되게 반영됐다. 선택 구조의 필수 설계 공백을 새로 발견하지 않았다. 이 판정은 CP0075의 설계 산출물에 한정하며 구현 지원·총비용 충족·실행 시험 통과를 뜻하지 않는다.

STEP4B는 사용자 결과 승인 전까지 **REVIEW_PENDING**이다. D0010 정책은 이미 승인됐으므로 재질문하지 않는다. 다음 작업 하나는 사용자의 이번 설계 결과 승인이다. integration 병합·STEP5A·main·오픈 승인은 별도로 남는다.

## 2. 승인 범위와 반례 대조

주요 기준은 [CP0075 결정/종료 확인](step-4b-z1-decision-and-design-closeout.md) §2/3, [runtime](step-4b-runtime-sync-contract.md) CP0075 적용 절, [security](step-4b-security-site-contract.md) CP0075 적용 절 및 [D0010](../DECISIONS.md)이다.

| 검토 항목 | 대입한 사건과 문서상 처리 | 판정 |
|---|---|---|
| A와 C 구분 | ingress allow/BEGIN/enqueue 뒤 지연은 A가 아님. 잠금 확보·현재 predicate 뒤 같은 finalizer의 고정 저장 절차 진입이 A, 실제 DB commit이 C | 경계 구분 적합 |
| 검사→착수 틈 | 검사 뒤 queue/lock 대기나 제어 반환이 생기면 이전 allow를 버리고 재검사. 별도 transaction에 permit 반환 후 사용 금지 | 이름만 바꾼 사전 allow 구조가 아님 |
| 철회5초·known expiry | R+5초에 이른 새 A 금지, expiry 뒤 새 A 금지. 검사 시작 기반 freshness를 유지하고 완료 시각으로 기한 연장 금지 | 새 작업 기준 유지 |
| 늦은 C | 기한 안에 A를 지난 동일 transaction만 일반 저장 지연 C 수용. 실제 commit 시각은 별도로 관측 | D0010 범위와 일치 |
| retry/새 transaction | rollback·재접속 retry·다른 command는 새 A. commit 불명은 중복 원장 확인, 동일 ID만으로 무조건 재실행 금지 | 예외 상속 금지 |
| ACK/duplicate/snapshot/callback | C 뒤 철회된 recipient에게 결과를 보내려면 새 P 인가 필요. 늦은 C 허용을 송신 허가로 사용하면 FAIL | 정보 제공 경계 유지 |
| P·부분 송신 | 최종 취소 불가 transport 인계가 P, 취소 가능한 BIO/앱 queue는 이전. 부분 인계 뒤 잔여 suffix는 재검사, 권한 상실 시 폐기/연결 종료 | 새 P5초 기준 유지 |
| 초기 무권한/실패 인지 | 처음부터 허가 없는 요청 A 금지, 확인 실패를 알면 새 허가·입력·정보 즉시 차단/pause | 인가 유예 도입 없음 |
| 최초60초 | t0+60초 정각 abort 우선, retry/restart로 초기화 금지. 늦은 C/ACK로 terminal 판을 LIVE로 재개 금지 | 중단 규칙 유지 |
| D0008과 D0010 | 입증된 after-check 실행 정지와 동일 transaction의 일반 저장 지연을 별도 분류. queue의 다음 작업에 예외 상속 금지 | 승인 범위 구분 적합 |
| old owner/내부 writer | A에서 확보한 anchor를 C/rollback까지 유지, writer/owner 교체와 직렬화. owner 교체 뒤 새 old-owner 저장 금지 | 저장 fencing 유지 |
| old gate | 저장 epoch만으로 송신 차단을 대체하지 않고 close/drain·실제 sender 종료/격리 확인 후 교체, 확인 불가 시 새 gate 폐쇄 | 송신 fencing 별도 유지 |

검사와 저장 절차 진입이 실제 구현에서 위 순서를 갖는지는 T01~03의 실행 의무다. 문서에는 필요한 대기 처리·재검사·동일 transaction 제한과 위반 oracle가 존재한다. ‘같은 함수이니 무조건 원자적’ 또는 ‘관측용 A 로그만 찍으면 통과’라는 보장은 없다. 실제 구현이 앱 queue나 다른 transaction으로 경계를 분리하면 해당 계약 위반이며 이 승인 검토 판정으로 정당화할 수 없다.

D0008이 수용한 물리적 정지를 다시 미승인 위험으로 취급하지 않았다. 승인된 D0010 사례도 예외 없이 C5초를 충족해야 한다는 옛 기준으로 재심사하지 않았다. trace/원천 R/시계 오차가 불충분하면 INCONCLUSIVE이며 설계 검토가 이를 PASS로 바꾸지 않는다.

## 3. S-A·S-B·S-C와 설계 종료

[CP0074 선택 구조](step-4b-design-finalization.md) §2~5와 [근거](step-4b-design-finalization-evidence.md)를 CP0075에서 유지한 범위만 대조했다. 기존 근거를 최신 운영 적용 또는 새 공식 보증으로 승격하지 않았다.

| 대상 | 설계상 갖춰진 내용 | 구현/배포·실행/오픈에 남는 의무 |
|---|---|---|
| S-A | JWT와 current user/session/사이트 권한의 AND predicate, private fixed definer와 전용 EXECUTE, 전체 보호 DML guard/직접 SQL 통제·Auth cascade 분리 | 실제 만료 설정/필드·정확한 버전/caller·최소 ACL·guard/삭제 호환. 불일치면 배포 차단하고 그 계약만 재검토 |
| S-A 신뢰 범위 | 넓은 definer owner를 최소권한이라 부르지 않고 runtime callable 권한과 구분. connector 관리자 권한을 runtime에 복사하지 않음 | credentials 분리·PUBLIC/비인가 실행 거절·주체 위조/타인 view/Data API 시험 |
| S-B | PG terminal/outbox, 분리 archive/link/current, 저장소 transaction의 generation 조건, 삭제 inventory·현재 원천 불명 시 closed, 격리 복원/새 incarnation | 모든 사본 삭제·stale publish·rollback/current 검증·권한 재확인·RPO/RTO 실증 |
| B5 | durable terminal 미확정과 실제 기록 유실을 구분. 새60초/가짜 종결/새30일 기한 생성 금지, 범위 밖 손실을 미달로 보고 | crash·두 저장소 장애 시 closed 및 원장 대조 검증. 모든 독립 저장소 동시 상실의 무손실 의무를 추가하지 않음 |
| S-C | Free서울/Lightsail/native gate/DynamoDB/Scheduler/Lambda/SNS 조합, 비용 경로와 예산 식·한도/실패 처리 명시 | 계정 잔여·지역 견적·미래 부하·세금/수수료/총비용,100명·품질과 동시 충족 확인 |
| 운영/단말 | 정상망 재연결과 서버/권한 장애 분리, 평일 대응 공백·RPO 일정 여유·RTO 시점 정의, 기본 PC/모바일 조합 | 실제 경보/착수/복원 시간·부재 대응·고정 단말/망 manifest·측정.24/7 보장 아님 |

S-C의 조건부 설계 선택은 총3만원이나 성능 달성 판정이 아니다. 목표 부하에서 새 판을 막아 예산을 지킨다면 목표 미달이라는 조건도 유지돼 있다. 실제 사용량/실청구 UNKNOWN과 기존 소비0 가정 금지를 확인했다. 설계 검토에서 가격·metadata를 반복 조회하거나 새 제품을 고르지 않았다.

필드/버전/계정 manifest는 선택된 구성의 배포 적합성 확인이며, 미지의 핵심 알고리즘을 구현 담당에게 고르도록 남긴 조건과 구분된다. 확인 결과 지원 전제가 달라지는 경우의 폐쇄·해당 계약 재검토도 명시돼 있다. 이번 범위에서 구조적 공백을 단순 NOT_RUN으로 숨긴 항목은 발견하지 않았다.

## 4. 문서 정합성과 상태

- D0010→CP0075 결정§2/3→정식 runtime/security→execution J12/J13→trace/risks/validation→계획1.5/CURRENT의 대체 관계가 연결된다. 옛 Z1 HOLD와 C5초 문구는 당시 이력이라는 우선순위가 명시돼 있다.
- 실제 C 관측점을 A로 덮어쓰지 않고, T01~03에서 수용된 늦은 C와 새 A/P 위반을 구분한다. T04~10은 retry/정보/owner/60초를, T11~14/B01~07은 기존 품질/삭제/복구/비용 의무를 유지한다.
- 계획22단계 순서·STEP6 전 구현 제한·기존 Auth/게임 무이관·결과 승인/병합/다음 STEP/오픈의 분리가 유지된다. 현재 rulebook·게임 코드·SQL을 설계 문서로 변경했다고 주장하지 않는다.

| 게이트 | 최종 설계 검토 | 실행/오픈 |
|---|---|---|
| G01 | 승인 검토 가능 | 100명/판8·원격p95 250ms·모바일 NOT_RUN |
| G02 | 승인 검토 가능 | 각 정상망 재연결5초·동기화/60초·owner NOT_RUN |
| G03 | 승인 검토 가능, Z1 설계 해소 적합 | A/C/P·현재 권한/전 writer·실제 배포 검증 NOT_RUN |
| G04 | 승인 검토 가능 | 기록/30일삭제/탈퇴unlink·RPO24h/RTO24h/7일복구점 NOT_RUN |
| G05 | 조건부 제품/예산 설계의 승인 검토 가능 | 실제 계정/부하/총비용/운영 충족 미확인 |
| G06 | 두 Probe의 기존 scoped 판단 유지 | 범용 지원이나 실행 면제 아님 |

## 5. Findings와 다음 작업

설계 승인 전 필수 finding **0건**, 새 정책 변경 요구 **0건**. 필수 보완 불필요. 실행/오픈 blocker는 위 표 및 기존 시험 명세대로 남으며, 이를 없애기 위한 별도 설계 자료 수집 cycle을 추가하지 않는다.

다음 담당은 사용자, 작업 하나는 고정 CP0075 설계와 이번 검토 결과에 대한 결과 승인이다. 본 검토 기록은 설계를 수정하지 않았으므로 검토 기록 commit을 새 설계 입력으로 다시 감사할 필요는 없다. 결과 승인과 PR412 integration 병합 승인은 별개이며 이번에는 어느 쪽도 승인됐다고 기록하지 않는다.
