-- Up
ALTER TABLE products
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160) DEFAULT NULL;

COMMENT ON COLUMN products.meta_description IS 'Mô tả SEO cho thẻ meta description (tối đa 160 ký tự). Nếu để trống, hệ thống sẽ fallback về description.';

-- Down
ALTER TABLE products DROP COLUMN IF EXISTS meta_description;
