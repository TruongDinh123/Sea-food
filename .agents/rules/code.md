# rule: code
# description: Quy tắc code Next.js, TypeScript, và Clean Code
# glob: src/**/*
# ---

# 💻 Quy Tắc Lập Trình (Next.js, TS & Clean Code)

Quy tắc này tự động áp dụng khi làm việc với bất kỳ tập tin nào dưới thư mục `src/`.

---

## 1. Naming Conventions (Quy Tắc Đặt Tên)

*   **Components:** PascalCase (ví dụ: `ProductCard.tsx`).
*   **CSS Modules:** kebab-case (ví dụ: `product-card.module.css`).
*   **Hàm/Biến:** camelCase (ví dụ: `calculateCommission`, `productName`).
*   **Hằng số:** SCREAMING_SNAKE_CASE (ví dụ: `MAX_COMPARE_ITEMS = 3`).
*   **Hooks:** camelCase bắt đầu bằng `use` (ví dụ: `useProductCompare.ts`).
*   **Files / Utilities / Types:** kebab-case kèm suffix (ví dụ: `format-price.ts`, `product.types.ts`, `product.repository.ts`).

---

## 2. Component Architecture (Kiến Trúc Thành Phần)

*   **Server Component (Mặc định):** Tất cả các component mặc định là Server Component để phục vụ SSR/SSG. Chỉ thêm `'use client'` khi thực sự cần thiết (sử dụng hook react, event handler, browser api).
*   **Single Responsibility:** Mỗi component chỉ giải quyết một chức năng. Logic lấy dữ liệu phức tạp hoặc state của page nên được đóng gói vào Custom Hook hoặc Service Layer.
*   **Phân tầng Components:**
    *   `src/components/ui/` — Các component UI nguyên tử, tái sử dụng nhiều nơi (Button, Badge).
    *   `src/components/features/` — Logic của một tính năng cụ thể (ProductCard, MerchantCard).
    *   `src/components/layout/` — Layout tĩnh của trang (Header, Footer).

---

## 3. Clean Code Practices

*   **Hàm ngắn gọn:** Mỗi hàm chỉ làm một việc, đặt tên rõ nghĩa theo động từ (ví dụ: `formatVndPrice`).
*   **Early Return:** Tránh việc lồng nhiều tầng `if-else`. Hãy return ngay khi không thỏa mãn điều kiện.
*   **Tránh Magic Numbers:** Đóng gói các hằng số cấu hình vào constant có tên tự giải thích.
*   **Repository & Service Layers:**
    *   Query/Write DB: Viết trong `*.repository.ts`.
    *   Business Logic / Commission: Viết trong `*.service.ts`.
    *   Không gọi query trực tiếp trong Server Components/APIs, hãy gọi qua Repository/Service.
