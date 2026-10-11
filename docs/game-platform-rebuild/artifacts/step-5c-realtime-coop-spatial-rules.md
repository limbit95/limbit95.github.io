# STEP5C — 첫 비보드 실시간 협동·공간형 규칙 내용

- 상태: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-11 21:13:17 KST 사용자 메시지로 Astra §9.1 여섯 묶음 전체를 본문의 조건·제한·미확인까지 승인하고 정식 문서 반영·검증·integration base PR 제출을 명시적으로 허용했다. STEP5C **REVIEW_PENDING**, 사용자 정식 결과 최종 검토는 남아 있다.
- 판단 원문: [Astra](game-platform-vnext-step5c-astra-judgment.md), 사실 입력: [Sol 근거](game-platform-vnext-step5c-evidence.md), 계획: [계획/인계](game-platform-vnext-step5c-plan-and-handoff.md). 승인 판단을 Sol/Codex가 다시 수행하지 않았다.
- 아래 원문 절은 내용·절번호를 그대로 반영한다. 원문의 PROPOSED·승인 대기/전·NOT_STARTED·직접 읽기·다음 첫 작업은 Astra 작성 당시 상태/행위다. 현재 승인·제출 상태는 이 헤더, [CURRENT](../CURRENT.md), [CP0085](../checkpoints/CP-0085-step-5c-formal-submitted.md), [문서 검증](step-5c-validation.md)을 따른다. 원문의 적용 조건·예외·강도·보류·미확인은 유지한다. J는 지금 승인된 판단이며 새 현재 rulebook 적용 완료를 뜻하지 않는다.
- 고정 판단/착수 SHA `2751e9241a3debbd40506fa1b2ea7e688dfe0140`; STEP5B **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED**. 행동 **NOT_RUN**, 기존 **UNKNOWN**·구현/실행/오픈 의무 유지. 기존 Auth/게임 무이관.
- 정식 대응: [§2~4 보드 계승·조건표](step-5c-board-rule-succession.md), [§5 비보드 최소6항목/R01~13](step-5c-realtime-coop-spatial-rules.md), [§6~8 둘째 Probe·연결/추가·보존/의무](step-5c-genre-model-connections.md), [§1/9/10 입력·승인·trace](step-5c-source-trace.md). 각 의미는 해당 절의 단일 본문을 참조한다. 원본 §11의 실행 프롬프트/게이트는 원본에 보존하며 재실행하지 않는다.
- STEP2 49조항/B01~12는 전수 계승 완료가 아니다. STEP6/7의 전수 목적지·권위 전환 의무, Target/API/schema/file/class/코드경로 미동결 유지. PR 제출은 단계 완료·병합·main·STEP6 허용이 아니다.

## 5. 첫 비보드 Probe — 실시간 협동·공간형 규칙 내용 초안

이 절은 실제 규칙 내용이다. **A에서 계승한 의무와 J에서 추가 제안한 경험 기준을 구분**한다. S5C-R의 규정형 문장은 핵심 판단 승인 후 정식 설계에 반영할 제안이며 현재 rulebook의 즉시 변경은 아니다.

### 5.1 범위와 출처 — 최소항목 1

**A 범위:** 첫 Probe의 작은 실시간 2D 온라인 협동 수직 Slice. 지속적인 공간 이동/행동과 동시 참가가 있을 수 있으며 준비·결과·종료는 이벤트성 전이로 연결할 수 있다. 실제 게임·세계 구조·목표·camera·transport·renderer·tick/physics/network 주기·prediction 채택을 여기서 정하지 않는다.

**J 적용 범위:** 지속 입력과 공간 상태가 플레이 판단에 영향을 주는 제한 실시간 협동 경험에 이 규칙을 적용한다. 단지 2D로 그리거나 온라인이라는 이유만으로 적용하지 않는다. 경쟁 대전·전용 물리·정밀 리듬·3D·대규모 장기 세계는 이 초안의 지원 범위로 선언하지 않는다. 추후 필요 시 기반 규칙과 차이를 조사한다. 이 범위 제한은 다른 장르의 개발을 금지하는 정책이 아니다.

출처는 계획 §3/STEP5C, STEP2 7축, S3-C02/C08/C09/C10 및 전환, 승인 STEP4A/B·5A/B, 근거 N01~13과 B01~12다. E01~03은 Sol이 2026-10-10에 확인한 제한 웹플랫폼 사실을 재사용한다. 실제 제품 사례·권리·입력장치 선정은 개별 Probe 조사로 남긴다.

| 제한 공식 근거 | 재사용하는 사실 | 이 초안의 J 연결과 한계 |
|---|---|---|
| E01 [W3C Keyboard 설명](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | 기능 키보드 조작과 본질적인 경로 의존 입력 예외의 구분 | S5C-R11의 기능별 조작 검토. informative 설명을 WCAG 전면 채택·준수 인증으로 확대하지 않음 |
| E02 [Pointer Events Level3](https://www.w3.org/TR/2026/REC-pointerevents3-20260630/) §4.1.3.3/4.2.7/4.1.4 | pointer stream 취소/억제와 경계 사건 가능 | S5C-R02의 취소·좌표/기기 전환 검토. pointer capture라는 기법이나 브라우저 지원을 확정하지 않음 |
| E03 [HTML 렌더 갱신](https://html.spec.whatwg.org/multipage/webappapis.html#update-the-rendering)·[animation callbacks](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames) | hidden/렌더 기회와 render callback 처리의 구별 | S5C-R04/05의 시계 분리·복귀 검토. 모든 timer/서버가 멈춘다는 주장이나 정확한 브라우저 재개 보장 아님 |

이번에 외부 자료를 새로 조사하지 않았다. 과거 X01~07 등은 근거 §4.2에 명시된 확인 시점·판본/commit 한계를 유지하며 새 제품·공급자·요금·운영 권고로 쓰지 않는다.

### 5.2 플랫폼 연결 — 최소항목 2

**A 공통 재사용:** Registry 단일 metadata, site Access/기존 Auth, 실행·viewer 수명, 네 문서·수동 gate, 선택 모델의 권위/인가/복구, STEP5A/B의 공통 기능 본체를 참조한다. 장르 전용 Core·Auth·초대·BGM·결과 집계 엔진을 새로 정의하지 않는다.

**J 선택 기록:** GAME_SPEC는 STEP2의 7축 — 흐름, 갱신/시간 특성, 세션 수명, 참여/역할, 권위·동기화·복구, 공간·입력·렌더링, 결과·지속성 — 을 기존 선택표 의미로 기록하고 필요한 Capability를 별도 선택한다. 세부 기능은 **사용 / 비적용(이유) / 미선택·미결정 / 미지원**을 구별한다. 문서 존재·모델 선택·구현 증거·실행 지원은 별도 상태다.

| 연결 주제 | owner / 참조 | 금지 조합·적용 조건 |
|---|---|---|
| 실행·시간·공간 | 선택 모델의 진행/입력/공간 의미; game-local의 조작·세계·카메라 | 장르명만으로 고정 Hz·DOM/Canvas·physics·prediction 채택 금지 |
| 권위·송수신·복구 | STEP4B 승인 모델/backend, STEP5A Snapshot/Reconnect 단일 최종 채택·복구 | relay를 판정 권위로 오해하거나 예측 상태를 공식 결과로 소비하지 않음. DB·stream은 §4.1 조건 |
| 세션·진입·재대결 | 선택 세션 모델, site 인가, §4.2 | roomless를 무권한 허가로 해석 금지. 현 adapter의 무의미한 8 surface 금지 |
| Shell·게임 UI | 공통 표시 부품 vs game-local 공간·HUD·결과 연출 | 공통 Shell이 모든 게임 레이아웃/renderer를 소유하지 않음 |
| Invite·BGM·표현/결과 | STEP5A H1~4·STEP5B producer/consumer와 효과 owner | 미선택 기능 강제·무보완 연결 지원 인증·Adapter 내부 새 본체 금지 |

### 5.3 독립 장르 요구 — 최소항목 3

다음 표의 관측 기준은 후속 시험에서 확인할 oracle이며 이번 실행 결과가 아니다. R01~13은 근거 N01~13을 단순 재진술한 질문 목록이 아니라 **채택을 제안하는 최소 행동/기록 규칙**이다.

| 규칙 ID / J 내용 | owner·조건 | 후속 관측 / 미선택·미지원 |
|---|---|---|
| **S5C-R01 지속 협동 흐름**: GAME_SPEC는 행동의 시작·유지·중단·해결, 동시 행동의 충돌/협동 기여, 플레이 가능/대기/종결을 구분한다. 턴 대기를 대신 붙이지 않는다. 플레이어가 현재 가능한 행동과 협동 진행의 원인을 이해할 수 있게 표현한다 | game-local 규칙·상태; 전이의 권위/순서는 선택 모델. 지속 진행이 실제 없는 부분은 이벤트 전이로 설명 | 동시 입력/같은 대상 경합/참가자 이탈 때 상태와 표현이 정의한 규칙으로 설명되는지 확인. 실제 목표·실패 조건 미선택 |
| **S5C-R02 입력 시작·해제·취소**: 연속 intent의 owner와 유효 범위를 정한다. cancel/blur/입력원 교체/역할 상실 등으로 유효성을 잃은 눌림·방향·drag는 이후 입력의 근거로 자동 유지하거나 복귀 때 재생하지 않는다. 다시 활성화는 현재 맥락과 새 유효 입력을 근거로 한다 | game-local 조작 의미 + 선택 입력 모델; 현재 권한은 backend. 실제 장치에 존재하는 cancel 신호만 연결하고 단발·지속·조합 입력을 구별 | down 후 up 없이 cancel, 포커스 상실, 입력원 변경 뒤 stuck movement/중복 행동 없음. 이미 권위적으로 수용된 행동을 client cancel로 rollback했다고 표시하지 않음. cancel 전달/손실 시 원격 intent 종료의 관측 가능 의미는 구현 전 해당 모델이 정의; 임의 timeout 수치 미동결 |
| **S5C-R03 공간·카메라·좌표**: 플레이어가 조작 대상·위치·경계·중요 상호작용을 식별할 수 있게 한다. viewport/camera/확대/방향 변화 후 입력의 화면 좌표와 게임 공간 해석을 다시 맞추며, 옛 좌표 해석을 새 공간에 적용하지 않는다 | game-local 세계·카메라 정책; 선택 공간/입력 모델. 고정 camera·격자/연속·충돌·physics 유무는 실제 선택 | 작은 화면·크기/방향 전환·가림·화면 경계에서 목표와 action이 유지되는지 확인. camera가 없거나 물리가 없으면 이유 기록; 억지 camera/physics 추가 없음 |
| **S5C-R04 시간의 분리**: render/FPS, input sampling, simulation, physics(사용 시), network, audio 시간을 구별한다. 화면 frame 수/브라우저 timer 횟수를 경기 권위 시간·순서·서버 마감과 등치하지 않는다. 큰 시간 공백의 처리 의미를 선택 모델에 기록한다 | 시간/진행 모델; game-local 행동 시간 요구. 승인 권위 구조를 참조 | frame 저하/긴 공백에서 잘못된 진행·명령 폭주·권위 순서 역전이 없는지 확인. catch-up/폐기/보간 방식·수치·tick은 미선택이며 이 초안이 고정하지 않음 |
| **S5C-R05 비가시·복귀**: 비가시/포커스 상실과 게임의 pause/종료를 구별한다. local의 더 이상 유효하지 않은 지속 intent는 R02로 해소한다. 복귀 시 현재 실행/역할·권한·authorized state와 갱신 연결의 준비를 확인한 뒤 보호 입력을 재개한다. 옛 buffered intent나 빠진 frame을 무조건 몰아서 실행하지 않는다 | view/input owner + 단일 복구 모델. browser 신호 자체는 서버 경기 pause/종결 명령이 아님 | 숨김 중 진행·권한 철회·terminal·재연결 뒤 fresh view만 사용하고 terminal을 LIVE로 되살리지 않음. 단순 visibility 변화가 항상 rejoin/전체 snapshot을 요구한다는 구현은 미선택; 현재성 입증이 불가능하면 복구/차단 |
| **S5C-R06 가시성·역할**: 공간에 그려지는 정보와 전달 가능한 정보를 구분한다. camera 가림·CSS 숨김·화면 밖 entity는 서버 projection/recipient 권한의 대체물이 아니다. 역할/view 교체 때 이전 private 정보·입력 활성·effect를 새 viewer에 자동 이어 붙이지 않는다 | backend의 authorized view·전달 + viewer 수명; game-local 표현 | participant↔spectator·동일 user 다른 role·새 user·중도 참가를 선택했다면 그 전환에서 정보/입력 격리. 관전/중도 참가/팀 private는 미선택 가능; private 없음도 비노출 검증 |
| **S5C-R07 시작·종료·재참여**: UI 준비, 서버 start 허가, 실제 진행, terminal, local detach를 별도로 설명한다. 종료 영향 범위와 확인·안전 이탈·다시 진입을 제공하며, 적용 multiplayer 재대결은 §4.2를 따른다 | game-local 제품 lifecycle + 세션/권위 모델; 안내/확인 UX는 공통 참조 | 동시 start/leave/종료, 종료 후 복귀, 같은 맥락 새 match에 이전 결과 불채택. 지속 세션이면 안전 종료 경로. winner/score/result 없음 허용; 실제 종료/결과 정책 미선택 |
| **S5C-R08 복구와 입력 준비**: 연결 성공만으로 플레이 가능을 표시하지 않는다. authorized current checkpoint/state와 이후 갱신의 일관성·gap/quiet loss 처리·현재 owner/view를 단일 모델이 판정하고, 실패/복구 중/terminal을 실제 상태대로 보인다 | STEP4B J02~05와 STEP5A 단일 최종 채택·복구 owner | initial/live 경합·마지막 이벤트 유실·tail gap/overflow·끊김/복귀에서 최신 상태/입력 허용 일치. history replay와 현재 상태 복구를 분리. 장기 history 보존은 요구 시만 |
| **S5C-R09 전체 수명**: 입력·camera/renderer·timer·listener·effect·늦게 얻은 자원에 STEP4A 전체 완료 계약을 적용한다. 반영 대상/맥락/권한/모델 순서/반영 시점이 맞는 결과만 채택하고 자기 owner 자원만 정리한다 | Core 공통 수명, 선택 모델의 맥락, 실제 자원 owner. 게임은 site 공용 자원의 자기 사용권만 반납 | success/error/null/finally/cleanup/leave/effect·후속 작업, 부분 초기화 실패·재진입·반복 dispose·dispose 뒤 자원 획득을 관측. 취소 요청과 실제 중단/채택 무효화/정리를 분리. T01~03 모두 유지 |
| **S5C-R10 잠정 피드백·공식 결과**: 즉각 반응이나 선택한 prediction은 잠정임을 의미상 구분하고 권위 상태와 조정 가능해야 한다. 공식 결과·개인 outcome·viewer 연출은 STEP5B 경계로 연결한다. 재시뮬레이션/재조회/재렌더가 새 보상·집계·SFX 발행 근거가 되지 않는다 | 선택 모델 + game-local presentation, 공식 producer 및 각 consumer | 거부/보정·snapshot 반복·ACK 유실·정정에서 확정 결과/효과 중복 없음. prediction 사용 여부 미선택, 보정 시각 방식 미동결. 이미 재생한 SFX를 rollback으로 취소했다고 주장하지 않음 |
| **S5C-R11 조작 발견·접근성**: 메뉴·시작/종료·규칙 보기·복귀 안내처럼 본질적 경로 의존이 없는 기능은 키보드로 도달/실행하고 포커스와 상태를 알 수 있게 설계한다. gameplay는 본질적 조작 요구와 제공 대체 입력을 기능별로 명시한다. 색/소리/hover 하나에만 핵심 상태나 action 발견을 맡기지 않도록 검토한다 | J 장르 품질 보완 + 공통 UI/수동 gate; game-local 조작/정보 설계 | 키보드·실제 제공 터치/포인터·포커스 이동·비가시 복귀·음소거에서 핵심 안내/종료 경로 확인. 실시간이라는 이유만으로 모든 gameplay를 예외 처리하지 않음. 전 장치/gamepad 지원·WCAG 전면 인증을 약속하지 않음 |
| **S5C-R12 반응성·부하**: local input-to-feedback과 authoritative end-to-end 반응을 따로 관측한다. FPS·DB 왕복·prediction frame만으로 원격 권위 p95 목표를 충족했다고 쓰지 않는다. render/input 부하·queue·지연 편차·복귀를 실제 조건과 함께 기록한다 | 선택 모델/backend의 측정, game-local 조작성, 공통 품질 gate | 승인 총100/판8·원격 p95≤250ms·정상망 각 복구≤5초·모바일5기능 유지. 새 tick/FPS/p99/샘플 수 의무는 만들지 않음. 지원 단말/망·측정 구간/오차·표본은 구현/실행 전에 구체화 |
| **S5C-R13 검증·완료 주장**: 기능 수렴·권한·수명·조작성·가독성·반응성·수동 polish는 서로 다른 증거로 확인한다. 미지원·미실행을 별도 표시하고 선택된 기능에만 지원 주장을 붙인다 | 모델/게임 검증 owner + 공통 release/manual gate | unit/model·실제 두 client·브라우저/모바일·수동 플레이·운영 검증을 해당 조건에 연결. 기존 invalidation 테스트나 이 초안만으로 공간형 품질/지원 PASS 선언 금지 |

### 5.4 개발과 네 문서 보완 — 최소항목 4

**A 재사용:** 조사→네 문서→작은 구현→기능/모델 검증→실제 브라우저 디자인 검토→기록/closeout의 공통 절차와 권위는 B01/B04/B05를 따른다. 아래는 추가로 기록할 내용이며 공통 흐름의 두 번째 본문을 만드는 것이 아니다.

| 문서 | J 첫 Probe에서 보완할 내용 | 다른 owner를 복제하지 않을 경계 |
|---|---|---|
| GAME_SPEC | 실제 협동 목표/행동/실패/종료, 적용 공통·장르·모델과 버전/근거, 7축·Capability, 지속 intent/취소 의미, 시간·권위/복구·역할, start/rematch/결과 유무, 선택·미지원·미결정 | 모델의 인가/수명 본문은 링크. UI 수치/장식 이력과 live TODO를 소유하지 않음 |
| DEVELOPMENT | 위 선택의 작은 구현 단계, 실제 branch/작업·기능/모델/실행 증거, 미실행 사유, 다음 기능 작업 | 기능 규칙/장르 계약/디자인 최종 결정을 독자 확정하지 않음 |
| UI_DESIGN | 최초 조사·권리/VI·공간/camera/HUD·조작 발견·포커스/중단/복귀·잠정/확정 피드백·responsive·규칙 안내·초기 validation baseline | 보드 중앙/카드 배치를 무조건 재사용하지 않음. 아직 선택하지 않은 renderer/physics를 장르명이 확정하지 않음 |
| UI_DECISIONS | 개발 시작 후 조작성·camera·피드백·모바일·브라우저 관찰로 바뀐 의미 있는 결정, 이유/대안/검증·최신 유효 override | 최초 baseline 보존. 모든 CSS 수치·수동 요청 횟수·기능 TODO 복제 금지 |

**J 보드에서 이어받는 것:** 조사 충실도, 출처·권리, 설명 가능한 VI/상태, baseline/후속 결정, 수동 플레이 검토. **채택하지 않는 보드 전제:** 턴 단위 input만 존재, 중앙/개인 보드·카드 배치 필수, 인원 ready가 모든 초기 시작의 전제, 모든 권위 상태가 DB integer version, 모든 결과가 승자/점수. 이 비채택은 기존 보드 의무 삭제가 아니라 해당 경험의 적용 조건 구분이다. multiplayer 재대결과 온라인 안전성은 §4의 별도 조건을 그대로 따른다.

### 5.5 검증과 완료 기준 — 최소항목 5

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

### 5.6 권위와 이력 — 최소항목 6

**J:** 이 초안의 topic-owner는 실시간 협동·공간 경험 규칙 책임이다. 공통 의무는 공통 owner, 권위/시간/복구는 선택 모델, 실제 제품 규칙·VI는 game-local owner가 유지한다. 현재 상태는 PROPOSED이며 승인 전 정식 rulebook으로 링크해 적용하지 않는다.

정식 설계에는 적용 공통/모델의 버전·고정 출처, 변경 이유, 기존 규칙과의 분할/참조, 적용 대상, 상위 충돌 여부, 재검증 범위를 기록한다. 상위 인덱스가 발견할 수 있도록 연결하고 GAME_SPEC에서 선택 근거를 남긴다. 실제 파일·버전/경로·Guard와 권위 전환은 STEP6/7의 산출물이다. 새 장르 경험만의 변화가 기존 수명/안전성 보장을 약화할 수 없다.

