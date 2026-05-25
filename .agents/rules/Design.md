# rule: design
# description: Design System contract — tất cả agents frontend PHẢI đọc trước khi sửa bất kỳ file UI nào
# glob: src/components/**/*, src/app/**/*
# ---

# 🎨 Design System Contract — Hải Sản Cà Mau

> **BẮT BUỘC:** Agent `dev-fe-dinh` và bất kỳ agent nào làm việc với UI PHẢI đọc toàn bộ file này trước khi viết hoặc sửa bất kỳ component nào. Đây là nguồn sự thật duy nhất (single source of truth) cho thiết kế.

---

## 1. Design Philosophy (Triết Lý Thiết Kế)

Giao diện phải truyền đạt cảm giác **tươi mới, đáng tin cậy và chuyên nghiệp**. Cảm hứng từ bờ biển Cà Mau — sạch sẽ, thoáng đãng, mang hơi thở biển cả Việt Nam hiện đại.

- **Không** làm giao diện "chợ cóc" hoặc quá phức tạp.
- **Có** sự tương phản rõ ràng giữa các vùng nội dung.
- **Ưu tiên** trải nghiệm mobile-first, sau đó desktop.

---

## 2. Typography (Chữ)

> **Font mặc định:** `Be Vietnam Pro` từ Google Fonts (hỗ trợ tốt nhất cho Tiếng Việt).
> **Fallback:** `system-ui, sans-serif`

| Token CSS | Giá Trị | Sử Dụng |
|---|---|---|
| `--font-sans` | `"Be Vietnam Pro", system-ui, sans-serif` | Font chính toàn site |
| `--font-mono` | `"JetBrains Mono", monospace` | Code snippets, giá cả dạng số |

**Quy tắc dùng font:**
- Heading (h1–h3): `font-weight: 700` (Bold).
- Body text: `font-weight: 400` (Regular).
- Captions, badges: `font-weight: 500` (Medium).
- **KHÔNG** dùng font chữ khác ngoài danh sách trên.

---

## 3. Color Palette & Design Tokens (Bảng Màu & Token)

> **Tất cả màu trong component PHẢI dùng CSS variables — TUYỆT ĐỐI KHÔNG hardcode hex.**

### 3.1 Primitive Tokens (Màu Thô — Định nghĩa trong `globals.css`)

```css
/* Primitive — không dùng trực tiếp trong component */
--color-ocean-500: #0D6EFD;
--color-ocean-600: #0b5ed7;
--color-ocean-700: #0a58ca;
--color-forest-500: #198754;
--color-forest-600: #157347;
--color-coral-500: #dc3545;
--color-amber-500: #ffc107;
--color-slate-50:  #f8f9fa;
--color-slate-100: #f1f3f5;
--color-slate-200: #e9ecef;
--color-slate-500: #6c757d;
--color-slate-700: #495057;
--color-slate-900: #212529;
```

### 3.2 Semantic Tokens (Token Ngữ Nghĩa — Dùng trong component)

```css
/* Brand colors */
--color-primary:        var(--color-ocean-500);   /* Xanh biển — tươi mới, tin tưởng */
--color-primary-hover:  var(--color-ocean-600);
--color-primary-active: var(--color-ocean-700);

--color-secondary:      var(--color-forest-500);  /* Xanh lá — hải sản tươi, thiên nhiên */
--color-secondary-hover:var(--color-forest-600);

/* Feedback colors */
--color-danger:  var(--color-coral-500);
--color-warning: var(--color-amber-500);
--color-success: var(--color-forest-500);

/* Neutral / UI */
--color-bg:           var(--color-slate-50);
--color-surface:      #ffffff;
--color-surface-alt:  var(--color-slate-100);
--color-border:       var(--color-slate-200);
--color-text-base:    var(--color-slate-900);
--color-text-muted:   var(--color-slate-500);
--color-text-inverse: #ffffff;
```

### 3.3 Component Tokens (Token Component — Override cụ thể)

```css
/* Buttons */
--btn-primary-bg:      var(--color-primary);
--btn-primary-text:    var(--color-text-inverse);
--btn-primary-hover:   var(--color-primary-hover);

/* Cards */
--card-bg:       var(--color-surface);
--card-border:   var(--color-border);
--card-radius:   0.75rem;   /* rounded-xl */
--card-shadow:   0 1px 3px rgba(0,0,0,0.08);

/* Navigation */
--nav-bg:         var(--color-surface);
--nav-border:     var(--color-border);
--nav-link-hover: var(--color-primary);
```

---

## 4. Spacing & Layout (Khoảng Cách & Bố Cục)

```css
/* Container max-widths */
--container-sm:  640px;
--container-md:  768px;
--container-lg:  1024px;
--container-xl:  1280px;

/* Section padding */
--section-py: 4rem;      /* padding top/bottom cho section */
--section-px: 1rem;      /* padding ngang mobile */

/* Border radius */
--radius-sm:  0.25rem;   /* rounded */
--radius-md:  0.5rem;    /* rounded-lg */
--radius-lg:  0.75rem;   /* rounded-xl */
--radius-full: 9999px;   /* pill / badge */
```

**Quy tắc grid:**
- Layout chính: 12 cột.
- Card grid sản phẩm: 1 cột (mobile) → 2 cột (tablet) → 3–4 cột (desktop).
- Sidebar layout: 1/4 sidebar + 3/4 content trên desktop.

---

## 5. Component Design Language (Ngôn Ngữ Thiết Kế Component)

### Cards
- Bo góc: `rounded-xl` (`--card-radius: 0.75rem`)
- Shadow: nhẹ `shadow-sm` (`--card-shadow`)
- Border: 1px `border-border` (`--card-border`)
- **KHÔNG** dùng card phẳng không border, không shadow.
- Hover state: `shadow-md`, translate-y -2px với transition 150ms.

### Buttons
- Primary: nền `--btn-primary-bg`, chữ trắng, `rounded-lg`, padding `0.625rem 1.25rem`.
- Secondary: outline style, border `--color-primary`, chữ `--color-primary`.
- Kích thước: sm, md (default), lg.
- **KHÔNG** dùng màu nút thuần đỏ/xanh lá thô — phải dùng semantic token.

### Badges / Tags
- Bo tròn pill: `rounded-full`.
- Màu theo loại: `bg-primary/10 text-primary` cho trạng thái mặc định.
- Sản phẩm: `bg-secondary/10 text-secondary` cho "Tươi sống", "Khô", v.v.

### Navigation
- Desktop: horizontal nav với `Link` Next.js (KHÔNG dùng `<a>` thường hoặc onClick).
- Mobile: hamburger menu, full-screen overlay.
- Active state: border-bottom 2px `--color-primary`.

---

## 6. Icon System (Biểu Tượng)

- **Thư viện:** `lucide-react`
- **Kích thước mặc định:** 20px (inline), 24px (standalone).
- **KHÔNG** dùng emoji làm icon trong UI chính thức.
- **KHÔNG** mix icon từ nhiều thư viện khác nhau.

---

## 7. Forbidden Patterns — CẤM TUYỆT ĐỐI (Agent không được làm)

```
❌ KHÔNG hardcode màu hex:        style={{ color: '#0D6EFD' }}
❌ KHÔNG dùng inline style cho layout: style={{ marginTop: '16px' }}
❌ KHÔNG dùng Tailwind arbitrary values cho màu: bg-[#0D6EFD]
❌ KHÔNG dùng font-family trực tiếp: font-family: Arial
❌ KHÔNG dùng onclick để navigate: onClick={() => router.push('/...')}
❌ KHÔNG để alt="" rỗng cho ảnh sản phẩm
❌ KHÔNG dùng nhiều hơn 1 thẻ <h1> trên một trang
❌ KHÔNG canonical trang phân trang về trang 1
```

---

## 8. Tailwind v4 CSS-First Rules (Quy Tắc Tailwind)

- **KHÔNG có `tailwind.config.js`** — tất cả config trong `globals.css` với `@theme {}`.
- Tất cả token trong `@theme` tự động trở thành Tailwind utilities:
  - `--color-primary` → `bg-primary`, `text-primary`, `border-primary`
  - `--font-sans` → `font-sans`
  - `--radius-lg` → sử dụng `rounded-[var(--radius-lg)]` hoặc đặt shorthand trong theme
- Khi viết Tailwind classes, **ưu tiên semantic utilities** thay vì arbitrary:
  - ✅ `bg-primary text-white`
  - ❌ `bg-[#0D6EFD] text-[#ffffff]`

---

## 9. Khi Bạn Thêm File Design System Thực Tế

> Khi bạn (người dùng) thêm file Design.md, globals.css, và CSS variables từ project khác, các giá trị Primitive Tokens trong Section 3.1 sẽ được ghi đè bởi file đó. Agent PHẢI dùng giá trị từ file thực tế, không phải placeholder trong file này.

**Vị trí file sẽ được thêm:**
- `src/app/globals.css` — chứa `@theme {}` với tất cả CSS variables
- Bất kỳ file design token nào khác từ project gốc

---

*File này được enforce tự động khi agent chỉnh sửa bất kỳ file nào trong `src/components/**/*` hoặc `src/app/**/*`.*
*Review khi: thêm màu mới, thêm component pattern mới, hoặc khi thay đổi Design System từ project gốc.*
