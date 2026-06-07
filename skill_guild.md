# 🧩 Cẩm Nang Hướng Dẫn Sử Dụng Các Skill Trong Project (AG Kit Skills Guide)

Chào mừng bạn đến với tài liệu hướng dẫn sử dụng hệ thống **Skill** của AG Kit. Hệ thống này bao gồm **45 Skills** (mô-đun tri thức chuyên biệt) được tích hợp trong thư mục `.agents/skills/`. 

Khi bạn làm việc với tôi (Antigravity AI), các skill này sẽ được tự động kích hoạt dựa trên ngữ cảnh câu hỏi hoặc bạn có thể yêu cầu tôi sử dụng một cách tường minh để đạt hiệu quả tối ưu nhất.

---

## 💡 Hướng Dẫn Cách Sử Dụng Nhanh
*   **Tự động kích hoạt (Ngầm):** Hệ thống sẽ tự động quét yêu cầu của bạn, so sánh với trường `when_to_use` trong mỗi skill để nạp mô-đun tri thức phù hợp.
*   **Kích hoạt thủ công (Tường minh):** Bạn có thể chỉ định trực tiếp bằng cách đề xuất trong chat. 
    *   *Ví dụ:* *"Hãy sử dụng skill **`api-patterns`** để thiết kế API lấy danh sách sản phẩm"* hoặc *"Chạy kiểm tra code với skill **`lint-and-validate`**"*.

---

## 🗂️ Phân Loại Các Skill Theo Nhóm Chức Năng

### 🎨 1. Frontend & UI
Dành cho thiết kế giao diện, tối ưu hóa trải nghiệm người dùng và lập trình phía Client (React, Next.js, Tailwind).

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`react-best-practices`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/nextjs-react-expert/SKILL.md) | Khi tối ưu hóa hiệu năng React/Next.js App Router, xử lý Hydration, Client/Server component. |
| **`web-design-guidelines`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/web-design-guidelines/SKILL.md) | Khi cần kiểm tra (audit) giao diện về khả năng truy cập (Accessibility), trải nghiệm người dùng (UX) và chuẩn Vercel. |
| **`tailwind-patterns`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/tailwind-patterns/SKILL.md) | Khi viết CSS/Tailwind v4, quản lý thiết kế token trong `globals.css` (không dùng config JS). |
| **`frontend-design`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/frontend-design/SKILL.md) | Khi thiết kế bố cục giao diện, phối màu, typography, và tạo trải nghiệm visual premium. |

---

### ⚙️ 2. Backend & API
Dành cho xử lý logic nghiệp vụ, thiết kế giao thức truyền tải dữ liệu và tối ưu hóa hệ thống phía Server.

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`api-patterns`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/api-patterns/SKILL.md) | Khi thiết kế API RESTful, GraphQL, hoặc tRPC; định dạng phản hồi JSON, phân trang, và bảo mật API. |
| **`nodejs-best-practices`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/nodejs-best-practices/SKILL.md) | Khi lập trình Node.js, xử lý bất đồng bộ (async/await), luồng ghi/đọc (streams) và cấu trúc module. |
| **`python-patterns`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/python-patterns/SKILL.md) | Khi viết code Python, xây dựng dịch vụ với FastAPI, Flask hoặc viết mã nguồn tiện ích. |
| **`rust-pro`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/rust-pro/SKILL.md) | Khi làm việc với Rust (1.75+), tối ưu hóa hiệu năng hệ thống, quản lý Lifetime, Ownership hoặc viết dịch vụ bằng Tokio/Axum. |

---

### 💾 3. Cơ Sở Dữ Liệu (Database)
Thiết kế cấu trúc lưu trữ và tối ưu truy vấn dữ liệu.

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`database-design`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/database-design/SKILL.md) | Khi thiết kế bảng (schema), chỉ mục (index), viết truy vấn SQL phức tạp, hoặc làm việc với Supabase/PostgreSQL. |

---

### ☁️ 4. Cloud & Infrastructure (Hạ Tầng)
Quản lý môi trường chạy ứng dụng, ảo hóa và quy trình triển khai.

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`deployment-procedures`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/deployment-procedures/SKILL.md) | Khi cần xây dựng quy trình CI/CD, chuẩn bị triển khai lên môi trường Production, hoặc thực hiện Rollback. |
| **`server-management`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/server-management/SKILL.md) | Khi quản lý tiến trình server, giám sát hệ thống, cấu hình Nginx/Reverse Proxy. |

---

### 🧪 5. Testing & Quality (Kiểm Thử & Chất Lượng Code)
Đảm bảo mã nguồn hoạt động chính xác và tuân thủ các tiêu chuẩn kỹ thuật nghiêm ngặt.

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`testing-patterns`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/testing-patterns/SKILL.md) | Khi viết Unit test, Integration test bằng Jest, Vitest; cấu hình mock dữ liệu. |
| **`webapp-testing`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/webapp-testing/SKILL.md) | Khi viết kiểm thử tự động toàn trình (E2E) với Playwright hoặc Cypress. |
| **`tdd-workflow`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/tdd-workflow/SKILL.md) | Khi phát triển phần mềm theo phương pháp Test-Driven Development (Red-Green-Refactor). |
| **`code-review-checklist`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/code-review-checklist/SKILL.md) | Kiểm tra nhanh các tiêu chuẩn thiết kế code sạch, phòng chống bug trước khi tạo PR. |
| **`lint-and-validate`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/lint-and-validate/SKILL.md) | Chạy các công cụ định dạng và kiểm tra tĩnh lỗi cú pháp (`npm run lint`, `tsc --noEmit`). |

---

### 🛡️ 6. Security (Bảo Mật)
Phát hiện và ngăn chặn các lỗ hổng bảo mật trong dự án.

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`vulnerability-scanner`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/vulnerability-scanner/SKILL.md) | Quét lỗ hổng dependencies (`npm audit`), kiểm tra các tiêu chuẩn an toàn OWASP. |
| **`red-team-tactics`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/red-team-tactics/SKILL.md) | Kiểm thử xâm nhập giả lập (Penetration testing), phân tích điểm yếu hệ thống. |

---

### 📌 7. Planning & Architecture (Lập Kế Hoạch & Kiến Trúc)
Giúp định hình dự án từ ý tưởng đến tài liệu kỹ thuật chi tiết.

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`app-builder`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/app-builder/SKILL.md) | Tạo khung dự án mới (scaffolding), thiết lập cấu trúc thư mục ban đầu. |
| **`architecture`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/architecture/SKILL.md) | Đưa ra các quyết định thiết kế hệ thống quan trọng và viết tài liệu ADR (Architecture Decision Record). |
| **`plan-writing`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/plan-writing/SKILL.md) | Lập kế hoạch triển khai chi tiết (`implementation_plan.md`), phân chia công việc nhỏ và rõ ràng. |
| **`brainstorming`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/brainstorming/SKILL.md) | Phỏng vấn Socratic để làm rõ yêu cầu mơ hồ, thiết lập bảng tiến độ công việc trực quan. |

---

### 📱 8. Mobile & Game Development

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`mobile-design`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/mobile-design/SKILL.md) | Thiết kế trải nghiệm di động (iOS/Android), tối ưu hóa cảm ứng và hiệu năng trên điện thoại. |
| **`game-development`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/game-development/SKILL.md) | Thiết kế logic game, vòng lặp game (game loop), cơ chế tương tác. |

---

### 📈 9. SEO & Growth (Tối Ưu Hóa & Tăng Trưởng)

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`seo-fundamentals`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/seo-fundamentals/SKILL.md) | Khi cần tối ưu hóa thứ hạng tìm kiếm trên Google (Sitemap, Robot.txt, JSON-LD Schema, Core Web Vitals). |
| **`geo-fundamentals`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/geo-fundamentals/SKILL.md) | Tối ưu hóa hiển thị trên các công cụ tìm kiếm sử dụng AI thế hệ mới (ChatGPT, Claude, Perplexity). |

---

### 🖥️ 10. CLI & Hệ Điều Hành

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`bash-linux`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/bash-linux/SKILL.md) | Viết script bash, xử lý các lệnh trên hệ điều hành Linux/macOS. |
| **`powershell-windows`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/powershell-windows/SKILL.md) | Chạy và tự động hóa các câu lệnh trên hệ điều hành Windows PowerShell. |

---

### 🤖 11. Orchestration & Memory (Điều Phối & Bộ Nhớ AI)
Các skill nâng cao giúp AI hoạt động thông minh, lưu giữ ngữ cảnh hội thoại và thao tác file hàng loạt.

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`coordinator-mode`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/coordinator-mode/SKILL.md) | Khi cần điều phối nhiều tác tử AI chạy song song để giải quyết các vấn đề phức tạp. |
| **`memory-system`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/memory-system/SKILL.md) | Ghi nhớ các quyết định thiết kế và quy ước của dự án qua các phiên làm việc (`/remember`). |
| **`context-compression`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/context-compression/SKILL.md) | Tự động nén và tóm tắt ngữ cảnh hội thoại khi đoạn chat trở nên quá dài nhằm tiết kiệm token và tránh mất bộ nhớ. |
| **`verify-changes`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/verify-changes/SKILL.md) | Chạy thử và chứng minh các thay đổi logic thực sự hoạt động trước khi bàn giao. |
| **`batch-operations`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/batch-operations/SKILL.md) | Chỉnh sửa hàng loạt nhiều file theo mẫu (pattern) thay vì sửa từng file một cách thủ công. |
| **`simplify-code`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/simplify-code/SKILL.md) | Tái cấu trúc, loại bỏ các lớp trừu tượng dư thừa, làm phẳng các hàm lồng nhau phức tạp. |
| **`skillify`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/skillify/SKILL.md) | Tự động trích xuất các quy trình làm việc lặp đi lặp lại của bạn thành một Skill mới cho dự án. |
| **`code-review-graph`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/code-review-graph/SKILL.md) | Đánh giá code tiết kiệm token bằng cách xây dựng và truy vấn biểu đồ cây cú pháp Tree-sitter. |

---

### 📋 12. Các Skill Tiện Ích Khác

| Tên Skill | Đường Dẫn Chi Tiết | Khi Nào Nên Sử Dụng? |
| :--- | :--- | :--- |
| **`clean-code`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/clean-code/SKILL.md) | Quy định chung về tiêu chuẩn viết code sạch, dễ đọc và tự giải thích mà không cần comment thừa. |
| **`behavioral-modes`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/behavioral-modes/SKILL.md) | Điều chỉnh hành vi của AI phù hợp với từng tác vụ cụ thể (Ví dụ: debug, review, brainstorm). |
| **`parallel-agents`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/parallel-agents/SKILL.md) | Quy tắc chia nhỏ công việc cho các tác tử độc lập cùng làm việc song song. |
| **`mcp-builder`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/mcp-builder/SKILL.md) | Thiết kế và tích hợp các máy chủ Model Context Protocol (MCP) mới vào IDE. |
| **`documentation-templates`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/documentation-templates/SKILL.md) | Các mẫu tài liệu chuẩn (README, API docs, v.v.). |
| **`i18n-localization`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/i18n-localization/SKILL.md) | Phát hiện chuỗi văn bản cứng (hardcoded string) và dịch đa ngôn ngữ cho ứng dụng. |
| **`performance-profiling`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/performance-profiling/SKILL.md) | Đo lường, phân tích và tối ưu hiệu suất, chỉ số Core Web Vitals của web. |
| **`systematic-debugging`** | [SKILL.md](file:///e:/Web-Seo/.agents/skills/systematic-debugging/SKILL.md) | Quy trình 4 bước để gỡ lỗi có hệ thống (tìm nguyên nhân gốc rễ thay vì đoán mò). |

---

*Tài liệu này được tạo tự động nhằm hỗ trợ tra cứu nhanh trong dự án.*  
*Lần cập nhật cuối: 2026-05-30 | Người tạo: Antigravity AI*
