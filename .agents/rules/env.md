# rule: env
# description: Quy tắc quản lý biến môi trường, .env và bảo mật secrets
# glob: .env*
# ---

# 🔐 Quy Tắc Quản Lý .env & Bảo Mật Secrets

Quy tắc này tự động áp dụng khi tạo, đọc hoặc chỉnh sửa các file biến môi trường trong workspace.

---

## 1. Không Commit Secrets Thực Tế

*   **Tuyệt đối không commit** các file `.env`, `.env.local`, `.env.production` hay bất cứ biến nào chứa giá trị thật lên Git.
*   **Bắt buộc cập nhật `.gitignore`** để loại bỏ các file này trước khi push.
*   Chỉ commit file `.env.example` làm template định nghĩa tên các biến môi trường (không điền giá trị thật).

---

## 2. Quy Tắc Phân Loại Biến Môi Trường

*   **Expose ra Client (`NEXT_PUBLIC_`):**
    *   Next.js yêu cầu tiền tố `NEXT_PUBLIC_` để nhúng giá trị biến môi trường vào client-side JS (ví dụ: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
    *   Chỉ dùng cho dữ liệu không nhạy cảm.
*   **Chỉ dùng ở Server (Private):**
    *   Không có tiền tố `NEXT_PUBLIC_`.
    *   Chỉ có thể đọc từ API Routes hoặc Server Components (ví dụ: `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).

---

## 3. Cách Xử Lý Khi Leak Keys

Nếu lỡ commit file `.env` chứa API Key/Database url thực tế:
1.  **Hủy/Rotate Key ngay lập tức** trên nhà cung cấp dịch vụ (Supabase, Neon, Firebase, v.v.).
2.  Dùng `git filter-branch` hoặc `BFG Repo-Cleaner` để xóa vĩnh viễn file khỏi lịch sử git trước khi force push.
