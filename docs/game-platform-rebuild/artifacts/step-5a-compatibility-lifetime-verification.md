# STEP5A — 호환·수명·검증 owner와 제한적 보류

- 상태: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 사용자는 실제 Astra 핵심 판단과 이번 문서 반영·검증·원격 PR 제출을 명시적으로 승인했다. 정식 결과 최종 검토·STEP5A 완료·integration 병합·main 반영은 남아 있다.
- 직접 반영 입력: [실제 Astra 판단 원본](game-platform-vnext-step5a-astra-judgment.md) §6·7·8. 기준 commit `aabb7646c0cdfd6466f2195579dce54689c7b81c`. [원본 식별·source trace](step-5a-source-trace.md), [문서 검증](step-5a-validation.md).
- Sol/Codex는 승인된 판단을 다시 선택하지 않고 아래 원문 절을 그대로 반영했다. [Sol 근거](game-platform-vnext-step5a-evidence.md)는 사실 입력, [앞선 Codex안](game-platform-vnext-step5a-judgment-and-handoff.md)은 실제 Astra 판단보다 아래의 이력이다.
- 아래 원문의 ‘사용자 승인 전’, ‘이번 직접 읽기’, ‘현재 NOT_STARTED’, ‘다음 처리’는 Astra 작성 당시의 상태·행위다. 현재 승인/제출 상태는 이 헤더와 [CURRENT](../CURRENT.md), [CP0079](../checkpoints/CP-0079-step-5a-formal-submitted.md)를 따른다. 원문의 조건·미확인·제한적 보류는 그대로 유효하며 ‘그대로 연결’도 구현 지원 인증이 아니다.
- 행동 시험 **NOT_RUN**, 구현·실행·오픈 의무와 **UNKNOWN** 유지. 기존 Auth·게임 무이관, 계획1.5·STEP4A/4B·CP0075/D0010 유지. 실제 경로/API/수명 기법의 STEP6 동결이나 STEP5B 이후 착수 없음.
- G1~G5는 [선택표 §3](step-5a-common-module-selection.md#3-모든-분류에-적용하는-승인-요구), source ID는 [trace §9](step-5a-source-trace.md#9-source-trace와-추가-읽기-범위)를 참조한다.

## 6. 소프트웨어 owner와 호환·수명·검증 책임

작업 모델(Astra/Sol/Codex)과 아래 소프트웨어 owner는 서로 다른 개념이다. Core가 공통 수명 토대를 제공해도 game/model/backend의 의미까지 대신 판정하지 않는다.

| 소프트웨어 owner | 소유 책임 | 소유하지 않는 책임 | 호환·후속 검증 책임 |
|---|---|---|---|
| Core | 최소 identity/discovery·구성·실행 수명·공통 오류/정리 규약 | 보편 Room/DOM/host/ready, model ordering·서버 권한 | 부분 초기화·재진입·dispose 후 재활성화 방지·이전 owner 정리·기존 등록 경계 |
| runtime/model | session/match/view 의미·최종 상태 채택·ordering·초기/live·quiet loss·복구/terminal | 사이트 인증 본체·공개 catalog 정책·게임 규칙 | T01~03 모든 완료, 동기화/복구5초·최초60초, old finally/leave, 권한 맥락 변화 |
| capability | Invite 등 선택 기능의 의미·적용 조건·자기 작업/자원 수명 | 존재하지 않는 기능의 지원 표시·독자 인증·게임 도메인 | 부적합 대상 거부·기능 미선택·현재 owner의 완료/실패·의미 호환 |
| Site Adapter 및 연결한 사이트 utility owner | 기존 Auth·metadata/route·Invite handler/entry·BGM 연결. 사이트 자원의 실제 공용 owner 연결 | 새로운 token/audio/권한/복구 엔진을 Adapter 내부에 은닉 | 생성→입장 식별, 구독/등록/DOM 완료, 공용 자원 보호. Invite/BGM 공통 본체 최소 보완의 호환 책임 |
| game-local | 게임 규칙/도메인·콘텐츠·UI·game join 정책·곡/mode·얇은 설정 | 공통 본체 복제·수명/권한 우회·공용 자원 파괴 | 기존 게임·디자인·정책 보존, 채택된 결과만 연출/소리·후속 작업 실행 |
| backend | authoritative state·실제 authorization/private view·A/C/P·중복·owner fencing | client Gate에 보안 전가·late C를 새 P 허가로 해석 | 실제 transaction·lock/fresh predicate·전체 writer/최종 sender 경계·관측 oracle·기존 caller 호환 |

실행 검증 책임은 담당 구현자가 해당 owner별 증거를 제출하는 것이다. 소프트웨어 owner를 지정했다고 담당자·배포 환경·시험 수행이 이미 확보됐다고 말하지 않는다.

## 7. Codex안 유지·수정·보류와 이유

| 핵심 항목 | Astra 처리 | 이유·차이 |
|---|---|---|
| 기존 Auth/게임 무이관, 책임 단위 분류 | **유지** | 계획·STEP4A/4B와 일치. 현재 게임을 새 모델 기준으로 삼거나 고칠 필요 없음 |
| Registry metadata와 실행 구성 분리 | **유지 + 좁힘** | 새로운 최소 책임은 필요. 두 번째 catalog/새 Registry 전체 제작은 불필요한 중복이므로 명시 제외 |
| Access/Room 새 owner·권한 책임 | **유지** | 기존 형식 검사·진입 Gate만으로 현재 맥락·서버 A/P를 충족 못 함 |
| Snapshot 신규 구현 | **유지 + 범위 보정** | 선택 모델의 누락 책임을 추가한다. 전체 coordinator 재작성 의무로 확대하지 않고 utility/알고리즘 재사용 가능성을 유지. 내부 최종 채택자는 하나 |
| Reconnect trigger와 복원 분리 | **유지** | browser 신호는 복구 요청일 뿐. Snapshot과 같은 모델 owner로 합침 |
| Invite room 본체 재사용 | **유지 + 조건 강화** | 양끝 identity 일치 외에 entry/dispatch·등록·dialog 내부 완료까지 수명 소비 필요. 얇은 Adapter만으로 내부 late completion이 해결됐다고 하지 않음 |
| Invite 비room 보류 | **수정** | 구체 현재 필수 consumer가 확인되지 않음. 미래 미선택 범위로 제한하고 현재 설계 결론의 blocker에서 제외 |
| BGM controller 수명 보류 | **수정** | 최소 보완 owner·안전 의미는 지금 정할 수 있음. 설계 선택을 계속 보류할 필요는 없음. 무보완 연결의 적합성·실제 browser 지원만 보류 |
| BGM success 경합 | **보완** | catch/finally·재진입·새 play/track 의도·소유 Audio 정리까지 포함. 실제 소리 현상은 미확인으로 남김 |
| Shell 부품별 재사용·local 표현 | **유지** | 선택적 표시 부품이면 충분. 보편 Room/DOM Shell을 Core로 올리지 않음 |

### 보류 항목의 해소 기준·담당·시점

| ID·범위 | 보류하는 것 | 해소에 필요한 근거 | 담당 owner/작업 모델 | 후속 시점 |
|---|---|---|---|---|
| H1 BGM | 무보완 controller의 vNext 수명 포함 사용 가능 판정 | 최신 의도/종료/완료 귀속의 최소 공통 보완 또는 동등 격리, 기존 API·동작 보존, 경합 시험 | 사이트 BGM 본체 owner + Site Adapter; 허용 단계의 구현 담당 Sol/Codex | STEP6에서 경계/검증 계획을 구체화한 뒤 허용된 STEP7D 연결 구현·실제 browser 검증. 지금 구현 금지 |
| H2 Invite dynamic handler | old disposer/new registration 충돌 가능 상태의 그대로 사용 | 안정적 단일 사이트 등록이라는 실제 조건 또는 소유 확인이 있는 최소 공통 보완; 교체/dispatch 경합 증거 | 사이트 Invite 등록 owner + Site Adapter | consumer 연결 설계 구체화 및 허용된 STEP7D 구현. 동적 교체가 없다면 불필요한 등록 엔진 추가 안 함 |
| H3 Invite dialog | 무보완 내부 늦은 DOM/오류 완료를 vNext 수명 적합으로 인증 | 실행별 dialog 귀속, current UI를 건드리지 않는 내부 완료 보호/동등 격리, destroy/QR/copy/share 경합 검증 | 사이트 Invite 표시 본체 owner + view owner | 허용된 연결 구현/DOM 시험 시. 최소 보완 방향은 STEP5A에서 판단 가능 |
| H4 비room Invite | 의미가 다른 미선택 대상의 지원 | 실제 consumer가 기능을 선택한 근거·target/admission 의미·기존 token/route 본체 호환 검토 | capability·세션 model·backend·Site Adapter; 필요 시 Astra 경계 판단 | 해당 요구가 실제 선택될 때 관련 설계로 복귀. 현재 전체 단계를 막지 않음 |

H1~H3는 재사용 방향·owner 선택을 미루는 표가 아니라 **현재 무보완 사용을 허용하지 않는 제한**이다. 구현 전 최소 보완이 기존 소비자와 양립 불가능한 것으로 드러나면 해당 연결만 재검토한다. 이것을 실제 시험 전까지 모든 STEP5A 판단이 불가능하다는 포괄 HOLD로 확대하지 않는다.

## 8. 설계 공백·실행 의무·사용자 승인

### 8.1 구분

| 종류 | 현재 판단 | 다음 처리 |
|---|---|---|
| STEP5A 책임 선택을 막는 필수 설계 공백 | 이번 제한적 근거에서는 **추가 필수 공백을 확인하지 못했다**. 전면 지원을 증명한 뜻은 아님 | 이 문서의 owner·최소 보완 방향·조건부 재사용을 사용자 검토에 제출 |
| 구체화가 남은 사항 | vNext 등록 표현·실제 consumer별 구성·Invite entry 연결 방식·BGM/Invite 내부 수명 기법·물리 경로/API | STEP6 등 원래 허용 순서에서 구체화. 새로운 감사/재조사 단계로 만들지 않음 |
| 미래 미선택 범위 | 비room Invite·불필요한 보편 Shell·새 audio engine | 실제 요구가 생길 때만 검토. 현재 지원으로 표시하지 않음 |
| 실행 검증 의무 | 실제 backend 권한·A/C/P·동기화·복구·DOM/audio·기존 게임 회귀 | 모두 **NOT_RUN**. 구현/실행/오픈 게이트에서 증거 제출 |
| 환경·운영 전제 | STEP4B의 실제 제품/계정·설정·성능·비용·삭제/복구 등 UNKNOWN/조건부 사항 | 기존 owner·게이트를 유지. 이번에 외부 조사나 운영 작업을 재개하지 않음 |

최소 보완의 존재를 가정하고 지원 PASS로 미루지 않는다. §4와 §7은 **무엇을 어느 본체가 보완해야 하며 무보완 연결은 허용하지 않는지**를 정한다. 후속 구현에서 그 방법이 성립하지 않으면 해당 설계로 돌아간다. 시험은 이 설계를 입증할 의무이며 빠진 책임 결정을 대신하지 않는다.

### 8.2 후속 검증 묶음 — 전부 NOT_RUN

| 대상 | 기존 읽기 근거의 한계 | 필요한 후속 증거 |
|---|---|---|
| Registry | 조회/flag 테스트는 metadata 의미 범위 | ID/route 일치·중복 source 없음·미지원 표시·신규 구성과 기존 목록 호환 |
| Access | mocked Auth/구독 해제만으로 실제 권한 freshness 미입증 | 초기화 지연·user/role/view 전환·기존 Auth 유지·서버 철회/expiry/최종 P |
| Room | mapping/정적 SQL·구독/leave 테스트는 실제 DB 집행과 다름 | 중복/경합·late leave·owner anchor·실제 caller/권한·기존 게임 회귀 |
| Snapshot | coalescing/낮은 version/일부 rematch 테스트는 전체 완료 경로 아님 | T01~03 전 경로·equal version/view·handoff·quiet loss·현재 권한 복구 |
| Reconnect | 이벤트 refresh/stop은 최신 LIVE 증거 아님 | 각 정상망 복구5초·readiness·오류·late completion·최초60초·terminal |
| Invite | envelope/same-origin·token join·e2e 소스 읽기만 재사용 | 전 구간 identity/admission·expiry/revoke·old disposer·QR/copy/share 완료·기존 legacy 연결 |
| Shell | pure state/static wiring만으로 실제 view 수명 미입증 | DOM/mobile·mount/정리·표시 정확성·roomless 미선택·기존 디자인 |
| BGM | fake Audio 정상 경로와 실제 autoplay/BFCache는 다름 | pending success/reject/finally·pause/play/destroy/track 경합·공유 owner·실제 browser·기존 음량/정지/곡 정책 |

STEP4B의 100명/판8·원격 p95 250ms·각 재연결5초·모바일 요구·세금 포함 월 추가3만원·기록 열람/30일 삭제/탈퇴 unlink·외부 백업/RPO24h/발견 후24h/7일 복구점·기존 운영 조건은 변경하지 않는다. 이번 소스 판단으로 실제 계정 잔여·미래 부하·실청구 UNKNOWN이나 오픈 blocker를 닫지 않는다.

### 8.3 사용자가 검토·승인할 항목

1. §4의 책임 단위 선택과 **기존 Auth/게임 무이관·재사용 우선** 원칙.
2. Registry metadata 중복 금지와 Snapshot/Reconnect의 **단일 선택 모델 채택·복구 책임**.
3. Invite의 전 구간 identity·사이트 등록/표시 owner, H2/H3 제한, H4를 미래 미선택 범위로 두는 판단.
4. BGM 본체 재사용과 **controller 내부 최소 수명 보완 책임**, H1의 제한적 보류. 새 audio engine·Core 승격 미승인.
5. §5~8의 중복 기준·소프트웨어 owner·미확인/검증 의무와 정식 문서 반영 방향.

이 판단 결과의 승인은 저장소 수정·branch/PR 생성·STEP5A 완료·병합·구현·시험·STEP5B 이후·main/오픈 허용과 별개다. 사용자가 정식 반영을 함께 명시하는 경우에만 그 명시 범위를 다음 작업에 적용한다. CP0075/D0010의 이미 승인된 정책을 다시 선택하도록 요구하지 않는다.

## 11. 작업 모델의 후속 책임

소프트웨어 owner와 작업 모델을 구분한다. Astra는 새로운 의미 충돌이 발견되는 경우 그 항목의 핵심 경계 판단만 맡는다. Sol/Codex는 승인된 의미의 사실 보완·문서 반영·기계적 검증을 맡는다. 후속 구현·시험 담당과 환경은 원래 허용 단계에서 정하며 이번에 확보·수행됐다고 표시하지 않는다. 별도 사후 감사 단계는 추가하지 않는다.
