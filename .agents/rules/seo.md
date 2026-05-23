# rule: seo
# description: Quy tắc tối ưu SEO tổng thể và sử dụng thẻ HTML chuẩn Google
# glob: src/app/**/*, src/pages/**/*, src/components/**/*
# ---

# 🔍 Quy Tắc SEO Tổng Thể & Sử Dụng Thẻ HTML

Quy tắc này tự động áp dụng khi chỉnh sửa hoặc tạo các component trang, bố cục, hoặc thành phần hiển thị.

---

## 1. Liên Kết Tĩnh & Anchor Text (Rất Quan Trọng)

*   **Bắt buộc dùng `<a href>` tĩnh:** Hoặc `<Link>` của Next.js (bản chất render ra `<a href>`). **Tuyệt đối không** dùng sự kiện click Javascript (`onclick`) để chuyển hướng người dùng/robot.
*   **Anchor Text rõ nghĩa:** Anchor text phải mô tả trực tiếp nội dung hoặc tên sản phẩm ở đích đến. Không dùng các từ chung chung như "nhấp vào đây", "xem thêm", "tại đây".
*   **Không dùng Fragment `#` cho nội dung chính:** Googlebot bỏ qua tất cả nội dung sau dấu `#`. Sử dụng URL sạch dạng `/san-pham/tom-su-song/`.

---

## 2. On-Page SEO Checklist

*   **Mỗi trang phải có:**
    *   Thẻ `<title>` và `<meta name="description">` riêng biệt, không trùng lặp (120-160 ký tự cho description).
    *   Một thẻ `<h1>` duy nhất chứa từ khóa chính của trang.
    *   Thẻ `<link rel="canonical">` tự trỏ về chính nó (self-referencing canonical). Đối với phân trang, mỗi trang (page 2, page 3) tự canonical về chính URL chứa query phân trang đó.
*   **Next.js Metadata:** Sử dụng Metadata API của Next.js (`generateMetadata`) để render tự động trên server.
*   **Hình ảnh:** Mọi thẻ `<img>` hoặc `<Image>` phải có thuộc tính `alt` chứa nội dung mô tả chi tiết, không để rỗng hoặc dùng từ vô nghĩa.

---

## 3. Dữ Liệu Cấu Trúc (Structured Data - JSON-LD)

Nhúng Schema JSON-LD trực tiếp trên các trang để kích hoạt hiển thị Rich Results:
*   **Trang sản phẩm:** Schema `Product` + `Offer` + `AggregateRating`.
*   **Trang thương lái:** Schema `LocalBusiness` hoặc `Organization`.
*   **Bài viết:** Schema `Article` + `BreadcrumbList`.

Sử dụng định dạng JSON-LD thông qua thẻ `<script type="application/ld+json">`.

---

## 4. Core Web Vitals (CWV)

*   **LCP (Largest Contentful Paint) < 2.5s:** Thêm thuộc tính `priority` cho ảnh đầu trang/hero image.
*   **CLS (Cumulative Layout Shift) < 0.1:** Bắt buộc set `width` và `height` rõ ràng cho ảnh và chèn skeleton loading cho các dữ liệu tải động.
