# STEP 4B — private·권한·사이트 연결 계약

- 상태: **정식 STEP4B 제출 산출물 / 사후 감사 대기 / STEP4B IN_PROGRESS**. 가이드4 반영이며 사용자 승인·현행 CURRENT rulebook 변경·Target 동결·구현 지원 완료가 아니다.
- 고정 입력: [Astra 판단 원문](https://github.com/limbit95/limbit95.github.io/blob/ddfa7a5e226fe0c5f62779a19b708ca0802899ce/docs/game-platform-rebuild/artifacts/step-4b-astra-judgment.md), commit `ddfa7a5e226fe0c5f62779a19b708ca0802899ce`, blob `bd4c5b4991921c17d74bd99ef275819e4ae046f5`.
- Work Sol은 아래 판단 본문 전체를 그대로 옮겼다. 선택·보류·사유·조건·미확인·후속 책임을 축약하거나 새로운 선택으로 바꾸지 않았다. J번호는 판단 절, B번호는 [저장소 근거](step-4b-source-trace.md), V번호는 [기존 선택 원문 검토](step-4b-research-verification.md)다.
- [전체 반영 trace](step-4b-contract-source-trace.md), [미결정·충돌·후속](step-4b-risks-and-followup.md), [정식 제출 검증](step-4b-validation.md)을 함께 읽는다. 다른 절 연결은 [모델 품질](step-4b-runtime-sync-contract.md)·[권한/사이트](step-4b-security-site-contract.md)·[실행/운영](step-4b-execution-operations-decisions.md)에서 찾는다.
- 본문의 “이번 판단/미수행/후속 STEP4B”, “정식 반영 필요”는 가이드3 작성 시점의 판단·조건으로 보존했다. 이번 완료는 **가이드4 문서 반영**뿐이다. G01~06은 미해소이며 모델/제품 지원 PASS, STEP4B 전체 완료 또는 후속 구현 허용으로 승격하지 않는다.
- 공식 원문 확인/가격은 가이드3 확인 이력의 재사용이다. 이번 새 browsing·견적·배포·runtime/DB 검증은 수행하지 않았다. 구현 전 제품/가격/버전 확인 조건을 유지한다.

## 3B — private·권한·사이트

### J07. 검사 시점과 철회의 경계 — 채택, 실제 집행 증거 보류

클라이언트 access gate는 UX이고 보안의 최종 경계가 아니다. 승인/세션/역할 정책과 authoritative action의 관계를 서버에서 정의한다. 철회와 행위가 경합할 때 어느 것이 먼저 확정되었는지 판정 가능한 직렬화 경계가 필요하다. 전 지구적 wall-clock 즉시철회를 약속하지 않는다. 이미 적법하게 전달된 데이터를 악의적 client에서 회수할 수 없고, 철회 이전 확정된 행위를 client dispose로 rollback하지 않는다. 반대로 철회 경계 이후 새 보호 행위나 private 제공을 오래된 승인 cache만으로 허용해서도 안 된다.

| 경계 | 필요한 검사 | 부족한 대체물 |
|---|---|---|
| 진입/재접속 | 검증한 identity·현재 승인·join/membership 정책 | Registry 표시·invite 보유만으로 입장 |
| 명령 적용/확정 | 대상/역할/현재성·게임 조건; queued command도 권한 경계와 일관 | 과거 join 때 한 번의 client check |
| snapshot/private 제공 | 해당 반환 시점의 승인 recipient/view, 저장 응답 포함 | 과거 commit 때 승인되었다는 사실만 사용 |
| channel 구독/갱신 | topic 권한과 membership 변경 전달·철회 집행 계약 | client에게 JWT refresh 요청만 함 |
| client 사용/보존 | 알려진 권한 변화 즉시 이전 view invalidation·구독/캐시 정리 | 네트워크 성공 응답이면 무조건 표시 |

서버의 authorization decision과 commit/release 사이에 틈이 있으면 재검사 또는 같은 원자적 경계라는 증거가 필요하다. 기존 SQL의 승인 predicate 존재만으로 모든 동시 철회가 직렬화되었다고 결론내리지 않는다. 실제 migration 최종 상태·GRANT/REVOKE·RLS·publication·정책 propagation은 미확인이다. 기본 privilege와 RLS는 별도로 검증하며 browser에 service credential을 전달하지 않는다. B03/B23~38, V04.

### J08. private 전달과 cache — 안전 기준 채택, private stream 도입 보류

private 정보는 서버에서 recipient별 승인 projection을 만든 뒤 제공한다. public 채널에 보내고 client UI에서 숨기는 방식은 제외한다. 현재 기본 방향은 승인 검사를 수행하는 snapshot/RPC 경계이며, 이는 기존 배포가 완전 검증되었다는 뜻이 아니다. private stream은 G03의 권한 freshness·recipient fencing 증거가 있을 때만 선택한다.

Supabase Broadcast/Presence channel policy cache와 JWT 갱신 경계는 철회 모델의 제약이다. JWT expiry를 기다리거나 협조적 client가 재가입한다는 가정만으로 요구를 닫지 않는다. 서버 측 연결 차단·권한 세대·lease 등은 후보 수단이며 제품이 실제 제공하는지, cache/in-flight와 어떤 순서로 작동하는지 검증해야 한다. 증거가 없으면 보호 데이터를 보류하고 명시적 재인가 경로를 택한다. 이 판단은 모든 Realtime 제품이 원천 불가능하다는 판정도, Postgres row RLS의 모든 내부 cache가 같다는 판정도 아니다.

client cache는 사용자·세션 의미·권한 view가 바뀌면 보호 데이터를 재사용하지 않는다. pending error/null/finally가 새 view를 지우거나 옛 private 정보를 다시 표시하지 않도록 STEP4A 검사를 적용한다. public 데이터의 재사용도 실제 공개 projection이라는 증거가 있어야 한다. 로그·telemetry·replay 저장에는 private payload를 무차별 남기지 않고 접근·보존 범위를 정한다. auth 상태를 확인할 수 없는 동안 보호 데이터/행위는 fail closed 한다. B10~12/B24/B29~33, V04.

### J09. 사이트와 게임 서버의 연결 — 책임 채택, 구체 연결 구현 보류

사이트의 승인회원/프로필 정책은 사이트가 소유한다. Site Adapter는 identity와 정책 변화 신호를 모델에 연결하고, 모델 backend는 token/claim의 진위·대상·유효기간·철회 의미와 외부 사용자 매핑을 검증한다. browser가 보낸 user-id/nickname을 서버의 신뢰 근거로 삼지 않는다. 외부 게임 서버를 도입할 경우 사이트 auth→게임 session bridge와 logout/승인철회 전파를 G03에서 닫아야 한다.

현행 TOKEN_REFRESHED 처리나 auth cache는 profile 재확인·승인철회 감지와 동일하지 않다. nickname은 서버가 승인된 profile에서 가져오는 현행 방향을 유지하고, 진행 중 변경 반영 시점은 별도 정책으로 명시한다. 현재 초대는 승인·만료·철회·게임 메타데이터를 검증하는 기존 사이트 흐름을 계승한다. invite 해석/라우팅 성공은 membership 획득이나 private 읽기 허가가 아니다. 실제 join에서 다시 서버 정책을 적용한다.

Registry의 routing/지원 metadata와 사이트 목록 표시, 공개/출시 정책을 보안 권위로 합치지 않는다. B40/B41의 별도 경로는 연결 근거이며 이번에 목록을 일괄 변경하지 않는다. 초대 본체 재사용 선택은 STEP5A, Publication 상세는 STEP5B에서 하되, 위 서버 경계를 약화하지 않는다. B29~41.

