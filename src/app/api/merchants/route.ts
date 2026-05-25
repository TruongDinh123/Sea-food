import { NextRequest, NextResponse } from 'next/server';
import { MerchantService } from '@/lib/services/merchant.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    if (isNaN(page) || page <= 0) {
      return NextResponse.json(
        { error: 'Tham số "page" phải là số nguyên dương.' },
        { status: 400 }
      )
    }

    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json(
        { error: 'Tham số "limit" phải là số nguyên dương.' },
        { status: 400 }
      )
    }

    const result = await MerchantService.getPublicMerchants(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[API Merchants GET Error]:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi máy chủ nội bộ khi lấy danh sách vựa hải sản.' },
      { status: 500 }
    );
  }
}
