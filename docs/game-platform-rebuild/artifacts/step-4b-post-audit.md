# STEP 4B — Work Astra 사후 감사

## 판정

**정식 문서 반영·계약 정합성: PASS. 이번 범위에서 새 수정 요구 finding 없음. STEP4B 전체 완료·구현 착수: HOLD.** G01~06은 모두 OPEN이며 이번 감사로 해소하거나 승인하지 않았다. 문서 반영의 충실성과 실제 권한/복구 지원 증거는 별개다. 사용자 결과 승인·병합 승인도 포함하지 않는다.

- 감사 대상 고정 SHA: `d2819c02db31f8b4f426d99b8a26c02e622ac46f`, tree `a4a7a06cff57203d8863cde13c9c07af817fe622`
- 원본 판단 입력 SHA: `ddfa7a5e226fe0c5f62779a19b708ca0802899ce`, 판단 blob `bd4c5b4991921c17d74bd99ef275819e4ae046f5`
- 승인 integration: `3aeae1dfcce7788f88e706dcd49d283b91b67e82`; PR412 OPEN/Draft/미병합, 기존 branch/base 유지
- 감사일: 2026-10-04 KST. 역할은 가이드5 Work Astra 감사 책임을 의미한다. 같은 대화의 이전 판단·반영 기록을 볼 수 있으며 별도 모델/에이전트에 의한 조직적 독립성을 인증하지 않는다. 이전 PASS 결론을 채택 근거로 쓰지 않고 고정 원문·상위 의무·반례를 다시 대조해 결론을 냈다.

## 대상과 독립 확인 방법

대상은 정식6문서(모델 품질, 권한/사이트, 실행/운영, 미결정/후속, trace, 검증)와 CURRENT·분담·CP0047/48이다. 아래 파일/절 표기는 모두 위 고정 SHA에 속한다. [고정 정식 제출본](https://github.com/limbit95/limbit95.github.io/tree/d2819c02db31f8b4f426d99b8a26c02e622ac46f/docs/game-platform-rebuild/artifacts)을 기준으로 읽는다. 감사 기록을 추가한 후속 HEAD를 감사 대상에 섞지 않는다.

실제 원격/필수 진행6문서를 재조회했고 로컬125파일과 고정 tree의 blob 일치를 확인했다. 판단 원문은 입력 SHA에서 다시 조회했다. 기존 반영 스크립트와 그 manifest를 사용하지 않고, 정식 trace의 줄 범위를 직접 읽어5블록 hash/내용을 재구성했다. 180줄 전체가 빈틈/겹침 없이 일치하고 J01~13, G6행, H10행을 별도 추출해 일치시켰다. 이것은 정확한 복사만 입증하므로 아래 의미 대조를 추가했다.

기준은 계획1.3 §2/STEP4B, 승인 STEP4A 책임·수명 계약, 현행 개발규칙 §9/10B/11과 DB/Test Contract의11개 의무·Data API·idempotency다. 준비 B44개/36파일 blob을 재대조하고, snapshotCoordinator, duplicate response 반환 경로, auth TOKEN_REFRESHED, 승인 predicate, invite Registry guard를 선택 재독했다. 외부 자료는 아래 A01/02 두 페이지의 지정 절만 이번에 재확인했다. 나머지 V01~12는 기존 확인 범위/한계를 유지하며 제품 전체 재감사나 프로젝트 배포 검증으로 확대하지 않았다.

## 의미 대조 결과

| 감사 항목 | 고정 문서 위치·기준 | 독립 검토와 결론 |
|---|---|---|
| 반영 누락/선택 왜곡 | 정식 trace5블록; 판단 J01~13 | 조건·보류·사유·후속까지 exact 일치. 헤더가 가이드3 당시 상태와 가이드4 현재 상태를 구별해 과거 “미완료” 복사를 현재 완료 주장으로 읽지 않게 함. PASS |
| Core 책임/모델 공존 | 모델 품질 J01/02; 계획 §2, STEP4A 책임 계약 | 권위/순서 의미는 선택모델에 두고 Core에 Room/host/tick/DB/전역상태를 강제하지 않음. 신뢰 서버 simulation 방향과 제품/transport 후보 선택은 구별됨. PASS |
| 수명과 늦은 반영 | 모델 품질 J02/J05; STEP4A 수명 §6/7 | 살아 있는 owner·현재 의미·허용 view·모델 순서·apply 직전 재검사가 유지됨. 성공 외 error/null/finally/cleanup/effect와 재진입 포함. 현재 소비자가 재검증한 최신 승인 snapshot 예외도 유지. PASS |
| 정리와 공유 자원 | 모델 품질 J05; STEP4A §6.2 | 무효화 우선·반복 안전·부분 초기화·늦은 자원·독립 cleanup 실패·실제 owner 경계가 유지됨. 취소/구독해제 성공만으로 안전하다고 하지 않음. PASS |
| 순서·idempotency | 모델 품질 J02/J04/J06; DB Contract6~8/Idempotency | 비교 domain·동일version·ACK/commit 분리. timeout의 미상 commit에 새 identity 강제하지 않음. mutation once와 반환 view 권한을 분리하므로 현행 duplicate 오류 허용과 모순 없음. PASS |
| initial/live·현재 복원 | 모델 품질 J03/J04; 개발 §9, DB9, A02 | SUBSCRIBED≠atomic cut. 최초 gap뿐 아니라 연결 유지 중 마지막 알림 유실을 독립 reconciliation 대상으로 다룸. current/history/replay를 분리하고 무한 정상 stale/무한 spinner를 허용하지 않음. 구현된 복구라고 주장하지 않음. PASS/G02 OPEN |
| private·철회 | 권한/사이트 J07/J08; STEP4A T03, DB4/11, A01 | server projection·현재 반환 권한·known revoke client 무효화가 분리됨. 이미 적법하게 전달한 정보 회수 불가와 철회 경계 이후 새 제공 차단을 함께 명시. channel cache와 source-table RLS를 동일시하지 않음. PASS/G03 OPEN |
| Data API/사이트 권위 | 권한/사이트 J07/J09; DB Data API, 개발 §11 | RLS/privilege 구별·browser service credential 금지, auth/profile freshness와 invite/Registry/공개 표시의 비권위성이 유지됨. 실제 최종 GRANT/정책/배포 PASS 주장은 없음. 현행 상세 의무를 삭제하는 override도 없음. PASS |
| 재대결/비DB 대응 | 모델 품질 J06; DB1~11, 개발 §10B | 11개 대응 전수 유지·private 없음도 검증. hostless 최초 시작을 host 재대결 면제로 사용하지 않음. fake Room 금지와 현행 제품 의무의 충돌은 G06 상위검토로 남김. PASS/G06 OPEN |
| crash·영속·효과 | 모델 품질 J04/J05; 계획 §2 안전성, STEP4A 장기 상태 | graceful 종료와 crash, in-memory와 durable 확정, prediction과 공식 결과를 구별. old owner fencing·결과 소비 dedupe를 요구하되 자동 failover나 구현 완료를 주장하지 않음. PASS/G04 OPEN |
| 공급자/transport/운영비용 | 실행/운영 J10/J11/J12 | 후보/방향 채택과 production 조합 확정의 차이가 명시됨. 부하/예산 수치 발명·SKU/SDK 범위 확대·가격표→총견적 전이가 없음. 확인일/판본 한계와 재확인 조건 유지. PASS/G01/G05 OPEN |
| 후속·완료 표시 | 미결정/후속, CURRENT/CP0048, 계획 STEP4B | 4B IN_PROGRESS, 5A 이후 미착수, 감사/승인 별도. 권한·복구 공백을 STEP6 명칭 결정만으로 닫지 않도록 차단함. 문서 PASS를 전체 완료로 승격하지 않으면 정합. PASS |

## 반례 대입

이는 문서 계약의 논리 검토이며 실행 테스트가 아니다.

| 반례 | 문서가 허용/거부해야 할 결과 | 감사 판정 |
|---|---|---|
| 같은 room 재대결 뒤 높은 version의 이전 match 응답 | 숫자 비교 전에 의미/owner 확인; 이전 effect 거부 | J02/J05와 STEP4A T01 일치 |
| A→B→A 후 이전 A의 null/error/finally | 새 A 상태·busy·구독을 지우지 않음 | J05는 STEP4A 전체 경로를 유지 |
| participant→spectator 후 동일version private 응답 | 이전 view 사용 차단; 현재 권한을 재확인한 별도 projection만 채택 | J07/J08은 version으로 권한 차이를 덮지 않음 |
| 기존 명령 commit 후 탈퇴하고 같은 action id 재전송 | mutation을 반복하지 않으면서 저장 private 응답도 무조건 반환하지 않음 | J04와 H04/H05에 명시. 기존 SQL 경로는 관찰 근거일 뿐 이번 취약점 재현/수정이 아님 |
| 최초 동기화 성공 후 마지막 알림만 유실 | 독립 reconciliation 또는 제한 내 명시 실패 | J03/H01에 남아 있음. 실제 방식/상한은 G01/G02 미해소 |
| RLS 관계 철회 후 client가 JWT 갱신에 협조하지 않음 | 오래된 channel policy만으로 private 전송 지속을 안전 판정하지 않음 | J08/G03 보류가 타당하며 A01과 부합 |
| 서버 crash 뒤 구 owner/update가 도착 | durable 약속·새 owner 경계에 따라 차단/복구, 임의 성공 결과 생성 금지 | J02/J04/H07은 요구를 보존; 실제 증거는 G04 미해소 |
| hostless 초기 시작 규칙을 재대결에 전이 | 현행 host/ready UX를 임의 생략하지 않음 | J06/G06은 별도 상위 검토를 요구 |

## 공식 원문 선택 재확인

확인일 2026-10-04 KST. rolling 문서이며 프로젝트 배포 release/SLA 인증이 아니다.

| ID | 원문과 선택 절 | 이번 확인·범위 |
|---|---|---|
| A01 | [Supabase Realtime Authorization](https://supabase.com/docs/guides/realtime/authorization), Interaction with Postgres Changes / Updating RLS policies | channel policy cache·연결/새JWT 갱신·철회 지연 설명을 재확인. J07/08의 주의·G03 보류와 부합. source-table row RLS의 모든 내부 동작이나 사이트 즉시철회 SLA는 입증하지 않음 |
| A02 | [Postgres Changes Troubleshooting](https://supabase.com/docs/guides/troubleshooting/realtime-postgres-changes-troubleshooting), Step6/Step8 | SUBSCRIBED와 replication 준비 gap, 전달 유실 가능을 재확인. J03의 초기/지속 reconciliation 필요와 부합. 별도 SDK 준비신호 연결·atomic snapshot cut·실험 통과는 입증하지 않음 |

가격·Nakama·Photon·타 SDK/transport·운영 구성은 이번 새 확인 대상이 아니다. 문서가 기존 확인 이력으로만 제한해 썼는지를 감사했으며 최신 가격 보증이나 적합성 확정으로 읽지 않는다.

## G01~06의 닫힘 조건과 전체 완료 판단

| 게이트 | 유지된 사유·필요 증거 | 감사 이후 상태 |
|---|---|---|
| G01 | 경험/동접/지역/rate/크기/지연·staleness/예산 미입력; 후속4B 요구·측정 기준 승인 필요 | OPEN; 숫자/성능 충족 미확정 |
| G02 | 실제 SDK·handoff/cut·마지막 알림 유실·gap/overflow 증거 없음; 4B 프로토콜/실험계획 후 실제 검증 필요 | OPEN; 복구 지원 PASS 금지 |
| G03 | auth bridge·철회 직렬화/cache/in-flight/duplicate 응답 미해소; 서버 집행/실패정책과 oracle 증거 필요 | OPEN; private stream 선택 금지 조건 유지 |
| G04 | durability/RPO/RTO·crash·old-owner fencing·보존 미정; 4B 실패정책과 장애 검증 필요 | OPEN; in-memory/graceful을 crash 보장으로 승격 금지 |
| G05 | 제품/SKU/SDK/browser/지역/배포/운영담당·비용 미정; 구현 전 후속4B 선택/보류 갱신 승인 필요 | OPEN; 특정 backend/transport 채택 미확정 |
| G06 | roomless/hostless 재대결·11개 동등의무 적용 충돌; 필요 STEP2/Architecture Change·영향 감사/승인 | OPEN; 규칙 면제 미승인 |

G01~06은 새로 발견한 반영 결함이 아니라 정식 제출에 이미 명시된 미결정이다. 그것을 정확히 남긴 점은 PASS지만, **권한·복원 공백이 있는 상태를 STEP4B 전체 완료/다음 STEP 자동 진입 근거로 사용할 수 없다.** 계획의 STEP4B 게이트에 따라 관련 설계 결정은 STEP4A/4B 범위에서 해소해야 한다. 실제 장애·부하·보안 검증의 수행 시점과 설계 결정의 닫힘은 구별하며, 설계 단계에 구현을 선행 요구한 것으로 해석하지 않는다.

## finding·한계·제출

새 수정 요구 finding: **0건**. 확인한 범위에서 누락·의무 약화·Core 확대·보류 승격·지원 과장을 발견하지 않았다. 알려진 G01~06을 감사 통과로 닫지 않는다. 이후 새 증거가 나오면 그 범위에서 재검토가 필요하다.

전체 checkout/Guard CLI, runtime/unit/build/DB/browser/production, 실제 권한 철회 경합·부하·장애 주입은 NOT_RUN이다. [감사 검증 기록](step-4b-post-audit-validation.md)에 실행한 문서/범위 검사를 기록한다. source 관찰·문서 반례 대입은 실행 PASS가 아니다.

이번 변경은 감사 보고서·검증·CURRENT·분담·CP0049에 한정한다. 고정 정식6문서와 원본 판단/조사/검토/trace를 보완하지 않았다. 다음은 사용자 감사 결과 검토와 후속 범위 지정이며, 미해소 게이트의 설계 보완이 필요하면 별도 요청으로 STEP4B 안에서 진행한다. 이번 결과/기록 원격 제출 뒤 정지한다. 산출물 보완·구현·STEP5A·병합·main 반영은 수행하지 않는다.
