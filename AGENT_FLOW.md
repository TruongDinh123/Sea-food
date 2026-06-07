# 🔄 Kiến trúc Luồng Hoạt động của Tác tự (Agent Flow Architecture)

> **Bộ công cụ AG (AG Kit) 2026.5.25** — Tài liệu chi tiết về quy trình làm việc của Tác tự AI (AI Agent)

---

## 📊 Sơ đồ Luồng Tổng quan

```
┌─────────────────────────────────────────────────────────────────┐
│                      YÊU CẦU CỦA NGƯỜI DÙNG                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PHÂN LOẠI YÊU CẦU                        │
│  • Phân tích ý định (build, debug, test, deploy, v.v.)          │
│  • Xác định miền/lĩnh vực (frontend, backend, mobile, v.v.)     │
│  • Phát hiện độ phức tạp (đơn giản, trung bình, phức tạp)       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌───────────────────┐      ┌──────────────────┐
    │   LỆNH WORKFLOW   │      │ PHÂN CÔNG TÁC TỰ │
    │   (Lệnh Slash)    │      │    TRỰC TIẾP     │
    └─────────┬─────────┘      └────────┬─────────┘
              │                         │
              ▼                         ▼
    ┌───────────────────┐      ┌──────────────────┐
    │ /brainstorm       │      │ Lựa chọn Tác tự  │
    │ /create           │      │  dựa trên Miền   │
    │ /debug            │      │                  │
    │ /deploy           │      │ • frontend-*     │
    │ /enhance          │      │ • backend-*      │
    │ /orchestrate      │      │ • mobile-*       │
    │ /plan             │      │ • database-*     │
    │ /preview          │      │ • devops-*       │
    │ /status           │      │ • test-*         │
    │ /test             │      │ • security-*     │
    └─────────┬─────────┘      └────────┬─────────┘
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
         ┌─────────────────────────────────────┐
         │          KHỞI TẠO TÁC TỰ            │
         │  • Tải vai trò/cá tính tác tự       │
         │  • Tải các kỹ năng yêu cầu          │
         │  • Thiết lập chế độ hành vi         │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │       GIAO THỨC TẢI KỸ NĂNG         │
         │                                     │
         │  1. Đọc metadata của SKILL.md       │
         │  2. Tải các tham chiếu (nếu cần)    │
         │  3. Chạy các kịch bản/scripts (nếu) │
         │  4. Áp dụng quy tắc và mẫu thiết kế │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │         THỰC THI NHIỆM VỤ           │
         │                                     │
         │  • Phân tích codebase               │
         │  • Áp dụng các thực hành tốt nhất   │
         │  • Tạo/Sửa đổi mã nguồn             │
         │  • Chạy kiểm định/validations       │
         │  • Thực thi kiểm thử/tests          │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │           LỚP KIỂM ĐỊNH             │
         │                                     │
         │  Kiểm tra nhanh (checklist.py):     │
         │  • Quét bảo mật (Security scan)     │
         │  • Chất lượng mã (lint/types)       │
         │  • Kiểm định Schema                 │
         │  • Bộ kiểm thử (Test suite)         │
         │  • Kiểm định UX (UX audit)          │
         │  • Kiểm tra SEO                     │
         │                                     │
         │  Kiểm tra đầy đủ (verify_all.py):   │
         │  • Tất cả bài test nhanh + Lighthouse│
         │  • Kiểm thử E2E (Playwright)        │
         │  • Phân tích Bundle                 │
         │  • Kiểm định Mobile (Mobile audit)  │
         │  • Kiểm tra đa ngôn ngữ (i18n check)│
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │          BÀN GIAO KẾT QUẢ           │
         │  • Trình bày các thay đổi cho user  │
         │  • Cung cấp giải thích chi tiết     │
         │  • Đề xuất các bước tiếp theo       │
         └─────────────────────────────────────┘
```

---

## 🎯 Quy trình Hoạt động Chi tiết của Tác tự

### 1️⃣ **Các Điểm Đầu vào của Yêu cầu**

```
Các loại dữ liệu đầu vào từ người dùng:
┌─────────────────────────────────────────────────────────────┐
│ A. Yêu cầu bằng ngôn ngữ tự nhiên                           │
│    "Xây dựng một dashboard React có biểu đồ"                 │
│                                                             │
│ B. Lệnh Slash (Lệnh gạch chéo)                              │
│    "/create feature: user authentication"                   │
│                                                             │
│ C. Yêu cầu đặc thù theo Miền                                │
│    "Tối ưu hóa các câu truy vấn database" → database-architect│
│    "Sửa lỗi bảo mật dễ bị tấn công" → security-auditor       │
│    "Triển khai lên AWS" → devops-engineer                    │
└─────────────────────────────────────────────────────────────┘
```

#### Giao thức Cổng Socratic (Socratic Gate Protocol)

Trước khi thực hiện, hãy xác minh:

- **Tính năng mới (New Feature)** → HỎI ít nhất 3 câu hỏi chiến lược
- **Sửa lỗi (Bug Fix)** → Xác nhận sự hiểu biết + hỏi về mức độ ảnh hưởng
- **Yêu cầu mơ hồ (Vague request)** → Hỏi về Mục đích (Purpose), Người dùng (Users), Phạm vi (Scope)

### 2️⃣ **Ma trận Lựa chọn Tác tự**

#### Danh sách kiểm tra điều hướng Tác tự (Bắt buộc)

Trước BẤT KỲ công việc viết mã hoặc thiết kế nào:

| Bước | Kiểm tra | Nếu chưa kiểm tra |
| ---- | ---------------------------- | ---------------------------------------- |
| 1    | Xác định đúng tác tự | → Phân tích miền của yêu cầu |
| 2    | Đọc file .md của tác tự | → Mở `.agent/agent/{agent}.md` |
| 3    | Thông báo tác tự | → Gửi `🤖 Applying knowledge of @[agent]...` |
| 4    | Tải các kỹ năng từ frontmatter | → Kiểm tra trường `skills:` |

```
Ánh xạ giữa Miền yêu cầu → Tác tự:

┌──────────────────────┬─────────────────────┬──────────────────────────┐
│ Miền (Domain)        │ Tác tự Chính        │ Kỹ năng được tải (Skills)│
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Thiết kế UI/UX       │ frontend-specialist │ react-best-practices      │
│                      │                     │ frontend-design          │
│                      │                     │ tailwind-patterns        │
│                      │                     │ web-design-guidelines    │
│                      │                     │ frontend-design          │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Phát triển API       │ backend-specialist  │ api-patterns             │
│                      │                     │ nodejs-best-practices    │
│                      │                     │ nestjs-expert            │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Thiết kế Database    │ database-architect  │ database-design          │
│                      │                     │ prisma-expert            │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Ứng dụng Di động     │ mobile-developer    │ mobile-design            │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Phát triển Game      │ game-developer      │ game-development         │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ DevOps/Triển khai    │ devops-engineer     │ docker-expert            │
│                      │                     │ deployment-procedures    │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Kiểm tra Bảo mật     │ security-auditor    │ vulnerability-scanner    │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Kiểm thử Xâm nhập    │ penetration-tester  │ red-team-tactics         │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Kiểm thử (Testing)   │ test-engineer       │ testing-patterns         │
│                      │                     │ webapp-testing           │
│                      │                     │ tdd-workflow             │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Sửa lỗi (Debugging)  │ debugger            │ systematic-debugging     │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Hiệu năng            │ performance-        │ performance-profiling    │
│                      │ optimizer           │                          │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ SEO                  │ seo-specialist      │ seo-fundamentals         │
│                      │                     │ geo-fundamentals         │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Tài liệu hóa         │ documentation-      │ documentation-templates  │
│                      │ writer              │                          │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Lên kế hoạch/Tìm hiểu│ project-planner     │ brainstorming            │
│                      │                     │ plan-writing             │
│                      │                     │ architecture             │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Tác vụ Đa Tác tự     │ orchestrator        │ parallel-agents          │
│                      │                     │ behavioral-modes         │
└──────────────────────┴─────────────────────┴──────────────────────────┘
```

### 3️⃣ **Giao thức Tải Kỹ năng**

```
┌─────────────────────────────────────────────────────────────┐
│                    LUỒNG TẢI KỸ NĂNG                         │
└─────────────────────────────────────────────────────────────┘

Bước 1: Khớp yêu cầu với kỹ năng phù hợp
┌──────────────────────────────────────────┐
│ Người dùng: "Build a REST API"           │
│   ↓                                      │
│ Khớp từ khóa: "API" → api-patterns       │
└──────────────────────────────────────────┘
                    ↓
Bước 2: Tải Metadata của Kỹ năng
┌──────────────────────────────────────────┐
│ Đọc: .agent/skills/api-patterns/         │
│       └── SKILL.md (chỉ dẫn chính)       │
└──────────────────────────────────────────┘
                    ↓
Bước 3: Tải các tài liệu Tham chiếu (nếu cần)
┌──────────────────────────────────────────┐
│ Đọc: api-patterns/rest.md                │
│       api-patterns/graphql.md            │
│       api-patterns/auth.md               │
│       api-patterns/documentation.md      │
└──────────────────────────────────────────┘
                    ↓
Bước 4: Thực thi các kịch bản/scripts (nếu cần)
┌──────────────────────────────────────────┐
│ Chạy: scripts/api_validator.py           │
│      (kiểm tra tính hợp lệ thiết kế API) │
└──────────────────────────────────────────┘
                    ↓
Bước 5: Áp dụng Kiến thức đã tải
┌──────────────────────────────────────────┐
│ Tác tự hiện đã có:                       │
│ • Các mẫu thiết kế API (API design)      │
│ • Chiến lược xác thực (Authentication)   │
│ • Các mẫu tài liệu (Doc templates)       │
│ • Các script kiểm định (Validation)      │
└──────────────────────────────────────────┘

### Mô hình kỹ năng liên quan (Related Skills Pattern)

Các kỹ năng hiện tại đã được liên kết với nhau:
- `frontend-design` → `web-design-guidelines` (sau khi viết code)
- `web-design-guidelines` → `frontend-design` (trước khi viết code)

> **Lưu ý**: Các script KHÔNG tự động thực thi. AI sẽ đề xuất chạy chúng, và người dùng phê duyệt.
```

### 4️⃣ **Thực thi Lệnh Workflow**

```
Luồng hoạt động của Lệnh Slash:

/brainstorm
    ↓
    1. Tải: kỹ năng brainstorming
    2. Áp dụng: phương pháp đặt câu hỏi Socratic
    3. Kết quả: Tài liệu khám phá có cấu trúc

/create
    ↓
    1. Phát hiện: Loại dự án (web/mobile/api/game)
    2. Tải: kỹ năng app-builder + các kỹ năng đặc thù theo miền
    3. Lựa chọn: Mẫu từ thư mục app-builder/templates/
    4. Dựng khung (Scaffold): Tạo cấu trúc dự án
    5. Kiểm định: Chạy checklist.py

/debug
    ↓
    1. Tải: kỹ năng systematic-debugging
    2. Phân tích: Log lỗi, stack trace
    3. Áp dụng: Phân tích nguyên nhân gốc rễ (root cause)
    4. Đề xuất: Phương án sửa kèm theo ví dụ code
    5. Kiểm thử: Xác minh lỗi đã được khắc phục hoàn toàn

/deploy
    ↓
    1. Tải: kỹ năng deployment-procedures
    2. Phát hiện: Nền tảng triển khai (Vercel, AWS, Docker, v.v.)
    3. Chuẩn bị: Các tài nguyên build (build artifacts)
    4. Thực thi: Các script triển khai
    5. Xác minh: Kiểm tra trạng thái hoạt động (health checks)
    6. Kết quả: URL ứng dụng sau khi triển khai

/test
    ↓
    1. Tải: kỹ năng testing-patterns + webapp-testing
    2. Phát hiện: Framework kiểm thử (Jest, Vitest, Playwright)
    3. Tạo: Các ca kiểm thử (test cases)
    4. Thực thi: Chạy các bài test
    5. Báo cáo: Tỷ lệ bao phủ (coverage) + kết quả

/orchestrate
    ↓
    1. Tải: kỹ năng parallel-agents
    2. Phân rã: Chia nhỏ nhiệm vụ lớn thành các nhiệm vụ con (subtasks)
    3. Phân công: Giao mỗi nhiệm vụ con cho tác tự chuyên môn tương ứng
    4. Điều phối: Thực thi song song
    5. Hợp nhất: Gộp các kết quả lại với nhau
    6. Kiểm định: Chạy quy trình xác minh đầy đủ

/plan
    ↓
    1. Tải: kỹ năng plan-writing + architecture
    2. Phân tích: Các yêu cầu của dự án
    3. Phân rã: Các công việc kèm ước lượng thời gian
    4. Kết quả: Bản kế hoạch có cấu trúc kèm các mốc quan trọng (milestones)
```

### 5️⃣ **Điều phối Đa Tác tự (Multi-Agent Orchestration)**

```
Nhiệm vụ phức tạp → /orchestrate → Nhiều Tác tự Chuyên môn khác nhau

Ví dụ: "Build a full-stack e-commerce app" (Xây dựng ứng dụng TMĐT full-stack)

┌─────────────────────────────────────────────────────────────┐
│                       TÁC TỰ ĐIỀU PHỐI                      │
│       Phân rã nhiệm vụ thành các luồng công việc tuần tự    │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ CHUYÊN GIA    │   │ CHUYÊN GIA    │   │ KIẾN TRÚC SƯ  │
│ FRONTEND      │   │ BACKEND       │   │ DATABASE      │
│               │   │               │   │               │
│ Kỹ năng:      │   │ Kỹ năng:      │   │ Kỹ năng:      │
│ • react-*     │   │ • api-*       │   │ • database-*  │
│ • nextjs-*    │   │ • nodejs-*    │   │ • prisma-*    │
│ • tailwind-*  │   │ • nestjs-*    │   │               │
│               │   │               │   │               │
│ Xây dựng:     │   │ Xây dựng:     │   │ Xây dựng:     │
│ • UI/UX       │   │ • REST API    │   │ • Schema      │
│ • Components  │   │ • Xác thực    │   │ • Migrations  │
│ • Trang web   │   │ • Logic chính │   │ • Chỉ mục     │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └─────────────────┬─┴───────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │        TÍNH NHẤT QUÁN CỦA CODE      │
        │  • AI duy trì tính đồng bộ          │
        │  • Chuyển đổi ngữ cảnh tuần tự      │
        │  • Đảm bảo khớp các API contract    │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────┐
        │     KIỂM ĐỊNH (Tất cả Tác tự)       │
        │  • test-engineer → Viết & Chạy test │
        │  • security-auditor → Quét bảo mật  │
        │  • performance-optimizer → Tối ưu   │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────┐
        │             TRIỂN KHAI              │
        │  • devops-engineer → Triển khai     │
        └─────────────────────────────────────┘
```

### 6️⃣ **Quy trình Kiểm định & Chất lượng (Validation & Quality Gates)**

```
┌─────────────────────────────────────────────────────────────┐
│                    ĐƯỜNG ỐNG KIỂM ĐỊNH                      │
└─────────────────────────────────────────────────────────────┘

Trong quá trình phát triển (Kiểm tra nhanh):
┌──────────────────────────────────────────┐
│ python .agent/scripts/checklist.py .     │
├──────────────────────────────────────────┤
│ ✓ Quét bảo mật (phát hiện lộ bí mật)     │
│ ✓ Chất lượng mã (ESLint, TypeScript)     │
│ ✓ Kiểm định Schema (Prisma/DB)           │
│ ✓ Bộ kiểm thử (Unit tests)               │
│ ✓ Kiểm định UX (Khả năng tiếp cận)       │
│ ✓ Kiểm tra SEO (Thẻ Meta, hiệu năng)     │
└──────────────────────────────────────────┘
        Thời gian: ~30 giây

Trước khi triển khai (Xác minh đầy đủ):
┌──────────────────────────────────────────────────────┐
│ python .agent/scripts/verify_all.py .                │
│        --url http://localhost:3000                   │
├──────────────────────────────────────────────────────┤
│ ✓ Tất cả các bài kiểm tra nhanh                      │
│ ✓ Kiểm định Lighthouse (Core Web Vitals)             │
│ ✓ Kiểm thử Playwright E2E                            │
│ ✓ Phân tích Bundle (Kích thước, tree-shaking)        │
│ ✓ Kiểm định Mobile (Độ phản hồi, vùng chạm)          │
│ ✓ Kiểm tra i18n (Bản dịch, ngôn ngữ địa phương)      │
└──────────────────────────────────────────────────────┘
        Thời gian: ~3-5 phút
```

---

## 🧩 Ánh xạ Kỹ năng sang Script (Skill-to-Script Mapping)

```
Các kỹ năng đi kèm với Script tự động:

┌─────────────────────────┬──────────────────────────────────┐
│ Kỹ năng (Skill)         │ Kịch bản (Script)                │
├─────────────────────────┼──────────────────────────────────┤
│ api-patterns            │ scripts/api_validator.py         │
│ database-design         │ scripts/schema_validator.py      │
│ frontend-design         │ scripts/accessibility_checker.py │
│                         │ scripts/ux_audit.py              │
│ geo-fundamentals        │ scripts/geo_checker.py           │
│ i18n-localization       │ scripts/i18n_checker.py          │
│ lint-and-validate       │ scripts/lint_runner.py           │
│                         │ scripts/type_coverage.py         │
│ mobile-design           │ scripts/mobile_audit.py          │
│ performance-profiling   │ scripts/lighthouse_runner.py     │
│                         │ scripts/bundle_analyzer.py       │
│ seo-fundamentals        │ scripts/seo_checker.py           │
│ testing-patterns        │ scripts/test_runner.py           │
│ vulnerability-scanner   │ scripts/security_scanner.py      │
│ webapp-testing          │ scripts/e2e_runner.py            │
└─────────────────────────┴──────────────────────────────────┘
```

---

## 🔄 Ví dụ về Vòng đời Yêu cầu Hoàn chỉnh

```
Yêu cầu của người dùng: "Xây dựng dashboard Next.js có tích hợp xác thực"

1. PHÂN LOẠI YÊU CẦU
   ├─ Loại: Xây dựng tính năng mới
   ├─ Miền: Frontend + Backend
   ├─ Độ phức tạp: Trung bình-Cao
   └─ Đề xuất lệnh: /create hoặc /orchestrate

2. LỰA CHỌN WORKFLOW
   └─ Người dùng chọn: /orchestrate (phương pháp đa tác tự)

3. PHÂN RÃ CỦA BỘ ĐIỀU PHỐI (ORCHESTRATOR)
   ├─ Frontend: Giao diện Dashboard (các React component)
   ├─ Backend: API xác thực (JWT, quản lý session)
   ├─ Database: Schema người dùng (Prisma)
   └─ Kiểm thử: Luồng xác thực E2E

4. PHÂN CÔNG TÁC TỰ
   ├─ frontend-specialist
   │   └─ Kỹ năng: react-best-practices, tailwind-patterns, frontend-design
   ├─ backend-specialist
   │   └─ Kỹ năng: api-patterns, nodejs-best-practices
   ├─ database-architect
   │   └─ Kỹ năng: database-design, prisma-expert
   └─ test-engineer
       └─ Kỹ năng: testing-patterns, webapp-testing

5. THỰC THI TUẦN TỰ ĐA MIỀN
   Lưu ý: AI xử lý từng miền một cách tuần tự, tự động chuyển đổi ngữ cảnh giữa các "vai trò" chuyên gia.
   Đây là luồng mô phỏng hành vi đa tác tự chứ không phải chạy song song thực tế (true parallel).

   ├─ Frontend xây dựng:
   │   ├─ app/dashboard/page.tsx (Server Component)
   │   ├─ components/DashboardLayout.tsx
   │   ├─ components/LoginForm.tsx
   │   └─ lib/auth-client.ts
   ├─ Backend xây dựng:
   │   ├─ app/api/auth/login/route.ts
   │   ├─ app/api/auth/logout/route.ts
   │   ├─ lib/jwt.ts
   │   └─ middleware.ts
   ├─ Database xây dựng:
   │   ├─ prisma/schema.prisma (Model User, Session)
   │   └─ prisma/migrations/
   └─ Kiểm thử xây dựng:
       ├─ tests/auth.spec.ts (Playwright)
       └─ tests/dashboard.spec.ts

6. TÍCH HỢP CODE
   Lưu ý thực tế: AI viết mã dưới dạng một dòng chảy liên tục và nhất quán.
   Không có bước "merge" (gộp code) riêng biệt - tất cả được tạo ra một cách đồng bộ từ đầu.

   └─ AI duy trì tính nhất quán giữa các miền
       ├─ Giải quyết các đường dẫn import
       ├─ Đảm bảo an toàn kiểu dữ liệu (type safety)
       └─ Kết nối các API route với giao diện người dùng (UI)

7. KIỂM ĐỊNH (VALIDATION)
   ├─ checklist.py
   │   ✓ Bảo mật: Không lộ các khoá bí mật (secrets)
   │   ✓ Lint: Không có lỗi ESLint
   │   ✓ Types: Biên dịch TypeScript thành công
   │   ✓ Tests: Luồng xác thực vượt qua bài test
   └─ verify_all.py
       ✓ E2E: Đăng nhập → Dashboard → Đăng xuất hoạt động tốt
       ✓ Khả năng tiếp cận: Tuân thủ chuẩn WCAG AA
       ✓ Hiệu năng: Điểm số Lighthouse > 90

8. BÀN GIAO KẾT QUẢ
   └─ Người dùng nhận được:
       ├─ Bộ mã nguồn hoàn chỉnh
       ├─ Tài liệu hướng dẫn chạy ứng dụng
       ├─ Báo cáo kiểm thử
       └─ Hướng dẫn triển khai
```

---

## 📈 Thống kê & Số liệu Đo lường

```
┌──────────────────────────────────────────────────────────┐
│                   NĂNG LỰC CỦA HỆ THỐNG                  │
├──────────────────────────────────────────────────────────┤
│ Tổng số Tác tự:            20                            │
│ Tổng số Kỹ năng:           45 (+8 mới trong bản 2026.5.25)│
│ Tổng số Workflow:          13 (+3 mới trong bản 2026.5.25)│
│ Kịch bản chính (Master):   2 (checklist, verify_all)     │
│ Kịch bản cấp Kỹ năng:      18                            │
│ Độ phủ (Coverage):         ~95% web/mobile + điều phối   │
│ Hiệu quả sử dụng Token:    Cải thiện 13-33% (2026.5.25)  │
│                                                          │
│ Điểm mới trong bản 2026.5.25:                            │
│ ├─ Chế độ điều phối (Coordinator Mode - song song)       │
│ ├─ Hệ thống bộ nhớ lưu trữ (Persistent Memory - MEMORY.md)│
│ ├─ Nén ngữ cảnh (Context Compression - tự động thu gọn)  │
│ ├─ Tải kỹ năng có điều kiện (Conditional Loading)        │
│ └─ Xác minh thông qua thực thi (/verify)                 │
│                                                          │
│ Các Framework hỗ trợ:                                    │
│ ├─ Frontend: React, Next.js, Vue, Nuxt, Astro            │
│ ├─ Backend: Node.js, NestJS, FastAPI, Express            │
│ ├─ Mobile: React Native, Flutter                         │
│ ├─ Database: Prisma, TypeORM, Sequelize                  │
│ ├─ Testing: Jest, Vitest, Playwright, Cypress            │
│ └─ DevOps: Docker, Vercel, AWS, GitHub Actions           │
└──────────────────────────────────────────────────────────┘
```

---

## 🎓 Các Thực hành Tốt nhất (Best Practices)

### Khi nào nên sử dụng mỗi Workflow

```
/brainstorm
  ✓ Khi yêu cầu chưa rõ ràng
  ✓ Cần khám phá và so sánh nhiều phương án khác nhau
  ✓ Vấn đề phức tạp cần phân chia thành các mảnh nhỏ

/create
  ✓ Tạo tính năng mới trong dự án hiện có
  ✓ Độ phức tạp nhỏ đến trung bình
  ✓ Tác vụ đơn miền (chỉ Frontend HOẶC chỉ Backend)

/orchestrate
  ✓ Tính năng full-stack hoàn chỉnh
  ✓ Các nhiệm vụ phức tạp gồm nhiều bước liên tục
  ✓ Cần sự tham gia của nhiều tác tự chuyên môn khác nhau

/debug
  ✓ Báo cáo lỗi từ người dùng hoặc hệ thống
  ✓ Ứng dụng có hành vi bất thường/không mong muốn
  ✓ Gặp các vấn đề về mặt hiệu năng

/test
  ✓ Cần bổ sung độ bao phủ kiểm thử (test coverage)
  ✓ Thực hiện trước khi triển khai sản phẩm
  ✓ Sau khi có những thay đổi lớn trong mã nguồn

/deploy
  ✓ Sẵn sàng đưa sản phẩm lên môi trường thực tế
  ✓ Sau khi tất cả các bài kiểm thử đã chạy thành công
  ✓ Cần một URL chạy thực tế trên production

/plan
  ✓ Các dự án có quy mô lớn
  ✓ Cần ước lượng thời gian thực hiện chi tiết
  ✓ Cần điều phối công việc trong nhóm
```

---

## 🔗 Liên kết Tham chiếu Nhanh

- **Kiến trúc (Architecture)**: `.agent/ARCHITECTURE.md`
- **Tác tự (Agents)**: `.agent/agent/`
- **Kỹ năng (Skills)**: `.agent/skills/`
- **Quy trình (Workflows)**: `.agent/workflows/`
- **Kịch bản (Scripts)**: `.agent/scripts/`

---

**Cập nhật lần cuối**: 2026-05-25
**Phiên bản**: 2026.5.25