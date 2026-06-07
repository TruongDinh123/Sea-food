---
trigger: glob
globs: ["**/migrations/**", "**/repositories/**", "**/*.sql", "**/db/**"]
description: "Quy tắc database và migration — chỉ kích hoạt khi làm việc với file SQL, migrations, repositories, hoặc thư mục db/."
---

# 🗄️ Quy Tắc Database & Migration

> **Kích hoạt khi:** Bạn đang làm việc với file `.sql`, thư mục `migrations/`, `repositories/`, hoặc `db/`.

---

## ⚠️ Safety Gates — Phải xác nhận TRƯỚC khi thực thi

```
Trước khi chạy bất kỳ lệnh nào dưới đây:
1. Hiển thị SQL đầy đủ sẽ thực thi
2. Mô tả tác động (bao nhiêu row affected?)
3. Chờ người dùng xác nhận: "XÁC NHẬN"
4. Chỉ sau đó mới thực thi

Các lệnh yêu cầu xác nhận:
- DROP TABLE / DROP COLUMN
- TRUNCATE
- DELETE (kể cả có WHERE)
- Bất kỳ migration nào thay đổi schema
```

## Query Rules — Bắt Buộc

| ❌ Cấm | ✅ Bắt Buộc |
|:---|:---|
| `SELECT *` | `SELECT id, name, price_per_kg FROM products` |
| `DELETE FROM products` | `UPDATE products SET deleted_at = NOW() WHERE id = $1` |
| Query trong vòng lặp (N+1) | Dùng `JOIN` hoặc batch query |
| Hardcode connection string | Dùng `process.env.DATABASE_URL` |

## Migration Convention

### Naming
```
Format: {NNN}_{action}_{object}.sql
Ví dụ:
  001_create_products.sql
  002_add_merchant_id_to_products.sql
  003_create_merchants.sql
```

### Cấu Trúc Bắt Buộc

```sql
-- ⬆️ UP Migration
BEGIN;

-- Thêm đây logic tạo/sửa schema
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  deleted_at TIMESTAMPTZ  -- Soft delete bắt buộc
);

COMMIT;

-- ⬇️ DOWN Migration (rollback)
-- BEGIN;
-- DROP TABLE IF EXISTS products;
-- COMMIT;
```

## Soft Delete Protocol

```typescript
// ✅ ĐÚNG: Soft delete
await supabase
  .from('products')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', productId)

// ✅ ĐÚNG: Query phải filter deleted_at
await supabase
  .from('products')
  .select('id, name, price_per_kg')
  .is('deleted_at', null)  // Luôn thêm dòng này

// ❌ SAI: Physical delete
await supabase.from('products').delete().eq('id', productId)
```

## Repository Layer Rules

```typescript
// ✅ Repository chỉ chứa data access — không có business logic
export class ProductRepository {
  async findById(id: string): Promise<Product | null> {
    const { data } = await supabase
      .from('products')
      .select('id, name, price_per_kg, merchant_id')  // Không SELECT *
      .eq('id', id)
      .is('deleted_at', null)
      .single()
    return data
  }
}

// ❌ SAI: Business logic trong Repository
export class ProductRepository {
  async getPriceWithDiscount(id: string) {
    // Đây là business logic → phải nằm trong Service layer
    const product = await this.findById(id)
    return product.price * 0.9  // Vi phạm SRP
  }
}
```
