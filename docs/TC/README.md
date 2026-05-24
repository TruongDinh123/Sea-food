# 🔄 Technical Change Tracker (TC) — Nhật Ký Thay Đổi Kỹ Thuật

> **Skill áp dụng:** `tc-tracker`, `changelog-generator`
> **Mục đích:** Ghi lại MỌI thay đổi kỹ thuật quan trọng để tránh "thứ này ai sửa và tại sao?"
> **Quy tắc:** Mỗi thay đổi lớn phải tạo 1 file TC-XXXX.md trong thư mục này.

---

## Cách Tạo TC Mới

```
docs/TC/
├── README.md            ← File này (index + hướng dẫn)
├── TC-0001.md          ← Khởi tạo dự án
├── TC-0002.md          ← Thêm feature X
└── TC-0003.md          ← Fix bug Y
```

### Template TC file (`TC-XXXX.md`)
```markdown
# TC-XXXX — [Tiêu đề thay đổi ngắn gọn]

| Trường | Giá trị |
|---|---|
| **ID** | TC-XXXX |
| **Ngày** | YYYY-MM-DD |
| **Người thực hiện** | Định |
| **Loại thay đổi** | feat / fix / refactor / chore / docs |
| **Mức độ ảnh hưởng** | Low / Medium / High / Critical |
| **Status** | Draft / In Progress / Done / Reverted |

## Lý Do Thay Đổi (Why)
[Mô tả vấn đề hoặc nhu cầu dẫn đến thay đổi này]

## Phạm Vi Thay Đổi (What)
- File A: [Mô tả thay đổi]
- File B: [Mô tả thay đổi]

## Cách Thực Hiện (How)
[Chi tiết kỹ thuật nếu phức tạp]

## Rủi Ro & Rollback Plan
- **Rủi ro:** [Liệt kê nếu có]
- **Rollback:** `git revert [commit hash]`

## Kết Quả
- [ ] Đã test local
- [ ] Đã test staging
- [ ] Đã deploy production
```

---

## Danh Sách TC (TC Index)

| ID | Ngày | Loại | Tiêu đề | Ảnh hưởng | Status |
|---|---|---|---|---|---|
| [TC-0001](./TC-0001.md) | 2026-05-23 | chore | Khởi tạo cấu trúc dự án | Low | Done |
| [TC-0002](./TC-0002.md) | 2026-05-24 | feat | Thiết lập cơ sở dữ liệu & migrations | Medium | Done |

---

## Quy Tắc Khi Nào Cần Tạo TC?

| Hành động | Cần TC? |
|---|---|
| Thêm table mới vào database | ✅ Bắt buộc |
| Thay đổi schema database | ✅ Bắt buộc |
| Thêm API endpoint mới | ✅ Bắt buộc |
| Thay đổi logic tính hoa hồng | ✅ Bắt buộc |
| Thêm thư viện npm quan trọng | ✅ Bắt buộc |
| Thay đổi cấu hình CI/CD | ✅ Bắt buộc |
| Fix bug nhỏ | ⚠️ Không bắt buộc (ghi vào commit message) |
| Sửa style/CSS | ❌ Không cần |
| Thêm comment/docs | ❌ Không cần |

---

*Tài liệu này được tạo bởi Antigravity (skill: tc-tracker) — Session 002 — 2026-05-23*
