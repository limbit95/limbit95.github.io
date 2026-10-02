# STEP 4B — 근거 준비 검증

검증 대상은 근거 준비 문서와 기록이다. STEP4B 품질 계약의 정식 반영·Astra 판단/감사·실구현 지원 검증이 아니다.

- 고정 기준: integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`, PR411 MERGED, 승인4A tree `26342fb40d44783b6965453b926a356e2a8eead9`
- 착수 commit: `1f1c21d79c84f2b06df99d36e89155b6b7b83e45`, branch `docs/game-platform-vnext-phase4b-evidence-preparation`
- 준비 검사: source trace44개 고정 blob/줄, Governance입력22파일 동일성·RepositoryState/DocumentPolicy/PR변경분류, 신규 문서 링크/표/공백·CURRENT22상태와 보존 범위를 별도 검사한다.
- 기존 보호 자료: 코드·RPC/DB·규칙·계획·승인STEP1~4A 산출물·조사원본·감사·과거checkpoint·DECISIONS를 수정하지 않는다. 최종 원격 tree를 전체 기준 inventory와 비교한다.
- runtime/unit/build/DB/browser/production: **NOT_RUN**, 문서 근거 준비이며 코드 변경 없음. 네트워크 유실/철회/부하 사고 실험을 실행PASS로 표시하지 않는다.
- 전체 checkout/Guard CLI: **NOT_RUN**. 부분 materialization에서 고정22입력+원격전체inventory로 Guard의 세 순수 검증 함수를 실행한다. CLI/CI 실행과 구별한다.
- 외부 원문 신규 확인/현재 가격 조회: **NOT_RUN**. 기존 승인 확인 범위 재사용, 새 공백 Q01~04는 일반Sol5.6 조사로 전달한다.
- 원격 제출/최종 read-back·workflow/check-runs: 준비 commit/Draft PR 생성 후 실제 값으로 기록한다. 제출 직전 검사 결과를 아래에 추가하며 최종 SHA는 자기참조를 피하기 위해 PR본문·최종응답에 기록한다.

다음 행동: 조사 원본 수신·출처 검토 후 Astra3A → 3B → 3C. 이번 준비 제출 뒤 정지.

## 원격 제출 전 실행 결과

- 문서8개: 상대링크/표/공백·CURRENT22상태 검사 오류0. source44개/고정파일36개 blob·줄 확인, Governance입력22개 원격 기준 동일.
- Governance RepositoryState/DocumentPolicy/이번 PR8경로 분류 오류0. shared 게임2개·DBtest 파일3개와 정책입력을 전체 inventory에 대조했다.
- 변경8경로는 CURRENT 수정1 + 신규준비문서6 + CP0043 추가1. 보호 파일 수정/삭제 없음.
