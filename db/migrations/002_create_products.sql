-- Up
BEGIN;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    merchant_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    category VARCHAR(100),
    description TEXT,
    image_url TEXT,
    is_auto_listed BOOLEAN DEFAULT TRUE NOT NULL,
    specific_commission_rate NUMERIC(5, 2) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    
    CONSTRAINT uniq_products_slug UNIQUE (slug),
    CONSTRAINT fk_products_merchants FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE RESTRICT
);

-- Chỉ mục cho slug để tìm kiếm nhanh URL chuẩn SEO
CREATE INDEX idx_products_slug ON products (slug);

-- Chỉ mục cho khóa ngoại merchant_id để tối ưu các truy vấn JOIN
CREATE INDEX idx_products_merchant_id ON products (merchant_id);

-- Chỉ mục hỗ trợ tìm kiếm sản phẩm đang hiển thị (chưa bị xóa)
CREATE INDEX idx_products_active ON products (deleted_at) WHERE deleted_at IS NULL;

COMMIT;

-- Down
BEGIN;

DROP TABLE IF EXISTS products;

COMMIT;
