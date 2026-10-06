# STEP4B — G03 호환 경계 검증

고정 CP0065 `7cb224c36d934be90e3c237d0bed2d105b9fa181`, tree `247ab29ddd3b84a2b0768d85f592a7c16ee71c6a`. 2026-10-06. PR HEAD 대조/추가 변경0. [경계 검토](step-4b-g03-compatibility-boundary.md).

## 읽기 결과

선택 22파일 읽기 성공. 정적 정의의 출처 식별이며 운영 적용/전수 감사/SDK 실행 인증이 아니다. 원문을 재복제하지 않고 blob만 남긴다. baseline과 후속 migration 의미를 구분한다. 공식 지원 사실 추가 확보 없음, 운영 SELECT/문의/행동 시험 없음.

| 선택 경로 | 고정 입력 blob SHA |
|---|---|
| `js/supabaseClient.js` | `fd7aa665e8f7ee6921f66f039fe76acee1371fa5` |
| `games/shared/accessGate.js` | `4803cd8fd141c98d97bd6357243a9f955843d6cc` |
| `js/auth.js` | `09eb6d21b2d259567c0ba1b1a0aecfbd1bcac723` |
| `the-game/js/supabase.js` | `aa5e5c3aaf85bb3c1cb439663f0384906937263c` |
| `liar-game/js/supabase.js` | `f922ad1bc5da1a776e132824e825907bc883b605` |
| `games/no-thanks/main.js` | `9e09b49d2365fe880e40a6c2180476573043cb0b` |
| `games/no-thanks/roomLobby.js` | `b689e6c0628824cc3d617bd5dc71ace424857fb3` |
| `liar-game/js/entry.js` | `efa2177fe3439826dd333cf97c1f6fe2c314c75e` |
| `liar-game/js/api.js` | `e9eaf42052ea4d9626e32d3f411e8de8c06b8cbc` |
| `liar-game/js/sessionGuard.js` | `e00985a14102c20399237f9b2522340956d7c5e4` |
| `the-game/js/app.js` | `0557e875e653527d168219b2fdff6ec93a9a79a5` |
| `the-game/js/multiplayerApi.js` | `46db453d346f63b892450095029978b0e4ec8bf2` |
| `supabase/site/migrations/20260909094910_native_auth_otp_signup.sql` | `78cbe950f2c7f805c3cca4773270352ad866026e` |
| `supabase/site/migrations/20260909124500_enforce_native_auth_otp_signup.sql` | `932e7e6b48ea3f78597cbf99cbfcb20bb8cdbeb6` |
| `marble-game/js/multiplayerApi.js` | `62161b2bdcfb2803540bba69c8782dabc1c66edd` |
| `marble-game/js/onlineGameApi.js` | `51e947b49cf6a464df0c7fd0781b4efbe76a9a9d` |
| `games/shared/registry.js` | `afa4ba25824157534eca7ca7538b89571cfca30e` |
| `supabase/site/baseline/01_members.sql` | `bae3d36d744fe66d6ad63c3f900eec66cb3da575` |
| `supabase/no-thanks/20260921225000_no_thanks_room_lobby_foundation.sql` | `3bcd84b7b4cdfa40dbc5b2c3aa2c10e35dbc3538` |
| `supabase/site/baseline/08_auth_profile.sql` | `52603eebd69a1f31f22f86ba56dc91bb3308fe0f` |
| `supabase/site/baseline/11_rls.sql` | `f5d7db2a36e39e65c4d3f7f5718ad40757761f33` |
| `supabase/README.md` | `6f79e559386f600bd524615d61dd1e60c361c759` |

## 검증 범위

- 변경 예정 신규3/수정2 총5경로: 경계 문서/이 검증/CP0066/CURRENT/작업 분담. 코드·SQL·정식 산출물·과거 기록·DECISIONS 변경 없음.
- 문서 링크/표/공백/22개 상태, 고정 tree 대비 변경 범위, Governance 입력 검사는 제출 전에 실행한다. 결과가 실패하면 제출하지 않는다.
- 최종 tree 허용5경로·삭제0·보호 blob/mode/type, 원격5파일 내용과 PR HEAD/body/base/OPEN Draft 미병합은 제출 후 확인하여 PR 설명/최종 보고에 남긴다. 이 문서의 사전 계획을 완료 증거로 사용하지 않는다.
- 행동/경합/성능/모바일/복구/삭제: **NOT_RUN**. 문서·Governance 및 자동 CI가 성공해도 실행 지원으로 승격하지 않는다.
- STEP4B IN_PROGRESS/전체 완료·구현 HOLD, G03 OPEN/BLOCKING, G01/02/04/05 PARTIAL/OPEN, G06 두 Probe 적용 판단만 SCOPED_DESIGN_RESOLVED.
- 권한 변경·문의 전송·구현·실제 시험·backup job/dump/복원·정식 반영·STEP5A·병합·main 미수행.
