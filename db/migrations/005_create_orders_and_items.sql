-- Up
BEGIN;

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    merchant_id INT NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    buyer_address TEXT NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cod' NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    order_value NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    CONSTRAINT chk_orders_status CHECK (status IN ('pending', 'processing', 'shipping', 'completed', 'cancelled')),
    CONSTRAINT fk_orders_merchants FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE RESTRICT
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_items_unit_price CHECK (unit_price >= 0),
    CONSTRAINT fk_order_items_orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    CONSTRAINT fk_order_items_products FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Index cho orders
CREATE INDEX idx_orders_merchant_id ON orders (merchant_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_active ON orders (deleted_at) WHERE deleted_at IS NULL;

-- Index cho order_items
CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);

COMMIT;

-- Down
BEGIN;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;

COMMIT;
