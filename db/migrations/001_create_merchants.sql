-- Up
BEGIN;

CREATE TABLE merchants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    commission_type VARCHAR(20) DEFAULT 'percentage' NOT NULL,
    commission_value NUMERIC(10, 2) DEFAULT 5.00 NOT NULL,
    monthly_flat_rate NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Constraint kiểm tra các loại hoa hồng hợp lệ
ALTER TABLE merchants 
    ADD CONSTRAINT chk_merchants_commission_type 
    CHECK (commission_type IN ('percentage', 'fixed', 'monthly_flat'));

-- Chỉ mục hỗ trợ tìm kiếm nhanh vựa đang hoạt động
CREATE INDEX idx_merchants_active ON merchants (is_active) WHERE deleted_at IS NULL;

COMMIT;

-- Down
BEGIN;

DROP TABLE IF EXISTS merchants;

COMMIT;
