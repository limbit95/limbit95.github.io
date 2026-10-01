# STEP3 — 정식 반영 검증 및 재현

- 기준: 계획1.3/STEP3, 가이드4 Work Sol. 가이드5 Astra 사후 감사는 미수행.
- 입력 HEAD `41d78ef37f88cd7ea179c805fd9bf1141541284b`; integration `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`.
- [trace](step-3-source-trace.md) / [판단원문](step-3-astra-judgment.md) / [matrix](step-3-stress-matrix.md) / [시나리오](step-3-transition-scenarios.md) / [리스크](step-3-risks-and-followup.md).

## 비교 범위와 원문 보존

- 최초4번 반영은6파일(CURRENT+새산출물4+CP0024). 이후 제출기록은4파일(CURRENT/분담/검증/CP0025). 4번 전체 union9파일이며 PR410 전체diff와 구분한다.
- 판단§1~7 본문은 각정식산출물에서 byte 동일성 검증. §8의 3번 완료이력은 원문 보존하고 현재4번상태는 새기록으로 연결했다.
- E약칭→S3-E, IMPL약칭→IMPL- 형식을 trace에서 해석하며 기존판단 텍스트를 수정하지 않았다.
- 기존 코드·규칙·계획·STEP1/2·과거checkpoint·DECISIONS·판단원문·보조보고서 unchanged. 새 산출물은검토초안/조건부/보류를 유지하며 새ArchitectureDecision을 채택하지 않았다.
- 반영검토: C09 네조건(솔로+기존3조건), 비DB의 현재의무면제금지, 동등version/view/room이 안전보장아님, 예측결과통계금지, 순수relay권한대체금지, 외부부분확인·열기실패, STEP2회귀트리거를 본문전체복사로 보존했다. 새로운 구조공백을 임의 해결하지 않으며 S3-R01~07/S2-R/U02는 감사대상으로 유지.

## 실행 결과

| 항목 | 결과 | 적용 범위 |
|---|---|---|
| 본문7절 동일성·판단원문불변 | PASS | 입력41d78ef… 대비; 이번핵심판단 새작성 아님 |
| 사례11·전7축·Capability·독립matrix | PASS | 동일ID 3표 총33행, 열구조검사 |
| 시나리오6·리스크7·외부원문표7행 | PASS | 순서/누락/중복/원문전체반영 |
| 저장소근거24개 | PASS | 고정SHA·blob·줄범위·실제원문불변. 외부본문재조사 아님 |
| 로컬상대링크·표열·22개상태·diff공백 | PASS | 최종기록포함 재실행, 수치는 최종결과보고 |
| 조사원본 SHA256 | PASS | 464b78d36fe47a14a414f94448c579c5c848811d24bf9204149b5fd1cee0cc16 |
| 계획blob/기존자산·변경범위 | PASS | 계획e12ef… 및 허용9파일외 변경0 |
| Governance Guard | PASS | 최초반영원격dddd42c…에서 실제실행; 최종기록HEAD도 저장후재실행 |
| 원격CI | NOT_TRIGGERED(초기반영) | dddd42c… workflow0/check0, 최종HEAD 별도조회 |
| runtime/unit/build/DB/browser/production | NOT_RUN | 코드/실행계약불변 문서단계. 안전성 실행지원 증명 아님 |
| lint/typecheck | NOT_AVAILABLE | package.json 해당script없음 |

첫검증은 상대링크51개/표14개였다. 제출기록·검증문서가 추가된 최종검증 숫자는 결과보고/명령출력 기준이며 같은시점의 수치로 혼용하지 않는다.

## 재현 명령

저장소 루트에서 아래 Python을 임시파일로 실행한다. 기존기준과 원문보존·ID·source·상태·링크를 검증하며 게임테스트를 대체하지 않는다.

```python
from pathlib import Path
import subprocess,re,hashlib,json
r=Path.cwd();a=r/'docs/game-platform-rebuild/artifacts';initial='41d78ef37f88cd7ea179c805fd9bf1141541284b';base='177533f97bddf67c95379cfa34dc58f2ccdf9e1c'
def git(*args):return subprocess.check_output(['git',*args],text=True)
j=(a/'step-3-astra-judgment.md').read_text(); original=git('show',initial+':docs/game-platform-rebuild/artifacts/step-3-astra-judgment.md');assert j==original
names={1:'step-3-stress-matrix.md',2:'step-3-stress-matrix.md',3:'step-3-stress-matrix.md',4:'step-3-stress-matrix.md',5:'step-3-transition-scenarios.md',6:'step-3-risks-and-followup.md',7:'step-3-risks-and-followup.md'}
for i,name in names.items():
 m=re.search(rf'^## {i}\. ',j,re.M);n=re.search(rf'^## {i+1}\. ',j,re.M);section=j[m.start():n.start()].rstrip();assert section in (a/name).read_text(),(i,name)
mt=(a/names[1]).read_text();case_rows=[x for x in mt.splitlines() if re.match(r'^\| S3-C\d{2}\b',x)];assert len(case_rows)==33
for i in range(1,12):assert sum(x.startswith(f'| S3-C{i:02} ') for x in case_rows)==3
st=(a/names[5]).read_text();assert re.findall(r'^### (S3-T\d{2})',st,re.M)==[f'S3-T{i:02}' for i in range(1,7)]
rt=(a/names[6]).read_text();assert re.findall(r'^\| (S3-R\d{2})\b',rt,re.M)==[f'S3-R{i:02}' for i in range(1,8)];assert re.findall(r'^\| (X\d{2}) /',rt,re.M)==[f'X{i:02}' for i in range(1,8)]
trace=(a/'step-3-source-trace.md').read_text();refs=[]
for line in trace.splitlines():
 if not re.match(r'^\| S3-E\d{2}',line):continue
 m=re.search(r'/blob/('+base+r')/([^#]+)#L(\d+)-L(\d+)\).*?`([0-9a-f]{40})`',line);assert m,line
 _,path,lo,hi,blob=m.groups();content=git('show',base+':'+path);assert 1<=int(lo)<=int(hi)<=len(content.splitlines());assert git('rev-parse',base+':'+path).strip()==blob
 assert (r/path).read_text()==content,path
 refs.append(re.match(r'^\| (S3-E\d{2})',line).group(1))
assert refs==[f'S3-E{i:02}' for i in range(1,25)],refs
# All pre-existing source/rule/plan/STEP1/2/history files remain byte-identical to the input commit.
changes=git('diff','--name-only',initial).splitlines();allowed={'docs/game-platform-rebuild/CURRENT.md','docs/game-platform-rebuild/artifacts/step-3-work-allocation.md'}
allowed |= {'docs/game-platform-rebuild/artifacts/'+n for n in ('step-3-stress-matrix.md','step-3-transition-scenarios.md','step-3-risks-and-followup.md','step-3-source-trace.md','step-3-validation.md')}
allowed |= {'docs/game-platform-rebuild/checkpoints/'+n for n in ('CP-0024-step-3-formal-reflection-start.md','CP-0025-step-3-formal-submitted.md')}
assert set(changes)<=allowed,changes
untracked=git('ls-files','--others','--exclude-standard').splitlines();assert set(untracked)<=allowed,untracked
assert hashlib.sha256((a/'step-3-auxiliary-research-report.md').read_bytes()).hexdigest()=='464b78d36fe47a14a414f94448c579c5c848811d24bf9204149b5fd1cee0cc16'
assert git('hash-object','game_platform_vnext_final_execution_plan.md').strip()=='e12ef038913eb6d605709b782f1b73f18e0d1253'
paths=[a/n for n in set(names.values())]+[a/'step-3-source-trace.md',a/'step-3-work-allocation.md',r/'docs/game-platform-rebuild/CURRENT.md']+list((r/'docs/game-platform-rebuild/checkpoints').glob('CP-002[45]*.md'))+([a/'step-3-validation.md'] if (a/'step-3-validation.md').exists() else [])
link_count=0;table_count=0
for p in paths:
 t=p.read_text();width=None;infence=False
 for line in t.splitlines():
  if line.startswith('```'):infence=not infence;continue
  if infence:continue
  if line.startswith('|'):
   n=len(re.split(r'(?<!\\)\|',line))-2
   if width is None:width=n;table_count+=1
   assert n==width,(p.name,line,n,width)
  else:width=None
 for target in re.findall(r'\]\(([^)]+)\)',t):
  if target.startswith(('http://','https://','#')):continue
  target=target.split('#')[0]
  assert (p.parent/target).exists(),(p.name,target);link_count+=1
current=(r/'docs/game-platform-rebuild/CURRENT.md').read_text();rows=re.findall(r'^\| (\d+[A-D]?\d?) \| (NOT_STARTED|IN_PROGRESS|REVIEW_PENDING|COMPLETED) \|',current,re.M)
assert len(rows)==22;assert dict(rows)['3'] in ('IN_PROGRESS','REVIEW_PENDING');assert all(v=='NOT_STARTED' for k,v in rows if k not in ('0','1','2','3'))
subprocess.run(['git','diff','--check'],check=True)
print(json.dumps({'section_bodies_preserved':7,'case_rows':33,'cases':11,'scenarios':6,'risks':7,'external_source_rows':7,'source_refs_blob_lines':24,'relative_links':link_count,'tables':table_count,'status_rows':22,'result':'PASS'},ensure_ascii=False))
```

commit된 최종HEAD에서 다음도 실행한다.

```bash
git diff --check 177533f97bddf67c95379cfa34dc58f2ccdf9e1c HEAD
node scripts/check-game-platform-governance.mjs --base 177533f97bddf67c95379cfa34dc58f2ccdf9e1c --head HEAD
git status --short --branch
```

원격branch ref/PR410 head·base·Draft/미병합·최종commit tree와 로컬tree를 대조한다. 최종CI는 해당SHA의check-runs/actions runs로조회한다. 자신의SHA를 문서에미리적지 않고 CP0025를포함한Git commit/PR설명/최종보고에서확인한다.
