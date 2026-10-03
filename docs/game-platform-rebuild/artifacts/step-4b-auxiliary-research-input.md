# STEP 4B — 일반 Sol5.6 전달 입력

이 문서는 저장소 접근이 없는 조사자를 위한 실제 source packet이다. 가이드 자체를 source로 사용하지 않는다. 조사 범위는 함께 첨부한 [요청문](step-4b-auxiliary-research-request.md)의 Q01~04만이다. 준비 기준일 2026-10-02, 저장소 `3aeae1dfcce7788f88e706dcd49d283b91b67e82`에 고정. 구현/배포/서비스 선택의 완료를 주장하지 않는다.

## 승인 요구와 프로젝트 제한

- 통합 플랫폼의 최소Core와 선택 모델 원칙. DB/RPC→invalidation→snapshot과 stream의 권위·순서/중복·복구·private·시간/주기/대역폭·검증 의미는 구별한다. Room/version/tick을 모든 모델에 강제하지 않는다.
- 기존 신규online11안전성: 익명/미승인 진입 거부, 승인된 진입, nonmember snapshot 거부, 서버 시작 조건, stale명령 거부, 동일action 중복적용 방지, 충돌명령 하나의 commit, authoritative 현재상태 복구, same-context 재대결 초기화/재시작, 다른사용자 private 미노출. 비DB의 동등안전성·현행규칙 변경은 조사자가 결정하지 않는다.
- 현재 Realtime은 invalidation 신호이고 authoritative state는 RPC snapshot이다. 초기hostless 시작 허용이 공통 재대결 ready/방장시작 의무의 면제는 아니다. hostless 도입 충돌·규칙 변경은 Astra 판단 입력이다.
- 승인 STEP4A: 살아 있는 owner·현재context·현재허용정보/행위·모델순서·반영직전 재확인. success/error/null/finally/cleanup/effect 전부 적용. 취소 요청/실제중단/채택무효화/자원정리와 client폐기/servercommit rollback 구별. 이미 전달된 비밀의 악의적client 회수 보장 없음.
- T01 동일room 새경기, T02 A→B→A, T03 참가/관전·역방향·사용자변경, S3-T04 단절유실, S3-T05 rollback 결과중복의 판단이 필요하다. 각 경우 version/sequence 비교만으로 context·권한·owner 생존을 대신할 수 없다.
- 승인회원·profile 확정nickname·site invite 본체·game별join·Registry/publication은 서로 다른 경계다. 이번 조사에서 5A모듈재사용·5B공개/결과상세·6API동결을 선결정하지 않는다.

## source 관찰 — 사실과 미확인

| 입력 | 고정 source 사실 | 한계/연결 질문 |
|---|---|---|
| P01 | coordinator는 integer version, 낮은 값 거부·동일값 채택. subscribe 함수를 부른 뒤 initial refresh | 구독 ACK·snapshot cut·gap 및 await 이후수명 미확인; Q01/Q02 |
| P02 | No Thanks adapter는 rooms/players postgres_changes payload를 상태로 쓰지 않고 notify; `.subscribe()` 후 즉시 정리함수를 반환 | ACK 대기/재가입history/유실 window 없음 증거는 아니다; Q01/Q02 |
| P03 | No Thanks RPC는 auth.uid/profile approval, actor/type/payload 중복확인, 저장snapshot 반환. gameplay에는 room lock 후 중복 재확인·expected_version/member 검사 | 저장응답의 현재 role 적합성과 검사시점은 Astra 질문. 전체 RPC·deployment 동일 보장 아님; Q02/Q03 |
| P04 | snapshot은 active member 확인, viewer 자기 counters만 반환. publication 추가 SQL은 rooms/players만 포함, private helper 권한 회수 SQL 존재 | 최종 DB/publication·기존구독철회·전송중/private cache/log 미확인; Q03 |
| P05 | client approval은 profile.status. auth.js TOKEN_REFRESHED branch는 session/user 갱신. server helper는 auth.uid+profiles.status 조회 | DB approval변경의 열린게임 즉시전파·token갱신=profile재조회 보장 없음; Q03 |
| P06 | 복귀 online/pageshow/visible→refresh, 테스트 runner/fixture source 존재 | 실행/production/stream recovery·latency/throughput/cost 계측 없음; Q02/Q04 |

고정 원문에서 필요한 부분만 발췌한다. 아래 source는 검토 가능한 관찰 근거이며 불변 계약으로 모든 새 모델에 복제하지 않는다. 전체 원문은 고정 URL로 찾을 수 있지만 조사자가 저장소를 열 수 있다고 전제하지 않는다.

### B15 — games/shared/snapshotCoordinator.js L40–58

고정 commit `3aeae1dfcce7788f88e706dcd49d283b91b67e82` / blob `069f49aa23cfb2c5d591cafaed523fa358c78ba1`.

```js
    do {
      refreshQueued = false;
      const snapshot = await load({ reason: nextReason });
      const version = versionOf(snapshot);

      if (version < currentVersion) {
        lastResult = Object.freeze({
          accepted: false,
          reason: "stale",
          version,
          currentVersion,
          snapshot,
        });
      } else {
        currentSnapshot = snapshot;
        currentVersion = version;
        emitSnapshot(snapshot, { reason: nextReason, version });
        lastResult = Object.freeze({
          accepted: true,
```

### B16 — games/shared/snapshotCoordinator.js L96–110

고정 commit `3aeae1dfcce7788f88e706dcd49d283b91b67e82` / blob `069f49aa23cfb2c5d591cafaed523fa358c78ba1`.

```js

    if (!unsubscribe) {
      const stop = subscribe(() => {
        void refresh("invalidation").catch(() => {});
      });
      if (typeof stop !== "function") {
        throw new TypeError("subscribeInvalidation() must return an unsubscribe function.");
      }
      unsubscribe = stop;
    }

    if (!refreshImmediately) return null;
    return refresh("start");
  }

```

### B18 — games/no-thanks/roomLobby.js L126–160

고정 commit `3aeae1dfcce7788f88e706dcd49d283b91b67e82` / blob `b689e6c0628824cc3d617bd5dc71ace424857fb3`.

```js
    subscribeInvalidation(listener) {
      if (typeof listener !== "function") {
        throw new TypeError("No Thanks! Room/Lobby invalidation listener must be a function.");
      }
      const roomId = requireText(activeRoomId, "active room before subscription");
      const notify = () => listener();

      const channel = supabase
        .channel(`no-thanks-room-${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "no_thanks_rooms",
            filter: `id=eq.${roomId}`,
          },
          notify,
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "no_thanks_room_players",
            filter: `room_id=eq.${roomId}`,
          },
          notify,
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    },
```

### B24 — supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql L180–234

고정 commit `3aeae1dfcce7788f88e706dcd49d283b91b67e82` / blob `d24ff683c8ffa6861bb287f986395d24fa4a8422`.

```sql
    into v_existing
  from public.no_thanks_room_actions
  where room_id = p_room_id
    and client_action_id = p_client_action_id;

  if found then
    if v_existing.actor_user_id <> v_user_id
      or v_existing.action_type <> v_action_type
      or v_existing.request_payload <> v_payload then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  select *
    into v_room
  from public.no_thanks_rooms
  where id = p_room_id
  for update;

  if not found or v_room.status <> 'playing' then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  -- A duplicate retry can arrive while the first request is still waiting on
  -- the same room lock. Re-check after acquiring the lock so both callers
  -- converge on the first committed authoritative snapshot.
  select *
    into v_existing
  from public.no_thanks_room_actions
  where room_id = p_room_id
    and client_action_id = p_client_action_id;

  if found then
    if v_existing.actor_user_id <> v_user_id
      or v_existing.action_type <> v_action_type
      or v_existing.request_payload <> v_payload then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  if v_room.version is distinct from p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;
  if not exists (
    select 1
    from public.no_thanks_room_players
    where room_id = p_room_id
      and user_id = v_user_id
      and membership_status = 'active'
  ) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

```

### B23 — supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql L50–64

고정 commit `3aeae1dfcce7788f88e706dcd49d283b91b67e82` / blob `d24ff683c8ffa6861bb287f986395d24fa4a8422`.

```sql
  if p_viewer_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;

  if not exists (
    select 1
    from public.no_thanks_room_players as p
    where p.room_id = p_room_id
      and p.user_id = p_viewer_id
      and p.membership_status = 'active'
  ) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  select *
```

### B23 — supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql L107–129

고정 commit `3aeae1dfcce7788f88e706dcd49d283b91b67e82` / blob `d24ff683c8ffa6861bb287f986395d24fa4a8422`.

```sql

  if v_counters is not null and v_counters ? p_viewer_id::text then
    v_viewer_counters := (v_counters ->> p_viewer_id::text)::integer;
  else
    v_viewer_counters := null;
  end if;

  return jsonb_build_object(
    'version', v_room.version,
    'room', jsonb_build_object(
      'id', v_room.id,
      'roomCode', v_room.room_code,
      'hostUserId', v_room.host_user_id,
      'status', v_room.status,
      'maxPlayers', v_room.max_players
    ),
    'players', v_players,
    'game', v_room.game_state,
    'viewer', jsonb_build_object(
      'playerId', p_viewer_id,
      'counters', v_viewer_counters
    )
  );
```

### B31 — js/auth.js L270–282

고정 commit `3aeae1dfcce7788f88e706dcd49d283b91b67e82` / blob `09eb6d21b2d259567c0ba1b1a0aecfbd1bcac723`.

```js
    if (!authSubscription) {
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "TOKEN_REFRESHED") {
          state.session = session;
          state.user = session?.user ?? null;
          emit();
          return;
        }
        if (event === "INITIAL_SESSION") {
          state.session = session;
          state.user = session?.user ?? null;
          return;
        }
```

### B32 — supabase/site/baseline/07_common_triggers.sql L85–98

고정 commit `3aeae1dfcce7788f88e706dcd49d283b91b67e82` / blob `e92963433b9c4e95b9a2dc8e174862e64ece5b4a`.

```sql
create or replace function private.is_approved_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles as p
        where p.id = (select auth.uid())
          and p.status = 'approved'
    );
$$;
```

## 기존 공식 조사 — 이번에는 범위 재사용

STEP3의 승인 선택 확인 기록은 authoritative server와 relay의 차이(Nakama), GGPO 재실행/effect 지연(영구보상까지 증명하지 않음), WebAudio 독립시간축, Photon cache와 rejoin TTL/실패 조건, 수신자별 전송과 늦은 private 정리의 차이를 다뤘다. 이는 특정 제품의 프로젝트 채택/지원·현재 가격·전송 중 철회 보장 근거가 아니다.

STEP4A의 선택 확인 기록: DOM abort·Fetch abort는 모든 pending callback 취소/서버rollback을 보증하지 않는다. ECMAScript promise job/finally, DOM listener 동일등록 식별, RFC9700 요청 권한, RFC7009 철회 전파 한계, RFC9111 private/no-store가 client memory 수명 대체 아님을 구별했다. OAuth 도입·특정 cache키/API 채택은 결정되지 않았다.

이번 준비는 기존 확인 기록을 재사용했으며 새로 이 외부 원문을 열람하지 않았다. 기존 확인일/판본을 현재 기능·가격 확인일로 바꾸지 마. 이전 자료 전체 재조사 대신 Q01~04의 부족한 조건만 공식 원문을 확인해줘.

기존 진입URL: https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/ · https://heroiclabs.com/docs/nakama/concepts/multiplayer/relayed/ · https://github.com/pond3r/ggpo · https://doc.photonengine.com/pun/current/gameplay/cached-events · https://www.w3.org/TR/webaudio-1.1/ · https://dom.spec.whatwg.org/ · https://fetch.spec.whatwg.org/ · https://tc39.es/ecma262/2026/ · https://www.rfc-editor.org/rfc/rfc9700 · https://www.rfc-editor.org/rfc/rfc7009 · https://www.rfc-editor.org/rfc/rfc9111

Q03/Q04의 새 Supabase 기능·가격 확인은 공식 supabase.com 문서를 사용해줘. Nakama self-host/managed cloud와 Photon 제품판본을 구분해줘. 위 URL은 조사 진입점이며 이번 원문 확인 인증이 아니다.

## 프로젝트 미확인 입력

부하/동접/지역/주기/예산/허용지연/복구시간 수치 없음. 권위 서버 운영주체·데이터 저장/retention·운영 인력·관측·장애목표·비용 상한 없음. 현재 DB 배포/SQL최종권한/Realtime설정·token TTL·auth 철회 실제실험·browser 실행·CI 통과는 미확인. 후보제품 특징이나 가격을 이 프로젝트의 지원으로 승격하지 마.

Q05 사이트 source는 Work의 evidence brief에 정리되어 있다. 일반 조사자에게 repository owner/최종연결 위치를 다시 결정시키지 않는다. 조사 원본 수신 후 Work가 출처·범위·미확인을 검토하고 Astra3A → 3B → 3C를 별도로 수행해야 한다.
