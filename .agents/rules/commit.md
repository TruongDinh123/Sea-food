# rule: commit
# description: Định dạng commit message chuẩn Conventional Commits v1.0
# glob: *
# ---

# 📝 Quy Tắc Viết Commit Message (Conventional Commits)

Quy tắc này luôn được áp dụng khi chuẩn bị commit code hoặc lập kế hoạch git flow.

---

## 1. Cấu Trúc Commit Message Chuẩn

```
<type>(<scope>): <subject>

[body - chi tiết thay đổi]

[footer - mã TC hoặc tham chiếu issue]
```

---

## 2. Danh Sách Types & Scopes

### Types (Loại thay đổi)
*   `feat` — Tính năng mới (tăng phiên bản MINOR).
*   `fix` — Vá lỗi (tăng phiên bản PATCH).
*   `docs` — Thay đổi tài liệu/hướng dẫn.
*   `style` — Định dạng code, sửa CSS (không ảnh hưởng logic).
*   `refactor` — Tái cấu trúc mã nguồn.
*   `perf` — Tối ưu hóa hiệu năng.
*   `chore` — Cấu nhập cấu hình, cập nhật package.

### Scopes (Phạm vi)
Khai báo scope liên quan để dễ tracking: `product`, `merchant`, `referral`, `db`, `seo`, `api`, `ui`.

---

## 3. Quy Tắc Subject Line (Tiêu Đề)

*   **Không viết hoa chữ cái đầu** ngay sau dấu hai chấm.
*   **Không thêm dấu chấm** ở cuối câu tiêu đề.
*   Sử dụng động từ ở thể mệnh lệnh (ví dụ: `add product page`, không dùng `added product page`).
*   Tiêu đề ngắn gọn dưới 72 ký tự.
*   Tham chiếu mã thay đổi kỹ thuật (ví dụ: `TC: TC-0001`) trong phần body/footer nếu thay đổi cấu trúc database hoặc cấu hình hệ thống.
