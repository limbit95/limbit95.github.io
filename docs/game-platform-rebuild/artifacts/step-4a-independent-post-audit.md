# STEP 4A — Work Astra 독립 사후 감사

판정: **승인 검토 가능**. 지정된 정식 산출물에서 신규 보완 finding **Critical 0 / Major 0 / Minor 0**.

- 요청: 사용자 2026-10-02T17:17:05+09:00, 가이드5 독립 사후 감사·원격 제출 후 정지.
- 고정 감사 대상: `2d1827ed45491720e9baaf55b5c36fd12f785efe`, tree `dab0a0cc2cdf344175c5bca4d312e528124a800a`.
- 이번 시작 HEAD: `1ebb4bc40eaa34778f95c94a972427ca8a3cf12e`, tree `36d4f6c45681eddb4a9ccce31b1b89f99ba4e1ab`.
- 실제 integration: `ad7655a051f0dbb13444eec6f469f6f98f9794f4`. PR411 OPEN/Draft/merged=false, 기존 STEP4A 브랜치와 integration base 유지.
- 대상은 정식 제출의 문서 설계 적합성이다. 결과 승인·실제 구현 지원·Target 동결 판정으로 확대하지 않는다.

## 1. 기존 감사와 이번 검토의 관계

[기존 보고서](step-4a-post-audit.md)와 CP0039~40은 이전 검토 이력으로 보존한다. 사용자는 이전 응답이 Work Astra의 담당 항목을 수행한 것과 별도 Astra 감사 실행을 구분하지 못한 점을 확인하고 이번 독립 검토를 명시적으로 요청했다. 이전 기록만으로 이번 요청이 완료됐다고 처리하지 않았다.

이번 결론은 계획의 게이트 → 정식 본문 → 승인 STEP2/3 요구 → 현행 규칙·관련 코드 → 반례 순으로 다시 도출했다. 동일 대화의 이전 결론을 열람할 수 있으므로 블라인드 감사라고 주장하지 않는다. 역할 표기는 요청된 Work Astra 감사 단계이며, 과거 작업의 모델 실행 이력을 새로 인증하지 않는다. 현재 감사 완료와 다음 행동은 이 보고서·CP0041·CURRENT를 따른다.

## 2. 입력 고정과 확인 방법

AGENTS, 계획1.3, 기록 README, 실제 PR/integration, CURRENT/CP0040, DECISIONS를 대조했다. 원격에서 정식 문서·trace·검증·출처 검토를 고정 SHA로 다시 조회했다. 기존 로컬 파일은 원격 tree의 Git blob과 대조한 뒤 읽었다. 현재 HEAD와 지정 감사 대상 사이의 blob 차이는 이전 감사 기록5경로뿐이며 정식 본문은 동일하다.

| 정식 입력 | 고정 blob |
|---|---|
| [책임·의존](step-4a-responsibility-boundaries.md) | `610efc904bdaec8881535d3405fe81102bd3d5df` |
| [수명·전환](step-4a-lifetime-contract.md) | `5e40988234caba6cb605ea4c0b386a0a5b83b9c5` |
| [충돌·후속](step-4a-risks-and-followup.md) | `127dba7bbfe7a423a5824efea6ac0043a1ab368f` |
| [반영 trace](step-4a-contract-source-trace.md) | `f549969caa3bfffb914bf276e594bb61c76668e8` |
| [반영 검증](step-4a-validation.md) | `00174413821eed5d506d68c468519de2478051d0` |
| [선택 원문 검토](step-4a-research-verification.md) | `cb08c6531dbdb1c4efe108910583d0ec1d8bd896` |

저장소 근거 E번호는 [고정 source index](step-4a-source-trace.md)의 S4A-E01~33이다. source의 SHA/줄 위치가 유효하다는 검사와 해당 내용이 결론을 지지하는지에 대한 의미 검토를 구분했다.

## 3. 실행 계획의 게이트별 독립 판정

| 게이트·위험 | 직접 대조 | 판정 이유 |
|---|---|---|
| 책임 표·Core 확대 | 계획 §2, 책임 §2, STEP2 7축 | Core는 실행·구성·공통 수명/오류/정리 규약을 소유한다. 모델이 경기/view/순서 의미를 제공하고 소비자가 반영, 서버가 권한을 집행한다. 필수 Room/host/tick/DB/DOM/전역 상태가 추가되지 않았다. 충족 |
| 의존 금지 | 책임 §3, 계획의 Profile·Game-local·Site Adapter | 구현 역의존, 숨은 전역/순환, 이중 최종 파괴권을 금지한다. 주입된 계약 호출은 허용하므로 금지 규칙이 모델 연결 자체를 막지 않는다. Profile은 레시피다. 충족 |
| 규칙→계약 의무 | 책임 §4, 개발 §6/9/10A/10B, 승인 STEP3 S3-R02/R03 | 현재 adapter 사용 시8개 surface와 테스트/규칙 동시 갱신 의무, stale/accepted UI/정리, 종료 권한·UX, 재대결 의무를 유지한다. 초기 hostless와 재대결 hostless를 합쳐 면제하지 않는다. 비DB 전환은 후속 동등 안전성·규칙 변경 검토다. 충족 |
| 세 비동기 전환 | 수명 §5~7, 승인 STEP3 T01~03 | 실행/추적/경기/view를 구별하고 성공·오류·null·finally·정리·effect의 반영 범위를 설명한다. room/version 하나로 안전을 주장하지 않는다. 아래 반례에서도 의무가 빠지지 않는다. 충족 |
| 기존 snapshot과 새 모델 공존 | 수명 §8, E22~27, C09/C11 | 기존 코드의 부분 방어와 새 계약 요구를 구별한다. room 없는 solo, 연결보다 긴 상태, 다른 시간/동기화 의미를 특정 필드·이관 없이 설명한다. 연결 방식은5A에 남긴다. 충족 |
| 근거·지원 과장·후속 선결정 | 정식 헤더·trace·검증, 후속 §9 | 문서 사고 실험/코드 관찰과 실행 지원을 구분한다. 4B/5A/5B/5C/6의 결정을 앞당기지 않고 기존 리스크를 닫지 않는다. 새로운 필수 Core 전제가 없어 STEP2 즉시 회귀 불필요 판단에 동의 |

## 4. 결론을 반박할 수 있는 경우를 대입한 검토

아래는 문서 계약에 대한 사고 실험이며 런타임 실행 테스트가 아니다.

| 반례 | 본문의 방어와 남는 경계 |
|---|---|
| 경기A의 응답 version이 경기B보다 크거나 같음 | §6.1은 적용 맥락을 먼저 요구하고 version으로 다른 수명을 살리지 못하게 한다. §7은 낮음/동등/높음을 모두 다룬다. 비교 범위 설계는4B |
| A→B→A로 room 이름이 다시 같아짐 | §5의 비재사용 추적 수명과 §7의 재검증 조건 때문에 과거A 작업을 새A로 자동 채택할 수 없다 |
| 이전 요청이 실제로 현재B 상태를 반환함 | 예외는 현재 살아 있는 소비자가 authoritative·authorized 상태임을 재검증하는 경우다. 이전 owner의 생존을 인정하지 않는다는 문장과 §6.1의 반영 시점 재확인을 함께 적용해야 한다. 증명 불가 시 거부/현재 재조회. 현재 전환 응답 자체를 모두 버리는 모순도 피함 |
| 채택 검사 직후 await 또는 동기 callback 재진입으로 맥락 변경 | §6.1 제5조건이 반영 직전 재확인 또는 동등한 일관성 근거를 요구한다. callback 입구 검사만으로 끝낼 수 없음 |
| 늦은 null/error/leave 완료가 현재 상태를 비움 | §6.1 경로 표·T02가 과거 부재/오류로 현재 화면·추적을 지우는 것을 금지. 서버에서 이미 반영된 leave의 복구/유효성은 별도4B 문제로 유지 |
| 이전 finally가 새 작업 spinner를 해제 | 자기 작업 bookkeeping만 정리할 수 있고 현재 owner 상태는 건드릴 수 없다. 공통 boolean 하나가 이를 구현한다는 주장은 없음 |
| dispose 중 unsubscribe가 예외를 던지거나 callback 재진입 | §6.2는 반영 권리 무효화를 먼저 요구하고 종료와 정리 성공을 분리한다. 독립 자원 정리 시도·실패 기록도 요구. 현행 함수의 dispose 이름만으로 충족한다고 보지 않음 |
| dispose 뒤 늦게 자원을 획득하거나 같은 listener를 새 수명에 재등록 | 늦은 획득 자원의 해제/격리, 자기 소유 자원만 정리, listener 식별 재사용 제한이 모두 명시돼 있다. 구체 handle/lease 방식은 미확정 |
| 같은 room/match/version에서 참가자→관전자→참가자 | §7은 이전 private 사용 연결과 늦은 완료를 차단하고 역전환 시 옛 cache 자동 복원을 금지. 서버 검증과 client 표시 수명 모두 필요. 미인지 철회·전송 중 데이터·검사 시점은4B의 미결정 |
| 두 실행이 사이트 BGM/연결을 공유 | §5/6.2는 공용 owner와 개별 사용권을 구분한다. 한 실행 dispose가 다른 실행의 공용 자원을 파괴하는 설명이 아님 |
| room 없는 solo 또는 브라우저보다 긴 장기 상태 | 적용되지 않는 차원은 근거와 함께 제외한다. 가짜 Room/host를 만들지 않으며 연결 종료와 durable 상태 삭제를 구분한다. 저장 구현 지원은 보류 |

위 조건의 실제 구현·검증 가능성은 후속 API 설계와 실행 증거로 확인해야 한다. 다만 그 사실만으로 STEP4A가 요구하는 의미 초안의 게이트를 미충족으로 판정할 근거는 없다.

## 5. 코드·외부 원문의 선택 확인

snapshotCoordinator의 `runRefresh`는 await 뒤 version을 비교하며 낮은 값만 거부한다. `dispose`는 `stop` 다음에 disposed를 설정한다. controller와 Reconnect의 모든 경로가 같은 보호를 공유한다고 볼 수 없다는 정식 §8의 제한은 source와 일치한다. Can’t Stop의 직접 apply·leave 이후 정리와 No Thanks의 일부 generation 검사 및 일반 command catch/finally를 직접 대조했다. 이번 관찰은 기존 F01의 새로운 장애 재현이나 기존 게임 변경 요청이 아니다.

외부 원문은 이번 결론에 필요한 두 절을 2026-10-02 직접 재확인했다.

- [DOM §2.7](https://dom.spec.whatwg.org/#dom-eventtarget-removeeventlistener): 공개 removeEventListener는 대상의 type/callback/capture로 등록을 찾는다. 이전 정리가 같은 조합의 새 등록을 제거할 수 있다는 반례를 지지한다. 내부 listener 객체를 받는 abort 알고리즘까지 무조건 동일하게 일반화하지 않는다.
- [Fetch §5.6](https://fetch.spec.whatwg.org/#abort-fetch): 이미 fulfilled인 promise의 reject는 효과가 없으며 body 처리는 별도다. 일반 후속 작업 전체의 무효화나 서버 commit rollback을 이 절에서 보장받을 수 없다.

다른 S01~07/X01~07 전체를 이번에 재조사했다고 주장하지 않는다. 기존 선택 원문 검토의 제한을 유지하며, 플랫폼의 구체 권한/취소 정책을 외부 표준이 확정한 것으로 취급하지 않았다.

## 6. 검증과 한계

- 원격 고정 tree와 로컬 기존74파일의 blob 대조, 현재 진행 입력6파일 원격 재조회·일치 확인. CURRENT/분담은 감사 대상 당시 내용과 현재 진행 내용을 구분했다.
- 별도 절 분리 검사로 판단 §1~9가 정식3본문에 각1회 정확히 반영됐음을 확인했다.
- 기존 고정 입력 검사를 재실행: 감사 대상 누적25문서 상대링크181/표33·공백 오류0, source33 blob/줄 위치, Governance 입력22파일 동일성 확인.
- 기존 Governance RepositoryState/DocumentPolicy 및 이전 감사 변경5/누적28경로 분류 재실행 오류0. 이번 추가 기록4문서 상대링크99/표5/상태22·과거CURRENT 이력·공백 검사 오류0. 이번 변경4/PR누적30경로 Governance 분류도 오류0.
- 지정 감사 대상의 workflow runs0/check-runs0를 재조회했다. CI **NOT_TRIGGERED**.
- 전체 Git checkout/Guard CLI·runtime/unit/build/DB/browser/production **NOT_RUN**. 기존 runtime 코드 변경이 없는 설계 감사다. 실행 테스트 통과/기존 결함 해소/production 지원을 주장하지 않는다.
- S3-R01~07 및 기존 F/R/U/IMPL 상태 유지. 식별 proof·권한 검사 시점·ordering·복구·cache 정책은4B/6, 연결 비용·호환성은5A, Result/Publication/Sound는5B, 장르 제품 정책은5C에 남는다.

## 7. 제출과 다음 행동

정식 대상에 신규 finding이 없어 가이드6 보완 요청은 없다. **가이드5 독립 감사 완료, STEP4A REVIEW_PENDING**. 다음은 사용자의 결과·PR411 integration 병합 승인 검토다.

이번 기록은 CURRENT/분담 수정과 이 보고서/CP0041 추가의4경로로 제한한다. 이전 감사와 checkpoint, 정식 산출물, 판단/조사 원본, 계획/규칙/코드/DECISIONS는 보존한다. 저장 후 실제 PR HEAD와4파일 read-back·전체 tree 차이를 확인하고 최종 제출 SHA를 PR에 기록한다. 병합·STEP4B·main·production은 진행하지 않고 제출 뒤 멈춘다.
