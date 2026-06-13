-- Up
-- Thêm bucket products vào table buckets nếu chưa tồn tại
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'products', 
    'products', 
    true,                -- Chế độ Public: cho phép đọc không cần xác thực
    5242880,             -- Giới hạn 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Cho phép đọc công khai (public read access) cho tệp trong bucket products
DROP POLICY IF EXISTS "Public Access to products bucket" ON storage.objects;
CREATE POLICY "Public Access to products bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Cho phép upload lên bucket products (authenticated/anon/service_role)
DROP POLICY IF EXISTS "Upload Access to products bucket" ON storage.objects;
CREATE POLICY "Upload Access to products bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

-- Cho phép update tệp trong bucket products
DROP POLICY IF EXISTS "Update Access to products bucket" ON storage.objects;
CREATE POLICY "Update Access to products bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products');

-- Cho phép delete tệp trong bucket products
DROP POLICY IF EXISTS "Delete Access to products bucket" ON storage.objects;
CREATE POLICY "Delete Access to products bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');

-- Down
DROP POLICY IF EXISTS "Public Access to products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Upload Access to products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Update Access to products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Delete Access to products bucket" ON storage.objects;
-- Không xóa bucket bằng SQL DELETE — cần dùng Storage API hoặc Supabase Dashboard.
