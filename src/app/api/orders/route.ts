import { NextResponse } from 'next/server';
import { orderService } from '@/lib/services';
import { cookies } from 'next/headers';

// Helper to get session
async function getSession() {
  const cookieStore = await cookies();
  const sessionStr = cookieStore.get('session')?.value;
  if (!sessionStr) return null;
  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      merchant_id, 
      product_id, 
      quantity, 
      unit_price, 
      buyer_name, 
      buyer_phone, 
      buyer_address, 
      payment_method,
      notes
    } = body;

    if (!merchant_id || !product_id || !quantity || !unit_price || !buyer_name || !buyer_phone || !buyer_address) {
      return NextResponse.json({ error: 'Thiếu thông tin đặt hàng bắt buộc' }, { status: 400 });
    }

    if (payment_method !== 'cod') {
      return NextResponse.json({ error: 'Chỉ hỗ trợ phương thức thanh toán COD' }, { status: 400 });
    }

    // Tạo đơn hàng thông qua OrderService
    const order = await orderService.createOrder({
      merchant_id: Number(merchant_id),
      status: 'pending',
      buyer_name,
      buyer_phone,
      buyer_address,
      payment_method,
      notes: notes || null,
      items: [
        {
          product_id: Number(product_id),
          quantity: Number(quantity),
          unit_price: Number(unit_price),
        }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      message: 'Đặt hàng thành công!' 
    });
  } catch (error: unknown) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    const message = error instanceof Error ? error.message : 'Lỗi hệ thống khi tạo đơn hàng';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'merchant' || !session.merchantId) {
      return NextResponse.json({ error: 'Không được phép truy cập' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Thiếu ID đơn hàng hoặc trạng thái mới' }, { status: 400 });
    }

    // Validate ownership
    const order = await orderService.getOrderById(Number(id));
    if (order.merchant_id !== session.merchantId) {
      return NextResponse.json({ error: 'Không có quyền cập nhật đơn hàng này' }, { status: 403 });
    }

    // Update status
    const updated = await orderService.updateOrderStatus(Number(id), status);

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Lỗi khi cập nhật đơn hàng:', error);
    return NextResponse.json({ error: (error as Error).message|| 'Lỗi hệ thống' }, { status: 500  });
  }
}
