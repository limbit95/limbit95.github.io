# STEP5B — 중복 방지·Probe·Capability/Profile 확장 기준

- 상태: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-10 KST 사용자 실행 요청으로 Astra §9.1의 다섯 핵심 판단 묶음 전체와 정식 문서 반영·검증·원격 PR 제출을 허용했다. 정식 결과 최종 검토는 남아 있으며 STEP5B **REVIEW_PENDING**이다.
- 판단 원문: [실제 Astra](game-platform-vnext-step5b-astra-judgment.md). [Sol 근거](game-platform-vnext-step5b-evidence.md)는 사실 입력, [계획/인계](game-platform-vnext-step5b-plan-and-handoff.md)는 범위·분담·게이트다. 유효 승인 원문/결정이 우선하며 Astra 승인 판단을 Sol/Codex가 재수행하지 않는다.
- 아래 원문 절은 bytes를 그대로 반영하고 원문 절 번호를 유지한다. 원문의 ‘사용자 승인 대기/전’, ‘NOT_STARTED’, ‘이번 직접 읽기’, ‘다음 첫 작업’은 Astra 작성 당시 상태·행위다. 현재 승인 범위와 제출 상태는 이 헤더, [CURRENT](../CURRENT.md), [CP0082](../checkpoints/CP-0082-step-5b-formal-submitted.md), [문서 검증](step-5b-validation.md)을 따른다. 원문의 조건·미확인·보류는 유효하다.
- 고정 판단 SHA: `3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0`. STEP5A COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED. 행동·DB/browser/audio/두 client **NOT_RUN**, 기존 **UNKNOWN**·구현/실행/오픈 의무 유지. integration 병합·main·공개 활성화·STEP5C 이후는 이번 허용 범위가 아니다.
- 정식 대응: [책임별 선택/최소 계약 §2~5](step-5b-contract-boundaries.md), [중복/Probe/확장 §6](step-5b-duplication-and-extension.md), [owner/보류/검증 §7~9](step-5b-compatibility-lifetime-verification.md), [입력/source trace §1·10](step-5b-source-trace.md). 여섯 중복 의미는 계약 문서 §4.2에 단일 본문으로 둔다. R/N/F/A/T/U는 Sol 원본 ID, J01~19는 STEP5B Astra ID이며 STEP4A T01~03와 Sol 테스트 ID를 혼동하지 않는다.

## 6. 실제 Probe 적용과 중복·확장 기준

### 6.1 두 Probe에서 지금 필요한 것

| 적용 범위 | J 지금 요구할 최소 의미 | 지금 필수화하지 않는 것 / 후속 조건 |
|---|---|---|
| Probe1 작은 2D 협동 수직 Slice | 기존 승인 범위의 실행·권위·동기화/복구·다중 client·이탈·정리, 선택한 표현의 현재성/잠정·확정 구분. run 완료/공식 결과를 제품상 선택하면 J01~04/13 적용 | 승자/점수/영구 통계/XP/출시 공지/새 Sound capability를 협동이라는 이유만으로 요구하지 않음. 실제 결과가 필요한지는 해당 네 문서에서 선택 |
| Probe2 room/host 없는 local 또는 비동기·기록형 | Room 없이 등록·진입·종료·자원 소유. 결과 없음이면 Result 미선택을 자연스럽게 처리; 기록형을 선택하면 해당 기록의 권위/보존/재진입 의미를 설명 | 가짜 Room·host·ready·winner·서버 RPC·reward 금지. 단일 run 기록과 집계 통계/leaderboard는 별도 선택. 보호 온라인 저장이면 기존 backend 안전 의무 적용 |
| 두 Probe 공통 | 실제 consumer·model·기능 사용/미사용/미결정과 근거 기록. 동일 Core 공통 수명을 적용 | Profile 선행 생성·같은 결과 schema·공통 UI/audio 엔진으로 차이를 지우지 않음 |

이는 Probe 게임 규칙·제품 spec·장르 설계를 지금 결정한 표가 아니다. **필요 없는 선택 기능을 구현하지 않아도 현재 경계 판단은 진행할 수 있다.** 요구가 실제 선택되면 그 consumer에 필요한 최소 모델을 구현하는 원래 순서를 따른다. 새로운 권위·수명·Core 의미가 필요해 기존 계약으로 표현되지 않으면 해당 설계 STEP으로 돌아간다.

### 6.2 공통화와 확장 판단 기준

1. **기존 본체 우선:** 같은 의미·consumer 전제·API·수명 조건의 기존 본체가 있으면 재사용한다. 얇은 연결은 identity/데이터 투영·명시된 호출/구독·owner 귀속을 연결하는 범위다. Adapter 안에서 새로운 권위·순서·수명·token·audio 엔진을 운영하지 않는다.
2. **반복의 단위:** 같은 함수명/비슷한 화면/여러 SQL guard가 아니라, 같은 책임·입력 의미·권위·확정/정정·실패/복구·수명·호환 조건이 반복되는지를 본다. 게임별 score/MVP 알고리즘과 곡/mode 설정은 반복되는 공통 본체와 구별한다.
3. **선택 모델/Capability 승격:** 실제 consumer가 필요하고 반복되는 공통 의미가 확인되면 game-local에서 재사용 가능한 model/capability로 옮기는 안을 검토한다. 현재 승격 약속·임의 게임 수 기준·일괄 추상화는 없다. 기존 공통 본체 재사용은 새로운 반복을 기다리며 복제할 이유가 되지 않는다.
4. **Core의 별도 문턱:** 여러 게임이 쓴다는 사실만으로 Core에 넣지 않는다. 장르와 선택 기능을 넘어 필수이며 안정적·낮은 결합인지 입증해야 한다. Result schema/통계/공개 정책/audio는 현재 그 근거가 없다.
5. **Profile:** 검증된 조합의 반복 뒤 기본값·필요조건·금지 조합·검증 항목을 설명하는 recipe다. 코드 승격 단계·runtime owner·상속 엔진이 아니다. 반복 전에는 선택표로 충분하다.
6. **호환 실패 처리:** 공통 보완이 기존 API/정상 동작과 양립하지 않으면 기존 게임을 고치는 대신 해당 vNext 연결을 보류하고 격리/버전 경계를 재검토한다. 전체 vNext를 근거 없이 HOLD하지 않는다.

