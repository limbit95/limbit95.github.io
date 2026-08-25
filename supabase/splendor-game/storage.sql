-- Splendor private card artwork storage
-- Applied to project: zxwdculpycqvbcfdoxvu
-- Purpose: keep card artwork outside the public GitHub Pages asset tree.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'splendor-card-assets',
  'splendor-card-assets',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- The project already provides private.is_approved_member().
-- Signed URL creation requires SELECT permission on storage.objects.
drop policy if exists "splendor_card_assets_select_approved_members" on storage.objects;

create policy "splendor_card_assets_select_approved_members"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'splendor-card-assets'
  and private.is_approved_member()
);

-- No browser upload/update/delete policy is intentionally granted here.
-- Card artwork is managed through an administrative path, not from the game client.
-- Temporary prototype naming convention:
--   cards/t1-1.webp ... cards/t1-4.webp
--   cards/t2-1.webp ... cards/t2-4.webp
--   cards/t3-1.webp ... cards/t3-4.webp
--
-- The browser requests 15-minute signed URLs. If a private image is absent,
-- the UI renders an original inline SVG fallback illustration instead.
-- Later, splendor_card_catalog.image_path will become the authoritative mapping.
