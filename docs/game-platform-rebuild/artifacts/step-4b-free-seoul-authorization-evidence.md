# STEP4B — Free 서울 환경의 G03 공식 지원 근거·미확인 목록

2026-10-05 KST. 역할: Sol 근거 준비. 입력 [CP0054](../checkpoints/CP-0054-step-4b-preimplementation-conditions.md) / `c51d74f06caa2e8d76b2ba206e9446e749864126`.
[추가 사용자 결정](step-4b-additional-user-decisions.md)은 선보존 commit `2e0f4dd092f6d96c9e0e7051660d4538d8f7fce4` / CP0055.
새 핵심 설계 선택·정식 계약 반영·사후 감사가 아니다.

## 1. 복원·근거 범위

PR412 시작 HEAD가 지정 입력과 일치했고 OPEN/Draft/미병합이었다. 기존 branch와 integration base `3aeae1dfcce7788f88e706dcd49d283b91b67e82`를 유지한다.
AGENTS → 계획1.3 → 기록README → CURRENT → CP0054·DECISIONS → 기존 판단을 대조했다.
CP0054의 사이트153파일 정적 inventory와 R01~10은 이전 고정 입력의 근거로 참조한다. 이번에 소스153개를 다시 읽거나 실DB 최종 정의를 감사했다고 주장하지 않는다.

현재 Free·서울은 사용자 확인 환경이다. Dashboard plan·project ref·잔여 quota·PG/Auth/SDK 버전·기존 배포 SQL을 직접 조회하지 않았다.
C=권위 상태 반영, P=특정 수신자/view/구체 payload의 제공, R=철회 확정 순서라는 기존 정의를 유지한다.
A 안전성 참조/DB 저빈도 우선·B 조건부 HOLD는 이전 판단이며 이번 Sol 작업에서 재선택하지 않는다.

## 2. 공식 지원과 한계

| ID | 공식 원문 | 확인한 지원 사실 | 충족했다고 볼 수 없는 의무 |
|---|---|---|---|
| F01 | [Sessions](https://supabase.com/docs/guides/auth/sessions) §session_id·signout 이후 JWT | JWT의 session_id와 auth.sessions 연결, signout된 session row 부재 검사 | 조회 결과 뒤 외부 C/P의 원자성. row 존재만으로 모든 만료/정책의 현재성이 보장되지 않음 |
| F02 | [Signout](https://supabase.com/docs/guides/auth/signout) §scopes·tokens | global/local/others 범위 구분, refresh 철회 뒤에도 access token은 exp까지 유효 | 서명만 검사하는 외부 서버의 즉시 철회. client wrapper만 경유한다는 보장 |
| F03 | [User management](https://supabase.com/docs/guides/auth/managing-user-data) §deleting users | Auth 삭제 경로·잔존 JWT·Storage 소유에 따른 삭제 조건 | 탈퇴 완료 UX, 모든 운영 writer 참여, 이미 보낸 byte 회수 |
| F04 | [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization) §Updating RLS policies | channel 접근 정책 cache, 연결/새 JWT 때 갱신. 정책 감소 후 기존 연결의 수신 지속 한계 | 채널 RLS만으로 R 이후 새 P 차단. 짧은 JWT가 안전성 면제를 제공하지 않음 |
| F05 | [PostgreSQL locking](https://www.postgresql.org/docs/current/explicit-locking.html) §row locks·deadlocks | 실제 충돌 lock mode와 transaction 내부 직렬화 구성요소 | 외부 메모리 apply/WSS send까지 포함하는 분산 transaction. managed Auth row 지원 보장 |
| F06 | [Database connections](https://supabase.com/docs/guides/database/connecting-to-postgres) §endpoints·poolers | Free direct IPv6, shared pooler IPv4; session/transaction mode 구분 | pooler 연결 가능성이 Auth lock 권한·G03 보증·4000gate/s 처리 능력이라는 뜻 아님 |
| F07 | [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization) §managed schema | realtime schema 객체 변경 제한, 지원된 정책 범위 | managed schema 임의 trigger/index/function 추가가 가능하다는 추론 |
| F08 | [CLI dump](https://supabase.com/docs/reference/cli/introduction#supabase-db-dump)·[Backup/restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) | managed schema·data/roles 범위 구분, 복원 절차의 별도 확인 필요 | dump 파일 하나가 Auth 철회 이력·현재 session·owner fence를 모두 복구한다는 보장 |

공식 문서는 재료를 제공하며 우리 제품의 C/P/R 직렬화를 인증하지 않는다. 공식 current PostgreSQL은18 기준이고 실제 프로젝트 버전은 미확인이다.
이번 원문 확인에서 auth.sessions의 읽기 설명은 확인했으나 외부 서버가 managed Auth 변경과 함께 사용할 수 있는 안정된 잠금/egress barrier 전체에 대한 보장은 확보하지 못했다. 문서 부재를 기술 불가능으로 단정하지 않는다.

[Supabase changelog](https://supabase.com/changelog)의 HTML을 조회했다. changelog.md는 도구의 text/markdown 처리 오류였으며 URL 자체 부재로 쓰지 않는다. 설치된 SDK의 전체 breaking change 영향 감사는 미수행이다. 버전 pin·자동 retry·managed schema 지원은 후속 증거로 남긴다.

## 3. 경계별 미확인·Astra 입력

| ID | 구체 미확인 | 확보할 증거 | Astra가 판단할 핵심 |
|---|---|---|---|
| U01 | 현재 승인·profile/permission writer와 DB C의 충돌 방식 | 실 적용 migration/function/trigger/GRANT, 호출 주체와 transaction trace | R01~03·R10을 빠짐없이 포함할 권위 경계 |
| U02 | Auth signout/관리 삭제·만료가 외부 C/P를 차단하는 시점 | 실제 SDK scope·Auth API/콘솔 경로, session 읽기 권한/지원 lock, concurrent revoke trace | managed Auth writer 참여 또는 동등한 연산별 gate 가능성 |
| U03 | DB 인가→외부 simulation apply 사이 틈 | 특정 command의 C 위치, await/queue/restart/중복 명령 trace | A 기준에 맞는 외부 C adapter 또는 보류 사유 |
| U04 | snapshot 계산→socket release 사이 틈 | recipient/view/payload 고정, 최종 P와 R 순서, app/OS queue·in-flight 범위 | P를 포괄하는 gate와 송신 fence |
| U05 | 유효 mutation의 retry와 private 응답 권한 | C<R 뒤 R 이후 duplicate read, payload mismatch·role/view 교체 trace | mutation once와 새로운 P의 인가 분리 |
| U06 | DB↔server 단절·권한 조회 실패·프로세스 pause | 차단·해당 판 pause·60초 중단, 복귀 시 새 owner/view 검사 | timeout이 철회 유예가 되지 않는지, 내부 cleanup 권한 |
| U07 | old owner 저장과 송신 | durable terminal CAS·old owner reject·WSS 차단 trace | 저장 fencing과 정보 제공 fencing의 연결 |
| U08 | DB 백업 복원으로 옛 철회/epoch가 되살아남 | 과거 session/profile/permission/owner 상태의 restore 반례 | backup rollback 뒤 이전 권한/owner 부활 방지. RPO24h는 철회 후 허용을 승인하지 않음 |
| U09 | 종료기록 삭제·탈퇴와 백업 restore | 30일 삭제 대상·삭제 이력/기준 시점·backups·재시도 명령 | 삭제된 기록/식별정보 재노출 방지, 최소 결과와 Auth 매핑 |
| U10 | Free 자원에서 보안 gate와 품질 목표 양립 | DB latency/lock waits/egress/연결 수·한국PC/모바일 p95 | 100명/8명/250ms/3만원 요구를 지키는 제품 조합 |

해당 판 pause 60초 정책은 사용자 채택이다. 권한 확인 불가 시 새 보호 입력/정보 제공은 즉시 차단한다. 권한 근거가 없는 동안60초를 계속 허용하는 안은 근거자료에 포함하지 않는다.
A/B 선택·lease/lock/SDK/물리배치·runtime framework 선택은 Astra 후속 책임으로 남긴다.

## 4. 증거 인수 수준

- 문서 지원: 위 F01~08의 원문 선택 확인. 지원 범위와 한계를 표시했다.
- 정적 근거: CP0054 고정 source inventory를 참조. 운영 활성 writer 전수 확인은 미완료.
- 설계/계약: U01~10은 아직 미확인. 이번 문서로 채워졌다고 표시하지 않는다.
- 실행: DB·SDK·두 클라이언트·권한 경합·partition·부하·backup restore NOT_RUN.
- 운영: Free quota 실제 여유·purchase·deployment·backup job·production 검증 NOT_RUN.

G03 OPEN/BLOCKING, G01/G02/G04/G05 PARTIAL/OPEN, G06 두 Probe 적용 판단만 해소 유지. 사용자 목표가 정해졌다는 사실만으로 전체 게이트를 닫지 않는다.
다음 입력은 이 문서·[비용/backup](step-4b-free-seoul-cost-backup-evidence.md)·추가결정·CP0056의 최종 제출 SHA이며, 핵심판단은 Astra가 수행한다.

