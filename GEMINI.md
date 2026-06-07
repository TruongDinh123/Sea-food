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

## 📖 NotebookLM & Ground Truth (Quy Tắc Xác Thực Nguồn Tin)

- **Nguyên tắc cốt lõi:** Bắt buộc sử dụng thông tin và dữ liệu từ tài liệu nguồn uy tín của **NotebookLM** hoặc **google-developer-knowledge** đã được cung cấp và đồng bộ.
- **Không bịa đặt (No Hallucination):** Tuyệt đối không tự suy diễn, phỏng đoán, hay tạo ra các thông số, phương pháp kỹ thuật, hoặc logic nghiệp vụ nằm ngoài tài liệu nguồn chính thức.
- **Xác thực trước khi trả lời:** 
  - Nếu tài liệu nguồn không đề cập đến một vấn đề cụ thể, Agent phải thông báo rõ ràng cho người dùng thay vì tự đưa ra giải pháp mặc định.
  - Khi tham chiếu thông tin từ NotebookLM, ưu tiên trích dẫn nguồn hoặc thực hiện lệnh tìm kiếm chính xác (`search_documents`, `notebook_query`...) để lấy dữ liệu thực tế.

---

---

## 🏗️ Agent Architecture & Role Overrides
* **Chế độ Single Agent (Antigravity)**: Khi làm việc trực tiếp với người dùng, Antigravity tự động đóng vai trò là **Fullstack Developer**, có toàn quyền sửa đổi mã nguồn ở tất cả các lớp (frontend, backend, database migrations, config, scripts...) mà không bị hạn chế bởi bảng phân vai.
* **Chế độ Multi-Agent**: Khi chạy `/spawn` song song nhiều subagents, vai trò được phân định như sau:

| Vai (Role) | Agent | Phạm vi (Domain) |
|---|---|---|
| **Tech Lead / Architect** | `orchestrator`, `project-planner` | Kiến trúc, review, quyết định kỹ thuật |
| **Backend Dev** | `backend-specialist`, `database-architect` | `src/lib/`, `src/app/api/`, `db/` |
| **Frontend Dev** | `frontend-specialist` | `src/app/`, `src/components/`, `public/` |
| **DevOps** | `devops-engineer` | Deployment, CI/CD, `next.config.ts` |
| **QA Engineer** | `test-engineer`, `qa-automation-engineer` | Testing, kiểm tra chất lượng |
| **Product Manager** | `product-manager`, `product-owner` | Yêu cầu, backlog, acceptance criteria |
| **SEO Specialist** | `seo-specialist` | SEO, E-E-A-T, Schema markup |

---

## 🔒 Safety Overrides (Ưu tiên hơn AGENTS.md)

- **Tuyệt đối không** chạy `DROP TABLE`, `TRUNCATE`, `DELETE` không có `WHERE` mà không có approval.
- **Tuyệt đối không** commit trực tiếp lên branch `main`. Mọi thay đổi phải qua nhánh feature.
- **Trước khi chạy migration:** Phải thông báo rõ SQL sẽ thực thi và chờ user xác nhận.
- **File `.env.local`:** Chỉ đọc để debug, **không bao giờ** ghi đè hay in ra terminal.

---

## 🧠 Memory & Persistence

- **Bắt đầu phiên mới:** Đọc file [`.agents/memory/MEMORY.md`](.agents/memory/MEMORY.md) và [`known-issues.md`](.agents/memory/known-issues.md) để nắm ngữ cảnh.
- **Lưu thông tin quan trọng:** Dùng `/remember` hoặc cập nhật trực tiếp vào file memory phù hợp.

---

## ⚡ Quy Tắc Tối Ưu Hóa Tài Nguyên Máy Local (Tránh Đơ Máy)

- **Không tự động chạy `npm run build`**: Antigravity tuyệt đối KHÔNG tự động thực thi lệnh `npm run build` (`next build`) trong quá trình tự động kiểm tra code, review, hoặc bàn giao công việc (handoff) trên máy local của người dùng.
- **Sử dụng Type Check thay thế**: Để kiểm tra lỗi biên dịch TypeScript nhanh chóng và nhẹ nhàng, chỉ sử dụng lệnh `npm run type-check` (tương đương `npx tsc --noEmit`) kết hợp với `npm run lint`.
- **Yêu cầu build thực tế**: Lệnh `npm run build` chỉ được thực hiện khi người dùng yêu cầu trực tiếp, hoặc trước khi tiến hành triển khai (deploy) sản phẩm.

---

## 🔄 Vòng Lặp PEV (Plan-Execute-Verify Loop)

> **Nền tảng:** Tác tự KHÔNG được giải quyết vấn đề phức tạp trong một lần xử lý không có giám sát. Phải tuân thủ 3 phase rõ ràng.

### Phase 1: PLAN (Trước khi thực thi)

**Pre-execution gates — Tự kiểm tra:**
- Công cụ được yêu cầu có hợp lệ không? (nằm trong allowlist)
- Tham số có đúng schema không?
- Hành động có thuộc tier "Ask First" hoặc "Never" không?
- Đường dẫn file có nằm trong workspace không?
- Hành động có vi phạm bất kỳ quy tắc trong AGENTS.md hay GEMINI.md không?

**Với task PHỨC TẠP** (nhiều file, thay đổi kiến trúc, DB migration):
→ Xuất Implementation Plan artifact TRƯỚC → Chờ approval → Mới thực thi

### Phase 2: EXECUTE (Thực thi trong phạm vi kế hoạch)

- Thực thi ĐÚNG theo kế hoạch đã được approve
- Không tự ý mở rộng phạm vi (scope creep)
- Nếu phát hiện vấn đề ngoài scope → DỪNG và báo cáo, không tự giải quyết thêm

### Phase 3: VERIFY (Sau khi thực thi)

**Post-execution verification bắt buộc:**
```bash
# Bước 1: Type check (KHÔNG dùng npm run build)
npm run type-check

# Bước 2: Lint check
npm run lint

# Bước 3: Tùy task — chạy script phù hợp
python .agents/scripts/checklist.py .
```

**Tiêu chuẩn "Done" — Không thỏa hiệp:**
- TypeScript không có error
- ESLint không có warning/error
- Nếu thay đổi logic: có test pass đi kèm
- Nếu thay đổi UI: không dùng arbitrary values
- Nếu thay đổi DB: migration có cả Up và Down

> ⚠️ **Cấm tuyệt đối:** Báo cáo "done" dựa trên cảm giác "có vẻ đúng". Phải có bằng chứng khách quan.


