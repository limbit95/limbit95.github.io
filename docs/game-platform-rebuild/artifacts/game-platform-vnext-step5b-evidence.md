# Game Platform vNext STEP5B — 판단 근거 및 Astra 인계
작성: 2026-10-09 KST · 담당 Sol/Codex · 입력 game-platform-vnext-step5b-plan-and-handoff.md §9

**이 문서는 사실·승인 근거 준비 결과다. 최종 3분류 선택표·Astra 핵심 판단·정식 STEP5B 저장소 산출물이 아니다.**
소스 읽기, 기존 trace/blob 대조와 이 제출용 문서의 정합성 확인만 수행했다. 실제 시험·DB 접속·외부 공급자 재조사·운영 변경은 수행하지 않았다.

## 1. 상태 복원과 판단 기준
첨부 계획 §9를 실제 읽고 AGENTS → 실행 계획 → rebuild README → CURRENT → CP0081 → PR414 순서로 복원했다.

| 항목 | 실제 관찰 / 적용 |
|---|---|
| repository / integration | limbit95/limbit95.github.io / feature/game-platform-vnext-integration |
| 고정 SHA | `3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0` |
| 실제 원격 integration | 위 SHA와 동일. 기준 뒤 추가 변경 없음 |
| 실제 PR414 | merged=true, merge_commit_sha가 위 SHA와 동일. [PR414](https://github.com/limbit95/limbit95.github.io/pull/414) |
| 실행 계획 | 개정1.5, blob da353e2e64daef6b1b0b7267c21997bfd7cda4ed |
| STEP5A | COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED |
| STEP5B | 저장소 기록 NOT_STARTED 유지. 이번 작업은 허용된 근거 준비만 완료 |
| main | 69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09, vNext 반영 미수행 |
| 검증 상태 | 행동 NOT_RUN. UNKNOWN·구현·실행 검증·오픈 의무 유지 |

병합 전 CURRENT/CP0081의 OPEN·미병합은 작성 시점 이력이며 명시된 복원 조건과 실제 Git/PR 증거를 적용한다. 과거 승인 STEP 문서 헤더의 검토 대기 역시 현재 상태와 분리한다. 별도 병합 후 기록 PR이나 감사 단계는 추가하지 않는다.

## 2. 근거 구분과 읽기 범위
- **관찰 사실 F:** 고정 source/test/document에서 확인한 구현·호출·기록. 실행 보장을 뜻하지 않는다.
- **승인 요구 A:** 유효 실행 계획·승인 STEP1~5A·DECISIONS. 구현 존재와 별개로 유지한다.
- **추론 I:** F/A를 비교해 얻는 한계·질문. 채택된 새 설계가 아니다.
- **미확인 U:** source 범위 밖, 실제 배포/실행, 미선택 제품 요구 등. 해당 판단의 한계로만 둔다.

STEP1 inventory의 링크·blob을 현재 tree와 기계적으로 대조했다. **89개 기록 행 중 85개 일치**, 불일치는 실행 계획·rebuild README·CURRENT·DECISIONS의 제어 문서 4행이다. AGENTS 중복 기록 행 등이 있어 89를 고유 파일 수로 해석하지 않는다. 기존 source 근거를 폐기하거나 전수 재조사할 이유는 확인되지 않았다. 현재 승인 문서와 유효 결정으로 제어 문서 변경을 복원했다.

기존 inventory와 STEP5A source trace를 우선 재사용했다. 이번 새 읽기는 종료·결과/통계 consumer, 사이트 목록/활성화 연결, 개인 outcome/연출/Sound 완료 경로와 필요한 테스트에 제한했다. 큰 entry 파일은 관련 import·심볼·주변 호출부만 검토했으며 전체 UI/SQL 감사가 아니다. 파일명을 근거로 현재 없는 runtime.js를 가정하지 않았고 실제 **runtimeModel.js**를 확인했다.

SQL은 저장소의 관련 정의만 읽었다. 최종 운영 함수·migration 적용·ACL·동시성은 확인하지 않았다. 기존 함수와 후속 교체도 일부 확인했지만 전체 SQL 계보 완결을 선언하지 않는다. 기존 Auth/RPC를 vNext에 소급 변경하지 않는다.

## 3. 재사용할 승인 요구
| ID | 현재 유지할 요구 | 근거 |
|---|---|---|
| A01 | 경기/run 종료와 참여자 outcome, 공식 결과 확정·정정·중복 처리와 통계/보상 소비를 분리. 결과 없는 게임과 비room 모델 허용; winner/score/XP 강제 금지 | 계획 §2/STEP5B; R04~08 |
| A02 | 예측 simulation·연출·공식 결과·외부 소비가 다름. 예측 승리를 확정 통계/보상으로 소비 금지. 동일 snapshot/version 재적용은 효과 재발행 근거 아님 | R07 T05; R12 J02/J04 |
| A03 | Core 최소 수명 계약, 선택 runtime/model의 현재성·권위·순서·복구, 소비자별 UI/cache/error/effect 채택, backend 권한 집행 분리 | R09~13, R17~19 |
| A04 | success/error/null/finally/cleanup/leave/effect/후속 비동기까지 적용. T01 같은 room 새 match, T02 A→B→A, T03 role/view/user 전환을 room/version만으로 닫지 않음 | R10 전체 완료 경로/T01~03 |
| A05 | merge·구현·실제 공개 활성화와 공개 사실·사이트 표시/공지 소비 분리. 필요할 때 식별 가능한 공개 사건; 자동화 서비스 선제 구현 금지 | 계획 §2/STEP5B; R07 T06; R13 J09 |
| A06 | Registry discovery/사이트 공개 목록은 서버 인가 대체가 아님. 승인 STEP5A의 단일 metadata 출처 유지; 두 번째 metadata 목록 추가 금지 | R01, R13, R17 §4.1 |
| A07 | 게임별 승인 디자인·결과 연출은 local 경계 유지. Shell 순수 표시 부품과 모델별 연결, mount/view owner 분리; universal DOM/Room Shell 금지 | R17 §4.7 |
| A08 | 기존 BGM 본체/catalog/preferences/player 재사용. controller 내부 최신 재생 의도·종료·작업 귀속을 최소 호환 보완; 무보완 수명 적합 직결은 H1 보류. 게임별 곡/mode/SFX 의미 분리 | R17 §4.8, R19 H1 |
| A09 | H2 dynamic handler/H3 dialog 완료 보류는 제한 범위 유지. H4 비room Invite는 미래 미선택; 현재 전체 단계 blocker 아님. Adapter에 새 token/audio/권한·복구 엔진 은닉 금지 | R18/R19 |
| A10 | Profile은 반복 조합 recipe. Probe의 실제 필요와 반복 증거 없이 새 Profile/Capability 엔진을 선제 확정하지 않음 | 계획 §2/STEP5B; R04~06 |
| A11 | CP0075/D0010: known expiry 뒤 새 A 금지, 적법한 동일 transaction late C만 제한 수용, 실제 C 관측점 유지, 새 P/retry fresh 인가, owner anchor, 최초60초/terminal 보호 | R12~16, R24 D0010 |
| A12 | 기록 열람·삭제·탈퇴·복원 및 성능/오픈 의무는 승인 STEP4B 범위 유지. 기존 Auth·게임 무이관, STEP6 전 구현/물리 API 동결 금지 | R15~16, CURRENT |

STEP4B 과거 strict C deadline/HOLD는 D0010의 유효한 부분 대체와 함께 읽는다. 공급자 선택·보장 범위·운영 정책을 STEP5B에서 다시 조사하거나 재결정하지 않는다.

## 4. 대상별 판단 근거표
각 행의 질문은 Astra에게 넘기는 것이며 **지금 필요한 최소 계약 / 추후 모델로 확장 / 구현 보류**를 Sol이 선택하지 않았다.

| 책임 단위 | F: 실제 의미·API/consumer 경로 | A: 승인 요구 | I: 비교 지점 | U / Astra 질문 |
|---|---|---|---|---|
| F01 종료와 게임별 결과 | No Thanks game-local adapter→no_thanks_play_action→snapshot→runtimeModel→main. natural LAST_CARD_TAKEN은 finalScores/공동 winners, HOST_TERMINATED는 finalScores=null/winners=[]라는 다른 종료. Can’t Stop view는 winnerId/name을 snapshot에서 투영. N01~06 | A01/A03/A04 | terminal이라고 모든 참여자의 승패·점수가 필수인 것은 아님. 다른 기존 게임의 domain 결과를 하나의 보편 schema로 만들 근거는 없음 | U01: 두 Probe의 구체 outcome·결과 필요는 미선택. 종료/결과의 최소 경계와 모델별 의미를 어디까지 정할까? |
| F02 공식 식별·확정·정정·중복 | N02는 room/user/client_action_id와 payload 충돌·잠금/version 후 mutation. The Game evaluate_state→finalize_stats는 game_id와 won/lost 및 stats_finalized_at 조건; 후속 SQL도 guard를 유지(N17/18). Liar 결과 view에는 round_id와 finished_at(N09); client는 실제 v12 RPC 호출(N07) | A01/A02/A11 | 입력 retry 중복 방지, 통계 finalize guard, UI 중복 억제는 서로 다른 보장. 동일 transaction A/C 책임을 UI 확인이나 ACK로 대체할 수 없음 | U02: 검토 범위에는 vNext 공식 결과 정정/revision 및 외부 소비 재처리 계약 증거 없음. Astra가 식별·확정·정정·중복 의미의 최소 경계를 판단해야 함; 테이블/API는 미동결 |
| F03 통계·개인 기록 소비 | The Game per-game stats→getGameStats(roomId)→online MVP; getMyStats()→personal overlay. SQL은 본인 user_id의 finalized game rows를 집계(N17~22). Liar gameStats는 snapshot.game.id/room.version key로 v13 stats 조회, game별 누적/round history/힌트 지표 표시(N07/10/15/16) | A01/A03/A04/A12 | 공식 result producer와 조회·집계/표현 consumer가 분리되어 있음. 게임별 MVP 이름·계산 반복은 공통 통계 엔진 반복의 직접 증거가 아님 | U03: vNext 소비 retry/정정의 반영·취소 규칙, privacy/retention 증거는 미구현·미검증. 어떤 최소 계약만 정하고 집계 의미는 모델/game-local로 둘까? |
| F04 Meta Progression / 보상 | Liar v13은 hint purchases/wallet을 game_id로 제한해 지표 산출(N16). The Game 개인 기록은 game를 넘어 조회하지만 승률/MVP 등의 도메인 통계(N17/22). 이번 경로에서 플랫폼 공통 XP/장기 reward consumer 확인 없음 | A01/A10/A12 | 게임 내 화폐·힌트, 장기 기록, 플랫폼 meta progression은 의미가 다름. hint metric을 공통 XP 정책으로 승격할 수 없음 | U04: 두 Probe에서 영구 progression/reward 요구 없음이 확정된 것은 아님; 구체 요구 미선택. 미필요 기능을 구현 약속하지 않는 범위는? |
| F05 공개 활성화 사실 | No Thanks release checklist는 source baseline/자동·수동·production·activation를 구분하며 공개 승인과 checked activation, unchecked smoke/rematch/monitoring을 함께 보존(N27). 실제 Registry online/presence와 사이트 카드 존재(N25/26) | A05/A06 | 파일/flag 존재는 검증/공개 승인/오픈 완료와 같지 않음. 이력의 drift는 R01 F02/T06 입력이며 기존 문서 정정은 별도 maintenance | U05: 현재 운영 활성화 재검증 미수행. 신규 공개 사건과 동일 사건 재처리/복구/재활성화/정정의 의미를 어디에 둘까? |
| F06 Site 목록 / NEW / 공지 소비 | Registry GAME_REGISTRY와 site games.js GAMES는 별도. renderGames는 GAMES를 카드로 표시, Registry를 import하지 않음(N25/26). 읽은 이 연결에는 release event/NEW/공지 dispatcher가 없음 | A05/A06 | 승인된 단일 metadata 연결 방향과 현재 별도 배열이라는 사실을 구분. 새 두 번째 metadata/event 엔진을 만들어 해결할 수 없음 | U06: 사이트 전체 공지 기능 부재를 증명한 것이 아님. 신규 게임의 NEW/공지 필요는 미선택. 공개 사실 owner와 사이트 소비 경계의 최소 의미는? |
| F07 공식 결과 vs viewer 표현 | Liar resultView는 team winner/round/reveal DOM, resultEffects는 getMyRoundRole 후 자기 team과 winner를 비교해 개인 win/loss sound/effect. spectator/stale 요청 오류는 개인 effect를 만들지 않는 catch(N09/11). The Game presentation은 DOM kicker로 won/lost 제목·focus·scroll, 공식 DB 결과 생산자가 아님(N20/23) | A01/A02/A03/A07 | 하나의 공식 팀 결과와 참가자·관전자별 표현은 다름. effect key와 focus 중복 억제는 공식 result identity/revision의 대체가 아님 | U07: spectator/role change·rewind/replay·정정 후 표현 정책은 vNext 실행 미확인. 표현 요청의 허용·중복 범위와 local 디자인의 owner를 어떻게 나눌까? |
| F08 Presentation 완료 경로 | No Thanks 결과 animation은 await들 뒤 계산 dialog, finally transition 완료, 이후 같은 room 확인으로 재render(N04). CantStop presentation coordinator는 timer/queue로 snapshot 표시를 지연하고 dispose flag와 timer cleanup(N31). Liar reveal은 async RPC/read 뒤 pendingResult/store/DOM 및 retry timer(N12) | A02/A04/A07 | 일부 identity/disposed 검사 존재는 전체 완료 경로의 동등 안전성 증거가 아님. room 동일성만으로 새 match/view 채택을 설명할 수 없음 | U08: error/null/finally/cleanup/effect 후속 완료의 현재 owner별 채택 증거. 공통 수명 규약과 표현 모델의 의미만으로 충분한 경계/조건은? |
| F09 Sound / 기존 BGM | common controller/player/catalog→no-thanks/bgm→main mode/pagehide 연결. wrapper transition Promise queue와 destroy flag; controller tryPlay await 후 PLAYING/userPaused 변경·catch/finally(N28/29). CantStop audio는 전용 dice/blizzard 합성(N30); No Thanks SFX는 main 연출 시점 호출 | A07/A08/A09 | BGM 최신 intent/lifecycle 부족은 승인된 최소 내부 보완 책임. game-local SFX/곡/타이밍이 있다는 이유로 새 universal audio engine을 채택할 근거 없음 | U09: browser audio 성공/실패·track change·destroy·reentrant 완료는 NOT_RUN. BGM 재사용을 유지하면서 effect·SFX의 허용/재실행 경계를 어디까지 최소화할까? |
| F10 Profile / Capability | 승인 계획의 Probe1=작은 2D 협동, Probe2=room/host 없는 local 또는 비동기·기록형. STEP2/3은 축·경계 사례이고 정식 두 Probe 제품 spec/실행 구현 아님. 기존 여러 게임의 통계·효과에는 의미·DOM·API 차이가 확인됨 | A01/A03/A10 | 기존 소비자 수가 여러 개라는 사실은 검증된 vNext 반복 조합 recipe와 같지 않음. STEP5A 본체 재사용과 새 기능 승격의 근거는 별개 | U10: 두 Probe의 최소 result/stat/meta/publication/presentation/sound 선택은 Astra 판단 대상. 지금 선제 기능/recipe가 필요한 반복 근거가 충분한가? |

## 5. 수명·완료 채택의 현재 사실
이는 보안 감사나 기존 게임 결함 수정 지시가 아니다. 승인 계약과 비교할 필요한 호출부 사실이다.

| consumer / 실제 owner | 생성·구독·전환·정리 F | 비동기 완료 F / 승인 비교 | 한계 U |
|---|---|---|---|
| No Thanks model/UI/controller | runtimeModel은 snapshot+current user를 view로 투영. main의 renderLobby가 DOM/결과/연출을 구성. access 변화와 pagehide는 controller 정리, 비persisted pagehide는 BGM destroy(N03/04) | runFinalTakeTransition은 animation→dialog→delay→finally(completed)→same room 재render. celebration key는 room/version/endReason/scores이며 sessionStorage acknowledgement, active dialog/connected 체크로 재표시 억제 | 이 key는 공식 결과 revision/별도 보상 소비 key가 아님. 동일 room 새 경기와 view/user 전환의 전체 late 완료 보호는 증명하지 않음 |
| Can’t Stop presentation | coordinator가 현재 표시·roll queue·bust timer를 소유, present 전 disposed 검사, dispose timer 취소(N31). app은 고유 승리 UI와 BGM/SFX 연결(N06/30) | 주사위/bust 표시와 authoritative snapshot의 반영 시점을 게임 연출에 맞게 staging | timer 사례 테스트는 모델 전체 권한/view/오류/cleanup 효과 보호가 아님 |
| Liar result refresh | app refreshOnce는 snapshot 후 result API read, auth epoch assert 후 store.set; auth user 변화는 resultState 초기화(N07/08). view→data attributes가 별도 module들의 입력 | API read는 await 뒤 auth epoch 검사. gameStats는 requestToken와 latest game.id 검사 후 DOM/cache, catch token 검사, finally requestKey 정리, pagehide observer disconnect(N10) | request token/game identity와 user/view/round/revision 전체 채택은 다른 증거. observer disconnect는 이미 시작된 promise 완료 취소가 아님. API null 의미도 전체 current view 보호의 증거 없음 |
| Liar effect/reveal | resultEffects는 observer와 last/pending effect key, pagehide disconnect; role read 후 current card key/reveal 검사(N11). reveal은 marker에 user/round, pendingResult/versions, timer/overlay를 소유(N12) | effect의 catch는 spectator/stale 개인 효과 억제, finally는 pending key 해제. reveal 완료는 RPC→read 뒤 pending 저장/표시·store.set, 일부 retry는 current card key 검사; 별도 then/catch 경로도 있음 | 성공·error·finally·retry·cleanup에 같은 적용 맥락 증거가 전부 적용됐다고 판단하지 않음. 실제 개인 역할·관전자 처리도 실행 검증 필요 |
| The Game online result/stats | onlineGame은 game status/result로 DOM 구성. resultPresentation은 document.body observer, microtask/RAF focus. playerStats는 loaded/loading/gameId와 personal modal state(N20/22/23) | syncOnlineRoundMvp는 active game→stats await 후 캡처 container에 render; catch error DOM, finally loading=false. 개인 modal은 await 후 render. 검사한 경로에는 await 뒤 current game/view owner 재검사가 명시되지 않음 | DOM removal/새 match/닫힌 modal/user 전환 이후 완료 안전성 미확인. lastResultKey는 focus 표현 억제이며 영속 결과 중복 방지 아님 |
| BGM body/session | controller per-instance Audio·listeners·interaction 상태, wrapper controller/player 생성·queue·destroy(N28/29) | pending play의 성공/catch/finally 내부 쓰기는 기존 승인 STEP5A H1 근거와 동일. wrapper destroyed 체크만으로 본체 완료를 해결했다는 증거 아님 | H1 최소 내부 보완·compatibility/browser 실행 검증 의무 유지. audio 회수/정리 의미와 공용 owner를 새 singleton/lease API로 미리 동결하지 않음 |
| Site games page | renderGames가 site GAMES 카드 생성; overflow RAF/font-ready/resize 연결(N26) | 사이트 표시 구현이며 gameplay terminal/result consumer 아님 | 표시를 실제 production 활성화/공지 dedup/서버 인가 증거로 사용하지 않음 |

## 6. 테스트 근거와 실제 미실행
| ID | 확인한 테스트 범위 F | 검증하지 않는 것 / 상태 |
|---|---|---|
| T01 | No Thanks runtimeModel fixture로 final scores 정렬·동점 rank/공동 winner 투영 | 실제 DB 확정/정정·consumer retry·view 전환과 영속 보상 아님. NOT_RUN |
| T02 | stub RPC argument 전달; SQL 문자열의 version/action/lock/terminal/finalScores/private 경계/rematch assertions | 문자열이 실제 transaction/인가/concurrent execution을 입증하지 않음. NOT_RUN |
| T03 | injected schedule/clock, staged snapshot의 roll/bust 표시·같은 version effect 사례 | browser audio/네트워크/role change/Result 소비 안전성 전체 아님. NOT_RUN |
| T04 | No Thanks rules/UI/audio 호출 코드의 source assertions와 tactile timeline 구성 | 실제 오디오 출력·중복 재생·늦은 성공/reject 처리 아님. NOT_RUN |
| T05 | No Thanks 곡 mode mapping, fake controller/player 연결 및 page wiring | common controller의 pending play/destroy/권한·수명 경합 실제 보호 아님. NOT_RUN |
| T06 | The Game synthetic DOM으로 모바일 기록 modal 최근10 footer 접근, 제거된 module 미로딩 확인 | 실제 stats RPC/공식 result commit/개인 기록 권한·정정/수명 보호 아님. NOT_RUN |
| T07 | Can’t Stop game-local snapshot/view fixtures 및 결과 관련 필드 | vNext generic Result/Profile/Capability 지원 완료 증거 아님. NOT_RUN |

STEP1/기존 release 문서의 과거 시험 기록은 당시 증거로 재사용할 수 있으나 **이번 시험 수행 사실과 다르다**. 이번에는 npm/Guard/build/browser/DB/Audio/다중 client 시험을 실행하지 않았다.

## 7. Astra에게 넘길 질문과 정확한 미확인
### 7.1 핵심 질문
1. **Result:** 종료·공식 결과·참여자 outcome·관람자 표현을 어떤 책임 단위로 나누고, 선택 모델의 최종 채택/복구·backend 확정과 어떤 최소 의미로 연결할까?
2. **식별·정정·소비:** action retry, simulation replay, UI effect, 통계 finalize, publication 재처리를 혼동하지 않으면서 공식 결과의 같은 사건/새 사건/정정과 소비 재처리·취소의 최소 계약은 무엇인가?
3. **통계/meta:** 도메인 score/MVP·게임 내 hint currency와 별도 지속 통계/progression/reward의 경계는 무엇인가? Probe 실제 요구 없는 기능은 어느 범위로 남길까?
4. **Publication:** 공개 사실과 사이트 metadata/list/NEW/공지 consumer를 어떻게 분리하고, 재활성화·복구·정정의 사건 의미를 어디까지 정할까? 기존 release 정책을 재결정하거나 자동화 엔진을 만들지 않도록 범위는?
5. **Presentation/Sound:** authoritative 결과를 표현할 권리, viewer별 의미, replay/rollback·정정·늦은 완료 후 effects/SFX의 중복 범위를 어디에 둘까? 게임별 디자인과 승인 STEP5A BGM 본체 최소 보완을 보존할 조건은?
6. **Profile/Capability:** 지금 선택된 두 Probe에 필요한 최소 기능/조합과 실제 반복 증거가 있는가? 없는 항목을 모든 게임에 강제하지 않으면서 지금 필요한 최소 계약·추후 모델 확장·구현 보류를 어떻게 선택할까?

### 7.2 판단을 좁힐 수 있는 공백과 최소 근거
| 미확인 | 어떤 결론에 영향을 주나 | 필요한 최소 자료 / 처리 |
|---|---|---|
| 두 Probe의 구체 결과·통계·meta·NEW/공지·Sound 요구가 아직 미선택 | “지금 구현해야 함/지금 recipe 필수” 같은 주장 | 승인된 Probe 범위와 STEP2/3으로 최소 계약 여부를 Astra 판단. 구체 제품 기능 선택이 필수인 해당 행만 조건부/보류; 두 Probe를 지금 구현/장르 설계하지 않음 |
| vNext official result revision/correction/consumption 계약 없음 | 확정·정정·duplicate의 책임 선택 | R07 T05/R12 및 F02로 Astra가 의미 경계를 제시. 최종 API/schema/event bus/보상 서비스를 지금 동결할 필요 없음 |
| generic public event 소비 정책 없음 | reactivation=새 공개 사건 같은 특정 선택 | R07 T06과 공개 사실/사이트 소비 요구를 분리해 판단. NEW/공지 미선택을 모든 STEP blocker로 올리지 않음 |
| Liar v12 result RPC와 전체 후속 SQL/privacy override의 최종 정의·운영 적용 미대조 | 기존 특정 RPC의 “완전한 재사용 가능/권한 충족” 판정 | 본 자료 N14는 base 함수이며 N07 actual call은 v12. 해당 legacy API를 직접 재사용하자는 판단을 할 때만 실제 wrapper/후속 정의를 좁게 추가 확인. 현재의 계약 경계 판단에 전체 legacy SQL 감사는 불필요 |
| 실제 release/publication 운영 상태 미확인 | 기존 게임 production 완료 선언 | 이번에는 선언하지 않음. release 문서·Registry/card는 저장소 사실로만 사용. 운영 확인을 현재 설계의 전체 blocker로 전환하지 않음 |
| 통계 권한·삭제/보상 정정의 실행 증거 없음 | 지원 완료·실행 PASS | STEP4B 승인 요구 유지, 허용 후속 구현/실행에 남김. 운영 policy 재결정 불필요 |

**Sol은 새로운 전체 STEP blocker를 확정하지 않았다.** 설계로 답할 질문과 실행해야 입증할 항목을 구분했으며, 세 분류의 실제 판단은 Astra에 남긴다.

### 7.3 후속 구현·실행에서 검증할 의무
- authoritative result 식별·확정, 동일 소비 retry·정정·replay의 집계/보상/표현 영향; ACK/timeout과 실제 commit 구분.
- T01 새 match, T02 A→B→A, T03 role/view/user 전환의 success/error/null/finally/cleanup/leave/effect·늦은 완료.
- current auth/recipient projection·새 P, record 열람·탈퇴/30일 삭제/복원·terminal·owner anchor의 STEP4B oracle.
- 선택 consumer의 BGM 최소 내부 보완, pause/play/track/destroy/reject/finally/reentrant·기존 API/게임 회귀 및 실제 browser 음향.
- 공개 사실의 승인·운영 확인, 선택한 사이트 소비의 같은 사건 재처리/복구/정정과 표시 호환. production 활성화 별도 승인.
- Probe별 실제 지원, 다중 client·모바일·성능/복구·오픈 증거. 기존 UNKNOWN과 NOT_RUN 유지.

## 8. 고정 source trace — 재사용과 새 확인
모든 source 링크는 `3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0`에 고정한다. blob은 읽기 결과와 tree SHA를 대조했다. 같은 파일을 다시 읽은 경우 **새 범위 확인**이며 새 코드가 추가되었다는 뜻이 아니다.

### 8.1 승인·기존 근거 재사용
| ID / 종류 | 경로 (고정 HEAD) | blob | 재사용 범위 |
|---|---|---|---|
| R01 / 재사용 | [docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md) | `f7929e663f9ba5465536bfecffad0f039156781c` | §4~5: shared/site/module consumers, Registry/site cards, result/local and source limits |
| R02 / 재사용 | [docs/game-platform-rebuild/artifacts/step-1-source-inventory.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-1-source-inventory.md) | `0d407aa9020ceab4785c5745e67f826bfeb4b94c` | source/blob inventory at 132ec1576e316d0238c9ca6e07d0d3ab91950ec8 |
| R03 / 재사용 | [docs/game-platform-rebuild/artifacts/step-1-clause-succession-table.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-1-clause-succession-table.md) | `18c3c76589a7db8303ca210886ba981dd8518813` | source authority / clause IDs / succession scope |
| R04 / 재사용 | [docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md) | `52d209d250ba76f351ea13db33aa6259ba641e71` | seven axes, axis⑦ result/meta, capability/profile preconditions |
| R05 / 재사용 | [docs/game-platform-rebuild/artifacts/step-2-game-spec-selection-rationale.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-2-game-spec-selection-rationale.md) | `a5e7be7989c1daeedfb515f751aade754b7f1990` | mode/model/reason/evidence, result vs long-lived progression |
| R06 / 재사용 | [docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md) | `0236dccd268617edf14e6158f582cda9b25b8c8b` | C02/05/07~11: outcomes, observer expression, no-result, persistence; no universal implementation promise |
| R07 / 재사용 | [docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md) | `036dab34e4445fb1a6059b4ca6bce0545a74ae94` | S3-T01~03 and T05 rollback result consumption / T06 activation:47–61 |
| R08 / 재사용 | [docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md) | `9f291884fc0de2e4e0ff65a43f6d92002f62c9a7` | R05; STEP5B handoff:46; evidence limitations:§7 |
| R09 / 재사용 | [docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md) | `610efc904bdaec8881535d3405fe81102bd3d5df` | owner/layer scope:§2~3; consumers enforce lifetime:31 |
| R10 / 재사용 | [docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md) | `5e40988234caba6cb605ea4c0b386a0a5b83b9c5` | adoption:§4; all completion paths:§5~6; T01~03:§7 |
| R11 / 재사용 | [docs/game-platform-rebuild/artifacts/step-4a-contract-source-trace.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4a-contract-source-trace.md) | `f549969caa3bfffb914bf276e594bb61c76668e8` | existing source proof, T01~03 mapping; no new behavior execution |
| R12 / 재사용 | [docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md) | `a6cfe51029e3fc3b2b546222b6a6afb0ad428f14` | current CP0075/CP0074; J01~05, result re-emission not implied by equal version |
| R13 / 재사용 | [docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md) | `e140c90d830ff891c2abd5e40b038249eeeb8ebf` | current A/C/P; J07~09, source/metadata/activation and backend authority |
| R14 / 재사용 | [docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md) | `f3232f64c846bf4b17fcea2ae0bf6baed90ffc03` | §2~3 D0010 effective partial replacement and oracle |
| R15 / 재사용 | [docs/game-platform-rebuild/artifacts/step-4b-verification-specification.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-verification-specification.md) | `91d41480837c6ca3486b28aa1c615177d0fabcea` | T01~14; T09~11 record/visibility/deletion; design not execution |
| R16 / 재사용 | [docs/game-platform-rebuild/artifacts/step-4b-risks-and-followup.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-risks-and-followup.md) | `5555a698f178eda9e7b9cd2e1a793a69ceb83482` | effective design vs execution/open UNKNOWN and obligations |
| R17 / 재사용 | [docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md) | `e80d67aa5a3fa74ffcd441fa977fd4755d6d4c85` | §4.1 Registry; §4.4~5 adoption/recovery; §4.6 Invite; §4.7~8 Shell/BGM |
| R18 / 재사용 | [docs/game-platform-rebuild/artifacts/step-5a-duplication-prevention.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-duplication-prevention.md) | `f43b06d3b728258789534a4d401132d3b0461cd7` | body vs connection, adapter must not conceal new engine |
| R19 / 재사용 | [docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md) | `fb2fa919c12905153360209bb692a3adc626a42c` | owner and H1~4 bounded holds; execution obligations |
| R20 / 재사용 | [docs/game-platform-rebuild/artifacts/step-5a-source-trace.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-source-trace.md) | `3bafb8e95a4d3a854bad2bf5c25e9d1735369428` | existing per-body/consumer source and source equality |
| R21 / 재사용 | [docs/game-platform-rebuild/artifacts/step-5a-validation.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-validation.md) | `c31951dd04afeb82465a5c6be871bc6ac4d55230` | formal doc validation vs NOT_RUN; originals/meaning protection |
| R22 / 재사용 | [docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md) | `e1a6515b38db0164146ca3a51fc29aae60275c6a` | LEGACY-DEV-206~213,249~250,296,309; LEGACY-DB-048 |
| R23 / 재사용 | [docs/game-platform-rebuild/artifacts/step-1-clauses-site-history.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-1-clauses-site-history.md) | `fb80ff3e9f80c43ce4a40a3d8567fce604b54a0d` | site utility BGM succession; CURRENT utility and HISTORY distinction |
| R24 / 재사용 | [docs/game-platform-rebuild/DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/DECISIONS.md) | `ab4896bd01b591895d0e30946a810c41eaa74e5a` | D0006~10 effective status and partial supersession |

### 8.2 이번 source·호출부 및 test 확인
N01~06/N25~29 등 기존 inventory의 해당 파일은 기존 근거를 재사용하고 위 추가 심볼/consumer를 확인했다. 그 밖의 legacy 결과·통계 경로는 이번 STEP5B 공백을 채우기 위해 좁게 읽었다. SQL의 Realtime publication은 **사이트 공개/출시 사건과 다른 의미**이며 혼동하지 않는다.

| ID / 종류 | 경로 (고정 HEAD) | blob | 읽은 줄 또는 심볼 |
|---|---|---|---|
| N01 / 새 범위 확인 | [games/no-thanks/gameplay.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/games/no-thanks/gameplay.js) | `137242667ffb17b6bc51f9768bd2b1768b18b402` | callAction / createNoThanksGameplayAdapter:20–97 |
| N02 / 새 범위 확인 | [supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql) | `d24ff683c8ffa6861bb287f986395d24fa4a8422` | no_thanks_play_action:133–449; snapshot:34–131; natural terminal:375–415; host terminal:245–264 |
| N03 / 새 범위 확인 | [games/no-thanks/runtimeModel.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/games/no-thanks/runtimeModel.js) | `b568a1c06ed0645e9f114bfa490f18cdba7821ae` | createNoThanksLobbyViewModel:14–138; score projection:61–95 |
| N04 / 새 범위 확인 | [games/no-thanks/main.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/games/no-thanks/main.js) | `9e09b49d2365fe880e40a6c2180476573043cb0b` | imports:1–88; getWinnerCelebrationKey/ack/show:3174–3319; animateFinalTake:3400–3445; render:3840–4000; boot/pagehide:4090–4151 |
| N05 / 새 범위 확인 | [games/cant-stop/runtimeModel.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/games/cant-stop/runtimeModel.js) | `24f680e617f2f3f066adafd6d38807b3de996dd9` | createCantStopLobbyViewModel / winnerId / winnerName / gamePhase |
| N06 / 새 범위 확인 | [games/cant-stop/app.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/games/cant-stop/app.js) | `29eba21d4637febb2a74dc12d89847d86af9d7b0` | victory rendering:809–937; BGM/presentation connection; cleanup:1990–2118 |
| N07 / 새 범위 확인 | [liar-game/js/api.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/liar-game/js/api.js) | `e9eaf42052ea4d9626e32d3f411e8de8c06b8cbc` | read/authEpoch; getRoundResult→liar_get_round_result_v12; getGameStats→liar_get_game_stats_v13:1–15 |
| N08 / 새 범위 확인 | [liar-game/js/app.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/liar-game/js/app.js) | `2ed5df23cb1b024dcbcd4071b9256bdc79d8b28d` | refreshOnce:34; resultView:51; leave:98; auth-user-changed:122 |
| N09 / 새 범위 확인 | [liar-game/js/views/result.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/liar-game/js/views/result.js) | `1e728b1c718917bf29c6a2d9132cf420a3f687a9` | resultView:52–63; dataset resultId/round/winner/finishedAt; liarsRevealed |
| N10 / 새 범위 확인 | [liar-game/js/gameStats.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/liar-game/js/gameStats.js) | `386a005a9492b22ebe8a9b3d0de5702d9eb4ee03` | statsHTML:51–92; sync/renderTargets/requestToken/catch/finally/pagehide:96–130 |
| N11 / 새 범위 확인 | [liar-game/js/resultEffects.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/liar-game/js/resultEffects.js) | `e5abf47f693481fed43139c8f555fb571a12a9c9` | cardKey:9; cleanup/effect creation:100–186; inspectResult/start:188–217 |
| N12 / 새 범위 확인 | [liar-game/js/resultRevealCountdown.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/liar-game/js/resultRevealCountdown.js) | `96e8c382a624bc8aef64319348b6f24d5ca24d04` | cardKey/marker:13–14; applyPendingResult:37–49; completeReveal:105–125; resume/retry/DOM handlers:130–174 |
| N13 / 새 범위 확인 | [liar-game/index.html](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/liar-game/index.html) | `b8c5230fe44c450ff9d95af2a029f4dfa72f9afd` | gameStats/resultRevealCountdown/resultEffects module entries:44/48/53 |
| N14 / 새 범위 확인 | [supabase/liar-game/functions-result.sql](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/supabase/liar-game/functions-result.sql) | `811d23f76e40bf2b557e3fe92e9a51dca07f2da5` | liar_get_round_result base:84–153, authentication/member/status checks:96–115; NOT actual v12 wrapper definition |
| N15 / 새 범위 확인 | [supabase/liar-game/migrations/20260828_04_result_stats_and_player_order.sql](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/supabase/liar-game/migrations/20260828_04_result_stats_and_player_order.sql) | `57790921f14e0d102ea915e38cccbf994c889cc1` | game stats v12 extension:88–198; per-game vote/role statistics |
| N16 / 새 범위 확인 | [supabase/liar-game/migrations/20260828223226_liar_expanded_mvp_stats_v13.sql](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/supabase/liar-game/migrations/20260828223226_liar_expanded_mvp_stats_v13.sql) | `1f377196972d973673eabb2275c382bdc77aa007` | liar_get_game_stats_v13:3–169; base v12:24; game-bound hints/wallet:118–133 |
| N17 / 새 범위 확인 | [supabase/the-game/20260829064240_the_game_stats_mvp.sql](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/supabase/the-game/20260829064240_the_game_stats_mvp.sql) | `e63ba4dc48adb61a6cfc1c19929f57779babf259` | evaluate/finalize:89–205/265–315; get_game_stats:492–551; get_my_stats:553–683 |
| N18 / 새 범위 확인 | [supabase/the-game/20260829122605_the_game_mischievous_mvp.sql](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/supabase/the-game/20260829122605_the_game_mischievous_mvp.sql) | `340b2a11ced81db20a6fb7b8523a104fccb58b38` | later replacement the_game_finalize_stats:168–249, stats_finalized_at guard:188–195 |
| N19 / 새 범위 확인 | [the-game/js/multiplayerApi.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/the-game/js/multiplayerApi.js) | `46db453d346f63b892450095029978b0e4ec8bf2` | getGameStats/getMyStats RPC wrappers; rpc/client and subscribeGame |
| N20 / 새 범위 확인 | [the-game/js/onlineGame.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/the-game/js/onlineGame.js) | `92120e6d1adb724ad2a29fe6cbbff165174f8071` | renderResult:310–341; refresh:404–430; rematch/leave:543–621 |
| N21 / 새 범위 확인 | [the-game/js/gameStats.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/the-game/js/gameStats.js) | `754b1d5869ce0f01cdd6daa8ae8e98d651da5165` | local per-round counters/recordRoundPlay:199; MVP award calculation:late module |
| N22 / 새 범위 확인 | [the-game/js/playerStats.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/the-game/js/playerStats.js) | `361285ec009f3cdf622467c4f31f5eaaa7388290` | local stats hooks:240–285; syncOnlineRoundMvp:289–324; personal modal load:476–498 |
| N23 / 새 범위 확인 | [the-game/js/resultPresentation.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/the-game/js/resultPresentation.js) | `055b40c8745aa127372c0d428a18fdcf088de514` | syncResultPresentation/lastResultKey/RAF:6–39; observer:41–56 |
| N24 / 새 범위 확인 | [the-game/index.html](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/the-game/index.html) | `e363999f5fc25dfcbd7dc24439f07e647b16beeb` | resultPresentation/playerStats module entry:140/145 |
| N25 / 새 범위 확인 | [games/shared/registry.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/games/shared/registry.js) | `afa4ba25824157534eca7ca7538b89571cfca30e` | defineGame / GAME_REGISTRY / listRegisteredGames / getRegisteredGame:1–114 |
| N26 / 새 범위 확인 | [js/pages/games.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/js/pages/games.js) | `81614a6496b77415f4aef7aa26181f63dbc6f948` | GAMES:54–96; renderGames:98–128; no Registry import |
| N27 / 새 범위 확인 | [games/no-thanks/RELEASE_CHECKLIST.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/games/no-thanks/RELEASE_CHECKLIST.md) | `28d562743296889439d19d72bcaa84d843669b0d` | manual/production/activation/release gates, approved release and still-unchecked items |
| N28 / 새 범위 확인 | [games/no-thanks/bgm.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/games/no-thanks/bgm.js) | `1f7c850ffbb8e25c038114b1d7ed2f34ed420332` | track/mode mapping; start/setMode/destroy:21–84 |
| N29 / 새 범위 확인 | [js/game-audio/bgmController.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/js/game-audio/bgmController.js) | `4757a1de3477dbebe44f2dd49b7071eb8b03d9c2` | tryPlay; switchTrack:219–251; destroy:272–281; public API:284–298 |
| N30 / 새 범위 확인 | [games/cant-stop/audio.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/games/cant-stop/audio.js) | `393a0e9977e3d58118b9991cef266cd909b65837` | AudioContext ownership; playCantStopDiceRollSound/playCantStopBlizzardSound |
| N31 / 새 범위 확인 | [games/cant-stop/presentation.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/games/cant-stop/presentation.js) | `db623b2eb53f76b367efbdb5125ab2a388b07a97` | createCantStopPresentationCoordinator:40–242; timer/state/present/dispose |
| T01 / 새 범위 확인 | [tests/game-platform-no-thanks-runtime.test.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/tests/game-platform-no-thanks-runtime.test.js) | `878e7028bce52114aa9d65f6fc75f4ccccfcaa44` | result projection/joint winners:129–172 |
| T02 / 새 범위 확인 | [tests/game-platform-no-thanks-gameplay.test.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/tests/game-platform-no-thanks-gameplay.test.js) | `bc5b57135c9bd6e019e24b92272f2296698bff39` | stub RPC:53–103; SQL-text assertions:124–166 |
| T03 / 새 범위 확인 | [tests/game-platform-cant-stop-presentation.test.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/tests/game-platform-cant-stop-presentation.test.js) | `006776940e47d8ce445d497ee21667a75cd4d3a7` | fake timers/staged snapshots:65–266 |
| T04 / 새 범위 확인 | [tests/game-platform-no-thanks-audio-feedback.test.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/tests/game-platform-no-thanks-audio-feedback.test.js) | `027157d09abf6e9b633f91a8356599368566f3d9` | source-text assertions:14–57 |
| T05 / 새 범위 확인 | [tests/game-platform-no-thanks-bgm.test.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/tests/game-platform-no-thanks-bgm.test.js) | `c5400f0aa8c5744198a05b6e073f92dc800984da` | mode mapping, stub controller/player, wiring assertions:20–102 |
| T06 / 새 범위 확인 | [tests/e2e/the-game-record-modal.spec.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/tests/e2e/the-game-record-modal.spec.js) | `b8dcc19472205dffb8193d763b16bbbbb79094ad` | mobile modal/footer synthetic DOM fixture:8–74; module cleanup:76–80 |
| T07 / 새 범위 확인 | [tests/game-platform-cant-stop-runtime.test.js](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/tests/game-platform-cant-stop-runtime.test.js) | `f3495259fe694dbca7a7776d66a5d735a637216d` | game-local view fixtures; winner/end state projection cases |

### 8.3 상태 증거
AGENTS blob 2686a3c37502bbf1f7f2a9407640e78cc026dadb, 계획 da353e2e64daef6b1b0b7267c21997bfd7cda4ed,
rebuild README 15ca8abc232315d776fb225cb701d67e93ef6f9e,
CURRENT cc4fc3898052a05d983855f0c34718d10cdb3133,
CP0081 644975989c9219ad6c5e405bf3b936d2f471c7ec.
원격 ref/PR414는 §1과 일치. 기준 tree 1057항목, truncated=false.

## 9. 제출·검증·정지
문서의 고정 경로/blob·근거 ID/참조·F/A/I/U 구분·승인 조건·최종 선택 미수행·검증 상태를 확인했다. 이것은 문서 대조이며 행동 PASS가 아니다.
저장소 변경·branch/PR/checkpoint·정식 STEP5B 산출물·실제 시험·외부 재조사·DB/운영 변경·구매/문의/job/dump/복원·병합/main/STEP5C 이후는 수행하지 않았다.
다음 담당은 **Astra**, 작업은 **STEP5B 핵심 경계 판단**이다. 이 문서 §10 프롬프트를 사용한다. 이번 요청에서 Astra 판단을 실행하지 않고 여기서 멈춘다.

## 10. Astra 전달 프롬프트
```text
Game Platform vNext STEP5B의 핵심 경계를 판단해줘.

담당: Astra.
입력: game-platform-vnext-step5b-evidence.md — Sol 사실·승인 근거이며 최종 선택표 아님.
필요 시 game-platform-vnext-step5b-plan-and-handoff.md.
저장소 limbit95/limbit95.github.io, integration feature/game-platform-vnext-integration.
판단 기준 SHA 3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0.

첨부 근거를 실제 읽고, AGENTS → 계획1.5 → rebuild README → CURRENT
→ CP0081 → PR414로 필요한 상태를 복원하고 실제 원격 HEAD와 대조해줘.
기준 뒤 변경은 분리하고 섞지 마. STEP5A 승인/완료/병합, STEP5B 기록 NOT_STARTED,
행동 NOT_RUN·UNKNOWN·구현/실행/오픈 의무 및 main 별도 게이트를 유지해줘.
과거 검토대기/HOLD/미병합은 유효 결정·실제 Git과 함께 당시 이력으로 읽어줘.

대상은 Result/Statistics/Meta Progression, Publication/Site Integration,
Presentation/Sound와 실제 Probe 필요·반복 증거에 따른 Profile/Capability 경계다.
책임 단위·consumer/model별로
지금 필요한 최소 계약 / 추후 모델로 확장 / 구현 보류
중 하나를 권고하고 범위·이유·조건·owner·미확인을 명시해줘.
기능 목록을 구현 약속으로 만들지 마. 최종 API/schema/file/class는 STEP6보다 앞서 동결하지 마.

특히 종료/공식 결과/참여자 outcome/관람자 표현,
권위자의 식별·확정·정정과 통계/보상 소비,
action retry/simulation replay/UI 효과/집계/publication 중복 의미를 구분해줘.
예측 결과·동일 snapshot 재적용을 확정 보상/효과 재발행 근거로 쓰지 마.
공개 merge·구현·activation·공개 사건·사이트 NEW/공지 소비를 분리하고
선제 자동화/보상/audio/프로필 엔진을 만들지 마.
Profile은 recipe이며 실제 Probe 필요와 검증된 반복 없이 선제 필수화하지 마.
모든 게임에 winner/score/XP/Room/host/DOM을 강제하지 마.

승인 STEP1~5A·DECISIONS를 재사용해줘. Sol trace/blob을 활용하고
결론을 바꿀 공백·충돌의 해당 부분만 추가 읽어줘.
전체 source/SQL 감사·공급자 조사·운영 정책 재결정·별도 사후 감사는 추가하지 마.
근거의 요약과 승인 원문이 충돌하면 유효 결정·원문을 우선하며 차이를 명시해줘.
legacy 함수의 최종 운영 정의를 완전 확인했다는 전제는 금지해줘.
실행해야 확인되는 항목 때문에 모든 설계 판단을 보류하지 마.

기존 Auth/게임 무이관, STEP4A 전체 완료 경로/T01~03,
CP0075/D0010의 known expiry 뒤 새 A 금지·동일 transaction late C 제한 수용·
새 P/retry fresh 인가·owner anchor·최초60초·terminal 보호를 유지해줘.
Registry 두 번째 metadata 목록 금지,
Snapshot/Reconnect의 선택 모델 단일 최종 채택·복구 책임,
Shell 공통 부품/게임별 UI·결과 연출 분리,
BGM 기존 본체 재사용+내부 최소 수명 보완/H1 무보완 연결 보류를 보존해줘.
Invite H2~4도 유지하고 비room 미래 미선택을 전체 blocker로 올리지 마.
Adapter 안에 새 권한·순서·수명·token/audio 엔진을 숨기지 마.

제출물:
1. 책임 단위별 3분류 표:
실제 의미/consumer/model, 권고 범위, 최소 계약/owner,
핵심 근거, 호환·수명 조건, 미확인·후속 검증.
2. 중복·확장 기준과 Core/runtime-model/capability/Site Adapter/game-local/backend 책임안.
소프트웨어 owner와 후속 작업 담당 모델을 구분해줘.
3. 사용자 승인할 핵심 선택, 실제 결론 blocker와 구현·실행 의무 분리,
승인 후 Sol/Codex의 정식 반영 항목, 다음 첫 작업 하나와 전달 프롬프트.
관찰 사실 / 승인 요구 / Astra 판단 / 미확인을 구분해줘.

판단 결과를 game-platform-vnext-step5b-astra-judgment.md로 자동 문서화하고
그대로 사용할 다음 담당 Sol/Codex 인계 프롬프트도 제공해줘.
정식 저장소 반영은 사용자 핵심 판단 승인과 명시적 반영 허용 뒤로 남겨줘.
채팅 판단안/제출용 문서만 작성하고 멈춰줘.
이번 제출만으로 STEP5B COMPLETED·사용자 승인·행동 PASS를 선언하지 마.
저장소 변경·branch/PR/checkpoint·구현·실제 시험·외부 재조사·운영 변경·구매/문의·
job/dump/복원·병합/main·STEP5C 장르 설계·STEP6 Target 동결 및 이후 없이 정지해줘.
```

