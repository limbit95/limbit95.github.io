# STEP 4A — 보조 조사 수신·선택 원문 검증

확인일: 2026-10-02. 가이드3 판단 입력 검토이며 외부 규격을 플랫폼 규칙으로 채택하는 문서가 아니다.

## 원본·출처·범위

[사용자 제공 Sol5.6 원본](step-4a-auxiliary-research-report.md)은 수정 없이 보존했다. 35368 bytes / SHA256 `7d51370677e5e351a43655e92d07ff8e1e7d2cbc32d2badb7bee1b603f404927` / Git blob `b034af1639ae3c94c80373623f856c48517c0c9d`. 작성 모델·작성 당시 브라우징 로그는 독립 인증하지 않았다. 원본의 AUXILIARY_RESEARCH_COMPLETE는 Q01~03 조사 제출 상태이며 저장소 적합성·핵심 판단·실행 검증 완료가 아니다.

보고서는 취소/늦은 완료, 반복 정리/소유권, 역할 전환/캐시를 다룬다. 저장소 source 확인·플랫폼 계약 결정·런타임 지원 검증을 수행한 자료로 취급하지 않는다. 아래 공식 절을 직접 선택 열람했다. 문서 전체와 모든 하위 링크를 전수 검증하지 않았으며 원본 오류·제한은 이 별도 검토에 남긴다.

| 원본 ID | 직접 확인한 공식 원문·위치 | 확인 결과와 적용 제한 |
|---|---|---|
| S01 | [WHATWG DOM](https://dom.spec.whatwg.org/#aborting-ongoing-activities) §3 AbortController/AbortSignal | abort는 API가 신호를 받아 처리하는 방식이다. 플랫폼 dispose 전체·서버 동작 취소의 보장은 아니다. DOM은 Living Standard이며 이번 열람본 기준이다. |
| S02 | [WHATWG Fetch](https://fetch.spec.whatwg.org/#abort-fetch) §5.6 abort fetch 알고리즘 | 이미 fulfilled인 promise의 reject는 효과가 없고 body 처리는 별도다. 클라이언트 abort를 서버 commit rollback으로 해석할 근거가 없다. |
| S03 | [ECMAScript 2026](https://tc39.es/ecma262/2026/multipage/control-abstraction-objects.html#sec-performpromisethen) §27.2.5.4.1 및 finally §27.2.5.3 | fulfilled/rejected 반응은 job으로 예약된다. abort/unsubscribe가 임의의 후속 반응을 제거한다는 근거는 없다. 원본의 resolved 표현은 settled와 구분해야 한다. 다른 pending promise를 따라가는 resolved 상태를 fulfilled로 보지 않는다. |
| S04 | [DOM EventTarget](https://dom.spec.whatwg.org/#dom-eventtarget-removeeventlistener) §2.7 add/removeEventListener 알고리즘 | 공개 remove는 대상의 type/callback/capture 일치로 제거한다. **새 수명에서 같은 조합을 재등록하면 이전 remove 호출이 새 등록을 제거할 수 있다.** 반복 호출 안전성만으로 수명별 소유권이 증명되지 않는다. |
| S05 | [RFC9700](https://www.rfc-editor.org/rfc/rfc9700.html#section-2.3) §2.3 | OAuth resource server의 요청별 대상 resource/action 검증이다. 플랫폼의 OAuth 채택·관전 구현·권한 검사 시점이 확인된 것은 아니다. 서버 검증과 client 표시 수명을 분리하는 참고다. |
| S06 | [RFC7009](https://www.rfc-editor.org/rfc/rfc7009.html#section-2.1) §2.1 | token 철회 전파 지연 가능성과 최소화 의무를 설명한다. 프로젝트 역할 전환에 실제 지연이 있다는 증거나 철회 뒤 private 제공 허가는 아니다. |
| S07 | [RFC9111](https://www.rfc-editor.org/rfc/rfc9111.html#section-5.2.2.5) §5.2.2.5, §5.2.2.7, §6 | private는 shared cache 제한이며 private cache 저장 가능성이 있다. no-store만으로 privacy 보장을 약속할 수 없다. HTTP cache 규정과 조회 후 application 메모리 사용은 다르다. |

S04의 제한은 원본을 고쳐 쓰지 않고 판단에 명시적으로 반영한다. 나머지는 해당 공식 절이 지지하는 범위만 사용한다. Q01의 늦은 완료 방어, Q02의 소유 자원만 정리, Q03의 서버/클라이언트 경계는 아래 저장소 요구와 함께 도출하는 **플랫폼 설계 판단**이며 외부 표준이 정해 준 플랫폼 API가 아니다.

## 저장소 원문과 대조

고정 integration `ad7655a051f0dbb13444eec6f469f6f98f9794f4`의 [S4A-E01~33](step-4a-source-trace.md) 경로·blob·줄을 사용한다. 계획 §2/STEP4A, 승인 STEP3 T01~03·C09/C11·리스크, 현행 개발 규칙 §6/9/10, DB 계약, snapshotCoordinator·Reconnect·양 controller의 성공/오류/정리를 선택 확인했다. 확인 범위와 한계는 [판단](step-4a-astra-judgment.md)에 연결한다. STEP1 F01은 버전·수명, F02는 handoff/활성화 불일치, F03은 DB 테스트 안내 개수다.

## 미확인과 후속 소유

- 정확한 식별 필드·epoch/sequence·캐시 키·권한 선형화 시점·서버 취소/전파·재시도/오류 형태: 4B 및 6. 이번 조사는 이를 결정하지 않는다.
- 관전/인증 전환의 현재 구현 완전성·실제 private 누출·반복 dispose/부분 초기화 실패의 런타임 결과: 미확인. source상 보장 부족과 실제 장애 재현을 구분한다.
- 기존 모듈 재사용 방식과 수명 계약을 만족시키는 연결 비용: 5A. Result/Publication/Sound 상세: 5B.
- STEP3 X01~07은 승인된 기존 확인 범위로 재사용했으며 이번에 전면 재조사하지 않았다.
