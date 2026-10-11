# Game Platform vNext STEP5C — Sol 판단 근거

작성 2026-10-10 KST · 담당 Sol/Codex
저장소 limbit95/limbit95.github.io · integration feature/game-platform-vnext-integration
고정 판단 입력 SHA: 2751e9241a3debbd40506fa1b2ea7e688dfe0140

이 문서는 Astra의 판단 입력이다. 보드 계승 위치·새 장르 규칙의 핵심 선택·최종 초안·정식 rulebook을 결정하지 않는다. 저장소 STEP5C 기록은 NOT_STARTED, 행동 NOT_RUN·UNKNOWN, 구현/실행/오픈 의무를 유지한다. 새 승인이나 STEP5C 완료를 뜻하지 않는다.

## 1. 입력·상태·증거 구분

입력 game-platform-vnext-step5c-plan-and-handoff.md를 실제 전부 읽었고, 원본 bytes를 별도로 확보했다.

| 원본 identity | 확인 |
|---|---|
| Library ID / file ID | libfile_a3e953e18a788191929cad929955fb42 / file_00000000365c820690c651c397b0e23c |
| version / bytes | 0 / 24,830 bytes |
| SHA256 | 5a03ffdadbd68b713e6d2fc491c8da489e5fea5786fc79693746602503b0eb2c |
| 원본 보존 | 계획 원본을 교체·수정하지 않음. 로컬 원본도 작업 전후 hash 대조 |
| 우선순위 | 유효 사용자 승인/DECISIONS·계획1.5·승인 원문 → 승인 STEP 산출물 → 계획/이 근거 요약. 충돌 시 원문 우선 |

F=직접 관찰 사실, A=유효 승인 요구/이미 승인된 판단 재사용, I=Sol의 적용 추론, U=미확인/후속 질문. 새 책임 위치를 확정하는 판단은 Astra가 한다. 구체 구현 기법·수치·API를 이 표의 I에서 새 의무로 승격하지 않는다.

상태 복원은 AGENTS → 계획1.5 → rebuild README → CURRENT → CP0084 → PR415 순서로 읽었다. 계획 준비 때의 상태 근거를 재사용하고 이번에 원격 HEAD/PR을 새로 대조했다.

| 항목 | F/A 결과 |
|---|---|
| 계획 | 개정1.5, blob da353e2e64daef6b1b0b7267c21997bfd7cda4ed |
| integration 실제 HEAD / 고정 기준 | 둘 다 2751e9241a3debbd40506fa1b2ea7e688dfe0140. 기준 뒤 추가 변경0 |
| PR415 | CLOSED / merged=true / base feature/game-platform-vnext-integration / merge 2751e9241a3debbd40506fa1b2ea7e688dfe0140 |
| STEP5B | COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED |
| STEP5C 기록 | NOT_STARTED 유지. 이번 허용은 근거 준비만 |
| 병합 전 OPEN·검토대기 | CP0084의 실제 PR/Git 확인 조건을 충족한 과거 이력. 현재 blocker로 되살리지 않음 |
| 행동·DB/browser/audio/두 client | NOT_RUN. 기존 UNKNOWN 및 구현/실행/오픈 의무 유지 |
| main/다음 STEP | main 별도 게이트, 반영·STEP6 이후 착수 없음 |

PR 증거: https://github.com/limbit95/limbit95.github.io/pull/415
이 문서의 trace 고정 SHA는 위 integration SHA다. STEP1의 원문 기준 132ec1576e316d0238c9ca6e07d0d3ab91950ec8, STEP2/3/4/5의 작성 당시 SHA는 역사 입력이며 현재 고정 입력과 구분한다.

## 2. 재사용 범위와 새 확인

이 문서의 STEP3 `C02`/`C09` 약칭은 각각 `S3-C02`/`S3-C09`다. 다른 STEP의 동일 번호와 혼용하지 않는다.

| 구분 | 실제 수행 | 제한 |
|---|---|---|
| 승인 입력 재사용 | STEP1 조항표/인벤토리, STEP2 장르·7축·네 문서 기록, STEP3 C02/C09/C10/C11·T01~06, STEP4A/B·STEP5A/B 해당 계약, 유효 DECISIONS를 읽고 연결 | 기존 판단을 재수행하지 않음. 과거 artifact 헤더의 REVIEW_PENDING은 당시 제출 상태 |
| 원문 새 대조 | development/UI/governance/DB contract/games README/AGENTS의 관련 절. 고정 tree blob과 STEP1 inventory 대조 | 6파일 모두 기존 blob 그대로. 기존 전체 source/SQL·운영 감사 없음 |
| 추가 공식 근거 | E01 W3C Keyboard, E02 Pointer Events, E03 HTML 렌더 기회/animation callback | 입력 취소·접근성·비가시 상태의 독립 요구 공백만 확인. 새 renderer/input engine·표준 전체 준수 의무 채택 아님 |
| 외부 과거 근거 | STEP3 X01~07 중 필요한 개념과 그 확인 한계 재사용 | 공급자/가격/제품 권고 재조사 없음. 최신 지원/운영 정의 전수 확인 주장 없음 |
| 실제 source/tests | 이번 새 JS·SQL·게임 소스 분석·테스트 실행 없음. 기존 source trace/관찰·테스트 범위 재사용 | 새 consumer 구현·지원 완료로 표시하지 않음 |

STEP2의 선택49조항은 전수 계승표가 아니다. STEP1의 K/L/H/I는 원 강도·범위/기존 game-local/역사/문맥 구분이다. 아래 선택 근거와 부록은 STEP5C 관련 부분만 추출하며 남은 조항을 폐기하지 않는다. STEP6/7의 전수 목적지·권위 전환 검증 의무는 남는다.

## 3. 보드게임 규칙 계승 근거표

아래 “검토 묶음”은 STEP1/2의 기존 분류와 논리적 후보를 설명한다. 새 소유 문서·절 또는 파일 경로를 Sol이 선택한 표가 아니다. 정확한 개별 강도·본문·source 줄·부모절은 §11 부록과 고정 원문을 따른다.

| ID / 검토 묶음 | F 현재 원문·owner | A 보존 의미·조건·예외 | I 분리할 때 확인할 점 / U Astra 질문 |
|---|---|---|---|
| B01 조사·개발 순서 / DEV-035~044, DEV-386, UI-010/011/015 | development §3A/15, UI §2. E-DOC/E-UI. DEV-035~044 서술형, DEV-386 REQUIRED_SHAPE/검증 문맥 | 조사→규칙·디자인/자산→네 문서→작은 구현/검증. DEV-044는 공개된 기존 보드게임 조건. §15는 online/stateful/Room 등 조건별 적용 | 일반 조사 절차와 보드 판본/구성물 의무를 한 장르로 통째 이동하면 일반 의무 누락. 어느 조각을 공통 참조하고 어느 조각을 보드 규칙으로 계승할지? |
| B02 판본·출처·자산 / DEV-044, DEV-288, UI-027~032 | UI §3 MUST, development 공개 보드게임 출처 규정. E-UI/E-DOC | 목표 판본·혼합 금지 기준·확인일/출처·권리 상태; 불명확 자산 사용 금지; 독자 표현 허용. 원문 장문 복제 금지 | 자산 확인은 다른 장르도 필요하나 “판본/실물 구성물” 적용은 조건부. 일반 권리 의무를 보드 전용으로 축소하지 말 것. 장르에서 추가 조사할 것은 무엇인가? |
| B03 실제 보드 공간 / UI-170~177 | UI §7. STEP1 B 분류, UI-171은 예시 도입 CONTEXT/I. E-UI | 실제 정보 읽기/구성물 다루는 방식 조사. 중앙/개인/카드·칩/공개·비공개/진행방향의 예시 문맥. 가독성 해치면 웹 adaptation 허용, baseline/후속 이유 기록 | 예시를 모든 장르의 중앙 보드·카드 배치 MUST로 만들지 않음. 정보 접근·배치 원칙과 보드 특화 조건을 어떻게 분할/참조할지? |
| B04 네 문서 역할 / DEV-045~078, UI-098~118 | development §3A, UI §6. MUST 절의 세부 문장 강도 보존. E-DOC/E-UI | GAME_SPEC 현재 규칙/기능, DEVELOPMENT 기능 handoff, UI_DESIGN 최초 baseline, UI_DECISIONS 후속 유효 override. 초기 조사 오류 정정 예외도 이유 추적 | 새 장르 추가항목을 네 문서에 연결하되 동일 TODO·API·상태를 여러 문서가 독립 소유하지 않도록 할 책임은? |
| B05 수동 검토·기록 / DEV-061~068, UI-102/118, DEV-386 | 기능 완료 후 디자인 수동 리뷰 gate 및 baseline/current track 연결. E-UI/E-DOC | 자동 기능 검증≠디자인 polish. 실제 브라우저 플레이·의미 있는 변경 결정·회귀 방지·closeout. 모든 CSS 수치 changelog 금지 | 공간형의 조작성·카메라·피드백을 추가 검토할 때 공통 수동 리뷰 gate를 복제/약화하지 않을 연결은? |
| B06 세션·8 surface / DEV-220~237 | development §6, E-ROOM. DEV-229의 비보편성, DEV-235 전체 surface 구현, DEV-236/237 서버 판정/UX 대체 금지 | Room 의미가 있는 온라인 모델에서 우선 검토. 기존 adapter 선택 시 8메서드 실제 의미 구현. 자연스러운 lifecycle과 다르면 no-op/local 우회 금지, 최소 확장/분리 검토 | Room 없는 solo, 초기 자동시작, multiplayer 재대결의 각각 다른 적용을 설명. 8메서드 형식과 권한·수명 보장은 다름 |
| B07 온라인 권위·DB 안전성 / DEV-246~251, DB-006~018 | development §7, DB contract 필수11 도입문. E-DB | 기존 온라인 적용 범위 보존. private 없는 게임도 비노출 검증. STEP4B J06이 비DB 동등 경계를 승인 설계로 제공 | DB 모델 상세 규약과 상위 안전 의무를 구분해 참조할 위치가 필요. 현행 원문을 면제/수정한 것으로 해석하지 말 것 |
| B08 snapshot/복구 / DEV-259~272, STEP4B J02~05 | development §9, DB 모델. E-DB. version/invalidation/authoritative refresh·정리 | 상태 최신성·권한·복원 안전은 유지. STEP4B가 DB initial/live·quiet loss 및 stream checkpoint/tail 의미를 구분 | 정수 version·DB invalidation을 모든 장르에 강제하거나 새 장르 이름으로 안전 의무를 없애지 않음. 어떤 절을 model 참조로 둘 것인가? |
| B09 규칙 안내·안전 종료 / DEV-285~298, UI-061~082 | development §10A의 MUST 및 UI §5A의 MUST/SHOULD/MUST NOT 혼재. E-DOC/E-UI | 시작 전 상세 안내와 플레이 중 재접근, 파괴적 종료 확인, server 권한, terminal 복원, 이탈/entry 후속; browser close≠경기 종료. 지속 세션 적용 조건 | “턴 순서/승리”라는 설명 항목을 턴·winner가 없는 게임에 가짜로 만들지 않으면서 동등한 행동/목표/종료 안내를 어떻게 보존할지? |
| B10 재대결 / DEV-299~311, DB-038~044, UI-190~198 | development §10B, DB rematch, UI §9. E-ROOM/E-DB/E-UI. DEV-301 REQUIRED_SHAPE; DEV-302~311 MUST 문맥 | multiplayer terminal 이후 같은 참여 맥락·명시 의사·준비/host 시작·서버 조건·safe leave·복원. 같은 RPC 이름 강제 아님 | 초기 hostless≠재대결 hostless. 게임규칙상 host 불성립은 상위 변경 검토, 정책 미정은 미확인. solo 비적용과 multiplayer 면제 혼동 금지 |
| B11 motion/결과/반응형 / UI-178~206 | UI §8~10, E-UI. 구성물 사례와 서술형 규칙, 결과 UX | 행동 원인과 권위 결과 연결, 동기화 안정성·확정성, desktop/mobile 핵심 action, hover 단독 금지, overlay 차단 확인 | 실시간 이동 입력의 피드백은 서버확정까지 모든 화면을 멈춘다는 뜻인가? 승인 prediction/확정 분리를 참조하되 새 UX 정책은 Astra 판단으로 남김 |
| B12 topic-owner/상위 변경 / DEV-350~362, GOV-037, GUIDE-019 | development §13A, governance 및 games 진입. E-GOV/E-DOC | 상위 충돌 시 사용자/maintainer 합의→Architecture Change→원자 정합화/영향도. 하위 임시 예외 구현 금지 | 새 장르 규칙의 독립 요구가 model 보완인지 상위 의미 변경인지 판별하는 절차. 현재 규칙/Guard 실제 전환은 STEP6/7 |

원문 강도가 없는 서술형을 새 MUST로 바꾸지 않는다. 위 범위의 맥락·예외·현재 owner는 원문 조항과 부모절에서 함께 확인한다. games별 카드/칩/승리 계산·UI baseline은 L/game-local 참고이며 공통 보드 규칙으로 자동 승격하지 않는다.

### 3.1 현재 범위 긴장과 승인 계약의 관계

| ID | F/A 현재 근거 | I 적용 주의 / U 판단할 부분 |
|---|---|---|
| C01 DB 적용 범위 | DB-006 “모든 신규 온라인”, DEV-386 online/stateful 조건; STEP3 matrix 현재 규칙 주의; STEP4B J06 비DB 동등11 | 동등 의미 설계 승인≠현행 DB 문서 변경 완료. 장르 규칙이 참조할 상위 안전성과 모델 상세·정식 권위 전환을 분리할 것 |
| C02 host/rematch | DEV-229 vs DEV-299~311; STEP2 S2-R03·STEP3 C09 a/b/c/d; STEP4B G06 두 Probe 제한 해소 | 두 Probe 승인 범위는 유지. 미래 hostless multiplayer 전체가 해소됐다고 확대하지 않음. 현재 재대결 UX를 약화하는 새 선택은 명시적 상위 게이트 필요 |
| C03 화면/결과 표현 | UI §9 winner/host 표현, DEV §10A 설명 항목; STEP5B J01~04/13 결과 없음·outcome/viewer | 현행 표현 사례를 모든 장르의 도메인 schema로 강제하지 않고 의미별 적용 조건을 어떻게 설계할지. 기존 게임 화면 수정은 대상 아님 |
| C04 모션·예측 | UI §8 authoritative 결과 반영, STEP4B J05·STEP5B 여섯 중복 의미 | 잠정 움직임 표현과 최종 도메인 결과·효과 소비의 구분을 드러낼 규칙. 예측 효과를 확정 보상·SFX 재발행 근거로 삼지 않음 |
| C05 책임/경로 | STEP1 목적지 미정, STEP2 genre index 논리 묶음, 계획 STEP6 물리 배치 | STEP5C의 논리 위치 설계와 STEP6 전수 목적지/경로 동결, STEP7 실제 rulebook 적용을 혼동하지 않음 |

이는 승인 완료된 공급자/운영 정책을 다시 결정하라는 목록이 아니다. 현재 원문 적용 범위와 새로운 장르 설계에 필요한 연결 질문이다.

## 4. 첫 비보드 Probe — 독립 장르 요구 근거

첫 Probe의 승인 범위는 작은 실시간2D 온라인 협동 수직 Slice다. 실제 게임·세계 구조·카메라·명령·예측·물리·renderer/transport·갱신 빈도는 선택되지 않았다. 아래 N행은 사실/승인 요구와 파생 질문이며 규칙 최종 초안이 아니다.

| ID / 항목 | F 또는 A 근거 | I 보드 전제와 다른 확인점 | U Astra/후속에 남는 부분 |
|---|---|---|---|
| N01 flow | STEP3 C02 동시 이동/행동·지속 진행, 준비/종료는 이벤트 가능. STEP2 축① | 턴 하나를 기다리는 입력/허용 상태만으로 지속 행동의 시작·유지·취소·해결 의미를 설명할 수 있는지 확인 | 실제 목표/실패·협동 행동·phase·동시 행동 충돌은 Probe GAME_SPEC 선택. 장르 범위의 최소 질문을 Astra가 설계 |
| N02 입력 | STEP2 축②/⑥, E02 pointer stream 취소 가능; mobile5기능 기존 의무 | 단발 클릭 외 눌림/해제·연속 방향·복합 입력·포커스/취소·기기 전환을 구분할 필요. 이는 입력 엔진 선택 아님 | 취소/blur 뒤 남은 intent의 의미와 재활성 조건. 키/터치/마우스/게임패드 중 실제 제공 장치 미선택 |
| N03 공간·카메라 | C02 격자/연속·2D, C07 3D는 장르 아님. UI170~177 보드 adaptation | 보드 중앙/개인 영역 배치를 이동 공간·가림·카메라 추적·위치/좌표 이해의 대체물로 쓰지 않음 | 고정/이동 카메라·viewport·경계/충돌·선택 물리·좌표 투영 조건 미선택. 제품 필요 없는 항목은 비적용 이유 |
| N04 시간 | STEP2 FPS/simulation/physics/network/input/audio 분리; STEP4B J02; E03 hidden 문서는 render 갱신에서 제외 | render callback 횟수를 경기 시간/권위 순서로 등치하지 않음. background·큰 시간 간격·resume 시 의미 질문 필요 | clock 비교·pause/resume·catch-up/폐기 정책은 선택 모델 판단. 임의 60Hz/physics/network 수치 동결 없음 |
| N05 권위·순서 | STEP4B J01~02, C02 상태별 권위/stream 순서; relay≠검증 | 게임 진행 권위·전달·prediction·reconciliation 각각 질문. 보드 RPC 이름·integer version을 통째 복제하지 않음 | 모델의 commit/순서/충돌 범위 구체 형식은 후속. 새 권위 선택은 승인 설계를 다시 결정하지 말고 실제 공백만 표시 |
| N06 가시성·역할 | C08/C10/T03, STEP4B J08~09, STEP4A viewer 수명 | 공간에 표시되는 모든 entity가 모든 사용자에게 전송 가능한 정보라는 전제 금지. 카메라 가림≠서버 권한 필터 | 팀/private 유무·관전/중도참가 채택 미선택. 없음이면 비노출 근거, 있음이면 현재 authorized view·입력 활성 조건 |
| N07 시작/종료 | DEV236/237·285~311, STEP4A 관계, STEP5B J01 | 시작조건·UI 준비·권한 착수·경기 종료·local detach는 별개. browser close/pause를 authoritative 종료로 처리하지 않음 | 첫 Probe의 선택 세션·ready/rematch·탈퇴/host 승계·terminal 범위의 적용 조건 |
| N08 중단·복구 | STEP3 T04, STEP4B J03~04; C02·C10 | 재연결 trigger≠현재 상태 복원≠history replay. initial checkpoint와 이후 갱신 공백·quiet loss·gap에 대한 승인 계약 참조 | 동작 재개 시 현재 view/owner·입력 수용 조건, 복구 불가 표시. 구체 replay 보존과 장기 상태는 선택 시만 |
| N09 전체 수명 | STEP4A §6/T01~03, STEP5A 단일 model 채택·복구 | 입력·카메라/DOM·render task·timer·listener·effect·늦은 자원도 success/error/null/finally/cleanup/leave 보호 대상 | 구현별 정리·취소 지원/소유권은 실제 구현 증거. 신규 lifecycle 엔진을 Adapter에 숨기지 않음 |
| N10 피드백·결과 | UI motion·STEP4B J05·STEP5B J01~04/J13, 여섯 중복 의미 | 이동/예측 표현과 공식 성공·결과·참가자 outcome·관전자 효과 분리. 재조회/재시뮬레이션은 보상·SFX 새 발행 근거 아님 | 실제 결과 필요·표현/SFX·효과 식별은 game-local/해당 모델 선택. 공통 결과 화면 강제 없음 |
| N11 접근성 | UI responsive/규칙 안내·수동 검토; E01 keyboard의 기능/경로 조건 | pointer만 쓰는 메뉴·시작/종료·규칙 안내와 본질적 실시간 조작을 구분해 대체 입력/발견 가능성 질문 | 장르별 대체 조작/가독성·포커스·명확한 피드백의 기준은 Astra 판단. WCAG 전면 채택·준수 인증을 이 근거가 결정하지 않음 |
| N12 반응성·성능 | STEP4B T12/T13 및 CP0075 유지: 총100/판8, 원격 p95≤250ms, 정상망 회복 각≤5초, mobile5기능 | DB 왕복이나 prediction frame만으로 권위 반응 목표 충족을 주장하지 않음. 공간·입력 반응과 end-to-end 권위 측정을 구분 | 지원 단말/망·샘플 조건·측정 오차·render/input 부하·지연 편차·네트워크 queue의 실측 미확인. 기존 제안 표본은 승인 수치와 구분 |
| N13 검증 | STEP4B 안전11·A/C/P, STEP4A T01~03, STEP3 transition, STEP5B owner | state convergence와 조작성·표현·실측·권한·정리를 각각 관찰해야 함. 오래된 invalidation 테스트만으로 실시간 품질 PASS 불가 | 실제 unit/model/두 client/모바일/manual/운영은 NOT_RUN. 장르별 oracle·미지원 표시는 설계할 수 있음 |

### 4.1 새 공식 확인 — 최소 공백에 한정

확인일 2026-10-10 KST. 아래는 웹 플랫폼 근거다. 청파 같이의 장르 규칙·라이브러리·성능·지원 범위를 자동 확정하지 않는다.

| ID | 출처·확인 위치 | F 확인 사실 / I 적용 / 한계 |
|---|---|---|
| E01 | W3C WCAG2.2 Understanding SC2.1.1 Keyboard, SC/Intent/Examples. https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html | F: 기능의 키보드 조작 기준과 본질적인 경로 의존 입력 예외를 설명하며 실시간 헬리콥터 훈련 사례도 든다. I: 메뉴·종료·안내와 gameplay의 조작 본질/대체 경로를 별도로 검토할 근거. 문서는 informative 설명, WCAG 전면 적용 승인·실제 접근성 PASS 아님 |
| E02 | W3C Pointer Events Level3 Recommendation 2026-06-30, §4.1.3.3/4.2.7/4.1.4. https://www.w3.org/TR/2026/REC-pointerevents3-20260630/ | F: stream 억제 시 pointercancel·out/leave·capture 해제, layout 변경의 boundary 사건을 규정. I: 단발 up만 기다리는 입력/세계 좌표 전제가 충분한지 질문. browser 구현/장치별 실제 동작 미시험, pointer capture 기법 필수화 아님 |
| E03 | WHATWG HTML Living Standard, 8.1.7.3 update-the-rendering 및 animation-frames. https://html.spec.whatwg.org/multipage/webappapis.html#update-the-rendering ; https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames | F: hidden/렌더 기회 없는 문서를 rendering 처리에서 제외하고 animation callbacks를 별도 처리. I: render 주기를 권위 시간으로 쓰거나 background 후 무조건 동일 상태로 재개하는 전제를 검토할 근거. 모든 timer/서버가 멈춘다는 주장이나 특정 브라우저 재개 보장 아님 |

새 요구의 최종 문구·강도·owner는 이 자료가 아니라 Astra/사용자 판단 대상이다. 구체 camera·물리·동시 협동 gameplay의 공식 제품 사례를 추가 수집해 특정 게임을 선택하지 않았다. 그 항목의 경험 범위는 기존 C02 및 계획의 제한 Slice로 고정하고 실제 선택·상세 근거는 후속 GAME_SPEC/Probe 단계로 남긴다.

### 4.2 과거 공식 조사 재사용과 한계

| 기존 ID | 재사용할 개념 / 원문 위치 | 기존 확인일·한계 |
|---|---|---|
| STEP3 X01 / R02 | Nakama authoritative active/passive 진행, 상태별 서버 판정 사례. https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/ | 2026-10-01 기존 선택 원문 확인. 장기 진행이 항상 지속 tick을 요구하지 않는 반례. 이번 최신 제품 조사/도입 권고 없음 |
| X02 | Nakama relay forwarding·client host와 내용 검증 분리. https://heroiclabs.com/docs/nakama/concepts/multiplayer/relayed/ | 기존 확인 재사용. site 서버 권한 집행 면제 근거 아님 |
| X03 | GGPO save/load·결정적 재실행·render/effect 분리. https://github.com/pond3r/ggpo/blob/master/doc/DeveloperGuide.md | master 고정commit 미확인이라는 기존 한계 유지. 보상/영속 집계 정확성 증거 아님 |
| X05/X06/X07 | late join cache, recipient별 전달, TTL/rejoin 조건 | STEP3 risks §7 원문 참조. 프로젝트 전체 viewer/복구 지원 증거 아님. 신규 제품 조사 없음 |
| R07/R10~13/R17 | 과거 보고서의 엔진/visibility/RTS 자료 | 판본/수치/원문 미검증 한계를 유지하며 이번 규칙 수치·제품 판단 근거로 사용하지 않음 |

## 5. 두 번째 Probe — 규칙 필요성의 판단 입력

Probe 게임을 새로 선택하지 않았다. 아래는 기존 C09/C11·STEP5B §6.1에 근거한 차이다.

| 책임/경험 | F/A 사용할 기존 근거 | I 적용 가능성 / U 판단 질문 |
|---|---|---|
| room/host 없는 solo local | STEP4A 실행 수명·room 비필수, STEP5B Probe2, C09a | 공통 등록·진입·종료·자원 소유와 기반 경험 규칙 적용 가능. hostless 자체를 장르 묶음으로 만들 필요 여부는 Astra 판단. 실제 local 권위의 범위는 GAME_SPEC |
| 초기 hostless multiplayer | C09b·DEV229~237/311 | 초기 host 없음만으로 별도 규칙 변경 필요로 단정 불가. rematch는 기존 조건 충족하는지 따로 확인 |
| 재대결 hostless multiplayer | C09c·DEV311 | 의미상 host 자체가 없으면 현행 상위 변경 검토 대상. game-local/no-op 면제 금지. 이번 Probe2의 선택된 필수 경험으로 새로 올리지 않음 |
| 재대결 정책 미정 | C09d | 현 규칙 적합성 미확인. 구체 제품 선택 전 조건부 질문으로 유지하며 전체 STEP5C를 자동 HOLD하지 않음 |
| 비동기·장기 진행 | C11·STEP4A 장기상태·STEP4B J04·기존 X01 | 동시에 연결되지 않아도 durable state/마감/참가 변경의 의미 필요. 기존 보드/기반 경험 규칙+지속성 모델 조건으로 충분한지, 별도 경험 규칙이 필요한지 판단 |
| 단일 run 기록형 | STEP5B Probe2/J01~07 | 단일 기록·집계·leaderboard·보상은 각각 별도 선택. server 제출이 있으면 local 권위 결과를 그대로 신뢰할 수 없음 |
| result 없음·Invite 미선택 | STEP5B J01·Probe2, STEP5A H4 | fake 결과/Room/host/초대 대상 생성 금지. 비room Invite 미래 미선택은 전체 blocker 아님 |

Astra 질문: “local/비동기/기록형”이 다른 장르 이름이어서가 아니라 조사·플레이 규칙·UX·완료 기준의 의미가 달라지는지로 별도 규칙 필요성을 판단할 근거가 충분한가? 공통·모델 문서의 조건 보완이면 충분한 경우와 실제 새 경험 규칙이 필요한 경우를 구분해달라. 현재 제품 미선택을 임의의 대표 게임 채택으로 채우지 말 것.

## 6. 공통/장르/모델 문서 연결 근거

| 의미/현재 owner | F/A 책임 근거 | I 연결 시 보존할 것 / U 설계 질문 |
|---|---|---|
| 플랫폼·공통 개발/품질 | 계획 §2~3, DECISIONS D0001/2, development 조사·네 문서·수동 gate | 공통 절차는 상위 한 책임 문서, 장르에서 적용/추가항목 참조. 장르마다 전체 흐름 복제 금지 |
| 장르/경험 규칙 | 계획 최소6항목, STEP2 genre index, STEP1 B 묶음 | board/card 및 실시간 협동/공간 경험의 독립 요구. 장르명으로 실행 모델·Profile·engine을 결정하지 않음 |
| 선택 모델 | STEP2 7축, STEP4A 책임, STEP4B runtime J01~06 | 권위·시간·입력/공간·복구·지속성 의미의 owner, 같은 모델을 서로 다른 장르가 참조할 수 있음. 장르 독점 모델 금지 |
| capability/Site Adapter | STEP5A 선택/STEP5B owner·중복 기준 | 선택 기능·identity/route/BGM·공용 owner 연결. token/audio/인가 엔진을 Adapter에 감추지 않음 |
| 개별 GAME_SPEC | development §3A/15, STEP2 rationale | 제품/모드·적용 장르/계약·7축 이유·미지원/미결정·상태/검증. 규칙 추가를 네 문서 전체 중복 본문으로 쓰지 않음 |
| DEVELOPMENT | development §3B | 실제 기능 Phase/branch·진행·검증·다음 작업. 독자 게임규칙/UI 설계 확정 owner 아님 |
| UI_DESIGN / UI_DECISIONS | development §3A, UI §6 | 최초 독립 장르 공간/조작·VI baseline vs 후속 override. 가이드 상위 본문이 게임별 비주얼을 소유하지 않음 |
| Governance/Guard | development §13A/14B, governance, STEP6/7B | 새 논리 연결을 설계하되 실제 탐지 경로/권위 전환/Guard 수정은 후속. 새 draft 존재≠CURRENT rulebook 적용 |

소프트웨어 owner의 이미 승인된 Core/runtime-model/capability/Site Adapter/game-local/backend 경계를 재사용한다. 모델 작업 담당은 별개다. 이번 Sol/Codex는 근거만 준비, 다음 Astra는 핵심 경계 판단, 승인 후 Sol/Codex는 문서 반영·기계적 검증을 맡는다.

### 6.1 신규 장르 요청의 절차 근거

1. F/A: 현재 AGENTS/development는 원본 규칙·제품 범위·디자인/권리 조사와 네 문서를 runtime 전에 요구한다.
2. F/A: 계획 §3은 적합한 규칙 묶음이 있으면 참조/보완하고 실질적인 새 요구면 신규 문서를 작성·검토하도록 한다. 모든 미래 장르의 규칙을 지금 완성하지 않는다.
3. F/A: STEP2는 장르 묶음과7축 특성·Capability 선택, 규칙/계약/실제 증거의 세 상태를 따로 기록한다.
4. F/A: 하위 topic-owner가 상위 안전성/계약과 충돌하면 Architecture Change 합의가 선행한다. 단순 장르 추가는 별도 플랫폼 생성 허가가 아니다.
5. I/U: 새 묶음 필요성을 검토하는 질문, 최소6항목의 책임/출처/적용 조건·검토 gate, 혼합 장르 충돌 담당을 Astra가 설계할 수 있다. 물리 경로/Guard/버전·CURRENT 권위 전환은 STEP6/7에 남긴다.

## 7. 계획 §3 최소6항목 — 근거/공백 표

| 최소항목 | 확보 근거 | 정확한 미확인 / 결론에 필요한 수준 |
|---|---|---|
| 1 범위·출처 | 계획 first/second Probe 범위, C02/C09/C11, B01~03, 새 E01~03·과거 X | 실제 Probe 게임/판본/콘텐츠 미선택. Astra는 제한 실시간협동·공간형 규칙의 범위를 설계할 수 있으며 대표 제품을 임의로 채택할 필요 없음 |
| 2 플랫폼 연결 | STEP2 7축, STEP4A/B 및 STEP5A/B owner·조건 | 적용 조건과 논리 참조표 설계가 남음. final API/file/model명/프로필은 이번 blocker 아님 |
| 3 독립 장르 요구 | N01~13, 취소/비가시 rendering/접근성 새 근거 | 구체 조작·camera·물리·gameplay·입력 취소/재개 제품 의미 미정. 필수 질문/비적용 조건과 실제 제품 선택을 분리해 판단 |
| 4 개발/문서 보완 | DEV033~087/386, UI baseline, STEP2 rationale | 장르별 네 문서 추가 질문·보드에서 채택하지 않을 전제의 설명. 공통 흐름 자체는 승인 입력 재사용 |
| 5 검증·완료 기준 | 안전11, T01~03/transition, 품질/모바일/수동 gate, NOT_RUN | 실제 장치/망·측정 오차·샘플·oracle/미지원은 구체화·실행 의무. 근거 없는 새 성능 수치 의무 생성 금지 |
| 6 권위·이력 | Governance/Architecture Change, D0001~10 대체 관계, STEP5B owner, 원본 identity | draft 상태·topic-owner·중복/혼합 충돌 절차의 설계 남음. 실제 CURRENT 전환·Guard 적용은 STEP6/7 |

## 8. 보존해야 할 승인 조건

- 기존 Auth·게임 무이관. 기존 규칙/게임별 baseline·유효 UI_DECISIONS/기존 public API·SQL을 변경하지 않는다.
- STEP4A 전체 완료 경로와 T01 같은Room 새Match, T02 A→B→A, T03 role/view/user 변경 보존. room ID 또는 version만으로 수명 안전을 선언하지 않는다.
- CP0075/D0010의 A/C/P: 잠금/현재 predicate 후 같은 transaction 저장 착수 A, 실제 commit C, recipient/view/payload별 새로운 송신 P를 구분한다. known expiry 뒤 새 A 금지, 동일 transaction late C 제한 수용/실제 C 관측, retry/새transaction fresh A, 새 P fresh 인가, owner anchor, 최초60초/terminal 보호.
- D0006~10 부분 대체만 적용한다. D0010은 일반 저장 지연 C 범위/Z1만 대체, D0008의 입증된 정지 한계와 혼동 금지. old strict C·HOLD 원문은 당시 이력.
- 기존 성능/비용/운영/기록·30일삭제·탈퇴unlink·backup/RPO24h/발견후24h/7일복구점·Free서울 의무 및 UNKNOWN 유지. 공급자/운영 재결정 없음.
- Registry 두 번째 metadata 목록 금지. Access Gate/표시값≠backend 권한.
- Snapshot/Reconnect는 선택 모델의 단일 최종 채택·복구, Shell 공통 표시/game-local UI, BGM 기존 본체+내부 최소수명/H1 무보완직결 보류, Invite 전구간identity·사이트handler/dialog/H2~4 유지.
- STEP5B 종료/공식 결과/개인outcome/관전자 표현·producer/consumer·정정≠새경기 집계, 여섯 중복 의미 보존. 예측/동일snapshot 재적용은 보상/효과 재발행 근거가 아니다.
- merge/구현/activation/공개 사실/NEW·공지 소비 분리, Profile은 검증된 반복 조합 recipe. 선제 token/audio/통계/보상/공개/Profile 엔진 없음.
- STEP6 Target/API/schema/file/class/경로 동결, STEP7 규칙·Guard 적용, Probe 실제 개발/시험을 앞당기지 않는다.

## 9. Astra 핵심 질문과 미확인의 성격

| 질문 | 필요한 핵심 판단 | 근거 / 결론 blocker와 후속의 구분 |
|---|---|---|
| Q01 보드 계승의 분할 | 공통 조사/VI·권리·기록·검증과 보드 판본·실물 공간·정보/행동 규칙을 어떤 논리적 묶음/참조로 보존할지 | B01~05/11·부록. 원문 근거 확보. 일부 항목 강도/범위 누락이 있으면 그 행만 조건부 보완 |
| Q02 실시간 협동/공간형의 독립 요구 | N01~13 중 장르가 정의할 경험 질문/기준과 선택 모델이 소유할 의미를 어떻게 나눌지 | 게임 제품 미선택은 일반 규칙 설계 전체 blocker가 아님. 특정 조작/카메라/빈도 동결에는 해당 제품 근거 필요 |
| Q03 hostless/rematch | solo·초기hostless+준수rematch·재대결host불성립·미정 각각의 적용 조건 | C02/Probe2. 미래 미선택 multiplayer 변경은 현재 전체 blocker로 확대하지 않음. 실제 기존 의무 완화 선택이면 사용자 상위 승인 필요 |
| Q04 DB 계약 적용/동등 안전 | 안전11·인가/정보보호와 DB snapshot/version/invalidation 상세를 어떻게 참조하고 권위 전환을 남길지 | C01/STEP4B J06. 원문 전환 미수행 자체는 설계 연결의 후속 의무. 하위 장르 면제는 허용 안 됨 |
| Q05 시간/조작/표현·품질 | 본질적인 입력시간·render/simulation·피드백/확정·중단·접근성의 최소 질문과 검증 조건 | N02~04/10~13·E01~03. 구체 브라우저/단말 성능은 실행 의무. 새 수치/엔진 선택 근거로 쓰지 않음 |
| Q06 둘째 Probe 별도 규칙 | 기반 경험 규칙+local/지속성 모델 조건으로 충분한 경우와 새 경험 규칙이 필요한 조건 | §5. 실제 게임 선택 전 조건부 필요성 판단 가능. 결과/보상/Invite 강제 없음 |
| Q07 문서 연결/혼합/추가 절차 | 한 의미 한 owner, 공통 참조·장르 추가, 혼합 충돌·상위 변경·원본 이력 gate | §6/7. 실제 경로/버전/Guard 전환은 STEP6/7 |
| Q08 승인·정지 경계 | 지금 사용자에게 승인받을 설계 내용과 이후 정식 반영/최종 검토/병합을 분리 | NOT_STARTED·NOT_RUN/UNKNOWN 유지. 이번 근거로 결과 승인·COMPLETED 선언 금지 |

Sol이 “추가 설계 blocker 없음”을 최종 판정하지 않는다. 현재 확보 자료로 Astra가 판단할 질문을 위와 같이 특정했다. 원문 근거의 해당 범위/강도를 확인할 수 없거나 새 요구가 상위와 충돌하는데 해결 의미가 없으면 그 선택만 조건부/보류다.

후속 구현/실행 항목: 실제 consumer의 입력 취소·포커스/기기 전환·viewport/camera·state convergence·initial/live/quiet loss·A/C/P·T01~03 전 완료경로·효과/정정 소비·mobile5기능·반응/5초·원본/권한·기록/삭제/복원·기존 게임 회귀. 전부 이번 NOT_RUN이며 기존 테스트 위치/이전 결과가 새 Probe PASS를 대신하지 않는다.

## 10. 다음 첫 작업과 그대로 사용할 Astra 프롬프트

다음 담당: Astra.
작업 하나: 아래 근거를 토대로 STEP5C 장르 규칙 설계의 핵심 판단안 작성.
판단 실행은 다음 사용자 요청으로 남긴다. 이번 자동 문서화는 저장소 반영 승인이 아니다.

~~~text
Game Platform vNext STEP5C의 핵심 경계를 판단해줘.

담당: Astra.
입력 game-platform-vnext-step5c-evidence.md를 실제 읽어줘.
필요 시 game-platform-vnext-step5c-plan-and-handoff.md.
저장소 limbit95/limbit95.github.io.
integration feature/game-platform-vnext-integration.
고정 판단 SHA 2751e9241a3debbd40506fa1b2ea7e688dfe0140.

AGENTS → 계획1.5 → rebuild README → CURRENT → CP0084 → PR415 순서로 필요한
상태를 복원하고 실제 원격 HEAD와 고정 SHA를 대조해줘.
근거의 상태/blob/원문 확인을 재사용하며 추가 변경·의미 충돌만 분리해줘.
STEP5B COMPLETED/DESIGN_RESULT_APPROVED/INTEGRATION_MERGED,
STEP5C 기록 NOT_STARTED·행동 NOT_RUN·UNKNOWN·구현/실행/오픈 의무와 main 별도
게이트를 유지해줘. 과거 OPEN/HOLD/미병합은 유효 결정·실제Git과 당시 이력으로 읽어줘.
Sol의 근거는 최종 계승 선택표·승인된 새 장르 규칙이 아니다.
요약과 승인 원문이 충돌하면 유효 결정·원문을 우선하고 차이를 명시해줘.

범위:
1. 보드게임 규칙의 논리적 계승 설계. 근거 §3/B01~12·부록 ID/강도·부모절·조건/예외를
보존해 공통/보드/기술모델/game-local의 책임·분할/참조 관계를 제시해줘.
STEP2 49조항을 전수표로 오해하지 말고, STEP6/7 전수 목적지 의무를 유지해줘.
2. 첫 비보드 Probe의 실시간협동/공간형 규칙 내용 초안.
계획 §3 최소6항목(범위/출처·플랫폼연결·독립요구·개발/네문서보완·검증/완료·권위/이력)을
채우고, 계승한 일반 절차와 독립적으로 설계한 조작/공간/시간/복구/품질 조건을 구분해줘.
장르명으로 transport/renderer/tick/물리/예측/게임을 확정하지 마.
입력취소·비가시/복귀·가시성/역할·잠정피드백/확정·전체수명을 고려해줘.
3. 둘째 Probe의 별도 규칙 필요성: room/host없는 local 또는 비동기·기록형을
기존 경험 규칙+모델조건으로 설명 가능한 범위와 새 규칙이 필요한 조건으로 구분해줘.
실제 Probe 게임을 새로 선택하지 마.
4. 공통/장르/모델 문서 연결표·혼합장르 충돌과 신규 장르 추가 절차를 설계해줘.
같은 의미의 의무는 한 owner 본문을 참조하고 장르마다 플랫폼/공통 절차를 복제하지 마.

기존 승인 STEP1~5B·DECISIONS를 재사용하고 완결된 구조/공급자/운영 선택은 다시 하지 마.
근거의 source trace·동일blob·과거공식확인 한계를 활용해줘.
결론을 바꿀 해당 공백/충돌에 한해 추가 원문을 읽고 고정 SHA/blob·줄/심볼과 영향을 남겨줘.
전체source/SQL감사·공급자/요금/운영 재조사·별도 사후 감사는 추가하지 마.
새 E01~03은 공식 웹플랫폼의 제한된 근거이며 새 엔진·WCAG전면준수·브라우저 지원 인증이 아니다.

반드시 보존:
기존Auth/게임무이관, 네문서 역할·baseline/유효override·수동gate,
STEP4A 전체완료/T01~03, CP0075/D0010의 A/C/P·knownexpiry뒤새A금지·
동일transaction lateC제한수용/실제C관측·새P/retry fresh인가·owneranchor·최초60초/terminal,
D0006~10와 성능/비용/기록/삭제/탈퇴/backup/복원/운영 UNKNOWN.
Registry 두번째metadata금지, Snapshot/Reconnect 선택모델 단일최종채택/복구,
Shell 공통표시/local연출, BGM 기존본체+내부최소수명/H1무보완연결보류,
Invite 전구간identity·사이트handler/dialogowner·H2~4.
STEP5B 공식결과/정정·producer/consumer·여섯중복의미·공개분리·Profile recipe.
비room미선택·미래보상/정밀audio/Profile을 전체blocker로 올리지 마.
Adapter안에 새권한/순서/수명/token/audio엔진을 숨기지 마.

현행 DB온라인적용과 비DB동등안전의 관계, 초기hostless/재대결host불성립/미정의
범위 긴장을 조건별로 다뤄줘. 모든게임에 Room/host/DOM/winner/score/XP 강제 금지와
기존multiplayer재대결 의무를 함께 보존하고 no-op/local우회로 의무를 없애지 마.
기존 상위 의미를 바꿀 필요가 있으면 해당 변경·승인항목만 명시해줘.
실제실행으로만 확인할 항목은 후속 의무로 남기고 그 이유로 모든 설계판단을 보류하지 마.

제출:
A. 보드게임 계승 설계표: 원문ID/강도/조건·논리적새책임·분할/참조·보존의미·미확인.
B. 첫비보드 규칙 내용 초안: 최소6항목·독립요구/공통재사용·owner·조건·검증/미지원.
C. 둘째Probe 규칙필요성, 공통/장르/모델연결·중복/혼합·신규추가절차.
D. 사용자 승인할핵심선택·실제설계blocker와 구현/실행의무·승인뒤Sol/Codex 반영범위,
다음첫작업 하나와 복사 가능한 인계프롬프트.
관찰사실/승인요구/Astra판단/미확인을 구분해줘.
논리적계승/내용설계가 STEP6의 경로/Target/API/schema/file/class동결이나
STEP7의 CURRENT권위전환/Guard적용이 되지 않도록 해줘.

결과를 game-platform-vnext-step5c-astra-judgment.md로 자동 문서화하고,
사용자핵심판단승인+명시적정식반영허용 뒤에만 사용할 Sol/Codex 전달프롬프트를 제공해줘.
판단안/제출문서만 작성하고 멈춰줘.
저장소변경·branch/PR/checkpoint·구현·실제시험·운영·구매/문의/job/dump/복원·
병합/main·STEP6이후는 하지 마.
이번 제출로 STEP5C COMPLETED·사용자승인·행동PASS·지원완료를 선언하지 마.
~~~

## 11. 고정 source trace 및 원문 ID 부록

아래 trace는 기존 근거 재사용 R과 현재 고정 원문 대조 N을 구분한다. 모든 Git 링크는 고정 SHA다.
source blob 같음은 규칙 내용이 변하지 않았다는 사실이며 기존 코드 준수/테스트 통과 인증이 아니다.
선택 조항 부록은 기존 table의 원문 ID·부모절·강도를 보존한다. 최종 소유 위치를 추가하지 않는다.



### 11.1 문서 trace

| Trace | 재사용/새 대조 | 고정 source·줄 또는 심볼 | blob | 사용 |
|---|---|---|---|---|
| T01 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-1-clause-succession-table.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clause-succession-table.md) · 분류/K·L·H·I·E owner / C03/R01·U01~03 | 18c3c76589a7db8303ca210886ba981dd8518813 | §§2~9의 관련 근거 |
| T02 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md) · 부록 선택 LEGACY ID와 부모절 | e1a6515b38db0164146ca3a51fc29aae60275c6a | §§2~9의 관련 근거 |
| T03 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-1-clauses-design.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md) · 부록 선택 LEGACY ID와 부모절 | 981555ea5fab6b3899ebd03599bac7e992f51691 | §§2~9의 관련 근거 |
| T04 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-1-source-inventory.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-source-inventory.md) · 전수 원문 문서/고정 source blob | 0d407aa9020ceab4785c5745e67f826bfeb4b94c | §§2~9의 관련 근거 |
| T05 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md) · 분류 원칙·49선택 조항·host/ready/rematch 경계 | 1c1f103adf56a160f1fba8e993cd7c38bbcf09e8 | §§2~9의 관련 근거 |
| T06 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md) · 7축 선택·규칙/계약/증거 독립·시간/빈도·Capability | 52d209d250ba76f351ea13db33aa6259ba641e71 | §§2~9의 관련 근거 |
| T07 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-2-game-spec-selection-rationale.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-2-game-spec-selection-rationale.md) · 기록 항목·장기 비동기 예시·미결정 | a5e7be7989c1daeedfb515f751aade754b7f1990 | §§2~9의 관련 근거 |
| T08 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md) · §2~3 S3-C02/C09/C10/C11 | 0236dccd268617edf14e6158f582cda9b25b8c8b | §§2~9의 관련 근거 |
| T09 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md) · S3-T01~06 | 036dab34e4445fb1a6059b4ca6bce0545a74ae94 | §§2~9의 관련 근거 |
| T10 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md) · §6 리스크·§7 X01~07/확인하지 않은 범위 | 9f291884fc0de2e4e0ff65a43f6d92002f62c9a7 | §§2~9의 관련 근거 |
| T11 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-3-source-trace.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-3-source-trace.md) · S3-E04~16 / source 관찰·기존 테스트 | 812100981f55fab9793b7ba44237399db76a5781 | §§2~9의 관련 근거 |
| T12 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-3-auxiliary-research-report.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-3-auxiliary-research-report.md) · §5 R01~17 확인일/판본/한계. 승인 risks의 선택확인 우선 | 2c14ae22a279859eabbfbba31a29eaf4911607e6 | §§2~9의 관련 근거 |
| T13 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md) · §2~4 책임·의존·규칙 연결 | 610efc904bdaec8881535d3405fe81102bd3d5df | §§2~9의 관련 근거 |
| T14 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md) · §5~8 / 전체 완료·dispose·T01~03 | 5e40988234caba6cb605ea4c0b386a0a5b83b9c5 | §§2~9의 관련 근거 |
| T15 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md) · CP0075 적용·J01~06 | a6cfe51029e3fc3b2b546222b6a6afb0ad428f14 | §§2~9의 관련 근거 |
| T16 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md) · CP0075 적용·J07~09 | e140c90d830ff891c2abd5e40b038249eeeb8ebf | §§2~9의 관련 근거 |
| T17 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md) · §1~4 / A/C/P·T delta·G01~06 | f3232f64c846bf4b17fcea2ae0bf6baed90ffc03 | §§2~9의 관련 근거 |
| T18 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-4b-verification-specification.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4b-verification-specification.md) · 사전조건/NOT_RUN·T01~14·품질 제안; Z1 현재 delta 우선 | 91d41480837c6ca3486b28aa1c615177d0fabcea | §§2~9의 관련 근거 |
| T19 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md) · §3~4 / Registry·Access·Room·Snapshot/Reconnect·Invite·Shell·BGM | e80d67aa5a3fa74ffcd441fa977fd4755d6d4c85 | §§2~9의 관련 근거 |
| T20 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md) · §6~8 / owner·H1~4·보류 해소/NOT_RUN | fb2fa919c12905153360209bb692a3adc626a42c | §§2~9의 관련 근거 |
| T21 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-5b-contract-boundaries.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5b-contract-boundaries.md) · §2~5 / J01~19·여섯 중복·결과 정정/공개/표현 | fb3c782d6aad08126c452099c6f67441ece20fd0 | §§2~9의 관련 근거 |
| T22 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-5b-duplication-and-extension.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5b-duplication-and-extension.md) · §6.1 두 Probe·6.2 반복/승격/Profile | b51394438a5bcedd284892c7552576fc90213f0a | §§2~9의 관련 근거 |
| T23 | R 승인/기존 근거 재사용 | [docs/game-platform-rebuild/artifacts/step-5b-compatibility-lifetime-verification.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5b-compatibility-lifetime-verification.md) · §7~9 / owner·설계blocker vs 실행의무 | 6dfa14d0c3056dc12d1388e9ab7295729137cc4a | §§2~9의 관련 근거 |
| T24 | N 현재 원문/상태 대조 | [docs/game-platform-rebuild/DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/DECISIONS.md#L1-L35) · L1~35, L49~96 | ab4896bd01b591895d0e30946a810c41eaa74e5a | §§2~9의 관련 근거 |
| T25 | N 현재 원문/상태 대조 | [docs/game-platform-development-rules.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-development-rules.md#L59-L177) · L59~177, L418~486, L509~614, L694~788 | 073a6d687e125a9358a6a67eaf3fc16bda4e2d0c | §§2~9의 관련 근거 |
| T26 | N 현재 원문/상태 대조 | [docs/game-platform-ui-rules.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-ui-rules.md#L9-L65) · L9~65, L107~149, L179~309, L311~395 | 76bd4dde0cc496c93e4af718b2f88ec12cc5e6d9 | §§2~9의 관련 근거 |
| T27 | N 현재 원문/상태 대조 | [docs/game-platform-governance.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-governance.md#L13-L62) · L13~62, L76~114 | a296fba84d6f04e2fbaf07e5cc64d4f59d3a0169 | §§2~9의 관련 근거 |
| T28 | N 현재 원문/상태 대조 | [docs/game-platform-db-test-contract.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-db-test-contract.md#L5-L29) · L5~29, L104~144 | ff5eaf6aa5e6459e098d607119033169ac05f5f1 | §§2~9의 관련 근거 |
| T29 | N 현재 원문/상태 대조 | [games/README.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/games/README.md#L1-L54) · L1~54 | 49c3d8604b8b24d6a5cf5e66d848b35a22610bee | §§2~9의 관련 근거 |
| T30 | N 현재 원문/상태 대조 | [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/AGENTS.md#L123-L135) · L58~94 및 L123~135 | 2686a3c37502bbf1f7f2a9407640e78cc026dadb | 작업 지침·vNext 별도 integration 운영 |
| T31 | N 현재 원문/상태 대조 | [game_platform_vnext_final_execution_plan.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/game_platform_vnext_final_execution_plan.md#L45-L151) · L45~151, L331~365 | da353e2e64daef6b1b0b7267c21997bfd7cda4ed | §§2~9의 관련 근거 |
| T32 | N 현재 원문/상태 대조 | [docs/game-platform-rebuild/README.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/README.md#L1-L9) · L1~9 | 8d5089f85b25e47645c96f8e9440c14b22e39ad8 | §§2~9의 관련 근거 |
| T33 | N 현재 원문/상태 대조 | [docs/game-platform-rebuild/CURRENT.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/CURRENT.md#L21-L50) · L21~50 | e68017705b8a2b57ab0304f0fe166209680105fe | §§2~9의 관련 근거 |
| T34 | N 현재 원문/상태 대조 | [docs/game-platform-rebuild/checkpoints/CP-0084-step-5b-integration-merge-approved.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/checkpoints/CP-0084-step-5b-integration-merge-approved.md#L1-L25) · L1~25 | 7be163b21c52ebb91306ff788fb58ec8efbb8903 | §§2~9의 관련 근거 |

### 11.2 STEP1 inventory와 현재 source 대조

6규칙 원문(AGENTS/development/UI/governance/DB contract/games README)의 blob이 STEP1 inventory와 모두 일치했다. 현재 원문 재대조는 관련 절만, 기존 원문 해석을 새로 계승 결정한 것은 아니다.

### 11.3 원문 ID·부모절·강도 anchor 부록

이 선택 anchor들은 전수 계승 완료표가 아니다. 각 상위 표의 범위에 대한 모든 sibling/조건은 링크의 원문 전체·도입문과 병독한다. 아래 행은 STEP1 table의 전체 행을 그대로 보존했다. 원문 전부가 MUST인 것은 아니다. ID 앞 LEGACY는 기존 조항 식별 prefix이지 Legacy 게임 한정이라는 뜻이 아니다.


**DEV — `docs/game-platform-development-rules.md` / 3A. 신규 게임 초기 세팅과 설계 문서** — [step-1-clauses-platform.md L212~223](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L212-L223)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-033 · L61–61 | 사용자가 `새 게임 만들자`, `&lt;게임명&gt; 개발 시작하자`처럼 신규 게임 개발을 요청하면 gameplay/runtime 코드부터 작성하지 않는다. 먼저 게임 규칙과 제품 범위뿐 아니라 원본 디자인과 Visual Identity까지 조사해 다음 작업자가 구현 방향을 복원할 수 있는 bootstrap 문서를 만든다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-034 · L63–63 | 기본 순서는 다음과 같다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-035 · L65–65 | 1. 게임의 원본 규칙과 구성요소를 조사한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-036 · L66–66 | 2. 공식/퍼블리셔 자료와 실제 구성물을 기준으로 색상, 심볼, 카드/보드/칩 구조, 레이아웃, 타이포그래피, 분위기와 자산 사용 가능 범위를 조사한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-037 · L67–67 | 3. 이번 웹게임에서 지원할 인원, 규칙 버전/변형, online/local 범위와 제외 범위를 정한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-038 · L68–68 | 4. `games/&lt;game-id&gt;/GAME_SPEC.md`를 생성해 현재 게임 규칙과 기능 구현 설계를 기록한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-039 · L69–69 | 5. `games/&lt;game-id&gt;/DEVELOPMENT.md`를 생성해 기능 개발의 현재 진행·검증 상태와 다음 기능 작업을 기록한다. | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-040 · L70–70 | 6. `games/&lt;game-id&gt;/UI_DESIGN.md`를 생성해 디자인 전수 조사 결과, Visual Identity, 독립 페이지 경험, 최초 UI/presentation Phase와 validation 기준을 runtime 개발 전에 기록한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-041 · L71–71 | 7. `games/&lt;game-id&gt;/UI_DECISIONS.md`를 생성해 이후 의미 있는 디자인/interaction 변경, 대안, 결정 이유, 구현 상태와 디자인 검증 이력을 기록할 자리를 만든다. | 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-042 · L72–72 | 8. 규칙 해석, 디자인 출처, 자산 사용 권리가 불명확한 항목은 임의로 확정하지 않고 책임 문서의 `Open Questions / Deferred`에 남긴다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-043 · L73–73 | 9. 네 문서가 최소 기준을 충족한 뒤 게임 규칙 엔진, Registry, DB/RPC, UI 등 실제 구현을 시작한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-044 · L75–75 | 공개된 기존 보드게임을 웹게임으로 구현하는 경우 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 문서를 우선 확인한다. `GAME_SPEC.md`에는 사용한 출처와 구현상 해석 결정을 남긴다. 규칙 원문을 장문 복제하지 않고 구현에 필요한 사실과 결정만 요약한다. | 서술형(수치화 안 함) | RULE / B | E-DOC | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: GAME_SPEC의 역할** — [step-1-clauses-platform.md L229~231](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L229-L231)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-045 · L79–79 | `GAME_SPEC.md`는 **이 게임이 무엇이며 청파 같이에서 어떻게 구현할지 정의하는 game-local 설계 기준**이다. 최소 다음 섹션을 유지한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-047 · L95–95 | 게임 규칙, 상태 머신, 도메인 모델 또는 구현 경계가 바뀌면 현재 설계와 일치하도록 `GAME_SPEC.md`를 갱신한다. 작은 commit 내역을 쌓는 changelog로 사용하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: UI_DESIGN의 역할** — [step-1-clauses-platform.md L237~240](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L237-L240)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-048 · L99–99 | `UI_DESIGN.md`는 **신규 게임의 runtime/UI 소스 개발을 시작하기 전에 수행한 디자인 전수 조사와 분석을 바탕으로 수립한 초기 game-local presentation baseline**이다. 세부 작성 규칙과 필수 섹션은 `docs/game-platform-ui-rules.md`와 `games/UI_DESIGN_TEMPLATE.md`를 따른다. | 절:MUST; 표현:필수 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-049 · L101–101 | 최소한 디자인 조사 출처, 자산 사용 경계, 목표 판본, Visual Identity, page/lobby/gameplay/result/rematch 방향, 핵심 motion, responsive 전략, 최초 구현 Phase/순서와 validation 기준을 runtime 구현 전에 확정한다. | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-050 · L103–103 | 개발이 시작된 뒤 사용자 피드백, 실제 브라우저 QA, 구현 관찰로 디자인을 수정하는 경우 그 변경으로 `UI_DESIGN.md`의 과거 baseline을 덮어쓰지 않는다. 이후 변경은 `UI_DECISIONS.md`에 기록한다. `UI_DESIGN.md`는 최초 조사·설계 당시 무엇을 근거로 어떤 방향과 Phase를 세웠는지 복원할 수 있어야 한다. | 절:MUST | RULE / P | E-DOC | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-051 · L105–105 | MUST NOT: 후속 디자인 수정에 맞춰 `UI_DESIGN.md`를 계속 최신 화면으로 재작성해 최초 설계와 후속 변경의 경계를 없애지 않는다. 단, 출처 오기·명백한 사실 오류처럼 초기 조사 자체의 오류를 바로잡는 경우에는 수정 이유가 추적되도록 `UI_DECISIONS.md`에도 남긴다. | 본문:MUST NOT; 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: 기능 완료 이후 디자인 수동 리뷰 gate** — [step-1-clauses-platform.md L260~267](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L260-L267)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-061 · L125–125 | 신규 게임의 기능 구현이 충분히 완료되어 release 전 검증·마무리 단계에 들어가면, 자동 테스트 통과만으로 UI를 최종 완료 처리하지 않는다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-063 · L129–129 | - 개발자가 실제 브라우저에서 게임을 플레이하며 초기 `UI_DESIGN.md` 구현 결과를 직접 확인한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-066 · L132–132 | - 디자인 작업을 merge/close하거나 release closeout으로 넘어가기 전에 기록 누락이 없는지 확인한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-068 · L135–135 | `디자인 체크포인트 기록하자`의 세부 의미와 기록 단위는 `docs/game-platform-ui-rules.md`가 소유한다. 이 명령의 존재 여부와 관계없이 UI Rules의 lifecycle 기반 기록 규칙은 적용한다. | 절:MUST | RULE / P | E-DOC | D03 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: 게임별 네 문서의 권위와 충돌 해결** — [step-1-clauses-platform.md L273~282](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L273-L282)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-069 · L139–139 | 네 문서는 서로 대체 관계가 아니라 책임이 다른 authoritative/record 문서다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-072 · L143–143 | - `UI_DESIGN.md`: runtime 구현 전 전수 조사·분석으로 수립한 최초 Visual Identity, page/layout, 구성물 표현, motion, responsive, Phase 계획의 baseline | 절:MUST | RULE / P | E-DOC | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-073 · L144–144 | - `UI_DECISIONS.md`: 개발 시작 후 디자인 개발 진행, 변경 배경, 대안, 사용자 피드백, 결정 이유, 구현/검증 이력을 보존하며 baseline을 보정하는 변경 기록 | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-074 · L146–146 | 같은 주제가 여러 문서에 등장하면 **기능과 디자인의 시간축을 함께 적용**한다. 기능 규칙은 `GAME_SPEC.md`, 기능 진행은 `DEVELOPMENT.md`가 책임진다. 디자인은 `UI_DESIGN.md`를 최초 baseline으로 시작하되, 개발 시작 후 해당 항목을 변경한 유효한 `UI_DECISIONS.md` 결정이 있으면 **후속 결정이 우선한다**. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-077 · L152–152 | MUST NOT: `DEVELOPMENT.md`에서 새로운 게임 규칙이나 UI 설계를 독자적으로 확정하거나 상세 UI 변경 이력을 중복 관리하지 않는다. 기능 설계 변경은 `GAME_SPEC.md`, 후속 디자인 변경은 `UI_DECISIONS.md`에 둔다. | 본문:MUST NOT; 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-078 · L154–154 | 문서끼리 모순이 발견되면 runtime 구현을 계속 진행하기 전에 실제 코드/테스트와 사용자 결정을 확인하고 책임 문서 기준으로 정합화한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 3A. 신규 게임 초기 세팅과 설계 문서 > MUST: bootstrap 상태와 Registry 노출 경계** — [step-1-clauses-platform.md L288~296](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L288-L296)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-079 · L158–158 | 신규 게임은 설계를 먼저 확정하기 위해 `games/&lt;game-id&gt;/`에 다음 네 파일만 존재하는 **bootstrap 상태**를 가질 수 있다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-087 · L177–177 | MUST NOT: 구현 예정이라는 이유만으로 `online`, `invite`, `presence` 같은 capability를 미리 선언하지 않는다. | 본문:MUST NOT; 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 6. Room / Session 계약** — [step-1-clauses-platform.md L509~526](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L509-L526)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-220 · L420–420 | 온라인 멀티플레이가 room/session 개념을 사용하는 경우 기존 shared Room/Lobby 계약을 우선 검토한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-221 · L422–422 | 플랫폼이 공통으로 보장해야 하는 책임은 특정 보드게임의 준비 방식이 아니라 다음과 같은 **세션 경계**다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-228 · L432–441 | ```text<br>createRoom<br>joinRoom<br>getMyActiveRoom<br>getLobbySnapshot<br>setReady<br>leaveRoom<br>startGame<br>subscribeInvalidation<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / M-ROOM | E-ROOM | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-229 · L443–443 | `setReady`와 `startGame`은 현재 shared 구현에서 검증된 lifecycle이지만 **모든 미래 게임의 보편 규칙으로 간주하지 않는다.** 전원 ready가 없거나, 자동 시작하거나, host가 없거나, 다른 방식으로 세션이 시작되는 게임에 억지로 빈 메서드나 가짜 의미를 추가하지 않는다. | 표현:검증 | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-230 · L445–445 | 새 게임의 자연스러운 lifecycle이 현재 adapter와 맞지 않으면: | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DEV-231 · L447–447 | 1. game-local workaround로 shared 계약을 우회하지 않는다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-232 · L448–448 | 2. 현재 adapter를 그대로 강제하기 위해 의미 없는 method를 구현하지 않는다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-233 · L449–449 | 3. 실제 반복 가능한 플랫폼 책임인지 검토한 뒤 shared 계약을 가장 작은 범위로 확장하거나 분리한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-234 · L450–450 | 4. 계약 변경 시 관련 contract test와 이 문서를 함께 갱신한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-235 · L452–452 | 현재 adapter를 그대로 사용하는 게임은 해당 surface 전체를 구현해야 하며, 각 메서드 내부 구현과 실제 RPC 이름은 게임별로 달라도 된다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-236 · L454–454 | MUST: 세션 생성/참가/준비/시작 등 상태 전이가 존재한다면 해당 권한과 조건은 서버가 최종 판단한다. | 본문:MUST; 표현:조건 | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-237 · L456–456 | MUST NOT: UI에서 버튼을 숨기거나 비활성화했다는 이유로 서버 권한 검증을 생략하지 않는다. | 본문:MUST NOT; 표현:검증 | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 7. 서버 권위** — [step-1-clauses-platform.md L545~550](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L545-L550)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-246 · L472–472 | 온라인 게임의 상태 변경은 기본적으로 다음 흐름을 따른다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-247 · L474–483 | ```text<br>Client intent<br>→ authenticated game-specific RPC<br>→ auth / approval / membership / role / phase / version validation<br>→ transaction / row lock when needed<br>→ authoritative DB state<br>→ Realtime invalidation<br>→ authorized snapshot refresh<br>→ UI render<br>``` | 서술형(수치화 안 함) | REQUIRED_SHAPE / M-DB | E-DB | D06, R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-248 · L485–485 | MUST: 클라이언트는 사용자의 **의도(intent)** 를 전달한다. | 본문:MUST | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-251 · L491–491 | MUST NOT: Realtime payload 자체를 게임 상태의 최종 진실로 사용하지 않는다. | 본문:MUST NOT | RULE / M-DB | E-DB | D06 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 9. Snapshot / Reconnect / Realtime** — [step-1-clauses-platform.md L568~581](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L568-L581)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-259 · L517–517 | authoritative snapshot은 non-negative integer `version`을 가져야 한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-260 · L519–519 | 신규 게임은 `createSnapshotCoordinator`를 기준으로 다음 동작을 유지한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-261 · L521–521 | - authoritative snapshot 로드 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-266 · L528–528 | 브라우저의 다음 복귀 신호에서는 snapshot refresh가 가능해야 한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-270 · L534–534 | MUST: Realtime은 **invalidation 신호**로 사용한다. | 본문:MUST | RULE / M-DB | E-DB | D06 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-272 · L538–538 | 구독과 browser listener는 게임 화면 종료 시 정리할 수 있어야 한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 10A. 게임 규칙 안내와 게임 종료** — [step-1-clauses-platform.md L604~604](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L604-L604)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-285 · L562–562 | 모든 platform-native 게임은 처음 플레이하는 사용자가 외부 검색 없이 게임을 이해하고 안전하게 세션을 끝낼 수 있어야 한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 10A. 게임 규칙 안내와 게임 종료 > MUST: 게임 규칙 안내** — [step-1-clauses-platform.md L610~616](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L610-L616)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-286 · L566–566 | - 사용자가 플레이를 시작하기 전에 접근 가능한 entry/setup 화면(로비가 있는 게임은 로비 포함)에서 항상 **게임 규칙 보기**에 접근할 수 있어야 한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-287 · L567–567 | - 규칙 안내는 처음 플레이하는 사용자가 읽고 바로 플레이할 수 있을 정도로 목표, 구성요소, 턴 순서, 가능한 선택, 실패/패널티, 종료/승리 조건, 대표 예시를 충분히 설명한다. | 절:MUST; 표현:조건 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-288 · L568–568 | - 공개된 기존 보드게임은 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 출처를 먼저 확인하고 구현 규칙과 사용자 안내가 같은 해석을 사용해야 한다. | 절:MUST | RULE / B | E-DOC | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-289 · L569–569 | - 규칙이 짧거나 중간 분량이면 modal/dialog를 사용할 수 있고, 내용이 길거나 예시·도표가 많으면 game-local 전용 규칙 페이지를 사용한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-290 · L570–570 | - 규칙 modal/page의 Visual Identity, game component 활용, 정보 계층, 접근성·responsive presentation은 `docs/game-platform-ui-rules.md`의 게임 규칙 안내 presentation 기준을 따른다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-291 · L571–571 | - 규칙 원문을 장문 복제하지 않고 출처를 남긴 뒤 웹게임에 필요한 사실과 해석을 상세히 재구성한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-292 · L572–572 | - 실제 플레이 중에도 규칙 안내를 다시 열 수 있는 경로를 유지하는 것을 기본값으로 한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 10A. 게임 규칙 안내와 게임 종료 > MUST: 게임 종료 / 세션 이탈** — [step-1-clauses-platform.md L622~627](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L622-L627)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-293 · L576–576 | - 지속되는 플레이 세션을 갖는 게임은 진행 중인 세션을 끝낼 수 있는 명시적 **게임 종료** 또는 이에 준하는 안전한 종료 경로를 제공한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-294 · L577–577 | - 온라인 멀티플레이에서 게임 전체를 종료하는 권한은 게임별로 명확히 정의하며, 다른 플레이어의 세션에 영향을 주는 종료는 서버가 최종 권한을 검증한다. | 절:MUST; 표현:검증 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-295 · L578–578 | - 파괴적 종료는 확인 modal/dialog를 거쳐 오조작을 방지한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-296 · L579–579 | - 종료 후 모든 클라이언트가 authoritative snapshot 또는 명시적 terminal state로 동일한 결과를 복구할 수 있어야 한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-297 · L580–580 | - 종료된 사용자가 active session에 영구히 묶이지 않도록 leave, rematch, entry return 등 후속 경로를 정의한다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-298 · L581–581 | - 브라우저를 닫거나 단순히 다른 페이지로 이동하는 것을 authoritative 게임 종료로 간주하지 않는다. | 절:MUST | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 10B. 멀티플레이 재대결 lifecycle** — [step-1-clauses-platform.md L633~635](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L633-L635)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-299 · L585–585 | 모든 멀티플레이 platform-native 게임은 정상 종료 또는 재대결을 허용하는 terminal state 이후 **같은 참여 맥락에서 다시 플레이할 수 있는 재대결 기능**을 기본 제품 요구사항으로 제공한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-300 · L587–587 | 기본 사용자 흐름은 다음과 같다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-301 · L589–599 | ```text<br>GAME_OVER / TERMINAL<br>→ 결과 확인<br>→ 재대결 선택<br>→ 기존 room / active player identity를 유지한 준비 상태<br>→ 참여 플레이어가 준비 완료<br>→ 시작 가능한 인원과 준비 조건 충족<br>→ 방장이 게임 시작<br>→ 이전 gameplay state 초기화<br>→ 새 게임 시작<br>``` | 표현:조건 | REQUIRED_SHAPE / M-ROOM | E-ROOM | D07, C03/R01, R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 10B. 멀티플레이 재대결 lifecycle > MUST** — [step-1-clauses-platform.md L641~650](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L641-L650)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-302 · L603–603 | - 재대결을 위해 사용자가 새 방을 생성하거나 방 코드를 다시 입력하도록 강제하지 않는다. | 절:MUST | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-303 · L604–604 | - 기존 room, 참여 player identity, host와 플랫폼 세션 맥락은 가능한 범위에서 유지한다. | 절:MUST | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-304 · L605–605 | - 이전 게임의 점수, 카드, 보드, 칩, 주사위, 턴, 승패, 임시 효과 등 gameplay state는 새 게임 기준으로 초기화한다. | 절:MUST | RULE / M-ROOM | E-ROOM | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-305 · L606–606 | - 재대결 준비 상태에서 참여 플레이어의 ready 상태와 방장의 시작 가능 조건을 명확히 표현한다. | 절:MUST; 표현:조건 | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-306 · L607–607 | - 새 게임 시작 조건과 권한은 서버가 최종 검증한다. | 절:MUST; 표현:조건,검증 | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-307 · L608–608 | - 재대결을 원하지 않는 플레이어는 안전하게 이탈할 수 있어야 하며, 이탈 후 최소 플레이 인원과 host 승계 등 필요한 조건을 authoritative하게 다시 검증한다. | 절:MUST; 표현:조건,검증 | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-308 · L609–609 | - reconnect가 발생해도 authoritative snapshot으로 재대결 준비 상태 또는 새 게임 상태를 복구할 수 있어야 한다. | 절:MUST | RULE / M-ROOM | E-ROOM | C03/R01, R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-309 · L610–610 | - 결과와 재대결 presentation은 `docs/game-platform-ui-rules.md`에 따라 게임 고유 Visual Identity 안에서 이어진다. | 절:MUST | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-310 · L612–612 | 재대결이 공통 제품 요구사항이라는 이유만으로 모든 게임에 동일한 RPC 이름이나 `games/shared/` adapter method를 즉시 강제하지 않는다. 현재 Room/Lobby 계약으로 자연스럽게 표현되면 재사용하고, 여러 게임에서 반복되는 구현 책임이 확인될 때만 shared 계약 승격을 검토한다. | 절:MUST | RULE / M-ROOM | E-ROOM | D07 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-311 · L614–614 | 초기 게임 시작에 ready/host 개념이 없는 특수한 게임이라도 재대결에서는 사용자가 다시 플레이하겠다는 의사를 명시하고 방장이 시작 가능한 준비 화면으로 전환하는 청파 같이 공통 UX를 제공한다. 게임 규칙상 방장 자체가 성립하지 않는 구조를 도입하려면 별도 플랫폼 규칙 변경으로 다룬다. | 절:MUST | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 13A. 하위 규칙 발견과 Game Platform Architecture Change 승격 > 상위 규칙과 충돌하는 경우** — [step-1-clauses-platform.md L721~726](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L721-L726)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-352 · L705–705 | - 토의·승격 없이 하위 문서 또는 runtime/source부터 상위 규칙을 벗어나게 수정하는 것은 **불허용**이다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-353 · L706–706 | - 소스 수정 전에 현재 상위 규칙, shared contract, 기존 platform-native 게임에 미치는 영향을 확인한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-354 · L707–707 | - 사용자/maintainer와의 토의에서 해당 필요가 특정 게임의 예외가 아니라 Game Platform 전반에 필요한 변경이라고 명시적으로 합의되면 **ARCHITECTURE CHANGE**로 승격한다. | 표현:예외 | RULE / P | E-DOC | D10 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-355 · L708–708 | - 승격된 뒤에는 하위 topic-owner와 상위 규칙을 같은 작업 범위에서 함께 정합화할 수 있으며, runtime 구현보다 규칙/계약 변경과 영향도 감사를 먼저 또는 같은 원자적 변경에서 완료한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-356 · L709–709 | - 승격 전의 하위 제안을 기존 상위 규칙을 우회하는 임시 예외로 구현하지 않는다. | 표현:예외 | RULE / P | E-DOC | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-357 · L711–711 | ARCHITECTURE CHANGE 작업은 최소 다음을 함께 검토한다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D10 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DEV — `docs/game-platform-development-rules.md` / 15. 신규 게임 구현 순서** — [step-1-clauses-platform.md L775~775](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L775-L775)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-386 · L761–788 | ```text<br>1. 원본 규칙/출처와 실제 구성물 조사<br>2. 원본 디자인/Visual Identity/자산 사용 가능 범위 조사<br>3. GAME_SPEC.md + DEVELOPMENT.md + UI_DESIGN.md + UI_DECISIONS.md bootstrap<br>4. 게임 규칙과 상태 머신 구현 및 unit test<br>5. 첫 runtime 구현과 함께 Game Registry 등록<br>6. Access Gate 연결<br>7. 게임별 DB schema / RPC 설계<br>8. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)<br>9. DB/Test Contract 연결 (online인 경우)<br>10. authoritative snapshot 구현 (stateful online인 경우)<br>11. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)<br>12. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)<br>13. Common Game Shell / player UI 연결 (필요한 공통 surface만)<br>14. UI_DESIGN baseline 기준의 게임 고유 page/lobby/gameplay UI 최초 구현<br>15. 멀티플레이 게임의 result/rematch lifecycle 구현<br>16. 기능 구현과 자동 검증을 release 후보 수준까지 완료<br>17. Developer Manual Design Review / Detail Polish: 개발자가 실제 브라우저에서 플레이하며 디자인 디테일 수정<br>18. 안정화된 디자인 수정 사항을 UI_DECISIONS에 확정 decision 단위로 기록<br>19. 게임 고유 animation / interaction / responsive 최종 polish<br>20. 멀티클라이언트 및 reconnect 회귀 검증<br>21. UI_DESIGN 초기 validation checklist + UI_DECISIONS 최신 override/브라우저 검증 이력 확인<br>22. production migration / 권한 경계 검증<br>23. Registry capability activation + 게임 목록/entry 노출<br>24. Design Closeout + RELEASED 문서 closeout<br>25. stacked PR / 작업 브랜치 정리<br>26. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류<br>``` | 표현:검증 | REQUIRED_SHAPE / P | E-DOC | D01, D06, D09, R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**GOV — `docs/game-platform-governance.md` / 공통 규칙 변경 전파 원칙** — [step-1-clauses-platform.md L921~921](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L921-L921)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GOV-037 · L71–71 | 5. 상위 규칙과 충돌하는 하위 필요는 **발견/토의 단계에서는 제안으로만 유지**하고, 승격 없이 하위 문서나 runtime을 상위 규칙 밖으로 먼저 수정하지 않는다. 사용자/maintainer와의 토의에서 플랫폼 전반에 필요한 변경으로 명시적으로 합의되면 Development Rules의 **ARCHITECTURE CHANGE**로 승격한다. | 서술형(수치화 안 함) | RULE / P | E-GOV | D10 | K / 6→7A1/7B | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**DB — `docs/game-platform-db-test-contract.md` / 필수 계약** — [step-1-clauses-platform.md L981~993](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L981-L993)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-006 · L15–15 | 모든 신규 온라인 platform-native 게임은 최소 다음 시나리오를 검증한다. | 표현:검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-007 · L17–17 | 1. 익명 사용자는 보호된 게임 세션에 진입할 수 없다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-008 · L18–18 | 2. 승인되지 않은 회원은 보호된 게임 세션에 진입할 수 없다. | 표현:승인 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-009 · L19–19 | 3. 승인 회원은 해당 게임 정책이 허용하는 세션 진입을 수행할 수 있다. | 표현:승인,할 수 있다 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-010 · L20–20 | 4. 세션 멤버가 아닌 사용자는 보호된 authoritative snapshot을 읽을 수 없다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-011 · L21–21 | 5. 게임 시작 조건과 시작 권한은 서버가 해당 게임의 lifecycle 정책에 맞게 검증한다. | 표현:조건,검증 | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-012 · L22–22 | 6. 오래된 `expected_version` 명령은 거부된다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-013 · L23–23 | 7. 동일한 `client_action_id` 재전송은 중복 적용되지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-014 · L24–24 | 8. 동시에 충돌하는 명령은 하나의 authoritative commit만 만든다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-015 · L25–25 | 9. 재접속 시 authoritative snapshot으로 현재 상태를 복원한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-016 · L26–26 | 10. 멀티플레이 게임 종료 후 재대결은 기존 room/player context를 유지하고 gameplay state를 초기화한 준비 상태로 전환하며, 준비/시작 조건과 reconnect 복원이 서버 권위로 검증된다. | 표현:조건,검증 | RULE / M-DB | E-DB | D07, R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-017 · L27–27 | 11. 다른 플레이어의 private state가 snapshot에 노출되지 않는다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-018 · L29–29 | 게임에 private state가 존재하지 않더라도 11번은 생략하지 않는다. 해당 게임의 snapshot에 private 정보가 없음을 명시적으로 검증한다. | 표현:검증 | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |

**DB — `docs/game-platform-db-test-contract.md` / 재대결 lifecycle** — [step-1-clauses-platform.md L1033~1037](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md#L1033-L1037)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DB-038 · L110–110 | `rematch_lifecycle_authoritative`는 특정 RPC 이름이나 SQL 구조를 강제하지 않는다. 각 게임은 자체 구현으로 최소 다음을 증명한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-039 · L112–112 | - terminal state 이후 재대결 준비가 기존 room과 남아 있는 active player identity를 유지한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | D07 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DB-042 · L115–115 | - 재접속한 참가자는 같은 room의 authoritative rematch 준비 상태 또는 재시작된 새 게임 snapshot을 복원한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | D07, R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 2. 신규 게임 개발 전 UI 조사** — [step-1-clauses-design.md L39~44](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L39-L44)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-010 · L25–25 | - 공식 제품/퍼블리셔 페이지와 공식 규칙서 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-011 · L26–26 | - 공식 또는 신뢰 가능한 시각 자료가 존재하면 텍스트 설명만으로 Visual Identity를 확정하지 않고 실제 카드·보드·패키지·토큰 등 visual reference를 직접 확인한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-015 · L30–30 | - 숫자/정보의 배치, 카드 비율, 타이포그래피 분위기 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 3. 원본 디자인과 자산 사용 > MUST** — [step-1-clauses-design.md L66~71](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L66-L71)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-027 · L59–59 | - 출처와 확인 날짜 또는 판본을 가능한 범위에서 기록한다. | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-028 · L60–60 | - 여러 판본의 디자인이 다른 경우 목표 판본 또는 혼합하지 않을 기준을 정한다. | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-029 · L61–61 | - 직접 사용할 자산은 사용 근거와 라이선스/허가 상태를 기록한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-030 · L62–62 | - 사용 권리가 불명확한 로고, 일러스트, 사진, 폰트, 음원은 그대로 포함하지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-031 · L63–63 | - 직접 복제가 어려운 경우 대표 색상, 정보 계층, 기능적 형태, 공간 배치, 분위기를 분석해 독자적인 게임-local 표현으로 재구성한다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-032 · L65–65 | 목표는 **원본 게임의 정체성과 플레이 감각을 살리되 보호되는 자산을 무단 복제하지 않는 것**이다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다** — [step-1-clauses-design.md L115~115](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L115-L115)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-061 · L109–109 | 게임 규칙 modal/page는 게임 밖의 일반 도움말 문서가 아니라 **처음 플레이하는 사용자가 실제 구성물과 행동 구조를 이해하는 game-local presentation**으로 설계한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > MUST** — [step-1-clauses-design.md L122~125](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L122-L125)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-063 · L115–115 | - 규칙 안내는 해당 게임의 `Visual Identity`와 동일한 색상, 형태, 타이포그래피, 재질감 또는 공간 메타포를 유지한다. 일반 서비스의 generic 문서/modal 스타일을 그대로 기본값으로 확정하지 않는다. | 절:MUST | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-066 · L118–118 | - 카드, 주사위, 말, 칩, 보드, 트랙 등 게임 구성물을 표현할 때는 `UI_DESIGN.md`의 자산 사용 경계와 game-local component 언어를 재사용하거나 독자적으로 재구성한다. 사용 권리가 불명확한 공식 artwork를 규칙 설명이라는 이유로 직접 복제하지 않는다. | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > SHOULD** — [step-1-clauses-design.md L134~134](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L134-L134)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-070 · L125–125 | - 실제 구성물, 공간 구조, 행동 순서나 계산을 시각화했을 때 처음 플레이하는 사용자의 이해가 크게 좋아지는 핵심 메커니즘은 **게임 구성물 언어를 활용한 짧은 시각적 예시**로 보여준다. | 절:SHOULD | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > MUST NOT** — [step-1-clauses-design.md L142~142](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L142-L142)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-073 · L131–131 | - 특정 다른 게임의 규칙 modal layout이나 장식 구조를 공통 template처럼 복제하지 않는다. | 절:MUST NOT | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 5A. 게임 규칙 안내도 Gameplay Presentation의 일부다 > game-local 문서 연결** — [step-1-clauses-design.md L150~156](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L150-L156)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-076 · L137–137 | 신규 게임은 runtime 개발 전에 `UI_DESIGN.md`에서 최소 다음을 정한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-081 · L143–143 | - 자산 사용 및 저작권 경계 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-082 · L145–145 | 개발 시작 후 실제 브라우저 리뷰에서 규칙 안내의 layout, visual example, 정보 계층 또는 responsive 방식이 의미 있게 바뀌면 `UI_DESIGN.md` baseline을 덮어쓰지 않고 `UI_DECISIONS.md`에 최신 non-superseded 결정으로 기록한다. | 서술형(수치화 안 함) | RULE / P | E-UI | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 6. UI_DESIGN.md 관리 규칙 > MUST: baseline 보존** — [step-1-clauses-design.md L192~200](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L192-L200)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-098 · L187–187 | `UI_DESIGN.md`는 신규 게임 소스 개발 전에 확정한 조사·분석·설계 baseline을 보존한다. 개발 시작 후 발생하는 디자인 수정 때문에 이 문서를 현재 화면에 맞춰 계속 덮어쓰지 않는다. | 절:MUST | RULE / P | E-UI | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-102 · L193–193 | - 카드/보드/칩/토큰 등 핵심 구성물 표현을 조정한 경우 | 절:MUST | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-106 · L199–199 | 예외적으로 초기 조사 문서 자체의 출처 오기나 명백한 사실 오류를 고칠 수는 있지만, 왜 고쳤는지는 `UI_DECISIONS.md`에서 추적 가능해야 한다. | 절:MUST; 표현:예외 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 6. UI_DESIGN.md 관리 규칙 > UI_DECISIONS.md와의 연결** — [step-1-clauses-design.md L217~217](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L217-L217)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-118 · L222–222 | `UI_DESIGN.md`와 `UI_DECISIONS.md`가 같은 UI 항목에서 충돌하면 **baseline 이후 확정된 최신 non-superseded `UI_DECISIONS.md` 결정이 우선한다.** 신규 게임의 pre-development baseline이든 기존 게임의 adoption baseline이든 `UI_DESIGN.md`는 후속 변경을 되돌리는 근거로 사용할 수 없다. | 서술형(수치화 안 함) | RULE / P | E-UI | D04 | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 7. 실제 보드게임의 공간 구조 반영** — [step-1-clauses-design.md L299~306](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L299-L306)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-170 · L313–313 | 웹 UI는 실제 게임에서 플레이어가 정보를 읽고 구성물을 다루는 방식을 조사해 가능한 범위에서 반영한다. | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-171 · L315–315 | 예: | 서술형(수치화 안 함) | CONTEXT / I | E-UI | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-UI-172 · L317–317 | - 중앙 공용 영역 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-173 · L318–318 | - 개인 플레이어 영역 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-174 · L319–319 | - 카드/칩이 실제로 쌓이거나 겹치는 방식 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-175 · L320–320 | - 공개 정보와 비공개 정보의 시각적 구분 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-176 · L321–321 | - 보드에서 진행 방향과 상태를 읽는 방식 | 서술형(수치화 안 함) | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-177 · L323–323 | 원본 배치를 그대로 복제하는 것이 가독성을 해치면 웹 환경에 맞게 재구성할 수 있다. 최초 adaptation 계획은 `UI_DESIGN.md`에 두고, 개발 시작 후 실제 브라우저 검토로 그 배치를 수정했다면 최신 유효 결정과 이유를 `UI_DECISIONS.md`에 남긴다. | 표현:할 수 있다 | RULE / B | E-UI | 발견 없음(새 소유 위치 미정) | K / 2/5C→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 8. 모션과 행동 피드백** — [step-1-clauses-design.md L312~323](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L312-L323)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-178 · L327–327 | 게임의 핵심 행동은 상태 값만 즉시 바뀌는 방식보다 실제 구성물이 움직인다는 감각을 우선 검토한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-180 · L331–331 | - 카드 공개 / 뒤집기 / 이동 | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-188 · L340–340 | 애니메이션은 장식보다 **원인 → 이동/행동 → authoritative 결과 반영**의 순서를 사용자가 이해하게 만드는 것이 우선이다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-189 · L342–342 | 동기화 안정성을 해치거나 실제 서버 상태와 다른 결과를 먼저 확정해서 보여주지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 9. 결과와 재대결 presentation** — [step-1-clauses-design.md L329~337](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L329-L337)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-190 · L346–346 | 멀티플레이 게임의 결과 화면과 재대결 준비 화면도 해당 게임의 Visual Identity 안에서 설계한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-191 · L348–348 | 재대결 lifecycle 자체의 기능 규칙과 서버 권위는 `docs/game-platform-development-rules.md`를 따른다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-192 · L350–350 | UI는 최소 다음을 명확히 표현한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-198 · L357–357 | - 재대결하지 않는 플레이어의 이탈 경로 | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 10. Responsive 기준** — [step-1-clauses-design.md L343~348](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L343-L348)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-199 · L361–361 | 게임 UI는 desktop과 mobile 모두에서 핵심 정보와 action이 유지되어야 한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-201 · L364–364 | - 많은 카드/토큰 등은 겹침, 축약, scroll area 등 게임에 맞는 표현을 설계한다. | 서술형(수치화 안 함) | RULE / P | E-UI | R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-203 · L366–366 | - hover에만 의존하는 핵심 interaction을 만들지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-204 · L367–367 | - mobile에서 터치 target과 modal/overlay가 gameplay를 막지 않는지 검증한다. | 표현:검증 | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**UI — `docs/game-platform-ui-rules.md` / 10. Responsive 기준 > Implementation Plan 책임** — [step-1-clauses-design.md L354~355](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L354-L355)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-UI-205 · L371–371 | `UI_DESIGN.md / Implementation Plan`은 runtime 개발 전에 수립한 **초기 presentation 적용 순서와 가이드**를 보존하며 live progress/changelog로 사용하지 않는다. 기능 상태 머신, DB/RPC, 서버 권위 구현 순서는 `GAME_SPEC.md`, 실제 기능 다음 작업은 `DEVELOPMENT.md / Next Work`에서 관리한다. 개발 시작 후 baseline에서 벗어나 확정된 디자인 변경, 수동 브라우저 리뷰 결과와 그에 따른 후속 UI 작업만 `UI_DECISIONS.md`에서 추적한다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-UI-206 · L373–373 | 같은 TODO나 결정 이력을 네 문서에 반복 복제하지 않는다. | 서술형(수치화 안 함) | RULE / P | E-UI | 발견 없음(새 소유 위치 미정) | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

**GUIDE — `games/README.md` / 경계** — [step-1-clauses-design.md L414~414](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md#L414-L414)

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-GUIDE-019 · L26–26 | - game-local 작업에서 상위 Game Platform 규칙과 충돌하는 새 필요를 발견하면 일반 하위 변경으로 바로 구현하지 않습니다. 플랫폼 전반에 필요한 변경으로 토의·합의되면 **ARCHITECTURE CHANGE**로 승격해 Development Rules와 Governance의 상·하위 정합화 및 전체 platform-native 게임 영향도 감사를 거칩니다. | 서술형(수치화 안 함) | RULE / P | E-DOC | D10, R01-BOARD | K / 6→7A1/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

선택 anchor 147개. 기존 전체 조항 수·강도·계승 범위를 다시 집계/판정한 것이 아니다.

### 11.4 기존 source/test trace 재사용과 blob 대조

다음은 STEP3 source trace의 관찰을 재사용한다. 이번에는 고정 tree의 blob만 비교했으며 본문 재분석·실제 시험은 하지 않았다. 기존 테스트 범위는 coalescing·stale·unsubscribe·browser return 등으로, 공간형 조작성·권위·전체 수명·두 client 행동 검증을 대신하지 않는다.

| 고정 source | blob | 재사용 범위 | 새 확인 |
|---|---|---|---|
| [games/shared/snapshotCoordinator.js](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/games/shared/snapshotCoordinator.js) | 069f49aa23cfb2c5d591cafaed523fa358c78ba1 | L8–137 | STEP3 blob 동일; 행동 NOT_RUN |
| [games/shared/reconnectRefresh.js](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/games/shared/reconnectRefresh.js) | f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4 | L12–58 | STEP3 blob 동일; 행동 NOT_RUN |
| [tests/game-platform-contracts.test.js](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/tests/game-platform-contracts.test.js) | 182dd2719bcfc4872c3d990ab7b6d2149399c2c4 | L80–195 | STEP3 blob 동일; 행동 NOT_RUN |
| [games/cant-stop/lobbyController.js](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/games/cant-stop/lobbyController.js) | 9fdecdea73fa6b96680d887a6ad5ad2d9031e8d6 | S3-E07~09의 room tracking·snapshot callback·dispose | STEP3 blob 동일; 행동 NOT_RUN |
| [games/no-thanks/lobbyController.js](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/games/no-thanks/lobbyController.js) | 942a628ff1a675754f7ab92c53d5ecbddf3e6eab | L103–170 / L228–250 / L402–465 | STEP3 blob 동일; 행동 NOT_RUN |

### 11.5 문서 확인 결과와 정지

문서 trace 34개 경로·blob, 선택 원문 147행의 ID·원문 행·부모절 및 원본 계획 24,830 bytes/SHA256 보존을 기계적으로 대조했다. source/test 5개 blob은 기존 STEP3 trace와 동일하다. 문서의 사실/승인 요구/추론/미확인, 최소6항목·질문·Astra 전달 조건을 구분했다. 작업 종료 시 integration HEAD는 고정 SHA와 동일하다.

이는 문서 검사이며 runtime/DB/browser/audio/두 client 행동 시험은 NOT_RUN이다. 기존 UNKNOWN·구현/실행/오픈 의무, STEP5C 기록 NOT_STARTED 및 main 별도 게이트를 유지한다. 저장소 파일·원본 계획·브랜치·PR·checkpoint를 변경하지 않았으며 Astra 판단은 다음 요청으로 남긴다.
