# vNext S1 — private PG storage candidate

**후보 구현 작성 / 정식 반영 없음 / 실제 지원 미입증.** SQL은 적용하지 않았고
실제 DB/native 검증은 NOT_RUN이다. STEP7D 미완료·vNext 행동 NOT_RUN·운영 UNKNOWN,
browser/cache/SW UNKNOWN과 기존 전체 후속 의무를 유지한다.

## 경계와 실제 파일

- `pg-storage-candidate.sql`: 신규 vnext_private schema의 session/match anchor,
  membership/ready, scoped durable command ledger 및 내부 ready/current/status 함수.
  forward SQL **검토 후보**이며 migration 이력/설치 완료가 아니다. 기존 site/game SQL 변경0.
- `../../services/game-platform-vnext/sessionStorage.mjs`: 기존 sessionControl.mjs의
  hash를 그대로 소비하는 전용 connection/transaction 연결. constructor의 connect는
  명시적 I/O lease이며 authority/allow callback이 아니다. 외부 driver·기본 connection·
  credential·runtime caller·network listener·자동 retry·public RPC·native P를 제공하지 않는다.
- `../../tests/game-platform-vnext-session-storage.test.js`: scripted offline I/O와
  SQL 정적 계약. 실제 PG lock/unique/ACL/atomic commit 및 current A/C/P oracle가 아니다.

상위 의미는 승인 S0 계약의 §2~4, STEP4B design-finalization §2/3,
D0010 closeout §2/3 및 STEP7B §7 전체를 따른다. 이 후보가 새 CURRENT rulebook은 아니다.
원본 STEP7D 두 문서 미확보 상태를 복원/과거 승인으로 바꾸지 않는다.

## 닫힌 호출 권한

SQL은 **새 schema를 생성할 수 있는 설치 owner `postgres`의 고립된 후보**다.
동일 schema가 이미 있으면 CREATE SCHEMA가 실패하므로 미확인 기존 객체와 합치지 않는다.
모든 함수는 SECURITY INVOKER/search_path=''이며 session_user와 current_user 모두 postgres여야
한다. schema/table/function의 PUBLIC/anon/authenticated/service_role/authenticator 권한을
회수하고 table RLS를 켠다. runtime role 생성/GRANT·seed·bootstrap 함수는 없다.
함수 생성/회수는 같은 설치 transaction에 있으며 실제 DB에는 실행하지 않았다.

이 owner는 넓은 설치 권한을 가지므로 least-privileged runtime이라 부르지 않는다.
설치 owner/DB 관리자가 보호 장치를 고의 제거할 수 없다는 보장도 아니다.
승인된 미래 narrow SECURITY DEFINER predicate와 전용 runtime login을 구현한 것이 아니다.
실제 current predicate/외부 generation·writer fence·trusted ingress·native gate가 없으므로
이 내부 함수들에 runtime EXECUTE를 주거나 public API로 노출해서는 안 된다.
임의 JWT claims GUC/authorized boolean/fixture caller는 production admission 근거가 아니다.

## 저장 계약

기존 proposal.next 전체는 받지 않는다. command hash는 기존 JS 함수로 재계산하고
SQL에는 scoped ID/hash와 ready boolean·expected owner/revision만 parameter로 전달한다.
SQL 자체는 hash 형식과 저장된 hash/ready 동등성을 검사하며 JS canonicalization을 재구현하지
않는다. 설치 owner의 직접 SQL 입력까지 JWT나 payload 서명으로 인증한다는 의미가 아니다.
미래 신뢰 finalizer는 원 command를 검증해야 하며 raw worker proposal/임의 hash를 신뢰하면 안 된다.

session/match anchor의 FOR UPDATE가 새 ledger가 없는 동시 명령도 직렬화한다.
command key는 contract/session/match/subject/ID다. 같은 ID/hash/ready는 기존 record를 읽고
다른 hash/ready는 충돌이다. 기존 record 조회는 stale expected revision을 재적용하지 않는다.
새 mutation만 WAITING·current owner/member/revision·revision 상한을 검사하고 ready만 변경한다.
ready/revision/ledger는 같은 caller transaction에서 commit/rollback되며 bootstrap은 하지 않는다.

closed/abort_requested/failure_context_unknown 또는 최초 failure+60초 도달은 거절한다.
이 필드는 권위 controller가 나중에 연결해야 하는 저장 precondition이며 실제 최초 실패 감지/
외부 durable failure 기록/정각 abort를 구현한 것이 아니다. 내부 저장 검사를 A로 계측하지 않는다.
이 후보는 terminal/first_failure/owner/stream를 갱신하지 않으며 start/rematch/종결 쓰기는 미구현이다.
기존 record의 조회는 새 mutation이 아니고, closed일 때는 조회도 실패한다.

current/status는 anchor FOR SHARE와 같은 transaction의 조회를 사용한다. 이후 membership/owner
writer도 반드시 같은 anchor를 잠가야 한다. 반환 projection은 session/match/owner/stream/
revision/phase와 member id/ready뿐이다. Auth/private credential·다른 session의 상태는 반환하지 않는다.
실제 recipient/view/private 정보 인가·안전11 전체 증거는 아니다. 새 browser adapter는 없다.

## connection·실패·취소

connect는 매 작업에 독점 query()/release(error) client를 대여해야 한다. 같은 transaction의
모든 SQL은 같은 client에서 실행하며 pool.query에 나눠 보내지 않는다. release(error)는
오염/불명 connection을 pool에서 폐기해야 한다. 구체 driver는 연결하지 않았으며 dependency 추가0이다.

- BEGIN → 하나의 저장 primitive → COMMIT의 긍정 command tag 뒤만 STORAGE_*_CONFIRMED.
  이것은 내부 DB 프로토콜 확인이라는 이름이며 실제 C 시각·A·P·실행 지원 인증이 아니다.
- COMMIT dispatch 뒤 실패/응답 유실/ROLLBACK tag는 UNKNOWN. rollback 성공/미실행으로
  바꾸거나 자동 replay하지 않는다. 같은 ID/hash의 명시 status 조회를 사용한다.
- COMMIT 전 실패는 rollback을 시도하고 의심 connection을 폐기한다. rollback/release 실패는
  원 오류와 함께 관측한다. commit 확정 뒤 release 실패는 확정을 지우지 않고 cleanupError로 남긴다.
- AbortSignal은 local 요청 수명이다. DB 실행 취소/commit 회수/권한 철회 증거가 아니다.
  pending connect/query/release가 settle되기 전 connection을 반환하지 않는다.
  취소 뒤 late lease는 release, late statement는 rollback, 이미 dispatch한 commit의 확정은
  유지하되 폐쇄 context에 value를 반환하지 않는다. driver timeout/cancel/never-settling I/O의
  실제 상한은 아직 연결하지 않았고 운영 안전/가용성 증거도 아니다.
- 공유 connection을 잘못 재대여한 provider는 거절하고 다른 호출 소유 client를 release하지 않는다.

## 실제 환경 검증·보존

현재 SQL은 정적 검토 후보다. 실제 PG syntax/install/ACL/동시 lock·unique·rollback·commit crash,
actual A/C/native P는 모두 NOT_RUN이다. node-postgres transactions 공식 문서의 동일 client
요구만 참조하며 해당 driver가 설치됐거나 managed PG 버전과 호환 확인됐다고 쓰지 않는다.
추후 별도 허용된 disposable DB에서 실제 role/ACL·동시 connection·최초시각·R/clock trace가 필요하다.

session bootstrap/실제 입장·current predicate/권한 writer guard·external current generation,
native Linux/OpenSSL memory BIO/send·최초60초/abort 전체·terminal/외부기록/삭제·start/rematch·Adapter,
S2 연속 authority·H1~4 본체 연결은 미구현이다. 미지원 조합·빈 oracle/runtime/online 차단과
기존 online DB 요구를 유지한다. PG를 연속 상태 전체에 확대하거나 memory/ACK를 C로 쓰지 않는다.

publication 정책/Guard/workflow와 기존385 public bytes는 불변이다. 실제 candidate HEAD의
LOCAL_CHECKOUT_PUBLICATION은 로컬 증거이며 actual Pages artifact/deploy가 아니다.
supabase SQL은 services raw-bytes 검사 범위 밖이므로 별도 source path/type/size/hash와 실제
public/output/closure 비유입 근거를 전달 bundle에 둔다. 과거 M artifact를 새 revision 증거로 쓰지 않는다.
main382/integration385·Core main 미이식·기존 consumer/API/Registry 단일 metadata/barrel·
게임/Auth/API/SQL/game-local 네 문서·원본/과거 승인/원ID·줄·f를 보존한다.

기존 current A/C/P/D0010·안전11·H1~4/단일 채택·복구/hostless·미승인 재대결 예외 금지,
fixed M/run39191903797/attempt1/artifact12160182245의 별도 P1과 미래 revision 구분,
browser/cache/SW UNKNOWN 및 기록/삭제/복구/비용/운영 등의 모든 후속 의무는 그대로다.
