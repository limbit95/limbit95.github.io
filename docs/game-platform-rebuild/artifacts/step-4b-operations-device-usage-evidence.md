# STEP4B — 운영 시간·시험 대상·사용량 관측 근거

2026-10-06 KST. 고정 입력 CP0060 `c1f1c41d3f3cb7de160f529ad7e6c50215e93d22`. PR412 시작 HEAD 일치, 추가 변경0. 사용자 “그래 다음 단계 진행하자”를 다음 Sol 읽기 전용 근거 준비·기록 제출 범위로 적용한다. [후속 자료](step-4b-support-followup-preparation.md)·[검증](step-4b-operations-evidence-validation.md).

## 1. 사용자 정보와 채택 범위

| 항목 | 사용자 제공/채택 | 남은 확인 |
|---|---|---|
| 대응 가능 시간 | 평일 20:00~24:00, 주말 “풀”, 한국 시간 Asia/Seoul | 주말은 시간 제약 없이 대응 가능하다는 진술. 수면 중 알림 인지·24시간 지속 모니터링·항상 즉시 착수 보장으로 확대하지 않음 |
| PC | Windows 10·11 | 각 시험기의 보유/접근 가능 여부·OS build·사양·브라우저 버전 |
| 모바일 | 개인 iPhone, 사용자 표기 iOS 18.7.8 | 모델·실제 OS 화면·Safari build/시험 시점 |
| 기본 브라우저 | 사용자 “추천대로 해줘”: Windows Chrome·Edge, iPhone Safari 채택 | 각 조합의 시험 환경 고정, Android/다른 브라우저 지원 제외 정책 승인 아님 |
| 기존 사용량 | 첨부 Dashboard 수치 확인 | 현재 주기 중 관측값만 KNOWN_OBSERVATION; 월 최종치·개방 후 workload UNKNOWN |

평일 00:00 직후 발견→20:00 착수 가정은 최대 대기 약20h이고, 발견후24h 목표의 남은 예산은 약4h다. 요일별 가용 시간에 실제로 즉시 착수할 수 있고 다음 평일20시까지 경보를 놓치지 않는다는 조건의 계산이다. 수면·외출·공휴일·예외 및 대체 담당은 UNKNOWN. 주말 “풀”을 최악 대기0/상시 대응으로 계산하지 않는다. 발견과 담당 인지/착수 시각을 각각 남기고 출근 시각으로 발견 시각을 바꾸지 않는다.

## 2. 사용량 캡처 원천

| 원천 | 수신 시각 KST/파일 | 역할 |
|---|---|---|
| A | 2026-10-06 10:56, image(1).png, 첨부 file_00000000a8e48209b04a8711149e9fd5 | 기간 없는 Usage Summary, Storage 0.004GB 관측 |
| B | 2026-10-06 11:13 이전, image(2).png, 첨부 file_0000000083048209b7f4db5b3d6ddb1d | Current billing cycle/All projects/Free와 기간, Storage 0.003GB |
| C | 같은 사용자 제출, image(3).png, 첨부 file_000000000b4082079dab9dd4bee5e212 | Database 보고서 CPU/메모리/IO 활동량 |
| D | 2026-10-06 11:14, image(4).png, 첨부 file_000000008d648207a8f8919dc58035fb | Disk Usage·DB Size·연결 수 |

원본 이미지는 사용자 첨부로 보존되어 있으며 저장소에는 비밀없는 판독값과 출처 식별을 기록한다. 캡처 생성 시각·보고서 timezone·refresh 지연·Organization/project 이름은 사진만으로 전부 확정할 수 없다. B는 All projects 집계다. connector의 project ref와 캡처 프로젝트가 동일하다는 별도 UI 식별 증거는 없으므로 프로젝트 단독 사용량으로 전용하지 않는다. A/B Storage 차이 원인(시간·평균·집계·반올림 등)은 미확인이다.

| Usage 항목 | B 화면 값 | 화면 한도 | 의미 |
|---|---:|---:|---|
| billing cycle | 2026-09-30~2026-10-30 | Free | 진행 중 기간, 완료된 한 달 아님 |
| Database Size | 0.055GB (11%) | 0.5GB | 조직 Usage 표시값, live DB/dump 크기와 다름 |
| Storage Size | 0.003GB | 1GB | A의 0.004GB와 각각 관측 보존 |
| Egress | 0.026GB | 5GB | 현재 기간 반출 누계 표시, 미래 소비0 아님 |
| Cached Egress | 0.001GB | 5GB | uncached와 별도, backup용 합산10GB 가정 금지 |
| Realtime peak | 4 (2%) | 200 | 현재 관측 최고값, game100 처리능력 아님 |
| Realtime messages | 920 | 2,000,000 | 기존 소비 반영 |
| MAU | 5 | 50,000 | 접속100 요구/성능 증거 아님 |
| Edge invocations | 19 | 500,000 | 기타 소비 경로 |
| Log ingestion (UPCOMING) | 0.012GB | 1GB | 표시값일 뿐 채택 logging 제품/실청구 증거 아님 |
| Log query (UPCOMING) | 0 | 100GB | 이 항목 표시0을 전체 사용량0으로 확대하지 않음 |
| Third-party MAU | 0 | 50,000 | 해당 표시 범위만0 |
| SSO/Image transformations | unavailable | Free | 새 제품 채택 없음 |

| D 보고서 | 표시값 | 관측 기간 |
|---|---:|---|
| Database connections | 5 | 2026-10-06 10:12~11:12, 화면 시계 기준 |
| Disk Usage | 318.37MB | 동일 보고서 |
| Database space used | 0.05GB | live/report 값, Usage0.055와 동등치 주장 금지 |
| Provisioned disk size | 8GB | 할당 디스크, Free DB quota0.5GB와 별도 |
| System/WAL/Database 세부 bytes | UNKNOWN | legend 확인, tooltip 수치 없음 |

C의 CPU/메모리/IO 차트는 현재 활동량 관측이지 100명 부하 시험이 아니다. 전체disk318.37MB를 export 크기로 쓰지 않고, live DB0.05GB나 Usage0.055GB를 실제 압축 dump 크기로 쓰지 않는다.

## 3. 요구 유지

총접속100명·판8명·세금 포함 월추가30,000원, p95 반응250ms·정상망 회복후 재연결5초, 모바일 이동/상호작용/준비/종료/재접속 필수·연출 축소 허용을 유지한다. 권한 불명시 보호 입력·정보 제공 즉시 차단→해당 판 pause→최초 장애60초 deadline 전 복구 실패시 중단, 60초 인가 유예 없음.

본인 참가 판/필요 운영자만 종료 기록 열람, 최초 권위 종결+30일 삭제·탈퇴 본인 식별 연결 제거, 하루1회 외부 backup·RPO24h 목표·DB 재해 발견후24h 수동복구 목표·최근7일 복구점/30일 삭제 우선을 유지한다. full dump 개인정보 추가 보존·철회24h 되돌림·무기한 tombstone·p99/tick/queue 합격선·실제 복구 지원 완료를 승인하지 않았다.
