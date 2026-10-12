# STEP6 — Slice·검증 예산·설계 blocker와 후속 의무

- 현재 지위: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-12 23:12:53 KST의 승인 게이트 설명 뒤 사용자가 “승인할게”라고 응답했다. §9.1 여섯 묶음의 본문 조건·제한·미확인 포함 핵심 판단 승인 및 앞선 STEP6 정식 반영·문서 검증·integration base 검토 PR 제출 요청의 시작 조건 충족으로 기록한다. 승인 시각 자체가 제공되지 않은 마지막 응답의 정확한 시각은 추정하지 않는다.
- STEP6 **REVIEW_PENDING**. 정식 결과 최종 검토·Target 동결 완료 기록·integration 병합·main·STEP7은 별도 게이트다. 현재 행동 **NOT_RUN**, 운영/실행 **UNKNOWN**과 후속 의무 유지.
- 판단 기준/착수 integration `f34f4f180e14ea36847b9740dea43de2f1325e56`. STEP5C **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED**. 기존 게임/Auth/API/SQL 무이관.
- 원본: [Astra 판단](game-platform-vnext-step6-astra-judgment.md), [Sol 근거](game-platform-vnext-step6-evidence.md), [계획/인계](game-platform-vnext-step6-plan-and-handoff.md). 세 입력 bytes/identity/hash·원문 이력 상태는 보존한다. Sol/Codex가 새 Target·책임·경로·버전·Slice를 선택하지 않았다.
- 아래 원본 절은 제목·번호·본문·표·조건을 exact하게 전달한다. 원문의 PROPOSED/미승인/NOT_STARTED·저장소 변경 금지·다음 작업/프롬프트는 작성 당시 상태와 요청이다. **현재 허용과 상태는 이 헤더·CURRENT·CP0088·검증 문서가 우선**한다. 이력 문구를 현재 미승인으로 해석하거나, 핵심 판단 승인을 구현·동결 완료로 확대하지 않는다.
- 정식 단일 본문: [Target 책임·문서 계층·적용 조건·물리 격리·계약 권위](step-6-target-architecture.md) / [전수 참조 계승·명시 분할·조항 목적지](step-6-clause-destinations.md) / [세 요청의 코드 없는 추적](step-6-request-traces.md) / [Slice·검증 예산·설계 blocker와 후속 의무](step-6-slices-and-verification.md) / [고정 원본·승인 대응·source trace·게이트](step-6-source-trace.md). 검증/최종 검토는 [step-6-validation](step-6-validation.md), 현재 기록은 [CURRENT](../CURRENT.md)와 [CP0088](../checkpoints/CP-0088-step-6-formal-submitted.md).
- 새 topic-owner와 runtime 경로는 승인 판단의 **후속 적용 경로**다. 이번 실제 생성 파일은 rebuild artifacts와 CP0088이며 현재 rulebook/AGENTS/Guard는 전환하지 않는다. §12의 목적지는 계획된 논리 책임과 원문 참조 계승이고 새 규칙 본문 적용 완료를 뜻하지 않는다. 실제 전환 시 특정 ID/f 목적지가 성립하지 않으면 해당 조각을 blocker로 반환한다.

## 7. D — Slice 의존·시험 종류와 예산

### 7.1 작은 구현 순서

아래는 허용된 후속 단계 안의 순서다. 새 STEP을 만들거나22개 검토 지점을 합치지 않는다.

| Slice / 계획 gate | 산출 범위 / 선행 | 검사·중단 조건 |
|---|---|---|
| D0 / STEP6 정식 문서 | 사용자 §9.1 핵심 판단 승인 + 정식 반영 명시 허용 뒤 Target/전수/trace를 문서 PR로 반영 | 원문/ID/부모/강도/조건·분할·목적지·링크/hash/허용diff만 검증. 결과 최종 검토 전 REVIEW_PENDING |
| D1 / 7A1 | AR/CO/LI, MO/CA 승인본문·인덱스와 §6.3 최소 권위 연결 | 경쟁 CURRENT·조항 목적지 공백·보드 발견 단절이면 전환 중단 |
| D2 / 7A2 | 보드 계승, 실제 본문과 전수 목적지 대응 | 설명 없는 MUST 약화/모델 강제/원문 삭제 미추적이면 중단 |
| D3 / 7A3 | 첫 비보드 R01~13·둘째 필요조건 | 보드 복사/독립 플랫폼/장르명 기술선택이면 수정 |
| D4 / 7B | browser nestedshared/serverroot 탐지·import/배포격리·scope/버전·모델 oracle/모듈 안내 | 새 경로 미탐지/기존 게임 오분류·online 안전 면제면 runtime 선행 불가 |
| I1 / 7C | 최소 조립/수명 Core와 실제 필요한 계약 테스트 | 전체 완료 경로·T01~03, 부분실패/반복 dispose/late자원. 기존 public API 변경 필요하면 구현 중단·설계 복귀 |
| I2 / 7D | 첫 Probe에 실제 필요한 선택 모델·backend 연결·Adapter | 단일 채택/복구, A/C/P current oracle·안전11, 명시된 intent취소/시간공백. mock을 실제 지원으로 표시 금지 |
| I3 / 7D 해당 범위 | 선택한 Invite/BGM/Shell/결과 연결과 H1~3 최소 본체 보완 | H1 무보완 직접연결 금지, H2/H3 owner 침범·late effect면 중단. 미래 기능 구현 보류 |
| C1 / STEP8 | 기존게임 전수 영향도와 필요한 회귀 | MIGRATION_REQUIRED면 기존게임 이관 대신 vNext 격리 재설계 |
| P1/P2 / 각 Probe 단계 | 실제 게임 선택·조사→네문서→작은 수직 Slice→모델/경험 검증 | 제품별 미선택을 구현 전에 닫음. 각 Probe 결과 검토/승인을 별도로 유지 |
| O1 / 후속 성능·운영/준비 gate | 실제 환경/부하/기록/삭제/backup/복원/비용·수동 검토 | 실행허용·측정 증거·UNKNOWN 해소 전 지원/오픈 주장 금지 |

### 7.2 검증 코드와 예산 판단

**J 예산은 검증 범위의 배정부터 고정한다.** 지금 승인된 고정 시간·횟수의 성능 campaign을 새로 만들지 않는다. 안전성 case를 시간 예산 때문에 생략하지 않으며, 정해진 CI 제한에 맞지 않으면 의미 있는 분리/별도 실행 계획을 제출한다. 반복해서 실패가 사라질 때까지 돌리는 방식은 예산도 근거도 아니다.

| 코드 / 종류 | 배정할 범위·최소 증거 | 실행 시간/표본 예산의 지위 |
|---|---|---|
| V-D 문서 | 3,232 ID/분류·305 명시부모·조건refs·목적지/fragment·source hash·링크·authority scope·세 추적·허용 diff | 이번 수행 가능한 문서 검증. runtime/build/CI 실행 예산0; 문서 작업에 불필요한 전체 test 없음 |
| V-G 장르/선택 | B조건·R01~13·7축/네문서·비적용/미지원 근거 | 각 실제 적용 항목에 제품결정/관측 하나 이상 연결. 사례 수만 채워 완료 금지 |
| V-L 수명 | 모든 완료종류 × 적용 owner/context 전환(T01~03), 부분초기화/반복dispose/late자원 | 의미가 다른 가지마다 결정적 fault case 배정. 무의미한 전 Cartesian product·1000반복 강제 없음 |
| V-S 안전/인가 | 안전11 + currentA/C/P·knownexpiry·freshretry/P·owneranchor·60초/terminal·D0010 delta | 위반0이 안전 oracle. percentile로 위반 면제 없음. trace 미상은INCONCLUSIVE |
| V-M 모델 | 권위/순서/initial-live/gap/overflow/quiet loss/ACKloss/duplicate/복구·입력준비 | DB는 disposable 통합, non-DB는 해당 권위 환경. model별 oracle 실제 실행을 같은 scenario 명칭과 구별 |
| V-H 본체연결 | H1 BGM fakeAudio/unit + 실제browser/audio, H2/H3 identity/old disposer/dialog late완료 | unit과browser 증거 각각 필요. H4미선택은 실행하지 않음 |
| V-R 결과/소비 | 정정/재처리/역순/commit미상·여섯 중복범위의 선택된 consumer | 선택되지 않은 reward/publication 서비스 선제 시험 없음. 필요한 소비 각각의 관측으로 검증 |
| V-U UX/수동 | 기능별 keyboard/touch/focus/규칙/종료/hidden·모바일5기능·실제play/polish | 자동test가 수동gate를 대체 안 함. emulation은 실제iPhone Safari 인증 아님 |
| V-C 공존 | 모든 Registry platform-native 영향도(COMPLIANT/NA/MIGRATION_REQUIRED), 변경 관련 기존import/API/route/build/회귀 | 기존 게임 baseline/API/SQL 무변경 확인. 사후 별도감사로 단계 늘리지 않음 |
| V-P 성능 | 총접속100(로비/관전포함), 판최대8, 원격권위p95≤250ms, 정상망각복구≤5초; raw표본·failure/timeout/drop 포함 | 정확한기기/OS/browser/배포bytes/망/측정구간/오차와 시험당 시간·표본·중단/비용한도를 실제실행 계획에서 명시. T12의60분/1000입력/30재연결은 후보, 승인예산 아님 |
| V-O 운영/오픈 | 기록접근·최초종결30일삭제·탈퇴본인연결해제/타참가최소기록기존deadline·backup/복원ACL·비용·운영한계 | 세금포함월추가3만원, RPO≤24h목표/발견→인가복구≤24h목표/7일복구점·기존Free서울조건 유지. 실제운영/실청구UNKNOWN; 구매/job/dump/복원 자동허용 없음 |

기존 CI5분/DB15분·Playwright30초/expect10초·retry/workers는 **현행 실행 설정**일 뿐 전체 vNext 예산이나 품질 기준으로 채택하지 않는다. 새 unit 테스트를 flat glob에서 발견시키는 결정은 workflow를 늘리라는 뜻이 아니다. 실제 backend/두client/지원환경·부하/운영 시험은 후속 실행 계획에 그 범위와 허용 자원을 먼저 적고 허용된 단계에서 수행한다. precise 표본·기기가 지금 미정이라는 사유는 Target 책임 동결의 blocker가 아니라 해당 성능/지원 주장 전 필수 구체화다.

## 8. D — 설계 blocker와 남는 의무

| 분류 | 정확한 대상 | 현재 판단 / 닫는 주체·게이트 |
|---|---|---|
| 현재 전체 Target 선택에 대한 승인 gate | §9.1 제안 경로·참조계승·버전·scope 전환·Slice/예산 방식 | 사용자 미승인. 이 문서를 승인된 동결로 표시하지 않음 |
| 정식 문서 동결 blocker가 되는 조건 | §12 특정ID/f의 실제 반영 목적지 미존재·source조건/예외 손실·부모 단절·강도 완화·경쟁CURRENT | 제안상의 목적지는 전수 연결. 정식반영 검사에서 해당 원문 ID/줄/f·예상owner·누락조각을 명시하고 그 변환을 멈춤. 자동 표 생성만으로 해소 선언 금지 |
| 해당조합의 실제 설계 blocker | host 의미가 불성립하는 multiplayer 재대결, 또는 상위안전/수명/인가의 새 완화 | 현재 선택/승인하지 않음. §4.2 원문 영향·대체의미를 Astra/사용자 Architecture Change로 해결 |
| 권위/탐지 전환 선행조건 | X01/X02/X05: DB/비DB 적용범위·AGENTS/템플릿/currentliteral·nestedmodule/test발견 | §6.3/7A1~7B에서 원자적 연결. 이는 “Guard가 고쳐졌다”는 상태가 아님 |
| Probe 구현 전 선택 | 실제 게임·장치·start/rematch/종료·intent취소손실·시간공백·결과/보존·지원/미지원 | game-local/선택모델 설계에서 구현 전 닫음. scope밖 미래 기능은 끌어오지 않음 |
| 본체 구현 의무 | H1~3·최소 Core/모델·단일adoption/복구·API격리 | 후속 구현. 기존 본체 존재만으로 호환/수명 보완 완료 아님 |
| 실제 실행/지원 의무 | V-L/S/M/H/R/U/C/P, 실제Windows10/11 Chrome·Edge/iPhoneSafari와manifest | NOT_RUN. 공식지원·성능완료 주장 전 증거 필요 |
| 운영/오픈 의무 | D0006~10 성능/비용/기록/삭제/탈퇴/backup/복원·운영조건 | UNKNOWN 유지, 공급자 재선정/새 운영약속 없음 |
| 미래 미선택 | 비roomInvite, reward/leaderboard, 정밀audio, Profile,3D/전용물리/리듬 | 전체동결 blocker 아님. 실제 요구 발생 때 해당 경계만 설계 |

근거 B08 요약은DEV271을 payload최종진실금지로 축약했으나 실제DEV271은 Realtime 이벤트순서·전달성공만으로복구금지이고 payload문구는DEV251이다. 두 의무를각각보존하며 위§3.2의ID연결을정정했다. 그외 승인된의미를바꿔야하는 **이미 선택된 의미의 모순**은 발견하지 않았다. 발견된 차이는 X02의 현행 적용범위 전환, X03의 선택별 상위승인, X04의 D0010 부분대체, X05의 탐지공백 및 DBTEST020의10/11 이력 drift로 구체화했다. 이들을 후속 구현자가 자기 판단으로 우회하도록 남기지 않는다.

