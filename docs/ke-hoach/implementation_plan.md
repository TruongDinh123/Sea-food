# Kế hoạch Tích hợp Trình Soạn Thảo WYSIWYG TipTap cho Blog Content

Kế hoạch này thực hiện thay thế Textarea Markdown hiện tại bằng trình soạn thảo trực quan **TipTap Editor** trong trang quản trị viết bài (`BlogEditor`). TipTap sẽ cung cấp trải nghiệm soạn thảo giống như Microsoft Word hay Google Docs cho người dùng phổ thông, đồng thời tự động chuyển đổi dữ liệu soạn thảo thành định dạng **Markdown** trước khi lưu vào Database, đảm bảo giữ nguyên cấu trúc dữ liệu Backend hiện tại.

---

## User Review Required

> [!IMPORTANT]
> **Các thư viện sẽ được cài đặt:**
> Chúng ta sẽ cài đặt thêm các npm packages phục vụ cho Rich Text Editor:
> * `@tiptap/react` & `@tiptap/core`: Thư viện cốt lõi của TipTap dành cho React.
> * `@tiptap/starter-kit`: Bộ công cụ cơ bản (Bold, Italic, Ordered List, Bullet List, Heading H2/H3/H4, Paragraph, Blockquote, Undo/Redo).
> * `tiptap-markdown`: Plugin tự động chuyển đổi Rich Text thành Markdown khi xuất ra và ngược lại khi load vào.
> * `@tiptap/extension-link`: Hỗ trợ thêm/sửa liên kết (Hyperlink) trực quan.
> * `@tiptap/extension-image`: Hỗ trợ chèn và quản lý hình ảnh trong bài viết.
> * `@tiptap/extension-placeholder`: Hiển thị văn bản gợi ý (placeholder) khi nội dung trống.
>
> **Tương thích SSR (Server-Side Rendering):**
> TipTap truy cập trực tiếp vào đối tượng `window` và `document` của trình duyệt. Do đó, component `TipTapEditor` sẽ được bọc và load động qua `next/dynamic` với tùy chọn `{ ssr: false }` để tránh lỗi biên dịch phía server.

---

## Proposed Changes

### 1. Thành phần UI mới (Components)

#### [NEW] [TipTapEditor.tsx](file:///e:/Web-Seo/src/components/ui/TipTapEditor.tsx)
Tạo component trình soạn thảo Rich Text tái sử dụng với các chức năng chính:
* Thanh công cụ (Toolbar) được thiết kế theo **Design System** (Teal / Amber tones, các nút bấm có tooltip, micro-animations mượt mà).
* Hỗ trợ gõ Rich Text và tự động emit dữ liệu Markdown qua callback `onChange`.
* Tích hợp hộp thoại chèn link nhanh và tích hợp trực tiếp với API upload ảnh hiện tại của dự án để tải ảnh lên Supabase Storage và chèn vào vùng soạn thảo.

### 2. Sửa đổi Giao diện Viết Bài (Features)

#### [MODIFY] [BlogEditor.tsx](file:///e:/Web-Seo/src/components/features/BlogEditor.tsx)
* Import component `TipTapEditor` bằng cơ chế Dynamic Import:
  ```typescript
  const TipTapEditor = dynamic(() => import('../ui/TipTapEditor'), { ssr: false });
  ```
* Thay thế thẻ `<textarea id="content" ...>` cũ bằng `<TipTapEditor value={content} onChange={setContent} />`.
* Đồng bộ cơ chế upload ảnh trực tiếp: Khi kéo thả hoặc chọn ảnh từ toolbar của TipTap, editor sẽ tự động gọi API `/api/blogs/upload` để upload lên Supabase Storage và chèn ảnh vào văn bản dưới định dạng Markdown image.

---

## Verification Plan

### Automated Tests
* Chạy `npm run type-check` để đảm bảo không lỗi kiểu dữ liệu mới.
* Chạy `npm run lint` kiểm tra chuẩn mã nguồn.
* Chạy `npx vitest run` đảm bảo các unit test hiện có cho `BlogService` vẫn pass 100%.

### Manual Verification
1. Mở trang quản trị tạo/sửa bài viết Blog.
2. Kiểm tra giao diện thanh công cụ soạn thảo của TipTap xem có hoạt động đúng không:
   * Bôi đen chữ và chọn Bold (Ctrl+B), Italic (Ctrl+I).
   * Chọn Heading 2, Heading 3 và kiểm tra xem khi lưu vào DB có xuất ra đúng định dạng `##` và `###` không.
   * Tạo danh sách (Bullet/Ordered List) và trích dẫn (Blockquote).
3. Sử dụng chức năng **Chèn ảnh**: tải một ảnh từ máy tính lên, đảm bảo ảnh hiển thị ngay lập tức trong vùng soạn thảo TipTap và link ảnh trỏ về CDN Supabase Storage.
4. Nhấn **Lưu bài viết** và mở trang bài viết ngoài Public để xem nội dung có hiển thị chuẩn xác, bao gồm cả mục lục TOC tự động cập nhật từ các Heading.
