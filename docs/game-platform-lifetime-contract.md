# Game Platform vNext — 전체 수명·완료 계약

> **문서 분류:** CURRENT
> **적용 범위:** 신규 vNext (기존 consumer 제외)
> **계약 식별:** GP-LIFETIME/1

신규 vNext 상위 진입은 [AR](game-platform-architecture.md)다. 기존 consumer는 [기존 development](game-platform-development-rules.md)·[기존 UI](game-platform-ui-rules.md)·선택 DB의 기존 계약을 유지한다. 이 CURRENT는 topic+계약/consumer scope의 단일 본문이며 문서 존재는 runtime 구현/지원 완료가 아니다.

승인 근거: [STEP6 Target](game-platform-rebuild/artifacts/step-6-target-architecture.md), [전수 ID/f](game-platform-rebuild/artifacts/step-6-clause-destinations.md), [CP0089](game-platform-rebuild/checkpoints/CP-0089-step-6-design-result-approved.md), 실제 PR417/418 병합. STEP7A1 반영 PR은 REVIEW_PENDING이며 최종 결과 검토·병합은 남아 있다. 행동 NOT_RUN·UNKNOWN·후속 의무를 유지한다.

## LI1 적용 직전 채택

성공 snapshot만이 아니라 모든 비동기 완료의 반영 직전에 owner/context·현재 user/role/view·권한·선택 모델 순서/최신성·반영시점이 맞아야 한다. 방ID나 숫자version만으로 같은room새match·A→B→A·role/view/user 변경을 해결했다고 판단하지 않는다. 선택 모델이 현재성/순서 의미를 제공하고 단일 최종 채택/복구를 소유하며 이 계약은 이를 재정의하지 않는다.

Core의 실행·자원 수명, runtime/model의 상태·입력·복구, Capability와 Site Adapter의 사용권/구독·외부완료, game-local 화면/effect를 연결한다. user-facing Gate는 backend 인가의 대체물이 아니다. 완료가 늦게 도착했을 때 새로운 실행/권한으로 부활시키지 않는다.

## LI2 모든 완료·자원·정리

success/error/null/finally/cleanup/leave/effect/후속 비동기 완료 모두 적용한다. 부분초기화 실패·재진입·반복 dispose·dispose 뒤 늦게 획득한 자원도 포함한다. stale error/null/finally가 새 상태의 오류/loading/정리를 바꾸지 못해야 한다. 요청취소 성공만으로 완료채택 책임이 사라지지 않는다.

생성·구독·전환·정리의 owner와 최종파괴권은 하나다. 게임은 자기 사용권을 반납하며 site 공유자원 전체를 파괴하지 않는다. 늦게 얻은 자원은 소유범위를 확인해 정리하고 새 실행의 자원을 old disposer가 해제하지 못하게 한다. leave/cleanup 이후 후속 effect/audio/dialog 완료에도 같은 계약을 적용한다. 특정 클래스/token/epoch/취소 기법을 계약의 유일 구현으로 동결하지 않는다.

Invite의 전구간 identity/handler/dialog owner, BGM 본체 내부의 최신의도/종료/작업귀속 보완은 CA2/CA3의 조건이다. wrapper가 내부 late Audio/DOM 완료를 보호했다고 선언하지 않는다. backend의 writer/sender 보호·owner anchor는 MO3이며 client dispose로 대체하지 않는다.

### 원문 참조 계승 — 이 절의 실제 ID/f 본문

원문 강도·부정·부모문맥·조건/예외를 보존한다. f0는 원문전체를 참조 계승한다. 명시f1…은 지정 의미만 이 절이 소유하고 아래 전체인용은 출처/조건문맥이다. 다른 조각·예시·L/H/I를 이 절의 새의무로 승격하지 않는다. DB/기존consumer/장르조건은 승인 적용·전환 열에 따라 해석하며 다른scope의 본문을 경쟁권위로 만들지 않는다.
<a id="legacy-dev-272-f0"></a>
#### LEGACY-DEV-272 / f0

- 원문: [docs/game-platform-development-rules.md L538–538](https://github.com/limbit95/limbit95.github.io/blob/90f14ceb3e609267aa559980994a07eacb0160f3/docs/game-platform-development-rules.md#L538-L538); blob `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c`.
- 원강도: 서술형(수치화 안 함); 명시부모: 없음 — source 절/도입·sibling 문맥 유지.
- 원문 조건/예외 연결: C041.
- 승인된 적용/전환: 선택DBsnapshot/복구 / 참조계승.
- 책임 의미: 원문전체+원부모/조건/예외; 원문 범위: 전체 f0.
- 검증 대응: V-D.

```text
구독과 browser listener는 게임 화면 종료 시 정리할 수 있어야 한다.
```

## LI3 T01~03·모델 맥락 연결

T01 같은room 새match, T02 A→B→A, T03 role/view/user 변경을 모든 적용 완료종류와 교차해 검증한다. roomless는 run/view/resource의 전환으로 대응한다. roomless라는 이유로 수명·안전종료·새run 격리를 없애거나 fake Room/no-op8메서드를 만들지 않는다.

새 실행 current 상태가 채택되기 전에는 이전 state를 LIVE로 부활시키지 않는다. 복귀/재연결 trigger 자체가 복구 성공은 아니며 단일 선택 모델의 reconciliation과 입력준비가 필요하다. 의미가 다른 fault 가지마다 증거를 배정하고 자동테스트와 실제 두client/browser/audio를 분리한다. [STEP4A 전체원문](game-platform-rebuild/artifacts/step-4a-lifetime-contract.md)의 §5~8과 승인 책임 경계를 참조 계승한다. 현재 consumer가 authoritative·authorized 재조회임을명시적으로재검증한데이터는 STEP4A§6.1조건으로채택가능하며 모든이전발행데이터를무조건폐기하는새규칙을만들지않는다. 현재 행동은 NOT_RUN이며 실제 구현/실행 의무가 남는다.

