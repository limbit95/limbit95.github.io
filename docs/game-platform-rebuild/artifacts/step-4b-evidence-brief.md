# STEP 4B — Work Sol 근거 준비

준비 제출 상태: **EVIDENCE_PREPARATION_COMPLETE**. STEP4B 전체는 IN_PROGRESS. Astra 판단·정식 산출물·독립 감사는 NOT_STARTED. 확인일 2026-10-02. [source trace](step-4b-source-trace.md)의 B01~44는 고정 `3aeae1dfcce7788f88e706dcd49d283b91b67e82`를 가리킨다.

## 1. 출처·확인 범위

AGENTS/계획1.3/기록 README 및 실제 branch·PR411·merge commit·recursive tree(926 entries, truncated=false)를 확인했다. PR411 MERGED, merge 부모/최종4A tree 일치. CP0042/DECISIONS와 CURRENT 상세를 대조해 마지막 승인 반영STEP4A를 복원했다. STEP4B branch/open PR 없음 확인 후 별도 branch를 분기했다. 옛 CURRENT 상단의 OPEN/Draft·STEP3는 병합 전 이력이며 과거checkpoint는 보존한다.

이번 증거는 저장소 원문 관찰, 승인 요구, 이전 조사 확인 기록이다. 실제 배포 schema·RLS/GRANT·publication·DB 로그·네트워크·비용·프로파일링을 조회하지 않았다. 모든 migration 적용 순서/후속 override를 전수 합성한 DB 모델도 아니다. No Thanks start는 후속 randomized migration까지 선택 확인했으며 foundation만 최종본으로 취급하지 않았다(B26). 새로운 bug 재현·실서비스 안전성 판정은 없다.

## 2. 승인 요구 R — 유지할 의무

| 요구 | 근거 | 준비에서 유지할 범위 |
|---|---|---|
| R01 모델 분리·최소Core | B01/B02, STEP2 승인 | DB/RPC snapshot과 stream은 별도 선택 모델. 모든 모델에 Room/version/tick 강제 금지. 7축 표현 한계/필수Core 추가가 보이면 STEP2 회귀 검토 |
| R02 모델 품질·선택 | B02 | 권위·순서·중복·복구·private·지연/주기/대역폭·server 검증·실행/운영/비용은 4B 판단 책임. 후보만 남기고 구현 진입 금지 |
| R03 신규online 안전성 | B03/B04, STEP1 LEGACY-DB-004~018·045~054 | 익명/미승인 차단, 진입/읽기/시작 권한, stale/중복/동시성, 복원·재대결·private의 11의무 보존. private 없는 경우도 검증 필요. 비DB 동등 안전성 정의는 Astra 입력이며 이번에 면제하지 않음 |
| R04 현재 DB 방식 | B06, LEGACY-DEV의 §9 및 LEGACY-DB-034~037 | nonnegative integer version, Realtime invalidation, authoritative snapshot 복원 유지. transport 수신 성공을 authoritative commit과 동일시하지 않음 |
| R05 수명·권한 | B11/B12/B13 | 살아 있는 owner·현재context·허용정보/행위·모델순서·반영직전 재확인. 성공/error/null/finally/cleanup/effect 모두 적용. 현재 authorized 재조회 예외는 명시적 재검증 필요 |
| R06 사이트 identity/초대 | B05/B07, LEGACY-DEV-238~243 | 확정 profile nickname, client nickname 불신, 공통 초대 본체와 game 연결 구별, resolve 후 실제 join 권한 재검사 |
| R07 hostless·재대결 | B07/B09, LEGACY-DB-016·038~044·050 | 초기 시작의 host 없음과 공통 재대결 UX를 구별. 현행 ready/방장 시작 의무·규칙 변경 필요성을 보존. fake Room/메서드 강제와 미승인 면제 모두 피함 |

조항 ID는 [STEP1 실제 정의](step-1-clauses-platform.md)에서 대조했다. R03의 LEGACY-DB-004~006은 적용 범위, 007~017은 11시나리오, 018은 private 없음 검증이다. 물리 필드 목록은 모든 미래 모델의 필수Core 필드로 올리지 않는다.

## 3. 현재 source 사실 F — 지원 범위 제한

| 사실 | 근거 | 이 사실이 증명하지 않는 것 |
|---|---|---|
| F01 coordinator는 낮은 version만 거부, 동일 version 채택; refresh coalesce, subscribe 호출 후 initial refresh | B15/B16 | 동일version의 viewer/경기 일치, 구독 ACK와 조회 사이의 무유실, await 후 dispose 차단 |
| F02 복귀 신호 online/pageshow/visible은 refresh를 요청한다. No Thanks는 rooms/players postgres_changes를 notify로 연결한다 | B17/B18 | socket이 재연결됐다는 이유만으로 상태 복원/history/replay 완료. subscribe ACK/유실 구간 복구 |
| F03 Can’t Stop/No Thanks consumer는 서로 다른 부분 방어를 가진다 | B19/B20/B11 | 같은 room 새경기·A→B→A·권한 변경 모든 경로 지원. STEP1 F01/IMPL-001·002·004·005는 남음 |
| F04 No Thanks snapshot은 승인·active member 확인 후 viewer 자기 counters만 반환 | B23 | 관전자 전환의 cache/구독/로그 정리, 전송 중 응답 회수, 전체게임 권한 전환 지원 |
| F05 gameplay RPC는 중복 actor/type/payload 확인·저장 response 반환, room lock 후 중복 재검사·version/member 검사를 가진다 | B24 | 모든 RPC가 같은 강도, 이전 저장응답의 현재view 적합성. 중복 branch가 이후 member 검사보다 앞에 있다는 관찰은 판단 입력이지 즉시 취약성 판정 아님 |
| F06 rematch는 same-room/game/private/ready 초기화·host/version/member 검사를 구현한다. 이후 start는 profile approval·host·인원·ready 검사 | B25/B26 | hostless 모델의 적합성, deployment 적용·동시성 PASS |
| F07 publication SQL은 rooms/players 추가; 별도 helper 권한 회수 SQL 존재 | B27/B28 | 실배포 최종 publication/GRANT/RLS·전체 realtime payload private 안전성 |
| F08 accessGate는 client authState, auth.js는 profile.status로 approval 산출·epoch 방어·profile 조회. TOKEN_REFRESHED branch는 session/user 갱신 | B29~31 | 서버의 profile status 변화가 즉시 모든 열린 게임에 전파됨. token 갱신은 profile 재조회와 동일하지 않음 |
| F09 approval helper는 auth.uid와 profiles.status를 조회, baseline에는 profile 특권column trigger·RLS가 있다 | B32/B33 | 최신 DB 권한/관리 경로·철회 전파 지연·server 검사 시점 전체 |
| F10 nickname은 Can’t Stop server profile 조회/trigger, No Thanks approved profile helper, 사이트 uniqueness index/availability SQL | B34~36 | 경기 도중 rename 전파 정책·전게임 경로 일치·production index 적용 |
| F11 site invite 본체는 approval/expiry/revoke를 검사; wrapper/game_room metadata와 Registry gate 별도 | B37~39 | token 소지가 game join 권한·현재 role을 보증. 게임local 접속파일이 새 invite 본체라는 결론 |
| F12 Registry5게임(shared2/legacy3)과 사이트 카드 별도5목록 | B40/B41 | Registry 플래그로 서버 보안/출시 활성화/공개 권한이 집행된다는 주장 |
| F13 runner 및 client 계약 테스트 source 존재 | B21/B22 | 이번 실행 PASS·production fixture 권한·stream 품질 검증 |

## 4. 승인 전환을 4B 질문으로 연결

| 전환 | 기존 판단 | 남은 질문/검증 입력 |
|---|---|---|
| T01 같은room 새경기 | B11/B15, room 단조version과 match reset은 다름 | 비교 범위·재대결 경계·직접 action/구독/조회 모두의 채택 증거. 동일/큰version으로 이전owner 부활 금지 |
| T02 A→B→A | B11/B19/B20 | room ID 재일치와 tracking 수명 구별; 늦은 error/null/finally·정리가 새 owner를 건드리지 않는 근거 |
| T03 참가/관전·역방향·로그아웃/사용자 교체 | B11/B23/B29~33 | server 요청/실행/응답/구독 검사 시점, client private 사용 중단·cache/log·미인지 철회/발송 중 정보 경계 |
| S3-T04 단절·이벤트 유실 | B10/B17/B18 | current-state resync와 history 복원 목표, initial/live cut, sequence gap·실패/재시도·보존기간 조건 |
| S3-T05 prediction/rollback 결과중복 | B10/B43/B44 | predicted vs committed 식별, 입력 재시도·재실행/confirm 경계, 소비effect/보상 증거. RPC action ID가 frame/결과 소비까지 자동 보호하지 않음 |

리듬 audio/input/render/network clock, 물리/rollback tick, 장기비동기 durable progression은 서로 같다고 전제하지 않는다. STEP3 X04 시간축 근거를 재사용하되 서버 시계 동기·지연/주기·대역폭·deadline/확정 기준 수치는 미확인이다.

## 5. 추론 I와 미확인 U — 채택 결론 없음

- I01: 기존 DB source가 보여 주는 안전성 의미를 stream 후보에도 질문할 수 있다. DB version·RPC·lock 구현을 stream 필수API로 복제할 근거는 없다.
- I02: transport ordering/ACK가 application ordering·확정·권한 신선도·무중복 commit을 자동 증명하지 않는다. 구체 규칙과 동등 검증은 Astra가 판단한다.
- I03: client view lifetime과 server 정보 제공 권한은 별도 증거가 필요하다. 이미 적법하게 제공된 정보의 악의적 client 회수는 승인4A가 약속하지 않는다.

| 미확인 | 필요한 증거 | 판단/후속 책임 |
|---|---|---|
| U01 initial/live handoff·sameversion·ordering·gap | ACK/연결/sequence 범위·snapshot cut·재전송 공식 조건+프로젝트 검증 계획 | Q01/Q02 조사 → Astra3A |
| U02 복구 목표/실패/보존·authority 재시작 | current-state/history 구별, 저장·TTL·timeout·retry·중복 처리 근거 | Q02/Q04 → Astra3A/3C |
| U03 private/approval/role 철회·cache/log | server 검사시점·정책재평가·발송중/구독 재가입·클라이언트 사용중단 증거 | Q03 → Astra3B |
| U04 실행 위치/transport/운영·비용 | 권위loop/DB transaction/relay의 차이, 인증·서버상태·배포/지역·부하·egress/compute/CCU/저장·실패 검증 | Q04 → Astra3C |
| U05 사이트 owner·정책 변화 전달/공개 | 기존auth/profile/invite/Registry/card 경로의 source input은 확보, 최종 연결위치/정책변화 전달 판단은 없음 | Astra3B, 재사용판정5A/공개상세5B |
| U06 비DB 동등안전성·hostless 충돌 | 11의무별 의미·적용불가 근거·동등test, 공통재대결 UX 규칙 변경의 필요/승인 | Astra3A/3B, 필요시STEP2·규칙 검토 |
| U07 실제 배포/회귀·부하 | migration 최종합성·DB권한/로그·contract/브라우저/장애·network/cost 계측 | 이번 준비 미실행. 구현 전 검증계획과 닫힘 조건은 Astra3C, 실구현/검증은 승인 후 단계 |

부하/동접/지역/주기/예산/허용지연/회복시간은 사용자 자료에 없다. 숫자를 생성하지 않았다. 후보 조사 분류는 DB transaction+invalidation, dedicated authoritative loop+stream, relay/client simulation(권위검사 책임 별도)이며 특정 업체 선정이 아니다. 기존 Nakama/Photon/GGPO 사례는 제한된 외부 증거이고 플랫폼 실제 지원이 아니다. Supabase 필수채택·배제도 결정하지 않았다.

## 6. 이전 조사 재사용과 다음 행동

STEP3 X01~07의 선택 확인 이력(B44): authoritative와 relay 구별, GGPO rollback/effect 범위, Web Audio 독립시계, Photon cache/rejoin 조건, 수신자 지정의 한계를 유지한다. STEP4A S01~07의 확인 이력(B42): abort와 취소 성공/서버 rollback 구별, promise job·listener 소유권, OAuth/IETF 요청권한·철회/캐시 범위를 유지한다. 이번에 외부 원문을 새로 열람하지 않았으며 모든 기존 하위 링크 확인·현행 가격 확인으로 확대하지 않는다.

새 부족분 Q01~04만 [조사 입력](step-4b-auxiliary-research-input.md)·[조사 요청](step-4b-auxiliary-research-request.md)으로 준비했다. Q05 사이트 source는 Work가 위에서 확인했으므로 일반 조사자에게 저장소 조사를 다시 맡기지 않는다. 일반 Sol5.6 조사 원본을 수신하면 출처/범위/미확인 검토 후 Astra3A → 3B → 3C 요청으로 진행한다. 이번 제출 후 정지.
