-- Up
BEGIN;

CREATE TABLE referral_logs (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    merchant_id INT NOT NULL,
    buyer_phone VARCHAR(20),
    order_value NUMERIC(10, 2),
    calculated_commission NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    
    CONSTRAINT chk_referral_logs_status CHECK (status IN ('pending', 'completed', 'cancelled')),
    CONSTRAINT fk_referral_logs_products FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT fk_referral_logs_merchants FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE RESTRICT
);

-- Chỉ mục cho các khóa ngoại để tăng tốc độ truy vấn JOIN giữa các bảng
CREATE INDEX idx_referral_logs_product_id ON referral_logs (product_id);
CREATE INDEX idx_referral_logs_merchant_id ON referral_logs (merchant_id);

-- Chỉ mục cho status và created_at phục vụ cho đối soát và tính doanh thu định kỳ
CREATE INDEX idx_referral_logs_status ON referral_logs (status);
CREATE INDEX idx_referral_logs_created_at ON referral_logs (created_at);

-- Chỉ mục hỗ trợ soft delete
CREATE INDEX idx_referral_logs_active ON referral_logs (deleted_at) WHERE deleted_at IS NULL;

COMMIT;

-- Down
BEGIN;

DROP TABLE IF EXISTS referral_logs;

COMMIT;
