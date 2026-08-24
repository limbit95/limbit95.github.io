-- Retire 게임/영화드라마 and add 20 words to each remaining category.
-- Historical round snapshots remain valid because retired word rows are disabled, not deleted.

update public.liar_words
set enabled=false, updated_at=now()
where category in ('게임','영화드라마') and enabled is distinct from false;

with cleaned as (
  select g.id,
         coalesce(array_agg(c order by ord) filter (where c not in ('게임','영화드라마')), array[]::text[]) as categories
  from public.liar_games g
  cross join lateral unnest(g.selected_categories) with ordinality as u(c,ord)
  where g.status in ('setup','active')
  group by g.id
)
update public.liar_games g
set selected_categories = case
  when cardinality(cleaned.categories)=0 then array['음식','장소','직업','동물','물건','인물','스포츠','교통수단','자연','취미','음악','기타']::text[]
  else cleaned.categories
end
from cleaned
where g.id=cleaned.id
  and g.selected_categories is distinct from case
    when cardinality(cleaned.categories)=0 then array['음식','장소','직업','동물','물건','인물','스포츠','교통수단','자연','취미','음악','기타']::text[]
    else cleaned.categories
  end;

-- Keep direct RPC validation aligned with the visible 12-category production list.
create or replace function public.liar_validate_settings(
  p_categories text[], p_difficulty text, p_liar_count integer, p_guess_limit integer
) returns text[]
language plpgsql immutable
set search_path = pg_catalog, public
as $$
declare v_categories text[];
begin
  if p_categories is null
     or p_difficulty is null
     or p_liar_count is null
     or p_guess_limit is null then
    raise exception using message = 'INVALID_GAME_SETTINGS', errcode = 'P0001';
  end if;
  select array_agg(x order by first_pos) into v_categories
  from (
    select x, min(pos) first_pos
    from unnest(p_categories) with ordinality u(x, pos)
    group by x
  ) s;
  if coalesce(cardinality(v_categories), 0) < 1
     or not (v_categories <@ array['음식','장소','직업','동물','물건','인물','스포츠','교통수단','자연','취미','음악','기타']::text[])
     or array_position(v_categories, null) is not null
     or p_difficulty not in ('all','easy','normal','hard')
     or p_liar_count not between 1 and 3
     or p_guess_limit not between 1 and 3 then
    raise exception using message = 'INVALID_GAME_SETTINGS', errcode = 'P0001';
  end if;
  return v_categories;
end;
$$;

revoke all on function public.liar_validate_settings(text[],text,integer,integer)
from public, anon, authenticated;

insert into public.liar_words (category,word,normalized_word,difficulty,enabled)
values
  ('음식','닭갈비','닭갈비','easy',true),
  ('음식','부대찌개','부대찌개','easy',true),
  ('음식','설렁탕','설렁탕','easy',true),
  ('음식','감자탕','감자탕','easy',true),
  ('음식','오므라이스','오므라이스','easy',true),
  ('음식','샐러드','샐러드','easy',true),
  ('음식','타코','타코','easy',true),
  ('음식','도넛','도넛','easy',true),
  ('음식','닭강정','닭강정','normal',true),
  ('음식','육회','육회','normal',true),
  ('음식','곱창','곱창','normal',true),
  ('음식','쌀국수','쌀국수','normal',true),
  ('음식','우동','우동','normal',true),
  ('음식','리조또','리조또','normal',true),
  ('음식','크로플','크로플','normal',true),
  ('음식','팥빙수','팥빙수','normal',true),
  ('음식','콩국수','콩국수','hard',true),
  ('음식','아귀찜','아귀찜','hard',true),
  ('음식','깐풍기','깐풍기','hard',true),
  ('음식','뇨키','뇨키','hard',true),
  ('장소','빵집','빵집','easy',true),
  ('장소','식당','식당','easy',true),
  ('장소','백화점','백화점','easy',true),
  ('장소','서점','서점','easy',true),
  ('장소','놀이터','놀이터','easy',true),
  ('장소','체육관','체육관','easy',true),
  ('장소','주유소','주유소','easy',true),
  ('장소','터미널','터미널','easy',true),
  ('장소','법원','법원','normal',true),
  ('장소','주민센터','주민센터','normal',true),
  ('장소','세탁소','세탁소','normal',true),
  ('장소','문구점','문구점','normal',true),
  ('장소','전시장','전시장','normal',true),
  ('장소','공연장','공연장','normal',true),
  ('장소','공장','공장','normal',true),
  ('장소','연구소','연구소','normal',true),
  ('장소','천문대','천문대','hard',true),
  ('장소','수족관','수족관','hard',true),
  ('장소','식물원','식물원','hard',true),
  ('장소','등대','등대','hard',true),
  ('직업','바리스타','바리스타','easy',true),
  ('직업','우체부','우체부','easy',true),
  ('직업','경비원','경비원','easy',true),
  ('직업','상담사','상담사','easy',true),
  ('직업','공무원','공무원','easy',true),
  ('직업','매니저','매니저','easy',true),
  ('직업','코치','코치','easy',true),
  ('직업','사서','사서','easy',true),
  ('직업','세무사','세무사','normal',true),
  ('직업','회계사','회계사','normal',true),
  ('직업','큐레이터','큐레이터','normal',true),
  ('직업','조경사','조경사','normal',true),
  ('직업','편집자','편집자','normal',true),
  ('직업','성우','성우','normal',true),
  ('직업','영화감독','영화감독','normal',true),
  ('직업','연구원','연구원','normal',true),
  ('직업','감정평가사','감정평가사','hard',true),
  ('직업','도선사','도선사','hard',true),
  ('직업','항공정비사','항공정비사','hard',true),
  ('직업','음향기사','음향기사','hard',true),
  ('동물','다람쥐','다람쥐','easy',true),
  ('동물','거북이','거북이','easy',true),
  ('동물','오리','오리','easy',true),
  ('동물','닭','닭','easy',true),
  ('동물','말','말','easy',true),
  ('동물','소','소','easy',true),
  ('동물','돼지','돼지','easy',true),
  ('동물','양','양','easy',true),
  ('동물','미어캣','미어캣','normal',true),
  ('동물','라쿤','라쿤','normal',true),
  ('동물','치타','치타','normal',true),
  ('동물','표범','표범','normal',true),
  ('동물','물개','물개','normal',true),
  ('동물','바다사자','바다사자','normal',true),
  ('동물','홍학','홍학','normal',true),
  ('동물','공작','공작','normal',true),
  ('동물','오소리','오소리','hard',true),
  ('동물','맨드릴','맨드릴','hard',true),
  ('동물','아르마딜로','아르마딜로','hard',true),
  ('동물','천산갑','천산갑','hard',true),
  ('물건','연필','연필','easy',true),
  ('물건','볼펜','볼펜','easy',true),
  ('물건','책','책','easy',true),
  ('물건','컵','컵','easy',true),
  ('물건','접시','접시','easy',true),
  ('물건','수건','수건','easy',true),
  ('물건','모자','모자','easy',true),
  ('물건','신발','신발','easy',true),
  ('물건','스테이플러','스테이플러','normal',true),
  ('물건','보조배터리','보조배터리','normal',true),
  ('물건','멀티탭','멀티탭','normal',true),
  ('물건','체중계','체중계','normal',true),
  ('물건','전기포트','전기포트','normal',true),
  ('물건','옷걸이','옷걸이','normal',true),
  ('물건','전동칫솔','전동칫솔','normal',true),
  ('물건','블루투스스피커','블루투스스피커','normal',true),
  ('물건','제습기','제습기','hard',true),
  ('물건','공기청정기','공기청정기','hard',true),
  ('물건','전동드릴','전동드릴','hard',true),
  ('물건','압력밥솥','압력밥솥','hard',true),
  ('인물','장보고','장보고','easy',true),
  ('인물','정약용','정약용','easy',true),
  ('인물','윤봉길','윤봉길','easy',true),
  ('인물','안창호','안창호','easy',true),
  ('인물','김홍도','김홍도','easy',true),
  ('인물','신윤복','신윤복','easy',true),
  ('인물','허균','허균','easy',true),
  ('인물','한석봉','한석봉','easy',true),
  ('인물','이중섭','이중섭','normal',true),
  ('인물','나혜석','나혜석','normal',true),
  ('인물','김소월','김소월','normal',true),
  ('인물','백남준','백남준','normal',true),
  ('인물','박완서','박완서','normal',true),
  ('인물','황순원','황순원','normal',true),
  ('인물','김정호','김정호','normal',true),
  ('인물','김만덕','김만덕','normal',true),
  ('인물','최치원','최치원','hard',true),
  ('인물','김시습','김시습','hard',true),
  ('인물','허난설헌','허난설헌','hard',true),
  ('인물','전봉준','전봉준','hard',true),
  ('스포츠','족구','족구','easy',true),
  ('스포츠','피구','피구','easy',true),
  ('스포츠','줄넘기','줄넘기','easy',true),
  ('스포츠','스노보드','스노보드','easy',true),
  ('스포츠','인라인스케이트','인라인스케이트','easy',true),
  ('스포츠','클라이밍','클라이밍','easy',true),
  ('스포츠','카누','카누','easy',true),
  ('스포츠','사격','사격','easy',true),
  ('스포츠','조정','조정','normal',true),
  ('스포츠','하키','하키','normal',true),
  ('스포츠','소프트볼','소프트볼','normal',true),
  ('스포츠','스쿼시','스쿼시','normal',true),
  ('스포츠','레슬링','레슬링','normal',true),
  ('스포츠','유도','유도','normal',true),
  ('스포츠','역도','역도','normal',true),
  ('스포츠','패러글라이딩','패러글라이딩','normal',true),
  ('스포츠','근대5종','근대5종','hard',true),
  ('스포츠','세팍타크로','세팍타크로','hard',true),
  ('스포츠','봅슬레이','봅슬레이','hard',true),
  ('스포츠','스켈레톤','스켈레톤','hard',true),
  ('교통수단','전기차','전기차','easy',true),
  ('교통수단','전기자전거','전기자전거','easy',true),
  ('교통수단','고속버스','고속버스','easy',true),
  ('교통수단','시외버스','시외버스','easy',true),
  ('교통수단','택배차','택배차','easy',true),
  ('교통수단','밴','밴','easy',true),
  ('교통수단','포클레인','포클레인','easy',true),
  ('교통수단','지게차','지게차','easy',true),
  ('교통수단','전차','전차','normal',true),
  ('교통수단','노면전차','노면전차','normal',true),
  ('교통수단','수상택시','수상택시','normal',true),
  ('교통수단','고속선','고속선','normal',true),
  ('교통수단','카약','카약','normal',true),
  ('교통수단','세그웨이','세그웨이','normal',true),
  ('교통수단','행글라이더','행글라이더','normal',true),
  ('교통수단','로켓','로켓','normal',true),
  ('교통수단','쇄빙선','쇄빙선','hard',true),
  ('교통수단','수륙양용차','수륙양용차','hard',true),
  ('교통수단','곤돌라','곤돌라','hard',true),
  ('교통수단','자기부상열차','자기부상열차','hard',true),
  ('자연','해','해','easy',true),
  ('자연','비','비','easy',true),
  ('자연','눈','눈','easy',true),
  ('자연','바람','바람','easy',true),
  ('자연','소나기','소나기','easy',true),
  ('자연','노을','노을','easy',true),
  ('자연','모래','모래','easy',true),
  ('자연','바위','바위','easy',true),
  ('자연','유성','유성','normal',true),
  ('자연','은하수','은하수','normal',true),
  ('자연','해일','해일','normal',true),
  ('자연','우박','우박','normal',true),
  ('자연','이슬','이슬','normal',true),
  ('자연','만','만','normal',true),
  ('자연','반도','반도','normal',true),
  ('자연','습지','습지','normal',true),
  ('자연','툰드라','툰드라','hard',true),
  ('자연','삼각주','삼각주','hard',true),
  ('자연','석회동굴','석회동굴','hard',true),
  ('자연','용암','용암','hard',true),
  ('취미','영화감상','영화감상','easy',true),
  ('취미','음악감상','음악감상','easy',true),
  ('취미','산책','산책','easy',true),
  ('취미','자전거타기','자전거타기','easy',true),
  ('취미','캠핑','캠핑','easy',true),
  ('취미','홈트레이닝','홈트레이닝','easy',true),
  ('취미','노래부르기','노래부르기','easy',true),
  ('취미','반려식물키우기','반려식물키우기','easy',true),
  ('취미','레고조립','레고조립','normal',true),
  ('취미','커피내리기','커피내리기','normal',true),
  ('취미','차마시기','차마시기','normal',true),
  ('취미','가죽공예','가죽공예','normal',true),
  ('취미','향수만들기','향수만들기','normal',true),
  ('취미','영상편집','영상편집','normal',true),
  ('취미','봉사활동','봉사활동','normal',true),
  ('취미','스노클링','스노클링','normal',true),
  ('취미','북바인딩','북바인딩','hard',true),
  ('취미','미니어처제작','미니어처제작','hard',true),
  ('취미','자전거정비','자전거정비','hard',true),
  ('취미','필름현상','필름현상','hard',true),
  ('음악','베이스기타','베이스기타','easy',true),
  ('음악','우쿨렐레','우쿨렐레','easy',true),
  ('음악','리코더','리코더','easy',true),
  ('음악','탬버린','탬버린','easy',true),
  ('음악','실로폰','실로폰','easy',true),
  ('음악','밴드','밴드','easy',true),
  ('음악','앨범','앨범','easy',true),
  ('음악','노래','노래','easy',true),
  ('음악','클라리넷','클라리넷','normal',true),
  ('음악','오보에','오보에','normal',true),
  ('음악','콘트라베이스','콘트라베이스','normal',true),
  ('음악','만돌린','만돌린','normal',true),
  ('음악','아코디언','아코디언','normal',true),
  ('음악','장구','장구','normal',true),
  ('음악','해금','해금','normal',true),
  ('음악','판소리','판소리','normal',true),
  ('음악','메트로놈','메트로놈','hard',true),
  ('음악','즉흥연주','즉흥연주','hard',true),
  ('음악','대위법','대위법','hard',true),
  ('음악','음정','음정','hard',true),
  ('기타','지각','지각','easy',true),
  ('기타','약속','약속','easy',true),
  ('기타','생일파티','생일파티','easy',true),
  ('기타','퇴사','퇴사','easy',true),
  ('기타','재택근무','재택근무','easy',true),
  ('기타','야식','야식','easy',true),
  ('기타','쇼핑','쇼핑','easy',true),
  ('기타','복권','복권','easy',true),
  ('기타','이직','이직','normal',true),
  ('기타','월급날','월급날','normal',true),
  ('기타','택시잡기','택시잡기','normal',true),
  ('기타','길찾기','길찾기','normal',true),
  ('기타','예약','예약','normal',true),
  ('기타','환불','환불','normal',true),
  ('기타','중고거래','중고거래','normal',true),
  ('기타','온라인수업','온라인수업','normal',true),
  ('기타','마감기한','마감기한','hard',true),
  ('기타','비밀번호','비밀번호','hard',true),
  ('기타','품절','품절','hard',true),
  ('기타','분실물','분실물','hard',true)
on conflict (category,normalized_word) do update
set word=excluded.word,
    difficulty=excluded.difficulty,
    enabled=true,
    updated_at=now();
