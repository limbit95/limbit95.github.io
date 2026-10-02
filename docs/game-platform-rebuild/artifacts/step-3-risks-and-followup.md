# STEP 3 — 리스크·회귀 판단·후속 책임

- 계획: 개정1.3 / STEP3, integration `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`.
- 직접 반영 입력: [Astra 판단 원문](step-3-astra-judgment.md), 입력 commit `41d78ef37f88cd7ea179c805fd9bf1141541284b`, blob `8341f47ef729403437b6778db78b252abc02da1b`.
- 상태: **정식 STEP3 제출 산출물 / 검토 대기**. 사용자 채택·현재 규칙 변경·Target 동결·구현 지원 완료가 아니다.
- 가이드4 Work Sol은 판단 내용을 새로 결정하지 않고 아래 원문 절을 그대로 반영했다. 조건·보류·미확인·후속 책임은 보존했다.
- 근거 추적: [source trace](step-3-source-trace.md). 본문 E번호는 S3-E번호의 약칭이며 X번호는 Astra의 외부 선택확인 기록이다. 이번 Sol은 외부 본문을 다시 검증했다고 주장하지 않는다.
- 사고 실험은 실행 테스트 PASS가 아니다. 모든 신규 runtime/DB/browser 실행 증거는 N/NOT_RUN이다.

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
