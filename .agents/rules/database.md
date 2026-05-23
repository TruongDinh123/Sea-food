# rule: database
# description: Quy tắc thiết kế schema, naming convention và migration PostgreSQL
# glob: db/**/*, src/lib/db/**/*, src/app/api/**/*
# ---

# 🗄️ Quy Tắc Database & Schema Design (PostgreSQL)

Quy tắc này tự động áp dụng khi tạo migrations, truy vấn cơ sở dữ liệu, hoặc sửa đổi các repository layer.

---

## 1. Naming Conventions (Quy Tắc Đặt Tên)

*   **Bảng (Tables):** `snake_case`, số nhiều (ví dụ: `merchants`, `products`, `referral_logs`).
*   **Cột (Columns):** `snake_case` (ví dụ: `price_per_kg`, `is_available`).
    *   Cột kiểu boolean: Bắt đầu bằng `is_` hoặc `has_` (ví dụ: `is_active`).
    *   Cột kiểu timestamp: Kết thúc bằng `_at` (ví dụ: `created_at`, `deleted_at`).
    *   Khóa ngoại (Foreign Keys): Tên bảng số ít + `_id` (ví dụ: `merchant_id`).
*   **Indexes:** Định dạng `idx_{table}_{column(s)}` (ví dụ: `idx_products_slug`).
*   **Constraints:** Định dạng `uniq_{table}_{column}` hoặc `fk_{table}_{referenced_table}`.

---

## 2. Quy Tắc Migration

*   Mọi thay đổi cấu trúc database phải đi qua file migration mới trong `db/migrations/`.
*   Đặt tên file migration theo định dạng: `{sequential_number}_{action}_{object}.sql`.
    *   *Ví dụ:* `001_create_merchants.sql`, `002_create_products.sql`.
*   **Rollback:** Mỗi file migration phải có cả khối `Up` (thực thi) và `Down` (hoàn tác) được bọc trong giao dịch `BEGIN; ... COMMIT;`.

---

## 3. Quy Tắc Query & Data Access

*   **Chặn SELECT *:** Luôn chỉ rõ các cột cần lấy để tiết kiệm băng thông và tối ưu bộ nhớ.
*   **Soft Delete:** Không sử dụng lệnh `DELETE` vật lý. Mọi bảng dữ liệu người dùng/sản phẩm phải có trường `deleted_at TIMESTAMPTZ` và lọc `WHERE deleted_at IS NULL` trong các truy vấn thông thường.
*   **Tránh N+1 Query:** Sử dụng `JOIN` hoặc gom nhóm (batch query) thay vì chạy câu truy vấn DB bên trong vòng lặp.
