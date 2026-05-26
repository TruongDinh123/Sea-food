# Kế Hoạch Triển Khai: Đồng Bộ Design System Mới, Thiết Lập Hooks Bảo Mật & Xây Dựng Semantic Knowledge Base

Kế hoạch này giải quyết các xung đột thiết kế còn lại, chuyển đổi hoàn toàn từ cấu trúc cũ (phong cách Arc Boats: font Soehne, màu Deepwater Teal/Canvas) sang hệ thống thiết kế chuẩn theo quy tắc dự án (phong cách Fresh Seafood: font Be Vietnam Pro, màu Ocean Blue và Forest Green), bổ sung cơ chế kiểm soát bảo mật tự động thông qua git/tool hooks, và xây dựng Semantic Knowledge Base để lưu trữ tri thức bền vững cho dự án Hải Sản Cà Mau.

---

## User Review Required

> [!IMPORTANT]
> - **Chuyển Đổi Palette Màu Sắc & Font Chữ Chủ Đạo**: Ghi đè toàn bộ định nghĩa màu sắc và font chữ cũ của Arc Boats trong `Design_system/DESIGN.md`, `Design_system/token.json` và `@theme` trong `src/app/globals.css` để dùng màu của Fresh Seafood:
>   - Primary: Ocean Blue (`#0D6EFD`, hover `#0b5ed7`, active `#0a58ca`)
>   - Secondary: Forest Green (`#198754`, hover `#157347`)
>   - Background: Slate 50 (`#f8f9fa`)
>   - Font: Be Vietnam Pro (`var(--font-be-vietnam-pro)`)
> - **Thiết Lập Hook Bảo Mật PreToolUse**: Cấu hình hook `PreToolUse` gọi script Node.js kiểm tra tự động trước khi chạy bất kỳ tool nào (đặc biệt là `run_command`). Script sẽ chặn và báo lỗi nếu phát hiện câu lệnh huỷ hoại nguy hiểm như `DROP TABLE`, `TRUNCATE`, `DELETE` không có `WHERE`, `rm`, `rmdir`, `git reset --hard` trừ khi được bypass hoặc phê duyệt rõ ràng.
> - **Xây Dựng Semantic Knowledge Base**: Tạo thư mục `docs/knowledge/` để lưu trữ tri thức đặc thù dự án (Database Schema Facts, SEO Patterns, Component Design Patterns).

---

## Open Questions

> [!NOTE]
> *Không có câu hỏi mở cần làm rõ. Việc thực thi sẽ tuân thủ nghiêm ngặt bảng màu Fresh Seafood và Be Vietnam Pro theo `.agents/rules/Design.md`.*

---

## Proposed Changes

### 1. Đồng Bộ Hóa Hệ Thống Thiết Kế (Design System & CSS)

#### [MODIFY] [DESIGN.md](file:///e:/Web-Seo/Design_system/DESIGN.md)
* Đổi tiêu đề và triết lý thiết kế từ "Arc — Style Reference (Deepwater Teal / dark)" sang "Hải Sản Cà Mau — Style Reference (Fresh Seafood / light)".
* Thay thế font Soehne bằng `Be Vietnam Pro` (mặc định) và `JetBrains Mono` (mono).
* Cập nhật các token màu sắc Primitive & Semantic từ Deepwater Teal/Canvas sang Ocean Blue (`#0D6EFD`), Forest Green (`#198754`), Slate 50 (`#f8f9fa`).
* Cập nhật component specifications (Buttons, Inputs, Cards) để phản ánh bảng màu mới.

#### [MODIFY] [token.json](file:///e:/Web-Seo/Design_system/token.json)
* Đổi font family mặc định từ Soehne sang `Be Vietnam Pro`.
* Đổi toàn bộ các token màu gốc (color, surface) sang Fresh Seafood palette (`#0D6EFD`, `#198754`, `#f8f9fa`, v.v.).

#### [MODIFY] [globals.css](file:///e:/Web-Seo/src/app/globals.css)
* Điều chỉnh khối `@theme` của Tailwind v4 để loại bỏ các biến màu cũ (`deepwater-teal`, `canvas`, `ink-black`) và thay bằng Fresh Seafood palette chuẩn:
  * `--color-primary`: `#0D6EFD`
  * `--color-primary-hover`: `#0b5ed7`
  * `--color-secondary`: `#198754`
  * `--color-bg`: `#f8f9fa`
  * `--color-surface`: `#ffffff`
  * `--color-border`: `#e9ecef`
* Đồng bộ hoá font chữ chính `--font-sans` trỏ tới `Be Vietnam Pro`.

---

### 2. Thiết Lập Hooks Bảo Mật

#### [NEW] [validate-destructive-commands.js](file:///e:/Web-Seo/.agents/scripts/validate-destructive-commands.js)
* Tạo script Node.js kiểm tra môi trường và tham số tool từ `process.env.TOOL_NAME` và `process.env.TOOL_ARGS`.
* Nếu `TOOL_NAME` là `run_command`, parse lệnh trong `CommandLine` để quét các từ khoá nguy hiểm: `DROP TABLE`, `TRUNCATE`, `DELETE` không có `WHERE`, `rm -rf` hoặc `rmdir` trên các thư mục quan trọng, `git reset --hard` phá hoại code.
* In ra lỗi cảnh báo bảo mật nếu phát hiện vi phạm và thoát với exit code `1` để block công cụ thực thi.

#### [MODIFY] [hooks.json](file:///e:/Web-Seo/.agents/hooks.json)
* Khai báo trong `"PreToolUse"` để tự động chạy script `node .agents/scripts/validate-destructive-commands.js` trước khi IDE thực thi bất kỳ tool nào.

---

### 3. Xây Dựng Semantic Knowledge Base

#### [NEW] [database-schema.md](file:///e:/Web-Seo/docs/knowledge/database-schema.md)
* Tài liệu hóa cấu trúc schema hiện tại từ PostgreSQL (Supabase) gồm các bảng `merchants`, `products`, `referral_logs`, kiểu dữ liệu, chỉ mục (indexes), các ràng buộc (constraints) và chính sách RLS (Row Level Security).

#### [NEW] [seo-patterns.md](file:///e:/Web-Seo/docs/knowledge/seo-patterns.md)
* Tài liệu hóa các mô thức SEO thực tế của dự án: cấu trúc Pyramid links, quy tắc canonical tự trỏ trên trang phân trang, ProductGroup JSON-LD schema, dynamic metadata generator, và sitemap/robots.

#### [NEW] [component-patterns.md](file:///e:/Web-Seo/docs/knowledge/component-patterns.md)
* Hướng dẫn thiết kế component theo Tailwind v4, mobile-first, cách sử dụng các CSS variables và component-tokens chuẩn thay vì code arbitrary pixel.

---

### 4. Chuẩn Hóa Tham Chiếu & Quản Lý Dữ Liệu

#### [MODIFY] [SKILL.md](file:///e:/Web-Seo/.agents/skills/session-manager/SKILL.md)
* Sửa các relative link ambiguous sang absolute Markdown link chuẩn IDE (vd: `[GUARDRAILS.md](file:///e:/Web-Seo/GUARDRAILS.md)`).

#### [NEW] [README.md](file:///e:/Web-Seo/.agents/data/README.md)
* Tài liệu hóa mục đích của thư mục `.agents/data/` (chứa session metrics, cached data, gitignored logs).

#### [MODIFY] [NOTES.md](file:///e:/Web-Seo/docs/ky-uc/NOTES.md) & [GUARDRAILS.md](file:///e:/Web-Seo/GUARDRAILS.md)
* Cập nhật quy chế tự động nén ký ức (compaction) và chính sách archive các sessions cũ hơn 30 ngày (di chuyển files log cũ vào thư mục lưu trữ nén, cập nhật file chỉ mục).

---

## Verification Plan

### Automated Tests
* Chạy kiểm tra cú pháp và build để đảm bảo hệ thống thiết kế mới không gây lỗi compile:
  ```bash
  npm run lint
  npm run build
  ```
* Chạy thử script kiểm tra lệnh nguy hiểm để xem nó hoạt động chính xác:
  ```bash
  node .agents/scripts/validate-destructive-commands.js
  ```

### Manual Verification
* Xác minh trên trình duyệt xem màu sắc giao diện đã chuyển đổi thành công sang màu Ocean Blue / Forest Green, font chữ `Be Vietnam Pro` hiển thị mượt mà.
