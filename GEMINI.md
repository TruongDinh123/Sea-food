# GEMINI.md — Quy Tắc Cấu Hình Antigravity & Quản Lý Ngữ Cảnh (Gemini Overrides)

Tập tin này chứa cấu hình và hướng dẫn đặc thù cho các mô hình Gemini chạy trên hệ sinh thái **Google Antigravity** (IDE, CLI, SDK). Khi có xung đột với `AGENTS.md`, các cấu hình trong file này sẽ được ưu tiên áp dụng.

---

## 🧠 Quy Trình Quản Lý Bộ Nhớ & Tránh Trôi Ngữ Cảnh (Memory Protocol)

Để tránh hiện tượng trôi ngữ cảnh (Context Drift), phình token (Context Bloat), hai bên tuân thủ quy trình sau:

### 1. Giới Hạn 5 Lượt Hội Thoại (5-Turn Reset Rule)
*   **Ngưỡng giới hạn:** Một phiên trò chuyện (Conversation) không kéo dài quá **5 lượt tương tác** của Người dùng.
*   **Hành động tại lượt thứ 5:**
    1.  Tác tử phát cảnh báo: *"Chúng ta đã đạt giới hạn 5 lượt hội thoại để tối ưu bộ nhớ."*
    2.  Tác tử tự động tạo/cập nhật file `docs/ky-uc/ky-uc-hien-tai/session-XXX/SESSION_STATUS.md` ghi lại:
        *   Các file đã tạo/sửa đổi trong session.
        *   Trạng thái hiện tại (build, test).
        *   Các bước cần làm tiếp theo ở session mới.
    3.  Tác tử nhắc người dùng tạo Conversation mới để làm sạch context.
*   **Tại Conversation mới:** Người dùng chỉ cần yêu cầu tiếp tục, tác tử đọc `GEMINI.md`, `AGENTS.md` và `SESSION_STATUS.md` của session gần nhất để nối tiếp công việc.

### 2. Ký Ức Dài Hạn (Durable Memory)
*   Mọi tài liệu chiến lược, thiết kế database, phân tích API phải lưu trong folder `docs/plan/` hoặc `docs/api/`.
*   Nhật ký thay đổi kỹ thuật (Technical Change) phải ghi nhận vào thư mục `docs/TC/` dưới dạng file `TC-XXXX.md`.

---

## ⚙️ Cấu Hình Môi Trường Antigravity

*   **Artifact Review Policy:** Thiết lập chế độ `"Request Review"`. Mọi thay đổi về code hay plan cần được trình bày dưới dạng Artifact và chờ phê duyệt.
*   **Terminal Sandboxing:** Luôn sử dụng terminal sandbox (`AppContainer` trên Windows) khi chạy các lệnh shell hoặc scripting bên ngoài.
*   **Workspace Rules:** Tự động kích hoạt các quy tắc bổ trợ trong thư mục `.agents/rules/` theo Glob pattern (xem chi tiết định nghĩa cấu hình tại `.agents/rules/`).
*   **Model Routing:** Khi viết bài SEO, ưu tiên gọi subagent sử dụng mô hình phù hợp để tối ưu chất lượng văn bản.

---

## 🔌 Tích Hợp MCP & Custom Workflows

*   **MCP Config:** Cấu hình server được định nghĩa tại `.agents/mcp_config.json`.
*   **Workflows:** Các kịch bản prompt tự động hóa được lưu tại `.agents/workflows/`. Triển khai thông qua lệnh `/tên-workflow`.

---

*Ngày cập nhật: 2026-05-23 | Antigravity-native Config*
