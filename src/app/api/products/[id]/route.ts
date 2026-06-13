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

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    // Chỉ merchant hoặc admin mới được cập nhật sản phẩm
    if (!session || (session.role !== 'merchant' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'Không được phép truy cập' }, { status: 403 });
    }

    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID sản phẩm không hợp lệ' }, { status: 400 });
    }

    // Kiểm tra quyền sở hữu — merchant chỉ được sửa sản phẩm của mình
    const existingProduct = await productService.getProductById(id);
    if (session.role === 'merchant' && existingProduct.merchant_id !== session.merchantId) {
      return NextResponse.json({ error: 'Không có quyền chỉnh sửa sản phẩm này' }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, price, original_price, category, description, meta_description, image_url } = body;

    // Validations
    if (name !== undefined && (!name || name.trim() === '')) {
      return NextResponse.json({ error: 'Tên sản phẩm không được để trống' }, { status: 400 });
    }

    if (slug !== undefined && (!slug || slug.trim() === '')) {
      return NextResponse.json({ error: 'Slug sản phẩm không được để trống' }, { status: 400 });
    }

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        return NextResponse.json({ error: 'Giá phải lớn hơn 0', field: 'price' }, { status: 400 });
      }
    }

    if (description !== undefined && description.trim().length < 10) {
      return NextResponse.json({ error: 'Mô tả sản phẩm phải từ 10 ký tự trở lên', field: 'desc' }, { status: 400 });
    }

    if (meta_description !== undefined && meta_description !== null && meta_description.trim().length > 160) {
      return NextResponse.json({ error: 'Meta description không được vượt quá 160 ký tự', field: 'meta_description' }, { status: 400 });
    }

    // Gọi service update
    const updateInput: Record<string, unknown> = {};
    if (name !== undefined) updateInput.name = name.trim();
    if (slug !== undefined) updateInput.slug = slug.trim();
    if (price !== undefined) updateInput.price = Number(price);
    if (original_price !== undefined) updateInput.original_price = original_price ? Number(original_price) : null;
    if (category !== undefined) updateInput.category = category || null;
    if (description !== undefined) updateInput.description = description.trim();
    if (meta_description !== undefined) updateInput.meta_description = meta_description ? meta_description.trim() : null;
    if (image_url !== undefined) updateInput.image_url = image_url ? image_url.trim() : null;

    const product = await productService.updateProduct(id, updateInput);

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Lỗi hệ thống' }, { status: 500 });
  }
}
