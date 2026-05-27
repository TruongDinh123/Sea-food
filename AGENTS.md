<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Quy Tắc Dự Án & Hướng Dẫn Tác Tự (Universal Standards)

Tập tin này định hình toàn bộ hành vi, quy tắc lập trình, và hướng dẫn an toàn cho tất cả tác tử AI hoạt động trong không gian làm việc này. Áp dụng cho: Antigravity, Cursor, Windsurf, và tất cả AI tools tương thích AGENTS.md.

> **Thứ tự ưu tiên:** `GEMINI.md` > `AGENTS.md` > `.agents/rules/`

---

## 🛠️ Tech Stack & Cấu Trúc Dự Án

- **Frontend & Core:** Next.js (App Router), React, TypeScript.
  > *Why:* App Router cung cấp Server Components mặc định, tối ưu SSR/SSG mà không cần cấu hình thêm.
- **CSS / Giao diện:** TailwindCSS (Ưu tiên v4 css-first). Không sử dụng các thư viện UI cồng kềnh trừ khi được yêu cầu.
  > *Why:* TailwindCSS v4 css-first (`@theme` trong globals.css) loại bỏ file cấu hình JS, giúp agent dễ đọc và nhất quán hơn.
- **Database:** PostgreSQL (Supabase).
  > *Why:* Supabase cung cấp RLS, Realtime, Storage tích hợp. Không cần tự quản lý infrastructure.
- **Kiến trúc:** Service-Repository Pattern.
  > *Why:* Tách biệt data access (Repository) khỏi business logic (Service) giúp dễ test unit từng tầng độc lập, và dễ swap database provider nếu cần.

---

## 📁 Cấu Trúc Thư Mục `src/`

```
src/
├── app/                          ← Next.js App Router Pages, Layouts & Configs
│   ├── (marketing)/              ← Route Group cho các trang tĩnh, bài viết, giới thiệu
│   │   ├── page.tsx               ← Trang chủ "/" (Pyramid Root)
│   │   ├── ve-chung-toi/
│   │   │   └── page.tsx           ← Trang giới thiệu doanh nghiệp
│   │   └── blog/
│   │       ├── page.tsx           ← Danh sách bài viết blog
│   │       └── [slug]/
│   │           └── page.tsx       ← Chi tiết bài viết (JSON-LD Article Schema)
│   ├── (catalog)/                ← Route Group cho sản phẩm & ngành hàng
│   │   ├── san-pham/
│   │   │   ├── page.tsx           ← Danh sách tất cả sản phẩm
│   │   │   └── [slug]/
│   │   │       └── page.tsx       ← Chi tiết sản phẩm (JSON-LD Product/ProductGroup Schema)
│   │   └── danh-muc/
│   │       └── [slug]/
│   │           └── page.tsx       ← Danh mục sản phẩm (Tôm sú, Cua biển, Khô...)
│   ├── thuong-lai/               ← Route cho thương lái (Merchants)
│   │   ├── page.tsx               ← Danh sách thương lái
│   │   └── [slug]/
│   │       └── page.tsx           ← Chi tiết thương lái (JSON-LD Profile Schema)
│   ├── api/                      ← API Route Handlers (chỉ gọi Service Layer)
│   │   ├── products/route.ts
│   │   └── merchants/route.ts
│   ├── sitemap.ts                ← Dynamic Sitemap generator (sitemap.xml)
│   ├── robots.ts                 ← Dynamic Robots.txt generator (robots.txt)
│   ├── manifest.ts               ← Dynamic Web App Manifest (PWA)
│   ├── layout.tsx                ← Root layout (Global Meta tags, Be Vietnam Pro font)
│   └── globals.css               ← CSS global (Chứa TailwindCSS v4 `@theme`)
├── components/
│   ├── ui/                       ← Atomic components (Button, Badge, Card, Input)
│   ├── features/                 ← Feature-specific components (ProductCard, MerchantList)
│   └── layout/                   ← Layout components (Header, Footer, Navigation, Breadcrumbs)
├── lib/
│   ├── db/                       ← Database client & configuration (Supabase client)
│   ├── repositories/             ← Data access layer (*.repository.ts)
│   └── services/                 ← Business logic layer (*.service.ts)
└── types/                        ← TypeScript type definitions (*.types.ts)
```

> *Why cấu trúc này:* Đảm bảo phân vai rõ ràng cho từng Agent. Frontend Dev (Dinh) chỉ sửa `src/app/` (trừ api) và `src/components/`. Backend Dev (Dat) chỉ sửa `src/lib/`, `src/types/` và `src/app/api/`. Điều này tránh conflict và giữ cấu trúc SEO chuẩn mực.

---

## 🚀 Quy Tắc Lập Trình (Coding Conventions)

### 1. Đặt Tên (Naming Conventions)

| Loại | Convention | Ví Dụ |
|---|---|---|
| Component | PascalCase | `ProductCard.tsx` |
| CSS Module | kebab-case | `product-card.module.css` |
| Hàm/Biến | camelCase | `calculateCommission` |
| Hằng số | SCREAMING_SNAKE_CASE | `MAX_COMPARE_ITEMS = 3` |
| Hook | camelCase + `use` prefix | `useProductCompare.ts` |
| Utility | kebab-case | `format-price.ts` |
| Types | kebab-case + `.types` | `product.types.ts` |
| Repository | kebab-case + `.repository` | `product.repository.ts` |
| Service | kebab-case + `.service` | `product.service.ts` |
| Bảng DB | snake_case, số nhiều | `merchants`, `products` |
| Cột DB | snake_case | `price_per_kg`, `is_active` |
| Khóa ngoại | tên bảng số ít + `_id` | `merchant_id` |
| Cột boolean | `is_` hoặc `has_` | `is_available`, `has_stock` |
| Cột timestamp | kết thúc `_at` | `created_at`, `deleted_at` |

> *Why:* Nhất quán về naming giúp agent tìm đúng file không cần đoán. Suffix `.repository.ts` / `.service.ts` ngay lập tức nói rõ tầng kiến trúc.

### 2. Thiết Kế Component (React/Next.js)

- **Server Component (Mặc định):** Tất cả components là Server Component. Chỉ thêm `'use client'` khi THỰC SỰ cần: `useState`, `useEffect`, event handlers, Browser API.
  > *Why:* Server Components render trên server → không có JavaScript bundle gửi về client → LCP nhanh hơn, SEO tốt hơn.

- **Single Responsibility:** Mỗi component chỉ làm một việc. Logic phức tạp → tách ra Custom Hook hoặc Service.
  > *Why:* Component làm nhiều việc → khó test, khó tái sử dụng, dễ gây side effects.

- **Early Return:** Trả về sớm thay vì lồng `if-else`.
  ```typescript
  // ❌ Không làm
  if (user) { if (user.isActive) { return <Content /> } }

  // ✅ Làm
  if (!user) return null
  if (!user.isActive) return <Inactive />
  return <Content />
  ```

- **Phân Tầng Component:**
  - `src/components/ui/` — Nguyên tử, tái sử dụng toàn app (Button, Badge, Card).
  - `src/components/features/` — Tính năng cụ thể (ProductCard, MerchantCard).
  - `src/components/layout/` — Bố cục tĩnh (Header, Footer, Breadcrumb).

### 3. Data Access — Service-Repository Pattern

```
API Route / Server Component
    ↓ chỉ gọi Service
Service Layer (*.service.ts)       ← business logic, validation
    ↓ chỉ gọi Repository
Repository Layer (*.repository.ts) ← SQL queries, data mapping
    ↓
Database (Supabase PostgreSQL)
```

**Quy tắc bất biến:**
- Repository: KHÔNG chứa business logic.
- Service: KHÔNG chứa SQL trực tiếp.
- API Route / Component: KHÔNG gọi Repository trực tiếp.

> *Why:* Nếu muốn swap Supabase sang Neon → chỉ sửa Repository. Business logic trong Service không đổi. Tests cho Service mock Repository, không cần real DB.

---

## 🔍 Quy Tắc SEO (Bắt Buộc Cho Mọi Page)

- **`generateMetadata`:** Mỗi `page.tsx` phải export `generateMetadata` với title và description riêng biệt.
- **H1 duy nhất:** Đúng 1 thẻ `<h1>` chứa từ khóa chính trên mỗi trang.
- **Alt text:** Mọi `<Image>` phải có `alt` mô tả nội dung thực tế (không để rỗng, không dùng "image").
- **Liên kết tĩnh:** Dùng `<Link href="...">` của Next.js, KHÔNG dùng `onClick` để navigate.
- **Anchor text:** Mô tả đích đến cụ thể — không dùng "xem thêm", "nhấp vào đây".
- **JSON-LD Schema:** Trang sản phẩm → `Product` hoặc `ProductGroup` schema. Trang bài viết → `Article` schema.
- **Canonical:** Thêm `alternates: { canonical: '/slug' }` trong `generateMetadata`.
- **Pagination Canonical:** TUYỆT ĐỐI KHÔNG canonical các trang phân trang (ví dụ: page=2, page=3) quay về trang 1. Mỗi trang trong chuỗi phân trang phải trỏ canonical về chính nó (self-referencing canonical URL).
- **Liên kết Kim Tự Tháp (Pyramid Architecture):** Cấu trúc liên kết nội bộ theo sơ đồ hình kim tự tháp (Trang chủ → Danh mục cha → Danh mục con → Chi tiết sản phẩm). Các trang sản phẩm quan trọng phải được liên kết trực tiếp từ trang danh mục chính hoặc trang chủ.

> *Why:* Googlebot không thực thi JavaScript để follow onclick links. Thiếu H1 hoặc canonical làm giảm khả năng rank. Schema JSON-LD kích hoạt Rich Results trên SERP. Tránh trỏ canonical trang phân trang về trang 1 giúp Googlebot index được các sản phẩm ở các trang sau mà không coi chúng là trùng lặp nội dung. Mô hình kim tự tháp tối ưu dòng chảy PageRank.

---

## 🗄️ Quy Tắc Database (PostgreSQL / Supabase)

- **Không `SELECT *`:** Luôn chỉ rõ cột cần lấy.
  > *Why:* `SELECT *` tốn băng thông, trả về dữ liệu nhạy cảm không cần thiết, dễ break khi schema thay đổi.

- **Soft Delete bắt buộc:** Dùng `deleted_at TIMESTAMPTZ` — không `DELETE` vật lý.
  > *Why:* Audit trail, khả năng undo, foreign key integrity.

- **Tránh N+1 Query:** Dùng `JOIN` hoặc batch query thay vì query trong vòng lặp.
  > *Why:* N+1 queries là nguyên nhân phổ biến nhất gây chậm trang khi data lớn.

- **Migration:** Tên file `{NNN}_{action}_{object}.sql`. Mỗi file phải có cả `Up` và `Down` trong transaction `BEGIN; ... COMMIT;`.

---

## 🧪 Testing Requirements

- **Framework:** Vitest + React Testing Library cho unit tests. Playwright cho E2E.
- **Coverage tối thiểu:** 80% cho `src/lib/services/` và `src/lib/repositories/`.
- **Test pattern:** `src/lib/services/__tests__/*.test.ts`.
- **Mocking:** Mock repository khi test service. Không kết nối real database trong unit tests.

> *Why:* Service layer là nơi business logic quan trọng nhất. Nếu không test → bug âm thầm trong tính toán giá, commission, validation.

---

## 📝 Git Conventions

- **Commit format:** `<type>(<scope>): <subject>` — Conventional Commits v1.0.
- **Types:** `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `chore`.
- **Scopes:** `product` | `merchant` | `seo` | `api` | `db` | `ui` | `auth`.
- **Subject:** Động từ mệnh lệnh, không viết hoa, không dấu chấm, < 72 ký tự.
- **Branch:** `feature/<ten-tinh-nang>` | `fix/<ten-bug>` | `chore/<viec-lam>`.
- **Không push thẳng lên `main`:** Luôn qua branch → PR.

> *Why:* Conventional Commits cho phép auto-generate changelog và semantic versioning. Branch isolation giúp code review trước khi merge production.

---

## 🏗️ Domain Isolation & Quy Tắc Thiết Kế (Design System Standard)

### 1. Phân Chia Vai Trò & Ranh Giới (Single vs Multi-Agent)
* **Chế độ Single Agent (Làm việc trực tiếp với Antigravity)**: Khi người dùng tương tác trực tiếp với Antigravity trong giao diện chat, Antigravity được cấp quyền **Fullstack** sửa đổi tất cả các file cần thiết trong dự án (`src/`, `db/`, `docs/`, `package.json`...) để xử lý yêu cầu một cách liền mạch, không bị giới hạn bởi bảng phân chia miền dưới đây.
* **Chế độ Multi-Agent (Chạy song song qua `/spawn`)**: Bảng phân chia miền bắt buộc phải được tuân thủ nghiêm ngặt để tránh merge conflicts:

| Agent | Domain (Chỉ Sửa Files Trong) | Không Được Sửa |
|---|---|---|
| **Tech Lead (An)** | `AGENTS.md`, `GEMINI.md`, `.agents/`, `docs/` | `src/`, `db/` |
| **Backend (Dat)** | `src/lib/`, `src/app/api/`, `db/`, `src/types/` | `src/components/`, `src/app/page.tsx` |
| **Frontend (Dinh / Senior FE)** | `src/app/`, `src/components/`, `public/` | `src/lib/`, `db/` |
| **DevOps (Duc)** | `next.config.ts`, `package.json`, `.env.example`, `.husky/` | `src/`, `db/` |
| **QA (Vi)** | `src/**/*.test.ts`, `src/**/*.spec.ts`, `tests/`, `e2e/` | Code production |

### 2. Quy Tắc Bắt Buộc Về Design System (Cho Tất Cả Các Agent)
Tất cả các agent liên quan tới việc thiết kế UI, viết Acceptance Criteria (AC), viết mã Frontend hoặc tạo tài liệu dự án (bao gồm **Senior FE, PM, Tech Lead**) đều **BẮT BUỘC** phải tuân thủ và sử dụng hệ thống Design System được định nghĩa trong `Design_system/` (đã đồng bộ vào `src/app/globals.css`). 
* **Không dùng pixel thô**: Tuyệt đối không tự ý viết các giá trị pixel cụ thể (arbitrary values kiểu `rounded-[32px]`, `p-[20px]`, `py-[100px]`, v.v.) trong code React/Next.js. Phải dùng class Tailwind v4 được đăng ký từ Design System (ví dụ: `rounded-cards`, `rounded-buttons`, `p-card-padding` hoặc các lớp khoảng cách được khai báo sẵn).
* **Font chữ thống nhất**: Font chữ chính thức cho giao diện Tiếng Việt là **Be Vietnam Pro** (nhập từ Google Fonts), không được sử dụng font `Inter`, `Soehne` hoặc font mặc định của hệ thống cho các văn bản hiển thị.

> *Why:* Đảm bảo tính đồng nhất về mặt thẩm mỹ của thương hiệu hải sản sang trọng (refined minimalism) trên tất cả các trang, đồng thời giúp code gọn gàng, có tính bảo trì cao và tối ưu hóa context cho AI.

---

## 🔒 Quy Tắc An Toàn (Safety Guardrails)

Tác tử AI phải luôn xin ý kiến phê duyệt của người dùng trước khi thực hiện:

1. **Database destructive operations:** `DROP TABLE`, `TRUNCATE`, `DELETE` không có `WHERE`.
2. **Migration:** Báo cáo SQL sẽ thực thi và chờ "XÁC NHẬN" trước khi tạo file migration.
3. **Xóa file:** Bất kỳ lệnh `rm` hay xóa file nào cần approval.
4. **Secrets:** Không bao giờ in giá trị của biến chứa: `KEY`, `SECRET`, `PASSWORD`, `TOKEN`.
5. **Main branch:** Không push trực tiếp lên `main`. Tạo branch feature → PR.

### 📊 Bảng 3-Tier Boundary (GitHub Analysis — 2,500+ AGENTS.md repos)

Mọi agent phải phân loại hành động theo 3 mức trước khi thực hiện:

| Tier | Nguyên tắc | Ví dụ cụ thể cho dự án này |
|---|---|---|
| **✅ Always** (Luôn làm — không cần hỏi) | Các hành động an toàn, reversible, đã được quy định rõ | Log thay đổi vào NOTES.md; dùng soft delete (deleted_at); dùng UTC timestamps; chạy `npm run build` trước khi báo xong |
| **❓ Ask First** (Hỏi trước — chờ OK) | Hành động có tác động đáng kể, khó undo | Thêm cột mới vào DB; thay đổi cấu trúc API response; cài thêm npm package; thay đổi next.config.ts; tạo migration mới |
| **🚫 Never** (Không bao giờ — dù được yêu cầu) | Hành động không thể undo hoặc vi phạm bảo mật | DROP TABLE; push thẳng lên main; in giá trị SECRET/TOKEN; DELETE không có WHERE; override .env.local |

> *Why:* Phân loại 3-tier thay vì chỉ dựa vào cảm tính giúp agent ra quyết định nhất quán và giảm thiểu các lỗi không thể undo. Tham khảo: GitHub analysis of 2,500+ AGENTS.md repositories (2026).

> *Why:* Với auto-continue enabled trong Antigravity, agent có thể thực hiện chuỗi dài hành động mà không dừng. Guardrails ngăn các hành động không thể undo được thực hiện tự động.

**Đọc thêm:** [`GUARDRAILS.md`](./GUARDRAILS.md) — Danh sách đầy đủ failure patterns đã học được.

---

## 🧠 Memory & Context Management

- **Đầu phiên:** Đọc [`docs/ky-uc/NOTES.md`](./docs/ky-uc/NOTES.md) để nắm ngữ cảnh.
- **Sau mỗi task lớn:** Cập nhật `NOTES.md` với tiến trình và quyết định mới.
- **Phát hiện failure pattern mới:** Thêm vào `GUARDRAILS.md`.
- **Kết thúc phiên:** Chạy workflow `/handoff`.
- **Phiên mới:** Chạy workflow `/resume`.

> *Why:* Context rot xảy ra sau ~1 giờ làm việc liên tục. Agent bắt đầu quên constraints, import từ file không tồn tại. `NOTES.md` là "bộ nhớ ngoài" giúp agent tiếp tục mạch làm việc sau khi context window được reset.

---

## 📋 Quy Tắc Review (Trước Khi Báo Cáo Hoàn Thành)

Agent phải tự kiểm tra trước khi nói "done":

```bash
# Bước 1: Build & Lint
npm run build    # Không có TypeScript error
npm run lint     # Không có ESLint warning/error

# Bước 2: Verify Commit Hooks đang active
cat .husky/pre-commit    # Phải tồn tại và chứa tsc + lint check
cat .husky/commit-msg    # Phải tồn tại và chứa commitlint

# Bước 3: Dry-run commit message (kiểm tra format trước khi commit thật)
echo "feat(scope): mô tả ngắn gọn" | npx commitlint
# Phải không có lỗi → mới được commit thật

# Bước 4: Commit với format Conventional Commits
git commit -m "<type>(<scope>): <subject>"
# Hooks sẽ tự chạy: tsc → eslint → commitlint
```

> 📖 Xem hướng dẫn đầy đủ: `.agents/workflows/references/commit-hook-guide.md`

Nếu build fail → sửa trước khi báo cáo. Không để lại broken build. **Không dùng `--no-verify` để bypass hooks.**


---

## 📚 Tham Chiếu Nhanh (References)

Các tài nguyên hỗ trợ dành cho agent — Chỉ load khi cần:

| Tài nguyên | Đường dẫn | Dùng khi nào |
|---|---|---|
| Backend code templates | [`.agents/workflows/references/code-templates-backend.md`](.agents/workflows/references/code-templates-backend.md) | Viết Repository, Service, Migration, API Route |
| Frontend code templates | [`.agents/workflows/references/code-templates-frontend.md`](.agents/workflows/references/code-templates-frontend.md) | Viết Pages, Components, Loading/Error states |
| Design System contract | [`.agents/rules/Design.md`](.agents/rules/Design.md) | Kiểm tra màu sắc, spacing, forbidden patterns |
| Failure patterns | [`GUARDRAILS.md`](GUARDRAILS.md) | Khi gặp vấn đề lặp lại |
| Session memory | [`docs/ky-uc/NOTES.md`](docs/ky-uc/NOTES.md) | Đầu mỗi phiên |

---

*File này được review hàng tháng. Thay đổi phải qua PR với ít nhất 1 reviewer.*  
*Lần review cuối: 2026-05-27*
