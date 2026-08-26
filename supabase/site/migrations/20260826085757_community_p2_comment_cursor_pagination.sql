create unique index if not exists comments_prayer_reaction_unique_idx
on public.comments (target_id, author_id)
where target_type = 'post'
  and status = 'published'
  and content = '__PRAYER_TOGETHER__';

create index if not exists comments_target_published_id_desc_idx
on public.comments (target_type, target_id, id desc)
where status = 'published';
