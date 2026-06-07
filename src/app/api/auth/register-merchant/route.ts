import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { merchant_name, merchant_phone, merchant_address, email, password } = await request.json();

    // Validations
    if (!merchant_name || !merchant_phone || !email || !password) {
      return NextResponse.json({ error: 'Các trường bắt buộc không được để trống' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải từ 6 ký tự trở lên' }, { status: 400 });
    }

    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (!phoneRegex.test(merchant_phone.trim())) {
      return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 });
    }

    // Check if email already exists in auth.users
    const existingUsers = await sql`
      SELECT id FROM auth.users WHERE email = ${email}
    `;
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'Email đã được đăng ký sử dụng' }, { status: 400 });
    }

    // Perform operations inside a transaction
    await sql.begin(async (tx) => {
      // 1. Insert into auth.users (encrypted_password is plain text for local test compatibility)
      const [user] = await tx`
        INSERT INTO auth.users (email, encrypted_password)
        VALUES (${email}, ${password})
        RETURNING id
      `;

      // 2. Insert into public.merchants
      await tx`
        INSERT INTO public.merchants (name, phone, address, is_active, commission_type, commission_value, monthly_flat_rate, user_id)
        VALUES (
          ${merchant_name.trim()},
          ${merchant_phone.trim()},
          ${merchant_address ? merchant_address.trim() : null},
          false,
          'percentage',
          5.00,
          0.00,
          ${user.id}
        )
      `;
    });

    return NextResponse.json({ success: true, message: 'Đăng ký tài khoản thương lái thành công' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: (error as Error).message|| 'Lỗi hệ thống' }, { status: 500  });
  }
}
