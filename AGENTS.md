<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Quy Tắc Dự Án & Hướng Dẫn Tác Tự (Universal Standards)

Tập tin này định hình toàn bộ hành vi, quy tắc lập trình, và hướng dẫn an toàn cho tất cả tác tử AI hoạt động trong không gian làm việc này.

---

## 🛠️ Tech Stack & Cấu Trúc Dự Án

*   **Frontend & Core:** Next.js (App Router), React, TypeScript.
*   **CSS / Giao diện:** TailwindCSS (Ưu tiên v4 css-first). Không sử dụng các thư viện UI cồng kềnh trừ khi được yêu cầu.
*   **Database:** PostgreSQL (Supabase / Neon).
*   **Kiến trúc:** Service-Repository Pattern. Tách biệt hoàn toàn tầng logic nghiệp vụ (Service) khỏi tầng truy xuất dữ liệu (Repository).

---

## 🚀 Quy Tắc Lập Trình (Coding Conventions)

### 1. Đặt Tên (Naming Conventions)
*   **Tên Component:** PascalCase (ví dụ: `ProductCard.tsx`).
*   **CSS Module:** kebab-case (ví dụ: `product-card.module.css`).
*   **Tên Hàm/Biến:** camelCase (ví dụ: `calculateCommission`).
*   **Hằng số:** SCREAMING_SNAKE_CASE (ví dụ: `MAX_COMPARE_ITEMS = 3`).
*   **File code / Hooks:** camelCase với hook (`useProduct.ts`), kebab-case với utils (`format-price.ts`).
*   **Tên bảng database:** snake_case, số nhiều (ví dụ: `merchants`, `products`).
*   **Tên cột database:** snake_case, khóa ngoại kết thúc bằng `_id`.

### 2. Thiết Kế Component (React/Next.js)
*   **Server Component (Mặc định):** Giữ component là Server Component để tối ưu SSR/SSG. Chỉ dùng `use client` cho các tương tác động (state, effect, click handler).
*   **Single Responsibility:** Mỗi component chỉ làm một việc duy nhất. Tách logic phức tạp ra Custom Hooks.
*   **Early Return:** Ưu tiên early return thay vì lồng nhiều khối điều kiện `if-else`.

---

## 🔒 Quy Tắc An Toàn (Safety Guardrails)

Tác tử AI phải luôn xin ý kiến phê duyệt của người dùng trước khi thực hiện các lệnh nhạy cảm như xóa database, cấu hình sai secrets, v.v.

Các quy tắc chi tiết tự động tải thông qua glob pattern được định nghĩa tại thư mục [.agents/rules/](file:///e:/Web-Seo/.agents/rules/).
