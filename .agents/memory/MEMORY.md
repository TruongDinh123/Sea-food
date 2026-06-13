# 🧠 Agent Memory Index

> **Mục đích:** File này là chỉ mục trỏ đến các file bộ nhớ chuyên biệt.  
> **Giao thức:** Đọc file này TRƯỚC TIÊN khi bắt đầu phiên. Sau mỗi task lớn, CẬP NHẬT file liên quan.

---

## 📋 Quy Tắc Ghi Nhớ (Role-Based Memory Isolation)

| Loại Tác Tự | Quyền Ghi | Quyền Đọc | File Đích |
|:---|:---:|:---:|:---|
| **Tech Lead / Antigravity** | ✅ Tất cả | ✅ Tất cả | Tất cả file bên dưới |
| **Frontend Agent** | ✅ `ui-patterns.md`, `tech-stack.md` | ✅ Tất cả | Chỉ ghi vào domain của mình |
| **Backend Agent** | ✅ `architecture-decisions.md`, `known-issues.md` | ✅ Tất cả | Chỉ ghi vào domain của mình |
| **QA Agent** | ✅ `known-issues.md` | ✅ Tất cả | Chỉ ghi bugs và test results |

> ⚠️ **Runaway Evolution Guard:** Không được commit vào file bộ nhớ nếu thông tin chưa được xác minh. Mọi thay đổi vào `architecture-decisions.md` phải đi kèm link ADR hoặc lý do rõ ràng.

---

## 🗂️ Chỉ Mục File Bộ Nhớ

| File | Nội Dung | Cập Nhật Khi Nào |
|:---|:---|:---|
| [**project-status.md**](./project-status.md) | ⭐ **Danh sách đầy đủ chức năng đã làm, milestone, tổng số** | Sau mỗi feature/milestone hoàn thành |
| [project-conventions.md](./project-conventions.md) | Git workflow, branch naming, commit format | Khi thay đổi quy trình Git |
| [tech-stack.md](./tech-stack.md) | Snapshot tech stack hiện tại + versions | Khi nâng cấp dependency lớn |
| [architecture-decisions.md](./architecture-decisions.md) | Các quyết định kiến trúc quan trọng (mini-ADR) | Sau mỗi quyết định kiến trúc |
| [known-issues.md](./known-issues.md) | Các lỗi đã biết, workarounds, và gotchas | Khi phát hiện bug có pattern lặp lại |

---

## 📍 Pointers Bộ Nhớ Gần Đây

- [project] Triển khai Admin Blog Editor với Markdown Preview và chấm điểm SEO 10 tiêu chí → architecture-decisions.md
- [project] Tải ảnh bìa (Cover Image) local được lưu trữ tĩnh tại public/uploads/blogs/ → architecture-decisions.md
- [project] KI-006: Sửa lỗi react-hooks/refs do khai báo toolbar array chứa closure gọi ref trong render → known-issues.md
- [reference] Production URL: https://haisancamau.vn (Vercel + Matbao.net domain) → architecture-decisions.md
- [reference] Supabase pooler host chính xác: aws-1-ap-southeast-1.pooler.supabase.com:6543 (KHÔNG phải aws-0) → known-issues.md
- [project] KI-007: Supabase direct host chỉ hỗ trợ IPv6 — Vercel không có IPv6 → dùng Connection Pooler → known-issues.md
- [project] KI-008: migration.ts dùng CREATE SCHEMA auth gây lỗi permission denied trên Supabase Cloud → known-issues.md
- [project] Auth system dùng custom auth.users với plaintext password — cần nâng cấp bcrypt → known-issues.md
- [reference] Demo accounts: admin@example.com/AdminPassword123! và merchant@example.com/MerchantPassword123! → architecture-decisions.md
- [project] Cấu hình và tạo bucket 'blogs' trên Supabase Storage → architecture-decisions.md (ADR-008)

---

## 🔄 Giao Thức Cập Nhật Bộ Nhớ

```
SAU MỖI TASK LỚN:
1. Quyết định kiến trúc mới? → Ghi vào architecture-decisions.md
2. Bug có pattern lặp lại?   → Ghi vào known-issues.md
3. Package nâng cấp?         → Cập nhật tech-stack.md
4. Phân tích failure pattern? → Ghi vào GUARDRAILS.md (root)
```
