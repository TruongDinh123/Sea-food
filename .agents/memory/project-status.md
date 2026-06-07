---
type: project
created: 2026-06-01
updated: 2026-06-01
---

# 📊 Project Status — Seafood Marketplace (Cà Mau)

> Cập nhật file này sau mỗi lần hoàn thành milestone/feature lớn.
> **KHÔNG đọc lại toàn bộ codebase** — đọc file này là đủ để biết dự án đang ở đâu.

---

## 🏗️ Kiến Trúc

- **Stack:** Next.js App Router + TypeScript + TailwindCSS v4 + Supabase PostgreSQL
- **Pattern:** API Route → Service → Repository → DB (bắt buộc)
- **Font:** Be Vietnam Pro | **Palette:** Deepwater Teal `#031e25`

---

## ✅ Chức Năng Đã Hoàn Thành (cập nhật: 2026-06-01)

### 🗄️ Database — 9 Migrations (DONE)
| Migration | Nội dung |
|---|---|
| 001 | Bảng `merchants` (thương lái) |
| 002 | Bảng `products` (sản phẩm) |
| 003 | Bảng `referral_logs` (hoa hồng) |
| 004 | RLS cơ bản |
| 005 | Bảng `orders` + `order_items` |
| 006 | Bảng `blogs` |
| 007 | Cập nhật merchants & referrals |
| 008 | RLS cho orders & blogs |
| 009 | Thêm cột `notes` cho orders ⚠️ Cần chạy thủ công trên Supabase |

### 🔧 Backend — Service Layer (DONE)
| Service | Chức năng |
|---|---|
| `product.service.ts` | CRUD sản phẩm, validate slug/giá/thương lái |
| `merchant.service.ts` | CRUD thương lái, validate SĐT |
| `order.service.ts` | Tạo đơn hàng (transaction), cập nhật trạng thái, tính hoa hồng khi completed |
| `blog.service.ts` | CRUD bài viết, validate slug |
| `referral.service.ts` | Quản lý nhật ký hoa hồng, tính commission (percentage/fixed/monthly_flat) |
| `email.service.ts` | Gửi email (stdout mock + SMTP nếu cấu hình) |

### 🔧 Backend — Repository Layer (DONE)
- `product.repository.ts`, `merchant.repository.ts`, `order.repository.ts`, `blog.repository.ts`, `referral.repository.ts`
- Tất cả dùng soft delete (`deleted_at`)

### 📡 API Routes (DONE)
| Endpoint | Method | Chức năng |
|---|---|---|
| `/api/products` | POST | Tạo sản phẩm (merchant auth) |
| `/api/products` | DELETE | Xóa sản phẩm (merchant auth + ownership check) |
| `/api/merchants` | GET | Lấy danh sách thương lái active |
| `/api/merchants` | PUT | Cập nhật thương lái (merchant: profile / admin: commission) |
| `/api/merchants` | POST | Lấy tất cả thương lái (admin only) |
| `/api/orders` | POST | Đặt hàng COD (public) |
| `/api/orders` | PUT | Cập nhật trạng thái đơn hàng (merchant auth + ownership) |
| `/api/blogs` | GET/POST | Danh sách blog published / Tạo bài viết mới (admin auth) |
| `/api/blogs/[id]` | PUT | Cập nhật bài viết blog (admin auth) |
| `/api/blogs/[id]` | DELETE | Xóa bài viết blog (soft-delete, admin auth) |
| `/api/auth/login` | POST | Đăng nhập (cookie session) |
| `/api/auth/logout` | POST | Đăng xuất |
| `/api/auth/register-merchant` | POST | Đăng ký thương lái mới |

### 🌐 Frontend — Trang Công Khai (DONE/PARTIAL)
| Trang | Route | Trạng thái |
|---|---|---|
| Trang chủ | `/` | ✅ Done (23KB) |
| Danh sách sản phẩm | `/san-pham` | ✅ Done |
| Chi tiết sản phẩm | `/san-pham/[slug]` | ✅ Done |
| Danh mục sản phẩm | `/danh-muc/[slug]` | ✅ Done (CategoryClient 27KB) |
| Blog danh sách | `/blog` | ✅ Done |
| Blog chi tiết | `/blog/[slug]` | ✅ Done |
| Về chúng tôi | `/ve-chung-toi` | ✅ Done |
| Danh sách thương lái | `/thuong-lai` | ✅ Done |
| Chi tiết thương lái | `/thuong-lai/[slug]` | ✅ Done |
| Sitemap | `/sitemap.xml` | ✅ Done (dynamic) |
| Robots.txt | `/robots.txt` | ✅ Done (dynamic) |
| Web Manifest | `/manifest.json` | ✅ Done |

### 🔐 Auth (DONE)
- Trang đăng nhập: `/auth/login` (11KB)
- Trang đăng ký vựa: `/auth/register-merchant` (16KB)
- Session lưu bằng cookie (JSON parse)
- API logout: `/api/auth/logout`

### 📊 Dashboards (DONE)
**Merchant Dashboard** (`/dashboard/merchant`):
- Tab **Tổng quan** (OverviewTab) — thống kê
- Tab **Quản lý đơn hàng** (OrderManagerTab)
- Tab **Quản lý sản phẩm** (ProductManagerTab — thêm/xóa sản phẩm)
- Tab **Hoa hồng** (ReferralLogsTab) — xem nhật ký hoa hồng
- Tab **Hồ sơ** (ProfileTab) — cập nhật thông tin cá nhân

**Admin Dashboard** (`/dashboard/admin`):
- AdminDashboardClient (39KB) — quản lý toàn bộ merchants, phê duyệt, cấu hình commission, quản lý bài viết blog (CRUD cẩm nang)

### 🧱 Layout Components (DONE)
- `Header.tsx` (9KB) — navigation, responsive
- `Footer.tsx` (9KB) — links, thông tin liên hệ
- `Breadcrumbs.tsx` — SEO breadcrumb navigation

### 🧪 Testing (DONE)
**Unit Tests** (Vitest) — `src/lib/services/__tests__/`:
- `product.service.test.ts`, `merchant.service.test.ts`, `order.service.test.ts`, `blog.service.test.ts`, `referral.service.test.ts`

**E2E Tests** (Playwright) — `e2e/`:
- `tier1-feature-coverage.spec.ts`
- `tier2-boundary-cases.spec.ts`
- `tier3-cross-feature.spec.ts`
- `tier4-real-world-scenarios.spec.ts`

---

## 🔴 Chưa Làm / Còn Thiếu

| Hạng mục | Ghi chú |
|---|---|
| Chạy E2E tests pass | Cần server chạy + DB có data |
| Vitest coverage đạt 80% | Chưa verify coverage |
| Chạy migration 009 | Cần thủ công trên Supabase SQL Editor |
| `src/components/features/` | Thư mục rỗng — chưa có feature components tái sử dụng |
| Trang 404 custom | Chưa thấy `not-found.tsx` |
| Loading states | Chưa kiểm tra `loading.tsx` |

---

## 📈 Tổng Số (snapshot 2026-06-01)

| Loại | Số lượng |
|---|---|
| DB Migrations | 9 |
| Repositories | 5 |
| Services | 7 |
| API Routes (endpoints) | ~10 |
| Frontend Pages | 11 |
| Dashboard Tabs | 5 (merchant) + 1 (admin) |
| Unit Test Files | 5 |
| E2E Test Files | 4 |
| Layout Components | 3 |

**Tổng chức năng đã làm: ~50+ chức năng cụ thể**
