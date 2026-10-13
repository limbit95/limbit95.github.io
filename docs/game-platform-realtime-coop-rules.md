# Game Platform vNext — 실시간 협동·공간형 하위 규칙

> **문서 분류:** CURRENT
> **적용 범위:** 신규 vNext (기존 consumer 제외)
> **계약 식별:** GP-GENRE-REALTIME-COOP/1

상위 [AR](game-platform-architecture.md)의 장르 하위 topic-owner다. 단지2D/online이라는 이유로 적용하지 않으며 RT1의 제한 경험 scope를 따른다. 공통 개발/품질 [CO](game-platform-common-rules.md), 전체수명 [LI](game-platform-lifetime-contract.md), 선택모델/권위·인가/순서·복구 [MO](game-platform-model-contracts.md), 공통기능/결과·공개 [CA](game-platform-capability-contracts.md), 전파 [GV](game-platform-governance.md), 실제 보드 경험 [BO](game-platform-board-rules.md)를 참조한다. 실제 DB/RPC 모델에는 [기존 DB 계약](game-platform-db-test-contract.md)을 적용하며 기존 consumer/development/UI/DB의 원 scope를 유지한다.

아래 A/J는 승인 STEP5C 본문의 근거 유형을 보존하는 표시다. J 내용은 이후 사용자가 승인한 설계이며 지금 새 선택을 제안하는 뜻이 아니다. 실시간협동/공간 경험 요구와 그 owner·조건/제한/미확인·후속 oracle를 실제 적용하고, 공통 인가/수명/복구의 별도 엔진 본문을 만들지 않는다. 원본/보존조건은 [source trace](game-platform-rebuild/artifacts/step-7a3-source-trace.md), [승인 STEP5C §5](game-platform-rebuild/artifacts/step-5c-realtime-coop-spatial-rules.md), [연결/확장 §6~8](game-platform-rebuild/artifacts/step-5c-genre-model-connections.md)를 따른다. 원본의 PROPOSED/검토대기/STEP6미전환은 작성 당시 이력이다.

관련 정식 결과는 REVIEW_PENDING으로 제출하며 사용자 최종 검토가 남아 있다. 문서 revision/권위·모델 선택·코드 존재·실제 지원/운영 활성화를 구별하고 행동 NOT_RUN/UNKNOWN·구현/실행/오픈 의무를 유지한다. 7B model-oracle/discovery 준비 전 신규 vNext online admission 미지원과 기존 online DB 검사를 유지한다.

## RT1 범위·출처

**A 범위:** 첫 Probe의 작은 실시간 2D 온라인 협동 수직 Slice. 지속적인 공간 이동/행동과 동시 참가가 있을 수 있으며 준비·결과·종료는 이벤트성 전이로 연결할 수 있다. 실제 게임·세계 구조·목표·camera·transport·renderer·tick/physics/network 주기·prediction 채택을 여기서 정하지 않는다.

**J 적용 범위:** 지속 입력과 공간 상태가 플레이 판단에 영향을 주는 제한 실시간 협동 경험에 이 규칙을 적용한다. 단지 2D로 그리거나 온라인이라는 이유만으로 적용하지 않는다. 경쟁 대전·전용 물리·정밀 리듬·3D·대규모 장기 세계는 이 규칙 문서의 지원 범위로 선언하지 않는다. 추후 필요 시 기반 규칙과 차이를 조사한다. 이 범위 제한은 다른 장르의 개발을 금지하는 정책이 아니다.

출처는 계획 §3/STEP5C, STEP2 7축, S3-C02/C08/C09/C10 및 전환, 승인 STEP4A/B·5A/B, 근거 N01~13과 B01~12다. E01~03은 Sol이 2026-10-10에 확인한 제한 웹플랫폼 사실을 재사용한다. 실제 제품 사례·권리·입력장치 선정은 개별 Probe 조사로 남긴다.

| 제한 공식 근거 | 재사용하는 사실 | 이 규칙 문서의 J 연결과 한계 |
|---|---|---|
| E01 [W3C Keyboard 설명](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | 기능 키보드 조작과 본질적인 경로 의존 입력 예외의 구분 | S5C-R11의 기능별 조작 검토. informative 설명을 WCAG 전면 채택·준수 인증으로 확대하지 않음 |
| E02 [Pointer Events Level3](https://www.w3.org/TR/2026/REC-pointerevents3-20260630/) [MO3와 승인 적용 조건](game-platform-model-contracts.md).3.3/4.2.7/4.1.4 | pointer stream 취소/억제와 경계 사건 가능 | S5C-R02의 취소·좌표/기기 전환 검토. pointer capture라는 기법이나 브라우저 지원을 확정하지 않음 |
| E03 [HTML 렌더 갱신](https://html.spec.whatwg.org/multipage/webappapis.html#update-the-rendering)·[animation callbacks](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames) | hidden/렌더 기회와 render callback 처리의 구별 | S5C-R04/05의 시계 분리·복귀 검토. 모든 timer/서버가 멈춘다는 주장이나 정확한 브라우저 재개 보장 아님 |

이번에 외부 자료를 새로 조사하지 않았다. 과거 X01~07 등은 [고정 STEP5C 근거 [승인 Target §4.2](game-platform-rebuild/artifacts/step-6-target-architecture.md#42-hostless와-재대결)](game-platform-rebuild/artifacts/game-platform-vnext-step5c-evidence.md)에 명시된 확인 시점·판본/commit 한계를 유지하며 새 제품·공급자·요금·운영 권고로 쓰지 않는다.

## RT2 플랫폼·7축 연결

**A 공통 재사용:** Registry 단일 metadata, site Access/기존 Auth, 실행·viewer 수명, 네 문서·수동 gate, 선택 모델의 권위/인가/복구, STEP5A/B의 공통 기능 본체를 참조한다. 장르 전용 Core·Auth·초대·BGM·결과 집계 엔진을 새로 정의하지 않는다.

**J 선택 기록:** GAME_SPEC는 STEP2의 7축 — 흐름, 갱신/시간 특성, 세션 수명, 참여/역할, 권위·동기화·복구, 공간·입력·렌더링, 결과·지속성 — 을 기존 선택표 의미로 기록하고 필요한 Capability를 별도 선택한다. 세부 기능은 **사용 / 비적용(이유) / 미선택·미결정 / 미지원**을 구별한다. 문서 존재·모델 선택·구현 증거·실행 지원은 별도 상태다.

| 연결 주제 | owner / 참조 | 금지 조합·적용 조건 |
|---|---|---|
| 실행·시간·공간 | 선택 모델의 진행/입력/공간 의미; game-local의 조작·세계·카메라 | 장르명만으로 고정 Hz·DOM/Canvas·physics·prediction 채택 금지 |
| 권위·송수신·복구 | STEP4B 승인 모델/backend, STEP5A Snapshot/Reconnect 단일 최종 채택·복구 | relay를 판정 권위로 오해하거나 예측 상태를 공식 결과로 소비하지 않음. DB·stream은 [MO3와 승인 적용 조건](game-platform-model-contracts.md) 조건 |
| 세션·진입·재대결 | 선택 세션 모델, site 인가, [승인 Target §4.2](game-platform-rebuild/artifacts/step-6-target-architecture.md#42-hostless와-재대결) | roomless를 무권한 허가로 해석 금지. 현 adapter의 무의미한 8 surface 금지 |
| Shell·게임 UI | 공통 표시 부품 vs game-local 공간·HUD·결과 연출 | 공통 Shell이 모든 게임 레이아웃/renderer를 소유하지 않음 |
| Invite·BGM·표현/결과 | STEP5A H1~4·STEP5B producer/consumer와 효과 owner | 미선택 기능 강제·무보완 연결 지원 인증·Adapter 내부 새 본체 금지 |

## RT3 승인 R01~13 경험 규칙

다음 표의 관측 기준은 후속 시험에서 확인할 oracle이며 이번 실행 결과가 아니다. R01~13은 근거 N01~13을 단순 재진술한 질문 목록이 아니라 **승인된 최소 행동/기록 규칙**이다.

| 규칙 ID / J 내용 | owner·조건 | 후속 관측 / 미선택·미지원 |
|---|---|---|
| <a id="s5c-r01"></a> **S5C-R01 지속 협동 흐름**: GAME_SPEC는 행동의 시작·유지·중단·해결, 동시 행동의 충돌/협동 기여, 플레이 가능/대기/종결을 구분한다. 턴 대기를 대신 붙이지 않는다. 플레이어가 현재 가능한 행동과 협동 진행의 원인을 이해할 수 있게 표현한다 | game-local 규칙·상태; 전이의 권위/순서는 선택 모델. 지속 진행이 실제 없는 부분은 이벤트 전이로 설명 | 동시 입력/같은 대상 경합/참가자 이탈 때 상태와 표현이 정의한 규칙으로 설명되는지 확인. 실제 목표·실패 조건 미선택 |
| <a id="s5c-r02"></a> **S5C-R02 입력 시작·해제·취소**: 연속 intent의 owner와 유효 범위를 정한다. cancel/blur/입력원 교체/역할 상실 등으로 유효성을 잃은 눌림·방향·drag는 이후 입력의 근거로 자동 유지하거나 복귀 때 재생하지 않는다. 다시 활성화는 현재 맥락과 새 유효 입력을 근거로 한다 | game-local 조작 의미 + 선택 입력 모델; 현재 권한은 backend. 실제 장치에 존재하는 cancel 신호만 연결하고 단발·지속·조합 입력을 구별 | down 후 up 없이 cancel, 포커스 상실, 입력원 변경 뒤 stuck movement/중복 행동 없음. 이미 권위적으로 수용된 행동을 client cancel로 rollback했다고 표시하지 않음. cancel 전달/손실 시 원격 intent 종료의 관측 가능 의미는 구현 전 해당 모델이 정의; 임의 timeout 수치 미동결 |
| <a id="s5c-r03"></a> **S5C-R03 공간·카메라·좌표**: 플레이어가 조작 대상·위치·경계·중요 상호작용을 식별할 수 있게 한다. viewport/camera/확대/방향 변화 후 입력의 화면 좌표와 게임 공간 해석을 다시 맞추며, 옛 좌표 해석을 새 공간에 적용하지 않는다 | game-local 세계·카메라 정책; 선택 공간/입력 모델. 고정 camera·격자/연속·충돌·physics 유무는 실제 선택 | 작은 화면·크기/방향 전환·가림·화면 경계에서 목표와 action이 유지되는지 확인. camera가 없거나 물리가 없으면 이유 기록; 억지 camera/physics 추가 없음 |
| <a id="s5c-r04"></a> **S5C-R04 시간의 분리**: render/FPS, input sampling, simulation, physics(사용 시), network, audio 시간을 구별한다. 화면 frame 수/브라우저 timer 횟수를 경기 권위 시간·순서·서버 마감과 등치하지 않는다. 큰 시간 공백의 처리 의미를 선택 모델에 기록한다 | 시간/진행 모델; game-local 행동 시간 요구. 승인 권위 구조를 참조 | frame 저하/긴 공백에서 잘못된 진행·명령 폭주·권위 순서 역전이 없는지 확인. catch-up/폐기/보간 방식·수치·tick은 미선택이며 이 규칙 문서이 고정하지 않음 |
| <a id="s5c-r05"></a> **S5C-R05 비가시·복귀**: 비가시/포커스 상실과 게임의 pause/종료를 구별한다. local의 더 이상 유효하지 않은 지속 intent는 R02로 해소한다. 복귀 시 현재 실행/역할·권한·authorized state와 갱신 연결의 준비를 확인한 뒤 보호 입력을 재개한다. 옛 buffered intent나 빠진 frame을 무조건 몰아서 실행하지 않는다 | view/input owner + 단일 복구 모델. browser 신호 자체는 서버 경기 pause/종결 명령이 아님 | 숨김 중 진행·권한 철회·terminal·재연결 뒤 fresh view만 사용하고 terminal을 LIVE로 되살리지 않음. 단순 visibility 변화가 항상 rejoin/전체 snapshot을 요구한다는 구현은 미선택; 현재성 입증이 불가능하면 복구/차단 |
| <a id="s5c-r06"></a> **S5C-R06 가시성·역할**: 공간에 그려지는 정보와 전달 가능한 정보를 구분한다. camera 가림·CSS 숨김·화면 밖 entity는 서버 projection/recipient 권한의 대체물이 아니다. 역할/view 교체 때 이전 private 정보·입력 활성·effect를 새 viewer에 자동 이어 붙이지 않는다 | backend의 authorized view·전달 + viewer 수명; game-local 표현 | participant↔spectator·동일 user 다른 role·새 user·중도 참가를 선택했다면 그 전환에서 정보/입력 격리. 관전/중도 참가/팀 private는 미선택 가능; private 없음도 비노출 검증 |
| <a id="s5c-r07"></a> **S5C-R07 시작·종료·재참여**: UI 준비, 서버 start 허가, 실제 진행, terminal, local detach를 별도로 설명한다. 종료 영향 범위와 확인·안전 이탈·다시 진입을 제공하며, 적용 multiplayer 재대결은 [승인 Target §4.2](game-platform-rebuild/artifacts/step-6-target-architecture.md#42-hostless와-재대결)를 따른다 | game-local 제품 lifecycle + 세션/권위 모델; 안내/확인 UX는 공통 참조 | 동시 start/leave/종료, 종료 후 복귀, 같은 맥락 새 match에 이전 결과 불채택. 지속 세션이면 안전 종료 경로. winner/score/result 없음 허용; 실제 종료/결과 정책 미선택 |
| <a id="s5c-r08"></a> **S5C-R08 복구와 입력 준비**: 연결 성공만으로 플레이 가능을 표시하지 않는다. authorized current checkpoint/state와 이후 갱신의 일관성·gap/quiet loss 처리·현재 owner/view를 단일 모델이 판정하고, 실패/복구 중/terminal을 실제 상태대로 보인다 | STEP4B J02~05와 STEP5A 단일 최종 채택·복구 owner | initial/live 경합·마지막 이벤트 유실·tail gap/overflow·끊김/복귀에서 최신 상태/입력 허용 일치. history replay와 현재 상태 복구를 분리. 장기 history 보존은 요구 시만 |
| <a id="s5c-r09"></a> **S5C-R09 전체 수명**: 입력·camera/renderer·timer·listener·effect·늦게 얻은 자원에 STEP4A 전체 완료 계약을 적용한다. 반영 대상/맥락/권한/모델 순서/반영 시점이 맞는 결과만 채택하고 자기 owner 자원만 정리한다 | Core 공통 수명, 선택 모델의 맥락, 실제 자원 owner. 게임은 site 공용 자원의 자기 사용권만 반납 | success/error/null/finally/cleanup/leave/effect·후속 작업, 부분 초기화 실패·재진입·반복 dispose·dispose 뒤 자원 획득을 관측. 취소 요청과 실제 중단/채택 무효화/정리를 분리. T01~03 모두 유지 |
| <a id="s5c-r10"></a> **S5C-R10 잠정 피드백·공식 결과**: 즉각 반응이나 선택한 prediction은 잠정임을 의미상 구분하고 권위 상태와 조정 가능해야 한다. 공식 결과·개인 outcome·viewer 연출은 STEP5B 경계로 연결한다. 재시뮬레이션/재조회/재렌더가 새 보상·집계·SFX 발행 근거가 되지 않는다 | 선택 모델 + game-local presentation, 공식 producer 및 각 consumer | 거부/보정·snapshot 반복·ACK 유실·정정에서 확정 결과/효과 중복 없음. prediction 사용 여부 미선택, 보정 시각 방식 미동결. 이미 재생한 SFX를 rollback으로 취소했다고 주장하지 않음 |
| <a id="s5c-r11"></a> **S5C-R11 조작 발견·접근성**: 메뉴·시작/종료·규칙 보기·복귀 안내처럼 본질적 경로 의존이 없는 기능은 키보드로 도달/실행하고 포커스와 상태를 알 수 있게 설계한다. gameplay는 본질적 조작 요구와 제공 대체 입력을 기능별로 명시한다. 색/소리/hover 하나에만 핵심 상태나 action 발견을 맡기지 않도록 검토한다 | J 장르 품질 보완 + 공통 UI/수동 gate; game-local 조작/정보 설계 | 키보드·실제 제공 터치/포인터·포커스 이동·비가시 복귀·음소거에서 핵심 안내/종료 경로 확인. 실시간이라는 이유만으로 모든 gameplay를 예외 처리하지 않음. 전 장치/gamepad 지원·WCAG 전면 인증을 약속하지 않음 |
| <a id="s5c-r12"></a> **S5C-R12 반응성·부하**: local input-to-feedback과 authoritative end-to-end 반응을 따로 관측한다. FPS·DB 왕복·prediction frame만으로 원격 권위 p95 목표를 충족했다고 쓰지 않는다. render/input 부하·queue·지연 편차·복귀를 실제 조건과 함께 기록한다 | 선택 모델/backend의 측정, game-local 조작성, 공통 품질 gate | 승인 총100/판8·원격 p95≤250ms·정상망 각 복구≤5초·모바일5기능 유지. 새 tick/FPS/p99/샘플 수 의무는 만들지 않음. 지원 단말/망·측정 구간/오차·표본은 구현/실행 전에 구체화 |
| <a id="s5c-r13"></a> **S5C-R13 검증·완료 주장**: 기능 수렴·권한·수명·조작성·가독성·반응성·수동 polish는 서로 다른 증거로 확인한다. 미지원·미실행을 별도 표시하고 선택된 기능에만 지원 주장을 붙인다 | 모델/게임 검증 owner + 공통 release/manual gate | unit/model·실제 두 client·브라우저/모바일·수동 플레이·운영 검증을 해당 조건에 연결. 기존 invalidation 테스트나 이 규칙 문서만으로 공간형 품질/지원 PASS 선언 금지 |

## RT4 네 문서 추가 질문

**A 재사용:** 조사→네 문서→작은 구현→기능/모델 검증→실제 브라우저 디자인 검토→기록/closeout의 공통 절차와 권위는 B01/B04/B05를 따른다. 아래는 추가로 기록할 내용이며 공통 흐름의 두 번째 본문을 만드는 것이 아니다.

| 문서 | J 첫 Probe에서 보완할 내용 | 다른 owner를 복제하지 않을 경계 |
|---|---|---|
| GAME_SPEC | 실제 협동 목표/행동/실패/종료, 적용 공통·장르·모델과 버전/근거, 7축·Capability, 지속 intent/취소 의미, 시간·권위/복구·역할, start/rematch/결과 유무, 선택·미지원·미결정 | 모델의 인가/수명 본문은 링크. UI 수치/장식 이력과 live TODO를 소유하지 않음 |
| DEVELOPMENT | 위 선택의 작은 구현 단계, 실제 branch/작업·기능/모델/실행 증거, 미실행 사유, 다음 기능 작업 | 기능 규칙/장르 계약/디자인 최종 결정을 독자 확정하지 않음 |
| UI_DESIGN | 최초 조사·권리/VI·공간/camera/HUD·조작 발견·포커스/중단/복귀·잠정/확정 피드백·responsive·규칙 안내·초기 validation baseline | 보드 중앙/카드 배치를 무조건 재사용하지 않음. 아직 선택하지 않은 renderer/physics를 장르명이 확정하지 않음 |
| UI_DECISIONS | 개발 시작 후 조작성·camera·피드백·모바일·브라우저 관찰로 바뀐 의미 있는 결정, 이유/대안/검증·최신 유효 override | 최초 baseline 보존. 모든 CSS 수치·수동 요청 횟수·기능 TODO 복제 금지 |

**J 보드에서 이어받는 것:** 조사 충실도, 출처·권리, 설명 가능한 VI/상태, baseline/후속 결정, 수동 플레이 검토. **채택하지 않는 보드 전제:** 턴 단위 input만 존재, 중앙/개인 보드·카드 배치 필수, 인원 ready가 모든 초기 시작의 전제, 모든 권위 상태가 DB integer version, 모든 결과가 승자/점수. 이 비채택은 기존 보드 의무 삭제가 아니라 해당 경험의 적용 조건 구분이다. multiplayer 재대결과 온라인 안전성은 [MO/승인 Target §4](game-platform-model-contracts.md)의 별도 조건을 그대로 따른다.

## RT5 검증·완료 조건

**J 설계 문서의 준비 기준:** 범위·owner·조건·원문 연결과 R01~13의 실제 제품 결정 위치가 명확하고, 현재 상위 계약과 충돌하는 선택을 숨기지 않으며, 검증 oracle/미지원/미선택이 구별되어야 한다. 이 기준 충족은 실제 Probe 실행의 완료가 아니다.

| 검증 묶음 | 필수 연결 / 실제 완료에서 확인할 것 | 현재 |
|---|---|---|
| 입력·공간·시간 | R01~05: 취소 후 잔존 intent, viewport/camera 변화, 긴 frame 공백·hidden 복귀, local/권위 반응을 실제 지원 기기에서 확인 | NOT_RUN |
| 권한·정보·복구 | 안전11·A/C/P·현재 view·initial/live/gap/quiet loss·known expiry/인지 실패·최초60초·terminal을 해당 모델 oracle로 확인 | NOT_RUN |
| 전체 수명 | STEP4A T01 같은 Room 새 Match, T02 A→B→A, T03 role/view/user 변경과 모든 완료 경로. Room 없는 Probe는 의미 없는 Room을 만들지 않고 실행/run/view/자원 전환에 같은 의무를 대입 | NOT_RUN |
| 결과·표현 소비 | 공식 결과/정정·producer/consumer·선택된 통계/보상/효과의 각 중복 범위 확인. 결과 없음이면 가짜 결과 없는 정상 종료 확인 | NOT_RUN |
| 성능·모바일 | 총100/판8·원격 p95≤250ms·정상망 각 복구≤5초와 모바일5기능(**이동·상호작용·준비·종료·재접속**, STEP4B T13)의 기존 적용 범위 확인. 미선택 기능으로 목표 범위/기존 승인 조건을 임의 삭제하지 않음 | NOT_RUN; 실제 기기/망·표본·오차 U |
| 디자인·접근성 | 실제 브라우저 플레이로 R03/10/11 및 안내/종료/반응형·overlay를 검토하고 안정화된 변경을 UI_DECISIONS에 기록 | NOT_RUN |
| 운영·공존 | D0006~10의 기록/삭제/탈퇴/backup·복원·비용/운영 조건, 기존 Auth/게임·공용 본체의 회귀 | NOT_RUN / UNKNOWN |

각 Probe가 검증할 실제 모바일 기능과 준비/재접속의 해당 모델 의미, 공통 모듈의 모바일 의무, 실제 지원 주장 범위를 명시한다. Room이 없는 Probe에 가짜 로비를 만들지는 않지만 적용 제품 의무를 Capability라는 이름으로 선택 해제할 수는 없다. STEP4B의 기본 시험 범위 D0005(Windows10/11 Chrome·Edge, iPhone Safari)는 재사용하며 정확한 build/기기 사양 미확인도 유지한다. 기존 제안 표본을 승인 수치로 승격하지 않는다.

실제 Probe의 완료는 적용된 계약/기능 시험, 다중 client·지원 모바일 조작과 복구, 성능 조건, 수동 디자인 gate, 미지원 설명, 해당 운영/공개 게이트의 증거를 갖춰야 한다. 문서의 ‘가능’, 코드 존재, unit PASS, 두 client PASS, 운영 활성화는 각각 분리한다.

## RT6 권위·확장

**J:** 이 규칙 문서의 topic-owner는 실시간 협동·공간 경험 규칙 책임이다. 공통 의무는 공통 owner, 권위/시간/복구는 선택 모델, 실제 제품 규칙·VI는 game-local owner가 유지한다. 적용 계약은 GP-GENRE-REALTIME-COOP/1이며 신규 vNext의 해당 경험 scope에 한정된다. 현재 STEP7A3 정식 결과의 최종 검토는 REVIEW_PENDING이다. 문서 권위와 실제 runtime 지원을 구별한다.

정식 설계에는 적용 공통/모델의 버전·고정 출처, 변경 이유, 기존 규칙과의 분할/참조, 적용 대상, 상위 충돌 여부, 재검증 범위를 기록한다. 상위 인덱스가 발견할 수 있도록 연결하고 GAME_SPEC에서 선택 근거를 남긴다. 실제 파일·버전/경로·Guard와 권위 전환은 STEP6/7의 산출물이다. 새 장르 경험만의 변화가 기존 수명/안전성 보장을 약화할 수 없다.

### 실제 owner와 보존 계약

권위/시간/복구 모델과 전체수명 계약은 MO/LI를 단일본문으로 참조한다. [MO3](game-platform-model-contracts.md)의 안전11·current A/C/P·known expiry 뒤 새 A 금지·동일 transaction late C 제한/실제 C 관측·새 P/retry fresh 인가·owner anchor·최초60초/terminal·D0010 부분 대체, [MO6](game-platform-model-contracts.md)의 D0006~10 성능/비용/기록/삭제/탈퇴/backup/복원·운영UNKNOWN은 그대로다. R 표의 관측 상황이 이 공통 보장을 대신하지 않는다.

[CA](game-platform-capability-contracts.md)의 단일metadata·Snapshot/Reconnect 선택모델 단일최종채택/복구·Shell공통/game-local 연출, BGM기존본체+내부최소수명/H1무보완연결보류·Inviteidentity/사이트handler/dialog H2~4, 공식결과/정정/producer-consumer·여섯중복/공개분리/Profile recipe를 참조한다. 그 보완을 장르 Adapter 안의 새 권한/순서/수명/token/audio 엔진으로 숨기지 않는다.

[CO](game-platform-common-rules.md)의 네문서baseline/유효override/manualgate와 [LI](game-platform-lifetime-contract.md)의 success/error/null/finally/cleanup/leave/effect/후속완료·late자원/부분실패/재진입/반복dispose·T01~03을 유지한다. 모든게임 Room/host/DOM/winner/score/XP 강제나 multiplayer재대결 no-op/local/N/A 우회는 허용하지 않는다. host불성립 재대결 예외는 승인되지 않았으며 해당 조합의 상위 변경 게이트를 따른다.

### 둘째 Probe·혼합 장르·신규 장르 발견

둘째 Probe는 [승인 §6](game-platform-rebuild/artifacts/step-5c-genre-model-connections.md#6-둘째-probe의-별도-규칙-필요성과-선택-조건)의 기반경험+실제local/비동기/기록조건이 기본이다. roomless/hostless 자체를 독립 장르/새 Core의 근거로 삼지 않는다. 새 경험 요구가 기존 규칙/모델조건으로 설명되지 않을 때 그 부분의 보완/신설을 검토한다. 실제 제품/Probe 게임·보상/통계/leaderboard·비roomInvite/정밀audio/Profile를 선제 선택하지 않고 미래 미선택을 전체 blocker로 올리지 않는다.

혼합장르는 [승인 §7.2](game-platform-rebuild/artifacts/step-5c-genre-model-connections.md#72-혼합-장르의-충돌-처리)와 AR4를 참조해 mode/phase/행동/역할별 경험·모델과 전환책임을 기록한다. 같은 상태의 권위/순서/종료가 충돌하면 단순 합집합/더엄격한쪽으로 해결하지 않고 해당 선택을 GV Architecture Change로 반환한다. 두 화면의 표현이 공식결과 producer 둘을 만들지 않는다.

신규 장르의 [승인 §7.3 절차](game-platform-rebuild/artifacts/step-5c-genre-model-connections.md#73-신규-장르-추가-절차)는 범위/권리 조사→기존경험/7축·모델 적합성/차이→필요한최소6항목→해당충돌검토→인덱스/네문서연결→허용된작은구현/검증·수동gate를 잇는다. 절차/권위 본문은 CO/GV와 해당 승인 owner를 참조하고 장르마다 독립 복제하지 않는다. 실제 승인 의미 변경은 원문/R-ID/줄/f·owner·빠진의미·consumer영향을 특정해 사용자 게이트로 반환한다.

관련 원문 ID/f의 단일목적지는 [STEP6 전수표](game-platform-rebuild/artifacts/step-6-clause-destinations.md)와 [STEP7A3 대응](game-platform-rebuild/artifacts/step-7a3-clause-correspondence.md)에서 확인한다. 원3232/305부모·16행58명시분할/원강도·부정/조건/예외/f0/명시f·L/H/I비승격을 유지한다. 49/B01~12를 전수완료표로 쓰지 않는다. R01~13은 승인된 새 경험 요구이며 기존3232 ID를 새로 RT로 재분류한 결과가 아니다.

[BO](game-platform-board-rules.md)와 기존 source/승인artifact는 유효하게 발견된다. full nestedshared/serverroot/import/배포제외/test발견/oracle/exports는7B, Core/모델·Adapter·본체 보완/실제지원/운영은 후속이다. 이번 문서로 실제게임/transport/renderer/tick/physics/prediction/API/schema를 선택하지 않는다.
