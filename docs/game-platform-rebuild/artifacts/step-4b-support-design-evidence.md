# STEP4B — 후속 판단 공식 근거·비용·지원 질문

2026-10-06 KST 조회. 입력 CP0059 `8af1029ab1aefeda1081b86e8d83faa2509a13d9`. [판단](step-4b-support-design-judgment.md)·[명세 보완](step-4b-support-specification-amendments.md). 공식 설명과 설계 추론을 구분한다. 이번 운영 SQL/Auth/SDK/backup 실행은 없다.

## 1. 출처·확인 사실·한계

| ID | 공식 원문·확인 절 | 확인 사실 | 적용 한계 |
|---|---|---|---|
| S60-01 | [Sessions](https://supabase.com/docs/guides/auth/sessions) session_id/timeouts | session_id와Auth session 연계,시간제한기능은Pro이상·refresh시검사·만료row정리지연 가능 | Free에sessiontimeout기능기본제공가정금지. row존재와최종C/P인가별도 |
| S60-02 | [Signout](https://supabase.com/docs/guides/auth/signout) scopes/tokens | global/local/others,refresh철회후JWT잔존 구분 | 특정SDKpatch의동작·AuthR↔외부egress지원계약아님 |
| S60-03 | [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization) Updating RLS policies | 연결권한cache와JWT변경시재평가 | final P마다최신권한검사보증아님 |
| S60-04 | [PG17 locks](https://www.postgresql.org/docs/17/explicit-locking.html) row/advisory locks | transaction/rollback과lock수명,mode별충돌 | advisory는모든writer가준수해야함. 외부send원자성보증없음 |
| S60-05 | [PG17 system information](https://www.postgresql.org/docs/17/functions-info.html) current_user | SECURITY DEFINER실행중current_user변경 | bootstrap의current_user검사만caller인증으로해석금지 |
| S60-06 | [CLI dump](https://supabase.com/docs/reference/cli/supabase-db-dump) dump/privilege migration | 기본managedschema제외·data/customroles별도·targetdefaultprivileges주의 | exact CLI/mode별Authdata지원·단일cut검증필요 |
| S60-07 | [Platform CLI restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) managedcustomizations | auth/storage customdefinition별도복원,pg-delta/migra차이,customLOGINpassword별도 | 일부managed내부함수/index는diff에서빠질수있음. 복원후권한검증필수 |
| S60-08 | [Self-host restore](https://supabase.com/docs/guides/self-hosting/restore-from-platform) included/manual setup | auth.users data포함절차설명,JWT/provider/SMTP/Storageobject/Edge설정별도·버전차이주의 | managedschema DDL제외와data포함설명을혼합해모든옵션의범위를단정금지. self-host채택아님 |
| S60-09 | [Database backups](https://supabase.com/docs/guides/platform/backups) daily | Free외부export권고,Storageobject본체DBbackup미포함 | 실제dump/복원성·삭제정책지원증거아님 |
| S60-10 | [Supabase pricing](https://supabase.com/pricing) Free/Pro | Free DB500MB·sharedCPU500MBRAM·egress5GB/cached별도5GB·Storage1GB·Realtime200/월2M,autoBackup없음,1주비활동pause. Pro기본$25 | 잔여quota/정확사용량/성능/세금실결제UNKNOWN |
| S60-11 | [Realtime limits](https://supabase.com/docs/guides/realtime/limits) limits | Free100messages/sec·100joins/sec·200connections | messages계량과fanout방식일치확인필요;200명의게임성능보증아님 |
| S60-12 | [Egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress) usage | 서비스반출계량,cached와uncached구분 | DBbackup을cached allowance로충당가정금지 |
| S60-13 | [Lightsail pricing](https://aws.amazon.com/lightsail/pricing/) IPv4 Linux/object storage | 1GB$7/2TB,2GB$12/3TB,bucket5GB/25GB$1·100GB/250GB$3 | IPv6-only와구분,실제Seoul계정quote·세금·초과비용확인필요 |
| S60-14 | [Lightsail transfer](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-data-transfer-allowance.html) Seoul | VM allowance는in/out소비·초과outbound서울$0.13/GB | ingress자체초과과금과구분,VM/bucket/CDN별다른meter |
| S60-15 | [Changelog](https://supabase.com/changelog) Oct5/framework adapters | @supabase/server frameworkadapter deprecation안내,PG버전변경이력 | 현SDK도입사실아님. CP0059 PG17.6관찰을17.11지원완료로갱신하지않음 |

Supabase skill의공식문서우선절차를사용했다. changelog.md는도구의text/markdown오류로HTML대체. 검색일부는무관결과라제외하고직접공식페이지/공식search_docs로확인했다. AWS페이지일부crawl은5~6일전표시;조회일과공급자crawl/실결제시점을구분한다. 가격변경을감지하지못했다는것은계정청구확정과다르다.

CLI문서의기본schema제외설명과self-host가이드의Authdata포함절차는서로다른mode/범위를말할수있다. 이번에는실제고정CLI버전·옵션별출력manifest가없어그경계를확정하지않는다. managedschema제외라는이유로Authdata가모든dump에서항상없다고하거나반대로무조건포함된다고하지않는다. 지원문의와후속허용된검증대상이다. default privilege확인은restore설명문자열검색에서는찾지못했지만CLI공식search_docs항목에서확인했다. 단순find실패를지원부재로해석하지않는다.

## 2. 비용·부하 재검산과 판단

CP0059의계산은시나리오로유효하며실제usage는UNKNOWN이다. wire overhead20%,환율1400/1500/1600KRW/USD,세율10%는가정이다. 실제환율/청구통화·수수료·과세여부는확인값이아니다. 월30일backup과730h게임은독립민감도축이며단일실제달예측이아니다. 단위는decimal GB,TB→GB환산은계산가정이며공급자meter와대조한다.

| 후보 | 기본USD | 환율1400 / 1500 / 1600·가정세금10% KRW | 판단 |
|---|---|---|---|
| Free서울+1GB IPv4 VM+5GBbucket | 8 | 12,320 / 13,200 / 14,080 | 비용대조후보.100명안전성/메모리성능미증명 |
| Free서울+2GB IPv4 VM+5GBbucket | 13 | 20,020 / 21,450 / 22,880 | 우선검증후보유지,총비용충족HOLD |
| Free서울+2GB IPv4 VM+100GBbucket | 15 | 23,100 / 24,750 / 26,400 | backup용량증액이DB반출한도를해결하지않음 |
| Pro+2GB IPv4 VM,외부bucket미포함 | 37 | 56,980 / 61,050 / 65,120 | 이가정범위에서기본료만3만원초과,현재후보배제 |

산식: 월KRW=(VM+bucket+유료기타+초과전송/저장)USD×환율×세금계수+원화추가비+수수료. 사용자기존사이트소비를추가비에서0처리하거나Free잔여quota를전부게임몫으로간주하지않는다. 신규유료monitor/log/backup검증·운영도구·유급운영비등실제증분비용은포함한다. 본인무급시간은별도운영공수로기록하고, 이를위한유료인력/서비스도입시그비용을추가한다.

| 분리경로/가정 | 계산 | 결론 |
|---|---|---|
| gameplay 저부하100명×10Hz×256B outbound | 10/100/730h:9.216/92.16/672.768GB. inbound64B동일빈도:2.304/23.04/168.192GB | runtime/100명성능실측아님. TLS/재전송/기존서버활동추가 |
| gameplay 고부하100명×20Hz×1024B | 100h outbound737.28+inbound46.08=783.36GB;20%가정940.032GB | 2GBVM3TB대조내시나리오라도G03/성능/총비용확정불가 |
| 같은고부하730h | outbound5382.144+inbound336.384=5718.528GB;20%가정6862.2336GB | allowance3TB초과충돌후보. 정확outbound초과청구는시점별meter필요 |
| DB gate 전체5/s·응답256B | 10/100/730h:0.04608/0.4608/3.36384GB | 저빈도숫자는승인알고리즘아님. 실제gate수/응답wire/기존site소비미확인 |
| DB gate 전체4000/s·응답256B | 100h368.64GB,5GB이론소진1.3563h | 제시구성Free목표와충돌. 기존소비0은실제가정이아닌최대상한대조 |
| Realtime fanout113×20/s | 2260messages/s,100h813.6M,2M/2260≈14.75분 | 해당계량모델은100/s·월2M과충돌. 실제message정의대조필요 |
| daily backup10/100/500MB | 30회반출0.3/3/15GB,7개raw사본0.07/0.7/3.5GB | 사본수예시일뿐삭제승인아님. rewrite/temp/roles/검증반출추가 |
| RPO여유위해12h full dump 후보 | 60회반출0.6/6/30GB,7일14cut raw0.14/1.4/7GB | 최종주기미채택. 100MB시Free반출초과,500MB는5GBbucket도초과후보 |

현재5gate/s·730h와daily100MB는3.36384+3=6.36384GB로다른소비를빼도Freeuncached5GB를넘는다. daily10MB면3.66384GB지만기존EexistingUNKNOWN이라충족확정불가. 12h10MB후보는3.96384GB,12h100MB는9.36384GB다. 삭제archive재작성은이계산에추가되며0이라고하지않는다.

환율1500/세금10%와기본$13에서남는8,550원은$5.1818이고,기타비가없다는이론상한에서도서울VM초과단가$0.13로약39.86GB분이다. 이는실제허용초과량/예산보장이아니다. bucket증액/monitoring/수수료가있으면더작아진다. Free에Prooverage단가를붙여지속운영가능하다고하지않는다.

| 요구별 최종 평가 | 분류 | 이유/필요조건 |
|---|---|---|
| 사전 allow→외부C/P+A즉시철회 | 현재구조계열과요구충돌 | 독립R통지지연반례. 모든R연결지원증거있는구조대안필요 |
| total100/판8 | 증거부족HOLD | Free200Realtimeconnections와게임100처리능력다름.100고유사용자/방분포/DBpool/자원실측 |
| p95 250ms/재연결5s/모바일5기능 | 증거부족HOLD | Seoul동지역/2GBVM만으로증명불가. T12/T13계측필요 |
| 30일/탈퇴삭제+7일복구점 | 조건부설계가능후보 | 분리archive·사본제거·restore참조무결성·삭제source지원증거필요 |
| daily/RPO24h | exact24h+양수지연후보충돌 | 추가cut/증분/실패여유·감시·운영시간을함께확정해야함 |
| 발견후24h수동복구 | 증거부족HOLD | 대응시간/대체담당·복원/삭제/현재권한검증소요UNKNOWN |
| 세금포함월추가3만원 | 조건부비용후보,최종판단불가 | 실제quota/월활동·wire/backup방식/청구·기타비UNKNOWN |
| 전체목표동시충족 | HOLD | 단일배포조합에대한안전성·성능·삭제/복구·비용증거미확보 |

## 3. 지원 문의 보완 — 미전송

기존6질문을다음의검증가능한질문으로좁힌다. Freecommunity지원과답변기한보장부재를감안하고유료지원구매를자동선택하지않는다.

1. 고정Auth/PG버전에서session_id현재성·expiry를최소권한으로검증할공식API/DB권한과지원계약은? getUser/row조회가각각어떤session조건을검사하는가?
2. global/local/others·directAPI·console user삭제·refresh/expiry의R효력경계는? auth.sessions관련lock/trigger가내부writer와안정적으로직렬화되도록지원되는가? 권한/upgrade제약은?
3. 외부runtime/egress와managedAuth R을같은순서로집행하거나R확정전에oldsender를fence할지원방식은? DBdisconnect후늦은send반례를어떤계약이배제하는가? event/TTL만의답변은의무충족증거로사용하지않는다.
4. CLI버전/mode별schema·Authdata·Storagedata·roles/customprivileges지원matrix와단일snapshot내보내기지원은? custom auth/storage diff의누락범위는?
5. Free월usage·잔여quota를비밀정보없이읽을수있는지원경로와uncachedbackup계량범위는? 실제accountmeter가없으면UNKNOWN유지.
6. 복원후session/JWT/signingkey·managedAuth데이터호환조건은? rollback된approval/role는별도현재권한검증이필요하다는전제로확인한다.

M01~10의확보담당은CP0059표를유지하되M03/M04의공식지원계약을최우선으로한다. 지원문서/답변이와도구현시험을대체하지않으며답변없음을전체기술불가능으로단정하지않는다. 이번실제문의전송없음.
