# STEP4B — CP0061 운영 근거 기반 후속 설계 판단

2026-10-06 KST. 고정 입력 CP0061 `b564d71b88e8317116cae8111a7c52b0b1206858`. 시작 PR412 HEAD와 일치, 추가 변경 0. 기존 branch/base 유지. 역할명 Astra는 설계 판단 책임이며 별도 모델 또는 독립 감사 실행 인증이 아니다. [근거·비용](step-4b-operations-design-evidence.md), [T/B 보완](step-4b-operations-specification-amendments.md), [검증](step-4b-operations-design-validation.md).

## 1. 결론과 입력의 효력

**전체 목표 동시 충족은 증거 부족/HOLD다.** CP0061은 운영 시간과 시험 기본 조합을 구체화하고 현재기간 사용량을 관측했다. G03의 모든 철회와 최종 외부 반영·송신을 연결하는 지원 계약은 새로 확보하지 못했다. A안의 안전성, 저빈도 DB 우선, 분리 archive 우선 검토를 유지한다. 제품·알고리즘·cut 주기 최종 채택, 정식 계약 변경, 게이트 해소는 하지 않는다. 이번 판단은 CP0060 J60-01~08의 필요조건을 더 구체화한 것이며 B안으로 전환하지 않는다.

| 근거 종류 | 사용할 수 있는 결론 | 확대할 수 없는 주장 |
|---|---|---|
| 저장소 정적 정의 | CDN `@supabase/supabase-js@2`, signOut scope 생략, 고정 입력 소스의 함수·호출 정의 | 실제 브라우저 exact SDK/auth-js 버전, migration 운영 적용·모든 writer |
| CP0059 운영 metadata + CP0061 관찰 | 선택 함수12개 body MD5·ACL 재조회 일치; 이번 SELECT1의 시각과 범위 | 전체 환경 원자 snapshot, 전수 writer 감사, 안전성 보증, 미래 adapter의 postgres 권한 채택 |
| 사용자 정보/Dashboard | 평일20~24 KST·주말 “풀”, Windows10/11·개인 iPhone iOS18.7.8(사용자 표기), Chrome/Edge/Safari 기본 조합; 현재기간 조직 사용량 | 24/7 모니터링·수면 중 경보 인지, exact build·시험기 접근, 전체 월 소비·프로젝트 단독 사용량 |
| 공식 지원 설명 | JS default global, JWT 잔존·Realtime cache·Free 제한·CLI 범위 | 모든 Auth R과 외부 C/P 원자성, 실제 계정 청구, 성능·복구·삭제 보증 |
| 설계 추론 | 아래 순서·증거·운영 예산 필요조건 및 반례 | 구현 존재·시험 통과 |
| 미확인/실행 증명 | final egress fence, current authority/deletion 원천, actual wire·복구 소요·단말 manifest | 문서/계산/Governance/static CI로 대체 불가. 행동 시험 모두 NOT_RUN |

100명 총접속/판8명, 세금 포함 월추가30,000원, 원격 참여자 권위 화면까지 p95 250ms, 정상망 회복 후 재연결5초(개별 사례), 모바일 이동·상호작용·준비·종료·재접속 필수를 유지한다. 연출 축소만 허용한다. 권한 불명 즉시 보호 입력·정보 차단→해당 판 pause→최초 장애60초 내 검증된 회복 실패 시 abort다. 종료 기록은 본인 참가/필요한 현재 운영자만, 최초 권위 종결+30일 삭제, 탈퇴 식별 연결 제거다. daily 외부 백업/RPO24h, 발견 후24h 수동 안전 복구, 최근7일 복구점은 삭제 조건을 우선한다. 현재 Free·서울. p99/tick/queue/표본 후보를 새 승인 기준으로 만들지 않는다.

## 2. J62-01 — G03의 지원 가능한 구조와 배제 조건

**사전 DB allow→독립 외부 apply/send 구조는 현재 후보와 요구 충돌, 목표 유지한 대안 필요.** 전체 A안의 일반적 불가능을 증명한 것은 아니다. 현재 확인한 managed Auth·Realtime 설명과 선택 DB 함수만으로 A안 충족을 보장할 수 없다는 판정이다. 낮은 현재 사용량, 더 잦은 check, TTL 축소, event 재시도는 이 순서 문제를 해결하지 않는다.

C는 권위 상태가 실제 유효해지는 지점, P는 recipient/session/view/payload별 보호 정보가 최종 취소 불가능하게 제공되는 지점, R은 해당 권한 철회의 효력 지점이다. 세 지점과 owner/incarnation을 공유하는 검증 가능한 순서가 필요하다. check timestamp나 notify 수신시각을 R 또는 P로 대신하지 않는다. 같은 권한 범위에서 R 이후 불허 C/P 허용치는 0이다.

| 경로 | 설계상 판단과 추천 | 부족한 지원/실행 증거 |
|---|---|---|
| 승인·가입·role·permission 및 직접 SQL | actor와 target의 모든 인가 의존성, 삭제/재삽입·빈 permission 집합까지 최종 C와 함께 직렬화. helper 검사 후 target lock만으로 actor 철회를 막지 못함. 직접 SQL도 같은 순서에 참여해야 함 | 실제 writer/role membership/BYPASSRLS/owner/trigger 목록, 정책 변경·관리자 SQL 경로 통제, T01. SECURITY DEFINER의 current_user를 caller로 오인 금지 |
| Auth global/local/others·default·직접 API/console/계정 삭제 | 대상 session 집합을 정확히 구분. 사이트 wrapper만 고쳐도 독립 R 우회는 남음. actual R을 외부 fence와 연결하는 공식 지원 필요 | exact SDK/Auth 버전, scope별 효력·응답 경계, API/관리 콘솔 경로, 지원되는 lock/extension 계약. internal table read 권한만으로 해결 아님 |
| JWT/session 만료·refresh | 시간에 따른 무효화도 최종 C/P에서 유효해야 함. row 존재는 만료·철회 부재의 충분조건 아님. transaction 시작 시각으로 긴 pause 뒤 유효성 판단 금지 | 서버 clock 오차 한계·expiry 판정·refresh 경합·최종 effect 시점 검증. Free에 Pro timeout 기능 가정 금지 |
| DB check 뒤 simulation C | allow→pause/partition→lock 소실→R→늦은 apply 반례를 제거해야 함. DB에 완전히 확정된 결과의 replay는 독립 외부 결정보다 좁은 후보이나 simulation random/tick/physics가 권위를 새로 결정하면 여전히 외부 C | DB 결정의 완전성·effect idempotency·old owner effect fence. second check 뒤 같은 틈이 남음 |
| snapshot cut 뒤 P | cut은 데이터 일관성 경계일 뿐 수신 인가 아님. view 교체, queue drain, retry·error·duplicate 응답 각각 새 P 인가. fanout도 수신자별 판정 | 최종 sender의 R/owner fence, SDK/TLS/OS/proxy/socket/실제 egress 경계 및 T02/T05 관측 |
| 유효 C 뒤 ack 유실 | mutation exactly-once와 결과 열람 권한은 별도. 같은 command의 저장 결과가 있어도 R 뒤 private duplicate 응답 금지 | dedupe payload binding·command scope와 새 P oracle, public 최소 오류의 비밀 비포함 검토 |
| old owner | DB CAS/epoch로 저장을 막는 것과 기존 socket·queue 송신 차단은 독립 의무. 새 owner 시작은 두 경계 모두 fence됐다는 증거 필요 | 저장 deny + 외부 effect/egress 0를 별도 관측. process lease 만료나 DB disconnect 로그만으로 송신 중단 선언 금지 |
| 복원 | 새 incarnation, 옛 owner/session 차단, 현재 승인/역할 확인이 열기 전 필수. 복원된 DB epoch/권한을 현재 원천으로 재사용 금지 | rollback과 독립된 기준 원천·fail-closed·옛 credentials/socket 경계, B05/B06 |

**추천 연구 구조는 모든 R과 최종 C/P를 같은 권위 순서 및 effect/egress fence에 참여시키는 방식이다.** 기존 CP0060과 방향 차이는 없다. DB 저빈도는 workload/비용 방향이며 인가 유예 허용이 아니다. 송신자에게 R이 전달되지 않은 두 실행이 동일하게 보이면, 계속 보내는 구현은 R 발생 실행에서 위반한다. 따라서 event-only 통지로 해결하지 못한다. R을 fence 완료까지 지연시키는 방식도 managed Auth/direct SQL의 실제 효력보다 R을 임의로 늦춰 정의하면 부적합하다. 필요한 공급자 계약이 없으면 현재 managed 조합의 adapter 채택 HOLD; 사용자에게 알고리즘 선택을 묻지 않고 설계 담당이 지원 가능한 경계 대안을 다시 제시한다.

P 이전 취소 가능한 app/SDK/OS 대기 데이터는 늦게 발송할 권리가 없다. P 이전이라는 명칭으로 실제 이미 나간 bytes를 숨기거나, socket.write 반환을 근거 없이 최종 P로 정하지 않는다. 검증된 P가 R 이전에 완료된 in-flight 데이터의 뒤늦은 도착은 새로운 R 이후 P와 구별하되, 그 구분을 실제 egress trace로 입증해야 한다. 이미 합법적으로 제공된 정보 회수 보장은 만들지 않는다. 경계가 안 보이면 INCONCLUSIVE/HOLD이지 위반0 PASS가 아니다.

## 3. J62-02 — 장애 종류, RTO와 운영 공백

| 사건 | 적용 정책 | 운영자 개입과의 관계 |
|---|---|---|
| 정상망 회복, 서버·DB·현재 인가 정상 | 관측된 tnet부터 새 인가·최신 view LIVE까지 각 재연결5초. p95로 변경 금지 | 수동 근무 시간과 무관하게 구현·시험할 목표 |
| 권한 확인 불가 | 즉시 C/P 차단·판 pause. 최초 t0 불변. t0+60초 전 검증된 회복 없으면 abort; 정각은 abort 우선 | 60초는 인가 유예가 아니며 반복 retry/새 owner가 timer를 리셋하지 않음. 사람 대응을 기다리지 않음 |
| game server crash | durable start/terminal과 미종결 판을 구분; 이미 durable한 종료 보존. 저장 실패를 성공으로 응답 금지 | DB 재해 RPO24h를 정상 DB의 durable 기록 손실 허용으로 사용 금지 |
| DB 재해 | verified cut 기준 RPO24h 목표, 발견→삭제·현재권한 검증 후 안전 개방24h 목표 | 자동 안전 차단과 수동 복구 업무는 별도. 24h 미달이면 기록하고 계속 닫힘 |

시점 정의: `tincident` 실제 재해 발생/손상 시작(모르면 범위), `tdiscover` 시스템 또는 사람이 재해를 처음 확인한 시각, `talert` 경보 발행, `tack` 담당 인지, `tstart` 복구 착수, `trestore` 데이터 복원 완료, `tverify` 삭제/권한/owner/기록 검증 완료, `topen` 안전 개방이다. 경보가 발견을 가능하게 한 경우도 원문 증거를 남긴다. 목표는 `topen-tdiscover≤24h`; 감지 지연은 `tdiscover-tincident`로 별도 보고한다. 착수 시각을 발견 시각으로 바꾸지 않는다.

평일00시 직후 발견→20시 즉시 인지·착수라는 조건이면 대기 약20h, 나머지 약4h다. 이 4h는 복원만이 아니라 격리/fence·삭제·현재 권한 확인·검증·개방을 모두 포함한다. 자동 경보가 있어도 즉시 인지는 보장되지 않는다. 주말 “풀”은 상시 모니터링 또는 수면 중 착수 약속이 아니다. 공휴일/부재/대체 담당은 UNKNOWN이다.

**RTO는 증거 부족/HOLD.** 평일 연속 작업 가능한 창은4h이므로 4h 이내 절차가 필요할 수 있지만 그것만으로 충분하지 않다. 예: 월23시 발견 후 필요한 실작업5h를 24시에 멈추고 화20시에 이어 하면 화24시, 발견부터25h로 실패한다. 절차를 중단·재개할 수 있는지, 자정 이후 자동 검증/작업이 안전하게 계속되는지, 인지/준비 손실과 예외 일정까지 계산해야 한다. 업무 시간 밖 수동 작업을 새 의무로 가정하지 않는다.

추천은 자동 격리/사전 검증·복구 준비로 수동 임계 작업을 줄이고, 후속 모의복구에서 calendar를 적용해 최악 구간을 측정하는 것이다. 공휴일/부재 대체 대응 가능성은 사용자 정보가 필요하다. 외부 유료 당직은 월3만원과 함께 견적 비교할 후보이며 자동 채택하지 않는다. 대체자가 없다고 목표를 낮추지 않으며 개방 조건 HOLD로 명시한다.

## 4. J62-03 — RPO 일정의 필요조건

RPO는 재해 시점에서 **그때 검증 완료되어 사용 가능한 가장 최근 복구점의 consistent cut**까지의 나이다. cut 시각, 전송 완료, 검증 완료는 다르다. 뒤늦게 검증한 사본을 당시 사용 가능했다고 소급하지 않는다. Δ=정상 cut 최대간격, v=전송·검증 최대지연, m=실패로 인한 추가 cut/검증 지연의 최대여유로 정의하면, 제한한 장애모형에서 `Δ+v+m≤24h`가 충분조건 후보다. m에 검증 지연을 중복 합산하거나 실패 감지부터 사람 도착시간만 넣어 재시도 실행시간을 빼지 않는다.

24h마다 cut+양수 v는 최악 시점24h를 초과한다. 12h cut 후보에 사람만의 복구 여유20h를 넣으면 `12+v+20>24`라 충돌한다. 사람이20h 뒤 처음 복구할 수 있는 모형에서는 Δ≤4-v가 필요하지만 이는 충분 보증도 새 주기 승인도 아니다. 백업 source/목적지가24h 넘게 사용 불가하면 짧은 주기만으로 목표를 지킬 수 없다.

| 후보 | 판단/추천 이유 | 채택 전 증거 |
|---|---|---|
| 매24h cut, 다음 근무 때 수동 retry만 | 현재 후보와 요구 충돌 | 양수 검증지연·20h 공백 반례. 단순 daily job 성공 표기 배제 |
| 추가 cut/증분 + bounded 자동 retry | 조건부 가능, 우선 구조 검토 | source 독립성, 실패 감지/백오프·재시도 종료·검증 최대시간, 증분 체인 일관성·삭제 반영, 전체 반출 비용 |
| 독립 감시 | 조건부 필요 구성. last verified cut age/정지한 scheduler/기준 원천 freshness 감시 | 같은 서버 고장에 같이 멎지 않는 경로·실제 알림/인지. 감시만으로 복구 여유가 줄었다고 주장 금지 |
| 운영자/대체 담당 신속 대응 | 조건부 보조 | 실제 가능한 요일/시간·경보수단·예외/대체 인지·착수시간과 비용. 24/7 자동 가정 금지 |
| 추가 목적지·분리 failure domain | 조건부 대안 | 동일 credential/source 고장 동시 실패, 삭제 전파·추가요금. 사본만 늘려 RPO 해결했다고 하지 않음 |

일정/제품은 아직 채택하지 않는다. 검증된 복구점 age가 한도를 넘거나 연속 실패하면 목표 미달을 기록한다. 새 게임 중지를 선택하더라도 과거 백업 age가 줄거나 기존 사이트의 모든 쓰기가 멎는 것은 아니므로 RPO 충족으로 바꿔 기록하지 않는다. 자동 안전성 차단과 backup 서비스 품질은 별도다.

## 5. J62-04 — 복원·삭제와 현재 기준 원천

**분리 archive는 조건부 가능, 실제 방식 채택은 HOLD.** 최소 종료 기록과 참가자 식별 연결을 분리하면 탈퇴 시 연결만 제거하고 다른 참가 기록의 원래 deadline을 유지할 수 있다. random ID/hash 자체도 연결 가능성이 남으면 개인정보 제거 증거가 아니다. 기록 본체도 최초 종결+30일에 사라져야 한다. 7일 복구점은 현시점의 허용된 데이터만 복원 가능한 논리 복구점이며, 삭제된 자료까지 원상복원할 권리가 아니다.

| 방식 | 판단 | 필요한 검증 |
|---|---|---|
| deadline별 archive + 분리 식별 연결·manifest | 우선 검토 유지. 식별 연결은 개별 탈퇴에도 제거 가능해야 함 | 정확한 deadline·모든 version/temp/upload, FK·허용 데이터 복구 완결성, 삭제와 manifest publish 경합 |
| 분리 암호화 + 검증된 key erasure | 조건부 대안, 암호화만으로 완료 아님 | 키/복제키·wrapped key·로그·메모리·평문/tmp·복원용 키 백업 전부 소거 또는 접근 불능의 지원 계약, per-record/per-identity 영향범위 |
| 복구점 재작성 | 조건부 대안 | 7일 각 복구점 교체·검증 완료 전에 deadline 미루지 않음; 원본/version/작업자 복사 제거, 재작성 중 장애와 비용 |
| immutable full PII dump를7일 유지 | 현 요구와 충돌 | 29일 된 기록의 dump가36일까지 남는 반례. 복원 후 filter로 원본 보존을 정당화할 수 없음 |

공식 S3 lifecycle은 비동기 제거이며 versioning 시 current에 delete marker만 만들 수 있다([근거 S62-10](step-4b-operations-design-evidence.md)). 이를 정확한 deadline 전체 사본 삭제 계약으로 사용할 수 없다. 이 사실을 Lightsail의 모든 삭제 API 의미로 확대하지도 않는다. 실제 제품·API별 삭제/fence/versions 지원과 관측이 필요하다. 삭제 성공을 요청 접수/숨김/암호화로 대신하지 않는다.

추천 필요조건은 **복구 데이터와 함께 rollback되지 않는 현재 삭제·권한 기준 및 publish fence**다. 예를 들어 삭제 의도만 DB에 쓰고 외부 원천에 쓰기 전 crash하면 오래된 archive가 살아남고, 외부에만 쓴 뒤 DB 실패하면 미완료 상태가 생긴다. 두 시스템의 write가 원자적이라고 가정하지 않는다. 권위 의도의 내구성→각 사본/queue/upload 차단·삭제→검증된 완료의 상태를 복구 가능한 절차로 연결하고, 부분 실패에는 완료 응답/개방을 금지하는 계약이 필요하다. 이것은 특정 log/consensus 알고리즘 채택이 아니다.

기준 원천도 복원/롤백되거나 freshness를 확인할 수 없으면, 신규 incarnation으로도 현재성이 증명되지 않는다. 보호 서비스는 닫고 현재 권한 재확인을 요구한다. 재승인은 앞으로의 접근만 고치며 이미 백업에 되살린 식별 연결의 삭제 증거를 대신하지 못한다. tombstone은 재생성 가능한 모든 오래된 사본/명령/키의 수명 종료와 제거 증거에 연동해 최소화해야 한다. 그 상한을 모르면 무기한 보존을 승인받은 것처럼 쓰지 않고 설계 HOLD다. log ID 자체의 연결 가능성도 검토한다.

서버 crash에는 durable terminal을 보존한다. DB 장애 중 판이 중단됐지만 최초 terminal 시각이 메모리에만 있다면, crash 후 뒤늦은 저장시각을 최초 종결로 바꿔30일을 늘릴 수 없다. 최초 종결의 내구 anchor/미확인시 처리와 안전한 재시도는 T09/B02 증명 항목이다. terminal 저장 실패 중에도 판이 재개되거나 보호 송신이 계속되어서는 안 된다.

## 6. J62-05 — 비용·품질·사용자 정보와 다음 작업

현재 조직 사용량은 관측값이고 오픈 후 부하는 UNKNOWN이다. 비용 근거 문서의 계산상 Free서울+2GB IPv4 VM+외부5GB bucket은 우선 비교 후보지만 전체 안전성/100명/품질/복구/삭제/월3만원 동시 충족은 HOLD다. 낮은 관측 peak4나 DB55MB를 성능 여유·dump wire로 사용하지 않는다. [명세 보완](step-4b-operations-specification-amendments.md)의 Windows10/11 Chrome/Edge 및 iPhone Safari manifest와 실제 원격 참여자 frame 관측이 필요하다.

사용자에게 필요한 것은 아래 운영 사실뿐이다. G03 순서·archive 알고리즘·제품은 설계 담당 책임이며 사용자에게 선택을 전가하지 않는다. 이미 정한 정책은 재질문하지 않는다.

| 우선순위/필요 정보 | 선택지 | 추천/이유 | 미응답 시 처리 |
|---|---|---|---|
| 1 공휴일·부재·주말 실제 인지/착수 가능 범위, 자정 작업 연장·대체 담당 유무 | 가능한 예외 대응/대체자가 있음 / 현재 시간 외 대응 불가 / 아직 모름 | 실제 가능한 범위만 기록하고, 가능한 경우 부재시 대체 경로 확보. 24h 복구의 가장 큰 미확인 | UNKNOWN,24/7 약속 금지·RTO HOLD. 유료 서비스는 견적과 별도 결정 |
| 2 시험기 접근 | Windows10/11 각 환경과 iPhone에 접근 가능 / 일부만 가능 | 실제 접근 가능한 장비와 iPhone 모델·OS build·Chrome/Edge/Safari 버전만 제공. 비밀정보 불필요 | 빠진 manifest는 시험 준비 HOLD. OS18.7.8은 사용자 표기 유지 |
| 3 비용 귀속 자료, 가능할 때 | 프로젝트별 현재기간 meter/비밀 없는 견적 제공 / 조직 화면만 가능 | 동일 기간·scope가 보이는 화면 또는 수치. 기존 관측을0으로 만들지 않고 중복/누락 방지 | 프로젝트 소비·미래 사이트 소비·실청구 UNKNOWN, 총비용 HOLD |

| 게이트 | 현재 상태 | 남은 결정 | 필요한 증거 | 다음 담당 작업 |
|---|---|---|---|---|
| G01 | PARTIAL/OPEN | 시험 환경·표본 후보, 제품은 미채택 | 100명/판8,remote-frame p95≤250ms,개별 reconnect≤5s,모바일5기능 | Sol manifest → 별도 허용 단계 QA/성능 |
| G02 | PARTIAL/OPEN | 최종P/복구 LIVE 경계의 구현 계약 | T04~07/T13,최초60초·정각abort,늦은 callback 전수 | Sol 관측점 자료 → 서버/client 구현·시험 HOLD |
| G03 | OPEN/BLOCKING | 모든R와최종C/P/egress를잇는지원가능구조 | 공식 scope/fence 계약·전수writer·T01~05/T08/T10 | Sol 지원질문/버전·권한자료 최우선 → Astra 구조 재판단 |
| G04 | PARTIAL/OPEN | archive/원천/실패절차·일정·운영예외 | B01~07/T09/T11/T14,사본삭제·실제RPO/RTO | Sol inventory/운영calendar/시간예산 → 후속 복구 시험 HOLD |
| G05 | PARTIAL/OPEN | 전체예산에맞는조합·계량/수수료 | wire·검증/복원/삭제·기존소비·세금총액 | Sol 공식quote/계량조건 → 허용 단계 실측 |
| G06 | SCOPED_DESIGN_RESOLVED | 두 Probe 적용 판단만 유지 | 새 전체 지원/실행 증거 없음 | 기존 범위 유지 |

다음 Sol은 반복 fingerprint 조회보다 ① 모든 R/최종 C/P에 대한 지원 질문의 검증 가능한 답변 요구사항 ② exact SDK/Auth/CLI·caller/writer/최소권한 manifest ③ 사본·삭제 기준 원천·cut/검증·운영 calendar inventory ④ 프로젝트 scope/제품 견적·단말 자료를 우선 준비한다. 지원 문의는 아직 초안만이며 실제 전송하지 않는다. 자료 확보 자체가 final 구조 채택이 아니다. 실행 관측점 설치·권한 변경·adapter·backup job·부하/장애/삭제/복원 시험은 후속 별도 허용 단계로 분리한다.

STEP4B IN_PROGRESS / 전체 완료·구현 HOLD. 과거 판단·감사·명세·checkpoint와 정식 산출물 보존. DECISIONS에 신규 정책/제품/알고리즘 채택을 추가하지 않는다. 원격 제출·내용 일치 확인 뒤 정지한다.
