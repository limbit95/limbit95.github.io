# STEP4B — Supabase Free·서울 비용·제약·외부 백업 근거

2026-10-05 KST. Sol 자료 준비. 입력 `c51d74f06caa2e8d76b2ba206e9446e749864126` / CP0054. 추가 결정은 [원본](step-4b-additional-user-decisions.md)과 선보존SHA `2e0f4dd092f6d96c9e0e7051660d4538d8f7fce4` / CP0055.
실제 사용량은 서비스 오픈 전이라 UNKNOWN이다. 아래는 예측값 확정이나 제품 채택이 아니라 부하별 비교자료다.

## 1. 공식 Free 제한과 확인 수준

| ID | 공식 자료 | 확인 사실 | 이번 환경에 적용할 한계 |
|---|---|---|---|
| F01 | [Supabase pricing](https://supabase.com/pricing) | Free DB500MB,sharedCPU/500MB RAM,storage1GB,egress5GB,Realtime200peak/2M messages,Edge500K | 제품 quota이지100명 실시간 처리 보증 아님. 무제한API 문구는 CPU/lock/egress 무제한 의미 아님 |
| F02 | [Billing](https://supabase.com/docs/guides/platform/billing-on-supabase) | organization 단위 plan/사용량,DB size는 project 단위 | 같은organization의 사이트·다른project 소비를 합산. 프로젝트 분리만으로 무제한 무료 여유 생성 안 됨 |
| F03 | [Egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress) | Database/Auth/Realtime/Storage 등의 unified quota,shared pooler 응답 계량,cache quota 별도 | 게임WSS·DBgate·backup 반출을 각각 측정. cache5GB를DB quota에 더해10GB라고 계산하지 않음 |
| F04 | [Backups](https://supabase.com/docs/guides/platform/backups) | Free 자동backup 없음,정기export/off-site 권고. Pro daily7일 | Free 자동backup을 일1회 외부backup 구현으로 착각하지 않음. DBbackup에Storage object본체 포함되지 않음 |
| F05 | [Pricing](https://supabase.com/pricing)·[Production checklist](https://supabase.com/docs/guides/deployment/going-into-prod) | Free 비활동1주 pause,유료plan과지원 차이 | 오픈전pause/재개는운영제약. Free0원은 가용성/SLA 약속이 아님 |
| F06 | [Connections](https://supabase.com/docs/guides/database/connecting-to-postgres) | Free directIPv6,shared session poolerIPv4 지원 | backup 실행망·Docker/CLI·connection limit 확인 필요. 유료IPv4 add-on을 필수로 가정 안 함 |
| F07 | [Realtime usage](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages) | Broadcast 송신과recipient 수신 계량 |100WSS가100Supabase realtime연결과같은것 아님. 게임VM transport 선택에 따라구별 |
| F08 | [Lightsail pricing](https://aws.amazon.com/lightsail/pricing/) | Seoul 비교LinuxIPv4 1GB$7/2TB,2GB$12/3TB;object$1=5GB/25GB,$3=100GB/250GB,snapshot$0.05/GB-month | 현재가격표 선택확인. 계정의SKU실견적·backup권한·실측용량은미확인 |
| F09 | [Lightsail FAQ](https://aws.amazon.com/lightsail/faq/)·[Regions](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-regions-and-availability-zones-in-amazon-lightsail.html) | Seoul지역지원,VM초과outbound$0.13/GB,in/out allowance | object/CDN초과율을VM에전용하지 않음. 두서비스서울배치가RTT나250ms를증명하지 않음 |
| F11 | [Object storage](https://docs.aws.amazon.com/lightsail/latest/userguide/buckets-in-amazon-lightsail.html) | Lightsail 지원 지역에 bucket 생성 가능, 기본 private, versioning 기본 off | 서울 저장 후보 지원 근거. 계정 권한 분리·삭제 방지·암호화/key 구성은 미확인 |
| F12 | [Realtime limits](https://supabase.com/docs/guides/realtime/limits) | Free 100messages/s·100joins/s, throughput 초과 시 disconnect | 200연결 한도만으로 부하 허용을 확정하지 않음. 자동 reconnect는 5초 목표 보증 아님 |
| F10 | [CLI reference](https://supabase.com/docs/reference/cli/introduction#supabase-db-dump)·[Backup/restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) | dump기본범위/data/roles/managedschemas 구별,복원절차 | 기본dump만으로data/Auth/Storage전체복원주장금지. 권한/함수/migration/참가자FK까지별도확인 |

가격·quota 조회일은2026-10-05이다. 공급자 페이지 crawl 시각은 일부이전일로표시됐고 계정전용견적은조회하지 않았다.
Free제한초과의정확한grace기간/차단시점은미확인이다. egress문서는restricted상태의cycle갱신/upgrade해제를설명한다. **Free에Pro초과단가$0.09/GB를대입해추가돈만내면계속가능하다고쓰지 않는다.**
추가조회한quotas/exceeding-usage/understanding-usage경로일부가오류였으므로실패를서비스부재증거로사용하지 않았다. 정확한운영제한은향후공식지원/계정usage화면에서확인한다.

## 2. 월비용 기본 비교

총추가비 = (VM + 외부backup저장 + snapshot + DB증액 + 초과전송 + 기타USD) × 결제KRW/USD × (1+적용세율) + 원화비용.
KRW/USD1400·1500·1600 및 세율10%는 민감도 가정이다. 실환율·세금·카드수수료·domain/monitoring·유료지원·복원비는 미확인. 체험할인 제외.

| 비교조합 | USD기본비 | 1400 /1500 /1600원과10%가정 | 성립조건 |
|---|---:|---|---|
| Seoul1GB VM + object5GB | 8 | 12,320 /13,200 /14,080원 | backup≤5GB/25GBtransfer,DB증액0,100명capacity미증명 |
| Seoul2GB VM + object5GB | 13 | 20,020 /21,450 /22,880원 | budget상기본비후보일뿐,Freequota·G03·부하미해소 |
| Seoul2GB VM + object100GB | 15 | 23,100 /24,750 /26,400원 | backup확장후후보.1600가정시여유3,600원만 |
| Seoul2GB VM + object5GB + snapshot20GB-month가정 | 14 | 21,560 /23,100 /24,640원 | VMsnapshot은원격Supabasebackup대체가아님 |
| Seoul2GB VM + 새SupabasePro,backup미포함 | 37 | 56,980 /61,050 /65,120원 | 월3만원민감도범위에서충돌. 사용자목표를임의로낮추지않음 |

object$1과snapshot가정$1은다른backup용도다. 같은$13이어도CP0054의VMsnapshot20GB조합과이번externaldump조합을동일보장으로쓰지 않는다.
Pro$25에는$10computecredit이있어최소Micro를다시$10합산하지 않는다. 신규DB증액0은사용량이0이라는가정이아니라Free조건을유지하는조건부시나리오다.

$13×1500×1.1=21,450원,남은8,550원=$5.1818. 다른비용없다면SeoulVM추가청구outbound약39.86GB로여유를소진한다. exactprovider meter/inbound순서와모든고정비를확인해야한다.
서버월요금만으로전체3만원준수를확정하지 않는다.

## 3. gameplay·권한gate·Realtime부하 분리

C=활성recipient수,f=수신Hz,b=recipient당전체projection bytes,h=해당평균부하시간.
outboundGB=C×f×b×3600×h/10^9. inbound도동일산식이다. b에room8명이이미반영됐다면8배하지 않는다.
100명은최대목표이고평균C/h는UNKNOWN. 아래maximum-envelope를월사용예측으로변환하지 않는다.

| envelope | 명시가정 | 10시간out/in | 100시간out/in | 730시간out/in |
|---|---|---|---|---|
| L | 100명,out10Hz×256B,in10Hz×64B | 9.216/2.304GB | 92.16/23.04GB | 672.768/168.192GB |
| H | 100명,out20Hz×1024B,in20Hz×64B | 73.728/4.608GB | 737.28/46.08GB | 5,382.144/336.384GB |

VMallowance는2GBSKU3TB(비교용 3000GB)다. L은월730h전체활성payload840.96GB,H는5718.528GB로달라진다.
프로토콜/TLS/retry/Auth/backup/로비/배포다운로드는별도다. 20%overhead가정이면H100h940.032GB,약319.14h에3000GB도달하지만20%는실측아니다.
allowance초과총byte전부를청구outbound로곧바로계산하지않고provider누적in/out계량을따른다.

### 3A. Supabase gate 응답 전송 비교

| envelope | calls/s·응답가정 | 10시간DB응답 | 100시간DB응답 | 730시간DB응답 |
|---|---|---:|---:|---:|
| 저빈도제어대조 | 전체5calls/s×256B | 0.04608GB | 0.4608GB | 3.36384GB |
| A단순개별gate | 100명×20Hz×입출력2=4000calls/s,256B/응답 | 36.864GB | 368.64GB | 2691.072GB |

저빈도5calls/s는전체gameplay의철회를해결하는구현추천이아니다. join/start/result같은제어호출대조값이며,외부C/P가안전한지별도판단해야한다.
256B는실측응답크기가아니다. API/DBprotocol/error/retry비용은추가. 단순A가5GBquota를넘는계산은Free고빈도가능확정을막는근거이지제품불가능의최종판정은아니다.
5GB가전부gate에남고다른사용0이라고가정해도4000gate/s×256B는약1.3563시간에5GB다. 실제기존사이트·backup·Auth소비가있으면더적다.
batch520rpc/s(13방×20Hz×입출력2)로묶어도100명권한검사및구체payload별P검증이사라지지않는다. room당응답size는미정이라batch egress총액은확정하지않았다.

### 3B. Supabase Realtime relay 대조

13방(12×8+4)에서20Hz상태한frame/room,broadcast송신13+수신100이면월message=113×20×3600×h.
10h81.36M,100h813.6M. Free2M는이부하에서약14.75분으로비교된다.
유료Pro대조100h의초과message만ceil((813.6M−5M)/1M)×$2.5=$2022.5,기본료·egress·입력별도.
공식 Free throughput도 100events/s다. 위 relay는 send+receive 2260events/s이며, 송신만 세어도 260/s로 이를 넘는다. 따라서 월 message 계산 이전에 disconnect 제약을 검토해야 한다. Pro 기본 500events/s도 전체2260/s를 지원한다고 볼 수 없다. 이 계산은 허용된 지속 부하나 실행 가능한 Pro 견적이 아닌 한도 비교다.
이는Free초과자동청구견적이아니며고빈도relay를무료200connection문구만으로선택하면안되는근거다.

## 4. 일1회 외부 백업 후보

사용자는목표RPO24h를채택했으나backup제품·보존일수·RTO는미정이다. '일1회실행'과'최신성공backup의consistent cut가24h이내'는별개다.
job완료시각이아니라복원가능한data cut시각을기준으로감시한다. 실패·장기실행·scheduler미실행은24h목표를넘길수있어재시도·경보·실제복원검증이필요하다.

| 후보 | 연결/저장 | 비용·장점 | 한계·추가증거 |
|---|---|---|---|
| B01 | 운영VM에서지원된dump실행→외부objectbucket(Seoul) | $1/5GB또는$3/100GB로비교가능,별도물리저장 | VM정지시job도정지,privatebucket/encryption/leastprivilege·분리된삭제권한·SDK/CLI/Docker·restore시험미확인 |
| B02 | 사용자별도PC/서버에서일일dump→외부저장 | 기존장비면scheduler증분0가정가능,게임VM과job분리 | 전원/네트워크/매일가동/대응미확인. 개인PC수동실행으로RPO24h보장주장불가 |
| B03 | SupabasePro자동dailybackup | 공식daily7일보존,관리부담감소 | 신규$25가3만원과충돌,사용자가채택한'외부'copy까지자동충족아님;다른외부export필요가능 |
| B04 | 같은게임VMdisk에dump만저장 | 임시중간파일로활용가능 | 외부backup요구의완성후보아님,VM손실과동시유실. 선택하려면별도외부copy필수 |

VMsnapshot은VM복원용이며원격DB시점복사아니다. SupabaseStorage같은project에dump를두는것은DB/계정재해와권한침해의격리를증명하지못하므로외부copy대체로확정하지않는다.
objectbucket은외부cloud저장후보일뿐다른account/credential의독립보호를자동보장하지않는다. 가격이맞아도Astra가위협·운영복구범위를판단해야한다.

### 4A. 용량·반출 비용

S=일일dump의실제전송완료bytes(여기서는decimalMB가정),r=보존copy수.
backup저장GB=S×r/1000,월반출GB=S×30/1000(30일비교). 압축률/차등backup효과는UNKNOWN,중복retry/restore읽기는별도.
DB500MB상한이dump항상500MB라는의미아님. schema/index/실data/압축에따라다르다.

| S가정 | 7copy저장 | 30copy저장 | 30일Supabase반출 | Free5GB와비교 |
|---|---:|---:|---:|---|
| 10MB | 0.07GB | 0.3GB | 0.3GB | 다른소비없어도잔여4.7GB인대조 |
| 100MB | 0.7GB | 3GB | 3GB | 다른소비없어도잔여2GB인대조 |
| 500MB | 3.5GB | 15GB | 15GB | backup만으로5GB초과.7copy여도월반출은줄지않음 |

7copy/30copy는가격비교지사용자보존정책채택아님.500MB/30copy는$1bucket5GB범위를넘어$3후보가되지만,외부저장증액만으로Supabase반출초과를해결하지못한다.
신규판수10,000/월×4KiB/판가정은월40.96MB의증분이며full daily dump의S와별개다. 실제판/참가자/index/WAL·사이트총data미확인.

## 5. 복원·삭제·권한 위험의 연결

- 기본CLI dump는managedschemas와data/roles범위가제한된다. 완료기록+participantFK+schema/function/policy/GRANT+실사용identity매핑을복원가능하게보존하는절차가필요하다. 선택schema만backup하면전체사이트/Auth복구를보장했다고쓰지않는다.
- DBbackup은Storage파일본체를포함하지않는다. 게임최소결과에없는이미지/자산까지이번backup범위를확대하지않으며향후사이트복구범위와구별한다.
- 30일삭제와backup보존은별개다. 30일이지난기록이backuprestore로되살아나지않도록삭제기준/이력·필터·restore후검증이필요하다. 탈퇴세부/보존기산점은미정.
- backup에oldsession/profileapproval/owner epoch가있으면Auth철회·oldowner가부활할수있는반례를Astra가검토해야한다. RPO24h허용이보안철회도24h되돌려허용한다는승인아니다.
- 유효한backup존재와실제복원성공은별개다. checksum/manifest·완료표시·암호화key보관·격리restore·권한회귀·최신terminal확인·삭제재적용이필요하다.
- RTO/운영시간·실제최장backup시간·실패시외부scheduler보완은미정이다. Free자동pause중dumpjob이정상동작한다고가정하지않는다.

위항목은근거기반미확인/검증조건이다. Sol이여기서backup알고리즘·schema·deployment를구현하거나Astra선택을대신하지않는다.

## 6. Astra 인수인계 표

| 항목 | 사용자결정/공식근거 | 남은증거·핵심판단 |
|---|---|---|
| G01 | p95 250ms/reconnect5초,모바일기본필수,100명/8명 | 한국PC/모바일실기기·server/gate지연,정확한인수조건. p99등별도수치미채택 |
| G02 | 인가불명즉시차단/pause60초중단 | SDK/retry/cut/gap·권한복구조건·내부종결정합 |
| G03 | session조회지원·JWT잔존·Realtimecache한계 | 외부C/P·managedAuthwriter의일관성,backuprollback와철회영구성 |
| G04 | 본인/필요운영자·30일삭제,daily외부/RPO24h목표 | backup범위/보존/RTO·탈퇴·복원fence·terminal 내구성 |
| G05 | Free서울·usageUNKNOWN,$8/13/15/14/37가격대조 | actual월부하·DB/backupmeter·실견적·runtime/SDK/region/운영구성 |
| G06 | 두Probe규칙적용판단만해소유지 | 새scope추가없이필수안전성·재대결/hostlesssolo계승 |

최종월3만원충족은미확정이다. 먼저Free조건을유지하며안전한조합이있는지판단하고,충돌시근거있는조정안을사용자에게제출한다.100명/8명/권한의무/모바일요구를임의로축소하지않는다.
이번은자료준비제출이며제품채택·계정업그레이드·backup생성·실제지원·정식반영·구현·STEP5A·병합·main반영없이정지한다.

