---
name: session-manager
description: Quản lý vòng đời phiên làm việc — bắt đầu phiên mới, lưu trạng thái khi kết thúc, và khôi phục ngữ cảnh khi tiếp tục. Dùng khi cần /handoff hoặc /resume.
---

# Kỹ Năng: Quản Lý Phiên Làm Việc (Session Manager)

Kỹ năng này cung cấp giao thức chuẩn để agent duy trì ngữ cảnh liên tục qua nhiều phiên làm việc, chống context rot và đảm bảo không mất thông tin quan trọng giữa các session.

> **Tại sao cần skill này?** Context rot xảy ra sau ~1 giờ — agent quên constraints, import file không tồn tại, đặt tên biến không nhất quán. NOTES.md là "RAM" ngoài context window.

---

## Khi Nào Kích Hoạt

- Người dùng gõ `/handoff` → Kích hoạt **Quy Trình Kết Thúc Phiên**
- Người dùng gõ `/resume` → Kích hoạt **Quy Trình Bắt Đầu Phiên Mới**
- Phiên làm việc kéo dài > 45 phút → Chủ động đề nghị lưu trạng thái
- Sau mỗi task lớn hoàn thành → Cập nhật NOTES.md tự động

---

## Quy Trình A: Bắt Đầu Phiên (Start Session)

### A1. Đọc Working Memory
```
1. Đọc docs/ky-uc/NOTES.md
2. Tóm tắt cho người dùng:
   - Đang ở đâu? (task nào, bước nào)
   - Vấn đề kỹ thuật nào cần nhớ?
   - Files nào vừa được tạo/sửa?
```

### A2. Kiểm Tra Git State
```bash
git status          # uncommitted changes?
git log --oneline -5  # commits gần nhất
```

Nếu có uncommitted changes → Hỏi người dùng muốn commit hay discard.

### A3. Kiểm Tra Build
```bash
npm run build
```
- ✅ Pass → Thông báo "Dự án ổn định, sẵn sàng làm việc"
- ❌ Fail → Hiển thị lỗi, đề nghị sửa trước khi tiếp tục

### A4. Xác Nhận Hướng Tiếp Tục
Trình bày 3 lựa chọn:
```
A. Tiếp tục task đang dở: [Tên task từ NOTES.md]
B. Task tiếp theo: [Tên task kế trong sprint]
C. Task mới theo yêu cầu người dùng
```

---

## Quy Trình B: Kết Thúc Phiên (Handoff)

### B1. Tạo Summary Của Phiên

Thu thập thông tin:
- Files nào đã tạo/sửa trong phiên này?
- Task nào đã hoàn thành?
- Task nào đang dở (đang ở bước nào)?
- Có bug/issue nào phát hiện chưa giải quyết?
- Có quyết định kỹ thuật nào đã đưa ra?

### B2. Cập Nhật `docs/ky-uc/NOTES.md`

Cập nhật 3 sections theo format:

```markdown
## 📍 Trạng Thái Hiện Tại
**Đang làm:** [Sprint X] — Task [Y]: [Tên task]
**Tiến độ:** [X/Y tasks hoàn thành]
**Bước tiếp theo:** [Mô tả cụ thể bước tiếp theo]

## 📁 Files Đã Tạo / Sửa (Phiên [Ngày])
| File | Hành Động | Mô Tả Ngắn |
|---|---|---|
| [path] | TẠO MỚI / SỬA | [mô tả] |

## ⚠️ Gotchas & Constraints Quan Trọng
[Thêm nếu phát hiện constraint mới]
```

### B3. Kiểm Tra GUARDRAILS.md

Nếu phát hiện failure pattern mới trong phiên → Thêm vào `GUARDRAILS.md`:
```markdown
### [YYYY-MM-DD] SEVERITY: Tên Pattern
**Pattern vi phạm:** ...
**Tác động:** ...
**Guardrail:** ...
```

### B4. Tạo SESSION_STATUS.md

Tạo file `docs/ky-uc/ky-uc-hien-tai/[YYYY-MM-DD]-session-[N]/SESSION_STATUS.md`:

```markdown
# Session [N] — [YYYY-MM-DD]

## Tóm Tắt
[1-2 câu mô tả phiên này đã làm gì]

## Hoàn Thành
- [x] [Task đã xong]
- [x] [Task đã xong]

## Chưa Xong
- [ ] [Task còn dở — đang ở bước nào]

## Quyết Định Kỹ Thuật
- [Quyết định + lý do]

## Cần Làm Tiếp
1. [Bước cụ thể tiếp theo]
2. [...]
```

### B5. Git Commit Nếu Có Thay Đổi

```bash
git add .
git commit -m "chore(session): handoff - [mô tả phiên]"
```

*Không push lên main trực tiếp — chỉ commit local hoặc lên feature branch.*

---

## Quy Trình C: Cập Nhật Giữa Phiên (Mid-Session Update)

Kích hoạt sau mỗi task lớn hoàn thành, **không cần chờ đến cuối phiên**:

1. Cập nhật section "Trạng Thái Hiện Tại" trong NOTES.md
2. Thêm files vừa tạo/sửa vào bảng "Files Đã Tạo/Sửa"
3. Nếu có gotcha mới → Thêm ngay vào GUARDRAILS.md

> *Nguyên tắc: Luôn giả định context window có thể reset bất kỳ lúc nào.*

---

## Tham Chiếu

- `docs/ky-uc/NOTES.md` — Working memory chính
- `GUARDRAILS.md` — Failure patterns
- `docs/ky-uc/ky-uc-hien-tai/` — Session history
- `AGENTS.md` — Persistent rules (đọc mỗi phiên)
