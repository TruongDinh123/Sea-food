# 📚 Backend Code Templates — Tài Liệu Tham Chiếu

> Đây là thư viện template chuẩn. **KHÔNG** copy-paste nguyên xi mà hãy điều chỉnh theo tên thực tế của entity.  
> Workflow chính: `../dev-be-dat.md`

---

## Template 1: Repository Layer

**File:** `src/lib/repositories/<ten-bang>.repository.ts`

```typescript
import { createClient } from '@/lib/db/client'
import type { <TenBang>, Create<TenBang>Input, Update<TenBang>Input } from '@/types/<ten-bang>.types'

export const <TenBang>Repository = {
  // Lấy tất cả (chỉ lấy cột cần thiết — KHÔNG SELECT *)
  findAll: async (): Promise<<TenBang>[]> => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('<ten_bang>')
      .select('id, name, slug, created_at') // ← Liệt kê rõ từng cột
      .is('deleted_at', null)               // ← Soft delete filter
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data ?? []
  },

  // Tìm theo ID
  findById: async (id: string): Promise<<TenBang> | null> => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('<ten_bang>')
      .select('id, name, slug, description, created_at')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) return null
    return data
  },

  // Tìm theo slug (cho SEO routes)
  findBySlug: async (slug: string): Promise<<TenBang> | null> => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('<ten_bang>')
      .select('id, name, slug, description, created_at')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single()

    if (error) return null
    return data
  },

  // Tạo mới
  create: async (input: Create<TenBang>Input): Promise<<TenBang>> => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('<ten_bang>')
      .insert(input)
      .select('id, name, slug, created_at')
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Cập nhật
  update: async (id: string, input: Update<TenBang>Input): Promise<<TenBang>> => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('<ten_bang>')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, name, slug, updated_at')
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Soft Delete — KHÔNG dùng DELETE vật lý
  softDelete: async (id: string): Promise<void> => {
    const supabase = createClient()
    const { error } = await supabase
      .from('<ten_bang>')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(error.message)
  },
}
```

---

## Template 2: Service Layer

**File:** `src/lib/services/<ten-bang>.service.ts`

```typescript
import { <TenBang>Repository } from '@/lib/repositories/<ten-bang>.repository'
import type { <TenBang>, Create<TenBang>Input } from '@/types/<ten-bang>.types'

export const <TenBang>Service = {
  // Business logic: lấy tất cả (có thể thêm filter, sort, pagination)
  getAll: async (): Promise<<TenBang>[]> => {
    return <TenBang>Repository.findAll()
  },

  // Business logic: lấy theo slug cho SEO page
  getBySlug: async (slug: string): Promise<<TenBang> | null> => {
    if (!slug || slug.trim() === '') return null
    return <TenBang>Repository.findBySlug(slug)
  },

  // Business logic: tạo mới với validation
  create: async (input: Create<TenBang>Input): Promise<<TenBang>> => {
    // ← Thêm validation business rules ở đây, KHÔNG trong Repository
    if (!input.name || input.name.trim() === '') {
      throw new Error('Tên không được để trống')
    }
    return <TenBang>Repository.create(input)
  },

  // Business logic: xóa mềm
  delete: async (id: string): Promise<void> => {
    const existing = await <TenBang>Repository.findById(id)
    if (!existing) throw new Error('Không tìm thấy bản ghi')
    return <TenBang>Repository.softDelete(id)
  },
}
```

---

## Template 3: Database Migration

**File:** `db/migrations/{NNN}_{action}_{object}.sql`  
**Ví dụ:** `db/migrations/004_create_products.sql`

```sql
-- Migration: 004_create_products.sql
-- Mô tả: Tạo bảng products cho danh sách hải sản

-- ============ UP ============
BEGIN;

CREATE TABLE products (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,
  description  TEXT,
  price_min    NUMERIC(12,2),
  price_max    NUMERIC(12,2),
  unit         TEXT        NOT NULL DEFAULT 'kg',
  merchant_id  UUID        REFERENCES merchants(id) ON DELETE SET NULL,
  is_available BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ           -- Soft delete
);

-- Index cho slug (SEO routes)
CREATE INDEX idx_products_slug ON products (slug) WHERE deleted_at IS NULL;
-- Index cho merchant_id (JOIN)
CREATE INDEX idx_products_merchant_id ON products (merchant_id) WHERE deleted_at IS NULL;

COMMIT;

-- ============ DOWN (Rollback) ============
BEGIN;
DROP TABLE IF EXISTS products;
COMMIT;
```

---

## Template 4: API Route Handler

**File:** `src/app/api/<resource>/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { <TenBang>Service } from '@/lib/services/<ten-bang>.service'

// GET /api/<resource>
export async function GET(_request: NextRequest) {
  try {
    const data = await <TenBang>Service.getAll()
    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('[API] GET /<resource>:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    )
    // ← Không bao giờ trả về stack trace cho client
  }
}

// POST /api/<resource>
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await <TenBang>Service.create(body)
    return NextResponse.json({ data, success: true }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message, success: false }, { status: 400 })
  }
}
```

---

## Template 5: TypeScript Types

**File:** `src/types/<ten-bang>.types.ts`

```typescript
// Entity type — khớp với schema DB
export type <TenBang> = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// Input type cho CREATE (không có id, timestamps)
export type Create<TenBang>Input = {
  name: string
  slug: string
  description?: string
}

// Input type cho UPDATE (tất cả optional trừ logic quan trọng)
export type Update<TenBang>Input = Partial<Omit<<TenBang>, 'id' | 'created_at' | 'deleted_at'>>
```
