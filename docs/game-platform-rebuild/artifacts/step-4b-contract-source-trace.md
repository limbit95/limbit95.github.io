# STEP 4B — 정식 계약 반영 trace

## CP0074 현재 적용 trace

입력 CP0073 `e3aa3feaf945e472d73360d7f580f583b01ce648`과 D0006~08을 기준으로 사용자 허용한 정식 반영을 수행한다. 아래 원본5블록 hash/줄번호는 최초 반영 이력이며 새 절을 삽입했다고 그 hash를 다시 계산해 대체하지 않는다. 과거 입력 원문을 새 판단으로 덮어쓰지 않는다.

| 입력/판단 | 현재 정식 반영 | 대체/유지 |
|---|---|---|
| D0006~08·CP0073§3/4 | runtime J01~06·security J07/08·계획1.4 STEP4B | 설계/실행 분리, 외부R5초/P인계/증명된 정지 예외만 대체 |
| CP0074 설계§2·metadata SELECT2개 | security J07~09 | noLOGIN minimum-owner 미확보를 실제 definer callable 경계로 대체; runtime 관리자 권한 금지 |
| CP0074 설계§3 | runtime J01~05 | native TLS gate 선택·old store/send 독립·실제 C 유지; Z1 HOLD |
| CP0074 설계§4 | runtime J04·execution J10~13 | 분리archive/current/삭제generation·복구 범위 및 B5 처리 확정 |
| CP0074 설계§5 | execution J10~12 | 구체 SKU/감시 조합·가격 가정·예산 조건, 실측UNKNOWN |
| CP0074 설계§6 | execution J13·validation | T01~14/B01~07 현재 delta, 원본 명세 보존/NOT_RUN |
| CP0074 설계§7 | risks·CURRENT·계획1.4 STEP4B | 정확한 Z1과 다음 사용자 정책 판단, 완료/병합 없음 |

원문 증거는 [새 근거](step-4b-design-finalization-evidence.md), 변경 검증은 [새 검증](step-4b-design-finalization-validation.md)이다. self SHA 대신 이번 checkpoint와 Git commit으로 제출을 추적한다.

## 최초 정식 반영 이력 — 이하 원문 보존

상태: 가이드4 정식 반영 검증용. 입력 commit `ddfa7a5e226fe0c5f62779a19b708ca0802899ce`, 판단 blob `bd4c5b4991921c17d74bd99ef275819e4ae046f5`. 원본 판단을 변경하지 않고 서로 겹치지 않는5블록으로 **전체 입력**을 반영했다. 아래 SHA256은 원본 블록 UTF-8/개행 포함 hash이며 source의 사실 정확성이나 구현 지원을 인증하지 않는다.

## 원문 전체 반영

| 블록 | 입력 줄 | 정식 반영 파일·줄 | 원문 블록 SHA256 |
|---|---|---|---|
| runtime-sync-contract | 7–80 | [step-4b-runtime-sync-contract.md:10–83](step-4b-runtime-sync-contract.md) | `42757d5abcd1df97edb19d601bf553cfdb659f62abe36bae812555a83dd31ebc` |
| security-site-contract | 81–112 | [step-4b-security-site-contract.md:10–41](step-4b-security-site-contract.md) | `aaaa2e954e257d59aed6cd0b1e2417366443e092bea56752cb9680dabdb6d15a` |
| execution-operations-decisions | 113–173 | [step-4b-execution-operations-decisions.md:10–70](step-4b-execution-operations-decisions.md) | `703baf3902cf2541b0691cafa50a12f20c548bf53f4d969f64078959ba9e0652` |
| input-context | 1–6 | [step-4b-risks-and-followup.md:35–40](step-4b-risks-and-followup.md) | `303f157fbec20192fe7ffca320bf60067457a734b235f0e9e577c6e19988b017` |
| conflicts-boundary | 174–180 | [step-4b-risks-and-followup.md:42–48](step-4b-risks-and-followup.md) | `da8ab56cc518b4b02dded9a4233b5cdc38ffecbe965a4f3771b6aa83242871df` |

## 절별 선택·보류 연결

| 입력 판단 | 반영 문서 | 보존할 핵심 조건 |
|---|---|---|
| J01 | 모델 품질 | 모델별 권위·최소Core·DB 범위·온라인 신뢰서버; 공급자 미확정 |
| J02 | 모델 품질 | 순서 domain·동일version·T01~03·ACK/commit 구별·API 미동결 |
| J03 | 모델 품질 | initial/live gap·놓친 마지막 변경·독립 reconciliation·bounded 실패 |
| J04 | 모델 품질 | mutation 중복/현재 응답권한 분리·current/history/replay/crash 구별 |
| J05 | 모델 품질 | 잠정/확정·효과중복·STEP4A await/재진입·정리·현재승인 재검증 |
| J06 | 모델 품질 | 11개 동등 안전성·private 없음 검증·hostless 재대결 면제 없음 |
| J07 | 권한/사이트 | 서버검사 시점·철회 직렬화·이미 전달된 데이터 회수 한계 |
| J08 | 권한/사이트 | private projection·policy cache·private stream G03 조건부 보류 |
| J09 | 권한/사이트 | 사이트 정책 owner·auth bridge·nickname/invite/Registry/공개 분리 |
| J10 | 실행/운영 | 실행 방향 채택과 제품/SDK/transport 후보 보류 구별 |
| J11 | 실행/운영 | latency/frequency/bandwidth·운영 비용 변수·가격 확인 범위/한계 |
| J12 | 실행/운영 | G01~06 전 행·사유·추가증거·책임/닫힘 기준 그대로 |
| J13 | 실행/운영 | H01~10 합격 oracle 전 행·NOT_RUN 그대로 |
| 입력/충돌/제출 경계 | 미결정·후속 | 가이드3 당시 상태와 이번 반영 상태 구별·Core/규칙/승인 경계 유지 |

B01~44 source와 V01~12는 [판단 근거 연결](step-4b-judgment-source-trace.md)·[준비 trace](step-4b-source-trace.md)·[출처 검토](step-4b-research-verification.md)를 재사용한다. 준비/판단/조사 원본·선택확인·승인STEP4A는 불변이며 이번 새 공식 원문 검증이나 독립 감사로 표시하지 않는다.
