-- Up
-- Thêm bucket blogs vào table buckets nếu chưa tồn tại
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'blogs', 
    'blogs', 
    true, 
    5242880, -- Giới hạn 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Cho phép đọc công khai (public read access) cho tệp trong bucket blogs
DROP POLICY IF EXISTS "Public Access to blogs bucket" ON storage.objects;
CREATE POLICY "Public Access to blogs bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'blogs');

-- Cho phép tất cả người dùng (authenticated/anon/service_role) upload lên bucket blogs
DROP POLICY IF EXISTS "Upload Access to blogs bucket" ON storage.objects;
CREATE POLICY "Upload Access to blogs bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blogs');

-- Cho phép update/delete tệp trong bucket blogs
DROP POLICY IF EXISTS "Update Access to blogs bucket" ON storage.objects;
CREATE POLICY "Update Access to blogs bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blogs');

DROP POLICY IF EXISTS "Delete Access to blogs bucket" ON storage.objects;
CREATE POLICY "Delete Access to blogs bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'blogs');

-- Down
DROP POLICY IF EXISTS "Public Access to blogs bucket" ON storage.objects;
DROP POLICY IF EXISTS "Upload Access to blogs bucket" ON storage.objects;
DROP POLICY IF EXISTS "Update Access to blogs bucket" ON storage.objects;
DROP POLICY IF EXISTS "Delete Access to blogs bucket" ON storage.objects;
-- Không thể xóa trực tiếp dòng trong storage.buckets bằng SQL DELETE do trigger của Supabase chặn để tránh orphaned objects. 
-- Việc xóa bucket cần được thực hiện qua Storage API hoặc Supabase Dashboard.
