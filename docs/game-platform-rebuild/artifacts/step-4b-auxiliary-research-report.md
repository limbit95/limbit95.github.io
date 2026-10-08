# STEP 4B — Q01~04 보조 조사 원본 보고서

- 조사 목적: `step-4b-auxiliary-research-input.md`를 유일한 프로젝트 입력으로 사용하여 `step-4b-auxiliary-research-request.md`의 Q01~04 부족 근거만 공식 자료로 확인
- 조사 기준일: **2026-10-02 (KST)**
- 프로젝트 source packet 기준 commit: `3aeae1dfcce7788f88e706dcd49d283b91b67e82`
- 범위 제한: 저장소 직접 접근·현재 배포 상태·현재 서비스 설정·실행 결과를 가정하지 않음
- 기존 STEP3/4A 조사: 입력 packet에 명시된 확인 범위만 재사용하며 전체 재조사하지 않음
- 결정 제한: 모델·백엔드·transport·API·필드·게임 규칙·저장소 적합성·서비스 채택을 결정하지 않음
- 작업 제한: Git/DB/서비스 수정·구축·정식 산출물 반영·다음 단계 진행 없음

---

## 0. 판독 규칙

이 보고서는 각 진술을 아래 네 종류로 구분한다.

- **[사실]**: 이번 조사에서 공식 문서/규격이 직접 지지하거나, 입력 packet이 고정 source 관찰로 제공한 내용
- **[프로젝트 적용 추론]**: 공식 사실과 입력 packet을 연결한 해석. 설계 선택이나 채택 결정이 아님
- **[미확인]**: 공식 문서가 보장하지 않거나, 프로젝트의 실제 설정/실험/수치가 없어 확인할 수 없는 항목
- **[Astra 판단 질문]**: Astra 3A/3B/3C에서 구조·정합성·검증 기준으로 판단해야 할 질문. 여기서 답을 결정하지 않음

### 0.1 이번 조사에서 사용한 프로젝트 입력의 핵심 경계

**[사실 — 입력 packet]**

1. 현재 Realtime은 authoritative state 자체가 아니라 **invalidation 신호**이고 authoritative state는 **RPC snapshot**이다.
2. 현재 snapshot coordinator는 integer `version`을 비교해 낮은 값은 거부하고 같은 값은 채택하며, 구독 함수를 호출한 뒤 initial refresh를 수행한다.
3. No Thanks adapter는 `postgres_changes` payload를 상태로 직접 사용하지 않고 listener에 notify하며 `.subscribe()` 후 즉시 cleanup 함수를 반환한다.
4. No Thanks gameplay RPC에는 action 중복 조회, room lock 후 중복 재확인, expected version/member 검사, 저장 snapshot 반환 로직이 관찰되었다.
5. snapshot은 active member를 검사하고 viewer 자신의 private counter만 반환한다.
6. `auth.js`의 `TOKEN_REFRESHED` branch는 session/user를 갱신하지만 입력 packet 기준으로 profile을 다시 조회한다고 확인되지 않았다. 서버 helper는 `auth.uid()`와 `profiles.status='approved'`를 DB에서 조회한다.
7. 부하·동접·지역·tick/주기·예산·허용지연·복구시간·비용 상한·운영 인력 수치가 입력에 없다.

따라서 외부 제품 문서의 수치나 기능은 **후보 서비스의 공개 특성**일 뿐 이 프로젝트의 현재 지원·적합성·필요 용량으로 승격하지 않는다.

---

# Q01 — 순서·중복·initial/live 경계

## 1. Q01 요약 / 비교표

| 구분 | 공식 자료가 직접 보장하는 것 | 공식 자료가 보장하지 않는 것 / 조건 |
|---|---|---|
| Supabase Realtime `phx_join` / `SUBSCRIBED` | channel join에 대한 `phx_reply` ACK가 있으며 Postgres Changes subscription 식별자가 응답에 포함될 수 있음 | join ACK만으로 Postgres replication listener가 이미 stream-ready라는 보장은 아님 |
| Supabase Postgres Changes readiness | protocol의 `replication_ready=true` 요청 시 별도 `system` 메시지로 replication connection ready를 알릴 수 있음 | snapshot과 live 변경의 원자적 cut, gap-free catch-up, exactly-once는 문서에 없음 |
| Supabase Postgres Changes delivery | Realtime 쪽 Postgres Changes 처리는 order 보존을 위해 단일 thread에서 처리된다는 운영 문서가 있음 | client까지 모든 이벤트가 반드시 도착한다는 보장은 없음. 공식 troubleshooting은 reconnect/network에서 event가 빠질 수 있다고 명시 |
| Supabase Broadcast ACK | `ack=true`는 Realtime server가 broadcast message를 받았음을 확인 | recipient 수신 ACK, application commit, dedupe, exactly-once ACK가 아님 |
| Supabase Broadcast replay | private channel + Database Broadcast에 대해 시간 기준 replay 가능, replay 여부 metadata 제공 | 임의 client broadcast replay 아님. replay/live의 전역 sequence·원자적 경계·application dedupe 보장 없음 |
| Nakama authoritative input loop | client input이 서버에서 buffer되어 다음 match loop에 전달되며, 서버가 처리하는 순서로 data delivery를 제어할 수 있음 | tick 처리량을 넘는 input은 drop될 수 있음. application idempotency/commit dedupe는 자동 보장으로 확인되지 않음 |
| Photon PUN cached events | late join 시 room/player properties → cached events(서버 도착 순서) → join 이후 live events 순서를 제공. unreliable UDP는 예외 | 모든 stream/channel 간 global ordering이나 application exactly-once는 아님 |
| Photon Realtime transport channels | 같은 transport sequence channel 내 reliable action은 재전송되고 gap 없이 순서 dispatch. channel들은 독립 sequence | channel 간 global order는 없음. PUN2 문서와 Realtime v5 transport 문서의 판본 경계를 유지해야 함 |

## 2. Q01 출처 / 확인 범위

### [SB-01] Supabase Realtime Protocol

- URL: https://supabase.com/docs/guides/realtime/protocol
- 판본/상태: Supabase rolling official docs. protocol example은 **2.0.0**을 명시. 문서 자체 고정 release tag는 확인되지 않음.
- 확인일: 2026-10-02
- 정확한 절:
  - `Client events > phx_join`
  - `Server events > phx_reply`
  - `Server events > system`
  - `Access token refresh`
  - `Error handling`
- 직접 지지하는 사실:
  - **[사실]** `phx_reply`는 `phx_join` 등 ACK가 필요한 client request에 대한 server response다.
  - **[사실]** join response의 `postgres_changes[].id`는 Postgres Changes **subscription identifier**다. 문서가 application event sequence로 정의하지 않는다.
  - **[사실]** `config.broadcast.replication_ready=true`이면 Postgres replication connection이 established되고 changes를 stream할 준비가 되었을 때 별도 `system` event를 보낸다.
  - **[사실]** `access_token` refresh 성공 시 별도 reply가 없고, 실패 시 `system` error 후 channel close가 가능하다.
- 지원 조건/한계:
  - `replication_ready`를 요청해야 해당 readiness system signal을 받을 수 있다.
  - join ACK와 replication-ready 신호가 별도로 문서화되어 있으므로 둘을 같은 의미로 취급할 근거가 없다.
  - protocol payload의 Postgres Changes 항목에서 application용 monotonic sequence/LSN을 일반 계약으로 제공한다고 확인되지 않았다.

### [SB-02] Supabase — Realtime: Postgres Changes Troubleshooting

- URL: https://supabase.com/docs/guides/troubleshooting/realtime-postgres-changes-troubleshooting
- 판본/상태: Supabase official troubleshooting, **Last edited 2026-09-29**
- 확인일: 2026-10-02
- 정확한 절:
  - `Step 4: Check the subscription code itself`
  - `Step 6: Writing right after SUBSCRIBED`
  - `Step 8: Read the Realtime logs`
- 직접 지지하는 사실:
  - **[사실]** `SUBSCRIBED`는 channel이 connected되었다는 client status다.
  - **[사실]** 공식 문서는 `SUBSCRIBED`가 보고된 시점과 backend replication listener가 stream-ready가 되는 사이에 **confirmed timing gap**이 있고, 그 사이의 write가 missed될 수 있다고 명시한다.
  - **[사실]** 문서는 fixed delay보다 backend `system` message로 readiness를 기다리는 방식을 reliable fix로 설명한다.
  - **[사실]** 문서는 Realtime이 모든 message delivery를 보장하지 않으며 network blip/reconnect에서 event가 빠질 수 있다고 명시하고, missed update가 중요하면 event를 state re-fetch 신호로 취급하라고 안내한다.
- 지원 조건/한계:
  - 이 문서는 troubleshooting guidance이며 transactionally atomic snapshot+stream protocol을 정의하지 않는다.
  - 이 페이지는 readiness system message가 과거에는 formal documentation이 아니었다는 취지의 설명을 포함하지만, 2026-10-02 현재 [SB-01] Protocol에는 `replication_ready`가 정식 wire option으로 문서화되어 있다. 따라서 **timing gap 사실은 유지되지만 “비공식”이라는 문구는 시점 차이가 있는 표현**으로 기록한다.

### [SB-03] Supabase Broadcast

- URL: https://supabase.com/docs/guides/realtime/broadcast
- 판본/상태: Supabase rolling official docs
- 확인일: 2026-10-02
- 정확한 절:
  - `Acknowledge messages`
  - `Broadcast from the Database`
  - `Broadcast replay > How it works`
- 직접 지지하는 사실:
  - **[사실]** Broadcast `ack=true`는 Realtime server가 message를 **received**했음을 confirm한다.
  - **[사실]** Broadcast Replay는 **private channel**에서, **Broadcast From the Database**로 published된 message만 대상이다.
  - **[사실]** replay는 `since` timestamp를 사용하고 request당 최대 25개를 반환한다.
  - **[사실]** message는 daily partition에 저장되며 72시간보다 오래된 partition은 drop된다. partition 단위 삭제 때문에 개별 message availability는 최소 72시간, 최대 약 4일이라고 문서가 설명한다.
  - **[사실]** JS client 2.74.0+에서 해당 replay 기능이 제공된다고 문서에 명시된다.
  - **[사실]** callback metadata로 replayed message인지 new message인지 구분할 수 있다.
- 지원 조건/한계:
  - ACK는 recipient delivery나 application commit ACK로 정의되지 않는다.
  - replay 문서는 동일 message 중복 수신에 대한 application dedupe, replay→live 원자적 cut, global sequence를 계약하지 않는다.

### [SB-04] Supabase Realtime Reports / Limits

- URLs:
  - https://supabase.com/docs/guides/realtime/reports
  - https://supabase.com/docs/guides/realtime/limits
- 판본/상태: Supabase rolling official docs
- 확인일: 2026-10-02
- 정확한 절:
  - Reports의 Postgres Changes scaling/processing 설명
  - Limits의 `Limit errors`, `Postgres changes payload limit`, `Broadcast replay retention`
- 직접 지지하는 사실:
  - **[사실]** Supabase 운영 문서는 Postgres Changes가 order 유지를 위해 single thread에서 처리된다고 설명한다.
  - **[사실]** service limit 초과는 join 거부 또는 connection disconnect를 일으킬 수 있고 `supabase-js`가 일부 경우 reconnect할 수 있다고 설명한다.
  - **[사실]** 현재 공개 limit 표에는 Broadcast replay retention 72h, replay request max 25가 명시된다.
- 지원 조건/한계:
  - single-thread processing은 **server processing order**에 대한 설명이지 end-to-end exactly-once, reconnect gap-free delivery, 여러 독립 channel의 global order를 보장하는 문구가 아니다.
  - reconnect가 자동이라는 사실이 missed event history backfill을 의미하지 않는다.

### [NK-01] Nakama — Authoritative Multiplayer

- URL: https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/
- 판본/상태: Heroic Labs current English official docs, Nakama OSS/Enterprise 차이를 페이지에서 명시
- 확인일: 2026-10-02
- 정확한 절:
  - `Match handler`
  - `Tick rate`
  - `Match state`
  - `Send data messages`
  - `Receive data messages`
  - `Managing matches`
  - `Match migration`
  - `Storing match state data`
- 직접 지지하는 사실:
  - **[사실]** authoritative model은 server runtime의 custom match handler가 gameplay data를 검증/계산하고 relevant peers에 broadcast한다.
  - **[사실]** match loop는 fixed tick rate로 실행되고 client message는 buffer되어 match loop에 전달된다.
  - **[사실]** 문서는 configured tick rate 대비 message가 너무 많으면 일부가 server에서 drop되고 error가 기록될 수 있다고 명시한다.
  - **[사실]** Enterprise 설명에서 cluster에 replication되는 것으로 현재 English 문서가 명시하는 대상은 **match presences**이며, 새 match의 node balancing도 설명한다.
- 지원 조건/한계:
  - presence replication을 full gameplay match-state replication/failover라고 확대할 수 없다.
  - action idempotency key, duplicate commit suppression은 게임 runtime code의 별도 설계 없이 자동 제공된다고 확인되지 않았다.

### [PH-01] Photon PUN 2 — Cached Events for Late Joiners

- URL: https://doc.photonengine.com/pun/current/gameplay/cached-events
- 판본/상태: **PUN 2, maintenance/LTS**, Last updated **2026-08-19**
- 확인일: 2026-10-02
- 정확한 절:
  - `Ordered Delivery Is Guaranteed`
  - `Understand How Events Are Cached`
  - `Special Considerations`
- 직접 지지하는 사실:
  - **[사실]** joining client는 room/player properties를 먼저 받고, 그 다음 cached events를 server 도착 순서로 받고, join 이후 보낸 live events는 그 뒤에 받는다.
  - **[사실]** UDP unreliable event에서는 ordering 예외가 생길 수 있다.
  - **[사실]** cached events 전송이 끝나야 actor가 fully joined로 간주되고, cache가 live event도 지연시킬 수 있다.
  - **[사실]** cache limit에 도달하면 room이 new join에 닫힐 수 있고 inactive actor rejoin도 실패할 수 있다.
- 지원 조건/한계:
  - cache ordering은 Photon room cache의 경계이며 application commit exactly-once를 의미하지 않는다.
  - PUN 2는 유지보수/LTS 판이다. 문서 자체가 신규 기능 업데이트가 계획되지 않았다고 명시한다.

### [PH-02] Photon Realtime 5 — Low Level Transport & MTU

- URL: https://doc.photonengine.com/realtime/v5/reference/low-level-transport
- 판본/상태: **Photon Realtime 5**, Last updated **2026-08-19**
- 확인일: 2026-10-02
- 정확한 절:
  - `Sequencing`
  - `Channels`
  - `Using TCP`
- 직접 지지하는 사실:
  - **[사실]** same sequence channel에서 reliable event/operation은 필요 시 재전송되고 gap 없이 순서 dispatch된다.
  - **[사실]** unreliable data는 loss될 수 있다.
  - **[사실]** Realtime sequence channel들은 서로 독립적으로 sequencing된다.
- 지원 조건/한계:
  - **판본 주의:** 이 source는 Realtime v5 transport 문서이고 [PH-01]은 PUN 2다. Photon stack의 transport 개념 비교에는 사용할 수 있으나 PUN2 특정 SDK release가 Realtime v5의 모든 세부를 그대로 사용한다고 단정하지 않는다.
  - transport ordering은 application command dedupe/commit idempotency와 다른 층이다.

## 3. Q01 프로젝트 적용 추론

1. **[프로젝트 적용 추론]** 입력 packet의 coordinator가 `subscribe()` 호출 직후 initial `refresh("start")`로 들어간다는 사실만으로는 **Postgres Changes replication readiness가 initial snapshot 이전에 확보되었다고 증명되지 않는다.** [SB-01]/[SB-02]는 channel join/`SUBSCRIBED`와 replication-ready 사이를 별도 경계로 다룬다.
2. **[프로젝트 적용 추론]** 현재 Realtime을 authoritative payload가 아닌 invalidation으로 취급하고 RPC snapshot을 다시 읽는 패턴은 [SB-02]의 “missed event가 중요하면 signal로 state를 refetch”하라는 복구 방향과 **개념적으로 양립**한다. 그러나 이것은 현재 구현의 gap-free correctness를 증명하는 것이 아니다.
3. **[프로젝트 적용 추론]** input packet에서 coordinator의 integer `version`은 snapshot stale 거부 수단으로 관찰되었지만, [SB-01]/[SB-03]/[PH-02]의 transport ACK/sequence와 같은 층으로 볼 근거는 없다. 또한 **모든 향후 모델이 동일 integer version을 가져야 한다는 근거도 아니다.**
4. **[프로젝트 적용 추론]** Q01의 duplicate 문제는 최소 세 층으로 분리해야 한다: (a) transport retransmission/order, (b) stream event의 sequence/history, (c) application command의 duplicate commit/idempotency. 이번 공식 자료는 이 세 층이 자동으로 하나의 exactly-once 보장으로 합쳐진다고 지지하지 않는다.
5. **[프로젝트 적용 추론]** Photon cached-event bridge는 “late joiner가 어떤 retained history를 받고 live로 넘어가는가”의 한 제품 사례이고, Supabase Postgres Changes는 같은 형태의 built-in retained history bridge가 확인되지 않았다. Supabase Broadcast Replay는 제한적 history를 제공하지만 대상/보존/limit 조건이 다르다.

## 4. Q01 미확인

- **[미확인]** 현재 project client가 Supabase protocol의 `replication_ready` 옵션/`system` event를 실제 사용하거나 노출하는지.
- **[미확인]** 현재 `supabase-js` pinned version과 해당 옵션의 SDK-level API 사용 가능성.
- **[미확인]** initial snapshot 조회가 시작/완료되는 동안 발생한 DB change가 언제/어떻게 최종 snapshot에 반영되는지에 대한 transaction cut.
- **[미확인]** 현재 snapshot RPC의 transaction isolation, snapshot 생성 시점, row-lock 범위와 Realtime publication event 생성 시점의 관계.
- **[미확인]** connection replacement 또는 A→B→A context 이동에서 오래된 channel callback이 실제로 모두 폐기되는지.
- **[미확인]** 여러 table/여러 Realtime channel을 동시에 사용하는 경우 project-level total order가 필요한지, 필요하다면 어떤 key가 order domain인지.
- **[미확인]** 동일 application sequence 또는 동일 action을 재수신했을 때 모든 side effect가 exactly-once인지. No Thanks RPC에서 특정 action table 중복 방지 관찰은 다른 모델/stream의 일반 계약이 아니다.

## 5. Q01 Astra 3A / 3B / 3C 판단 질문

### Astra 3A — 경계/불변식

- **[Astra 판단 질문]** initial snapshot과 live invalidation 사이에서 반드시 보존해야 할 최소 불변식은 무엇인가: “모든 event 수신”인지, “event가 일부 유실되어도 최종 authoritative state 수렴”인지?
- **[Astra 판단 질문]** transport ACK/readiness와 application commit ACK를 어떤 이름/계약으로 분리해야 혼동을 막을 수 있는가?
- **[Astra 판단 질문]** order domain을 room/context/stream 단위 중 어디까지 정의해야 하며, 서로 다른 stream의 global order가 실제 요구사항인가?

### Astra 3B — 모델별 매핑

- **[Astra 판단 질문]** DB transaction+invalidation 모델에서 replication-ready를 correctness 선결조건으로 둘지, event loss를 허용하되 snapshot resync로 수렴시키는 모델로 둘지?
- **[Astra 판단 질문]** stream 중심 모델을 허용한다면 application sequence/idempotency key를 어디서 생성·검증·지속할지? DB `version`을 그대로 강제하지 않고 동등 의미를 어떻게 정의할지?
- **[Astra 판단 질문]** reconnect/connection replacement에서 이전 stream의 event를 “transport sequence가 최신”이라는 이유만으로 채택하지 않도록 context/owner/permission 경계를 무엇으로 묶을지?

### Astra 3C — 검증

- **[Astra 판단 질문]** `SUBSCRIBED` 직후 write, snapshot loading 중 write, reconnect 직후 write를 각각 주입했을 때 요구 결과를 어떤 oracle로 판정할지?
- **[Astra 판단 질문]** 동일 sequence/동일 client action을 중복 전달하고 서로 다른 connection/channel 순서를 뒤섞는 시험에서 “중복 처리”와 “중복 commit”을 별도 검증할지?
- **[Astra 판단 질문]** T01/T02/T03 및 S3-T04 단절유실에서 version 비교 외에 context·owner·권한의 생존성 검증을 어떤 체크로 요구할지?

---

# Q02 — 복구·예측/확정: current-state resync, history replay, retry, simulation rerun, restart

## 6. Q02 요약 / 비교표

| 메커니즘 | 무엇을 복구하는가 | 보존/실패 조건 | 중복/확정에 대해 직접 보장하는 범위 |
|---|---|---|---|
| Supabase Postgres Changes + 별도 state fetch | 최신 authoritative DB state를 다시 읽는 **current-state resync** | Realtime event 자체는 유실 가능. state fetch의 권한/transaction은 별도 | 유실 event history를 복원하거나 effect exactly-once를 보장하지 않음 |
| Supabase Broadcast Replay | Database Broadcast의 최근 retained history 일부 | private channel, DB Broadcast만, `since`, request max 25, retention 최소 72h/최대 약 4일 | `replayed` 표시는 제공하나 application dedupe/commit fence는 별도 |
| Nakama authoritative match | in-memory simulation state와 tick loop | match state는 runtime memory 중심; durability는 app이 storage에 저장해야 함. graceful shutdown hook 존재 | simulation 재실행/idempotent external effect를 자동 제공한다는 근거 없음 |
| Nakama graceful migration | 종료 전 새 match 생성/이동을 application logic으로 수행 가능 | graceful shutdown 경로, grace 시간 내 처리 필요 | crash 시 full in-memory state 자동 승계 보장으로 확인되지 않음 |
| Photon PUN room cache / quick rejoin | room retained state/events와 inactive actor identity를 이용한 rejoin | room이 살아 있거나 load 가능, `PlayerTTL` 조건, actor inactive, TTL 미만, cache/room 조건 | reconnect 성공을 보장하지 않으며 permanent business-result dedupe와 무관 |
| GGPO — 입력 packet에서 재사용한 기존 조사 | rollback/prediction 시 simulation input 재실행 | 기존 STEP3 확인 범위만 재사용 | 영구 보상/외부 side effect의 duplicate commit 방지 근거로 확대 금지 |

## 7. Q02 출처 / 확인 범위

### [SB-02] Supabase Postgres Changes Troubleshooting — 복구 관련 재사용

- URL: https://supabase.com/docs/guides/troubleshooting/realtime-postgres-changes-troubleshooting
- 판본: Last edited 2026-09-29
- 확인일: 2026-10-02
- 정확한 절: `Step 8: Read the Realtime logs`
- **[사실]** network/reconnect에서 event loss가 가능하며 missed update가 중요하면 event를 state re-fetch 신호로 사용하라고 문서가 권고한다.
- **지원 한계:** 이는 **current-state resync** 패턴이지 missed history를 그대로 재생한다는 보장이 아니다.

### [SB-03] Supabase Broadcast Replay — 복구 관련 재사용

- URL: https://supabase.com/docs/guides/realtime/broadcast
- 판본: rolling docs; JS replay 조건은 2.74.0+
- 확인일: 2026-10-02
- 정확한 절: `Broadcast replay > How it works`, `When to use Broadcast replay`
- **[사실]** page reload/network interruption 뒤 recent events를 보여주는 use case를 공식 예로 든다.
- **[사실]** replay는 private channel + Database Broadcast만 가능, retention 및 per-request limit이 존재한다.
- **지원 한계:** retained history window 밖의 message는 복구할 수 없고, replay가 arbitrary command history나 transaction log 역할을 한다고 문서화되지 않았다.

### [NK-02] Nakama — Match Handler API / Best Practices

- URLs:
  - https://heroiclabs.com/docs/nakama/server-framework/typescript-runtime/function-reference/match-handler/
  - https://heroiclabs.com/docs/nakama/server-framework/introduction/best-practices/
- 판본/상태: Heroic Labs current official docs
- 확인일: 2026-10-02
- 정확한 절:
  - Match Handler Reference `MatchTerminate`
  - Best Practices `Match handlers > Keep the match loop free of blocking I/O`
- 직접 지지하는 사실:
  - **[사실]** `MatchTerminate`는 graceful shutdown이 시작될 때 호출되고, grace 기간이 끝나면 match가 force-close되고 client가 disconnect될 수 있다.
  - **[사실]** handler는 current in-memory state를 인자로 받는다.
  - **[사실]** best-practice 문서는 state를 join 시 load하고 in-memory에서 mutate하며 match end 또는 필요한 경우 coarse interval로 persist하라고 설명한다.
- 지원 조건/한계:
  - persistence는 application/runtime storage logic이 수행해야 하며 in-memory state의 automatic durable restart라고 문서화되지 않는다.
  - graceful termination hook은 process crash/host failure에서 반드시 실행된다는 보장이 아니다.

### [NK-01] Nakama — Authoritative Multiplayer / Match migration

- URL: https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/
- 판본: current English official docs
- 확인일: 2026-10-02
- 정확한 절: `Managing matches > Match migration`, `Storing match state data`
- **[사실]** graceful shutdown 시 runtime code가 replacement match를 생성/선택하고 remaining client에게 새 match id를 broadcast하는 migration 예가 있다.
- **[사실]** current English Enterprise 설명은 match **presences** replication을 명시한다.
- **지원 한계:** 이 예는 full game state의 transparent automatic failover를 문서화하지 않는다.
- **문서 충돌/시점 주의:** 오래된 한국어 번역 일부가 “현재 상태 목록” 같은 표현으로 보일 수 있으나 current English source는 `match presences are replicated`라고 명시한다. 이번 보고서는 current English를 기준으로 하며 full gameplay state replication으로 해석하지 않는다.

### [NK-03] Nakama — Client Relayed Multiplayer

- URL: https://heroiclabs.com/docs/nakama/concepts/multiplayer/relayed/
- 판본: current English official docs
- 확인일: 2026-10-02
- 정확한 절: introduction, `Create a match`, `Join a match`
- **[사실]** relayed match에서 Nakama가 유지하는 match data는 match ID와 presences이며 gameplay payload를 검사하지 않고 relay한다.
- **[사실]** relayed match는 마지막 participant가 떠날 때까지만 in-memory에 존재하고 persist할 수 없다고 문서가 명시한다.
- **지원 한계:** 이 source는 authoritative model의 durability 근거가 아니다.

### [PH-03] Photon PUN 2 — FAQ / Analyzing Disconnects

- URLs:
  - https://doc.photonengine.com/pun/current/troubleshooting/faq
  - https://doc.photonengine.com/pun/current/troubleshooting/analyzing-disconnects
- 판본/상태: PUN 2 maintenance/LTS; current docs checked 2026-10-02
- 확인일: 2026-10-02
- 정확한 절:
  - FAQ `How to quickly rejoin a room after disconnection?`
  - Analyzing Disconnects `Disconnects by Server`, `Timeout Disconnect`
- 직접 지지하는 사실:
  - **[사실]** quick rejoin은 (1) room이 same server에 남아 있거나 load 가능, (2) 동일 UserId actor가 inactive 상태, (3) `PlayerTTL != 0`, (4) PlayerTTL이 만료되지 않았다는 조건이 필요하다.
  - **[사실]** empty room의 생존은 `EmptyRoomTTL`과 관련된다.
  - **[사실]** timeout, buffer full, subscription CCU limit 등 server-side disconnect 원인이 공식 문서에 있다.
  - **[사실]** reliable UDP command는 ACK가 없으면 재전송되다가 조건을 넘으면 disconnect될 수 있다.
- 지원 조건/한계:
  - quick rejoin은 성공 조건을 제공하지만 성공을 무조건 보장하지 않는다.
  - input packet에 project의 `PlayerTTL`/`EmptyRoomTTL` 설정 값이 없으므로 project recovery window 수치를 만들 수 없다.

### [PH-01] Photon PUN 2 — Cached Events — 복구 관련 재사용

- URL: https://doc.photonengine.com/pun/current/gameplay/cached-events
- 판본: PUN 2 maintenance/LTS, Last updated 2026-08-19
- 확인일: 2026-10-02
- 정확한 절: `Special Considerations`
- **[사실]** cache limit에 도달하면 new join이 막히고 inactive actor rejoin이 불가능할 수 있다.
- **지원 한계:** room event cache는 영구 event log/영구 결과 ledger가 아니다.

### [PRIOR-GGPO] 입력 packet의 STEP3 기존 조사 범위

- 진입 URL: https://github.com/pond3r/ggpo
- 이번 확인 상태: **외부 원문 재열람하지 않음. 입력 packet의 승인 조사 범위만 재사용**
- **[사실 — 입력 packet에 기록된 기존 조사]** GGPO는 rollback/prediction에서 simulation 재실행/effect 지연과 관련된 근거로 사용되었으나 영구 보상·외부 결과의 중복 방지까지 증명한 것은 아니다.
- **지원 한계:** 이 보고서에서 GGPO를 payment/reward/result ledger의 exactly-once 근거로 확장하지 않는다.

## 8. Q02 프로젝트 적용 추론

1. **[프로젝트 적용 추론]** current-state resync, retained history replay, deterministic simulation rerun은 서로 대체 관계가 아니다. 각각 “현재 authoritative 결과”, “최근 event history”, “simulation 계산 재현”을 복구한다.
2. **[프로젝트 적용 추론]** 입력 packet의 S3-T04 단절유실은 Realtime event를 반드시 모두 replay해야만 해결되는 문제로 한정할 수 없다. authoritative current snapshot으로 수렴하는 설계라면 missed invalidation 뒤 resync가 별도 복구 경로가 될 수 있다. 다만 실제 recovery latency/window는 미확인이다.
3. **[프로젝트 적용 추론]** S3-T05 rollback 결과중복은 simulation을 다시 계산할 수 있다는 사실과 external result/effect를 한 번만 commit한다는 사실을 분리해 검증해야 한다. [PRIOR-GGPO]는 후자를 보장하지 않는다.
4. **[프로젝트 적용 추론]** Nakama authoritative match도 in-memory state persistence가 자동이 아니므로 “전용 authoritative loop를 사용하면 재시작 복구까지 자동”이라는 일반화는 공식 자료가 지지하지 않는다.
5. **[프로젝트 적용 추론]** Photon cache/rejoin은 retention/TTL 조건에 종속되므로 “rejoin 가능”을 “무기한 history/state recovery”로 읽을 수 없다.

## 9. Q02 미확인

- **[미확인]** 프로젝트가 허용해야 하는 최대 event gap, recovery time, offline duration 수치.
- **[미확인]** 현재 RPC snapshot이 disconnected client가 복귀할 때 필요한 모든 authoritative state를 포함하는지.
- **[미확인]** result/reward/score 등 irreversible effect가 있다면 그 commit ledger와 idempotency key가 어디에 있는지.
- **[미확인]** current project에서 reconnect 후 history가 필요한 UI/게임과 latest-state만 필요하면 되는 게임의 분류.
- **[미확인]** authoritative server 후보를 사용할 경우 crash restart에 요구되는 durability 수준과 저장 주기.
- **[미확인]** Nakama self-host/managed에서 실제 선택될 server version/configuration, graceful shutdown 설정, storage policy.
- **[미확인]** Photon을 실제 사용한다고 가정할 수 없으며, 사용한다면 PUN2인지 다른 Photon product인지도 결정되지 않았다.

## 10. Q02 Astra 3A / 3B / 3C 판단 질문

### Astra 3A — 복구 의미

- **[Astra 판단 질문]** 게임별 recovery contract가 “최신 authoritative state로 수렴”이면 충분한지, 아니면 사용자에게 replay할 event history도 보존해야 하는지?
- **[Astra 판단 질문]** simulation rollback과 irreversible result/effect commit 사이에 어떤 confirmation/finalization 경계가 필요한지?
- **[Astra 판단 질문]** graceful restart, ungraceful crash, client reconnect를 각각 별도 failure class로 정의해야 하는지?

### Astra 3B — 모델별 복구 수단

- **[Astra 판단 질문]** DB snapshot model에서 history가 필요한 경우 별도 event ledger가 필요한지, 단순 invalidation+snapshot으로 충분한 범위는 어디까지인지?
- **[Astra 판단 질문]** authoritative loop model에서 in-memory state의 persist/reload contract를 어느 수준까지 Core에 둘지, model-specific optional capability로 둘지?
- **[Astra 판단 질문]** late join/rejoin에서 “현재 상태”, “최근 history”, “사용자 private state”를 각각 어떻게 재구성해야 하는지?

### Astra 3C — 복구 검증

- **[Astra 판단 질문]** disconnect 중 N개의 invalidation을 잃고 reconnect해도 최종 authoritative snapshot에 수렴하는지를 어떤 failure injection으로 검증할지?
- **[Astra 판단 질문]** same input의 retry/rollback rerun을 반복해도 irreversible result가 한 번만 commit되는지 별도 oracle을 둘지?
- **[Astra 판단 질문]** server graceful shutdown과 abrupt process loss를 분리해 어떤 state loss가 허용/불허인지 test contract에 명시할지?

---

# Q03 — private·인가 신선도: Postgres Changes / Broadcast / Presence

## 11. Q03 요약 / 모드 비교표

| Realtime 모드 | 인증/접근 판단의 공식 경계 | 정책·회원상태 변경 후 기존 연결 | token refresh / 재가입 | private 정보 관련 한계 |
|---|---|---|---|---|
| Broadcast | private channel에서 `realtime.messages` RLS로 send/receive 권한을 제어 | Realtime Authorization의 client access policy는 connection 동안 cache됨. 권한 revoke 후에도 JWT 만료 또는 새 JWT가 들어오기 전까지 기존 client가 message를 계속 받을 수 있다고 명시 | channel connect/subscribe 또는 new JWT `access_token`에서 access policy cache update | recipient 제한과 이미 발송된 정보 회수는 별개 |
| Presence | Broadcast와 동일한 Realtime Authorization framework로 publish/receive 권한을 제어 | 동일한 connection-level policy cache 경계 | connect/subscribe/new JWT에서 재평가 | presence state는 현재 참여 상태이며 application secret storage로 보장된다는 근거 아님 |
| Postgres Changes | RLS가 있는 source table의 record는 해당 RLS로 read 허용된 client에게만 전달된다고 명시 | 공식 문서는 row delivery가 RLS에 따름을 말하지만, **회원상태 row 변경 직후 이미 열린 subscription의 exact revocation latency**를 별도 수치/atomic guarantee로 제시하지 않음 | public/private channel 모두 Postgres Changes subscribe 가능. protocol reauth와 table RLS freshness를 같은 계약으로 단정하지 않음 | publication/filter/RLS가 맞아야 하며, 이미 client에 전달된 payload 회수는 다루지 않음 |

## 12. Q03 출처 / 확인 범위

### [SB-05] Supabase Realtime Authorization

- URL: https://supabase.com/docs/guides/realtime/authorization
- 판본/상태: Supabase rolling official docs
- 확인일: 2026-10-02
- 정확한 절:
  - `How it works`
  - Broadcast authorization sections
  - Presence authorization sections
  - `Interaction with Postgres Changes`
  - `Updating RLS policies`
- 직접 지지하는 사실:
  - **[사실]** `realtime.messages` RLS로 Broadcast/Presence client의 send/receive 권한을 제어한다.
  - **[사실]** private channel access는 channel topic, JWT/role/header 등을 기반으로 RLS policy가 평가된다.
  - **[사실]** Postgres Changes에서 RLS source table의 records는 RLS상 read가 허용된 client에게만 전송된다고 명시한다.
  - **[사실]** Realtime client access policies는 connection 동안 cache되며 DB를 every Channel message마다 조회하지 않는다.
  - **[사실]** access policy cache는 (a) Realtime connect+Channel subscribe, (b) client가 새 JWT를 `access_token`으로 보낼 때 갱신된다.
  - **[사실]** 권한을 revoke해도 기존 연결은 JWT expire 또는 새 JWT가 전달되기 전까지 message를 계속 받을 수 있다고 문서가 명시한다. 새 JWT가 없으면 JWT expiry에 disconnect된다.
- 지원 조건/한계:
  - `Updating RLS policies`의 cache 설명은 Realtime Authorization의 **channel access policy cache** 문맥이다. 이를 Postgres source-table RLS가 active subscription의 every row change마다 어떤 내부 query/cache 전략을 쓰는지까지 동일하게 일반화하지 않는다.
  - 문서는 Postgres Changes record delivery가 RLS를 따른다고 말하지만 “profiles.status 변경 commit과 동시에 기존 subscription delivery가 원자적으로 차단된다”는 latency/ordering 보장은 제시하지 않는다.

### [SB-01] Supabase Realtime Protocol — token refresh

- URL: https://supabase.com/docs/guides/realtime/protocol
- 판본: protocol examples 2.0.0, rolling docs
- 확인일: 2026-10-02
- 정확한 절: `access_token`, `Access token refresh`
- **[사실]** private channel에서 `access_token` event로 JWT를 in-band refresh할 수 있다.
- **[사실]** 성공 시 reply가 없고, failure 시 `system` error 후 channel close가 가능하다.
- **지원 한계:** token refresh success에 별도 ACK가 없으므로 “client가 refresh request를 보냈다”와 “application profile cache가 refreshed됐다”는 다른 사실이다.

### [SB-06] Supabase Realtime Architecture / Limits

- URLs:
  - https://supabase.com/docs/guides/realtime/architecture
  - https://supabase.com/docs/guides/realtime/limits
- 판본: rolling docs
- 확인일: 2026-10-02
- 정확한 절:
  - Architecture의 Postgres Changes / Broadcast processing description
  - Limits의 error/disconnect sections
- **[사실]** Realtime service는 Broadcast, Presence, Postgres Changes를 별도 기능으로 처리한다.
- **[사실]** limit/connection failure가 channel join refusal 또는 disconnect를 일으킬 수 있다.
- **지원 한계:** connection availability와 authorization freshness는 다른 문제다.

## 13. Q03 프로젝트 적용 추론

1. **[프로젝트 적용 추론]** 입력 packet의 server helper가 RPC 실행 시 `profiles.status='approved'`를 DB에서 조회한다는 사실은 **request-time server authorization** 경계다. 반면 `auth.js`의 `TOKEN_REFRESHED`가 session/user만 바꾸고 cached profile을 재조회하지 않는다는 관찰은 **client-side UI/profile freshness** 경계다. 둘을 같은 보장으로 취급할 수 없다.
2. **[프로젝트 적용 추론]** Realtime Broadcast/Presence의 access policy cache 규칙 때문에, `profiles.status` 같은 DB row를 RLS policy가 참조한다고 가정하더라도 **DB row가 바뀌는 즉시 이미 열린 channel이 자동으로 재평가된다고 전제하면 안 된다.** [SB-05]는 새 JWT 또는 reconnect/subscribe 시 cache update를 명시한다.
3. **[프로젝트 적용 추론]** 다만 current project의 Realtime policy가 실제로 `profiles.status`를 참조하는지, private channel을 쓰는지, Postgres Changes source-table RLS가 무엇인지는 입력에 없으므로 “현재 열린 게임에서 approval revoke가 즉시 차단된다/안 된다” 어느 쪽도 확정할 수 없다.
4. **[프로젝트 적용 추론]** 요청 인가(request authorization), stream recipient 제한, client cache 폐기, 이미 전달된 private 정보의 회수는 별도 통제다. STEP4A input의 기존 확인 범위와도 일치하며 이번 조사에서는 이들을 하나의 “logout/revoke” 보장으로 합치지 않는다.
5. **[프로젝트 적용 추론]** viewer-specific snapshot은 server-side response shaping으로 관찰되었으나, Realtime publication이 rooms/players를 broadcast하는 현재 범위와 결합했을 때 실제 private field가 publication payload에 포함되지 않는지는 최종 schema/publication 확인 없이는 일반화할 수 없다.

## 14. Q03 미확인

- **[미확인]** production Realtime channel이 private인지 public인지, Broadcast/Presence를 실제 사용하는지.
- **[미확인]** `realtime.messages` RLS policy와 source table RLS의 실제 내용.
- **[미확인]** RLS가 `profiles.status`를 직접/간접 참조하는지.
- **[미확인]** current `supabase-js` version과 `setAuth`/automatic token refresh wiring.
- **[미확인]** project access-token TTL, refresh cadence, revoke 실험 결과.
- **[미확인]** profile approval 변경 후 열린 game UI/client cache가 언제 폐기되는지.
- **[미확인]** 이미 client memory/log/network path에 전달된 private 정보의 회수 여부. 공식 Realtime 문서가 retroactive recall을 보장하지 않는다.
- **[미확인]** Postgres Changes active subscription에서 source-table RLS와 관련 membership row가 변경된 동일 transaction 전후의 exact delivery ordering/latency. 이 부분은 security-critical이면 별도 실험/지원 확인이 필요하다.

## 15. Q03 Astra 3A / 3B / 3C 판단 질문

### Astra 3A — 인가 경계

- **[Astra 판단 질문]** “승인회원”의 권한 변경이 즉시 적용되어야 하는 범위를 request, new snapshot, new stream message, existing cached UI 중 어디까지로 정의할지?
- **[Astra 판단 질문]** private data의 confidentiality requirement를 “새 전달 금지”와 “이미 전달된 client memory 정리”로 분리해 어떤 보장을 Core가 요구할지?
- **[Astra 판단 질문]** server DB authorization을 source of truth로 둘 때 client cached profile은 단순 UX 상태인지, security gate로 쓰지 못하도록 명시해야 하는지?

### Astra 3B — mode별 반영

- **[Astra 판단 질문]** Postgres Changes, Broadcast, Presence를 사용하는 모델마다 authorization freshness contract를 별도로 정의할지?
- **[Astra 판단 질문]** status revoke 시 existing Realtime connection을 적극 disconnect/re-auth/re-subscribe할 필요가 있는지, JWT expiry window를 허용 가능한 정책으로 볼지?
- **[Astra 판단 질문]** viewer-specific private state는 snapshot-only로 제한할지, private stream이 필요할 경우 recipient policy/re-auth semantics를 어떤 capability로 요구할지?

### Astra 3C — 보안 검증

- **[Astra 판단 질문]** approved→revoked 변경 직전/직후에 열린 channel에서 new message/snapshot/action을 각각 시도하여 어떤 것은 즉시 거부되어야 하는지 test oracle을 분리할지?
- **[Astra 판단 질문]** token refresh 성공 reply가 없는 protocol에서 실제 policy 재평가 완료를 무엇으로 관측/검증할지?
- **[Astra 판단 질문]** T03 참가↔관전, 역방향, 사용자 변경과 approval revoke를 결합해 다른 사용자의 private state가 late callback/cache에 남지 않는지 어떻게 검증할지?

---

# Q04 — 실행·transport·운영/비용 비교

## 16. Q04 핵심 결론(비선택형)

**[사실]** 이번 공식 자료 확인으로 아래 세 분류는 실행 권위와 복구·운영 표면이 서로 다름을 확인했다.

1. **DB transaction + invalidation + authoritative snapshot**: DB transaction/RPC가 state commit 권위를 갖고 Realtime은 변경 신호/메시징 층으로 사용될 수 있다.
2. **Dedicated authoritative match loop + stream**: Nakama authoritative 사례처럼 server runtime이 fixed tick loop에서 gameplay rule/state를 직접 실행하고 stream한다.
3. **relay/client simulation + retained room/cache**: Photon PUN/Realtime 사례처럼 transport/room/cache를 제공하면서 gameplay authority/logic은 client 또는 별도 server/plugin 구조에 둘 수 있다.

**[사실 — 지원 범위 확인]** Supabase Realtime의 일반 공식 문서는 Realtime 기능을 Broadcast, Presence, Postgres Changes로 문서화하며, **사용자 정의 fixed-tick authoritative simulation loop를 Realtime 서비스 자체가 실행한다고 문서화하지 않는다.** 이는 “기능 부재를 수학적으로 증명”하는 주장이 아니라, **검토한 official Realtime 기능 문서가 해당 capability의 지원 근거를 제공하지 않는다는 확인 결과**다.

**[결정 아님]** 어느 분류가 프로젝트에 적합한지는 여기서 선택하지 않는다.

## 17. Q04 분류 비교표

| 항목 | DB transaction + invalidation (Supabase 사례) | Dedicated authoritative loop (Nakama authoritative 사례) | Relay/client simulation (Photon PUN2/Realtime 사례) |
|---|---|---|---|
| 실행 권위 | DB transaction/RPC가 commit 권위를 가질 수 있음. Realtime은 B/P/PG Changes 메시징 | server match handler가 gameplay data 검증·상태 계산·broadcast | Photon server는 room/transport/cache를 제공. PUN default client-driven 모델에서는 게임 권위가 자동 server simulation으로 바뀌지 않음 |
| 시간 모델 | DB transaction/action-driven. Realtime 문서에 arbitrary fixed tick simulation API 근거 없음 | fixed tick match loop | client simulation/send cadence + transport sequencing; room cache/history 기능 별도 |
| 상태 유지 | Postgres durable state 가능. Realtime event는 유실 가능 | match state는 runtime memory 중심, durability는 app storage에 persist | room properties/cache/actor state는 room lifetime/TTL/cache 조건에 종속 |
| restart/failover | DB/managed service durability는 product infra 계약에 따름; stream missed event는 re-fetch 필요 | graceful terminate/migration hook. full in-memory state automatic failover 근거 없음 | rejoin은 room alive/loadable + TTL + inactive actor 조건; 실패 가능 |
| ordering | Postgres Changes server processing order는 존재하나 end-to-end no-loss 아님 | loop input buffer/processing order, tick overload drop 가능 | reliable same channel ordered; channels independent; PUN cached-before-live order, unreliable UDP 예외 |
| duplicate commit | DB transaction/idempotency는 application schema/RPC contract가 담당 | application runtime/storage가 담당 | transport reliability/cache와 application commit idempotency는 별도 |
| auth/private | Supabase Auth/JWT + DB RLS + Realtime Authorization. policy cache freshness 주의 | Nakama session JWT; game runtime에서 join/action validation 가능 | PUN default anonymous 가능, production auth는 별도 provider/custom auth 구성 필요 |
| scaling/region | managed Realtime plan limits/regions/config에 종속; project region 미입력 | self-host scale 또는 Heroic Cloud managed cluster | Photon Cloud Public/Premium/Enterprise product/region에 종속 |
| observability | Supabase dashboard Realtime logs/usage/reports | self-host는 자체 운영 필요; Heroic Cloud는 metrics/logging/managed infra 제공 | Photon dashboard counters, traffic/bandwidth/disconnect analytics; 일부 Counter API는 Premium/Circle/Enterprise |
| 가격 표면 | subscription/compute + Realtime messages + peak connections + egress + DB/storage/observability 등 | OSS self-host infra/ops 비용 또는 Heroic Cloud allocated deployment/support/add-ons | Photon Cloud CCU SKU/usage + traffic overage + optional support/enterprise 조건 |
| 이번 조사로 못 정하는 것 | project fit, 실제 p95 latency, 필요한 plan, snapshot cost | 필요한 tick, server CPU, persistence interval, HA 수준 | 필요한 CCU, region, traffic, PUN2 채택 여부, client-authority 허용 여부 |

## 18. Q04 Supabase 공식 확인

### [SB-07] Supabase Realtime Overview / Architecture

- URLs:
  - https://supabase.com/docs/guides/realtime
  - https://supabase.com/docs/guides/realtime/architecture
- 판본: rolling official docs
- 확인일: 2026-10-02
- 정확한 절:
  - Realtime overview의 `Broadcast`, `Presence`, `Postgres Changes`
  - Architecture의 feature/data-flow descriptions
- 직접 지지하는 사실:
  - **[사실]** Realtime의 documented feature surface는 Broadcast, Presence, Postgres Changes다.
  - **[사실]** Postgres Changes는 database WAL/replication 기반으로 changes를 client에 전송한다.
  - **[사실]** Broadcast는 client/server 또는 database-triggered message distribution에 사용된다.
- 지원 조건/한계:
  - 검토한 Realtime docs에는 arbitrary user game code를 fixed tick로 실행하는 authoritative match-loop API가 없다.
  - marketing use case로 multiplayer communication을 지원한다는 사실과 “server가 game simulation을 authoritative하게 실행한다”는 사실은 구별한다.

### [SB-08] Supabase Realtime Limits

- URL: https://supabase.com/docs/guides/realtime/limits
- 판본: rolling docs, checked 2026-10-02
- 확인일: 2026-10-02
- 정확한 절: plan limit table, `Limit errors`, replay limits
- 공개 service limits — **후보 서비스의 공개 상한이며 project requirement가 아님**:
  - **[사실]** 2026-10-02 공개 표의 concurrent connections: Free 200, Pro 500, Pro(no spend cap) 10,000, Team 10,000, Enterprise 10,000+.
  - **[사실]** messages/sec: Free 100, Pro 500, Pro(no spend cap)/Team 2,500, Enterprise 2,500+.
  - **[사실]** channel joins/sec도 Free 100, Pro 500, Pro(no spend cap)/Team 2,500, Enterprise 2,500+.
  - **[사실]** channels/connection은 Free~Team 100, Enterprise 100+; Broadcast payload는 Free 256KB, paid 공개 표는 3,000KB; Postgres change payload는 Free~Team 1,024KB.
  - **[사실]** Broadcast replay retention 72h, request max 25.
  - **[사실]** over-limit에서 `too_many_channels`, `too_many_connections`, `too_many_joins`, `tenant_events` 등의 error/disconnect가 가능하다.
- 지원 한계:
  - 위 수치는 **서비스 공개 plan limit**이며 이 프로젝트의 필요한 동접/초당 메시지/가입률/대역폭 수치가 아니다.
  - 입력 packet에 동접/주기/대역폭이 없으므로 어떤 plan도 적합하다고 결론내리지 않는다.
  - benchmark 수치를 project capacity 예측으로 사용하지 않는다.

### [SB-08b] Supabase Available Regions / Realtime routing

- URLs:
  - https://supabase.com/docs/guides/platform/regions
  - https://supabase.com/docs/guides/realtime/architecture
- 판본: rolling official docs
- 확인일: 2026-10-02
- 정확한 절: `Available regions`, Realtime Architecture `Connecting to a database`
- 직접 지지하는 사실:
  - **[사실]** Supabase project는 하나의 primary region에 배치되며 current specific region 목록에는 Seoul(`ap-northeast-2`)도 포함된다.
  - **[사실]** Realtime은 database region을 알고 가장 가까운 Realtime region에서 DB에 연결한다고 architecture가 설명하며, 각 Realtime region에는 적어도 두 node가 있어 한 node가 offline이면 다른 node가 reconnect해 streaming을 재개해야 한다고 설명한다.
- 지원 조건/한계:
  - 이 문구는 Realtime node reconnect/architecture 설명이지 lost event 자동 replay나 project RPO/RTO SLA가 아니다.
  - project의 실제 primary region은 입력에 없으므로 특정 region을 가정하지 않는다.

### [SB-09] Supabase Realtime Pricing

- URL: https://supabase.com/docs/guides/realtime/pricing
- 판본: current official pricing docs
- 확인일: **2026-10-02**
- 정확한 절: `Messages`, `Peak connections`
- 공개 가격:
  - **[사실]** Realtime Messages over-usage: Pro/Team 기준 **$2.50 / 1 million messages**. Free 2M included, Pro/Team 5M included, Enterprise custom.
  - **[사실]** Realtime Peak Connections over-usage: Pro/Team 기준 **$10 / 1,000 peak connections**. Free 200 included, Pro/Team 500 included, Enterprise custom.
- 지원 조건:
  - overage는 plan quota 초과분에 적용.
  - Free는 표에서 over-usage price가 제공되지 않으며 paid overage rule을 Free에 임의 적용하지 않는다.

### [SB-10] Supabase Realtime usage metering / egress / billing

- URLs:
  - https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages
  - https://supabase.com/docs/guides/platform/manage-your-usage/realtime-peak-connections
  - https://supabase.com/docs/guides/platform/manage-your-usage/egress
  - https://supabase.com/docs/guides/platform/billing-on-supabase
- 판본: current official docs
- 확인일: 2026-10-02
- 정확한 절:
  - Realtime Messages `What you are charged for`, `How charges are calculated`
  - Realtime Peak Connections `What you are charged for`, `How charges are calculated`
  - Egress pricing/usage sections
  - Billing `Usage Item`, `Project add-ons`
- 직접 지지하는 사실:
  - **[사실]** DB change 1건은 그 event를 듣는 **client당 1 message**로 meter된다.
  - **[사실]** Broadcast는 1 sent message + receive하는 subscribed client당 1 message로 meter된다.
  - **[사실]** Realtime messages는 1M package 단위, peak connections는 1,000 package 단위로 계산되고 중간값은 다음 whole package로 올림된다.
  - **[사실]** peak connections는 billing cycle 동안 각 project의 highest concurrent successful connection을 잡고 organization 내 project peak를 합산하는 방식으로 문서화돼 있다.
  - **[사실]** Supabase unified egress는 paid plan quota 초과에 대해 uncached egress **$0.09/GB**가 공개돼 있다. Realtime client 전송량도 egress surface에서 고려해야 한다.
  - **[사실]** DB size, storage, auth users, function usage, compute, read replicas, disk, log drains 등은 Realtime message/connection 비용과 별도의 billing/add-on surface다.
- 지원 한계:
  - project의 M(messages), P(peak connections), E(egress), DB compute/size가 입력에 없어 월 비용 계산 불가.

### 18.1 Supabase 비용 변수식 — 프로젝트 수치 대입 금지

아래는 **가격 구조를 표현하기 위한 변수식**이며 예상 견적이 아니다.

- `M` = billing cycle Realtime metered messages
- `Q_M(plan)` = plan included Realtime message quota
- `P` = official billing rule에 따른 organization 합산 project peak connections
- `Q_P(plan)` = plan included peak connection quota
- `E` = billable uncached egress GB
- `Q_E(plan)` = plan egress quota

Paid plan 공개 overage를 적용할 수 있는 경우의 구조 예:

```text
RealtimeMessageOverage
  = 2.50 USD × ceil(max(0, M - Q_M) / 1,000,000)

RealtimePeakOverage
  = 10 USD × ceil(max(0, P - Q_P) / 1,000)

EgressOverage
  = 0.09 USD × max(0, E - Q_E)

TotalSupabaseSurface
  = subscription/compute
  + RealtimeMessageOverage
  + RealtimePeakOverage
  + EgressOverage
  + DB/disk/storage/backups/PITR/logging/auth/functions/add-ons
  + internal operations labor
```

**[미확인]** 어떤 plan을 전제로 해야 하는지, project가 overage에 진입하는지, compute size가 무엇인지 모두 미입력이다. 따라서 “최저 월비용”, “무료 플랜이면 충분”, “Pro가 필요” 같은 결론을 쓰지 않는다.

## 19. Q04 Nakama 공식 확인

### [NK-04] Nakama install / deployment editions

- URLs:
  - https://heroiclabs.com/docs/nakama/getting-started/install/
  - https://heroiclabs.com/nakama/
  - https://heroiclabs.com/docs/heroic-cloud/introduction/
- 판본: current Heroic Labs official docs
- 확인일: 2026-10-02
- 정확한 절: Nakama install options, Heroic Cloud introduction
- 직접 지지하는 사실:
  - **[사실]** Nakama OSS는 self-host할 수 있다. Heroic Labs의 Nakama product page는 server/client open-source license를 Apache 2.0으로 명시한다.
  - **[사실]** Heroic Cloud는 Nakama를 dedicated servers, managed database, load balancer, monitoring, backups, scaling과 함께 제공하는 managed deployment다.
- 지원 조건/한계:
  - self-host와 Heroic Cloud의 비용/운영 책임을 섞지 않는다.

### [NK-01]/[NK-02] Nakama authoritative execution/restart

- URLs:
  - https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/
  - https://heroiclabs.com/docs/nakama/server-framework/typescript-runtime/function-reference/match-handler/
  - https://heroiclabs.com/docs/nakama/server-framework/introduction/best-practices/
- 판본: current official docs
- 확인일: 2026-10-02
- 직접 지지하는 사실:
  - **[사실]** server authoritative custom match loop와 tick rate를 제공한다.
  - **[사실]** excessive input 대비 drop 가능성을 문서화한다.
  - **[사실]** match state는 developer-defined in-memory state이고 durability가 필요하면 storage persistence를 설계해야 한다.
  - **[사실]** graceful shutdown hook과 migration example이 존재한다.
- 지원 한계:
  - Enterprise presence replication/cluster balancing은 full match-state automatic failover 증거가 아니다.

### [NK-05] Nakama Sessions

- URL: https://heroiclabs.com/docs/nakama/concepts/session/
- 판본: current official docs
- 확인일: 2026-10-02
- 정확한 절: session overview, `Session logout`
- **[사실]** client request는 signed JWT session으로 authorize되고 server는 매 call DB lookup 없이 token을 검증할 수 있다.
- **[사실]** session logout은 auth/refresh token을 invalidate하지만 open socket을 자동 disconnect하지 않으며 server-side `sessionDisconnect`가 별도다.
- 지원 한계:
  - 공개 default TTL 값은 product default일 뿐 project 설정이 아니다. 이번 비교에서는 project TTL로 사용하지 않는다.

### [NK-06] Heroic Cloud operations / billing

- URLs:
  - https://heroiclabs.com/docs/heroic-cloud/introduction/
  - https://heroiclabs.com/docs/heroic-cloud/concepts/organizations/billing-support/
  - https://heroiclabs.com/heroic-cloud/
  - https://heroiclabs.com/pricing/
- 판본: current official Heroic Cloud docs/pricing
- 확인일: **2026-10-02**
- 정확한 절:
  - Heroic Cloud Introduction `Core products`
  - Billing `How usage is calculated`, `Prorated billing`, `Idle deployments`
  - Pricing `Nakama on Heroic Cloud Pricing`, `Support`
- 직접 지지하는 사실:
  - **[사실]** Heroic Cloud billing은 active deployment, support plan, add-ons를 기준으로 daily 계산 후 monthly invoice하는 usage/allocation 기반 구조다.
  - **[사실]** Heroic Cloud 공식 product page는 AWS/GCP의 North America, Europe, Asia에서 multi-region deployment를 제공하고 추가 region은 요청 가능하다고 설명한다.
  - **[사실]** idle deployment도 allocated resource가 남아 있는 동안 같은 방식으로 비용이 발생하고 pause가 아니라 delete가 필요하다고 billing docs가 설명한다.
  - **[사실]** pricing page의 configurator는 Nakama CPU와 Database CPU를 입력 요소로 하고, all plans에 Nakama Enterprise, dedicated resources, managed DB, backups, metrics/monitoring, scaling/LB/log aggregation 등을 포함한다고 표기한다.
  - **[사실]** 현재 public pricing page에는 configurator의 한 예 상태에서 `$600/month`가 표시되고 별도 support package 가격도 공개돼 있다.
- 지원 조건/한계:
  - **이 `$600` 표시를 프로젝트의 “최소 월비용”으로 해석하지 않는다.** page는 resource configurator이고 smaller development options도 별도로 언급한다. 정확 견적에는 CPU/DB tier/environment/add-on/support 선택이 필요하다.
  - Enterprise/private quote 항목과 public configurator 가격을 혼합하지 않는다.

### 19.1 Nakama 비용 변수식 — self-host와 managed 분리

**Nakama OSS self-host**

```text
TotalNakamaSelfHost
  = Nakama OSS license cost (Apache 2.0 software license fee = 0)
  + compute
  + PostgreSQL/database
  + load balancer/network/egress
  + storage/backups
  + metrics/logging/tracing
  + HA/disaster-recovery infrastructure
  + patching/on-call/operations labor
  + optional commercial/enterprise support or licenses
```

- **[미확인]** host provider, region, CPU/RAM, DB, bandwidth, HA topology, operators가 없으므로 숫자 견적 불가.

**Heroic Cloud managed**

```text
TotalHeroicCloud
  = daily active deployment allocation (environment/scaling tier)
  + support plan, if selected
  + add-ons (log/metric export, replicas, etc.), if selected
```

- **[미확인]** selected Nakama CPU, DB CPU, environment, scaling tier, add-ons, support가 없으므로 exact 월비용 불가.

## 20. Q04 Photon 공식 확인

### [PH-04] PUN 2 edition / deployment / authentication

- URLs:
  - https://doc.photonengine.com/pun/current/getting-started/pun-intro
  - https://doc.photonengine.com/pun/current/getting-started/initial-setup
  - https://doc.photonengine.com/pun/current/connection-and-authentication/authentication/overview-auth
- 판본/상태: **PUN 2 maintenance/LTS**; auth page Last updated 2026-08-19
- 확인일: 2026-10-02
- 정확한 절: PUN intro, setup Cloud/Server, Authentication Overview
- 직접 지지하는 사실:
  - **[사실]** PUN 2는 maintenance/LTS이며 fixes 외 신규 feature update 계획이 없다고 공식 문서가 표시한다.
  - **[사실]** PUN은 Photon Cloud 또는 self-hosted Photon Server 계열과 연결할 수 있는 deployment 문맥이 있다.
  - **[사실]** default user는 anonymous이고 client가 `userId`를 self-claim할 수 있어 검증되지 않으며, production security를 위해 authentication provider/custom auth 구성을 권고한다.
- 지원 조건/한계:
  - “PUN2 유지보수판”이라는 제품 상태를 현재 프로젝트의 선택/배제 결론으로 바꾸지 않는다.

### [PH-01]/[PH-02]/[PH-03] Photon ordering/rejoin

- URLs:
  - https://doc.photonengine.com/pun/current/gameplay/cached-events
  - https://doc.photonengine.com/realtime/v5/reference/low-level-transport
  - https://doc.photonengine.com/pun/current/troubleshooting/faq
  - https://doc.photonengine.com/pun/current/troubleshooting/analyzing-disconnects
- 판본: PUN2 + Realtime5 판본을 분리 기록
- 확인일: 2026-10-02
- **[사실]** same transport channel의 reliable ordering, independent sequence channels, PUN room cache의 cached-before-live ordering, TTL/room 상태에 따른 quick rejoin 조건이 공식화돼 있다.
- 지원 한계:
  - 이 transport/cache 보장이 server authoritative game simulation이나 application exactly-once result commit을 의미하지 않는다.

### [PH-05] Photon Cloud Regions / Analytics

- URLs:
  - https://doc.photonengine.com/pun/current/connection-and-authentication/regions
  - https://doc.photonengine.com/pun/current/reference/counter-analytics
- 판본: PUN 2, current pages; analytics Last updated 2026-07-20
- 확인일: 2026-10-02
- 정확한 절: region tables, application counters/analytics
- 직접 지지하는 사실:
  - **[사실]** PUN/Photon Cloud에는 다수 region이 공개되어 있고 South Korea/Seoul(`kr`)도 current list에 포함된다.
  - **[사실]** dashboard analytics에서 CCU/traffic/bandwidth/disconnect 등 operational counters를 확인할 수 있다.
  - **[사실]** Counter API는 Premium Cloud, Circle, Enterprise 대상으로 문서화돼 있다.
- 지원 조건/한계:
  - project target region은 입력에 없으며 Seoul을 선택한다고 가정하지 않는다.

### [PH-06] Photon PUN Pricing

- URL: https://www.photonengine.com/pun/pricing
- 판본/상태: current official pricing page
- 확인일: **2026-10-02**
- 정확한 절: `Public Cloud for Gaming`, `Premium Cloud for Gaming`, `Enterprise Cloud`
- 공개 가격/단위:
  - **[사실]** Development Only: 20 CCU, Free, 60GB/month, capped/no burst, development only.
  - **[사실]** Public 100 CCU: one-time `$95` for 12 months, 0.3TB/month, capped.
  - **[사실]** Public 500 CCU: `$95/month`, 1.5TB/month, CCU burst included.
  - **[사실]** Premium Cloud: `$0.29 per CCU` based on monthly usage, **minimum fee `$580/month`**, 2,000 CCU + 6TB included, auto-scaling described up to 50,000 CCU.
  - **[사실]** additional traffic: listed regions including South Korea are `$0.10/GB`; EU/Canada East/RU/RUE/US E/W는 `$0.05/GB`로 page가 구분한다.
  - **[사실]** Enterprise Cloud는 contact/sales 기반이며 dedicated servers/SLA/server plugins 등 별도 조건이다.
- 지원 조건/한계:
  - public price는 Photon Cloud plan 가격이며 self-hosted Photon Server cost와 섞지 않는다.
  - project CCU/traffic가 없으므로 어떤 SKU도 선택하거나 “가장 싼 적합 플랜”을 정하지 않는다.
  - Premium `$0.29/CCU`와 `$580 minimum`의 실제 invoice 상세는 official pricing page의 usage/minimum rule과 계약 조건에 따르며 여기서 project formula를 과잉 확정하지 않는다.

### 20.1 Photon 비용 변수식 — project 수치 미입력

```text
TotalPhotonCloud
  = selected Public/Premium/Enterprise SKU charge
  + region-specific traffic overage
  + optional premium support / enterprise services
  + separate application backend/database/auth/observability/operations costs not included by the selected Photon SKU
```

- **[미확인]** peak CCU, average/monthly CCU metering, traffic GB, region, support/SLA, 별도 backend 비용이 없음.
- 따라서 공개 SKU를 project estimate로 대입하지 않는다.

## 21. Q04 추가 제품 조사 여부

**[사실/범위 판단]** 요청문은 핵심 분류 공백을 해소하는 데 꼭 필요한 경우에만 추가 제품 최대 1개를 조사하도록 했다. 이번 조사에서는 Supabase DB+Realtime, Nakama authoritative match loop, Photon relay/client-driven + cache/transport 자료만으로 다음 핵심 분류가 공식 source에서 구분되었다.

- transaction/state-store 중심 + invalidation
- dedicated authoritative simulation loop
- relay/client simulation + transport/cache

따라서 **추가 제품은 조사하지 않았다.** 이는 특정 후보를 추천/배제한 결정이 아니라 조사 범위 최소화 조치다.

## 22. Q04 프로젝트 적용 추론

1. **[프로젝트 적용 추론]** 현재 input에서 “Realtime=invalidation, RPC snapshot=authority”라고 관찰된 구조는 Supabase Realtime을 arbitrary simulation host로 해석하지 않아도 성립한다. Realtime 자체 fixed-tick authoritative loop 근거는 확인되지 않았다.
2. **[프로젝트 적용 추론]** authoritative match loop를 채택하면 order/authority 문제가 자동 해결된다고 할 수 없다. Nakama source도 input overflow/drop, in-memory durability, graceful migration, application persistence를 별도 책임으로 둔다.
3. **[프로젝트 적용 추론]** relay/client simulation에서는 transport reliability/order가 있어도 server-side rule validation이나 result commit authority가 자동 생기지 않는다. Photon PUN auth도 default anonymous에서 별도 구성해야 한다.
4. **[프로젝트 적용 추론]** 비용 비교는 “월 정액 숫자 한 줄”로 환산할 수 없다. Supabase는 message/client fan-out, peak connections, egress, DB compute/storage 등이 있고, Nakama self-host는 infra/ops가 외부화되며 Heroic Cloud는 allocated deployment 기반, Photon은 CCU/traffic SKU 기반이다.
5. **[프로젝트 적용 추론]** 입력에 동접·region·message/tick rate·payload·session length·availability 목표가 없으므로 현재 단계의 비용 자료는 **변수/과금 단위 식별**까지만 합리적이다.

## 23. Q04 미확인

- **[미확인]** project peak/average concurrent connections, rooms/matches, players/match.
- **[미확인]** model별 tick/update/message rate, payload size, fan-out 대상 수.
- **[미확인]** target region(s), multi-region requirement, acceptable RTT/latency.
- **[미확인]** authoritative state persistence interval, RPO/RTO, restart behavior.
- **[미확인]** availability/SLA/on-call/observability/incident-response requirement.
- **[미확인]** public internet egress, storage retention, logs/metrics retention.
- **[미확인]** project budget/cost cap, internal operator labor cost.
- **[미확인]** self-host가 조직상 가능한지, managed-only가 요구되는지.
- **[미확인]** PUN2 maintenance/LTS 상태가 project lifecycle에 허용 가능한지.
- **[미확인]** Nakama Enterprise/OSS 기능 중 실제 필요 feature가 무엇인지.
- **[미확인]** Supabase production Realtime limits/settings와 current paid plan.

## 24. Q04 Astra 3A / 3B / 3C 판단 질문

### Astra 3A — capability 분해

- **[Astra 판단 질문]** Core가 요구해야 하는 것은 “transport가 실시간”인지, “server가 authoritative simulation을 실행”하는지, “durable commit authority가 존재”하는지 각각 별도 capability로 분리해야 하는가?
- **[Astra 판단 질문]** 모든 game model에 fixed tick/room version을 강제하지 않고도 authority/order/recovery/private를 검증 가능한 최소 contract는 무엇인가?
- **[Astra 판단 질문]** hosted service capability와 project application responsibility의 경계를 문서에서 어떻게 표현해야 제품 feature가 project guarantee로 승격되지 않는가?

### Astra 3B — 모델별 운영 책임

- **[Astra 판단 질문]** DB transaction 모델, authoritative loop 모델, relay/client model 각각에서 persist/restart/idempotency/authorization의 owner를 어떻게 매핑할지?
- **[Astra 판단 질문]** authoritative loop가 필요한 game subset과 event/action-driven DB model로 충분한 subset을 어떤 measurable requirement로 구분할지?
- **[Astra 판단 질문]** region/scale/observability를 Core mandatory requirement로 둘지 deployment profile로 둘지?

### Astra 3C — 수치 입력/검증 게이트

- **[Astra 판단 질문]** 비용/scale 결정을 시작하기 전에 반드시 수집해야 할 project variables를 어떤 최소 세트로 고정할지: peak CCU, rooms, message/tick rate, fan-out, payload, session length, region, egress, retention, RPO/RTO 등?
- **[Astra 판단 질문]** 서비스별 published limit을 통과했다는 것과 project load test를 통과했다는 것을 별도 승인 게이트로 둘지?
- **[Astra 판단 질문]** failure/observability 검증에서 disconnect, reconnect, message loss, server restart, authorization revoke, duplicate retry를 공통 scenario matrix로 만들지?

---

# 25. 문서 충돌·판본·확인 실패 목록

## 25.1 Supabase readiness 문서 시점 차이

- **[사실]** 2026-09-29 Postgres Changes Troubleshooting은 `SUBSCRIBED`와 replication listener readiness 사이 timing gap을 명시하고 system message 대기를 reliable fix로 설명한다.
- **[사실]** 2026-10-02 확인한 Protocol은 `replication_ready` option 및 readiness `system` event를 정식 wire protocol로 문서화한다.
- **해석 제한:** troubleshooting 페이지의 “formal documentation” 관련 과거형 표현이 남아 있더라도 current protocol의 명시적 항목을 우선해 “현재 문서화됨”으로 기록한다. timing gap 자체와 모순되지는 않는다.

## 25.2 Nakama 언어판 차이

- **[사실]** current English authoritative docs의 Enterprise 문구는 `Match presences are replicated`라고 명시한다.
- **[사실]** 오래된 한국어 번역은 문맥상 “현재 상태 목록”처럼 오독될 수 있는 번역이 있다.
- **해석 제한:** full gameplay state replication으로 확대하지 않으며 current English source를 기준으로 한다.

## 25.3 Photon 판본 경계

- **[사실]** PUN 2 docs는 maintenance/LTS라고 명시한다.
- **[사실]** transport sequencing source 중 하나는 Photon **Realtime v5** 문서다.
- **해석 제한:** Realtime v5의 low-level channel sequencing을 Photon 계열 transport 비교 근거로만 사용하며, 특정 PUN2 SDK build가 모든 Realtime v5 세부를 동일하게 구현한다고 승격하지 않는다.

## 25.4 확인 실패/공식 문서가 제공하지 않은 보장

이번 공식 자료에서 다음은 확인되지 않았다.

- Supabase Postgres Changes의 arbitrary history replay / exactly-once / snapshot+live atomic cut
- Supabase Realtime 서비스 자체의 arbitrary user-defined fixed-tick authoritative simulation loop
- Broadcast ACK의 recipient delivery/application commit 보장
- Nakama Enterprise cluster의 full in-memory gameplay match-state automatic failover
- Nakama authoritative loop 자체의 permanent result/effect idempotency
- Photon room cache/transport의 application exactly-once result commit
- 정책/회원 DB row가 바뀐 **동일 순간** 모든 existing Postgres Changes subscription이 차단된다는 explicit revocation latency SLA
- 프로젝트의 실제 throughput/latency/cost/availability 수치

확인되지 않은 항목은 완료·지원으로 기록하지 않는다.

---

# 26. 출처 인덱스

| ID | 공식 URL | 판본/확인일 | 주요 지원 범위 |
|---|---|---|---|
| SB-01 | https://supabase.com/docs/guides/realtime/protocol | rolling; protocol examples 2.0.0; 2026-10-02 | join ACK, system readiness, token refresh, error/rejoin wire semantics |
| SB-02 | https://supabase.com/docs/guides/troubleshooting/realtime-postgres-changes-troubleshooting | Last edited 2026-09-29; checked 2026-10-02 | SUBSCRIBED/readiness gap, missed event, state refetch guidance |
| SB-03 | https://supabase.com/docs/guides/realtime/broadcast | rolling; checked 2026-10-02 | server ACK scope, DB Broadcast, replay scope/retention/limit |
| SB-04 | https://supabase.com/docs/guides/realtime/reports | rolling; 2026-10-02 | Postgres Changes ordering/scaling operational context |
| SB-04b | https://supabase.com/docs/guides/realtime/limits | rolling; 2026-10-02 | public limits, disconnect/join errors, replay limits |
| SB-08b-a | https://supabase.com/docs/guides/platform/regions | rolling; 2026-10-02 | project primary region list |
| SB-08b-b | https://supabase.com/docs/guides/realtime/architecture | rolling; 2026-10-02 | Realtime-to-DB region routing/node reconnect architecture |
| SB-05 | https://supabase.com/docs/guides/realtime/authorization | rolling; 2026-10-02 | Broadcast/Presence RLS, Postgres Changes RLS, policy cache freshness |
| SB-06 | https://supabase.com/docs/guides/realtime/architecture | rolling; 2026-10-02 | Realtime feature/data flow architecture |
| SB-07 | https://supabase.com/docs/guides/realtime | rolling; 2026-10-02 | documented feature surface: Broadcast/Presence/Postgres Changes |
| SB-09 | https://supabase.com/docs/guides/realtime/pricing | current pricing; 2026-10-02 | Realtime messages/peak connections rates and quota |
| SB-10a | https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages | current; 2026-10-02 | message metering/package rule |
| SB-10b | https://supabase.com/docs/guides/platform/manage-your-usage/realtime-peak-connections | current; 2026-10-02 | peak connection metering/package rule |
| SB-10c | https://supabase.com/docs/guides/platform/manage-your-usage/egress | current; 2026-10-02 | unified egress charging surface |
| SB-10d | https://supabase.com/docs/guides/platform/billing-on-supabase | current; 2026-10-02 | DB/storage/auth/compute/add-on cost surfaces |
| NK-01 | https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/ | current English docs; 2026-10-02 | authoritative loop, input buffering/drop, match state, migration |
| NK-02a | https://heroiclabs.com/docs/nakama/server-framework/typescript-runtime/function-reference/match-handler/ | current; 2026-10-02 | MatchTerminate, graceful shutdown state |
| NK-02b | https://heroiclabs.com/docs/nakama/server-framework/introduction/best-practices/ | current; 2026-10-02 | in-memory loop + explicit persistence guidance |
| NK-03 | https://heroiclabs.com/docs/nakama/concepts/multiplayer/relayed/ | current English docs; 2026-10-02 | relay/client authority, in-memory lifecycle |
| NK-04 | https://heroiclabs.com/docs/nakama/getting-started/install/ | current; 2026-10-02 | self-host deployment |
| NK-04b | https://heroiclabs.com/nakama/ | current product page; 2026-10-02 | OSS Apache 2.0 license surface |
| NK-05 | https://heroiclabs.com/docs/nakama/concepts/session/ | current; 2026-10-02 | JWT session/logout/socket separation |
| NK-06a | https://heroiclabs.com/docs/heroic-cloud/introduction/ | current; 2026-10-02 | managed infrastructure/observability |
| NK-06a2 | https://heroiclabs.com/heroic-cloud/ | current product page; 2026-10-02 | managed multi-region/allocated resource surface |
| NK-06b | https://heroiclabs.com/docs/heroic-cloud/concepts/organizations/billing-support/ | current; 2026-10-02 | allocation/usage billing, idle deployment |
| NK-06c | https://heroiclabs.com/pricing/ | current price page; 2026-10-02 | Heroic Cloud configurator/support price surfaces |
| PH-01 | https://doc.photonengine.com/pun/current/gameplay/cached-events | PUN2 maintenance/LTS; updated 2026-08-19 | cached→live ordering, cache failure conditions |
| PH-02 | https://doc.photonengine.com/realtime/v5/reference/low-level-transport | Realtime v5; updated 2026-08-19 | reliable/unreliable sequencing, independent channels |
| PH-03a | https://doc.photonengine.com/pun/current/troubleshooting/faq | PUN2; checked 2026-10-02 | quick rejoin conditions, TTL semantics |
| PH-03b | https://doc.photonengine.com/pun/current/troubleshooting/analyzing-disconnects | PUN2; checked 2026-10-02 | ACK/retry/disconnect failure conditions |
| PH-04 | https://doc.photonengine.com/pun/current/connection-and-authentication/authentication/overview-auth | PUN2 maintenance/LTS; updated 2026-08-19 | anonymous/default auth, custom auth requirement surface |
| PH-05a | https://doc.photonengine.com/pun/current/connection-and-authentication/regions | PUN2; checked 2026-10-02 | Cloud regions |
| PH-05b | https://doc.photonengine.com/pun/current/reference/counter-analytics | PUN2; updated 2026-07-20 | traffic/bandwidth/disconnect analytics |
| PH-06 | https://www.photonengine.com/pun/pricing | current price page; 2026-10-02 | Public/Premium/Enterprise Cloud price units and traffic overage |
| PRIOR-GGPO | https://github.com/pond3r/ggpo | **이번 원문 재열람 안 함**; 입력 STEP3 승인 조사만 재사용 | rollback/simulation replay 범위, permanent effect dedupe로 확대 금지 |

---

# 27. 조사 종료 상태

- Q01~Q04의 요청 범위만 조사했다.
- 저장소에 접근하지 않았다.
- current deployment/configuration/CI/browser 실행을 완료로 주장하지 않는다.
- 입력에 없는 부하·동접·지역·주기·대역폭·예산·허용지연·복구시간 수치를 만들지 않았다.
- 모델·백엔드·transport·서비스·API·필드·규칙의 선택을 하지 않았다.
- Git 수정, 구현, DB/service 구축, 정식 STEP 4B 산출물 반영을 하지 않았다.
- 이 보고서는 **Astra 판단 입력용 보조 조사 원본**이며 Astra 3A/3B/3C 판단 완료를 의미하지 않는다.

**여기서 종료한다.**
