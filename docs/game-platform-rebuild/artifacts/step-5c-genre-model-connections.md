# STEP5C — 둘째 Probe·공통/장르/모델 연결과 추가 절차

- 상태: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-11 21:13:17 KST 사용자 메시지로 Astra §9.1 여섯 묶음 전체를 본문의 조건·제한·미확인까지 승인하고 정식 문서 반영·검증·integration base PR 제출을 명시적으로 허용했다. STEP5C **REVIEW_PENDING**, 사용자 정식 결과 최종 검토는 남아 있다.
- 판단 원문: [Astra](game-platform-vnext-step5c-astra-judgment.md), 사실 입력: [Sol 근거](game-platform-vnext-step5c-evidence.md), 계획: [계획/인계](game-platform-vnext-step5c-plan-and-handoff.md). 승인 판단을 Sol/Codex가 다시 수행하지 않았다.
- 아래 원문 절은 내용·절번호를 그대로 반영한다. 원문의 PROPOSED·승인 대기/전·NOT_STARTED·직접 읽기·다음 첫 작업은 Astra 작성 당시 상태/행위다. 현재 승인·제출 상태는 이 헤더, [CURRENT](../CURRENT.md), [CP0085](../checkpoints/CP-0085-step-5c-formal-submitted.md), [문서 검증](step-5c-validation.md)을 따른다. 원문의 적용 조건·예외·강도·보류·미확인은 유지한다. J는 지금 승인된 판단이며 새 현재 rulebook 적용 완료를 뜻하지 않는다.
- 고정 판단/착수 SHA `2751e9241a3debbd40506fa1b2ea7e688dfe0140`; STEP5B **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED**. 행동 **NOT_RUN**, 기존 **UNKNOWN**·구현/실행/오픈 의무 유지. 기존 Auth/게임 무이관.
- 정식 대응: [§2~4 보드 계승·조건표](step-5c-board-rule-succession.md), [§5 비보드 최소6항목/R01~13](step-5c-realtime-coop-spatial-rules.md), [§6~8 둘째 Probe·연결/추가·보존/의무](step-5c-genre-model-connections.md), [§1/9/10 입력·승인·trace](step-5c-source-trace.md). 각 의미는 해당 절의 단일 본문을 참조한다. 원본 §11의 실행 프롬프트/게이트는 원본에 보존하며 재실행하지 않는다.
- STEP2 49조항/B01~12는 전수 계승 완료가 아니다. STEP6/7의 전수 목적지·권위 전환 의무, Target/API/schema/file/class/코드경로 미동결 유지. PR 제출은 단계 완료·병합·main·STEP6 허용이 아니다.

## 6. 둘째 Probe의 별도 규칙 필요성과 선택 조건

**J 결론:** 현재 범위만으로 별도 ‘roomless 장르’ 문서를 필수화하지 않는다. **기반 경험 규칙 + 실제 local/비동기/지속성 모델의 조건 보완**을 기본 경로로 삼는다. 다만 해당 조합으로 설명되지 않는 새로운 플레이 경험 기준이 있으면 runtime 전에 보완 묶음 또는 독립 장르 문서를 작성·검토한다. 실제 Probe 게임은 이번에 선택하지 않는다.

| 실제 후속 선택 조건 | 기존 규칙+모델 조건으로 충분한 범위 | 새 경험 규칙/보완이 필요한 조건 |
|---|---|---|
| solo local, 결과 없는 run | 기반 퍼즐/보드/공간 등 경험 규칙 + 등록/접근·실행/자원 수명 + local 진행/재시작·종료 | 기존 경험 규칙에 없는 조작·공간/시간·목표/실패·접근성/완료 기준이 생길 때 그 부분 작성 |
| solo local, 단일 기록 | 위 범위 + 기록의 권위·저장/소실 한계·재진입/정정 의미 | 기록 자체가 제품 경험의 핵심이면 유효 run·중단 run·기록 비교/표시·실패 시 사용자가 이해할 기준 보완. 자동 leaderboard/통계/보상 선택 아님 |
| 보호 온라인 기록 제출 | 기반 경험 규칙 + 제출 인가/검증·중복·공식 결과/consumer·보존/삭제 모델 | local 계산을 서버가 신뢰할 근거, 실패/재시도/정정의 사용자 경험이 빠져 있으면 보완. 새로운 권위 의미가 필요하면 먼저 해당 설계 STEP |
| 비동기 또는 장기 진행 | 기존 보드 등 기반 규칙 + durable state·권위 마감·명령 순서/중복·현재 권한 복귀·참가 수명 | offline 참가자의 기다림/알림 필요, 마감·지연 명령의 게임상 효과, 이탈·재가입/포기, 장기 결과·진행 이해가 기존 규칙으로 표현되지 않을 때 별도 경험 보완 |
| 초기 hostless multiplayer | §4.2의 초기 조건 + 기존 재대결 정책 + 적합한 세션 모델 | hostless 자체로 새 장르 불필요. 새 협동/경쟁 흐름이 다를 때만 경험 규칙 추가 |
| 재대결 host 불성립/미정 | 일반 확장으로 자동 해결하지 않음 | §4.2의 상위 변경 필요/미확인 판정. 새 장르 문서를 만드는 것으로 승인 면제 불가 |

새 문서와 기존 문서 보완 중 선택은 **독립된 조사·검토·재사용이 필요한 의미 묶음인지**로 정한다. 작은 조건 차이는 기존 owner 절에 보완하고 인덱스에 조건을 연결한다. 별도 경험 묶음이면 계획 최소6항목을 갖춘 한 문서로 시작할 수 있다. 결과·Invite·Presence·history·통계·reward가 불필요하면 미선택 이유를 남긴다. 가짜 Room/host/ready/winner·공통 결과 schema를 만들지 않는다.

## 7. 공통·장르·모델 연결, 혼합 장르와 신규 추가 절차

### 7.1 한 의미 한 owner의 연결표

| 발견/적용 지점 | 소유 본문 | 남겨야 할 참조와 적용 근거 |
|---|---|---|
| AGENTS·상위 아키텍처·장르 인덱스 | 공통 진입/책임·탐색 순서 | 아키텍처→공통→해당 장르/모델→공통 모듈→개별 네 문서. 인덱스는 세부 규칙을 다시 정의하지 않음 |
| 조사·자산·네 문서·수동 gate | 공통 개발/디자인 품질 owner | 장르별 추가 조사·검증 항목은 해당 owner 참조와 차이만 |
| 판본/실물 정보공간 | 보드 경험 owner | 공통 권리·가독성/기록 및 실제 선택 모델 링크; game-local 해석/배치 |
| 지속 입력·공간 이해·복귀/피드백 경험 | §5 실시간 경험 owner | 공통 수명·선택 시간/입력/권위/복구 모델과 R별 제품 결정 |
| 권위·인가·중복·순서·상태 복구 | STEP4B 모델/backend owner | 장르의 검증 상황을 연결. genre별 독자 인가/복구 엔진 본문 금지 |
| Registry·Invite·BGM·결과/공개 소비 | 승인 STEP5A/B의 실제 owner | 선택 기능/조건/호환·수명 owner와 검증 링크. 두 번째 metadata/공통 본체 복제 금지 |
| 실제 제품 규칙·VI·지원 범위 | GAME_SPEC, UI_DESIGN+유효 UI_DECISIONS | 사용 계약·장르·모델 버전/선택 이유·비적용/미지원·적용 test. 독자 opt-out 아님 |
| 실제 기능 진행·증거 | DEVELOPMENT | 현재 Phase/branch·검증·미실행·다음 작업. 기준 문서 링크 |
| 상위 충돌·권위 전환·전파 | Governance/Architecture Change owner | 원문 조항/영향 대상/최소 변경·승인/검증·Guard 연결. 실제 적용은 허용 단계 |

### 7.2 혼합 장르의 충돌 처리

1. **적용 단위를 나눈다.** 게임 전체 이름보다 모드·phase·행동·역할에 필요한 경험 규칙과 모델을 기록한다. 예를 들어 보드 준비 화면과 공간 협동 플레이는 각각 필요한 경험 규칙을 적용할 수 있다.
2. **같은 의미는 합치지 말고 단일 참조로 모은다.** 네 문서·권리·안전 종료·수명 같은 공통 의미는 공통 owner 한 곳을 사용한다. 두 장르의 화면 예시는 동시에 반드시 구현해야 할 두 의무가 아니다.
3. **조건 차이와 진짜 충돌을 구별한다.** 턴 단계와 지속 입력 단계가 분리되면 각 범위를 GAME_SPEC에 기록한다. 같은 상태의 권위/순서/종료를 두 계약이 서로 다르게 요구하면 단순 설정 합집합이나 ‘더 엄격한 쪽’ 선택으로 해결했다고 쓰지 않는다.
4. **경계별 owner가 양립 근거를 제시한다.** phase 전환·입력 비활성·view/자원·결과 소비가 어느 owner로 넘어가는지 설명하고 전환 검증을 연결한다. 계약 내부 조건으로 해결되면 해당 owner 보완 후 game-local에서 적용 근거를 참조한다.
5. **상위 의미 충돌은 해당 선택을 멈춘다.** 원문 ID·조건·불가능한 조합·최소 변경·기존 소비자 영향을 기록해 Architecture Change 합의를 받는다. 빈 adapter·fake Room·local 독자 권한으로 회피하지 않는다. 미선택 다른 기능까지 전체 blocker로 올리지 않는다.

예: 보드 phase의 확인 애니메이션과 실시간 phase의 즉각 잠정 피드백은 각각의 phase에서 표현할 수 있다. 양쪽 모두 공식 결과를 소비할 때는 하나의 STEP5B producer/consumer 의미를 따라야 하며 화면 표현 방식 두 개가 공식 결과 권위 두 개를 만들지는 않는다.

### 7.3 신규 장르 추가 절차

| 순서 | J 해야 할 일 | 산출/판정과 owner |
|---|---|---|
| 1 범위·조사 | 사용자 제품 범위, 플레이/입력/시간/공간/참여·규칙/디자인/권리 출처 조사. 확인 사실·판단·U 분리 | game-local 조사. 실제 권리 불명확 자산을 사용하지 않음 |
| 2 기존 규칙 적합성 | 장르 인덱스와 7축·선택 모델/Capability를 읽고 기존 경험 규칙으로 설명 가능한 부분과 남은 차이를 분리 | 기존 owner 참조 / 작은 보완 / 새 경험 묶음 중 하나를 이유와 함께 제안 |
| 3 최소 내용 작성 | 신규 묶음이면 범위/출처·플랫폼 연결·독립 요구·네 문서 보완·검증/완료·권위/이력 여섯 항목 작성. 조건부 비적용 이유 포함 | 장르 topic-owner가 경험 요구 소유. 모델 의미를 복사하지 않음 |
| 4 충돌/검토 | 공통 안전성·문서 품질·현재 모델/세션·기존 consumer와 충돌 검토. 위 §7.2와 기존 Governance 적용 | 기존 의미 안의 보완은 owner 정합화. 상위 의미 변경은 사용자/maintainer 명시 합의·Architecture Change |
| 5 연결·제품 결정 | 상위 인덱스에서 발견 가능하게 연결하고 GAME_SPEC에 적용 규칙/버전·선택/미지원 근거 기록. UI baseline 등 네 문서 bootstrap | gameplay/runtime 전에 해당 규칙 작성·검토와 네 문서 기준 충족 |
| 6 작은 구현·검증·수동 gate | 허용된 단계에서 실제 소비자에 필요한 최소 계약 구현, 모델·기능·권한/복구·조작·수명·성능·수동 리뷰·기록 | 구현/계약/실행 지원/운영 활성화를 따로 기록. 미선택 미래 기능 선제 구현 없음 |

새 장르는 별도 플랫폼을 만드는 허가가 아니다. 공통화는 Game-local→재사용 Model/Capability의 실제 필요·반복 근거로 판단하며 Core 편입은 필수성·안정성·낮은 결합을 별도로 검토한다. Profile은 검증된 반복 조합의 recipe이고 장르 상속 엔진·코드 승격 단계가 아니다.

## 8. 승인 계약 보존과 미확인의 분류

### 8.1 이 판단으로 바뀌지 않는 승인 경계

| 승인 경계 | A 재사용할 정확한 의미 |
|---|---|
| 기존 Auth·게임·네 문서 | 기존 Auth/게임 무이관, 기존 public API/SQL/Registry 설정·규칙·UI baseline·유효 override 보존. 실제 상위 변경 때 기존 게임 영향도는 수행하되 MIGRATION_REQUIRED이면 vNext 격리/버전 재설계 |
| STEP4A 전체 완료 | success/error/null/finally/cleanup/leave/effect·후속 작업 전부, 반영 직전 현재성·자기 자원 정리·늦은 자원·재진입·부분 실패·반복 dispose. T01 같은 Room 새 Match/T02 A→B→A/T03 role/view/user 유지. room ID/version만으로 안전 선언 금지 |
| CP0075/D0010 A/C/P | 현재 predicate/잠금 뒤 같은 finalizer transaction의 최종 인가·착수 A, **실제 commit C**, recipient/view/payload별 최종 송신 P 분리. BEGIN/queue/ingress는 A가 아님 |
| 알려진 만료와 늦은 C | known expiry 뒤 새 A 금지. 기한 내 적법한 A를 통과한 **동일 transaction**의 일반 저장 지연 late C만 제한 수용. 다른 명령·별도 transaction/retry/무기한 사전 permit으로 예외 상속 금지. C 관측점을 ACK/A로 바꾸지 않음 |
| 새 송신·retry·owner·terminal | 새 P는 fresh 인가, retry/새 transaction은 fresh A; duplicate 응답도 새 P. owner anchor와 old writer/old sender 보호 유지. 실패 인지 즉시 보호 차단·pause, 최초 t0+60초 정각 abort·retry/restart 초기화 금지·terminal 뒤 LIVE 재개 금지 |
| D0006~10 부분 대체 | D0007 외부 R 이후 차단 상한/최종 transport 인계, D0008 입증된 장시간 정지 한계, D0010 동일 transaction 일반 저장 지연 C 범위를 구분. 정지 예외를 일반 장애/임의 만료 유예로 확대 금지. 통제 가능한 내부 변경의 DB 순서 보호 유지 |
| 기존 수치/운영 | 총100/판8, 세금포함 월추가3만원, 원격 p95≤250ms, 정상망 각재연결≤5초, 모바일5기능, 기록열람·30일삭제·탈퇴 unlink·외부 backup/RPO24h/발견후24h/7일복구점·Free서울·기존 운영시간 조건. 미래 사용량/실청구/실제 달성 UNKNOWN, 공급자 재선정 없음 |
| Registry·Snapshot/Reconnect·Shell | 단일 metadata와 실행 구성 분리; Access/표시값은 backend 권한이 아님. 최종 상태 채택·복구는 선택 모델 내 단일 owner. Shell은 필요한 공통 표시, 실제 공간/HUD/결과 연출은 game-local |
| BGM H1 | 기존 사이트 BGM 본체 재사용+controller 내부 최신 의도/종료/작업 귀속 최소 수명 보완. wrapper 검사만으로 내부 늦은 Audio/DOM 부작용을 보호했다고 인증하지 않음. **H1 무보완 직결 사용 가능 판정 보류** |
| Invite H2~4 | 초대 전 구간 identity·target/admission·사이트 handler/dialog owner 유지. H2 등록/old disposer와 H3 내부 늦은 dialog 완료는 최소 보완/동등 격리·실제 증거 필요. H4 비room 미래 미선택은 전체 blocker 아님 |
| STEP5B 결과·정정 | 실행/경기 종료·공식 결과·참가자 outcome·관전자 표현 분리. producer의 확정/정정과 consumer의 반영·중복/재시도 분리. 정정은 대체 전후 관계이며 새 경기로 중복 집계하지 않음. commit 미상은 새 ID 무조건 재발행 근거 아님 |
| STEP5B 여섯 중복 의미 | action retry; simulation replay/rollback; current snapshot 재적용; UI effect/SFX; 통계/기록/보상 소비; publication 소비. 각 owner/동일성은 승인 STEP5B §4.2 단일 본문 참조. 하나의 version/done flag나 여섯 새 엔진으로 대체하지 않음 |
| 공개·Profile·미래 기능 | merge/기능 구현/activation/공개 사실/NEW·공지 소비 분리. Profile은 검증된 반복 조합 recipe. 미래 보상·정밀 audio·publication/Profile 엔진·비room Invite를 선제 구현하거나 전체 설계 blocker로 삼지 않음 |

### 8.2 설계 blocker, 후속 구체화와 실행 의무

**J 판단:** 현재 확보한 근거와 위 조건 분리로 §3~7의 논리 계승·첫 비보드 내용·둘째 Probe 조건부 필요성 판단안을 제출할 수 있다. 이 범위에 대해 미해결된 전체 설계 blocker는 발견하지 않았다. 이는 사용자 승인이나 정식 결과 PASS가 아니다. 아래 선택별 제한을 모두 함께 유지한다.

| 종류 | 항목 | 처리와 해소 책임 |
|---|---|---|
| 실제 선택 시 설계 blocker | host 자체가 불성립하는 multiplayer 재대결을 기존 의무 대신 채택 | 해당 제품/모델의 상위 변경안과 명시 승인 필요. 현재 미선택이며 두 Probe 승인 범위 재개방 안 함 |
| 실제 선택 시 설계 blocker | 새 인가·권위/순서·수명 의미, 동등 안전11로 설명되지 않는 모델 또는 상위 보장 완화 | 관련 설계 STEP/Astra·사용자 검토. Adapter/local에서 숨겨 구현 금지 |
| 문서 권위 전환 의무 | 실제 DB/장르/모델 적용 범위·전수 destination·CURRENT/Guard/진입 링크 | STEP6/7에서 정식 전환. 이번 하위 초안으로 우회 불가. 지금 설계 연결 자체를 막는 공백은 아님 |
| 제품/모델 구체화 의무 | 실제 게임·목표/종료·입력장치·camera·공간/물리·시간 공백/remote intent 취소·세션/재대결·결과/지속성 선택 | 허용된 Probe GAME_SPEC/선택 모델 설계에서 구현 전 기록. 새 공통 의미가 필요하면 관련 설계로 복귀. 이번에 제품/엔진 동결하지 않음 |
| 구현 의무 | 승인 계약 구현, H1~3의 실제 owner 최소 보완·기존 소비자 호환, 단일 채택/복구, 모든 완료 경로 | 허용된 후속 구현 단계. 문서와 기존 source 존재만으로 지원 선언 불가 |
| 실행/오픈 의무 | 권한/정보 격리·A/C/P·actual C/최종 P·두 client·입력/복귀·T01~03·효과 정정/중복·성능·모바일·수동 리뷰·운영/기록/삭제/복구·비용/기존 회귀 | 전부 NOT_RUN/UNKNOWN. 시험 조건과 실제 oracle를 제출하고 오픈 게이트에서 확인 |
| 미래 미선택 | 비room Invite, 보상/leaderboard·정밀 audio·Profile·3D/전용 물리/리듬 엔진 | 지금 필요성/지원 미선택. 전체 STEP5C blocker로 올리지 않음 |

