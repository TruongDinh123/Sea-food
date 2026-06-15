# Walkthrough - Tích hợp Trình Soạn Thảo WYSIWYG TipTap Editor cho Blog Content

Phiên làm việc ngày: 2026-06-15  
Trạng thái: **Hoàn tất (100%) & Đã Kiểm Thử Nội Bộ**  
Nhánh Git đề xuất: `feature/tiptap-blog-editor`

---

## 🚀 Tính năng & Giao diện mới

Chúng ta đã tích hợp trình soạn thảo WYSIWYG **TipTap Editor** vào trang quản trị viết bài Blog, thay thế hoàn toàn Textarea Markdown cũ:
* **Giao diện soạn thảo trực quan (WYSIWYG):** Người dùng có thể bôi đen chữ để chọn các định dạng in đậm, in nghiêng, tiêu đề (H2, H3), danh sách (Bullet/Ordered list), trích dẫn (Blockquote), chèn liên kết trực quan.
* **Tự động chuyển đổi Markdown (Hai chiều):** 
  * Khi người dùng viết nội dung dưới dạng Rich Text, plugin `tiptap-markdown` sẽ tự động chuyển đổi thành cấu trúc Markdown thô chuẩn để gửi lên API lưu vào Database.
  * Khi mở một bài viết cũ để sửa, TipTap tự động nhận Markdown từ Database và hiển thị thành giao diện Rich Text trực quan.
* **Tải ảnh trực tiếp:** Tích hợp nút upload ảnh trên toolbar. Khi người dùng click tải ảnh, hệ thống tự động gọi API `/api/blogs/upload` để upload ảnh lên Supabase Storage và tự chèn ảnh vào vị trí con trỏ của trình soạn thảo dưới dạng Rich Text image.
* **Tương thích hoàn toàn:** 
  * Live Preview bên phải vẫn hoạt động bình thường (do nhận dữ liệu markdown được emit ra từ TipTap).
  * Giữ nguyên 100% cấu trúc Database và Backend hiện có, không ảnh hưởng đến API hay logic của các trang public.

---

## 🛠️ Các tệp được tạo mới và sửa đổi

### 1. Thành phần UI mới
* **[NEW] [TipTapEditor.tsx](file:///e:/Web-Seo/src/components/ui/TipTapEditor.tsx):** Component trình soạn thảo chứa cấu hình Editor, extensions (StarterKit, Markdown, Link, Image, Placeholder), toolbar UI sử dụng Tailwind CSS và các nút tính năng.

### 2. Sửa đổi Giao diện Viết Bài
* **[MODIFY] [BlogEditor.tsx](file:///e:/Web-Seo/src/components/features/BlogEditor.tsx):** 
  * Import động `TipTapEditor` thông qua Next.js `dynamic(() => import(...), { ssr: false })` để ngăn lỗi render phía máy chủ.
  * Thay thế textarea thô bằng `<TipTapEditor value={content} onChange={setContent} />`.
  * Dọn dẹp các hook/hàm chèn markdown thô không còn cần thiết, giúp code sạch và dễ duy trì hơn.

---

## 🧪 Kết quả kiểm thử chất lượng (Quality Assurance)

* **Type Check (`npm run type-check`):** **PASS** (0 errors) ✅.
* **ESLint (`npm run lint`):** **PASS** (0 errors, 0 warnings trong source code) ✅.
* **Unit Tests (`npx vitest run`):** **PASS** (115/115 tests passed) ✅.

---

## 📈 Kế hoạch tiếp theo
1. Commit các thay đổi và tạo Pull Request lên nhánh `feature/tiptap-blog-editor`.
2. Hướng dẫn quản trị viên cách sử dụng editor mới (soạn thảo trực quan, upload ảnh chỉ bằng 1 cú click chuột).
