# STEP5B — 호환·수명·검증 owner와 제한적 보류

- 상태: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-10 KST 사용자 실행 요청으로 Astra §9.1의 다섯 핵심 판단 묶음 전체와 정식 문서 반영·검증·원격 PR 제출을 허용했다. 정식 결과 최종 검토는 남아 있으며 STEP5B **REVIEW_PENDING**이다.
- 판단 원문: [실제 Astra](game-platform-vnext-step5b-astra-judgment.md). [Sol 근거](game-platform-vnext-step5b-evidence.md)는 사실 입력, [계획/인계](game-platform-vnext-step5b-plan-and-handoff.md)는 범위·분담·게이트다. 유효 승인 원문/결정이 우선하며 Astra 승인 판단을 Sol/Codex가 재수행하지 않는다.
- 아래 원문 절은 bytes를 그대로 반영하고 원문 절 번호를 유지한다. 원문의 ‘사용자 승인 대기/전’, ‘NOT_STARTED’, ‘이번 직접 읽기’, ‘다음 첫 작업’은 Astra 작성 당시 상태·행위다. 현재 승인 범위와 제출 상태는 이 헤더, [CURRENT](../CURRENT.md), [CP0082](../checkpoints/CP-0082-step-5b-formal-submitted.md), [문서 검증](step-5b-validation.md)을 따른다. 원문의 조건·미확인·보류는 유효하다.
- 고정 판단 SHA: `3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0`. STEP5A COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED. 행동·DB/browser/audio/두 client **NOT_RUN**, 기존 **UNKNOWN**·구현/실행/오픈 의무 유지. integration 병합·main·공개 활성화·STEP5C 이후는 이번 허용 범위가 아니다.
- 정식 대응: [책임별 선택/최소 계약 §2~5](step-5b-contract-boundaries.md), [중복/Probe/확장 §6](step-5b-duplication-and-extension.md), [owner/보류/검증 §7~9](step-5b-compatibility-lifetime-verification.md), [입력/source trace §1·10](step-5b-source-trace.md). 여섯 중복 의미는 계약 문서 §4.2에 단일 본문으로 둔다. R/N/F/A/T/U는 Sol 원본 ID, J01~19는 STEP5B Astra ID이며 STEP4A T01~03와 Sol 테스트 ID를 혼동하지 않는다.

## 7. 소프트웨어 owner와 후속 작업 담당

| 소프트웨어 owner | J 책임 | 책임 밖 / 금지 | 구현·실행 증거의 주체 |
|---|---|---|---|
| Core | 최소 식별/발견·구성·실행 수명·공통 오류/정리. 미선택 기능을 강제하지 않는 연결 | 공식 결과 판정·Result 필수 schema·Room/host/DOM·통계/출시/오디오 의미 | 허용된 Core 구현 담당이 부분 초기화·dispose/재진입·현재 owner 보호 증거 제출 |
| runtime/model | 선택 권위·순서·현재성·확정/잠정·결과 범위/정정 관계·복구/terminal. Snapshot/Reconnect 단일 최종 채택·복구 | 별도 Result coordinator가 같은 상태의 두 번째 최종 채택자가 되는 것, 사이트 공개 승인/게임 규칙 소유 | model 구현 담당이 T01~03 전 경로·동기화/복구·예측/정정 oracle 제출 |
| capability | 실제 선택 기능의 본체·적용 조건·소비 계약·자기 자원/작업 수명. 공통 Result 소비가 승격되면 이 범위만 | feature 존재를 지원 인증으로 해석, 독자 인증·새 권위·제품 의무 면제 | 기능 구현 담당이 미선택/부적합 조합·retry/정정·자기 owner 정리 증거 제출 |
| Site Adapter + 사이트 utility/release owner | 기존 Auth/identity·metadata/route·공개 사실/사이트 consumer·Invite/BGM 연결. 사이트 공용 자원의 실제 owner 연결 | 새 metadata catalog·권한/순서/수명/token/audio 엔진 은닉, 표시를 인가로 대체 | 사이트 연결/본체 담당이 기존 API/entry/목록·H1~3·공개 소비 호환 증거 제출 |
| game-local | 규칙·결과/outcome 계산·게임 전용 서버 규칙·콘텐츠·UI/Visual Identity·표현/SFX/곡/mode·얇은 설정 | 공통 본체 복제·private 숨김으로 권한 대체·확정 소비를 예측으로 실행 | 게임/표현 구현 담당이 도메인 결과·viewer 표현·effect 수명·디자인 회귀 증거 제출 |
| backend / 해당 권위 저장 owner | 보호 결과 확정·정정 권한·직렬화/내구성·인가 A/C/P·영속 소비 중복/owner fencing·현재 정보 제공 | client Gate/DOM/ACK로 commit 증명, late C를 새 P/후속 소비의 자동 허가로 전파 | backend 구현 담당이 실제 transaction·lock·commit 미상/retry·정정·private/삭제/복원 증거 제출 |

소프트웨어 owner는 파일명·클래스·담당 모델명이 아니다. 작업 모델 **Astra**는 이번 핵심 판단 및 후속에 발견된 새 의미 충돌의 해당 항목만 맡는다. **Sol/Codex**는 사용자 승인 범위의 문서 정식 반영·source trace·기계적 정합성 검증을 맡고 판단을 다시 수행하지 않는다. 실제 구현·시험 담당과 환경은 원래 허용 단계에서 정한다. 여기서 owner를 배정했다는 사실은 구현·배포·시험 수행자를 확보했다는 뜻이 아니다.

## 8. 설계 blocker와 남는 의무

### 8.1 현재 결론

**J — 이번 최소 경계 선택을 막는 추가 필수 설계 공백은 확인하지 못했다.** 결과 정정의 의미, consumer 중복 책임, 공개 사실/소비 분리, 표현·Sound 수명, Profile 유보를 지금 판단할 수 있다. 실제 실행 증거가 없는 이유로 모든 설계를 보류할 필요는 없다. 이 말은 구현 가능성·지원 완료·운영 조건 충족 인증이 아니다.

| 종류 | 현재 처리 / 해당되는 범위 |
|---|---|
| 사용자 판단 승인 | §3~7의 핵심 선택 승인 대기. 정식 반영은 승인+명시적 반영 허용이 모두 필요 |
| 구체화가 남은 설계 | Probe 제품 결과/통계/표현 필요, 결과 식별·정정/소비 형식, 실제 게시 연결·NEW/공지 정책, BGM 내부 수명 기법. 해당 기능을 실제 선택할 때 필요한 부분만 원래 STEP에서 구체화 |
| 구현을 막는 조건부 문제 | 선택된 consumer가 결과 권위/정정/중복/접근 의미를 설명하지 못함; 보상 정정 불가를 숨김; 공통 보완이 기존 소비자와 비호환; Adapter가 새 엔진을 숨김. 그 consumer/연결을 보류하고 해당 설계로 회귀 |
| 미래 미선택 | 공통 XP/reward, 자동 publication, 정밀 audio 모델, 새 Profile, H4 비room Invite. 현재 전체 STEP5B blocker 아님 |
| legacy 미확인 | Liar v12/후속 SQL 최종 운영 정의 등. 직접 재사용 판정을 하지 않았으므로 전수 SQL 확인을 현재 전제로 삼지 않음. 실제 직접 재사용을 선택하면 해당 정의·caller만 좁게 확인 |
| 실행/오픈 의무 | 아래 전부 NOT_RUN/UNKNOWN 유지. 문서 판단이나 테스트 파일 존재로 닫지 않음 |

### 8.2 후속 검증 의무 — 이번에는 전부 NOT_RUN

- **결과·소비:** 정상 완료/중단/결과 없음·팀/동률·관전자, 예측→rollback→확정, commit 미상 후 동일 명령 retry, 같은 결과 소비 retry, 정정의 중복·역순·충돌·부분 실패, 정정 전 기여 보존 오류 방지. 필요한 영속 효과의 권위·내구성·재처리 증거.
- **전체 완료와 viewer:** STEP4A T01 같은 Room 새 match, T02 A→B→A, T03 role/view/user 전환을 success/error/null/finally/cleanup/leave/effect·timer/observer/RPC/후속 비동기에 적용. 과거 진단과 현재 UI 오류 구분; history 조회의 별도 owner·현재 권한; 현재 private 사용 차단과 옛 cache 자동 복원 금지.
- **인가·저장:** CP0075/D0010 현재 A/C/P·known expiry·owner anchor·최초60초/terminal oracle. 권위 결과 commit 후에도 새로운 consumer 보호 행위/응답은 자기 현재 인가 필요. STEP4B 기록 열람·30일 삭제·탈퇴 unlink·복원 정책 보존.
- **Publication:** 실제 release 승인/activation 증거, 같은 사건의 재처리/복구/정정·의도된 새 사건 구별, 선택한 목록/NEW/공지의 중복/부분 실패·현재 owner·접근·정정 표시. 기존 production 현재 완료를 이번에 선언하지 않음.
- **Presentation/BGM:** 정정/재조회/재접속을 효과 재발행 근거로 오인하지 않음. controller 내부 latest intent·success/reject/finally·pause/play/track/destroy·재진입·공유 Audio owner 및 기존 API/게임 회귀. 실제 browser 음향·autoplay/모바일은 source/fake Audio로 대체하지 않음. H1~3 그대로 유지.
- **기존 의무:** 실제 두 client·성능/복구·모바일·운영 비용/삭제/백업/복원과 기존 게임 공존을 승인된 owner/게이트에서 검증. 100명/판8·p95 250ms·각 재연결5초·세금 포함 월 추가3만원·외부 백업/RPO24h/발견 후24h/7일 복구점·Free서울/기존 운영 조건 및 UNKNOWN을 이번에 재결정하거나 닫지 않음.

## 9. 사용자 승인할 핵심 선택과 정식 반영 범위

### 9.1 승인 요청 대상

1. **J01~07:** 종료/결과/outcome/viewer와 producer/consumer 분리, 권위 결과의 식별·확정·정정·중복 의미는 지금 최소 계약. 계산/저장·집계 모델은 실제 필요에 따라 확장하고 공통 XP/보상 엔진은 보류.
2. **J08~12:** merge/구현/activation/공개 사실/표시·공지 분리, 필요 시 같은 공개 사건·정정 관계를 식별. Registry metadata 중복 없이 사이트 연결. NEW/공지 제품 정책은 실제 선택 때 구체화하고 자동화 서비스는 보류.
3. **J13~16:** model의 채택과 viewer/effect 소비 분리, game-local 디자인/SFX/곡/mode 유지. 기존 BGM 본체+내부 최소 수명 보완/H1 유지. 새 보편 결과 화면/audio 엔진은 보류.
4. **J17~19 및 §6:** 최소 Capability 선택 규약만 지금 정하고, 실제 필요·반복 증거로 model/capability 승격. Profile은 반복된 검증 조합의 recipe이며 현재 생성·필수화/엔진은 보류.
5. **§7~8:** 책임·호환·수명 조건과 범위 한정 보류, NOT_RUN/UNKNOWN·구현/실행/오픈 의무, API/Target 미동결 및 기존 승인 불변을 보존.

기존 D0010/STEP5A 결정을 다시 승인받는 요청이 아니다. 이번 판단 승인은 저장소 반영 허용과 별개이며 사용자가 두 가지를 함께 명시하면 그 범위로 다음 작업을 진행한다. 정식 반영/PR 제출 허용은 STEP5B 정식 결과 승인·완료·integration 병합·main·구현·STEP5C 허용이 아니다.

### 9.2 승인 후 Sol/Codex가 반영할 내용

| 정식 반영 단위 | 보존할 원문 / 검증 |
|---|---|
| 책임별 3분류·최소 계약 | §2~5, J01~19 전체. 분류와 이유·조건·미확인을 축약하여 구현 약속으로 바꾸지 않음 |
| 중복/확장·Probe 적용 | §4.2/6 전체. 여섯 중복 의미, Profile recipe, 반복/필요 기준, Probe 미선택의 조건을 보존 |
| owner·호환·수명·후속 | §7~8 전체. 소프트웨어 owner와 작업 모델 구분, 제한적 보류·조건부 회귀·NOT_RUN/UNKNOWN 보존 |
| 입력/trace·원본 | 이번 판단 원문과 Sol 근거·계획을 원본으로 보존하고 §1/10의 고정 SHA/blob/출처 연결. 기존 source를 다시 전수 감사하지 않음 |
| 진행 기록·제출 검증 | 정식 결과는 **REVIEW_PENDING**, 사용자 최종 검토·별도 병합/main 게이트 유지. 허용 diff·본문 의미/표/링크·상태·고정 입력·기존 자산 불변 확인. 별도 사후 감사 단계 추가 안 함 |

정식 파일 수/이름은 기존 rebuild 관례와 중복 최소 원칙으로 정한다. 실행 API/schema/코드 배치와 혼동하지 않는다. 새로운 의미 충돌이 발견되면 충돌 원문·영향 행·필요 선택만 Astra/사용자에게 돌리고, Sol이 전체 판단을 다시 수행하거나 과거 승인 정책을 재결정하지 않는다.

