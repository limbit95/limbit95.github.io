# STEP 1 — Validation Record

- 기준: 실행 계획 개정 1.3; 승인 integration/source `132ec1576e316d0238c9ca6e07d0d3ab91950ec8`.
- 실행일: 2026-10-01 UTC. 로컬 Node `v24.19.0`, Python 3. GitHub workflow의 Node 22 실행 결과로 바꿔 기록하지 않는다.
- runtime/test/규칙 원본은 기준 SHA와 동일하다. 감사 산출물과 진행 기록만 추가/수정했다.
- PR 및 최종 원격 commit의 현재 상태는 [CURRENT](../CURRENT.md)와 최신 checkpoint에서 찾는다. 이 파일에 자신의 commit SHA를 예측해서 쓰지 않는다.

## 실제 실행 결과

| 대상 | 결과 | 의미/한계 |
|---|---|---|
| source 고정·본문 trace | PASS — 26문서 / 3,232행, 원문 불일치 0, 비공백·비제목 본문 누락 0 | source blob·줄·원문 인용을 대조. 의미 분류를 자동 승인하는 검사가 아님 |
| ID / 부모 / 강도 | PASS — 중복 ID 0, 부모 단절 0, 본문 MUST/SHOULD/부정 표현 보존 | 절의 강도·조건과 부모를 병독하며 한국어 서술을 임의 MUST로 승격하지 않음 |
| games Markdown 전수 | PASS — 실제 14개 모두 원문 집합에 포함 | HISTORY/게임별 기록을 새 플랫폼 의무로 승격하지 않음 |
| 기존 원본 불변 | PASS — 계획, AGENTS/진입 문서, 기존 규칙/게임/코드, DECISIONS, CP-0001~0005 그대로 | STEP 1 시작/재개 기록 CP-0006/0007도 이후 덮어쓰지 않음 |
| 현행 contract/governance unit tests | PASS — 45 tests, 45 pass, 0 fail/skip | 아래 세 파일만 실행. 전체 게임 회귀 성공/실제 DB 검증이라는 뜻 아님 |
| 현행 Governance Guard | PASS — source 기준과 제출 HEAD `77ddb87` 비교 | 기존 경로/계약 검증. 새 계승표의 의미적 완전성을 Guard가 검사하는 것은 아님 |
| F01 메모리 재현 | OBSERVED — version 3→2 및 dispose 후 callback 1회 | 결함 존재를 관찰한 재현이며 게임 정상 동작 PASS가 아님. 코드/테스트 파일 수정 없음 |

실행 명령(저장소 루트):

```bash
node --test tests/game-platform-governance.test.js tests/game-platform-contracts.test.js tests/game-platform-db-contract.test.js
node scripts/check-game-platform-governance.mjs --base 132ec1576e316d0238c9ca6e07d0d3ab91950ec8 --head HEAD
git diff --check 132ec1576e316d0238c9ca6e07d0d3ab91950ec8
```

단위 테스트의 최종 출력은 `tests 45 / pass 45 / fail 0 / cancelled 0 / skipped 0 / todo 0`였다. Governance/contract/DB-contract 각각 35/6/4개다. CI workflow나 repository 테스트를 추가하지 않았다.

## 변경 범위·단계 검증

- STEP 1의 최초 commit `467e6b8351c1236d4a9eb6fed71de534594f1e27`의 부모는 승인 integration `132ec157…`이다. 재개 시 같은 STEP 브랜치를 이어갔다.
- 제출 commit에서 `git diff --check`와 아래 원문 trace 절차 재실행 PASS, 저장소 상대 산출물 링크 단절 0을 확인했다.
- 변경 허용 경로는 `docs/game-platform-rebuild/CURRENT.md`, STEP 1 신규 checkpoint, `artifacts/step-1-*.md`뿐이다. 기존 checkpoint의 수정·삭제는 없다.
- 22개 검토 지점 중 STEP 1만 `NOT_STARTED → IN_PROGRESS → REVIEW_PENDING`으로 이동한다. STEP 0 COMPLETED와 나머지 NOT_STARTED는 유지한다.
- 2,104개 규칙·필드 단위 = 계승 검토 K 1,198 + 기존 소비자 한정 L 906. 나머지 1,128개는 문맥/이력/예시/범위 밖/작업 제어다. 본문 원문을 삭제하거나 의무 강도를 바꾸지 않았다.
- 중복 10그룹(연결 141행), 확정 불일치 C01/C02, 범위 긴장 C03, 암묵적 후보 8개, 미확인 범주 U01~U03를 공개했다. 새 책임 문서/절은 미정이며 STEP 2~6으로 넘긴다.

## CI 확인 및 미실행

PR [#408](https://github.com/limbit95/limbit95.github.io/pull/408) 생성 후 제출 head `77ddb87f9ade947a763bffca0b108d80baa558f5`에서 PR workflow runs **0**, check-runs **0**을 실제 조회했다. **NOT_TRIGGERED**이며 PASS가 아니다. 조회 시각: `2026-10-01T00:45:31+00:00`. 이후 같은 PR의 기록 commit도 문서 범위를 유지한다. 최종 원격 HEAD는 최신 checkpoint를 포함한 Git commit과 PR head로 확인한다.

- `game-platform-governance.yml`은 PR의 `games/**`, 최상위 `docs/game-platform-*.md` 등의 경로에 반응한다. 중첩된 이번 재구축 기록/산출물은 해당 경로와 다르다.
- `site-static-checks.yml`은 `**/*.md` 변경만 있는 PR을 제외한다. `game-db-integration.yml`도 SQL/DB test 경로를 수정하지 않아 대상이 아니다.
- 따라서 문서/거버넌스 CI가 실행되지 않으면 `NOT_TRIGGERED`로 기록한다. PASS로 바꾸거나 실행을 유도하기 위해 workflow/파일을 수정하지 않는다.
- 전체 `npm run test:game-platform`, 게임별 전체 suite, build/assets, Playwright/브라우저 수동 검증, disposable DB, production Supabase는 NOT_RUN. 실행 코드/계약 변경이 없는 문서 단계이므로 전부 재실행할 근거가 없으며 F01의 좁은 재현과 기존 계약/Guard 확인으로 감사 근거를 검증했다.
- 실제 production 활성화/권한·브라우저 리뷰 상태 U03는 원문 기록 이상의 보증을 하지 않는다.

## F01 재현 — 네트워크/DB/게임 소스 변경 없음

아래는 현행 source를 메모리 mock과 연결한 재현이다. 후속 별도 수정 작업의 회귀 테스트 설계를 선결정하지 않는다. 두 관찰은 서로 다른 응답 경계다.

```bash
node --input-type=module <<'JS'
import { createSnapshotCoordinator } from './games/shared/snapshotCoordinator.js';
import { createCantStopLobbyController } from './games/cant-stop/lobbyController.js';

let releaseLoad;
const observed = [];
const coordinator = createSnapshotCoordinator({
  loadSnapshot: () => new Promise(resolve => { releaseLoad = resolve; }),
  subscribeInvalidation: () => () => {},
  onSnapshot: snapshot => observed.push(snapshot.version),
});
const pending = coordinator.refresh();
coordinator.dispose();
releaseLoad({ version: 1 });
await pending;
console.log('callback-after-dispose:', observed.length);

const snapshot = version => ({ version, room: { id: 'audit-room', status: 'waiting' }, players: [] });
let loadedVersion = 1;
let releaseReady;
const controller = createCantStopLobbyController({
  adapter: {
    createRoom: async () => snapshot(1), joinRoom: async () => snapshot(1),
    getMyActiveRoom: async () => snapshot(1),
    getLobbySnapshot: async () => snapshot(loadedVersion),
    setReady: () => new Promise(resolve => { releaseReady = resolve; }),
    leaveRoom: async () => null, startGame: async () => snapshot(2),
    subscribeInvalidation: () => () => {},
  },
  idFactory: () => 'audit-action',
  windowTarget: new EventTarget(), documentTarget: new EventTarget(),
});
await controller.initialize();
const ready = controller.setReady(true);
loadedVersion = 3;
await controller.refresh();
const before = controller.current().snapshot.version;
releaseReady(snapshot(2));
await ready;
console.log('late-action-version:', before, '->', controller.current().snapshot.version);
controller.dispose();
JS
```

실제 출력: `callback-after-dispose: 1` / `late-action-version: 3 -> 2`.

## 원문 trace를 다시 확인하는 읽기 전용 절차

다음 Python은 이 표 자체와 고정된 Git 원문만 읽는다. 임시 생성기나 이전 채팅이 없어도 source/ID/본문의 연결을 확인할 수 있다. 의미 분류/중복 판단은 별도 사용자 검토다.

```python
from pathlib import Path
import collections, html, re, subprocess

base = '132ec1576e316d0238c9ca6e07d0d3ab91950ec8'
root = Path('.')
artifacts = root / 'docs/game-platform-rebuild/artifacts'
sources, rows, covered = {}, {}, collections.defaultdict(set)
parents = []
for table in sorted(artifacts.glob('step-1-clauses-*.md')):
    source = None
    for line in table.read_text().splitlines():
        heading = re.match(r'^## [A-Z-]+ — `([^`]+)`$', line)
        if heading:
            source = heading[1]
            original = subprocess.check_output(['git', 'show', f'{base}:{source}'])
            assert (root / source).read_bytes() == original, source
            sources[source] = original.decode().splitlines()
        if line.startswith('- blob:'):
            blob = re.search(r'`([a-f0-9]{40})`', line)[1]
            actual = subprocess.check_output(['git', 'rev-parse', f'{base}:{source}'], text=True).strip()
            assert blob == actual, source
        if not line.startswith('| LEGACY-'):
            continue
        cells = line[2:-2].split(' | ')
        assert len(cells) == 9
        match = re.match(r'(LEGACY-[A-Z-]+-\d+) · L(\d+)–(\d+)', cells[0])
        ident, start, end = match[1], int(match[2]), int(match[3])
        assert ident not in rows
        quote = html.unescape(cells[1].replace('<br>', '\n'))
        assert quote == '\n'.join(sources[source][start-1:end]), ident
        for word in re.findall(r'\b(?:MUST NOT|MUST|SHOULD NOT|SHOULD|MAY|required|prohibited)\b', quote, re.I):
            assert word in cells[2], (ident, word)
        rows[ident] = source
        covered[source].update(range(start, end + 1))
        parent = re.search(r'부모 (LEGACY-[A-Z-]+-\d+)', cells[0])
        if parent:
            parents.append(parent[1])
assert len(sources) == 26 and len(rows) == 3232
assert all(parent in rows for parent in parents)
for source, lines in sources.items():
    gaps = [n for n, line in enumerate(lines, 1)
            if line.strip() and n not in covered[source] and not re.match(r'^#{1,6}\s', line)]
    assert not gaps, (source, gaps)
game_docs = {str(p) for p in (root / 'games').rglob('*.md')}
assert len(game_docs) == 14 and game_docs <= set(sources)
print('PASS: 26 sources / 3232 source units / 14 games Markdown files; no trace gaps')
```
