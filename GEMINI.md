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
- **TailwindCSS:** Ưu tiên v4 **css-first** (`@theme` trong `globals.css`). Không dùng file config JS.
- **Font chữ:** Mặc định sử dụng **Be Vietnam Pro** (import từ Google Fonts) để tương thích tiếng Việt và giữ thẩm mỹ chuẩn mực.
- **Màu chủ đạo (Theo Design System):** Muted luxury deepwater palette gồm:
  - Deepwater Teal (`#031e25`): Màu nền chính cho các khối lớn/Hero.
  - Canvas (`#e5e7eb`): Màu nền nội dung phụ, viền và đường chia.
  - Ink Black (`#0a0a0a`): Màu chữ tiêu đề và văn bản chính.
  - Pure White (`#ffffff`): Màu chữ trên nền tối và màu nền nút nhấn chính.

---

## 🏗️ Agent Architecture & Role Overrides
* **Chế độ Single Agent (Antigravity)**: Khi làm việc trực tiếp với người dùng, Antigravity tự động đóng vai trò là **Fullstack Developer**, có toàn quyền sửa đổi mã nguồn ở tất cả các lớp (frontend, backend, database migrations, config, scripts...) mà không bị hạn chế bởi bảng phân vai.
* **Chế độ Multi-Agent**: Khi chạy `/spawn` song song nhiều subagents, vai trò được phân định như sau:

| Vai (Role) | Workflow | Phạm vi (Domain) |
|---|---|---|
| **Tech Lead** | `/tech-lead-an` | Kiến trúc, review PR, quyết định kỹ thuật |
| **Backend Dev** | `/dev-be-dat` | `src/lib/`, `src/app/api/`, `db/` |
| **Frontend Dev / Senior FE** | `/dev-fe-dinh` | `src/app/`, `src/components/`, `public/` |
| **DevOps** | `/dev-ops-duc` | Deployment, CI/CD, `next.config.ts` |
| **QA Engineer** | `/qa-vi` | Testing, kiểm tra chất lượng |
| **Product Manager** | `/pm-quan` | Yêu cầu, backlog, acceptance criteria (AC) |
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

---

## ⚡ Quy Tắc Tối Ưu Hóa Tài Nguyên Máy Local (Tránh Đơ Máy)

- **Không tự động chạy `npm run build`**: Antigravity tuyệt đối KHÔNG tự động thực thi lệnh `npm run build` (`next build`) trong quá trình tự động kiểm tra code, review, hoặc bàn giao công việc (handoff) trên máy local của người dùng.
- **Sử dụng Type Check thay thế**: Để kiểm tra lỗi biên dịch TypeScript nhanh chóng và nhẹ nhàng, chỉ sử dụng lệnh `npm run type-check` (tương đương `npx tsc --noEmit`) kết hợp với `npm run lint`.
- **Yêu cầu build thực tế**: Lệnh `npm run build` chỉ được thực hiện khi người dùng yêu cầu trực tiếp, hoặc trước khi tiến hành triển khai (deploy) sản phẩm.
