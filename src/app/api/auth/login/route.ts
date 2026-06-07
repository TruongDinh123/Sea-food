import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email và mật khẩu không được để trống' }, { status: 400 });
    }

    // Query user from auth.users
    const users = await sql`
      SELECT id, email, encrypted_password
      FROM auth.users
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại' }, { status: 401 });
    }

    const user = users[0];

    // Check password (matching plaintext seed behavior)
    if (user.encrypted_password !== password) {
      return NextResponse.json({ error: 'Mật khẩu không chính xác' }, { status: 401 });
    }

    // Determine role
    const role = email === 'admin@example.com' ? 'admin' : 'merchant';
    let merchantId = null;

    if (role === 'merchant') {
      const merchants = await sql`
        SELECT id FROM public.merchants
        WHERE user_id = ${user.id} AND deleted_at IS NULL
      `;
      if (merchants.length > 0) {
        merchantId = merchants[0].id;
      }
    }

    // Set session cookie
    const sessionData = {
      userId: user.id,
      email: user.email,
      role,
      merchantId,
    };

    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: (error as Error).message|| 'Lỗi hệ thống' }, { status: 500  });
  }
}
