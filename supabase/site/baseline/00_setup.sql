-- 청파 같이 본 사이트 baseline: 공통 스키마 준비
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- RLS 정책에서 권한을 안전하게 확인하기 위한 비공개 스키마이다.
-- Supabase API의 Exposed schemas 목록에 private 스키마를 추가하지 않는다.
create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon;
grant usage on schema private to authenticated;

commit;
