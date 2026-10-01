# STEP 2 — 문서 반영 검증 기록

- 기준: 계획 개정1.3 STEP2; integration 2636d47d4a47e09c9ba4729ee5a16bc1cc7216ad.
- 작업 시작 STEP HEAD: 792d73befe676cfdc8f8c1f7b7a58a984841cc01.
- 입력: Astra 채팅 결과 전체. 보조 조사 원본은 참고로 보존하며 새 규칙이 아니다.
- 실행일: 2026-10-01. 실제 명령은 로컬 Python3/Node 환경; CI 결과로 바꾸지 않는다.

## 검증 결과

| 검증 | 결과 | 한계 |
|---|---|---|
| 브랜치/PR 복원 | PASS — 유효한 기존 STEP branch/PR #409, 원격·로컬792d73... 일치; integration2636d47... 불변 | main 반복 동기화 없음 |
| ID별 분류 trace | PASS — B11+P/R01-BOARD38=49, 누락/중복0; sourceSHA/파일/줄/부모/강도/현분류/E-* 그대로 연결 | 분류 제안의 의미적 승인 아님 |
| 기존 brief | PASS — 56행 원문9열이 기존 STEP1 표와 일치 | 전수 규칙 재감사 아님 |
| 기존 자산 불변 | PASS — 변경은 STEP2 산출물5개+CURRENT+CP0014만 | 기존 게임 동작을 새로 실행 검증한 뜻 아님 |
| 참고 조사 보존 | PASS — 첨부와 사본 본문 동일; 원본 첫 줄의 Markdown 줄끝 공백2개만 정리 | S1~S11 외부 출처 전수 재검증 아님 |
| 링크·공백·22상태 | PASS — 내부 상대링크, diff --check, STEP0/1 COMPLETED·STEP2 REVIEW_PENDING·나머지19 NOT_STARTED | 원문 인용 내부 링크는 source 문맥에서 해석 |
| Governance Guard | PASS — integration 기준과 실제 candidate commit 비교 | 새 표 의미를 Guard가 검증하지 않음 |
| 계획·단계 의미 | 반영 검토 — 장르/모델 다대다, 7축, 단일/복수·단계변경, Capability 별도, FPS/simulation/network 및 physics/audio 구분, 호환/충돌, GAME_SPEC 근거 포함 | Astra 사후 감사·사용자 결과 승인은 미완료 |

새 API/Runtime Model/물리경로/실제 genre 규칙·템플릿·코드·계약은 확정하지 않았다. DECISIONS 불변. F01~F03은 기존 findings로 유지; S2-R01~04는 이번 판단 리스크로 별도 보존한다. hostless 표현은 현행 rematch 준수/규칙 변경 승인으로 표시하지 않는다.

## 미실행과 원격 CI

전체 게임/unit/build/DB/browser/production 검증은 NOT_RUN. AGENTS의 문서 전용 검증 원칙에 따라 기존 코드·테스트·실행 계약 변경 없는 감사 초안 반영에 불필요한 전체 재실행을 생략했다. Guard·조항 trace·링크·보존·diff 검증을 실행한다.

이번 제출 head의 workflow/check-runs는 제출 후 조회해 CURRENT/신규 제출 checkpoint 또는 최종 보고에서 기록한다. 착수 head의 NOT_TRIGGERED를 이번 head 결과로 복사하지 않는다. 미실행을 PASS로 표시하지 않으며 CI 유발을 위한 workflow 변경도 없다.

## 재현

저장소 루트에서 source표의 선택 조항과 새 매핑을 아래처럼 비교한다. 후보 commit 제출 후 Guard와 보존 diff를 실행한다.

```python
from pathlib import Path
import re
base = Path('docs/game-platform-rebuild/artifacts')
expected = {}
for file in base.glob('step-1-clauses-*.md'):
    for line in file.read_text().splitlines():
        if line.startswith('## '):
            source = re.search(r'`([^`]+)`', line).group(1)
        if not line.startswith('| LEGACY-'):
            continue
        cells = line[2:-2].split(' | ')
        if cells[3].endswith(' / B') or ('R01-BOARD' in cells[5] and cells[3].endswith(' / P')):
            expected[cells[0].split(' · ')[0]] = (cells, source)
seen = set()
for line in (base/'step-2-genre-rule-index.md').read_text().splitlines():
    if not line.startswith('| [LEGACY-'):
        continue
    cells = line[2:-2].split(' | ')
    ident = re.search(r'LEGACY-[A-Z-]+-\d+', cells[0]).group()
    assert ident not in seen
    old, source = expected[ident]
    assert '[' + old[0] + ']' in cells[0]
    assert old[2] + ' / ' + old[3] + ' / ' + old[4] == cells[2]
    assert '/132ec1576e316d0238c9ca6e07d0d3ab91950ec8/' + source in cells[1]
    seen.add(ident)
assert seen == set(expected) and len(seen) == 49
print('PASS: 49 source traces preserved')
```

```bash
git diff --check 792d73befe676cfdc8f8c1f7b7a58a984841cc01 HEAD
node scripts/check-game-platform-governance.mjs --base 2636d47d4a47e09c9ba4729ee5a16bc1cc7216ad --head HEAD
git diff --name-only 792d73befe676cfdc8f8c1f7b7a58a984841cc01 HEAD
```

기존 source 원문/조건/예외는 변경하지 않는다. 기계적 trace PASS는 의미적 완전성 승인이 아니다.

- 참고 조사 원본 SHA256: `301907cceb8ee5f98388a95ed5652292397eac3791facae9ea296b8e15aa45f7`.
- 실제 검사 집계: ID별 trace49 / 기존 brief56 / 상대 링크61 / 22개 상태표 일치. 계획 blob `e12ef038913eb6d605709b782f1b73f18e0d1253` 보존.
- 조사 사본의 원본 첫 줄 Markdown hard-break 공백2개를 정리했다. 첨부 자체는 변경하지 않았으며 출처·본문·사실/추론/미확인 내용은 보존했다. 공백 정리 전 원본 hash는 위 SHA256이다.
