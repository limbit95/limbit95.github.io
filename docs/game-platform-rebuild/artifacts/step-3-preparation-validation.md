# STEP 3 — 근거 준비 검증 기록

- 기준 integration: `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`. 계획1.3.
- 범위: 근거 준비·조사 전달 자료·착수/인수인계 기록. 정식 matrix/지원/Core 판정 미수행.
- 검증 실행 결과는 아래와 최신 checkpoint에 기록한다. 원격 SHA/CI는 실제 제출 뒤 조회한다.

## 검증 결과

| 검증 | 결과 | 한계 |
|---|---|---|
| 기준선/PR409/CP0017 계보 | PASS — remote/clone HEAD 일치·PR merged·CP 추가 commit은 merge 부모 | main 반복 동기화 없음 |
| 11개 사례·6개 시나리오 | PASS — brief와 조사 입력 각각 ID 누락/중복 없음 | 정식 matrix/의미적 판정 아님 |
| source 근거20개 | PASS — 고정 SHA·파일·줄 범위·blob 대조 | 해당 범위 source 읽기. 전체 게임/SQL 감사 아님 |
| 선택 조항10행 | PASS — STEP1 원본 행 전체 일치 | 전수 계승표 재감사 아님 |
| 전달 자료 원문 발췌 | PASS — 계획 STEP3·7축/시간/Capability·장르 표·hostless 원문 확인 | 요약은 원문 대체 규칙 아님 |
| 22개 상태표 | PASS — 0/1/2 COMPLETED,3 IN_PROGRESS,나머지18 NOT_STARTED | 근거 준비 완료와 STEP 승인 구분 |
| 내부 링크 | PASS — 초기 제출8파일의 상대 링크48개 존재 | 외부 URL 현재 본문 검증 아님 |
| 기존 자산/공백 | PASS — tracked 변경 CURRENT뿐·나머지 신규 준비 문서, diff 공백 없음 | candidate/제출 commit 범위 재확인 |
| Governance Guard | PASS — 작업 트리 정책 검사와 기존 HEAD diff 검사 | candidate commit 비교는 제출 단계에서 다시 실행, 결과는 후속 read-back 기록 |

초기 준비 제출 범위는 산출물5개+CURRENT+CP0018/19 총8파일이다. 사후 원격 제출 기록은 별도 파일/비교 SHA로 구분한다.

## 미실행

전체 게임/unit/build/DB/browser/production: NOT_RUN. 코드·계약·규칙 변경 없는 문서 준비 단계다. package.json에 별도 lint/typecheck 명령 없음. 관련 문서 trace·링크·범위·상태·Governance를 검사한다. 외부 공식 자료 신규 조사/전수 확인과 STEP1 메모리 재현 재실행도 NOT_RUN. 기존 기록을 이번 증거로 바꾸지 않는다.

## 재현

```bash
git diff --check 177533f97bddf67c95379cfa34dc58f2ccdf9e1c HEAD
node scripts/check-game-platform-governance.mjs --base 177533f97bddf67c95379cfa34dc58f2ccdf9e1c --head HEAD
git diff --name-only 177533f97bddf67c95379cfa34dc58f2ccdf9e1c HEAD
```

의미적 승인·미래 지원 판정은 기계적 PASS와 별도다. 문서 표의 S3-C11개/T6개 중복·누락, S3-E20개 sourceSHA/줄/blob, 원본 조항10행, 전달 자료 원문 발췌의 일치, 내부 링크, 22개 상태와 범위 밖 변경 여부도 비교한다.

## 원격 준비 제출 확인

- 준비 commit: `c0bea6ab518557c1d487a2361d51aae334c829cf`. integration base → 준비 commit diff8개.
- 로컬 준비 commit의 tree와 GitHub 도구 생성 tree `a09f2ff0940816507d211e03f48b0c271ed78c52` 일치. Git push 인증이 없어서 연결된 GitHub 도구로 같은 tree를 제출하고 fetch 후 로컬 commit 계보를 맞췄다. 게임 내용/검증을 바꾸지 않았다.
- 원격 commit fetch 뒤 `node scripts/check-game-platform-governance.mjs --base 177533f97bddf67c95379cfa34dc58f2ccdf9e1c --head HEAD`: PASS. diff --check와 CP0017 추가 commit의 조상 확인 PASS.
- PR410 OPEN/Draft/merged=false, base integration/head STEP3 branch/준비 SHA 일치. 원격 PR 파일8개와 실제 준비 diff 일치.
- 준비 SHA workflow runs0/check-runs0: NOT_TRIGGERED. 원격 CI PASS로 집계하지 않음.
- 제출 read-back 기록 변경은 CURRENT·분담·이 검증·CP0020 총4개. integration 기준 최종 diff는 최초8개에 CP0020을 추가한9개다. 제출 기록 HEAD의 범위/공백/링크/Guard/원격보존/CI는 최종 조회한다.

## 원문·사례 검증 재현 예

저장소 루트에서 다음 Python으로 사례/시나리오·원본행·원문발췌를 비교할 수 있다. source 인덱스의20개 링크/줄/blob은 고정 SHA의 `git rev-parse <SHA>:<path>` 및 해당 줄 범위와 대조한다. Markdown의 내부 상대링크는 각 파일 디렉터리를 기준으로 검사한다.

```python
from pathlib import Path
import re
p = Path('docs/game-platform-rebuild/artifacts')
brief = (p/'step-3-evidence-brief.md').read_text()
packet = (p/'step-3-auxiliary-research-input.md').read_text()
for text in (brief, packet):
    assert len(re.findall(r'^\| S3-C\d\d \|', text, re.M)) == 11
    assert len(re.findall(r'^\| S3-T\d\d \|', text, re.M)) == 6
rows = [line for line in brief.splitlines() if line.startswith('| LEGACY-')]
original = (p/'step-1-clauses-platform.md').read_text().splitlines()
assert len(rows) == 10 and all(row in original for row in rows)
selection = (p/'step-2-implementation-selection.md').read_text()
assert selection[selection.index('## 선택표'):selection.index('## 호환·충돌 예시')] in packet
print('PASS: 11 cases, 6 scenarios, 10 exact source rows, selection excerpt')
```
