# STEP4B — CP0059 지원 근거 기반 핵심 설계 후속 판단

2026-10-06 KST. 고정 입력 CP0059 `8af1029ab1aefeda1081b86e8d83faa2509a13d9`. 시작 PR412 HEAD 일치, 추가 변경0. 기존 branch/base 유지. Astra 성격의 구조 판단이며 별도 모델 실행·독립 감사 인증이 아니다. [입력 근거](step-4b-support-readonly-evidence.md)·[실제 metadata 원본](step-4b-operational-metadata-snapshot.json)·[CP0057 판단](step-4b-free-seoul-design-judgment.md)·[확정 사용자 결정](step-4b-retention-recovery-user-decisions.md)을 검토했다. 과거 원본은 보존하고 이 문서와 [명세 보완](step-4b-support-specification-amendments.md)을 후속 판단으로 연결한다.

## 1. 결론

**현재 증거로 A 안전성과 모든 품질·비용·복구 목표를 함께 충족하는 배포 구성을 확정할 수 없다. G03 OPEN/BLOCKING, 전체 STEP4B IN_PROGRESS/구현 HOLD를 유지한다.** 모든 가능한 기술이 불가능하다는 결론은 아니다. 다만 DB 사전 allow와 외부 apply/send를 분리하고 managed Auth R이 독립적으로 진행하는 구조는 아래 반례를 허용한다. 이 구조 계열은 단순 추가 성능 시험을 기다리는 상태가 아니라 A 충족 주장 자체를 배제한다.

| 판단 | 설계상 결론·추천 | 남은 증거 |
|---|---|---|
| J60-01 | A 기준·DB 저빈도 우선 유지. 사전 allow/TTL/event cache만의 외부 C/P 허용은 배제 | 지원되는 모든 R↔최종 C/P 연결 구조 없으면 runtime 채택 HOLD |
| J60-02 | DB 내부 C와 외부 권위 C·최종 P를 각각 분리. 제어·최소 기록 DB transaction 우선은 조건부 | actor와 target 권한 재검증·Auth R/expiry·실제 격리/lock 증명 |
| J60-03 | 명시적인 단일 권위 순서와 최종 egress 집행점을 갖는 구조를 우선 조사 | managed Auth/직접 SQL이 참여 또는 동등한 fence를 제공한다는 공식 계약 필요. 구현 채택 아님 |
| J60-04 | 최초 장애 deadline 도달 전 검증된 복구만 재개, 정각은 중단 우선 | t0 신뢰 원천·process pause/clock uncertainty·durable abort 시험 |
| J60-05 | 최초 terminal 시각·삭제 deadline 불변, 저장 불명은 PENDING. 데이터 손실 허용과 권한 rollback 분리 | 최초 시각의 crash 내구성·terminal once·삭제 원천/복원 검증 |
| J60-06 | 복원은 폐쇄 격리·새 incarnation·현재 권한 확인이 선행. 확인 불가하면24h 목표를 위해 개방하지 않음 | old owner egress 차단·session invalidation·현재 승인/탈퇴 source |
| J60-07 | record/identity 분리와 deadline에 맞춘 삭제 가능 archive를 우선 정밀설계 후보로 추천 | exact deadline·탈퇴·모든 사본·7일 복원성·비용 증명 전 알고리즘 채택 HOLD |
| J60-08 | 검증 완료 복구점의 나이24h를 관리. 정확히24h 간격+양수완료지연은 충분하지 않음 | 추가 cut/증분·실패여유·감시·대응시간과 비용의 결합 명세 |

위는 후속 설계 판단의 범위다. 정식6문서·DECISIONS의 기존 승인 정책·사용자 요구를 대체하지 않는다. 모든 gate 실행 증명은 NOT_RUN이다.

## 2. 확인 수준과 운영 정의 해석

CP0059 metadata는2026-10-05 23:08 KST 부근의 독립 SELECT10개다. Free·서울·PG17.6/17.6.1.084, migration155건, 선택12함수의 정의/MD5·ACL·RLS·trigger·FK를 확인한 당시 관찰이다. 이번에는 해당 파일과 고정 Git blob을 검토했으며 운영 재조회나 전수 writer 감사를 수행하지 않았다. 선택 함수 정의 MD5 재계산은 원본 전사 검증일 뿐 현재 운영 불변의 증거가 아니다.

| 분류 | 확보된 내용 | 해석 한계 |
|---|---|---|
| 저장소 정적 | 호출 wrapper·floating SDK `@2`·migration 정의 | 실제 로드 patch/bytes·운영 전체 적용과 다름 |
| 운영에서 읽힌 정의 | 역할/status RPC의 advisory lock73624721·target profile lock, permission DELETE/INSERT·가입 함수·RLS/ACL | auth R·외부 C/P 공통 직렬화 아님. snapshot은 원자적이지 않음 |
| 공식 지원 | session_id/table 연계, signout scope·JWT 잔존, PG lock, CLI 범위·서비스 제한 | 최소권한 adapter API와 외부 release 원자성 지원 보장은 미확인 |
| 설계상 결론 | 사전 allow 경합·독립 R과 final P의 관측 불가·old owner fence 분리 | 분석 반례이며 실행 trace 아님 |
| 미확인 | 모든 writer·Auth 설정/버전·SDK queue·실제 usage·backup 지원 조합 | UNKNOWN. 없다는 뜻 아님 |
| 실행 증명 필요 | T01~14/B01~07 및 이번 보완 | 전부 NOT_RUN. Site static checks는 대체 불가 |

실제 RPC는 actor 권한을 검사한 뒤 target lock에 도달한다. target profile lock만으로 actor의 운영 권한 감소와 해당 RPC 효과가 함께 직렬화된다고 할 수 없다. 호출 주체의 status/role/permission, 대상의 status/role, session과 membership 등 의존 권한을 모두 고려해야 한다. actor 검사 뒤 기다리는 동안 actor가 철회되는 경합을 T01에 추가한다. 이는 선택 정의의 위험 분석이며 현 사이트 취약점 재현 결과는 아니다.

system_admin_set_permissions의 DELETE/INSERT는 행이 없거나 재삽입되는 경우까지 안정된 scope 경계가 필요하다. status/role RPC의 공통 advisory key를 이 함수·Auth·직접 SQL도 자동 준수한다고 추정하지 않는다. private.is_admin과 public.is_admin의 서로 다른 의미도 adapter에서 혼용하지 않는다.

bootstrap_system_admin의 SECURITY DEFINER 내부 current_user는 caller가 아닌 실행 권한 주체가 될 수 있다. 따라서 body의 current_user 조건만으로 caller 검증이 된다고 설명하지 않는다. 관찰된 EXECUTE ACL과 owner·role membership·exposed schema를 함께 대조해야 한다. service_role/postgres의 접근은 제품 운영자 열람 권한과 별개다. auth table SELECT가 postgres에 가능했던 사실은 game adapter에 같은 권한을 부여하는 승인이나 지원되는 lock protocol의 증거가 아니다.

## 3. G03 — 순서와 외부 경계

C는 권위 mutation, P는 구체 수신자/session/view/payload의 최종 정보 release, R은 그 권한의 실제 철회 효력이다. R을 이벤트 도착·다음 poll·game adapter 인지 시점으로 늦추지 않는다. C<R로 이미 유효한 mutation은 취소된 것으로 만들지 않되, R 뒤 결과 응답은 별도의 P 인가가 필요하다.

안전성 반례: DB allow 반환 → 프로세스 정지 또는 연결 손실 → DB lock 해제 → R 확정 → old process 재개 → 외부 C/P. 마지막 순간 DB를 한 번 더 조회해도 그 조회와 외부 효과 사이에서 같은 반례가 생긴다. timeout·짧은 TTL·heartbeat는 간격을 줄일 뿐 순서 보장이 아니다.

더 강한 구분: 외부 송신자가 마지막으로 본 상태가 같은 두 실행을 생각한다. 한 실행에는 R이 없고 다른 실행에는 독립 managed Auth R이 이미 일어났지만 통지가 지연된다. 송신자는 두 실행을 구별하지 못한다. 동일한 로컬 판단으로 P를 허용하면 후자에서 의무를 위반한다. 따라서 그 구조에서 즉시 철회와 계속된 보호 송신을 함께 보장한다고 할 수 없다. 동기화된 권위 경계 또는 동등한 외부 fence의 지원 증거가 필요하다. 장애를 감지한 뒤 fail-closed하는 정책만으로 감지 전의 틈을 해결하지 않는다.

| 경계 | 판단·추천 | 탈락 조건/필요한 증명 |
|---|---|---|
| DB C | 권한·actor/target·owner·dedupe·effect를 같은 유효 순서로 검증하는 방향 유지 | non-key status변경에 KEY SHARE만 사용, auth expiry를 row lock으로 정지시킨다는 주장은 불충분 |
| 외부 C | DB가 구체 결과 전체를 권위로 확정하고 외부는 재구성만 하거나, 외부 권위 자체가 모든 R과 직렬화되어야 함 | 독립 simulation tick/충돌/난수의 새 결정은 단순 재생이 아님. DB 전체권위 전환도 성능/예산/장르 영향 미검증 |
| 최종 P | 최종 정보 release 집행 주체에 모든 writer의 R 및 owner/view 변경을 연결하는 구조 우선 조사 | outbox·snapshot·permit·일반 send() 호출 시점을 편의상 최종 P로 이름만 바꾸면 탈락 |
| 관리 SQL·Auth | 모든 권한 감소 경로가 차단 protocol에 참여하거나 이미 지원된 fence로 동일 의무를 충족해야 함 | 앱 logout wrapper만 고치고 직접 API/콘솔/SQL을 남기면 불충분. 삭제/만료도 예외 아님 |
| owner | 저장 CAS/epoch와 egress의 current incarnation/owner 검증을 별도로 집행 | old process가 queue/socket을 보유한 채 새 owner가 시작할 수 있으면 새 lease만으로 부족 |
| duplicate | command identity/hash의 mutation once와 새로운 P 인가를 분리 | logout 뒤 cached response 또는 오류 payload에 private 결과 노출 시 실패 |

단일 sequencer/egress를 두는 추천은 실행 가능한 제품 채택이 아니다. 모든 R이 참여한다는 닫힌 writer 목록과 실제 차단 집행이 먼저다. DB 재해·process pause에서 old egress가 계속 송신할 수 없음을 증명해야 하며, DB lock을 기다리는 remote gateway만으로 충분하지 않다. R 완료를 fence 확인 때까지 늦추는 protocol도 direct Auth의 기존 성공 의미를 유지할 지원이 있어야 한다. 별도 게임 session을 추가해 Auth R과 분리하거나 B lease를 A라고 부르는 방식은 채택하지 않는다.

### Auth scope·시간 만료

default/global은 모든 대상 session, local은 요청 session, others는 요청 session 외라는 현재 공식 의미를 고정된 SDK/Auth 버전에서 재검증해야 한다. others의 client event 차이와 직접 API/콘솔을 각각 시험한다. 성공 응답/refresh 철회/JWT 만료/row 삭제를 하나의 사건으로 합치지 않는다. Free에서 time-box/inactivity/single-session 제한 기능을 기본 지원한다고 가정하지 않는다. JWT exp와 session row 존재는 서로 다른 조건이다.

시간 만료는 row writer 없이도 발생한다. check시 유효한 JWT가 final C/P 전에 만료될 수 있다. 최종 경계의 신뢰 시계·오차와 만료 판정이 필요하고, tx 시작시간을 현재시간으로 재사용하거나 refresh가 과거 허용을 연장한다고 해석하면 안 된다. 지원되는 clock uncertainty 처리가 없으면 deny/HOLD다.

### queue·in-flight

CP0057의 최종 release 해석을 유지한다. 최종 통제 경계 이전 app/SDK queue 항목은 미승인으로 취급하고 최종 인가를 수행한다. R 전에 구체 bytes가 검증된 최종 경계를 이미 통과했다면 네트워크에서 R 후 도착할 수 있다. 이것은 R 후 새로운 P를 허용하는 예외가 아니다. recipient/view/payload가 아직 결정되지 않은 허가나 취소 가능한 pre-send queue를 이미 완료된 P로 간주하지 않는다.

실제 socket/TLS/kernel 내부 queue가 이 구분에 맞는지 버전과 packet/실행 trace로 검증해야 한다. 경계를 증명할 수 없으면 해당 항목을 in-flight 예외로 빼지 말고 INCONCLUSIVE/HOLD로 둔다. old-view client 채택 차단은 별도 의무이며 악성 client의 수신 방지 대체물이 아니다. 사용자에게 이미 수신한 bytes의 회수까지 보장한다고 말하지 않는다.

## 4. G02·G04 수명 정합화

정상망 회복5초는 같은 판이 살아 있고 서버/DB/Auth도 정상인 대상 사례에서 tnet→새 인가·최신 view·조작 가능한 LIVE까지다. 서버장애/권한불명/DB재해 사례를 몰래 정상망 시험에서 제외하지 말고 별도 장애 결과로 보고한다. aborted 상태 수렴은 LIVE 성공이 아니다.

인가 불명은 다음 보호 C/P를 즉시 차단하고 해당 판을 pause한다. t0는 최초 장애 경계이며 retry·owner 교체·프로세스 재개로 갱신하지 않는다. deadline=t0+60초. 검증된 복구가 deadline보다 앞서 권위 순서에 확정된 경우만 재개할 수 있고, 정각/이후 또는 순서 불명은 abort 우선으로 판단한다. timer callback이 늦어도 기한은 늘어나지 않는다. process pause 중 정확히 UI 알림이 실행됐다고 꾸미지 않으며, 외부 egress도 deadline 이후 새 보호 연산을 허용하지 않는 별도 집행 증거가 필요하다.

최소 기록의 durable start 전에 LIVE 성공을 표시하지 않는다. terminal once는 현재 owner/incarnation+match identity+미종결 조건에서 completed/aborted 하나로 확정한다. DB ack 유실은 저장 불명, 메모리 winner는 durable completed가 아니다. 일반 서버 crash에서 durable completed를 보존하고 durable unfinished는 기존 Probe 정책에 따라 abort한다. DB 재해의 목표RPO24h는 별도다.

최초 권위 종결 시각과30일 deadline은 retry/restore로 갱신하지 않는다. 특히 pause deadline에 gameplay를 중단했지만 DB에 terminal을 못 쓴 뒤 crash하면 최초 시각을 잃을 수 있다. **나중 DB 저장 시각을 최초 종결로 자동 대체하면 보존기간이 늘어난다.** 기존 기록 §4.1은 이 경합을 충분히 해결하지 못하므로 최초 terminal의 내구성 있는 증명 또는 보수적 삭제 정책을 후속 설계에서 증명해야 한다. crash만 발생했고 그 전에 권위 종결이 없었던 사례의 recovery abort 시각과 구분한다. 원시 crash 시각을 추정하여 사실로 기록하지 않는다. 증거가 없으면 기록 저장/삭제 조건 HOLD다.

열람은 현재 site 승인/session AND (본인 참가 OR 필요한 현재 운영권한), 필요한 projection만이다. 일반 운영자 role만으로 모든 기록 열람을 허용하지 않는다. admin 필요 scope·FK/탈퇴 연결 제거·Data API 우회·SECURITY DEFINER/view 경계가 함께 검증되어야 한다.

## 5. 사용자에게 필요한 정보·선택만

확정 정책 UQ1~3을 다시 묻지 않는다. 기술 알고리즘·lock 종류·제품 버전은 담당자가 판단한다.

| 우선 | 필요한 정보/조건부 선택 | 선택지·추천·이유 |
|---|---|---|
| 1 | 실제 대응 가능 요일·시간과 공백 대응 | 본인 대응시간 명시+공백을 메울 대체 담당 또는 운영 수단 확보 추천 / 본인 단독이면 그 시간표로24h 목표 가능 여부부터 평가. 구체시간은 사용자 제공 필요;24/7 가정 금지 |
| 2 | 계정 소비·청구 자료 | 비밀없는 기간별 DB/Realtime/egress/Storage meter·청구통화/추가 유료도구 비용 제공 추천 / 자료 없으면 UNKNOWN 유지. 미래 사용량 예측 강요 아님 |
| 3 | 실제 지원 단말 범위 | 확보 가능한 PC·Android·iPhone 모델/OS 목록부터 제공 추천 / 최소 지원 범위를 제한해야 한다면 영향 제시 후 별도 선택. 최신기기만으로 모바일전체 지원 확정 금지 |
| 조건부 | 견적이3만원을 넘을 때 제품/운영 정책 | 목표를 유지한 다른 구조/제품 검토 우선. 불가가 확인된 뒤에만 예산·운영범위 선택지를 구체 견적으로 제시. 지금 증액/신규판 제한 채택 안 함 |

## 6. 게이트·다음 담당

| gate | 현재 상태 | 남은 결정 | 필요한 증거 | 다음 담당 |
|---|---|---|---|---|
| G01 | PARTIAL/OPEN | 품질계측·지원단말/망 고정 | T12/T13 remote peer end-to-end·실패/누락 포함100/8·모바일 | Sol manifest·기기자료 → 별도 허용 시험 → Astra 평가 |
| G02 | PARTIAL/OPEN | final P·cut/view·deadline 집행 계약 | T04~07/T13 순서·quiet gap·retry·60초 경계 | Sol SDK 지원목록 → 후속 구현/시험 |
| G03 | OPEN/BLOCKING | managed Auth 포함 모든 R↔C/P·owner egress 집행 가능 구조 | 공식 지원 답변 또는 정확한 버전 지원계약+T01~05/T08/T10 | Sol 제한된 증거 확보 → Astra 구조 가능성 판정 |
| G04 | PARTIAL/OPEN | 최초terminal내구성·archive/삭제 source·복원권한·운영시간 | B01~07·T09/T11/T14·사본 inventory/RPO/RTO | Sol 범위/도구/운영자료 → Astra 세부방식 → 별도 복구시험 |
| G05 | PARTIAL/OPEN | 실제 quota·총견적·빈도·제품 | 서비스별 meter·wire량·세금/운영비·부하 | Sol 자료 → Astra 조합 판정 |
| G06 | SCOPED_DESIGN_RESOLVED | 두 Probe 적용 밖 확대 없음 | 기존 판단 유지,실행 지원 아님 | 정식반영 허용 단계에서 보존 |

다음 Sol 범위는 새로운 일반 문서 반복이 아니라 미확인별 실제 확보 경로를 좁히는 것이다: 모든 writer/actor·권한 source inventory, exact SDK/Auth/CLI manifest, 지원 문의 답변이 필요한 질문과 공개지원근거 대조, billing/운영시간/단말, 사본 inventory·도구의 consistent cut 지원. 문의는 별도 전송 지시 전에는 초안만 유지한다. 자료로 답할 수 없는 항목은 왜 그런지와 필요한 실행을 적고 멈춘다.

후속 구현·시험은 별도 허용 단계다. 공통 runtime 선행 구현·증명용 prototype·Auth 철회/SQL mutation·backup job·dump·restore 실행은 이번 범위에 없다. 정식 계약·STEP5A·병합·main 반영 없이 원격 제출 뒤 정지한다.
