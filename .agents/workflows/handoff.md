---
title: handoff
description: Đóng phiên làm việc hiện tại. Thực hiện build kiểm tra, ghi nhận các thay đổi và lập danh sách việc cần làm tiếp theo vào SESSION_STATUS.md.
maxIterations: 10
---

# 🔁 Workflow: Handoff — Bàn Giao Phiên Làm Việc

> Mục tiêu: Đảm bảo agent kế tiếp (hoặc bạn ở phiên mới) có đủ **ngữ cảnh đầy đủ** để tiếp tục ngay mà không cần giải thích lại từ đầu.

---

## Bước 1: Kiểm Tra Sức Khỏe Dự Án

Chạy tuần tự và ghi lại kết quả:

```bash
npm run type-check
```
- ✅ Thành công → Ghi "TYPE-CHECK: PASS" vào SESSION_STATUS
- ❌ Thất bại → **Phải sửa trước khi bàn giao.** Ghi rõ lỗi và hành động sửa chữa.

```bash
npm run lint
```
- ✅ Không lỗi → Ghi "LINT: PASS"
- ❌ Có lỗi → Cố gắng sửa; nếu không sửa được, ghi rõ lỗi còn tồn đọng.

---

## Bước 2: Tạo Context Snapshot (Git Diff)

Chạy các lệnh sau và **đưa output vào SESSION_STATUS.md**:

```bash
# Xem 5 commit gần nhất
git log --oneline -5

# Xem các file đã thay đổi kể từ commit cuối
git diff --stat HEAD

# Xem các file đang staged (chưa commit)
git status --short
```

Nếu có file chưa commit, hỏi người dùng có muốn commit trước khi handoff không.

---

## Bước 3: Tạo Tài Liệu SESSION_STATUS.md

1. Xác định số thứ tự phiên tiếp theo: Xem thư mục `docs/ky-uc/ky-uc-hien-tai/` để tìm session folder mới nhất, tăng số lên 1.
2. Tạo thư mục: `docs/ky-uc/ky-uc-hien-tai/yyyy-mm-dd-session-XXX/`
3. Tạo file `SESSION_STATUS.md` với format sau:

```markdown
# SESSION_STATUS — [Ngày] | Session [XXX]

## 🏥 Sức Khỏe Dự Án
- **Type Check:** PASS / FAIL [Ghi rõ lỗi nếu FAIL]
- **Lint:** PASS / FAIL [Ghi rõ lỗi nếu FAIL]
- **Tests:** PASS / FAIL / N/A

## 📦 Git Snapshot
- **Commit cuối:** [hash] [message]
- **Files đã thay đổi phiên này:**
  - `[đường dẫn file]` — [Mô tả thay đổi ngắn gọn]
  - ...
- **Files chưa commit (nếu có):** [Liệt kê hoặc "Không có"]

## ✅ Đã Hoàn Thành
- [Nhiệm vụ 1 đã xong]
- [Nhiệm vụ 2 đã xong]

## 🔄 Đang Dang Dở
- [Task đang làm, đang ở bước nào, vấn đề gì]

## 📋 Việc Cần Làm Tiếp Theo (Ưu Tiên Cao → Thấp)
1. **[P0]** [Việc quan trọng nhất] → Gọi workflow: `/dev-be-dat` / `/dev-fe-dinh`
2. **[P1]** [Việc tiếp theo]
3. **[P2]** [Việc ít quan trọng hơn]

## 🧠 Quyết Định Kỹ Thuật Quan Trọng Đã Đưa Ra
- **[Quyết định]:** [Lý do — để agent kế tiếp không đặt câu hỏi lại]
- ...

## ⚠️ Gotchas & Cảnh Báo
- [Những vấn đề kỹ thuật, edge case, hoặc rủi ro agent kế tiếp cần biết]
- ...
```

---

## Bước 4: Thông Báo Bàn Giao

In ra thông điệp ngắn gọn cho người dùng:

```
✅ Handoff hoàn tất!

📂 SESSION_STATUS.md đã được lưu tại:
   docs/ky-uc/ky-uc-hien-tai/[yyyy-mm-dd-session-XXX]/SESSION_STATUS.md

🚀 Để tiếp tục ở phiên mới:
   1. Tạo cuộc hội thoại mới với Antigravity
   2. Gõ lệnh /resume
   3. Agent sẽ đọc SESSION_STATUS.md và hỏi bạn muốn tiếp tục gì
```

