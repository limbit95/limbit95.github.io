-- 청파 같이 초기 활동 카테고리
-- baseline SQL 실행이 성공한 뒤 Supabase SQL Editor에서 실행한다.

begin;

insert into public.activity_categories (
    name,
    icon,
    color,
    description,
    is_active
)
values
    (
        '러닝',
        '🏃',
        '#2F6B4F',
        '가볍게 뛰는 모임부터 함께 도전하는 러닝 일정까지 나눠요',
        true
    ),
    (
        '클라이밍',
        '🧗',
        '#FF826B',
        '초보자 체험과 실내외 클라이밍 일정을 함께해요',
        true
    ),
    (
        '산책',
        '🚶',
        '#79A88E',
        '동네와 공원, 한강을 천천히 걸으며 이야기 나눠요',
        true
    ),
    (
        '자전거',
        '🚲',
        '#4D96A9',
        '가벼운 라이딩부터 장거리 코스까지 함께 달려요',
        true
    ),
    (
        '영화',
        '🎬',
        '#9B8AFB',
        '함께 보고 싶은 영화를 정하고 관람 일정을 나눠요',
        true
    ),
    (
        '전시·공연',
        '🎨',
        '#F4C95D',
        '전시회와 공연, 문화 행사를 함께 관람해요',
        true
    ),
    (
        '보드게임',
        '🎲',
        '#C77966',
        '처음 하는 사람도 편하게 참여할 수 있는 보드게임 모임이에요',
        true
    ),
    (
        '맛집·카페',
        '☕',
        '#B9825A',
        '맛있는 음식과 새로운 카페를 함께 찾아가요',
        true
    ),
    (
        '스포츠',
        '⚽',
        '#3B82F6',
        '구기 종목과 관람 등 다양한 스포츠 활동을 함께해요',
        true
    ),
    (
        '기타',
        '✨',
        '#6B7280',
        '기존 카테고리에 속하지 않는 즐거운 활동을 자유롭게 나눠요',
        true
    )
on conflict (name) do update
set icon = excluded.icon,
    color = excluded.color,
    description = excluded.description,
    is_active = excluded.is_active;

commit;
