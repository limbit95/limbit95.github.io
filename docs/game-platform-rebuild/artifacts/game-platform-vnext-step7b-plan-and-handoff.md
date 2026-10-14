# Game Platform vNext STEP7B — 탐색/Guard·공통 모듈 안내 계획과 인계

> 담당: Sol/Codex. 지위: 계획/인계 자료이며 정식 STEP7B 결과나 새 Target 판단이 아니다.
> 이번 허용: PR #421 integration 병합·실제 반영 확인, STEP7B 작업 계획·Sol/Astra 분담 준비만.
> 저장소: limbit95/limbit95.github.io / integration: feature/game-platform-vnext-integration.
> 계획 기준 SHA: **f65537f0226457857b2084fd0a2c2d21d02c0804**.
> 이번에는 저장소 파일·규칙·Guard·workflow를 수정하지 않았고 STEP7B branch/PR/checkpoint·구현·시험·main 반영을 시작하지 않았다.

## 1. 상태 복원과 PR421 실제 병합

AGENTS → 실행 계획 개정1.5 → rebuild README → CURRENT → CP0096 → 실제 PR421/Git을 연결했다. 이미 확인된 승인·원본 보존·검증 근거는 재사용했다. 상위 설계/공급자/요금/운영 정책의 재판단은 하지 않았다.

| 구분 | 실제 증거 / 해석 |
|---|---|
| 사용자 승인 정식 결과 head | 73839aea65679278888f26facc593f9c1180b5ad |
| 승인·완료 기록 최종 head | 3d57eed48d5b0dd4838c888479ae733a8cd89007. 승인 head를 parent로 하는 기록 전용 commit |
| PR421 base/head | feature/game-platform-vnext-integration ← docs/game-platform-vnext-phase7a3-realtime-rules |
| 병합 전 integration | 4dbe77010dec444f6e37e3c570e75dd5d9c6308a |
| 실제 merge / 현재 integration | f65537f0226457857b2084fd0a2c2d21d02c0804 |
| merge parents | 4dbe77010dec444f6e37e3c570e75dd5d9c6308a + 3d57eed48d5b0dd4838c888479ae733a8cd89007 |
| merge tree = 최종 head tree | 31b9b8f13a66c81f60d09f39675ac61e26673674. 승인 결과와 완료 기록이 그대로 반영됨 |
| 실제 PR 상태 / 시각 | CLOSED / merged=true, 2026-10-13T05:42:55Z = 2026-10-13 14:42:55 KST |
| main | 69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09, 변경 없음 |
| 최종 기록 head CI | 기존 등록 Governance run38348439825 completed/success. 이번 계획에서 시험 재실행 없음 |

[PR421](https://github.com/limbit95/limbit95.github.io/pull/421), [merge](https://github.com/limbit95/limbit95.github.io/commit/f65537f0226457857b2084fd0a2c2d21d02c0804), [기존 기록 head CI](https://github.com/limbit95/limbit95.github.io/actions/runs/38348439825).

복원 상태는 STEP7A3 COMPLETED / DESIGN_RESULT_APPROVED / FORMAL_RESULT_APPROVED / INTEGRATION_MERGED, STEP7A1/7A2 완료·병합, STEP6 COMPLETED / DESIGN_RESULT_APPROVED / TARGET_FROZEN / INTEGRATION_MERGED다. **STEP7B 기록 NOT_STARTED**를 유지한다. CURRENT/README/CP0096의 OPEN·INTEGRATION_NOT_MERGED와 제출 artifact의 REVIEW_PENDING은 각 작성 당시 이력이다. 이번 계획만으로 저장소 기록을 고쳐 현재화하지 않는다. 후속 허용된 STEP7B 작업에서 실제 Git 증거와 필요한 현재 기록을 함께 정합화한다.

행동 게임/DB/browser/audio/두 client/성능/운영 **NOT_RUN**, 실행/운영 **UNKNOWN**, 구현/실행/오픈 후속 의무 및 main 별도 게이트를 유지한다. 병합 성공·기존 CI 성공은 runtime 지원/행동 PASS가 아니다.

## 2. STEP7B 목적과 단계 경계

쉽게 말해, **앞으로 넣을 공통 코드와 서버 코드가 검사에서 빠지지 않게 하고, 어떤 공통 기능을 어떤 조건으로 쓸 수 있는지 안내하는 준비 작업**이다. 실제 Core·선택 모델·backend·게임 구현은 STEP7C/7D 및 후속 Probe에 남긴다.

기준은 실행 계획 STEP7B와 승인 STEP6 Target §6.1~6.3, Slice D4다. 이미 7A1~7A3에서 만든 AR/CO/LI/MO/CA/BO/RT·진입/템플릿·최소 Guard는 재작성하거나 새 권위로 교체하지 않는다.

| 준비 범위 | 후속 STEP7B에서 해야 할 일 | 이번 계획 및 후속의 제한 |
|---|---|---|
| browser 중첩 공통 경로 | games/shared/vnext/**의 새 모듈·변경·문서/계약 테스트 요구를 발견. shared를 게임으로 오분류하지 않음 | Core/models/capabilities/adapters의 실제 runtime 파일·빈 stub·Profile 폴더를 만들지 않음 |
| server 전용 경로 | services/game-platform-vnext/**의 변경/검증 발견, browser→server import 금지와 정적 배포/asset 유입 차단 준비 | 서버 구현·credential·배포·운영 변경 없음. 폴더명만으로 비노출을 보장하지 않음 |
| 계약·scope·Registry | 승인 계약 ID/revision→owner·적용 scope·GAME_SPEC 선택 및 단일 Registry 연결 검사 | Registry 두 번째 metadata·기존 API/등록값 변경·새 모델 ID/semver/wire protocol 선제 선택 없음 |
| 테스트 발견·모델 oracle 연결 | flat tests/game-platform-vnext-*.test.js 및 DB 기존 runner 연결. 실제 선택 모델의 안전 의미/oracle/환경과 소비자를 연결하는 admission 검사 | 특정 nonDB 모델/transport/서버 oracle를 새로 구현하지 않음. 등록/발견은 실행 PASS가 아님 |
| 공통 모듈 안내 | 역할·적용 모델/consumer·실제 exports·연결/구독/정리 owner·검증 위치·구현/보완/미지원 상태 안내 | 기존 API 상세/규범 본문 중복 금지. 예정 export를 현재 사용 가능으로 쓰지 않음 |
| 기존 consumer 공존 | Registry 모든 platform-native 게임 영향도, 기존 import/barrel/계약/네 문서 무이관 확인 | MIGRATION_REQUIRED는 기존 게임 수정으로 닫지 않고 vNext 침범만 반환 |

### 모델 oracle의 정확한 한계

7B는 **어떤 선택 모델에 어떤 검증 계약·파일·환경이 필요한지 발견하고 누락/미지원 조합을 거부하는 연결**을 준비한다. 안전11·A/C/P·수명·현재성의 승인 의미는 MO/LI/기존 DB owner가 소유한다. 구체 모델이 아직 정의되지 않았거나 실제 oracle가 없으면 해당 조합은 미지원/후속이다. 기존 vNext online blanket rejection을 단순 삭제하거나 DB 테스트 파일 하나로 nonDB 지원을 허용하지 않는다.

새 모델의 권위/순서/복구·취소/시간공백 정책과 실제 backend oracle는 7D에서 필요한 선택을 닫고 구현한다. 7B 테스트 fixture는 탐지·거부·scope 연결의 증거이지 실제 모델 지원 증거가 아니다. 설계된 검증 연결과 실제 구현/실행 증거를 구별한다.

## 3. 재사용 입력과 새로 확인할 부분

| 입력 | 재사용할 내용 | 새 확인은 이 범위만 |
|---|---|---|
| 루트 실행 계획1.5 / 승인 STEP6 Target §2/4/6, Slice D4 및 검증 V-L/S/M/H/C/P/O | 책임·물리 root·scope/revision·단일 owner·전환 순서·시험/지원 구분 | 최신 integration의 실제 적용 상태 및 변경과 충돌만 |
| STEP6 clause-destinations / source-trace | 원3232(K1198/L906/H562/I566)·305부모·16행58분할·관련 GV/AR/MO/CA/원 owner ID/f | 7B 관련 조각만 실제 안내/검사/참조에 대응. 전체표 자동 재분류나 전수 새 본문 완료 선언 없음 |
| STEP7A1/7A2/7A3 실제 규칙·대응/trace/validation | AR/CO/LI/MO/CA/BO/RT 현재 scope와 실제 본문·인덱스·템플릿·검사 | 7B 연결 때문에 필요한 최소 참조 변경만. 승인 의미 재판단 없음 |
| STEP5A common-module-selection / duplication-prevention / compatibility-lifetime-owners 및 STEP5B/5C 관련 정식 artifact | 재사용/Adapter/local 경계·H1~4·결과/공개/Profile·장르 연결 | 기존 inventory/trace와 실제 blob을 대조하고 달라진 exports/연결 공백만 읽음 |
| DECISIONS D0006~10 / CP0075 현재 적용 | 유효 결정·D0010 부분 대체와 운영 UNKNOWN | 완료된 공급자/운영 조사 반복 금지. 충돌 원문만 추가 확인 |
| Guard/scripts/package/workflow/기존 tests | 현재 탐지·정책/테스트 glob·실행 명령·browser import/build 경계 | server-only 변경의 CI trigger, import closure 검사, 실제 정적 배포 source/제외 방식 등 미확인 연결 |
| games/README.md / games/shared/index.js / Registry와 현재 모듈/test | 기존 공통 모듈 안내·exports·consumer 근거 | 안내에 필요한 실제 연결·정리·구현 상태의 공백. 모든 source/SQL 재감사 없음 |

STEP5A artifact의 실제 파일명은 rebuild README/승인 source trace에서 찾아 사용한다. 제목을 근거로 파일을 새로 만들거나 존재를 추정하지 않는다. DB/RPC 상세·BGM·Invite/site handler의 단일 owner는 기존 문서/source를 참조하고 API를 다른 안내에 재서술하지 않는다.

## 4. 현재 확인 사실과 계획 시점의 공백

관찰 사실 F / 승인 요구 A / 계획 제안 P / 미확인 U를 구별한다.

| 종류 | 확인/요구 | 후속 영향 |
|---|---|---|
| F | Guard validatePullRequestChanges의 새 shared 모듈 정규식은 games/shared 직계 .js만 검사하며 index.js를 제외한다(현재 L583~598) | nested vnext 새 모듈의 문서/계약 테스트 요구가 빠지지 않도록 확대해야 함 |
| F | readDirectoryNames/gameDirectoriesAtRef는 games 바로 아래 shared만 제외. policy reader는 flat docs/game-platform-*.md 및 games 안내를 발견(L603~697) | games/core 같은 새 직계 root를 만들지 않음. 이미 승인된 flat owner 발견 유지 |
| F | package.json test:game-platform은 node --test tests/game-platform-*.test.js | 승인 flat vnext 테스트 이름이 발견 범위에 들어감. 중첩 fixture는 별도 확인 |
| F | Governance workflow trigger는 games/**·flat contract tests·DB tests·Guard·flat policy·AGENTS·자기 파일. services/**는 현재 명시되지 않음. syntax 단계는 games/**/*.js를 재귀 검사 | server-only 변경도 검사에서 빠지지 않는 최소 기존 CI 연결 검토. 불필요한 새 workflow 추가 없음 |
| F | build-community-assets.mjs entry는 js/app.js이며 platform browser·metafile을 사용 | 모든 게임 entry가 자동 bundle된다고 가정하지 않음. 실제 import closure와 static 공개 경계는 별도 확인 필요 |
| F | Guard L500~506은 신규 vNext online에 model-specific oracle/discovery 준비 전 미지원 오류를 내며 기존 online DB 테스트 요구를 유지 | 이 안전 차단을 검사 연결 없이 제거하면 안 됨 |
| A | 승인 root는 games/shared/vnext/와 services/game-platform-vnext/, 기존 shared barrel은 신규 재수출 통로가 아님 | runtime 경로 생성보다 발견/import/배포 검사 준비가 먼저 |
| U | 실제 정적 배포의 source/artifact·server root 공개 제외 여부와 적용 가능한 최소 차단 방식은 이번에 완전 확인하지 않음 | T1에서 해당 연결만 확인. 증명되지 않은 server 산출물 공개를 허용하지 않음. 운영/배포 설정을 이번에 바꾸지 않음 |
| U | 아직 정의/구현되지 않은 실제 nonDB 모델의 구체 ID·oracle·실행 환경·제품 정책 | 해당 조합 미지원/7D 후속. 7B 전체 준비를 막는 blanket blocker로 만들지 않음 |
| P | 안내 owner는 기존 games/README.md 중심으로 보완하고 세부 계약/원 API는 단일 owner 참조 | 분량/기존 관례상 별도 안내가 꼭 필요하면 기존 승인 책임 안에서 최소 분리. 새 규범/exports 동결 아님 |

이번 source 확인은 위 탐지/trigger/build entry 등 계획에 필요한 부분만이다. exports/모든 호출부·전체 SQL·legacy 운영 정의를 전수 확인하지 않았다. 로컬 파일이 없던 workflow/build 파일은 고정 SHA의 원격 bytes를 읽고 해당 blob과 일치 확인했다. 존재가 확인되지 않은 games/shared/README.md나 build-site-assets.mjs를 현행 파일로 간주하지 않는다.

## 5. 실행 가능한 작업 순서와 Sol/Astra 분담

소프트웨어 owner와 담당 모델은 다르다. 승인 설계 적용의 정상 흐름은 Sol/Codex가 수행한다. Astra는 실제 새 의미 충돌에만 참여하며 별도 전면 재판단·사후 감사는 추가하지 않는다.

| 작업 / 담당 | 목적 | 입력·확인 범위 | 산출물·완료 조건 | 다음으로 넘길 항목 |
|---|---|---|---|---|
| T1 Sol/Codex — 승인 대응·최소 변경 준비 | 실제 탐지/CI/import/배포/안내 연결을 특정 | §3 입력과 §4 공백, 고정 blob/심볼, 관련 ID/f·실제 Registry. 기존 근거 재사용 | 승인 요구→현재 검사→필요한 최소 diff/양·음성 사례 대응. server 공개 제외 공백과 미지원 모델 명시. 새 Target 선택 없음 | 정상분은 T3. 실제 새 의미 충돌만 T2 |
| T2 Astra — 조건부 충돌 판단 | 기존 승인만으로 해소할 수 없는 경계/상위 의미 충돌 해결 | 해당 ID/줄/f·승인 원문·현재 검사/consumer·예상 owner·빠진 의미·영향만 | 승인 범위의 구체화인지 새 상위 선택인지 판단. 새 상위 완화/hostless 재대결 예외는 사용자 별도 승인 전 적용 금지 | 해소한 해당 행/조건만 Sol에 반환. 무관한 작업은 반복 조사하지 않음 |
| T3 Sol/Codex — 허용 후 실제 반영 | 탐지·격리·검증 연결·모듈 안내 정합화 | T1 최소 diff와 승인 근거, 필요한 T2 결과 | 필요한 Guard/helper·관련 tests·기존 CI 연결·안내/현재 기록 반영. runtime/서버/게임/SQL 구현0, 기존 consumer 무이관. 모델 미지원 상태 정확히 유지 | 실제 변경 범위/검증 명령·미실행 항목을 T4에 전달 |
| T4 Sol/Codex — 범위 검증·검토 PR 제출 | 적용 결과의 실제 증거 확보 | 변경한 검사·test fixture·실제 repository/base-head·참조/ID/f·원본/Registry | 의미 있는 관련 양·음성 tests, 실제 적용 검사, 원격 read-back·허용 diff·기존 영향도. 등록 CI 실제 상태만 보고. STEP7B REVIEW_PENDING | 사용자 정식 결과 최종 검토 하나. 완료/병합/7C/main 별도 요청 |

T1→정상분T3→T4를 하나의 승인된 7B 작업 안에서 이어갈 수 있다. 계획/인계 문서만 제출하는 이번 요청은 T1 소스 조사·T3/T4 실행 허용이 아니다. 후속 명시 허용 없이 브랜치/PR·정식 문서/Guard 수정·테스트를 시작하지 않는다.

## 6. 후속 허용 시 예정 변경 묶음과 종료 조건

아래는 허용된 다음 작업의 후보 범위이며 이번에 변경한 파일 목록이 아니다. 기존 검사 재사용을 우선하며 각 파일을 반드시 수정해야 한다는 뜻이 아니다.

| 경로/연결 | 후속 목적 |
|---|---|
| scripts/check-game-platform-governance.mjs 및 필요한 import/배포 경계 helper | nested module/server 변화·scope/revision/model oracle 연결·Registry/문서/tests 요구, browser→server/static 유입 차단 |
| tests/game-platform-governance.test.js 및 필요한 flat tests/game-platform-vnext-*.test.js | nested 새 module 누락·게임 오분류·server-only 발견·위반 import/asset·미지원 모델/빠진 oracle·기존 scope 회귀 양/음성 검사. fixture는 탐지 시험일 뿐 모델/게임 구현 아님 |
| 기존 .github/workflows/game-platform-governance.yml / package·관련 기존 검사 | 실제 필요한 trigger/명령 발견 연결만. 새 workflow·전체 플랫폼 실행 예산·환경 선제 추가 없음 |
| games/README.md 및 AR/GV/MO/CA의 필요한 참조 | 실제 모듈 역할/exports/조건·단일 API owner·검증/구현 상태 안내와 적용 연결. 승인 계약 본문 복제 없음 |
| build/import/static 공개 경계의 실제 최소 연결 | 현존 배포 경로를 확인해 누락을 차단. build 산출물의 불필요한 재생성·새 서비스 배포/운영 변경 금지 |
| rebuild 필요한 artifact/CURRENT/README/새 checkpoint | 승인 대응/trace·모든 platform-native 영향도·검증/미실행·원본 보존·REVIEW_PENDING 기록 |

7B 검토 제출 조건은 ①승인 중첩/server 경로가 누락/게임 오분류되지 않음 ②browser/server 및 정적 공개 경계의 검사·미지원 차단이 준비됨 ③계약/revision/scope/Registry·문서/test 연결이 실제 검사로 이어짐 ④미지원 모델을 테스트 파일 존재만으로 허용하지 않음 ⑤모듈 안내가 현재 exports·보완/미지원·owner·검증 상태와 일치함 ⑥기존 게임/Auth/API/SQL/barrel/metadata/네 문서 무이관 및 전수 영향도 근거 ⑦관련 ID/f·링크·단일 owner·원본/허용 diff·원격 제출본 확인이다.

문서/Guard 기계 검증과 실제 의미 대응을 구별한다. CI 미등록/미실행은 PASS가 아니다. 새 경로 fixture가 탐지됐다는 사실·unit 성공·문서 정합성이 실제 runtime/DB/browser/audio/두 client/성능/지원 PASS를 뜻하지 않는다. 정확한 사용 환경·부하/운영 검증은 후속 승인 단계에서 수행한다. 기존 CI5분/DB15분이나 제안 표본을 승인된 전체 vNext 시험 예산으로 바꾸지 않는다.

## 7. 반드시 유지할 조건

- 기존 Auth/게임/API/SQL/Registry metadata/shared barrel/game-local 네 문서 무이관. 기존 승인 원본·STEP1~6/7A1~3 artifacts·루트 계획·DECISIONS·과거 checkpoint 보존. 네 문서 baseline/유효 override/manual gate·기능/디자인 기록 책임 유지.
- STEP4A success/error/null/finally/cleanup/leave/effect/후속 완료·부분 초기화/반복 dispose/late 자원과 T01~03 유지.
- CP0075/D0010 current A/C/P: known expiry 뒤 새 A 금지, 같은 적법 transaction의 일반 저장 지연 late C 제한 수용·실제 C 관측, 새 command/transaction/retry fresh A·새 P fresh 인가, owner anchor·최초60초·terminal·부분 대체 유지. 실제 C5초 PASS로 바꾸지 않음.
- D0006~10 성능/비용/기록/삭제/탈퇴/backup/복원/운영 조건과 UNKNOWN 유지. 공급자/요금/운영 정책 재조사·구매/문의/job/dump/복원 없음.
- Registry 단일 metadata·Snapshot/Reconnect 선택 모델 단일 최종 채택/복구·Shell 공통 표시/local UI/연출·BGM 기존 본체+내부 최소 수명/H1 무보완 연결 보류·Invite 전 구간 identity/사이트 handler/dialog owner/H2~4 유지. Invite/BGM 보완을 얇은 Adapter 안의 새 엔진으로 숨기지 않음.
- STEP5B 공식 결과/정정·producer-consumer·여섯 중복 의미·공개 merge/구현/activation/사건/NEW 소비 분리·Profile recipe 유지. 미래 미선택/비room Invite/보상/정밀 audio/Profile를 전체 blocker로 올리지 않음.
- B01~12/R01~13·안전11/DB와 nonDB 동등 안전·초기 hostless/재대결 host 불성립/미정 조건 유지. 모든 게임 Room/host/DOM/winner/score/XP 강제·multiplayer 재대결 no-op/local/N/A 우회 금지. 승인되지 않은 hostless 재대결 예외나 상위 완화 없음.
- 장르명으로 transport/renderer/tick/physics/prediction/Probe 게임을 선택하지 않음. Guard의 DB/nonDB 적용 연결은 새 권위/순서/수명/token/audio 엔진 또는 실제 모델 지원의 대체물이 아님.
- 원3232·305부모·16행58분할·원ID/줄/강도/부정/부모/조건/예외/f0/명시f 유지. L/H/I·49개/B01~12를 공통 MUST/전수 완료표로 승격하지 않음. STEP6 B08 DEV271 이벤트순서/전달 성공만으로 복구 금지와 DEV251 payload 최종 진실 금지 각각 보존.

## 8. 고정 입력 source trace와 이번 확인 범위

모든 아래 blob은 계획 기준 merge tree의 identity다. 전체 내용을 새로 감사했다는 표시가 아니다. AGENTS·계획의 관련 STEP/실행 경계·CURRENT/README/CP0096·Target 관련 본문·D4/검증·Guard 해당 심볼·package·기존 Governance workflow·build entry를 읽고 이전 검증을 재사용했다. 나머지는 후속 T1의 입력으로 경로/blob을 확보했다. 실제 exports/모든 import closure/static 배포 설정의 완전 확인은 주장하지 않는다.

| 입력 경로 | 고정 blob |
|---|---|
| [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/AGENTS.md) | `16e9ab3d7c7c3f161ec685294a727e7e761e13e2` |
| [game_platform_vnext_final_execution_plan.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/game_platform_vnext_final_execution_plan.md) | `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` |
| [docs/game-platform-rebuild/README.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/README.md) | `8fcba29c990e42f1dc67158c88670dfda14fa6da` |
| [docs/game-platform-rebuild/CURRENT.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/CURRENT.md) | `eb6f0f787a26a4356f0f4835ff7631efc980724d` |
| [docs/game-platform-rebuild/checkpoints/CP-0096-step-7a3-result-approved.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/checkpoints/CP-0096-step-7a3-result-approved.md) | `196eb71855ea5642416de97f59b0410a1b728ea4` |
| [docs/game-platform-rebuild/artifacts/step-6-target-architecture.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/artifacts/step-6-target-architecture.md) | `4c12e5a5ce88aa7ea71a83c7180ad34aec1c1a12` |
| [docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md) | `000a87c4dbd249d8266c583196d3b43d31e3f83c` |
| [docs/game-platform-rebuild/artifacts/step-6-clause-destinations.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/artifacts/step-6-clause-destinations.md) | `b53d557d41b8cd09827ae98ebe68a376b4040e01` |
| [docs/game-platform-architecture.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-architecture.md) | `62b58526bd61fae491b59ed4b6c3c3c96681bfc9` |
| [docs/game-platform-model-contracts.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-model-contracts.md) | `d9a10e4908e7ac33784501a14a1bcfe614a49b1d` |
| [docs/game-platform-governance.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-governance.md) | `f3678977692ac0bbbae5f8bc00faa09cd0a7c2ba` |
| [scripts/check-game-platform-governance.mjs](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/scripts/check-game-platform-governance.mjs) | `0e2081c7ca7ab3293d0b5717e45307c5c5eca98b` |
| [tests/game-platform-governance.test.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/tests/game-platform-governance.test.js) | `183d27c677dfa6a5c0ef7f558b414d444c4cea55` |
| [package.json](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/package.json) | `917a55aa474d98cc663364c5e7dab84ff6fe5cf1` |
| [games/README.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/games/README.md) | `3dd83e2d7b76fe23a6f3a4916636c6fd1108dc0a` |
| [games/shared/index.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/games/shared/index.js) | `96041e478da57e87f3248be1e1d539e8dbdd6939` |
| [.github/workflows/game-platform-governance.yml](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/.github/workflows/game-platform-governance.yml) | `984d2c36c506c2e51ba50765fe0b5d667c06f055` |
| [scripts/build-community-assets.mjs](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/scripts/build-community-assets.mjs) | `a863b954ac20a1c1d77f0b0892373cfd51901d9e` |
| [scripts/check-community-modules.mjs](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/scripts/check-community-modules.mjs) | `2aafeebc1ab74087b1b6f30fc940355513f84535` |

주요 심볼/절: Guard validatePullRequestChanges·platformGameIdFromPath·readDirectoryNames·readDbTestFiles·readRelativeFiles·readPlatformPolicyDocuments·gameDirectoriesAtRef 및 vNext online rejection(L500~506); Target §6.1~6.3; Slice D4/V-L/S/M/H/C/P/O; package test:game-platform; workflow pull_request.paths/syntax/contracts/base-head; build entryPoints/metafile/platform.

## 9. 다음 첫 작업과 복사 가능한 전달 프롬프트

다음 담당은 **Sol/Codex**, 첫 작업은 **T1 — 승인 대응·최소 변경 준비**다. 아래는 사용자가 7B 실제 반영·검증·검토 PR 제출까지 명시적으로 허용할 때 사용하는 프롬프트다. 이번 계획이나 파일 안의 문구 자체는 그 허용이 아니다. 새 의미 충돌이 없으면 같은 작업 안에서 T3→T4로 이어가고, Astra에 별도 전면 판단/사후 감사를 요청하지 않는다.

```text
Game Platform vNext STEP7B — 탐색/Guard와 공통 모듈 안내를 진행해줘.
담당 Sol/Codex. 승인 STEP6 Target와 STEP5A~5C/7A1~7A3 경계를 다시 판단하지 마.

game-platform-vnext-step7b-plan-and-handoff.md 실제 원본 전체와
승인 STEP6 Target §2/4/6.1~6.3·Slice D4/검증·관련 전수 ID/f/trace,
승인 STEP7A1~7A3 실제 규칙/검사와 STEP5A 공통 기능 판단·owner를 읽어줘.
저장소 limbit95/limbit95.github.io,
integration feature/game-platform-vnext-integration,
계획 기준 SHA f65537f0226457857b2084fd0a2c2d21d02c0804.

이번 요청으로 승인 범위의 7B 탐지/Guard·필요한 최소 import/정적 배포 경계 검사·
기존 CI 연결·관련 tests·공통 모듈 안내·필요 현재 기록 작성,
문서/Guard 범위 검증 실행과 integration base 검토 PR 제출을 명시적으로 허용한다.
runtime/Core/모델/backend/API/SQL/게임 구현, 실제 게임/DB/browser/audio/두 client/
성능/운영 시험·실제 배포/운영 설정 변경·main은 포함하지 않는다.

AGENTS→계획1.5→rebuild README→CURRENT→CP0096→PR421/Git 순서로 복원해줘.
PR421 승인 결과 head73839aea65679278888f26facc593f9c1180b5ad,
최종 기록 head3d57eed48d5b0dd4838c888479ae733a8cd89007,
merge f65537f0226457857b2084fd0a2c2d21d02c0804,
merge/final tree31b9b8f13a66c81f60d09f39675ac61e26673674와 parents/ref 증거를 재사용해줘.
CURRENT/CP0096 OPEN·미병합은 작성 당시 이력이다. 최신 remote 뒤 변경은 고정 입력과
분리하고 실제 충돌만 확인해줘. STEP7A3 완료/정식 승인/병합·STEP6 승인/동결과
7A1/7A2 완료/병합, 행동 NOT_RUN·UNKNOWN·구현/실행/오픈 의무를 유지해줘.

유효 미완료7B branch/PR이 있으면 이어가고 없으면 최신 승인 integration에서
game-platform-vnext 계보의 별도 phase7b branch를 만들어 integration base PR로 제출해줘.
integration/main 직접 commit 금지. T1 대응·최소 변경 준비→정상분T3→T4로 이어가줘.
새 의미 충돌만 원문ID/줄/f·승인 원문·예상 owner·누락 의미·현재 검사/consumer·영향으로
Astra/사용자에게 반환해줘. 새 Target·상위 완화·hostless 재대결 예외를 Sol이 메우지 마.

games/shared/vnext/**의 새 모듈/변경/문서·계약 test 요구 탐지,
services/game-platform-vnext/**의 변경/검증 발견,
browser→server 구현 import 금지·static asset/공개 배포 유입 차단을 코드 추가 전에 준비해줘.
실제 build/import/static 배포 경계를 필요한 부분만 확인해줘. 폴더명만으로 비노출을
선언하지 말고 제외가 증명되지 않은 server 산출물은 공개 허용하지 마.
실제 서버 파일·빈 stub·runtime/game·credential·새 서비스 배포는 만들지 마.
기존 flat shared/index 예외·games 직계 shared 제외·flat policy/test 발견을 유지해줘.
기존 games/shared/index.js는 vNext 재수출 통로로 바꾸지 마.

계약ID/revision→단일 owner/scope·GAME_SPEC 선택·단일 Registry·테스트 연결을 검사해줘.
tests/game-platform-vnext-*.test.js 및 기존 DB runner의 실제 발견을 연결해줘.
모델 oracle 연결은 안전11/current A/C/P·수명/현재성의 의미·필요 파일·환경이 누락되면
거부하는 준비다. 미정/미구현 nonDB 모델·구체 oracle·제품/취소/시간공백 정책은 7D 후속이다.
7B fixture/등록/test 파일만으로 실제 모델 지원을 선언하지 마.
vNext online 미지원 차단을 단순 삭제하거나 기존 online DB 검사를 삭제/면제하지 마.
검증 연결이 없는 조합은 미지원으로 유지하고 실제 새 모델/transport/엔진은 선택하지 마.
server-only 변경도 기존 CI에서 빠지지 않도록 필요한 trigger/명령만 연결해줘.
새 workflow/전체 vNext 예산·불필요한 build 산출물 재생성은 선제 추가하지 마.

공통 모듈 안내는 역할·적용 모델/consumer·실제 exports·연결/구독/전환/정리와
비동기 완료 채택 owner·현재 구현/보완/미지원·검증 경로를 기록해줘.
기존 API/규범 본문은 단일 owner를 참조하고 복제하지 마.
Registry 두 번째 metadata 금지·Snapshot/Reconnect 단일 선택모델 최종 채택/복구,
Shell 공통/local·BGM 기존 본체+내부 최소 수명/H1 무보완 연결 보류,
Invite 전 구간 identity/사이트 handler/dialog owner/H2~4·결과정정/여섯중복/공개분리/
Profile recipe·B01~12/R01~13/안전11/DB범위/hostless 조건을 보존해줘.
Adapter 안에 새 권한/순서/수명/token/audio 엔진을 숨기지 마.

계획 §7의 보존 조건 전체를 유지해줘. 기존 Auth/게임/API/SQL/Registry metadata/shared
barrel/game-local 네 문서·승인 원본/STEP1~6/7A1~3 artifacts·계획/DECISIONS/과거 CP는 보존해줘.
baseline/유효 override/manual gate·STEP4A 전체 완료/T01~03,
CP0075/D0010 A/C/P·known expiry 뒤 새 A 금지·동일 transaction late C 제한/실제 C·
fresh A/P/retry·owner anchor/최초60초/terminal/부분 대체·D0006~10 UNKNOWN 유지.
전게임 Room/host/DOM/winner/score/XP 강제·multiplayer 재대결 no-op/local/N/A 우회·
미래 미선택 전체 blocker 승격·장르명 기술 선택 금지.
원3232/305부모·16행58분할·관련ID/f0/명시f·원강도/부정/조건/예외와 L/H/I 비승격을
보존하고 49/B01~12나 ID개수를 전수 의미 검토 완료로 쓰지 마.

모든 Registry platform-native 영향도를 COMPLIANT/NOT_APPLICABLE/MIGRATION_REQUIRED로
근거와 함께 남겨줘. 충돌을 기존 게임 이관으로 닫지 말고 vNext 침범만 반환해줘.
문서/hash·ID/f/링크/한owner/scope·허용 diff·의미 대응을 구별해 검증하고,
변경한 Guard/helper의 의미 있는 양·음성 관련 tests·실제 repository/base-head 검사,
필요한 import/배포 제외 검사·원격 read-back을 수행해줘.
실제 CI 상태만 보고하고 미등록/미실행을 PASS로 쓰지 마.
게임/DB/browser/audio/두 client/성능/운영 행동 NOT_RUN·UNKNOWN·후속 의무 유지.
전체 source/SQL 감사·외부/공급자/요금/운영 재조사·별도 사후 감사는 추가하지 마.

실제 PR base/head·변경파일·원본/기존게임 보존·검증/미실행·미지원 조합·원격 보존·
후속 의무를 보고하고 STEP7B REVIEW_PENDING으로 제출 뒤 멈춰줘.
사용자가 검토할 문서와 핵심 항목을 구체적으로 보여주고 다음 첫 작업은
사용자의 정식 결과 최종 검토 하나로 남겨줘.
완료/최종승인·해당 PR 병합·main·7C이후·runtime/모델/서버/게임/SQL 구현·
실제 행동 시험·운영 변경·구매/문의/job/dump/복원은 진행하지 마.
```

## 10. 이번 결과와 정지

PR421 merge parents/tree·integration ref·승인 head/최종 기록 보존·main 불변을 확인했고 STEP7B 계획/분담/인계 문서를 제출한다. 계획 준비에서 저장소 파일·branch/PR/checkpoint를 새로 만들거나 규칙/Guard/CI를 수정하지 않았다. 구현·시험·운영·7C 이후를 시작하지 않았다. 이 문서는 승인된 설계의 적용 계획이며 STEP7B COMPLETED·사용자 정식 결과 승인·행동 PASS·지원/오픈 완료 선언이 아니다.
