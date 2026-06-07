# Semantic Knowledge Base — UI Component Design Patterns

Tài liệu này quy chuẩn hóa cách thiết kế, lập trình và sử dụng hệ thống Component trong dự án Hải Sản Cà Mau nhằm đảm bảo tính đồng nhất về mặt thẩm mỹ thương hiệu (Refined Minimalism) và hiệu suất render tốt nhất.

---

## 1. Sử Dụng Tailwind CSS v4 CSS-First

Dự án áp dụng TailwindCSS v4 css-first. Tất cả cấu hình đều nằm trong `src/app/globals.css` thông qua khối `@theme {}`.

### 1.1 Không Tạo File Config
*   **CẤM** tạo file `tailwind.config.js` hoặc `tailwind.config.ts`.
*   Tất cả các biến đăng ký trong `@theme` tự động trở thành các class tiện ích của Tailwind (ví dụ: `--color-primary` tạo ra `bg-primary`, `text-primary`, `border-primary`).

### 1.2 Cấm Hardcode Giá Trị
*   **CẤM** sử dụng các giá trị pixel thô tùy ý (arbitrary classes) trong code React:
    *   ❌ `className="rounded-[32px] p-[20px] bg-[#0D6EFD]"`
    *   ✅ `className="rounded-cards p-20 bg-primary"`
*   Mọi khoảng cách và góc bo phải lấy từ Spacing Scale và Border Radius đã đăng ký trong `globals.css`.

---

## 2. Định Dạng Viết Component Chuẩn

### 2.1 Server Components Mặc Định
Theo quy tắc Next.js App Router, tất cả component mặc định là Server Component để giảm bundle size gửi về client.
*   Chỉ khai báo `'use client'` ở dòng đầu tiên khi component thực sự cần:
    *   Sử dụng Hook: `useState`, `useEffect`, `useContext`, `useReducer`.
    *   Sử dụng Event Listeners: `onClick`, `onChange`, `onSubmit`.
    *   Sử dụng Web API của trình duyệt: `window`, `document`, `localStorage`.

### 2.2 Quy Tắc Trả Về Sớm (Early Return Pattern)
Tránh lồng ghép các khối điều kiện `if-else` phức tạp khiến code khó đọc. Hãy trả về kết quả hoặc render component rỗng sớm nhất có thể.

```typescript
// ❌ Cú pháp lồng ghép phức tạp
export default function ProductStatus({ isAvailable, isDeleted }) {
  return (
    <div>
      {!isDeleted ? (
        isAvailable ? (
          <span className="text-success">Còn hàng</span>
        ) : (
          <span className="text-muted">Hết hàng</span>
        )
      ) : (
        <span className="text-danger">Đã ngừng bán</span>
      )}
    </div>
  );
}

// ✅ Cú pháp Early Return sạch sẽ
export default function ProductStatus({ isAvailable, isDeleted }) {
  if (isDeleted) return <span className="text-danger">Đã ngừng bán</span>;
  if (!isAvailable) return <span className="text-muted">Hết hàng</span>;
  return <span className="text-success">Còn hàng</span>;
}
```

---

## 3. Phân Cấp Directory Component

Tất cả các component UI phải được lưu đúng vị trí theo chức năng:

1.  `src/components/ui/`: Các component nguyên tử độc lập (atomic elements), tái sử dụng cao, không chứa business logic hay gọi API:
    *   *Ví dụ:* `Button.tsx`, `Badge.tsx`, `Input.tsx`, `Card.tsx`.
2.  `src/components/features/`: Component liên quan đến nghiệp vụ/tính năng cụ thể, có thể chứa logic xử lý state:
    *   *Ví dụ:* `ProductCard.tsx`, `MerchantList.tsx`, `CartSummary.tsx`.
3.  `src/components/layout/`: Component định hình khung xương (layout) chung hoặc phần tĩnh của website:
    *   *Ví dụ:* `Header.tsx`, `Footer.tsx`, `Breadcrumb.tsx`.

---

## 4. Responsive & Mobile-First

Giao diện hải sản nhắm đến khách hàng mua lẻ qua điện thoại di động là chủ đạo. Mọi thiết kế layout phải đi từ mobile trước, sau đó mở rộng sang desktop bằng các breakpoints.

*   *Ví dụ card grid sản phẩm:*
    ```typescript
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20">
      {/* Product Cards */}
    </div>
    ```
*   *Góc bo và khoảng cách (Radii & Spacing):* Sử dụng các biến scale như `p-14` (mobile) -> `sm:p-20` (desktop) để tạo cảm giác thoáng đãng và sang trọng.
