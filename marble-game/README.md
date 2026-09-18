# Marble Worlds

Marble Worlds는 서로 다른 세계관과 규칙을 선택해 즐기는 3D/2.5D 온라인 마블 보드게임 플랫폼을 목표로 합니다.

## 설계 기록

- [Marble Development Roadmap](../docs/marble-development-roadmap.md) — 현재 개발 위치와 Phase별 완료 상태, 다음 개발 단계를 확인하는 기준 문서입니다.
- [Animation & Presentation Design](./ANIMATION_DESIGN.md) — 돈의 이동, 도시 건설, 캐릭터 반응, 자동 카메라, VFX/Sound, Animation Director/Queue, 테마별 presentation 확장과 향후 개발 순서를 기록합니다.
- [Classic Feature & Presentation Candidate Backlog](../docs/marble-classic-feature-candidates.md) — Classic 재미 요소와 최종 비주얼 고도화 후보를 구현 확정과 분리해 보존합니다.
- [Auction Playtest UX Review](../docs/marble-auction-ux-review.md) — 실제 플레이테스트에서 확인한 경매 UI/흐름 재검토 항목을 관리합니다.

## 현재 단계

### Phase 7 — Classic Advanced Gameplay

현재 개발 위치는 **Phase 7A 경매 완료, Phase 7B 거래/협상 완료, Phase 7C 자산 매각 기반 파산 회피 완료**입니다.

Phase 4의 고정 Orthographic 쿼터뷰 2.5D 비주얼 기반은 그대로 유지하면서, Phase 5의 온라인 멀티플레이와 Phase 6의 Realtime/재접속/복구 안정화 위에 고급 플레이어 상호작용을 추가하고 있습니다.

Phase 7A에서는 구매 거절 후 다른 플레이어가 경매를 요청하고 참여할 수 있는 request-gated 경매를 로컬/온라인 양쪽에 연결했습니다. 서버 권위 RPC, version/idempotency, Realtime refresh, reconnect, stale snapshot 방어와 멀티플레이 회귀 검증까지 완료되어 main에 통합된 상태입니다. 다만 실제 플레이테스트 기준 현재 경매 UI와 플레이 흐름은 별도 UX 재검토 대상으로 남아 있습니다.

**Phase 7B — Trading / Negotiation**은 거래 lifecycle, 정산, 서버 권위 RPC, Realtime/재접속, 온라인 UI, 멀티플레이 회귀 검증과 main/운영 DB 통합까지 완료했습니다. 거래 상태는 `pendingTrade` authoritative snapshot을 기준으로 하며, 응답 대기 중 제안자는 자신의 제안을 취소해 게임 진행 잠금을 해제할 수 있습니다.

**Phase 7C — Debt Recovery / Asset Liquidation**은 foundation, Classic v1 50% 환급 정책, lifecycle, deterministic settlement, Game Engine wrapper, local runtime, authoritative liquidation RPC, isolated DB 검증, Realtime/reconnect, 온라인 자산 매각 UI, 멀티플레이 회귀 검증, PR #281 main 통합과 운영 Supabase 활성화까지 완료했습니다.

세부 Phase 이력과 현재 상태는 [Marble Development Roadmap](../docs/marble-development-roadmap.md)을 기준으로 합니다.

## 구조

게임 규칙과 Renderer는 계속 분리합니다.

```text
Game Engine / Theme Rules / State
              ↓
        Renderer Contract
              ↓
Classic fixed quarter-view 2.5D renderer
```

Renderer는 게임 상태와 이벤트를 시각화할 뿐 게임 규칙을 결정하지 않습니다. 멀티플레이 단계에서도 서버가 결정한 결과를 Renderer가 재생하는 구조를 유지합니다.

## Classic 비주얼 정보 계층

```text
항상 보이는 정보
- 타일 색/구역
- 도시명
- 랜드마크 또는 특수 오브젝트
- 플레이어 말
- 소유/건설 상태의 시각적 변화

필요할 때만 보이는 정보
- 도시 구매가
- 현재 통행료
- 소유자
- 건물 단계/건설 비용
- 특수 타일 효과
```

상세 정보는 보드를 복잡하게 만들지 않도록 타일 선택 또는 플레이어 도착 시 별도의 정보 모달로 제공합니다.

## 현재 플레이테스트

Classic 플레이 창에서 다음을 확인할 수 있습니다.

- 32칸 고정 쿼터뷰 보드
- 로컬 Classic 규칙 플레이
- 2~4인 온라인 대기실 및 서버 권위 멀티플레이
- 주사위 및 `PLAYER_MOVED.path` 기반 말 이동
- 타일 클릭/터치 선택
- 도착 타일 자동 정보 모달
- 도시 구매/소유권/건설 1~3단계 반영
- START / EVENT / TAX / BONUS / REST 특수 칸
- Realtime 동기화 및 재접속/snapshot 복구
- 구매 거절 후 경매 요청/입찰/패스/낙찰 흐름
- 현금 부족 시 자산 선택 매각을 통한 debt recovery 및 채무 정산 흐름
- 3D 로드 실패 시 2D 상태 보드 fallback

## 수동 검토 포인트

1. 보드 외곽이 화면을 충분히 크게 차지하는가
2. 도시명이 타일 표면에서 즉시 읽히는가
3. 중앙 공간보다 실제 플레이 타일의 존재감이 큰가
4. 랜드마크와 도시명이 서로 가리지 않는가
5. 클릭 및 도착 시 상세 정보가 자연스럽게 연결되는가
6. 향후 고품질 랜드마크/캐릭터 에셋을 올릴 수 있는 비율인가

## 다음 비주얼 품질 작업

현재 절차적 도형 모델을 최종 그래픽으로 간주하지 않습니다. 이후 단계에서 다음을 별도로 고도화합니다.

- 도시별 고유 랜드마크 모델
- 캐릭터 모델과 걷기/점프/도착/승리 애니메이션
- 건설 단계별 고품질 건물/랜드마크 변화
- 주사위, 구매, 건설, 이벤트 이펙트
- 게임 상황에 따른 자동 카메라 연출
- 모바일 성능/품질 단계

세부 애니메이션/연출 구조와 단계별 개발 계획은 [Animation & Presentation Design](./ANIMATION_DESIGN.md)을 기준으로 합니다.

모두의마블은 화면 구성과 캐주얼 2.5D 보드게임 감각의 참고점일 뿐이며, 실제 에셋·캐릭터·UI·랜드마크 디자인은 복제하지 않고 Marble Worlds만의 시각 언어로 제작합니다.
