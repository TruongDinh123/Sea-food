# 🧠 Ký Ức Hiện Tại — Session Index

Thư mục này lưu trữ **tóm tắt từng phiên hội thoại** theo quy tắc giới hạn 5 lượt.

## Cấu trúc thư mục

Mỗi phiên làm việc được lưu vào một thư mục con theo định dạng:

```
docs/ky-uc/ky-uc-hien-tai/
└── YYYY-MM-DD-session-{N}/
    └── SESSION_STATUS.md
```

**Ví dụ:**
```
2026-05-23-session-001/    → Phiên đầu tiên ngày 23/05/2026
2026-05-23-session-002/    → Phiên thứ hai cùng ngày
2026-05-24-session-001/    → Phiên đầu tiên ngày 24/05/2026
```

## Quy Tắc Tóm Tắt Tự Động (5-Turn Reset Rule)

Khi Định gửi tin nhắn thứ **5** trong một Conversation:
1. AI **cảnh báo** giới hạn đã đạt.
2. AI **tạo thư mục** `YYYY-MM-DD-session-{N}` và ghi file `SESSION_STATUS.md`.
3. AI yêu cầu Định **tạo Conversation mới**.
4. Ở Conversation mới, Định chỉ cần nói: *"Đọc SESSION_STATUS.md và tiếp tục"*.

## Nội dung file SESSION_STATUS.md

Mỗi file tóm tắt bao gồm:
- **Việc đã hoàn thành** trong phiên vừa rồi
- **File nào đang làm dở** và trạng thái hiện tại
- **Bước tiếp theo** cần làm ngay trong chat mới
- **Quyết định kỹ thuật** đã được đưa ra trong phiên

## Danh sách Phiên Làm Việc

| Phiên | Ngày | Nội dung chính | Link |
|---|---|---|---|
| Session 001 | 2026-05-23 | Phân tích ý tưởng, SEO Guide, Chiến lược 3 Trụ cột, Cấu trúc thư mục dự án | [Xem](./2026-05-23-session-001/SESSION_STATUS.md) |
| Session 003 | 2026-05-24 | Cấu hình Supabase MCP, Migrations Database, Thư viện postgres, Connection pool singleton | [Xem](./2026-05-24-session-003/SESSION_STATUS.md) |
| Session 005 | 2026-05-25 | Quyết định cấu trúc thư mục SEO (ADR-001) & Kế hoạch phát triển Sprint 1 | [Xem](./2026-05-25-session-005/walkthrough.md) |
| Session 006 | 2026-05-25 | Hoàn tất Backend Sprint 1 (T1, T4, T5, T7) & Khắc phục lỗi kết nối host pooler aws-1 | [Xem](./2026-05-25-session-006/SESSION_STATUS.md) |
