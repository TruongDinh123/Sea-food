---
name: writing-seafood-content
description: Viết bài viết blog và mô tả sản phẩm chuẩn SEO cho hải sản Cà Mau (tôm sú, cua biển, đặc sản khô). Dùng khi tạo nội dung mới hoặc tối ưu SEO cho trang sản phẩm.
---

# Kỹ Năng: Biên Tập Nội Dung Hải Sản Cà Mau Chuẩn SEO

Kỹ năng này cung cấp hướng dẫn chi tiết để biên tập nội dung People-First Content cho các sản phẩm hải sản đặc trưng Cà Mau — đảm bảo tính chân thực, hữu ích và tối ưu hóa cao cho các công cụ tìm kiếm (Googlebot).

> **Trước khi bắt đầu:** Nghiên cứu kỹ tệp `references/keywords.md` để nắm bắt từ khóa mục tiêu và `references/tone-of-voice.md` để áp dụng đúng giọng điệu thương hiệu.

> **Các công cụ/scripts hỗ trợ** (nên chạy lệnh với tham số `--help` để xem hướng dẫn chi tiết trước khi sử dụng):
> - `scripts/check-keyword-density.js` — Kiểm tra và duy trì mật độ từ khóa ở mức hợp lý (0.5% - 2.5%).
> - `scripts/validate-schema.js` — Xác thực tính hợp lệ của cấu trúc JSON-LD schema (cho Article, Product, hoặc ProductGroup).

---

## Bước 1: Xác Định Loại Nội Dung Cần Biên Tập

- **[A] Bài viết blog** (hướng dẫn, tin tức, chia sẻ kinh nghiệm) → Sử dụng cấu trúc và định dạng trong `assets/blog-template.md`.
- **[B] Mô tả sản phẩm** (dành cho trang chi tiết sản phẩm) → Sử dụng cấu trúc trong `assets/product-description-template.md`.
- **[C] Schema JSON-LD** (dữ liệu cấu trúc để tối ưu SEO Rich Results) → Lựa chọn template tương ứng trong `assets/schema-templates.md`.

---

## Bước 2: Biên Tập Nội Dung Theo Chuẩn SEO

### Cấu trúc bắt buộc đối với một bài viết:

1. **H1** (50-60 ký tự): Phải chứa từ khóa chính được chọn từ danh sách `references/keywords.md`.
2. **Đoạn mở đầu** (100-150 từ): Trả lời trực tiếp các câu hỏi cốt lõi của người đọc (sản phẩm gì, giá bao nhiêu, mua ở đâu uy tín). Từ khóa chính cần xuất hiện tự nhiên trong 2 câu đầu tiên.
3. **Mục lục**: Đặt ở đầu trang, chứa anchor link liên kết trực tiếp tới các thẻ H2.
4. **Nội dung chính** (phân bổ mạch lạc bằng các thẻ H2, H3):
   - H2 #1: Tổng quan sản phẩm / Bảng giá hiện tại (cập nhật mới nhất).
   - H2 #2: Đặc điểm nổi bật / Hướng dẫn nhận biết chất lượng sản phẩm.
   - H2 #3: Quy trình thu hoạch, đóng gói và vận chuyển từ Cà Mau.
5. **Kêu gọi hành động (CTA)**: Sử dụng các anchor text mô tả cụ thể, ví dụ: `<Link href="/lien-he">Đặt mua tôm sú Cà Mau tươi sống</Link>`.

### Quy tắc quan trọng cần tuân thủ (Anti-patterns):
- ❌ Tuyệt đối không sử dụng các anchor text chung chung như "xem thêm", "tại đây", "nhấp vào đây".
- ❌ Không sử dụng thẻ `<a>` với sự kiện `onClick` để chuyển hướng; bắt buộc sử dụng thẻ `<Link href="...">` của Next.js để Googlebot có thể crawl dễ dàng.
- ❌ Tránh phóng đại thông tin hoặc dùng tính từ sáo rỗng ("giá rẻ nhất", "siêu khuyến mãi").
- ✅ Sử dụng dữ liệu thực tế từ các vựa hải sản, đầm nuôi sinh thái tự nhiên.
- ✅ Đảm bảo mỗi trang web chỉ có duy nhất một thẻ `<h1>`.

---

## Bước 3: Tạo Metadata Và Dữ Liệu Cấu Trúc (Schema)

Sau khi hoàn thành phần nội dung chính, tiến hành thiết lập metadata cho Next.js App Router:

```typescript
// Cấu hình metadata trong page.tsx
export const metadata = {
  title: '<Từ khóa chính> | Hải Sản Cà Mau',
  description: '<Mô tả ngắn từ 120-160 ký tự, chứa từ khóa chính một cách tự nhiên>',
  alternates: { canonical: '/<slug-trang>' },
}
```

Tham chiếu và áp dụng cấu trúc dữ liệu JSON-LD từ tệp `assets/schema-templates.md` tùy thuộc vào loại trang (Article, Product hoặc ProductGroup).

---

## Bước 4: Tự Kiểm Tra Chất Lượng Trước Khi Bàn Giao

Trước khi kết thúc nhiệm vụ, agent cần thực hiện tự kiểm tra lại theo danh sách sau:
- [ ] Tiêu đề H1 đã chứa từ khóa chính (từ `references/keywords.md`) chưa?
- [ ] Thẻ Meta Description đã nằm trong khoảng 120-160 ký tự và chứa từ khóa chính chưa?
- [ ] Toàn bộ liên kết chuyển hướng có sử dụng thẻ `<Link href="...">` tĩnh không?
- [ ] Cấu trúc Schema JSON-LD đã đúng loại và đã được validate bằng `scripts/validate-schema.js` chưa?
- [ ] Giọng văn và từ ngữ sử dụng đã nhất quán với hướng dẫn trong `references/tone-of-voice.md` chưa?
