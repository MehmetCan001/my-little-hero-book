-- stories tablosuna pdf_url ve updated_at kolonu ekle (yoksa)
ALTER TABLE stories
  ADD COLUMN IF NOT EXISTS pdf_url    TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- stories tablosu için Realtime'ı aktif et
-- (Supabase Dashboard → Database → Replication → stories tablosunu seç)
-- Bu SQL bunu doğrudan yapamaz; Dashboard'dan manuel etkinleştir.

-- Fal requests: fal_model kolonu (HeroTalesV2 uyumu)
ALTER TABLE fal_requests
  ADD COLUMN IF NOT EXISTS fal_model TEXT;
