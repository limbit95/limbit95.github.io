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
| 기존 자산 불변 | PASS — 최초 산출물 검증 범위 `792d73befe676cfdc8f8c1f7b7a58a984841cc01 → 882d8556a8e66b59c3b8f0f46f815fffb7869783`: STEP2 산출물5개+CURRENT+CP0014, 총7개 | 당시 검증 범위이며 이후 제출 기록은 아래에 구분. 기존 게임 동작을 새로 실행 검증한 뜻 아님 |
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

## 원격 제출 실제 조회

- 산출물882d8556... 및 제출 기록d07a6760...을 원격 STEP branch ref·fetch와 로컬 tree로 대조했다.
- PR #409 OPEN / draft=false / merged=false, base integration, head STEP branch. 제목·설명·ready 변경 확인.
- PR API head는 착수792d73...을 계속 반환했다. **최신 STEP branch와 PR API head SHA 불일치 확인 필요**. PR 최신 diff 반영을 PASS라고 선언하지 않는다. 감사자는 d07a6760a50b1e9f6e6944055b62c7c654bc2053의 산출물 또는 최신 STEP branch를 사용하고 실제 PR 상태를 재확인한다.
- 882d8556... / d07a6760... workflow runs0/check-runs0: NOT_TRIGGERED.
- integration2636d47... 불변, main/integration에 이번 결과 병합 없음.

- 후속 최종 재조회: PR head d61283c9db7bbc3ce795d32b6ccb7e739e89f4b3 = 원격 STEP branch. 위 일시적 PR head 불일치 해소 확인. 해당 head도 workflow/check-runs0/0, NOT_TRIGGERED. 이 사실 기록 자신의 최신 commit은 Git/PR에서 조회한다.

## STEP 2 사후 감사 보완 검증 — AUDIT-S2-001 / 002

- 입력: allocation 5번 Astra 사후 감사의 Minor 2건. 기존 Astra 판단 초안의 hostless 적용 조건과 검증 시점 설명을 보완한다. 기존 규칙 변경이나 새 모델 채택이 아니다.
- 저장 직전 STEP HEAD: `78467ef4ecd54df4dfa352824abbbe3b79dd01f7`. integration: `2636d47d4a47e09c9ba4729ee5a16bc1cc7216ad`.
- AUDIT-S2-001: 현행 개발 규칙 §6 / LEGACY-DEV-229~234 및 §10B / LEGACY-DEV-311을 확인했다. 초기 시작만 hostless + 기존 재대결 의무 충족은 초기 hostless만으로 규칙 변경 대상이 아니다. 재대결에서도 host가 성립하지 않는 구조는 별도 규칙 변경 검토 대상이다. 재대결 정책 미정은 현재 규칙 적합성 미확인이다. 다른 의무·계약 적합성·구현 증거는 별도 확인하며 fake method/계약 우회 금지를 보존했다.
- AUDIT-S2-002: 최초 검증과 제출 후 diff의 비교 SHA를 구분했다. 아래 과거 수치를 보완 후 HEAD의 집계로 복사하지 않는다.

| 비교 범위 | 파일 수 | 의미 |
|---|---:|---|
| `792d73... → 882d8556...` | 7 | 최초 산출물 검증: 산출물5개+CURRENT+CP0014 |
| `792d73... → 78467ef...` | 8 | 감사 당시 제출 상태: 위 범위에 CP0015 추가 |
| integration `2636d47... → 78467ef...` | 12 | 감사 당시 PR 전체: 준비 산출물과 CP0012/13 포함 |
| 보완 직전 `78467ef... → 이번 보완 candidate` | 6 | STEP2 문서4개+CURRENT+신규 CP0016 |
| `792d73... → 이번 보완 candidate` | 9 | 제출 기록 CP0015와 보완 기록 CP0016 포함 |
| integration `2636d47... → 이번 보완 candidate` | 13 | 이번 보완까지 포함한 PR 전체 |

이번 보완 candidate는 CP0016의 저장 직전 HEAD를 부모로 하는 제출 commit이며, 정확한 제출 SHA는 Git/PR과 최종 보고에서 확인한다.

- 실행 검증: 문서 내 재현 Python의 49개 source trace PASS; 안정 조항 행 전체가 보완 직전 HEAD와 동일 PASS; 기존 규칙·강도·조건·예외 및 STEP1 원본 불변. hostless 세 조건을 선택표·장르 인덱스·GAME_SPEC 근거에서 대조했다.
- diff 범위·공백·상대 문서 링크·22개 상태표를 확인하고, candidate commit에 대해 위 Governance Guard 명령을 실행한다. 실제 실행 결과는 CP0016과 최종 제출 보고를 따른다.
- 기존 F01~F03과 S2-R01~04는 유지한다. AUDIT-S2-001/002는 이번 문서 보완 대상으로 구분하며 해소 여부의 집중 재검토·사용자 결과 승인은 대기한다.
- 전체 게임/build/DB/browser 테스트와 26개 원문 전수 재감사: NOT_RUN. 문서 조건 설명·검증 시점·진행 기록만 변경하고 기존 코드/계약을 수정하지 않았기 때문이다.
- 새 제출 HEAD의 원격 workflow/check 상태는 제출 후 실제 조회하여 최종 보고한다. 이전 HEAD의 NOT_TRIGGERED를 복사하거나 CI PASS로 표시하지 않는다.
