# STEP 4A — 정식 산출물 검증·재현

상태: **가이드4 정식 제출 검증 / 사후 감사 전**. 기준은 판단 입력 `36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd`과 integration `ad7655a051f0dbb13444eec6f469f6f98f9794f4`이다. 이번 검증은 반영의 정확성과 변경 범위를 확인하며 가이드5의 독립 의미 감사·실행 지원 인증을 대신하지 않는다.

## 1. 검사 범위

- [책임/의존](step-4a-responsibility-boundaries.md): 원문 §1~4, [수명/전환](step-4a-lifetime-contract.md): §5~8, [충돌/후속](step-4a-risks-and-followup.md): §9. 판단 전체 본문을 각1회 원문 그대로 반영한다.
- [정식 trace](step-4a-contract-source-trace.md): 절9개 대응 줄·고정 source33개·선택 원문 조항10개·시나리오/후속 연결. [준비 trace](step-4a-source-trace.md)는 그대로 보존한다.
- CURRENT/분담, 신규 CP0036~38을 포함한 이번 전체 허용 범위10문서. 기존 판단/보조 조사·선택 원문 검토·승인STEP1~3·과거 checkpoint·DECISIONS·코드/규칙/계획 불변.
- 로컬은 원격 고정 파일의 선택 materialization이며 full Git checkout/clean tree 검증 환경이 아니다. 원격 recursive tree와 파일 read-back으로 전체 경로·blob·mode/type 보존을 확인한다.

## 2. 실행 결과

- 1차 반영8문서: 원문9절 exact·source33 blob/줄·선택조항10 exact·상대링크110/표11·상태22·CURRENT 과거 상세 이력·변경 문서 끝공백 PASS, 오류0.
- 원격 고정 Governance 입력22파일 hash 확인. 정책문서12·게임2·DB테스트3개 파일목록으로 RepositoryState/DocumentPolicy 함수 오류0. 이번8경로/PR누적23경로 변경분 분류 오류0. 이 개수는 1차 반영 당시 범위이며 최종 기록 포함 범위는 후속 결과로 구분한다.
- 판단/원본·선택 원문 검토·보호된 로컬 source는 시작 remote tree blob과 일치한다. 전체 원격 tree 보존은 제출 후 확인한다.
- 정식 gate 대조: 책임6주체·규칙연결7행·금지의존6항목, 수명8범위·채택5조건·완료6경로·정리7항목, T01~03×6행·공존4사례·후속7행 보존. 사고 실험/계약 의미를 실행 PASS로 승격하지 않았다.

### 최종 제출 기록 포함 검사

- 변경10문서: 원문9절 exact·source33 blob/줄·선택조항10·상대링크139/표11·상태22·CURRENT 과거 상세 이력·엄격 공백 검사 오류0. STEP4A REVIEW_PENDING, 후속 NOT_STARTED 유지. 문서 내 Python 재현 코드도 실제 실행하여 9절/원본/33source 검사를 통과했다.
- Governance 순수 함수 검사: RepositoryState/DocumentPolicy 오류0, 이번10경로·PR누적25경로 변경분 분류 오류0. 두 게임/3개 DB테스트 파일목록·12정책문서 등22고정파일 입력을 사용했다.
- PR 누적25문서의 엄격 끝 공백 검사 오류0. 전체 저장소/과거 STEP3 공백 FAIL 해소 판정이 아니다.
- 반영 commit `eac8ca872ed3fb88211219cc11f45c1853c827a8`·tree `48213aa254214a0065c96829a7ff87691e39d303`: 원격9파일 exact·허용9경로/삭제0/기존 blob·mode/type 불변·PR head/base/Draft/미병합 확인. 해당 SHA workflows0/check-runs0 NOT_TRIGGERED.
- 최종 제출 기록 commit은 원격 저장 후 전체 tree/10파일 read-back·최종PR head·integration 불변·CI를 다시 조회한다. 자기 SHA를 미리 확정하지 않으며 실제 최종 SHA/read-back 결과는 PR 설명·사용자 제출 보고에 남긴다.

## 3. Governance 검증의 정확한 범위

고정 입력 SHA에서 Guard source·Registry·정책/게임 문서22개를 받아 blob을 대조한다. truncated=false 전체 tree로 게임 디렉토리2개, 게임별 파일 목록, DB 테스트 파일 목록을 구성한다. 이 입력으로 기존 Guard의 아래 세 순수 검사 함수를 실행한다.

- `validateRepositoryState`: Registry/게임 문서/필수 링크/테스트 파일 존재·bootstrap/release 기록을 검사한다.
- `validatePlatformDocumentPolicy`: CURRENT/HISTORY·문서 권위·게임별 내용 위치·checkpoint 정책을 검사한다.
- `validatePullRequestChanges`: 이번 변경과 PR 누적 변경의 경로를 각각 분류한다.

검사 결과는 이번 실행의 결과 절에 기록한다. `runGovernanceCheck` CLI의 Git/전체 checkout 수집 과정 자체는 **NOT_RUN**이다. 순수 함수 검사 통과를 그 CLI 실행 PASS라고 부르지 않는다. 검증용으로 가져온 기존 파일은 원격 commit 대상이 아니다.

## 4. 사고 실험·실행 검증 한계

T01~03×성공/error/null/finally/정리/경계의 설명, effect와 현재 authorized 재조회 예외, 반복 dispose/부분 초기화/늦은 자원 획득/공용 자원 소유를 원문대로 반영했다. 책임6주체·수명8범위·채택5조건·정리7항목·공존4사례·후속7행의 누락을 검사한다. 이것은 **문서 반영 검증**이다.

runtime/unit/build/DB/browser/production **NOT_RUN** — 기존 기능/코드/계약 구현 변경이 없는 설계 문서 제출이다. AGENTS의 문서 전용 작업 테스트 생략 규칙을 적용한다. `package.json`에 lint/typecheck script 없음. CI는 최종 제출 SHA를 실제 조회하며 workflow/check0이면 **NOT_TRIGGERED**, PASS가 아니다.

과거 STEP3 전체 integration 엄격 공백 FAIL(보존 조사 원본 Markdown 끝2공백12곳)은 당시 이력으로 유지한다. 이번 신규 변경 공백 검사, PR 누적 변경 범위 검사, 전체 저장소 공백 검사는 서로 다른 범위다. 과거 FAIL을 수정/해소했다고 주장하지 않는다.

## 5. 재현 방법과 사후 감사 입력

전체 Git checkout이 있는 환경에서는 최종 PR411 head를 checkout하고 고정 판단/조사 원본의 blob을 확인한다. 최종 SHA는 제출 기록/PR 설명에서 조회하며 검증 파일에 자기 commit SHA를 미리 확정하지 않는다.

```bash
git rev-parse HEAD
git rev-parse HEAD:docs/game-platform-rebuild/artifacts/step-4a-astra-judgment.md
git rev-parse HEAD:docs/game-platform-rebuild/artifacts/step-4a-auxiliary-research-report.md
git diff --name-status 36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd HEAD
git diff --check 36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd HEAD
node scripts/check-game-platform-governance.mjs --base ad7655a051f0dbb13444eec6f469f6f98f9794f4 --head HEAD
```

위 full checkout 명령 중 Git plumbing/full Guard는 이번 환경에서 실행한 명령이 아니다. 이번에는 고정 원격 tree/API와 순수 검사 함수로 동일 입력의 관련 의미를 검사했다. 원문 절 동일성과 source blob/줄은 아래 Python으로 재현할 수 있다.

```python
from pathlib import Path
import re, hashlib
root = Path('.')
a = root / 'docs/game-platform-rebuild/artifacts'
def blob(data):
    return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
source = (a/'step-4a-astra-judgment.md').read_text()
assert blob(source.encode()) == 'b471f4c3c6a45976f2a08008d2263102886c6959'
positions = list(re.finditer(r'^## ([1-9])\. .+$', source, re.M))
parts = {int(m.group(1)): source[m.start():positions[i+1].start()
         if i+1 < len(positions) else len(source)] for i,m in enumerate(positions)}
for file, sections in [
    ('step-4a-responsibility-boundaries.md', [1,2,3,4]),
    ('step-4a-lifetime-contract.md', [5,6,7,8]),
    ('step-4a-risks-and-followup.md', [9])]:
    body = (a/file).read_text().split('## ', 1)[1]
    assert '## '+body == ''.join(parts[n] for n in sections)
assert blob((a/'step-4a-auxiliary-research-report.md').read_bytes()) == \
       'b034af1639ae3c94c80373623f856c48517c0c9d'
trace = (a/'step-4a-contract-source-trace.md').read_text()
rows = re.findall(r'^\| S4A-E\d+ \| \[([^\]]+) L(\d+)–(\d+)\]\([^\n]+?\) \| `([a-f0-9]{40})`', trace, re.M)
assert len(rows) == 33
for path, start, end, expected in rows:
    data = (root/path).read_bytes()
    assert blob(data) == expected
    assert 1 <= int(start) <= int(end) <= len(data.decode().splitlines())
print('9 sections, original report and 33 source hashes/ranges verified')
```

재현 코드는 저장된 고정 입력을 사용한다. 위 전체 Git/Guard 명령은 환경을 갖춘 후속 검토에서 사용할 절차이며 이번 실행 증거는 아니다.
