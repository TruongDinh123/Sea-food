---
name: seafood-content
description: Viết bài viết blog và mô tả sản phẩm chuẩn SEO cho hải sản Cà Mau (tôm sú, cua biển, đặc sản khô). Dùng khi tạo nội dung mới hoặc tối ưu SEO cho trang sản phẩm.
---

# Kỹ Năng: Biên Tập Nội Dung Hải Sản Cà Mau Chuẩn SEO

Kỹ năng này hướng dẫn viết nội dung People-First Content cho hải sản đặc trưng Cà Mau — chân thực, hữu ích, và tối ưu cho Googlebot.

> **Trước khi bắt đầu:** Đọc `references/keywords.md` để nắm từ khóa và `references/tone-of-voice.md` cho giọng điệu.

> **Scripts có sẵn** (chạy `--help` trước khi dùng):
> - `scripts/check-keyword-density.js` — Kiểm tra mật độ từ khóa (0.5%-2.5%)
> - `scripts/validate-schema.js` — Validate JSON-LD schema (Product / Article)

---

## Bước 1: Xác Định Loại Nội Dung

- **[A] Bài viết blog** (hướng dẫn, review) → Dùng template trong `assets/blog-template.md`
- **[B] Mô tả sản phẩm** (trang sản phẩm) → Dùng template trong `assets/product-description-template.md`
- **[C] Schema JSON-LD** (SEO markup) → Dùng template trong `assets/schema-templates.md`

---

## Bước 2: Viết Nội Dung

### Cấu trúc bắt buộc mọi bài viết:

1. **H1** (50-60 ký tự): Chứa từ khóa chính đã chọn từ `references/keywords.md`
2. **Đoạn mở** (100-150 từ): Trả lời thẳng câu hỏi của người mua (giá bao nhiêu? mua ở đâu?)
3. **Mục lục**: Anchor links đến các H2
4. **Nội dung chính** (H2, H3):
   - H2 #1: Tổng quan sản phẩm / Giá hiện tại
   - H2 #2: Đặc điểm / Cách nhận biết chất lượng
   - H2 #3: Quy trình thu hoạch và vận chuyển từ Cà Mau
5. **CTA**: `<Link href="/lien-he">Đặt hàng tôm sú Cà Mau tươi sống</Link>` — anchor text mô tả rõ ràng

### Quy tắc chống sai:
- ❌ Không dùng "xem thêm", "tại đây" làm anchor text
- ❌ Không `<a onClick>` — chỉ dùng `<Link href="...">`
- ❌ Không nói quá, sáo rỗng
- ✅ Dữ liệu thực tế từ vựa, đầm nuôi sinh thái
- ✅ Đúng 1 thẻ `<h1>` trên mỗi trang

---

## Bước 3: Tạo Metadata & Schema

Sau khi viết xong nội dung chính, tạo:

```typescript
// generateMetadata cho Next.js
export const metadata = {
  title: '<Từ khóa chính> | Hải Sản Cà Mau',
  description: '<Mô tả 120-160 ký tự, chứa từ khóa>',
  alternates: { canonical: '/<slug-trang>' },
}
```

Tham chiếu `assets/schema-templates.md` để lấy JSON-LD đúng cấu trúc cho loại trang (Article / Product).

---

## Bước 4: Self-Check Trước Khi Bàn Giao

- [ ] H1 chứa từ khóa chính (từ `references/keywords.md`)?
- [ ] Meta description 120-160 ký tự?
- [ ] Tất cả liên kết là `<Link href="...">` tĩnh?
- [ ] Schema JSON-LD đúng type (`Article` hoặc `Product`)?
- [ ] Giọng điệu đúng theo `references/tone-of-voice.md`?
