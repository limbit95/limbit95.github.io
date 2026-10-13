# STEP7A1 — 반영 근거·원자적 전환·한owner

- 상태: STEP7A1 **REVIEW_PENDING / FORMAL_RESULT_REVIEW_PENDING**. 사용자 요청으로 승인 STEP6 문서/진입/최소Guard·관련테스트와 범위검증/PR제출만 반영했다. 최종결과승인·COMPLETED·병합·main·7A2이후는 미수행.
- 기준 `90f14ceb3e609267aa559980994a07eacb0160f3`, branch `docs/game-platform-vnext-phase7a1-common-rules`, PR base integration. STEP6 COMPLETED/DESIGN_RESULT_APPROVED/TARGET_FROZEN/INTEGRATION_MERGED. 승인 원본/STEP6 artifacts/계획/DECISIONS/과거checkpoint 보존.
- 문서/Guard검사와 실제게임/DB/browser/audio/두client/성능/운영을 구분한다. 행동 **NOT_RUN**, 운영/실행 **UNKNOWN**·구현/실행/오픈 의무 유지.

## 실제 복원과 원본

AGENTS→계획1.5→rebuildREADME→CURRENT→CP0090→PR417/418/Git 순서의필요상태를복원했다. 최신integration `90f14ceb3e609267aa559980994a07eacb0160f3`와기준동일·추가변경0. PR417 merge `1a950b06ac895028330587dc53fae151b981123a`/final head `487fc8111a98d8f9966e58303b3f85cd81c8fc33`; PR418 merge `90f14ceb3e609267aa559980994a07eacb0160f3`/final head `3e11c626be1668b2b2e6dfda191ff1737cf6646c`. CP0090의사후기록PR병합대기는당시이력이며실제Git으로복원했다. 유효7A1branch/PR없음확인뒤별도branch사용.

계획원본Library identity `libfile_dfb83b5d4dd88191b5e367f46e5d3529` / file `file_00000000c3c88209aa8e453c06a1693b` / version0 / 29,374 bytes / SHA256 `e320c0b69d9821bdf20c286c5a67f0b51e1d9402dc9dba8513bafefaa65ba74a`. [계획원본](game-platform-vnext-step7a1-plan-and-handoff.md)의bytes와작성당시NOT_STARTED/계획허용만/§9프롬프트를보존했다. 현재허용은이번실제사용자요청이다. 원본프롬프트존재를허용으로쓰지않았다.

## 재사용 trace와 실제 변경

| 고정 source | blob/심볼 | 반영 영향 |
|---|---|---|
| AGENTS | `2686a3c37502bbf1f7f2a9407640e78cc026dadb` | 신규/기존consumer 진입scope추가, 기존일반흐름보존 |
| 계획1.5 | `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` | 7A1최소연결과7A2/3/7B/7C/D분리, 파일불변 |
| STEP6Target | `4c12e5a5ce88aa7ea71a83c7180ad34aec1c1a12` §2/4/6.3 | 승인AR/CO/LI/MO/CA본문·revision/scope·원자적묶음, 파일불변 |
| Guard | `2aa47527fc57a1ba0fe8a5d6c3c72eb984b8477b`; RULEBOOK_PATH/UI_RULEBOOK_PATH·validatePlatformDocumentPolicy/validateRepositoryState | 기존검사유지, 신규5owner/필수절/일치revision·scope·실제상대링크·진입·기존/신규권위구분 |
| Guardtest | `4c7d3c865cb09ab19d4831404f0c43fa77bc3b12` | 기존35사례보존+14신규meaningful사례 |
| package.json | `917a55aa474d98cc663364c5e7dab84ff6fe5cf1` | 기존node test/Guard경로사용, 파일불변 |

원본강도/조건/부모/원문hash·sourceblob/줄·목적지/f는 [실제대응](step-7a1-clause-correspondence.md)와각본문인용에보존한다. 소스전체/SQL감사·공급자/운영재판단·새Target선택/별도사후감사없음. STEP6원본·전수입력·66고정source trace는재사용하며현재실제변경경계만읽었다.

## 원자적 연결과 후속 경계

새5문서본문+기존GV/AGENTS/development§17/UI상위안내/gamesREADME/네템플릿+최소Guard/관련테스트를한7A1 PR의같은적용단위로묶는다. 신규vNext는AR→CO/LI/MO/CA, 기존development/UI/DB는기존consumer/원문scope. BO/RT실제본문은7A2/7A3이며AR4에서기존원문·승인B/R내용을찾을수있다. docs/game-platform-board-rules.md/realtime-coop-rules.md는후속계획경로이며지금파일을생성하지않는다.

최소Guard는적용계약을GAME_SPEC의Platform contract문서선언으로읽는다. 이표기는문서scope선택이며runtime/API/wire필드가아니다. 기존게임에선언필드를강제로넣지않아기존scope가그대로다. newerrevision번호만으로호환을인정하지않는다. doc-only네문서bootstrap와purelocal은fakeRoom없이기존검사를유지한다.

신규vNext online의모델oracle/discovery는현재7B미지원이므로DBtestfilename만으로지원하지않는다. 기존onlineDB검사를삭제하지않고, 현행legacy consumer의그검사를유지한다. 이보류는안전11의면제가아니며전체Targetblocker도아니다. fullnestedshared/serverroot/import·배포제외/test발견·exports안내는7B이고runtime/Backend/API/SQL구현은이번에없다.

## 의미 대응 검토 범위

승인책임별실제본문·ID/f의지정범위/원조건·한owner와다른owner참조를대조했다. MO1은승인7축·subitem복수선택을보존하며MO3은현재A/C/P와D0010부분대체·안전11/DB상세의scope를원문우선으로유지한다. LI는success뿐아닌error/null/finally/cleanup/leave/effect/후속완료·T01~03/late자원·현재인가된authoritative재조회허용을보존한다. CA는H1보완전직결보류·Invite identity/handler/dialog owner·결과정정/여섯중복/공개분리/Profile조건을실제본문에둔다.

805ID/840단위는이번적용범위의참조계승이며그수치만으로전수3,232규범변환/의미검토/행동PASS를선언하지않는다. 부모의다른owner조건·분할밖조각·L/H/I·기존topic-owner·장르본문은승인전수표/고정원문에계속도달한다. 새의미충돌은발견하지않아Astra재판단단계를추가하지않았다. 실제누락/상위변경이발견되면해당원문ID/줄/f·owner·빠진의미/consumer영향만반환한다.
