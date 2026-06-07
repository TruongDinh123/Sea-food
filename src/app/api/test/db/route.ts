import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!['seed', 'seed-edge-cases', 'reset'].includes(action)) {
      return NextResponse.json({ error: 'Action không hợp lệ' }, { status: 400 });
    }

    await sql.begin(async (sql) => {
      // Khóa advisory để tuần tự hóa các yêu cầu reset DB song song từ E2E tests
      await sql`SELECT pg_advisory_xact_lock(112233);`;

      // Đảm bảo các cột thông tin người mua tồn tại trong bảng orders
      await sql`ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS buyer_name VARCHAR(255) NOT NULL DEFAULT '';`;
      await sql`ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS buyer_phone VARCHAR(20) NOT NULL DEFAULT '';`;
      await sql`ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS buyer_address TEXT NOT NULL DEFAULT '';`;
      await sql`ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) NOT NULL DEFAULT 'cod';`;

      // 1. Dọn dẹp cơ sở dữ liệu
      await sql`TRUNCATE public.referral_logs, public.order_items, public.orders, public.products, public.merchants, public.blogs CASCADE;`;

      if (action === 'reset') {
        return;
      }

      // 2. Khởi tạo schema auth và bảng users nếu chưa có
      await sql`CREATE SCHEMA IF NOT EXISTS auth;`;
      await sql`
        CREATE TABLE IF NOT EXISTS auth.users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          encrypted_password VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      // 3. Tạo/Cập nhật tài khoản trong auth.users
      const merchantUserId = 'e2e00000-0000-0000-0000-000000000001';
      const adminUserId = 'e2e00000-0000-0000-0000-000000000002';
      const passwordHash = 'MerchantPassword123!';

      // Xóa user E2E cũ nếu có trùng lặp để tránh xung đột
      await sql`DELETE FROM auth.users WHERE id IN (${merchantUserId}, ${adminUserId}) OR email IN ('merchant@example.com', 'admin@example.com');`;

      // Chèn lại các tài khoản thử nghiệm
      await sql`
        INSERT INTO auth.users (id, email, encrypted_password)
        VALUES 
          (${merchantUserId}, 'merchant@example.com', ${passwordHash}),
          (${adminUserId}, 'admin@example.com', 'AdminPassword123!')
      `;

      // 4. Chèn Merchant "Vựa Hải Sản Cà Mau"
      const [merchant] = await sql`
        INSERT INTO public.merchants (name, phone, address, is_active, commission_type, commission_value, monthly_flat_rate, user_id)
        VALUES (
          'Vựa Hải Sản Cà Mau',
          '0912345678',
          '123 Đường Phan Ngọc Hiển, Phường 5, TP. Cà Mau',
          true,
          'percentage',
          5.00,
          0.00,
          ${merchantUserId}
        )
        RETURNING id
      `;

      if (action === 'seed-edge-cases') {
        return;
      }

      // 5. Chèn Product "Tôm đất khô Loại 1"
      await sql`
        INSERT INTO public.products (merchant_id, name, slug, price, original_price, category, description, image_url, is_auto_listed, specific_commission_rate)
        VALUES (
          ${merchant.id},
          'Tôm đất khô Loại 1',
          'tom-dat-kho-loai-1',
          250000,
          300000,
          'tom-kho',
          'Tôm đất khô tự nhiên Cà Mau Loại 1, ngọt tự nhiên, thơm ngon đặc trưng.',
          '/images/products/tom-dat-kho.jpg',
          true,
          null
        )
      `;

      // 6. Chèn Blog "Cách chọn tôm khô ngon Cà Mau"
      await sql`
        INSERT INTO public.blogs (title, slug, meta_description, content, cover_image_url, is_published, publish_date)
        VALUES (
          'Cách chọn tôm khô ngon Cà Mau',
          'cach-chon-tom-kho-ngon-ca-mau',
          'Cách chọn tôm khô ngon Cà Mau',
          'Hướng dẫn chi tiết cách chọn tôm khô ngon Cà Mau bằng cách quan sát màu sắc, độ dai và mùi thơm đặc trưng.',
          '/images/blogs/cach-chon-tom-kho.jpg',
          true,
          NOW()
        )
      `;
    });

    return NextResponse.json({ message: `Database action '${action}' thành công` });
  } catch (error: unknown) {
    console.error('Lỗi khi seed database:', error);
    const message = error instanceof Error ? error.message : 'Lỗi hệ thống';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
