import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { productService } from '@/lib/services';

// Get session helper
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
    const session = await getSession();
    if (!session || session.role !== 'merchant' || !session.merchantId) {
      return NextResponse.json({ error: 'Không được phép truy cập' }, { status: 403 });
    }

    const { name, slug, price, original_price, category, description } = await request.json();

    // Validations
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Tên sản phẩm không được để trống' }, { status: 400 });
    }
    if (!slug || slug.trim() === '') {
      return NextResponse.json({ error: 'Slug sản phẩm không được để trống' }, { status: 400 });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json({ error: 'Giá phải lớn hơn 0', field: 'price' }, { status: 400 });
    }

    if (!description || description.trim().length < 10) {
      return NextResponse.json({ error: 'Mô tả sản phẩm phải từ 10 ký tự trở lên', field: 'desc' }, { status: 400 });
    }

    // Call service to create product
    const product = await productService.createProduct({
      merchant_id: session.merchantId,
      name: name.trim(),
      slug: slug.trim(),
      price: numericPrice,
      original_price: original_price ? Number(original_price) : null,
      category: category || null,
      description: description.trim(),
      is_auto_listed: true,
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: (error as Error).message|| 'Lỗi hệ thống' }, { status: 500  });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'merchant' || !session.merchantId) {
      return NextResponse.json({ error: 'Không được phép truy cập' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    if (!idStr) {
      return NextResponse.json({ error: 'Thiếu ID sản phẩm' }, { status: 400 });
    }

    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID sản phẩm không hợp lệ' }, { status: 400 });
    }

    // Validate ownership
    const product = await productService.getProductById(id);
    if (product.merchant_id !== session.merchantId) {
      return NextResponse.json({ error: 'Không có quyền xóa sản phẩm này' }, { status: 403 });
    }

    await productService.deleteProduct(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: (error as Error).message|| 'Lỗi hệ thống' }, { status: 500  });
  }
}
