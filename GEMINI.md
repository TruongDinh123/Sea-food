# GEMINI.md — Antigravity-Specific Configuration
# Ghi đè và mở rộng AGENTS.md cho Antigravity IDE

---

## 🤖 Ngôn Ngữ & Giao Tiếp

- Phản hồi với người dùng **bằng Tiếng Việt** trong mọi trường hợp.
- Comment code nội bộ: Tiếng Việt.
- Tên biến, hàm, component: **Tiếng Anh** (theo coding convention).

---

## 📦 Artifact Rules

- **Implementation Plan** → lưu tại `docs/ke-hoach/implementation_plan.md`
- **Task Tracking** → lưu tại `docs/ke-hoach/task.md`
- **Session Memory** → lưu tại `docs/ky-uc/ky-uc-hien-tai/`
- **Walkthrough / Báo cáo hoàn thành** → lưu tại `docs/ky-uc/ky-uc-hien-tai/<yyyy-mm-dd-session-XXX>/walkthrough.md`

---

## 🎨 Design Overrides

- **TailwindCSS:** Ưu tiên v4 **css-first** (`@theme` trong `globals.css`). **Không** dùng `tailwind.config.js` trừ khi v4 không hỗ trợ tính năng cần thiết.
- **Font chữ:** Mặc định dùng `Be Vietnam Pro` từ Google Fonts cho giao diện Tiếng Việt.
- **Màu chủ đạo:** `#0D6EFD` (xanh biển), `#198754` (xanh lá - tôn lên hải sản tươi), nền trắng/xám nhạt.

---

## 🏗️ Agent Architecture — Phân Vai (Role Assignment)

Dự án sử dụng mô hình **Orchestrator-Worker** với các vai sau:

| Vai (Role) | Workflow | Phạm vi (Domain) |
|---|---|---|
| **Tech Lead** | `/tech-lead-an` | Kiến trúc, review PR, quyết định kỹ thuật |
| **Backend Dev** | `/dev-be-dat` | `src/lib/`, `src/app/api/`, `db/` |
| **Frontend Dev** | `/dev-fe-dinh` | `src/app/`, `src/components/`, `public/` |
| **DevOps** | `/dev-ops-duc` | Deployment, CI/CD, `next.config.ts` |
| **QA Engineer** | `/qa-vi` | Testing, kiểm tra chất lượng |
| **Product Manager** | `/pm-quan` | Yêu cầu, backlog, acceptance criteria |
| **BA / Sprint** | `/ba-sprint` | Phân tích, user story, sprint planning |

---

## 🔒 Safety Overrides (Ưu tiên hơn AGENTS.md)

- **Tuyệt đối không** chạy `DROP TABLE`, `TRUNCATE`, `DELETE` không có `WHERE` mà không có approval.
- **Tuyệt đối không** commit trực tiếp lên branch `main`. Mọi thay đổi phải qua nhánh feature.
- **Trước khi chạy migration:** Phải thông báo rõ SQL sẽ thực thi và chờ user xác nhận.
- **File `.env.local`:** Chỉ đọc để debug, **không bao giờ** ghi đè hay in ra terminal.

---

## 🧠 Memory & Persistence

- **Bắt đầu phiên mới:** Đọc file `docs/ky-uc/ky-uc-hien-tai/SESSION_STATUS.md` (nếu tồn tại) để nắm ngữ cảnh.
- **Kết thúc phiên:** Chạy workflow `/handoff` để lưu trạng thái.
- **Tiếp tục phiên cũ:** Dùng workflow `/resume`.
