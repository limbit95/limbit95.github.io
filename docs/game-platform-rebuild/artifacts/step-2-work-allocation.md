# STEP 2 — 모델별 작업 분담과 진행 순서

이 문서는 실행 계획 개정 1.3 STEP 2 내부의 작업 분담이다. 새 검토 지점이나 Architecture Decision을 만들지 않는다. 현재는 착수·근거 준비만 끝났으며 STEP 2는 IN_PROGRESS다.

## 분담

| 순서 | 담당 | 작업 | 출력과 경계 |
|---|---|---|---|
| 1 | Work Sol 6.1 | 승인된 integration 복원, STEP 1 근거 추출, 착수 기록 | 이 문서와 evidence brief. 기존 규칙·코드·계승표 불변 |
| 2 | 일반 채팅 Sol 5.6 | 필요한 장르 용어·특성·공식 사례의 보조 조사 | 짧은 조사 메모. 저장소 수정과 모델 확정 없음. 추가 근거가 필요할 때만 실행 |
| 3 | Work Astra | 장르 규칙 묶음·적용 조건·논리적 문서 소유자, 7축 선택표·호환성 판단 | STEP 2 초안과 리스크 판단. Runtime API·실제 폴더 구조·STEP 3 stress matrix 확정 없음 |
| 4 | Work Sol 6.1 또는 Codex | Astra 초안을 문서로 반영, trace·범위·기록 검증 | 정식 STEP 2 산출물, CURRENT, 신규 checkpoint, 기존 STEP PR 갱신 |
| 5 | Work Astra → 사용자 | 초안 사후 감사 → 사용자 검토 | 보완은 Sol이 수행. STEP 2 결과 승인과 integration 병합은 사용자 별도 승인 |

일반 채팅의 조사 메모는 첨부나 붙여넣기로 전달한다. 채팅방이나 모델이 달라도 유효한 STEP 2 브랜치를 그대로 이어간다. 모델 선택으로 작업의 정확성이나 특정 토큰 사용량을 보장하지 않는다.

## 일반 채팅 Sol 5.6용 보조 조사 요청

> 첨부한 step-2-evidence-brief.md를 기준으로 Game Platform vNext STEP 2의 보조 조사만 수행해줘. 장르 이름과 실행 특성을 같은 것으로 취급하지 말고, 보드/카드·실시간 협동·반응/PvP·RTS·리듬·레이싱/플랫포머·3D/물리·비동기 장기 진행에서 분류에 필요한 차이를 간결하게 정리해줘. 각 사례를 gameplay flow, 시간/입력, 세션/지속성, 참여/가시성, 권위/동기화/복원, 공간/렌더링/입력/물리, 결과/메타 progression의 7축으로 설명하되 축 선택을 확정하지 마. FPS·simulation tick·network update를 구분하고 Invite/Presence는 별도 선택 기능으로 다뤄줘. 공식 문서나 원 연구만 근거로 사용하고 링크·접근일·확인한 사실·추론을 분리해줘. 불필요한 전수 조사나 긴 일반론은 피하고 저장소·기존 규칙·Core·Runtime Model을 수정 또는 설계하지 마. 지원 구현 완료나 공통 계약 필요성을 단정하지 마. 저장소 접근이 없으면 첨부 근거 범위에서 조사 메모만 작성해줘.

## Work Astra용 STEP 2 판단 요청

> 실제 STEP 2 브랜치의 step-2-evidence-brief.md와 이 작업 분담을 먼저 읽어줘. 필요하다면 Sol 5.6의 보조 조사 메모를 참고하되 이를 규칙으로 승인하지 마. 승인 integration과 CURRENT/최신 checkpoint를 실제 Git과 대조하고 같은 STEP 2 브랜치를 이어가줘. STEP 1 전체 원문을 다시 읽는 대신 근거가 부족한 조항의 고정 SHA·부모·도입문만 추가 확인해줘. 실행 계획 개정 1.3 STEP 2에 한정해 ① 장르 규칙 인덱스 초안(묶음/적용 조건/논리적 문서 소유자/기존 조항 연결/신규 문서 필요성/미결정) ② 7축 구현 선택표(선택 후보/단일·복수 선택/단계별 변경/호환·충돌 예시) ③ GAME_SPEC에 기록할 장르·모델 선택 근거를 작성해줘. 장르와 실행 모델의 다대다 관계, Capability 별도 선택, 3종 빈도 구분을 유지해줘. 기존 의무의 강도·조건·예외를 약화하지 말고 기존 게임은 무이관으로 남겨줘. 문서 소유자는 STEP 2의 논리적 분류 초안이며 물리적 경로·Core API·확정 모델·STEP 6 Target·STEP 7 규칙 개편을 선결정하지 마. STEP 3의 전수 stress matrix는 실행하지 마. 결과와 Sol/Codex용 최소 문서 반영 계획만 보고하고 이번 판단 작업에서는 파일·브랜치·PR을 수정하거나 병합하지 마.

## Sol/Codex 후속 반영 조건

Astra 결과를 사용자에게 전달한 뒤 같은 브랜치에서 정식 산출물을 작성한다. 초안과 근거·미결정을 구분하고 기존 STEP 1 ID/표/과거 checkpoint를 보존한다. CURRENT와 새 checkpoint를 갱신하고 문서 trace·링크·diff 범위·Governance Guard를 검증한다. 완성된 STEP 2만 REVIEW_PENDING으로 바꾸며 STEP 3는 NOT_STARTED로 둔다. Draft PR을 최종 검토용으로 전환하는 시점까지 사용자 검토·merge 게이트는 그대로 유지한다.
