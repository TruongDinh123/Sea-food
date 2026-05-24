-- Up
BEGIN;

ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_logs ENABLE ROW LEVEL SECURITY;

-- 1. Bảng merchants: Cho phép công chúng đọc vựa hải sản đang hoạt động
CREATE POLICY "Allow public read access to merchants" 
ON public.merchants 
FOR SELECT 
TO anon, authenticated 
USING (deleted_at IS NULL AND is_active = true);

-- 2. Bảng products: Cho phép công chúng đọc sản phẩm đang hiển thị
CREATE POLICY "Allow public read access to products" 
ON public.products 
FOR SELECT 
TO anon, authenticated 
USING (deleted_at IS NULL);

-- 3. Bảng referral_logs:
-- Giữ chế độ RLS mặc định không cho phép public/authenticated đọc hoặc ghi trực tiếp qua REST API.
-- Mọi truy xuất hoặc cập nhật log sẽ đi qua server-side / direct connection.

COMMIT;

-- Down
BEGIN;

ALTER TABLE public.merchants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_logs DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to merchants" ON public.merchants;
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;

COMMIT;
