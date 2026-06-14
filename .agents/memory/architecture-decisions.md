---
type: architecture-decisions
created: 2026-05-29
updated: 2026-06-14
---

# 🏛️ Các Quyết Định Kiến Trúc (Mini-ADR)

> ⚠️ **Runaway Evolution Guard:** Chỉ ghi vào file này sau khi quyết định đã được xác nhận bởi người dùng hoặc Tech Lead. Không ghi giả định.

---

## ADR-001: Service-Repository Pattern

**Ngày:** 2026-05-25  
**Trạng thái:** ✅ Accepted  
**Quyết định:** Toàn bộ data access phải qua Repository layer. Business logic chỉ nằm trong Service layer.

```
API Route / Server Component → Service → Repository → Supabase
```

**Lý do:**
- Dễ swap Supabase sang provider khác (chỉ sửa Repository)
- Unit test Service bằng cách mock Repository (không cần real DB)
- Phân vai rõ ràng giữa Backend và Frontend agent

**Quy tắc:** API Route và Server Component **tuyệt đối không** gọi Repository trực tiếp.

---

## ADR-002: TailwindCSS v4 CSS-First

**Ngày:** 2026-05-25  
**Trạng thái:** ✅ Accepted  
**Quyết định:** Dùng TailwindCSS v4 với cấu hình `@theme` trong `globals.css`. Không dùng `tailwind.config.js`.

**Lý do:**
- Giảm file config JS, dễ đọc hơn cho agent
- Design tokens tập trung ở một chỗ (`globals.css`)
- Không dùng arbitrary values — giúp agent không "sáng tạo" pixel thô

---

## ADR-003: Next.js App Router (Server Components mặc định)

**Ngày:** 2026-05-25  
**Trạng thái:** ✅ Accepted  
**Quyết định:** Tất cả components là Server Component mặc định. `'use client'` chỉ dùng khi cần `useState`, `useEffect`, event handlers, hoặc Browser API.

**Lý do:** Giảm JavaScript bundle → LCP nhanh hơn → SEO tốt hơn.

---

## ADR-004: Soft Delete bắt buộc

**Ngày:** 2026-05-25  
**Trạng thái:** ✅ Accepted  
**Quyết định:** Mọi bảng DB phải có cột `deleted_at TIMESTAMPTZ`. Không dùng `DELETE` vật lý.

**Lý do:** Audit trail, khả năng undo, foreign key integrity.

---

> *Thêm ADR mới khi có quyết định kiến trúc quan trọng. Format: `ADR-NNN: Tiêu đề`*

---

## ADR-005: Phase 1 MVP — Blog-First Dropship Strategy

**Ngày:** 2026-06-01
**Trạng thái:** ✅ Accepted (Được xác nhận bởi người dùng)
**Quyết định:** Phase 1 tập trung vào SEO Blog để kéo traffic tự nhiên → link tới sản phẩm → đặt hàng COD. Chủ shop nhận email notification, tự đi mua từ thương lái bên ngoài và ship. **Không có merchant portal trong Phase 1.**

**Phạm vi Phase 1:**
- Blog reader UX + Article JSON-LD Schema chuẩn Google
- Product listing + form đặt hàng COD đơn giản
- Email notification cho chủ shop khi có đơn mới
- Viết blog qua Supabase dashboard (không cần Admin CMS UI)
- Section "Sản phẩm liên quan" cuối mỗi bài blog

**Ngoài phạm vi Phase 1 (để Phase 2+):**
- Merchant self-registration portal
- Payment gateway (VNPay, MoMo)
- Admin CMS viết blog trực tiếp trên web
- Commission tracking tự động

**Lý do:**
- Validate market demand trước khi đầu tư infrastructure phức tạp
- Giảm rủi ro: COD đơn giản nhất, không cần tích hợp payment
- Tốc độ ra thị trường nhanh hơn

---

## ADR-006: Blog Content qua Supabase Dashboard

**Ngày:** 2026-06-01  
**Trạng thái:** ❌ Superseded (Bị thay thế bởi ADR-007)  
**Quyết định:** Nội dung blog được tạo trực tiếp qua Supabase Table Editor, không xây dựng Admin CMS trên web.  
**Lý do:** Nhằm tiết kiệm thời gian phát triển trong giai đoạn MVP ban đầu. Đã chuyển đổi sang giao diện Editor chuyên dụng trên Web kể từ ngày 2026-06-07 (Session 2).

---

## ADR-007: Giao diện Admin Editor (Blog Editor) & Tải ảnh bìa local

**Ngày:** 2026-06-07  
**Trạng thái:** ❌ Superseded (Bị thay thế bởi ADR-008)  
**Quyết định:** Xây dựng giao diện soạn thảo cẩm nang (Blog Editor) tích hợp trực tiếp trên Dashboard Admin, hỗ trợ markdown preview thời gian thực và cho phép tải lên hình ảnh bìa local lưu trữ tại thư mục `/public/uploads/blogs/` trên máy chủ.  
**Lý do:**
- Cung cấp trải nghiệm viết bài chuyên nghiệp hơn cho Content Writer (không cần dùng Supabase Table Editor thủ công).
- Đáp ứng việc tải ảnh trực tiếp từ máy tính khi người viết không có sẵn URL ảnh bên ngoài.
- Dễ dàng quản lý chất lượng bài viết thông qua công cụ chấm điểm SEO Score chuẩn hóa theo Google Search Central.
**Quy tắc:** Thư mục `/public/uploads/blogs/` cần được thiết lập phân quyền ghi và cấu hình persist dữ liệu khi deploy lên môi trường production.

---

## ADR-008: Lưu trữ Ảnh bìa Blog trên Supabase Storage (Public bucket blogs)

**Ngày:** 2026-06-13  
**Trạng thái:** ✅ Accepted  
**Quyết định:** Chuyển đổi từ lưu trữ hình ảnh local sang lưu trữ đám mây trực tiếp trên Supabase Storage trong public bucket tên là `blogs`.  
**Lý do:**
- Tránh các vấn đề về mất mát dữ liệu hình ảnh khi ứng dụng được triển khai serverless hoặc trên các nền tảng hosting không hỗ trợ persistent local storage (như Vercel).
- Tải ảnh qua REST API của Supabase Storage giúp đơn giản hóa kiến trúc và tối ưu hóa việc phân phối hình ảnh thông qua mạng CDN của Supabase.
- Thao tác tạo bucket và cấu hình các chính sách Row Level Security (RLS) cho phép ghi/đọc công khai được đồng bộ thông qua tệp migration SQL `010_create_blogs_storage_bucket.sql`.

---

## ADR-009: Cấu hình bucket 'products' trên Supabase Storage
**Ngày:** 2026-06-13  
**Trạng thái:** ✅ Accepted  
**Quyết định:** Tạo và cấu hình bucket `products` ở chế độ Public tương tự `blogs` bucket thông qua tệp migration SQL `012_create_products_storage_bucket.sql`.  
**Lý do:**
- Cho phép người bán (merchant) đăng tải trực tiếp hình ảnh thực tế của hải sản lên đám mây thông qua Dashboard.
- RLS Policy cho phép truy cập đọc (`SELECT`) công khai mà không cần token, còn các tác vụ ghi (`INSERT`, `UPDATE`, `DELETE`) được bảo vệ bằng chính sách RLS phù hợp.


