-- Up
-- Thêm các trường SEO vào bảng blogs
ALTER TABLE blogs
  ADD COLUMN IF NOT EXISTS focus_keyword TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS canonical_url TEXT DEFAULT NULL;

-- Thêm các trường SEO và nội dung chi tiết vào bảng products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS focus_keyword TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS canonical_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS description_detail TEXT DEFAULT NULL;

-- Down
ALTER TABLE blogs
  DROP COLUMN IF EXISTS focus_keyword,
  DROP COLUMN IF EXISTS canonical_url;

ALTER TABLE products
  DROP COLUMN IF EXISTS focus_keyword,
  DROP COLUMN IF EXISTS canonical_url,
  DROP COLUMN IF EXISTS description_detail;
