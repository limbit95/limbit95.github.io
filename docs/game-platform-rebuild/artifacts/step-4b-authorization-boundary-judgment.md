# STEP4B — G03 권한 경계와 G02·G04 정합화 후속 판단

2026-10-04 KST. 상태: AUTHORIZATION_JUDGMENT_SUBMITTED / STEP4B IN_PROGRESS / G03 OPEN/BLOCKING. 입력은 사용자 지정 `ffd536e86b99c208943243c38785e96d1c4b7ad7`의 [후속 판단](step-4b-followup-judgment.md)과 CP0052. 기존 두 안을 구체화한 설계 검토이며 정식 계약 반영·구현·새 독립 감사가 아니다.

## 1. 복원과 이번 사용자 결정

PR412 OPEN/Draft/merged=false, head는 지정 입력과 동일. 기존 branch `docs/game-platform-vnext-phase4b-evidence-preparation`, base `feature/game-platform-vnext-integration`, integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`. AGENTS→계획1.3→기록README→integration/CURRENT·STEPbranch/CURRENT→CP0052→DECISIONS 순서로 대조했다. integration CURRENT는 병합 직전 기록을 담고 있어 현재 PR head와 혼동하지 않는다. 이번 시작 로컬138파일을 원격 tree와 대조했다.

이번 확인 질문에 사용자가 선택한 추가 요구:

- **한국 중심**: 첫 Probe 품질 검증은 한국 이용자 PC를 우선 기준으로 한다. 해외 서비스 차단이나 모바일 제외를 승인한 것은 아니다.
- **최소 종료 기록**: 첫 Probe는 판 식별·참가자·완료/중단 여부를 서버에 남긴다. 랭킹·보상을 추가하지 않는다. 두 번째 Probe의 서버 기록 없는 local solo 결정은 유지한다.

원래 결정인 총접속100명/판8명/세금 포함 월추가비30,000원·직접 운영·일시 단절 현재 상태 복원·서버 장애 미완료 판 중단/재시작 허용은 유지한다. 기록 보존기간·결과 열람 범위·운영 RTO·mobile 필수 범위·월 이용량은 여전히 미정이다. 이번 추가 답변을 기존 사용자 결정 파일에 소급 삽입하지 않고 이 문서/CP0053에 보존한다.

## 2. G03 — 관찰 사실과 지켜야 할 경계

[선택 원문과 공식 문서](step-4b-authorization-boundary-evidence.md)의 R01~R09/E01~E06을 검토했다. baseline 승인 helper는 profiles의 approved 여부를 보며, 선택 migration의 admin_set_member_status는 profile row lock 후 상태를 갱신한다. 관리자 UI는 RPC 성공 후 이용 정지 완료를 알린다. js/auth.js는 push 정리 등을 await한 다음 Auth signOut을 호출한다. 이 코드에 vNext 권위 서버 drain/ack가 존재한다는 증거는 없다. profile helper만으로 현재 Auth session 존재나 원격 owner의 권한 상태가 보장되지 않는다.

**구분해야 하는 철회 사건:** 사이트 승인 정지(계정 전체), 계정 삭제/탈퇴(계정 전체), Auth logout(요청 scope의 session들), 게임 방 이탈(해당 membership), 역할 감소(해당 view), 연결 단절(철회 자체는 아님). 선택한 mypage/profiles 파일에서 계정 탈퇴 구현 경로는 발견하지 못했으며 저장소 전체 부재 또는 production 동작으로 단정하지 않는다. 계정 삭제는 관리 콘솔/API 경로도 검토해야 한다. 재승인/재가입/같은 방 재입장은 이전 epoch·작업을 되살리지 않는다.

현행 J07은 전세계 벽시계 순간 철회나 이미 전달한 byte 회수를 요구하지 않는다. 대신 **정의한 철회 직렬화 경계 이후 새로운 보호 행위·정보 제공이 허용되지 않아야 한다**. 다음 세 시점을 혼동하지 않는다.

- R: 권한 철회가 해당 권위에서 확정된 순서 지점.
- C: 특정 입력/결과가 권위 상태에 반영된 순서 지점.
- P: 특정 수신자·현재 view에 대한 구체 payload의 정보 제공이 확정된 순서 지점.

C<R인 유효 결과가 R 뒤에 관찰될 수 있어도 R 뒤 새 read/duplicate-response의 P를 허용하는 근거가 되지는 않는다. P<R에 이미 transport로 넘긴 데이터가 늦게 도착하는 것과, 미처리 app queue를 R 뒤 새로 승인해 보내는 것은 구별한다. 사전 발급한 포괄적 permit/TTL을 P로 정의해 미래 payload 전체를 합법화하지 않는다. 실제 adapter가 P를 어디에 두는지, queue purge 범위와 in-flight 한계를 구현 전 고정해야 한다.

## 3. 두 안의 비교와 선택

| 기준 | A: 보호 연산과 철회를 같은 권위 경계에서 직렬화 | B: epoch/lease와 owner ack를 갖춘 bridge |
|---|---|---|
| 핵심 | 현재 승인/session/membership 확인과 해당 보호 연산을 하나의 순서 안에서 확정 | 제어 권위가 epoch를 관리하고 게임 owner에 한정 권한을 위임; 철회 때 위임 회수 확인 |
| 강점 | C/P/R 순서를 증명하기 쉬운 기준안, 저빈도 join/start/result/read에 적합 | 고빈도 simulation에서 매 입력 DB 조회를 줄일 가능성 |
| 잘못된 축약 | DB에서 true 받기→await→외부 메모리 변경/송신은 같은 경계가 아님 | 알림 발송 성공·짧은 JWT·TTL·주기 조회만으로 회수 완료 아님 |
| 통신 단절 | 새 gate 결과 없으면 새 보호 연산 금지; 원격 permit 재사용 금지 | 갱신/철회 확인 불가 시 owner 자가 차단과 복귀 fencing 필요; 기존 lease로 계속 서비스하면 즉시 철회 기준과 충돌 |
| 사이트 영향 | 같은 DB 안의 연산은 기존 profile update와 충돌하는 잠금/검증 가능성. Auth session과 외부 P는 별도 증명 필요 | 기존 상태변경/logout/계정삭제 모든 경로를 barrier에 연결하거나 동등한 차단 경계 필요 |
| 비용/지연 | 조회·잠금·왕복과 결과/전송 gate 비용 증가 가능 | DB 호출 감소 가능하지만 durable epoch·lease·drain·운영 복잡도 증가 |
| 이번 판단 | **안전성 참조안으로 선택**, 저빈도 제어/결과 경로의 우선 설계 | **고빈도 경로 조건부 후보**, 현행 writer 우회·단절 반례 때문에 채택 HOLD |

선택의 범위는 의도적으로 분명하다. A를 전체 WSS 서비스의 완성된 제품 조합으로 채택한 것이 아니며, A의 기준을 지키지 못하는 외부 apply/release 구현은 채택하지 않는다. B를 성능상 유리할 것이라는 이유만으로 확정하지 않는다. **현재 근거로 전체 온라인 조합의 G03을 닫을 수 없다.** 이번 진전은 모호했던 공백을 C/P/R 순서와 writer·gate별 증명 의무로 분해하고, A의 잘못된 축약과 B의 불충분한 TTL안을 배제한 것이다.

### 3A. A의 구현 가능한 범위와 남은 공백

join/start/ready·membership·durable result를 동일 DB 권위에서 처리한다면 현재 profile/session/membership과 owner epoch를 확인하고 mutation/dedupe를 같은 transaction에 묶는 안을 우선한다. 단순 SELECT 결과를 cache한 뒤 외부 commit하지 않는다. profile row를 공유 방식으로 잠근다면 status UPDATE/DELETE와 실제로 충돌하는 lock mode를 선택해야 한다. `FOR KEY SHARE`는 비키 status 변경을 막는 근거가 되지 않는다. 복수 row 잠금 순서·lock timeout·재시도와 transaction isolation을 명시해야 한다(E04/E05). Auth 관리 row 잠금/권한의 지원 여부는 미확인이고 managed schema를 임의 변경하지 않는다.

외부 simulation은 DB transaction 밖에 있다. 따라서 DB가 허가한 command를 나중에 메모리에서 실행하는 것만으로 C가 직렬화됐다고 쓰지 않는다. 후보는 (a) DB에 구체 command/owner/epoch와 권위 결정을 확정하고 외부 state를 그 결정의 재구성으로 정의하거나, (b) 외부 C/P를 포함하는 gate/barrier를 설계하는 것이다. (a)는 실제 simulation 권위/비용을 바꾸므로 작은2D 요구·기존 J01과 재대조해야 하고, (b)는 B와 유사한 분산 회수 증명이 필요하다. 둘 다 이번 완료로 처리하지 않는다.

snapshot을 서버에서 미리 계산했더라도 release 직전에 현재 view/권한 확인이 필요하다. DB 읽기 성공→네트워크 왕복→WSS 송신 사이 철회가 가능하다. DB 권위의 authorized 응답과 외부 서버의 새 정보 제공을 임의로 같은 P라 부르지 않는다. 구체 payload를 보호된 outbox에 넣는 안도 소비 시 현재 권한·queue 처리·유실/재전송 의미가 정의돼야 하며 outbox 존재만으로 해결되지 않는다. 클라이언트 cancel은 서버의 C를 rollback하는 도구가 아니다.

### 3B. B를 채택하려면 필요한 회수 절차

논리 절차 제안이며 API·필드 동결/현재 구현이 아니다.

1. 제어 권위가 해당 account/session/membership의 새 grant 발급을 막고 새 revocation epoch를 durable하게 기록한다. 영향받는 owner와 grant를 누락 없이 식별한다.
2. 각 owner는 해당 범위의 queue에 철회 barrier를 넣는다. barrier 이전 확정 C를 구별하고, 이후 신규 입력/새 P를 막으며 미승인 projection·retry 응답 queue를 폐기한다. 다른 방/다른 사용자의 자원을 전역 폐기하지 않는다.
3. owner ack는 메시지를 받았다는 뜻이 아니라 차단·queue 처리와 해당 epoch의 상태를 적용했다는 뜻이어야 한다. restart한 owner의 옛 ack를 재사용하지 않는다.
4. ack가 없는 owner는 차단되었다고 추정하지 않는다. 안전한 lease expiry를 사용할 경우 clock 오차·pause/resume·최장 작업/송신 시점·재기동을 포함한 유효기간 증명이 필요하다. 프로세스가 멈췄다 깨어나도 gate를 통과하지 않고 송신/commit할 수 없어야 한다. 저장소 fencing은 결과 쓰기를 막지만 old owner의 WSS 정보 제공까지 자동으로 막지는 않는다.
5. 모든 영향받는 owner의 차단 또는 동등한 ingress/egress fence를 확인한 후에만 게임 영역 철회 완료를 확정한다. 재연결/재승인에는 새 epoch·새 view를 발급한다.

핵심 반례: 현행 admin RPC는 profile 상태를 갱신하고 성공 반환할 수 있고, Auth logout/관리 콘솔 삭제도 이 bridge를 우회할 수 있다. 그 뒤 lease가 남은 서버를 계속 허용하면 기존 상태변경 완료 의미와 충돌한다. 이를 “게임 철회만 잠시 pending”으로 바꾸는 것은 새로운 사용자 정책·상위 영향이므로 묵시 채택하지 않는다. status commit을 barrier 뒤로 미루는 방식도 기존 writer/Auth 외부 경로 전체의 참여 증거가 있어야 한다. 안전한 완료를 기다릴 수 없는 경로는 새 보호 연산별 A 상당의 gate가 필요하다.

따라서 B는 **모든 철회 writer의 포괄 여부와 단절 시 차단 증명**이 확보될 때만 재선택한다. change event가 한 번 유실되어도 최신 epoch를 조회·대조하는 독립 경로가 필요하며, 주기 조회 간격을 안전성 면제로 사용하지 않는다.

## 4. 실패·경합별 결정과 합격 oracle

| 사건 | 결정 | 구현 전/실행 시 확인할 oracle |
|---|---|---|
| 권한 조회 timeout/5xx/불명확 | 새 join/action/P 금지, 명시 auth-unavailable; 과거 승인 cache로 허용 금지 | 실패를 탈퇴 확정과 혼동하지 않고 bounded 재시도, 복구 시 새 권한·view 확인 |
| 입력 queue 대기 중 R | C가 R보다 뒤면 거부, C<R인 확정은 소급 취소하지 않음 | client timestamp가 아닌 권위 순서로 비교; 거부 입력으로 효과/결과 소비 없음 |
| DB check 뒤 await 중 R | 기존 true 재사용 금지 | 최종 C/P와 R의 원자성 또는 gate 증거 없으면 실패 처리 |
| 명령 commit 후 응답 유실 | 동일 identity+payload로 mutation once; payload 불일치 거부 | 재시도는 저장된 private 응답을 그대로 반환하지 않고 현재 권한으로 새 P 결정 |
| snapshot/stream 생성 중 역할 감소 | 이전 projection 중단·폐기, 새 view로 재시작 | 동일 match/revision도 옛 viewer cache 재사용 금지 |
| logout | 대상 session scope를 검증, 로컬 인지 즉시 소비 무효화 | SDK global/local/others 범위·직접 Auth 경로 확인; 서명 유효 JWT만으로 계속 허용 금지 |
| 계정 삭제 | profile/user/session 부재는 새 접근 거부 | cascade와 외부 owner 연결 종료/권한 cache 무효화 검증; 삭제 실패는 삭제 완료 아님 |
| 방 이탈 | membership 권위 queue에서 C/P fence | 재승계·ready 조건 재검증; 계정 전체 logout으로 확대하지 않음 |
| DB↔server 단절 | 새 보호 행위/정보 제공 중단; 판 계속 표시를 정상으로 위장 금지 | B 미검증 상태의 lease 연장/오프라인 허용 금지; 모든 신뢰 경로 fail-closed |
| duplicate revoke/오래된 ack/역순 알림 | epoch 단조성·owner 귀속 검증, 반복 안전 | reapprove 뒤 옛 grant 부활 없음; 전체 invalidate로 새 owner 자원 삭제 금지 |
| P<R인 전송이 R 뒤 도착 | 이미 제공 확정된 in-flight 한계로 분류, 회수 약속 없음 | 새 P와 명확히 구별; 공격자 저장 byte와 정상 client 채택 무효화는 별개 |

권한 실패 중 이미 승인된 자율 simulation이 내부적으로 시간 진행할지 pause할지는 gameplay 정책이 필요하다. 어느 경우든 보호 출력·새 사용자 명령을 계속 허용하는 근거가 되지 않는다. 전체 match pause 또는 해당 사용자 격리의 비용/공정성을 후속 선택하며, 장시간 권위 확인 실패 시 미완료 판 중단 정책에 연결할 수 있다. timeout 수치는 미정이다.

## 5. G02 — 권한 경계에 맞춘 동기화·복구

이전 snapshot cut/연속 revision/quiet loss reconciliation 판단은 유지하고 다음을 추가한다.

- 연결 open→서버 인가 완료→현재 owner/match/view snapshot 채택→live 준비를 별도 상태로 둔다. auth pending/실패 상태를 LIVE로 표시하지 않는다.
- snapshot cut n과 첫 n+1 live를 같은 owner queue에서 연결하더라도 recipient 권한 P가 별도로 유효해야 한다. revocation barrier가 cut 사이에 있으면 옛 snapshot/buffer를 폐기하고 인가 실패 또는 새 view snapshot으로 귀결한다.
- control epoch, gameplay revision, tracking 수명을 서로 대체하지 않는다. heartbeat는 최신 권위 revision과 필요한 권한 확인을 포함해야 하며 ping/pong만으로 승인 유지/최신 상태를 증명하지 않는다.
- auth channel의 마지막 철회 알림 유실도 quiet-loss 대상이다. 단절/권한 근거 소실 때 먼저 새 보호 사용을 차단한 뒤 재조회한다. 독립 reconciliation은 복구 도구이고 R 이후 허용 구간을 정당화하지 않는다.
- 재연결은 새 session 확인→현재 승인/membership→owner epoch 확인→새 authorized snapshot 순서다. 이전 command queue 자동 재생 금지. 같은 판의 확인되지 않은 명령만 같은 identity로 상태 조회/재시도하고 C/P는 각각 검증한다.
- 권한 근거를 회복할 수 없거나 match가 중단됐으면 명시 실패/종료 경로로 나간다. 무한 queue·무한 reconnect로3만원 상한을 침해하지 않도록 retry 예산·backoff·server admission을 설계하되 수치 미승인 상태다.

G02 PARTIAL/OPEN. 추가 oracle은 snapshot cut↔revoke, 재연결↔재승인, last auth event loss, duplicate response↔role change, old owner snapshot 차단이다. 실제 SDK/version·준비 신호·queue bytes·deadline·max retries와 상태 전이 표를 구현 전 고정한다. H01~06/H08을 통합해 검증하되 이번 실행은 NOT_RUN.

## 6. G04 — 최소 종료 기록과 owner

사용자 선택으로 Probe1의 최소 종료 기록 보존 필요가 확정됐다. **진행 중 게임 상태를 crash 복원하지 않는 선택과 종료 기록의 내구성은 별개**다. 결과 식별/참가자/완료·중단 상태만 저장하는 범위이며 랭킹·점수·보상은 추가하지 않는다.

제안하는 기록 수명은 판 시작 등록→진행→완료 또는 중단이다. 판 식별과 참가자 맥락을 durable하게 등록하기 전 플레이 시작을 확정하면 crash 때 어느 판을 중단 처리할지 알 수 없으므로, 시작 등록 commit을 gameplay 시작 조건에 포함하는 안을 선택한다. ready와 시작 권한도 현재 권한 gate에서 검사한다. 중도 참가가 허용되는 경우 참가자 변경 역시 기록 의미와 일치해야 하며 허용 자체는 미정이다.

terminal commit은 match identity+현재 owner fencing+상태 전이 검증을 같은 durable 연산으로 처리한다. 같은 종료 재시도는 같은 결과로 수렴하고 completed와 aborted를 두 owner가 각각 확정할 수 없어야 한다. ack 유실은 UNKNOWN/PENDING으로 두고 DB에서 확인한다. 완료가 이미 commit됐으면 restart 정리 작업이 aborted로 덮어쓰지 않는다. DB가 불가하면 저장 완료라고 표시하지 않는다.

crash 이전 메모리에서 승리/완료를 계산했지만 durable terminal commit이 없었다면, 그 사실만으로 복구 후 completed 기록을 만들지 않는다. durable 시작 기록의 미종결 판은 old owner를 차단한 뒤 aborted로 종료한다. 이는 미완료 판 중단 허용과 맞으며, 사용자에게 완료로 확정 표시하는 시점을 durable commit 이후로 두어 오인하지 않게 한다. history 전체 replay나 결정론적 복원을 추가하지 않는다.

owner 재시작은 새 owner epoch를 발급하며 old owner 결과 쓰기를 저장소가 거부해야 한다. 분리된 old owner의 WSS 송신까지 막히는 것은 아니므로 G03 fence도 별도로 필요하다. initial Probe에서는 fencing 증거 없는 자동 failover/동일 match 계속 진행은 보류한다. 모든 old owner가 죽었다는 관측 없이 timeout만으로 소유권을 넘기지 않는다. durable lease라면 compare-and-set/epoch 변경이 terminal write와 함께 검증돼야 한다.

판 종료 기록에는 최소 식별정보만 쓰고 email/실명/토큰/private gameplay를 넣지 않는다. 탈퇴 시 참가자 식별자를 삭제·가명화할지와 보존기간·열람 주체는 아직 선택하지 않았다. auth.users FK cascade로 결과 자체가 사라지는 schema를 무심코 채택하지 않는다. 이 기록은 서버 프로세스 crash 내구성 대상으로 설계하며 **DB 재해/백업 손실까지 RPO0을 보장했다는 뜻은 아니다**. DB 재해의 허용 소실/백업·복원시간은 예산과 함께 추가 결정한다.

G04 PARTIAL/OPEN. 최소 종료 기록 요구와 lifecycle 제안은 진전됐으나 저장소/retention/열람·탈퇴처리/DB 재해정책/fencing 구체안 미해소. H07에 start-before/after-commit, complete-before/after-commit, ack loss, reconnect during aborted, stale owner write를 추가한다. 재대결은 새 판 identity와 새 ready 상태를 만들고 기존 참여 맥락을 보존한다.

## 7. G01·G05 — 다음 판단에 필요한 증거

한국 중심 PC 검증으로 지역 가정을 좁혔다. Seoul 후보와 실제 Supabase 프로젝트 region 간 RTT·cross-region 왕복, 한국 유선/모바일망의 PC 접속을 구별해 측정해야 한다. 한국 중심이 Seoul SKU 자동 채택이나 특정 latency 숫자 승인으로 바뀌지 않는다.

| 증거 묶음 | 측정/확인 대상 | 결정에 쓰는 이유 |
|---|---|---|
| W1 품질 | 입력→C→P→다른 PC 표현 p50/p95/p99, auth outage/복원 시간 | G01 허용 latency/staleness/복구 기준을 사용자 영향과 함께 제안 |
| W2 권한 gate | A의 protected operation당 DB 호출·lock wait·transaction time, B writer/ack/expiry 증명 | G03 충족과 CPU/DB/월비용을 함께 비교; 빠르다는 이유로 안전성 면제 금지 |
| W3 규모 | 100사람/기본100socket+중복탭/reconnect, 판8명·방 분산/빈방 | 13방만 시험하고100명 지원으로 과장하지 않음 |
| W4 durable 기록 | 월 판수·row/index bytes·참가자 변경·보존기간·backup | 최소 기록도 무료라는 가정 금지, DB 재해정책 비용 반영 |
| W5 운영 | SDK/server/OS 고정 버전, user 배포관리 시간·복원 절차, 실제 요금 계정 | 제품명만 결정하고 운영 지원으로 표시하지 않음 |
| W6 회귀 | 권한 writer 전수 목록·실제 migration 적용·기존 게임 격리/Registry 영향 | bridge가 현행 site 의미를 바꾸면 Architecture Change와 영향 감사 선행 |

비용에 추가할 산식: A에서100명이20Hz 입력을 보내고20Hz 보호 상태를 받는 시험 envelope는 개별 연산당 gate 하나라면 초당4,000 gate, 100h에14.4억 gate다. 실제 청구단위나 사용 예측이 아니며 RPC 수만으로 달러를 계산하지 않는다. room13개마다20Hz로 입출력 한 batch씩이면520 batch/s(100h1.872억)이나 batch 내부100명 권한 검사량과 snapshot/read/결과 처리는 사라지지 않는다. room 수가 늘면 이 이점도 변한다. **batch를 승인해 미래 입력/출력에 재사용하면 A의 안전성을 충족하지 않는다.**

B의100 active session을 T초마다 갱신하는 비용은 대략100/T refresh/s와 철회/ack/retry 비용이다. T는 미정이며100/T가 낮다는 이유로 lease 시간 동안의 철회 지연을 허용하지 않는다. 결과 저장량은 `월 판수×(판 metadata+참가자 rows+indexes+필요 감사 기록)×보존기간`으로 산정한다. 경기 길이/평균인원 미정이므로100CCU를 월 판수로 바꾸지 않는다.

공식 가격표를 이번에도 확인했다(E07/08). Lightsail IPv4 2GB $12와 Supabase Pro 시작 $25는 기존 비교 입력과 같지만, 전체 조합의 실제 비용을 증명하지 않는다. 이전 민감도에서 $12+가정$1 backup, R1,500/세율10%일 때21,450원이었고 남은8,550원 안에 이번 gate/종료 기록의 증분까지 들어야 한다. 실제 환율·세금·DB plan 여유량은 미확인이다. 무료 API 요청 수 문구는 CPU·DB연결·보존·egress가 무한이라는 근거가 아니다.

우선순위는 W2/W6으로 안전하게 가능한 조합을 좁히고 W1/W3/W4/W5로 최종 제품·SKU·SDK·region 견적을 만드는 것이다. 안전성을 지키는 조합이3만원을 넘으면 비용/운영시간/품질 조정안을 사용자에게 제출한다. 100명·8명·현행 보호 의무를 임의 완화하지 않는다. G01/G05는 PARTIAL/OPEN, 제품 구매/배포 없음.

## 8. 남은 사용자 결정 — 선택지·추천 이유

이미 받은 한국 중심/최소 종료 기록 답변을 다시 묻지 않는다. 다음 결정은 기술 근거와 연결하여 좁혀 제시한다. 아래 추천은 아직 사용자 승인 아님.

| 우선 | 결정 | 선택지 | 추천과 이유 |
|---|---|---|---|
| 1 | 종료 기록 열람 | 본인 참가 판 / 전체 승인회원 공개 | 본인 참가 판 우선. 다른 사람 활동이 불필요하게 노출되지 않고 최소 기록 목적에 맞음; 관리자 열람은 별도 권한 |
| 2 | 보존·탈퇴 | 제한 기간 뒤 삭제 또는 가명화 / 계속 보존 | 제한 보존+탈퇴 시 식별 연결 최소화 방향. 정확한 기간은 월 판수/필요 목적 확인 후 제안; 법적 보존기간 임의 확정 없음 |
| 3 | 장애 운영 | 직접 확인 후 수동 복구 / 정해진 시간 안 복구 보장 | 초기 수동 복구 방향. 직접 운영 가능 답변을24시간 대응 약속으로 확대하지 않음; RTO 값은 별도 결정 |
| 4 | 예산 충돌 시 | 예산 증액 / 신규 판·운영시간 제한 / 승인 품질 범위 재조정 | 실제 견적을 먼저 보고 선택. 제한을 미리 적용하거나 가격에 맞춰 보안을 낮추지 않음 |

DB 재해시 최근 종료 기록 소실을 어느 범위까지 허용할지도 backup 선택 전 설명하고 확인한다. 미완료 판 중단 허용 답변으로 확정 기록 소실 허용을 추론하지 않는다. 기술 증명인 C/P/R·writer 범위·fencing 방식은 Work가 설계할 책임이며 사용자에게 구현 알고리즘 선택을 떠넘기지 않는다.

## 9. 게이트 상태와 정합성 결론

| 게이트 | 상태 | 이번 진전 / 구현 전 해소 조건 |
|---|---|---|
| G03 | OPEN/BLOCKING | A 안전성 참조/저빈도 우선, B 조건부 HOLD; C/P/R·실패정책·경합 oracle 명확화. 실제 외부 gate 및 모든 철회 writer의 일관성 증명 필요 |
| G02 | PARTIAL/OPEN | auth pending/cut/reconnect/quiet auth loss 정합화. SDK/version·bounded queue/deadline·race 검증계획 고정 필요 |
| G04 | PARTIAL/OPEN | 최소 종료 기록 사용자 선택, durable start/terminal·aborted/owner 의미 구체화. retention/read/delete/DB재해·fencing 결정 필요 |
| G01 | PARTIAL/OPEN | 한국 중심 기준 추가. PC 환경·latency/staleness/복구 수치 승인 필요 |
| G05 | PARTIAL/OPEN | gate·종료기록 포함 비용/부하 산식 추가. 실제 plan/제품/SDK/region/월사용량 견적 필요 |
| G06 | SCOPED_DESIGN_RESOLVED 유지 | 두 Probe 규칙 적용만. 최소 기록은 Probe1에 한정, solo/hostless 미래 장르 확대 없음 |

STEP4A의 alive/현재 의미/권한/순서/반영 직전 재검사, error/null/finally/effect까지 적용, dispose 선무효화·소유 자원 정리·공유owner 보호를 유지한다. 한 전역 epoch로 서로 다른 사용자/판/정리 수명을 덮지 않는다. DB11 의무는 모델에 맞춰 유지하고 private 없는 게임도 payload whitelist 검증을 생략하지 않는다. 기존 게임 무이관이며 site writer 변경이 필요하면 영향 감사 범위를 먼저 확정한다.

전체 STEP4B 완료·구현 착수 HOLD. 이번 결과는 G03 실패 원인과 두 안의 필요조건을 구체화한 후속 판단 제출이다. 정식 산출물 반영·구현·STEP5A·병합·main 반영 없이 제출 뒤 정지한다. 다음은 W2/W6 설계 증명과 남은 사용자 정책을 반영할 후속 범위 지정이다.
