# STEP4B — 시험 명세 준비 (실행하지 않음)

2026-10-05. 고정 입력 CP0058 `882bc485d1b45cf40b9eb4dbc18a724de01440dc`. CP0057 판단과 [CP0054 E01~12](step-4b-preimplementation-conditions.md), [운영 근거](step-4b-support-readonly-evidence.md)를 연결한다. 상태 **SPEC_PREPARED / 모든 행동·부하·복구 시험 NOT_RUN**. 안전성 위반 허용치는 0이며 percentile로 허용하지 않는다. 아래 표의 기대 결과는 시험 통과 보고가 아니다.

## 공통 사전 조건·관측 계약

후속 담당은 격리된 시험 프로젝트·가상 사용자·PC/모바일과 재현 가능한 사건 scheduler를 준비한다. 운영 프로젝트의 logout·삭제·장애 주입은 이번 범위 밖이다. 고정 manifest에는 commit, SQL/migration 실제 적용 hash, PostgreSQL·Auth server·SDK·CLI·게임 서버·OS·브라우저·단말·transport 버전을 넣는다. 현재 확인된 운영 PG17.6/릴리스17.6.1.084와 CDN `supabase-js@2`는 현황이며, 후자는 patch 고정 버전이 아니다. 실제 로드 bytes·Auth/CLI/게임 서버 버전은 UNKNOWN. 정확한 시험 버전 확정이 선행 조건이다.

모든 사례에서 C=권위 상태 반영, P=특정 recipient/view/payload의 정보 제공, R=권한 철회 효력 발생을 관측한다. UTC와 process monotonic timestamp뿐 아니라 권위 ordering ID를 남긴다. 여러 process의 wall clock만으로 C/P/R 순서를 판정하지 않는다. match/incarnation, owner/epoch, command ID·payload hash, recipient/session의 시험용 ID, view generation, state revision, DB check/transaction/lock release, queue enqueue/dequeue, socket write·실제 egress/in-flight 경계를 남긴다. trace에 토큰·비밀번호·실사용자 데이터·보호 payload 원문을 넣지 않는다.

C/P/R linearization point와 in-flight 범위가 미확정이면 사례 결과는 INCONCLUSIVE/HOLD다. 외부 writer 및 packet 관측으로 DB 로그와 실제 반영·송신을 대조해야 한다. DB deny 로그만으로 송신 차단을 증명하지 않는다. 각 사례의 담당은 아래 표의 구현·시험 담당이며, 핵심 순서/경계 계약 확정은 Astra의 별도 후속 판단이다.

| 사례·목적/게이트·연결 | 사전 조건 → 사건 주입 순서 | 관측·합격/실패 기준 | 보존 증거·미확인/담당 |
|---|---|---|---|
| T01 DB check 이후 철회 / G03 / E01,E02 | R01~10 각 경로와 승인·가입·역할 조합을 준비 → DB allow 반환 → C 또는 P 직전 barrier → R → barrier 해제 | check 당시 권한과 최종 C/P/R ordering, owner/command/view/revision. R 뒤 불허 C/P 0. 오래된 allow 사용 시 FAIL | 경로별 trace·DB/외부 counter. 실제 직접 Auth/운영 SQL writer 목록 보완 필요 / 권한 담당 |
| T02 잠금 소실·늦은 C/P / G03,G02 / E02,E04 | lock 보유 중 process pause 또는 DB partition → 연결 종료/lock 해제 확인 → 다른 writer R commit → old process resume·queued apply/send | lock 소실 뒤 old permit/epoch로 C/P 불가. DB lock 유지 성공 사례만 있으면 INCONCLUSIVE. 늦은 외부 apply/egress 1건도 FAIL | 연결·lock·packet·process trace. 외부 adapter fence 지원 불명 / 서버·네트워크 담당 |
| T03 직접 Auth 철회·만료 / G03 / E01,E03 | global/default/local/others, 직접 API·콘솔 삭제·SQL·만료 각각 → 보호 C/P 경합; scope 밖 유효 session 대조군 | 효력 R와 token refresh/expiry/session row 변화를 별도 관측. 대상 불허 C/P 0, 비대상 정상 session 유지. JWT 남음만으로 PASS 불가 | Auth 버전·scope·응답/경계·C/P trace. 관리 콘솔 및 모든 우회 경로 지원 증거 필요 / Auth 담당 |
| T04 commit·ack 유실·중복 / G02,G03 / E05 | 유효 C commit → ack drop → R → 같은 command 재시도; payload 변조·다른 session도 반복 | C 중복 0. 기존 결과의 private response도 새로운 P 인가 필요. unauthorized duplicate 정보 제공은 FAIL | command hash·durable C·ackdrop·P deny trace. public 최소 오류 whitelist 확정 필요 / command 담당 |
| T05 snapshot cut 경합 / G02,G03 / E06 | snapshot 생성 중 R 또는 recipient/view 교체 → 전송 queue hold → 새 revision/view → release | cut 시점과 send 시점 분리. 폐기된 view/철회 recipient로 P 0; 재생성 시 새 인가·revision 일관성 | snapshot manifest·view generation·queue/egress trace. cut/전송 계약 미확정 / snapshot 담당 |
| T06 마지막 이벤트·늦은 callback / G02 / E04,E06 | 마지막 revoke/state event 유실 → quiet period → disconnect/reconnect; A→B→A 및 dispose 뒤 success/error/finally callback 지연 | 이벤트 수신 없이도 권한 불명 즉시 보호 차단. stale callback은 모든 완료 경로에서 UI/권위 상태 변경 불가. 정상 인가 후 최신 view만 LIVE | callback generation·recover revisions·quiet trace. G06 두 Probe 적용 범위 유지 / client 담당 |
| T07 권한 불명·60초 / G02,G03 / E04 | t0 최초 권한 확인 장애 → 보호 입력/출력 시도 → 반복 retry·복구 성공/실패를 t0+60초 직전/정각/이후에 주입 | 즉시 차단·해당 판 pause, 재시도는 t0 갱신 불가. deadline까지 유효 복구 확인 못하면 terminal abort. 60초 인가 유예 금지; deadline 경계 순서 미확정 시 HOLD | monotonic t0/deadline·deny·pause/terminal trace. equality/order contract Astra / 서버 담당 |
| T08 old/new owner / G03,G04 / E08 | lease/epoch 교체 → old/new 동시 complete/abort·저장·queued send; old process pause/resume 반복 | durable terminal once. old 저장 0과 old 송신 0 각각 입증. 새 owner가 fencing 없이 시작하면 FAIL | DB terminal constraints·owner/incarnation·egress trace. 외부 fence/복원 epoch 원천 미확정 / owner 담당 |
| T09 start/terminal crash / G04 / E07 | start commit 전/후 kill; terminal commit 전/후 kill·ack loss → 재시작/중복 종료 | durable start 없는 판을 시작 완료로 표시 금지. durable unfinished는 기존 Probe 정책대로 abort; durable completed 보존. 최초 종결·command 동일성과 terminal once, 저장 실패는 성공 표시 금지 | commit WAL/ack evidence·record/restart trace. 최소 기록 스키마는 후속 설계 / 기록 담당 |
| T10 열람·Data API / G03,G04 / E09 | 본인 참가/비참가·필요 운영자/일반 운영자 계정 → UI/API/RPC/Data API 직접조회·IDOR·오류·snapshot | 본인 참가와 필요한 운영자만 열람. service-role 우회 adapter 포함 일반 client로 권한 상승 불가. 에러/private projection 누출 0 | 정책/GRANT·request-response whitelist·조회 trace. 운영자 필요 범위 미확정 / 보안 담당 |
| T11 삭제·탈퇴·복원 / G04,G03 / E10 | 최초 종결+30일 전/정각/후 → 탈퇴 → 옛 backup 격리복원 → 오래된 retry/restore replay | deadline 뒤 운영/backup/temp 식별·기록 재생성 불가. 탈퇴 본인 연결 제거, 다른 참가 최소 기록은 원래 deadline. RPO로 과거 권한 부활 허용 금지 | [복원·삭제 명세](step-4b-recovery-deletion-cost-specification.md) B01~07·삭제 inventory. 삭제 원천/방식 미확정 / 복구 담당 |
| T12 총접속100·판8·반응 / G01,G05 / E11 | 독립 사용자100(로비/관전 포함), 판 최대8; 분산 판·중복탭·storm, PC/모바일·저/중/고부하 각 구간 | input 발생→권위 반영된 사용자가 볼 수 있는 피드백 p95≤250ms. 인가 실패/timeout/drop은 성공 표본에서 제외하지 않고 별도 전수 보고. CPU/RAM/traffic/DB gate 실측; 안전성은 모든 표본 0위반 | 단말/망·raw samples·percentile 계산·무료/VM meter. 아래 제안 표본 조건 채택은 별도 / 성능 담당 |
| T13 재연결·모바일 / G01,G02 / E06,E11 | 단말별 망 단절/회복·앱 background/foreground·늦은 callback; 정상 서버/DB/현재 권한 확인 조건과 장애 조건 구분 | 정상망 회복 tnet→새 인가/최신 view의 LIVE≤5초. DB/서버/권한 장애는 즉시 차단·60초 정책이며 5초 성능 지원으로 오인 금지. 모바일 이동/상호작용/준비/종료/재접속 모두 필수 | tnet 측정 원천·LIVE revision·동작 영상/trace. 단말 목록 미확인 / client·QA |
| T14 복구·비용 실측 / G04,G05 / E12 | 비운영 환경에서 백업 실패/지연·복원·현재 권한 재검증·quota 소진 시나리오(별도 승인 단계) | validated 복구점 기준 RPO≤24h 목표·discovery→authorized recovery≤24h 목표 검증; 실제 meter+세금 총월추가≤3만원. 추정은 PASS 불가 | 백업 manifest·복원 ACL/삭제/owner trace·청구 산식. 운영시간/계량 UNKNOWN / 운영·비용 담당 |

## 구체적인 품질 시험 기준 제안

반응은 client input timestamp부터 권위 결과에 대응하는 visible frame까지 end-to-end로 정의할 것을 제안한다. DB 왕복만 또는 로컬 예측 frame만 재면 목표 판정 불가다. 재연결은 정상망 회복을 외부 관측으로 확인한 tnet부터 authenticated 최신 view LIVE까지이며 5초는 p95로 바꾸지 않는다. 측정 clock calibration·수집 오차를 함께 보고한다.

제안하는 최소 준비: PC와 Android/iOS의 실제 지원 단말 각각, 서울 일반 유선/Wi-Fi/모바일망(조건을 수치로 기록), 총100/판8 최대치와 혼합 로비 조건, warm-up 후 조건별60분·유효 입력1000개 이상, 재연결 조건별30회와 실패 포함 전수 지연. 이는 새 tick·queue·p99 기준 채택이 아닌 시험 표본 후보이며 담당이 재현성과 통계 적절성을 확인한다. 기존 사이트 활동을 별도 실제 meter로 포함한다. 사용량은 UNKNOWN, 측정 전 성능/복구 지원 완료로 표시하지 않는다.
