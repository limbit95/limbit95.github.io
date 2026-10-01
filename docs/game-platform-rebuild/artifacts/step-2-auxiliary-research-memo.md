**Game Platform vNext STEP 2
보조 조사 메모**

*Astra 전달용 · 조사 범위만 포함 · 아키텍처/모델 확정 없음*

| **범위 메모** 장르와 실행 모델은 동일시하지 않는다. Invite/Presence는 별도 선택 기능으로 다룬다. renderer FPS / simulation tick / network update를 구분한다. 7축의 최종 선택지, Core API, Runtime Model, 공통 계약은 여기서 확정하지 않는다. |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

# 1. 7축 기준의 간결한 비교표

아래 사례명은 분류를 확정하기 위한 장르 enum이 아니라 차이를 관찰하기
위한 사례군이다. 같은 장르도 여러 실행 특성을 가질 수 있고, 같은 실행
특성이 여러 장르에 나타날 수 있다.

| **사례**              | **gameplay flow**                             | **시간 / 입력**                                                | **세션 / 지속성**                                         | **참여 / 가시성**                                        | **권위 / 동기화 / 복원**                                         | **공간 / 렌더링 / 입력 / 물리**                                                | **결과 / meta progression**                             |
|-----------------------|-----------------------------------------------|----------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|------------------------------------------------------------------|--------------------------------------------------------------------------------|---------------------------------------------------------|
| **보드 / 카드**       | 순차 턴·빠른 턴·동시 선택 등 복수 가능        | 사건 중심 입력이 가능하며 지속 simulation이 필수라는 근거 없음 | 짧은 match와 장기 turn-based 모두 가능                    | 공개/비공개 정보는 게임 규칙에 따라 달라짐               | relay·server validation·저장 후 재개 등 하나로 고정되지 않음     | 카드/보드 표현은 gameplay domain일 수 있으나 특정 renderer를 뜻하지 않음       | match outcome 가능. 장기 meta와의 결합은 별도 판단      |
| **실시간 협동**       | 복수 참가자의 동시 행동 가능                  | 연속·고빈도 데이터 교환이 필요한 경우가 있음                   | 연결 유지형 match가 대표 사례이나 필수는 아님             | teammate 상태·위치 등 공유 범위가 gameplay에 따라 달라짐 | relay와 server-authoritative 모두 실제 사례 존재                 | 공간 이동이 있을 수도, 없는 co-op도 가능                                       | session 결과와 account meta의 관계는 별도               |
| **반응 / PvP**        | 상대 행동에 빠르게 대응하는 동시 flow 가능    | 입력 지연이 플레이 감각에 직접 영향을 줄 수 있음               | 짧은 round/match도 가능하나 필수 형태 아님                | 상대 행동·상태의 빠른 반영이 중요할 수 있음              | prediction/rollback은 한 후보. PvP 전체의 필수 방식은 아님       | 고빈도 입력과 시청각 feedback이 핵심일 수 있으나 3D/physics와 동의어 아님      | 승패/score와 장기 rank·meta는 분리 검토                 |
| **RTS**               | 세계는 지속 진행하면서 플레이어는 명령을 내림 | simulation 지속성과 명령 입력 빈도를 분리해 볼 필요            | match 기반 사례 존재                                      | 다수 unit·영역·상대 정보가 존재할 수 있음                | 특정 RTS 구현 하나로 authority/sync 방식을 일반화할 근거 없음    | 다수 entity의 state와 render가 존재해도 network update와 같은 빈도일 필요 없음 | match outcome 존재 가능. meta 구조는 별도               |
| **리듬**              | 시간축상의 cue와 입력 판정                    | audio clock·scheduled time·output latency가 중요 후보          | 곡/stage 단위가 가능하지만 네트워크 session 여부와 독립적 | multiplayer 여부 자체가 장르 필수 조건은 아님            | network authority 이전에 local timing 기준이 중요할 수 있음      | audio timing과 visual frame timing을 동일 clock으로 가정하면 안 됨             | score/accuracy 등 결과 가능. 장기 progression은 별도    |
| **레이싱 / 플랫포머** | 지속 이동·조작                                | 위치·속도·방향 등 연속 입력/상태가 발생 가능                   | race/level/session 형태가 가능                            | 원격 캐릭터·상대 위치 가시성이 중요할 수 있음            | prediction → server processing → correction 같은 구현 사례 존재  | movement/transform/collision과 gameplay가 밀접할 수 있음                       | 완주/순위/level 결과와 meta는 별도                      |
| **3D / 물리**         | 자체 장르보다 실행 특성에 가까움              | physics step이 render frame과 독립될 수 있음                   | session 방식과 직접 연결되지 않음                         | 어떤 물체를 누구에게 동기화할지는 별도 문제              | physics simulation과 network synchronization을 분리해 볼 필요    | render FPS와 fixed physics step이 실제로 분리됨                                | 결과 체계와 직접 연결된다는 근거 없음                   |
| **비동기 장기 진행**  | 행동 → 저장 → 다른 참가자의 후속 행동         | 상시 loop 없이 사건 중심 진행 가능                             | 수시간~수주 지속 사례 존재                                | 참가자가 동시에 online일 필요 없음                       | durable match state, turn handoff, reload/timeout 등이 중요 후보 | 지속적인 rendering/physics가 필수라는 근거 없음                                | participant outcome을 장기 match state와 함께 보존 가능 |

## 교차 관찰

이 비교에서 특히 피해야 할 단순화는 다음과 같다.

**보드/카드 = 비동기, PvP = rollback, co-op = server-authoritative, RTS
= 특정 network model, 3D = physics = realtime multiplayer**

위와 같은 직접 등치를 뒷받침하는 근거는 확인되지 않았다. Nakama 공식
문서는 빠른 active turn-based와 수시간~수주 지속되는 passive
turn-based를 별도로 다루며, relayed와 authoritative 중 어느 하나가 게임
유형만으로 결정된다고 하지 않는다.

## FPS / simulation tick / network update

여기서 FPS는 renderer FPS 의미로 사용한다.

| **빈도**                      | **의미**                                         | **확인된 차이**                                                                |
|-------------------------------|--------------------------------------------------|--------------------------------------------------------------------------------|
| **renderer FPS**              | 화면 frame 생성 빈도                             | Unity에서 frame update와 fixed physics update가 서로 독립적으로 진행될 수 있음 |
| **simulation / physics tick** | gameplay state 또는 physics를 계산하는 진행 빈도 | fixed timestep 또는 server simulation tick과 같은 개념이 여기에 해당할 수 있음 |
| **network update**            | client/server 간 데이터를 송수신·수집하는 빈도   | Unity 공식 문서는 server tick rate와 client update rate를 명시적으로 구분함    |

Unity에서는 FPS가 낮으면 한 frame 안에서 여러 fixed physics update가
수행될 수도 있고, 반대로 frame 사이에 fixed update가 없는 경우도 있다.
또한 Unity Multiplayer 문서는 tick rate를 server가 game state를
simulation하는 빈도, update rate를 client가 server와 데이터를 주고받는
빈도로 별도 정의한다.

**renderer FPS ≠ simulation/physics tick ≠ network update cadence**

*세 빈도의 실제 값·결합 방식·GAME_SPEC 표현 형식은 STEP 2에서 Astra가
판단할 사항이다.*

## Invite / Presence

**Invite와 Presence는 위 7축의 실행 모델과 자동 결합하지 않는 별도 선택
기능 후보로 유지한다.**

Nakama 공식 문서에서 Presence는 사용자의 live activity/status를 추적하는
별도 시스템이며, match ID 같은 정보를 presence/status에 실을 수도 있다.
친구 invite 역시 lobby 기능 위에서 notification/RPC를 이용해 추가되는
사례로 설명된다.

이는 Presence/Invite → 특정 multiplayer model이라는 필연 관계를 증명하지
않는다. 오히려 gameplay execution과 별도로 조합 가능한 기능으로 검토할
근거 정도만 제공한다. 이것이 곧 청파 같이에서 반드시 별도 공통 계약으로
만들어야 한다는 결론은 아니다.

# 2. 공식 출처 링크와 해당 근거 위치

접근일: **2026-10-01**. 아래 표의 ID는 뒤의 사실/추론 구분 및 Astra 판단 쟁점에서 재사용한다.

| ID | 문서 제목 / URL | 근거 위치 | 비교표에서 뒷받침하는 내용 |
|---|---|---|---|
| **S1** | **Heroic Labs, Nakama Multiplayer Engine** — [공식 문서](https://heroiclabs.com/docs/nakama/concepts/multiplayer/) | `Synchronous Real-time`; `Turn-based multiplayer > Active / Passive` | 실시간/턴제 분리, active/passive 차이, passive의 장기 지속·DB 저장 |
| **S2** | **Heroic Labs, Authoritative Multiplayer** — [공식 문서](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/) | 문서 서두; `Asynchronous real-time`; `Active turn-based`; `Passive turn-based` | authority 모델과 장르의 비동일성, fixed tick, 다양한 gameplay cadence |
| **S3** | **Heroic Labs, Client Relayed Multiplayer** — [공식 문서](https://heroiclabs.com/docs/nakama/concepts/multiplayer/relayed/) | `Client Relayed Multiplayer` 본문 | simple 1v1·co-op에서도 relay 사용 가능 사례. co-op = server authority가 아님 |
| **S4** | **Apple, GKTurnBasedMatch** — [공식 API 문서](https://developer.apple.com/documentation/gamekit/gkturnbasedmatch) | `Overview`; `Ending Turns and Saving Data`; `Retrieving Match Details` | participant, current turn, game-specific match data 저장/재개 |
| **S5** | **Apple, endTurn(withNextParticipants:turnTimeout:match:completionHandler:)** — [공식 API 문서](https://developer.apple.com/documentation/gamekit/gkturnbasedmatch/endturn%28withnextparticipants%3Aturntimeout%3Amatch%3Acompletionhandler%3A%29) | Parameters: `nextParticipants`, `timeout`, `matchData` | 장기 turn handoff, timeout, 다음 participant를 위한 durable state |
| **S6** | **GGPO, Good Game, Peace Out Rollback Network SDK** — [원 개발자 저장소](https://github.com/pond3r/ggpo) | README `What's GGPO?` | rollback에서 input prediction/speculative execution을 사용해 입력 반응 지연을 숨기는 구현 사례 |
| **S7** | **Mark Claypool, The effect of latency on user performance in Real-Time Strategy games**, Computer Networks 49 (2005), pp.52–70 — [저자 공개 원 논문 PDF](https://web.cs.wpi.edu/~claypool/papers/rts/paper.pdf) | p.52 Abstract; pp.53–54 `Introduction` / `Background` | FPS와 RTS의 interaction/latency 특성 차이, RTS의 build/explore/combat 구분, unit command 중심 사례 |
| **S8** | **W3C, Web Audio API 1.1** — [공식 표준](https://www.w3.org/TR/webaudio-1.1/) | §1.1.1 `currentTime`; §1.2.2 `baseLatency`/`outputLatency`; §7.1 `Latency` | audio 자체 time coordinate, 다른 system clock과 비동기 가능성, output latency → 리듬 계열 timing 분리 근거 |
| **S9** | **Epic Games, Understanding Networked Movement in the Character Movement Component** — [공식 문서](https://dev.epicgames.com/documentation/unreal-engine/understanding-networked-movement-in-the-character-movement-component-for-unreal-engine) | `Movement Replication Summary`; `ReplicateMoveToServer` description | continuous movement의 local control/server processing/correction 사례 |
| **S10** | **Unity, Fixed updates** — [공식 문서](https://docs.unity3d.com/Manual/fixed-updates.html) / **Tick and update rates** — [공식 문서](https://docs-multiplayer.unity3d.com/netcode/2.1.1/learn/ticks-and-update-rates/) | `Fixed updates`; `Tick rate`; `Update rate` | renderer/physics cadence 분리 및 simulation tick/network update 분리 |
| **S11** | **Heroic Labs, Status** — [공식 문서](https://heroiclabs.com/docs/nakama/concepts/status/) / **Architecture Overview** — [공식 문서](https://heroiclabs.com/docs/nakama/getting-started/architecture/) / **Multiplayer Lobby** — [공식 문서](https://heroiclabs.com/docs/nakama/guides/concepts/lobby/) | `Status`; `Presence`; `invite friends to matches` | Presence와 Invite를 gameplay synchronization model과 별도 기능으로 관찰할 근거 |

# 3. 확인된 사실 / 추론 / 미확인 사항

## 확인된 사실

**F1.** Nakama는 synchronous realtime과 turn-based를 구분하고,
turn-based를 active/passive로 다시 구분한다. Passive gameplay는
수시간~수주 지속될 수 있고 입력을 저장한 뒤 server loop를 멈출 수 있다.
→ S1/S2.

**F2.** Nakama는 relayed와 authoritative를 모두 지원하며, 어느 하나를
선택하게 만드는 강한 단일 결정 요인이 없고 desired gameplay에 따른
design decision이라고 설명한다. → S2/S3.

**F3.** Apple GameKit의 turn-based match는 participant/current
participant/game-specific match data/outcome을 가지고 turn handoff와
저장을 지원한다. → S4/S5.

**F4.** GGPO는 rollback networking의 구현에서 input prediction과
speculative execution을 사용한다. → S6.

**F5.** Claypool의 RTS 연구에서는 FPS와 RTS가 interaction model과
latency susceptibility에서 다르다고 관찰했고, 연구 대상 RTS gameplay를
building/exploration/combat 등으로 나누었다. 해당 연구는 특정 2000년대
RTS 세 게임을 대상으로 한다. → S7.

**F6.** Web Audio의 currentTime은 audio stream의 자체 time
coordinate이며 다른 system clock과 동기화된다고 보장되지 않는다.
baseLatency와 outputLatency도 별도 개념이다. → S8.

**F7.** Unreal Character Movement는 client의 local movement, server
전달/재실행 및 correction을 포함하는 networked movement 구현을 제공한다.
→ S9.

**F8.** Unity의 physics fixed update는 main frame update와 독립적이다.
Unity Multiplayer는 server simulation tick rate와 client update rate를
별도 정의한다. → S10.

**F9.** Nakama Presence/Status는 사용자의 live activity를 표현하는
기능이고, lobby의 friend invite는 별도 notification/RPC 흐름으로
구현되는 공식 사례가 있다. → S11.

## 조사에서 가능한 추론

**I1.** 장르명 → 하나의 실행 모델보다 장르와 실행 특성을 독립적으로
조합하는 표현이 위 사례들을 더 잘 설명한다.

**I2.** 보드/카드는 turn-based일 가능성이 있지만, 보드/카드 → passive
asynchronous라고 일반화할 수 없다. Active turn-based 사례도 공식 문서에
존재한다.

**I3.** 반응성이 중요한 PvP에서 rollback/prediction은 후보가 될 수
있지만 PvP의 필수 조건으로 볼 근거는 없다.

**I4.** RTS는 real-time이라는 이름만으로 FPS와 같은 입력·latency·network
요구를 갖는다고 볼 수 없다. 다만 S7은 오래된 특정 RTS 표본이므로 현대
RTS 전체의 network architecture 근거로 일반화하면 안 된다.

**I5.** 리듬 gameplay를 검토할 때 renderer frame만으로 timing을
표현하기보다 audio timeline/input timing/latency의 독립성을 검토할
가치가 있다.

**I6.** 레이싱/플랫포머에서 movement prediction/correction은 후보가 될
수 있지만, S9는 Unreal의 character movement 구현 사례일 뿐 해당 장르의
필수 규칙이 아니다.

**I7.** 3D/physics를 독립 장르로 보기보다 7축 중 공간·렌더링·입력/물리
측 실행 특성으로 볼 여지가 있다. 최종 분류 여부는 Astra 판단 사항이다.

**I8.** Invite/Presence는 gameplay model에서 자동 파생되는 속성보다 독립
Capability 후보로 다루는 것이 외부 사례와 잘 맞는다. 이것이 곧 청파
같이에서 반드시 새 공통 계약을 만들어야 한다는 뜻은 아니다.

## 이번 조사에서 미확인

**U1.** 청파 같이의 7축 각각을 어떤 enum/필드/문서 구조로 표현해야
하는지.

**U2.** 한 게임이 각 축에서 단일 값만 가져야 하는지, 복수 값을 가져야
하는지, phase별로 변경 가능해야 하는지.

**U3.** relay / server-authoritative / rollback / deterministic
execution 가운데 어떤 모델을 청파 같이가 실제 지원 대상으로 삼아야
하는지.

**U4.** RTS에 deterministic lockstep이 필요한지. 이번 근거는 RTS의
interaction·latency 차이를 보여줄 뿐 lockstep을 필수로 입증하지 않는다.

**U5.** rhythm multiplayer의 network authority/synchronization 모델.

**U6.** meta progression을 7축의 결과 항목에 포함할지, 독립 Capability
또는 별도 concern으로 다룰지.

**U7.** Invite/Presence를 실제 플랫폼 공통 Capability로 승격할지와 그
계약/API.

**U8.** 각 실행 특성이 현재 저장소의 Core/adapter/DB/RPC로 이미
지원되는지 여부. 이번 조사는 구현 감사를 하지 않았다.

# 4. Astra가 판단해야 할 쟁점 목록

| **쟁점**                                                   | **관련 근거**                                            | **선택지 / 판단 후보**                                                       | **현재 상태**                                                                              |
|------------------------------------------------------------|----------------------------------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| **장르와 실행 모델의 관계를 어떻게 표현할 것인가**         | S1–S3, F1–F2                                             | 1:1 분류 / 다대다 조합 / genre + 별도 execution 특성                         | 미결정. 외부 근거는 1:1 일반화를 지지하지 않음                                             |
| **7축에서 단일·복수 선택을 어떻게 허용할 것인가**          | active/passive turn-based, realtime/turn-based 병존 사례 | 축별 단일 / 일부 복수 / phase별 변경 허용                                    | 미결정                                                                                     |
| **시간 축이 하나로 충분한가**                              | S8, S10                                                  | renderer / simulation / network / audio timing을 어떻게 표현할지             | 최소한 FPS·simulation tick·network update 구분 필요성은 근거 있음. 최종 필드 구조는 미결정 |
| **authority와 synchronization을 어느 정도 세분할 것인가**  | S2/S3/S6/S9                                              | relay, authoritative, prediction, rollback, correction 등을 별도 후보로 볼지 | 미결정. 제품 사례를 공통 계약으로 승격하면 안 됨                                           |
| **지속성 모델을 realtime connection과 분리할 것인가**      | S1/S4/S5                                                 | session-only / durable match / reconnect-resume 등                           | 장기 turn-based에서 durable state 사례 확인. 플랫폼 선택은 미결정                          |
| **3D/physics를 장르 규칙과 실행 특성 중 어디에 둘 것인가** | S9/S10                                                   | genre-like group / 공간·렌더링·물리 특성 / 양쪽 참조                         | 미결정                                                                                     |
| **리듬 timing을 일반 realtime과 어떻게 구분할 것인가**     | S8                                                       | audio clock/input timing을 시간축 세부 후보로 둘지                           | 필요성 후보만 확인. multiplayer model은 미확인                                             |
| **Invite/Presence의 위치**                                 | S11                                                      | 독립 Capability / 다른 분류와 결합 / GAME_SPEC 선택 항목                     | 미결정. gameplay model의 필수 속성이라는 근거 없음                                         |
| **result와 meta progression의 경계**                       | S4의 participant outcome                                 | match result만 7축에 두기 / meta까지 포함 / 별도 concern                     | 미결정                                                                                     |
| **기존 host/ready/rematch 규칙과 새 분류의 관계**          | 외부 조사로 결정 불가. 첨부 brief의 기존 긴장 보존 요구  | 기존 범위 유지하면서 적용 조건 분리                                          | Astra가 저장소 근거로 판단해야 함                                                          |

## Astra 전달용 한 줄 요약

| **외부 근거에서 확실히 얻을 수 있는 것은 장르명만으로 turn/simultaneous, persistence, authority, synchronization, physics/timing 등을 결정할 수 없다는 점과, renderer FPS·simulation tick·network update를 분리해서 보아야 한다는 점까지다. 그 위의 7축 선택지·장르 규칙 묶음·호환/충돌 판정·GAME_SPEC 표현·Core/Runtime 책임은 이번 조사에서 확정하지 않고 STEP 2 Astra 판단으로 남긴다.** |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
