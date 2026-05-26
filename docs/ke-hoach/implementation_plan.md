# Kế Hoạch Triển Khai: Tối Ưu Hóa Cấu Trúc .agents, Sửa Lỗi Git Hooks & Áp Dụng Triệt Để Design System

Kế hoạch này tập trung vào việc tối ưu hóa cấu hình `.agents`, sửa lỗi Husky Git hooks trên Windows, và đồng bộ hóa, áp dụng triệt để hệ thống Design System từ thư mục `Design_system` vào toàn bộ dự án Frontend, đồng thời đổi font mặc định sang `Be Vietnam Pro` để hỗ trợ hiển thị Tiếng Việt tốt nhất.

---

## User Review Required

> [!IMPORTANT]
> - **In thông số Token tự động**: Để khắc phục tình trạng IDE nuốt log từ hook, tôi (AI) sẽ tự động in thủ công thông số Input/Output Token và Turn ước tính ở cuối mỗi phản hồi của tôi trong cuộc hội thoại. Đồng thời, sửa lại đường dẫn động trong script đo token để tránh crash trên Windows.
> - **Chuyển đổi font mặc định sang Be Vietnam Pro**: `Design_system/DESIGN.md` yêu cầu font `Soehne` (substitute `Inter`), nhưng `GEMINI.md` của dự án yêu cầu dùng font `Be Vietnam Pro` để tối ưu hiển thị Tiếng Việt. Chúng ta sẽ cấu hình `Be Vietnam Pro` làm font chính (`--font-sans`) và import từ Google Fonts.
> - **Áp dụng triệt để Design System**: Di chuyển toàn bộ định nghĩa biến CSS từ `Design_system/variable.css` và `@theme` từ `Design_system/theme.css` vào `src/app/globals.css`. Cập nhật các component UI để sử dụng các class Tailwind v4 chuẩn của hệ thống thiết kế (ví dụ: `rounded-cards` thay thế cho `rounded-[32px]`, `rounded-buttons` thay thế cho `rounded-[5px]`).
> - **Nới lỏng phân vai**: Cho phép Antigravity hoạt động dưới dạng **Fullstack Developer** khi tương tác trực tiếp với người dùng thay vì bị giới hạn miền hoạt động nghiêm ngặt như trước.

---

## Open Questions

> [!NOTE]
> *Không có câu hỏi mở cần làm rõ. Việc tích hợp sẽ tuân thủ nghiêm ngặt các giá trị token màu sắc và khoảng cách trong thư mục `Design_system/`.*

---

## Proposed Changes

### 1. Đồng bộ hóa Design System & Font chữ

#### [MODIFY] [globals.css](file:///e:/Web-Seo/src/app/globals.css)
* Đồng bộ hóa hoàn toàn các token từ `Design_system/variable.css` (màu sắc, typography, spacing, border-radius, shadows, surfaces) vào `@theme` của Tailwind v4.
* Khai báo font `--font-sans` map với font `Be Vietnam Pro` để hỗ trợ hiển thị tiếng Việt hoàn hảo.
* Định nghĩa đầy đủ các custom utility classes (`rounded-cards`, `rounded-buttons`, `rounded-inputs`, `rounded-navigation`, `rounded-ghost-buttons`, `shadow-md`, `bg-deepwater-teal`, v.v.).

#### [MODIFY] [layout.tsx](file:///e:/Web-Seo/src/app/layout.tsx)
* Đổi import font `Inter` thành `Be_Vietnam_Pro` từ `next/font/google`.
* Khai báo và nạp biến font `Be Vietnam Pro` làm `--font-sans` chính cho thẻ `html`/`body`.

#### [MODIFY] các trang và component UI:
* [page.tsx](file:///e:/Web-Seo/src/app/page.tsx)
* [Header.tsx](file:///e:/Web-Seo/src/components/layout/Header.tsx)
* [Footer.tsx](file:///e:/Web-Seo/src/components/layout/Footer.tsx)
* [Breadcrumb.tsx](file:///e:/Web-Seo/src/components/layout/Breadcrumb.tsx)
* [san-pham/page.tsx](file:///e:/Web-Seo/src/app/(catalog)/san-pham/page.tsx)
* [thuong-lai/page.tsx](file:///e:/Web-Seo/src/app/thuong-lai/page.tsx)
* *Nội dung sửa đổi*: Thay thế các arbitrary classes pixel cứng (như `rounded-[32px]`, `rounded-[5px]`, `py-[100px]`, `tracking-[-0.77px]`) bằng các class Tailwind v4 được đăng ký từ Design System (như `rounded-cards`, `rounded-buttons`, `py-100` hoặc class tiện ích tương ứng).

---

### 2. Tối ưu hóa cấu hình `.agents` & In Token

#### [MODIFY] [hooks.json](file:///e:/Web-Seo/.agents/hooks.json)
* Loại bỏ hook `PostToolUse` tự động chạy `npm run lint` sau mỗi lần ghi file để tránh chậm hệ thống trên Windows.
* Tối giản hóa hook `PreInvocation` và `PostInvocation` đo token.

#### [MODIFY] [calculate-current-turn-tokens.js](file:///e:/Web-Seo/.agents/scripts/calculate-current-turn-tokens.js)
* Chuyển `brainDir` thành tìm kiếm động (dynamic directory path) sử dụng biến môi trường `USERPROFILE` hoặc quét từ workspace để tương thích 100% với Windows của người dùng mà không bị fix cứng đường dẫn tuyệt đối.

#### [MODIFY] [AGENTS.md](file:///e:/Web-Seo/AGENTS.md) & [GEMINI.md](file:///e:/Web-Seo/GEMINI.md)
* Điều chỉnh quy tắc phân vai để nới lỏng miền hoạt động của Antigravity khi ở chế độ Single Agent trực tiếp với người dùng.

---

### 3. Sửa lỗi Git Hooks

#### [MODIFY] [commit-msg](file:///e:/Web-Seo/.husky/commit-msg)
* Bổ sung dòng shebang shell `#!/bin/sh` và nạp husky script chính xác để Git Windows có thể chạy thành công qua sh shell.

---

## Verification Plan

### Automated Tests
* Chạy build và lint dự án để đảm bảo font mới và cấu hình Design System không bị lỗi compile:
  ```bash
  npm run lint
  npm run build
  ```
* Chạy thử script đo token để kiểm tra tính tương thích đường dẫn động:
  ```bash
  node .agents/scripts/calculate-current-turn-tokens.js
  ```
* Thử chạy lệnh Git commit sửa đổi để kiểm tra Husky hook:
  ```bash
  git commit --amend --no-edit
  ```

### Manual Verification
* Kiểm tra trực tiếp trên trình duyệt giao diện trang chủ, trang sản phẩm và thương lái xem font chữ hiển thị chuẩn `Be Vietnam Pro` (tiếng Việt không bị lỗi font) và các góc bo (radius-cards, buttons) hoạt động chính xác theo Design System.
