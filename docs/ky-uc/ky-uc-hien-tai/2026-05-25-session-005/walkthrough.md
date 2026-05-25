# Walkthrough — Cấu Trúc Next.js SEO & Kế Hoạch Sprint 1

Tài liệu này tóm tắt kết quả của các công việc thiết lập cấu trúc Next.js SEO Best Practice dưới vai trò **Tech Lead (An)** và xây dựng kế hoạch Sprint 1 dưới vai trò **Business Analyst (BA)**.

---

## 🚀 Nội Dung Đã Thực Hiện

### 1. Quyết định Kiến trúc cấu trúc thư mục tối ưu SEO (ADR-001)
Chúng ta đã tạo thành công [ADR-001-nextjs-seo-folder-structure.md](file:///e:/Web-Seo/docs/adr/ADR-001-nextjs-seo-folder-structure.md) quy định chi tiết cấu trúc thư mục cho dự án.
- Sử dụng cấu trúc Next.js App Router (16.2.6) có phân nhóm route groups (`(marketing)`, `(catalog)`) để tổ chức code sạch và modular.
- Xác định rõ vị trí của các file cấu hình SEO đặc thù: `sitemap.ts`, `robots.ts`, `manifest.ts` và logic tạo Dynamic Metadata.
- Thiết lập quy tắc Canonical cho phân trang (self-referencing canonical URL) và liên kết nội bộ hình Kim Tự Tháp (Pyramid Architecture).
- Tách biệt rõ ràng ranh giới sửa file cho các AI Agent (Backend, Frontend, DevOps, QA) nhằm tránh conflict.

### 2. Cập nhật AGENTS.md
Cập nhật sơ đồ cấu trúc thư mục chi tiết của `src/` trong [AGENTS.md](file:///e:/Web-Seo/AGENTS.md) giúp các AI Agent thực hiện code đúng vị trí và nhất quán với Service-Repository pattern.

### 3. Kế hoạch Sprint 1 chi tiết
Lập kế hoạch phát triển [sprint-01.md](file:///e:/Web-Seo/docs/ke-hoach/sprint-01.md) cho tuần đầu tiên với 10 task cụ thể chia cho các vai Backend (Dat), Frontend (Dinh), QA (Vi), ước tính tổng thời gian phát triển là 29 giờ (~3.6 Man-Days). Định nghĩa rõ Sprint Goal, DoD, và rủi ro/phụ thuộc.

---

## 📈 Kết Quả Xác Thực (Verification Results)

### Kiểm Tra Lint (Linter Check)
Chúng ta đã chạy thành công kiểm tra cú pháp:
```bash
npm.cmd run lint
```
**Kết quả:** Hoàn thành thành công (Exit Code 0), không có lỗi TypeScript hay linter ESLint nào phát sinh sau khi cập nhật các tài liệu cấu hình.

---

## 📋 Bước Tiếp Theo Đề Xuất
1. **Kích hoạt Backend Dev (Dat)** bằng lệnh `/dev-be-dat` để thực hiện các task **T1, T4, T5, T7** (Thiết lập Database Client, Types, Merchant/Product Repository & Service, API Route).
2. **Kích hoạt Frontend Dev (Dinh)** bằng lệnh `/dev-fe-dinh` để thực hiện các task **T2, T3, T6, T8, T9** (globals.css, Root Layout, Merchant/Product Pages, sitemap/robots.txt).
3. **Kích hoạt QA (Vi)** bằng lệnh `/qa-vi` để thực hiện task **T10** (Unit test & Playwright test).
