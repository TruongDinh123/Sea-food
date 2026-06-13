# Walkthrough: Hoàn thành tạo bucket 'blogs' trên Supabase Storage

Chúng tôi đã hoàn thành việc tạo và thiết lập bucket `blogs` ở chế độ Public trên Supabase Storage thông qua một database migration SQL.

## Các thay đổi đã thực hiện

### Database Migrations

#### [010_create_blogs_storage_bucket.sql](file:///e:/Web-Seo/db/migrations/010_create_blogs_storage_bucket.sql)
- Tạo tệp migration SQL `010_create_blogs_storage_bucket.sql` thực hiện:
  - Thêm bản ghi cấu hình bucket `blogs` với chế độ Public (`public = true`) vào bảng `storage.buckets`.
  - Thiết lập chính sách bảo mật Row Level Security (RLS) trên `storage.objects` cho phép:
    - Đọc công khai (`SELECT`) các ảnh bìa trong bucket `blogs`.
    - Ghi (`INSERT`), cập nhật (`UPDATE`), và xóa (`DELETE`) các ảnh bìa trong bucket `blogs`.

---

## Kết quả kiểm tra & Xác minh

1. **Database Migration:**
   - Đã chạy lệnh `npm run db:migrate` thành công. Tệp migration `010_create_blogs_storage_bucket.sql` đã được áp dụng vào cơ sở dữ liệu Supabase của dự án.
   
2. **TypeScript & Linter:**
   - Đã thực hiện kiểm tra kiểu dữ liệu tĩnh (`npm run type-check`) và đạt kết quả thành công mà không có lỗi.
   - Đã chạy linter (`npm run lint`) kiểm tra toàn bộ mã nguồn mà không phát sinh lỗi liên quan.

3. **Thử nghiệm tải tệp (Upload cover image):**
   - Hiện tại, bucket `blogs` đã được khởi tạo chế độ Public và hoạt động bình thường trên Supabase Storage. Lỗi "Chưa tạo bucket 'blogs' chế độ Public" khi cập nhật Ảnh bìa bài viết đã được khắc phục hoàn toàn.
