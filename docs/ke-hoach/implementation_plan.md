# Kế hoạch Tạo Bucket 'blogs' chế độ Public trên Supabase Storage

Kế hoạch này thực hiện tạo bucket `blogs` ở chế độ Public trên Supabase Storage bằng cách tạo một tệp SQL migration mới. Tệp này sẽ thêm bản ghi tương ứng vào bảng `storage.buckets` và thiết lập các chính sách RLS cần thiết để hỗ trợ đọc/ghi ảnh bìa của bài viết blog.

---

## User Review Required

> [!IMPORTANT]
> **Các thay đổi về Cơ sở dữ liệu và Storage:**
> 1. Tạo tệp migration mới `db/migrations/010_create_blogs_storage_bucket.sql`.
> 2. Thực thi SQL chèn cấu hình bucket `blogs` với chế độ Public (`public = true`) và dung lượng tối đa 5MB.
> 3. Thiết lập chính sách bảo mật Row Level Security (RLS) cho phép:
>    - Mọi người đọc ảnh công khai (`SELECT`).
>    - Quyền đăng tải (`INSERT`), sửa đổi (`UPDATE`), xóa (`DELETE`) các tệp trong bucket `blogs`.
> 4. Chạy lệnh migration để cập nhật database lên Supabase production thông qua lệnh `npm run db:migrate`.

---

## Open Questions

> [!NOTE]
> * Không có câu hỏi nào cần trả lời thêm. Chúng tôi sẽ tiến hành thực hiện ngay sau khi bạn đồng ý (click nút **Proceed**).

---

## Proposed Changes

### Database Migrations

#### [NEW] [010_create_blogs_storage_bucket.sql](file:///e:/Web-Seo/db/migrations/010_create_blogs_storage_bucket.sql)

Tạo file migration mới với nội dung SQL như sau:

```sql
-- Up
-- Đảm bảo schema storage và table buckets tồn tại (phòng trường hợp chạy local test sạch)
CREATE SCHEMA IF NOT EXISTS storage;

-- Đảm bảo bảng storage.buckets tồn tại
CREATE TABLE IF NOT EXISTS storage.buckets (
    id text PRIMARY KEY,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autofit boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[]
);

-- Đảm bảo bảng storage.objects tồn tại
CREATE TABLE IF NOT EXISTS storage.objects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    bucket_id text REFERENCES storage.buckets(id),
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED
);

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
DELETE FROM storage.buckets WHERE id = 'blogs';
```

---

## Verification Plan

### Automated Tests

- Chạy lệnh `npm run type-check` và `npm run lint` để kiểm tra mã nguồn TypeScript.
- Thực hiện chạy migration bằng cách đề xuất lệnh:
  `npm run db:migrate`
- Kiểm tra tính đúng đắn của việc tải lên bằng API bằng cách kiểm tra phản hồi từ upload API.

### Manual Verification

- Sử dụng trang quản trị admin để đăng tải/cập nhật ảnh bìa của một bài viết.
- Xác nhận ảnh được upload thành công lên Supabase Storage và hiển thị chính xác trên giao diện blog.
