-- Up
BEGIN;

-- Cập nhật bảng merchants: Thêm user_id UUID UNIQUE
ALTER TABLE merchants ADD COLUMN user_id UUID DEFAULT NULL;
ALTER TABLE merchants ADD CONSTRAINT uniq_merchants_user_id UNIQUE (user_id);

-- Cập nhật bảng referral_logs: Thêm order_id INT tham chiếu đến bảng orders
ALTER TABLE referral_logs ADD COLUMN order_id INT DEFAULT NULL;
ALTER TABLE referral_logs ADD CONSTRAINT fk_referral_logs_orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT;

-- Chỉ mục cho order_id trong referral_logs để tối ưu truy vấn JOIN
CREATE INDEX idx_referral_logs_order_id ON referral_logs (order_id);

COMMIT;

-- Down
BEGIN;

-- Xóa liên kết và cột trong referral_logs
ALTER TABLE referral_logs DROP CONSTRAINT IF EXISTS fk_referral_logs_orders;
DROP INDEX IF EXISTS idx_referral_logs_order_id;
ALTER TABLE referral_logs DROP COLUMN IF EXISTS order_id;

-- Xóa ràng buộc và cột trong merchants
ALTER TABLE merchants DROP CONSTRAINT IF EXISTS uniq_merchants_user_id;
ALTER TABLE merchants DROP COLUMN IF EXISTS user_id;

COMMIT;
