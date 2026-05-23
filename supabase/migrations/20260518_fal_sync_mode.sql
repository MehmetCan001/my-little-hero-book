-- fal_requests tablosuna sync mode için gerekli kolonlar
ALTER TABLE fal_requests
  ADD COLUMN IF NOT EXISTS image_url   TEXT,
  ADD COLUMN IF NOT EXISTS status      TEXT DEFAULT 'pending';

-- story_pages_to_render view: fal.ai'dan gelen görsellerle sayfalar
CREATE OR REPLACE VIEW story_pages_to_render AS
SELECT
  fr.story_id,
  fr.page_number,
  fr.page_text,
  fr.image_prompt,
  fr.image_url,
  fr.seed,
  fr.status
FROM fal_requests fr
WHERE fr.image_url IS NOT NULL
ORDER BY fr.story_id, fr.page_number;

-- stories_ready_for_pdf view: tüm sayfaları tamamlanmış hikayeler
CREATE OR REPLACE VIEW stories_ready_for_pdf AS
SELECT
  s.id            AS story_id,
  s.title,
  s.theme,
  s.status        AS story_status,
  s.page_count,
  s.language_id,
  s.image_style_id,
  COUNT(fr.id)    AS completed_pages
FROM stories s
JOIN fal_requests fr
  ON fr.story_id = s.id
 AND fr.image_url IS NOT NULL
WHERE s.status = 'generating'
GROUP BY s.id, s.title, s.theme, s.status, s.page_count, s.language_id, s.image_style_id
HAVING COUNT(fr.id) >= s.page_count;
