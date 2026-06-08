-- Up
BEGIN;

-- Khởi tạo schema auth và hàm mock auth.uid() nếu chạy ở môi trường clean/local database không có Supabase
DO $$
BEGIN
    -- Chỉ tạo schema auth giả lập nếu chưa tồn tại (chỉ chạy ở local)
    IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
        CREATE SCHEMA auth;
    END IF;

    -- Chỉ tạo hàm auth.uid() giả lập nếu chưa tồn tại (chỉ chạy ở local)
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'auth' AND p.proname = 'uid'
    ) THEN
        EXECUTE 'CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS ''SELECT NULL::uuid''';
    END IF;
END $$;

-- Bật RLS cho các bảng mới
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- 1. Bảng blogs: Cho phép public đọc các bài viết đã xuất bản và chưa bị xóa
CREATE POLICY "Allow public read access to published blogs" 
ON public.blogs 
FOR SELECT 
TO anon, authenticated 
USING (is_published = true AND deleted_at IS NULL);

-- 2. Bảng orders: Cho phép thương lái truy cập (SELECT/ALL) các đơn hàng thuộc về mình
-- Thương lái được nhận diện qua trường user_id khớp với auth.uid()
CREATE POLICY "Allow merchant access to own orders"
ON public.orders
FOR ALL
TO authenticated
USING (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()))
WITH CHECK (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()));

COMMIT;

-- Down
BEGIN;

-- Tắt RLS cho các bảng
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;

-- Xóa các chính sách (policies)
DROP POLICY IF EXISTS "Allow public read access to published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow merchant access to own orders" ON public.orders;

COMMIT;
