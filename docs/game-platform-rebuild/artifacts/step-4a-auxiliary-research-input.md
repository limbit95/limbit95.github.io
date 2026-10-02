# STEP 4A — 일반 Sol5.6 선택 보조 조사 입력

상태: 전달용 준비 / 조사 NOT_RUN. 저장소 접근을 가정하지 않는 자족 입력이다. 이 파일과 요청문 두 개를 전달한다. 플랫폼 결정·지원 인증을 요청하지 않는다.

## 고정 맥락

청파 같이 통합 게임 플랫폼 vNext. 계획1.3. 승인 integration `ad7655a051f0dbb13444eec6f469f6f98f9794f4`, PR410 병합 완료/STEP3 COMPLETED. Work Sol은 STEP4A의 책임·수명 계약 판단에 앞선 근거 준비만 수행했다.

계획의 승인 요구: 최소 Core·선택 모델/Capability·Profile 레시피·Game-local·Site Adapter. Room/host/DB snapshot/tick/전역 currentRoom/currentMatch 보편 강제 금지. 현재 게임/규칙/API를 이관/변경하지 않는다. 식별 의미와 특정 matchId/epoch 필드의 필수화는 구분한다.

STEP3 T01: 같은 room의 새 경기 뒤 이전 action/snapshot/error/연출이 올 수 있다. 맥락과 순서 모두 필요. 이전에 발행했어도 현재 authorized snapshot 재조회라면 일괄 거부할 수 없다.
T02: A initial/refresh/action/leave→종료→B→늦은 success/error/null/finally. A→B→A 포함. 취소 성공 여부와 독립적으로 이전 완료가 새 맥락을 바꾸지 않아야 한다. A 자원 정리는 B 자원 정리와 다르고 client 거부는 서버 leave rollback이 아니다.
T03: participant→spectator 뒤 room/match/version이 같아도 private callback/cache 표시 권한은 다를 수 있다. 서버 제공 권한과 client 채택 모두 필요. 이미 적법하게 받은 비밀을 악의적 client에서 회수 보장하지 않는다.

C09: solo roomless/초기만hostless+준수rematch/재대결host불성립(규칙 변경 검토)/재대결미정(미확인)을 구분한다. C11: durable state가 connection/runtime instance보다 오래갈 수 있으며 browser refresh는 저장·재개 증거가 아니다.

## 기존 공식 근거 재사용과 한계

아래는 승인 STEP3의 X01~07 확인 기록을 그대로 인용하는 내부 이력이다. 이번 Sol의 웹 재확인 결과가 아니다. Q01~03의 새로운 직접 근거로 자동 승격하지 않는다. 원문은 [STEP3 리스크 §7](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md)이다.

| 이번 ID / 보고서 연결 | 원문·판본·확인 위치 | 이번 확인 사실과 사용 한계 |
|---|---|---|
| X01 / R02·A02·A16 | [Nakama Authoritative Multiplayer](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/), 웹 버전 미표기; 서두와 gameplay modes의 active/passive turn-based | 서버 검증, passive의 수시간~수주 진행·저장 후 loop 종료 사례. 상시 tick/연결 필수 가정에 반례. 프로젝트 장기 상태 구현 증거 아님 |
| X02 / R01·A01~03·A17 | [Nakama Client Relayed Multiplayer](https://heroiclabs.com/docs/nakama/concepts/multiplayer/relayed/), 웹 버전 미표기; 서두의 forwarding/host 설명 | 서버 전달과 내용 검증은 별개. 이 제품의 relay는 client-host 중재. 현행 서버 검증 의무를 relay로 대체해도 된다는 결론 아님 |
| X03 / R06·A04·A10 | [GGPO Developer Guide](https://github.com/pond3r/ggpo/blob/master/doc/DeveloperGuide.md), master(고정 commit 미확인); Using State and Inputs, save/load, Separate Updating Game State from Rendering | 결정적 재실행·저장/복원 조건과 rollback 중 sound/effect 지연 설명 확인. 영구 보상·통계 commit 계약은 이 자료로 확인하지 않음 |
| X04 / R08·A14 일부 | [Web Audio API 1.1](https://www.w3.org/TR/webaudio-1.1/), W3C Working Draft 2026-09-22; §1.1.1 currentTime | audio stream 시간 좌표가 다른 시스템 clock과 동기화되지 않을 수 있음. 표준 초안이며 모든 브라우저/기기의 지연 보정 구현 지원을 뜻하지 않음 |
| X05 / R15·A08 | [Photon PUN2 Cached Events](https://doc.photonengine.com/pun/current/gameplay/cached-events), PUN2; Cached Events·Ordered Delivery | late joiner의 과거 이벤트 수신에는 별도 cache 의미가 필요. 유지보수 중 제품의 개념 사례로만 사용; 프로젝트 제품 추천/도입 아님 |
| X06 / R03·A12 | [Nakama Lua Match Runtime API](https://heroiclabs.com/docs/nakama/server-framework/lua-runtime/function-reference/match-runtime/), 웹 버전 미표기; broadcast_message | initial state와 특정 presences 수신자 집합 지정 가능. 이것만으로 client stale private response 폐기까지 검증되지 않음 |
| X07 / R14·A07 | [Photon Realtime5 Analyzing Disconnects](https://doc.photonengine.com/realtime/v5/troubleshooting/analyzing-disconnects), Realtime5; Quick Rejoin | rejoin은 PlayerTTL 등 조건에 의존하고 재연결 뒤에도 room/player 부재로 실패 가능. 프로젝트 retry/복구 정책 수치로 전용하지 않음 |


STEP3 미확인: Unity visibility 원 URL 열기 실패, exact lifetime key/API와 결과/보상 소비 상세 미확정. 제품 timeout/tick 숫자/운영비/전수 보안은 직접 확인되지 않았다. 기존 Q01~06 전체·장르11개 재조사를 하지 않는다.

## 선택 source 발췌

코드의 현재 사실이며 목표 API나 안전 인증이 아니다. 각 발췌는 승인 integration 고정 SHA·blob·줄로 추적한다.

### games/shared/snapshotCoordinator.js L30–90

[원문](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/shared/snapshotCoordinator.js#L30-L90), blob `069f49aa23cfb2c5d591cafaed523fa358c78ba1`.

```js
  let currentVersion = -1;
  let inFlight = null;
  let refreshQueued = false;
  let unsubscribe = null;
  let disposed = false;

  async function runRefresh(reason) {
    let nextReason = reason;
    let lastResult = null;

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
          reason: null,
          version,
          currentVersion,
          snapshot,
        });
      }

      nextReason = "coalesced";
    } while (refreshQueued && !disposed);

    return lastResult;
  }

  function refresh(reason = "manual") {
    if (disposed) {
      return Promise.reject(new Error("Snapshot coordinator has been disposed."));
    }

    if (inFlight) {
      refreshQueued = true;
      return inFlight;
    }

    inFlight = runRefresh(reason)
      .catch((error) => {
        emitError(error, { reason });
        throw error;
      })
      .finally(() => {
        inFlight = null;
      });

```

### games/shared/snapshotCoordinator.js L110–126

[원문](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/shared/snapshotCoordinator.js#L110-L126), blob `069f49aa23cfb2c5d591cafaed523fa358c78ba1`.

```js

  function stop() {
    unsubscribe?.();
    unsubscribe = null;
    refreshQueued = false;
  }

  function dispose() {
    stop();
    disposed = true;
  }

  function current() {
    return Object.freeze({
      snapshot: currentSnapshot,
      version: currentVersion < 0 ? null : currentVersion,
      refreshing: Boolean(inFlight),
```

### games/shared/reconnectRefresh.js L29–55

[원문](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/shared/reconnectRefresh.js#L29-L55), blob `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4`.

```js
  function requestRefresh(reason) {
    Promise.resolve(refresh(reason)).catch((error) => onError(error, { reason }));
  }

  const onOnline = () => requestRefresh("online");
  const onPageShow = () => requestRefresh("pageshow");
  const onVisibilityChange = () => {
    if (browserDocument.visibilityState === "visible") {
      requestRefresh("visibility");
    }
  };

  function start() {
    if (started) return;
    started = true;
    browserWindow.addEventListener("online", onOnline);
    browserWindow.addEventListener("pageshow", onPageShow);
    browserDocument.addEventListener("visibilitychange", onVisibilityChange);
  }

  function stop() {
    if (!started) return;
    started = false;
    browserWindow.removeEventListener("online", onOnline);
    browserWindow.removeEventListener("pageshow", onPageShow);
    browserDocument.removeEventListener("visibilitychange", onVisibilityChange);
  }
```

### games/no-thanks/lobbyController.js L146–169

[원문](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/no-thanks/lobbyController.js#L146-L169), blob `942a628ff1a675754f7ab92c53d5ecbddf3e6eab`.

```js
  function stopTracking() {
    trackingGeneration += 1;
    reconnectTriggers?.stop();
    reconnectTriggers = null;
    coordinator?.dispose();
    coordinator = null;
    unsubscribePresence?.();
    unsubscribePresence = null;
    if (offlineListenerAttached) {
      windowTarget.removeEventListener("offline", onOffline);
      offlineListenerAttached = false;
    }
    trackedRoomId = null;
    resetPresenceState();
  }

  function onOffline() {
    emit({ connection: "offline" });
  }

  function isCurrentTracking(generation, roomId) {
    return !disposed
      && generation === trackingGeneration
      && trackedRoomId === roomId;
```

### games/no-thanks/lobbyController.js L228–269

[원문](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/no-thanks/lobbyController.js#L228-L269), blob `942a628ff1a675754f7ab92c53d5ecbddf3e6eab`.

```js
    const roomCoordinator = createSnapshotCoordinator({
      loadSnapshot: () => roomLobby.getLobbySnapshot({ roomId }),
      subscribeInvalidation: roomLobby.subscribeInvalidation,
      onSnapshot: (nextSnapshot) => {
        if (!isCurrentTracking(generation, roomId)) return;
        applySnapshot(nextSnapshot, { connection: "connected" });
      },
      onError: (error) => {
        if (!isCurrentTracking(generation, roomId)) return;
        if (recoverMissingRoom(error)) return;
        emit({ connection: "error", error });
        onError(error);
      },
    });
    coordinator = roomCoordinator;

    const roomReconnectTriggers = createReconnectRefreshTriggers({
      refresh: async (reason) => {
        if (!isCurrentTracking(generation, roomId)) return null;
        emit({ connection: "reconnecting", error: null });
        const result = await roomCoordinator.refresh(reason);
        if (!isCurrentTracking(generation, roomId)) return result;
        emit({ connection: "connected" });
        return result;
      },
      windowTarget,
      documentTarget,
      onError: (error) => {
        if (!isCurrentTracking(generation, roomId)) return;
        if (recoverMissingRoom(error)) return;
        emit({ connection: "error", error });
        onError(error);
      },
    });
    reconnectTriggers = roomReconnectTriggers;

    applySnapshot(snapshot, { connection: "connected" });
    await roomCoordinator.start();
    if (!isCurrentTracking(generation, roomId)) return state.snapshot;
    roomReconnectTriggers.start();
    return state.snapshot;
  }
```

### games/no-thanks/lobbyController.js L283–297

[원문](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/no-thanks/lobbyController.js#L283-L297), blob `942a628ff1a675754f7ab92c53d5ecbddf3e6eab`.

```js
    try {
      return await operation();
    } catch (error) {
      if (!recoverMissingRoom(error)) {
        emit({ error, connection: state.snapshot ? "error" : state.connection });
        onError(error);
      }
      throw error;
    } finally {
      if (state.busy) emit({ busy: false });
    }
  }

  async function initialize() {
    return command(async () => {
```

### games/no-thanks/lobbyController.js L388–416

[원문](https://github.com/limbit95/limbit95.github.io/blob/ad7655a051f0dbb13444eec6f469f6f98f9794f4/games/no-thanks/lobbyController.js#L388-L416), blob `942a628ff1a675754f7ab92c53d5ecbddf3e6eab`.

```js
  async function leaveRoom() {
    return command(async () => {
      const snapshot = state.snapshot;
      if (!snapshot?.room?.id) return null;
      await roomLobby.leaveRoom({
        roomId: snapshot.room.id,
        expectedVersion: Number(snapshot.version),
      });
      stopTracking();
      applySnapshot(null, { connection: "connected" });
      return null;
    });
  }

  async function prepareRematch() {
    return command(async () => {
      const snapshot = state.snapshot;
      if (!snapshot?.room?.id || snapshot.game?.phase !== "GAME_OVER") {
        throw new Error("No Thanks! rematch requires a finished room.");
      }

      const next = await gameplay.prepareRematch({
        roomId: snapshot.room.id,
        expectedVersion: Number(snapshot.version),
        clientActionId: idFactory(),
      });
      applySnapshot(next, { connection: "connected" });
      return next;
    });
```

## 부족한 질문과 금지 범위

| 질문 | 왜 추가 근거가 필요한가 | 조사할 차이 |
|---|---|---|
| Q01 취소·늦은 완료 | X01~07은 browser cancellation의 보장/실패·이미 완료한 작업과 결과 채택 무효화를 직접 설명하지 않음 | abort 요청/지원 작업의 실제 중단/서버 commit/Promise settled callback/결과 채택 차이 |
| Q02 반복 dispose·자원 소유 | 현 stop/dispose의 구현 관찰만 있고 idempotent cleanup·이미 시작한 작업·구독교체 자원 소유의 일반 근거가 부족 | 반복/부분 초기화/정리 실패·이전 자원 vs 새 자원·cancel과 local cleanup |
| Q03 view/auth 수명 | X06은 수신자 지정 예시만; T03의 대기 callback/cache·역할 재전환을 직접 보장하지 않음 | 서버 제공 시점·권한 철회·이미 전달한 비밀·cache/callback 표시와 재사용의 경계 |

공식 표준/제품 공식 문서만 직접 주장 근거로 쓴다. 새 백엔드·library·model 추천, 플랫폼 owner/API/field 설계, 저장소 적합성·취약성 최종 판정, 구현 코드/정식 계약 작성은 제외한다. 문서로 확인되지 않는 지점을 미확인으로 남긴다.

조사 결과는 사실/플랫폼 적용 추론/미확인/Work Astra 질문을 분리한다. 사용자 전달 원본을 받기 전 Work Astra 핵심 판단을 진행하지 않는다.
