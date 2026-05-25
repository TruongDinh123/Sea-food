---
description: Tiếp tục công việc từ phiên trước — đọc SESSION_STATUS.md, nắm ngữ cảnh và tiếp tục task còn dang dở.
---

# ▶️ Resume — Tiếp Tục Phiên Làm Việc

Workflow này giúp bạn khôi phục ngữ cảnh từ phiên trước và tiếp tục làm việc ngay mà không cần giải thích lại từ đầu.

---

## Phạm Vi & Giới Hạn

**Giới hạn số vòng lặp (maxIterations):** Giới hạn tối đa **10 vòng lặp** (iterations) cho mỗi phiên làm việc để tránh loop vô hạn. Nếu vượt quá giới hạn này mà chưa hoàn thành, dừng lại và yêu cầu hướng dẫn của người dùng.

---

## Bước 1: Tìm Phiên Gần Nhất

1. Kiểm tra thư mục `docs/ky-uc/ky-uc-hien-tai/` để tìm file `SESSION_STATUS.md` mới nhất.
2. Nếu có nhiều session folder, chọn folder có ngày mới nhất.

---

## Bước 2: Đọc Trạng Thái Phiên

Đọc toàn bộ `SESSION_STATUS.md` và tóm tắt cho người dùng:

```
📋 TÓM TẮT PHIÊN TRƯỚC:

📅 Ngày: [ngày phiên trước]
✅ Đã hoàn thành:
   - [Danh sách task đã xong]

🔄 Đang dang dở:
   - [Task chưa xong, đang ở đâu]

📋 Việc cần làm tiếp theo:
   - [Danh sách task tiếp theo]

⚠️ Lưu ý quan trọng:
   - [Các gotcha, vấn đề kỹ thuật cần nhớ]
```

---

## Bước 3: Kiểm Tra Trạng Thái Code

1. Chạy `git status` để xem có uncommitted changes không.
2. Chạy `git log --oneline -5` để xem commits gần nhất.
3. Nếu có uncommitted changes → báo cáo và hỏi người dùng cách xử lý.

---

## Bước 4: Xác Nhận Và Tiếp Tục

Hỏi người dùng:

> "Tôi đã nắm được ngữ cảnh từ phiên trước. Bạn muốn:
> - **[A] Tiếp tục task đang dở:** [Tên task dang dở]
> - **[B] Bắt đầu task mới:** [Tên task tiếp theo trong danh sách]
> - **[C] Thay đổi ưu tiên:** Bạn muốn làm gì khác hôm nay?"

Sau khi người dùng chọn, kích hoạt workflow tương ứng:
- Nếu task là Backend → `/dev-be-dat`
- Nếu task là Frontend → `/dev-fe-dinh`
- Nếu task là QA → `/qa-vi`
- Nếu task là kiến trúc → `/tech-lead-an`