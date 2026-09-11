# Marble Worlds Animation & Presentation Design

이 문서는 Marble Worlds 개발 과정에서 애니메이션과 연출에 관한 현재 합의사항을 장기 기준으로 남기기 위한 설계 기록입니다.

세부 수치, 에셋, 테마별 연출 스타일은 구현 단계에서 조정할 수 있지만, 아래의 핵심 방향과 개발 순서는 이후 Marble 개발 계획에 포함하는 것을 기본 원칙으로 합니다.

## 1. 목표

Marble Worlds의 시각적 재미는 단순히 3D 보드를 보여주는 데서 끝나지 않습니다.

게임 상태가 숫자로만 변경되는 것이 아니라 플레이어가 **돈이 이동하고, 도시가 성장하고, 캐릭터가 상황에 반응하는 과정을 눈앞에서 경험하도록 만드는 것**을 핵심 목표로 합니다.

원하는 연출의 성격은 다음과 같습니다.

- 게임 진행 전반에 다양하게 존재하는 애니메이션
- 중요한 순간은 충분히 화려하지만 모든 행동이 과도하게 번쩍이지 않는 강약 조절
- 수금, 지출, 구매, 건설, 이동, 이벤트 등 게임 결과가 시각적으로 이해되는 피드백
- 고정 쿼터뷰 2.5D 보드의 가독성을 해치지 않는 자동 카메라 연출
- 이후 테마마다 같은 게임 의미를 서로 다른 시각 언어로 표현할 수 있는 확장 구조

## 2. 가장 중요한 구조 원칙

### 서버/게임 엔진이 결과를 결정하고 애니메이션은 결과를 재생한다

온라인 게임에서는 애니메이션이 게임 판정을 결정하지 않습니다.

```text
Server / Game Engine
        ↓
확정된 State + Game Event
        ↓
Animation Director
        ↓
Animation Queue
        ↓
UI / 2.5D / VFX / Camera / Sound
        ↓
최종 State 표현
```

예를 들어 통행료 300 지급이 발생하면 서버가 먼저 다음과 같은 의미의 결과를 확정합니다.

```text
TOLL_PAID
from: Player A
to: Player B
amount: 300
```

클라이언트는 이 결과를 받은 뒤 Player A의 돈이 빠져나가고 Player B가 수금하는 장면을 재생합니다.

애니메이션이 느려지거나 실패하거나 사용자가 빠르게 넘겨도 실제 게임 금액과 소유권은 이미 서버 상태를 기준으로 확정되어 있어야 합니다.

### 연출은 게임 진행을 막는 필수 의존성이 아니다

현재 온라인 구조의 2D-first / optional visual enhancement 원칙을 유지합니다.

- 게임 상태와 조작 가능 여부가 먼저 정상이어야 함
- 2.5D, 파티클, 카메라 효과가 실패해도 게임은 계속 가능해야 함
- Realtime 재접속이나 snapshot 복구 시 긴 과거 애니메이션을 억지로 재생하지 않고 최신 상태로 수렴할 수 있어야 함
- 모바일 성능에 따라 연출 품질을 단계화할 수 있어야 함

## 3. Animation Director / Queue

향후 연출이 많아질수록 여러 이벤트가 동시에 재생되어 화면이 꼬이지 않도록 공용 연출 계층을 둡니다.

### Animation Director

게임 이벤트를 어떤 연출 시퀀스로 표현할지 결정합니다.

예:

```text
PLAYER_MOVED
→ 말 이동
→ 착지 강조

TOLL_PAID
→ 통행료 표시
→ 지불자 금액 감소
→ 돈 이동 연출
→ 수금자 금액 증가
→ 수금 완료 반응
```

### Animation Queue

연속된 사건을 의미 있는 순서대로 재생합니다.

예를 들어 상대 도시 도착 후 파산까지 이어지는 경우:

```text
PLAYER_MOVED
→ TILE_LANDED
→ TOLL_PAID
→ PLAYER_BANKRUPT
```

화면에서는 다음과 같이 순차적으로 보여줍니다.

```text
말 이동 완료
→ 도착 도시 강조
→ 통행료 지급/수금
→ 잔액 반영
→ 파산 연출
```

Queue는 이후 다음 기능을 고려합니다.

- 현재 연출 완료 대기
- 서로 독립적인 micro animation의 병렬 재생
- Skip
- Fast Forward
- 재접속/상태 복구 시 queue 정리 또는 최신 state로 수렴
- reduced motion 또는 저사양 품질 단계 대응

## 4. 연출 강약

모든 행동을 같은 크기로 연출하지 않습니다.

### Micro — 약 0.1~0.4초

게임 흐름을 끊지 않는 즉각적인 피드백입니다.

- 버튼 반응
- 숫자 변화
- 타일 선택
- HUD 강조
- 작은 잔액 증감

### Normal — 약 0.5~1.5초

일반적인 핵심 행동을 명확히 보여줍니다.

- 도시 구매
- 통행료 지급/수금
- 건설/업그레이드
- START 보상
- 세금/보너스
- 이벤트 카드

### Highlight — 약 1.5~4초

게임의 전환점이나 큰 성취에 사용합니다.

- 랜드마크 완성
- 큰 금액 수금
- 독점/지역 완성
- 파산
- 역전성 이벤트
- 최종 승리

시간 값은 초기 기준이며 실제 플레이 템포를 보면서 조정합니다.

## 5. Money Animation

돈의 변화는 단순 숫자 갱신이 아니라 **어디에서 어디로 이동했는지**를 이해할 수 있도록 표현합니다.

### 플레이어 간 통행료

```text
상대 도시 도착
→ 통행료 금액 표시
→ 지불자 HUD에서 금액 count-down
→ 코인/돈 오브젝트가 수금자 방향으로 이동
→ 수금자 HUD count-up
→ 수금 완료 강조 및 캐릭터 반응
```

### START 월급/보상

```text
START 통과
→ START 타일 강조
→ 은행/보드 중앙에서 보상 등장
→ 플레이어 HUD로 이동
→ 잔액 count-up
```

### TAX

```text
세금 발생
→ 금액 표시
→ 플레이어 HUD count-down
→ 돈이 중앙/은행 방향으로 흡수
```

### BONUS

```text
보너스 발생
→ 보상 오브젝트 등장
→ HUD로 수금
→ count-up + 작은 파티클
```

금액 규모에 따라 반응 강도를 조절할 수 있습니다.

예:

- 작은 금액: 짧은 HUD 피드백
- 큰 금액: 더 강한 수금 연출 + 캐릭터 반응
- 보유 자산의 큰 비율을 잃는 지출: 충격 반응 강화

정확한 임계값은 밸런스 단계에서 결정합니다.

## 6. Property / Building Animation

도시 구매와 건설은 Marble Worlds의 대표적인 시각적 성취로 다룹니다.

### 도시 구매

```text
도시 도착
→ 구매 확정
→ 타일 테두리/소유 색상 활성화
→ 건설 지점 강조
→ 랜드마크 또는 기본 건물 상승
→ scale overshoot / 착지
→ 파티클 또는 빛 효과
→ 소유권 표시 완료
```

랜드마크는 단순히 즉시 나타나는 방식보다 땅에서 올라오거나 조립되는 느낌을 줄 수 있습니다.

### 건물 업그레이드

건설 레벨이 오를 때 현재 모델을 바로 교체하지 않고 성장 과정을 보여주는 것을 목표로 합니다.

```text
기존 건물 강조
→ 증축/변형 연출
→ 새 건설 단계 모델 전환
→ 완성 효과
```

### 소유권 변경

거래나 특수 규칙으로 소유권이 바뀔 경우 기존 소유 색상이 사라지고 새로운 플레이어 색상으로 전환되는 연출을 제공합니다.

## 7. Character Animation

캐릭터는 단순한 위치 표시용 말이 아니라 게임 상황에 반응하는 존재로 확장합니다.

기본적으로 다음 동작을 단계적으로 구현합니다.

- idle
- 걷기/이동
- 점프
- 타일 착지
- 돈 획득 반응
- 돈 손실 반응
- 큰 금액 수금 환호
- 큰 손실 충격
- 건설/구매 성공 반응
- 파산
- 승리

같은 사건이라도 규모에 따라 캐릭터 반응을 달리할 수 있도록 설계합니다.

## 8. Dice / Event / Special Tile Animation

### 주사위

현재 서버 권한 결과 원칙을 유지하면서 다음과 같은 표현을 발전시킬 수 있습니다.

- 충전/입력 피드백
- 흔들림
- 투척
- 물리 충돌
- 최종 눈 강조
- 더블 또는 특수 결과 강조

주사위 연출은 결과를 결정하지 않고 서버 결과를 시각화합니다.

### EVENT

```text
카드 등장
→ 뒤집기
→ 내용 공개
→ 대상 플레이어/타일 강조
→ 실제 효과 연출
```

### REST / 감옥형 특수 칸

캐릭터 고유 반응과 타일 효과를 결합합니다.

### 독점/지역 완성

관련 타일을 순차적으로 점등하고 마지막에 완성 강조 연출을 줄 수 있습니다.

### 파산/승리

Highlight 등급으로 취급하며 일반 행동보다 긴 시퀀스를 허용합니다.

## 9. Camera Presentation

기본 플레이에서는 지금의 고정 Orthographic 쿼터뷰를 유지합니다.

사용자가 직접 계속 카메라를 돌리는 방식보다 게임의 중요한 순간에 시스템이 짧게 카메라를 연출하는 방향을 우선합니다.

예:

```text
기본 전체 보드
→ 대상 도시로 부드럽게 focus/zoom
→ 랜드마크 건설
→ 잠시 강조
→ 기본 보드 시점 복귀
```

사용 예:

- 랜드마크 건설
- 큰 금액 통행료
- 독점 완성
- 특수 이벤트
- 파산
- 승리

카메라 연출 때문에 플레이어가 현재 턴이나 다른 플레이어 상태를 놓치지 않도록 짧고 목적성 있게 사용합니다.

## 10. VFX / Sound

향후 Animation Director가 다음 표현을 함께 조율할 수 있도록 합니다.

- UI motion
- 2.5D/3D object animation
- particle / glow / impact effect
- camera presentation
- sound effect
- character reaction

소리와 시각 효과는 게임 상태와 분리하며 특정 효과가 로드되지 않아도 게임 진행이 가능해야 합니다.

## 11. 테마별 Animation Presentation

테마별로 서로 다른 애니메이션과 효과를 사용하는 것을 장기 목표로 합니다.

다만 **테마별 구체적인 연출 디자인은 추후 각 테마 개발 시 결정**하며, 지금 단계에서는 확장 가능한 계약만 염두에 둡니다.

핵심 아이디어는 공용 게임 이벤트의 의미와 테마별 표현을 분리하는 것입니다.

```text
공용 의미
TOLL_PAID
PROPERTY_PURCHASED
BUILDING_UPGRADED
BONUS_RECEIVED
PLAYER_BANKRUPT
        ↓
Theme Presentation Layer
        ↓
Classic Animation Pack
Space Animation Pack
Ocean Animation Pack
Fantasy Animation Pack
```

예를 들어 `BONUS_RECEIVED`라는 게임 의미는 같더라도 테마에 따라 전혀 다른 오브젝트, 파티클, 사운드, 카메라 표현을 사용할 수 있습니다.

아래는 방향을 설명하기 위한 예시일 뿐 확정 디자인이 아닙니다.

- Classic: 현금/코인/도시 건설 중심
- Space: 에너지, 홀로그램, 워프 계열 표현 가능
- Ocean: 물결, 버블, 해양 구조물 계열 표현 가능
- Fantasy: 마법, 룬, 소환/성장 계열 표현 가능

테마가 Game Engine 자체를 복제하지 않고 **같은 semantic event에 다른 presentation을 연결하는 것**이 목표입니다.

## 12. 개발 단계에 반영할 Animation Roadmap

애니메이션을 최종 폴리싱 단계에 한꺼번에 넣지 않습니다. 안정화 이후부터 기반을 만들고 새로운 게임 기능을 추가할 때 해당 기능의 기본 연출도 함께 개발합니다.

### A. Online Stability 마무리

먼저 현재 Classic 온라인 플레이가 2~4인 환경에서 안정적으로 끝까지 진행되도록 합니다.

### B. Animation Foundation

- Animation Director 계약
- Animation Queue
- 이벤트 → 연출 매핑
- 공용 timing/easing 정책
- money count-up / count-down
- HUD 강조
- Skip / Fast Forward
- reconnect/snapshot recovery 시 queue 처리
- visual failure가 gameplay를 막지 않는 fallback

### C. Classic Core Feedback

- 이동/착지 애니메이션
- START 보상
- 통행료 지급/수금
- TAX / BONUS
- 도시 구매
- 건물 건설/업그레이드
- 소유권 표시

### D. Character + Camera + VFX

- 캐릭터 기본 이동/상황 반응
- 랜드마크 건설 강조
- 자동 카메라 focus
- 구매/건설/통행료/이벤트 VFX
- 파산/승리 Highlight 연출
- 사운드 연결
- 모바일 품질 단계

### E. Classic Advanced Gameplay와 연출을 함께 개발

향후 Advanced Gameplay는 기능만 구현하고 나중에 연출을 붙이지 않고 각 기능 PR에 필요한 기본 presentation을 포함하는 방향을 우선합니다.

예:

- Auction: 입찰 금액, 참가자 반응, 낙찰 연출
- Trading: 플레이어 사이 돈/도시 교환 연출
- Secret Mission: 공개/성공/실패 연출
- Luck resource: 충전/소모 피드백
- Reaction cards: 카드 등장, 대상 지정, 효과 연출

### F. Space Vertical Slice에서 테마 연출 구조 검증

Space 전체 개발 전에 작은 Vertical Slice를 만들 때 공용 semantic event와 Space 전용 presentation을 실제로 분리할 수 있는지 검증합니다.

이 검증을 통과한 뒤 필요할 경우 Theme Presentation 계약을 공용 시스템으로 승격합니다.

### G. 이후 테마 확장

- Space 완성
- Ocean
- Fantasy

각 테마는 동일한 게임 이벤트라도 자신만의 animation/VFX/sound language를 가질 수 있습니다.

### H. Final Visual Polish

- 에셋 품질 향상
- 애니메이션 연결 자연스러움
- 상황별 카메라 고도화
- 성능 최적화
- 품질 옵션 및 reduced-motion 보완
- 게임 템포에 맞춘 전체 timing 재조정

## 13. 구현 시 지켜야 할 체크포인트

새로운 게임 이벤트나 기능을 구현할 때 다음을 확인합니다.

1. 게임 결과는 Renderer/Animation이 아니라 Engine 또는 Server가 결정하는가
2. 결과를 표현할 semantic event가 충분한 정보를 제공하는가
3. Animation Queue에서 사건 순서를 안정적으로 표현할 수 있는가
4. 연출 실패/skip/reconnect 상황에서도 최종 state가 정확한가
5. 작은 행동과 큰 사건의 연출 강약이 구분되는가
6. 모바일/저사양에서도 플레이를 막지 않는가
7. 향후 다른 테마가 동일 이벤트를 다른 방식으로 표현할 수 있는가

## 14. 현재 결정된 것과 나중에 결정할 것

### 현재 결정된 방향

- 다양하고 적절하게 화려한 애니메이션을 Marble Worlds의 핵심 재미 요소로 다룸
- 돈의 이동, 도시의 성장, 말/캐릭터의 움직임을 핵심 피드백 축으로 삼음
- Animation Director / Queue 형태의 공용 연출 계층 도입
- Micro / Normal / Highlight 강약 체계
- Money / Property / Character / Dice / Event / Camera / VFX / Sound를 단계적으로 확장
- 기능 개발과 기본 연출 개발을 가능한 한 함께 진행
- 테마별 presentation 확장을 고려한 구조 유지

### 추후 결정

- 각 테마의 구체적인 이펙트 스타일
- 정확한 애니메이션 duration/easing
- 금액 규모별 반응 임계값
- 최종 캐릭터/랜드마크 에셋 스타일
- 테마별 사운드와 파티클 언어
- 카메라 연출의 세부 프리셋

이 문서는 이후 Marble Worlds 관련 새 채팅이나 새 작업 브랜치에서도 애니메이션/연출 방향을 다시 설명하지 않고 참고할 수 있는 기준 문서로 사용합니다.
