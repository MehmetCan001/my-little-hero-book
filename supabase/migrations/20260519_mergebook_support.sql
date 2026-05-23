-- fal_requests tablosuna sayfa PDF yolu için kolon ekle
ALTER TABLE fal_requests
  ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- bump_counter_and_maybe_merge: her sayfa PDF'i yüklendiğinde çağrılır.
-- Tüm sayfalar bitince hikayeyi 'completed' olarak işaretler.
CREATE OR REPLACE FUNCTION bump_counter_and_maybe_merge(
  p_story_id    UUID,
  p_page_number INTEGER,
  p_pdf_path    TEXT
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_page_count  INTEGER;
  v_done_count  INTEGER;
BEGIN
  -- Bu sayfanın PDF yolunu kaydet
  UPDATE fal_requests
     SET pdf_url = p_pdf_path
   WHERE story_id = p_story_id
     AND page_number = p_page_number;

  -- Hikayenin toplam sayfa sayısını al
  SELECT page_count INTO v_page_count
    FROM stories
   WHERE id = p_story_id;

  -- Kaç sayfanın PDF'i var?
  SELECT COUNT(*) INTO v_done_count
    FROM fal_requests
   WHERE story_id = p_story_id
     AND pdf_url IS NOT NULL;

  -- Tüm sayfalar tamamlandıysa hikayeyi bitir
  IF v_done_count >= v_page_count THEN
    UPDATE stories
       SET status = 'completed'
     WHERE id = p_story_id
       AND status = 'generating';

    RETURN jsonb_build_object(
      'merged',      true,
      'story_id',    p_story_id,
      'pages_done',  v_done_count,
      'pages_total', v_page_count
    );
  END IF;

  RETURN jsonb_build_object(
    'merged',      false,
    'story_id',    p_story_id,
    'pages_done',  v_done_count,
    'pages_total', v_page_count
  );
END;
$$;

-- stories_ready_for_pdf view: tüm görselleri hazır, henüz PDF üretilmemiş hikayeler
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
 AND fr.status = 'completed'
WHERE s.status = 'generating'
GROUP BY s.id, s.title, s.theme, s.status, s.page_count, s.language_id, s.image_style_id
HAVING COUNT(fr.id) >= s.page_count;
