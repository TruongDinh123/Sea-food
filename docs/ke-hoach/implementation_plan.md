# Kế Hoạch Triển Khai: Sprint 6 — Khắc Phục Lỗ Hổng Kiến Trúc (Hotfixes Gaps)

Tài liệu này chi tiết hóa các bước thực hiện để giải quyết 8 lỗ hổng (gaps) được phát hiện trong đợt Re-Review toàn diện dựa trên 4 nguồn NotebookLM, nhằm đưa hệ thống hạ tầng Agent và chuẩn kỹ thuật lên mức tối ưu nhất trước khi bước vào phát triển sản phẩm.

---

## User Review Required

> [!IMPORTANT]
> Cần lưu ý các thay đổi cấu trúc quan trọng sau:
> 1. Thư mục kỹ năng `seafood-content` sẽ được đổi tên thành `writing-seafood-content` (dạng gerund) theo đúng tiêu chuẩn Context Engineering.
> 2. Bổ sung `ProductGroup` schema vào danh mục template schema để phục vụ các sản phẩm hải sản có nhiều biến thể phân loại (như kích cỡ tôm sú).
> 3. Cập nhật các workflow (`.agents/workflows/*.md`) để bổ sung chỉ thị giới hạn số lần lặp (`maxIterations` / exit conditions) tránh vòng lặp vô hạn gây tốn token và tài nguyên.

---

## Proposed Changes

Chúng ta sẽ thực hiện chỉnh sửa và tạo mới các tệp tin trong các khu vực sau:

### 1. Chuẩn Hóa Skill `writing-seafood-content` (Thay thế `seafood-content`)
Đổi tên thư mục từ `seafood-content` sang `writing-seafood-content`. Đồng thời sửa đổi nội dung tệp tin để chuyển giọng văn sang ngôi thứ ba (third person) thay vì ngôi thứ hai.

#### [NEW] [SKILL.md](file:///e:/Web-Seo/.agents/skills/writing-seafood-content/SKILL.md)
Tạo mới file hướng dẫn kỹ năng viết nội dung hải sản chuẩn gerund và viết bằng ngôi thứ ba.

#### [NEW] [schema-templates.md](file:///e:/Web-Seo/.agents/skills/writing-seafood-content/assets/schema-templates.md)
Bổ sung thêm `ProductGroup` JSON-LD schema template phục vụ tôm sú phân loại theo size.

#### [NEW] Di chuyển các tệp assets và references khác:
- `assets/blog-template.md`
- `assets/product-description-template.md`
- `references/keywords.md`
- `references/tone-of-voice.md`

#### [DELETE] `e:\Web-Seo\.agents\skills\seafood-content\`
Xóa bỏ hoàn toàn thư mục cũ sau khi đã di chuyển thành công sang thư mục chuẩn gerund.

---

### 2. Cập Nhật Quy Tắc SEO Trong `AGENTS.md`
Cập nhật tệp quy tắc toàn cục để đưa vào 2 quy tắc SEO từ Google Search Central:
- **Canonical Pagination:** Trang phân trang (page 2, page 3...) phải canonical về chính nó, không được canonical về trang 1.
- **Pyramid Navigation Architecture:** Thiết kế liên kết nội bộ theo mô hình kim tự tháp (Homepage → Categories → Sub-categories → Products).

#### [MODIFY] [AGENTS.md](file:///e:/Web-Seo/AGENTS.md)

---

### 3. Thiết Lập Điều Kiện Dừng Cho Các Workflows
Thêm ràng buộc `maxIterations` hoặc chỉ thị thoát vòng lặp rõ ràng trong các file workflow của các agent để ngăn chặn loop vô hạn (Rogue Agent loop).

#### [MODIFY] Tất cả workflows trong [workflows/](file:///e:/Web-Seo/.agents/workflows/)
- `ba-sprint.md`, `dev-be-dat.md`, `dev-fe-dinh.md`, `dev-ops-duc.md`, `tech-lead-an.md`, `pm-quan.md`, `qa-vi.md`, `resume.md`

---

### 4. Tối Ưu Hóa Hook I/O Contract
Cập nhật script `load-working-memory.js` để có thể nhận input qua stdin và trả output qua stdout bằng JSON camelCase nếu cần, tuân thủ I/O contract của Antigravity CLI.

#### [MODIFY] [load-working-memory.js](file:///e:/Web-Seo/.agents/scripts/load-working-memory.js)

---

### 5. Cập Nhật Working Memory
Cập nhật trạng thái Sprint 6 vào `NOTES.md`.

#### [MODIFY] [NOTES.md](file:///e:/Web-Seo/docs/ky-uc/NOTES.md)

---

## Verification Plan

### Automated Tests
- Chạy `npm run lint` để kiểm tra xem có lỗi cú pháp hoặc ESLint nào không.
- Chạy thử nghiệm hook `node .agents/scripts/load-working-memory.js` để đảm bảo chạy thành công, không gặp lỗi runtime.

### Manual Verification
- Xác nhận thư mục kỹ năng mới đã được tạo và hoạt động bình thường qua cấu trúc tệp tin.
- Kiểm tra tính đúng đắn của JSON-LD template của `ProductGroup` schema.
