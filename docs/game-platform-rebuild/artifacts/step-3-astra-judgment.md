# STEP 3 — Work Astra 핵심 판단

- 작성: 2026-10-01. 사용자 18:37:11 KST 착수·20:55:06 KST 재개 지시. `Game_Platform_vNext_STEP3_work_guide.md` §4 **3번**의 판단 기록이다.
- 상태: **가이드 3번 핵심 판단 완료 / 가이드 4번 인계 가능**. STEP 3 전체는 IN_PROGRESS이며 결과 승인·사후 감사 완료가 아니다. 가이드 4번 정식 산출물 반영·검증 및 5번 최종 SHA 사후 감사는 미수행이다.
- 기준 integration: `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`; 최초 판단 착수 HEAD: `d0dadc35d574ef8e084458342009d10a529c4ae6`; 재개 중 분석 단위 A 보존 commit: `b1d3417ce6979879cddff0dba3b52d7659e93274`.
- branch: `docs/game-platform-vnext-phase3-stress-preparation`; PR #410 OPEN/Draft, base integration, 미병합(상태 복원 담당 read-back). 실제 최종 저장 SHA는 checkpoint/Git에서 조회한다.
- 실행 계획 개정 1.3 / blob `e12ef038913eb6d605709b782f1b73f18e0d1253`. 입력 우선순위: 실행 계획 → 현재 유효 규칙·STEP 1 조항 → 승인된 STEP 2 초안 → 외부 참고.
- 직접 입력: [Sol 근거와 고정 source index](step-3-evidence-brief.md), [STEP 2 선택표](step-2-implementation-selection.md), [장르 인덱스](step-2-genre-rule-index.md), [GAME_SPEC 근거](step-2-game-spec-selection-rationale.md), [보존된 Sol 5.6 보고서](step-3-auxiliary-research-report.md), [STEP 1 AS-IS](step-1-as-is-audit.md).
- 코드·기존 규칙·계획·STEP 1/2·DECISIONS 변경 없음. 이 기록은 새 계약, Runtime Model, Profile, 경로, 라이브러리/백엔드 또는 구현 지원을 채택하는 문서가 아니다.

## 1. 판단 요약과 읽는 법

**11개 사례의 요구는 STEP 2의 7축·하위 항목·단계별 선택으로 표현할 수 있다. 새로운 필수 Core 전제나 보드 전제를 선택표가 강제하는 결함은 이번 입력에서 발견하지 않았다. 따라서 STEP 2 즉시 회귀는 불필요하다는 판단이다.** 반면 현재 Room/snapshot 구현이 11개 사례를 모두 지원한다는 근거는 없다. 아래 matrix는 현재 계약의 제한된 표현 범위, 선택 모델 검토가 필요한 범위, 정책/증거 부족으로 보류할 범위를 나눈다.

Room·match·round·viewer·인증·연결의 수명이 다를 수 있다는 문제는 계획이 이미 정한 실행 수명 및 선택 모델 경계 안에서 검토할 수 있다. 모든 게임에 이 식별자를 필수 필드로 추가하라는 결론이 아니다. Core의 공통 수명 규약과 모델별 상태 채택 의미를 STEP 4A/4B에서 설명해야 한다.

### 표기 기준

| 표기 | 의미와 제한 |
|---|---|
| 현재 계약으로 표현 | 지정한 좁은 요구를 현재 문서/surface로 기술 가능. 해당 게임 전체 또는 안전한 구현 완료를 뜻하지 않음 |
| 선택 모델 추가 | 현행 surface로 의미를 보존할 수 없는 실행 특성에 추가/분리 계약 검토가 필요. 독립 엔진 수, 구현 시점, 공유 승격을 확정하지 않음 |
| 미지원·보류 중 **보류** | 정책·계약·운영·검증 증거가 부족하여 지원 판정을 유보. 증거 부재를 기술적 불가능이나 전수 미지원으로 바꾸지 않음 |
| 규칙: 조건부 양립 | 명시한 하위 사례와 적용 의무 충족 조건에서 충돌이 발견되지 않음. 전체 규칙 준수 감사 PASS 아님 |
| 규칙: 변경 검토 필요 | 기존 의무와 실제 요구가 충돌/대체 관계. Architecture Change·적용 범위·영향도 검토 전 예외 승인 불가 |
| 규칙: 미확인 | 적용 모드/정책이 없어 판정 불가. 무조건 양립 또는 변경 필요로 압축하지 않음 |
| D / C / H / X / N | D=문서 원문, C=이번 선택 코드 읽기, H=기존 테스트/재현 기록 참조, X=이번 외부 공식 원문 선택 확인, N=이번 runtime·DB·브라우저 실행 검증 없음 |

모든 행은 사고 실험용 요구 조합이다. 특정 신규 게임의 확정 GAME_SPEC이 아니다. 기존 소비자는 구현 경로의 참고이고 미래 장르 전체의 대리 검증물이 아니다. `S3-E..`는 brief에 있는 integration 고정 경로·blob·줄로 연결되며, `X..`는 §7의 이번 원문 확인 범위로 연결된다.

### 현재 규칙 적용의 공통 주의점

- 공통 조사·네 문서·권한·private 격리·검증·수동 디자인 검토·출시/기록 의무를 모든 사례에서 보존한다.
- 현행 development §6은 host/ready가 보편 개념이 아님을 명시하지만 현행 adapter를 쓰면 8 surface 모두 실제 의미로 구현해야 한다. 빈 method와 game-local 우회는 허용하지 않는다.
- 현행 §10B/LEGACY-DEV-311은 멀티플레이 재대결의 명시적 재참여·준비·host 흐름을 요구한다. 초기 hostless와 재대결 hostless를 구분한다.
- 현행 DB/Test Contract §필수 계약 도입문은 **모든 신규 온라인 platform-native 게임**을 대상으로 한다. 비DB/stream 모델에 동등한 안전성을 설계한다는 계획만으로 현행 snapshot/version 계약 적용을 면제할 수 없다. 그 적용 범위와 새 모델 책임의 정식 전환은 STEP 4B/5C/6 및 이후 권위 전환에서 검토한다. 이 문제는 기존 STEP 1 U02와 STEP 2의 미결정 범위다.

## 2. 11개 사례의 7축 대입

① flow, ② 시간·입력, ③ 세션·지속성, ④ 참여·가시성, ⑤ 권위·동기화·복원, ⑥ 공간·렌더링·입력·물리, ⑦ 결과·meta. 두 표의 동일 ID가 하나의 사례다. `미정`은 누락이 아니라 그 축이 장르명만으로 결정되지 않음을 표시한다.

| 사례 | ① Gameplay flow | ② 시간·입력 | ③ 세션·지속성 | ④ 참여·가시성 |
|---|---|---|---|---|
| S3-C01 턴제 카드/보드 | 기준: 순차 턴. 변형: 동시 선택→정해진 해결 순서 | 행동 이벤트; 마감 유무 별도, animation 주기와 독립 | room 안 경기/라운드; 재대결 gameplay 초기화. 장기 보존은 C11 | 경쟁/협동 선택; 공개 보드·개인 패 구분; 관전은 C10 |
| S3-C02 실시간 2D 협동 | 동시 이동/행동·지속 진행; 준비/종료는 이벤트 가능 | 입력 sampling, simulation, network 송수신, render 각각 기록; 빈도 미정 | 협동 경기; 이탈/재참가와 중단 후 복원 범위 별도 | 복수 참가자·공유 세계; 팀/private 정보 유무 별도 |
| S3-C03 반응속도/PvP | 하위 a: 신호 후 단발 입력 경쟁. b: 지속 대전/반복 판정 | 입력 시점·허용 구간·경합 순서; b의 예측 여부 별도 | 짧은 round와 경기 구분; round 결과 이후 rematch | 경쟁; 공개 결과와 입력 비공개 여부 별도 |
| S3-C04 RTS | 지속 simulation + 명령 이벤트; 명령과 해결 순서 분리 | 명령 수신·simulation·network·render 주기 독립; lockstep 미채택 | 경기/세계 상태; 복구할 명령·세계 범위 명시 | 경쟁/팀; 시야·팀별 정보, 관전 정책 별도 |
| S3-C05 리듬 | 곡/구간 진행 + 입력 판정; 준비→재생→종료 | audio 기준·입력 timestamp 연결, pause/resume 재기준; render와 독립 | run·곡/구간; 실패/재시도 시 초기화·저장 정책 | 기준: solo. online 대전/협동은 별도 하위 모드 |
| S3-C06 레이싱/플랫포머 | a: 주행→유효 체크포인트→완주. b: 이동→실패/도달→재시도 | 이동 입력·simulation; 물리 사용 시 별도 step; network는 online 때만 | a: 경기/랩. b: run/목숨/체크포인트; 저장 범위 별도 | solo/경쟁/협동 미정; a/b의 정책을 서로 상속하지 않음 |
| S3-C07 3D 공간/물리 | 3D 표현만으로 flow 미정; 탐색 지속/행동 이벤트 모두 가능 | render, 입력; simulation/physics는 사용 시만 기록 | 일회 실행/공간 세션/장기 세계 중 제품 요구에 따라 결정 | solo/multi 미정; 3D는 참가 형태를 결정하지 않음 |
| S3-C08 비대칭 역할 | 기본 게임 flow를 따르되 역할별 다른 행동/단계 | 역할 A/B 입력 방식과 마감 별도; 전환 시 기존 입력 무효 범위 | 경기 수명과 역할/view 수명을 구분 | 역할별 공개/팀/private + 행동 권한; 역할 교체 요구 포함 |
| S3-C09 host 없는 세션 | a: solo 자동 실행. b/c/d: online 자동 시작 등 정책 | 이벤트/주기 미정; host 유무가 tick을 결정하지 않음 | a: room 없는 run 가능. b: 초기만 hostless. c: 재대결도 hostless. d: 재대결 미정 | player-host 부재와 서버 권위 부재는 별개; solo에는 rematch host 적용 안 됨 |
| S3-C10 관전자/중도 참가 | 기반 게임 flow 지속 중 가입/역할 전환 | join 시 동기화 지점·입력 활성 시점; spectator 입력 제한 | 세션/경기는 지속; 참가/view의 시작·종료는 별도 | participant↔spectator·새 참가자; 공개/개인 view 권한 재평가 |
| S3-C11 비동기·장기 진행 | 순차 턴 또는 비동기 명령/해결; 동시 접속 필수 아님 | 행동 이벤트·권위 있는 마감; browser timer와 장기 deadline 분리 | 장기 상태 저장/재개; 연결·실행 인스턴스보다 긴 수명 | offline 참가자 포함; 현재 view 권한과 탈퇴/재가입 정책 별도 |

| 사례 | ⑤ 권위·동기화·복원 | ⑥ 공간·표현·입력·물리 | ⑦ 결과·meta | Invite / Presence 별도 선택 |
|---|---|---|---|---|
| S3-C01 | 기준: 서버 권위 DB/RPC→invalidation→snapshot. 동시 선택의 비공개 제출·해결은 추가 검토 | 논리 보드/카드; DOM/Canvas 선택; pointer/keyboard/touch; 물리 필수 아님 | 규칙별 승패/점수·경기 확정; 장기 통계/보상 미정 | 둘 다 미정. room 초대/접속 표시 필요 시 기존 경로·수명 대조 |
| S3-C02 | 상태별 권위·stream 순서·재연결 초기 상태/후속 갱신; 예측/보정 미정 | 2D 연속/격자; 렌더러·입력 장치 선택; 물리 선택 | 협동 완료/실패·개인 outcome; meta 미정 | 둘 다 미정. 협동이라는 이유로 필수화하지 않음 |
| S3-C03 | a: 서버 판정 이벤트 후보. b: 예측/rollback/보정 후보 각각 검토; 순수 relay는 서버 검증 대체 불가 | 비공간 버튼 또는 2D/3D 대전; 물리 선택 | 예측 점수와 공식 round/경기 결과 분리; 보상은 확정 후 | 둘 다 미정. PvP라도 참가자 모집/표시 방식에 따름 |
| S3-C04 | 명령 권위·정보 필터·세계 복원; snapshot/stream/lockstep은 대안, 미채택 | 격자/연속, 2D/3D 독립; entity 조작; 물리 미정 | 승리/종료와 팀·개인 outcome; 지속 meta 미정 | 둘 다 미정. 팀의 online 상태가 게임 권위를 뜻하지 않음 |
| S3-C05 | solo의 로컬 판정 후보; 온라인 기록 수용/검증은 별도. audio와 입력 clock 연결 필요 | lane/비공간 등 미정; DOM/Canvas; 키/터치/기기 지연; 물리 불필요한 기준 사례 | 정확도/점수·실패; 공식 기록/보상은 별도 정책 | solo 기준 둘 다 미사용(모집/접속 공유 없음); online 추가 시 재선택 |
| S3-C06 | solo local 후보; online 이동 권위·예측/보정·재접속 미정; 체크포인트 저장과 네트워크 복원 별도 | 2D/3D, 물리/kinematic 선택; renderer와 physics step 분리 | a: 완주·순위·동률. b: 성공·실패·기록. meta 별도 | 둘 다 미정. solo로 확정되면 미사용 이유를 기록 |
| S3-C07 | local 엔진 가능; network 선택 시 권위/복원 별도 계약. 엔진 채택 미정 | 3D; 물리 없음/있음 각각 가능; 입력·카메라·GPU 자원 수명 | 결과 없음도 가능; 점수/XP 강제 안 함 | 둘 다 미정; local 탐색 하위 사례에는 미사용 가능 |
| S3-C08 | 역할별 authoritative view/명령 검증; 전환 전 응답·cache 처리 | A/B의 다른 UI/입력; 공간/물리는 기반 게임 선택 | 역할별 outcome·팀 outcome 가능; 단일 승자 강제 안 함 | 둘 다 미정. 초대 대상 역할과 표시 허용 범위 확인 필요 |
| S3-C09 | 서버가 player-host 없이 권위를 가질 수 있음. solo local과 online 권한 분리 | 공간/표현/물리 미정; hostless만으로 결정 불가 | run/경기 결과 유무 미정; multiplayer rematch 정책은 b/c/d로 분리 | a 미사용 가능, b/c/d 미정. roomId 필요 기존 초대와 비room 연결 호환 미확인 |
| S3-C10 | join 권한·현재 authorized state 확보·후속 갱신 연결; private old view 폐기 요구 | spectator UI와 참가 입력 모드 전환; 기반 게임 공간/물리 유지 | 관전자의 표현과 공식 결과 참여자 범위 분리 | 둘 다 미정. 관전 초대 권한과 Presence 공개 범위 별도 |
| S3-C11 | 권위 있는 저장 상태/마감/중복 명령 처리; durable current state와 history 요구 분리 | 보드·비공간·2D/3D 모두 가능; 장기성은 renderer 지정 안 함 | 진행 완료/중도 포기/마감 결과; 경기 밖 progression 수명 별도 | 둘 다 미정. 장기 초대 만료와 offline 참가를 Presence만으로 판단 불가 |

## 3. 적용 장르·계약·구현 증거의 독립 matrix

아래 표의 신규 문서는 **필요한 내용의 논리적 묶음**이다. 사례마다 새 물리 파일 또는 Runtime Model 하나씩을 만들라는 뜻이 아니다. 공통 절차는 중복 복제하지 않고 모든 행에 공통 적용한다. 새로운 장르 본격 개발 전에 STEP 5C/7A3 경로로 준비하며 실제 파일 배치는 STEP 6이다.

| 사례 | 적용 장르 규칙 / 신규 문서 필요 | 규칙 적합성 | 계약 적합성 및 STEP 3 분류 | 실제 구현 증거·수준 / 미확인 | Core 변경 필요성·후속 |
|---|---|---|---|---|---|
| S3-C01 | 보드·카드 계승. 기본 순차 턴만으로 신규 장르 묶음 불필요; 동시 비공개 선택/장기 모드 세부 규칙 보완 | 현재 room/서버/ready/rematch를 충족하는 기준 사례는 조건부 양립. 변형도 원 의무 유지 | **현재 계약으로 표현(기준 사례 한정)**: §6 8 surface, DB snapshot·private·중복/동시성·rematch 의무. 동시 제출의 은닉·마감·해결 규약은 추가 검토; C11 장기 모드와 구분 | D/C/H/N. E04~16의 기존 두 controller 경로 확인. F01 때문에 전환 안전 구현 완료 아님. 동시 선택·private 전환·장기 복원 증거 없음 | 신규 필수 Core 없음. 수명은 T01~03/4A, 동시 처리·복원 4B, 재사용 5A, 계승 5C/6/7A2 |
| S3-C02 | 반응·액션/협동·공간형 독립 규칙 필요; 조작·중단·복구·품질 기준 조사 | 참여·서버 검증·rematch 유지 조건에서 장르 충돌 없음. DB 계약을 stream으로 대체하는 요구는 규칙 적용 범위 변경 검토 필요 | **선택 모델 추가**: 연속 입력/상태 전송, 순서·보정·복구 의미는 기존 invalidation 계약으로 충분히 설명되지 않음 | D/C/X/N. E06/13은 snapshot refresh 증거일 뿐 실시간 품질 증거 아님. X01/02는 외부 가능 사례; 프로젝트 stream/운영 증거 없음 | 신규 필수 Core 없음. 4A 실행 수명, 4B 권위 위치/transport/비용/복구, 5C 첫 비보드 규칙, 6 범위 동결 |
| S3-C03 | 반응·액션 규칙 필요; a와 b의 판정/지연 조건 구분 | a는 현행 서버 검증/재대결 조건에서 양립 가능. b의 client prediction을 최종 판정으로 소비하면 충돌; 순수 relay·비DB 대체는 변경 검토 | a: **현재 계약으로 표현(명령/결과 전달만)**, 공정한 시간 판정 보장 미확인. b: **선택 모델 추가**, rollback 실채택·품질/운영 지원은 **보류** | D/X/N 및 E15/16 제한 근거. 시간 경합·rollback runtime 없음. X03은 재실행 가능성과 조건의 외부 증거 | Core에 rollback/tick 추가 불필요. 4B 시간·권위·동기화, 5B 결과/연출, 5C 판정 규칙 |
| S3-C04 | 전략·자원·명령 규칙 필요; 시야·생산·명령 해결·승리 조사 | 원 서버 권한/정보 격리·rematch 의무 유지. lockstep/비DB 등으로 현행 계약 대체 시 변경 검토 | **선택 모델 추가**: 지속 simulation/명령 순서/권한 view/복구. snapshot도 가능한 요소지만 장르명만으로 lockstep 확정 불가 | D/X/N. E02/03에 표현 틀 존재; entity 규모·지연·명령 재현·시야 격리의 프로젝트 실행 증거 없음 | 새 Core 없음. 4B 모델 대안·복구·대역폭, 5C 장르 기준; 구체 RTS 엔진 구현 보류 |
| S3-C05 | 리듬·타이밍 독립 규칙 필요; 판정 구간/기기 지연/중단 조사 | solo 기준 해당 공통 의무와 조건부 양립. 온라인 점수 수용·재대결 정책 미정이면 그 범위 미확인 | **선택 모델 추가**: audio/input 시간 연결·run 재개. 현재 BGM 존재는 리듬 판정 계약이 아님. 온라인 공정성/기록 지원 **보류** | D/X/N. X04는 별도 audio clock 근거; 프로젝트 리듬 판정/지연 보정 증거 없음 | 공통 단일 clock 강제 불필요. 4A run 수명, 4B 선택 시간 모델, 5A 기존 BGM 재사용 판단, 5B 연출, 5C 장르 |
| S3-C06 | 레이싱과 플랫포머 각각 필요한 규칙 묶음; 한 파일/공유 이동 문서는 후속 결정 | solo 기준 조건부 양립. online은 서버 검증/재대결 의무·모델 적용 범위 검토; 정책 미정 부분은 미확인 | **선택 모델 추가**: 이동/선택 물리/체크포인트·실패 복구. a/b의 유효 진행과 재시도는 game-local; online 계약·품질은 **보류** | D/N. E02/03 표현 가능; 실제 이동 엔진/physics/network 구현 지원 증거 없음. 외부 엔진 판본 수치를 의존하지 않음 | Core에 물리·랩·목숨 불필요. 4A run/경기, 4B online 선택 시 동기화, 5C a/b 독립 요구 |
| S3-C07 | 3D/물리 자체는 장르 아님. 실제 게임의 규칙 묶음을 선택하고 카메라/조작/공간 품질 보완 필요 | solo 비물리 탐색은 조건부 양립. 구체 게임/online 여부 미정인 전체 사례는 미확인 | **선택 모델 추가(엔진/표현·선택 물리 연결)**. 구체 엔진·운영 지원 **보류**; 3D라서 신규 플랫폼 불필요 | D/N. E02/03과 계획의 외부 엔진 연결 원칙. 프로젝트 3D/physics consumer 및 품질 증거 없음 | 신규 Core 없음. 자원 정리/오류 연결 4A, 필요한 모델4B, 기존 Shell 연결5A, 규칙5C, 경로6 |
| S3-C08 | 기반 장르 + 역할별 정보·행동 규칙 보완. 비대칭만으로 독립 장르 필수 아님 | authorized view를 서버가 집행하면 조건부 양립. private를 전체 전송 후 UI 숨김은 충돌. 전환 정책은 명시 필요 | 고정 역할의 private snapshot 의무는 **현재 계약으로 표현**. 역할 전환의 view 수명·구독/cache·명령 권한은 **선택 모델 추가/보완** | D/C/X/N. E15/16의 private 의무, E10/11의 tracking 일부. 역할 전환 실증 없음; X06 수신자 선택은 프로젝트 지원 근거 아님 | Core가 역할 목록 소유할 필요 없음. 4A 수명·4B 권한/view, 5C 역할 규칙; T03 필수 후속 |
| S3-C09 | 기반 장르 선택. hostless만으로 신규 장르 문서 필수 아님; 시작/재대결 적용 조건 보완 | a solo: host/rematch 규칙 비적용. b 초기만 hostless+준수 rematch: 그 이유만으로 변경 대상 아님. c 재대결 host 불성립: **변경 검토 필요**. d 정책 미정: **미확인** | a/b: 의미 없는 8 surface 강제 없이 **선택 모델 추가/분리 검토**. 초기 자동시작의 서버 검증 의무 자체는 현 계약에 있음. c/d: 지원 **보류** | D/C/X/N. E04/05/15, S2-R03; 자동시작 문서 의미와 실제 adapter 호환 분리. hostless end-to-end 구현 증거 없음 | 새 Core 없음, host 없는 실행은 계획의 원래 목표. 4A/4B 최소 세션 모델, 5C 규칙 범위, 6 동결. c 승인 전 no-op 우회 금지 |
| S3-C10 | 기반 장르 + 관전·중도 참가 규칙 보완. join 가능 시점/정보 범위/입력 허용 조사 | 현재 권한·private 의무와 양립 가능한 요구. 관전자 권한을 멤버 권한처럼 간주 불가; 구체 정책 미확인 | **선택 모델 추가/보완**: 초기 authorized view와 live 갱신 연결, view 전환 수명. 기존 snapshot 조회는 구성 요소일 뿐 전체 표현 완료 아님 | D/C/X/N. E10/11/15 일부; X05/06 외부 참고. 프로젝트 spectator/late-join/전환 보안 실행 증거 없음 | 새 Core 없음. 4A viewer 수명, 4B join/filter/복구, 5A Invite·Presence 호환, 5C 정책; T03/04 |
| S3-C11 | 기반 장르 + 장기 진행/마감/복귀/탈퇴 규칙 보완. 장기성만으로 보드 규칙 복제 불가 | 마감/참여/rematch 정책 미정 부분 미확인. 비room/비snapshot으로 현행 온라인 계약 대체 시 규칙 적용 범위 변경 검토 | **선택 모델 추가**: durable state·동시 명령·마감·재개·참가 수명; history 보존은 요구 시만. 장기 운영/제품 지원 **보류** | D/C/X/N. E13의 browser refresh는 장기 지속성 증거 아님. X01의 passive 사례로 상시 tick 필수 가정 반박 가능; 저장/복원 구현 증거 없음 | 새 Core 없음. 4A 인스턴스보다 긴 상태, 4B 저장/복구/명령, 5A Resume·Invite, 5B meta, 5C 장기 정책 |

## 4. 분류 결과 해석

1. **현 계약 표현 사례를 전부 배제하지 않는다.** C01의 현행 의미와 C03a/C08의 제한된 요구에는 사용 가능한 계약 근거가 있다. 그러나 F01과 T01~03의 미해결 수명 때문에 전체 지원 완료로 판정하지 않는다.
2. **선택 모델 추가는 미래 범위의 검토 분류다.** C02~07·C09~11 및 C08 전환 요구가 모두 같은 모델을 필요로 하거나 각자 독립 모델을 필요로 한다는 결론은 아니다. 모델의 수·이름·공용 승격·구현 우선순위는 후속에서 결정한다.
3. **현재 보류 대상:** C03b rollback 채택/품질, C05 온라인 판정, C06 온라인 이동, C07 엔진 지원, C09c 규칙 변경·C09d 정책, C10 관전 정책, C11 장기 운영. 다른 행도 미정 요소가 있으므로 표의 계약 표현 가능성을 지원 보장으로 읽지 않는다.
4. Invite/Presence는 모든 사례에서 별도 확인했다. `미정`은 현행 capability boolean을 임의로 켜도 된다는 뜻이 아니다. 기존 Invite의 room 연결이 맞지 않으면 token 본체 복제보다 얇은 연결/호환 조건을 5A에서 검토한다.
5. renderer FPS / simulation / physics / network / 입력 시간 / audio는 독립 기록한다. 일부 값이 같은 구성은 가능하지만 각 시간의 목적·일시정지·재개 의미를 기록한다. 모든 사례에 숫자 tick이나 event-based=0Hz를 강제하지 않는다.

## 5. 여섯 전환·실패 시나리오의 핵심 판단

아래 성공 조건은 계획의 안전성을 각 사고 실험에 적용한 **후속 계약 검토 요구**다. 새 API·필드·알고리즘 확정이나 이번 실행 테스트 결과가 아니다. 모든 시나리오는 N이며, 기존 F01 재현만 H로 참조한다.

### S3-T01 — 같은 방의 새 경기 뒤 이전 응답

- **추적:** room R/경기 A에서 action·snapshot 요청 발행 → 재대결 준비/새 경기 B 수용 → A에서 발행한 성공 응답·snapshot·오류·연출 완료 도착. 같은 room ID, 같거나 낮거나 큰 version 각각을 사고 실험 입력으로 둔다. 버전 리셋/룸 전체 단조 증가는 서로 다른 모델 조건이다.
- **위험:** room 일치만 검사하면 이전 경기 결과가 B의 상태/오류/연출을 오염시킨다. 비교 범위가 다른 version 숫자만으로 최신성을 판단할 수 없다. 반대로 version이 room 전체에서 단조 증가하고 모든 유입 경로가 같은 acceptance 규칙을 사용한다면 일부 stale snapshot은 기존 순서 정보로 식별할 수 있다. 반드시 별도 match ID/epoch 필드가 필요하다고 선결정하지 않는다.
- **판단 요구:** 현재 실행·참여·경기 맥락에 적용 가능한 데이터인지와 그 맥락 안에서 최신인지 둘 다 설명해야 한다. 이전 경기 데이터를 B의 gameplay로 채택하지 않는다. 늦은 오류·busy 해제·결과 연출도 동일하게 대상 맥락을 확인한다. A에서 발행했어도 실제로 B의 현재 authorized snapshot을 반환하는 재조회는 근거가 있으면 채택할 수 있으므로 발행 시각만으로 일괄 폐기하지 않는다.
- **근거/현 상태:** E05의 같은 room 재대결 의무, E06/08/09/10/12. coordinator는 자체 load version만 관리하고 동등 version을 허용한다. Can’t Stop action은 직접 apply한다. No Thanks!의 tracking은 same-room 경기/view 경계를 자동 증명하지 않는다. F01/IMPL001·004·005와 일치하며 **현재 전 경로 안전 보장 불충분**이다.
- **후속:** 4A에서 수명/채택 설명, 4B에서 version/sequence 범위, 5A에서 기존 모듈 연결, 6에서 재대결 포함 추적. 이후 검증은 action/refresh/error의 도착 순서와 경기 전환 전후 양방향을 포함해야 한다. 기존 게임 수정은 별도 범위다.

### S3-T02 — 다른 방의 콜백

- **추적:** A의 initial/refresh/action/leave 요청 대기 → 이탈/실행 dispose → B 진입 → A의 snapshot·null·실패·leave 성공·finally 완료. A→B→A 재진입도 포함한다.
- **위험:** A의 늦은 null 또는 leave 완료가 현재 B tracking을 정리하거나 UI를 빈 방으로 바꿀 수 있다. room ID만 비교하면 A 재진입 때 이전 A 수명이 다시 유효한 것처럼 보일 수 있다. unsubscribe/stop은 이미 시작된 promise의 완료를 자동 취소하지 않는다.
- **판단 요구:** 취소 요청 성공 여부와 관계없이 현재 화면에 적용할 맥락이 끝났다면 최신 상태/오류/연결 표시/후속 작업을 변경하지 않아야 한다. A 소유 자원의 정리는 허용되지만 B 자원 정리로 번지면 안 된다. 서버의 A leave commit은 유효할 수 있으므로 client 무시를 서버 동작 rollback과 동일시하지 않는다.
- **근거/현 상태:** E06/07의 await 이후 callback, E09 leave 이후 stopTracking/apply(null), E10/11의 generation/room/disposed 보호 일부. source상 경로 차이가 확인되며 F01 기존 재현을 참조한다. 이번에는 B UI 오염을 새로 실행 재현하지 않았다. **일부 controller 방어를 공통 보장으로 승격 불가**.
- **후속:** 4A 수명 종료/오류/정리 범위, 4B 요청/응답/구독 채택, 5A adapter 소비자 경계. 후속 검증에는 성공뿐 아니라 error/null/finally, 반복 dispose, A 재진입, leave 뒤 B 자원 유지가 필요하다.

### S3-T03 — 관전 전환 뒤 private 정보

- **추적:** 참가자 V1이 private view 요청 → 같은 room/경기에서 관전자 V2 전환 승인 → V1 응답/구독/캐시 완료 → V2 렌더. 반대 전환, 역할 A→B, 로그인 사용자 변경도 같은 종류의 검토 대상이다.
- **위험:** room·경기·version이 같거나 증가해도 viewer 권한은 달라질 수 있다. UI 숨김은 서버의 정보 제공 권한 집행을 대신하지 않는다. 새 요청의 권한 검증만으로 이미 대기 중인 callback/cache 사용이 정리되지는 않는다.
- **판단 요구:** 서버는 모델이 정한 권한 시점에 허용된 정보만 제공하고, 클라이언트는 현재 view의 권한/수명에 맞지 않는 이전 데이터를 표시·병합·재사용하지 않아야 한다. 참가자로 다시 바뀔 때도 예전 private cache를 자동 복구하지 말고 현재 권한의 근거를 확인한다. 구독 해제·cache/오류 로그·실행 맥락 검토가 함께 필요하다.
- **보안 한계:** 과거에 적법하게 전달된 비밀을 악의적인 클라이언트에서 회수할 수 있다고 약속하지 않는다. 이미 발송된 데이터와 철회 이후 새로 제공하는 데이터의 경계를 4B에서 정의한다. ‘client generation 검사만 있으면 서버 보안 완료’라고 판정하지 않는다.
- **근거/현 상태:** E15/16은 private 격리/재대결 초기화 의무, E10/11은 tracking 일부만 증명한다. X06의 수신자 지정은 전송 범위의 외부 예시일 뿐 전환 폐기 보장이 아니다. **현행 viewer 전환 계약·실행 증거 불충분**, 기술적 불가능 판정은 아니다.
- **후속:** 4A view/인증 맥락 수명, 4B 서버 필터·권한 검사 시점·전송/캐시 경계, 5C 관전 규칙. 후속 검증에서 같은 room·동등 version의 private 응답과 양방향 전환을 포함한다.

### S3-T04 — 재접속 시 이벤트 유실

- **추적:** 연결 단절 → authoritative state S0→S1 및 이벤트 e 발생 → 재연결/권한 재확인 → 현재 상태 획득 → live 갱신 재개. 재접속 중 권한 철회/room 종료, snapshot 로딩 중 추가 갱신도 포함한다.
- **판단:** 연결 복구, 현재 상태 재구성, 과거 이벤트 재생은 별개다. 현행 DB 모델은 invalidation을 놓쳐도 최신 snapshot으로 게임 상태를 복원하는 의미를 가진다. 제품이 과거 e 자체(기록·연출·감사)를 요구하지 않는다면 모든 이벤트를 재생할 의무를 새로 만들지 않는다. e가 현재 상태로부터 복원되지 않는 필수 사실이면 별도 보존/재생/소비 증거가 필요하다.
- **실패 기준:** refresh가 호출됐다는 이유만으로 복원 완료로 표시; 구독 재개와 초기 상태 사이 공백으로 갱신 누락; 같은 사건 재생으로 보상 중복; 권한 철회 후 오래된 캐시로 성공 표시; 사라진 세션을 유효한 것처럼 복구.
- **근거/현 상태:** E13은 online/pageshow/visible→refresh 요청 및 listener 정리, E14는 그 계약 테스트 존재, E15/16은 DB 현재 상태 복원 의무. 순서 보장/replay 구현 증거는 없다. X05/07은 event cache와 rejoin 조건이 별도라는 공식 사례다. **현재 DB 복원 의미는 표현 가능, stream·history 복원은 추가 계약 검토 필요**.
- **후속:** 4B 모델별 복구 목표·initial/live 연결·중복 처리·복구 불가 응답, 4A 재접속 수명, 5A Reconnect/Resume 재사용. 실제 관찰은 ‘복귀 트리거 발생’과 ‘두 클라이언트의 허용된 최신 상태 수렴’을 별도로 기록한다.

### S3-T05 — rollback 중 결과 중복

- **추적:** 예측 frame에서 승리/점수/효과 발생 → 과거 상태 복원 → 동일 입력 재실행 → 다른 최종 결과로 보정 또는 같은 결과 확정 → 소비 재시도/재접속.
- **판단:** simulation 상태 안의 임시 점수, 관람자에게 보여줄 연출, 공식 경기 결과, 외부 통계/보상 소비를 구분해야 한다. 계획 §2는 예측 결과의 확정 통계/보상 소비를 금지한다. 권위자가 확정한 결과와 정정의 의미를 정한 뒤 소비가 중복되지 않도록 해야 한다. 결과 없는 게임에 이 기능을 필수화하지 않는다.
- **실패 기준:** 재실행 횟수만큼 사운드/연출 또는 영구 보상 증가; 예측 승리를 취소할 수 없는 공식 결과로 제출; 공식 정정 때 기존 집계를 남긴 채 새 결과를 추가; retry 중복 방지 하나를 모든 종류의 재실행 보장으로 표시.
- **근거/현 상태:** X03은 재실행 및 sound/effect 지연을 설명한다. 영구 보상 방법까지 제공하지 않으므로 그 부분은 계획의 안전성에 따른 판단이다. E16의 `client_action_id`는 동일 RPC의 authoritative state 중복 변경 방지이며, frame 재실행이나 별도 Result 소비를 자동 보호한다는 근거는 없다. **현행 계약만으로 전체 표현 불충분, 선택 모델/결과 경계 추가 검토**.
- **후속:** 4B 예측/확정/보정 의미, 5B Result 식별·확정·정정·소비와 Presentation/Sound, 6 최소 계약/보류 분리. DB 테이블·이벤트 버스·exactly-once transport 또는 공통 보상 서비스는 확정하지 않는다. 외부 소비 재시도를 포함한 검증은 후속 구현 범위가 정해진 뒤 수행한다.

### S3-T06 — 출시 활성화 중복

- **추적:** 소스 반영 → 기능 구현·운영 검증 → 승인된 activation → handoff에 pending 상태 잔존 → 다음 작업자가 activation/공개 표시/공지를 재처리. 재활성화가 새 공개 사건인지 단순 복구인지도 정책 질문이다.
- **판단:** 소스 merge, 기능 완료, production activation, 공개 사건, 사이트 표시/공지 소비는 서로 다른 사실이다. 같은 boolean을 다시 true로 설정하는 행위는 자체로 멱등일 수 있으므로 현재 코드에 중복 공지가 발생한다고 단정하지 않는다. 미래 공개 사건 소비가 있다면 같은 사건 재처리와 새 사건을 구분할 근거가 필요하다.
- **실패 기준:** 오래된 handoff만 믿고 이미 완료된 activation을 신규 출시로 기록; 기능 파일 존재만으로 capability 활성화; 같은 공개 사건의 NEW/공지 중복; UI 목록/Registry flag를 권한 통제로 오인; 사용자 승인 없이 production 변경.
- **근거/현 상태:** E17의 activation/검증/보안 경계, E18 Registry boolean, E19 별도 사이트 카드 목록, E20/STEP1 F02 handoff 불일치. 이들은 실제 publication dedup 서비스가 있다는 근거가 아니다. **현행 출시 구분은 표현 가능, 공개 사건 소비/중복 경계는 5B 검토·구현 보류**.
- **후속:** 5B Publication/Site Integration에서 사건 의미·재처리·정정 경계, 5A/6에서 연결·기록 소유자. F02의 기존 게임 DEVELOPMENT 정정은 별도 maintenance로 유지한다. 공지 자동화·추가 릴리스 서비스·production 활성화는 이번 범위가 아니다.

## 6. Core·규칙 리스크와 STEP 2 회귀 판정

### 리스크 인덱스

새 발견을 곧바로 기존 게임 버그 finding으로 등록하지 않는다. 아래는 설계 검토 위험이며 STEP1 F01~F03의 ID/심각도/상태를 변경하지 않는다.

| ID | 위험·관련 사례 | 지금 판단 | 후속 닫힘 조건 |
|---|---|---|---|
| S3-R01 | room/version 하나로 모든 수명·순서 설명 — T01~03, C08~10 | 현재 코드의 일부 방어로 보편 안전성 선언 불가. 계획의 공통 수명+선택 모델 범위에서 다룰 수 있어 Core 개념 확대 근거 없음 | 4A/4B에서 성공·오류·null·정리까지 채택 의미 설명; 모델마다 식별 방법을 근거로 선택 |
| S3-R02 | 비DB/stream 요구를 현행 DB 의무 면제로 해석 — C02~04/06/09/11 | 규칙의 현 적용 범위와 미래 동등 안전성 전환을 분리. 미승인 예외 불가 | 4B/5C/6에서 적용 범위/계승/권한·복구 검증을 명시, 실제 규칙 전환은7A/7B 게이트 |
| S3-R03 | hostless를 모두 금지하거나 모두 승인 — C09 | S2-R03 세 조건 유지. solo와 multiplayer 분리; 초기 자동 시작 의무와 adapter 호환 구분 | 4B/5C/6에서 정책 충돌 범위 결정. 원 적용 대상 재대결 강도/조건은7A2에서 보존 |
| S3-R04 | 하나의 tick/엔진/Core로 모든 장르 설명 — C02~07/11 | STEP2는 이미 하위 항목을 분리하므로 현재 회귀 아님. audio·physics·network를 Core 필수로 넣으면 회귀 후보 | 4B 모델별 시간 의미, 5C 장르 품질, 6에서 room 없는 실행까지 코드 없는 추적 |
| S3-R05 | retry·rollback·replay·publication 중복을 하나의 보장으로 합침 — T04~06 | 사건 종류와 확정/소비 수명 다름. 공통 원칙만으로 한 서비스 채택 불가 | 4B 입력/복원, 5B Result·Publication·Sound 경계와 최소 계약/보류 표 |
| S3-R06 | 교차 특성마다 독립 장르/Core/공유 기능 신설 — C07~11 | 비대칭·관전·hostless·3D·장기성은 기반 장르와 교차. 공통 문서 복제·선제 모델/Profile 금지 | 5A 반복/의미 근거, 5C 독립 요구 조사, 6 실제 묶음·파일·버전 결정 |
| S3-R07 | 문서 표현 또는 외부 제품 사례를 구현 지원으로 승격 — 전체 | 모든 행의 N과 보류를 유지. 현행 C/H도 미래 모델 지원을 증명하지 않음 | 가이드4에 증거 수준 유지, 가이드5 최종 SHA 감사; 이후7D/Probe에서 실제 실행 증거 |

### 회귀 조건을 직접 대입한 최종 판단

| 계획의 회귀 조건 | 이번 검토 결과 | 이유 |
|---|---|---|
| 보드게임 전제의 불필요한 강제 | **현재 STEP2 선택표에서 발견 안 됨** | C05 solo audio, C07 비물리3D, C09 room/host 없는 run, C11 상시 연결/상시 tick 없는 장기 상태를 기존7축으로 기술 가능. Room/DB/DOM 의무를 선택표가 새로 보편화하지 않음 |
| 새로운 필수 Core 전제 | **발견 안 됨** | T01~03은 계획에 이미 있는 실행 수명/오류/정리와 선택 모델의 채택 의미, T04는 복원, T05/06은 선택 기능·사이트 경계에서 검토 가능. match/viewer/clock을 모든 게임의 Core 필수 필드로 만들 근거 없음 |
| 7축으로 필수 요구를 표현 불가 | **발견 안 됨** | viewer 변화④⑤, 장기 상태③⑤, audio②⑥, 확정/정정⑦⑤, 역할별 입력②④에 명시. Publication은 게임 실행 축 추가 대신 계획의 사이트 연결 검토 대상 |
| 기존 규칙 충돌을 숨겨야만 사례 표현 가능 | **숨길 필요 없음 / 알려진 검토 항목 유지** | hostless rematch와 비DB 현행 계약 적용은 규칙 상태를 변경 검토/미확인으로 기록. STEP2 초안은 이미 지원과 규칙 적용을 분리하며 해당 문제를 미결정으로 남김 |

**최종: STEP 2 즉시 회귀 불필요. 가이드 3번 판단을 정식 반영 대상으로 전달할 수 있다.** 이는 STEP3 전체 승인, STEP4 착수 허가, Target 동결 또는 구현 지원 승인이 아니다. 이후 설계가 모든 게임에 room/host/단일 tick/전역 currentRoom을 요구하거나 선택표의 축 분리로 설명할 수 없는 새 필수 전제를 발견하면 STEP2 회귀를 재개한다. 단순히 새 선택 모델이 필요하다는 사실은 계획이 예상한 확장이지 그 자체로 회귀 조건이 아니다.

### 후속 책임과 미결정

| 단계 | 이번 판단에서 넘기는 입력 | 그 단계가 결정할 사항 / 이번에 미확정 |
|---|---|---|
| 가이드4 Work Sol | 본문 전체, 11사례 두7축표+독립matrix, T01~06, R01~07, §7 확인범위 | 정식 산출물 형태·trace/링크/범위/Governance 검증·기록·원격 제출. 의미/보류 상태를 임의 확정하지 않음 |
| 가이드5 Work Astra | 최종 제출 SHA·diff·검증 | 누락·의무 약화·과장·후속 선결정 사후 감사. 본 문서는 이 감사가 아님 |
| STEP4A | T01~03, C09/11 수명 차이 | 논리 책임·의존·채택/거부·dispose/오류/정리. 식별 API/필드·전역 상태 미확정 |
| STEP4B | C02~04/06의 실시간, C05 시간, C08/10 view, C11 지속성, T04/05 | 모델별 권위·ordering·중복·복원·private·성능·사이트 보안, transport/권위 실행 위치/운영비·검증. DB 의무 전환 범위 포함 |
| STEP5A | E04~19의 현행 adapter/Coordinator/Reconnect/Registry/Invite/Presence/Shell/BGM | 그대로 연결/얇은Adapter/새구현/local/보류 판정. 본체 복제 및 기존 소비자 이동 금지 |
| STEP5B | T05/06, ⑦ 결과와 소비, 리듬/연출 요구 | Result·Publication·Sound의 최소 계약/향후 확장/구현 보류. 엔진·이벤트 버스·자동 공지 서비스 미확정 |
| STEP5C | §3의 장르 묶음과 정책 위험 | 보드 계승과 첫 비보드/두번째Probe의 독립 규칙 설계. 물리 파일 수·경로 미확정 |
| STEP6 | 위 미결정·회귀 조건·기존 F01~03/R/IMPL·S2-R01~04 | 모순 해소·계약 버전·Guard/탐색·문서 권위·Slice·Target 동결. 기존 게임 무변경/무이관 조건 확인 |
| STEP7 이후 | 승인된 Target과 필요한 최소 Probe 범위 | 단계별 실제 문서·Core·모델·테스트. 이번 11개 사례 전부 구현 약속 아님 |

## 7. Sol 5.6 조사 활용과 선택 원문 확인

보존 보고서 R01~R17/A01~A18의 ‘확인 완료’는 원 작성자의 기록이다. 이전 분석 단위 A에도 선택 확인 메모가 있었으나 링크별 확인 범위가 없었으므로, 이번 판단에 필요한 주장만 아래와 같이 **2026-10-01 재개 세션에서 직접 확인**했다. 재사용 출처 전체를 재검증했다고 표시하지 않는다. 외부 자료는 제품의 사례이며 프로젝트 규칙을 대체하지 않는다.

| 이번 ID / 보고서 연결 | 원문·판본·확인 위치 | 이번 확인 사실과 사용 한계 |
|---|---|---|
| X01 / R02·A02·A16 | [Nakama Authoritative Multiplayer](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/), 웹 버전 미표기; 서두와 gameplay modes의 active/passive turn-based | 서버 검증, passive의 수시간~수주 진행·저장 후 loop 종료 사례. 상시 tick/연결 필수 가정에 반례. 프로젝트 장기 상태 구현 증거 아님 |
| X02 / R01·A01~03·A17 | [Nakama Client Relayed Multiplayer](https://heroiclabs.com/docs/nakama/concepts/multiplayer/relayed/), 웹 버전 미표기; 서두의 forwarding/host 설명 | 서버 전달과 내용 검증은 별개. 이 제품의 relay는 client-host 중재. 현행 서버 검증 의무를 relay로 대체해도 된다는 결론 아님 |
| X03 / R06·A04·A10 | [GGPO Developer Guide](https://github.com/pond3r/ggpo/blob/master/doc/DeveloperGuide.md), master(고정 commit 미확인); Using State and Inputs, save/load, Separate Updating Game State from Rendering | 결정적 재실행·저장/복원 조건과 rollback 중 sound/effect 지연 설명 확인. 영구 보상·통계 commit 계약은 이 자료로 확인하지 않음 |
| X04 / R08·A14 일부 | [Web Audio API 1.1](https://www.w3.org/TR/webaudio-1.1/), W3C Working Draft 2026-09-22; §1.1.1 currentTime | audio stream 시간 좌표가 다른 시스템 clock과 동기화되지 않을 수 있음. 표준 초안이며 모든 브라우저/기기의 지연 보정 구현 지원을 뜻하지 않음 |
| X05 / R15·A08 | [Photon PUN2 Cached Events](https://doc.photonengine.com/pun/current/gameplay/cached-events), PUN2; Cached Events·Ordered Delivery | late joiner의 과거 이벤트 수신에는 별도 cache 의미가 필요. 유지보수 중 제품의 개념 사례로만 사용; 프로젝트 제품 추천/도입 아님 |
| X06 / R03·A12 | [Nakama Lua Match Runtime API](https://heroiclabs.com/docs/nakama/server-framework/lua-runtime/function-reference/match-runtime/), 웹 버전 미표기; broadcast_message | initial state와 특정 presences 수신자 집합 지정 가능. 이것만으로 client stale private response 폐기까지 검증되지 않음 |
| X07 / R14·A07 | [Photon Realtime5 Analyzing Disconnects](https://doc.photonengine.com/realtime/v5/troubleshooting/analyzing-disconnects), Realtime5; Quick Rejoin | rejoin은 PlayerTTL 등 조건에 의존하고 재연결 뒤에도 room/player 부재로 실패 가능. 프로젝트 retry/복구 정책 수치로 전용하지 않음 |

### 확인하지 않은 범위와 판단에 반영한 방법

- **Unity R13 원 URL은 열기 실패**. 이 세션에서는 Unity 2.0.0의 상세 visibility 동작을 독립 검증 완료로 표시하지 않는다. private 정보의 서버 제공/클라이언트 표시 구분은 현행 E15/16 및 X06으로 판단했다.
- R04/05 Apple의 구체 timeout, R07 Unreal 5.8 판본/세부 correction 구현, R09 High Resolution Time 문서 날짜, R10~12 Unity 고정/네트워크 주기, R16 Fusion, R17 RTS 연구 수치는 이번 핵심 결론의 근거로 사용하지 않았다. 원보고서 참고로 보존하며 오류라고 단정하지 않는다.
- A14 전체를 이번에 검증했다고 하지 않는다. X04의 audio 좌표 부분만 직접 확인했고, 시간 항목의 분리 원칙은 이미 승인된 STEP2·계획에 근거한다.
- A11의 결과/보상 경계는 외부 미확인 상태를 유지한다. 본 판단 T05는 계획의 예측 결과 소비 금지와 후속5B 책임을 적용한 추론이다. A13의 정확한 lifetime key/API도 미확정이다.
- A18은 외부 제품으로 판단할 수 없다. 현재 development §6/§10B와 S2-R03의 조건으로 C09를 판정했다.
- 기술 추천·성능 수치·운영비·보안 구현의 전수 확인은 하지 않았다. 프로젝트 채택은 후속4B/6 범위다.

### Q01~Q06 판단 연결

| 조사 질문 | 채택한 판단 / 남긴 경계 |
|---|---|
| Q01 권위/전달/예측/rollback/보정 | ⑤의 별도 하위 항목 유지. X01~03은 구분의 사례이며 최종 모델·client 권위 승인 아님 |
| Q02 reconnect/state/replay | T04의 세 의미 분리. 현재 DB snapshot 복원과 history 요구를 구분; X05/07 |
| Q03 rollback 중복 | T05의 simulation·연출·공식결과·소비 분리. X03은 연출까지만 직접 뒷받침 |
| Q04 역할·관전/private | C08/10·T03. 서버 필터와 현재 view 채택 모두 검토; X06과 내부계약 근거 |
| Q05 시간축 | C05 포함 모든 사례에 시간 목적별 기록. 단일 Core tick 추가 불필요; X04 선택확인 |
| Q06 hostless/장기 | C09 조건 세분·C11. X01은 상시 loop 필수 가정 반례이며 프로젝트 정책은 내부 원문으로 판단 |

## 8. 완료·검증 범위와 다음 재개 지점

- **가이드3 판단 완료:** 11개 사례 전7축·Invite/Presence, 적용 장르/신규 문서, 규칙·계약·구현 증거 독립 matrix, Core 필요성, 6개 전환·실패 시나리오, 조사 선택확인·한계, STEP2 회귀 최종 판단, 후속 책임.
- **판단 검토에 사용한 저장소 읽기:** 계획§1~3/STEP2~7, AGENTS/기록/CP0021·중간 보존 상태, STEP2 세 산출물, STEP1 F/R/IMPL, brief E01~20, 현행 development §5/6/10B·DB 계약 도입/복원/중복/동시성, coordinator/reconnect, 두 controller 관련 경로, Registry/사이트 목록, 기존 contract test 선택 구간. 전수 SQL·전체 UI·production 감사는 아님.
- **실행 검증:** 새 runtime/DB/browser/build/test 실행은 **NOT_RUN**. 코드 변경 없는 핵심 판단 단계이며 사고 실험을 테스트 PASS로 집계하지 않는다. 기존 테스트 존재 C/H 및 F01 과거 재현 H를 이번 실행 결과로 바꾸지 않는다.
- **저장 검증:** 파일·ID·링크·diff 등 보존을 위한 정합성 확인 결과는 이번 저장 checkpoint를 따른다. 그 확인은 가이드4의 정식 반영·검증 완료나 가이드5 사후 감사가 아니다.
- **상태:** STEP3 IN_PROGRESS. 가이드4 정식 반영/검증·가이드5 감사·가이드6 필요 보완·가이드7 사용자 결과/병합 승인은 남아 있다. STEP4A 이후 착수·integration/main merge 미수행.
- **재개 첫 작업:** 실제 branch/PR·최신 checkpoint를 확인하고 이 판단 파일 전체를 가이드4의 입력으로 사용한다. 최종 제출용 정식 matrix/시나리오/검증 문서로 반영할 때 조건·보류·증거 수준·F01~03 의미를 보존한다. 판단을 다시 처음부터 조사할 필요는 없으며 변경된 기준선/새 증거가 있으면 해당 부분만 재검토한다.
