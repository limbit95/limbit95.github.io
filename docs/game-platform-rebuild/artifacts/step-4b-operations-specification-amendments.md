# STEP4B — CP0062 T01~14·B01~07 후속 보완

입력 CP0061 `b564d71b88e8317116cae8111a7c52b0b1206858`, 2026-10-06 KST. CP0059 [T 원본](step-4b-verification-specification.md)/[B 원본](step-4b-recovery-deletion-cost-specification.md), CP0060 [보완](step-4b-support-specification-amendments.md), CP0054 [E01~12/R01~10](step-4b-preimplementation-conditions.md)를 보존하고 이 문서를 추가한다. 변경 이유는 운영공백·브라우저 채택·관측usage를 시험조건에 연결하고 최종경계/rollback 관측을 명확히 하기 위함이다. **모든 시험 NOT_RUN, SPEC_AMENDED일 뿐 PASS 아님.**

## 1. 공통 판정과 관측

인가 대상 C/P의 최종 effect 관측과 R 효력 관측이 공유하는 ordering 증거가 선행 조건이다. trace sequence를 나중에 붙이거나 서로 다른 wall clock을 정렬한 것만으로 실제 순서를 증명하지 않는다. 주입 barrier가 어느 경계를 막았는지, DB commit/lock 해제와 외부 effect/egress가 언제 가능했는지 별도 observer로 대조한다. trusted clock 오차범위가 필요한 expiry/60초/5초/250ms에서는 구간 불확실성이 합격선을 넘으면 INCONCLUSIVE/HOLD다.

공통 trace manifest: 고정 commit·실제 SQL hash/권한·Auth/SDK/CLI/PG/게임서버/OS/browser exactversion, match/incarnation·owner/epoch·command ID/hash·recipient/session 시험 ID·view generation·revision, cut/queue/TLS/socket/egress 지점·R source/scope·deadline·clock보정, 관측누락/종료원인. 실사용자·토큰·payload 원문을 로그에 넣지 않는다. 안전성 위반1건은 FAIL, percentile로 허용하지 않는다. trace 누락/미지원 최종관측점은 위반0으로 채우지 않는다.

| 시험/게이트·E 연결 | 사건·oracle 보완 | 필요한 증거/미확인·담당 |
|---|---|---|
| T01 G03 E01,E02 | actor 검사→target lock 대기→actor R, target permission 삭제/빈집합 재삽입,직접SQL→lateC/P까지. 모든 writer와 최종 인가 의존성 포함 | caller/SECDEF/ACL manifest·DB/effect ordering. Sol writer 자료→권한 담당 |
| T02 G03,G02 E02,E04 | allow→pause/partition→DBlock 소실 확인→R→resume/apply/send. transaction/savepoint rollback도 분리 | DB deny와 외부 C/P0 독립 oracle. SDK/OS/proxy queue/egress 관측 불가시 HOLD / 서버·네트워크 |
| T03 G03 E01,E03 | default/global/local/others/directAPI/console/delete/expiry 각각 R와 보호연산 경합. scope밖 유효session 대조군 | 현재CDN으로 과거SDK대체 금지. exact loaded artifact·Auth효력계약·expiryclock / Auth |
| T04 G02,G03 E05 | Ccommit→ackdrop→R→같은command retry. private결과/오류/중복응답 각각 새P | mutation중복0과unauthorized응답0 별도; hash mismatch/newsession도 포함 / command |
| T05 G02,G03 E06 | snapshot cut중 recipient/view 변경,queue→socket/TLS 대기→R,늦은fanout. revision 같아도view generation 다르면폐기 | snapshotmanifest와최종수신자별P,재생성재인가 trace / snapshot·egress |
| T06 G02 E04,E06 | 마지막R/state event 유실+quiet,재연결,A→B→A/dispose뒤success/error/null/finally | 모든callback완료경로 목록·stale변경0;event수신이권한불명차단의유일트리거면부적합 / client |
| T07 G02,G03 E04 | 최초t0→차단/pause,반복retry·owner교체,60초직전/정각/직후검증완료 | 최초deadline불변·정각abort우선·중단후LIVE0,잠금/프로세스멈춤중별도안전집행 관측 / 서버 |
| T08 G03,G04 E08 | old/new동시저장·송신,oldpause→epoch교체→resume,복원incarnation교체 | DB저장거절만PASS불가. old외부effect/egress0와new허용 경계독립 / owner·네트워크 |
| T09 G04 E07 | start/terminalcommit직전/직후crash·ackloss,DBdownabort뒤crash·늦은저장 | durableterminal보존/once·최초terminal시각anchor. 늦은저장으로deadline연장0,저장실패성공응답0 / 기록 |
| T10 G03,G04 E09 | 본인/타인/필요운영자/불필요운영자,UI/API/RPC/DataAPI/view/SECDEF/error 조회·R경합 | 서비스키adapter를통한우회와최종P포함. 현재사이트/session/참가범위 모두확인 / 보안 |
| T11 G04,G03 E10 | 최초terminal+30일전/정각/후·탈퇴중upload/rewrite,oldretry/queue/restore,기준원천rollback·양쪽write실패 | allcopy/version/key/temp/latepublish 부활0. 완료응답과실제삭제증거구분 / 복구·보안 |
| T12 G01,G05 E11 | 100고유접속,12판×8+로비4 등후보와관전혼합·중복탭·9번째입장거절. 아래manifest별입력→원격권위frame | p95≤250ms·timeout/drop미완료전수·CPU/RAM/DBgate/wiremeter. sample후보미채택 / QA·성능 |
| T13 G01,G02 E06,E11 | 정상망회복·서버/권한정상과auth/server장애별도,Wi-Fi/이동통신전환·background/resume·latecallback | 외부tnet→현재인가/최신view LIVE각≤5s,모바일5기능. background runnable조건은아래 / client·QA |
| T14 G04,G05 E12 | cut/검증지연·연속실패·scheduler와monitor공동고장·24시발견/부재·복원과현재원천rollback | verifiedcutage·전체RTOcalendar·삭제/권한검증·실제계량/총비용. 계산만으로PASS불가 / 운영 |

## 2. T12/T13 기본 manifest와 품질 oracle

| 기본 조합(채택) | 확정된 수준 | 남은 manifest |
|---|---|---|
| Windows10 +Chrome / Edge | 사용자 OS와추천브라우저조합 | 두브라우저 exactbuild·OSbuild/patch·HW/메모리·물리접근·foreground상태 |
| Windows11 +Chrome / Edge | 동일 | 동일. Windows10시험으로11자동통과처리 금지 |
| 개인 iPhone +Safari | iOS18.7.8은사용자제공표기 | 모델·exactOSbuild·Safari/WebKit버전정보·실기접근·절전/잠금/foreground·메모리압박 |

다른 단말 지원 제외 정책은 채택되지 않았다. 향후 공개 지원범위 확정은 별도이며 이번 기본 manifest 통과가 모든 단말 지원을 뜻하지 않는다. PC/폰 사이 실제 원격 참여자 조합을 포함하고, 동접100명은 하나의 client에서 요청100개를 보낸 수와 구별한다. 부하발생기·실브라우저 혼합이면 그 구성을 공개하고 실제 렌더링 측정 단말은 따로 표시한다.

T12 시작은 입력 주체의 실제 입력 발생, 종료는 command/revision으로 대응된 **다른 참여자의 권위 결과 visible frame**이다. 로컬 예측·DB응답·서버send만 측정하면 부적합하다. 서로 다른 단말 clock 보정 또는 영상/외부계측으로 end-to-end 오차를 기록한다. 실패/timeout/drop/검증되지 않은 frame을 denominator에서 제거하지 않는다. 관측 기한을 넘은 표본은 censored/목표초과로 남기며 p95가 그 범위에 걸리면 유한수치를 꾸미지 않는다. 안전성은 전수 별도 판정한다. 의도적 권한거절/주입장애는 정상반응 workload와 구별하되 전수 공개한다.

T13 tnet은 서비스 프로세스 재시도 성공시각이 아니라 외부 관측으로 정상망 복구가 확인된 시각이다. 서버·DB·현재권한 정상 조건에서 각 사례5초이며 p95 아님. OS가 앱을 suspend한 동안 frame실행이 불가능한 사례는 망복구/OS재개/서비스LIVE 세 시각을 모두 기록하고 foreground와 섞지 않는다. 전체경과5초를 못 채웠다면 숨기지 않는다. runnable전제의 판정과 background제약은 별도 명시하며, 그 전제로 사용자 전체 재접속 의무가 자동 축소된 것으로 해석하지 않는다. 정책에 미치는 영향은 후속 판단 HOLD로 남긴다.

유선/Wi-Fi/모바일망의 RTT/loss/jitter/bandwidth,장소·공유망부하·recovery 판정·server/DB정상성,관측 clock오차를 manifest에 기록한다. 기존 조건별60분/입력1000/재연결30회는 후보이고 아직 승인된합격표본아님. p99/tick/queue새기준없음. 표본충분성·부하구간/성능시험기간 결정은 QA/설계 책임이며 사용자에게 수치를 떠넘기지 않는다.

## 3. B01~07 후속 명세

| ID | 후속 필수 조건/관측 | 판단·미확인/담당 |
|---|---|---|
| B01 cut/검증 | schema/data/roles·기록/매핑이동일consistent cut인지증명. tcut/ttransfer/tvalidated별도,검증전에는usable아님. Δ/v/m·연속실패모형·verifiedage독립감시 | 조건부가능. 여러CLI실행의단일snapshot계약·검증최대시간미확인 / Sol도구자료→복구 |
| B02 범위 | 최소terminal·최초종결/삭제deadline·매핑·schema/RLS/GRANT/roles/FK/extensions,Authmanageddata/DDL·Storage본체·설정범위별manifest. defaultprivileges/owner재검증 | 최소권한·참조무결성·최초terminal내구성HOLD. 암호/비밀은문서에기록금지 / DB·복구 |
| B03 7일/30일 | 현재허용데이터로7일논리복구점구성,정확deadline에본체/모든version/temp/key복호화능력처리. lifecycle/delete marker만완료불가 | 분리archive우선조건부. rewrite/keyerasure실증필요 / 복구·보안 |
| B04 탈퇴 | 본인연결은운영DB/archive/index/FK/로그/버전/tmp/대기업로드에서제거. 타인최소기록원래deadline유지. hash/randomID잔여연결성검토 | allcopy inventory/latepublish fence/완료실패상태HOLD / 개인정보·복구 |
| B05 재생성 | oldcommand/queue/retry/upload/복원cut은현재삭제기준으로재검사. 기준원천rollback·DB성공외부실패/역순실패·ack유실도주입 | current원천과publish/완료barrier계약미확인. 무기한tombstone허용아님 / 설계·보안 |
| B06 격리복원 | ingress/egress/쓰기차단→cut범위검증→복원→현재삭제적용→새incarnation/oldowner·session차단→현재승인/운영권한재확인→ACL/사본검증→안전개방 | 어느단계라도증거부족이면닫힘. 원천까지rollback되면재승인만으로사본삭제완료아님 / 운영·보안 |
| B07 운영/RTO | tincident/tdiscover/talert/tack/tstart/trestore/tverify/topen·calendar·감지지연별도. 24시발견/자정중단/공휴일/부재/대체미응답·자동retry실패사례 | 발견후24h목표HOLD. 사용자운영사실→운영담당시간예산→후속모의복구 |

최소 종료 기록은 내부적으로 match/incarnation 및 terminal identity에 대해 중복 없는 권위종결을 보존해야 한다. 구체 schema나 새API는 여기서 정식 채택하지 않는다. 저장 실패시 재시도는 원래 종결시각/삭제기준을 유지하고 불명확하면 성공표시하지 않는다. 조회는 본인참가/필요현재운영자와현권한을검증하며 Data API를거쳐도동일의무다. 삭제/식별분리 후7일복구점의 FK재구성은 지워진사용자를복원계정에재연결하면실패다.

운영 체크리스트 후보는 ①발견 증거/경보/담당 확인 ②옛쓰기·송신격리 ③latest verifiedcut/RPO 기록 ④사본/현재삭제·권한원천 freshness검사 ⑤격리복원/새incarnation ⑥삭제·session/owner무효화·권한/ACL 재검증 ⑦안전개방 및전체RTO 판정 ⑧목표미달/부재/미확인과후속조치보존이다. 자동검증/추가cut/증분/대체대응은지원계약과비용을비교할후보이며 실제job생성·dump·복원·시험은이번에하지않는다.

현재 모든 T/B는 NOT_RUN. G03 OPEN/BLOCKING,G01/G02/G04/G05 PARTIAL/OPEN,G06 두Probe 적용 판단만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS / 전체완료·구현 HOLD.
